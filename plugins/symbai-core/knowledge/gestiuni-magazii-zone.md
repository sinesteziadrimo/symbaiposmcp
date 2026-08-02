# Gestiuni (magazii) și zone de depozitare

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier completează `stocuri-inventar-furnizori.md` (privirea de ansamblu pe stoc), `intrari-marfa-receptie.md` (cum intră marfa), `consum-zilnic-cost-marfa.md` (cum iese marfa la vânzare) și `plan-fabrica-2d.md` (harta halei, rafturi și etichete QR). Aici tratăm DOAR structura: ce e o gestiune, ce e o zonă, unde stă cantitatea și cum muți sau închizi o gestiune fără să strici stocul.

## Pe scurt

O **gestiune** (sau magazie) e locul în care ții evidența mărfii: Bar, Bucătărie, Depozit, Cămară. Fiecare gestiune aparține **obligatoriu unei locații** — nu poate fi împărțită între două restaurante — și, opțional, unuia sau mai multor branduri. Dacă nu îi pui niciun brand, gestiunea e comună tuturor brandurilor din acea locație (tipic: magazia de materii prime pe care o folosesc și restaurantul, și cafeneaua de la aceeași adresă).

În interiorul unei gestiuni poți defini **zone de depozitare**: frigidere, rafturi, camere de frig, chiar poziții individuale pe raft. Implicit, zonele sunt doar organizare pentru numărat. Cantitatea reală și banii stau la nivel de gestiune.

## Concepte

