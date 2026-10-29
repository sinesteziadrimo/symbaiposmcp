# POS la masă — plan de sală, comenzi, ospătari și plăți

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă serviciul la masă: planul de sală (desenat în designer, afișat live), interfața POS Mobil pentru ospătari/bar/recepție, notele meselor și operațiile pe ele (transfer, reducere, retur, split, partajare), plățile (numerar, card Viva, card Global Payments, mixt, bacșiș), comenzile clienților venite prin QR de la masă și raportul de tură al fiecărui ospătar. Bonul fiscal se tipărește automat după confirmarea plății.

## Concepte

- **Masă** — o poziție în planul de sală. Poate fi liberă, ocupată sau cu notă deschisă. Mesele au „lacăt": dacă alt ospătar lucrează pe o masă, o vezi blocată.
- **Notă / Comandă** — ce a comandat masa: produse, cantități, prețuri, eventual reduceri. Produsele se pot grupa pe **fel/curs** (felul 1, felul 2…) și **per client/scaun**; cantitățile pot fi și fracționare/zecimale (ex. 0,5) și apar la fel în POS, la împărțirea notei și pe previzualizarea notei.
- **Persoane la masă** — ospătarul poate grupa produsele pe persoane/scaune și poate lega o persoană de un client real din portal/CRM. Grupul comun rămâne **Comune masă** și nu se leagă de client. La încasarea pe persoană, plata poartă metadatele persoanei și actualizează istoricul/loialitatea clientului legat; la ștergerea unei persoane, produsele ei trec înapoi la **Comune masă**.
- **Ospătar** — angajatul care deschide nota, adaugă produse, încasează. Se loghează în POS cu email + PIN numeric — sau, dacă opțiunea e activată pe unitate, **doar cu PIN** (fără email, util pe dispozitivele partajate); sesiunea durează 12 ore (auto-delogare după 4 ore de inactivitate pe telefoane partajate).
- **Operațiune / Cerere către manager** — acțiuni speciale pe notă: **transfer** (produse sau masă întreagă), **reducere** (procent sau sumă fixă), **retur**, **din partea casei**, **atribuire client** (pentru factură), **split** (împărțirea notei), **partajare masă** (mai mulți ospătari pe aceeași masă), **deblocare masă** (când e activ blocajul după scoaterea notei). Reducerea, returul și „din partea casei" merg la manager spre aprobare, cu motiv obligatoriu; anumite roluri (ex. șef de sală) pot avea auto-aprobare.
- **Blocajul mesei după scoaterea notei** (setare per unitate) — după ce s-a tipărit nota de plată, masa se **blochează la modificări** (nu se mai adaugă/șterg produse — nota din mâna clientului rămâne cea reală). Dacă totuși mai trebuie schimbat ceva, ospătarul cere **„Deblocare"**, iar managerul aprobă cererea. Încasarea, retipărirea notei și închiderea mesei rămân permise și cu masa blocată; retipărirea notei **re-blochează** masa.
- **Plan de sală / configurație** — desenul sălii (zone, mese, pereți, bar, decor, teme de culoare). O locație poate avea mai multe configurații (iarnă, vară cu terasă, weekend) programabile pe zilele săptămânii, și mai multe **zone** (salon, terasă).
- **Raion (secțiune)** — grup de mese atribuit unui ospătar într-o configurație; folosit la rutarea comenzilor venite prin QR.
- **Tura** — intervalul de lucru al ospătarului; raportul „Tura mea" adună vânzările, bacșișurile, reducerile și mișcările de numerar; la închidere cifrele se îngheață într-un instantaneu imutabil.
- **Masă servită** — comutator pe masă: pe bonul fiscal produsele sunt înlocuite cu linii „Masă servită" grupate pe cotă TVA (doar prezentare fiscală).
- **QR masă vs QR dinamic** — QR-ul de masă duce clientul la meniu/comandă pentru masa respectivă; QR-ul dinamic e un cod scurt a cărui destinație o poți schimba oricând fără să reprinți codul.
- **Server local (Edge)** — un PC din locație care ține POS-ul funcțional fără internet: comenzi, bonuri de bucătărie, plăți și închidere de tură merg local și se sincronizează automat când revine internetul. Adresele „nume.pos.symbai.app" sunt pentru operare; „nume.symbai.app" pentru administrare (doar cloud).

## Paginile modulului

