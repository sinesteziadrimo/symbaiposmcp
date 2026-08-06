# Stocuri, Inventar & Furnizori

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă tot drumul mărfii: intrarea (facturi de la furnizori → recepție/NIR), depozitarea (gestiuni, zone, loturi cu expirare), ieșirea (consum automat din vânzări, fișe de ieșire manuale, transferuri) și aprovizionarea (furnizori, cataloage, comenzi, recomandări de preț). Stocul se ține pe loturi. Descărcarea merge întotdeauna după **termenul de valabilitate**: iese primul lotul care expiră cel mai devreme, iar la termene egale (sau fără termen) iese primul cel intrat primul. Costul mărfii vândute se ia din loturile chiar consumate, la prețurile lor reale de intrare.

## Ghiduri detaliate

Acest fișier e harta modulului. Pentru subiectele mari există fișiere dedicate — mergi direct acolo:

- **`consum-zilnic-cost-marfa.md`** — când și cum scade stocul din vânzări, de unde vine costul mărfii vândute, recalcularea consumului și playbook-ul de diagnostic pentru „nu mi-a scăzut stocul" / „food cost aiurea".
- **`gestiuni-magazii-zone.md`** — ce e o gestiune, ce e o zonă, unde stă de fapt cantitatea, transferuri, deschiderea și închiderea unei gestiuni.
- **`mapare-si-reconversie-facturi.md`** — cum devine o linie de factură de furnizor stoc corect: potrivirea la produs, contul, factorul de pachet și ce învață sistemul.
- **`reconciliere-dubluri-facturi.md`** — cum eviți marfa intrată de două ori și facturile pierdute.

Pentru diagnostic pas cu pas există și skill-ul `verifica-consumul`.

## Concepte

