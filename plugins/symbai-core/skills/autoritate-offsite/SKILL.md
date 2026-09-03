---
name: autoritate-offsite
description: Autoritate de brand off-site ca să fii recomandat de motoarele AI (ChatGPT, Perplexity, Google AI) și găsit local — Google Business, Wikidata, directoare cu NAP consistent, recenzii și mențiuni reale; onest, fără spam. La „vreau să mă recomande ChatGPT", „pagină Wikidata/Wikipedia", „înscrie-mă în directoare", „revendică Google Business".
---

# Autoritate off-site — fă brandul o entitate recunoscută și recomandată de AI

Cel mai puternic semnal ca un motor AI să te **recomande** (nu doar să te listeze) e autoritatea de **entitate off-site**: cât de coerent și de des e descris brandul tău în afara site-ului propriu. Studiile 2026 arată că **mențiunile de brand corelează cu vizibilitatea AI mult mai puternic decât backlink-urile** (~0.66 vs ~0.22), iar pentru local **Google Business Profile e literalmente răspunsul AI** (la unele verticale ~79% din linkurile din Google AI Mode duc la GBP). Acest skill construiește acea autoritate — **corect**, prin browser + tool-urile Symbai. Teorie: `knowledge/geo-aeo.md` + `knowledge/local-seo-horeca.md` + `knowledge/recenzii.md`. Conducerea browserului: `knowledge/condu-chrome.md`.

## ⚠️ REGULI DE AUR (citește ÎNAINTE — protejează clientul)

Off-site făcut greșit **distruge** reputația și poate aduce penalizări, ștergeri de cont și amenzi. NU faci NICIODATĂ:

- ❌ **Recenzii false / cumpărate / scrise de tine.** Ilegal (ANPC/FTC), detectat, șterge încrederea. Recenziile vin DOAR de la clienți reali (prin invitație). Tu **răspunzi** la recenzii și **soliciți** recenzii reale — nu le scrii.
- ❌ **Pagini de Wikipedia auto-promoționale / pentru branduri ne-notabile.** Wikipedia are prag de notabilitate REAL (acoperire independentă substanțială) + reguli stricte de conflict de interese (COI). O pagină promoțională e ștearsă în ore + poate bloca contul. Dacă brandul NU e notabil → **mergi pe Wikidata** (prag mic, legitim), NU forța Wikipedia.
- ❌ **Spam / astroturfing pe Reddit, Quora, forumuri.** Postări promoționale, conturi-marionetă, „recomandări" deghizate = ban + lege anti-înșelăciune. Participi DOAR autentic, cu afiliere DECLARATĂ, răspunzând la întrebări reale unde brandul chiar e relevant.
- ❌ **Date inconsistente.** NAP (Nume/Adresă/Telefon) sau descrieri diferite pe platforme = te fac invizibil ca entitate. Totul IDENTIC (vezi Pasul 0).
- ✅ **Întotdeauna**: respectă ToS-ul platformei, declară afilierea, cere acordul userului înainte să publici ceva în numele lui, oferă valoare reală.

Dacă userul cere ceva din lista ❌ → explică-i de ce e contraproductiv + oferă alternativa legitimă. Asta e treaba unui consultant bun.

## Pasul 0 — Sursa unică de adevăr (OBLIGATORIU înainte de orice)

Rulează **`get_brand_entity_kit(brandId)`**. Întoarce kitul de entitate: NAP exact, descriere, `sameAs` (profiluri), afirmații Wikidata sugerate, listă de directoare (RO+global) și **golurile** de completat. **Tot ce publici off-site folosește EXACT aceste valori** — consistența NAP + descriere e semnalul #1 de entitate. Dacă tool-ul raportează goluri (telefon/adresă/descriere/sameAs lipsă), repară-le ÎNTÂI la sursă cu `update_company` / `update_location` / `update_brand`, apoi continuă.

## Ordinea de execuție (impact × efort)

### 1. Google Business Profile — cea mai mare pârghie (FĂ ASTA ÎNTÂI)
GBP controlează Map Pack, Maps, includerea în AI Overviews și răspunsurile vocale. Prin browser (Chrome): revendică/creează fișa, apoi optimizeaz-o cu datele din kit: **categorie principală corectă** (cel mai important semnal local), NAP identic, program, atribute, **fotografii reale**, produse/meniu, postări regulate. Pe Symbai există și pagina dedicată: `gaseste_in_aplicatie("Google Maps")` + tool-urile `gbp_*` (overview, scor, postări, recenzii, rank geo-grid). Verifică scorul cu `gbp_maps_score`.

