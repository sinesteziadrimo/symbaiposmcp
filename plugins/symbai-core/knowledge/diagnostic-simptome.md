# Diagnostic după simptom — „de ce nu…?"

Când clientul spune că ceva NU merge, nu ghici cauza și nu trimite omul „să verifice setările". Symbai are tool-uri de diagnostic care răspund cu MOTIVUL real, din date. Citește-l, citează-l, apoi aplică remediul cel mai mic.

## Protocolul (mereu același)

1. **Reproduce cu date**, nu cu presupuneri: un tool de citire pe entitatea reclamată (masa, factura, lotul, postarea).
2. **Rulează tool-ul de diagnostic** din tabelul de mai jos. Răspunsul lui conține de regulă cauza și pasul următor.
3. **Spune cauza doar dacă o ai dovedită** de un răspuns. „Probabil e de la…" nu e un diagnostic; e o ipoteză și o marchezi ca atare.
4. **Remediul cel mai mic** care rezolvă exact cauza (tool de reparare cu `confirm:true` după acordul userului, sau pagina din aplicație cu link direct).
5. **Verifică prin citire** că simptomul a dispărut. Interfața poate arăta din cache.
6. **Nu există tool pentru cazul lui?** `trimite_ticket_symbai` cu ce ai găsit (ce ai rulat, ce a răspuns), nu cu „nu merge X".

Regula de aur: NU conchide „Symbai nu poate" și NU conchide „e o limită a sesiunii". Dacă nu găsești tool-ul, `cauta_tool(«ce vrei să faci»)`; dacă lipsesc module întregi, `verifica_conexiune`.

## Stoc, consum, cost

| Simptom | Întâi | Apoi |
|---|---|---|
| „Nu scade stocul din vânzări", „food cost aiurea" | `check_stock_health` — o singură verificare pentru stoc, cost și consum | zilele fără consum: `find_consumption_gap_days`; starea jobului zilnic: `get_daily_consumption_status`; recuperare: `recover_blocked_consumption_days` 🔒 |
| „Nu s-a generat consumul azi" | `get_daily_consumption_status(date)` | consumul se generează prin jobul ZILNIC, nu la fiecare vânzare; rețete care rup consumul: `scan_recipe_consumption_gaps` |
| „Cost 150%", „cost 0", „preț de recepție absurd" | `scan_suspect_recipe_costs`, `scan_zero_cost_sold`, `scan_suspect_reception_costs` | unități netraductibile (g pe produs în buc): `scan_recipe_unit_mismatches` → `fix_recipe_unit_mismatches` 🔒; costuri de recepție: `fix_reception_costs` 🔒 |
| „Din ce gestiune scade ingredientul X?" | `diagnose_consumption_warehouse_routing(product, brand, location)` | gestiuni lipsă: `audit_product_warehouse_coverage`; produse fără zonă („Necategorizat" în P&L): `scan_unzoned_products` |
| „Lotul arată mai mult decât gestiunea", „deficit fals" | `check_container_placement_drift` | `repara_loturi_peste_stoc` 🔒, `repair_container_placements` 🔒 |
| „Am corectat rețeta și rapoartele arată la fel" | rapoartele nu se recalculează singure | `reprocess_daily_consumption` 🔒 pe perioadă (verifică jobul cu `get_reprocess_job_status`) |
| „Ingrediente pe care nu le-am cumpărat niciodată" | `scan_unpurchased_ingredients` | de regulă produs dublat sau rețetă legată greșit: `link_recipe_products` |

## Recepție, facturi de intrare, contabilitate primară

