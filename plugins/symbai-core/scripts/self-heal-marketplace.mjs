#!/usr/bin/env node
/**
 * Symbai self-updater pentru plugin (marketplace + instalare).
 *
 * DE CE EXISTĂ: auto-update-ul nativ al pluginurilor NU rulează în aplicația
 * desktop — procesul e pornit cu `DISABLE_AUTOUPDATER=1` (fără
 * `FORCE_AUTOUPDATE_PLUGINS=1`), deci Claude Code nu împrospătează marketplace-ul
 * și nu upgradează pluginurile la pornire, indiferent de `autoUpdate: true` din
 * settings.json. În plus, chiar și pe CLI, clona de marketplace are moduri tăcute
 * de blocare (nu mai face fetch / divergență). Rezultat istoric: TOȚI clienții
 * rămâneau ÎNGHEȚAȚI pe versiunea instalată inițial.
 *
 * CE FACE (două faze, ambele best-effort):
 *   FAZA 1 — heal clonă: aduce clona de marketplace la zi cu upstream-ul
 *     (fetch → ff; pe divergență cu working tree CURAT → reset --hard).
 *   FAZA 2 — upgrade instalare (partea care lipsea): compară versiunile din
 *     clonă cu `installed_plugins.json`; dacă upstream e mai nou, copiază
 *     pluginul din clonă în `cache/<mkt>/<plugin>/<ver>/` și mută pointerul
 *     din `installed_plugins.json` pe noua versiune. La următoarea pornire
 *     Claude Code încarcă versiunea nouă. Nu depinde de updater-ul nativ.
 *
 * RULARE MANUALĂ (recovery pentru clienți încă înghețați pe versiuni fără hook):
 *   node "<home>/.claude/plugins/marketplaces/symbai/plugins/symbai-core/scripts/self-heal-marketplace.mjs" --force
 *   (merge și fără CLAUDE_PLUGIN_ROOT; --force sare peste throttle)
 *
 * GARANȚII: nu blochează niciodată pornirea (exit 0 mereu), pe stdout scrie DOAR
 * JSON valid de hook, nu șterge cache-uri vechi (rollback manual posibil),
 * păstrează backup `installed_plugins.json.selfupdate-bak` înainte de scriere,
 * throttle o dată / 6h.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const THROTTLE_MS = 6 * 60 * 60 * 1000; // o dată la 6 ore
const MARKETPLACE_NAME = "symbai";
// Repo-ul a fost redenumit symbaimemory → symbaiposmcp; acceptă ambele.
const UPSTREAM_HINT = /symbaimemory|symbaiposmcp/;
const FORCE = process.argv.includes("--force");

const log = (m) => {
  try {
    process.stderr.write(`[symbai-self-update] ${m}\n`);
  } catch {
    /* stderr indisponibil — irelevant */
  }
};

function ok(extra = {}) {
  process.stdout.write(JSON.stringify({ continue: true, ...extra }));
  process.exit(0);
}

function git(cwd, args, timeout = 12000) {
  return execFileSync("git", args, {
    cwd,
    timeout,
    stdio: ["ignore", "pipe", "ignore"],
    encoding: "utf8",
  }).trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Compară două versiuni gen "0.26.0" numeric pe primele 3 componente;
// sufixele de build (+codex..., -beta) sunt ignorate.
function cmpVer(a, b) {
  const parse = (v) =>
    String(v || "0")
      .split(/[.+-]/)
      .slice(0, 3)
      .map((n) => parseInt(n, 10) || 0);
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  }
  return 0;
}

