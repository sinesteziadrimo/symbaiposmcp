# Symbai pentru Claude Code

Acest repo e un **plugin Claude Code** care învață asistentul AI cum să lucreze cu platforma **Symbai** (sistem de management pentru restaurante și hoteluri). Conține:

- **skills/** — workflow-uri pas-cu-pas (configurarea completă a unui client nou — onboarding, importul datelor din Excel/CSV — pagina de import condusă prin extensia Chrome + verificare prin conexiune, configurare Portal Clienți, configurare Aplicație Staff/Symbai Staff, găsește o pagină, investighează o masă, adaugă un produs/rețetă, design pentru meniul fizic tipărit — ca un grafician, prin conexiune + vision, programează o postare, rapoarte & prețuri, trimite ticket de suport/sugestie către echipa Symbai).
- **knowledge/** — biblioteca completă de cunoștințe client-facing: un ghid pentru FIECARE modul Symbai (POS & sală, meniu & rețete, stocuri & furnizori, producție & trasabilitate, rezervări & evenimente, personal, rapoarte & P&L, finanțe & e-Factura, livrări & magazin online, marketing & website, echipamente & KDS, setări, AI în aplicație), plus referința pentru aplicațiile native Expo (`expo-aplicatii-mobile.md`: Symbai POS, Symbai Portal, Symbai Staff, branding, emulator Android, build, GP/Viva app2app, push). Plus referințele transversale de navigare și operare MCP — **agent-operare-avansata.md** (standardul „consultant + inginer + QA" pentru task-uri complexe), **erp-manufacturing-benchmark.md** (pattern-uri ERP/MES pentru producție: BoM, MPS, readiness, QC, capacitate), **navigare-rapida.md** (cheat-sheet compact intenție→URL), **navigare.md** (cum DUCI userul pe pagină), **claude-code-mcp-operare.md** (doctrina skill→knowledge→MCP live→dry-run→confirmare→verificare), **harta-aplicatiei.md** (indexul exhaustiv al paginilor) și **tools-mcp.md** (catalog generat din registry-ul live al tool-urilor MCP, cu modelul de permisiuni) — și folderul **knowledge/onboarding/** (planul general + 12 faze pentru configurarea de la zero a unui client nou, folosit de skill-ul `onboarding-symbai`).

Pluginul se folosește **împreună cu conexiunea MCP** la instanța ta Symbai (date live + acțiuni reale). Conexiunea o adaugi separat din portalul Hub. Pentru email marketing, skill-urile sunt optimizate pentru flow-uri complexe, deliverability/warm-up, trimitere predictivă pe ore individuale și atribuire conversii din POS/rezervări.

## Instalare (clientul rulează o singură dată)

În Claude Code:

```
/plugin marketplace add sinesteziadrimo/symbaimemory
/plugin install symbai-core@symbai
```

Sau din terminal:

```bash
claude plugin marketplace add sinesteziadrimo/symbaimemory
```

Apoi, din portalul tău Symbai Hub → **Acces AI**, ia instrucțiunile de conectare la datele instanței tale — fie mesajul de lipit în chat (aplicația Claude Desktop, fără terminal), fie comanda pentru terminal (`claude mcp add --transport http --scope user symbai ...`). Dacă ceva nu merge la conectare, spune-i asistentului „conectează-mă la Symbai" — skill-ul `conecteaza-symbai` îl ghidează (inclusiv la eroarea „Some MCP servers could not be loaded").

## Actualizare

Când Symbai publică ghiduri sau funcții noi:

```
/plugin marketplace update symbai
```

(sau scrie în chat „actualizează skill-urile Symbai" — skill-ul `symbai-update` te ghidează.)

## Cum se livrează conținut nou

Echipa Symbai urcă fișiere noi de skill/knowledge în acest repo (pe `main`). Clienții le iau cu `/plugin marketplace update symbai`. Versiunea pluginului se bumpează în `plugins/symbai-core/.claude-plugin/plugin.json` + intrarea din `.claude-plugin/marketplace.json`.

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
