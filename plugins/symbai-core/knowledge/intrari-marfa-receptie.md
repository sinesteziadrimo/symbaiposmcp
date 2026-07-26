# Intrări Marfă — recepția facturilor de la furnizori (pas cu pas)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`. Acest fișier completează `stocuri-inventar-furnizori.md` (privirea de ansamblu pe stocuri) și `finante-facturare-contabilitate.md` (conturi & note contabile) — citește-le pe acelea pentru context. Aici intrăm în detaliu DOAR pe pagina **Intrări Marfă** (`/stock-entries`).
> Fișiere-frate pentru detaliile care nu încap aici: `mapare-si-reconversie-facturi.md` (cum devine o linie de furnizor produsul tău, conturi, factor de pachet, ce învață sistemul), `reconciliere-dubluri-facturi.md` (cum eviți marfa intrată de două ori și facturile pierdute), `gestiuni-magazii-zone.md` (în ce gestiune și în ce zonă aterizează marfa).

## Pe scurt

„Intrări Marfă" e locul unde marfa de la furnizori intră oficial în stoc și în contabilitate. Drumul e mereu același: **factura intră → liniile facturii se leagă (mapează) la produsele tale + conturi → se creează NIR-ul → NIR-ul postat bagă marfa pe stoc și generează automat notele contabile.** Doar NIR-ul postat mișcă stocul — niciun pas de dinainte.

