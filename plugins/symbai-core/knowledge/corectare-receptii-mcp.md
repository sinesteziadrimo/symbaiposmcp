# Corectarea recepțiilor prin MCP — ChatGPT, Codex și Claude Code

Folosește acest ghid la modificarea sau anularea unui NIR, a cantității primite, produsului, prețului, ambalajului, gestiunii ori facturii legate. Lucrează până la verificarea rezultatului, în limitele drepturilor persoanei și ale documentelor. Nu afirma că o operație este disponibilă numai în aplicație înainte de `cauta_tool` și verificarea conexiunii.

## Corecție pe documentul existent, fără storno inutil

**Data intrării și prețul de achiziție se corectează pe documentele existente.** Nu crea o factură nouă, nu anula NIR-ul și nu retrage factura doar fiindcă marfa a fost consumată. Cererea utilizatorului pentru această corecție este acordul necesar; `confirm:true` nu impune o a doua întrebare.

Verifică sursa și starea facturii: un câmp fiscal protejat poate avea alt flux de corecție. Nu promite aceeași editare pentru orice proveniență și orice câmp; citește rezultatul operației. Existența unui NIR sau a consumului nu justifică singură o anulare.

Pentru factura generată din propriul NIR deja postat și evaluat, corecția exclusiv economică (preț/valoare/TVA) păstrează NIR-ul când liniile sunt legate individual și verificabil. Acest flux cere să nu existe finalizare separată pe aviz/provizorat, preluare externă în Accounting, document ANAF sau altă protecție fiscală aplicabilă. Nu schimba marfa fizică prin această factură generată și nu modifica prețul de vânzare ori gestiunea ca efect secundar. Citește eligibilitatea returnată de sistem.

- **Data reală a intrării:** `set_reception_operational_date({id: ID_FACTURA, receiptDate: "AAAA-LL-ZZ", confirm: true})`. ID-ul este al facturii. Data oficială `invoiceDate` și data înregistrării `registrationDate` se păstrează. Nu le substitui pentru a muta recepția. Această salvare este suficientă pentru dată; nu apela și corecția NIR-ului dacă nu ai pregătit separat schimbări de linii.
- **Prețul de achiziție introdus greșit:** citește linia și documentul-sursă, folosește `update_incoming_invoice_line` cu `invoiceId`, `lineId` și valorile corectate verificate; apoi `correct_confirmed_reception` cu `id: ID_FACTURA`, `expectedOldNirId` citit și o `idempotencyKey` stabilă. Omite cantitățile fizice, `physicalVerificationConfirmed` și `acknowledgeConsumedLots` dacă numărătoarea nu se schimbă. Nu activa stocul negativ pentru această corecție. Câmpul `receptionPrice` desemnează prețul de vânzare/raft în fluxul respectiv; nu îl confunda cu prețul de achiziție al facturii.
- **Ambele:** salvează separat data operațională și liniile, prin operațiile de mai sus, apoi verifică rezultatul. Nu trimite data recepției ca dată fiscală.

La restaurante, costurile FIFO se recalculează în fundal, inclusiv pentru consumuri deja acoperite, semipreparate și transferuri. Se schimbă costul atribuit și marja; cantitățile istorice, rețetele deja folosite și prețul plătit de client se păstrează. Nu șterge și nu reprocesa consumul zilnic pentru o asemenea corecție.

Verifică existența tool-urilor în conexiunea live. Dacă versiunea instalată nu le oferă, caută operația și pagina canonică; nu reveni automat la anulare/recreare și nu pretinde că noul comportament este deja disponibil.

## Mai întâi identifică documentele și intenția

