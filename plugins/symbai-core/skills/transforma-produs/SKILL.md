---
name: transforma-produs
description: Transformare rapidă (producție rapidă) dintr-un produs în altul — consumă ce s-a folosit, pune pe stoc ce s-a obținut, cu cost FIFO și lot trasabil. La „transformă-mi din X în Y", „am dezosat 5 kg pulpe", „am stors lămâi", „am făcut zeamă din lămâi", „s-a terminat X și l-am făcut din Y", „fă o producție rapidă", „pulpele dezosate sunt pe minus deși le-am dezosat noi". Produsul obținut poate fi o materie primă folosită în rețete.
---

# Transformare rapidă — „din X am făcut Y"

Ești asistentul Symbai al clientului. Vorbește simplu, în română. Situația tipică: restaurantul cumpără **pulpe dezosate** (materie primă în rețete); când se termină, bucătarii dezosează **pulpe cu os** și folosesc rezultatul. Dacă nu se înregistrează, vânzările scad pulpele dezosate pe minus, iar pulpele cu os rămân pe stoc deși au fost folosite. La fel: zeamă de lămâie din lămâi, piure din cartofi curățați, carne tocată din pulpă.

Transformarea rapidă înregistrează exact ce s-a întâmplat, într-un singur pas: **consumă** ce a intrat, **pune pe stoc** ce a ieșit, iar **costul** trece prin FIFO de la intrare la ieșire (de ex. 7 kg × 12,50 lei ÷ 5 kg obținute = 17,50 lei/kg). În spate e un lot de producție obișnuit, deci apare în Producție → Loturi, în trasabilitate și în contabilitate ca orice producție.

## Transformare sau înlocuire?

- **Transformare** (acest skill): s-a obținut fizic un produs din altul — pulpe dezosate DIN pulpe cu os. Stocul produsului obținut crește.
- **Înlocuire temporară** → skill-ul `inlocuieste-ingredient-temporar`: preparatul a folosit ALT ingredient în locul celui din rețetă (sirop lipsă → lămâi), fără să se producă ceva nou.
- **Producție planificată cu etape, echipamente, etichete** → skill-ul `productie-flux` (lot normal). Fabricile (flux tehnologic, stații) nu folosesc transformarea rapidă.

## Pași

1. **Identifică produsele** cu `search_products_db`: produsul OBȚINUT (de ex. „Pulpe de pui dezosate") și ce s-a FOLOSIT („Pulpe de pui cu os"). Poți trimite și numele exact (`outputProductName`, `inputs[].productName`); la ambiguitate primești candidații — alege `productId`, nu ghici.
   - Produsul obținut **nu există** în catalog? Folosește `newOutputProduct: { name, productType, unit }`. Pentru o materie primă obținută intern tipul e `raw_material`; semipreparat `wip`; produs finit `finished_good` (`list_product_types` arată tipurile firmei; se acceptă doar tipuri cu stoc).
   - Materia primă folosită lipsește din catalog? Creeaz-o întâi (`create_product`, tip `raw_material`) — doar dacă omul confirmă că e un produs nou, nu o denumire diferită a unuia existent.
