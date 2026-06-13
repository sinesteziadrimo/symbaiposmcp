# Producție — Mod Fabrică (fabrică alimentară industrială)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă **modul fabrică** (producție industrială complexă: fluxuri tehnologice pe stații, shop-floor, MPS/MRP, B2B, QC/HACCP, KPI fabrică). Pentru producția simplă de restaurant / bucătărie centrală (loturi de semipreparate, fără fluxuri pe stații) vezi `productie-restaurant.md`.

## Pe scurt — ce e o fabrică în Symbai
Modul fabrică transformă Symbai într-un mini-MES/ERP de producție: planifici ce produci (MPS/MRP din comenzi B2B + cereri interne), execuți pe stații de lucru cu tabletă (shop-floor), urmărești fiecare lot de la materie primă la produs finit (genealogie + recall), controlezi calitatea (carantină, inspecții, HACCP), urmărești echipamente/zone/ture și livrezi clienților business (B2B picking + expediere). Totul cu trasabilitate de container cu cod QR și KPI live (Yield, OEE, FPY, On-Time, Waste).

## Cum activezi modul fabrică și ce deblochează
- **Unde**: Setări → General (Date Companie) → secțiunea „Domenii de Activitate". Bifezi **„Fabrică alimentară"** sau **„Fabrică nealimentară"** → modul devine automat „fabrică". (Bifând „Sală evenimente" obții modul „restaurant & evenimente", un nivel intermediar.)
- **Ce deblochează modul fabrică** (pagini vizibile DOAR în acest mod):
  - **Panou Fabrică** (`/factory-dashboard`) — control tower live.
  - **Execuție Producție** (`/production`) — pornire/declarare/finalizare operații.
  - **Tabletă Stație** (`/workstation-tablet`) — ecran operator full-screen.
  - **Planificare MPS/MRP** (`/planificare-mps`) — planul master + necesar net.
  - **Comenzi B2B** (`/b2b-orders`) — clienți business, picking, livrare.
  - **AI Flow Builder** (`/ai-flow-builder`) și **Agent Producție AI** (`/factory-ai`).
- **De la modul „restaurant & evenimente" în sus** (deci și în fabrică): Fluxuri Tehnologice (`/fluxuri-tehnologice`), Echipamente & Zone (`/production/equipment-zones`), Loturi & WIP (`/loturi-wip`), HACCP & Siguranță (`/haccp`), Centru Printare (`/print`).
- **Capcană**: în modul fabrică pagina simplă „Producție" (`/productie-evenimente`) **dispare** intenționat — echivalentul ei e `/production` (execuție) + `/planificare-mps` (planificare). Dacă userul „nu mai găsește Producție", e pentru că a trecut pe fabrică.
- Modificarea poate fi **blocată de Hub** (administratorul Symbai): dacă domeniile sunt blocate (lock) ele apar read-only; dacă sunt ascunse, secțiunea dispare complet. În acest caz nu poți schimba modul din POS — userul trebuie să ceară echipei Symbai.

## Cele două motoare de producție (FOARTE IMPORTANT)
Symbai are **două căi independente** de a consuma materii prime și a produce loturi. NU sunt reconciliate între ele — alegi una per produs/proces.

