# Finanțe, Facturare & Contabilitate

> Pentru link-ul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul Finanțe acoperă banii afacerii de la sertarul de numerar până la balanța contabilă: registrul de casă legal românesc (cu casierii, file numerotate și sigiliu zilnic), închiderea de zi, rapoartele fiscale Z/X de pe casele de marcat, facturile emise și primite cu e-Factura ANAF, notele contabile generate automat pe conturi configurate per tip de produs, cash flow-ul proiectat, clienții juridici, contractele cu semnare online și plățile publice prin link.

## Concepte

- **Casierie (cash register)** — un „sertar de bani" urmărit legal. Se configurează per firmă, per locație sau per brand×locație, cu sold inițial și monedă. Operațiunile zilnice se fac în Registrul de Casă; configurarea se face de obicei o singură dată. Prin MCP poți crea o casierie punctuală cu `create_cash_register` după confirmarea userului; generarea în masă pe model de organizare rămâne în `/finance/cash-registers`.
- **Registru de casă** — evidența legală a numerarului (în RO conform OMFP 2634/2015). Fiecare zi are sold inițial, intrări, ieșiri, sold final, **filă** (pagină numerotată automat) și, după închidere, **sigiliu SHA-256** care leagă zilele între ele — modificările ulterioare cer redeschidere auditată.
- **Predare de tură** — la închiderea turei, ospătarul predă numerarul; predarea apare ca „mișcare neoperată" și intră în registru când operatorul o „operează" (de regulă la Închiderea de Zi).
- **Plus/minus de casă** — diferența dintre numerarul numărat fizic și cel așteptat în sertar; se sigilează împreună cu ziua și apare pe fila legală. Diferențele repetate sunt primul semnal de erori sau furt.
- **Plafoane de numerar (RO)** — limită zilnică de păstrare 50.000 lei și 10.000 lei per partener; depășirea plafonului per partener blochează închiderea zilei, iar depășirea soldului zilnic e semnalată cu avertisment (excedentul se depune la bancă).
- **Raport Z** — raportul fiscal zilnic OBLIGATORIU de pe casa de marcat (OUG 28/1999). E separat de vânzările din POS și se reconciliază cu ele. Raportul X e informativ, fără închidere fiscală.
- **Bon fiscal ≠ factură** — bonul e tranzacția POS tipărită pe imprimanta fiscală; factura e documentul comercial separat, cu e-Factura opțională.
- **e-Factura ANAF** — conectare OAuth la SPV, generare XML UBL, upload manual sau automat, verificare status (acceptat/respins), urmărirea termenului legal de 5 zile, storno/notă de credit cu referință la original.
- **Serie de facturare** — prefix + număr curent configurabile per brand/locație. Pe serverele locale (offline) fiecare dispozitiv are propria serie, deci facturile se emit și fără internet, fără coliziuni de numere.
- **Note contabile (registru contabil)** — înregistrări debit/credit generate automat: recepția (debit stoc 371/301 + TVA 4426 / credit furnizor 401), vânzarea (4111 / 707 + 4427), pe baza conturilor configurate per tip de produs (OMFP 1802), cu override-uri pe brand/locație/produs. Contul de stoc se derivă din TIPUL produsului (raw_material→301, merchandise→371, consumable→302, packaging→381, service→628) — funcționează chiar dacă brandul are 0 tipuri de produs configurate (mapare implicită pe tipul canonic). Tipurile configurate sunt necesare doar pentru conturi personalizate / override-uri.
- **Conturi pe tip de produs** — fiecare tip de produs (marfă, produs propriu, masă servită etc.) are conturi de venit/stoc/cheltuială configurate în hub-ul „Conturi pe Tip Produs" (/ai-product-types); metodele de plată au și ele cont contabil asociat.
- **Cotele TVA România** — 0 / 11 / 21%; mâncarea preparată e de regulă la 11%, băuturile și alte produse la 21%.
- **Masă servită** — produs vândut fără rețetă cunoscută (ex. meniu de eveniment); costul se stabilește ULTERIOR printr-o fișă de ieșire de tip consum sau dintr-un eveniment legat — NU printr-o factură.
- **Folio (hotel)** — „nota de plată" a unui sejur: adună tranzacții (cazare, consum), se achită la final și se poate transforma în factură de hotel.
- **Perioadă contabilă blocată** — documentele dintr-o perioadă închisă nu se mai pot modifica.