1. Verifică firma/conexiunea, factura și NIR-ul curent. `get_incoming_invoice_workflow_details` citește factura în pagini (implicit 10 linii, maximum 25); continuă cu argumentele complete din `pagination.nextArguments` până la `null`. `expectedRevision` este obligatoriu după prima pagină; dacă documentul s-a schimbat, recitește de la început. Câmpurile extinse oferă `readArguments`: continuă cu `detail.nextArguments`, păstrând `detailRevision`, concatenează `detail.text` și apoi decodează JSON. Nu considera descriptorul unui câmp drept valoarea lui. `get_physical_reception_document` citește NIR-ul cu `id: ID_NIR`; `get_physical_reception_lines` citește liniile, cu `limit:25` și continuare până la `nextAfterId:null`.
2. Separă cantitatea de pe factură de cantitatea numărată fizic. Identifică liniile prin ID și verifică produsul, unitatea, gestiunea și lotul, nu numai denumirea.
3. Cererea explicită a utilizatorului autorizează schimbarea cerută. Folosește acordul deja dat și trimite `confirm:true` unde schema îl cere. Nu solicita încă un „OK” pentru aceeași operație verificată. Întreabă numai despre date lipsă, alegeri ambigue sau efecte suplimentare neautorizate.
4. Citește previzualizarea unde există. Înaintea anulării, folosește `preview_inventory_document_cancellation`. Un refuz explică pasul necesar; nu este un motiv să inventezi o ajustare compensatoare.

## Alege operația potrivită

| Cerere | Tool și continuare |
|---|---|
| Corectează cantitatea facturată, prețul, TVA sau descrierea | `update_incoming_invoice_line`; pe recepție postată verifică starea și continuă cu `correct_confirmed_reception`. |
| Schimbă produsul, contul sau conversia de ambalaj | `correct_invoice_line_mapping`; citește schema, păstrează câmpurile existente cerute și confirmă factorul fizic numai dacă a fost verificat. Apoi aplică recepția corectată. |
| Corectează data efectivă a intrării | `set_reception_operational_date`, apoi citirea facturii și a stării FIFO; fără storno, chiar dacă marfa este consumată. |
| Corectează prețul de vânzare al mărfii recepționate | `correct_confirmed_reception` cu `lineSellingPrices`: ID linie factură → preț de raft unitar CU TVA, în unitatea de stoc. Se acceptă și text cu virgulă zecimală. Liniile omise își păstrează baza istorică; nu copia prețul actual din catalog. Aceeași mapă este disponibilă la `create_received_invoice_reception`. |
| Corectează antetul fiscal, furnizorul sau totalurile | `update_incoming_invoice_context`, numai câmpurile schimbate. Data facturii și data înregistrării au propriile protecții; nu le confunda cu data intrării. Un refuz nu autorizează automat storno. |
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

**Returul la furnizor poate avea surse în gestiuni diferite.** Verifică schema live: `create_received_invoice_reception` și `correct_confirmed_reception` oferă `lineWarehouses` (ID linie factură → `{warehouseId, splits?}`). Trimite numai liniile schimbate; cele omise își păstrează alegerea. Poți folosi și `set_invoice_line_reception_warehouse`, apoi aplicarea canonică. Verifică gestiunea și lotul real al fiecărui produs; configurarea actuală a produsului pentru intrări nu mută automat sursa unui retur. Un transfer între gestiuni este o operație fizică distinctă, nu un pas obligatoriu pentru finalizarea returului. O restricție întâlnită pe o versiune veche se notează cu versiunea și eroarea, nu ca regulă permanentă pentru toate retururile. Documentele provenite din Accounting își păstrează propriul flux.

La `confirm_physical_reception`, cantitățile `receivedItems` sunt pentru liniile de **intrare**. Pentru un document de retur cu numai ieșiri, citește și verifică mai întâi cantitățile documentului, apoi folosește `receivedItems:[]` dacă schema live îl permite: cantitățile returului rămân cele documentate. Nu transforma ieșirile în cantități primite. Pentru o recepție normală, confirmă fiecare linie de intrare, inclusiv zero; lista goală nu înlocuiește numărătoarea.

Factura finalizată separat pe o recepție provizorie poate oferi în aplicație **„Redeschide factura pentru corecție”**, în bannerul facturii. Este același flux de retragere contabilă, cu autentificare prin parolă și drepturile contabilului. Verifică nota și data propuse; dacă perioada inițială este închisă, contabilul decide data permisă. După succes și o eventuală eroare de reîncărcare, folosește **„Reîncarcă factura”**: nu retrage contabilizarea încă o dată.

Păstrează distincte data facturii, data efectivă a recepției și data stornării. La recrearea unui NIR sau introducerea unei facturi vechi, verifică explicit datele rezultate; data de azi nu înlocuiește implicit data istorică verificată.

La `correct_confirmed_reception`, `id` este ID-ul facturii, iar `expectedOldNirId` este ID-ul NIR-ului verificat. Creează o `idempotencyKey` pentru această corecție și păstrează **aceeași cheie, același NIR inițial și aceleași valori** la retry. O operație nouă primește o cheie nouă.

