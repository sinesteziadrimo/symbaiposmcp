---
name: configureaza-portal
description: Configurează portalul/aplicația clienților (platforma web publică) — ce văd și ce pot face vizitatorii: aspectul (culori, font, butoane, carduri, chips de categorie), funcționalitățile (meniu, comenzi, rezervări, fidelitate, jocuri, gamificare, chat), textele de bun venit, ce tab-uri și secțiuni apar, setările meniului public (alergeni, gramaj, filtre dietetice, mod navigare, butoane Fast Travel), comanda prin QR de la masă (Nivel Configurare QR — brand/zonă/raion, ce date cere clientul, plată online, confirmare ospătar), plus jocurile/atracțiile parcului (program, prețuri, excepții de dată) și rezervările de joc. Le faci prin conexiune (MCP) și poți deschide/comuta modala în browserul userului ca să VADĂ live (spotlight). Folosește la „configurează portalul clienților", „schimbă culorile/aspectul portalului", „pune verde/violet pe portal", „schimbă numele platformei", „activează rezervările/jocurile/fidelitatea pe portal", „ascunde meniul/comenzile din portal", „schimbă textul de bun venit", „arată alergenii/gramajul în meniul public", „ce tab-uri văd clienții", „configurează QR-ul de la masă", „ce date să ceară clientul la scanare", „plată online de la masă", „per brand sau per zonă la QR", „de ce ajunge comanda QR la cine nu trebuie", „adaugă butoane Fast Travel", „adaugă un joc/atracție", „pune program/preț la jocul X", „închide jocul pe 25 decembrie", „rezervă un joc pentru un client", „arată-mi în browser ce configurezi", „de ce nu apare X în aplicația clienților".
---

# Configurează portalul clienților — prin conexiune, nu prin click pe dialog

Userul vrea să schimbe **platforma/portalul clienților** — aplicația web publică pe care o văd vizitatorii lui (scanează un QR la masă, intră de pe site, din parc): cum arată (culori, font, chips de categorie), ce module sunt pornite (meniu, comenzi, rezervări, fidelitate, jocuri, gamificare, chat), ce scrie pe pagina de bun venit, ce tab-uri și secțiuni apar, ce afișează meniul public (inclusiv butoane Fast Travel și modul de navigare), **cum funcționează comanda prin QR de la masă** (Nivel Configurare QR — ce date cere clientul, plată online, confirmare ospătar), plus jocurile/atracțiile (program, prețuri, rezervări). Pagina de configurare din aplicație e un **dialog cu 5 tab-uri** (General, Texte, Funcționalități, Aspect, QR) — fragil de operat prin mouse. **Tot ce contează are tool MCP**: citești config-ul, scrii doar ce ceri, fără să te chinui prin tab-uri. Și poți deschide modala în browserul userului ca să VADĂ live ce schimbi (`spotlight_portal_tab`). Apoi îi arăți rezultatul.

**Nu folosi acest skill pentru "In Aplicatie Staff" / Symbai Staff / livratori / agenti teren.** Acelea se configureaza tot pe `/menu/platforms`, dar prin alt card si alt model: skill `configureaza-aplicatie-staff`, knowledge `expo-aplicatii-mobile.md`. Tool-urile `configure_portal_*` schimba doar portalul public al clientilor.

