---
name: adauga-produs-reteta
description: Adaugă produse noi sau importă un meniu întreg — complet și corect, tip de produs, TVA, unități, rețete, taguri de rutare, alergeni, categorii. Folosește la „adaugă produsul X la N lei", „pune Y în meniu", „fă o rețetă pentru Z", „importă meniul de pe site/PDF/Excel", „introdu produsele", „pune-le pe categorii", „taguri pentru imprimante/KDS".
---

# Adaugă produse / importă meniu / creează rețete — corect și complet

Citește întâi `knowledge/produse-meniu-retete.md` (termenii: produs ≠ articol de meniu ≠ rețetă) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`.

**Două moduri de lucru:**
- **(A) Un produs-două** („adaugă cola la 12 lei") → sari direct la Fazele 1, 2, 4, 5 — scurt, fără ceremonie.
- **(B) Import în masă** (meniu întreg, zeci-sute de produse) → toate fazele, în ordine.

Regula de bază peste tot: **nu inventa NIMIC** — nici prețuri, nici gramaje, nici alergeni. Ce lipsește se întreabă sau se lasă gol.

## Faza 0 — Strânge datele (doar la import)

1. **Întreabă userul de unde vin datele**: website-ul restaurantului? PDF cu meniul? Excel/export din vechiul POS? poze? pagina de Glovo/Wolt? Cere-i fișierele direct în chat.
2. **Website**: ia conținutul URL-ului. Dacă HTML-ul vine gol → e un SPA (React/Angular/Vue); **caută API-ul din spate** — platformele de meniu au de regulă un endpoint JSON public (exemplu real: SmartMenu servește totul din Firebase Realtime DB, `https://smart-menu-...firebasedatabase.app/restaurant-menus/{slug}.json` → categorii → produse, cu name/price/description/weight/allergens/imageUrl per produs). Dacă nu găsești API-ul, cere userului un export sau screenshot-uri — nu ghici conținutul.
3. **Per produs vrei**: nume, preț, categorie/secție (bucătărie vs bar), descriere, gramaj, alergeni, poză (URL), și pentru băuturi: cum se vinde (sticlă întreagă vs porție turnată).
4. **Inventariază ce lipsește** și pune userului **UN singur set compact de întrebări**, nu câte una pe rând.
5. Alternativă in-app (propune-o când userul are PDF/poze/Excel și preferă să nu treci tu prin MCP): paginile `/menu/import-pdf` (extrage produse + prețuri + poze + design) și `/ai-bulk-import` (Excel cu mapare AI) fac importul direct în aplicație.

## Faza 1 — Descoperă stilul clientului (OBLIGATORIU înainte de orice scriere)

1. `list_brands` + `list_locations` + `list_menus` — brandul și meniul țintă. Dacă creezi meniu nou cu `create_menu`: se naște **draft** — activează-l cu `update_menu(status: "active")`.
2. `list_product_types(brandId)` — tipurile de produs REALE ale clientului (poate avea tipuri custom; folosește-le pe ale lui).
3. **Stilul de taguri**: `list_tag_summary` + `list_tags` — vezi ce taguri există și câte produse are fiecare (ex. „BAR" 115 produse, „BUCATARIE" 113). **Tagurile existente au deja reguli de rutare către imprimante/KDS — refolosește-le întocmai** (același nume, nu variante noi). Cu SQL read activ, verifică ce taguri au rute: `SELECT t.name, r.printer_id, r.screen_ids FROM tag_routing_rules r JOIN tags t ON t.id=r.tag_id WHERE r.active`.
4. `list_menu_categories(brandId)` — structura categoriilor (e ierarhică).
5. **Stilul de bar**: `search_products_db` pe 2-3 băuturi cheie (ex. „vodka", „cola") + `get_warehouse_products_summary` pe gestiunea barului — vezi dacă clientul ține băuturile ca **marfă la bucată** sau ca **materie primă la litru cu rețete de porționare (40 ml)**. Introdu produsele noi ÎN ACELAȘI stil.
6. **Dedupe**: `search_products_db` pe fiecare nume nou înainte de creare. `create_product` face dedupe doar pe nume EXACT — „Coca Cola" vs „Coca-Cola" creează dublură.

## Faza 2 — Decide modelarea per produs

Arborele de decizie (confirmat de clasificatorul oficial Symbai):

