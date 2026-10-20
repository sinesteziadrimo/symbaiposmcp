#!/usr/bin/env node
/**
 * La pornirea sau reluarea unei sesiuni Claude Code: dacă sesiunea rulează pe un model fixat mai vechi decât cel
 * mai nou din aceeași gamă (Opus 5 când selectorul oferă Opus 5.5), Claude spune asta omului și îl întreabă dacă
 * trece. Riverside, 20.10.2026: sesiunile de postări ale Siminei rămăseseră pe Opus 5 / Sonnet 5 și nimeni nu știa.
 *
 * Catalogul vine din selectorul oficial al CLI-ului (`initialize`, fără prompt AI, fără MCP și fără hook-uri), ținut
 * minte 12 ore în <config>/symbai/model-catalog.json și reîmprospătat în fundal: pornirea sesiunii nu așteaptă CLI-ul.
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

/** Fundal: citește selectorul oficial și scrie catalogul. Nu atinge sesiunea care l-a pornit. */
async function refresh() {
  const cli = process.env.CLAUDE_CODE_EXECPATH;
  if (!cli || !fs.existsSync(cli)) return;
  const env = { ...process.env };
  for (const name of Object.keys(env)) if (name.startsWith("CLAUDE_CODE_") || name === "CLAUDECODE") delete env[name];
  const child = spawn(cli, ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--strict-mcp-config",
    "--mcp-config", '{"mcpServers":{}}', "--tools", "", "--disable-slash-commands", "--setting-sources", "", "--settings", '{"disableAllHooks":true}',
    "--no-session-persistence"], { cwd: os.homedir(), env, windowsHide: true, stdio: ["pipe", "pipe", "ignore"] });
  let output = "";
  child.stdout.on("data", (chunk) => { if (output.length < 1 << 20) output += chunk; });
  child.stdin.end('{"type":"control_request","request_id":"symbai-models","request":{"subtype":"initialize"}}\n');
  const timer = setTimeout(() => child.kill(), 20000);
  await new Promise((resolve) => child.on("close", resolve).on("error", resolve));
  clearTimeout(timer);
  for (const line of output.split("\n")) {
    let message;
    try { message = JSON.parse(line); } catch { continue; }
    if (message?.type !== "control_response" || message.response?.request_id !== "symbai-models" || message.response?.subtype !== "success") continue;
    const models = (message.response.response?.models ?? []).filter((m) => typeof m?.value === "string" && m.value !== "default")
      .map((m) => ({ value: m.value, displayName: String(m.displayName ?? "") })).slice(0, 80);
    if (models.length) writeJson(catalogFile, { at: Date.now(), models });
    return;
  }
}

function startRefresh() {
  try {
    const lock = fs.statSync(lockFile, { throwIfNoEntry: false });
    if (lock && Date.now() - lock.mtimeMs < REFRESH_LOCK_MS) return;
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(lockFile, String(Date.now()));
    spawn(process.execPath, [fileURLToPath(import.meta.url), "--refresh"], { detached: true, stdio: "ignore", windowsHide: true }).unref();
  } catch { /* fără catalog nou: anunțul rămâne pe cel vechi */ }
}

function announcement(input) {
  const catalog = readJson(catalogFile);
  if (!catalog || !(Date.now() - Number(catalog.at) < CATALOG_TTL_MS)) startRefresh();
  const current = typeof input?.model === "string" ? input.model.trim() : "";
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
  await refresh().catch(() => {});
} else if (isMain()) {
  let text = "";
  try {
    if (!process.stdin.isTTY) for await (const chunk of process.stdin) text += chunk;
    const context = announcement(JSON.parse(text || "{}"));
    process.stdout.write(JSON.stringify(context ? { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } } : { continue: true }));
  } catch {
    process.stdout.write(JSON.stringify({ continue: true }));
  }
}
