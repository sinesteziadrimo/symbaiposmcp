---
name: gestioneaza-ecommerce-emag
description: Operează magazinul online și marketplace-urile (eMAG/Skroutz) prin conexiune (MCP) + navigare cu link direct, fără clickuri prin taburi — comenzi online, expediere cu AWB, retururi (RMA), coduri de reducere, variante și colecții de produse, feed-uri Google/Facebook, oferte și comenzi eMAG. Folosește la „ce comenzi online am azi", „comenzi neexpediate / de procesat", „pune AWB-ul pe comanda X / marcheaz-o expediată", „de ce nu intră comenzile de pe eMAG", „cum stau pe eMAG / starea integrării", „împinge prețurile/stocul pe eMAG", „adaugă un cod de reducere VARA10", „dezactivează codul X", „ce retururi am / aprobă returul / e eligibilă comanda pentru retur", „rata de retur / cât am rambursat", „de ce nu apare produsul în Google Shopping / verifică feed-ul", „variantele produsului X / colecțiile de pe site".
---

# Magazin online & eMAG — operează hands-free, prin conexiune + link direct

Proprietarul/managerul vrea să-și conducă magazinul online și marketplace-urile (eMAG, Skroutz) fără să se chinuie prin taburi. Tu faci munca prin **tool-urile MCP** (date live + acțiuni reale pe instanța lui) și-i **arăți** rezultatul navigând cu link direct + screenshot. Click doar acolo unde chiar nu există tool. **Cel mai important: la orice acțiune care iese ÎN AFARĂ (push status la marketplace, sincronizare preț/stoc pe eMAG, rambursare bani) — confirmă ÎNTÂI cu userul; aceste tool-uri cer explicit `confirm: true`.**

## Înainte de orice
1. Citește **`knowledge/agent-operare-avansata.md`** pentru standardul de lucru cu acțiuni externe/retururi/bani, **`knowledge/ecommerce-magazin-online.md`** (concepte: variantă, colecție, feed, cod de reducere, RMA, marketplace; paginile; fluxurile pas-cu-pas; capcanele) și **`knowledge/condu-chrome.md`** (cum conduci Chrome: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie). Pentru partea de **livrare propriu-zisă** (AWB, curieri, dispecerat) leagă și `knowledge/livrari-comenzi-online.md`.
2. **Context**: `list_brands` (+ `list_locations` la nevoie) → afli `brandId`. Magazinul online e per-brand; aproape toate citirile acceptă `brandId` opțional (lipsă = toate brandurile / brandul unic). Pentru eMAG: `get_emag_dashboard` îți dă conturile + `accountId` (dacă-s mai multe, ceri/folosești `accountId`).
3. **Navigare**: paginile sunt rute separate `/ecommerce/<sectiune>` (NU un singur `/ecommerce?tab=`). Marketplace-urile, retururile și AWB-ul au sub-taburi cu **deep-link `?tab=`** (vezi tabelul). Link live exact = `gaseste_in_aplicatie("comenzi magazin online")`. **Arată** userul prin extensia Chrome (`claude-in-chrome`) + user logat: navighezi la link → screenshot. Fără extensie poți tot opera prin tool-uri, dar nu-i poți ARĂTA pagina — spune-i asta și oferă-i s-o conecteze.

## Fluxul hibrid — ce tool pentru ce cere userul (cheat table)

Citește mereu cu un tool ÎNAINTE de a scrie. Numele de mai jos sunt tool-urile reale.

