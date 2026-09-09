# Corectarea recepțiilor prin MCP — ChatGPT, Codex și Claude Code

Folosește acest ghid la modificarea sau anularea unui NIR, a cantității primite, produsului, prețului, ambalajului, gestiunii ori facturii legate. Lucrează până la verificarea rezultatului, în limitele drepturilor persoanei și ale documentelor. Nu afirma că o operație este disponibilă numai în aplicație înainte de `cauta_tool` și verificarea conexiunii.

## Mai întâi identifică documentele și intenția

1. Verifică firma/conexiunea, factura și NIR-ul curent. `get_incoming_invoice_workflow_details` citește factura; `get_physical_reception_document` citește NIR-ul; `get_physical_reception_lines` citește liniile, cu `limit:25` și continuare până la `nextAfterId:null`.
2. Separă cantitatea de pe factură de cantitatea numărată fizic. Identifică liniile prin ID și verifică produsul, unitatea, gestiunea și lotul, nu numai denumirea.
3. Cererea explicită a utilizatorului autorizează schimbarea cerută. Folosește acordul deja dat și trimite `confirm:true` unde schema îl cere. Nu solicita încă un „OK” pentru aceeași operație verificată. Întreabă numai despre date lipsă, alegeri ambigue sau efecte suplimentare neautorizate.
4. Citește previzualizarea unde există. Înaintea anulării, folosește `preview_inventory_document_cancellation`. Un refuz explică pasul necesar; nu este un motiv să inventezi o ajustare compensatoare.

## Alege operația potrivită

| Cerere | Tool și continuare |
|---|---|
| Corectează cantitatea facturată, prețul, TVA sau descrierea | `update_incoming_invoice_line`; pe recepție postată verifică starea și continuă cu `correct_confirmed_reception`. |
| Schimbă produsul, contul sau conversia de ambalaj | `correct_invoice_line_mapping`; citește schema, păstrează câmpurile existente cerute și confirmă factorul fizic numai dacă a fost verificat. Apoi aplică recepția corectată. |
| Corectează antetul, furnizorul, datele sau totalurile | `update_incoming_invoice_context`, numai câmpurile schimbate. Respectă blocajele documentului oficial/contabilizat; corectarea unei linii nu deblochează automat antetul. |
| Corectează marfa efectiv primită, inclusiv nimic primit | `correct_confirmed_reception` cu cantitățile fizice verificate și `physicalVerificationConfirmed:true`. Zero este o cantitate validă, nu câmp omis. |
| Schimbă gestiunea sau împarte o linie pe gestiuni | `set_invoice_line_reception_warehouse`; citește și păstrează distribuția completă. Pe NIR postat finalizează corecția și verifică mișcările pe fiecare gestiune. |
| Corectează lotul furnizorului sau expirarea | `set_invoice_line_expiry`; `null` golește explicit câmpul. Verifică propagarea în trasabilitate. |
| Completează sau clarifică dovezi de trasabilitate | `set_invoice_traceability_field`, `set_invoice_line_traceability_field`, `resolve_invoice_traceability`, `resolve_invoice_line_traceability` sau `map_unmatched_invoice_traceability`, pe cheile exacte din document. |
| Împarte/reunește o linie | `split_invoice_line` / `undo_invoice_line_split`, pe documentele editabile. Pentru crearea NIR-ului după împărțire folosește `create_received_invoice_reception`, care citește subliniile persistate. |
| Include transportul în costul mărfii / anulează distribuția | `absorb_invoice_line` / `undo_invoice_line_absorption`. Se distribuie valoarea, nu se inventează cantitate. |
| Acceptă produsul propus de asistent | `accept_invoice_proposed_product`, după verificarea propunerii. |
| Corectează regulile pentru facturile viitoare | `update_mapping_rule`, `delete_mapping_rule`, `resync_invoice_mappings`. Regula modificată nu rescrie singură recepțiile postate. |
| Renunță la editările pregătite | `abandon_reception_correction` dacă factura este `nir_update_pending`; restaurează starea anterioară fără mișcare de stoc. |
| Anulează recepția postată | `preview_inventory_document_cancellation` → `cancel_inventory_document`, cu motiv și acordul existent. Documentul rămâne `CANCELLED` în istoric. |
| Șterge o ciornă | `delete_inventory_document_draft`, numai după verificarea stării `DRAFT`. |
| Reface recepția după anulare | Recitește factura redeschisă; corectează datele și folosește `create_received_invoice_reception`. Nu reactiva vechiul NIR și nu crea o recepție separată nelegată de factură. |
| Leagă avizul/fotografia de factura fiscală | `preview_received_invoice_link` → `link_received_invoice_to_reception` → `finalize_received_invoice`. |
| Finalizează factura pe marfa deja recepționată | `finalize_received_invoice`, fără al doilea NIR. `autoApprove:true` doar dacă utilizatorul a aprobat datele fiscale fotografiate. |
| Retrage factura deja contabilizată pe recepție pentru corecție | `preview_received_invoice_retraction` → `retract_received_invoice`. Cere dreptul `settings_access` și conexiune nominală fără PIN; stornează factura și evaluarea asociată, păstrând recepția fizică. |

