# Reputație & Recenzii — Playbook 2026

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare. Pentru workflow-ul operațional pas-cu-pas vezi skill-ul `raspunde-recenzii`.

## Pe scurt

Reputația nu mai e cosmetică: în 2026 e o pârghie cantitativă de creștere. Recency (cât de recente sunt recenziile) este factorul #1 individual de ranking local, recenziile contribuie ~16% din greutatea totală a poziției în harta locală, iar motoarele AI (Google AI Overview, ChatGPT) recomandă local pe baza temelor din recenzii — deci recenziile tale devine input direct pentru SEO și pentru recomandarea AI.

Trei numere de pus pe perete: rată de răspuns 100%, viteză sub 4h la negative / sub 24h la pozitive, și velocity de 3-5 recenzii noi pe lună, sistematic. Cere recenzii de la TOȚI clienții (nu doar de la cei mulțumiți — filtrarea e ilegală), tratează un negativ ca pe o oportunitate de loialitate, și măsoară lunar.

## Concepte

- **Recency = factorul #1 de ranking local (2026)** — recenziile sub 30 de zile au greutate maximă; 30-180 zile = decay; peste 180 zile = doar 10-20% din putere. Un local cu 80 de recenzii proaspete bate unul cu 500 vechi de 2 ani. Peste ~50-75 recenzii totale randamentul scade — atunci contează fluxul constant, nu numărul brut.
- **Velocity țintă: 3-5 recenzii noi/lună** — sistematic, asta poate ridica poziția cu 40-60%. Nu „o explozie o dată pe an", ci flux constant lună de lună.
- **Rată de răspuns: țintă 100%** — restaurantele independente răspund la doar ~38% din recenzii. Fiecare +25% rată de răspuns ≈ +4.1% conversie; a răspunde sistematic crește ratingul cu ~0.12 stele în 6 luni; 65% din consumatori aleg un business care răspunde. 4.3 stele+ = +35% rezervări.
- **Viteză de răspuns: <4h la negative, <24h la pozitive** — la TOATE în 24-48h. Media pieței e 2.7 zile; cine răspunde în 24h depășește majoritatea concurenței locale. 32% din consumatori așteaptă răspuns a doua zi.
- **Paradoxul recuperării serviciului (service recovery)** — un client tratat exemplar DUPĂ o problemă devine mai loial decât unul care n-a avut probleme. Un răspuns matur la o recenzie de 1 stea crește încrederea cititorilor viitori; deseori clientul actualizează la 5 stele sau șterge recenzia. Rețeta: (a) asumare fără defensivă, (b) fără scuze justificative, (c) mutare offline cu rezolvare concretă + compensație țintită.
- **ANTI-GATING — cere de la TOȚI, e obligatoriu legal** — „review gating" (a cere recenzie doar de la cei mulțumiți, filtrând negativele) încalcă politicile Google ȘI legea. FTC Consumer Review Rule (enforcement 2026) prevede penalități civile de până la ~53.000 $/încălcare (caz real: Fashion Nova 4.2M $). Nu condiționa stimulente de o recenzie pozitivă. Ceri de la toți clienții, la fel.
- **Cere recenzia la momentul potrivit** — dine-in: la 1-2h după închiderea notei. Retail/online: după confirmarea livrării. Evită fereastra înainte de 9:00 / după 20:00 (ora clientului). SMS bate emailul: open ~98% (vs 20-30% email), conversie în recenzie completată de 3-5x mai mare.
- **Reputație → SEO local + recomandare AI** — review signals = ~16% din greutatea poziției locale; recency e #1. În plus, motoarele AI sintetizează recenziile în răspunsuri: contează temele consistente din text (fel de mâncare, oraș, ocazie), nu doar stelele. Analizează pe teme recurente (serviciu, preț, așteptare, curățenie) și acționează operațional.
- **UGC (poze/clipuri client) = social proof, dar cu reguli** — clientul deține copyrightul din momentul creării. Pentru repostare comercială: permisiune explicită documentată. Dacă ai incentivat conținutul (masă gratis, discount), dezvăluie conexiunea materială (ghidurile FTC). Respectă GDPR pe imagini cu persoane.

## Fluxuri frecvente