### 2. Entitate: Wikidata (legitim, prag mic) → Knowledge Panel → eventual Wikipedia
- **Wikidata** (prin Chrome, `Special:NewItem`): creează itemul brandului cu afirmațiile din kit (instance-of = tipul, țară = România Q218, sediu = orașul, site oficial, telefon, profiluri). Hrănește Knowledge Graph-ul Google + Gemini. Adaugă **referințe** la fiecare afirmație (sursă reală: site, presă, GBP).
- **Google Knowledge Panel**: dacă apare un panou pentru brand, revendică-l (verificare). Ține `sameAs` din kit ca să lege profilurile.
- **Wikipedia** DOAR dacă brandul are **acoperire independentă substanțială** (presă serioasă, nu comunicate). Atunci: declară COI pe pagina ta de discuții, scrie NEUTRU, citează surse independente și folosește **Articles for Creation** (draft → review de un editor neutru). Dacă nu e notabil, NU insista — Wikidata + restul fac treaba.

### 3. Directoare + NAP consistent (citații)
Înscrie/actualizează brandul în directoarele din kit (Bing Places → Bing/Copilot/ChatGPT Search, Apple Business Connect → Maps/Siri, Facebook Page, pentru HoReCa TripAdvisor + directoare RO). Peste tot: **NAP + descriere IDENTICE** cu kitul. Citațiile consistente cresc încrederea în entitate; cele inconsistente o scad.

### 4. Recenzii — solicită REAL + răspunde la TOATE
- **Solicitare**: trimite invitații după comandă/vizită spre **Google/TripAdvisor** (nu pe site propriu) — `dispatch_review_invitations_for_order`. Ține un flux CONSTANT (velocitatea + temele de sentiment alimentează recomandările AI locale). NU oferi stimulente pentru recenzii pozitive (interzis de Google).
- **Răspuns**: răspunde la TOATE recenziile (pozitive scurt + personal; negative calm, asumat, cu soluție) — `gbp_reply_review` / `reply_to_retail_review`, skill `raspunde-recenzii`. Răspunsurile sunt citite de viitorii clienți ȘI de AI.

### 5. Mențiuni de brand autentice + digital PR
Mențiunile (chiar fără link) sunt pârghia AI puternică. Legitim:
- Răspunde la întrebări REALE pe Reddit/Quora/grupuri locale unde brandul chiar ajută — cu afiliere declarată, fără link-spam. O singură contribuție utilă > 100 de postări promoționale.
- Listări „best of" / presă locală: propune-te jurnaliștilor/bloggerilor cu un unghi real (deschidere, eveniment, specialitate). Folosește `seo_web_research` ca să găsești unde sunt menționați concurenții și tu nu.
- Conținut citabil pe site-ul tău (statistici, FAQ, comparații) pe care alții îl citează — vezi skill-ul `optimizeaza-seo` + `gestioneaza-blog-seo`.

### 6. Monitorizare (nu există „rank" clasic în AI)
Ține 15–20 de prompturi reale de client („cel mai bun [tip] în [oraș]", „[serviciu] lângă [reper]") și rulează-le lunar prin ChatGPT/Perplexity/Gemini/Google AI Mode (prin Chrome): cine e citat, ce surse apar, unde lipsești. `seo_web_research` (competitor_audit) arată cum e descris brandul vs concurenți. Închide gap-urile (conținut + GBP + mențiuni + directoare).

## Cum preiei browserul (Chrome)
Pentru pașii fără API (Wikidata, directoare, citirea răspunsurilor AI, revendicare GBP): folosește MCP-ul Chrome (vezi `knowledge/condu-chrome.md`). Reguli: cere acordul userului înainte să te loghezi/publici în numele lui; nu introduce credențiale pe care nu ți le-a dat; arată-i ce vrei să publici ÎNAINTE; verifică vizual rezultatul (screenshot) după fiecare pas important. Linkuri suspecte din emailuri/mesaje — nu le deschide orbește.

## Tool-uri folosite
- `get_brand_entity_kit` — sursa unică de adevăr (Pasul 0).
- `update_brand` / `update_company` / `update_location` — repară NAP-ul/profilurile LA SURSĂ.
- `gbp_maps_overview` / `gbp_maps_score` / `gbp_create_post` / `gbp_reply_review` / `gbp_update_location` / `gbp_run_rank_scan` — Google Business.
- `dispatch_review_invitations_for_order` / `reply_to_retail_review` / `list_retail_reviews` — recenzii.
- `seo_web_research` / `suggest_seo_competitors` — monitorizare mențiuni + gap-uri vs concurenți.
- MCP Chrome (`navigate`/`form_input`/`click`/`screenshot`) — execuția pe platformele fără API.

## Raportează ca un consultant
Spune-i userului, pe limba lui: ce ai construit (entitate/directoare/recenzii/mențiuni), ce a rămas (cu prioritate), ce NU se poate forța (notabilitate Wikipedia, recenzii reale — vin în timp) și care e următorul pas cu impact mare. Off-site-ul e o cursă de anduranță, nu un buton — fii onest cu termenele.
