---
name: rapoarte-preturi
description: Răspunde la întrebări despre rapoarte, vânzări, KPI, food cost, marjă, prețuri, ȘI despre configurarea P&L (categorii, KPI, praguri, grupări venituri, template-uri industrie) + P&L salvat (snapshot peste care adaugi cheltuieli/venituri/angajați/evenimente suplimentare). Folosește la „cât am vândut", „top produse", „care e food cost-ul", „ce marjă am la X", „de ce scade profitul", „cât datorez furnizorului", „cum îmi configurez P&L-ul", „categorii P&L", „de ce apare la Nealocate", „salvează P&L", „închidere de lună", „adaugă o cheltuială/un venit/un angajat în P&L", ȘI comparații pe perioade — „cum merge luna trecută vs acum 2 luni", „an vs an", „compară lunile/perioadele", „evoluția profitului".
---

# Rapoarte, cifre și prețuri

Citește `knowledge/rapoarte-preturi.md` pentru ce înseamnă fiecare indicator + regulile de TVA.
Pentru **configurarea P&L-ului** (categorii, KPI, praguri, grupări de venituri, template-uri de industrie) și pentru **P&L-ul salvat cu ajustări manuale** (cheltuieli/venituri/angajați/evenimente suplimentare), citește `knowledge/setari-pnl.md`.

## Cum răspunzi la cifre

Folosește ÎNTÂI tool-urile dedicate de raport (funcționează FĂRĂ acces SQL, sunt rapide, sigure și compară automat cu perioada anterioară). Toate acceptă `perioada` (azi, ieri, saptamana_aceasta, luna_aceasta, ultimele_7_zile, ultimele_30_zile, custom + startDate/endDate) și opțional `brandId`/`locationId`:

- „cât am vândut / cum merg vânzările / cash vs card / cresc sau scad" → **`raport_vanzari`** (total, bon mediu, bacșiș, reduceri, pe metodă de plată + % vs perioada anterioară).
- „ce se vinde cel mai bine / top produse / best sellers" → **`top_produse`** (cantitate, venituri, pondere; `ordine: venituri|cantitate`).
- „când am cei mai mulți clienți / la ce oră e vârf / ce zi merge" → **`vanzari_in_timp`** (`grupare: zi|ora|zi_saptamana`).
- „cum merg ospătarii / cine vinde cel mai mult / cine a luat cel mai mult bacșiș" → **`performanta_ospatari`**.

### P&L în chat (arată și explică profitul)

Pentru P&L NU mai trimite doar la pagină — ai tool-uri dedicate care întorc EXACT cifrele din pagina `/reports/pnl`:

- „arată-mi P&L-ul / care e profitul lunii / cum stau cu marja, food cost, prime cost" → **`get_pnl`** (acceptă `perioada` + opțional `brandId`/`locationId`). Întoarce venituri nete, COGS, profit brut, personal, OpEx, profit net + marjă, și food/labor/prime cost cu **semafor verde/galben/roșu** pe pragurile clientului. Explică-i pe scurt ce e bun/rău și de ce.
- Pentru întrebări despre **marja/profitul pe produs**, citește și `data.productPnl.config`, `methodology`, `warnings` și `reconciliation`: pragurile și ponderile de alocare pot veni din `organization_settings.pnlSettings.productPnl`, deci un produs poate fi roșu din setarea clientului, nu dintr-un bug de calcul.
- „cum e configurat P&L-ul / ce categorii am / de ce apare la «Nealocate»" → **`get_pnl_config`** (categorii pe secțiuni, grupări de venituri, KPI, template-uri aplicate, praguri).
- „ce KPI am / arată-mi indicatorii live / care KPI e pe roșu" → **`list_pnl_kpis`** (cu `evaluate: true` calculează valorile live pe perioadă, cu semafor).

Pentru alte analize: `analyze_food_costs`, `analyze_recipes` (food cost, marjă), `get_accounting_overview`, `generate_report`.
- Analize ad-hoc fără tool dedicat (ex. „clienți distincți luna trecută", „produse nevândute niciodată"): `execute_sql_query` DOAR dacă tokenul are SQL (workflow: `list_database_tables` → `describe_database_table` → `execute_sql_query` cu coloane + WHERE + LIMIT). Dacă nu are SQL, rămâi pe tool-urile dedicate de mai sus — acoperă marea majoritate.
- Întotdeauna **etichetează clar** sumele: „total facturat", „de plătit", „încasat", „de încasat" — niciodată „total" gol pe o sumă cu sens dublu.

## Prețuri și marjă

- Prețul de vânzare e pe articolul de meniu (`add_menu_item` / `update_menu_item`). Costul vine din rețetă (ingrediente × preț achiziție).
- „Ce marjă am la X" = preț vânzare − cost rețetă. Pentru recomandări de preț folosește `analyze_food_costs` / `analyze_recipes`.
- Modificare preț în masă: `bulk_update_menu_item_prices` (confirmă numărul de articole întâi).

## Configurare P&L „exact cum vrea clientul" (prin conexiune)

Detalii complete în `knowledge/setari-pnl.md`. **Cum se construiește P&L-ul** (explică-i clientului): fiecare produs/cheltuială are un **tip de produs** → fiecare tip aparține unei **categorie P&L** → fiecare categorie stă într-o **secțiune** (Venituri / COGS / Personal / OpEx / Taxe). Deci raportul se modelează din *tipurile de produs* + *categoriile P&L*, nu cifră cu cifră.