- `physicalQuantities`: mapă **ID linie factură → cantitate în unitatea de stoc**.
- `physicalLotQuantities`: mapă **ID linie din NIR-ul anterior → cantitate în unitatea de stoc**. Cheia vine din `get_physical_reception_lines.id`; nu folosi ID-ul unui lot din lista de stoc. `sourceIncomingInvoiceLineId` arată legătura cu factura.
- Nu trimite ambele forme pentru aceeași linie fiscală. Cantitățile acceptă maximum trei zecimale, inclusiv zero.
- Dacă ai corectat numai factura sau prețul, omite cantitățile fizice: numărătoarea anterioară se păstrează. Facturat 12 și primit 10 nu înseamnă că au sosit încă două bucăți.
- Dacă s-au schimbat unitatea, loturile sau distribuția și sistemul cere noua alocare fizică, obține numărătoarea reală; nu o deduce automat din factură.
- La corectarea unei conversii, stabilește dacă utilizatorul schimbă și cantitatea efectiv primită sau doar exprimarea facturii. Transmite cantitatea fizică verificată dacă aceasta se schimbă. Câmpurile fiscale originale rămân intacte, inclusiv valorile lipsă din documentele vechi; nu inventa o unitate originală pentru a trece validarea.
- Un timeout înseamnă rezultat necunoscut. Recitește factura, NIR-ul și istoricul înainte de retry; nu genera altă cheie ca să „treacă”.

## Recepție deja consumată sau încă fără preț

La restaurante, consumul anterior nu impune ștergerea vânzărilor, producției sau consumului. **Corecția NIR autorizată nu cere `acknowledgeConsumedLots` sau activarea stocului negativ**, inclusiv când se corectează cantitatea, produsul ori gestiunea. Pentru schimbarea fizică folosește numărătoarea verificată și citește NIR-ul rezultat: sistemul poate înlocui atomic recepția, păstrează consumurile și înregistrează eventuala cantitate rămasă neacoperită. Aceasta trebuie explicată și verificată, nu ascunsă printr-o recepție fictivă. Fabrica păstrează protecțiile producției dependente. Anularea explicită a documentului este o operație distinctă, cu schema și efectele ei; nu o folosi ca pas suplimentar pentru corecție. Folosește acordul existent și clarifică numai date lipsă sau efecte suplimentare neautorizate.

Acoperirea consumurilor și diferențele de cost se regularizează prin fluxul recepției. **Nu reprocesa consumul zilnic doar fiindcă ai corectat sau anulat un NIR.** Reprocesarea este pentru schimbări de rețetă/reguli de consum ori un diagnostic care o cere separat.

„Preț necunoscut” și „preț zero” sunt stări diferite. Păstrează evaluarea în așteptare până la factura verificată. Costul deja cunoscut al altor ingrediente se păstrează. Nu completa zero ca să dispară un avertisment. Dacă schimbarea produsului fizic pe o recepție foto neevaluată este refuzată, urmează anularea verificată și recrearea din factura corectată, dacă documentele permit această cale.

## Asocierea facturii și diferențele pe linii

La tool-urile de asociere, `id` identifică **factura fotografiată**, iar `invoiceId` factura fiscală țintă. Verifică ambele identități. `lineDecisions` permite:

- `pair`: `invoiceLineId` + `receiptLineId`, o potrivire explicită între linia facturii și linia NIR-ului;
- `expense`: `invoiceLineId`, pentru o linie confirmată ca cheltuială;
- `accept_over_billed`: `invoiceLineId`, numai când utilizatorul acceptă explicit diferența facturată peste cantitatea primită.

Trimite aceleași decizii la previzualizare și asociere. Nu schimba factura oficială și nu crește fictiv cantitatea primită pentru a face sumele să coincidă. Asocierea și finalizarea sunt pași diferiți; verifică ambele rezultate. Pentru valută, cursul, data și sursa sunt verificate înainte de asociere și aprobare. La un refuz, completează snapshotul valutar oficial prin fluxul facturii și reia operația; nu inventa un curs și nu folosi sursa identity pentru valută.

## Verificare și protecții

