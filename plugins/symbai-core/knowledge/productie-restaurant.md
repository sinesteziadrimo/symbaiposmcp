# Producție pentru restaurant & evenimente (flux simplu)

Randamentul rețetei poate fi afișat împreună cu unitatea, de exemplu `17 porții`. Acest format nu este o eroare și nu înseamnă că lipsește randamentul cantitativ. O rețetă simplă poate avea un singur produs rezultat legat direct, fără o listă separată de produse la ieșire. Gramajul aproximativ din descriere rămâne o declarație, nu o măsurătoare fizică; lipsa loturilor înregistrate sau soldul negativ nu autorizează inventarea producțiilor.

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
>
> Acest fișier acoperă producția **simplă**, pentru restaurante și catering: faci semipreparate (baze, sosuri, ciorbe, aluaturi, deserturi) și loturi pentru evenimente, dintr-o rețetă, cu un singur pas de finalizare. Dacă ai o fabrică reală cu stații de lucru, comenzi de lucru pe tabletă, planificare MPS/MRP, control calitate cu carantină și trasabilitate avansată → vezi `productie-fabrica.md`. Restaurantul **nu are nevoie** de toate astea.

## Pe scurt
Producția simplă înseamnă: ai o **rețetă de producție** (ce ingrediente intră, cât iese), creezi un **lot de producție** (planifici cantitatea în kg, bucăți sau porții, în unitatea randamentului), îl pornești când începi munca și îl **finalizezi** când e gata. La finalizare, sistemul **scade ingredientele din stoc** (loturile alocate explicit, apoi automat FIFO — intrările cele mai vechi) și **adaugă produsul rezultat pe stoc** ca lot nou, cu cost calculat. Tot ce ține de restaurant se vede pe pagina **Producție** (`/productie-evenimente`).

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
- **Rețete** — gestionezi rețetele: segmentele **Semipreparate**, **Produse finite**, **Transformări** (materii prime obținute intern) și Evenimente. La **Rețetă nouă** alegi întâi **ce produs rezultă**: un **produs nou** cu tipul lui (dropdown-ul arată doar tipurile cu stoc care se pot produce: semipreparat, produs finit, **materii prime** …) sau un **produs existent** din catalog (de ex. „Pulpe dezosate", ca stocul să intre exact pe produsul folosit deja în alte rețete).

Butoane: **„Producție nouă"** (peste tot), **„Transformare rapidă"** (restaurant, nu fabrică) și **„Adaugă Eveniment"** (de la modul restaurant & evenimente în sus).

## Concepte (limbaj de restaurant)
- **Rețetă de semipreparat** — „fișa" produsului: ce ingrediente intră și cât iese (randamentul). Ex: „Ciorbă de burtă", randament 10 porții.
- **Lot de producție (șarjă)** — o rundă concretă de gătit dintr-o rețetă, cu o cantitate planificată. Ciclu de viață: **planificat → în lucru → finalizat** (sau anulat).
- **Randament (yield)** — cât scoate o formulă completă. Pentru o rețetă cu randament 10 porții, `plannedQty=50` planifică 50 de porții și ingredientele se înmulțesc ×5. `plannedQty=5` înseamnă 5 porții, nu 5 ture sau oale.
- **Cantitate reală la ieșire** — cât a ieșit DE FAPT (poate fi mai puțin decât teoretic — ai pierderi la fierbere). Dacă o declari, ACEA cantitate intră pe stoc, iar costul/porție se împarte la ea.
- **Tip de păstrare** — `refrigerat` / `congelat` / `cald` / `ambient`. La `congelat`, lotul finalizat e marcat ca înghețat (vezi cât e congelat vs decongelat).
- **FIFO („primul intrat, primul ieșit")** — în producția simplă de restaurant, după loturile alocate explicit, ingredientele se scad automat din intrările cele mai vechi. Regulile FEFO ale execuției industriale sunt un traseu separat.
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

Estimarea de cost nu este verificare de disponibilitate: `usesEstimatedFallback:false` arată sursa prețului, nu că există suficient stoc pentru producția cerută. Compară separat necesarul fiecărui ingredient cu stocul disponibil din gestiunea efectivă. Lipsa unui flux tehnologic nu înseamnă că producția simplă este stricată; manopera și utilajul pot lipsi din estimare chiar dacă materialele sunt calculate.

Randamentul și procentele din rețetă sunt valori declarate. Nu demonstra o eroare folosind deșeu presupus, însumând kg cu litri sau tratând lipsa loturilor salvate ca dovadă că preparatul nu s-a făcut niciodată. Pentru schimbare folosește cantitățile măsurate ori formula confirmată; un calcul condiționat rămâne estimare.

### 3. Creezi și execuți lotul
**Acțiune — creezi lotul:**
- `exec_create_batch` (params: `recipeId`*, `plannedQty`*, `warehouseId` sau `destinationWarehouseId`, `brandId`, `scheduledDate`, `assignedTo` = angajat, `zoneId`, `equipmentId`, `storageType`, `notes`, `batchNumber`) — creezi lotul în gestiunea verificată. `plannedQty` este cantitatea în unitatea randamentului rețetei, nu numărul de ture. La o rețetă comună, indică brandul operațiunii dacă gestiunea nu îl stabilește univoc.

**Acțiune — ciclul de viață** (poți face și totul din pagina `/productie-evenimente` cu butoanele „Începe acum" / „Finalizează"):
- `exec_start_batch` (params: `batchId`) — pornești producția (status → început, marchează ora de start).
- `exec_stop_batch` (params: `batchId`, `reason`) — pauză (status → pauză).
- `exec_resume_batch` (params: `batchId`) — reiei din pauză.
- `exec_complete_batch` (params: `batchId`*, `actualQty`, `actualOutputQty`, `storageType`) — **finalizează lotul ȘI postează inventarul**: consumă ingredientele (loturi alocate explicit, apoi FIFO) și creează lotul rezultat cu cost + genealogie. `actualQty` stabilește cantitatea de rețetă pentru care s-au folosit ingredientele; `actualOutputQty` declară separat cât produs s-a obținut efectiv. Ambele sunt cantități, nu număr de ture. Nu micșora consumul doar fiindcă randamentul real a fost mai mic.
- `exec_reschedule_batch` (params: `batchId`*, `newDate`*, `reason`) — muți lotul pe altă zi.
- `exec_update_batch` (params: `batchId`*, plus `status`, `plannedQty`, `actualQty`, `notes`, `assignedTo`, `scheduledDate`…) — ajustezi orice câmp al lotului.

**Ce se întâmplă la finalizare** (prin `exec_complete_batch` sau butonul „Finalizează" din pagină — ambele consumă ingredientele și creează produsul finit):
1. Cantitatea pentru calculul ingredientelor este `actualQty`; dacă lipsește, se folosește cea salvată pe lot, altfel cea planificată.
2. Ingredientele se scad conform rețetei, proporțional cu această cantitate raportată la randamentul rețetei, cu conversiile de unități necesare.
3. Scăderea folosește întâi loturile alocate explicit, apoi intrările cele mai vechi (FIFO).
4. `actualOutputQty` stabilește separat cantitatea efectiv intrată pe stoc. Costul unitar este cost total ingrediente / cantitate efectiv ieșită.
5. Dacă tipul de păstrare e `congelat`, lotul finalizat e marcat ca înghețat.

> 💡 Tot fluxul de restaurant merge prin conexiune: `exec_complete_batch` face consumul + lotul de produs finit dintr-un singur apel. Dacă lotul are un flux tehnologic atașat (`flowVersionId`), finalizarea simplă e blocată — atunci se folosește calea shop-floor (vezi `productie-fabrica.md`). Pentru un restaurant simplu, NU atașa flux.

**Exemplu de pierdere de randament:** rețeta consumă 4,8 kg pentru 2,7 kg rezultat. S-au folosit toate cele 4,8 kg, dar au ieșit 2,55 kg. Finalizezi cu `actualQty=2.7` și `actualOutputQty=2.55`. Dacă ai reduce și `actualQty` la 2,55, ai reduce greșit ingredientele la 4,533333 kg.

**Transformare între materii prime:** o rețetă de producție explicită poate transforma, de exemplu, carne cu os în carne dezosată, păstrând ambele produse ca materii prime. Verifică exact produsele de intrare și ieșire, rețeta și gestiunea. Nu uni produsele și nu schimba tipul produsului pentru a forța operațiunea. După finalizare verifică ambele mișcări, costul și genealogia; existența rețetei sau starea „finalizat” singură nu dovedește înregistrarea stocului.

### 4. Verifici rezultatul
- `exec_get_batch_progress` (params: `batchId`*) — statusul lotului: pași, cantități, % completare, ingrediente consumate, output.
- `exec_list_batches` (params: `status`, `dateFrom`, `dateTo`, `recipeId`, `zoneId`, `limit`) — lista loturilor cu filtre (ex. toate cele finalizate în ultima săptămână).
- `get_semipreparate_stock` (fără params) — stocul de semipreparate finalizate (refrigerate/congelate): nume, cantitate, congelat/decongelat, când a fost gata. Așa confirmi că semipreparatul a intrat pe stoc.
- `get_stock_levels` — confirmi că ingredientele au scăzut corect.

### 5. Folosești semipreparatul în meniu
Semipreparatul finalizat e acum un produs pe stoc. Îl legi de un produs/preparat din meniu (din modulul Produse & Meniuri) ca să-l vinzi sau ca să-l folosești ca ingredient într-o altă rețetă.

## Transformare rapidă (materie primă obținută intern)

Butonul **„Transformare rapidă"** e în Producție (`/productie-evenimente`) și în **Bucătăria Azi** (`/bucatarie`, secțiunea „De pregătit azi"). Când o materie primă se face în bucătărie din alta — **pulpe dezosate din pulpe cu os**, **zeamă de lămâie din lămâi**, carne tocată din pulpă — se înregistrează ca **transformare rapidă**: un lot creat, pornit și finalizat dintr-o singură mișcare. Consumă ce s-a folosit, pune pe stoc ce s-a obținut, costul trece prin FIFO (7 kg × 12,50 lei ÷ 5 kg = 17,50 lei/kg). Așa produsul obținut nu mai intră pe minus când vânzările îl consumă din rețete, iar materia primă folosită scade corect.

- **Prima dată** între două produse spui cât ai folosit și cât ai obținut; proporția se salvează ca **rețetă de transformare** a produsului obținut (segmentul „Transformări").
- **Data viitoare** ajunge cantitatea obținută; consumul se calculează după rețetă. Dacă spui și cât ai folosit (materia primă principală), consumul se ia exact de acolo, iar diferența devine randamentul real.
- Produsul obținut poate fi unul **existent** (recomandat când e deja ingredient în rețete) sau unul **nou**, creat cu tipul ales (`raw_material` pentru materie primă).
- Gestiunea aleasă primește produsul obținut; ingredientele se scad după rutarea lor normală, ca la orice lot de restaurant. Fabricile lucrează pe flux tehnologic, nu cu transformarea rapidă.
- Nu confunda cu **înlocuirea temporară** (preparatul a folosit alt ingredient în locul celui din rețetă) — vezi `inlocuiri-temporare-ingrediente.md`.

**MCP**: `preview_quick_transformation` (citire, nu scrie nimic) → `quick_transform_product` (modulul `productie`). Argumente: `outputProductId` sau `outputProductName` sau `newOutputProduct {name, productType, unit}`, `outputQty`, `inputs[] {productId|productName, qty}` (obligatoriu la prima transformare), `warehouseId` (sau `locationId` ca să se propună gestiunea), opțional `productionDate`, `notes`, `idempotencyKey` (aceeași cheie nu dublează la reluare). Rețeta de transformare se poate crea și separat cu `create_recipe` + `outputProductType:"raw_material"` (sau `productId` al materiei prime existente).

**Reguli transformări**: implicit orice produs în orice produs; un manager poate permite doar anumite perechi „din X → în Y" (Rețete → Transformări → „Reguli transformări"; MCP `get_quick_transformation_rules` / `configure_quick_transformation_rules`). Cu lista activă, restul transformărilor se refuză (`TRANSFORMATION_NOT_ALLOWED`), în aplicație și prin conexiune.

**Etichete și fișă**: ca la orice lot — la finalizare se scrie fișa de producție și se tipăresc etichetele configurate pe rețeta de transformare; în fereastra din aplicație se aleg etichetele, imprimanta, copiile și fișa pe hârtie.

**În Mișcări stoc** (`/stock-movements`): o producție are două documente, **„Consum în producție”** (ce s-a scăzut) și **„Intrare din producție”** (ce a intrat pe stoc). La o transformare rapidă apar ca **„Transformare · consum”** și **„Transformare · intrare”**, iar sub fiecare rând scrie „Transformare rapidă TR-…: Pulpe cu os → Pulpe dezosate” (la o producție: „Producție lot …: …”). Operatorul afișat e omul care a făcut transformarea (responsabilul lotului), nu un utilizator tehnic. Documentele mai vechi pot avea în note formularea „Ieșire producție”; e aceeași intrare pe stoc.

**Ce poate refuza**: materie primă care nu e în rețeta existentă (se modifică rețeta, nu se face produs dublat); gestiune de fabrică; prima transformare fără dreptul de rețete (o face un manager); tip de produs fără stoc. Dacă materia primă folosită nu avea stoc/lot, lotul obținut poate rămâne blocat la control până se completează proveniența — verifică recepția materiei prime.

## „Ce-ți cere userul → ce faci" (cheatsheet restaurant)

| Userul spune… | Ce faci |
|---|---|
| „Vreau să fac o rețetă de ciorbă / sos / aluat" | `create_recipe` (nume, randament, tip păstrare, valabilitate) → `add_recipe_ingredients` (ingredientele cu cantitate + unitate). |
| „Adaugă/scoate un ingredient din rețeta X" | `get_recipe_details` (vezi ce e acum) → `add_recipe_ingredients` sau `remove_recipe_ingredient`. |
| „Schimbă tot ce intră în rețeta X" | `bulk_replace_recipe_ingredients`. |
| „Câte kg de carne/cartofi îmi trebuie pentru 200 de porții?" | `run_bom_explosion` (recipeId, quantity) — listă materii prime, fără să miști stoc. |
| „Pune în producție 5 oale de ciorbă pentru mâine" | Citește randamentul și află câte kg/l/porții înseamnă o oală. Dacă oala are 10 porții, `exec_create_batch` cu `plannedQty=50`, rețeta, gestiunea și data. Nu presupune mărimea oalei. |
| „Am început să gătesc lotul" | `exec_start_batch` (batchId). |
| „Gata, am terminat lotul" | `exec_complete_batch` (batchId) → consumă ingredientele + intră semipreparatul pe stoc. Dă `actualOutputQty` pentru randamentul real (cost corect). |
| „Au ieșit doar 45 de porții, nu 50" | Dacă s-au folosit ingredientele pentru 50, `exec_complete_batch` cu `actualQty=50`, `actualOutputQty=45` — consum pentru 50, intrare de 45, cost împărțit la 45. |
| „Pune lotul pe pauză / reia-l" | `exec_stop_batch` (cu reason) / `exec_resume_batch`. |
| „Mută producția de mâine pe joi" | `exec_reschedule_batch` (batchId, newDate, reason). |
| „Transformă-mi 5 kg pulpe cu os în pulpe dezosate" / „am stors lămâi, au ieșit 0,8 l zeamă" | `quick_transform_product` (produsul obținut + cantitatea obținută + ce s-a folosit + gestiunea). Nesigur → `preview_quick_transformation` întâi. |
| „Pulpele dezosate sunt pe minus, dar le-am dezosat noi" | Înregistrează transformările făcute (`quick_transform_product`, cu `productionDate` pentru zilele trecute); nu corecta stocul prin ajustare. |
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
- **Scriere lot / execuție** — cer modulul `productie` pe token: `exec_create_batch`, `exec_update_batch`, `exec_start_batch`, `exec_stop_batch`, `exec_resume_batch`, `exec_complete_batch`, `exec_reschedule_batch`, `quick_transform_product` (previzualizarea `preview_quick_transformation` e citire).
- **Scriere rețete** — cer modulul `retete` pe token: `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `bulk_replace_recipe_ingredients`, `remove_recipe_ingredient`, `set_recipe_labels`, `set_production_sheet_config`.

## Întrebări frecvente și capcane
- **De ce nu văd pagina „Producție"?** → Modul greșit. În Setări → General trebuie modul „simplu" sau „restaurant & evenimente". În modul „fabrică" pagina simplă e ascunsă intenționat (acolo lucrezi pe paginile de fabrică).
- **Costul producției apare în rapoarte?** → Da — costul real al semipreparatelor intră în costul mărfii vândute (COGS) din P&L.
- **Rețeta e în grame, produsul în kilograme — se încurcă?** → Nu — conversia (g/kg, ml/l) se face automat la calculul costului rețetei. Dar pune unitatea CORECTĂ în rețetă: unitate greșită = food cost absurd, fără avertisment.
- **Am planificat 5, dar a ieșit altă cantitate. Ce intră pe stoc?** → `plannedQty=5` reprezintă 5 unități de randament, nu 5 ture. Declară cantitatea efectiv obținută în `actualOutputQty`. Păstrează în `actualQty` cantitatea de rețetă pentru care ai folosit ingredientele; o pierdere de randament nu trebuie să reducă ingredientele deja consumate.
- **Am înregistrat greșit un lot finalizat. Îl pot storna?** → Da, prin fluxul canonic: `preview_production_cleanup` pe `batchIds` explicite, apoi `delete_production_period` pe aceeași selecție autorizată, cu `confirm:true` și `acknowledgeAccountingImpact:true`. Pentru un singur lot folosește `maxBatches:1`, fără cascadă; verifică întâi documentele, gestiunea, perioada și dependențele din previzualizare. Verifică prin citire lotul și mișcările după execuție, inclusiv după un timeout, înainte de orice repetare. Nu confunda stornarea evidenței greșite cu recuperarea fizică a ingredientelor unei producții reale; pentru neconformități folosește fluxul de calitate/retușare. `exec_cancel_batch` nu înlocuiește stornarea unui lot deja postat.
- **De ce a scăzut alt lot de marfă decât mă așteptam?** → Verifică loturile alocate explicit și ordinea intrărilor. Producția simplă de restaurant alege automat FIFO pentru restul necesarului. Nu atribui alegerea datei expirării fără să verifici traseul folosit.
- **Am nevoie de stații de lucru, scanare QR, planificare, control calitate.** → Acelea sunt funcții de **fabrică** — vezi `productie-fabrica.md`. Pentru un restaurant clasic nu sunt necesare și complică inutil.
