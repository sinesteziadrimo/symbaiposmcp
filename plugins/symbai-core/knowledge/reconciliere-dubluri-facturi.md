# Reconciliere — ca marfa să nu intre de două ori și nicio factură să nu se piardă

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

Acest fișier completează `intrari-marfa-receptie.md` (recepția pas cu pas, de la factură la NIR) și `mapare-si-reconversie-facturi.md` (cum devine o linie de factură stoc corect). Pentru privirea de ansamblu pe stocuri vezi `stocuri-inventar-furnizori.md`.

## Pe scurt

Aceeași livrare poate ajunge în sistem pe **trei căi diferite**, adesea toate trei:
1. **poza făcută la recepție** de omul care a primit marfa (factura sau avizul fotografiat);
2. **avizul șoferului**, înregistrat ca recepție ca să intre marfa pe stoc înainte de factură;
3. **e-Factura oficială**, descărcată automat din SPV / ANAF, uneori peste câteva zile.

Toate trei descriu aceeași marfă și aceiași bani. Reconcilierea le unește într-**un singur document**, ca să nu plătești de două ori și să nu intre stocul de două ori. O parte din muncă o face sistemul singur la importul e-Facturii; restul se leagă manual, din tabul **Reconciliere**.

## Concepte

- **Ciornă din poză** — documentul creat din fotografia facturii. Stă în „Avize & Draft" până e aprobat; după aprobare trece în „Facturi Furnizori".
- **Aviz de însoțire** — recepție fizică fără factură. Marfa e pe stoc, factura lipsește încă; documentul rămâne „neînchis" până îl legi de factură.
- **e-Factura oficială** — documentul fiscal descărcat de la ANAF. E singura dovadă fiscală; poza și avizul sunt documente de lucru.
- **Înlocuire** — când factura oficială preia locul unei ciorne, documentul înlocuit rămâne în evidență ca urmă, dar dispare din listele curente de facturi de procesat. Excepție: în tabul Reconciliere poate să mai apară — vezi întrebările frecvente.
- **Atașare** — când marfa a intrat deja pe stoc pe baza pozei, factura oficială nu creează un document nou: identitatea ei fiscală se lipește pe documentul existent.
- **Toleranța de sumă** — diferența acceptată între poză și factura oficială ca să fie considerate același document: **1 leu sau 0,5% din total, cât e mai mare**.
- **Verificare fizică** — marcajul „conformă" / „cu diferențe" (+ notă) pus de cel care a primit marfa. E informație pentru echipă și contabil.
- **Legare (Leagă)** — acțiunea prin care spui sistemului că două documente sunt de fapt unul singur. **Nu se poate desface prin conexiune.**
- **Numărul facturii = cheia** — potrivirea automată se face pe furnizor (după CUI) + numărul facturii. Spațiile în plus se ignoră, dar restul caracterelor contează. Un număr tastat aproximativ face geamănul invizibil.
- **Recepție (NIR)** — documentul care chiar mișcă stocul. Poza, ciorna, avizul și factura sunt hârtii; **doar recepția postată bagă marfa pe stoc**. Marfa intră de două ori doar dacă există două recepții postate.

## Paginile modulului

- **Intrări Marfă** (`/stock-entries`) — pagina-mamă, cu taburile de mai jos.
- **Reconciliere** (tab în Intrări Marfă) — documentele care așteaptă o factură, plus facturile candidate. Badge roșu = ai documente nelegate.
- **Avize & Draft** (tab) — avizele și ciornele neaprobate.
- **Facturi Furnizori** (tab) — toate facturile de intrare, indiferent de sursă.
- **Recepții (NIR)** (tab) — recepțiile create; de aici anulezi/stornezi o recepție greșită.
- **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — controlul periodic: facturi fără recepție, mapări slabe, recepții rămase ciornă.

## Fluxuri frecvente

