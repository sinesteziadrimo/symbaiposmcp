# Echipamente — ecrane bucătărie (KDS), imprimante, Print Agent, server local

> Pentru link-ul exact către orice pagină sau setare folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare în aplicație.

## Pe scurt

Modulul „Echipamente" acoperă tot hardware-ul din locație: ecranele de bucătărie (KDS) pe care apar bonurile, imprimantele de bonuri și etichete, casa de marcat fiscală prin Print Agent, serverul local (Edge) care ține POS-ul funcțional fără internet, plus dispozitivele (PC-uri, tablete) și canalele pe care rulează aplicația. Tot aici intră rutarea comenzilor: cum ajunge fiecare produs dintr-o comandă pe ecranul sau imprimanta potrivită.

## Concepte

- **Bon de bucătărie (ticket)** — când ospătarul trimite comanda, produsele sunt împărțite pe destinații (bucătărie, bar etc.) și devin bonuri. Fiecare bon trece prin stările: în așteptare → în preparare → gata → finalizat/livrat. Bonul de hârtie are layout standard: antet cu comandă/masă/ospătar, produse grupate pe feluri, note indentate, marcaj „URGENT" la prioritate.
- **Ecran KDS** — ecran din bucătărie/bar care afișează bonurile live: carduri pe comenzi, culori pe feluri, timp de așteptare, sunete configurabile. Două tipuri: **Ecran Principal (master)** — vede toate comenzile (agregă stațiile) și **Ecran Stație** — vede doar produsele rutate la el. Adăugările târzii pe aceeași masă apar implicit pe bonul existent, evidențiate cu un badge pulsant „NOU" (din setările ecranului pot fi afișate și ca bon separat) — nu ca dublură.
- **Expeditor** — ecran special care vede tot, pe 3 coloane (în preparare / gata de servire / finalizate recent), pentru cine coordonează ieșirea farfuriilor.
- **Rutare pe etichete (tag-uri)** — fiecare produs primește o etichetă (ex. „Bucătărie caldă", „Bar"); din Setări → Rutare Taguri legi eticheta de o imprimantă și/sau ecrane KDS, cu posibile excepții per zonă a sălii. Produsele fără etichetă apar ca „nerutate". Regulile sunt legate de locație — nu „scapă" la alt local.
- **Imprimantă de rețea** — imprimantă termică de bucătărie/bar, conectată pe IP în rețeaua locală. Textele românești ies lizibil pe bonuri: diacriticele sunt simplificate automat la litere de bază (ă→a, ș→s, ț→t), ca să nu apară caractere ciudate indiferent de model. Fiecare imprimantă are buton „Testează".
- **Print Agent** — program Windows instalat pe un PC din locație, care primește joburile de printare din Symbai printr-o conexiune securizată în timp real și le trimite la imprimantele locale. Se actualizează singur. Pentru casele de marcat fiscale are două căi: driver nativ Symbai pentru Datecs și Daisy pe port serial (cu detectare automată a portului) sau „folder fiscal" — Print Agent scrie un fișier text într-un folder pe care softul producătorului (Datecs, Partner etc.) îl monitorizează și emite bonul.
- **Cântar / catch-weight** — cântarul fizic se leagă tot de PC-ul cu Print Agent. Prin MCP vezi modelele suportate, înregistrezi cântarul, marchezi produsul ca vândut/valorizat la greutate variabilă și citești greutatea live prin Print Agent când agentul este conectat; dacă nu este disponibil, primești ultima stare raportată. Pentru modele nesuportate folosește `request_scale_integration`.
- **Casă de marcat fiscală** — casa folosită de un angajat e o alegere persistentă per angajat (se schimbă manual din ecranul de operațiuni). Fiecare locație are o casă prestabilită; dacă cea aleasă e offline, bonul fiscal e rerutat automat la cea prestabilită.
- **Server local (Edge)** — un PC din locație care ține POS-ul funcțional și fără internet: dispozitivele lucrează cu serverul local, iar datele se sincronizează cu cloud-ul când revine conexiunea. Panoul local arată rolul serverului (principal/secundar) și starea lui.
- **Recuperare KDS pe Edge** — pe locațiile cu server local principal, dacă o comandă dine-in este marcată ca trimisă la bucătărie dar bonul KDS nu s-a creat (cădere între salvarea produselor și crearea bonurilor), serverul local are o plasă de siguranță: după o fereastră scurtă de așteptare recalculează bonurile lipsă, le creează idempotent, le trimite pe KDS/imprimantă și le sincronizează în cloud. Nu dublează comenzile venite din cloud și nu înlocuiește rutarea corectă pe tag-uri.
- **Installer unic** — pentru fiecare PC se descarcă un singur pachet de instalare (ZIP) care configurează tot ce trebuie pe acel dispozitiv: Print Agent, server local, scurtătura de KDS pe desktop cu pornire automată. Nu există installer separat de KDS.
- **Dispozitiv** — PC/echipament înregistrat în Symbai (Setări → Dispozitive / Edge Server), cu propriul token și installer. Suport la distanță prin agent dedicat.
- **Canal POS** — interfața pe care rulează un dispozitiv: ospătar (`/pos/waiter`), bar (`/pos/bar`), recepție (`/pos/reception`) sau kiosk self-service (`/pos/kiosk`). Scannerul de coduri de bare e suportat pe layout-ul desktop (bar/recepție/retail).

