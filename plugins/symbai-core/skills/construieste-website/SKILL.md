---
name: construieste-website
description: Construiește, îmbunătățește și configurează SITE-UL PUBLIC / magazinul online al brandului prin conexiune (MCP) — pagini, componente, componente custom HTML/CSS, ierarhie de categorii, filtre faceted, hero, footer, pagini legale (Despre/Contact/Termeni/ANPC), bară de anunțuri, logo, promoții, temă, ȘI pagina de produs completă (galerie, descriere lungă, specificații, preț redus, garanție, FAQ, accesorii, pachete, video). Folosește la „fă-mi un site / magazin online", „construiește-mi magazinul", „adaugă filtre / categorii / subcategorii pe site", „site-ul arată gol / categoriile sunt goale", „pune un hero / banner / footer mai bun", „adaugă pagina Despre / Termeni / Livrare", „vreau o componentă custom / ceva diferit de componentele standard", „de ce nu apar produsele pe categorie", „fă site-ul să arate ca un magazin mare", „pune o bară de anunțuri / pop-up de reduceri", „adaugă bară de încredere / trust bar", „pune 14 zile retur / transport gratuit sus pe site", „bara de sus cu beneficii", „personalizează antetul magazinului", „schimbă aspectul / culorile site-ului", „fă pagina de produs completă", „produsul arată sărac pe site", „adaugă specificații / garanție / FAQ la produs", „pune accesorii compatibile / produse recomandate", „pune un pachet cumpărate frecvent împreună", „adaugă galerie de poze la produs", „pune preț redus / rate / video / certificări pe produs". NU pentru: comenzi online/eMAG/feeds/retururi (→ gestioneaza-ecommerce-emag), portalul clienților de la masă (→ configureaza-portal).
---

# Construiește website / magazin online — hands-free, prin conexiune + link direct

Proprietarul vrea un **site public / magazin** care arată și funcționează bine — fără să umble prin builder. Tu faci munca prin **tool-urile MCP** (date + acțiuni reale pe instanța lui) și-i **arăți** rezultatul deschizând pagina cu link direct + screenshot. Vorbește pe limba lui de business („site", „magazin", „pagina Despre", „filtre", „categorii") — niciodată „MCP/tool/component/JSON".

## Înainte de orice
1. Citește **`knowledge/agent-operare-avansata.md`** (standardul de execuție cap-coadă), **`knowledge/website-builder.md`** (ce poate face builder-ul, toate componentele, tool-urile, rețeta rapidă, capcanele), **`knowledge/website-copy-intake.md`** când userul cere copiere/replicare de site existent (crawl, URL map, dropdown-uri, hero slider, pagini-cheie, verificare), **`knowledge/website-builder-pdp.md`** (🛍️ pagina de produs COMPLETĂ: galerie, descriere lungă, specificații, preț redus, garanție, FAQ, accesorii, pachete, video — listă de bife + tool per câmp), **`knowledge/website-best-practices-2026.md`** (⭐ best-practice moderne de e-commerce + cifrele de conversie + cum le EXPLICI clientului — aplică-le la fiecare build) și **`knowledge/condu-chrome.md`** (cum arăți paginile: deep-link + screenshot). Pentru catalog/produse leagă `knowledge/produse-meniu-retete.md`; pentru textul descrierilor (SEO/anti-duplicat) `knowledge/descrieri-produse-seo.md`; pentru comenzi/eMAG `knowledge/ecommerce-magazin-online.md`; pentru import dintr-un site existent `knowledge/onboarding/02d-import-surse-externe.md`.
2. **Context (citiri, fă-le întâi):** `list_brands` (+ `list_locations`) → `brandId`. `list_websites(brandId)` → există deja un site? ce `id`/`kind`? `get_website_page(brandId)` → index pagini + `navbar` + `global` curent. `list_website_component_catalog(includeSchema:true)` → ce componente/config-uri ai la dispoziție (inclusiv `custom-html` și props precum `text-image.html`/`imageBoxColor`). `get_ecommerce_settings(brandId)` → monedă/TVA/checkout. `list_menus`/`list_menu_items` → are catalog cu prețuri? `list_menu_categories` → câte categorii, au ierarhie? `browse_brand_media(brandId)` → poze pentru hero/logo.
3. **Permisiune** pe token: `setari` (scrierile de site/footer/legale/promoții) + `produse_meniu` (categorii/produse/atribuiri). Fără modul → scrierea întoarce „permisiune insuficientă" → userul bifează modulul în Hub → Acces AI.

## Regula pentru componente
1. Încearcă întâi componentele existente din catalog și combinații între ele (`hero-slider`, `static-menu-board`, `feature-cards`, `product-grid`, `faq`, `cta-banner`, `gallery`, `trust-badges`, etc.).
2. Folosește `custom-html` doar dacă cerința chiar nu se exprimă bine cu componentele standard sau userul cere explicit ceva foarte diferit/fidel unei surse.
3. Când folosești custom, scrie HTML semantic + CSS în câmpul `css`; evită script, handler-e inline, `style=""`, submit extern, URL-uri `javascript:`/`data:`/`blob:`, at-rule-uri CSS (`@media`/`@import`/`@supports`) și iframe-uri neconfirmate.
4. După custom, verifică vizual pagina; dacă sanitizerul a returnat warnings, repară HTML/CSS-ul și rescrie componenta.

## Decizia de start
- **Nu există site** → propune să-l creezi: `create_website(kind: shop|site, makeDefault:true)` → `apply_website_template(confirmReplace:true)` (preia culoarea brandului). `shop` = magazin; `site` = prezentare (restaurant/local).
- **Există dar arată slab / gol / fără filtre** → mergi pe lista de îmbunătățiri de mai jos, în ordinea impactului.
- Confirmă planul O DATĂ, apoi rulează lanțul fără re-întrebări.

## Replici un site existent? Intake MCP → screenshot → replică → compară → îmbunătățește
> **⚠ Pentru un site MARE / catalog de sute-mii de produse / „copiază TOT site-ul" → folosește skill-ul `copiaza-website`** (orchestrare pe ore, coadă durabilă, sub-agenți, verificare cu `clone_parity_diff`). `analyze_external_website` de mai jos vede maxim 24 de pagini — bun pentru intake rapid pe site mic, INSUFICIENT pentru un catalog mare (ai copia ~20% și ai părea gata). Uneltele de copiere completă: `discover_site_inventory` (numitor onest) → `start_site_clone_crawl` (crawl pe server) → `list_clone_crawl_pages`/`get_cached_page` (mapezi) → `clone_parity_diff` (poarta „gata").

