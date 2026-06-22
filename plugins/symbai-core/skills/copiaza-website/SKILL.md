---
name: copiaza-website
description: Copiază COMPLET un website extern în Symbai (magazin online / site de prezentare) — toate paginile, tot catalogul cu poze/descrieri/categorii/variante, blogul, paginile legale — printr-un proces care rulează ORE, descompus în sarcini mici verificate, care NU se oprește la 20% și NU declară „gata" până nu e verificat obiectiv. Folosește la „copiază-mi site-ul / magazinul", „adu-mi site-ul de pe X în Symbai", „clonează magazinul de pe Y", „importă tot site-ul meu", „mută-mă de pe vechiul magazin", „fă-mi site-ul identic cu cel vechi", „copiază toate produsele de pe site-ul meu", „de ce ai copiat doar o parte din site", „continuă copierea site-ului". Pentru un site MIC sau o singură pagină de prezentare (fără catalog mare) poți folosi direct `construieste-website`; pentru cataloage mari / site întreg / „să nu se mai oprească până nu termină" folosește ACEST skill.
---

# Copiază un website complet în Symbai — hands-free, pe ore, verificat

Proprietarul vrea site-ul lui (sau unul pe care îl deține/administrează) copiat **întreg** în Symbai: nu o aproximare de homepage, ci tot catalogul, toate categoriile, pozele, descrierile, blogul, paginile legale. Pe site-uri mari asta durează **ore** și NU încape într-o singură „tură" de agent. Acest skill e un **orchestrator** care duce treaba la capăt fără să se oprească la 20% și fără să mintă că e gata.

> **De ce era nevoie de el:** `analyze_external_website` vede maxim 24 de pagini și nu citește sitemap-ul → pe un site de mii de produse copiezi ~20% și pari „gata". Aici pornim de la **scopul ADEVĂRAT** al site-ului (numitor independent), ținem o **coadă durabilă** pe disc (supraviețuiește compactării contextului), lucrăm pe **loturi mici cu sub-agenți**, și declarăm „gata" doar când o **poartă de paritate** obiectivă (ID-uri lipsă = 0) trece.

## Citește întâi
1. `references/harness.md` — protocolul complet: schema cozii durabile, regulile sub-agenților, rubrica verificatorului, mecanismul „nu te opri".
2. `../construieste-website/SKILL.md` — EXECUTORUL (cum scrii efectiv în Symbai: produse, categorii, hero, footer, PDP). Acest skill îl ORCHESTREAZĂ.
3. `../../knowledge/website-copy-intake.md` + `../../knowledge/website-builder-pdp.md` — paritate vizuală + pagina de produs bogată.

