# Același produs și aceeași rețetă în mai multe locații

Produsele sunt comune firmei. Un preparat cu aceeași formulă poate folosi același `productId` și aceeași rețetă în meniurile mai multor locații. Denumirea pentru client și prețul se pot stabili pe articolul fiecărui meniu. Diferența de locație, nume afișat sau preț nu cere singură un produs nou.

## Corectează identitatea existentă

La „corectează rețeta”, păstrează produsul, vânzările și pozițiile existente. Nu dezactiva produsul cu istoric și nu-l înlocui în meniu cu alt ID ca pas implicit. Identifică împreună produsele, rețetele active și legăturile din meniurile cerute; o rețetă veche poate fi rezolvată și prin asocierea existentă, nu doar printr-un filtru SQL pe `recipes.product_id`. Confirmă rezolvarea prin diagnosticul dedicat înainte să declari că lipsește rețeta.

Dacă există deja duplicate și utilizatorul cere unificare, stabilește supraviețuitorul după cererea sa și istoricul citit. `preview_finished_product_merge` arată dependențele și rezultatul asupra rețetelor/meniurilor; citește schema live și apoi folosește operația dedicată în scopul autorizat. O corecție de rețetă nu autorizează singură absorbirea altui produs.

## Producția, transferul și consumul la vânzare sunt operații separate

Producția unui semipreparat într-o locație nu obligă toate vânzările lui să consume ingredientele din acea locație. Într-un flux cu transfer, semipreparatul este produs, transferat în locația care îl servește și consumat acolo ca ingredient; celelalte ingrediente urmează rutarea lor. Rețeta descrie compoziția, nu dovedește că producția sau transferul s-au executat.

Nu deduce gestiunea consumată numai din `products.warehouse_id`, `recipes.brand_id`, numele ingredientului sau tagul de imprimare. Verifică `diagnose_consumption_warehouse_routing` pentru produsul exact, cu `brandId` și `locationId` ale fiecărei locații cerute. Citește gestiunea rezolvată, sursa rezolvării și avertismentele pe ingrediente. Reutilizează rezultatele dacă datele nu s-au schimbat.

Alocarea ingredientelor în gestiunile relevante poate fi necesară; nu este singura condiție și nu dovedește existența stocului, a loturilor ori a transferului. Dacă diagnosticul confirmă o alocare lipsă și corecția este autorizată, folosește `assign_product_warehouses` în modul potrivit, păstrând alocările existente. Nu muta gestiunea principală a produsului ca substitut: poate produce efecte asupra stocului.

## Istoric și blocaje

Salvarea rețetei schimbă definiția. Recalcularea consumului și a costurilor istorice este o operație distinctă, cu perioadă și rezultat verificate prin `verifica-consumul`. Nu spune că istoricul este imposibil de corectat numai fiindcă vânzarea este anterioară rețetei și nu porni recalcularea când utilizatorul a cerut doar rețete.

`PRODUCT_MERGE_UNSETTLED_CONSUMPTION_SNAPSHOT` cere investigarea liniei de vânzare și a documentelor indicate. Nu dovedește singur lipsa consumului întregii zile și nu garantează că regenerarea deblochează unificarea. Păstrează produsele și rețetele necesare operării până la remediere; nu repeta unificarea fără dovezi schimbate și nu elimina protecția pentru a forța operația.

La final recitește câmpurile modificate, disponibilitatea pozițiilor existente și rutarea afectată. Spune separat ce s-a salvat, ce s-a verificat și ce rămâne blocat. „Am revenit” trebuie să enumere orice modificare păstrată intenționat.
