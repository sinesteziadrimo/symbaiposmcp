# Migrare de pe SAP → Symbai (fabrică alimentară) — hartă de paritate

Pentru un client care vine de pe **SAP S/4HANA (PP-PI / QM / MM / CO)** și întreabă „voi puteți face X ca în SAP?". Aici ai **echivalentul Symbai** al fiecărei tranzacții SAP uzuale dintr-o fabrică alimentară: ce tool/pagină folosești, ce face la fel, ce face **diferit/mai bine**, și — onest — **ce NU face** încă. Nu repeta operarea pas-cu-pas (aia e în `productie-fabrica.md`); aici e busola de migrare + răspunsul la obiecții.

Regula de aur: **răspunde onest**. Dacă Symbai face echivalentul, arată tool-ul. Dacă face altfel, explică cum. Dacă nu face, spune clar și propune alternativa — nu promite ce nu există.

## PP / PP-PI — producție (rețete, ordine, confirmări, planificare)
| SAP (tcod) | Ce e | Symbai |
|---|---|---|
| C201/C202 Master Recipe, CS01 BOM | rețetă cu faze/operații + listă materiale | **Fluxuri Tehnologice** (`/fluxuri-tehnologice`, `/ai-flow-builder`) + rețete; `list_recipes`, `build_complete_flow`, `add_operation_material/_output` |
| CR01 Work Center / Resource | stație, capacitate, tarif | **Echipamente & Zone** (`/production/equipment-zones`); `list_production_zones`, `list_production_equipment`, `assign_flow_to_equipment` pentru productivitate pe operații de flux, `set_equipment_recipe_capacity` pentru capacitate per rețetă |
| CO01/CO40 Process Order, COR1 | lansare ordin de producție | `exec_create_batch` (cu `flowVersionId` pt fabrică); `schedule_production_orders` (auto pe echipamente/ture, `commit:false`→preview) |
| CO11N Confirmation + backflush | confirmare operație + consum auto | `exec_complete_operation` (backflush BOM, creează consum/output/containere/genealogie dintr-un pas) sau manual `exec_declare_consumption`→`exec_declare_output` |
| MD61 PIR (cerere planificată) | plan make-to-stock | `forecast_production_demand` (PIR din vânzări POS + B2B) |
| MD01/MD02 MRP run | explozie necesar pe niveluri | MRP multi-nivel (LLC, NET nivel-cu-nivel, shelf-life JIT, pegging); `get_mps_net_requirements`, `run_bom_explosion` |
| MD04 Stock/Requirements, MMBE | situație stoc vs cerere | `get_mps_net_requirements`, `get_stock_levels`, `get_production_stock_overview` |
| CO09/ATP free-to-promise | cât e liber de promis | `get_material_availability` (stoc − rezervări producție) |
| CM01/CM21 Capacity planning | încărcare capacitate finită | `get_production_schedule_feasibility` (simulator real finite-capacity; ține cont de changeover + downtime + sărbători) |
| Changeover / setup matrix | timpi de schimbare rețetă | `create_changeover_rule`; consumat de scheduler (cleandown + secvențiere alergeni) |
| Readiness/release gate | gate înainte de lansare | `get_manufacturing_readiness` (BOM+stoc+flux+echipamente+QC); `get_batch_material_readiness` |

## QM — calitate (inspecții, COA, NCR/CAPA, EBR, trasabilitate)
| SAP | Ce e | Symbai |
|---|---|---|
| QA01/QA32 Inspection lot (recepție) | control la intrare + carantină | `record_incoming_inspection` (accept/carantină/respins → status lot → FEFO); `list_quarantine_lots` (coada activă) |
| QE/QGA3 Results recording | rezultate QC în-proces | QC pe operație (vezi `productie-flux`: cerințe + consemnare dovadă înainte de finalizare); `get_qc_stats`, `list_qc_inspections` |
| QM Notification + 8D/CAPA | neconformitate + acțiune corectivă | `open_capa` → `update_capa` (open→investigating→action→verification→closed cu cauză-rădăcină + verificare + responsabil); `list_capa` |
| Certificate of Analysis | COA per lot | `generate_batch_coa` (QC vs specificație + loturi + valabilitate + alergeni + verdict conform/neconform) |
| Batch derivation / where-used (MB56) | genealogie sus/jos | `exec_trace_lot_origin` (amonte) + `exec_trace_lot_destination` (aval); **`trace_recall_to_customers`** (lot→client, Reg. 178/2002 un-pas-înainte) |
| Recall / blocaj lot | retragere + hold calitate | `build_recall_report`; `create_quality_hold`/`release_quality_hold`; `update_lot_status` |
| Electronic Batch Record (21 CFR) | dosar lot + semnătură + audit | `build_electronic_batch_record`, `release_electronic_batch_record`, `verify_electronic_batch_record`; lanț hash tamper-evident `verify_batch_audit_chain` |
| Mass balance / yield | bilanț masă | `get_batch_mass_balance` (intrări vs output bun + scrap + rework) |

