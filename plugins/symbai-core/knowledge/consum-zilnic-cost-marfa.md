# Consum zilnic & costul mărfii vândute

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

Fișiere-frate care completează acest ghid: `stocuri-inventar-furnizori.md` (marfa, intrările, ieșirile), `produse-meniu-retete.md` (rețete, randament, unități), `gestiuni-magazii-zone.md` (gestiuni și zone), `rapoarte-preturi.md` (food cost și P&L).

## Pe scurt

Vânzarea **nu** scade stocul în secunda în care încasezi. O dată pe zi, automat, sistemul ia notele **închise** din zilele deja încheiate, desface fiecare produs vândut în ingredientele din rețeta lui, scade cantitățile din gestiunea potrivită și scoate marfa din loturile reale — întâi cel care **expiră primul**. Costul realizat vine din loturile recepționate cât timp ele acoperă cantitatea; partea neacoperită (recepție lipsă/stoc negativ) folosește costul mediu al gestiunii și trebuie investigată.

Două excepții de reținut din prima: **comenzile de livrare (Glovo/Wolt/Bolt/Tazz) scad stocul imediat ce comanda e livrată**, iar **ziua de azi se procesează abia mâine**.

## Concepte

- **Consum zilnic** — scăderea automată a materiei prime din vânzări. Rulează o dată pe zi, pe zilele **încheiate**. Zilele sărite (server oprit, zi blocată) se recuperează singure în rulările din următoarele câteva zile.
- **Stoc live** — ce vezi pe ecran în timpul zilei: stocul de pe documente **minus** consumul estimat al zilei curente, calculat din liniile deja **trimise la bucătărie**. E o estimare, nu o mișcare de stoc; ce se vinde fără trimitere la bucătărie (bar, retail) nu intră în estimare și apare abia la rularea de a doua zi.
- **Bon de consum** — documentul rezultat: câte unul pe fiecare gestiune, pe zi. Se deschide și se verifică linie cu linie.
- **Cost realizat** — costul luat din loturile chiar consumate, la prețurile lor de intrare. E cel folosit în P&L și în raportul de sfârșit de zi.
- **Cost teoretic** — costul calculat din rețetă și din prețurile de achiziție. Se folosește pentru analiză/previziune și ca rezervă acolo unde nu există încă un consum realizat.
- **Scădere automată din stoc** — comutatorul general din Setări → Stocuri. Oprit = **nu se generează și nu se recalculează niciun consum**, oricâte vânzări ai avea, și nu primești nicio eroare.
- **Lună închisă contabil** — după închiderea unei luni, consumul acelei perioade nu se mai poate genera și nici recalcula. Se redeschide din Finanțe, apoi se reînchide.
- **Reprocesare (recalculare)** — anularea consumului deja făcut și refacerea lui cu datele corecte de azi.

## Paginile modulului

- **Consum Zilnic** (`/daily-consumption`) — 4 taburi: **Sumar Consum** (ce s-a consumat pe zi/perioadă, zilele lipsă), **Bonuri de Consum** (documentul pe fiecare gestiune), **Consum Temporar** (produse vândute fără rețetă), **Istoric Reprocesări**. Tot aici sunt „Reprocesare Vânzări" (pe perioadă) și meniul de remediere per produs.
- **Verificări Stoc** (`/inventory-check`) — tabul Stoc Live, pentru cantitatea curentă estimată.
- **Setări → Stocuri** — comutatorul „Scădere automată din stoc" și metoda de evaluare.

## Când se întâmplă (calendarul)

1. Ziua de lucru se închide; notele rămân în sistem cu ora închiderii lor.
2. O dată pe zi, automat, sistemul procesează zilele **încheiate** — niciodată ziua curentă.
3. Vânzarea de azi apare ca mișcare de stoc **mâine**. Până atunci o vezi doar în stocul live.
4. Dacă o zi a fost sărită, rulările următoare o recuperează singure (se acoperă ultima săptămână).
5. Rezultatul se vede în `/daily-consumption` → Sumar Consum, iar documentul propriu-zis în Bonuri de Consum.

⚠ Nu declara o problemă înainte de a verifica **ziua**: cea mai frecventă „lipsă de consum" este pur și simplu o zi care încă nu a venit la rând.

## Ce intră și ce nu intră în consum

