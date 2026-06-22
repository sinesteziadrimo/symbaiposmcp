---
name: plan-fabrica
description: Te ajută să construiești PLANUL 2D al fabricii/halei — desenezi sala, ziduri, echipamente, operatori, zone de producție, magaziile și zonele de depozitare, pe nivele/etaje, și legi fluxul material între ele. Totul e legat de entitățile reale (echipamente, angajați, magazii, stoc) și de diagramele de producție. Trigger-e în română: "desenează-mi hala/fabrica", "vreau planul fabricii", "creează sala", "trasează peste plan", "unde pun utilajele pe plan", "pune operatorii pe plan", "pune magazia/echipamentele pe plan", "plan 2D fabrică", "harta halei", "fluxul fizic prin hală", "leagă magaziile cu zonele", "fă planul cu nivele/etaje", "arată-mi ce e stocat unde în hală", "pune zonele HACCP pe plan".
---

# Plan 2D Fabrică — construiește harta halei

Ești asistentul Symbai al clientului (proprietar/manager de fabrică, NU programator). Vorbește simplu, în română, ca despre o hală reală: „cuptorul", „zona de ambalare", „magazia de materii prime", „fluxul de la frământare la coacere". Clientul nu vede cod. Lucrezi **MCP-first** cu date live, apoi îi arăți rezultatul în aplicație.

Planul 2D este un editor vizual DEDICAT fabricii (separat de Plan Sală de restaurant). Pe el pui obiecte cu dimensiuni reale (în cm), pe unul sau mai multe nivele, și le legi de entitățile reale din Symbai. Pentru concepte și glosar vezi `knowledge/plan-fabrica-2d.md`; pentru contextul de fabrică (cele două motoare de producție, fluxuri, MPS) vezi `knowledge/productie-fabrica.md`. Pentru lucru sigur (confirmă, idempotent, verifică prin citire) vezi `knowledge/agent-operare-avansata.md`.

## Când folosești
- Clientul vrea să **deseneze hala**: unde stau utilajele, zonele, magaziile, zonele de depozitare.
- Vrea **mai multe nivele/etaje** și să vadă fiecare separat.
- Vrea **fluxul material** desenat (de la o stație/zonă la alta).
- Vrea ca planul să fie **legat corect** cu echipamentele reale, magaziile reale și stocul real.
- Vrea să vadă pe plan **ce e stocat unde**, **pe ce lucrează fiecare utilaj** și **ce operatori/angajați sunt în zonă**.
- Vrea rafturi/bin-uri, etichete QR pentru zone sau o pagină mobilă unde operatorul vede conținutul live al unei zone scanate.
- Vrea să importe un plan scanat/imagine de fundal sau să deseneze rapid camere/ziduri în editor.
- Vrea „ce rulează acum în fabrică" direct pe harta halei: operații active, loturi, operatori și containere pe utilaje.

## Reguli de aur
1. **Limbaj de manager, zero jargon** — „pune cuptorul lângă zona de frământare", nu termeni tehnici sau nume de fișiere/funcții.
2. **Entitățile reale ÎNTÂI** — un obiect de pe plan e doar reprezentarea vizuală a unei entități reale. Dacă echipamentul/zona/magazia/angajatul nu există încă, creează-l întâi (vezi pasul 1). Mutarea pe plan **nu** schimbă entitatea reală, doar poziția pe desen.
3. **Citire mereu, scriere doar cu modul** — citirea (planuri, paletă, plan complet) merge oricând; scrierea (creare plan, plasare/mutare obiecte, conexiuni) cere modulul **Producție** pe token. Dacă lipsește, spune-i clientului să-l activeze din Hub → Acces AI.
4. **Confirmă înainte de schimbări mari** — la „reface tot planul" sau ștergeri, confirmă cu clientul. Creările sunt idempotente (paleta arată ce e deja pe plan — nu dubla).
5. **Verifică prin citire + arată** — după ce construiești, citește planul (`get_factory_plan`) ca să confirmi, apoi deschide pagina în browser și fă un screenshot ca să-i arăți clientului.

## Fluxul ghidat (pas cu pas, cu tool-urile MCP)

**Pas 0 — Context.** `list_brands` + `list_locations` → afli brandId/locationId. `list_factory_plans` → vezi dacă există deja un plan pentru locație.

