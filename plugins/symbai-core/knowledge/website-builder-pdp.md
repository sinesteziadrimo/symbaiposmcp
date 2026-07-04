# Pagina de produs (PDP) — cum o faci COMPLETĂ, ca la magazinele mari

> PDP = „pagina de produs" (Product Detail Page): pagina pe care ajunge clientul când dă click pe un produs din magazinul online. URL-ul canonic e pe **slug** (`/produs/<slug>`, ex. `/produs/scaun-auto-0-13-kg`) — bun pentru SEO; `/produs/<id>` rămâne ca fallback și face automat redirect 301 spre slug. Aici se decide vânzarea.
> Acest ghid = **ce pui pe pagina de produs ca să arate bogată și să convertească** + ce tool MCP completează fiecare lucru. Pentru construirea site-ului în ansamblu (pagini, categorii, filtre, hero, footer) vezi `website-builder.md`. Pentru textul descrierii (SEO, anti-duplicat, lungime) vezi `descrieri-produse-seo.md`.

## De ce contează
O pagină de produs „sărac" — doar o poză, un preț și două rânduri de text — pierde clienți: arată neîngrijit, nu răspunde la întrebări, nu dă încredere. Magazinele mari (tip eMAG, Decathlon) au pe fiecare produs: galerie de poze, descriere lungă cu tab-uri, tabel de specificații, preț redus vizibil, garanție, rate, întrebări frecvente, produse compatibile și pachete. Tot ce urmează se pune **prin conexiune (MCP), fără click-uri** — pe `add_menu_item` / `update_menu_item` (produsul în meniu) plus câteva tool-uri dedicate pentru poze, recomandări și pachete.

## Lista de bife — o pagină de produs completă
Bifează-le pe fiecare produs important (cel puțin best-sellers + produsele cu marjă mare). Coada lungă: măcar poze + descriere + specificații.

