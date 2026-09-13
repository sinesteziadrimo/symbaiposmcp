# Restaurantul: aceeași configurație în 2D și 3D

`/plan-sala` păstrează configurațiile și mesele existente. „Amenajează în 3D” deschide aceeași zonă cu mobilierul Event Studio, pereți, uși, ferestre și cote în metri. „Vedere POS de sus” revine la planul operațional. Ospătarii continuă să selecteze aceleași mese și să lucreze cu aceleași comenzi, raioane și QR-uri.

## Lucru prin MCP, cu context mic

1. Identifică firma, brandul, locația și `configId` cu instrumentele canonice de plan de sală. Caută numai `get_floor_venue` și `edit_floor_venue`; nu încărca întregul catalog Event Studio pentru o schimbare de înălțime sau material.
2. `get_floor_venue({configId,mode:"desktop"})` întoarce implicit zonele și revizia. Pentru detalii cere `section:"objects"` sau `section:"architecture"` cu `zoneId`. Răspunsurile sunt paginate; continuă cu `pagination.nextArguments`. Obiectele includ identitatea mesei, geometria în metri și coordonatele planului. Arhitectura este împărțită în setări, pereți, contur și goluri.
3. Citește scara înainte de măsurători. Implicit 100 unități de plan reprezintă ilustrativ un metru; acest raport nu dovedește dimensiunea reală. Calibrează `settings.pixelsPerMetre` după o cotă verificată și marchează `scaleConfirmed` numai după verificare. Calibrarea păstrează pozițiile din plan și ajustează interpretarea orizontală a pereților și golurilor; înălțimile sunt independente.
4. `edit_floor_venue` cere `configId`, `zoneId`, `mode` și `revision`. Folosește `settings` pentru arhitectură/materiale/scară; `items:[{itemId,height?,elevation?,color?}]` pentru detalii suplimentare; `decorUpserts` pentru mobilier fără identitate de masă și `decorRemoveIds` pentru retragerea decorului. Fiecare obiect apare o singură dată în lot. `preview` este implicit `true`; aplică lotul verificat cu `preview:false` și recitește rezultatul.
5. Pentru crearea meselor reale, nume, capacități, raioane și geometrie operațională folosește instrumentele canonice din `plan-sala-qr`. `set_floor_table_geometry` / `bulk_set_floor_table_geometry` păstrează legătura rând–canvas și actualizează configurațiile în care apare masa, conform contractului lor. Nu le folosi ca și cum ar modifica exclusiv o variantă. Pentru poziții diferite pe configurație folosește editorul acelei configurații.

`desktop` și `mobile` au amenajări proprii. Când „Layout propriu App” este oprit, ospătarul folosește planul Web. Nu suprascrie planul mobil ca efect secundar al amenajării desktop. Configurațiile blocate/inactive și reviziile vechi sunt respinse la scriere. Un răspuns de previzualizare nu înseamnă salvare. Accesul MCP urmează permisiunile conexiunii; disponibilitatea schemei nu dovedește dreptul de a executa operația.

## Biblioteca comună și prezentarea buyerului

- „Din Event Studio” citește proiectele unității configurației. „Importă sală 3D” acceptă un fișier `.symvenue`. Alege amenajarea; se adaugă o zonă nouă, cu mese și nume distincte. Nu refolosi ID-urile meselor dintr-o altă sală pe presupuneri.
- „Exportă sală 3D” produce un document Event Studio. „Creează prezentare” salvează o copie a amenajării curente în biblioteca unității. În Event Studio poți pregăti variante, meniuri, CRM și linkul buyerului. Copia nu se sincronizează automat cu modificările ulterioare ale planului POS.
- Mesele adăugate în editor devin operaționale prin „Salvează” din planul de sală. Verifică apoi numărul meselor, ID-urile distincte și selecția din POS; o randare reușită nu dovedește materializarea lor.

## Verificare și memorie

Compară vederea de sus cu planul vechi, confirmă scara, dimensiunile și orientarea mobilierului. Verifică ușile în plimbare și pereții în vederea POS. La un plan vechi păstrează identitatea meselor, raioanele, rutarea, QR-urile și amenajarea mobilă. Nu reconstrui planul doar pentru a adăuga detalii 3D.

Păstrează în memoria firmei doar preferințe durabile și referințele configurației/proiectului: stil, materiale, scara verificată și ce cotă mai lipsește. Recitește revizia înaintea fiecărui lot; nu memora scene integrale, liste de clienți, QR-uri secrete sau linkuri private pentru buyeri. Ghidurile publice descriu platforma și nu conțin datele restaurantului.
