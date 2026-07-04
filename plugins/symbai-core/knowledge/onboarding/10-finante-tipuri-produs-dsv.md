# Onboarding 10 — Finanțe, tipuri de produs (conturi contabile) și siguranța alimentară

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Conceptele financiare detaliate (registru de casă, e-Factura, note contabile): `../finante-facturare-contabilitate.md` — nu le duplica, referă-le.

## Scopul fazei

La final: (1) **tipurile de produs** au conturile contabile setate pe momente (recepție, vânzare, consum prin rețetă, producție) — fără asta notele contabile NU se generează automat la NIR-uri și vânzări; (2) **casieriile** (registrele de casă) și **soldurile inițiale** sunt configurate din aplicație, iar utilizatorul a văzut o dată wizard-ul de Închidere de Zi; (3) dacă unitatea prepară mâncare, scheletul **DSV/HACCP** există: senzori de temperatură + sarcini de curățenie; (4) utilizatorul știe unde sunt modulele Legal/GDPR și e-Factura. Faza depinde de: branduri/locații (faza 01), produse cu tipuri asignate (fazele de produse/meniu).

În conversația cu utilizatorul (om de business, non-tehnic): „conturi contabile pe tipuri de produs", „registru de casă", „jurnal de temperaturi" — niciodată „MCP", „tool", „endpoint", „JSON", „moment invoice_entry".

## Permisiuni necesare pe token

- **`financiar`** — tipuri de produs + plan de conturi: `create_product_type`, `update_product_type`, `update_product_type_accounts_per_unit`, `create_accounting_account`, `apply_accounting_codes`, `create_expense`.
- **`setari`** — DSV/HACCP: `create_haccp_sensor`, `create_cleaning_task`.
- Toate citirile (`list_product_types`, `get_accounting_overview`, `list_accounting_accounts`, `list_entities`, ...) sunt disponibile mereu, fără module. SQL (`execute_sql_query`) cere toggle-ul SQL separat pe token.

Fără modulul potrivit, tool-urile de scriere întorc „permisiune insuficientă" — modulele se bifează de utilizator în portalul Hub → Acces AI, nu din aplicația POS.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citiri automate (fă-le întâi, fără să anunți):**
1. `get_accounting_overview(brandId)` — starea contabilă dintr-un foc: tipurile de produs cu numărul de conturi per tip, **`typesWithoutAccounts`** (lista tipurilor fără conturi — ținta fazei), mărimea planului de conturi, numărul de note contabile, dacă sincronizarea cu Symbai Accounting e activă.
2. `list_product_types(brandId)` — fiecare tip cu proprietăți (canSell, hasStock, hasRecipe, hasReceptionPrice...) și conturile pe momente.
3. `list_accounting_accounts(brandId)` — planul de conturi, grupat pe clase; cu `codePrefix: "7"` doar veniturile etc.
4. `list_locations` — câte locații există (decide dacă are sens discuția despre conturi analitice per locație).
5. `list_entities(entityType: "haccp_sensors")` și `list_entities(entityType: "cleaning_tasks")` — ce există deja pe partea DSV. La aceste două entități filtrul `brandId` e IGNORAT — uită-te la `locationId` din rezultate.
6. `get_accounting_sync_status(brandId)` — doar dacă userul pomenește de contabil/Symbai Accounting.

**Întrebările MINIME:**
- Profilul de vânzare (decide ce tipuri contează): *„Vindeți doar preparate făcute în casă, sau și produse cumpărate și revândute ca atare (băuturi, ambalate)?"* — mărfurile (`merchandise`) au tratament contabil special (adaos comercial).
- Doar dacă există ≥2 locații: *„Vreți evidență contabilă separată per locație (conturi gen 371.01 / 371.02) sau aceleași conturi peste tot?"* Cu o singură locație NU pune întrebarea.
- DSV: *„Se prepară mâncare în unitate?"* Dacă nu (doar bar/magazin) — sări partea HACCP. Dacă da: *„Ce echipamente frigorifice aveți și cum le ziceți? (ex. frigider bucătărie, congelator bar)"* — numele devin senzorii.
- Confirmă O DATĂ planul (ce tipuri primesc ce conturi / ce senzori se creează) înainte de scrieri, apoi execută fără re-întrebări. Nu cere date opționale (topic-uri de senzori IoT, instrucțiuni detaliate de curățenie) — au valori implicite bune.
- NU întreba lucruri de contabilitate pură pe care utilizatorul nu le știe (ce cont pentru ce moment) — folosește standardele românești (vezi tabelul de mai jos) și spune-i contabilului „verificați conturile în aplicație".

