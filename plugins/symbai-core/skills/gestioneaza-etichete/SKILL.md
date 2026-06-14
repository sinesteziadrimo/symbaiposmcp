---
name: gestioneaza-etichete
description: Gestionează etichetele (tagurile) produselor în Symbai — creare, asignare în masă pe secții/categorii, etichete de rutare către imprimante/KDS, etichete de marketing/atribute (Recomandat, Vegan, Picant, Nou), audit și curățenie. Folosește la „pune tag pe produse", „fă o etichetă nouă", „rutează la bucătărie/bar", „etichetează tot barul", „taguri pentru imprimante/KDS", „ce produse n-au etichetă", „scoate tagul de pe X", „grupează produsele pe secții", „marchează produsele vegane/picante/recomandate".
---

# Gestionează etichete (taguri) — corect, sigur, vizibil

Citește întâi `knowledge/etichete-taguri.md` (cele 3 scopuri ale tagurilor, tool-urile, capcanele) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`. Pentru rutare în onboarding: `knowledge/onboarding/03-etichete-rutare.md`; pentru legarea tag→imprimantă/ecran: `knowledge/echipamente-kds-imprimante.md`.

Toate scrierile cer modulul **`produse_meniu`** pe token; lipsă → „permisiune insuficientă" (activare din portal Hub → Acces AI). Citirile merg mereu.

## Regula de aur

**Niciodată nu scrii în masă fără dry-run.** Înainte de orice `bulk_assign_tag`, rulează `search_products_for_tagging` cu EXACT aceleași filtre, arată utilizatorului numărul real de produse + 2–3 exemple, cere OK. Numărul real vine din dry-run, NU din `productCount`-ul lui `list_menu_categories` (acela numără articole de meniu și se dublează când un produs e în 2 meniuri).

## Inventarul de pornire (citește înainte să întrebi)

1. `list_brands` → `brandId` (obligatoriu la `create_tag`; trimite-l peste tot unde e acceptat). La multi-brand, dacă cererea nu spune care → întreabă o dată.
2. `list_tag_summary(brandId)` → ce etichete există + câte produse au. **Refolosește etichetele existente** (același nume, nu variante noi) — au deja reguli de rutare în spate. NU recrea „BAR" dacă există „BAR DRUNKEN".
3. `list_menu_categories(brandId)` → structura REALĂ (ierarhică, cu path complet). Orice filtru pe categorie pleacă de aici — nu inventa ramuri.
4. `list_untagged_products(brandId)` → ce a rămas neetichetat.

## Rețeta 1 — Etichete de rutare la secții (Bar / Bucătărie / Grătar)

Scopul: fiecare produs vandabil are o etichetă de secție, ca bonul să ajungă la imprimanta/ecranul corect.

1. **Întreabă scurt posturile fizice**: „Ce posturi primesc comenzi — bucătărie și bar? Mai e grătar, pizzerie, patiserie? Fiecare cu imprimanta/ecranul lui?" → lista scurtă de etichete (2–4).
2. **Creează etichetele** lipsă cu `create_tag(name, brandId, color)` (idempotent pe nume+brand; reține id-ul). Culori sugestive: roșu bucătărie, albastru bar.
3. **Dry-run** per secție: `search_products_for_tagging(brandId, categoryName:"BAR")` (subtree rollup prinde toată ramura). Confirmă numărul cu utilizatorul.
4. **Asignează**: `bulk_assign_tag(tagId, brandId, categoryName:"BAR")` (sau `categoryNames` / `categoryPath` pentru ramuri exacte). Răspuns `{assigned, skipped, total}`.
5. **Rămășițe**: `list_untagged_products(brandId)` → `bulk_assign_tag` cu `nameContains`/`entityIds`, sau `assign_tag` pentru 1–2 cazuri.
6. **⚠ Tag NOU = bonuri pierdute.** Un tag de secție nou NU rutează nicăieri până nu există regula tag→imprimantă/KDS — produsele lui generează bonuri „unrouted" fără eroare. Regula NU se face prin MCP. Spune-i utilizatorului EXACT ce tag și unde trebuie să iasă, du-l în pagină (`gaseste_in_aplicatie("rutare etichete imprimante KDS")`) și cere un bon de test. Etichetele puse pe etichete deja-rutate (refolosite) merg imediat.

## Rețeta 2 — Etichete de marketing / atribute

Pentru filtre de meniu/portal/campanii: „Recomandat", „Nou", „Vegan", „Picant", „Happy Hour".

1. `create_tag(name, brandId, color, description)`. Aici poți avea oricâte — nu afectează rutarea.
2. Asignează țintit: rar pe categorie (un atribut e per produs), de obicei cu `nameContains` sau `entityIds` (lista de produse confirmată cu utilizatorul). Dry-run întâi.
3. Atributele nu rutează bonuri — nu te complica cu reguli de imprimantă.

## Rețeta 3 — Audit și curățenie

1. `list_tag_summary(brandId)` → vezi dubluri de nume („Bar" vs „bar" vs „BAR DRUNKEN"), taguri goale (0 asignări), taguri cu `brand_id` null.
2. `list_untagged_products(brandId)` → produse fără rutare (= bonuri care nu ies). Etichetează-le sau confirmă cu utilizatorul că intenționat nu se trimit nicăieri.
3. **Scoate o etichetă greșită**: `bulk_remove_tag(tagId, ...aceleași filtre)` sau `bulk_remove_tag(tagId, entityIds:[...])`. (Pentru „scoate tagul de pe produse" NU e nevoie de ștergerea tagului.)
4. **Ștergerea tagului gol** se face DOAR din aplicație — `gaseste_in_aplicatie("pagina de etichete produse")`, dă-i link-ul.
5. **Redenumire / reculoare**: `update_tag(tagId, name?, color?, description?)` — singura cale (NU `create_tag`, care nu suprascrie).

## Arată-i utilizatorului ce faci (extensia Chrome)

Clientul nu vede codul — vede aplicația. Dacă extensia Chrome e conectată, DESCHIDE pagina de etichete ca să vadă rezultatul:
1. `gaseste_in_aplicatie("pagina de etichete produse")` → ruta (de regulă `/ai-tags`).
2. `navigate(<link>)` în tab-ul sesiunii (creează-l cu `tabs_context_mcp{createIfEmpty:true}` o singură dată).
3. După o scriere, re-`navigate` (refresh) și confirmă vizual cu `find("eticheta X")` — datele apar în UI doar după refresh.
Fără extensie → dă-i link-ul și spune-i ce să vadă.

## Verifică prin CITIRE (nu prin UI, nu cu get_product_details)

După orice scriere:
- `list_tag_summary(brandId)` → eticheta există, are numărul de produse așteptat, fără dubluri.
- `search_products_db(tagNames:["bar"])` → spot-check că tagul întoarce produsele corecte. **Folosește asta, NU `get_product_details`** — `get_product_details` întoarce un vector de embedding uriaș care umple contextul degeaba.
- `list_untagged_products(brandId)` → gol (sau doar ce intenționat nu se rutează).
Interfața se actualizează abia după refresh — succes la tool = salvat, nu repeta scrierea.

## Capcane (rezumat — detalii în `knowledge/etichete-taguri.md`)

- Numărul real de produse = dry-run, nu category counts (un produs în 2 meniuri se numără dublu).
- `categoryName` face match parțial + subtree → prinde toată ramura ȘI nume duplicate sub părinți diferiți; dezambiguizează cu `categoryPath` (acceptă `›`, `>`, `/` — lipește path-ul din `list_menu_categories`).
- `bulk_assign_tag(tagId, brandId)` fără alt filtru = TOATE produsele brandului. Confirmă scope-ul.
- `create_tag` re-creat = întoarce tagul vechi, ignoră noii parametri (folosește `update_tag`).
- `assign_tag` single nu e garantat idempotent; preferă `bulk_assign_tag` (idempotent + reversibil) peste 1–2 produse.
- Tag nou de rutare fără regula tag→imprimantă = bonuri „unrouted" fără eroare.
- Dacă tot dai de un perete (ceva ce userul poate face în aplicație dar tu nu prin conexiune), raportează cu `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`).
