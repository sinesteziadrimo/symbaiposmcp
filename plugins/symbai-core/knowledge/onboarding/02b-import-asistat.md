# Onboarding 02b — Import asistat prin pagină (retras)

Pagina de import din fișier (`/data-import`, `/ai-bulk-import`, pasul 2 din onboarding) și „Meniu din PDF” (`/menu/import-pdf`) **au fost retrase pe 25.09.2026**. Nu mai există pagină de condus cu Chrome și nici sesiune de import cu întrebări.

## Ce folosești acum

- **Pașii și uneltele exacte**: `02-import-date.md` — citești tu fișierul, normalizezi, arăți rezumatul, apoi `create_warehouse` → `bulk_create_menu_categories` → `bulk_create_products` → `create_menu` / `bulk_create_menus` → `bulk_add_menu_items`; stoc inițial cu `save_opening_stock` / `publish_opening_stock`.
- **Normalizarea valorilor și pre-crearea referințelor** (gestiuni, categorii, tipuri de produs, furnizori, TVA): `02c-import-sabloane-canonice.md`.
- **Date lipsă din website / SmartMenu / marketplace / PDF**, cu permisiunea userului: `02d-import-surse-externe.md`.
- **Catalog de furnizor din fișier**: `import_supplier_catalog_from_file`. **Rețetar din Excel**: `import_retetar` (`dryRun: true` întâi). **Clienți**: pagina `/customer-import`.

## Verifică și corectează prin conexiune

După fiecare lot, citești datele reale și repari:
- **Tip de produs greșit** → `bulk_update_products({ productIds, updates: { productType } })` (ex. băuturile de vândut → `merchandise`).
- **TVA greșit/lipsă** → `bulk_update_products({ productIds, updates: { vatRate } })`.
- **Unitate greșită** (sticle în „buc” în loc de „l” — food cost ×1000) → `updates.unit`, ÎNAINTE de rețete.
- **Categorie lipsă** → `create_menu_category` + `update_menu_item({ brandId, menuItemId, menuCategoryId })`.
- **Preț de vânzare lipsă** → `update_menu_item` / `apply_menu_prices` / `bulk_update_menu_item_prices`.
- **Poze** din URL-uri publice → `set_product_image({ productId, imageUrl })`.
- **Magazia greșită** pe un produs cu stoc înseamnă transfer de stoc, cu acte: spune-i omului și cere-i acordul.

Confirmi prin citire (`search_products_db`, `list_menu_items`, `list_menu_categories`, `get_warehouse_products_summary`), nu prin interfață — aplicația are cache. La final `get_config_status(brandId)`.

## Raportul pentru user

Ce a intrat (câte produse, câte în meniu cu preț, în ce magazii), ce ai corectat și de ce, în limbaj de restaurant, și ce a rămas de făcut.
