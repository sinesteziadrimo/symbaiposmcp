# CRM Vânzări — Pipeline, Lead-uri & Evenimente (`/sales-crm`)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

**Sales CRM** (`/sales-crm`) e modulul de **management al vânzărilor și evenimentelor pe pâlnie (pipeline)** — de la prima cerere până la încasare. Aici proprietarul gestionează lead-uri/cereri ca pe „deal-uri" care avansează prin etape: o petrecere de copii la un parc, un eveniment la o sală/hotel, o rezervare mare la restaurant, o ofertă B2B. E **distinct** de CRM-ul de retenție/ciclu de viață (playbook-uri, win-back, Next Best Action — vezi `crm-automatizari-playbooks.md`).

Caracteristica-cheie: pagina e **„template-aware"** — vocabularul și taburile se adaptează după tipul de business ales (stilul CRM). Tabul „Pipeline" se redenumește automat: restaurant/cafenea/hotel → **Pipeline Rezervări**; sală/catering → **Pipeline Evenimente**; **parc de distracții → Pipeline Petreceri**; servicii → **Pipeline Vânzări**. Termenul „deal" devine în UI „rezervare/eveniment/petrecere/comandă" după vertical.

⚠ **NU există tool MCP dedicat pentru deal/pipeline** (creare/avansare deal, etape, reguli de capacitate, prezentări) — astea sunt **UI-only** pe `/sales-crm` și `/settings/sales-crm`. MCP-ul acoperă funnel-ul, playbook-urile, NBA, task-urile CRM, clienții/grupurile, loialitatea, rezervările și jocurile (vezi „Tool-uri MCP").

⚠ **Loc CRM nominal**: paginile de vânzări se văd DOAR de angajații nominalizați ca „User CRM" (locuri facturabile, în Setări → Sales CRM → Useri CRM). Regula se aplică inclusiv adminilor — fără nominalizare, nici adminul nu vede `/sales-crm`. „De ce nu văd CRM-ul?" = lipsă nominalizare, nu bug.

## Concepte

- **Lead / Deal** — o cerere/oportunitate cu valoare, etapă, probabilitate, agent alocat. „Won" = confirmat și a avut loc; „Lost" = pierdut.
- **Pipeline (Kanban)** — coloane = etape configurabile, carduri = lead-uri/evenimente trase drag-and-drop între etape. Pe card: **Lead Score 0-100**, Avans ✓/✗, Contract ✓/✗, buton „Avansează la etapa următoare".
- **Etapă (stage)** — coloană din Kanban: nume, culoare, probabilitate de câștig (%), marcaj „este etapa Won/Lost".
- **Fișă de eveniment** — un deal de tip „eveniment" deschide o fișă cu până la 12 taburi (Deal, Sumar, Comunicare, Produse, Personal, Prep & Bucătărie, Producție, Cheltuieli, Contract, Recenzii, BEO, P&L). Mecanica completă (BEO, contract e-sign, avans, P&L per eveniment) e în `rezervari-clienti-evenimente.md`.
- **Tip de rezervare/eveniment** — configurabil; decide dacă e „eveniment" sau rezervare simplă și ce **capabilități** are: **Sală/Cameră, Personal, Jocuri/Atracții, Produse, Contract, Chestionar** (+ comutatoarele Producție/Cheltuieli/BEO). Capabilitatea „**Jocuri/Atracții**" e mecanismul prin care o petrecere include jocuri — esențial pentru parcuri.
- **Reguli de Capacitate** — limite (sloturi, săli, locuri) pe zi/perioadă; relevant pentru săli de evenimente și parcuri.
- **Stil CRM (per vertical)** — Restaurant / Parc de Distracții / Cafenea-Bar / Sală Evenimente-Hotel / Servicii Profesionale; schimbă vocabularul, taburile și modulele.

## Paginile

### `/sales-crm` — taburile (configurabile, se pot ascunde din setări)
1. **Dashboard** — KPI (lead-uri deschise, valoare câștigată RON, avansuri neîncasate), deal-uri recente, „Avansuri & Contracte de finalizat", card **Performanță Agenți** (per agent: deschise/câștigate, RON încasat vs pending).
2. **Pipeline** (Kanban) — etape, carduri cu Lead Score + Avans/Contract, drag-and-drop, marcaje Won/Lost, filtre brand/locație/dată.
3. **Calendar** — evenimentele și rezervările pe calendar (cu săli/jocuri).
4. **Prezentare** — pitch de vânzare live cu slide-uri dinamice, ecran complet, coach pe telefon (QR). Construcția e separată, în Setări → CRM. Vezi `prezentare-vanzare.md` + skill `construieste-prezentare`.
5. **Rezervări** — rezervările legate (vezi `rezervari-clienti-evenimente.md`).
6. **Clienți** — clienții din perspectiva vânzărilor: filtre Toți / Cu deal-uri / Neasignați / Zi de naștere în 30 zile.
7. **Mesaje** — inbox conversații (telefon/WhatsApp/Facebook/Instagram/Email/portal) cu **mod AI per conversație**: **Manual / Draft AI (AI pregătește, tu aprobi) / Auto Încrezător / Full Auto**.
8. **Task-uri** — coada de activități CRM (apel/email/întâlnire/follow-up/contract/plată), filtre Astăzi / Întârziate / Săptămâna / Toate / Finalizate.
9. **Analiză / Rapoarte** — analitice pe deal-uri și agenți pe interval.
10. **Reguli Capacitate** — limite de capacitate (sloturi/săli/locuri) pe zi/perioadă.
11. **WhatsApp** — configurarea canalului WhatsApp pentru conversații CRM.

### Fișa de Deal / Eveniment (click pe un card)
Butoane lifecycle (Avans / Contract / Won / Lost), quick actions (Sună / WhatsApp / Email / Adaugă activitate), tracking avans (cerut/plătit) + contract (semnat/nesemnat) + payment link. Pentru **parcuri/petreceri**: jocuri (lasertag/VR), atracții, tort, mascotă, decorațiuni, defalcare adulți/copii, meniuri (adult/copil), chestionare (NPS), recenzii, cronologie petrecere. Pentru evenimente mari, taburile fișei: Deal, Sumar, Comunicare, Produse, Personal, Prep & Bucătărie, Producție, Cheltuieli, Contract, Recenzii, **BEO**, **P&L per eveniment**.

### Funcții AI (toggle din setări)
- **Lead Score** (0-100 pe valoare/urgență/avans), **AI Briefing pre-întâlnire**, **Generator AI propunere/BEO**, **AI Sale Creator** (agent autonom care vorbește cu clienții și creează deal-uri), **Smart Follow-ups** (creează automat task-uri pentru deal-uri fără activitate), **Next Best Action**.

### `/settings/sales-crm` — Configurare CRM
Buton „**Wizard configurare rapidă**" (la prima deschidere: 3 pași cu ~20 șabloane de business, inclusiv unul dedicat **„Parc de Distracții"** — „petreceri complexe cu meniuri, săli, jocuri, mascotă"). Patru zone (taburi `general` / `pipelines` / `event-types` / `visibility`):
1. **General / Stilul CRM** — alegi verticalul (Restaurant / **Parc de Distracții** / Cafenea-Bar / Sală Evenimente-Hotel / Servicii) → schimbă vocabularul + modulele.
2. **Pipelines & Etape** (`?tab=pipelines`) — definești coloanele Kanban: nume, culoare, probabilitate %, marcaj Won/Lost, ordonare drag-and-drop.
3. **Tipuri rezervări/evenimente** (`?tab=event-types`) — tipurile (ex. „Petrecere copii", „Corporate", „Botez"), fiecare cu capabilitățile bifate (contract/jocuri/săli/personal/produse/chestionare) + **editor de șabloane de petrecere** (cronologia zilei: sosire, servire, tort… cu offset-uri de timp).
4. **Vizibilitate features** (`?tab=visibility`) — control granular cu toggle-uri: ce taburi apar în CRM, ce funcții AI, ce câmpuri/widget-uri pe fișa de Deal și pe Eveniment, ce câmpuri în formularul „Lead Nou", suita Servicii (proiecte/time tracking/tickets/retainers), integrări (Cvent, WhatsApp Business, Google/Outlook Calendar), canale de comunicare.
   Tot aici: **Useri CRM** (nominalizarea locurilor CRM facturabile).

## Fluxuri pas-cu-pas

1. **Configurezi CRM-ul pentru verticalul tău** (prima dată): `/settings/sales-crm` → „Wizard configurare rapidă" → alegi stilul (ex. **Parc de Distracții**) → wizardul setează pipeline-ul + tipurile de evenimente + vizibilitatea. Apoi rafinezi etapele (`?tab=pipelines`) și tipurile de petreceri + capabilitățile lor (`?tab=event-types`).
2. **Nominalizezi cine vede CRM-ul**: `/settings/sales-crm` → Useri CRM → adaugi angajații care vând (altfel nu văd `/sales-crm`, nici adminii).
3. **Lucrezi pipeline-ul**: `/sales-crm` → Pipeline → tragi cardurile între etape pe măsură ce avansează lead-ul; pe card vezi Lead Score, Avans, Contract; „Avansează la etapa următoare" sau marchezi Won/Lost.
4. **Deschizi o petrecere/eveniment**: click pe card → fișa cu taburi → adaugi Produse (meniul), Personal, jocuri/atracții (dacă tipul are capabilitatea), trimiți Contractul, ceri Avansul → în ziua evenimentului printezi BEO → vezi P&L. (Mecanica detaliată: `rezervari-clienti-evenimente.md`.)
5. **Prezinți oferta unui prospect**: de pe un lead → butonul „Prezentare" (sau tabul Prezentare) → datele se pre-completează din lead → rulezi prezentarea / pornești coach pe telefon. Construcția prezentării: `prezentare-vanzare.md`.
6. **Răspunzi la mesaje cu ajutor AI**: `/sales-crm` → Mesaje → alegi modul per conversație (Manual / Draft AI / Auto Încrezător / Full Auto).
7. **Vezi unde pleacă lead-urile**: pâlnia cu `get_crm_funnel` (lead-uri → confirmate → cu avans → evenimente → recenzii + rate de conversie + defalcare pe sursă).
8. **Cozile de lucru**: task-urile CRM cu `list_crm_tasks`; Next Best Action cu `list_nba_suggestions`.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `get_crm_funnel(brandId?, days?)` — pâlnia CRM + rate de conversie + defalcare pe sursă.
- `list_crm_tasks(brandId?, status?, assignedTo?, limit?)` — coada de task-uri CRM.
- `list_nba_suggestions(brandId?, limit?)` — Next Best Action (clienți de contactat acum, scor 0-100 + acțiune + motiv).
- `list_crm_playbooks` / `list_playbook_runs` — playbook-uri de ciclu de viață + istoricul rulărilor (detaliu în `crm-automatizari-playbooks.md`).
- `get_customer_timeline(customerId)` — cronologia unui client (comunicări, rezervări/evenimente, task-uri).
- `get_reservations_overview` — rezumat rezervări (setări + statistici + azi/mâine + tipuri configurate).

**Scriere — modul «Rezervări & Clienți» (`rezervari_clienti`):**
- `create_reservation` / `update_reservation` / `cancel_reservation` — rezervări.
- `create_game_reservation` — rezervare de joc/atracție (verifică ÎNTÂI disponibilitatea).
- `create_customer` / `create_customer_group` / `add_customer_group_member` — clienți & grupuri.
- `award_loyalty_points` / `create_loyalty_reward` / `create_loyalty_tier` — loialitate.

**Scriere — modul «Setări & Configurare» (`setari`):**
- `update_game_config` / `update_game_schedule` / `update_game_pricing` / `set_game_date_override` — configurarea jocurilor/atracțiilor.
- `configure_reservation_*` / `seed_reservation_settings` — sistemul de rezervări.

> Pentru deal/pipeline/etape/capacity rules/prezentări **nu există tool MCP** — UI-only. Permisiunea exactă a fiecărui tool e în `tools-mcp.md`. „Permisiune insuficientă" → modulul nu e pe token → portal Hub → Acces AI.

## Întrebări frecvente

- **De ce nu văd pagina Sales CRM / Servicii?** → Lipsă **loc CRM nominal**. Nominalizează angajatul „User CRM" în Setări → Sales CRM → Useri CRM. Se aplică și adminilor.
- **De ce nu apare un tab pe fișa evenimentului (Producție/Contract/Jocuri)?** → Taburile depind de **capabilitățile tipului de rezervare** (Setări → Sales CRM → Tipuri rezervări). Bifează capabilitatea respectivă; există și un nivel per brand care poate ascunde taburi.
- **Cum fac ca o petrecere de parc să includă jocuri?** → Tipul de rezervare trebuie să aibă capabilitatea „**Jocuri/Atracții**" activată + lista de jocuri permise. Atunci pe fișă poți adăuga sesiuni de joc, cu meniu + sală + personal + contract, P&L consolidat.
- **Vocabularul nu se potrivește (zice „rezervări" dar eu am petreceri)** → Schimbă stilul CRM în `/settings/sales-crm` → General (alege Parc de Distracții) — taburile și termenii se rescriu.
- **Cardul nu avansează / Won nu se marchează** → Verifică etapele (`?tab=pipelines`): trebuie să existe etape marcate Won/Lost; trage cardul în coloana potrivită sau folosește „Avansează la etapa următoare".
- **Pot crea/avansa un deal prin Claude (MCP)?** → Nu — deal/pipeline e UI-only. Prin MCP poți face rezervări, jocuri, clienți, loialitate, și poți citi funnel/NBA/task-uri.

## Pentru acces SQL

Cu permisiunea SQL activă pe token poți răspunde, doar prin citire, la întrebări care nu au tool dedicat: descoperă întâi structura cu `list_database_tables` → `describe_database_table`, apoi interoghează cu `execute_sql_query`. Exemple de întrebări: „câte deal-uri deschise are fiecare agent?", „ce valoare are pipeline-ul pe fiecare etapă?", „câte evenimente de tip «Petrecere copii» au fost luna asta?".

## Cross-link-uri

- `rezervari-clienti-evenimente.md` — rezervări, evenimente/petreceri (fișa de 12 taburi, BEO, P&L, contract e-sign, avans), hotel — **mecanica detaliată** a ce gestionezi în pipeline.
- `jocuri-activitati.md` — atracții & jocuri rezervabile (parc de distracții): program, prețuri, sloturi, disponibilitate.
- `crm-automatizari-playbooks.md` — CRM de retenție: playbook-uri, automatizări declanșator→efect, NBA, pâlnie de ciclu de viață.
- `segmentare-clienti.md` — grupuri & segmente RFM, taguri, audiențe. `loialitate-fidelizare.md` — puncte, niveluri, recompense.
- `prezentare-vanzare.md` — tabul «Prezentare»: pitch de vânzare dinamic. Skill: `construieste-prezentare`.
- Skill dedicat: `gestioneaza-crm`.