| Userul cere | Tool MCP (acțiune) | Unde-i arăți (link) |
|---|---|---|
| „ce comenzi online am / neexpediate / de azi" | `list_ecommerce_orders` (filtre: `status`, `paymentStatus`, `customerId`, `startDate`/`endDate`) | `/ecommerce/orders` |
| „ce conține comanda X / statusul ei" | `get_ecommerce_order(id)` | `/ecommerce/orders` |
| „pune AWB-ul / numărul de tracking pe comandă" | `set_ecommerce_order_tracking(id, trackingNumber, trackingUrl?)` | `/ecommerce/orders` |
| „marcheaz-o expediată / livrată / anulată" ⚠ EXTERN | `update_ecommerce_order_status(id, status, confirm:true)` | `/ecommerce/orders` |
| „adaugă cod de reducere VARA10 / −10%" | `create_discount_code(code, type, value, …)` | `/ecommerce/discount-codes` |
| „dezactivează / modifică un cod" | `update_discount_code(id, …)` | `/ecommerce/discount-codes` |
| „ce coduri de reducere am" | `list_discount_codes` | `/ecommerce/discount-codes` |
| „variantele produsului X (mărimi/culori, stoc/preț)" | `list_product_variants(productId)` | `/ecommerce/variants` |
| „ce colecții am pe site" | `list_product_collections` | `/ecommerce/variants` (catalog) |
| „cum e configurat magazinul" | `get_ecommerce_settings` | `/ecommerce/settings` |
| „ce feed-uri am / verifică feed-ul înainte să-l public" | `list_product_feeds`, apoi `preview_product_feed(id)` | `/ecommerce/feeds` |
| „actualizează / regenerează feed-ul de produse" | `generate_product_feed(id)` | `/ecommerce/feeds` |
| „ce retururi am / pe ce status" | `list_rma_requests` (filtre: `status`, `orderId`, `customerId`, interval) | `/ecommerce/returns?tab=list` |
| „detaliile returului X" | `get_rma_details(id)` | `/ecommerce/returns?tab=list` |
| „e eligibilă comanda pentru retur?" | `check_rma_eligibility(orderId)` | `/ecommerce/returns?tab=list` |
| „rata de retur / cât am rambursat / KPI retururi" | `get_rma_kpi_summary(brandId?, interval?)` | `/ecommerce/returns?tab=kpi` |
| „ce AWB-uri / expedieri am" | `list_awb_shipments(orderId?/brandId?/provider?/status?)` | `/ecommerce/awb?tab=awbs` |
| „cum stau pe eMAG / starea integrării" | `get_emag_dashboard(accountId?)` | `/ecommerce/marketplaces?tab=dashboard` |
| „ce oferte am pe eMAG / care au erori" | `list_emag_offers(accountId?, status?)` | `/ecommerce/marketplaces?tab=offers` |
| „ce comenzi am pe eMAG" | `list_emag_orders(accountId?)` | `/ecommerce/marketplaces?tab=orders` |
| „împinge prețurile/stocul pe eMAG" ⚠ EXTERN | `sync_emag_offers(accountId, confirm:true, productIds?/pushAll?)` | `/ecommerce/marketplaces?tab=offers` |
| „adu comenzile noi de pe eMAG" ⚠ EXTERN | `sync_emag_orders(accountId, pages?)` | `/ecommerce/marketplaces?tab=orders` |
| „ce preparat e în poza asta / leagă poza de meniu" | `interpret_menu_photo(imageUrl)` | (vezi skill-ul `adauga-produs-reteta`) |

**Deep-link sub-taburi** (parametrul `?tab=` supraviețuiește refresh-ului): Marketplace `?tab=dashboard|accounts|orders|offers|logs` · Retururi `?tab=list|kpi|policies` · AWB `?tab=generate|awbs|reconcile|accounts`. Pentru orice altă rută exactă (Antifraudă, Livrare/zone, Recenzii produse, Websites) cere `gaseste_in_aplicatie(...)`.

## Rețete (ordinea pașilor)