// Copiere recursivă cu fallback pentru Node fără fs.cpSync (<16.7).
function copyDir(src, dest) {
  if (typeof fs.cpSync === "function") {
    fs.cpSync(src, dest, { recursive: true });
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

try {
  // ------------------------------------------------------------------
  // Descoperă rădăcina `~/.claude/plugins` (conține cache/ + marketplaces/).
  // Din hook avem CLAUDE_PLUGIN_ROOT = .../plugins/cache/<mkt>/<plugin>/<ver>;
  // la rulare manuală cădem pe locația standard din home.
  // ------------------------------------------------------------------
  let pluginsRoot = null;
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    let cur = path.resolve(process.env.CLAUDE_PLUGIN_ROOT);
    for (let i = 0; i < 8 && cur; i++) {
      if (fs.existsSync(path.join(cur, "marketplaces", MARKETPLACE_NAME))) {
        pluginsRoot = cur;
        break;
      }
      const parent = path.dirname(cur);
      if (parent === cur) break;
      cur = parent;
    }
  }
  if (!pluginsRoot) {
    const fallback = path.join(os.homedir(), ".claude", "plugins");
    if (fs.existsSync(path.join(fallback, "marketplaces", MARKETPLACE_NAME))) {
      pluginsRoot = fallback;
    }
  }
  if (!pluginsRoot) ok();

  const marketplaceDir = path.join(pluginsRoot, "marketplaces", MARKETPLACE_NAME);
  const manifestFile = path.join(marketplaceDir, ".claude-plugin", "marketplace.json");
  if (!fs.existsSync(manifestFile)) ok();

  // Throttle. NU scriem stamp-ul aici — doar la final, după ce am făcut treaba,
  // ca un eșec parțial (ex. rețea) să nu blocheze retry-ul 6 ore.
  const dataDir = process.env.CLAUDE_PLUGIN_DATA || path.dirname(marketplaceDir);
  const stampFile = path.join(dataDir, `.symbai-self-heal-${MARKETPLACE_NAME}-stamp`);
  if (!FORCE) {
    try {
      const last = Number(fs.readFileSync(stampFile, "utf8").trim());
      if (Number.isFinite(last) && Date.now() - last < THROTTLE_MS) ok();
    } catch {
      /* niciun stamp încă → continuă */
    }
  }
  const stamp = () => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(stampFile, String(Date.now()));
    } catch {
      /* throttle e best-effort */
    }
  };

  // ------------------------------------------------------------------
  // FAZA 1 — heal clonă (best-effort; fără git sau fără rețea → mergem
  // mai departe cu conținutul existent al clonei).
  // ------------------------------------------------------------------
  let cloneHealed = false;
  let headSha = "";
  try {
    if (fs.existsSync(path.join(marketplaceDir, ".git"))) {
      const remote = git(marketplaceDir, ["remote", "get-url", "origin"], 5000);
      if (UPSTREAM_HINT.test(remote)) {
        let branch =
          git(marketplaceDir, ["rev-parse", "--abbrev-ref", "HEAD"], 5000) || "main";
        let detached = false;
        if (branch === "HEAD") {
          branch = "main";
          detached = true;
        }
        if (/^[A-Za-z0-9._\/-]+$/.test(branch)) {
          try {
            git(marketplaceDir, ["fetch", "origin", branch, "--quiet"], 15000);
          } catch {
            log("fetch a eșuat (offline?) — folosesc clona așa cum e");
          }
          const upstreamRef = `origin/${branch}`;
          const head = git(marketplaceDir, ["rev-parse", "HEAD"], 5000);
          let upstream = "";
          try {
            upstream = git(marketplaceDir, ["rev-parse", upstreamRef], 5000);
          } catch {
            /* ref lipsă → nimic de aliniat */
          }
          if (upstream && (head !== upstream || detached)) {
            const dirty = git(marketplaceDir, ["status", "--porcelain"], 5000);
            if (!dirty) {
              try {
                if (detached) {
                  git(marketplaceDir, ["checkout", "-B", branch, upstreamRef], 8000);
                } else {
                  try {
                    git(marketplaceDir, ["merge", "--ff-only", upstreamRef], 8000);
                  } catch {
                    // divergență (commit local / force-push upstream) → realiniere
                    git(marketplaceDir, ["reset", "--hard", upstreamRef], 8000);
                  }
                }
                cloneHealed = true;
                log(`clonă adusă la zi: ${upstream.slice(0, 8)}`);
              } catch {
                log("realinierea clonei a eșuat — continui cu HEAD-ul curent");
              }
            } else {
              log("clonă cu modificări locale — nu o ating");
            }
          }
        }
      }
    }
    try {
      headSha = git(marketplaceDir, ["rev-parse", "HEAD"], 5000);
    } catch {
      /* fără git — lăsăm sha gol */
    }
  } catch {
    log("faza de heal a clonei a sărit (git indisponibil?)");
  }

  // ------------------------------------------------------------------
  // FAZA 2 — upgrade instalare din clonă (nu depinde de updater-ul nativ).
  // ------------------------------------------------------------------
  const installedFile = path.join(pluginsRoot, "installed_plugins.json");
  let installed;
  try {
    installed = readJson(installedFile);
  } catch {
    ok(); // fără instalări → nimic de upgradat
  }
  const manifest = readJson(manifestFile);
  const byName = new Map(
    (Array.isArray(manifest.plugins) ? manifest.plugins : []).map((p) => [p.name, p])
  );

  const upgraded = [];
  let mutated = false;
  for (const [key, entries] of Object.entries(installed.plugins || {})) {
    const m = key.match(/^(.+)@(.+)$/);
    if (!m || m[2] !== MARKETPLACE_NAME) continue;
    const name = m[1];
    const entry = byName.get(name);
    if (!entry || !entry.source) continue;

    // Sursa reală din clonă + versiunea din plugin.json (sursa de adevăr —
    // acoperă și cazul istoric marketplace.json rămas în urmă la bump).
    const srcDir = path.resolve(marketplaceDir, entry.source);
    if (!srcDir.startsWith(path.resolve(marketplaceDir))) continue; // anti path-traversal
    const srcPluginJson = path.join(srcDir, ".claude-plugin", "plugin.json");
    if (!fs.existsSync(srcPluginJson)) continue;
    let newVer;
    try {
      newVer = String(readJson(srcPluginJson).version || "");
    } catch {
      continue;
    }
    if (!/^\d+\.\d+\.\d+/.test(newVer)) continue;

    for (const inst of Array.isArray(entries) ? entries : []) {
      if (cmpVer(newVer, inst.version) <= 0) continue;

      const destDir = path.join(pluginsRoot, "cache", MARKETPLACE_NAME, name, newVer);
      try {
        if (!fs.existsSync(path.join(destDir, ".claude-plugin", "plugin.json"))) {
          // Copiere în folder temporar + rename → nu lăsăm cache pe jumătate scris.
          const tmpDir = `${destDir}.tmp-${process.pid}`;
          fs.rmSync(tmpDir, { recursive: true, force: true });
          copyDir(srcDir, tmpDir);
          fs.rmSync(destDir, { recursive: true, force: true });
          fs.renameSync(tmpDir, destDir);
        }
        const oldVer = inst.version;
        inst.version = newVer;
        inst.installPath = destDir;
        inst.lastUpdated = new Date().toISOString();
        if (headSha) inst.gitCommitSha = headSha;
        mutated = true;
        upgraded.push(`${name} ${oldVer} → ${newVer}`);
        log(`upgrade ${name}: ${oldVer} → ${newVer}`);
      } catch (e) {
        log(`upgrade ${name} eșuat: ${e && e.message}`);
      }
    }
  }

  if (mutated) {
    // Backup + scriere atomică (tmp + rename) — nu corupem fișierul la crash.
    try {
      fs.copyFileSync(installedFile, `${installedFile}.selfupdate-bak`);
    } catch {
      /* backup best-effort */
    }
    const tmpFile = `${installedFile}.tmp-${process.pid}`;
    fs.writeFileSync(tmpFile, JSON.stringify(installed, null, 2));
    fs.renameSync(tmpFile, installedFile);
  }

  stamp();

  if (upgraded.length) {
    ok({
      systemMessage: `Symbai: ${upgraded.join(", ")} — actualizat în fundal; repornește sesiunea ca să folosești versiunea nouă.`,
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: `Pachetul Symbai a fost actualizat în fundal (${upgraded.join(
          ", "
        )}). Versiunea nouă (skill-uri + cunoștințe) se încarcă la următoarea sesiune; sesiunea curentă rulează încă versiunea veche.`,
      },
    });
  }
  if (cloneHealed) {
    ok({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext:
          "Clona de marketplace Symbai a fost re-sincronizată cu upstream; pluginul instalat era deja la ultima versiune.",
      },
    });
  }
  ok();
} catch {
  // Orice eroare neașteptată: tăcut, nu bloca pornirea.
  ok();
}
