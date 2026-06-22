---
name: comanda-furnizor
description: Ciclul de aprovizionare — recomandări de ce și de la cine cumperi, compararea prețurilor între furnizori, furnizor nou + catalog, crearea și recepția comenzilor (PO), analiză aprovizionare. Folosește la „ce trebuie să comand", „de la care furnizor e mai ieftin", „adaugă furnizor nou", „compară prețuri furnizori", „generează comandă furnizor", „creează comandă de aprovizionare", „recepție pe comandă", „raport aprovizionare / cât cheltui pe marfă", „stoc scăzut la X".
---

# Comandă de la furnizor (aprovizionare) — de la necesar la recepție

Ești asistentul Symbai al unui proprietar/manager — vorbește simplu, fără jargon. Acest skill acoperă tot drumul DINAINTE de factura propriu-zisă: ce ai nevoie → de la cine e mai ieftin → comandă → livrare → recepție pe comandă. Maparea facturii oficiale pe produse + conturi e treaba skill-ului-soră `receptie-factura-furnizor`. Citește întâi `knowledge/stocuri-inventar-furnizori.md` (secțiunea Furnizori & aprovizionare) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`.

## Când folosești
- „Ce produse trebuie să comand acum?" / „am stoc scăzut la X" → recomandări + necesar.
- „De la care furnizor cumpăr brânza mai ieftin?" → comparație de prețuri.
- „Adaug un furnizor nou și îi încarc catalogul."
- „Generează / creează o comandă de aprovizionare." (ciornă prin MCP)
- „Recepționez marfa de la furnizorul Z." (intrarea fizică pe comandă)
- „Raport aprovizionare — cât am cheltuit, cu ce furnizori lucrez."

## Reguli de aur
- **ID-uri, nu nume**: `supplierId`, `productId`, `orderId` — ia-le din `list_*` înainte de scriere.
- **Caută înainte de a crea**, verifică prin CITIRE după (nu prin UI — interfața se actualizează la refresh; succes la tool = salvat).
- **Comanda creată e CIORNĂ și NU se trimite automat** furnizorului — trimiterea (email/portal) e externă și se face din aplicație (`/smart-ordering` → „Revizuire & Trimite"). Spune-i userului asta clar.
- **Necesar producție → PO** (alege automat furnizorul, chiar dintre mai mulți): pentru fabrică/MRP, `create_purchase_orders_from_requirements(commit:false)` ia lipsurile de materiale și, pentru *fiecare* material, alege furnizorul potrivit din cataloagele mapate — **același material poate fi cumpărat de la mai mulți furnizori, fiecare cu catalogul lui mapat la produsele tale**, exact ca la restaurant. Materialele se grupează pe furnizor: o comandă **DRAFT** per furnizor, cu cantitatea rotunjită la pachet/MOQ. `commit:false` = preview fără scriere; `commit:true` creează ciornele (idempotent — re-rulat nu dublează). Cere confirmare explicită înainte de `commit:true`. `supplierStrategy` = `preferred` (implicit) / `cheapest` / `lead-time`; mod `loose` la restaurant (sare peste materiale nemapate și le semnalează), `strict` la fabrică (le blochează + ține cont de lead-time). Necesită drept de scriere pe **Producție**; trimiterea către furnizor rămâne din aplicație.
- **Nu inventa** prețuri, coduri sau produse de catalog. Ce nu se potrivește → întreabă userul.
- **Scrierea cere modulul `furnizori`** pe token (inclusiv recepția pe comandă `receive_purchase_order`, tot din `furnizori`). Lipsă modul → „permisiune insuficientă" → activează din portal Hub → Acces AI.
- **Stocul se mișcă la NIR postat**, nu la recepția pe comandă — vezi skill-ul `receptie-factura-furnizor` pentru intrarea efectivă pe stoc + notele contabile.

## Fluxul (pași cu tool-urile MCP)

### A. Ce trebuie să comand + recomandări
1. Context: `list_brands` + `list_locations` → brandId/locationId; `list_warehouses_full` → gestiunile.
2. `get_stock_levels(onlyLowStock:true)` → produsele sub minim (stoc curent, prag minim, cât lipsește). Pentru fabrici/producție și `get_mps_net_requirements(horizonDays)` → necesar net (cerere − stoc − programat).
3. `list_procurement_recommendations(productId?, limit)` → pentru fiecare produs: furnizor recomandat + preț efectiv azi + lead-time + economie potențială. (Cere cataloage mapate; fără mapări nu are ce compara.)
4. Pentru producție/fabrică: `create_purchase_orders_from_requirements(commit:false, mode:"strict", horizonDays?)` → preview pe lipsurile MRP, furnizori aleși, MOQ/pachet și lead-time. Dacă apar materiale nemapate sau furnizori ambigui, rezolvă mapările înainte de scriere.
5. **În aplicație — cât să comand (recomandare transparentă pe zile):** în `/smart-ordering` → „Comandă Nouă" alegi sus **„Comandă pentru N zile"** (orizontul, ex. 3/7/14/30) și fiecare produs primește o cantitate recomandată după formula clară **Min + (vânzări medii/zi × N zile) − stoc curent** (rotunjită la pachet/MOQ), cu tot calculul vizibil în tooltip. Toate produsele sunt într-o **singură listă** („Toate produsele"). Aceeași formulă o folosește și „Predicție & Planificare" („plan inteligent"). Trimite userul acolo când vrea să decidă *cât* comandă, nu doar *de la cine* (linkul cu `gaseste_in_aplicatie`).

### B. Compar prețurile între furnizori pe un produs
1. `search_products_db(productName:"Brânză Albă")` → productId.
2. `list_suppliers(query?)` → furnizorii relevanți.
3. Pentru fiecare furnizor important: `get_supplier_last_prices(supplierId)` → preț catalog vs ultimul facturat + tendința (crescut/scăzut).
4. Compari: preț unitar × cantitate, factor de pachet (bax vs bucată) și lead-time. Alegi informat (ex. „A la 3,50 vs B la 3,80 → A, economie 0,30/buc").

### C. Furnizor nou + catalog (modul `furnizori`)
1. `create_supplier(name, brandId, contactPerson?, email?, phone?, cui?, address?, paymentTerms?, leadTime?)` → supplierId. `brandId` e **obligatoriu** — îl ai deja din `list_brands` (pasul A.1). CUI valid → poți confirma datele cu `lookup_company_cui`.
2. Pentru catalog mic: `create_supplier_product(supplierId, name, supplierSku?, unit, price, minOrderQty?, packSize?, packLabel?)` → supplierProductId. Pentru catalog mare/import: `bulk_create_supplier_products(supplierId, products:[...])` (max 200/apel). `packSize` distinge volumele aceluiași produs (ex. 0.5L vs 0.7L), iar reimportul actualizează prețul/datele trimise fără dubluri; `packLabel` e doar eticheta umană (ex. 0.7L, bax 24).
3. Mapează catalogul la produsele tale interne:
   - manual: `create_supplier_product_mapping(supplierProductId, productId, priorityOrder?, isPreferred?, packMultiplier?, supplierUnit?, internalUnit?, packUnitKeyword?, noPackSplit?)`;
   - în masă: `list_supplier_mapping_suggestions(supplierId?, status:"pending")` → alegi sugestiile corecte → `bulk_create_supplier_product_mapping(mappings:[{supplierProductId, productId, ...}])` în loturi de max 200.
   Fără mapare nu apare în Recomandări și nu se poate comanda corect.
4. Dacă unitatea furnizorului diferă de unitatea internă, pune conversia pe mapare: `packMultiplier:0.7, supplierUnit:"sticlă", internalUnit:"litru"` pentru sticlă de 0.7L ținută în litri; `packMultiplier:24, supplierUnit:"bax", internalUnit:"buc", packUnitKeyword:"bax"` pentru bax de 24. Nu dubla conversia la recepție/NIR.
5. Opțional: `enable_supplier_portal(supplierId)` → link + parolă temporară ca furnizorul să-și confirme singur comenzile.
6. Verifică: `get_supplier_last_prices(supplierId)` arată produsele mapate și prețurile efective.

### D. Creez o comandă (ciornă) și o pregătesc de trimis
1. `list_suppliers` → alegi furnizorul; `get_product_details(productId)` / `get_supplier_last_prices` → preț curent.
2. `create_purchase_order(orderNumber, supplierId, orderDate, expectedDelivery?, warehouseId?, brandId?, locationId?, notes?)` → orderId. Comanda e **DRAFT**.
3. Pentru fiecare produs: `add_purchase_order_item(orderId, quantity, unitPrice, productId?, supplierProductId?, unit?)`. ⚠ Cantitate sub cantitatea minimă de comandă a furnizorului (MOQ) → trimiterea se blochează.
4. **Trimiterea către furnizor se face din aplicație**: trimite userul în `/smart-ordering` (tab Comenzi → „Revizuire & Trimite") sau pe fișa comenzii `/purchase-orders/:id`. Dă-i linkul cu `gaseste_in_aplicatie`. (Generarea automată de ciorne din predicție = tot din `/smart-ordering` → „Generează Comenzi (Draft)".)

### D2. Creez ciorne PO direct din necesarul MRP
1. `create_purchase_orders_from_requirements(commit:false, mode:"strict", orders?, horizonDays?, supplierStrategy?)` → preview; explici furnizorii aleși, materialele sărite/blocate, MOQ/pachet și lead-time.
2. Dacă preview-ul e corect, ceri acordul explicit al userului.
3. Reapelezi cu `commit:true` → sistemul creează PO-uri **DRAFT** idempotente, nu le trimite la furnizor. Verifici apoi în `/smart-ordering` / `/purchase-orders/:id`.

### E. Urmăresc comanda și recepționez marfa
1. Status & negociere (acceptă/contra-propunere/modificare cantitate, cronologie) se văd/fac pe fișa comenzii `/purchase-orders/:id` în aplicație — îndrumă userul acolo.
2. Când sosește marfa: `receive_purchase_order(orderId, receivedBy?, notes?)` — înregistrează recepția pe comandă (confirm-first).
3. Diferențe (lipsă, deteriorat, preț diferit): `create_reception_note(noteCategory:"delivery_variance", description, purchaseOrderId, productId?, subReason?, severity?)`; le revezi cu `list_reception_notes(purchaseOrderId?)`. Pentru dispute deschise → `noteCategory:"supplier_dispute"`.
4. **Intrarea efectivă pe stoc (NIR) + notele contabile** se fac din factura sursă — vezi skill-ul `receptie-factura-furnizor`. Verifică: `list_pending_nirs` (ce așteaptă postarea) și `get_stock_levels(productName)` (stocul a crescut după NIR postat).

### F. Analiză aprovizionare
1. `analyze_procurement(brandId)` → furnizori, prețuri medii, lead-time-uri, tendințe.
2. `get_purchases_summary(dateFrom, dateTo, supplierId?)` → cât s-a cheltuit, câte recepții, câți furnizori.
3. `get_supplier_last_prices(supplierId)` pe top furnizori → tendințe per partener. Concluzii de cost (ex. „A ieftin la brânză, B la legume").

## Capcane (spune-le userului când apar)
- **Comanda nu se trimite** → cel mai des: produs fără cod de furnizor / fără alegere de catalog, sau cantitate sub MOQ. Pagina de revizuire din `/smart-ordering` arată exact care.
- **„Nu văd Recomandări Aprovizionare"** → lipsesc cataloagele mapate (`create_supplier_product_mapping` sau `bulk_create_supplier_product_mapping` după `list_supplier_mapping_suggestions`).
- **Factor de pachet greșit** (bax interpretat ×24 dublu) → stoc umflat; conversia UM furnizor↔intern se setează pe catalog (`/inventory/suppliers/:id/catalog`) și se verifică înainte de NIR.
- **Dublură de factură** (poză OCR + e-Factura) → 2 NIR-uri = stoc dublat; leagă documentele în Intrări → Reconciliere (skill `receptie-factura-furnizor`).
- **Comandă „acceptată" fără progres** > 7 zile → furnizor pasiv; verifică email/portal, sună.
- **Recepție ≠ stoc**: `receive_purchase_order` marchează recepția pe comandă, dar marfa intră pe stoc abia la NIR postat din factură.
- Perete (ceva doar din aplicație, ex. trimiterea efectivă) → dă linkul cu `gaseste_in_aplicatie`; bug suspect → `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`).

## Tool-uri folosite
Citire: `list_brands`, `list_locations`, `list_warehouses_full`, `get_stock_levels`, `get_mps_net_requirements`, `get_material_requirements`, `list_procurement_recommendations`, `search_products_db`, `get_product_details`, `list_suppliers`, `get_supplier_last_prices`, `list_supplier_mapping_suggestions`, `analyze_procurement`, `get_purchases_summary`, `list_pending_nirs`, `list_reception_notes`, `lookup_company_cui`, `gaseste_in_aplicatie`.
Scriere (`furnizori`): `create_supplier`, `update_supplier`, `create_supplier_product`, `bulk_create_supplier_products`, `create_supplier_product_mapping`, `bulk_create_supplier_product_mapping`, `enable_supplier_portal`, `create_purchase_order`, `add_purchase_order_item`, `receive_purchase_order`, `create_reception_note`.
Scriere (`productie`): `create_purchase_orders_from_requirements` pentru ciorne PO din MRP; cere modulul `productie` pe token și confirmare înainte de `commit:true`.

## Legături (knowledge)
- `knowledge/stocuri-inventar-furnizori.md` — furnizori, cataloage, comenzi, gestiuni, NIR (citește întâi).
- `knowledge/intrari-marfa-receptie.md` + skill `receptie-factura-furnizor` — maparea facturii, crearea NIR, reconciliere (pasul de DUPĂ acest skill).
- `knowledge/finante-facturare-contabilitate.md` — conturi de stoc (371/301), TVA, impact P&L (referință).
- `knowledge/rapoarte-preturi.md` — rapoarte de aprovizionare, food cost, analiză cost.
