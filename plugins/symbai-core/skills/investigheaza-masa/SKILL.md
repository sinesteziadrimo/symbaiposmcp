---
name: investigheaza-masa
description: Investighează o masă, o notă, o comandă sau un ospătar — ce e pe masă acum, cine ce a comandat, anulări, discounturi, transferuri, plăți, retururi, cine a aprobat; plus cereri de retur/discount/casă/client, transfer, split și aprobări/respingeri/acceptări. La „ce e pe masa 12", „ce a făcut ospătarul Ion azi", „de ce s-a anulat nota X", „cine a dat discountul", „ce am de aprobat".
---

# Investighează o masă / notă / ospătar + aprobă cereri

Scop: răspunzi clar și RAPID la „ce se întâmplă / ce s-a întâmplat / ce trebuie aprobat", folosind tool-uri dedicate (fără SQL, fără click prin aplicație). Alege tool-ul după întrebare — de cele mai multe ori un singur apel ajunge.

## Alege tool-ul după întrebare

### 1. „Ce e pe masa X ACUM?" → `get_table_status`
`get_table_status(tableName: "12")` — dai numărul/numele mesei așa cum îl știe ospătarul („12", „Masa 12", „M5", „Terasă 3"; nu contează diacriticele sau cuvântul „masa"). Întoarce într-un singur apel:
- ospătarul care ține masa + zona,
- comenzile active cu produsele lor (doar ce e activ pe notă, fiecare cu eticheta de status — ex. „RETUR în așteptare"),
- cât a rămas de plată,
- cererile de aprobare în așteptare pe masă (retur/discount/casă/transfer).

Pentru istoricul complet al unei comenzi anume de pe masă, treci la `get_order_timeline` cu orderId-ul returnat aici.

**Dacă userul vrea să scoată clientul de pe masă**: în POS Mobile, chip-ul clientului are buton `X` / „fără client". Acțiunea scoate clientul (și numele lui) de pe comenzile active ale mesei și resetează discountul la 0, ca să nu rămână reducerea clientului vechi. Dacă nu există tool MCP dedicat pe tenant, deschide POS-ul prin browser/Chrome logat și arată butonul; apoi verifică prin `get_table_status` / `get_order_timeline`.

### 2. „Ce a făcut ospătarul X?" → `get_employee_activity`
`get_employee_activity(employeeName: "Ion", date: "2026-06-16")` — `date` e opțional (implicit azi). Întoarce consolidat: bonuri finalizate, cât a vândut, bacșiș, bon mediu, mese lucrate, prima/ultima activitate, PLUS cererile lui de aprobare grupate pe tip (retururi/discounturi/casă/transferuri) și cele rămase în așteptare. Dacă numele se potrivește cu mai mulți angajați, tool-ul îți cere numele complet.
- Pentru cronologia minut-cu-minut (ce produs a adăugat/șters, la ce oră) → `jurnal_activitate(cauta: "Ion", perioada: "azi")`.
- Pentru comparația între ospătari (cine a vândut cel mai mult) → `performanta_ospatari`.

### 3. „Ce trebuie să aprob?" → `list_operation_requests`
`list_operation_requests(status: "pending")` — vezi toate cererile în așteptare cu tot ce-ți trebuie ca să decizi: tip, ospătar, masă, produse, valoare, motiv. Filtre utile: `type` (return/house/discount/customer/...), `employeeName` (toate cererile unui ospătar), `dateFrom`/`dateTo`. Întoarce și un rezumat (câte pe fiecare tip, top aprobatori). Nu include `shadow_order_conflict` nici în listă, nici în total; pentru acelea mergi la pasul 3b.
- **Retururi split pe secții**: un retur cu produse din mai multe secții (bucătărie/bar) apare ca o cerere „părinte" cu sub-cereri per secție. Decizia se ia pe fiecare sub-cerere, nu pe părinte — vezi excepția de la pasul 4.
- **Deblocare masă** (`unlock_table`): când unitatea are activ blocajul mesei după scoaterea notei, cererile de deblocare ale ospătarilor apar în același centru de aprobări și se aprobă/resping la fel ca celelalte.

### 3b. „Am conflict de sincronizare / shadow / Viva" → `list_shadow_order_conflicts`
`list_shadow_order_conflicts(status: "active")` — citește conflictele tehnice de sincronizare (între cloud și serverul local) din Control Operațional. Sunt separate de cererile normale de aprobare și NU se aprobă cu `respond_operation_request`.
- Pentru `kind="new_item_on_terminal_parent"`: produsele acoperite de subtotalul încasat se inserează automat; dacă vezi `conflictCode="viva_confirmed"`, produsul nou DEPĂȘEȘTE suma de produse acoperită de plata Viva. Explică managerului: „plata Viva e reală și suma e fixată; produsul acesta nu este acoperit de tranzacția confirmată".
- Workflow: `list_shadow_order_conflicts(orderId?/status:"active")` → dacă e nevoie de povestea notei, `get_order_timeline(orderId)` + `get_order_payments(orderId)` → dă link la Control Operațional (`/operations`) pentru decizie vizuală. Dacă tool-ul nu există încă pe instanță, trimite userul la pagina Control Operațional; alternativ, dacă tokenul are acces SQL doar-citire, poți căuta singur cererile de tip conflict de sincronizare (descoperă structura cu `list_database_tables` → `describe_database_table`).

### 4. Cereri și operațiuni POS prin conexiune nominală
Descoperă schema live a instrumentului înainte de apel. Dacă instanța nu are încă extensia, explică necesitatea actualizării și folosește numai funcțiile disponibile.

1. Identifică nota cu `get_table_status`, apoi citește `get_pos_operation_context(orderId)` pentru liniile exacte și cererile existente.
2. `create_pos_operation` creează `return`, `house`, `discount` sau `customer`. Returul/casa cer selecție explicită de linii și cantități. Discountul pe selecție se aplică numai liniilor întregi; pentru o parte din cantitate folosește întâi split. Nu transforma consumul inclus într-un eveniment în „din partea casei”.
3. `transfer_pos_items` mută selecția; `scope:"table"` mută întreaga masă, inclusiv liniile adăugate între timp. `transfer_pos_employee` transferă direct către ospătar cu dreptul corespunzător. `request_pos_transfer` trimite cererea către destinatar, pentru toată masa sau o selecție.
4. `split_pos_bill` împarte pe produse/cantități sau pe sumă; nu încasează. `cancel_pos_split` reunește o notă copil eligibilă.
5. `respond_operation_request(requestId, action)` decide cererea: `approve`/`reject`, `approve_return_stock`, `accept`/`decline` pentru transfer, `cancel` pentru retragere, `clarification` pentru retur/casă, `archive` pentru notificare respinsă. Identitatea vine din conexiune. Transferul se acceptă doar prin conexiunea destinatarului; nu inventa `approvedBy` ca să acționezi în numele lui. Returul împărțit pe secții se decide pe sub-cereri.

Folosește `confirm:true` și, unde este cazul, `applyDirect:true` în baza mandatului explicit deja primit, fără reconfirmări inutile. Aplicarea directă respectă drepturile și politica unității; verifică starea returnată. Pentru aceeași intenție păstrează UUID-ul `localId`. După timeout, `transfer_pos_items` se reia cu același `localId` și aceleași argumente: transferul deja făcut este recunoscut (`alreadyApplied`), fără a doua mutare. Pentru `transfer_pos_employee` și `request_pos_transfer` verifică întâi cererea și ambele note; pe acestea nu le retrimite automat. `paymentMethod` se folosește numai la aprobarea unei confirmări de plată încă deschise; dacă pașii se opresc, raportează și notele a căror metodă s-a schimbat deja. Pentru fiscal, plăți și anularea unei note folosește instrumentele dedicate din catalog, nu o modificare generică de status.

### 5. „De ce s-a anulat nota X / ce s-a întâmplat cu comanda" → `get_order_timeline`
`get_order_timeline(orderId: 1234)` — povestea completă a unei comenzi: antet (masă, ospătar, client, totaluri), produsele cu statusul fiecărei linii (activ/anulat/returnat/transferat), plățile (metode, bacșiș, fiscal), cererile de aprobare legate și jurnalul de audit (cine ce a făcut, când).

### 6. „Cum s-a plătit nota / cât bacșiș / a fost refund" → `get_order_payments`
`get_order_payments(orderId: 1234)` — fiecare plată cu metoda, suma, bacșișul, cine a plătit (la split), dacă s-a tipărit fiscal, plus total pe metode.

### 6b. „Bucătăria nu a primit bonul / nu apare pe KDS" → timeline + KDS monitor
Începe cu `get_order_timeline(orderId)` ca să vezi dacă produsele au fost marcate trimise la bucătărie și dacă există bonuri/tichete. Apoi folosește tool-urile KDS unde există (`list_kds_screens`, `get_kds_order_history`, `get_kds_sessions`, `get_kds_timeline`) sau dă link la Monitorizare KDS din aplicație.

- Dacă produsul apare **nerutat**, problema e tag/rutare: verifică `list_tag_summary`, `list_tag_routing_rules` și pagina Setări → Rutare Taguri.
- Dacă în cronologia comenzii produsele apar marcate ca trimise la bucătărie, dar lipsesc bonurile KDS pe o locație cu server local principal, explică: serverul local are o reconciliere automată care recuperează bonurile lipsă după aproximativ 1-2 minute și le trimite o singură dată pe KDS/imprimantă (fără dubluri).
- Dacă după câteva minute tot lipsesc, verifică rolul serverului local (principal vs secundar), ecranul KDS oprit/stale și jurnalul de activitate. Nu spune „s-a pierdut definitiv" fără dovadă.

### 7. Cronologie completă / orice eveniment → `jurnal_activitate`
`jurnal_activitate` rămâne instrumentul universal când vrei firul pe minute sau cauți ceva ce nu intră în tool-urile de mai sus. Filtre: `masa`, `tipEntitate`+`idEntitate` (ex. `order`/`operation_request`), `cauta` (text liber: nume ospătar, „discount", „anulat"), `categorie`, `perioada`/`startDate`/`endDate`. Citește `detalii` (text pentru oameni) și `modificari` (vechi → nou). Fără perioadă, întoarce cele mai recente potriviri.

## Reguli

- Începe cu tool-ul cel mai specific (masă → `get_table_status`; ospătar → `get_employee_activity`; aprobări → `list_operation_requests`). Cobori la `jurnal_activitate`/`get_order_timeline` doar pentru detaliu.
- Nu amesteca aprobările de ospătar cu `shadow_order_conflict`: pentru conflictele de sincronizare folosește `list_shadow_order_conflicts`; sunt decizii de Control Operațional, nu cereri normale de aprobare.
- Cronologie pe oră/minut; folosește nume de ospătar/manager, nu ID-uri.
- Pentru „cine a aprobat / cine a anulat" — citește autorul din eveniment, nu presupune.
- Sume în RON. Nu arunca date brute — sintetizează.
- Operațiile modifică nota: execută în limitele cererii utilizatorului și raportează starea efectivă, inclusiv pașii rămași.
- Dacă nu găsești ceva: verifică numărul mesei/notei sau ora, lărgește perioada, sau întreabă utilizatorul. La mese cu același număr în locații diferite, trimite și `locationId`.

## Corelări complexe (rar) — SQL
Dacă tokenul are acces SQL și ai nevoie de corelări pe care tool-urile de mai sus nu le dau (ex. cât a stat o comandă în bucătărie, agregări custom): `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar SELECT) pe tabelele de comenzi, produse pe comandă, plăți, cereri de aprobare și jurnal de audit — cu coloane explicite + WHERE + LIMIT. Dacă tokenul NU are SQL, tool-urile dedicate acoperă aproape tot — pentru analize chiar complexe, spune utilizatorului că poate activa „Interogări SQL" din portal Hub → Acces AI.
