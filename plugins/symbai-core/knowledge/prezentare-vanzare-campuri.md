# Prezentare de Vânzare — Referință COMPLETĂ de câmpuri (toate editabile din UI)

> Anexă la `prezentare-vanzare.md`. Aici e lista EXHAUSTIVĂ a câmpurilor pe care le poate seta proprietarul în editorul de prezentări (Setări → CRM → Configurare prezentare). **Construcție HIBRIDĂ: multe câmpuri se pot seta și prin MCP** (completând JSON — vezi **`prezentare-vanzare-mcp.md`** pentru formele JSON exacte și ce cheie top-level acoperă fiecare tab); restul, plus editarea vizuală fină + Preview + rularea, se fac din **interfață** cu extensia Chrome (`claude-in-chrome`) + user logat. Regula hibridă: cheile „mici" (intro/temă/ofertă/flux/tipologii) le pui rapid prin MCP; editarea per-item pe biblioteci mari (dureri/soluții/discovery din gold-standard — `libraryOverride` de sute de KB) o faci în UI. **Regulă: dacă userul îți cere ORICE câmp de mai jos, îl poți seta** — prin MCP dacă e o cheie acoperită, altfel navighează la tabul potrivit și completează-l. Singurele excepții sunt în secțiunea „⚠ Câmpuri legacy" (există în date, dar NU au control în UI — nu le promite).

Convenții valoare: `text` (scris liber) · `nr` (numeric) · `on/off` (comutator) · `listă` (alegere dintr-un set) · `culoare` (hex/selector) · `formulă` · `imagine` (URL sau Upload) · `chips` (multi-selecție on/off).

