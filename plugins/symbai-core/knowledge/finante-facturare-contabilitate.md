# Finanțe, Facturare & Contabilitate

> Pentru link-ul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul Finanțe acoperă casieriile, evidența numerarului, închiderea automată de zi, rapoartele fiscale X/Z, facturarea, contabilitatea și cash flow-ul. Închiderea zilnică din POS este un raport editabil; documentele fiscale și închiderea perioadei contabile au reguli distincte.

## Concepte

- **Note POS și bonuri fiscale** — numărul notelor finalizate poate include note cu valoare zero și nu este numărul bonurilor fiscale emise. În `get_end_of_day_report`, `noteFinalizate` (alias vechi `bonuriFinalizate`) și `noteCuValoareZero` explică numărul notelor; bonurile se verifică în sursele fiscale pe aceeași casă și perioadă.
- **Depuneri/retrageri la casa de marcat** — `CASH-IN` și `CASH-OUT` sunt mișcări de numerar, excluse din vânzări, și pot exista fără produse sau plăți de vânzare. Erorile lor apar separat de bonurile fiscale cu probleme. Nu înregistra banii încă o dată pentru o eroare de hârtie/conexiune; verifică registrul de casă și rezultatul la aparat. Aceeași sumă pe două operațiuni nu dovedește o dublură. Vezi skill-ul `inchidere-zi-casa` pentru pașii de verificare și compatibilitatea cu răspunsuri mai vechi.