**Intră:**
- notele **închise/finalizate** ale zilei (contează ora închiderii notei, nu ora comenzii);
- produsele **oferite** (protocol, consum intern aprobat) și cele **transferate** între mese — ele consumă stoc real, chiar dacă nu aduc venit;
- suplimentele și opțiunile legate de un produs real din catalog.

**Nu intră:**
- mesele **încă deschise** — o masă neînchisă nu consumă niciodată, oricât ar sta deschisă;
- liniile anulate, stornate sau returnate;
- notele cu metodă de plată configurată „fără consum" (Setări → Metode de plată). ⚠ O notă **fără nicio metodă de plată** setată consumă întotdeauna, indiferent de acea configurare;
- linia-părinte a **Meniului Zilei** — consumă felurile alese, nu meniul în sine;
- ingredientele scrise doar ca text, **nelegate** de un produs din catalog, și ingredientele al căror produs a fost șters: sunt raportate ca rutare incompletă și opresc generarea, ca să nu rezulte un consum parțial.

⚠ **Semipreparatele se scad pe un singur nivel.** Dacă un preparat are ca ingredient un semipreparat, se scade semipreparatul ca atare, nu ingredientele lui. Ca să existe pe stoc, semipreparatul trebuie **produs** din modulul Producție; altfel intră pe minus.

## Din ce gestiune scade

Se decide **pentru fiecare ingredient în parte** (nu pentru rețetă), în funcție de locația unde s-a vândut, în ordinea:

1. regula manuală pusă pe produs pentru acea unitate (brand + locație) — **bate tot**;
2. o gestiune a produsului aflată chiar în locația vânzării;
3. gestiunea „de casă" a produsului (de pe fișa lui; poate fi o gestiune centrală validă);
4. gestiunea de bucătărie a locației (sunt recunoscute atât „Bucătărie", cât și „Bucatarie"), altfel prima gestiune a locației;
5. în ultimă instanță, gestiunea implicită a companiei.

⚠ Motorul folosește numai gestiuni **active și neșterse**. Un override explicit sau gestiunea de casă poate indica o gestiune centrală validă; fallback-urile automate rămân în locația vânzării. Dacă o asignare indică o gestiune dezactivată/ștearsă ori niciun ingredient nu poate fi rutat sigur, generarea se oprește cu lista exactă a liniilor — nu creează un consum parțial. Zonele de depozitare se aplică atât consumului zilnic, cât și livrărilor atunci când gestiunea are urmărirea pe zone activă.

⚠ **Etichetele (tagurile) nu aleg gestiunea de consum.** Ele controlează vizibilitatea în meniu și rutarea operațională (imprimantă/KDS). Pentru un produs comun mai multor locații, verifică fiecare ingredient cu `diagnose_consumption_warehouse_routing(productId, brandId, locationId)`; rezultatul arată regula exactă ce a câștigat și semnalează orice ingredient care ar scădea din altă locație.

## Din ce lot scade și cât costă

- Ordinea de descărcare este mereu **„expiră primul"**; la termene egale sau fără termen, iese primul cel **intrat primul**.
- ⚠ „Metoda de evaluare" din Setări → Stocuri (FIFO / LIFO / medie) **nu schimbă din ce lot iese marfa** — ea influențează doar costul estimativ afișat înainte de a exista consum real.
- Cantitatea neacoperită de loturi (stoc negativ, recepție lipsă) se valorizează la **costul mediu al gestiunii**.
- ⚠ **Un lot recepționat cu cost 0 consumă „gratuit"**: acoperă cantitatea, contribuie 0 la cost și trage food cost-ul în jos fără nicio eroare vizibilă. Îl găsești cu `scan_suspect_reception_costs` și `get_product_reception_history`.
- Consumul zilei se înregistrează în registru la **sfârșitul zilei de business**. O numărare de inventar închisă la ora 14:00 nu include consumul acelei zile.

## Ce oprește complet consumul

1. **„Scădere automată din stoc" oprită** în Setări → Stocuri — prima verificare la „nu-mi scade stocul deloc, la niciun produs".
2. **Luna închisă contabil** — nici generare, nici recalculare pentru acea perioadă.
3. **Loturi rezervate** de o sesiune de producție sau o comandă neterminată — deblochează sesiunea, apoi regenerezi ziua.
4. La **fabrici**, consumul se oprește dacă loturile nu acoperă cantitatea. E o protecție intenționată: la fabrică nu se permite stoc negativ. La restaurant stocul negativ e permis — e semnal de recepție neînregistrată sau de unitate greșită în rețetă, nu blocaj.

