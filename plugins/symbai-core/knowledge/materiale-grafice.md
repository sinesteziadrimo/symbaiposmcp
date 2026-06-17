# Materiale grafice — design prin MCP (Claude ca grafician senior)

> Cum creezi, înțelegi și editezi MATERIALELE GRAFICE ale restaurantului (afișe, flyere, broșuri, table tents, postări social, șabloane QR de masă) prin conexiune (MCP) — fără clickuri. Fluxul complet + livrarea către user: skill-ul `materiale-grafice`. Conducerea Chrome (deep-link, screenshot ca livrabil) = `condu-chrome.md`. Pentru MENIUL fizic tipărit (alt modul) → `meniu-fizic-design.md`.

## ⚠ READ FIRST — ai 14 tool-uri dedicate, lucrezi DECLARATIV, nu cu clickuri

Materialele grafice se editează în studioul `/graphic-materials` (drag-drop). TU nu dai clickuri — designul e o structură pe care o citești, o transformi și o scrii prin tool-uri MCP semantice. Două căi, ambele excelente:

1. **Pornește dintr-un ȘABLON** (cel mai rapid mod de a obține ceva frumos): `list_material_templates` → `create_material_from_template`. Sunt ≈23 șabloane profesioniste (promo, meniul zilei, voucher, story/post/cover social, multe carduri QR de masă). Completează automat numele brandului și locația; opțional recolorează la brand.
2. **Compune de la zero ca un grafician**: `create_material_design` cu o listă de elemente (text, imagini, forme, sloturi QR) — sau gol, apoi adaugi cu `add_material_elements`. **Coordonatele sunt FRACȚIONALE (0..1 din coală)** — gândești în procente, nu în pixeli (ex. `x:0.5` = mijloc pe orizontală, `width:0.8` = 80% din lățime, `fontSize:0.08` = 8% din lățime).

NU folosi `execute_sql_query` pe materiale și NU edita „brut" — tool-urile fac merge sigur (ating doar ce ceri). Permisiunea de scriere: modulul **`marketing_social`** („Marketing & Social Media"). „Permisiune insuficientă" → portal Hub → Acces AI.

## Ce sunt materialele grafice (tipuri)

Fiecare material are un **tip** și un **format** (dimensiune coală):
- **Print**: afiș A4/A3, flyer A5/A6/DL, broșură. Se exportă PDF la dimensiunea reală.
- **Social**: postare Instagram pătrat (1080×1080), story/reel (1080×1920), postare/cover Facebook. Se exportă PNG.
- **QR de masă (șabloane QR)**: carduri mici cu un loc pentru codul QR al mesei (A6/A5/A7, sticker, table tent pliabil 2 fețe etc.). Slotul QR se completează la **printarea în lot** din pagina „Coduri QR".

Formatele uzuale (id-uri pt `format`): `a4-portrait`, `a4-landscape`, `a3-portrait`, `a5-flyer`, `a6-flyer`, `dl-flyer`, `ig-post`, `ig-story`, `fb-post`, `fb-event-cover`, `qr-table-a6`, `qr-table-a5`, `qr-table-a7`, `qr-table-tent`, `qr-card-85x55`, `qr-sticker-50`. Sau dimensiune custom în mm (`widthMm`+`heightMm`).

## Cele 14 tool-uri MCP

**CITIRE (mereu disponibile):**
- `list_material_designs({brandId?, type?, includeArchived?})` — materialele salvate ale brandului (id, nume, tip, dimensiuni, nr. pagini/elemente). Punctul de start: îți dă `designId`-ul.
- `get_material_design({designId})` — citește un material ca să-l ÎNȚELEGI: dimensiunile colii (mm + px), fundalul, și TOATE elementele cu `id`, tip, poziție (px **și procente**), dimensiune, conținut/culoare. Ia `id`-urile de element de aici pentru update/remove/arrange.
- `list_material_templates({group?})` — cele ≈23 șabloane gata făcute (grup Print / Social / QR): `templateId` + descriere + dimensiuni. **Pornește de aici** pentru rezultate frumoase rapid.

