# Onboarding 02c — Fișierul canonic + pre-creare referințe + capcane prevenite

> Referința tehnică a importului asistat. Orchestrarea: `02b-import-asistat.md`. Surse externe (website/SmartMenu): `02d-import-surse-externe.md`. Folosit de skill-ul `importa-date`.

## De ce un fișier „canonic" = importul devine determinist

Motorul de import are un mapper determinist (`ruleBasedAutoMap`) care alimentează pipeline-ul AI. **Atenție la realitate**: AI-ul (generator + evaluator) rulează MEREU — nu există un mod „zero AI". DAR **dacă fișierul are anteturile EXACT ca numele câmpurilor țintă** (sau un alias recunoscut) + valori în enum-uri valide, mapper-ul determinist propune corect de la început, iar AI-ul doar **confirmă** (nu mai are de ghicit). Efectul practic: **maparea iese corectă din prima și întrebările de clarificare scad mult** (de regulă 0–2 minore, nu zero garantat), iar greșelile de mapare aproape dispar. Asta e cea mai inteligentă cale: **TU (Claude) construiești fișierul perfect**, motorul îl importă rapid și sigur.

Două moduri de a obține fișierul canonic:
1. **Rescrii fișierul userului** într-unul canonic (redenumești coloane, normalizezi valori, separi compozitele) — și-l imporți pe acela.
2. **Construiești de la zero un fișier** din date adunate de tine (din mai multe surse — vezi `02d`).

În ambele, scrii un CSV/Excel cu anteturile de mai jos și-l imporți (prin pagină sau prin tool, după mod).

## Șabloanele canonice — anteturile EXACTE pe care le pui

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
1. ☐ Anteturile = numele canonice de mai sus (sau alias clar recunoscut).
2. ☐ `vatRate` ∈ {0,11,21}; `unit` ∈ lista validă; `productType` ∈ {raw_material, merchandise, finished_good, wip}.
3. ☐ Numere cu punct zecimal; fără „1.234,50" ambiguu.
4. ☐ `menuCategory` cu ` > ` la ierarhii.
5. ☐ O coloană = un sens (fără compozite gen „Bar Capsare" = gestiune+categorie — separă-le).
6. ☐ Numele produselor normalizate consecvent (alegi „Coca-Cola", nu și „Coca Cola").
7. ☐ Referințele (gestiuni, categorii, furnizori, tipuri) **există deja** în aplicație — vezi pre-crearea de mai jos.

Dacă toate bifate → maparea iese corectă din prima și întrebările scad mult (de regulă 0–2 minore, **nu zero garantat**). Ce reduce cel mai mult întrebările e **pre-crearea referințelor** (mai jos) — fără ea, importul cere mai multe clarificări (dar nu-s probleme, le rezolvi pe loc).

## Pre-creează referințele prin MCP ÎNAINTE de import (ca să se lege curat)

Importul leagă produsele de gestiuni/categorii/furnizori **după nume**. Dacă acele referințe nu există, le nimerește pe ghicite (sau le ratează). Deci **creează-le tu întâi prin conexiune**, cu numele EXACT pe care-l pui în fișier:

| Referință | Tool MCP | Când |
|---|---|---|
| Gestiuni | `create_warehouse({ name, locationId })` | dacă fișierul are >1 gestiune sau niciuna; la multi-locație dă `locationId` |
| Categorii meniu | `create_menu_category({ name, brandId, parentId? })` | pentru fiecare secție din fișier (idempotent pe nume+brand) |
| Tipuri de produs | `create_product_type({ brandId, code, name, ... })` | doar dacă fișierul folosește tipuri custom (de regulă cele standard există) |
| Furnizori | `create_supplier({ name*, brandId*, cui?, ... })` | dacă imporți produse cu coloană furnizor (⚠ `brandId` e OBLIGATORIU) |
| Cote TVA | `create_vat_rate({ name, rate })` | doar dacă lipsește 0/11/21 (`list_vat_rates` întâi) |
| Sub-zone | `bulk_create_storage_zones({ brandId, storageZones })` | DOAR dacă userul cere sub-zone explicit |
| Taguri | `create_tag({ name, brandId })` | refolosește tagurile EXISTENTE; `entityTypes` are deja default `["product"]` (nu-l seta); tag nou ⇒ regulă de rutare din aplicație |

Verifică întâi ce există (`list_warehouses_full`, `list_menu_categories(brandId)`, `list_product_types(brandId)`, `list_suppliers`, `list_vat_rates`) ca să NU dublezi. Apoi pune în fișier numele EXACT al referințelor pre-create.

**Module de bifat pe token pentru pre-creare**: `produse_meniu` (gestiuni, categorii de meniu, cote TVA, sub-zone, taguri), `financiar` (tipuri de produs), `furnizori` (furnizori). Citirile (`list_*`, `search_products_db`) merg fără permisiune.

## Capcanele importului automat — și cum le previi (catalog din cod)

Astea sunt locurile unde importul „pe cont propriu" greșește. Tu le previi prin: fișier canonic + pre-creare refs + verificare. Vânează-le mereu.

**Gestiuni**
- *Tot într-o gestiune greșită* (fallback „Magazie"): pune coloana `warehouse` explicit pe fiecare rând; pre-creează gestiunile.
- *Nume fuzzy* („Bar" prinde „Bar Drunken"): folosește numele EXACT al gestiunii existente; nu te baza pe potrivire parțială.
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
- *Clarificare nerăspunsă consumată cu default*: la magazie + tip produs, răspunde TU (nu lăsa default-ul), că acolo dor cel mai tare.

## Verificarea post-import (prin MCP) — vezi „Faza E" din `02b-import-asistat.md`

După import, citește datele reale și corectează (tip/TVA/unitate/categorie = sigur; magazie = are efect contabil, cere aprobare). Folosește `search_products_db`/SQL, `list_*`, `get_config_status`. Explică userului fiecare corecție în limbaj de restaurant.