La retragere, folosește `clearingId` și `journalEntryId` din preview drept `expectedClearingId` și `expectedJournalEntryId`, plus data reală a stornării și motivul. Nu înlocui ID-urile la retry: între timp poate exista o finalizare nouă, care nu aparține cererii vechi. După succes recitește documentele. Factura generată din recepție și factura foto care și-a produs propriul NIR păstrează legătura fizică. La factura separată, recepția revine la fotografia sau avizul original, iar factura fiscală poate fi corectată și reasociată prin fluxul verificat. Retragerea facturii și anularea recepției sunt operații distincte. Dacă trebuie refăcut și NIR-ul, anulează recepția după retragerea facturii, corectează documentul și creează recepția nouă legată de aceeași factură. Recitește ID-ul nou înainte de finalizare. Sistemul păstrează stornoul vechi în coada contabilă și îl livrează înaintea noii înregistrări; o coadă în așteptare nu este dovada unei sincronizări încheiate. Facturile provenite din Accounting ori cu plăți înregistrate cer întâi corecția prin fluxul lor contabil. Previzualizarea identifică nota; validările complete de reversibilitate se repetă la execuție.

## Cantitatea fizică și reluările sigure

La `correct_confirmed_reception`, `id` este ID-ul facturii, iar `expectedOldNirId` este ID-ul NIR-ului verificat. Creează o `idempotencyKey` pentru această corecție și păstrează **aceeași cheie, același NIR inițial și aceleași valori** la retry. O operație nouă primește o cheie nouă.

- `physicalQuantities`: mapă **ID linie factură → cantitate în unitatea de stoc**.
- `physicalLotQuantities`: mapă **ID linie din NIR-ul anterior → cantitate în unitatea de stoc**. Cheia vine din `get_physical_reception_lines.id`; nu folosi ID-ul unui lot din lista de stoc. `sourceIncomingInvoiceLineId` arată legătura cu factura.
- Nu trimite ambele forme pentru aceeași linie fiscală. Cantitățile acceptă maximum trei zecimale, inclusiv zero.
- Dacă ai corectat numai factura sau prețul, omite cantitățile fizice: numărătoarea anterioară se păstrează. Facturat 12 și primit 10 nu înseamnă că au sosit încă două bucăți.
- Dacă s-au schimbat unitatea, loturile sau distribuția și sistemul cere noua alocare fizică, obține numărătoarea reală; nu o deduce automat din factură.
- Un timeout înseamnă rezultat necunoscut. Recitește factura, NIR-ul și istoricul înainte de retry; nu genera altă cheie ca să „treacă”.

## Recepție deja consumată sau încă fără preț

La restaurante, consumul anterior nu impune automat ștergerea vânzărilor, producției sau consumului. `acknowledgeConsumedLots:true` exprimă acordul informat pentru corecția unei recepții consumate. Dacă utilizatorul a cerut deja exact această corecție și a acceptat efectul, nu cere o a doua confirmare formală. Dacă efectul este nou, explică faptul că lipsa poate rămâne temporar până la recepția corectă și cere numai decizia necesară.

Acoperirea consumurilor și diferențele de cost se regularizează prin fluxul recepției. **Nu reprocesa consumul zilnic doar fiindcă ai corectat sau anulat un NIR.** Reprocesarea este pentru schimbări de rețetă/reguli de consum ori un diagnostic care o cere separat.

„Preț necunoscut” și „preț zero” sunt stări diferite. Păstrează evaluarea în așteptare până la factura verificată. Costul deja cunoscut al altor ingrediente se păstrează. Nu completa zero ca să dispară un avertisment. Dacă schimbarea produsului fizic pe o recepție foto neevaluată este refuzată, urmează anularea verificată și recrearea din factura corectată, dacă documentele permit această cale.

## Asocierea facturii și diferențele pe linii

La tool-urile de asociere, `id` identifică **factura fotografiată**, iar `invoiceId` factura fiscală țintă. Verifică ambele identități. `lineDecisions` permite:

- `pair`: `invoiceLineId` + `receiptLineId`, o potrivire explicită între linia facturii și linia NIR-ului;
- `expense`: `invoiceLineId`, pentru o linie confirmată ca cheltuială;
- `accept_over_billed`: `invoiceLineId`, numai când utilizatorul acceptă explicit diferența facturată peste cantitatea primită.

Trimite aceleași decizii la previzualizare și asociere. Nu schimba factura oficială și nu crește fictiv cantitatea primită pentru a face sumele să coincidă. Asocierea și finalizarea sunt pași diferiți; verifică ambele rezultate. Pentru valută, cursul, data și sursa sunt verificate înainte de asociere și aprobare. La un refuz, completează snapshotul valutar oficial prin fluxul facturii și reia operația; nu inventa un curs și nu folosi sursa identity pentru valută.

## Verificare și protecții

Recitește factura și NIR-ul activ, cantitățile pe fiecare produs/gestiune și notele contabile. Pentru predarea contabilă folosește `get_reception_accounting_status`; `pending` sau `processing` nu înseamnă finalizare confirmată. La o eroare de sincronizare eligibilă folosește `retry_reception_accounting_sync`, apoi citește iar starea.

Istoricul inițial se păstrează, cu storno și diferențe valorice separate. Lunile închise, documentele fiscale oficiale, operațiile deja preluate de contabilitate și documentele de producție cu flux propriu au protecții reale. Explică motivul exact și calea oferită de sistem; nu redeschide automat luni și nu modifica direct datele financiare.

Conexiunile nominale folosesc tool-urile din acest ghid. Tool-ul `create_nir_from_invoice` rămâne limitat pentru linii împărțite/reunite; în acest caz folosește operația nominală de creare de mai sus. Tool-urile mai vechi `correct_reception_line`, `update_nir_from_invoice`, `void_inventory_document`, `abandon_nir_update`, `link_reception_to_invoice`, `finalize_reception_invoice` pot exista pe conexiuni organizaționale; nu presupune că un refuz de scope la ele înseamnă că lipsește operația nominală. Verifică lista live. Dacă versiunea instalată nu oferă încă tool-ul necesar, spune concret ce lipsește și folosește pagina canonică accesibilă, fără a simula succesul.
