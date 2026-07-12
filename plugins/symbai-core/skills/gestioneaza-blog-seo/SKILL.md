---
name: gestioneaza-blog-seo
description: Scrie și gestionează conținutul de website al restaurantului prin conexiune (MCP) — articole de blog, SEO, oferte pe bon și bannere de promoție pe site, fără click prin tab-uri. Folosește la „scrie-mi un articol despre X", „pune articolul pe blog", „publică postarea", „fă o ciornă de articol", „actualizează articolul Y", „arată-mi articolele / draft-urile / ce am publicat", „pune-le pe categorii", „publică toate ciornele", „marchează articolul ca recomandat", „cum merge blogul / cât trafic am", „de ce nu apare în Google", „fă un banner pe site", „pune o promoție pe website", „adaugă o ofertă -20% / happy hour / 1+1", „pierd bani la oferta asta?", „ce promoții am active", „ce colecții de produse am". Tu faci munca prin conexiune; Chrome doar îi ARĂȚI userului rezultatul pe pagina lui.
---

# Blog, SEO & promoții website — Claude ca editor de conținut, prin MCP

Userul (proprietar/manager) vrea conținut pe website-ul lui: articole de blog care aduc trafic din Google, bannere care anunță o promoție, oferte care chiar reduc nota la POS. Tu le faci prin **conexiune (tool-uri MCP)** — scrii, actualizezi, listezi date direct — și folosești **Chrome doar ca să-i ARĂȚI** rezultatul pe pagina lui. Click pe tab-uri = ultima soluție; majoritatea muncii are tool. **Cel mai important: scrii conținut REAL și bun, confirmi deciziile mari și nu inventezi cifre.**

> **Ești și account manager SEO senior.** Ai acum tool-uri MCP pentru keyword research, audit on-page, concurenți, research web și content briefs — nu mai e „doar din aplicație". Pentru muncă SEO aprofundată folosește skill-urile dedicate: **`scrie-articol-seo`** (articol de top cu research local + feedback), **`cercetare-seo`** (cuvinte, concurenți, trafic, idei), **`optimizeaza-seo`** (audit, fix-uri on-page, GEO/AI, conformitate, raportare). Acest skill rămâne HUB-ul pentru a publica/lista/edita articole + oferte/promoții website. Strategia completă (2026): `knowledge/seo-2026.md`, `geo-aeo.md`, `keyword-research-2026.md`, `local-seo-horeca.md`, `scriere-articol-seo.md`.

