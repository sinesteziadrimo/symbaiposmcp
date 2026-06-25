# Stocuri, Inventar & Furnizori

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă tot drumul mărfii: intrarea (facturi de la furnizori → recepție/NIR), depozitarea (gestiuni, zone, loturi cu expirare), ieșirea (consum automat din vânzări, fișe de ieșire manuale, transferuri) și aprovizionarea (furnizori, cataloage, comenzi, recomandări de preț). Stocul se ține pe loturi, descărcarea e FIFO/FEFO, iar costul mărfii vândute se calculează din loturile reale consumate.

## Concepte

- **Gestiune (magazie)** — depozitul logic în care stau produsele (ex. Bucătărie, Bar, Magazie centrală). Fiecare gestiune poate avea **zone de depozitare** (frigider, raft, congelator, cămară).
- **Magazie de consum** — gestiunea din care se descarcă consumul; poate fi diferită per unitate (brand + locație) pentru același produs.
- **NIR (recepția)** — documentul prin care marfa intră oficial în stoc. În pagina Intrări se creează doar legat de o factură sursă și doar după ce toate liniile facturii sunt mapate; la postare intră marfa în stoc și se generează automat notele contabile. (Pentru documente introduse pe loc există și recepția manuală — pe factură sau pe aviz — din Operațiuni Stoc.)
- **Mapare** — legarea unei linii de factură de un produs intern + un cont contabil. AI-ul propune, operatorul confirmă, iar sistemul învață: următoarea factură de la același furnizor se mapează automat.
- **Aviz de însoțire** — document de primire pentru marfa sosită înaintea facturii oficiale. Recepția pe aviz intră marfa în stoc la postare, iar avizul rămâne „neînchis" în Avize & Draft până îl legi de e-Factura corespunzătoare, în tabul Reconciliere.
- **Lot / FIFO / FEFO** — stocul se ține pe loturi cu dată de expirare; descărcarea ia întâi lotul cel mai vechi / care expiră primul, iar costul vânzării (COGS) vine din loturile reale consumate.
- **Cost standard provizoriu** — cost estimativ pe produs folosit ca fallback în food cost când încă nu există loturi/recepții reale. Nu creează stoc, nu schimbă CMP și nu ține loc de NIR; prima recepție reală îl umbrește.
- **Consum zilnic** — generat automat din vânzări: produs vândut → rețetă → ingredientele scad din stoc; produsele fără rețetă (marfă) se descarcă direct ca atare.
- **Reprocesare consum** — recalculează consumul și costurile pe o perioadă (ex. după ce ai corectat rețete); rulează ca job pe fundal, cu progres vizibil, și există și reprocesare pe un singur produs.
- **Fișă de ieșire** — document de ieșire manuală din stoc: consum, protocol, pierdere/casare, furt, minus de inventar, retur; tipurile sunt configurabile, fiecare cu marcaj dacă afectează sau nu P&L-ul.
- **Inventar (sesiune de numărare)** — numeri fizic stocul (inclusiv de pe telefon), iar sistemul produce raportul de diferențe (plus/minus de inventar) care, după aprobare, ajustează stocul.
- **Comandă furnizor** — comanda de aprovizionare trimisă unui furnizor, cu ciclu complet: ciornă → trimisă → acceptată/respinsă (eventual cu modificări și contra-propuneri) → în pregătire → în livrare → livrată → recepție → finalizată.
- **Catalog furnizor** — lista de produse a unui furnizor cu prețuri, coduri și cantități minime; produsele de catalog se mapează la produsele tale interne pentru aprovizionare automată.
- **Conversie de pachet** — ex. „bax" = 24 bucăți; se învață din facturi și se reaplică automat la recepțiile următoare.

## Paginile modulului

### Panou & structură stoc
- **Panou Inventar** (`/inventory`) — tabloul de bord al stocului: valoare totală stoc, alerte de stoc, mișcări recente, pierderi (waste), plus ghid „Gestiune & Stocuri".
- **Magazii & Produse** (`/warehouse-products`) — administrezi magaziile și zonele de depozitare (creare, editare, culoare, cod) și vezi produsele din fiecare, cu căutare după nume/SKU; la ștergerea unei gestiuni, produsele ei pot fi mutate în alta.
- **Inventar Multi-Sursă** (`/inventory/msi`) — pentru vânzări online/ecommerce cu mai multe depozite: reguli de alocare automată pe surse, rezervări cu termen, backorder/preorder, expediții împărțite, webhooks, vizibilitate storefront.
- **Plan Fabrică 2D / Warehouse Hub** (`/factory-floor-plan`) — pentru fabrici, selectezi o magazie sau zonă de depozitare pe plan și intri în **Vezi depozitul**: taburi Stoc, Zone, Mișcări, Intrări, Ieșiri și Loturi, plus **Raft** pentru rack/bin-uri și **Etichete QR** pentru coduri care se scanează pe mobil la `/scan/zone/:id`.

