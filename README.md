# Symbai pentru Claude Code

Acest repo e un **plugin Claude Code** care învață asistentul AI cum să lucreze cu platforma **Symbai** (sistem de management pentru restaurante și hoteluri). Conține:

- **skills/** — workflow-uri pas-cu-pas (configurarea completă a unui client nou — onboarding, importul datelor din Excel/CSV — pagina de import condusă prin extensia Chrome + verificare prin conexiune, configurare Portal Clienți, configurare Aplicație Staff/Symbai Staff, găsește o pagină, investighează o masă, adaugă un produs/rețetă, design pentru meniul fizic tipărit — ca un grafician, prin conexiune + vision, programează o postare, rapoarte & prețuri, trimite ticket de suport/sugestie către echipa Symbai).
- **knowledge/** — biblioteca completă de cunoștințe client-facing: un ghid pentru FIECARE modul Symbai (POS & sală, meniu & rețete, stocuri & furnizori, producție & trasabilitate, rezervări & evenimente, personal, rapoarte & P&L, finanțe & e-Factura, livrări & magazin online, marketing & website, echipamente & KDS, setări, AI în aplicație), plus referința pentru aplicațiile native Expo (`expo-aplicatii-mobile.md`: Symbai POS, Symbai Portal, Symbai Staff, branding, emulator Android, build, GP/Viva app2app, push). Plus referințele transversale de navigare și operare MCP — **agent-operare-avansata.md** (standardul „consultant + inginer + QA" pentru task-uri complexe), **erp-manufacturing-benchmark.md** (pattern-uri ERP/MES pentru producție: BoM, MPS, readiness, QC, capacitate), **navigare-rapida.md** (cheat-sheet compact intenție→URL), **navigare.md** (cum DUCI userul pe pagină), **claude-code-mcp-operare.md** (doctrina skill→knowledge→MCP live→dry-run→confirmare→verificare), **harta-aplicatiei.md** (indexul exhaustiv al paginilor) și **tools-mcp.md** (catalog generat din registry-ul live al tool-urilor MCP, cu modelul de permisiuni) — și folderul **knowledge/onboarding/** (planul general + 12 faze pentru configurarea de la zero a unui client nou, folosit de skill-ul `onboarding-symbai`).

Pluginul se folosește **împreună cu conexiunea MCP** la instanța ta Symbai (date live + acțiuni reale). Conexiunea o adaugi separat din portalul Hub. Pentru email marketing, skill-urile sunt optimizate pentru flow-uri complexe, deliverability/warm-up, trimitere predictivă pe ore individuale și atribuire conversii din POS/rezervări.

## Instalare (clientul rulează o singură dată)

**Metoda recomandată — prin fișier, cu AUTO-UPDATE pornit din start.** Funcționează în orice mediu (inclusiv aplicația desktop, unde comanda `/plugin` poate lipsi) și e singura care pornește actualizarea automată. Editează `settings.json` din folderul Claude (Windows: `C:\Users\<nume>\.claude\settings.json`; macOS/Linux: `~/.claude/settings.json`; creează-l dacă lipsește) și **îmbină** următoarele chei, păstrând restul fișierului:

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

> ⚠️ `"autoUpdate": true` este **obligatoriu** — fără el rămâi blocat pe versiunea de la instalare și nu mai primești ghidurile noi. Comanda `/plugin marketplace add` **nu** pornește auto-update — de aceea folosim fișierul.

Începând cu `symbai-core` v0.22, pluginul mai pornește la fiecare sesiune și un hook fail-safe de **self-heal**: verifică clona locală de marketplace `symbai`, o aduce la zi prin fast-forward când poate și o re-sincronizează cu upstream dacă a divergat dar nu are modificări locale. Nu cere pași manuali clientului; doar protejează cazul în care auto-update-ul nativ se blochează în tăcere.

Apoi instalează pluginul **o singură dată** (activarea efectivă), pe metoda disponibilă la tine:

```
# caseta de chat Claude Code:
/plugin install symbai-core@symbai
# aplicația desktop fără /plugin: Customize / Settings → Plugins/Marketplaces → instalează „symbai-core" din marketplace-ul „symbai"
# terminal, doar dacă `claude --version` merge:
claude plugin install symbai-core@symbai
```

Repornește Claude Code. De aici încolo pluginul se actualizează **singur** la fiecare pornire — nu mai faci nimic.

Separat, din portalul tău Symbai Hub → **Acces AI**, ia instrucțiunile de conectare la datele instanței tale (server MCP `symbai`). Dacă ceva nu merge la conectare, spune-i asistentului „conectează-mă la Symbai" — skill-ul `conecteaza-symbai` îl ghidează (inclusiv la eroarea „Some MCP servers could not be loaded").

## Actualizare

Cu `"autoUpdate": true` în `settings.json` (vezi Instalare) **nu trebuie să faci nimic** — Claude Code reîmprospătează marketplace-ul și upgradează pluginul la fiecare pornire. Dacă mecanismul nativ se împotmolește, hook-ul de self-heal din plugin repară clona de marketplace la următoarea sesiune fără să blocheze pornirea.

Dacă vrei ultima versiune **imediat**, fără să aștepți următoarea pornire: scrie în chat „actualizează skill-urile Symbai" (skill-ul `symbai-update` te ghidează și îți verifică/pornește auto-update-ul), sau, dacă ai comanda disponibilă, `/plugin marketplace update symbai`.

## Cum se livrează conținut nou

Echipa Symbai urcă fișiere noi de skill/knowledge în acest repo (pe `main`) și **bumpează versiunea** în `plugins/symbai-core/.claude-plugin/plugin.json`, `plugins/symbai-core/.codex-plugin/plugin.json` și intrarea din `.claude-plugin/marketplace.json`. Clienții cu `autoUpdate: true` le primesc automat la următoarea pornire; ceilalți, manual cu `/plugin marketplace update symbai`.

> **Bumpul de versiune e obligatoriu la fiecare livrare.** Claude Code servește pluginul dintr-un folder fixat pe versiune (`cache/symbai/symbai-core/<versiune>/`); dacă `version` nu se schimbă, clienții rămân pe copia veche din cache chiar dacă au tras commit-uri noi.

## Structură

```
.claude-plugin/marketplace.json     # marketplace (listează pluginul symbai-core)
plugins/symbai-core/
  .claude-plugin/plugin.json        # manifestul pluginului
  skills/<nume>/SKILL.md            # workflow-uri
  knowledge/*.md                    # cunoștințe pe module
```

## Compatibilitate

Skill-urile urmează standardul deschis Agent Skills (SKILL.md), deci funcționează în Claude Code. Pentru alte unelte (ex. Codex) suportul poate diferi — conexiunea MCP funcționează oricum cross-tool.