## Pașii de execuție — tool-urile MCP exacte

### A. Tipuri de produs + conturi contabile

**Calea recomandată pentru setup de la zero: interfața, nu conexiunea.** Aplicația are un hub „Conturi pe Tip Produs" cu **template-uri 1-click** (peste 30 de tipuri standard românești cu toate conturile gata mapate pe momente, conform OMFP 1802) și buton „Completează/Repară" determinist. E mai sigur și mai complet decât să construiești tu zeci de tipuri prin conexiune. Ghidează: `gaseste_in_aplicatie(intrebare: "conturi pe tip de produs")`. Folosește MCP pentru **ajustări punctuale** și **verificare**, nu pentru recrearea catalogului standard.

Reperele contabile standard RO (ca să verifici/corectezi, nu ca să predai contabilitate):

| Tip (cod) | Stoc | Cheltuială la consum/vânzare | Venit |
|---|---|---|---|
| Materii prime (`raw_material`) | 301 | 601 (la vânzarea preparatului — moment `sale_via_finished`) | — |
| Mărfuri (`merchandise`, `hasReceptionPrice: true`) | 371 (+378 adaos, +4428 TVA neexigibilă — DOAR pe momentul `nir`) | 607 | 707 |
| Consumabile (`consumable`) | 3028 | 6028 | — |
| Ambalaje (`packaging`) | 3023 | 6023 | — |
| Semifabricate (`wip`, `isSemiPrepared`) | 341 | 711 la descărcare | — |
| Produse finite (`finished_good`, `hasRecipe`) | 345 | 711 la descărcare (metodologia template-ului) | 701 |
| Obiecte de inventar (`asset`) | 303 | 603 | — |
| Serviciu achiziționat (`service`) | fără stoc | 628 la intrare factură | — |
| Servicii prestate (`servicii_prestate`) | fără stoc | — | 704 |

Venitul vânzării NU se mapează de regulă pe conturile tipului — îl postează motorul contabil separat (în template-ul standard, mărfurile nu au rând de venit pe `direct_sale`; momentele de vânzare fac descărcarea de gestiune). Hub-ul semnalează drept conflict 707 pe produse din rețetă (corect: 701) și codul 7015 (inexistent în OMFP 1802).

**Pas 1 — diagnostic.** `get_accounting_overview(brandId)` → dacă `typesWithoutAccounts` e gol și tipurile acoperă profilul, faza contabilă e gata: doar raportează. Dacă nu există tipuri deloc → trimite utilizatorul la hub-ul din aplicație pentru template-uri, apoi re-verifică prin citire.

