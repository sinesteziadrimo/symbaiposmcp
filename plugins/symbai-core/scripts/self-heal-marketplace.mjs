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
 *   (merge și fără CLAUDE_PLUGIN_ROOT; --force sare throttle-ul, primește buget
 *   de timp larg și are voie să curețe o clonă murdară — e rulare supravegheată)
 *
 * GARANȚII: nu blochează niciodată pornirea (exit 0 mereu), pe stdout scrie DOAR
 * JSON valid de hook; lock inter-proces (două sesiuni pornite simultan nu se
 * calcă); deadline intern sub timeout-ul hook-ului; nu instalează dintr-o clonă
 * cu working tree murdar (arbori „amestecați" după un heal întrerupt) — iar
 * debris-ul propriilor heal-uri întrerupte e recunoscut printr-un marker
 * inflight și curățat singur la rularea următoare; nu șterge cache-uri vechi
 * (rollback manual posibil); backup `installed_plugins.json.selfupdate-bak`
 * înainte de scriere; throttle o dată / 6h marcat DEVREME (o stare de eșec
 * persistentă nu transformă hook-ul în cost per-sesiune).
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
// Buget de timp propriu, sub timeout-ul de 20s al hook-ului. Rularea manuală
// (--force) nu are timeout extern și e supravegheată → buget larg, altfel
// recovery-ul s-ar termina pe jumătate pe mașini lente.
const DEADLINE = Date.now() + (FORCE ? 10 * 60 * 1000 : 14000);
const timeLeft = () => DEADLINE - Date.now();

const log = (m) => {
  try {
    process.stderr.write(`[symbai-self-update] ${m}\n`);
  } catch {
    /* stderr indisponibil — irelevant */
  }
};

// Lock inter-proces (setat în main). ok() îl eliberează înainte de exit —
// process.exit NU rulează finally-uri, deci curățarea stă aici. Nonce-ul de
// proprietar previne ștergerea lock-ului altcuiva după un takeover concurent.
let heldLockDir = null;
let lockNonce = null;
let exiting = false;

function ok(extra = {}) {
  if (exiting) process.exit(0); // reintrare din catch după un write eșuat
  exiting = true;
  if (heldLockDir) {
    try {
      const owner = fs.readFileSync(path.join(heldLockDir, "owner"), "utf8");
      if (owner === lockNonce) fs.rmSync(heldLockDir, { recursive: true, force: true });
    } catch {
      /* rămâne lock stale — preluat pe mtime la o rulare viitoare */
    }
    heldLockDir = null;
  }
  try {
    process.stdout.write(JSON.stringify({ continue: true, ...extra }));
  } catch {
    /* părinte dispărut (EPIPE) — nu mai are cine citi */
  }
  process.exit(0);
}

function git(cwd, args, timeout = 8000) {
  return execFileSync("git", args, {
    cwd,
    timeout,
    stdio: ["ignore", "pipe", "ignore"],
    encoding: "utf8",
  }).trim();
}

const isGitMissing = (e) => !!(e && e.code === "ENOENT"); // binarul git nu există

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

// Șterge o intrare (fișier/dir) doar dacă e mai veche decât maxAgeMs (mtime).
// mtime-urile din viitor (ceas dat înapoi) sunt tratate tot ca stale — altfel
// un lock/index.lock orfan datat „în viitor" n-ar mai fi curățat niciodată.
function rmIfStale(p, maxAgeMs) {
  try {
    const st = fs.statSync(p);
    const age = Date.now() - st.mtimeMs;
    if (age > maxAgeMs || age < -60 * 1000) {
      fs.rmSync(p, { recursive: true, force: true });
      return true;
    }
  } catch {
    /* deja dispărut / ilizibil */
  }
  return false;
}

// Heartbeat pe lock: o rulare legitim lungă (--force pe mașină lentă) își
// împrospătează mtime-ul la granițele de fază ca să nu pară stale.
function touchLock() {
  if (!heldLockDir) return;
  try {
    const now = new Date();
    fs.utimesSync(heldLockDir, now, now);
  } catch {
    /* best-effort */
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
  // dataDir găzduiește lock-ul + stamp-ul + markerul inflight. Cheiat EXCLUSIV
  // pe resursa protejată (folderul marketplace-urilor), NU pe contextul de
  // execuție: hook-ul primește CLAUDE_PLUGIN_DATA, rularea manuală de recovery
  // nu — dacă am folosi env-ul, cele două contexte ar avea lock/stamp/marker
  // în foldere diferite și nu s-ar exclude/recunoaște reciproc.
  const dataDir = path.dirname(marketplaceDir);
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch {
    /* dacă chiar nu se poate crea, lock-ul de mai jos va ieși curat */
  }

  // Throttle — verificat read-only ÎNAINTE de lock: 99% din porniri ies aici
  // fără să atingă lock-ul. Stamp-urile din viitor (ceas dat înapoi) sunt
  // tratate ca invalide, altfel throttle-ul ar ține până „ajunge" ceasul.
  const stampFile = path.join(dataDir, `.symbai-self-heal-${MARKETPLACE_NAME}-stamp`);
  if (!FORCE) {
    try {
      const last = Number(fs.readFileSync(stampFile, "utf8").trim());
      const delta = Date.now() - last;
      if (Number.isFinite(last) && delta >= 0 && delta < THROTTLE_MS) ok();
    } catch {
      /* niciun stamp încă → continuă */
    }
  }

  // Lock inter-proces: două sesiuni pornite simultan ar rula fluxul în paralel
  // (git-uri concurente pe aceeași clonă, copieri peste același cache, RMW
  // concurent pe installed_plugins.json). mkdir e atomic; un lock rămas de la
  // un proces omorât e preluat după 2 min — prin rename (atomic, un singur
  // câștigător chiar dacă două procese văd simultan lock-ul ca stale).
  // Pragul de takeover (12 min) depășește bugetul --force (10 min): o rulare
  // legitimă, chiar lungă, nu poate fi furată cât timp face heartbeat.
  const LOCK_STALE_MS = 12 * 60 * 1000;
  const lockDir = path.join(dataDir, `.symbai-self-update-${MARKETPLACE_NAME}.lock`);
  const claimLock = () => {
    fs.mkdirSync(lockDir);
    heldLockDir = lockDir;
    lockNonce = `${process.pid}-${Date.now()}`;
    try {
      fs.writeFileSync(path.join(lockDir, "owner"), lockNonce);
    } catch {
      /* fără owner scris, ok() nu-l va putea șterge — devine stale, acceptabil */
    }
  };
  try {
    claimLock();
  } catch {
    let tookOver = false;
    try {
      // Curăță graveyard-uri rămase de la takeover-uri întrerupte.
      for (const sib of fs.readdirSync(dataDir)) {
        if (sib.includes(".lock.stale-")) rmIfStale(path.join(dataDir, sib), 60 * 60 * 1000);
      }
      const st = fs.statSync(lockDir);
      const age = Date.now() - st.mtimeMs;
      // mtime în viitor (ceas dat înapoi) = tot stale, altfel lock etern.
      if (age > LOCK_STALE_MS || age < -60 * 1000) {
        const graveyard = `${lockDir}.stale-${process.pid}`;
        fs.renameSync(lockDir, graveyard); // doar un proces reușește rename-ul
        fs.rmSync(graveyard, { recursive: true, force: true });
        tookOver = true;
      }
    } catch {
      /* altcineva a câștigat rename-ul sau lock-ul a dispărut */
    }
    if (!tookOver) {
      log("altă rulare de self-update e în curs — ies");
      ok();
    }
    try {
      claimLock();
    } catch {
      ok();
    }
  }

  // Stamp-ul se scrie DEVREME (sub lock), nu la final: orice stare de eșec
  // persistentă de mai jos (fișier corupt, clonă blocată) nu are voie să
  // transforme hook-ul în fetch-la-fiecare-sesiune. Costul: un eșec transient
  // (offline) se reîncearcă abia peste 6h — asumat.
  try {
    fs.writeFileSync(stampFile, String(Date.now()));
  } catch {
    /* throttle e best-effort */
  }

  // ------------------------------------------------------------------
  // FAZA 1 — heal clonă (best-effort; fără git sau fără rețea → mergem
  // mai departe cu conținutul existent al clonei).
  // ------------------------------------------------------------------
  // Marker scris înainte de orice operație git mutantă: dacă procesul e omorât
  // în mijlocul unui merge/reset (tree rămas „pe jumătate scris"), rularea
  // următoare recunoaște debris-ul ca fiind AL EI și are voie să-l curețe cu
  // reset --hard — altfel clona ar rămâne murdară (deci înghețată) pe veci.
  const inflightFile = path.join(dataDir, `.symbai-heal-inflight-${MARKETPLACE_NAME}`);
  let cloneHealed = false;
  let cloneDirty = false;
  let gitMissing = false;
  let headSha = "";

  if (fs.existsSync(path.join(marketplaceDir, ".git"))) {
    // Un git omorât mai demult lasă index.lock orfan care blochează orice
    // operație ulterioară; îl curățăm doar dacă e clar stale (>10 min).
    rmIfStale(path.join(marketplaceDir, ".git", "index.lock"), 10 * 60 * 1000);

    let remoteOk = false;
    try {
      remoteOk = UPSTREAM_HINT.test(
        git(marketplaceDir, ["remote", "get-url", "origin"], 5000)
      );
    } catch (e) {
      if (isGitMissing(e)) gitMissing = true;
      else cloneDirty = true; // git există dar nu răspunde → nu instalăm din clonă
    }

    // Pas 0 — recovery de debris propriu, INDEPENDENT de starea ref-urilor
    // (un heal omorât după mutarea ref-ului lasă tree murdar cu head==upstream).
    if (remoteOk) {
      try {
        const dirty0 = git(
          marketplaceDir,
          ["status", "--porcelain", "--untracked-files=no"],
          5000
        );
        if (dirty0 && (fs.existsSync(inflightFile) || FORCE)) {
          git(marketplaceDir, ["reset", "--hard", "HEAD"], 8000);
          log(
            FORCE && !fs.existsSync(inflightFile)
              ? "clonă murdară curățată la cererea --force"
              : "debris de la un heal întrerupt — curățat"
          );
        }
        if (!git(marketplaceDir, ["status", "--porcelain", "--untracked-files=no"], 5000)) {
          try {
            fs.rmSync(inflightFile, { force: true });
          } catch {
            /* marker best-effort */
          }
        }
      } catch (e) {
        if (isGitMissing(e)) gitMissing = true;
        else cloneDirty = true;
      }
    }

    // Pas 1 — heal propriu-zis (fetch + realiniere la upstream).
    if (remoteOk && !gitMissing && !cloneDirty) {
      try {
        let branch =
          git(marketplaceDir, ["rev-parse", "--abbrev-ref", "HEAD"], 5000) || "main";
        let detached = false;
        if (branch === "HEAD") {
          branch = "main";
          detached = true;
        }
        if (/^[A-Za-z0-9._\/-]+$/.test(branch)) {
          if (timeLeft() > 9000) {
            try {
              git(marketplaceDir, ["fetch", "origin", branch, "--quiet"], 8000);
            } catch {
              log("fetch a eșuat (offline?) — folosesc clona așa cum e");
            }
          } else {
            log("fără timp pentru fetch — folosesc clona așa cum e");
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
            // Fișierele untracked (ex. .DS_Store) nu blochează heal-ul —
            // altfel un singur asemenea fișier îngheța clona pe veci.
            const dirty = git(
              marketplaceDir,
              ["status", "--porcelain", "--untracked-files=no"],
              5000
            );
            if (!dirty && timeLeft() > 4000) {
              // Mutația pornește DOAR cu markerul persistat: fără el, un kill
              // în mijlocul merge-ului ar lăsa debris pe care nicio rulare
              // viitoare nu l-ar mai recunoaște ca al nostru (dirty forever).
              let markerOk = false;
              try {
                fs.writeFileSync(inflightFile, upstream);
                markerOk = true;
              } catch {
                log("nu pot persista markerul inflight — sar realinierea");
              }
              try {
                if (!markerOk) throw new Error("inflight marker unavailable");
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
                try {
                  fs.rmSync(inflightFile, { force: true });
                } catch {
                  /* best-effort */
                }
              } catch {
                // inflight rămâne pe disc → rularea următoare curăță debris-ul
                log("realinierea clonei a eșuat — reiau la rularea următoare");
              }
            } else if (dirty) {
              log("clonă cu modificări locale — nu o ating");
            }
          }
        }
      } catch (e) {
        if (isGitMissing(e)) gitMissing = true;
        else cloneDirty = true;
      }
    }

    // Gate de integritate pentru FAZA 2 — calculat în propriul try, ca nicio
    // excepție de mai sus să nu-l poată sări: dacă working tree-ul diferă de
    // HEAD, NU instalăm din el (am pecetlui în cache un plugin „amestecat"
    // cu numărul versiunii noi). Fail-CLOSED: orice eroare git (alta decât
    // binar absent) → tratăm clona ca murdară.
    if (!gitMissing && !cloneDirty) {
      try {
        headSha = git(marketplaceDir, ["rev-parse", "HEAD"], 5000);
        cloneDirty = !!git(
          marketplaceDir,
          ["status", "--porcelain", "--untracked-files=no"],
          5000
        );
      } catch (e) {
        if (isGitMissing(e)) gitMissing = true;
        else cloneDirty = true;
      }
    }
    // gitMissing (binar absent dintotdeauna) → clona e statică (nimeni n-o
    // poate lăsa „pe jumătate scrisă") → sigur de copiat, cloneDirty = false.
    // Excepție: un marker inflight rămas dovedește un heal întrerupt pe
    // vremea când git EXISTA → tree-ul poate fi amestecat → fail-closed.
    if (gitMissing && fs.existsSync(inflightFile)) cloneDirty = true;
  }
  touchLock(); // FAZA 1 (potențial lungă sub --force) s-a încheiat

  // Manifestul se citește DUPĂ heal — un reset reușit tocmai l-a putut restaura.
  const manifestFile = path.join(marketplaceDir, ".claude-plugin", "marketplace.json");
  if (!fs.existsSync(manifestFile)) ok();

  // ------------------------------------------------------------------
  // FAZA 2 — upgrade instalare din clonă (nu depinde de updater-ul nativ).
  // ------------------------------------------------------------------
  const installedFile = path.join(pluginsRoot, "installed_plugins.json");
  let installed;
  try {
    installed = readJson(installedFile);
  } catch {
    ok(); // fără instalări (sau fișier ilizibil) → nu scriem nimic
  }
  let manifest;
  try {
    manifest = readJson(manifestFile);
  } catch {
    ok(); // manifest corupt (clonă degradată) → heal-ul de la rularea viitoare îl reface
  }
  const byName = new Map(
    (Array.isArray(manifest.plugins) ? manifest.plugins : []).map((p) => [p.name, p])
  );

  if (cloneDirty) {
    log("clonă cu diferențe față de HEAD — sar peste instalare (sursă nesigură)");
  }

  // Țintele upgradate: cache-ul se copiază acum, pointerul se scrie la final
  // printr-un re-read proaspăt (alt proces poate scrie fișierul între timp).
  const pending = [];
  const upgraded = [];
  for (const [key, entries] of Object.entries(
    (installed && installed.plugins) || {}
  )) {
    if (cloneDirty) break;
    const m = key.match(/^(.+)@(.+)$/);
    if (!m || m[2] !== MARKETPLACE_NAME) continue;
    const name = m[1];
    if (!/^[A-Za-z0-9._-]+$/.test(name)) continue; // numele intră în path-ul de cache
    const entry = byName.get(name);
    if (!entry || typeof entry.source !== "string") continue;

    // Sursa reală din clonă + versiunea din plugin.json (sursa de adevăr —
    // acoperă și cazul istoric marketplace.json rămas în urmă la bump).
    const srcDir = path.resolve(marketplaceDir, entry.source);
    if (!srcDir.startsWith(path.resolve(marketplaceDir) + path.sep)) continue; // anti path-traversal
    const srcPluginJson = path.join(srcDir, ".claude-plugin", "plugin.json");
    if (!fs.existsSync(srcPluginJson)) continue;
    let newVer;
    try {
      newVer = String(readJson(srcPluginJson).version || "");
    } catch {
      continue;
    }
    // Versiunea intră în path-ul de cache — doar semver simplu, fără separatori.
    if (!/^\d+\.\d+\.\d+(?:[+-][A-Za-z0-9.]+)?$/.test(newVer)) continue;

    for (let idx = 0; idx < (Array.isArray(entries) ? entries.length : 0); idx++) {
      const inst = entries[idx];
      if (!inst || cmpVer(newVer, inst.version) <= 0) continue;
      if (timeLeft() < 3000) {
        log("fără timp pentru copiere — reiau la rularea următoare");
        break;
      }

      touchLock(); // urmează o copiere potențial lungă — nu părem stale
      const cacheDir = path.join(pluginsRoot, "cache", MARKETPLACE_NAME, name);
      const destDir = path.join(cacheDir, newVer);
      try {
        // Curăță tmp-uri orfane de la rulări omorâte (sunt per-PID, nimeni
        // altcineva nu le mai șterge).
        try {
          for (const sib of fs.readdirSync(cacheDir)) {
            if (sib.includes(".tmp-")) rmIfStale(path.join(cacheDir, sib), 60 * 60 * 1000);
          }
        } catch {
          /* cacheDir poate lipsi la prima instalare */
        }

        if (!fs.existsSync(path.join(destDir, ".claude-plugin", "plugin.json"))) {
          // Copiere în folder temporar + rename → nu lăsăm cache pe jumătate scris.
          const tmpDir = `${destDir}.tmp-${process.pid}`;
          fs.rmSync(tmpDir, { recursive: true, force: true });
          copyDir(srcDir, tmpDir);
          fs.rmSync(destDir, { recursive: true, force: true });
          fs.renameSync(tmpDir, destDir);
        }
        pending.push({
          key,
          idx,
          scope: inst.scope,
          oldVer: inst.version,
          newVer,
          installPath: destDir,
          lastUpdated: new Date().toISOString(),
          gitCommitSha: headSha || null,
        });
        upgraded.push(`${name} ${inst.version} → ${newVer}`);
        log(`upgrade ${name}: ${inst.version} → ${newVer}`);
      } catch (e) {
        log(`upgrade ${name} eșuat: ${e && e.message}`);
      }
    }
  }

  if (pending.length) {
    // Pointerul se scrie dintr-un re-read PROASPĂT, modificând DOAR țintele
    // noastre (potrivite pe scope, nu pe index): între citirea inițială și
    // acest punct trec secunde (copieri de foldere) în care Claude Code
    // însuși poate scrie în fișier (ex. userul instalează alt plugin în altă
    // fereastră) — un snapshot vechi rescris integral i-ar șterge scrierea.
    let wrote = false;
    try {
      let fresh = null;
      try {
        fresh = readJson(installedFile);
      } catch {
        fresh = null; // dispărut/corupt între timp → nu-l rescriem din snapshot
      }
      if (fresh && fresh.plugins) {
        let applied = false;
        for (const t of pending) {
          const arr = fresh.plugins[t.key];
          if (!Array.isArray(arr)) continue;
          // Identificăm ținta pe scope + versiunea veche (două intrări fără
          // scope pe aceeași cheie nu se mai calcă); fallback pe index.
          const tgt =
            arr.find(
              (e) => e && e.scope === t.scope && String(e.version) === String(t.oldVer)
            ) ||
            arr.find((e) => e && e.scope === t.scope) ||
            (arr[t.idx] && typeof arr[t.idx] === "object" ? arr[t.idx] : null);
          if (!tgt) continue;
          if (cmpVer(t.newVer, tgt.version) <= 0) continue; // altcineva a upgradat deja
          tgt.version = t.newVer;
          tgt.installPath = t.installPath;
          tgt.lastUpdated = t.lastUpdated;
          if (t.gitCommitSha) tgt.gitCommitSha = t.gitCommitSha;
          applied = true;
        }
        if (applied) {
          // Backup + scriere atomică (tmp + rename) — nu corupem fișierul la crash.
          try {
            for (const sib of fs.readdirSync(pluginsRoot)) {
              if (sib.startsWith("installed_plugins.json.tmp-"))
                rmIfStale(path.join(pluginsRoot, sib), 60 * 60 * 1000);
            }
          } catch {
            /* sweep best-effort */
          }
          try {
            fs.copyFileSync(installedFile, `${installedFile}.selfupdate-bak`);
          } catch {
            /* backup best-effort */
          }
          const tmpFile = `${installedFile}.tmp-${process.pid}`;
          fs.writeFileSync(tmpFile, JSON.stringify(fresh, null, 2));
          fs.renameSync(tmpFile, installedFile);
          wrote = true;
        }
      }
    } catch (e) {
      log(`scrierea installed_plugins.json a eșuat: ${e && e.message}`);
      wrote = false;
    }
    // Nu raportăm un upgrade care nu s-a persistat (mesajul ar minți userul).
    if (!wrote) upgraded.length = 0;
  }

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
