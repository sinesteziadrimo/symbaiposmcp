# Geometrie la scară

Încarcă `get_event_studio_guide({topic:"geometry"})` și, la nevoie, `topic:"objects"` cu un singur `kind`.

Toate dimensiunile sunt în metri. Din centimetri împarți la 100, din milimetri la 1000. Pentru plan PDF, imagine sau plan ISU citește [planuri.md](planuri.md): încarci privat sursa, verifici scara și trasezi încăperile. Nu promite reconstrucție automată din imagine. Dacă lucrezi din estimări sau dintr-o scară derivată din suprafețe, păstrează proveniența și numește explicit limitele în descrierea proiectului.

## Sistemul de coordonate

| Element | Poziție și dimensiuni |
|---|---|
| Nivel | `elevation` este cota podelei în complex, în metri. |
| Sală / cameră | `x,z` este colțul în complex; `width,depth,height` sunt dimensiunile sale; `levelId` indică nivelul. `outline` și `holes` sunt poligoane locale, în metri. |
| Perete | `from,to` sunt capetele locale. Golurile au `offset` de la primul capăt, lățime, înălțime și `sill` de la pardoseală. |
| Obiect | `x,z` este centrul în sala sa, fără adăugarea poziției globale a sălii. `elevation` este cota bazei față de podea. |
| Rotație | `rotation` este în grade în jurul verticalei; dimensiunile rămân cele locale ale obiectului. |
| Mobilier fix | Se pune prin `spaceId`; rămâne în toate configurațiile sălii. |
| Amenajare | Se pune prin `scenarioId`; aparține numai variantei alese. |

**Locurile invitaților trebuie puse în variantă:** mesele, scaunele și canapelele din `spaceId` sunt obstacole fixe, nu intră în numărul locurilor variantei și nu acceptă alocări de invitați. Pentru scaune/ mese care trebuie să rămână pe poziție, folosește `scenarioId` cu `locked:true` și duplică varianta pentru alte propuneri. Nu adăuga încă o copie a aceluiași mobilier în spațiul fix.

O sală de 24 × 28 m are centrul la x=12, z=14 indiferent unde se află în complex. O masă cu lățime de 1,8 m la x=0,5 nu încape complet; adaugă și spațiul ocupat de scaune. Generatorul și validarea iau în calcul scaunele meselor.

## Construcția complexului

`create_event_studio_project` cere nume, unitate, un ID UUID stabil, niveluri și spații măsurate. Folosește `firstScenario` pentru numărul real de persoane și format; fără el se încearcă un banchet de 100 persoane. Rezultatul raportează câte locuri încap, fără să mărească sala.

Pentru extindere, `upsert_event_studio_spaces` primește niveluri complete și modificări parțiale ale spațiilor existente. Un spațiu nou are nevoie de id, nume, nivel, tip, poziție, lățime, adâncime și înălțime. Actualizarea păstrează mobilierul fix. Redimensionarea adaptează conturul și pozițiile pereților, păstrează dimensiunile mobilierului și lățimea ușilor; `sourceAdjusted` semnalează schimbarea unei încăperi provenite din plan. Revalidează după orice schimbare de cote. Ștergerea nivelurilor/sălilor încă folosite cere rezolvarea referințelor din variante, program, trasee și tur.

Modelează separat ballroom, conferințe, foyer, restaurant, terasă, grădină, expoziție, camerele hotelului și spațiile tehnice. `hotelRooms` este o capacitate declarată în propunere; nu creează camere PMS. Reprezintă paturile și compartimentările conform planului, nu doar un număr de camere pe etichetă.

Verifică și raportul dintre etaje: nivelul următor trebuie să respecte înălțimile spațiilor de dedesubt. Validarea nu este o certificare structurală sau de evacuare.

## Obiecte și modele

`edit_event_studio_objects` acceptă exact `spaceId` sau `scenarioId`. Într-un apel poți adăuga, modifica și elimina obiecte diferite, până la 100 pe fiecare listă. Folosește:

- `upsert`: id și tip, plus poziție/dimensiuni; pentru obiectele existente păstrează câmpurile omise.
- `patches`: id și `fields` numai pentru modificările dorite.
- `removeIds`: numai identificatorii verificați.
- `allowLocked`: doar când cererea justifică modificarea obiectelor blocate.

Pentru pereți reali folosește `edit_event_studio_architecture`: segmente, uși, ferestre și pasaje. O fereastră permite vederea, dar oprește mersul. `outline` decupează conturul; `holes` creează goluri în planșeu, fără a ascunde automat toate nivelurile de dedesubt. `walls:[]` înseamnă explicit fără pereți; omiterea pereților păstrează conturul implicit. `ceiling` controlează închiderea de sus.

Accesele vechi `door` rămân compatibile; coloanele sunt `column`, paravanele mobile `partition`. Marchează obstacolele reale înainte de generare. Mesele includ scaunele lor; nu adăuga încă o dată scaune individuale peste acestea. Generatorul păstrează liber accesul prin ușile și pasajele reale.

Pentru circulație, `update_event_studio_navigation` definește capetele traseelor în coordonatele fiecărei încăperi și opririle turului. Nivelurile diferite se leagă prin `stairs` sau `elevator`. Mersul continuu între spații cere puncte apropiate, pe același nivel, cu trecere fizică liberă. Selecția unei destinații permite prezentarea prin opriri; nu dovedește că întregul traseu este accesibil. Testează intrarea, ușile și fiecare oprire în configurațiile pe care le publici.

Pentru arhitectură sau mobilier detaliat, importă GLB/GLTF/OBJ în editorul Event Studio, verificând scara m/cm/mm. Apoi un obiect `custom` poate reutiliza calea GLB internă întoarsă de import. MCP nu descarcă modele de pe URL-uri externe și nu generează automat un model fotorealist. Geometria din interiorul unui GLB nu devine automat obstacol de circulație; adaugă separat volumele importante.

Limite: 30 niveluri, 200 spații, 20 variante, 500 obiecte/variantă, 150 elemente fixe/spațiu, 2.500 obiecte/proiect; 100 pereți/spațiu, 24 goluri/perete, 64 puncte/contur, 12 goluri în planșeu; 300 legături și 40 opriri în tur. Maximum 8 modele GLB distincte și 20 amplasări. Pentru scene mari construiește pe săli și citește pe pagini.