**Planul de sală**
- **Plan Sală Live** (`/floorplan`) — viewer-ul „Operațiuni Live": vezi mesele pe zone, cu statistici (Total Restaurant, Zona Curentă, Oaspeți Activi, Ocupare %), tab-uri Vedere Live / Istoric / Jurnal Audit și selector de configurație. Click pe masă → detalii + „Gestionează Comanda" (te duce în POS) sau „Marchează ocupată".
- **Plan Sală Designer** (`/plan-sala`) — desenezi și editezi zonele, mesele și decorul (pereți, bar, plante, teme). Cere permisiunea de setări; te avertizează dacă pleci cu modificări nesalvate. Planul desenat aici apare identic în sală live, rezervări și POS.
- **Mese Deschise** (`/pos/open-tables`) — toate mesele active din restaurant, cu totalul deschis cumulat, căutare după masă sau angajat și statusuri (Ocupată / Clarificare / Așteaptă Plata). Click pe masă → detalii notă + buton Încasează.
- **Coduri QR** (`/qr-codes`, alias vechi `/table-qr-codes`) — două tab-uri: „QR Mese" (codurile fixe de pe mese, prin care clientul vede meniul și comandă) și „QR-uri dinamice" (coduri scurte cu destinație editabilă oricând, cu etichete și contor de scanări). Descărcare în PNG / SVG / PDF.

