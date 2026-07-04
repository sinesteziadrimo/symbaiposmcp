# Protocol: Website Builder-Reviewer Loop (istoric)

> Acest protocol aparține vechiului skill `website-agent-loop`, înlocuit de `copiaza-website`. Rămâne aici doar ca referință pentru rulările pornite pe vechiul model.

## Contract de orchestrare

Orchestratorul ține lista de iterații și decide cine scrie. Subagenții pot fi folosiți pentru lucru, dar scrierile reale se fac secvențial: Builder termină, apoi Reviewer verifică read-only, apoi Builder repară.

Pentru un loop lung (ore sau zile), starea fiecărei iterații se păstrează într-un loc durabil (fișier de lucru / notițe ale rulării), ca să poți relua fără să pierzi firul:

```text
iteration:
sourceUrl:
targetBrand:
mode:
allowedWrites:
builderEvidence:
reviewFindings:
nextFixes:
learningCandidates:
stopDecision:
```

## Gate de completitudine pentru site-uri complexe

Pentru site-uri mari (multe pagini, catalog bogat, blog), loop-ul nu trece pe PASS după homepage sau după primele componente vizibile. Fiecare iterație trebuie să mențină un tabel scurt:

```text
pageSlug:
sourceSections:
localComponents:
missingSections:
assetsMissing:
seoOk:
status: pending|fixed|blocked
```

Inventariază toate linkurile din header/dropdown/footer și toate slug-urile canonice; fiecare slug are pagină locală, redirect păstrat sau blocaj explicit. Pentru pagini de meniu/catalog adaugă audit separat:

```text
menuAudit:
sourceCategories:
sourceProducts:
sourceProductsWithImages:
localCategories:
localProducts:
localProductsWithImages:
readOnlySamples:
writeNeeded: none|dry-run-required|confirmed
```

Reviewerul trebuie să refuze PASS dacă lipsesc pagini din navigație, dacă un meniu are produse-exemplu în locul produselor reale, dacă pozele produselor nu au fost căutate în datele reale ale sursei (nu doar în HTML-ul vizibil), sau dacă bara de categorii nu este sticky/scroll-spy/click-to-section.

Pentru site-uri cu blog, adaugă audit separat:

```text
blogAudit:
sourceIndexUrls:
sourceArticleCount:
sourceArticlesWithImages:
sourceArticlesWithFullContent:
localBlogPageHasListing:
localArticleCount:
localImportedSlugs:
placeholderPostsFound:
missingArticles:
writeNeeded: none|dry-run-required|confirmed
```

Reviewerul trebuie să refuze PASS dacă sursa are blog și local lipsește pagina `/blog` cu `blog-listing`, dacă articolele sunt carduri statice în loc de articole reale de blog, dacă `localArticleCount` este mai mic decât `sourceArticleCount` fără justificare, dacă lipsesc slug-uri/canonical/date/imagini de copertă, sau dacă au rămas ciorne placeholder de test.

## Guardrails non-negociabile

- Reviewer read-only real când se poate: un token fără module de scriere. Dacă există doar același token, marchează verificarea ca „read-only doar prin instrucțiune".
- Un singur Builder pe același website la un moment dat — nu porni două pass-uri de scriere simultan.
- Snapshot înainte de orice replace/editare mare: config website, navigație, footer, pagini, audit inițial și, dacă se atinge catalogul, categoriile/produsele relevante.
- `apply_website_template(confirmReplace:true)` cere confirmare + snapshot + criteriu de rollback.
- După fiecare scriere, citește înapoi (`list_websites`, config/audit) și nu repeta aceeași scriere doar pentru că interfața pare neschimbată — aplicația ține datele în cache în browser și se actualizează la refresh.

## Prompt Builder

```text
Ești Builder Agent pentru Symbai Website Loop.

Scop: construiește/îmbunătățește website-ul Symbai pentru brandul <targetBrand>, pornind de la <sourceUrl>.

Reguli:
- Folosește skill-ul construieste-website și cunoștințele de website builder.
- Începe cu citiri reale: list_brands, list_locations, list_websites, list_website_component_catalog, get_ecommerce_settings, list_menu_items/list_menu_categories, audit_shop_health.
- Pentru sursă, rulează analyze_external_website(crawlPages:true) și fă screenshot/intake unde se poate.
- Folosește componente standard prima dată. custom-html doar ca fallback controlat.
- După scrieri, rulează audit_shop_health și verifică prin link/screenshot sau raportează blocajul browserului.
- Înainte de replace/editări masive, creează snapshot și notează cum revii înapoi.

Returnează un evidence pack:
1. Ce ai schimbat în Symbai.
2. Linkuri/pagini verificate.
3. Audit și probleme rămase.
4. Ce ar trebui să verifice Reviewer.
```

## Prompt Reviewer

```text
Ești Reviewer Agent pentru Symbai Website Loop. Lucrezi STRICT read-only.

Scop: verifică critic rezultatul Builderului pentru <sourceUrl> -> <targetBrand>.

Interdicții:
- Nu scrii nimic prin conexiune.
- Nu repari direct.

Verifică:
- Paritate vizuală: homepage, header/nav/dropdown, hero/slider, categorii/meniu, pagină produs/serviciu, footer.
- Funcțional: categorii fără produse, filtre, CTA-uri, linkuri, pagina de contact/legal, coș/checkout dacă este magazin.
- SEO/migrare: slug-uri, harta URL-urilor, meta, pagini canonice, blog/galerie/pagini importante.
- Migrarea blogului: dacă sursa are blog, verifică paginarea, numărul articolelor, list_blog_posts, pagina /blog cu blog-listing, slug-uri, canonical, imagini și articolele placeholder.
- Sănătatea magazinului: audit_shop_health fără erori; warn-urile sunt explicate.
- Siguranța componentelor custom-html, dacă există.

Output:
- Findings întâi, ordonate P0/P1/P2/P3.
- Pentru fiecare finding: dovadă, impact, fix cerut, criteriu de acceptare.
- La final: verdict PASS / NEEDS_FIX / BLOCKED.
```

## Prompt de reparare

```text
Continuă ca Builder Agent. Ai feedback-ul Reviewerului de mai jos. Repară doar defectele listate sau dependențele lor directe. Păstrează părțile deja bune. După reparare, returnează un evidence pack nou și marchează fiecare finding ca fixed / not fixed / blocked.
```

## Candidat de învățare

Transformă o lecție în skill/knowledge doar când sunt adevărate toate:

- defectul a fost observat într-un rezultat real, nu doar bănuit;
- există cauză explicită, nu doar gust estetic;
- regula va ajuta și la alte website-uri, nu doar la brandul curent;
- nu contrazice `construieste-website`, `website-builder.md` sau documentația live a tool-urilor;
- schimbarea propusă e mică și verificabilă.

Format propus:

```text
learningCandidate:
symptom:
cause:
fixRule:
targetFile:
evidence:
```

## Automatizare lungă

Pentru rulări de ore/zile, promptul automatizării trebuie să includă toate intrările. Nu folosi placeholder-e.

Template scurt:

```text
Use $website-agent-loop to continue the guarded Builder/Reviewer loop for sourceUrl=<url>, targetBrand=<brand>, mode=<mode>. Respect max one builder write pass plus one reviewer pass per wakeup. Stop and report if audit_shop_health has no errors and reviewer has no P0/P1, or if blocked by missing permission/browser/MCP.
```

Pentru rulări noi, folosește însă skill-ul `copiaza-website` — are inventar onest al sursei, crawl pe server, coadă durabilă și verificare obiectivă cu `clone_parity_diff`.