**Pas 2 — tip nou (doar dacă lipsește ceva specific).**
```
create_product_type(brandId: 1, code: "merchandise", name: "Mărfuri",
  canSell: true, hasStock: true, hasReceptionPrice: true,
  accounts: [
    { moment: "invoice_entry", label: "Stoc mărfuri", accountCode: "371", priceType: "purchase_no_vat", direction: "add" },
    { moment: "invoice_entry", label: "TVA deductibilă", accountCode: "4426", priceType: "purchase_vat", direction: "add" },
    { moment: "invoice_entry", label: "Furnizori (fără TVA)", accountCode: "401", priceType: "purchase_no_vat", direction: "subtract" },
    { moment: "invoice_entry", label: "Furnizori (TVA)", accountCode: "401", priceType: "purchase_vat", direction: "subtract" },
    { moment: "nir", label: "Stoc mărfuri (adaos)", accountCode: "371", priceType: "adaos", direction: "add" },
    { moment: "nir", label: "Stoc mărfuri (TVA neexigibilă)", accountCode: "371", priceType: "sale_vat", direction: "add" },
    { moment: "nir", label: "Adaos comercial", accountCode: "378", priceType: "adaos", direction: "subtract" },
    { moment: "nir", label: "TVA neexigibilă", accountCode: "4428", priceType: "sale_vat", direction: "subtract" },
    { moment: "direct_sale", label: "Cheltuială mărfuri (preț vânzare cu TVA)", accountCode: "607", priceType: "sale_with_vat", direction: "add" },
    { moment: "direct_sale", label: "Descărcare stoc", accountCode: "371", priceType: "sale_with_vat", direction: "subtract" },
    { moment: "direct_sale", label: "Stornare adaos", accountCode: "378", priceType: "adaos", direction: "add" },
    { moment: "direct_sale", label: "Reducere cheltuială (adaos)", accountCode: "607", priceType: "adaos", direction: "subtract" },
    { moment: "direct_sale", label: "TVA neexigibilă trecută la colectată", accountCode: "4428", priceType: "sale_vat", direction: "add" },
    { moment: "direct_sale", label: "TVA colectată", accountCode: "4427", priceType: "sale_vat", direction: "subtract" }
  ])
```
Setul de mai sus e identic cu template-ul standard de mărfuri — fiecare moment vine PERECHE debit/credit (echilibrat); nu trimite jumătăți de seturi. Obligatorii: `brandId`, `code`, `name`. În `accounts[]` obligatorii: `moment`, `label`, `accountCode`, `priceType`. **NU e idempotent**: cod existent → eroare cu ID-ul tipului existent în mesaj → continuă cu `update_product_type` pe acel ID, nu inventa alt cod.

**Pas 3 — ajustare tip existent.**
```
update_product_type(productTypeId: 7, brandId: 1, hasReceptionPrice: true, accounts: [ ...SETUL COMPLET... ])
```
Obligatorii: `productTypeId`, `brandId`. ⚠ `accounts` **ÎNLOCUIEȘTE toate conturile globale ale tipului** — trimite mereu setul complet (citește-l întâi cu `get_product_type_details(productTypeId, brandId)`), niciodată doar contul modificat. Override-urile per locație nu sunt atinse de acest tool.

**Pas 4 — conturi diferite per locație (doar multi-locație, doar la cerere).**
```
update_product_type_accounts_per_unit(productTypeId: 7, brandId: 1, locationId: 2, accounts: [ ...setul complet pentru această locație... ])
```
Toate cele 4 obligatorii. Înlocuiește setul DOAR pentru locația dată; conturile globale rămân fallback pentru restul.

**Pas 5 — cont nou în plan (rar).** Conturile analitice cu punct (ex. `371.01`) folosite în `accounts[]` se creează **automat** în planul de conturi — de regulă NU ai nevoie de `create_accounting_account`. Folosește-l doar pentru un cont care nu derivă dintr-o mapare:
```
create_accounting_account(brandId: 1, code: "707.02", name: "Venituri terasă", type: "revenue", parentCode: "707")
```
Cod existent → eroare (verifică întâi cu `list_accounting_accounts`).

**Pas 6 — coduri de export per produs (doar dacă contabilul extern le cere).**
```
apply_accounting_codes(assignments: [{ productId: 101, accountingExportCode: "707.01" }, ...])
```
Setează `accountingExportCode` pe produs — câmp de **export** către softul de contabilitate, separat de maparea pe momente a tipului. Nu-l folosi în locul Pașilor 2-4.

### B. DSV / HACCP (doar unități care prepară mâncare)

**Pas 7 — senzori de temperatură**, unul per echipament frigorific:
```
create_haccp_sensor(name: "Frigider Bucătărie", locationId: 2, sensorType: "fridge")
```
Obligatorii: `name`, `locationId`. `sensorType`: `fridge` (limite implicite 0–4°C), `freezer` (−22…−16), `cold_room` (0–4), `hot_hold` (63–90), `ambient` (18–25) — limitele implicite sunt corecte HACCP, nu le suprascrie fără motiv. Idempotent pe nume.

