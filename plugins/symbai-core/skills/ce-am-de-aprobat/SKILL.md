---
name: ce-am-de-aprobat
description: Lista managerului cu tot ce așteaptă decizia lui — cereri din POS (retururi, din partea casei, discounturi, transferuri, deblocări de masă), plăți marcate manual, retururi online, mișcări de casă de verificat, ture rămase deschise, solicitări operaționale, ajustări de inventar, concedii — și cum le decide prin conexiune. La „ce am de aprobat", „ce așteaptă după mine", „aprobă cererile", „ce cereri sunt în așteptare", „a rămas o tură deschisă", „plată de confirmat".
---

# Ce am de aprobat

Strânge într-un singur răspuns tot ce așteaptă decizia managerului, grupat pe tip, cu suma și cine a cerut. **Citești tot, decizi numai ce îți spune omul**: fiecare aprobare/respingere de mai jos se aplică direct și apare în jurnal.

## 1. Citește (în paralel)

| Ce | Unealta (doar citire) |
|---|---|
| Cereri din POS: retur, din partea casei, discount, client pe notă, transfer, împărțire notă, deblocare masă, **plată marcată manual** | `list_operation_requests(status:"pending", types?)` — `types[]` din tipurile reale: `return`, `house`, `discount`, `customer`, `payment_confirmation`, `transfer_table`, `transfer_employee_request`, `transfer_items_request`, `split_bill`, `unlock_table`, `fiscal_reprint`, `cancel` |
| Plăți și mese agățate (plată în curs, sesiuni de card incerte) | `list_stuck_payments` |
| Retururi magazin online, pe pasul următor | `list_returns_needing_action(brandId?)` |
| Mișcări de casă de verificat | `list_cash_verification_queue(status, summaryOnly:true)` |
| Operațiuni de casă netrecute pe o casierie (încasări/plăți rămase neînregistrate) | `list_cash_pending_operations(registerId, businessDate)` sau `audit_cash_book_day(registerId, businessDate)` |
| Ture de casă rămase deschise | Închiderea de Zi (skill `inchidere-zi-casa`); închiderea unei ture cu `update_shift` (pasul 2) |
| Solicitări operaționale (inventar, aprobare manager, facturi contestate, predări numerar) | `list_automation_cases(status, assignedToMe?)` |
| Concedii în așteptare | `list_leave_requests(status:"pending")` |
| Ajustări de inventar „pending” | vezi skill-ul `gestioneaza-stocuri` (`approve_inventory_adjustment`) |

Prezintă scurt: câte pe fiecare tip, apoi rândurile (cine, masa/nota, ce, cât, motiv). Nu decide nimic încă.

## 2. Decide (doar la cererea explicită a omului)

- **Cereri POS** → `respond_operation_request(requestId, action:"approve"|"reject", note?)`. Retururile împărțite pe secții se decid pe sub-cereri. Transferurile le acceptă doar destinatarul, din conexiunea lui.
- **Plată marcată manual** (`payment_confirmation`) → o aprobă sau o respinge un manager, nu autorul ei: `respond_operation_request(requestId, action, paymentMethod?)` — `paymentMethod` (codul metodei active) doar la aprobare, când metoda trebuie corectată.
- **Discount cerut de ospătar** → tot `respond_operation_request`.
- **Retur online** → `approve_rma(id, refundMethod?)` / `reject_rma(id, rejectionReason)` (respingerea e definitivă). Rambursarea nu se face din conexiune: `process_rma_refund(id)` dă linkul spre `/ecommerce/returns`.
- **Mișcări de casă** → `bulk_review_cash_entries(action:"verify"|"reject", filtre)`: primul apel e previzualizarea, apoi `confirm:true` cu `expectedSelectionHash`. Detalii: skill `inchidere-zi-casa`.
- **Tură uitată deschisă** → `update_shift(shiftId, status:"completed", note?)`; dacă are note neîncasate sau plăți în așteptare, primești `SHIFT_CLOSE_NEEDS_CONFIRMATION` — arăți blocajele și, după acordul omului, reapelezi cu `force:true` + `confirmToken` (5 minute). Notele rămân deschise.
- **Solicitare operațională** → `resolve_automation_case(id, decision, note)`.
- **Concediu** → `update_leave_request(leaveRequestId, status:"approved"|"declined", reviewNote?)`.

## 3. Verifică

Recitește lista din pasul 1: cererea decisă nu mai apare „pending”. Raportează ce ai aprobat, ce ai respins și ce a rămas.

## Ce NU faci

- Nu aprobi în bloc fără să-i arăți omului lista.
- Pui `decidedBy:"human"` când omul a decis explicit această cerere (în chat sau pe WhatsApp); `decidedBy:"assistant"` doar pentru o decizie dintr-o regulă, fără răspunsul omului. `approvedBy` e ignorat: aprobatorul vine din identitatea conexiunii.
- Nu aprobi o plată manuală introdusă chiar de tine.
