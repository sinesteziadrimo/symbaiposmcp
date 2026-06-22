# B2B — clienți firmă & comenzi wholesale

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt
Modulul B2B acoperă vânzarea în volum (en-gros) către alte firme: clienți persoane juridice cu CUI și termen de plată negociat, prețuri de contract diferite de cele de retail (per client, per produs, în bucăți sau baxuri), și comenzi wholesale cu dată de livrare programată și depozit de expediere. O comandă B2B trece prin stările `draft → confirmed → picking → dispatched → delivered`, iar facturarea către client se face cu factură fiscală (serie alocată automat, cu TVA pe linie). Se integrează cu stocurile (depozitul din care pleacă marfa), cu producția (dacă marfa trebuie fabricată întâi), cu livrările (flotă proprie sau curier AWB) și cu finanțele (scadență, e-Factura). E construit pentru fabrici de semipreparate, brutării/laboratoare care livrează la alte restaurante, distribuitori și orice afacere care vinde cantități fixe pe contract.

## Concepte
- **Client B2B (firmă)** — persoană juridică cu nume firmă, CUI, persoană de contact, email, telefon, termen de plată în zile (implicit 30) și stare activ/inactiv. CUI-ul se poate completa automat de la ANAF cu tool-ul de căutare CUI.
- **Termen de plată (scadență)** — câte zile are clientul la dispoziție de la **data facturii** (nu de la livrare). Ex.: net 30 = plată în 30 de zile de la emiterea facturii. Se setează pe client (`paymentTermsDays`).
- **Produs contractat (preț negociat)** — același produs poate avea preț diferit per client. Legi produsul de client cu un preț unitar negociat și, opțional, câte bucăți intră într-un bax, SKU-ul clientului și o etichetă de brand pentru el. Fiecare client are catalogul lui de prețuri.
- **Bax vs bucată** — comenzile B2B se pot da pe baxuri (`quantityBax`) sau pe bucăți (`quantityBuc`), iar raportul „bucăți per bax" se ține pe produsul contractat. Util pentru ambalaje en-gros.
- **Comandă B2B (wholesale)** — comandă fermă cu număr propriu, client, depozit de expediere, dată de livrare programată și liniile ei (produs + cantitate + preț). Pornește în starea `draft`.
- **Depozit de expediere** — gestiunea din care pleacă marfa (depozit central, magazie en-gros, laborator) — poate fi alta decât punctul de vânzare. Este **obligatoriu** la crearea comenzii.
- **Profil retail / EDI** — pentru lanțuri mari poți salva pe client/depou cerințe precum GLN buyer/ship-to/ship-from, cod partener EDI, SSCC/ASN obligatoriu, GS1 Company Prefix, standard etichetă și standard DESADV/ASN. Pe produsul contractat salvezi GTIN/EAN, bucăți per carton, cartoane pe strat, straturi pe palet, tip palet și shelf-life minim rămas.
- **Dată de livrare** — ziua planificată de plecare din depozit; diferită de data creării comenzii. Permite planificarea (ex.: comanzi azi, livrezi peste 2 zile, ai timp de producție).
- **Stările comenzii** — `draft` (ciornă) → `confirmed` (confirmată) → `picking` (în pregătire/colectare) → `dispatched` (expediată) → `delivered` (livrată). La fiecare trecere de stare se salvează automat marca de timp.
- **Factură fiscală către client** — documentul de vânzare cu serie+număr alocat automat, cumpărător (firma clientului) și TVA pe fiecare linie; merge la e-Factura ANAF. Scadența = data facturii + termenul de plată al clientului.

## Pagini
- **Comenzi B2B** (`/b2b-orders`) — centrul comenzilor en-gros: clienți firmă, prețuri contractate, comenzi de la ciornă până la livrare, filtrare pe client/stare/dată, statistici și urmărirea fiecărei comenzi pe stări.
- **Clienți** (`/clients`) — administrarea firmelor (date fiscale, contact, IBAN, note); de aici intri în detaliile fiecărui client B2B.
- **Furnizori** (`/suppliers`) — dacă aceeași firmă îți este și furnizor, o ai și aici (modulul B2B trăiește lângă Furnizori).
- **Finanțe & Contabilitate** (`/finance`) — emiterea facturii fiscale către client pe comenzile livrate, scadențe, e-Factura, note de credit pentru retururi.
- **Livrări** (`/deliveries/dispatch`) și **AWB Curieri** (`/ecommerce/awb`) — dacă marfa B2B pleacă cu flotă proprie sau cu curier extern. Detalii în „Livrări și comenzi online".
- **Inventar** (`/inventory`) — verifici disponibilitatea pe depozitul de expediere înainte de a confirma o comandă.