**CREARE:**
- `create_material_from_template({templateId, brandId?, name?, locationId?, tokens?, applyBrandColors?, useBrandFont?})` — material NOU dintr-un șablon. Completează `{{brand}}`/`{{location}}` automat; `tokens` pentru restul (ex. `{tableNumber:'12', code:'VARA10'}`); `applyBrandColors:true` recolorează la paleta brandului; `useBrandFont:true` pune fontul de brand. **RECOMANDAT ca prim pas** pentru majoritatea cererilor.
- `create_material_design({brandId?, type, format? | widthMm+heightMm, name?, background?, elements?, units?})` — material NOU de la zero, gol sau compus direct de tine cu `elements`. Control total.

**EDITARE ELEMENTE (pe `id`, în loturi):**
- `add_material_elements({designId, pageIndex?, elements, units?})` — adaugă text/imagine/formă/linie/slot QR. Întoarce id-urile noi.
- `update_material_elements({designId, pageIndex?, updates, units?})` — modifică elemente după `id`: mută (x,y), redimensionează (width,height), schimbă text/culoare/font/umbră/rotație/orice stil. Trimiți DOAR câmpurile pe care le schimbi.
- `remove_material_elements({designId, pageIndex?, ids})` — șterge elemente după `id`.
- `arrange_material_elements({designId, pageIndex?, action, ids})` — aranjare la nivel înalt fără calcule: `align-left/right/top/bottom`, `align-hcenter/vcenter`, `center` (ambele axe), `center-h/center-v`, `distribute-h/distribute-v` (3+ elemente, spațiere egală), `to-front/to-back` (ordine straturi).

**COALĂ & BRAND:**
- `set_material_page_background({designId, pageIndex?, background})` — fundal solid sau gradient (liniar/radial).
- `apply_brand_to_material({designId, recolor?, setFont?, insertLogo?})` — aplică identitatea de brand: recolorează la paleta brandului, pune fontul de brand, inserează logo-ul. Ia datele din Brand Kit / identitatea de brand.
- `resize_material_design({designId, format? | widthMm+heightMm})` — Magic Resize: o COPIE scalată proporțional la alt format (ex. afiș A4 → story Instagram). Originalul rămâne.
- `duplicate_material_design({designId, name?})` — copie editabilă (pornește de la un design existent fără să-l strici).
- `update_material_design({designId, name?, type?, archived?})` — redenumire / tip / arhivare.

## Modelul unui element (ce poți pune pe coală)

Un element are: `type` (`text` | `image` | `shape` | `separator` | `qr-slot`), poziție `x,y`, dimensiune `width,height` (în `units`, implicit fracție 0..1), plus stiluri opționale:
- **Text**: `content` (poate conține token-uri `{{brand}}`, `{{location}}`, `{{tableNumber}}`, `{{code}}`), `fontFamily` (montserrat, poppins, inter, oswald, playfair, cormorant, quicksand, nunito, lato, raleway…), `fontSize`, `fontWeight` (400–900), `textAlign`, `verticalAlign`, `color`, `backgroundColor` (chip), `letterSpacing`, `lineHeight`, `textEffect` (`neon`/`echo`/`lift`).
- **Imagine**: `imageUrl`, `objectFit` (cover/contain/fill), `clipShape` (ramă), `borderRadius`.
- **Formă**: `shapeType` (rectangle/circle/line), `shapeKind` (formă avansată: `parallelogram`, `seal`, `ribbon`, `burst`, `blob`, `hexagon`, `star`, `triangle`, `diamond`, `heart`, `shield`, `banner`), `color`, `fillType` (`solid`/`gradient` cu `gradientColor2`+`gradientDir`).
- **Comun**: `borderRadius`, `borderWidth`+`borderColor`, `shadow` (sm/md/lg), `opacity` (0..1), `rotation` (grade), `name` (numele stratului).

## Cum lucrezi ca un grafician senior