**Pas 8 — sarcini de curățenie** (planul de igienizare):
```
create_cleaning_task(name: "Igienizare suprafețe de lucru", locationId: 2, area: "bucătărie",
  frequency: "daily", checklistItems: ["Curățare cu detergent", "Dezinfectare", "Verificare vizuală"])
```
Obligatorii: `name`, `locationId`. `frequency`: `daily | weekly | monthly | shift` (implicit daily). Idempotent pe nume+locație. Set minim rezonabil: suprafețe de lucru zilnic, frigidere săptămânal, igienizare generală lunar — propune, nu impune.

### C. Cheltuieli (mențiune, nu onboarding)

`create_expense(brandId, category, amount)` înregistrează o cheltuială punctuală (chirie, utilități) pentru P&L — e operare de zi cu zi, nu configurare. N-o folosi în onboarding decât dacă utilizatorul cere explicit; verifici cu `list_entities(entityType: "financial_transactions", brandId)`.

**După FIECARE scriere: confirmă printr-o CITIRE** (`list_product_types`, `get_product_type_details`, `list_entities`...), nu prin interfață — aplicația are cache în browser și arată datele noi abia după refresh. Dacă tool-ul a întors succes, datele SUNT salvate: nu repeta scrierea, nu raporta bug.

## Ce se face DOAR din aplicație

- **Casieriile (registrele de casă)** — nu există tool-uri prin conexiune. Ghidează: `gaseste_in_aplicatie(intrebare: "configurare casierii registru de casă")` — utilizatorul alege modul de organizare (per firmă / locație / brand×locație) și apasă „Regenerează casieriile". Verificare după: cu SQL activ, `execute_sql_query` SELECT pe `cash_registers`; altfel cere-i confirmarea („câte casierii vezi în listă?").
- **Soldurile inițiale** (cât e în casă/cont la pornire + datorii clienți/furnizori) — `gaseste_in_aplicatie(intrebare: "solduri inițiale")`. Sfătuiește: data de pornire = ziua dinaintea primei zile de vânzări în Symbai.
- **Închiderea de Zi** — wizard în 3 pași (verificare operațională: ture predate + numărare cash → sumar vânzări + raport Z → sigilarea zilei în registrul de casă); în onboarding utilizatorul doar îl parcurge o dată ca să-l cunoască. `gaseste_in_aplicatie(intrebare: "închidere de zi")`.
- **e-Factura ANAF** — conectarea la SPV e OAuth în browser, exclusiv din aplicație. `gaseste_in_aplicatie(intrebare: "e-Factura ANAF")`.
- **Legal & GDPR** — contracte din șabloane, semnătură electronică, politici GDPR, fișe de post: totul prin paginile AI Legal și Contracte (niciun tool de contracte prin conexiune). `gaseste_in_aplicatie(intrebare: "contracte și AI legal")`. Amintește-i că documentele generate de AI se verifică cu un consilier juridic.
- **Jurnalele HACCP zilnice** (temperaturi, incidente, mostre, audituri) — se completează de echipă în pagina HACCP; fișele tehnice de produs le generează asistentul AI de siguranță alimentară din aplicație. `gaseste_in_aplicatie(intrebare: "HACCP dashboard")`.
- **Ștergerile** (tip de produs, senzor, sarcină, cont) — doar din aplicație; nu promite ștergeri prin conexiune.

## Echivalentul în wizard-ul din aplicație

