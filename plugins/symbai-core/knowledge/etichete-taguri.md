# Etichete (taguri) — rutare bonuri, atribute de meniu, grupări

> Gramatica completă a etichetelor (tagurilor) în Symbai: ce sunt, la ce folosesc, ce tool-uri MCP le ating și capcanele confirmate pe instanțe reale. Workflow-ul pas-cu-pas (rețete) e în skill-ul `gestioneaza-etichete`. Pentru rutarea în onboarding vezi și `onboarding/03-etichete-rutare.md`; pentru imprimante/ecrane `echipamente-kds-imprimante.md`.

O **etichetă** (tag) e o grupare reutilizabilă atașată produselor (și, mai rar, altor entități). Un produs poate avea oricâte etichete. Tagurile sunt **globale pe firmă**, nu per locație — eticheta pusă pe un produs îl urmează în toate meniurile și locațiile.

## Cele 3 scopuri ale tagurilor — nu le amesteca

1. **Rutarea bonurilor către secții** (cel mai important). Comanda luată la masă ajunge la imprimanta/ecranul de bucătărie potrivit DOAR pe baza etichetei: produs → etichetă de secție („Bar", „Bucătărie", „Grătar", „Pizza") → regula tag→imprimantă/KDS. Pentru rutare vrei **puține** etichete (una per post de lucru: 2–4 de obicei), NU una per categorie de meniu.
2. **Atribute / marketing** — etichete care descriu produsul pentru filtrare în meniu, portal online sau campanii: „Recomandat", „Nou", „Vegan", „Picant", „Happy Hour", „Specialitatea casei". Aici poți avea oricâte, nu afectează rutarea.
3. **Grupări pentru rapoarte / filtre** — folosești o etichetă ca să filtrezi rapoarte sau căutări (`search_products_db(tagNames:[...])`, filtrul `tag` din `auto_assign_vat_batch`).

**Alergenii NU sunt taguri.** Datele legale de alergeni se setează cu `set_product_allergens` (+ `create_allergen`) și se moștenesc din ingredientele rețetei — vezi `produse-meniu-retete.md`. Pagina aplicației se numește „Etichete & Alergeni" și agentul ei AI poate PROPUNE și etichete derivate din alergeni, dar sursa de adevăr pentru alergeni rămâne evidența de alergeni a produsului, nu etichetele.

## Tool-urile MCP (toate testate live)

