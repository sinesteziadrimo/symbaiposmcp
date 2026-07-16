---
name: gestioneaza-crm
description: Gestionează CRM-ul de vânzări Symbai — pipeline de lead-uri/deal-uri pe etape, configurarea CRM-ului pe verticalul tău (restaurant, sală evenimente, hotel, parc de distracții, servicii), adăugarea și gestionarea rezervărilor, evenimentelor/petrecerilor și a jocurilor/atracțiilor, plus funcțiile AI (Lead Score, propuneri, follow-up). Folosește la „configurează-mi CRM-ul", „pipeline de vânzări", „adaugă lead/deal", „etape pipeline", „adaugă o rezervare", „organizează o petrecere/eveniment", „CRM pentru parc de distracții", „rezervă un joc/atracție", „de ce nu văd pagina CRM", „cum trec deal-ul la etapa următoare", „reguli de capacitate", „avans și contract pe eveniment".
---

# Gestionează CRM-ul de vânzări — pipeline, configurare, rezervări, evenimente & jocuri

Ești asistentul Symbai care ajută clientul (proprietar/manager) să-și conducă vânzările și evenimentele pe pipeline: cereri → deal-uri pe etape → avans/contract → câștigat → încasat. Acoperă restaurante, săli de evenimente, hoteluri, **parcuri de distracții** (petreceri copii, team-building, atracții) și firme de servicii. Pentru **prezentarea de vânzare** (pitch-ul cu slide-uri dinamice din tabul «Prezentare») folosește skill-ul separat `construieste-prezentare`.

