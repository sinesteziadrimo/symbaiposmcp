# Onboarding 02 — Importul datelor: produse, meniu, stocuri + verificare

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final există: catalogul de produse (cu unitate de măsură, tip și TVA corecte), gestiunile (magaziile) în care stau, cel puțin un meniu activ cu prețuri de vânzare și — opțional — stocul inițial și furnizorii. Fără această bază, fazele următoare (etichete, rutare bucătărie, rețete, rapoarte) nu au pe ce lucra. Faza se încheie cu o verificare de sănătate echivalentă pasului 3 din wizard-ul aplicației.

**Avantajul tău unic**: poți citi fișiere locale (Excel/CSV/PDF) direct de pe PC-ul utilizatorului și poți crea datele prin tool-uri — utilizatorul nu mai trece prin wizard dacă nu vrea. Există două căi; alege-o conștient (vezi mai jos).

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
1. „Ai un fișier cu produsele/meniul (Excel, CSV — export din vechiul sistem)? Unde e pe calculator?" — decide calea A/B/manual.
2. „Prețurile din fișier sunt prețuri de **vânzare** (cele de pe meniu, cu TVA) sau prețuri de **achiziție**?" — doar dacă nu reiese din fișier.
3. „În ce magazie intră produsele — totul într-una, sau împărțit Bucătărie/Bar?" — doar dacă există mai multe gestiuni sau niciuna.
4. „Setez și stocul curent din fișier, sau pornești de la zero și înregistrezi marfa prin recepții în aplicație?" — doar dacă fișierul are coloană de stoc.
5. **Confirmarea înainte de scriere**: arată un rezumat (câte produse, ce mapare de coloane ai dedus, 3-5 rânduri exemplu, ce TVA/unități ai normalizat) și așteaptă „da". Nu cere date opționale (SKU, coduri de bare, descrieri) — le imporți dacă există, nu le vânezi.

## Calea A vs Calea B — când o alegi pe care

