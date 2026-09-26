---
name: adauga-produs-reteta
description: Adaugă sau corectează produse, rețete și meniuri (tip produs, TVA, unități, taguri de rutare, alergeni, categorii) sau importă un meniu de pe site/PDF/Excel. La „schimbă ingredientul/gramajul/prețul", „adaugă produsul X la N lei", „pune Y în meniu", „fă o rețetă pentru Z", „importă meniul". Pagina de produs bogată din magazinul online → construieste-website.
---

# Produse și rețete — corectează sau adaugă în scopul cerut

## Înlocuire doar pentru o perioadă

Pentru „a lipsit siropul câteva ore și am folosit lămâi” folosește `inlocuieste-ingredient-temporar` și [registrul din Bucătăria Azi](../../knowledge/inlocuiri-temporare-ingrediente.md). Păstrează rețeta permanentă, cere proporțiile și perioada confirmate și verifică impactul pe vânzări.


## Corecție punctuală

- **Randament, consum și cost:** „marinada nu intră în greutatea finală” stabilește randamentul, nu elimină ingredientele folosite sau costul lor. Păstrează randamentul dictat și toate ingredientele consumate; nu propune ștergerea lor pentru a reduce costul afișat. Separă costul ingredientelor de marja calculată din prețul fără TVA.
- **Ce dovedește estimatorul:** loturile reale și `usesEstimatedFallback:false` descriu sursele prețurilor, nu validează fizic randamentul, densitatea, porționarea ori stocul disponibil. Un lot mic poate furniza prețul pentru un necesar mult mai mare. Pentru disponibilitate verifică separat cantitățile fiecărui ingredient în gestiunea efectivă și restricțiile aplicabile; alocarea și rutarea nu dovedesc soldul. Spune „cost calculat din rețeta salvată și sursele de cost raportate de unealtă”, nu „zero estimări” dacă formula conține ipoteze. Păstrează estimările autorizate ca estimări; nu bloca lucrul și nu modifica formula doar fiindcă lipsesc măsurători. O marjă bazată numai pe materiale nu include automat manopera, ambalajele și comisioanele canalului.
- **Randament presupus greșit:** nu aplica un procent de curățare „normal” ca dovadă că formula este imposibilă. Cantitatea poate fi netă, pierderea poate fi inclusă deja, iar prețul pe kg nu dovedește forma mărfii. Zero deșeu în fișă nu este singur o eroare. Separă kg de litri fără densități; lipsa loturilor salvate nu dovedește că preparatul nu a fost făcut sau cântărit fizic. Pentru o corecție cere intrările și ieșirea măsurate sau formula confirmată. Nu modifica randamentul ori inventarul dintr-un calcul bazat pe ipoteze.
- **Subgramaje:** cantitatea se salvează împreună cu unitatea. Pentru 0,5 g folosește `quantity:0.5, unit:"g"`, chiar dacă produsul are stocul în kg; nu rotunji la 0,001 kg fiindcă un câmp are numai trei zecimale. Verifică suportul conversiei și recitește linia salvată; nu schimba unitatea produsului sau randamentul întregii rețete pentru această precizie.

Pentru „pune 130 g de zahăr”, „schimbă prețul la 12 lei” sau o modificare a produsului existent:

1. Identifică ținta și linia din conversație sau prin căutare filtrată. Reutilizează ID-urile verificate; citește rețeta/produsul/articolul de meniu actual. Dacă sunt mai multe ținte plauzibile, citește legăturile înainte să întrebi utilizatorul.
2. Modifică numai câmpurile cerute, prin unealta dedicată din catalogul live. Acordul deja dat pentru acea operație rămâne valabil. Păstrează tipul, meniul, rutarea, unitățile și randamentul dacă nu fac parte din cerere.
3. Recitește rezultatul: ID-ul, câmpul și valoarea solicitată. Continuă ceilalți pași ai aceleiași cereri fără un nou „continuă”, cu excepția ritmului pas cu pas cerut explicit.

