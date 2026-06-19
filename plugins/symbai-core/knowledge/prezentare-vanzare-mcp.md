# Prezentare de Vânzare — Construcție prin MCP (referință JSON)

> Anexă la `prezentare-vanzare.md` + `prezentare-vanzare-campuri.md`. Aici e CUM construiești o prezentare **prin conexiune (MCP), completând JSON** — nu clicând în UI. `campuri.md` = ce câmpuri există (vederea din UI); ACEST fișier = cum le scrii prin tool-uri. Folosește-l când vrei să faci o prezentare „dintr-o suflare", fără zeci de click-uri.

## Regula de aur a construcției prin MCP
**Scaffold + datele „grele" prin MCP (completezi JSON), apoi ARĂȚI rezultatul în Chrome schimbând tab-urile.** Nu te chinui să dai click pentru fiecare câmp — pui JSON-ul printr-un `patch_presentation`, apoi navighezi în pagină DOAR ca să-i arăți userului ce-a ieșit (și ca să rulezi Preview-ul în fața lui).

## Cele 6 tool-uri (recap)
- `list_presentation_templates()` — șabloane de pornit (`symbai_horeca_2026` = gold standard, +6 verticale).
- `list_presentations(brandId)` — ce există pe brand.
- `get_presentation(brandId, presentationId, section?)` — CITEȘTE. `section`: `summary`(default)/`intro`/`slides`/`offers`/`theme`/`flow`/`typologies`/`library`/`full`. **Citește secțiunea ÎNAINTE de a o modifica** (patch înlocuiește cheia întreagă — ai nevoie de conținutul curent ca să nu pierzi nimic).
- `create_presentation_from_template(brandId, title, templateKey? | fromPresentationId?+fromBrandId?, introTitle?, introDescription?, vertical?)` — clonează. Primești un id nou (`pres_xxx`).
- `patch_presentation(brandId, presentationId, patch:{...})` — modifică una sau mai multe **chei top-level**.
- `save_presentation(brandId, presentation)` — UPSERT config COMPLET (construire de la zero / înlocuire integrală).

## ⚠ Trei reguli care te scapă de bug-uri
1. **Patch = înlocuire de cheie, NU merge adânc.** `patch:{theme:{...}}` înlocuiește TOT obiectul `theme`; `patch:{introFields:[...]}` înlocuiește TOT array-ul. Deci: `get_presentation(section)` → modifici obiectul în memorie → trimiți cheia **întreagă** înapoi. Dacă trimiți doar o parte, pierzi restul.
2. **Patch-urile se fac SECVENȚIAL, nu în paralel.** Persistența e un singur câmp jsonb (`brands.crmSettings.presentations`) cu read-modify-write last-writer-wins. Două `patch_presentation` în paralel se pot suprascrie. Fă-le unul după altul.
3. **Validare structurală la scriere.** `patch`/`save` resping config corupt (ex. `theme:"text"`, `offers:{}` în loc de array) ÎNAINTE de scriere — dacă răspunsul zice `rejected`, ai greșit forma cheii.

## Cele 18 chei top-level (ce poți pune prin patch_presentation)
`title, introTitle, introDescription, vertical, theme, offers, flowV2, flowVersion, introFields, slides, typologies, slideRules, autoDeriveRules, libraryOverride, stages, maxPainSlides, maxCalculationSlides, debugMode`.

