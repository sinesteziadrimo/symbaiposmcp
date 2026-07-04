# Benchmark ERP manufacturing — cum gândește agentul pe producție

Scop: când agentul lucrează pe producție/fabrică, să gândească precum un consultant ERP/MES, nu ca un operator care apasă direct „creează lot”.

Surse de inspirație verificate în documentații oficiale:
- Odoo Manufacturing: BoM = componente + cantități + operații/work centers; MPS combină forecast, cerere confirmată, stoc și replenishment; Quality Checks pot fi pe manufacturing order sau work order.
- Microsoft Dynamics 365 Supply Chain Management: ciclul producției trece prin created → estimated → scheduled → released → prepared/picked → started → progress/jobs → reported as finished → quality assessment → put away/end; release-ul cere disponibilitate materiale și planificare resurse.

## Principii de lucru (inspirate din ERP-urile mari)

1. **Release gate înainte de execuție.** Înainte să creezi MPS sau lot pentru fabrică, rulează `get_manufacturing_readiness`. Pentru comenzi mari, mai multe loturi sau termene promise, rulează apoi `get_production_schedule_feasibility` pe intervalul real ca să validezi echipamentele, turele, oamenii și încărcarea existentă. Dacă statusul e `blocked`, nu scrie nimic: rezolvă întâi materialele, fluxul, echipamentele, sculele/calibrele, calibrarea, QC-ul sau capacitatea. După ce lotul există, înainte de `exec_start_operation`, rulează și `get_batch_material_readiness` pentru a valida staging-ul real pe lot/operație.
2. **BoM + flux + capacitate sunt un singur sistem.** O rețetă cu ingrediente dar fără flux/capacitate nu e pregătită pentru fabrică; e doar o rețetă de restaurant. Pentru fabrică trebuie să existe operații, echipamente și timpi standard.
3. **Material availability este separată de stoc brut.** Stocul disponibil = on hand − rezervat. Nu planifica pe cantitatea totală dacă există rezervări. La BoM multi-level, netează întâi stocul existent de semipreparate/WIP și explodează sub-rețeta doar pentru cantitatea lipsă. Pentru un lot concret, nu confunda „există stoc undeva” cu „materialul este gata de alimentare”: dacă lipsesc link-urile de staging/pegging sau lotul sursă upstream nu e finalizat, lotul nu este realmente ready.
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
4. Abia după readiness + fezabilitate curată sau acceptată explicit: `create_mps_entry` sau `schedule_production_orders({ commit:false })` pentru preview complet. Folosește `schedule_production_orders({ commit:true })` doar după confirmare explicită; apoi `get_batch_material_readiness({ batchId, operationId? })`, `exec_start_operation`.
5. Verifică prin citire: `list_mps_schedule`, `exec_get_batch_progress`, `exec_list_operation_executions`, `get_factory_dashboard`.

## Semnal de calitate

Un răspuns bun nu spune doar „am planificat”; spune:
- ce cerere/stoc a citit;
- ce a ieșit din readiness;
- ce riscuri rămân;
- ce scriere a făcut;
- ce citire a confirmat rezultatul.