**Antet / ecran de start** (sus, peste taburi): **Nume prezentare** · **Titlu ecran de start** · **Subtitlu ecran de start** (ce vede prospectul) · **Imagine ecran de start** (`coverImageUrl` — URL, fundal peste degrade) + **Focalizare** (`coverImageObjectPosition`, ex „50% 30%") · **Domeniu de activitate**. ✅ controale în tabul de configurare al prezentării; setabile și prin `patch_presentation`.

---

## 1. INTRO — un câmp din formularul de start
- **Etichetă** (ce vede agentul) `text` · **Cheie tehnică** `text` (litere/cifre/`_`; auto din etichetă; buton „↻ Regenerează"; validare goală/duplicat/format).
- **Tip input** `listă`: Text scurt · Număr · Text lung · Listă opțiuni · Dată calendaristică · 🎉 Tip eveniment/rezervare (carduri cu tipurile CRM → aduce produse + șablon contract + capabilități).
- **Placeholder** `text` · **Obligatoriu** `on/off`.
- **Sursă auto-import din lead** `listă`: Manual · Client nume/companie/email/telefon · Lead titlu/tip eveniment/dată/nr invitați/adulți/copii/valoare/sursă.
- (la tip „Listă opțiuni") **Opțiuni dropdown** — fiecare cu **Etichetă variantă** `text` + panou „💔 dureri" (vezi §4).
- Quick-add: chips (Nume/Contact/Email/Telefon/Invitați/Dată/Buget/Observații), „Setup rapid Symbai (8 câmpuri)", „Câmp gol".

## 2. DISCOVERY — o întrebare
**Tipuri de întrebare** `listă` (4 categorii):
- Alegeri: Alegere unică · Alegeri multiple · Alegere cu imagini · Dropdown · Clasificare (drag-and-drop).
- Evaluare: Rating stele (1–10 + iconiță) · NPS 0–10 · Scală 1–10 · Scală de opinie (min/max + etichete) · Emoji (5) · Da/Nu.
- Text: Text liber · Număr · Email · Telefon.
- Date/Info: Dată (min/max) · Statement (card info, fără input).

Câmpuri întrebare: **Text întrebare** `text` · **Hint** `text` · **Cheie tehnică** `text` · **Kicker/eyebrow** `text`.
- **Cine vede întrebarea** = condiții (§5) + presets „Doar la <tipologie>/<tip eveniment>". · **Pe ecran vs Doar telefon** (`coachOnly`) se setează în tabul **Flux → pasul 2 Întrebări** (per întrebare), nu aici. · **întrebare-ancoră** (`discoveryAnchor` — mereu inclusă, exceptată de la dedup) NU are buton în UI: se setează doar prin **MCP/șablon** (vezi §„legacy/doar prin MCP").
- **Axa tipologie** `listă`: Fără / Experiență / Mărime / Model / Mentalitate tech / Durere principală / Buget / Vertical.
- **Slide vizual înainte de întrebare** `on/off` → editor conținut bogat (§9). **Media**: URL/Upload (max 5MB) + **Focalizare/crop** + **Layout** `listă`: Sus/Jos/Fundal/Stânga/Dreapta.
- Config pe tip: Rating (nr items, iconiță ⭐/❤️/👍/⚪) · Da/Nu (label Da/Nu) · Scală opinie (min/max/label stânga/dreapta) · Dată (min/max) · Statement (corp + iconiță) · Emoji (set 5) · Alegere imagini (permite selecție multiplă + poză/opțiune).
- **Asignează dureri din răspuns** (la numerice/text): durere + „când răspunsul e" (`≥`/`≤`/text) + mod 🎯/🔍/➕ + intensitate 1–10 + notă.

## 3. OPȚIUNE de răspuns
- **Etichetă** `text` (chip A/B/C/D) · **Cheie tehnică** `text` (în Avansat; la redenumire legăturile de durere se mută singure).
- (Alegere cu imagini) **URL/Upload imagine** + **Focalizare**.
- (icon-cards) **Iconiță** `listă` (set Lucide) · **Descriere** `text` · **Poză card** `imagine` (`imageUrl`) + **Focalizare** (`imageObjectPosition`, ex. `50% 35%`). În wishlist, poza apare full-bleed pe card cu overlay și hover/lift; fără poză, cardul rămâne pe gradient + icon.
- **🖥 Pe ecran când e ales** (reveal): **Text** `text` (suportă `{cheie}`) · **Unde apare** `listă` (Auto/Peste poză centrat/Peste poză jos/Sub întrebare/Sub răspunsuri) · **Mărime** S/M/L/XL · **Culoare text** `culoare` · **Culoare fundal** `culoare` · **Poză la alegere** URL/Upload + focalizare · **⏭ Direct mai departe** `on/off`.
- **🖼 Slide separat după răspuns** (followUpSlide — DIFERIT de reveal: un slide ÎNTREG dedicat, nu text pe slide-ul curent): **Activ** `on/off` · **Kicker** `text` (`{cheie}`) · **Titlu** `text` · **Text** `text` · **Bullete** (Text + **Iconiță** Lucide) · **Poză** URL/Upload + **Focalizare** · **Layout** `listă` (Poză fundal/Poză laterală/Plin pe culoare) · **Culoare accent** `culoare`. Apare imediat ce clientul alege răspunsul → buton „Mai departe" la întrebarea următoare. Doar pe întrebări Discovery (nu Intro).
- **💔 Ce dureri semnalează** (vezi §4).

## 4. Legare răspuns → durere (panoul „💔 dureri", la Intro/Discovery/wishlist)
Pentru fiecare durere atașată unui răspuns: **Durerea** `listă` · **Efect** `listă` 3 niveluri: **🎯 Sigură** (intensitate 1–10) / **➕ Scor ±** (−10..+10, + indică, − atenuează) / **🔍 De confirmat** (slab, max 4) · **Valoare/intensitate** `nr` (cu −1/+1). Plus **+ Avansat: dureri dacă NU alege** (⛔ — aceleași câmpuri, declanșate la orice altă variantă).

## 5. CONDIȚIE (face un slide/întrebare/pas să apară sau nu) — combinate cu ȘI
**Câmpuri comparabile** `listă` (dropdown cu căutare + categorii): Întrebări Intro · Date client lead (Prenume/Nume/Nume complet/Companie/Email/Telefon) · Date deal lead (Titlu/Tip eveniment/Dată/Invitați/Adulți/Copii/Valoare/Sursă) · Răspunsuri întrebări · Preset wizard (Experiență/Mărime/Model/Mentalitate/Buget/Vertical) · Axe typology · Typology detectat · 🎯 Reacții agent (durere confirmată/critică, reacție feature/calcul/dovadă, status closing/obiecție, engagement demo) · 🪄 Reacții la tratări obiecții · 🎉 Tip eveniment · Custom path.
**Operatori** `listă`: este egal / NU este egal · `<` / `≤` / `>` / `≥` / între (min–max) · este una din (multiple) · conține textul · are valoare / e goală.
**Valoarea**: dropdown / chips multi / două inputuri (între) / numeric / dată / text — adaptiv.

## 6. SMART FIELDS (variabile inserabile în texte ca `{cheie}` și folosibile în condiții)
Câmpuri Intro (`{cheie}`) · `lead.customer.*` (firstName/lastName/name/companyName/email/phone) · `lead.deal.*` (title/eventType/eventDate/guestCount/adultsCount/childrenCount/value/source) · `q_<id>` (răspunsuri) · `preset.*` · `axis.*` · `typology` · `eventType.*` · `observation.*` (reacții agent). `answer.`/`answers.` în față ≡ cheia simplă.

## 7. DURERE (tab Dureri)
- **Cover image** `imagine` · **Titlu** `text` · **Descriere emoțională** `text` · **Cod intern** (read-only) · **Tags** `text` (virgulă) · **Importanță** `listă`: Scăzută/Medie/Mare/Critică (decide ordinea).
- **Eticheta de pe slide** `text` (eyebrow-ul de deasupra titlului; default „Problema ta") · **Arată eticheta** `on/off` (debifează ca s-o ascunzi — utilă pentru operatori cu experiență, ca să nu sune acuzator). ✅ controale în tabul Dureri.
- **Soluții care REZOLVĂ** `chips` (bidirecțional) · **Tipologii unde e dominantă** `chips` · „Apare automat când răspunsul Discovery…" (read-only, se editează în Discovery).
- **Coach (doar agent)**: **Tips** / **Întrebări** / **Note** — liste de texte.
- Acțiuni tab: „Setup Symbai (6 dureri)", „Adaugă rapid" (chips presetate), „Durere custom", filtru pe importanță, căutare, reordonare drag.

## 8. SOLUȚIE / FEATURE (tab Soluții)
- **Cover image** `imagine` · **Nume soluție** `text` (numele-beneficiu) · **Descriere scurtă** `text` · **Cheie tehnică** `text` (editabilă) · **Tags** `text`.
- **Value Props** — listă de bullet-uri (text + mută sus/jos + șterge).
- **KPI Cards**: **Value** `text` (ex „55%") · **Label** `text` · **Color** `listă` blue/green/amber/rose/violet/fuchsia.
- **Galerie media**: **Tip** Imagine/Video · **Sursă** URL/Upload (img 10MB / video 50MB) · **Caption** `text`.
- **Walkthrough (Tur LIVE)**: **Activare** `on/off` · **Tip** `listă`: Tur ghidat LIVE / Iframe demo / Video / Pași cu poze · **Text buton START** `text` · **Auto-start** `on/off`. După tip: URL iframe / URL video / pași (titlu+screenshot+descriere) / „← Înapoi la prezentare".
  - **Pas tur ghidat**: Etichetă admin · URL țintă · Anchor CSS · Titlu · Descriere · Poziție `listă` (Centru/Sus/Jos/Stânga/Dreapta/4 colțuri) · Mărime SM/MD/LG/XL · Backdrop Dim/Blur/Fără · Padding spotlight `nr` 0–64 · Auto-next ms `nr`.
  - **Buton pas** (max 3): Text · Variant Primary/Secondary/Ghost/Danger · Action `listă` (Următor/Anterior/Sări N/Sări la pas/Închide/Deschide URL/Închide+navigare) + câmpuri condiționate (pas țintă / N / URL).
- **Dureri pe care le REZOLVĂ** `chips` · **Coach**: Tips/Întrebări/Note.

## 9. CONȚINUT BOGAT — toate cele 18 blocuri (slide vizual)
Fiecare bloc: drag reordonare, duplică, șterge. Interpolare `{{variabile}}` în Heading/Text/Quote.
1. **Heading**: Nivel H1/H2/H3 · Align · Text.
2. **Text**: Size S/M/L/XL · Emphasis Normal/Highlight/Danger/Success · Align · Text.
3. **KPI Card**: Value · Color (6) · Label · Delta (opțional) · Animate count-up `on/off`.
4. **Image**: imagine · Focal point (slidere Stânga/Sus + presets + Auto) · Alt · Aspect 16:9/4:3/1:1/Auto · Rounded `on/off` · Caption.
5. **Video**: video URL/Upload · Thumbnail · Caption · Autoplay.
6. **Embed (iframe)**: URL · Height `nr` · Caption.
7. **Chart**: tip Bar/Line/Pie/Donut · Titlu · puncte (Label+Value+Culoare hex).
8. **Bullets**: Icon ✓/→/•/123/⭐/✕ · Color (5) · Items (1/linie).
9. **Comparison (Before/After)**: **Dezvăluire în 2 pași** `on/off` · coloană stângă (Titlu/Items/Iconiță) · coloană dreaptă (idem).
10. **Timeline**: pași (Titlu + Status Done/Current/Upcoming + Descriere).
11. **CTA Button**: Label · Action Next/Schedule/Contact/External · Variant Primary/Outline/Secondary · Icon · URL extern.
12. **Divider**: Solid/Dashed/Dotted.
13. **Spacer**: S/M/L/XL.
14. **Calc-ref** (calcul din bibliotecă): Calculul · Layout KPI/Card/Inline · Color · Mărime · Label override.
15. **Objection-card**: Obiecția · Stil Q&A/Split/Speech bubbles.
16. **Proof-card**: Dovada · Stil Testimonial/Metric/Case study/Compact.
17. **Stat-grid**: Coloane 2/3/4 · statistici (Value+Label+Color).
18. **Quote**: Citat · Autor · Titlu/companie · Avatar URL · Stil Card/Minimal/Pullquote · Culoare accent (5).

## 10. TIPOLOGIE (tab Tipologii)
- **Nume** `text` · **Vertical** `text` · **ID tehnic** (read-only) · **Mesaj cheie** `text` (apare pe coperta segmentului; preview live).
- **Axe** (perechi cheie=valoare, „Adaugă axă"): **Experiență** (Începător/1-3/3-7/Veteran) · **Mărime** (food truck/mic/mediu/mare/lanț) · **Model** (dine-in/delivery/mixt/catering/events/hotel) · **Mentalitate tech** (conservator/basic/tech-savvy/visionary) · **Durere principală** (cash flow/delivery/stocuri/scalare/marketing) · **Buget** (mic/mediu/mare/enterprise) · **Vertical** (HoReCa/events/catering/cursuri/servicii/produse) + axe custom. Fiecare match = +1.
- **Prag detecție** `nr` 0–50 (implicit 1).
- **Reguli de detecție cu greutate**: Etichetă + **Greutate** `nr` −10..+10 + **Condiții** (§5).
- **Itemi legați** `chips`: Dureri dominante · Soluții recomandate · Obiecții prezise · Dovezi recomandate · Calcule relevante.
- Simulator „Test detection" (probă, nu setează).

## 11. DOVADĂ (tab Dovezi)
- **Cover image** `imagine` · **Sursă** `text` (client+oraș) · **Metric** `text` (cifra mare) · **Cheie tehnică** `text` · **Descriere case study** `text`.
- **Aplicabil pentru dureri** `chips` · **pentru features** `chips`.
- **Scoring „când apare"**: Match typology (+2.0) · Pain confirmed (+2.0/+1.5 critic) · Feature reacție (+1.5/−1.0) · Răspunde la obiecție vie (+2.5) · Pre-empt (+1.0) — toate `chips`; **Greutate intrinsecă** `nr` 0.0–3.0 · **Flagship** `on/off` (+1.0).
- **Slide vizual EXTRA** `on/off` → conținut bogat (§9).

## 12. OBIECȚIE (tab Obiecții)
- **Cod intern** (read-only) · **OBIECȚIA** `text` (ce spune clientul) · **COUNTER** `text` (răspunsul) · **Dureri care o ridică** `chips`.
- **Slide vizual** `on/off` → conținut bogat.
- **Tratări multiple** („Adaugă tratare"), fiecare: **Etichetă** `text` · **UNDE** `listă` (Oriunde/Discovery/Dureri/Soluții/Tur/Calcule/Dovezi/Închidere) · **CUM** `listă` (💡 Sugestie agent / 💬 Bullet peste slide / 📄 Slide dedicat / 🎯 Bullet în tur) · **Conținut** `text` · **Bullets** · **„Apare doar dacă…"** (condiții + presets chain pe reacția altei variante) · **Variante de reacție client** (✅/🤔/❌/❓ configurabile) · **Tur live ca răspuns** (feature + pas + buton).

## 13. CALCUL / ROI (tab Calcule)
- **Nume intern** `text` · **Cheie tehnică** `text` · **Titlu slide** `text`.
- **Tip** `listă` (4): **Formulă matematică** / **Listă cheltuieli** (comparativ live) / **Cost amânare** (slider) / **Payback period**.
  - Formulă: **Inputs** (Nume `{var}` + Cheie sursă din răspuns/intro + Default `nr` + Etichetă) · **Formulă** `formulă` (`+ - * / ( )`, `{var}`) · **Output template** (`{result}`) · **Body template**.
  - Listă cheltuieli: **Etichetă/Cost Symbai** + **Perioada** (RON lună/an) · **Orizonturi** (lună/an/3 ani/5 ani) · **Highlight cea mai mare economie** `on/off` · **Categorii** (Icon emoji + Etichetă + Hint + Sugestii [nume+cost]). **Doar costurile actuale (fără preț Symbai)** `on/off` (currentCostOnly — ascunde coloana „Cu Symbai", arată doar cât plătește clientul ACUM) · **Plasare** `listă` Înainte/După ofertă (placement) · **Reia cheltuielile din alt calcul** `listă` (comparativeItemsFromCalculationId — calculul de fază 2, după ofertă, preia liniile introduse live în faza 1 și arată economia). Buton **Configurează calcul în 2 faze** pe cardul comparative-list creează/leagă automat faza 1 + faza 2; echivalent MCP: `setup_two_phase_calculation`. **Preț hibrid abonament + comision** — **Moneda costului fix** `symbaiCostCurrency` (`RON`/`EUR`), **Curs €→lei** `symbaiEurRate`, **% din vânzări** `symbaiRevenuePercent`, **Etichetă câmp estimat** `revenueEstimateLabel`, **Valoare implicită estimat vânzări** `revenueEstimateDefault`, **Perioada estimatului** `revenueEstimatePeriod` (`month`/`year`). În rulare apare câmpul live pentru estimat; formula vizibilă este fix + procent × vânzări estimate.
  - Cost amânare: **Sursa pierderii** `listă` (din listă cheltuieli / valoare fixă / formulă) · **Delay default** `nr` (impl. 6) · **Delay max** `nr` (impl. 24).
  - Payback: **Setup cost** `nr` · **Benchmark industry (luni)** `nr` · **Sursa economiei** `listă`.
- **Slide vizual** `on/off` → conținut bogat.
- **Qualificare**: **Apare MEREU** `on/off` · **Reguli** (Etichetă + Condiții + **Boost priority** `nr` 0–10 + Notă) · **Combinare** Oricare/Toate.
- **Afișare slide**: **Mod** `listă` Mereu/Qualified/Doar agent/Niciodată · **Priority** `nr` 1–10 · **Cere confirmare agent** `on/off`.

## 14. OFERTĂ (tab Oferte)
- **Antet**: Cheie · **Titlu** `text` · **Subtitlu** `text` · **Layout cards** `listă` (Grid 3/Grid 2/Auto/Stacked) · **Monedă** RON/EUR/USD · **Permite WhatsApp** `on/off`.
- **Pricing Tiers** („Adaugă tier"): **Nume** · **RECOMANDAT** (unic/ofertă) · **Descriere** · **Preț** `nr` · **Perioadă** /lună//an/unic/custom · **Procent din încasări** `revenuePercent` + **Etichetă procent** `revenuePercentLabel` (ex. „din încasări"; apare separat ca „+ 0,2% din încasări", nu intră în totalul fix) · **Beneficii** (1/linie) · Styling: **Culoare accent** `culoare` · **Stil card** Minimal/Glass/Gradient/Spotlight · **Icon/emoji** · **Highlights (max 3)** · **Ribbon** (text + gradient + sparkle).
- **Add-on-uri** („Adaugă addon"): Nume · Descriere · Preț `nr` · Perioadă unic//lună//an · Categorie · **Bifat by default** `on/off`.
- **Șabloane email**: Etichetă + Subiect + Body (variabile `{{customer.name}}`/`{{offer.total}}`/`{{offer.tier}}`/`{{offer.title}}`/`{{offer.addons}}`).
- **Șabloane contract** `chips` (din `/contracts`).
- **Link de plată**: **Activează** `on/off` · **Provider** Viva/Global Payments/Stripe/Custom URL · **% avans** `nr` 0–100 · **Zile valabilitate** `nr` · **CTA buton** `text`.
- **Chestionar feedback**: **Activează** `on/off` · **Chestionar** `listă` (din `/questionnaires`) · **CTA** · **Reminder după zile** `nr`.
- **Automatizări post-trimitere** („Adaugă automatizare"): **Activă** `on/off` · Etichetă · **Trigger** Imediat/După plată/După feedback/După X ore/După X zile · **Acțiune** Task agent/Email/WhatsApp/Log CRM/Rezervare pre-confirmată/Eveniment pre-confirmat/Notificare push · Delay/Titlu task/Subiect+Body (condiționate de acțiune).
- **Dialog „Trimite oferta"** (la rulare): Canal Email/WhatsApp · Destinatar · Șablon · Subiect · Body · Atașează contract · Atașează PDF · (Plată) Include link + % avans override · (Feedback) Include chestionar · (Automatizări) bifare per item.

## 15. FLUX (tab Flux ✨ — povestea, 9 pași)
Comun fiecărui pas: **Comutator on/off** · **Apare: Mereu / condiție** (§5) · **Mai multe/puține după tipologie** (per tipologie `nr` 1–10).
- **1 Deschidere** `on/off` (formularul se editează în Intro).
- **2 Întrebări**: **Câte (max)** `nr` 1–20 · per întrebare Pe ecran/Doar telefon + condiție.
- **3 Tranziție** `on/off` (implicit OFF) → 2 slide-uri inline (§16).
- **4 Dureri & soluții**: **Câte (top după scor)** `nr` 1–10 (impl. 3) + override/tipologie + condiție.
- **5 Calcul revelator**: **Calcul** `listă` (anume / „Automat după durerea dominantă") · **Câte calcule** `nr` 1–4 · condiție.
- **6 Obiecții**: **Obiecții în joc** `chips` (gol = toate relevante).
- **7 Dovezi**: **Câte** `nr` 1–10 (impl. 2) + override/tipologie + condiție.
- **8 Ofertă**: **Ofertă** `listă` (anume / „Automat prima") + condiție.
- **9 Calcul după ofertă** `on/off` (implicit OFF — calculationAfterOffer): **Calcul** `listă` (un calcul cu **Plasare = După ofertă**). Tipic: faza 1 arată costul actual fără preț (§13 currentCostOnly), apoi oferta, apoi acest pas reia cheltuielile și arată economia vs prețul tău.

## 16. Cele 2 slide-uri de TRANZIȚIE (inline în pasul 3)
- **Slide 1 „De la probleme la posibilități"**: **Titlu** · **Text introductiv** · **Conținut** = editor conținut bogat (coloanele Acum↔Cu noi etc., §9).
- **Slide 2 Wishlist „Ce ai bifa?"**: **Kicker** · **Stilul răspunsurilor** (Carduri cu icon / Listă simplă) · **Întrebarea** · **Subtitlu** · **Opțiunile** (~10; fiecare: Iconiță + Titlu scurt + Descriere + **Poză card opțională** `imageUrl` + focalizare `imageObjectPosition` + panou „💔 dureri" §4). Buton „Leagă bifele de dureri" (seed 1-click). În stil icon-cards, poza devine fundal full-bleed; pune imagini care arată rezultatul promis de opțiune.

## 17. TEMA (tab Tema)
- **Preset-uri (13, 1-click)**: Corporate Slate · Onyx Premium · Sunset Bistro · Forest Farm · Rose Boutique · Steel Industrial · Aegean Resort · Espresso Roast · Midnight Tech · Editorial Cream · Lavender Wellness · Coral Cowork · Minimal Mono.
- **Font titluri** `listă` (20 Google: Inter, Playfair Display, Bodoni Moda, Plus Jakarta Sans, Libre Baskerville, Space Grotesk, Lora, Fraunces, DM Serif Display, Archivo Black, Outfit, Poppins, Montserrat, Raleway, Cinzel, Merriweather, Cormorant Garamond, Crimson Pro, Oswald, Bebas Neue).
- **Font body** `listă` (14: Inter, DM Sans, Source Sans 3, Montserrat, Roboto, Open Sans, Plus Jakarta Sans, Archivo, Outfit, Nunito, Manrope, Work Sans, Lato, Karla).
- **Culori** `culoare`: Principal · Secundar · Evidență · Fundal · Text (badge „auto").
- **Dimensiuni**: **Mărime text body** `nr` 12–22px · **Densitate** Spațios/Compact/Dens · **Rotunjire colțuri** `nr` 0–24px.
- „Șterge tema" (revine la default).

## 18. SCORING (panoul „🎯 Când apare", pe Dovezi + slide-uri custom)
`chips` cu ponderi: Match typology +2.0 · Pain confirmed +2.0/+1.5 · Feature reacție +1.5/−1.0 · Răspunde la obiecție vie +2.5 · Pre-empt +1.0 · **Greutate intrinsecă** `nr` 0.0–3.0 · **Flagship** `on/off` +1.0. (Pragurile de intensitate durere se reglează în Dureri/Discovery/Intro.)

## 19. PREVIEW (tab Preview)
**Test preset** `listă` (Fără preset / Restaurant clasic / Conservator / Expansion / Newbie) · Restart · badge Typology detectat + N slide-uri + library efectivă · runner live (răspunsurile NU se salvează).

## ⚠ Câmpuri legacy (EXISTĂ în date, dar FĂRĂ control în UI — NU le promite userului)
- **Durere**: intensity probe, qualification rules, slide presentation (always/qualified/manual-only/never, minIntensity, priority, requireAgentConfirmation), suggestedWalkthroughFeatureIds.
- **Soluție**: `demoUrl`, flag `highlight` (WOW) pe walkthrough.
- **Calcul**: maparea valorilor SELECT→număr (`valueMap`), categoria semantică (cost_save/revenue_lift/time_save/risk_reduction/experience_uplift), textele de coaching (tips/întrebări/note).
- **Ofertă**: trust signals (badge-uri garanție/GDPR — se afișează dacă-s setate, dar fără buton în editor), tema ofertei, mesaj post-acceptare, sufix perioadă custom, gradient card custom, `recommendedForTypologies`, `availableForTierIds` (addon per pachet), sumă fixă plată (`fixedAmount`), detalii automatizare (prioritate task/assignee/destinatar/offset rezervare/condiție).
Pe acestea motorul folosește valori implicite — dacă userul le cere, explică-i că nu există buton și că se acoperă din temă/comportament implicit (sau trimite `trimite_ticket_symbai` ca sugestie).

## Cross-link
- Conceptul + metodologia + cum rulezi → `prezentare-vanzare.md`. **Construcție prin MCP (forme JSON) → `prezentare-vanzare-mcp.md`.** Skill: `construieste-prezentare`. CRM de unde se lansează → `crm-vanzari-pipeline.md`.