Dacă userul îți dă un URL („fă-mi site ca X" / „copiază magazinul de pe Y") pentru un site mic/mediu:
1. **Rulează `analyze_external_website(url, crawlPages:true, maxPages:12)`** înainte de orice scriere. (12 e suficient pentru intake rapid; plafonul real al tool-ului e **24** — mărește `maxPages` dacă site-ul are mai multe pagini-cheie. Peste ~24 → `copiaza-website`.) Păstrează `sourceBrief`: SEO, logo/favicon, culori/fonturi, linkuri, CTA-uri, imagini/video, secțiuni, JSON-LD, `crawl.pages`, `crawl.urlMap`, `crawl.canonicalSlugs` și indicii de framework (ex. Next.js). Dacă știi pagini critice (meniu, blog, galerie, categorie/produs), pune-le în `pageUrls`. Dacă sursa are meniu restaurant, caută în `__NEXT_DATA__`/Strapi componente precum `ComponentCmsDataProductsList` și extrage toate categoriile, produsele, pozele din `attributes.media`, gramajele, ingredientele, alergenii și informațiile nutriționale. Dacă tool-ul nu poate citi pagina, explică blocajul și treci pe screenshot/manual.
   - **Blog-ul se trateaza ca modul separat, nu ca simpla pagina.** Daca sursa are `/blog`, link "Blog", RSS, sitemap sau articole in footer/header, inventariaza toate paginile paginated (`/blog/`, `/blog/page/2/`...), numara articolele sursa si compara cu `list_blog_posts(brandId)`. Creeaza pagina `/blog` cu componenta `blog-listing`, apoi importa articolele prin `bulk_create_blog_posts` (sau `create_blog_post` daca bulk nu exista in instanta curenta), pastrand `title`, `slug`, `publishedAt`, `coverImageUrl`, `excerpt`, `content`, `category`, `author`, `canonicalUrl` si `legacyPath`; verifica `redirectsCreated` si 1-2 URL-uri vechi. Nu declara copia gata daca articolele sursa lipsesc sau sunt inlocuite cu 1-2 drafturi placeholder.
