# Verificarea dovezilor înainte de răspuns

Accesul Read all permite citirea datelor firmei. Corectitudinea depinde și de identificarea documentului, sensul câmpurilor, filtrele și acoperirea rezultatului. Reutilizează dovezile deja verificate în sarcină; recitește doar ce este necunoscut, contradictoriu sau schimbat.

## Identifică documentul din surse independente

Un număr copiat dintr-o notiță sau citit prin OCR poate avea o cifră greșită. Dacă o căutare exactă nu găsește factura, nu concluziona că documentul lipsește și nu îl importa din nou. Verifică sursa originală și caută țintit după furnizor, dată și sumă. Păstrează ID-ul confirmat, numărul exact și referința sursei. Dacă sursa originală este deja accesibilă în conversație, citește-o înainte să ceri omului să o transcrie din nou.

O căutare goală dovedește numai lipsa potrivirilor pentru filtrele folosite. Înainte de o concluzie de absență verifică aria, perioada, starea și dacă lista este completă. Pentru o întrebare despre un singur document restrânge căutarea; nu parcurge toate facturile dacă ai deja furnizorul, suma și data. Pentru „toate”, continuă paginarea necesară și urmărește ID-urile fără dubluri.

La o listă importată, verifică acoperirea element cu element. Un JOIN poate întoarce două rețete pentru un produs și zero pentru altul, deși totalul rândurilor coincide cu totalul din fișier. Construiește potrivirea pe ID și separă potrivirile confirmate, multiple și lipsă. „Nu sunt duplicate” cere și verificarea variantelor de scriere și a legăturilor de rețetă; o egalitate de nume normalizat nu acoperă greșelile de ortografie. Un raport nu poate spune „toate sunt în ambele meniuri” dacă propriile excepții enumeră poziții lipsă.

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

`get_invoice_reception_warehouse_plan` recalculează alegerile din configurarea actuală, inclusiv pentru o factură deja recepționată. `source` și `sourceLabel` explică acest plan, nu alegerile istorice ale operatorului. Compară planul cu intrările reale pentru o constatare; pentru cauză caută dovezile de la data recepției. Nu declara că „nimeni nu a greșit” sau că o alocare viitoare este garantat greșită doar din planul curent.

## Corectează memoria, apoi încheie verificarea

Când o dovadă contrazice un răspuns anterior, spune concret ce se corectează și înlocuiește nota greșită. Păstrează separat: fapte confirmate cu sursă și dată, ipoteze încă neconfirmate, decizii ale proprietarului și pași rămași. Un rezultat nou nu modifică singur autorizarea.

Corectează și rezumatul din index, instrucțiunea locală sau raportul care reutilizează concluzia invalidată. Nu adăuga doar o rectificare la final lăsând vechea cauză sigură în titlu sau la început. La reluarea unui task vechi, citește ghidul relevant actualizat și nota curentă înainte să continui diagnosticul; instalarea unui plugin nu rescrie istoricul deja încărcat.

În răspuns spune ce ai verificat, ce rezultă și ce rămâne necunoscut. Nu recita toate citirile. Odată ce identitatea, aria și rezultatul cerut sunt susținute, oprește investigațiile colaterale. Un mesaj care doar confirmă aceeași concluzie nu cere un nou diagnostic sau încă o explicație identică.

Pentru continuitate, o compactare păstrează obiectivul, acordurile, ID-urile, referințele documentelor, operațiile cu rezultat incert, mesajele deja tratate și pașii deschiși. Rezultatele brute vechi se pot recupera la nevoie. Nu șterge sesiunea ca primă soluție pentru un răspuns greșit.
