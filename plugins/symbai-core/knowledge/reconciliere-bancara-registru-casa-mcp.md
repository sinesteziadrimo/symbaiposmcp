# Reconciliere bancară și registru de casă prin asistent (ChatGPT, Codex, Claude Code)

Folosește acest ghid când omul cere: „importă extrasul”, „reconciliază banca cu facturile”, „plata asta e pe mai multe facturi”, „de ce facturile apar neplătite deși le-am legat”, „comisioanele și salariile rămân nepotrivite”, „soldul casei nu se leagă de ziua precedentă”, „numerarul fără bon să apară separat”. Lucrează până la rezultat verificat, în limitele drepturilor persoanei. Verifică în conexiunea live că unealta există (`cauta_tool`); dacă versiunea instalată nu o are, spune limita și arată pagina: **Finanțe → Extrase bancare** (`/finance/bank-statements`).

## Ordinea de lucru, pe scurt

1. **Import**: `preview_bank_statement` → cifrele arătate omului → `import_bank_statement`.
2. **Potrivire**: `auto_match_bank_import` (un extras, mai multe sau un cont + perioadă), apoi `get_bank_reconciliation_review`.
3. **Legare de facturi**: o linie pe o factură, multe perechi într-un apel, o plată pe mai multe facturi.
4. **Înregistrarea plății**: `apply_bank_transaction_payments`. Fără acest pas facturile rămân neachitate.
5. **Liniile fără factură**: conturi proprii, transferuri interne, clasificare, reguli.
6. **Verificare**: acoperirea finală și ce a rămas, pe feluri.

Fiecare scriere cere acordul explicit al omului (`confirmedByHuman: true`) și un motiv (`reason`, minimum 10 caractere), care rămâne în jurnalul de audit. Operațiile în lot continuă peste eșecuri și spun, pe coduri, ce nu a mers.

## Importul extrasului

- **Trimite fișierul întreg al băncii, neschimbat.** Sunt citite direct: Banca Transilvania „Lista de tranzacții” (CSV), BRD arhiva UMS (`.zip` cu un CSV pe zi; o arhivă = un cont), ING Business „Istoric conturi” (CSV), ProCredit (CSV), plus MT940/CAMT/Excel de la celelalte bănci. Banca, contul, perioada și soldurile se recunosc din fișier.
- **Fișier mare sau venit pe WhatsApp:** `prepare_bank_statement_upload` dă adresa de încărcare și comanda exactă; apoi `preview_bank_statement` cu `uploadId`.
- **Previzualizarea e compactă la orice mărime.** `previewToken` și `resolutionDigest` vin primele. Rândurile se citesc cu `rows`: `issues` (implicit — doar cele cu probleme), `all` cu `rowsOffset`/`rowsLimit`, sau `none`. Nu împărți fișierul în bucăți.
- **Arată omului** contul, perioada, numărul și totalul plăților și încasărilor, soldurile și duplicatele, apoi `import_bank_statement` cu același token și aceleași argumente.
- **Solduri:** controlul folosește soldurile din extras (declarate sau rulante). Dacă exportul nu le are, le dai din documentul băncii prin `statementOpeningBalance` / `statementClosingBalance`. O diferență nu se acceptă automat.
- **Rânduri identice fără referință bancară** (de exemplu mai multe comisioane egale în aceeași zi): la re-import sunt recunoscute după soldul rulant, deci cele deja importate apar duplicate, iar cele reale lipsă intră. Când dovada nu ajunge, previzualizarea le listează și întreabă; răspunsul omului se trimite în `overlapDecisions` (`duplicate` sau `distinct` pe fiecare `sourceLine`), la fel la previzualizare și la import.
- **Ce nu se importă:** PDF-ul consolidat (cere exportul CSV sau MT940 din internet banking) și exportul BRD „STA”, care are numai solduri (cere UMS).
- **Import greșit:** `delete_bank_import` (întâi `dryRun`; spune ce îl blochează). Importurile care păstrează dovada originală a băncii nu se pot șterge — se corectează, nu se dublează.
- După import potrivirea rulează singură; `auto_match_bank_import` e util după ce adaugi facturi, conturi proprii sau reguli.

## Legarea plăților de facturile furnizorilor

- **O linie, o factură:** `match_bank_transaction_invoice`. Atribuie ÎNTREAGA tranzacție facturii.
- **Multe perechi deodată:** `match_bank_transactions_invoices` (până la 200 într-un apel).
- **Propunerile motorului**, inclusiv cele pe mai multe facturi: `confirm_bank_suggestions` (pe linii, pe extras sau pe perioadă; opțional `minConfidence`).
- **O plată pe mai multe facturi** (un OP pentru trei facturi, cu sau fără rest): `allocate_bank_transaction` cu suma pe fiecare factură. Facturile trebuie să fie ale aceluiași furnizor. Restul rămâne nealocat (avans sau sold anterior) și se raportează ca atare; nu se inventează diferențe.
- **Legarea NU înregistrează plata.** Factura rămâne „neachitată” până la `apply_bank_transaction_payments` (pe linii, pe extras ori pe perioadă) sau până când legarea se face cu `applyPayment: true`. În acoperire, `legate_fara_plata` / `linkedWithoutPayment` arată câte linii așteaptă acest pas. Reapelarea nu dublează plăți.
- **Legătură greșită:** `unmatch_bank_transaction_invoice`. Dacă plata a fost deja înregistrată: `reverse_bank_transaction_payment` — refuzată când plata a ajuns deja în contabilitate sau perioada e închisă; atunci spui limita, nu ocolești.
- O potrivire făcută doar pe sumă identică nu e dovadă. Verifică furnizorul, numărul facturii sau referința din descriere înainte de confirmare.
- Plățile vechi aplicate târziu: contabilitatea poate refuza o plată datată înaintea alteia deja înregistrate pe aceeași factură. Aplică extrasele în ordine cronologică.