2. **Deschide sursa și fă screenshot-uri** (prin extensia Chrome) la: header + bara de categorii, megamenu deschis, o pagină de categorie, o pagină de produs, footer. Notează STRUCTURA reală — **ierarhia de categorii o iei din breadcrumb-uri, nu din grupările vizuale ale meniului** (anteturile de megamenu pot fi doar vizuale, nu categorii reale).
3. **Replică** prin tool-urile MCP, mapând `sourceBrief.sections` pe `set_hero` / `add_website_section` / `set_website_page_content` / `set_website_pages` (bulk, cand ai multe pagini) / `upsert_custom_website_component`, `sourceBrief.navigation` pe `update_website_navigation(items[], navbarSettings{})`, `sourceBrief.branding` pe `set_website_theme` + logo, iar footerul pe `set_website_footer`. Pentru catalog: produse → categorii → filtre → PDP → legale. După fiecare scriere de pagină/temă/navbar, confirmă cu `get_website_page`.
4. **Aplică best-practice-urile** din `website-best-practices-2026.md` (nu copia orbește dacă sursa are pattern-uri slabe — îmbunătățește-le).
5. **Fă screenshot la CE AI CONSTRUIT** și **compară side-by-side cu sursa**. Caută diferențe: categorii goale, filtre lipsă, megamenu plat, hero gol, footer cu sute de linkuri.
6. **Îmbunătățește** până arată cel puțin la fel de bine ca sursa (ideal mai bine). **Nu spune „gata" până nu ai VĂZUT screenshot-ul tău corect + audit curat.** Pentru import asistat pas-cu-pas vezi și skill-ul `importa-date`.

### Checklist obligatoriu când COPIEZI fidel un site
Înainte de „gata", bifează explicit:
- **URL map / SEO:** păstrează slug-urile canonice din `crawl.urlMap` (ex. `/meniu`, `/blog`, `/galerie`, pagini de atracții/programe). Nu schimba URL-urile dacă sursa le are deja indexate.
- **Header real:** logo lizibil, culori, meniu de sus și dropdown/mega-menu cu toate grupurile importante. Nu transforma dropdown-ul într-o listă plată.
- **Hero real:** toate slide-urile, imaginea fiecărui slide, culoarea cardului/textului, punctele/săgețile, CTA-ul și destinația fiecărui slide. Daca sursa are 3 butoane pe hero, foloseste `showTertiaryCta:true` + `tertiaryCtaText`/`tertiaryCtaUrl`, nu custom.
- **Pagini reale:** homepage + pagini meniu/catalog + atracții/servicii + blog + galerie + contact/footer. Dacă sursa are multe pagini, creează cel puțin paginile din nav și cele detectate în `canonicalSlugs`.
- **Blog real:** daca sursa are blog, inventarul trebuie sa contina `sourceArticleCount`, paginile paginate gasite, articolele importate in Symbai (`list_blog_posts`) si pagina `/blog` cu `blog-listing`. Reviewerul trebuie sa refuze PASS daca exista blog sursa si local ai doar pagina goala, carduri statice sau articole placeholder.
- **Meniu/produse reale:** pentru restaurant, verifică numărul de categorii/produse/poze față de sursă. Nu pune doar produse exemplu. Dacă scrii în POS, fă întâi audit read-only (`list_menus`, `list_menu_items`, `search_products_db`, `get_product_details`) și apoi dry-run/confirmare pentru import sau update masiv. Bara orizontală de categorii trebuie să rămână sticky, să evidențieze categoria activă, să se recentreze și să deruleze la secțiunea corectă la click.
- **Componente lipsă:** dacă builder-ul nu poate exprima fidel o zonă (ex. meniu restaurant static importat, card hero colorat per slide, calculator, tabel special, accordion diferit), caută întâi în `list_website_component_catalog` și încearcă variante standard/combinări. Dacă nu există componentă standard potrivită, folosește `upsert_custom_website_component` cu `custom-html` (HTML/CSS scoped + `data-wb-action`) și checklist-ul de siguranță din `website-builder.md`. Nu declara copia terminată doar pentru că blocul standard lipsește.
- **Comparație vizuală:** verifică homepage, dropdown deschis, o pagină de meniu/catalog, o pagină de atracție și blog/galerie. Dacă browserul nu merge, spune blocajul și validează cât poți prin build + HTTP + screenshot-uri date de user.

