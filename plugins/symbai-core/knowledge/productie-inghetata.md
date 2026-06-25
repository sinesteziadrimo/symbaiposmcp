# Producție înghețată — overrun (aer), densitate, net vs brut, randament

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă specificul **înghețatei și al produselor aerate** (peste ce e în `productie-fabrica.md`). Citește întâi `productie-fabrica.md` pentru fluxul general de loturi/operații; aici doar adaugi stratul de overrun + net/brut.

## Pe scurt — ce problemă rezolvă
La înghețată se întâmplă în același timp patru lucruri pe care softurile generice (și clientul venit de pe alt ERP) nu le pot separa:
1. **Overrun** — aerul bătut în mix la congelare: **volumul crește** (mixul aproape se dublează), dar **greutatea rămâne ~aceeași** (aerul nu cântărește).
2. **Pierdere de proces** — evaporare la pasteurizare/maturare + ce rămâne pe linie (freezer, conducte, dozator): scade greutatea.
3. **Glazură / incluziuni** — ciocolata, nucile adăugate după congelare: adaugă greutate.
4. **Net vs brut** — net = produsul; brut = produs + ambalaj (tub/baton/folie/bax).

De aceea **un tub de 1 L de înghețată cântărește NET ~0,55 kg, nu 1 kg**. Symbai modelează asta corect: costul rămâne pe ingredientele reale, bilanțul se închide pe **greutate**, iar overrun-ul apare ca expandare de **volum** — nu ca o „pierdere" inexplicabilă.

## Concepte (limbaj simplu)
- **Overrun (%)** — cât aer s-a înglobat. 100% = volumul se dublează (1 L mix → 2 L înghețată). Tipic: 25–40% la premium/gelato, 80–120% la economy.
- **Pierdere de proces (%)** — apă pierdută la pasteurizare/maturare + draw pe linie. Tipic 1–4%. (Sublimarea la depozitare = altă etapă, separat.)
- **Densitate (kg/L)** — puntea kg↔L. Mixul ~1,1 kg/L; înghețata congelată ~0,5–0,6 kg/L (e pe jumătate aer); apa 1,0.
- **Conținut nominal (net)** — ce scrie pe etichetă (ex. 0,5 L sau 500 g). Alimentează verificarea **semnului ℮** (Directiva 76/211): media reală ≥ nominal, și niciun pachet sub `nominal − 2×eroarea tolerată`.
- **Tară** — greutatea ambalajului gol. Net + tară = brut.

## Cum setezi overrun, pierdere, densitate (o singură dată per rețetă/produs)
Asistentul le scrie direct prin conexiune; nu trebuie clickuri prin taburi.
- **Pe rețetă** (mixul de bază → înghețata finită): `set_recipe_overrun` cu `recipeId`, `overrunPercent` (% aer) și `processLossPercent` (% pierdere de proces).
- **Pe produsul finit**: `set_product_density` cu `productId`, `densityKgPerL` (densitatea congelată, ex. 0,55), `tareWeightKg` (ambalajul gol), `netContentValue` + `netContentUnit` (conținutul nominal de pe etichetă, ex. 0.5 + `l`).
- Densitatea o poți pune și pe **mix** (semipreparatul lichid) — așa sistemul convertește corect kg↔L în cost și necesar de materiale.

## Cât iese dintr-un mix — randamentul (înainte sau în loc de producție)
`get_icecream_yield` — dai `inputMixKg` (kg de mix) și (dacă nu sunt deja pe rețetă/produs) `overrunPct`, `processLossPct`, `mixDensityKgPerL`, `packVolumeL` (volumul ambalajului), `packTareKg`. Întoarce:
- volumul de înghețată (cu overrun), greutatea netă totală, **numărul de bucăți**, greutatea **netă/bucată** și **brută/bucată** (cu tară), densitatea congelată,
- **conformitate ℮**: conținutul nominal + greutatea/volumul minim legal per pachet (`nominal − 2×TNE`).

Exemplu: 1000 kg mix la 100% overrun și 2% pierdere → ~1782 tuburi de 1 L, fiecare **0,55 kg net**, brut 0,61 kg (tară 60 g).

## Bilanț de masă + overrun real (după ce lotul e gata)
`get_batch_mass_balance` (`batchId`) e acum „overrun-aware". Pe lângă consum vs ieșire, arată:
- **`overrun`**: ținta din rețetă vs overrun-ul **real** măsurat pe lot vs cel **calculat din volume** (volum ieșire faţă de volum mix) + varianța. (Overrun-ul real per lot îl măsori cu „testul paharului" — cântărești același pahar plin cu mix vs plin cu înghețată — și îl treci pe lot.)
- **`expectedVsActual`**: randamentul așteptat din rețetă vs cel real (varianță %).
- **`weightBalance`**: intrările normalizate la **kg** (prin densitate) vs ieșirea netă — balanța se închide pe greutate chiar dacă volumul s-a dublat; overrun-ul e raportat separat ca expandare de volum, nu ca pierdere.

Dacă vezi avertisment că „mai multe ingrediente în volum au densitate", verifică pe care l-a presupus drept mix.

## KPI de producție (pentru dashboard / lângă P&L)
`get_production_yield_kpis` (`days` sau `startDate`/`endDate`, opțional `brandId`/`recipeId`) → pe perioadă:
- **randament** (planificat vs real), **overrun** (ținta rețetelor vs cel real măsurat + varianță), defalcat și pe rețetă,
- **conformitate conținut net** (℮ 76/211) pe produse.

⚠ **Overrun-ul NU intră în P&L-ul financiar** ca linie separată — efectul lui e deja în **costul pe bucată** (rețeta consumă doar mixul necesar unei bucăți, deci mai multe bucăți din același mix = cost/buc mai mic). În P&L îl reaplici = dublă numărare. De aceea randamentul/overrun-ul sunt **KPI de eficiență**, nu venituri/COGS. Pentru un indicator pe dashboard poți construi un KPI propriu din câmpurile „Randament real (ieșire)" și „Overrun real (%)" ale loturilor (Setări → KPI / P&L).

## Cost & necesar de materiale (MRP) cu densitate
- Când o rețetă are ingrediente în L iar produsul e gestionat în kg (sau invers), sistemul convertește acum corect prin **densitate** (1 L mix × 1,1 = 1,1 kg) — costul și necesarul nu mai ies greșite la schimbarea de unitate.
- Overrun-ul e deja **inclus în cantitatea din rețetă** (ex. 0,5 L mix pentru 1 tub de 1 L la 100% overrun), deci MRP-ul cere automat mixul corect — nu se reaplică nicăieri.

## Lanț de frig, etichetă, recall (la fel ca la fabrică)
- Temperatură/CCP la tunelul de călire și depozit: `record_operation_qc_inspection` + `get_cold_chain_release_readiness` înainte de livrare.
- Etichetă cu lot, valabilitate, conținut net, alergeni: `print_production_labels` / `print_designed_label`.
- Trasabilitate/recall: `exec_trace_lot_origin` / `exec_trace_lot_destination` / `trace_recall_to_customers` — overrun-ul și densitatea sunt metadate ale lotului, nu schimbă trasabilitatea.

## Capcane utile
- Densitatea de pe **produsul finit** e cea **congelată** (~0,55), nu a mixului (~1,1). Pe mix pui densitatea mixului.
- Conținutul nominal în **grame** declară greutate; în **litri/ml** declară volum — ambele intră în verificarea ℮.
- Dacă overrun-ul real iese constant sub țintă, e semnal de reglaj la freezer / injecția de aer (vezi varianța din `get_batch_mass_balance` și `get_production_yield_kpis`).