## Înainte de orice
1. Citește **`knowledge/portal-config.md`** (ce e portalul, TOATE tool-urile de config + modelul lor, ce înseamnă fiecare grup de setări — aspect/funcționalități/texte/afișare/meniu/**QR** — Nivelul de configurare QR cu ghidul de recomandare, lanțul de rutare QR→ospătar, spotlight-ul, și ce e „doar din pagină"), **`knowledge/jocuri-activitati.md`** (jocuri & atracții) și **`knowledge/condu-chrome.md`** (cum conduci Chrome: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie). Pentru rutarea comenzilor QR la ospătar citește și **`knowledge/comenzi-mese-ospatari.md`** + **`knowledge/plan-sala-qr.md`**.
2. **Context**: `list_brands` + `list_locations` → afli `brandId` (și `locationId` dacă userul vrea un portal diferit pe o locație). Aproape toate tool-urile cer `brandId`.
3. **Citește ÎNTÂI starea curentă**: `get_portal_config(brandId)` întoarce TOATĂ configurarea (tip business, culori, texte, funcționalități, afișare, config meniu, **config QR**). Citește înainte de orice scriere — ca să nu strici ce e deja setat și ca să-i spui userului ce e acum vs. ce schimbi. Dacă vezi `warnings[]` despre portal/QR activ fără meniu asociat, rezolvarea este `assign_menu_to_channel` pe canalul corect, după ce confirmi meniul.

## Discovery — întreabă-l inteligent, nu turna tot dialogul peste el
Userul rareori știe toate opțiunile. **Nu-l copleși** cu „ce navStyle vrei?". Pornește de la business-ul lui, pune 3-5 întrebări țintite cu opțiuni concrete, iar când nu știe — **recomandă varianta simplă și mergi mai departe** (nu-l bloca). Întrebări utile:
1. **Ce fel de loc e?** (restaurant cu masă / fast-food / cafenea / bar / parc / hotel) → `businessType`.
2. **Cum ajung clienții pe portal?** QR la masă / link de pe site / din parc → dacă e QR la masă, intri pe fluxul QR.
3. **Ce vrei să POATĂ face clientul?** doar vede meniul / comandă / rezervă / puncte / joacă → `configure_portal_features`.
4. **Comandă online?** livrare / pickup / doar la masă? plătesc ei online sau cheamă ospătarul? → `allowDelivery`/`allowPickup` + QR `directPaymentMode`.
5. **Cum vrei să arate?** o culoare + un font; restul default. „Nu știu" → propune ceva curat pe baza brandului și arată-i.
La final rezumă în limbaj de business ce ai pus și arată-i (spotlight / screenshot). O întrebare clară pe rând.

## Fluxul hibrid — ce tool pentru ce intenție

Scrierile merg prin tool-ul dedicat (scriu DOAR câmpurile pe care le dai — merge server-side, nu șterg restul). Tabel intenție → tool:

| Userul cere… | Tool MCP |
|---|---|
| „schimbă culorile / pune violet / alt font / butoane rotunjite / carduri cu umbră / alt stil de chips de categorie" | `configure_portal_appearance` (primaryColor/secondary/accent/background/text hex, fontFamily, borderRadius, buttonStyle, cardStyle, navStyle, **categoryChipStyle**: filled/outline/soft/glass/gradient/minimal, **categoryChipColor** hex sau "" = culoarea principală) |
| „activează/oprește rezervările / comenzile / jocurile / fidelitatea / gamificarea / chatul AI / notificările / meniul" | `configure_portal_features` (menu, orders, reservations, qrCode, attractions, games, events, gamification, loyalty, social, chat, notifications, friends, messages — toate boolean) |
| „schimbă titlul de bun venit / subtitlul / textul butonului / textul de înregistrare" | `configure_portal_texts` (welcomeTitle, welcomeSubtitle, exploreButton, discoverText, signupButton, signupDescription) |
| „schimbă numele platformei / tipul de business / cere autentificare / permite livrare-pickup" | `configure_portal_general` (portalName, businessType: restaurant/cafe/bar/qsr/amusement_park, requireLogin, requireDate, allowDelivery, allowPickup). La portal NOU, setează automat default-uri după businessType: ospitalitate = meniu/comenzi/rezervări/QR/profil/loialitate/notificări + `#2563eb`; parc = funcții complete + `#7c3aed`. Pe portal existent nu suprascrie alegerile clientului. |
| „ce tab-uri văd clienții / ascunde tab-ul X / redenumește tab-ul / ce secțiuni apar pe home / pe profil / butoane Fast Travel" | `configure_portal_display` (tabs{} incl. shop/hotel, tabLabels{}, homeSections{}, profileSections{}, **fastTravel** {enabled, fullLabels, buttons[≤5]: label/icon emoji/bgColor/textColor/targetCategoryId/enabled}) |
| „arată/ascunde alergenii / gramajul / descrierile / nutriția în meniul public / pune filtre dietetice / banner meniu / cum se navighează categoriile" | `configure_portal_menu_config` (showAllergens, showWeight, showDescription, showNutrition, showCategoryHeaders, dietaryFilters[], menuHeroImage, **categoryNavMode**: flat/two-level/drill-down) |
| „configurează QR-ul de la masă / ce date cere clientul la scanare / plată online de la masă / per brand sau per zonă / confirmare ospătar" | `configure_portal_qr` (qrLevel: brand/zona/raion, directPaymentMode: off/pay_on_order/pay_end_of_meal/pay_per_client, **directPayment** bool = poarta butonului de plată, nameVisible/phoneRequired/… , waiterConfirmation, clientFieldsPrompt, qrBrandPresetId) — **vezi secțiunea QR mai jos** |
| „arată-mi în browser ce faci / deschide-mi modala pe tab-ul X / uită-te aici" | `spotlight_portal_tab(brandId, tab, section?)` / `highlight_portal_section(brandId, section)` — deschide modala în browserul userului + comută tab/secțiune live |
| „ce am acum pe portal / cum e configurat / ce nivel QR am / de ce portalul e gol" | `get_portal_config` (citire — include config QR, portalMenuConfig și `warnings[]`; pentru readiness general vezi și `get_config_status`) |

**Jocuri & atracții** (când portalul e un parc/escape room/terenuri — `attractions`/`games` pornite în Funcționalități):

| Userul cere… | Tool MCP |
|---|---|
| „ce jocuri/atracții am" | `list_portal_games(brandId)` |
| „detalii la jocul X / program / prețuri / recenzii" | `get_game_details(gameId, date?)` |
| „avem loc pe data X ora Y pentru N persoane?" | `check_game_availability(gameId, date, time, partySize, exclusive?)` |
| „ce ore libere am pe data X" | `get_game_slots(gameId, date, partySize?)` |
| „rezervă jocul pentru un client" | `create_game_reservation(gameId, date, startTime, endTime, partySize, contactName, …)` — **întâi** `check_game_availability` ca să nu suprapui |
| „modifică jocul / nume / capacitate / vârstă / acceptă rezervări" | `update_game_config(gameId, …)` |
| „pune/schimbă program pe o zi (ore, durată slot, capacitate)" | `update_game_schedule(gameId, dayOfWeek, openTime, closeTime, …)` |
| „adaugă/schimbă prețul (per persoană/grup/exclusiv)" | `update_game_pricing(gameId, type, pricePerSession, …)` |
| „închide jocul pe 25 dec / program special într-o zi" | `set_game_date_override(gameId, date, closed?, customOpen?, …)` |

> Pentru jocuri, conceptele complete (slot, prep, label, exclusivitate, excepții care se „bat", overbooking) sunt în `jocuri-activitati.md` — nu le repeta, citește-le acolo. Aici e doar harta intenție→tool.

## QR de la masă — explică-i și recomandă simplu

Tab-ul „QR" controlează comanda prin scanarea codului de pe masă. Trei piese, plus o verigă de rutare:

**1. Nivelul (`qrLevel`) — unde definești ce date cere clientul:**
- **`brand`** (Per Brand) — aceleași setări peste tot, le configurezi AICI prin `configure_portal_qr`. **RECOMANDAT — cel mai simplu.** Dacă userul nu știe ce vrea, asta îi propui.
- **`zona`** (Per Zonă) — setări diferite pe fiecare zonă (salon vs terasă). Presetul se alege în **Personal → Program Salon**, nu aici. Doar dacă userul zice explicit „pe terasă vreau altceva".
- **`raion`** (Per Raion) — per secțiune de ospătar. Rar; doar la nevoie reală.
> Regula: **mai simplu = mai puține locuri de întreținut.** Întreabă „vrei aceleași reguli peste tot, sau diferite pe terasă/salon?". Dacă nu știe → `brand`. Spune-i clar: la zona/raion, presetul se face în Program Salon.

**2. Datele cerute clientului** (la nivel brand, prin `configure_portal_qr`): prenume/nume/email/telefon (vizibil + obligatoriu), `waiterConfirmation` (comanda trece pe la ospătar înainte de bucătărie), `clientFieldsPrompt` (când se cer: la scanare / înainte / după comandă).

**3. Plata online de la masă (`directPaymentMode`):** `off` (la ospătar — **recomandat, simplu**), `pay_on_order` (la comandă), `pay_end_of_meal` (nota la final), `pay_per_client` (fiecare ce a comandat). ⚠ Ca butonul de plată să APARĂ clientului trebuie **AMBELE**: mod ≠ off **ȘI** `directPayment:true` (la nivel brand) — altfel l-ai setat degeaba. La zona/raion, flag-ul de plată directă se activează pe presetul din Program Salon.

**Lanțul de rutare „cum ajunge comanda QR la ospătar"** (explică-l când userul întreabă „de ce ajunge la cine nu trebuie / la nimeni"): client scanează QR-ul mesei → comandă (cu datele din preset) → dacă `waiterConfirmation`, așteaptă confirmarea ospătarului → rutare automată în ordinea **masa blocată > comandă activă pe masă > zona atribuită > raionul din tura ospătarului**; dacă nimeni nu acceptă în 2 min, se difuzează la toți cei în tură. **Veriga critică:** comanda ajunge la ospătarul corect DOAR dacă tura lui e legată de raionul mesei — se face în **Program Salon / Planificator Ture** (`gestioneaza-personal`), NU din QR. Când termini config-ul QR, spune-i userului și de pasul ăsta.

## Spotlight — arată-i live în browser ce configurezi
`spotlight_portal_tab(brandId, tab, section?)` deschide modala „Configurare Platformă Clienți" în browserul userului și comută pe tab; `highlight_portal_section(brandId, section)` derulează + pulsează o secțiune. Tab-ul se deduce automat din `section`, deci nu trebuie să-l potrivești manual. Secțiuni: `qr-level`, `qr-payment-mode`, `fast-travel`, `home-sections`, `profile-sections`, `menu-display`, `category-chips`.
- Folosește-l ca un ghid: „uite, deschid tab-ul QR — aici alegem nivelul" → `spotlight_portal_tab(brandId, tab:"qr", section:"qr-level")`, apoi aplici schimbarea prin `configure_portal_qr`.
- **`brandId` e obligatoriu.** Userul trebuie să aibă aplicația de management deschisă în browser (pe brandul lui sau pe „toate"). Dacă nu vede nimic, roagă-l să deschidă aplicația — și oricum explică-i în text ce ai schimbat (nu te baza DOAR pe spotlight).

## Cum NAVIGHEZI (pentru a arăta userului)
- **Config portal** → `navigate("/menu/platforms")` (alias `/portal-config`). Pagina are un **dialog cu 5 tab-uri** (General / Texte / Funcționalități / Aspect / QR) care se deschide la apăsarea cardului „Configurare Platformă Clienți". Tab-urile nu sunt adresabile prin `?tab=` în URL (e o modală), DAR le poți deschide/comuta live cu `spotlight_portal_tab` ca userul să vadă exact ce configurezi. Modificările le faci tot prin MCP.
- **Jocuri / atracții** → `navigate("/portal-games")` (gestionare: liste, programe, prețuri, excepții) și `/portal-attractions` (ce văd clienții). Un joc anume: `/portal-games/:gameId`.
- **Program Salon** → `navigate("/staff?tab=floor-schedule")` — acolo se face presetul QR per zonă/raion (când `qrLevel` e zona/raion) și se decide aranjamentul de sală pe zi. Ospătarul se pune pe raion în `/staff?tab=scheduler` (modalul de tură → „Secțiune Atribuită").
- **Portalul public** (ce vede clientul) — userul îl deschide din QR/link; tu poți deschide pagina lui publică ca să-i arăți rezultatul aspectului.
- Linkul live exact: `gaseste_in_aplicatie("configurare portal")` / `gaseste_in_aplicatie("jocuri")` — sursa autoritară de navigare. **Nu inventa URL-uri.**

## Cum ARĂȚI rezultatul
Userul nu vede conexiunea ta. După o schimbare (mai ales de aspect — culori, font), deschide portalul în Chrome și **fă screenshot** ca dovadă „uite cum arată acum" (ai nevoie de extensia `claude-in-chrome` + user logat). Schimbarea de aspect/texte e VIZUALĂ — un screenshot convinge mai mult decât o confirmare în text. Fără extensie: faci tot prin MCP, dar spune-i clar „am schimbat prin conexiune, dă refresh la portal ca să vezi" + dă-i link (vezi `condu-chrome.md`, fallback).

## Cazurile rare care cer click (în pagină, nu prin MCP)
- **Upload de imagini** (logo portal, banner hero al meniului dacă nu ai deja un URL) — încarci fișierul în dialog/pagină; tool-ul ia doar URL-ul (`menuHeroImage`). Dacă ai deja URL-ul imaginii, mergi pe MCP.
- **Generarea/tipărirea codurilor QR de masă** (`/qr-codes`) — generare/descărcare PNG/SVG/PDF e acțiune de pagină. (Setările de comportament QR — nivel, plată, câmpuri — le faci prin `configure_portal_qr`; preseturile per zonă/raion în Program Salon.)
- **Preseturi QR per zonă/raion** — când `qrLevel` e `zona`/`raion`, presetul efectiv se alege în Program Salon (`/staff?tab=floor-schedule`); `set_qr_field_preset_fields` editează un preset existent.
- **Misiuni & recompense / gamificare avansată** (`/portal-missions`) — configurarea fină a misiunilor e în pagină; din MCP doar PORNEȘTI modulul (`gamification: true`).
- Pentru orice click: citește pagina întâi, găsește elementul după text/`data-testid`, click pe ELEMENT, nu pe pixeli (vezi `condu-chrome.md`).

## Reguli (cele care contează)
- **MCP întâi, dialogul cu 5 tab-uri = ultima soluție.** Operatul prin mouse al dialogului e fragil; tool-urile scriu doar ce ceri și nu strică restul. Citește cu `get_portal_config` înainte, scrie cu tool-ul potrivit, confirmă re-citind.
- **Scrii doar ce-ți cere userul.** Fiecare `configure_portal_*` ia doar câmpurile date — restul rămân neatinse. Nu trimite valori pe care nu le-ai confirmat (ai pune default-uri peste setări existente).
- **Portal nou ≠ default de parc pentru toți.** La prima configurare, `configure_portal_general` pune default-uri potrivite tipului de business. Citește cu `get_portal_config` după creare și ajustează numai dacă userul vrea altceva.
- **Portal/QR activ fără meniu asociat = portal gol.** Dacă `get_portal_config` avertizează sau `get_config_status` arată `portal_menu_assignment` neconfigurat, nu recrea produse și nu schimba tema: citește meniurile, confirmă meniul potrivit și rulează `assign_menu_to_channel({ brandId, channel:"parc-distractii", sourceMenuIds:[...] })` pentru magazin online web sau `channel:"table-clients"` pentru QR la masă.
- **Culorile = hex.** `#7c3aed` violet, `#2563eb` albastru, `#059669` verde, `#dc2626` roșu. Dacă userul zice „pune verde", propune un hex concret și confirmă.
- **Per brand (sau per locație).** Config-ul e pe `brandId`; dă `locationId` doar dacă userul vrea un portal diferit pe o anumită locație. Întreabă dacă are mai multe locații.
- **Confirmă prin re-citire, nu prin „pare bine pe ecran".** Tool-ul a întors `success` = salvat; verifică cu `get_portal_config` și spune-i userului să dea refresh dacă portalul arată încă vechiul (cache browser). Nu repeta scrierea.
- **QR: recomandă `brand` (simplu) + nu uita rutarea.** Dacă userul nu știe, nivel `brand`. Plata online cere AMBELE: `directPaymentMode != off` ȘI `directPayment:true`. Și spune-i mereu: comanda QR ajunge la ospătar doar dacă tura lui e legată de raionul mesei (Program Salon) — config-ul QR singur nu rutează.
- **Jocuri: verifică ÎNAINTE de a rezerva.** `check_game_availability` înainte de `create_game_reservation` — altfel suprapui două grupe pe același slot.
- **Limbaj de business**, nu jargon de editor: „pun rezervările pe portal", „schimb culoarea în verde", „arăt alergenii în meniul public" — nu `configure_portal_features({reservations:true})`.
- **Permisiune (modul pe token):**
  - Config portal + jocuri (config/program/preț/excepție) → **Setări & Configurare** (`setari`).
  - Rezervare de joc (`create_game_reservation`) → **Rezervări & Clienți** (`rezervari_clienti`).
  - „Permisiune insuficientă" → modulul nu e bifat pe token → portal Hub → Acces AI.
- **Nu inventa.** Imagini, texte de brand, prețuri — ce nu știi, întrebi userul.

## Legături
- Conceptele portalului (toate tool-urile + ce înseamnă aspect/funcționalități/texte/afișare/meniu public/QR, Nivelul QR cu ghid de recomandare, lanțul de rutare QR→ospătar, spotlight, ce e „doar din pagină") → `knowledge/portal-config.md`.
- Cum ajunge comanda QR la ospătar + raioane + cele două sisteme QR → `knowledge/comenzi-mese-ospatari.md` + `knowledge/plan-sala-qr.md` + skill-ul `gestioneaza-personal` (tura legată de raion).
- Jocuri & atracții complet (slot, prep, label, exclusivitate, excepții, prețuri pe label, FAQ + capcane) → `knowledge/jocuri-activitati.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element nu pe pixel, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Rezervări de masă, contracte, avansuri, evenimente/petreceri legate de portal → `knowledge/rezervari-clienti-evenimente.md` + skill-ul `gestioneaza-crm`.
- Meniul public arată produsele din meniul tău → produse/prețuri/categorii prin skill-ul `adauga-produs-reteta`; meniul TIPĂRIT (alt lucru) → skill-ul `meniu-fizic`.
- E pasul de onboarding „Website & portal clienți" — vezi `onboarding/12-website-portal-livrari.md` + `onboarding/harta-pasi-wizard.md`.
- Ceva ce nu se poate prin conexiune → `trimite_ticket_symbai` (sugestie) + ghidează userul în app.