### 0. Ordinea corectă de lucru (previne 90% din dubluri)
1. Marfa sosește → o primești pe poză sau pe aviz, ca să ai stocul real imediat.
2. Aștepți e-Factura oficială. **Nu introduce manual aceeași factură** în paralel — sistemul o va aduce singur.
3. Când vine, verifici în Reconciliere dacă documentele s-au unit singure. Ce n-a fost unit, legi tu.
4. **Abia apoi** creezi recepția, o singură dată, din documentul unit.
Regula de aur: **un singur document oficial pe livrare, o singură recepție pe factură**.

### 1. Ce rezolvă sistemul singur când vine e-Factura
1. **Caută geamănul**: același furnizor (după CUI) + același număr de factură.
2. **Poza NU era încă aprobată și sumele se potrivesc** (în toleranța de 1 leu / 0,5%) → factura oficială **înlocuiește** ciorna. Rămâne un singur document, cel oficial.
3. **Poza era deja aprobată** (deci probabil marfa a intrat deja pe stoc) și sumele se potrivesc → factura oficială **se atașează** peste documentul existent: identitatea fiscală, antetul și numărul oficial trec pe el, iar un gard oprește crearea unei a doua recepții pe aceeași factură. Dacă recepția are un sold contabil deschis de marfă primită nefacturată, atașarea se amână cu avertisment, tot fără să se creeze un al doilea document.
4. ⚠ **Sumele diferă peste toleranță** → sistemul **nu alege singur și nu importă factura oficială deloc**: o sare, cu avertisment, și rămâne doar documentul tău din poză. E intenționat — o diferență de sumă înseamnă marfă lipsă, o reducere neaplicată sau un preț schimbat, adică o decizie de om. Factura rămâne disponibilă în SPV; după ce lămurești diferența (corectezi poza sau ceri furnizorului o corecție), o reimporți.
5. ⚠ **Dacă singurul document geamăn e un AVIZ**, factura oficială intră ca document nou — avizul și factura sunt lucruri diferite. Legarea lor o faci tu, în tabul Reconciliere.

### 2. Legarea manuală în tabul Reconciliere
1. Deschizi **Intrări Marfă → Reconciliere**. Pe stânga: documentele care așteaptă o factură. Pe dreapta: facturile candidate ale aceluiași furnizor.
2. ⚠ **Deschiderea tabului nu e o simplă privire**: la deschidere/reîmprospătare sistemul leagă singur ciornele **tastate manual** pentru care găsește **exact un** candidat cu **exact același număr** de factură (spațiile și majusculele se ignoră). Dacă sunt doi candidați cu același număr, nu face nimic. Deschide-l când ești pregătit să confirmi, nu „ca să te uiți". Ciornele din poză nu se leagă automat aici — pe ele le rezolvă importul e-Facturii sau le legi tu.
3. Înainte de „Leagă", verifică **cu ochii tăi**: numărul facturii, totalul, data, furnizorul și unitatea.
4. Apeși **Leagă**. Documentul devine unul singur; recepția fizică se lipește de factură.

⚠ **Ce NU verifică „Leagă"**: numărul facturii, suma, data, tipul documentului (un aviz poate fi legat ca și cum ar fi factură) și starea recepției (un document anulat, stornat sau rămas ciornă poate fi legat). Două facturi diferite ale aceluiași furnizor pot fi legate greșit fără niciun mesaj.
⚠ **Bifa verde de „potrivire" din listă e orientativă** — spune doar că totalurile diferă cu mai puțin de 1 leu, atât. Nu ține cont de număr, dată sau linii. Nu te baza pe ea; citește numărul facturii.
⚠ Lista de candidați poate conține și facturi din **altă unitate** a firmei. Confirmă brandul/locația înainte de a lega.
⚠ **După o legare manuală, plasa de siguranță slăbește**: documentul unit păstrează numărul vechi ca cheie internă de căutare, așa că gardul care oprește a doua recepție pe aceeași factură poate să nu mai recunoască geamănul. Cu atât mai mult, verifică tu înainte de „Leagă".

