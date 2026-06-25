---
name: gestioneaza-livrari
description: Conduce livrarea hands-free — dispeceratul cu flotă proprie, livratorii și vehiculele, zonele, curierii externi (Glovo/Uber Direct/Bolt Food), AWB-urile de magazin online și retururile (RMA) — prin conexiune (MCP), cu navigare pe link direct și screenshot pentru user, fără click-uri prin tab-uri. Folosește la „ce comenzi de livrare am acum", „ce e în curs de livrare", „cine e pe teren / unde sunt livratorii", „cui dau comanda asta / cel mai bun șofer pentru comanda X", „alocă comanda lui Ion", „marchează comanda gata de livrare", „comandă rapidă la telefon", „de ce a eșuat livrarea / relivrează / reprogramează", „cât durează o livrare în medie / rata de eșec / cum merg livrările", „adaugă o zonă de livrare / schimbă taxa de livrare", „adaugă un vehicul în flotă", „cât m-a costat flota / consum combustibil pe mașină", „marchează angajatul ca livrator", „cere ofertă la Glovo / trimite comanda la curier extern", „ce AWB-uri am / urmărește coletul X", „ce retururi am / aprobă returul / rambursare retur", „ce alerte de livrare am". Pentru comenzile de pe agregatori (Glovo/Wolt) ca platforme și magazinul online ca modul → vezi și knowledge livrari-comenzi-online.
---

# Gestionează livrarea — dispecerat + flotă + curieri, prin MCP, click rar

Userul (proprietar/manager) vrea să VADĂ și să CONDUCĂ livrarea: cine livrează acum, ce comenzi sunt în lucru, cui dă o comandă, de ce a eșuat una, cât îl costă flota. **Aproape tot se face prin conexiune (tool-uri MCP `symbai`) — rapid și sigur.** Chrome îl folosești doar ca să NAVIGHEZI la pagina potrivită (link direct) și să-i ARĂȚI rezultatul (screenshot), nu ca să te chinui cu mouse-ul prin kanban și hărți. Dispeceratul (`/deliveries/dispatch`, Mission Control) e o pagină grea, cu drag-and-drop și hartă — o conduci prin tool-uri, nu prin click.

