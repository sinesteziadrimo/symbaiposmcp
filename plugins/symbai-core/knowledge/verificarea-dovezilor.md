# Verificarea dovezilor înainte de răspuns

Accesul Read all permite citirea datelor firmei. Corectitudinea depinde și de identificarea documentului, sensul câmpurilor, filtrele și acoperirea rezultatului. Reutilizează dovezile deja verificate în sarcină; recitește doar ce este necunoscut, contradictoriu sau schimbat.

## Identifică documentul din surse independente

Un număr copiat dintr-o notiță sau citit prin OCR poate avea o cifră greșită. Dacă o căutare exactă nu găsește factura, nu concluziona că documentul lipsește și nu îl importa din nou. Verifică sursa originală și caută țintit după furnizor, dată și sumă. Păstrează ID-ul confirmat, numărul exact și referința sursei. Dacă sursa originală este deja accesibilă în conversație, citește-o înainte să ceri omului să o transcrie din nou.

O căutare goală dovedește numai lipsa potrivirilor pentru filtrele folosite. Înainte de o concluzie de absență verifică aria, perioada, starea și dacă lista este completă. Pentru o întrebare despre un singur document restrânge căutarea; nu parcurge toate facturile dacă ai deja furnizorul, suma și data. Pentru „toate”, continuă paginarea necesară și urmărește ID-urile fără dubluri.

La o listă importată, verifică acoperirea element cu element. Un JOIN poate întoarce două rețete pentru un produs și zero pentru altul, deși totalul rândurilor coincide cu totalul din fișier. Construiește potrivirea pe ID și separă potrivirile confirmate, multiple și lipsă. „Nu sunt duplicate” cere și verificarea variantelor de scriere și a legăturilor de rețetă; o egalitate de nume normalizat nu acoperă greșelile de ortografie. Un raport nu poate spune „toate sunt în ambele meniuri” dacă propriile excepții enumeră poziții lipsă.

## Rânduri șterse, inactive și statusuri: sensul înainte de concluzie

Catalogul păstrează rândurile șterse logic: `products.deleted_at` și `recipes.deleted_at` NOT NULL înseamnă ȘTERS, chiar dacă `active = true` și numele arată ca al unui produs viu (`active` și `deleted_at` sunt independente; ștergerea se citește numai din `deleted_at`). Dublurile din importuri vechi trăiesc exact așa. Orice concluzie despre catalog („e încadrat ca marfă”, „nu are rețetă”, „nu s-a folosit niciodată”, „lipsește”) cere `deleted_at IS NULL` în interogare; `search_products_db` și `get_product_details` exclud sau marchează rândurile șterse și spun câte au ascuns. Inactiv (`active = false`, `menu_items.active = false`) înseamnă scos din uz, nu șters și nu „nevândut”: istoricul vânzărilor rămâne în `order_items`.

Răspunsul `execute_sql_query` aduce `interpretationHints` și, când rândurile vin dintr-un tabel cu ștergere logică, `deletedRowsAudit` („N din M rânduri sunt ȘTERSE”). Sunt fapte verificate de platformă: citește-le înainte de rânduri. `describe_database_table` livrează blocul `semantics` (sens, coloane de ciclu de viață, valorile de status, capcane, șabloane). Pentru dicționarul complet și șabloanele SQL cu filtrele corecte: `citeste_instructiuni_agent(subiect: dictionar_date)`, o dată pe sarcină.

Un negativ cere două surse: interogarea cu filtrele de sens și unealta dedicată a entității. O sumă brută pe `order_items` fără filtrul de status include liniile anulate, transferate și oferite de casă; cifra de vânzări vine din `vanzari_produse`/`raport_vanzari`, iar SQL-ul o explică. O medie a costurilor loturilor nu este cost FIFO și nici costul rețetei.

## Verifică sensul filtrului, nu numai coloana

`describe_database_table` descrie coloane, tipuri și relații. O coloană text numită `status` nu dovedește ce valori folosește entitatea. Reutilizează stările confirmate de schema uneltei sau de date; dacă lipsesc, citește o singură distribuție `GROUP BY status` pentru entitatea și aria vizate. Nu inventa o stare comună precum `active` doar fiindcă există la alte entități.

