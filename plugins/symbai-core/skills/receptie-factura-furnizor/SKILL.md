---
name: receptie-factura-furnizor
description: Procesează facturile de la furnizori și intrările de marfă (Intrări Marfă) — recepție directă pe stoc prin MCP (NIR + note contabile automate), maparea liniilor de eFactură la produse + conturi, factor de pachet, tip produs corect, magazie/unitate, deductibilitate, reconciliere aviz/poză cu eFactura. Folosește la „adaugă factura de intrare", „recepție marfă", „bagă marfa pe stoc", „mapează factura de la X", „de ce nu intră pe stoc", „leagă avizul de factură", „intrări marfă", „NIR", „factură furnizor".
---

# Recepție factură furnizor / Intrări Marfă — corect, complet, rapid

Scopul: marfa de la furnizor să intre pe stoc ȘI în contabilitate, corect. Citește la nevoie `knowledge/agent-operare-avansata.md` (confirm-first, verificare, dovezi), `knowledge/intrari-marfa-receptie.md` (fluxul complet, fiecare câmp) și `knowledge/finante-facturare-contabilitate.md` (conturi & note contabile). Secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md` rămâne valabilă (interfața se actualizează la refresh; verifică prin CITIRE, nu reapela scrierea).

**Regula de aur:** stocul se mișcă DOAR la postarea NIR-ului (document de inventar POSTED). Nimic nu intră pe stoc mai devreme — nici „recepție din poză", nici factura nemapată.

## Pasul 0 — alege calea corectă (citește asta întâi)

Sunt DOUĂ situații. Confundarea lor dublează stocul — nu sări peste.

- **CALEA A — marfa NU are încă o factură în sistem** (cumpărare cash & carry, aviz, sau eFactura n-a sosit încă din SPV): faci o **recepție directă** complet prin MCP cu `create_inventory_document` (vezi Calea A). Rapid și fără aplicație.
- **CALEA B — factura/eFactura EXISTĂ deja în sistem** (importată din SPV, din poză OCR, sau împinsă din contabilitate — apare în `list_received_efactura`): **mapezi liniile** prin MCP, apoi creezi **NIR-ul legat de factură** (vezi Calea B). ⚠ NU folosi `create_inventory_document` pe Calea B — el creează o recepție SEPARATĂ, NElegată de factură, deci marfa intră de două ori și factura rămâne „fără NIR".

Întreabă-te: „Există această factură în `list_received_efactura`?" Da → Calea B. Nu → Calea A.

## Principii (nu greși astea)
- **Nu inventa** produse, conturi sau prețuri. Ce nu se potrivește clar → întreabă userul.
- **Caută înainte de a crea** (`search_products_db`); **verifică prin citire după** (`get_received_efactura_details`, `get_stock_levels`, `get_journal_entries_summary`).
- **Contul vine din TIPUL produsului.** Leagă linia/produsul de tipul corect și contul se rezolvă singur (raw_material→301, merchandise→371, consumable→302/603, packaging→381, service→628 etc.). Verificat: nota contabilă se generează corect chiar dacă brandul n-are tipuri de produs configurate (sistemul folosește maparea implicită pe tipul canonic). Tipurile configurate (`create_product_type`) sunt necesare doar pentru CONTURI PERSONALIZATE / override-uri.
- **Costul e obligatoriu la intrare.** Pe Calea A pune `unitCost` pe fiecare linie, altfel stocul se valorează la 0 și nota contabilă iese 0. Pe Calea B costul vine din factură.

## Faza 1 — Context
`list_brands` + `list_locations` (brandId/locationId) și `list_warehouses_full` (magaziile). `list_suppliers` pentru furnizor. Dacă furnizorul lipsește → `create_supplier`. Dacă produsul lipsește → `create_product` (vezi mai jos).

### Produs nou corect din prima (tip, unitate, magazie, TVA)
`create_product({ name, brandId, type, unit, warehouseId, vat, receptionPrice })`:
- `type` decide contul contabil — alege-l corect: `raw_material` (materii prime, 301), `merchandise` (marfă de revânzare, 371), `consumable` (consumabile, 302), `packaging` (ambalaje, 381), `service` (servicii, 628), `asset` (imobilizări).
- `warehouseId` = magazia (din `list_warehouses_full`). Zona de depozitare se setează automat dacă magazia are sub-zone.
- `unit` = unitatea de STOC (kg, l, buc) — în ea ții cantitatea, nu „bax". Reconversia din bax se face cu factorul de pachet (vezi Faza 3).
- `vat`: 21 standard, 11 alimente preparate / produse alimentare, 9, 0.

## CALEA A — recepție directă pe stoc prin MCP (fără factură în sistem)

Totul prin conexiune, fără aplicație. Pași:

1. Asigură-te că furnizorul și produsele există (Faza 1).
2. **Creează NIR-ul ca DRAFT mai întâi** (verificabil, nemișcat încă):
   `create_inventory_document({ docType: "GOODS_RECEIPT", docNo, docDate, supplierId, warehouseId, brandId, locationId, lines: [{ productId, qty, unitCost }], autoPost: false })`.
   - `docType` de intrare: `GOODS_RECEIPT` / `NIR` / `PURCHASE_RECEIPT` (toate alimentează stocul). `qty` în unitatea produsului. `unitCost` = cost de achiziție fără TVA per unitate.
3. Verifică DRAFT-ul: `list_pending_nirs({ warehouseId })` — trebuie să apară.
4. **Confirmă cu userul** că postezi (mișcă stocul real, ireversibil), apoi `post_inventory_document({ documentId, confirm: true })`. (Sau direct `create_inventory_document(..., autoPost: true, confirm: true)` după acordul userului.)
5. Verifică efectul: `get_stock_levels({ productName })` (cantitatea + costul mediu au crescut) și `get_journal_entries_summary({ brandId, startDate, endDate })` (apare o înregistrare sursă NIR; debit stoc + 4426 TVA / credit 401 furnizor).

Asta acoperă „adaugă factura de intrare" când nu vrei să treci prin eFactură: marfa intră pe stoc și nota contabilă se generează automat.

## CALEA B — factura există deja în sistem (mapezi liniile, apoi NIR legat)

### Faza 2 — vezi ce e de procesat
`list_received_efactura({ hasNir: false })` — facturile FĂRĂ recepție. Filtrează după `status`, `mappingStatus` (`unmapped`/`partially_mapped`/`ai_mapped`/`fully_mapped`), `supplierId`, interval de date. Arată userului lista (furnizor, număr, dată, total, câte linii / câte acceptate) și confirmă pe care le procesezi.

### Faza 3 — pe fiecare factură, mapează liniile
1. `get_received_efactura_details({ invoiceId })` — liniile + starea (produs mapat, cont, acceptat, factor pachet).
2. Pentru fiecare linie **nemapată / neacceptată**:
   - `search_products_db` pe descrierea liniei → găsește produsul intern. Lipsă? Întreabă userul dacă să-l creezi (`create_product` cu tipul corect) sau e altul existent (typo/diacritice).
   - `map_invoice_line({ invoiceId, lineId, productId })` — leagă + acceptă + învață regula. Contul se rezolvă automat din tipul produsului; dă `accountCode` doar dacă userul cere altul. (Implicit, dacă nu poate deriva, cade pe 371 — de aceea tipul produsului trebuie corect.)
   - **Factor de pachet (pachete):** furnizorul facturează în bax/cutie dar tu ții la bucată → adaugă `packMultiplier` (ex. 24) + `packKeyword` („bax"). Cantitatea se înmulțește (×24), prețul unitar se împarte (÷24), valoarea originală din factură rămâne. Se învață pentru data viitoare. (Există DOAR pe `map_invoice_line` — Calea B. Pe Calea A convertești tu cantitatea în unitatea de stoc.)
3. O linie deja legată corect (are produs + cont) dar neacceptată: `accept_invoice_line_mapping({ invoiceId, lineId })` o acceptă fără s-o re-mapezi. Pentru toate liniile deja mapate dintr-o dată: `accept_all_invoice_mappings({ invoiceId })` (acceptă în bloc cele cu produs+cont; NU creează produse noi — pe acelea le mapezi individual). O linie neacceptată blochează NIR-ul.

### Faza 4 — context factură (opțional)
`set_invoice_context({ invoiceId, warehouseId, brandId, locationId, invoiceType, vatDeductibility, ... })`. ⚠ Deductibilitatea + prepaid 471 se SALVEAZĂ ca etichetă pentru contabil — azi NU schimbă nota contabilă (TVA merge integral pe 4426). Spune-i userului.

### Faza 5 — NIR-ul legat de factură (prin MCP)
Când toate liniile sunt `fully_mapped` + acceptate (verifică cu `get_received_efactura_details`): **confirmă cu userul**, apoi `create_nir_from_invoice({ invoiceId, warehouseId, confirm: true })` — creează NIR-ul LEGAT de factură, îl postează pe stoc, generează notele contabile și marchează factura cu NIR (`hasNir:true`). Toate liniile trebuie să aibă deja produs mapat (altfel dă eroare). `warehouseId` = magazia de recepție (din `list_warehouses_full`); opțional doar dacă toate liniile sunt servicii non-stocabile. `confirm:true` e obligatoriu (mișcă stocul real, ireversibil).

Alternativ, din aplicație: Intrări Marfă → tab Recepții (NIR) → „Recepție Nouă" (alegi factura sursă + magazia) → Creează NIR. Dă linkul cu `gaseste_in_aplicatie("recepție marfă / NIR")`.

⚠ NU folosi `create_inventory_document` pe Calea B: el nu primește `invoiceId`, deci ar crea o recepție SEPARATĂ, nelegată de factură (marfa s-ar dubla, factura rămâne „fără NIR"). Pentru o factură care există deja în sistem, folosește MEREU `create_nir_from_invoice`.

## Faza 6 — Reconciliere (aviz/poză ↔ eFactura)
Marfa a venit cu aviz / recepție din poză, iar eFactura oficială vine mai târziu.
- Ciornă din poză **neaprobată** + sume care se potrivesc → eFactura o **înlocuiește automat** la import (nimic de făcut).
- Altfel: Intrări Marfă → tab **Reconciliere** → „Leagă". ⚠ Avertizează userul să verifice numărul + suma înainte (legarea se face doar pe furnizor, nu verifică suma — risc de a lega două facturi diferite).
- Igienă: `/inventory/inbox-quality` (eFacturi fără NIR, ciorne vechi, mapări slabe).

## Servicii / utilități fără stoc
Factură doar de servicii/utilități (fără marfă pe stoc): nu face NIR. Folosește calea de cheltuieli (`create_expense`) sau, pe factură, `set_invoice_context({ invoiceType: "servicii" })` + linii pe produs de tip `service` (cont 628). Stocul nu se mișcă.

## Faza 7 — Verifică prin citire (mereu)
- `get_received_efactura_details` — `mappingStatus` + linii rămase nemapate.
- `list_received_efactura({ hasNir: true })` — confirmă că factura a primit NIR (Calea B).
- `list_pending_nirs` — NIR-uri DRAFT nepostate.
- `get_stock_levels` pe 1-2 produse — stocul a crescut.
- `get_journal_entries_summary` — nota contabilă s-a generat (sursă NIR).

## Capcane (spune-le userului când apar)
- **Stoc dublat** = ai folosit `create_inventory_document` pentru o marfă care avea deja factură în sistem (trebuia Calea B). Verifică în `list_pending_nirs` / Recepții (NIR).
- **„De ce nu intră pe stoc după poză?"** Recepția din poză = doar ciornă. Mapare → Aprobă → NIR cu magazie.
- **Stoc/notă pe valoare 0** = ai uitat `unitCost` pe Calea A (sau costul lipsește din factură).
- **Serviciu pe cont de marfă (371)** = tip produs greșit. Leagă-l de un produs de tip `service` (cont 628 automat) sau schimbă tipul cu `update_product`.
- **„Permisiune insuficientă"** la `map_invoice_line` / `create_inventory_document` / `set_invoice_context` → tokenul n-are modulul `inventar` („Stocuri & Recepție"). Portal Hub → Acces AI.
- **Factură deja cu NIR** → `map_invoice_line` și câmpurile structurale din `set_invoice_context` se blochează (ar dezalinia stocul). Modificarea se face din aplicație („Modificare NIR").
- **Deductibilitate/preț recepție** nu se reflectă în notele contabile → e normal azi (informativ). Stocul se valorează la cost.

## Factură manuală de la zero (prin MCP)
Pentru o factură pe hârtie/PDF care NU vine prin eFactura/SPV sau OCR, o creezi direct prin conexiune: `create_incoming_invoice({ invoiceNumber, invoiceDate, lines: [{ description, quantity, unit?, unitPrice?, vatRate?, mappedProductId? }], supplierId? SAU supplierName?(+supplierCui?), brandId?, locationId? })` (modul `financiar`). Creează factura ca CIORNĂ și NU mișcă stoc. Apoi mapezi liniile (`map_invoice_line`) și faci recepția cu `create_nir_from_invoice` (Faza 5) — astfel o factură de hârtie devine Calea B, integral prin MCP.

(Notă: ambele operații — factură manuală de la zero ȘI NIR legat de o factură existentă — se pot face acum prin MCP, cu `create_incoming_invoice` și `create_nir_from_invoice`. Vechea limitare „doar din aplicație" nu mai e valabilă.)
