# Blog & SEO

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul Blog & SEO acoperă conținutul editorial al brandului tău și vizibilitatea lui în Google. Scrii și publici articole (manual sau cu AI), le organizezi pe categorii și autori, migrezi un blog vechi de pe altă platformă fără să pierzi poziții în căutări, și măsori traficul pe care îl aduc. Partea de SEO îți arată scorul fiecărei pagini, urmărește pozițiile cuvintelor-cheie în Google, sugerează cuvinte noi, compară-te cu concurenții și gestionează advertoriale plătite + backlink-uri. Tot conținutul se leagă natural cu Marketing (vezi `marketing-social.md`) pentru amplificare prin postări sociale și email. Este pentru proprietar/manager care vrea trafic organic și clienți noi de pe Google, fără să plătească reclame.

> **Pentru STRATEGIA SEO/AI 2026 + cum folosești tool-urile MCP de SEO ca un account manager**, vezi `seo-2026.md` (master), `keyword-research-2026.md`, `geo-aeo.md` (fii recomandat de ChatGPT/Claude/Perplexity), `local-seo-horeca.md`, `scriere-articol-seo.md` + skill-urile `scrie-articol-seo` / `cercetare-seo` / `optimizeaza-seo`. Acest fișier acoperă conceptele de bază și paginile aplicației.

## Concepte

- **Articol de blog** — pagină cu conținut editorial (titlu, slug, categorie, autori, dată, stare: ciornă / publicat / arhivat). Conține meta description, titluri H1-H3, imagini cu alt-text, link-uri interne.
- **Slug** — partea „umană" a adresei (ex. `blog/cum-aleg-ingrediente-proaspete`). Scurt, cu cuvântul-cheie. NU se schimbă după publicare fără redirect 301, altfel pierzi poziția în Google.
- **Categorie** — grupare a articolelor (ex. Rețete, Nutriție, Știri). Un articol stă într-o categorie; pentru etichetare multiplă există tag-urile.
- **Autor** — cine a scris articolul; are profil cu biografie și poză. Un articol poate avea mai mulți autori.
- **Meta description** — textul de 150-160 caractere care apare sub titlu în Google. Bun = mai multe click-uri (CTR mai mare).
- **H1, H2, H3** — ierarhia de titluri din articol. H1 e unic pe pagină și coincide cu titlul principal.
- **Alt-text** — descrierea unei imagini; ajută la SEO și la accesibilitate (cititoare de ecran).
- **Internal linking** — link-uri dintr-un articol către alte articole ale tale; arată Google că subiectele sunt legate.
- **Scor SEO** — notă 0-100 dată de un audit automat pe pagină (meta, lungime conținut, viteză, mobil, titlu duplicat etc.).
- **Core Web Vitals** — viteza reală a paginii, măsurată de Google: cât de repede se încarcă, cât de repede răspunde la click, cât de „stabil" e layout-ul. Lent = poziție mai joasă.
- **Keyword (cuvânt-cheie)** — ce caută oamenii în Google. Urmărit cu volum lunar, poziție, dificultate (0-100) și intenție (informativă / tranzacțională).
- **Poziție / ranking** — locul tău în Google pentru un cuvânt (poziția 1-3 = sus pe pagina 1).
- **CTR (Click-Through Rate)** — din câți oameni ți-au văzut rezultatul, câți au dat click.
- **Backlink** — un link de pe alt site către site-ul tău. Cu cât sursa e mai puternică și mai relevantă, cu atât mai valoros.
- **Domain Authority (DA)** — scor 0-100 al „puterii" unui domeniu. Backlink de la DA mare = mai valoros.
- **Advertorial** — articol plătit pe un site extern (ex. un blog de food) cu link înapoi la tine. Urmărești cost, trafic, conversii, ROI.
- **Redirect 301** — redirectare permanentă de la o adresă veche la una nouă. Transferă „autoritatea" SEO; obligatoriu când redenumești un slug sau muți articole.
- **Migrare blog** — transferul conținutului de pe altă platformă (WordPress, Ghost, Wix) păstrând SEO: slug-uri, redirect-uri 301, date, autori, imagini. Pentru website-uri copiate din sursa publică, blogul trebuie inventariat complet (pagină cu pagină) și importat ca articole de Blog, nu ca blocuri statice.

