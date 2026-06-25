# Livrări și comenzi online

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt
Modulul acoperă tot ce pleacă din local către client: comenzile de pe platformele de livrare (Glovo, Wolt, Bolt Food, Tazz), livrarea cu flotă proprie (dispecerat, zone, livratori, vehicule), comenzile magazinului online (expediere cu AWB prin curieri naționali, retururi, antifraudă, marketplace-uri gen eMAG) și abonamentele cu livrări recurente. Include și aplicația dedicată a livratorului (PWA „Symbai Livrator") plus pagina publică de urmărire a comenzii pentru client.

## Concepte
- **Canal de livrare** — o conexiune cu o platformă externă (Glovo, Wolt, Bolt Food, Tazz): meniul se sincronizează spre platformă, comenzile vin automat în Symbai. Un canal poate fi Online/Offline și poate fi **pauzat** (cu motiv afișat).
- **Program de disponibilitate** — regula zi+ora care face un produs, o categorie sau un meniu comandabil doar intr-o fereastra (ex. mic dejun Lu-Vi 08:00-11:00). Nu este oferta si nu reduce pretul; decide vizibil/comandabil pe POS, QR/portal si delivery.
- **Livrator** — angajat marcat nominal „este livrator" în Flotă → tab Livratori. Doar angajații bifați pot primi comenzi de livrare; numărul de livratori se facturează separat (modul Livrator, 29€/livrator, raportat automat în Hub). Bifarea NU ascunde pagini.
- **Schimb (tură de livrare)** — livrator + vehicul + km la plecare; se închide cu km la final. Un livrator e „activ" în dispecerat doar cu schimb deschis și poziție GPS recentă (15 min).
- **Zonă de livrare** — arie pe hartă (desen liber sau localități alese cu contur administrativ automat; localitățile mici, fără contur disponibil pe hartă, se adaugă ca arie pătrată în jurul centrului, cu raza aleasă de tine) cu taxă de livrare, valoare minimă comandă, prag de livrare gratuită, ore limită și capacitate maximă de comenzi pe zi. Zonele sunt per locație.
- **SLA** — timpul promis de livrare (implicit 45 min); depășirile generează „breșe SLA" și alerte.
- **Batching** — gruparea mai multor comenzi pe același livrator, cu limite de comenzi/lot, întârziere la ridicare și ocol maxim (km).
- **Curier extern** — pentru o comandă proprie poți cere cotații și trimite livrarea unui curier terț (glovo, uber_direct, bolt_food, tazz), cu auto-fallback opțional dacă nu găsești livrator propriu.
- **Livrare eșuată** — comandă marcată cu motiv: client absent, adresă greșită, refuzată, produs lipsă, altele; se poate relivra, reprograma sau anula.
- **Închidere de zi (livrator)** — raportul zilnic al livratorului: km, cash încasat, card, combustibil, livrări reușite/eșuate, semnătură.
- **AWB** — scrisoare de transport generată la curieri (Sameday, FAN Courier, DPD România, GLS România, Cargus, plus KLG Europe pentru logistică externalizată) pentru coletele magazinului online; include tracking, etichete și reconciliere ramburs (COD).
- **Marketplace** — platformă de vânzare externă pentru magazinul online: eMAG, Trendyol, Skroutz, Amazon, eBay.
- **Tracking public** — link `/track/:token` trimis clientului: vede statusul comenzii, ETA și (dacă e activat) poziția live a livratorului, fără autentificare.

## Paginile modulului

### Platforme de livrare (agregatoare)
- **Manager Canale** (`/channels`) — centrul integrărilor: 5 tab-uri — Prezentare & KPI (vânzări, timp mediu de preparare, rată comenzi pierdute, comisioane estimate), Control Comenzi, Meniu & Prețuri (sincronizarea meniului spre platforme), Reconciliere (loturi de decontare: plată așteptată vs primită, discrepanțe) și Integrări (conectare Glovo/Wolt/Bolt Food/Tazz cu credențialele platformei). Are ghid de configurare asistat în partea de sus.
- **Livrări** (`/deliveries`, „Centru Livrări") — monitorizarea live a comenzilor de pe platforme: carduri statistici (comenzi noi, active, în pregătire, gata de ridicare, venituri și comision azi, canale pauzate), tab-uri Comenzi Active / Kanban / Istoric Comenzi / Rapoarte / Platforme. Accepți sau refuzi comenzi (cu motiv), le treci prin pregătire → gata → ridicată → livrată; buton „Acceptă Toate" (cere permisiunea de acțiuni în masă) și sunet de alertă la comenzi noi.

### Flotă proprie și dispecerat
- **Zone Livrare** (`/deliveries/zones`) — definirea zonelor pe hartă, cu taxe, praguri și program; tab-uri Zone / Program / Restricții (restricțiile per produs sunt deocamdată doar anunțate — vin într-o versiune viitoare). Pagina cere întâi alegerea unei locații (zonele sunt per locație).
- **Flotă** (`/deliveries/fleet`) — 4 tab-uri: Vehicule (dubă/camion/mașină/frigorifică/bicicletă/scuter, capacitate comenzi, status activ/service), Livratori (bifezi nominal cine e livrator), Schimburi (deschidere/închidere cu km) și Livratori activi (poziție live, livrări azi).
- **Dispecerat** (`/deliveries/dispatch`) — ecranul operatorului: kanban pe statusuri (pregătire → de livrat → asignat → în livrare → livrat/eșuat) + hartă cu comenzi și livratori. Asignezi manual, prin drag-and-drop pe livrator, sau cu butoanele „Sugerează"/„Asignează celui mai potrivit" (țin cont de zonă, distanță, capacitate vehicul și încărcare curentă). Vehiculul se completează automat din schimbul deschis al livratorului, cu posibilitate de suprascriere manuală.
- **Mission Control Dispecerat** (`/dispatch/mission-control`) — consola avansată: KPI-urile zilei (livrate, eșuate, timp mediu, breșe SLA), alerte live cu confirmare/închidere, hartă live, recomandări top-3 livratori cu scor și motive, countdown SLA per comandă, „Comandă rapidă" (creată direct de operator: client, adresă, total, prioritate) și „Curier extern…" (cotații + trimitere).
- **Setări Dispecerat** (`/dispatch/settings`) — SLA promis și praguri de alertă (fără livrator, livrator inactiv, blocat în bucătărie), auto-asignare cu prag de scor, batching, motor de rutare (OSRM/Mapbox/Google/fallback linie dreaptă), viteză medie, curieri externi activați, auto-fallback la extern și comutatoarele de tracking public (poziție livrator, SMS cu ETA).
- **Analiză Dispecerat** (`/dispatch/analytics`) — KPI pe 1/7/30/90 zile, alerte pe tip, top livratori, jurnal de audit al acțiunilor de dispecerat.
- **Livrări eșuate** (`/deliveries/failed`) — listă filtrabilă pe perioadă/motiv/livrator, statistici per motiv, acțiuni: Re-livrează (înapoi în coadă), Reprogramează, sună clientul, Anulează definitiv; export CSV.
- **Cheltuieli vehicule** (`/deliveries/vehicle-expenses`) — raport pe vehicul din schimburile închise: km, litri, RON carburant, RON/km, L/100km; adaugi bonuri de carburant legate de schimb; export CSV.
- **Închideri de Zi Livrări** (`/deliveries/day-closures`) — registrul închiderilor de zi ale livratorilor: km, cash, card, combustibil, livrări, eșuate, semnat/nesemnat.
- **Aplicație Livrator** (`/livrator`) — PWA-ul curierului, 4 tab-uri: Acasă (tura și livrările zilei), Livrări (pornește livrarea, navigare Google Maps/Waze/Apple Maps, încasare cash/card, semnătură destinatar, poză dovadă, marchează livrată/eșuată, descarcă aviz/POD PDF), Combustibil (bonuri) și Casă (tura + închiderea de zi). Tab-urile se văd după permisiunile rolului de livrator; funcționează și offline (acțiunile se sincronizează la revenirea semnalului). `/driver` și `/agent` redirecționează aici.
- **Urmărire Livrare** (`/track/:token`) — pagină publică pentru client: pașii comenzii (Primită → În preparare → Gata de livrare → În drum → Livrată), ETA în minute, hartă cu poziția curierului și traseul, buton de apel către livrator; se actualizează automat la câteva secunde.

### Magazin online (paginile apar doar dacă domeniul de activitate Magazin online / Ecommerce e activ)
- **Comenzi** (`/ecommerce/orders`) — comenzile magazinului online: statusuri În așteptare → În procesare → Expediat → Livrat (plus Anulat/Rambursat), nivel de risc antifraudă per comandă, acțiuni Procesează/Expediază/Livrat/Anulează, filtre și acțiuni în masă.
- **Retururi (RMA)** (`/ecommerce/returns`) — cereri de retur, KPI (rată retur, total rambursat, top motive și produse returnate) și politici de retur.
- **Fraud & Risk** (`/ecommerce/fraud`) — scoring de risc și motor de reguli: tab-uri Raport, Manual review (coadă de verificare), Reguli.
- **Livrare & Transport** (`/ecommerce/shipping`) — zone de livrare, metode și tarife de transport pentru magazinele online (inclusiv „transport gratuit peste X RON").
- **Marketplaces** (`/ecommerce/marketplaces`) — vedere unificată eMAG, Trendyol, Skroutz, Amazon, eBay: Dashboard, Conturi, Comenzi, Mapare oferte, Jurnal sincronizare. `/ecommerce/emag` redirecționează aici.
- **AWB Curieri** (`/ecommerce/awb`) — generare AWB (inclusiv în masă) la Sameday/FAN Courier/DPD/GLS/Cargus/KLG Europe, tracking și etichete, reconciliere ramburs (COD), administrare conturi de curier.

### Alte canale de comandă
- **Abonamente** (`/subscriptions`) — abonamentele clienților cu livrări recurente: KPI MRR/ARR/ARPU/churn/LTV/venit 30 zile, listă cu căutare și filtru pe status (activ, trial, pauză, restant, anulat), acțiuni pauză/reactivare/anulare, iar pe fiecare abonament: livrările lui, evenimentele de plată eșuată (dunning) și istoricul.
- **Inbox WhatsApp** (`/whatsapp-inbox`) — conversațiile WhatsApp cu clienții pe numărul central, per brand: fire de discuție stil WhatsApp, trimitere text/poze/documente, reacții, marcare citit; util pentru clienții care comandă prin mesaje.

## Fluxuri frecvente
1. **Conectezi Glovo/Wolt/Bolt/Tazz**: `/channels` → tab Integrări → adaugi canalul cu datele de la platformă (la Wolt: client ID/secret + venue; la Glovo: Partner API token, Glovo Store ID si Store Address External ID) → sincronizezi meniul din tab Meniu & Prețuri → comenzile încep să apară în `/deliveries`.

### Glovo Partner API - workflow oficial

Pentru Glovo nu spune doar "pune cheia API". Workflow-ul practic este:
1. Userul obtine de la Glovo Partner API token, Glovo Store ID si Store Address External ID. Nu cere parola contului Glovo.
2. In `/channels?tab=integrations`, canalul Glovo afiseaza URL-urile publice pe hostul tenantului: dispatch webhook, cancellation webhook si Menu JSON URL.
3. Full menu sync construieste meniul din meniurile asignate canalului, il valideaza, apoi trimite catre Glovo `menuUrl` (URL-ul JSON servit de Symbai). Pentru pret/disponibilitate, foloseste update-urile mici/bulk, nu full sync repetat.
4. Comenzile vin prin dispatch webhook si se deduplica dupa `order_id`/`order_code`. Acceptarea, `ready_for_pickup`, `out_for_delivery` si `customer_picked_up` se trimit catre Glovo din Symbai cu Store Address External ID.
5. API-ul public Glovo nu expune reject/anulare generica din restaurant. Daca userul trebuie sa refuze/anuleze, ii spui sa faca asta in Glovo sau prin suport Glovo; Symbai reflecta statusul cand primeste cancellation webhook.
6. Daca userul activeaza auto-accept smart, Symbai calculeaza timpul promis din KDS: bonuri active in fata + durata medie a bonurilor finalizate recent + buffer. Modul `Glovo prioritar` ignora bonurile normale neincepute, dar nu sare peste ce este deja in lucru. Daca ETA depaseste limita maxima setata, comanda ramane neacceptata pentru operator.

### Wolt - configurare financiara si P&L

La Wolt, canalul din `/channels?tab=integrations` are setari financiare suplimentare: baza de comision (produse dupa/inainte de discount sau total dupa/inainte de discount), modul de finantare promotii (`from_order_v2`, firma 100%, Wolt 100%, split procent), procentul suportat de firma si maparea taxelor delivery/service/small-order/marketing/Wolt+. Comenzile Wolt pastreaza in metadata suma basket, fee parts, depozite, campanii aplicate si daca e Wolt+.

Pentru intrebari de profitabilitate nu estima manual din UI. Foloseste `list_delivery_pnl_segments` -> `get_delivery_pnl`; citeste `platformPnl` pentru comisioane, taxe, promotii suportate de firma vs platforma, profit contributie, comenzi nelegate de POS si warninguri. Daca userul vrea dovada vizuala, deschide `/reports/pnl-livrari`; pentru setari de canal deschide `/channels?tab=integrations`.

### Operare comenzi Glovo/Wolt din chat

Pentru intrebari sau actiuni pe o comanda de agregator, nu incepe cu SQL si nu folosi tool-urile de dispecerat flota. Fluxul corect este:
1. `list_channel_orders(provider,status,brandId,locationId)` ca sa gasesti `channelOrderId`.
2. `get_channel_order(id)` ca sa vezi canalul, statusul, totalurile, `itemsJson`, metadata si timeline.
3. Apelezi actiunea potrivita, apoi recitesti cu `get_channel_order(id)` si dai linkul `/channels?tab=orders` sau `/channels?tab=integrations`.

Actiuni disponibile:
- `delay_channel_order(id,extraMinutes)` — comunica intarzierea catre platforma unde se poate si actualizeaza ETA/timeline in Symbai.
- `confirm_channel_preorder(id)` — confirma o precomanda la platforma (in special Wolt, unde API-ul are confirm-preorder).
- `replace_channel_order_items(id,payload|modification,confirm:true)` — substituie produse indisponibile. Cere confirmare si foloseste payload-ul exact cerut de platforma.
- `refund_channel_order(id,scope,items|newTotal,reason,confirm:true)` — rambursare/ajustare pe platforma. Cere confirmarea sumei inainte; tool-ul este pe modulul `plati_terminal` si respecta plafonul de refund din Hub cand suma se poate estima. Wolt suporta `refund-basket` / `refund-items`; Glovo foloseste `newTotal` prin `change_price`.
- `mark_channel_deposits_returned(id,confirm:true)` — marcheaza garantiile SGR/depozitele ca returnate la platforma (Wolt).
- `snooze_delivery_channel(id,minutes,confirm:true)` — pune temporar canalul offline la sursa (restaurant ocupat). Comenzile noi nu mai intra pe acel canal pana expira pauza; comenzile deja primite raman in Symbai.

Backpressure important: cand un canal are limita de comenzi pe ora sau este pus pe snooze/pauza, Symbai nu arunca webhook-urile primite. Doar suspenda auto-accept si, unde API-ul permite, pune venue/store offline la sursa pana expira fereastra.

### Sincronizare meniu Glovo/Wolt - detalii care schimba raspunsul agentului

Full menu sync construieste meniul din meniurile asignate canalului si imbogateste payload-ul cu optiuni/extras, alergeni, etichete dietetice, restrictii, disponibilitate si setari pe canal. Pentru Wolt se trimit si `product_information.allergens` si `weekly_availability` cand exista date. Pentru Glovo, full sync-ul are limita de siguranta de 5 reusite/zi pe canal; foloseste `force:true` doar cand userul intelege ca retrimiti intreg meniul, altfel prefera update-urile mici de pret/disponibilitate.

### Disponibilitate programata: mic dejun, meniu de noapte, weekend

Sursa canonica este `availability_schedules`, nu campurile custom Wolt legacy. Flux agent:
1. Gasesti tinta: `search_products_db` pentru produs, `list_menu_categories` pentru categorie sau `list_menus` pentru meniu.
2. Verifici ce exista: `list_availability_schedules(brandId)`.
3. Creezi sau modifici: `create_availability_schedule` / `update_availability_schedule` (modul `produse_meniu`). Parametrii importanti: `targetType` (`product|category|menu`), `targetIds`, `daysOfWeek` (`0=Duminica..6=Sambata`), `timeStart`, `timeEnd`, `channels` (`pos|kiosk|website|qr|delivery`), `locationId` optional.
4. Recitesti `list_availability_schedules` si ii spui userului unde se vede: `/menu/promotions`, tab **Disponibilitate**.

Explica simplu: „produsul se vede si se poate comanda doar in fereastra aleasa". In afara ferestrei, portalul/QR il ascunde sau il dezactiveaza, POS-ul blocheaza comanda, Wolt primeste `weekly_availability` la urmatorul sync de meniu, iar Glovo se comuta prin update mic de disponibilitate (cron delta-only, fara full sync repetat). Daca o platforma cade, Symbai merge fail-open: nu blocheaza POS-ul pentru ca Glovo/Wolt nu raspunde.

Campuri utile pe produse/canal:
- Glovo: `custom:glovo_options`, `custom:glovo_dietary_labels`, `custom:glovo_restrictions`; canalul poate avea `settings.glovo.priceIsLineTotal` daca `price` din webhook vine ca total de linie, nu pret unitar.
- Wolt: `custom:wolt_options`, `custom:wolt_weekly_availability`, `custom:wolt_delivery_methods`, `custom:wolt_restrictions`, `custom:wolt_*` pentru GTIN/SKU/alcool/depozit; canalul poate avea `settings.wolt.weeklyAvailability`.

Daca preturile Glovo par dublate sau cantitatea schimba totalul gresit, verifica intai `settings.glovo.priceIsLineTotal` pe canal. Daca meniul Glovo este respins dupa etichete dietetice, foloseste doar valorile acceptate de enumul Glovo; o valoare necunoscuta respinge tot meniul.
2. **Gestionezi comenzile de pe platforme**: `/deliveries` → tab Comenzi Active → accepți (sau „Acceptă Toate") → „În pregătire" → „Gata" → „Ridicată" → „Livrată"; refuzi cu motiv scris (ex. ingredient indisponibil).
3. **Pornești livrarea cu flotă proprie**: `/deliveries/fleet` → tab Livratori → bifezi angajații curieri → tab Vehicule → adaugi vehiculele → tab Schimburi → „Deschide schimb" (livrator + vehicul + km) → definești zonele în `/deliveries/zones`.
4. **Asignezi o comandă**: `/deliveries/dispatch` → bifezi comanda din coloana „De livrat" → alegi livratorul activ (sau „Asignează celui mai potrivit", sau tragi cardul comenzii peste livrator) → livratorul o vede instant în `/livrator`.
5. **Livratorul finalizează**: în `/livrator` → „Pornesc livrarea" → navighează → „Încasare" (sumă + metodă) → opțional semnătură/poză → „Marchează livrată"; la sfârșitul zilei → tab Casă → închidere de zi; managerul o vede în `/deliveries/day-closures`.
6. **Tratezi o livrare eșuată**: livratorul (sau dispecerul) o marchează eșuată cu motiv → în `/deliveries/failed` alegi: „Re-livrează" (înapoi în coada de dispecerat), „Reprogramează" la o oră anume, suni clientul sau „Anulează" definitiv.
7. **Trimiți comanda unui curier extern**: activezi providerii în `/dispatch/settings` → în Mission Control, la comandă, „Curier extern…" → compari cotațiile → trimiți; comanda apare cu numele providerului în loc de livrator propriu.
8. **Expediezi o comandă de magazin online**: `/ecommerce/orders` → Procesează → `/ecommerce/awb` → tab Generează AWB → alegi contul de curier și comenzile eligibile → generezi AWB-urile → tipărești etichetele → urmărești în Tracking & Etichete → la ramburs, închizi banii în Reconciliere COD.

## Tool-uri MCP utile
**Citire (fără permisiune de modul):**
- `gaseste_in_aplicatie` — găsește pagina potrivită și dă link direct („unde configurez zonele de livrare?").
- `raport_vanzari` — încasări pe perioadă cu defalcare pe metode de plată; bun pentru totalul zilei inclusiv comenzile online.
- `get_orders_summary` — sumar comenzi pe perioadă: câte, ce produse, în ce cantități.
- `top_produse` / `vanzari_in_timp` — ce se vinde și la ce ore (util pentru orele de vârf la livrare).
- `jurnal_activitate` — cine a făcut ce pe comenzi: anulări, modificări, plăți (filtrabil pe entitate `order`).
- `list_entities` — listare rapidă de entități per brand.
- `get_portal_config` — configurația portalului de comenzi online (inclusiv livrare/ridicare).
- `list_channel_orders` — listeaza comenzile de pe agregatori/canale externe (Glovo/Wolt/Bolt/Tazz) si iti da `channelOrderId` pentru actiuni.
- `get_channel_order` — detaliul unei comenzi de agregator: canal, status, totaluri, iteme, metadata si timeline; foloseste-l ca read-back dupa orice actiune.
- `list_availability_schedules` — programele zi+ora pentru produse/categorii/meniuri; primul pas cand userul intreaba „cand e disponibil micul dejun" sau „ce meniu e pe Wolt dimineata".

**SQL (doar-citire, dacă token-ul are toggle-ul SQL):** `list_database_tables` → `describe_database_table` → `execute_sql_query` — pentru întrebări pe care rapoartele dedicate nu le acoperă (ex. livrări eșuate pe motiv).

**Scriere (cere modulul de permisiune `setari` pe token):**
- `create_delivery_channel` — configurează un canal de livrare (platformă, brand, locație). Pentru Glovo, asta doar creeaza inregistrarea; conectarea reala cere token + Store ID-uri in `/channels?tab=integrations`, apoi trimiterea celor trei URL-uri publice catre Glovo.
- `configure_portal_general` — pornește/oprește livrarea și ridicarea personală pe portalul de comenzi online (allowDelivery / allowPickup).

**Scriere disponibilitate meniu (cere `produse_meniu`):**
- `create_availability_schedule` / `update_availability_schedule` — fac produsul/categoria/meniul comandabil doar in anumite zile+ore. Nu le folosi pentru reduceri de pret; pentru happy hour cu discount foloseste `create_offer`.

**Scriere platforme livrare (cere `livrari`, cu exceptia refund-ului):**
- `delay_channel_order`, `confirm_channel_preorder`, `replace_channel_order_items`, `mark_channel_deposits_returned`, `snooze_delivery_channel` — actiuni reale pe Glovo/Wolt si timeline Symbai. Pentru substituire, SGR si snooze cere confirmare explicita.
- `refund_channel_order` — cere modulul `plati_terminal`, muta valoare/bani pe platforma si cere confirmarea sumei. Pentru Glovo trebuie `newTotal`; pentru Wolt foloseste `scope:"basket"` sau `scope:"items"`.

## Întrebări frecvente și capcane
- **De ce nu văd comenzile de pe Glovo?** Verifică `/channels` → Integrări: canalul trebuie conectat și Online, iar Glovo trebuie sa aiba dispatch webhook-ul Symbai configurat. Verifica si Store Address External ID-ul, pentru ca accept/ready/pickup il trimit in header catre Glovo. Un canal **pauzat** apare cu badge roșu și motiv în `/deliveries` → tab Platforme.
- **De ce nu pot refuza/anula Glovo din Symbai?** Este limita API-ului public Glovo Partner: Symbai trimite accept/ready/pickup, dar reject/anulare se fac in Glovo/suport Glovo si revin in Symbai prin cancellation webhook.
- **Ce inseamna auto-accept dupa traficul din KDS?** Nu accepta orbeste. Daca este activ pe canalul Glovo, trimite catre Glovo `committedPreparationTime` calculat din coada bucatariei. Explica userului ca poate alege intre `Intra la rand` si `Prioritate Glovo`, plus ETA minim/maxim.
- **Ce fac cand restaurantul e aglomerat pe Wolt/Glovo?** Foloseste `snooze_delivery_channel` cu confirmare: canalul este pus temporar offline la sursa si auto-accept-ul se opreste. Symbai nu pierde comenzile deja intrate; pentru dovezi reciteste `list_channel_orders`/`get_channel_order`.
- **De ce s-a dublat totalul unei comenzi Glovo?** Unele conturi trimit `price` ca pret unitar, altele ca total de linie. Verifica setarea canalului `settings.glovo.priceIsLineTotal`.
- **De ce imi respinge Glovo meniul complet?** Valorile necunoscute in etichetele dietetice pot respinge tot meniul. Curata `custom:glovo_dietary_labels` la valorile acceptate si evita full sync-uri repetate; limita de siguranta este 5 full sync-uri reusite/zi/canal fara `force:true`.
- **De ce nu pot asigna comanda unui angajat?** Trebuie să fie bifat ca livrator (Flotă → Livratori) ȘI să aibă un **schimb deschis**. Lista „Alege livrator activ" arată doar livratorii cu schimb deschis.
- **De ce livratorul apare „Offline" deși lucrează?** Statusul vine din poziția GPS trimisă de aplicația livratorului; fără poziție în ultimele 15 minute dispare din „Livratori activi". Verifică dacă are aplicația deschisă și tracking-ul pornit.
- **Livratorii costă în plus?** Da — fiecare angajat bifat ca livrator se taxează nominal (modul Livrator, 29€/livrator) și numărul se trimite automat în Hub. Bifarea nu dă și nu ia acces la pagini.
- **De ce nu se salvează vehiculul pe care îl aleg eu la asignare?** Implicit se ia vehiculul din schimbul deschis al livratorului; alegerea manuală e opțională și are prioritate. La drag-and-drop se folosește mereu vehiculul din schimbul livratorului țintă.
- **De ce pagina Zone Livrare e blocată?** Zonele sunt per locație — alege întâi o locație din selectorul de sus.
- **Clientul nu vede poziția curierului pe linkul de tracking** — opțiunea „Afișează poziția livratorului" trebuie activată în `/dispatch/settings` (Tracking public).
- **De ce nu primesc alerte de întârziere?** Pragurile (SLA promis, „fără livrator", „livrator inactiv", „blocat în bucătărie") se setează în `/dispatch/settings`; alertele apar în Mission Control.
- **Comenzile Glovo/Wolt nu apar în Dispecerat** — sunt fluxuri separate: platformele își aduc curierii lor (le gestionezi în `/deliveries`), iar Dispeceratul e pentru livrările cu flota proprie sau curieri externi comandați de tine.
- **De ce nu văd paginile /ecommerce/...?** Apar doar dacă domeniul de activitate Magazin online / Ecommerce e activ pe firmă; în plus, anumite pagini pot fi ascunse administrativ din Symbai Hub.
- **O livrare eșuată dispare dacă o anulez?** Anularea e definitivă (comanda trece pe Anulată); dacă vrei să mai încerci, folosește „Re-livrează" sau „Reprogramează".
- **Profitabilitatea pe platforme după comision?** Pe scurt în `/channels` → Prezentare & KPI și `/deliveries` → Rapoarte/Platforme (comision azi, rată anulare, timp de pregătire); pentru analiza completă există KPI-uri dedicate de profitabilitate a canalelor în P&L.

## Pentru acces SQL
Tabele relevante: `channel_orders` + `delivery_channels` (comenzile și canalele platformelor), `orders` (comenzile interne, inclusiv câmpurile de livrare: adresă, livrator asignat, motiv eșec), `delivery_zones` + `delivery_schedules`, `vehicles` + `vehicle_shifts` + `fuel_receipts`, `driver_day_closures`, `driver_locations`, `delivery_photos`, `delivery_alerts` + `dispatch_settings` + `dispatch_audit` + `delivery_provider_quotes`, `ecommerce_orders` + `ecommerce_order_items`, `courier_accounts` + `awb_shipments`, `marketplace_accounts` + `marketplace_order_map`, `subscriptions` + `subscription_deliveries`, `central_whatsapp_messages`.
Exemple: „câte comenzi Glovo am avut săptămâna asta" → `channel_orders` filtrat pe canal; „livrările eșuate pe motive luna asta" → `orders` cu motivul de eșec; „câți km a făcut fiecare vehicul" → `vehicle_shifts` (km start/final).