Pașii **15, 16 și 17** din `/onboarding`: pasul 15 „DSV Chef — HACCP & Conformitate" (ghidare către HACCP Dashboard + asistentul AI de legislație), pasul 16 „Finanțe — setup de bază" (casierii, solduri inițiale, închidere de zi; chat-ul pasului e „Sym Contabilitate", care face exact tipurile de produs + conturile din această fază), pasul 17 „Legal — Contracte & AI Legal". Toți trei pașii sunt marcabili „Sari acest pas" — sunt pași de familiarizare, nu de blocare. Entitățile create prin conexiune (tipuri, senzori, sarcini) APAR în aplicație, dar **progresul wizard-ului (bifa de pas) NU se actualizează prin conexiune** — utilizatorul apasă singur „Următorul pas".

## Verificare la final

- [ ] `get_accounting_overview(brandId)` — `typesWithoutAccounts` gol (sau conține doar tipuri pe care utilizatorul nu le folosește), plan de conturi populat.
- [ ] `list_product_types(brandId)` — tipurile folosite de produsele reale au conturi pe momentele relevante (mărfuri: și `nir`; materii prime: și `sale_via_finished`).
- [ ] Dacă s-au făcut override-uri per locație: `get_product_type_details(productTypeId, brandId)` le arată per unitate.
- [ ] Dacă s-a făcut DSV: `list_entities(entityType: "haccp_sensors")` + `list_entities(entityType: "cleaning_tasks")` — senzorii și sarcinile există, cu `locationId` corect (filtrul `brandId` NU se aplică la aceste entități).
- [ ] Utilizatorul confirmă casieriile + soldurile inițiale din aplicație (sau SELECT pe `cash_registers` dacă SQL e activ).
- [ ] Dacă folosește Symbai Accounting: `get_accounting_sync_status(brandId)` — conectat, CUI setat.

## Capcane

- **TVA România = 0% / 11% / 21%** (alimente 11, alcool/standard 21) — NICIODATĂ 5/9/19, chiar dacă exemple mai vechi din aplicație le mai amintesc. La calcule de adaos/TVA neexigibilă folosește cotele corecte.
- **`update_product_type` cu `accounts` = înlocuire totală a conturilor globale.** Trimite doar delta → pierzi restul conturilor și contabilitatea automată se strică silențios. Citește întâi setul complet cu `get_product_type_details` și retrimite-l integral cu modificarea.
- **Override per locație DOAR prin `update_product_type_accounts_per_unit`.** Schema lui `update_product_type` acceptă `locationId` pe conturi, dar valorile trimise acolo sunt ignorate — nu ajung nicăieri. Nu raporta bug; folosește tool-ul dedicat.
- **378 și 4428 aparțin DOAR momentului `nir`** (adaosul comercial la mărfuri). Pe `invoice_entry` sunt eliminate automat la update (silențios la update global, cu avertisment la per-unit) — dacă „dispare" un cont, asta e cauza. La `create_product_type` filtrul NU rulează — pune-le corect de la început.
- **401 (Furnizori) și 4111 (Clienți) NU primesc analitice** — `401.X`/`4111.X` sunt corectate automat la codul de bază; analiticele per partener se creează singure la facturare. Nu insista.
- **Conturile analitice cu punct se creează automat** în planul de conturi când le folosești în `accounts[]` — nu chema `create_accounting_account` preventiv pentru ele.
- **`create_product_type` și `create_accounting_account` întorc EROARE la duplicate** (cu ID-ul/numele existent în mesaj), nu entitatea existentă — citește mesajul și treci pe update, nu reîncerca cu alt cod inventat.
- **Idempotența `create_haccp_sensor` e pe nume GLOBAL** (nu per locație): „Frigider Bucătărie" la două locații → al doilea apel întoarce senzorul primei locații. Include locația în nume la multi-locație („Frigider Bucătărie — Centru").
- **`create_haccp_sensor.alertEnabled` e acceptat dar deocamdată ignorat** — nu promite utilizatorului că ai activat/dezactivat alertele prin conexiune; alertele se gestionează din pagina HACCP.
- **`create_cleaning_task`: `responsibleRole` și `checklistItems` ajung ca TEXT în notele sarcinii**, nu câmpuri structurate — e ok pentru checklist-ul afișat, dar nu te aștepta la asignare automată pe rol.
- **`create_expense.accountingCode` ajunge doar ca notă text** — nu generează notă contabilă pe acel cont. Contabilitatea automată vine din conturile tipurilor de produs + documente (NIR, vânzări), nu din cheltuielile manuale.
- **Conturile fără tipuri = rapoarte goale.** Dacă produsele reale au `productType` neasignat sau tip fără conturi, NIR-urile și vânzările NU generează note contabile — verifică și legătura produs→tip (fazele de produse), nu doar tipurile în sine.
- **Hub-ul din aplicație bate construcția manuală**: pentru un tenant fără tipuri configurate, template-urile 1-click din „Conturi pe Tip Produs" creează tot setul standard corect. Prin conexiune ai face zeci de apeluri cu risc de greșeli de mapare — recomandă UI-ul, apoi verifică și ajustează prin MCP.