## Înainte de orice
1. Citește **`knowledge/agent-operare-avansata.md`** pentru confirm-first și verificare, **`knowledge/livrari-comenzi-online.md`** (conceptele: canal de livrare, livrator, schimb/tură, zonă, SLA, batching, curier extern, livrare eșuată, AWB, marketplace, tracking public — plus toate paginile modulului și fluxurile). Și **`knowledge/condu-chrome.md`** (doctrina „MCP întâi → deep-link → click pe element doar la nevoie; screenshot = livrabilul"). Nu repet aici regula de Chrome — o aplici de acolo.
2. **Context**: `list_brands` + `list_locations` ca să afli `brandId`/`locationId` (aproape toate tool-urile le acceptă ca filtru opțional; fără ele = toate brandurile/locațiile). Multe pagini filtrează după **unitatea activă** din browser — vezi capcana din `condu-chrome.md` (regula g) înainte să arăți ceva pe ecran.
3. **Conceptul-cheie pe care îl explici userului**: un angajat livrează doar dacă (a) e **marcat livrator** (`is_driver`) ȘI (b) are un **schimb deschis azi** (livrator + vehicul + km). Fără schimb deschis nu apare în dispecerat și nu i se poate aloca o comandă. Bifarea livratorului se face cu `set_employee_as_driver`; deschiderea schimbului **NU** are tool MCP — se face în aplicație (`/deliveries/fleet` → tab Schimburi), ghidează userul acolo.

## Fluxul hibrid — pe intenție: ce tool + unde navighezi + ce arăți

Pentru fiecare cerere: **(1) tool MCP** care face/citește treaba → **(2) deep-link** la pagina ei (`navigate(url)`) → **(3) screenshot** pentru user. Tabel intenție → tool → pagină:

| Userul cere | Tool MCP | Pagina (deep-link) |
|---|---|---|
| „ce comenzi de livrare am acum / ce e în curs" | `list_dispatch_orders` (`status:"all"` adaugă livrate+eșuate) | `/deliveries/dispatch` |
| „cine e pe teren / unde sunt livratorii" | `list_active_drivers` (GPS live, ultimele 15 min) | `/deliveries/dispatch` (hartă) sau `/dispatch/mission-control` |
| „ce livratori / șoferi am" | `list_drivers` | `/deliveries/fleet` (tab Livratori) |
| „ce vehicule am în flotă" | `list_vehicles` | `/deliveries/fleet` (tab Vehicule) |
| „ce zone de livrare am / taxe / praguri" | `list_delivery_zones` | `/deliveries/zones` |
| „ce alerte de livrare am / ce întârzie" | `list_delivery_alerts` (`includeResolved:true` pt. toate) | `/dispatch/mission-control` |
| „ce livrări au eșuat" | `list_failed_deliveries` (filtru `from`/`to`/`driverId`) | `/deliveries/failed` |
| „cui dau comanda asta / cel mai bun șofer pt. comanda X" | `suggest_driver_for_order(orderId)` (distanță+capacitate+încărcare, cu motiv) | `/deliveries/dispatch` |
| „cum merg livrările / rata de eșec / cât durează" | `get_dispatch_analytics(days)` | `/dispatch/analytics` |
| „cât m-a costat flota / consum pe mașină" | `get_vehicle_expenses(from,to)` (km, RON, RON/km, L/100km) | `/deliveries/vehicle-expenses` |
| „alocă comanda lui X / mai multe pe X" | `assign_orders_to_driver(orderIds,driverId)` · `batch_assign_orders` · `unassign_orders` | `/deliveries/dispatch` |
| „marchează comanda gata / eșuată / relivrează" | `mark_order_ready_for_delivery` · `mark_delivery_failed(reason)` · `retry_failed_delivery` | `/deliveries/dispatch` · `/deliveries/failed` |
| „comandă rapidă la telefon" | `create_quick_delivery_order(customerName, deliveryAddress, …)` | `/dispatch/mission-control` (Comandă rapidă) |
| „adaugă/schimbă o zonă / taxa de livrare" | `create_delivery_zone` · `update_delivery_zone` | `/deliveries/zones` |
| „adaugă/modifică un vehicul" | `create_vehicle` · `update_vehicle` | `/deliveries/fleet` (tab Vehicule) |
| „marchează/scoate-l ca livrator" | `set_employee_as_driver(employeeId,isDriver)` | `/deliveries/fleet` (tab Livratori) |
| „confirmă/rezolvă o alertă" | `acknowledge_delivery_alert` · `resolve_delivery_alert` | `/dispatch/mission-control` |
| „cere ofertă la curieri externi / trimite la Glovo" | `quote_external_couriers(orderId)` → `dispatch_to_external_courier(orderId,provider,confirm:true)` | `/dispatch/mission-control` |
| „ce conturi de curier am / ce AWB-uri / urmărește coletul" | `list_courier_accounts` · `list_awb_shipments` · `track_awb(id)` | `/ecommerce/awb` |
| „configurează un cont de curier / anulează un AWB" | `create_courier_account` · `cancel_awb(id, confirm:true)` | `/ecommerce/awb` (tab Conturi curieri) |
| „ce retururi am / detaliile returului / KPI retururi" | `list_rma_requests` · `get_rma_details(id)` · `get_rma_kpi_summary` | `/ecommerce/returns` |
| „pot returna comanda asta? / aprobă / respinge / rambursează returul" | `check_rma_eligibility` · `approve_rma` · `reject_rma` · `process_rma_refund(confirm:true)` | `/ecommerce/returns` |
| „conectează un canal Glovo/Wolt/Bolt/Tazz" | `create_delivery_channel` (modul `setari`) | `/channels?tab=integrations` |
| „ce comenzi am pe Glovo/Wolt / găsește comanda de platformă" | `list_channel_orders(provider,status)` → `get_channel_order(id)` | `/channels?tab=orders` |
| „întârzie comanda Wolt/Glovo cu X minute" | `delay_channel_order(id,extraMinutes)` → `get_channel_order(id)` | `/channels?tab=orders` |
| „confirmă precomanda Wolt" | `confirm_channel_preorder(id)` → `get_channel_order(id)` | `/channels?tab=orders` |
| „înlocuiește produsul lipsă pe Glovo/Wolt" | `replace_channel_order_items(id,payload|modification,confirm:true)` → `get_channel_order(id)` | `/channels?tab=orders` |
| „rambursează/ajustează comanda de platformă" | `refund_channel_order(id,scope,items|newTotal,reason,confirm:true)` (modul `plati_terminal`) → `get_channel_order(id)` | `/channels?tab=orders` |
| „marchează garanția SGR returnată la Wolt" | `mark_channel_deposits_returned(id,confirm:true)` → `get_channel_order(id)` | `/channels?tab=orders` |
| „pauzează Wolt/Glovo 30 min, suntem aglomerați" | `snooze_delivery_channel(id,minutes,confirm:true)` | `/channels?tab=integrations` |
| „cât mă costă Wolt/Glovo / ce profit fac pe platforme" | `list_delivery_pnl_segments` → `get_delivery_pnl` (read-only) | `/reports/pnl-livrari` |
| „ce agenți de vânzări am / activează-l/dezactivează-l" | `list_sales_agents` · `toggle_sales_agent` (modul `setari`) | (creare agent nou = UI) |

Pentru „micul dejun doar dimineata", „meniul de noapte", „opreste categoria X in afara weekendului" sau „program pe Wolt/Glovo", nu folosi ofertele/discounturile. Flux corect: gasesti tinta (`search_products_db` / `list_menu_categories` / `list_menus`) -> `list_availability_schedules` -> `create_availability_schedule` sau `update_availability_schedule` (modul `produse_meniu`) -> recitesti si dai linkul `/menu/promotions`, tab **Disponibilitate**. Asta seteaza vizibil/comandabil; pretul ramane neschimbat.

> Rutele exacte le confirmi cu `gaseste_in_aplicatie("dispecerat" / "zone livrare" / "AWB" / "retururi")` — **nu inventa URL-uri**. Cheat-sheet în `navigare-rapida.md`. Multe pagini de livrare au sub-tab-uri adresabile cu `?tab=…` — du-te direct la tab.

## Cazurile rare unde chiar dai click (Chrome activ)
Aproape nimic din dispecerat nu cere click — dar:
- **Deschiderea unui schimb de vehicul** (livrator + vehicul + km la plecare) NU are tool MCP → ghidează userul în `/deliveries/fleet` → tab Schimburi → „Deschide schimb", sau apeși tu butonul (citește pagina, găsește elementul după text — vezi `condu-chrome.md` regula d). Fără schimb deschis, `assign_orders_to_driver` refuză.
- **Desenul conturului unei zone pe hartă** — `create_delivery_zone`/`update_delivery_zone` acceptă `boundary` ca GeoJSON dacă îl ai, dar desenul liber pe hartă se face în `/deliveries/zones`. Taxa, pragul, comanda minimă, ora cutoff — toate prin tool, fără hartă.
- **Storno-ul fiscal la un retur** (factură de credit) — `process_rma_refund` face refund-ul, dar dacă returul are factură fiscală asociată, emiterea storno-ului NU e automată: tool-ul pune o întrebare în Control Operațional ca un manager să decidă. Pentru retururi cu factură fiscală, recomandă procesarea din `/ecommerce/returns` (UI) ca să iasă corect creditNote-ul.
- **Drag-and-drop pe livrator / „Asignează celui mai potrivit"** din kanban — NU-l reproduce cu mouse-ul; folosește `suggest_driver_for_order` + `assign_orders_to_driver`. Mai rapid și deterministic.

## Reguli (cele care contează)
- **Acțiunile care cheltuie bani sau cheamă API extern cer confirmare explicită — confirm-first.** `dispatch_to_external_courier` (plasează o livrare REALĂ cu cost), `cancel_awb` și `track_awb` (apel la curier), `process_rma_refund` (MUTĂ BANI reali către client) — întâi explică userului ce se întâmplă și cât costă, obține DA, abia apoi reapelezi cu `confirm: true`. La curieri externi: întâi `quote_external_couriers` (doar cotare), arată prețul + ETA, apoi `dispatch_to_external_courier`.
- **Schimb deschis = condiție de alocare.** Dacă `assign_orders_to_driver` refuză cu „nu are schimb deschis", nu insista — explică userului că livratorul trebuie să-și deschidă schimbul (vehicul + km) în `/deliveries/fleet`. Și că trebuie marcat livrator (`set_employee_as_driver`) dacă nu e.
- **Livratorii costă în plus.** Fiecare angajat bifat livrator se taxează nominal (modul Livrator) și `set_employee_as_driver` declanșează sincronizarea de billing cu Hub. Spune-i userului când marchezi pe cineva.
- **Agregatorii ≠ flota proprie.** Comenzile de pe Glovo/Wolt/Bolt/Tazz se gestionează ca platforme în `/channels` și `/deliveries` (Centru Livrări) — aduc curierii LOR. Dispeceratul (tool-urile de aici) e pentru flota TA proprie + curierii externi comandați de tine. Nu le amesteca (vezi capcanele din `livrari-comenzi-online.md`).
- **Comenzile de platformă au propriul ciclu MCP.** Pentru Glovo/Wolt începi cu `list_channel_orders` → `get_channel_order`, apoi folosești `delay_channel_order`, `confirm_channel_preorder`, `replace_channel_order_items`, `mark_channel_deposits_returned` sau `snooze_delivery_channel` după caz. După orice scriere recitești `get_channel_order` și dai linkul `/channels?tab=orders` sau `/channels?tab=integrations`.
- **Refund-ul pe platformă nu este retur RMA.** `refund_channel_order` cere modulul `plati_terminal`, confirmarea explicită a sumei și respectă plafonul de refund din Hub. Pentru Glovo trebuie `newTotal`; pentru Wolt alegi `scope:"basket"` sau `scope:"items"`.
- **Snooze/pauză nu șterge comenzile.** Dacă userul spune „suntem aglomerați", `snooze_delivery_channel` pune canalul offline la sursă pentru perioada cerută și oprește auto-accept-ul; comenzile deja primite rămân în Symbai.
- **Profitul pe platforme nu se estimează din comisionul vizibil.** Pentru Wolt/Glovo/Bolt/Tazz folosește `get_delivery_pnl` și citește `platformPnl`: comisioane, taxe, promoții suportate de firmă vs platformă, profit contribuție, comenzi nelegate și warninguri. La Wolt, setările financiare sunt în `/channels?tab=integrations` pe canal: baza de comision, finanțarea promoțiilor și maparea taxelor.
- **Meniu platforme: full sync rar, update mic când se poate.** Glovo full sync are limită de siguranță 5 reușite/zi/canal fără `force:true`. Dacă totalurile Glovo par greșite, verifică `settings.glovo.priceIsLineTotal`. Pentru Wolt, meniul poate trimite alergeni și `weekly_availability` din datele produselor/canalului.
- **Disponibilitatea programata are sursa canonica separata.** Pentru ferestre zi+ora foloseste `availability_schedules`: Wolt primeste fereastra nativa la urmatorul sync de meniu, iar Glovo este comutat prin update mic per fereastra. Nu retrimite full menu doar ca sa inchizi/deschizi un produs pe ore.
- **Confirmă prin re-citire, arată prin screenshot.** După o scriere (alocare, zonă, vehicul), tool-ul a întors `success` = e salvat — confirmă cu `list_*`/`get_*`, nu cu pixelul; și fă screenshot la pagină ca să-i arăți userului (spune-i să dea refresh dacă nu vede). Vezi `condu-chrome.md` regulile c și f.
- **Motivul de eșec e standardizat** — `mark_delivery_failed` cere un `reason` din lista fixă (client absent, adresă greșită, refuzată etc.); tool-ul îți spune valorile valide dacă greșești.
- **Ștergerea de entități întregi nu merge prin conexiune** — dezactivează (zonă `active:false`, vehicul `status:"inactive"`) sau ghidează userul să șteargă din aplicație.
- **Limbaj de restaurant, nu jargon** („cui dau comanda", „cât m-a costat mașina", „de ce a picat livrarea") — nu `assignedDriverId`/`slaDueAt`/`boundary`.

## Permisiuni (modul pe token)
- **Citirile** (toate `list_*` de dispecerat/flotă/zone/alerte/AWB/RMA, `get_dispatch_analytics`, `get_vehicle_expenses`, `suggest_driver_for_order`, `check_rma_eligibility`) **nu cer permisiune de modul** — merg mereu (token = tenantul, read complet).
- **Scrierile de livrare** (alocări, marcări, comandă rapidă, zone, vehicule, livrator, alerte, curieri externi, AWB, aprobă/respinge RMA, delay/preorder/substituire/SGR/snooze pe platforme) cer modulul **`Livrări`** (`livrari`) pe token.
- **`process_rma_refund`** și **`refund_channel_order`** cer modulul **`Plăți Terminal`** (mută bani/valoare, sunt acțiuni de plăți). Au și plafon de refund din Hub când suma se poate estima.
- **`create_delivery_channel`, `list_sales_agents`, `toggle_sales_agent`** sunt sub modulul **`Setări & Configurare`** (`setari`), nu `livrari`.
- „Permisiune insuficientă" pe un tool → portal Hub → **Acces AI** → bifează modulul respectiv pe token. (Creare agent vânzări = doar din UI.)

## Legături
- Concepte + toate paginile modulului + fluxuri + capcane (Glovo nu apare, livratorul „Offline", zone per locație, tracking public) + tabele SQL → `knowledge/livrari-comenzi-online.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element doar la nevoie, fallback fără extensie, unitatea activă) → `knowledge/condu-chrome.md`.
- Rute exacte + sub-tab-uri `?tab=` → `gaseste_in_aplicatie(termen)` / `knowledge/navigare-rapida.md` (skill `gaseste-pagina`).
- Magazinul online ca modul (comenzi, fraudă, marketplace, transport) → `knowledge/ecommerce-magazin-online.md`. Marcarea livratorului + roluri + ture → skill-ul `gestioneaza-personal`. Reconcilierea plăților pe canale → skill-ul `rapoarte-preturi` (`/finance?tab=reconciliation`).
- Ceva ce nu se poate prin conexiune (deschis schimb, desen contur pe hartă, funcție lipsă) → ghidează în app + `trimite_ticket_symbai` (sugestie).