## Livrările (Glovo / Wolt / Bolt / Tazz)

- Scad stocul **imediat** ce comanda e marcată livrată/ridicată, cu bon de consum propriu — nu așteaptă rularea zilnică.
- Descarcă aceleași loturi reale și același registru de stoc ca restul consumului; costul realizat rezultat este vizibil în P&L. Nota contabilă de consum nu se dublează pe fluxul de livrare (`skipGl`), dar asta nu transformă costul în unul teoretic.
- **Recalcularea pe perioadă include acum și comenzile de livrare finalizate** din interval. Reprocesarea pe un singur produs le include de asemenea, când produsul apare pe linia comenzii sau ca opțiune legată canonic.
- Dacă regenerarea unei livrări eșuează, jobul trebuie să se încheie `completed_with_errors` și să arate comanda, motivul și liniile de rutare rămase; nu considera intervalul complet reparat până nu dispar aceste erori.

## Consum Temporar (produse vândute fără rețetă)

Tabul **Consum Temporar** listează produsele vândute care n-au rețetă legată. Fiecare intrare = food cost greșit. Ce faci, pe produs:

1. **Creează rețetă nouă** sau **Asociază o rețetă existentă** (`associate_recipe_to_product`, `link_recipe_products`);
2. sau **Transformă în alt tip** — dacă e marfă revândută ca atare (`change_product_type`);
3. sau **mută-l în Mese Servite**, dacă e o masă de personal (`move_product_to_served_meal`);
4. apoi apasă **„Reprocesează acest produs"** ca să se descarce corect și retroactiv.

## Recalcularea consumului (reprocesare)

**Când o faci:** ai corectat o rețetă, ai corectat un preț de intrare pe o factură veche, ai schimbat tipul unui produs, ai legat o rețetă lipsă. Corectura **nu rescrie trecutul** de una singură.

**Cele două forme:**
- **Pe perioadă** — din `/daily-consumption` → „Reprocesare Vânzări", cu preseturi (30 zile / 3 luni / 6 luni) sau interval liber. Rulează ca job pe fundal, cu progres. Poți alege rețetele „de atunci" (istoric fidel) sau cele de azi (corectură retroactivă).
- **Pe un singur produs** — „Reprocesează acest produs", chirurgical: atinge doar produsul ales, inclusiv aparițiile lui din livrări.

**Ce se întâmplă:** consumul vechi este scos temporar din stoc, dar documentele lui rămân păstrate până când toate zilele noi au fost postate corect. Sistemul recalculează cronologic și rescrie costul. Dacă o singură zi eșuează, retrage toate documentele noi și restaurează documentele vechi în ordinea lor; nu lasă intervalul pe jumătate.

**Ce o blochează:** lună închisă contabil; „Scădere automată din stoc" oprită; un job deja pornit pe aceeași locație.

⚠ **După recalculare verifică soldurile pe gestiuni.** Recalcularea folosește aceeași cascadă canonică de rutare ca generarea inițială, inclusiv gestiunea produsului din locația vânzării. Totuși, folosește configurația de **azi**; dacă ai schimbat între timp o asignare sau un override, rezultatul istoric se poate muta legitim.
⚠ **Un job poate termina `completed_with_errors`.** Dacă eroarea este pe o zi de consum, starea zilnică veche a întregului interval este restaurată. Dacă eroarea este doar pe o livrare, zilele pot fi refăcute, iar livrarea veche rămâne păstrată prin swap-ul sigur. Nu trata rezultatul ca succes complet: citește problemele structurate (zi, comandă, produs, motiv), repară-le și reia numai după corectarea cauzei.
⚠ Recalcularea rulează **după** ce ai corectat cauza (prețul de recepție sau rețeta), nu înainte.

## Costul mărfii vândute (COGS) în rapoarte

