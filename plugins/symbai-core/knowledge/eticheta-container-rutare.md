# Eticheta de container și unde ajunge fiecare șablon (rutarea etichetelor)

> Când operatorul creează un recipient fizic (tavă, navetă, bax, ladă, palet) și apasă „Printează eticheta", Symbai trebuie să aleagă **UN** șablon dintre toate cele desenate. Acest fișier explică cum alege, cum îi spui tu ce să aleagă, și ce înseamnă când iese o etichetă săracă, mică într-un colț. Desenul propriu-zis al șablonului → `materiale-grafice.md`. Etichetele legate de rețetă/lot → `etichete-productie.md`. Containere, QR și trasabilitate → `productie-fabrica.md`.

## ⚠ READ FIRST — eticheta NU e predefinită, e ALEASĂ dintre șabloanele tale

Cea mai frecventă concluzie greșită a unui client de fabrică: *„am printat eticheta containerului, a ieșit una urâtă și predefinită, deci așa e sistemul și n-o pot schimba."*

Fals. Nu există nicio etichetă „din fabrică" bătută în cuie. Symbai **caută** un șablon desenat de tine, potrivit pentru containerul acela; dacă găsește unul, îl folosește exact așa cum l-ai desenat. Ce a văzut clientul e **plasa de siguranță**: eticheta minimală („de avarie") care iese atunci când căutarea nu găsește NIMIC de folosit — vezi mai jos secțiunea „Dacă eticheta iese mică într-un colț sau arată sărac". Remediul nu e un tichet la Symbai — e legarea unui șablon.

Patru lucruri de reținut:
1. **Șabloanele se desenează în Materiale grafice** (`/graphic-materials`), ca orice alt material, și se pot edita liber oricând — inclusiv cerându-i asistentului să le modifice prin conexiune (MCP), fără clickuri.
2. **Legătura „ce șablon pentru ce marfă" o faci tu**, pe cât de larg sau de fin vrei (de la „tot brandul" până la „paleții din magazia de expediție").
3. **Cine câștigă când două legături se bat cap în cap depinde de PROFILUL ales pentru brandul tău** — nu e o ordine fixă a produsului. Vezi secțiunea despre axe.
4. **Poți întreba asistentul de ce a ieșit o anumită etichetă** — nu trebuie să ghicești, și e mai sigur decât să deduci dintr-un tabel.

## „Etichetă" înseamnă TREI lucruri diferite în Symbai — nu le confunda

Clientul folosește același cuvânt pentru trei obiecte fără legătură între ele. Când cineva zice „eticheta", întâi lămurești care dintre ele:

| Ce zice clientul | Ce e de fapt | Unde se rezolvă |
|---|---|---|
| „pune eticheta de bar pe produs", „produsul e nerutat" | **Tag de rutare** — o grupare pe produs care decide la ce imprimantă de bonuri / ecran de bucătărie ajunge comanda. Nu se tipărește niciodată singură. | `etichete-taguri.md` + Setări → Rutare Taguri |
| „eticheta care iese pe rola de la ambalare", „eticheta de pe palet" | **Șablon tipărit** — un material grafic de tip „Etichetă", cu design, cod de bare/QR și câmpuri care se completează singure. **Despre ăsta e fișierul de față.** | Materiale grafice (desen) + regulile de mai jos (rutare) |
| „eticheta câmpului", „eticheta QR-ului dinamic" | **Un simplu nume de câmp** în interfață (marcaj/denumire). Nu produce hârtie. | — |

Cererea „schimbă-mi eticheta" e ambiguă în bună parte din cazuri. O întrebare de o secundă („eticheta care se TIPĂREȘTE, sau eticheta de rutare a produsului către bucătărie?") îți economisește o oră de lucru pe obiectul greșit.

## Eticheta de CONTAINER vs eticheta de LOT — ce diferă

Sunt două etichete înrudite, dar cu subiect diferit:

- **Eticheta de lot** (cea clasică, din `etichete-productie.md`) descrie **marfa**: denumire, lot, data producției, valabilitate, alergeni, gramaj. Se leagă de rețetă/produs și se printează când lotul e gata.
- **Eticheta de container** descrie **recipientul fizic**: ce cutie/navetă/palet e asta, cu ce cod QR unic, ce conține acum, în ce zonă/gestiune stă. Codul QR de pe ea e identificatorul fizic unic al recipientului (numerele de lot se pot repeta, codul containerului nu) și, scanat, deschide fișa containerului.

