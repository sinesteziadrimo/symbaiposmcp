# Caută datele potrivite și citește lista completă

Pentru „găsește X”, începe cu unealta de citire a acelei entități. `cauta_tool` găsește unelte în catalogul permis conexiunii; nu caută produse, facturi sau persoane în firmă. `read_all` nu este necesar unei căutări pentru care contul are modulul de citire potrivit. Uneltele dedicate respectă verificările lor de rol și arie; accesul SQL se verifică separat. Grantul explicit Read All poate oferi citire SQL pe întregul tenant, fără să mărească drepturile de scriere.

## Alegerea uneltei

| Ce cauți | Punctul de pornire | Ce verifici |
|---|---|---|
| Produs după nume, SKU sau cod de bare/EAN | `search_products_db(query)` | ID, cod, unitate și stare. Nu este raport de stoc/vânzări. |
| Vânzările unui produs, inclusiv în afara topului | `vanzari_produse(cauta sau productId/productIds, perioada, locationId)` | Perioada, unitatea și `data.paginare`. Vezi [ghidul produselor](cautare-produse-si-vanzari.md). |
| Furnizor existent | `list_suppliers(query)` | Nume, CUI, contact, email sau telefon. `supplierId` selectează exact; fără `active` sunt incluși și inactivii. |
| Factură primită de la furnizor | `list_invoices(query, supplierId?, dateFrom?, dateTo?, brandId?, locationId?)` | `id` este ID-ul documentului; `numar` este numărul facturii. `status` = plată (`unpaid/partial/paid`); `processingStatus` = procesare. |
| Factură fiscală emisă către client | `list_fiscal_invoices(query, dateFrom?, dateTo?, brandId?, locationId?)` | Serie/număr, cumpărător/CUI, status și e-Factura. |
| Notă/comandă POS | `list_orders(query, orderId?, customerId?, employeeId?, tableId?, status?, dateFrom?, dateTo?)` | `query` caută număr, masă sau ospătar. Intervalul privește data deschiderii în ora României. Fără status apar toate stările; suma notelor nu înlocuiește raportul de vânzări. |
| Stocul unui produs | `get_stock_levels(query sau productId, warehouseId?)` | Nume/SKU/cod; `productType` acceptă și coduri proprii. Lista privește produsele stocabile și cantitățile din gestiuni. |
| Rețetă | `list_recipes(query, status?, brandId?)` | Implicit active; `status: "all"` include inactive. ID-ul rețetei diferă de `productId`. Detalii: `get_recipe_details(recipeId)`. |
| Client existent | `list_customers_360(search, brandId?, locationId?)` | Nume, email sau telefon; `get_customer_360(customerId)` pentru fișă și `list_customer_360_orders(customerId)` pentru bonuri. |
| Angajat existent | `get_staff_overview(query?, employeeId?)` | Identitatea și starea. Pentru ture/pontaje cere colecția și perioada din schema live; o primă pagină nu descrie toată echipa. |

Nu folosi crearea unui furnizor/client ca mecanism de căutare. Numele se caută fără diferențe de diacritice; un ID se ia din citire, nu se deduce din numărul facturii sau bonului. Pentru o modificare ambiguă, identifică întâi înregistrarea exactă.

## Descoperire și acces

`cauta_tool(intrebare: "caută factura de la furnizor", tip: "citire", limita: 8)` întoarce numele, descrierea, schema, domeniul, modulul de citire și `annotations`, inclusiv `readOnlyHint`. `tip: "scriere"` restrânge la operații care pot modifica date; implicit `toate`. Descoperirea nu execută unealta și nu acordă drepturi.

Urmează `pagination.nextArguments` pentru alte sugestii. Catalogul acoperă numai uneltele permise acum pe conexiunea POS, nu alte servere locale sau firme. Dacă schema nu este în lista aplicației, apelează `ruleaza_tool(nume, argumente)`. La drepturi lipsă verifică `verifica_conexiune`; nu cere automat acces global pentru o citire pe un modul. Dacă versiunea live nu are `tip` sau `offset`, folosește parametrii declarați și reformulează căutarea.

## Paginare fără rânduri pierdute

- Furnizori și rețete: `pagination`. Facturi, comenzi și stoc: `data.pagination`. `limit` implicit 50, respectiv 100 la stoc, maxim 200; `offset` pornește de la 0. Produsele și rapoartele au limite proprii, descrise în ghidul lor.
- Copiază `nextArguments` în apelul aceleiași unelte. Păstrează filtrele și continuă cât timp `hasMore` este adevărat. Nu avansa dacă rândurile paginii curente au fost omise de transport.
- `total` numără toate potrivirile; `returned` numără rândurile paginii. Nu aduna totalul repetat la fiecare pagină. O pagină goală la un offset mare nu dovedește absența datelor.
- Customer 360 folosește `page` (de la 1) și `limit`; alte domenii pot folosi cursor. Urmează schema fiecărei unelte.
- `complete: false`, `dataOmitted`, `dataSummary` sau un mesaj de trunchiere înseamnă că nu ai primit toate detaliile. Urmează `recovery`: de regulă recitești aceeași pagină cu limită mai mică sau filtre precise înainte să avansezi. Nu transforma eroarea ori lipsa accesului în zero.
- La o scriere cu răspuns incomplet, verifică obiectul prin citirea dedicată; nu repeta modificarea pentru textul lipsă. `wasExisting: true` înseamnă că obiectul exista deja și argumentele de creare nu au fost aplicate. Citește `pasiUrmatori` și verifică rezultatul efectiv.

Datele sunt zile calendaristice `YYYY-MM-DD`, inclusiv capetele intervalului. Trimite ambele capete pentru o singură zi. Schema live are prioritate față de limitele sau parametrii dintr-un ghid mai nou ori mai vechi.

## Ce reții în memorie

Ghidurile descriu platforma; memoria de business păstrează preferințe, decizii și fapte durabile. Nu memora „nu există unealta”, „nu avem furnizorul” sau „produsul nu s-a vândut” pe baza unei liste parțiale. O limită confirmată de versiune/acces se datează și se reverifică. Pentru observații păstrează sursa, aria, perioada și starea verificării; actualizează aceeași cheie dacă dovada se schimbă.