### Intrări (recepție marfă)
- **Intrări** (`/stock-entries`) — pagina „Intrări Marfă" cu 5 taburi: Facturi Furnizori, Avize & Draft, Reconciliere, Recepții (NIR), Producție. De aici creezi NIR-ul (alegi factura sursă + depozitul de recepție) și poți tipări „Nota de recepție și constatare de diferențe".
- **Achiziții** (`/purchases`) — vedere de ansamblu a achizițiilor, implicit pe ultimele 90 de zile; banner cu NIR-urile create dar neintrate încă pe stoc (ciornă / așteaptă confirmare), cu postare în masă.
- **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — panou de „igienă" a intrărilor: mapări sub 70% încredere, NIR-uri ciornă mai vechi de 7 zile, facturi e-Factura fără NIR, anomalii de preț (variație >20% în 60 zile), conflicte între reguli de mapare.
- **Dispute Inventar** (`/inventory/disputes`) — diferențele constatate la recepție, clasificate: dispute cu furnizorul, corecții OCR, variații de livrare.

### Mapare AI facturi
- **Revizuire Mapări AI** (`/inventory/ai-review`) — toate liniile din facturile fără recepție, într-un singur loc, pentru verificare și aprobare centralizată; poți edita maparea, sparge o linie în sub-linii sau absorbi o linie în altele.
- **Reguli de Mapare** (`/inventory/mapping-rules`) — regulile învățate de sistem, pe două taburi: specifice unui furnizor (prioritate maximă) și generale, valabile la orice furnizor (rezervă); cu ștergere în masă.

### Ieșiri & mișcări
- **Ieșiri** (`/stock-exits`) — 2 taburi: Facturi Fiscale (facturile emise) și Ieșiri — fișele de ieșire (protocol, pierderi, casare, furt, minus inventar, retururi + tipuri proprii). O fișă se poate posta direct sau salva ca ciornă.
- **Operațiuni Stoc** (`/stock-operations`) — 3 taburi: Mișcări Stoc, Documente, Rapoarte; aici faci operațiuni de intrare (pe factură sau aviz), ieșire și transfer între gestiuni.
- **Mișcări Stocuri** (`/stock-movements`) — aceeași unealtă ca Operațiuni Stoc, deschisă direct pe vederea de mișcări (istoricul a tot ce a intrat/ieșit/s-a mutat).

### Inventariere
- **Verificări Stoc** (`/inventory-check`) — 6 taburi: Stoc Live (stocul curent, cu căutare), Istoric & Jurnale, Inventare (sesiuni de numărare), Raport Diferențe, Zone & Amplasare, Aprobări.
- **Inventariere Mobil** (`/inventory-check/mobile/:sessionId`) — sesiunea de numărare pe telefon: filtrezi pe magazie și zonă, cauți articolul sau scanezi codul și introduci cantitatea numărată. Linkurile delegate cu `?shareToken=...` se deschid public, fără cont, pentru persoana desemnată; managerul folosește același URL fără token din aplicația logată.