## MM / IM — stocuri & aprovizionare
| SAP | Ce e | Symbai |
|---|---|---|
| MIGO / goods receipt + NIR | recepție marfă pe lot | `create_reception_note` / NIR din factură; `create_nir_from_invoice` |
| MB52/MMBE stock overview | stoc pe gestiune/lot | `get_stock_levels`, `list_lots`, `get_warehouse_products_summary` |
| MSC1N Batch master | lot cu caracteristici | `lots` (data fab./valabilitate, status QC, cost) — FEFO încorporat |
| ME21N PO + ME2M | comandă furnizor | `create_purchase_order`, `receive_purchase_order`, `analyze_procurement`; din MRP: `create_purchase_orders_from_requirements(commit:false→preview, commit:true→DRAFT PO)` |

## CO-PC — cost de producție
| SAP | Ce e | Symbai |
|---|---|---|
| CK11N/CK40N Standard cost | calculație cost de plan | `get_production_cost_estimate` (material+scrap + manoperă + utilaj + overhead, defalcat) |
| KKS1/KKS2 Variance | abateri standard vs actual | `get_production_cost_variance` (abatere preț vs cantitate/randament per material) |
| Co-products / by-products | alocare cost co-produse | `recipe_outputs` cu `costAllocationPercent` |

## PM — mentenanță · SD/EDI · etichetare · HACCP
- **PM (IW31 work order / downtime):** `create_equipment_downtime`/`list_equipment_downtime`; plannerul exclude echipamentul în mentenanță. (Gap: OEE dedicat — azi utilizare/downtime brut, `get_equipment_utilization`.)
- **SD + EDI retail (DESADV/ASN/SSCC):** distribuție B2B retail prin `get_retail_distribution_readiness` (audit GLN/GTIN/stoc/loturi/paletizare) și `generate_b2b_retail_shipment_plan` (plan intern WMS/SSCC/ASN). (Gap onest: **transport EDI real X12/EDIFACT AS2/SFTP/VAN** — nu; se pregătesc datele/etichetele și statusul `ready_to_send`, integrarea cu VAN/partener se face separat.)
- **Etichetă produs finit (EU 1169/2011):** `build_ingredient_declaration` (ingrediente desc. după greutate + QUID% + alergeni recursivi); etichete producție `print_production_labels`, `print_designed_label`.
- **HACCP / food safety:** CCP temperatură, blast-chill, recall — vezi skill-ul `gestioneaza-haccp` (temperaturi, incidente, răcire rapidă, recall→client).

## Ce face Symbai DIFERIT / mai bine ca SAP (argumente de vânzare)
- **AI-native:** operezi fabrica din chat (acest plugin + MCP) — fără consultanți pt fiecare schimbare; SAP cere customizing + key-useri.
- **Edge offline:** producția/POS merg local când pică netul; sync automat.
- **Fiscal + conformitate RO** out-of-the-box (e-Factura ANAF, registru casă, EU 1169).
- **TCO + viteză:** implementare în zile/săptămâni, nu luni; fără licențe per-modul scumpe.
- **Recall-grade traceability** + EBR + CAPA + COA incluse, operabile prin AI.

## Ce NU face (spune onest)
- **Material Ledger complet** (actual costing rostogolit multi-nivel) — nu; ai standard cost + variance pe lot.
- **EDI real X12/EDIFACT** cu partener extern (AS2/SFTP/VAN) — nu; doar datele/SSCC/ASN.
- **WM bin-level / putaway strategies** ca EWM — parțial (gestiuni + loturi + SSCC, nu strategii de bin).
- **Variant configuration (LO-VC), S&OP aggregate engine separat, net-change vs regenerative MRP** — overbuild pt fabrică mică/medie, neimplementate intenționat.

## Legături
- Operare pas-cu-pas fabrică → `knowledge/productie-fabrica.md` + skill `productie-flux`.
- Benchmark ERP/MES + readiness gate → `knowledge/erp-manufacturing-benchmark.md`.
- HACCP / food safety → skill `gestioneaza-haccp`.
- Comparații enterprise read-only: `get_enterprise_control_readiness`, `get_industrial_costing_readiness`, `get_procurement_wms_readiness`, `get_advanced_planning_readiness`.
