---
name: investigheaza-masa
description: Investighează ce s-a întâmplat pe o masă, o notă, o comandă sau ce a făcut un ospătar — ce e pe masă ACUM, cine ce a comandat, anulări, discounturi, transferuri, plăți, retururi, cine a aprobat. PLUS cereri de aprobare în așteptare: vezi ce trebuie aprobat și aprobă/respinge direct. Folosește la „ce e pe masa 12", „ce a făcut ospătarul Ion azi", „de ce s-a anulat nota X", „cine a dat discountul", „ce am de aprobat", „aprobă returul de la masa 5".
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

### 2. „Ce a făcut ospătarul X?" → `get_employee_activity`
`get_employee_activity(employeeName: "Ion", date: "2026-06-16")` — `date` e opțional (implicit azi). Întoarce consolidat: bonuri finalizate, cât a vândut, bacșiș, bon mediu, mese lucrate, prima/ultima activitate, PLUS cererile lui de aprobare grupate pe tip (retururi/discounturi/casă/transferuri) și cele rămase în așteptare. Dacă numele se potrivește cu mai mulți angajați, tool-ul îți cere numele complet.
- Pentru cronologia minut-cu-minut (ce produs a adăugat/șters, la ce oră) → `jurnal_activitate(cauta: "Ion", perioada: "azi")`.
- Pentru comparația între ospătari (cine a vândut cel mai mult) → `performanta_ospatari`.

### 3. „Ce trebuie să aprob?" → `list_operation_requests`
`list_operation_requests(status: "pending")` — vezi toate cererile în așteptare cu tot ce-ți trebuie ca să decizi: tip, ospătar, masă, produse, valoare, motiv. Filtre utile: `type` (return/house/discount/customer/...), `employeeName` (toate cererile unui ospătar), `dateFrom`/`dateTo`. Întoarce și un rezumat (câte pe fiecare tip, top aprobatori).

### 3b. „Am conflict de sincronizare / shadow / Viva" → `list_shadow_order_conflicts`
`list_shadow_order_conflicts(status: "active")` — citește conflictele tehnice cloud-edge din Control Operațional. Sunt separate de cererile normale de aprobare și NU se aprobă cu `respond_operation_request`.
- Pentru `kind="new_item_on_terminal_parent"`: după 2026-06-21, produsele acoperite de subtotalul încasat se inserează automat; dacă mai vezi `conflictCode="viva_confirmed"`, produsul nou DEPĂȘEȘTE suma de produse acoperită de plata Viva. Explică managerului: „plata Viva e reală și suma e fixată; produsul acesta nu este acoperit de tranzacția confirmată".
- Workflow: `list_shadow_order_conflicts(orderId?/status:"active")` → dacă e nevoie de povestea notei, `get_order_timeline(orderId)` + `get_order_payments(orderId)` → dă link la Control Operațional (`/operations`) pentru decizie vizuală. Dacă tool-ul nu există încă pe tenant, folosește SQL read-only pe `operation_requests` cu `type='shadow_order_conflict'`.

### 4. „Aprobă / respinge cererea" → `respond_operation_request`
`respond_operation_request(requestId: 123, action: "approve", approvedBy: "Nume Manager", note: "…")` — aprobă sau respinge direct. Produce efectele complete (statusul produselor se actualizează, ospătarul primește notificare, se emit bonuri de retur la bucătărie, totul intră în jurnal).
- **Confirmă MEREU cu utilizatorul înainte** de a aproba/respinge (e o acțiune reală).
- **Excepție transferuri**: cererile de transfer între ospătari se pot doar RESPINGE de aici — aprobarea se face de ospătarul destinatar din aplicație (altfel produsele/masa nu s-ar muta efectiv).
- Necesită ca pe conexiune (token) să fie activat dreptul de scriere pe „Comenzi POS" (din portal Hub → Acces AI). Dacă lipsește, tool-ul îți spune.