## Uneltele de copiere pe server
Crawl-ul greu rulează pe **server** (owner-ul poate închide laptopul) — tu doar mapezi din cache și verifici. (Descoperire + crawl + 3 porți-produs mai jos; porțile advisory + SEO sunt în Faza 4.)
- **`discover_site_inventory(url)`** — numitorul ONEST: numără produse/categorii/blog/pagini din surse independente (sitemap-index + feed Shopify/WooCommerce + header X-WP-Total). Întoarce `productDenominator` + `denominatorConfident`. **Rulează ÎNTÂI.**
- **`start_site_clone_crawl(url, brandId)`** — pornește copierea pe server (fundal, politicos, anti-429, cache + extracție JSON-LD). Întoarce `jobId`.
- **`get_clone_crawl_status(jobId)`** — progres (cache/procesate/descoperite), denominator, dead-letter.
- **`list_clone_crawl_pages(jobId, type, status, limit, offset)`** — coada de lucru: toate URL-urile tipizate (product/category/blog/legal/page) cu status. **Sursa adevărului pentru „ce mai am de făcut".**
- **`get_cached_page(jobId, url)`** — conținut + date structurate extrase pentru O pagină (nume, SKU, preț, preț vechi, poze, descriere, breadcrumb, specs PDP, variantCount). De aici mapezi un produs/pagină în Symbai, fără re-descărcare.
- **`clone_parity_diff(jobId, brandId)`** — POARTA 1 (acoperire produse): compară SETUL de produse-sursă (chei SKU) cu cele importate → întoarce **ID-urile care LIPSESC**. PASS doar dacă `denominatorConfident` ȘI nu lipsește nimic.
- **`clone_fidelity_audit(jobId, brandId, sampleSize?)`** — POARTA 2 (calitate produse, adâncime): eșantion din TOT catalogul, comparat CÂMP-CU-CÂMP cu importul (nume/poze/galerie/descriere/preț/categorie/specs/variante) → `fidelityScore` + `fieldScores` + `worstSample` (ce câmp lipsește, pe ce produs) + `flags`. `fieldScores.gallery` prinde importuri de tip „1 poză din 8"; `low_gallery_fidelity` se repară cu `bulk_set_product_images`.
- **`clone_coverage_audit(jobId, brandId)`** — POARTA 3 (tot ce NU e produs): set-diff pe **categorii / blog / pagini legale** sursă vs importat → coverage + `missingSample` per dimensiune. O migrare reală aduce și astea, nu doar catalogul.
- **`clone_category_tree_audit(jobId, brandId)`** — advisory (Faza 4, 9c-arbore): verifică arborele de categorii (părinte→copil) vs aplatizare; `pass` poate fi `null` dacă sursa n-are breadcrumb-uri.
- **`clone_branding_audit(jobId, brandId)`** — advisory (Faza 4, 9c-branding): logo / culori / nume / social / contact din sursă vs brandul Symbai; `pass` poate fi `null` fără semnale vizuale.
- **`clone_audit_all(jobId, brandId, sampleSize?)`** — verdict complet, read-only, într-un apel: rulează parity + fidelity + coverage + tree + branding și întoarce `pass`, `hardPass`, `erroredGates`, sumar per-poartă și remedieri.
- **`clone_redirect_map(jobId, brandId, apply?)`** — continuitate SEO (Faza 4, 9f): dry-run, apoi `apply:true` scrie 301-uri din URL-urile vechi produs/categorie spre URL-urile Symbai. Rulează ÎNTÂI dry-run, separat după PASS.
- Pentru **paginile de prezentare** (non-produs): conținutul se scrie cu uneltele din `construieste-website` (`set_website_page_content`/`set_website_theme`/`set_website_legal_page`) — vezi Faza 4b.

## Cum lucrezi cu userul — INCREMENTAL, una câte una (mod IMPLICIT)

**Implicit, lucrezi user-driven, NU autonom pe ore.** Modul „rulează ore, nu te opri" (Faza 5 + `harness.md` §Nu-te-opri: `/loop`, agentul programat, hook-ul Stop) este **OPT-IN** — îl pornești DOAR după ce userul îți cere explicit „rulează tot / nu te opri / las-o să meargă / închid laptopul". Până atunci toată mașinăria „nu te opri" stă OPRITĂ.

> De ce: lecția #1 din clonarea drimoland.ro — când faci prea mult într-un singur prompt NU verifici destul și scapi greșeli (poze lipsă, link-uri care pleacă de pe clonă, componente nemapate). Verificarea temeinică CERE pași mici. Mai bine durează ore în pași verificați decât „pare gata" la 20%.

