# Prezentare de Vânzare — Construcție prin MCP (referință JSON)

> Anexă la `prezentare-vanzare.md` + `prezentare-vanzare-campuri.md`. Aici e CUM construiești o prezentare **prin conexiune (MCP), completând JSON** — nu clicând în UI. `campuri.md` = ce câmpuri există (vederea din UI); ACEST fișier = cum le scrii prin tool-uri. Folosește-l când vrei să faci o prezentare „dintr-o suflare", fără zeci de click-uri.

## Regula de aur a construcției prin MCP
**Scaffold + datele „grele" prin MCP (completezi JSON), apoi ARĂȚI rezultatul în Chrome schimbând tab-urile.** Nu te chinui să dai click pentru fiecare câmp — pui JSON-ul printr-un `patch_presentation`, apoi navighezi în pagină DOAR ca să-i arăți userului ce-a ieșit (și ca să rulezi Preview-ul în fața lui).

## Tool-urile de BAZĂ (recap)
> Ai 6 tool-uri de scaffold/citire/scriere top-level, tool-uri granulare de bibliotecă și quick actions pentru operații frecvente (badge durere, intro vizibil, reveal/follow-up, slide design).
- `list_presentation_templates()` — șabloane de pornit (`symbai_horeca_2026` = gold standard, +6 verticale).
- `list_presentations(brandId)` — ce există pe brand.
- `get_presentation(brandId, presentationId, section?)` — CITEȘTE. `section`: `summary`(default)/`intro`/`slides`/`offers`/`theme`/`flow`/`typologies`/`library`/`full`. **Citește secțiunea ÎNAINTE de a o modifica** (patch înlocuiește cheia întreagă — ai nevoie de conținutul curent ca să nu pierzi nimic).
- `create_presentation_from_template(brandId, title, templateKey? | fromPresentationId?+fromBrandId?, introTitle?, introDescription?, vertical?, coverImageUrl?, coverImageObjectPosition?)` — clonează. Primești un id nou (`pres_xxx`). `coverImageUrl` apare pe ecranul de start și pe primul slide cover.
- `patch_presentation(brandId, presentationId, patch:{...})` — modifică una sau mai multe **chei top-level**.
- `save_presentation(brandId, presentation)` — UPSERT config COMPLET (construire de la zero / înlocuire integrală).

## ⚠ Trei reguli care te scapă de bug-uri
1. **Patch = înlocuire de cheie, NU merge adânc.** `patch:{theme:{...}}` înlocuiește TOT obiectul `theme`; `patch:{introFields:[...]}` înlocuiește TOT array-ul. Deci: `get_presentation(section)` → modifici obiectul în memorie → trimiți cheia **întreagă** înapoi. Dacă trimiți doar o parte, pierzi restul.
2. **Patch-urile se fac SECVENȚIAL, nu în paralel.** Configurația prezentării se salvează ca un singur obiect, pe principiul „ultimul care scrie câștigă". Două `patch_presentation` în paralel se pot suprascrie. Fă-le unul după altul.
3. **Validare structurală la scriere.** `patch`/`save` resping config corupt (ex. `theme:"text"`, `offers:{}` în loc de array) ÎNAINTE de scriere — dacă răspunsul zice `rejected`, ai greșit forma cheii.

## Cele 18 chei top-level (ce poți pune prin patch_presentation)
`title, introTitle, introDescription, vertical, theme, offers, flowV2, flowVersion, introFields, slides, typologies, slideRules, autoDeriveRules, libraryOverride, stages, maxPainSlides, maxCalculationSlides, debugMode`.

**Ușoare (mici → le pui direct prin MCP, ideal):** `title/introTitle/introDescription/vertical` (string-uri), `theme`, `offers`, `flowV2`, `introFields`, `typologies`, `autoDeriveRules`, `slides`.
**Grea (vezi secțiunea libraryOverride):** `libraryOverride` (dureri/soluții/discovery/dovezi/obiecții/calcule — poate fi sute de KB).

## Cover / primul slide / intro vizibil

- **Imagine cover:** pune `coverImageUrl` la `create_presentation_from_template` sau prin `patch_presentation(patch:{coverImageUrl, coverImageObjectPosition})`. Aceeași imagine apare pe ecranul de start și pe primul slide de tip cover generat de etapa intro.
- **Focalizare imagine:** `coverImageObjectPosition` e CSS object-position (ex. `"50% 35%"`) și se folosește atât la start screen, cât și la slide-ul cover.
- **Ascunde primul slide:** `set_presentation_intro_visible(presentationId, visible:false)` setează `flowV2.showIntro=false` fără să retrimiți tot `flowV2`. E eficient pe prezentările Flow V2; dacă prezentarea e încă pe v1, tool-ul întoarce warning și trebuie folosit editorul/fluxul potrivit.
- **Verificare:** `get_presentation(section:"flow")` → `showIntro:false`, apoi Preview în Chrome ca să vezi că primul pas e discovery/următorul pas dorit.

---

## INTRO + DISCOVERY-cu-dureri → `introFields[]` (cea mai folosită cheie)
Câmpurile din formularul de start. **Fiecare câmp `select` poate avea `options[]` ȘI `painTriggers[]`** — adică „o întrebare cu mai multe răspunsuri, fiecare legat de o durere". Asta e mecanismul prin care răspunsurile aprind durerile (identic cu întrebările Discovery din bibliotecă).

