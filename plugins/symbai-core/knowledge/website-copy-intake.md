# Website copy intake si paritate vizuala

> ⚠ Pentru un site MARE / catalog mare / „copiaza TOT site-ul" foloseste skill-ul `copiaza-website` (orchestrare pe ore + coada durabila + sub-agenti + verificare obiectiva). Acolo scopul real vine din `discover_site_inventory` (sitemap + feed platforma), crawl-ul ruleaza pe server prin `start_site_clone_crawl`, mapezi din `get_cached_page` si declari „gata" doar cand trec toate portile: `clone_parity_diff`, `clone_fidelity_audit` si `clone_coverage_audit` dau `pass:true`. `clone_fidelity_audit` verifică și specs PDP + variantele produselor, nu doar nume/poze/preț. La migrare de domeniu, după porți rulezi `clone_redirect_map` întâi dry-run, apoi `apply:true`, ca URL-urile vechi de produse/categorii să facă 301 spre Symbai. Ghidul de mai jos ramane pentru INTAKE rapid (site mic/mediu) si pentru regulile de paritate vizuala.

Foloseste acest ghid cand proprietarul cere: "copiaza site-ul X", "fa site-ul ca X", "adu-mi site-ul existent pe Symbai" sau cand trebuie reprodus local un website public in NexusPOS.

## Regula principala

Nu livra o aproximare doar de homepage. O copiere buna inseamna: URL-uri pastrate, header real, dropdown-uri reale, toate slide-urile importante, pagini-cheie, blog/articole reale daca exista, footer, SEO si verificare vizuala.

Pentru site-uri bogate (ex. Drimoland), nu considera o pagina "copiata" daca ai pus doar hero + 1-2 sectiuni. Daca sursa are zeci de componente, texte lungi, carduri, preturi, video, galerie sau formular, trebuie sa construiesti o pagina lunga care pastreaza inventarul real al componentelor, chiar daca lucrul dureaza mult.

## Intake obligatoriu

1. Ruleaza `analyze_external_website(url, crawlPages:true, maxPages:12)` inainte de scriere. (12 = intake rapid; plafonul real e 24 — mareste daca sunt mai multe pagini-cheie. Peste 24 → skill-ul `copiaza-website`.)
2. Daca stii pagini critice, trimite `pageUrls`, de exemplu `["/meniu","/blog","/galerie","/contact"]`.
3. Pastreaza din raspuns:
   - `seo.title`, `seo.description`, `seo.canonical`, `seo.ogImage`.
   - `branding.logoCandidates`, `branding.faviconCandidates`, `branding.colors`, `branding.fontLinks`.
   - `navigation.links` si `navigation.ctas`.
   - `assets.images`, `assets.videos`.
   - `sections`.
   - `frameworkHints.nextData.componentCounts`, `componentSamples`, `routeHints`, `sliderHints`.
   - `crawl.pages`, `crawl.urlMap`, `crawl.canonicalSlugs`, `crawl.errors`.
   - Pentru blog: paginile paginate detectate, totalul articolelor, lista `title/date/url/image/excerpt` si daca exista continut complet pe pagina articolului.
4. Daca tool-ul nu poate citi continutul pentru ca site-ul e client-side, completeaza intake-ul din browser/screenshot-uri si noteaza blocajul.

## Inventar obligatoriu pe fiecare pagina

Pentru fiecare URL copiat, noteaza rapid:

- **Hero:** imagine/video, badge, titlu, subtitlu, CTA, culoare overlay/card.
- **Structura componentelor:** ordinea exacta: text+imagine, carduri, preturi, galerie, video, formular, FAQ, rich text, contact.
- **Texte:** nu rezuma agresiv. Pastreaza titlurile si paragrafele principale; daca o sectiune are CTA/copy secundar, include-l.
- **Asset-uri:** imaginea principala a fiecarei sectiuni, nu doar un asset generic refolosit peste tot. Probeaza TOATE campurile de imagine ale unei componente (nu doar `image`: si `imageMask`/`picture`/`backgroundImage`) inainte sa o declari "fara poza".
- **Recenzii/testimoniale:** pot fi DOAR imagini (screenshot-uri de review, fara text) — pastreaza-le ca galerie de imagini; nu lasa un filtru pe text sa arunce sectiunea intreaga.
- **Interactivitate:** slider cu sageti/dots, dropdown de meniu, nav sticky, formulare, scroll anchors, carduri clickabile, animatii reveal-on-scroll (sectiunile care apar/aluneca la derulare) — noteaza-le si reprodu-le, nu livra o pagina statica.
- **SEO:** titlu/meta description/canonical pentru pagina, plus slug-ul neschimbat.

Regula de oprire: inainte sa spui "am copiat pagina", compara numarul de sectiuni extrase cu numarul de componente locale. Daca local ai 2-3 blocuri si sursa are 10+, munca NU este gata.