## Paginile modulului

- **Display Comenzi** (`/kitchen/display`) — KDS-ul propriu-zis. Pagina se deschide cu un ecran de selecție („Sistem Afișare Bucătărie") de unde alegi ecranul, creezi unul nou (cardul „Stație Nouă" deschide dialogul „Display Nou" — Principal sau Stație) sau descarci installer-ul pentru PC-ul asociat ecranului; `/kitchen/display/:screenId` deschide direct un anumit ecran. Pe ecran: marchezi bonurile „în lucru → gata" (manual sau cu finalizare automată, după setare), sortezi FIFO (timp) sau pe Prioritate, filtrezi pe etichete, ajustezi densitatea/mărimea cardurilor. Butoane în bara de sus: **Epuizat** (panoul „86" — marchezi produse indisponibile direct din bucătărie, cu căutare și filtru pe categorie), **Sumar**, **Istoric** (bonuri finalizate), **Expeditor**. Din configurarea ecranului setezi: locația, tipul, notificările către ospătar la „în lucru"/„gata" (cu sau fără sunet), modul de adăugări târzii, blocarea pe adrese IP permise. Apăsând pe un produs vezi detalii: poză, stoc live, rețeta și pașii de preparare (inclusiv video dacă există), porții.
- **Expeditor Bucătărie** (`/kitchen/expeditor`) — ecran full-screen pe 3 coloane: „Gătire / Preparare" (buton „Marchează gata"), „Gata de Servire" (butoane „Cheamă" și „Livrat") și „Finalizate Recent". În antet vezi sumarul stațiilor (câte bonuri are fiecare ecran KDS activ), starea conexiunii (rețea + server local/cloud) și un filtru (toate / doar active / livrare).
- **Centru Printare** (`/print`) — printare pentru producție: alegi un lot de producție și printezi **Etichete** (cu dată de start, valabilitate în zile și data de expirare calculată automat; mai multe etichete per lot, fiecare cu imprimanta și numărul ei de copii) sau **Foaie de Producție**; există și buton de print rapid cu setările implicite. Tabul „Foi de Transfer" e în pregătire. Pagina apare în meniu doar dacă modul de producție al contului e cel puțin „Restaurant + Evenimente" (nu apare pe modul simplu).
- **Instalare Print Agent** (`/onboarding/print-agent`) — ghid pas-cu-pas în 8 pași: 1) cum funcționează sistemul de printare (diagrame), 2) adaugi PC-ul ca dispozitiv, 3) generezi token-ul de autentificare, 4) instalezi Print Agent pe PC, 5) adaugi imprimantele de rețea (pe IP), 6) configurezi casa de marcat fiscală (folderul fiscal, extensia fișierului, encoding `windows-1250` pentru diacritice), 7) testezi sistemul, 8) configurezi alertele și regulile de eroare. Erorile detectate automat includ: lipsă hârtie, capac deschis, imprimantă care nu răspunde, agent deconectat, eroare fiscală; recuperarea include reîncercare automată (max. 3 ori), reconectare, joburi păstrate în coadă și rerutare pe altă imprimantă.

## Fluxuri frecvente