## Înainte de orice
1. Citește **`knowledge/blog-seo.md`** (concepte: slug, meta description, scor SEO, keyword, redirect 301, advertorial, backlink; toate paginile `/blog/*` și `/seo/*`; cele 8 fluxuri pas-cu-pas; ce se poate prin MCP vs. doar din aplicație) și **`knowledge/condu-chrome.md`** (doctrina „tool MCP → deep-link → click pe element, nu pe pixel"; screenshot-ul = livrabilul pentru user; capcana unității active brand+locație; fallback fără extensie). Pentru amplificarea unui articol pe social/email → **`knowledge/marketing-social.md`**.
2. **Context**: `list_brands` → `brandId` (majoritatea tool-urilor îl cer; un singur brand ⇒ implicit). `list_locations` doar dacă o ofertă/promoție e pe o locație anume.
3. **Extensia Chrome** (`claude-in-chrome`) + user logat = ca să VEZI și să-i ARĂȚI paginile. Nu e conectată? Tot poți face munca prin MCP, dar nu i-o poți arăta pe ecran — spune-i clar și dă-i link-ul direct (regula fallback din `condu-chrome.md`).

## Ce tool pentru ce vrea userul (intenție → tool MCP)

| Userul spune… | Tool MCP | Note |
|---|---|---|
| „ce articole am / arată-mi draft-urile / ce am publicat" | `list_blog_posts` | filtru `status` (draft/scheduled/published/archived), `category`, `tag`, `author`, `featured` |
| „arată-mi articolul X / ce conține" | `get_blog_post` | după `id` (din `list_blog_posts`) |
| „ce categorii de blog am" | `list_blog_categories` | util înainte de a clasifica un articol |
| „scrie/fă un articol despre… / pune-l pe blog ca ciornă" | `create_blog_post` | `status:"draft"` (default) = nepublicat |
| „publică articolul ACUM" | `create_blog_post` cu `status:"published"` | cere `metaDescription` ≥70 caractere + `coverImageUrl` |
| „programează-l pentru …" | `create_blog_post` cu `status:"scheduled"` + `scheduledAt` (ISO) | se publică automat la dată |
| „importă blogul vechi / copiază articolele de pe site" | `bulk_create_blog_posts` (sau `create_blog_post` pe loturi mici) | intai inventariezi sursa + `list_blog_posts`; dry-run; pastrezi slug/date/canonical/imagini; trimite `legacyPath` pentru redirect 301 |
| „modifică / corectează / rescrie articolul Y" | `update_blog_post` | orice câmp (titlu, conținut, meta, categorie, featured, status) |
| „publică toate ciornele / arhivează-le / marchează recomandate" | `bulk_update_blog_posts` | `action`: publish / archive / feature / unfeature, `ids[]` (max 100) |
| „cum merge blogul / cât trafic am / vizitatori" | `get_blog_analytics_overview` | `days` (default 28); afișări, vizitatori unici, sesiuni, timp pe pagină, bounce |
| „verifică SEO la articol / ce să îmbunătățesc" | `seo_audit` | scor 0-100 + fix-uri concrete (skill `optimizeaza-seo`) |
| „ce cuvinte să țintesc / ce trafic e pe cuvinte / pe ce apar în Google" | `seo_keyword_research`, `get_search_performance`, `get_seo_overview` | (skill `cercetare-seo`) |
| „cine-s concurenții / research piață-oraș / idei de articole" | `list_seo_competitors`, `suggest_seo_competitors`, `seo_web_research` | (skill `cercetare-seo`) |
| „fă-mi un plan pentru articolul X" | `generate_content_brief` | structură + competitori SERP + LSI + FAQ + word count |
| „fă un banner / pop-up pe site / pune o promoție pe website" | `create_website_promotion` | anunț VIZUAL (nu reduce prețul); cere `name` + `targetUrl` |
| „ce promoții de website am" | `list_website_promotions` | filtru `placement`, `activeOnly` |
| „modifică banner-ul / oprește-l / schimbă-i textul-linkul" | `update_website_promotion` | după `id` |
| „adaugă o ofertă -20% / happy hour / sumă fixă / 1+1 (pe bon)" | `create_offer` (+ întâi `preview_offer_margin`) | reducere REALĂ pe notă la POS; are Margin Guardrail |
| „pierd bani la oferta asta? / verifică marja" | `preview_offer_margin` | nu salvează nimic; arată marja înainte/după |
| „ce oferte am active" | `list_offers` | filtru `activeOnly`, `locationId` |
| „ce colecții de produse am (magazin online)" | `list_product_collections` | doar citire; e din modulul magazin online |

**⚠ Oferte ≠ Promoții website.** O **ofertă** (`create_offer`) chiar scade nota la POS (happy hour, -X%, 1+1). O **promoție website** (`create_website_promotion`) e doar un banner/pop-up vizual pe site care duce către o pagină — NU schimbă prețul. Dacă userul zice „pune o reducere", întreabă-l: vrei reducere pe bon (ofertă) sau doar un anunț pe site (banner)?

## Fluxul (cum lucrezi)

**1) Scrii un articol de blog.** Întreabă userul subiectul, cuvântul-cheie și publicul. **Scrii conținut real** după regulile 2026 (detalii: `knowledge/scriere-articol-seo.md` / skill `scrie-articol-seo`): titlu cu cuvântul-cheie, **primul paragraf = răspunsul direct în 40–60 de cuvinte**, **H2-uri formulate ca întrebări**, 2–4 fraze-citat cu cifre reale, **3–8 link-uri interne** (mai ales spre meniu/produse/rezervări, nu doar articole — verifică cu `list_blog_posts`), **autor real cu bio** (`primaryAuthorId`), o **meta description de 150-160 caractere** și un slug scurt. Lasă-l implicit **ciornă** (`status:"draft"`) ca să-l vadă userul înainte; publici cu `status:"published"` doar la confirmarea lui (și-ți trebuie `metaDescription`≥70 + `coverImageUrl` — dacă nu ai poză de copertă, cere-i-o sau lasă pe draft). Confirmă cu `get_blog_post` / `list_blog_posts`. Nu inventa poze, autori sau cifre.

