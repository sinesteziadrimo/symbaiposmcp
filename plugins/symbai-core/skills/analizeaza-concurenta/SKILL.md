---
name: analizeaza-concurenta
description: Monitorul de concurență pe livrări — ce fac restaurantele din jurul punctului de ridicare pe Glovo, Wolt și Bolt Food (reduceri, tipul și mărimea lor, produse reduse, prețuri, evaluări, livrare gratuită, sponsorizări), pe o rază și pe hartă cu Google Maps, plus concurenții urmăriți și ce s-a schimbat de la raportul trecut. Folosește la „ce face concurența”, „ce reduceri au restaurantele din zonă pe Glovo/Wolt/Bolt”, „raport cu concurenții pe 3 km”, „urmărește concurentul X”, „sunt mai scump decât ceilalți?”, „ce promoție să fac ca să ies în evidență”. Pentru campanii și buget de livrări folosește condu-livrarile; pentru reclame Meta gestioneaza-reclame.
---

# Analizează concurența pe livrări

Pagina: **Canale → Analiză → Concurență** (`/channels?tab=business&section=competitors`). Acolo omul vede harta, lista restaurantelor, produsele reduse, schimbările și recomandările. Tu lucrezi cu aceleași date prin uneltele `competitor_intel_*`. Dacă nu le vezi în catalog, caută-le cu `cauta_tool("raport concurență livrări")`. Lipsa lor înseamnă o versiune mai veche a aplicației sau lipsa dreptului pe canalele de livrare, nu o deconectare.

## Ce este și ce nu este

- Raportul citește **ce arată public** aplicațiile Glovo, Wolt și Bolt Food la adresa punctului de ridicare, în momentul generării. Pe lângă ele, opțional, citește restaurantele de pe Google Maps din aceeași rază.
- Pentru fiecare restaurant arată:
  - platformele pe care e prezent;
  - promoțiile: reducere la produse, la tot meniul, 1+1, livrare gratuită sau redusă, reducere la coș, oferte doar pentru abonați Prime/Wolt+;
  - procentul reducerii;
  - produsele reduse, cu prețul vechi și cel nou;
  - evaluarea, timpul și taxa de livrare, sponsorizarea;
  - distanța și poziția pe hartă.
- **Nu** arată vânzările, comenzile, costurile sau profitul concurenților. Nu le deduce din poziția în listă sau din numărul de evaluări.
- O ofertă „doar pentru abonați” nu e o reducere pe care o vede orice client. Sumarul o numără separat.

## Flux

1. `competitor_intel_context` — întâi. Spune ce locații pot fi punct de ridicare (cu adresă și oraș) și pe ce platforme e deja firma. Mai întoarce:
   - concurenții urmăriți;
   - ultimele rapoarte;
   - raportul în lucru;
   - limita lunară;
   - dacă Google Maps e configurat (`googleConfigured`);
   - dacă omul poate modifica lista urmăriților (`canManageWatch`).
2. **Refolosește un raport recent** dacă răspunde la întrebare (aceeași zonă, rază și platforme). Fiecare raport consumă din limita lunară și citește platformele.
3. `competitor_intel_run` — generează un raport nou:
   - **Punct**: `locationId` al unei locații proprii. Altfel coordonate `lat`/`lng`, sau `address` cu orașul („Piața Victoriei 2, Timișoara”); adresa cere Google Maps. Maximum 5 puncte. Cu acces doar la unele locații analizezi numai în jurul lor.
   - **Rază**: 0,5–15 km. Implicit 3 km. Pentru oraș dens 2–3 km, pentru oraș mic 5 km.
   - **Mod**:
     - `area` = tot ce e pe rază. Opțional restrângi la tipuri de mâncare în `cuisines` (shaorma, pizza, burger…).
     - `tracked` = numai concurenții urmăriți. Cere cel puțin unul urmărit.
   - **Platforme**: implicit toate trei. `menuLimit` = câte meniuri complete se citesc pe lângă cele ale urmăriților, care se citesc mereu.
   - Cu mai multe branduri în arie dai `brandId`.
4. Raportul rulează în fundal, de regulă 1–3 minute. Citește `competitor_intel_report(id)`: `status=running` are progresul. Nu porni alt raport cât timp unul rulează; răspunsul 409 spune asta.
5. Răspunde din raport, cu cifre și nume. Restrânge cu filtrele:
   - `platform`;
   - `onlyDiscounted`;
   - `minDiscountPct`;
   - `onlyTracked`;
   - `cuisine`;
   - `includeMenus:false`, când ai nevoie doar de sumar.

### Cum citești raportul

- `summary`:
  - câte restaurante sunt pe platforme și câte doar pe Google;
  - câte au reduceri și procentul lor;
  - media și mediana reducerii maxime;
  - livrare gratuită și sponsorizări;
  - `byPlatform`, cu tipurile și adâncimea reducerilor;
  - `byCuisine` și `topDiscounts`;
  - produsele reduse găsite în meniuri.
- `changes` — față de raportul anterior **comparabil**, adică aceleași puncte, rază, mod, platforme și tipuri de mâncare:
  - local nou sau dispărut;
  - promoție începută, oprită sau schimbată;
  - preț schimbat.
  
  Fără raport comparabil nu există schimbări. Spune asta, nu „nicio schimbare”.
