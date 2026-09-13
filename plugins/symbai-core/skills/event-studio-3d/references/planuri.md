# Din planul atașat la o clădire 3D verificată

Încarcă `get_event_studio_guide({topic:"plans"})`. Acest flux este pentru Event Studio, inclusiv planuri ISU, hoteluri și parcuri; nu încărca automat instrumentele Fabricii 3D.

## Înainte de construcție

Identifică proiectul, brandul și locația. Inventariază numai fișierele indicate de utilizator: nume, pagini, nivel reprezentat, cote și eventualele imagini 3D. Un plan de situație stabilește așezarea complexului; planurile nivelurilor stabilesc camerele. Randările ajută la materiale și aspect, dar nu înlocuiesc cotele.

Păstrează proveniența separată de propunerea comercială. Dacă subpanta sau o cotă lipsesc, explică precis ce rămâne aproximativ și continuă părțile documentate. Nu fabrica o cameră, o suprafață sau o scară pe baza unei denumiri din legendă.

## Citire privată, la cerere

1. Citește fișierul atașat și calculează mărimea exactă și SHA-256. `start_event_studio_plan` primește proiectul, `requestId` UUID stabil, numele, mărimea și hash-ul. Limita este 80 MB.
2. Trimite fragmente binare codificate separat base64 prin `upload_event_studio_plan_chunk`, în ordinea `nextOffset`, respectând `chunkBytes`. Offset-ul este în octeți decodificați. Repetă aceleași date la retry; verificarea finală a hash-ului detectează transferul incomplet/corupt.
3. `read_event_studio_plan` citește pagina necesară. Pune `includeImage=true` pentru inspecție; apoi citește etichetele paginate fără aceeași imagine repetată. Pentru detalii folosește `crop` în coordonatele originale ale paginii.
4. Folosește `view` și dimensiunile imaginii pentru mapare: coordonata în pagină = originea detaliului + pixel × dimensiunea detaliului / dimensiunea imaginii. Originea este stânga-sus, Y în jos. Nu confunda pixelii previzualizării cu punctele PDF.

Fișierul este temporar, privat și legat de cont/proiect. Nu copia base64 în conversații, memorii sau documentație. `close_event_studio_plan` îl elimină după lucru; sursa geometrică salvată rămâne în proiect.

## Scară și contur

`calibrate_event_studio_plan` cere A/B, distanța lor în **metri**, reperul comun `origin`, rotația și o a doua cotă de control C/D. Controlul trebuie să fie o altă măsurătoare. Dacă diferă cu peste 3%, rezolvă cauza înainte să construiești: unitate, pagină, capete ale cotei, rotație sau scan deformat.

Poți transmite până la 64 puncte trasate și primești coordonatele lor în complex. Pentru fiecare spațiu:

- `x,z` sunt minimul coordonatelor transformate; `width,depth` sunt întinderea conturului.
- `outline` conține punctele locale după scăderea minimelor. Punctele urmează perimetrul în ordine.
- `holes` sunt goluri interioare: atrium, luminator, gol de scară. Nu pune podea sau mobilier peste ele.
- Înălțimea și cota nivelului se citesc din plan/secțiune; nu provin din suprafața camerei.
- Păstrează același reper și aceeași orientare pentru toate etajele și exteriorul.

Sursa întoarsă de calibrare include hash-ul verificat al originalului. Salveaz-o cu `update_event_studio_sources` și pune `sourceId` la spațiile reconstruite. `measured` cere control independent; `derived` marchează deducții explicate, de exemplu o scară dedusă din arie; `estimated` marchează ipoteze. Nu transforma o deducție în măsurătoare confirmată.

Construiește pereți cu `edit_event_studio_architecture`: segmente `from/to`, grosime, înălțime, apoi goluri cu distanța de la început (`offset`), lățime, înălțime și cota bazei (`sill`). `get_event_studio_project(section="walls")` arată inclusiv perimetrul implicit; prima editare îl păstrează. `walls=[]` reprezintă explicit un spațiu deschis. Evită dublarea peretelui comun dintre camere.

## Particularități ISU

Stingătoarele, hidranții, săgețile de evacuare, legendele și etichetele sunt simboluri și informații. Nu le converti automat în mese, stâlpi sau pereți. Urmează contururile fizice și compartimentările și păstrează ieșirile/circulațiile vizibile. Planul poate reprezenta o stare anterioară; verifică diferențele cu utilizatorul. Reconstrucția nu certifică evacuarea, structura sau autorizarea ISU.

## Verificare finală

Compară conturul și aria cu originalul, verifică toate spațiile și variantele, apoi inspectează clădirea din exterior, fiecare nivel, camerele și traseele la nivelul ochilor. Înlătură mobilierul din pereți/goluri și verifică dimensiunile reale ale paturilor, băii, scenei și echipamentelor. Prezintă utilizatorului ce este documentat și ce necesită încă o cotă; nu numi modelul exact dacă sursele nu susțin asta.