## Fluxuri pas-cu-pas
1. **Adaugi un client B2B nou**: întâi `list_brands` + `list_locations` pentru context; cauți să nu existe deja (`list_b2b_clients`); opțional iei datele firmei de la ANAF după CUI (`lookup_company_cui`); apoi `create_b2b_client` (obligatoriu doar `companyName`; recomandat `taxId`=CUI, `contactPerson`, `contactEmail`, `contactPhone`, `paymentTermsDays`). Confirmi cu `list_b2b_clients`.
2. **Stabilești prețurile de contract**: pentru fiecare produs contractat → `create_b2b_client_product` (`clientId`, `productId`, `unitPrice` negociat; opțional `bucPerBax`, `clientSku`, `brandLabel`). Repeți pentru tot ce ai în contract. Termenul de plată se ține pe client (`update_b2b_client` cu `paymentTermsDays`). Contractul „pe hârtie" (semnătură, clauze, penalități) se administrează din pagina Contracte; prețurile efective rămân în produsele contractate.
3. **Creezi o comandă B2B**: iei `clientId` (`list_b2b_clients`) și depozitul de expediere (`list_warehouses_full`) → `create_b2b_order` cu `orderNumber`, `clientId`, `depotId`, `deliveryDate` și liniile în `items[]` (fiecare linie: `clientProductId`, `productId`, `productName`, `unitPrice`, plus `quantityBax` sau `quantityBuc`). Pentru retail enterprise pune și `customerPoNumber` și `customerLineNo` pe linii. Comanda pornește `draft`. Verifici stocul pe depozit cu `get_stock_levels`.
4. **Confirmi și pregătești**: `update_b2b_order(status: "confirmed")` → când începe colectarea `status: "picking"` → când pleacă din depozit `status: "dispatched"` → la livrare `status: "delivered"`. La fiecare schimbare se notează automat ora. Vezi comenzile în orice etapă cu `list_b2b_orders` (filtrabil pe `clientId`, `status`, `deliveryDate`).
5. **Livrezi marfa**: cu flotă proprie → `/deliveries/dispatch` (asignezi livrator); cu curier extern → `/ecommerce/awb` (generezi AWB, etichetă, tracking) — vezi „Livrări și comenzi online". Pune numărul AWB în observațiile comenzii ca să rămână legătura.
6. **Retail distribution / ASN-SSCC** (doar când clientul cere conformitate retail): rulezi `get_retail_distribution_readiness(orderId)` sau pe `deliveryDate`; dacă e `blocked`, completezi GLN/GTIN, loturi/expirare, paletizare sau GS1 prefix. Apoi `generate_b2b_retail_shipment_plan(orderId)` salvează intern planul WMS/SSCC/ASN. Nu trimite EDI extern; dacă validările trec marchează DESADV `ready_to_send` pentru integrator/portal extern.
7. **Facturezi clientul**: aduni comenzile livrate pe perioadă (`list_b2b_orders(clientId, status: "delivered", deliveryDate: …)`) → emiți factura cu `create_fiscal_invoice` (`seriesId` + `items` cu TVA pe linie) sau din `/finance`. Scadența = data facturii + `paymentTermsDays`. Verifici facturile emise cu `list_fiscal_invoices` și trimiți la ANAF cu `submit_efactura_anaf` (operațiune externă — confirmă întâi). Detalii fiscale în „Finanțe, facturare & contabilitate".