### Motor 1 — Finalizare lot (batch completion, „simplu")
- Creezi un lot, îl pornești, îl finalizezi **din aplicație** (pagina Producție → „Finalizează"). La finalizarea din aplicație sistemul **consumă automat** ingredientele după rețetă (FEFO + loturi alocate explicit), creează lotul de produs finit și mișcă stocul.
- ⚠ Tool-ul MCP `exec_complete_batch` doar **marchează** lotul finalizat (status + `actualQty`) — **NU declanșează singur consumul/output-ul prin conexiune**. Auto-consumul rulează la finalizarea DIN APLICAȚIE. Pentru consum 100% prin MCP → folosește Motor 2 (shop-floor: `exec_declare_consumption` / `exec_declare_output` / `exec_complete_operation`, care POSTEAZĂ documentele de inventar).
- Folosit pentru producție directă, fără pași pe stații separate.
- Tool-uri (creare/ciclu): `exec_create_batch` → `exec_start_batch` → (finalizare din aplicație pentru consum) / `exec_complete_batch` (marchează statusul).
- ⚠ În modul fabrică, finalizarea simplă e **blocată** dacă lotul are un flux tehnologic atașat (flowVersionId) — atunci trebuie să mergi pe motorul shop-floor.

### Motor 2 — Comenzi de lucru pe stații (shop-floor, „flux tehnologic")
- Lotul trece prin **operații** definite în fluxul tehnologic (ex: Cântărire → Frământare → Coacere → Ambalare). Operatorul, de pe tabletă, pornește operația, declară consumul (alege/scanează lotul de materie primă), declară producția (bun/rebut/de retușat) și finalizează operația. La finalizare se creează automat containere cu QR și **genealogie completă**.
- Folosit pentru procese industriale cu mai multe stații, predări între operatori, QC pe operație.
- Tool-uri: `exec_start_operation` → `exec_declare_consumption` → `exec_declare_output` → `exec_complete_operation` (cu predare automată dacă e configurat).

**Diferența cheie de trasabilitate**: motorul shop-floor scrie automat **genealogia** (legături lot intrare→lot ieșire) și creează containere cu QR. Motorul simplu (finalizare DIN APLICAȚIE) mișcă corect stocul, dar nu construiește graful de genealogie la fel de bogat (iar `exec_complete_batch` prin MCP nu mișcă singur stocul). Pentru recall industrial complet și consum prin conexiune, folosește fluxul shop-floor.

## Lot de producție — ciclu de viață
Stările unui lot: **planificat (planned) → pornit (started) → în lucru (in_progress) → pauză (paused) → finalizat (completed)** sau **anulat (cancelled)**.

**Bucla de lucru standard pentru un lot:**
1. **Citește** ce ai: `exec_list_batches` (filtre: `status`, `dateFrom`, `dateTo`, `recipeId`, `zoneId`, `limit`).
2. **Creează**: `exec_create_batch` — obligatoriu `recipeId` + `plannedQty`; opțional `scheduledDate`, `assignedTo` (angajat), `zoneId`, `equipmentId`, `storageType` (refrigerat/congelat/cald/ambient), `notes`, `batchNumber`, `flowVersionId` (atașează flux tehnologic), `destinationWarehouseId` (gestiunea unde intră produsul finit).
3. **Pornește**: `exec_start_batch` (`batchId`).
4. **(opțional) Pauză/reluare**: `exec_stop_batch` (`batchId`, `reason`) / `exec_resume_batch` (`batchId`).
5. **Reprogramare**: `exec_reschedule_batch` (`batchId`, `newDate` YYYY-MM-DD, `reason`).
6. **Actualizare câmpuri**: `exec_update_batch` (`batchId` + orice din: `status`, `plannedQty`, `actualQty`, `notes`, `assignedTo`, `zoneId`, `equipmentId`, `scheduledDate`, `qcStatus` pending/passed/failed/blocked).
7. **Finalizare** (motor simplu): din aplicație („Finalizează") ca să se declanșeze consumul + output-ul; `exec_complete_batch` (`batchId`, `actualQty`) prin MCP doar marchează statusul (vezi Motor 1).
8. **Verifică**: `exec_get_batch_progress` (`batchId`) → toate operațiile, cantitățile, % completare, angajatul activ, pasul următor.

⚠ **Anularea/oprirea NU reface stocul** deja consumat. Pentru o șarjă cu probleme se folosește rework (șarjă „fiică" nouă cu propriul consum); lotul original rămâne în istoric.

## Execuție shop-floor — operații pas cu pas
Aceasta e calea industrială, pe tabletă (`/workstation-tablet`) sau din `/production`.

1. **Pornește operația**: `exec_start_operation` (`batchId`, `flowOperationId`; opțional `employeeId`, `containerId`, `warehouseId`, `idempotencyKey`). Status operație → în lucru.
2. **Declară consumul** de materii prime: `exec_declare_consumption` (`operationExecutionId`, `items` = listă de `{productId, qty, lotId?, unit?, unitCost?, overrideReason?}`; opțional `employeeId`, `idempotencyKey`).
   - Dacă pui `lotId`, consumi exact din lotul ales/scanat. Sistemul validează lotul contra **FEFO**; dacă încalci FEFO, consumul e blocat — dezblocarea cere o permisiune specială (administrator producție / eliberare calitate) + un motiv (`overrideReason`).
3. **Declară producția**: `exec_declare_output` (`operationExecutionId`, `qtyGood` = cantitate bună; opțional `qtyScrap` = rebut, `qtyRework` = de retușat, `employeeId`, `idempotencyKey`).
4. **Finalizează operația**: `exec_complete_operation` (`operationExecutionId`; opțional `partial`, `employeeId`, `notes`, `idempotencyKey`).
   - La finalizare se întâmplă AUTOMAT: dacă nu s-a declarat consum manual și operația are auto-consum activat → **backflush** (calculează consumul din rețetă/cerințe scalat după cantitatea bună); se postează documentul de consum + documentul de producție; se creează **containerele cu QR**; se scrie **genealogia** (legături lot intrare→lot ieșire); dacă toate operațiile lotului sunt gata → lotul se finalizează automat.
5. **Predare între stații** (handover): `exec_handover_operation` (`fromOperationExecutionId`, `toFlowOperationId`; opțional `containerId`, `employeeId`, `notes`) — creează execuția pentru operația următoare. Sau `exec_create_handover` pentru predare/preluare/transfer cu detalii.
6. **Corecții**: `exec_correct_quantities` (`operationExecutionId`, `correctionType` = qty_adjustment / reversal, `reason` obligatoriu; opțional `qtyGoodDelta`, `qtyScrapDelta`, `qtyReworkDelta`, `employeeId`). Reversarea creează document de inventar de stornare.
7. **Oprire operație**: `exec_stop_operation` (`operationExecutionId`, `reason`) — readuce la pending.

**Citire / monitorizare operații:**
- `exec_list_active_operations` (`batchId`) — operații în lucru, timp scurs, operator.
- `exec_get_operation_detail` (`operationExecutionId`) — cerințe de material, ieșiri așteptate, stare.
- `exec_list_operation_executions` (`batchId`, `status` pending/in_progress/completed/partial/reversed).
- `exec_list_handovers` (`batchId`, `flowOperationId`, `status`, `employeeId`, `containerId`, `limit`) — predările.
- `exec_get_batch_stages` (`batchId`) — istoricul pe etape cu operator, timeline, evenimente.
- `exec_list_shop_floor_events` (`batchId`, `operationExecutionId`, `limit`) — toate evenimentele (scanări, porniri/opriri, consum/output, predări).

**Idempotență**: `idempotencyKey` pe declare-consumption/output/complete previne dubla-postare la retry (tabletă cu rețea instabilă). Folosește un UUID per acțiune.

## Consum: lot explicit / scanat vs FEFO
- **FEFO** = „expiră primul, iese primul". La consum fără lot ales, stocul scade din loturile cu data de expirare cea mai apropiată.
- **FIFO** (intrare-primul) e o metodă alternativă configurabilă per cerință de material a operației.
- **Ordinea reală a consumului**: (1) loturile **alocate/scanate explicit** (cu `lotId` în `exec_declare_consumption`, sau scanate cu camera) → (2) restul după **FEFO** pe cantitatea rămasă.
- **Abaterea de la FEFO** (a alege un lot care încalcă ordinea) cere permisiunea de administrator producție sau eliberare calitate + un motiv declarat (min. 5 caractere). Altfel consumul e respins.
- **Conversie de unități**: dacă rețeta e în grame iar produsul în kilograme (sau ml/l), conversia se aplică **automat** în toate calculele de consum, cost și stoc. ⚠ Dar dacă pui o unitate din altă familie (ex. bucăți unde trebuie kg), food cost-ul și stocul ies absurde **fără avertisment** — verifică unitățile rețetei.

## Trasabilitate (genealogie) și recall
- **Genealogie** = legăturile lot intrare → lot ieșire, scrise după ce ambele documente (consum + producție) sunt postate. Cantitatea consumată se împarte proporțional pe loturile de ieșire.
- **Identificator fizic unic** = codul QR al containerului, NU numărul de lot (numerele de lot se pot repeta).
- **Trasabilitate înapoi** (din ce provine un lot): `exec_trace_lot_origin` (`lotId`) → loturile de intrare, ingredientele, furnizorii.
- **Trasabilitate înainte** (unde a ajuns): `exec_trace_lot_destination` (`lotId`) → loturile de producție care l-au consumat.
- **Status calitate al unui lot**: `exec_get_lot_qc_status` (`lotId`) → blocat/eliberat + evenimentele de inspecție.
- **Recall (retragere)**: din `/loturi-wip` → tab Genealogie cauți lotul după ID/număr și vezi raportul de impact (loturile derivate și produsele afectate). Mecanismul folosește graful de genealogie (traversare în adâncime).
- ⚠ Doar fluxul **shop-floor** scrie genealogia automat. Un lot finalizat pe motorul simplu poate să nu aibă graf de genealogie — recall industrial complet presupune execuție shop-floor.

## Containere și coduri QR
- **Container de producție** = recipient fizic (cuvă, tavă, navetă) cu cod QR unic. Prefixe după tip de ieșire: `CTR-` (produs principal), `COP-` (co-produs), `BYP-` (sub-produs), `WST-` (deșeu/rebut). QR-ul folosește un alfabet fără caractere confundabile (fără I/O/0/1).
- Containerele se creează **automat** la finalizarea operației cu cantitate bună > 0; operatorul NU le creează manual.
- **Scanner Containere** (`/production/scanner`): scanezi QR cu camera/cititorul → poți porni/finaliza operația pe container, avansa etapa, semnala problemă QC, împărți/uni containere, printa eticheta, reasigna zona/echipamentul. Containerele cu lot blocat la QC nu pot fi avansate/împărțite/unite.
- **Detaliu Container** (`/c/:codQR`): pagină **publică**, se deschide direct la scanarea etichetei (fără cont) — informații container, locație actuală, istoric evenimente, trasabilitate. ⚠ Public = vizibil pentru oricine scanează (client, inspector, dar și un competitor) — atenție la procese proprietare.
- **Tool-uri scanare** (citire): `exec_scan_container` (`qrCode`) → container + lot + batch + operație curentă; `exec_get_container_info` (`qrCode`) → detalii complete + loturi din container + istoric scanări + status QC; `exec_list_container_lots` (`containerId`) → loturile de inventar din container; `exec_validate_scan` (`qrCode`, `context` = start_op/complete_op/handover/pickup/info_lookup/consumption/general; opțional `batchId`, `flowOperationId`, `operationExecutionId`, `employeeId`).
- **Etichete**: `print_production_labels` (`batchId`, `printerId`) trimite comanda la imprimantă.
- ⚠ Acțiunile fizice pe containere (split/merge, avansare etapă) se fac din aplicație (Scanner Containere), nu prin tool MCP.

## MPS / MRP — planificarea producției
- **MPS** (Master Production Schedule) = ce produci, când, pe ce stație, în ce tură.
- **MRP** = necesarul net de materiale: cerere − stoc existent − deja programat = ce TREBUIE produs/comandat.
- **Bucla planificare:**
  1. **Citește cererea**: `get_orders_summary` (`dateFrom`, `dateTo`, `status` all/open/completed/cancelled, `groupBy` product/order) — ce produse sunt cerute, în ce cantități.
  2. **Citește stocul**: `get_stock_levels` (`productType` raw_material/wip/finished_good/all, `warehouseId`, `onlyLowStock`, `productName`) — stoc curent + prag minim + deficit.
  3. **Calculează necesarul net**: `get_mps_net_requirements` (`horizonDays`) — cerere − stoc − programat, pe orizont.
  4. **Vezi programul**: `list_mps_schedule` (`from`, `to` YYYY-MM-DD) — rețete planificate pe date/ture/stații.
  5. **Adaugă în plan**: `create_mps_entry` (`scheduledDate` + `plannedQty` obligatorii; opțional `stationId`, `recipeId`, `shiftNumber`, `status` draft/confirmed/in_progress/completed/cancelled).
  6. **Actualizează plan**: `update_mps_entry` (`entryId` + câmpuri).
  7. **Loturi planificate**: `list_planned_lots` — loturi pre-producție din comenzi B2B sau cereri interne care necesită producție.
- **BOM explosion** (explozie de rețetă): `run_bom_explosion` (`recipeId`, `quantity`) — calculează totalul de materii prime necesare pentru o cantitate dată, cu conversie de unități. ⚠ E doar previzualizare — NU mișcă stoc.
- **Stoc producție / semipreparate**: `get_production_stock_overview` (`productTypes`) — WIP + produse finite cu cantități/loturi/expirare/rezervări/cerere; `get_semipreparate_stock` () — stoc semifabricate (WIP).
- Pagina: `/planificare-mps` (taburi Calendar Operații, Planificare MRP, Coproduse & Subproduse, Monitorizare, Trasabilitate, Bottleneck, Productivitate, Loturi Planificate, Flux Fabrică, Configurare).

## Fluxuri tehnologice + versiuni
Fluxul = lanțul de operații prin care trece un produs, cu cerințe, dependențe, predări, QC per operație. Are **versiuni** (draft → active → archived).

- **Citește**: `list_flow_versions` (`productId`, `status` draft/active/archived/all, `limit`); `get_flow_version_detail` (`flowVersionId`) — flux complet (operații, dependențe, materiale, ieșiri, QC).
- **Creează flux**: `create_flow_version` (opțional `productId`, `productName`, `name`, `versionNumber`, `status`, `notes`, `sourceRecipeId`, `aiInstructions`). Sau dintr-un singur apel complet: `build_complete_flow` (`operations` = listă) — creează flux + operații + materiale + ieșiri + QC + dependențe.
- **Gestionează versiuni**: `update_flow_version`, `activate_flow_version`, `archive_flow_version`, `clone_flow_version` (`flowVersionId`, `newName`, `newVersionNumber`).
- **Operații** (tab General): `add_flow_operation` (`flowVersionId`, `name`, `operationOrder` + multe câmpuri: durate min/standard/max, setup, cleanup, container recomandat, condiție depozitare, `producesLot`, `skipIfStockAvailable`, `overlapAllowed`, `expectedYieldPercent`, instrucțiuni, `zoneId`, `equipmentId`, staff min/max/recomandat); `update_flow_operation` (`operationId`); `reorder_flow_operations` (`flowVersionId`, `ordering`); `auto_chain_operations` (`flowVersionId`) — leagă automat operațiile secvențial (Finish-Start).
- **Dependențe**: `add_operation_dependency` (`flowVersionId`, `fromOperationId`, `toOperationId`, tip FS/SS/FF/SF); `remove_operation_dependency` (`dependencyId`).
- **Materiale per operație**: `add_operation_material` (`operationId`, `quantity` + `productId`/`productName`, `unit`, sursă from_stock/from_previous_op/batch_ingredient); `remove_operation_material` (`materialId`).
- **Ieșiri per operație**: `add_operation_output` (`operationId`, `outputQty` + `productId`, `outputUnit`, tip main_product/co_product/by_product/waste, condiție depozitare); `remove_operation_output` (`outputId`).
- **QC per operație**: `add_operation_qc` (`operationId`, `controlType` numeric/boolean/text/vizual, `controlName`, valoare țintă, toleranțe, punct de control, procedură eșec); `add_qc_failure_procedure` (`qualityRequirementId`, `name`, `dispositionType` rework/retur/scrap/carantină); `remove_operation_qc` (`qcId`).
- **Configurare comportament operație** (cele 5 taburi): `configure_operation_start` (verificare materiale, scan container, roluri permise, checklist pre-start), `configure_operation_execution` (mod consum, QC obligatoriu, declarare ieșiri, temperatură, foto, pași), `configure_operation_completion` (metodă completare, scan/etichetă/cântar, auto-consum, cantitate min/max, randament, checklist), `configure_operation_handover` (acțiune post-completare, destinație, scan, semnătură supervizor, notificări).
- **Cu AI**: `/ai-flow-builder` — descrii procesul în chat și AI-ul construiește fluxul. (Cere modul fabrică.)
- Pagina manuală: `/fluxuri-tehnologice`.

## Controlul calității (QC, carantină, HACCP)
Două sisteme paralele: **Quality Holds** (blochezi un LOT) și **QC Inspections** (rezultatul unui test pe un BATCH). Un fix pe unul NU se propagă la celălalt.

- **Blocaj / carantină pe lot**: `create_quality_hold` (`lotId`, `eventType` ex. qc_fail/contamination/expiry_risk; opțional `reasonCode`, `notes`, `heldBy`). Lotul devine „hold" — nu mai poate avansa în producție.
- **Eliberare**: `release_quality_hold` (`holdId`, `releasedBy`; opțional `notes`). Dacă nu mai sunt alte blocaje active pe lot, lotul redevine disponibil.
- **Listă blocaje active**: `list_quality_holds` (`includeReleased` — implicit doar cele active).
- **Inspecții QC**: `list_qc_inspections` (`batchId`, `result` pass/fail/conditional, `days`, `limit`).
- **Statistici QC**: `get_qc_stats` (`days`) — rata pass/fail, top defecte cu frecvență și procent.
- **Pareto defecte (80/20)**: `get_defect_pareto` (`days`) — tipuri de defecte sortate descrescător, cu rang, cantitate respinsă, % din total, % cumulat. Top 2-3 tipuri cauzează de regulă ~80% din rebuturi.
- **Raport pierderi (waste)**: `get_waste_report` (`days`, `batchId`) — evenimente de pierdere (waste/spillage/expired/damage/scrap), cantități pe tip, % waste pe lot.
- **HACCP — senzori de temperatură**: `create_haccp_sensor` (`name` obligatoriu; opțional `sensorType` fridge/freezer/cold_room/hot_hold/ambient, `minTemp`, `maxTemp`, `locationId`, `mqttTopic`). Limite implicite per tip (frigider 0–4°C, congelator −22…−16°C, hot-hold 63–90°C etc.). (Acest tool e pe modulul `setari`.)
- Pagina HACCP: `/haccp` (taburi Temperaturi, Curățenie & Igienă, Incidente & Retrageri, Senzori IoT, Răcire Rapidă, Mostre Retenție, Audituri IFS/BRC).

## Echipamente, zone, ture și capacitate per rețetă
- **Zone de producție** (ex. Bucătărie Caldă, Patiserie, Preparare Rece):
  - Citește: `list_production_zones` (`includeInactive`); `get_zone_detail` (`zoneId`) — echipamente + rețete + maparea ingredient→gestiune.
  - Creează/actualizează: `create_production_zone` (`name`; opțional `description`, `locationId`, `brandId`); `update_production_zone` (`zoneId`; opțional `name`, `description`, `active`).
  - În masă: `bulk_create_zones_and_equipment` (`zones` = listă cu echipamentele lor) — util la setup-ul inițial al fabricii.
- **Echipamente** (mașini, cântare, vehicule, senzori IoT):
  - Citește: `list_production_equipment` (`zoneId`, `includeInactive`); `get_equipment_detail` (`equipmentId`) — capacități per rețetă, zonă, status, calibrare.
  - Creează/actualizează: `create_production_equipment` (`name`, `zoneId` + opțional `type`, `category` machine/scale/vehicle/cleaning/temperature/timer/gauge/tool, `status` available/in_use/maintenance, `capacityUnit`, model/serie/producător, `calibrationDate`, `calibrationIntervalDays` pentru HACCP, `ipAddress`/`connectionProtocol` pentru IoT, `allowMultipleOps`); `update_production_equipment` (`equipmentId` + câmpuri).
- **Capacitate echipament per rețetă**: `set_equipment_recipe_capacity` (`equipmentId`, `recipeId`; opțional `maxQtyPerBatch`, `cycleTimeMinutes`, `setupTimeMinutes`); citește cu `list_equipment_capacities` (`equipmentId`, `recipeId`).
- **Rețetă ↔ zonă** (o rețetă poate fi în mai multe zone): `assign_recipe_to_zone` (`recipeId`, `zoneId`) / `unassign_recipe_from_zone`.
- **Ingredient → gestiune per zonă** (de unde se consumă): `map_zone_ingredient_warehouse` (`zoneId`, `productId`, `warehouseId`); citește cu `list_zone_warehouse_mappings` (`zoneId`).
- **Ture de producție**:
  - Citește: `list_production_shifts` (`includeInactive`); `get_shift_detail` (`shiftId`, `date`) — operații, angajați, KPI (cantități, rebut, % completare).
  - Creează/actualizează: `create_production_shift` (`name`, `shortName`, `startTime`, `endTime` HH:MM; opțional `color`, `efficiencyPercent`, `sortOrder`); `update_production_shift` (`shiftId` + câmpuri); ture temporare: `create_provisional_shift` / `update_provisional_shift`.
  - Asignări: `create_shift_assignment` (`shiftId`, `employeeId`, `date`); `bulk_create_shift_assignments` (`shiftId`, `employeeIds`, `dates`).
  - ⚠ **Eficiență %**: 70 = produce 70% din capacitate; dacă o tură are eficiență 70%, planifică ~143% din cantitate ca să atingi cererea.
- **Utilizare echipamente**: `get_equipment_utilization` (`zoneId`) — loturi în lucru per echipament, status, capacitate.
- Pagina: `/production/equipment-zones`.

## B2B — comenzi, picking, livrare
Comenzile B2B (clienți business: depozite, magazine, alte restaurante) alimentează planificarea (loturi planificate din MPS).
- **Flux status comandă**: draft → confirmed → in_production → picking → packed → dispatched → delivered.
- **Pagina**: `/b2b-orders` (taburi Comenzi, Clienți & Depouri, Catalog Produse, Picking & Expediere, Livrări, Analiză & Rapoarte).
- **Picking**: pe o dată, vezi lista consolidată de produse (sumate pe toate comenzile) cu gestiunea sursă + total BAX/BUC + comenzile care le cer; bifezi articolele pe măsură ce le culegi; printezi manifestul per comandă.
- ⚠ Operarea B2B (creare clienți/depouri/comenzi, avansare status, marcare picking) se face din pagina `/b2b-orders`; planificarea o legi prin loturi planificate (`list_planned_lots`).

## Panou Fabrică — KPI și analitice
Pagina `/factory-dashboard` (taburi Vedere generală, Live, Alerte, Lipsuri, Blocaje, QC, KPI, Pipeline, Trasabilitate, Livrări, Schimburi). Tool unic care agregă tot: `get_factory_dashboard` () — pipeline loturi, status echipamente, livrări azi/mâine, probleme QC, lipsuri ingrediente, blocaje, KPI live, containere, genealogie.

**KPI live (definiții):**
- **Yield (randament)** = (cantitate reală obținută / cantitate planificată) × 100, pe loturile finalizate.
- **OEE** = (Disponibilitate × Performanță × Calitate) / 10000. Disponibilitate = echipamente folosite / total; Performanță = minute productive / minute disponibile; Calitate = 100 − rata de waste. Orice componentă 0 → OEE 0.
- **FPY (First Pass Yield)** = qtyGood / (qtyGood + qtyScrap + qtyRework) × 100. Atenție: FPY ignoră waste-ul; Yield îl include — sunt perspective diferite.
- **On-Time Delivery**, **Waste rate**, plus rebut și retușări în kg.

**Analitice dedicate** (toate citire):
- `get_daily_production_summary` (`date` YYYY-MM-DD) — sumarul unei zile (loturi, cantități, QC, waste, angajați activi).
- `get_yield_trends` (`daysBack`) — trend zilnic yield / waste / rata QC pass.
- `detect_production_bottlenecks` (`daysAhead` 7–90) — stații supraîncărcate: utilizare vs capacitate (overloaded >100%, high 85–100%, medium 60–85%, low <60%).
- `get_defect_pareto`, `get_qc_stats`, `get_waste_report`, `get_equipment_utilization` (vezi mai sus).

## Permisiuni MCP
- **Citire** (NU cere permisiune de modul): toate `exec_list_*`/`exec_get_*`/`exec_trace_*`/`exec_scan_*`, `list_*`, `get_*`, `run_bom_explosion`.
- **Scriere** (cer modulul `productie` pe token): `exec_create_batch`/`update`/`start`/`stop`/`resume`/`complete`/`reschedule`, `exec_declare_consumption`/`declare_output`/`correct_quantities`, `exec_start_operation`/`stop_operation`/`complete_operation`/`handover_operation`/`create_handover`, `create_mps_entry`/`update_mps_entry`, `create_production_shift`/`update`/`provisional`, `create_shift_assignment`/`bulk_create_shift_assignments`, `create_quality_hold`/`release_quality_hold`, `create_production_zone`/`update`, `create_production_equipment`/`update`, `set_equipment_recipe_capacity`, `assign_recipe_to_zone`/`unassign`, `map_zone_ingredient_warehouse`, `bulk_create_zones_and_equipment`, `print_production_labels`, toate tool-urile de flux (`create_flow_version`, `build_complete_flow`, `add_flow_operation`, `configure_operation_*`, `add_operation_*` etc.).
- **Alte module**: rețete (modul `retete`): `create_recipe`, `update_recipe`, `add_recipe_ingredients`, `bulk_replace_recipe_ingredients`, `add_recipe_outputs`, `set_recipe_labels`, `set_production_sheet_config`. HACCP senzori / curățenie (modul `setari`): `create_haccp_sensor`, `create_cleaning_task`.

## „Ce-ți cere userul → ce faci" (cheatsheet fabrică)
| Cererea userului | Ce faci |
|---|---|
| „Activează modul fabrică / nu mai văd Producție" | Setări → General → Domenii de Activitate → bifează „Fabrică alimentară". Explică: pagina simplă „Producție" dispare, în loc apar `/production` + `/planificare-mps`. |
| „Câte loturi am azi/luna asta + cantități" | `exec_list_batches` (`status`, `dateFrom`, `dateTo`). |
| „Pornește producția pentru rețeta X, 200 kg" | `exec_create_batch` (`recipeId`, `plannedQty`=200) → `exec_start_batch`. |
| „Am terminat lotul, am obținut 195 kg" | Lot simplu fără flux: finalizează din aplicație („Finalizează", actualQty=195) pt consum; `exec_complete_batch` (MCP) doar marchează statusul. Lot cu flux: finalizezi prin operații (`exec_complete_operation`). |
| „Pune lotul pe pauză / reia-l" | `exec_stop_batch` (`reason`) / `exec_resume_batch`. |
| „Mută lotul pe altă zi" | `exec_reschedule_batch` (`batchId`, `newDate`, `reason`). |
| „Vreau să văd unde e lotul" | `exec_get_batch_progress` (`batchId`) sau `exec_get_batch_stages`. |
| „Operatorul pornește/declară pe stație" | `exec_start_operation` → `exec_declare_consumption` (cu `lotId` dacă scanează) → `exec_declare_output` (`qtyGood`/`qtyScrap`) → `exec_complete_operation`. |
| „Predă containerul la stația următoare" | `exec_handover_operation` (`fromOperationExecutionId`, `toFlowOperationId`). |
| „Am greșit cantitatea declarată" | `exec_correct_quantities` (`correctionType`, `reason`). |
| „Din ce a fost făcut lotul X / de unde vine" | `exec_trace_lot_origin` (`lotId`). |
| „Unde a ajuns lotul de materie primă Y" | `exec_trace_lot_destination` (`lotId`). |
| „Pregătesc un recall pe lotul X" | `/loturi-wip` → Genealogie → caută lotul → raport de impact; sau `exec_trace_lot_destination`. |
| „Blochează lotul la calitate" | `create_quality_hold` (`lotId`, `eventType`). |
| „Eliberează carantina" | `release_quality_hold` (`holdId`, `releasedBy`). |
| „Ce loturi sunt acum în carantină" | `list_quality_holds`. |
| „Care e statusul QC al lotului X" | `exec_get_lot_qc_status` (`lotId`). |
| „Statistici calitate / cele mai dese defecte" | `get_qc_stats` / `get_defect_pareto`. |
| „Cât rebut/pierderi am avut" | `get_waste_report`. |
| „Ce trebuie să produc săptămâna asta" | `get_orders_summary` + `get_stock_levels` + `get_mps_net_requirements` (`horizonDays`). |
| „Pune în planul de producție rețeta X, 500 kg pe vineri" | `create_mps_entry` (`scheduledDate`, `plannedQty`). |
| „Arată-mi programul MPS" | `list_mps_schedule` (`from`, `to`). |
| „De câte materii prime am nevoie pentru 1000 buc din rețeta X" | `run_bom_explosion` (`recipeId`, `quantity`) — doar previzualizare. |
| „Cât stoc de semipreparate am" | `get_semipreparate_stock` / `get_production_stock_overview`. |
| „Adaugă o zonă de producție / un cuptor" | `create_production_zone` / `create_production_equipment` (`name`, `zoneId`). |
| „Setează capacitatea cuptorului pentru rețeta X" | `set_equipment_recipe_capacity` (`equipmentId`, `recipeId`, `maxQtyPerBatch`, `cycleTimeMinutes`). |
| „Leagă ingredientul de gestiunea din care se consumă" | `map_zone_ingredient_warehouse` (`zoneId`, `productId`, `warehouseId`). |
| „Creează tura de dimineață 6-14" | `create_production_shift` (`name`, `shortName`, `startTime`, `endTime`). |
| „Asignează echipa pe ture toată săptămâna" | `bulk_create_shift_assignments` (`shiftId`, `employeeIds`, `dates`). |
| „Cum stă fabrica acum / dashboard" | `get_factory_dashboard`. |
| „Care e randamentul / unde am gâtuiri" | `get_yield_trends` / `detect_production_bottlenecks` (`daysAhead`). |
| „Sumarul zilei de azi" | `get_daily_production_summary` (`date`). |
| „Construiește fluxul tehnologic pentru produsul nou" | `/ai-flow-builder` (conversațional) sau `build_complete_flow` (`operations`) / `create_flow_version` + `add_flow_operation`. |
| „Adaugă un senzor de temperatură la frigider" | `create_haccp_sensor` (`name`, `sensorType`=fridge). |
| „Printează etichetele lotului" | `print_production_labels` (`batchId`, `printerId`). |

## Întrebări frecvente și capcane
- **De ce nu văd Panou Fabrică / Execuție / MPS / B2B?** → Sunt doar în modul „fabrică" (Setări → General). În restaurant folosești `/productie-evenimente`.
- **De ce nu mai găsesc pagina „Producție"?** → În modul fabrică e ascunsă; echivalentul e `/production` + `/planificare-mps`.
- **De ce a scăzut stocul din alt lot?** → Fără lot alocat/scanat explicit, consumul merge după FEFO. Pune `lotId` în `exec_declare_consumption` sau scanează lotul; abaterea de la FEFO cere permisiune + motiv.
- **Pot anula lotul ca să-mi recuperez ingredientele?** → Nu — anularea nu reface stocul consumat. Folosește rework (șarjă fiică nouă).
- **Numărul de lot apare de mai multe ori — e o eroare?** → Nu; numerele de lot se pot repeta. Identificatorul fizic unic e codul QR al containerului.
- **De ce nu pot avansa/împărți containerul?** → Lotul lui e blocat la QC (carantină) — acțiunile sunt dezactivate până la eliberare.
- **Planificarea MRP / explozia BOM mi-a „consumat" stocul?** → Nu — sunt doar previzualizări; stocul se mișcă doar la consum/finalizare de lot.
- **Rețeta e în grame, produsul în kg — se încurcă?** → Nu, conversiile g/kg și ml/l se aplică automat. Dar unitate din altă familie (buc unde trebuie kg) → food cost/stoc absurd, fără avertisment.
- **De ce nu pot finaliza lotul cu `exec_complete_batch`?** → În modul fabrică, dacă lotul are flux tehnologic atașat, finalizarea simplă e blocată — finalizează prin operații shop-floor (`exec_complete_operation`).
- **De ce e diferit `exec_complete_operation` de `exec_declare_consumption`?** → `exec_complete_operation` poate face auto-consum (backflush) + scrie genealogia + creează containere automat; `exec_declare_consumption` e declarare manuală a consumului în timpul operației.
- **Costul producției apare în rapoarte?** → Da — costul real al producției intră în COGS din P&L.
- **Clientul/inspectorul poate vedea un container fără cont?** → Da — pagina `/c/:codQR` e publică, se deschide la scanarea etichetei QR.

## Pentru acces SQL
Tabele relevante: `production_batches` (loturi/șarje), `inventory_lots` (loturi de stoc), `genealogy_edges` (trasabilitate intrare→ieșire), `production_containers` (containere cu QR unic), `batch_material_links` (loturi alocate explicit pe șarjă), `operation_executions` (execuții shop-floor), `planned_lots` (loturi planificate), `quality_hold_events` (blocaje QC), `production_qc_inspections` (inspecții QC), `mps_schedule_entries` (plan MPS), `production_zones`/`production_equipment`/`equipment_recipe_capacities`/`zone_ingredient_warehouses` (infrastructură), `production_shifts` (ture), `haccp_sensors` (senzori), `inventory_documents` + liniile lor (documente consum/producție).
Exemple: „câte loturi am finalizat luna aceasta cu ce cantități", „ce loturi de materie primă au intrat în lotul X" (prin `genealogy_edges`), „ce loturi sunt acum în carantină", „care e utilizarea pe zone săptămâna asta".