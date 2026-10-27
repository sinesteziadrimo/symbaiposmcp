#!/usr/bin/env node
/**
 * La pornirea sau reluarea unei sesiuni Claude Code: dacă sesiunea rulează pe un model fixat mai vechi decât cel
 * mai nou din aceeași gamă (Opus 5 când selectorul oferă Opus 5.5), Claude spune asta omului și îl întreabă dacă
 * trece. Caz real: sesiunile de postări ale unei colege de marketing rămăseseră pe Opus 5 / Sonnet 5 și nimeni nu știa.
 *
 * Catalogul vine din selectorul oficial al CLI-ului (`initialize`, fără prompt AI, fără MCP și fără hook-uri), ținut
 * minte 12 ore în <config>/symbai/model-catalog.json. Catalogul expirat se recitește chiar în hook, cel mult 3 secunde;
 * dacă CLI-ul e mai lent (un PC ocupat a răspuns în 19 s), încă o dată în fundal, pentru sesiunea următoare. Cu
 * reîmprospătarea doar în fundal, un PC avea lacătul scris pe 21.10.2026, dar catalogul niciodată.
 * Sesiunile lungi din aplicație se reiau sau se compactează fără câmpul `model`: îl dă ultimul mesaj al asistentului.
 * Gama = treapta (Opus, Sonnet, Haiku, Fable); versiunea din ID sau, la aliasuri, din eticheta oficială („Opus 5.5”).
 * O sesiune e întrebată o singură dată pe același model nou. Varianta Windows din pachetul Connect: model-freshness.ps1.
 *
 * GARANȚII: exit 0 mereu, pe stdout doar JSON de hook; orice eroare = sesiunea pornește fără anunț.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CATALOG_TTL_MS = 12 * 60 * 60 * 1000;
const REFRESH_LOCK_MS = 10 * 60 * 1000;
const ANNOUNCED_KEEP = 200;
const configDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
const dataDir = path.join(configDir, "symbai");
const catalogFile = path.join(dataDir, "model-catalog.json");
const announcedFile = path.join(dataDir, "model-announced.json");
const lockFile = path.join(dataDir, "model-catalog.refresh");

const readJson = (file) => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; } };
function writeJson(file, value) {
  fs.mkdirSync(dataDir, { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(value));
  fs.renameSync(temporary, file);
}

const TIERS = "(opus|sonnet|haiku|fable)";
const version = (major, minor) => Number(major) * 100 + Number(minor ?? 0);
export function modelFamily(value, label) {
  const raw = String(value ?? "").trim().toLowerCase();
  const context = /\[([a-z0-9]{1,8})\]$/.exec(raw)?.[1] ?? "";
  const id = raw.replace(/\[[a-z0-9]{1,8}\]$/, "");
  let match = new RegExp(`^${TIERS}$`).exec(id);
  if (match) {
    const labelled = /(?:^|\s)(\d+)(?:[.,](\d{1,2}))?(?=\s|$|\))/.exec(String(label ?? "").trim());
    return labelled ? { tier: match[1], version: version(labelled[1], labelled[2]), alias: true, context } : null;
  }
  match = new RegExp(`^claude-${TIERS}-(\\d+)(?:-(\\d{1,2}))?(?:-\\d{8})?$`).exec(id);
  if (match) return { tier: match[1], version: version(match[2], match[3]), alias: false, context };
  match = new RegExp(`^claude-(\\d+)(?:-(\\d{1,2}))?-${TIERS}(?:-\\d{8})?$`).exec(id);
  if (match) return { tier: match[3], version: version(match[1], match[2]), alias: false, context };
  return null;
}
/**
 * Cel mai nou model din aceeași treaptă, numai dacă e strict mai nou. La versiune egală: aceeași variantă de context
 * ca sesiunea (1M rămâne 1M), apoi ID-ul explicit înaintea aliasului.
 */
