# Același produs și aceeași rețetă în mai multe locații

Produsele sunt comune firmei. Un preparat cu aceeași formulă poate folosi același `productId` și aceeași rețetă în meniurile mai multor locații. Denumirea pentru client și prețul se pot stabili pe articolul fiecărui meniu. Diferența de locație, nume afișat sau preț nu cere singură un produs nou.

## Produs, meniu și aplicarea rețetei

Produsul nu are un brand sau o locație proprietar. Gestiunea implicită și alocările pe gestiuni descriu rutarea stocului; tagurile pot descrie imprimarea, KDS sau alte reguli configurate. Niciuna nu transformă produsul în proprietatea unui brand. Același produs poate avea mai multe poziții, în categorii și meniuri diferite. Verifică legăturile actuale din `get_product_details`, inclusiv paginarea; o singură categorie veche din catalog nu enumeră toate aparițiile în meniuri.

Rețeta fără brand (`brandId:null`) este formula comună, aplicabilă tuturor brandurilor care nu au o variantă proprie. Pentru un brand, selecția curentă caută întâi varianta activă a acelui brand, apoi formula comună. Nu ia formula altui brand doar fiindcă are ID mai mare sau nume asemănător. Aceeași regulă se aplică ingredientelor care au la rândul lor rețete și reprocesării cu formulele curente; reconstituirea cu formule istorice originale este o opțiune distinctă.

Adăugarea produsului cu formulă comună într-un alt meniu păstrează automat aceeași formulă. Separarea este o alegere explicită, numai când compoziția trebuie să difere. De exemplu, două branduri pot folosi același burger, dar sosuri cu formule diferite. Nu declara variantele duplicate fără să compari și ingredientele imbricate, randamentul și intenția utilizatorului.

Pentru citire și editare descoperă `get_product_recipe_context` și `set_product_recipe_variant`, dacă sunt disponibile în versiunea live. Contextul arată formula comună, varianta exactă sau formula comună folosită în lipsa variantei. În editor, opțiunea „Rețetă diferită pe brand” și brandul selectat fac explicit ce se editează. Folosește reviziile returnate la citire; dacă altcineva schimbă formula, recitește înainte să aplici. Nu muta direct brandul unei rețete pentru a o face disponibilă în al doilea meniu și nu crea produse noi ca să ocolești o asociere greșită. Dacă versiunea nu oferă încă acest flux, raportează limita verificată, fără să pretinzi că l-ai aplicat.

## Corectează identitatea existentă

La „corectează rețeta”, păstrează produsul, vânzările și pozițiile existente. Nu dezactiva produsul cu istoric și nu-l înlocui în meniu cu alt ID ca pas implicit. Identifică împreună produsele, rețetele active și legăturile din meniurile cerute; o rețetă veche poate fi rezolvată și prin asocierea existentă, nu doar printr-un filtru SQL pe `recipes.product_id`. Confirmă rezolvarea prin diagnosticul dedicat înainte să declari că lipsește rețeta.

Distinge produsul șters de cel inactiv și de poziția indisponibilă într-un meniu. Un rând păstrat pentru istoric nu dovedește că produsul mai poate fi folosit. Rețetele șterse sau arhivate nu sunt formule curente, chiar dacă ingredientele lor sunt încă păstrate pentru trasabilitate. Un produs inactiv poate avea vânzări vechi de analizat; nu-l reactiva pentru a face un raport și nu prezenta ștergerea logică drept eliminare definitivă.

În `get_product_details`, `outputRecipes` sunt formulele care produc articolul, iar `usedInRecipes` sunt rețetele altor articole care îl folosesc drept ingredient. Nu selecta o formulă din a doua listă ca rețetă a produsului. Un nume precum `[UNIFICAT→#123]` este o referință istorică, nu validarea înlocuitorului: citește și ținta, verifică starea, tipul, unitatea și rolul cerut. Un produs finit în porții nu înlocuiește automat materia primă în kg.

Dacă există deja duplicate și utilizatorul cere unificare, stabilește supraviețuitorul după cererea sa și istoricul citit. `preview_finished_product_merge` arată dependențele și rezultatul asupra rețetelor/meniurilor; citește schema live și apoi folosește operația dedicată în scopul autorizat. O corecție de rețetă nu autorizează singură absorbirea altui produs.

## Producția, transferul și consumul la vânzare sunt operații separate

Producția unui semipreparat într-o locație nu obligă toate vânzările lui să consume ingredientele din acea locație. Într-un flux cu transfer, semipreparatul este produs, transferat în locația care îl servește și consumat acolo ca ingredient; celelalte ingrediente urmează rutarea lor. Rețeta descrie compoziția, nu dovedește că producția sau transferul s-au executat.

Nu deduce gestiunea consumată numai din `products.warehouse_id`, `recipes.brand_id`, numele ingredientului sau tagul de imprimare. Verifică `diagnose_consumption_warehouse_routing` pentru produsul exact, cu `brandId` și `locationId` ale fiecărei locații cerute. Citește gestiunea rezolvată, sursa rezolvării și avertismentele pe ingrediente. Reutilizează rezultatele dacă datele nu s-au schimbat.

Alocarea ingredientelor în gestiunile relevante poate fi necesară; nu este singura condiție și nu dovedește existența stocului, a loturilor ori a transferului. Dacă diagnosticul confirmă o alocare lipsă și corecția este autorizată, folosește `assign_product_warehouses` în modul potrivit, păstrând alocările existente. Nu muta gestiunea principală a produsului ca substitut: poate produce efecte asupra stocului.

## Istoric și blocaje

Salvarea rețetei schimbă definiția. Recalcularea consumului și a costurilor istorice este o operație distinctă, cu perioadă și rezultat verificate prin `verifica-consumul`. Nu spune că istoricul este imposibil de corectat numai fiindcă vânzarea este anterioară rețetei și nu porni recalcularea când utilizatorul a cerut doar rețete.

`PRODUCT_MERGE_UNSETTLED_CONSUMPTION_SNAPSHOT` cere investigarea liniei de vânzare și a documentelor indicate. Nu dovedește singur lipsa consumului întregii zile și nu garantează că regenerarea deblochează unificarea. Păstrează produsele și rețetele necesare operării până la remediere; nu repeta unificarea fără dovezi schimbate și nu elimina protecția pentru a forța operația.

La final recitește câmpurile modificate, disponibilitatea pozițiilor existente și rutarea afectată. Spune separat ce s-a salvat, ce s-a verificat și ce rămâne blocat. „Am revenit” trebuie să enumere orice modificare păstrată intenționat.
