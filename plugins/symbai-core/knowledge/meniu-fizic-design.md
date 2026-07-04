# Meniul fizic — design prin MCP (Claude ca grafician senior)

> Cum citești, înțelegi și modifici meniul fizic tipăribil (`/menu/physical`) prin conexiune. Fluxul complet + finalizarea produselor: skill-ul `meniu-fizic` + `meniu-fizic-pricing.md`. Acest fișier = grammar-ul config-ului (ce poți schimba și cum). Conducerea Chrome (deep-link, screenshot ca livrabil, click doar la nevoie) = `condu-chrome.md`.

## ⚠ READ FIRST — ai tool-uri dedicate, NU mai lucra cu SQL + REPLACE

Editarea meniului fizic are **tool-uri MCP semantice** — sunt **calea principală**. NU mai citi config-ul cu `execute_sql_query("SELECT config …")` (SQL trunchiază celula `config` la ~2000 caractere → citești date rupte) și NU mai rescrie config-ul ÎNTREG cu `update_menu_display_config` (REPLACE — dacă omiți un câmp, îl PIERZI). În loc:

- **CITEȘTI pe secțiuni** (nu exploda contextul): `get_physical_menu_config(configId, section)` + `get_physical_menu_item(configId, …)`. `list_physical_menu_designs(brandId)` îți dă `configId`-ul.
- **SCRII prin field-setter cu merge server-side** (atinge DOAR ce ceri, restul rămâne): `set_physical_menu_config_fields` / `_category_fields` / `_page_fields` / `_item_fields` — fiecare cu `fields{}` (setezi) + `clear[]` (resetezi la moștenire/global, ca butoanele „Resetează"). NU mai e read-modify-write-întreg.
- **STRUCTURĂ** (poziții/pagini/categorii) prin primitive: `swap_physical_menu_items`, `move_physical_menu_item`, `set_physical_menu_item_photo`, `reorder_physical_menu_categories`, `add_/remove_physical_menu_page_element`.

`update_menu_display_config` (REPLACE) rămâne DOAR ultima soluție, pentru un câmp structural pe care niciun tool nu-l acoperă — și atunci tot citești întâi întreg cu `get_physical_menu_config(section:'raw')`. Catalogul complet al tool-urilor + tabelul intenție→tool: secțiunea „Tool-urile MCP" mai jos.

## Găsește meniul fizic potrivit + navighează (CERCETARE ÎNTÂI)

Clientul zice „du-te la meniul fizic al restaurantului" / „aranjează meniul de print". NU sări la editare — întâi află EXACT pe ce lucrezi. Modelul real e pe 3 niveluri: **un BRAND are mai multe MENIURI, iar un meniu are unul sau mai multe DESIGNURI**.

1. **Nume brand/locație → brandId**: `list_brands` (+ `list_locations` dacă clientul a numit o LOCAȚIE — locația aparține unui brand). Potrivește numele spus de client → `brandId`. Meniurile fizice sunt legate de BRAND.
2. **Meniurile brandului**: `list_menus(brandId)` → toate meniurile + `id` + `name`. Un brand are deseori mai multe (ex. „Restaurantul Exemplu" poate avea „Meniu Exemplu", „Meniu Exemplu print băuturi", „Meniu Exemplu print mâncare"). **Cel „de print"** se recunoaște după nume (conține „print"/„tipar"/„fizic"). Dacă-s mai multe candidate → **listează-le și întreabă clientul pe care** (băuturi? mâncare? general?).
3. **Designurile meniului ales** (un meniu poate avea mai multe): **`list_physical_menu_designs({brandId, menuId})`** (NU SQL) → întoarce pentru fiecare design `configId`, `name`, `menuId`, format, nr. categorii/produse/pagini. Fiecare = un DESIGN (ex. „Design 1", „Design 2"). **`configId` = id-ul pe care îl editezi** cu tool-urile de mai jos. Fără `menuId` îți listează designurile TUTUROR meniurilor brandului. Dacă-s mai multe designuri → **arată-i-le clientului (eventual screenshot) și întreabă în care** lucrezi. Atenție la duplicate (pot exista două designuri cu același nume). (Un design al cărui meniu nu mai există = design orfan, meniul a fost șters → ignoră-l.)
4. **Navighează**: URL direct **`/menu/physical`** (designer full-screen) SAU pagina `/menu` → tab „Meniu Fizic" — ambele deschid ACELAȘI designer. Link live: `gaseste_in_aplicatie("meniu fizic")`. ⚠ **Brandul + meniul + designul se aleg din dropdown-urile din capul paginii, NU din URL** — nu există deep-link cu `?brand=`/`?config=`. Selecția se ține minte în browser (localStorage) per brand+meniu. Deci fluxul real: deschizi `/menu/physical` → din cele 3 dropdown-uri alegi brandul → meniul (cel de print) → designul.

   > **⚠ REGULA CELOR 3 DROPDOWN-URI (verifică ÎNTÂI, înainte de orice modificare sau screenshot):** în toolbar-ul din capul paginii sunt 3 selectoare în ordine: **(1) Unitate/Brand** → **(2) Meniu** → **(3) Design**. Verifică-le în această ordine de fiecare dată. Greșeală comună: ești pe brandul corect dar pe meniul greșit (ex. „Meniu Exemplu" în loc de „Meniu Exemplu Print") sau pe design-ul greșit (ex. „Implicit" în loc de „Design 5") — și modifici sau faci screenshot pe config-ul greșit. Un brand poate avea 2+ meniuri cu nume similare (ex. „Meniu Exemplu" = meniul digital, „Meniu Exemplu Print" = cel de tipărit); un meniu poate avea multe designuri. Nu presupune că e cel corect — citește dropdown-ul.
5. **Design / meniu NOU**: un DESIGN nou la un meniu existent se face DOAR în pagină — butonul **„Designuri"** → „design nou" sau „duplică" unul existent (NU prin MCP: `create_menu_display_config` nu acceptă `physical-menu-*`). Un MENIU fizic nou de tot → creează întâi meniul (din `/menu/pricing` / tool-uri meniu), apoi adaugi un design pe el. Ghidează clientul pas cu pas.

## Cum funcționează (mecanica reală)

Meniul fizic e un **config JSON** (obiectul `PhysicalMenuConfig`, ~120 chei) salvat server-side. NU-l atingi tu „brut": tool-urile MCP citesc/scriu peste el cu **merge sigur** (preservă toate câmpurile, ating doar ce ceri). Configul are 4 niveluri de obiecte: **global** / **pagină** / **categorie** / **produs (item)** — fiecare cu sute de câmpuri scalare; câte un tool de „set fields" per nivel le acoperă pe toate.

