# Colecții de decor pe care clientul le poate alege

Încarcă `get_event_studio_guide({topic:"decor"})` numai pentru această nevoie. Ghidul oferă forme și colecții de pornire; acestea sunt inspirație, nu inventar confirmat. Reprezintă oferta reală a locației sau marchează explicit că este un demo.

## Oferta locației

Administratorul configurează în biblioteca unității colecțiile `floral`, `photo`, `linen` și `accessory`. Fiecare conține opțiuni cu nume, aspect și, unde se aplică, dimensiuni în metri. `website` este implicit `false`; activează-l pentru colecțiile pe care vizitatorii trebuie să le poată alege. Nu confunda aprobarea decorului cu dreptul de a muta mobilierul.

`get_event_studio_decor` citește colecțiile și revizia separat de geometria proiectului, implicit câte patru. Folosește `groupId` pentru o colecție precisă și continuă paginarea când sunt mai multe. `upsert_event_studio_decor` primește colecțiile complete, maximum 12 într-un lot; proiectul acceptă maximum 24 de colecții cu maximum 12 opțiuni fiecare. Păstrează identificatorii existenți. Eliminarea unei colecții folosite este refuzată; detașează întâi obiectele relevante.

`bind_event_studio_decor` leagă `objectIds` existente dintr-un `scenarioId` de `groupId` și `optionId`. Creează obiectele lipsă prin `edit_event_studio_objects`, apoi leagă-le:

| Colecție | Obiecte compatibile |
|---|---|
| `floral` | `flowers` sau mese `roundTable`, `banquetTable`, `cocktailTable` |
| `linen` | Aceleași trei tipuri de mese |
| `photo` | `photoCorner` |
| `accessory` | `decorAccessory` |

Florile de pe masă și textilele au legături independente. Florile rămân centrate și se deplasează odată cu masa, fără să-i schimbe dimensiunile sau locurile. Lățimea și adâncimea aranjamentului trebuie să fie cel mult 65% din dimensiunile mesei; înălțimea se verifică de la blat până la plafon. Pentru colț foto, testează și cea mai mare opțiune lângă pereți, uși și mobilier.

O alegere se aplică tuturor obiectelor legate de acea colecție în varianta selectată, plus mobilierul comun legat. Pentru zone care trebuie să aibă alegeri independente, creează colecții distincte. Modificarea unui obiect comun trebuie să încapă în toate variantele în care apare. Nu micșora obiectele arbitrar doar pentru a ascunde o suprapunere.

## Propunerea clientului

În copia legată de deal, `select_event_studio_decor` primește `scenarioId` și `selections:[{groupId,optionId}]`. Vânzătorul alege din colecțiile aprobate, inclusiv pentru un obiect cu poziție fixă; nu poate modifica oferta administratorului. `locked` împiedică și alegerea decorului. Folosește revizia citită și `preview:true`, verifică, apoi salvează cu `preview:false` și preia noua revizie.

Compară intenționat două sau trei combinații: de exemplu flori joase ivory cu textile salvie, apoi cascadă florală și colț foto cu panouri. Verifică vederea de sus, 3D și privirea de la nivelul invitatului. Arată dimensiunile și numele opțiunilor, nu doar culoarea. Schimbarea aspectului nu calculează automat un supliment de preț; adaugă separat costurile confirmate în ofertă.

Publică din nou biblioteca pentru ca website-ul să ofere colecțiile actualizate, apoi actualizează componenta `venue-3d`. Publicațiile anterioare păstrează propria versiune. Vizitatorul trimite doar ID-urile alegerilor; serverul reconstituie aspectul aprobat. Colecțiile private nu sunt oferite public.

După o cerere de ofertă, verifică în proiectul dealului alegerile efectiv salvate. Rezumatul și inventarul identifică decorul ales; predarea către eveniment păstrează configurația pentru șeful de sală. O salvare locală în browser nu dovedește salvarea în CRM.

În memoria firmei păstrează doar preferințe durabile, colecții de referință și nivelul verificării. Alegerile unui eveniment rămân în proiectul său, nu se copiază integral în memoria generală. Nu încarcă acest ghid pentru sarcini fără legătură cu decorul.