**Ușoare (mici → le pui direct prin MCP, ideal):** `title/introTitle/introDescription/vertical` (string-uri), `theme`, `offers`, `flowV2`, `introFields`, `typologies`, `autoDeriveRules`, `slides`.
**Grea (vezi secțiunea libraryOverride):** `libraryOverride` (dureri/soluții/discovery/dovezi/obiecții/calcule — poate fi sute de KB).

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
    { "id": "see_profit", "label": "📊 Să văd profitul real pe canal / locație" },
    { "id": "one_app",    "label": "🧩 Să nu mai jonglez cu mai multe aplicații" }
  ],
  "painTriggers": [
    { "mode": "direct", "label": "Prioritate: profit pe canal", "painId": "pain_channel_profit_unknown", "intensityWhenMet": 8, "whenAnswerEquals": "see_profit" },
    { "mode": "direct", "label": "Prioritate: o singură aplicație", "painId": "pain_softs_zoo", "intensityWhenMet": 8, "whenAnswerEquals": "one_app" }
  ]
}
```

### painTrigger — mecanismul răspuns→durere (același la introFields ȘI la discovery questions)
- `mode: "direct"` — 🎯 **Sigură**: durerea intră garantat. Câmp: `intensityWhenMet` (1–10). (la scoring: MAX cu alte semnale directe)
- `mode: "boost"` — ➕ **Scor ±**: răspunsul mărește/micșorează intensitatea unei dureri (−10..+10). (la scoring: SUM)
- `mode: "potential"` — 🔍 **De confirmat**: semnal slab (max ~4), durerea apare doar dacă alte răspunsuri o întăresc.
- Țintirea răspunsului: `whenAnswerEquals: "<option.id>"` (sau `whenAnswerNotEquals` pentru „dacă NU alege").
- **`painId` trebuie să existe în bibliotecă** — altfel e ignorat tăcut (fără efect, fără eroare). Verifică numele rulând Preview și uitându-te la badge-ul 💔 N pe câmp + la titlul durerii care apare sub răspuns.
- ⚠ Pentru `boost`/`potential` cheia numerică exactă o vezi cel mai sigur clonând o întrebare existentă cu `get_presentation` — în 90% din cazuri folosești `direct`.

Patch: trimite TOT array-ul (cele existente + ce adaugi). Citește întâi cu `get_presentation(section:"intro")`.

---

## SLIDE SEPARAT după un răspuns de discovery → `followUpSlide` (pe o opțiune) ✅ NOU (2026-06-19)
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
    "cardStyle": "spotlight",                        // "minimal" | "glass" | "gradient" | "spotlight"
    "ribbon": { "text": "BEST VALUE", "gradient": "linear-gradient(90deg,#8b5cf6,#d946ef)" },
    "description": "...", "highlights": ["...", "..."],
    "features": ["...", "..."],
    "recommendedForTypologies": ["cafenea_bar", "pizzeria"]
  }],
  "addons": [{ "id": "addon_x", "name": "...", "price": 18, "billingPeriod": "month", "category": "Storage", "description": "..." }]
}]
```

## FLUX → `flowV2` (CONFIRMATĂ — povestea: ce pași sunt activi + câte elemente)
```json
{
  "showIntro": true,
  "discovery":   { "enabled": true, "maxQuestions": 6 },
  "transition":  { "enabled": true },
  "solutions":   { "enabled": true, "count": 3 },               // câte perechi durere+soluție în deck
  "calculation": { "enabled": true, "calculationId": "calc_softs_savings" }, // ⚠ enabled:true ALTFEL calculatorul NU apare
  "objections":  { "enabled": true },
  "proofs":      { "enabled": true, "count": 2 },               // dovezi pe oraș/tipologie — lever mare de conversie
  "offer":       { "enabled": true },
  "calculationAfterOffer": { "enabled": false, "calculationId": "calc_softs_savings_phase2" } // ✅ NOU: calcul DUPĂ ofertă (opt-in)
}
```
Notă: `stages[]` + `autoDeriveRules[]` sunt chei separate (le păstrezi neatinse când dai patch DOAR pe `flowV2`). `autoDeriveRules` derivă axele tipologiei din răspunsurile intro (ex. `business_type → businessSize`, `years_open → experience`) — formă: `{id,label,targetAxis,derive:{path,source:"answer",mapping:[{op:"eq",value,result}],defaultValue}}`.

