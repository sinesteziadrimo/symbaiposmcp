# Onboarding 03 — Etichetele produselor (rutarea bonurilor către bucătărie/bar)

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Gramatica completă a tagurilor (cele 3 scopuri, toate tool-urile, capcanele) e în `../etichete-taguri.md`; workflow-ul general (în afara onboarding-ului) e în skill-ul `gestioneaza-etichete`.

## Scopul fazei

La finalul fazei, fiecare produs vandabil are cel puțin o **etichetă de secție** (ex. „Bucătărie", „Bar", „Grătar"). Rutarea bonurilor în Symbai este 100% pe etichete: produs → etichetă → imprimantă/ecran de bucătărie. **Un produs fără etichetă nu ajunge la nicio imprimantă și la niciun ecran** — comanda se ia la masă, dar bucătăria nu află de ea. Faza următoare (imprimante + ecrane de bucătărie) leagă etichetele create acum de dispozitive fizice; fără etichete, acea fază nu are ce lega.

Cu utilizatorul vorbește simplu: „etichetă", „ecran de bucătărie" (nu „KDS"), „imprimanta de bonuri" — zero jargon tehnic (tool, endpoint, tag routing).

## Permisiuni necesare pe token

- **`produse_meniu`** — pentru `create_tag`, `update_tag`, `assign_tag`, `bulk_assign_tag`, `bulk_remove_tag`, `auto_tag_from_menu_categories`.
- Citirile (`list_tags`, `list_tag_summary`, `list_untagged_products`, `list_menu_categories`, `search_products_db`, `search_products_for_tagging`...) sunt disponibile mereu, fără modul.

Fără modulul activat, scrierile întorc „permisiune insuficientă" — trimite utilizatorul în portalul Hub → Acces AI să bifeze „Produse & Meniuri" pe token, apoi reia.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citești automat (nu pune întrebări la care răspunde sistemul):**
1. `list_brands` → `brandId` (obligatoriu la `create_tag` și `auto_tag_from_menu_categories`; trimite-l la TOATE tool-urile care îl acceptă).
2. `list_tag_summary(brandId)` → ce etichete există deja + câte produse are fiecare. Dacă există deja etichete de secție cu asignări, NU le recrea — completezi golurile.
3. `list_menu_categories(brandId)` → structura REALĂ a meniului: categorii ierarhice cu path complet (format „Artizanala [Bar › Bere › Artizanala]") + numărul de produse per categorie. **Niciodată nu inventa ramuri** — orice filtru pe categorie pleacă de aici.
4. `list_untagged_products(brandId)` → produsele fără nicio etichetă. Cu `brandId` se limitează la produsele din meniurile brandului (cele vandabile, exact ce te interesează); fără `brandId` listează TOATE produsele active, inclusiv materii prime care nu au nevoie de etichetă — ai grijă să nu raportezi alarme false.
5. `search_products_for_tagging(brandId, filtre)` → **DRY-RUN: previzualizează exact ce produse ar primi un tag, FĂRĂ a asigna nimic** (există prin MCP). Întoarce numărul REAL de produse distincte + tagurile lor existente. E sursa corectă pentru „câte produse vor fi etichetate" — vezi capcana cu `productCount` mai jos.

**Întrebi utilizatorul (minimul):**
- Secțiile fizice: *„Ce posturi primesc comenzi la voi — bucătărie și bar? Mai există grătar, pizzerie, patiserie, cafenea? Fiecare are imprimanta sau ecranul lui?"* — răspunsul dă lista scurtă de etichete (de regulă 2–4).
- Cazurile ambigue, doar dacă structura meniului nu le face evidente: *„Deserturile le pregătește bucătăria sau au secție separată?"*, *„Cafeaua iese la bar?"*
- **Confirmare înainte de fiecare scriere în masă**: *„Aplic eticheta «Bar» pe toate produsele din ramura BAR (N produse). Confirmi?"* — N îl iei EXACT din `search_products_for_tagging` (dry-run), nu îl estima din `productCount`-ul lui `list_menu_categories` (acela numără articole de meniu și se dublează când un produs e în mai multe meniuri).

## Pașii de execuție — tool-urile MCP exacte

**Pas 0 — inventar.** Citirile de mai sus. Decide împreună cu utilizatorul lista de etichete de secție. Pentru rutare vrei PUȚINE etichete (una per post de lucru), nu una per categorie de meniu.

**Pas 1 — creează etichetele de secție** cu `create_tag` (obligatoriu: `name`, `brandId`):

```
create_tag(name: "Bucătărie", brandId: 1, color: "#ef4444")
create_tag(name: "Bar", brandId: 1, color: "#3b82f6")
```

- Idempotent: dacă există deja o etichetă cu același nume pe brand, întoarce eticheta existentă (cu ID), nu duplică.
- `entityTypes` are default `["product"]` — exact ce trebuie pentru rutare. Nu-l suprascrie fără motiv: o etichetă fără `"product"` în `entityTypes` e invizibilă pentru rutare.
- **Reține ID-ul** din răspuns — îl folosești la asignare.

**Pas 2 — dry-run, apoi asignează în masă.** ÎNTÂI `search_products_for_tagging` cu EXACT filtrele pe care le vei folosi → confirmă numărul real + 2–3 exemple cu utilizatorul. ABIA APOI `bulk_assign_tag` (obligatoriu: `tagId`; trimite mereu și `brandId`) cu aceleași filtre. Filtrele se combină cu AND:

| Filtru | Comportament |
|---|---|
| `categoryName: "Bucatarie"` | match parțial, fără diacritice, + **subtree rollup automat** (prinde toată ramura, inclusiv subcategoriile) |
| `categoryNames: ["Pizza", "Paste"]` | mai multe categorii (OR), fiecare cu subtree rollup |
| `categoryPath: "Bar > Bere > Fara Alcool"` | ramură EXACTĂ — obligatoriu când același nume există sub părinți diferiți |
| `categoryPaths: [...]` | mai multe path-uri (OR), cu rollup |
| `menuCategoryId` / `menuCategoryIds` | ID exact, **FĂRĂ subtree** — escape hatch intenționat |
| `vatRate: 21` | după cota TVA (în România: 0 / 11 / 21) |
| `nameContains`, `priceMin/priceMax`, `productType`, `menuId/menuName`, `locationId`, `warehouseId`, `supplierId`, `hasTag`/`notHasTag` | alte filtre utile |
| `entityIds: [101, 102]` | listă explicită de ID-uri, se ADAUGĂ la rezultatele filtrelor |

```
bulk_assign_tag(tagId: 15, brandId: 1, categoryNames: ["Pizza", "Paste", "Ciorbe"])
bulk_assign_tag(tagId: 12, brandId: 1, categoryPath: "Bar > Cocktails > Fara Alcool")
```

- Răspunsul: `{ assigned: N, skipped: N, total: N }` — `skipped` = aveau deja eticheta (idempotent, poți re-rula fără grijă).
- 0 produse găsite → eroare cu filtrele afișate; verifică ortografia categoriei cu `list_menu_categories` (nu presupune — întreabă utilizatorul „vrei să zici X sau Y?" cu opțiuni reale din meniu).
- Greșit aplicat? `bulk_remove_tag(tagId, ...aceleași filtre)` — anulează curat DOAR dacă `skipped` a fost 0 la asignare. Dacă `skipped > 0`, acele produse aveau eticheta DINAINTE — remove cu aceleași filtre le-o scoate și lor; restrânge atunci filtrele sau folosește `entityIds`.

**Pas 3 — produsele rămase.** `list_untagged_products(brandId)` → pentru ce a rămas: alt `bulk_assign_tag` cu `nameContains` sau `entityIds`, ori `assign_tag(tagId, entityId)` pentru cazuri individuale (max ~3 produse — peste, folosește bulk).

**Pas 4 (opțional) — auto-etichetare din categorii**: `auto_tag_from_menu_categories(brandId, menuId?, color?)` creează câte o etichetă pentru FIECARE categorie de meniu cu produse și asignează automat. Idempotent (refolosește etichete cu același nume, sare asignările existente). Util când categoriile de meniu coincid cu secțiile sau pentru filtre de rapoarte — dar pe un meniu cu 30 de categorii produce 30 de etichete, ceea ce NU e ce vrei pentru rutare. Pentru rutare, rămâi la Pașii 1–3.

**După fiecare scriere, confirmă printr-o CITIRE** (`list_tag_summary`, `search_products_db(tagNames:[...])`), nu prin interfață: UI-ul are cache în browser și arată datele noi abia după refresh. Nu repeta scrierea, nu raporta bug. **Pentru spot-check pe produse folosește `search_products_db`, NU `get_product_details`** — acesta din urmă întoarce un vector de embedding uriaș care umple contextul degeaba.

## Ce se face DOAR din aplicație

- **Legarea etichetă → imprimantă / ecran de bucătărie** (rutarea propriu-zisă) — nu există tool MCP pentru regulile de rutare. Se face în faza următoare de onboarding (imprimante + ecrane) sau direct în aplicație: cheamă `gaseste_in_aplicatie(intrebare: "rutare etichete către imprimante și ecrane bucătărie")` și dă utilizatorului linkul. Verificare după: nu poți citi regulile prin tool-urile standard — dacă tokenul are SQL read-only, găsește tabelele de reguli de rutare cu `list_database_tables` (caută după „routing") și interoghează-le; altfel cere utilizatorului un test real (o comandă de probă care iese la imprimanta corectă).
- **Ștergerea unei etichete** — `delete_tag` NU e expus prin MCP (politica: fără ștergeri de entități întregi). Ghidează utilizatorul: `gaseste_in_aplicatie(intrebare: "pagina de etichete produse")`. Dacă scopul e doar „scoate eticheta de pe produse", NU e nevoie de ștergere — `bulk_remove_tag` rezolvă prin conexiune. Verifică după ce userul termină: `list_tags(brandId)`.
- **Atribuirea vizuală** (tabel/wizard de bifat produse) — pagina de etichete din aplicație; alternativă pentru utilizatorii care preferă să vadă lista. Verifici apoi cu `list_tag_summary(brandId)`.

## Echivalentul în wizard-ul din aplicație

Pasul **6** din `/onboarding` — „Etichete (Tags)" (panou explicativ + chat cu agentul „Sym Tag Master" + listă live de etichete). Etichetele create prin conexiunea ta apar acolo și în pagina de etichete a aplicației (după refresh), dar **progresul wizard-ului NU se bifează prin conexiune** — dacă utilizatorul folosește și wizard-ul, apasă singur „Următorul pas". Rutarea propriu-zisă apare la pasul 8 din wizard (imprimante + ecrane).

## Verificare la final

- [ ] `list_tag_summary(brandId)` — fiecare etichetă de secție există, are >0 produse, fără dubluri accidentale de nume („Bar" vs „bar" — creează dubluri doar la diferențe de scriere; semnalează-le).
- [ ] `list_untagged_products(brandId)` — gol, sau conține doar produse care intenționat nu se trimit nicăieri (confirmate cu utilizatorul).
- [ ] `search_products_db(tagNames: ["bar"])` pe fiecare secție → produsele-mostră au eticheta corectă (preferă asta în loc de `get_product_details`, care întoarce un embedding uriaș).
- [ ] `search_products_db(tagNames: ["bar"], limit: 10)` — spot-check: eticheta întoarce produsele așteptate.
- [ ] Utilizatorul știe că urmează legarea etichetelor de imprimante/ecrane (faza următoare) — etichetele singure nu tipăresc nimic încă.

## Capcane

- **`search_products_for_tagging` EXISTĂ prin MCP** (dry-run) — folosește-l înainte de orice scriere în masă ca să vezi numărul real de produse. (Doar `delete_tag` lipsește prin MCP — ștergerea tagului gol se face din aplicație.)
- **`list_menu_categories.productCount` over-numără** — numără articole de meniu, deci un produs aflat în 2 meniuri e numărat de 2 ori. Numărul REAL de produse distincte care vor fi etichetate îl dă `search_products_for_tagging`, nu suma category counts (exemplu: o ramură care arată 36 după category counts poate avea doar 31 de produse distincte).
- **`get_product_details` umple contextul** — întoarce un vector de embedding cu sute de numere. Pentru verificarea tagurilor folosește `search_products_db(tagNames:[...])` (câmp `tags` curat).
- **`categoryPath` acceptă `›`, `>` sau `/`** — poți lipi direct path-ul exact cum îl întoarce `list_menu_categories` (ex. `BAR › BERE › ARTIZANALA`).
- **`assign_tag` (single) nu e garantat idempotent** (poate crea un rând de asignare la fiecare apel); `bulk_assign_tag` ESTE idempotent (`skipped`). Peste 1–2 produse, preferă `bulk_assign_tag`.
- **`brandId` poate fi `null` pe taguri vechi** (din import / `auto_tag_from_menu_categories`); `create_tag` îl setează corect. `list_tags(brandId)` le include oricum.
- **`list_menu_categories` întoarce N CATEGORII, nu N produse.** „5 categorii găsite" ≠ „5 produse" — folosește numărul de produse per categorie din răspuns pentru estimări.
- **Produsele sunt asignate pe categorii frunză, nu pe părinți** — de-asta există subtree rollup. Filtrul pe „BAR" prinde automat toată ramura; nu procesa manual sub-ramurile.
- **Nume de categorie duplicate sub părinți diferiți** (ex. „FARA ALCOOL" și sub Bere, și sub Cocktails) → `categoryName` le prinde pe AMBELE. Folosește `categoryPath` pentru dezambiguizare.
- **`categoryName` face match parțial** — „bar" prinde „BAR", dar poate prinde și alte categorii care conțin textul. La nume scurte/ambigue, preferă `categoryPath`.
- **`bulk_assign_tag(tagId, brandId)` fără alt filtru etichetează TOATE produsele din meniurile brandului** — brandId singur e un filtru valid. Folosit intenționat e o unealtă („pune «Meniu» pe tot"); accidental e dezastru pe sute de produse. Confirmă scope-ul cu utilizatorul înainte. (Doar `tagId` singur, fără niciun filtru, NU face nimic — întoarce 0 găsite.)
- **Produsele sunt globale pe firmă, nu per brand/locație** — eticheta pusă pe un produs îl urmează în toate locațiile. La clienți multi-locație, izolarea se face la regulile de rutare (per locație, în aplicație), nu la etichete; o etichetă „de barul X" pe produse vândute și în localul Y poate ruta bonuri la alt local dacă regula nu e limitată pe locație. Semnalează asta când configurezi multi-locație.
- **Datele apar în UI abia după refresh** — confirmă scrierile prin citiri MCP, nu cere utilizatorului să se uite imediat în browser.
- **TVA România: 0% / 11% / 21%** — dacă folosești filtrul `vatRate`, NU folosi cotele vechi 5/9/19 (exemplele istorice din sistem le mai menționează).
