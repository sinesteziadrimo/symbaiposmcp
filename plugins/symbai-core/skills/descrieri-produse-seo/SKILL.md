---
name: descrieri-produse-seo
description: Scrie descrieri SEO unice și slug-uri pentru produsele din magazinul online, la scară, prin conexiune (MCP) — descrieri orientate pe beneficii, în română cu diacritice, slug ASCII, anti-duplicat, adaptate verticalei (mâncare/retail/jucării/cosmetice). Folosește la „produsele n-au descriere", „scrie descrieri la tot magazinul", „optimizează descrierile produselor", „pune slug-uri la produse", „descrierile mele sunt copiate de la furnizor", „fă descrieri SEO la cele 4000 de produse", „îmbunătățește textele produselor". Acționezi ca un copywriter SEO de e-commerce care lucrează în loturi, cu preview și control.
---

# Descrieri produse SEO la scară

Multe magazine au sute sau mii de produse **fără descriere** sau cu **descrieri copiate de la furnizor** (conținut duplicat = nu rankează și nu e citat de AI). Tu rezolvi asta: generezi descrieri **unice, orientate pe beneficii**, în română cu diacritice, cu slug-uri ASCII curate — în **loturi**, cu **preview înainte** și control pe ce se aplică. Prin **conexiune (MCP)**.

## Citește întâi
- `knowledge/descrieri-produse-seo.md` (rubrica de calitate + reguli anti-duplicat + ton per verticală), `knowledge/ecommerce-magazin-online.md` (PDP/PLP, magazin), `knowledge/seo-2026.md` (esențiale RO: diacritice în text, slug ASCII).

## Pasul 0 — vezi golul (recomandat)
Rulează `audit_website_seo` → îți spune câte produse sunt fără descriere, fără slug, cu descrieri subțiri/duplicate. Așa știi cât e de făcut și poți arăta progresul la final.

## Tool-urile tale
- **`bulk_optimize_product_seo`** — calul de povară. Generează descrieri + slug-uri pe MULTE produse deodată.
  - `mode`: **`fill`** (implicit, sigur — doar produsele FĂRĂ descriere) · `enrich` (extinde descrierile subțiri) · `rewrite` (rescrie tot — atenție, poate suprascrie descrieri bune).
  - `dryRun=true` (implicit) = **PREVIEW**: îți spune câte produse ar fi optimizate + 3 exemple reale, FĂRĂ să salveze. `dryRun=false` = aplică pe primele `limit` produse.
  - `limit` (implicit 20, max 30 per apel), `categoryId` (limitează la o categorie), `tier` (standard implicit · heavy/premium pentru produse importante), `thinWords` (pragul de „subțire" la mode=enrich).
  - Aplică în **loturi**: rulează din nou cu `dryRun=false` ca să continui lotul următor; tool-ul îți spune câte au mai rămas.
- **`generate_product_description`** — PREVIEW pentru UN singur produs (vezi calitatea înainte). Nu salvează.
- **`set_product_seo`** — setezi manual descrierea și/sau slug-ul unui produs (corecții punctuale). Slug-ul e transliterat ASCII + făcut unic automat.

## Fluxul recomandat
1. **Preview**: `bulk_optimize_product_seo(mode="fill", dryRun=true)` → vezi numărul + 3 exemple. Arată-le userului.
2. **Confirmă cu userul** stilul/tonul pe exemple (e ireversibil la scară — cere OK). Dacă vrea altceva, ajustezi (ex. alt `tier`, sau întâi pe o `categoryId`).
3. **Aplică în loturi**: `bulk_optimize_product_seo(mode="fill", dryRun=false, limit=30)` — repetă până rămân 0. Pentru cataloage mari (mii de produse) spune userului că merge pe loturi și cât durează.
4. **Produse importante** (best-sellers, vârf de gamă): rulează cu `tier="premium"` pe `categoryId`-ul lor, sau editează manual deschiderea + propoziția de încredere (semnal E-E-A-T — vezi rubrica).
5. **Reauditează** (`audit_website_seo`) și arată progresul: câte produse au acum descriere + slug.

## Reguli (rubrica pe scurt — detalii în knowledge)
- **Unic, nu șablon**: fiecare descriere specifică produsului (atributele lui). Niciodată text copiat de la furnizor sau identic între produse (Google penalizează „scaled/near-duplicate content").
- **Orientat pe beneficii**: deschidere cu cel mai mare beneficiu (cu cuvântul-cheie în prima propoziție), apoi caracteristică→beneficiu, apoi încredere/obiecție. Lungime per verticală (retail/jucării 150-300 cuvinte; produs de meniu 15-40).
- **Română CU diacritice în text, slug ASCII** (ă/â→a, î→i, ș→s, ț→t).
- **Acuratețe**: NU inventa cifre/specificații pe care produsul nu le are (greutăți, dimensiuni, certificări). Generatorul respectă asta — dacă o descriere afirmă ceva fals, corectează cu `set_product_seo`.
- **Onest cu userul**: descrierile sunt punct de pornire bun; pentru produsele de vârf, o trecere umană le face și mai bune.

## Ce NU se poate prin conexiune (spune userului)
- Descrierile apar pe pagina produsului imediat; slug-urile noi pot intra în URL-uri cu o mică întârziere — nu promite schimbarea instantanee a adresei paginii.
- Editarea descrierilor produs-cu-produs din UI se face și din aplicație (Produse & Meniuri) — `set_product_seo` e pentru corecții rapide prin chat.
- Scrierile cer modulul **„Produse & Meniuri"** pe token; citirile/`audit_website_seo` merg oricum.