Toate scrierile cer modulul **`produse_meniu`** („Produse & Meniuri") bifat pe token (portal Hub → Acces AI); altfel întorc „permisiune insuficientă". Citirile merg mereu.

**Citire / previzualizare:**
- `list_tags(brandId?, entityType?)` — toate etichetele (id, nume, culoare, entityTypes, brandId, descriere).
- `list_tag_summary(brandId?)` — etichetele + câte produse are fiecare. Prima citire înainte de a crea (refolosește ce există).
- `list_untagged_products(brandId?, warehouseId?)` — produse active fără nicio etichetă. Cu `brandId` = doar vandabilele din meniurile brandului; fără `brandId` = TOATE produsele active (inclusiv materii prime care nu au nevoie de etichetă — nu da alarme false).
- `search_products_for_tagging(filtre...)` — **DRY-RUN: previzualizează exact ce produse ar fi afectate de un set de filtre, FĂRĂ a asigna nimic.** Există prin MCP și e prima ta apărare împotriva greșelilor în masă. Întoarce numărul REAL de produse distincte + tagurile lor existente. Rulează-l ÎNTOTDEAUNA cu aceleași filtre înainte de `bulk_assign_tag`.

**Scriere:**
- `create_tag(name, brandId, color?, description?, entityTypes?)` — `entityTypes` default `["product"]` (exact ce trebuie pentru rutare). Întoarce id-ul.
- `update_tag(tagId, name?, color?, description?)` — singura cale de a schimba culoarea/descrierea unui tag existent.
- `assign_tag(tagId, entityId, entityType?)` — asignează la UN produs.
- `bulk_assign_tag(tagId, ...filtre)` — asignează la toate produsele care trec filtrele (AND între ele).
- `bulk_remove_tag(tagId, ...filtre)` — scoate eticheta; aceleași filtre ca `bulk_assign_tag`.
- `auto_tag_from_menu_categories(brandId, menuId?, color?)` — creează câte o etichetă per categorie de meniu cu produse și o asignează. Util când categoriile = secțiile, sau pentru filtre de raport; pe un meniu cu 30 de categorii face 30 de etichete — NU pentru rutare.

## Reguli de aur (disciplina corectă)

1. **Dry-run întâi, scriere după.** `search_products_for_tagging(aceleași filtre)` → confirmi numărul și produsele → abia apoi `bulk_assign_tag`. Numerele se confirmă cu utilizatorul înainte de orice scriere în masă.
2. **Numărul REAL vine din dry-run, NU din `list_menu_categories`.** `list_menu_categories` întoarce `productCount` care numără **articole de meniu** — un produs aflat în 2 meniuri e numărat de 2 ori. Exemplu tipic: o ramură „BERE" poate însuma 36 după numărătoarea pe categorii, dar dry-run-ul să găsească doar 31 de produse distincte. Pentru „câte produse primesc tagul" folosește dry-run-ul.
3. **Verifică prin `search_products_db(tagNames:[...])`, NU prin `get_product_details`.** `get_product_details` întoarce un vector de embedding URIAȘ (sute de numere) care umple contextul degeaba; `search_products_db` întoarce un câmp `tags` curat. `tagNames` cere TOATE tagurile din listă (AND), case-insensitive.
4. **Subtree rollup automat.** `categoryName` / `categoryNames` / `categoryPath` prind TOATĂ ramura, inclusiv subcategoriile (produsele stau pe categorii-frunză, nu pe părinți). Filtru pe „BAR" → toată ramura Bar (Bere, Cocktails, Spirits...). `menuCategoryId` / `menuCategoryIds` = ID exact FĂRĂ subtree (escape hatch intenționat).
5. **`categoryPath` acceptă `›`, `>` sau `/`** — poți **lipi direct** path-ul exact cum îl întoarce `list_menu_categories` (ex. `BAR › BERE › ARTIZANALA`). Obligatoriu când același nume există sub părinți diferiți (ex. „FARA ALCOOL" e și sub Bere, și sub Cocktails — `categoryName` le prinde pe AMBELE).
6. **`bulk_assign_tag` e idempotent** — răspuns `{ assigned, skipped, total }`; `skipped` = aveau deja tagul. Poți re-rula fără grijă. **`assign_tag` (single) NU e garantat idempotent** — poate crea un rând de asignare nou la fiecare apel; pentru orice e peste 1–2 produse folosește `bulk_assign_tag` (idempotent + reversibil cu aceleași filtre).
7. **Reversibil:** greșit aplicat → `bulk_remove_tag` cu aceleași filtre. `entityIds` singur e un filtru valid și la remove (ex. `bulk_remove_tag(tagId, entityIds:[...])`). Atenție: dacă la asignare `skipped > 0`, acele produse aveau tagul DINAINTE — un remove cu aceleași filtre li-l scoate și lor; restrânge filtrele sau folosește `entityIds`.

## Capcane confirmate

- **`create_tag` e idempotent pe (nume, brand) și NU suprascrie.** Re-crearea cu același nume întoarce tagul EXISTENT cu parametrii lui vechi — culoarea/descrierea pe care le-ai dat la al doilea apel se IGNORĂ. Ca să schimbi culoarea/descrierea unui tag existent → `update_tag`, nu `create_tag`.
- **Tag NOU pentru rutare = bonuri pierdute** până când există regula tag→imprimantă/KDS. Un tag creat de tine NU rutează nicăieri singur — produsele lui generează bonuri nerutate care nu se printează și nu apar pe niciun ecran, **fără nicio eroare**. Regula de rutare se creează în aplicație (Setări → Imprimante / ecrane) sau, dacă tool-urile de rutare (`create_tag_routing_rule`, `set_tag_routing`, `list_tag_routing_rules`) sunt disponibile în catalogul conexiunii tale, direct prin conexiune. După ce creezi un tag de secție nou, spune-i utilizatorului EXPLICIT ce tag și unde trebuie să iasă, și cere un bon de test.
- **`brandId` poate fi gol pe taguri vechi.** `create_tag` setează corect `brandId`, dar taguri create prin alte căi (import, `auto_tag_from_menu_categories`) pot rămâne fără brand setat. `list_tags(brandId)` le include oricum (filtrul nu exclude tagurile fără brand), deci nu te speria — dar dacă ai nevoie de izolare strictă pe brand, verifică `brandId` în răspuns.
- **`bulk_assign_tag(tagId, brandId)` fără alt filtru etichetează TOATE produsele brandului.** `brandId` singur e un filtru valid — folosit intenționat e o unealtă („pune «Meniu» pe tot"), accidental e dezastru pe sute de produse. (Doar `tagId`, fără niciun filtru → 0 găsite, nu face nimic.) Confirmă scope-ul înainte.
- **Produsele sunt globale pe firmă** — la firme cu mai multe locații, izolarea se face la regulile de rutare (per locație, în aplicație), nu la etichete. O etichetă „de barul X" pe produse vândute și în localul Y poate trimite bonuri la alt local dacă regula nu e limitată pe locație — verifică mereu limitarea pe locație a regulii.
- **Eroarea „0 categorii găsite în brandId=N"** la `bulk_assign_tag` / `search_products_for_tagging` = numele categoriei e greșit. Verifică ortografia cu `list_menu_categories` (nu presupune — întreabă utilizatorul „X sau Y?" cu opțiuni reale din meniu).
- **Datele apar în UI abia după refresh** — confirmă prin citiri MCP, nu cere utilizatorului să se uite imediat în browser. Succes la tool = salvat; nu repeta scrierea.
- **Ștergerea unui tag NU se face prin MCP** (politica „fără ștergeri de entități întregi"). Dacă scopul e doar „scoate eticheta de pe produse" → `bulk_remove_tag` (nu e nevoie de ștergere). Dacă chiar trebuie șters tagul gol → îndrumă utilizatorul în pagina de etichete (`gaseste_in_aplicatie("pagina de etichete produse")`).

## Pagina din aplicație

`gaseste_in_aplicatie("pagina de etichete produse")` → de regulă `/ai-tags` („Etichete & Alergeni" / agentul „Sym Tag Master"): panou de etichete + chat AI care PROPUNE etichete de rutare, alergeni (Reg. UE 1169) și marketing — utilizatorul Aplică/Refuză fiecare propunere, nimic automat. Tagurile create prin conexiunea ta apar acolo după refresh. Dacă extensia Chrome e conectată, **deschide pagina** (`navigate`) ca utilizatorul să VADĂ etichetele — vezi rețeta din `gestioneaza-etichete`.

## Pentru acces SQL (doar citire)

Dacă tokenul are activat accesul SQL read-only și rapoartele/tool-urile de mai sus nu ajung: descoperă întâi tabelele cu `list_database_tables`, uită-te la structura lor cu `describe_database_table`, apoi rulează `execute_sql_query` (doar SELECT). Întrebări potrivite: „ce etichete există și câte produse are fiecare", „ce produse au eticheta X", „ce reguli de rutare active există pentru o etichetă".
