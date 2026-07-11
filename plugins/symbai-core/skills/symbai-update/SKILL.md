---
name: symbai-update
description: Actualizează (sau pornește auto-actualizarea) cunoștințelor și skill-urilor Symbai. Folosește când utilizatorul scrie /symbai-core:symbai-update sau cere „actualizează skill-urile Symbai" / „ia ultimele cunoștințe Symbai" / „de ce nu se actualizează singur pluginul" / „cum activez auto-update".
---

# Actualizează pachetul Symbai (`symbai-core`)

Pluginul `symbai-core` (skill-urile + folderul `knowledge/`) e descărcat din GitHub (marketplace `symbai`, repo `sinesteziadrimo/symbaimemory`). Claude Code îl ține într-un folder **fixat pe versiune** (`~/.claude/plugins/cache/symbai/symbai-core/<versiune>/`), iar pointerul versiunii instalate stă în `~/.claude/plugins/installed_plugins.json`.

> ⚠️ Notă pentru asistent — cum se actualizează REAL pluginul:
> - **Auto-update-ul nativ al Claude Code NU rulează în aplicația desktop** — procesul e pornit cu `DISABLE_AUTOUPDATER=1` (fără `FORCE_AUTOUPDATE_PLUGINS=1`), deci flag-ul `autoUpdate: true` din settings.json e ignorat acolo. Pe CLI nativul poate rula, dar nu te baza pe el.
> - **Mecanismul pe care ne bazăm e hook-ul de self-update din plugin** (`SessionStart` → `scripts/self-heal-marketplace.mjs`, v0.27.0+): la pornirea sesiunii aduce clona de marketplace la zi (fetch → ff; pe divergență cu tree curat → reset) și, dacă upstream-ul are versiune mai nouă, **face singur upgrade-ul**: copiază pluginul în `cache/<ver>/` și mută pointerul din `installed_plugins.json`. Versiunea nouă se încarcă la următoarea sesiune. Nu depinde de updater-ul nativ.
> - Versiunile ≤0.21.x nu au niciun hook; 0.22.x–0.26.x au hook care repară DOAR clona (nu și instalarea). Clienții pe aceste versiuni sunt „înghețați" până la un singur pas manual (Pasul 0) — după el, self-update-ul complet rămâne activ pe veci.
> - Folderul de cache NU e repo git — `git pull` în el nu face nimic. Clona git e `.../plugins/marketplaces/symbai/`.

## 0. Recovery — client înghețat pe o versiune veche (o singură dată)

Rulează în terminal/Bash pe mașina clientului (Windows: în Git Bash sau adaptează path-urile):

```bash
MK="$HOME/.claude/plugins/marketplaces/symbai"
git -C "$MK" fetch origin -q
git -C "$MK" merge --ff-only origin/main   # aduce clona (inclusiv scriptul nou) la zi
node "$MK/plugins/symbai-core/scripts/self-heal-marketplace.mjs" --force
```

Scriptul afișează pe stderr ce a făcut (ex. `upgrade symbai-core: 0.21.4 → 0.27.0`). Apoi **repornește** aplicația/sesiunea — versiunea nouă se încarcă la pornire. Din acel moment hook-ul rulează automat la fiecare sesiune și clientul nu mai rămâne în urmă niciodată.

Dacă `merge --ff-only` eșuează (clonă divergentă):
- `git -C "$MK" status --porcelain` **gol** → e sigur: `git -C "$MK" reset --hard origin/main`, apoi reia scriptul.
- are modificări locale → NU șterge nimic; întreabă userul (pot fi editări intenționate).

Dacă `node` nu există pe mașină: instalează Node.js LTS sau fă manual echivalentul (copiază `$MK/plugins/symbai-core` în `~/.claude/plugins/cache/symbai/symbai-core/<versiunea din plugin.json>/` și schimbă `version` + `installPath` în `~/.claude/plugins/installed_plugins.json` la intrarea `symbai-core@symbai`; păstrează restul câmpurilor).

## 1. Instalarea corectă (pentru mașini noi)

`settings.json` din folderul Claude al utilizatorului (Windows: `C:\Users\<nume>\.claude\settings.json`; macOS/Linux: `~/.claude/settings.json`) trebuie să conțină, **îmbinat** cu restul fișierului (cere voie înainte de a scrie):

```json
{
  "extraKnownMarketplaces": {
    "symbai": {
      "source": { "source": "git", "url": "https://github.com/sinesteziadrimo/symbaimemory.git" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": { "symbai-core@symbai": true }
}
```

`autoUpdate: true` rămâne recomandat (pe CLI ajută; nu strică nicăieri), dar actualizarea garantată vine din hook-ul de self-update al pluginului, nu din acest flag.

## 2. Forțează ultima versiune ACUM

- Oriunde există terminal/Bash: rulează comenzile de la Pasul 0 (merg și când clientul NU e înghețat — scriptul e idempotent; fără `--force` respectă un throttle de 6h).
- Pe CLI, alternativ: `/plugin marketplace update symbai`, apoi repornește sesiunea.

## 3. Verificare

După repornire, într-o sesiune nouă cere versiunea: `grep '"version"' ~/.claude/plugins/installed_plugins.json` trebuie să arate versiunea nouă la `symbai-core@symbai`, iar skill-urile/cunoștințele noi sunt disponibile. Nu declara „actualizat" doar pentru că scriptul a rulat — confirmă versiunea din fișier.

## Note

- Toate astea actualizează DOAR cunoștințele + skill-urile (pachetul de pe GitHub). Conexiunea live la datele tale (MCP) e separată și mereu la zi — tool-urile vin direct de pe instanța ta.
- Versiuni noi dese = normal: Symbai îmbunătățește ghidurile pe măsură ce adaugă funcții.
- Diagnostic rapid „de ce nu s-a actualizat": (1) `installed_plugins.json` → versiunea instalată; (2) `git -C "$MK" log -1 --format='%h %s'` vs `git -C "$MK" log origin/main -1 --format='%h %s'` → clona e în urmă?; (3) versiunea instalată < `plugin.json` din clonă → hook-ul n-a rulat (versiune veche fără hook, sau `node` lipsă) → Pasul 0.