## Pagini

- **Comandă centrală Blog** (`/blog/tracker`) — privire de ansamblu, top articole după performanță, calendar editorial.
- **Articole** (`/blog/posts`) — lista articolelor cu filtre pe stare; adaugi articol nou, faci acțiuni în masă.
- **Editare Articol** — editorul unui articol (titlu, slug, categorie, autori, conținut, imagine, meta description, stare de publicare); se deschide din lista de articole (`/blog/posts`) dând click pe articolul dorit.
- **Autori** (`/blog/authors`) — profilurile autorilor (biografie, poză, articolele lor).
- **Import Blog** (`/blog/import`) — wizard de migrare: sursă (WordPress/Ghost/altă platformă), mapare autori/categorii/etichete, slug-uri și redirect-uri 301.
- **Migrare Blog** (`/blog/migration`) — migrare cu păstrarea SEO + raport post-migrare.
- **Redirecturi** (`/blog/redirects`) — redirect-uri 301 (adresă veche → nouă), monitor 404, import CSV.
- **Analiză trafic** (`/blog/analytics`, per articol `/blog/analytics/:postId`) — afișări, vizitatori unici, sesiuni, timp pe pagină, surse, dispozitive, țări.
- **Advertoriale** (`/blog/advertorials`, impact `/blog/advertorials/:id/impact`) — articole plătite externe: cost, trafic, conversii, ROI.
- **Backlinks** (`/blog/backlinks`, impact `/blog/backlinks/:id/impact`) — linkuri externe către tine, Domain Authority, impact SEO.
- **Summary SEO** (`/seo`) — vizibilitate în căutări, distribuția pozițiilor, top pagini după click-uri, SERP features.
- **Pages** (`/seo/pages`) — scorul SEO per pagină (titlu, meta, H1-H3, alt-text, viteză) + top queries.
- **Keywords** (`/seo/keywords`, detaliu `/seo/keywords/:id`) — pozițiile cuvintelor urmărite, volum, dificultate, CTR.
- **Keyword research** (`/seo/research`) — sugestii de cuvinte noi, intenție, long-tail, gap față de concurenți.
- **Competitors** (`/seo/competitors`, detaliu `/seo/competitors/:domain`) — pozițiile concurenților, backlink-urile lor, cuvinte pe care ei rankează și tu nu.
- **Setări SEO** (`/seo/settings`) — provider de date (Search Console/Semrush/Ahrefs), tracking, joburi de sincronizare.

## Fluxuri pas-cu-pas

