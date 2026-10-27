---
name: importa-date
description: Importă datele clientului din Excel/CSV (produse, meniu, stoc, furnizori, reguli de mapare) prin conexiune — citești fișierul, normalizezi, arăți rezumatul, apoi creezi totul cu uneltele dedicate și verifici prin citire. La „importă-mi datele din vechiul program", „am fișiere Excel cu produsele", „mută-mă de pe alt POS", „am furnizori dublați după import", „importă regulile de mapare".
---

# Importă datele din fișiere — prin conexiune

Userul are fișiere (Excel/CSV exportate din vechiul sistem) și vrea datele în Symbai, corect. Tu faci munca și îi explici scurt fiecare pas.

**Paginile de import din fișier au fost retrase (25.09.2026)**: `/data-import`, `/ai-bulk-import`, importul din pasul 2 al onboarding-ului și „Meniu din PDF”. Nu mai există sesiune de import cu întrebări. Calea de lucru: **citești TU fișierul local și creezi datele cu uneltele dedicate**, în loturi, cu previzualizare unde unealta o are. Clienții din fișier se importă din pagina `/customer-import`.

La importuri mari sau murdare citește și `knowledge/agent-operare-avansata.md`: tratează importul ca proiect de date (citire, normalizare, verificare, corecții, raport).

**`importa-date` vs `adauga-produs-reteta`:** ai fișiere Excel/CSV și vrei date în masă → `importa-date`; meniu de pe website/PDF/poze sau câteva produse → `adauga-produs-reteta`.

## Înainte de orice

1. Citește **`knowledge/onboarding/02-import-date.md`** (uneltele exacte, pe pași). După caz: `02c-import-sabloane-canonice.md` (normalizarea valorilor + pre-crearea referințelor + capcane) și `02d-import-surse-externe.md` (completarea datelor lipsă din website/SmartMenu/marketplace/PDF, cu permisiune).
2. Verifică conexiunea (`list_brands`). Dacă uneltele `symbai` lipsesc → skill-ul `conecteaza-symbai`.
3. Citește ce există deja: `list_locations`, `list_warehouses_full`, `list_menus`, `list_vat_rates`, `list_product_types`, `search_products_db(query:…)` pe numele din fișier (anti-duplicat).

## Bucla de lucru

1. **Spune planul în 2-3 fraze**: „Citesc fișierul, îți arăt ce am înțeles (câte produse, ce magazii, ce TVA), iar după «da» le creez prin conexiune și verific la final.”
2. **Citește și normalizează fișierul**: numere românești („1.234,50” → 1234.50), unități (`kg`/`buc`/`l`), TVA RO 0/11/21 (alcool mereu 21), tip de produs, categorii. Completează golurile din surse externe doar cu permisiunea userului (`02d`).
3. **Rezumat + acord**: câte produse, maparea coloanelor, 3-5 rânduri exemplu, magaziile, TVA-urile normalizate. Așteaptă „da”.
4. **Creează, în ordine** (detaliile în `02-import-date.md`):
   - gestiuni lipsă: `create_warehouse`;
   - categorii: `bulk_create_menu_categories`;
   - produse: `bulk_create_products` (loturi de ~50-100, `warehouseId` explicit);
   - meniu: `create_menu` / `bulk_create_menus`, apoi `bulk_add_menu_items` (prețul de vânzare trăiește DOAR în meniu);
   - stoc inițial cu costuri: `save_opening_stock` → `get_opening_stock` → `publish_opening_stock({ confirm: true })` după acord;
   - furnizori: `list_suppliers(query: CUI)` → `create_supplier` doar pentru cei care lipsesc; catalogul unui furnizor dintr-un fișier: `import_supplier_catalog_from_file`;
   - rețetarul dintr-un Excel: `import_retetar` cu `dryRun: true`, apoi commit după acord (faza 09).
5. **Verifică și corectează prin citire** — tip produs, TVA, unitate, categorie, preț 0 în meniu: `search_products_db`, `list_menu_items`, `list_menu_categories`, `get_warehouse_products_summary`; corecții cu `bulk_update_products` / `update_menu_item` / `bulk_update_menu_item_prices`. Confirmi prin citire, nu prin interfață (cache).
6. **Raport clar**: ce a intrat, ce ai completat și din ce sursă, ce ai corectat și de ce, ce a rămas de făcut. La furnizori spune câți existau deja (recunoscuți după CUI) și ce rânduri au rămas deoparte, cu motivul.

## Reguli (cele care contează)