**1b) Importi/migrezi articole dintr-un site existent.** Nu rezuma blogul si nu-l transforma in carduri statice. Inventariaza indexul si paginarea sursei (`/blog/`, `/blog/page/2/`, sitemap/RSS daca exista), pastreaza lista `title/date/url/image/excerpt/legacyPath`, apoi intra pe paginile de articol pentru continut complet. Citeste local cu `list_blog_posts`; arhiveaza sau actualizeaza drafturile placeholder. Ruleaza `bulk_create_blog_posts(dryRun:true, slugConflictPolicy:"update")`, verifica raportul inclusiv `redirectsCreated`, apoi scrie real. Daca instanta nu are tool-ul bulk, foloseste `create_blog_post` pe loturi mici si spune limita explicit. Verifici cu `list_blog_posts` + `get_blog_post` pe esantioane + testezi 1-2 URL-uri vechi.

**2) Îi ARĂȚI rezultatul (Chrome).** Userul nu vede conexiunea. După ce ai creat/editat un articol, deschide pagina și fă-i screenshot: `navigate("/blog/posts")` (lista, cu status) sau editorul `navigate("/blog/<brandId>/posts/<id>/edit")`. Tool-urile întorc și un link direct la articol — dă-i-l. Pentru trafic, `get_blog_analytics_overview` + (opțional) `navigate("/blog/analytics")`.

**3) Promoție pe website (banner).** `create_website_promotion(name, targetUrl, placement, title, subtitle, ctaLabel, imageUrl)` — `placement` ∈ banner / header-strip / footer-strip / side-modal. Apoi arată-i: `navigate("/website/promotions")` + screenshot. Modifici/oprești cu `update_website_promotion(id, active:false…)`.

**4) Ofertă pe bon (cu plasă de siguranță pe marjă).** ÎNTÂI `preview_offer_margin(type, value, …)` — îți spune dacă vinzi sub cost și ce volum suplimentar îți trebuie ca să iasă pe plus. Spune-i userului verdictul. Dacă e ok, `create_offer(name, type, value, …)`. Dacă oferta vinde sub cost, tool-ul o **REFUZĂ** — nu insista: explică-i userului și creează doar dacă el confirmă explicit (`confirmLoss:true`). Vezi ofertele cu `list_offers`.

## Navigare (deep-link, NU click prin meniu)
Blogul și promoțiile folosesc **rute pe cale**, nu `?tab=` — du-te direct cu `navigate(url)` (NU inventa URL-uri; ruta vine din `blog-seo.md` / `gaseste_in_aplicatie`):
- Articole (listă + status): `/blog/posts` · Editor articol: `/blog/<brandId>/posts/<id>/edit`
- Comandă centrală / top articole: `/blog/tracker` · Trafic: `/blog/analytics` (per articol `/blog/analytics/<postId>`)
- Autori: `/blog/authors` · Categorii/etichete se setează din editorul articolului
- SEO (vizibilitate, scor pagini, keywords, research, concurenți): `/seo`, `/seo/pages`, `/seo/keywords`, `/seo/research`, `/seo/competitors`, `/seo/settings`
- Oferte pe bon: `/menu/promotions` · Promoții website (bannere): `/website/promotions`

⚠ Unitatea activă (brand + locație) filtrează ce vezi pe ecran și e o stare a browserului — comut-o cu dropdown-ul `data-testid="select-global-unit"` ÎNAINTE de screenshot dacă nu ești pe brandul corect (vezi `condu-chrome.md`, regula g).