## Capcane de mapare a componentelor (paritate de design) — citeste inainte de a mapa
Capcane reale care au stricat o clona (drimoland.ro, Strapi/Next). Bifeaza-le pe FIECARE sectiune:
- **Culorile sunt SEMANTICE.** Nu vopsi o sectiune intreaga cu o culoare-accent. Calibreaza pe culorile COMPUTED ale site-ului real (inspecteaza in Chrome: ex. `bg-blue`=#13235b navy, `bg-lightblue`=#d0ebf6). Navy = eroi, light-blue = benzi de continut, roz/galben = ACCENTE (boxuri, benzi de recenzii), niciodata erou full-bleed. O culoare de „box" din sursa (DarkTextBox `boxColor`) e boxul din spatele IMAGINII, nu fundalul sectiunii (sectiunea e navy cand textul e alb). Un text+imagine fara culoare → fundal light-blue implicit, FARA box inventat.
- **Poza e des in camp neevident.** `image` e gol; reala in `imageMask`, `picture` (ImageCards), `heroSectionSliderItems[]` (hero), `backgroundImage` (scroll-list). Probeaza TOATE campurile de imagine inainte sa spui „fara poza". Cutia decorativa din spate = o IMAGINE (`imageBackgroundMask`), nu o culoare. Banda colorata de sectiune = camp real (`backgroundColor`/`box`+`boxColor`) → seteaza `sectionBg` + `sectionTextColor`.
- **Blog = Markdown** (renderul de blog nu afiseaza HTML brut) → converteste HTML→Markdown; restaureaza entitatile dublu-escapate (`&amp;nbsp;`→`&nbsp;`).
- **Link-uri in corpul rich-text / `descriptionHtml` / `custom-html`** NU trec prin localizatorul de href → rescrie-le MANUAL la slug-ul intern (altfel clickul pleaca de pe clona).
- **Recenzii doar-imagine** (`reviewItems[]` fara text, screenshot in `authorPicture`) → `gallery`, nu testimoniale goale. Recenzii cu text+poza → `testimonials` cu stil valid (`cards`, `carousel`, `minimal`, `magazine`, `masonry`, `bubbles`) sau `custom-html` scoped pentru layout image-top fidel; nu folosi `style:"photo"` pentru testimonials.
- **Tabele de pret** (`PriceSection.priceItems[]`) → componenta `pricing`. **Liste „scroll list"** (`ScrollListSection`): itemele in `boxes[].boxCards[]`, poza de sectiune in `backgroundImage`. **`ProductsList`** ca sectiune de pagina → imaginea de `menu`.
- **Navbar = meniul REAL** al sursei (itemi de top + dropdown-uri + href-uri), reconstruit 1:1 cu `update_website_navigation items[]` (`children[]` = dropdown). Nu lasa lista auto „o intrare per pagina". Ascunde butonul CTA din dreapta daca originalul n-are: `navbarSettings:{ctaButton:{visible:false}}`. Daca originalul are sidebar stanga, foloseste `navbarSettings:{style:"sidebar-left", sidebarBg, sidebarTextColor, socialLinks:[...]}`; nu construi sidebar-ul ca bloc custom separat.
- **NU activa „extra"-uri decorative implicite** pe care sursa nu le are: blog `showSidebar`/newsletter, badge „Popular"/„Recomandat", toggle de facturare, „featured hero". Un element IN PLUS strica fidelitatea la fel ca unul lipsa.
- **Fiecare ruta randeaza continutul EI** (acasa ≠ meniu; `/blog` = listarea blogului). Fallback tacut la home = pagina LIPSA. Verifica prin **citire** (`get_website_page`) + **vizual in Chrome** langa original; re-importa dupa ORICE fix de mapare inainte de re-verificare.

## Update 2026-06-24 - mapari native noi

La copiere fidela, nu sari la `custom-html` pentru aceste pattern-uri:

- **Hero cu panou diagonal + poza:** mapeaza la `hero-slider` cu `heroLayout:"diagonal-split"`, `backgroundColor`, `diagonalAccentColor`, `panelWidth`, slide-uri multiple si dots/arrows daca originalul le are. Pe mobil rendererul foloseste overlay lizibil, deci verifica desktop + mobil.
- **Headline bicolor:** daca titlul original are doua randuri cu accent vizual, foloseste `slides[].title` + `slides[].titleAccent` in loc de markup custom.
- **Beneficii/feature-uri in coloane separate:** pentru sectiuni cu titlu mare, text scurt si link jos, foloseste `feature-cards` cu `style:"divided"` si `cards[].linkText`.
- **Footer de e-commerce:** pastreaza descrierea brandului, metodele de plata si ANPC/SOL cu `set_website_footer(description, paymentMethods, showAnpc)`, nu ca bloc separat pe pagina.
- **Navbar real:** `update_website_navigation(..., navbarSettings:{...})` aplica acum direct stil/logo/search/login/CTA/sidebar; dupa scriere, confirma prin `get_website_page` ca `navbar` contine setarile asteptate.

## Meniu restaurant / produse importate din site

Pentru pagini de meniu restaurant nu copia doar cateva produse manuale. Daca sursa este Next.js/Strapi, cauta in `__NEXT_DATA__` dupa componente de tip `ComponentCmsDataProductsList` sau echivalent si extrage toate categoriile si produsele.

Pastreaza pe fiecare produs: `name`, `description`, `price`, `weight`, `imageUrl`, `gallery`, `nutritionalInfo`, `ingredients`, `allergens` si id-ul sursa daca exista. La Drimoland pozele produselor vin din `attributes.media.data[].attributes.url`, nu din campuri simple `image`/`images`; verifica mai multe forme inainte sa concluzionezi ca lipsesc pozele.

Inainte de scrieri in baza POS, fa audit read-only: `list_brands` -> `list_menus` -> `list_menu_items`/`search_products_db` -> `get_product_details` pe esantioane. Nu face update/import masiv de produse fara dry-run si confirmare, deoarece schimba meniul live. Pentru preview local, `static-menu-board` este acceptabil daca pastreaza structura si datele reale; pentru productie, sincronizeaza apoi catalogul POS. (Cand fidelitatea conteaza: un `ProductsList` al sursei se mapeaza la imaginea de meniu sau la catalogul POS real — nu ramane un board static cu date inventate.)

## Blog / articole importate din site

Blogul este continut editorial, nu o simpla sectiune de carduri. Daca sursa are `Blog` in nav/footer sau ruta `/blog`, procedeaza asa:

1. Inventariaza indexul si paginarea: `/blog/`, `/blog/page/2/`, RSS/sitemap daca exista. Opreste-te doar cand urmatoarea pagina e 404 sau goala.
2. Pentru fiecare articol pastreaza: `title`, `slug`, `publishedAt`, `author`, `category`, `tags`, `coverImageUrl`, `excerpt`, `content`, `canonicalUrl`, `legacyPath` (URL-ul vechi pentru redirect 301).
3. Compara cu Symbai: `list_blog_posts(brandId, limit:50)` si noteaza articole placeholder/draft care trebuie arhivate sau actualizate.
4. Creeaza pagina publica `/blog` in website builder cu `blog-listing` si nav catre `/blog`; daca folosesti `set_website_page_content(createIfMissing:true)`, trimite `configId` din `list_websites`.
5. Importa articolele ca entitati Blog cu `bulk_create_blog_posts(dryRun:true)` prima data, verifica `redirectsCreated`, apoi scriere reala; daca instanta nu are inca bulk, foloseste `create_blog_post` pe loturi mici si spune explicit limita.
6. Dupa import, verifica `list_blog_posts` si un esantion cu `get_blog_post`; numarul local trebuie sa fie egal cu numarul sursa sau diferenta sa fie justificata.

Reviewerul refuza PASS daca blogul sursa are articole, dar local exista doar pagina `/blog` fara `blog-listing`, articole statice hardcodate, 1-2 drafturi junk sau continut rezumat in loc de articole reale.

## Checklist de paritate

- **URL map / SEO:** pastreaza slug-urile canonice din `crawl.urlMap` si `crawl.canonicalSlugs`. Nu schimba `/meniu`, `/blog`, `/galerie`, pagini de atractii/programe sau pagini indexate deja.
- **Header:** logo lizibil, favicon, culori reale, meniu top-level, dropdown/mega-menu, CTA-uri.
- **Hero slider:** toate slide-urile importante, imagine/video, culoare card/overlay, text, CTA label, CTA destinatie, CTA secundar/tertiar daca exista (`showTertiaryCta` + `tertiaryCtaText`), puncte si sageti.
- **Pagini:** homepage, meniu/catalog, atractii/servicii, blog, galerie, contact/footer, rezervari/evenimente daca exista. Pentru fiecare pagina mare, pastreaza toate sectiunile principale, nu doar primele componente vizibile in primul viewport.
- **Blog/articole:** total articole sursa vs total articole Symbai, slug-uri si canonical pastrate, imagini de coperta, date de publicare si pagina `/blog` cu `blog-listing`. Nu lasa articole placeholder sau rezumate in locul continutului real.
- **Meniu/produse:** toate categoriile, toate produsele, pozele produselor, pretul, gramajul si detaliile nutritionale/alergeni daca exista. Bara orizontala de categorii ramane sticky, marcheaza categoria activa, se recentreaza la scroll si click-ul pe categorie deruleaza la sectiunea corecta.
- **Footer:** coloane de linkuri, contact, social, program, date firma daca exista.
- **Mobile:** header si cardurile trebuie sa incapa fara text suprapus.
- **Verificare:** screenshot sau browser real. Daca browser automation e blocat, valideaza cu HTTP local + build-uri concentrate si spune eroarea exacta.

## Componente NexusPOS create/improved pentru astfel de copii

### `hero-slider` cu `contentBoxStyle:"source-card"`

Foloseste pentru site-uri cu hero pe imagine si card text colorat peste imagine, inclusiv Drimoland-style.

Campuri utile:

- La nivel de componenta: `contentBoxStyle:"source-card"`, `contentBoxOpacity`, `sourceCardMaxWidth`, `sourceTitleSize`, `showArrows`, `showDots`, `activeDotColor`, `minHeight`.
- Pe fiecare slide: `boxColor`, `boxTextColor`, `buttonColor`, `buttonTextColor`, `imageUrl`, `ctaText`, `ctaUrl`, optional `secondaryCtaText`/`secondaryCtaUrl` si `tertiaryCtaText`/`tertiaryCtaUrl` cand sursa are 2-3 butoane.

Nu reduce un slider real la un singur banner. Daca sursa are 5-6 slide-uri cu CTA-uri diferite, pastreaza-le.

### `static-menu-board`

Foloseste pentru pagini de meniu restaurant importate static, cand catalogul POS nu e inca populat complet sau cand trebuie validata rapid paritatea cu sursa.

Campuri utile:

- `title`, `description`.
- `showCategoryNav`, `showBackChip`, `navBg`, `navStickyTop`, `activeBg`, `activeTextColor`.
- `introBg`, `pageBg`, `cardBg`, `titleColor`, `sectionTitleColor`.
- `categories: [{ id, label, items: [{ sourceId, name, description, price, priceValue, weight, weightValue, imageUrl, gallery, nutritionalInfo, ingredients, allergens }] }]`.

Pastreaza URL-ul `/meniu` si structura categoriilor vizibile. Bara de categorii trebuie sa ramana vizibila la scroll si sa faca scroll-spy pe categoria curenta; click-ul pe o categorie trebuie sa sara la sectiunea ei cu offset pentru header. Dupa importul complet de catalog, componenta statica poate fi inlocuita cu o sectiune legata la produse reale.

## Exemplu Drimoland/NexusPOS

Pentru o copie locala Drimoland in NexusPOS:

- Ruta scurta: `/drimoland-local`.
- Preview renderer: `/pos/website?preview=drimoland&page=/...`.
- Pagini minime: `/`, `/taramul-fermecat`, `/loc-de-joaca`, `/outdoor`, `/vr`, `/board-games`, `/rezervare-masa`, `/aniversari-petreceri-copii`, `/team-building`, `/saptamana-altfel-scoli-gradinite`, `/serbari`, `/meniu`, `/meniu-lazzurro`, `/torturi-si-candy-bar`, `/catering`, `/despre-noi`, `/afterschool`, `/vacanta`, `/ateliere-copii`, `/poveste-drimoland`, `/curs-parenting`, `/blog`, `/galerie`, `/lazzurro`, `/contact`.
- Header-ul trebuie sa aiba dropdown-uri pentru atractii, bilete/rezervari, meniu si de interes.
- Hero-ul trebuie sa foloseasca slide-uri multiple cu CTA-uri diferite, nu doar primul slide.
- Meniul Drimoland se extrage din pagina `/meniu`: asteapta 11 categorii si 67 produse in snapshot-ul actual; verifica pozele din `attributes.media` si noteaza separat produsele fara poza in sursa.

## Browser/runtime gotcha

Daca browserul Codex/Chrome e instalat dar bridge-ul cade cu `CreateProcessAsUserW failed: 5`, trateaza-l ca blocaj de runtime Windows, nu ca bug al paginii. Raporteaza-l explicit si verifica ce poti prin:

- `Invoke-WebRequest` pe URL-ul local.
- build concentrat cu `esbuild` pe fisierele atinse.
- `git diff --check`.
- screenshot-uri primite de la user pana cand bridge-ul browser functioneaza.

## Validare minima in NexusPOS

Nu rula full `tsc` pe tot repo-ul doar pentru o schimbare de website. Preferabil:

- `npx.cmd esbuild client/src/pages/pos/POSWebsite.tsx --platform=browser --format=esm --bundle --packages=external --outfile=.tmp/poswebsite-check.mjs --log-level=error`
- `npx.cmd esbuild shared/wb-component-catalog.ts --platform=node --format=esm --bundle --packages=external --outfile=.tmp/wb-catalog-check.mjs --log-level=error`
- `npx.cmd esbuild server/mcp-ecommerce.ts --platform=node --format=esm --bundle --packages=external --outfile=.tmp/mcp-ecommerce-check.mjs --log-level=error`
- un script de audit care numara categoriile/produsele/pozele din config-ul generat si le compara cu sursa.
- HTTP 200 pe paginile locale importante.
