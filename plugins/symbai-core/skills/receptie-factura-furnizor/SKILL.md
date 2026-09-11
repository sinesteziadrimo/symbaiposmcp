---
name: receptie-factura-furnizor
description: Facturi furnizori, recepții și corectarea facturilor existente — modifică data intrării sau prețul fără storno inutil, urmărește recalcularea FIFO; creare NIR, mapare produse/conturi, ambalaje, gestiune, reconciliere aviz/poză ↔ eFactura. La „modifică factura/recepția”, „am greșit data/prețul”, „marfa e deja consumată”, „adaugă factura”, „bagă marfa pe stoc”, „NIR”, „alt furnizor decât pe factură”.
---

# Recepție factură furnizor / Intrări Marfă — corect, complet, rapid

Scopul: marfa de la furnizor să intre pe stoc ȘI în contabilitate, corect. Citește la nevoie `knowledge/agent-operare-avansata.md` (confirm-first, verificare, dovezi), `knowledge/intrari-marfa-receptie.md` (fluxul complet, fiecare câmp), `knowledge/mapare-si-reconversie-facturi.md` (potrivirea liniilor, conturi, factor de pachet, ce învață sistemul), `knowledge/reconciliere-dubluri-facturi.md` (marfă intrată de două ori, facturi pierdute), `knowledge/gestiuni-magazii-zone.md` (în ce gestiune intră marfa) și `knowledge/finante-facturare-contabilitate.md` (conturi & note contabile). Secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md` rămâne valabilă (interfața se actualizează la refresh; verifică prin CITIRE, nu reapela scrierea).

**Regula de aur:** stocul se mișcă DOAR la postarea NIR-ului (document de inventar POSTED). Factura nemapată nu intră pe stoc. Nici recepția din poză nu face excepție: poza nu postează niciodată singură stocul — un om mapează liniile, numără marfa și confirmă, iar confirmarea creează și postează NIR-ul. Modul firmei decide doar **cine** confirmă: angajatul care a pozat (`review`) sau un responsabil cu drepturi financiare după el (`supervisor`).

## Pasul 0 — verifică documentul disponibil (citește asta întâi)

Pentru un document existent, caută direct cu `list_invoices(query: număr, furnizor sau CUI)` și date/brand/locație când sunt cunoscute. Furnizorul se identifică prin `list_suppliers`; factura emisă către client prin `list_fiscal_invoices`. Citește paginarea și deosebește ID-ul documentului de numărul facturii, respectiv plata de procesare. Vezi [căutare și citire completă](../../knowledge/cautare-si-citire-completa.md).

**Dacă factura/recepția există și userul cere să o modifice**, citește întâi [Corectarea recepțiilor prin MCP](../../knowledge/corectare-receptii-mcp.md). Data efectivă a intrării → `set_reception_operational_date` (ID factură); prețul de achiziție → `update_incoming_invoice_line`, apoi `correct_confirmed_reception`, păstrând cantitățile și cheia la retry. Nu crea altă factură, nu storna NIR-ul, nu retrage factura, nu cere `acknowledgeConsumedLots` și nu activa stocul negativ pentru o corecție exclusivă de dată/preț. Citește `get_reception_cost_recalculation` (ID factură) și separat `get_reception_accounting_status` (ID NIR). `pending/waiting/attention` nu înseamnă terminat și nu interzic editarea. Folosește acordul deja dat; nu cere o confirmare formală suplimentară.

Regula care nu se negociază: **marfa intră pe stoc prin FACTURĂ → RECEPȚIE.** În ordinea asta. Recepția
e consecința facturii, nu o alternativă la ea. O recepție fără factură crește stocul dar nu naște
datoria către furnizor, nu are ce concilia și lasă un NIR orfan în contabilitate.

Trei situații, în ordinea de PRECEDENȚĂ — verifică-le de sus în jos și oprește-te la prima care se
potrivește:

1. **Userul ți-a dat o factură** — poză, PDF, fișier, sau pur și simplu ți-a dictat-o în chat
   („am luat de la Selgros 20 kg făină, 180 lei"). **NU face recepție direct din ea.** Întâi o
   introduci CA FACTURĂ cu `create_incoming_invoice` (o creează ca CIORNĂ, nu mișcă stoc), apoi
   mapezi liniile cu `map_invoice_line`, apoi faci recepția legată cu `create_received_invoice_reception`.
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
- **Lucrează cu starea actuală.** Dacă utilizatorul spune că a schimbat unitatea, a corectat o linie sau a finalizat factura, recitește punctual documentul înainte să enumeri ce mai are de făcut. Memoria și rezultatul citit înaintea intervenției lui nu dovedesc starea de acum. Nu reapela o scriere ca să verifici dacă s-a salvat.
- **Separă serviciile de marfa de recepționat.** O factură finalizată doar pe cheltuială poate să nu aibă NIR. Verifică `get_invoice_intake_decision` / `get_incoming_invoice_workflow_details`; lipsa NIR-ului nu înseamnă automat o problemă. Diagnosticul liniilor lipsă nu validează maparea sau contabilizarea.
- **Folosește alegerile și acordul deja date.** Nu cere din nou aceeași unitate, aceeași factură ori aceeași autorizare. Parametrul `confirm:true` execută acordul existent. Dacă documentul sau efectul s-a schimbat material, explică diferența și cere numai acordul care lipsește pentru efectul nou; nu repeta acordul pentru operația neschimbată. Perioada scrisă în descrierea unui serviciu nu schimbă singură filtrul de date al facturilor cerut de utilizator; pentru repartizare contabilă aplică politica explicită a firmei și setările documentului.
- **Conversia lipsă nu oprește recepția.** Folosește conversiile cunoscute din produs, document și regulile furnizorului. Dacă informația lipsește, folosește implicit 1:1, fără să ceri gramaj, densitate ori altă confirmare; utilizatorul poate modifica ulterior. Păstrează scara unităților: fără densitate configurată, 1 l = 1 kg, deci 2 sticle × 300 ml = 0,6 kg. La `map_invoice_line`, omite `packMultiplier` când nu există o conversie cunoscută. Valoarea implicită nu este o măsurătoare confirmată și nu înlocuiește o regulă salvată.
- **Nu inventa** furnizori, produse, conturi sau prețuri. Ce nu se potrivește clar → întreabă userul.
- **Caută înainte de a crea** (`search_products_db`); **verifică prin citire după** (`get_received_efactura_details`, `get_stock_levels`, `get_journal_entries_summary`).
- **Contul vine din TIPUL produsului.** Leagă linia/produsul de tipul corect și contul se rezolvă singur (raw_material→301, merchandise→371, consumable→302/603, packaging→381, service→628 etc.). Nota contabilă se generează corect chiar dacă brandul n-are tipuri de produs configurate (sistemul folosește maparea implicită pe tipul canonic). Tipurile configurate (`create_product_type`) sunt necesare doar pentru CONTURI PERSONALIZATE / override-uri.
- ⚠ **Contul de pe linie NU schimbă nota contabilă la marfa care intră pe stoc.** Pentru o linie care intră pe stoc, nota se face **din tipul produsului** (plus conturile personalizate pe tip/unitate, dacă există). Contul pus pe linie se vede în ecranul de mapare și în rapoarte, dar nu rescrie nota. El decide nota doar la **liniile de cheltuială** (servicii, utilități, transport) și la facturile pur contabile. Deci dacă nota iese pe cont greșit, **repari tipul produsului** (`get_product_details` → `list_product_types` / `get_product_type_details` → `update_product` sau `change_product_type` 🔒), nu contul de pe linie. Confirmarea învață regula **furnizor + descriere normalizată → produs + cont de mapare + factor**; nu o propagă automat la orice furnizor.
- **Cost cunoscut versus cost necunoscut.** Pentru recepția valorică pune costul verificat pe fiecare linie. Dacă prețul încă lipsește, folosește fluxul canonic de recepție fizică cu evaluare în așteptare; nu completa zero ca substitut. Factura verificată stabilește ulterior valoarea, fără o nouă intrare fizică.

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
`create_product({ name, brandId, locationId, type, unit, warehouseId, vat, receptionPrice })`:
- `locationId` = unitatea deja aleasă pentru operație (din contextul facturii și `list_locations`). Trimite-o explicit la acces nominal cu mai multe unități; `brandId` și `warehouseId` nu înlocuiesc acest parametru. Nu întreba din nou dacă alegerea este deja cunoscută.
- `type` decide contul contabil — alege-l corect: `raw_material` (materii prime, 301), `merchandise` (marfă de revânzare, 371), `consumable` (consumabile, 302), `packaging` (ambalaje, 381), `service` (servicii, 628), `asset` (imobilizări).
- `warehouseId` = magazia (din `list_warehouses_full`). Zona de depozitare se setează automat dacă magazia are sub-zone.
- `unit` = unitatea de STOC (kg, l, buc) — în ea ții cantitatea, nu „bax". Reconversia din bax se face cu factorul de pachet (vezi Faza 3).
- `vat` = cota verificată din document și configurarea fiscală a produsului; nu copia automat o cotă dintr-un exemplu istoric.

## CALEA A — recepție directă pe stoc prin MCP (fără factură în sistem)

Totul prin conexiune, fără aplicație. Pași:

1. Asigură-te că furnizorul și produsele există (Faza 1).
2. **Creează NIR-ul ca DRAFT mai întâi** (verificabil, nemișcat încă):
   `create_inventory_document({ docType: "GOODS_RECEIPT", docNo, docDate, supplierId, warehouseId, brandId, locationId, lines: [{ productId, qty, unitCost }], autoPost: false })`.
   - `docType` de intrare: `GOODS_RECEIPT` / `NIR` / `PURCHASE_RECEIPT` (toate alimentează stocul). `qty` în unitatea produsului. `unitCost` = cost de achiziție fără TVA per unitate.
3. Verifică DRAFT-ul: `list_pending_nirs({ warehouseId })` — trebuie să apară.
4. După acordul utilizatorului pentru postare, `post_inventory_document({ documentId, confirm: true })`. Acordul explicit deja dat pentru această recepție este suficient; cere-l numai dacă lipsește sau efectul pregătit diferă material. (Sau direct `create_inventory_document(..., autoPost: true, confirm: true)` după același acord.)
5. Verifică efectul: `get_stock_levels({ productName })` (cantitatea + costul mediu au crescut) și `get_journal_entries_summary({ brandId, startDate, endDate })` (apare o înregistrare sursă NIR; debit stoc + 4426 TVA / credit 401 furnizor).

Calea A se aplică numai când factura nu există încă și acest lucru este confirmat. Pentru „adaugă factura de intrare”, inclusiv fără SPV, creează factura manuală și recepția legată, conform Pasului 0 și Căii B.

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
     - **Când conversia lipsește**, continuă fără factor explicit: sistemul folosește implicit 1:1. Conversiile cunoscute și scara SI au prioritate; pentru masă–volum, densitatea lipsă înseamnă 1 kg/l (600 ml → 0,6 kg). Nu cere o măsurătoare și nu trimite un `packMultiplier:1` drept confirmare fizică. Valoarea implicită nu se învață; userul poate corecta ulterior.
     - **„Păstrez pachetul"** înseamnă stoc în baxuri numai dacă produsul este configurat în baxuri. Dacă unitățile diferă și conversia lipsește, aplică regula implicită de mai sus; nu prezenta această presupunere ca dovadă a conținutului baxului.
     - ⚠ **Pune numărul de bucăți din pachet, nu cifra mare afișată.** Câmpul de reconversie arată traducerea **totală** (inclusiv kg→g). Dacă produsul e ținut în grame și baxul are 5 bucăți, `packMultiplier` = 5 — nu retasta numărul compus din ecran, altfel factorul se compune din nou.
     - **Factorul se învață pentru data viitoare.** Dacă a fost învățat greșit, se corectează din **Reguli de Mapare** (`gaseste_in_aplicatie("reguli de mapare")`) → regula furnizorului → editezi factorul/unitățile. Cât timp regula rămâne greșită, se reaplică la fiecare factură nouă — nu o „repara" re-mapând linia la nesfârșit. Detalii complete: `knowledge/mapare-si-reconversie-facturi.md`.
3. O linie deja legată corect (are produs + cont) dar neacceptată: `accept_invoice_line_mapping({ invoiceId, lineId })` o acceptă fără s-o re-mapezi. Pentru toate liniile deja mapate dintr-o dată: `accept_all_invoice_mappings({ invoiceId })` (acceptă în bloc cele cu produs+cont; NU creează produse noi și **sare peste produsele doar propuse de asistent** — pe acelea le accepți individual, din aplicație). Tool-ul îți întoarce și **liniile rămase blocate, cu motivul pe fiecare**, iar când nu acceptă nimic îți spune și pasul următor: citește lista și rezolvă exact acele linii, nu reapela tool-ul. O linie neacceptată blochează NIR-ul.

⚠ **Reguli de operare la mapare (nu le încălca):**
- **Nu rula `auto_map_efactura` peste linii corectate manual dar neacceptate.** Rularea din nou a mapării automate reia de la zero liniile neacceptate — munca ta se pierde. Ordinea corectă: acceptă întâi ce ai corectat (`accept_invoice_line_mapping`), abia apoi rulează `auto_map_efactura` pentru restul.
- **Alege explicit întinderea corecției.** `correct_invoice_line_mapping` cu `identicalLines:accept` corectează liniile identice din recepția curentă; `skip` schimbă numai linia indicată. Pentru recepții istorice folosește `preview_invoice_mapping_repairs` și aplică numai corecțiile verificate. `map_invoice_line` singur nu garantează propagarea în alte facturi.
- **Propagarea merge în ambele sensuri:** o mapare greșită confirmată în aplicație se împrăștie la fel de repede ca una bună. Verifică produsul ÎNAINTE de a confirma, nu după.

### Faza 4 — context factură (opțional)
`set_invoice_context({ invoiceId, warehouseId, brandId, locationId, invoiceType, vatDeductibility, ... })`. Politica TVA influențează calculul: numai TVA deductibilă merge pe 4426, iar partea nedeductibilă intră în cost. Verifică politica și valorile liniilor; deductibilitatea cheltuielii și repartizarea prin 471 sunt setări distincte, nu dovezi că nota este finalizată.

### Faza 5 — NIR-ul legat de factură (prin MCP)
Când toate liniile sunt `fully_mapped` + acceptate (verifică cu `get_received_efactura_details`): folosește acordul deja dat pentru recepția verificată sau cere-l dacă lipsește, apoi `create_received_invoice_reception({ id: invoiceId, warehouseId, confirm: true })` — creează NIR-ul LEGAT de factură și îl postează pe stoc. O recepție din poză poate rămâne fizică, cu evaluarea în așteptare: `hasNir:true` nu dovedește contabilizarea finală. După verificarea facturii, continuă cu `finalize_received_invoice` dacă este necesar și verifică `get_reception_accounting_status`. Liniile de marfă cer produs mapat; liniile de cheltuială acceptate cu natura și contul corecte pot rămâne fără produs. Nu crea un produs generic pentru a ocoli o eroare de finalizare. Factura numai de servicii se finalizează fără NIR, conform fluxului de mai jos. `warehouseId` este gestiunea principală a documentului (din `list_warehouses_full`); poate fi dedusă din contextul facturii și configurarea recepției, dar nu o ghici dacă sistemul semnalează ambiguitate. `confirm:true` e obligatoriu (mișcă stocul real).

**Verifică unde s-a mișcat marfa:** produsele pot fi repartizate în gestiuni diferite conform configurării recepției. `warehouseIds` din rezultatul operațiunii enumeră gestiunile cu mișcări de stoc; `warehouseId` din antet nu dovedește că toate produsele au intrat acolo. Lista gestiunilor nu înlocuiește verificarea mișcărilor pe fiecare produs. Dacă răspunsul nu conține `warehouseIds`, verifică mișcările documentului în aplicație înainte de concluzii. Nu crea transferuri doar ca să „corectezi” o diferență între antet și gestiunea produsului. Dacă o corecție necesară e refuzată, investighează eroarea și eventualele corecții deja postate; nu ocoli refuzul prin ajustări de stoc compensatoare.

Alternativ, din aplicație: Intrări Marfă → tab Recepții (NIR) → „Recepție Nouă" (alegi factura sursă + magazia) → Creează NIR. Dă linkul cu `gaseste_in_aplicatie("recepție marfă / NIR")`.

**Corectarea unei recepții postate:** citește [ghidul comun pentru ChatGPT, Codex și Claude Code](../../knowledge/corectare-receptii-mcp.md). Pe conexiuni nominale folosește `update_incoming_invoice_line` / `correct_invoice_line_mapping` și `correct_confirmed_reception`; cantitatea fizică se transmite separat de cantitatea facturată. Ghidul acoperă și anularea, ciornele, abandonarea corecției, legarea facturii și verificarea contabilității. Folosește acordul deja dat pentru operația verificată; nu cere o a doua confirmare formală. Dacă marfa a fost consumată, explică numai efectele suplimentare încă neautorizate.



⚠ NU folosi `create_inventory_document` pe Calea B: el nu primește `invoiceId`, deci ar crea o recepție SEPARATĂ, nelegată de factură (marfa s-ar dubla, factura rămâne „fără NIR"). Pentru o factură care există deja în sistem, folosește MEREU `create_received_invoice_reception`.

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

**Reconciliere prin MCP:** `preview_received_invoice_link` → `link_received_invoice_to_reception` → `finalize_received_invoice`. Citește ambele documente, păstrează deciziile pe linii între previzualizare și aplicare, apoi verifică factura și starea contabilă. Vezi ghidul de corectare a recepțiilor.

## Servicii / utilități fără stoc
Factură doar de servicii/utilități (fără marfă pe stoc): citește `list_expense_destination_types({ invoiceId })`, mapează fiecare linie cu `map_invoice_line({ invoiceId, lineId, productTypeCode })`, apoi `finalize_received_invoice` conform schemei tool-ului. Alege natura și contul configurate pentru serviciul real (de exemplu utilități sau reparații), nu generic 628. Verifică finalizarea prin `get_reception_accounting_status`; nu crea NIR. `create_expense` înregistrează o ieșire de bani, implicit numerar: nu îl folosi pentru maparea sau finalizarea unei facturi existente. Plata este o operație separată, numai la cererea utilizatorului.

### Linii de cheltuială pe o factură care ARE și marfă
O factură mixtă (marfă + transport, comision, ambalaj facturat separat) are linii care **nu** intră în gestiune. Pentru ele nu cauți produs — le dai **natura cheltuielii**:

1. `list_expense_destination_types({ invoiceId })` — ce naturi sunt configurate la tine (Utilități, Chirii, Transport…), cu contul principal și conturile alternative acceptate pe fiecare.
2. `map_invoice_line({ invoiceId, lineId, productTypeCode: "…" })` — **fără `productId`**. Contul se completează din natura aleasă; dacă vrei un cont anume, el trebuie să fie unul dintre cele configurate pe acel tip (altfel primești un mesaj care îți listează exact ce e permis).

⚠ **Fără natura cheltuielii, linia nu apare pe nicio categorie de P&L** — rămâne la „Nealocate". `accept_all_invoice_mappings` îți semnalează liniile astea separat (`no_expense_type`), ca să nu le confunzi cu marfa nemapată.

Dacă lista de naturi vine goală: nu ai încă tipuri de cheltuială configurate. Se face o singură dată în Setări → Conturi pe Tip Produs (un tip fără gestiune, cu cont pe momentul „Intrare factură") — vezi `tipuri-produs-conturi.md`.

## Faza 7 — Verifică prin citire (mereu)
- `get_received_efactura_details` — `mappingStatus` + linii rămase nemapate.
- `diagnose_incoming_invoice_integrity` — nicio factură nefinalizată nu rămâne cu zero linii; pentru cele reparate verifică `healthy:true` și numărul de linii.
- Pentru marfă: verifică legătura factură–NIR, starea documentului și mișcările pe produsele recepționate. `list_pending_nirs` identifică NIR-uri DRAFT nepostate; `get_stock_levels` ajută la verificarea stocului.
- Pentru servicii/utilități: verifică natura cheltuielii pe fiecare linie și finalizarea facturii; lipsa unui NIR este normală.
- `get_reception_accounting_status` și nota contabilă aferentă documentului — verifică starea efectivă și valorile. NIR-ul salvat sau `healthy:true` la integritatea liniilor nu dovedesc singure contabilizarea.

## Corecții disponibile prin conexiune
Împărțirea/reunirea liniilor, absorbția valorii, repartizarea pe gestiuni, acceptarea produsului propus, regulile de mapare, asocierea facturii și corectarea NIR-ului au tool-uri dedicate. Folosește tabelul din [corectare-receptii-mcp.md](../../knowledge/corectare-receptii-mcp.md). Citește schema live și drepturile conexiunii înainte să afirmi că o operație lipsește. Refacerea mapărilor pe mai multe facturi se face prin selecție verificată și operații pe fiecare factură, fără a presupune că o regulă nouă rescrie NIR-urile postate.

## Capcane (spune-le userului când apar)
- **Stoc dublat** = ai folosit `create_inventory_document` pentru o marfă care avea deja factură în sistem (trebuia Calea B). Verifică în `list_pending_nirs` / Recepții (NIR).
- **„De ce nu intră pe stoc după poză?"** Poza singură nu pune nimic pe stoc: numărătoarea și recepția trebuie confirmate pe baza datelor verificate și a acordului utilizatorului, prin operația MCP disponibilă sau în aplicație. Deci: (1) recepția n-a fost dusă până la confirmare; (2) firma e pe `supervisor` (citește-l cu `get_reception_policy`) și recepția așteaptă un responsabil cu **drepturi financiare** — contabil sau manager cu acces la facturi, nu un manager de stoc; (3) a rămas o nelămurire care oprește confirmarea, cu motivul scris (`explain_photo_reception`). Un furnizor rămas pe 🔴 („alege tu") e exact unul dintre acele motive — se rezolvă alegând furnizorul, nu forțând postarea.
- **„ANAF/VIES n-a răspuns" NU înseamnă „furnizor nou".** Când ANAF/VIES tace (rețea, serviciu picat) sau nu acoperă țara codului (Elveția, Turcia, Serbia, Moldova, Norvegia, SUA…), recepția te întreabă pe tine — nu creează furnizorul. Nu forța crearea „ca să meargă acum": un duplicat făcut într-o pană de rețea rămâne în listă cu documente agățate de el și nu se mai desface. Mai încearcă peste câteva minute sau alege furnizorul din listă.
- **„Am deja furnizorul, dar mi-l propune ca nou."** Se întâmplă când în lista ta e salvat FĂRĂ cod fiscal, sau cu codul scris altfel. Verifică cu `resolve_supplier_identity({ taxId })` și, dacă rândul chiar există, completează-i codul fiscal pe fișa lui (`update_supplier`) — de la următoarea factură se recunoaște singur. Nu crea al doilea rând.
- **„De ce mi-a schimbat numele furnizorului?"** Un furnizor nou se creează cu **denumirea oficială** de la ANAF/VIES, nu cu ce scria pe hârtie — de asta apare «MEGA IMAGE S.R.L.» acolo unde pe factură era «Mega Image». E intenționat: așa se leagă între ele documentele viitoare de la același partener, în loc să se împrăștie pe două grafii.
- **„Pe factură scrie un furnizor, sistemul arată altul."** Codul fiscal bate denumirea — el e identitatea firmei, numele e doar text tipărit. Când cele două nu duc în același loc, recepția nu alege singură. Vezi cu `explain_photo_reception({ invoiceId })` ce a găsit și unde s-a împiedicat, apoi confirmă tu furnizorul corect.
- **Stoc/notă pe valoare 0** = ai uitat `unitCost` pe Calea A (sau costul lipsește din factură).
- **Serviciu pe cont de marfă (371)** = clasificare greșită. Alege natura corectă din `list_expense_destination_types` și remapează linia cu `productTypeCode`; verifică apoi finalizarea facturii. Nu schimba tipul unui produs comun tuturor facturilor pentru a corecta o singură cheltuială.
- **„Am schimbat contul pe linie și nota contabilă e la fel."** = normal, la marfa care intră pe stoc nota vine din TIPUL produsului (vezi Principii). Corectura se face pe tip (`update_product` / `change_product_type` 🔒 sau conturile tipului cu `update_product_type`), apoi se aplică `correct_confirmed_reception` și se verifică nota. Verifică rezultatul cu `get_journal_entries_summary`.
- **„AI-ul a mapat tot, dar o linie nu se acceptă."** = linia n-are cont valabil (regulă învățată din catalogul furnizorului, fără cont). Alege contul o dată pe acea linie sau pune tipul corect pe produs — după prima confirmare se învață. `accept_all_invoice_mappings` îți spune motivul pe fiecare linie blocată.
- **„Cantitatea a ieșit de 24 de ori mai mare (sau mult prea mică) după mapare."** = factor de pachet greșit sau lipsă. Valoarea liniei rămâne mereu cea din factură — se schimbă doar cantitatea și prețul unitar. Verifică pe linie cantitatea/prețul originale ale furnizorului vs cele mapate (`get_received_efactura_details`). Dacă NIR-ul NU e făcut: re-mapezi cu `packMultiplier` corect (numărul de bucăți din pachet) sau fără factor. Dacă NIR-ul e postat: `correct_invoice_line_mapping` → `correct_confirmed_reception`, cu numărătoare verificată dacă se schimbă și cantitatea fizică. **Obligatoriu corectează și regula învățată** din Reguli de Mapare, altfel se reaplică la următoarea factură.
- **„Vreau să anulez/modific un NIR postat."** Urmează [corecția sau anularea nominală](../../knowledge/corectare-receptii-mcp.md), cu previzualizare și verificarea documentului. Pentru anulare, începe cu `diagnose_inventory_document_reversal({ documentId })`; dacă o ciornă generată blochează operația, abandoneaz-o prin fluxul dedicat și reia diagnosticul. Consumul anterior nu este automat un blocaj pentru corecția nominală din restaurant, care poate regulariza diferențele. Respectă refuzul concret și limitele perioadelor contabile; nu compensa printr-o ajustare care ascunde urma.
- **Factura vine din contabilitate → e blocată la modificări.** Identitatea ei (furnizor, număr, sume, linii) e înghețată; se mai poate ajusta doar conversia de ambalaj. Restul se corectează în contabilitate — nu încerca s-o „repari" creând o recepție nouă.
- **„Permisiune insuficientă"** la `map_invoice_line` / `create_inventory_document` / `set_invoice_context` → tokenul n-are modulul `inventar` („Stocuri & Recepție"). Portal Hub → Acces AI.
- **Factură deja cu NIR** → `map_invoice_line` și câmpurile structurale din `set_invoice_context` se blochează (ar dezalinia stocul). Pentru linii folosește operația nominală `update_incoming_invoice_line` / `correct_invoice_line_mapping`, apoi `correct_confirmed_reception` (Faza 5). Corectarea liniilor nu deblochează automat antetul documentului.
- **Deductibilitatea TVA nu se reflectă în note?** Verifică politica, valorile liniilor și starea contabilizării; TVA nedeductibilă intră în cost. Prețul de raft este distinct: stocul se valorează la cost, nu la prețul de vânzare.

## Factură manuală de la zero (prin MCP)
Pentru o factură pe hârtie/PDF care NU vine prin eFactura/SPV sau OCR, folosește `create_incoming_invoice` (modul `financiar`) cu `invoiceNumber`, `invoiceDate`, `lines` și **CUI-ul furnizorului obligatoriu** (`supplierTaxId` sau `supplierCui`), inclusiv când dai `supplierId`. Identifică furnizorul existent ori transmite `supplierName`; citește și verifică identitatea din document și fișa furnizorului, fără cod inventat. Fiecare linie cere `description` și `quantity`, cu `unit`, `unitPrice`, `vatRate` și `mappedProductId` după caz. Completează brandul și locația verificate. Se creează o ciornă: apoi mapezi liniile și urmezi recepția pentru marfă sau finalizarea fără NIR pentru servicii.