## Cele care chiar cer un CLICK (n-au tool MCP)
Restul SEO + operațiile editoriale grele se fac **doar din aplicație** — ghidează-l userului acolo (link + pași) sau, cu extensia, conduce-l prin Chrome pe ELEMENT (nu pe pixeli):
- **Import / migrare blog** (de pe WordPress/Ghost/CSV, cu redirect-uri 301): `/blog/import`, `/blog/migration`.
- **Redirect-uri 301** (obligatorii la schimbarea unui slug publicat — altfel 404 în Google): `/blog/redirects`.
- **Audit SEO, keyword research, concurenți, research web și content briefs au ACUM tool-uri MCP** (`seo_audit`, `seo_keyword_research`, `get_search_performance`, `list/add/suggest_seo_competitors`, `run_rank_tracker`, `seo_web_research`, `generate_content_brief`) — folosește skill-urile `cercetare-seo` / `optimizeaza-seo`, NU mai trimite userul în UI pentru ele. Rămân doar prin interfața web: **advertoriale & backlink-uri** (`/blog/advertorials`, `/blog/backlinks`), dashboard-urile vizuale și setările de provider din `/seo/*`.
- **Ștergerea** de articole/oferte/promoții întregi nu e disponibilă prin conexiune → ghidează-l să șteargă din aplicație (sau pune articolul pe `archived` + redirect 301, ca să nu strici SEO).

## Reguli (cele care contează)
- **Munca prin MCP, Chrome doar ca să arăți** (screenshot = livrabilul). Nu reproduce prin click ceva ce un tool face dintr-un apel. După scriere, confirmă re-citind (`get_blog_post`/`list_*`), nu „pare bine pe ecran" (`condu-chrome.md`, regula f).
- **Ciornă întâi, publici la confirmare.** Publicarea cere `metaDescription`≥70 + `coverImageUrl` — dacă lipsesc, lasă pe draft și spune-i userului ce mai trebuie. Nu publica fără să-i arăți textul. La publicare platforma anunță automat motoarele compatibile (Bing/ChatGPT/Copilot prin IndexNow); pe Google indexarea vine din sitemap + crawl (1–2 săptămâni — nu promite instant).
- **Articolele vechi se împrospătează**: la 60–90 de zile propune un refresh SUBSTANȚIAL (date/secțiuni/foto noi + re-audit), nu doar schimbarea datei — Google premiază prospețimea reală.
- **Slug-ul nu se schimbă după publicare fără redirect 301** (altfel 404 + pierzi poziția în Google). Dacă userul vrea alt slug pe un articol publicat, fă întâi redirect-ul în `/blog/redirects` (UI) — explică-i de ce.
- **Oferta poate vinde sub cost** → rulează MEREU `preview_offer_margin` întâi; respectă refuzul Margin Guardrail (creezi cu `confirmLoss:true` doar la confirmarea explicită a userului).
- **Nu inventa** poze de copertă, autori, testimoniale, cifre de trafic sau prețuri. Ce lipsește → întrebi userul.
- **Permisiune**: citirile (`list_*`/`get_*`, `preview_offer_margin`, `list_product_collections`) merg oricum; **scrierile** (`create_/update_/bulk_create_/bulk_update_blog_posts`, `create_/update_offer`, `create_/update_website_promotion`) cer modulul **«Marketing & Social Media»** (`marketing_social`) bifat pe token. „Permisiune insuficientă" → portal Hub → Acces AI.
- **Limbaj de restaurant**, nu jargon de editor („pun articolul ca ciornă", „fac un banner pe site", „verific dacă pierzi bani la reducere"), nu `status`/`placement`/`Margin Guardrail`.

## Legături
- **SEO aprofundat (2026)** → skill-urile `scrie-articol-seo` (scrie un articol de top), `cercetare-seo` (cuvinte/concurenți/trafic), `optimizeaza-seo` (audit/fix-uri/GEO/raportare) + `knowledge/seo-2026.md`, `geo-aeo.md`, `keyword-research-2026.md`, `local-seo-horeca.md`, `scriere-articol-seo.md`.
- Concepte + toate paginile `/blog`+`/seo` + cele 8 fluxuri + capcane (slug fără redirect, meta lipsă, imagini grele) → `knowledge/blog-seo.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element nu pixel, fallback fără extensie, capcana unității) → `knowledge/condu-chrome.md`.
- Amplifică articolul pe social + email → skill-ul `programeaza-postare` + `knowledge/marketing-social.md` / `email-marketing.md`.
- Navigare rapidă (rutele exacte) → `gaseste_in_aplicatie(termen scurt)` + skill-ul `gaseste-pagina`.
- Ceva ce nu se poate prin conexiune (import/redirect/audit SEO/backlink) → ghidează în app; lipsă reală de funcție → `trimite_ticket_symbai` (sugestie).
