# Conformitate: actele firmei, obligațiile legale și registrul de deșeuri

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă modulul de **Conformitate**: dosarul cu actele firmei, catalogul obligațiilor legale românești, formularele oficiale, registrul de deșeuri și autorizările către autorități. Pentru HACCP (planul de siguranță alimentară, temperaturi, trasabilitate) vezi `haccp.md`; pentru documentele de personal vezi `personal-ture-pontaj.md`.

## Pe scurt

Un local ține zeci de acte care **expiră**: autorizația sanitar-veterinară, contractul de deratizare, polița RCA a mașinii de livrare, verificarea ISCIR la centrală, certificatul constatator. Când unul expiră nu sună nimeni — afli la control, cu amenda pe masă.

Modulul de Conformitate ține actele într-un singur loc, cu data lor de expirare, îți spune ce e restant și ce urmează, îți explică fiecare obligație legală (temei, autoritate, termen, sancțiune) și îți generează formularele oficiale precompletate. Separat, ține **registrul de gestiune a deșeurilor** (HG 856/2002), pe care îl cere Garda de Mediu.

## Concepte

- **Act al firmei** — un document scanat cu tip, dată de emitere, dată de expirare și starea lui (valabil / expiră curând / expirat). Poate fi trimis cuiva direct din aplicație.
- **Obligație legală (cerință de conformitate)** — o regulă din catalogul românesc, aplicabilă domeniului tău: cine e obligat, în ce condiții, până când, ce act produce, cât e valabil și ce sancțiune are. Catalogul e comun tuturor clienților; **starea** fiecărei obligații e a firmei tale.
- **Formular oficial** — un document tipizat pe care sistemul îl precompletează cu datele firmei și îți dă linkul de tipărire, spunându-ți explicit ce n-a putut completa singur.
- **Registru de deșeuri** — evidența lunară pe fiecare cod de deșeu: stoc inițial, generat, valorificat, eliminat, stoc final. Se închide lună de lună. Codurile periculoase sunt marcate separat.
- **Operator de deșeuri** — firma autorizată căreia îi predai deșeurile; apare pe mișcările din registru.
- **Autorizare către autoritate** — dreptul dat platformei de a comunica în numele firmei cu o autoritate (ANAF, ANSVSA etc.): ce fel de autorizare cere fiecare, dacă e activă și până când.

## Paginile modulului

- **Panou Conformitate** (`/compliance`) — ce e rezolvat, ce e restant, ce urmează.
- **Documentele firmei** (`/compliance/company-documents`) — dosarul cu acte, cu expirări.
- **Formulare** (`/compliance/forms`) — formularele oficiale precompletabile.
- **Registrul de deșeuri** (`/compliance/waste-register`) — evidența lunară pe coduri.
- **Autorizări autorități** (`/compliance/authority-authorizations`) — ce poate face platforma în numele firmei.

## Prin conexiune (MCP)

Toate cer grantul de citire **Setări & Configurare**; scrierile cer același modul la scriere.

**Ce vezi:**
- `list_company_documents` — actele firmei, cu starea și expirarea. Filtre pe brand, stare, tip, căutare.
- `find_company_document` — caută UN act după o descriere în limbaj natural („certificatul constatator", „contractul cu firma de deratizare").
- `list_expiring_documents` — ce expiră curând. **Ăsta e tool-ul de rulat lunar.**
- `get_compliance_status` — ce e rezolvat, ce e restant, ce urmează.
- `search_compliance_requirements` / `explain_compliance_requirement` — catalogul obligațiilor și explicația completă a uneia (temei, autoritate, termen, sancțiune).
- `list_compliance_forms` / `generate_compliance_form` — formularele oficiale și generarea unuia precompletat.
- `get_waste_register` — registrul pe o lună, pe coduri de deșeu.
- `list_waste_operators` — firmele autorizate cu care lucrezi.
- `list_authority_authorizations` / `get_authority_authorization` — ce autorizări are platforma și până când.

**Ce poți schimba:** `create_company_document`, `update_company_document`, `send_company_document` (trimite actul cuiva), `set_compliance_item_status`, `record_waste_movement`, `close_waste_register_month`, `generate_conformity_document`, `record_authority_authorization`.

## Greșeli frecvente

- **„Am pus actul, dar tot apare restant."** Actul și obligația legală sunt două lucruri: încarcă documentul ȘI leagă-l de cerința pe care o acoperă, altfel catalogul nu are de unde ști că s-a rezolvat.
- **Trimiterea unui act expirat.** Trimiterea refuză deliberat un act expirat; se poate forța, dar un partener care primește o autorizație expirată e mai rău decât unul care nu primește nimic.
- **Descriere care se potrivește la mai multe acte.** Nu se ghicește — un contract trimis din greșeală în locul altuia a ajuns deja la destinatar și nu mai poate fi retras. Precizează.
- **Închiderea lunii de deșeuri „ca să nu mai apară".** Odată închisă, luna e evidența pe care o vede Garda de Mediu. Închide-o după ce ai înregistrat toate predările, nu înainte.
- **Confuzia cu HACCP.** Temperaturile din frigidere, trasabilitatea loturilor și planul de siguranță alimentară sunt în modulul HACCP, nu aici.
