# Materiale grafice — design prin MCP (Claude ca grafician senior)

> Cum creezi, înțelegi și editezi MATERIALELE GRAFICE ale restaurantului (afișe, flyere, broșuri, table tents, postări social, șabloane QR de masă) prin conexiune (MCP) — fără clickuri. Fluxul complet + livrarea către user: skill-ul `materiale-grafice`. Conducerea Chrome (deep-link, screenshot ca livrabil) = `condu-chrome.md`. Pentru MENIUL fizic tipărit (alt modul) → `meniu-fizic-design.md`.

## ⚠ READ FIRST — ai tool-uri dedicate, lucrezi DECLARATIV, nu cu clickuri

Materialele grafice se editează în studioul `/graphic-materials` (drag-drop). TU nu dai clickuri — designul e o structură pe care o citești, o transformi și o scrii prin tool-uri MCP semantice. Două căi, ambele excelente:

1. **Pornește dintr-un ȘABLON** (cel mai rapid mod de a obține ceva frumos): `list_material_templates` → `create_material_from_template`. Există zeci de șabloane profesioniste (promo, meniul zilei, voucher, story/post/cover social, multe carduri QR de masă) — catalogul complet îl vezi cu `list_material_templates`. Completează automat numele brandului și locația; opțional recolorează la brand.
2. **Compune de la zero ca un grafician**: `create_material_design` cu o listă de elemente (text, imagini, forme, sloturi QR) — sau gol, apoi adaugi cu `add_material_elements`. **Coordonatele sunt FRACȚIONALE (0..1 din coală)** — gândești în procente, nu în pixeli (ex. `x:0.5` = mijloc pe orizontală, `width:0.8` = 80% din lățime, `fontSize:0.08` = 8% din lățime).

NU folosi `execute_sql_query` pe materiale și NU edita „brut" — tool-urile fac merge sigur (ating doar ce ceri). Permisiunea de scriere: modulul **`marketing_social`** („Marketing & Social Media"). „Permisiune insuficientă" → portal Hub → Acces AI.

## Ce sunt materialele grafice (tipuri)

Fiecare material are un **tip** și un **format** (dimensiune coală):
- **Print**: afiș A4/A3, flyer A5/A6/DL, broșură. Se exportă PDF la dimensiunea reală.
- **Social**: postare Instagram pătrat (1080×1080), story/reel (1080×1920), postare/cover Facebook. Se exportă PNG.
- **QR de masă / QR dinamic (șabloane QR)**: carduri mici cu un loc pentru codul QR (A6/A5/A7, sticker, table tent pliabil 2 fețe etc.). Slotul QR se completează la **printarea în lot** din pagina „Coduri QR" (`/qr-codes`) sau din QR-urile de mese.

Formatele uzuale (id-uri pt `format`): `a4-portrait`, `a4-landscape`, `a3-portrait`, `a5-flyer`, `a6-flyer`, `dl-flyer`, `ig-post`, `ig-story`, `fb-post`, `fb-event-cover`, `qr-table-a6`, `qr-table-a5`, `qr-table-a7`, `qr-table-tent`, `qr-card-85x55`, `qr-sticker-50`. Sau dimensiune custom în mm (`widthMm`+`heightMm`).

## Tool-urile MCP

**CITIRE (mereu disponibile):**
- `list_material_designs({brandId?, type?, includeArchived?})` — materialele salvate ale brandului (id, nume, tip, dimensiuni, nr. pagini/elemente). Punctul de start: îți dă `designId`-ul.
- `get_material_design({designId})` — citește un material ca să-l ÎNȚELEGI: dimensiunile colii (mm + px), fundalul, și TOATE elementele cu `id`, tip, poziție (px **și procente**), dimensiune, conținut/culoare. Ia `id`-urile de element de aici pentru update/remove/arrange.
- `list_material_templates({group?})` — șabloanele gata făcute (grup Print / Social / QR): `templateId` + descriere + dimensiuni. **Pornește de aici** pentru rezultate frumoase rapid.

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
- **Text**: `content` (poate conține token-uri `{{brand}}`, `{{location}}`, `{{tableNumber}}`, `{{title}}`, `{{code}}`, `{{url}}`, `{{date}}`, `{{customText1}}`...`{{customText4}}`), `fontFamily` (montserrat, poppins, inter, oswald, playfair, cormorant, quicksand, nunito, lato, raleway…), `fontSize`, `fontWeight` (400–900), `textAlign`, `verticalAlign`, `color`, `backgroundColor` (chip), `letterSpacing`, `lineHeight`, `textEffect` (`neon`/`echo`/`lift`).
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

Sloturile QR (`qr-slot` in MCP, `qrSlot:true` in aplicatie) sunt locuri rezervate. Pe șabloanele QR de masă, slotul se completează cu codul fiecărei mese la **printarea în lot** din pagina „Coduri QR" (alegi șablonul + mesele → PDF cu un card per masă). Pentru un singur material (afiș/postare) cu un QR fix, pune un `qr-slot` și spune userului că-l leagă la print, sau folosește o imagine de QR deja generată (`type:image`, `imageUrl`).

### Câmpuri dinamice pe șabloanele QR

Aceste token-uri se pun în `content` pe elemente de text:
- `Masa {{tableNumber}}` → numărul mesei se completează automat per cod la print (`Pers 02` devine `02`; `Sala 2 Masa 05` devine `05`).
- `{{title}}`, `{{code}}`, `{{url}}`, `{{brand}}`, `{{location}}`, `{{date}}` → valori dinamice ale QR-ului / brandului.
- `{{customText1}}`, `{{customText2}}`, `{{customText3}}`, `{{customText4}}` → texte completate MANUAL în dialogul de print, aplicate tuturor cardurilor din PDF-ul curent.