### 3. Ce blochează legarea (și de ce e bine)
- **Recepția are deja legături contabile pe „marfă primită nefacturată"** — fie soldul e încă deschis, fie a fost deja închis printr-o decontare postată. În ambele cazuri legarea rapidă se refuză și se rezolvă prin contabilitate, ca registrele să rămână exacte.
- **Facturile împinse din contabilitate** au identitatea înghețată — nu se mai promovează prin reconciliere.
- **Factura are deja recepție** → nu se mai poate crea a doua pe același document.
Toate trei sunt protecții, nu defecțiuni. Dacă te blochează, întrebarea corectă e „ce document a fost deja înregistrat?", nu „cum forțez".

### 4. Verificarea fizică a mărfii
La primire marchezi recepția **„conformă"** sau **„cu diferențe"** + o notă obligatorie (ce lipsea, ce era deteriorat). E o informație pentru echipă și pentru contabil.
- **Nu blochează** legarea în Reconciliere — deci un document marcat „cu diferențe" poate fi legat fără avertisment. Spune-i explicit celui care leagă.
- **Blochează** doar marcarea recepției ca verificată, până rezolvi nota de diferență.
- Se face **doar din aplicație / din aplicația mobilă**, la recepție. Nu există tool pentru asta prin conexiune.

### 5. Cum previi dublurile
- **Ține furnizorii curați**: CUI completat corect. Potrivirea automată se face pe furnizor + număr de factură; fără CUI, geamănul nu se găsește.
- **Tastează numărul exact ca pe factură**, fără spații în plus. Un zero în față scris altfel poate face ca sistemul să nu recunoască geamănul.
- **Controlul de duplicat la introducerea manuală** te oprește dacă numărul există deja. Se poate opri din Setări → Stocuri, dar atunci pierzi și plasa de siguranță — nu-l opri ca să treci de o eroare punctuală.
- ⚠ **O factură anulată tot ocupă numărul** și refuză reintroducerea. Corectează documentul existent, nu-l reintroduce.
- **Verifică periodic** badge-ul roșu din Reconciliere și pagina **Calitate Inbox Facturi**. Un aviz rămas nelegat = marfă pe stoc fără factură, iar la sfârșit de lună se vede direct în profit.

### 6. Dacă marfa chiar a intrat de două ori
1. **Recunoști** situația: aceeași factură (același număr, același furnizor) apare pe **două recepții postate**, iar produsele ei au stoc dublu față de realitate.
2. **Verifici** cu `list_goods_receipts(supplierId, dateFrom)` și `list_received_efactura(supplierId)` — compară numărul, data și totalul.
3. **Diagnostichezi reversarea înainte de orice scriere** cu `diagnose_inventory_document_reversal(documentId)`, apoi verifici loturile și mișcările din aval. Verdictul de preview este orientativ, nu autorizație de anulare: validarea tranzacțională finală poate opri perioada închisă, alocări apărute între timp, genealogia loturilor, containere sau alte dependențe. Dacă din loturile recepției s-a consumat, transferat sau produs deja ceva, nu presupune că anularea poate retrage „exact loturile": reversarea poate fi blocată ori poate cere întâi refacerea documentelor dependente.
4. **Repari numai cu acord explicit și în ordine cronologică.** Când există dependențe, oprești operațiunile, delimitezi intervalul, refaci/reversezi întâi consumurile dependente prin fluxul lor controlat, verifici soldurile, apoi stornezi recepția greșită. După aceea creezi NIR-ul din factura oficială existentă; nu creezi încă o recepție manuală. Dacă documentul greșit conținea și linii care nu apar pe factură (de exemplu echipamente), recreezi numai acele linii după dovada documentară, nu întregul document.
5. ⚠ **NU corecta printr-o ajustare de inventar.** Ajustarea scade cantitatea, dar lasă recepția și factura în evidență — pierzi urma banilor și rămâi cu o factură „recepționată" de două ori în contabilitate.
6. Dacă recepția greșită a fost deja decontată în contabilitate, perioada este închisă sau dependențele nu pot fi demonstrate complet, oprește-te și rezolvă cu contabilul/echipa tehnică. Nu forța SQL și nu declara cazul închis doar fiindcă totalul stocului pare corect.

