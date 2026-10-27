# Local SEO pentru HoReCa (restaurante & hoteluri) în 2026

> Continuă din `seo-2026.md`. Pentru un business local, ASTA e cea mai mare pârghie — mai mare decât blogul. Pentru partea AI vezi `geo-aeo.md`.

## Pe scurt

Pentru un restaurant/hotel, descoperirea se întâmplă în **Local Pack-ul Google** (harta cu 3 rezultate) și tot mai mult în **răspunsurile AI** — ambele alimentate masiv de **Google Business Profile (GBP)** și de **recenzii**. Google ordonează local după trei factori: **Relevanță, Distanță, Prominență**. Categoria principală corectă din GBP e cel mai puternic semnal individual. NAP consistent + recenzii (volum, viteză, răspuns) + landing pages per oraș/cartier completează tabloul. În 2026 GBP recompensează **activitatea** (postări, foto noi, răspuns la recenzii), nu doar prezența.

## Google Business Profile — canalul #1

Completează și ține ACTIV fiecare câmp:
- **Categorie principală exactă** (+ categorii secundare) — semnalul individual cel mai puternic. Alegerea greșită te scoate din Local Pack.
- **NAP complet** (Nume/Adresă/Telefon) — identic cu site-ul și directoarele.
- **Program** cu sărbători (Paște, Crăciun, 1 Mai) — actualizează-l.
- **Atribute** (parcare, terasă, family-friendly, mic dejun, accesibilitate, rezervări, plată card).
- **Meniu cu prețuri** + linkuri de rezervare/comandă.
- **20+ foto reale, geotag-uite**, reîmprospătate.
- **Postări (Google Posts)** — expiră după 7 zile, deci postează regulat (oferte, evenimente, preparate noi).
- **Q&A** — pune și răspunde singur la 3-5 întrebări reale de dinainte de vizită.
- **Răspunde la FIECARE recenzie**, repede.

În Symbai: pagina **`/gbp`** (compui postări, răspunzi la recenzii cu sugestie AI, Q&A, metrice). Pentru a programa postări GBP recurente, vezi modulul de marketing. Folosește `update_brand`/`update_company` ca să ții NAP-ul canonic la sursă (de aici se propagă pe site + schema).

## Recenzii — factor de ranking ȘI de conversie

- Cere recenzii sistematic (după comandă/sejur) — Symbai are invitații de recenzie (skill `raspunde-recenzii`, pagina `/ecommerce/external-reviews`, `sync_retail_reviews`).
- **Răspunde la toate** (pozitive și negative) — semnal de Trust + influențează AI.
- Recenziile pe **platformele care rankează singure** (TripAdvisor, Google, Booking, aplicațiile de livrare) sunt cele mai valoroase „citații" — sunt și citite de AI.

## NAP & citații în România

- **NAP identic** peste tot — alege UN format canonic de adresă (cu sector/județ) și refolosește-l.
- Ecosistemul RO de directoare e mai subțire ca US/UK → **calitate > cantitate**. Prioritar: GBP (ancora), **paginiaurii.ro**, **firme.info / listafirme**, **Business Catalog România**, **Apple Business Connect** (Apple Maps), **Bing Places**, **TripAdvisor**, + platformele de rezervare/livrare.
- Volumul de citații e un semnal slab în 2026 — valoarea reală e **consistența NAP** (Trust + hrană pentru AI), nu numărul.

## Platformele de livrare & recenzii (revendică-le)

- Trio-ul RO de livrare în 2026: **Glovo, Bolt Food, Wolt** (Tazz a fost preluat de Wolt în ianuarie 2025 și e retras — spune „Wolt (fost Tazz)", nu doar „Tazz").
- Aceste platforme + TripAdvisor/Booking deseori rankează peste site-ul propriu pentru căutări de brand/descoperire și sunt **surse primare pentru AI**. Optimizează fiecare listing (foto, meniu complet, tag-uri bucătărie, program exact) și păstrează **paritate** meniu/preț/program între POS, site (schema), GBP și aplicațiile de livrare — o singură poveste consistentă.
- Contrabalansează comisionul (~25-45%) ducând clienții repetitivi pe canale proprii (comandă pe site, loialitate, email/SMS).

## Landing pages locale (per oraș/cartier)

- Pentru fiecare locație/zonă deservită, o pagină dedicată cu NAP, hartă, program, specific, foto reale, recenzii și conținut local util — NU pagini cvasi-identice generate în masă (risc „scaled content abuse").
- Țintește long-tail local: „restaurant cu grădină [cartier]", „cazare lângă [reper]", „[bucătărie] în [oraș]".
- Pentru lanțuri multi-locație: o pagină per locație + NAP propriu per locație în GBP.

## Date structurate locale (JSON-LD)

- Folosește tipul cel mai specific: **`Restaurant`** (LocalBusiness > FoodEstablishment) sau **`Hotel`** (LodgingBusiness) cu: `name`, `address` (PostalAddress), `telephone`, `url`, `geo` (GeoCoordinates — des omis, valoros pentru AI/potrivire locație), `openingHoursSpecification`, `servesCuisine`, `priceRange`, `acceptsReservations`, `hasMenu`, `sameAs`. Pentru restaurant adaugă `Menu` > `MenuSection` > `MenuItem` > `Offer` (`priceCurrency` RON).
- ⚠️ **NICIODATĂ `aggregateRating`/`Review` din recenziile PROPRII** ale businessului — Google le consideră „self-serving", pagina devine **neeligibilă** pentru stelele din rezultate și riști **penalizare manuală**. Stelele pentru businessul tău vin din sistemele Google, nu din markup-ul tău.
- Symbai generează entitatea + Menu schema din datele live (program, prețuri, 86-uri) — vezi `geo-aeo.md` pentru entitate/`sameAs`.

## Conformitate (consimțământ) — risc legal real în RO

- **Consent Mode v2** obligatoriu pentru trafic EEA din martie 2024; ANSPDCP amendează DEJA bannere neconforme. Banner corect: Accept/Refuz egale, fără categorii pre-bifate, retragere ușoară, fără „cookie wall", GA4/Pixel pornesc DOAR după accept. La audit, semnalează clientului dacă GA4 pornește înainte de consimțământ. Pentru analytics fără fricțiune: variante privacy-first (Plausible/Matomo cookieless).

## Tool-uri MCP utile

- `get_seo_overview` / `get_search_performance` — vizibilitate și trafic local din Search Console.
- Research web făcut de tine + `list_seo_competitors` / `gbp_rank_summary` — cum apar concurenții locali în SERP/hartă/AI.
- `update_brand` / `update_company` — NAP + identitate canonice (sursa entității/schema).
- `gaseste_in_aplicatie("Google Business Profile")` → `/gbp`; skill `raspunde-recenzii` pentru recenzii.

## Capcane

- **GBP gol/abandonat** = pierzi Local Pack-ul ȘI majoritatea răspunsurilor AI locale.
- **Categorie principală greșită** = invizibil pe căutările care contează.
- **NAP inconsistent** = Google și AI nu te recunosc ca o entitate.
- **`aggregateRating` din recenzii proprii** = penalizare. Lasă stelele să vină din Google.
- **Pagini locale duplicate în masă** = „scaled content abuse". Fă-le reale, cu conținut local propriu.
