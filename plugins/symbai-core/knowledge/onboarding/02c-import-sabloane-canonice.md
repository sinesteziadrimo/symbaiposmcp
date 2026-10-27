# Onboarding 02c — Tabelul canonic + pre-creare referințe + capcane prevenite

> Referința tehnică pentru pregătirea datelor la import. Pașii și uneltele: `02-import-date.md`. Surse externe (website/SmartMenu): `02d-import-surse-externe.md`. Folosit de skill-ul `importa-date`.

## De ce un tabel „canonic”

Paginile de import din fișier au fost retrase (25.09.2026): datele intră prin unelte (`bulk_create_products`, `bulk_add_menu_items`, `create_supplier`, `import_retetar`). Înainte de apeluri, aduci fișierul userului (sau datele adunate din mai multe surse, vezi `02d`) la un **tabel de lucru canonic**: o coloană = un sens, valori normalizate, nume consecvente. Din el construiești argumentele uneltelor fără să mai ghicești, iar rezumatul pentru acordul omului iese direct din el. Rețetarul pentru `import_retetar` se trimite ca fișier, cu coloanele de mai jos.

## Coloanele canonice

Pune coloanele cu **aceste nume** (engleză, exact). `*` = obligatoriu.

| Entitate | Coloane (pune-le pe acestea) |
|---|---|
| **products** (produse, marfă, materii prime) | `name*`, `unit`, `receptionPrice`, `menuPrice`, `vatRate`, `productType`, `menuCategory`, `warehouse`, `supplier`, `tag`, `initialStock`, `sku`, `barcode`, `description`, `weight` |
| **menu_items** (articole de meniu cu preț) | `name*`, `price*`, `menuCategory`, `menuName`, `description`, `unit`, `sku` |
| **recipes_full** (rețetar cu ingrediente) | `recipeName*`, `ingredientName*`, `quantity*`, `unit`, `portions`, `unitPrice`, `totalValue` |
| **suppliers** (furnizori) | `name*`, `cui`, `regCom`, `email`, `phone`, `address`, `city`, `paymentTerms`, `leadTime`, `bankAccount`, `currency` |
| **warehouses** (gestiuni) | `name*`, `code*`, `productType` |
| **inventory_ledger** (mișcări de stoc) | `productName*`, `quantity*`, `movementType*`, `warehouse`, `reference`, `unitPrice` |
| **employees** (angajați — faza 07, nu aici) | `lastName*`, `firstName`, `email`, `phone`, `position` (= `role`), `salary`, `pin`, `cnp`, `hireDate`, `contractNumber`, `department`, `employmentType` |

Note:
- `menu_items`: `price` = preț de **VÂNZARE** (cu TVA). Pe articolul de meniu NU există preț de achiziție — `receptionPrice` se pune DOAR pe `products`. Articolele de meniu sunt doar prețuri de vânzare.
- `recipes_full` se scrie **plat** — `recipeName` se REPETĂ pe fiecare rând de ingredient (nu antet + detalii). Rânduri consecutive cu același `recipeName` = aceeași rețetă.

## Valorile valide (enum-uri) — normalizează-le ÎNAINTE

- **`unit`**: `buc, kg, g, l, ml, portie, sticla, cutie, pachet, plic, doza, gal, lb, oz, tona`. Convertește variantele tu: „kilogram/kile/gr." → `kg`/`g`; „bucată/bucati/pcs" → `buc`; „litru" → `l`. ⚠ **sticla de alcool ține-o la `l`** (litri), nu `buc` — altfel rețeta „40 ml" e neconvertibilă și dă food cost ×1000.
- **`vatRate`** (România 2026): **`0`, `11`, `21`**. Cotele legacy (5/9/19/24) sunt **acceptate și remapate automat, în tăcere**: 5→11, 9→11, 19→21, 24→21 (Legea 141/2025) — importul NU întreabă și NU avertizează. Pune direct cota corectă (mâncare/nealcoolice de regulă 11; **alcool mereu 21**; scutit 0) și **verifică post-import** (`search_products_db`/SQL) că TVA-ul e cel dorit.
- **`productType`**: `raw_material` (ingredient cumpărat), `merchandise` (marfă revândută: băuturi îmbuteliate, snacks, țigări), `finished_good` (preparat/cocktail), `wip` (semipreparat/sos de casă). ⚠ Băuturile îmbuteliate sunt **merchandise**, NU raw_material.
- **`menuCategory`** ierarhic cu separatorul ` > `: `"Bar > Bere > Artizanal"`.
- **Numere**: scrie-le cu punct zecimal curat (`1234.50`), nu format RO ambiguu. Atenție la `0.025` (zecimală, nu separator de mii).
- **`movementType`**: `intrare`, `ieșire`, `transfer`, `consum`, `retur_furnizor`, `retur_client`.

