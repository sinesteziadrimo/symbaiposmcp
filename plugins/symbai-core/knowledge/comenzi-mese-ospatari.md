# POS la masă — plan de sală, comenzi, ospătari și plăți

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă serviciul la masă: planul de sală (desenat în designer, afișat live), interfața POS Mobil pentru ospătari/bar/recepție, notele meselor și operațiile pe ele (transfer, reducere, retur, split, partajare), plățile (numerar, card Viva, card Global Payments, mixt, bacșiș), comenzile clienților venite prin QR de la masă și raportul de tură al fiecărui ospătar. Bonul fiscal se tipărește automat după confirmarea plății.

## Concepte

- **Masă** — o poziție în planul de sală. Poate fi liberă, ocupată sau cu notă deschisă. Mesele au „lacăt": dacă alt ospătar lucrează pe o masă, o vezi blocată.
- **Notă / Comandă** — ce a comandat masa: produse, cantități, prețuri, eventual reduceri. Produsele se pot grupa pe **fel/curs** (felul 1, felul 2…) și **per client/scaun**.
- **Ospătar** — angajatul care deschide nota, adaugă produse, încasează. Se loghează în POS cu email + PIN numeric; sesiunea durează 12 ore (auto-delogare după 4 ore de inactivitate pe telefoane partajate).
- **Operațiune / Cerere către manager** — acțiuni speciale pe notă: **transfer** (produse sau masă întreagă), **reducere** (procent sau sumă fixă), **retur**, **din partea casei**, **atribuire client** (pentru factură), **split** (împărțirea notei), **partajare masă** (mai mulți ospătari pe aceeași masă). Reducerea, returul și „din partea casei" merg la manager spre aprobare, cu motiv obligatoriu; anumite roluri (ex. șef de sală) pot avea auto-aprobare.
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
- **POS Mobile** (`/pos/mobile`) și aplicația nativă **Symbai POS** (`expo-mobile`) — interfața principală a ospătarului pe telefon/tabletă. 7 ecrane: plan sală (mesele), produsele mesei (bonul nefiscal), meniul pentru adăugare, plată, operațiuni, rezervări și comenzi fără masă (guest). În aplicația nativă, numele meselor sunt normalizate (`Masa 7` / `M7`, fără dublări), planul are pan/pinch + butoane `+ / zoom / -`, iar cele 3 puncte din comandă deschid bottom sheet-ul scrollabil **Acțiuni masă**.
- **POS Ospătar** (`/pos/waiter`) / **POS Bar** (`/pos/bar`) / **POS Recepție** (`/pos/reception`) — același POS Mobile pe canal dedicat. Pe desktop (Bar/Recepție) interfața are coloană de coș și suportă scanner de coduri de bare.
- **POS Kiosk** (`/pos/kiosk`) — self-service full-screen pentru client: ecran de atragere → comandă → sugestii (upsell) → plată (card; „Charge to Room" pentru hotel) → confirmare cu număr de comandă. Are dialog „Ești încă aici?" la inactivitate.
- **Comenzi Ospătari** (`/pos/waiter-orders`) — pagina „Comenzi Client": tot ce cer clienții de la masă, pe secțiuni — Comenzi Noi de Confirmat, Comenzi Neasignate (Preia Masa), Acceptate → Trimite la Bucătărie, Chemat la Masă (cu „Pe drum" / „Am mers"), Cereri Notă de Plată, Cereri Plată (confirmi cash sau card) și Timpuri Estimative din bucătărie. Poate cere PIN de ospătar.
- **Callback Plată** (`/payment-callback`, și varianta cu identificator de sesiune) — pagină tehnică la întoarcerea din plata online Viva (Smart Checkout): confirmă rezultatul, revine automat în POS în 10 secunde, cu buton „Reîncearcă" la eșec. Nu se navighează manual aici.

## Fluxuri frecvente

**1. Deschizi o masă și trimiți comanda la bucătărie**
1. În POS Mobile, ecranul cu mesele → atingi masa.
2. Adaugi produse din meniu (cu fel/curs, observații, per client/scaun dacă vrei).
3. „Trimite la bucătărie" → bonurile apar pe ecranele de bucătărie (KDS) și/sau ies pe imprimante.
4. Odată trimise, produsele NU mai pot fi șterse direct — doar prin cerere de retur/anulare aprobată de manager. Produsele netrimise se pot șterge liber.

**2. Încasezi o masă**
1. Pe masă → „Plătește". Dacă opțiunea „Întreabă de Bacșiș" e activată (din ecranul Operațiuni), apare întâi pasul de bacșiș (fără / sumă fixă / procent); altfel bacșișul se poate adăuga manual.
2. Alegi metoda: numerar, card (Viva, Global Payments sau alt card), plată la termen, ordin de plată pentru firme, „Charge to Room" (hotel) sau orice altă metodă definită în setări. Metodele active se configurează per locație.
3. La confirmare, bonul fiscal se tipărește automat (implicit; tipărirea fiscală se poate dezactiva per metodă de plată) și masa se eliberează.
4. Plată parțială: direct în ecranul de plată, cu butoane +/− pe fiecare produs (alegi câte unități plătești), apoi apeși metoda — restul rămâne pe masă.

**3. Comandă client prin QR, acceptată de ospătar**
1. Clientul scanează QR-ul mesei și comandă din portal.
2. Comanda e rutată automat la ospătarul potrivit (ordinea: cine are masa blocată > cine are comandă activă pe ea > zona atribuită > secțiunea/raionul din tură).
3. Dacă nimeni nu acceptă în 2 minute, cererea se difuzează către toți cei aflați în tură; primul care acceptă o preia.
4. Ospătarul vede cererea în bulina plutitoare din stânga ecranului POS (acceptare rapidă „Acceptă & Trimite") sau în pagina Comenzi Ospătari, unde poate și edita produsele înainte de acceptare, apoi o trimite la bucătărie. Tot acolo apar „cheamă ospătarul" și „cere nota", cu acțiuni „Pe drum" / „Rezolvat".

**4. Reducere / din partea casei / retur (cereri către manager)**
> ⚠ **Reducere și „din partea casei" sunt pentru CLIENȚI.** Pentru consumul ANGAJAȚILOR (echipa mănâncă din meniu) folosește **Beneficiu Personal**, NU reducere/din partea casei — altfel strici venitul și rapoartele P&L. Vezi `beneficiu-personal.md`.
1. Pe masă → meniul „Acțiuni Masă" (cele 3 puncte). În Symbai POS nativ, acesta apare ca bottom sheet scrollabil; acolo găsești Reducere / Din partea casei / Retur și restul acțiunilor mesei.
2. Completezi valoarea (procent sau sumă) și motivul (obligatoriu) → cererea merge la manager.
3. Managerul aprobă sau respinge; abia la aprobare se modifică nota. Rolurile cu auto-aprobare aplică efectul direct.
4. Pe o masă poate exista o singură cerere de reducere/atribuire client în așteptare — una nouă o înlocuiește pe cea veche, cu confirmare.

**5. Transfer produse sau masă întreagă**
1. „Acțiuni Masă" → Transfer Produse (asistent în 3 pași: alegi produsele → alegi destinația → confirmi) sau Transferă Masă (toată nota către alt ospătar).
2. Transferul către alt ospătar trebuie acceptat de acesta: primește o notificare și poate accepta sau refuza.
3. Pentru mai mulți ospătari pe aceeași masă (evenimente mari) folosește „Partajează Masă" — accesul se revocă manual de cel care l-a acordat.

**6. Împarte nota (split)**
1. În ecranul de plată → „Împarte Nota": pe produse (selectezi ce plătește fiecare) sau pe sumă.
2. Se pot folosi grupurile de clienți per scaun pentru selecție rapidă.
3. Fiecare parte se încasează separat, cu bon fiscal propriu.

**7. Raport de tură și sertar de bani**
1. „Tura mea" în POS: vânzări totale, pe metodă de plată, bacșișuri, reduceri, retururi, din partea casei, intrări/ieșiri numerar — cu intervale predefinite (azi, ieri, săptămâna…).
2. Sertarul de bani: intrări/ieșiri manuale de numerar cu note, contorizate în raport.
3. La închiderea turei cifrele se îngheață — confirmările bancare târzii nu mai schimbă raportul istoric; numerarul de predat se calculează automat.

**8. Desenezi sau modifici planul de sală**
1. `/plan-sala` → adaugi zone, mese (număr, locuri, formă), pereți, bar, decor, teme.
2. Salvezi; planul apare identic în `/floorplan`, în POS și la rezervări.
3. Pentru sezoane diferite creezi configurații separate și le programezi pe zile ale săptămânii; raioanele (secțiunile de ospătari) se definesc pe configurație.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `raport_vanzari` — încasări pe perioadă: total, nr. bonuri, bon mediu, bacșiș, reduceri, defalcare pe metodă de plată + comparație cu perioada anterioară. Pentru „cât am vândut azi", „cash vs card".
- `performanta_ospatari` — vânzări per ospătar: nr. bonuri, încasări, bon mediu, bacșiș.
- `vanzari_in_timp` — orele/zilele de vârf (grupare pe zi / oră / zi a săptămânii).
- `top_produse` — cele mai vândute produse (exclude itemii anulați/returnați).
- `get_table_status` — „ce e pe masa X ACUM" într-un apel: ospătar, zonă, comenzi active cu produsele (cu etichetă de status, ex. „RETUR în așteptare"), rămas de plată, cereri de aprobare în așteptare pe masă. Dai numărul/numele mesei (nu un id).
- `get_employee_activity` — „ce a făcut ospătarul X" pe o zi, consolidat: bonuri, vânzări, bacșiș, mese lucrate, prima/ultima activitate + cererile lui de aprobare grupate.
- `get_order_timeline` — povestea COMPLETĂ a unei comenzi: antet + produse (cu status) + plăți + cereri + audit. Pentru „de ce s-a anulat nota X".
- `get_order_payments` — plățile unei note: metodă, sumă, bacșiș, cine a plătit, fiscal, refund.
- `list_operation_requests` — cererile de aprobare (anulări/retururi/discounturi/casă/transferuri); cu `status:"pending"` = „ce trebuie să aprob".
- `list_shadow_order_conflicts` — conflictele tehnice cloud-edge din Control Operațional (`shadow_order_conflict`), separate de cererile normale de aprobare. Folosește la „conflict shadow", „conflict Viva", „produs nou pe notă deja încasată"; este read-only și trimite managerul la `/operations` pentru decizie.
- `jurnal_activitate` — CINE a făcut CE și CÂND, minut-cu-minut: anulări, aprobări/respingeri, reduceri, transferuri, retururi, oferit gratis, plăți. Filtrabil după masă, angajat, tip entitate, perioadă. Pentru cronologia detaliată.
- `performanta_ospatari` (mai sus) — comparație între ospătari.
- `get_orders_summary` — sumar agregat al comenzilor pe perioadă (ce produse, în ce cantități).
- `list_floor_zones` — zonele de salon per locație.
- `gaseste_in_aplicatie` — link direct către orice pagină din aplicație.

**Scriere — modul `setari`:** `create_floor_zone`, `update_floor_zone`, `create_floor_table`, `update_floor_table`, `bulk_create_floor_tables`, `bulk_assign_tables_to_zone`, `create_floor_config`, `duplicate_floor_config`, `create_floor_config_schedule`, `add_sections_to_config`, `assign_tables_to_section`, `add_zones_to_config` (construcția planului de sală); `create_payment_method` (metode de plată); `create_menu_display_config` / `update_menu_display_config` (cum arată meniul în POS Ospătar/Bar/Recepție/Kiosk).

**Scriere — modul `personal`:** `create_shift` (tura ospătarului; include secțiunea/raionul pentru rutarea comenzilor QR), `update_shift`, `bulk_create_shifts`.

**Scriere — modul `comenzi_pos`:** `respond_operation_request` (aprobă/respinge o cerere de la ospătar — retur/discount/casă/client/confirmare plată/storno; produce efectele complete + notifică ospătarul). Confirmă mereu cu utilizatorul înainte. Transferurile între ospătari se pot doar respinge de aici (aprobarea se face de ospătarul destinatar din aplicație). `cancel_unpaid_order` (anulează o comandă deschisă, neplătită, netrimisă la bucătărie).

**SQL (dacă tokenul are SQL activat):** `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar citire).

## Întrebări frecvente și capcane

- **De ce nu pot șterge un produs de pe notă?** — A fost deja trimis la bucătărie. Ștergerea directă merge doar pe produse netrimise; pentru rest faci cerere de retur/anulare cu aprobare de manager.
- **De ce văd masa blocată / „Locked"?** — Alt ospătar lucrează pe ea. Conflictele se rezolvă din dialogul afișat; pentru lucru în paralel folosiți „Partajează Masă".
- **De ce nu s-a aplicat reducerea?** — Cererea așteaptă aprobarea managerului. Verifică în jurnal (`jurnal_activitate`) cine a aprobat/respins și motivul. Atenție: poate exista o singură cerere de reducere în așteptare per masă.
- **De ce a ajuns comanda QR la alt ospătar?** — Nu e neapărat o eroare: dacă ținta nu acceptă în 2 minute, comanda se difuzează către toți cei în tură și primul care acceptă o preia. Verifică și dacă ospătarul are tura creată cu secțiunea corectă.
- **Pot anula o notă plătită?** — Nu direct. Pentru corecții se folosesc stornări/retururi — rămâne întotdeauna urmă, nimic nu se șterge.
- **Nu confunda** „anulat un produs de pe notă" cu „anulat nota întreagă" — sunt evenimente diferite în jurnal.
- **Viva vs Global Payments?** — Ambele pot fi active în paralel; se alege per locație. Viva: plata pe același dispozitiv (aplicația de terminal sau pagina de plată online, cu întoarcere prin `/payment-callback`). Global Payments: terminalul e un dispozitiv separat — POS-ul verifică periodic rezultatul, confirmarea poate dura câteva secunde.
- **„Plăți potențial duble" sau „plată lipsă în Viva"?** — Situații cunoscute de reconciliere; îndrumă utilizatorul spre pagina de operațiuni/plăți și verifică plățile comenzii în jurnal.
- **Conflict „produs nou pe comandă Viva deja încasată"?** — Verifică întâi `list_shadow_order_conflicts`, apoi `get_order_timeline` și `get_order_payments`. Din 21 iunie 2026, produsele care sunt acoperite de subtotalul încasat se acceptă automat la sync; dacă apare încă un conflict `new_item_on_terminal_parent` cu `viva_confirmed`, produsul depășește suma de produse acoperită de plata Viva. Nu-l aproba prin `respond_operation_request`; explică diferența și trimite managerul la Control Operațional (`/operations`).
- **Merge fără internet?** — Da, cu serverul local (Edge) instalat în locație: comenzi, bonuri, plăți și ture merg local și se sincronizează la revenirea internetului. Paginile de administrare (meniu, rapoarte) cer cloud.
- **De ce nu văd pagina POS în meniu?** — Rolul angajatului nu are acces POS; designerul de sală cere permisiunea de setări, iar Coduri QR cere permisiunea de administrare meniu QR.
- **Raportul de tură s-a schimbat după închidere?** — Nu se poate: la închidere cifrele se îngheață într-un instantaneu imutabil.
- **Bonul fiscal arată „Masă servită" în loc de produse?** — E comutatorul „Masă servită" activat pe masă: produsele sunt înlocuite pe bon cu linii grupate pe cotă TVA (doar prezentare fiscală).
- **Pe telefon nu găsesc transfer/retur/discount/client/firmă.** — În Symbai POS nativ apasă cele 3 puncte din headerul mesei: se deschide bottom sheet-ul **Acțiuni masă**. Dacă userul cere dovadă vizuală pentru gesturi/zoom/bottom sheet, folosește emulator Android sau device real și arată screenshot.

## Pentru acces SQL (scurt)

Tabele relevante: `orders` (notele), `order_items` (produsele pe notă, cu status și cantitate plătită), `order_payments` / `payments` (încasări), `operation_requests` (cereri transfer/reducere/retur/casă cu status și aprobator), `floor_tables` + `floor_zones` (mesele și zonele), `table_shared_access` (partajări de masă), `waiter_order_requests` + `table_requests` (comenzi QR și chemări/cereri de notă), `table_qr_codes` + `dynamic_qr_codes` (codurile QR), `shifts` (turele), `audit_logs` (jurnalul).

Exemple: „cine a aprobat reducerea de la masa 12 ieri" → `operation_requests` (sau direct `jurnal_activitate`); „câte comenzi QR au fost acceptate săptămâna asta" → `waiter_order_requests` pe status; „cât a încasat fiecare ospătar azi" → preferă `performanta_ospatari` în loc de SQL.