## Tool-uri MCP utile
- **Citire (fără permisiune de modul):** `list_b2b_clients`, `list_b2b_orders`, `list_brands`, `list_locations`, `list_warehouses_full`, `get_stock_levels`, `get_retail_distribution_readiness`, `list_fiscal_invoices` (facturi emise către clienți), `list_invoices` (facturi de la furnizori), `list_awb_shipments`, `jurnal_activitate` (cine a schimbat ce pe comenzi), `lookup_company_cui` (date firmă de la ANAF după CUI).
- **Scriere (modulul «furnizori» pe token):** `create_b2b_client`, `update_b2b_client` (inclusiv GLN/cod EDI/profil retail), `create_b2b_client_product` (inclusiv GTIN/paletizare/shelf-life), `create_b2b_order` (cu liniile în `items[]`), `update_b2b_order` (stare, dată livrare, observații, `customerPoNumber`/`asnNumber`), `generate_b2b_retail_shipment_plan` (salvare internă WMS/SSCC/ASN, fără EDI extern).
- **Facturare (modulul «financiar» pe token):** `create_fiscal_invoice`, `submit_efactura_anaf` (extern — confirmă cu utilizatorul).
- Citire completă e mereu disponibilă. Pentru întrebări pe care rapoartele nu le acoperă, dacă tokenul are toggle SQL: `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar-citire) pe tabelele `b2b_clients`, `b2b_orders`, `b2b_client_products`.
- Permisiunea exactă per tool: vezi `tools-mcp.md`.

## Întrebări frecvente
- **Cum fac preț diferit pentru client A față de client B la același produs?** Fiecare client are catalogul lui: `create_b2b_client_product(clientId, productId, unitPrice)` cu prețul negociat per firmă. La comandă, pui pe linie `clientProductId`-ul potrivit, ca să se ia prețul corect.
- **De ce nu apare comanda imediat în pagină după ce am creat-o?** Interfața are cache; `list_b2b_orders` citește direct din bază și e sursa de adevăr. Reîmprospătează pagina (Ctrl+R) sau reia listarea cu tool-ul.
- **Cine emite factura — automat sau manual?** O emiți tu pe comenzile livrate: aduni cu `list_b2b_orders(status: "delivered", …)` și faci factura cu `create_fiscal_invoice` (sau din `/finance`). Scadența se calculează din termenul de plată al clientului.
- **Pot factura toate comenzile lunii într-o singură factură?** Da — listezi comenzile `delivered` din perioada respectivă și le pui ca linii pe o singură factură fiscală. O factură = mai multe comenzi.
- **Cum urmăresc în ce etapă e o comandă?** `list_b2b_orders(clientId)` îți arată starea (`draft/confirmed/picking/dispatched/delivered`); în pagina `/b2b-orders` le vezi pe stări. Cine și când a schimbat starea → `jurnal_activitate`.
- **Comenzile B2B apar în raportul de vânzări de la POS?** Nu — `raport_vanzari` și rapoartele de POS sunt din vânzările de la masă/casă. Comenzile en-gros sunt modul separat; le numeri și aduni cu `list_b2b_orders`.
- **Client nou — cum completez rapid datele firmei?** `lookup_company_cui(cui)` aduce de la ANAF denumirea și datele fiscale, apoi `create_b2b_client`.
- **Cum anulez o comandă B2B?** Stările disponibile sunt doar `draft → confirmed → picking → dispatched → delivered` (nu există stare „anulată" prin tool). O lași în `draft` și o tratezi ca anulată cu o observație pe comandă (`update_b2b_order` cu `notes`), sau o anulezi din aplicație. Dacă era deja facturată, emiți notă de credit din `/finance`.
- **Comanda en-gros poate merge cu curier (AWB)?** Da. Generezi AWB din `/ecommerce/awb` și pui numărul în observațiile comenzii. Vezi „Livrări și comenzi online".
- **Pot pregăti ASN/DESADV și etichete SSCC pentru retail?** Da, intern: rulezi `get_retail_distribution_readiness`, rezolvi GLN/GTIN/stoc/loturi/paletizare, apoi `generate_b2b_retail_shipment_plan`. Nu spune că sistemul a trimis EDI; transmiterea X12/EDIFACT/AS2/SFTP/VAN rămâne integrare externă.

## Capcane
- **Comandă fără depozit de expediere** — `depotId` e obligatoriu; dacă pui depozitul greșit, marfa pleacă/se scade din gestiunea greșită. Alege depozitul real cu `list_warehouses_full`, nu un bar/kiosk de restaurant.
- **Prețul de retail în loc de cel de contract** — dacă nu legi produsul de client (`create_b2b_client_product`) și nu pui `clientProductId` pe linie, riști să factureze la preț greșit. Întâi catalogul de prețuri per client, apoi comanda.
- **Client duplicat (aceeași firmă de 2 ori)** — sistemul nu detectează singur duplicatele; rapoartele pe client se împart. Caută cu `list_b2b_clients` și verifică după CUI înainte de `create_b2b_client`. Ștergerea de entități se face din aplicație, nu prin această conexiune.
- **Scadența ≠ data livrării** — termenul de plată curge de la data facturii, nu de la livrare. Scrie clar în contract dacă vrei alt model; altfel clientul poate confunda.
- **Confuzie facturi: emise vs primite** — `list_fiscal_invoices` = facturile pe care le emiți tu clienților; `list_invoices` = facturile pe care le primești de la furnizori. Pentru bani de încasat de la clienți B2B, te uiți la cele emise.
- **TVA pe marfă mixtă** — la facturare, TVA se pune pe fiecare linie după tipul produsului (marfă, masă servită, export 0% cu VIES). Verifică tipul fiecărui produs înainte de a emite, ca să nu fie respinsă la ANAF.
- **e-Factura nu se trimite singură** — emiterea facturii și trimiterea la ANAF sunt pași separați; `submit_efactura_anaf` e operațiune externă spre SPV — confirmă cu utilizatorul înainte.
- **Bax vs bucată** — fii consecvent: dacă produsul e contractat pe baxuri (cu `bucPerBax`), pune `quantityBax` pe linie, nu bucăți, altfel cantitatea și valoarea ies greșit.
- **Audit pe schimbări** — cine a mutat data de livrare sau starea comenzii? `jurnal_activitate` (filtrabil pe entitate) îți arată cine, când și ce a schimbat.