| Clientul vinde… | Tip | Unitate | Rețetă |
|---|---|---|---|
| Băutură îmbuteliată/doză, țigări, snacks, vândute ca atare | `merchandise` (marfă) | buc | NU — consum direct 1:1 din stoc |
| Shot/pahar turnat din sticlă (Vodka 40ml, vin la pahar) | produsul vândut: `merchandise`, buc, **CU rețetă** | — | 0.04 l (sau 40 ml) din sticla-sursă |
| Sticla-sursă a porțiilor | `raw_material` (doar pt. porții/cocktailuri) sau `merchandise` (dacă se vinde și întreagă) | **l** (litri!) | NU; nu intră în meniu dacă nu se vinde întreagă |
| Cocktail, cafea, limonadă (≥2 ingrediente) | `finished_good` | buc/porție | DA |
| Preparat de bucătărie | `finished_good` | buc/porție | DA |
| Sos/semipreparat de casă refolosit în rețete | `wip` (semipreparat) | kg/l | DA |
| Ingredient cumpărat | `raw_material` | unitatea de achiziție (kg/l/buc) | NU |
| Meniu de eveniment la preț fix, fără rețetă cunoscută | `masa_servita` — NU e în enum-ul create_product; creează-l ca tip custom cu `create_product_type(brandId, code, name, …conturi)`, apoi folosește `code`-ul tău la creare | — | NU (cost ulterior prin fișă de consum) |

- **Capcana unității la spirtoase**: sticla TREBUIE ținută la **l** (litri). Dacă e în „buc", rețeta „40 ml" e neconvertibilă → consumă 0.04 BUCĂȚI per shot, **fără niciun avertisment prin MCP** (incident real: COGS ×1000, stocuri −12.000 kg). Conversia e automată DOAR în aceeași familie: g↔kg, ml↔cl↔dl↔l.
- **TVA România: 0 / 11 / 21.** Mâncare preparată și băuturi nealcoolice de regulă 11; **alcoolul mereu 21**; setează `vat` explicit la creare (default-ul e 21). Nu ești sigur → întreabă.
- **Marfa fără rețetă e normală** (nu e o problemă de date); un `finished_good` fără rețetă E o problemă — nu scade stoc și rămâne necostat în P&L.

## Faza 3 — Propune și cere aprobarea (doar la import)

Construiește tabelul complet ÎNAINTE de orice scriere și arată-l userului: nume | tip | UM | TVA | categorie | preț | tag rutare | rețetă (da/nu) | gramaj | descriere | poză. Confirmă numărul de produse. Abia după aprobare scrii.

## Faza 4 — Execută în ordinea corectă

