# Intrări Marfă — recepția facturilor de la furnizori (pas cu pas)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`. Acest fișier completează `stocuri-inventar-furnizori.md` (privirea de ansamblu pe stocuri) și `finante-facturare-contabilitate.md` (conturi & note contabile) — citește-le pe acelea pentru context. Aici intrăm în detaliu DOAR pe pagina **Intrări Marfă** (`/stock-entries`).

## Pe scurt

„Intrări Marfă" e locul unde marfa de la furnizori intră oficial în stoc și în contabilitate. Drumul e mereu același: **factura intră → liniile facturii se leagă (mapează) la produsele tale + conturi → se creează NIR-ul → NIR-ul postat bagă marfa pe stoc și generează automat notele contabile.** Stocul NU se mișcă niciodată mai devreme — nici la „recepție din poză", nici la recepția pe comandă; doar NIR-ul postat mișcă stocul.

## Cele 5 taburi ale paginii

1. **Facturi Furnizori** — toate facturile de intrare, din toate sursele (eFactura/ANAF, poză OCR, import din contabilitate, manual). Aici mapezi, vezi statusul și pornești recepția.
2. **Avize & Draft** — avizele (marfă primită înainte de factură) + ciornele (facturi tastate manual sau din poză, neaprobate încă). Ciornele din poză au buton **Aprobă** (le mută în „Facturi Furnizori").
3. **Reconciliere** — leagă un aviz / o ciornă de **factura oficială (eFactura)** care vine mai târziu, ca să nu intre marfa de două ori și să nu se piardă nicio factură.
4. **Recepții (NIR)** — notele de recepție (NIR) deja create; de aici postezi pe stoc, tipărești „Nota de recepție și constatare de diferențe", vezi notele contabile.
5. **Producție** — intrările generate automat din modulul de producție (produse finite/semifabricate).

## Cele 4 surse din care intră o factură

- **eFactura / ANAF** — descărcată din SPV (butonul „Importă eFactura").
- **Recepție din poză (OCR)** — faci poză la factură/aviz; AI-ul citește liniile și creează o **ciornă** (vezi mai jos — NU intră pe stoc singură).
- **Push din contabilitate** — contabilul împinge factura din Symbai Accounting.
- **Manual** — butonul „Document Nou", tastezi tot.

## Maparea unei linii (cea mai importantă operație)

Fiecare linie de factură are descrierea **furnizorului** (ex. „TABLA CUTATA WTB W60"). Trebuie legată de:
- **Produsul tău intern** (din catalog) — ca să intre pe stocul corect.
- **Contul contabil de cost/stoc** (ex. 371 mărfuri, 301 materii prime, 628 servicii) — se completează **automat din tipul produsului**; îl poți schimba.
- **Contul de TVA** (de regulă 4426 TVA deductibilă).

AI-ul propune maparea, tu o **confirmi (accepți)**. Sistemul **învață**: următoarea factură de la același furnizor cu aceeași descriere se mapează singură. O linie neacceptată **blochează** crearea NIR-ului.

Locuri de mapare: pe fiecare factură (modala „Mapare e-Factură") sau centralizat în **Revizuire Mapări AI** (`/inventory/ai-review`) — toate liniile fără recepție, într-un singur ecran.

### Tip produs = ce conturi primește
Tipul produsului (marfă, materii prime, consumabile, ambalaje, serviciu, utilități, combustibil, imobilizări etc.) decide automat conturile pe **momente**: la intrare pe factură (`invoice_entry`), la NIR/adaos, la consum, la vânzare. Vezi `finante-facturare-contabilitate.md` și pagina „Conturi pe Tip Produs" (`/ai-product-types`). Dacă o linie de serviciu ajunge greșit pe un cont de marfă (371), schimbă tipul produsului sau contul pe linie.

### Reconversie (factor de pachet)
Dacă furnizorul facturează în „bax" dar tu ții produsul la bucată, pui **factorul de pachet** (ex. un bax = 24): cantitatea se înmulțește (×24), prețul unitar se împarte (÷24), iar valoarea originală din factură rămâne neatinsă. Se învață automat pentru data viitoare.

### Preț recepție / preț vânzare
Pe linie poți pune prețul de raft (la marfă apare „Preț recepție", la restul „Preț vânzare"). Acesta actualizează `receptionPrice` pe produs (prețul de raft) și se reține pe NIR. **Atenție (corect contabil):** sistemul postează azi marfa pe stoc la **costul de achiziție**, NU la prețul de vânzare cu adaos (conturile 371/378/4428 de „recepție la preț de vânzare" sunt configurate dar nu se execută încă la postare). Deci prețul de recepție e informativ pentru raft, nu schimbă valoarea de stoc.

### Deductibilitate TVA / cheltuială + cheltuieli în avans (471)
Pe factură poți seta: deductibilitatea TVA (100% / 50% vehicule / pro-rata / 0% / custom), deductibilitatea cheltuielii (protocol 2%, social 5%, diurnă 2.5×, sponsorizare, perisabilități etc.) și cheltuieli în avans (cont 471 + nr. luni + dată). **Important:** azi aceste valori se **salvează ca informație** pentru contabil, dar NU schimbă încă notele contabile generate automat (TVA se trece integral pe 4426). Sunt utile ca etichetă/intenție, nu ca motor de calcul.

## Crearea NIR-ului (intrarea pe stoc)
Când toate liniile sunt mapate și acceptate: alegi **depozitul (magazia)** și apeși **Creează NIR**. NIR-ul se postează → marfa intră pe stoc pe loturi → se generează automat notele contabile (Debit stoc + Debit 4426 TVA / Credit 401 Furnizor). Dacă factura e doar de servicii/nestocate, NIR-ul se „Finalizează" fără mișcare de stoc.

### Două căi (NU le confunda — dublezi stocul)
- **Recepție DIRECTĂ (fără factură în sistem)** — marfă cash & carry, pe aviz, sau înainte să vină eFactura: se face complet prin MCP cu `create_inventory_document` (docType GOODS_RECEIPT/NIR) + `post_inventory_document`. Marfa intră pe stoc și nota contabilă se generează automat. Verificat live: stoc + notă D 301/371 + 4426 / C 401 corecte, contul derivat din tipul produsului chiar fără tipuri de produs configurate pe brand.
- **NIR legat de o factură existentă** (eFactura/poză/contabilitate, apare în `list_received_efactura`): mapezi liniile prin MCP, apoi creezi NIR-ul LEGAT din aplicație (Recepții → Recepție Nouă → alegi factura sursă). ⚠ NU folosi `create_inventory_document` aici — el creează o recepție SEPARATĂ, nelegată de factură (factura rămâne „fără NIR" și marfa intră de două ori).

### Contul vine din tipul produsului (chiar fără configurare)
Nota contabilă la postare derivă contul de stoc din TIPUL canonic al produsului: raw_material→301, merchandise→371, consumable→302, packaging→381, service→628. Asta funcționează și dacă brandul are 0 tipuri de produs configurate (mapare implicită). Tipurile configurate în „Conturi pe Tip Produs" sunt pentru CONTURI PERSONALIZATE / override-uri, nu pentru cazul de bază. ⚠ La `map_invoice_line` (Calea B), dacă tipul nu permite derivarea, contul cade implicit pe 371 — de aceea produsul trebuie să aibă tipul corect.

## Recepția din poză și reconcilierea cu eFactura (fluxul de la /smart-ordering)

Cum funcționează **azi** (important de știut ca să nu pierzi facturi):
1. Angajatul face „Recepție din poză" → se creează o **ciornă** în „Avize & Draft". **Marfa NU intră pe stoc în acest moment** și NU se creează NIR.
2. Ca să intre pe stoc: cineva mapează liniile → **Aprobă** ciorna → **Creează NIR** cu magazie. Abia atunci se mișcă stocul.
3. Când vine **eFactura oficială** de la ANAF (același furnizor + același număr + sumă apropiată), dacă ciorna din poză e **neaprobată**, sistemul o **înlocuiește automat** (supersede) — ciorna dispare, eFactura devine sursa oficială și apoi creezi UN singur NIR din ea. Așa nu intră marfa de două ori.
4. Dacă suma de pe poză **diferă** de eFactura, NU se înlocuiește automat — primești un avertisment și trebuie să legi tu manual în tabul **Reconciliere** (butonul „Leagă").

> ⚠ Limitări reale (spune-i utilizatorului dacă întreabă): „Recepția din poză" nu pune marfa direct pe stoc; reconcilierea automată merge doar pe ciorne **neaprobate**; legarea manuală în Reconciliere se face **doar pe furnizor** (nu verifică suma/data) — deci verifică tu numărul și suma înainte de „Leagă", ca să nu legi două facturi diferite.

## Cum eviți să pierzi sau să dublezi facturi
- Verifică periodic tabul **Reconciliere** (badge-ul roșu = documente nelegate) și **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — semnalează eFacturi fără NIR, mapări sub 70%, NIR-uri ciornă vechi.
- O ciornă din poză + o eFactura cu **același număr și sumă** trebuie să rămână UN singur document. Dacă vezi două, leagă-le în Reconciliere.
- Înainte de „Leagă" manual: confirmă că numărul facturii și suma se potrivesc (legarea nu le verifică singură).
- NIR creat de două ori pe aceeași factură = stoc dublat. Dacă bănuiești asta, caută în Recepții (NIR) după furnizor + dată.

## Tool-uri MCP utile (conexiunea live)

**Citire (fără permisiune de modul):**
- `list_received_efactura` — listează facturile de intrare (filtre: status, furnizor, brand, interval date, cu/fără NIR, căutare). Vezi rapid ce facturi sunt de procesat (`hasNir:false`).
- `get_received_efactura_details` — antetul unei facturi (furnizor, sume, deductibilitate, dacă are NIR) + toate liniile cu starea mapării (produs, cont, acceptat, factor pachet). Folosește-l înainte de a mapa.
- (general) `list_suppliers`, `search_products_db`, `list_product_types`, `get_stock_levels`, `list_pending_nirs`, `list_reception_notes`.

**Scriere (cer modulul `inventar` = „Stocuri & Recepție" pe token):**
- `map_invoice_line` — leagă o linie la un produs + cont (+ factor de pachet). Contul se rezolvă automat din tipul produsului dacă nu-l dai. Setează linia ca acceptată și învață regula.
- `accept_invoice_line_mapping` — confirmă o linie deja mapată.
- `accept_all_invoice_mappings` — acceptă în bloc toate liniile deja mapate cu încredere ≥ 0.5 (nu creează produse noi — pe acelea le mapezi individual).
- `set_invoice_context` — setează pe factură: tip factură, brand/locație, magazie, deductibilitate TVA/cheltuială, cheltuieli în avans 471, modalitate de plată, observații.
- `create_inventory_document` — creează un document de stoc (recepție DIRECTĂ): docType GOODS_RECEIPT/NIR/PURCHASE_RECEIPT pentru intrare, linii cu productId + qty + unitCost. `autoPost:true`+`confirm:true` postează imediat; altfel rămâne DRAFT.
- `post_inventory_document` — postează pe stoc un document DRAFT (mișcă stocul real, ireversibil — cere confirmarea userului).

> **Recepția DIRECTĂ (fără factură în sistem)** se face acum complet prin MCP: `create_inventory_document` (GOODS_RECEIPT) → `post_inventory_document`. Marfa intră pe stoc + nota contabilă se generează automat.
> **NIR-ul LEGAT de o eFactură existentă** se face încă din aplicație (Recepții → Recepție Nouă → alegi factura sursă) — `create_inventory_document` nu primește `invoiceId`, deci nu leagă recepția de factură. Dă userului linkul cu `gaseste_in_aplicatie`.
> ⚠ După ce o factură are NIR creat, `map_invoice_line` și câmpurile structurale din `set_invoice_context` se BLOCHEAZĂ prin tool (ar dezalinia stocul/contabilitatea) — modificările se fac din aplicație („Modificare NIR").

**Pattern de lucru prin MCP:**
- **Recepție directă (Calea A):** `list_suppliers`/`create_supplier` + `search_products_db`/`create_product` (tip corect) → `create_inventory_document(GOODS_RECEIPT, lines cu unitCost, autoPost:false)` → `list_pending_nirs` (verifică DRAFT) → `post_inventory_document(confirm:true)` → verifică cu `get_stock_levels` + `get_journal_entries_summary`.
- **Factură existentă (Calea B):** `list_received_efactura(hasNir:false)` → `get_received_efactura_details` → pe fiecare linie nemapată `search_products_db` apoi `map_invoice_line` (cont auto din tip; `packMultiplier` pt. bax) → opțional `set_invoice_context` (magazie + deductibilitate) → NIR-ul LEGAT din aplicație. Verifică mereu prin **citire** (`get_received_efactura_details`, `list_received_efactura(hasNir:true)`), nu prin interfață (UI-ul se reîmprospătează la refresh).

**SQL (toggle separat):** tabele `incoming_invoices` + `incoming_invoice_lines` (facturi intrare + linii), `inventory_documents` + `inventory_document_lines` (NIR-uri), `reception_notes` (diferențe), `mapping_rules` + `pack_conversions` (reguli învățate), `product_types` + `product_type_accounts` (conturi pe tip).

## Întrebări frecvente

- **De ce nu pot crea NIR-ul?** O linie e nemapată sau neacceptată, sau e mapată pe un produs șters din catalog. Verifică în Revizuire Mapări AI / `get_received_efactura_details`.
- **Am făcut recepție din poză — de ce nu a scăzut/crescut stocul?** Recepția din poză creează doar o ciornă. Stocul intră abia după mapare → Aprobă → Creează NIR cu magazie.
- **A venit eFactura, dar am deja ciorna din poză — se dublează?** Dacă ciorna e neaprobată și sumele se potrivesc, eFactura o înlocuiește automat. Dacă nu, leagă-le manual în Reconciliere.
- **De ce serviciul a ajuns pe cont de marfă (371)?** Tipul produsului e greșit (marcat ca marfă/stocabil). Schimbă tipul sau contul pe linie. Prin MCP, `map_invoice_line` cu produs de tip serviciu rezolvă automat contul de cheltuială corect.
- **Preț recepție = preț de vânzare?** Câmpul „Preț recepție" actualizează prețul de raft al produsului, dar stocul se valorează la **cost**, nu la prețul de vânzare cu adaos (378/4428 nu se postează încă). E informativ.
- **Deductibilitatea TVA pe care am pus-o nu se vede în note?** Corect — azi se salvează ca informație pentru contabil, nu schimbă încă nota contabilă (TVA merge integral pe 4426).
- **„Permisiune insuficientă" la map_invoice_line / set_invoice_context?** Tokenul nu are modulul `inventar` („Stocuri & Recepție"). Activează-l din portal Hub → Acces AI.
