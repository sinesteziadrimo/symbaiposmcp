---
name: symbai-update
description: Actualizează (sau pornește auto-actualizarea) cunoștințelor și skill-urilor Symbai. Folosește când utilizatorul scrie /symbai-core:symbai-update sau cere „actualizează skill-urile Symbai" / „ia ultimele cunoștințe Symbai" / „de ce nu se actualizează singur pluginul" / „cum activez auto-update".
---

# Actualizează pachetul Symbai (`symbai-core`)

Pluginul `symbai-core` (skill-urile + folderul `knowledge/`) e descărcat din GitHub (marketplace `symbai`, repo `sinesteziadrimo/symbaimemory`). Claude Code îl ține într-un folder **fixat pe versiune** (`~/.claude/plugins/cache/symbai/symbai-core/<versiune>/`). Singurul mecanism corect de actualizare e **auto-update-ul nativ al marketplace-ului**, controlat de o cheie din `settings.json`.

> ⚠️ Notă pentru asistent: folderul **de cache** (`.../cache/symbai/symbai-core/<ver>`) nu e repo git — un `git pull` în el nu face nimic. Versiunea reală pe care se uită clientul vine din **clona de marketplace** (`.../plugins/marketplaces/symbai/`, care ESTE repo git). Sunt **DOUĂ cauze** pentru „nu se actualizează", verifică-le în ordine: (1) flag-ul `autoUpdate` lipsește (Pasul 1); (2) flag-ul e pus dar **clona de marketplace e blocată** — nu mai face fetch sau a divergeat, deci `git pull --ff-only` al clientului eșuează în tăcere (Pasul 0). La clienții care au flag-ul corect dar tot stau pe versiune veche, cauza e aproape mereu (2).

> ✅ Din v0.22.x pluginul are un **hook de self-heal** (`SessionStart` → `scripts/self-heal-marketplace.mjs`) care reface clona de marketplace automat la pornire. Deci un client care a ajuns o dată pe o versiune cu hook-ul **nu se mai blochează niciodată**. Pașii de mai jos rămân pentru: clienți încă blocați pe o versiune VECHE (pre-hook), sau diagnostic manual.

## 0. Diagnostic + reparare clonă de marketplace (cauza #1 când flag-ul e deja corect)

Dacă ai acces la terminal/Bash pe mașina clientului, verifică starea reală a clonei de marketplace ÎNAINTE de orice:

```bash
MK="$HOME/.claude/plugins/marketplaces/symbai"   # Windows: C:/Users/<nume>/.claude/plugins/marketplaces/symbai
cd "$MK"
git fetch origin -q
git log -1 --format="local:  %h %s"
git log origin/main -1 --format="remote: %h %s"
git status -sb            # arată ahead/behind + dacă e murdar
```

- **local == remote** → clona e la zi; problema e că native auto-update n-a re-instalat încă în cache → forțează (Pasul 2) sau repornește.
- **local în urmă, fast-forward-abil** (working tree curat) → repară:
  ```bash
  git merge --ff-only origin/main
  ```
- **divergent** (`ahead N` cu commit-uri locale care nu-s pe upstream, sau ff eșuează) și **working tree CURAT** → re-sincronizează forțat:
  ```bash
  git reset --hard origin/main
  ```
  ⚠️ `reset --hard` doar dacă `git status --porcelain` e GOL. Dacă are modificări locale, NU șterge — întreabă userul (pot fi editări intenționate pe mașina lui).
- După reparare, **pre-populează cache-ul** ca instalarea să fie sigură (opțional, dacă versiunea din cache lipsește):
  ```bash
  V=$(grep -oE '"version"[^"]*"[^"]*"' "$MK/plugins/symbai-core/.claude-plugin/plugin.json" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  cp -r "$MK/plugins/symbai-core" "$HOME/.claude/plugins/cache/symbai/symbai-core/$V"
  ```
Apoi repornire. (Asta e exact ce a rezolvat incidentul „frozen pe 0.21.4", 2026-06-21.)

## 1. Asigură auto-update-ul (asta rezolvă „nu se actualizează" definitiv)

Verifică și, la nevoie, **editează** fișierul `settings.json` din folderul Claude al utilizatorului (Windows: `C:\Users\<nume>\.claude\settings.json`; macOS/Linux: `~/.claude/settings.json`; creează-l dacă lipsește). Trebuie să conțină, **îmbinat** cu restul fișierului (cere voie înainte de a scrie):

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

- Dacă `extraKnownMarketplaces.symbai` **există dar fără** `"autoUpdate": true` → adaugă DOAR flag-ul (asta e cazul tipic la clienții care s-au blocat pe o versiune veche).
- Dacă lipsește de tot → adaugă tot blocul.
- Păstrează restul fișierului neatins.

Cu `autoUpdate: true`, Claude Code reîmprospătează marketplace-ul ȘI upgradează pluginul la ultima versiune **la fiecare pornire**, fără nicio acțiune. (Marketplace-urile terțe au auto-update OPRIT implicit — de-aceea trebuie pus explicit.) Spune-i utilizatorului să **repornească** aplicația ca să se aplice.

## 2. Forțează ultima versiune ACUM (fără să aștepți repornirea)

Dacă utilizatorul are caseta de chat cu `/plugin`:

```
/plugin marketplace update symbai
```

(asta trage marketplace-ul la zi și upgradează pluginul instalat). Apoi repornește sesiunea.

Dacă `/plugin` **nu e disponibil** (aplicația desktop) și nici `claude` în terminal — atunci pasul 1 + repornire e tot ce trebuie: la următoarea pornire auto-update-ul aduce ultima versiune. Ca verificare, după repornire confirmă în Customize / Settings → Plugins că `symbai-core` arată versiunea nouă.

## 3. Verificare

După repornire, într-o sesiune nouă: skill-urile și cunoștințele Symbai noi sunt disponibile. (Opțional, dacă userul are `/plugin`: panoul Plugins arată versiunea curentă a `symbai-core`.)

## Note

- Toate astea actualizează DOAR cunoștințele + skill-urile (pachetul de pe GitHub). Conexiunea live la datele tale (MCP) e separată și mereu la zi — tool-urile vin direct de pe instanța ta.
- Versiuni noi dese = normal: Symbai îmbunătățește ghidurile pe măsură ce adaugă funcții.
- Un plugin **nu** își poate forța singur auto-update-ul nativ (e o setare a clientului). De-aceea instalarea recomandată (vezi README) scrie `autoUpdate: true` din start, iar pluginul livrează hook-ul de self-heal care reface clona de marketplace independent de native auto-update.