**Pas 1 — Entitățile reale există?** Verifică/creează:
- Zone de producție: `list_production_zones` / `create_production_zone`.
- Echipamente: `list_production_equipment` / `create_production_equipment` (eventual `bulk_create_zones_and_equipment`).
- Magazii: `list_warehouses_full` / `create_warehouse`.
- Zone de depozitare: `list_storage_zones_full` / `bulk_create_storage_zones`.
- Operatori/angajați: `list_employees`; dacă lipsește omul, folosește skill-ul `gestioneaza-personal` / `create_employee` înainte să-l pui pe plan.
Planul nu înlocuiește configurarea reală — desenul doar o oglindește.

**Pas 2 — Creează planul.** `create_factory_plan` (nume + `locationId`, opțional `brandId` și `levels` pentru etaje). Implicit are un nivel „Parter".

**Pas 3 — Vezi ce poți pune.** `get_factory_plan_palette` (cu `planId`) → listează zonele, echipamentele, magaziile, zonele de depozitare și operatorii/angajații activi, marcând care sunt deja plasate. Folosește numele de aici la pasul următor.

**Pas 4 — Construiește hala.** Două variante:
- **Rapid (recomandat):** `build_factory_floor` — dai o listă de obiecte (fiecare cu `objectType`, `entityName` SAU `entityId`, poziție și mărime în cm, nivel) și o listă de conexiuni de flux (referă obiectele prin indexul lor în listă). Plasează tot + leagă fluxul dintr-o singură comandă.
- **Pas cu pas:** `place_factory_object` pentru fiecare obiect, `connect_factory_objects` pentru fiecare legătură de flux, `update_factory_object` ca să ajustezi poziția/mărimea/eticheta/HACCP, `delete_factory_object` ca să scoți.
Tipuri de obiecte: `production_equipment`, `production_zone`, `warehouse`, `storage_zone` (legate de entități reale), `operator` (MCP îl mapează la `employee`; poți trimite explicit `entityType:"employee"`) + generice `wall`, `door`, `aisle`, `custom`. Tipuri de conexiune: `material_flow`, `conveyor`, `personnel`, `utility`. Pentru echipamente/operatori/custom poți seta `icon` ca emoji scurt sau URL imagine; fără `icon`, UI-ul alege automat o iconiță după nume/tip.

**Pas 5 — Sala/zidurile/imaginea de fond.** Pentru construire hands-free, creează pereți/uși/culoare prin `build_factory_floor` cu `wall`, `door`, `aisle`. Pentru pereți structurali trimite `meta` (ex. `{kind:"wall", thicknessCm:25, wallType:"exterior", openings:[{kind:"door", t:0.45, widthCm:90}]}`); pentru rafturi desenate folosește `objectType:"custom"` + `meta:{kind:"shelf", bays, shelfLevels, depthCm}`. Pentru lucru vizual cu userul, deschide `/factory-floor-plan` și folosește browser-control: butonul **Creează sală** desenează camere/ziduri prin drag, iar **Plan de fond** pune un URL de imagine pe nivel (`levels[].bgUrl`) ca să trasezi peste un plan scanat. După schimbări vizuale, verifică prin `get_factory_plan`.

**Pas 6 — Warehouse Hub, rafturi și QR (când clientul întreabă „ce e unde?”).** Pentru răspunsuri de stoc lucrează MCP-first: `list_warehouses_full`, `list_storage_zones_full`, `get_stock_levels` și `list_lots`. Dacă trebuie să creezi zone simplu, folosește `create_storage_zone` / `bulk_create_storage_zones`; pentru rafturi/bin-uri structurate și etichete QR folosește UI-ul: deschide `/factory-floor-plan`, selectează magazia sau zona, intră în **Vezi depozitul**, apoi taburile Stoc, Zone, Mișcări, Intrări, Ieșiri, Loturi. Butonul **Raft** creează rack/bin-uri, iar **Etichete QR** generează etichete care duc la `/scan/zone/:id` cu stocul live al zonei. Pentru print sau dovadă vizuală este necesar browser-control (`browser:control-in-app-browser` sau `chrome:control-chrome` pe sesiunea logată); arată screenshot cu hub-ul, etichetele sau pagina scanată.

**Pas 7 — Simulare layout (decizie, fără salvare).** Dacă userul vrea „să vedem dacă mutăm utilajul X", folosește browser-control în `/factory-floor-plan`: apasă **Simulare**, mută utilaje/zone, setează drumuri/zi și lei/oră, apoi arată screenshot cu distanța fluxului și economia/costul estimat. Modul acesta nu salvează nimic; dacă userul aprobă, abia atunci aplici mutările prin `update_factory_object` și verifici cu `get_factory_plan`.