### 1. Triaj zilnic la negative (<4h) — service recovery
1. `gbp_reviews_summary` [citire] + `list_retail_reviews` (filtrează pe rating mic, ex. maxRating=3) [citire] — izolează negativele noi, sortate pe recency.
2. Pentru fiecare: rezumă problema + propune un răspuns de tip service-recovery (asumare → mutare offline → compensație țintită).
3. **Confirmă textul cu proprietarul** înainte de publicare.
4. Publică: pe Google `gbp_reply_review(confirm:true)` [marketing]; pe restul platformelor `reply_to_retail_review(confirm:true)` [marketing] ȘI dă-i linkul direct la recenzie pe platforma respectivă (vezi capcana de mai jos — pe unele platforme răspunsul se salvează doar local).
5. Raportează clar: ce ai publicat efectiv pe Google și ce trebuie postat manual pe celelalte.

### 2. Răspuns la pozitive (în lot, țintă 100% rată de răspuns)
1. `list_retail_reviews` (rating mare, ex. minRating=4, fără răspuns) [citire] + `gbp_reviews_summary` [citire].
2. Pentru fiecare: răspuns scurt personalizat = mulțumire + UN detaliu specific din textul recenziei + invitație de revenire. (Nu copy-paste identic — sunt detectabile.)
3. Confirmă lotul cu proprietarul → publică (`gbp_reply_review` / `reply_to_retail_review`, `confirm:true`).
4. Țintă: 100% rată de răspuns; sub 24h la pozitive.

### 3. Campanie de velocity lunară (3-5 recenzii noi/lună, ANTI-GATING)
1. `comms_get_status` [citire] + `check_marketing_allowed` [citire] — verifică că poți trimite și că textele RO de invitație sunt setate.
2. `list_ecommerce_orders` (status livrat, ultimele X zile) [citire] sau lista de comenzi/vizite recente.
3. Pentru fiecare comandă: `dispatch_review_invitations_for_order(confirm:true)` [marketing] — în fereastra 9:00-20:00, canal SMS preferat.
4. **ANTI-GATING**: trimite la TOȚI clienții eligibili, nu doar la cei pe care îi crezi mulțumiți. Fără condiționare pe rating pozitiv.
5. La 2-4 săptămâni măsoară conversia (câte recenzii noi au apărut) și ajustează cadența. Țintă: 3-5/lună.

### 4. Raport lunar de reputație (pentru proprietar)
1. `sync_retail_reviews(confirm:true)` [marketing] — adu recenziile la zi de pe platforme.
2. `gbp_reviews_summary` + `get_retail_reviews_summary` + `gbp_rank_summary` [citire] — rating, tendință, poziție în harta locală.
3. `list_retail_reviews` [citire] — citește textele și clasifică pe teme/sentiment (serviciu, preț, așteptare, curățenie).
4. Sinteză pentru owner: rating + tendință, velocity vs ținta 3-5/lună, rată de răspuns vs 100%, top 3 teme pozitive + top 3 negative, recenzii restante fără răspuns, 3 acțiuni concrete.
5. Opțional: creează sarcini operaționale pe temele negative recurente (vezi skill-ul `gestioneaza-sarcini`).

### 5. UGC → social proof (legal)
1. Identifică o recenzie 5 stele cu fotografie reușită (`list_retail_reviews` [citire]).
2. Cere permisiune scrisă de repostare (drepturile aparțin clientului) + dezvăluie dacă a fost incentivat.
3. Refolosește ca postare socială (skill-ul `programeaza-postare`) și ca testimonial pe website. Respectă GDPR pe imagini cu persoane.

## Tool-uri MCP utile

- `get_retail_reviews_summary` [citire] — sumarul reputației pe magazin/retail (rating, număr, tendință) pe care îl pui în raport.
- `list_retail_reviews` [citire] — lista recenziilor cu text; filtrează pe rating (minRating/maxRating) ca să separi pozitivele de negative și citește temele.
- `sync_retail_reviews(confirm:true)` [marketing] — sincronizează recenziile de pe platforme înainte de un raport, ca să lucrezi pe date la zi.
- `reply_to_retail_review(confirm:true)` [marketing] — salvează/postează răspunsul la o recenzie de magazin. ATENȚIE: pe unele platforme doar salvează răspunsul local — vezi capcana de mai jos.
- `dispatch_review_invitations_for_order(confirm:true)` [marketing] — trimite invitația de recenzie după o comandă (SMS preferat). Motorul campaniei de velocity.
- `gbp_reviews_summary` [citire] — sumarul recenziilor de pe Google Business Profile (rating, volum, fără-răspuns).
- `gbp_reply_review(confirm:true)` [marketing] — publică răspunsul direct pe Google la o recenzie GBP.
- `gbp_rank_summary` [citire] — poziția locală / share-of-voice, util ca să legi velocity de mișcarea în harta locală.
- `check_marketing_allowed` [citire] + `comms_get_status` [citire] — verifică permisiunea de trimitere și starea canalelor înainte de invitații.