Forma unui câmp (CONFIRMATĂ):
```json
{
  "id": "biggest_priority",
  "label": "Ce te-ar ajuta cel mai mult să rezolvi ÎNTÂI?",
  "inputType": "select",                       // "text" | "select" | "number" | "textarea" | "date"
  "required": false,
  "placeholder": "Alege prioritatea ta",
  "helpText": "Răspunsul ridică automat durerea potrivită în prezentare.",
  "sourceFromLead": "customer.companyName",    // opțional: auto-import din lead (customer.* / deal.*)
  "options": [
    { "id": "see_profit", "label": "📊 Să văd profitul real pe canal / locație", "imageUrl": "https://...", "imageObjectPosition": "50% 35%" },
    { "id": "one_app",    "label": "🧩 Să nu mai jonglez cu mai multe aplicații" }
  ],
  "painTriggers": [
    { "mode": "direct", "label": "Prioritate: profit pe canal", "painId": "pain_channel_profit_unknown", "intensityWhenMet": 8, "whenAnswerEquals": "see_profit" },
    { "mode": "direct", "label": "Prioritate: o singură aplicație", "painId": "pain_softs_zoo", "intensityWhenMet": 8, "whenAnswerEquals": "one_app" }
  ]
}
```

`imageUrl` / `imageObjectPosition` sunt opționale pe orice `PresentationOption`. În special la wishlist-ul `icon-cards`, poza devine fundal full-bleed al cardului; fără poză, cardul folosește gradient + icon. Pentru opțiuni de discovery normale, folosește poza doar dacă ajută vizual, nu ca decor generic.

