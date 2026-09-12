# Produse, rețete și import de meniu — detalii pe operație

Consultă secțiunea necesară cererii; nu este un checklist de onboarding pentru fiecare corecție. Ghidul scurt și regulile comune sunt în [SKILL.md](../SKILL.md).

- Faza 0: sursa importului și datele lipsă.
- Faza 1: contextul pentru produse noi; selectează numai verificările relevante.
- Faza 2: tipul produsului și modelarea rețetei/porționării.
- Faza 3: maparea importului și acordul deja dat.
- Faza 4: execuție — categorii, produse, rețete, randament, meniu, poze, combo-uri, rutare, alergeni, TVA și stoc inițial.
- Faza 5: verificarea obiectelor modificate.
- Faza 6: pași din aplicație când lipsește unealta necesară.

## Faza 0 — Strânge datele (doar la import)

1. **Folosește sursa deja oferită**: URL, document atașat, Excel/export, poze sau textul mesajului. Cere sursa numai dacă lipsește și nu o poți identifica din conversație.
2. **Website**: ia conținutul URL-ului. Dacă HTML-ul vine gol → e un SPA (React/Angular/Vue); **caută API-ul din spate** — platformele de meniu au de regulă un endpoint JSON public (exemplu real: SmartMenu servește totul din Firebase Realtime DB, `https://smart-menu-...firebasedatabase.app/restaurant-menus/{slug}.json` → categorii → produse, cu name/price/description/weight/allergens/imageUrl per produs). Dacă nu găsești API-ul, cere userului un export sau screenshot-uri — nu ghici conținutul.
3. **Per produs vrei**: nume, preț, categorie/secție (bucătărie vs bar), descriere, gramaj, alergeni, poză (URL), **slug-ul SEO din URL** (ultimul segment, ex. `site-exemplu.ro/limonada-de-casa` → `limonada-de-casa`), codurile de scanner dacă există (`sku`, `barcode`, `ean` — critic la retail), și pentru băuturi: cum se vinde (sticlă întreagă vs porție turnată).
   - **Slug-ul sursă**: la magazine care se MUTĂ pe Symbai, trimite slug-ul vechi ca arg `slug` la `add_menu_item`/`bulk_add_menu_items` (și `create_menu_category`) ca să PĂSTREZI URL-urile indexate (continuitate SEO, fără 404). Dacă nu-l trimiți, platforma generează automat unul curat din nume. Detalii: `knowledge/onboarding/02d-import-surse-externe.md` → „Slug-ul SEO din URL-ul sursei".
4. **Inventariază ce lipsește** și citește întâi datele existente. Întreabă compact numai despre informațiile indispensabile încă necunoscute. Descrierile, pozele și alte câmpuri opționale lipsă nu blochează introducerea autorizată; nu le inventa.
5. Alternativă in-app (propune-o când userul are PDF/poze/Excel și preferă să nu treci tu prin MCP): paginile `/menu/import-pdf` (extrage produse + prețuri + poze + design) și `/ai-bulk-import` (Excel cu mapare AI) fac importul direct în aplicație.

## Faza 1 — Identifică doar contextul necesar produselor noi

Lista de mai jos este pentru alegerea pașilor relevanți, nu o secvență obligatorie de apeluri. Reutilizează datele deja verificate în conversație. Pentru o corecție punctuală folosește fluxul scurt de mai sus. Pentru un ingredient nou care nu se vinde în meniu nu sunt necesare categoriile de meniu, stilul barului sau rutarea la imprimante.

1. `list_brands` + `list_locations` + `list_menus` — brandul și meniul țintă. Dacă creezi meniu nou cu `create_menu`: se naște **draft** — activează-l cu `update_menu(status: "active")`.
2. `list_product_types(brandId)` — tipurile de produs REALE ale clientului (poate avea tipuri custom; folosește-le pe ale lui).
3. **Stilul de taguri**: `list_tag_summary` + `list_tags` — vezi ce taguri există și câte produse are fiecare (ex. „BAR" și „BUCATARIE", fiecare cu zeci de produse). **Tagurile existente au deja reguli de rutare către imprimante/KDS — refolosește-le întocmai** (același nume, nu variante noi). Care taguri au deja reguli de rutare active vezi cu `list_tag_routing_rules`.
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