**Reguli actuale pentru inventariere si zone**
- Cand pornesti un inventar pe una sau mai multe gestiuni, lista de numarat trebuie sa fie limitata la acele gestiuni: intra produsele cu stoc live in gestiunea aleasa si produsele stocabile care au zona de depozitare asignata in acea gestiune, inclusiv daca stocul lor este 0. Nu se includ produse doar pentru ca exista o mapare istorica in `product_warehouses`.
- Inventarul poate fi retroactiv: in dialogul "Inventar nou" setezi data si ora reala a numararii. Stocul asteptat se reconstruieste pentru acel moment din miscarile de stoc (`doc_date`), iar diferentele se judeca fata de acel stoc, nu fata de stocul live de azi. Nu folosi date viitoare; "Actualizeaza Stocuri" pastreaza acelasi moment de referinta.
- Produsele nestocabile si tipurile cu `hasStock=false` nu se numara. In Zone & Amplasare, la "Adauga produse" apar doar produse stocabile fizic; produsele finite (`finished_good`, preparate din retete) nu se adauga ca produse de depozitare.
- În Zone & Amplasare există butonul `X` pe rândul unui produs din zonă: scoate produsul din zona de depozitare (`storage_zone_id = NULL`), dar NU șterge produsul și NU mișcă stocul. Produsul rămâne în magazie/stoc și reapare la „produse fără zonă", de unde poate fi re-amplasat. Pentru mutare fizică între gestiuni folosești document de transfer, nu acest buton.
- La "Produse alese manual", cautarea si filtrele respecta gestiunile inventarului. Poti filtra dupa cautare text, tag, furnizor, tip produs si TVA; "Select all" si "Deselect all" actioneaza doar pe rezultatul filtrat curent (ex. cauti "bere" si selectezi toate berile gasite).
- Butonul de trimitere de langa "Inventar Mobil" creeaza link pentru un numarator. Poti aloca produse filtrate sau una/mai multe zone de depozitare, poti trimite prin WhatsApp/email sau copia linkul, si poti decide daca numaratorul are voie sa caute produse extra. In modal apar doar numele zonelor de depozitare, fara repetarea gestiunii; zonele adaugate dupa pornirea inventarului sunt eligibile daca apartin gestiunilor inventarului.
- Linkul delegat contine `shareToken` si este gandit pentru acces fara login. Daca trebuie dovada vizuala sau un client spune ca numaratorul ajunge la login, deschide linkul intr-o sesiune nelogata cu `browser:control-in-app-browser` sau `chrome:control-chrome` si arata pagina mobila de numarare, nu Dashboard-ul.
- Persoana care intra pe linkul mobil vede doar produsele sau zonele primite. Daca "poate numara si alte produse" este activ, cautarea extra ramane limitata la gestiunea aleasa si la produse numarabile.
- Pe mobil, căutarea/scannerul caută în nume, SKU, barcode și EAN. Dacă ai importat retail fără aceste coduri pe produs, scanarea nu are ce potrivi ulterior.
- La inventarul inițial unde toate cantitățile așteptate sunt 0, interfața afișează starea neutru/verde „Stoc inițial stabilit", nu „plus de inventar" critic; finalizarea tot creează ajustările reale după aprobare.
- Fiecare apasare "Adauga" la numarare ramane ca intrare individuala in istoricul produsului din inventar. Cantitatea numarata de pe linie este suma intrarilor, nu ultima valoare tastata. Pentru intrebari de tip "cine a numarat?", "de unde vine diferenta?" sau "arata-mi toate cantaririle la zahar" foloseste `list_stock_count_sessions` -> `get_stock_count_session(includeEntries:true)`: vezi intrari, numarator, ora, sursa (mobil/web/import) si contributiile vechi agregate.
- Stergerea unei sesiuni de inventar din aplicatie curata si contributiile numaratorilor inainte de item-uri; daca un tenant inca primeste eroare 500 la stergere dupa numarare, trateaz-o ca build/deploy vechi sau incident de investigat, nu ca limitare functionala.

### Consum
- **Consum Zilnic** (`/daily-consumption`) — consumul automat de materii prime din comenzile finalizate; 4 taburi: Sumar Consum, Bonuri de Consum, Consum Temporar (produse vândute fără rețetă), Istoric Reprocesări. Tot aici e reprocesarea pe perioadă (job pe fundal) și meniul de remediere per produs.

