# Onboarding 02 — Importul datelor: produse, meniu, stocuri + verificare

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final există: catalogul de produse (cu unitate de măsură, tip și TVA corecte), gestiunile (magaziile) în care stau, cel puțin un meniu activ cu prețuri de vânzare și — opțional — stocul inițial și furnizorii. Fără această bază, fazele următoare (etichete, rutare bucătărie, rețete, rapoarte) nu au pe ce lucra. Faza se încheie cu o verificare de sănătate echivalentă pasului 3 din wizard-ul aplicației.

**Avantajul tău unic**: poți citi fișiere locale (Excel/CSV/PDF) direct de pe PC-ul utilizatorului și poți crea/importa datele prin tool-uri — paginile de import din fișier au fost retrase (25.09.2026), deci importul se face prin conexiune.

## Permisiuni necesare pe token

- **`produse_meniu`** — obligatoriu: produse, gestiuni, stoc inițial, meniuri, prețuri, cote TVA.
- **`furnizori`** — doar dacă fișierele conțin și furnizori (create_supplier + catalog).
- **SQL read-only** (toggle separat) — opțional, util la verificarea finală pe cataloage mari.

Se activează din portalul Hub (hub.symbai.app) → Acces AI. Fără modul, tool-urile de scriere nu apar în listă, iar la apel întorc „Permisiune insuficientă" — nu e bug, cere utilizatorului să activeze modulul.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Afli singur (rulează înainte de orice întrebare):**
- `list_brands` + `list_locations` — brandId/locationId pentru toate apelurile. Dacă lipsesc → faza 1 (firmă/branduri/locații) nu e gata; oprește-te acolo.
- `list_warehouses_full` — ce gestiuni există deja (nu crea „Bucătărie" a doua oară).
- `list_menus` + `list_menu_items(menuId)` — ce meniuri/articole există deja.
- `list_vat_rates` — cotele configurate (RO: 0/11/21).
- `list_product_types(brandId)` — tipurile de produs definite.
- `search_products_db(query)` — există deja produse cu numele din fișier? (anti-duplicat).
- `get_config_status(brandId)` — starea generală a configurării.
- Fișierul în sine: citește-l TU (structură, coloane, număr de rânduri, format numere, cote TVA folosite) înainte să pui orice întrebare despre el.

**Întrebi utilizatorul (minimul):**
1. „Ai un fișier cu produsele/meniul (Excel, CSV — export din vechiul sistem)? Unde e pe calculator?" — decide dacă imporți din fișier sau construiești lista cu el.
2. „Prețurile din fișier sunt prețuri de **vânzare** (cele de pe meniu, cu TVA) sau prețuri de **achiziție**?" — doar dacă nu reiese din fișier.
3. „În ce magazie intră produsele — totul într-una, sau împărțit Bucătărie/Bar?" — doar dacă există mai multe gestiuni sau niciuna.
4. „Setez și stocul curent din fișier, sau pornești de la zero și înregistrezi marfa prin recepții în aplicație?" — doar dacă fișierul are coloană de stoc.
5. **Confirmarea înainte de scriere**: arată un rezumat (câte produse, ce mapare de coloane ai dedus, 3-5 rânduri exemplu, ce TVA/unități ai normalizat) și așteaptă „da". Nu cere date opționale (SKU, coduri de bare, descrieri) — le imporți dacă există, nu le vânezi.

## Calea de lucru

Paginile de import din fișier (`/data-import`, `/ai-bulk-import`, importul din pasul 2 al onboarding-ului, „Meniu din PDF”) **au fost retrase pe 25.09.2026**. Nu mai există sesiune de import cu întrebări și nici wizard de fișiere. Calea unică: **citești tu fișierul și creezi datele cu uneltele dedicate** (pașii de mai jos), în loturi, cu verificare prin citire.

- **Excel/CSV cu produse și meniu** → pașii 1-3 de mai jos (`create_warehouse`, `bulk_create_products`, `bulk_create_menu_categories`, `create_menu` / `bulk_create_menus`, `bulk_add_menu_items`).
- **Catalog / ofertă de furnizor dintr-un fișier** → `import_supplier_catalog_from_file({ supplierId, fileName, fileContentBase64, currency?, defaultUnit?, columnMap? })`.
- **Rețetar din Excel** → faza 09, `import_retetar` cu `dryRun: true`, apoi commit după acord.
- **Clienți din fișier** → pagina `/customer-import`.
- **Meniu din PDF sau poze** → îl citești tu, arăți propunerea (produse, prețuri, categorii) și o creezi prin aceleași unelte după acord; prețurile vin doar din document. Vezi și skill-ul `adauga-produs-reteta`.
- Fișierele cu **rețete** sau **angajați** NU se importă în faza asta — au fazele lor (rețete, personal); notează că le-ai văzut și revino la ele.

> La fișiere mari: împarte în loturi de ~50-100 rânduri, ține evidența progresului (ID-urile întoarse) și verifică după fiecare lot.

## Pașii de execuție — tool-urile MCP exacte

Normalizează ÎNAINTE de orice apel: numere europene („1.234,50" → 1234.50), unități (kilogram/kilo → `kg`, bucata/pcs → `buc`, litru → `l`), TVA legacy (5/9 → 11, 19/24 → 21 în RO), spații/diacritice consistente în nume.

**1. Gestiuni** (dacă lipsesc) — `create_warehouse`:
```
create_warehouse({ name: "Bucătărie", locationId: 1 })
create_warehouse({ name: "Bar", locationId: 1 })
```
Idempotent pe nume (re-apelul întoarce gestiunea existentă). Zona de depozitare implicită se creează automat — NU folosi `create_storage_zone`/`bulk_create_storage_zones` decât dacă utilizatorul cere explicit sub-zone (frigider, raft).

**2. Produse** — `bulk_create_products` în loturi de ~50-100:
```
bulk_create_products({
  brandId: 1,
  products: [
    { name: "Coca-Cola 330ml", warehouseId: 2, unit: "buc", vat: 21, type: "merchandise", receptionPrice: 3.5 },
    { name: "Piept de pui", warehouseId: 1, unit: "kg", vat: 11, type: "raw_material", receptionPrice: 22 }
  ]
})
```
- Tipuri uzuale: `raw_material` (ingrediente), `merchandise` (marfă revândută ca atare), `finished_good` (preparate), `wip` (semipreparate).
- Idempotent pe nume EXACT: rândurile cu nume identic sunt sărite (răspunsul conține `created`/`skipped` + produsele cu ID-uri, inclusiv cele existente — păstrează ID-urile pentru pașii următori).
- Default-uri la câmpuri lipsă: `unit: "buc"`, `type: "raw_material"`, TVA = cota implicită a țării. NU te baza pe ele — trimite explicit.
- **Prețul de vânzare NU se pune aici** — doar `receptionPrice` (achiziție). La `merchandise`, receptionPrice se completează automat din primul preț de meniu dacă lipsește.

**3. Meniu** — `create_menu` (idempotent pe nume+brand), apoi articole:
```
create_menu({ name: "Meniu Principal", brandId: 1 })
add_menu_item({ menuId: 5, productId: 123, price: 12.5, name: "Coca-Cola 330ml" })
```
- Cu 2+ branduri: `bulk_create_menus({ menus: [{ name: "Meniu X", brandId: 1 }, ...] })` — un meniu per brand.
- `add_menu_item` e idempotent pe (menuId, productId), dar **NU actualizează prețul** dacă articolul există — pentru asta `update_menu_item({ brandId, menuItemId, price })` sau, în masă pe nume, `bulk_update_menu_item_prices({ brandId, items: [{ name, price }] })`, sau pe ID-uri `apply_menu_prices({ menuId, prices: [{ menuItemId, newPrice }] })`.
- Trimite și `name` la `add_menu_item` (numele afișat în meniu) — serverul îl acceptă chiar dacă nu apare în schema tool-ului; fără el articolul apare ca „Item".
- `auto_create_menu_from_products({ brandId, menuName? })` — folosește-l DOAR pe un catalog format aproape exclusiv din produse vandabile: bagă TOATE produsele active care nu-s în niciun meniu, **indiferent de tip** (și materiile prime!) și **cu preț 0**. După el trebuie oricum setate prețurile. Pe un catalog mixt, preferă `add_menu_item` selectiv.
- Categorii multe/ierarhice: `bulk_create_menu_categories({ brandId, items })` înainte de articole. Pune părinții înaintea copiilor; poți folosi `parentName` pentru categoriile create anterior în același apel. Pentru categorii existente, tool-ul le refolosește și nu le suprascrie culoarea/ordinea — editează cu `update_menu_category_fields`.

**4. TVA** — de regulă cotele 0/11/21 există deja (`list_vat_rates`). Dacă lipsește una: `create_vat_rate({ name: "TVA Alimente", rate: 11 })`. Corecția pe mai multe produse: `bulk_update_products({ productIds, updates: { vatRate } })`. În RO HoReCa, dacă importul nu primește TVA explicit, serverul are fallback determinist: mâncare/preparate/apă → 11; alcool, băuturi zaharoase/aromate, cafea/ceai, non-food sau incert → 21. Explicitul din fișier câștigă.

**5. Stoc inițial, CU COSTURI** (doar dacă utilizatorul a confirmat) — foaia de stoc inițial, nu ajustări produs cu produs:
- `get_opening_setup` → luna stocului și pasul următor; luna lipsă se alege cu `set_opening_config({ openingStockEffectiveMonth })`.
- `save_opening_stock({ rows })` — pe fiecare rând: produsul (id, cod sau denumire exactă), gestiunea, `qty` și **costul**: `unitCost` (fără TVA, pe unitatea de stoc) sau `totalValue` (valoarea fără TVA a acelei cantități din raportul vechi; costul unitar se calculează singur). Se poate trimite pe bucăți: implicit rândurile se adaugă peste ce e deja pe foaie.
- **Costul e obligatoriu pe fiecare rând** și devine costul de pornire al produsului (food cost, costul mărfii vândute, marjă). Rândul fără cost e refuzat și numit în răspuns: ia costul din raportul sursă (stoc valoric, ultima factură) ori cere-l omului. Nu pune 0 „ca să treacă” și nu folosi prețul de vânzare. Răspunsul semnalează separat rândurile salvate cu cost 0.
- `get_opening_stock` → arată-i omului rândurile și valoarea totală (trebuie să bată cu raportul lui) → `publish_opening_stock({ confirm: true })` după acordul lui explicit. Se publică o singură dată pe brand; nu produce note contabile.
- **Nu încărca stocul de pornire cu `set_initial_stock`, `apply_physical_inventory` ori un document `ADJUSTMENT_PLUS`**: niciuna nu primește costuri, deci produsele fără cost cunoscut intră la valoare 0, iar ajustările produc și note contabile. `set_initial_stock` rămâne pentru corecția punctuală a unui produs care are deja cost.
- Detalii și capcane: skill-ul `deschide-firma` + `knowledge/deschidere-solduri-stoc-initial.md`.
- Dacă userul vrea doar un cost provizoriu pentru food cost înainte de prima recepție, NU seta stoc fictiv: folosește `set_standard_costs` / `standardCost` pe produs. Nu mișcă stoc, nu schimbă CMP și este umbrit de prima recepție reală.

**6. Furnizori** (opțional, modul `furnizori`) — `list_suppliers(query: CUI)` întâi, apoi doar pentru cei lipsă `create_supplier({ name, cui?, phone?, paymentTermsDays?, deliveryDays? })` (furnizorul e al firmei, fără brand), apoi catalogul: `create_supplier_product({ supplierId, name, unit?, price?, vatRate? })` + legătura la produsul intern `create_supplier_product_mapping({ supplierProductId, productId, isPreferred? })`.

**După FIECARE scriere**: confirmă printr-o citire (`list_menu_items`, `search_products_db`, `list_warehouses_full` etc.), NU prin ce vede utilizatorul în browser — interfața are cache și arată datele noi abia după refresh. Nu repeta scrierea, nu raporta bug.

## Ce poate necesita aplicația / fallback UI

- **Categoriile de meniu** (Aperitive, Paste, Bar > Bere…) — prin MCP: `bulk_create_menu_categories` pentru importuri mari sau `create_menu_category` punctual, apoi `update_menu_item({ brandId, menuItemId, menuCategoryId })`. Manual, în aplicație: `gaseste_in_aplicatie("categorii meniu")`. După import: `list_menu_categories({ brandId })` — vezi numărul de produse per categorie.
- **Pozele produselor** — pe instanțele mai noi există `set_product_image({ productId, imageUrl })` (poză dintr-un URL public, ex. de pe website-ul/meniul vechi al restaurantului) — verifică dacă apare în sesiunea ta. Dacă NU: pozele se pun din aplicație, pe fișa produsului sau prin biblioteca media — `gaseste_in_aplicatie("poze produse meniu")`.
- **Importul din fișier în aplicație** nu mai există (paginile au fost retrase); tot importul trece prin conexiune.
- **Meniu din PDF/poze** — îl citești tu și creezi produsele prin conexiune; după: `list_menu_items`.
- Pentru importul unui meniu de pe **website** (inclusiv site-uri SPA cu API JSON în spate) sau adăugări punctuale după onboarding, există skill-ul dedicat `adauga-produs-reteta` — aceleași reguli, plus descoperirea stilului clientului (taguri, marfă vs materie primă la băuturi).
- **Recepții de marfă (NIR), inventar fizic, transferuri/mișcări de stoc** — pasul „Gestiune & Stocuri" e doar ghid în wizard; documentele se fac din aplicație — `gaseste_in_aplicatie("intrări marfă")` / `("verificare stoc")`. După: `get_warehouse_products_summary({ warehouseId })`.
- **Ștergeri** — există unelte cu previzualizare, după acordul omului: `bulk_delete_products` (implicit `mode:"soft"`, reversibil cu `restore_products`), `delete_menu_category` și `merge_menu_categories` (fără `confirm:true` întorc doar previzualizarea), `delete_recipe`; `delete_brand` / `delete_location` doar pentru administrator (brandul/locația cu istoric se dezactivează, nu se șterg). Gestiunile nu se șterg prin conexiune. Produse duplicate: `merge_finished_products_bulk` sau pagina „Unifică duplicate” (`/automations`).

În conversația cu utilizatorul (om de business): zi „magazie/depozit", „lista de produse", „meniul cu prețuri" — fără „warehouse", „bulk create", „endpoint", „JSON".

## Echivalentul în wizard-ul din aplicație

Pașii 2-5 din `/onboarding/welcome` (pașii la `/onboarding/step/N`):
- **Pasul 2 — Import Date**: importul din fișier a fost scos (25.09.2026); pasul a rămas doar cu navigarea ghidului și butonul „Nu am fișiere de importat”.
- **Pasul 3 — Verificare**: dashboard de sănătate cu 5 verificări (gestiuni, TVA, meniu & prețuri, categorii goale, tipuri produse) + butoane de reparare automată.
- **Pasul 4 — Gestiune & Stocuri**: ghid cu tururi prin paginile de magazii/NIR/inventar (informativ).
- **Pasul 5 — Creare manuală**: fallback când pasul 2 e sărit; trimite la paginile de meniu/rețete/prețuri.

Datele create de tine prin MCP **sunt văzute** de wizard (pașii detectează entitățile existente), dar **progresul wizard-ului (bifele pe pași) NU se actualizează prin MCP** — utilizatorul bifează singur „Următorul pas" dacă vrea să țină wizard-ul sincron. Sesiunile wizard-ului nu pot fi citite sau avansate de tine.

## Verificare la final

> Verificarea NU e doar „bifez că există" — e momentul în care repari ce a greșit importul automat (tip de produs, magazie, TVA, categorii). Citești datele reale, le judeci cu cap și **corectezi prin tool-uri** — faci mai mult și mai bine decât pasul 3 mecanic din wizard.

Replica verificării din pasul 3, prin citiri (+ corecții):
1. `list_warehouses_full` → ≥1 gestiune; `get_warehouse_products_summary({ warehouseId })` pe fiecare → nicio gestiune goală neintenționat.
2. `list_vat_rates` → există 0/11/21 (RO); produsele au cote valide — pe catalog mare, cu SQL read-only: găsește tabela de produse cu `list_database_tables`/`describe_database_table` și caută produsele active cu cote TVA în afara 0/11/21.
3. `list_menus({ brandId })` → ≥1 meniu activ per brand; `list_menu_items({ menuId })` → fără articole cu preț 0/lipsă (sau, cu SQL read-only, caută articolele de meniu cu preț ≤ 0).
4. `list_menu_categories({ brandId })` → fără categorii goale (dacă s-au folosit categorii).
5. `list_product_types({ brandId })` → tipuri definite; produse fără tip → reparare cu `bulk_update_products({ productIds, updates: { productType: "raw_material" } })`.
6. Dacă s-a setat stoc: spot-check `get_product_details({ productId })` pe 2-3 produse.
7. `get_config_status({ brandId })` → procentul de completare a crescut.

Raportează utilizatorului pe scurt: câte produse create/sărite, câte articole de meniu cu preț, ce a rămas de făcut în aplicație (categorii, NIR-uri).

## Capcane

- **Numere europene**: „1.234,50" = 1234.50, nu 1234550. Atenție specială la cantități gen „0.025" (punct = zecimală, nu separator de mii). Tu trimiți `number` curat în tool-uri — normalizarea e treaba ta, înainte de apel.
- **TVA România = 0/11/21**. Fișierele vechi vin cu 5/9/19/24 — remapează (alimente → 11, alcool/băuturi/standard → 21) și NU „repara" înapoi. Ignoră exemplele istorice din descrierile unor tool-uri („ex: 19, 9, 5") — sunt text vechi, nu reguli.
- **TVA lipsă la HoReCa**: importul clasifică determinist lipsurile pe regulile RO curente; dacă sursa are TVA explicit, trimite-l și nu-l înlocui cu presupuneri.
- **Nume de parametri inconsistente**: `create_product`/`bulk_create_products` folosesc `vat` + `type`; `bulk_update_products` folosește `updates.vatRate` + `updates.productType`. Nu le încrucișa.
- **Prețul de vânzare trăiește DOAR în meniu** (`add_menu_item`/`update_menu_item`). Pe produs există doar `receptionPrice` (achiziție). Dacă fișierul are o singură coloană de preț la produse vandabile, aproape sigur e prețul de vânzare → în meniu, nu în receptionPrice (la `merchandise` receptionPrice se auto-completează oricum din primul preț de meniu).
- **`add_menu_item` nu suprascrie prețul** unui articol existent — răspunde „Produsul este deja în meniu". Schimbarea de preț = `update_menu_item`/`apply_menu_prices`/`bulk_update_menu_item_prices`.
- **`auto_create_menu_from_products` nu filtrează după tip** și pune prețul 0 la tot — pe un catalog cu materii prime îți umple meniul cu ingrediente. Folosește-l rar și conștient.
- **Dedupe pe nume EXACT** la `bulk_create_products`: „Coca Cola" ≠ „Coca-Cola" ≠ „coca cola " — normalizează numele o singură dată și consecvent, altfel creezi duplicate pe care doar aplicația le mai poate unifica.
- **`list_entities` cere `brandId`** (obligatoriu în schemă) chiar dacă multe entități (produse, gestiuni) sunt globale pe firmă — trimite-l mereu. Produsele NU aparțin unui brand; legătura cu brandul e prin meniu.
- **Loturi rezonabile**: la sute de rânduri, împarte `bulk_create_products` în apeluri de ~50-100 și ține evidența progresului; la mii de rânduri, verifică după fiecare lot înainte de următorul.
- **Nu re-rula scrieri ca să „apară în UI"** — UI-ul are cache; verifică prin citiri. Majoritatea tool-urilor de creare din faza asta sunt idempotente, dar disciplina rămâne: o scriere, o citire de confirmare.
