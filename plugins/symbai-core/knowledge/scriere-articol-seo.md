# Anatomia unui articol de top în 2026 + cum îl scrii

> Referința pentru skill-ul `scrie-articol-seo`. Continuă din `seo-2026.md`, `keyword-research-2026.md`, `geo-aeo.md`.

## Pe scurt

Un articol care rankează ȘI e citat de AI în 2026 = intenție potrivită cu SERP-ul + experiență reală a brandului + structură clară pentru oameni ȘI pentru LLM-uri + on-page corect + E-E-A-T. Scrii pentru businessul ACESTA (vocea lui, orașul lui, clienții lui), nu generic. **Dacă userul îți dă tema exact, o aplici; dacă nu, întrebi.** Nu inventezi cifre, recenzii sau surse.

## Înainte să scrii — înțelege brandul și întreabă

1. **Citește brandul:** `read_brand_memories` (voce, public țintă, stil, competitori), `list_brands`/`list_locations` (oraș, tip business), site-ul/meniul dacă e relevant. Nu presupune tonul — citește-l.
2. **Clarifică tema (dacă nu e dată exact):** întreabă userul — subiect, **cuvânt-cheie/întrebare țintă**, public (cine caută asta?), obiectiv (trafic / rezervări / autoritate), oraș/zonă (dacă e local). NU începe să scrii pe presupuneri.
3. **Verifică intenția din SERP** (vezi `keyword-research-2026.md`): e o întrebare informativă (merită articol) sau o căutare cu Map Pack (cere GBP, nu articol)? Dacă e greșit pentru blog, spune-i userului.
4. **Documentează-te** pentru oraș/țară/subiect: `seo_web_research(query, jobType:"blog_research", countryCode:"ro")` — primești observații + surse reale. Pentru un business local, caută specific („tendințe brunch [oraș] 2026", obiceiuri locale). **Citează sursele**; nu inventa.
5. **Cere un plan:** creează o ciornă (`create_blog_post` cu titlu + `primaryKeyword`), apoi `generate_content_brief(postId)` → structură H2/H3 + competitori SERP + cuvinte LSI + FAQ + word count țintă. Urmează planul.

## Structura (anatomie)

1. **Titlu (H1 = `title`)** — cuvântul-cheie principal (forma FĂRĂ diacritice) aproape de început, atractiv, ~50-60 caractere. Un singur H1.
2. **Intro (primul paragraf) = răspunsul direct, în 40–60 de cuvinte**, cu cuvântul-cheie — blocul pe care Google (featured snippet) și AI-ul îl pot cita ca atare. Abia după el vine contextul/hook-ul cu problema reală a cititorului.
3. **H2/H3 din brief, formulate ca ÎNTREBĂRI** (cum caută oamenii: „Cât costă…?", „Ce alegi pentru…?") — fiecare secțiune răspunde la o întrebare reală (din PAA). Răspuns concis imediat sub heading (~40-60 cuvinte), apoi detaliu. Fără salturi de nivel (H2→H4).
4. **Experiență & specific** — detalii pe care doar businessul le știe (cum aleg ingredientele, ce să comanzi cu copii, parcarea de lângă terasă), **foto reale** ale localului/preparatelor cu **alt-text** descriptiv.
5. **Elemente extractabile** (pentru featured snippet + AI): un **tabel** (preț/program/opțiuni), liste, definiții, plus **2–4 „fraze-citat"** — propoziții de sine stătătoare cu o cifră reală („Un meniu de prânz în centrul Clujului costă în medie 45–60 lei în 2026") — AI-ul citează exact astfel de fraze. Doar din date reale; nu inventa cifre.
6. **FAQ** la final (4-6 întrebări din PAA, răspuns 1-2 fraze) — hrănesc snippets + AI Overviews. (Panourile FAQ din Google au murit definitiv în 2026 — nu le promite; FAQ-ul se scrie ca TEXT VIZIBIL pentru cititor și pentru AI, nu pentru un panou.)
7. **Linkuri** — **3–8 interne**, nu doar spre articole conexe (`list_blog_posts`), ci mai ales spre paginile care convertesc: meniul, produsele, rezervări, pagina locației. Articolul aduce traficul; linkurile interne îl duc spre comandă. Plus 1+ **extern** spre o sursă autoritară.
8. **CTA & concluzie** — rezumat + îndemn clar (rezervare/comandă/citește mai mult).

