# Benchmark ERP manufacturing — ce copiem în Symbai

Scop: când agentul lucrează pe producție/fabrică, să gândească precum un consultant ERP/MES, nu ca un operator care apasă direct „creează lot”.

Surse de inspirație verificate în documentații oficiale:
- Odoo Manufacturing: BoM = componente + cantități + operații/work centers; MPS combină forecast, cerere confirmată, stoc și replenishment; Quality Checks pot fi pe manufacturing order sau work order.
- Microsoft Dynamics 365 Supply Chain Management: ciclul producției trece prin created → estimated → scheduled → released → prepared/picked → started → progress/jobs → reported as finished → quality assessment → put away/end; release-ul cere disponibilitate materiale și planificare resurse.

## Pattern-uri de copiat

1. **Release gate înainte de execuție.** Înainte să creezi MPS, lot sau să pornești un lot de fabrică, rulează `get_manufacturing_readiness`. Dacă statusul e `blocked`, nu scrie nimic: rezolvă întâi materialele, fluxul, echipamentele sau QC.
2. **BoM + flux + capacitate sunt un singur sistem.** O rețetă cu ingrediente dar fără flux/capacitate nu e pregătită pentru fabrică; e doar o rețetă de restaurant. Pentru fabrică trebuie să existe operații, echipamente și timpi standard.
3. **Material availability este separată de stoc brut.** Stocul disponibil = on hand − rezervat. Nu planifica pe cantitatea totală dacă există rezervări. La BoM multi-level, netează întâi stocul existent de semipreparate/WIP și explodează sub-rețeta doar pentru cantitatea lipsă.
4. **MPS nu se amestecă orbește cu reordering automat.** Pentru produse planificate manual, verifică cerere, stoc, MPS existent și planned lots înainte să creezi replenishment nou.
5. **Quality checks apar în flux, nu la final ca notă.** Dacă operațiile sunt CCP/QC mandatory, verifică existența cerințelor QC înainte de execuție; fără cerințe detaliate, raportează risc.
6. **Echipamentul este constrângere reală.** Status `maintenance` sau lipsa capacității rețetă-echipament trebuie tratate ca risc de planificare, nu ca detaliu cosmetic.
7. **Finalizarea lotului trebuie să posteze cost și stoc corect.** Pentru fabrică, folosește operații shop-floor; pentru restaurant simplu, `exec_complete_batch` e suficient dacă lotul nu are `flowVersionId`.

## Bucla agentului pentru fabrică

1. Citește contextul: `list_brands`, `list_locations`, `list_recipes`, `get_recipe_details`.
2. Rulează preflight: `get_manufacturing_readiness({ recipeId/productId/productName, quantity })`.
3. Dacă sunt blocaje:
   - material shortage → arată lipsurile și recomandă aprovizionare/MRP;
   - unit risk → normalizează unitățile rețetei;
   - lipsă flux → creează/activează flux;
   - lipsă capacitate → setează capacitatea echipament-rețetă;
   - QC incomplet → adaugă cerințe QC pe operațiile relevante.
4. Abia după preflight curat sau acceptat explicit: `create_mps_entry`, `exec_create_batch`, `exec_start_operation`.
5. Verifică prin citire: `list_mps_schedule`, `exec_get_batch_progress`, `exec_list_operation_executions`, `get_factory_dashboard`.

## Semnal de calitate

Un răspuns bun nu spune doar „am planificat”; spune:
- ce cerere/stoc a citit;
- ce a ieșit din readiness;
- ce riscuri rămân;
- ce scriere a făcut;
- ce citire a confirmat rezultatul.
