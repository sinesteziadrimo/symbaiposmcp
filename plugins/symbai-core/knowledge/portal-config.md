# Portalul clienților — configurare (platforma web publică)

> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie` — sursa autoritară de navigare (link direct pe subdomeniul tenantului). Pentru jocuri & atracții (program, prețuri, rezervări de joc) vezi `jocuri-activitati.md`; pentru planul de sală, raioane și cele două sisteme de QR vezi `plan-sala-qr.md`; aici e configurarea portalului în sine.

## Pe scurt

**Portalul clienților** (sau „platforma clienților", „aplicația clienților") e site-ul/aplicația web PUBLICĂ pe care o văd vizitatorii restaurantului/parcului/hotelului: intră scanând un QR la masă, de pe website sau din parc. De acolo pot (după cum activezi tu): vedea meniul, comanda online (livrare/pickup/la masă), face rezervări, intra în programul de fidelitate, juca/rezerva atracții, vedea evenimente, folosi gamificarea (misiuni, XP, nivele), vorbi cu un chat AI. Tu controlezi TOT ce văd și ce pot face: **aspectul** (culori, font, stil, chips de categorie), **funcționalitățile** pornite/oprite, **textele**, **ce tab-uri și secțiuni apar**, **ce afișează meniul public** (alergeni, gramaj, filtre, mod de navigare, butoane Fast Travel, **categorii pe slider orizontal**) și **cum funcționează comanda prin QR de la masă** (ce date cere clientul, dacă plătește online, dacă trece prin ospătar).

Configurarea se face în pagina **/menu/platforms** (alias `/portal-config`), care deschide dialogul **„Configurare Portal Clienți”**, pe pași: General, Texte, Meniu & funcții, Aspect, QR la masă, De acasă (comenzile de acasă, la restaurante/parcuri), Timpi, plus Hotel la hoteluri. Setările se aplică unității selectate. Dialogul e fragil de operat prin mouse — de aceea preferi **tool-urile MCP**, care citesc config-ul și scriu doar ce ceri, fără click prin tab-uri. Și ca userul să VADĂ în browserul lui ce schimbi, ai `spotlight_portal_tab` (deschide modala + comută tab/secțiune live).

Pe aceeași pagină există și cardul **„În Aplicație Staff"**. Acela NU configurează portalul clienților; configurează prezentarea reală per rol și preview-ul aplicației **Symbai Staff** pentru livratori/agenți/angajați. Pentru el folosește `expo-aplicatii-mobile.md` + skill-ul `configureaza-aplicatie-staff`. Nu folosi `configure_portal_*` pentru Aplicație Staff.

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
- **Setări meniu public** — ce arată meniul: gramaj, alergeni, descrieri, nutriție, header-uri categorii, imagine hero (banner), filtre dietetice, **modul de navigare prin categorii** (`categoryNavMode`) și **listă sau slider pe fiecare categorie** (`categoryLayouts`, vezi mai jos). Filtrele dietetice (vegetarian, vegan, fără gluten, fără lactoză) se aplică și în catalogul comenzilor de acasă: un produs apare la un filtru doar dacă are declarată explicit acea etichetă (numele produsului nu contează), iar mai multe filtre se combină (toate trebuie îndeplinite). Cu nutriția oprită secțiunea dispare; valorile necompletate nu se afișează ca zero.
- **Nivel Configurare QR** — vezi secțiunea dedicată mai jos. Decide ce date cere clientul la scanare și dacă/cum plătește online de la masă.
- **Autentificare** — `requireLogin` (cere cont) și `requireDate` (cere data nașterii la prima logare — util pentru bar/alcool sau evenimente cu vârstă).
- **Livrare / pickup** — `allowDelivery` / `allowPickup`: dacă portalul acceptă comenzi cu livrare și/sau ridicare (modulul de comenzi trebuie și el pornit). Comanda QR de la masă, livrarea, ridicarea și tab-ul de comenzi de acasă sunt **independente**: poți avea doar QR, doar comenzi de acasă sau ambele. Butonul „Comandă acasă” apare clientului numai când canalul unității are cel puțin un mod (livrare/ridicare) și o metodă de plată; meniul și prețurile de acasă vin din meniul canalului, nu din meniul QR.
- **Plata din credit (portofel)** — dialogul, pasul General → „Plata comenzilor din sold”: clientul cu cont își plătește din sold coșul de la masă sau comanda de acasă. E **oprită implicit** și trebuie pornită explicit; e separată de vânzarea intrării cu credit. Se pornește din aplicație sau prin asistent cu `configure_portal_wallet` (`walletPayments`). Detalii: `cartela-portofel-client.md`.
- **Intrare cu credit (parc)** — oferta „Intrare părinte” (nume, preț, descriere): clientul plătește intrarea, iar suma rămâne în cont pentru consumație. Activă implicit doar la parcurile de distracții; se schimbă din ghidul de configurare al portalului (Portal clienți) sau prin asistent cu `configure_portal_wallet` (`walletAdmission`) și se vinde și la recepție, din pagina cartelelor. Detalii: `cartela-portofel-client.md`.
- **Planul Smart** — fără vânzare prin casa Symbai: comanda din QR la masă și ridicarea funcționează, dar fără plată online (nota se închide „La casa proprie”, bonul rămâne pe casa restaurantului); livrarea din portal nu e inclusă.

## Tool-urile de configurare

Toate iau `brandId` (și opțional `locationId`). Citirea merge mereu; scrierile cer modulul **Setări & Configurare** (`setari`). Fiecare `configure_portal_*` scrie DOAR câmpurile pe care le dai — restul rămân neatinse (merge server-side).

- **`get_portal_config(brandId, locationId?)`** — citește TOATĂ configurarea (tip business, culori, texte, funcționalități, afișare, **config meniu**, și **config QR**: nivel + mod plată + preset). **Citește ÎNTÂI**, înainte de orice scriere. Dacă portalul/QR este activ dar nu are niciun meniu asociat pe canalele lui, întoarce `warnings[]` și mesaj cu `ATENTIE`; fixul este `assign_menu_to_channel`, nu auto-asociere.
- **`configure_portal_general`** — tip business, nume platformă, autentificare (requireLogin/requireDate), livrare/pickup. La PRIMA configurare a unui portal nou, tool-ul pune automat default-uri după `businessType`: restaurant/cafe/bar/qsr/hotel primesc funcțiile de ospitalitate (meniu, comenzi, rezervări, QR, profil, loialitate, notificări) și tema albastră `#2563eb`; `amusement_park`/parc păstrează setul complet de parc și tema violet `#7c3aed`. Pe un portal existent NU suprascrie funcțiile/tema alese de client.
- **`configure_portal_appearance`** — aspectul de bază: culori (hex), fontul textului (Inter, Poppins, Roboto, Open Sans, Montserrat, Playfair Display, Lato, Nunito, Raleway, Merriweather, Lora, Cormorant Garamond, DM Serif Display, Oswald, Josefin Sans, Quicksand sau un font propriu adăugat deja în `branding.fonts.custom`), borderRadius, buttonStyle, cardStyle, plus **`categoryChipStyle`** (filled/outline/soft/glass/gradient/minimal) și **`categoryChipColor`** (hex; gol `""` = folosește culoarea principală). `navStyle` e o valoare veche pe care portalul nu o mai folosește: bara de sus se setează în `configure_portal_display` → `branding.topBar`.
- **`configure_portal_texts`** — titlu/subtitlu bun venit, butoane, texte de înregistrare.
- **`configure_portal_features`** — pornește/oprește modulele (boolean).
- **`configure_portal_display`** — `tabs{}` (incl. `shop`, `hotel` — false implicit), `tabLabels{}`, `homeSections{}`, `profileSections{}`, **`fastTravel`** (vezi mai jos), **`signup`** (formularul de cont nou: email/telefon obligatorii, bife de acord, text GDPR), `privacyPolicyUrl` și **`branding`** (identitatea vizuală avansată — vezi secțiunea dedicată).
- **`prepare_portal_media_transfer` → `attach_portal_media_transfer`** — urcă o poză (JPEG/PNG/WebP, 12 MB), un video (MP4/WebM/MOV, 100 MB) sau un font (WOFF2/WOFF/TTF/OTF, 5 MB) primite pe WhatsApp sau aflate pe calculator, fără base64: prepare dă `uploadURL` (din WhatsApp: `upload_media_to_symbai`; de pe calculator: PUT), attach verifică fișierul după conținut și întoarce adresa `/uploads/website/…`. Portalul nu se schimbă singur: pui adresa cu `configure_portal_display` (branding) sau `configure_portal_menu_config` (`menuHeroImage`). O poză care e deja pe internet (https) se pune direct, fără transfer.
- **`configure_portal_wallet`** — portofelul clienților pe o unitate (`brandId` + `locationId`): `walletPayments {enabled}` = plata din sold la masă și la comanda de acasă; `walletAdmission {enabled, name, price, description}` = intrarea cu credit (preț 0,01–10.000 lei, toată suma rămâne credit). Schimbă doar ce trimiți. Cere dreptul paginii Meniu → Platforme (administrarea meniului sau sincronizarea meniurilor de livrare) și unitatea în aria contului; o unitate care folosea configurația comună primește configurația ei, copiată din aceea. Schimbă ce pot plăti clienții: cere acordul. Starea curentă: `get_portal_config` cu același `brandId` și `locationId` → `wallet` (`activ` = ce văd clienții acum; un portal oprit le ține închise). După copierea configurației comune pe unitate, salvările pe configurația comună a brandului nu o mai schimbă.
- **`configure_portal_menu_config`** — showWeight, showAllergens, showDescription, showNutrition, showCategoryHeaders, menuHeroImage (URL), dietaryFilters[], plus **`categoryNavMode`** (flat / two-level / drill-down / custom), `navCategoryIds[]`, `hiddenCategoryIds[]` și **`categoryLayouts`** (listă sau slider pe categorii — vezi secțiunea dedicată).
- **`configure_portal_qr`** — **Nivel Configurare QR**: nivelul (brand/zona/raion), modul de plată online (`directPaymentMode`), presetul activ de câmpuri (la nivel brand), și câmpurile de date cerute clientului. Trăiește în alt loc decât restul (vezi „Unde trăiește fiecare setare").
- **`spotlight_portal_tab` / `highlight_portal_section`** — NU schimbă date; deschid modala în browserul userului și comută pe tab/secțiune ca să VADĂ live ce configurezi. `brandId` e **obligatoriu** (țintește exact ecranul brandului corect).

### Identitatea vizuală avansată (`configure_portal_display`, câmpul `branding`)
Portalul se poate aduce la nivelul site-ului firmei. Fără `branding` salvat, portalul arată ca înainte. Se aplică portalului web (și celui instalat pe telefon din browser); aplicația nativă din magazine, unde există, nu preia încă aceste setări. În pagină: pașii Aspect, Meniu & funcții și Texte, cu **„Previzualizare live”** (telefon și desktop, inclusiv modificările nesalvate).
- **`fonts`** — `heading` = font separat pentru titluri (null = ca textul); `custom[]` = până la 4 fonturi proprii `{family, url, weight, style}` (fișierul se urcă cu `prepare_portal_media_transfer`, kind `font`). Fontul textului rămâne în `configure_portal_appearance.fontFamily` și poate fi și un font propriu.
- **`customCss`** — CSS propriu peste tema portalului (max. 20.000 caractere, fără `@import`). Elemente utile: `[data-testid=topnav-header]`, `[data-testid=mobile-nav]`, `[data-testid=portal-welcome-banner]`, `.portal-home-block`, `h1–h3`.
- **`topBar`** — `background`: `glass` (semi-transparentă, implicit) / `solid` (opacă) / `brand` (culoarea principală) / `custom` (+ `color`); `logoSize` sm/md/lg/xl; `logoFrame` (caseta din jurul logoului); `showName`.
- **`welcomeBanner`** — `background`: `gradient` (implicit) / `brand` / `image` / `video` / `plain`; `imageUrl`, `videoUrl`, `overlay` 0–80, `textColor` auto/light/dark, `showWave` (mânuța 👋), `align`, `height`.
- **`tabs`** — `order` (ex. `["menu","delivery","home","profile"]`, restul urmează) și `icons` (ex. `{menu:"ChefHat", delivery:"ShoppingBag"}`, din lista închisă descrisă în unealtă).
- **`home`** — constructorul paginii Acasă: `blocks[]` (max. 20: `hero`, `textImage`, `gallery`, `cards`, `buttons`, `text`, fiecare cu `id`, `enabled`, `audience` all/signedIn/guests) și `layout[]` = ordinea, amestecând secțiunile existente (`{section:"orderingEntry"}`…) cu blocurile (`{block:"id"}`). Ascunderea secțiunilor existente rămâne în `homeSections`. Linkurile: pagini din portal (`/menu`, `/restaurant-order`, `/profile`, `/questionnaire/ID`), https, `tel:`, `mailto:`.
- **`texts`** — orice text fix rescris: cheia de traducere sau textul original exact în română → textul nou (se traduce singur în celelalte limbi). Chei utile: `restaurant.title` (cardul „Comandă de acasă”; la firmele doar cu ridicare scrie singur „Comandă pentru ridicare”), `restaurant.orderTab`, `portal.branding.orderPageTitle`, `portal.branding.loginButton`, `portal.branding.greeting` (cu `{name}`), `portal.branding.welcomeBack` (cu `{portal}`), `auth.or` (separatorul „SAU”).
- **`menu`** — `categoryLabels` (nume afișat per id de categorie, fără să schimbe meniul din POS), `parentInPath: "hide"` („Starters” în loc de „KITCHEN/Starters”), `chipInactive: "tinted"` (butoanele de categorie neselectate în nuanța culorii brandului; implicit gri).
- Scrierea e pe grupuri: în `fonts`/`topBar`/`welcomeBanner`/`tabs`/`home`/`menu` se schimbă doar cheile trimise; listele (`fonts.custom`, `tabs.order`, `home.layout`, `home.blocks`) se trimit întregi; în `texts`, `tabs.icons`, `menu.categoryLabels` o valoare `null` scoate cheia; `null` pe un grup îl readuce la implicit; `branding: null` = tot aspectul implicit. Verifică după scriere cu `get_portal_config` → `portalDisplayConfig.branding` (o instanță neactualizată poate ignora câmpul).

### Fast Travel (`configure_portal_display`, câmpul `fastTravel`)
Butoane-scurtătură afișate peste categoriile meniului (ex. „🍕 Pizza", „🍺 Bere") care duc direct la o categorie. Structură: `{ enabled: bool, fullLabels: bool, buttons: [ { label, icon (emoji), iconType:"emoji", bgColor (hex), textColor (hex), targetCategoryId (id categorie), enabled: bool } ] }` — **maxim 5 butoane**. `targetCategoryId` e id-ul categoriei țintă (din `list_menu_categories`).

### Mod navigare categorii (`categoryNavMode`)
Cum parcurge clientul categoriile în meniul public: **flat** (toate produsele pe o pagină, derulare lungă — cel mai simplu), **two-level** (sub-tab-uri de categorii), **drill-down** (intri în categorie, apoi vezi produsele). Recomandă **flat** pentru meniuri mici, **two-level/drill-down** pentru meniuri mari cu multe categorii.

### Listă sau slider pe categorii (`categoryLayouts`)
Restaurantul alege cum își arată fiecare categorie produsele în meniul clienților — **portalul web, pagina QR de la masă și aplicația clienților** citesc aceeași setare:
- **Listă** (implicit) — produsele una sub alta.
- **Slider** — produsele categoriei pe un rând orizontal care se derulează cu degetul (slider lateral, carusel). Opțiuni: `cardSize` = `small` / `medium` / `large` (mari = carduri late, bune pentru pizza, platouri, deserturi cu poză frumoasă) și `rows` = `1` sau `2` (două rânduri arată bine la băuturi). La finalul rândului apare cardul „Vezi toate”, care desface categoria în listă; „Restrânge” o readuce la slider.

Cum se moștenește: cheia e ID-ul categoriei sau `all` (tot meniul). O subcategorie fără setare proprie **preia setarea celui mai apropiat părinte** — „Bar” pe slider pune pe slider și Cocktailuri, Bere, Vinuri, fiecare pe rândul ei; o subcategorie poate reveni explicit la `list`. Ordinea: setarea categoriei → a părintelui → `all` → implicit (listă; pe pagina QR cu profilul „Rânduri orizontale” implicitul e slider).

Exemple:
- „Pune tot barul pe slider”: `list_menu_categories` → ID-ul categoriei Bar → `configure_portal_menu_config(brandId, categoryLayouts:{"968":{style:"slider", cardSize:"medium", rows:1}})`.
- „Vinurile pe două rânduri, cu carduri mici, dar cafeaua în listă”: `categoryLayouts:{"924":{style:"slider", cardSize:"small", rows:2}, "879":{style:"list"}}`.
- „Tot meniul pe slider”: `categoryLayouts:{"all":{style:"slider"}}`. „Scoate setarea de pe Pizza” (revine la moștenit): `categoryLayouts:{"869":null}`.
- Se schimbă DOAR cheile trimise; ID-urile trebuie să fie categorii active ale brandului (altfel tool-ul refuză și numește categoriile). Răspunsul și `get_portal_config` → `categoryLayouts` îți dau rezumatul lizibil: ce e setat explicit, ce categorii ajung pe slider (cu cele moștenite) și chei rămase de la categorii șterse (`staleCategoryIds`).
- Arată-i omului locul: `highlight_portal_section(brandId, section:"category-layouts")` (pasul Meniu & funcții → „Produse pe categorii” + butonul Listă/Slider de pe fiecare rând din „Categorii afișate în portal”). Link direct: `/menu/display?platform=portal-web&tab=features&section=category-layouts` (îl dă și `gaseste_in_aplicatie("slider categorii")`).
- Când omul are configuratorul deschis, Sym vede pe pagină (`pagina_citeste`) lista categoriilor cu setarea efectivă și câmpurile „Listă sau slider: <categorie>”; le poți completa cu `pagina_actioneaza completeaza` (rămân nesalvate, omul vede schimbarea) și salvezi cu acțiunea „Salvează” doar după „da”-ul lui. Pagina expune câmpuri pentru primele 39 de categorii vizibile; pentru restul folosește `configure_portal_menu_config`. Dacă scrii prin `configure_portal_menu_config` cât timp el are formularul deschis cu modificări nesalvate, spune-i — altfel salvarea lui o poate rescrie.
- Clienții văd schimbarea la următoarea încărcare a meniului; aplicația de telefon o arată după actualizarea aplicației care conține sliderul.

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
- Aspect, texte, funcționalități, afișare, config meniu → în configurația de portal a brandului (opțional per locație). Le scrii cu `configure_portal_*` respective.
- **Config QR** (nivel + mod plată + preset brand) → se salvează separat (pe canalul de meniu „table-clients"), nu împreună cu restul configurației de portal. De aceea are tool separat (`configure_portal_qr`) și apare în `get_portal_config` sub `qrConfig`.
- Preseturile QR per **zonă/raion** → în Program Salon, nu în dialogul portalului.
- Rutarea efectivă a comenzii → în planul de sală (raioane) + turele din Personal.

## Pagini
- **Configurare Portal** (`/menu/platforms`, alias `/portal-config`) — cardul „Configurare Platformă Clienți" deschide dialogul cu 5 tab-uri (General / Texte / Funcționalități / Aspect / QR). Are selector de unitate (sus) dacă brandul are mai multe locații. ⚠ Tab-urile dialogului NU sunt adresabile prin `?tab=` în URL (e o modală în pagină) — DAR le poți deschide/comuta live cu `spotlight_portal_tab` ca userul să vadă. În rest, modificările le faci prin MCP.
- **Aplicație Staff** (`/menu/platforms`) — cardul „In Aplicatie Staff" configurează prezentarea Symbai Staff per rol. Nu e portal public; folosește `get_staff_app_config`, `configure_staff_app_role`, `configure_staff_app_roles` și `configure_staff_app_defaults`. Vezi `expo-aplicatii-mobile.md` + skill `configureaza-aplicatie-staff`.
- **Jocuri** (`/portal-games`) — atracții/jocuri (liste, programe, prețuri, excepții). → `jocuri-activitati.md`.
- **Atracții** (`/portal-attractions`) — vizualizarea publică a atracțiilor.
- **Misiuni & Recompense** (`/portal-missions`) — gamificarea: pornești modulul (`gamification: true`), iar misiunile le creezi în pagină sau prin asistent (`create_portal_mission`, `set_portal_mission_active`; caută-le cu `cauta_tool` dacă nu apar). Tipuri care se numără automat: comandă, rezervare de joc, recenzie și **vizită**. Vizita se numără doar când personalul validează intrarea clientului la recepție (scanează cartela sau codul din aplicație, pagina cartelelor → „Confirmă vizita în parc”), cel mult o dată pe zi; plata online singură nu o numără. Misiunile zilnice se reiau la miezul nopții, cele săptămânale lunea (ora României); recompensele câștigate rămân de revendicat.
- **Program Salon** (`/staff?tab=floor-schedule`) — aranjamentul de sală activ pe zi + **presetul QR per zonă/raion**. Aici se configurează QR-ul când nivelul e `zona`/`raion`.
- **Coduri QR** (`/qr-codes`) — generarea/tipărirea codurilor QR de masă. → `plan-sala-qr.md`.
- **Portalul public** — site-ul efectiv pe care-l vede clientul (din QR/link). Acolo se reflectă tot ce configurezi.

## Fluxuri pas-cu-pas

1. **Schimbi aspectul** („pune portalul pe verde, font Poppins, butoane rotunjite"): `get_portal_config` → `configure_portal_appearance(brandId, primaryColor:"#059669", fontFamily:"Poppins", borderRadius:"rounded")` → deschizi portalul în Chrome, screenshot, arăți userului.
2. **Pornești/oprești un modul**: `configure_portal_features(brandId, reservations:true, games:true, orders:false)`. Modul fără date = client vede gol; populează-l.
3. **Schimbi textele**: `configure_portal_texts(brandId, welcomeTitle:"Bun venit!", exploreButton:"Vezi Meniul")`.
4. **Ascunzi/redenumești un tab**: `configure_portal_display(brandId, tabs:{events:false}, tabLabels:{menu:"Meniul Nostru"})`.
5. **Configurezi meniul public**: `configure_portal_menu_config(brandId, showAllergens:true, showWeight:true, dietaryFilters:["vegan","gluten_free"], categoryNavMode:"two-level")`.
5b. **Portalul/QR e activ dar meniul public e gol**: `get_portal_config(brandId)` sau `get_config_status(brandId)` arată avertismentul de meniu lipsă → `list_menus` + `assign_menu_to_channel({ brandId, channel:"parc-distractii" sau "table-clients", sourceMenuIds:[...] })` → recitești `get_portal_config` și confirmi că `warnings` e gol. Nu asocia automat primul meniu fără acord: brandurile pot avea meniuri diferite pe canale.
6. **QR la masă, simplu (recomandat)**: `configure_portal_qr(brandId, qrLevel:"brand", directPaymentMode:"off", nameVisible:true, phoneVisible:true)` → spune-i că setările se aplică în tot brandul și că pentru rutare ospătarul trebuie pus pe raion în Program Salon.
7. **Arăți userului ce faci, live**: `spotlight_portal_tab(brandId, tab:"qr", section:"qr-level")` → modala se deschide în browserul lui pe tab-ul QR, evidențiind nivelul.
8. **Verifici cum e configurat**: `get_portal_config(brandId)` — răspunzi în limbaj de business ce e pornit/oprit, culori, QR.

## Spotlight — arată-i userului în browser ce configurezi
`spotlight_portal_tab(brandId, tab, section?)` și `highlight_portal_section(brandId, tab, section)` trimit un semnal live către ecranul de management deschis în browserul userului: deschid modala „Configurare Platformă Clienți" (dacă e închisă), comută pe tab și (opțional) derulează + pulsează o secțiune. Tab-uri: `general`, `texts`, `features`, `appearance`, `qr`, `timpi`. Secțiuni cunoscute (`section`, tabul se deduce din ea): în General `portal-signup`; în Texte `portal-branding-texts`; în Meniu & funcții `home-sections`, `portal-home-layout`, `profile-sections`, `menu-display`, `category-layouts`, `portal-category-labels`, `portal-tabs-order`, `fast-travel`; în Aspect `portal-visual-identity`, `portal-branding-top-bar`, `portal-branding-welcome-banner`, `portal-branding-custom-fonts`, `category-chips`, `portal-custom-css`; în QR `qr-level`, `qr-payment-mode`, `qr-ordering`, `qr-auto-cancel`; în Timpi `eta-times`. Secțiunile noi apar după actualizarea Symbai care le include.
- **`brandId` e obligatoriu** — fără el nu se trimite (ca să nu apară modala la alt client). Userul trebuie să aibă aplicația deschisă pe brandul respectiv (sau pe „toate" cu brandul selectat).
- Folosește-l înainte/în timp ce schimbi setări, ca userul să urmărească: „uite, deschid tab-ul QR — aici alegem nivelul". Apoi aplici schimbarea prin `configure_portal_*` și (la aspect) faci și screenshot.

## Întrebări frecvente

- **De ce nu apare X în aplicația clienților?** Modulul e oprit în Funcționalități SAU tab-ul e ascuns în Afișare SAU secțiunea home e dezactivată SAU lipsesc datele (modul pornit, dar gol). Verifică cu `get_portal_config`.
- **De ce portalul/QR arată gol deși produsele există?** Verifică `warnings[]` în `get_portal_config` și itemul `portal_menu_assignment` din `get_config_status`: portalul afișează produse doar dacă există o asociere activă meniu-canal. Asociază meniul potrivit cu `assign_menu_to_channel`.
- **Schimbarea nu se vede în portal.** După `success`, datele sunt corecte; portalul poate arăta vechiul până la refresh (cache). Confirmă cu `get_portal_config`, nu repeta scrierea.
- **Comanda QR ajunge la cine nu trebuie / la nimeni.** Nu e (mereu) bug: vezi „lanțul de rutare" mai sus. Verifică raionul mesei + tura ospătarului legată de raion + că e cineva în tură. La 2 min fără acceptare, se difuzează către toți.
- **Per brand sau per zonă la QR?** Recomandă `brand` (simplu, un loc). `zona` doar dacă chiar vrea setări diferite pe terasă vs salon.
- **Vreau alt aspect/QR doar pe o locație.** Dă `locationId` la `configure_portal_*`; fără el, schimbarea e pe tot brandul.
- **Cum pun banner la meniu?** `configure_portal_menu_config(menuHeroImage:"<url>")`. Poza de pe WhatsApp sau de pe calculator o urci întâi cu `prepare_portal_media_transfer(kind:"image")` → trimiți fișierul → `attach_portal_media_transfer` întoarce adresa.
- **„Vreau portalul să arate ca site-ul nostru.”** `configure_portal_display(branding:{...})`: font pentru titluri (+ fontul propriu urcat), bara de sus opacă cu logo mai mare, banner cu poza/video-ul lor, ordinea și iconițele taburilor, blocuri proprii pe Acasă, CSS propriu. Arată-i rezultatul cu „Previzualizare live” din configurator sau deschide portalul.
- **„Schimbă textul X din portal” (un text fix, nu titlul de bun venit).** `configure_portal_display(branding:{texts:{"<cheie sau textul original exact>":"textul nou"}})`; titlurile de bun venit rămân în `configure_portal_texts`.
- **Cum cer cont obligatoriu / verificare vârstă?** `configure_portal_general(requireLogin:true)` și/sau `requireDate:true`.

## Capcane

- **Default-uri scrise peste setări existente** — trimite DOAR câmpurile pe care le schimbi. Citește cu `get_portal_config` înainte.
- **Default-uri la portal nou** — dacă portalul nu există încă, `configure_portal_general` alege singur setul inițial după `businessType`. Nu porni/opri manual toate funcțiile doar ca să corectezi vechiul default de parc: citește după creare cu `get_portal_config`, apoi ajustează doar diferențele cerute de user.
- **Modul pornit fără date** — pornești „Jocuri"/„Fidelitate" dar clientul vede gol. Pornește modulul ȘI populează-l.
- **Portal activ fără meniu asociat** — clientul vede portal gol. `get_portal_config` avertizează proactiv, iar `get_config_status` marchează `portal_menu_assignment` neconfigurat. Rezolvi cu `assign_menu_to_channel` pe canalul corect (`parc-distractii` pentru magazin online web, `table-clients` pentru QR la masă), după ce confirmi meniul.
- **QR configurat ≠ comanda ajunge la ospătar** — config-ul QR cere datele, dar rutarea depinde de raion + tură (vezi lanțul). Spune-i userului mereu și de pasul Program Salon.
- **Nivel QR greșit** — dacă pui `zona`/`raion` dar userul nu configurează preseturile în Program Salon, comportamentul cade pe default. Pentru simplitate, `brand`.
- **Culori ca text, nu hex** — tool-ul cere hex (`#059669`). `categoryChipColor` gol (`""`) = folosește culoarea principală.
- **Confuzie cu meniul tipărit** — „meniul public din portal" (ce afișează site-ul) ≠ „meniul fizic tipăribil" (PDF, skill `meniu-fizic`).
- **Brand vs. locație greșit** — config pe alt `brandId` decât cel al portalului = „nu se schimbă nimic". Confirmă cu `list_brands`.
- **`spotlight` fără brandId** — nu se trimite (intenționat). Dă mereu `brandId`.

## Tool-uri MCP utile

- **Citire (read-only; cere grantul `readModule` al domeniului pe token):** `get_portal_config`, `get_config_status`, `list_portal_games`, `get_game_details`, `check_game_availability`, `get_game_slots`, `list_qr_field_presets`, `list_floor_zones`. Plus `gaseste_in_aplicatie` (link direct) și `jurnal_activitate`.
- **Scriere — modul «Setări & Configurare» (`setari`):** `configure_portal_general`, `configure_portal_appearance`, `configure_portal_texts`, `configure_portal_features`, `configure_portal_display`, `prepare_portal_media_transfer`, `attach_portal_media_transfer`, `configure_portal_wallet` (cu dreptul paginii Meniu → Platforme), `configure_portal_menu_config`, `configure_portal_qr`, `spotlight_portal_tab`, `highlight_portal_section`, plus QR per raion: `set_qr_field_preset_fields`, și jocuri: `update_game_config`, `update_game_schedule`, `update_game_pricing`, `set_game_date_override`.
- **Scriere — modul «Rezervări & Clienți» (`rezervari_clienti`):** `create_game_reservation`.
- „Permisiune insuficientă" → modulul nu e bifat pe token → portal Hub → Acces AI. Catalogul complet: `tools-mcp.md`.