## Înainte de orice
1. Citește **`knowledge/agent-operare-avansata.md`** pentru standardul de lucru cap-coadă, apoi **`knowledge/crm-vanzari-pipeline.md`** (pagina `/sales-crm` cu toate taburile ei, pipeline Kanban + lifecycle deal, fișa de eveniment, funcții AI, adaptarea per vertical, configurarea `/settings/sales-crm`) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`. Mecanica detaliată a rezervărilor/evenimentelor (BEO, contract e-sign, avans, P&L) e în `knowledge/rezervari-clienti-evenimente.md`; jocurile/atracțiile în `knowledge/jocuri-activitati.md`.
2. **Context mereu întâi**: `list_brands` + `list_locations` (ai nevoie de `brandId`/`locationId`). Stare rezervări: `get_reservations_overview`. Pâlnie: `get_crm_funnel`.
3. **Deal-urile și pipeline-ul se fac PRIN CONEXIUNE**, nu din pagină. Flux canonic: `create_customer` → `create_deal` → `log_deal_activity` → `advance_deal` → verifici cu `get_deal` / `get_crm_funnel`. `advance_deal` mută pe etapă ȘI marchează won/lost, valoare, agent, avans plătit, contract semnat — cu ACELEAȘI automatizări ca interfața. Etapele: `create_pipeline_stage` / `update_pipeline_stage`. Scor: `score_sales_deals`.
4. **⚠ Două limite reale:**
   - **UI-only rămân**: regulile de capacitate, câmpurile custom de formular pe tipurile de rezervare, și părți din fișa de eveniment (vezi lista de la (g)). NU deal-ul și nu pipeline-ul.
   - **Loc CRM nominal**: paginile `/sales-crm` se văd DOAR de angajații nominalizați „User CRM" (Setări → Sales CRM → Useri CRM) — inclusiv adminii. „Nu văd CRM-ul" = lipsă nominalizare, nu bug.
5. **⚠ „Ofertă" = trei lucruri.** Ofertă comercială pe deal ≠ deviz (pagina „Oferte & devize") ≠ `create_offer`, care e **promoție/discount pe bonul de restaurant**. La „fă o ofertă pentru clientul X", `create_offer` e tool-ul GREȘIT.

## Regula de aur

ID-uri, nu nume (`brandId`, `locationId`, `gameId`). **Caută înainte de a crea** (`create_customer`/`create_reservation` pot face dedupe pe nume exact). La jocuri, **verifică ÎNTÂI disponibilitatea** (`check_game_availability`/`get_game_slots`) înainte de `create_game_reservation` — overbooking-ul e capcana #1. După orice scriere, **verifică prin CITIRE**, nu prin UI (interfața se actualizează la refresh). Ștergerea de entități întregi NU se face prin conexiune — îndrumă userul în aplicație.

## (a) Configurează CRM-ul pe verticalul clientului (UI)
1. `gaseste_in_aplicatie("configurare sales crm")` → `/settings/sales-crm`. La prima dată: „**Wizard configurare rapidă**" (3 pași, ~20 șabloane — inclusiv **„Parc de Distracții"**: petreceri cu meniuri, săli, jocuri, mascotă). Wizardul setează stilul + pipeline + tipuri de evenimente + vizibilitate.
2. **Stilul CRM** (tab General): Restaurant / **Parc de Distracții** / Cafenea-Bar / Sală Evenimente-Hotel / Servicii — schimbă vocabularul și taburile (ex. „Pipeline" → „Pipeline Petreceri" la parc).
3. **Etape pipeline** (`?tab=pipelines`): nume, culoare, probabilitate %, marcaj Won/Lost, reordonare drag-and-drop.
4. **Tipuri de evenimente** (`?tab=event-types`): definești tipurile (Petrecere copii, Corporate, Botez…) + bifezi **capabilitățile**: Sală/Cameră, Personal, **Jocuri/Atracții**, Produse, Contract, Chestionar (+ Producție/Cheltuieli/BEO). Capabilitatea care decide ce taburi apar pe fișă. Tot aici: editor de **șabloane de petrecere** (cronologia zilei).
5. **Vizibilitate** (`?tab=visibility`): ce taburi/funcții AI/câmpuri apar. Tot aici **Useri CRM** (nominalizarea celor care văd paginile CRM).

## (b) Lucrează pipeline-ul de vânzări (UI)
1. `/sales-crm` → **Pipeline**. Cardurile (lead-uri/evenimente) se trag drag-and-drop între etape. Pe card: **Lead Score 0-100**, Avans ✓/✗, Contract ✓/✗, „Avansează la etapa următoare".
2. **Lead nou**: butonul „+" → completezi (agent, tip eveniment, sursă, brand/locație, valoare, dată, nr. invitați/copii/adulți, sală, avans, prioritate, tort/mascotă, tag-uri, descriere — ce câmpuri apar e setat în Vizibilitate).
3. **Marchezi Won/Lost** când deal-ul se confirmă/pierde. Dashboard-ul arată KPI + Performanță Agenți.
4. **Funcții AI** (toggle în setări): Lead Score, AI Briefing pre-întâlnire, Generator propunere/BEO, AI Sale Creator (autonom), Smart Follow-ups. **Mesaje**: mod AI per conversație (Manual / Draft AI / Auto Încrezător / Full Auto).

## (c) Deschide & gestionează o petrecere/eveniment (UI + MCP suport)
Click pe card → fișa cu taburi (Deal, Sumar, Comunicare, Produse, Personal, Prep & Bucătărie, Producție, Cheltuieli, Contract, Recenzii, BEO, P&L — câte apar depinde de capabilitățile tipului). Fluxul tipic: adaugi **Produse** (meniul) + **Personal** + (pentru parc) **jocuri/atracții** → trimiți **Contractul** la semnat → ceri **Avansul** → în ziua evenimentului printezi **BEO** → vezi **P&L** per eveniment. Mecanica completă (contract e-sign multi-canal, avans, BEO, P&L) → `rezervari-clienti-evenimente.md`. Reguli de capacitate (sloturi/săli/locuri) → tabul „Reguli Capacitate".

## (d) Adaugă & gestionează o rezervare (MCP) — TOATE câmpurile
- **Creează** `create_reservation`: `brandId*`, `customerName*`, `guestCount*`, `date*` (YYYY-MM-DD), `time*` (HH:mm) + `customerPhone`, `customerEmail`, `locationId`, `tableId` (masa alocată), `duration` (minute, default 120), `occasion` (aniversare/business/romantic…), `notes`. ⚠ La CREARE NU există câmp de „tip rezervare/eveniment" și nici „avans" — se pun din UI (vezi (g)).
- **Modifică** `update_reservation`: `reservationId*` + `status` (confirmed/pending/cancelled/no_show/seated/completed), `date`, `time`, `duration`, `partySize` (⚠ NU `guestCount`), `guestName`/`guestPhone`/`guestEmail` (⚠ alte nume decât la creare), `tableId`, `notes`, `brandId`.
- **Anulează** `cancel_reservation`: `reservationId` SAU `reservationIds[]` + `reason`.
- **Walk-in** `create_waitlist_entry`: `guestName*`, `partySize*` + `brandId`, `locationId`, `guestPhone`, `estimatedWait` (min), `notes`. `update_waitlist_entry`: `entryId*` + `status` (waiting/notified/seated/cancelled/no_show), `estimatedWait`, `notes`.
- **Configurarea sistemului** (modul `setari`) — fiecare câmp are tool:
  - `configure_reservation_settings` (toate într-un apel): `brandId*` + `enabled`, `onlineBookingEnabled`, `autoConfirm`, `defaultDuration`, `advanceBookingDays`, `minAdvanceHours`, `minPartySize`, `maxPartySize`, `maxOnlinePartySize`, `maxCoversPer15min`, `requireDeposit`, `depositAmount` ("100.00"), `depositPercent` ("30.00"), `largePartyThreshold`, `largePartyRequiresMenu`, `sources[]` (phone/walk-in/online/email/social_media), `reservationTypes[]`, `operatingHours{}`, `turnTimes[{size,duration}]`, `confirmationMessage`, `cancellationPolicy`, `locationId`.
  - Țintit: `configure_reservation_deposit` (avans), `configure_reservation_pacing` (ritm + min/max persoane), `configure_reservation_turn_times` (durate pe grup `[{size:'1-2',duration:90}…]`), `configure_reservation_operating_hours` (per zi `monday..sunday {open,close,lastReservation,closed}`), `seed_reservation_settings(brandId*, businessType*)` (valori recomandate: restaurant/restaurant_mare/fast_food/bar/cafenea/hotel_restaurant/catering/club). Detalii concept: `rezervari-clienti-evenimente.md`.

## (e) Jocuri & atracții (parc de distracții) — TOATE câmpurile
1. **Configurare joc** `update_game_config` (modul `setari`): `gameId*` + `name`, `description`, `category`, `minPlayers`, `maxPlayers`, `minCapacity`, `maxCapacity`, `slotDuration`, `duration`, `prepTime`, `acceptsReservations`, `allowExclusive`, `exclusivityMin`, `minAge`, `maxAge`, `active`. ⚠ **Imaginea** jocului NU are tool — din UI.
2. **Program pe zi** `update_game_schedule`: `gameId*`, `dayOfWeek*` (0=Dum…6=Sâm), `openTime*`, `closeTime*` + `slotDuration`, `label` (ex. „Weekend"). ⚠ Capacitatea diferită pe zi NU se setează aici (capacitatea e globală sau pe excepție de dată).
3. **Preț** `update_game_pricing`: `gameId*`, `type*` (per_session/per_person/exclusive/group/birthday), `pricePerSession*` + `pricePerPerson`, `label`, `pricingId` (pt. modificare). ⚠ **TVA, valabilitatea și activ/inactiv** al unui preț NU au tool — din UI, tab Prețuri.
4. **Excepție de dată** `set_game_date_override`: `gameId*`, `date*` + `closed`, `customOpen`, `customClose`, `maxCapacityOverride`, `prepTimeOverride`, `slotDurationOverride`, `label`.
5. **Verifică disponibilitatea** (citire, ÎNTÂI): `check_game_availability(gameId, date, time, partySize, exclusive?)` sau `get_game_slots(gameId, date, partySize?)`. Detalii: `list_portal_games`, `get_game_details`.
6. **Rezervă** `create_game_reservation` (modul `rezervari_clienti`): `gameId*`, `date*`, `startTime*`, `endTime*`, `partySize*`, `contactName*` + `contactPhone`, `childrenCount`, `adultsCount`, `isExclusive`, `totalPrice`, `notes`.
7. **Petrecere cu jocuri**: tipul de eveniment trebuie să aibă capabilitatea „Jocuri/Atracții" (vezi (a) pas 4) → jocurile intră pe fișa de eveniment cu meniu/sală/personal, P&L consolidat. UI: pagina **Jocuri** (`/portal-games`) — taburi Configurare / Program Săptămânal / Excepții Calendar / Previzualizare Sloturi / Prețuri (+ presets Lasertag/Bowling/Escape Room/VR/Arcade/Petrecere Privată). Detalii: `jocuri-activitati.md`.

## (f) Prezentare de vânzare
Tabul «Prezentare» din `/sales-crm` rulează pitch-ul de vânzare cu slide-uri dinamice (discovery → dureri → soluții → ofertă) + coach pe telefon. Construirea și rularea lui = skill-ul `construieste-prezentare` (grammar: `knowledge/prezentare-vanzare.md`). Nu o trata aici — trimite acolo.

## (g) Clienți, grupuri & loialitate (MCP) + harta câmpurilor UI-only
**Clienți/grupuri/loialitate** (modul `rezervari_clienti`):
- `create_customer`: `brandId*`, `firstName*` + `lastName`, `email`, `phone`, `birthDate` (oferte aniversare), `loyaltyPoints`, `notes` (preferințe/alergii), `tags[]` (VIP/corporate…).
- `create_customer_group`: `name*` + `description`, `allowWallet`, `allowCredits`, `allowLoyalty`, `loyaltyTiers[]`, `brandLocations[]`. `add_customer_group_member`: `groupId*`, `portalUserId*`, `firstName*`, `lastName*` + `phone`, `dateOfBirth`, `credits`, `loyaltyPoints`, `loyaltyTier`, `walletBalance`, `notes`.
- `award_loyalty_points`: `guestProfileId*`, `points*` (≠0) + `reason`, `expiresAt`, `brandId`, `locationId` (oaspeți HOTEL). Detalii: `segmentare-clienti.md`, `loialitate-fidelizare.md`.

**⚠ Câmpuri FĂRĂ tool MCP — le faci în pagină (Chrome + user logat); NU spune „nu se poate", deschide pagina cu `gaseste_in_aplicatie` și completează/ghidează:**
- **La o rezervare**: tipul rezervării/evenimentului și avansul pe acea rezervare (la creare prin tool nu există; tipurile se definesc în Setări → Sales CRM → Tipuri rezervări; câmpurile custom de formular sunt și ele UI).
- **Din fișa de Deal/Eveniment** — ce e UI-only: Produse (meniul evenimentului), Personal alocat, Prep/Producție, Cheltuieli, payment link, BEO, plus câmpurile de petrecere (tort, mascotă, decorațiuni, defalcare adulți/copii, chestionare/NPS, cronologie).
  ⚠ **NU pune aici**: etapa pipeline, Won/Lost, valoarea, agentul, avansul plătit, contractul semnat — toate se fac cu `advance_deal`. Citirea fișei: `get_event_fiche`.
- **Configurare CRM** — UI-only: regulile de capacitate, capabilitățile tipurilor, vizibilitatea câmpurilor, userii CRM (vezi (a)). Etapele și stilul CRM au tool-uri (`create_pipeline_stage`, `update_pipeline_stage`, `set_crm_settings`).
- **Joc**: imaginea; TVA/valabilitate/activ pe preț; capacitate diferită per zi (vezi (e)).
- **Prezentarea** (tabul Prezentare): integral UI → skill `construieste-prezentare`.

## Diagnostic rapid
- **„Nu văd pagina CRM"** → lipsă loc CRM nominal: nominalizează „User CRM" în Setări → Sales CRM → Useri CRM (și pentru admin).
- **„Nu apare un tab pe fișa evenimentului (Jocuri/Producție/Contract)"** → capabilitatea nu e bifată pe tipul de rezervare (`?tab=event-types`); poate fi și ascuns la nivel de brand.
- **„Vocabularul nu se potrivește"** → schimbă stilul CRM (`/settings/sales-crm` → General → Parc de Distracții).
- **„Cardul nu avansează / Won nu merge"** → lipsesc etape marcate Won/Lost în `?tab=pipelines`.
- **„Nu văd sloturi libere la un joc"** → jocul n-are program (tab Program Săptămânal gol) sau capacitate 0; sau prep neglijat suprapune sloturile.
- **„Clientul nu poate rezerva online un grup mare"** → limitele min/max sunt pe rezervările ONLINE; din POS personalul poate depăși.

## Verifică prin CITIRE (nu prin UI)
După scriere: `get_reservations_overview` / `get_game_details` / `list_portal_games` / `get_crm_funnel` confirmă. Pentru deal-uri: `get_deal` (starea exactă) și `get_crm_funnel` (pâlnia pe etape) — prin conexiune, nu vizual. Succes la tool = salvat — nu repeta, spune userului să dea refresh. Audit „cine a creat/anulat" → `jurnal_activitate` (categorii „Rezervări"/„Contracte"/„SERVICES_CRM").

## Permisiuni & legături
- Scrieri: rezervări/jocuri-rezervare/clienți/loialitate = modul **«Rezervări & Clienți»** (`rezervari_clienti`); **deal-uri/pipeline/etape/scor/follow-up = modul «CRM & Automatizări Marketing» (`marketing_crm`)**; configurare jocuri/rezervări = modul **«Setări & Configurare»** (`setari`). „Permisiune insuficientă" → modulul nu e pe token → portal Hub → Acces AI.
- Mecanica evenimentelor/rezervărilor → `rezervari-clienti-evenimente.md`; jocuri → `jocuri-activitati.md`; CRM de retenție (playbook-uri/NBA/win-back) → `crm-automatizari-playbooks.md`; segmente → `segmentare-clienti.md`; loialitate → `loialitate-fidelizare.md`; prezentări → skill `construieste-prezentare`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în app.