## Checklist on-page (înainte de publicare)

- Titlu cu cuvântul-cheie (fără diacritice), 50-60 car.; **meta description** 140-160 car. cu cuvântul-cheie și un îndemn (≥70 car. obligatoriu la publicare).
- **Slug ASCII** scurt (transliterat: ă/â→a, î→i, ș→s, ț→t). NU schimba slug-ul unui articol publicat fără redirect 301.
- Cuvânt-cheie în: titlu, slug, meta, primul paragraf, cel puțin un H2.
- Conținut suficient de aprofundat (țintă din brief; minim ~600 cuvinte, dar adâncimea bate lungimea).
- **Cover image** (1200×630) + imagini cu alt-text; densitate rezonabilă.
- Linkuri interne ≥2, externe ≥1.
- Diacritice corecte în text; forma fără diacritice în titlu/meta.
- Câmpuri SEO setate la `create_blog_post`/`update_blog_post`: `primaryKeyword`, `secondaryKeywords`, `targetIntent`, `metaDescription`, `ogTitle`/`ogImageUrl`.
- **Autor REAL cu bio** (`primaryAuthorId`) — o persoană care există (chef, manager, proprietar), cu nume + bio + poză pe pagina de autori (`/blog/authors`), nu „Admin" sau un autor inventat. E-E-A-T = Google vrea să vadă CINE răspunde.
- Linkuri interne 3–8 (inclusiv meniu/produse/rezervări), externe ≥1; primul paragraf = răspuns direct 40–60 cuvinte; H2-uri ca întrebări; 2–4 fraze-citat cu cifre reale.
- **Audit:** rulează `seo_audit(postId)` → rezolvă problemele „fail"/„warn" până scorul e bun (≥80). Reaudit după fix.

## Fluxul complet (cu tool-uri)

1. `read_brand_memories` + clarifică tema (întreabă dacă lipsește).
2. `get_seo_provider_status` (ce surse ai) → `seo_keyword_research` / `get_search_performance` (cuvânt + variante + ce ai deja).
3. `seo_web_research` (documentare locală, surse citate).
4. `create_blog_post(status:"draft", title, primaryKeyword, targetIntent)` → `generate_content_brief(postId)`.
5. Scrie conținutul real (urmează brief-ul, vocea brandului, experiență, FAQ, linkuri).
6. `update_blog_post(id, content, metaDescription, secondaryKeywords, ogImageUrl, ...)`.
7. `seo_audit(postId)` → fix → reaudit.
8. **Arată userului ciorna și cere feedback** la unghi/titlu înainte de publicare (vezi `condu-chrome.md` — deschide editorul + screenshot). Publici DOAR la confirmare.
9. La publicare: `update_blog_post(id, status:"published")` (cere `metaDescription`≥70 + `coverImageUrl`). Platforma anunță automat motoarele compatibile IndexNow (Bing/ChatGPT/Copilot/DuckDuckGo); pe Google indexarea vine din sitemap + crawl, în 1–2 săptămâni — spune-i userului, nu promite instant. Amplifică pe social/email (skill `programeaza-postare`).
10. **Refresh substanțial la 60–90 de zile**: revino pe articolele publicate cu date noi, secțiuni noi, foto noi + re-audit — Google premiază prospețimea REALĂ, nu schimbarea datei fără conținut nou. Verifică periodic articolele mai vechi (`list_blog_posts`) și propune-i userului refresh-ul.

## Reguli (cele care contează)

- **Temă exactă → aplici; lipsă → întrebi.** Nu scrii pe presupuneri.
- **Nu inventa** cifre, recenzii, autori, surse, citate. Documentează (`seo_web_research`) sau întreabă.
- **Cere feedback** la decizii cu miză (unghi, cuvânt-cheie principal, schimbare de slug publicat) înainte să le faci.
- **Vocea brandului**, limbaj de restaurant — scrii pentru clienții LUI, nu un articol generic.
- **Onest despre AI/surse** — nu promite „garantat pe locul 1"; SEO ia timp (indexare 1-2 săptămâni).