**Reguli ale cadenței (non-negociabile):**
1. **Descompune.** Orice lucrare mare (clonarea unui site) o spargi într-o **listă numerotată de sarcini mici, fiecare verificabilă singură** (ex.: „confirmă numitorul", „mapează ACEASTĂ categorie de ~20 produse", „importă pagina Despre și arat-o", „localizează link-urile din blog"). Ține lista pe disc în `progress.json`, nu în cap.
2. **O singură sarcină pe tură.** Faci EXACT o sarcină mică pe tură. Niciodată nu înlănțui mai multe sarcini în tăcere.
3. **Verifică obiectiv, în aceeași tură.** Înainte să mergi mai departe, confirmi sarcina prin **CITIREA câmpurilor scrise** (re-citești din Symbai ce ai scris) — și, pentru pagini, **vizual în browser** — nu prin „tool success". „Gata" la o sarcină mică ≠ „pare gata".
4. **Explică în limbaj de business.** Spui userului, scurt și pe înțeles, CE ai făcut la sarcina asta și de ce — nu jargon, nu dump de cod.
5. **Propune ÎNTOTDEAUNA următoarea sarcină și oprește-te.** Închei fiecare tură cu: (a) rezultatul sarcinii curente + dovada verificării, (b) **o singură sarcină următoare concretă, propusă**. Apoi te OPREȘTI și aștepți ca userul să zică „continuă / da / yes". Userul conduce ritmul.
6. **Niciodată „gata" fără verificare** și niciodată întreg catalogul/site-ul într-o singură tură. „Gata" pe tot rămâne definit de porțile obiective (Regula 1 de mai jos) — porțile rulează doar după ce userul a aprobat parcurgerea.
7. **Chiar și în modul autonom (opt-in), fă checkpoint:** după fiecare poartă care trece sau fiecare N loturi, postezi o linie de progres + următoarea sarcină planificată, ca userul să poată interveni.

## ⚠ Reguli NON-NEGOCIABILE (din ele vine corectitudinea)
1. **„Gata" NU înseamnă „pare copiat".** „Gata" = `clone_audit_all(...).data.pass === true` (porțile dure trec + advisory nu blochează) sau, dacă rulezi manual, TOATE porțile dure `pass:true` — `clone_parity_diff` (0 produse lipsă, numitor sigur) ȘI `clone_fidelity_audit` (câmpurile produselor transferate, inclusiv galerie când sursa are 2+ poze) ȘI `clone_coverage_audit` (categorii/blog/pagini legale migrate) — PLUS **Poarta 4 (fidelitate de design, Faza 4b): paginile de prezentare arată ca originalul, verificat vizual** — PLUS `audit_shop_health` fără `error`. Niciodată pe baza impresiei tale.
2. **Numitorul mai întâi.** Dacă `denominatorConfident:false`, NU începe să declari progres procentual fals. Obține un al doilea semnal (vezi harness.md §Numitor) sau spune-i EXPLICIT userului „best-effort, denominator nesigur (motiv)" — nu ascunde.
3. **Cheia de identitate = SKU / handle / slug-sursă, NU numele.** Setează `products.sku` = cheia sursă la import (`bulk_create_products(sku=<cheie>)`). Altfel `bulk_create_products` deduplică pe NUME și îmbină tăcut produse distincte → pierdere de date care „trece" la numărătoare.
4. **Niciodată tot catalogul într-o singură trecere.** Descompune în loturi mici (≤25 produse / 1 pagină) date la **sub-agenți** (Task tool) cu context curat; tu (liderul) ții doar coada + tally-ul, nu HTML-ul paginilor.
5. **Coada trăiește pe DISC** (`.symbai-clone/`), nu în context. La fiecare iterație/sesiune nouă, **prima acțiune = re-citește coada** și reia; nu te baza pe memorie după compactare.
6. **„Buget epuizat" ≠ „complet".** Dacă atingi un plafon de timp/cost, starea finală e INCOMPLET cu numărul de ID-uri rămase afișat — niciodată COMPLET.
7. **Idempotent.** Re-rularea unui lot trebuie să fie no-op (cheia stabilă + dedup Symbai). Verifică prin CITIRE a câmpurilor, nu prin „tool success".
8. **Paginile de prezentare se copiază pe DESIGN, nu pe text.** O pagină (acasă, despre, servicii, abonamente, blog, legale) NU se toarnă într-un singur bloc custom-HTML. Fiecare secțiune-sursă se mapează la o **componentă nativă** de website-builder (hero, text+imagine, carduri, galerie, testimoniale, FAQ, **pricing**) ca tema s-o stilizeze. „Arată ca originalul" e o POARTĂ (vezi Poarta 4), nu o impresie. Verificarea finală e **vizuală, pagină-cu-pagină, componentă-cu-componentă** în browser — exact cum verifică ownerul.
9. **Orice corecție de mapare/renderer invalidează output-ul vechi.** După ce repari un mapper sau un renderer (sau adaugi un tip de componentă), **RE-importă paginile afectate ÎNAINTE de re-verificare**. Un fix ne-reimportat = output stale care trece fals la verificare. Verifici versiunea NOUĂ, nu cea veche.