## Furnizorul se potrivește pe COD FISCAL, nu pe nume

Cea mai tăcută sursă de dubluri nu e factura, ci **furnizorul dublat**. Potrivirea automată dintre poză, aviz și e-Factura se face pe furnizor + numărul facturii; dacă aceeași firmă stă pe două rânduri în lista ta, ai două istorii separate și geamănul nu se mai găsește niciodată.

De aceea, la recepția din poză, furnizorul nu se stabilește după numele citit de pe hârtie:

1. Se caută **codul fiscal** în lista ta de furnizori — fără prefixul RO, fără spații, fără puncte. Dacă e acolo, se folosește rândul tău existent, cu numele și datele tale. O literă citită greșit de pe factură nu mai poate crea un al doilea furnizor.
2. Dacă acel cod nu e la tine în listă, se cere **denumirea oficială** la ANAF (firme românești) sau VIES (firme din UE) și se mai caută **o dată** în lista ta, cu denumirea oficială. Aici se prinde furnizorul pe care îl aveai deja scris altfel: „MEGA IMAGE" la tine, „MEGA IMAGE S.R.L." la ANAF.
3. Când nu iese sigur — mai mulți candidați, numele de pe document care nu seamănă cu firma căreia îi aparține codul, sau ANAF/VIES care nu răspunde — **te întreabă pe tine**. Nu creează un furnizor nou ca să scape de nelămurire.

Capitolul complet, cu cele trei răspunsuri (confirmat / furnizor nou / alege tu), e în `intrari-marfa-receptie.md`.

> ⚠ **Nu e retroactiv.** Regula asta oprește dublurile **noi**. Furnizorii dublați pe care îi ai deja în listă rămân exact așa cum sunt: nimic nu se unifică singur, în urmă, iar facturile lor vechi continuă să se împartă între cele două rânduri. Curățarea lor e o treabă de făcut o dată, cu mâna.

Cum faci curat, în ordinea asta:

1. **Completează CUI-ul acolo unde lipsește.** Un furnizor fără cod fiscal nu poate fi găsit la primul pas, cel sigur. Îi mai rămâne o șansă — a doua căutare, pe denumirea oficială — dar aceea merge doar dacă ANAF/VIES răspunde și dacă numele pe care l-ai scris tu seamănă destul cu cel oficial. Un CUI completat scapă de tot lanțul ăsta de „dacă". E cea mai ieftină reparație din tot capitolul.
2. **Găsește rândurile care descriu aceeași firmă** — același CUI pe două rânduri, sau denumiri aproape identice („Metro" / „Metro Cash & Carry SRL"). Poți întreba asistentul pe un cod fiscal anume (`resolve_supplier_identity`): dacă în lista ta există mai mulți candidați pe acel cod, ți-i spune pe toți.
3. **Unifică-i**, ca aceeași firmă să aibă un singur rând, apoi verifică facturile rămase nelegate în tabul Reconciliere. Până când unifici, verificarea de duplicat nu are cum să vadă geamănul.

## Tool-uri MCP utile

