# Planificare pentru ChatGPT, Codex, Claude Code și asistenții personali

Folosește schema oferită de conexiunea firmei. Descoperă uneltele cu `cauta_tool`, citește-le cu `citeste_tool`, apoi execută prin mecanismul indicat. Acest ghid descrie capacitățile versiunii care le oferă: dacă o unealtă lipsește, nu pretinde că planul a fost salvat. Reutilizează acordul utilizatorului pentru acțiunea cerută, fără o a doua confirmare inutilă.

## Alege traseul după intenție

| Cererea omului | Unelte și verificare |
|---|---|
| Planifică o comandă B2B | `plan_b2b_order` → `apply_b2b_order_plan`; păstrează comanda și fabrica exactă. |
| Planifică ziua sau portofoliul fabricii | `preview_factory_plan` → `confirm_factory_plan`. |
| Produce cantitatea cerută dintr-o rețetă | `preview_factory_production(request.kind:recipe)` → `confirm_factory_production`. |
| Planifică semipreparatele comune | `get_factory_planning_context(view:consolidated_lots)`, apoi `preview_factory_production(request.kind:lots)` și confirmare. |
| Planifică tranșarea | Citește `disassembly_recipes` și `cutting_plan`, apoi `request.kind:cutting`; `cycles` este totalul dorit, inclusiv ce este deja programat. |
| Procesează surplusul | Citește balanța, alege rețeta reală și simulează `request.kind:surplus`, `decision:process`. |
| Împarte un reper spre mai multe rețete | `preview_factory_production(request.kind:allocation)` cu `allocations` de procesare și cantități de intrare; confirmă aceeași împărțire. |
| Mută o operație, schimbă utilajul sau durata | `get_factory_planning_context(view:batch_flow,batchId)`, `get_production_dispatch`, apoi `assign_production_operation`. |
| Împarte o operație pe mai multe utilaje/intervale | `split_production_operation`; totalul părților trebuie să fie cantitatea operației. |
| Pune operațiile una după alta | `sequence_production_operations`, cu ordinea explicită, utilajul și ora de început. |
| Reunește părțile aceleiași operații | `merge_production_operation_splits`; părțile trebuie să fie consecutive pe același utilaj, cu aceleași resurse. Intervalul complet este păstrat. |
| Mută întregul lot | `exec_reschedule_batch`; citește loturile mutate, cele păstrate și avertismentele. |
| Retrage o planificare | Citește `session`, apoi `undo_factory_plan(lineId)`; loturile începute apar în `kept` și nu sunt anulate. |
| Verifică legătura cu comenzile | `get_factory_planning_context(view:batch_links)` și `coverage`, apoi comanda B2B și `get_production_dispatch`. |

Fabrica este brand + locație. `warehouseId` se alege din `list_work_warehouses`; nu este punctul de livrare B2B. Noile unelte cer toate cele trei repere verificate și păstrează drepturile contului nominal. O conexiune de organizație nu poate pretinde identitatea unui angajat printr-un argument.

## Simplă și asistată

`planningOptions.mode` este `simple` implicit. Planul urmărește operațiile, duratele, dependențele, disponibilitatea utilajelor și termenul. `assisted` preferă intervalele cu personal disponibil și explică deficitul, cu recomandări de alt interval sau personal suplimentar.

Stocul lipsă, pontajele lipsă și personalul insuficient sunt avertismente pentru planificare. Nu opri totul și nu cere configurarea completă a fabricii. Nu crea stoc, recepții, prezențe ori ture fictive. Un utilaj inexistent sau ocupat, lipsa identității rețetei/fluxului și dependențele imposibile trebuie însă corectate. Cere numai informația care lipsește concret.

`startTime` și `endTime` stabilesc programul propus, în ore locale. Nu reprezintă pontaj sau repartizare de personal. `extraDays` permite căutarea unui loc după termen; raportează întârzierea și păstrează termenul contractual. Nu spune „livrare la termen” doar fiindcă planificarea a putut fi salvată.

„Planificare simplă în fabrică” nu este „modul Producție simplă/Restaurant”. Fabrica păstrează operațiile și trasabilitatea. Nu schimba modul firmei pentru a ocoli un blocaj de planificare.

## Date manuale și paginare

În propunere, `manualPlanning` sau secțiunea `operations` oferă `productId`, `operationId`, eventual `sourceRef`, durata și ora propusă. Secțiunea `equipment` oferă utilajele reale. Pune numai ajustările cerute în `planningOptions.operations`: `equipmentId`, `durationMinutes`, `startAt`. Păstrează identitățile, apoi recalculează.

`startAt` este data și ora **locală**, în forma `YYYY-MM-DDTHH:mm`, fără `Z`. Nu o converti în UTC înainte de trimitere. Durata este în minute, iar cantitatea în unitatea produsului/rețetei; 12,5 nu se rotunjește la 13. Pentru o operație manuală utilajul poate fi `null` dacă fluxul permite.

`get_factory_planning_context` începe cu `section:summary`, care arată `availableSections`. Citește secțiunile necesare până la `pagination.nextArguments:null`. Propunerile au secțiuni `orders`, `operations`, `equipment`, `warnings`; o pagină completă nu înseamnă că ai citit toate secțiunile. Păstrează `readRevision` din continuare; dacă datele se schimbă, reia lectura. Nu ascunde produsele omise ori blocajele din paginile următoare.