- **Calea A — direct prin tool-uri (tu faci tot)**: fișiere mici-medii și curate (orientativ sub ~200-300 de rânduri), sau utilizatorul dictează lista. Control complet, zero context-switch.
- **Calea B — wizard-ul din aplicație** (pagina „Import din Excel", pasul 2 din onboarding): fișiere mari, multe fișiere deodată, formate murdare (exporturi SAGA/HTML, encoding ciudat), **rețetare ierarhice** sau orice import cu categorii de meniu. Wizard-ul are mapare AI a coloanelor, „Import Doctor" (duplicate, TVA invalid), normalizare automată și import tranzacțional. Ghidează cu `gaseste_in_aplicatie("import produse din excel")`.
- **Meniu din PDF sau poze**: există o pagină dedicată în aplicație care extrage produse + prețuri + design — `gaseste_in_aplicatie("import meniu din PDF")`. NU încerca să reconstruiești tu un meniu fotografiat dacă pagina asta e disponibilă.
- Fișierele cu **rețete** sau **angajați** NU se importă în faza asta — au fazele lor (rețete, personal); notează că le-ai văzut și revino la ele.

## Pașii de execuție — tool-urile MCP exacte (Calea A)

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

**4. TVA** — de regulă cotele 0/11/21 există deja (`list_vat_rates`). Dacă lipsește una: `create_vat_rate({ name: "TVA Alimente", rate: 11 })`. Pentru clasificare automată pe produse: `auto_assign_vat_batch({ brandId, onlyMissing: true })` (AI, loturi de 50; filtre opționale warehouseId/productType).

**5. Stoc inițial** (doar dacă utilizatorul a confirmat) — `set_initial_stock({ productId, quantity })`, un apel per produs:
- Cantitatea e **ABSOLUTĂ** (stocul-țintă, nu adaos); re-apelul cu aceeași valoare e no-op.
- Creează un document de ajustare deja POSTAT, cu efecte în contabilitate — e pentru setup, NU pentru corecții curente de stoc (alea se fac din aplicație prin inventar/mișcări).
- Fără gestiune specificată merge în **prima gestiune activă**; cu mai multe gestiuni trimite și `warehouseId` (acceptat de server, deși nu apare în schemă).
- Pentru sute de produse cu stoc, calea B e mai rapidă (coloana `initialStock` la importul de produse din wizard).

**6. Furnizori** (opțional, modul `furnizori`) — `create_supplier({ name, brandId, cui?, phone?, paymentTermsDays?, deliveryDays? })`, apoi catalogul: `create_supplier_product({ supplierId, name, unit?, price?, vatRate? })` + legătura la produsul intern `create_supplier_product_mapping({ supplierProductId, productId, isPreferred? })`.

**După FIECARE scriere**: confirmă printr-o citire (`list_menu_items`, `search_products_db`, `list_warehouses_full` etc.), NU prin ce vede utilizatorul în browser — interfața are cache și arată datele noi abia după refresh. Nu repeta scrierea, nu raporta bug.

## Ce se face DOAR din aplicație

- **Categoriile de meniu** (Aperitive, Paste, Bar > Bere…) — pe instanțele mai noi există `create_menu_category({ name, brandId, parentId? })` (idempotent pe nume+brand; ierarhie prin `parentId`) — verifică dacă tool-ul apare în sesiunea ta. Dacă NU apare: importul prin wizard (coloana `menuCategory`, cu ierarhie pe separatorul ` > `) sau manual — `gaseste_in_aplicatie("categorii meniu")`. Asignarea pe articole: `update_menu_item({ brandId, menuItemId, menuCategoryId })` cu o categorie EXISTENTĂ a brandului (se oglindește și pe produs). După ce userul zice că a terminat: `list_menu_categories({ brandId })` — vezi numărul de produse per categorie.
- **Pozele produselor** — pe instanțele mai noi există `set_product_image({ productId, imageUrl })` (poză dintr-un URL public, ex. de pe website-ul/meniul vechi al restaurantului) — verifică dacă apare în sesiunea ta. Dacă NU: pozele se pun din aplicație, pe fișa produsului sau prin biblioteca media — `gaseste_in_aplicatie("poze produse meniu")`.
- **Wizard-ul de import** (calea B) — `gaseste_in_aplicatie("import produse din excel")`. După import: verificarea de mai jos prin citiri MCP.
- **Meniu din PDF/poze** — `gaseste_in_aplicatie("import meniu din PDF")`. După: `list_menu_items`.
- Pentru importul unui meniu de pe **website** (inclusiv site-uri SPA cu API JSON în spate) sau adăugări punctuale după onboarding, există skill-ul dedicat `adauga-produs-reteta` — aceleași reguli, plus descoperirea stilului clientului (taguri, marfă vs materie primă la băuturi).
- **Recepții de marfă (NIR), inventar fizic, transferuri/mișcări de stoc** — pasul „Gestiune & Stocuri" e doar ghid în wizard; documentele se fac din aplicație — `gaseste_in_aplicatie("intrări marfă")` / `("verificare stoc")`. După: `get_warehouse_products_summary({ warehouseId })`.
- **Ștergeri** (produse/meniuri/gestiuni greșite) — nu există tool-uri de ștergere prin MCP, intenționat. Pentru duplicate: `gaseste_in_aplicatie("unifică produse duplicate")`.

În conversația cu utilizatorul (om de business): zi „magazie/depozit", „lista de produse", „meniul cu prețuri" — fără „warehouse", „bulk create", „endpoint", „JSON".

## Echivalentul în wizard-ul din aplicație

Pașii 2-5 din `/onboarding` (≈29 de pași în total):
- **Pasul 2 — Import Date**: wizard-ul de fișiere (upload → analiză AI → revizuire → confirmare → import) + varianta „Meniul din PDF sau poze". 9 tipuri de entități importabile (produse, rețetar, articole meniu, gestiuni, furnizori, angajați, mișcări stoc…).
- **Pasul 3 — Verificare**: dashboard de sănătate cu 5 verificări (gestiuni, TVA, meniu & prețuri, categorii goale, tipuri produse) + butoane de reparare automată.
- **Pasul 4 — Gestiune & Stocuri**: ghid cu tururi prin paginile de magazii/NIR/inventar (informativ).
- **Pasul 5 — Creare manuală**: fallback când pasul 2 e sărit; trimite la paginile de meniu/rețete/prețuri.

Datele create de tine prin MCP **sunt văzute** de wizard (pașii detectează entitățile existente), dar **progresul wizard-ului (bifele pe pași) NU se actualizează prin MCP** — utilizatorul bifează singur „Următorul pas" dacă vrea să țină wizard-ul sincron. Sesiunile wizard-ului nu pot fi citite sau avansate de tine.

## Verificare la final

Replica verificării din pasul 3, prin citiri:
1. `list_warehouses_full` → ≥1 gestiune; `get_warehouse_products_summary({ warehouseId })` pe fiecare → nicio gestiune goală neintenționat.
2. `list_vat_rates` → există 0/11/21 (RO); produsele au cote valide — pe catalog mare, cu SQL: `SELECT id, name, vat_rate FROM products WHERE active = true AND vat_rate::numeric NOT IN (0,11,21) LIMIT 50`.
3. `list_menus({ brandId })` → ≥1 meniu activ per brand; `list_menu_items({ menuId })` → fără articole cu preț 0/lipsă (sau SQL: `menu_items` cu `price <= 0`).
4. `list_menu_categories({ brandId })` → fără categorii goale (dacă s-au folosit categorii).
5. `list_product_types({ brandId })` → tipuri definite; produse fără tip → reparare cu `bulk_update_products({ productIds, updates: { productType: "raw_material" } })`.
6. Dacă s-a setat stoc: spot-check `get_product_details({ productId })` pe 2-3 produse.
7. `get_config_status({ brandId })` → procentul de completare a crescut.

Raportează utilizatorului pe scurt: câte produse create/sărite, câte articole de meniu cu preț, ce a rămas de făcut în aplicație (categorii, NIR-uri).

## Capcane

- **Numere europene**: „1.234,50" = 1234.50, nu 1234550. Atenție specială la cantități gen „0.025" (punct = zecimală, nu separator de mii). Tu trimiți `number` curat în tool-uri — normalizarea e treaba ta, înainte de apel.
- **TVA România = 0/11/21**. Fișierele vechi vin cu 5/9/19/24 — remapează (alimente → 11, alcool/băuturi/standard → 21) și NU „repara" înapoi. Ignoră exemplele istorice din descrierile unor tool-uri („ex: 19, 9, 5") — sunt text vechi, nu reguli.
- **Nume de parametri inconsistente**: `create_product`/`bulk_create_products` folosesc `vat` + `type`; `bulk_update_products` folosește `updates.vatRate` + `updates.productType`. Nu le încrucișa.
- **Prețul de vânzare trăiește DOAR în meniu** (`add_menu_item`/`update_menu_item`). Pe produs există doar `receptionPrice` (achiziție). Dacă fișierul are o singură coloană de preț la produse vandabile, aproape sigur e prețul de vânzare → în meniu, nu în receptionPrice (la `merchandise` receptionPrice se auto-completează oricum din primul preț de meniu).
- **`add_menu_item` nu suprascrie prețul** unui articol existent — răspunde „Produsul este deja în meniu". Schimbarea de preț = `update_menu_item`/`apply_menu_prices`/`bulk_update_menu_item_prices`.
- **`auto_create_menu_from_products` nu filtrează după tip** și pune prețul 0 la tot — pe un catalog cu materii prime îți umple meniul cu ingrediente. Folosește-l rar și conștient.
- **Dedupe pe nume EXACT** la `bulk_create_products`: „Coca Cola" ≠ „Coca-Cola" ≠ „coca cola " — normalizează numele o singură dată și consecvent, altfel creezi duplicate pe care doar aplicația le mai poate unifica.
- **`list_entities` cere `brandId`** (obligatoriu în schemă) chiar dacă multe entități (produse, gestiuni) sunt globale pe firmă — trimite-l mereu. Produsele NU aparțin unui brand; legătura cu brandul e prin meniu.
- **Loturi rezonabile**: la sute de rânduri, împarte `bulk_create_products` în apeluri de ~50-100 și ține evidența progresului; la mii de rânduri, recomandă calea B.
- **Nu re-rula scrieri ca să „apară în UI"** — UI-ul are cache; verifică prin citiri. Majoritatea tool-urilor de creare din faza asta sunt idempotente, dar disciplina rămâne: o scriere, o citire de confirmare.