### ⚠ „Nu se vede calculatorul" = `flowV2.calculation.enabled` e `false`
Cauza #1 când calculatorul lipsește din prezentare: pasul e OPRIT din flux. Repară: `get_presentation(section:"flow")` → setezi `enabled:true` (și un `calculationId` care există în `libraryOverride.calculations`) → `patch_presentation(patch:{flowV2:{...flux complet cu calculation.enabled=true}})`. (Patch = înlocuire de cheie → trimite TOT obiectul `flowV2`, nu doar `calculation`.) Verifică în Preview: trebuie să apară slide-ul de calcul.

### Calculator „costuri-întâi, comparație-după ofertă" ✅ NOU (2026-06-19)
Pe un calcul de tip **Listă cheltuieli** (`comparative-list`) ai 3 câmpuri noi (le pui per-calcul cu `patch_presentation_library_item(kind:"calculation", itemId, patch:{...})`):
- **`currentCostOnly: true`** — ascunde coloana „Cu Symbai" + prețul; arată DOAR cât plătește clientul ACUM (total lună/an/5 ani). Strategic: arăți costul lui actual ÎNAINTE de a-i spune prețul tău.
- **`placement: "before-offer" | "after-offer"`** — în ce etapă apare calculul. Lipsă/`before-offer` = înainte de ofertă (default). `after-offer` = doar în etapa nouă de după ofertă (trebuie ȘI `flowV2.calculationAfterOffer.enabled:true`).
- **`comparativeItemsFromCalculationId: "<id-calc-faza-1>"`** — calculul de fază 2 (după ofertă) **reia cheltuielile** pe care agentul le-a introdus LIVE în calculul de fază 1, și acum arată economia vs prețul Symbai. (1 nivel, nu urmărește lanțuri.)

**Rețeta cerută de clienți (calc înainte fără preț → ofertă → economie după):**
1. Faza 1 (before): un `comparative-list` cu `currentCostOnly:true`, `placement:"before-offer"` → arată „cât plătești acum".
2. Faza 2 (after): un AL DOILEA `comparative-list` cu `currentCostOnly:false`, `placement:"after-offer"`, `comparativeItemsFromCalculationId:"<id-faza-1>"` (preia aceleași cheltuieli) + `symbaiCost` setat → arată economia.
3. `flowV2.calculationAfterOffer = { enabled:true, calculationId:"<id-faza-2>" }`.
Cheltuielile introduse live în faza 1 supraviețuiesc până în faza 2 fără nimic de salvat (sunt în același runner).

⚠ **Recalc live**: dacă raportul e „cifrele nu se actualizează când adaug linii în calculator" — bug-ul de recalc a fost reparat pe 2026-06-19 (guard pe sume). Dacă persistă pe instanța clientului, e versiune veche → cere deploy.

## TIPOLOGII → `typologies[]` (segmentele + regulile de detecție)
Conceptual: `{ id, name, vertical, keyMessage, axes:{experience,businessSize,businessModel,techMentality,...}, detectionThreshold, detectionRules:[{label,weight,conditions}], dominantPains:[painId], recommendedFeatures:[featId], predictedObjections:[objId], recommendedProofs:[proofId], agentTips }`. Fiecare match de axă = +1; pragul implicit 1. Citește un exemplu cu `get_presentation(section:"typologies")` înainte de a edita.

## SLIDE-URI cu POZE → `slides[]` (slide-uri statice cu conținut bogat)
Slide-urile statice (intro discovery, tranziție, closing) folosesc blocuri de conținut bogat. Bloc imagine:
```json
{ "type": "image", "url": "https://...", "alt": "...", "aspect": "16:9", "rounded": true, "caption": "...", "focalPoint": {"x":50,"y":50} }
```
Alte blocuri (18 tipuri în campuri §9): heading, text, kpi, video, embed, chart, bullets, comparison, timeline, cta, divider, spacer, calc-ref, objection-card, proof-card, stat-grid, quote.
**De unde iau poza (URL):** (1) biblioteca media a brandului — `browse_brand_media(brandId)` întoarce URL-uri; (2) upload în UI (R2) și apoi copiezi URL-ul; (3) URL public extern. Prin MCP setezi DOAR URL-ul (nu poți încărca fișier de pe disc) — dacă biblioteca brand e goală, cere userului să încarce sau dă-i un URL.

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