1. **Scrii și publici un articol nou (cu AI)**: `/blog/posts` → „+ Articol Nou" → titlu, slug (se generează din titlu), categorie, imagine → scrii manual sau ceri AI să genereze textul → completezi meta description (150-160 caractere cu cuvântul-cheie), pui alt-text pe imagini, adaugi 2-3 link-uri interne → setezi stare „Publicat" + dată + autor → „Publică". Prin asistent: `create_blog_post` (cu titlu și conținut; opțional slug, categorie, meta, stare); editezi ulterior cu `update_blog_post`. Verifici cu `list_blog_posts`.
2. **Programezi un articol pentru mai târziu**: în editor pui stare „Publicat" și o dată în viitor → apare automat live la data respectivă. Verifici lista cu `list_blog_posts`.
3. **Optimizezi o pagină cu scor SEO mic**: `/seo/pages` → filtrezi paginile sub 60 → deschizi una → citești recomandările (titlu prea lung, meta lipsă, H1 duplicat, viteză mică) → mergi la editarea articolului, aplici fix-urile, comprimi imaginea → salvezi → reverifici scorul după ~24h. Prin asistent: `update_blog_post` (corectezi titlu, meta, conținut); urmărești efectul pe trafic cu `get_blog_analytics_overview`.
4. **Urmărești pozițiile cuvintelor-cheie**: `/seo/keywords` → „+ Adaugă Keyword" (vezi volum și dificultate) → tabelul îți arată poziția curentă cu cod de culori (verde 1-3, galben 4-10, roșu 11+) → click pe un cuvânt pentru evoluția pe 90 zile, articolele care rankează și concurenții. Dacă un cuvânt cu volum mare e pe poziție mică, optimizezi articolul aferent (cuvântul în titlu, H2, link-uri interne).
5. **Cercetezi cuvinte-cheie noi (gap față de concurenți)**: `/seo/research` → dai un subiect → primești sugestii (long-tail, sezoniere, cu intenție) → introduci domeniile concurenților → vezi ce cuvinte rankează ei și tu nu → bifezi 5-10 „quick wins" (volum mare, dificultate medie) și le treci pe lista de urmărire / le planifici articole.
6. **Importi/migrezi un blog vechi cu SEO păstrat**: `/blog/import` sau `/blog/migration` → alegi sursa (export din WordPress, Ghost sau fișier CSV) → mapezi autorii și categoriile vechi la cele noi → bifezi „Creează redirect-uri 301" (fiecare adresă veche → cea nouă) → descarci CSV-ul de mapare → finalizezi (rulează în fundal, primești raport). Prin asistent, când ai deja lista articolelor inventariate, folosești `bulk_create_blog_posts(dryRun:true)` apoi scrierea reală, păstrând slug/date/canonical/imagini și trimițând `legacyPath` pentru redirect 301. Testezi o adresă veche → trebuie să redirecteze la cea nouă. Verifici articolele cu `list_blog_posts`.
7. **Construiești backlink-uri (outreach)**: `/blog/backlinks` → vezi backlink-urile actuale și DA-ul lor → „+ Campanie de outreach" → subiect, site-uri țintă relevante, șablon de email (sugerat AI) → trimiți → urmărești răspunsurile (Trimis/Deschis/Răspuns/Link adăugat) → după 2-4 săptămâni vezi impactul pe `/blog/backlinks/:id/impact`. (Articolele tale de promovat: `list_blog_posts` + `get_blog_post`.)
8. **Amplifici un articol prin marketing**: publici articolul (`/blog/posts`) → copiezi titlu + link → mergi la `/social-hub` și programezi o postare cu link (`schedule_social_post`) → trimiți și o campanie email din `/email-campaigns` cu CTA „Citește mai mult". Trafic din mai multe canale = boost de poziție în Google. Detalii în `marketing-social.md`.

## Tool-uri MCP utile

- **Citire (fără permisiune de modul):** `list_blog_posts` (articolele brandului, filtru pe stare/categorie/tag), `get_blog_post` (detaliile unui articol), `list_blog_categories` (categoriile existente), `get_blog_analytics_overview` (trafic blog pe ultimele N zile: afișări, vizitatori, sesiuni, timp pe pagină, bounce rate).
- **Scriere (modulul «Marketing & Social Media» pe token):** `create_blog_post` (articol nou), `bulk_create_blog_posts` (import/migrare până la 50 de articole per apel, cu dry-run, păstrare slug/date/canonical și redirect 301 din `legacyPath`), `update_blog_post` (orice câmp: titlu, conținut, meta, categorie, stare, recomandat), `bulk_update_blog_posts` (publică/arhivează/marchează recomandat mai multe deodată).
- **Pentru link-ul exact către orice pagină:** `gaseste_in_aplicatie`.
- **Permisiunea exactă:** vezi `tools-mcp.md`. Pentru a crea/edita articole, token-ul AI trebuie să aibă bifat modulul „Marketing & Social Media" în Hub → Acces AI; altfel tool-urile de scriere returnează „permisiune insuficientă".
- **SEO prin asistent (tool-uri MCP — modulul «Marketing & Social Media» pentru cele de scriere/research):** `get_seo_overview`, `get_search_performance` (ce caută oamenii și pe ce poziție ești — Search Console), `list_seo_keywords` + `get_keyword_rankings`, `seo_audit` (scor + fix-uri), `get_seo_provider_status` (ce surse ai), `seo_keyword_research` (volum/dificultate hibrid), `list_seo_competitors`/`add_seo_competitor`/`suggest_seo_competitors`, `run_rank_tracker`, `seo_web_research` (research web pe subiect/oraș/concurent), `generate_content_brief`. Vezi skill-urile `cercetare-seo`, `optimizeaza-seo`, `scrie-articol-seo`.
- **Doar prin interfața web (NU prin asistent):** importuri vizuale complexe, redirecturi 301 manuale care nu vin din `legacyPath`, advertoriale, backlink-uri, dashboard-urile vizuale și setările de provider din paginile `/seo/*`.