| Simptom | Întâi | Apoi |
|---|---|---|
| „Factura nu intră pe stoc", „NIR-ul lipsește" | `get_primary_accounting_status(luna)` — câte facturi au NIR și câte nu | integritatea facturilor: `diagnose_incoming_invoice_integrity`; facturi înțepenite după stornare: `repair_stuck_invoices` 🔒 |
| „Am făcut recepția din poză și nu văd nimic" | `explain_photo_reception(sessionId)` + `get_photo_reception_timeline` | sesiune respinsă înainte de factură: `get_photo_reception_attempt_timeline`; dublă intrare? `find_photo_reception_for_invoice` |
| „Factura are zero linii" | `diagnose_incoming_invoice_integrity` | `repair_missing_incoming_invoice_lines` (doar din XML-ul oficial, pe ciornă) |
| „Furnizorul apare cu alt nume / CUI lipsă" | `resolve_supplier_identity`, `list_suppliers_without_tax_id` | `repair_incoming_invoice_supplier_tax_ids` |
| „Sunt facturi noi la ANAF?" | `check_new_efactura` | `process_new_efactura` / `import_efactura` |
| „Produsul furnizorului intră la produsul greșit" | `list_supplier_product_mapping_conflicts` | `resolve_supplier_product_mapping` 🔒 |
| „Ce a făcut softul luna asta?" | `audit_primary_accounting_period` | `audit_consumption_chain` pe interval: vânzare → consum → stoc → notă |

## Casă, plăți, fiscal, P&L

| Simptom | Întâi | Apoi |
|---|---|---|
| „Nu merge plata cu cardul", „butonul Card GP e gri" | `diagnose_card_gp` | skill `depaneaza-plata-card` |
| „Nota a rămas în plată / plată în așteptare" | `list_stuck_payments`, `list_payment_conflicts` | `release_payment_lock`, `resolve_payment_conflict`, `resolve_uncertain_card_payment` |
| „Nu iese raportul Z", „al doilea Z" | `diagnose_fiscal_z_extraction` | `recover_fiscal_z_from_journal` (din jurnalul electronic al casei) |
| „Casa fiscală e offline / nu răspunde" | `get_fiscal_printer_health` | skill `investigheaza-printare` |
| „Nu pot închide ziua", „registrul nu bate" | `get_cash_register_closure_status`, `get_cash_book_day` | skill `inchidere-zi-casa` |
| „P&L-ul dă eroare / e blocat" | `diagnose_pnl_integrity` | de obicei zile fără consum sau documente nepostate; vezi secțiunea de stoc |
| „Notele contabile nu respectă conturile setate" | `scan_gl_product_type_rule_drift` | `apply_accounting_codes` / setările pe tip de produs |

## Bonuri, imprimante, KDS, mese

| Simptom | Întâi | Apoi |
|---|---|---|
| „Nu iese bonul la bucătărie/bar" | `list_print_problems` (ce e blocat ACUM) | povestea unui bon: `get_print_job_timeline`; `retry_print_job`, `reprint_print_job_elsewhere` |
| „Bonul a ieșit de două ori", „marfa e de două ori pe notă" | `get_order_timeline` | `repair_duplicated_order_items` 🔒 |
| „Nota încasată apare neîncasată în administrare" | `list_shadow_order_conflicts` | `force_edge_resync` (doar rol complet) — repune în coadă rândurile blocate pe serverul local |
| „Ce e pe masa 12 / ce s-a întâmplat cu nota X" | `get_table_status`, `get_order_timeline` | audit: `jurnal_activitate` |
| „Modificatorii produsului nu apar în POS" | `diagnose_product_option_runtime` | grupuri inactive / nepublicate pe canal |
| „Produsul nu apare în meniul de pe QR" | `verifica_produse_lipsa_portal` | skill `configureaza-portal` |
| „KDS-ul a sărit un tichet" | `get_kds_timeline(sessionUid \| screenId)` | rutarea pe taguri: skill `gestioneaza-etichete` |

## Producție, fabrică, etichete

| Simptom | Întâi | Apoi |
|---|---|---|
| „Pot porni lotul?", „lipsesc materiale" | `get_batch_material_readiness`, `get_manufacturing_readiness` | `exec_diagnose_material_picking` |
| „Fluxul cere un pas inutil / operatorul așteaptă degeaba" | `scan_flow_contradictions` | `repair_flow_contradictions` |
| „Ce s-a întâmplat azi în producție?" | `explain_production_day` | `get_daily_production_summary` |
| „De ce recomandă cantitatea asta?" | `explain_forecast_number(product, day)` | `simulate_forecast_parameters` |
| „Planul e fezabil?" | `get_board_health`, `get_production_schedule_feasibility` | `detect_production_bottlenecks` |
| „Eticheta nu iese / iese tăiată / pe imprimanta greșită" | `check_label_setup`, `get_label_print_plan` | skill `etichete-productie` |
| „Pot elibera lotul din frig?" | `get_cold_chain_release_readiness` | `record_batch_quality_release` |
| „Dosarul lotului e intact?" | `verify_batch_audit_chain`, `verify_electronic_batch_record` | — |