**Citire (read-only; cere grantul `readModule` al domeniului pe token):**
- `list_received_efactura` — facturile de intrare (filtre: furnizor, brand, status, cu/fără recepție). Documentele înlocuite sunt excluse automat — dacă o factură „a dispărut", cel mai probabil a înlocuit sau a fost înlocuită de un geamăn.
- `get_received_efactura_details` — antetul unei facturi + toate liniile și starea lor. Îl folosești ca să compari două documente suspecte.
- `get_invoice_intake_decision` — verdictul complet pentru o factură: e gata de recepție sau ce anume o blochează.
- `check_new_efactura` — ce facturi sunt disponibile în SPV și care sunt noi.
- `list_pending_nirs` — recepțiile create dar nepostate pe stoc.
- `list_goods_receipts` — recepțiile deja postate (cu furnizor, dată, depozit) — instrumentul principal ca să vezi dacă marfa a intrat de două ori.
- `diagnose_inventory_document_reversal` — preview read-only al blocajelor cunoscute înainte de anulare. Nu înlocuiește validarea finală și nu este suficient singur pentru a executa reversarea.
- `list_reception_notes` — notele de diferență la recepție.
- `list_receptions_to_review` — recepțiile din poză care așteaptă verificarea unui responsabil.
- `resolve_supplier_identity` — cine e de fapt furnizorul de pe un cod fiscal: îl caută în lista ta, apoi (doar dacă e necunoscut) la ANAF/VIES, apoi din nou în lista ta cu denumirea oficială. Îți spune dacă e confirmat, dacă e într-adevăr o firmă nouă sau dacă ai **mai mulți candidați pe același cod** — exact ce cauți când vânezi furnizori dublați. Nu creează și nu modifică nimic.
- `explain_photo_reception` — de ce o recepție din poză a rămas neterminată: furnizorul recunoscut sau nu (și între ce firme trebuie ales), avertismentele analizei (inclusiv factură care pare dublată) și câte linii mai au nevoie de produs.