## Fluxul (faze)

### Faza 0 — Scop & numitor onest
1. `list_brands` → `brandId` (sau creează brand+locație+depozit dacă e tenant gol — vezi `construieste-website`).
2. **`discover_site_inventory(url)`**. Notează `platform`, `productDenominator`, `denominatorConfident`, `flags`, `totals`.
3. Dacă `denominatorConfident:false`: citește `flags`. `single_independent_count`/`no_independent_count` (ex. Magento/OpenCart fără feed JSON) → al doilea semnal: numără produsele dintr-o pagină de listing („N produse/rezultate") pe câteva categorii și extrapolează, SAU continuă marcat „best-effort" și spune-i userului. `counts_disagree`/`denominator_round_cap` → reconciliază înainte de a declara vreodată „gata".

### Faza 1 — Pornește crawl-ul pe server (hands-free)
4. **`start_site_clone_crawl(url, brandId)`** → `jobId`. Rulează în fundal pe server. Spune-i userului: *„Am pornit copierea pe server — poți închide laptopul; eu continui și verific."*
5. Poll `get_clone_crawl_status(jobId)` periodic. Nu aștepta să termine 100% ca să începi maparea — mapează pe măsură ce paginile devin `cached`.

### Faza 2 — Coada durabilă pe disc
6. Creează `.symbai-clone/<host>/` cu `manifest.json` (numitor + goldProducts), `progress.json` (header/tally) și flag-ul `.pending-clone-<sessionId>`. Schema exactă în `references/harness.md`. (Crawl-ul e deja persistent pe server; fișierele locale sunt tally-ul tău + poarta hook-urilor „nu te opri".)

### Faza 3 — Mapează în loturi, cu sub-agenți
7. Buclă: `list_clone_crawl_pages(jobId, type:"product", status:"cached", limit, offset)` → ia un lot de ~25. Dă-l unui **sub-agent** (Task) cu instrucțiune strictă: pentru fiecare URL → `get_cached_page` → `bulk_create_products(sku=cheia sursă, name, description, vat:21, ...)` + `set_product_image/bulk_set_product_images` + `add_menu_item(productBrand, ...)`; întoarce DOAR `{lot, produseScrise, pozeScrise, eșecuri[]}`. Apoi categorii (ierarhie din breadcrumb → `bulk_reparent_menu_categories` + `set_products_menu_category`), blog (`bulk_create_blog_posts`), legale (`set_website_legal_page`), footer/branding.
   - ⚠ **Parcurge TOATE tipurile, nu doar `type:"product"`/`type:"page"`.** Coada are `product/category/blog/legal/page` — fiecare cu importatorul lui. Dacă filtrezi importul de pagini pe `type:"page"`, pierzi tăcut paginile cu `type:"legal"`/`type:"blog"` (pe drimoland.ro au lipsit 4 pagini așa). Iterează pe toate tipurile relevante.
8. După fiecare lot, actualizează `progress.json`. Liderul citește doar header-ul + cere următorul lot — nu încarcă tot catalogul în context.

### Faza 4 — Verifică (cele 3 porți obiective, în ordine)
9. **Poarta 1 — acoperire produse: `clone_parity_diff(jobId, brandId)`**. Dacă `pass:false`: pentru fiecare ID din `missingSample` → `get_cached_page` → re-importă. Re-rulează până `pass:true`.
9b. **Poarta 2 — calitate produse: `clone_fidelity_audit(jobId, brandId)`**. Pentru fiecare intrare din `worstSample` (produs + câmpuri lipsă) → `get_cached_page(jobId, url)` → completează câmpul: poze/galerie (`set_product_image`/`bulk_set_product_images`, prima poză = copertă), descriere/preț-vechi/specs (`update_menu_item`/`add_menu_item`), variante (`set_product_variants`), categorie (`set_products_menu_category`). Re-rulează până `pass:true`. Citește `flags`: `low_gallery_fidelity` → produsul are prea puține poze față de sursă; `unreadable_source_pages_*` → re-citește sursa; `price_currency_mismatch_suspected` → verifică valuta; `unaudited_fields_*` → câmp absent în sursă (nimic de făcut).
9c. **Poarta 3 — non-produs: `clone_coverage_audit(jobId, brandId)`**. Pentru fiecare `missingSample` per dimensiune → importă din `get_cached_page`: categorii (`create_menu_category`/`bulk_reparent_menu_categories`), blog (`bulk_create_blog_posts`), pagini legale (`set_website_legal_page`). Re-rulează până fiecare dimensiune ≥95%.
9c-arbore. **Arbore categorii (advisory): `clone_category_tree_audit(jobId, brandId)`**. `pass` poate fi `null` (sursă fără breadcrumb-uri = neauditabil, OK). Dacă `pass:false` sau `flatteningDetected:true`: pentru fiecare `missingEdgesSample` (`parent>child`) → `create_menu_category` (categoriile lipsă) + `bulk_reparent_menu_categories` (leagă copil→părinte, ca arborele să nu fie plat). Re-rulează până `pass` ∈ {`true`, `null`}.
9c-branding. **Branding (advisory): `clone_branding_audit(jobId, brandId)`**. `pass` poate fi `null` (sursă fără semnale vizuale). Dacă `pass:false`: din `data.source` → `update_brand(brandId, logo=<source>, color=<themeColor>, name?)` + `brandIdentity` (logos/colors/socialMedia); contactul (telefon/email/adresă din `data.source`) → `update_location`. Re-rulează până `pass` ∈ {`true`, `null`}.
9d. **`audit_shop_health(brandId)`** → repară toate `error`, re-rulează până curat.
9e. **Verdict scurt: `clone_audit_all(jobId, brandId)`**. Rulează la final sau când vrei status executiv. `pass:true` înseamnă că porțile dure trec și advisory nu blochează; `erroredGates` înseamnă că nu poți declara complet, chiar dacă restul arată bine.
9f. **SEO — redirecturi 301: `clone_redirect_map(jobId, brandId, apply:true)`**. După ce porțile trec, scrie 301-uri din URL-urile VECHI (produs/categorie) spre cele noi Symbai, ca firma să NU piardă pozițiile Google când mută domeniul. Rulează ÎNTÂI dry-run (fără `apply`) ca să vezi `unmatched`/`noSlug`/`chainsSkipped`; dacă `unmatched` e mare, mai întâi închide golurile (parity/coverage), apoi `apply:true`. (Esențial la o migrare reală cu trafic.)

### Faza 4b — Poarta 4: fidelitate de DESIGN (paginile de prezentare)
Catalogul poate fi 100% și site-ul tot să arate „groaznic" dacă paginile sunt text simplu fără designul sursei. Pentru fiecare pagină non-produs (acasă/despre/servicii/landing/legale/blog):
1. **Mapează componentă-cu-componentă** (cu `construieste-website`): fiecare secțiune-sursă → componentă nativă echivalentă, cu **fundalul/banda colorată**, pozele, butoanele CTA (localizate) și animațiile pe care le are originalul. NU dump custom-HTML.
2. **Agent de verificare structural** (rulează după fiecare import): pentru fiecare pagină, fă diff între componentele-sursă și ce-ai importat → semnalează **poze lipsă**, **componente vizuale pierdute**, **link-uri ne-localizate** (doar href/src, nu URL-uri ca text afișat). Listează paginile de verificat vizual, worst-first. Nu număra ca „lipsă" tipurile care fuzionează firesc (titluri/rich-text → text-block) sau cele ne-vizuale (formulare) — altfel ai zgomot.
3. **Pas vizual în browser** (Chrome): deschide URL-ul REAL și echivalentul local unul lângă altul și compară componentă-cu-componentă (poze, benzi, box offset, fonturi, CTA, animație reveal). Notează diferențele → repară maparea → re-importă → re-verifică. Pe pagini cu multe imagini screenshot-ul poate da timeout: verifică structura cu interogări DOM (componente prezente + datele lor), nu doar poze.
   - **Verifică EXPLICIT că fiecare rută randează conținutul EI** (acasă ≠ meniu; `/blog` = listarea blogului; `/<pagină>` = pagina ei, nu homepage-ul). Un **fallback tăcut la home/meniu** (pagină neimportată) = pagină LIPSĂ, nu PASS. Pe drimoland.ro homepage-ul arăta meniul și `/blog` arăta meniul exact din cauza asta.
4. POARTĂ: zero poze-lipsă, zero benzi colorate pierdute, zero recenzii-imagine aruncate, zero animații reveal lipsă, zero componente vizuale pierdute, zero link-uri navigaționale ne-localizate, **fiecare rută randează conținutul ei (zero fallback la home/meniu)**, zero pagini stale (re-importate după orice fix de mapare — Regula 9). Abia atunci pagina e „ca originalul".

**Capcane de mapare → Verificare** (fiecare a stricat clona drimoland.ro). Bifează-le UNA CÂTE UNA pe fiecare componentă — nu „dintr-o privire":
- [ ] **Poză în câmp neevident.** `image` e adesea gol; poza reală e în `imageMask`, `picture` (ImageCards), `heroSectionSliderItems[]` (hero) sau `backgroundImage` (scroll-list). → **Probează TOATE câmpurile de imagine** înainte să declari „fără poză".
- [ ] **Cutia decorativă din spate** = o IMAGINE (`imageBackgroundMask`), nu o culoare. → mapeaz-o ca background-image.
- [ ] **Banda colorată de secțiune** = câmp real al componentei (`backgroundColor` / `box`+`boxColor`), nu alb implicit. → setează `sectionBg` + `sectionTextColor` (ambele).
- [ ] **Culorile sunt SEMANTICE — nu vopsi secțiuni întregi cu o culoare-accent.** Calibrează pe culorile COMPUTED ale site-ului real (inspectează în Chrome): navy = eroi, light-blue = benzi de conținut, roz/galben = ACCENTE (boxuri, benzi de recenzii), niciodată erou full-bleed. Ex.: `DarkTextBoxSection.boxColor` e boxul din spatele IMAGINII, nu fundalul secțiunii (secțiunea = navy când textul e alb). Un `text+imagine` fără culoare → secțiune light-blue implicit, FĂRĂ box inventat.
- [ ] **Blog = Markdown.** Renderul de blog NU afișează HTML brut. → convertește HTML→Markdown; restaurează entitățile dublu-escapate (`&amp;nbsp;` → `&nbsp;`).
- [ ] **Link-uri în corpul rich-text / `descriptionHtml` / `custom-html`** NU trec prin localizatorul de href/src. → rescrie-le MANUAL la slug-ul Symbai (cazul `RichTextHtml`, paginile legale).
- [ ] **Recenzii doar-imagine.** `reviewItems[]` fără text — recenzia e un screenshot în `authorPicture`. → randează **galerie**; NU lăsa un filtru pe text să arunce secțiunea.
- [ ] **Tabele de preț** (`PriceSection.priceItems[]`: titlu, preț `monthly/yearlyRegularPrice` + `…DiscountedPrice`, `priceBenefits[]`, badge `highlightTag`) → componenta **pricing**.
- [ ] **Liste „scroll list"** (`ScrollListSection`): itemele reale sunt în **`boxes[].boxCards[]`** (fiecare `{image,title,text}`), NU în `boxes[].boxTitle`; poza de secțiune e în **`backgroundImage`** (nu `image`). → intro text+imagine din `backgroundImage` + `feature-cards` din `boxCards`.
- [ ] **`ProductsList` ca secțiune de pagină** (meniu inline): `products.data` e adesea gol (încărcat client-side) → afișează imaginea de `menu`. Mapeaz-o explicit, altfel pierzi tăcut secțiunea.
- [ ] **Componente care fuzionează / ne-vizuale** (titluri + rich-text → text-block; formulare) — normal să scadă numărul la import; NU le număra ca „lipsă" (altfel verificatorul dă fals-pozitiv).
- [ ] **Navbar-ul = meniul REAL al sursei, nu lista auto de pagini.** Inspectează în browser meniul site-ului real (itemii de top + dropdown-urile lor + href-uri) și reconstruiește-l 1:1 cu `update_website_navigation items[]` (suport `children[]` pentru dropdown). Default-ul (o intrare per pagină: Acasă/Atracții/Restaurant/...) NU corespunde. Și ascunde butonul CTA din dreapta dacă originalul n-are (`navbarSettings:{ctaButton:{visible:false}}`).
- [ ] **NU activa „extra"-uri de componentă pe care sursa NU le are.** Componentele Symbai au opțiuni implicite decorative (sidebar de blog cu newsletter + „Recente", badge „Popular"/„Recomandat", toggle de facturare lunar/anual, rating badge, „featured hero"). Activează-le DOAR dacă site-ul real le are. Ex.: blogul drimoland.ro NU are sidebar → `blog-listing.showSidebar=false` (altfel apare un „Abonează-mă" nealiniat care nu există în original). Compară layout-ul real (câte coloane, cu/fără sidebar, cu/fără badge) și oglindește-l — un element în plus strică fidelitatea la fel ca unul lipsă.

### Faza 5 — Nu te opri până nu e gata (mod AUTONOM, OPT-IN)
> Aceasta e modul AUTONOM — pornește-l DOAR după ce userul cere explicit „rulează tot / nu te opri / las-o să meargă". În modul IMPLICIT (vezi „Cum lucrezi cu userul"), după FIECARE sarcină mică verificată te oprești și propui următoarea. În modul autonom, fă checkpoint: după fiecare poartă care trece sau fiecare N loturi, postează o linie de progres + următoarea sarcină planificată, ca userul să poată interveni.