**De ce NU editezi biblioteca prin `patch_presentation(libraryOverride)`:** biblioteca gold-standard `symbai_horeca_2026` are `libraryOverride` de **~300 KB** (14 dureri + 14 soluții + 15 discovery + 23 dovezi + 21 obiecții + 18 calcule, cu walkthrough-uri bogate). `get_presentation(section:"library")` **nu o poate returna întreagă** (depășește limita de payload) — deci nu o poți citi → modifica → re-trimite integral pentru o singură schimbare. Pentru asta există **tool-urile GRANULARE** de mai jos: fac read-modify-write pe UN element, server-side, fără să cari toată biblioteca.

### Editare per-item prin MCP — 5 tool-uri granulare (recomandat pentru dureri/soluții/discovery)
`kind` ∈ `pain` / `feature` (soluție) / `question` (discovery) / `proof` / `objection` / `calculation`.
- **`list_presentation_library_items(presentationId, kind, search?)`** — listă SLIM (doar id + etichetă, + `addressedByFeatures`/`addressesPains` la dureri/soluții). Așa afli ce id-uri există fără payload mare. ÎNCEPE de aici.
- **`get_presentation_library_item(presentationId, kind, itemId)`** — UN element întreg (mic). Vezi forma curentă înainte de patch.
- **`patch_presentation_library_item(presentationId, kind, itemId, patch)`** — merge superficial pe UN element (fiecare cheie din `patch` înlocuiește cheia de pe element; `id` imuabil). Ex: schimbi `title`-ul unei dureri, `addressedByFeatures` (soluțiile care o rezolvă), `painTriggers` ale unei întrebări, `media`/`kpis` ale unei soluții.
- **`add_presentation_library_item(presentationId, kind, item)`** — adaugă element NOU (id auto dacă lipsește). Se adaugă peste biblioteca de bază prin merge pe id — NU o șterge. ⚠ Dacă dai un `id` care există DEJA în biblioteca de bază (nu în override), îl **suprascrii** (nu adaugi unul nou); la șabloane clonate override-ul conține tot, deci primești eroare de „id duplicat" — pe care o eviți alegând alt id.
- **`remove_presentation_library_item(presentationId, kind, itemId)`** — șterge un element (atenție la referințe orfane — inofensive, dar curăță-le).

Rețetă „leagă o durere de o soluție": `list_presentation_library_items(kind:"pain")` → iei painId → `list_presentation_library_items(kind:"feature")` → iei featId → `patch_presentation_library_item(kind:"pain", itemId:painId, patch:{addressedByFeatures:["featId"]})` (+ opțional invers pe feature `addressesPains`). Rețetă „durere cu răspunsuri multiple legate de dureri": `add_presentation_library_item(kind:"question", item:{text, type:"single", options:[{id,label}], painTriggers:[{mode:"direct",painId,intensityWhenMet,whenAnswerEquals:"<optId>"}]})`.

**Alternative tot prin MCP:** discovery-cu-dureri se poate face și pe **`introFields`** (cheie mică, se citește/scrie integral) — câmpurile intro `select` au EXACT același `painTriggers` ca discovery. Pentru un **vertical NOU cu bibliotecă mică** (`sala_evenimente`/`catering`/...), `get_presentation(section:"library")` poate încăpea sub limită → atunci o poți edita și re-pune cu `save_presentation`.

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
→ deschizi Chrome, arăți tab-urile + rulezi Preview
→ editări fine per-durere/soluție pe bibliotecă mare = în UI
```

## Cross-link
- Concept + metodologie + tiparul transferabil → `prezentare-vanzare.md`. Referința de câmpuri din UI → `prezentare-vanzare-campuri.md`. Skill: `construieste-prezentare`. CRM de unde se lansează/rulează → `crm-vanzari-pipeline.md`.
