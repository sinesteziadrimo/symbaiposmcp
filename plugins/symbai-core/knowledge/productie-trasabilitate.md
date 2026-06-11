# Producție & Trasabilitate (fabrică / bucătărie centrală)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt
Modulul de producție acoperă tot ce înseamnă fabricarea produselor: loturi (șarje) de producție, execuție pe stații de lucru (comenzi de lucru), planificare MPS/MRP, consum de materii prime pe lot explicit sau scanat, trasabilitate completă intrare→ieșire (genealogie + recall), containere cu cod QR, control calitate (QC hold/carantină), HACCP și comenzi B2B cu picking și livrare. Profunzimea funcțiilor depinde de **modul de producție** al afacerii (se setează în Setări → General): simplu, restaurant & evenimente sau fabrică — în modul fabrică se deblochează paginile avansate (Panou Fabrică, Execuție, Planificare MPS, B2B).

## Concepte
- **Lot de producție (șarjă)** — o „rundă" de fabricație: planifici o cantitate dintr-o rețetă, consumi ingredientele și obții un lot nou de produs finit. Are ciclu de viață: planificat → pornit → (pauză) → finalizat (sau anulat).
- **Două fluxuri de execuție** — (1) **simplu**: finalizezi lotul și sistemul face automat consumul de ingrediente + lotul nou de produs; (2) **shop-floor** (comenzi de lucru pe stații): operatorul pornește operația, declară consumul, declară producția (bun / rebut / de retușat) și finalizează de pe tabletă.
- **FEFO** — „expiră primul, iese primul": la consum, sistemul ia întâi loturile alocate/scanate explicit de operator, apoi restul după data de expirare. Abaterea de la FEFO cere o permisiune specială și un motiv declarat.
- **Lot alocat / scanat** — operatorul poate lega explicit un lot de materie primă de lotul de producție (inclusiv prin scanarea etichetei QR de pe container); stocul scade exact din lotul scanat.
- **Genealogie (trasabilitate)** — fiecare lot de ieșire e legat de loturile de intrare din care a fost făcut; mergi „înapoi" (din ce materii prime și furnizori provine) sau „înainte" (unde a ajuns un lot de materie primă).
- **Recall (retragere)** — raport de impact pe un lot problematic: ce loturi derivate și produse sunt afectate.
- **Container de producție** — recipient fizic (cuvă, tavă, navetă) cu cod QR unic, scanabil cu camera sau cu cititor; etichetele se printează din aplicație; containerul e urmărit pe etape și zone.
- **QC hold / carantină** — un lot poate fi blocat de calitate (cu motiv) până la eliberare; cât e blocat, nu poate avansa în producție.
- **Rework (retușare)** — reluarea unei șarje cu probleme = șarjă „fiică" nouă, cu propriul consum; lotul original rămâne în istoric.
- **MPS / MRP** — planul master de producție (ce, când, pe ce stație, în ce tură) și calculul necesarului net de materiale (cerere vs stoc existent vs deja programat → deficit).
- **Explozie de rețetă (BOM)** — calculul totalului de materii prime necesare pentru o cantitate dată; e instrument de previzualizare, nu mișcă stoc.
- **Flux tehnologic** — lanțul de operații prin care trece un produs (cu cerințe, dependențe, predări între stații, cerințe QC per operație).
- **Zone & echipamente** — zonele de producție (ex. Bucătărie Caldă, Patiserie) cu echipamentele lor; fiecare echipament poate avea capacitate configurată per rețetă (max per lot, timp de ciclu, timp de pregătire).
- **Ture de producție** — schimburi definite (ex. Dimineață 06:00–14:00) cu angajați asignați pe zile.

## Paginile modulului

