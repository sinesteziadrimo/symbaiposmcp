# Website & magazin online — builder-ul de site (storefront)

> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest ghid = **cum CONSTRUIEȘTI și CONFIGUREZI site-ul public** (paginile, componentele, aspectul, catalogul pe site). Pentru **comenzi online / eMAG / feed-uri / retururi** vezi `ecommerce-magazin-online.md`. Pentru **portalul clienților** (aplicația de la masă, prin QR — meniu/comenzi/rezervări) vezi `portal-config.md`. Sunt lucruri DIFERITE: portalul = app-ul pentru clienții din local; website-ul = site-ul public, indexat de Google, cu magazin.
> 📌 Pentru **copiere/replicare fidelă a unui site existent** citește și `website-copy-intake.md` — crawl multi-page, URL map/SEO, dropdown-uri, hero slider, pagini-cheie, componente noi și verificare vizuală.
> ⭐ **Pentru CALITATE (ce face un magazin să convertească) + cum explici clientului fiecare alegere, citește `website-best-practices-2026.md`** — best-practice moderne (header pe 2 rânduri cu bară de categorii dedicată, megamenu cu grupuri + hover lin, search proeminent, anti-dead-end pe pagina de produs, „shop by age/occasion", bară de transport gratuit), fiecare cu cifra de conversie de citat clientului.
> 🛍️ **Pentru PAGINA DE PRODUS completă (galerie, descriere lungă, specificații, preț redus, garanție, FAQ, accesorii, pachete, video) citește `website-builder-pdp.md`** — rețetă cu listă de bife + ce tool completează fiecare lucru pe pagină.

## Pe scurt — ce e și ce poate face

Symbai are un **builder de website** integrat: din catalogul de produse + meniul brandului poți genera un **site public complet** (magazin online sau site de prezentare) — fără cod, prin tool-uri MCP. Site-ul e per-brand, randat server-side (bun pentru SEO/Google), cu temă luată din culorile brandului. Poate fi:
- **`shop`** — magazin de e-commerce complet (catalog, categorii, coș, checkout, filtre).
- **`site`** — site de prezentare (pentru restaurant/local: meniu, despre, rezervări, contact).

**Capabilități cheie** (toate se setează prin tool-uri, fără click):
- **Pagini** — Acasă, Magazin/Catalog, Despre, Contact + pagini de categorie (`/categorie/<slug>`) și produs (`/produs/<slug>`) generate automat. URL-ul canonic e pe **slug** (SEO); `/...<id>` rămâne fallback și face redirect 301 spre slug.
- **Componente (blocuri)** care se aranjează pe pagini: hero/banner, `index-hero` (lista verticala de destinatii/locatii care schimba imaginea pe hover), grilă de categorii, grilă de produse (cu filtre + faceted sidebar), branduri, carduri de avantaje (`feature-cards`), **carusel de carduri glisabil (`feature-carousel`)**, bandă text derulantă/ticker (`marquee`), bandă de descărcare aplicație (`app-download`), meniu restaurant static (`menu-list`), text+imagine, galerie (cu lightbox), tabel de prețuri (`pricing`), testimoniale, **numărătoare inversă (`countdown`)**, FAQ, newsletter, bară de anunțuri sus, bloc de text, contact, blog.
- **Ierarhie de categorii** — categorii părinte → subcategorii (drill-down). O pagină de categorie-părinte arată **grila de subcategorii + produsele din tot subarborele**.
- **Filtre faceted** (sidebar tip magazin mare): preț, disponibilitate (în stoc), brand, material, vârstă, categorie de interes.
- **Hero** (banner mare cu imagine + titlu + buton), **footer** bogat (contact, social, coloane de linkuri, copyright/CUI), **pagini legale** (Despre, Contact, Termeni, Confidențialitate, Livrare, Retur, FAQ — indexate de Google, conforme ANPC), **bară de anunțuri**, **logo**.
- **Promoții pe site** — bannere / pop-up-uri (header-strip, footer-strip, side-modal).
- **Navigare** — meniul de sus, cu categoriile reale ca dropdown.
- **Theming** — culoarea brandului, fonturi, mod dark si reveal-on-scroll global (`scrollReveal`).
- **Blog public** — pagina `/blog` cu componenta `blog-listing` si articole reale din modulul Blog. La migrare de site vechi, articolele se importa ca entitati Blog (`create_blog_post` / `bulk_create_blog_posts`), nu ca simple carduri statice pe pagina.

## Concepte

- **Website (config)** — un site per brand; un brand poate avea unul implicit (`makeDefault`). `kind` = `shop` sau `site`.
- **Pagină** — o rută a site-ului (Acasă `/`, Magazin `/magazin`, Despre `/despre`, Contact `/contact`...). Fiecare are un slug și o listă de **componente**.
- **Componentă (bloc)** — un element vizual cu un `type` și un `config` (ex. `hero-slider`, `category-grid`, `product-grid`). Le adaugi/editezi ca să compui pagina.
- **Categorie-părinte vs frunză** — o categorie poate avea subcategorii (părinte) sau nu (frunză). Produsele stau pe **frunze**; părinții afișează automat tot ce e dedesubt (rollup).
- **Faceted filter** — filtrele din stânga la magazinele mari (preț/brand/culoare/material...). Pe Symbai se alimentează din câmpurile produsului de pe site (brand, material, vârstă, interes).
- **Pagină legală (SSR)** — Despre/Contact/Termeni/etc. sunt servite separat, indexate de Google. Au tool dedicat (`set_website_legal_page`) — important pentru conformitate ANPC/GDPR.
- **Template** — structură gata făcută de pagini+componente pe care o aplici peste site ca punct de plecare.

## Ce tool-uri MCP folosești (catalog complet)

> Toate cer brandul (`brandId`). Citește întâi `list_websites(brandId)` ca să afli dacă există deja un site și `id`-ul lui. Confirmă cu utilizatorul ÎNAINTE de `apply_website_template`/`confirmReplace` (rescrie structura).

**Creare & structură de bază**
- `analyze_external_website` — analizează read-only un URL public și întoarce `sourceBrief` pentru replicare rapidă: SEO, logo/favicon, culori/fonturi, nav, CTA-uri, imagini/video, secțiuni, JSON-LD și indicii de framework. Pentru copiere fidelă folosește `crawlPages:true, maxPages:12` și, dacă știi pagini critice, `pageUrls:["/meniu","/blog","/galerie",...]`; primești `crawl.pages`, `crawl.urlMap` și `crawl.canonicalSlugs`. Rulează-l primul când userul spune „copiază site-ul X" / „fă-mi site ca Y".
- `create_website` — creează site-ul (params: `brandId`, `kind` shop/site, `name`, `makeDefault`). Leagă automat meniul → canalul web.
- `apply_website_template` — populează structura (pagini, navigare, footer cu categorii reale) și preia **culoarea brandului**. `confirmReplace: true` ca să suprascrie.
- `list_websites` — ce site-uri are brandul.

**Pagini & componente**
- `set_website_page_content` — editează o pagină (titlu/vizibilitate/componente). Înlocuiește lista de blocuri a paginii. Pentru `createIfMissing:true` pe branduri cu mai multe website-uri, trimite obligatoriu `configId`/`websiteId` din `list_websites`.
- `set_website_pages` — bulk pentru mai multe pagini in acelasi apel. Foloseste-l la clonari/migrari cu multe pagini de prezentare, ca sa pastrezi slug-uri, titluri, vizibilitate si componente fara N apeluri separate. Nu il folosi pentru un singur bloc minor; acolo `add_website_section` sau `set_website_page_content` e mai clar. Dupa bulk, verifica fiecare pagina cheie cu `get_website_page`.
- `add_website_section` — inserează o componentă pe o pagină **fără** a înlocui restul (ex. mai adaugi o grilă de produse featured).
- `get_website_page` — citește înapoi pagina LIVE: fără `pageSlug`/`pageId` dă indexul paginilor + navbar/global; cu slug/id dă componentele și configul complet. Folosește-l după orice scriere de pagină, temă sau navbar ca verificare obiectivă.
- `list_website_component_catalog` — citește catalogul complet de componente, schema de `config` și exemplele. Rulează-l când nu ești sigur ce `type`/config trebuie folosit sau când vrei să vezi componenta `custom-html`.
- `upsert_custom_website_component` — adaugă/actualizează o componentă custom HTML + CSS scoped pe o pagină. Folosește-l **doar după** ce ai verificat catalogul și componentele standard nu pot exprima cerința; nu te opri la „builderul nu are componenta”.
- `delete_website_page` — șterge o pagină (util pentru pagini placeholder generice).
- `set_hero` — setează banner-ul hero (imagine, titlu, subtitlu, buton + link, opacitate overlay).
- `set_website_theme` — identitatea vizuală globală (`config.global`): `primaryColor`, `secondaryColor`, `accentColor`, `backgroundColor`, `textColor`, `fontFamily`, `headingFont`, `siteName`, `tagline`, `darkMode`, `scrollReveal`. Folosește-l când potrivești site-ul cu brandul real; `backgroundColor` si `textColor` sunt citite de renderer, deci seteaza-le cand sursa are tema dark/warm reala, nu lasa slate/alb implicit. `scrollReveal:true` activeaza fade+slide la intrarea sectiunilor in viewport pentru toate blocurile editoriale; rendererul respecta `prefers-reduced-motion`, exclude hero/navbar/footer/marquee/rutele full-page si ramane opacity-only pentru sectiuni cu sticky/fixed. Nu setează `customCss`. Componentele citesc și `sectionBg`/`sectionTextColor` per-secțiune — la copiere fidelă vezi capcanele de culoare semantică din `website-copy-intake.md` (un accent niciodată ca bandă full-bleed).
- `update_website_navigation` — meniul de sus. `rebuildCategoriesFromCatalog: true` reconstruiește dropdown-ul „Categorii" din categoriile reale **rădăcină** (scoate categoriile generice de template). Sau dă `items[]` pentru control total — **`items[].children[]`** = dropdown-uri (la copiere fidelă reconstruiește meniul real 1:1, nu lăsa lista auto „o intrare per pagină"). Pentru chrome-ul navbar trimite **`navbarSettings`** (ex. `ctaButton:{visible:false}` sau `ctaButton:{style:"outline",color:"#c9a45c"}`, `navbarBg:"#f5ead8"`, `showSearch:false`, `showLoginButton:false`, `transparent:true`, `sticky:true`, `logoText`, `logoRotate:180`, `logoBg:"#e32223"`) — ascunde extra-urile pe care sursa nu le are si potriveste bara solida cu tema. Daca sursa are meniu lateral fix in stanga, foloseste `navbarSettings:{style:"sidebar-left", sidebarBg, sidebarTextColor, socialLinks:[...]}` in loc de `custom-html`.
- `get_website_page(brandId, pageSlug?)` — citește înapoi configul LIVE al unei pagini (toate componentele + props) pentru verificare / read-modify-write; fără `pageSlug` întoarce indexul paginilor + `navbar.menuStructure` + global. Elimină SELECT-urile directe în DB.
- `set_website_footer` — footer: `contactInfo` (adresă/telefon/email/program), `socialLinks`, `columns` (coloane de linkuri), `copyright`. `fillContactFromCompany: true` ia contactul din datele firmei; `rebuildCategoriesColumn: true` reface coloana de categorii din catalog.
- `set_website_legal_page` — text REAL pentru Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ (`slug` ∈ about/contact/terms/privacy/shipping/returns/faq). `fillCompanyData: true` adaugă nume firmă + CUI + adresă. **Acestea sunt pagini SSR — pentru conținut real folosește ACEST tool, nu doar un bloc de text.**
- `list_website_legal_pages` — ce pagini legale ai.

