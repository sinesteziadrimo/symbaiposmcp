# Benchmark ERP manufacturing — cum gândește agentul pe producție

Scop: când agentul lucrează pe producție/fabrică, să gândească precum un consultant ERP/MES, nu ca un operator care apasă direct „creează lot”.

Surse de inspirație verificate în documentații oficiale:
- Odoo Manufacturing: BoM = componente + cantități + operații/work centers; MPS combină forecast, cerere confirmată, stoc și replenishment; Quality Checks pot fi pe manufacturing order sau work order.
- Microsoft Dynamics 365 Supply Chain Management: ciclul producției trece prin created → estimated → scheduled → released → prepared/picked → started → progress/jobs → reported as finished → quality assessment → put away/end; release-ul cere disponibilitate materiale și planificare resurse.

## Principii de lucru (inspirate din ERP-urile mari)

1. **Separă planificarea de execuție.** Folosește [planificarea simplă/asistată](planificare-asistenti.md), prin perechile de propunere și confirmare. Stocul și personalul lipsă sunt avertismente pentru planificare; readiness este diagnostic, fără să impună completarea întregii fabrici. După ce lotul există, înainte de `exec_start_operation`, verifică `get_batch_material_readiness` și condițiile reale de execuție. Programarea nu eliberează QC și nu dovedește staging-ul materialelor.
2. **Produs + BoM + flux + capacitate sunt un singur sistem.** Rețeta/BOM-ul și fluxul trebuie să indice prin ID același produs. Fiecare ingredient al BOM-ului se alocă exact la operația unde intră fizic, iar totalul consumat din stoc trebuie să rămână egal cu rețeta; WIP-ul transferat între operații nu se numără a doua oară. O rețetă cu ingrediente dar fără flux/capacitate nu e pregătită pentru fabrică; pentru fabrică trebuie să existe operații, echipamente, timpi standard și produsul final ca ieșire principală a ultimei operații.
3. **Disponibilitatea materialelor se verifică în fabrica aleasă.** Citește schema curentă a verificării și trimite gestiunea de planificare (`warehouseId`). Din stoc se scad rezervările și se verifică restricțiile loturilor: carantină, QC, expirare și trasabilitate. O diferență între stoc și loturi cere citirea documentelor de reconciliere; nu aduna stocul altor fabrici pentru a acoperi deficitul. La BoM multi-level, netează întâi stocul existent de semipreparate/WIP și explodează sub-rețeta doar pentru cantitatea lipsă. Pentru un lot concret, dacă lipsesc link-urile de staging/pegging sau lotul sursă upstream nu e finalizat, materialul nu este gata de alimentare. Verifică și unitățile, randamentul, pierderea tehnologică și densitatea salvată unde este necesară conversia masă–volum.
4. **MPS nu se amestecă orbește cu reordering automat.** Pentru produse planificate manual, verifică cerere, stoc, MPS existent și planned lots înainte să creezi replenishment nou.
5. **Quality checks apar în flux, nu la final ca notă.** Dacă operațiile sunt CCP/QC mandatory, verifică existența cerințelor QC înainte de execuție; fără cerințe detaliate, raportează risc.
6. **Echipamentul este constrângere reală.** Status `maintenance`, lipsa capacității rețetă-echipament, lipsa sculei/calibrului cerut de operație sau calibrarea expirată trebuie tratate ca risc de planificare, nu ca detaliu cosmetic.
7. **Finalizarea lotului trebuie să posteze cost și stoc corect.** Pentru fabrică, folosește operații shop-floor; pentru restaurant simplu, `exec_complete_batch` e suficient dacă lotul nu are un flux tehnologic atașat.

## Bucla agentului pentru fabrică

1. Citește contextul: `list_brands`, `list_locations`, `list_recipes`, `get_recipe_details`.
2. Rulează preflight: `get_manufacturing_readiness({ recipeId/productId/productName, quantity })`, apoi `get_production_schedule_feasibility({ dateFrom/dateTo sau horizonDays, orders })` dacă urmează să promiți termen, să creezi MPS sau să planifici mai multe loturi.
3. Dacă sunt blocaje:
   - material shortage → arată lipsurile și recomandă aprovizionare/MRP;
   - unit risk → normalizează unitățile rețetei;
   - lipsă flux → creează/activează flux;
   - lipsă capacitate → setează capacitatea echipament-rețetă;
   - scule/calibre lipsă sau calibrare expirată → leagă resursa potrivită de operație și actualizează calibrarea înainte de release;
   - QC incomplet → adaugă cerințe QC pe operațiile relevante.
   - calendar/capacitate blocată → mută data, adaugă tură, realocă operatori/echipamente sau ajustează loturile înainte să promiți termenul.
   - lipsă legătură de alimentare (staging) / lot sursă nefinalizat pe lotul concret → creează explicit legăturile de alimentare dintre lot și materialele lui sau așteaptă finalizarea lotului sursă.
4. Pentru zi folosește `preview_factory_plan` → `confirm_factory_plan`; pentru o rețetă, `preview_factory_production` → `confirm_factory_production`; pentru B2B, `plan_b2b_order` → `apply_b2b_order_plan`. Păstrează opțiunile și propunerea verificată. Înainte de execuție: `get_batch_material_readiness({ batchId, operationId? })`, apoi pornire pe baza situației reale.
5. Verifică prin citire: `list_mps_schedule`, `exec_get_batch_progress`, `exec_list_operation_executions`, `get_factory_dashboard`.

## Semnal de calitate

Un răspuns bun nu spune doar „am planificat”; spune:
- ce cerere/stoc a citit;
- ce a ieșit din readiness;
- ce riscuri rămân;
- ce scriere a făcut;
- ce citire a confirmat rezultatul.
