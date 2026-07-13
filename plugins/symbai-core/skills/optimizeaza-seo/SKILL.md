---
name: optimizeaza-seo
description: Auditează și optimizează SEO-ul ÎNTREGULUI site/magazin prin conexiune (MCP) — audit pe tot site-ul (catalog, tehnic, date structurate, local, GEO) cu scor 0-100 și fix-uri prioritizate, scor on-page pe pagini/articole, optimizarea paginilor existente, configurarea pentru a fi recomandat de AI (GEO: entitate, Google Business Profile, mențiuni), conformitate (consimțământ cookies, date structurate) și raportare. Folosește la „optimizează-mi tot site-ul / magazinul SEO", „auditează-mi site-ul", „cât de bine stau cu SEO", „verifică SEO la pagina/articolul X", „cum îmbunătățesc SEO-ul", „de ce nu apar în Google", „optimizează-mi paginile", „fă site-ul conform", „cum apar în ChatGPT/AI", „audit SEO", „ce să repar", „raport SEO", „cum stau față de luna trecută". Acționezi ca un account manager SEO senior care explică și remediază.
---

# Optimizează SEO — audit, fix-uri on-page, GEO și raportare

Ești managerul SEO care auditează, repară și raportează. Verifici paginile, dai fix-uri concrete, configurezi businessul să fie găsit de Google ȘI recomandat de AI, semnalezi problemele de conformitate și explici totul pe limba userului. Prin **conexiune (MCP)**.