### 5. „De ce s-a anulat nota X / ce s-a întâmplat cu comanda" → `get_order_timeline`
`get_order_timeline(orderId: 1234)` — povestea completă a unei comenzi: antet (masă, ospătar, client, totaluri), produsele cu statusul fiecărei linii (activ/anulat/returnat/transferat), plățile (metode, bacșiș, fiscal), cererile de aprobare legate și jurnalul de audit (cine ce a făcut, când).

### 6. „Cum s-a plătit nota / cât bacșiș / a fost refund" → `get_order_payments`
`get_order_payments(orderId: 1234)` — fiecare plată cu metoda, suma, bacșișul, cine a plătit (la split), dacă s-a tipărit fiscal, plus total pe metode.

### 6b. „Bucătăria nu a primit bonul / nu apare pe KDS" → timeline + KDS monitor
Începe cu `get_order_timeline(orderId)` ca să vezi dacă produsele au fost marcate trimise la bucătărie și dacă există bonuri/tichete. Apoi folosește tool-urile KDS unde există (`list_kds_screens`, `get_kds_order_history`, `get_kds_sessions`, `get_kds_timeline`) sau dă link la Monitorizare KDS din aplicație.

- Dacă produsul apare **nerutat**, problema e tag/rutare: verifică `list_tag_summary`, `list_tag_routing_rules` și pagina Setări → Rutare Taguri.
- Dacă `order_items.sentToKitchenAt` există, dar lipsesc bonurile KDS pe o locație cu Edge principal, explică: serverul local are o reconciliere automată care recuperează bonurile lipsă după aproximativ 1-2 minute și le trimite idempotent pe KDS/imprimantă.
- Dacă după câteva minute tot lipsesc, verifică rolul serverului local (principal vs secundar), ecranul KDS oprit/stale și jurnalul de activitate. Nu spune „s-a pierdut definitiv" fără dovadă.

### 7. Cronologie completă / orice eveniment → `jurnal_activitate`
`jurnal_activitate` rămâne instrumentul universal când vrei firul pe minute sau cauți ceva ce nu intră în tool-urile de mai sus. Filtre: `masa`, `tipEntitate`+`idEntitate` (ex. `order`/`operation_request`), `cauta` (text liber: nume ospătar, „discount", „anulat"), `categorie`, `perioada`/`startDate`/`endDate`. Citește `detalii` (text pentru oameni) și `modificari` (vechi → nou). Fără perioadă, întoarce cele mai recente potriviri.

## Reguli

- Începe cu tool-ul cel mai specific (masă → `get_table_status`; ospătar → `get_employee_activity`; aprobări → `list_operation_requests`). Cobori la `jurnal_activitate`/`get_order_timeline` doar pentru detaliu.
- Nu amesteca aprobările de ospătar cu `shadow_order_conflict`: pentru conflicte cloud-edge folosește `list_shadow_order_conflicts`; sunt decizii de Control Operațional, nu cereri normale de aprobare.
- Cronologie pe oră/minut; folosește nume de ospătar/manager, nu ID-uri.
- Pentru „cine a aprobat / cine a anulat" — citește autorul din eveniment, nu presupune.
- Sume în RON. Nu arunca date brute — sintetizează.
- Aprobare/respingere = acțiune reală: confirmă întâi cu utilizatorul, spune-i ce efect are.
- Dacă nu găsești ceva: verifică numărul mesei/notei sau ora, lărgește perioada, sau întreabă utilizatorul. La mese cu același număr în locații diferite, trimite și `locationId`.

## Corelări complexe (rar) — SQL
Dacă tokenul are acces SQL și ai nevoie de corelări pe care tool-urile de mai sus nu le dau (ex. cât a stat o comandă în bucătărie, agregări custom): `list_database_tables` → `describe_database_table` → `execute_sql_query` (doar SELECT) pe `orders` / `order_items` / `operation_requests` / `order_payments` / `audit_logs`, cu coloane explicite + WHERE + LIMIT. Dacă tokenul NU are SQL, tool-urile dedicate acoperă aproape tot — pentru analize chiar complexe, spune utilizatorului că poate activa „Interogări SQL" din portal Hub → Acces AI.