- P&L, sfârșitul de zi și KPI-urile folosesc costul **realizat**, din loturile chiar consumate.
- Diferența față de costul din rețetă e normală și e chiar un indicator: vine din porționare, risipă și prețuri diferite pe loturi.
- **Livrările finalizate** au cost realizat din loturile descărcate imediat — vezi mai sus.
- **Produsele oferite/protocol** consumă stoc fără să aducă venit, deci urcă procentul de food cost fără nicio greșeală de date. Verifică-le volumul înainte de a căuta o problemă.
- Valoarea afișată în lista rulărilor de consum e o estimare pe cost mediu; cifra autoritară e cea din rapoarte.

## Tool-uri MCP utile

**Citire (nu schimbă nimic; cer grantul de citire pe modulul indicat):**
- `get_daily_consumption_status` — s-a generat consumul pentru o dată? (citire `inventar`)
- `get_consumption_breakdown` — **ce** s-a consumat efectiv într-un interval: pe zi, pe produs sau pe gestiune, cu cantitate și valoare. Semnalează separat liniile fără cost, care trag food cost-ul în jos fără să dispară din cantități.
- `audit_consumption_chain` — verifică lanțul vânzare → consum → stoc → notă contabilă pe un interval și spune **unde s-a rupt**: zile cu note închise dar fără consum, documente rămase ciornă (stocul nu a scăzut), documente fără notă contabilă, consum fără cost și **stoc negativ** în gestiunile atinse. Rulează-l ca verificare finală după orice recalculare sau schimbare de gestiuni.
- `scan_recipe_consumption_gaps` — ce **blochează** consumul din partea rețetelor: ingrediente fără produs legat sau cu produsul șters (astea opresc generarea pentru ziua întreagă, nu consumă parțial), rețete cu același nume, randamente citite greșit.
- `diagnose_consumption_warehouse_routing` — simulează produsul într-un brand+locație și arată, ingredient cu ingredient, gestiunea aleasă, sursa alegerii și orice abatere către altă locație.
- `get_reprocess_job_status` — progresul unui job de recalculare (citire `inventar`).
- `get_stock_levels` — stocul curent, cu defalcare pe gestiuni; cu `warehouseId` doar gestiunea aleasă.
- `list_lots` / `get_lot_details` — loturile din care se scade (cantitate rămasă, cost, expirare).
- `scan_zero_cost_sold` — produse vândute cu cost 0 (fără rețetă sau cu ingrediente necostate).
- `scan_suspect_recipe_costs` — rețete cu cost absurd (cantități imposibile, randament greșit).
- `scan_recipe_unit_mismatches` — ingredientele a căror unitate NU se poate traduce în unitatea produsului („25 g" pe un produs ținut la „buc"). Exact cazul în care cantitatea se folosește ca atare și scade 25 de borcane. Întoarce separat ce se poate corecta automat și ce cere decizie umană.
- `scan_suspect_reception_costs` / `get_product_reception_history` — loturi intrate cu preț greșit.
- `analyze_food_costs` (modul `produse_meniu`), `generate_report` cu tipul `food_cost` sau `stock_value`.
- `list_recipes` / `get_recipe_details` (modul `retete`), `get_product_details` — rețeta legată, randamentul, unitatea produsului.
- `exec_trace_lot_destination` (modul `productie`) — unde a plecat un lot.

**Scriere (cer modulul de permisiune pe token):**
- `generate_daily_consumption` 🔒 (modul `inventar`) — generează consumul unei zile.
- `reprocess_daily_consumption` 🔒 (modul `financiar`) — recalcularea pe perioadă; progresul se citește cu `get_reprocess_job_status`.
- `fix_reception_costs` 🔒 (modul `financiar`) — corectează costul unor loturi intrate greșit; după el, recalcularea e obligatorie.
- `fix_recipe_ingredient` 🔒, `update_recipe`, `set_ingredient_purchase_prices` 🔒, `set_product_manual_cost` 🔒, `set_standard_costs` — reparațiile de rețetă și de cost.
- `associate_recipe_to_product` 🔒, `link_recipe_products`, `change_product_type` 🔒, `move_product_to_served_meal` 🔒 — rezolvarea Consumului Temporar.
- `assign_product_warehouses`, `update_product` — fixarea gestiunii din care se scade.

⚠ **`generate_daily_consumption` generează consumul întregii zile pentru unitatea aleasă.** `warehouseId` **nu** restrânge generarea la o singură gestiune (e doar gestiunea de rezervă când produsul n-are una) — nu-l folosi ca filtru. Dacă ziua e deja generată, tool-ul refuză; ștergerea și refacerea rulării se fac din pagina Consum Zilnic.