1. **Categoriile de meniu întâi** (la import): `create_menu_category` per secție (Gustări, Cocktailuri, Vin Alb…), ierarhic cu `parentId` unde are sens (Bar > Bere). E idempotentă pe (nume, brand) și se atașează automat la meniurile brandului.
2. **Materiile prime apoi** (`bulk_create_products` cu type + unit + vat + warehouseId + description + weight), apoi produsele vândute.
3. ⚠ **Dedupe silențios cu success:true**: `create_product` / `create_menu` / `create_menu_category` / `create_tag` / `create_allergen` întorc entitatea EXISTENTĂ dacă numele/perechea există — parametrii tăi NU se aplică pe ea. Citește răspunsul, nu doar status-ul.
4. **Rețete** (modul `retete`): `create_recipe` cu **productId EXPLICIT mereu** (fără el → match PARȚIAL pe nume sau auto-creează un produs nou greșit). `add_recipe_ingredients` cu **productId, nu productName** (typo la nume → auto-creează un raw_material dublură). Înainte de fiecare ingredient verifică `products.unit` al lui — cantitatea rețetei trebuie în aceeași familie de unități. `yield` gol = 1; „50 porții" = 50.
5. **În meniu, complet dintr-un apel**: `add_menu_item(menuId, productId, price, name, menuCategoryId, description, gramaj, sortOrder)` — pune prețul, categoria, descrierea și gramajul deodată. E UPSERT (dacă produsul e deja în meniu, câmpurile se aplică pe item-ul existent); numele afișat ia implicit numele produsului. Categoria se oglindește automat și pe produs. Prețul de vânzare se setează DOAR aici.
6. **Imagini**: `set_product_image(productId, imageUrl)` cu URL-ul public al pozei (de pe meniul/site-ul vechi) — se descarcă, se optimizează și se propagă la articolele de meniu. `gallery: true` pentru poze suplimentare. Ai un URL de poză dar nu ești sigur ce produs e? `interpret_menu_photo(imageUrl)` întoarce cele mai probabile articole de meniu cu scor de încredere (opțional restrânge cu `candidates`) — verifici potrivirea ÎNAINTE de `set_product_image`. Doar pentru încărcarea în masă a zeci de poze necunoscute (fișiere de pe calculator, fără URL) trimite userul la pagina Poze Bulk Meniu (`/menu/pricing/bulk-photos`, potrivire AI).
7. **Taguri pentru rutare**: întâi `search_products_for_tagging` (dry-run, confirmă numărul), apoi `bulk_assign_tag` cu `entityIds` sau filtre (categoryName face match pe subtree + fără diacritice). **Tag NOU = bonuri pierdute**: un tag creat de tine NU rutează nicăieri până nu există regula în aplicație — produsele lui generează bonuri „unrouted" care nu se printează și nu apar pe niciun ecran, FĂRĂ eroare. Dacă chiar e nevoie de tag nou: `create_tag` + spune-i userului EXPLICIT să creeze regula în Setări → Imprimante (rutare taguri) și verifică apoi. Pentru lucrul amănunțit cu etichete (rutare/marketing/audit) → skill-ul `gestioneaza-etichete` + `knowledge/etichete-taguri.md`.
8. **Alergeni**: `set_product_allergens(productId, allergenIds)` — ⚠ ÎNLOCUIEȘTE tot setul, citește întâi ce are produsul. Dacă lista de alergeni e goală, cere userului să ruleze seed-ul UE din pagina Alergeni. Produsele cu rețetă moștenesc automat alergenii ingredientelor — setează manual doar ce nu vine din rețetă.
9. **TVA la final**: dacă au rămas găuri, `auto_assign_vat_batch` (cu onlyMissing) + verificare prin citire.
10. **Stoc inițial** doar dacă userul îl cere: `set_initial_stock` (creează document de ajustare + mișcări reale).
11. Anti-capcane: NU folosi `auto_create_menu_from_products` pe un tenant viu (bagă TOATE produsele nemeniuite cu preț 0 într-un meniu activ); la `bulk_update_menu_item_prices` dă MEREU `brandId` (altfel face match pe nume în tot sistemul); NU schimba `warehouseId` pe produse cu stoc „din curățenie" (declanșează transfer contabil automat).

## Faza 5 — Verifică prin CITIRE (niciodată prin UI)

- `list_menu_items(menuId)` — numărul și prețurile vs sursă.
- `list_untagged_products` — niciun produs nou fără tag de rutare.
- `analyze_recipes(brandId)` — rețete incomplete / ingrediente lipsă.
- `analyze_food_costs` sau `generate_report(food_cost)` — un cost absurd (150%+) = aproape sigur unitate greșită în rețetă.
- `get_recipe_details` pe 2-3 rețete noi — productId legat corect (`list_recipes` NU arată productId).
- UI-ul se actualizează abia după refresh — succes la tool = salvat; nu repeta scrierea.

## Faza 6 — Ce rămâne din aplicație (puțin)

Aproape tot importul se face acum prin conexiune (categorii, descriere, gramaj, poze, alergeni). Rămâne pentru user doar:

1. **Regulile de rutare pentru taguri NOI** — dacă ai introdus o secție pentru care clientul nu avea deja un tag cu regulă, regula tag→imprimantă/KDS se creează din Setări → Imprimante. Spune-i clar ce tag și unde trebuie să iasă.
2. **Zeci de poze necunoscute** — dacă userul are un folder de poze fără să știi ce produs e fiecare, pagina Poze Bulk Meniu (`/menu/pricing/bulk-photos`) le potrivește cu AI. (Când ai URL-ul + produsul, pui poza direct cu `set_product_image`.)
3. **Dacă tot dai de un perete** (ceva ce userul poate face în aplicație dar tu nu poți prin conexiune) — raportează cu `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`); echipa Symbai prioritizează pe baza ticketelor.

## Reguli de aur

- Prețul de vânzare = meniu. Costul = rețetă + recepții (NIR). P&L = tipul de produs. Rutarea bonurilor = taguri. Nu le amesteca.
- `receptionPrice` la marfă = preț de raft (se completează automat din primul preț de meniu), NU cost — nu-l „repara" pentru food cost.
- Caută înainte de a crea; citește după ce scrii; nu repeta o scriere „ca să se prindă".
- ID-uri, nu nume, peste tot unde ai ambele opțiuni.
- Dacă tokenul nu are modulul de scriere necesar („Permisiune insuficientă"), explică activarea din portal Hub → Acces AI.
