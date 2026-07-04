---
name: gestioneaza-comenzi-b2b
description: Conduce comenzile B2B (en-gros) hands-free prin conexiune (MCP) — vezi și deschizi o comandă, o creezi, o PLANIFICI inteligent (planificarea producției din comandă, ca butonul „Planifică"), o pregătești (picking), faci avizul și factura, îi avansezi starea — cu navigare pe link direct și screenshot pentru user, click rar. Folosește la „ce comenzi B2B am", „deschide-mi comanda X / arată-mi comanda lui Penny", „fă o comandă en-gros pentru Auchan", „planifică producția pentru comanda asta / poate fi livrată la termen / ce-mi trebuie ca s-o fac", „lansează producția din comanda B2B", „pregătește comanda / fă pickingul", „fă avizul / emite factura pe comanda X", „confirmă / expediază / marchează livrată comanda", „recalculează statusul comenzii", „de ce nu pot factura", „ce produse are comanda asta", „du-mă pe tab-ul Picking/Clienți/Catalog B2B". Pentru clienți firmă & catalog de prețuri & reguli de picking pe larg → vezi și knowledge `b2b-comenzi-wholesale.md`. Pentru comenzi de la FURNIZORI (aprovizionare) → skill-ul `comanda-furnizor` (alt flux).
---

# Gestionează comenzile B2B — vezi, planifică, pregătește, facturează, prin MCP, click rar

Userul (proprietar/manager de fabrică, laborator, brutărie, distribuitor) vrea să VADĂ și să CONDUCĂ comenzile en-gros: ce comenzi are, ce conține o comandă, dacă o poate produce la termen și ce-i trebuie, să lanseze producția dintr-o comandă, s-o pregătească și s-o factureze. **Aproape tot se face prin conexiune (tool-uri MCP `symbai`) — rapid și sigur.** Chrome îl folosești doar ca să NAVIGHEZI la pagina/comanda potrivită (link direct) și să-i ARĂȚI rezultatul (screenshot), nu ca să te chinui cu mouse-ul prin liste și modale.

## Înainte de orice
1. Citește **`knowledge/b2b-comenzi-wholesale.md`** (conceptele complete: client B2B, catalog/preț contractat, bax vs bucată, depozit de expediere, stările comenzii, reguli de picking & documente, aviz → acceptare → factură, retail/ASN-SSCC — plus toate paginile și fluxurile), **`knowledge/agent-operare-avansata.md`** (confirm-first + verificare prin re-citire) și **`knowledge/condu-chrome.md`** (doctrina „MCP întâi → deep-link → click pe element doar la nevoie; screenshot = livrabilul"). Nu repet aici regula de Chrome — o aplici de acolo.
2. **Context**: `list_brands` + `list_locations` ca să afli `brandId`/`locationId` (multe tool-uri le acceptă ca filtru opțional). Comenzile B2B stau în cloud — `list_b2b_orders` citește direct din bază și e sursa de adevăr (interfața are cache; spune-i userului să dea refresh dacă nu vede).
3. **Modelul mental al stării**: `draft → confirmed →` (fazele de producție `planned`/`in_production_partial`/`in_production`/`ready`, calculate AUTOMAT din loturi) `→ picking → packed → avizata → acceptata → facturata → dispatched → delivered`. Stările de aviz/factură (`avizata`/`acceptata`/`facturata`) **NU se setează manual** — vin doar din acțiunile de documente. Cele de producție se RECALCULEAZĂ din loturi (`recompute_b2b_order_status`), nu se forțează.

## Pagina și deep-link-urile (ca să ARĂȚI userului)
- Modulul stă pe **`/b2b-orders`**, cu 6 tab-uri adresabile cu **`?tab=`**: `orders` (implicit, lista comenzilor), `clients`, `catalog`, `picking`, `delivery`, `analytics`. Du-te direct la tab: ex. `/b2b-orders?tab=picking`.
- **Deep-link la o comandă anume** (ca s-o deschizi în fața userului): `/b2b-orders?order=<id>` deschide **modala de detalii** a comenzii (header cu client+stare, carduri BAX/BUC/produse/valoare, tabelul de produse, butoanele Flux producție / Planifică). `/b2b-orders?order=<id>&plan=<id>` (sau direct `?plan=<id>`) deschide **modala de planificare inteligentă** pe acea comandă.
- Rutele exacte le confirmi cu `gaseste_in_aplicatie("comenzi b2b" / "picking b2b" / "catalog b2b")` — **nu inventa URL-uri** dincolo de `?tab=`/`?order=`/`?plan=` documentate aici. Cheat-sheet în `navigare-rapida.md`.

## Fluxul hibrid — pe intenție: ce tool + unde navighezi + ce arăți

Pentru fiecare cerere: **(1) tool MCP** care face/citește treaba → **(2) deep-link** la pagina/comanda ei → **(3) screenshot** pentru user.

| Userul cere | Tool MCP | Pagina (deep-link) |
|---|---|---|
| „ce comenzi B2B am / pe ce stare / pe client" | `list_b2b_orders` (filtre `clientId`, `status`, `deliveryDate`) | `/b2b-orders?tab=orders` |
| „ce conține comanda X / arată-mi comanda" | `get_b2b_order_items(orderId)` (+ `get_b2b_order_documents` pt. ce pas urmează) | `/b2b-orders?order=<id>` |
| „ce clienți B2B am" | `list_b2b_clients` | `/b2b-orders?tab=clients` |
| „adaugă client firmă nou" | `lookup_company_cui(cui)` → `create_b2b_client` | `/b2b-orders?tab=clients` |
| „pune preț de contract la produsul Y pt clientul Z" | `create_b2b_client_product(clientId, productId, unitPrice, …)` | `/b2b-orders?tab=catalog` |
| „fă o comandă en-gros pentru clientul X" | `list_b2b_clients` + `list_warehouses_full` → `create_b2b_order(orderNumber, clientId, depotId, deliveryDate, items[])` | `/b2b-orders?tab=orders` |
| **„planifică producția pt comanda asta / poate fi livrată la termen / ce-mi trebuie"** | **`plan_b2b_order(orderId)`** (preview/dry-run: verdict la termen, cost/marjă, materii lipsă + furnizori, gâtuiri echipamente, tură propusă, loturi de creat — NU scrie nimic) | `/b2b-orders?order=<id>&plan=<id>` |
| **„lansează producția din comandă / aplică planul"** | **`apply_b2b_order_plan(orderId, orderMaterials?, addShift?)`** (creează loturile legate de comandă + comenzi furnizor draft pt lipsuri + tură suplimentară dacă o propune) | `/b2b-orders?order=<id>` |
| „planifică DOAR produsul X din comandă / cantitate redusă" | `plan_b2b_order(orderId, selection:{productIds:[…], qtyByProduct:{…}})` → `apply_b2b_order_plan(orderId, selection:{…})` | `/b2b-orders?order=<id>&plan=<id>` |
| „recalculează statusul comenzii (e în urma producției)" | `recompute_b2b_order_status(orderId)` | `/b2b-orders?order=<id>` |
| „confirmă comanda" (draft→confirmed) | `update_b2b_order(orderId, status:"confirmed")` | `/b2b-orders?order=<id>` |
| „configurează regulile de picking & documente pt client" | `set_b2b_picking_rules(scope:{legalEntityId:<id>}, config:{…})` | `/b2b-orders?tab=picking` (sau Setări) |
| „pregătește comanda / vezi planul de picking" | `get_b2b_picking_plan(orderId)` → `confirm_b2b_picking(orderId)` (→ packed) | `/b2b-orders?tab=picking` |
| „fă avizul / emite factura pe comanda X" | `get_b2b_order_documents(orderId)` → `generate_b2b_aviz(orderId)` → `accept_b2b_aviz(orderId, acceptedByName)` → `generate_b2b_invoice(orderId)` | `/b2b-orders?order=<id>` |
| „expediază / marchează livrată" | `update_b2b_order(orderId, status:"dispatched")` → `update_b2b_order(orderId, status:"delivered")` | `/b2b-orders?order=<id>` |
| „pregătește ASN/SSCC pt retail (Penny/Auchan/Kaufland)" | `get_retail_distribution_readiness(orderId)` → `generate_b2b_retail_shipment_plan(orderId)` | `/b2b-orders?order=<id>` |
| „cum merg comenzile en-gros / statistici" | `list_b2b_orders` (agregare) | `/b2b-orders?tab=analytics` |
| „cine a schimbat starea / data comenzii" | `jurnal_activitate` (filtrabil pe entitate) | `/b2b-orders?order=<id>` |

## Planificarea inteligentă — fluxul corect (ARATĂ înainte de EXECUTĂ)
„Planifică" e cea mai valoroasă acțiune: transformă o comandă într-un plan de producție executabil. Flux:
1. **`plan_b2b_order(orderId)`** = preview (nu scrie nimic). Întoarce: verdictul (poate livra la termen?), costul/marja, materiile sub minim cu furnizor+ETA, gâtuirile pe echipamente, tura suplimentară propusă, câte loturi se creează, produsele neproducibile (fără rețetă). **Arată-i userului acest sumar** (eventual screenshot la modala `?plan=<id>`) și explică-i deciziile.
2. Obține **DA-ul** userului pe decizii: generăm comenzi furnizor pentru lipsuri? adăugăm tura suplimentară?
3. **`apply_b2b_order_plan(orderId, orderMaterials:<da/nu>, addShift:<da/nu>)`** = execută. Creează loturile de producție legate de comandă (idempotent — nu dublează la retry/planificare parțială incrementală), comenzile furnizor DRAFT (de confirmat din Aprovizionare), eventual tura. Comanda intră în starea de producție.
4. Confirmă prin re-citire (`list_b2b_orders`/`get_b2b_order_documents`/`recompute_b2b_order_status`) și arată rezultatul. Loturile apar în Loturi Planificate și pe calendarul de operații.

> Planificarea parțială: dacă userul vrea doar o parte din comandă acum, dă `selection:{productIds:[…]}` (și opțional `qtyByProduct`) la AMBELE tool-uri. Restul rămâne neplanificat și-l lansezi mai târziu (incremental, fără dublare).

## Reguli (cele care contează)
- **`apply_b2b_order_plan` SCRIE real — confirm-first.** Creează loturi de producție, poate genera comenzi furnizor draft și o tură suplimentară. Întâi `plan_b2b_order` (preview), arată-i userului ce se întâmplă și ce costă, obține DA, abia apoi `apply_*`. Nu sări direct la apply.
- **Stările de aviz/factură NU se forțează prin `update_b2b_order`.** `avizata`/`acceptata`/`facturata` vin DOAR din `generate_b2b_aviz`/`accept_b2b_aviz`/`generate_b2b_invoice`. Dacă încerci să le pui cu `update_b2b_order`, primești un mesaj clar. Stările de producție se RECALCULEAZĂ (`recompute_b2b_order_status`), nu se setează manual.
- **„De ce nu pot factura?"** Probabil regula cere ca avizul să fie acceptat de client întâi (proof-of-delivery). `get_b2b_order_documents(orderId)` arată motivul blocării. Acceptă avizul (`accept_b2b_aviz`) sau, dacă chiar trebuie, forțează cu `generate_b2b_invoice(orderId, force:true)`.
- **Depozitul de expediere e obligatoriu** la creare (`depotId`). Alege gestiunea reală cu `list_warehouses_full`, nu un bar/kiosk. Bax vs bucată: fii consecvent cu `bucPerBax`.
- **Prețul de contract, nu cel de retail.** Leagă produsul de client (`create_b2b_client_product`) și pune `clientProductId` pe linie, altfel riști preț greșit la facturare.
- **Confirmă prin re-citire, arată prin screenshot.** Tool-ul a întors `success` = e salvat — confirmă cu `list_b2b_orders`/`get_b2b_order_items`, nu cu pixelul; fă screenshot la `?order=<id>` ca să-i arăți userului. Vezi `condu-chrome.md` regulile c și f.
- **Ștergerea de comenzi/clienți întregi NU merge prin conexiune** — anulează (`update_b2b_order(status:"cancelled")`) sau ghidează userul să șteargă din aplicație. Dacă era facturată, storno din `/finance`.
- **Limbaj de business, nu jargon** („pregătește comanda", „poate fi livrată la termen", „ce-mi trebuie ca s-o produc") — nu `legalEntityId`/`depotId`/`provisionalShift`.

## Permisiuni (modul pe token)
- **Citirile** (`list_b2b_orders`, `list_b2b_clients`, `list_b2b_client_depots`, `get_b2b_order_items`, `get_b2b_order_documents`, `get_b2b_picking_plan`, `get_retail_distribution_readiness`, **`plan_b2b_order`** — preview, nu scrie nimic) **nu cer permisiune de modul** — merg mereu (tokenul are citire completă pe toată instanța clientului). Deci poți mereu să ARĂȚI și să planifici în preview.
- **Scrierile pe comandă/client** (`create_b2b_order`, `update_b2b_order`, `create_b2b_client`, `update_b2b_client`, depots, `create_b2b_client_product`, `confirm_b2b_picking`, `generate_b2b_aviz`, `accept_b2b_aviz`, `generate_b2b_invoice`, `generate_b2b_retail_shipment_plan`, **`recompute_b2b_order_status`**) cer modulul **`Furnizori`** (`furnizori`) pe token.
- **`apply_b2b_order_plan`** cere modulul **`Producție`** (`productie`) — creează loturi de producție. Deci preview-ul (plan) merge cu read, dar EXECUȚIA cere modulul Producție pe token.
- **`set_b2b_picking_rules`** cere modulul **`Setări & Configurare`** (`setari`).
- Pentru o factură fără comandă sau pe mai multe bonuri: `create_fiscal_invoice` cere modulul **`Financiar`** (`financiar`); `submit_efactura_anaf` e extern (confirm-first).
- „Permisiune insuficientă" pe un tool → portal Hub → **Acces AI** → bifează modulul respectiv pe token.

## Legături
- Concepte complete + clienți/catalog/reguli + fluxuri + capcane + FAQ → `knowledge/b2b-comenzi-wholesale.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element doar la nevoie, unitatea activă, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Rute exacte + sub-tab-uri `?tab=` → `gaseste_in_aplicatie(termen)` / `knowledge/navigare-rapida.md` (skill `gaseste-pagina`).
- Producția pe larg (loturi, operații, MPS/MRP, fabrică) → skill-ul `productie-flux` + `knowledge/productie-fabrica.md`. Comenzi de la FURNIZORI (aprovizionare) → skill-ul `comanda-furnizor`. Facturare fiscală pe larg → skill-ul `rapoarte-preturi` / knowledge `finante-facturare-contabilitate.md`.
- Ceva ce nu se poate prin conexiune → ghidează în app + `trimite_ticket_symbai` (sugestie).