1. **Cum ajunge o comandă pe ecran/imprimantă** — ospătarul trimite comanda → fiecare produs e rutat după eticheta lui (Setări → Rutare Taguri) către imprimanta și/sau ecranele KDS configurate → bucătarul vede bonul pe ecran și/sau îl primește pe hârtie → marchează „în lucru" și apoi „gata" → ospătarul primește notificare automată.
2. **Rutezi un produs nou la bar** — pune-i produsului eticheta de bar (din fișa produsului sau cu tool-urile de tag-uri), apoi verifică în Setări → Rutare Taguri că eticheta e legată de imprimanta/ecranul barului. Produsele „nerutate" se pot ruta manual de acolo.
3. **Configurezi un ecran KDS nou** — pe `/kitchen/display` apasă cardul „Stație Nouă", alege numele și tipul (Principal sau Stație), apoi din configurare setează locația și rutarea. Ca să-l legi de un PC fizic: asociază PC-ul cu ecranul (Setări → Edge Server, câmpul „Ecran KDS" la dispozitiv) și descarcă installer-ul unificat — scurtătura KDS apare singură pe desktop, cu pornire automată.
4. **Bonul n-a ieșit la imprimantă** — începe cu `list_printers({locationId, brandId})`: `status` este starea LIVE (`online`, `offline`, `unassigned`, `mobile_local`), iar `statusConfigurat` e doar valoarea din configurare. Dacă e `offline`/`unassigned`, verifică PC-ul/Print Agent înainte de rutare. Apoi verifică istoricul joburilor de printare (Setări → Imprimante): vezi statusul fiecărui bon și poți apăsa „Reîncearcă" (la bonuri fiscale cu confirmare, ca să nu iasă bon dublu). Pentru ecrane, „Monitorizare KDS" (în Setări) arată per ecran sesiunile (când a fost pornit/picat) și fiecare comandă cu semnalul ei de livrare: „Livrat", „trimis fără confirmare", „KDS era stins" sau „nerutat".
5. **Comanda a fost trimisă, dar bucătăria spune că n-a primit-o** — verifică întâi `get_order_timeline(orderId)` și Monitorizare KDS. Dacă produsele apar cu `sentToKitchenAt` dar nu există bonuri KDS, pe Edge principal plasa de siguranță le recuperează automat după aproximativ 1-2 minute și le retrimite pe ecran/hârtie. Dacă nu se recuperează, cauzele probabile rămân rutarea lipsă (produs fără tag / tag fără destinație), ecranul oprit sau serverul local secundar/offline.
6. **Instalezi printarea de la zero** — urmează ghidul de pe `/onboarding/print-agent` (cei 8 pași de mai sus). La final folosește pasul de test ca să verifici fiecare imprimantă și casa de marcat.
7. **Pregătești locația pentru căderi de internet** — instalează serverul local (Edge) pe un PC din locație, prin installer-ul unic per dispozitiv; când pică netul, POS-ul, KDS-ul și printarea continuă local, iar datele se sincronizează la revenirea conexiunii.
8. **Printezi etichete pentru un lot de producție** — pe `/print`, caută lotul, alege tab-ul Etichete, ajustează data de start și valabilitatea (expirarea se calculează automat), alege imprimanta și copiile, apoi „Printează Etichete".
9. **Marchezi un produs epuizat din bucătărie** — pe KDS apasă „Epuizat", caută produsul și marchează-l indisponibil; produsele epuizate apar tăiate cu roșu pe bonuri.

## Tool-uri MCP utile