Intervalele propuse se citesc separat în `section:schedule`. Pentru planuri mari, `nextArguments` poate conține `continuationToken`, valabil 15 minute pe același cont și unealtă. Copiază-l exact: reia automat argumentele originale, dar verifică din nou datele fabricii. Nu este token de confirmare. La expirare reia cererea originală. `omittedSummaryFields` numește metadatele prea mari pentru sumar; dacă apare `planningOptionsFromOriginalRequest`, păstrează opțiunile originale la confirmare.

## Confirmă aceeași propunere

Pentru zi, adună obiectele `confirmationOrder` din toate paginile secțiunii `orders`. Acestea sunt lista `orders` pentru recalculare și confirmare; numele și programarea alăturate sunt informații de prezentare. Trimite `orders`, `days`, `planningOptions`, `allowPartial`, `expectedPlanDigest` și `expectedStablePlanDigest` din aceeași simulare. Dacă ai editat cantități, date, împărțiri sau opțiuni, rulează din nou `preview_factory_plan(orders:...)` înainte de confirmare. Nu inventa `sourceRef` și nu elimina semipreparatele dependente.

Pentru rețetă/loturi/tranșare/surplus păstrează exact `request` și opțiunile din `preview_factory_production`. Rețeta se confirmă integral. Pentru o confirmare parțială permisă, `allowPartial:true` înseamnă o omisiune acceptată explicit, nu remedierea automată a unui refuz.

Pentru B2B păstrează `orderId`, fabrica, `dateFrom`, `selection`, `planningOptions` și `approvalToken`. Fără `selection`, sunt incluse toate produsele eligibile ale comenzii. `selection.qtyByProduct` singur selectează produsele din cheile sale; datele invalide sunt refuzate, nu extind selecția la toată comanda. Nu reintroduce liniile B2B ca producție manuală ca să scapi de verificare.

`plan_b2b_order` începe cu `section:summary`; numărul complet al detaliilor apare în `availableSections`. Citește separat `operations`, `equipment`, `schedule`, `materials` și `issues`, cu paginare. Primele exemple din sumar nu sunt lista completă. Folosește tokenul din propunerea verificată și aceleași opțiuni. Pentru operații deja împărțite, citește `batch_flow` cu `section:pins`: fiecare parte are `pinnedId`, `splitQty`, interval și `employeeIds` reale.

`orderMaterials` și `addShift` sunt false implicit. Achizițiile și turele se aplică numai când sunt cerute, cu dovada și drepturile lor. O lipsă de materie primă nu justifică activarea automată a acestor opțiuni. Dacă răspunsul unei ture cere reaprobarea, nu pretinde că s-au creat loturile; verifică noua propunere înainte să continui.

`schedule_production_orders` și `get_production_schedule_feasibility` sunt utile pentru simulări și scenarii; în fabrică `schedule_production_orders(commit:true)` nu este calea de confirmare. Nu îl înlocui cu loturi/MPS create separat. Folosește perechile dedicate de mai sus pentru salvarea completă și legătura cu cererea.

La aceste două simulări de nivel inferior, `dateTo` este limita exactă; extinde-o explicit pentru un scenariu mai târziu. `extraDays` extinde automat orizontul în perechile de planificare B2B și preview/confirm.

## Comenzi, forecast, aprovizionare și execuție

- Preluarea unei comenzi folosește [preia-comanda-client](../skills/preia-comanda-client/SKILL.md); comenzile comerciale, clienții și punctele urmează [gestioneaza-comenzi-b2b](../skills/gestioneaza-comenzi-b2b/SKILL.md). Confirmarea comercială este distinctă de programarea operațiilor.
- Forecastul se citește cu `get_factory_forecast_plan`. Cererea fermă este deja reconciliată; nu o adăuga din nou peste estimare. Politica de acceptare automată rămâne aplicabilă. O pornire manuală cerută explicit pe o rețetă nu cere activarea întregului profil de forecast.
- Materialele: `get_material_requirements`, apoi [comanda-furnizor](../skills/comanda-furnizor/SKILL.md). `create_purchase_orders_from_requirements(commit:false)` oferă propunerea de achiziție; aplicarea folosește `previewToken`. Nu genera a doua oară aceleași drafturi din alt traseu.
- Execuția reală: uneltele `exec_*` pentru pornire, oprire, consum, output și predare. Planificarea nu confirmă recepția, temperatura, cantitatea produsă ori QC. Folosește numai constatări reale ale operatorilor și regulile de execuție ale fabricii.
- Pickingul, avizele, livrarea și factura urmează [gestioneaza-comenzi-b2b](../skills/gestioneaza-comenzi-b2b/SKILL.md). Planul de producție salvat nu dovedește că marfa a fost livrată.

După scriere recitește confirmarea, loturile/operațiile și legătura cu comanda. La timeout sau `outcomeUnknown`, verifică înainte să repeți. Păstrează aceeași intenție și aceleași chei; nu schimba cantitatea sau numele pentru a forța o altă creare. Raportează separat: propus, salvat, executat și livrat.