⚠ **Pe conexiunile legate de un angajat, modulul de pe token nu e suficient:** angajatul trebuie să aibă și dreptul din rolul lui pentru tipul de document (mișcări de stoc, consum, ajustări). Altfel tool-ul răspunde că lipsește permisiunea, deși modulul e activ.

### Ordinea corectă când repari stocurile

Când muți produse între gestiuni sau repari rețete, recalcularea singură nu e suficientă — trebuie și verificat rezultatul:

1. `audit_product_warehouse_coverage` — vezi câte produse n-au gestiune și care ar consuma din gestiunea greșită.
2. `plan_material_warehouses` → `apply_material_warehouse_plan` 🔒 — pui produsele în gestiunile corecte.
3. `scan_recipe_consumption_gaps` + `scan_recipe_unit_mismatches` — repari rețetele **înainte** de recalculare. Un ingredient nelegat oprește generarea zilei întregi, deci recalcularea ar eșua oricum.
4. `reprocess_daily_consumption` 🔒 pe perioada afectată.
5. `get_reprocess_job_status` — **aștepți să se termine**. Cât rulează, documentele vechi sunt de-postate temporar, iar un audit făcut atunci arată probleme care nu există.
6. `audit_consumption_chain` + `get_consumption_breakdown` — confirmi că stocurile au ieșit corecte.

⚠ **Documentele rămase ciornă nu se postează la întâmplare.** Dacă pe aceeași zi și gestiune mai există documente de consum, postarea unei ciorne scade stocul a doua oară. `audit_consumption_chain` le separă: îți dă id-urile sigur postabile și, separat, pe cele nepostabile, cu motivul.

⚠ **Ce rămâne doar din aplicație:** ștergerea unei rulări de consum, recalcularea pe un singur produs și detaliul istoric „ce produs vândut a consumat ce ingredient". Lista zilelor lipsă pe interval se citește prin `get_daily_consumption_status(dateFrom, dateTo, locationId?)`, iar rutarea viitoare pe ingredient prin `diagnose_consumption_warehouse_routing`.

## Întrebări frecvente și capcane

**1. „De ce nu mi-a scăzut stocul după ce am vândut?"**
Scăderea nu e instantanee — se face o dată pe zi, pentru zilele **încheiate**. Vânzarea de azi se vede în stoc mâine (livrările fac excepție).
*Verifici, în ordine:* `get_daily_consumption_status` pe **ieri**, nu pe azi; nota e **închisă**? (o masă deschisă nu consumă niciodată); metoda de plată e configurată „fără consum"?; produsul are rețetă legată — `list_recipes` + `get_recipe_details`; „Scădere automată din stoc" e pornită?
*Repari:* închizi nota; corectezi metoda de plată; legi rețeta; apoi, **cu acordul utilizatorului**, `generate_daily_consumption` 🔒 sau „Reprocesează acest produs".

**2. „De ce nu s-a generat consumul de ieri / de o săptămână?"**
Trei cauze, în ordine: comutatorul „Scădere automată" oprit; luna închisă contabil; loturi rezervate de o sesiune de producție neterminată.
*Verifici:* `get_daily_consumption_status` pe fiecare zi din interval; Setări → Stocuri; starea lunii în Finanțe; `list_lots` pentru loturi blocate.
*Repari:* pornești comutatorul / redeschizi luna / închizi sesiunea de producție → `generate_daily_consumption` 🔒, zi cu zi. La fabrică, dacă mesajul e „loturi insuficiente", vezi întrebarea 6.

**3. „De ce e food cost-ul aiurea (150% sau 3%)?"**
Aproape întotdeauna una din trei: unitate imposibilă în rețetă (grame pe un produs ținut la bucată → se consumă bucăți), **randament** pus greșit (împarte toate cantitățile), sau ingrediente fără preț.
*Verifici:* `scan_recipe_unit_mismatches` (cel mai rapid — scoate direct perechile de unități imposibile), apoi `analyze_food_costs` → `scan_suspect_recipe_costs` → pe rețetele suspecte `get_recipe_details` (randamentul!) + `get_product_details` pe fiecare ingredient; `scan_zero_cost_sold` pentru cost 0.
*Repari:* `fix_recipe_unit_mismatches` 🔒 pentru unitățile cu propunere sigură (repară doar rețeta — istoricul cere recalculare după); restul manual în rețetă.
*Repari:* `fix_recipe_ingredient` 🔒 sau editare din pagina de rețete; Setări → Reparații → „Corectează unități neconvertibile"; `set_ingredient_purchase_prices` 🔒 / `set_standard_costs`; abia apoi **recalculezi** perioada afectată.