- [ ] **Galerie de poze (≥3)** — prima = coperta; restul arată produsul din unghiuri/detalii. → `set_product_image` (una) / `bulk_set_product_images` (mai multe deodată).
- [ ] **Descriere lungă** — text bogat (titluri, paragrafe, liste, poze, tabele) în tab-ul „Descriere". → `descriptionHtml` pe `update_menu_item`. (`description` = doar textul scurt de sub titlu.)
- [ ] **Tabel de specificații** — Culoare, Greutate, Material, Dimensiuni, Vârstă recomandată etc. → `specs` pe `update_menu_item` (sau în masă cu `bulk_set_product_custom_values`).
- [ ] **Preț redus vizibil** — preț vechi tăiat + „-N%" + „Economisești N lei". → `compareAtPrice` (prețul VECHI, mai mare) pe `update_menu_item`; `price` = prețul redus de acum.
- [ ] **Garanție** — „Garanție inclusă: 24 luni". → `warrantyMonths` pe `update_menu_item`.
- [ ] **Cod produs vizibil** — pentru clienții care caută după cod (ex. „1179/1341"). → `displaySku` pe `update_menu_item`.
- [ ] **Întrebări frecvente (FAQ)** — 3-5 întrebări reale ale cumpărătorului + răspunsuri scurte. → `faq` pe `update_menu_item`.
- [ ] **Etichete de marketing (badges)** — „Transport gratuit", „Rate fără dobândă", „Nou", „Bestseller", „Eco". → `badges` pe `update_menu_item`.
- [ ] **Rate fără dobândă** — „Plătește în până la 12 rate". → `installmentMonths` pe `update_menu_item` (ex. `[3,6,12]`).
- [ ] **Video** — clip de prezentare YouTube/Vimeo pe pagină. → `videoUrl` pe `update_menu_item`.
- [ ] **Certificări de siguranță** — EN71, OEKO-TEX, CE → badge-uri. → `safetyCert` pe `update_menu_item` (ex. `["EN71","OEKO-TEX","CE"]`).
- [ ] **Accesorii / produse compatibile** — secțiunea „S-ar putea să te intereseze" / „Alți clienți au cumpărat". → `set_product_recommendations`.
- [ ] **Pachet „Cumpărate frecvent împreună"** — produsul principal + ce merge cu el, cu reducere opțională pe pachet. → `set_product_bundle`.

## Ce face fiecare lucru pe pagină (tradus pentru proprietar)

**Poze — `set_product_image` / `bulk_set_product_images`**
Galeria e primul lucru care vinde. Prima poză e coperta (cea din listă). Pune cel puțin 3: produsul întreg, un detaliu, produsul în folosință. Fără poze bune, restul nu mai contează.

**Descriere lungă — `descriptionHtml`**
`description` rămâne textul scurt de sub titlu. `descriptionHtml` e descrierea BOGATĂ din tab-ul „Descriere": poți pune subtitluri, paragrafe, liste cu bullet-uri, poze și chiar tabele. Aici scrii povestea produsului, beneficiile, modul de folosire. (Pentru cum se scrie ca să rankeze pe Google → `descrieri-produse-seo.md`.)

**Specificații — `specs`**
Un tabel cu detalii tehnice: o listă de perechi etichetă→valoare (ex. Culoare = Gri, Greutate = 11-14 kg, Roți = cauciucate, Vârstă = 0-36 luni). Înlocuiește câmpurile fixe vechi — pui exact specificațiile care contează pentru produsul tău. Important și pentru Google: specificațiile ca TEXT (nu prinse într-o imagine) sunt citite de motoarele de căutare.
- Pentru SUTE de produse deodată → `bulk_set_product_custom_values` completează specificațiile pe zeci/sute de produse dintr-un singur apel.

**Preț redus — `compareAtPrice`**
Pui prețul VECHI (mai mare) în `compareAtPrice`, iar `price` rămâne prețul de acum. Pagina afișează automat prețul vechi tăiat, procentul de reducere („-30%") și „Economisești N lei". Creează urgență și arată valoarea. Reduceri pe tot catalogul = aceeași idee, aplicată în masă.

**Garanție — `warrantyMonths`**
Numărul de luni de garanție (ex. 24) → pe pagină apare „Garanție inclusă: 24 luni". E un semnal de încredere care reduce ezitarea la cumpărare.

**Cod produs — `displaySku`**
Codul vizibil al produsului (ex. „1179/1341"). Unii clienți caută/compară după cod; îl pui ca să-l vadă pe pagină.

**FAQ — `faq`**
O listă de întrebări frecvente cu răspunsuri scurte (ex. „Se poate spăla? — Da, la 30°C."). Răspunde la ezitările reale ale cumpărătorului → mai puține întrebări pe email/telefon și mai multă încredere. Ajută și la SEO (apare ca secțiune de întrebări).

**Etichete (badges) — `badges`**
Etichete de marketing afișate pe card și pe pagină: `free_shipping` (transport gratuit), `installments` (rate), `new` (nou), `bestseller`, `eco`. Atrag atenția și comunică avantaje dintr-o privire.

**Rate — `installmentMonths`**
Lista de rate disponibile (ex. `[3,6,12]`) → „Plătește în până la 12 rate fără dobândă". Scade bariera de preț la produsele scumpe.

**Video — `videoUrl`**
Un link YouTube sau Vimeo → clipul apare pe pagina de produs. Un video de prezentare convinge mai bine decât pozele singure, mai ales la produse care se folosesc/demonstrează.

**Certificări — `safetyCert`**
Lista de certificări (ex. `["EN71","OEKO-TEX","CE"]`) → badge-uri de siguranță. Esențial la jucării, produse pentru copii, textile, cosmetice — dau încredere și sunt des cerute de cumpărători.

**Recomandări — `set_product_recommendations`**
Produsele afișate ca „S-ar putea să te intereseze" / „Accesorii" / „Alți clienți au cumpărat". Poți alege tipul de relație (alternative, accesorii, complementare). Clientul are mereu unde merge mai departe → coș mediu mai mare, mai puține fundături.

**Pachet — `set_product_bundle`**
Secțiunea „Cumpărate frecvent împreună": un produs principal + produsele din pachet, cu o reducere opțională dacă le ia pe toate. Crește valoarea comenzii și ușurează decizia (clientul ia setul complet dintr-un click).

## Rețetă rapidă — o pagină de produs completă, pas cu pas
1. **Poze**: `bulk_set_product_images` (3+ poze; prima = coperta).
2. **Texte**: `update_menu_item` cu `description` (scurt) + `descriptionHtml` (lung) + `displaySku`.
3. **Specificații**: `specs` pe `update_menu_item` (sau `bulk_set_product_custom_values` pe multe produse).
4. **Preț & încredere**: `compareAtPrice` (preț vechi) + `warrantyMonths` + `safetyCert` + `badges` + `installmentMonths`.
5. **Întrebări**: `faq` (3-5 întrebări reale).
6. **Video** (dacă ai): `videoUrl`.
7. **Cross-sell**: `set_product_recommendations` (accesorii / similare) + `set_product_bundle` (pachet cu reducere).
8. **Verifică**: deschide pagina produsului (link prin `gaseste_in_aplicatie`) și uită-te la ea — galerie, tab-uri, specificații, preț redus, FAQ, accesorii. Nu spune „gata" până n-ai văzut pagina plină.

## Import dintr-un magazin existent (dă un URL → se preia tot pe produs)
Dacă produsul (sau tot catalogul) există deja pe un alt magazin online, nu rescrii nimic de mână: dai URL-ul produsului/site-ului și se preiau **pozele, descrierea, specificațiile** și se pun automat pe produsul din Symbai prin tool-urile de mai sus.
- Pentru un produs: dă linkul paginii → se iau galeria de poze (`bulk_set_product_images`), descrierea lungă (`descriptionHtml`), tabelul de specificații (`specs`).
- Pentru tot magazinul: vezi `onboarding/02d-import-surse-externe.md` (import asistat din surse externe) și skill-ul `construieste-website` (secțiunea „Replici un site existent"). După import, treci prin lista de bife de mai sus și completează ce a rămas gol.
- **Regula de aur**: nu inventa specificații, garanție sau certificări pe care produsul nu le are. Ce nu se găsește la sursă se lasă gol sau se întreabă proprietarul. (Detaliu în `descrieri-produse-seo.md` → „Acuratețe".)

## Capcane
- **Pagina arată „sărac"** = lipsesc pozele (≥3), descrierea lungă (`descriptionHtml`) sau specificațiile (`specs`). Astea trei sunt minimul.
- **`description` ≠ `descriptionHtml`** — primul e textul scurt de sub titlu, al doilea e descrierea bogată din tab. Pune-le pe amândouă.
- **Preț redus** = `compareAtPrice` e prețul VECHI (mai mare); `price` e cel de acum. Inversate → reducere negativă/greșită.
- **Specificații în poză** = invizibile pentru Google și pentru filtre. Pune-le ca text în `specs`.
- **Nu inventa** garanție, certificări sau specificații tehnice care nu sunt reale — mai bine lipsă decât false.
- **Verifică prin pagină**, nu doar „am rulat tool-ul" — deschide produsul și uită-te la el.
