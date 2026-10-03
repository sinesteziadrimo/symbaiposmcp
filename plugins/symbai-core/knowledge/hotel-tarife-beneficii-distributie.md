# Hotel — tarife, beneficii și distribuție prin asistent

Ghid pentru lucrul în **Tarife**, **Venituri** și **Canale**. Catalogul live al conexiunii stabilește instrumentele disponibile și drepturile. Dacă un instrument de aici lipsește, verifică versiunea și drepturile; ghidul nu dovedește că funcția este deja instalată pe hotelul respectiv.

## Început eficient

1. Confirmă conexiunea și hotelul. Refolosește identitatea până schimbi conexiunea; când sunt mai multe hoteluri în aceeași unitate, păstrează explicit hotelul ales.
2. Citește `get_hotel_commercial_context`, cu planurile și perioada relevante. Primești într-un apel produsele, grilele, prețurile speciale, beneficiile, sezoanele, derivările, reducerile după durata sejurului și restricțiile. Verifică totalurile și marcajele de trunchiere; restrânge selecția sau cere mai multe rezultate când lipsesc detalii.
3. Pentru cerere și limite citește `get_hotel_revenue_outlook` și `get_hotel_revenue_policy`. Ocuparea, cererea și prețurile de azi se recitesc; nu se presupun din memorie.
4. Pentru distribuție folosește `list_hotel_channels` și `get_hotel_channel_details`. Catalogul furnizorului se cere cu `includeProviderInventory` numai când trebuie mapat/verificat un produs. O simplă editare de preț nu cere inventarul complet al tuturor platformelor.

## Ce poți configura

| Intenție | Instrument |
|---|---|
| Creează/modifică oferta: nume, cod, masă, perioadă, activitate și regula pe ocupare | `manage_hotel_rate_plan` |
| Setează grila inițială pe cameră și 1/2/3/4 persoane | `set_hotel_rate_prices` |
| Schimbă multe nopți/camere/planuri cu sumă sau procent | `preview_hotel_rate_change` → `apply_hotel_rate_change` |
| Adaugă sau corectează mic dejun, spa, parcare, transfer și alte beneficii | `list_hotel_package_benefits` → `manage_hotel_package_benefit` |
| Un sezon scump/ieftin pentru hotel | `list_hotel_rate_seasons` → `manage_hotel_rate_season` |
| Un tarif care urmează automat alt tarif | `list_hotel_derived_rates` → `manage_hotel_derived_rate` |
| Reducere locală după numărul nopților | `list_hotel_los_rules` → `manage_hotel_los_rule` |
| Politica efectivă de anulare locală | `list_hotel_cancellation_policies` → `manage_hotel_cancellation_policy` |
| Sejur minim/maxim, sosire/plecare sau oprire de vânzare | `set_hotel_rate_restrictions` / `remove_hotel_rate_restriction` |
| Adaos/reducere pe un canal | `list_hotel_channel_adjustments` → `manage_hotel_channel_adjustment` |
| Configurarea conexiunii și maparea produselor | `manage_hotel_channel` / `manage_hotel_channel_mapping` |
| Reguli de recomandare și hoteluri concurente | `list_hotel_yield_rules` / `manage_hotel_yield_rule`, `list_hotel_competitors` / `manage_hotel_competitor` |

Instrumentele `manage_*` au o acțiune explicită și câmpurile de modificat în `data`. Citește schema live: nu toate resursele permit modificarea pe loc; de exemplu, o derivare se creează sau se elimină. La update trimite numai schimbarea, fără întregul obiect citit. Cataloagele paginate întorc următoarea poziție când mai există rezultate.

## Prețuri în masă fără calcule manuale repetitive

Exemplu: „mărește cu 8% dublele și camerele de familie, vineri și sâmbătă, luna viitoare, rotunjit la 5 lei”.

- Alege ID-urile reale ale planurilor și tipurilor de cameră din context. Nu confunda tipul „dublă” cu numărul camerei 204.
- Perioada tarifară are **ultima zi inclusivă**. Zilele săptămânii: 0=duminică, 1=luni, …, 5=vineri, 6=sâmbătă. Această convenție diferă de disponibilitatea unui sejur, unde ultima zi este plecarea, exclusivă.
- Operații: `set` pune suma, `add` adaugă/scade o sumă, `percent` aplică procentul cu semn, `clear_override` elimină prețurile speciale și revine la calculul normal. Procentul se aplică prețului efectiv al nopții, inclusiv sezonul sau derivarea, nu unui preț ghicit.
- O selecție acoperă cel mult 500 de zile și 2.000 de combinații plan–cameră–noapte. Împarte selecțiile mai mari în loturi distincte și păstrează rezultatul fiecărui lot.
- Previzualizarea întoarce prețurile înainte/după, ocupările, efectele asupra planurilor derivate și o amprentă. Citește paginile necesare; **aplicarea afectează toată selecția**, nu doar pagina afișată.
- Aplică în limita acordului deja dat, cu aceeași selecție și amprentă, plus o cheie unică de operație. La repetare după timeout păstrează cheia. Pentru o nouă majorare intenționată, folosește altă cheie.
- Dacă datele s-au schimbat între timp, refă previzualizarea și reevaluează efectul. Nu reutiliza orbește prețurile vechi.
- Cu pilotul de prețuri activ, folosește **`apply_hotel_revenue_changes`**: modul propunere, limitele și ritmul de schimbare se respectă. Nu dezactiva pilotul pentru a forța o operație manuală.