### Capcane de mapare componentă (fidelitate de design) — citește înainte de a mapa secțiuni
Aceleași greșeli au stricat o clonă reală (drimoland.ro, Strapi/Next). Bifează-le pe FIECARE secțiune (detalii complete: `../../knowledge/website-copy-intake.md` + skill-ul `copiaza-website`):
- **Culorile sunt SEMANTICE — nu vopsi o secțiune întreagă cu o culoare-accent.** Calibrează pe culorile COMPUTED ale site-ului real (inspectează în Chrome): navy = eroi, light-blue = benzi de conținut, roz/galben = ACCENTE (boxuri, benzi de recenzii), niciodată erou full-bleed. O culoare de „box" din sursă (ex. DarkTextBox) e boxul din spatele IMAGINII, nu fundalul secțiunii. Un text+imagine fără culoare → fundal light implicit, FĂRĂ box inventat.
- **Poza e des în câmp neevident** (`image` gol; reală în `imageMask`/`picture`/`heroSectionSliderItems[]`/`backgroundImage`). Probează TOATE câmpurile de imagine înainte să spui „fără poză". Cutia decorativă din spate = o IMAGINE (`imageBackgroundMask`), nu o culoare.
- **Recenzii doar-imagine** (screenshot, fără text) → `gallery`, nu testimoniale goale; recenzii cu text+poză → `testimonials` cu stil valid (`cards`, `carousel`, `minimal`, `magazine`, `masonry`, `bubbles`) sau `custom-html` scoped pentru layout image-top fidel. Nu folosi `style:"photo"`: nu mai este enum valid în catalog. **Tabele de preț** → componenta `pricing`. **Liste „scroll list"** → carduri din itemele imbricate + poza de secțiune. **ProductsList** ca secțiune de pagină → imaginea de meniu.
- **Carusele**: un `Slider` cu `type:"circle"` (Strapi) e un CARUSEL orizontal glisabil → componenta **`feature-carousel`** (carduri imagine+titlu+text+link, săgeți), nu grilă statică `feature-cards`. Atenție: link-ul itemului e în câmpul **`link`**, nu `buttonUrl`. Numărătoarea inversă (`countDownTimer` cu `endDate`) → componenta **`countdown`** (fără `endDate` nu se randează — nu inventa o dată).
- **Link-uri din corpul rich-text / `custom-html`** NU trec prin localizator → rescrie-le MANUAL la slug-ul intern (altfel clickul pleacă de pe clonă).
- **Navbar = meniul REAL** (itemi de top + dropdown-uri + href-uri), reconstruit 1:1 cu `update_website_navigation items[]` (suport `children[]`). Nu lăsa lista auto „o intrare per pagină". Ascunde butonul CTA din dreapta dacă originalul n-are: `navbarSettings:{ctaButton:{visible:false}}`. Daca sursa are meniu lateral fix stanga, seteaza `navbarSettings:{style:"sidebar-left", sidebarBg, sidebarTextColor, socialLinks:[...]}`.
- **NU activa „extra"-uri decorative implicite pe care sursa nu le are**: blog `showSidebar`/newsletter, badge „Popular"/„Recomandat", toggle de facturare lunar/anual, „featured hero". Un element ÎN PLUS strică fidelitatea la fel ca unul lipsă.
- **Fiecare rută randează conținutul EI** (acasă ≠ meniu; `/blog` = listarea blogului; `/<pagină>` = pagina ei). Un fallback tăcut la home = pagină LIPSĂ, nu PASS.
- Verifică prin **citire** (`get_website_page` întoarce componentele live ale unei pagini) + **vizual în Chrome** lângă original.

