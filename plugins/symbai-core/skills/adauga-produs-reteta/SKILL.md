---
name: adauga-produs-reteta
description: Adaugă sau corectează produse, rețete și meniuri (tip produs, TVA, unități, taguri de rutare, alergeni, categorii) sau importă un meniu de pe site/PDF/Excel. La „schimbă ingredientul/gramajul/prețul", „adaugă produsul X la N lei", „pune Y în meniu", „fă o rețetă pentru Z", „importă meniul". Pagina de produs bogată din magazinul online → construieste-website.
---

# Produse și rețete — corectează sau adaugă în scopul cerut

## Corecție punctuală

Pentru „pune 130 g de zahăr”, „schimbă prețul la 12 lei” sau o modificare a produsului existent:

1. Identifică ținta și linia din conversație sau prin căutare filtrată. Reutilizează ID-urile verificate; citește rețeta/produsul/articolul de meniu actual. Dacă sunt mai multe ținte plauzibile, citește legăturile înainte să întrebi utilizatorul.
2. Modifică numai câmpurile cerute, prin unealta dedicată din catalogul live. Acordul deja dat pentru acea operație rămâne valabil. Păstrează tipul, meniul, rutarea, unitățile și randamentul dacă nu fac parte din cerere.
3. Recitește rezultatul: ID-ul, câmpul și valoarea solicitată. Continuă ceilalți pași ai aceleiași cereri fără un nou „continuă”, cu excepția ritmului pas cu pas cerut explicit.

Nu relua inventarul de branduri, taguri, meniuri, stilul barului sau întregul catalog pentru o corecție cunoscută. Nu lansa un audit de food cost al întregii firme ca verificare a unei singure linii. Dacă utilizatorul cere și costul actual, recalculează prin raportul dedicat după modificare; vechiul cost nu dovedește valoarea nouă. Spune separat când recalcularea este încă în curs.

## Rețete: informațiile necesare din aceeași citire

- **Cantitatea unui ingredient existent:** caută `fix_recipe_ingredient` și verifică schema live: `ingredientId` este ID-ul liniei (nu `productId`), `quantity` cantitatea nouă, `unit` opțional. Fără `confirm:true` oferă preview; `confirm:true` aplică acordul deja dat pentru acea corecție. `add_recipe_ingredients` adaugă o linie nouă, nu actualizează linia existentă; nu înlocui toată rețeta pentru schimbarea unui gramaj. Respectă drepturile oferite de conexiune.
- `list_recipes(query, ...)` identifică rețeta; `get_recipe_details(recipeId)` citește ingredientele și rezultatele. `unit` este unitatea cantității din rețetă, `productUnit` unitatea de stoc a ingredientului, `productType` tipul său. Folosește aceste câmpuri când sunt returnate; nu citi fiecare produs separat doar pentru unitate. Pentru multe rețete, SQL read-only autorizat cu JOIN/IN pe ID-urile relevante poate returna setul necesar. Verifică schema live; costurile se citesc din rapoartele dedicate.
- Cantitatea și unitatea se tratează împreună: 130 g = 0,130 kg, nu 130 kg. Folosește conversia configurată când există. Nu deduce greutatea sticlei ori mărimea ambalajului din nume. La lipsa informației de conversie păstrează convenția implicită 1:1, fără a o prezenta drept măsurare. Pentru masă↔volum normalizează întâi în kg/l și salvează cantitatea în unitatea de stoc: 300 ml → 0,3 l → 0,3 kg prin fallback, nu 300 kg. Unele versiuni de rețete păstrează cifra brută la conversii necunoscute; verifică ce ai salvat, fără să schimbi unitatea produsului existent doar pentru această aproximație.
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
- ID-uri, nu nume, peste tot unde ai ambele opțiuni.
- Dacă tokenul nu are modulul de scriere necesar („Permisiune insuficientă"), explică activarea din portal Hub → Acces AI.