- **Gestiune (magazie)** — unitatea de evidență a stocului. Legată de o locație, opțional de branduri. Stocul NU stă pe brand, ci pe gestiune.
- **Etichetă de gestiune** — un câmp liber de text („depozit", „frig", „consumabile") pentru organizarea ta. **Nu schimbă niciun comportament** al sistemului: nu decide de unde se scade, nu decide unde intră marfa.
- **Zonă de depozitare** — frigider, raft, cameră de frig, nivel sau poziție dintr-o gestiune. Are cod, culoare și cod QR, poate fi ierarhică (raft → nivel → poziție) și poate purta praguri de temperatură pentru HACCP.
- **Zona implicită** — fiecare gestiune primește automat, la creare, o zonă cu numele gestiunii. Dacă redenumești gestiunea, numele zonei implicite o urmează.
- **Zona de intrare** — zona în care „aterizează" marfa recepționată, atunci când gestiunea își urmărește cantitatea pe zone. Se alege per gestiune, din aplicație.
- **Urmărire pe zone** — comutator per gestiune. **Oprit** (implicit): zonele sunt doar organizare pentru inventar, stocul e unul singur pe gestiune. **Pornit**: cantitatea se ține separat pe fiecare zonă, iar la ieșire sistemul folosește zona mapată (dacă produsul sau zona de sală are una); altfel alege zona cu cel mai mare sold pozitiv, cu zona de intrare ca departajare.
- **Zonă de sală ≠ zonă de depozitare** — terasa și salonul sunt zone de **servire**. Ele se pot lega la o zonă de depozitare, ca să știi din ce frigider scade o masă de pe terasă. Sunt două noțiuni diferite, cu ecrane diferite.
- **Gestiune de vehicul** — folosită de modulul de distribuție pentru marfa dintr-o mașină. Se încarcă și se descarcă **exclusiv din cursa de livrare**, nu prin transfer manual.
- **Gestiune de casă a produsului** — gestiunea scrisă pe fișa produsului; e „adresa lui de bază", folosită la grupare în ecrane și ca treaptă în alegerea gestiunii de consum.

## Paginile modulului

- **Magazii & Produse** (`/warehouse-products`) — creezi, editezi și dezactivezi gestiuni și zone; vezi ce produse are fiecare.
- **Verificări Stoc** (`/inventory-check`) — tabul **Stoc Live** (stocul curent) și tabul **Zone & Amplasare** (unde stă fiecare produs, transfer între zone).
- **Plan Fabrică 2D** (`/factory-floor-plan`) — selectezi o gestiune sau o zonă pe hartă și intri în **Vezi depozitul**: taburi Stoc, Zone, Mișcări, Intrări, Ieșiri, Loturi, plus butoanele **Raft** (generează rafturi cu niveluri și poziții) și **Etichete QR**.
- **Operațiuni Stoc** (`/stock-operations`) — de aici faci transferul între gestiuni.
- **Panou Inventar** (`/inventory`) — valoarea totală a stocului, alerte, mișcări recente.
- **Pagina mobilă de zonă** (`/scan/zone/:id`) — se deschide scanând eticheta QR a zonei și arată stocul ei live.

## Unde stă de fapt cantitatea

- Cantitatea nu e un număr „ținut minte", ci rezultatul **istoricului complet al mișcărilor**: fiecare recepție, consum, transfer sau ajustare lasă o urmă. De aceea stocul poate fi oricând reconstruit și verificat.
- **Banii (costul mediu) se calculează întotdeauna la nivel de gestiune**, chiar și când cantitatea e urmărită pe zone. Nu există „cost mediu al frigiderului".
- Când urmărirea pe zone e **oprită**, cantitatea trăiește doar la nivel de gestiune; zonele rămân utile la numărat.
- Un produs poate fi amplasat în **mai multe zone deodată** (același produs în două frigidere). Asta e pentru numărat și organizare — **stocul rămâne unul singur pe gestiune**, nu se împarte.
- ⚠ Scoaterea unui produs dintr-o zonă (butonul `X` din Zone & Amplasare) **nu mișcă stocul** și nu șterge produsul: doar îl scoate din amplasare, iar el reapare la „produse fără zonă". Mutarea fizică se face cu document, nu cu acest buton.

## Cum citești corect stocul

1. **Pe gestiune (cifra care contează la aprovizionare)** — `get_stock_levels` cu `warehouseId`. Întoarce doar produsele prezente/configurate în acea gestiune, cu cantitate, stoc minim și deficit.
2. **Vizual, cu zone și mișcări** — Plan Fabrică 2D → **Vezi depozitul** → taburile Stoc și Zone.
3. **Valoric** — `generate_report` cu tipul `stock_value` (valoarea stocului la cost și la preț de vânzare).
4. **Pe loturi (termene de valabilitate)** — `list_lots`, filtrat pe gestiune și/sau produs.
5. **Pe zonă** — doar din aplicație (tabul Zone sau scanarea etichetei QR). Nu există tool de citire a cantității per zonă.

⚠ **Ecranul principal de Stocuri arată TOTALUL pe toate gestiunile**, grupat sub gestiunea de casă a produsului. Nu e o greșeală de date, dar nu răspunde la „câtă brânză am în Bar" — pentru asta folosește punctul 1.
⚠ Într-un restaurant stocul **poate deveni negativ**: sistemul te lasă să lucrezi și îți semnalează problema, pentru că de cele mai multe ori înseamnă doar o recepție neînregistrată încă. Într-o fabrică regulile sunt mai stricte și operația se blochează.

## Mișcări între gestiuni și între zone

**Transfer între gestiuni** = document de sine stătător. Apare în istoricul de mișcări și intră automat în contabilitate.
- Din aplicație: **Operațiuni Stoc** → transfer, alegi gestiunea sursă și destinație.
- Prin conexiune: `create_inventory_document` 🔒 cu tipul `TRANSFER`, `warehouseFromId` + `warehouseToId` (cu `autoPost` sau urmat de `post_inventory_document` 🔒).
- Transferul e **instantaneu și integral**: în secunda confirmării marfa dispare din sursă și apare în destinație. Nu există starea „marfa e pe drum". Dacă vrei să vezi transportul, fă-ți o gestiune numită „În tranzit" și două transferuri.
- Sistemul mută **loturile reale**, cu termen de valabilitate, lot de furnizor și proveniență. De aceea un transfer poate fi refuzat: marfa e rezervată pentru o comandă sau pentru producție, lotul e în carantină de calitate, e expirat, sau altcineva tocmai a mișcat același stoc. Nu se mișcă nimic pe jumătate — ori tot, ori nimic.
- ⚠ **Transferul se face în interiorul aceleiași locații.** Prin conexiune, un transfer care atinge gestiuni din locații diferite e refuzat ca ambiguu contabil (fie pentru că locația nu poate fi dedusă, fie pentru că nu se potrivește cu toate gestiunile documentului). Marfa care chiar circulă între orașe se înregistrează ca ieșire dintr-o parte și intrare în cealaltă, pe documente.
- ⚠ Un transfer confirmat greșit **nu se șterge, se anulează** — și doar din aplicație. Anularea e blocată dacă marfa a fost între timp consumată, vândută sau prinsă în consumul zilnic, dacă e într-un inventar în curs, sau dacă luna a fost închisă contabil (atunci se redeschide întâi din Finanțe).
- ⚠ Gestiunile de vehicul nu se încarcă și nu se descarcă prin transfer manual — doar din cursa de distribuție.

**Transfer între zone ale ACELEIAȘI gestiuni** — se face **doar din aplicație** (Verificări Stoc → Zone & Amplasare). Mută amplasarea, nu valoarea: cantitatea totală pe gestiune și costul rămân neschimbate. Cere ca gestiunea să aibă urmărirea pe zone pornită și verifică soldul zonei sursă înainte de a accepta.

## Deschiderea, redenumirea și închiderea unei gestiuni

1. **Creare** — `create_warehouse` (nume + locație; opțional brand). Zona implicită se creează automat, cu numele gestiunii.
2. ⚠ **Caută înainte de a crea.** Numele nu e verificat când creezi din pagină, deci se pot naște două gestiuni „Bar"; prin conexiune, `create_warehouse` refuză un nume care există deja. Rulează oricum întâi `list_warehouses_full`.
3. **Redenumire / mutare / activare** — `update_warehouse`. Zona implicită își schimbă numele odată cu gestiunea.
4. **Înainte de dezactivare, golește gestiunea**: transferă stocul în altă gestiune și rezolvă documentele rămase în ciornă. Pagina refuză dezactivarea dacă mai există stoc sau ciorne.
5. **Ștergerea se face din aplicație** și îți cere explicit unde muți stocul și ce faci cu zonele (le ștergi sau le muți). Restaurarea unei gestiuni închise se face tot din aplicație.
6. O gestiune dezactivată **dispare din liste și din regulile de alegere a gestiunii de consum** — produsele care depindeau de ea vor fi scăzute din altă parte.

⚠ **Dezactivarea prin conexiune (`update_warehouse` cu `active:false`) nu face verificările pe care le face pagina** — poți „închide" o gestiune plină de marfă, iar rezultatul e o închidere pe jumătate: stocul rămâne acolo, gestiunea încă apare în unele liste, dar cade din regulile automate de alegere. Închiderea completă (cu mutarea stocului) o face doar pagina. Înainte de a folosi conexiunea: verifică stocul cu `get_stock_levels` (pe acel `warehouseId`) și recepțiile nepostate cu `list_pending_nirs` (pe același `warehouseId`), apoi confirmă cu utilizatorul. Când ai dubii, trimite-l în pagină.

## Zone, rafturi și etichete QR

- **Creare** — `create_storage_zone` (o zonă) sau `bulk_create_storage_zones` (mai multe deodată, ex. toate frigiderele bucătăriei); modificare cu `update_storage_zone`. Spre deosebire de gestiuni, **numele zonei e unic în interiorul unei gestiuni**, iar o gestiune are o singură zonă implicită.
- **Curățenie** — `scan_storage_zone_issues` îți arată nume cu spații, duplicate și zone goale; apoi `rename_storage_zone`, `merge_storage_zones` 🔒 (unifică două zone și mută toate referințele) sau `delete_empty_storage_zone`.
- **Amplasarea produselor** — `assign_product_storage_zones` (un produs în una sau mai multe zone), `assign_unzoned_products` (în masă), iar `scan_unzoned_products` îți arată ce se vinde fără zonă alocată.
- **Rafturi și bin-uri** — se generează din Plan Fabrică 2D → Vezi depozitul → butonul **Raft** (alegi câte niveluri și câte poziții).
- **Etichete QR** — tot de acolo, butonul **Etichete QR**. Le lipești pe raft; scanarea de pe telefon deschide zona cu stocul ei live și poate fi folosită și la inventariere.
- **Praguri de temperatură / HACCP pe zonă** (frigider, congelator, cameră rece, interval de grade) — se setează din aplicație.

## Fluxuri frecvente

**1. Deschid o gestiune nouă (ex. „Bar terasă")**
1. `list_warehouses_full` — verifici că nu există deja una cu același nume la acea locație.
2. `create_warehouse` cu numele și locația (brandul doar dacă gestiunea e a unui singur brand). Zona implicită apare automat.
3. `bulk_create_storage_zones` pentru frigidere/rafturi, dacă vrei organizare pe zone.
4. `assign_product_warehouses` pentru produsele care vor avea stoc acolo, apoi `set_initial_stock` dacă pornești cu marfă existentă.

**2. Mut marfă din depozit în bar**
1. `get_stock_levels` cu `warehouseId`-ul depozitului — confirmi ce ai efectiv.
2. Operațiuni Stoc → transfer, sau `create_inventory_document` 🔒 tip `TRANSFER` cu `warehouseFromId` și `warehouseToId`; dacă nu l-ai postat automat, `post_inventory_document` 🔒.
3. Recitește stocul pe ambele gestiuni. Dacă transferul a fost refuzat, citește motivul: marfă rezervată, lot expirat sau în carantină, lună închisă.

**3. Închid o gestiune care nu se mai folosește**
1. `get_stock_levels` pe acel `warehouseId` + `list_pending_nirs` pe același `warehouseId` — stoc rămas și recepții nepostate.
2. Golește prin transfer și postează sau șterge ciornele.
3. Dezactivează sau șterge **din pagina Magazii & Produse**, ca să treci prin verificările ei și să decizi unde merg zonele.

**4. Fac ordine în zone înainte de inventar**
1. `scan_storage_zone_issues` — duplicate, nume murdare, zone goale.
2. `rename_storage_zone` / `merge_storage_zones` 🔒 / `delete_empty_storage_zone`, în această ordine.
3. `scan_unzoned_products` → `assign_unzoned_products` pentru ce se vinde fără zonă.
4. Generează etichetele QR din Plan Fabrică 2D și lipește-le pe rafturi.

**5. Răspund la „cât mai am în Bar?"**
`get_stock_levels` cu `warehouseId`-ul barului (și `productName` dacă e vorba de un singur produs). Nu folosi ecranul de Stocuri ca sursă — el arată totalul pe toate gestiunile.

## Tool-uri MCP utile

**Citire (modul `inventar`):**
- `list_warehouses_full` — toate gestiunile, cu locație, brand, cod și status.
- `list_storage_zones_full` — zonele de depozitare.
- `get_warehouse_products_summary` — câte produse și pe ce categorii are o gestiune.
- `get_stock_levels` — stocul curent per produs; cu `warehouseId` = cifra reală pe gestiune.
- `list_lots` — loturile, cu termene de valabilitate, filtrabile pe gestiune și produs.
- `list_pending_nirs` — recepțiile create dar nepostate pe o gestiune (obligatoriu de verificat înainte de a o închide).
- `scan_storage_zone_issues` / `scan_unzoned_products` — diagnostic, fără efect.
- `generate_report` cu `stock_value` — valoarea stocului; `jurnal_activitate` (categoria INVENTORY) — cine a mișcat ce. Aceste două cer drept de citire pe toate modulele, nu doar pe `inventar`.

**Scriere:**
- Modul `produse_meniu`: `create_warehouse`, `update_warehouse`, `create_storage_zone`, `update_storage_zone`, `bulk_create_storage_zones`, `set_initial_stock`.
- Modul `inventar`: `assign_product_warehouses` (produsul are stoc și în gestiunea X), `assign_product_storage_zones`, `assign_unzoned_products`, `rename_storage_zone`, `merge_storage_zones` 🔒, `delete_empty_storage_zone`, `create_inventory_document` 🔒 (transferul), `post_inventory_document` 🔒.
- Modul `productie`: `map_zone_ingredient_warehouse` — leagă un ingredient de gestiunea din care se consumă pentru o anumită zonă de producție.

**Ce rămâne doar din aplicație:** transferul între zone; pornirea/oprirea urmăririi pe zone; alegerea zonei de intrare; legarea unei zone de sală la o zonă de depozitare; pragurile de stoc minim/maxim pe gestiune; ștergerea și restaurarea unei gestiuni; anularea unui transfer deja confirmat; rafturile și etichetele QR. Dacă lipsa unuia dintre ele te blochează efectiv, trimite o cerere cu `trimite_ticket_symbai`, tip „sugestie".

## În producție, gestiunea NU decide cine ce lucrează

Într-o fabrică, oamenii lucrează pe **zone de producție** (Brutărie, Ambalare, Tranșare), iar tableta stației stă fizic într-o zonă. Gestiunea e altceva: e locul în care se ține evidența mărfii. Cele două nu trebuie confundate.

Regula, în trei rânduri:

- **Fabrica = brand × locație.** Nu gestiune. „Senneville la Călan" e o fabrică; depozitele ei de materii prime și de semipreparate sunt magazii din aceeași fabrică, nu fabrici diferite.
- **Ce muncă vezi pe tabletă** se decide de **stație** — zonele și utilajele configurate pe ea. Un lot al aceleiași fabrici apare pe tableta care îi execută pașii, indiferent de magazia pe care a fost creat.
- **Gestiunea contează unde chiar contează**: din ce magazii se ia materialul și în care se postează ce ai produs.

Fiecare lot de producție primește, la creare, o **gestiune de postare** — acolo intră produsul finit și acolo se face nota contabilă. Ea se fixează în momentul creării și **nu se schimbă ulterior**. Dacă cine a creat lotul avea selectat „Depozit materii prime", lotul se va posta acolo chiar dacă restul planificării stă pe „Depozit semipreparate".

Ce vezi în aplicație:

- Selectorul de gestiuni din bara fabricii pune **două întrebări separate**: bifele = ce muncă vezi (fără nicio consecință contabilă, poți bifa toate), iar „Postează aici" = gestiunea în care intră marfa produsă. Prestabilit sunt bifate toate gestiunile fabricii.
- Pe cardul unei operații, gestiunea apare **doar când diferă** de cea pe care e ancorată tableta. Pe o fabrică cu o singură gestiune nu o vezi niciodată.
- Pe un asemenea rând, în locul butonului de pornire apare **„Lucrează pe «numele gestiunii»"**. Un tap comută tableta pe ea și pasul devine lucrabil. Nu e o restricție inventată: documentele de stoc și notele contabile trebuie să știe fără echivoc în ce gestiune se scrie.
- Indicatorul „Stoc:" din dialogul de consum arată **tot ce poate lua stația**, nu doar magazia operației, și îți spune cât e la îndemână și cât trebuie adus din altă magazie a fabricii.

Aceleași reguli în **Symbai Staff** (telefon) și pe tabletă, online și offline.

**Cum aleg gestiunea de postare pentru loturi noi** — pune-o pe cea în care chiar vrei să intre produsul finit, înainte de a planifica. În aplicație: bara fabricii → „Postează aici". Prin conexiune: `exec_create_batch` acceptă `destinationWarehouseId`.

**Loturi vechi ajunse pe gestiunea greșită** — nu se re-ancorează din hală. Le lucrezi comutând tableta pe gestiunea lor (butonul de mai sus), iar pentru loturile viitoare corectezi gestiunea de postare înainte de planificare.

## Întrebări frecvente și capcane

- **Am creat gestiunea de două ori — de ce n-a oprit-o sistemul?** Numele gestiunii nu e verificat când o creezi din pagină (prin conexiune ar fi fost refuzat). Caută întâi cu `list_warehouses_full`, iar dacă ai deja dubluri, golește-o pe cea greșită prin transfer și dezactiveaz-o din aplicație.
- **De ce nu văd o gestiune în listă?** Fie a fost dezactivată (dezactivarea o ascunde peste tot), fie e în afara unității tale: aparține altei locații sau unui brand la care nu ai acces.
- **Am mutat produsul în altă gestiune și s-a generat un document — e normal?** Da. Dacă produsul avea stoc, schimbarea gestiunii îl mută fizic, deci creează un transfer și nota contabilă aferentă. Fără document, marfa ar apărea în două locuri.
- **De ce ecranul de Stocuri arată altceva decât gestiunea?** Ecranul principal însumează toate gestiunile și pune produsul sub gestiunea lui de casă. Pentru cifra pe gestiune folosește `get_stock_levels` cu `warehouseId` sau pagina de depozit.
- **Pot împărți o gestiune între două restaurante?** Nu. Gestiunea aparține unei singure locații. Poate fi însă comună mai multor branduri de la **aceeași** adresă — lasă-i pur și simplu brandul necompletat.
- **De ce nu pot transfera din depozitul Locației 1 în barul Locației 2?** Pentru că sunt locații diferite, iar transferul direct ar fi ambiguu contabil. Se face pe documente de ieșire și intrare, nu prin transfer.
- **Am scos produsul din zonă și stocul n-a scăzut.** Corect: scoaterea din zonă e o operație de amplasare, nu de stoc. Ca să scadă cantitatea îți trebuie o fișă de ieșire, un transfer sau o ajustare de inventar.
- **De ce nu merge transferul când nu am internet?** Mișcările de marfă între gestiuni se înregistrează exclusiv în sistemul central. Serverul local ține comenzile și producția și fără conexiune, dar transferurile se fac când unitatea e online.
- **De ce nu văd pe tabletă un lot pe care l-am planificat?** Verifică întâi ZONA: tableta arată operațiile zonelor și utilajelor ei, deci un pas fără zonă și fără utilaj în flux nu aparține niciunei stații. Gestiunea nu mai ascunde munca — vezi secțiunea despre producție de mai sus.
- **De ce scrie pe card altă gestiune decât cea din bara de sus?** Pentru că lotul se postează acolo. Apasă „Lucrează pe …" ca să comuți tableta și să poți porni pasul.
- **Pot muta un lot deja creat pe altă gestiune?** Nu din hală. Gestiunea de postare se fixează la creare, pentru că de ea depind documentul de stoc și nota contabilă. Pentru loturile viitoare, alege gestiunea corectă înainte de planificare.
- **Am pornit urmărirea pe zone și cantitățile par ciudate.** După pornire, sistemul repartizează istoricul pe zona de intrare, apoi reconstruiește cantitățile pe zone. Verifică zona de intrare a gestiunii și amplasează produsele în zonele lor înainte de primul inventar pe zone.

## Pentru acces SQL

Dacă tokenul are activat accesul SQL (doar-citire), descoperă întâi structura cu `list_database_tables` → `describe_database_table`, apoi interoghează cu `execute_sql_query`. Găsești date despre gestiuni și zone, mișcările de stoc, loturi și documentele de transfer.

Exemple de întrebări: „valoarea stocului pe fiecare gestiune", „ce produse stau în două gestiuni deodată", „toate transferurile dintre depozit și bar din luna trecută".