**Catalog, categorii & filtre** (alimentează magazinul)
- `bulk_create_products` — creează produse în masă (nume, preț via meniu, unitate, TVA, SKU/barcode, descriere). Pentru România: **TVA standard = 21%** (cotele RO sunt 0/11/21).
- `auto_create_menu_from_products` — generează meniul + categoriile din produse.
- `create_menu_category` — creează o categorie; acceptă `parentId` pentru ierarhie.
- `bulk_reparent_menu_categories` — mută atomic mai multe categorii sub un părinte (sau la rădăcină) — construiește/repară arborele.
- `set_products_menu_category` — pune mai multe produse într-o categorie deodată. **Important**: count-ul de produse pe categorie se citește de aici — fără el, categoria poate apărea „0 produse" chiar dacă are articole pe meniu.
- `add_menu_item` / `update_menu_item` — pun produsul pe meniu cu câmpurile de magazin: `productBrand` (brand), `material`, `ageRangeMin`/`ageRangeMax` (vârstă), `interestCategory` (categorie de interes), `dimensions`. **Acestea alimentează filtrele faceted** (brand/material/vârstă/interes). PLUS câmpurile de **pagină de produs bogată** (vezi `website-builder-pdp.md`): **`compareAtPrice`** (preț VECHI → reducere: strikethrough + badge „-N%" + „Economisești N lei"), **`descriptionHtml`** (descriere LUNGĂ HTML pentru tab-ul Descriere; `description` = textul scurt), **`specs`** (tabel de specificații: listă de `{label, value}`), **`faq`** (întrebări frecvente: listă de `{q, a}`), **`warrantyMonths`** (garanție în luni → „Garanție inclusă: 24 luni"), **`displaySku`** (cod produs vizibil), **`badges`** (etichete marketing: `free_shipping`/`installments`/`new`/`bestseller`/`eco`), **`installmentMonths`** (rate fără dobândă, ex. `[3,6,12]`), **`videoUrl`** (video YouTube/Vimeo), **`safetyCert`** (`["EN71","OEKO-TEX"]` → badge-uri de certificare).
- `update_menu_category_fields(categoryId, imageUrl)` — **imagine curată per categorie** (tile category-grid). Fără ea, storefront-ul derivă poza categoriei din primul produs. `clear:["imageUrl"]` revine la derivare.
- `set_product_image` / `bulk_set_product_images` — poza principală + galerie.
- `set_product_variants` — variante (mărime/culoare) cu preț/stoc per variantă (compareAtPrice merge și per variantă).
- `define_product_custom_fields` / `list_product_custom_fields` — câmpuri custom pe produs (ex. „Certificare", „Compoziție").
- `bulk_set_product_custom_values` — completează specificațiile (specs) pe zeci/sute de produse dintr-un singur apel.
- `set_product_recommendations` — produse recomandate pe pagina de produs (accesorii / „S-ar putea să te intereseze" / „Alți clienți au cumpărat"), cu tip de relație.
- `set_product_bundle` — pachet „Cumpărate frecvent împreună" (produs principal + produse din pachet + reducere opțională).

**Promoții & setări**
- `configure_storefront_trust_bar` — bara de încredere (trust bar): pilonii „14 zile retur / transport gratuit / fidelizare / rate fără dobândă" afișați pe TOATE paginile, deasupra sau sub meniul de sus. Complet configurabilă (piloni, iconuri, culori, poziție). Vezi secțiunea dedicată mai jos.
- `create_website_promotion` / `update_website_promotion` / `list_website_promotions` — bannere/pop-up-uri pe site (placement: banner / header-strip / footer-strip / side-modal).
- `update_ecommerce_settings` / `get_ecommerce_settings` — monedă, TVA implicit, nume magazin, metode de checkout (ramburs / transfer bancar / card).
- `update_menu_display_config` — editări avansate pe configul site-ului (de folosit doar când un tool dedicat nu acoperă un câmp; pentru culori/fonturi folosește `set_website_theme`, pentru navbar `update_website_navigation`).

**Verificare (auto-check — folosește-l MEREU la final)**
- `get_website_page` — read-back imediat după scriere: confirmă slug-ul, numărul de componente, tipurile, configul componentelor, `navbar.menuStructure` și `global`. Este verificarea MCP înainte de screenshot.
- `audit_shop_health` — auditează sănătatea magazinului și întoarce probleme (`error`/`warn`) + statistici: categorii goale/plate/gunoi, TVA în afara cotelor RO (0/11/21), % acoperire filtre (brand/material/vârstă), email placeholder în footer, navbar/footer cu prea multe categorii, hero fără imagine, produse fără poză. **Rulează-l după ce construiești/imporți un magazin și repară problemele `error` ÎNAINTE de a spune că e gata** — nu aștepta ca userul să-ți găsească greșelile.

**Blog & migrare de articole**
- `list_blog_posts` / `get_blog_post` / `list_blog_categories` — citeste ce exista deja in blogul brandului inainte de import; compara cu numarul de articole gasite pe sursa.
- `create_blog_post` — creeaza un articol individual. Pentru `published` ai nevoie de `metaDescription` de cel putin 70 caractere si `coverImageUrl`.
- `bulk_create_blog_posts` — import controlat pentru pana la 50 de articole per apel, cu `dryRun`, `slugConflictPolicy` (`skip`/`update`/`suffix`), `publishedAt`, `canonicalUrl`, `legacyPath`, `legacyDomain` si `brandWebsiteIds`; `legacyPath` creeaza redirect 301 catre `/blog/<slug>` cand e nevoie. Foloseste-l la WordPress/bloguri paginate.
- `bulk_update_blog_posts` — operatii in masa dupa import: publish/archive/feature/unfeature.
- Pagina publica a blogului se construieste cu `set_website_page_content` pe slug `/blog` si componenta `blog-listing` (nu `blog-list`): `{ title, subtitle, columns, postsPerPage, showCategories, showSearch, showFeatured, showSidebar }`. Daca o creezi cu `createIfMissing:true`, foloseste `configId` din `list_websites`. **`showSidebar` e implicit OFF** si injecteaza un newsletter „Aboneaza-ma" + lista „Recente"; activeaza-l DOAR daca site-ul real are sidebar — un extra pe care sursa nu-l are strica fidelitatea.

## Componentele de pagină (blocuri) — ce ai la dispoziție

Le pui prin `add_website_section`/`set_website_page_content` cu `type` + `config`.

**Regula de alegere:** încearcă întâi componentele existente din catalog (`hero-slider`, `feature-cards`, `product-grid`, `static-menu-board`, `cta-banner`, `faq`, `gallery`, `trust-badges`, etc.). Folosește `custom-html` numai când cerința e cu adevărat specifică și nu merită un deploy/componentă nouă de platformă.

- **`custom-html`** — componentă complet custom pentru cazuri unde blocurile standard nu exprimă designul sau comportamentul cerut. Se adaugă preferabil cu `upsert_custom_website_component`; primește `html`, `css`, `maxWidth`, culori de secțiune și note. HTML-ul e script-free: nu folosi `<script>`, handler-e inline sau stil inline; pune stilul în `css`, iar pentru interacțiuni folosește acțiuni declarative `data-wb-action`.
- **`hero-slider`** — banner mare (imagine/gradient, titlu, subtitlu, buton). Suporta si al treilea CTA: `showTertiaryCta:true` + `slides[].tertiaryCtaText` / `slides[].tertiaryCtaUrl`, util la homepage-uri cu 3 actiuni principale. Pe pagini fără imagine degradează elegant într-un header colorat în culoarea brandului.
- **`hero-slider` cu `contentBoxStyle:"source-card"`** — pentru copiere fidelă de site-uri cu hero pe imagine + card text colorat per slide; suportă `boxColor`, `boxTextColor`, `buttonColor`, `buttonTextColor`, CTA secundar/tertiar, puncte și săgeți. Folosește-l când sursa are slider real, nu reduce la un singur banner.
- **`index-hero`** — hero full-bleed pentru branduri editoriale / grupuri cu multe locatii: `items:[{label,image,url}]`, `eyebrow`, `height:"screen"|"large"|"medium"`, `align`, `overlayColor`, `overlayOpacity`, `activeColor`, `ctaText`, `ctaUrl`. Hover/focus pe eticheta schimba imaginea; fiecare eticheta navigheaza. Foloseste-l pentru pattern-uri tip The Standard / hoteluri / destinatii, nu ca lista simpla sub hero.
- **`text-image`** — split text + imagine. Pentru design fidel suportă `html` (rich text sanitizat), `eyebrow`, `eyebrowColor`, `titleColor`, `ctaColor`, `backgroundImageUrl` + `backgroundOverlay`, panou în spatele imaginii (`imageBoxColor`/`imageBoxImage`), mască (`imageMask: rounded|circle|blob|diagonal`), `imageShadow` și accente animate (`decor: clouds|sparkles|blobs|balloons`). Folosește-l pentru secțiuni de poveste, servicii, beneficii și pagini de prezentare; verifică vizual că poza, banda colorată și CTA-ul arată ca sursa.
- **`static-menu-board`** — meniu restaurant importat static dintr-un site extern: bară orizontală de categorii, intro, carduri cu poză/preț/gramaj. Folosește-l pentru `/meniu` când catalogul POS nu e încă populat, ca să păstrezi URL-ul și aspectul sursei; `navStickyTop` ține bara de categorii sub headerul sticky; ulterior se poate înlocui cu `menu-section` legat la catalog.
- **`menu-list`** — meniu restaurant STATIC scris inline, pentru pagini de prezentare / clone / "sample menu"; NU este sincronizat cu POS (`menu-section` ramane pentru catalog live). Are `layout:"grid"` (carduri cu poza, centrat) sau `layout:"list"` (rand nume + linie punctata + pret), `categories[]` sau `items[]`, pret, `meta` (ex. kcal), badge-uri, tag-uri dietetice, `spice`, `filters:true`, `filterTags` si `allFilterLabel` pentru chip-uri interactive care filtreaza produsele vizibile pe tag (ex. Vegan/Vegetarian/Gluten-free), plus `textColor`/`mutedColor`/`dividerColor` pentru teme dark.
- **`category-grid`** — grilă de categorii (carduri cu poză + nr. produse). Se poate limita la anumite categorii (`selectedCategoryIds`) — folosit pe paginile părinte pentru subcategorii.
- **`product-grid`** — grila de produse. Opțiuni: `showFilters` (chips de categorii + căutare + sortare), `showFacets` (sidebar faceted: preț/brand/material/vârstă/disponibilitate), `categoryNavMode` (`flat`/`two-level`/`drill-down`), `categoryFilterId` (fixează o categorie), `productsPerPage`, `columns`.
- **`announcement-bar`** — bară de anunțuri sus (mesaje rotative cu iconițe: livrare/cadou/retur).
- **`newsletter`** — abonare la newsletter (inline).
- **`trust-badges`**, **`feature-cards`** — garanții / avantaje (plăți securizate, livrare rapidă, retur).
- **`tabbed-cards`** — grila de carduri cu pastile de filtrare deasupra. Foloseste-o pentru locatii pe regiuni, servicii pe categorie sau portofolii: `tabs:[{label,value}]`, `cards[].tab`, `showAllTab`, `allTabLabel`, `columns`, `imageRatio`. Nu folosi `custom-html` pentru sectiuni de tip "Our hotel locations" / regiuni.
- **`store-locator`** — localizator pentru lanturi/grupuri: harta Google embed fara cheie + lista de carduri locatie filtrabile pe `region`/`city`; click pe chip filtreaza si recenter-eaza harta, click pe card recenter-eaza, iar fiecare card are link Directions. Config: `locations:[{name,address,city,region,hours,phone,mapQuery,directionsUrl}]`, optional `regions`, `allRegionLabel`, `mapHeight`, culori.
- **`app-download`** — banda de promovare pentru aplicația mobilă: `eyebrow`, `title`, `subtitle`, `appStoreUrl`, `googlePlayUrl` sau `stores:[{kind,url,label?,topLabel?}]`, culori de fundal/text/badge si optional `image` cu mockup telefon. Foloseste-o pentru "descarca aplicatia", "comanda in avans", loialitate sau livrare prin aplicatie proprie; daca nu ai linkurile reale, cere-le sau lasa badge-urile cu `#` doar pentru preview.
- **`brand-logos`** — logo-uri de branduri/parteneri.
- **`testimonials`**, **`text-block`**, **`contact`**, **`blog-listing`** — recenzii, text liber, contact, listare articole de blog din modulul Blog.

### Componente custom (`custom-html`)

Folosește `custom-html` când proprietarul cere o secțiune foarte specifică: layout copiat fidel din alt site, mini-calculator, tabel comparativ special, meniu static cu comportament diferit, landing section, FAQ/accordion custom, carduri cu logică de click, CTA-uri sau orice zonă pe care catalogul standard nu o acoperă bine. **Nu porni direct cu custom**: întâi caută o componentă standard sau o combinație de componente standard.

Workflow:
1. Citește `list_website_component_catalog(type:"custom-html", includeExamples:true)`.
2. Dacă o componentă standard poate rezolva rezonabil cerința, folosește standardul. Dacă nu, scrie HTML semantic + CSS scoped. În CSS poți folosi `:host` ca selector de rădăcină; sistemul îl scopează pe secțiunea curentă.
3. Pentru comportament, folosește atribute declarative, nu JavaScript:
   - `data-wb-action="navigate"` + `data-wb-url="/magazin"` pentru navigare.
   - `data-wb-action="open-cart"` pentru coș.
   - `data-wb-action="add-to-cart"` + `data-wb-menu-item-id="123"` sau `data-wb-product-id="123"` pentru adăugare produs.
   - `data-wb-action="open-product"` + `data-wb-menu-item-id` / `data-wb-product-id` / `data-wb-slug`.
   - `data-wb-action="open-search"` sau `set-search` + `data-wb-query="termen"`.
   - `data-wb-action="scroll-to"` + `data-wb-target="#sectiune"`.
   - `data-wb-action="toggle-class"` + `data-wb-target="#faq1"` + `data-wb-class="is-open"` pentru accordion/tab-uri simple.
   - `data-wb-action="track-lead"` pentru CTA/form lead tracking.
4. Poți folosi token-uri: `{{siteName}}`, `{{tagline}}`, `{{primaryColor}}`, `{{secondaryColor}}`, `{{accentColor}}`, `{{cartCount}}`, `{{cartSubtotal}}`, `{{freeShippingRemaining}}`.
5. Salvează cu `upsert_custom_website_component(brandId, pageSlug, sectionId?, html, css, ...)`, apoi verifică vizual pagina și rulează `audit_shop_health`.

Checklist de siguranță înainte de salvare:
- Nu folosi `<script>`, `onclick`/handler-e inline, `javascript:`/`data:`/`blob:` URLs sau `style=""` inline; sanitizerul le elimină, dar agentul trebuie să le evite.
- Nu pune formulare care trimit date către site-uri externe; submit-ul custom este blocat și trebuie modelat prin `data-wb-action`.
- Nu folosi iframe decât dacă utilizatorul cere explicit embed extern de încredere; `allowIframes:true` permite doar iframe-uri HTTP/HTTPS, sandboxed.
- Nu folosi CSS care acoperă tot site-ul (`position:fixed` fullscreen, z-index uriaș) și nu folosi at-rule-uri CSS (`@media`, `@import`, `@supports`); pentru responsive folosește grid/flex/clamp în CSS scoped.
- Nu introduce cod copiat de pe internet fără să-l reduci la HTML/CSS inert + acțiuni declarative.

Limite de runtime: `<script>`, `<style>`, SVG/math executabil, object/embed/link/meta/base, handler-ele inline, stilurile inline, URL-urile nesigure, `srcdoc` și submit-ul extern sunt eliminate/blocate. CSS-ul e scoped pe secțiune; at-rule-urile CSS sunt eliminate, iar `position:fixed` este rescris defensiv ca `position:absolute`.

## Bara de încredere (trust bar) a magazinului

**Ce e:** o bandă subțire, vizibilă pe **toate paginile** site-ului, cu „pilonii de încredere" ai magazinului — promisiunile care îl liniștesc pe cumpărător: **„14 zile drept de retur"**, **„Transport gratuit"**, **„Fidelizare clienți"**, **„Rate fără dobândă"** etc. E exact bara pe care o vezi sus pe magazinele mari (tip bebebliss). Face parte din „chrome-ul" global al site-ului (ca meniul de sus și footer-ul), nu e o componentă pusă pe o singură pagină.

**La ce folosește:** comunică din prima, pe orice pagină, avantajele care decid cumpărarea (retur ușor, livrare gratuită, plata în rate). Reduce ezitarea și abandonul — clientul vede garanțiile fără să caute prin pagini separate.

**Tool: `configure_storefront_trust_bar`** — e **complet configurabilă**: alegi orice piloni vrei, în ce ordine, cu ce iconuri, ce culori și unde stă (deasupra sau sub meniu). Parametri:
- `brandId` (obligatoriu).
- `pillars` — lista pilonilor, în ordine; fiecare are `{icon, text}`. Iconuri disponibile: `truck` (camion/livrare), `gift` (cadou), `rotate-ccw` (retur), `shield` (garanție/protecție), `star` (stea/fidelizare), `credit-card` (card/rate), `award` (premiu/calitate), `check` (bifă), `clock` (ceas/program), `heart` (inimă). Poți pune și piloni **fără icon** (doar text). `pillars: []` (listă goală) **ascunde** bara.
- `enabled` (true/false) — implicit `true` când pui piloni; pune `false` ca să ascunzi bara fără să-i ștergi pilonii.
- `position` — `above-nav` (deasupra meniului, ca bebebliss — implicit) sau `below-nav` (sub meniu).
- `backgroundColor`, `textColor` (culori hex, opționale — implicit se iau din temă/brand).
- `borderBottom` (true/false) — o linie subțire sub bară (implicit `true`).

**Exemplu 1 — ca la magazinele mari (4 piloni, bebebliss-style):**
```
configure_storefront_trust_bar(
  brandId,
  position: "above-nav",
  pillars: [
    {icon: "rotate-ccw",  text: "14 zile drept de retur"},
    {icon: "truck",       text: "Transport gratuit"},
    {icon: "star",        text: "Fidelizare clienți"},
    {icon: "credit-card", text: "Rate fără dobândă"}
  ]
)
```

**Exemplu 2 — minimal, 2 piloni custom în culorile tale:**
```
configure_storefront_trust_bar(
  brandId,
  pillars: [
    {icon: "shield", text: "Plată securizată"},
    {icon: "clock",  text: "Livrare în 24-48h"}
  ],
  backgroundColor: "#0B5", textColor: "#FFF"
)
```

**De reținut:** bara apare pe TOATE paginile (Acasă, Magazin, categorie, produs, Despre...), e poziționabilă (deasupra/sub meniu), și se ascunde fie cu `enabled: false`, fie cu `pillars: []`. Pune piloni REALI (politica ta chiar de retur/transport/rate) — nu promisiuni pe care nu le ții.

> 💡 **Principiu — storefront din componente configurabile:** site-ul Symbai e construit din blocuri și „chrome" reglabile prin conexiune (bara de încredere, meniul de sus, hero-ul, footer-ul, barele de anunțuri, aspectul). Asta înseamnă că poți construi **orice variantă vrea clientul** — nu doar bara de încredere, ci și aspectul portalului (`configure_portal_appearance`), navigarea (`update_website_navigation`), footer-ul (`set_website_footer`) etc. Pornește de la ce vrea proprietarul, alege componenta potrivită și configureaz-o; nu te limita la un singur „șablon".

## Rețetă rapidă — un magazin online bun, repede

1. **Creează + șablon**: `create_website(kind:"shop", makeDefault:true)` → `apply_website_template(kind:"shop", confirmReplace:true)` (preia culoarea brandului).
2. **Catalog**: produse cu poze + preț + TVA 21 + brand/material/vârstă (pentru filtre) — prin `bulk_create_products` + `add_menu_item`(productBrand/material/ageRange/interestCategory) + `set_product_image`.
3. **Ierarhia de categorii**: creează categoriile cu `parentId` (sau `bulk_reparent_menu_categories`) ca să ai 8-12 categorii-părinte în meniul de sus, fiecare cu subcategorii. Atribuie fiecare produs la **frunza** lui (`set_products_menu_category`). Așa: meniul de sus e curat, paginile părinte arată subcategorii + produse, filtrele pe categorie merg.
4. **Hero** pe Acasă: `set_hero(imageUrl, title, subtitle, ctaText:"Vezi produsele", ctaUrl:"/magazin")`.
5. **Filtre**: activează `showFilters` + `showFacets` pe grila de produse (din pagina de catalog/categorie). Cu brand/material/vârstă populate, sidebar-ul faceted devine bogat.
6. **Footer + legale**: `set_website_footer(contactInfo + socialLinks + columns)` + `set_website_legal_page` pentru Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ (`fillCompanyData:true`) — conform ANPC, indexat de Google.
7. **Anunțuri + logo + bară de încredere**: `add_website_section(type:"announcement-bar", ...)` + logo în navigare + `configure_storefront_trust_bar` (pilonii retur/transport/rate, pe toate paginile).
8. **Promoții**: `create_website_promotion` (pop-up de abonare / banner reduceri).
9. **Pagini de produs bogate** (cel puțin pe best-sellers): galerie ≥3 poze, descriere lungă, specificații, preț redus, garanție, FAQ, accesorii/pachet — vezi rețeta completă în `website-builder-pdp.md`.
10. **Verifică**: deschide site-ul (link prin `gaseste_in_aplicatie`) — Acasă, o categorie-părinte (subcategorii + produse + filtre), o pagină de produs (galerie + tab-uri + specificații + preț redus + FAQ + accesorii), Despre/Contact pline. Pune o comandă test.

## Bune practici (ca să arate „ca un magazin mare")

- **Ierarhie, nu plat** — 8-12 categorii-părinte în meniu, restul subcategorii. Categoriile plate → meniu copleșitor + pagini de părinte goale.
- **Fiecare produs pe frunza lui** + `set_products_menu_category` → categoriile nu apar „0 produse".
- **Populează câmpurile de magazin** (brand/material/vârstă/interes) → filtrele faceted au ce afișa. Fără ele, sidebar-ul are doar preț + disponibilitate.
- **Pagini legale reale** (`set_website_legal_page`) — nu lăsa Despre/Contact goale; sunt indexate și cerute de ANPC.
- **Email real în footer** — nu un placeholder; setează adresa reală de contact.
- **TVA 21%** pentru România (cotele sunt 0/11/21).
- **Hero cu imagine** pe Acasă (un produs reprezentativ sau o poză de brand din `browse_brand_media`).

## Capcane (de evitat)

- **Despre/Contact/Termeni etc. sunt pagini separate (SSR)** — editarea unui bloc de text generic NU schimbă pagina publică; folosește `set_website_legal_page`.
- **Categorii fără ierarhie** → o categorie-părinte apare goală (produsele sunt în subcategorii). Construiește arborele cu `parentId`/`bulk_reparent_menu_categories`.
- **Categorie „0 produse"** deși are articole → produsele nu au fost legate cu `set_products_menu_category`.
- **Filtre goale** → câmpurile de magazin (brand/material/vârstă) nu sunt populate pe produse.
- **Iconul de cont duce nicăieri** → dacă nu ai portal de clienți activ, ascunde-l (din setările de navigare) sau activează portalul.
- **Confirmă înainte de `apply_website_template` cu `confirmReplace`** — rescrie structura paginilor.
- **Verifică prin link, nu doar „am rulat tool-ul"** — deschide pagina (deep-link) ca să confirmi vizual.

## Update 2026-06-24 - optiuni vizuale website live

Cand construiesti sau copiezi un site, foloseste intai aceste optiuni native inainte de `custom-html`:

- **Hero corporate diagonal:** `hero-slider` accepta `heroLayout:"diagonal-split"`. Foloseste-l cand sursa are poza full-bleed si panou colorat diagonal in stanga (ex. site corporate/food distribution). Campuri utile: `backgroundColor` = culoarea panoului, `diagonalAccentColor` = fasia/swoosh diagonala, `panelWidth` = latimea panoului, `autoplay/showDots/showArrows` pentru slideshow.
- **Hero index editorial:** `index-hero` accepta `items:[{label,image,url}]` si schimba imaginea full-bleed cand userul trece peste eticheta. Alege-l pentru index de hoteluri/locatii/destinatii sau colectii editoriale, mai ales cand sursa are o lista verticala de orase/proprietati peste imagine. Pentru navbar transparent, rendererul il trateaza ca hero-first.
- **Titlu hero bicolor/conturat:** pe fiecare slide poti trimite `titleAccent` pentru a doua linie in `accentColor`, la aceeasi scara cu titlul. Daca originalul are headline chunky cu contur, foloseste `titleStroke` + `titleStrokeWidth` pe `hero-slider` (text-stroke), nu imagine/custom HTML.
- **Carduri de beneficii minimaliste:** `feature-cards` accepta `style:"divided"`, `cards[].linkText`, `cards[].description`, `titleAlign:"left"|"center"|"right"` si `\n` in `title` pentru titlu pe doua randuri. Alege-l pentru layout-uri editoriale/minimaliste cu coloane separate vertical, titlu mare subtire, descriere scurta si link CTA jos, fara imagine/card ridicat.
- **Carduri filtrabile pe tab-uri:** `tabbed-cards` accepta `tabs[]`, `cards[]` cu `tab`, `showAllTab`, `allTabLabel`, `columns`, `imageRatio`. Foloseste-l pentru servicii pe categorie sau portofoliu filtrat; pentru pagina "Find a restaurant/hotel/store" cu harta si directii, foloseste `store-locator`.
- **Localizator cu harta:** `store-locator` accepta `locations:[{name,address,city,region,hours,phone,mapQuery,directionsUrl}]`, `regions`, `allRegionLabel`, `mapHeight`, `accentColor`, `textColor`, `mutedColor`. Foloseste-l pentru lanturi cu multe restaurante/hoteluri/magazine: filtrele pe regiune sunt interactive, cardul selectat recentreaza harta, iar `Directions` deschide Google Maps.
- **Lista editoriala langa imagine:** `split-list` accepta `eyebrow`, `title`, `subtitle`, `image`, `imagePosition:"left"|"right"`, `imageRatio`, `items:[{title,description,linkText,linkUrl}]`, `titleUnderline`, `dividers`, `accentColor`, `textColor`, `mutedColor`. Foloseste-o pentru servicii/oferte/valori/pasi (catering, outpost, WFH, evenimente), inainte de `custom-html`.
- **Carusel editorial:** `content-carousel` accepta `eyebrow`, `title`, `subtitle`, `imageRatio`, `accentColor`, `dotColor`, `items:[{image,eyebrow,title,description,linkText,linkUrl}]`. Este continut inline, nu POS live; foloseste-l pentru destinatii, experiente, povesti sau pachete prezentate cate unul cu sageti/dots.
- **Pasi / cum functioneaza:** `process-steps` accepta `eyebrow`, `title`, `subtitle`, `layout:"horizontal"|"vertical"`, `numberStyle:"circle"|"outline"|"numeral"|"none"`, `connectors`, `steps:[{number,title,description}]`, `accentColor`, `textColor`, `mutedColor`. Foloseste-l pentru abonamente, fluxuri comanda/livrare, onboarding sau experienta clientului (rezerva -> vino -> savureaza), nu ca text liber.
- **Banda ticker/marquee:** `marquee` accepta `items[]`/`text`, `speed`, `separator`, `direction`, `size`, `textCase:"upper"|"lower"|"normal"`, `backgroundColor`, `textColor`. Foloseste-o pentru slogane sau mesaje repetate tip banda derulanta; `textCase:"lower"` pastreaza branduri all-lowercase, iar `marquee-text` ramane pentru sectiuni editoriale cu fraze mai lungi.
- **Banda descarcare aplicatie:** `app-download` accepta `eyebrow`, `title`, `subtitle`, `appStoreUrl`, `googlePlayUrl` sau `stores[]`, `image`/`imagePosition`, `backgroundColor`, `textColor`, `accentColor`, `badgeBg`, `badgeColor`. Foloseste-o pentru sectiuni App Store / Google Play, order-ahead, loialitate sau livrare; alege-o inainte de `custom-html` pentru badge-uri standard.
- **Meniu static de design:** `menu-list` accepta `layout:"grid"|"list"`, `items[]` sau `categories[]`, `price`, `meta`, `badge/badges`, `tags`, `spice`, `image`, `filters:true`, `filterTags`, `allFilterLabel`, `textColor`, `mutedColor`, `dividerColor`. Foloseste-l pentru meniuri marketing/clone cand vrei design fidel si filtre dietetice reale; pentru meniul POS sincronizat foloseste in continuare `menu-section`/catalogul real.
- **Fundal light mode real:** `set_website_theme(backgroundColor, textColor?)` este respectat si cand `darkMode:false`; seteaza-l pentru teme cream/warm/branded, nu lasa alb implicit daca sursa are fundal colorat.
- **Footer complet:** `set_website_footer` accepta, pe langa contact/social/columns/copyright, `description` pentru coloana de brand, `paymentMethods:["Visa","Mastercard",...]` pentru badge-uri in bara de jos si `showAnpc` pentru linkurile ANPC/SOL. `socialLinks` accepta si chei custom sigure precum `tripadvisor`, `whatsapp`, `booking`; daca nu exista icon dedicat, site-ul afiseaza icon fallback.
- **Navbar settings sunt live:** `update_website_navigation` aplica acum `navbarSettings` direct (`style`, `logoText`, `logoRotate`, `logoBg`, `showSearch`, `showLoginButton`, `navbarBg`, `ctaButton`, `sidebar-left`, iconite). Pentru site-uri editoriale/restaurant cu fundal cream sau branded, seteaza `navbarBg` sau `set_website_theme(backgroundColor)`. Daca `navbarBg` este inchis la culoare, rendererul comuta automat logo/text/iconite pe light text; tu trebuie doar sa setezi culoarea reala si sa verifici vizual. Pentru wordmark-uri intentionat rasturnate (ex. The Standard) foloseste `logoRotate:180`; pentru bloc colorat in spatele logoText foloseste `logoBg`. Pentru buton tip contur foloseste `ctaButton:{style:"outline"}`, iar pentru contur colorat custom foloseste `ctaButton:{style:"outline",color:"#c9a45c"}`. Nu mai folosi `update_menu_display_config` doar ca sa repari chrome-ul navbar.
- **CTA solid cu culori custom:** pentru butonul solid din navbar, `ctaButton.color` seteaza textul, iar `ctaButton.bgColor` seteaza fundalul pill-ului (ex. `ctaButton:{style:"solid",bgColor:"#173f35",color:"#ccff00"}`). Foloseste-l cand brandul are CTA plin cu fundal/text speciale; pentru outline ramane `color` = text + bordura.
- **Text + imagine cu taietura diagonala:** `text-image.imageMask:"diagonal"` taie muchia interioara a pozei spre text si se inverseaza automat cand imaginea este pe stanga/dreapta. Foloseste-l pentru sectiuni split premium de salon/academie/servicii unde sursa are fotografie cu margine oblica; nu recrea cu `custom-html` doar pentru diagonala.
- **Reveal-on-scroll pe sectiuni inalte:** `scrollReveal:true` este sigur si pentru sectiuni mai inalte decat viewportul; rendererul afiseaza blocul imediat ce orice parte intra in viewport. La clone, verifica totusi cu scroll rapid/jump pe desktop si mobil ca nicio sectiune editoriala nu ramane invizibila.
- **Navbar transparent peste hero:** `navbarSettings.transparent:true` pluteste peste hero doar cand prima sectiune a paginii este `hero`, `hero-slider`, `image-hero` sau `index-hero`; pe subpagini light devine solid si poate folosi `logoUrlDark`. Pentru magazin international trimite si `showCurrency:true`, `currencies:["RON","EUR",...]`. Daca navbar-ul pluteste peste hero, bara de incredere de deasupra se ascunde automat ca sa nu impinga layoutul.

Verificare: dupa `update_website_navigation`, `set_website_footer` sau pagini cu aceste optiuni, citeste `get_website_page` si apoi fa screenshot/browser check. In raspunsul catre user spune pe scurt ce ai reprodus vizual: "hero cu panou diagonal", "titlu bicolor", "footer cu metode de plata si ANPC", nu numele campurilor JSON.

## FAQ

- **Diferența website vs portal?** Portalul = app-ul pentru clienții din local (QR la masă: meniu/comenzi/rezervări). Website-ul = site-ul public indexat de Google, cu magazin. Configurări diferite, tool-uri diferite.
- **Pot importa un magazin existent (alt site)?** Da — vezi `onboarding/02d-import-surse-externe.md` (import asistat din surse externe). După import, aplici rețeta de mai sus (ierarhie + filtre + footer + legale).
- **Cum fac filtrele ca la magazinele mari?** Activează `showFacets` pe grila de produse ȘI populează brand/material/vârstă/interes pe produse.
- **Cum fac pagina de produs să arate completă (ca la Bebebliss/eMAG)?** Galerie ≥3 poze + descriere lungă + specificații + preț redus + garanție + FAQ + accesorii/pachet + (opțional) video — rețeta cu bife și tool-uri în `website-builder-pdp.md`.
- **De ce e goală o categorie când dau click?** Ori e părinte fără ierarhie setată, ori produsele nu sunt legate de ea (`set_products_menu_category`).
- **Cum pun bara de sus cu „14 zile retur / transport gratuit / rate" (ca pe magazinele mari)?** E **bara de încredere** — `configure_storefront_trust_bar` cu pilonii tăi (icon + text); apare pe toate paginile, deasupra sau sub meniu. Vezi secțiunea „Bara de încredere (trust bar)".
- **Unde văd comenzile de pe site?** În modulul de magazin — `ecommerce-magazin-online.md` (`/ecommerce/orders`).
