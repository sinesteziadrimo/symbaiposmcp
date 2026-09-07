# Manager de producție: un plan posibil în fabrica reală

Folosește [productie-flux](../../productie-flux/SKILL.md) și [coordoneaza-comenzile-si-productia](../../coordoneaza-comenzile-si-productia/SKILL.md). Pregătirea turei, planificarea și execuția fizică sunt pași distincți.

## 1. Context și cerere

Verifică firma, brandul, locația și gestiunea. Gestiunea este ancora planificării; nu prelua una din exemple sau din alt tenant. Identifică fabrica, bucătăria centrală ori restaurantul și folosește modul său real.

`get_factory_forecast_plan` este sursa pentru cererea autoritară a fabricii. Verifică intervalul, metoda și acoperirea. Predicția statistică și acuratețea ei ajută la evaluarea incertitudinii, dar nu înlocuiesc reconcilierea planului cu comenzile ferme. Propunerile din email și drafturile nu devin automat cerere fermă.

Separă liniile produse în fabrică de cele din depozit central sau de la furnizor direct. Nu programezi producție pentru o linie care trebuie doar aprovizionată sau pregătită din stoc.

## 2. Poate porni și poate termina?

Verifică fluxul/rețeta sau lista de materiale, loturile și planificările existente, materialele eligibile, utilajele și oamenii disponibili. Ia în calcul calendarul comun, nu doar fiecare comandă izolată.

Pentru date insuficiente, `get_advanced_planning_readiness` poate identifica lipsurile de configurare; verifică schema live și gestiunea. Un audit de pregătire nu este o simulare de fezabilitate. Folosește `get_production_schedule_feasibility` pentru simularea concretă disponibilă și `plan_b2b_order` pentru planul unei comenzi identificate.

Distinge:

| Rezultat | Ce îi spui omului |
|---|---|
| Fezabil calculat | Pentru ce interval, selecție și resurse este valabil. |
| Conflict demonstrat | Resursa/materialul, cantitatea/timpul și comenzile afectate. |
| Date sau acces lipsă | Ce nu s-a putut verifica; nici „fezabil”, nici „nu se poate”. |

Nu fabrica durate, randamente, personal calificat, capacitate infinită sau rezultate de control pentru a obține un plan favorabil. O rezervă de timp poate fi propusă ca scenariu, nu introdusă în date ca fapt.

## 3. Predă deciziile înainte de aplicare

Pentru fiecare blocaj arată ce poate rezolva producția, ce trebuie să confirme achizițiile și ce decizie revine managerului. Include data la care materialul trebuie să fie utilizabil, nu numai data livrării către client.

Opțiunile sunt scenarii: schimbarea ordinii, o tură suplimentară, o livrare parțială sau alt termen se evaluează cu costurile și limitele cunoscute. Nu le prezenta ca aplicate sau aprobate implicit.

Un plan B2B aprobat se aplică pe aceeași comandă/gestiune cu `approvalToken` și opțiunile explicite. Pentru materiale se păstrează și verificarea de aprovizionare cerută. Dacă aplicarea turei întoarce `necesitaReaprobare=true`, recitește planul recalculat; loturile și achizițiile nu sunt încă făcute. Detaliile exacte sunt în ghidul de coordonare.

După orice aplicare autorizată, recitește documentele și recalculează restul portofoliului: capacitatea sau stocul consumate nu mai sunt aceleași. Un rezultat incert cere verificarea dovezii înainte de retry.

## 4. Execuția rămâne legată de realitate

Pornirea operațiilor, consumul, producția declarată, transferurile și eliberarea calitativă urmează operațiunile și permisiunile lor. Nu marca o sarcină sau operație ca terminată pe baza unui mesaj vag. Nu inventa măsurători QC/HACCP și nu ridica o blocare pentru a respecta un termen.

La predarea turei arată: realizat confirmat, în curs, rest de produs, blocaje, materiale și documentele de urmărit. Separă diferența față de plan de cauzele doar presupuse.

## Pentru operator, responsabilul de calitate sau mentenanță

Adaptează pregătirea la postul omului: operația sau utilajul atribuit, lotul, instrucțiunea aplicabilă, materialele și ce îl împiedică să înceapă. Nu îi preda planul și datele confidențiale ale întregii firme dacă nu îi sunt necesare sau permise.

Caută aceste unelte după numele exact și citește schema disponibilă, ca să pornești din informația potrivită postului:

| Post | Prima citire potrivită | Limita rezultatului |
|---|---|---|
| Operator | `get_operator_assignments` cu identitatea verificată, gestiunea canonică și data turei | Specializarea pe un utilaj nu dovedește că omul este alocat unei operații; separă calificările, tura și sarcinile efectiv întoarse. |
| Calitate | `list_quality_holds`, `list_quarantine_lots`; pentru lotul ales, `list_qc_inspections` | O blocare poate rămâne activă și pe un lot cu sold zero. Separă dosarele deschise de marfa rămasă blocată; nu însuma cantități fără unități verificate. |
| Mentenanță | `list_equipment_downtime` pentru intervalul ales; `list_production_equipment` în aria permisă | Opririle programate exclud echipamente din planificare. Lista goală nu certifică starea fizică a utilajelor și nu acoperă automat toate incidentele sau reviziile preventive. |

Dacă omul nu are operații sau ture atribuite în datele citite, spune acest lucru și cere postul ori lotul la care lucrează; nu îi inventa sarcini. Dacă lipsește accesul sau unealta, arată verificarea rămasă deschisă. Nu extinde drepturile și nu înlocui citirea cu o acțiune de modificare care apare în căutare.

Pentru calitate, arată verificările scadente, dovezile lipsă și loturile blocate; folosește procedura reală și [gestioneaza-haccp](../../gestioneaza-haccp/SKILL.md) când se aplică. Pentru mentenanță, arată incidentul, utilajul afectat, sarcina și impactul în plan. O intervenție propusă nu dovedește că utilajul este reparat. Măsurătorile, oprirea fizică, remontarea și repornirea se confirmă de persoanele responsabile, prin fluxul aplicabil.
