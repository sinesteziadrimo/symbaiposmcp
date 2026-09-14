# Verificarea dovezilor înainte de răspuns

Accesul Read all permite citirea datelor firmei. Corectitudinea depinde și de identificarea documentului, sensul câmpurilor, filtrele și acoperirea rezultatului. Reutilizează dovezile deja verificate în sarcină; recitește doar ce este necunoscut, contradictoriu sau schimbat.

## Identifică documentul din surse independente

Un număr copiat dintr-o notiță sau citit prin OCR poate avea o cifră greșită. Dacă o căutare exactă nu găsește factura, nu concluziona că documentul lipsește și nu îl importa din nou. Verifică sursa originală și caută țintit după furnizor, dată și sumă. Păstrează ID-ul confirmat, numărul exact și referința sursei. Dacă sursa originală este deja accesibilă în conversație, citește-o înainte să ceri omului să o transcrie din nou.

O căutare goală dovedește numai lipsa potrivirilor pentru filtrele folosite. Înainte de o concluzie de absență verifică aria, perioada, starea și dacă lista este completă. Pentru o întrebare despre un singur document restrânge căutarea; nu parcurge toate facturile dacă ai deja furnizorul, suma și data. Pentru „toate”, continuă paginarea necesară și urmărește ID-urile fără dubluri.

## Verifică sensul filtrului, nu numai coloana

`describe_database_table` descrie coloane, tipuri și relații. O coloană text numită `status` nu dovedește ce valori folosește entitatea. Reutilizează stările confirmate de schema uneltei sau de date; dacă lipsesc, citește o singură distribuție `GROUP BY status` pentru entitatea și aria vizate. Nu inventa o stare comună precum `active` doar fiindcă există la alte entități.

Un rezultat zero ori `SUM` nul după un filtru presupus nu dovedește că lipsesc loturile sau documentele. Dacă registrul și soldul există, dar interogarea loturilor este goală, verifică întâi filtrul și legătura. După confirmare păstrează schema și stările în context; nu le reciti la fiecare produs.

## Separă soldul, loturile și disponibilul

La un transfer verifică mai întâi ruta și disponibilul operațional al produselor exacte, în unitățile stabilite. Un sold pozitiv nu garantează cantitatea transferabilă: contează loturile, rezervările și reconcilierea. Nu înlocui produsul, unitatea sau direcția fiindcă altă variantă are stoc.

La o neconcordanță compară același set de produse și aceeași gestiune: sold, registru, loturi eligibile, rezervări și marcajele de reconciliere. Citește setul împreună. Diferența este o constatare care trebuie urmărită până la documente și cronologie; nu dovedește singură producție lipsă și nu autorizează ajustări pentru egalizarea numerelor.

## Starea documentului și cauza incidentului sunt dovezi diferite

Un NIR `POSTED` confirmă înregistrarea recepției. Nu explică singur o eroare Accounting și nu dovedește sincronizarea contabilă. Pentru cauză corelează documentul și momentul incidentului cu diagnosticul sau jurnalul exact. Nu transforma ipoteza „a fost o a doua încercare” într-un fapt fără dovadă.

Gestiunea din antet nu identifică automat destinația tuturor liniilor. Citește repartizarea efectivă din registru și loturi; un câmp de gestiune sau lot nul pe linie nu dovedește că mișcarea lipsește. Când documentul este deja înregistrat, continuă diagnosticul sau corecția existentă; nu relansa recepția pentru a reproduce eroarea.

## Corectează memoria, apoi încheie verificarea

Când o dovadă contrazice un răspuns anterior, spune concret ce se corectează și înlocuiește nota greșită. Păstrează separat: fapte confirmate cu sursă și dată, ipoteze încă neconfirmate, decizii ale proprietarului și pași rămași. Un rezultat nou nu modifică singur autorizarea.

În răspuns spune ce ai verificat, ce rezultă și ce rămâne necunoscut. Nu recita toate citirile. Odată ce identitatea, aria și rezultatul cerut sunt susținute, oprește investigațiile colaterale. Un mesaj care doar confirmă aceeași concluzie nu cere un nou diagnostic sau încă o explicație identică.

Pentru continuitate, o compactare păstrează obiectivul, acordurile, ID-urile, referințele documentelor, operațiile cu rezultat incert, mesajele deja tratate și pașii deschiși. Rezultatele brute vechi se pot recupera la nevoie. Nu șterge sesiunea ca primă soluție pentru un răspuns greșit.