**Procesezi o comandă online → o expediezi.** `list_ecommerce_orders(status:"processing")` (sau „paid") → `get_ecommerce_order(id)` ca să verifici articolele/adresa → pui AWB-ul cu `set_ecommerce_order_tracking(id, trackingNumber)` → **confirmi cu userul** → `update_ecommerce_order_status(id, "shipped", confirm:true)`. ⚠ La „shipped/delivered/cancelled" statusul se PROPAGĂ AUTOMAT la marketplace-urile conectate (eMAG/Skroutz); la prima trecere în „delivered" se trimite o INVITAȚIE DE RECENZIE clientului. De-asta cere `confirm:true` — spune-i userului exact ce se întâmplă înainte. (Generarea AWB-ului la curier se face din pagina `/ecommerce/awb?tab=generate` — vezi `livrari-comenzi-online.md`.)

**Tratezi un retur (RMA).** `check_rma_eligibility(orderId)` (fereastra politicii + articole eligibile) → dacă userul vrea, vezi cererile cu `list_rma_requests(status:"pending")` + `get_rma_details(id)`. Aprobarea (`approve_rma`), respingerea (`reject_rma`) și mai ales **rambursarea** (`process_rma_refund` — MUTĂ BANI REALI, cere `confirm:true` + modulul „Plăți Terminal") sunt acțiuni cu efecte; condu-le doar la cererea explicită a userului și confirmă suma. Pentru KPI: `get_rma_kpi_summary` (rată retur, total rambursat, restocare).

**Verifici un feed înainte de reclame.** `list_product_feeds` → `preview_product_feed(id)` (câte produse, câte erori/avertismente — „de ce nu apare în Google Shopping" = de obicei lipsesc imagini/descrieri/preț) → repari produsele (skill `adauga-produs-reteta`) → `generate_product_feed(id)` regenerează fișierul public. ⚠ Feed-urile țin de modulul **Marketing & Social**, nu de „ecommerce".

**Sincronizezi eMAG.** `get_emag_dashboard` (conturi + conexiune ok + ultima sincronizare) → `list_emag_offers(status:"error")` ca să vezi ce nu s-a urcat → **confirmi** → `sync_emag_offers(accountId, confirm:true)` împinge prețuri/stoc LIVE pe eMAG. Comenzile: `sync_emag_orders(accountId)` aduce comenzile noi (creează comenzi interne). „De ce nu intră comenzile de pe eMAG" = cont neactiv / conexiune eșuată (vezi `conexiuneOk` în dashboard) sau oferte nemapate.

**Cod de reducere.** `create_discount_code(code:"VARA10", type:"percentage", value:10, minOrderAmount?, expiresAt?, usageLimit?)`. Tipuri: `percentage` (procent), `fixed` (sumă fixă RON), `free_shipping` (transport gratuit). Dezactivezi cu `update_discount_code(id, active:false)`. ⚠ Codul ≠ „ofertă": codul se aplică la coș când clientul îl introduce; oferta (motorul de oferte) scade automat nota — alt subsistem (vezi `produse-meniu-retete.md`).

## Cazurile care cer un click (rare)
- **Generarea AWB la curier**, reconcilierea COD, conturile de curier, conectarea unui cont eMAG/marketplace nou și maparea ofertelor (produs Symbai ↔ ofertă eMAG) — în pagină (`/ecommerce/awb`, `/ecommerce/marketplaces?tab=accounts|offers`). Tu citești/operezi prin tool-uri, dar pașii de conectare/mapare îi ghidezi în UI.
- **Politici de retur, antifraudă, zone/tarife de transport, websites/checkout** — config în pagină; tu citești cu `get_ecommerce_settings` și ghidezi.

## Reguli (cele care contează)
- **Confirm-first la tot ce iese în afară.** `update_ecommerce_order_status` (push marketplace + invitație recenzie), `sync_emag_offers` (preț/stoc live pe eMAG), `sync_emag_orders` (pull eMAG), `process_rma_refund` (bani reali), `track_awb`/`cancel_awb` (apel la curier) — spune-i userului efectul, apoi rulează cu `confirm:true`. Nu presupune; aceste tool-uri refuză fără confirmare.
- **Citește înainte să scrii** — `get_ecommerce_order` / `get_rma_details` / `preview_product_feed` îți confirmă ce atingi. Nu opera pe orb.
- **`productId` la variante = id-ul produsului** (variantele sunt per produs). `id` la comandă/retur/feed/cod = id-ul din lista respectivă (`list_*`). eMAG cere `accountId` doar dacă sunt mai multe conturi.
- **Permisiuni (module pe token)**: citirile (`list_*`/`get_*`/`check_*`/`preview_*`) merg mereu. Scrieri pe magazin (status comandă, AWB tracking, coduri) = modulul **ecommerce**. Sincronizări eMAG = modulul **emag**. Generare feed = modulul **Marketing & Social**. RMA approve/reject = modulul **Livrări**; rambursarea = **Plăți Terminal**. „Permisiune insuficientă" → portal Hub → Acces AI, activează modulul.
- **Ștergerea** de comenzi/coduri/feed-uri întregi NU se face prin conexiune — dezactivează (ex. `active:false`) sau ghidează userul să șteargă din aplicație.
- **Limbaj de magazin** cu userul („marchez comanda expediată", „pun AWB-ul", „pornesc returul", „urc prețurile pe eMAG"), nu jargon (`paymentStatus`, `emagOfferSync`, `confirm:true`). Arată-i screenshot-ul ca dovadă.
- **Nu inventa** numere AWB, sume de rambursare sau date de comandă — ce lipsește, întrebi userul.

## Legături
- Concepte + pagini + fluxuri + capcane magazin online → `knowledge/ecommerce-magazin-online.md`.
- Livrare propriu-zisă (AWB la curier, dispecerat flotă, abonamente) → `knowledge/livrari-comenzi-online.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click doar la nevoie, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Produse/variante/feed-uri de completat (imagini, descrieri, preț) → skill-ul `adauga-produs-reteta`; import în masă → `importa-date`.
- Reclame Google/Facebook care consumă feed-ul, postări, recenzii produse → `marketing-social.md` / skill-ul `raspunde-recenzii`.
- Conectarea contului Meta pentru Catalog/Ads → skill-ul `conecteaza-meta`.
- Blocaj (ceva ce nu se poate prin conexiune, ex. mapare ofertă eMAG) → `trimite_ticket_symbai` (sugestie) + ghidează în app.
