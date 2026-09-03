---
name: receptie-factura-furnizor
description: Facturi de la furnizori și intrări de marfă — recepție pe stoc prin MCP (NIR + note contabile), maparea liniilor eFactură la produse + conturi, factor de pachet, tip produs, magazie, deductibilitate, reconciliere aviz/poză ↔ eFactura, recunoașterea furnizorului (CUI → ANAF/VIES). La „adaugă factura de intrare", „bagă marfa pe stoc", „de ce nu intră pe stoc", „NIR", „e alt furnizor decât pe factură" și la „am primit marfă", „pune-mi X pe stoc", „bagă 20 kg de făină", „am cumpărat de la Selgros" (= intrare de marfă, nu ajustare).
---

# Recepție factură furnizor / Intrări Marfă — corect, complet, rapid

Scopul: marfa de la furnizor să intre pe stoc ȘI în contabilitate, corect. Citește la nevoie `knowledge/agent-operare-avansata.md` (confirm-first, verificare, dovezi), `knowledge/intrari-marfa-receptie.md` (fluxul complet, fiecare câmp), `knowledge/mapare-si-reconversie-facturi.md` (potrivirea liniilor, conturi, factor de pachet, ce învață sistemul), `knowledge/reconciliere-dubluri-facturi.md` (marfă intrată de două ori, facturi pierdute), `knowledge/gestiuni-magazii-zone.md` (în ce gestiune intră marfa) și `knowledge/finante-facturare-contabilitate.md` (conturi & note contabile). Secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md` rămâne valabilă (interfața se actualizează la refresh; verifică prin CITIRE, nu reapela scrierea).

**Regula de aur:** stocul se mișcă DOAR la postarea NIR-ului (document de inventar POSTED). Factura nemapată nu intră pe stoc. Nici recepția din poză nu face excepție: poza nu postează niciodată singură stocul — un om mapează liniile, numără marfa și confirmă, iar confirmarea creează și postează NIR-ul. Modul firmei decide doar **cine** confirmă: angajatul care a pozat (`review`) sau un responsabil cu drepturi financiare după el (`supervisor`).

## Pasul 0 — întreabă de factură ÎNAINTE de orice (citește asta întâi)

Regula care nu se negociază: **marfa intră pe stoc prin FACTURĂ → RECEPȚIE.** În ordinea asta. Recepția
e consecința facturii, nu o alternativă la ea. O recepție fără factură crește stocul dar nu naște
datoria către furnizor, nu are ce concilia și lasă un NIR orfan în contabilitate.

Trei situații, în ordinea de PRECEDENȚĂ — verifică-le de sus în jos și oprește-te la prima care se
potrivește:

1. **Userul ți-a dat o factură** — poză, PDF, fișier, sau pur și simplu ți-a dictat-o în chat
   („am luat de la Selgros 20 kg făină, 180 lei"). **NU face recepție direct din ea.** Întâi o
   introduci CA FACTURĂ cu `create_incoming_invoice` (o creează ca CIORNĂ, nu mișcă stoc), apoi
   mapezi liniile cu `map_invoice_line`, apoi faci recepția legată cu `create_nir_from_invoice`.
   Vezi „Factură manuală de la zero (prin MCP)" la finalul fișierului. Așa devine Calea B și rămâne
   totul legat: factură ↔ NIR ↔ stoc ↔ notă contabilă. A face recepție directă dintr-un document
   pe care îl ai în mână e cea mai frecventă greșeală și cel mai scump de reparat ulterior.
2. **Factura există deja în sistem** (importată din SPV, din poză OCR, sau împinsă din contabilitate
   — apare în `list_received_efactura`) → **Calea B**: mapezi liniile, apoi NIR-ul legat.
   ⚠ NU folosi `create_inventory_document` aici — creează o recepție SEPARATĂ, NElegată de factură,
   deci marfa intră de două ori și factura rămâne „fără NIR".
3. **Nu există nicio factură și userul nu ți-a dat una** → **ÎNTREABĂ, nu presupune.** Formulare:
   „Ai factura sau avizul? Dacă mi-l dai (poză sau doar numărul, furnizorul și liniile), îl introduc
   întâi ca factură și fac recepția din el — așa rămâne legat de furnizor și de contabilitate."
   Doar dacă userul confirmă că nu există (încă) — cash & carry cu bon, aviz care va fi facturat
   ulterior, eFactura nesosită din SPV — folosești **Calea A** (`create_inventory_document`). Când
   o faci, spune-i explicit că factura va trebui atașată când sosește, altfel rămâne recepție
   neconciliată.

⛔ **Ajustarea de stoc NU e o cale de intrare a mărfii.** Când userul zice „pune-mi 20 kg pe stoc",
„adaugă stoc la X", „am primit marfă" sau „corectează-mi stocul în plus", asta e o RECEPȚIE, nu o
ajustare — indiferent cât de mult sună a corecție. O ajustare pozitivă bagă cantitate fără furnizor,
fără cost de achiziție real, fără factură și fără datorie; pe deasupra, plusurile de stoc se scad din
costul mărfii vândute și pot împinge food cost-ul sub zero. Ajustarea pozitivă e legitimă DOAR ca
rezultat al unei numărători fizice (inventariere) sau la încărcarea soldului inițial. Vezi
`knowledge/stocuri-inventar-furnizori.md`.

Întreabă-te, în ordine: „Am un document de la furnizor în mână?" → 1. „E deja în sistem?" → 2.
„Nu e nici, nici?" → întreabă, apoi 3.

**Procedura firmei e configurabilă** (Setări → Stocuri → „Recepție din poză"; citește-o cu `get_reception_policy`, schimb-o cu `configure_reception_policy`): modul — **doar** `review` (angajatul care a pozat mapează, numără și confirmă, iar confirmarea lui pune marfa în gestiune) sau `supervisor` (angajatul pregătește tot, dar marfa intră abia după confirmarea cuiva cu drepturi financiare) —, magazia implicită de recepție și cine poate corecta mapările / adăuga produse noi. ⛔ Modurile vechi `draft` și `direct` **au fost scoase**: tool-ul și rutele de setări le refuză, iar valorile vechi din DB se citesc ca `review`. Nu există mod în care poza singură să pună marfa pe stoc, nici mod în care nimeni să nu confirme nimic — dacă userul cere „direct pe stoc" sau „doar ciornă", explică-i asta și oferă-i `review`. Consult-o ÎNAINTE să explici de ce a intrat (sau nu) marfa pe stoc. Există și un **loop automat de eFactură**: verifică-dacă-e-ceva-nou → importă din SPV → mapează automat liniile (pe regulile învățate) → decizie (ce e curat trece, ce e neclar rămâne la om) → procesează, cu **NIR automat opțional** — facturile pot curge singure până la stoc, tu intervii doar la excepții.

## Principii (nu greși astea)
- **Nu inventa** furnizori, produse, conturi sau prețuri. Ce nu se potrivește clar → întreabă userul.
- **Caută înainte de a crea** (`search_products_db`); **verifică prin citire după** (`get_received_efactura_details`, `get_stock_levels`, `get_journal_entries_summary`).
- **Contul vine din TIPUL produsului.** Leagă linia/produsul de tipul corect și contul se rezolvă singur (raw_material→301, merchandise→371, consumable→302/603, packaging→381, service→628 etc.). Nota contabilă se generează corect chiar dacă brandul n-are tipuri de produs configurate (sistemul folosește maparea implicită pe tipul canonic). Tipurile configurate (`create_product_type`) sunt necesare doar pentru CONTURI PERSONALIZATE / override-uri.
- ⚠ **Contul de pe linie NU schimbă nota contabilă la marfa care intră pe stoc.** Pentru o linie care intră pe stoc, nota se face **din tipul produsului** (plus conturile personalizate pe tip/unitate, dacă există). Contul pus pe linie se vede în ecranul de mapare și în rapoarte, dar nu rescrie nota. El decide nota doar la **liniile de cheltuială** (servicii, utilități, transport) și la facturile pur contabile. Deci dacă nota iese pe cont greșit, **repari tipul produsului** (`get_product_details` → `list_product_types` / `get_product_type_details` → `update_product` sau `change_product_type` 🔒), nu contul de pe linie. Confirmarea învață regula **furnizor + descriere normalizată → produs + cont de mapare + factor**; nu o propagă automat la orice furnizor.
- **Costul e obligatoriu la intrare.** Pe Calea A pune `unitCost` pe fiecare linie, altfel stocul se valorează la 0 și nota contabilă iese 0. Pe Calea B costul vine din factură.

## Faza 1 — Context
`list_brands` + `list_locations` (brandId/locationId) și `list_warehouses_full` (magaziile). `list_suppliers` pentru furnizor. Dacă produsul lipsește → `create_product` (vezi mai jos).

### Cine e furnizorul — se CAUTĂ, nu se citește de pe hârtie

Numele scris pe factură (mai ales pe una fotografiată) e întrebarea, nu răspunsul. O literă citită greșit n-are voie să nască un al doilea furnizor. Ordinea e mereu aceeași, iar **fiecare pas se face doar dacă cel dinainte n-a găsit nimic**:

1. **Codul fiscal, căutat în lista TA de furnizori.** Se caută pe cod curățat (fără RO, fără spații, fără puncte), nu pe denumire. Găsit → gata: se folosesc numele și codul **din lista ta**, nu ce s-a citit de pe hârtie. Aici se opresc aproape toate recepțiile unui client care își are furnizorii introduși — nu se întreabă nimic în afară.
2. **Denumirea oficială, cerută la ANAF sau VIES.** Doar dacă acel cod nu e în listă. Cod fiscal românesc → ANAF (`lookup_company_cui`); cod de TVA european → VIES (`lookup_eu_company_vat`).
3. **A doua căutare în lista ta, acum cu denumirea oficială.** Aici se prinde furnizorul pe care îl ai deja, scris altfel — «MEGA IMAGE» la tine, «MEGA IMAGE S.R.L.» la ANAF. Fără pasul ăsta ar apărea al doilea rând pentru aceeași firmă.
4. **Abia dacă nu s-a găsit nimic nicăieri** se propune un furnizor nou — creat cu denumirea **oficială**, nu cu ce s-a citit de pe poză.

Tot lanțul îl poți rula ca simplă CITIRE, fără să creezi nimic: `resolve_supplier_identity({ taxId })` sau `resolve_supplier_identity({ invoiceId })`. Îți spune cine e furnizorul **și de ce**.

**Trei culori, atât:**
- 🟢 **Verificat** — luat dintr-o sursă sigură (codul fiscal din lista ta, sau denumirea oficială care a nimerit un rând existent). N-ai ce verifica.
- 🟡 **Furnizor nou** — chiar nu există nicăieri. Se creează, e o situație normală de business și nu blochează nimic.
- 🔴 **Alege tu** — sunt mai mulți candidați, denumirea de pe hârtie duce în altă parte decât codul fiscal, sau ANAF/VIES n-a răspuns. Se oprește și te întreabă.

**Regula de aur: când sistemul NU e sigur, întreabă — nu inventează un furnizor nou.** Un răspuns care lipsește („ANAF nu răspunde acum", „țara asta nu se poate verifica") NU e o dovadă că firma nu există, deci nu duce niciodată la „furnizor nou". Motivul e foarte practic: un furnizor dublat, o dată ce are NIR-uri și facturi agățate de el, nu se mai desface.

`create_supplier` merge pe aceeași ordine, chiar dacă îl chemi tu direct: caută întâi codul fiscal în listă și, dacă îl are, îți întoarce furnizorul existent („există deja"), fără să scrie nimic. **Codul fiscal e obligatoriu** — pe denumire furnizorii nu se creează, tocmai ca să nu se dubleze.

### Furnizorul fără cod fiscal OPREȘTE recepția

Nu e un inconvenient de recunoaștere — e o oprire. Dacă nici factura, nici fișa furnizorului n-au un cod fiscal valid, **NIR-ul nu se creează și stocul nu se mișcă**. Ce vede clientul:

- factură normală: „Factura și fișa furnizorului nu conțin un cod fiscal valid. Alege furnizorul corect sau completează CUI-ul; stocul nu a fost modificat."
- recepție din poză: „Codul fiscal al furnizorului nu a putut fi confirmat din poză și lipsește și din fișa furnizorului…"

De ce e fail-closed: fără identitate fiscală nu se poate înregistra datoria către furnizor, iar un NIR postat pe un partener neidentificabil nu se mai desface curat.

**Repararea, în bloc, înainte să se blocheze marfa la rampă:**
1. `list_suppliers_without_tax_id` — lista completă a furnizorilor de reparat (implicit doar cei activi).
2. Pentru fiecare: `resolve_supplier_identity({ taxId })`, sau `lookup_company_cui` (cod românesc) / `lookup_eu_company_vat` (cod european) ca să afli codul corect.
3. `update_supplier({ supplierId, cui })`.
4. Reia crearea NIR-ului.

**Două avertismente:**
- **Nu pune NICIODATĂ codul fiscal al PROPRIEI firme pe un furnizor.** Pe o factură de intrare, codul furnizorului e cel din blocul vânzătorului; cel din blocul cumpărătorului ești tu. Platforma refuză acum și crearea, și modificarea cu un asemenea cod, și îți spune de ce. Ia codul corect din `identitateFiscala.vanzator.cui` (`get_received_efactura_details`) — acolo scrie explicit cine e vânzătorul și cine e cumpărătorul.
- **Codul fiscal e imutabil după ce furnizorul are documente.** Un cod greșit pus la creare nu se mai poate corecta („furnizorul are deja alt cod fiscal salvat") — de aceea se verifică ÎNAINTE, nu după.

### Produs nou corect din prima (tip, unitate, magazie, TVA)
`create_product({ name, brandId, type, unit, warehouseId, vat, receptionPrice })`:
- `type` decide contul contabil — alege-l corect: `raw_material` (materii prime, 301), `merchandise` (marfă de revânzare, 371), `consumable` (consumabile, 302), `packaging` (ambalaje, 381), `service` (servicii, 628), `asset` (imobilizări).
- `warehouseId` = magazia (din `list_warehouses_full`). Zona de depozitare se setează automat dacă magazia are sub-zone.
- `unit` = unitatea de STOC (kg, l, buc) — în ea ții cantitatea, nu „bax". Reconversia din bax se face cu factorul de pachet (vezi Faza 3).
- `vat`: 21 standard, 11 alimente preparate / produse alimentare, 9, 0.

## CALEA A — recepție directă pe stoc prin MCP (fără factură în sistem)

Totul prin conexiune, fără aplicație. Pași:

1. Asigură-te că furnizorul și produsele există (Faza 1).
2. **Creează NIR-ul ca DRAFT mai întâi** (verificabil, nemișcat încă):
   `create_inventory_document({ docType: "GOODS_RECEIPT", docNo, docDate, supplierId, warehouseId, brandId, locationId, lines: [{ productId, qty, unitCost }], autoPost: false })`.
   - `docType` de intrare: `GOODS_RECEIPT` / `NIR` / `PURCHASE_RECEIPT` (toate alimentează stocul). `qty` în unitatea produsului. `unitCost` = cost de achiziție fără TVA per unitate.
3. Verifică DRAFT-ul: `list_pending_nirs({ warehouseId })` — trebuie să apară.
4. **Confirmă cu userul** că postezi (mișcă stocul real, ireversibil), apoi `post_inventory_document({ documentId, confirm: true })`. (Sau direct `create_inventory_document(..., autoPost: true, confirm: true)` după acordul userului.)
5. Verifică efectul: `get_stock_levels({ productName })` (cantitatea + costul mediu au crescut) și `get_journal_entries_summary({ brandId, startDate, endDate })` (apare o înregistrare sursă NIR; debit stoc + 4426 TVA / credit 401 furnizor).

Asta acoperă „adaugă factura de intrare" când nu vrei să treci prin eFactură: marfa intră pe stoc și nota contabilă se generează automat.

## CALEA B — factura există deja în sistem (mapezi liniile, apoi NIR legat)

### Faza 2 — vezi ce e de procesat
`list_received_efactura({ hasNir: false })` — facturile FĂRĂ recepție. Filtrează după `status`, `mappingStatus` (`unmapped`/`partially_mapped`/`ai_mapped`/`fully_mapped`), `supplierId`, interval de date. Arată userului lista (furnizor, număr, dată, total, câte linii / câte acceptate) și confirmă pe care le procesezi.

⚠ Dacă o factură are **zero linii**, oprește fluxul înainte de mapare/NIR. `diagnose_incoming_invoice_integrity({ invoiceId })` stabilește dacă este reparabilă din XML-ul oficial păstrat sau cere re-descărcare ANAF. Numai verdictul reparabil permite `repair_missing_incoming_invoice_lines({ invoiceId })`; după reparație recitește detaliile. Nu trata lipsa liniilor ca valoare zero și nu inventa manual conținut fiscal.

### Faza 3 — pe fiecare factură, mapează liniile
1. `get_received_efactura_details({ invoiceId })` — liniile + starea (produs mapat, cont, acceptat, factor pachet).
2. Pentru fiecare linie **nemapată / neacceptată**:
   - `search_products_db` pe descrierea liniei → găsește produsul intern. Lipsă? Întreabă userul dacă să-l creezi (`create_product` cu tipul corect) sau e altul existent (typo/diacritice).
   - **Ce produs e, de fapt** — `suggest_invoice_line_products({ invoiceId, lineId? })` (doar citire) îți arată variantele **cu motivul fiecăreia**: cod de bare identic, codul de articol al furnizorului, o regulă salvată de la recepțiile anterioare, potrivire pe denumire în catalog sau ce ai mai cumpărat de la acel furnizor. Îți spune și cât de sigură e potrivirea și dacă e destul de sigură ca să se aplice singură. Nu creează și nu modifică nimic — e perechea de citire a lui `map_invoice_line`.
   - **Un produs care seamănă foarte tare cu unul existent NU se creează automat** — ți se propune cel existent și alegi tu. Așa nu ajungi cu «Cartofi» și «Cartofl» în stoc, adică două stocuri pe același lucru și food cost fals.
   - `map_invoice_line({ invoiceId, lineId, productId })` — leagă + acceptă + învață regula. Contul se rezolvă automat din tipul produsului; dă `accountCode` doar dacă userul cere altul. (Implicit, dacă nu poate deriva, cade pe 371 — de aceea tipul produsului trebuie corect.)
   - **Factor de pachet (reconversie):** furnizorul facturează în bax/navetă/cutie, tu ții la bucată/kg → adaugă `packMultiplier` (ex. 24) + `packKeyword` („bax"). Cantitatea se înmulțește (×24), prețul unitar se împarte (÷24), **valoarea liniei rămâne exact cea din factură**, iar cifrele originale ale furnizorului se păstrează separat, ca dovadă. (Există DOAR pe `map_invoice_line` — Calea B. Pe Calea A convertești tu cantitatea în unitatea de stoc.) Reguli:
     - **Sistemul propune singur** factorul când îl recunoaște din descriere („bax", „navetă", „pachet", formule de tip „6x1L", oferte „5+1", plus mărimile obișnuite la bere/răcoritoare/apă). E o propunere — o confirmi, nu o aplici orb.
     - **Când nu poate traduce singur unitatea** (bax → kg, cutie → bucată) se oprește și pune o singură întrebare clară: „1 bax = câte kg?". Nu e eroare, e protecția care ține stocul corect. Răspunsul userului devine `packMultiplier`.
     - **„Păstrez pachetul"** (nu desfaci baxul, ții stocul în baxuri) e permis **doar dacă produsul e ținut chiar în acea unitate**. Altfel sistemul cere factorul.
     - ⚠ **Pune numărul de bucăți din pachet, nu cifra mare afișată.** Câmpul de reconversie arată traducerea **totală** (inclusiv kg→g). Dacă produsul e ținut în grame și baxul are 5 bucăți, `packMultiplier` = 5 — nu retasta numărul compus din ecran, altfel factorul se compune din nou.
     - **Factorul se învață pentru data viitoare.** Dacă a fost învățat greșit, se corectează din **Reguli de Mapare** (`gaseste_in_aplicatie("reguli de mapare")`) → regula furnizorului → editezi factorul/unitățile. Cât timp regula rămâne greșită, se reaplică la fiecare factură nouă — nu o „repara" re-mapând linia la nesfârșit. Detalii complete: `knowledge/mapare-si-reconversie-facturi.md`.
3. O linie deja legată corect (are produs + cont) dar neacceptată: `accept_invoice_line_mapping({ invoiceId, lineId })` o acceptă fără s-o re-mapezi. Pentru toate liniile deja mapate dintr-o dată: `accept_all_invoice_mappings({ invoiceId })` (acceptă în bloc cele cu produs+cont; NU creează produse noi și **sare peste produsele doar propuse de asistent** — pe acelea le accepți individual, din aplicație). Tool-ul îți întoarce și **liniile rămase blocate, cu motivul pe fiecare**, iar când nu acceptă nimic îți spune și pasul următor: citește lista și rezolvă exact acele linii, nu reapela tool-ul. O linie neacceptată blochează NIR-ul.

⚠ **Reguli de operare la mapare (nu le încălca):**
- **Nu rula `auto_map_efactura` peste linii corectate manual dar neacceptate.** Rularea din nou a mapării automate reia de la zero liniile neacceptate — munca ta se pierde. Ordinea corectă: acceptă întâi ce ai corectat (`accept_invoice_line_mapping`), abia apoi rulează `auto_map_efactura` pentru restul.
- **`map_invoice_line` nu propagă la liniile identice din alte facturi.** Ecranul de mapare din aplicație aplică decizia și pe celelalte facturi nefinalizate ale aceluiași furnizor, dintr-un click; prin conexiune mapezi linie cu linie. La zeci de linii identice, spune-i userului deschis că un click în aplicație rezolvă tot și dă-i linkul cu `gaseste_in_aplicatie("mapare factură")`.
- **Propagarea merge în ambele sensuri:** o mapare greșită confirmată în aplicație se împrăștie la fel de repede ca una bună. Verifică produsul ÎNAINTE de a confirma, nu după.

### Faza 4 — context factură (opțional)
`set_invoice_context({ invoiceId, warehouseId, brandId, locationId, invoiceType, vatDeductibility, ... })`. ⚠ Deductibilitatea + prepaid 471 se SALVEAZĂ ca etichetă pentru contabil — azi NU schimbă nota contabilă (TVA merge integral pe 4426). Spune-i userului.

### Faza 5 — NIR-ul legat de factură (prin MCP)
Când toate liniile sunt `fully_mapped` + acceptate (verifică cu `get_received_efactura_details`): **confirmă cu userul**, apoi `create_nir_from_invoice({ invoiceId, warehouseId, confirm: true })` — creează NIR-ul LEGAT de factură, îl postează pe stoc, generează notele contabile și marchează factura cu NIR (`hasNir:true`). Toate liniile trebuie să aibă deja produs mapat (altfel dă eroare). `warehouseId` = magazia de recepție (din `list_warehouses_full`); opțional doar dacă toate liniile sunt servicii non-stocabile. `confirm:true` e obligatoriu (mișcă stocul real, ireversibil).

Alternativ, din aplicație: Intrări Marfă → tab Recepții (NIR) → „Recepție Nouă" (alegi factura sursă + magazia) → Creează NIR. Dă linkul cu `gaseste_in_aplicatie("recepție marfă / NIR")`.

⚠ NU folosi `create_inventory_document` pe Calea B: el nu primește `invoiceId`, deci ar crea o recepție SEPARATĂ, nelegată de factură (marfa s-ar dubla, factura rămâne „fără NIR"). Pentru o factură care există deja în sistem, folosește MEREU `create_nir_from_invoice`.

## Faza 6 — Reconciliere (aviz/poză ↔ eFactura)
Aceeași livrare poate ajunge de trei ori: poza de la recepție, avizul șoferului, eFactura oficială. Reconcilierea le face un singur document. Ghidul complet: `knowledge/reconciliere-dubluri-facturi.md`.

**Ce face sistemul singur la importul eFacturii** (caută același furnizor + același număr):
- ciorna din poză era **neaprobată** și sumele se potrivesc (toleranță: 1 leu sau 0,5% — cât e mai mare) → documentul oficial o **înlocuiește**, nu ai nimic de făcut;
- poza era deja aprobată/recepționată → eFactura **se atașează** peste ea, iar un gard oprește al doilea NIR pe aceeași factură;
- sumele diferă mai mult → sistemul **nu alege singur**: le lasă pe amândouă, cu avertisment, și decizi tu.

**Ce faci manual:** Intrări Marfă → tab **Reconciliere** → „Leagă" (stânga documentele care așteaptă o factură, dreapta facturile candidate ale aceluiași furnizor). ⚠ „Leagă" **nu verifică numărul și suma** — verifică-le tu și arată-i userului cifrele înainte; două facturi diferite ale aceluiași furnizor pot fi legate greșit. Bifa verde de „potrivire" din listă e orientativă (compară doar totalurile).

**Ce blochează legarea rapidă (și e bine că o blochează):** dacă recepția a fost deja decontată în contabilitate (marfa primită nefacturată e închisă), legarea din pagină se refuză — se face prin contabilitate. La fel, facturile venite din contabilitate au identitatea înghețată: se mai poate schimba doar conversia de ambalaj.

**Verificarea fizică a mărfii:** recepția se marchează „conformă" sau „cu diferențe" + notă (`list_receptions_to_review`, `mark_reception_reviewed`). E o informație pentru echipă și pentru contabil — nu blochează legarea; blochează doar marcarea recepției ca verificată, până rezolvi nota de diferență.

**Igienă:** `/inventory/inbox-quality` (eFacturi fără NIR, ciorne vechi, mapări slabe) + badge-ul roșu din Reconciliere. `list_received_efactura` exclude automat documentele înlocuite — dacă userul „vede două", una e cea înlocuită, vizibilă doar în aplicație.

⚠ **Nu există tool de reconciliere.** Legarea aviz↔factură și ciornă↔eFactura se face doar din tabul Reconciliere. Dacă userul o cere prin chat, dă-i linkul (`gaseste_in_aplicatie("reconciliere")`) ȘI lista exactă a documentelor de legat, obținută din citiri (`list_received_efactura`, `list_pending_nirs`, `list_goods_receipts`).

## Servicii / utilități fără stoc
Factură doar de servicii/utilități (fără marfă pe stoc): nu face NIR. Folosește calea de cheltuieli (`create_expense`) sau, pe factură, `set_invoice_context({ invoiceType: "servicii" })` + linii pe produs de tip `service` (cont 628). Stocul nu se mișcă.

### Linii de cheltuială pe o factură care ARE și marfă
O factură mixtă (marfă + transport, comision, ambalaj facturat separat) are linii care **nu** intră în gestiune. Pentru ele nu cauți produs — le dai **natura cheltuielii**:

1. `list_expense_destination_types({ invoiceId })` — ce naturi sunt configurate la tine (Utilități, Chirii, Transport…), cu contul principal și conturile alternative acceptate pe fiecare.
2. `map_invoice_line({ invoiceId, lineId, productTypeCode: "…" })` — **fără `productId`**. Contul se completează din natura aleasă; dacă vrei un cont anume, el trebuie să fie unul dintre cele configurate pe acel tip (altfel primești un mesaj care îți listează exact ce e permis).

⚠ **Fără natura cheltuielii, linia nu apare pe nicio categorie de P&L** — rămâne la „Nealocate". `accept_all_invoice_mappings` îți semnalează liniile astea separat (`no_expense_type`), ca să nu le confunzi cu marfa nemapată.

Dacă lista de naturi vine goală: nu ai încă tipuri de cheltuială configurate. Se face o singură dată în Setări → Conturi pe Tip Produs (un tip fără gestiune, cu cont pe momentul „Intrare factură") — vezi `tipuri-produs-conturi.md`.

## Faza 7 — Verifică prin citire (mereu)
- `get_received_efactura_details` — `mappingStatus` + linii rămase nemapate.
- `diagnose_incoming_invoice_integrity` — nicio factură nefinalizată nu rămâne cu zero linii; pentru cele reparate verifică `healthy:true` și numărul de linii.
- `list_received_efactura({ hasNir: true })` — confirmă că factura a primit NIR (Calea B).
- `list_pending_nirs` — NIR-uri DRAFT nepostate.
- `get_stock_levels` pe 1-2 produse — stocul a crescut.
- `get_journal_entries_summary` — nota contabilă s-a generat (sursă NIR).

## Ce nu poți face prin conexiune (spune-o din prima, nu încerca ocolișuri)
Următoarele se fac DOAR din aplicație. Nu improviza altă cale (ajustare de inventar, recepție separată) — strici stocul sau urma facturii. Dă linkul cu `gaseste_in_aplicatie(...)` și, dacă lipsa e blocantă pentru user, deschide `trimite_ticket_symbai` cu tip „sugestie".
- **Spargerea unei linii** în mai multe sub-linii, pe cantități (același rând conține produse reale diferite sau marfa merge în locuri diferite). Sumele se împart automat; operația se poate anula.
- **Absorbția unei linii** — costul unei linii (transport, ambalaj, taxă) se repartizează peste liniile de marfă (egal, proporțional cu valoarea, sau pe o singură linie). **Se mută doar valoarea, nu cantitatea** — așa transportul intră în costul mărfii.
- **Împărțirea unei linii pe mai multe gestiuni** (ex. 40 kg la Magazie, 60 kg la Bucătărie). ⚠ Se stabilește doar în ecranul de recepție și **se pierde dacă reîncarci pagina** — creează NIR-ul în aceeași sesiune.
- **Crearea produsului propus de asistent** — când nu găsește produsul, îl **propune**, nu îl creează. „Creează și mapează" e pe linie, în pagină. Acceptarea în bloc sare aceste linii.
- **Editarea sau ștergerea regulilor de mapare învățate** și a factorilor de pachet (Reguli de Mapare).
- **Legarea în Reconciliere** (aviz/ciornă ↔ eFactura) și **„Modificare NIR"** pe o recepție deja postată.
- **Refacerea potrivirilor pe toate facturile fără recepție**, dintr-un click.

## Capcane (spune-le userului când apar)
- **Stoc dublat** = ai folosit `create_inventory_document` pentru o marfă care avea deja factură în sistem (trebuia Calea B). Verifică în `list_pending_nirs` / Recepții (NIR).
- **„De ce nu intră pe stoc după poză?"** Poza singură nu pune nimic pe stoc — e nevoie de confirmarea unui om în ecranul de verificare. Deci: (1) recepția n-a fost dusă până la confirmare; (2) firma e pe `supervisor` (citește-l cu `get_reception_policy`) și recepția așteaptă un responsabil cu **drepturi financiare** — contabil sau manager cu acces la facturi, nu un manager de stoc; (3) a rămas o nelămurire care oprește confirmarea, cu motivul scris (`explain_photo_reception`). Un furnizor rămas pe 🔴 („alege tu") e exact unul dintre acele motive — se rezolvă alegând furnizorul, nu forțând postarea.
- **„ANAF/VIES n-a răspuns" NU înseamnă „furnizor nou".** Când ANAF/VIES tace (rețea, serviciu picat) sau nu acoperă țara codului (Elveția, Turcia, Serbia, Moldova, Norvegia, SUA…), recepția te întreabă pe tine — nu creează furnizorul. Nu forța crearea „ca să meargă acum": un duplicat făcut într-o pană de rețea rămâne în listă cu documente agățate de el și nu se mai desface. Mai încearcă peste câteva minute sau alege furnizorul din listă.
- **„Am deja furnizorul, dar mi-l propune ca nou."** Se întâmplă când în lista ta e salvat FĂRĂ cod fiscal, sau cu codul scris altfel. Verifică cu `resolve_supplier_identity({ taxId })` și, dacă rândul chiar există, completează-i codul fiscal pe fișa lui (`update_supplier`) — de la următoarea factură se recunoaște singur. Nu crea al doilea rând.
- **„De ce mi-a schimbat numele furnizorului?"** Un furnizor nou se creează cu **denumirea oficială** de la ANAF/VIES, nu cu ce scria pe hârtie — de asta apare «MEGA IMAGE S.R.L.» acolo unde pe factură era «Mega Image». E intenționat: așa se leagă între ele documentele viitoare de la același partener, în loc să se împrăștie pe două grafii.
- **„Pe factură scrie un furnizor, sistemul arată altul."** Codul fiscal bate denumirea — el e identitatea firmei, numele e doar text tipărit. Când cele două nu duc în același loc, recepția nu alege singură. Vezi cu `explain_photo_reception({ invoiceId })` ce a găsit și unde s-a împiedicat, apoi confirmă tu furnizorul corect.
- **Stoc/notă pe valoare 0** = ai uitat `unitCost` pe Calea A (sau costul lipsește din factură).
- **Serviciu pe cont de marfă (371)** = tip produs greșit. Leagă-l de un produs de tip `service` (cont 628 automat) sau schimbă tipul cu `update_product`.
- **„Am schimbat contul pe linie și nota contabilă e la fel."** = normal, la marfa care intră pe stoc nota vine din TIPUL produsului (vezi Principii). Corectura se face pe tip (`update_product` / `change_product_type` 🔒 sau conturile tipului cu `update_product_type`), apoi se reface nota din aplicație („Modificare NIR"). Verifică rezultatul cu `get_journal_entries_summary`.
- **„AI-ul a mapat tot, dar o linie nu se acceptă."** = linia n-are cont valabil (regulă învățată din catalogul furnizorului, fără cont). Alege contul o dată pe acea linie sau pune tipul corect pe produs — după prima confirmare se învață. `accept_all_invoice_mappings` îți spune motivul pe fiecare linie blocată.
- **„Cantitatea a ieșit de 24 de ori mai mare (sau mult prea mică) după mapare."** = factor de pachet greșit sau lipsă. Valoarea liniei rămâne mereu cea din factură — se schimbă doar cantitatea și prețul unitar. Verifică pe linie cantitatea/prețul originale ale furnizorului vs cele mapate (`get_received_efactura_details`). Dacă NIR-ul NU e făcut: re-mapezi cu `packMultiplier` corect (numărul de bucăți din pachet) sau fără factor. Dacă NIR-ul e postat: „Modificare NIR" din aplicație. **Obligatoriu corectează și regula învățată** din Reguli de Mapare, altfel se reaplică la următoarea factură.
- **„Vreau să anulez/modific un NIR postat."** Rulează întâi `diagnose_inventory_document_reversal({ documentId })`. Dacă există o ciornă de factură generată din recepție, renunță întâi la ciornă și reia diagnosticul. Loturile deja consumate, inventarul ulterior sau consumul din aval sunt blocaje reale și se rezolvă în ordine; nu compensa printr-o ajustare separată care ascunde urma.
- **Factura vine din contabilitate → e blocată la modificări.** Identitatea ei (furnizor, număr, sume, linii) e înghețată; se mai poate ajusta doar conversia de ambalaj. Restul se corectează în contabilitate — nu încerca s-o „repari" creând o recepție nouă.
- **„Permisiune insuficientă"** la `map_invoice_line` / `create_inventory_document` / `set_invoice_context` → tokenul n-are modulul `inventar` („Stocuri & Recepție"). Portal Hub → Acces AI.
- **Factură deja cu NIR** → `map_invoice_line` și câmpurile structurale din `set_invoice_context` se blochează (ar dezalinia stocul). Modificarea se face din aplicație („Modificare NIR").
- **Deductibilitate/preț recepție** nu se reflectă în notele contabile → e normal azi (informativ). Stocul se valorează la cost.

## Factură manuală de la zero (prin MCP)
Pentru o factură pe hârtie/PDF care NU vine prin eFactura/SPV sau OCR, o creezi direct prin conexiune: `create_incoming_invoice({ invoiceNumber, invoiceDate, lines: [{ description, quantity, unit?, unitPrice?, vatRate?, mappedProductId? }], supplierId? SAU supplierName?(+supplierCui?), brandId?, locationId? })` (modul `financiar`). Creează factura ca CIORNĂ și NU mișcă stoc. Apoi mapezi liniile (`map_invoice_line`) și faci recepția cu `create_nir_from_invoice` (Faza 5) — astfel o factură de hârtie devine Calea B, integral prin MCP.