export function newerModel(current, models) {
  if (!current || !Array.isArray(models)) return null;
  const own = models.find((m) => m?.value === current);
  const family = modelFamily(current, own?.displayName);
  if (!family) return null;
  let best = null, bestFamily = null;
  for (const option of models) {
    if (!option?.value || option.value === current) continue;
    const candidate = modelFamily(option.value, option.displayName);
    if (!candidate || candidate.tier !== family.tier || candidate.version <= family.version) continue;
    let better = !bestFamily || candidate.version > bestFamily.version;
    if (!better && candidate.version === bestFamily.version) {
      const same = candidate.context === family.context, bestSame = bestFamily.context === family.context;
      better = (same && !bestSame) || (same === bestSame && bestFamily.alias && !candidate.alias);
    }
    if (better) { best = option; bestFamily = candidate; }
  }
  return best;
}

/** CLI-ul sesiunii, altfel cel mai nou instalat de aplicația Claude (cum îl caută Symbai Connect). */
function findClaudeCli() {
  const own = process.env.CLAUDE_CODE_EXECPATH;
  if (own && fs.existsSync(own)) return own;
  const roots = [];
  try {
    const packages = path.join(process.env.LOCALAPPDATA || "", "Packages");
    for (const name of fs.readdirSync(packages)) if (name.startsWith("Claude_")) roots.push(path.join(packages, name, "LocalCache", "Roaming", "Claude", "claude-code"));
  } catch { /* nu e aplicația din Store */ }
  if (process.env.APPDATA) roots.push(path.join(process.env.APPDATA, "Claude", "claude-code"));
  let best = null;
  const visit = (dir, depth) => {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && depth < 3) visit(full, depth + 1);
      else if (entry.isFile() && /^claude(\.exe)?$/i.test(entry.name)) {
        const time = fs.statSync(full).mtimeMs;
        if (!best || time > best.time) best = { full, time };
      }
    }
  };
  for (const root of roots) visit(root, 0);
  return best?.full ?? null;
}

/** Citește selectorul oficial și scrie catalogul. `waitMs` plafonează CLI-ul (în hook: 3 s). `true` = catalog scris. */
async function refresh(waitMs = 20000) {
  const cli = findClaudeCli();
  if (!cli) return false;
  const env = { ...process.env };
  for (const name of Object.keys(env)) if (name.startsWith("CLAUDE_CODE_") || name === "CLAUDECODE") delete env[name];
  const child = spawn(cli, ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--strict-mcp-config",
    "--mcp-config", '{"mcpServers":{}}', "--tools", "", "--disable-slash-commands", "--setting-sources", "", "--settings", '{"disableAllHooks":true}',
    "--no-session-persistence"], { cwd: os.homedir(), env, windowsHide: true, stdio: ["pipe", "pipe", "ignore"] });
  // Răspunsul la `initialize` vine în ~1 s, dar CLI-ul (sau copiii lui) poate întârzia secunde bune la închidere:
  // se termină la prima linie de răspuns sau la plafon, apoi CLI-ul se oprește fără să fie așteptat.
  const models = await new Promise((resolve) => {
    let output = "", settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      try { child.kill(); } catch { /* deja oprit */ }
      child.stdout?.destroy(); child.unref();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), waitMs);
    child.stdout.on("data", (chunk) => {
      if (output.length < 1 << 20) output += chunk;
      for (const line of output.split("\n")) {
        let message;
        try { message = JSON.parse(line); } catch { continue; }
        if (message?.type === "control_response" && message.response?.request_id === "symbai-models") {
          finish(message.response?.subtype === "success" ? message.response.response?.models ?? [] : null);
          return;
        }
      }
    });
    child.on("close", () => finish(null)).on("error", () => finish(null));
    child.stdin.on("error", () => { /* CLI oprit înainte de cerere */ });
    child.stdin.end('{"type":"control_request","request_id":"symbai-models","request":{"subtype":"initialize"}}\n');
  });
  const usable = (Array.isArray(models) ? models : []).filter((m) => typeof m?.value === "string" && m.value !== "default")
    .map((m) => ({ value: m.value, displayName: String(m.displayName ?? "") })).slice(0, 80);
  if (!usable.length) return false;
  writeJson(catalogFile, { at: Date.now(), models: usable });
  return true;
}

