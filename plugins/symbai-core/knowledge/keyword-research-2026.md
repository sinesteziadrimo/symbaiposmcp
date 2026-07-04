# Keyword research în 2026 — metodă + tool-urile MCP

> Continuă din `seo-2026.md`. Aici e CUM găsești cuvintele potrivite, înțelegi ce trafic au și ce idei de conținut să propui.

## Pe scurt

Keyword research bun în 2026 = (1) clasifici intenția citind SERP-ul real, (2) construiești autoritate pe subiect prin pillar + cluster, (3) tratezi volumul ca un INTERVAL, (4) sapi în surse GRATUITE de întrebări reale, (5) optimizezi și pentru citare AI, nu doar linkuri albastre. Pentru un site local mic (un restaurant/hotel), țintești long-tail cu dificultate mică unde poți chiar câștiga.

## Pasul 1 — clasifică intenția din SERP, ÎNAINTE de volum

Pentru fiecare cuvânt, uită-te ce rankează Google pe pagina 1 și etichetează:

| Vezi în SERP | Intenție | Ce pagină construiești |
|---|---|---|
| Bloguri, Wikipedia, People Also Ask | informativă | articol de blog / ghid |
| Pagini de brand + sitelinks | navigațională | (deja o ai — nu e o țintă de research) |
| „cel mai bun / top / vs / recenzii" + comparații | comercială | pagină de comparație / listă |
| Produs, preț, „comandă/rezervă/preț/near me" | tranzacțională | pagină produs/serviciu/rezervare |
| Map Pack (hartă + 3 localuri) | locală | Google Business Profile + landing page local (NU articol) |

**Modificatori RO (cheat-sheet):** informativ: cum/ce/unde/când/cât/de ce/ghid · comercial: cel mai bun/top/vs/recenzii · tranzacțional: comandă/rezervare/meniu/preturi/near me · local: în [oraș]/lângă mine/[cartier].

⚠️ Regula care salvează timp: un articol de blog **nu** va ranka niciodată pentru „restaurant italian Cluj" (acel SERP e Map Pack + agregatoare) — ăla cere GBP + landing local. Rezervă blogul pentru întrebări informative reale: „cât ține o rezervare la restaurant", „ce vin se asortează cu paste".

## A 6-a intenție: generativă (AI)

