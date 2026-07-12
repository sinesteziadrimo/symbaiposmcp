# Pagini care rankează în 2026 — cum faci o pagină foarte bună pentru SEO

> Metodologia de construire/optimizare a unei PAGINI ca să rankeze în Google ȘI să fie citată de AI. Pentru strategie generală vezi `seo-2026.md`; pentru magazin `ecommerce-magazin-online.md`; pentru descrieri de produs `descrieri-produse-seo.md`; pentru articole `scriere-articol-seo.md`. Aici e ce face o PAGINĂ (orice tip) să fie bună.

## Regula de aur: potrivirea cu intenția (înainte de orice)
**Citește SERP-ul real** pentru cuvântul-cheie țintă înainte să construiești pagina. Dacă top-10 e plin de:
- articole/ghiduri → ai nevoie de un **articol** (skill `scrie-articol-seo`), nu o pagină de produs;
- pagini de produs/magazin → ai nevoie de **PDP/PLP**;
- pachetul local (hartă) → ai nevoie de **Google Business Profile**, nu o pagină nouă;
- comparații „cele mai bune X" → ai nevoie de o pagină listă/comparație.

Dacă tipul paginii ≠ formatul dominant din SERP, **nu rankezi**, oricât de bună e pagina. O pagină = o intenție dominantă.

## Anatomia unei pagini care rankează (orice tip)
1. **Un singur H1**, descriptiv, cu cuvântul-cheie principal aproape de început. Unic în tot site-ul.
2. **Răspuns/valoare în primele ~100 de cuvinte** (pe mobil, deasupra pliului). Spune clar ce e și pentru cine.
3. **Titlu (title tag) ≤60 caractere** + **meta description 140-160** care invită la click (formulate diferit de H1).
4. **Structură scanabilă**: H2/H3 pe subîntrebări reale (din „People Also Ask"), liste, tabele, paragrafe scurte.
5. **Conținut extractabil de AI**: răspuns direct sus, definiții, tabele, statistici, un FAQ la final. AI-ul citează blocuri clare, nu pereți de text.
6. **Date structurate** potrivite tipului (vezi mai jos) — pentru rich results + claritate pentru mașini. NU sunt factor de ranking, dar ajută afișarea.
7. **Linkuri interne** descriptive: 2-3 către pagini înrudite (produse complementare, categoria părinte, ghiduri); ajută descoperirea + autoritatea tematică. Adâncime ≤3 click-uri de la home.
8. **Imagini** cu nume de fișier descriptiv + alt-text (front-load cuvinte-cheie), o singură imagine „erou" încărcată prioritar, restul lazy.
9. **Slug ASCII** scurt, descriptiv (ă→a, î→i, ș→s, ț→t).
10. **Viteză (Core Web Vitals)**: pagina trebuie să fie rapidă (LCP <2.5s, INP <200ms, CLS <0.1). Pe Symbai SSR-ul + imaginile WebP ajută automat; evită blocuri grele.

## Pe tip de pagină

### Pagina de PRODUS (PDP)
- Descriere UNICĂ orientată pe beneficii (NU copiată de la furnizor) — vezi `descrieri-produse-seo.md`.
- Titlu `[Nume produs] - [atribut/model] | [Brand]`; H1 = numele produsului.
- Schema Product + Offer (preț, disponibilitate, stare) — pe Symbai se generează automat la SSR. Din iulie 2026 Google recunoaște oficial și **categoria produsului** în aceste date — ține categoria corect setată pe fiecare produs.
- **Reducerile cer perioadă declarată**: Google validează prețul redus doar dacă oferta are dată de început/sfârșit; o reducere „permanentă", fără interval, poate fi ignorată în rezultatele de cumpărături. Definește promoțiile cu perioadă, nu tăind prețul pe termen nelimitat.
- Recenzii pe pagină (stele eligibile DOAR din recenzii reale de produs), FAQ, produse înrudite.
- **Tool-uri**: `bulk_optimize_product_seo` (descrieri+slug la scară), `set_product_seo` (titlu/meta/slug per produs), `audit_website_seo` (vezi golurile).

### Pagina de CATEGORIE (PLP)
- **Text intro** (50-150 cuvinte deasupra grilei) cu cuvântul-cheie: ce găsește clientul aici, de ce de la tine. Opțional text mai amplu sub grilă (200-400 cuvinte).
- Titlu + H1 pe numele categoriei (NU generic „Categorie — Magazin"); meta unic.
- Filtre: doar filtrele cu cerere reală să fie indexabile; restul noindex (evită explozia de URL-uri).
- **Tool**: `set_category_seo` (titlu, meta, slug, text intro/outro, noindex) — face pagina de categorie să rankeze, nu doar să listeze.

### Pagina de CONȚINUT / blog (articol)
- Vezi `scriere-articol-seo.md`. Pe scurt: intenție informațională, H1+intro cu promisiune, secțiuni pe întrebări PAA, experiență reală + foto proprii, FAQ, 2+ linkuri interne, schema Article. Tool: `scrie-articol-seo` + `generate_content_brief`.

### HOME / landing
- Schema Organization/LocalBusiness sitewide (nume, logo, sameAs, contact) — pe Symbai din `update_brand`/`update_company`. Mesaj clar + linkuri către categoriile/serviciile principale.

### Pagini LOCALE (multi-locație)
- O pagină unică per locație (NU șablon copiat): adresă, program, hartă, specific local. Schema LocalBusiness per locație. Vezi `local-seo-horeca.md`.

## Date structurate pe tip (ce se generează pe Symbai)
- Product+Offer pe PDP; CollectionPage+ItemList pe PLP; Organization/LocalBusiness sitewide; BreadcrumbList; Article pe blog. **NU** pune `aggregateRating` din recenzii proprii pe LocalBusiness/Organization (neeligibil + risc penalizare). Stelele de business vin din Google.

## Mituri de evitat (2026)
- `llms.txt` **NU** e o pârghie de citare AI — Google a confirmat OFICIAL (iunie 2026) că nu-l folosește. E doar documentație.
- Schema **NU** crește citările AI (studiile arată ~0 sau ușor negativ); folosește-o pentru rich results, nu pentru AI.
- **FAQ schema nu mai produce nimic în Google** — panourile FAQ au murit definitiv în 2026, suportul a fost retras complet. Conținutul Q&A rămâne valoros ca text vizibil (pentru cititor + AI), dar nu-l marca „pentru panou".
- **AMP e mort** — zero investiție.
- **După o schimbare de slug (cu redirect corect), Google re-evaluează LENT** — canonicalizarea durează; nu declara regresie în prima săptămână, verifică cu URL Inspection.
- A bloca GPTBot/Google-Extended (boți de ANTRENAMENT) NU te scoate din căutarea AI (aia folosește alți boți). Pe Symbai boții de căutare sunt permiși automat.
- Conținut AI în masă, cvasi-identic = „scaled content abuse" = risc. AI ca schiță + verificare umană = ok.

## Fluxul „fă o pagină foarte bună"
1. Cuvânt-cheie + **citește SERP-ul** (intenție + format) → `seo_keyword_research` / `seo_web_research`.
2. Alege tipul de pagină potrivit formatului dominant.
3. Construiește/optimizează cu tool-ul potrivit (PDP/PLP/articol/categorie).
4. **Auditează**: `audit_website_seo` (tot site-ul) sau `seo_audit` (un articol) → repară până e curat.
5. Cere feedback userului la decizii cu miză; fii onest despre ce ia timp (SEO nu e instant).