**Recepția prin poze e configurabilă pe firma ta** (Setări → Stocuri → „Recepție din poză"): poți alege ca marfa să intre direct pe stoc dintr-o poză când totul e clar, sau să treacă mereu printr-o verificare, cine are voie să corecteze/adauge produse, și dacă recepțiile angajaților trec pe la un contabil. Vezi secțiunea **„Îți configurezi singur procedura"** de mai jos — asistentul îți poate explica ȘI seta totul prin conexiune, nu trebuie să umbli prin meniuri.

## Cele 5 taburi ale paginii

1. **Facturi Furnizori** — toate facturile de intrare, din toate sursele (eFactura/ANAF, poză OCR, import din contabilitate, manual). Aici mapezi, vezi statusul și pornești recepția.
2. **Avize & Draft** — avizele (marfă primită înainte de factură) + ciornele (facturi tastate manual sau din poză, neaprobate încă). Ciornele din poză au buton **Aprobă** (le mută în „Facturi Furnizori").
3. **Reconciliere** — leagă un aviz / o ciornă de **factura oficială (eFactura)** care vine mai târziu, ca să nu intre marfa de două ori și să nu se piardă nicio factură.
4. **Recepții (NIR)** — notele de recepție (NIR) deja create; de aici postezi pe stoc, tipărești „Nota de recepție și constatare de diferențe", vezi notele contabile.
5. **Producție** — intrările generate automat din modulul de producție (produse finite/semifabricate).

## Cele 4 surse din care intră o factură

- **eFactura / ANAF** — descărcată din SPV (butonul „Importă eFactura").
- **Recepție din poză (OCR)** — faci poză la factură/aviz; AI-ul citește liniile. Ce urmează depinde de **modul ales de firmă** (vezi secțiunea dedicată): doar ciornă, verificare imediată sau direct pe stoc (când furnizorul e recunoscut și totul se verifică, NIR-ul se creează singur).
- **Push din contabilitate** — contabilul împinge factura din Symbai Accounting.
- **Manual** — butonul „Document Nou", tastezi tot.

## Maparea unei linii (cea mai importantă operație)

Fiecare linie de factură are descrierea **furnizorului** (ex. „TABLA CUTATA WTB W60"). Trebuie legată de:
- **Produsul tău intern** (din catalog) — ca să intre pe stocul corect.
- **Contul contabil de cost/stoc** (ex. 371 mărfuri, 301 materii prime, 628 servicii) — se completează **automat din tipul produsului**; îl poți schimba.
- **Contul de TVA** (de regulă 4426 TVA deductibilă).

> ⚠ **Contul de pe linie ≠ contul din nota contabilă, la marfa care intră pe stoc.** Pentru o linie care intră pe stoc, nota contabilă se face **din tipul produsului** (și din eventualele conturi personalizate pe tip / pe unitate). Contul pus pe linie se vede în ecranul de mapare și în rapoarte, dar **nu schimbă nota**. Contul de pe linie decide nota contabilă doar la **liniile de cheltuială** (servicii, utilități, transport) și la facturile pur contabile. Deci: dacă nota iese pe cont greșit, **repari tipul produsului**, nu contul de pe linie.
> Confirmarea învață regula **furnizor + descriere normalizată → produs + cont de mapare + factor de pachet**. Nu transforma această regulă într-una valabilă la orice furnizor. Numai regulile generale, curate și întreținute explicit se folosesc cross-furnizor. La marfa stocabilă, contul notei contabile rămâne determinat de **tipul produsului** și eventualele override-uri contabile ale tipului/unității.

AI-ul propune maparea, tu o **confirmi (accepți)**. Sistemul **învață**: următoarea factură de la același furnizor cu aceeași descriere se mapează singură. O linie neacceptată **blochează** crearea NIR-ului.

Locuri de mapare: pe fiecare factură (modala „Mapare e-Factură") sau centralizat în **Revizuire Mapări AI** (`/inventory/ai-review`) — toate liniile fără recepție, într-un singur ecran.

> ⚠ **Rularea din nou a mapării AI pe o factură reia de la zero liniile neacceptate.** Dacă ai corectat manual câteva linii dar nu le-ai acceptat, ele se pierd. Acceptă întâi ce ai corectat (`accept_invoice_line_mapping`), abia apoi rulează `auto_map_efactura` pentru restul.

### Ce anume învață sistemul
La fiecare confirmare (și la fiecare NIR postat) se memorează perechea **furnizor + descrierea lui** → **produsul tău + contul + factorul de pachet**. De atunci înainte, aceeași descriere de la același furnizor se mapează singură, cu încredere maximă.

- Regula învățată se aplică automat și la **celelalte facturi nefinalizate ale aceluiași furnizor** (propagare cu un click din pagină). Atenție: o mapare greșită se propagă exact la fel de repede ca una bună.
- Vezi și editezi tot ce a învățat sistemul în **Reguli de Mapare** (`/inventory/mapping-rules`): tabul cu regulile **specifice unui furnizor** (prioritate maximă) și tabul cu regulile **generale** (rezervă, când nu există una pe furnizor). Tot acolo vezi regulile care se contrazic între ele.
- Corectura se face **în regulă**, nu re-mapând linia la nesfârșit: cât timp regula rămâne greșită, se reaplică la fiecare factură nouă.
- Detaliile complete (ordinea în care caută sistemul, ce înseamnă „încredere mare/mică", cum corectezi un factor învățat greșit) sunt în `mapare-si-reconversie-facturi.md`.

### Tip produs = ce conturi primește
Tipul produsului (marfă, materii prime, consumabile, ambalaje, serviciu, utilități, combustibil, imobilizări etc.) decide automat conturile pe **momente**: la intrare pe factură (`invoice_entry`), la NIR/adaos, la consum, la vânzare. Vezi `finante-facturare-contabilitate.md` și pagina „Conturi pe Tip Produs" (`/ai-product-types`). Dacă o linie de serviciu ajunge greșit pe un cont de marfă (371), **schimbă tipul produsului** — ăsta e comutatorul care schimbă efectiv nota; contul pus pe linie corectează doar ce se vede în mapare și în rapoarte.

### Reconversie (factor de pachet)
Dacă furnizorul facturează în „bax" dar tu ții produsul la bucată, pui **factorul de pachet** (ex. un bax = 24): cantitatea se înmulțește (×24), prețul unitar se împarte (÷24), iar valoarea originală din factură rămâne neatinsă. Se învață automat pentru data viitoare.

Trei reguli de operare:
- **Când sistemul nu poate traduce singur unitatea** (bax → kg, cutie → bucată), se oprește și îți pune o singură întrebare clară: „1 bax = câte kg?". **Nu e o eroare** — e protecția care ține stocul corect; răspunzi o dată și merge mai departe.
- **„Păstrez baxul"** (nu desfaci pachetul, îl primești ca atare) e permis **doar dacă ții produsul chiar în acea unitate**. Dacă produsul e ținut la bucată, baxul trebuie desfăcut prin factor.
- **Factorul se învață pentru data viitoare.** Dacă a fost învățat greșit, îl corectezi din **Reguli de Mapare** (`/inventory/mapping-rules`), nu re-mapând linia la fiecare factură.

Capitolul complet (ce ghicește singur sistemul, ce înseamnă numărul din câmpul „factor", unde nu ajută) e în `mapare-si-reconversie-facturi.md`.

### Ce mai poți face pe o linie de factură
Pe lângă mapare, ecranul de recepție are patru operații pe care merită să le știi (toate se fac **din aplicație**, nu prin conexiune):

- **Spargere linie** — o linie se împarte în mai multe sub-linii, pe cantități. Util când același rând de factură conține de fapt mai multe produse reale sau când marfa merge în locuri diferite. Sumele se împart automat între sub-linii; operația se poate anula.
- **Absorbție linie** — costul unei linii (transport, ambalaj, taxă) se repartizează peste liniile de marfă: egal, proporțional cu valoarea, sau pe o singură linie aleasă. **Se mută doar valoarea**, nu și cantitatea — așa transportul intră corect în costul mărfii, fără să apară ca produs pe stoc.
- **Împărțire pe gestiuni** — aceeași linie se poate primi în mai multe depozite (ex. 40 kg la Magazie, 60 kg la Bucătărie). ⚠ **Împărțirea se stabilește doar în ecranul de recepție și se pierde dacă reîncarci pagina** — creează NIR-ul în aceeași sesiune de lucru.
- **Produs nou propus de AI** — când asistentul nu găsește produsul în catalogul tău, îl **propune**, nu îl creează. Butonul „Creează și mapează" de pe linie îl creează cu numele, unitatea și tipul propuse (verifică-le înainte, mai ales tipul — el decide conturile). ⚠ Acceptarea în bloc (`accept_all_invoice_mappings`) **sare** aceste linii; ele se rezolvă una câte una.

### Preț recepție / preț vânzare
Pe linie poți pune prețul de raft (la marfă apare „Preț recepție", la restul „Preț vânzare"). Acesta actualizează prețul de raft al produsului și se reține pe NIR. **Atenție (corect contabil):** sistemul postează azi marfa pe stoc la **costul de achiziție**, NU la prețul de vânzare cu adaos (conturile 371/378/4428 de „recepție la preț de vânzare" sunt configurate dar nu se execută încă la postare). Deci prețul de recepție e informativ pentru raft, nu schimbă valoarea de stoc.

### Deductibilitate TVA / cheltuială + cheltuieli în avans (471)
Pe factură poți seta: deductibilitatea TVA (100% / 50% vehicule / pro-rata / 0% / custom), deductibilitatea cheltuielii (protocol 2%, social 5%, diurnă 2.5×, sponsorizare, perisabilități etc.) și cheltuieli în avans (cont 471 + nr. luni + dată). **Important:** azi aceste valori se **salvează ca informație** pentru contabil, dar NU schimbă încă notele contabile generate automat (TVA se trece integral pe 4426). Sunt utile ca etichetă/intenție, nu ca motor de calcul.

## Crearea NIR-ului (intrarea pe stoc)
Când toate liniile sunt mapate și acceptate: alegi **depozitul (magazia)** și apeși **Creează NIR**. NIR-ul se postează → marfa intră pe stoc pe loturi → se generează automat notele contabile (Debit stoc + Debit 4426 TVA / Credit 401 Furnizor). Dacă factura e doar de servicii/nestocate, NIR-ul se „Finalizează" fără mișcare de stoc.

### Două căi (NU le confunda — dublezi stocul)
- **Recepție DIRECTĂ (fără factură în sistem)** — marfă cash & carry, pe aviz, sau înainte să vină eFactura: se face complet prin MCP cu `create_inventory_document` (docType GOODS_RECEIPT/NIR) + `post_inventory_document`. Marfa intră pe stoc și nota contabilă se generează automat. Verificat live: stoc + notă D 301/371 + 4426 / C 401 corecte, contul derivat din tipul produsului chiar fără tipuri de produs configurate pe brand.
- **NIR legat de o factură existentă** (eFactura/poză/contabilitate, apare în `list_received_efactura`): mapezi liniile prin MCP (`map_invoice_line`), apoi `create_nir_from_invoice({ invoiceId, warehouseId, confirm: true })` creează NIR-ul LEGAT, îl postează pe stoc și generează notele contabile (sau, din aplicație: Recepții → Recepție Nouă → alegi factura sursă). ⚠ NU folosi `create_inventory_document` aici — el creează o recepție SEPARATĂ, nelegată de factură (factura rămâne „fără NIR" și marfa intră de două ori).

### Contul vine din tipul produsului (chiar fără configurare)
Nota contabilă la postare derivă contul de stoc din TIPUL canonic al produsului: raw_material→301, merchandise→371, consumable→302, packaging→381, service→628. Asta funcționează și dacă brandul are 0 tipuri de produs configurate (mapare implicită). Tipurile configurate în „Conturi pe Tip Produs" sunt pentru CONTURI PERSONALIZATE / override-uri, nu pentru cazul de bază. ⚠ La `map_invoice_line` (Calea B), dacă tipul nu permite derivarea, contul cade implicit pe 371 — de aceea produsul trebuie să aibă tipul corect.

## Recepția prin poze — poți fotografia oricâte pagini, PDF-uri, facturi mari

Cum merge captura:
- Faci poză la factură sau aviz cu telefonul (sau încarci fișiere). **Poți adăuga mai multe poze** dacă factura are mai multe pagini — butonul devine „Fotografiază pagina 2, 3…" și sistemul le tratează pe TOATE ca un singur document. Merge și cu **PDF-uri cu mai multe pagini** (le desface singur) — util la facturile mari de la Metro/Selgros sau magazinele online cu zeci de produse.
- Sistemul citește furnizorul, numărul, liniile cu cantități și prețuri, și recunoaște produsele din recepțiile anterioare. Cu fiecare factură verificată, următoarele de la același furnizor merg mai repede.

Ce se întâmplă DUPĂ poză depinde de **modul ales de firmă** (Setări → Stocuri → „Recepție din poză"):
1. **Doar ciornă** — se creează o ciornă în „Avize & Draft"; produsele se verifică și marfa intră pe stoc mai târziu, manual (mapare → Aprobă → Creează NIR). Comportamentul clasic, pentru firme prudente.
2. **Verificare imediată (recomandat)** — după poză se deschide direct ecranul de verificare; confirmi produsele și marfa intră pe stoc într-un flux continuu, fără să cauți documentul prin liste.
3. **Direct pe stoc** — dacă furnizorul e recunoscut, toate produsele sunt identificate automat și totalul se verifică matematic, marfa intră pe stoc **automat dintr-o singură poză** (se creează NIR-ul singur). Orice nelămurire (furnizor nerecunoscut, produs necunoscut, total care nu se verifică) trece automat la verificare, cu motive scrise pe înțeles — nu intră niciodată date greșite tăcut.

**Produse care nu-s pe comandă:** dacă furnizorul a livrat ceva ce n-ai comandat, poți primi produsul extra pe stoc alegându-l din catalog direct la recepție — nu se mai pierde marfa fizică.

**Reconcilierea cu eFactura oficială:** când vine eFactura de la ANAF pentru aceeași factură fizică (același furnizor + număr), sistemul evită dublarea: dacă ciorna din poză e neaprobată și sumele se potrivesc, eFactura o înlocuiește automat; dacă poza era deja aprobată/recepționată, eFactura oficială se atașează (nu se mai pierde) și un gard împiedică al doilea NIR pe aceeași factură. Sumele diferite → avertisment + legare manuală în tabul **Reconciliere**.

## Recepția pe LOTURI (fabrici) — același produs în mai multe loturi

La fabrici și depozite, același produs vine adesea în **mai multe loturi**, cu **termene de valabilitate diferite** — ex. 400 kg de gem = 230 kg din lotul 85 (expiră 05.05.2027) + 90 kg din lotul 86 + 80 kg din lotul 87. Informația asta nu e pe factură, ci pe **declarația de conformitate** (sau certificatul de calitate) care însoțește marfa.

**Se activează din Setări → Stocuri → „Recepție pe loturi"** (implicit oprită — dacă n-o pornești, nimic nu se schimbă față de acum). Cu ea pornită:

- **Pozezi factura ȘI declarația de conformitate** (butonul de captură are o zonă separată „Declarație de conformitate (opțional)"). Sistemul citește din declarație, pentru fiecare produs, **toate loturile** cu cantitatea, originea și termenul de valabilitate al fiecăruia, și le pune automat pe liniile facturii.
- **Poți împărți și corecta manual** loturile în ecranul de verificare: adaugi un lot, schimbi cantitatea sau termenul, ștergi unul. Un lot poate fi lăsat fără cantitate = „restul liniei". Dacă cantitățile loturilor nu se adună la cantitatea liniei, sistemul te avertizează și nu te lasă să creezi NIR-ul până corectezi.
- **Dacă declarația vine mai târziu** (ai pozat întâi factura), o atașezi ulterior pe documentul deschis — butonul „Declarație conformitate" — și loturile se completează atunci.
- **La crearea NIR-ului**, fiecare lot devine un **lot de stoc separat**, cu termenul lui de valabilitate. Așa merge corect **FEFO** (iese primul cel care expiră primul) și **retragerea (recall)** — poți urmări exact în ce a ajuns fiecare lot al furnizorului.

Facturile care listează același lot pe două rânduri (paleți diferiți, ex. „Lot 28122026 – 50 kg" + „Lot 28122026 – 250 kg", aceeași dată) se unesc singure într-un lot de 300 kg. Dacă recepția are deja NIR și corectezi loturile, le aplici pe stoc apăsând **„Modificare NIR"**.

**Asistentul poate împărți loturile prin conexiune** — îi spui, ex.: „împarte linia de gem în trei loturi: 85 cu 230 kg exp. 5 mai 2027, 86 cu 90 kg, 87 cu 80 kg" — și le pune el (`set_reception_lot_allocations`). Verifică întâi dacă „Recepția pe loturi" e pornită (`get_reception_policy`); dacă nu, o pornește cu `configure_reception_policy`.

## Îți configurezi singur procedura (asistentul îți explică ȘI face)

Fiecare firmă lucrează altfel. Cine configurează sistemul își stabilește **propria procedură** din Setări → Stocuri → „Recepție din poză", sau cerându-i asistentului. Reguli disponibile (se aplică angajaților obișnuiți — ospătari, gestionari; **responsabilii cu drepturi financiare, ex. contabil/manager, pot oricum orice**):

- **Modul de lucru** — doar ciornă / verificare imediată / direct pe stoc (vezi mai sus).
- **Gestiunea implicită** — magazia pre-completată la fiecare recepție, ca angajatul să nu aleagă de fiecare dată.
- **Poate corecta mapările?** — dacă e oprit, angajatul doar fotografiază, iar legăturile factură→produs le face un responsabil.
- **Poate adăuga produse noi?** — dacă e oprit, produsele necunoscute așteaptă un responsabil.
- **Recepțiile trec printr-o verificare?** — dacă e pornit, orice recepție făcută din poză de un angajat apare în lista **„Recepții de verificat"**; un contabil/manager vede exact ce s-a recepționat, de cine, și o poate corecta apoi bifa ca verificată.

**Exemple de proceduri (spune-i utilizatorului că le poate alege):**
- *„Ospătarul pozează, mapează și intră direct pe stoc"* → mod **direct** + toate permisiunile pornite.
- *„Angajații doar pozează, restul face contabilul"* → mod **verificare imediată** + „corectare mapări" și „produse noi" **oprite** + „verificare" **pornită**.
- *„Marfa intră pe stoc, dar contabilul verifică ulterior"* → mod **direct/verificare** + „verificare" **pornită** (contabilul găsește tot în „Recepții de verificat").

**Asistentul poate face asta prin conexiune** (fără să intri în meniuri): `get_reception_policy` (îți spune ce e activ acum, pe înțeles), `configure_reception_policy` (schimbă modul / gestiunea / permisiunile / verificarea), `list_receptions_to_review` (ce recepții așteaptă verificarea contabilului), `mark_reception_reviewed` (bifează una ca verificată). Cere-i pur și simplu, ex.: „vreau ca angajații să doar pozeze, iar eu să verific" sau „setează recepția din poză să intre direct pe stoc".

> ⚠ De reținut: modificarea unei recepții după ce marfa a fost consumată/vândută e blocată dacă ar lăsa stocul pe minus, iar dacă între timp s-a făcut inventar primești avertisment — sistemul te ferește de erori de stoc.

## Cum eviți să pierzi sau să dublezi facturi
- Verifică periodic tabul **Reconciliere** (badge-ul roșu = documente nelegate) și **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — semnalează eFacturi fără NIR, mapări sub 70%, NIR-uri ciornă vechi.
- O ciornă din poză + o eFactura cu **același număr și sumă** trebuie să rămână UN singur document. Dacă vezi două, leagă-le în Reconciliere.
- Înainte de „Leagă" manual: confirmă că numărul facturii și suma se potrivesc (legarea nu le verifică singură).
- NIR creat de două ori pe aceeași factură = stoc dublat. Dacă bănuiești asta, caută în Recepții (NIR) după furnizor + dată.
- Procedura completă (ce face sistemul singur la importul eFacturii, ce blochează legarea, ce faci dacă marfa a intrat deja de două ori) e în `reconciliere-dubluri-facturi.md`.

## Tool-uri MCP utile (conexiunea live)

**Citire (read-only; cere grantul `readModule` aferent pe token):**
- `list_received_efactura` — listează facturile de intrare (filtre: status, furnizor, brand, interval date, cu/fără NIR, căutare). Vezi rapid ce facturi sunt de procesat (`hasNir:false`).
- `get_received_efactura_details` — antetul unei facturi (furnizor, sume, deductibilitate, dacă are NIR) + toate liniile cu starea mapării (produs, cont, acceptat, factor pachet). Folosește-l înainte de a mapa.
- `diagnose_incoming_invoice_integrity` — găsește facturile cu zero linii și separă cazurile sănătoase, reparabile din XML-ul oficial păstrat, cele care cer re-descărcare ANAF și cele fără sursă recuperabilă.
- `diagnose_inventory_document_reversal` — previzualizează anularea unui NIR/document postat și enumeră blocajele reale: factură generată din recepție, loturi deja consumate, inventar sau consum din aval. Nu modifică stocul.
- (general) `list_suppliers`, `search_products_db`, `list_product_types`, `get_stock_levels`, `list_pending_nirs`, `list_reception_notes`.

**Scriere (cer modulul `inventar` = „Stocuri & Recepție" pe token):**
- `repair_missing_incoming_invoice_lines` — reconstruiește liniile unei facturi cu antet, dar zero linii, numai din XML-ul oficial deja păstrat. Rulează întâi diagnosticul; reparația este blocată dacă există deja linii, NIR/document din aval, XML ambiguu sau totaluri care nu se reconciliază. Nu creează NIR și nu postează stoc — după readback, maparea și recepția continuă normal.
- `map_invoice_line` — leagă o linie la un produs + cont (+ factor de pachet). Contul se rezolvă automat din tipul produsului dacă nu-l dai. Setează linia ca acceptată și învață regula.
- `accept_invoice_line_mapping` — confirmă o linie deja mapată.
- `accept_all_invoice_mappings` — acceptă în bloc toate liniile deja mapate cu încredere ≥ 0.5 (nu creează produse noi — pe acelea le mapezi individual). Îți întoarce și lista **`blocked[]`** cu liniile pe care NU le-a putut accepta și **motivul fiecăreia** (fără produs, fără cont, încredere prea mică, produs doar propus, linie spartă/absorbită); când nu acceptă nimic, îți dă și **`nextAction`** — pasul concret de făcut. Citește lista înainte de a repeta apelul: dacă nu se schimbă nimic în date, a doua rulare dă exact același rezultat.
- `set_invoice_context` — setează pe factură: tip factură, brand/locație, magazie, deductibilitate TVA/cheltuială, cheltuieli în avans 471, modalitate de plată, observații.
- `create_inventory_document` — creează un document de stoc (recepție DIRECTĂ): docType GOODS_RECEIPT/NIR/PURCHASE_RECEIPT pentru intrare, linii cu productId + qty + unitCost. `autoPost:true`+`confirm:true` postează imediat; altfel rămâne DRAFT.
- `post_inventory_document` — postează pe stoc un document DRAFT (mișcă stocul real, ireversibil — cere confirmarea userului).
- `repair_missing_incoming_invoice_lines` — reface idempotent liniile lipsă numai pentru o **ciornă** e-Factura fără recepție/plată/predare contabilă/supersedare, din XML-ul oficial deja păstrat. Cere sursă și upload e-Factura, ID ANAF numeric, hash valid (dacă a fost salvat) și același număr de factură; CUI-urile prezente trebuie să coincidă. Refuză orice dovadă neclară, nu inventează linii și nu creează NIR automat.
- `create_nir_from_invoice` — pentru o factură EXISTENTĂ (Calea B): creează NIR-ul LEGAT de factură (`invoiceId`), îl postează pe stoc + generează notele contabile, marchează factura cu NIR. Liniile trebuie mapate înainte; `confirm:true` obligatoriu; `warehouseId` = magazia (opțional doar dacă toate liniile sunt servicii).

**Scriere (cer modulul `financiar` = „Financiar & Contabilitate"):**
- `create_incoming_invoice` — creează o factură de intrare manuală (ciornă) de la zero (hârtie/PDF fără eFactura/OCR): `invoiceNumber`, `invoiceDate`, `lines` (descriere + cantitate, opțional preț/TVA/`mappedProductId`) + furnizor (`supplierId` sau `supplierName`+`supplierCui`). Nu mișcă stoc — urmează `map_invoice_line` + `create_nir_from_invoice`.

**Procedura recepției prin poze (configurare self-service):**
- `get_reception_policy` (citire) — întoarce procedura curentă (mod draft/review/direct, gestiune implicită, dacă personalul poate corecta mapări / adăuga produse, dacă recepțiile trec printr-o verificare, toleranțe) + explicație pe înțeles. Cheam-o înainte de a schimba ceva, ca să spui utilizatorului ce e activ.
- `configure_reception_policy` (scriere, modul `setari` = „Setări & Configurare") — schimbă procedura: `mode` ('draft'|'review'|'direct'), `defaultReceptionWarehouseId` (0 ca s-o scoți), `allowMappingEdits`, `allowNewProducts`, `requireReview`. Trimite doar câmpurile pe care le schimbi. Explică efectul înainte, mai ales pentru `mode:'direct'`.
- `list_receptions_to_review` (citire) — recepțiile din poză ale personalului care așteaptă verificarea contabilului (când `requireReview` e pornit): NIR, furnizor, factură, gestiune, cine a recepționat, valoare.
- `mark_reception_reviewed` (scriere, modul `financiar` = „Financiar & Contabilitate" — acțiune de responsabil) — bifează o recepție ca verificată (o scoate din coadă), după ce ai confirmat că e corectă.

> **Recepția DIRECTĂ (fără factură în sistem)** se face complet prin MCP: `create_inventory_document` (GOODS_RECEIPT) → `post_inventory_document`. Marfa intră pe stoc + nota contabilă se generează automat.
> **NIR-ul LEGAT de o factură existentă** se face ACUM tot prin MCP: după ce liniile sunt mapate (`map_invoice_line`), `create_nir_from_invoice({ invoiceId, warehouseId, confirm: true })` creează NIR-ul legat, îl postează pe stoc + generează notele contabile (nu mai trebuie aplicația). NU folosi `create_inventory_document` pentru o factură existentă — el nu primește `invoiceId` și ar dubla marfa.
> **Factură manuală de la zero** (hârtie/PDF, fără eFactura/OCR): `create_incoming_invoice({ invoiceNumber, invoiceDate, lines })` o creează ca ciornă (nu mișcă stoc); apoi mapezi + `create_nir_from_invoice`.
> ⚠ După ce o factură are NIR creat, `map_invoice_line` și câmpurile structurale din `set_invoice_context` se BLOCHEAZĂ prin tool (ar dezalinia stocul/contabilitatea) — modificările se fac din aplicație („Modificare NIR").

**Pattern de lucru prin MCP:**
- **Recepție directă (Calea A):** `list_suppliers`/`create_supplier` + `search_products_db`/`create_product` (tip corect) → `create_inventory_document(GOODS_RECEIPT, lines cu unitCost, autoPost:false)` → `list_pending_nirs` (verifică DRAFT) → `post_inventory_document(confirm:true)` → verifică cu `get_stock_levels` + `get_journal_entries_summary`.
- **Factură existentă (Calea B):** `list_received_efactura(hasNir:false)` → `get_received_efactura_details` → pe fiecare linie nemapată `search_products_db` apoi `map_invoice_line` (cont auto din tip; `packMultiplier` pt. bax) → opțional `set_invoice_context` (magazie + deductibilitate) → `create_nir_from_invoice({ invoiceId, warehouseId, confirm:true })`. Verifică mereu prin **citire** (`get_received_efactura_details`, `list_received_efactura(hasNir:true)`), nu prin interfață (UI-ul se reîmprospătează la refresh).
- **Factură de hârtie de la zero:** `create_incoming_invoice(...)` (ciornă) → mapezi liniile → `create_nir_from_invoice(...)` — Calea B integral prin MCP, fără aplicație.

**Ce se face doar din aplicație (nu există tool):**
- spargerea unei linii de factură și absorbția unei linii de cost (transport/ambalaj) peste liniile de marfă;
- împărțirea unei linii pe mai multe gestiuni;
- crearea produsului **propus** de asistent (butonul „Creează și mapează" de pe linie);
- editarea și ștergerea regulilor de mapare învățate și a factorilor de pachet (**Reguli de Mapare**, `/inventory/mapping-rules`);
- legarea manuală aviz ↔ factură / ciornă ↔ eFactura în tabul **Reconciliere**;
- transferul între zonele aceleiași gestiuni (pagina Zone).

> Când utilizatorul cere una dintre astea prin chat: dă-i linkul exact cu `gaseste_in_aplicatie`, plus lista concretă de făcut (numere de linii, documente de legat), obținută prin citiri. Dacă îl blochează în lucru, trimite o cerere de tool cu `trimite_ticket_symbai`, tip „sugestie".

**SQL (toggle separat, doar citire):** pentru întrebări la care tool-urile de mai sus nu ajung, descoperă tabelele cu `list_database_tables` + `describe_database_table`, apoi `execute_sql_query` (doar SELECT) — ex. facturi de intrare cu liniile lor, NIR-uri, note de diferențe, reguli de mapare învățate.

## Întrebări frecvente

- **De ce nu pot crea NIR-ul?** O linie e nemapată sau neacceptată, sau e mapată pe un produs șters din catalog. Verifică în Revizuire Mapări AI / `get_received_efactura_details`.
- **Factura există, dar arată zero linii.** Nu o trata drept factură cu valoare zero și nu crea NIR gol. Rulează `diagnose_incoming_invoice_integrity`; repară numai dacă `repairCandidate=true` și lista `repairBlockers` este goală. `repair_missing_incoming_invoice_lines` revalidează tranzacțional XML-ul oficial, ID-ul ANAF, hash-ul, numărul facturii și lipsa oricărui efect ulterior; apoi recitește factura. Dacă XML-ul lipsește dar există identificatorul oficial, re-descarcă din ANAF/SPV. Nu inventa manual liniile fiscale.
- **Am făcut recepție din poză — de ce nu a crescut stocul?** Depinde de modul ales de firmă (Setări → Stocuri → „Recepție din poză"): pe modul **doar ciornă** stocul intră abia după mapare → Aprobă → Creează NIR cu magazie; pe **verificare imediată** intră după ce confirmi produsele în ecranul de verificare; pe **direct pe stoc** intră automat când totul e curat (furnizor recunoscut, produse identificate, total verificat matematic) — orice nelămurire cade la verificare, cu motive scrise.
- **A venit eFactura, dar am deja ciorna din poză — se dublează?** Dacă ciorna e neaprobată și sumele se potrivesc, eFactura o înlocuiește automat. Dacă nu, leagă-le manual în Reconciliere.
- **De ce serviciul a ajuns pe cont de marfă (371)?** Tipul produsului e greșit (marcat ca marfă/stocabil). **Repară tipul produsului** — la liniile de cheltuială contul de pe linie contează, dar rămâne greșit la următoarea factură dacă tipul nu e corectat. Prin MCP, `map_invoice_line` cu un produs de tip serviciu rezolvă automat contul de cheltuială corect.
- **Am schimbat contul pe linie și nota contabilă e la fel.** Corect, nu e o defecțiune. La marfa care intră pe stoc nota se face **din tipul produsului**, nu din contul de pe linie (vezi nota din „Maparea unei linii"). Verifică tipul produsului (`get_product_details`) și conturile tipului (`list_product_types` / `get_product_type_details`), corectează acolo, apoi reface nota din aplicație („Modificare NIR").
- **AI-ul a mapat totul, dar nu pot accepta o linie.** Linia n-are un cont valabil — se întâmplă la regulile învățate din catalogul furnizorului, care leagă produsul dar nu poartă și un cont. Alege contul o dată pe linia respectivă (sau pune tipul corect pe produs); după prima confirmare se învață și nu mai apare. `accept_all_invoice_mappings` îți spune exact asta în lista `blocked[]`.
- **Am o factură care nu mă lasă să modific nimic.** Facturile împinse din contabilitate au identitatea înghețată (furnizor, număr, sume, linii): se mai poate schimba doar conversia de ambalaj. Restul se corectează în contabilitate, de unde a venit documentul.
- **Preț recepție = preț de vânzare?** Câmpul „Preț recepție" actualizează prețul de raft al produsului, dar stocul se valorează la **cost**, nu la prețul de vânzare cu adaos (378/4428 nu se postează încă). E informativ.
- **Deductibilitatea TVA pe care am pus-o nu se vede în note?** Corect — azi se salvează ca informație pentru contabil, nu schimbă încă nota contabilă (TVA merge integral pe 4426).
- **Vreau ca marfa să intre direct pe stoc din poză / vreau ca angajații doar să pozeze și eu să verific.** Se configurează per firmă în Setări → Stocuri → „Recepție din poză" sau prin asistent (`configure_reception_policy`). Vezi secțiunea „Îți configurezi singur procedura".
- **Cum văd ce au recepționat angajații prin poză?** Dacă ai pornit verificarea, apar în lista „Recepții de verificat" (pagina Preluare Marfă) — sau cere asistentului `list_receptions_to_review`. Le poți deschide, corecta și bifa verificate.
- **Factura are 5 pagini — pot poza tot?** Da. Adaugă câte poze e nevoie (butonul „Fotografiază pagina N") sau încarcă PDF-ul cu mai multe pagini; se analizează ca un singur document.
- **A venit marfă necomandată — o pot primi?** Da, la recepția pe comandă alegi produsul extra din catalog și intră pe stoc cu urmă scrisă (dacă procedura firmei permite angajatului să adauge/mapeze).
- **Am modificat o recepție și nu mă lasă / îmi dă avertisment de inventar.** Începe cu `diagnose_inventory_document_reversal`. O ciornă de factură generată automat din recepție trebuie abandonată întâi, fără a șterge recepția; apoi refaci diagnosticul. Dacă loturile au fost deja consumate/vândute, anulezi întâi mișcările din aval. Dacă între timp s-a făcut inventar, reverifici soldurile. Nu compensa o recepție greșită printr-o ajustare opacă: păstrează traseul de anulare și audit.
- **„Permisiune insuficientă" la map_invoice_line / set_invoice_context?** Tokenul nu are modulul `inventar` („Stocuri & Recepție"). Activează-l din portal Hub → Acces AI.
