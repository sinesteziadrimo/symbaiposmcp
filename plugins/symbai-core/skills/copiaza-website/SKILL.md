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

## Cele 8 unelte de copiere pe server (noi)
Crawl-ul greu rulează pe **server** (owner-ul poate închide laptopul) — tu doar mapezi din cache și verifici:
- **`discover_site_inventory(url)`** — numitorul ONEST: numără produse/categorii/blog/pagini din surse independente (sitemap-index + feed Shopify/WooCommerce + header X-WP-Total). Întoarce `productDenominator` + `denominatorConfident`. **Rulează ÎNTÂI.**
- **`start_site_clone_crawl(url, brandId)`** — pornește copierea pe server (fundal, politicos, anti-429, cache + extracție JSON-LD). Întoarce `jobId`.
- **`get_clone_crawl_status(jobId)`** — progres (cache/procesate/descoperite), denominator, dead-letter.
- **`list_clone_crawl_pages(jobId, type, status, limit, offset)`** — coada de lucru: toate URL-urile tipizate (product/category/blog/legal/page) cu status. **Sursa adevărului pentru „ce mai am de făcut".**
- **`get_cached_page(jobId, url)`** — conținut + date structurate extrase pentru O pagină (nume, SKU, preț, preț vechi, poze, descriere, breadcrumb). De aici mapezi un produs/pagină în Symbai, fără re-descărcare.
- **`clone_parity_diff(jobId, brandId)`** — POARTA 1 (acoperire produse): compară SETUL de produse-sursă (chei SKU) cu cele importate → întoarce **ID-urile care LIPSESC**. PASS doar dacă `denominatorConfident` ȘI nu lipsește nimic.
- **`clone_fidelity_audit(jobId, brandId, sampleSize?)`** — POARTA 2 (calitate produse, adâncime): eșantion din TOT catalogul, comparat CÂMP-CU-CÂMP cu importul (nume/poze/descriere/preț/categorie) → `fidelityScore` + `fieldScores` + `worstSample` (ce câmp lipsește, pe ce produs) + `flags`. „Gata" cere și fidelitate, nu doar SKU prezent.
- **`clone_coverage_audit(jobId, brandId)`** — POARTA 3 (tot ce NU e produs): set-diff pe **categorii / blog / pagini legale** sursă vs importat → coverage + `missingSample` per dimensiune. O migrare reală aduce și astea, nu doar catalogul.

## ⚠ Reguli NON-NEGOCIABILE (din ele vine corectitudinea)
1. **„Gata" NU înseamnă „pare copiat".** „Gata" = TOATE trei porțile `pass:true` — `clone_parity_diff` (0 produse lipsă, numitor sigur) ȘI `clone_fidelity_audit` (câmpurile produselor transferate, fiecare câmp prezent-în-sursă ≥90%) ȘI `clone_coverage_audit` (categorii/blog/pagini legale migrate) — PLUS `audit_shop_health` fără `error`. Niciodată pe baza impresiei tale.
2. **Numitorul mai întâi.** Dacă `denominatorConfident:false`, NU începe să declari progres procentual fals. Obține un al doilea semnal (vezi harness.md §Numitor) sau spune-i EXPLICIT userului „best-effort, denominator nesigur (motiv)" — nu ascunde.
3. **Cheia de identitate = SKU / handle / slug-sursă, NU numele.** Setează `products.sku` = cheia sursă la import (`bulk_create_products(sku=<cheie>)`). Altfel `bulk_create_products` deduplică pe NUME și îmbină tăcut produse distincte → pierdere de date care „trece" la numărătoare.
4. **Niciodată tot catalogul într-o singură trecere.** Descompune în loturi mici (≤25 produse / 1 pagină) date la **sub-agenți** (Task tool) cu context curat; tu (liderul) ții doar coada + tally-ul, nu HTML-ul paginilor.
5. **Coada trăiește pe DISC** (`.symbai-clone/`), nu în context. La fiecare iterație/sesiune nouă, **prima acțiune = re-citește coada** și reia; nu te baza pe memorie după compactare.
6. **„Buget epuizat" ≠ „complet".** Dacă atingi un plafon de timp/cost, starea finală e INCOMPLET cu numărul de ID-uri rămase afișat — niciodată COMPLET.
7. **Idempotent.** Re-rularea unui lot trebuie să fie no-op (cheia stabilă + dedup Symbai). Verifică prin CITIRE a câmpurilor, nu prin „tool success".

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
8. După fiecare lot, actualizează `progress.json`. Liderul citește doar header-ul + cere următorul lot — nu încarcă tot catalogul în context.