- **Gestiune (magazie)** — depozitul logic în care stau produsele (ex. Bucătărie, Bar, Magazie centrală). Fiecare gestiune poate avea **zone de depozitare** (frigider, raft, congelator, cămară).
- **Magazie de consum** — gestiunea din care se descarcă ingredientul la vânzare. Se alege **pentru fiecare ingredient în parte**, în funcție de locația unde s-a vândut, în ordinea:
  1. regula manuală pusă pe produs pentru acea unitate (brand + locație) — **bate tot**;
  2. o gestiune a produsului aflată chiar în locația vânzării;
  3. gestiunea „de casă" a produsului (de pe fișa lui);
  4. gestiunea de bucătărie a locației (recunoscută după numele scris **fără diacritice**, ex. „Bucatarie"), altfel prima gestiune a locației.
  Dacă vrei certitudine, nu te baza pe pasul 4: setează explicit gestiunea produsului (`assign_product_warehouses`) sau gestiunea de casă (`update_product`). Detalii în `gestiuni-magazii-zone.md`.
- **NIR (recepția)** — documentul prin care marfa intră oficial în stoc. În pagina Intrări se creează doar legat de o factură sursă și doar după ce toate liniile facturii sunt mapate; la postare intră marfa în stoc și se generează automat notele contabile. (Pentru documente introduse pe loc există și recepția manuală — pe factură sau pe aviz — din Operațiuni Stoc.)
- **Recepție angajat (aviz înainte de factură, fără PO)** — este rezervată mărfii care nu aparține unei comenzi de furnizor. Cere dreptul real `stock_receive` și un context precis: brand + locație + gestiune, alese explicit; nu presupune niciodată „prima gestiune" a firmei. Dacă există un PO, recepția se face numai din **Detaliu Comandă Furnizor** / fluxul canonic `receive_purchase_order`, ca să fie actualizate cantitățile primite și statusul comenzii; nu atașa manual PO-ul unui aviz, fiindcă ai putea permite o recepție dublă. Numărul scris pe avizul furnizorului rămâne referință externă; aplicația alocă separat numărul intern consecutiv al documentului. Dacă unitatea nu corespunde rolului angajatului, recepția este refuzată înainte să se salveze ceva; documentul, liniile și eventualele note se creează împreună, nu parțial.
- **Mapare** — legarea unei linii de factură de un produs intern + un cont contabil. AI-ul propune, operatorul confirmă, iar sistemul învață regula **furnizor + descriere normalizată → produs + cont de mapare + factor**: aceeași descriere de la același furnizor se poate mapa automat. Regula confirmată nu devine automat valabilă la alți furnizori.
- **Aviz de însoțire** — document de primire pentru marfa sosită înaintea facturii oficiale. Recepția pe aviz intră marfa în stoc la postare, iar avizul rămâne „neînchis" în Avize & Draft până îl legi de e-Factura corespunzătoare, în tabul Reconciliere.
- **Lot / FEFO** — stocul se ține pe loturi cu dată de expirare. La orice ieșire (vânzare, producție, ieșire manuală) sistemul alege lotul cu **termenul cel mai apropiat**; dacă mai multe loturi expiră la fel sau n-au termen, iese cel intrat primul. Costul vânzării (COGS) vine din loturile reale consumate.
  ⚠ **„Metoda de evaluare" din Setări → Stocuri (FIFO / LIFO / medie) NU schimbă din ce lot iese marfa** — ea influențează doar costul estimativ afișat înainte de a exista consum real. Ordinea fizică de descărcare rămâne mereu „expiră primul".
- **Cost standard provizoriu** — cost estimativ pe produs folosit ca fallback în food cost când încă nu există loturi/recepții reale. Nu creează stoc, nu schimbă CMP și nu ține loc de NIR; prima recepție reală îl umbrește.
- **Consum zilnic** — scăderea automată a materiei prime din vânzări: produs vândut → rețetă → ingredientele scad din stoc; produsele fără rețetă (marfă) se descarcă direct ca atare. **Nu se întâmplă în secunda vânzării**: o dată pe zi, automat, sistemul ia bonurile **închise** din zilele încheiate și scade ingredientele. **Ziua curentă se procesează abia a doua zi.** Dacă o zi a fost sărită (server oprit, zi blocată), sistemul o recuperează singur în următoarele câteva zile. **Excepție: comenzile de livrare (Glovo/Wolt/Bolt/Tazz) scad stocul imediat ce comanda e livrată.**
  Ce vezi pe ecran ca „stoc live" în timpul zilei = stocul de pe documente **minus** consumul estimat al zilei curente, calculat din bonurile deja trimise la bucătărie. Tot detaliul e în `consum-zilnic-cost-marfa.md`.
- **Scădere automată din stoc (Auto Deplete)** — comutatorul general din Setări → Stocuri. Dacă e oprit, **nu se generează și nu se recalculează niciun consum**, oricâte vânzări ai avea, și nu primești eroare. E prima verificare la „nu-mi scade stocul deloc, la niciun produs".
- **Lună închisă contabil** — după închiderea unei luni, consumul acelei perioade nu se mai poate genera și nici recalcula. Trebuie redeschisă din Finanțe, apoi reînchisă.
- **Reprocesare consum** — recalculează consumul și costurile pe o perioadă (ex. după ce ai corectat rețete); rulează ca job pe fundal, cu progres vizibil, și există și reprocesare pe un singur produs.
- **Fișă de ieșire** — document de ieșire manuală din stoc: consum, protocol, pierdere/casare, furt, minus de inventar, retur; tipurile sunt configurabile, fiecare cu marcaj dacă afectează sau nu P&L-ul.
- **Inventar (sesiune de numărare)** — numeri fizic stocul (inclusiv de pe telefon), iar sistemul produce raportul de diferențe (plus/minus de inventar) care, după aprobare, ajustează stocul.
- **Comandă furnizor** — comanda de aprovizionare trimisă unui furnizor, cu ciclu complet: ciornă → trimisă → acceptată/respinsă (eventual cu modificări și contra-propuneri) → în pregătire → în livrare → livrată → recepție → finalizată.
- **Catalog furnizor** — lista de produse a unui furnizor cu prețuri, coduri și cantități minime; produsele de catalog se mapează la produsele tale interne pentru aprovizionare automată.
- **Conversie de pachet** — ex. „bax" = 24 bucăți; se învață din facturi și se reaplică automat la recepțiile următoare. Detaliile (când sistemul refuză și îți cere factorul, cum corectezi un factor învățat greșit) sunt în `mapare-si-reconversie-facturi.md`.

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
- Cand pornesti un inventar pe una sau mai multe gestiuni, lista de numarat trebuie sa fie limitata la acele gestiuni: intra produsele cu stoc live in gestiunea aleasa si produsele stocabile care au zona de depozitare asignata in acea gestiune, inclusiv daca stocul lor este 0. Nu se includ produse doar pentru ca au fost candva asociate acelei gestiuni (mapare istorica).
- Inventarul poate fi retroactiv: in dialogul "Inventar nou" setezi data si ora reala a numararii. Stocul asteptat se reconstruieste pentru acel moment din miscarile de stoc (dupa data documentului), iar diferentele se judeca fata de acel stoc, nu fata de stocul live de azi. Nu folosi date viitoare; "Actualizeaza Stocuri" pastreaza acelasi moment de referinta.
- Produsele nestocabile si tipurile de produs marcate ca nu tin stoc nu se numara. In Zone & Amplasare, la "Adauga produse" apar doar produse stocabile fizic; produsele finite (preparate din retete) nu se adauga ca produse de depozitare.
- În Zone & Amplasare există butonul `X` pe rândul unui produs din zonă: scoate produsul din zona de depozitare, dar NU șterge produsul și NU mișcă stocul. Produsul rămâne în magazie/stoc și reapare la „produse fără zonă", de unde poate fi re-amplasat. Pentru mutare fizică între gestiuni folosești document de transfer, nu acest buton.
- **Un produs poate fi amplasat în MAI MULTE zone deodată** („un produs în mai multe frigidere"): apartenența multi-zonă e pentru numărare/organizare — produsul apare la inventar în fiecare zonă în care e amplasat (inclusiv zone din gestiuni diferite, la Inventariere Nouă), dar **stocul rămâne unul singur, global pe gestiune**. Prin MCP: `assign_product_storage_zones`.
- La "Produse alese manual", cautarea si filtrele respecta gestiunile inventarului. Poti filtra dupa cautare text, tag, furnizor, tip produs si TVA; "Select all" si "Deselect all" actioneaza doar pe rezultatul filtrat curent (ex. cauti "bere" si selectezi toate berile gasite).
- Butonul de trimitere de langa "Inventar Mobil" creeaza link pentru un numarator. Poti aloca produse filtrate sau una/mai multe zone de depozitare, poti trimite prin WhatsApp/email sau copia linkul, si poti decide daca numaratorul are voie sa caute produse extra. In modal apar doar numele zonelor de depozitare, fara repetarea gestiunii; zonele adaugate dupa pornirea inventarului sunt eligibile daca apartin gestiunilor inventarului.
- Linkul delegat contine `shareToken` si este gandit pentru acces fara login. Daca trebuie dovada vizuala sau un client spune ca numaratorul ajunge la login, deschide linkul intr-o sesiune de browser nelogata (ex. fereastra incognito) si arata pagina mobila de numarare, nu Dashboard-ul.
- Persoana care intra pe linkul mobil vede doar produsele sau zonele primite. Daca "poate numara si alte produse" este activ, cautarea extra ramane limitata la gestiunea aleasa si la produse numarabile.
- Pe mobil, căutarea/scannerul caută în nume, SKU, barcode și EAN. Dacă ai importat retail fără aceste coduri pe produs, scanarea nu are ce potrivi ulterior.
- La inventarul inițial unde toate cantitățile așteptate sunt 0, interfața afișează starea neutru/verde „Stoc inițial stabilit", nu „plus de inventar" critic; finalizarea tot creează ajustările reale după aprobare.
- Fiecare apasare "Adauga" la numarare ramane ca intrare individuala in istoricul produsului din inventar. Cantitatea numarata de pe linie este suma intrarilor, nu ultima valoare tastata. Pentru intrebari de tip "cine a numarat?", "de unde vine diferenta?" sau "arata-mi toate cantaririle la zahar" foloseste `list_stock_count_sessions` -> `get_stock_count_session(includeEntries:true)`: vezi intrari, numarator, ora, sursa (mobil/web/import) si contributiile vechi agregate.
- Stergerea unei sesiuni de inventar din aplicatie curata automat si intrarile numaratorilor. Daca stergerea da totusi o eroare, nu e o limitare a platformei — trimite un ticket de suport (`trimite_ticket_symbai`).

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
- **Punte Symbai Supplier** (`/integrations/symbai-supplier`) — conectarea POS-ului la platforma Symbai Supplier printr-un wizard în 3 pași (furnizorul acceptă cererea, fără copiere de token); apoi vezi entitățile sincronizate, jurnalul de sincronizare și erorile rămase nerezolvate.
- **Portal Furnizor** (`/supplier-portal`, și `/supplier-portal/:supplierId`) — pagină publică unde furnizorul se autentifică cu ID-ul de furnizor + parolă și își gestionează comenzile primite, produsele, catalogul și chat-ul cu tine.
- **Înregistrare Furnizor** (`/supplier-register`) — pagină publică de înrolare a unui furnizor nou, pe bază de link cu token, în pași (date firmă, profil); cererea poate fi aprobată sau respinsă.

## Fluxuri frecvente

**1. Recepție marfă (factură → NIR → stoc)**
Factura intră pe una din cele 4 căi (eFactura/ANAF, poze cu OCR, push din contabilitate, manual) → verifici/aprobi mapările liniilor (pe factură sau centralizat în `/inventory/ai-review`) → în `/stock-entries`, tab Recepții (NIR): „Recepție Nouă", alegi factura sursă și depozitul → postezi NIR-ul → marfa intră în stoc pe loturi și se generează notele contabile.

Pentru marfa sosită pe o comandă de furnizor, deschizi **Detaliu Comandă Furnizor** și folosești recepția acelei comenzi; acesta este singurul flux care actualizează sigur cantitățile și statusul PO. Pentru marfa sosită numai cu aviz și **fără PO**, folosești „Recepție angajat" și alegi explicit unitatea și gestiunea. Dacă apare „nu ai acces la gestiune/sursa nu s-a încărcat", nu schimba stocul și nu alege altă gestiune la întâmplare: verifică rolul (`stock_receive`) și contextul unității, apoi reîncarcă.

**Ștergerea unei facturi care are NIR postat nu este doar o ștergere contabilă.** Anularea NIR-ului inversează loturi, ledger, stoc și note contabile, deci cere autoritate de recepție/aprobare (`stock_receive` sau `po_approve`) pe unitatea documentului, pe lângă dreptul de a modifica factura. Fără această autoritate, opțiunea de anulare a NIR-ului nu trebuie oferită, iar factura legată rămâne păstrată și este raportată ca omisă. Nu spune clientului că s-a șters și nu compensa printr-o ajustare de stoc. Dacă o notă de diferență a recepției a ajuns în stare finală (rezolvată, respinsă sau anulată), nu îi rescrie autorul ori rezoluția: identitatea vine din utilizatorul autentificat, iar corecția se face printr-un flux nou, auditabil.

**1b. Același flux, complet din chat (e-Factura → NIR prin MCP)** — pentru „adu-mi facturile noi din SPV și bagă-le pe stoc":
`check_new_efactura` (ce facturi sunt în SPV ANAF și care-s NOI) → `import_efactura` (le descarcă și le creează cu linii, detectează unitatea, auto-mapează liniile sigure) → `auto_map_efactura(invoiceId)` (agentul AI de mapare pe liniile rămase) → `get_invoice_intake_decision` (verdict: e gata de NIR automat sau ce anume trebuie întrebat — locație ambiguă, linii nemapate) → `create_nir_from_invoice(invoiceId, confirm:true)` = intrarea pe stoc + notele contabile. Pentru rulare autonomă periodică există orchestratorul `process_new_efactura` (verifică → importă → creează NIR doar la facturile 100% sigure; restul rămân la decizie umană). Toate cer modulul `inventar` pe token; nu inventa mapări — ce nu e sigur se întreabă.

**2. Transfer între gestiuni**
`/stock-operations` → Mișcări Stoc → operațiune de tip Transfer Între Gestiuni → alegi gestiunea sursă și destinație, produsele și cantitățile → postezi. Mișcarea apare în istoricul din `/stock-movements`.

**3. Inventariere (numărare fizică)**
`/inventory-check` -> tab Inventare -> "Inventar nou" (sesiune pe gestiuni; optional toate produsele, pe zone, pe taguri sau produse alese manual; optional data+ora reala pentru inventar retroactiv) -> lista se limiteaza la gestiunile alese si la produse numarabile -> echipa numara in aplicatie sau pe telefon la `/inventory-check/mobile/:sessionId` (cautare/scanner, sau link delegat pe produse/zone) -> tab Raport Diferente arata plusurile/minusurile fata de stocul asteptat la momentul sesiunii -> dupa aprobare (tab Aprobari), stocul se ajusteaza. Pentru audit din chat, `list_stock_count_sessions` gaseste sesiunea, iar `get_stock_count_session(includeEntries:true, onlyVariance:true)` arata fiecare intrare individuala si totalul pe linie. Linkul delegat pe zone se valideaza contra snapshot-ului sesiunii: daca zona nu are produse in inventarul curent, utilizatorul primeste mesaj clar si trebuie actualizat/refacut inventarul sau creata o sesiune noua, nu trimis un link gol.

**3b. Inventar numărat pe hârtie/Excel, încărcat prin conexiune**
Când numărătoarea s-a făcut deja în afara aplicației (foi, alt sistem, export Excel), nu mai e nevoie s-o tastezi linie cu linie: `apply_physical_inventory` face pe o gestiune exact ce ai face din ecranul Inventariere — creează sesiunea, scrie cantitățile numărate, **pune automat pe 0 tot ce nu apare în lista ta** și finalizează, astfel încât stocul gestiunii devine exact lista dată. Documentele de ajustare poartă `countDate`, deci un inventar numărat pe 1 august și încărcat pe 6 august rămâne datat 1 august. O gestiune per apel. Rulează întâi `preview_physical_inventory` cu ACEEAȘI listă: îți arată diferența pe fiecare produs, ce s-ar pune pe 0 și ce coduri din listă nu s-au potrivit pe niciun produs. Dacă vrei un inventar PARȚIAL (numai o parte din gestiune), trimite `unlisted:'keep'` — atunci produsele din afara listei rămân neatinse.

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

**Citire (read-only; cere grantul `readModule` al domeniului pe token):**
- `list_warehouses_full` / `list_storage_zones_full` — gestiunile și zonele de depozitare.
- `get_warehouse_products_summary` — câte produse și pe ce categorii are o gestiune; apartenența include gestiunea-casă a produsului, linkurile product-warehouse și stocul real deja existent.
- `get_stock_levels` — stocul curent per produs; cu `warehouseId` întoarce doar produsele prezente/configurate în acea gestiune, nu tot catalogul cu 0.
- `list_lots` — loturile unui produs/gestiuni, în **ordinea reală de descărcare** (expiră primul). Se pagineaza (`offset`, `hasMore`) și se poate filtra pe `expiresBefore`, `status`, `onlyAvailable`, cu `orderBy` schimbat când vrei altă ordine.
- `get_daily_consumption_status` — dacă s-a generat consumul pentru o zi. Cu `dateFrom` + `dateTo` verifică un interval întreg și îți întoarce în `missingDates[]` exact zilele fără consum generat.
- `get_reprocess_job_status` — progresul unei recalculări pornite pe perioadă, plus avertismentele de la final.
- `scan_zero_cost_sold` — produse vândute cu cost 0 (rețetă fără preț, lot intrat cu cost 0).
- `scan_suspect_recipe_costs` / `scan_suspect_reception_costs` — rețete și recepții cu costuri improbabile; punctul de plecare la „food cost aiurea".
- `scan_recipe_unit_mismatches` — ingredientele cu unitate netraductibilă în unitatea produsului (cauza clasică de „stoc absurd"); remediul automat e `fix_recipe_unit_mismatches` 🔒 (modul `inventar`).
- `get_product_reception_history` — la ce prețuri a intrat efectiv un produs, recepție cu recepție.
- `list_unreceived_goods` — marfă vândută/consumată pentru care nu există recepție înregistrată.
- `scan_unzoned_products` / `scan_storage_zone_issues` — produse vândute fără zonă de depozitare (ajung la „Necategorizat" în rapoarte) și neregulile din zone (nume duplicate, zone goale).
- `get_semipreparate_stock` — stocul de semipreparate pe loturi, cu valabilitate.
- `preview_physical_inventory` — simularea unui inventar încărcat dintr-o listă de cantități numărate: diferența pe fiecare produs, ce ar ajunge pe 0 și ce coduri din listă nu s-au potrivit. Nu creează sesiune și nu schimbă nimic.
- `get_material_requirements` — necesar MRP multi-nivel pentru producție, read-only; folosește-l înainte de a genera ciorne PO din lipsuri.
- `list_stock_count_sessions` — inventarele recente, status, gestiuni, progres, diferente si cate intrari de numarare are fiecare sesiune.
- `get_stock_count_session` — detaliul unei sesiuni: produse, asteptat vs numarat, diferente, intrari individuale (`includeEntries:true`) si contributii de numaratori. Foloseste `onlyVariance:true`, `search` si `limitItems` cand sesiunea e mare.
- `search_products_db` / `get_product_details` — căutare produse și detalii (gestiune, furnizor, rețetă).
- `list_suppliers` — furnizorii cu CUI, contact, categorie; tokenurile/parolele portalului și cheia marketplace sunt ascunse, iar IBAN-ul rămâne disponibil pentru operațiuni de plată.
- `analyze_procurement` — analiză aprovizionare: furnizori, prețuri, termene de livrare.
- `generate_report` — cu tipul `stock_value` (valoarea stocului la cost și la preț de vânzare, pe poziții produs–gestiune și cu scope explicit) sau `food_cost`. Dacă există poziții cu cost lipsă/zero, totalul la cost este incomplet/null, iar subtotalul cunoscut este doar diagnostic.
- `exec_trace_lot_origin` / `exec_trace_lot_destination` — trasabilitatea unui lot (de unde vine / unde a fost consumat).
- `jurnal_activitate` (categoria INVENTORY) — cine a făcut ce pe stoc: ajustări, ștergeri, modificări.

**Scriere (cer modulul de permisiune pe token):**
- Modul `produse_meniu`/`inventar`: `create_product`, `update_product`, `bulk_update_products` (inclusiv preț de achiziție, furnizor, TVA), `set_standard_costs` (cost provizoriu fără stoc), `create_warehouse`, `create_storage_zone`, `update_storage_zone`, `bulk_create_storage_zones`, `set_initial_stock` (stocul inițial al unui produs; dă `warehouseId` când produsul are/poate avea stoc în mai multe gestiuni).
- Modul `furnizori`: `create_supplier`, `update_supplier`, `create_supplier_product` (produs în catalogul furnizorului), `import_supplier_catalog_from_file` (catalog Excel/CSV în loturi), `create_supplier_product_mapping` (mapare produs catalog ↔ produs intern).
- Modul `productie`: `create_purchase_orders_from_requirements` creează ciorne PO din necesarul MRP după preview (`commit:false`) și confirmare (`commit:true`).
- Modul `inventar` — gestiuni și zone: `assign_product_warehouses` (leagă produse de una sau mai multe gestiuni; cu `mode:'replace'` cere `confirm:true` când ar șterge legături existente, iar fără confirmare îți arată întâi ce s-ar pierde), `assign_product_storage_zones` (amplasare în mai multe zone, pentru numărat), `update_warehouse` (redenumire, tag, activare/dezactivare), `rename_storage_zone`, `merge_storage_zones` 🔒, `delete_empty_storage_zone`.
- Modul `inventar` — inventar fizic: `apply_physical_inventory` 🔒 încarcă pe o gestiune o listă de cantități numărate și o finalizează, punând pe 0 tot ce nu apare în listă (vezi fluxul 3b). Confirm-first: fără `confirm:true` întoarce doar previzualizarea. Cere `reason` — motivul scris ajunge în audit, fiindcă lipsurile se atribuie pe lot fără scanarea recipientelor. Ireversibil după finalizare: arată-i utilizatorului cifrele din preview înainte.
- Modul `inventar` — trasabilitate lot: `update_inventory_lot_traceability` corectează lotul furnizorului și/sau expirarea unui lot existent sub blocare și cu jurnal de audit. Citește lotul înainte, trimite doar câmpurile schimbate și recitește după; nu folosi o actualizare generică de produs, fiindcă lotul și produsul sunt entități diferite.
- Modul `inventar` — consum: `generate_daily_consumption` 🔒 generează consumul unei zile. ⚠ `warehouseId` **nu e filtru** — e doar gestiunea de rezervă pentru ingredientele fără gestiune configurată; generarea acoperă toate gestiunile. Dacă ziua e deja generată, tool-ul refuză; ștergerea unei rulări se face din `/daily-consumption`.
- Modul `financiar`: `reprocess_daily_consumption` 🔒 (recalcularea consumului pe o perioadă, ca job pe fundal — urmărește-l cu `get_reprocess_job_status`) și `fix_reception_costs` 🔒 (corectarea costului unor loturi intrate greșit; după ea recalcularea perioadei e obligatorie ca rapoartele să se schimbe).
- Răspunsurile de la `create_supplier` / `update_supplier` nu întorc secretele de portal sau marketplace. Dacă userul vrea accesul furnizorului, folosește fluxul de portal/link/regenerare, nu căuta parola în date.

**SQL (doar-citire, cu acordul separat pe token):** `list_database_tables` → `describe_database_table` → `execute_sql_query`.

## Întrebări frecvente și capcane

- **De ce nu pot crea NIR-ul?** NIR-ul se creează doar legat de o factură sursă, iar toate liniile facturii trebuie să fie mapate pe produse interne. Verifică maparea în `/inventory/ai-review`.
- **Am introdus avizul — de ce nu a intrat marfa în stoc?** Recepția pe aviz intră marfa în stoc doar când documentul e postat; recepțiile rămase în ciornă nu mișcă stocul (le vezi în Avize & Draft și în bannerul din `/purchases`, de unde le poți posta). Iar avizul rămâne „neînchis" până îl legi de factura oficială în tabul Reconciliere.
- **De ce nu scade stocul când vând un produs?** Cinci cauze, în ordinea frecvenței:
  1. **consumul zilei nu s-a generat încă** — scăderea nu e instantanee, se face o dată pe zi pentru zilele încheiate, deci vânzarea de azi se vede mâine (livrările fac excepție, scad imediat). Verifici cu `get_daily_consumption_status`;
  2. **bonul e încă deschis** — o masă neînchisă nu consumă niciodată;
  3. **metoda de plată e configurată să nu genereze consum** (ex. „consum intern") — Setări → Metode de plată;
  4. **produsul n-are rețetă sau rețeta nu e legată de el** — îl găsești în `/daily-consumption`, tab Consum Temporar; folosește meniul de remediere, apoi „Reprocesează acest produs";
  5. **„Scădere automată din stoc" e oprită** din Setări → Stocuri — atunci nu se generează nimic, la niciun produs, și nu primești eroare.
  Pas cu pas: `consum-zilnic-cost-marfa.md` și skill-ul `verifica-consumul`.
- **Raportul de stoc spune că o sursă nu a putut fi încărcată. Înseamnă că stocul este zero?** Nu. O eroare de sursă sau de permisiune nu este valoare zero și nu dovedește că lipsesc datele. Identifică exact sursa care a eșuat, verifică răspunsul și rolul utilizatorului, apoi confirmă independent cu `get_stock_levels` sau `get_warehouse_products_summary`. Dacă citirea MCP este sănătoasă, dar ecranul eșuează, păstrează mesajul exact și deschide ticket tehnic; nu modifica stocul ca să „repari” raportul. După remediere, reîncarcă raportul și reconciliază totalul cu gestiunile.
- **Raportul de valoare întoarce `null`, `valuationComplete:false` sau `missingCosts`. Este stocul fără valoare?** Nu. Cel puțin o poziție produs–gestiune are cantitate nenulă, dar nu are cost mediu demonstrabil. Raportul nu inventează zero și nu mută toată cantitatea în gestiunea de casă a produsului. Folosește `knownStockValueAtCost` numai ca subtotal diagnostic, citește lista exactă de poziții lipsă, repară recepția/lotul corect și repetă raportul; abia un rezultat complet poate fi comunicat drept „valoarea totală a stocului".
- **`set_initial_stock` îmi cere `warehouseId`.** Produsul are stoc real în mai multe gestiuni și sistemul nu ghicește. Citește gestiunile cu `list_warehouses_full` și stocul pe produs cu `get_stock_levels(productName)`, confirmă gestiunea cu utilizatorul, apoi reapelează `set_initial_stock(productId, quantity, warehouseId)`.
- **Vreau food cost înainte de prima recepție.** Folosește `set_standard_costs`, nu stoc fictiv și nu NIR inventat. Explică: e cost provizoriu pentru rapoarte, iar loturile reale din recepții vor avea prioritate.
- **Inventarul inițial îmi arată numai plusuri.** Dacă stocul așteptat era 0 peste tot, asta e normal la prima numărare; UI-ul o prezintă ca „stoc inițial stabilit". După aprobare, se creează ajustările reale.
- **De ce apar produse din alta gestiune in inventar?** Verifica daca inventarul a fost creat pe gestiunea corecta si daca produsele au stoc live acolo sau zona de depozitare asignata acelei gestiuni. Produsele nu trebuie incluse doar din mapari istorice; daca vezi produse fara stoc si fara zona in gestiunea inventariata, e o problema de delimitare a inventarului — investigheaz-o prin accesul SQL doar-citire (descopera tabelele de inventar cu `list_database_tables`) sau trimite un ticket de suport.
- **De ce nu apare / nu se poate trimite o zona catre numarator?** Zona trebuie sa apartina uneia dintre gestiunile sesiunii si sa aiba produse in snapshot-ul inventarului. Daca zona a fost creata sau populata dupa pornirea inventarului, linkul pe zona intoarce mesajul ca zona nu are produse in acest inventar; actualizeaza/refa sesiunea sau creeaza un inventar nou, apoi retrimite linkul.
- **Cine a numarat cantitatea X la inventar?** Nu ghici din totalul liniei. Ruleaza `list_stock_count_sessions`, apoi `get_stock_count_session(sessionId, includeEntries:true)` si arata intrarile individuale cu numaratorul, ora si sursa. Daca exista doar contributii vechi agregate, spune clar ca sunt importate ca istoric legacy.
- **Am corectat rețetele, dar rapoartele arată tot vechiul food cost.** Corectarea rețetei nu rescrie trecutul — rulează Reprocesarea pe perioada afectată din `/daily-consumption`.
- **De ce diferă costul (COGS) de cel din rețetă?** Costul raportat e cel „realizat" — din loturile efectiv consumate (expiră primul), la prețurile lor reale de intrare — nu cel teoretic din rețetă. Și comenzile de livrare finalizate descarcă loturi imediat; o corecție istorică ajunge la ele prin reprocesarea intervalului (vezi `consum-zilnic-cost-marfa.md`).
- **Cantitate × preț nu bate cu totalul liniei de factură.** Normal la penalități/abonamente: valoarea totală a liniei e autoritară, recepția folosește totalul real.
- **Pot folosi o ajustare minus cu cost 0 ca să scad doar cantitatea și să păstrez valoarea lotului?** Nu. O ajustare negativă scoate cantitate din loturile existente în ordinea normală de descărcare și reduce valoarea la costul real al acelor loturi. `unitCost: 0` pe ieșire nu înseamnă „păstrează valoarea" și nu reevaluează marfa rămasă. Dacă recepția a avut greșită cantitatea, ambalarea sau greutatea netă, corectează/stornează documentul-sursă prin fluxul controlat și verifică din nou cantitatea **și** valoarea; nu folosi ajustarea minus ca scurtătură de preț. Dacă numai costul unitar al unei recepții verificate este greșit, pornește cu preview-ul `fix_reception_costs`, confirmă documentul și perioada contabilă, apoi reprocesează consumul afectat. Nu executa o corecție fiscală doar dintr-un calcul presupus.
- **Lotul furnizorului sau expirarea au fost introduse greșit.** Corectează lotul exact cu `update_inventory_lot_traceability`, apoi verifică readback-ul și jurnalul. Nu crea un lot nou și nu muta artificial cantitatea: ai rupe genealogia recepției și traseul de recall.
- **De ce e blocată trimiterea comenzii către furnizor?** Există produse fără cod de furnizor, fără o alegere de catalog rezolvată sau sub MOQ. Dacă vezi **Alege produse**, nu e bug: același produs intern are mai multe opțiuni de catalog la furnizor și trebuie ales/split-uit înainte de draft/trimitere.
- **De ce nu văd Recomandări Aprovizionare?** E nevoie de produse de furnizor (cataloage) asociate cu produsele tale din inventar — fără mapări nu există ce compara. Dacă `list_procurement_recommendations` întoarce zero rezultate cu `pragConfigurate: 0`, problema este că lipsesc pragurile/stocurile minime de reaprovizionare, nu că stocul este sigur.
- **De unde vin alertele de stoc (Critic / Scăzut / Suprastoc)?** Din pragurile pe produs×gestiune: fiecare produs are stoc minim (și opțional maxim) pe gestiune, iar alertele se declanșează procentual față de ele — implicit Critic sub 10% din minim (sau stoc 0), Scăzut sub 25%, Suprastoc peste 150% din maxim; procentele se pot ajusta din setările de inventar. Notificările ajung la administratori/manageri/gestionari. Fără stoc minim setat pe produs, alerta apare doar la stoc 0.
- **Pierderile apar în profit?** Doar tipurile de fișe de ieșire marcate că afectează P&L; poți avea și tipuri „neutre". Configurarea tipurilor e în `/stock-exits`.
- **Stoc absurd (negativ sau uriaș) la un ingredient?** Două cauze, la fel de frecvente. (1) **Unitățile de măsură**: rețeta în grame/ml vs produsul în kg/l — conversia trebuie să fie corectă; între familii diferite (grame pe un produs ținut la bucată) traducerea nu se poate face și cantitatea se ia ca atare. (2) **Randamentul rețetei** — cifra din câmpul „Randament" împarte toate cantitățile, deci un randament pus din greșeală face consumul de câteva ori mai mic. După corectare, reprocesează perioada.
- **Ecranul Stocuri îmi arată produsul o singură dată, cu totalul.** Așa e conceput: ecranul principal grupează produsul sub gestiunea lui de casă și afișează **totalul pe toate gestiunile**. Pentru cantitatea pe fiecare gestiune folosește `get_stock_levels(warehouseId)` sau pagina de depozit (Plan Fabrică 2D → Vezi depozitul). Detalii în `gestiuni-magazii-zone.md`.
- **NIR-uri „uitate" în ciornă?** Bannerul din `/purchases` le arată și permite postarea în masă; și `/inventory/inbox-quality` semnalează NIR-urile ciornă mai vechi de 7 zile.
- **Marfa primită diferă de comandă/factură (lipsă, deteriorat, preț diferit)?** Se înregistrează ca diferențe la recepție — le vezi și le rezolvi în `/inventory/disputes` sau direct pe comanda din `/purchase-orders/:id`.
- **„Recepționat de" ≠ autorul operației.** Numele completat în recepție identifică persoana care a primit fizic marfa; câmpurile de audit „creat/confirmat/rezolvat de" vin din contul autentificat și nu pot fi înlocuite din formular. Când explici istoricul, spune separat cine a declarat recepția și cine a executat acțiunea în aplicație.

## Pentru acces SQL

Dacă tokenul are activat accesul SQL (doar-citire), descoperă întâi structura cu `list_database_tables` → `describe_database_table`, apoi interoghează cu `execute_sql_query`. Găsești tabele pentru produse, gestiuni și zone, loturi și mișcări de stoc, documente de intrare/ieșire (NIR-uri, transferuri), sesiuni de inventar cu intrările de numărare, facturi de intrare cu liniile lor, furnizori cu cataloage și istoric de prețuri, și comenzi de aprovizionare.

Exemple de întrebări: „valoarea stocului pe fiecare gestiune", „ce loturi expiră în următoarele 7 zile", „evoluția prețului de achiziție la un produs pe ultimele 6 luni, per furnizor".
