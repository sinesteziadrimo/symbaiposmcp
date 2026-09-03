# Greșeli de management pe care le vezi în date — și cum le spui

Un consultant bun nu așteaptă să fie întrebat. Observă, dovedește cu o cifră, propune o dată, respectă decizia. Tiparele de mai jos sunt cele care apar cel mai des în HoReCa, producție, construcții și magazine online; fiecare are tool-ul care îl dovedește. Le verifici în briefing (`briefing-business`), le scrii ca `observatie` în memorie (`memorie-business`) și NU le repeți după ce userul a decis (`decizie`).

Cum le spui: **fapt → efect → propunere → ce pot face eu**, într-un paragraf, fără ton de reproș. Doar către proprietar/manager (persoana potrivită din `personas-utilizatori.md`), niciodată către un angajat despre colegul lui.

## Bani și control

| Tipar | Cum îl dovedești | Ce propui |
|---|---|---|
| Zile de casă neînchise, uneori săptămâni | `list_open_cash_days` | închiderea lor (o poți face tu cu `bulk_close_cash_days` după acord) + o sarcină recurentă de închidere cu dovadă |
| Reduceri mari concentrate la un ospătar / o tură | `performanta_ospatari`, `get_employee_activity`, `raport_vanzari` → reduceri % | politică de reduceri cu prag de aprobare (`set_discount_policy`), nu acuzații |
| Anulări și retururi peste 2 % din bonuri | `get_end_of_day_report`, `jurnal_activitate` | training la preluare, aprobare pentru anulări după trimiterea la bucătărie |
| Facturi de intrare fără NIR luni la rând (contabilitatea primară „din pix") | `get_primary_accounting_status`, `list_pending_nirs` | recepția din poză + regulă: nicio marfă fără NIR (skill `receptie-factura-furnizor`) |
| Creanțe restante pe facturi B2B | `get_invoice_receivables_summary` | scadențe în contract, blocarea livrărilor la restanțe, reminder automat |
| Cheltuieli fără categorie în P&L („Nealocate") | `get_pnl`, `scan_unzoned_products` | configurarea categoriilor (`setari-pnl.md`); fără asta P&L-ul minte |
| Prime cost peste 65 % | `get_pnl` | cele două pârghii: food cost (rețete, porții, furnizori) și ture pe zilele slabe (`get_weekday_pnl`) |

## Stoc și bucătărie

| Tipar | Dovadă | Propunere |
|---|---|---|
| Stocul „nu scade" și nimeni nu s-a uitat de luni | `check_stock_health`, `find_consumption_gap_days` | repararea rețetelor + recuperarea zilelor; abia apoi discuția despre furt/risipă |
| Rețete nelegate sau cu unități imposibile | `scan_recipe_consumption_gaps`, `scan_recipe_unit_mismatches` | corectare în lot (`fix_recipe_unit_mismatches`), nu produs cu produs |
| Produse-vedetă care ies din stoc în weekend | `get_menu_engineering` + `get_stock_levels(onlyLowStock)` + `list_unavailable_products` | stoc minim + comandă automată (`creeaza-automatizare`) |
| Ingrediente niciodată cumpărate (deci consum fictiv) | `scan_unpurchased_ingredients` | unificarea produselor dublate (`list_finished_product_merge_suggestions`) |
| Preț de recepție de 5× media | `scan_suspect_reception_costs` | corectarea lotului (`fix_reception_costs`) + factor de pachet la mapare |
| Inventariere „pe hârtie" fără sesiune în sistem | `list_stock_count_sessions` | inventarul lunar în aplicație, cu aprobarea diferențelor |
| HACCP cu citiri lipsă zile la rând | `list_temperature_logs`, `list_haccp_incidents` | sarcină recurentă cu dovadă numerică; senzori acolo unde se poate |

## Oameni și organizare

| Tipar | Dovadă | Propunere |
|---|---|---|
| Ture supradimensionate marțea și subdimensionate sâmbăta | `vanzari_in_timp` × `list_shift_assignments` | reprogramarea pe vârfuri; costul personalului pe zile din `get_weekday_pnl` |
| Sarcini fără dovadă / liste pe care nu le vede nimeni | `get_task_dashboard`, `list_task_lists` | ținta pe rol+tură+raion, dovadă foto la curățenie (`gestioneaza-sarcini`) |
| Un singur om decide totul (nicio aprobare delegată) | `list_operation_requests` (toate la același aprobator), `describe_role` | roluri cu aprobare de nivel 1 pentru șeful de tură |
| Ospătari fără raion → comenzile QR ajung la cine nu trebuie | Program Salon / `list_shift_assignments` | raioanele în tură (`gestioneaza-personal`) |
| Roluri cu `all` la mai mulți angajați decât proprietarul | `list_roles`, `describe_role` | roluri prestabilite (`find_role_for_job`, `apply_role_presets`) |
| Penalizări bănești discutate | — | ilegale în România; eligibilitate la bonus, niciodată sumă negativă |

## Clienți și vânzări

| Tipar | Dovadă | Propunere |
|---|---|---|
| No-show peste 15 % fără avans | `get_reservations_overview` | avans sau confirmare la rezervări mari (`configure_reservation_deposit`) |
| Recenzii fără răspuns de săptămâni | `gbp_reviews_summary` | răspuns la toate în 48 h (`raspunde-recenzii`), invitații după vizită |
| Clienți buni care nu mai vin, neurmăriți | `list_customers_360(filter: at-risk)`, `list_nba_suggestions` | campanie de win-back cu grup de control (`ruleaza-retentie`) |
| Comisionul agregatorului mănâncă marja, dar tot se fac promoții pe platformă | `get_delivery_pnl`, `list_delivery_pnl_segments` | oferte doar pe canalele proprii (QR, portal, telefon) |
| Oferte 1+1 pe produse cu marjă mică | `preview_offer_margin`, `get_menu_engineering` | ofertă pe produse cu marjă mare și viteză mică („enigme") |
| Comenzi online neexpediate peste 48 h | `list_ecommerce_orders(status)` | sarcină zilnică de expediere + alertă (`creeaza-automatizare`) |

## Marketing

| Tipar | Dovadă | Propunere |
|---|---|---|
| Reclame fără atribuire (nu se știe ce aduce) | `get_marketing_scorecard`, `get_attribution_report` | link-uri/QR cu atribuire, `compare_attribution_models` |
| Canal cu LTV:CAC sub 3 ținut din inerție | `get_marketing_scorecard` | realocarea bugetului la canalul care aduce clienți reveniți |
| Email trimis la listă murdară | `check_email_list_health`, `get_email_account_health` | curățare + warm-up înainte de campanie |
| Postări doar când „are cineva timp" | `list_social_posts` (goluri de săptămâni) | calendar din `get_seasonal_calendar` + programare în lot (`programeaza-postare`) |
| Nimic pregătit cu 3–4 săptămâni înainte de sezon (Paște, 1 Iunie, Crăciun) | `get_seasonal_calendar` | plan trimestrial (`condu-marketingul`) |

## Producție și fabrică

| Tipar | Dovadă | Propunere |
|---|---|---|
| Loturi pornite fără materiale (opriri în mijlocul zilei) | `get_batch_material_readiness` | preflight obligatoriu înainte de start |
| Forecast ignorat sau, invers, urmat orbește deși e slab | `get_forecast_accuracy` | plan de siguranță pe produsele mari; forecastul pe cele cu acuratețe bună |
| Utilaj cu OEE în scădere trei săptămâni | `get_equipment_oee`, `list_equipment_downtime` | mentenanță programată (`creeaza-automatizare`) |
| Rebut concentrat pe o cauză (Pareto) | `get_defect_pareto` | atacă prima cauză; CAPA (`open_capa`) |
| Etichete de fabrică greșite sistematic | `check_label_setup` | regula de etichetă pe container/stație (`etichete-productie`) |

## Construcții

| Tipar | Dovadă | Propunere |
|---|---|---|
| Lucrare cu marjă prognozată sub 10 % fără change order | `get_worksite_profit` | change order pentru lucrările suplimentare (`record_worksite_change_order`) |
| Costuri și jurnale neaprobate de săptămâni | cozile `decide_worksite_*` | aprobare săptămânală fixă, delegată șefului de șantier |
| Materiale plecate pe șantier fără eveniment | `record_worksite_material_event` lipsă vs stoc | scanarea QR la ieșire (`scan_worksite_code`) |

## Cum NU o faci

- Nu enumera zece probleme deodată. Cea mai scumpă întâi; restul în briefing-ul următor.
- Nu spune „greșeală" — spune ce arată datele și ce s-ar câștiga.
- Nu presupune cauza: „reducerile lui X sunt mari" e un fapt; „X fură" nu e.
- După o decizie a userului (chiar „lasă-l așa"), scrii `decizie` și nu mai revii decât cu date noi.
