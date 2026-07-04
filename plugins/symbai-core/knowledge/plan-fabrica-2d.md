# Plan 2D Fabrică — concepte și glosar

Planul 2D al fabricii este harta vizuală a halei: un desen la scară reală pe care pui echipamentele, operatorii/angajații, zonele de producție, magaziile și zonele de depozitare, pe unul sau mai multe nivele, și legi fluxul material dintre ele. Este un editor DEDICAT fabricii, separat de Plan Sală (care e pentru mesele de restaurant). Pagina: **Plan Fabrică 2D** (`/factory-floor-plan`), în meniul Producție, modul fabrică.

Pentru fluxul pas-cu-pas de construire vezi skill-ul `plan-fabrica`. Pentru contextul general de fabrică (cele două motoare de producție, fluxuri tehnologice, MPS/MRP, HACCP) vezi `productie-fabrica.md`.

Tool-uri MCP recomandate, în ordine: `list_factory_plans` / `create_factory_plan` pentru plan, `get_factory_plan_palette` pentru entitățile reale disponibile (inclusiv operatori), `build_factory_floor` pentru construire rapidă din obiecte + conexiuni, `place_factory_object` / `update_factory_object` cu `meta` pentru pereți/rafturi, `update_factory_plan` pentru nivele/imagine de fundal (`levels[].bgUrl`), apoi `get_factory_plan` pentru verificare live. Pentru staffing real folosește `list_operator_equipment`, `assign_operator_to_equipment`, `set_zone_responsibles` / `assign_operator_to_zone`, `assign_operator_to_shift`, `get_operator_assignments` și `get_staffing_coverage`.

## De ce există
Un owner de fabrică vrea să „vadă" hala: unde stă fiecare utilaj, unde lucrează oamenii, pe unde curge marfa, ce e stocat unde, ce zone sunt „curate" (high-care) și care „murdare" (materii prime / deșeuri). Planul 2D dă această imagine, legată de datele reale — nu e un desen mort, ci o oglindă vie a fabricii.

## Concepte centrale
- **Plan** — un desen al unei hale, pentru o locație. Poate avea mai multe **nivele/etaje** (Parter, Etaj 1, …). Are o **grilă** (snap) în cm pentru aliniere ușoară.
- **Obiect** — orice piesă de pe plan, cu poziție și mărime reală (în cm) și nivel. Tipuri:
  - **Echipament** — un utilaj real (cuptor, malaxor, ambalator). Legat de echipamentul din Echipamente & Zone.
  - **Zonă de producție** — o arie (frământare, coacere, ambalare). Legată de zona reală.
  - **Magazie** — un depozit real (cu cod, locație).
  - **Zonă de depozitare** — o sub-zonă a unei magazii (raft/secțiune) unde stă marfa.
  - **Operator** — un angajat real pus pe plan (`objectType:"operator"`; MCP îl mapează la `employee`, sau trimiți explicit `entityType:"employee"`), cu rol, turele de azi, utilaje pe care e calificat, zone de care răspunde, stația alocată și task-uri la citire.
  - **Generice** — perete, ușă, culoar, obiect custom (fără entitate reală, doar desen). Pentru pereți/rafturi structurale folosește `meta`: perete `{kind:"wall", thicknessCm, wallType, openings:[{kind:"door"|"window", t, widthCm, sillCm?}]}`, raft custom `{kind:"shelf", bays, shelfLevels, depthCm}`.
- **Conexiune (flux)** — o săgeată între două obiecte care arată cum curge ceva: **material** (marfa de la o stație la alta), **conveior**, **personal** (traseu oameni), **utilitate**. Aceasta e „spaghetti diagram"-ul fizic al halei.
- **Metadate HACCP** — pe zone poți marca: clasa de aer (grad A–D), zona de igienă (high-care / low-care / materii prime / deșeuri), alergenii și intervalul de temperatură. Colorează zonele și ajută la verificarea separării de risc.
- **Imagine de fond / trasare peste plan** — fiecare nivel poate avea `bgUrl`, un plan scanat sau o imagine peste care trasezi ziduri și obiecte în UI. În editor există și modul **Creează sală** pentru desenat camere/ziduri prin drag; prin MCP creezi aceleași ziduri ca obiecte `wall`.
- **Iconiță / imagine obiect** — echipamentele, operatorii și obiectele custom pot avea `icon`: emoji scurt sau URL imagine. Dacă lipsește, UI-ul alege automat o iconiță după nume/tip.