### Furnizori & aprovizionare
- **Furnizorii Mei** (`/suppliers`) — lista furnizorilor tăi: adaugă/editează (CUI, contact, categorie, termen de livrare, cod analitic de tip 401.x), produsele furnizorului și chat.
- **Profil Furnizor** (`/suppliers/:id`) — fișa unui furnizor cu 6 taburi: Prezentare, Produse, Comenzi, Mesaje, Oferte, Aliasuri OCR (numele sub care apare produsul pe facturile lui).
- **Catalog Furnizor** (`/inventory/suppliers/:id/catalog`) — catalogul de produse al furnizorului: versiuni de catalog, import rânduri din PDF cu verificare, mapări la produsele interne (cu factor de conversie UM furnizor ↔ UM intern), configurarea trimiterii comenzilor și setările portalului de furnizor.
- **Furnizori Symbai** (`/symbai-suppliers`) — marketplace-ul furnizorilor conectați la platforma Symbai, de unde poți descoperi și comanda direct.
- **Recomandări Symbai** (`/symbai-recommendations`) — produse promovate și recomandate din cataloagele furnizorilor.
- **Hub Aprovizionare** (`/smart-ordering`) — „Smart Order Hub", centrul comenzilor de aprovizionare, cu 4 taburi: Comenzi (pipeline), Predicție & Planificare, Furnizori, Istoric Aprovizionare. Generează comenzi ciornă, apoi „Revizuire & Trimite". În dialogul **„Comandă Nouă"** alegi sus orizontul **„Comandă pentru N zile"**, iar fiecare produs (într-o **singură listă** „Toate produsele") arată o cantitate recomandată transparentă: **Min + (vânzări medii/zi × N zile) − stoc curent** (rotunjită la pachet/MOQ), cu calculul în tooltip. Aceeași formulă în „Predicție & Planificare" („plan inteligent").
  Când același produs intern are mai multe produse de catalog la același furnizor, Hub-ul afișează **Alege produse** și permite alegerea unui catalog sau împărțirea cantității pe mai multe linii. Badge-ul **Recomandat** ține cont de preț efectiv, MOQ/pachet și lead-time; lead-time-ul poate veni din istoricul real de recepții când există destule mostre, altfel din termenul promis.
- **Recomandări Aprovizionare** (`/procurement-recommendations`) — compararea prețurilor între furnizori: produse analizate, produse cu preț sub costul curent, economie potențială. Cere produse de furnizor asociate cu produsele din inventar.
- **Detaliu Comandă Furnizor** (`/purchase-orders/:id`, și `/inventory/purchase-orders/:id`) — fișa unei comenzi: status (ciornă, trimisă, acceptată, în pregătire, în livrare, livrată, recepționată, finalizată, anulată...), negociere de modificări cu furnizorul (acceptă/contra-propunere), recepția pe comandă, dispute și cronologia completă a evenimentelor; există auto-acceptare/respingere la expirarea termenului.

### Integrare Symbai Supplier & pagini publice
- **Punte Symbai Supplier** (`/integrations/symbai-supplier`) — conectarea POS-ului la platforma Symbai Supplier printr-un wizard în 3 pași (furnizorul acceptă cererea, fără copiere de token); apoi vezi entitățile sincronizate, jurnalul de sincronizare și erorile (dead-letter).
- **Portal Furnizor** (`/supplier-portal`, și `/supplier-portal/:supplierId`) — pagină publică unde furnizorul se autentifică cu ID-ul de furnizor + parolă și își gestionează comenzile primite, produsele, catalogul și chat-ul cu tine.
- **Înregistrare Furnizor** (`/supplier-register`) — pagină publică de înrolare a unui furnizor nou, pe bază de link cu token, în pași (date firmă, profil); cererea poate fi aprobată sau respinsă.

## Fluxuri frecvente

**1. Recepție marfă (factură → NIR → stoc)**
Factura intră pe una din cele 4 căi (eFactura/ANAF, poze cu OCR, push din contabilitate, manual) → verifici/aprobi mapările liniilor (pe factură sau centralizat în `/inventory/ai-review`) → în `/stock-entries`, tab Recepții (NIR): „Recepție Nouă", alegi factura sursă și depozitul → postezi NIR-ul → marfa intră în stoc pe loturi și se generează notele contabile.

**2. Transfer între gestiuni**
`/stock-operations` → Mișcări Stoc → operațiune de tip Transfer Între Gestiuni → alegi gestiunea sursă și destinație, produsele și cantitățile → postezi. Mișcarea apare în istoricul din `/stock-movements`.

**3. Inventariere (numărare fizică)**
`/inventory-check` -> tab Inventare -> "Inventar nou" (sesiune pe gestiuni; optional toate produsele, pe zone, pe taguri sau produse alese manual; optional data+ora reala pentru inventar retroactiv) -> lista se limiteaza la gestiunile alese si la produse numarabile -> echipa numara in aplicatie sau pe telefon la `/inventory-check/mobile/:sessionId` (cautare/scanner, sau link delegat pe produse/zone) -> tab Raport Diferente arata plusurile/minusurile fata de stocul asteptat la momentul sesiunii -> dupa aprobare (tab Aprobari), stocul se ajusteaza. Pentru audit din chat, `list_stock_count_sessions` gaseste sesiunea, iar `get_stock_count_session(includeEntries:true, onlyVariance:true)` arata fiecare intrare individuala si totalul pe linie. Linkul delegat pe zone se valideaza contra snapshot-ului sesiunii: daca zona nu are produse in inventarul curent, utilizatorul primeste mesaj clar si trebuie actualizat/refacut inventarul sau creata o sesiune noua, nu trimis un link gol.

**4. Fișă de ieșire (protocol, pierdere, casare)**
`/stock-exits` → tab Ieșiri → „Fișă ieșire nouă" → alegi tipul (consum, protocol, pierdere/casare etc. — tipuri configurabile tot de aici) → produse + cantități → postezi direct sau salvezi ca ciornă. Tipurile marcate „afectează P&L" intră la pierderi în rapoarte.

**5. Corectarea consumului după reparat rețetele**
`/daily-consumption` → buton „Reprocesare Vânzări" → alegi perioada (preseturi: 30 zile / 3 luni / 6 luni sau interval liber) → pornește un job pe fundal cu progres → la final verifici tabul Istoric Reprocesări. Rapoartele (P&L, food cost) reflectă recalculul.

**6. Produs vândut fără rețetă (Consum Temporar)**
`/daily-consumption` → tab Consum Temporar → la produs, meniul de remediere: „Creează rețetă nouă", „Asociază rețetă existentă", „Transformă în alt tip…" (ex. în marfă) sau rețetă generată cu AI → apoi „Reprocesează acest produs" ca să se descarce corect retroactiv.

**7. Comandă de aprovizionare**
`/smart-ordering` → „Generează Comenzi (Draft)" (din predicție/necesar) sau comandă manuală → revizuiești → rezolvi produsele cu **Alege produse** (un singur produs de catalog sau split pe mai multe linii) → „Confirmă & Trimite" (trimiterea e blocată dacă există produse fără cod de furnizor / fără alegere de catalog sau sub MOQ) → urmărești comanda în `/purchase-orders/:id` → la livrare înregistrezi recepția și eventualele dispute.

**7b. Necesar producție (MRP) → ciorne PO**
Pentru fabrici, folosește `create_purchase_orders_from_requirements(commit:false, mode:"strict")` ca preview al lipsurilor MRP transformate în comenzi furnizor: alege furnizori pe strategie, aplică MOQ/pachete și semnalează materiale nemapate/ambigue. După confirmarea explicită a userului, `commit:true` creează comenzi **DRAFT** idempotente; trimiterea către furnizor rămâne în `/smart-ordering` sau `/purchase-orders/:id`.

**7c. Rafturi și etichete QR pentru zone**
Verifici întâi structura cu `list_warehouses_full` și `list_storage_zones_full`. Pentru zone simple poți folosi `create_storage_zone` / `bulk_create_storage_zones`; pentru rack/bin-uri și print QR deschizi `/factory-floor-plan`, selectezi magazia/zona, **Vezi depozitul** → **Raft** sau **Etichete QR**. Scanarea unui QR deschide `/scan/zone/:id`, unde operatorul vede stocul live al zonei.

**8. Furnizor nou**
`/suppliers` → „Adaugă Furnizor Nou" (sau îi trimiți link de înregistrare publică `/supplier-register`) → îi încarci catalogul în `/inventory/suppliers/:id/catalog` (manual/import PDF) sau prin MCP cu `import_supplier_catalog_from_file` pentru Excel/CSV → mapezi produsele de catalog la produsele tale interne → poți comanda din Hub Aprovizionare; opțional îi activezi Portalul de Furnizor.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `list_warehouses_full` / `list_storage_zones_full` — gestiunile și zonele de depozitare.
- `get_warehouse_products_summary` — câte produse și pe ce categorii are o gestiune; apartenența include gestiunea-casă a produsului, linkurile product-warehouse și stocul real deja existent.
- `get_stock_levels` — stocul curent per produs; cu `warehouseId` întoarce doar produsele prezente/configurate în acea gestiune, nu tot catalogul cu 0.
- `get_semipreparate_stock` — stocul de semipreparate pe loturi, cu valabilitate.
- `get_material_requirements` — necesar MRP multi-nivel pentru producție, read-only; folosește-l înainte de a genera ciorne PO din lipsuri.
- `list_stock_count_sessions` — inventarele recente, status, gestiuni, progres, diferente si cate intrari de numarare are fiecare sesiune.
- `get_stock_count_session` — detaliul unei sesiuni: produse, asteptat vs numarat, diferente, intrari individuale (`includeEntries:true`) si contributii de numaratori. Foloseste `onlyVariance:true`, `search` si `limitItems` cand sesiunea e mare.
- `search_products_db` / `get_product_details` — căutare produse și detalii (gestiune, furnizor, rețetă).
- `list_suppliers` — furnizorii cu CUI, contact, categorie; tokenurile/parolele portalului și cheia marketplace sunt ascunse, iar IBAN-ul rămâne disponibil pentru operațiuni de plată.
- `analyze_procurement` — analiză aprovizionare: furnizori, prețuri, termene de livrare.
- `generate_report` — cu tipul `stock_value` (valoarea stocului la cost și la preț de vânzare) sau `food_cost`.
- `exec_trace_lot_origin` / `exec_trace_lot_destination` — trasabilitatea unui lot (de unde vine / unde a fost consumat).
- `jurnal_activitate` (categoria INVENTORY) — cine a făcut ce pe stoc: ajustări, ștergeri, modificări.

**Scriere (cer modulul de permisiune pe token):**
- Modul `produse_meniu`/`inventar`: `create_product`, `update_product`, `bulk_update_products` (inclusiv preț de achiziție, furnizor, TVA), `set_standard_costs` (cost provizoriu fără stoc), `create_warehouse`, `create_storage_zone`, `update_storage_zone`, `bulk_create_storage_zones`, `set_initial_stock` (stocul inițial al unui produs; dă `warehouseId` când produsul are/poate avea stoc în mai multe gestiuni).
- Modul `furnizori`: `create_supplier`, `update_supplier`, `create_supplier_product` (produs în catalogul furnizorului), `import_supplier_catalog_from_file` (catalog Excel/CSV în loturi), `create_supplier_product_mapping` (mapare produs catalog ↔ produs intern).
- Modul `productie`: `create_purchase_orders_from_requirements` creează ciorne PO din necesarul MRP după preview (`commit:false`) și confirmare (`commit:true`).
- Răspunsurile de la `create_supplier` / `update_supplier` nu întorc secretele de portal sau marketplace. Dacă userul vrea accesul furnizorului, folosește fluxul de portal/link/regenerare, nu căuta parola în date.

**SQL (doar-citire, cu acordul separat pe token):** `list_database_tables` → `describe_database_table` → `execute_sql_query`.

## Întrebări frecvente și capcane

- **De ce nu pot crea NIR-ul?** NIR-ul se creează doar legat de o factură sursă, iar toate liniile facturii trebuie să fie mapate pe produse interne. Verifică maparea în `/inventory/ai-review`.
- **Am introdus avizul — de ce nu a intrat marfa în stoc?** Recepția pe aviz intră marfa în stoc doar când documentul e postat; recepțiile rămase în ciornă nu mișcă stocul (le vezi în Avize & Draft și în bannerul din `/purchases`, de unde le poți posta). Iar avizul rămâne „neînchis" până îl legi de factura oficială în tabul Reconciliere.
- **De ce nu scade stocul când vând un produs?** Cel mai des: produsul nu are rețetă sau rețeta nu e legată de produs. Caută-l în `/daily-consumption`, tabul Consum Temporar, și folosește meniul de remediere, apoi „Reprocesează acest produs".
- **`set_initial_stock` îmi cere `warehouseId`.** Produsul are stoc real în mai multe gestiuni și sistemul nu ghicește. Citește gestiunile cu `list_warehouses_full` și stocul pe produs cu `get_stock_levels(productName)`, confirmă gestiunea cu utilizatorul, apoi reapelează `set_initial_stock(productId, quantity, warehouseId)`.
- **Vreau food cost înainte de prima recepție.** Folosește `set_standard_costs`, nu stoc fictiv și nu NIR inventat. Explică: e cost provizoriu pentru rapoarte, iar loturile reale din recepții vor avea prioritate.
- **Inventarul inițial îmi arată numai plusuri.** Dacă stocul așteptat era 0 peste tot, asta e normal la prima numărare; UI-ul o prezintă ca „stoc inițial stabilit". După aprobare, se creează ajustările reale.
- **De ce apar produse din alta gestiune in inventar?** Verifica daca inventarul a fost creat pe gestiunea corecta si daca produsele au stoc live acolo sau zona de depozitare asignata acelei gestiuni. Produsele nu trebuie incluse doar din mapari istorice; daca vezi produse fara stoc si fara zona in gestiunea inventariata, e o problema de scoping si trebuie investigata pe `stock_count_sessions`, `stock_count_items`, `warehouse_stock`, `storage_zones` si `products.storage_zone_id`.
- **De ce nu apare / nu se poate trimite o zona catre numarator?** Zona trebuie sa apartina uneia dintre gestiunile sesiunii si sa aiba produse in snapshot-ul inventarului. Daca zona a fost creata sau populata dupa pornirea inventarului, linkul pe zona intoarce mesajul ca zona nu are produse in acest inventar; actualizeaza/refa sesiunea sau creeaza un inventar nou, apoi retrimite linkul.
- **Cine a numarat cantitatea X la inventar?** Nu ghici din totalul liniei. Ruleaza `list_stock_count_sessions`, apoi `get_stock_count_session(sessionId, includeEntries:true)` si arata intrarile individuale cu numaratorul, ora si sursa. Daca exista doar contributii vechi agregate, spune clar ca sunt importate ca istoric legacy.
- **Am corectat rețetele, dar rapoartele arată tot vechiul food cost.** Corectarea rețetei nu rescrie trecutul — rulează Reprocesarea pe perioada afectată din `/daily-consumption`.
- **De ce diferă costul (COGS) de cel din rețetă?** Costul raportat e cel „realizat" — din loturile FIFO efectiv consumate, la prețurile lor reale de intrare — nu cel teoretic din rețetă.
- **Cantitate × preț nu bate cu totalul liniei de factură.** Normal la penalități/abonamente: valoarea totală a liniei e autoritară, recepția folosește totalul real.
- **De ce e blocată trimiterea comenzii către furnizor?** Există produse fără cod de furnizor, fără o alegere de catalog rezolvată sau sub MOQ. Dacă vezi **Alege produse**, nu e bug: același produs intern are mai multe opțiuni de catalog la furnizor și trebuie ales/split-uit înainte de draft/trimitere.
- **De ce nu văd Recomandări Aprovizionare?** E nevoie de produse de furnizor (cataloage) asociate cu produsele tale din inventar — fără mapări nu există ce compara. Dacă `list_procurement_recommendations` întoarce zero rezultate cu `pragConfigurate: 0`, problema este că lipsesc pragurile/stocurile minime de reaprovizionare, nu că stocul este sigur.
- **Pierderile apar în profit?** Doar tipurile de fișe de ieșire marcate că afectează P&L; poți avea și tipuri „neutre". Configurarea tipurilor e în `/stock-exits`.
- **Stoc absurd (negativ sau uriaș) la un ingredient?** Verifică unitățile de măsură: rețeta în grame/ml vs produsul în kg/l — conversia trebuie să fie corectă; după corectare, reprocesează perioada.
- **NIR-uri „uitate" în ciornă?** Bannerul din `/purchases` le arată și permite postarea în masă; și `/inventory/inbox-quality` semnalează NIR-urile ciornă mai vechi de 7 zile.
- **Marfa primită diferă de comandă/factură (lipsă, deteriorat, preț diferit)?** Se înregistrează ca diferențe la recepție — le vezi și le rezolvi în `/inventory/disputes` sau direct pe comanda din `/purchase-orders/:id`.

## Pentru acces SQL

Tabele relevante: `products`, `warehouses`, `storage_zones`, `warehouse_stock`, `inventory_lots`, `lot_balances`, `inventory_ledger`, `inventory_documents` + `inventory_document_lines` (NIR-uri, ieșiri, transferuri), `stock_count_sessions` + `stock_count_items` + `stock_count_entries` + `stock_count_contributions` (inventare si istoric numaratori), `stock_exit_types`, `daily_consumption_runs`, `consumption_reprocess_jobs`, `incoming_invoices` + `incoming_invoice_lines`, `mapping_rules`, `reception_notes`, `suppliers`, `supplier_products`, `supplier_product_aliases`, `supplier_price_history`, `purchase_orders` + `purchase_order_items` + `purchase_order_receptions`.

Exemple de întrebări: „valoarea stocului pe fiecare gestiune", „ce loturi expiră în următoarele 7 zile", „evoluția prețului de achiziție la un produs pe ultimele 6 luni, per furnizor".
