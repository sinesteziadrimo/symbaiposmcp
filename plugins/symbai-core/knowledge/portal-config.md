# Portalul clienților — configurare (platforma web publică)

> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie` — sursa autoritară de navigare (link direct pe subdomeniul tenantului). Pentru jocuri & atracții (program, prețuri, rezervări de joc) vezi `jocuri-activitati.md`; pentru planul de sală, raioane și cele două sisteme de QR vezi `plan-sala-qr.md`; aici e configurarea portalului în sine.

## Pe scurt

**Portalul clienților** (sau „platforma clienților", „aplicația clienților") e site-ul/aplicația web PUBLICĂ pe care o văd vizitatorii restaurantului/parcului/hotelului: intră scanând un QR la masă, de pe website sau din parc. De acolo pot (după cum activezi tu): vedea meniul, comanda online (livrare/pickup/la masă), face rezervări, intra în programul de fidelitate, juca/rezerva atracții, vedea evenimente, folosi gamificarea (misiuni, XP, nivele), vorbi cu un chat AI. Tu controlezi TOT ce văd și ce pot face: **aspectul** (culori, font, stil, chips de categorie), **funcționalitățile** pornite/oprite, **textele**, **ce tab-uri și secțiuni apar**, **ce afișează meniul public** (alergeni, gramaj, filtre, mod de navigare, butoane Fast Travel) și **cum funcționează comanda prin QR de la masă** (ce date cere clientul, dacă plătește online, dacă trece prin ospătar).

Configurarea se face în pagina **/menu/platforms** (alias `/portal-config`), care deschide un **dialog cu 5 tab-uri** (General, Texte, Funcționalități, Aspect, QR). Dialogul e fragil de operat prin mouse — de aceea preferi **tool-urile MCP**, care citesc config-ul și scriu doar ce ceri, fără click prin tab-uri. Și ca userul să VADĂ în browserul lui ce schimbi, ai `spotlight_portal_tab` (deschide modala + comută tab/secțiune live).

Pe aceeasi pagina exista si cardul **"In Aplicatie Staff"**. Acela NU configureaza portalul clientilor; configureaza preview-ul aplicatiei **Symbai Staff** pentru livratori/agenti/angajati. Pentru el foloseste `expo-aplicatii-mobile.md` + skill-ul `configureaza-aplicatie-staff`. Nu folosi `configure_portal_*` pentru Aplicatie Staff.

## Discovery — întreabă inteligent înainte să configurezi

Userul rareori știe toate opțiunile. **Nu turna tot dialogul peste el** și nu cere „spune-mi toate setările". Pornește de la business-ul lui și pune 3-5 întrebări țintite, apoi recomandă o variantă simplă și o aplici. Întrebări utile (alege ce e relevant):

1. **Ce fel de loc e?** (restaurant cu masă / fast-food / cafenea / bar / parc de distracții / hotel) → setează `businessType`, schimbă layout-ul și ce module au sens.
2. **Cum ajung clienții pe portal?** QR la masă / link de pe site / din parc → dacă e QR la masă, intri pe fluxul QR (vezi mai jos).
3. **Ce vrei să POATĂ face clientul?** doar să vadă meniul / să comande / să rezerve / să acumuleze puncte / să joace → `configure_portal_features`.
4. **Comandă online?** dacă da: livrare, pickup, sau doar la masă? plătesc ei online sau cheamă ospătarul? → `allowDelivery`/`allowPickup` + QR `directPaymentMode`.
5. **Cum vrei să arate?** o culoare principală + un font; restul lasă-le default. „Nu știu" → propune ceva curat pe baza brandului și arată-i.

**Reguli de discovery:** o întrebare clară pe rând, cu opțiuni concrete (nu „ce navStyle vrei?"). Când userul nu știe, **recomandă varianta simplă și mergi mai departe** — nu-l bloca. La final, rezumă în limbaj de business ce ai pus și arată-i (screenshot / spotlight).

## Concepte

- **Portal / platformă clienți** — instanța web publică a brandului. Configurarea e per **brand** (opțional diferită per **locație**).
- **Tip business** (`businessType`) — restaurant / cafe / bar / qsr (fast-food) / amusement_park (parc de distracții). Schimbă layout-ul implicit și secțiunile sugerate.
- **Aspect (temă)** — identitatea vizuală: culoare principală/secundară/accent/fundal/text (hex), font, colțuri (ascuțite/rotunjite/capsule), stil butoane (plin/contur/pastel), stil carduri (umbră/bordură/flat), stil navigare (solid/transparent/minimal), **stil + culoare pentru chips-urile de categorie** din meniu.
- **Funcționalități** — module pornite/oprite: meniu, comenzi, rezervări, QR la masă, profil, atracții, jocuri, evenimente, gamificare, fidelitate, grupuri sociale, chat AI, notificări push, prieteni, mesagerie. Oprit = clientul nu-l vede deloc.
- **Texte** — copywriting-ul paginii de bun venit: titlu, subtitlu, butonul principal, text de descoperire, butonul + descrierea de înregistrare.
- **Afișare (display)** — ce **tab-uri** apar (home, menu, attractions, games, events, gamification, qrCode, shop, hotel, profile) și cu ce **etichete**; ce **secțiuni home** apar; ce **secțiuni profil** apar; și **butoanele Fast Travel** (scurtături peste categoriile meniului — vezi mai jos).
- **Setări meniu public** — ce arată meniul: gramaj, alergeni, descrieri, nutriție, header-uri categorii, imagine hero (banner), filtre dietetice, și **modul de navigare prin categorii** (`categoryNavMode`).
- **Nivel Configurare QR** — vezi secțiunea dedicată mai jos. Decide ce date cere clientul la scanare și dacă/cum plătește online de la masă.
- **Autentificare** — `requireLogin` (cere cont) și `requireDate` (cere data nașterii la prima logare — util pentru bar/alcool sau evenimente cu vârstă).
- **Livrare / pickup** — `allowDelivery` / `allowPickup`: dacă portalul acceptă comenzi cu livrare și/sau ridicare (modulul de comenzi trebuie și el pornit).

## Tool-urile de configurare

Toate iau `brandId` (și opțional `locationId`). Citirea merge mereu; scrierile cer modulul **Setări & Configurare** (`setari`). Fiecare `configure_portal_*` scrie DOAR câmpurile pe care le dai — restul rămân neatinse (merge server-side).

- **`get_portal_config(brandId, locationId?)`** — citește TOATĂ configurarea (tip business, culori, texte, funcționalități, afișare, **config meniu**, și **config QR**: nivel + mod plată + preset). **Citește ÎNTÂI**, înainte de orice scriere.
- **`configure_portal_general`** — tip business, nume platformă, autentificare (requireLogin/requireDate), livrare/pickup.
- **`configure_portal_appearance`** — culori (hex), font, borderRadius, buttonStyle, cardStyle, navStyle, plus **`categoryChipStyle`** (filled/outline/soft/glass/gradient/minimal) și **`categoryChipColor`** (hex; gol `""` = folosește culoarea principală).
- **`configure_portal_texts`** — titlu/subtitlu bun venit, butoane, texte de înregistrare.
- **`configure_portal_features`** — pornește/oprește modulele (boolean).
- **`configure_portal_display`** — `tabs{}` (incl. `shop`, `hotel` — false implicit), `tabLabels{}`, `homeSections{}`, `profileSections{}`, și **`fastTravel`** (vezi mai jos).
- **`configure_portal_menu_config`** — showWeight, showAllergens, showDescription, showNutrition, showCategoryHeaders, menuHeroImage (URL), dietaryFilters[], plus **`categoryNavMode`** (flat / two-level / drill-down).
- **`configure_portal_qr`** — **Nivel Configurare QR**: nivelul (brand/zona/raion), modul de plată online (`directPaymentMode`), presetul activ de câmpuri (la nivel brand), și câmpurile de date cerute clientului. Trăiește în alt loc decât restul (vezi „Unde trăiește fiecare setare").
- **`spotlight_portal_tab` / `highlight_portal_section`** — NU schimbă date; deschid modala în browserul userului și comută pe tab/secțiune ca să VADĂ live ce configurezi. `brandId` e **obligatoriu** (țintește exact ecranul brandului corect).

### Fast Travel (`configure_portal_display`, câmpul `fastTravel`)
Butoane-scurtătură afișate peste categoriile meniului (ex. „🍕 Pizza", „🍺 Bere") care duc direct la o categorie. Structură: `{ enabled: bool, fullLabels: bool, buttons: [ { label, icon (emoji), iconType:"emoji", bgColor (hex), textColor (hex), targetCategoryId (id categorie), enabled: bool } ] }` — **maxim 5 butoane**. `targetCategoryId` e id-ul categoriei țintă (din `list_menu_categories`).

### Mod navigare categorii (`categoryNavMode`)
Cum parcurge clientul categoriile în meniul public: **flat** (toate produsele pe o pagină, derulare lungă — cel mai simplu), **two-level** (sub-tab-uri de categorii), **drill-down** (intri în categorie, apoi vezi produsele). Recomandă **flat** pentru meniuri mici, **two-level/drill-down** pentru meniuri mari cu multe categorii.

## Nivel Configurare QR — ce e și cum recomanzi

Tab-ul „QR" din dialog (`configure_portal_qr`) controlează **comanda prin QR de la masă**: ce date cere clientul când scanează, dacă trece prin ospătar, și dacă plătește online. Are trei piese:

### 1. Nivelul (`qrLevel`) — unde se setează câmpurile cerute clientului
Decide la ce granularitate definești „ce date cere portalul la scanare":

| Nivel | Ce înseamnă | Unde configurezi presetul | Pentru cine |
|---|---|---|---|
| **`brand`** (Per Brand 🏪) | Aceleași setări QR în TOT brandul | **Aici, în dialog** (câmpurile de mai jos) | **Recomandat — cel mai simplu.** Majoritatea localurilor. |
| **`zona`** (Per Zonă 📍) | Setări diferite pe fiecare zonă de salon (salon vs terasă vs piscină) | **Personal → Program Salon** (`/staff?tab=floor-schedule`) | Localuri unde terasa/piscina cer alte date decât salonul |
| **`raion`** (Per Raion 🎯) | Setări pe fiecare raion (secțiune de ospătar) din fiecare zonă | **Personal → Program Salon** | Cazuri rare, control foarte fin |

**Cum recomanzi (regula de aur):** dacă userul nu știe ce vrea, **recomandă `brand`** — „aceleași setări peste tot, le configurezi într-un singur loc, simplu". Treci la `zona` DOAR dacă userul spune explicit „pe terasă vreau altceva decât în salon" (ex. pe terasă cere și telefon, în salon nu). Treci la `raion` aproape niciodată — doar dacă chiar are nevoie de control per secțiune de ospătar. **Mai simplu = mai puține locuri de întreținut.** Spune-i clar: la `zona`/`raion`, presetul efectiv se alege în **Program Salon**, nu aici.

### 2. Câmpurile cerute clientului (presetul)
Ce completează clientul la scanare: prenume / nume / email / telefon (fiecare: vizibil + obligatoriu), **confirmarea ospătarului** (`waiterConfirmation` — comanda trece pe la ospătar înainte de bucătărie) și **când** se cer datele (`clientFieldsPrompt`: la scanare / înainte de comandă / după comandă). La nivel `brand` le setezi prin `configure_portal_qr` (câmpurile `nameVisible`, `phoneRequired`, `waiterConfirmation` etc.). La nivel `zona`/`raion` se setează prin preseturi în Program Salon (`list_qr_field_presets` / `set_qr_field_preset_fields` — vezi `plan-sala-qr.md`).

### 3. Plata online de la masă (`directPaymentMode`)
Dacă și cum plătește clientul direct din telefon, fără ospătar:

| Valoare | Ce înseamnă |
|---|---|
| **`off`** | Fără plată online — clientul comandă, plătește la ospătar (clasic). **Default, cel mai simplu.** |
| **`pay_on_order`** | Obligatoriu la comandă — plătește când trimite comanda |
| **`pay_end_of_meal`** | La finalul mesei — plătește online nota la final |
| **`pay_per_client`** | Fiecare cu produsele lui — fiecare client plătește doar ce a comandat |

**Recomandă `off`** dacă userul nu are nevoie clară de plată online (cele mai multe restaurante cu masă). `pay_on_order` e potrivit la fast-food / self-service / evenimente cu prepaid.

## Cum ajunge comanda QR la ospătar (lanțul de rutare)

Important de înțeles ca să-i explici userului — comanda QR NU ajunge la cineva doar pentru că ai configurat QR-ul. Lanțul complet:

1. Clientul scanează QR-ul **mesei** → portalul mesei (`/t/<cod>`). (QR-ul de masă se generează din `/qr-codes`; vezi `plan-sala-qr.md`.)
2. Portalul cere datele după **preset** (nivel brand/zonă/raion) și clientul comandă.
3. Dacă `waiterConfirmation` e pornit → comanda așteaptă confirmarea ospătarului înainte să meargă la bucătărie. Dacă nu → poate merge direct.
4. Dacă `directPaymentMode ≠ off` → clientul plătește online; altfel plata e la ospătar.
5. **Cui ajunge comanda** — ordinea de rutare automată: **cine are masa blocată > cine are comandă activă pe masă > zona atribuită > raionul/secțiunea din tura ospătarului**. Dacă nimeni nu acceptă în **2 minute**, cererea se difuzează către TOȚI cei în tură; primul care acceptă o preia.

**Veriga critică, des uitată:** comanda ajunge la ospătarul corect DOAR dacă **tura lui e legată de raionul mesei**. Raioanele se desenează în planul de sală (`plan-sala-qr.md`), iar ospătarul se pune pe raion în **modalul de tură** din **Program Salon / Planificator Ture** (`/staff?tab=scheduler` → „Secțiune Atribuită"; ce aranjament e activ pe zi → `/staff?tab=floor-schedule`). Vezi skill-ul `gestioneaza-personal`. Dacă userul zice „comanda QR ajunge la cine nu trebuie / nu ajunge la nimeni" → verifică: (a) raionul mesei, (b) tura ospătarului legată de acel raion, (c) că e cineva în tură.

## Unde trăiește fiecare setare (de ce contează la citire/scriere)
- Aspect, texte, funcționalități, afișare, config meniu → pe „device"-ul de portal (per brand/locație). Le scrii cu `configure_portal_*` respective.
- **Config QR** (nivel + mod plată + preset brand) → în alt loc (profilul „table-clients" al meniului), NU pe device. De aceea are tool separat (`configure_portal_qr`) și apare în `get_portal_config` sub `qrConfig`.
- Preseturile QR per **zonă/raion** → în Program Salon, nu în dialogul portalului.
- Rutarea efectivă a comenzii → în planul de sală (raioane) + turele din Personal.

## Pagini
- **Configurare Portal** (`/menu/platforms`, alias `/portal-config`) — cardul „Configurare Platformă Clienți" deschide dialogul cu 5 tab-uri (General / Texte / Funcționalități / Aspect / QR). Are selector de unitate (sus) dacă brandul are mai multe locații. ⚠ Tab-urile dialogului NU sunt adresabile prin `?tab=` în URL (e o modală în pagină) — DAR le poți deschide/comuta live cu `spotlight_portal_tab` ca userul să vadă. În rest, modificările le faci prin MCP.
- **Aplicatie Staff** (`/menu/platforms`) — cardul „In Aplicatie Staff" deschide dialogul de preview pentru Symbai Staff: profiluri livrator/agent teren/CRM/task-uri, branding Symbai, telefon interactiv. Nu e portal public si nu are tool MCP dedicat in catalogul curent. Vezi `expo-aplicatii-mobile.md` + skill `configureaza-aplicatie-staff`.
- **Jocuri** (`/portal-games`) — atracții/jocuri (liste, programe, prețuri, excepții). → `jocuri-activitati.md`.
- **Atracții** (`/portal-attractions`) — vizualizarea publică a atracțiilor.
- **Misiuni & Recompense** (`/portal-missions`) — gamificarea; din MCP doar pornești modulul (`gamification: true`), configurarea fină e în pagină.
- **Program Salon** (`/staff?tab=floor-schedule`) — aranjamentul de sală activ pe zi + **presetul QR per zonă/raion**. Aici se configurează QR-ul când nivelul e `zona`/`raion`.
- **Coduri QR** (`/qr-codes`) — generarea/tipărirea codurilor QR de masă. → `plan-sala-qr.md`.
- **Portalul public** — site-ul efectiv pe care-l vede clientul (din QR/link). Acolo se reflectă tot ce configurezi.

## Fluxuri pas-cu-pas

1. **Schimbi aspectul** („pune portalul pe verde, font Poppins, butoane rotunjite"): `get_portal_config` → `configure_portal_appearance(brandId, primaryColor:"#059669", fontFamily:"Poppins", borderRadius:"rounded")` → deschizi portalul în Chrome, screenshot, arăți userului.
2. **Pornești/oprești un modul**: `configure_portal_features(brandId, reservations:true, games:true, orders:false)`. Modul fără date = client vede gol; populează-l.
3. **Schimbi textele**: `configure_portal_texts(brandId, welcomeTitle:"Bun venit!", exploreButton:"Vezi Meniul")`.
4. **Ascunzi/redenumești un tab**: `configure_portal_display(brandId, tabs:{events:false}, tabLabels:{menu:"Meniul Nostru"})`.
5. **Configurezi meniul public**: `configure_portal_menu_config(brandId, showAllergens:true, showWeight:true, dietaryFilters:["vegan","gluten_free"], categoryNavMode:"two-level")`.
6. **QR la masă, simplu (recomandat)**: `configure_portal_qr(brandId, qrLevel:"brand", directPaymentMode:"off", nameVisible:true, phoneVisible:true)` → spune-i că setările se aplică în tot brandul și că pentru rutare ospătarul trebuie pus pe raion în Program Salon.
7. **Arăți userului ce faci, live**: `spotlight_portal_tab(brandId, tab:"qr", section:"qr-level")` → modala se deschide în browserul lui pe tab-ul QR, evidențiind nivelul.
8. **Verifici cum e configurat**: `get_portal_config(brandId)` — răspunzi în limbaj de business ce e pornit/oprit, culori, QR.

## Spotlight — arată-i userului în browser ce configurezi
`spotlight_portal_tab(brandId, tab, section?)` și `highlight_portal_section(brandId, tab, section)` trimit un semnal live către ecranul de management deschis în browserul userului: deschid modala „Configurare Platformă Clienți" (dacă e închisă), comută pe tab și (opțional) derulează + pulsează o secțiune. Tab-uri: `general`, `texts`, `features`, `appearance`, `qr`. Secțiuni cunoscute (`section`): `qr-level`, `qr-payment-mode`, `fast-travel`, `home-sections`, `profile-sections`, `menu-display`, `category-chips`.
- **`brandId` e obligatoriu** — fără el nu se trimite (ca să nu apară modala la alt client). Userul trebuie să aibă aplicația deschisă pe brandul respectiv (sau pe „toate" cu brandul selectat).
- Folosește-l înainte/în timp ce schimbi setări, ca userul să urmărească: „uite, deschid tab-ul QR — aici alegem nivelul". Apoi aplici schimbarea prin `configure_portal_*` și (la aspect) faci și screenshot.

## Întrebări frecvente

- **De ce nu apare X în aplicația clienților?** Modulul e oprit în Funcționalități SAU tab-ul e ascuns în Afișare SAU secțiunea home e dezactivată SAU lipsesc datele (modul pornit, dar gol). Verifică cu `get_portal_config`.
- **Schimbarea nu se vede în portal.** După `success`, datele sunt corecte; portalul poate arăta vechiul până la refresh (cache). Confirmă cu `get_portal_config`, nu repeta scrierea.
- **Comanda QR ajunge la cine nu trebuie / la nimeni.** Nu e (mereu) bug: vezi „lanțul de rutare" mai sus. Verifică raionul mesei + tura ospătarului legată de raion + că e cineva în tură. La 2 min fără acceptare, se difuzează către toți.
- **Per brand sau per zonă la QR?** Recomandă `brand` (simplu, un loc). `zona` doar dacă chiar vrea setări diferite pe terasă vs salon.
- **Vreau alt aspect/QR doar pe o locație.** Dă `locationId` la `configure_portal_*`; fără el, schimbarea e pe tot brandul.
- **Cum pun banner la meniu?** `configure_portal_menu_config(menuHeroImage:"<url>")` — ai nevoie de URL. Fără URL, încarci poza din pagină.
- **Cum cer cont obligatoriu / verificare vârstă?** `configure_portal_general(requireLogin:true)` și/sau `requireDate:true`.

## Capcane

- **Default-uri scrise peste setări existente** — trimite DOAR câmpurile pe care le schimbi. Citește cu `get_portal_config` înainte.
- **Modul pornit fără date** — pornești „Jocuri"/„Fidelitate" dar clientul vede gol. Pornește modulul ȘI populează-l.
- **QR configurat ≠ comanda ajunge la ospătar** — config-ul QR cere datele, dar rutarea depinde de raion + tură (vezi lanțul). Spune-i userului mereu și de pasul Program Salon.
- **Nivel QR greșit** — dacă pui `zona`/`raion` dar userul nu configurează preseturile în Program Salon, comportamentul cade pe default. Pentru simplitate, `brand`.
- **Culori ca text, nu hex** — tool-ul cere hex (`#059669`). `categoryChipColor` gol (`""`) = folosește culoarea principală.
- **Confuzie cu meniul tipărit** — „meniul public din portal" (ce afișează site-ul) ≠ „meniul fizic tipăribil" (PDF, skill `meniu-fizic`).
- **Brand vs. locație greșit** — config pe alt `brandId` decât cel al portalului = „nu se schimbă nimic". Confirmă cu `list_brands`.
- **`spotlight` fără brandId** — nu se trimite (intenționat). Dă mereu `brandId`.

## Tool-uri MCP utile

- **Citire (fără permisiune de modul):** `get_portal_config`, `list_portal_games`, `get_game_details`, `check_game_availability`, `get_game_slots`, `list_qr_field_presets`, `list_floor_zones`. Plus `gaseste_in_aplicatie` (link direct) și `jurnal_activitate`.
- **Scriere — modul «Setări & Configurare» (`setari`):** `configure_portal_general`, `configure_portal_appearance`, `configure_portal_texts`, `configure_portal_features`, `configure_portal_display`, `configure_portal_menu_config`, `configure_portal_qr`, `spotlight_portal_tab`, `highlight_portal_section`, plus QR per raion: `set_qr_field_preset_fields`, și jocuri: `update_game_config`, `update_game_schedule`, `update_game_pricing`, `set_game_date_override`.
- **Scriere — modul «Rezervări & Clienți» (`rezervari_clienti`):** `create_game_reservation`.
- „Permisiune insuficientă" → modulul nu e bifat pe token → portal Hub → Acces AI. Catalogul complet: `tools-mcp.md`.