1. **Aproape mereu pornește dintr-un șablon** (`create_material_from_template`) — sunt echilibrate, cu ierarhie, contrast și QR la locul lor. Apoi personalizezi (text, ofertă, culori de brand). E mult mai rapid și mai frumos decât „de la zero".
2. **Citește înainte de a edita**: `get_material_design` îți dă id-urile + pozițiile în procente. Editezi pe id.
3. **Principii de design** (aplică-le mereu): un singur punct focal pe coală; ierarhie clară (titlu mare → subtitlu → corp); contrast bun text/fundal (citibil); aliniere (folosește `arrange_material_elements`, nu „la ochi"); spațiu de respirație (nu înghesui); maxim 2–3 culori + 1–2 fonturi; CTA clar („Scanează", „Comandă", „Rezervă"); consecvență cu brandul (`apply_brand_to_material`).
4. **Brand**: `apply_brand_to_material` recolorează la paleta clientului + pune fontul + (opțional) logo-ul. Folosește-l ca materialul să arate „al lor”.
5. **Arată rezultatul**: deschide `/graphic-materials` (link în răspunsuri / `gaseste_in_aplicatie("materiale grafice")`); cu extensia Chrome poți face screenshot = livrabilul. Userul exportă PDF/PNG din studio (butonul „Descarcă").

## QR pe materiale

Sloturile QR (`qr-slot`) sunt locuri rezervate. Pe șabloanele QR de masă, slotul se completează cu codul fiecărei mese la **printarea în lot** din pagina „Coduri QR" (alegi șablonul + mesele → PDF cu un card per masă). Pentru un singur material (afiș/postare) cu un QR fix, pune un `qr-slot` și spune userului că-l leagă la print, sau folosește o imagine de QR deja generată (`type:image`, `imageUrl`). Textul `Masa {{tableNumber}}` se completează automat per cod la print.

## Cheatsheet: ce-ți cere userul → ce faci
- „Fă-mi un afiș cu promoția / un flyer cu meniul zilei / un voucher" → `list_material_templates(group:'Print')` → `create_material_from_template` (promo/lunch/voucher) + `tokens` + `applyBrandColors:true`. Ajustezi textele cu `update_material_elements`.
- „Fă o postare/story pentru Instagram / un eveniment" → șabloane `group:'Social'` (story eveniment, specialitatea zilei, cover) → from-template → personalizezi.
- „Cod QR de masă frumos de printat" → șabloane `group:'QR'` (navy, gradient, elegant crem, număr masă mare, cort 2 fețe…) → from-template; printarea efectivă = pagina „Coduri QR" în lot.
- „Schimbă textul / mută titlul / fă logo-ul mai mare" → `get_material_design` (ia id-urile) → `update_material_elements`.
- „Aliniază / centrează / pune-le la distanță egală" → `arrange_material_elements`.
- „Pune-l pe culorile mele / logo-ul meu" → `apply_brand_to_material`.
- „Vreau și varianta pentru Instagram a afișului" → `resize_material_design(format:'ig-post'/'ig-story')`.
- „Pornește de la asta dar nu o strica" → `duplicate_material_design`.

## Reguli (cele care contează)
- **Tool-uri dedicate, NU clickuri, NU SQL.** Citește cu `get_material_design`, scrie cu tool-urile (merge sigur). Coordonate FRACȚIONALE implicit (0..1) — cel mai ușor de raționat.
- **Pornește din șabloane** pentru calitate rapidă; compune de la zero doar când userul vrea ceva specific.
- **Brand consecvent**: `apply_brand_to_material` / `applyBrandColors` la from-template.
- **Claritate pentru user**: limbaj de restaurant („fac titlul mai mare", „pun pe culorile tale"), nu jargon. Arată-i rezultatul (screenshot / link).
- **Nu inventa** prețuri/oferte/poze reale — întreabă userul sau folosește token-uri și placeholdere.
- **Permisiune**: scrierea cere modulul `marketing_social`.

## Legături
- Flux complet + livrare → skill-ul `materiale-grafice`.
- **Etichete de PRODUCȚIE** (material de tip „Etichetă" cu cod de bare + câmpuri auto `{{lot}}`/`{{termenValabilitate}}`/`{{alergeni}}`, legate de rețetă, printate la lot pe Zebra/termică ZPL sau PDF) → `etichete-productie.md` + skill `etichete-productie`.
- Cum conduci Chrome (deep-link, screenshot = livrabil) → `condu-chrome.md`.
- Coduri QR de masă (generare + print în lot) → `plan-sala-qr.md` / pagina „Coduri QR".
- Meniul fizic tipărit (alt modul, alt set de tool-uri) → `meniu-fizic-design.md`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` + ghidează în app.