- **Claritate**: CE faci și DE CE, în limbaj de restaurant („magazie”, „lista de produse”, „meniul cu prețuri”), fără „bulk/endpoint/JSON”.
- **Nu inventa** prețuri, gramaje, alergeni. Ce lipsește real → întrebi o dată, compact.
- **TVA România = 0 / 11 / 21**; alcool mereu 21. Prețul de vânzare doar în meniu.
- **Furnizorii se caută înainte de a se crea**, după codul fiscal curățat (fără RO, spații, puncte), cu `list_suppliers`. Dacă firma există, nu creezi nimic. Fără cod fiscal valid nu creezi furnizor pe denumire — de acolo vin duplicatele; lista rândurilor rămase o dai userului. Codul RO îl verifici cu `lookup_company_cui`; un partener cu cod de TVA european se adaugă cu `create_supplier`, unde codul se confirmă la VIES.
- **Reguli de mapare furnizor (Excel, alt program, altă firmă Symbai).** Regula leagă denumirea de pe factura furnizorului de produsul intern (sau de tipul de cheltuială), cu conversia și contul, ca facturile viitoare să se mapeze singure. Nu le recrea prin mapări de linii pe facturi vechi și nu le scrie prin SQL.
  - **Din Excel sau din exportul altui program** (Saga, WinMentor, SmartBill etc.): identifică coloanele (CUI/furnizor, denumirea articolului la furnizor, codul lui, produsul intern, UM, câte bucăți are baxul, contul) și trimite rândurile, câte cel mult 100, în `preview_mapping_rules({ rules })`; păstrează rândul din fișier în `ref`.
  - **Din altă firmă Symbai** («copiază mapările din firma A în firma B»): confirmă întâi cu `verifica_conexiune` care conexiune e sursa și care destinația. Pe sursă `export_mapping_rules`, pagină cu pagină (50 de reguli, `nextPage` până la `null`; opțional `supplierTaxIds` cu CUI-urile furnizorilor din destinație). Pe destinație `preview_mapping_rules({ transfer })` cu obiectul `transfer` **neschimbat** (poți doar elimina rânduri).
  - **Ce arăți userului din previzualizare:** câte se creează (`summary.create`); câte există deja (`existsSameRows`, nu se ating); regulile existente cu altă conversie sau alt cont (`differences` — se corectează doar cu acordul lui, prin `update_mapping_rule`); produsele și furnizorii lipsă (`missingProducts`, `missingSuppliers`); perechile denumire → produs care nu par același articol (altă marcă, alt tip, alt gramaj). Sursa poate avea și ea mapări greșite — nu le propaga fără confirmare.
  - **Conflicte în sursă:** `sourceConflicts` din export = aceeași denumire legată de produse diferite în firma sursă (nu intră în `transfer`). Arată variantele cu `usageCount` și `lastUsedAt` (folosirea în sursă); după alegerea userului trimite doar `variant.rule` ales, în `rules`. În previzualizare, `source_conflict` apare doar pentru rânduri contradictorii trimise împreună, cu `variants`; dacă regula există deja în destinație, nu mai e nimic de ales.
  - **Lipsuri:** cu acordul userului creează produsele din `missingProducts` cu `bulk_create_products` (nume, UM, tip și TVA vin din sursă; gestiunea o alegi în destinație) și furnizorii din `missingSuppliers` cu `create_supplier` după CUI, apoi reia previzualizarea paginii.
  - **Creare:** după acord, `create_mapping_rules({ expectedPreviewHash, confirm: true })` — fără să retrimiți regulile; serverul le ține 30 de minute. La `MAPPING_RULES_PREVIEW_EXPIRED` / `MAPPING_RULES_PREVIEW_CHANGED` reia previzualizarea. Verifică `created`, `skipped`, `failed`. O singură mapare cu `supplierId` și `productId` exacte merge direct prin `create_mapping_rules({ rules, confirm: true })`.
  - Dacă `cauta_tool` nu găsește aceste unelte, instanța nu e încă actualizată sau conexiunii îi lipsește dreptul (furnizori / stocuri) — verifică cu `verifica_conexiune`. Claude Code citește lista completă de unelte la pornirea conversației: după o actualizare, deschide un chat nou.
- **Permisiune insuficientă** pe un tool = modulul (`produse_meniu`, eventual `furnizori`) nu e bifat pe token → portal Hub → Acces AI; explică blând, se aplică în ~1 min.
- **Magazia: nimerește-o de la început.** Mutarea unui produs care are deja stoc înseamnă transfer de stoc, cu acte — cere aprobarea userului. Tipul/TVA/unitatea/categoria se corectează oricând.

## Legături

- **Configurare client nou cap-coadă** → skill-ul `onboarding-symbai` (importul e faza 02).
- **Meniu de pe website / PDF / poze** → skill-ul `adauga-produs-reteta`.
- **Rețete și angajați** au fazele lor (09 rețete, 07 personal).
- **Te blochează o limitare** → `trimite_ticket_symbai` (tip „sugestie”, cu `dedupeKey`) și continuă pe calea directă din `02-import-date.md`.