- **Semipreparatul se scade ca atare, nu pe ingrediente**: la vânzarea unui preparat care are ca ingredient un semipreparat (`wip`), din stoc scade **semipreparatul**, un singur nivel în jos — nu ingredientele lui. Deci semipreparatul trebuie **produs** (din modulul Producție) ca să existe pe stoc; altfel intră pe minus la fiecare vânzare. Costul, în schimb, se calculează pe toate nivelurile, deci un semipreparat neprodus arată cost corect și stoc negativ în același timp.
- **Unitatea băuturilor porționate**: verifică unitatea de stoc și conversiile configurate pentru produs înainte să calculezi porția. Litrii simplifică rețetele în ml; un produs ținut la bucată poate avea o conversie explicită per sticlă. Nu schimba unitatea produsului existent doar pentru a evita citirea conversiei. Lipsa conversiei nu dovedește mărimea sticlei.
- **TVA România: 0 / 11 / 21.** Mâncare preparată și băuturi nealcoolice de regulă 11; **alcoolul mereu 21**; setează `vat` explicit la creare. La import HoReCa fără TVA, serverul are fallback determinist (alimente/apă 11, alcool/băuturi zaharoase/cafea/non-food/incert 21), dar explicitul câștigă.
- **Marfa fără rețetă e normală** (nu e o problemă de date); un `finished_good` fără rețetă E o problemă — nu scade stoc și rămâne necostat în P&L.

## Faza 3 — Verifică planul și acordul existent (doar la import)

Pregătește maparea: nume | tip | UM | TVA | categorie | preț | tag rutare | rețetă (da/nu), cu câmpurile suplimentare disponibile în sursă. Verifică numărul, dublurile și previzualizarea tool-ului când există. Dacă utilizatorul a cerut deja importul acestei surse în destinația identificată, continuă în acel scop. Prezintă și cere numai deciziile încă lipsă sau efectele suplimentare descoperite; nu cere din nou aceeași aprobare și nu încărca în chat sute de rânduri doar pentru confirmare.

## Faza 4 — Execută în ordinea corectă

1. **Categoriile de meniu întâi** (la import): pentru multe categorii folosește `bulk_create_menu_categories({ brandId, items })`; părinții trebuie să fie înaintea copiilor când folosești `parentName`. Punctual, `create_menu_category` per secție (Gustări, Cocktailuri, Vin Alb…), ierarhic cu `parentId`. Tool-urile sunt idempotente și atașează categoriile la meniurile brandului.
2. **Materiile prime apoi** (`bulk_create_products` cu type + unit + vat + warehouseId + description + weight + `sku`/`barcode`/`ean` dacă sursa le are), apoi produsele vândute. Pentru retail, codurile de bare/EAN se pun la creare/import; altfel scannerul POS/inventar nu are ce potrivi. Dacă ai doar costuri estimate înainte de prima recepție, setează `standardCost` / `set_standard_costs`; nu inventa stoc sau NIR.
3. ⚠ **Dedupe silențios cu success:true**: `create_product` / `create_menu` / `create_menu_category` / `create_tag` / `create_allergen` întorc entitatea EXISTENTĂ dacă numele/perechea există — parametrii tăi NU se aplică pe ea. Citește răspunsul, nu doar status-ul.
4. **Rețete** (modul `retete`): `create_recipe` cu **productId EXPLICIT mereu** (fără el → match PARȚIAL pe nume sau auto-creează un produs nou greșit). `add_recipe_ingredients` cu **productId, nu productName** (typo la nume → auto-creează un raw_material dublură).
   - **Verifică unitățile din datele deja citite**: `get_recipe_details` și `list_recipes` pot include `unit` (unitatea cantității din rețetă), `productUnit` (unitatea de stoc) și `productType` la ingrediente. Nu apela `get_product_details` pentru fiecare ingredient dacă aceste câmpuri sunt deja disponibile. Cu citire SQL autorizată, pentru multe ingrediente citește unitățile și conversiile într-un set filtrat după ID-urile lor. Cere detaliul produsului numai pentru câmpurile încă lipsă. Conversiile g↔kg și ml↔l se calculează exact; între familii folosește conversia configurată. Dacă nu există informație pentru conversie, păstrează fallback-ul platformei 1:1, fără să inventezi densitatea, greutatea sticlei ori mărimea ambalajului și fără să blochezi automat salvarea. Nu presupune că toate versiunile normalizează automat unitățile la fallback: unele fluxuri de rețete păstrează cifra brută la o conversie necunoscută. Pentru aproximarea 1:1 masă↔volum, normalizează întâi în kg/l și salvează explicit cantitatea echivalentă în unitatea de stoc (ex.: 300 ml → 0,3 l → 0,3 kg prin fallback, nu 300 kg). Aceasta este o aproximare implicită, nu o densitate măsurată. La bucăți/ambalaje, nu inventa mărimea sticlei și nu transforma automat gramajul în același număr de bucăți; verifică perechea cantitate-unitate efectiv salvată. Pentru un audit cerut pe mai multe rețete există `scan_recipe_unit_mismatches`; aplică `fix_recipe_unit_mismatches` numai în scopul corecției autorizate. Modificarea definiției rețetei nu dovedește recalcularea consumului istoric; aceasta se verifică separat, prin fluxul din `verifica-consumul`.
   - **Randamentul (`yield`) influențează consumul**: pentru o rețetă scrisă la o porție păstrează 1 sau valoarea existentă echivalentă; pentru un lot folosește cantitățile și randamentul real al lotului. Verifică împreună cantitatea, unitatea randamentului și unitatea produsului rezultat. Nu transforma gramajul porției în număr de porții și nu modifica randamentul când utilizatorul cere doar alt ingredient. Folosește punct pentru zecimale, pentru compatibilitate cu versiunile vechi; modificarea se face prin `update_recipe`. Recitește rezultatul și folosește raportul dedicat dacă trebuie verificat consumul/costul.