**Rețetă creată din greșeală / dublură:** `delete_recipe` o scoate din listă (ștergere reversibilă, istoricul loturilor rămâne). Dacă rețeta e încă folosită în meniuri active, unealta refuză și listează pozițiile; `force:true` numai după confirmarea explicită a omului. **Brandul rețetei** nu se schimbă cu `update_recipe`: folosește `get_product_recipe_context` → `set_product_recipe_variant` (`mode:'shared', unify:true` pentru o rețetă comună ambelor branduri; `mode:'brand'` pentru o formulă doar a unui brand). O poziție de meniu nefolosită se scoate cu `update_menu_item(active:false)`.

Nu relua inventarul de branduri, taguri, meniuri, stilul barului sau întregul catalog pentru o corecție cunoscută. Nu lansa un audit de food cost al întregii firme ca verificare a unei singure linii. Dacă utilizatorul cere și costul actual, recalculează prin raportul dedicat după modificare; vechiul cost nu dovedește valoarea nouă. Spune separat când recalcularea este încă în curs.

## Rețete: informațiile necesare din aceeași citire

Un produs scos din vânzare poate avea nevoie de rețetă pentru consumul istoric. Inactiv nu înseamnă șters. În restaurant, uneltele de rețete care declară suportul pentru produs inactiv îl păstrează inactiv; folosește ID-ul existent. Nu recomanda implicit activare temporară, clonare sau ștergerea poziției din meniu. Dacă versiunea instalată refuză, păstrează refuzul exact și verifică disponibilitatea corecției, fără să pretinzi că activarea este necesară în toate versiunile.

- **Același preparat în mai multe locații:** citește [produse comune și consum local](../../knowledge/produse-comune-consum-local.md) înainte de a propune clonare, înlocuirea pozițiilor sau mutarea gestiunii. Același produs și aceeași rețetă pot deservi mai multe meniuri; păstrează identitatea existentă și verifică rutarea pentru locațiile cerute.
- **Confirmări scurte și loturi:** leagă „da/confirm” de întrebarea concretă și valorile prezentate pentru fiecare produs. Nu transforma confirmarea a două variante în aceeași cantitate pentru ambele. Dacă rămâne o contradicție care schimbă rețeta, întreabă doar pentru acea linie și continuă partea clară; nu salva întâi cantitatea presupusă.
- La clonare între locații, separă rețeta de producție a semipreparatului de rețeta de servire: porția, garnitura, pâinea și suplimentele nu devin confirmate doar fiindcă semipreparatul local este corect. Folosește gramajele locale confirmate; pentru ce lipsește pregătește propunerea și cere acea informație, fără a modifica rețeta pe baza prețului sau a asemănării numelui. O cantitate improbabilă ori un raport de 1000× sugerează o eroare de unitate/import, dar nu dovedește valoarea corectă sau cauza parserului; verifică sursa ori acordul explicit pentru valorile propuse.
- **Cantitatea unui ingredient existent:** caută `fix_recipe_ingredient` și verifică schema live: `ingredientId` este ID-ul liniei (nu `productId`), `quantity` cantitatea nouă, `unit` opțional. Fără `confirm:true` oferă preview; `confirm:true` aplică acordul deja dat pentru acea corecție. `add_recipe_ingredients` adaugă o linie nouă, nu actualizează linia existentă; nu înlocui toată rețeta pentru schimbarea unui gramaj. Respectă drepturile oferite de conexiune.
- `list_recipes(query, ...)` identifică rețeta; `get_recipe_details(recipeId)` citește ingredientele și rezultatele. `unit` este unitatea cantității din rețetă, `productUnit` unitatea de stoc a ingredientului, `productType` tipul său. Folosește aceste câmpuri când sunt returnate; nu citi fiecare produs separat doar pentru unitate. Pentru multe rețete, SQL read-only autorizat cu JOIN/IN pe ID-urile relevante poate returna setul necesar. Verifică schema live; costurile se citesc din rapoartele dedicate.
- Cantitatea și unitatea se tratează împreună: 130 g = 0,130 kg, nu 130 kg. Folosește conversia configurată când există. **Masă/volum ↔ bucăți/porții cere greutatea, volumul sau porționarea verificată:** 150 g nu devin automat 1 bucată. Nu deduce conversia din nume, preț sau asemănarea ambalajului și nu folosi 1:1 pentru a trece o incompatibilitate. Cere numai informația lipsă pentru acea linie, continuând partea clară. Pentru masă↔volum, o convenție de densitate oferită de versiunea live este o estimare, nu o măsurare; normalizează întâi în kg/l, explică ipoteza și nu o extinde la bucăți. Recitește cantitatea și unitatea salvate. Nu schimba unitatea unui produs cu istoric pentru a evita conversia.
- Rețeta poate avea ca rezultat și o **materie primă obținută intern** (pulpe dezosate din pulpe cu os, zeamă din lămâi): leagă rețeta de materia primă existentă prin `productId` sau, pentru un produs nou, trimite `outputProductType:"raw_material"`. Pentru o transformare făcută acum (consum + stoc) folosește skill-ul `transforma-produs` (`quick_transform_product`).
- La rețete noi folosește `create_recipe(productId)` și ingrediente cu `productId` explicit. Căutarea după nume poate potrivi alt produs; nu crea o dublură pentru un ID necunoscut înainte de căutare. `yield` influențează consumul: o rețetă la o porție rămâne la 1, iar pentru un lot folosește randamentul real împreună cu unitatea rezultatului. Nu înlocui randamentul cu gramajul porției. Folosește punct pentru zecimale, pentru compatibilitate cu versiunile vechi.
- Modificarea definiției rețetei nu dovedește recalcularea consumului istoric. Dacă aceea este cererea, urmează `verifica-consumul` și verifică separat rezultatul. Nu declanșa refacerea istoricului doar fiindcă ai schimbat un ingredient.

