# Găsește orice produs și vânzările lui

Catalogul identifică produsul; raportul măsoară vânzările. O absență din top 50 nu dovedește zero vânzări. Nici o primă pagină de catalog nu dovedește că produsul lipsește.

## Alege unealta după întrebare

| Cerere | Unealta și ce primești |
|---|---|
| „Caută Haribo”, „ce produs are codul acesta?” | `search_products_db(query: "Haribo")`: ID, nume, SKU/cod de bare/EAN, unitate, tip și taguri. |
| „Cât Haribo am vândut în august?” | `vanzari_produse(cauta: "Haribo", perioada: "custom", startDate: "2026-08-01", endDate: "2026-08-31", locationId: ID verificat)`: toate produsele potrivite, cantități, valori ale liniilor și bonuri distincte. Nu trebuie căutat întâi în catalog. |
| „Vânzările produsului cu ID 123” | `vanzari_produse(productId: 123, ...)`; pentru mai multe produse, `productIds: [123, 456]`. Nu folosi ID de articol de meniu. |
| „Cele mai vândute produse” | `top_produse`: clasament, cu paginare. Nu include produsele fără vânzări. |
| „Cât am încasat?” / „Cât profit aduce?” | `raport_vanzari` / `get_product_pnl`: indicatori diferiți de valoarea liniilor vândute. |

`cauta_tool` caută **unelte**, nu produse din firmă. Dacă unealta nu apare în lista gazdei, caută „vânzări pe produs” sau „caută produs după nume SKU cod de bare”, citește schema returnată și apelează `ruleaza_tool(nume, argumente)`. Lista live decide disponibilitatea; o instrucțiune sau o versiune pregătită nu dovedește că instanța a fost actualizată. Nu trimite parametri noi unei scheme vechi și nu afirma că platforma nu are o capabilitate după ce ai privit doar lista compactă.

## Catalog complet și identificare

- Nu cere brand/locație doar ca să cauți un produs. Catalogul este comun, iar rezultatele sunt limitate automat la produsele accesibile contului. La rapoarte, locația și brandul delimitează vânzările: verifică ID-ul unității cerute.
- `query` caută nume, SKU, cod de bare și EAN. Pentru nume, diacriticele și majusculele nu contează; cuvintele pot fi în orice ordine. `%` și `_` din coduri sunt caractere literale.
- Fără `active`, sunt incluse produsele active și inactive; `active: false` le caută pe cele inactive. `productType` acceptă și codurile proprii firmei, citite din `list_product_types`.
- Paginarea catalogului: `limit` implicit 50, maxim 100, `offset` implicit 0. `data` rămâne lista produselor; `pagination.total`, `hasMore` și `nextArguments` descriu lista completă și continuarea. Păstrează filtrele. Dacă răspunsul este marcat incomplet, recitește aceeași pagină cu limită mai mică înainte să avansezi.
- Asemănarea numelui nu identifică unic un produs. Prezintă variantele relevante cu ID, unitate și cod. Pentru o modificare ambiguă, cere alegerea exactă; pentru „toate produsele Haribo”, raportul poate întoarce fiecare produs separat.
- Nu interpreta costul de achiziție drept preț de vânzare și nu deduce stocul din catalog. Costurile apar numai cu dreptul potrivit.

## Raport complet și interpretare

- Filtrarea se face pe toate vânzările eligibile din perioadă și arie, înainte de limitare. Căutarea recunoaște numele actual și denumirile istorice de pe bon, SKU, cod de bare și EAN. Două produse cu același nume și ID-uri diferite rămân separate. Fără produs legat, raportul grupează după articolul de meniu, dacă există, altfel după numele istoric; `menuItemId` nu este `productId`. Produsele fără vânzări eligibile nu sunt rânduri în raport; verifică existența lor în catalog.
- `total` include toate potrivirile, inclusiv cele de pe paginile următoare. Nu aduna totalurile paginilor. `total.bonuri` este numărul distinct de bonuri; nu aduna aparițiile fiecărui produs, fiindcă un bon poate conține mai multe produse.
- Paginarea raportului este în `data.paginare`; urmează `nextArguments`, care păstrează datele exacte. Raportul are implicit 50 produse/pagină, maxim 100; topul are implicit 10, maxim 50.
- Cantitatea rămâne separată pe produs. Unitatea prezentată este cea curentă a catalogului, dacă există; nu aduna kilograme cu bucăți și nu presupune unitatea pentru o linie istorică fără catalog.
- Valoarea este suma liniilor de bon eligibile, fără bacșiș. Nu este profit și nu reprezintă automat încasările după toate ajustările aplicate notei. Pentru comparații citește definiția raportului și aceleași filtre.
- Datele calendaristice includ ultima zi în Europe/Bucharest, după deschiderea comenzii. Raportul afișează intervalul, criteriul de dată și momentul verificării. Alte rapoarte pot folosi închiderea/plata sau limite de oră exacte; nu le presupune identice.
- Zero rezultate înseamnă zero vânzări eligibile cu acele filtre și în acea arie. Nu dovedește că produsul nu există, că nu s-a vândut în altă unitate sau că o pagină dincolo de final este întreaga populație.

## Permisiuni și versiuni

Căutarea catalogului cere citire **Produse & Meniuri**, iar raportul pe produs cere citire **Comenzi POS** și, pentru un cont de angajat, dreptul **Rapoarte Vânzări** (`report_sales`). Funcționează fără SQL și fără `read_all`; aria live și drepturile suplimentare pentru costuri se păstrează. `read_all` nu este un motiv să alegi SQL când există o unealtă dedicată.

Dacă versiunea live nu oferă raportul, verifică `cauta_tool` și `verifica_conexiune` înainte de fallback. SQL read-only este o opțiune numai dacă este permis și unealta dedicată lipsește efectiv; nu ocoli restricțiile. Nu cere lărgirea accesului pentru o căutare pe care modulul existent o permite. Memoria poate păstra preferința de lucru, nu o presupusă limitare permanentă a uneltelor și nici „nu apare în top = nu s-a vândut”.