### Execuție și monitorizare (mod fabrică)
- **Panou Fabrică** (`/factory-dashboard`) — „Control Tower": monitorizarea live a întregii fabrici. Taburi: Vedere generală, Live, Alerte, Lipsuri (materiale), Blocaje, QC, KPI, Pipeline, Trasabilitate, Livrări, Schimburi. KPI-uri: Yield, OEE (cu defalcare Disponibilitate/Performanță/Calitate), On-Time Delivery, Waste, First Pass Yield, plus rebut și retușări în kg. *Doar mod fabrică.*
- **Execuție Producție** (`/production`) — monitorizare și control operații: taburi Execuție, Operații Active, Consumuri & Pierderi, Predări, KPI Live, Containere & QR (cu buton „Scanner Mobil"). De aici pornești operații, declari output și finalizezi. *Doar mod fabrică.*
- **Tabletă Stație** (`/workstation-tablet`) — ecran full-screen pentru operatorii din fabrică: alegi/creezi o stație, apoi tableta arată operațiile stației. Operatorul pornește operația (în funcție de cum e configurată, cu scanarea legitimației sau a unui cod de bare), declară consumul (cu scanarea lotului care intră în operație), declară producția (cantitate bună / rebut), printează etichete. Aspectul e configurabil (temă, coloane, ce informații se văd, imprimantă). *Doar mod fabrică.*

### Planificare și configurare
- **Planificare MPS/MRP** (`/planificare-mps`) — planificarea producției: taburi Calendar Operații, Planificare MRP (cerințe nete), Coproduse & Subproduse, Monitorizare, Trasabilitate, Bottleneck, Productivitate, Loturi Planificate (din comenzi B2B sau cereri interne), Flux Fabrică, Configurare. Include alerte WIP și avertizări FEFO. *Doar mod fabrică.*
- **Fluxuri Tehnologice** (`/fluxuri-tehnologice`) — configurezi fluxurile de producție: operațiile și cerințele pentru fiecare produs, cu versiuni de flux. *Disponibilă de la modul restaurant & evenimente în sus.*
- **AI Flow Builder** (`/ai-flow-builder`) — construiești fluxuri tehnologice prin conversație: descrii în chat fluxul dorit și AI-ul îl construiește. *Cere modul fabrică (altfel afișează „Mod Fabrică necesar").*
- **Echipamente & Zone** (`/production/equipment-zones`) — configurezi zonele de producție, echipamentele din fiecare zonă și capacitățile per rețetă. *Disponibilă de la modul restaurant & evenimente în sus.*

### Producție pentru restaurant / evenimente
- **Producție** (`/productie-evenimente`) — pagina de producție pentru restaurante și evenimente: taburi Calendar & Capacitate, Loturi Producție, Rețete, plus Operații/Echipamente după mod. Buton „Adaugă Lot Producție"; de la modul restaurant & evenimente apare și „Adaugă Eveniment". Titlul se adaptează modului („Producție", „Producție & Evenimente"). *Ascunsă în mod fabrică (acolo folosești /production și /planificare-mps).*

### Loturi, containere, trasabilitate
- **Loturi & WIP** (`/loturi-wip`) — centrul de trasabilitate: taburi Loturi, Transferuri, Containere, QC Holds, Alocări, Genealogie, Stoc Producție, Istoric & Jurnale (taburile Containere/QC/Alocări/Stoc apar doar în mod fabrică). În Genealogie cauți un lot după ID sau număr și vezi materiile prime/sursele (înapoi) sau produsele derivate (înainte) + raportul de recall cu loturile afectate. Alias: `/stoc-productie` redirecționează aici.
- **Scanner Containere** (`/production/scanner`) — scanezi QR-ul unui container cu camera sau cu cititorul de coduri; apoi poți: porni/finaliza operația pe container, avansa etapa, semnala o problemă QC, împărți sau uni containere, printa eticheta, reasigna zona/echipamentul. Containerele blocate la QC nu pot fi avansate/împărțite/unite.
- **Detaliu Container** (`/c/:codQR`) — pagină publică deschisă direct la scanarea etichetei QR (fără navigare în aplicație): informații container, locație actuală, istoricul evenimentelor, trasabilitate.

### Comenzi și calitate
- **Comenzi B2B** (`/b2b-orders`) — clienții business ai fabricii: taburi Comenzi, Clienți & Depouri, Catalog Produse, Picking & Expediere, Livrări, Analiză & Rapoarte. Comenzile B2B alimentează loturile planificate din MPS. *Doar mod fabrică.*
- **HACCP & Siguranță** (`/haccp`) — siguranță alimentară: taburi Temperaturi, Curățenie & Igienă, Incidente & Retrageri, Senzori IoT, Răcire Rapidă, Mostre Retenție, Audituri IFS/BRC. *Disponibilă de la modul restaurant & evenimente în sus.*

### AI
- **Agent Producție AI** (`/factory-ai`, în meniu „Agent AI Fabrică") — chat dedicat producției: întrebi despre producție, rețete, loturi, QC, KPI și primești răspunsuri din datele fabricii. *Cere modul fabrică (altfel afișează „Mod Fabrică necesar").*

## Fluxuri frecvente

**1. Produci un semipreparat (flux simplu)**
1. Mergi la `/productie-evenimente` → „Adaugă Lot Producție" (alegi rețeta și cantitatea).
2. La finalizarea lotului, sistemul consumă automat ingredientele după rețetă (FEFO) și creează lotul nou de produs finit, cu genealogie completă.

**2. Execuți o operație pe stație (shop-floor)**
1. Operatorul deschide Tableta Stației (`/workstation-tablet`) sau `/production` → tab Execuție.
2. „Pornește Operație" → declară consumul (alege sau scanează lotul de materie primă care intră) → „Declară Output" (cantitate bună, rebut) → „Finalizează Operație". Dacă pașii obligatorii lipsesc (consum nedeclarat, etichetă neprintată), sistemul te avertizează și blochează finalizarea.

**3. Faci trasabilitate / pregătești un recall**
1. `/loturi-wip` → tab Genealogie → caută lotul după ID sau număr.
2. Direcția „înapoi" arată materiile prime și furnizorii din spatele lotului; direcția „înainte" arată unde a ajuns lotul + raportul de recall cu impactul (loturi afectate).

**4. Blochezi un lot la calitate (carantină)**
1. `/loturi-wip` → tab QC Holds → „Blochează" pe lot, cu motiv.
2. Lotul rămâne blocat (containerele lui nu pot avansa) până la eliberare de către o persoană autorizată.

**5. Planifici producția săptămânii**
1. `/planificare-mps` → tab Planificare MRP: vezi cerințele nete (cerere − stoc − deja programat).
2. Tab Loturi Planificate: transformi cererea (din comenzi B2B sau cereri interne) în loturi programate pe stații și ture; Calendar Operații arată programul.

**6. Lucrezi cu containere pe fluxul fizic**
1. Printezi eticheta QR a containerului (din Execuție Producție → Containere & QR sau de pe tabletă).
2. La fiecare etapă, scanezi containerul cu `/production/scanner` și avansezi etapa, semnalezi probleme sau împarți/unești conținutul; oricine scanează eticheta vede pagina `/c/:codQR`.

**7. Definești fluxul tehnologic al unui produs nou**
1. Manual: `/fluxuri-tehnologice` (operații, cerințe, versiuni) + `/production/equipment-zones` (zone, echipamente, capacități).
2. Cu AI: `/ai-flow-builder` — descrii procesul în chat și AI-ul construiește fluxul.

## Tool-uri MCP utile

### Citire (nu cer permisiune de modul)
- `exec_list_batches` / `exec_get_batch_progress` / `exec_list_active_operations` — loturile de producție, progresul unui lot (pași, materiale, output), operațiile în curs.
- `exec_trace_lot_origin` / `exec_trace_lot_destination` — trasabilitate înapoi (din ce provine un lot) și înainte (unde a fost consumat un lot de materie primă).
- `exec_get_lot_qc_status` / `list_quality_holds` / `list_qc_inspections` / `get_qc_stats` / `get_defect_pareto` — statusul de calitate al unui lot, blocajele active, inspecțiile, statistici și analiza defectelor.
- `list_planned_lots` / `list_mps_schedule` / `get_mps_net_requirements` — loturile planificate, programul MPS, necesarul net de producție.
- `get_factory_dashboard` / `get_daily_production_summary` / `get_yield_trends` / `get_waste_report` / `detect_production_bottlenecks` — starea fabricii, sumarul unei zile, trendul randamentului, pierderile, gâtuirile.
- `get_production_stock_overview` / `get_semipreparate_stock` / `get_stock_levels` — stoc semifabricate/produse finite cu valabilitate, stoc semipreparate, stoc general.
- `list_production_zones` / `list_production_equipment` / `list_equipment_capacities` / `get_equipment_utilization` / `list_zone_warehouse_mappings` — infrastructura fabricii și utilizarea ei.
- `list_production_shifts` / `get_shift_detail` — turele de producție și detaliile unei ture pe zi (angajați, loturi, KPI live).
- `run_bom_explosion` / `get_recipe_details` / `get_production_sheet_config` — necesarul de materii prime la o cantitate dată, detaliile rețetei, fișa de producție.

### Scriere — cer modulul de permisiune `productie` pe token
- Loturi: `exec_create_batch`, `exec_update_batch`, `exec_start_batch`, `exec_stop_batch`, `exec_resume_batch`, `exec_complete_batch`, `exec_reschedule_batch`.
- Execuție operații: `exec_declare_consumption` (consum materii prime pe o operație), `exec_declare_output` (cantitate bună/rebut/de retușat).
- Planificare: `create_mps_entry`, `update_mps_entry`, `create_production_shift`, `update_production_shift`, `create_shift_assignment`.
- Calitate: `create_quality_hold`, `release_quality_hold`.
- Infrastructură: `create_production_zone`, `update_production_zone`, `create_production_equipment`, `update_production_equipment`, `set_equipment_recipe_capacity`, `assign_recipe_to_zone`.

### Scriere — alte module
- Rețete (modul `retete`): `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `bulk_replace_recipe_ingredients`, `add_recipe_outputs`, `set_recipe_labels`, `set_production_sheet_config`.
- HACCP (modul `setari`): `create_haccp_sensor` (senzori de temperatură), `create_cleaning_task` (checklist de igienă).

⚠ Fluxurile tehnologice (creare/modificare operații de flux) și acțiunile pe containere (scanare, split/merge, predări) NU au tool-uri MCP — se fac doar din aplicație.

## Întrebări frecvente și capcane
- **De ce nu văd Panou Fabrică / Execuție Producție / Planificare MPS / Comenzi B2B?** → Sunt pagini disponibile doar în modul de producție „fabrică" (Setări → General). În modul restaurant folosești `/productie-evenimente`.
- **De ce nu găsesc pagina „Producție" (`/productie-evenimente`)?** → În modul fabrică ea e ascunsă intenționat — echivalentul ei e `/production` (execuție) + `/planificare-mps` (planificare).
- **De ce a scăzut stocul din alt lot decât cel pe care îl voiam?** → Dacă operatorul nu a alocat/scanat explicit lotul, consumul merge automat după FEFO (expiră primul). Alocă sau scanează lotul dorit înainte de consum; abaterea de la FEFO cere permisiune specială.
- **Pot anula un lot ca să-mi recuperez ingredientele?** → Nu — oprirea/anularea nu reface stocul deja consumat. Pentru o șarjă cu probleme folosești rework: o șarjă „fiică" nouă, cu propriul consum.
- **Numărul de lot apare de mai multe ori — e o eroare?** → Numerele de lot se pot repeta; identificatorul fizic unic este codul QR al containerului, nu numărul lotului.
- **De ce nu pot avansa/împărți containerul?** → Containerul are lotul blocat la QC (carantină); acțiunile sunt dezactivate până la eliberarea blocajului de calitate.
- **Planificarea MRP / explozia de rețetă mi-a „consumat" stocul?** → Nu — planificarea și explozia BOM sunt doar previzualizări; stocul se mișcă numai la consum/finalizare de lot.
- **Rețeta e în grame, produsul în kilograme — se încurcă?** → Nu — conversiile de unități (g/kg, ml/l) se aplică automat în toate calculele de consum și cost de producție.
- **Costul producției apare în rapoarte?** → Da — costul real al producției intră în costul mărfii vândute (COGS) din P&L.
- **Clientul/inspectorul poate vedea un container fără cont?** → Da — pagina `/c/:codQR` e publică și se deschide direct la scanarea etichetei QR.

## Pentru acces SQL
Tabele relevante: `production_batches` (loturi/șarje), `inventory_lots` (loturi de stoc), `genealogy_edges` (trasabilitate intrare→ieșire), `production_containers` (containere cu QR), `batch_material_links` (loturi alocate explicit pe șarjă), `operation_executions` (execuții de operații shop-floor), `planned_lots` (loturi planificate), `quality_hold_events` (blocaje QC), `inventory_documents` + liniile lor (documentele de consum și de producție).
Exemple: „câte loturi am finalizat luna aceasta și cu ce cantități", „ce loturi de materie primă au intrat în lotul X" (prin genealogy_edges), „ce loturi sunt acum în carantină".
