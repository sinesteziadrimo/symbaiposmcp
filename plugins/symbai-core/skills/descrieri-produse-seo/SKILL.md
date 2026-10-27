---
name: descrieri-produse-seo
description: Scrie descrieri SEO unice pentru produsele din magazinul online (pe beneficii, română cu diacritice, anti-duplicat, pe verticală) și le salvează cu set_product_seo; slug-urile în masă cu bulk_optimize_product_seo (preview întâi). La „produsele n-au descriere", „scrie descrieri la tot magazinul", „pune slug-uri", „descrierile sunt copiate de la furnizor".
---

# Descrieri produse SEO la scară

Multe magazine au sute sau mii de produse **fără descriere** sau cu **descrieri copiate de la furnizor** (conținut duplicat = nu rankează și nu e citat de AI). Tu rezolvi asta: **scrii TU** descrieri **unice, orientate pe beneficii**, în română cu diacritice, le salvezi produs cu produs prin conexiune și pui slug-uri ASCII curate în masă, cu previzualizare. Generarea automată a descrierilor pe server nu mai există.

## Citește întâi
- `knowledge/descrieri-produse-seo.md` (rubrica de calitate + reguli anti-duplicat + ton per verticală), `knowledge/ecommerce-magazin-online.md` (PDP/PLP, magazin), `knowledge/seo-2026.md` (esențiale RO: diacritice în text, slug ASCII).

## Pasul 0 — vezi golul (recomandat)
Rulează `audit_website_seo` → îți spune câte produse sunt fără descriere, fără slug, cu descrieri subțiri/duplicate. Așa știi cât e de făcut și poți arăta progresul la final.

## Tool-urile tale
- **`bulk_optimize_product_seo({ brandId?, dryRun, limit?, categoryId? })`** — pune **doar slug-uri** SEO (`/produs/<slug>`) pe produsele active cu preț care nu au slug. Determinist, fără AI, fără cost. `dryRun: true` (implicit) = previzualizare cu numărătoare și exemple; `dryRun: false` = aplică. **Nu scrie descrieri.**
- **`set_product_seo({ menuItemId | productId, description?, slug?, seoTitle?, seoDescription?, indexable? })`** — salvezi descrierea, titlul și meta description ale unui produs. Slug-ul e transliterat ASCII și făcut unic automat.
- Citiri: `list_menu_items(menuId, categoryId)` și `get_product_details(productId)` — numele, atributele, descrierea actuală, gramajul.
- Categoriile: `bulk_optimize_category_seo` (slug-uri) și `set_category_seo` (titlu, meta, text intro/outro).

## Fluxul recomandat
1. **Vezi golul**: `audit_website_seo` + `list_menu_items` pe categoria țintă (produsele fără descriere sau cu text copiat).
2. **Scrie 3 exemple** din atributele reale ale produselor (fără specificații inventate) și arată-le userului. Cere OK pe stil și ton.
3. **Salvează în loturi mici**: câte un `set_product_seo` pe produs, categorie cu categorie; spune-i userului progresul (câte au rămas). Începe cu best-sellerii.
4. **Slug-uri**: `bulk_optimize_product_seo({ dryRun: true })` → arăți câte și exemplele → după acord `dryRun: false`.
5. **Reauditează** (`audit_website_seo`) și arată progresul.

## Reguli (rubrica pe scurt — detalii în knowledge)
- **Unic, nu șablon**: fiecare descriere specifică produsului (atributele lui). Niciodată text copiat de la furnizor sau identic între produse (Google penalizează „scaled/near-duplicate content").
- **Orientat pe beneficii**: deschidere cu cel mai mare beneficiu (cu cuvântul-cheie în prima propoziție), apoi caracteristică→beneficiu, apoi încredere/obiecție. Lungime per verticală (retail/jucării 150-300 cuvinte; produs de meniu 15-40).
- **Română CU diacritice în text, slug ASCII** (ă/â→a, î→i, ș→s, ț→t).
- **Acuratețe**: NU inventa cifre/specificații pe care produsul nu le are (greutăți, dimensiuni, certificări). Dacă o descriere existentă afirmă ceva fals, corectează cu `set_product_seo`.
- **Onest cu userul**: descrierile sunt punct de pornire bun; pentru produsele de vârf, o trecere umană le face și mai bune.

## Ce NU se poate prin conexiune (spune userului)
- Descrierile apar pe pagina produsului imediat; slug-urile noi pot intra în URL-uri cu o mică întârziere — nu promite schimbarea instantanee a adresei paginii.
- Editarea descrierilor produs-cu-produs din UI se face și din aplicație (Produse & Meniuri) — `set_product_seo` e pentru corecții rapide prin chat.
- Scrierile cer modulul **„Produse & Meniuri"** pe token; citirile/`audit_website_seo` merg oricum.