> Tool-urile cu `confirm:true` declanșează o acțiune reală (publicare răspuns, trimitere invitații, sincronizare). Confirmă MEREU textul/audiența cu proprietarul în cuvinte înainte de a le rula.

## Întrebări frecvente și capcane

- **CAPCANĂ ONESTĂ — „am răspuns pe Trustpilot/Booking" poate fi fals.** `reply_to_retail_review` pe unele platforme doar SALVEAZĂ răspunsul în Symbai; nu îl postează automat pe site-ul terț (Trustpilot, TripAdvisor etc.). Nu pretinde niciodată „am răspuns pe Trustpilot" dacă tool-ul doar a salvat local. Spune cinstit: „Am pregătit/salvat răspunsul; postează-l aici [linkul platformei]." Pe Google, în schimb, `gbp_reply_review` publică efectiv. Întotdeauna raportează separat ce s-a publicat real vs. ce trebuie pus manual.
- **NU mai pregăti/publica întrebări-răspuns (Q&A) pe Google Business.** Funcția Q&A din GBP a fost oprită (3 noiembrie 2025) și se retrage. Google generează acum răspunsuri AI din recenzii, postări și site. Deci: nu mai publica Q&A; în schimb ține recenziile și postările Google bogate (de acolo se hrănește AI-ul) și pune informația reală ca FAQ pe site. ChatGPT, în plus, ia date locale din Bing Places — nu doar din Google.
- **De ce contează recency mai mult decât numărul total?** Pentru că algoritmul local pune greutate maximă pe recenziile sub 30 de zile. 5 recenzii proaspete în luna asta valorează mai mult decât 50 vechi de doi ani. De aceea ținta e operațională (3-5/lună), nu „să strâng 500".
- **Pot să cer recenzii doar clienților mulțumiți?** Nu — e ilegal (FTC, enforcement 2026, penalități până la ~53.000 $/încălcare) și încalcă politicile Google. Ceri de la TOȚI, la fel, fără condiționare pe rating și fără stimulent pentru o recenzie pozitivă.
- **O recenzie negativă îmi strică reputația?** Invers, dacă o gestionezi bine. Un răspuns matur la 1 stea crește încrederea cititorilor viitori, iar clientul recuperat exemplar devine mai loial decât unul fără probleme (paradoxul recuperării serviciului). Asumare → fără defensivă → mutare offline → compensație țintită.
- **Cum cer recenzii fără să par insistent?** La momentul potrivit (1-2h după nota dine-in / după livrare), pe SMS, în fereastra 9:00-20:00, cu `dispatch_review_invitations_for_order`. Un mesaj bine plasat convertește de 3-5x mai bine decât emailul.
- **De ce să răspund chiar și la cele de 5 stele?** Rata de răspuns ridică ratingul (~0.12 stele/6 luni), crește conversia (+4.1% la fiecare +25% rată) și hrănește răspunsurile AI. Țintă: 100%, sub 24h.
- **Cum leg reputația de SEO?** Recenziile = ~16% din poziția în harta locală, cu recency #1; velocity constantă mișcă poziția în 2-3 săptămâni. Pentru partea de hartă/Google Business vezi `knowledge/seo-local-gbp.md` și skill-ul `gaseste-pagina` pentru pagina exactă.

## Vezi și

- `skills/raspunde-recenzii/SKILL.md` — workflow operațional Claude Code pentru răspuns și invitații.
- `marketing-social.md` — refolosirea UGC ca postări și testimoniale.
- `loialitate-fidelizare.md` — service recovery → win-back și loialitate.
- `gdpr-clienti-oaspeti.md` — consimțământ, imagini cu persoane, dezabonări.