Un rezultat zero ori `SUM` nul după un filtru presupus nu dovedește că lipsesc loturile sau documentele. Dacă registrul și soldul există, dar interogarea loturilor este goală, verifică întâi filtrul și legătura. După confirmare păstrează schema și stările în context; nu le reciti la fiecare produs.

După prima eroare de coloană necunoscută, citește schema tabelului relevant și corectează interogarea; nu încerca alte nume presupuse. Pentru rapoarte pe locație folosește locația comenzilor/meniurilor, nu gestiunea principală a produsului. Include variantele și componentele relevante înainte de „nu s-a mai vândut după data X” și separă vânzările finalizate de retururi/anulări.

Fișa produsului arată ce este înregistrat, nu dovedește singură ce se prepară efectiv în bucătărie. Spune „rețeta salvată conține...” când aceasta este singura dovadă. Precizarea utilizatorului despre produsul servit poate identifica o fișă greșită; nu o respinge doar pentru că numele sau rețeta salvată diferă.

Un refuz al aplicației gazdă, precum clasificatorul modului automat Claude, este distinct de drepturile MCP Symbai. Păstrează motivul exact și operația refuzată; nu relansa o acțiune echivalentă prin altă unealtă și nu schimba permisiunile ca soluție. Continuă citirile și partea independentă autorizată.

## Separă soldul, loturile și disponibilul

La un transfer verifică mai întâi ruta și disponibilul operațional al produselor exacte, în unitățile stabilite. Un sold pozitiv nu garantează cantitatea transferabilă: contează loturile, rezervările și reconcilierea. Nu înlocui produsul, unitatea sau direcția fiindcă altă variantă are stoc.

La o neconcordanță compară același set de produse și aceeași gestiune: sold, registru, loturi eligibile, rezervări și marcajele de reconciliere. Citește setul împreună. Diferența este o constatare care trebuie urmărită până la documente și cronologie; nu dovedește singură producție lipsă și nu autorizează ajustări pentru egalizarea numerelor.

## Starea documentului și cauza incidentului sunt dovezi diferite

Un NIR `POSTED` confirmă înregistrarea recepției. Nu explică singur o eroare Accounting și nu dovedește sincronizarea contabilă. Pentru cauză corelează documentul și momentul incidentului cu diagnosticul sau jurnalul exact. Nu transforma ipoteza „a fost o a doua încercare” într-un fapt fără dovadă.

Gestiunea din antet nu identifică automat destinația tuturor liniilor. Citește repartizarea efectivă din registru și loturi; un câmp de gestiune sau lot nul pe linie nu dovedește că mișcarea lipsește. Când documentul este deja înregistrat, continuă diagnosticul sau corecția existentă; nu relansa recepția pentru a reproduce eroarea.

Pentru „ce recepții sunt pe gestiunea greșită”, verifică mai întâi metoda pe un document cu repartizare cunoscută, apoi aplic-o listei. Magazia de casă a produsului descrie configurația actuală; nu dovedește destinația istorică sau utilizarea exclusivă la bar/bucătărie. O nepotrivire este candidat de verificat, iar valoarea intrărilor nu este automat pierdere. Separă materiile prime de semipreparate când cererea le distinge. O rețetă se confirmă din fișa și precizările proprietarului, nu din existența ingredientului într-o gestiune.

Pentru „cine a schimbat”, jurnalul filtrat și o pagină recentă nu acoperă automat tot istoricul. Urmează paginarea declarată de versiunea live sau restrânge la entitatea și perioada relevante; consemnează limitele de retenție/acces necunoscute. Zero la un cuvânt și o categorie înseamnă zero potriviri pentru acele filtre. Starea de azi a unei politici nu dovedește că nu a fost schimbată niciodată.