## Cum se leagă de restul (informații vii)
- **Magazie → stoc agregat:** o magazie pusă pe plan arată cantitatea totală și numărul de produse din toate zonele ei de depozitare.
- **Zonă de depozitare → stoc real:** arată exact ce produse și ce cantități sunt acolo acum.
- **Warehouse Hub pe plan:** când selectezi o magazie sau o zonă de depozitare în `/factory-floor-plan`, panoul **Vezi depozitul** deschide hub-ul cu taburi Stoc, Zone, Mișcări, Intrări, Ieșiri și Loturi. Pentru rafturi folosești butonul **Raft** (creează rack/bin-uri), iar **Etichete QR** generează etichete scanabile; scanarea duce operatorul pe pagina mobilă `/scan/zone/:id`, cu stocul live al zonei.
- **Echipament → fluxuri + azi + operatori calificați:** un echipament arată pe ce fluxuri tehnologice (rețete/produse) lucrează, câte operații are programate azi și ce operatori sunt calificați pe el. Statusul lui (liber / în lucru / mentenanță) apare ca un punct colorat.
- **Live Fabrică pe plan:** în `/factory-floor-plan`, butonul **Live Fabrică** suprapune execuția curentă peste harta fizică: operații active/planificate azi pe echipamente, lot, produs, cantități, operatori și containere aflate la locație. Datele se împrospătează automat la câteva secunde; modul e doar de vizualizare și nu modifică layout-ul.
- **Explorează Fabrica (`/factory-explorer`):** este vizualizatorul managerului, separat de editor. Are aceeași hartă, dar cu search, zoom, selector de zi, Gantt pe utilaje, scrubber de timp pe axa zilei și panouri clickabile pentru zonă, magazie/raft, utilaj, operator și produs. Folosește-l când userul vrea să înțeleagă „ce se întâmplă" sau „ce se întâmpla la ora X", nu când vrea să mute/deseneze obiecte.
- **Operator → calificări + ture + stație:** un operator legat de un angajat arată rolul, turele de azi, utilajele pe care e calificat, zonele de care răspunde, stația alocată și câte task-uri are azi. Calificările pe utilaje se scriu cu `assign_operator_to_equipment`, responsabilii cu `set_zone_responsibles` / `assign_operator_to_zone`, iar stația zilei cu `assign_operator_to_shift`; confirmă cu managerul înainte de scriere.
- **Diagrame de producție:** echipamentele și zonele de pe plan sunt aceleași entități care apar în diagramele de flux de producție — planul arată locul FIZIC, diagrama arată SECVENȚA operațiilor. Din diagrama de producție poți apăsa **Vezi pe plan** pe un echipament; când planul este cunoscut, pagina se deschide ca `/factory-floor-plan?plan=<planId>&focusEquipment=<equipmentId>` și selectează utilajul pe planul corect. Fallback-ul `/factory-floor-plan?focusEquipment=<equipmentId>` rămâne util când agentul nu are `planId`.

## Glosar rapid
- **Nivel / etaj** — un strat al planului; comuți între ele cu tab-urile de sus.
- **Grilă / snap** — aliniere automată a obiectelor la o rețea (ex. la fiecare 10 cm).
- **Paletă** — lista entităților reale disponibile de pus pe plan; cele deja puse sunt marcate.
- **Plan de fond** — imagine de fundal pe nivel (`bgUrl`), utilă când clientul are o schiță sau un plan scanat.
- **Selecție multiplă în editor** — în `/factory-floor-plan`, modul Selectează permite click pe obiect, drag pe spațiul gol pentru dreptunghi de selecție, Shift/Ctrl/Cmd+click pentru adăugare/scoatere din selecție și mutarea întregului grup prin drag pe un obiect selectat. `Delete`/`Backspace` șterge selecția (cu confirmare când sunt mai multe obiecte). `Space` sau butonul din mijloc + drag mută harta; redimensionarea și panoul Proprietăți apar doar când este selectat un singur obiect.
- **Simulare layout** — modul UI „Simulare" din `/factory-floor-plan` permite mutarea utilajelor fără salvare și calculează distanța fluxului, impactul pe transport și cost lunar estimat (drumuri/zi + tarif lei/oră). E pentru decizie și dovadă vizuală, nu scrie în baza de date.
- **Live Fabrică** — modul UI read-only din `/factory-floor-plan` pentru „ce se întâmplă acum": status operație, lot, operatori și containere pe utilaje/zone. Pentru audit sau cifre finale, verifică și prin tool-uri de citire (`get_production_dispatch`, `exec_list_active_operations`, `exec_get_batch_progress`).
- **Explorează Fabrica** — pagina read-only `/factory-explorer`: căutare rapidă prin hală, panouri de detaliu cross-linkate și Gantt „Operațiile zilei" cu scrubber de timp. Tragi pe timeline ca să vezi operațiile active la ora aleasă; badge-ul amber revine la live-acum. Este pentru investigație și dovadă vizuală; nu salvează layout și nu pornește/oprește operații.
- **Obiect orfan** — un obiect a cărui entitate reală a fost ștearsă din sistem; apare cu avertisment (planul nu se strică, dar îl poți curăța).
- **high-care / low-care** — zone cu risc mic / mai mare de contaminare; nu se amestecă cu materii prime sau deșeuri.