### Cum iei BRANDING-ul (logo, favicon, culori, font) de pe sursă — corect din prima
Logo-ul e cel mai des copiat GREȘIT. Reguli:
- **Logo + favicon + imagine social**: caută în HTML-ul sursei `<link rel="icon">` (favicon), `<meta property="og:image">` (imagine de share) și `<img>`-ul din header cu `alt`/`title` = numele site-ului (logo-ul principal).
- **⚠ GOTCHA lazy-load**: multe logo-uri (mai ales cele de brand) sunt încărcate „leneș" — `src` conține un placeholder base64 (un pixel), iar **URL-ul REAL e în `data-src` / `data-srcset`**. Dacă iei `src` orbește, copiezi placeholder-ul gol. Citește `data-src`.
- **⚠ GOTCHA format**: logo-urile sunt des `.webp` și la căi de tip `…/image/cache/…-WxH.webp` (redimensionate). Ia rezoluția mare; uneori originalul ne-cache-uit există la `…/image/…/NUME.png`. Verifică ce e de fapt fișierul (un `.webp` poate fi PNG servit).
- **Culoarea brandului**: NU lua culorile din CSS-ul de bază (sunt des Bootstrap default — albastru #337ab7 etc.). Ia **culoarea dominantă/saturată din LOGO** (ex. auriu, verde) ca accent. Fontul: din `<link href="fonts.googleapis.com/css?family=…">`.
- **Aplică pe site**: logo-ul → logo-ul din header (navbar); favicon-ul → favicon; culoarea → accentul temei; fontul → fontul site-ului. **Dacă logo-ul (imaginea) conține deja numele brandului, OPREȘTE textul-nume de lângă logo** (altfel apare dublu).
- **VERIFICĂ vizual**: deschide site-ul și fă screenshot — logo-ul trebuie să fie LIZIBIL (nu minuscul: un wordmark cu text are nevoie de înălțime mai mare decât un icon) și fără text dublat. Nu declara gata până nu-l vezi corect.

## Update 2026-06-24 - optiuni website de folosit in executie

Cand userul cere un site "ca X" sau vrea un homepage/landing mai premium, verifica intai catalogul si foloseste aceste optiuni native:

- `hero-slider` + `heroLayout:"diagonal-split"` pentru hero corporate cu poza full-bleed si panou colorat diagonal in stanga. Seteaza `backgroundColor`, `diagonalAccentColor`, `panelWidth`; pastreaza slideshow-ul daca sursa are mai multe slide-uri.
- `slides[].titleAccent` pentru titlu bicolor / al doilea rand accentuat. E mai bun decat custom HTML pentru headline-uri de brand.
- `feature-cards` + `style:"divided"` + `cards[].linkText` pentru beneficii in coloane minimaliste cu separatoare verticale; foloseste `titleAlign` si `\n` in `title` pentru headline-uri de sectiune aliniate stanga/dreapta sau pe doua randuri.
- `tabbed-cards` pentru locatii/servicii/proiecte filtrate pe pastile (`tabs[]`, `cards[].tab`, `showAllTab`). Alege-l inainte de `custom-html` pentru sectiuni tip "Our locations" pe regiuni.
- `set_website_theme(backgroundColor, textColor?)` si in light mode cand site-ul sursa are fundal cream/warm/branded; rendererul nu mai forteaza alb daca exista `backgroundColor`.
- `set_website_footer(description, paymentMethods, showAnpc, socialLinks)` cand footerul sursei are descriere brand, badge-uri Visa/Mastercard/Maestro, ANPC/SOL sau platforme sociale custom (`tripadvisor`, `whatsapp`, `booking`).
- `update_website_navigation(items[], navbarSettings{})` aplica direct stil/logo/search/login/CTA/sidebar. Dupa scriere, verifica read-back cu `get_website_page`; nu folosi `update_menu_display_config` doar pentru navbar.
- `navbarSettings.transparent:true` suprapune navbar-ul peste hero doar pe pagini care incep cu hero/hero-slider; pe pagini light foloseste solid + `logoUrlDark`. Pentru magazine multi-valuta seteaza `showCurrency:true` si `currencies:["RON","EUR",...]`; verifica screenshot home + subpagina.

Explica userului rezultatul in limbaj vizual ("am reprodus hero-ul cu panou diagonal si titlu bicolor", "am pus footer cu metode de plata si ANPC"), apoi arata link/screenshot cand browserul e disponibil.

## Cheat table — ce cere userul → ce faci

| Userul cere | Tool MCP (acțiune) |
|---|---|
| „fă-mi un magazin online de la zero" | `create_website(kind:"shop", makeDefault:true)` → `apply_website_template(confirmReplace:true)` |
| „categoriile sunt goale când dau click" | construiește ierarhia: `create_menu_category(parentId)` / `bulk_reparent_menu_categories` + leagă produsele cu `set_products_menu_category` |
| „nu am filtre / vreau filtre ca la magazine mari" | activează `showFacets`+`showFilters` pe grila de produse + populează `productBrand`/`material`/`ageRangeMin`/`ageRangeMax`/`interestCategory` prin `add_menu_item`/`update_menu_item` |
| „pune un banner / hero pe prima pagină" | `set_hero(imageUrl, title, subtitle, ctaText, ctaUrl)` (imaginea din `browse_brand_media` sau un produs reprezentativ) |
| „footer mai bun (contact, social, linkuri)" | `set_website_footer(contactInfo, socialLinks, columns, copyright, fillContactFromCompany:true, rebuildCategoriesColumn:true)` |
| „adaugă pagina Despre / Contact / Termeni / Livrare / Retur / Confidențialitate / FAQ" | `set_website_legal_page(slug, title, bodyParagraphs, fillCompanyData:true)` — pagini SSR, indexate, conform ANPC |
| „meniul de sus să arate categoriile reale" | `update_website_navigation(rebuildCategoriesFromCatalog:true)` (sau `items[]` pentru control; `items[].children[]` = dropdown-uri; pentru buton/search/login/transparent/sticky folosește `navbarSettings{}`, ex. `navbarSettings:{ctaButton:{visible:false}}`; pentru meniu lateral: `navbarSettings:{style:"sidebar-left", sidebarBg, sidebarTextColor, socialLinks:[...]}`) |
| „verifică / citește ce am pus pe o pagină" | `get_website_page(brandId, pageSlug)` → toate componentele live (id/type/config); fără slug → indexul paginilor + navbar |
| „adaugă o secțiune (produse featured / branduri / avantaje)" | `add_website_section(type, config, pageSlug)` |
| „vreau ceva custom / diferit de componentele standard / fă exact secțiunea asta" | întâi `list_website_component_catalog(includeSchema:true)` și încearcă standard; dacă nu ajunge: `list_website_component_catalog(type:"custom-html", includeExamples:true)` → `upsert_custom_website_component(brandId, pageSlug, html, css, sectionId?)`; folosește `data-wb-action` pentru interacțiuni fără JS |
| „bară de anunțuri sus (livrare, reduceri)" | `add_website_section(type:"announcement-bar", config:{messages:[...]})` |
| „pop-up de abonare / banner de reduceri" | `create_website_promotion(placement: side-modal|banner|header-strip|footer-strip)` |
| „bară de încredere / trust bar / 14 zile retur + transport gratuit sus pe toate paginile" | `configure_storefront_trust_bar(brandId, pillars:[{icon,text}], position:"above-nav"\|"below-nav")` — piloni retur/transport/fidelizare/rate, pe toate paginile. Iconuri: truck/gift/rotate-ccw/shield/star/credit-card/award/check/clock/heart. `pillars:[]` ascunde bara. Vezi `website-builder.md` → „Bara de încredere". |
| „schimbă culorile / aspectul" | `set_website_theme(primaryColor, secondaryColor, accentColor, backgroundColor, textColor, fontFamily, headingFont, siteName, tagline)`; apoi `get_website_page` ca să vezi `global` actualizat |
| „adaugă variante (mărimi/culori) la produs" | `set_product_variants(productId, variants)` |
| „TVA-ul e greșit (19%)" | corectează la **21%** (cota standard RO): `update_ecommerce_settings` + produsele (TVA pe produs) |
| „pune reduceri / preț tăiat / badge -N%" | `add_menu_item`/`update_menu_item` cu **`compareAtPrice`** = prețul VECHI (mai mare); `price` = prețul redus. Storefront-ul afișează automat strikethrough + „-N%". NU mai trebuie variante. (Reduceri pe tot catalogul = batch `update_menu_item` cu compareAtPrice.) |
| „poze curate pe categorii (nu din primul produs)" | `update_menu_category_fields(categoryId, imageUrl)` — imagine reprezentativă per categorie (tile category-grid). `clear:["imageUrl"]` = revine la derivare din primul produs. |
| „video pe pagina de produs" | `update_menu_item(menuItemId, videoUrl)` — YouTube/Vimeo/CDN, afișat pe pagina de produs. |
| „badge-uri de certificare (EN71/OEKO-TEX/CE)" | `add_menu_item`/`update_menu_item` cu **`safetyCert: ["EN71","OEKO-TEX"]`** — badge pe card/pagină. |
| „fă pagina de produs completă / produsul arată sărac pe site" | rețeta din `knowledge/website-builder-pdp.md` (galerie + descriere lungă + specificații + preț redus + garanție + FAQ + accesorii/pachet) |
| „adaugă galerie de poze la produs" | `bulk_set_product_images` (mai multe deodată; prima = coperta) / `set_product_image` (una) |
| „descriere lungă / detaliată pe produs (tab Descriere)" | `update_menu_item` cu **`descriptionHtml`** (text bogat: titluri/liste/poze/tabele); `description` = textul scurt |
| „adaugă specificații (tabel) la produs" | `update_menu_item` cu **`specs: [{label, value}, ...]`** (sau în masă: `bulk_set_product_custom_values`) |
| „adaugă garanție / cod produs vizibil" | `update_menu_item` cu **`warrantyMonths`** (ex. 24) și/sau **`displaySku`** (ex. „1179/1341") |
| „adaugă întrebări frecvente (FAQ) la produs" | `update_menu_item` cu **`faq: [{q, a}, ...]`** — 3-5 întrebări reale |
| „pune etichete (transport gratuit / nou / bestseller)" | `update_menu_item` cu **`badges: ["free_shipping","installments","new","bestseller","eco"]`** |
| „pune rate fără dobândă" | `update_menu_item` cu **`installmentMonths: [3,6,12]`** → „Plătește în până la N rate" |
| „pune accesorii / produse recomandate / similare" | `set_product_recommendations` (cu tip de relație: accesorii / similare / complementare) |
| „pune un pachet «cumpărate frecvent împreună»" | `set_product_bundle` (produs principal + produse din pachet + reducere opțională) |