Exemplu foarte folosit: faci un șablon cu `Masa {{tableNumber}}` + `{{customText1}}`. În `/qr-codes`, la „Printează pe șablon", scrii `Parter` pentru o rundă de print; apoi printezi altă rundă cu `Etaj`. Numărul mesei rămâne diferit per card, textul custom este același în PDF-ul respectiv.

Important: `customText1..4` sunt **per print/PDF**, nu per QR individual. Dacă userul vrea valori diferite în același PDF, împarte printurile pe grupe sau spune că trebuie extindere de produs.

Pentru șabloane reutilizabile, NU înlocui tokenii custom cu text fix când creezi designul. Lasă `{{customText1}}` în text; dialogul de print îl detectează automat doar dacă șablonul îl folosește.

## Cheatsheet: ce-ți cere userul → ce faci
- „Fă-mi un afiș cu promoția / un flyer cu meniul zilei / un voucher" → `list_material_templates(group:'Print')` → `create_material_from_template` (promo/lunch/voucher) + `tokens` + `applyBrandColors:true`. Ajustezi textele cu `update_material_elements`.
- „Fă o postare/story pentru Instagram / un eveniment" → șabloane `group:'Social'` (story eveniment, specialitatea zilei, cover) → from-template → personalizezi.
- „Cod QR de masă frumos de printat" → șabloane `group:'QR'` (navy, gradient, elegant crem, număr masă mare, cort 2 fețe…) → from-template; printarea efectivă = pagina „Coduri QR" în lot.
- „Vreau să scriu Parter/Etaj/Sala manual când printez QR-urile" → pune în șablon `{{customText1}}` (sau 2/3/4). Userul completează câmpul în dialogul de print; se aplică tuturor cardurilor din PDF-ul curent.
- „Schimbă textul / mută titlul / fă logo-ul mai mare" → `get_material_design` (ia id-urile) → `update_material_elements`.
- „Aliniază / centrează / pune-le la distanță egală" → `arrange_material_elements`.
- „Pune-l pe culorile mele / logo-ul meu" → `apply_brand_to_material`.
- „Vreau și varianta pentru Instagram a afișului" → `resize_material_design(format:'ig-post'/'ig-story')`.
- „Pornește de la asta dar nu o strica" → `duplicate_material_design`.

## Vezi materialul și atașează-l la o postare (fără clickuri)
Acum POȚI vedea efectiv materialul randat și să-l pui într-o postare:
1. **Randează + vezi**: `render_material_design(designId)` — îți ARATĂ imaginea materialului ca s-o evaluezi (texte, culori, poziții). Dacă nu arată bine, ajustează cu `update_material_elements` / `apply_brand_to_material` și re-randează până e ok.
2. **Salvează ca imagine**: `render_material_design(designId, save:true)` — îl salvează în Biblioteca Media și îți dă un `url`.
3. **Atașează la postare**: pune `url`-ul în `mediaUrls` la `schedule_social_post` / `update_social_post` (vezi skill-ul `programeaza-postare`). Postarea intră, ca de obicei, „în așteptare aprobare".
4. **Carusel**: salvează mai multe materiale (și/sau alege imagini din bibliotecă) și pune TOATE URL-urile în `mediaUrls` cu `postType:"carousel"`.

**Alege din Biblioteca Media** (imagini deja existente): `browse_brand_media` (listează id + url + descriere + thumbnail) → `view_brand_media(mediaAssetId)` ca să VEZI efectiv imaginea înainte s-o alegi → pune url-ul ei în `mediaUrls`. Ca să **schimbi** pozele unei postări, trimite setul COMPLET nou la `update_social_post` (înlocuiește lista, nu adaugă).

## Reguli (cele care contează)
- **Tool-uri dedicate, NU clickuri, NU SQL.** Citește cu `get_material_design`, scrie cu tool-urile (merge sigur). Coordonate FRACȚIONALE implicit (0..1) — cel mai ușor de raționat.
- **Pornește din șabloane** pentru calitate rapidă; compune de la zero doar când userul vrea ceva specific.
- **Brand consecvent**: `apply_brand_to_material` / `applyBrandColors` la from-template.
- **Claritate pentru user**: limbaj de restaurant („fac titlul mai mare", „pun pe culorile tale"), nu jargon. **Verifică TU întâi** cum arată cu `render_material_design` (îl vezi efectiv), corectează, apoi arată-i userului rezultatul (link / imagine).
- **Nu inventa** prețuri/oferte/poze reale — întreabă userul sau folosește token-uri și placeholdere.
- **QR custom text**: `{{customText1}}`...`{{customText4}}` se lasă în șablon și se completează la print, nu la crearea designului.
- **Permisiune**: scrierea cere modulul `marketing_social`.

## Legături
- Flux complet + livrare → skill-ul `materiale-grafice`.
- **Etichete de PRODUCȚIE** (material de tip „Etichetă" cu cod de bare + câmpuri auto `{{lot}}`/`{{termenValabilitate}}`/`{{alergeni}}`, legate de rețetă, printate la lot pe Zebra/termică ZPL sau PDF) → `etichete-productie.md` + skill `etichete-productie`.
- Cum conduci Chrome (deep-link, screenshot = livrabil) → `condu-chrome.md`.
- Coduri QR de masă (generare + print în lot) → `plan-sala-qr.md` / pagina „Coduri QR".
- Meniul fizic tipărit (alt modul, alt set de tool-uri) → `meniu-fizic-design.md`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` + ghidează în app.