### Cum se schimbă ocupările

Pe fiecare plan se alege regula. Implicit, **diferențe fixe** (`fixed_supplements`) păstrează suplimentele/reducerile în bani între ocupări. Alternativa **proporțional** păstrează raportul dintre prețuri.

| Exemplu: bază 100 → 150 | 1 persoană | 2 persoane | 3 persoane | 4 persoane |
|---|---:|---:|---:|---:|
| Grila inițială | 80 | 100 | 130 | 160 |
| Diferențe fixe | 130 | 150 | 180 | 210 |
| Proporțional | 120 | 150 | 195 | 240 |

Asistentul nu completează ocupări inexistente după presupuneri. Un preț de vânzare zero sau negativ este refuzat; pentru închiderea vânzării folosește restricțiile potrivite, nu preț zero. Un plan copil derivat urmează părintele; verifică impactul înainte de a modifica ambele planuri separat.

## Construirea unei oferte clare

**Mic dejun și beneficii.** Definește oferta și masa inclusă, apoi beneficiile: denumire, inclus/opțional, cost intern și descriere. În descriere precizează beneficiarii, numărul de utilizări, frecvența, programul și excluderile. Exemplu: „mic dejun bufet zilnic pentru adulții rezervați, 07:00–10:00; copiii sub 5 ani gratuit; neutilizarea nu se rambursează”. Câmpul `cost` este o estimare internă; **nu este o taxă încasată de la oaspete**. Beneficiul opțional nu postează automat un consum pe nota de cont.

**Nerambursabil.** Numele „NRF” și textul de anulare din plan sunt descrieri comerciale. Politica efectivă locală se leagă de rezervare sau de setarea implicită a hotelului. Verifică penalitatea reală cu `preview_hotel_cancellation`; nu presupune că textul din plan a schimbat-o. Politicile comune întregului brand se disting de cele ale unității.

**Șapte nopți cu reducere.** Pentru distribuție creează un plan separat, eventual derivat procentual din BAR, setează sejurul minim de 7 nopți și mapează produsul potrivit. O regulă generică LOS locală nu poate fi transmisă ca simplu preț zilnic. La fel, ferestrele de rezervare anticipată și cutoff cer suportul specific al furnizorului.

**Sezon și preț special.** Sezonul cu prioritate mai mare câștigă; un preț special al zilei îl înlocuiește. Schimbarea unui sezon poate afecta multe planuri ale hotelului. Citește mai întâi prețurile speciale existente.

## Ce înseamnă „a ajuns pe platformă”

Separă trei rezultate: configurația salvată local, actualizarea pusă în coadă și livrarea confirmată de furnizor. Verifică rezultatul real al cozii; absența unui canal automat eligibil nu este publicare reușită. Pentru canalele manuale folosește retrimiterea explicită, apoi citește starea sincronizării.

Furnizorul poate accepta actualizarea înainte ca noul preț să fie vizibil la citire. Verifică din nou după un interval rezonabil, păstrând aceeași operație; o primă citire cu valoarea veche nu justifică o nouă majorare sau crearea altui produs.

Inventarul furnizorului îți dă codurile de cameră și tarif, ocupările și eventualele derivări de acolo. Nu inventa coduri și nu confunda derivarea locală cu un tarif derivat la furnizor. Expedia poate cere maparea tarifului separat pe fiecare tip de cameră. Masa, politica de anulare, extra-beneficiile și promoțiile se verifică separat în produsul furnizorului; ARI de preț/disponibilitate nu le configurează automat.

Conectarea Channex staging dovedește accesul la acel mediu de test, nu certificarea tuturor canalelor din aval. YieldPlanet se testează numai cu hotelul și accesul de test confirmate de furnizor. Ghidul nu promite aceleași posibilități pe Booking, Expedia, Airbnb, Agoda sau distribuitorii angro.

Nu șterge un plan mapat sau folosit ca părinte: dezactivează-l și verifică închiderea vânzării, păstrând mapările cât sunt necesare. Închiderea unui singur plan poate lăsa alte oferte deschise; pentru închiderea întregului hotel trebuie verificată disponibilitatea tuturor produselor vândute.