## Ordinea de impact când „faci site-ul ca lumea" (de sus în jos)
1. **Catalog complet** — produse cu poze + preț + TVA 21 + brand/material/vârstă.
2. **Ierarhia de categorii** — 8-12 părinți în meniu, restul subcategorii; fiecare produs pe frunza lui + `set_products_menu_category`. (Rezolvă „categorii goale" + meniu copleșitor + filtre pe categorie.)
3. **Filtre** — `showFacets`+`showFilters` pe grila de produse.
4. **Hero** pe Acasă (imagine reală).
5. **Footer + pagini legale** (Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ, `fillCompanyData`).
6. **Pagini de produs bogate** (cel puțin pe best-sellers) — vezi secțiunea de mai jos.
7. **Anunțuri + logo + bară de încredere + promoții** — bara de încredere (pilonii „14 zile retur / transport gratuit / fidelizare / rate", pe toate paginile) prin `configure_storefront_trust_bar`; rețeta + exemple în `website-builder.md` → „Bara de încredere".
8. **Comandă test** (vezi `ecommerce-magazin-online.md`).
9. **⚠ VERIFICĂ cu `audit_shop_health` + repară** (vezi mai jos) — ÎNAINTE de a-i spune userului că e gata.

## 🛍️ Pagina de produs completă (PDP) — „produsul arată sărac pe site"
Când userul cere o pagină de produs bogată (ca la Bebebliss/eMAG) sau spune că „produsul arată sărac", **urmează rețeta din `knowledge/website-builder-pdp.md`** (listă de bife + tool per câmp). Pe scurt, completezi pe `update_menu_item` (plus poze/recomandări/pachet):
- **Galerie ≥3 poze** (`bulk_set_product_images`, prima = coperta) + **descriere lungă** (`descriptionHtml`; `description` rămâne textul scurt) + **specificații** (`specs`, sau `bulk_set_product_custom_values` pe multe produse).
- **Preț redus** (`compareAtPrice` = preț vechi) + **garanție** (`warrantyMonths`) + **cod produs** (`displaySku`) + **certificări** (`safetyCert`) + **etichete** (`badges`) + **rate** (`installmentMonths`).
- **FAQ** (`faq`) + **video** (`videoUrl`).
- **Accesorii / similare** (`set_product_recommendations`) + **pachet «cumpărate frecvent împreună»** (`set_product_bundle`).
- **Import dintr-un magazin existent**: dai URL-ul produsului/site-ului → se preiau pozele, descrierea și specificațiile pe produs (detaliu în `website-builder-pdp.md` + secțiunea „Replici un site existent" de mai sus). **Nu inventa** garanție, certificări sau specificații care nu sunt reale.
- **Verifică**: deschide pagina produsului (deep-link + screenshot) — galerie, tab-uri, specificații, preț redus, FAQ, accesorii. Nu spune „gata" până n-ai văzut pagina plină.

## ⚠⚠ VERIFICARE OBLIGATORIE — auto-corectează-te, nu aștepta ca userul să-ți găsească greșelile
După ORICE build sau import de magazin, **RULEAZĂ `audit_shop_health(brandId)`**. Întoarce probleme cu severity `error`/`warn` + statistici (categorii goale/plate/gunoi, TVA în afara 0/11/21, % filtre brand/material/vârstă, email placeholder, navbar/footer prea mari, hero fără imagine, produse fără poză).
- **Repară TOATE problemele `error`** (sunt cele care strică funcțional magazinul: categorii goale la click, TVA greșit, email placeholder), apoi **re-rulează `audit_shop_health` până nu mai sunt `error`**.
- Abia când auditul e **fără `error`** îi spui userului că e gata. **NU declara „gata" pe baza lui «am rulat tool-ul» — declară pe baza unui audit curat.**
- `warn`-urile (filtre sărace, poze lipsă) — îmbunătățește-le cât poți; dacă rămân, spune-i userului EXPLICIT ce mai e de făcut (nu le ascunde).
- Greșeli frecvente pe care auditul le prinde (și cum le repari): categorii PLATE → `bulk_reparent_menu_categories`; categorii GOALE → leagă produse pe frunza reală (`set_products_menu_category`) sau șterge; TVA 19 → 21; email `[email protected]` → email real; navbar/footer cu sute de categorii → `update_website_navigation`/`set_website_footer` rebuild din rădăcini; filtre goale → populează brand/material/vârstă pe produse.

## Explică-i clientului DE CE (asta crește conversia)
La FIECARE lucru important pe care-l pui, **spune-i clientului în limbaj de business de ce l-ai pus și cum îi crește vânzările** — nu doar „am făcut X". Folosește cifrele din `website-best-practices-2026.md`. Șablon: *„Am pus **[ce]** pentru că **[de ce / cifra]** — în practică înseamnă **[mai mulți clienți care găsesc produse / coș mediu mai mare / mai puțin abandon]**."*
- Bară de categorii dedicată → „clientul vede tot ce vinzi dintr-o privire, nu se mai pierde".
- Megamenu cu grupuri + hover lin → „găsește subcategoria mai repede, fără meniu care clipește".
- Produse similare / vizualizate recent pe pagina de produs → „clientul are mereu unde merge mai departe → crește coșul mediu".
- „Mai ai X lei până la transport gratuit" → „80% din clienți mai adaugă un produs ca să prindă pragul".
- Filtre pe categorie (vârstă/brand/preț) → „găsește exact ce caută în câteva clickuri, nu derulează prin mii de produse".
- Categoria activă evidențiată + breadcrumb → „știe mereu unde e, nu se rătăcește".
La final, **rezumă-i 3-4 îmbunătățiri cheie cu impactul lor pe conversie**, nu o listă tehnică.

## Reguli
- **Confirmă înainte de `apply_website_template(confirmReplace:true)`** — rescrie structura paginilor.
- **Despre/Contact/legale = `set_website_legal_page`**, NU un bloc de text (sunt pagini SSR separate, indexate).
- **Custom = fallback controlat**, nu prima opțiune: folosește componentele existente când se poate; dacă e musai, `upsert_custom_website_component`, fără hack-uri în global CSS și fără promisiuni că „nu se poate”. HTML-ul custom este script-free; pentru click/coș/navigare/accordion folosește `data-wb-action` și respectă checklist-ul de siguranță (vezi `website-builder.md` → `custom-html`).
- **Verifică prin LINK** — după scriere, deschide pagina (deep-link via `gaseste_in_aplicatie` + screenshot prin extensia Chrome), nu te baza pe „am rulat tool-ul". Fără extensie poți opera, dar nu-i poți arăta — spune-i și oferă conectarea.
- **Confirmă după scriere cu citire** (`get_website_page` pentru pagini/temă/navbar, `list_websites` pentru existența site-ului, `get_ecommerce_settings` pentru checkout, `get_portal_config` pentru portal) — interfața are cache (userul vede după refresh). Succes la tool = salvat; nu repeta.
- **TVA România = 0/11/21** (standard 21). Nu 19.
- Acțiuni care ies în afară (publicare, trimitere) → confirmă întâi.

## Capcane (din `website-builder.md`)
- Pagini legale = SSR separat (folosește tool-ul dedicat).
- Categorii plate → părinți goi (fă ierarhia).
- Categorie „0 produse" → leagă cu `set_products_menu_category`.
- Filtre goale → populează câmpurile de magazin pe produse.
- Icon cont care duce nicăieri → ascunde-l dacă nu ai portal, sau activează portalul.