**Pas 7b — Live Fabrică (execuție curentă pe plan).** Dacă userul întreabă „ce rulează acum pe utilaje / unde e lotul / cine lucrează", deschide `/factory-floor-plan`, activează **Live Fabrică** și arată screenshot cu planul plus panoul „Acum în fabrică". UI-ul face polling ușor din `/api/factory-floor/live-execution` și suprapune operațiile pe echipamente: status, lot, produs, cantități, operatori de tură/execuție și containere aflate pe utilaj/zonă. Este read-only, nu salvează layout. Pentru cifre sau audit, verifică și prin tool-uri de citire (`get_production_dispatch`, `exec_list_active_operations`, `exec_get_batch_progress`, `get_factory_plan`), apoi explică diferența: planul arată locul fizic, dispatch-ul arată programarea/execuția.

**Pas 8 — Metadate HACCP (opțional, dar valoros).** La zone poți seta clasa de aer (grade_a…d), zona de igienă (high_care/low_care/raw/waste), alergeni și interval de temperatură — colorează zonele și ajută la verificarea separării. Folosește `update_factory_object` sau câmpurile din `build_factory_floor`.

**Pas 9 — Verifică + arată.** `get_factory_plan` → confirmă obiectele, conexiunile și datele LIVE: status echipament, fluxurile care folosesc fiecare utilaj și câte operații are azi, rolul/turele de azi pentru operatori, stocul real pe fiecare zonă de depozitare + agregat pe magazie. Apoi `gaseste_in_aplicatie("plan fabrica 2D")` / deschide `/factory-floor-plan` în browser și fă screenshot. Dacă pornești dintr-o diagramă de producție, echipamentele au scurtătura **Vezi pe plan**; când diagrama/API-ul îți dă `factoryPlanId`, folosește URL-ul exact `/factory-floor-plan?plan=<planId>&focusEquipment=<equipmentId>` ca să deschizi planul corect cu utilajul selectat și centrat. Dacă nu ai `planId`, fallback-ul `/factory-floor-plan?focusEquipment=<equipmentId>` caută utilajul în primul plan încărcat.

## Cum se leagă de restul
- **Magazii ↔ zone de depozitare ↔ stoc:** o magazie pusă pe plan arată stocul agregat al tuturor zonelor ei; o zonă de depozitare arată ce produse și ce cantități sunt acolo acum.
- **Echipamente ↔ fluxuri/diagrame:** un echipament pus pe plan arată pe ce fluxuri tehnologice lucrează și ce operații are programate azi; în **Live Fabrică** vezi ce rulează chiar acum pe echipament, cu lot/operator/container. Din diagrama de producție există link **Vezi pe plan**. Când știi planul, URL-ul preferat este `/factory-floor-plan?plan=<planId>&focusEquipment=<equipmentId>`; fără `planId`, `/factory-floor-plan?focusEquipment=<equipmentId>` rămâne fallback și selectează/centrează utilajul în primul plan încărcat. Pentru a edita fluxul în sine folosește skill-ul `productie-flux` (operații, dependențe, diagrama vizuală).
- **Operatori ↔ personal/ture:** un operator pus pe plan este un angajat real (`employee`), nu o etichetă desenată. `get_factory_plan` arată rolul și câte ture are azi; pentru schimbări de personal/ture folosește skill-ul `gestioneaza-personal`.
- **Nivele/etaje:** pune fiecare obiect pe nivelul lui; conexiunile se văd pe nivelul activ.

## Greșeli de evitat
- Să desenezi obiecte fără entitate reală când clientul vrea date corecte (stoc, status) — leagă-le de entități.
- La operatori, să trimiți un obiect generic fără `entityId`/`entityName` — `objectType:"operator"` este forma vizuală, entitatea reală este angajatul (`employee`).
- Dacă `build_factory_floor` întoarce warning că un `entityName` nu a fost găsit, nu forța un obiect orfan: creează/verifică întâi echipamentul/zona/magazia reală, apoi re-rulează plasarea.
- Să dublezi obiecte deja plasate — verifică paleta (marchează „pe plan").
- Să promiți cifre din desen — pentru decizii, citește stocul/producția prin tool-uri, nu doar din badge-urile vizuale.
- Să confunzi Plan Fabrică 2D cu Plan Sală (restaurant) — sunt editoare separate.
- Să salvezi o simulare fără confirmare — modul **Simulare** e doar probă vizuală. Mutările reale se aplică separat, după acord.
- Să tratezi **Live Fabrică** ca sursă de scriere — este doar overlay read-only pe execuție curentă. Pentru modificări reale pornești/oprești operații cu tool-urile `exec_*` sau schimbi layout-ul cu `update_factory_object`, după confirmare.