Fluxul corect:
1. **Identifică designul** (brand → meniu → design, mai sus) ca să ai `configId`-ul (din `list_physical_menu_designs`).
2. **CITEȘTE pe secțiuni** (NU SQL — SQL trunchiază `config` la ~2000 caractere): `get_physical_menu_config(configId, section)` pentru global/categorii/o pagină, `get_physical_menu_item(configId, …)` pentru produse. Vezi „Tool-urile MCP".
3. **MODIFICĂ prin field-setter** — trimiți DOAR câmpurile de schimbat (`fields{}`) și/sau cele de resetat la moștenire (`clear[]`). Serverul face merge, NU REPLACE → restul configului rămâne intact. Structura (poziții/pagini/categorii) → primitivele `swap`/`move`/`reorder`/`set_…_photo`/`add_/remove_…_element`. Permisiune: modulul **`setari`** (aceeași ca update_menu_display_config).
4. **Uită-te la rezultat** (vision/Chrome) și iterează (vezi „Bucla de vision"); confirmă schimbarea re-citind cu un `get_*` (confirmă-prin-citire, `condu-chrome.md`).

⚠ **Crearea unui design fizic NOU NU se face prin MCP** (nici update_menu_display_config, nici tool-urile noi): se face din aplicație — butonul „Designuri" → design nou / duplică unul existent. Apoi îl editezi cu tool-urile de mai jos. (Sub capotă, `create_menu_display_config` are `profileType` restrâns la profilurile POS — `waiter_mobile`/`bar_pos`/`kiosk` — și nu acceptă `physical-menu-*`.)

⚠ **`update_menu_display_config` (REPLACE) = ULTIMA SOLUȚIE.** Îl folosești DOAR pentru un câmp structural rar pe care niciun tool dedicat nu-l acoperă (ex. `pinnedPages`, `pageAssignments` rescris în bloc) — și atunci citești ÎNTÂI întreg cu `get_physical_menu_config(section:'raw')`, modifici, scrii tot înapoi (omiterea unui câmp = pierdere). Pentru orice altceva folosește field-setterele — sunt mai sigure.

## Tool-urile MCP (calea principală)

⚠ La toate scrierile, **`productId` = `menu_items.id`** (NU products.id) și **`categoryId` = `menu_categories.id`**. Răspunsurile zic „(reîncarcă designerul)" pentru că UI-ul are cache — citește regula de cache mai jos.

**CITIRE (mereu disponibile, fără permisiune de scriere):**
- `list_physical_menu_designs({brandId, menuId?})` — designurile (`configId`, nume, format, nr. categorii/produse/pagini). Punctul de start: îți dă `configId`-ul.
- `get_physical_menu_config({configId, section?, pageIndex?})` — citește pe secțiuni: fără `section` = setări GLOBALE (toate scalarele top-level: culori, fonturi, margini, columns, copertă, QR…); `section:'categories'` = lista categoriilor (id, nume, sortOrder, `visible`, nr. produse); `section:'page'`+`pageIndex` = override-ul unei pagini; `section:'raw'` = configul ÎNTREG (mare — doar la nevoie, refuzat dacă > ~60k caractere).
- `get_physical_menu_item({configId, productId? | categoryId? | query?})` — inspectează produse: poziția în categorie, `sortOrder` și **mărimea pozei interpretată** (mare/mică/ascunsă, după `photoLayout`). `productId`=un produs; `categoryId`=toate dintr-o categorie; `query`=caută după nume; nimic=listă categorii.

**SCRIERE — field-setters (set `fields{}` + reset `clear[]`, merge server-side, modul `setari`):**
- `set_physical_menu_config_fields({configId, fields?, clear?})` — ORICE câmp GLOBAL (culori, fonturi, margini, `columns`, copertă, footer, QR, fundal, ramă…). Structurale blocate (`categories`/`pageAssignments`/`pages`/`pinnedPages`).
- `set_physical_menu_category_fields({configId, categoryId, fields?, clear?})` — ORICE câmp al unei CATEGORII (`name`, `sortOrder`, **`visible`**, `titleHidden`, culori, `accentColor`, `pageBreakBefore`, descriere, offset-uri titlu…).
- `set_physical_menu_page_fields({configId, pageIndex, fields?, clear?})` — override pe o PAGINĂ anume (`pageOverrides[pageIndex]`: `columns`, `photoLayout`, fundal, culori, spacing, `locked`, `hidden`…). Creează override-ul dacă nu există.
- `set_physical_menu_item_fields({configId, <selector>, fields?, clear?})` — ORICE câmp pe UNUL sau MAI MULTE produse. **SELECTOR**: `productId` (unul) | `productIds[]` | `categoryId` (toată categoria) | `scope:'all'` (tot meniul). `fields` setezi (`{photoLayout:'top', titleColor:'#900', badges:[…]}`), `clear` resetezi la global (`['photoSize','titleColor']` = ca butonul „Resetează"). Blocat: `productId`.

**SCRIERE — structurale (primitive dedicate, modul `setari`):**
- `set_physical_menu_item_photo({configId, productId, size})` — mărimea pozei semantic: `big` (mare sus, photoLayout=top) / `medium` / `small` (thumbnail lateral) / `hidden`. Abstractizează combinația `photoLayout`/`photoAspectRatio`/`showPhoto` ȘI curăță resize-urile manuale (px/frac) ca rezultatul să fie predictibil — **preferă-l** în loc să setezi mână câmpurile de poză.
- `swap_physical_menu_items({configId, productIdA, productIdB})` — schimbă locul a două produse (sincronizează `items[]`+`sortOrder` ȘI `pageAssignments`).
- `move_physical_menu_item({configId, productId, position? | toCategoryId? + position?})` — mută un produs în interiorul categoriei (dă `position`, 1-based) SAU în altă categorie (dă `toCategoryId`). Sincronizează `items[]`+`sortOrder`+`pageAssignments`. **Preferă-l** în loc să muți obiectul item manual.
- `reorder_physical_menu_categories({configId, orderedCategoryIds})` — reordonează categoriile (sortOrder + ordinea blocurilor pe fiecare pagină; cele nelistate rămân la coadă). ⚠ Best-effort: NU mută categorii ÎNTRE pagini (asta cere repaginare din designer).
- `add_physical_menu_page_element({configId, pageIndex, element})` — adaugă element FREEFORM pe o pagină (`{type:'text'|'image'|'shape', text?, imageUrl?, x?, y?, width?, height?, …}`). Întoarce `id`-ul.
- `remove_physical_menu_page_element({configId, pageIndex, elementId})` — șterge un element freeform după `id`.

### Intenție → tool (ce zice userul → ce apelezi)
| Userul zice | Tool |
|---|---|
| „arată-mi designurile / pe care lucrez" | `list_physical_menu_designs` |
| „ce e pe pagina/în configul ăsta" (culori, fonturi, copertă) | `get_physical_menu_config` (section după caz) |
| „ce produse-s în categoria X / cum e poza lui Y" | `get_physical_menu_item` |
| „fă poza lui X mai mare / mai mică / scoate poza" | `set_physical_menu_item_photo` (big/medium/small/hidden) |
| „fă titlul lui X roșu / schimbă fontul/badge la X" | `set_physical_menu_item_fields` (selector `productId`) |
| „toate pozele mari / toate titlurile cu altă culoare" | `set_physical_menu_item_fields` (`scope:'all'` sau `categoryId`) + la nevoie `clear` override-urile |
| „schimbă culoarea/accentul/coloanele global, fundal, copertă, QR" | `set_physical_menu_config_fields` |
| „redenumește/ascunde/colorează o CATEGORIE" | `set_physical_menu_category_fields` |
| „pe pagina asta 3 coloane / alt fundal" | `set_physical_menu_page_fields` |
| „schimbă locul între X și Y" | `swap_physical_menu_items` |
| „mută X mai sus / pe poziția 2 / în altă categorie" | `move_physical_menu_item` |
| „pune categoriile în ordinea asta" | `reorder_physical_menu_categories` |
| „pune un text/o poză/o formă decorativă pe pagină" | `add_physical_menu_page_element` / `remove_…` |
| „resetează culoarea/mărimea lui X la default" | orice `set_*_fields` cu `clear:['câmp']` |

### Rețetă: ascunde / arată o categorie ÎNTREAGĂ
„Scoate categoria «Vinuri» din meniul printat" (sau invers, readu-o):
1. `get_physical_menu_config({configId, section:'categories'})` → găsește `categoryId`-ul categoriei (după `name`) și starea `visible`.
2. **Ascunde**: `set_physical_menu_category_fields({configId, categoryId, fields:{visible:false}})`. Produsele ei nu se mai randează; engine-ul repaginază restul.
3. **Arată la loc**: două variante — `set_physical_menu_category_fields({configId, categoryId, fields:{visible:true}})` SAU, ca să revină la moștenirea implicită (vizibil), `set_physical_menu_category_fields({configId, categoryId, clear:['visible']})`.
4. Confirmă: re-citește cu `get_physical_menu_config(section:'categories')` (vezi `visible` schimbat) și arată userului un screenshot (Chrome). Reîncarcă designerul ca să se vadă.
> Nuanță: dacă vrei să ascunzi doar TITLUL categoriei (dar să lași produsele) → `fields:{titleHidden:true}`. Dacă vrei să ascunzi produse individuale, nu toată categoria → `set_physical_menu_item_fields({categoryId, fields:{visible:false}})` (sau `set_physical_menu_item_photo(size:'hidden')` doar pentru poze).

## Bucla de vision (cum vezi cum arată)

Tu (Claude extern) vezi paginile prin **extensia Chrome**: deschizi `/menu/physical` (deep-link `navigate` — link din `gaseste_in_aplicatie("meniu fizic")`), faci screenshot la fiecare pagină din preview și **te uiți tu** (vederea ta multimodală) ca un grafician. Bucla: screenshot → judeci (coloane goale? pagină goală? poză prea mică/mare? dezechilibru? ordine proastă?) → editezi prin tool-urile MCP → dă refresh paginii → screenshot din nou → repetă până arată bine. **Screenshot-ul e și livrabilul pentru user** (îi arăți „uite cum arată acum"). Doctrina de conducere Chrome (deep-link, refresh resetează starea, click doar la nevoie) = `condu-chrome.md`. (Există și un „Director Artistic" in-app cu vision — dar vederea ta proprie e mai bună pentru nuanțe.)

## Harta câmpurilor — ce schimbi și unde (grupat pe intenția de grafician)

### Structură & format
- `formatType`: `a4-individual` | `a3-booklet` (broșură pliată — engine-ul forțează AUTO multiplu de 4 pagini) | `a3-single` | `a3-landscape` (placemat 4-col). `orientation`, `columns` (global), `contentStartPage`.
- `coverPage`/`locationPage`/`bonFiscalPage` (true/false — pagini speciale), `showNutritionalEndPages`/`showAllergensEndPages`, `endPagesReversed`.

### Poze (mărime, poziție, formă)
- **Mărime poză** (cea mai folosită): per produs `photoColFrac` (0.05–1, fracțiune din lățimea coloanei — 0.4 mic, 0.7+ erou) SAU `photoWidthCustomPx`/`photoHeightCustomPx` (px expliciți), SAU presetul `photoSize` (small/medium/large). ⚠ **dacă setezi `photoWidthCustomPx`, șterge `photoColFrac`/`photoAspectNum`/`photoRole`** (altfel revin și strică aspectul). Global: `photoSizeGlobal`, `photoSizeCustomPx`.
- **Formă/aspect**: `photoAspectRatio` (square/landscape/portrait) sau `photoAspectNum` (raport w/h), `photoMaskShape` (rectangle/rounded/circle), `photoBorderRadiusPx`, `photoShadow` (none/soft/medium/strong), `photoOpacity`, `photoRotation`.
- **Poziție/crop în ramă**: `photoZoom`, `photoOffsetTop/Left` (pan în mască), `photoFrameOffsetX/Y` (mută rama în card). `photoLayout` (left/right/top/alternate) global sau per-item.
- **Schimbă poza**: `customImageUrl` per produs (URL din galerie/upload). Pe produs în catalog: `set_product_image` (vezi pricing).

### Crop precis pe poză (zoom + pan) și poze stricate
- **Crop „arată exact zona asta din poză"**: poza se afișează în mod *cover* (umple rama, taie restul). Alegi ce parte se vede din 2 pârghii: `photoZoom` (1–4; 1 = cover normal, 4 = zoom maxim) + `photoOffsetTop`/`photoOffsetLeft` (px de pan ÎN interiorul ramei — mută zona vizibilă sus/jos, stânga/dreapta). Ex: o față dintr-o poză largă → `photoZoom: 1.8` + ajustezi `photoOffsetTop/Left` până cade fața în centru. ⚠ Când fixezi dimensiunea ramei manual cu `photoWidthCustomPx`/`photoHeightCustomPx`, ȘTERGE `photoColFrac`/`photoAspectNum`/`photoRole` (altfel revin și strică raportul).
- **`photoOffset*` vs `photoFrameOffset*` — NU le confunda**: `photoOffsetTop/Left` = pan ÎN interiorul ramei (schimbi CE se vede din poză, crop). `photoFrameOffsetX/Y` = mută vizual TOATĂ rama în card (translație, conținutul rămâne la fel). Pentru „vreau altă bucată din poză" → `photoOffset*`. Pentru „mută poza puțin mai sus în card" → `photoFrameOffset*`.
- **`photoRotation`** (-180…+180 grade): rotește poza (poze înclinate artistic). Cascadă normală item → pagină → global.
- **`photoAspectNum` INTRĂ în calcul** (nu e informativ): împreună cu `photoColFrac` determină înălțimea ramei (lățime = fracțiune din coloană, înălțime = lățime ÷ raport). `1` = pătrat, `1.6` ≈ landscape erou, `0.7` ≈ portret. Presetele `photoAspectRatio` (square/landscape/portrait) sunt versiunea „pe butoane"; `photoAspectNum` dă raport numeric exact (ex. `1.33` pentru 4:3 cinematic).
- **`photoColFrac` e sensibil la coloane**: e fracțiune din lățimea coloanei EFECTIVE — dacă schimbi numărul de coloane (global sau pe pagină), poza se rescalează. Pentru dimensiune stabilă indiferent de coloane, folosește `photoWidthCustomPx`.
- **Poze stricate (URL 404)**: dacă URL-ul pozei nu mai e valid, în preview/export apare un placeholder (iconiță 🍽️) în loc de imagine goală. Recovery: pune alt `customImageUrl` valid, sau golește-l (revine la poza din catalog).

### Text (fonturi, mărimi, culori)
- **Font (atenție la 2 convenții diferite!)**: cele globale de tip *picker* — `config.fontFamily` (corp/descriere) și `config.titleFont` (titluri) — primesc ID-ul fontului (ex. `"playfair"`, `"nunito"`) din lista de fonturi a designerului. Override-urile per sub-element — `titleFontFamily`/`descriptionFontFamily`/`priceFontFamily`/`gramajFontFamily` (pe item, pe `pageOverrides[i]` și global) și `categoryTitleFontFamily` — primesc un STRING CSS complet (ex. `"'Playfair Display','Georgia',serif"`), NU ID-ul. Pe element freeform: `fontFamily` = tot string CSS. ⚠ `categoryTitleFontFamily` există DOAR la nivel de categorie (`config.categories[].categoryTitleFontFamily`) și global, NU pe `pageOverrides[i]` — nu poți schimba fontul titlului de categorie doar pe o pagină.
- **Mărime**: presete `titleSizeGlobal`/`descriptionSizeGlobal`/`gramajSizeGlobal`/`priceSizeGlobal`/`categoryTitleSizeGlobal` (small/medium/large) + `*SizeCustomPx`; per produs la fel (`titleSize`+`titleSizeCustomPx` etc.).
- **Culoare/stil**: `titleColor`/`descriptionColor`/`priceColor`/`gramajColor`/`categoryTitleColor`/`accentColor`/`textColor`/`backgroundColor`; `*LineHeight`, `*LetterSpacing`, `*Opacity`; `priceStyle`, `descriptionAlign`, `categoryTitleUnderline`.
- **Cascada de culori (paleta conduce titlurile)**: paleta = 3 culori — `backgroundColor` (Fundal), `textColor` (Text), `accentColor` (Accent). **Titlul de produs urmează `textColor`, titlul de categorie urmează `accentColor`** — DAR doar dacă NU sunt setate explicit `titleColor`/`categoryTitleColor`. Dacă o temă (look) sau un șablon a pus culori explicite pe titluri, acelea „bat" paleta și schimbarea paletei nu le mai mișcă. Ca titlurile să urmeze din nou paleta, **omite (golește) din config** `titleColor`, `categoryTitleColor`, `priceColor`, `descriptionColor`, `gramajColor` → re-derivă din Text/Accent. (În app: apăsarea unui „Template Design" sau editarea swatch-ului Text/Accent face automat această golire; reglaj individual rămâne în tab-ul „Stil".)

### Layout & umplere (coloane, span, spațiere)
- **`spanColumns`** per produs (1..N coloane) → produsul ocupă K coloane (masonry) — **arma principală contra coloanelor goale** (lățește un produs ca să umple golul). Pozele+fonturile se scalează automat.
- **Spațiere**: `itemSpacing` (compact/normal/relaxed/custom) + `itemSpacingCustomPx`, `categorySpacingPx`, `descriptionGapPx`, `photoTextGapPx`, `nameToPriceGapPx`.
- **Per pagină** (`pageOverrides[absIdx]`, 0-based): `columns`, `rearrangeMode` (auto/liber), `backgroundType`/`backgroundImageUrl`, `freeformElements[]`.

### Mutare & ordine produse/pagini
> Pentru ordine + mutare folosește **`move_physical_menu_item`** / **`swap_physical_menu_items`** — sincronizează singure mecanica de mai jos (sortOrder + pageAssignments). Secțiunea explică ce fac sub capotă (util doar dacă ajungi la calea-de-rezervă REPLACE).
- **Ordine produse** (cel mai sigur): per produs `sortOrder` (și/sau `update_menu_item(sortOrder)` la nivel de date). `move_physical_menu_item({position})` îl setează corect și repaginază.
- **Mută produse între pagini**: `pageAssignments` = array de chunk-uri (1 chunk = 1 pagină). ⚠ **Poate fi `null`** — atunci engine-ul distribuie produsele AUTOMAT (estimator). Dacă-l scrii manual (cale REPLACE), **FIXEZI** distribuția și TREBUIE să conțină consistent toate produsele vizibile (altfel dispar produse). `move_physical_menu_item`/`swap_physical_menu_items` actualizează `pageAssignments` coerent singure — preferă-le. ⚠ NU folosi câmpul legacy `pages` (vestigial, nu se randează).
- **Pagini fixe inserate**: `pinnedPages` = obiect (map) cu CHEI = poziția 1-based ABSOLUTĂ a paginii (nu array), valoarea = `{ template, title?, content? }`. Ex. `{ "3": { template: "informations", title: "..." } }` inserează o pagină fixă pe poziția 3. Distinct de `pageOverrides`: pinned = pagină STRUCTURALĂ care nu se repaginează; pageOverride = ajustare pe o pagină de conținut care se renumerotează la reflow.

### Fundal & rame
- `backgroundType` (solid/gradient/image/split) + `backgroundColor`/`backgroundGradientColor2`/`backgroundImageUrl`/`backgroundImageOpacity`/`backgroundSplitColor2`. Per-pagină via `pageOverrides[idx].backgroundType/backgroundImageUrl`.
- `pageBorderEnabled`/`pageBorderColor`/`pageBorderWidth`/`pageBorderStyle`/`pageBorderImageUrl` (rama colorată groasă în jurul paginii); `coverBorder*`.

### Detalii fundal, ramă, copertă (câmpuri care lipseau)
- **Split fundal**: `backgroundType:"split"` + `backgroundColor` + `backgroundSplitColor2` + `backgroundSplitDirection` (`horizontal`|`vertical`) — două culori, contrast dramatic pe copertă/pagina finală. **DOAR GLOBAL** — split-ul NU poate fi aplicat per-pagină.
- **Ramă — culoare VS imagine**: `pageBorderType` (`color`|`image`). La `color`: `pageBorderColor` + `pageBorderStyle` (`solid`|`dashed`|`dotted`|`double`) + `pageBorderWidth`. La `image`: `pageBorderImageUrl` + `pageBorderImageZoom`. Colțuri rotunjite: `pageBorderRadius` (px). Coperta are aceleași câmpuri cu prefix `cover` (`coverBorderType`/`coverBorderStyle`/`coverBorderColor`/`coverBorderWidth`/`coverBorderImageUrl`/`coverBorderImageZoom`/`coverBorderRadius`). `double` = look fine-dining clasic, `dashed`/`dotted` = casual/playful.
- **Copertă full-bleed**: `coverImageFullBleed:true` + `coverImageFit` (`cover` = umple, taie / `contain` = încadrează cu margine) + `coverImageZoom`/`coverImageOffsetX/Y` (ajustare fină). Plus `coverTitleFontScale`/`coverSubtitleFontScale` (scalare text), `coverTitleOffsetX/Y`/`coverSubtitleOffsetX/Y`, `coverLogoZoom`/`coverLogoOffsetX/Y`, `showCoverDivider` (linie separator pe copertă).
- **Per-pagină**: pe `pageOverrides[idx]` poți pune fundal diferit — `backgroundType` (`solid`/`gradient`/`image` DOAR — split nu e disponibil pe pagini), `backgroundGradientColor2`, `backgroundGradientDirection`, `backgroundImageUrl`, `backgroundImageOpacity` — ex. copertă cu split (global), paginile interne cu gradient subtil, finala cu solid.

### Elemente libere (adaugă poze/text/forme/evidențieri)
- `freeformElements[]` global SAU `pageOverrides[idx].freeformElements[]`: fiecare = `{ type: text|image|separator|shape, x, y, width, height, fontFamily?, content?, imageUrl?, z, rotation, scaleX/Y }`. ⚠ Coordonatele sunt în **px LOGICE = mm × 2,8**. Cu astea inserezi poze decorative, casete de text, separatoare, forme, evidențieri pe orice pagină.
- **Evidențiere produs** (featured): per produs `featuredStyle` + `featuredAccentColor`/`featuredBorderWidthPx`/`featuredGlowIntensity`/`featuredCornerRadius`/`featuredBadgeText`/`featuredBgOpacity` — scoate în evidență un produs (chenar/glow/badge).

#### Câmpurile complete ale unui element liber
Elementele libere stau DOAR în `pageOverrides[absIdx].freeformElements[]` (NU există `config.freeformElements` la nivel global). Fiecare element:
- **Bază**: `id` (unic), `type` (`text`|`image`|`separator`|`shape`), `x`, `y`, `width`, `height` (toate în px logice = mm × 2.8; `(0,0)` = colțul stânga-sus al paginii), `zIndex` (stivuire — mai mare = deasupra; default 10), `rotation` (-180…+180 grade), `scaleX`/`scaleY` (`1` = normal, `-1` = oglindit pe acea axă), `opacity` (0–1), `locked` (true = nu poate fi mutat/redimensionat din designer, dar tot selectabil), `name` (eticheta din panoul de layere, ex. „Logo decorativ"), `hidden` (true = ascuns în preview ȘI export, dar rămâne în config — toggle, nu ștergere).
- **Text** (`type:"text"`): `content` (textul), `color`, `fontSize`, `fontWeight` (`normal`/`bold`/`600`/`700`/`800`), `fontFamily` (string CSS), `fontStyle` (`normal`/`italic`), `textDecoration` (`none`/`underline`), `textAlign` (`left`/`center`/`right`).
- **Imagine** (`type:"image"`): `imageUrl`.
- **Formă** (`type:"shape"`): `shapeType` (`rectangle`/`circle`/`line`), `color` (fundal pentru rect/cerc, culoarea liniei pentru line). `type:"separator"` = linie dedicată (grosimea = `height`).
- **⚠ Decor de temă**: când o temă pune ornamente automate, ele au `name`/`id` cu prefix `theme:` și se șterg/regenerează automat la re-aplicarea temei. NU pune prefix `theme:` pe elementele TALE — e rezervat decorului generat de temă. Elementele tale (fără prefix) supraviețuiesc schimbării temei.

**Tehnici de grafician**: watermark („PROOF"/„CONFIDENTIAL") = text cu `opacity:0.3` + `fontStyle:italic` într-un colț; badge peste un produs = `shape` rectangle semi-transparent + un text element deasupra (zIndex mai mare); titlu diagonal = text cu `rotation:-30` + `locked:true`; cadru simetric = 2 imagini, una cu `scaleX:-1`; header fix pe toate paginile = pune același logo (același x/y) în `freeformElements` pe fiecare pagină.

### Cover & QR
- `coverTitle`/`coverSubtitle`/`coverImageUrl`/`coverImageFullBleed`/`coverImageFit`/`coverImageZoom`/`coverImageOffsetX/Y`/`coverLogoZoom`/`coverTitleFontScale`...
- `showQrCode` (activează QR), `qrCodeUrl` (destinația — EDITABILĂ fără reprintare), `qrCodeDynamicId`/`qrCodeDynamicCode` (legătura cu codul dinamic de pe `/q/<code>`, printat FIX), `qrCodeSizeMm`, `qrCodePosition` (`bottom-center`|`bottom-right`|`bottom-left`|`top-center`|`top-right`|`top-left`|`center`), `qrCodeOffsetX`/`qrCodeOffsetY` (ajustare fină poziție, px logice), `qrCodeFgColor`/`qrCodeBgColor`, `qrCodeCaption` + `qrCodeShowCaption` (toggle afișare text sub QR).

## Poziție, ordine & coloane (reordonare în categorie · mutare între categorii · pe ce coloană ajunge)

> Două straturi diferite, NU le confunda: **CATALOG** (meniul digital — `update_menu_item`, persistă în tot ecosistemul) vs **CONFIG-vizual al designului fizic** (citit cu `get_physical_menu_*`, scris cu tool-urile dedicate de meniu fizic). **Meniul fizic se randează din CONFIG**, nu din catalog: ce vezi pe pagină vine din categoriile + produsele designului. Catalogul îl finalizezi ÎNAINTE de design (vezi `meniu-fizic-pricing.md`); după ce ești în design, lucrezi în CONFIG prin tool-uri.

### 1) Reordonează un produs ÎN cadrul categoriei (cel mai sigur)
**Folosește `move_physical_menu_item({configId, productId, position})`** (position 1-based) — sincronizează singur ordinea ȘI `pageAssignments`. Pentru „schimbă locul a două produse" → `swap_physical_menu_items({configId, productIdA, productIdB})`.
- **De ce tool, nu mână**: ordinea e dată de `sortOrder` pe fiecare produs, DAR când există distribuție fixată pe pagini (`pageAssignments`), aceea e autoritatea — trebuie actualizate AMBELE coerent. Tool-urile fac asta corect; o editare manuală a doar `sortOrder` poate fi ignorată de randare.
- **Recalc?** NU e nevoie — engine-ul aplică noua ordine la randare; reordonarea pe aceeași pagină nu mută produse pe alte pagini.
- **CATALOG vs CONFIG**: dacă vrei ordinea și în meniul DIGITAL (POS/site), setează și `update_menu_item({brandId, menuItemId, sortOrder})`. Pentru DESIGNUL fizic în sine, tool-urile de mai sus conduc randarea.

### 2) Mută un produs ÎN altă categorie
**Folosește `move_physical_menu_item({configId, productId, toCategoryId, position?})`** — mută produsul în categoria țintă (la `position`, sau la sfârșit) și sincronizează singur `sortOrder` în ambele categorii ȘI `pageAssignments` (scoate din blocul vechi, inserează în cel nou). Nu mai muta obiectul item manual — tool-ul evită capcana „produsul dispare de pe pagini".
- **În CATALOG (meniul digital, opțional pentru coerență)**: `update_menu_item({brandId, menuItemId, menuCategoryId: <id-ul categoriei noi>})` — schimbă categoria produsului în meniul digital (se oglindește pe produs). `menuCategoryId` din `list_menu_categories(brandId)`.
- **Categorie NOUĂ ca destinație**: dacă nu există în config, creează-o întâi cu `create_menu_category({name, brandId, parentId?, sortOrder?, color?})`. ⚠ **Redenumirea/reordonarea categoriilor**: redenumire = `set_physical_menu_category_fields({fields:{name:…}})` (în design) sau `/menu/pricing` (în catalog); reordonare = `reorder_physical_menu_categories({orderedCategoryIds})`.
- **Recalc?** Tool-ul de move actualizează deja `pageAssignments`; dacă vrei o repaginare globală, folosește „Recalculează și optimizează" din pagină.

### 3) Pe ce coloană ajunge un produs
⚠ **Nu există fixare absolută pe coloană** — nu poți spune „produsul X mereu pe coloana 2". Nu există câmp de tip „columnIndex"/„forceColumn". Coloana e DINAMICĂ: rezultă din ordinea de citire + modul de distribuție + lățimea produsului. Pârghiile REALE:
- **Ordinea (`sortOrder`)**: cine vine primul în ordine ocupă prima poziție liberă. La distribuția pe „număr egal de produse", primele N produse cad pe prima coloană, următoarele N pe a doua etc. → mărind/micșorând `sortOrder` muți produsul mai la dreapta/stânga.
- **Modul de distribuție** `columnDistribution`: `"balanced"` (implicit — engine-ul echilibrează ÎNĂLȚIMILE coloanelor, deci un produs cu poză mare poate „sări" pe coloana următoare chiar cu `sortOrder` mic) vs `"count"` (împarte produsele în număr egal pe coloană, ignorând înălțimea — mai predictibil pentru „prima jumătate stânga, a doua dreapta"). Se setează **global** (`config.columnDistribution`) și/sau **per pagină** (`config.pageOverrides[absIdx].columnDistribution`, override pe global).
- **Lățimea produsului** `spanColumns` (per item, 1..N): produsul se întinde pe K coloane adiacente (masonry), restul curg în jur. Pe o pagină cu 2 coloane, `spanColumns:2` îl face pe toată lățimea. Valoarea se taie automat („clamp") la numărul de coloane al paginii (span 3 pe pagină cu 2 col → tratat ca 2, fără eroare). Ignorat pe pagini cu o singură coloană.
- **Numărul de coloane** `columns`: global (`config.columns`) sau per pagină (`config.pageOverrides[absIdx].columns`, override). Mai multe coloane = coloane mai înguste, produse mai mici.
- **Despărțitor vizual între coloane** `columnDivider`: `"none"|"thin"|"thick"|"dashed"` (global sau per pagină) — estetic, nu schimbă distribuția.
- **Rețetă „mut produsul pe coloana din dreapta"**: (a) treci pagina pe `columnDistribution:"count"` (predictibil) → (b) ajustează `sortOrder` ca produsul să cadă în a doua jumătate a listei (pe pagină cu 2 col, în jumătatea care merge pe coloana 2) → rescrie config → verifică prin vision → corectează `sortOrder` dacă a aterizat greșit. Dacă vrei doar să umpli un gol pe coloană, e mai simplu `spanColumns` pe un produs vecin.
- **Offset pur vizual** `dragX`/`dragY` (px) pe item = deplasare cu transform, SUPRAPUNE peste vecini și NU rezervă spațiu în layout — NU controlează pe ce coloană e logic produsul; folosește-l doar pentru micro-ajustări, nu pentru a muta între coloane.

### Recapitulare „ce câmp / ce strat"
| Vreau să… | Strat | Tool / câmp |
|---|---|---|
| reordonez produs în categorie (design fizic) | CONFIG | `move_physical_menu_item({position})` / `swap_physical_menu_items` |
| reordonez produs în categorie (și în meniul digital) | CATALOG | `update_menu_item({sortOrder})` |
| mut produs în altă categorie (design fizic) | CONFIG | `move_physical_menu_item({toCategoryId, position?})` |
| mut produs în altă categorie (meniul digital) | CATALOG | `update_menu_item({menuCategoryId})` |
| influențez pe ce coloană cade | CONFIG | `set_physical_menu_item_fields({fields:{spanColumns}})` + `set_physical_menu_page_fields({fields:{columnDistribution,columns}})` |
| umplu un gol pe coloană | CONFIG | `set_physical_menu_item_fields({productId, fields:{spanColumns:2}})` pe un produs vecin |
| despart vizual coloanele | CONFIG | `set_physical_menu_config_fields`/`_page_fields({fields:{columnDivider}})` |

## Editează ORICE pe un produs — catalog vs design + cele 3 niveluri (cascadă)

> Două întrebări de pus de fiecare dată: **(1) E date sau e aspect?** Date (nume/preț/descriere/gramaj/categorie/alergeni/poză produs) = **CATALOG** prin `update_menu_item`/`update_product`/`set_product_*`. Aspect (culori/mărimi/poză-în-design/span/offset/featured) = **CONFIG** prin field-setterele de meniu fizic (`set_physical_menu_item_fields` pe produs, `_page_fields` pe pagină, `_config_fields` global). **(2) La ce nivel?** Global (tot meniul), per pagină, sau per produs — alegi tool-ul după nivel.

### Catalog (date live) vs Config-vizual (aspect)
| Domeniu | CATALOG (meniul digital — se vede peste tot) | CONFIG-vizual (doar designul fizic) |
|---|---|---|
| Nume afișat | `update_menu_item({name})` | suprascriere doar-în-design: `item.customName` |
| Descriere | `update_menu_item({description})` / pe fișă `update_product({description})` | `item.customDescription` |
| Preț | `update_menu_item({price})` / masă `apply_menu_prices`/`bulk_update_menu_item_prices` | `item.customPrice` (doar afișaj fizic) |
| Gramaj | `update_menu_item({gramaj})` / `update_product({weight})` | `item.customGramaj` |
| Categorie | `update_menu_item({menuCategoryId})` | structural în `categories[].items[]` |
| Alergeni (date) | `set_product_allergens({productId, allergenIds})` (+`create_allergen`) | iconițe/etichete în design: `item.allergenIcons[]`, `item.showAllergenLabels` |
| Poză (sursă) | `set_product_image({productId, imageUrl, gallery?})` | poză aleasă pt acest design: `item.customImageUrl` (+`item.imageOverride=true` ca să nu fie suprascrisă la reload) |
| Mărime/formă/poziție poză | — | `item.photoColFrac`/`photoWidthCustomPx`/`photoSize`, `photoAspectRatio`/`photoMaskShape`/`photoZoom`/`photoOffset*` |
| Culori/fonturi/mărimi text | — | `item.titleColor`/`priceColor`/`...FontFamily`/`...SizeCustomPx` |

Regula: `update_menu_item`/`update_product` ating TOATE meniurile/canalele (POS, site, KDS). Câmpurile `custom*` din config ating DOAR acest design fizic (snapshot local). Pentru un nume/preț valabil peste tot → catalog. Pentru „doar pe afișul ăsta scrie altfel" → `custom*` în config. ⚠ `productId` din config = `menu_items.id` (NU products.id; vânzările/galeria folosesc products.id — la nevoie de catalog pornind din config, se face conversia internă).

### Cele 3 niveluri & cum „bate" unul pe altul (cascadă)
Un câmp se poate seta la 3 niveluri; cel mai SPECIFIC câștigă:

**PRODUS (item)** ⟶ **PAGINĂ (`pageOverrides[absIdx]`)** ⟶ **GLOBAL (`config`)** ⟶ fallback implicit

- **Culoare** (titlu/preț/gramaj/descriere/titlu-categorie): `item.titleColor` ?? `pageOverrides[i].titleColor` ?? `config.titleColor` ?? culoarea de text a paletei (`textColor`). Ca un titlu să REVINĂ la paletă, **golește** `titleColor` la nivelele de sus.
- **Mărime text**: `item.titleSizeCustomPx` ?? `pageOverrides[i].titleSizeCustomPx` ?? `config.titleSizeCustomPx` ?? presetul (`titleSize`/`titleSizeGlobal` small/medium/large). ⚠ Presetul `titleSize` pe item e implicit „medium" — un „medium" pus la creare NU bate page override (ca butoanele Mic/Mediu/Mare pe pagină să funcționeze); doar „small"/„large" explicit pe item bat pagina.
- **Poză (mărime/layout)**: `item.photoColFrac`/`photoWidthCustomPx`/`photoSize`/`photoLayout` ?? `pageOverrides[i].*` ?? `config.*`/`photoSizeGlobal`.
- **Coloane / distribuție / spațiere**: `pageOverrides[i].columns`/`columnDistribution`/`itemSpacing` ?? `config.columns`/`columnDistribution`/`itemSpacing`. (Acestea NU se setează per item — coloana e dată de pagină/global; pe item ai doar `spanColumns`.)
- **Vizibilitate sub-elemente** (poză/descriere/gramaj/alergeni): `item.showPhoto`/`showDescription`/`showGramaj`/`showAllergens` ?? `pageOverrides[i].showPhotos`/… ?? `config.showPhotosGlobal`/`showDescriptionsGlobal`/…
- **Container card** (fundal/chenar/colț/umbră): `item.containerBackgroundColor`/`containerBorderColor`/`containerBorderWidthPx`/`containerBorderRadiusPx`/`containerShadow` ?? `pageOverrides[i].container*` ?? `config.container*` ?? transparent.
- **Poziția gramajului**: `item.gramajPosition` ?? `pageOverrides[i].gramajPosition` ?? `config.gramajPosition` ?? `"inline"`.

**Implicații practice (ce tool alegi după nivel):**
- „Toate titlurile cu altă culoare" → `set_physical_menu_config_fields({fields:{titleColor:…}})` GLOBAL **+** `set_physical_menu_item_fields({scope:'all', clear:['titleColor']})` ca să golești override-urile per-item care altfel rămân pe vechi.
- „Doar titlul lui X roșu" / „doar poza lui X mai mare" → `set_physical_menu_item_fields({productId:X, fields:{titleColor:…}})` / poză prin `set_physical_menu_item_photo`.
- „Pe pagina asta totul cu alt font/3 coloane" → `set_physical_menu_page_fields({pageIndex, fields:{titleFontFamily:…, columns:3}})`.

### Câmpuri editabile PER PRODUS (item) — pe grupe
Toate sunt câmpuri per-produs, opționale (lipsă = moștenește pagina/global). Le scrii cu **`set_physical_menu_item_fields`** (`fields{}` pune, `clear[]` resetează la moștenire) — selector `productId`/`productIds[]`/`categoryId`/`scope:'all'`; poza rapid cu `set_physical_menu_item_photo`. (Numele de mai jos sunt cheile pe care le pui în `fields`.)
- **Identitate/date afișate (override local)**: `customName`, `customDescription`, `customPrice`, `customGramaj`, `customImageUrl` (+`imageOverride`).
- **Ordine & lățime**: `sortOrder` (poziție în categorie), `spanColumns` (1..N coloane).
- **Text — mărime**: `titleSize`/`titleSizeCustomPx`, `descriptionSize`/`descriptionSizeCustomPx`, `gramajSize`/`gramajSizeCustomPx`, `priceSize`/`priceSizeCustomPx`, `titleLineHeight`/`descriptionLineHeight`.
- **Text — culoare/font**: `titleColor`/`descriptionColor`/`priceColor`/`gramajColor`, `*FontFamily`, `*LetterSpacing`, `*Opacity`.
- **Poză**: `photoColFrac` SAU `photoWidthCustomPx`/`photoHeightCustomPx` SAU `photoSize`; `photoLayout`, `photoAspectRatio`/`photoAspectNum`, `photoMaskShape`, `photoBorderRadiusPx`, `photoShadow`, `photoOpacity`, `photoRotation`, `photoZoom`, `photoOffsetTop`/`photoOffsetLeft`, `photoFrameOffsetX`/`photoFrameOffsetY`. ⚠ La `photoWidthCustomPx`, ȘTERGE `photoColFrac`/`photoAspectNum`/`photoRole`.
- **Offset-uri layout** (px logice = mm×2.8): `offsetTop`/`offsetBottom`/`offsetLeft`/`offsetRight`, `titleOffsetTop`/`titleOffsetLeft`, `priceOffsetTop`/`priceOffsetLeft`, `gramajOffsetTop`/`gramajOffsetLeft`, `descriptionOffset*`; gap-uri `photoTextGapPx`/`nameToPriceGapPx`/`priceGramajGapPx`. Offset pur vizual: `dragX`/`dragY` (suprapune, nu rezervă spațiu).
- **Vizibilitate**: `visible`, `showPhoto`, `showDescription`, `showGramaj`, `showAllergens`, `showAllergenLabels`, `showInNutritionalEndPage`, `showInAllergensEndPage`.
- **Container card**: `containerBackgroundColor`, `containerPaddingPx`, `containerBorderColor`, `containerBorderWidthPx`, `containerBorderRadiusPx`, `containerShadow`.
- **Evidențiere (featured)**: `featuredStyle` (none/box/ribbon/card/underline/gold-gradient/neon-glow/embossed/badge-corner/double-border/line-accent) + `featuredAccentColor`/`featuredBorderWidthPx`/`featuredGlowIntensity`/`featuredCornerRadius`/`featuredBadgeText`/`featuredBgOpacity`/`featuredPaddingPx`.
- **Marcaje**: `badges[]` (etichete cu stil), `spicyLevel` (0–3), `allergenIcons[]`, `customSpicyIcon`, `courseNumber`, `originalPrice` (preț tăiat), `gramajPosition`.
- **Stare**: `locked`, `editMode` (product/subelement/lock), `groupId` (grupare).

### Gotchas cascadă (durabile)
- Cel mai specific câștigă; un override la nivel item/pagină BLOCHEAZĂ schimbarea de la global. Ca să „revină la global/paletă", **golește** câmpul de la nivelul de sus, nu-l rescrie cu altă valoare.
- `titleSize` pe item e mereu prezent (default „medium"); „medium" auto NU bate page override, dar „small"/„large" explicit DA.
- `imageOverride=true` protejează `customImageUrl` ales deliberat de auto-refresh la reload — setează-l când pui o poză anume pentru acest design.
- Sub-niveluri: produsul moștenește și de la CATEGORIE (lock, offset-uri de categorie) — o categorie `locked` blochează toate produsele ei.

## Cheatsheet: ce-ți cere userul → ce faci (anticipare)

> Toate editările de design merg prin **tool-urile MCP de meniu fizic** (citire cu `get_physical_menu_*`, scriere cu field-setterele + primitivele structurale) — NU prin SQL + REPLACE. `fields{}` pune, `clear[]` resetează. Verifică prin re-citire (`get_*`) + vision (screenshot), nu prin presupunere.

| Userul zice | Strat / nivel | Ce apelezi |
|---|---|---|
| „pune Ciorba prima / a doua în Supe" | CONFIG · item | `move_physical_menu_item({configId, productId, position:1})` (1-based). Sau `swap_physical_menu_items` pentru două. Fără recalc. |
| „mută Tiramisu la categoria Deserturi" | CONFIG (+CATALOG) | `move_physical_menu_item({configId, productId, toCategoryId:<Deserturi>, position?})` — sincronizează singur `pageAssignments`. Coerență digitală opțional: `update_menu_item({menuCategoryId})`. Dacă „Deserturi" nu există în config: `create_menu_category` întâi. |
| „pune X pe coloana din dreapta" | CONFIG · pagină+item | Nu există pin pe coloană. `set_physical_menu_page_fields({pageIndex, fields:{columnDistribution:'count'}})` apoi `move_physical_menu_item` ca X să cadă în a doua jumătate; vision → corectează. (Alt: umpli golul cu `set_physical_menu_item_fields({productId:<vecin>, fields:{spanColumns:2}})`.) |
| „fă titlul lui X roșu" | CONFIG · item | `set_physical_menu_item_fields({configId, productId:X, fields:{titleColor:'#…'}})`. |
| „fă poza lui X mai mare / mai mică" | CONFIG · item | `set_physical_menu_item_photo({configId, productId:X, size:'big'|'medium'|'small'})` (curăță singur override-urile px). |
| „toate titlurile cu altă culoare" | CONFIG · global | `set_physical_menu_config_fields({fields:{titleColor:'#…'}})` **+** `set_physical_menu_item_fields({scope:'all', clear:['titleColor']})` ca să golești override-urile (altfel rămân pe vechi). |
| „pe pagina asta 3 coloane" | CONFIG · pagină | `set_physical_menu_page_fields({configId, pageIndex, fields:{columns:3}})` (pageIndex = indexul paginii absolute). La nevoie și `columnDistribution`. |
| „schimbă prețul lui X" (peste tot) | CATALOG | `update_menu_item({brandId, menuItemId, price})`. Multe deodată: `bulk_update_menu_item_prices({brandId, items:[{name,price}]})` (potrivire pe NUME exact) sau `apply_menu_prices`. |
| „doar pe afiș scrie alt preț/nume la X" | CONFIG · item | `set_physical_menu_item_fields({productId:X, fields:{customPrice:…}/{customName:…}})` (doar designul fizic, nu atinge POS/site). |
| „schimbă numele afișat al lui X" (peste tot) | CATALOG | `update_menu_item({brandId, menuItemId, name})`. |
| „adaugă alergeni la X" | CATALOG | `set_product_allergens({productId, allergenIds})` (înlocuiește tot setul — citește întâi; `create_allergen` pentru cei lipsă). Iconițe doar în design: `set_physical_menu_item_fields({fields:{allergenIcons:[…]}})`. |
| „schimbă poza lui X" | CATALOG (+CONFIG) | `set_product_image({productId, imageUrl})` (peste tot). Doar pentru acest design: `set_physical_menu_item_photo` pentru mărime; sursa cu `set_physical_menu_item_fields({fields:{customImageUrl:…, imageOverride:true}})`. |
| „evidențiază X / scoate-l în față" | CONFIG · item | `set_physical_menu_item_fields({productId:X, fields:{featuredStyle:'box'|'gold-gradient', featuredAccentColor:…, featuredBadgeText:…}})`. |
| „pagina asta e goală / are coloană goală" | CONFIG | `set_physical_menu_item_fields({productId:<vecin>, fields:{spanColumns:2}})`; sau poză mai mare; sau `itemSpacing:'relaxed'` pe pagină/global. Vezi „Pagini/coloane goale". |
| „ascunde / arată categoria X" | CONFIG · categorie | `set_physical_menu_category_fields({categoryId, fields:{visible:false}})` / `{visible:true}` (sau `clear:['visible']`). Vezi rețeta „Ascunde/arată o categorie". |
| „redenumește categoria X (în design)" | CONFIG · categorie | `set_physical_menu_category_fields({categoryId, fields:{name:'…'}})`. În catalog (peste tot): `/menu/pricing`. |
| „pune categoriile în ordinea asta" | CONFIG | `reorder_physical_menu_categories({orderedCategoryIds:[…]})`. ⚠ nu mută categorii ÎNTRE pagini. |
| „schimbă tema / alt stil de meniu" | app + CONFIG | Tema se aplică în aplicație (engine-side); apoi citești cu `get_physical_menu_config` și faci fine-tuning prin field-settere. Arată-i 2-3 teme (vision). |

Reguli rapide: (1) Date care trebuie să apară peste tot → CATALOG (`update_menu_item`). „Doar pe afiș" → `custom*` prin `set_physical_menu_item_fields`. (2) „Toate / global" → setezi global ȘI golești override-urile de jos cu `clear[]`. „Doar pe pagina asta" → `set_physical_menu_page_fields`. „Doar produsul ăsta" → `set_physical_menu_item_fields({productId})`. (3) Mutările de categorie/pagină → `move_physical_menu_item` se ocupă singur de repaginare (sincronizează `pageAssignments`). (4) Vorbește userului în limbaj de restaurant; apelezi tool-uri tehnice.

## Teme — aplică-le în app, fine-tuning prin MCP

Există un set de teme predefinite (`bistro-navy` = cea mai echilibrată: navy+crem, Nunito, 2-col, poze mari dreapta, ramă pal groasă; restul: fine-dining text-only, steakhouse, patisserie card, editorial 4-col A3-landscape...).

⚠ **Aplicarea unei teme NU se reproduce scriind doar config-ul.** `applyTheme` rulează ENGINE-SIDE în designer: selecția eroilor (seed determinist), decorul per-pagină, repaginarea. Deci:
1. **Schimbarea temei** se face ÎN designer — userul apasă tema, SAU tu prin Chrome apeși „Aplică tema". Arată-i userului 2-3 teme și întreabă-l care-i place (vision: screenshot fiecare).
2. **DUPĂ ce tema e aplicată**, citești config-ul rezultat (`get_physical_menu_config` + `get_physical_menu_item`) și faci tot fine-tuning-ul prin field-setterele de meniu fizic (poze, fonturi, fundal, mutări, umplere, freeform, featured — tot ce e mai sus).

Scrierea `activeThemeId` în config = semnal că tema se re-aplică la load, dar nu reproduce gramatica — nu te baza pe ea pentru „look-ul" temei; aplică tema în app.

### Temele + ce face „gramatica de poze"
Alege tema după tipul localului. Printre ele: `bistro-navy` (navy+crem, Nunito, poze mari), `fine-dining-elegant` (text-only, serif), `modern-minimalist`, `rustic-trattoria`, `bold-street-food`, `cafe-brunch-warm-minimal`, `cocktail-bar-dark` (speakeasy nocturn), `classic-wine-list`, `asian-izakaya`, `patisserie-dessert` (carduri rose-gold), `health-vegan-fresh`, `steakhouse-grill` (accent oxblood), `editorial-bistro-a3l` (4-col A3-landscape).

**De ce nu rescrii tema din config** (mecanica care explică fine-tuning-ul corect):
- **Distribuția eroilor e DETERMINISTĂ** (nu random): tema alege ce produse devin „eroi" cu poză mare pe baza unui seed fix (tema + categorie). La re-aplicare → ACEIAȘI eroi. În designer userul confirmă recomandarea într-o modală ÎNAINTE de aplicare. După aplicare, eroii stau pe itemi ca `photoRole:"hero"`. Fine-tuning corect: dacă un produs nu merită statut de erou (n-are poză bună), pe acel item șterge `photoRole` și pune `photoSize:"small"`.
- **Coloane per secțiune**: unele teme pun alcoolul pe 1 coloană (citire de listă, gen wine-list) și mâncarea pe 2 — prin override-uri pe paginile omogene. Dacă schimbi GLOBAL coloanele acelei pagini, pierzi efectul; re-aplicarea temei le regenerează.
- **Decor programatic**: temele cu „rețetă de decor" (filete, ornamente, benzi laterale) generează elemente freeform cu prefix `theme:` — se regenerează la re-aplicare. Decorul TĂU manual (fără prefix) rămâne.

**Fine-tuning după temă (ce CHIAR poți face prin MCP)**: după aplicare, citește config-ul și ajustează exact câmpurile pe care le-a pus tema — `titleFont`/`fontFamily` (ID), paleta (`backgroundColor`/`textColor`/`accentColor`), `columns`, `pageBorder*`, spacing, plus stilizarea/offset-urile pozelor pe itemi anume. Reordonezi prin `sortOrder`, umpli goluri prin `spanColumns`. Regula de aur: NU rescrie geometria de poză a temei la global — rescrie itemii care nu se încadrează.

## Pagini/coloane goale — cum le umpli

> **Linia roșie „nu se tipărește" (conținut care nu încape)**: în editor, ce nu încape pe o pagină NU mai e ascuns — rămâne vizibil sub o linie roșie punctată care marchează marginea de tipărire. La vision: orice e SUB acea linie **nu intră în PDF/print** → trebuie urcat sau redistribuit (mai puține produse pe pagină, poze mai mici, `itemSpacing` compact, `pageAssignments`, sau butonul „Recalculează și optimizează" în app — care repară orice pagină supra-plină, indiferent unde ești derulat). Pagina supra-plină arată și un procent > 100% („% umplut").

Pagina cu fill < ~30% = goală. Pârghii (prin config):
- `spanColumns` 1→2+ pe un produs (umple coloana goală lățindu-l).
- `photoColFrac`/`photoWidthCustomPx` mai mare (poze mai mari ocupă spațiu) sau mai mic (încap mai multe).
- mută produse între pagini cu `pageAssignments` (reechilibrezi).
- `itemSpacing` relaxed (întinde) / compact (strânge).
- inserezi o pagină sau un element freeform decorativ.
- Gol mic (10–20%) e NORMAL (whitespace intenționat) — nu-l forța.

### „Recalculează" vs „Optimizează pagina" + procentul de umplere
- **Procent umplut**: fiecare pagină arată un badge `% umplut` = cât din înălțimea utilă (după margini/header/footer/ramă) e ocupat. Peste 100% → pagina e supra-plină (conținut sub linia roșie, care NU se tipărește). Sub ~30% → considerată goală.
- **Butonul are 2 moduri**: „Recalculează și optimizează" = repaginează de la pagina curentă în jos și REsetează distribuția fixă (`pageAssignments`) — folosește-l când vrei rearanjare globală. „Optimizează pagina" = optimizează DOAR pagina pe care ești. Pe paginile bune (ex. 1–3) nu apăsa recalc de la pagina 1 — pornește optimizarea de la prima pagină cu probleme ca să nu strice ce e deja bun.
- **Pârghie în plus pentru umplere**: `categorySpacingPx` (spațiul ÎNTRE categorii, default 16) — micșorează-l (ex. 8) ca să strângi mai multe categorii pe pagină, fără să atingi pozele. Complementar lui `itemSpacing` (spațiul între produse).
- **După recalc, verifică vision**: recalcul-ul poate micșora poze prea agresiv (erou 0.7 → 0.2). Repară 2-3 poze cu `photoColFrac` pe item, apoi recalc din nou de la pagina respectivă. Iterativ, nu dintr-o lovitură.

## Multiplu de 4 (A3 broșură)

La `formatType: "a3-booklet"`, engine-ul **forțează automat** `totalPages % 4 === 0` (adaugă pagini goale la final post-paginare). Tu NU scrii `pages.length`; setezi formatul și lași engine-ul. Ștergerea unei pagini re-pad-ează automat. `a4-individual` și `a3-landscape` n-au constrângerea.

## Export PDF, formate și pagini speciale

**Cum se exportă**: PDF-ul se generează pe SERVER (nu prin print din browser, ca să fie DPI/dimensiuni controlate) — randează HTML-ul designului cu dimensiuni exacte per format (`@page` = mărimea formatului). Imaginile din galerie se înglobează în documentul de export (self-contained), deci nu depind de rețea la randare. Tu nu setezi nimic manual aici — alegi formatul și conținutul, restul e automat.

**Formate** (`formatType`): `a4-individual` (210×297mm, vertical), `a3-booklet` (broșură pliată, engine forțează multiplu de 4 pagini), `a3-single` (297×420mm), `a3-landscape` (420×297mm — placemat de masă, 4 coloane). Doar `a3-booklet` are constrângerea multiplu-de-4.

**Pagini speciale structurale** (toggle, undefined sau true = afișat, false = ascuns): `coverPage`, `locationPage`, `bonFiscalPage`. `contentStartPage` = pagina unde încep produsele (după paginile speciale) — se recalculează automat când activezi/dezactivezi pagini speciale.

**Pagini de recomandări dedicate**: `barRecommendations` / `chefRecommendations` = liste de `productId` (din config) care se randează pe pagini proprii; titlurile lor `barRecommendationsTitle` / `chefRecommendationsTitle`. Distinct de „evidențiere" (featured) pe item.

**Pagini de final — nutrițional & alergeni** (listă compactă pe categorii, multi-coloană):
- Activare globală: `showNutritionalEndPages` / `showAllergensEndPages`.
- Stilizare: `nutritionalFontFamily`/`nutritionalFontSize` (px, default 8)/`nutritionalColor`/`nutritionalColumns` (1–4, default 2)/`nutritionalPageTitle`; identic cu prefix `allergens` (`allergensFontSize` default 8 similar).
- Ordine: `endPagesReversed` (false/undefined = nutrițional apoi alergeni — default; true = alergeni apoi nutrițional).
- **Cascadă de includere (inversă — exclude bate include)**: global ON → `pageOverrides[idx].showInNutritionalEndPage:false` exclude TOATE produsele de pe pagina respectivă → `item.showInNutritionalEndPage:false` exclude DOAR produsul. La fel pentru alergeni (`showInAllergensEndPage`).

## Bucla „grafician senior" (per pagină, cu vision)

Pentru fiecare pagină: screenshot (Chrome) → întreabă-te ca un grafician: *coloane/pagini goale? poze prea mici sau prea mari? echilibru stânga-dreapta? ordinea logică (best-sellers sus)? un produs-erou pe pagină? text înghesuit?* → aplică 1-3 schimbări prin tool-uri (poză cu `set_physical_menu_item_photo`, span/featured/spacing cu `set_physical_menu_item_fields`/`_page_fields`, mutare cu `move_physical_menu_item`, freeform cu `add_physical_menu_page_element`) → refresh → screenshot → repetă până e curat. Confirmă cu userul deciziile estetice mari; explică-i pe scurt CE ai schimbat și DE CE.

## Gotchas (durabile)

- **Calea principală = tool-urile MCP dedicate** (`get_physical_menu_*` citire, `set_physical_menu_*_fields` + `swap`/`move`/`reorder`/`set_…_photo`/`…_page_element` scriere). Scriu cu MERGE (atinge doar ce ceri). `update_menu_display_config` (REPLACE) = doar ultima soluție pentru un câmp structural neacoperit, și atunci citește întreg cu `get_physical_menu_config(section:'raw')` întâi. NU citi configul cu SQL (trunchiat la ~2000 caractere).
- **`productId` = `menu_items.id`**, **`categoryId` = `menu_categories.id`** (NU products.id). Vânzările/galeria folosesc products.id — nu le încrucișa.
- **`photoWidthCustomPx` și `photoColFrac` se exclud** — la setarea uneia, șterge cealaltă (+`photoAspectNum`/`photoRole`).
- **Freeform = px logice (mm×2.8)** — nu pune px de ecran.
- **Tema = engine-side** (eroi/decor/paginare) — aplică în app, nu o reproduce din config.
- **Verifică prin re-citire + vision**, nu presupune. UI-ul are cache → refresh.
- Cu userul: limbaj de restaurant („fac poza mai mare", „mut produsul sus", „umplu pagina"), nu „photoColFrac/freeformElements".