**4. „De ce diferă costul din P&L de cel din rețetă?"**
E normal și e chiar un indicator. Rețeta dă costul teoretic; P&L folosește costul realizat, din loturile chiar consumate — inclusiv loturile descărcate imediat pentru livrări finalizate. Diferența vine din porționare, risipă și prețuri diferite pe loturi. **Produsele oferite/protocol** consumă fără venit și pot ridica procentul fără ca datele să fie greșite.
*Verifici:* `generate_report` (`food_cost`) față de `analyze_food_costs`; `list_lots` pe 1-2 ingrediente; volumul produselor oferite în raportul de sfârșit de zi.
*Repari:* nimic, dacă diferența e mică. Dacă e mare, caută loturi cu cost 0 sau absurd (`scan_suspect_reception_costs`).

**5. „Am corectat rețeta / prețul de pe factură și rapoartele arată la fel."**
Corectura **nu rescrie trecutul**. Consumul deja făcut rămâne cu cifrele vechi până îl recalculezi.
*Verifici:* ce perioadă e afectată; luna e deschisă contabil?
*Repari:* pentru toate produsele → „Reprocesare Vânzări" pe interval, sau `reprocess_daily_consumption` 🔒 + `get_reprocess_job_status`. Pentru un singur produs (și pentru **livrări**) → „Reprocesează acest produs". ⚠ După recalculare verifică soldurile pe gestiuni.

**6. „Am stoc negativ" / „consumul e blocat cu «loturi insuficiente»."**
La restaurant stocul negativ e permis intenționat — e semnalul că lipsește o recepție sau că unitatea din rețetă e greșită. La fabrică sistemul **oprește** consumul în loc să meargă pe minus.
*Verifici:* `get_stock_levels`; `list_goods_receipts` — există recepția?; `list_pending_nirs` — a rămas un NIR ciornă nepostat?; unitatea rețetei față de unitatea produsului; `list_unreceived_goods` pentru „produsul vândut e altul decât cel pe care vin recepțiile".
*Repari:* postezi NIR-ul rămas ciornă (`post_inventory_document` 🔒); înregistrezi recepția lipsă; corectezi unitatea; dacă sunt două produse aproape identice, `preview_finished_product_merge` → `merge_finished_products`.

