# Pregătirea comenzilor, colete și predare

Acest flux acoperă comenzile B2B și online. Descoperă uneltele prin `cauta_tool` și citește schema cu `citeste_tool` pe conexiunea firmei: disponibilitatea depinde de versiune și de drepturile contului. Identifică brandul, locația și depozitul fizic înainte de lucru.

## Pregătire și predare sunt etape separate

Pentru stoc integral/parțial, livrări în mai multe zile sau mașini, aprobări și eticheta fiecărui colet, urmează [comenzile B2B în tranșe](b2b-livrari-partiale.md). Instrumentele MCP de depozit cer `id`, `brandId`, `locationId` și `warehouseId` exacte. Citește toate paginile; un răspuns incomplet nu înseamnă că restul produselor lipsește.

În depozit, operatorul culege produsele, verifică loturile și cantitățile, confirmă pregătirea, ambalează în colete și stabilește locul de așteptare. Predarea se confirmă când marfa este preluată efectiv. O comandă pregătită sau un AWB emis nu dovedește preluarea de către curier ori livrarea la client.

Pentru online, pagina `/ecommerce/picking` include lucrul efectiv în depozit. `list_online_warehouse_orders` arată coada, `get_online_warehouse_pick_plan` oferă liniile și reviziile, iar `confirm_online_warehouse_preparation` confirmă produsele culese și produce ieșirea de stoc/documentele configurate. Citește toate paginile până când nu mai există `nextCursor`, inclusiv după o pagină goală. Pregătirea unei gestiuni poate aștepta pregătirea celorlalte gestiuni ale comenzii.

Pentru B2B, începe cu `list_b2b_warehouse_orders` și `get_b2b_warehouse_pickup`. Configurația poate permite ridicarea din depozit de către client sau transportator extern. Flota proprie păstrează fluxul de șofer, mașină și custodie descris în [dispeceratul B2B](livrari-b2b-dispecerat.md).

## Comenzi fără termen și ziua ridicării

O comandă B2B poate avea termenul de livrare necompletat. Data folosită la planificare și ziua efectivă a ridicării au sensuri distincte. Citește politica cu `get_factory_delivery_planning_policy`; `set_factory_delivery_planning_policy` configurează cerința orei și orizontul comenzilor fără termen. Nu prezenta orizontul intern ca promisiune către client. `set_b2b_handover_date` schimbă ziua ridicării fără a inventa un termen contractual.

## Colete, măsuri și etichete

Descoperă operațiile de ambalare pentru tipul comenzii: creare colet, conținut, loc de așteptare, măsuri și etichete. Folosește cantitățile, greutățile și dimensiunile reale. La schimbarea conținutului recitește coletul și revizia înainte de modificarea măsurilor. Un colet cu AWB sau deja predat poate avea modificările blocate; nu ocoli blocarea prin recrearea lui.

Eticheta poate conține QR intern și SSCC. QR-ul intern nu necesită inventarea unui prefix GS1. Pentru SSCC configurează numai prefixul atribuit efectiv firmei. O etichetă generată nu dovedește că a fost imprimată și aplicată pe colet.

## Confirmarea preluării

Politica depozitului decide confirmarea manuală sau scanarea coletelor. La scanare folosește codurile citite fizic și tokenurile întoarse; nu fabrica dovada din datele comenzii.

- B2B: `scan_b2b_warehouse_package` și `confirm_b2b_warehouse_pickup`, după citirea comenzii și a politicii.
- După predarea B2B recitește `get_b2b_warehouse_pickup` și verifică `handedOver`. Dacă rămâne marfă de livrat, folosește tranșele legate; păstrează aceeași `requestKey` și aceleași argumente la reluarea unei cereri incerte.
- Online: `list_online_handover_ready` → `scan_online_handover_package`, dacă este cerută scanarea → `confirm_online_handover`.
- Pentru mai multe colete, verifică toate coletele exterioare cerute. Un singur AWB nu înlocuiește scanarea fiecărui colet.
- După confirmare citește borderoul cu `get_online_handover` sau istoricul cu `list_online_handovers`. Păstrează același `attemptId` când răspunsul este incert; verifică rezultatul înainte să creezi o operație nouă.

Vezi și [comenzile B2B](b2b-comenzi-wholesale.md), [magazinul online](ecommerce-magazin-online.md) și [GLS](gls-magazin-online.md).