10. Buclă până: coada goală (0 pending în `list_clone_crawl_pages`) ȘI `clone_audit_all(...).data.pass === true` (sau cele 3 porți produs `pass:true` — `clone_parity_diff` + `clone_fidelity_audit` + `clone_coverage_audit` — + advisory rezolvat/N-A) ȘI **Poarta 4 design (Faza 4b) trecută vizual** ȘI `audit_shop_health` fără `error`.
11. **Pentru rulare pe ore, nesupravegheat** (owner-ul a plecat): instalează un agent programat care reia skill-ul cât timp mai există pending (vezi `references/harness.md` §Nu-te-opri + skill-ul `schedule`). Hook-ul Stop (dacă e instalat) e podeaua dură. `/loop` e bucla din sesiune.
12. Re-citește `progress.json` la fiecare reluare; revendică rândurile `in_progress` rămase blocate înapoi la `pending`.

## Raport onest (la final)
Nu spune „gata" decât la PASS real pe TOATE trei porțile. Raportează: produse importate / numitor + `fidelityScore` (calitate câmpuri, din Poarta 2) + acoperirea non-produs (categorii/blog/pagini legale, din Poarta 3), poze %, ID-uri pe dead-letter (cu motiv: 404/login/fără preț), și ce a rămas NESIGUR. Dacă numitorul a fost nesigur, spune-o. Rezumă userului 3-4 lucruri cheie făcute, în limbaj de business.

## Capcane (vezi și harness.md)
- Site fără sitemap (unele OpenCart) → `discover_site_inventory` întoarce 0 cu `no_independent_count`. NU înseamnă „site gol" — înseamnă „nu pot stabili scopul din sitemap"; pornește crawl-ul (folosește link-crawl/categorii) și marchează numitorul nesigur.
- Magento: sitemap-ul de produse supranumără (include produse scoase din stoc). Numitorul din sitemap = plafon superior, marcat nesigur — reconciliază cu listing-urile.
- Poze: trec prin URL sursă la `set_product_image` (Symbai le ia); dacă CDN-ul sursă cade, re-rulează din cache.
- TVA România = 21 (nu 19). Idempotency pe SKU, nu pe nume.