Citire (disponibile mereu, fără permisiune de modul):
- `list_printers` — vezi imprimantele configurate per locație (înainte de a ruta sau diagnostica). `status` este live: `online` înseamnă Print Agent/PC conectat și imprimanta utilizabilă; `offline` = agent oprit/pierdut; `unassigned` = imprimanta nu are PC gestionar. `statusConfigurat` păstrează valoarea salvată în DB.
- `list_scale_models` / `list_scale_devices` / `capture_weight` — verifici suportul cântarelor, cântarele configurate și greutatea live/fallback la ultima stare raportată.
- `request_scale_integration` — ceri echipei Symbai integrarea unui model nou de cântar, cu producător, model, protocol și mostră de output.
- `list_tags` / `list_tag_summary` — vezi etichetele existente și câte produse are fiecare (baza rutării).
- `list_untagged_products` — găsește produsele fără etichetă (candidate la „nerutat").
- `list_locations` — id-urile locațiilor, necesare la majoritatea tool-urilor de mai sus.
- `gaseste_in_aplicatie` — link direct către orice pagină/setare (ex. „setări imprimante", „rutare taguri").

Scriere (cer modulul de permisiune indicat pe token):
- `create_printer` *(setari)* — adaugă o imprimantă (termică, fiscală, de rețea).
- `create_scale_device` *(setari)* — adaugă un cântar fizic legat de PC-ul cu Print Agent; confirmă cu `list_scale_devices`.
- `create_kds_screen` *(setari)* — creează un ecran KDS nou.
- `create_tag`, `assign_tag`, `bulk_assign_tag`, `bulk_remove_tag`, `auto_tag_from_menu_categories` *(produse_meniu)* — creezi etichete și le pui pe produse, inclusiv în masă (per meniu/categorie/gestiune).

Notă: legarea efectivă etichetă → imprimantă/ecran nu are tool de scriere dedicat — se face din aplicație (Setări → Rutare Taguri). Cu permisiunea SQL activă pe token poți investiga cu `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar citire).

## Întrebări frecvente și capcane

- **De ce n-a apărut bonul pe ecranul KDS?** — Cele mai dese cauze: produsul n-are etichetă sau eticheta nu e legată de ecran (apare „nerutat") ori ecranul era stins. Verifică „Monitorizare KDS" din Setări: vezi per ecran sesiunile și semnalul de livrare al fiecărui bon.
- **Order items au `sentToKitchenAt`, dar bonurile lipsesc. E pierdută comanda?** — Nu presupune pierdere imediat. Pe Edge principal există reconciliere automată pentru comenzile dine-in proprii: creează bonurile lipsă idempotent și le retrimite pe KDS/imprimantă după fereastra de siguranță. Dacă după câteva minute încă lipsesc, investighează rutarea tag-urilor, starea ecranului și rolul serverului local.
- **De ce a ieșit bonul la altă imprimantă / în alt local?** — Rutarea e pe etichete și e legată de locație; verifică în Setări → Rutare Taguri ce imprimantă are eticheta produsului și dacă există o excepție per zonă a sălii.
- **Pot reprinta un bon fiscal pierdut?** — Da, din istoricul joburilor (Setări → Imprimante) cu „Reîncearcă"; la fiscale se cere confirmare ca să nu iasă bon dublu.
- **De ce nu văd „Centru Printare" în meniu?** — Apare doar dacă modul de producție e cel puțin „Restaurant + Evenimente"; pe modul simplu pagina nu e în meniu.
- **Ecranul KDS arată „Acces Restricționat"** — ecranul are blocarea pe IP activată și dispozitivul tău nu e în lista de IP-uri permise; un manager o poate ajusta din configurarea ecranului.
- **A apărut un bon „nou" pe o masă deja trimisă — e dublură?** — Nu neapărat: adăugările târzii pe aceeași masă apar pe KDS marcate cu badge pulsant „NOU" — implicit pe bonul existent, sau ca un card separat dacă ecranul e setat așa. E o adăugare, nu un bon dublu.
- **De ce nu pot șterge ecranul principal?** — Ecranul master nu poate fi șters; doar ecranele stație create de tine.
- **Ce se întâmplă cu bonurile când pică internetul?** — Cu server local instalat, comenzile, KDS-ul și printarea merg în continuare local; totul se sincronizează cu cloud-ul la revenirea conexiunii. Fără server local, dispozitivele depind de internet.
- **Diacriticele ies ciudat pe bonul fiscal** — la modul „folder fiscal", verifică în setările dispozitivului encoding-ul fișierului (`windows-1250` pentru românește). Pe imprimantele de rețea textul iese lizibil pentru că diacriticele sunt simplificate automat la litere de bază — nu apar semne ciudate, dar nici diacritice.
- **Casa de marcat aleasă de angajat e offline** — bonul fiscal e rerutat automat la casa prestabilită a locației; alegerea casei se schimbă manual din ecranul de operațiuni al angajatului.
- **`list_printers` zice online, dar configurarea zice altceva?** — ai grijă la câmpuri: `status` este LIVE și e ce contează pentru „poate tipări acum"; `statusConfigurat` este doar setarea din baza de date. Pentru diagnostic rapid, nu mai cere separat `list_pos_devices` decât dacă vrei numele/starea PC-ului.

## Pentru acces SQL

Tabele relevante: `kds_screens` (ecranele), `kds_sessions` / `kds_events` (sesiuni și evenimente per ecran), `kitchen_tickets` + `kitchen_ticket_items` (bonurile de bucătărie și produsele lor), `printers`, `printer_tag_routes` (rutarea etichetă→imprimantă) și `tag_routing_rules` (rutarea etichetă→imprimantă + ecrane KDS), `print_jobs` / `print_errors` (joburi și erori de printare), `devices` (PC-urile cu Print Agent / Edge).

Exemple de întrebări: „câte bonuri au stat azi peste 20 de minute în preparare", „ce joburi de printare au eșuat săptămâna asta și cu ce eroare", „ce produse au ajuns nerutate luna aceasta".