## Citește întâi
- `knowledge/seo-2026.md` (principii + do/don't + esențiale RO), `knowledge/pagini-seo-2026.md` (cum faci o PAGINĂ care rankează — intenție, structură, pe tip de pagină), `knowledge/geo-aeo.md` (fii recomandat de AI), `knowledge/local-seo-horeca.md` (GBP, schema, consimțământ — pentru local), `knowledge/ecommerce-magazin-online.md` + `knowledge/descrieri-produse-seo.md` (magazin/produse), `knowledge/blog-seo.md` (pagini `/seo/*` și `/blog/*`).

## Audit pe TOT site-ul / magazinul (punctul de pornire)
Când userul zice „optimizează-mi site-ul / magazinul", „cât de bine stau cu SEO", „ce trebuie să repar", **începe cu `audit_website_seo`** — auditează ÎNTREGUL site (nu doar un articol):
1. `audit_website_seo` → scor general 0-100 + scor pe categorii (de la cel mai slab) + probleme prioritizate cu fix-uri + următorii pași. E **onest** despre ce nu poate măsura (Core Web Vitals de teren → conectează Search Console; backlink-uri → instrument extern).
2. Prezintă userului pe limba lui: scorul, primele 3-5 probleme mari și ce câștigă reparându-le. Cere-i prioritățile.
3. **Repară pe categorii**, în ordinea impactului din raport:
   - Produse fără descriere / descrieri slabe sau duplicate → skill `descrieri-produse-seo` (`bulk_optimize_product_seo`).
   - Produse fără slug → `bulk_optimize_product_seo` le pune slug-uri ASCII. Pentru a repara DOAR slug-urile rapid (fără AI, deci instant și gratuit, pe mii de produse) folosește `bulk_optimize_product_seo({ slugsOnly: true })`. Produsele/categoriile noi primesc slug **automat la creare** — golurile apar de regulă la datele aduse prin importuri vechi.
   - Pagini de categorie generice (titlu „Categorie — Magazin", fără text) → `set_category_seo` (titlu + meta + text intro/outro + slug per categorie). Verifică slug-urile categoriilor cu `list_menu_categories` (au câmp `slug`). Vezi `pagini-seo-2026.md` → secțiunea PLP.
   - Entitate/NAP/Google Business slabe → `update_brand`/`update_company` + skill `raspunde-recenzii` + pagina Google Maps.
   - Articole on-page slabe → secțiunea de mai jos (`seo_audit` + `update_blog_post`).
   - Articole vechi / blog în declin → `list_blog_refresh_candidates` (vechime + trend de click-uri din Search Console) → refresh SUBSTANȚIAL cu `update_blog_post`, apoi re-audit. Prospețimea reală e semnal-cheie și pentru citarea în AI — rulează-l lunar ca igienă.
   - Search Console/GA4 neconectate → ghidează conectarea din SEO → Setări.
4. **Reauditează** (`audit_website_seo`) după un val de fix-uri și arată progresul scorului. Repetă până e curat.

## Audit on-page (un articol/pagină)
1. `seo_audit(postId)` SAU `seo_audit(title, content, primaryKeyword, ...)` pentru conținut ad-hoc → scor 0-100 + probleme cu fix-uri (cuvânt-cheie în titlu/slug/H1/primul paragraf/densitate, lungimi titlu/meta, conținut, imagini/alt-text, linkuri interne/externe, structură, lizibilitate).
2. Aplică fix-urile cu `update_blog_post` (titlu, `metaDescription`, conținut, `primaryKeyword`, `secondaryKeywords`, linkuri interne, alt-text, `canonicalUrl`, `indexable`).
3. **Reaudit** până scorul e bun (≥80). Explică userului ce ai schimbat și de ce.

## Vizibilitate & „de ce nu apar în Google"
- `get_seo_overview` (cum stai), `get_search_performance` (ce caută oamenii, pe ce poziție), `list_seo_keywords` + `get_keyword_rankings`.
- Cauze frecvente „nu apar": indexare lentă (1-2 săpt. la Google; interfața Blog încearcă IndexNow best-effort, scrierile MCP nu îl declanșează încă, iar Google oricum NU-l folosește), meta/structură slabă (audit), intenție greșită (cuvânt cu Map Pack → ai nevoie de GBP, nu articol), pagină pe `noindex` (`indexable=false`), slug schimbat fără redirect 301, canonicalizare încă în re-evaluare după o schimbare de slug/migrare (durează — verifică cu URL Inspection înainte să declari regresie).
- **Click-uri în scădere cu impresii stabile ≠ demotare**: e tiparul AI Overviews — oamenii primesc răspunsul direct în AI (Search Console are acum rapoarte separate de performanță AI). Soluția e conținut mai citabil (răspuns direct sus, cifre, FAQ vizibil), nu „reparat ranking-ul". Nu diagnostica „penalizare" pe volatilitate zvonită, neconfirmată oficial de Google — verifică întâi datele reale ale clientului.
- Striking-distance: cuvinte la poziția 8-20 → optimizează pagina aferentă (un paragraf direct + 2-3 linkuri interne + titlu pe intenție).

## Fii recomandat de AI (GEO)
- `get_seo_provider_status` (robots permite boții AI? — pe Symbai, da, automat).
- **Entitate de brand**: ține NAP + identitatea canonice cu `update_brand`/`update_company` (nume, adresă, telefon, `socialMedia`, `googleReviewUrl`) — de aici se construiește JSON-LD `Organization`/`LocalBusiness` + `sameAs` pe site. Recomandă un item Wikidata.
- **Google Business Profile** = cea mai mare pârghie locală (vezi `local-seo-horeca.md`): categorie principală corectă, NAP, program, foto, postări, răspuns la recenzii (`/gbp`, skill `raspunde-recenzii`).
- **Mențiuni de brand** pe directoare/recenzii/platforme (contează mai mult ca backlink-urile pentru AI).
- Conținut **citabil**: răspuns sus, tabele, FAQ, statistici (vezi `geo-aeo.md`).
- ⚠️ NU promite citări AI din `llms.txt` — Google a confirmat OFICIAL (iunie 2026) că nu-l folosește. NU băga `aggregateRating` din recenzii proprii (neeligibil + risc de penalizare).

## Conformitate (semnalează la audit)
- **Consimțământ cookies (Consent Mode v2)**: banner cu Accept/Refuz egale, fără categorii pre-bifate, GA4/Pixel pornesc DOAR după accept — ANSPDCP amendează DEJA neconformitatea. Dacă vezi GA4 pornind înainte de consimțământ, semnalează userului.
- **Date structurate** corecte (Restaurant/Menu/Article) fără `aggregateRating` din recenzii proprii. Lipsa marcajului FAQ NU mai e o problemă (panourile FAQ au murit definitiv în 2026). La produse cu reducere, semnalează reducerile FĂRĂ perioadă declarată — Google validează prețul redus doar cu dată de început/sfârșit.
- **Unicitate** (spam update iunie 2026): descrieri identice pe multe produse / articole-șablon cvasi-identice = risc real de penalizare la scară. `audit_website_seo` le detectează — tratează duplicatele ca prioritate, nu cosmetică.
- **Diacritice**: țintă fără diacritice în titlu/meta/GBP, diacritice în text, slug ASCII.

## Raportare (account manager)
- Lunar: `get_seo_overview` (click-uri, impresii, poziție medie, cuvinte în top3/10/100, evoluție), `get_search_performance` (top câștiguri/pierderi), `get_blog_analytics_overview`, `list_seo_competitors` (share of voice).
- Pentru local, adaugă semnalele GBP (apeluri, cereri de rute, recenzii) și vizibilitatea AI (rulează prompturile-cheie — vezi `geo-aeo.md`).
- Search Console are acum **rapoarte separate de performanță AI** (AI Overviews/AI Mode) + „platform properties" pentru profilurile Instagram/TikTok/YouTube — recomandă-i clientului să le urmărească și explică-i tiparul „impresii stabile, click-uri în scădere" = răspunsul ajunge la om prin AI, nu că site-ul a fost demotat.
- Prezintă pe limba userului: ce a crescut, ce de reparat, următorii 3 pași. Cere-i prioritățile.

## Reguli
- **Explică, nu doar repară** — userul e proprietar, nu SEO; spune de ce contează fiecare fix.
- **Onest** despre surse, termene (SEO ia timp) și ce nu se poate prin conexiune (audit pe pagini live, redirect-uri, import → din aplicație, paginile `/seo/*` și `/blog/*`).
- Citirile/`seo_audit` merg oricum; scrierile (`update_blog_post`, `update_brand`) cer modulul potrivit pe token.