5. **În meniu, complet dintr-un apel**: `add_menu_item(menuId, productId, price, name, menuCategoryId, description, gramaj, sortOrder)` — pune prețul, categoria, descrierea și gramajul deodată. E UPSERT (dacă produsul e deja în meniu, câmpurile se aplică pe item-ul existent); numele afișat ia implicit numele produsului. Categoria se oglindește automat și pe produs. Prețul de vânzare se setează DOAR aici.
6. **Imagini**: `set_product_image(productId, imageUrl)` cu URL-ul public al pozei (de pe meniul/site-ul vechi) — se descarcă, se optimizează și se propagă la articolele de meniu. `gallery: true` pentru poze suplimentare (galeria de pe pagina de produs din magazin: `bulk_set_product_images` pune mai multe deodată, prima = coperta). Ai un URL de poză dar nu ești sigur ce produs e? `interpret_menu_photo(imageUrl)` întoarce cele mai probabile articole de meniu cu scor de încredere (opțional restrânge cu `candidates`) — verifici potrivirea ÎNAINTE de `set_product_image`.
   - **Un FOLDER de poze pe calculatorul userului („am pozele la toate preparatele")** — o faci singur, prin conexiune, fără să-l trimiți în aplicație. Rețeta cu trei pași și capcanele ei: `knowledge/poze-produse-in-masa.md`. Pe scurt: listezi fișierele → `match_product_photos_by_filename(fileNames)` îți arată ce produs ia fiecare poză și cât de sigură e potrivirea (previzualizare, nu scrie nimic) → `upload_product_photos(photos)` le urcă (fiecare poză = `fileName` + conținutul citit de pe disc, codat base64). Potrivirea ignoră diacriticele, prefixele de aparat foto și contoarele, iar ce nu e sigur NU se scrie: îți vine înapoi de confirmat cu userul. La final, `list_products_without_photo` îți spune ce a rămas descoperit.
   - **Magazin online — pagină de produs bogată**: dacă produsele ajung pe site, pune și galerie + descriere lungă + specificații + preț redus + garanție + FAQ + accesorii/pachet pe `add_menu_item`/`update_menu_item` (`descriptionHtml`, `specs`, `compareAtPrice`, `warrantyMonths`, `faq`, `badges`, `installmentMonths`, `videoUrl`, `safetyCert`, `displaySku`) + `set_product_recommendations` + `set_product_bundle`. Rețeta completă cu bife: `knowledge/website-builder-pdp.md`.
6b. **Combo-uri și pachete — alege corect, sunt trei lucruri diferite**:
   - **Clientul ALEGE** ceva la comandă (ex. „Șaorma + sucul la alegere", „Meniu Cryspi + sos") → NU e pachet, e **grup de modificatori OBLIGATORIU**: `set_product_option_groups(productId, groups)` cu `isRequired:true`, `minSelect:1`. Leagă fiecare opțiune de produsul real (`linkedProductId`) ca să scadă și stocul, și ca TVA-ul să iasă corect pe bon. Verifică apoi cu `get_product_option_groups`. ⚠ Fără `linkedProductId` opțiunea e doar text pentru bucătărie: nu scade stoc.
   - **Conținut FIX**, vândut ca un singur produs (ex. „Coș cadou: 2 vinuri + 1 ciocolată") → **pachet**: produsul trebuie să aibă tipul „Ambalaje/pachet" (`change_product_type` dacă nu îl are), apoi `set_product_package(productId, items)` (🔒 înlocuiește tot conținutul; verifică cu `get_product_package`).
   - **Sugestie pe pagina de produs din magazinul online** („Cumpărate frecvent împreună") → `set_product_bundle`. Nu are efect la POS.
   Tabel de decizie + capcane: `knowledge/modificatori-optiuni-produs.md`.
7. **Taguri pentru rutare**: întâi `search_products_for_tagging` (dry-run, confirmă numărul), apoi `bulk_assign_tag` cu `entityIds` sau filtre (categoryName face match pe subtree + fără diacritice). **Tag NOU = bonuri pierdute**: un tag creat de tine NU rutează nicăieri până nu există regula în aplicație — produsele lui generează bonuri „unrouted" care nu se printează și nu apar pe niciun ecran, FĂRĂ eroare. Dacă chiar e nevoie de tag nou: `create_tag` + spune-i userului EXPLICIT să creeze regula în Setări → Imprimante (rutare taguri) și verifică apoi. Pentru lucrul amănunțit cu etichete (rutare/marketing/audit) → skill-ul `gestioneaza-etichete` + `knowledge/etichete-taguri.md`.
8. **Alergeni**: `set_product_allergens(productId, allergenIds)` — ⚠ ÎNLOCUIEȘTE tot setul, citește întâi ce are produsul. Dacă lista de alergeni e goală, cere userului să ruleze seed-ul UE din pagina Alergeni. Produsele cu rețetă moștenesc automat alergenii ingredientelor — setează manual doar ce nu vine din rețetă.
9. **TVA la final**: dacă au rămas găuri, `auto_assign_vat_batch` (cu onlyMissing) + verificare prin citire.
10. **Stoc inițial** doar dacă userul îl cere: `set_initial_stock` (creează document de ajustare + mișcări reale).
11. Anti-capcane: NU folosi `auto_create_menu_from_products` pe un cont viu, cu date reale (bagă TOATE produsele nemeniuite cu preț 0 într-un meniu activ); la `bulk_update_menu_item_prices` dă MEREU `brandId` (altfel face match pe nume în tot sistemul); NU schimba `warehouseId` pe produse cu stoc „din curățenie" (declanșează transfer contabil automat); `standardCost` nu mișcă stoc și nu înlocuiește NIR-ul.

## Faza 5 — Verifică prin citire obiectele modificate

Pentru o corecție punctuală este suficientă recitirea rețetei/produsului/articolului de meniu afectat, cu ID-ul, câmpul și valoarea cerută. Nu lansa automat un audit al întregului brand sau al tuturor costurilor. Dacă răspunzi și despre un cost ori total derivat, recalculează-l din starea nouă prin raportul dedicat; valoarea dinaintea schimbării nu mai dovedește costul actual. Spune separat când recalcularea este încă în curs.

La import, alege verificările relevante de mai jos pentru loturile și meniul modificate:

- `list_menu_items(menuId)` — numărul și prețurile vs sursă. Pentru meniuri mari folosește `export_menu(menuId, "markdown"|"csv")` ca tabel complet sau paginează `list_menu_items` cu `categoryId`/`limit`/`offset`; răspunsul compact automat nu conține toate detaliile (descriere, gramaj, poze).
- `list_untagged_products` — niciun produs nou fără tag de rutare.
- `analyze_recipes(brandId)` — rețete incomplete / ingrediente lipsă.
- `analyze_food_costs` sau `generate_report(food_cost)` — un cost absurd (150%+) = aproape sigur unitate greșită în rețetă.
- `get_recipe_details` pentru rețetele nou create/modificate — confirmă ID-ul produsului, ingredientele, cantitățile, unitățile și randamentul față de sursă. `unit` și `productUnit` sunt lucruri distincte; diferența g/kg este convertibilă, nu o eroare. O conversie de ambalaj trebuie să provină din date, nu din presupunere. Pentru un audit cerut pe tot brandul există `scan_recipe_unit_mismatches`. În fabrică, folosește `includeUnlinked:true` când investighezi rețete orfane; numele identic al două produse nu autorizează mutarea sau recrearea rețetei fără verificarea ID-urilor.
- UI-ul se actualizează abia după refresh — succes la tool = salvat; nu repeta scrierea.

## Faza 6 — Ce rămâne din aplicație (puțin)

Aproape tot importul se face acum prin conexiune (categorii, descriere, gramaj, poze, alergeni). Rămâne pentru user doar:

1. **Regulile de rutare pentru taguri NOI** — dacă ai introdus o secție pentru care clientul nu avea deja un tag cu regulă, regula tag→imprimantă/KDS se creează din Setări → Imprimante. Spune-i clar ce tag și unde trebuie să iasă.
2. **Poze care nu se pot recunoaște după nume** — un folder cu poze denumite `IMG_0042`, `DSC_1177`, fără nicio legătură cu preparatul. Potrivirea pe nume nu are de unde să știe ce e în ele, iar tu nu ghicești. Două ieșiri: userul redenumește fișierele după preparat (atunci le urci singur, vezi Faza 4 pasul 6), sau le potrivește vizual din pagina Poze Bulk Meniu (`/menu/pricing/bulk-photos`), unde AI-ul se uită în poză, nu la nume. Un folder cu nume normale („ciorba de vacuta.jpg") NU intră aici — pe acela îl faci prin conexiune.
3. **Dacă tot dai de un perete** (ceva ce userul poate face în aplicație dar tu nu poți prin conexiune) — raportează cu `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`); echipa Symbai prioritizează pe baza ticketelor.

