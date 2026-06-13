# Finalizarea produselor în /menu/pricing (înainte de meniul fizic)

> Înainte să faci meniul fizic, definitivează produsele: titlu, descriere, gramaj, preț, categorie + ordine, alergeni, nutriție. Tot ce poți prin MCP + cele 2 goluri. Folosit de skill-ul `meniu-fizic`. Pagina: `gaseste_in_aplicatie("preturi meniu")` → `/menu/pricing`.

## De ce întâi aici
Meniul fizic ia TOTUL din meniul digital (nume, preț, descriere, gramaj, poză, categorie, ordine). Dacă schimbi produsele DUPĂ ce ai aranjat meniul fizic, strici aranjamentul. Deci: **întâi finalizezi produsele aici, apoi treci la design.** Confirmă cu userul ce vrea schimbat, fă prin MCP, verifică prin citire.

## Ce editezi și cu ce tool MCP

| Câmp | Tool MCP | Note |
|---|---|---|
| **Nume/titlu afișat** | `update_menu_item({ brandId, menuItemId, name })` | numele din meniu (implicit = numele produsului) |
| **Descriere** | `update_menu_item({ ..., description })` | descrierea de vânzare |
| **Gramaj** | `update_menu_item({ ..., gramaj })` | ex. „350g", „500ml" |
| **Preț de vânzare** | `update_menu_item({ ..., price })`, sau în masă `apply_menu_prices`/`bulk_update_menu_item_prices` (cu `brandId`) | prețul trăiește DOAR în meniu |
| **Categorie produs** | `update_menu_item({ ..., menuCategoryId })` | se oglindește și pe produs; categoria din `list_menu_categories` |
| **Ordine produs în categorie** | `update_menu_item({ ..., sortOrder })` | ordinea de afișare în meniu |
| **Alergeni** | `set_product_allergens({ productId, allergenIds })` (+ `create_allergen` dacă lipsesc) | ⚠ ÎNLOCUIEȘTE tot setul; citește întâi |
| **Descriere/gramaj pe produs (catalog)** | `update_product({ productId, description, weight })` | dacă vrei pe fișa produsului, nu doar pe item |
| **Poză** | `set_product_image({ productId, imageUrl })` | URL public; se propagă la item |
| **Categorie nouă** | `create_menu_category({ name, brandId, parentId? })` | idempotent pe nume+brand |

Citește întâi: `list_menus`, `list_menu_items(menuId)`, `list_menu_categories(brandId)`, `search_products_db`, `get_product_details`. Verifică după fiecare scriere prin citire (nu prin UI — cache).

## ⚠ Cele 2 goluri (nu se pot prin MCP azi)

1. **Denumirea + ordinea CATEGORIILOR** — nu există tool MCP `update_menu_category`. Se face din aplicație: pagina de categorii / `/menu/pricing` (drag pentru ordine, edit pentru nume). Ghidează userul acolo (`gaseste_in_aplicatie("categorii meniu")`). *(Există endpoint API `PATCH /api/menu-categories/:id` + `/reorder`, dar nu e expus ca tool — vezi spec-ul de tool nou.)*
2. **Informații nutritionale** — nu există nici tool MCP, nici endpoint write (doar tabela `product_nutrition_facts` + un recalculate). Nutriția se completează din aplicație (fișa produsului / generatorul AI de nutriție). Ghidează userul; nu promite că o setezi prin conexiune.

La ambele: spune-i clar userului „asta o faci tu în aplicație, uite unde" + dă link. (Când tool-urile vor exista, acest fișier se actualizează.)

## Ordinea de finalizare (recomandată)
1. Categorii: structura + denumiri + ordine (UI pentru rename/reorder; `create_menu_category` pentru cele lipsă).
2. Produse pe categorii (`update_menu_item menuCategoryId`) + ordinea în categorie (`sortOrder`) — best-sellers/semnătură sus.
3. Titlu, descriere, gramaj, preț (per item sau în masă).
4. Alergeni (`set_product_allergens`); nutriție (UI).
5. Poze (`set_product_image` cu URL; sau pagina Poze Bulk Meniu pentru multe poze necunoscute).
6. Verificare finală: `list_menu_items` — totul are nume/preț/categorie corecte → gata pentru meniul fizic.

Detalii pe produse/rețete/tipuri: `produse-meniu-retete.md`. Importul în masă: skill-ul `importa-date`.