## Produs nou sau import

- **Un produs nou:** caută dublurile, reutilizează brandul/meniul verificate și citește numai configurația care îi lipsește. Materiile prime și semifabricatele fabricii nu cer meniu, preț de raft, fotografie sau rutare de servire dacă nu sunt destinate vânzării. Leagă produsul finit de rețeta și fluxul real când cererea privește producția. Pentru alegerea tipului, porționare, adăugarea în meniu ori alte detalii consultă secțiunea potrivită din [produse-meniu-import.md](references/produse-meniu-import.md).
- **Import în masă:** folosește sursa deja oferită. Citește [produse-meniu-import.md](references/produse-meniu-import.md) și aplică fazele relevante în loturi verificate. Verifică maparea și preview-ul când există; acordul pentru importul acelei surse în destinația identificată nu se cere din nou pentru fiecare lot. Întreabă numai informațiile indispensabile încă necunoscute sau efectele suplimentare. Câmpurile opționale lipsă nu blochează partea realizabilă și nu se inventează.
- **Fotografii generate în Codex/ChatGPT:** [genereaza-poze-meniu](../genereaza-poze-meniu/SKILL.md). Importul unui folder de poze existente este în Faza 4 a referinței de mai sus.

Nu încărca alte manuale generale dacă procedura este deja clară. Pentru un flux nou/neclar citește secțiunea necesară din `knowledge/agent-operare-avansata.md`, `knowledge/produse-meniu-retete.md` sau `knowledge/tools-mcp.md`. Catalogul live stabilește uneltele, argumentele și drepturile efective.

## Reguli de aur

- Prețul de vânzare = meniu. Costul = rețetă + recepții (NIR). P&L = tipul de produs. Rutarea bonurilor = taguri. Nu le amesteca.
- `receptionPrice` la marfă = preț de raft (se completează automat din primul preț de meniu), NU cost — nu-l „repara" pentru food cost.
- Caută înainte de a crea; citește după ce scrii; nu repeta o scriere „ca să se prindă".
- ID-uri, nu nume, peste tot unde ai ambele opțiuni. Înainte să creezi produsul „lipsă” dintr-un import, verifică și variantele de nume, articolul de meniu și produsele ale căror rețete folosesc materia primă identificată. O literă diferită sau `40ML` față de `40 ML` poate ascunde produsul existent; nu compara doar numărul de rânduri întors de un JOIN cu numărul produselor din fișier.
- Dacă tokenul nu are modulul de scriere necesar („Permisiune insuficientă"), explică activarea din portal Hub → Acces AI.
