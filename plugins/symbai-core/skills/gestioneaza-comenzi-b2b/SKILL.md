---
name: gestioneaza-comenzi-b2b
description: Comenzile B2B și necesarul rețelei proprii (fabrică/depozit central → magazine, francize, clienți firmă) — configurația rețelei, cerere cu sursa corectă pe produs, forecast, planificare producție, picking, rute, rampe, aviz, factură. La „ce comandă magazinele", „fă necesarul magazinului", „planifică comanda B2B", „fă avizul/factura", „a sosit mașina". Comenzi CĂTRE furnizori → comanda-furnizor.
---

# Gestionează comenzile B2B — vezi, planifică, pregătește, facturează, prin MCP, click rar

Userul poate conduce o fabrică, un distribuitor sau un lanț de restaurante/QSR cu depozit central. Același modul primește necesarul magazinelor proprii, comenzile francizelor pe alte firme și comenzile B2B. Nu presupune că orice rețea produce: citește întâi configurația și separă producția de simpla distribuție.

## Înainte de orice
1. Citește **`knowledge/b2b-comenzi-wholesale.md`** (conceptele complete: client B2B, catalog/preț contractat, bax vs bucată, punctul care primește marfa, stările comenzii, reguli de picking & documente, aviz → acceptare → factură, retail/ASN-SSCC — plus toate paginile și fluxurile), **`knowledge/agent-operare-avansata.md`** (confirm-first + verificare prin re-citire) și **`knowledge/condu-chrome.md`** (doctrina „MCP întâi → deep-link → click pe element doar la nevoie; screenshot = livrabilul"). Nu repet aici regula de Chrome — o aplici de acolo.
2. **Context**: `list_brands` + `list_locations` ca să afli `brandId`/`locationId` (multe tool-uri le acceptă ca filtru opțional). Comenzile B2B stau în cloud — `list_b2b_orders` citește direct din bază și e sursa de adevăr. În interfață, o citire eșuată apare separat de o listă goală și are buton de reîncercare; nu interpreta un mesaj de indisponibilitate ca „zero comenzi”.
3. **Înainte de necesar**: `get_b2b_distribution_network_setup` îți spune dacă brandul lucrează cu fabrică sau doar cu depozit central, ce punct este magazin propriu/franciză/B2B, zilele de livrare și sursa fiecărui produs. `depotId` este DESTINAȚIA din `list_b2b_client_depots`; nu este gestiunea-sursă.
4. **Modelul mental al stării**: `draft → confirmed →` (fazele de producție există numai pentru liniile de fabrică) `→ picking → packed → avizata → acceptata → facturata → dispatched → delivered`. Magazinele proprii sunt transfer intern; francizele/B2B sunt flux comercial între firme.

## Pagina și deep-link-urile (ca să ARĂȚI userului)
- Modulul stă pe **`/b2b-orders`**, cu 8 tab-uri: `orders`, `clients`, `catalog`, `picking`, `routes`, `delivery`, `analytics`, `network`. Pentru rețeaua fabrică/depozit central → magazine deschide direct **`/b2b-orders?tab=network`**.
- **Deep-link la o comandă anume** (ca s-o deschizi în fața userului): `/b2b-orders?order=<id>` deschide **modala de detalii** a comenzii (header cu client+stare, carduri BAX/BUC/produse/valoare, tabelul de produse, butoanele Flux producție / Planifică). `/b2b-orders?order=<id>&plan=<id>` (sau direct `?plan=<id>`) deschide **modala de planificare inteligentă** pe acea comandă.
- Rutele exacte le confirmi cu `gaseste_in_aplicatie("comenzi b2b" / "picking b2b" / "catalog b2b")` — **nu inventa URL-uri** dincolo de `?tab=`/`?order=`/`?plan=` documentate aici. Cheat-sheet în `navigare-rapida.md`.

## Fluxul hibrid — pe intenție: ce tool + unde navighezi + ce arăți

Pentru fiecare cerere: **(1) tool MCP** care face/citește treaba → **(2) deep-link** la pagina/comanda ei → **(3) screenshot** pentru user.

| Userul cere | Tool MCP | Pagina (deep-link) |
|---|---|---|
| „ce comenzi B2B am / pe ce stare / pe client" | `list_b2b_orders` (filtre `clientId`, `status`, `deliveryDate`) | `/b2b-orders?tab=orders` |
| „ce conține comanda X / arată-mi comanda" | `get_b2b_order_items(orderId)` (+ `get_b2b_order_documents` pt. ce pas urmează) | `/b2b-orders?order=<id>` |
| „ce clienți B2B am" | `list_b2b_clients` | `/b2b-orders?tab=clients` |
| „cum este configurată rețeaua / ce vine din fabrică, depozit sau furnizor" | `get_b2b_distribution_network_setup` | `/b2b-orders?tab=network` |
| „activează aprovizionarea din depozitul central pentru restaurante/magazine" | `get_b2b_distribution_network_setup` → `configure_b2b_distribution_network(brandId, enabled:true, centralWarehouseId, locationId)`; nu schimba domeniul în fabrică | `/b2b-orders?tab=network` |
| „configurează punctul magazinului/francizei și zilele de livrare" | `create_b2b_client_depot` sau `update_b2b_client_depot`, cu tipul rețelei, locația, gestiunea de recepție, brandul vânzător, calendarul, urgențele și modul de reaprovizionare | `/b2b-orders?tab=network` |
| „produsul X vine din fabrică/depozit/furnizor" | `upsert_b2b_distribution_source_rule`, la nivel de rețea/client/punct | `/b2b-orders?tab=network` |
| „ce magazine proprii/francize/puncte am și când se livrează" | `get_b2b_distribution_network_setup` sau `list_b2b_client_depots(clientId)` | `/b2b-orders?tab=network` |
| „adaugă client firmă nou" | `lookup_company_cui(cui)` → `create_b2b_client` | `/b2b-orders?tab=clients` |
| „pune preț de contract la produsul Y pt clientul Z" | `create_b2b_client_product(clientId, productId, unitPrice, …)` | `/b2b-orders?tab=catalog` |
| „înregistrează în fabrică/depozit necesarul magazinului / comanda francizei sau clientului X" | `get_b2b_distribution_network_setup` → `list_b2b_client_depots(clientId)` → `create_b2b_order(…)`; scrie local în tenantul curent și rezolvă automat sursa fiecărei linii | `/b2b-orders?tab=network` |
| „fă forecastul rețelei" | `forecast_b2b_demand`; împinge în producție numai sursa fabrică | `/b2b-orders?tab=network` |
| **„planifică producția pt comanda asta / poate fi livrată la termen / ce-mi trebuie"** | **`plan_b2b_order(orderId)`** (preview/dry-run: verdict la termen, cost/marjă, materii lipsă + furnizori, gâtuiri echipamente, tură propusă, loturi de creat — NU scrie nimic) | `/b2b-orders?order=<id>&plan=<id>` |
| **„lansează producția din comandă / aplică planul"** | **`apply_b2b_order_plan(orderId, orderMaterials?, addShift?)`** (creează loturile legate de comandă + comenzi furnizor draft pt lipsuri + tură suplimentară dacă o propune) | `/b2b-orders?order=<id>` |
| „planifică DOAR produsul X din comandă / cantitate redusă" | `plan_b2b_order(orderId, selection:{productIds:[…], qtyByProduct:{…}})` → `apply_b2b_order_plan(orderId, selection:{…})` | `/b2b-orders?order=<id>&plan=<id>` |
| „recalculează statusul comenzii (e în urma producției)" | `recompute_b2b_order_status(orderId)` | `/b2b-orders?order=<id>` |
| „confirmă comanda" (draft→confirmed) | `update_b2b_order(orderId, status:"confirmed")` | `/b2b-orders?order=<id>` |
| „configurează regulile de picking & documente pt client" | `set_b2b_picking_rules(scope:{legalEntityId:<id>}, config:{…})` | `/b2b-orders?tab=picking` (sau Setări) |
| „pregătește comanda / vezi planul de picking" | `get_b2b_picking_plan(orderId)` → `confirm_b2b_picking(orderId)` (→ packed) | `/b2b-orders?tab=picking` |
| „fă avizul / emite factura pe comanda X" | `get_b2b_order_documents(orderId)` → `generate_b2b_aviz(orderId)` → `accept_b2b_aviz(orderId, acceptedByName)` → `generate_b2b_invoice(orderId)` | `/b2b-orders?order=<id>` |
| „expediază / marchează livrată" — orice destinație | NU forța statusul cu `update_b2b_order`; pentru flota proprie planifică/aplică ruta și finalizează depozit → gestiune mașină → șofer → POD/recepție, iar pentru predare directă folosește fluxul dedicat cu dovadă | `/b2b-orders?tab=routes` |
| „împarte comenzile de mâine pe mașini / planifică rutele" | alegi `locationId` + `brandId` exacte → `plan_b2b_delivery_routes` (preview; arăți userului și păstrezi `approvalToken`) → după acord `apply_b2b_route_plan` cu același token; dacă cere reaprobare, arăți noul preview înainte de retry | `/b2b-orders?tab=routes` |
| „pe ce rampă încarcă tirurile / planifică rampele" | `get_b2b_loading_plan(runDate)` → `plan_b2b_loading_slots(runDate)`; manual: `set_b2b_run_loading_slot(runId, dockId, loadingStart)` | `/b2b-orders?tab=routes&view=timeline` |
| „a sosit mașina (de la X) — anunță echipa" | găsești cursa în `get_b2b_loading_plan` → `mark_b2b_vehicle_arrived(runId)` (push pe telefoanele echipei) | `/b2b-orders?tab=delivery` |
| „configurează-mi livrările / dispeceratul / rampele" | `get_b2b_dispatch_readiness` → `set_b2b_dispatch_settings(…)` → `configure_b2b_loading_dock(…)` — pașii compleți în `livrari-b2b-dispecerat.md` | `/b2b-orders?tab=routes` |
| „pregătește ASN/SSCC pt retail (Penny/Auchan/Kaufland)" | `get_retail_distribution_readiness(orderId)` → `generate_b2b_retail_shipment_plan(orderId)` | `/b2b-orders?order=<id>` |
| „cum merg comenzile en-gros / statistici" | `list_b2b_orders` (agregare) | `/b2b-orders?tab=analytics` |
| „cine a schimbat starea / data comenzii" | `jurnal_activitate` (filtrabil pe entitate) | `/b2b-orders?order=<id>` |

## Planificarea inteligentă — fluxul corect (ARATĂ înainte de EXECUTĂ)
„Planifică" transformă numai partea produsă în fabrică într-un plan executabil. Dacă setup-ul arată `central_warehouse`, nu lansa producție: lucrezi cu rezervare/picking și aprovizionarea depozitului.
1. **`plan_b2b_order(orderId)`** = preview (nu scrie nimic). Întoarce: verdictul (poate livra la termen?), costul/marja, materiile sub minim cu furnizor+ETA, gâtuirile pe echipamente, tura suplimentară propusă, câte loturi se creează, produsele neproducibile (fără rețetă). **Arată-i userului acest sumar** (eventual screenshot la modala `?plan=<id>`) și explică-i deciziile.
2. Obține **DA-ul** userului pe decizii: generăm comenzi furnizor pentru lipsuri? adăugăm tura suplimentară?
3. **`apply_b2b_order_plan(orderId, orderMaterials:<da/nu>, addShift:<da/nu>)`** = execută. Creează loturile de producție legate de comandă (idempotent — nu dublează la retry/planificare parțială incrementală), comenzile furnizor DRAFT (de confirmat din Aprovizionare), eventual tura. Comanda intră în starea de producție.
4. Confirmă prin re-citire (`list_b2b_orders`/`get_b2b_order_documents`/`recompute_b2b_order_status`) și arată rezultatul. Loturile apar în Loturi Planificate și pe calendarul de operații.

> Planificarea parțială: dacă userul vrea doar o parte din comandă acum, dă `selection:{productIds:[…]}` (și opțional `qtyByProduct`) la AMBELE tool-uri. Restul rămâne neplanificat și-l lansezi mai târziu (incremental, fără dublare).

## Reguli (cele care contează)
- **`apply_b2b_order_plan` SCRIE real — confirm-first.** Creează loturi de producție, poate genera comenzi furnizor draft și o tură suplimentară. Întâi `plan_b2b_order` (preview), arată-i userului ce se întâmplă și ce costă, obține DA, abia apoi `apply_*`. Nu sări direct la apply.
- **Stările de aviz/factură NU se forțează prin `update_b2b_order`.** `avizata`/`acceptata`/`facturata` vin DOAR din `generate_b2b_aviz`/`accept_b2b_aviz`/`generate_b2b_invoice`. Dacă încerci să le pui cu `update_b2b_order`, primești un mesaj clar. Stările de producție se RECALCULEAZĂ (`recompute_b2b_order_status`), nu se setează manual.
- **Nicio livrare NU se expediază/livrează printr-un simplu status MCP.** `update_b2b_order(... dispatched/delivered)` refuză intenționat shortcut-ul pentru magazine proprii, francize și clienți B2B: flota proprie trebuie să păstreze cursa, gestiunea mașinii, predarea șoferului, dovada și recepția, iar predarea directă trebuie confirmată prin fluxul ei cu dovadă.
- **„De ce nu pot factura?"** Probabil regula cere ca avizul să fie acceptat de client întâi (proof-of-delivery). `get_b2b_order_documents(orderId)` arată motivul blocării. Acceptă avizul (`accept_b2b_aviz`) sau, dacă chiar trebuie, forțează cu `generate_b2b_invoice(orderId, force:true)`.
- **`depotId` este punctul de livrare**, ales cu `list_b2b_client_depots`; sursa fizică se rezolvă din regulile rețelei. Nu folosi un ID din `list_warehouses_full` în locul lui.
- **Nu transforma un restaurant/QSR fără producție în „Fabrică + desfacere".** Activează rețeaua cu depozit central; forecastul nu trebuie să creeze loturi de producție pentru `central_warehouse` sau `supplier_direct`.
- **Respectă locația actorului.** Magazinul vede clientul/punctul propriu și poate cere sugestia numai pentru acel `depotId`; forecastul consolidat și alocarea fair-share pe toate comenzile se rulează numai din fabrica ori depozitul central recunoscut de configurația activă a rețelei.
- **Rutele urmează rețeaua vânzătoare, nu firma cumpărătoare.** Brandul se rezolvă întâi din snapshotul liniei, apoi din punct/client/gestiunea de recepție; o comandă legacy ambiguă rămâne ascunsă. Nu încerca să „repari” vizibilitatea făcând clientul global. Aplicarea fair-share recalculează sub blocare; dacă datele s-au schimbat concurent, reia tool-ul în loc să forțezi rezultatul preview-ului.
- **Planul de rută este two-stage și idempotent.** `plan_b2b_delivery_routes` cere un hub și o singură rețea și întoarce `approvalToken`; `apply_b2b_route_plan` trebuie să primească exact tokenul planului arătat. Orice schimbare de comandă/sursă, cursă/asignare, vehicul, șofer sau setare cere reaprobare și nu scrie parțial. Retry-ul aceluiași token deja aplicat întoarce aceeași dovadă fără curse duplicate.
- **Spațiul fizic este exact, nu global.** Cockpitul, rampele și sloturile includ doar comenzile și resursele punctului de plecare ales; liniile exclusiv `supplier_direct`, marfa altui hub și cursele/rampele legacy fără locație nu se revendică implicit. `mark_b2b_vehicle_arrived` notifică doar echipa rețelei cursei.
- **Van-sale este acțiunea șoferului nominal.** `create_b2b_van_sale` creează comandă și factură reală și se apelează numai cu tokenul MCP al șoferului alocat cursei; nu folosi un token de dispecer/organizație ca să îl impersonifici.
- **Refuzul nu poate muta marfa între rețele.** La redirecționarea unei excepții, noul client/punct, comanda sursă, cursa și mașina trebuie să rezolve același seller exact. Dacă punctul a fost mutat ori actorul și-a pierdut accesul între preview și salvare, operația se oprește și se reîncarcă; nu încerca să ocolești prin schimbarea manuală a statusului.
- **Agentul responsabil trebuie să fie din rețeaua clientului.** Selectorul este filtrat pe sellerul clientului; angajatul trebuie să fie activ și cu brand exact. Fără brand este eligibil numai când toate unitățile lui sunt single-brand. Nu asigna un agent din alt brand al aceluiași hub, deoarece ar primi notificările și feed-ul clientului.
- **Notificările urmează cursa, nu tenantul întreg.** Mesajele live, GPS-ul, excepțiile și automatizările folosesc sellerul și locația cursei; regulile și destinatarii sunt intersectați cu acel scope la emitere. Dacă un agent a fost mutat ori dezactivat după asignare, nu îl considera încă autorizat și nu încerca să forțezi push-ul.
- **O cursă goală nu dovedește singură rețeaua.** Serverul trebuie să-i ștampileze `sellerBrandId` la creare, inclusiv pentru curier extern ori „vehicul alocat mai târziu”; fără această ancoră nu o prezenta unui rol restrâns și nu o modifica. Vehiculul și șoferul atribuiți trebuie să rămână în aceeași rețea. Un șofer fără brand este acceptabil numai dacă locația are un singur brand activ. În P&L, brandul/locația din selector trebuie să fie una dintre unitățile rolului; dacă rolul are mai multe, cere alegerea unei singure unități.
- **Catalogul și reluarea unei comenzi au aceeași frontieră.** `set_b2b_packaging`, editările produselor contractate și replay-ul `create_b2b_order` trebuie să dovedească rețeaua vânzătoare înainte să citească sau să scrie detalii. Un produs comun ori un client fără brand nu este autoritate. Dacă punctele clientului rezolvă branduri diferite sau ambigue, oprește-te și cere corectarea master-data din tab-ul Rețea.
- **Configurația rețelei nu se mută prin formularul generic al clientului.** Tipul punctului, brandul vânzător, legătura POS, gestiunea de recepție, urgențele și reaprovizionarea se modifică din `?tab=network` sau prin tool-urile dedicate, cu autoritate centrală; formularul generic rămâne pentru identitate, adresă, coordonate și calendar.
- **Canalul intercompany este fail-closed.** Setup-ul poate confirma doar `contractPayloadV1Configurat`; conexiunea partenerului se verifică la trimitere. `create_b2b_order` creează local și întoarce `remoteDeliveryConfirmed:false` — nu afirma că celălalt tenant a primit comanda. Pentru o cerere pornită din tenantul francizei folosește canalul outbound din aplicație până când există un tool MCP outbound dedicat, cu rezultat remote.
- **Custodia la `supplier_direct + supplier_billed` este juridică, nu doar logistică.** Nu o folosi pentru `company_store`. Franciza/clientul trebuie să aibă entitate juridică, punct/destinație și o gestiune dedicată deja marcată în interfață pe proprietarul extern corect. MCP refuză să transforme automat o gestiune existentă în custodie externă și refuză folosirea unei astfel de gestiuni pentru `factory_resale`.
- **Prețul de contract, nu cel de retail.** Leagă produsul de client (`create_b2b_client_product`) și pune `clientProductId` pe linie, altfel riști preț greșit la facturare.
- **Confirmă prin re-citire, arată prin screenshot.** Tool-ul a întors `success` = e salvat — confirmă cu `list_b2b_orders`/`get_b2b_order_items`, nu cu pixelul; fă screenshot la `?order=<id>` ca să-i arăți userului. Vezi `condu-chrome.md` regulile c și f.
- **Ștergerea de comenzi/clienți întregi NU merge prin conexiune** — anulează (`update_b2b_order(status:"cancelled")`) sau ghidează userul să șteargă din aplicație. Dacă era facturată, storno din `/finance`.
- **Limbaj de business, nu jargon** („pregătește comanda", „poate fi livrată la termen", „ce-mi trebuie ca s-o produc") — nu `legalEntityId`/`depotId`/`provisionalShift`.

## Permisiuni (grantul Acces AI)
- **Citirile comerciale** (`get_b2b_distribution_network_setup`, `list_b2b_orders`, `list_b2b_clients`, `list_b2b_client_depots`, `get_b2b_order_items`, `get_b2b_order_documents`, `get_b2b_picking_plan`) cer citire pe modulul **Furnizori** (`furnizori`).
- **Citirile de planificare industrială** (`plan_b2b_order`, `get_retail_distribution_readiness`) cer citire pe modulul **Producție** (`productie`).
- **Scrierile operaționale pe comandă/client** (`create_b2b_order`, `update_b2b_order`, `create_b2b_client`, `update_b2b_client`, `create_b2b_client_product`, `confirm_b2b_picking`, `generate_b2b_aviz`, `accept_b2b_aviz`, `generate_b2b_invoice`, `generate_b2b_retail_shipment_plan`, **`recompute_b2b_order_status`**) cer modulul **`Furnizori`** (`furnizori`) pe token.
- **Configurația rețelei și a punctelor** (`configure_b2b_distribution_network`, `create_b2b_client_depot`, `update_b2b_client_depot`, `upsert_b2b_distribution_source_rule`) acceptă scriere pe **Furnizori** sau **Setări**, dar pentru angajați cere exact `b2b_sales_supervise` ori `settings_access` și autoritate pe brand din fabrica/depozitul central. `get_b2b_distribution_network_setup` poate fi citit și prin Setări pentru verificarea înainte/după configurare.
- **`apply_b2b_order_plan`** cere scriere pe modulul **`Producție`** (`productie`) — creează loturi de producție. Preview-ul și execuția sunt ambele în Producție, dar folosesc granturi diferite: citire, respectiv scriere.
- **`set_b2b_picking_rules`** cere modulul **`Setări & Configurare`** (`setari`).
- Pentru o factură fără comandă sau pe mai multe bonuri: `create_fiscal_invoice` cere modulul **`Financiar`** (`financiar`); `submit_efactura_anaf` e extern (confirm-first).
- „Permisiune insuficientă" pe un tool → portal Hub → **Acces AI** → acordă modulul la citire și/sau scriere. Pentru angajat, rolul POS poate restrânge suplimentar scrierea.

## Legături
- Concepte complete + clienți/catalog/reguli + fluxuri + capcane + FAQ → `knowledge/b2b-comenzi-wholesale.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element doar la nevoie, unitatea activă, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Rute exacte + sub-tab-uri `?tab=` → `gaseste_in_aplicatie(termen)` / `knowledge/navigare-rapida.md` (skill `gaseste-pagina`).
- Producția pe larg (loturi, operații, MPS/MRP, fabrică) → skill-ul `productie-flux` + `knowledge/productie-fabrica.md`. Comenzi de la FURNIZORI (aprovizionare) → skill-ul `comanda-furnizor`. Facturare fiscală pe larg → skill-ul `rapoarte-preturi` / knowledge `finante-facturare-contabilitate.md`.
- Ceva ce nu se poate prin conexiune → ghidează în app + `trimite_ticket_symbai` (sugestie).