/** O dată la 12 ore (și cel mult la 10 minute după un eșec): selectorul oficial, citit acum. */
async function refreshNow() {
  try {
    const lock = fs.statSync(lockFile, { throwIfNoEntry: false });
    if (lock && Date.now() - lock.mtimeMs < REFRESH_LOCK_MS) return;
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(lockFile, String(Date.now()));
    if (await refresh(3000)) return;
    // Un PC ocupat a răspuns în 19 s: încă o încercare în fundal, pentru sesiunea următoare.
    spawn(process.execPath, [fileURLToPath(import.meta.url), "--refresh"], { detached: true, stdio: "ignore", windowsHide: true }).unref();
  } catch { /* fără catalog nou: anunțul rămâne pe cel vechi */ }
}

/** Modelul ultimului mesaj al asistentului din transcriere (ultimii 256 KB). */
export function transcriptModel(file) {
  try {
    if (!file) return "";
    const handle = fs.openSync(file, "r");
    try {
      const size = fs.fstatSync(handle).size, length = Math.min(size, 262144);
      const buffer = Buffer.alloc(length);
      fs.readSync(handle, buffer, 0, length, size - length);
      const found = [...buffer.toString("utf8").matchAll(/"model":"(claude-[a-z0-9.\-]+(?:\[[a-z0-9]{1,8}\])?)","id":"msg_/g)];
      return found.length ? found[found.length - 1][1] : "";
    } finally { fs.closeSync(handle); }
  } catch { return ""; }
}

async function announcement(input) {
  let catalog = readJson(catalogFile);
  if (!catalog || !(Date.now() - Number(catalog.at) < CATALOG_TTL_MS)) { await refreshNow(); catalog = readJson(catalogFile) ?? catalog; }
  const current = (typeof input?.model === "string" ? input.model.trim() : "") || transcriptModel(input?.transcript_path);
  const models = Array.isArray(catalog?.models) ? catalog.models : [];
  const better = newerModel(current, models);
  if (!better) return null;
  const session = String(input?.session_id ?? "");
  const announced = readJson(announcedFile) ?? {};
  if (session && announced[session] === better.value) return null;
  if (session) {
    delete announced[session];
    announced[session] = better.value;
    const keys = Object.keys(announced);
    for (const key of keys.slice(0, Math.max(0, keys.length - ANNOUNCED_KEEP))) delete announced[key];
    writeJson(announcedFile, announced);
  }
  // `claude-opus-5[1m]` lipsește de obicei din selector: eticheta modelului de bază, cu „1M”.
  const base = current.replace(/\[[a-z0-9]{1,8}\]$/i, "");
  const own = models.find((m) => m.value === current) ?? models.find((m) => m.value === base);
  const label = own?.displayName ? (own.value === current ? own.displayName : `${own.displayName} ${current.slice(base.length + 1, -1).toUpperCase()}`) : current;
  const template = fs.readFileSync(new URL("../knowledge/model-nou.md", import.meta.url), "utf8");
  const values = { current: label, currentId: current, newer: better.displayName || better.value, newerId: better.value };
  return template.replace(/\{(current|currentId|newer|newerId)\}/g, (_, key) => values[key]);
}

// Node pune în import.meta.url calea reală: o rădăcină de plugin prin junction/symlink nu trebuie să lase stdout gol.
function isMain() {
  try { return !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
}

if (process.argv.includes("--refresh")) {
  await refresh(30000).catch(() => false);
} else if (isMain()) {
  let text = "";
  try {
    if (!process.stdin.isTTY) for await (const chunk of process.stdin) text += chunk;
    const context = await announcement(JSON.parse(text || "{}"));
    process.stdout.write(JSON.stringify(context ? { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } } : { continue: true }));
  } catch {
    process.stdout.write(JSON.stringify({ continue: true }));
  }
}