**Scriere (modul `inventar` = „Stocuri & Recepție"):**
- `import_efactura` — descarcă și importă facturile din SPV. Toate regulile de mai sus (înlocuire / atașare / toleranță) se aplică identic și pe această cale.
- `process_new_efactura` — verifică SPV → importă → creează recepția acolo unde totul e sigur. Folosește-l doar după ce ai explicat proprietarului ce face.
- `create_nir_from_invoice` 🔒 — creează recepția **legată** de o factură existentă. ⚠ Nu folosi `create_inventory_document` pentru o factură care e deja în sistem: ar crea o recepție separată, iar marfa ar intra de două ori.

**Scriere (modul `financiar` = „Financiar & Contabilitate"):**
- `mark_reception_reviewed` — bifează o recepție din poză ca verificată, după ce ai confirmat că e corectă.

⚠ **Nu există tool de reconciliere.** Legarea aviz ↔ factură și ciornă ↔ e-Factura se face **doar din tabul Reconciliere**. Dacă proprietarul o cere prin chat: dă-i linkul (`gaseste_in_aplicatie("reconciliere")`) și lista exactă a documentelor de legat, obținută din citiri (număr, dată, total, furnizor) — el apasă butonul. La fel: desfacerea unei legături greșite și verificarea fizică a mărfii se fac din aplicație. Dacă lipsa unui tool îl blochează, poate cere unul cu `trimite_ticket_symbai`, tip „sugestie".

## Întrebări frecvente și capcane

- **Am pozat factura și apoi a venit e-Factura — se dublează?** Nu, dacă numărul și furnizorul se potrivesc. Ciorna neaprobată e înlocuită de documentul oficial; dacă poza era deja aprobată, factura oficială se atașează peste documentul existent. Dacă sumele diferă peste 1 leu / 0,5%, factura oficială nu se importă deloc — rămâne în SPV până lămurești diferența.
- **De ce văd în Reconciliere un document pe care l-am legat deja?** Tabul nu ascunde documentele deja legate sau înlocuite. Verifică întâi în „Facturi Furnizori" dacă factura are deja recepție (`list_received_efactura` cu filtrul de recepție). Dacă are, **nu o lega din nou** — a doua legare mută recepția pe alt document. Dacă nu are, e într-adevăr nelegată.
- **De ce nu apare e-Factura mea în listă?** Trei cauze, în ordine: (1) a înlocuit deja o ciornă și acum e documentul acela — caută după numărul facturii în „Facturi Furnizori"; (2) importul a sărit-o cu avertisment pentru că sumele nu se potriveau cu geamănul, deci nu a intrat în sistem; (3) e pe altă unitate (brand/locație) decât cea în care te uiți.
- **Sistemul îmi spune că factura e duplicat, dar pe cea veche am anulat-o.** Numărul rămâne ocupat și după anulare. Nu reintroduce factura — corectează documentul existent. Dacă chiar e nevoie de trecerea peste verificare, o face un responsabil care are dreptul de a o suprascrie, o singură dată, în cunoștință de cauză — dar atunci trece și un duplicat real.
- **Am legat greșit două facturi diferite.** Legarea nu se desface prin conexiune. Oprește-te înainte de a crea recepția, deschide documentul în aplicație și cere ajutorul contabilului. Dacă recepția a fost deja postată, nu apăsa direct „Anulează": rulează diagnosticul, verifică dependențele și perioada, obține acordul explicit, apoi urmează fluxul controlat din secțiunea „Dacă marfa chiar a intrat de două ori". De aceea regula e „verifică numărul și suma înainte de Leagă".
- **Butonul Leagă îmi cere să trec prin contabilitate.** Recepția a fost deja decontată contabil (marfă primită nefacturată închisă). Nu e o eroare — legarea rapidă ar dezalinia registrele.
- **Am marcat recepția „cu diferențe" și totuși s-a legat de factură.** Verificarea fizică e informativă pentru reconciliere. Blochează doar marcarea recepției ca verificată. Rezolvă nota de diferență cu furnizorul (stornare, factură de corecție) și abia apoi bifează.
- **Am legat tot corect și marfa tot a intrat de două ori.** Cel mai frecvent motiv: pe lângă recepția legată de factură s-a mai făcut una separată (pe aviz, sau o recepție directă fără factură), iar cele două n-au fost unite. Caută în „Recepții (NIR)" după furnizor + interval de dată: două recepții cu aceleași produse și cantități, la câteva zile distanță. Confirmă documentul greșit și urmează diagnosticul + ordinea sigură din secțiunea 6; nu alege recepția de anulat doar după asemănarea totalurilor.
- **Furnizorul mi-a trimis aceeași marfă pe aviz și pe factură, cu numere diferite.** Sunt două documente diferite pentru o singură livrare. Le legi manual în Reconciliere (avizul pe stânga, factura pe dreapta) — automat nu se potrivesc, pentru că potrivirea merge pe numărul facturii.
- **Am doi furnizori identici în catalog și facturile se împart între ei.** Verificarea de duplicat compară pe furnizor; doi furnizori separați înseamnă două „istorii" separate, deci dublurile nu se mai văd. Unifică furnizorii (același CUI = un singur furnizor) înainte de orice altceva. ⚠ Recepția din poză nu-ți mai creează rânduri noi pentru o firmă pe care o ai deja — dar **nu repară în urmă**: cele două rânduri existente rămân două până le unifici tu.
- **Dacă acum se caută după cod fiscal, dublurile vechi dispar singure?** Nu. Regula nouă previne apariția altora; ce e deja în listă rămâne neatins. Vezi capitolul „Furnizorul se potrivește pe COD FISCAL, nu pe nume" — acolo e ordinea de curățare.
- **Furnizorul meu nu are CUI completat — contează?** Da, foarte mult. Fără cod fiscal ratează pasul sigur (căutarea pe cod) și rămâne să fie prins pe denumirea oficială — ceea ce depinde de răspunsul ANAF/VIES și de cât de aproape e numele scris de tine de cel oficial. Completează CUI-ul la furnizorii pe care îi folosești des; e reparația cu cel mai bun raport efort/rezultat.
- **Am oprit verificarea de duplicat pentru că dădea alarme false.** Atunci ai oprit toată protecția anti-dublă-înregistrare, inclusiv pe cea automată. Repornește-o din Setări → Stocuri și rezolvă cauza reală (de obicei furnizori duplicați în catalog sau numere de factură tastate diferit).

## Pentru acces SQL

Când tool-urile nu ajung, descoperă structura cu `list_database_tables` + `describe_database_table` și pune întrebări **doar de citire** cu `execute_sql_query`, de exemplu:
- facturi de la același furnizor cu același număr, apărute de mai multe ori;
- recepții postate care nu sunt legate de nicio factură, mai vechi de 30 de zile;
- facturi fără recepție, pe furnizor și interval de dată;
- produse cu două intrări în aceeași zi, de la același furnizor, cu aceeași cantitate.
