---
name: construieste-website
description: Construiește, îmbunătățește și configurează SITE-UL PUBLIC / magazinul online al brandului prin conexiune (MCP) — pagini, componente, ierarhie de categorii, filtre faceted, hero, footer, pagini legale (Despre/Contact/Termeni/ANPC), bară de anunțuri, logo, promoții, temă. Folosește la „fă-mi un site / magazin online", „construiește-mi magazinul", „adaugă filtre / categorii / subcategorii pe site", „site-ul arată gol / categoriile sunt goale", „pune un hero / banner / footer mai bun", „adaugă pagina Despre / Termeni / Livrare", „de ce nu apar produsele pe categorie", „fă site-ul să arate ca un magazin mare", „pune o bară de anunțuri / pop-up de reduceri", „schimbă aspectul / culorile site-ului". NU pentru: comenzi online/eMAG/feeds/retururi (→ gestioneaza-ecommerce-emag), portalul clienților de la masă (→ configureaza-portal).
---

# Construiește website / magazin online — hands-free, prin conexiune + link direct

Proprietarul vrea un **site public / magazin** care arată și funcționează bine — fără să umble prin builder. Tu faci munca prin **tool-urile MCP** (date + acțiuni reale pe instanța lui) și-i **arăți** rezultatul deschizând pagina cu link direct + screenshot. Vorbește pe limba lui de business („site", „magazin", „pagina Despre", „filtre", „categorii") — niciodată „MCP/tool/component/JSON".

## Înainte de orice
1. Citește **`knowledge/website-builder.md`** (ce poate face builder-ul, toate componentele, tool-urile, rețeta rapidă, capcanele) și **`knowledge/condu-chrome.md`** (cum arăți paginile: deep-link + screenshot). Pentru catalog/produse leagă `knowledge/produse-meniu-retete.md`; pentru comenzi/eMAG `knowledge/ecommerce-magazin-online.md`; pentru import dintr-un site existent `knowledge/onboarding/02d-import-surse-externe.md`.
2. **Context (citiri, fă-le întâi):** `list_brands` (+ `list_locations`) → `brandId`. `list_websites(brandId)` → există deja un site? ce `id`/`kind`? `get_ecommerce_settings(brandId)` → monedă/TVA/checkout. `list_menus`/`list_menu_items` → are catalog cu prețuri? `list_menu_categories` → câte categorii, au ierarhie? `browse_brand_media(brandId)` → poze pentru hero/logo.
3. **Permisiune** pe token: `setari` (scrierile de site/footer/legale/promoții) + `produse_meniu` (categorii/produse/atribuiri). Fără modul → scrierea întoarce „permisiune insuficientă" → userul bifează modulul în Hub → Acces AI.

## Decizia de start
- **Nu există site** → propune să-l creezi: `create_website(kind: shop|site, makeDefault:true)` → `apply_website_template(confirmReplace:true)` (preia culoarea brandului). `shop` = magazin; `site` = prezentare (restaurant/local).
- **Există dar arată slab / gol / fără filtre** → mergi pe lista de îmbunătățiri de mai jos, în ordinea impactului.
- Confirmă planul O DATĂ, apoi rulează lanțul fără re-întrebări.

## Cheat table — ce cere userul → ce faci

| Userul cere | Tool MCP (acțiune) |
|---|---|
| „fă-mi un magazin online de la zero" | `create_website(kind:"shop", makeDefault:true)` → `apply_website_template(confirmReplace:true)` |
| „categoriile sunt goale când dau click" | construiește ierarhia: `create_menu_category(parentId)` / `bulk_reparent_menu_categories` + leagă produsele cu `set_products_menu_category` |
| „nu am filtre / vreau filtre ca la magazine mari" | activează `showFacets`+`showFilters` pe grila de produse + populează `productBrand`/`material`/`ageRangeMin`/`ageRangeMax`/`interestCategory` prin `add_menu_item`/`update_menu_item` |
| „pune un banner / hero pe prima pagină" | `set_hero(imageUrl, title, subtitle, ctaText, ctaUrl)` (imaginea din `browse_brand_media` sau un produs reprezentativ) |
| „footer mai bun (contact, social, linkuri)" | `set_website_footer(contactInfo, socialLinks, columns, copyright, fillContactFromCompany:true, rebuildCategoriesColumn:true)` |
| „adaugă pagina Despre / Contact / Termeni / Livrare / Retur / Confidențialitate / FAQ" | `set_website_legal_page(slug, title, bodyParagraphs, fillCompanyData:true)` — pagini SSR, indexate, conform ANPC |
| „meniul de sus să arate categoriile reale" | `update_website_navigation(rebuildCategoriesFromCatalog:true)` (sau `items[]` pentru control) |
| „adaugă o secțiune (produse featured / branduri / avantaje)" | `add_website_section(type, config, pageSlug)` |
| „bară de anunțuri sus (livrare, reduceri)" | `add_website_section(type:"announcement-bar", config:{messages:[...]})` |
| „pop-up de abonare / banner de reduceri" | `create_website_promotion(placement: side-modal|banner|header-strip|footer-strip)` |
| „schimbă culorile / aspectul" | culoarea vine din brand (`apply_website_template` o preia); fine-tuning prin `update_menu_display_config` |
| „adaugă variante (mărimi/culori) la produs" | `set_product_variants(productId, variants)` |
| „TVA-ul e greșit (19%)" | corectează la **21%** (cota standard RO): `update_ecommerce_settings` + produsele (TVA pe produs) |

## Ordinea de impact când „faci site-ul ca lumea" (de sus în jos)
1. **Catalog complet** — produse cu poze + preț + TVA 21 + brand/material/vârstă.
2. **Ierarhia de categorii** — 8-12 părinți în meniu, restul subcategorii; fiecare produs pe frunza lui + `set_products_menu_category`. (Rezolvă „categorii goale" + meniu copleșitor + filtre pe categorie.)
3. **Filtre** — `showFacets`+`showFilters` pe grila de produse.
4. **Hero** pe Acasă (imagine reală).
5. **Footer + pagini legale** (Despre/Contact/Termeni/Confidențialitate/Livrare/Retur/FAQ, `fillCompanyData`).
6. **Anunțuri + logo + promoții**.
7. **Comandă test** (vezi `ecommerce-magazin-online.md`).

## Reguli
- **Confirmă înainte de `apply_website_template(confirmReplace:true)`** — rescrie structura paginilor.
- **Despre/Contact/legale = `set_website_legal_page`**, NU un bloc de text (sunt pagini SSR separate, indexate).
- **Verifică prin LINK** — după scriere, deschide pagina (deep-link via `gaseste_in_aplicatie` + screenshot prin extensia Chrome), nu te baza pe „am rulat tool-ul". Fără extensie poți opera, dar nu-i poți arăta — spune-i și oferă conectarea.
- **Confirmă după scriere cu citire** (`list_websites` / `get_ecommerce_settings` / `get_portal_config`) — interfața are cache (userul vede după refresh). Succes la tool = salvat; nu repeta.
- **TVA România = 0/11/21** (standard 21). Nu 19.
- Acțiuni care ies în afară (publicare, trimitere) → confirmă întâi.

## Capcane (din `website-builder.md`)
- Pagini legale = SSR separat (folosește tool-ul dedicat).
- Categorii plate → părinți goi (fă ierarhia).
- Categorie „0 produse" → leagă cu `set_products_menu_category`.
- Filtre goale → populează câmpurile de magazin pe produse.
- Icon cont care duce nicăieri → ascunde-l dacă nu ai portal, sau activează portalul.
