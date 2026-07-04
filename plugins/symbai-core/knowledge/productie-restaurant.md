# Producție pentru restaurant & evenimente (flux simplu)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
>
> Acest fișier acoperă producția **simplă**, pentru restaurante și catering: faci semipreparate (baze, sosuri, ciorbe, aluaturi, deserturi) și loturi pentru evenimente, dintr-o rețetă, cu un singur pas de finalizare. Dacă ai o fabrică reală cu stații de lucru, comenzi de lucru pe tabletă, planificare MPS/MRP, control calitate cu carantină și trasabilitate avansată → vezi `productie-fabrica.md`. Restaurantul **nu are nevoie** de toate astea.

## Pe scurt
Producția simplă înseamnă: ai o **rețetă de semipreparat** (ce ingrediente intră, cât iese), creezi un **lot de producție** (planifici câte porții/șarje vrei), îl pornești când începi munca și îl **finalizezi** când e gata. La finalizare, sistemul face automat două lucruri: **scade ingredientele din stoc** (după regula „expiră primul") și **adaugă produsul finit pe stoc** ca lot nou, cu cost calculat. Atât — un singur buton de „Finalizează" și gata. Tot ce ține de restaurant se vede pe pagina **Producție** (`/productie-evenimente`).

## De ce ai nevoie de asta într-un restaurant
- **Semipreparate (baze de bucătărie)** — faci o oală mare de ciorbă, un sos de bază, un aluat, o cremă, și le folosești apoi la mai multe preparate din meniu. Producția le scade ingredientele o singură dată și îți pune semipreparatul pe stoc.
- **Batch prep (mise en place)** — pregătești dimineața o cantitate dintr-un produs pe care îl vinzi toată ziua; stocul de semipreparat scade pe măsură ce vinzi.
- **Evenimente & catering** — produci pentru o comandă (nuntă, eveniment corporate): un lot mare, cu ingredientele consumate corect și costul evenimentului calculat real.
- **Cost corect (food cost)** — fără producție, ingredientele unei oale de ciorbă „dispar" din stoc neuniform. Cu un lot de producție, consumul e exact și costul intră curat în costul mărfii vândute (COGS) din P&L.

## Ce-ți trebuie ca să meargă (modul de producție)
Producția se activează din **Setări → General**, în secțiunea „Domenii de Activitate". Modul de producție are 3 trepte:
- **Simplu** — loturi simple de semipreparate. Suficient pentru majoritatea restaurantelor.
- **Restaurant & evenimente** — în plus față de simplu, apare butonul „Adaugă Eveniment" și taburi extra (fluxuri, echipamente).
- **Fabrică** — deblochează tot (stații, MPS, QC, B2B). **Nu îți trebuie** pentru un restaurant — ascunde chiar pagina simplă de producție.

Pentru fluxul din acest fișier ai nevoie de modul **simplu** sau **restaurant & evenimente**. Dacă selectezi un domeniu de tip „Sală evenimente" treci automat pe „restaurant & evenimente"; dacă selectezi „Fabrică alimentară/nealimentară" treci pe „fabrică" (și atunci pagina `/productie-evenimente` dispare — folosești paginile de fabrică în loc).

> Capcană: dacă „Domenii de Activitate" e blocat sau ascuns de administratorul Hub, modul nu se poate schimba din POS. Atunci se gestionează din portalul Hub.

## Pagina de producție: `/productie-evenimente`
Aceasta e pagina ta principală. Titlul ei se adaptează modului: „Producție" (simplu), „Producție & evenimente" (restaurant & evenimente). Are taburile:
- **Calendar & Capacitate** — vezi producția programată pe zile; pui mâna pe un lot ca să-i vezi detaliile. Util ca să nu suprasoliciți bucătăria într-o zi.
- **Loturi Producție** — inima paginii: creezi, pornești și finalizezi loturile; vezi statusul fiecăruia (planificat / în lucru / finalizat) și ingredientele consumate.
- **Rețete** — gestionezi rețetele de semipreparate (nume, randament, tip de păstrare, valabilitate, ingrediente).

Butoane: **„Adaugă Lot Producție"** (peste tot) și **„Adaugă Eveniment"** (de la modul restaurant & evenimente în sus).

## Concepte (limbaj de restaurant)
- **Rețetă de semipreparat** — „fișa" produsului: ce ingrediente intră și cât iese (randamentul). Ex: „Ciorbă de burtă", randament 10 porții.
- **Lot de producție (șarjă)** — o rundă concretă de gătit dintr-o rețetă, cu o cantitate planificată. Ciclu de viață: **planificat → în lucru → finalizat** (sau anulat).
- **Randament (yield)** — cât scoate rețeta „o dată". Dacă planifici 5 (loturi) la o rețetă cu randament 10 porții, ies 50 de porții, iar ingredientele se înmulțesc ×5 automat.
- **Cantitate reală la ieșire** — cât a ieșit DE FAPT (poate fi mai puțin decât teoretic — ai pierderi la fierbere). Dacă o declari, ACEA cantitate intră pe stoc, iar costul/porție se împarte la ea.
- **Tip de păstrare** — `refrigerat` / `congelat` / `cald` / `ambient`. La `congelat`, lotul finalizat e marcat ca înghețat (vezi cât e congelat vs decongelat).
- **FEFO („expiră primul, iese primul")** — la finalizare, ingredientele se scad automat din loturile care expiră cel mai devreme. Nu trebuie să te ocupi de asta — sistemul alege singur.
- **Fișă de producție** — un checklist/instrucțiuni opționale pentru bucătar (pași, timpi), atașate rețetei.
- **Conversia de unități** — rețeta poate fi în grame/ml, produsul în kg/l: conversia (g↔kg, ml↔l) se face **automat** la calculul costului rețetei. ⚠ Dar dacă pui unitatea greșită (ex. „kg" în loc de „g"), iese un food cost absurd, fără avertisment — verifică unitățile când scrii rețeta.

## Bucla de lucru: citește → acțiune → verifică

### 1. Pregătirea: rețeta de semipreparat
**Citește mai întâi** ce ai deja:
- `list_recipes` (params: `status` = active|inactive|all, `brandId`, `limit`) — lista rețetelor de producție.
- `get_recipe_details` (params: `recipeId`) — randament, timp de preparare, tip păstrare, valabilitate, ingrediente, fișă de producție.
- `list_recipe_ingredients` (params: `recipeId`) — doar ingredientele, cu produs și unitate.

**Acțiune** dacă rețeta nu există sau nu e completă:
- `create_recipe` (params: `name`* , `productId`, `brandId`, `yield`, `prepTime`, `storageType` = refrigerat|congelat|cald|ambient, `shelfLife`, `shelfLifeFrozen`, `station`, `stages`, `labels`) — creezi rețeta de semipreparat.
- `add_recipe_ingredients` (params: `recipeId`*, `ingredients`* = listă de `{productId` sau `productName`, `quantity`*, `unit}`) — adaugi ingredientele (dacă nu știi `productId`, dă `productName` și sistemul caută produsul).
- `bulk_replace_recipe_ingredients` (params: `recipeId`*, `ingredients`*) — înlocuiești toată lista de ingrediente dintr-o dată.
- `remove_recipe_ingredient` (params: `ingredientId`) — scoți un ingredient.
- `update_recipe` (params: `recipeId`*, plus orice câmp: `yield`, `storageType`, `shelfLife`, `status`…) — ajustezi rețeta.

**Fișa de producție (opțional)** — checklist pentru bucătar:
- `get_production_sheet_config` (params: `recipeId`) — vezi configurația curentă.
- `set_production_sheet_config` (params: `recipeId`*, `config`) — setezi pașii/notițele pentru personal.

**Etichete (opțional)** — pentru imprimanta de etichete (valabilitate, alergeni):
- `get_recipe_labels` (params: `recipeId`) și `set_recipe_labels` (params: `recipeId`*, `labels`* = listă de `{name`, `copies`, `enabled}`).
- Pentru etichete FRUMOASE, desenate (cu cod de bare + câmpuri auto `{{lot}}`/`{{termenValabilitate}}`/`{{alergeni}}`), legate de rețetă și printate la lot (ZPL/PDF) → vezi `etichete-productie.md` + tool-ul `print_designed_label`.

### 2. (Opțional) Verifică ce materii prime îți trebuie
- `run_bom_explosion` (params: `recipeId`*, `quantity`*) — îți calculează lista totală de materii prime pentru cantitatea dată. E doar o **previzualizare** (NU mișcă stoc) — bună ca listă de cumpărături înainte de un eveniment mare.
- `get_stock_levels` (params: `productType` = raw_material|wip|finished_good|all, `warehouseId`, `onlyLowStock`, `productName`) — verifici că ai ingredientele pe stoc înainte să pornești.

### 3. Creezi și execuți lotul
**Acțiune — creezi lotul:**
- `exec_create_batch` (params: `recipeId`*, `plannedQty`*, `scheduledDate`, `assignedTo` = angajat, `zoneId`, `equipmentId`, `storageType`, `notes`, `batchNumber`, `destinationWarehouseId`) — creezi lotul. Pentru restaurant îți ajunge `recipeId` + `plannedQty` (+ eventual `scheduledDate` și `notes` de tip „Comandă hotel X").

**Acțiune — ciclul de viață** (poți face și totul din pagina `/productie-evenimente` cu butoanele „Începe acum" / „Finalizează"):
- `exec_start_batch` (params: `batchId`) — pornești producția (status → început, marchează ora de start).
- `exec_stop_batch` (params: `batchId`, `reason`) — pauză (status → pauză).
- `exec_resume_batch` (params: `batchId`) — reiei din pauză.
- `exec_complete_batch` (params: `batchId`*, `actualQty`, `actualOutputQty`, `storageType`) — **finalizează lotul ȘI postează inventarul**: consumă ingredientele (loturi alocate explicit + FEFO) și creează lotul de produs finit cu cost + genealogie. `actualQty` = cantitatea/turele reale; `actualOutputQty` = randamentul REAL (kg/buc produs finit) → costul se împarte la el (cost corect, nu pe nr. de ture). Vezi „Ce se întâmplă la finalizare" mai jos.
- `exec_reschedule_batch` (params: `batchId`*, `newDate`*, `reason`) — muți lotul pe altă zi.
- `exec_update_batch` (params: `batchId`*, plus `status`, `plannedQty`, `actualQty`, `notes`, `assignedTo`, `scheduledDate`…) — ajustezi orice câmp al lotului.

**Ce se întâmplă la finalizare** (prin `exec_complete_batch` sau butonul „Finalizează" din pagină — ambele consumă ingredientele și creează produsul finit):
1. Cantitatea reală se înregistrează (dacă o declari, ACEA cantitate; altfel cea planificată).
2. Ingredientele se scad din stoc conform rețetei, scalate cu cantitatea produsă și luând în calcul unitățile rețetei vs. stocului.
3. Scăderea merge automat după FEFO (loturile care expiră primul) — sau din lotul alocat explicit, dacă a fost scanat unul.
4. Produsul finit intră pe stoc ca lot nou, cu cost/porție = cost total ingrediente / cantitate ieșită.
5. Dacă tipul de păstrare e `congelat`, lotul finalizat e marcat ca înghețat.

> 💡 Tot fluxul de restaurant merge prin conexiune: `exec_complete_batch` face consumul + lotul de produs finit dintr-un singur apel. Dacă lotul are un flux tehnologic atașat (`flowVersionId`), finalizarea simplă e blocată — atunci se folosește calea shop-floor (vezi `productie-fabrica.md`). Pentru un restaurant simplu, NU atașa flux.

### 4. Verifici rezultatul
- `exec_get_batch_progress` (params: `batchId`*) — statusul lotului: pași, cantități, % completare, ingrediente consumate, output.
- `exec_list_batches` (params: `status`, `dateFrom`, `dateTo`, `recipeId`, `zoneId`, `limit`) — lista loturilor cu filtre (ex. toate cele finalizate în ultima săptămână).
- `get_semipreparate_stock` (fără params) — stocul de semipreparate finalizate (refrigerate/congelate): nume, cantitate, congelat/decongelat, când a fost gata. Așa confirmi că semipreparatul a intrat pe stoc.
- `get_stock_levels` — confirmi că ingredientele au scăzut corect.

### 5. Folosești semipreparatul în meniu
Semipreparatul finalizat e acum un produs pe stoc. Îl legi de un produs/preparat din meniu (din modulul Produse & Meniuri) ca să-l vinzi sau ca să-l folosești ca ingredient într-o altă rețetă.

## „Ce-ți cere userul → ce faci" (cheatsheet restaurant)

| Userul spune… | Ce faci |
|---|---|
| „Vreau să fac o rețetă de ciorbă / sos / aluat" | `create_recipe` (nume, randament, tip păstrare, valabilitate) → `add_recipe_ingredients` (ingredientele cu cantitate + unitate). |
| „Adaugă/scoate un ingredient din rețeta X" | `get_recipe_details` (vezi ce e acum) → `add_recipe_ingredients` sau `remove_recipe_ingredient`. |
| „Schimbă tot ce intră în rețeta X" | `bulk_replace_recipe_ingredients`. |
| „Câte kg de carne/cartofi îmi trebuie pentru 200 de porții?" | `run_bom_explosion` (recipeId, quantity) — listă materii prime, fără să miști stoc. |
| „Pune în producție 5 oale de ciorbă pentru mâine" | `exec_create_batch` (recipeId, plannedQty=5, scheduledDate). |
| „Am început să gătesc lotul" | `exec_start_batch` (batchId). |
| „Gata, am terminat lotul" | `exec_complete_batch` (batchId) → consumă ingredientele + intră semipreparatul pe stoc. Dă `actualOutputQty` pentru randamentul real (cost corect). |
| „Au ieșit doar 45 de porții, nu 50" | `exec_complete_batch` cu `actualOutputQty=45` — randamentul real intră pe stoc și costul se împarte la 45. |
| „Pune lotul pe pauză / reia-l" | `exec_stop_batch` (cu reason) / `exec_resume_batch`. |
| „Mută producția de mâine pe joi" | `exec_reschedule_batch` (batchId, newDate, reason). |
| „Ce semipreparate am pe stoc acum?" | `get_semipreparate_stock`. |
| „Ce loturi am produs săptămâna asta?" | `exec_list_batches` (status=completed, dateFrom, dateTo). |
| „Cum stă lotul X?" | `exec_get_batch_progress` (batchId). |
| „Vreau un checklist de bucătărie pentru rețetă" | `set_production_sheet_config` (recipeId, config). |
| „Producția pe la mine în restaurant — de unde o pornesc?" | `gaseste_in_aplicatie("producție")` → pagina `/productie-evenimente`. |
| „Nu văd nicăieri producția în meniu" | Verifică modul de producție în Setări → General (trebuie simplu / restaurant & evenimente); în mod fabrică pagina e ascunsă. |
| „Îmi lipsesc ingrediente pentru ce am de produs — comandă-le" | `create_purchase_orders_from_requirements(commit:false, mode:"loose")` — îți arăt o previzualizare (ce lipsește, de la ce furnizor, cât), confirmi, apoi `commit:true` creează comenzi-ciornă către furnizori (alege automat furnizorul potrivit per material). Trimiterea rămâne din aplicație. |
| „Povestește-mi ziua de producție / cum a mers azi" | `explain_production_day` — rezumat pe înțelesul tău: ce s-a produs, cât, ce trebuie atenție. |

## Permisiuni MCP
- **Citire** (rapoarte/liste) — nu cer modul de scriere: `list_recipes`, `get_recipe_details`, `list_recipe_ingredients`, `get_recipe_labels`, `get_production_sheet_config`, `run_bom_explosion`, `get_semipreparate_stock`, `get_stock_levels`, `exec_list_batches`, `exec_get_batch_progress`.
- **Scriere lot / execuție** — cer modulul `productie` pe token: `exec_create_batch`, `exec_update_batch`, `exec_start_batch`, `exec_stop_batch`, `exec_resume_batch`, `exec_complete_batch`, `exec_reschedule_batch`.
- **Scriere rețete** — cer modulul `retete` pe token: `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `bulk_replace_recipe_ingredients`, `remove_recipe_ingredient`, `set_recipe_labels`, `set_production_sheet_config`.

## Întrebări frecvente și capcane
- **De ce nu văd pagina „Producție"?** → Modul greșit. În Setări → General trebuie modul „simplu" sau „restaurant & evenimente". În modul „fabrică" pagina simplă e ascunsă intenționat (acolo lucrezi pe paginile de fabrică).
- **Costul producției apare în rapoarte?** → Da — costul real al semipreparatelor intră în costul mărfii vândute (COGS) din P&L.
- **Rețeta e în grame, produsul în kilograme — se încurcă?** → Nu — conversia (g/kg, ml/l) se face automat la calculul costului rețetei. Dar pune unitatea CORECTĂ în rețetă: unitate greșită = food cost absurd, fără avertisment.
- **Am planificat 5, dar a ieșit altă cantitate. Ce intră pe stoc?** → Dacă declari cantitatea reală la finalizare (`actualQty`), ACEA cantitate intră pe stoc, iar costul/porție se împarte la ea. Dacă nu, intră cantitatea teoretică (randament × loturi).
- **Pot anula un lot ca să-mi recuperez ingredientele?** → Nu — anularea/oprirea nu reface stocul deja consumat. Consumul se întâmplă la finalizare; ce nu ai finalizat încă nu a scăzut nimic.
- **De ce a scăzut alt lot de marfă decât mă așteptam?** → Consumul merge automat după FEFO (loturile care expiră primul). Pentru un restaurant simplu, asta e comportamentul corect și dorit.
- **Am nevoie de stații de lucru, scanare QR, planificare, control calitate.** → Acelea sunt funcții de **fabrică** — vezi `productie-fabrica.md`. Pentru un restaurant clasic nu sunt necesare și complică inutil.