Recitește factura cu `get_incoming_invoice_workflow_details({invoiceId: ID_FACTURA})`: verifică `nirDocumentId`, `receiptDate`, datele fiscale și liniile. La revizie economică, `correctionMode:economic_revision` confirmă păstrarea NIR-ului; nu descrie rezultatul ca storno/repostare. Cantitățile rămân cele citite anterior dacă nu ai cerut schimbarea lor.

Urmărește `get_reception_cost_recalculation({id: ID_FACTURA})`:

| Stare | Ce spui și ce faci |
|---|---|
| `pending` / `retry` | Corecția este salvată, costurile se actualizează în fundal; utilizatorul poate continua lucrul. Recitește starea, fără repetarea scrierii. |
| `resolved` | Costurile afectate au fost actualizate. Sincronizarea contabilă se verifică separat. |
| `waiting` | Sunt încă surse sau prețuri lipsă; partea cunoscută este actualizată. Completează numai datele reale autorizate. |
| `attention` | Comunică problema concretă și identificatorii returnați; editarea rămâne posibilă. Nu inventa costuri sau ajustări ca să dispară mesajul. |
| rezultat `null` | Nu există o lucrare cunoscută; nu este dovada finalizării FIFO. Verifică documentul și funcțiile oferite de versiunea live. |

Pentru predarea contabilă folosește **separat** `get_reception_accounting_status({id: ID_NIR})`; `pending` sau `processing` nu înseamnă finalizare confirmată. La o eroare de sincronizare eligibilă folosește `retry_reception_accounting_sync`, apoi citește iar starea. O citire reușită nu transformă o lucrare în așteptare într-una terminată.

După schimbarea unității sau gestiunii, recitește factura și `nirDocumentId`: corecția poate să fi înlocuit deja NIR-ul. Folosește ID-ul curent pentru verificare și pentru o eventuală corecție nouă; la reluarea aceleiași operații păstrează însă identificatorii și cheia cererii inițiale. Dacă NIR-ul actualizat ajunge înaintea liniilor facturii, lasă să se sincronizeze și factura, apoi reverifică. Nu recrea documentele ca să schimbi ordinea livrării.

O modificare exclusivă a datei intrării nu cere redeschiderea lunii fiscale pentru o factură deja sincronizată, neschimbată și verificată. Pentru o modificare fiscală reală refuzată într-o lună închisă, contabilul poate decide redeschiderea: în conexiunea **Accounting**, descoperă `list_period_closings` și `reopen_period`; dacă și luna POS este blocată, folosește `unlock_month_everywhere`, care respectă ordinea de deblocare. Urmează decizia autorizată a contabilului, apoi reia sincronizarea și verifică rezultatul. Nu prezenta perioada închisă drept un blocaj fără ieșire.

Pentru livrări oprite după încercări eșuate, în setările de contabilitate POS există **„Reia facturile furnizor / NIR oprite”**. După rezolvarea cauzei, această acțiune reia etapa necesară inclusiv când o versiune mai nouă așteaptă după ea. Nu repeta modificarea facturii ca să repornești livrarea. Costul încă necunoscut cere date reale de stoc/preț; o reluare nu poate înlocui aceste date și nu justifică prețuri inventate.

Istoricul inițial se păstrează prin revizii și diferențe valorice; storno privește operațiile care îl cer efectiv. Data operațională nu rescrie luna fiscală închisă. Documentele fiscale oficiale, operațiile preluate de contabilitate și producția cu flux propriu păstrează protecțiile lor. Dacă o schimbare fiscală este refuzată, explică motivul exact și calea oferită de sistem; nu redeschide automat luni, nu retrage factura din proprie inițiativă și nu modifica direct datele financiare. Nu promite modificarea oricărui câmp al oricărei facturi fără o corecție fiscală.

Conexiunile nominale folosesc tool-urile din acest ghid. Tool-ul `create_nir_from_invoice` rămâne limitat pentru linii împărțite/reunite; în acest caz folosește operația nominală de creare de mai sus. Tool-urile mai vechi `correct_reception_line`, `update_nir_from_invoice`, `void_inventory_document`, `abandon_nir_update`, `link_reception_to_invoice`, `finalize_reception_invoice` pot exista pe conexiuni organizaționale; nu presupune că un refuz de scope la ele înseamnă că lipsește operația nominală. Verifică lista live. Dacă versiunea instalată nu oferă încă tool-ul necesar, spune concret ce lipsește și folosește pagina canonică accesibilă, fără a simula succesul.