## Exemplu concret de fișier canonic (așa scrii)

**products** (produse + marfă; observă: sticla de vodka la `l`, băutura la `merchandise`, ingredientul la `raw_material` fără preț de vânzare):
```csv
name,unit,receptionPrice,menuPrice,vatRate,productType,menuCategory,warehouse
Coca-Cola 330ml,buc,3.5,8,21,merchandise,Bar > Răcoritoare,Bar
Vodka Absolut 0.7L,l,75,,21,merchandise,Bar > Spirtoase,Bar
Piept de pui,kg,22,,11,raw_material,,Bucătărie
```

**menu_items** (doar preț de vânzare; fără preț de achiziție pe meniu):
```csv
name,price,menuCategory,menuName
Mojito,32,Cocktailuri,Meniu Bar
Spritz Aperol,28,Cocktailuri,Meniu Bar
```

**recipes_full** (plat — `recipeName` se REPETĂ; cantități în familia de unități a ingredientului):
```csv
recipeName,ingredientName,quantity,unit,portions
Mojito,Rom alb,0.05,l,1
Mojito,Lime,0.5,buc,1
Mojito,Mentă,0.01,kg,1
Spritz Aperol,Aperol,0.06,l,1
Spritz Aperol,Prosecco,0.09,l,1
```

Scrii fișierul (cu un mic script / capabilitatea de spreadsheet), îl arăți userului ca rezumat, apoi îl imporți.

## Checklist „mapare corectă din prima" (minime întrebări)