**7. „Am pus poza cu factura și nu s-a întâmplat nimic."**
Depinde de procedura aleasă de firmă (Setări → Stocuri → „Recepție din poză"): pe **doar ciornă** documentul așteaptă în „Avize & Draft" până îl mapezi, aprobi și faci NIR; pe **verificare imediată** intră după ce confirmi produsele; pe **direct pe stoc** intră singur doar când totul e curat — orice nelămurire trece la verificare, cu motivul scris.
*Verifici:* `get_reception_policy`; `list_received_efactura`; `list_receptions_to_review`.
*Repari:* duci documentul mai departe (mapare → NIR) sau schimbi procedura cu `configure_reception_policy`, după ce explici efectul.

**8. „Am primit factura de două ori" / „văd două documente identice."**
Poza și e-Factura oficială sunt același document. Dacă poza nu era aprobată și sumele se potrivesc, e-Factura o înlocuiește automat; dacă sumele diferă mai mult de 1 leu / 0,5%, sistemul nu alege singur și le lasă pe amândouă.
*Verifici:* `list_received_efactura` — compară numărul și totalul; `list_goods_receipts` — s-a făcut NIR pe amândouă?
*Repari:* dacă **niciuna** n-are NIR → tabul **Reconciliere** → „Leagă" (verifică numărul și suma înainte, legarea nu le verifică). Dacă **ambele** au NIR și marfa a intrat de două ori → anulezi/stornezi NIR-ul greșit din tabul Recepții; **nu** corecta prin ajustare de inventar.

**9. „Nu pot crea NIR-ul."**
NIR-ul cere ca **toate** liniile să fie mapate și acceptate, iar produsele mapate să existe încă în catalog.
*Verifici:* `get_received_efactura_details` → liniile fără produs, neacceptate sau cu produs doar propus; `get_invoice_intake_decision` pentru verdictul complet.
*Repari:* `map_invoice_line` pe fiecare linie lipsă; `accept_all_invoice_mappings` pentru cele deja mapate; produsele **propuse** se acceptă individual din pagină; dacă factura are linii sparte sau absorbite, NIR-ul se face din aplicație. Apoi `create_nir_from_invoice` 🔒.
⚠ Cazul care derutează cel mai des: linia **are** produs, dar **nu are cont contabil** — se întâmplă la regulile învățate din catalogul furnizorului sau din recepția pe comandă. Acceptarea în bloc o sare tăcut. Pune contul cu `map_invoice_line` pe acea linie.

**10. „După recepție cantitatea e de 24 de ori mai mare (sau mult prea mică)."**
Factorul de pachet: fie a fost aplicat unul greșit, fie lipsește. Valoarea liniei rămâne mereu cea din factură — se schimbă doar cantitatea și prețul unitar.
*Verifici:* `get_received_efactura_details` → cantitatea și prețul original al furnizorului față de cele mapate și factorul aplicat; Reguli de Mapare → regula furnizorului pentru acea descriere.
*Repari:* dacă NIR-ul **nu** e făcut, `map_invoice_line` cu factorul corect (numărul de bucăți din pachet) sau fără factor; dacă NIR-ul e postat, corectezi din aplicație cu „Modificare NIR". **Obligatoriu** corectează și regula învățată, altfel se reaplică la următoarea factură.

**11. „Stocul pe gestiuni nu bate / marfa a scăzut din altă gestiune decât mă așteptam."**
Două lucruri diferite. (a) Ecranul principal de Stocuri arată **totalul pe toate gestiunile**, grupat sub gestiunea de casă a produsului — nu e o eroare de date. (b) Gestiunea din care se scade se alege per ingredient, după cei 4 pași de mai sus.
*Verifici:* `get_stock_levels` pe produs (defalcarea) și pe gestiune; `get_product_details` (gestiunea de casă); `list_warehouses_full`.
*Repari:* fixezi gestiunea cu `assign_product_warehouses` și/sau gestiunea de casă (`update_product`); dacă marfa e fizic în altă parte, faci **transfer** (`create_inventory_document` 🔒), nu ajustare. Notă: gestiunea de bucătărie folosită ca rezervă se recunoaște după numele scris **fără diacritice**.

**12. „Am schimbat contul pe linia de factură și nota contabilă e la fel."**
Corect. La marfa care intră pe stoc, nota contabilă se face **din tipul produsului** (și din conturile personalizate pe tip/unitate). Contul de pe linie se vede în mapare și în rapoarte și decide nota doar la liniile de **cheltuială** (servicii, utilități, transport). Excepție: la liniile cu **taxare inversă**, nota se face după regula fiscală, nu după conturile tipului.
*Verifici:* `get_product_details` → tipul produsului; `list_product_types` / `get_product_type_details` → ce conturi are tipul; `get_journal_entries_summary` → ce s-a înregistrat efectiv.
*Repari:* schimbi tipul produsului (`update_product` sau `change_product_type` 🔒) ori conturile tipului (`update_product_type`, modul `financiar`), apoi refaci nota din aplicație. ⚠ Confirmarea liniei învață o regulă pentru **furnizor + descriere**, nu pentru orice furnizor; la marfa stocabilă corectura notei se face pe tipul produsului, nu doar pe linie.

## Pentru acces SQL

Dacă tokenul are activat accesul SQL (doar-citire), descoperă întâi structura cu `list_database_tables` → `describe_database_table`, apoi interoghează cu `execute_sql_query`. Găsești rulările de consum pe zi, documentele și liniile de consum, loturile și mișcările de stoc, rețetele cu ingredientele lor.

Exemple de întrebări: „pentru ce zile din ultima lună nu s-a generat consum", „ce produse vândute în ultimele 30 de zile nu au rețetă legată", „ce ingrediente au fost consumate cu cost 0 luna trecută", „ce loturi au fost consumate pentru un anumit produs".