- **Casierie (cash register)** — un „sertar de bani" urmărit legal. Se configurează per firmă, per locație sau per brand×locație, cu sold inițial și monedă. Operațiunile zilnice se fac în Registrul de Casă; configurarea se face de obicei o singură dată. Prin MCP poți crea o casierie punctuală cu `create_cash_register` după confirmarea userului; generarea în masă pe model de organizare rămâne în `/finance/cash-registers`.
- **Registru de casă** — evidența numerarului pe zile, cu sold inițial, intrări, ieșiri și sold final. Zilele închise în POS pot fi corectate cu dreptul corespunzător; nu trebuie tratate ca sigilate definitiv. Modificările păstrează istoricul.
- **Predare de tură** — numerarul predat de ospătar apare în casa provizorie a unității și este preluat în casierie la închiderea automată. Este o predare a încasărilor existente, nu un venit nou. Sursele sosite târziu sunt urmărite pentru recuperare.
- **Verificarea mișcărilor („de verificat")** — o mișcare de casă poate aștepta confirmarea contabilului înainte să conteze. Cât timp e „de verificat" **NU intră în totalurile legale** ale registrului: apare în listă, dar nu mișcă soldul oficial. Contabilul o **confirmă** (de-abia atunci intră în totaluri și se recalculează soldurile zilelor următoare), o **refuză** (rămâne în istoric, fără efect) sau o **șterge definitiv** (doar cât timp e neverificată — ce a intrat deja în totaluri se corectează prin stornare, nu prin ștergere). De aici vine cea mai frecventă nedumerire: „soldul din aplicație e mai mic decât banii din sertar" — sunt mișcări neconfirmate. Fiecare casierie are o bifă, **„vezi și tranzacțiile neverificate"**, care decide dacă totalurile afișate le includ sau nu.
- **Metodă de plată** — cum au intrat banii (numerar, card, bancă, firmă pe factură, platformă de livrare). Ce contează la configurare: dacă **deschide sertarul** (adică e numerar și trebuie să știi în ce casierie intră), dacă **cere confirmarea terminalului** (se procesează în POS, nu se marchează manual), dacă e **la termen** (nu încasează acum, creează o creanță) și **pe ce unități** e activă (fiecare metodă se activează per brand × locație, ca ospătarul să vadă doar ce e relevant la tejgheaua lui).
- **Plată la termen / creanță** — vânzarea pe care clientul o achită mai târziu (firme, evenimente). Nota se închide, dar banii rămân de încasat: creanța apare în Plăți la Termen cu scadență, iar când clientul plătește o **încasezi** alegând metoda reală prin care au venit banii. Dacă metoda e cu numerar, alegi și casieria în care intră; poți marca încasarea ca neverificată, și atunci ajunge în coada contabilului.
- **Plus/minus de casă** — diferența dintre suma numărată și numerarul așteptat, inclusiv mișcările neconfirmate din zilele anterioare. Numărarea este opțională; lipsa ei este semnalată. Zero înseamnă o numărare reală a unui sertar gol. Investighează documentele și predările, fără a presupune cauza din mărimea diferenței.
- **Plafoane de numerar** — regulile și avertismentele sunt vizibile în configurarea casieriei și în raport. Închiderea zilnică POS nu blochează raportarea unei zile cu probleme; obligațiile fiscale/contabile se verifică separat.
- **Raport Z** — raportul fiscal zilnic OBLIGATORIU de pe casa de marcat (OUG 28/1999). E separat de vânzările din POS și se reconciliază cu ele. Raportul X e informativ, fără închidere fiscală.
- **Bon fiscal ≠ factură** — bonul e tranzacția POS tipărită pe imprimanta fiscală; factura e documentul comercial separat, cu e-Factura opțională.
- **e-Factura ANAF** — conectare OAuth la SPV, generare XML UBL, upload manual sau automat, verificare status (acceptat/respins), urmărirea termenului legal de 5 zile, storno/notă de credit cu referință la original.
- **Serie de facturare** — prefix + număr curent configurabile per brand/locație. Pe serverele locale (offline) fiecare dispozitiv are propria serie, deci facturile se emit și fără internet, fără coliziuni de numere.
- **Note contabile (registru contabil)** — înregistrări debit/credit generate automat: recepția (debit stoc 371/301 + TVA 4426 / credit furnizor 401), vânzarea (4111 / 707 + 4427), pe baza conturilor configurate per tip de produs (OMFP 1802), cu override-uri pe brand/locație/produs. Contul de stoc se derivă din TIPUL produsului (raw_material→301, merchandise→371, consumable→302, packaging→381, service→628) — funcționează chiar dacă brandul are 0 tipuri de produs configurate (mapare implicită pe tipul canonic). Tipurile configurate sunt necesare doar pentru conturi personalizate / override-uri. ⚠ **Contul ales pe linia unei facturi de furnizor NU schimbă nota contabilă la marfa care intră pe stoc** — nota se face din **tipul produsului** (plus conturile personalizate pe tip/unitate, dacă există). Contul pus pe linie se vede în ecranul de mapare și în rapoarte, dar decide nota doar la **liniile de cheltuială** (servicii, utilități, transport) și la facturile pur contabile. Deci dacă nota iese pe cont greșit, repari **tipul produsului**, nu contul de pe linie — vezi `mapare-si-reconversie-facturi.md`. Pentru configurarea efectivă a conturilor pe tip (momente, conturi diferite pe branduri/locații fără a dubla tipul, unificarea tipurilor dublate, naturile de cheltuială) → `tipuri-produs-conturi.md`.
- **Conturi pe tip de produs** — fiecare tip de produs (marfă, produs propriu, masă servită etc.) are conturi de venit/stoc/cheltuială configurate în hub-ul „Conturi pe Tip Produs" (/ai-product-types); metodele de plată au și ele cont contabil asociat.
- **Semaforul tipului de produs** — este un diagnostic contextual, nu o listă universală de conturi obligatorii. Se evaluează după capabilitățile tipului: cumpărare, stoc, producție, consum și vânzare. Vânzarea POS poate posta venitul și TVA-ul global, deci lipsa 707/4427 pe un tip nu este automat defect. Nu adăuga conturi doar pentru culoarea cardului; citește avertismentul exact și verifică o notă reprezentativă.
- **Cotele TVA România** — 0 / 11 / 21%; mâncarea preparată e de regulă la 11%, băuturile și alte produse la 21%.
- **Masă servită** — produs vândut fără rețetă cunoscută (ex. meniu de eveniment); costul se stabilește ULTERIOR printr-o fișă de ieșire de tip consum sau dintr-un eveniment legat — NU printr-o factură.
- **Folio (hotel)** — „nota de plată" a unui sejur: adună tranzacții (cazare, consum), se achită la final și se poate transforma în factură de hotel.
- **Perioadă contabilă blocată** — documentele dintr-o perioadă închisă nu se mai pot modifica.

## Paginile modulului

### Operațiuni zilnice cu numerar
- **Registru de Casă** (`/finance/cash-book`) — registrul legal pe zile: alegi casieria și data, vezi sold inițial/intrări/ieșiri/sold final, adaugi Încasare (chitanță), Plată (DPÎ), Depunere/Ridicare bancă sau Transfer între casierii, apoi închizi ziua. Stornarea unei operațiuni creează un rând invers compensator (rândul original rămâne vizibil). Export PDF („Print PDF") și CSV. Alias: `/finance/cash-book/registers` redirecționează la `/finance/cash-registers`.
- **Închidere de Zi** (`/finance/daily-close`) — casa provizorie, verificările și istoricul închiderilor automate/manuale. Automatizarea este ON implicit, la sfârșitul zilei de lucru; în **Setări → Localizare** se alege ora per unitate sau se oprește. Programul 06:00–06:00 închide ziua la 06:00 a doua zi, ora României. Ora aleasă pentru execuție nu schimbă intervalul fiscal. Numărarea, observația și intervalul pot fi corectate ulterior, cu motiv și verificarea versiunii. Rămâne vizibil că ziua a fost închisă automat. Verifică separat vânzările, consumul și Z-ul; un raport închis cu avertismente nu dovedește că toate controalele au trecut.
- **Configurare Casierii** (`/finance/cash-registers`) — pagină de configurare (de obicei o setezi o dată): modul de organizare (Per firmă / Per locație / Per brand × locație), „Regenerează casieriile" după ce adaugi o locație, reguli pe țară (limite legale de numerar), „Rutarea banilor" per casierie. La editarea unei casierii alegi și dacă totalurile afișate includ **tranzacțiile neverificate**. Casieriile goale se pot șterge; cele cu istoric doar se dezactivează.
- **Verificare Casă** (`/finance/cash-verification`) — coada contabilului: mișcările care așteaptă confirmare. Le confirmi (intră în totalurile legale), le refuzi (rămân în istoric, fără efect pe solduri) sau le ștergi definitiv cât timp sunt încă neverificate. Filtrare pe casierie și perioadă.
- **Plăți la Termen** (`/finance/term-payments`) — creanțele: cine îți datorează bani, cât și până când. De aici **încasezi**: alegi metoda reală prin care au venit banii, iar dacă e o metodă cu numerar alegi și casieria în care intră; poți bifa dacă încasarea e verificată sau merge în coada de verificare. „Bancă (OP)" e metoda pentru viramente și se poate confirma direct din extrasul bancar — adică extrasul închide creanțe.
- **Rapoarte Fiscale Z/X** (`/finance/fiscal-reports`) — 4 tab-uri: Rapoarte Z / X / Periodice (extragere raport direct din casa de marcat sau upload manual XML semnat ANAF), Reconciliere Z ↔ POS (explică diferențele), Căutare bon individual (extragerea bonului de pe casă pentru verificare și tipărire duplicat — cu confirmare obligatorie, fiindcă duplicatul e un bon fiscal nou care incrementează memoria fiscală), Verificare manuală (bonuri cu status incert care cer verificare fizică). În Verificare manuală intră automat bonurile fiscale fără confirmare (legătura cu casa de marcat întreruptă) sau expirate după 24h; operatorul verifică fizic casa/bonul și marchează rezoluția înainte de reemitere sau închidere. Extragerea raportului Z se poate și programa (auto-pull automat la oră fixă) și poți primi zilnic un email fiscal cu raportul — ambele din Setări.
- **Bacșișuri** (Finanțe → Bacșișuri) — borderoul de bacșiș: raport per ospătar pe zile și plata bacșișului cu borderou PDF cu semnături (Legea 376/2022). Protecție anti-dublă-plată pe aceeași perioadă (nu poți plăti de două ori aceleași zile); ștergerea unui borderou stornează automat ieșirea din registrul de casă.
- **Rapoarte pe închideri** (Setări → Rapoarte pe închideri) — personalizezi secțiunile care apar pe bonul de predare de tură și pe foaia de sfârșit de zi: grupări pe produs / categorie / etichetă / canal / oră etc., plus defalcare per angajat.

### Imagine financiară & contabilitate
- **Finanțe & Contabilitate** (`/finance`) — pagina-umbrelă cu tab-uri: Sumar, Cash Flow, Cheltuieli & Plăți, Reconciliere Canale (livrări), Control Viva, Control Card GP, Solduri inițiale, **Balanță inițială**, **Stoc inițial**. Are buton „Ghid" cu pașii primilor pași financiari.
- **Balanță inițială** (`/finance?tab=trial-balance`) și **Stoc inițial** (`/finance?tab=opening-stock`) — deschiderea firmei când o aduci din alt program: soldurile pe conturi (produc nota contabilă de deschidere) și, separat, cantitățile de pe raft (care **NU** produc note contabile — valoarea lor e deja pe conturile de clasa 3 ale balanței). Lunile și cine ține balanța se aleg în Setări → Contabilitate. Detalii complete: `deschidere-solduri-stoc-initial.md`, skill `deschide-firma`.
- **Cash Flow** (`/finance/cashflow`, și ca tab în /finance) — proiecția banilor pe zile/săptămâni/luni: Prezentare Generală (grafic + detaliu pe perioadă, sold inițial sugerat), Plăți Programate, Plăți Recurente, Termene Furnizori, Intrări Manuale. Sumele restante (scadențe depășite) apar în ziua de azi cu eticheta „(restant)" — nu dispar din proiecție.
- **Registru Contabil** (`/accounting-ledger`) — toate notele contabile, filtrabile pe brand, perioadă, tip sursă (recepție, consum, vânzări zilnice, stornare, amortizare, pierdere/rebut...), status (Ciornă/Înregistrată/Stornată/Aprobată), cont, locație, produs. Soldurile pe conturi, cu detaliere până la înregistrările din spatele fiecărui cont; export CSV.
- **Import Contabil** (`/accounting-import`) — hub cu 3 tab-uri: Import Contabil (wizard: încarci fișiere .xlsx/.csv/.xls/.mt940/.xml/.json max 50MB, tipul documentului e detectat automat — factură furnizor/client, aviz, retur, raport Z, extras bancar, registru de casă, stat de plată, plan de conturi, solduri inițiale, note contabile, mijloace fixe, decont, parteneri — apoi mapare AI a coloanelor, validare și import), Extrase Bancare și State de Salarii. Are istoric importuri.

#### Extrase bancare — ce se leagă singur și ce rămâne de confirmat
Încarci fișierul primit din internet banking (Extrase Bancare din `/accounting-import`). Merg fișierele MT940/SWIFT pe care le dau băncile din România — Banca Transilvania, BRD, UniCredit, BCR, ING, Raiffeisen, CEC și celelalte — plus CSV/Excel, CAMT și OFX. Banca și contul se recunosc din fișier; nu trebuie să le alegi tu.

Ce face aplicația singură pentru fiecare linie din extras:
- **Recunoaște partenerul** după IBAN sau CUI — chiar dacă banca scrie contul lipit de alte coduri în descriere. Dacă IBAN-ul sau CUI-ul e deja pe fișa furnizorului, plata se leagă automat de el; dacă se potrivește și numărul facturii și suma rămasă, se leagă direct de factură.
- **Separă ce nu e plată de furnizor**: comisioane și taxe bancare, dobânzi, rate de credit, salarii, schimb valutar, depuneri și ridicări de numerar, decontări de card, transferuri între conturile tale. Acestea au flux contabil propriu și nu îți mai apar ca „de mapat".
- **Plățile la buget** (IBAN de Trezorerie) sunt marcate ca obligații bugetare, nu ca furnizor nou.
- **Nu inventează parteneri**: dacă extrasul dă un IBAN sau CUI care nu există la niciun partener, linia rămâne de confirmat. La fel dacă aceeași dovadă duce la doi parteneri diferiți — se corectează întâi fișele.

Ce rămâne, în mod normal, de rezolvat manual: plățile unde banca nu a trimis nici IBAN, nici CUI, nici nume (rar), partenerii care încă nu au IBAN-ul completat pe fișă, și încasările de la clienți pe care vrei să le pui pe o anumită factură.

**Ca să scadă excepțiile:** completează IBAN-ul și CUI-ul pe fișele furnizorilor cu care lucrezi des — acestea sunt dovezile după care se face legarea automată. Un furnizor cu IBAN completat se leagă singur de la prima plată.

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

1. **Verifici închiderea automată**: `get_cash_day_automation_settings` → `list_cash_day_closures` → `audit_cash_book_day`; vezi sursele încă nepreluate cu `get_cash_provisional_drawers`. Verifică separat vânzările, consumul și Z-ul. Pentru numărare/observație/interval folosește `correct_cash_book_day`, cu previzualizare, motiv și versiune; citește după salvare.
2. **Înregistrezi o cheltuială plătită cash**: /finance/cash-book → alege casieria și ziua → „Plată (DPÎ)" → completezi suma, descrierea și documentul → apare imediat în ieșirile zilei.
3. **Ai greșit o operațiune de casă**: folosește sursa și instrumentul de corecție potrivit. Stornarea păstrează originalul și rândul compensator. Faptul că raportul zilei este închis nu impune singur o redeschidere; drepturile și regulile documentelor/perioadelor contabile rămân distincte.
4. **Configurezi casieriile prima dată (sau după o locație nouă)**: pentru o singură casierie clară, `list_brands` + `list_locations` → confirmi nume/locație/sold inițial → `create_cash_register(brandId, locationId, name, currency:"RON", openingBalance?)` → verifici cu `list_cash_registers`. Pentru generare în masă: /finance/cash-registers → alegi modul de organizare (firmă / locație / brand×locație) → „Aplică & generează" sau „Regenerează casieriile".
5. **Ai rămas cu zile neînchise**: citește istoricul și erorile automatizării. Pentru închidere manuală în lot: `list_open_cash_days` → `bulk_close_cash_days(registerId, dates, preview:true)` → execută în baza cererii autorizate. Sursele se operează separat cu `operate_cash_pending_operations`, cu dreptul aferent; în lot trimite `operatePending:false`. Ordinea cronologică este automată, iar zilele deja închise sunt sărite.
6. **Soldul din aplicație nu bate cu banii din sertar**: `list_cash_verification_queue` — cel mai des sunt mișcări „de verificat", care nu intră în totalurile legale. Le arăți omului, apoi `verify_cash_book_entry` pe cele bune și `reject_cash_book_entry` (cu motiv) pe cele greșite. Dacă vrea ca totalurile să le includă oricum, îi setezi bifa pe casierie cu `update_cash_register(showUnverifiedInTotals: true)`.
7. **Încasezi o creanță (plată la termen)**: `list_term_payments` ca să vezi ce e deschis și restant → în `/finance/term-payments` apeși „Încasează" pe linia respectivă → alegi **metoda reală prin care au venit banii** (toate metodele din Setări care pot stinge o creanță sunt disponibile) → dacă metoda e cu numerar, alegi și **casieria** în care intră → bifezi dacă încasarea e verificată sau merge în coada contabilului. Pentru viramente alegi „Bancă (OP)", care se poate confirma și direct din extrasul bancar.
8. **Ospătarul nu vede o metodă de plată la casa lui**: metoda e activată pe alt brand × locație. `set_payment_method_unit_visibility` pentru unitatea lui. (La încasarea creanțelor în back-office restricția asta nu se aplică — acolo se consemnează cum au venit banii, nu se tastează un tender.)
9. **Salvezi raportul Z al zilei**: /finance/fiscal-reports → tab Rapoarte → „Extrage raport din casă" (sau upload manual XML semnat ANAF dacă a fost emis pe casă) → verifici întâi tab-ul **Verificare manuală** pentru bonuri fiscale incerte, apoi tab-ul Reconciliere Z ↔ POS ca să vezi dacă bate cu vânzările.
10. **Emiți factură către o firmă**: factura se emite din bon/comandă, manual, din folio de hotel sau ca storno din retur; cumpărătorul poate fi firmă salvată (căutare ANAF după CUI), firmă ad-hoc fără salvare sau persoană fizică. Anularea unei facturi creează automat factura storno cu sume negative. Pentru e-Factura: conectezi SPV o dată, apoi upload manual sau automat, cu urmărirea termenului de 5 zile. În detaliul unei facturi emise din POS, modalul arată și **Detalii operaționale / Jurnalul notei**: masa, ospătarul, orele deschidere/închidere/plată, plățile, produsele, aprobările și auditul notei; folosește-l când userul întreabă „din ce notă vine factura asta?".
11. **Imporți datele de la contabil**: /accounting-import → tragi fișierele în wizard → tipul e detectat automat → verifici maparea coloanelor → validare → import; istoricul rămâne în tab-ul dedicat.
12. **Contract + avans pentru un eveniment**: /contracts → alegi șablonul → „Contract Nou" cu semnatarii → „Trimite Contract" → clientul semnează pe pagina publică → plătește avansul pe linkul /plata primit; pe pagina de plată vede „Așteptare contract" până semnează.

## Tool-uri MCP utile

**Citire (read-only; cere grantul `readModule` al domeniului pe token):**
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

**Citire — registru de casă, creanțe, bancă:**
- `list_cash_registers` / `get_cash_register_balance` — casieriile și soldul lor.
- `list_cash_book_entries` / `get_cash_book_day` — mișcările unei zile și starea ei.
- `get_cash_register_closure_status` — ce te-ar împiedica să închizi ziua.
- `list_cash_pending_operations` — predările de tură și tranzacțiile cash netrecute încă în registru.
- `list_cash_verification_queue` — mișcările care așteaptă confirmarea contabilului. Prima oprire când soldul „nu bate".
- `list_open_cash_days` — câte zile au rămas deschise, grupate pe casierie.
- `list_term_payments` / `get_invoice_receivables_summary` — creanțele deschise și cât e restant.
- `list_bank_transactions` / `list_bank_imports` — extrasele încărcate.
- `suggest_bank_transaction_documents` — ce document s-ar potrivi cu o linie din extras.
- `get_bank_reconciliation_coverage` — cât din extras e reconciliat.

**Scriere (cer modulul de permisiune `financiar` pe token):**

*Casierii și registru de casă:*
- `create_cash_register` — creează o casierie pe brand + locație (entitate financiar/legală — confirmă întâi).
- `update_cash_register` — modifică o casierie existentă: nume, cod, notă, activă/inactivă și bifa **„vezi și tranzacțiile neverificate"**. Soldul inițial NU se modifică de aici (ar deplasa tot lanțul de solduri fără urmă) — pentru corecții de sold folosește o mișcare de casă, care rămâne vizibilă.
- `create_cash_book_entry` — încasare, plată, depunere/ridicare bancă.
- `transfer_between_cash_registers` — mută numerar între casierii (ex. casă → seif).
- `void_cash_book_entry` — **stornare**: creează operațiunea inversă, rândul original rămâne. Așa se corectează ce a intrat deja în totalurile legale.
- `operate_cash_pending_operations` — trece în registru predările de tură și tranzacțiile cash ale unei zile („Operează").
- `close_cash_book_day` — închide o zi (rulează întâi cu `preview: true`).
- `bulk_close_cash_days` — închide **multe zile dintr-un foc** pe o casierie, cu aceleași opțiuni: răspunsul la „închide-mi toate lunile neînchise". Închiderea e cronologică (soldul final al unei zile e soldul inițial al următoarei), zilele deja închise sunt sărite ca să nu se piardă numărătoarea fizică, și are `preview`. Maximum 400 de zile pe apel, o casierie per apel. Cu `operatePending: true` se scriu linii NOI în registru, deci apelul e refuzat dacă vreuna din luni e închisă de contabilitate — atunci fie închizi zilele fără `operatePending` (se închid cu mișcările rămase afară), fie trimiți doar zilele din perioade deschise.
- `reopen_cash_book_day` — redeschide o zi ca să corectezi ceva; motivul e obligatoriu și rămâne în istoric.

*Verificarea mișcărilor:*
- `verify_cash_book_entry` — confirmă o mișcare: de-abia acum intră în totalurile legale.
- `reject_cash_book_entry` — refuz motivat; rămâne în istoric, fără efect pe solduri.
- `delete_cash_book_entry` 🔒 — ștergere DEFINITIVĂ, doar pe mișcări neverificate. Fără `confirm: true` primești doar previzualizarea a ce ar dispărea.

*Reconciliere bancară:*
- `confirm_bank_match` — leagă o mișcare de casă de o linie din extras. Legătura e unu-la-unu: dacă vreun capăt e deja legat, apelul e refuzat.
- `unmatch_bank_match` — desface o legătură greșită.

*Metode de plată (modulul `setari`):*
- `create_payment_method` / `update_payment_method` — adaugă sau modifică o metodă: dacă deschide sertarul, dacă cere confirmarea terminalului, dacă e la termen, contul contabil, ordinea în listă, activă/inactivă.
- `set_payment_method_unit_visibility` — pe ce brand × locație e activă metoda. Aici se rezolvă „ospătarul nu vede metoda X la casa lui".

*Alte scrieri financiare:*
- `create_expense` — înregistrează o cheltuială (chirie, utilități, reparații) pentru P&L.
- `create_accounting_account` / `update_accounting_account` / `delete_accounting_account` — gestionează planul de conturi: adaugi un cont nou, îl modifici (redenumire, tip, cont părinte, cod, activare/dezactivare) sau îl ștergi. Ștergerea e **sigură**: dacă are sub-conturi refuză; dacă e folosit (înregistrări contabile sau mapat pe tipuri de produs) îl **dezactivează** (îl păstrează pentru istoric) în loc să-l șteargă definitiv; doar conturile nefolosite se șterg de tot.
- `create_product_type` / `update_product_type` — tip de produs cu proprietățile lui (ce se poate face cu el: **VINDE** = `canSell`, **CUMPĂRĂ** de la furnizor = `canPurchase`, **PRODUCE** cu rețetă = `hasRecipe`, are stoc, are preț de recepție etc.) și conturile contabile. Funcționează și pe **tipurile de sistem** predefinite (ex. „Produse reziduale / Deșeuri", „Materii prime") — le poți adăuga/modifica/șterge conturile.
- `update_product_type_accounts_per_unit` — conturile unui tip de produs doar pentru un brand+locație (override).
- `apply_accounting_codes` — aplică coduri contabile în masă pe produse.
- `post_journal_entry` — **notă contabilă liberă** (registru-jurnal GL), partidă-dublă: dai liniile debit/credit pe conturi (`accountId` sau `accountCode` din `list_accounting_accounts`), sistemul validează că nota e **echilibrată** (debit total = credit total), pe conturi active din același plan de conturi, și că perioada nu e închisă. Pentru regularizări, provizioane, amortizare manuală, reclasificări, corecții — orice notă scrisă „de mână". **Implicit salvează CIORNĂ (DRAFT)** pentru revizuire; pune `post:true` ca să o postezi efectiv în registru — ⚠ afectează balanța, deci **doar după ce confirmi cu utilizatorul**. Dacă un cod de cont e ambiguu (global + brand cu același cod), trimite `accountId` explicit. NU înlocuiește documentele operaționale (facturi/bonuri/NIR) care generează note automat.

> Notele contabile de **recepție** (debit stoc + 4426 / credit 401) se generează la postarea unui NIR evaluat, după verificarea facturii. O recepție DIRECTĂ pe stoc se poate face complet prin MCP cu `create_inventory_document` (docType GOODS_RECEIPT/NIR) + `post_inventory_document` (cer modulul `inventar`). Pentru o eFactură existentă folosește `create_nir_from_invoice`, ca recepția să rămână legată de factură și să nu dublezi intrarea. Vezi `intrari-marfa-receptie.md` și skill-ul `receptie-factura-furnizor`, inclusiv diferența dintre gestiunea principală și gestiunile efective ale produselor. Recepția din poză poate rămâne fizică, cu evaluarea în așteptare: verifică `get_reception_accounting_status` și finalizează factura verificată prin `finalize_received_invoice` când este necesar.

## Întrebări frecvente și capcane

- **De ce nu pot adăuga operațiuni în registru?** Verifică refuzul exact: dreptul utilizatorului, sursa operațiunii și perioada contabilă. Simpla închidere a zilei POS nu interzice generic orice operațiune de registru; nu cere redeschidere doar pe baza acelei etichete.
- **De ce predarea de tură a ospătarului nu apare la închidere?** Predările intră în ziua de business doar dacă fereastra zilei le cuprinde — implicit fereastra pornește de la ora de start a organizației și acoperă 24h (ex. 06:00 → 06:00 a doua zi); wizard-ul îți arată și predările din jurul ferestrei (±6h) cu sugestii. Capcană: o fereastră setată „00:00 → 06:00" înseamnă doar 6 ORE (00:00–06:00), nu „de la miezul nopții până a doua zi" — predările de seară rămân pe dinafară.
- **Numerarul este preluat automat?** Da, automatizarea urmărește predările și sursele cash eligibile. Casa provizorie arată ce mai așteaptă preluarea. O rutare lipsă sau o sursă incompletă apare ca problemă de remediat, nu ca încasare zero.
- **Ziua este închisă: o mai pot corecta?** Da. Raportul POS este editabil, iar corecția păstrează motivul și proveniența automată. Documentele fiscale și perioada contabilă au fluxuri distincte.
- **Soldul din aplicație e mai mic decât banii din sertar.** Cel mai des sunt mișcări „de verificat", care nu intră în totalurile legale până le confirmă contabilul. Verifică `/finance/cash-verification`. Dacă vrei ca totalurile afișate să le includă oricum, bifează „vezi și tranzacțiile neverificate" pe casieria respectivă.
- **Pot șterge o mișcare de casă greșită?** Doar cât timp e **neverificată** — atunci dispare complet, ca și cum n-ar fi existat, iar soldurile zilelor următoare se recalculează. Odată confirmată, mișcarea a intrat în totalurile legale și se corectează **prin stornare**, nu prin ștergere: registrul de casă nu rescrie liniile documentate, le compensează.
- **Închid zile una câte una de luni întregi.** Există închidere în masă: alegi casieria, zilele și aceleași opțiuni pentru toate. Se închid în ordine cronologică (soldul final al unei zile e soldul inițial al următoarei), iar zilele deja închise sunt sărite, ca numărătoarea fizică făcută atunci să nu se piardă.
- **La încasarea unei creanțe nu-mi apare nicio metodă de plată / apare doar banca.** Metodele care pot stinge o creanță sunt cele active care nu sunt ele însele „la termen" și nu cer confirmarea unui terminal. Nu sunt filtrate pe unitatea notei: încasarea se consemnează în back-office, uneori luni mai târziu, deci contează cum au venit banii în realitate, nu ce butoane are ospătarul la tejghea. Dacă totuși lista e goală, în Setări → Metode de plată nu există nicio metodă activă potrivită.
- **De ce nu pot încasa o creanță cu „Trece pe cameră" sau cu o metodă de cartelă?** Pentru că acelea nu aduc bani: room-charge mută nota pe folio-ul camerei (se încasează la check-out), iar cartela scade dintr-un portofel deja alimentat. Folosite la o creanță, ar închide-o fără ca banii să existe. Alege metoda prin care au intrat efectiv banii.
- **De ce nu pot încasa creanța cu chiar metoda care a creat-o?** Pentru că aia e promisiunea de plată, nu plata. Dacă nota a fost lăsată pe „Termen", creanța se stinge cu metoda prin care au venit banii — numerar, card, Bancă (OP). Poate apărea și după ce debifezi „plată la termen" pe o metodă în Setări: creanțele făcute înainte rămân, iar metoda redevine vizibilă în listă.
- **De ce nu-mi apare o metodă pe care sigur o am?** Dacă ai două rânduri cu același cod ȘI același nume (rămase dintr-o configurare mai veche pe branduri), în listă apare unul singur — altfel ar fi două opțiuni identice, imposibil de deosebit. Metodele cu nume diferite apar toate.
- **Am ales o metodă cu numerar dar nu mă întreabă în ce casierie intră.** Metoda nu e marcată ca „deschide sertarul". Corectează-i setarea în Setări → Metode de plată; abia atunci încasarea cere casieria și intră în registrul de casă.
- **O linie din extras nu se leagă de mișcarea de casă.** Legătura e unu-la-unu: dacă linia bancară sau mișcarea de casă e deja legată de altceva, potrivirea e refuzată. Desfă întâi legătura greșită, apoi refă-o corect.
- **„Soldul depășește limita zilnică"** — ai peste plafonul legal de numerar în casierie (RO: 50.000 lei); fă o depunere la bancă din registrul de casă.
- **De ce nu am nicio casierie?** Nu s-au generat încă. Dacă vrea una punctuală, o poți crea prin MCP cu `create_cash_register` după ce confirmă brandul, locația și numele. Dacă vrea schema completă (per firmă/per locație/per brand×locație), mergi la /finance/cash-registers, alege modul de organizare și apasă „Regenerează casieriile" (și după ce adaugi o locație nouă).
- **Bon sau factură?** Bonul fiscal iese pe casa de marcat la plată; factura e document separat (pentru firme, evenimente, hotel) și doar ea intră în e-Factura.
- **De ce am bonuri la Verificare manuală?** Casa de marcat nu a confirmat sigur rezultatul unui bon fiscal (deconectare, timeout, expirare 24h). Nu înseamnă automat că bonul nu s-a tipărit. Verifică fizic bonul/casa și rezolvă rândul înainte de reemitere, ca să eviți bon dublu.
- **Pot șterge o factură greșită?** Nu se șterge — anularea creează automat factura storno cu sume negative și anulează creanțele legate; reversarea anulării e posibilă.
- **De ce nu merge exportul SmartBill / SAGA din Închiderea de Zi?** E anunțat „disponibil în curând" — conectorul se livrează într-o versiune următoare.
- **De ce masa servită nu are cost?** E normal la început: statusul „Cost de stabilit" ține până legi o fișă de ieșire de tip consum sau un eveniment — costul NU vine dintr-o factură.
- **Raportul financiar arată 0 după o eroare de sursă. Este zero real?** Nu presupune asta. O sursă indisponibilă sau o configurație P&L incompletă trebuie tratată ca eroare/blocaj, nu ca valoare zero. Recitește mesajul detaliat, verifică sursele și configurația raportului, apoi rulează din nou; nu lua decizii pe un „0" obținut prin fallback.
- **De ce nu se vede pagina Facturare/Folio?** E parte din modulul Hotel — apare doar dacă brandul are domeniul de activitate hotel.
- **Diferență între Z și vânzările POS?** Verifică bonuri neemise, vânzări nefiscalizate sau Z parțial — tab-ul Reconciliere Z ↔ POS din Rapoarte Fiscale explică diferența.
- **Am cerut Z și apare „în coadă / verificare necesară", dar nu am fișier de extras.** Unele drivere pot doar trimite comanda către casa fiscală și tipări fizic raportul, fără să întoarcă un document electronic. Asta nu dovedește o eroare de conexiune. Verifică raportul tipărit pe casă și marchează rezultatul din fluxul „Verificare Z"; nu retrimite comanda orbește, fiindcă poți genera o operațiune fiscală duplicată.

## Pentru acces SQL (doar citire)

Dacă tokenul are activat accesul SQL read-only și rapoartele/tool-urile de mai sus nu ajung: descoperă întâi tabelele cu `list_database_tables`, uită-te la structura lor cu `describe_database_table`, apoi rulează `execute_sql_query` (doar SELECT).

Exemple de întrebări potrivite: „câte zile de casă au rămas deschise luna aceasta per casierie", „facturile emise neîncasate peste scadență", „totalul rulajului pe contul 707 în iunie".