## Comisioane, Genius/mobile și suma rămasă hotelului

În **Tarife → Venit net** sau **Canale → Venit net**, alege conexiunea și platforma din aval. Booking.com și Expedia au profiluri distincte chiar dacă vin prin aceeași conexiune Channex/YieldPlanet.

1. Citește `get_hotel_channel_commercial_settings`: profilurile și amprenta configurației. `null` înseamnă necunoscut; zero este un cost confirmat ca absent. Nu presupune 15% comision, taxe de plată sau niveluri Genius după numele platformei.
2. `set_hotel_channel_commercial_settings` salvează întregul document cu amprenta citită. Păstrează celelalte profiluri. Completează separat comisionul OTA, procesarea plății, costul fix, costul fiscal nerecuperabil al comisionului și procentul/costul fix al distribuitorului. Costul procentual al distribuitorului se aplică sumei datorate hotelului. Câmpurile vechi din editarea conexiunii nu se adună automat în acest calculator.
3. `preview_hotel_channel_net_revenue` citește prețurile efective din calendar, inclusiv derivări, sezoane și ajustarea locală a canalului. Trimite `fingerprint`, planul, camera și perioada; `to` este ultima noapte inclusivă. Pentru prețuri pe persoane, indică `occupancy`. `proposedNightlyPrice` este o simulare a tarifului trimis, fără salvare sau publicare. `targetNetPerNight` propune un tarif suficient după rotunjiri, fără garanția minimului la cent.
4. `get_hotel_channel_commercial_actuals` citește rezervările cu sosire înregistrată în Symbai în interval. Folosește ultimele date complete ale furnizorului, separat pe monedă: nopți-cameră, venit rezervat, ADR din cazare, comision cunoscut, grad de acoperire și marcaj Genius când există. Importurile incomplete sau cu versiuni diferite între camere sunt excluse explicit. Comisionul total al unei rezervări cu mai multe camere nu se multiplică.

**Reducerile sunt scenarii, nu promoții activate.** Implicit se calculează separat. Nivelurile Genius se pun în același grup de alternative. Pentru cumul confirmat, grupurile diferite se combină procentual, nu prin adunarea procentelor: 500 cu două reduceri succesive de 10% devine 405. O reducere suportată integral de platformă scade prețul oaspetelui fără să scadă suma datorată hotelului. Confirmă eligibilitatea, cumularea și finanțarea în condițiile ofertei; nu promite că orice client primește toate reducerile.

**Ce înseamnă net.** Simularea scade doar costurile de distribuție completate, înainte de taxele și costurile de operare ale hotelului. Nu este profit sau decont bancar. Cu un cost necunoscut nu se afișează un net complet. ADR este totalul aferent împărțit la nopți, nu media mediilor. Raportul rezervărilor indică separat comisioanele lipsă și nu inventează taxele de plată. Pentru încasarea finală, verifică decontul și factura furnizorului.

**Conectarea Booking prin Channex.** Hotelul autorizează Channex în extranetul Booking și încheie pașii de acceptare; apoi se creează conexiunea cu Hotel ID, se verifică și se mapează camerele/planurile înainte de activare. Testele Channex staging nu confirmă automat certificarea Booking sau prețul vizibil pentru un anumit client. Masa inclusă, anularea, Genius/mobile și alte promoții se verifică separat; simpla transmitere ARI nu le configurează. Vezi [ghidul Channex pentru Booking](https://docs.channex.io/channel-mapping-guides/booking.com), [datele rezervărilor Channex](https://docs.channex.io/api-v.1-documentation/bookings-collection) și [promoțiile Booking](https://developers.booking.com/connectivity/docs/promotions).

## Memoria utilă a hotelului

Folosește memoria de business existentă, prin skill-ul `memorie-business`, pentru decizii stabile aprobate: hotelul vizat, moneda, poziționarea ofertelor, definiția beneficiilor, preferința pe ocupare, planurile de referință și limitele delegării. Specifică hotelul și data deciziei. O corecție actualizează aceeași notă; nu păstra două instrucțiuni contradictorii.

Nu memora ca adevăr curent prețuri, disponibilități, solduri, răspunsuri API sau starea cozii. Acestea se citesc când lucrezi. Nu păstra parole, chei, acte de identitate sau date de card în memorie. O preferință memorată nu mărește permisiunile conexiunii și nu relaxează politica de prețuri.

La reluare recuperează intenția, selecția, cheia operației și rezultatul incert. Dacă salvarea a reușit dar verificarea a eșuat, citește catalogul; nu crea din nou oferta/beneficiul. Pentru schimbările în masă, repetarea cu aceeași cheie recuperează rezultatul fără o nouă majorare.