- `benchmarks` — prețul firmei pe platforme față de prețul plătit efectiv la concurență după reducere, pe tip de produs. O diferență de câteva procente nu e o concluzie.
- `insights`:
  - observații cu ton: amenințare, oportunitate sau informație;
  - acțiunea propusă în `assistant`: `explain`, `promo_plan`, `price_check` sau `meta_ad`.

**„Ce promoție să fac”:** pornește de la `competitor_intel_recommend_promotions` (fără `id` = ultimul raport încheiat; opțional `goal`: visibility, new_customers, basket, margin). Primești pe fiecare canal Wolt/Bolt/Glovo din aria raportului:
- reducerea pe produse:
  - produsele alese, adică ce reduc concurenții similar, unde ești mai scump decât prețul plătit la ei și cu marjă bună;
  - procentul oferit de platformă care păstrează cel puțin 40% din câștigul de azi pe produs (după TVA, comisionul canalului și costul din rețetă);
  - calculul pe produs: cât plătește clientul, câștigul înainte și după, cu cât trebuie să crească vânzările.
- varianta doar pentru clienții noi, când piața e plină de reduceri;
- livrarea gratuită cu comandă minimă, când e standard la vecini;
- reclama, când concurenții plătesc locuri sponsorizate;
- produsele la care ești deja mai ieftin, pe care nu le reduci.

Fiecare are în `next` unealta de creare, argumentele știute și ce mai trebuie completat. Prezintă omului 2–3 variante cu cifrele lor. Bugetul și acordul îl alege el. Abia apoi creezi campania cu unealta din `next`. Produsele fără cost complet nu primesc recomandare: spune-i omului să completeze rețetele.
- `coverage`:
  - ce sursă a fost limitată temporar de platformă, sărită sau incompletă (de exemplu Glovo fără orașul punctului ori prea multe tipuri de mâncare);
  - la `status=partial` spune omului ce lipsește, nu prezenta cifrele ca fiind complete.

## Concurenți urmăriți

- Urmăriții au mereu meniul citit și schimbările semnalate.
- Pași:
  1. `competitor_intel_search(name)` găsește restaurantul în ultimele rapoarte și îi dă identitatea pe fiecare platformă și pe Google.
  2. `competitor_intel_watch_add` îl adaugă la o locație, cu acele `refs`.
  3. `competitor_intel_watch_remove(id)` îl scoate.
- Modificarea listei cere dreptul de administrare a canalelor de livrare (`canManageWatch`).
- Repetarea pentru același nume și locație actualizează intrarea, nu o dublează.

## De la date la decizii

Recomandă concret, cu cifre din raport, și termină cu 2–3 acțiuni pentru săptămâna asta. Orice schimbare reală cere acordul explicit al omului:

- **Promoție proprie**:
  - pregătești varianta cu produsele din meniul tău (`delivery_business_growth_catalog`);
  - simulezi contribuția (`delivery_business_simulate`);
  - urmezi fluxul din [condu-livrarile](../condu-livrarile/SKILL.md).
  
  Nu răspunde la reduceri adânci cu reduceri care pierd bani. Uneori diferențierea (produs, pachet, timp de livrare, fotografii) bate prețul.
- **Prețuri**: arăți unde ești mult peste sau sub prețul plătit la concurență. Nu schimbi prețuri fără acord.
- **Reclamă Facebook/Instagram pe rază**:
  1. verifici contul de reclame (`list_ad_accounts`);
  2. propui mesajul, produsul, bugetul zilnic, durata și raza pe punctul de ridicare, după [gestioneaza-reclame](../gestioneaza-reclame/SKILL.md);
  3. nu creezi și nu pornești reclama până nu confirmă bugetul.
- **Lipsa de pe o platformă**: dacă mulți concurenți sunt pe o platformă unde firma nu e, e o oportunitate de discutat. Nu e o obligație.
- **Doar pe Google Maps**: restaurante bine notate care nu livrează. Sunt concurenți pentru clienții din zonă, nu pe livrări.

## Limite de știut

- **Wolt și Bolt Food nu arată reducerile în lista de restaurante, doar în meniu.** Pentru ele:
  - procentul „au reduceri” vine numai din meniurile citite (`summary.byPlatform.<platformă>.checked` și `checkedWithDiscount`), nu din toate restaurantele din listă;
  - meniurile citite (`menuLimit`, implicit 18) se împart egal între platforme;
  - un restaurant cu meniul necitit are reducerile **necunoscute**, nu „fără reducere”. Spune asta omului;
  - pentru cifre mai sigure pe Wolt/Bolt crește `menuLimit` sau urmărește concurenții direcți: lor li se citește mereu meniul.
- Pe hartă, restaurantele din jur care nu intră în analiză (în afara razei sau cu alt tip de mâncare) apar cu gri. Le vezi și tu cu `competitor_intel_report(includeAround: true)`; implicit primești doar numărul lor.
- Platformele pot limita temporar citirile. Raportul iese `partial` și spune ce sursă lipsește. Reîncearcă mai târziu, nu în buclă.
- Fără Google Maps configurat lipsesc:
  - harta Google;
  - căutarea adreselor;
  - poziția restaurantelor de pe Glovo, care nu publică coordonatele.
  
  Raportul de pe platforme merge în continuare.
- Pentru monitorizare periodică folosește rutina autorizată, fără bucle proprii; vezi „Lucru periodic” din [condu-livrarile](../condu-livrarile/SKILL.md). Rutinele nu au browser, dar uneltele `competitor_intel_*` merg prin MCP.
