# Website & magazin online — builder-ul de site (storefront)

> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest ghid = **cum CONSTRUIEȘTI și CONFIGUREZI site-ul public** (paginile, componentele, aspectul, catalogul pe site). Pentru **comenzi online / eMAG / feed-uri / retururi** vezi `ecommerce-magazin-online.md`. Pentru **portalul clienților** (aplicația de la masă, prin QR — meniu/comenzi/rezervări) vezi `portal-config.md`. Sunt lucruri DIFERITE: portalul = app-ul pentru clienții din local; website-ul = site-ul public, indexat de Google, cu magazin.
> ⭐ **Pentru CALITATE (ce face un magazin să convertească) + cum explici clientului fiecare alegere, citește `website-best-practices-2026.md`** — best-practice moderne (header pe 2 rânduri cu bară de categorii dedicată, megamenu cu grupuri + hover lin, search proeminent, anti-dead-end pe pagina de produs, „shop by age/occasion", bară de transport gratuit), fiecare cu cifra de conversie de citat clientului.

## Pe scurt — ce e și ce poate face

Symbai are un **builder de website** integrat: din catalogul de produse + meniul brandului poți genera un **site public complet** (magazin online sau site de prezentare) — fără cod, prin tool-uri MCP. Site-ul e per-brand, randat server-side (bun pentru SEO/Google), cu temă luată din culorile brandului. Poate fi:
- **`shop`** — magazin de e-commerce complet (catalog, categorii, coș, checkout, filtre).
- **`site`** — site de prezentare (pentru restaurant/local: meniu, despre, rezervări, contact).

**Capabilități cheie** (toate se setează prin tool-uri, fără click):
- **Pagini** — Acasă, Magazin/Catalog, Despre, Contact + pagini de categorie (`/categorie/:id`) și produs (`/produs/:id`) generate automat.
- **Componente (blocuri)** care se aranjează pe pagini: hero/banner, grilă de categorii, grilă de produse (cu filtre + faceted sidebar), branduri, carduri de avantaje, testimoniale, newsletter, bară de anunțuri sus, bloc de text, contact, blog.
- **Ierarhie de categorii** — categorii părinte → subcategorii (drill-down). O pagină de categorie-părinte arată **grila de subcategorii + produsele din tot subarborele**.
- **Filtre faceted** (sidebar tip magazin mare): preț, disponibilitate (în stoc), brand, material, vârstă, categorie de interes.
- **Hero** (banner mare cu imagine + titlu + buton), **footer** bogat (contact, social, coloane de linkuri, copyright/CUI), **pagini legale** (Despre, Contact, Termeni, Confidențialitate, Livrare, Retur, FAQ — indexate de Google, conforme ANPC), **bară de anunțuri**, **logo**.
- **Promoții pe site** — bannere / pop-up-uri (header-strip, footer-strip, side-modal).
- **Navigare** — meniul de sus, cu categoriile reale ca dropdown.
- **Theming** — culoarea brandului, fonturi, mod dark.

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
- `create_website` — creează site-ul (params: `brandId`, `kind` shop/site, `name`, `makeDefault`). Leagă automat meniul → canalul web.
- `apply_website_template` — populează structura (pagini, navigare, footer cu categorii reale) și preia **culoarea brandului**. `confirmReplace: true` ca să suprascrie.
- `list_websites` — ce site-uri are brandul.

**Pagini & componente**
- `set_website_page_content` — editează o pagină (titlu/vizibilitate/componente). Înlocuiește lista de blocuri a paginii.
- `add_website_section` — inserează o componentă pe o pagină **fără** a înlocui restul (ex. mai adaugi o grilă de produse featured).
- `delete_website_page` — șterge o pagină (util pentru pagini placeholder generice).
- `set_hero` — setează banner-ul hero (imagine, titlu, subtitlu, buton + link, opacitate overlay).
- `update_website_navigation` — meniul de sus. `rebuildCategoriesFromCatalog: true` reconstruiește dropdown-ul „Categorii" din categoriile reale **rădăcină** (scoate categoriile generice de template). Sau dă `items[]` pentru control total.
- `set_website_footer` — footer: `contactInfo` (adresă/telefon/email/program), `socialLinks`, `columns` (coloane de linkuri), `copyright`. `fillContactFromCompany: true` ia contactul din datele firmei; `rebuildCategoriesColumn: true` reface coloana de categorii din catalog.
- `set_website_legal_page` — text REAL pentru Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ (`slug` ∈ about/contact/terms/privacy/shipping/returns/faq). `fillCompanyData: true` adaugă nume firmă + CUI + adresă. **Acestea sunt pagini SSR — pentru conținut real folosește ACEST tool, nu doar un bloc de text.**
- `list_website_legal_pages` — ce pagini legale ai.

**Catalog, categorii & filtre** (alimentează magazinul)
- `bulk_create_products` — creează produse în masă (nume, preț via meniu, unitate, TVA, SKU/barcode, descriere). Pentru România: **TVA standard = 21%** (cotele RO sunt 0/11/21).
- `auto_create_menu_from_products` — generează meniul + categoriile din produse.
- `create_menu_category` — creează o categorie; acceptă `parentId` pentru ierarhie.
- `bulk_reparent_menu_categories` — mută atomic mai multe categorii sub un părinte (sau la rădăcină) — construiește/repară arborele.
- `set_products_menu_category` — pune mai multe produse într-o categorie deodată. **Important**: count-ul de produse pe categorie se citește de aici — fără el, categoria poate apărea „0 produse" chiar dacă are articole pe meniu.
- `add_menu_item` / `update_menu_item` — pun produsul pe meniu cu câmpurile de magazin: `productBrand` (brand), `material`, `ageRangeMin`/`ageRangeMax` (vârstă), `interestCategory` (categorie de interes), `dimensions`. **Acestea alimentează filtrele faceted** (brand/material/vârstă/interes).
- `set_product_image` / `bulk_set_product_images` — poza principală + galerie.
- `set_product_variants` — variante (mărime/culoare) cu preț/stoc per variantă.
- `define_product_custom_fields` / `list_product_custom_fields` — câmpuri custom pe produs (ex. „Certificare", „Compoziție").
- `set_product_recommendations` — produse recomandate (cross-sell).

**Promoții & setări**
- `create_website_promotion` / `update_website_promotion` / `list_website_promotions` — bannere/pop-up-uri pe site (placement: banner / header-strip / footer-strip / side-modal).
- `update_ecommerce_settings` / `get_ecommerce_settings` — monedă, TVA implicit, nume magazin, metode de checkout (ramburs / transfer bancar / card).
- `update_menu_display_config` — editări avansate pe configul site-ului (de folosit când un tool dedicat nu acoperă un câmp).

**Verificare (auto-check — folosește-l MEREU la final)**
- `audit_shop_health` — auditează sănătatea magazinului și întoarce probleme (`error`/`warn`) + statistici: categorii goale/plate/gunoi, TVA în afara cotelor RO (0/11/21), % acoperire filtre (brand/material/vârstă), email placeholder în footer, navbar/footer cu prea multe categorii, hero fără imagine, produse fără poză. **Rulează-l după ce construiești/imporți un magazin și repară problemele `error` ÎNAINTE de a spune că e gata** — nu aștepta ca userul să-ți găsească greșelile.

## Componentele de pagină (blocuri) — ce ai la dispoziție

Le pui prin `add_website_section`/`set_website_page_content` cu `type` + `config`:
- **`hero-slider`** — banner mare (imagine/gradient, titlu, subtitlu, buton). Pe pagini fără imagine degradează elegant într-un header colorat în culoarea brandului.
- **`category-grid`** — grilă de categorii (carduri cu poză + nr. produse). Se poate limita la anumite categorii (`selectedCategoryIds`) — folosit pe paginile părinte pentru subcategorii.
- **`product-grid`** — grila de produse. Opțiuni: `showFilters` (chips de categorii + căutare + sortare), `showFacets` (sidebar faceted: preț/brand/material/vârstă/disponibilitate), `categoryNavMode` (`flat`/`two-level`/`drill-down`), `categoryFilterId` (fixează o categorie), `productsPerPage`, `columns`.
- **`announcement-bar`** — bară de anunțuri sus (mesaje rotative cu iconițe: livrare/cadou/retur).
- **`newsletter`** — abonare la newsletter (inline).
- **`trust-badges`**, **`feature-cards`** — garanții / avantaje (plăți securizate, livrare rapidă, retur).
- **`brand-logos`** — logo-uri de branduri/parteneri.
- **`testimonials`**, **`text-block`**, **`contact`**, **`blog-list`** — recenzii, text liber, contact, articole de blog.

## Rețetă rapidă — un magazin online bun, repede

1. **Creează + șablon**: `create_website(kind:"shop", makeDefault:true)` → `apply_website_template(kind:"shop", confirmReplace:true)` (preia culoarea brandului).
2. **Catalog**: produse cu poze + preț + TVA 21 + brand/material/vârstă (pentru filtre) — prin `bulk_create_products` + `add_menu_item`(productBrand/material/ageRange/interestCategory) + `set_product_image`.
3. **Ierarhia de categorii**: creează categoriile cu `parentId` (sau `bulk_reparent_menu_categories`) ca să ai 8-12 categorii-părinte în meniul de sus, fiecare cu subcategorii. Atribuie fiecare produs la **frunza** lui (`set_products_menu_category`). Așa: meniul de sus e curat, paginile părinte arată subcategorii + produse, filtrele pe categorie merg.
4. **Hero** pe Acasă: `set_hero(imageUrl, title, subtitle, ctaText:"Vezi produsele", ctaUrl:"/magazin")`.
5. **Filtre**: activează `showFilters` + `showFacets` pe grila de produse (din pagina de catalog/categorie). Cu brand/material/vârstă populate, sidebar-ul faceted devine bogat.
6. **Footer + legale**: `set_website_footer(contactInfo + socialLinks + columns)` + `set_website_legal_page` pentru Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ (`fillCompanyData:true`) — conform ANPC, indexat de Google.
7. **Anunțuri + logo**: `add_website_section(type:"announcement-bar", ...)` + logo în navigare.
8. **Promoții**: `create_website_promotion` (pop-up de abonare / banner reduceri).
9. **Verifică**: deschide site-ul (link prin `gaseste_in_aplicatie`) — Acasă, o categorie-părinte (subcategorii + produse + filtre), Despre/Contact pline. Pune o comandă test.

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

## FAQ

- **Diferența website vs portal?** Portalul = app-ul pentru clienții din local (QR la masă: meniu/comenzi/rezervări). Website-ul = site-ul public indexat de Google, cu magazin. Configurări diferite, tool-uri diferite.
- **Pot importa un magazin existent (alt site)?** Da — vezi `onboarding/02d-import-surse-externe.md` (import asistat din surse externe). După import, aplici rețeta de mai sus (ierarhie + filtre + footer + legale).
- **Cum fac filtrele ca la magazinele mari?** Activează `showFacets` pe grila de produse ȘI populează brand/material/vârstă/interes pe produse.
- **De ce e goală o categorie când dau click?** Ori e părinte fără ierarhie setată, ori produsele nu sunt legate de ea (`set_products_menu_category`).
- **Unde văd comenzile de pe site?** În modulul de magazin — `ecommerce-magazin-online.md` (`/ecommerce/orders`).
