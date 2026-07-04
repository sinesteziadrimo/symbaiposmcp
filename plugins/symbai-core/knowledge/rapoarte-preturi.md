# Rapoarte, analiză și prețuri

> Pentru linkul exact către orice pagină sau funcție folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul de rapoarte acoperă tot ce ține de cifre: dashboard-ul de start, rapoartele de vânzări, raportul P&L (profit și pierdere) cu KPI-uri, raportul de sfârșit de zi, analiza pe hotel și magazin online, monitorizarea operațională în timp real și snapshot-urile P&L salvate. Tot aici intră întrebările despre prețuri (marjă, food cost, recomandări) și TVA România. Moneda e RON peste tot.

## Concepte

- **Vânzări (cifră de afaceri)** — cât s-a vândut, cu TVA. Filtrabil pe perioadă, brand, locație.
- **Venit brut vs net** — brut = cu TVA; net = fără TVA. Rapoartele le afișează separat, plus TVA-ul defalcat pe cote.
- **Food cost** — costul ingredientelor raportat la vânzări (%). „Teoretic" = calculat din rețete; „realizat" = din consumul efectiv pe loturi. Reper sănătos: 28–32%.
- **COGS (costul mărfii vândute)** — în P&L e **realizat**: calculat din consumul FIFO real pe loturi (ce a costat efectiv marfa vândută), cu fallback pe costul teoretic din rețetă acolo unde lipsește consumul. Reprocesarea consumului se reflectă în rapoarte.
- **Marjă** — preț de vânzare − cost. Brută (după COGS), netă (după toate cheltuielile), sau pe produs/categorie.
- **Prime cost** — COGS + costul cu personalul. Semafor: verde ≤60%, galben ≤65%, roșu peste (praguri configurabile).
- **Prag de rentabilitate (break-even)** — nivelul de vânzări de la care afacerea iese pe profit; afișat în P&L.
- **KPI** — indicator definit de tine: formulă (sumă/număr/medie/raport), praguri semafor (verde/galben/roșu) și direcție de trend; valoarea se calculează în timp real pe perioada aleasă.
- **ADR / RevPAR / TRevPAR / GOPPAR / Occupancy / Avg LOS** — indicatori de hotel: tarif mediu pe cameră, venit pe cameră disponibilă, venit total pe cameră, profit operațional pe cameră, grad de ocupare, durată medie de ședere.
- **Menu engineering** — clasificarea felurilor după marjă și popularitate (ex. ponderea „vedetelor" în venit) — disponibil ca KPI.
- **Snapshot P&L** — un P&L „înghețat" la un moment dat: datele rămân fixe pentru referință, indiferent ce se schimbă ulterior în datele live.
- **Raport Z** — raportul fiscal de zi al casei de marcat; aplicația arată și diferența dintre totalul Z și totalul POS.
- **Zi de business** — ziua de raportare poate avea oră de tăiere personalizată (nu se termină obligatoriu la miezul nopții); raportul de sfârșit de zi respectă fereastra orară.
- **Benchmark / praguri** — limitele verzi/galbene/roșii folosite în P&L, KPI-uri și comparații; se editează din Setări > Setări P&L.
- **TVA România** — cote permise: **21%** (standard), **11%** (redusă), **0%**. Detalierea pe cote apare în raportul de zi și în P&L (tab TVA).
- **Preț de vânzare** — stă pe **articolul de meniu** (același produs poate avea prețuri diferite în meniuri diferite); pe fișa de produs există doar prețul de achiziție/recepție. Costul vine din rețetă.

## Paginile modulului

### Zilnic și operațional
- **Acasă (Dashboard)** (`/`) — pagina de start generică: total produse, alerte de stoc scăzut, valoare totală stoc, total de plată către furnizori (cu restanțe), grafic cu valorile facturilor recente, top produse după stoc, facturi recente. Utilizatorii cu drepturi de rapoarte sunt duși automat la Control Operațional (`/operations`) la intrare.
- **Control Operațional** (`/operations`) — vedere de ansamblu în timp real: cereri de aprobat (discount, anulare etc.) + istoric, comenzi „zombie" (deschise anormal de mult), plăți Viva neverificate și potențial duble (cu verificare pe interval), alerte HACCP, tichete fără rutare KDS, rapoarte zilnice, timing bucătărie, mese deschise, monitor KDS, staff activ pe tură, stare sistem. Tot de aici se trimit notificări către personal.
- **Raport Sfârșit de Zi** (`/finance/end-of-day`) — „foaia de închidere zi", gândită pentru tipărire: sumar (comenzi închise, vânzări brute/nete, TVA total, reduceri, bacșiș, beneficii angajați, food cost, marjă brută), detaliere TVA pe cote, defalcare pe metode de plată, performanță per masă / ospătar / zonă / tag P&L, anulări cu detalii, registru de casă, numărare casă cu variație, rezervări, timpi medii de preparare/ședere și rapoartele Z fiscale per casă de marcat + diferența Z vs POS. Se deschide și din wizard-ul de închidere a zilei, cu ziua și locația preluate automat.

### Vânzări și analiză
- **Rapoarte** (`/analytics`) — hub-ul de rapoarte, cu carduri sumar sus (Venit cu TVA, Venit fără TVA, Venit de Predat, Profit Estimat (NET)) și tab-uri: Raport Zilnic (Z) — cu buton de printare și detaliere TVA pe cote, P&L Detaliat, Vânzări Angajați, Timpi Așteptare, Analiză Mese, **Rapoarte Avansate** (constructor pivot: „vânzări pe X, grupate după Y", cu filtre pe taguri), Produse Vândute (cu calea completă de categorie), Costuri Operaționale, Vânzări & Venituri, Inventar & Costuri, Performanță Personal, Plăți & Metode, Mix Categorii, Rapoarte Gestiune, Note Clienți.
- **Analiză & Rapoarte hotel** (`/hotel/analytics`) — KPI hotel: Occupancy, ADR, Net ADR, RevPAR, TRevPAR, GOPPAR, durată medie ședere, venit camere, venit total, GOP; venituri pe surse, distribuția ferestrei de rezervare, trend anulări și no-show; export raport. *Apare doar cu modulul Hotel activ.*
- **Analiză Vânzări** (`/ecommerce/analytics`) — performanța magazinelor online: venituri zilnice, comparație per website, comenzi pe status, top produse, metode de plată, ultimele comenzi, performanță Google Ads (spend, venit atribuit, ROAS) și Google Analytics 4. *Apare doar cu modulul Magazin Online activ.*
- **Raport Beneficii Personal** (`/reports/staff-benefits`) — ce au consumat angajații pe beneficii (mâncare/băutură personal), grupat pe angajat, regulă, produs sau zi, cu export CSV.

### P&L și KPI
- **Raport P&L** (`/reports/pnl`) — contul de rezultate detaliat: venituri nete (fără TVA), COGS realizat, pierderi (risipă, minusuri), cheltuieli operaționale din facturi (clasificate pe categorii P&L), salarii, venituri din verticale (hotel, B2B, online) → profit brut, prime cost, profit net, prag de rentabilitate. Drill-down ierarhic pe categorii → subcategorii → tipuri de produs și buton „Vezi facturile" pe fiecare linie de cheltuială (deschide lista facturilor din spatele cifrei). Detaliul pe produs are și vedere Pareto: top SKU după profit și linie cumulată 80/20, utilă la „câte produse îmi fac majoritatea profitului?". Pentru fabrici/distribuție apare și secțiunea **Distribuție — pe client, canal și furnizor**: KPI-uri mari de venit/profit/marjă, comparație de marjă pe canal, donut de venit pe canal, ranking clienți, cub produs × client colorat divergent (roșu = pierdere, albastru = profit), plus risc de furnizor/concentrare. Filtre: perioadă cu presetări și interval orar, brand, locație (inclusiv „Fără locație"). Export PDF / Excel și salvare ca snapshot.
- **P&L Livrări** (`/reports/pnl-livrari`) — configurezi segmente de livrare: brand/locație de venit, angajați desemnați pentru manoperă și reguli de cheltuieli (fix, procent din CA, 100% sau procent dintr-o categorie reală). Calculul scade acum automat și costurile reale de platformă din comenzile de canal înregistrate (comision, taxe delivery/service/small-order și promoții suportate de firmă) și întoarce `platformPnl` pe Glovo/Wolt/Bolt/Tazz cu profit contribuție, marjă, discounturi, comenzi nelegate și warninguri de reconciliere. Pagina are comparație cu perioada anterioară de aceeași lungime pentru venit și profit net, plus toggle de comparare. În chat folosești `list_delivery_pnl_segments` → `get_delivery_pnl`.
- **P&L pe zilele săptămânii** (`/reports/pnl-zile`) — profitul real pe Luni–Duminică: venit, COGS, personal, OpEx și profit net agregat + medie pe zi. Folosește când întrebarea este „ce zi e profitabilă?", „merită să țin deschis lunea?", „sâmbătă vs marți", nu doar „ce zi are vânzări mari". Personalul cade pe zilele lucrate din ture, iar cheltuielile se repartizează după regulile din **Setări P&L → Pe zilele săptămânii** (`/settings/pnl-categories?tab=weekday`): egal, proporțional cu încasările, procent din vânzări, sume/ponderi pe zile, data reală sau ture stricte. În chat folosești `get_weekday_pnl`; pentru setări folosești `configure_pnl_day_allocation` și `add_pnl_manual_day_expense`.
- **KPI P&L** (`/reports/pnl-kpi`) — toate KPI-urile definite, pe categorii (venituri, marketing, leaduri, evenimente, finanțe, operațional), cu valoare calculată live, semafor și trend. Definițiile și pragurile se editează din **Setări > Setări P&L**; tot acolo există **template-uri per industrie** (7 profiluri: restaurant/cafenea/bar, hotel/pensiune, spa/parc, fabrică, magazin, e-commerce, servicii) care creează cu un click seturi întregi de KPI-uri gata configurate — ex. prime cost live, food cost %, marjă pe produs, profit net agregatori după comision, vânzări pe oră de muncă, menu engineering.
- **Comparație P&L (entități)** (`/reports/pnl-compare`, alias `/analytics/pnl-compare`) — compară branduri sau locații una lângă alta pe aceleași metrici: matrice comparativă cu heatmap colorat pe pragurile configurate, carduri „Top performer", „Atenție necesară" și „Total consolidat".
- **Comparație P&L pe perioade** (`/reports/pnl-compare-periods`) — același business, perioade diferite (lună vs lună, an vs an, YTD, ultimele N luni, A vs B): profit bridge („de ce s-a schimbat profitul"), tendință și tabel de variație. În chat se obține direct cu tool-ul `compare_pnl_periods`.
- **P&L-uri Salvate** (`/analytics/saved-pnl`) — lista snapshot-urilor P&L înghețate.
- **Detaliu P&L Salvat** (`/analytics/saved-pnl/:id`) — un snapshot cu datele fixe la momentul salvării, peste care poți adăuga **ajustări manuale** (override-uri, venituri/cheltuieli suplimentare) ce recalculează totalurile fără să atingă datele live. Tab-uri: Personal, OpEx detaliat, COGS, Venituri, TVA și taxe, Ajustări manuale, Evenimente, Snapshot original. Export PDF / Excel.

## Fluxuri frecvente

1. **„Cât am vândut azi / luna asta?"** — `raport_vanzari` cu `perioada` potrivită: total încasări, număr bonuri, bon mediu, cash vs card + comparație automată cu perioada anterioară. Pentru detalii vizuale: pagina `/analytics`.
2. **Verific profitul lunii** — `/reports/pnl`, perioada „Luna aceasta" → uită-te la profit net, prime cost și prag de rentabilitate → deschide categoriile de cheltuieli și folosește „Vezi facturile" pe liniile mari.
2b. **Verific produse pe pierdere / profit pe SKU** — `get_product_pnl(mode:"loss", perioada, limit)` → repari costuri lipsă, rețete/prețuri sau ponderea de alocare; folosește `warnings` și `reconciliation` înainte să tragi concluzii. Pentru întrebări de concentrare profit („care 20% produse îmi fac 80% profit?"), deschide drill-down-ul pe produs din `/reports/pnl`, unde graficul Pareto arată procentul cumulativ.
2c. **Verific distribuția B2B / retail** — `get_customer_pnl(mode:"loss", perioada, brandId?)` pentru clienți pe pierdere, `get_channel_pnl` pentru supermarketuri vs magazine proprii vs HoReCa, `get_supplier_pnl` pentru concentrarea achizițiilor și risc de scumpire. Explică userului că marja de distribuție este full-cost: cost marfă alocat + manoperă + regie, deci poate fi mai dură decât venitul brut pe client.
   Pentru dovadă vizuală, deschide `/reports/pnl` și caută secțiunea **Distribuție — pe client, canal și furnizor**: arată KPI-urile mari, bara „unde fac marja", donut-ul de venit, tabelul/rankingul de clienți și heatmap-ul produs × client. În răspunsul către user, rezumă 2-3 concluzii: „canalul X are marja cea mai bună", „clientul Y vinde mult dar are profit mic", „produsul Z pe clientul W e roșu".
2d. **Verific livrările separat** — `list_delivery_pnl_segments` → `get_delivery_pnl(configId, perioada)`. Răspunsul include profitul segmentului și `platformPnl`: comisioane/taxe de platformă, promoții suportate de firmă vs platformă, profit contribuție pe Glovo/Wolt/Bolt/Tazz și warninguri pentru comenzi de platformă nelegate de POS. Dacă nu există segment salvat, `get_delivery_pnl(brandId)` e calcul ad-hoc (venit−marfă + costuri de platformă legate), dar manopera și cheltuielile alese intră doar după configurarea segmentului în `/reports/pnl-livrari`.
2e. **Verific ce zile chiar aduc profit** — `get_weekday_pnl(perioada, brandId?, locationId?)` pentru profit pe Luni–Duminică. Nu îl confunda cu `vanzari_in_timp(grupare:"zi_saptamana")`: acela spune vânzări/trafic; `get_weekday_pnl` scade COGS, personal și OpEx alocat. Dacă apar avertismente despre personal nealocat sau cheltuieli împărțite prea grosier, configurează regulile în `/settings/pnl-categories?tab=weekday`.
3. **Închei o lună contabil** — în `/reports/pnl` setezi perioada și salvezi snapshot-ul → apare în `/analytics/saved-pnl` → în detaliu adaugi ajustările manuale (ex. o cheltuială care nu e în sistem) fără să afectezi datele live → export PDF/Excel.
4. **Pornesc KPI-uri pe industria mea** — Setări > Setări P&L → aplici template-ul industriei (creează KPI-urile, cele existente sunt sărite) → urmărești totul în `/reports/pnl-kpi`.
5. **Verific închiderea zilei** — `/finance/end-of-day` pe ziua dorită: compari totalul Z fiscal cu totalul POS, verifici variația de la numărarea casei și anulările.
6. **Schimb un preț** — `update_menu_item` pentru un articol sau `bulk_update_menu_item_prices` pentru mai multe (potrivire după nume). Înainte, verifică marja cu `analyze_food_costs`.
7. **Food cost prea mare** — `analyze_food_costs` (per produs, cu status EXCELENT/OK/ATENȚIE/CRITIC) + `analyze_recipes` (rețete incomplete sau cu costuri lipsă umflă/falsifică costul) → ajustezi rețete sau prețuri.
8. **Care locație merge mai bine?** — `/reports/pnl-compare` pe dimensiunea „locații": heatmap pe marjă, food cost, labor, prime cost.

## Tool-uri MCP utile

**P&L prin conexiune (citire, fără permisiune de modul):**
- `get_pnl` — raportul P&L COMPLET pe perioadă (venituri nete, COGS, profit brut, personal, OpEx, profit net + marje, food/labor/prime cost cu semafor). Cifrele = identice cu pagina `/reports/pnl`. Primul reflex la „arată-mi P&L-ul / care e profitul".
- `get_product_pnl` — P&L managerial pe produs/SKU: venit, COGS direct, alocări de manoperă/overhead, profit net, loss-makers, produse fără cost, concentrare profit și reconciliere cu P&L-ul total. Când explici de ce un produs este roșu/loss-maker sau de ce s-a schimbat marja, citește `data.config`, `methodology`, `warnings` și `reconciliation` înainte să presupui un bug.
- `get_customer_pnl` — P&L de distribuție pe client: marjă full-cost pe fiecare client/supermarket/magazin, nu doar venit. Bun pentru „ce client îmi face bani", „care client e pe pierdere", „marja pe Kaufland/Mega".
- `get_channel_pnl` — P&L de distribuție pe canal de clienți (`b2bChannel`): compară supermarketuri, magazine proprii, HoReCa etc. Dacă apare „Fără canal", trebuie completat canalul pe client înainte de concluzii ferme.
- `get_supplier_pnl` — P&L/risc pe furnizor: cât cumperi de la fiecare, concentrarea din achiziții, materiale fără alternativă și cât profit ar mânca o scumpire de 5%/10%.
- `list_delivery_pnl_segments` + `get_delivery_pnl` — profit pe livrări segmentate. Rulezi întâi lista segmentelor, apoi calculezi segmentul ales; citește și `data.platformPnl` pentru costuri automate de platformă, discounturi/promo funding, comenzi nelegate și warninguri. `brandId` singur este doar ad-hoc (venit−marfă + costuri de platformă legate), fără manoperă/reguli salvate.
- `get_weekday_pnl` — P&L pe zilele săptămânii (Luni–Duminică): profit net total și mediu/zi, cea mai bună/slabă zi, COGS, personal din ture, OpEx alocat și warninguri. Folosește-l pentru decizii de program/închidere, nu doar pentru vârfuri de vânzări.
- `compare_pnl_periods` — compară P&L pe mai multe perioade cu profit bridge („de ce s-a schimbat profitul"). `mod`: luna_vs_luna / an_vs_an / ytd / ultimele_3_luni / _6_luni / _12_luni, sau `periods` explicit.
- `get_pnl_config` — cum e configurat P&L-ul (categorii, grupări, KPI, template-uri, praguri); arată dacă e neconfigurat (risc „Nealocate").
- `list_pnl_kpis` — KPI-urile definite; cu `evaluate: true` dă valorile live + semafor pe perioadă.
- `list_pnl_snapshots` / `get_pnl_snapshot` — P&L-urile salvate (snapshot-uri) și ajustările lor.

**P&L prin conexiune (scriere, modul `financiar`):**
- `apply_pnl_industry_template` — aplică un profil de industrie (KPI + grupări gata). Primul pas pt. client nou. Idempotent.
- `set_pnl_thresholds` — pragurile semafor (food cost / personal / prime cost / opex / marjă).
- `create_pnl_category` / `configure_pnl_revenue_grouping` — categorii P&L custom și defalcări de venit.
- `configure_pnl_day_allocation` — setează cum se împarte o categorie/bucket pe zile (egal calendaristic, egal pe weekday, proporțional cu încasările, procent din venit, ponderi/sume pe zile, data reală, ture).
- `add_pnl_manual_day_expense` — adaugă cheltuieli recurente pe anumite zile pentru P&L-ul pe zile (formație live, DJ, pază suplimentară), fără să le amesteci cu facturile reale.
- `create_pnl_snapshot` / `add_pnl_snapshot_adjustment` — îngheață un P&L și adaugă cheltuieli/venituri suplimentare (închidere de lună).

**Citire (disponibile mereu, fără permisiune de modul):**
- `raport_vanzari` — vânzări pe perioadă cu comparație automată vs perioada anterioară; primul reflex la „cât am vândut".
- `top_produse` — best sellers după venituri sau cantitate (exclude anulate/returnate).
- `vanzari_in_timp` — tipare și ore/zile de vârf (grupare pe zi / oră / zi a săptămânii).
- `performanta_ospatari` — vânzări, bonuri, bon mediu și bacșiș per angajat.
- `jurnal_activitate` — cine a făcut ce și când (anulări, discounturi, modificări de preț).
- `generate_report` — raport rapid: `food_cost`, `sales_summary` sau `stock_value`.
- `analyze_food_costs` / `analyze_recipes` / `analyze_procurement` — food cost per produs, completitudinea rețetelor, prețuri și furnizori la achiziție.
- `get_accounting_overview` / `get_journal_entries_summary` — stare contabilă și înregistrări pe perioadă.
- `get_stock_levels` / `get_orders_summary` — stoc curent și sumar comenzi agregat.
- `list_vat_rates` — cotele de TVA configurate.
- `gaseste_in_aplicatie` — linkul exact către orice pagină/raport.

Toate tool-urile de vânzări acceptă `perioada` (azi / ieri / saptamana_aceasta / saptamana_trecuta / luna_aceasta / luna_trecuta / ultimele_7_zile / ultimele_30_zile / custom cu startDate+endDate) plus `brandId` / `locationId` opțional.

> **Regulă obligatorie de filtrare**: când utilizatorul menționează explicit un brand sau o locație (ex. „la Restaurantul Exemplu", „pe Terasa Mare", „pentru Cafeneaua Centrală"), **treci întotdeauna `brandId` și/sau `locationId`** la apelul tool-ului. Nu prezenta date agregate pentru toate unitățile când se cere una singură. Dacă nu cunoști ID-urile, rulează mai întâi `list_brands` + `list_locations`.

**SQL (doar dacă tokenul are acces SQL):** `list_database_tables` → `describe_database_table` → `execute_sql_query` — doar citire, pentru analize unice fără tool dedicat.

**Scriere (cer modulul de permisiune `produse_meniu`):**
- `update_menu_item` — schimbă prețul/numele/disponibilitatea unui articol de meniu.
- `bulk_update_menu_item_prices` / `apply_menu_prices` — actualizare prețuri în masă.
- `add_menu_item` — adaugă un produs în meniu cu preț de vânzare.
- `update_product` / `bulk_update_products` — TVA, preț de achiziție și alte câmpuri pe produs (NU prețul de vânzare — acela e pe articolul de meniu).

## Întrebări frecvente și capcane

- **„De ce diferă food cost-ul din rețetă de cel din P&L?"** — P&L folosește COGS **realizat** (consum FIFO real pe loturi); rețeta dă costul teoretic. Diferența e normală (risipă, porționare, prețuri de achiziție diferite pe loturi) și e ea însăși un KPI (variația food cost teoretic vs real).
- **„Au reprocesat consumul — de ce s-au schimbat cifrele din rapoarte?"** — corect așa: P&L, sfârșitul de zi și KPI-urile reflectă consumul recalculat.
- **„De ce nu văd pagina de analiză hotel / magazin online?"** — paginile apar doar dacă brandul are domeniul de activitate respectiv (Hotel / Magazin Online) activ; pot fi și ascunse per client din administrare.
- **„De ce nu se schimbă cifrele din P&L-ul salvat?"** — un snapshot e înghețat by design; modifici doar prin ajustări manuale pe snapshot. Pentru date la zi folosește `/reports/pnl`.
- **„Am schimbat prețul pe produs și nu se vede în POS"** — prețul de vânzare stă pe **articolul de meniu**, nu pe produs; folosește `update_menu_item`, nu `update_product`.
- **„Z-ul de pe casă nu bate cu POS-ul"** — `/finance/end-of-day` arată exact diferența Z vs POS per casă de marcat; cauze tipice: bonuri nefiscalizate, fereastra zilei de business diferită de ziua calendaristică.
- **„Ce înseamnă «Fără locație» în filtre?"** — înregistrări vechi fără locație alocată; filtrul dedicat le izolează ca să nu „dispară" bani din raportul pe locație.
- **Etichetează sumele clar** — „total facturat" / „încasat" / „de plătit" / „de încasat"; niciodată „total" gol pe o sumă ambiguă.
- **Nu inventa cifre** — dacă nu ai datele, spune ce tool sau ce pagină le-ar arăta și dă linkul.
- **TVA România** — doar 0 / 11 / 21%; dacă vezi alte cote pe produse, e o eroare de configurare (verifică cu `list_vat_rates`).

## Pentru acces SQL

Tabele relevante: `orders`, `order_items` (vânzări și linii), `payments` (plăți), `pnl_snapshots` (P&L-uri salvate), `pnl_kpis` (definiții KPI), `pnl_categories` (categorii de cheltuieli P&L), `vat_rates` (cote TVA). Exemple: „vânzări pe oră în ultimele 30 de zile" (orders, grupare pe oră), „ce pondere are fiecare cotă de TVA în vânzările lunii" (order_items), „ce KPI-uri sunt definite și cu ce praguri" (pnl_kpis).