2. **Cantitățile, în unitatea de stoc a fiecărui produs**: cât s-a obținut (`outputQty`) și cât s-a folosit (`inputs[].qty`). Dacă omul nu știe cât a obținut, întreabă — nu inventa randamentul.
   - **Prima transformare** între două produse: `inputs` e obligatoriu; proporția se salvează ca **rețetă de transformare** a produsului obținut (Producție → Rețete → segmentul „Transformări").
   - **Următoarele**: ajung produsul și cantitatea obținută; restul se calculează după rețetă. Dacă omul spune și cât a folosit, trimite doar materia primă principală — consumul se ia exact de acolo, iar diferența devine randamentul real.
3. **Gestiunea** (bucătăria) în care se face transformarea și în care intră produsul obținut: `warehouseId`. Dacă nu o știi, dă `locationId` — se propune gestiunea în care e rutat produsul.
4. **Nesigur?** Rulează întâi `preview_quick_transformation` (nu scrie nimic) și arată-i omului: ce se scade, ce intră, cu ce rețetă, în ce gestiune, cu ce randament față de rețetă.
5. **Înregistrează** cu `quick_transform_product`. Trimite `idempotencyKey` stabil (de ex. id-ul mesajului): la o reluare după timeout aceeași cheie nu dublează transformarea. Pentru o zi trecută: `productionDate` (YYYY-MM-DD, nu în viitor).
6. **Confirmă omului pe scurt**: „Am înregistrat: 7 kg pulpe cu os → 5 kg pulpe dezosate în Bucătărie (lot TR-…)". Dacă răspunsul are avertismente (randament foarte diferit de rețetă), spune-le.

## Ce are voie bucătăria să transforme (Reguli transformări)

Implicit se poate transforma **orice produs în orice produs**. Un manager poate debifa asta în **Reguli transformări** (Producție → Rețete → Transformări, sau butonul „Reguli" din fereastra de transformare) și atunci se pot face **doar perechile din listă** („din Pulpe cu os → în Pulpe dezosate").
- Citește starea cu `get_quick_transformation_rules`.
- Schimbă cu `configure_quick_transformation_rules`: `restricted` true/false, `add` [{input, output} prin ID sau nume exact], `removeRuleIds`. Cere dreptul de administrare a producției; confirmă cu omul înainte să restrângi.
- Cu lista activă, `quick_transform_product` refuză cu `TRANSFORMATION_NOT_ALLOWED` și spune ce e permis — nu ocoli refuzul cu alt produs sau o ajustare de stoc; întreabă managerul.

## Etichete și fișă de producție

Transformarea e un lot ca oricare altul: la finalizare se scrie fișa de producție și se tipăresc etichetele configurate pe rețeta de transformare (Etichete & Print, Fișă de Producție), exact ca la o producție. În fereastra din aplicație omul le vede precompletate din rețetă, le poate bifa, schimba imprimanta și numărul de copii și poate trimite fișa pe o imprimantă. Prin conexiune se aplică configurarea rețetei; pentru o fișă pe hârtie la cerere folosește uneltele fișei de producție (`print_production_sheet`) pe lotul întors.

## Când refuză

- „Rețeta … nu folosește …" — produsul obținut are deja o rețetă de transformare din altă materie primă. Întreabă dacă s-a schimbat materia primă; rețeta se modifică în Producție → Rețete (nu crea un produs dublat).
- „… nu e permisă" / `TRANSFORMATION_NOT_ALLOWED` — firma permite doar anumite transformări; vezi `get_quick_transformation_rules` și spune omului ce e permis.
- „Gestiunea aparține unei fabrici" — în fabrică se lucrează pe flux tehnologic (`productie-flux`).
- „E prima transformare … rolul tău nu are dreptul să creeze rețete" — prima transformare între două produse o face un manager; apoi operatorii pot înregistra singuri.
- Materia primă folosită nu avea stoc: transformarea se înregistrează, dar lotul obținut poate rămâne blocat la control până se stabilește din ce lot a ieșit materia primă (trasabilitate). Spune-i omului să verifice recepția materiei prime.

## În aplicație

Omul o poate face și singur: **Producție** (`/productie-evenimente`) → butonul **„Transformare rapidă"**, din **Bucătăria Azi** (`/bucatarie`) → secțiunea „De pregătit azi" → **„Transformare rapidă"**, sau Rețete → segmentul **„Transformări"** → **„Transformă"** pe rețetă. Tot acolo, la **Rețetă nouă**, alege **ce produs rezultă**: un produs nou cu tipul lui (semipreparat, produs finit, **materii prime**) sau un **produs existent** din catalog (de ex. „Pulpe dezosate", ca stocul să intre exact pe produsul folosit în rețete). Linkul exact îl dă `gaseste_in_aplicatie`.

Detalii și exemple: [producție restaurant — transformări](../../knowledge/productie-restaurant.md#transformare-rapidă-materie-primă-obținută-intern).
