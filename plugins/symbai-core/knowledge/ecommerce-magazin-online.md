# Magazin online & e-commerce

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul de magazin online acoperă vânzarea de produse pe site-ul propriu și pe marketplace-uri: catalogul cu variante și colecții, feed-urile de produse pentru Google/Facebook, codurile de reducere, comenzile online, retururile (RMA), antifrauda și integrările cu marketplace-uri (eMAG etc.). Partea de **livrare** a comenzilor (AWB cu curieri, dispecerat, abonamente) e detaliată în ghidul „Livrări și comenzi online"; **CONSTRUIREA propriu-zisă a site-ului public** (pagini, componente, ierarhie de categorii, filtre faceted, hero, footer, pagini legale, temă) e în ghidul **„website-builder.md"** + skill-ul `construieste-website`. Aici ne ocupăm de **catalog, marketing și comenzi**. Paginile apar doar dacă modulul de magazin online e activat.

## Concepte

- **Variantă de produs** — același produs în mărimi/culori/modele diferite (ex: tricou S/M/L), fiecare cu preț/stoc propriu.
- **Colecție** — grupare de produse pentru site (ex: „Noutăți", „Reduceri", „Cadouri").
- **Feed de produse** — un fișier export (Google Shopping, Facebook Catalog) cu produsele tale, ca să apară în reclame/căutări. Trebuie să aibă imagini, descrieri, prețuri valide.
- **Cod de reducere / voucher** — cod aplicabil la coș (procent, sumă fixă, transport gratuit, BOGO), cu condiții (minim comandă, dată, clienți țintă).
- **RMA (retur)** — cerere de returnare a unui produs: aprobare → primire → inspecție → rambursare/restock/rebut.
- **Antifraudă** — verificări pe comenzile suspecte (sumă mare, adresă nepotrivită) înainte de procesare.
- **Marketplace** — vânzare pe platforme externe (eMAG, Trendyol etc.) cu catalog/stoc/comenzi sincronizate.

## Pagini

- **Comenzi magazin** (`/ecommerce/orders`) — comenzile online: status, procesare, expediere.
- **Produse & Variante** (`/ecommerce/variants`), **Colecții** (`/ecommerce/collections`).
- **Feed-uri** (`/ecommerce/feeds`) — generare/preview feed-uri pentru Google/Facebook.
- **Coduri de reducere** (`/ecommerce/discount-codes`).
- **Retururi (RMA)** (`/ecommerce/returns`) — cereri, KPI (rată retur, total rambursat, top motive), politici.
- **Antifraudă** (`/ecommerce/fraud`), **Livrare** (`/ecommerce/shipping`), **AWB** (`/ecommerce/awb`).
- **Marketplace-uri** (`/ecommerce/marketplaces`) — vedere unificată eMAG/Trendyol/Amazon: dashboard, conturi, comenzi, mapare oferte, jurnal sincronizare.
- **Recenzii produse** (`/ecommerce/reviews`) — vezi ghidul „Recenzii & reputație".
- **Setări magazin** (`/ecommerce/settings`).

## Fluxuri pas-cu-pas

1. **Adaugi variante la un produs**: /ecommerce/variants → definești atributele (mărime/culoare) → preț/stoc per variantă. (Citire: `list_product_variants`.)
2. **Faci o colecție**: /ecommerce/collections → nume + produse incluse → o folosești pe site/în campanii. (Citire: `list_product_collections`.)
3. **Generezi un feed pentru Google/Facebook**: /ecommerce/feeds → alegi platforma → `preview_product_feed` (verifici că produsele au imagini/descrieri/preț) → `generate_product_feed` → publici. (Citire: `list_product_feeds`.)
4. **Creezi un cod de reducere**: /ecommerce/discount-codes → tip (procent/sumă/transport gratuit) + condiții (minim, dată, clienți). (Citire: `list_discount_codes`.) Pentru reducerile care chiar scad nota la POS/website, vezi și „Motorul de oferte" din ghidul de produse/meniu.
5. **Procesezi o comandă online**: /ecommerce/orders → confirmi → expediezi (AWB — vezi ghidul de livrări) → marchezi livrată. (Citire: `list_ecommerce_orders`, `get_ecommerce_order`.)
6. **Tratezi un retur (RMA)**: /ecommerce/returns → verifici eligibilitatea (`check_rma_eligibility`) → aprobi → primești produsul → inspectezi → rambursare + restock sau rebut. (Citire: `list_rma_requests`, `get_rma_details`, `get_rma_kpi_summary`.)
7. **Vinzi pe eMAG**: /ecommerce/marketplaces → conectezi contul → mapezi ofertele (produs Symbai ↔ ofertă eMAG) → comenzile vin în Symbai. (Citire: `get_emag_dashboard`, `list_emag_offers`, `list_emag_orders`.)
8. **Sugestii transport gratuit** (prag care crește coșul): `get_free_shipping_suggestions`.

## Tool-uri MCP utile

- Citire: `get_ecommerce_settings`, `list_ecommerce_orders`, `get_ecommerce_order`, `list_product_variants`, `list_product_collections`, `list_product_feeds`, `preview_product_feed`, `list_discount_codes`, `get_free_shipping_suggestions`, `list_rma_requests`, `get_rma_details`, `check_rma_eligibility`, `get_rma_kpi_summary`, `get_emag_dashboard`, `list_emag_offers`, `list_emag_orders`.
- Scriere: `generate_product_feed` (+ altele după modul). Permisiunea exactă: vezi `tools-mcp.md`.

## Întrebări frecvente

- **De ce nu-mi apare produsul în Google Shopping?** Feed invalid: lipsesc imagini/descrieri/preț. Rulează `preview_product_feed` ca să vezi ce reclamă.
- **Diferența între cod de reducere și ofertă?** Codul se aplică la coș când clientul îl introduce; „oferta" (motorul de oferte) reduce automat nota după reguli (happy hour, −X%, 1+1) — vezi ghidul de produse/meniu.
- **Ce fac cu un retur — restock sau rebut?** Depinde de starea produsului la inspecție; alegi în fluxul RMA.
- **Comenzile eMAG intră automat?** Da, după ce conectezi contul și mapezi ofertele.
- **Unde văd livrarea propriu-zisă (AWB, curieri)?** În ghidul „Livrări și comenzi online".

## Capcane

- **Variante vs produse simple** — un produs cu variante are stoc/preț per variantă; nu confunda stocul total cu cel pe variantă.
- **Feed greșit = bani aruncați pe reclame** — validează feed-ul (preview) înainte de a-l lega de Google/Facebook Ads.
- **Maparea ofertelor pe marketplace** — un produs Symbai trebuie legat corect de oferta de pe eMAG, altfel stocul/prețul nu se sincronizează.
- **Coduri de reducere sub cost** — atenție la marjă; verifică impactul înainte de a publica un cod agresiv.
- Livrarea (AWB/curieri/dispecerat) e modul separat — nu o căuta aici.