## Întrebări tipice ale clientului
- „Desenează-mi hala cu cuptorul, frământarea, ambalarea și magazia, și leagă fluxul." → vezi skill-ul `plan-fabrica`.
- „Am o poză cu planul halei, trasează peste ea." → setează `levels[].bgUrl` cu `update_factory_plan` sau deschide UI-ul și folosește **Plan de fond** + **Creează sală**.
- „Vreau să testez dacă mutăm cuptorul lângă ambalare / care layout e mai eficient." → deschide `/factory-floor-plan`, apasă **Simulare**, mută utilajele, setează drumuri/zi și lei/oră, apoi arată screenshot cu distanța/costul actual vs simulat. Nu folosi `update_factory_object` pentru această probă până nu confirmă clientul că vrea să salveze layout-ul.
- „Ce rulează acum pe cuptor / unde e lotul / cine lucrează?" → citește întâi prin MCP (`get_production_dispatch`, `exec_list_active_operations`, `get_factory_plan`). Pentru dovadă vizuală rapidă deschide `/factory-explorer`, caută/selectează utilajul/operatorul/produsul și arată panoul + Gantt. Dacă întrebarea are o oră anume, folosește scrubberul din timeline. Pentru overlay simplu pe editor poți folosi și `/factory-floor-plan` → **Live Fabrică**.
- „Pune operatorii pe plan." → verifică `list_employees`, apoi `place_factory_object` / `build_factory_floor` cu `objectType:"operator"` și `entityName`/`entityId` de angajat.
- „Cine poate lucra pe cuptor / pe ce utilaje e calificat Ion?" → `list_operator_equipment` (pe `equipmentId` sau `employeeId`) sau `get_operator_assignments(employeeId,date)`, apoi explici pe nume, nivel de calificare și certificare.
- „Lipsește om calificat mâine / e acoperită tura?" → `get_staffing_coverage(date)`; dacă sunt goluri, arată operația, utilajul, tura și operatorii calificați care nu sunt pe tură.
- „Setează-l pe Ion pe cuptor / responsabil pe ambalare" → confirmă că Ion este calificat/responsabil real, apoi `assign_operator_to_equipment`, `assign_operator_to_zone` / `set_zone_responsibles` și, pentru ziua respectivă, `assign_operator_to_shift`.
- „Ce e stocat în zona X?" / „cât stoc are magazia?" → se vede pe obiectul respectiv (stoc real / agregat).
- „Ce urmează să intre/iasă din magazie?" → `/factory-explorer`, click pe magazie/zonă de depozitare: panoul arată stoc acum, mișcări azi, intrări așteptate din comenzi furnizor și ieșiri/documente de stoc nepostate. Pentru cifre finale verifică și prin tool-urile de stoc/aprovizionare.
- „Unde se face produsul X?" → `/factory-explorer`, caută produsul sau intră dintr-un panou de zonă/utilaj/stoc: vezi zonele, utilajele, stocul pe magazii/zone și mișcările recente.
- „Printează etichete QR pentru rafturi/zone." → verifică întâi gestiunile și zonele (`list_warehouses_full`, `list_storage_zones_full`, `get_stock_levels`), apoi deschide `/factory-floor-plan`, selectează magazia/zona, folosește **Vezi depozitul** → **Etichete QR**. Dacă userul are nevoie de dovadă vizuală sau print, folosește extensia Chrome (dacă e conectată) pe sesiunea lui logată și arată screenshot cu etichetele sau pagina `/scan/zone/:id`.
- „Pe ce lucrează cuptorul?" → echipamentul arată fluxurile care îl folosesc + operațiile de azi.
- „Vreau două etaje." → planul suportă nivele; pui fiecare obiect pe nivelul lui.

> Important: planul oglindește datele reale, dar pentru decizii (stoc, capacitate) verifică mereu cifrele prin paginile/tool-urile de stoc și producție, nu doar din eticheta vizuală.