### painTrigger — mecanismul răspuns→durere (același la introFields ȘI la discovery questions)
- `mode: "direct"` — 🎯 **Sigură**: durerea intră garantat. Câmp: `intensityWhenMet` (1–10). (la scoring: MAX cu alte semnale directe)
- `mode: "boost"` — ➕ **Scor ±**: răspunsul mărește/micșorează intensitatea unei dureri (−10..+10). (la scoring: SUM)
- `mode: "potential"` — 🔍 **De confirmat**: semnal slab (max ~4), durerea apare doar dacă alte răspunsuri o întăresc.
- Țintirea răspunsului: `whenAnswerEquals: "<option.id>"` (sau `whenAnswerNotEquals` pentru „dacă NU alege").
- **`painId` trebuie să existe în bibliotecă** — altfel e ignorat tăcut (fără efect, fără eroare). Verifică numele rulând Preview și uitându-te la badge-ul 💔 N pe câmp + la titlul durerii care apare sub răspuns.
- ⚠ Pentru `boost`/`potential` cheia numerică exactă o vezi cel mai sigur clonând o întrebare existentă cu `get_presentation` — în 90% din cazuri folosești `direct`.

Patch: trimite TOT array-ul (cele existente + ce adaugi). Citește întâi cu `get_presentation(section:"intro")`.

---

## Badge-ul unei DURERI → `set_pain_badge` (fără patch mare)

Pe slide-urile de durere, eticheta mică de deasupra titlului nu trebuie să rămână mereu „Problema ta". O poți schimba per durere, prin tool dedicat:

```json
set_pain_badge({
  "presentationId": "pres_xxx",
  "painId": "pain_costuri_ascunse",
  "badgeLabel": "RISC ASCUNS",
  "showBadge": true
})
```

- `badgeLabel:""` șterge eticheta custom și revine la implicit.
- `showBadge:false` ascunde badge-ul pe durerea respectivă.
- Începe cu `list_presentation_library_items(kind:"pain")` ca să iei `painId`, apoi verifică în Preview pe un scenariu unde durerea chiar apare.
- Folosește acest tool în loc să retrimiți tot `libraryOverride.pains`.

---

## SLIDE SEPARAT după un răspuns de discovery → `followUpSlide` (pe o opțiune) ✅
Pe lângă reveal-ul inline (text peste același slide), o **opțiune de răspuns dintr-o întrebare discovery** poate avea un **slide întreg dedicat**, full-screen, care apare IMEDIAT după ce clientul alege acel răspuns (apoi „Mai departe" → următoarea întrebare). Util pentru fluxuri educaționale: *întrebare → slide educațional → întrebare*. Câmpul stă pe **opțiunea** întrebării (`options[].followUpSlide`), NU pe întrebare. Funcționează DOAR pe întrebările din `libraryOverride.questions` (discovery), nu pe `introFields`.

Forma (toate câmpurile opționale; fără titlu/text/bullets/poză SAU cu `enabled:false` → nu apare nimic):
```json
{
  "id": "opt_first_open", "label": "🚀 E prima mea deschidere",
  "followUpSlide": {
    "enabled": true,                                  // pune-l EXPLICIT true (vezi capcana bullets)
    "kicker": "Ce înseamnă asta pentru tine",          // eyebrow mic; suportă {cheie}
    "title": "La prima deschidere, 6 luni decid totul", // suportă {cheie}
    "body": "Hai să-ți arăt unde pierd cei mai mulți bani fără să-și dea seama.",
    "bullets": [
      { "text": "Food cost necontrolat — 8-12% din profit", "icon": "TrendingDown" },
      { "text": "Fără cifre clare nu poți negocia cu furnizorii", "icon": "Receipt" }
    ],
    "imageUrl": "https://...",                         // poză fundal (image-dark) / laterală (image-side)
    "imageObjectPosition": "50% 35%",                  // CSS object-position (opțional)
    "layout": "image-dark",                            // "image-dark"(default) | "image-side" | "solid"
    "accentColor": "#8b5cf6"                           // accent kicker+iconițe; lipsă = primary-ul temei
  }
}
```
- `icon` pe bullet = nume **Lucide** (ex `TrendingUp`, `Receipt`, `AlertTriangle`); nume necunoscut → bulină default.
- **layout**: `image-dark` (poză full-bleed + overlay închis, text alb jos) · `image-side` (split 2-col) · `solid` (fără poză, gradient pe accent).
- ⚠ **Capcană bullets**: pune `enabled: true` pe followUpSlide ȘI asigură-te că fiecare bullet are `text` ne-gol — un bullet gol e aruncat la normalizare. Fără `enabled:true` explicit, slide-ul apare doar dacă are titlu/text/poză.

**Cum îl scrii prin MCP** (întrebarea trăiește în `libraryOverride.questions` = bibliotecă mare → folosește tool-urile GRANULARE, nu `patch_presentation`):
1. `list_presentation_library_items(presentationId, kind:"question")` → iei `itemId`-ul întrebării.
2. `get_presentation_library_item(presentationId, kind:"question", itemId)` → vezi `options[]` curente.
3. `patch_presentation_library_item(presentationId, kind:"question", itemId, patch:{ options:[ ...toate opțiunile, cu `followUpSlide` adăugat pe cea dorită ] })` — `options` se înlocuiește integral, deci trimite TOATE opțiunile.

Confirmă în Preview: alegi acel răspuns → trebuie să apară slide-ul dedicat, apoi „Mai departe".

---

## TEMĂ → `theme` (CONFIRMATĂ)
```json
{
  "presetId": "onyx_premium",            // preset ca punct de plecare; cheia = snake_case din numele presetului
  "colors": { "primary": "#8b5cf6", "secondary": "#22d3ee", "accent": "#f59e0b", "background": "#0b1020", "foreground": "#e5e7eb" },
  "fontHeading": "Space Grotesk",        // din lista de fonturi titluri (vezi campuri §17)
  "fontBody": "Inter",
  "baseFontSize": 16,                    // 12–22
  "density": "comfortable",              // "comfortable" | "compact" | "dense"
  "borderRadius": 16                     // 0–24
}
```
`colors` e sursa de adevăr a randării — schimbi culorile aici, nu doar `presetId`.

## OFERTĂ → `offers[]` (CONFIRMATĂ — un obiect ofertă cu tiers)
```json
[{
  "id": "offer_xxx", "title": "...", "subtitle": "...", "layout": "grid-3", "currency": "EUR",
  "allowWhatsApp": true, "recommendedTierId": "tier_pro", "acceptedMessage": "...",
  "trustSignals": [ { "icon": "🛡️", "text": "30 zile money-back garanție" } ],
  "tiers": [{
    "id": "tier_pro", "icon": "⚡", "name": "...", "color": "#8b5cf6", "price": 280,
    "billingPeriod": "month",                       // "one-time" | "month" | "year" | "custom"
    "revenuePercent": 0.2,                           // opțional: "+ 0,2% din încasări" lângă prețul fix
    "revenuePercentLabel": "din încasări",           // opțional; lipsă = "din încasări"
    "cardStyle": "spotlight",                        // "minimal" | "glass" | "gradient" | "spotlight"
    "ribbon": { "text": "BEST VALUE", "gradient": "linear-gradient(90deg,#8b5cf6,#d946ef)" },
    "description": "...", "highlights": ["...", "..."],
    "features": ["...", "..."],
    "recommendedForTypologies": ["cafenea_bar", "pizzeria"]
  }],
  "addons": [{ "id": "addon_x", "name": "...", "price": 18, "billingPeriod": "month", "category": "Storage", "description": "..." }]
}]
```
⚠ **Iconițele de pe ofertă/semnale de încredere se randează ca TEXT BRUT** — pune EMOJI direct (`"icon": "🚀"`, `"🛡️"`), NU nume de iconițe (`"Rocket"` ar apărea literal pe slide). (Excepție: bullet-ele de pe `followUpSlide` folosesc nume Lucide — acolo motorul le rezolvă în iconițe.)
✅ **Preț hibrid în ofertă:** `revenuePercent` / `revenuePercentLabel` se afișează ca rând separat pe tier și lângă totalul fix selectat. Nu îl include manual în `price`: procentul depinde de cifra clientului și se explică prin calculul `comparative-list` cu `symbaiRevenuePercent`.
⚠ **Verticalele clonate (`sala_evenimente`/`catering`/`servicii`) vin cu 0 oferte** — creezi `offers[]` de la zero.

## FLUX → `flowV2` (CONFIRMATĂ — povestea: ce pași sunt activi + câte elemente)
```json
{
  "showIntro": true,
  "discovery":   { "enabled": true, "maxQuestions": 6 },
  "transition":  { "enabled": false },                          // OPT-IN (implicit OFF) — pune true ca să apară puntea + wishlist
  "solutions":   { "enabled": true, "count": 3 },               // câte perechi durere+soluție în deck
  "calculation": { "enabled": true, "calculationId": "calc_softs_savings" }, // ⚠ enabled:true ALTFEL calculatorul NU apare
  "objections":  { "enabled": true },
  "proofs":      { "enabled": true, "count": 2 },               // dovezi pe oraș/tipologie — lever mare de conversie
  "offer":       { "enabled": true },
  "calculationAfterOffer": { "enabled": false, "calculationId": "calc_softs_savings_phase2" } // ✅ calcul DUPĂ ofertă (opt-in)
}
```
Notă: `stages[]` + `autoDeriveRules[]` sunt chei separate (le păstrezi neatinse când dai patch DOAR pe `flowV2`). `autoDeriveRules` derivă axele tipologiei din răspunsurile intro (ex. `business_type → businessSize`, `years_open → experience`) — formă: `{id,label,targetAxis,derive:{path,source:"answer",mapping:[{op:"eq",value,result}],defaultValue}}`.

### ⚠ „Nu se vede calculatorul" = `flowV2.calculation.enabled` e `false`
Cauza #1 când calculatorul lipsește din prezentare: pasul e OPRIT din flux. Repară: `get_presentation(section:"flow")` → setezi `enabled:true` (și un `calculationId` care există în `libraryOverride.calculations`) → `patch_presentation(patch:{flowV2:{...flux complet cu calculation.enabled=true}})`. (Patch = înlocuire de cheie → trimite TOT obiectul `flowV2`, nu doar `calculation`.) Verifică în Preview: trebuie să apară slide-ul de calcul.

### Calculator „costuri-întâi, comparație-după ofertă" ✅
Pe un calcul de tip **Listă cheltuieli** (`comparative-list`) ai 3 câmpuri noi (le pui per-calcul cu `patch_presentation_library_item(kind:"calculation", itemId, patch:{...})`):
- **`currentCostOnly: true`** — ascunde coloana „Cu Symbai" + prețul; arată DOAR cât plătește clientul ACUM (total lună/an/5 ani). Strategic: arăți costul lui actual ÎNAINTE de a-i spune prețul tău.
- **`placement: "before-offer" | "after-offer"`** — în ce etapă apare calculul. Lipsă/`before-offer` = înainte de ofertă (default). `after-offer` = doar în etapa nouă de după ofertă (trebuie ȘI `flowV2.calculationAfterOffer.enabled:true`).
- **`comparativeItemsFromCalculationId: "<id-calc-faza-1>"`** — calculul de fază 2 (după ofertă) **reia cheltuielile** pe care agentul le-a introdus LIVE în calculul de fază 1, și acum arată economia vs prețul Symbai. (1 nivel, nu urmărește lanțuri.)

Pentru preț hibrid **abonament + comision**, același `comparative-list` mai acceptă:
- **`symbaiCostCurrency: "RON" | "EUR"`** — moneda costului fix; `"EUR"` se convertește în lei.
- **`symbaiEurRate`** — cursul €→lei pentru costul fix; lipsă = fallback motor (~5).
- **`symbaiRevenuePercent`** — procent din vânzările estimate (0,2 înseamnă 0,2%, nu 20%).
- **`revenueEstimateLabel`**, **`revenueEstimateDefault`**, **`revenueEstimatePeriod: "month" | "year"`** — câmpul live pe slide. Agentul îl poate modifica în rulare; engine-ul calculează lunar: `cost fix + procent × vânzări estimate`.

**Rețeta cerută de clienți (calc înainte fără preț → ofertă → economie după):**
1. Faza 1 (before): un `comparative-list` cu `currentCostOnly:true`, `placement:"before-offer"` → arată „cât plătești acum".
2. Faza 2 (after): un AL DOILEA `comparative-list` cu `currentCostOnly:false`, `placement:"after-offer"`, `comparativeItemsFromCalculationId:"<id-faza-1>"` (preia aceleași cheltuieli) + `symbaiCost` setat → arată economia.
3. `flowV2.calculationAfterOffer = { enabled:true, calculationId:"<id-faza-2>" }`.
Cheltuielile introduse live în faza 1 supraviețuiesc până în faza 2 fără nimic de salvat (sunt în același runner).

**Calea rapidă:** prin MCP rulezi `setup_two_phase_calculation(presentationId, calculationId)` pe calculul de fază 1. În UI există paritate: Configurare prezentare → tab **Calcule** → deschide un calcul „Listă cheltuieli" → buton **Configurează calcul în 2 faze**. După oricare cale, verifică `check_presentation_health` și Preview; dacă faza 2 nu are încă `symbaiCost`, economia poate apărea artificial 100%.

✅ Slide-ul de calcul **după ofertă** se emite chiar dacă formula nu are încă valori la generare (cheltuielile fazei 1 se completează live în runner). Nu încerca workaround-uri de tip „pun un cost fals ca să apară slide-ul"; configurează faza 2 cu `placement:"after-offer"` + `comparativeItemsFromCalculationId` și verifică în Preview după ce adaugi liniile în faza 1.

⚠ **Recalc live**: dacă cifrele nu se actualizează când adaugi linii în calculator, instanța rulează probabil o versiune mai veche a platformei — cere actualizarea echipei Symbai (`trimite_ticket_symbai`).

## TIPOLOGII → `typologies[]` (segmentele + regulile de detecție)
Conceptual: `{ id, name, vertical, keyMessage, axes:{experience,businessSize,businessModel,techMentality,...}, detectionThreshold, detectionRules:[{label,weight,conditions}], dominantPains:[painId], recommendedFeatures:[featId], predictedObjections:[objId], recommendedProofs:[proofId], agentTips }`. Fiecare match de axă = +1; pragul implicit 1. Citește un exemplu cu `get_presentation(section:"typologies")` înainte de a edita.

⚠ **`dominantPains` e POARTA de admitere a durerilor (regula #1 de calitate).** O durere apare în secțiunea Dureri & Soluții DOAR dacă e în `dominantPains` la tipologia detectată (sau bifată pe wishlist). Scorul din painTriggers doar **ordonează** durerile admise — **nu le admite**. Deci pentru fiecare durere prioritară: leag-o de răspunsuri (painTriggers) ȘI pune-i `painId`-ul în `dominantPains` la tipologia relevantă. Altfel, oricât scor ar avea, **nu apare**. (Și fiecare durere are nevoie de minim o soluție în `addressedByFeatures`, altfel e sărită tăcut.)

## SLIDE-URI FRUMOASE rapid → `apply_slide_design` / `compose_rich_slide` ✅
Slide-urile statice (cover, info, durere, soluție, dovadă, closing) folosesc blocuri de **conținut bogat** (`richContent`). NU le scrie de mână bloc cu bloc — ai **2 tool-uri** care le compun corect, server-side, fără să retrimiți tot `slides[]`:

**1. `apply_slide_design(presentationId, preset, content, slideId?, afterSlideId?|index?)`** — dintr-un BRIEF SIMPLU → slide premium. Alegi un PRESET de layout + dai conținutul minim; tool-ul emite blocurile corecte cu smart-defaults (imagine 16:9 rounded, KPI cu count-up, comparație cu reveal). **Începe cu `list_slide_design_presets()`** ca să vezi preseturile + ce câmpuri cer. Cele 8 preset-uri:

| preset | când | content |
|---|---|---|
| **hero-image** | intro / deschidere de secțiune — imagine full-bleed + 1 titlu mare | `title`, `imageUrl`, `imageObjectPosition`, `bullets[]`(≤4) |
| **bold-stat** | o cifră uriașă (ROI/economie) + label mic + 1 frază | `title`, `stat:{value,label,delta?}`, `subtitle` |
| **kpi-trio** | 3 cifre pe rând (300+ · 24/7 · 99.8%) | `title`, `stats:[{value,label}]`×3 |
| **split-compare** | Înainte/După (durere→soluție), reveal live la click | `title`, `before:{title,items[]}`, `after:{title,items[]}` |
| **bullets-with-image** | listă scurtă (3-5) + imagine de sprijin (lateral automat) | `title`, `bullets[]`, `imageUrl` |
| **quote** | citat mare centrat (social proof) | `quote`, `author`, `authorTitle` |
| **stat-grid** | 4 cifre de impact | `title`, `stats:[{value,label}]`×4 |
| **closing-cta** | ultimul slide: pas concret + buton | `title`, `bullets[]`, `ctaLabel` |

Ex: `apply_slide_design(preset:"hero-image", content:{title:"Petreceri fără bătăi de cap", imageUrl:"https://…", imageObjectPosition:"50% 35%"})`.

**2. `compose_rich_slide(presentationId, type, title, blocks[], slideId?, …)`** — control TOTAL când preseturile nu ajung. Trimiți direct blocuri rich; tool-ul le validează (tip cunoscut + câmpuri obligatorii) + smart-defaults. `type`: `cover`(hero)/`info`/`pain`/`solution`/`proof`/`closing-cta`.

**3. `set_slide_background_image(presentationId, slideId, imageUrl, objectPosition?)`** — pune/înlocuiește poza hero pe un slide existent (o mută pe prima poziție → fundal full-bleed pe cover, lateral pe restul).

### Cele 18 blocuri rich (forma JSON)
`heading{level:1|2|3, text}` · `text{text, size, emphasis:muted|highlight|danger|success, align}` · `image{src, aspectRatio:"16:9"|"4:3"|"1:1", rounded, objectPosition, caption}` · `kpi{value, label, delta:{value,positive}, color, animated}` · `bullets{items[], icon:check|arrow|dot|number|star|x, color}` · `comparison{left:{title,items[],icon,color}, right:{…}, steppedReveal}` · `stat-grid{stats:[{value,label}], columns:2|3|4}` · `quote{quote, author, authorTitle, style:card|minimal|pullquote}` · `cta{label, action:next-slide|schedule|contact, variant}` · `proof-card{proofId, style}` · `objection-card{objectionId, style}` · `calc-ref{calculationId, layout}` · plus chart/video/embed/timeline/divider/spacer. (⚠ `timeline.steps[].icon` și `stat-grid.stats[].icon` NU se randează — nu le pune.)

### ⭐ REGULI de DESIGN premium (ca slide-urile să fie „WOW", nu plate)
- **1 idee per slide.** Un slide = un singur mesaj. 2 idei → 2 slide-uri.
- **Hero = imagine + overlay + 1 titlu mare.** Pentru intro/secțiuni: `apply_slide_design(preset:"hero-image")`. Mereu cu `imageUrl` (fără poză, hero-ul cade pe gradient — mai slab). Max 3-4 bullete scurte.
- **KPI: cifră MARE, label MIC.** O singură cifră dominantă (`bold-stat`), `animated`. Label ≤ 5 cuvinte. Niciodată 4 KPI-uri + text lung pe același slide.
- **comparison vs bullets:** `split-compare` (Înainte/După, `steppedReveal`) când arăți TRANSFORMAREA durere→soluție; `bullets` pentru o listă simplă de beneficii. Nu pune comparison ca 2 liste fără tensiune.
- **Paletă o singură dată.** Setează `theme` (preset + `primary`/`accent` din brand) o dată; lasă blocurile fără `color` explicit ca să moștenească brandul. Maxim 1 accent dominant. **Preset-uri premium 2026:** `onyx-gold`, `vibrant-gradient`, `editorial-noir`, `deep-emerald`, `sapphire-executive` (+ cele clasice — `list` prin TemaEditor).
- **Vocabular care arată premium** (din gold-standard): `heading + image + (bullets|comparison|kpi|stat-grid) + quote`. **Evită** `timeline/chart/embed/divider/spacer` — gold-standardul aproape nu le folosește.
- **Imagine mereu** `rounded` + `aspectRatio` corect. De unde URL: `browse_brand_media(brandId)` (biblioteca brandului), upload în aplicație, sau URL public extern. Prin MCP setezi DOAR URL-ul.
- **Workflow:** `apply_slide_design` per slide → `check_presentation_health` → deschizi Chrome pentru Preview (arăți rezultatul, nu doar „tool success").

---

## ⚠ libraryOverride — dureri / soluții / discovery / dovezi / obiecții / calcule
Aici trăiesc durerile (`pains`), soluțiile (`features`), întrebările discovery (`questions`), dovezile (`proofs`), obiecțiile (`objections`), calculele (`calculations`). Forma:
```json
{ "pains": [ { "id":"pain_x", "title":"...", "description":"...", "addressedByFeatures":["feat_x"], "importance":"high", "tags":"..." } ],
  "features": [ { "id":"feat_x", "name":"<nume-beneficiu>", "description":"...", "addressesPains":["pain_x"], "valueProps":["..."], "kpis":[{"value":"55%","label":"...","color":"green"}], "media":[{"type":"image","url":"...","caption":"..."}], "walkthrough":{...} } ],
  "questions": [ { "id":"q_x", "text":"...", "type":"single", "options":[{"id":"opt","label":"..."}], "painTriggers":[ /* aceeași formă ca la introFields */ ] } ],
  "proofs": [...], "objections": [...], "calculations": [...] }
```
Maparea durere↔soluție e bidirecțională: `pain.addressedByFeatures=[feat]` + `feature.addressesPains=[pain]` (ideal 1:1).

**De ce NU editezi biblioteca prin `patch_presentation(libraryOverride)`:** orice răspuns MCP peste **~80.000 de caractere se TRUNCHIAZĂ** (vezi `dataOmitted` / „TRUNCAT"). Biblioteca gold-standard `symbai_horeca_2026` (zeci de dureri, soluții, întrebări discovery, dovezi, obiecții și calcule, cu walkthrough-uri bogate) depășește mult pragul → `get_presentation(section:"library")` **nu o poate returna întreagă** — deci nu o poți citi → modifica → re-trimite integral pentru o singură schimbare. Pentru asta există **tool-urile GRANULARE** de mai jos: fac read-modify-write pe UN element, server-side, fără să cari toată biblioteca. (Pe biblioteci mici — un vertical clonat — secțiunea poate încăpea sub 80k și atunci merge și `save_presentation`.)

### Editare per-item prin MCP — 5 tool-uri granulare (recomandat pentru dureri/soluții/discovery)
`kind` ∈ `pain` / `feature` (soluție) / `question` (discovery) / `proof` / `objection` / `calculation`.
- **`list_presentation_library_items(presentationId, kind, search?)`** — listă SLIM (doar id + etichetă, + `addressedByFeatures`/`addressesPains` la dureri/soluții). Așa afli ce id-uri există fără payload mare. ÎNCEPE de aici.
- **`get_presentation_library_item(presentationId, kind, itemId)`** — UN element întreg (mic). Vezi forma curentă înainte de patch.
- **`patch_presentation_library_item(presentationId, kind, itemId, patch)`** — merge superficial pe UN element (fiecare cheie din `patch` înlocuiește cheia de pe element; `id` imuabil). Ex: schimbi `title`-ul unei dureri, `addressedByFeatures` (soluțiile care o rezolvă), `painTriggers` ale unei întrebări, `media`/`kpis` ale unei soluții.
- **`add_presentation_library_item(presentationId, kind, item)`** — adaugă element NOU (id auto dacă lipsește). Se adaugă peste biblioteca de bază prin merge pe id — NU o șterge. ⚠ Dacă dai un `id` care există DEJA în biblioteca de bază (nu în override), îl **suprascrii** (nu adaugi unul nou); la șabloane clonate override-ul conține tot, deci primești eroare de „id duplicat" — pe care o eviți alegând alt id.
- **`remove_presentation_library_item(presentationId, kind, itemId)`** — șterge un element. ⚠ Referințele orfane NU sunt mereu inofensive: un `painId` orfan într-un `painTrigger` e ignorat tăcut, DAR un `painId` orfan în `typologies.dominantPains` face durerea-fantomă să fie singurul „candidat" → deck gol. După orice ștergere, curăță id-ul din `dominantPains`/`addressedByFeatures`/`painTriggers`/`flowV2.calculation.calculationId`.

Rețetă „leagă o durere de o soluție": `list_presentation_library_items(kind:"pain")` → iei painId → `list_presentation_library_items(kind:"feature")` → iei featId → `patch_presentation_library_item(kind:"pain", itemId:painId, patch:{addressedByFeatures:["featId"]})` (+ opțional invers pe feature `addressesPains`). Rețetă „durere cu răspunsuri multiple legate de dureri": `add_presentation_library_item(kind:"question", item:{text, type:"single", options:[{id,label}], painTriggers:[{mode:"direct",painId,intensityWhenMet,whenAnswerEquals:"<optId>"}]})`.

**Alternative tot prin MCP:** discovery-cu-dureri se poate face și pe **`introFields`** (cheie mică, se citește/scrie integral) — câmpurile intro `select` au EXACT același `painTriggers` ca discovery. Pentru un **vertical NOU cu bibliotecă mică** (`sala_evenimente`/`catering`/...), `get_presentation(section:"library")` poate încăpea sub limită → atunci o poți edita și re-pune cu `save_presentation`.

---

## Construiește un vertical NOU de la zero — ORDINEA OBLIGATORIE (id-uri coerente)

Cazul real (parc, sală, hotel): clonezi gold-standard ca STRUCTURĂ, dar conținutul lui e HoReCa. Toate piesele se referă una la alta prin **id-uri** (o tipologie listează `dominantPains:[painId]`, o durere listează `addressedByFeatures:[featId]`, o întrebare are `painTriggers:[{painId}]`). Dacă rescrii o piesă cu id nou dar lași referința veche, legătura se rupe TĂCUT (vezi cauza #5). De aceea construiești **în ordinea grafului**, de la frunze spre rădăcină, și verifici coerența la final:

1. **Soluții (features) întâi** — `add_presentation_library_item(kind:"feature", item:{id:"feat_petreceri_copii", name:"<nume = beneficiu>", description, valueProps:[...], addressesPains:[]})`. (`addressesPains` îl completezi la pasul 3, după ce există durerile.) Numele = beneficiul, nu termenul tehnic.
2. **Dureri** — `add_presentation_library_item(kind:"pain", item:{id:"pain_capacitate_haos", title:"<fraza pe care o spune prospectul>", description, addressedByFeatures:["feat_petreceri_copii"], importance:"high"})`. Fiecare durere TREBUIE să aibă ≥1 feature în `addressedByFeatures` (altfel dispare tăcut).
3. **Leagă invers** soluția de durere — `patch_presentation_library_item(kind:"feature", itemId:"feat_petreceri_copii", patch:{addressesPains:["pain_capacitate_haos"]})`. Maparea ideală 1:1 (o durere ↔ o soluție).
4. **Întrebări discovery** — `add_presentation_library_item(kind:"question", item:{text, type:"single", options:[{id:"opt_a",label}, ...], painTriggers:[{mode:"direct", painId:"pain_capacitate_haos", intensityWhenMet:9, whenAnswerEquals:"opt_d"}]})`. `painId` TREBUIE să fie unul din durerile create la pasul 2.
5. **Tipologii** — `patch_presentation(patch:{typologies:[...]})` cu fiecare tipologie având `dominantPains:["pain_capacitate_haos", ...]` (= NOILE id-uri!) + `recommendedFeatures`/`recommendedProofs` la fel + reguli de detecție (vezi forma mai jos). **Aici se rupe cel mai des** — dacă lași `dominantPains` HoReCa, durerile tale nu se admit niciodată (deck gol).
6. **Dovezi & Obiecții** — `add_presentation_library_item(kind:"proof"/"objection", ...)` cu `forPains`/`addressedByPains` pe NOILE id-uri + `cities` pe orașele owner-ului.
7. **Calcule** — `add_presentation_library_item(kind:"calculation", item:{...})` (forma mai jos), apoi leagă în flux: `patch_presentation(patch:{flowV2:{..., calculation:{enabled:true, calculationId:"<noul id>"}}})`. Calc-ul HoReCa clonat rămâne orfan dacă nu-l înlocuiești.
8. **Ofertă + Temă + Flux** — `offers[]` de la zero (verticalele au 0), `theme`, `flowV2` (ce pași, câte dureri/dovezi).

**✅ Checklist de COERENȚĂ id (rulează-l înainte să declari gata):** fiecare `painId` din `typologies.dominantPains` + din `painTriggers` EXISTĂ în `pains`; fiecare durere are `addressedByFeatures` ne-gol cu `featId`-uri existente; `flowV2.calculation.calculationId` EXISTĂ în `calculations`; painTriggers-ele wishlist-ului (dacă ai pornit Tranziția) sunt relegate. (Vezi „Verificare DOAR prin MCP" mai jos.)

### Forma unei TIPOLOGII (ca să detecteze ceva — altfel personalizare moartă)
```json
{
  "id": "tip_familie_petreceri", "name": "Familie cu copii — petreceri", "vertical": "parc",
  "keyMessage": "Petrecere fără bătăi de cap, copii fericiți",
  "axes": { "businessModel": "petreceri_private" },          // setezi aceeași axă prin autoDeriveRules din intro
  "detectionThreshold": 1,
  "weightedDetectionRules": [
    { "id": "r_aniversare", "label": "Vine pentru aniversare", "weight": 3,
      "conditions": [ { "fieldId": "q_scop_vizita", "op": "eq", "value": "opt_aniversare" } ] }
  ],
  "dominantPains": ["pain_capacitate_haos", "pain_fara_pachete"],   // NOILE id-uri — POARTA durerilor
  "recommendedFeatures": ["feat_petreceri_copii"],
  "predictedObjections": ["obj_pret"], "recommendedProofs": ["proof_local"]
}
```
Forma unei condiții: `{ fieldId, op, value }` — `fieldId` = id-ul întrebării (răspunsul ei) sau `axis.<axă>`/`typology`/`lead.deal.<câmp>`; `op` ∈ `eq`/`neq`/`in`/`notEmpty`/`empty`; `value` = id-ul OPȚIUNII alese (nu eticheta). Fiecare regulă satisfăcută adună `weight`; fiecare axă care se potrivește = +1; câștigă scorul MAX peste `detectionThreshold`. **Calea cea mai simplă:** mapează un câmp intro pe o axă prin `autoDeriveRules` (`{id,label,targetAxis,derive:{path,source:"answer",mapping:[{op:"eq",value,result}],defaultValue}}`) + pune aceeași axă pe tipologie în `axes` — fără reguli complexe.

### Forma unui CALCUL nou (comparative-list — cel mai folosit)
```json
{ "id": "calc_costuri_parc", "kind": "comparative-list", "title": "Cât te costă acum haosul de rezervări",
  "currentCostOnly": false,                                  // true = ascunde prețul Symbai (faza „doar costul actual")
  "placement": "before-offer",                              // sau "after-offer"
  "symbaiCost": 99, "symbaiCostCurrency": "EUR", "symbaiEurRate": 5,
  "symbaiRevenuePercent": 0.2, "revenueEstimateLabel": "Estimat vânzări lunare",
  "revenueEstimateDefault": 200000, "revenueEstimatePeriod": "month",
  "categories": [ { "id": "cat_apps", "icon": "📋", "label": "Aplicații separate",
    "suggestions": [ { "name": "Soft rezervări", "estimatedCost": 200 } ] } ] }
```
Apoi `flowV2.calculation = { enabled:true, calculationId:"calc_costuri_parc" }`. (Formula matematică: `kind:"formula"` cu `inputs:[{key,sourceKey,defaultValue,label}]` + `formula` + `outputTemplate` — inputurile iau cifrele din răspunsuri prin `sourceKey`.)

Explicație user-facing pentru exemplul de mai sus: „La 200.000 lei vânzări estimate/lună, costul e 99€ × 5 = 495 lei fix + 0,2% × 200.000 = 400 lei, deci 895 lei/lună." Nu prezenta procentul ca taxă ascunsă; arată formula pe slide.

### Întrebarea-ancoră (pusă MEREU)
Nu are buton în UI — se setează prin MCP: pune `"discoveryAnchor": true` pe întrebarea-pilon (de regulă cea de profit/financiară). Ea e exceptată de la dedup și apare la fiecare prospect.

## Ce poți pune la FIECARE răspuns (combinatorica — asta dă prezentarea „vie")

Pe **o opțiune de răspuns** (la o întrebare discovery; intro fields acceptă doar painTriggers) poți atașa, separat sau combinat:

| Atașezi | Câmp | Ce face | Când |
|---|---|---|---|
| **Durere** (3 moduri) | `painTriggers:[{mode,painId,intensityWhenMet,whenAnswerEquals}]` | aprinde/gradează o durere: 🎯`direct`=MAX, ➕`boost`=SUMĂ(±), 🔍`potential`=max 4 | mereu (mecanismul central) |
| **Reveal** | `reveal:{text, imageUrl, position, size, colors}` | text/imagine de impact PESTE slide-ul curent | reacție scurtă pe loc |
| **Trece automat** | `autoAdvance:true` | sare direct la următorul slide după alegere | la răspunsul „rezolvat" (nimic de vândut) |
| **Slide separat** | `followUpSlide:{...}` (vezi secțiunea de sus) | un SLIDE ÎNTREG educațional după întrebare | mini-pitch / fluxuri educaționale |

Și **întrebarea/slide-ul întreg** poate avea condiție de vizibilitate (`visibleWhen`/`skipIf`) ca să apară doar pentru anumite profiluri. Tipuri de slide pe care le poți pune: `info` (conținut bogat — 18 blocuri: heading/text/kpi/comparison/bullets/image/chart/timeline/cta...), `question` (discovery + wishlist multiselect), pereche durere+soluție (din bibliotecă, prin Flux), calcul, dovadă, ofertă. Slide-urile statice de tip `info`/`question` se adaugă în `slides[]`; perechile durere/soluție/calc/dovadă/ofertă vin din bibliotecă, controlate din `flowV2`.

## Verifică coerența DOAR prin MCP (când n-ai Chrome, înainte de Preview)
**Cel mai simplu: `check_presentation_health(brandId, presentationId)`** (read-only) — un singur apel care prinde toate cele 5 cauze tăcute de „deck plat" (id-uri orfane: painId/dominantPains/calculationId; durere fără soluție; placement-mismatch; count>conținut; ofertă lipsă) și întoarce `warnings[]` + diagnostic per pas de flux (ce e activ, ce id referă, dacă există). **Rulează-l ÎNAINTE de a declara prezentarea gata** — dacă `healthy:true`, în Preview o să vezi tipologie detectată + dureri + deck plin.

(Bonus: `patch_presentation`/`save_presentation`/`setup_two_phase_calculation` întorc deja `warnings[]` la fiecare scriere — deci prinzi orfanii pe loc.) Manual, dacă vrei să verifici singur: (1) `list_presentation_library_items(kind:"pain")` → `painId`-urile existente; (2) `get_presentation(section:"typologies")` → fiecare `dominantPains` ⊆ ele; (3) fiecare durere cu `addressedByFeatures` ne-gol; (4) `get_presentation(section:"flow")` → `diagnostics[]` arată calc enabled + id existent; (5) fiecare `painTrigger.painId` ∈ painId-uri.

---

## Loop-ul „arată în Chrome" (după ce ai pus JSON-ul)
1. `gaseste_in_aplicatie("configurare prezentare")` → linkul (`/settings/sales-crm?tab=presentation`).
2. În pagină: **selectează unitatea brandului** pe care ai construit (selectorul de sus se resetează la reload — re-selectează-l) → tab **Configurare prezentare** → click pe prezentarea ta în lista din stânga.
3. **Schimbă tab-urile de secțiuni** (Flux ✨ / Intro / Discovery / Dureri / Soluții / Tipologii / Tema / Calcule / Obiecții / Dovezi / Oferte / Preview) ca să arăți fiecare parte. Badge-urile confirmă patch-ul: „Intro (10)", „Dureri (14)", 💔 N pe un câmp = N dureri legate.
4. **Preview** = rulează prezentarea pe datele draft (alegi un Test preset) → vezi tipologia detectată + nr. slide-uri + „library efectivă: N pains · N features · N proofs". Cel mai bun mod de a dovedi că totul s-a legat — fără să rulezi în fața unui prospect real.

## Flux complet de exemplu (un client nou, dintr-o suflare)
```
list_brands → brandId
list_presentation_templates → alegi cheia (gold standard sau verticala apropiată)
create_presentation_from_template(brandId, title, templateKey, introTitle, introDescription, vertical) → pres_id
get_presentation(section:"theme") ; patch_presentation(patch:{theme})        // brandul tău
get_presentation(section:"intro") ; patch_presentation(patch:{introFields})  // întrebări + dureri
get_presentation(section:"offers"); patch_presentation(patch:{offers})       // pachetele tale
get_presentation(section:"flow")  ; patch_presentation(patch:{flowV2})       // ce pași/câte elemente
→ editări fine per-durere/soluție/întrebare = tool-urile GRANULARE (patch/add_presentation_library_item)
→ verifici coerența id prin MCP, apoi deschizi Chrome pentru Preview (tipologie + deck plin)
```

## Cross-link
- Concept + metodologie + tiparul transferabil → `prezentare-vanzare.md`. Referința de câmpuri din UI → `prezentare-vanzare-campuri.md`. Skill: `construieste-prezentare`. CRM de unde se lansează/rulează → `crm-vanzari-pipeline.md`.