Înainte să imporți, verifică fișierul tău:
1. ☐ Coloanele tabelului de lucru = numele canonice de mai sus.
2. ☐ `vatRate` ∈ {0,11,21}; `unit` ∈ lista validă; `productType` ∈ {raw_material, merchandise, finished_good, wip}.
3. ☐ Numere cu punct zecimal; fără „1.234,50" ambiguu.
4. ☐ `menuCategory` cu ` > ` la ierarhii.
5. ☐ O coloană = un sens (fără compozite gen „Bar Capsare" = gestiune+categorie — separă-le).
6. ☐ Numele produselor normalizate consecvent (alegi „Coca-Cola", nu și „Coca Cola").
7. ☐ Referințele (gestiuni, categorii, furnizori, tipuri) **există deja** în aplicație — vezi pre-crearea de mai jos.

Dacă toate sunt bifate, apelurile ies corecte din prima. Ce scade cel mai mult corecțiile ulterioare e **pre-crearea referințelor** (mai jos).

## Pre-creează referințele prin MCP ÎNAINTE de import

Uneltele leagă produsele de gestiuni/categorii/furnizori prin **ID-uri** (`warehouseId`, `menuCategoryId`, `supplierId`). Creează întâi referințele lipsă prin conexiune și păstrează ID-urile întoarse:

| Referință | Tool MCP | Când |
|---|---|---|
| Gestiuni | `create_warehouse({ name, locationId })` | dacă fișierul are >1 gestiune sau niciuna; la multi-locație dă `locationId` |
| Categorii meniu | `create_menu_category({ name, brandId, parentId? })` | pentru fiecare secție din fișier (idempotent pe nume+brand) |
| Tipuri de produs | `create_product_type({ code, name, ... })` | doar dacă fișierul folosește tipuri custom (de regulă cele standard există) |
| Furnizori | `create_supplier({ name*, cui?, ... })` (fără brand; caută întâi cu `list_suppliers`) | dacă imporți produse cu coloană furnizor |
| Cote TVA | `create_vat_rate({ name, rate })` | doar dacă lipsește 0/11/21 (`list_vat_rates` întâi) |
| Sub-zone | `bulk_create_storage_zones({ warehouseId, storageZones })` | DOAR dacă userul cere sub-zone explicit |
| Taguri | `create_tag({ name, brandId })` | refolosește tagurile EXISTENTE; `entityTypes` are deja default `["product"]` (nu-l seta); tag nou ⇒ regulă de rutare din aplicație |

Verifică întâi ce există (`list_warehouses_full`, `list_menu_categories(brandId)`, `list_product_types(brandId)`, `list_suppliers`, `list_vat_rates`) ca să NU dublezi. Apoi pune în fișier numele EXACT al referințelor pre-create.

**Module de bifat pe token pentru pre-creare**: `produse_meniu` (gestiuni, categorii de meniu, cote TVA, sub-zone, taguri), `financiar` (tipuri de produs), `furnizori` (furnizori). Citirile (`list_*`, `search_products_db`) merg fără permisiune.

## Capcanele importului automat — și cum le previi (catalog de capcane cunoscute)

Astea sunt locurile unde importurile greșesc des. Le previi prin tabel canonic + pre-creare refs + verificare. Vânează-le mereu.

**Gestiuni**
- *Tot într-o gestiune greșită* (fallback „Magazie"): pune coloana `warehouse` explicit pe fiecare rând; pre-creează gestiunile.
- *Nume fuzzy* („Bar" poate prinde și „Bar Terasă"): folosește numele EXACT al gestiunii existente; nu te baza pe potrivire parțială.
- *Compozite* („Bar Capsare" = gestiune + categorie): separă în `warehouse=Bar` + `menuCategory=Capsare`.
- *Multi-locație fără locație*: la create_warehouse pe tenant cu >1 locație, dă MEREU `locationId` (altfel stoc fantomă).

**Tip de produs**
- *Băuturi ca materie primă*: setează `productType=merchandise` la băuturi îmbuteliate. NU lăsa default `raw_material`.
- *Coloana „Tip" ignorată*: dacă fișierul are coloană de tip cu valori reale, mapeaz-o (n-o sări) — altfel toate produsele iau un default greșit.

**TVA**
- *Cote legacy/invalide* (5/9/19/24): remapează la 0/11/21 înainte. Alcool 21, mâncare 11.

**Unități**
- *×1000* (sticlă în „buc"): sticla de alcool la `l`. Verifică post-import că un cost/unitate nu e absurd.
- *Plurale RO* (Bucată/Buc/Bucati): normalizează toate la `buc`.

**Prețuri**
- *Vânzare ↔ achiziție inversate*: dacă `menuPrice < receptionPrice` pe tot fișierul, probabil sunt inversate — verifică marja (cost < vânzare, marjă > 0) și corectează.
- *Cu/fără TVA*: confirmă cu userul dacă prețurile-s cu sau fără TVA; verifică pe un exemplu că rezultatul e rezonabil.
- *Monedă* (EUR ca RON): dacă prețurile-s în EUR, confirmă cursul ÎNAINTE și arată userului „10 EUR → 49.70 RON, ok?". Nu importa la curs nesigur.

**Rețete / duplicate / categorii**
- *Grupare plată greșită*: rânduri consecutive cu același `recipeName` = o rețetă; verifică să nu iasă N rețete cu 1 ingredient.
- *Dedupe pe nume EXACT* („Coca Cola" ≠ „Coca-Cola"): normalizează numele o singură dată; caută duplicate cu `search_products_db` înainte.
- *Categorii lipsă*: pre-creează-le cu `create_menu_category`; articolul fără categorie apare în listă plată.

**Brand / locație / furnizori / rânduri**
- *Brand NULL la multi-brand*: dacă tenantul are >1 brand, fixează brandul țintă explicit (produsele/meniul greșit-scop nu apar în rapoarte).
- *Furnizor dublat pe similaritate* („Metro" → „Metro Romania"): confirmă potrivirea, nu o lăsa automată.
- *Rânduri sărite tăcut*: la final, raportează „importate X / sărite Y / total Z" și spune CARE rânduri au fost sărite.
- *Default tăcut*: la magazie și tip de produs trimite MEREU valoarea explicit în apel (nu lăsa default-ul), că acolo dor cel mai tare.

## Verificarea post-import (prin MCP) — vezi „Verifică și corectează” din `02b-import-asistat.md` și „Verificare la final” din `02-import-date.md`

După import, citește datele reale și corectează (tip/TVA/unitate/categorie = sigur; magazie = are efect contabil, cere aprobare). Folosește `search_products_db`/SQL, `list_*`, `get_config_status`. Explică userului fiecare corecție în limbaj de restaurant.