## Livrări

| Simptom | Întâi | Apoi |
|---|---|---|
| „Ce întârzie / ce alerte am" | `list_delivery_alerts` | `list_failed_deliveries` → `retry_failed_delivery` |
| „De ce a primit comanda ETA-ul ăsta?" | `explain_delivery_eta` | `configure_portal_eta` |
| „E eligibilă comanda pentru retur?" | `check_rma_eligibility` | `approve_rma` / `reject_rma` |
| „Suntem gata de distribuție B2B?" | `get_b2b_dispatch_readiness` | skill `gestioneaza-comenzi-b2b` |

## Marketing, comunicare, website, agenți

| Simptom | Întâi | Apoi |
|---|---|---|
| „Nu s-a publicat postarea" | `diagnose_social_publish_failure` | integrarea: `verifica_integrare(meta)`; skill `conecteaza-meta` |
| „Reclama nu rulează / a fost respinsă" | `get_ad_campaign_status` (motivul vine de la Meta) | `get_ad_campaign_insights` |
| „Clientul X nu primește emailuri" | `explain_email_address` (suprimări, dezabonări, blocări) | lista înainte de trimitere: `check_email_list_health`; contul: `get_email_account_health`; domeniul: `get_sender_domain_status` |
| „Campania o să ajungă în spam?" | `check_email_campaign_deliverability` | `analyze_email_send_time_plan` |
| „Pot să-i trimit marketing clientului?" | `check_marketing_allowed`, `check_contact_frequency_budget` | — |
| „Nu primește push" | `get_push_consent_status` | `send_test_push` |
| „De ce nu apar în Google?" | `audit_website_seo`, `get_seo_provider_status` | skill `optimizeaza-seo` |
| „Magazinul online are probleme" | `audit_shop_health` | skill `construieste-website` |
| „Prezentarea iese plată" | `check_presentation_health` | skill `construieste-prezentare` |
| „Chatul de pe site / recepționerul nu răspunde" | `get_agent_publish_status`, `diagnose_voice_agent` | skill `creeaza-agent-client` |
| „Copierea site-ului s-a oprit?" | `get_clone_crawl_status` | skill `copiaza-website` |

## Personal, roluri, beneficii, conformitate

| Simptom | Întâi | Apoi |
|---|---|---|
| „Nu se aplică beneficiul de masă" | `diagnose_staff_benefit_rule(ruleId)` | coada de aprobări: `diagnose_staff_benefit_approval_queue` |
| „Angajatul nu vede pagina / nu poate face X" | `describe_role(rol)` — permisiuni + pagini | skill `configureaza-roluri` |
| „Am nevoie de un rol pentru meseria X" | `find_role_for_job` (preseturi) | `apply_role_presets` 🔒 |
| „Ce obligații legale am restante?" | `get_compliance_status` | `explain_compliance_requirement`, acte: `find_company_document` |
| „Ce lipsește din planul HACCP?" | `list_haccp_plan_gaps` | skill `gestioneaza-haccp` |

## Conexiune, tool-uri, instanță

| Simptom | Întâi | Apoi |
|---|---|---|
| „Văd puține tool-uri", „lipsesc furnizorii/meniurile" | `verifica_conexiune` → `arieAngajat`, module, profil | skill `conecteaza-symbai`, secțiunea „Văd puține tool-uri" |
| „Există un tool care face X?" | `cauta_tool(«ce vrei să faci»)` | dacă nu există: `trimite_ticket_symbai` (sugestie) |
| „Cât am configurat din instanță?" | `get_config_status` | skill `onboarding-symbai` |
| „Instanța e lentă" | `diagnose_index_health` (necesită modulul Setări) | trimite raportul echipei Symbai prin ticket |
| „Contabilitatea nu se sincronizează" | `get_accounting_sync_status`, `get_accounting_status` | — |
