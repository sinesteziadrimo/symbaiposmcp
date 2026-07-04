# Onboarding 09 — Rețetele (cost și consum din stoc)

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Conceptele de bază (produs vs articol de meniu vs rețetă, food cost) sunt în `../produse-meniu-retete.md` — nu le repeta aici, citește-le dacă nu le ai în context.

## Scopul fazei

La final, fiecare produs finit care se vinde are o rețetă **legată de produs prin ID**, cu ingrediente în cantități și unități corecte. Asta deblochează două lucruri esențiale: **costul real al porției** (food cost = cost ingrediente ÷ preț de vânzare) și **scăderea automată din stoc** la fiecare vânzare prin POS. Fără rețetă, un preparat vândut nu consumă nimic din stoc și apare fără cost în rapoarte — P&L-ul și marja devin ficțiune. Fazele următoare (siguranță alimentară, rapoarte, prețuri AI) se construiesc pe rețetele de aici.

Precondiție: faza de produse e gata — produsele finite (ce se vinde) și materiile prime (ingredientele) există deja în catalog.

## Permisiuni necesare pe token

- **`retete` (Rețete)** — obligatoriu pentru toate scrierile fazei: `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `remove_recipe_ingredient`, `bulk_replace_recipe_ingredients`, `add_recipe_outputs`, `remove_recipe_output`, `set_recipe_labels`, `set_production_sheet_config`.
- **`produse_meniu`** — opțional, doar dacă descoperi materii prime lipsă și vrei să le creezi controlat cu `create_product` (recomandat în locul auto-creării din tool-urile de rețetă — vezi Capcane).

Fără modulul activat în portalul Hub → Acces AI, tool-urile de scriere întorc „permisiune insuficientă" — cere utilizatorului să bifeze modulul pe token și reîncearcă. Citirile (`list_recipes`, `get_recipe_details`, `analyze_recipes`...) merg întotdeauna.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Afli singur (nu pune întrebări la care există răspuns în date):**
- `list_brands` — brandId (necesar la `analyze_recipes`/`analyze_food_costs` și util la `create_recipe`).
- `list_recipes` (parametri: `productType`, `query`, `limit`) — ce rețete există deja. Notă: prin conexiunea MCP acest tool are parametrii de mai sus, NU `status`/`brandId`; rezultatul NU include `productId` — legătura cu produsul o vezi doar în `get_recipe_details`.
- `analyze_food_costs({ brandId })` — ce produse vândute N-AU rețetă (raportate „fără rețetă"; atenție: potrivirea produs↔rețetă e pe NUME aici, o rețetă legată prin ID dar numită diferit apare fals ca lipsă).
- `analyze_recipes({ brandId })` — starea rețetelor existente: food cost per rețetă, ingrediente fără cost, rețete fără preț de vânzare.
- `list_menu_items` — ce se vinde efectiv (lista de candidați la rețetă; prioritizează ce e în meniu).
- `search_products_db({ query, productType })` — ID-urile și **unitățile** produselor: `finished_good` pentru produsele finite, `raw_material` pentru ingrediente.
- `get_product_details({ productId })` — fișa produsului (tip, unitate, preț, furnizor, taguri) + în ce rețete e folosit ca INGREDIENT. NU arată rețeta care produce produsul — pentru asta `get_recipe_details`.
- `get_recipe_details({ recipeId })` / `list_recipe_ingredients({ recipeId })` — conținutul unei rețete existente.

**Întrebi utilizatorul (minimul real):**
- **Rețetarul propriu-zis** — singura informație pe care n-o poți deduce: „Pentru fiecare preparat am nevoie de ingrediente și gramaje per porție. Mi le poți da (listă, dictare, fișier)? Sau vrei să propun eu gramaje standard pe care le confirmi?" Dacă propui tu gramaje, cere confirmare EXPLICITĂ per rețetă înainte de scriere — gramajele lui, nu ale tale, determină costul și stocul.
- **Semipreparate**: „Ai preparate intermediare făcute în casă (sosuri, blaturi, baze) folosite în mai multe rețete? Le definim ca rețete separate ca să le urmărim costul." Doar dacă răspunsul la prima întrebare sugerează că există.
- Confirmare înainte de orice scriere în masă (ex. „Creez 12 rețete cu ingredientele de mai sus — confirmi?").

Nu cere date opționale (timp de preparare, etape, etichete, fișe de producție) — se pot adăuga oricând mai târziu; în onboarding contează ingredientele și cantitățile.

## Pașii de execuție — tool-urile MCP exacte

**1. Inventar.** `analyze_food_costs({ brandId })` → produsele raportate „fără rețetă"; `list_recipes` + `analyze_recipes({ brandId })` → ce rețete există și ce probleme au. Încrucișează cu `list_menu_items`: ce e în meniu și n-are rețetă e prioritatea.

**2. Rezolvă ID-urile ÎNAINTE de scriere.** Pentru fiecare preparat: `search_products_db({ query: "Carbonara", productType: "finished_good" })` → ID-ul produsului finit. Pentru fiecare ingredient: `search_products_db({ query: "pancetta", productType: "raw_material" })` → ID + **unitatea produsului** (kg/l/buc). Notează unitățile — de ele depinde pasul 4.

**3. Creează rețeta — cu `productId` EXPLICIT.**
```
create_recipe({ name: "Paste Carbonara", productId: 1234, brandId: 1, yield: "1 porție" })
```
Singurul parametru obligatoriu e `name`, dar **dă mereu `productId`**: fără el, tool-ul încearcă potrivire pe nume și, dacă numele rețetei diferă de numele produsului, rețeta rămâne NELEGATĂ (productId null) → vânzarea nu scade stocul. Legarea prin ID e și imună la redenumiri ulterioare ale produsului. `yield` ajută la scalare („1 porție", „5 kg"); restul câmpurilor (`prepTime`, `storageType`, `stages`...) sunt opționale.

**Idempotență**: înainte de creare verifică `list_recipes({ query: "<numele produsului>" })` și, pe candidați, `get_recipe_details({ recipeId })` — dacă există deja o rețetă cu `productId`-ul produsului, NU crea alta (două rețete pe același produs = ambiguitate; sistemul alege una singură). `get_product_details` NU arată rețeta asociată produsului. Editează rețeta existentă cu tool-urile de la pasul 4-5.

**4. Adaugă ingredientele — în unitatea REȚETEI.**
```
add_recipe_ingredients({
  recipeId: 567,
  ingredients: [
    { productId: 89, quantity: 200, unit: "g" },   // produs ținut în kg — conversie automată
    { productId: 90, quantity: 2,   unit: "buc" },  // ouă, produs în buc — aceeași unitate, OK
    { productId: 91, quantity: 50,  unit: "ml" }    // produs în l — conversie automată
  ]
})
```
- `quantity` e obligatoriu per ingredient; `unit` e unitatea în care e scrisă rețeta (g/ml e normal și corect chiar dacă produsul e pe kg/l — conversia e automată în aceeași familie dimensională). `unit` lipsă = se folosește unitatea produsului.
- Folosește `productId`, nu `productName` — vezi Capcane (auto-creare + potrivire parțială).

**5. Corecturi.** `list_recipe_ingredients({ recipeId })` → ID-urile liniilor → `remove_recipe_ingredient({ ingredientId })` pentru una, sau `bulk_replace_recipe_ingredients({ recipeId, ingredients })` pentru rescriere completă (ATENȚIE: șterge TOATE ingredientele existente întâi). Câmpurile rețetei se schimbă cu `update_recipe({ recipeId, ... })`.

**6. Semipreparate (dacă există).** Ordinea contează: întâi rețeta semipreparatului (legată prin `productId` de produsul semipreparat, cu `yield` = cantitatea rezultată, ex. „2 kg"), apoi rețetele finale care îl folosesc ca ingredient obișnuit. Costul se calculează recursiv. `add_recipe_outputs`/`remove_recipe_output` (co-produse, subproduse) și `set_recipe_labels`/`set_production_sheet_config` (etichete, fișe tipăribile) sunt pentru producție/fabrici — sari peste ele în onboarding-ul unui restaurant obișnuit.

**7. Confirmă prin CITIRE, nu prin interfață.** După fiecare scriere: `get_recipe_details({ recipeId })` — rețeta, ingredientele și legătura cu produsul. Interfața din browser are cache și arată datele noi abia după refresh — nu repeta scrierea și nu raporta bug dacă utilizatorul „nu le vede încă".

## Ce se face DOAR din aplicație

- **Ștergerea unei rețete întregi** — nu există tool de ștergere prin MCP (politică: ștergerile doar din UI). Ghidează cu `gaseste_in_aplicatie({ intrebare: "șterge o rețetă" })`; verifică apoi cu `list_recipes` că a dispărut.
- **Import rețetar din Excel** — pagina de mapare a rețetarului (potrivire ingredient → produs, conflictele de unități blochează importul). `gaseste_in_aplicatie({ intrebare: "import rețetar din Excel" })`. După import: `analyze_recipes` + `list_recipes` ca să vezi ce a intrat.
- **„Leagă rețetele de produse" (reparare 1-click)** — dacă găsești rețete cu productId null care au omolog în catalog: `gaseste_in_aplicatie({ intrebare: "leagă rețetele de produse" })` (e în Setări → Reparații). Verifică apoi cu `get_recipe_details` că productId s-a completat.
- **Reprocesarea consumului pe trecut** — dacă rețetele se creează/corectează DUPĂ ce au existat deja vânzări, istoricul de consum nu se rescrie singur. `gaseste_in_aplicatie({ intrebare: "reprocesare consum zilnic" })`; utilizatorul alege perioada. Relevant doar la clienți care vindeau deja înainte de onboarding.
- **Editarea vizuală în masă** — fișa tehnică tip tabel (toate rețetele × ingredientele, editare în celulă) e utilă utilizatorului pentru audit manual: `gaseste_in_aplicatie({ intrebare: "fișa tehnică rețete" })`.

În conversația cu utilizatorul (om de business): spune „rețetă", „ingrediente", „cost per porție", „scădere din stoc" — niciodată „BOM", „yield", „product_id", „endpoint" sau alte denumiri interne.

## Echivalentul în wizard-ul din aplicație

**Pasul 14 din /onboarding** („Rețetar — Cost & Descărcare Stoc Automat"). E un pas informativ care trimite utilizatorul către atelierul de rețete (pagina AI Rețetare, cu editor, creator AI conversațional și analiză) și către fișa tehnică. Rețetele create prin conexiunea ta apar imediat în acele pagini — dar **bifa pasului în wizard NU se actualizează prin conexiune**: dacă utilizatorul parcurge wizardul, apasă el „Continuă" pe pasul 14.

## Verificare la final

- [ ] `list_recipes` — rețetele create există; apoi `get_recipe_details({ recipeId })` pe fiecare rețetă nouă — `productId` nenul (o rețetă fără productId = stoc care nu scade; `list_recipes` prin MCP NU afișează productId).
- [ ] `list_recipe_ingredients` pe fiecare rețetă nouă — cantități și unități corecte, fără linii cu eroare.
- [ ] `analyze_food_costs({ brandId })` — fără produse vândute rămase „fără rețetă" (sau lista rămasă e asumată de utilizator; potrivirea e pe nume — vezi mai sus).
- [ ] `analyze_recipes({ brandId })` — fără ingrediente fără cost; food cost plauzibil (orientativ 20–40%). **Orice valoare peste ~100% = aproape sigur o unitate greșită** — oprește-te și corectează înainte să mergi mai departe.
- [ ] `search_products_db` pe 2-3 nume de ingrediente nou-menționate — nu s-au creat duplicate accidentale în catalog.

## Capcane

- **Unitățile de măsură — greșeala clasică ×1000.** Ingredientul se declară în unitatea REȚETEI (60 g, 50 ml); conversia la unitatea produsului (kg, l) e automată, dar DOAR între unități din aceeași familie (g↔kg, ml↔l). O pereche neconvertibilă — ex. „25 g" dintr-un produs ținut la „buc" — se folosește BRUT: 25 de bucăți consumate, cost de zeci de ori mai mare. Exemplu de efect: rețete cu gramaje pe produse ținute la bucată, fără conversie → food cost peste 150% și stocuri negative de mii de kg, care se repară doar prin reprocesarea consumului pe toate zilele afectate. Regulă practică: pentru produse pe `buc`, declară fracția (180 g dintr-un produs „buc de 1,8 kg"? recalculează în buc: 0.1) sau cere utilizatorului să țină ingredientul pe kg. Verifică ÎNTOTDEAUNA `analyze_food_costs` după un val de rețete noi.
- **`productName` auto-creează produse.** În `add_recipe_ingredients`, `bulk_replace_recipe_ingredients` și `add_recipe_outputs`, un `productName` care nu se potrivește cu nimic din catalog creează SILENȚIOS un produs nou (la ingrediente: materie primă, unitate = `unit`-ul dat sau „kg"; la outputs: produs finit/semipreparat, unitate = `outputUnit` sau „buc"). Un typo („Pancceta") = produs duplicat + rețetă legată de produsul greșit, fără stoc și fără preț. De aceea: rezolvă ID-urile cu `search_products_db` întâi și trimite `productId`.
- **Potrivirea pe nume e fuzzy (exact, apoi parțial).** „Lapte" poate nimeri „Lapte de cocos" dacă nu există produsul „Lapte". Încă un motiv pentru `productId`.
- **`create_recipe` fără `productId`** leagă rețeta prin potrivirea numelui rețetei cu un produs; nume diferit → rețetă orfană → niciun consum la vânzare. Dă `productId` explicit, întotdeauna.
- **`bulk_replace_recipe_ingredients` e distructiv** — șterge toate ingredientele înainte să adauge lista nouă. E pentru „rescrie rețeta", nu pentru „mai adaugă ceva" (acolo folosești `add_recipe_ingredients`).
- **Nu crea a doua rețetă pe același produs.** Sistemul rezolvă consumul printr-o singură rețetă per produs; duplicatele creează ambiguitate. Verifică înainte cu `list_recipes` (căutare pe nume) + `get_recipe_details` (vezi Idempotență la pasul 3).
- **`run_bom_explosion` e doar estimare** — adună cantitățile recursiv FĂRĂ conversie de unități între rețete și sub-rețete; bun ca sanity check („500 porții = ~12 kg paste"), nu ca necesar exact de aprovizionare dacă rețetele amestecă g și kg.
- **Rețete corectate după vânzări** = istoricul rămâne calculat greșit până la „Reprocesare consum" din aplicație (vezi secțiunea UI-only).
- **Cache-ul interfeței**: utilizatorul nu vede rețeta nouă în pagina deja deschisă până la refresh. Confirmarea ta vine din `get_recipe_details`, nu din ce vede el pe ecran.
