# Meniu, produse și rețete

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă tot ce se vinde și din ce se face: catalogul de produse, meniurile cu prețuri pe fiecare canal de vânzare, rețetele cu ingrediente și cost, alergenii, ofertele care chiar reduc nota, disponibilitatea produselor („86") și uneltele de import și curățare a catalogului. Regula de aur: **costul se naște în rețetă, prețul se setează în meniu** — food cost = cost ÷ preț de vânzare.

## Concepte

- **Produs** — lucrul fizic din gestiune: unitate de măsură (kg, l, buc), stoc, preț de achiziție. Produsele sunt globale pe companie (un singur nomenclator); pe fișa produsului se setează doar prețul de recepție, NU prețul de vânzare.
- **Articol de meniu** — lucrul vandabil, cu preț de vânzare. Trăiește într-un meniu, într-o categorie. Același produs poate fi în mai multe meniuri, cu nume și preț propriu în fiecare — așa se fac prețuri diferite per platformă.
- **Meniu** — colecție de articole cu prețuri. Un brand poate avea mai multe meniuri (unul prestabilit + ciorne); se pot duplica ca să lucrezi pe o copie fără să atingi meniul servit.
- **Categorie de meniu** — ierarhie pe până la 6 niveluri (ex. Bar > Bere > Artizanală); clic pe o categorie părinte arată și produsele subcategoriilor.
- **Rețetă** — lista de ingrediente + cantități a unui preparat. Dă costul real și determină consumul de stoc la vânzare. Unitățile contează: 200 g ≠ 200 kg — o greșeală de unitate strică food cost-ul (poate ieși ×1000) și stocul; conversiile g↔kg, ml↔l se fac automat în aceeași familie.
- **Semipreparat** — subproducție internă (ex. sos) cu randament (cantitate rezultată); poate fi ingredient în alte rețete (rețete pe mai multe niveluri), costul se calculează recursiv.
- **Tip de produs** — materie primă, marfă, semipreparat, produs finit, consumabil, ambalaj, serviciu etc. (30+ tipuri). Controlează comportamentul (are stoc? are rețetă? se vinde?) și conturile contabile asociate.
- **Pachet meniu (combo)** — produs cu componente alese din alte produse. Pe bonul fiscal apar produsele componente (nu pachetul ca un singur rând), TVA-ul se calculează pe fiecare produs, iar pe nota de plată se vede grupul „pachet" cu produsele pe linii separate; stocul scade din rețetele produselor conținute.
- **Masă servită** — tip de produs (`masa_servita`) pentru meniuri de eveniment vândute la preț fix FĂRĂ rețetă cunoscută la vânzare (ex. „Meniu nuntă"); costul real se atașează ulterior prin fișe de consum. Registrul e la /finance/served-meals.
- **Food cost** — cost ÷ preț de vânzare; ~30% e bine, ~50% e critic. Produsele cu ingrediente fără preț apar „cost incomplet", nu cu un verde fals.
- **Alergeni** — cei 14 din Regulamentul UE 1169/2011; produsele finite îi moștenesc automat din ingredientele rețetei (recursiv), se pot adăuga și manual.
- **Etichetă (tag)** — grupare de produse folosită la rutarea bonurilor pe imprimante/KDS, filtre de meniu și marketing.
- **Ofertă** — reducere care chiar se aplică pe notă, automat (spre deosebire de banner-ele promoționale de pe website, care sunt doar vizuale).
- **„86" / indisponibil** — produs marcat temporar indisponibil; verdictul e identic pe POS, website și meniul QR.

## Paginile modulului

**Meniu și afișare**
- **Meniu** (`/menu`) — pagina clasică „Meniu & Dispozitive POS" cu 5 taburi: Prețuri Meniu, Platforme, Configurare Afișaj (POS/Web), Meniu Fizic, Oferte & Promoții. Vechea adresă /menu-engineering redirectează aici.
- **Produse Meniu** (`/menu/pricing`) — prețurile de vânzare ale articolelor din meniu: adaugi produse/pachete în meniu, editezi prețuri, filtrezi pe tip/tag/sursă de cost. Butoane: „Adaugă poze bulk" și „AI Prețuri" (duce la /ai-pricing — clasificare în 4 cadrane Vedete/Cai de povară/Ghicitori/De reconsiderat + recomandări de preț + „Pregătește meniu nou" = copie de lucru a meniului).
- **Poze Bulk Meniu** (`/menu/pricing/bulk-photos`) — urci multe poze deodată (drag & drop), AI sugerează automat produsul potrivit din meniu pentru fiecare poză; tu confirmi sau schimbi.
- **Platforme** (`/menu/platforms`) — ce meniu se vede pe fiecare canal de vânzare: Mod Kiosk, POS Ospătar, POS Mobil, POS Bar, POS (retail — vânzare rapidă), Comenzi Client și Platforma Clienți Web; per canal alegi meniurile-sursă și poți exclude categorii sau produse. Pentru prețuri diferite pe o platformă de livrare (Glovo/Wolt) creezi un meniu separat cu prețurile acelei platforme; conectarea efectivă a canalelor de livrare se face în modulul Livrări.
- **Configurare Afișaj** (`/menu/display`) — cum arată meniul pe fiecare din cele 8 profile: POS Ospătar, POS Mobil, POS Bar, POS (retail), Kiosk Client, Website/Online, Platforma Clienți Web și Table — Clienți (meniul QR scanat la masă). Teme, mărimi carduri și navigarea categoriilor: plată, pe 2 niveluri sau drill-down.
- **Meniu Fizic** (`/menu/physical`) — editor full-screen de meniu printabil (sidebar-ul aplicației se ascunde): formate A4/A3, paginare automată cu „Recalculează", copertă + pagini speciale, pagini finale cu valori nutriționale și alergeni, stiluri pe 3 niveluri (meniu → pagină → produs), export PDF/print; QR-ul de pe copertă e un QR dinamic editabil ulterior.
- **Centru Meniu** (`/menu/center`, alias `/centru-meniu`) — panou pentru manageri: ce e „86" acum (cu motiv, cine, până când + buton Reactivează), câte produse n-au fotografie sau alergeni, căutare produs cu marcare „86" rapidă și alias-uri de căutare.
- **Oferte** (`/menu/promotions`) — motorul de oferte care chiar reduce nota: 5 rețete (Reducere %, Happy Hour, Cadou la X lei, Cumperi X primești Y, Sumă fixă), pe canale (sală/kiosk/website/QR/delivery) și zile/ore. **Margin Guardrail** îți spune ÎNAINTE, în lei, dacă oferta vinde sub cost (verdict: pe plus / marjă subțire / pierzi bani — la pierdere butonul de pornire e blocat, dar poți „Publică oricum"). După lansare, **Scorecard** spune dacă oferta merită păstrată; există și panou Autopilot cu propuneri de la Sym, Win-Back Radar și Surprize.

**Catalog produse**
- **Toate Produsele** (`/master-data`) — nomenclatorul complet, cu grupare pe Magazii, Categorii sau Categorii Meniu, fișa completă a produsului (poze, alergeni, taguri, magazie) și duplicarea unui meniu cu categorii și produse.
- **Conturi pe Tip Produs** (`/ai-product-types`) — hub-ul tipurilor de produs, cu mod Simplu/Avansat: carduri cu semafor de sănătate, template-uri 1-click, „Completează/Repară" automat conturile contabile (non-distructiv) și asistentul Sym opțional. Taburi: Tipurile mele, Pe unități, Împărțire costuri. Vechea adresă /settings/product-types redirectează aici.
- **Alergeni** (`/allergens`) — 3 taburi: Lista alergeni, Acoperire produse, Matrice Cross-Contact (cu protocoale de curățare). Asociezi alergenii la materii prime; produsele finite îi moștenesc prin rețetă. Buton „Sugestii Automate" pe materii prime după nume.
- **Etichete & Alergeni** (`/ai-tags`) — „Sym Tag Master": lista de etichete (creare, culori, tipuri de entitate), atribuire manuală/tabel/wizard și chat AI care PROPUNE taguri de alergeni (Reg. UE 1169/2011), rutare imprimante/KDS și marketing — tu aprobi sau refuzi fiecare propunere, nimic nu se aplică automat.
- **Unifică Duplicate** (`/automations`) — detectează produse duplicate din catalog (nume identic/aproape identic) și le unește inteligent: supraviețuiește produsul cu vânzări + loc în meniu, preia rețeta, stocul se adună, vânzările și prețul din meniu se păstrează. Conflictele (tip/unitate diferită, ambele cu rețetă) rămân de tratat individual; la o pereche poți alege manual care produs rămâne (rețeta și setările lui câștigă), cu previzualizare de impact înainte de unire.
- **Produse & Variante** (`/ecommerce/variants`) — apare doar cu modulul Magazin Online activ: produse cu variante (mărimi/opțiuni), prețuri și stoc per variantă, prețuri în masă, pachete, colecții și export feed.

**Rețete**
- **Rețete** (`/ai-recipes`) — „AI Rețetare", atelierul central: toate produsele finite + semipreparatele (inclusiv fără rețetă), cu cost/unitate, food cost per meniu, vânzări reale, editor de ingrediente, fișă tehnică. Filtre rapide: De rezolvat, Critice, Fără rețetă, Incomplete, „Vândute, marjă mică", Semipreparate. „Rezolvă cu Sym" propune pentru produsele fără rețetă: rețetă generată din materiile prime existente, schimbare de tip, pachet meniu sau tip „masă servită". Sursa costului e comutabilă: mediu din stoc (recepții reale) sau preț catalog furnizor. „Sym Chef" creează rețete prin conversație.
- **Fișă Tehnică Rețetă** (`/recipe-datasheet`) — „Datasheet Rețetare": vedere tip tabel a tuturor rețetelor cu ingrediente, cantități și costuri, cu filtre, totaluri (cost total, cost mediu/rețetă, câte fără preț) și export CSV. Se deschide din pagina Rețete.
- **Leagă Rețetarul** (`/recipe-mapping`) — import rețetar din Excel (coloane: Produse Finite, Porții, Ingrediente, UM, Cantitate): fiecare ingredient se mapează la un produs existent (potrivire exactă → similară → „Rezolvă cu AI"); conflictele de unitate de măsură BLOCHEAZĂ importul până le rezolvi; produse noi se creează doar pentru ce nu există.

**Import**
- **Import din Excel** (`/ai-bulk-import`) — „Sym Import": urci fișiere Excel (produse, prețuri, stocuri), AI mapează coloanele, pune întrebări de clarificare unde nu e sigur și are editare avansată înainte de import.
- **Meniu din PDF** (`/menu/import-pdf`) — urci un PDF cu meniul SAU poze/scanări: AI extrage produsele, prețurile, pozele și chiar designul paginilor (reconstruit pentru Meniu Fizic), cu propunere editabilă înainte de import; prețurile nu sunt niciodată inventate — doar ce există în document.

**Pagini publice (văzute de clienți)**
- **Meniu Public Portal** (`/portal/menu`) — meniul digital pe platforma clienților, cu căutare, filtre dietetice, alergeni și poze (ce se afișează e controlat din Configurare Afișaj + setările portalului).
- **Meniu la Masă QR** (`/t/:codQR`, și `/table-menu/:codQR`) — pagina deschisă când clientul scanează QR-ul mesei; detectează automat dacă telefonul e pe rețeaua restaurantului și folosește serverul local pentru viteză, altfel rămâne pe cloud.

**Conex**: „Sym Menu" (`/ai-menu`) — agent AI conversațional care creează sau editează meniul întreg pentru o unitate; „AI Prețuri" (`/ai-pricing`) — analiza și recomandările de preț.

## Fluxuri frecvente

**Adaugi un preparat nou (corect, de la zero)**
1. Creezi produsul (dacă nu există) — fără preț de vânzare pe el, doar preț de recepție.
2. Dacă e preparat: creezi rețeta cu ingrediente la /ai-recipes (atenție la unități: g vs kg!).
3. Îl adaugi ca articol de meniu cu preț de vânzare la /menu/pricing.
4. Verifici prețul, TVA (mâncare preparată de regulă 11%) și food cost-ul afișat.

**Pui preț diferit pe o platformă de livrare**
1. Duplici meniul existent (din /master-data sau „Pregătește meniu nou" din AI Prețuri).
2. Modifici prețurile în copia respectivă.
3. La /menu/platforms atribui meniul potrivit canalului; pentru Glovo/Wolt, sincronizarea efectivă a meniului se face din modulul Livrări.

**Lansezi un happy hour**
1. /menu/promotions → cardul „Happy Hour" → alegi produsele/categoriile, procentul, zilele și fereastra orară, canalele.
2. Te uiți la verdictul Margin Guardrail (în lei): dacă „pierzi bani", regândește sau confirmă explicit.
3. Pornești oferta — se aplică automat pe notă în fereastra setată; după câteva zile verifici Scorecard-ul.

**Marchezi un produs indisponibil („86") și îl readuci**
1. /menu/center → cauți produsul → marchezi „86" (cu motiv, opțional până la o oră).
2. Verdictul se propagă peste tot: POS, website, meniu QR.
3. Tot acolo vezi lista „Ce e 86 acum" și apeși „Reactivează".
- Alternativ, reguli automate: „automat din stoc" (indisponibil când stocul live ≤ 0), configurabile pe 3 niveluri — per produs > per tip de produs > global.

**Cureți catalogul de duplicate**
1. /automations → „Unifică produse finite" → „Sugestii automate de unire".
2. Bifezi perechile și „Unifică inteligent" — cele fără conflict se unesc automat (rămâne produsul vandabil, cu vânzări și loc în meniu); la conflicte se deschide pasul „Alege care produs rămâne", unde dai clic pe cardul produsului păstrat și vezi impactul înainte de unire.
3. Sugestiile greșite se pot respinge persistent (nu mai reapar).

**Imporți meniul dintr-un PDF sau poze**
1. /menu/import-pdf → urci PDF-ul sau pozele → AI analizează paginile.
2. Verifici propunerea (produse, prețuri, categorii) și corectezi ce vrei.
3. Imporți — produsele intră în catalog/meniu și designul e reconstruit în Meniu Fizic.

**Introduci băuturile de bar corect (marfă vs materie primă)**
1. Uită-te ÎNTÂI cum ține clientul barul (caută 2-3 băuturi existente): marfă la bucată sau materie primă la litru cu rețete de porționare. Continuă stilul lui.
2. Îmbuteliate/doze/țigări vândute ca atare → **marfă** (merchandise), unitate „buc", FĂRĂ rețetă — consumul se descarcă direct 1:1 din stoc, iar „fără rețetă" e starea corectă pentru marfă.
3. Porții turnate (Vodka 40 ml, vin la pahar) → sticla-sursă e produs separat ținut la **litri** (materie primă dacă nu se vinde întreagă), iar produsul vândut are **rețetă de porționare** 0,04 l (sau 40 ml — conversia ml↔l e automată). ⚠ Dacă sticla e ținută la „buc", rețeta în ml e neconvertibilă și consumă 0,04 BUCĂȚI per shot — fără avertisment.
4. Cocktailuri/cafele/limonade (≥2 ingrediente) → **produs finit** cu rețetă; siropul de casă = semipreparat.
5. TVA: alcoolul mereu 21%; mâncarea preparată și băuturile nealcoolice de regulă 11%.

**„Stocul nu scade după vânzare" / rețete nelegate**
1. Verifică la /ai-recipes dacă produsul are rețetă și dacă rețeta e legată de produs (cauza tipică: produs redenumit sau diferențe de nume — typo, diacritice, sufixe gen „mp"/„(4pers)").
2. Setări → Reparații → „Leagă rețetele de produse" (1-click, cu previzualizare); tot acolo: curățare rețete orfane, unificare categorii duplicate, reparare unități de măsură neconvertibile.
3. După corectarea rețetelor, rulezi „Reprocesare consum" (pagina Consum Zilnic) ca să recalculezi consumul și costurile pe perioada afectată.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `list_menus`, `list_menu_items`, `list_menu_categories` — meniurile, articolele și categoriile, cu prețuri.
- `search_products_db`, `get_product_details` — căutare în catalog și fișa completă a unui produs (taguri, gestiune, rețetă).
- `list_recipes`, `get_recipe_details`, `list_recipe_ingredients`, `run_bom_explosion` — rețete, ingrediente, necesar de materii prime la o cantitate dată.
- `analyze_food_costs`, `analyze_recipes`, `generate_report` (tip `food_cost`) — analiza costurilor și completitudinii rețetelor.
- `list_product_types`, `get_product_type_details` — tipurile de produs cu proprietăți și conturi.
- `list_vat_rates`, `list_tags`, `list_untagged_products` — cote TVA, etichete, produse fără etichetă.
- `top_produse` — cele mai vândute produse pe perioadă.
- `gaseste_in_aplicatie` — link direct către orice pagină.

**Scriere (cer modulul de permisiune `produse_meniu` pe token):**
- `create_product`, `update_product`, `bulk_create_products`, `bulk_update_products` — catalog (prețul de vânzare NU se pune aici).
- `create_menu`, `update_menu`, `add_menu_item`, `update_menu_item`, `bulk_update_menu_item_prices`, `apply_menu_prices`, `auto_create_menu_from_products` — meniuri și prețuri de vânzare.
- `create_vat_rate`, `auto_assign_vat_batch` — TVA (clasificare automată cu AI).
- `create_tag`, `update_tag`, `assign_tag`, `bulk_assign_tag`, `bulk_remove_tag`, `auto_tag_from_menu_categories` — etichete.
- `create_allergen`, `set_product_allergens` — alergeni.

**Scriere (modul `retete`):** `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `remove_recipe_ingredient`, `bulk_replace_recipe_ingredients`, `add_recipe_outputs`, `remove_recipe_output`, `set_recipe_labels`, `set_production_sheet_config`.

**Scriere (modul `financiar`):** `create_product_type`, `update_product_type`, `update_product_type_accounts_per_unit` — tipuri de produs și conturile lor.

**Scriere — categorii de meniu și imagini (din 2026-06, acoperă golurile de import):**
- `create_menu_category` — creează o categorie de meniu (ierarhică prin `parentId`, ex. Bar > Bere); idempotentă pe (nume, brand); se atașează automat la meniurile brandului.
- `set_product_image` — pune o imagine pe produs dintr-un URL public (ex. de pe meniul/site-ul vechi); o descarcă și o stochează optimizat (NU rămâne hotlink), apoi o propagă la articolele de meniu. `gallery: true` adaugă în galerie fără a înlocui cover-ul.
- `add_menu_item` / `update_menu_item` acceptă acum și `menuCategoryId`, `description`, `gramaj` — categoria se oglindește automat și pe produs.

Notă: nu există tool-uri MCP pentru oferte/promoții (se gestionează doar din pagina Oferte) și nici tool-uri de ștergere de produse/meniuri (ștergerile se fac doar din aplicație).

**⚠ Ce rămâne DOAR din aplicație (nu prin MCP):**
- **Regulile de rutare taguri→imprimante/KDS**: doar din Setări → Imprimante. Un tag NOU creat prin MCP nu rutează nicăieri până nu i se creează regula acolo (refolosește tagurile EXISTENTE ale clientului).
- **Pozele în masă cu potrivire automată**: dacă ai zeci de poze fără să știi exact ce produs e fiecare, pagina Poze Bulk Meniu (`/menu/pricing/bulk-photos`) le potrivește cu AI. Prin MCP pui poza pe un produs anume cu `set_product_image` (când ai URL-ul și produsul).
- **Ofertele/promoțiile, ștergerile de entități**: din aplicație.

**⚠ Capcane de tool-uri (verificate în cod):**
- `add_menu_item` e UPSERT: dacă produsul e deja în meniu, câmpurile trimise se aplică pe item-ul existent (nu mai e „există deja, ignorat"). Numele afișat ia implicit numele produsului dacă nu trimiți `name`.
- `set_product_image`: URL-ul trebuie PUBLIC (http/https, nu IP intern); imaginea se descarcă și se optimizează — dacă URL-ul pică, dă eroare clară, nu poză moartă.
- Dedupe silențios cu success: `create_product` (nume exact), `create_menu`, `create_tag`, `create_allergen`, `create_menu_category` (nume+brand) întorc entitatea existentă FĂRĂ a aplica parametrii trimiși — caută înainte, citește răspunsul.
- `create_recipe`: dă MEREU `productId` explicit (altfel match parțial pe nume sau auto-creează produs nou). `add_recipe_ingredients`: folosește `productId`, nu `productName` (typo = produs raw_material auto-creat).
- `set_product_allergens` ÎNLOCUIEȘTE tot setul de alergeni al produsului. Alergenii din rețetă se moștenesc automat.
- `auto_create_menu_from_products` pe tenant viu = toate produsele nemeniuite intră cu preț 0 într-un meniu activ. `bulk_update_menu_item_prices` fără `brandId` = match pe nume în tot sistemul.
- Schimbarea gestiunii (`warehouseId`) pe un produs cu stoc declanșează transfer contabil automat (document + note).

## Întrebări frecvente și capcane

- **De ce nu scade stocul când vând un preparat?** Rețeta nu e legată corect de produs (tipic după o redenumire) sau produsul n-are rețetă. Verifică la /ai-recipes, apoi Setări → Reparații → „Leagă rețetele de produse".
- **Food cost-ul e absurd (ex. 150%) sau stocul a luat-o razna.** Aproape mereu o unitate de măsură greșită în rețetă (kg în loc de g, l în loc de ml). Corectează rețeta, apoi reprocesează consumul pe perioada afectată.
- **De ce nu se aplică reducerea pe notă?** Doar ofertele din pagina Oferte (/menu/promotions) reduc efectiv nota. Banner-ele promoționale de pe website sunt doar vizuale. Verifică și fereastra orară/zilele și canalele ofertei.
- **De ce nu pot porni oferta?** Margin Guardrail a calculat că vinde sub cost — butonul e blocat. Poți modifica oferta sau confirma explicit „Publică oricum". Dacă verdictul e „provizoriu", completează rețetele lipsă pentru un calcul sigur.
- **Unde setez prețul de vânzare?** DOAR în meniu (Produse Meniu sau `add_menu_item`/`update_menu_item`). Pe fișa produsului există doar prețul de achiziție/recepție.
- **De ce nu apare produsul pe kiosk/POS?** Verifică în Platforme ce meniuri sunt atribuite canalului și dacă produsul/categoria nu e exclus(ă); apoi verifică disponibilitatea (nu e „86", nu e „automat din stoc" cu stoc 0).
- **De ce apare „indisponibil" deși am stoc?** Regulile de disponibilitate au 3 niveluri: per produs > per tip de produs > global. Un operator l-a putut marca „86" manual — vezi /menu/center cine și de ce.
- **Ce cote TVA folosesc?** În România: 0%, 11%, 21%. Mâncarea preparată de regulă 11%, băuturile 21%. Nu folosi cotele vechi 5/9/19.
- **Pachet meniu sau masă servită?** Pachet = grupare de produse care EXISTĂ deja separat în meniu. Masă servită = meniu de eveniment la preț fix la care NU cunoști rețeta la vânzare — costul se stabilește ulterior din consum.
- **De ce nu pot importa rețetarul din Excel?** Conflictele de unitate de măsură (marcate galben) blochează importul până le rezolvi — intenționat, ca să nu-ți strice consumul.
- **„Niciun produs cu acest nume" la legarea rețetelor.** Potrivirea e pe nume exact — divergențele tipice sunt typo-uri, diacritice sau sufixe („mp", „Promo", „(4pers)"). Redenumește sau leagă manual.
- **Am două produse aproape identice în catalog.** Nu le șterge manual — folosește Unifică Duplicate, care păstrează vânzările, stocul (adunat), rețeta și locul în meniu.
- **Produsul nou nu iese la imprimantă/KDS.** Aproape sigur n-are tag de rutare sau are un tag NOU fără regulă: bonul se creează „unrouted" (nu se printează, nu apare pe niciun ecran, fără eroare). Dă-i tagul EXISTENT al secției (`list_tag_summary` arată convenția clientului); pentru tag nou, regula se creează în Setări → Imprimante.
- **Cum pun categorie/descriere/gramaj/poză la import prin asistent?** Categoria: `create_menu_category` (o dată per secție) + `menuCategoryId` pe `add_menu_item`. Descrierea și gramajul: direct pe `add_menu_item`/`update_menu_item` (sau `description`/`weight` pe produs). Poza: `set_product_image` cu URL public. Toate se văd după un refresh al paginii.

## Pentru acces SQL

Tabele cheie: `products` (catalog + tip produs + disponibilitate), `menus`, `menu_items` (prețuri de vânzare), `menu_categories` (ierarhie), `recipes` + `recipe_ingredients`, `product_types`, `allergens` + `product_allergens`, `tags`, `offers`, `served_meals`.

Întrebări exemplu: „câte produse finite n-au rețetă?" (products fără recipes pe product_id), „ce articole de meniu n-au poză?" (menu_items cu image_url gol), „ce oferte sunt active acum?" (offers cu active = true).