## Paginile modulului

### Operațiuni zilnice cu numerar
- **Registru de Casă** (`/finance/cash-book`) — registrul legal pe zile: alegi casieria și data, vezi sold inițial/intrări/ieșiri/sold final, adaugi Încasare (chitanță), Plată (DPÎ), Depunere/Ridicare bancă sau Transfer între casierii, apoi închizi ziua. Stornarea unei operațiuni creează un rând invers compensator (rândul original rămâne vizibil). Export PDF („Print PDF") și CSV. Alias: `/finance/cash-book/registers` redirecționează la `/finance/cash-registers`.
- **Închidere de Zi** (`/finance/daily-close`) — wizard în 3 pași: (1) Verificare — mese deschise, predări de tură și tranzacții cash neoperate (le bifezi și apeși „Operează"), numărarea fizică a banilor, generarea consumului zilnic, fereastra zilei de business (implicit 00:00 → 06:00 a doua zi, ca să prindă predările de noapte); (2) Sumar vânzări POS — brut/net/TVA pe cote/reduceri/bacșiș + reconciliere cu raportul Z; (3) Închidere — sigilarea zilei în registrul de casă (filă + sigiliu). Are buton de închidere în lot pentru zilele rămase neînchise și „Foaie completă de închidere zi" printabilă.
- **Configurare Casierii** (`/finance/cash-registers`) — pagină de configurare (de obicei o setezi o dată): modul de organizare (Per firmă / Per locație / Per brand × locație), „Regenerează casieriile" după ce adaugi o locație, reguli pe țară (limite legale de numerar), „Rutarea banilor" per casierie. Casieriile goale se pot șterge; cele cu istoric doar se dezactivează.
- **Rapoarte Fiscale Z/X** (`/finance/fiscal-reports`) — 4 tab-uri: Rapoarte Z / X / Periodice (extragere raport direct din casa de marcat sau upload manual XML semnat ANAF), Reconciliere Z ↔ POS (explică diferențele), Căutare bon individual (extragerea bonului de pe casă pentru verificare și tipărire duplicat — cu confirmare obligatorie, fiindcă duplicatul e un bon fiscal nou care incrementează memoria fiscală), Verificare manuală (bonuri cu status incert care cer verificare fizică). În Verificare manuală intră automat bonurile fiscale fără confirmare (legătura cu casa de marcat întreruptă) sau expirate după 24h; operatorul verifică fizic casa/bonul și marchează rezoluția înainte de reemitere sau închidere.

### Imagine financiară & contabilitate
- **Finanțe & Contabilitate** (`/finance`) — pagina-umbrelă cu tab-uri: Sumar, Cash Flow, Cheltuieli & Plăți, Reconciliere Canale (livrări), Control Viva, Control Card GP, Solduri inițiale. Are buton „Ghid" cu pașii primilor pași financiari.
- **Cash Flow** (`/finance/cashflow`, și ca tab în /finance) — proiecția banilor pe zile/săptămâni/luni: Prezentare Generală (grafic + detaliu pe perioadă, sold inițial sugerat), Plăți Programate, Plăți Recurente, Termene Furnizori, Intrări Manuale. Sumele restante (scadențe depășite) apar în ziua de azi cu eticheta „(restant)" — nu dispar din proiecție.
- **Registru Contabil** (`/accounting-ledger`) — toate notele contabile, filtrabile pe brand, perioadă, tip sursă (recepție, consum, vânzări zilnice, stornare, amortizare, pierdere/rebut...), status (Ciornă/Înregistrată/Stornată/Aprobată), cont, locație, produs. Soldurile pe conturi, cu detaliere până la înregistrările din spatele fiecărui cont; export CSV.
- **Import Contabil** (`/accounting-import`) — hub cu 3 tab-uri: Import Contabil (wizard: încarci fișiere .xlsx/.csv/.xls/.mt940/.xml/.json max 50MB, tipul documentului e detectat automat — factură furnizor/client, aviz, retur, raport Z, extras bancar, registru de casă, stat de plată, plan de conturi, solduri inițiale, note contabile, mijloace fixe, decont, parteneri — apoi mapare AI a coloanelor, validare și import), Extrase Bancare și State de Salarii. Are istoric importuri.
- **Mese Servite** (`/finance/served-meals`) — registrul meselor servite: creare manuală, dintr-un eveniment sau dintr-o comandă POS marcată „masă servită"; statusuri Ciornă / Cost de stabilit / Cost stabilit. Costul se stabilește ulterior prin legarea unei fișe de ieșire de tip consum sau a evenimentului asociat — nu printr-o factură.
- **Sold Furnizori** (`/supplier-balances`) — facturi de la furnizori, solduri și plăți restante (scadențar).

### Clienți firme, contracte, plăți publice
- **Clienți Juridici** (`/clients`) — firmele cu care lucrezi: adăugare cu CUI, vizualizare tabel/carduri, statistici per firmă (facturi, cifră de afaceri, sume neîncasate), legarea persoanelor de contact de firmă, sincronizare automată din documentele existente.
- **Contracte** (`/contracts`) — 3 tab-uri: Dashboard (parcursul contractelor de la creare la semnare și plată, trend 30 zile, top șabloane, „Necesită atenție"), Șabloane (cu variabile gen {{numeClient}} completate automat) și Contracte (creare individuală sau în lot, trimitere către semnatari, înlocuire semnatar, previzualizare).
- **Semnare Contract** (`/contract/sign/:token`) — pagină PUBLICĂ pe care clientul o primește prin link: vede contractul completat live cu datele lui pe măsură ce scrie, semnează sau refuză; la mai mulți semnatari vede progresul „X din Y au semnat".
- **Plată Publică** (`/plata/:token`, și `/plata`) — pagină PUBLICĂ de plată prin link (avansuri, depozite de eveniment): clientul vede suma și produsele și plătește cu cardul prin Viva; pagina se actualizează singură și confirmă plata; afișează și stările rambursat / așteptare contract / plăți indisponibile dacă procesatorul nu e configurat.

### Hotel
- **Facturare / Folio** (`/hotel/folios`) — apare doar cu domeniul de activitate hotel: lista folio-urilor (deschise/achitate, sold neachitat), tranzacțiile fiecărui folio cu descompunere TVA, adăugare tranzacție, transfer de tranzacții între folio-uri, achitare și tipărire factură de hotel.

## Fluxuri frecvente

1. **Închizi ziua corect**: /finance/daily-close → Pasul 1: verifică mesele deschise, bifează predările de tură + tranzacțiile cash și apasă „Operează", numără banii și introdu suma (diferența se afișează pe loc), generează consumul zilnic dacă lipsește → Pasul 2: verifică sumarul vânzărilor și că raportul Z bate cu POS-ul → Pasul 3: „Închide ziua" — ziua primește filă și sigiliu.
2. **Înregistrezi o cheltuială plătită cash**: /finance/cash-book → alege casieria și ziua → „Plată (DPÎ)" → completezi suma, descrierea și documentul → apare imediat în ieșirile zilei.
3. **Ai greșit o operațiune de casă**: nu o ștergi — folosești butonul de stornare de pe rând; se creează operațiunea inversă, ziua rămâne corectă net (ca pe formularul legal). Zilele deja închise se redeschid doar de admin/contabil.
4. **Configurezi casieriile prima dată (sau după o locație nouă)**: pentru o singură casierie clară, `list_brands` + `list_locations` → confirmi nume/locație/sold inițial → `create_cash_register(brandId, locationId, name, currency:"RON", openingBalance?)` → verifici cu `list_cash_registers`. Pentru generare în masă: /finance/cash-registers → alegi modul de organizare (firmă / locație / brand×locație) → „Aplică & generează" sau „Regenerează casieriile".
5. **Salvezi raportul Z al zilei**: /finance/fiscal-reports → tab Rapoarte → „Extrage raport din casă" (sau upload manual XML semnat ANAF dacă a fost emis pe casă) → verifici întâi tab-ul **Verificare manuală** pentru bonuri fiscale incerte, apoi tab-ul Reconciliere Z ↔ POS ca să vezi dacă bate cu vânzările.
6. **Emiți factură către o firmă**: factura se emite din bon/comandă, manual, din folio de hotel sau ca storno din retur; cumpărătorul poate fi firmă salvată (căutare ANAF după CUI), firmă ad-hoc fără salvare sau persoană fizică. Anularea unei facturi creează automat factura storno cu sume negative. Pentru e-Factura: conectezi SPV o dată, apoi upload manual sau automat, cu urmărirea termenului de 5 zile. În detaliul unei facturi emise din POS, modalul arată și **Detalii operaționale / Jurnalul notei**: masa, ospătarul, orele deschidere/închidere/plată, plățile, produsele, aprobările și auditul notei; folosește-l când userul întreabă „din ce notă vine factura asta?".
7. **Imporți datele de la contabil**: /accounting-import → tragi fișierele în wizard → tipul e detectat automat → verifici maparea coloanelor → validare → import; istoricul rămâne în tab-ul dedicat.
8. **Contract + avans pentru un eveniment**: /contracts → alegi șablonul → „Contract Nou" cu semnatarii → „Trimite Contract" → clientul semnează pe pagina publică → plătește avansul pe linkul /plata primit; pe pagina de plată vede „Așteptare contract" până semnează.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `get_accounting_overview` — starea contabilă a unui brand: tipuri de produs cu/fără conturi, plan de conturi, înregistrări.
- `get_accounting_status` — ce coduri contabile sunt setate / lipsă pe brand.
- `get_journal_entries_summary` — total debit/credit pe perioadă, per tip sursă, per cont.
- `list_accounting_accounts` — planul de conturi (opțional filtrat pe prefix de cod).
- `list_product_types` / `get_product_type_details` — tipurile de produs cu conturile lor contabile (inclusiv override-uri per unitate).
- `list_vat_rates` — cotele TVA configurate.
- `lookup_company_cui` — date firmă de la ANAF după CUI (le salvează automat în setări).
- `get_accounting_sync_status` — conexiunea cu Symbai Accounting (contabilul extern).
- `raport_vanzari` — încasări, bonuri, defalcare pe metode de plată, comparație cu perioada anterioară.
- `jurnal_activitate` — cine a făcut ce (categorie FINANCE sau Contracte): închideri, stornări, aprobări.
- `generate_report` — raport rapid: sumar vânzări, valoare stoc, food cost.
- `list_entities` — listări rapide (ex. facturi) pe brand.
- `get_fiscal_invoice_details` — detaliul facturii și liniile ei; pentru jurnal operațional complet pe nota POS legată de factură, deschide detaliul facturii în `/finance` sau folosește `get_order_timeline` dacă ai `orderId`.

**SQL (necesită toggle-ul SQL pe token):** `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar SELECT) — pentru întrebări la care rapoartele de mai sus nu ajung.

**Scriere (cer modulul de permisiune `financiar` pe token):**
- `create_expense` — înregistrează o cheltuială (chirie, utilități, reparații) pentru P&L.
- `create_accounting_account` / `update_accounting_account` / `delete_accounting_account` — gestionează planul de conturi: adaugi un cont nou, îl modifici (redenumire, tip, cont părinte, cod, activare/dezactivare) sau îl ștergi. Ștergerea e **sigură**: dacă are sub-conturi refuză; dacă e folosit (înregistrări contabile sau mapat pe tipuri de produs) îl **dezactivează** (îl păstrează pentru istoric) în loc să-l șteargă definitiv; doar conturile nefolosite se șterg de tot.
- `create_product_type` / `update_product_type` — tip de produs cu proprietățile lui (ce se poate face cu el: **VINDE** = `canSell`, **CUMPĂRĂ** de la furnizor = `canPurchase`, **PRODUCE** cu rețetă = `hasRecipe`, are stoc, are preț de recepție etc.) și conturile contabile. Funcționează și pe **tipurile de sistem** predefinite (ex. „Produse reziduale / Deșeuri", „Materii prime") — le poți adăuga/modifica/șterge conturile.
- `update_product_type_accounts_per_unit` — conturile unui tip de produs doar pentru un brand+locație (override).
- `apply_accounting_codes` — aplică coduri contabile în masă pe produse.
- `post_journal_entry` — **notă contabilă liberă** (registru-jurnal GL), partidă-dublă: dai liniile debit/credit pe conturi (`accountId` sau `accountCode` din `list_accounting_accounts`), sistemul validează că nota e **echilibrată** (debit total = credit total), pe conturi active din același plan de conturi, și că perioada nu e închisă. Pentru regularizări, provizioane, amortizare manuală, reclasificări, corecții — orice notă scrisă „de mână". **Implicit salvează CIORNĂ (DRAFT)** pentru revizuire; pune `post:true` ca să o postezi efectiv în registru — ⚠ afectează balanța, deci **doar după ce confirmi cu utilizatorul**. Dacă un cod de cont e ambiguu (global + brand cu același cod), trimite `accountId` explicit. NU înlocuiește documentele operaționale (facturi/bonuri/NIR) care generează note automat.

> Notele contabile de **recepție** (debit stoc + 4426 / credit 401) se generează automat la postarea unui NIR. O recepție DIRECTĂ pe stoc se poate face complet prin MCP cu `create_inventory_document` (docType GOODS_RECEIPT/NIR) + `post_inventory_document` (cer modulul `inventar`). Vezi `intrari-marfa-receptie.md` și skill-ul `receptie-factura-furnizor`. NIR-ul legat de o eFactură existentă se face deocamdată din aplicație.

## Întrebări frecvente și capcane

- **De ce nu pot adăuga operațiuni în registru?** Ziua e închisă (eticheta „Închisă/Sigilată"). Redeschiderea e permisă doar rolurilor de admin/contabil și e auditată.
- **De ce predarea de tură a ospătarului nu apare la închidere?** Predările făcute noaptea după miezul nopții intră în ziua precedentă doar dacă fereastra zilei de business le cuprinde — implicit e 00:00 → 06:00 a doua zi; wizard-ul îți arată și predările din jurul ferestrei (±6h) cu sugestii.
- **Tranzacțiile cash neoperate se înregistrează singure la închidere?** NU. Predările de tură bifate da, dar tranzacțiile cash trebuie „operate" explicit în Pasul 1 — altfel rămân în afara registrului sigilat (wizard-ul te avertizează).
- **De ce nu văd sigiliul SHA-256 pe ziua de azi?** Sigiliul se calculează abia la închiderea zilei — pe zile deschise nu există.
- **„Soldul depășește limita zilnică"** — ai peste plafonul legal de numerar în casierie (RO: 50.000 lei); fă o depunere la bancă din registrul de casă.
- **De ce nu am nicio casierie?** Nu s-au generat încă. Dacă vrea una punctuală, o poți crea prin MCP cu `create_cash_register` după ce confirmă brandul, locația și numele. Dacă vrea schema completă (per firmă/per locație/per brand×locație), mergi la /finance/cash-registers, alege modul de organizare și apasă „Regenerează casieriile" (și după ce adaugi o locație nouă).
- **Bon sau factură?** Bonul fiscal iese pe casa de marcat la plată; factura e document separat (pentru firme, evenimente, hotel) și doar ea intră în e-Factura.
- **De ce am bonuri la Verificare manuală?** Casa de marcat nu a confirmat sigur rezultatul unui bon fiscal (deconectare, timeout, expirare 24h). Nu înseamnă automat că bonul nu s-a tipărit. Verifică fizic bonul/casa și rezolvă rândul înainte de reemitere, ca să eviți bon dublu.
- **Pot șterge o factură greșită?** Nu se șterge — anularea creează automat factura storno cu sume negative și anulează creanțele legate; reversarea anulării e posibilă.
- **De ce nu merge exportul SmartBill / SAGA din Închiderea de Zi?** E anunțat „disponibil în curând" — conectorul se livrează într-o versiune următoare.
- **De ce masa servită nu are cost?** E normal la început: statusul „Cost de stabilit" ține până legi o fișă de ieșire de tip consum sau un eveniment — costul NU vine dintr-o factură.
- **De ce nu se vede pagina Facturare/Folio?** E parte din modulul Hotel — apare doar dacă brandul are domeniul de activitate hotel.
- **Diferență între Z și vânzările POS?** Verifică bonuri neemise, vânzări nefiscalizate sau Z parțial — tab-ul Reconciliere Z ↔ POS din Rapoarte Fiscale explică diferența.

## Pentru acces SQL (doar citire)

Dacă tokenul are activat accesul SQL read-only și rapoartele/tool-urile de mai sus nu ajung: descoperă întâi tabelele cu `list_database_tables`, uită-te la structura lor cu `describe_database_table`, apoi rulează `execute_sql_query` (doar SELECT).

Exemple de întrebări potrivite: „câte zile de casă au rămas deschise luna aceasta per casierie", „facturile emise neîncasate peste scadență", „totalul rulajului pe contul 707 în iunie".
