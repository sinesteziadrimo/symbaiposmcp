# Onboarding 02d — Completarea datelor lipsă din surse externe (website, SmartMenu, marketplace)

> Cum cauți SINGUR informațiile care lipsesc dintr-un import — DOAR cu permisiunea userului. Orchestrarea: `02b-import-asistat.md`. Șabloanele canonice în care torni rezultatul: `02c-import-sabloane-canonice.md`. Folosit de skill-ul `importa-date`.

## Când intri pe surse externe

Userul are un fișier incomplet (lipsesc prețuri / descrieri / gramaje / alergeni / poze / categorii), SAU n-are deloc fișier dar **are un meniu undeva online**. Atunci, în loc să-l pui pe el să caute, cauți TU — dar întâi **ceri permisiunea explicit** și nu inventezi nimic.

**Protocolul de permisiune + siguranță (obligatoriu):**
1. Întreabă clar: „Vrei să intru pe website-ul/meniul vostru online și să iau de acolo ce lipsește (prețuri, descrieri, poze)? Da / Nu / Doar spune-mi unde."
2. Intri DOAR pe sursa indicată de user. Nu urmări linkuri terțe, reclame, alte site-uri.
3. **Nu inventa NIMIC** — nici preț, nici gramaj, nici alergen. Ce nu găsești rămâne gol și întrebi.
4. Arată userului CE ai găsit și DE UNDE înainte să folosești (sursă + valoare). La conflict între surse, el alege.
5. Validează pozele (URL public http/https, e imagine) înainte să le folosești cu `set_product_image`.

Rezultatul îl torni într-un **fișier canonic** (`02c`) pe care apoi îl imporți — sau completezi direct fișierul existent.

## Sursa 1 — SmartMenu (meniuri digitale RO)

SmartMenu servește meniul dintr-un Firebase public. Pattern:
- URL public al restaurantului: `{slug}.smart-menu.app` (sau o pagină care-l încarcă).
- API: `https://smart-menu-{PROJECT}.firebasedatabase.app/restaurant-menus/{slug}.json` — întoarce JSON cu `categories[{name, description}]` + `items[{name, price, description, weight_g, allergens[], imageUrl}]`.
- De regulă **fără cheie** (DB public la restaurante mici).

Pași: ceri userului URL-ul public → extragi `slug` → fetch JSON → mapezi `name/price/description/weight/allergens/imageUrl` în coloanele canonice (`name, price/menuPrice, description, weight, menuCategory` din structura `categories`). Pozele cu URL valid → le pui cu `set_product_image` după import. Dacă nu găsești proiectul/slug-ul, ceri userului linkul exact — nu ghici.

## Sursa 2 — Website propriu al restaurantului

- **HTML static** (meniul e în pagină): iei conținutul URL-ului și parsezi produsele + prețurile direct.
- **SPA** (React/Vue/Angular — HTML vine gol): meniul se încarcă din JavaScript. Caută **API-ul JSON din spate**: în sursa paginii / `<script>`-uri caută URL-uri de tip `/api/...`, `/graphql`, `/data/...`, `/menu...`; testează endpoint-uri comune (`/api/menu`, `/api/products`, `/api/categories`). Platformele de meniu au de regulă un endpoint JSON public (categorii → produse cu name/price/description/weight/allergens/imageUrl). Exemplu real cunoscut: SmartMenu = Firebase (vezi Sursa 1).
- Dacă HTML-ul e gol și nu găsești API-ul, ceri userului un export sau capturi — nu inventa conținutul.

(Skill-ul `adauga-produs-reteta` are aceeași logică de descoperire — refolosește-o.)

## Sursa 3 — Marketplace livrări (Glovo / Wolt / Tazz / Bolt Food / eMAG)

Marketplace-urile **NU se scrapează** (prețuri per-zonă, se schimbă des, fragil). În schimb:
- Cere userului să **exporte** meniul/catalogul din panoul lor de admin (CSV) și ți-l dă.
- Mapează exportul cu șabloanele canonice (importul recunoaște deja formate eMAG/Shopify/WooCommerce).
- De pe marketplace ia DOAR prețuri/nume — nu te baza pe descrieri/alergeni de acolo (nefiabile).

## Sursa 4 — PDF sau poze cu meniul

Există pagina dedicată din aplicație care extrage produse + prețuri + poze + design cu AI: `gaseste_in_aplicatie("import meniu din PDF")`. **Nu reimplementa OCR** — trimite acolo (sau folosește-o în mod automat prin Chrome), apoi verifici prin `list_menu_items`. Skill-ul `adauga-produs-reteta` acoperă și fluxul website→catalog.

## Merge din mai multe surse — potrivire + conflicte

Când aduni din 2+ surse (ex. fișier Excel + SmartMenu + website):
- **Fișierul userului = sursa de adevăr principală**; celelalte completează golurile.
- **Potrivire pe nume**, diacritice-insensitive + toleranță la typo (Coca-Cola ↔ Coca Cola).
- **Conflicte** (preț 100 vs 105, alergeni diferiți): NU decide singur — arată userului „SmartMenu zice 12 RON, website 12.50 — care?" și el alege.
- **Atribuire sursă**: ține minte de unde vine fiecare valoare (ca să poți explica și reveni). În raport: „prețurile din SmartMenu, descrierile de pe website, pozele de pe website".

## Descrieri lipsă — AI DA, alergeni/gramaj/preț — NU

- **Descrieri goale**: poți genera o descriere scurtă de vânzare din nume + tip + gramaj („Vodka 40ml" → „Shot de vodka, 40 ml, servit rece"). Template din date reale, NU invenție. Arată-i userului 2-3 exemple întâi: „Pun descrieri de genul ăsta unde lipsesc — ok, sau le sari?".
- **Alergeni, gramaj, preț**: **NU le inventa niciodată** cu AI. Vin doar din surse reale (API/website) sau le bifează/completează userul (alergenii UE din pagina Alergeni).

## După enrichment

Ai un fișier canonic complet → mergi pe fluxul din `02b` (pre-creează refs `02c` → importă → verifică). Spune-i userului ce-ai completat și din ce sursă, ce a rămas gol și de ce.