Un motiv standard precum „Anulare manuală din Recepții” nu identifică singur persoana sau interfața care a trimis cererea. Nici absența unui apel MCP în minutul respectiv nu dovedește apăsarea unui buton: pot lipsi înregistrări ori pot exista alte surse. Dacă jurnalul unei ștergeri în masă nu enumeră ID-urile facturilor, corelarea cu perioada rămâne o ipoteză; păstrează această limită și în concluzie. Un timestamp de creare identic între două documente nu dovedește singur reemiterea sau renumerotarea.

Randamentul unui lot poate fi mai mic decât suma ingredientelor din cauza pierderilor reale de proces. O fotografie cu avertismente, o cantitate neobișnuită sau un randament diferit este un motiv de verificare, nu permisiunea de a schimba formula ori de a scala cifra automat. Unitățile și procesul confirmat contează; existența unui ingredient pe stoc nu justifică substituirea lui într-o rețetă.

`get_invoice_reception_warehouse_plan` recalculează alegerile din configurarea actuală, inclusiv pentru o factură deja recepționată. `source` și `sourceLabel` explică acest plan, nu alegerile istorice ale operatorului. Compară planul cu intrările reale pentru o constatare; pentru cauză caută dovezile de la data recepției. Nu declara că „nimeni nu a greșit” sau că o alocare viitoare este garantat greșită doar din planul curent.

## Corectează memoria, apoi încheie verificarea

Un job eșuat descrie încercarea de la `startedAt`/`finishedAt`. După o actualizare sau o corecție a datelor, eroarea veche nu dovedește că aceeași perioadă este încă blocată. Nu prescrie împărțirea intervalului sau inventare compensatoare doar din acel mesaj. Nici o previzualizare a parametrilor nu dovedește succesul execuției complete; spune ce a fost verificat efectiv și ce rămâne de testat în operația autorizată.

Conversiile de ambalaj păstrează și istoric. O regulă folosită des poate fi o eroare corectată ulterior; nu o prefera celei confirmate recent doar după numărul de utilizări. Verifică furnizorul, articolul, unitățile și dovada cantității. Masa brută a ambalajului nu este automat masa scursă sau masa netă servită.

Un cost direct zero sau lipsa rețetei nu este automat o eroare la părintele unui meniu cu componente, al unui platou ori al unei taxe open-bar. Verifică rolul comercial și preparatele/băuturile care descarcă stocul. O alegere deja materializată ca preparat copil nu este încă un supliment; un supliment comandat separat poate fi chiar același produs și trebuie păstrat. Dovada dublării trebuie să lege alegerea, grupul și liniile efectiv consumate, nu doar două nume identice.

Un tag nu garantează trimiterea comenzii într-o altă locație. Verifică aria și configurația ecranului sau imprimantei în contextul comenzii. Firma, brandul, locația și gestiunea sunt axe diferite; existența produsului în catalogul firmei nu dovedește că se vinde în toate meniurile.

Când o dovadă contrazice un răspuns anterior, spune concret ce se corectează și înlocuiește nota greșită. Păstrează separat: fapte confirmate cu sursă și dată, ipoteze încă neconfirmate, decizii ale proprietarului și pași rămași. Un rezultat nou nu modifică singur autorizarea.

Corectează și rezumatul din index, instrucțiunea locală sau raportul care reutilizează concluzia invalidată. Nu adăuga doar o rectificare la final lăsând vechea cauză sigură în titlu sau la început. La reluarea unui task vechi, citește ghidul relevant actualizat și nota curentă înainte să continui diagnosticul; instalarea unui plugin nu rescrie istoricul deja încărcat.

În răspuns spune ce ai verificat, ce rezultă și ce rămâne necunoscut. Nu recita toate citirile. Odată ce identitatea, aria și rezultatul cerut sunt susținute, oprește investigațiile colaterale. Un mesaj care doar confirmă aceeași concluzie nu cere un nou diagnostic sau încă o explicație identică.

Pentru continuitate, o compactare păstrează obiectivul, acordurile, ID-urile, referințele documentelor, operațiile cu rezultat incert, mesajele deja tratate și pașii deschiși. Rezultatele brute vechi se pot recupera la nevoie. Nu șterge sesiunea ca primă soluție pentru un răspuns greșit.