Consecință practică des ratată: **un container creat GOL** (recipientul fizic pregătit înainte să intre marfa în el) nu are ce lot să afișeze. Pe eticheta lui, identitatea e **codul containerului**, nu un rând „Lot: …". Nu e o eroare, e comportamentul corect — un rând „Lot:" pus cu forța acolo ar fi o minciună tipărită. Restul câmpurilor care n-au încă date rămân goale până se umple containerul.

Unde se printează eticheta de container: din **Scanner Containere** (`/production/scanner`, web), de pe **Tableta de Stație** (`/workstation-tablet`) sau din aplicația **Symbai Staff** (tabul Fabrică → Etichete, pentru ultimul container scanat). Detalii despre containere, împachetare, split/merge → `productie-fabrica.md`.

## Cele 8 axe de rutare — și de ce ordinea LOR ține de profilul tău

Un șablon (dar și o imprimantă, și numărul de copii) se poate lega de oricare dintre opt „axe", de la cea mai punctuală la cea mai largă:

| Axa | Ce înseamnă în realitate | Când o folosești |
|---|---|---|
| **Stație de lucru** | postul/tableta de la care se printează | ambalarea scoate altă etichetă decât cântărirea, deși e același produs |
| **Operator** | omul care apasă print | rar — excepții punctuale („imprimanta mea") |
| **Tip de container** | tavă, navetă, bax/cutie, ladă, **palet** | paletul primește eticheta mare cu QR mare; baxul, una mică |
| **Tip de produs** | categoria mărfii (materie primă / semipreparat / produs finit…) | semipreparatele au etichetă de bucătărie, finitele una comercială |
| **Zonă** | zona de producție/depozitare | zona de rework are eticheta ei, ca să se vadă din ochi |
| **Gestiune (magazie)** | depozitul în care stă marfa | magazia de expediție → eticheta logistică; magazia de producție → cea internă |
| **Locație** | unitatea fizică (fabrica, depozitul) | când o fabrică are alt format de etichetă decât alta |
| **Brand** | firma/brandul | **plasa ta de siguranță** — regula care prinde tot ce n-a fost prins altfel |

⚠ **Ordinea în care se citește tabelul de mai sus NU e fixă și NU e o lege a produsului.** Nu învăța o scară pe de rost — află-o pentru brandul clientului. Patru lucruri de reținut, toate contraintuitive:

### 1. Cine câștigă depinde de PROFILUL ales pentru brandul tău

În **Setări → „Etichete (Zebra)" → „Profil de fabrică"** alegi cum lucrează fabrica ta, iar profilul stabilește ordinea axelor. Profilele gata făcute au ordini **diferite**:

| Profil | Cine are prioritate | Pentru cine |
|---|---|---|
| **Restaurant / bar** | stația (și, ca excepție, operatorul) | o singură imprimantă de etichete — de obicei nici nu configurezi nimic, se alege singură |
| **Fabrică mică alimentară** | stația | fiecare stație/tabletă cu imprimanta ei lângă operator: eticheta iese unde stai |
| **Fabrică mare / multi-linie** | **tipul de produs**, apoi tipul de container | procedură strictă: un produs/o linie merge întotdeauna pe imprimanta ei, indiferent cine printează. Stația e doar rezervă |
| **Fabrică nealimentară** | **zona**, apoi gestiunea | rutarea urmează LOCUL: fiecare zonă/depozit are imprimanta ei |

Exemplu concret de ce contează: ai o regulă pe **stația de Ambalare** și una pe **zona de Expediție**, și printezi dintr-o situație care le atinge pe amândouă. La profilul de fabrică mică alimentară câștigă stația; la cel nealimentar câștigă zona. **Aceleași reguli, alt rezultat** — schimbat doar din profil, fără să atingi nimic altundeva. Poți porni dintr-un profil și apoi ajusta.

### 2. Implicit, STAȚIA e deasupra OPERATORULUI

Toate profilele livrate pun stația (tableta/PC-ul de unde printezi) înaintea operatorului: eticheta iese **unde stai**, iar „imprimanta mea" e doar o excepție punctuală. Există un comutator dedicat (Stație ↔ Operator) dacă vrei invers — „imprimanta mea mă urmează pe orice stație".

### 3. Sunt DOUĂ precedențe, nu una: imprimanta și șablonul se decid diferit

- **Imprimanta** urmează LOCUL — deci ordinea profilului tău (stația, operatorul, zona… după caz).
- **Șablonul și formatul** urmează AMBALAJUL: aici **tipul de container e urcat forțat pe prima poziție**, indiferent de profil. Un palet cere eticheta de palet oriunde l-ai printa.

De ce contează: o regulă pe operator („imprimanta mea") **nu** poate suprascrie șablonul cerut de tipul recipientului. La imprimantă, tipul de container e o axă ca oricare alta; la șablon, bate aproape tot.

### 4. Regulile se COMBINĂ, nu se opresc la prima potrivire

Nu există „prima regulă care se potrivește câștigă". Se iau în calcul **toate** regulile care se potrivesc pe situația curentă, fiecare primește o greutate = **suma tuturor axelor setate pe ea**, iar câștigătoarea se alege **pe fiecare câmp în parte**: imprimanta poate veni dintr-o regulă, șablonul din alta, numărul de copii din a treia, dimensiunea cerută din a patra.

Consecință practică des ratată: **o regulă cu mai multe axe „slabe" poate bate o regulă cu o singură axă „tare"**. „Zona Rework + magazia Producție + tip container navetă" adună mai multă greutate decât o singură regulă pe stație. De aceea nu poți deduce rezultatul citind tabelul — și de aceea secțiunea următoare (cere explicația) e mai sigură decât orice raționament.

**Recomandarea de bun-simț**, valabilă la orice profil: pune ÎNTÂI o regulă pe brand (plasa de siguranță), apoi rafinează cu excepții. Nu trebuie să definești toate cele 8 axe — majoritatea fabricilor trăiesc foarte bine cu 2–4 reguli. Cu o regulă pe brand nu mai vezi niciodată eticheta de avarie.

Pe lângă reguli, mai există **legături directe** — „pentru produsul/rețeta asta, șablonul ăsta" și „operația de ambalare din flux scoate șablonul ăsta, în N copii, automat la finalizare" (vezi `etichete-productie.md`, secțiunea de fabrică). Legătura directă pe operație e cea mai comodă când toată producția trece prin aceeași stație de ambalare.

## Cum îi spui concret asistentului ce vrei

Vorbește în limbajul tău, cu numele reale ale magaziilor/zonelor/șabloanelor tale. Exemple care se rezolvă direct:

- „**Containerele din magazia Expediție, tip palet, folosesc șablonul «Eticheta logistică GS1 110×150».**"
- „Toate containerele din zona Rework ies pe «Eticheta rework/semipreparat 70×105»."
- „Pe stația de Ambalare, indiferent de produs, folosește «Eticheta produs finit 70×105», 4 copii."
- „Pune «Eticheta standard 70×105» ca regulă pe tot brandul, ca plasă de siguranță."
- „Pentru produsele de tip Semipreparat vreau șablonul X, dar la fabrica din Arad vreau Y."
- „Desenează-mi o etichetă de palet 110×150 cu QR mare pe jumătate de etichetă, denumirea produsului sus și lotul jos, și leag-o de paleți."

Ce se întâmplă în spate: asistentul îți desenează/alege șablonul în Materiale grafice și îl leagă la treapta cerută. Dacă un lucru anume nu se poate face prin conexiune, ți-o spune și te duce pe pagina din aplicație — nu inventează că a făcut-o.

## Cum ceri asistentului să-ți EXPLICE de ce a ieșit o anumită etichetă

⚠ **Asta e calea sigură — nu deduce rezultatul din tabelul de axe.** Ordinea depinde de profil, șablonul are propria precedență, iar regulile se adună între ele. Sistemul îți poate spune direct ce a ales și din ce regulă a venit fiecare bucată; e și robust la orice ajustare viitoare a motorului, pe când un raționament din tabel nu e.

- „**De ce a ieșit eticheta asta la containerul CTR-…?**" / „ce șablon a fost ales și de ce"
- „Ce etichetă primește un palet din magazia Expediție? Și pe ce imprimantă?"
- „Ce profil de fabrică am setat pe brand și ce ordine de precedență înseamnă?"
- „Arată-mi toate regulile de etichetă pe care le am și pe ce se aplică fiecare."
- „Am legat vreun șablon de containere? Pe ce axă?"
- „Ce imprimante de etichete am, ce rolă are declarată fiecare și care e activă acum?"

Răspunsul util spune **separat** de unde vine fiecare lucru: *„Imprimanta: «Zebra Ambalare», dată de regula pe stație. Șablonul: «Eticheta logistică 110×150», dat de regula pe tip container = palet. Copii: 4, din regula pe brand."* Sau: *„Nu s-a găsit niciun șablon legat de marfa asta — a ieșit eticheta de avarie."* În al doilea caz treci la secțiunea următoare.

Același verdict se vede și în aplicație, fără să întrebi: în **Setări → „Etichete (Zebra)"**, la regulile de rutare, alegi o situație (stație, tip de container, magazie…) și panoul „Rezultat la print" îți arată imprimanta, șablonul, motivul fiecăruia și lanțul de reguli care se aplică. E simulatorul oficial — folosește-l înainte să schimbi ceva.

## Dacă eticheta iese mică într-un colț sau arată sărac

Sunt exact **două cauze reale**, și se disting într-un minut. Nu trata simptomul (nu redesena șablonul degeaba) până nu știi care din ele e.

### Cauza 1 — nu e legat NICIUN șablon de marfa aia → iese eticheta de avarie

**Cum arată**: **fără logo, fără culori, fără machetare** — text simplu și un QR, cu **aceeași așezare de fiecare dată, indiferent de șablonul pe care l-ai desenat tu**. Ăsta e semnul de recunoaștere.

⚠ Nu o confunda cu „o etichetă goală": eticheta de avarie **chiar scrie datele mărfii** — denumirea produsului, identitatea recipientului (codul lui), lotul, cantitatea, data, valabilitatea, condiția de păstrare și etapa. Deci **conținutul VARIAZĂ** de la un recipient la altul, și de aceea mulți clienți nu-și dau seama luni de zile că nu se folosește șablonul lor. Semnul nu e „scrie mereu la fel", ci „nu seamănă cu nimic din ce am desenat eu".

**Ce e**: plasa de siguranță. Când rutarea nu găsește niciun șablon legat, Symbai scoate o etichetă minimală în loc să lase un recipient fizic neidentificat pe fluxul de producție. E o degradare intenționată, nu un defect: mai bine un cod lipit pe navetă decât o navetă anonimă. Dar nu e ce vrei pe termen lung. Dacă rola nu e declarată (vezi Cauza 2), eticheta **tot iese** — pe o coală presupusă de 50×30 mm — iar aplicația îți spune negru pe alb că a presupus. Printul nu se blochează niciodată pentru o configurare lipsă: o etichetă care nu iese oprește linia.

**Capcana clasică**: fabrica ARE șabloane frumoase desenate în Materiale grafice — dar niciunul **legat** de ceva. Desenat ≠ legat. Un șablon nelegat nu ajunge niciodată pe rolă singur.

**Remediul, pas cu pas**:
1. Vezi ce șabloane de etichetă ai deja („arată-mi șabloanele mele de etichetă").
2. Dacă nu ai unul potrivit pentru containere, cere-l: „desenează-mi o etichetă de container 70×105 cu QR mare, denumire, cod, lot, cantitate".
3. **Leagă-l** — începe cu plasa de siguranță pe brand: „pune șablonul X ca regulă pe tot brandul".
4. Rafinează dacă e cazul (palet ≠ navetă, expediție ≠ producție) — vezi exemplele de mai sus.
5. Printează o etichetă de probă pe rola reală și uită-te la ea. Nu declara „gata" pe baza previzualizării de pe ecran.

### Cauza 2 — rola imprimantei nu e declarată, sau e declarată greșit

**Cum arată**: designul tău se vede, dar nu încape pe hârtie — conținut înghesuit într-un colț, text tăiat la margine, sau o etichetă mică pierdută pe o rolă lată, cu 90% hârtie albă.

**Ce e**: imprimanta de etichete trebuie să știe **ce rolă e fizic pusă pe ea** — lățimea × înălțimea în mm și rezoluția (DPI; 203 e standardul). Dacă e declarată **greșit** (ai schimbat rola pe imprimantă și n-ai actualizat setarea), aranjarea se face pentru altă dimensiune decât hârtia reală — de acolo vin tăierile și colțurile.

⚠ **Ce se întâmplă când rola NU e declarată deloc — depinde de cale, și asta schimbă triajul:**

| Situația | Ce face Symbai |
|---|---|
| Eticheta de container fără șablon legat (cea de avarie) | **Refuză printul**, cu mesaj explicit: „nu are declarată dimensiunea rolei, completeaz-o în Setări". Nu ghicește o dimensiune, fiindcă o presupunere greșită scoate marfa cu etichetă de altă mărime. |
| Ai un șablon legat | **Tipărește, fără nicio eroare și fără niciun avertisment** — la dimensiunea la care ai desenat șablonul. Dacă rola fizică e alta, eticheta iese tăiată sau pierdută pe hârtie, și nimic pe ecran nu ți-o spune. |

Concluzie pentru triaj: **absența unui mesaj de eroare NU dovedește că rola e în regulă.** Dacă o etichetă cu design iese tăiată, verifică rola declarată ÎNAINTE să bănuiești șablonul — altfel redesenezi degeaba un șablon corect. Symbai poate compara rola cu formatul cerut de ambalaj doar când **amândouă** sunt declarate; cu rola nedeclarată n-are cu ce compara și tace.

Atenție la **orientarea rolei**: o rolă 70×105 mm e în **portret** (mai înaltă decât lată), una 100×50 mm e în **peisaj**. Nu e același lucru cu 105×70 și nu poți inversa numerele „ca să iasă".

**Remediul, pas cu pas**:
1. Uită-te fizic la rola din imprimantă și notează lățimea × înălțimea în mm (scrie pe cutia rolei).
2. Setări → Imprimante → imprimanta de etichete: declară dimensiunea rolei și DPI-ul. La fabrici cu mai multe imprimante de etichete pe role diferite (ex. trei pe 70×105 și una pe 110×150), **fiecare** își are propria declarație — nu se moștenesc între ele.
3. Dacă ai o imprimantă inactivă/scoasă din uz, lasă-o inactivă; nu o folosi ca „rezervă" cu o rolă necunoscută.
4. Printează o etichetă de probă și verifică marginile.
5. **Ori de câte ori schimbi tipul de rolă pe o imprimantă, actualizează setarea.** E cel mai frecvent motiv pentru „mergea săptămâna trecută".

### Cele două cauze se pot suprapune

O fabrică fără șabloane legate ȘI cu rola nedeclarată tipărește o etichetă minimală pe o coală presupusă — iese, dar la altă dimensiune decât rola montată, și ți se spune asta la fiecare print. Rezolvă-le în ordinea asta: **întâi rola** (ca să vezi corect ce printezi), **apoi legătura șablonului**.

Capcana e situația inversă și mult mai frecventă: **ai un șablon legat, dar rola nedeclarată**. Atunci nu primești niciun semnal — eticheta iese, doar că poate ieși tăiată. Verifică rola chiar și când „nu dă nicio eroare".

## Cheatsheet: ce-ți zice clientul → ce faci

- „**Eticheta e predefinită, nu o pot modifica**" / „așa scoate sistemul" → NU confirma. Explică plasa de siguranță, arată-i ce șabloane are, leagă unul. E cel mai frecvent caz.
- „Am dat print la container și a ieșit urât / mic într-un colț" → întrebi ce rolă e pe imprimantă și dacă e declarată; în paralel verifici dacă există vreun șablon legat. Cele două cauze de mai sus.
- „Unde schimb eticheta containerului?" → șablonul se desenează/editează în Materiale grafice; „unde ajunge" se decide prin regula/legătura pe una din cele 8 axe. Amândouă se pot face prin asistent.
- „De ce iese eticheta mică?" → rola nedeclarată sau declarată greșit (cauza 2). Verifică înainte să redesenezi ceva — mai ales dacă printul NU a dat nicio eroare.
- „Vreau altă etichetă pe paleți decât pe navete" → regulă pe **tip de container**. Pentru ȘABLON e axa cu prioritate specială, deci ține la orice profil.
- „Vreau ca marfa de expediție să iasă cu eticheta logistică" → regulă pe **gestiune**. Cât de tare bate depinde de profilul brandului — verifică rezultatul în simulator.
- „Care regulă câștigă?" / „e mai tare stația sau operatorul?" → **nu răspunde din memorie.** Întâi profilul brandului, apoi simulatorul „Rezultat la print". Regulile se adună, iar șablonul are altă precedență decât imprimanta.
- „De ce a ieșit exact eticheta asta?" → ceri explicația rutării (vezi secțiunea dedicată); nu presupune.
- „Eticheta e goală pe câmpul X" → câmpul e corect dar marfa n-are acea informație (container gol, lot nedeclarat). Vezi capitolul de câmpuri din `etichete-productie.md`.
- „Vreau eticheta de rutare la bucătărie, nu asta" → e alt obiect: `etichete-taguri.md`. Verifică ÎNTÂI despre care „etichetă" vorbește.

## Reguli & capcane (cele care contează)

- **Desenat ≠ legat.** Un șablon frumos care nu e legat de nimic nu iese niciodată singur pe rolă. Cel mai des defect de configurare la fabrici noi.
- **Eticheta de avarie e o plasă, nu o pedeapsă.** Sistemul preferă un recipient identificat minimal decât unul anonim. Dar dacă o vezi, ai o configurare de făcut — nu o ignora. Semnul ei: fără logo, fără culori, aceeași așezare mereu (deși datele mărfii se schimbă de la un recipient la altul).
- **Nu există o scară fixă a axelor.** Cine câștigă depinde de **profilul de fabrică** ales pentru brand; profilele livrate au ordini diferite. Nu promite un rezultat pe baza tabelului — verifică profilul și simulatorul.
- **Regulile se combină, nu se opresc la prima.** Fiecare regulă cântărește cât suma axelor puse pe ea, iar alegerea se face pe fiecare câmp separat (imprimantă / șablon / copii / dimensiune). O regulă cu trei axe „slabe" poate bate una cu o singură axă „tare".
- **Tipul recipientului are prioritate specială la ȘABLON.** La imprimantă e o axă obișnuită; la șablon și format e urcat pe prima poziție, ca o regulă pe operator să nu suprascrie tăcut eticheta cerută de ambalaj.
- **Stația e implicit deasupra operatorului** (se poate inversa dintr-un comutator).
- **O regulă pe brand nu „strică" excepțiile**; le completează, ca plasă de siguranță.
- **Rola se declară.** Și se re-declară când o schimbi fizic. La eticheta minimală, fără ea se tipărește pe o coală presupusă și ți se spune; cu un șablon legat, lipsa ei NU dă niciun semnal — poate ieși tăiată. Deci verific-o oricum.
- **Portret ≠ peisaj.** 70×105 (înaltă) și 105×70 (lată) nu sunt aceeași rolă. Nu inversa numerele „ca să iasă".
- **Verifică pe hârtie, nu pe ecran.** Previzualizarea nu îți spune dacă rola reală taie marginea.
- **Containerul gol se identifică prin cod**, nu prin lot. Nu forța un rând „Lot:" pe el.
- **Nu inventa** șabloane, reguli sau nume de magazii în răspunsuri — citește ce are clientul și lucrează cu ce există.
- **Permisiuni**: desenul materialelor ține de modulul „Marketing & Social Media"; printarea și containerele țin de Producție. „Permisiune insuficientă" → portal Hub → Acces AI.

## Legături

- Cum DESENEZI și editezi șablonul (elemente, cod de bare, QR, aranjare, brand) → `materiale-grafice.md` + skill `materiale-grafice`.
- Etichetele legate de rețetă/lot, câmpurile care se completează singure, valabilitate & alergeni, print pe operație din flux → `etichete-productie.md` + skill `etichete-productie`.
- Containere, coduri QR, scanner, împachetare palet, reguli de manipulare → `productie-fabrica.md`.
- Imprimante de etichete, configurare, testare, stare online/offline → `echipamente-kds-imprimante.md`.
- Magazii, gestiuni și zone (două dintre axele de rutare) → `gestiuni-magazii-zone.md`.
- Tagurile de rutare a bonurilor (celălalt înțeles al cuvântului „etichetă") → `etichete-taguri.md`.
- Printare din aplicația mobilă (Symbai Staff, tabul Fabrică → Etichete) → `expo-aplicatii-mobile.md`.
- Pagina exactă → `gaseste_in_aplicatie("materiale grafice")` (desen) / `gaseste_in_aplicatie("scanner containere")` (print).
- Blocaj real (ceva ce nu se poate nici din app, nici prin conexiune) → `trimite_ticket_symbai`.