Acum ai tool-uri MCP pentru configurare (nu mai e „doar în aplicație"):

1. **`get_pnl_config`** — întâi vezi ce e (categorii, grupări, KPI, template-uri, praguri). Dacă întoarce „neconfigurat" (0 categorii) = client nou.
2. **`apply_pnl_industry_template`** (`profile`: horeca / hotel / spa_parc / factory / retail / ecommerce / services) — PRIMUL pas pt. un client nou: un apel creează setul complet de KPI + grupări. Idempotent. (`applyThresholds: true` pune și pragurile recomandate; implicit nu le atinge.)
3. **`create_pnl_category`** (`name`, `section`) — categorii custom; `configure_pnl_revenue_grouping` (`sourceField`) — defalcări de venit (pe ospătar, interval orar, canal…).
4. **`set_pnl_thresholds`** — pragurile semafor (foodCostTargetPct, laborTargetPct, primeCostTargetPct, opexTargetPct, netMarginTargetPct, +Warn/+Crit).
5. **Legarea tipurilor de produs la categorii** (ce decide unde cad banii) rămâne pe `create_product_type` / `update_product_type` / `update_product_type_accounts_per_unit`, sau în aplicație (pagina „Conturi pe Tip Produs"). Dacă ceva apare la „Nealocate", aici se repară.

Rețeta pt. client nou: `get_pnl_config` → `apply_pnl_industry_template` → leagă tipurile de produs la categorii → `set_pnl_thresholds` → verifici cu `get_pnl`.

## P&L salvat (snapshot) + cheltuieli/venituri suplimentare

La închiderea de lună, prin conexiune:
- **`create_pnl_snapshot`** (`perioada`/dates + opțional `name`, `brandId`, `locationId`) — îngheață raportul; datele live rămân neatinse.
- **`add_pnl_snapshot_adjustment`** (`snapshotId`, `tip`: venit/cheltuiala, `label`, `amount`, pt. cheltuială `categoryKey`) — adaugi o cheltuială/venit care nu e în sistem (ex. contabil, reparație cash). Recalculează profitul snapshot-ului.
- **`list_pnl_snapshots`** / **`get_pnl_snapshot`** — vezi P&L-urile salvate și ajustările lor.
Snapshot-urile blocate cu parolă NU se modifică prin conexiune — pentru lock/parolă, în aplicație (`/analytics/saved-pnl`). Adăugarea de angajați manuali / evenimente în snapshot e tot în aplicație (tool-ul acoperă venit + cheltuială OpEx).

## Comparație pe perioade (cum merge X vs Y)

Când clientul întreabă „luna trecută vs acum 2 luni", „iunie anul ăsta vs anul trecut", „compară ultimele luni", „de ce am mai puțin profit ca luna trecută", „evoluția profitului" → folosește **`compare_pnl_periods`** (răspunde direct în chat, cu profit bridge):
- `mod`: `luna_vs_luna` (ultimele 2 luni complete), `an_vs_an` (aceeași lună, an vs an), `ytd`, `ultimele_3_luni` / `_6_luni` / `_12_luni`; SAU lista explicită `periods: [{startDate, endDate, label}]` (ex. acum 2 luni vs luna trecută). Plus `brandId`/`locationId` (scope fix).
- Explică-i **„de ce s-a schimbat profitul"** din `profitBridge`: cât a adus venitul și cât au mâncat COGS/personal/OpEx (pozitiv = a ajutat, negativ = a scăzut profitul).
- Capcane onest: luna **curentă incompletă** nu se compară corect cu una completă → preferă `an_vs_an` sau `ytd`; lunile au lungimi diferite → uită-te și la venitul/zi.

Pentru vederea vizuală bogată (heatmap, bridge grafic), pagina e `/reports/pnl-compare-periods` — deschide-o (vezi mai jos). **Dacă `compare_pnl_periods` nu există pe instanță** (server mai vechi), fallback: rulează `get_pnl` (sau `raport_vanzari`) pe fiecare perioadă și compară tu.

## Arată vizual clientului (nu doar text)

Clientul vrea să VADĂ, nu doar să citească cifre. După ce explici în chat:
- ia linkul exact cu `gaseste_in_aplicatie` (ex. „raport P&L", „comparație perioade", „setări P&L") și, dacă **extensia Chrome e conectată**, DESCHIDE pagina ca să vadă raportul real (filtre, drill-down, grafice). Dacă nu e conectată, dă-i linkul.
- pentru cifrele cheie, prezintă-le clar în chat (P&L: venituri → COGS → profit brut → personal → OpEx → profit net, cu semafor), nu un perete de numere.

## Reguli

- Nu inventa cifre. Cifrele din `get_pnl`/`compare_pnl_periods` sunt identice cu pagina; dacă un tool nu întoarce date, spune ce lipsește și dă linkul paginii.
- RON peste tot; TVA România 0/11/21.
- Pentru „de ce scade profitul" — folosește `compare_pnl_periods` (profit bridge) sau combină `get_pnl` + food cost + manoperă; dă o interpretare scurtă, onestă, cu cifre.
- Configurarea P&L și snapshot-urile se fac ACUM prin conexiune (tool-urile de mai sus). Ce rămâne în aplicație: legarea fină tip-produs↔categorie (sau prin `*_product_type`), lock cu parolă pe snapshot, angajați/evenimente manuale în snapshot. Fii sincer despre limite; la tool lipsă pe instanță veche, dă linkul paginii.