### Faza 4 — Verifică (cele 3 porți obiective, în ordine)
9. **Poarta 1 — acoperire produse: `clone_parity_diff(jobId, brandId)`**. Dacă `pass:false`: pentru fiecare ID din `missingSample` → `get_cached_page` → re-importă. Re-rulează până `pass:true`.
9b. **Poarta 2 — calitate produse: `clone_fidelity_audit(jobId, brandId)`**. Pentru fiecare intrare din `worstSample` (produs + câmpuri lipsă) → `get_cached_page(jobId, url)` → completează câmpul: poze (`set_product_image`/`bulk_set_product_images`), descriere/preț-vechi/specs (`update_menu_item`/`add_menu_item`), categorie (`set_products_menu_category`). Re-rulează până `pass:true`. Citește `flags`: `unreadable_source_pages_*` → re-citește sursa; `price_currency_mismatch_suspected` → verifică valuta; `unaudited_fields_*` → câmp absent în sursă (nimic de făcut).
9c. **Poarta 3 — non-produs: `clone_coverage_audit(jobId, brandId)`**. Pentru fiecare `missingSample` per dimensiune → importă din `get_cached_page`: categorii (`create_menu_category`/`bulk_reparent_menu_categories`), blog (`bulk_create_blog_posts`), pagini legale (`set_website_legal_page`). Re-rulează până fiecare dimensiune ≥95%.
9c-arbore. **Arbore categorii (advisory): `clone_category_tree_audit(jobId, brandId)`**. `pass` poate fi `null` (sursă fără breadcrumb-uri = neauditabil, OK). Dacă `pass:false` sau `flatteningDetected:true`: pentru fiecare `missingEdgesSample` (`parent>child`) → `create_menu_category` (categoriile lipsă) + `bulk_reparent_menu_categories` (leagă copil→părinte, ca arborele să nu fie plat). Re-rulează până `pass` ∈ {`true`, `null`}.
9c-branding. **Branding (advisory): `clone_branding_audit(jobId, brandId)`**. `pass` poate fi `null` (sursă fără semnale vizuale). Dacă `pass:false`: din `data.source` → `update_brand(brandId, logo=<source>, color=<themeColor>, name?)` + `brandIdentity` (logos/colors/socialMedia); contactul (telefon/email/adresă din `data.source`) → `update_location`. Re-rulează până `pass` ∈ {`true`, `null`}.
9d. **`audit_shop_health(brandId)`** → repară toate `error`, re-rulează până curat.
9e. **SEO — redirecturi 301: `clone_redirect_map(jobId, brandId, apply:true)`**. După ce porțile trec, scrie 301-uri din URL-urile VECHI (produs/categorie) spre cele noi Symbai, ca firma să NU piardă pozițiile Google când mută domeniul. Rulează ÎNTÂI dry-run (fără `apply`) ca să vezi `unmatched`/`noSlug`/`chainsSkipped`; dacă `unmatched` e mare, mai întâi închide golurile (parity/coverage), apoi `apply:true`. (Esențial la o migrare reală cu trafic.)

### Faza 5 — Nu te opri până nu e gata
10. Buclă până: coada goală (0 pending în `list_clone_crawl_pages`) ȘI cele 3 porți `pass:true` (`clone_parity_diff` + `clone_fidelity_audit` + `clone_coverage_audit`) ȘI `audit_shop_health` fără `error`.
11. **Pentru rulare pe ore, nesupravegheat** (owner-ul a plecat): instalează un agent programat care reia skill-ul cât timp mai există pending (vezi `references/harness.md` §Nu-te-opri + skill-ul `schedule`). Hook-ul Stop (dacă e instalat) e podeaua dură. `/loop` e bucla din sesiune.
12. Re-citește `progress.json` la fiecare reluare; revendică rândurile `in_progress` rămase blocate înapoi la `pending`.

## Raport onest (la final)
Nu spune „gata" decât la PASS real pe TOATE trei porțile. Raportează: produse importate / numitor + `fidelityScore` (calitate câmpuri, din Poarta 2) + acoperirea non-produs (categorii/blog/pagini legale, din Poarta 3), poze %, ID-uri pe dead-letter (cu motiv: 404/login/fără preț), și ce a rămas NESIGUR. Dacă numitorul a fost nesigur, spune-o. Rezumă userului 3-4 lucruri cheie făcute, în limbaj de business.

## Capcane (vezi și harness.md)
- Site fără sitemap (unele OpenCart) → `discover_site_inventory` întoarce 0 cu `no_independent_count`. NU înseamnă „site gol" — înseamnă „nu pot stabili scopul din sitemap"; pornește crawl-ul (folosește link-crawl/categorii) și marchează numitorul nesigur.
- Magento: sitemap-ul de produse supranumără (include produse scoase din stoc). Numitorul din sitemap = plafon superior, marcat nesigur — reconciliază cu listing-urile.
- Poze: trec prin URL sursă la `set_product_image` (Symbai le ia); dacă CDN-ul sursă cade, re-rulează din cache.
- TVA România = 21 (nu 19). Idempotency pe SKU, nu pe nume.
