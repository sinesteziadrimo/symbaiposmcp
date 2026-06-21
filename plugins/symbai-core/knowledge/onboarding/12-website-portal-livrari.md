# Onboarding 12 — Website-ul, portalul clienților, meniul fizic și platformele de livrare

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final, restaurantul are stratul „către client" pornit: **portalul clienților** (aplicația web pe care clientul o deschide prin QR sau link — meniu digital, comenzi, rezervări, fidelizare) e configurat și activ, **canalele de livrare** (Glovo/Wolt/Bolt Food/Tazz) sunt înregistrate, iar utilizatorul știe unde își face **website-ul**, **meniul fizic tipăribil**, **agenții de chat AI** și **CRM-ul de vânzări**. E ultima fază — consumă tot ce s-a construit înainte: meniul cu prețuri și poze (fazele de produse/meniu), planul de sală și QR-urile (faza 06), rezervările (faza 08). Singura zonă cu acoperire bună prin conexiune e **portalul**; restul e în mare parte ghidare în aplicație — fii onest cu utilizatorul despre asta.

În conversație (om de business, non-tehnic): spune „portalul clienților" sau „aplicația pentru clienți", „platformele de livrare", „meniul de tipărit" — niciodată „MCP", „tool", „endpoint", „JSON", „device".

## Permisiuni necesare pe token

- **`setari`** — tot ce se scrie în faza asta: `configure_portal_general/appearance/texts/features/display/menu_config`, `create_delivery_channel`, `create_menu_display_config`/`update_menu_display_config`, `update_game_config`/`update_game_schedule`/`update_game_pricing`/`set_game_date_override`.
- **`produse_meniu`** — doar dacă trebuie corectate prețuri de meniu înainte de meniul fizic (`bulk_update_menu_item_prices`).
- Citirile (`get_portal_config`, `list_sales_agents`, `list_portal_games`, `browse_brand_media`, `list_entities`...) merg mereu, fără module. Fără modulul potrivit, scrierile întorc „permisiune insuficientă" → utilizatorul bifează modulul în portal Hub → Acces AI, pe token.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citiri automate (fă-le întâi):**
1. `list_brands` + `list_locations` — brandId/locationId pentru toate apelurile.
2. `get_portal_config(brandId)` — `configured: false` = portal de la zero; altfel vezi tip, culori, funcționalități deja setate (nu reconfigura ce există).
3. `list_menus` / `list_menu_items` — portalul și meniul fizic afișează meniul digital; dacă nu există meniu cu prețuri, oprește-te și întoarce-te la faza de meniu.
4. `list_entities(entityType: "delivery_channels", brandId)` — ce canale de livrare există deja.
5. `list_sales_agents(brandId)` — agenții AI de vânzări existenți (pentru pasul Sales).
6. `browse_brand_media(brandId)` — ce poze are brandul (pentru imaginea hero a meniului din portal).
7. Doar pentru parcuri/spa/hotel: `list_portal_games(brandId)`.

**Întrebări MINIME (apoi execută):**
1. *„Ce vrei să poată face clienții pe telefonul lor: să vadă meniul, să comande de la masă, să comande cu livrare/ridicare, să rezerve?"* — din răspuns decizi `businessType`, `allowDelivery`/`allowPickup` și ce funcționalități activezi.
2. *„Ai culori de brand sau preferințe de aspect?"* — dacă nu, propune tu o combinație pe tipul localului (vezi rețetele de mai jos), nu-l pune să aleagă coduri hex.
3. *„Lucrezi cu Glovo, Wolt, Bolt Food sau Tazz?"* — doar pentru cine confirmă creezi canale.
4. Confirmă planul O DATĂ înainte de scrieri, apoi rulează tot lanțul fără re-întrebări. Nu întreba de website/meniu fizic/chat AI decât ca ofertă scurtă la final — sunt opționale și se fac din aplicație.

## Pașii de execuție — tool-urile MCP exacte

### A. Portalul clienților (zona principală prin conexiune)

Toate cele 6 tool-uri `configure_portal_*` au `brandId` obligatoriu, `locationId` opțional, și **îmbină** cu configurația existentă (câmpurile netrimise rămân cum erau). Primul apel **creează și activează** portalul. Ordinea recomandată:

**1. General — `configure_portal_general`**
```json
{"brandId": 1, "businessType": "restaurant", "portalName": "La Famiglia", "requireLogin": false, "allowDelivery": true, "allowPickup": true}
```
`businessType` are DOAR 5 valori: `restaurant`, `cafe`, `bar`, `qsr` (fast-food), `amusement_park` — mapează tipul real al localului pe cea mai apropiată. `requireLogin: true` doar dacă vrea fidelizare obligatorie; `requireDate` (data nașterii) e pentru parcuri/cluburi.

**2. Aspect — `configure_portal_appearance`**
```json
{"brandId": 1, "primaryColor": "#7c2d12", "fontFamily": "Playfair Display", "borderRadius": "rounded", "buttonStyle": "filled", "cardStyle": "shadow", "navStyle": "solid"}
```
Rețete verificate pe tip: restaurant clasic → maro `#7c2d12`/negru `#0f172a` + Playfair Display; cafenea → portocaliu `#d97706`/verde `#059669` + Nunito + pill/soft/flat; bar → violet `#7c3aed`/negru + Montserrat + sharp/outline/glass; fast-food → roșu `#dc2626` + Poppins + `requireLogin: false`.

**3. Texte — `configure_portal_texts`** — `welcomeTitle`, `welcomeSubtitle`, `exploreButton` („Vezi Meniul" / „Comandă Acum"), `discoverText`, `signupButton`, `signupDescription`. Scrie-le tu, personalizate pe brand, nu generice.

**4. Funcționalități — `configure_portal_features`** — boolean per modul: `menu`, `orders`, `reservations`, `qrCode`, `profile`, `loyalty`, `notifications`, `events`, `chat`, `gamification`, `social`, `friends`, `messages`, `attractions`, `games`. Restaurant tipic: ON `menu, orders, reservations, qrCode, profile, loyalty`; OFF `games, attractions, gamification, social`. `attractions`/`games`/`gamification` au sens la parcuri/spa/hotel. `chat: true` doar dacă va configura și agenții de chat (pasul din aplicație).

**5. Meniul din portal — `configure_portal_menu_config`** — `showWeight`, `showAllergens`, `showDescription`, `showNutrition`, `showCategoryHeaders` (boolean), `menuHeroImage` (URL — ia unul din `browse_brand_media`, nu inventa), `dietaryFilters` (listă din: `vegetarian, vegan, gluten_free, lactose_free, nut_free, sugar_free, spicy, halal, kosher`).

**6. Fin-tuning vizibilitate — `configure_portal_display`** — obiecte `tabs` (chei: `home, menu, attractions, games, events, gamification, qrCode, profile`), `tabLabels` (ex. `{"menu": "Meniul Nostru"}`), `homeSections`, `profileSections`. Folosește-l doar dacă utilizatorul vrea să ascundă explicit ceva — valorile implicite sunt bune.

**După fiecare scriere confirmă cu `get_portal_config(brandId)`** — nu prin interfață (cache în browser; utilizatorul vede după refresh). Dacă tool-ul a întors succes, e salvat: nu repeta, nu raporta bug. Clientul accesează portalul pe ruta relativă `/portal` sau scanând QR-ul de pe masă (QR-urile: faza 06).

### B. Platformele de livrare — `create_delivery_channel`

```json
{"platform": "glovo", "brandId": 1, "locationId": 1, "isActive": true}
```
`platform` din `glovo | wolt | bolt_food | tazz | own`; `brandId` obligatoriu. Idempotent pe platformă+brand: dacă există deja, întoarce canalul existent. **Asta doar înregistrează canalul** — credențialele de la platformă și sincronizarea meniului se fac din aplicație (vezi mai jos); fără ele canalul rămâne Offline și nu vin comenzi. Detalii operaționale: `livrari-comenzi-online.md`.

### C. Afișajul POS per dispozitiv (opțional) — `create_menu_display_config`

```json
{"brandId": 1, "profileType": "waiter_mobile", "name": "POS Mobil - 2 niveluri", "config": {"gridColumns": 3, "showImages": true, "categoryNavMode": "two-level", "searchGridColumns": 2, "showProductPrice": false}}
```
`brandId` + `profileType` obligatorii (`waiter_mobile | waiter_web | bar_pos | reception_pos | kiosk | delivery`). Idempotent pe profil+nume. ⚠ Asta e cum arată meniul pe ecranele POS/kiosk — **NU e meniul fizic tipăribil** și nu e portalul. Pentru categorii cu subcategorii pe POS mobil, pune în `config.categoryNavMode`: `flat` (toate categoriile), `two-level` (rădăcină + sub-tab-uri) sau `drill-down` (intri în categoria părinte). Expo POS Mobile respectă și opțiunile `showModalImage`, `showProductPrice`, `searchGridColumns`, `searchTextSize`, `uppercaseProducts`, `deviceSize`. Corecții: `update_menu_display_config(configId, { config: ... })`. Creează doar la cerere explicită — valorile implicite ale aplicației sunt rezonabile.