## Întrebări frecvente

- **De ce nu apare articolul în Google deși e publicat?** Indexarea durează 1-2 săptămâni. Grăbește: în `/seo/settings` activează notificarea către Google la articole noi, asigură-te că sitemap-ul e generat, iar articolul are H2-uri, link-uri interne și meta bună.
- **Cum aleg un slug bun?** Scurt (3-5 cuvinte), cu cuvântul-cheie principal, litere mici, liniuțe între cuvinte, fără caractere speciale. Evită slug-uri generice („articol-1"). NU îl schimba după publicare fără redirect 301.
- **Core Web Vitals slabe (pagină lentă) — ce fac?** Comprimă imaginile sub 200 KB (format WebP), nu încărca poze brute din telefon, folosește un CDN. Verifică recomandările exacte pe Google PageSpeed Insights.
- **Cum lucrez cu mai mulți autori?** `/blog/authors` → „+ Autor Nou" (nume, biografie, poză) → la crearea articolului selectezi unul sau mai mulți autori.
- **Cum redenumesc corect un articol (alt slug)?** Editezi slug-ul, apoi în `/blog/redirects` creezi un redirect 301 de la adresa veche la cea nouă. NU șterge articolul vechi. Google transferă autoritatea în 1-2 săptămâni. Dacă doar rescrii conținutul, păstrează același slug — poziția se păstrează singură.
- **Backlink-urile de la site-uri mici (DA 10-20) ajută?** Puțin și doar cumulat. Mai important e ca sursa să fie relevantă pe subiect (un blog de food > un blog de IT) și anchor text-ul natural. Evită spam/PBN-uri — risc de penalizare de la Google.
- **Cum amplific un articol nou pe social și email?** Vezi fluxul 8 și `marketing-social.md`: postare programată cu link (`schedule_social_post`) + campanie email cu CTA. Traficul concentrat ajută poziția în Google.
- **Cum șterg un articol fără să stric SEO?** Nu-l șterge brusc (rămâne 404 în Google). Mai bine: setează-l „Arhivat", SAU creează un redirect 301 către un articol relevant care îl înlocuiește.

## Capcane

- **Slug schimbat fără redirect = 404 și pierdere de poziție.** Adresa veche moare, Google scoate articolul din index. MEREU creează redirect 301 în `/blog/redirects` înainte de a schimba slug-ul unui articol publicat.
- **Meta description lipsă sau prea scurtă = mai puține click-uri.** Completează MEREU 150-160 caractere cu cuvântul-cheie și un îndemn la acțiune.
- **H1 duplicat pe mai multe pagini** încurcă Google (nu știe care e „cea autoritară"). Verifică în `/seo/pages` și pune un H1 unic pe fiecare pagină.
- **Imagini prea grele (>1 MB)** încarcă pagina lent, scad Core Web Vitals și poziția. Comprimă-le ÎNAINTE de upload (țintă sub 200 KB pentru imaginea principală).
- **Alt-text lipsă** pe imagini = accesibilitate slabă + SEO ratat. Scrie 5-10 cuvinte descriptive, cu cuvântul-cheie dacă e relevant.
- **Fără link-uri interne** articolele rămân izolate și rankează mai slab. Pune 2-3 link-uri către articole conexe în fiecare text.
- **Backlink-uri cumpărate din PBN-uri/spam** = risc de penalizare manuală de la Google (poziții pierdute). Construiește backlink-uri organic, prin outreach pe site-uri relevante.
- **Lanț de redirect-uri (301 → 301 → 301)** dă eroarea „too many redirects" — utilizatorii nu mai pot intra. După migrări, redirectează direct de la adresa veche la cea finală, nu prin intermediari.

> Vezi și `marketing-social.md` pentru amplificarea conținutului prin postări sociale, campanii email și reclame plătite — Blog & SEO sunt o componentă a Centrului de comandă marketing.