## Liniile care nu au factură

`get_bank_remaining_by_kind` arată ce a rămas, pe feluri, și ce unealtă rezolvă fiecare fel.

- **Conturile firmei la alte bănci:** `add_own_bank_account` (IBAN-ul se validează; merge și când extrasul acelui cont nu e importat), `list_own_bank_accounts`, `deactivate_own_bank_account`.
- **Transferuri între conturile proprii:** `suggest_internal_transfer_pairs` propune perechile; `pair_bank_internal_transfer` le închide. Când cealaltă parte încă nu e importată, omite `inTransactionId` — se împerechează singură la importul ei. Se desface cu `unpair_bank_internal_transfer`.
- **Comisioane, dobânzi, salarii, taxe, rate de credit, decontări de card sau de platforme, restituiri:** `classify_bank_transactions` (până la 200 de linii într-un apel), cu o categorie și, opțional, contul contabil ales de om. Conturile din descrierea uneltei sunt doar propuneri. Se desface cu `unclassify_bank_transaction`.
- **Plățile cu cardul** (Metro, Selgros, benzinării…) nu au IBAN sau CUI. `create_bank_rule` leagă un text din descriere de un furnizor sau de o categorie. Regula pe furnizor dă doar partenerul; factura se confirmă tot din dovezi. `apply_bank_rules` cu `dryRun` arată întâi câte linii ar atinge; `list_bank_rules`, `deactivate_bank_rule`.
- **Încasări de la clienți:** `suggest_bank_receipt_documents`, apoi `link_bank_receipt_to_invoice` pe creanța dovedită. Decontările platformelor de livrare se închid deocamdată prin clasificare (`aggregator_payout`).
- Nu clasifica o linie care are factură doar ca să crească acoperirea.

## Registrul de casă

- **Soldul de deschidere nu se leagă de ziua precedentă:** `check_cash_book_chain` listează legăturile rupte; `recompute_cash_book_chain` le reface de la o dată (fără confirmare arată doar ce s-ar schimba). Pornește de la prima zi ruptă; unealta refuză dacă lanțul e rupt mai devreme și îți dă data corectă. De acum, orice mișcare cu dată în trecut recalculează singură zilele de după ea; răspunsul spune și ce zile închise s-au redeschis — anunță omul și reînchide-le.
- **Mișcare fără document („de verificat”):** `create_cash_book_entry` cu `verificationStatus: "de_verificat"`. Nu intră în totalurile legale până la `verify_cash_book_entry`. Registrul de casă nu generează note contabile, nici înainte, nici după validare.
- **Numerar încasat fără bon fiscal** (o metodă de plată cu „Printează bon fiscal” oprit): ca să intre în casă la predarea turei, metoda trebuie să aibă „Numerar în sertar” pornit (`update_payment_method_cash_flags` sau Setări → metode de plată). Partea fără bon intră ca „de verificat”, separat de numerarul cu bon; Z-ul și casa fiscală nu se schimbă. Istoricul se aduce cu `backfill_unfiscalized_cash_to_cash_book` — întâi `dryRun`.
- **Plata unei facturi de furnizor în numerar:** `pay_supplier_invoice_cash` înregistrează plata și linia de casă într-o singură operație. Pentru o plată deja scrisă manual în registru: `link_cash_entry_to_supplier_invoice` (nu creează a doua linie).
- **Banii primiți înapoi de la un furnizor** se scriu ca încasare cu furnizorul completat, nu ca „stornare” (stornarea anulează o mișcare greșită). Stornarea unei mișcări legate de plăți de furnizor anulează și plățile; previzualizarea le listează.
- **Depuneri și ridicări de numerar:** `suggest_cash_bank_matches` propune perechea casă–bancă; `confirm_bank_match` o confirmă.

## Capcane

- Un răspuns mare e tăiat de aplicația de chat. Uneltele de aici întorc rezumate și paginează; continuă cu `nextArguments`, nu cere „tot”.
- „Legat” nu înseamnă „plătit”; „clasificat” nu înseamnă „ajuns în contabilitate”. Spune exact ce s-a făcut.
- Nu modifica fișierul băncii ca să treacă o verificare (nu goli coloana de sold, nu tăia rânduri). Dacă soldurile nu se leagă, spune ce lipsește.
- Reversarea unei plăți și ștergerea unui import sunt operații care anulează date: se fac numai la cererea explicită a omului, cu motivul scris.