### D. Jocuri/atracții (doar parcuri, spa, hotel)

Jocurile se **creează** din aplicație; prin conexiune le poți inventaria (`list_portal_games`, `get_game_details`, `get_game_slots`, `check_game_availability`) și ajusta (`update_game_config(gameId, ...)` — capacitate, durată slot, rezervări; `update_game_schedule`, `update_game_pricing`, `set_game_date_override`). Sari complet secțiunea la restaurante obișnuite.

## Ce se face DOAR din aplicație

Pentru fiecare: dă link cu `gaseste_in_aplicatie(intrebare: ...)`, lasă utilizatorul să lucreze, apoi verifică prin citire.
- **Website-ul** — builder vizual cu asistent AI propriu în pagină (creezi site, alegi template pe profil, editezi pagini, publici cu Salvează). `gaseste_in_aplicatie("creează website")` (zona Magazin Online → Website-uri). Pozele se urcă întâi în Biblioteca Media (`gaseste_in_aplicatie("bibliotecă media brand")`) — nu există upload prin conexiune. Verificare: website-urile sunt stocate ca rânduri în `menu_display_configs` cu profilul `website` — `list_entities(entityType: "menu_display_configs", brandId)` și caută profilul `website`, sau întreabă utilizatorul (nu există tabelă `websites` separată). Paginile site-ului sunt descrise în `marketing-social.md`.
- **Credențialele platformelor de livrare + sincronizarea meniului** — `gaseste_in_aplicatie("conectare Glovo Wolt manager canale")` → tab Integrări (datele de la platformă), apoi tab Meniu & Prețuri (sincronizare). Verificare: `list_entities(entityType: "delivery_channels", brandId)` — canalul există; statusul Online se vede în aplicație după conectare.
- **Meniul fizic tipăribil** — designer dedicat: format (A4 individual / A3 broșură / A3 foaie / A3 orizontal „pe masă"), 6 template-uri de stil, fonturi, pagini de copertă/recomandări/alergeni, QR către meniul digital pe copertă; export prin fereastra de print a browserului („Salvare ca PDF", margini None). `gaseste_in_aplicatie("designer meniu fizic tipărit")`. Preia TOT din meniul digital — rolul tău e să verifici ÎNAINTE cu `list_menu_items` că numele/prețurile/descrierile sunt corecte (corecturi: `bulk_update_menu_item_prices`, modul `produse_meniu`). Nu modifică produsele din POS.
- **Agenții de chat AI de pe portal** — un „asistent" per brand + agenți specializați (Informații, Urgențe, Vânzări), creați conversațional în pagina lor. `gaseste_in_aplicatie("agenți chat AI portal")`. Înainte, activează `chat: true` prin `configure_portal_features`. Verificare: întreabă utilizatorul dacă asistentul apare în portal.
- **Agenții AI de vânzări + memoria lor** — creator conversațional dedicat (descrii ce vinzi — petreceri, nunți, corporate, catering — și el generează agentul + fișierele de memorie cu pachete/prețuri/FAQ). `gaseste_in_aplicatie("AI sales creator agent vânzări")`, memoria: `gaseste_in_aplicatie("memorii agenți vânzări")`. Verificare: `list_sales_agents(brandId)` — nume, tip, activ/inactiv. Activarea/dezactivarea agenților NU e disponibilă prin conexiune — tot din aplicație.
- **Sales CRM** — pipeline de dealuri cu etape configurabile (ex. Lead Nou → Calificare → Ofertă → Negociere → Contract → Câștigat/Pierdut), calendar, mod de lucru pe tip de business: Restaurant, Parc de Distracții, Cafenea/Bar, Sală Evenimente/Hotel, Servicii Profesionale (din tab-ul Setări al CRM-ului). Pur informativ + ghidare: `gaseste_in_aplicatie("sales CRM pipeline evenimente")`. Niciun tool de scriere pe dealuri.
- **Fidelizarea (puncte, niveluri, recompense) și misiunile cu XP** — `gaseste_in_aplicatie("program fidelizare")` și `gaseste_in_aplicatie("misiuni și recompense portal")`. Prin conexiune doar activezi modulele în portal (`loyalty`/`gamification` la `configure_portal_features`).
- **Butoanele „fast travel"** din meniul portalului (navigare rapidă la categorii) — doar din pagina de configurare a portalului din aplicație; `configure_portal_display` NU le acoperă.