Oamenii formulează prompturi („recomandă un restaurant romantic în [oraș] cu opțiuni vegane"). Nu au volum clasic — le urmărești manual (vezi `geo-aeo.md`). Optimizezi să fii citabil: blocuri întrebare-răspuns, tabele, entități, recenzii consistente. Pentru restaurante, ~78% din interogări declanșează un AI Overview, deci a fi numit în răspuns contează enorm.

## Pillar + cluster (autoritate pe subiect)

- O **pagină pillar** largă (~2.500-4.000 cuvinte) pe un URL de nivel înalt (`/nunti/`, nu `/blog/nunti/`), înconjurată de **8-12 articole cluster** (800-1.500 cuvinte) pe subteme long-tail.
- Fiecare cluster linkează SUS spre pillar (anchor descriptiv), pillar-ul linkează JOS spre fiecare cluster (hub-and-spoke), clusterele se cross-linkează unde are sens.
- Conținutul în cluster câștigă ~3× mai multe citări AI decât postările izolate și ține pozițiile mai mult.
- Exemple HoReCa: hotel → pillar „Cazare în [oraș]" + clustere „hotel pet-friendly [oraș]", „hotel cu parcare [oraș]", „ce să vizitezi în [oraș]". Restaurant → pillar „Restaurant [bucătărie] în [oraș]" + clustere pe preparate, evenimente, brunch, rezervări de grup.

## Dificultate (KD) și volum — citește-le corect

- **KD** = estimare 0-100 (mai mult din profilul de linkuri al rezultatelor de pe pagina 1). Benzi: 0-14 foarte ușor, 15-29 ușor, 30-49 mediu, 50+ greu. Un site local nou țintește **KD < 30** și long-tail unde agregatoarele (TripAdvisor/Booking) sunt mai slabe. KD diferă de la un tool la altul — folosește-l ca filtru relativ, nu ca adevăr.
- **Volumul e un INTERVAL.** Google Keyword Planner arată game logaritmice și cere campanie Ads activă pentru numere exacte. Tool-urile clickstream (Ahrefs/Semrush) par precise dar sunt zgomotoase pe termeni locali cu volum mic. **Pentru local, ai încredere în semnalele reale** (impresiile tale din Search Console, Google Trends) mai mult decât în orice estimare. Un termen „0-10" poate aduce rezervări reale.

## Surse GRATUITE de cuvinte (cele mai bune)

1. **Search Console propriu** (`get_search_performance`) — cuvintele pentru care DEJA apari. Filtrează interogări pe poziția ~8-20 cu impresii = **„striking distance"**: optimizezi puțin (un paragraf care răspunde direct + 2-3 linkuri interne + titlu pe intenție) și urci pe pagina 1. Cel mai rapid ROI pentru un site existent.
2. **Google Suggest / Autocomplete — „alphabet soup"**: pornești de la un seed și adaugi a-z, cuvinte de întrebare (cum/ce/unde/când/cât/care/de ce) și prepoziții (pentru/cu/lângă/fără). Generează variante **cu ȘI fără diacritice** (mulți români tastează fără) și deduplică (normalizare NFD).
3. **People Also Ask + „Căutări asociate"** — arborele de întrebări reale → fiecare devine un H2 cu un răspuns concis (~40-60 cuvinte) = featured snippet + citare AI.
4. **Google Trends** — sezonalitate și interogări în creștere. Detectezi când urcă „terasă [oraș]", „meniu de Crăciun", „cazare munte iarna" și publici/actualizezi cu 4-6 săptămâni înainte.

## Workflow cu tool-urile MCP

1. **Vezi ce surse ai:** `get_seo_provider_status` (provider plătit de volume? Search Console conectat?). Fii onest cu clientul.
2. **Cuvinte de la un seed:** `seo_keyword_research(seed)` — întoarce volum/dificultate dacă există provider plătit; altfel idei reale din Search Console + (cu `includeWeb=true`) teme din web. Spune clar care sursă.
3. **Ce trafic ai deja:** `get_search_performance` (top interogări + pagini, cu poziție/CTR) — găsește „striking distance".
4. **Documentare pe subiect/oraș:** `seo_web_research(query, jobType:"blog_research")` pentru întrebări și surse; `jobType:"trend_scan"` pentru tendințe.
5. **Concurenți:** `add_seo_competitor` / `list_seo_competitors` / `suggest_seo_competitors`, plus `seo_web_research(jobType:"competitor_audit", competitors:[...])` ca să vezi ce acoperă ei.
6. **Pune pe urmărire:** `track_seo_keyword` (cele bune, cu `targetPosition`, `intent`, `associatedPostId`), apoi `run_rank_tracker` ca să măsori pozițiile (necesită provider SERP).
7. **Plan de articol:** `generate_content_brief(postId)` după ce ai o ciornă cu titlul + cuvântul-cheie.

## Competitor gap (+ gap de vizibilitate AI)

Compară cuvintele tale cu 3-5 concurenți LOCALI reali (nu lanțuri naționale). Caută unde ei rankează pe pagina 1 și tu nu, cu volum/intenție comercială. Nou în 2026: verifică și unde **concurentul e CITAT în AI Overviews** și tu nu — gap de închis cu tacticile GEO.

## Capcane

- **Nu țintești cuvinte cu Map Pack cu un articol** — ăla cere GBP + landing local.
- **Nu dismiss-ui cuvintele cu volum mic** — în local, long-tail-ul cu „0-10" aduce clienți; validează pe impresiile reale din Search Console.
- **Nu prezenta estimările drept volume Google exacte** — mai ales fără provider plătit (rulează `get_seo_provider_status`).
- **Diacritice**: țintește forma fără diacritice în titlu/meta/GBP; păstrează diacriticele în textul articolului.