**Interfețele POS pentru personal** (toate vizibile doar cu acces POS)
- **POS Mobile** (`/pos/mobile`) și aplicația nativă **Symbai POS** — interfața principală a ospătarului pe telefon/tabletă. 7 ecrane: plan sală (mesele), produsele mesei (bonul nefiscal), meniul pentru adăugare, plată, operațiuni, rezervări și comenzi fără masă (guest). În aplicația nativă, numele meselor sunt normalizate (`Masa 7` / `M7`, fără dublări), planul folosește aceeași geometrie completă ca POS web pentru locația activă, are pan/pinch/double tap + butoane `+ / zoom / -`, iar culorile diferențiază masa mea, masa altui ospătar, neatribuită, comandă QR eligibilă, schimbări offline/ne trimise și rezervări. Cantitățile fracționare se afișează fără zerouri inutile, iar produsele se grupează pe client/scaun sau **Comune masă** cu subtotal. Cele 3 puncte din comandă deschid bottom sheet-ul scrollabil **Acțiuni masă**.
- **POS Ospătar** (`/pos/waiter`) / **POS Bar** (`/pos/bar`) / **POS Recepție** (`/pos/reception`) — același POS Mobile pe canal dedicat. Pe desktop (Bar/Recepție) interfața are coloană de coș și suportă scanner de coduri de bare.
- **POS Kiosk** (`/pos/kiosk`) — self-service full-screen pentru client: ecran de atragere → comandă → sugestii (upsell) → plată (card; „Charge to Room" pentru hotel) → confirmare cu număr de comandă. Are dialog „Ești încă aici?" la inactivitate.
- **Comenzi Ospătari** (`/pos/waiter-orders`) — pagina „Comenzi Client": tot ce cer clienții de la masă, pe secțiuni — Comenzi Noi de Confirmat, Comenzi Neasignate (Preia Masa), Acceptate → Trimite la Bucătărie, Chemat la Masă (cu „Pe drum" / „Am mers"), Cereri Notă de Plată, Cereri Plată (confirmi cash sau card) și Timpuri Estimative din bucătărie. Poate cere PIN de ospătar.
- **Callback Plată** (`/payment-callback`, și varianta cu identificator de sesiune) — pagină tehnică la întoarcerea din plata online Viva (Smart Checkout): confirmă rezultatul, revine automat în POS în 10 secunde, cu buton „Reîncearcă" la eșec. Nu se navighează manual aici.

## Fluxuri frecvente

**1. Deschizi o masă și trimiți comanda la bucătărie**
1. În POS Mobile, ecranul cu mesele → atingi masa.
2. Adaugi produse din meniu (cu fel/curs, observații, per client/scaun dacă vrei).
3. „Trimite la bucătărie" → bonurile apar pe ecranele de bucătărie (KDS) și/sau ies pe imprimante. În aplicația nativă **Symbai POS**, apăsarea pe **Trimite** dă feedback imediat, blochează dublul tap și face refresh-ul de sală/comenzi/KDS în fundal după succes; dacă revine rapid la sală, verifică în timeline/jurnal înainte să presupui că s-a pierdut comanda.
4. După trimiterea la bucătărie produsele **NU se mai anulează** (nici de admin): căile sunt **retur** (`type:"return"`), **din partea casei** (`type:"house"`) sau **discount** (`type:"discount"`), prin `get_pos_operation_context(orderId)` → `create_pos_operation(orderId, localId, type, items, reason, discount?)` — la retur și din partea casei `items` (produsele și cantitățile) e obligatoriu; cererea așteaptă aprobarea managerului dacă angajatul n-are drept de aplicare directă (`applyDirect`). Produsele netrimise se pot șterge liber.

**2. Încasezi o masă**
1. Pe masă → „Plătește". Dacă opțiunea „Întreabă de Bacșiș" e activată (din ecranul Operațiuni), apare întâi pasul de bacșiș (fără / sumă fixă / procent); altfel bacșișul se poate adăuga manual. În aplicația nativă Symbai POS, pasul de bacșiș se deschide imediat, iar trimiterea produselor netrimise + verificarea sumei se pregătesc în fundal; la „Continuă" app-ul așteaptă pregătirea dacă nu e gata.
2. Alegi metoda: numerar, card (Viva, Global Payments sau alt card), plată la termen, ordin de plată pentru firme, „Charge to Room" (hotel) sau orice altă metodă definită în setări. Metodele active se configurează per locație.
3. La confirmare, bonul fiscal se tipărește automat (implicit; tipărirea fiscală se poate dezactiva per metodă de plată) și masa se eliberează.
4. Pentru Global Payments pe același telefon (app2app), anularea/refuzul în aplicația de terminal Global Payments deblochează imediat Symbai POS și îl întoarce pe ospătar la alegerea metodei; doar stările incerte/confirmate se verifică automat pe server câteva secunde.
5. Plată parțială: direct în ecranul de plată, cu butoane +/− pe fiecare produs (alegi câte unități plătești), apoi apeși metoda — restul rămâne pe masă. Dacă alegi o persoană legată de un client real, încasarea se salvează pe acea persoană și se vede în istoricul/loialitatea clientului; explică userului că **Comune masă** este partea comună, nu un client.

**3. Comandă client prin QR, acceptată de ospătar**
1. Clientul scanează QR-ul mesei și comandă din portal.
2. Comanda e rutată automat la ospătarul potrivit (ordinea: cine are masa blocată > cine are comandă activă pe ea > zona atribuită > secțiunea/raionul din tură).
3. Dacă nimeni nu acceptă în 2 minute, cererea se difuzează către toți cei aflați în tură; primul care acceptă o preia.
4. Ospătarul vede cererea în bulina plutitoare din stânga ecranului POS (acceptare rapidă „Acceptă & Trimite") sau în pagina Comenzi Ospătari, unde poate și edita produsele înainte de acceptare, apoi o trimite la bucătărie. Tot acolo apar „cheamă ospătarul" și „cere nota", cu acțiuni „Pe drum" / „Rezolvat".

**4. Reducere / din partea casei / retur (cereri către manager)**
> ⚠ **Reducere și „din partea casei" sunt pentru CLIENȚI.** Pentru consumul ANGAJAȚILOR (echipa mănâncă din meniu) folosește **Beneficiu Personal**, NU reducere/din partea casei — altfel strici venitul și rapoartele P&L. Vezi `beneficiu-personal.md`.
1. Pe masă → meniul „Acțiuni Masă" (cele 3 puncte). În Symbai POS nativ, acesta apare ca bottom sheet scrollabil; acolo găsești Reducere / Din partea casei / Retur și restul acțiunilor mesei.
2. Completezi valoarea (procent sau sumă) și motivul (obligatoriu) → cererea merge la manager. La „din partea casei" ospătarul alege și o **categorie de motiv** (implicit: Protocol — cu clientul, Refuzat client, Pierdere, Eveniment — cu evenimentul), apoi scrie detaliul. Categoriile se schimbă din Setări → POS (cel mult 20) sau prin asistent cu `configure_pos_settings` (`houseReasons` = lista completă; `null` revine la lista prestabilită, o listă goală înseamnă fără categorii). Categoria apare apoi în aprobări, jurnal și rapoarte.
3. Managerul aprobă sau respinge; abia la aprobare se modifică nota. Rolurile cu auto-aprobare aplică efectul direct.
4. Pe o masă poate exista o singură cerere de reducere/atribuire client în așteptare — una nouă o înlocuiește pe cea veche, cu confirmare.

**4b. Politica de reduceri — până la cât poate da ospătarul SINGUR**

Implicit, ORICE reducere a unui angajat fără drept de reduceri merge la manager. Poți ridica praguri sub care se aplică instant, fără aprobare.

- **Unde se setează:** Meniu → **Configurare Afișaj** (`/menu/display`) → secțiunea **„Politică reduceri"**. Se setează **per platformă** (POS Ospătar, POS Mobil, POS Bar, Recepție, Dispecerat livrări) și per brand — opțional și doar pentru o locație anume. Deci poți lăsa barul mai strâns decât sala.
- **Ce setezi:**
  - **Prag procent** (ex. 10%) și **prag sumă** (ex. 50 lei) sub care angajatul aplică singur. ⚠ Dacă ambele sunt setate, reducerea trebuie să le respecte **pe amândouă** — 15% dintr-o notă mică poate trece de procent, dar tot pică pe lei, și invers.
  - **Ce se întâmplă peste prag:** *merge la manager* (implicit) sau *refuzat direct*.
  - **Ce tipuri sunt permise** (procent / sumă în lei) și **pe ce nivel** (pe un produs / pe toată nota).
  - **Butoane rapide** de procent și de sumă, ca ospătarul să nu tasteze.
  - **Motiv obligatoriu** + lista de motive predefinite din care alege.
- **Cine NU e afectat:** rolurile care au dreptul de reduceri (ex. șef de sală, manager, admin) aplică oricum direct — politica restrânge doar angajații fără acest drept.
- **Prin conexiune (asistent AI):** `get_discount_policy` (vezi politica actuală) și `set_discount_policy` (o modifici; cere confirmare). Ex.: „lasă ospătarii să dea singuri până la 10% dar maxim 30 de lei, peste asta să ceară aprobare".

**4c. „Setează prețul manual” — ospătarul scrie prețul final al produsului**

Pentru localurile unde prețul se stabilește la final („îl pun la plată”), fără procente sau aprobări.

- **Unde se pornește:** Meniu → **Configurare Afișaj** (`/menu/display`) → profilul platformei (POS Ospătar, POS Bar, POS, POS Mobil) → cardul **„Structură & Grid”** → **„Setează prețul manual”**. La **„Cine poate schimba prețul”**: toți angajații de pe platformă sau doar cei cu drept de reducere. Pe **Ecran Livrări** aceeași opțiune lasă operatorul să treacă prețul primit de la platformă.
- **Cum se folosește:** pe notă, prețul produsului devine buton cu creion — atingi, scrii prețul final pe bucată, **Salvează**. Merge pe produsele netrimise și pe cele **deja trimise și neîncasate**, inclusiv din ecranul de plată; totalul de încasat se actualizează imediat.
- **Banii:** prețul din meniu rămâne referință, deci diferența apare în rapoarte ca **reducere pe produs**; TVA-ul și totalul notei se recalculează.
- **Nu merge pe:** produse deja încasate (chiar parțial), cu beneficiu de personal, meniul zilei, consum de eveniment, produse cântărite, garanția SGR, credite RFID, notă cu plata pornită (inclusiv la terminal/portal) și un preț care ar coborî nota sub suma deja încasată — POS-ul spune explicit de ce.
- ⚠ **Configurația unei locații înlocuiește complet pe cea de brand.** Dacă locația are configurație proprie pentru profil, opțiunea se pornește și acolo.
- **Prin conexiune (asistent AI):** `get_manual_price_settings` (unde e pornită, pentru cine, ce locații au configurație proprie), `set_manual_price_settings` (o pornești/oprești; cere confirmare) și `set_pos_item_price` (schimbi prețul unei linii trimise de pe notă, cu identitatea angajatului — vezi mai jos). Ex.: „pornește prețul manual pe POS Bar pentru toți” sau „pune shaorma de la masa 3 la 25 de lei”.
- **„Nu apare creionul pe preț”** → opțiunea e oprită pe platforma acelui POS, angajatul nu se încadrează la „cine poate”, locația are configurație proprie fără opțiune, sau produsul e într-unul din cazurile de mai sus.

Capcane:
- **„Cere aprobare la orice reducere"** → politica e dezactivată (starea implicită) sau ambele praguri sunt 0. Activeaz-o și pune cel puțin un prag.
- **„Am pus 20% dar tot cere aprobare"** → verifică pragul în lei: dacă e mic, o notă mare depășește suma chiar sub procentul permis.
- **„Am setat pe POS Ospătar, dar la bar tot cere"** → politica e per platformă; setează și profilul barului.
- **Reducerile rămân pentru CLIENȚI** — pentru mesele angajaților folosește Beneficiu Personal (vezi mai sus).

**5. Transfer produse sau masă întreagă**
1. „Acțiuni Masă" → Transfer Produse (asistent în 3 pași: alegi produsele → alegi destinația → confirmi) sau Transferă Masă (toată nota către alt ospătar).
2. Transferul către alt ospătar trebuie acceptat de acesta: primește o notificare și poate accepta sau refuza.
3. Pentru mai mulți ospătari pe aceeași masă (evenimente mari) folosește „Partajează Masă" — accesul se revocă manual de cel care l-a acordat.

**6. Împarte nota (split)**
1. În ecranul de plată → „Împarte Nota": pe produse (selectezi ce plătește fiecare) sau pe sumă.
2. Se pot folosi grupurile de clienți per scaun pentru selecție rapidă; produsele fără client sunt grupate la **Comune masă**. Dacă o persoană este legată de clientul real din portal/CRM, plata separată îi actualizează istoricul/loialitatea; produsele comune rămân pe **Comune masă**. Dacă apar cantități fracționare (ex. jumătate de porție, gramaj, kg), POS-ul le afișează la fel în coș, split și preview nota.
3. Fiecare parte se încasează separat, cu bon fiscal propriu.

**7. Raport de tură și sertar de bani**
1. „Tura mea" în POS: vânzări totale, pe metodă de plată, bacșișuri, reduceri, retururi, din partea casei, intrări/ieșiri numerar — cu intervale predefinite (azi, ieri, săptămâna…).
1b. „Vânzările mele din tură” (Operațiuni, în POS web și în Symbai POS): ce produse a vândut ospătarul în tura curentă, filtrabile după categorie, bar/bucătărie, sală și masă, separat încasat / încă neîncasat. Sumele sunt cu TVA, înainte de reducerile pe toată nota și fără bacșiș; liniile anulate, returnate sau transferate, felurile din Meniul Zilei și marcajele de eveniment nu se numără.
2. Sertarul de bani: intrări/ieșiri manuale de numerar cu note, contorizate în raport.
3. La închiderea turei cifrele se îngheață — confirmările bancare târzii nu mai schimbă raportul istoric; numerarul de predat se calculează automat.

**8. Desenezi sau modifici planul de sală**
1. `/plan-sala` → adaugi zone, mese (număr, locuri, formă), pereți, bar, decor, teme.
2. Salvezi; planul apare identic în `/floorplan`, în POS și la rezervări.
3. Pentru sezoane diferite creezi configurații separate și le programezi pe zile ale săptămânii; raioanele (secțiunile de ospătari) se definesc pe configurație.

## Tool-uri MCP utile

**Citire (read-only; cere grantul `readModule` al domeniului pe token):**
- `raport_vanzari` — încasări pe perioadă: total, nr. bonuri, bon mediu, bacșiș, reduceri, defalcare pe metodă de plată + comparație cu perioada anterioară. Pentru „cât am vândut azi", „cash vs card".
- `performanta_ospatari` — vânzări per ospătar: nr. bonuri, încasări, bon mediu, bacșiș. Cu `peSectii: true` (dacă apare în schema live) dă și vânzarea fiecăruia pe bar/bucătărie, cu și fără TVA, fără bacșiș. Pentru „X% din bucătărie pe ospătari” folosește-l pe acesta, fără SQL. Meniul zilei și platourile compuse intră la secția felurilor lor (`dinProduseCompuseBrut`). Dacă omul vrea bucătăria fără meniul zilei, scade acea sumă și spune că ai scăzut-o.
- Liniile cu `daily_menu_role='parent'` nu sunt doar meniul zilei: tot așa se vând și platourile compuse (ex. „Platou de 2 persoane”). Când numeri meniul zilei, filtrează după produs și nu numai după rol. Altfel apare o „neconcordanță” falsă.
- `vanzari_in_timp` — orele/zilele de vârf (grupare pe zi / oră / zi a săptămânii).
- `top_produse` — cele mai vândute produse (exclude itemii anulați/returnați).
- `get_table_status` — „ce e pe masa X ACUM" într-un apel: ospătar, zonă, comenzi active cu produsele (cu etichetă de status, ex. „RETUR în așteptare"), rămas de plată, cereri de aprobare în așteptare pe masă. Dai numărul/numele mesei (nu un id).
- `get_employee_activity` — „ce a făcut ospătarul X" pe o zi, consolidat: bonuri, vânzări, bacșiș, mese lucrate, prima/ultima activitate + cererile lui de aprobare grupate.
- `get_order_timeline` — povestea COMPLETĂ a unei comenzi: antet + produse (cu status) + plăți + cereri + audit. Pentru „de ce s-a anulat nota X".
- `get_order_payments` — plățile unei note: metodă, sumă, bacșiș, cine a plătit, fiscal, refund.
- `list_operation_requests` — cererile de aprobare (anulări/retururi/discounturi/casă/transferuri); cu `status:"pending"` = „ce trebuie să aprob".
- `list_shadow_order_conflicts` — conflictele tehnice cloud-edge din Control Operațional (`shadow_order_conflict`), separate de cererile normale de aprobare. Folosește la „conflict shadow", „conflict Viva", „produs nou pe notă deja încasată"; este read-only și trimite managerul la `/operations` pentru decizie.
- `jurnal_activitate` — CINE a făcut CE și CÂND, minut-cu-minut: anulări, aprobări/respingeri, reduceri, transferuri, retururi, oferit gratis, plăți. Filtrabil după masă, angajat, tip entitate, perioadă. Pentru cronologia detaliată.
- `get_orders_summary` — sumar agregat al comenzilor pe perioadă (ce produse, în ce cantități).
- `list_floor_zones` — zonele de salon per locație.
- `gaseste_in_aplicatie` — link direct către orice pagină din aplicație.

**Scriere — modul `setari`:** `create_floor_zone`, `update_floor_zone`, `create_floor_table`, `update_floor_table`, `bulk_create_floor_tables`, `bulk_assign_tables_to_zone`, `create_floor_config`, `duplicate_floor_config`, `create_floor_config_schedule`, `add_sections_to_config`, `assign_tables_to_section`, `add_zones_to_config` (construcția planului de sală); `create_payment_method` (metode de plată); `create_menu_display_config` / `update_menu_display_config` (cum arată meniul în POS Ospătar/Bar/Recepție/Kiosk; profilurile sunt `pos-waiter`, `pos-mobile`, `pos-bar`, `pos-reception`, `kiosk`, `website`, `portal-web`, `table-clients`, `delivery-cockpit`). Pentru o singură setare folosește unealta ei: `set_discount_policy`, `set_manual_price_settings` — `update_menu_display_config` înlocuiește toată configurația.

**Plăți și mese blocate (modul `comenzi_pos`)**: `list_stuck_payments` (doar citire — note „plată în curs”, sesiuni de card incerte, mese ocupate cu nota închisă, fiecare cu unealta care îl rezolvă) → `change_order_payment_method(orderId, paymentMethod, reason)` (metoda greșită pe o notă încasată; nu mută bani), `release_stuck_table(tableId, reason)` (masă rămasă ocupată), `release_payment_lock(orderId, reason)` (notă agățată de o plată care n-a avut loc), `resolve_uncertain_card_payment(sessionId, outcome, reason)` (sesiune GP incertă, după verificarea fizică pe terminal), `reprint_order_bill(orderId)` (copie nefiscală a notei). Toate se aplică direct — acordul omului înainte. Detalii: skill `investigheaza-masa` §4b.

**Scriere — modul `personal`:** `create_shift` (tura de casă POS a ospătarului, fără `brandId`; include secțiunea/raionul pentru rutarea comenzilor QR), `update_shift`, `bulk_create_shifts`. Tura de casă nu e pontajul: prezența se trece cu `record_manual_attendance` / `close_manual_attendance`.

**Operațiuni prin MCP — modul `comenzi_pos`, conexiune nominală:** verifică întâi catalogul live; instrumentele noi sunt disponibile după actualizarea instanței.
- `get_pos_operation_context(orderId)` citește nota, identificatorii liniilor, cantitățile, prețurile (pe bucată și din meniu) și cererile existente în unitățile permise operatorului.
- `set_pos_item_price(orderId, orderItemId, unitPrice, profileType)` schimbă prețul final pe bucată al unei linii trimise și neîncasate („Setează prețul manual”), prin aceeași rută ca POS-ul: merge doar cu opțiunea pornită pe platforma pe care lucrează angajatul și dacă el se încadrează la „cine poate”. Pentru reducere în procente/lei folosește `create_pos_operation` type=discount; pentru gratuit, type=house.
- `create_pos_operation` creează retur, din partea casei, discount sau atribuire client. Pentru retur/casă se trimit liniile și cantitățile exacte. Discountul se aplică pe linii întregi sau pe întreaga notă; pentru o parte din cantitate, împarte nota înainte. `applyDirect:true` cere aplicarea imediată cu drepturile operatorului; starea returnată arată dacă s-a aplicat sau a rămas la aprobare.
- `transfer_pos_items` mută selecția pe altă masă. `scope:"table"` înseamnă toată masa, inclusiv produsele adăugate între timp. La timeout sau rezultat necunoscut, reia cu același `localId` și aceleași argumente: transferul deja făcut este recunoscut (`alreadyApplied`) și nu se mută nimic a doua oară. `transfer_pos_employee` transferă direct către alt ospătar cu dreptul corespunzător.
- `request_pos_transfer` cere preluarea mesei sau a produselor de către destinatar. Crearea cererii nu dovedește transferul.
- `split_pos_bill` împarte pe produse/cantități sau pe sumă, creând o notă copil neîncasată. `cancel_pos_split` reunește o notă copil eligibilă cu părintele.
- `respond_operation_request` permite `approve`, `reject`, `approve_return_stock`, `accept`, `decline`, `cancel`, `clarification` și `archive`, în funcție de tipul cererii și drepturile operatorului. Transferul se acceptă prin conexiunea nominală a destinatarului; un nume scris în argumente nu schimbă identitatea. Retururile împărțite pe secții se decid pe sub-cereri.
- `cancel_unpaid_order` rămâne instrumentul pentru anularea unei note deschise, neplătite și netrimise la bucătărie. Copiile fiscale și rambursările folosesc fluxurile lor dedicate; un retur comercial nu rambursează automat o plată.

Instrumentele noi de creare/transfer/split previzualizează implicit; `confirm:true` execută în baza mandatului utilizatorului. Nu cere din nou acordul pentru o operație deja cerută clar. Păstrează același `localId` pentru aceeași intenție de retur/discount/split/transfer de produse. După întrerupere sau rezultat necunoscut, `transfer_pos_items` se reia cu același `localId` (un `localId` nou ar fi un transfer nou). Pentru `transfer_pos_employee` și `request_pos_transfer` recitește întâi cererea și notele sursă/destinație; acestea nu se retrimit orbește. La confirmare de plată cu schimbare de metodă, citește și lista notelor deja modificate dacă decizia finală a eșuat.

**SQL (dacă tokenul are SQL activat):** `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar citire).

## Întrebări frecvente și capcane

- **De ce nu pot șterge un produs de pe notă?** — A fost deja trimis la bucătărie. După trimiterea la bucătărie produsele **NU se mai anulează** (nici de admin): căile sunt **retur** (`type:"return"`), **din partea casei** (`type:"house"`) sau **discount** (`type:"discount"`), prin `get_pos_operation_context(orderId)` → `create_pos_operation(orderId, localId, type, items, reason, discount?)` — la retur și din partea casei `items` (produsele și cantitățile) e obligatoriu; cererea așteaptă aprobarea managerului dacă angajatul n-are drept de aplicare directă (`applyDirect`). Produsele netrimise se pot șterge liber.
- **De ce nu mai pot modifica masa după ce am scos nota?** — Unitatea are activat blocajul mesei după scoaterea notei: după tipărirea notei de plată, masa nu mai acceptă modificări. Cere „Deblocare" din acțiunile mesei — managerul aprobă și poți modifica; la o nouă tipărire a notei, masa se blochează din nou. Încasarea, retipărirea notei și închiderea merg oricând.
- **De ce văd masa blocată / „Locked"?** — Alt ospătar lucrează pe ea. Conflictele se rezolvă din dialogul afișat; pentru lucru în paralel folosiți „Partajează Masă".
- **De ce nu s-a aplicat reducerea?** — Cererea așteaptă aprobarea managerului. Verifică în jurnal (`jurnal_activitate`) cine a aprobat/respins și motivul. Atenție: poate exista o singură cerere de reducere în așteptare per masă.
- **De ce a ajuns comanda QR la alt ospătar?** — Nu e neapărat o eroare: dacă ținta nu acceptă în 2 minute, comanda se difuzează către toți cei în tură și primul care acceptă o preia. Verifică și dacă ospătarul are tura creată cu secțiunea corectă.
- **Pot anula o notă plătită?** — Nu direct. Pentru corecții se folosesc stornări/retururi — rămâne întotdeauna urmă, nimic nu se șterge.
- **Un client și-a pierdut bonul fiscal. Îi dau o copie?** — Da, chiar tu, fără managerul. Deschide comanda plătită (din Operațiuni → istoric, sau din meniul „Acțiuni" al comenzii pe telefon) și apasă **„Copie Bon Fiscal (client)"**. E o copie a bonului deja emis (pe casele Datecs iese din jurnalul electronic al casei, altfel o copie pe imprimanta de notă), nu un bon fiscal nou — deci nu se dublează vânzarea. Detalii în ghidul de echipamente/imprimante.
- **Nu confunda** „anulat un produs de pe notă" cu „anulat nota întreagă" — sunt evenimente diferite în jurnal.
- **Viva vs Global Payments?** — Ambele pot fi active în paralel; se alege per locație. Viva: plata pe același dispozitiv (aplicația de terminal sau pagina de plată online, cu întoarcere prin `/payment-callback`). Global Payments: terminalul e un dispozitiv separat — POS-ul verifică periodic rezultatul, confirmarea poate dura câteva secunde.
- **„Plăți potențial duble" sau „plată lipsă în Viva"?** — Situații cunoscute de reconciliere; îndrumă utilizatorul spre pagina de operațiuni/plăți și verifică plățile comenzii în jurnal.
- **Conflict „produs nou pe comandă Viva deja încasată"?** — Verifică întâi `list_shadow_order_conflicts`, apoi `get_order_timeline` și `get_order_payments`. Produsele acoperite de subtotalul deja încasat se acceptă automat la sincronizare; dacă apare totuși un conflict de tip „produs nou pe comandă cu plată confirmată", produsul depășește suma acoperită de plata Viva. Nu-l aproba prin `respond_operation_request`; explică diferența și trimite managerul la Control Operațional (`/operations`).
- **În POS apare „Transfer în curs de confirmare". S-a făcut transferul?** — Răspunsul serverului s-a pierdut pe drum (conexiune slabă). POS-ul din browser află singur de la server dacă transferul de produse s-a făcut și îl duce la capăt; nu trebuie reluat manual, iar un transfer identic este oprit cât primul e în lucru. Dacă nu se lămurește în 5 minute apare un aviz de verificare, care dispare singur: atunci uită-te pe ambele mese și, dacă produsele nu s-au mutat, fă transferul din nou. Transferul de masă către alt ospătar și împărțirea notei cer în continuare verificarea meselor după un rezultat neconfirmat.
- **Merge fără internet?** — Da, cu serverul local (Edge) instalat în locație: comenzi, bonuri, plăți și ture merg local și se sincronizează la revenirea internetului. Paginile de administrare (meniu, rapoarte) cer cloud.
- **De ce nu văd pagina POS în meniu?** — Rolul angajatului nu are acces POS; designerul de sală cere permisiunea de setări, iar Coduri QR cere permisiunea de administrare meniu QR.
- **Raportul de tură s-a schimbat după închidere?** — Nu se poate: la închidere cifrele se îngheață într-un instantaneu imutabil.
- **Bonul fiscal arată „Masă servită" în loc de produse?** — E comutatorul „Masă servită" activat pe masă: produsele sunt înlocuite pe bon cu linii grupate pe cotă TVA (doar prezentare fiscală).
- **Pe telefon nu găsesc transfer/retur/discount/client/firmă.** — În Symbai POS nativ apasă cele 3 puncte din headerul mesei: se deschide bottom sheet-ul **Acțiuni masă**. Dacă userul cere dovadă vizuală pentru gesturi/zoom/bottom sheet, folosește emulator Android sau device real și arată screenshot.
- **De ce văd mese în culori diferite pe telefon?** — Este intenționat: aplicația marchează ownership-ul și riscul operațional (masa mea, alt ospătar, neatribuită, QR de preluat, offline/ne trimis, rezervare). Nu cere redenumirea meselor; verifică tura/raionul, comenzile QR și sincronizarea dacă o culoare pare greșită.

## Pentru acces SQL (scurt)

Tabele relevante: `orders` (notele), `order_items` (produsele pe notă, cu status, cantitate plătită, `sessionClientId` / `requestedForClientId` și persoana cerută), `order_payments` / `payments` (încasări, inclusiv metadate de persoană/client la plata separată), `table_session_clients` (persoanele/scaunele unei mese și legătura către clientul real), `operation_requests` (cereri transfer/reducere/retur/casă cu status și aprobator), `floor_tables` + `floor_zones` (mesele și zonele), `table_shared_access` (partajări de masă), `waiter_order_requests` + `table_requests` (comenzi QR și chemări/cereri de notă), `table_qr_codes` + `dynamic_qr_codes` (codurile QR), `shifts` (turele). Cine a făcut o operație (transfer, anulare, închiderea turei) se citește cu `jurnal_activitate`: `audit_logs` e refuzat prin SQL ad-hoc.

Exemple: „cine a aprobat reducerea de la masa 12 ieri" → `operation_requests` (sau direct `jurnal_activitate`); „câte comenzi QR au fost acceptate săptămâna asta" → `waiter_order_requests` pe status; „cât a încasat fiecare ospătar azi" → preferă `performanta_ospatari` în loc de SQL.
