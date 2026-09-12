# Picking pe rânduri și rafturi

Pentru „în ce ordine culegem”, „FEFO sau rapid”, „raft de sus cu stivuitorul”, „cerere din producție”, „picking B2B” și „magazin online”. Structura fizică și mutarea rafturilor sunt în [organizare-depozitare-ai.md](./organizare-depozitare-ai.md).

Verifică întâi disponibilitatea tool-urilor prin `cauta_tool`. Folosește conexiunea nominală, drepturile și gestiunile operatorului. O funcție descrisă aici poate să nu fie încă disponibilă pe versiunea firmei conectate.

## Configurarea depozitului

1. Identifică magazia reală cu `list_storage_warehouses` / `list_work_warehouses`, apoi citește structura cu `get_storage_workspace`. Pentru producție păstrează exact fabrica, locația și gestiunea întoarse de tool.
2. `get_warehouse_picking_config`, `section:config`, citește setările comune și `revision`. Citește separat `places` pentru accesul pozițiilor, `nodes` pentru punctele culoarelor și `edges` pentru legături.
3. La liste urmează întocmai `pagination.nextArguments` până când `hasMore:false`. Dacă datele se schimbă între pagini, reia citirea; nu combina pagini vechi cu pagini noi.
4. Alege profiluri distincte pentru producție, B2B/livrări și online. La alimente pornește de la FEFO; pentru jucării fără termen poți folosi rapid. Confirmă regulile reale de valabilitate, eliberarea calității și rezervările comenzii înainte de alegerea loturilor.
5. Configurează rândul, modulul, accesul manual sau cu stivuitor, rolul picking/rezervă, înălțimea operațională și punctul de acces. O poziție poate moșteni regula părintelui. Înălțimea desenată în 3D nu dovedește accesul sigur.
6. `configure_warehouse_picking` primește `revision` și toate setările comune din ultima citire, cu schimbările dorite. Listele `nodes` și `edges` omise rămân păstrate; dacă le trimiți, înlocuiești lista întreagă, deci citește întâi toate paginile. Regulile locurilor neatinse se păstrează. Prin `places` schimbi numai ID-urile dorite; `picking:null` elimină suprascrierea explicită, revenind la regula moștenită sau din geometrie.
7. Recitește configurația și traseul unei comenzi reprezentative. Un refuz pentru revizie veche cere recitire și reevaluare.

Coordonatele punctelor sunt în centimetri, vitezele în metri/minut, timpii de manipulare în secunde. În rețea se respectă sensul unic și accesul manual/stivuitor. Nu inventa cote, culoare libere, viteze reale sau reguli de siguranță.

## Cum alegi sursa

| Situație | Comportament de urmărit |
|---|---|
| Aliment cu termen mai apropiat pe raftul de sus | FEFO are prioritate; drumul mai scurt nu justifică schimbarea lotului |
| Același termen, marfă suficientă jos | Compară manipularea și profilul manual/rapid; evită stivuitorul când regulile permit |
| Cantitate mare în rezervă | Disponibilitatea stivuitorului, timpul de pregătire și cantitatea per ridicare influențează sursa |
| Lot obligatoriu sus, stivuitor indisponibil | Citește problema raportată; nu înlocui tacit lotul cu unul ulterior |
| Stoc global, fără adresă fizică confirmată | Nu trimite omul la un raft presupus; clarifică amplasarea |
| Lot rezervat sau blocat de calitate | Regulile fluxului și rezervările rămân obligatorii |

Ordinea este optimizată printr-o estimare pe culoarele configurate. Nu reprezintă o garanție de minimum matematic global și nu include traficul, cozile sau timpii reali de așteptare ai stivuitorului.

## Pickingul unei comenzi reale

| Cerere | Tool de traseu |
|---|---|
| Materiale cerute de producție | `get_production_picking_route` cu `groupKey`, gestiune, brand și locație exacte |
| Comandă B2B / livrare către magazine | `get_b2b_picking_route` cu comanda și locația operațională |
| Comandă online | `get_ecommerce_picking_route` cu comanda |

Citește `steps` și `issues` pe toate paginile. Păstrează ordinea `sequence`, sursa, lotul, cantitatea și unitatea fiecărui pas. Prezintă simplu: „oprirea 1 — rând A, raft A03, stivuitor, lotul X, 12 kg”. Nu însuma kg cu bucăți.

Verifică numărul problemelor, lipsurile și `blockedForActor`. Lipsa rutei sau lipsa pașilor nu confirmă culegerea. Citește starea comenzii și disponibilul înainte să declari pregătirea completă.

Aceste tool-uri citesc recomandarea. Scanarea, confirmarea, rezervarea, consumul și expedierea sunt pași separați în fluxul comenzii. Pentru B2B continuă, când este autorizat, cu `get_b2b_picking_plan`, `allocate_b2b_lot`, `confirm_b2b_picking`; pentru probleme în producție folosește `exec_diagnose_material_picking`. Verifică rezultatul după fiecare operație.

## Rafturi 3D

Pentru poziționarea rafturilor folosește tool-urile existente: `get_storage_workspace`, `update_storage_place`, `preview_storage_layout` și `apply_storage_layout`. Previzualizează mutarea și aplică la revizia citită. Mutarea desenului nu transferă marfa și nu schimbă singură regulile operaționale de picking.