## Echivalentul în wizard-ul din aplicație

Pașii **23–29** din `/onboarding`: 23 Sales CRM, 24 Agenți AI de vânzări, 25 Website, 26 Portal Clienți, 27 Agenți chat portal, 28 Meniu fizic, 29 Platforme & canale de comandă (recapitulare: POS, KDS, kiosk, QR, signage, website, agregatori — cu status real per canal). Sunt pași informativi + de ghidare; portalul configurat prin conexiune SE VEDE în wizard (pasul 26 citește aceeași configurație), dar **progresul wizard-ului (bifele de pași) NU se actualizează prin conexiune** — utilizatorul apasă singur „Următorul pas". Notă: aceeași configurație de portal se editează și din alte locuri în aplicație (pagina dedicată de configurare a portalului și dialogul „Configurare Platforma Clienți Web" din pagina meniului digital) — e o singură configurație, nu mai multe.

## Verificare la final

- [ ] `get_portal_config(brandId)` — `configured: true`, tip business corect, livrare/ridicare conform deciziei, funcționalitățile cerute active, texte personalizate (nu placeholder).
- [ ] `list_menu_items` — meniul are prețuri > 0 și descrieri acolo unde portalul/meniul fizic le afișează.
- [ ] `list_entities(entityType: "delivery_channels", brandId)` — câte un canal per platformă confirmată, fără duplicate.
- [ ] `list_sales_agents(brandId)` — dacă s-a vrut agent de vânzări: există și e activ.
- [ ] Utilizatorul a deschis `/portal` pe telefon (sau a scanat un QR) și confirmă că arată cum trebuie — testul real al fazei.

## Capcane

- **`businessType` la portal are doar 5 valori** (`restaurant/cafe/bar/qsr/amusement_park`) — nu coincide cu lista bogată de tipuri de business a brandului (pizzerie, bistro, hotel...). Mapează pe cel mai apropiat; pizzerie/bistro → `restaurant`, food truck/patiserie → `qsr` sau `cafe`.
- **Configurările de portal ÎMBINĂ, nu înlocuiesc** — poți apela `configure_portal_features` doar cu `chat: true` fără să pierzi restul. Dar `dietaryFilters` la `configure_portal_menu_config` se trimite ca listă COMPLETĂ (înlocuiește lista veche).
- **Orice `configure_portal_*` activează portalul** (îl face vizibil clienților). Nu „testa" tool-urile pe un brand al cărui portal nu trebuie să fie public încă fără acordul utilizatorului.
- **`create_delivery_channel` nu conectează nimic** — e doar înregistrarea canalului. Comenzile vin abia după credențiale + sincronizare meniu din aplicație. Nu raporta „Glovo conectat" pe baza apelului reușit.
- **Trei „meniuri" diferite, nu le confunda**: meniul din **portal** (`configure_portal_menu_config`), afișajul meniului pe **ecranele POS/kiosk** (`create_menu_display_config`) și **meniul fizic tipăribil** (designer, doar din aplicație). Toate citesc aceleași produse/prețuri din meniul digital.
- **`menuHeroImage` cere un URL existent** — caută cu `browse_brand_media`; nu există upload de imagini prin conexiune.
- **Portal gol = meniu negestionat, nu bug de portal** — dacă portalul nu afișează produse, cauza e aproape mereu în meniul digital (fără articole, fără prețuri, brand nelegat de locație), nu în configurația portalului.
- **`toggle_sales_agent` NU există prin conexiune** (doar `list_sales_agents`, citire). Nu promite porniri/opriri de agenți — ghidează în aplicație.
- **Interfața nu se actualizează instant** după scrieri — confirmă prin citire, spune-i utilizatorului să dea refresh.
- **Nicio ștergere prin conexiune** (canale de livrare, configurații de afișaj, agenți) — politică de siguranță; ghidează în aplicație.
