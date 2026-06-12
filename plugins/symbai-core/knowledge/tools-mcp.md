# Catalogul tool-urilor MCP (conexiunea live la instanța ta)

> Acesta e catalogul complet al tool-urilor disponibile prin conexiunea MCP `symbai` (tokenul `symbai_mcp_*` generat din portalul Hub → Acces AI). Lista live o vezi oricum la conectare; fișierul ajută la orientare: ce se POATE face prin asistent și ce permisiune cere fiecare acțiune.

Modelul de permisiuni al tokenului:
- **Citire = mereu disponibilă** — toate tool-urile de listare, căutare, rapoarte și analiză.
- **Scriere = per modul** — fiecare tool de scriere cere ca modulul lui (ex. `produse_meniu`, `setari`) să fie bifat pe token; altfel primești mesaj de permisiune insuficientă (se activează din portal Hub → Acces AI).
- **SQL doar-citire = comutator separat** pe token (interogări SELECT pe baza de date, cu protecții).

Fiecare apel e înregistrat în jurnalul de activitate al instanței (auditabil de proprietar). Rezultatele lungi sunt trunchiate la 80.000 de caractere. Parametrii marcați cu `*` sunt obligatorii.

## ⚠ De știut la scrieri prin MCP (gotcha-uri confirmate)

- **Interfața aplicației NU se actualizează instant după o scriere prin MCP.** Aplicația POS ține datele în cache în browser; o modificare făcută prin conexiune (ex. `update_location` care redenumește o locație) apare în interfață abia după ce utilizatorul dă refresh paginii sau aplicația își reîmprospătează singură datele. **Dacă tool-ul a întors succes, modificarea E salvată** — verifică cu un tool de CITIRE (ex. `list_locations` după `update_location`), NU repeta scrierea și NU raporta bug. Spune-i utilizatorului să dea refresh dacă nu o vede.
- **Asocieri brand ↔ locație**: sursa de adevăr e `list_locations` — fiecare locație care ARE branduri asociate apare cu `branduri:<nume>`. Dacă o locație apare FĂRĂ partea `branduri:`, înseamnă că nu are niciun brand legat (nu că informația lipsește). Asocierea se face cu `link_brand_location` / se desface cu `unlink_brand_location`; după operație, re-verifică tot cu `list_locations`. Un brand funcționează DOAR la locațiile la care e legat.
- **Pattern general scriere → verificare**: după orice tool de scriere, confirmarea finală o dai pe baza unui tool de citire, nu pe baza interfeței sau a presupunerii. O scriere repetată „ca să se prindă" creează risc de duplicate.

**TOTAL: 232 tool-uri unice** — Citire 80 · Analiză dedicată 5 · SQL 3 · Scriere per modul 139 · Speciale 5 — gaseste_in_aplicatie + trimite_ticket_symbai + verifica_integrare + 2 de citire social (cele 4 de scriere social/integrări sunt numărate la modulul marketing_social).

## Citire (fără permisiune de modul) — 80 tool-uri

### Tools generale (catalog, structură, configurare) — 46

#### Listări (entități, structură, catalog) — 20
- list_entities — Listare rapidă a oricărui tip de entitate (produse, angajați, roluri, meniuri, gestiuni, facturi etc.) cu filtrare pe brand (parametri cheie: entityType*, brandId*, limit, filters)
- list_brands — Listează toate brandurile din sistem cu detalii (parametri cheie: fără parametri)
- list_locations — Listează toate locațiile cu detalii complete: adresă, oraș, brand asociat (parametri cheie: fără parametri)
- list_warehouses_full — Listează toate gestiunile/magaziile cu detalii: tip produse, locație, brand, cod, status activ (parametri cheie: locationId, brandId)
- list_storage_zones_full — Listează toate zonele de depozitare (sub-zone din magazii) (parametri cheie: parentId)
- list_menus — Listează toate meniurile cu status și brand (parametri cheie: brandId)
- list_menu_items — Listează produsele dintr-un meniu specific, cu categoria de meniu și zona de depozitare (parametri cheie: menuId*)
- list_menu_categories — Listează categoriile de meniu per brand/meniu, cu numărul de produse din fiecare (parametri cheie: brandId, menuId)
- list_vat_rates — Listează toate cotele de TVA configurate (parametri cheie: fără parametri)
- list_tags — Listează toate tagurile/etichetele din sistem (parametri cheie: entityType, brandId)
- list_tag_summary — Rezumat al tagurilor cu numărul de asignări pe tip de entitate (parametri cheie: brandId)
- list_untagged_products — Listează produsele active fără niciun tag (parametri cheie: brandId, warehouseId)
- list_suppliers — Listează furnizorii cu detalii: nume, CUI, contact, email, telefon, categorie, tip (parametri cheie: query)
- list_recipes — Listează rețetele (semipreparate, preparate finite) (parametri cheie: productType, query, limit)
- list_printers — Listează imprimantele configurate per locație (parametri cheie: locationId)
- list_floor_zones — Listează zonele de salon (etaje, terasă, interior) per locație (parametri cheie: locationId)
- list_product_types — Listează tipurile de produs cu proprietățile și conturile contabile (parametri cheie: brandId*)
- list_accounting_accounts — Listează planul de conturi (chart of accounts) (parametri cheie: brandId*, codePrefix)
- list_portal_games — Listează jocurile din portal: categorie, jucători min/max, capacitate, durată slot, program, prețuri (parametri cheie: brandId*, locationId, category, activeOnly)
- list_sales_agents — Listează agenții de vânzări AI ai unui brand: nume, tip, status, scenariu (parametri cheie: brandId*)

#### Căutare + detalii + statusuri — 17
- search_products_db — Caută produse după nume, SKU, cod de bare, categorie, tip sau tag-uri (parametri cheie: query, productType, storageZoneId, tagNames, limit)
- get_product_details — Detalii complete pentru un produs (taguri, categorie, gestiune, furnizor, rețetă dacă există) (parametri cheie: productId*)
- get_warehouse_products_summary — Sumar produse dintr-o gestiune: câte, pe ce categorii și tipuri (parametri cheie: warehouseId*)
- get_staff_overview — Rezumat complet personal: angajați, roluri, ture viitoare, liste sarcini, pontaje (parametri cheie: brandId*, locationId)
- get_reservations_overview — Rezumat rezervări: setări curente, statistici, rezervări azi/mâine, waitlist, tipuri configurate (parametri cheie: brandId, locationId)
- get_accounting_overview — Stare contabilă: tipuri de produs cu/fără conturi, plan de conturi, înregistrări, configurare sync (parametri cheie: brandId*)
- get_journal_entries_summary — Rezumat înregistrări contabile pe perioadă: total debit/credit, per sourceType, per cont (parametri cheie: brandId*, startDate, endDate)
- get_accounting_sync_status — Starea conexiunii cu Symbai Accounting: conectat, module sincronizate, ultima sincronizare, CUI (parametri cheie: brandId*)
- get_accounting_status — Statusul contabil al unui brand (coduri setate / lipsă) (parametri cheie: brandId*)
- get_config_status — Starea configurării (ce e setat și ce nu) (parametri cheie: brandId*, category)
- get_portal_config — Configurația curentă a portalului client (platforma web) (parametri cheie: brandId*, locationId)
- get_reservation_settings — Setările de rezervări pentru o locație/brand (parametri cheie: brandId, locationId)
- get_product_type_details — Detalii tip de produs: proprietăți, conturi contabile globale + overrides per unitate/locație (parametri cheie: productTypeId*, brandId*)
- get_location_context — Context ambiental pentru o locație: vreme (curent + prognoză), sărbători, vacanțe școlare, sezon, weekend (parametri cheie: locationId, date, days)
- get_game_details — Detalii complete joc: informații de bază, program pe zile, prețuri, excepții de date, rezervări existente (parametri cheie: gameId*, date)
- check_game_availability — Verifică disponibilitatea unui joc la o dată/oră/nr. jucători (parametri cheie: gameId*, date*, time*, partySize*, exclusive)
- get_game_slots — Toate sloturile disponibile pentru un joc la o dată (parametri cheie: gameId*, date*, partySize)

#### Analiză + rapoarte — 4
- analyze_food_costs — Analizează food cost-ul produselor unui brand (parametri cheie: brandId*)
- analyze_recipes — Analizează rețetele unui brand: completitudine, costuri, ingrediente lipsă (parametri cheie: brandId*)
- analyze_procurement — Analizează aprovizionarea: furnizori, prețuri, lead time-uri (parametri cheie: brandId*)
- generate_report — Raport financiar inline: food_cost (per produs, status EXCELENT/OK/ATENȚIE/CRITIC), sales_summary (sumar vânzări pe perioadă), stock_value (valoare stoc la cost și la preț de vânzare) (parametri cheie: reportType*, startDate, endDate)

#### Memorie brand + diverse — 5
- read_brand_memories — Citește memoriile brandului (brand voice, target audience, stil vizual) pentru marketing/comunicare (parametri cheie: category)
- read_integration_memory_files — Citește fișierele de memorie ale integrărilor (parametri cheie: fileType, integrationKey)
- browse_brand_media — Caută în biblioteca media a brandului (poze, video, materiale grafice) (parametri cheie: brandId*, mediaType, source, tag, limit)
- lookup_company_cui — Caută datele firmei la ANAF după CUI și le salvează automat în setări (parametri cheie: cui*, brandId)
- explain_feature — Explică o funcționalitate Symbai utilizatorului (parametri cheie: feature*, detail_level)

### Tools de producție, rețete & trasabilitate — 34

#### Rețete (citire bogată: randamente, ingrediente, etichete, BOM) — 6
- get_recipe_details — Detalii complete rețetă: ingrediente cu nume produs, co-produse, etichete, fișă de producție, etape preparare (parametri cheie: recipeId*)
- list_recipe_ingredients — Toate ingredientele unei rețete cu detalii produs (nume, unitate, tip) (parametri cheie: recipeId*)
- get_recipe_labels — Etichetele curente ale unei rețete (parametri cheie: recipeId*)
- get_production_sheet_config — Configurația fișei de producție a unei rețete (parametri cheie: recipeId*)
- run_bom_explosion — Calculează totalul de materii prime necesare pentru o rețetă la o cantitate dată (BOM explosion) (parametri cheie: recipeId*, quantity)
- get_semipreparate_stock — Stocul de semipreparate din loturi finalizate (congelate/refrigerate), cu valabilitate și cantități (parametri cheie: fără parametri)

#### Execuție loturi + trasabilitate — 6
- exec_list_batches — Listează loturile de producție cu filtre: status, dată, rețetă, zonă (parametri cheie: status, dateFrom, dateTo, recipeId, zoneId, limit)
- exec_get_batch_progress — Progresul complet al unui lot: pași de execuție, procent finalizare, materiale, output, pasul următor (parametri cheie: batchId*)
- exec_list_active_operations — Operațiile active (în curs de execuție) din toate loturile (parametri cheie: batchId)
- exec_trace_lot_origin — Trasabilitate inversă: din ce lot de producție, ce ingrediente și ce furnizori provin materiile prime ale unui lot de stoc (parametri cheie: lotId*)
- exec_trace_lot_destination — Trasabilitate directă: unde a ajuns un lot de materie primă — în ce loturi de producție a fost consumat (parametri cheie: lotId*)
- exec_get_lot_qc_status — Statusul QC al unui lot: evenimente hold/release, inspecții, dacă e blocat (parametri cheie: lotId*)

#### Planificare + stocuri — 8
- list_planned_lots — Loturile planificate (pre-producție) — comenzi B2B sau cereri interne care necesită producție (parametri cheie: fără parametri)
- list_mps_schedule — Intrările din planul master de producție (MPS): programări pe stație, dată, tură (parametri cheie: from, to)
- get_mps_net_requirements — Necesarul net de producție: cerere, stoc existent, programat, deficit — per produs/rețetă (parametri cheie: horizonDays)
- get_stock_levels — Stocul curent per produs din toate gestiunile (parametri cheie: productType, warehouseId, onlyLowStock, productName)
- get_orders_summary — Sumar comenzi pe perioadă: câte comenzi, ce produse, în ce cantități (agregat) (parametri cheie: dateFrom, dateTo, status, groupBy)
- get_production_stock_overview — Stocul de semifabricate și produse finite: cantități, loturi, valabilitate, rezervări, cerere (parametri cheie: productTypes)
- list_production_shifts — Turele de producție definite (nume, orar, culoare, activ/inactiv) (parametri cheie: includeInactive)
- get_shift_detail — Detaliile complete ale unei ture pe o zi: angajați, operații, loturi, KPI live (cantități, scrap, % finalizare) (parametri cheie: shiftId*, date*)

#### Calitate + KPI — 10
- list_qc_inspections — Inspecțiile de control calitate: rezultat, tip, defect, lot asociat (parametri cheie: batchId, result, days, limit)
- list_quality_holds — Blocajele de calitate active: loturi blocate, motiv, cine a blocat (parametri cheie: includeReleased)
- get_qc_stats — Statistici QC: rata pass/fail, defecte frecvente, inspecții pe perioadă (parametri cheie: days)
- get_waste_report — Raport pierderi (waste): evenimente, cantități, tipuri, per lot sau global (parametri cheie: days, batchId)
- get_yield_trends — Trendul randamentului pe zile: yield %, waste rate, QC pass rate (parametri cheie: daysBack)
- get_daily_production_summary — Sumar producție pe o zi: loturi finalizate, cantități, QC, waste, angajați activi (parametri cheie: date)
- get_factory_dashboard — Dashboard fabrică: pipeline loturi, status echipamente, livrări azi/mâine, probleme QC, lipsuri materie primă, KPI globale (parametri cheie: fără parametri)
- get_equipment_utilization — Utilizarea echipamentelor: loturi procesate, status (disponibil/în uz/mentenanță), capacitate (parametri cheie: zoneId)
- get_defect_pareto — Analiză Pareto a defectelor: tipuri frecvente, cantități respinse, procent din total (parametri cheie: days)
- detect_production_bottlenecks — Detectează bottleneck-uri: stații supraîncărcate, utilizare vs capacitate, pe orizont temporal (parametri cheie: daysAhead)

#### Infrastructură fabrică (citire) — 4
- list_production_zones — Zonele de producție cu număr de echipamente și rețete asociate (parametri cheie: includeInactive)
- list_production_equipment — Toate echipamentele de producție (cu numele zonei) (parametri cheie: zoneId, includeInactive)
- list_equipment_capacities — Capacitățile configurate pentru un echipament (toate rețetele) sau pentru o rețetă (toate echipamentele) (parametri cheie: equipmentId, recipeId)
- list_zone_warehouse_mappings — Mapările ingrediente↔gestiuni pentru o zonă de producție (parametri cheie: zoneId)

## Analiză dedicată (rapoarte de vânzări & audit) — 5 tool-uri, mereu disponibile

Toate sunt rapoarte fixe, sigure (fără SQL arbitrar, fără date personale ale clienților finali), pe fusul orar Europe/Bucharest. Niciun parametru nu e obligatoriu.

Parametri comuni de perioadă (raport_vanzari, top_produse, vanzari_in_timp, performanta_ospatari):
- `perioada` — enum: azi, ieri, saptamana_aceasta, saptamana_trecuta, luna_aceasta, luna_trecuta, ultimele_7_zile, ultimele_30_zile, custom (default: azi; acceptă și aliasuri EN: today, yesterday, this_week, last_week, this_month, last_month, last_7_days, last_30_days)
- `startDate` / `endDate` — YYYY-MM-DD, doar pentru perioada custom (endDate default = startDate; acceptă și aliasurile dataInceput/dataSfarsit)
- `brandId` — opțional, limitează la un brand (lipsă = toate)
- `locationId` — opțional, limitează la o locație (lipsă = toate)

- raport_vanzari — Raport de vânzări pe perioadă: total încasări, nr. bonuri, bon mediu, bacșiș, reduceri, defalcare pe metodă de plată + comparație automată cu perioada anterioară de aceeași lungime (% creștere/scădere). Pentru „cât am vândut azi/ieri/luna asta", „cash vs card", „cresc sau scad" (parametri: perioada, startDate, endDate, brandId, locationId)
- top_produse — Cele mai vândute produse pe perioadă: cantitate, încasări, în câte bonuri a apărut, pondere în venituri; exclude itemii anulați/returnați (parametri: perioada, startDate, endDate, brandId, locationId + ordine [enum: venituri|cantitate, default venituri], limita [default 10, max 50])
- vanzari_in_timp — Distribuția vânzărilor în timp, pentru tipar și ore/zile de vârf (parametri: perioada, startDate, endDate, brandId, locationId + grupare [enum: zi|ora|zi_saptamana, default zi; „ora" = orele de vârf, „zi_saptamana" = ce zi merge mai bine])
- performanta_ospatari — Vânzările per ospătar/angajat: nr. bonuri, încasări, bon mediu, bacșiș, sortate după venituri (parametri: perioada, startDate, endDate, brandId, locationId + limita [default 20, max 50])
- jurnal_activitate — Citește jurnalul de activitate (audit_logs): CINE a făcut CE și CÂND — anulări, aprobări/respingeri, discount-uri, transferuri, retururi, oferit gratis, plăți, modificări produse/prețuri/setări, stoc, rezervări. Cronologic (vechi→nou), cu câmpurile cand/cine/actiune/entitate/detalii/modificari (diff vechi→nou). Fără filtru de dată întoarce cele mai recente potriviri (parametri: cauta [text liber: masă/ospătar/produs/acțiune], categorie [enum: POS, POS_CLIENT, INVENTORY, PRODUCTION, FINANCE, SETTINGS, STAFF, MENU, CUSTOMERS, SYSTEM, DATA, Rezervări, Contracte, SERVICES_CRM], tipEntitate [ex: order, order_item, operation_request, employee, product, reservation, payment], idEntitate, masa, angajatId, perioada [același enum, opțional], startDate, endDate, brandId, locationId, limita [default 30, max 100])

## SQL (toggle sqlRead pe token) — 3 tool-uri

Workflow obligatoriu în 3 pași, SELECT-only (INSERT/UPDATE/DELETE refuzate), pe DB-ul tenantului:
- list_database_tables — PAS 1: listează tabelele din baza de date POS (doar nume); de folosit când nu știi ce tabel acoperă întrebarea (parametri cheie: filter)
- describe_database_table — PAS 2 (obligatoriu înainte de SELECT pe tabel necunoscut): coloane (nume + tip + nullable), heavyColumns (XML/JSONB mari care explodează contextul) și safeColumns (de folosit în SELECT explicit) (parametri cheie: tableName*)
- execute_sql_query — PAS 3: execută SELECT/WITH strict read-only; reguli: fără SELECT *, coloane explicite din safeColumns, LIMIT obligatoriu (max 1000), WHERE strict; celulele text/jsonb >2000 caractere sunt trunchiate (parametri cheie: query*, explanation*)

## Scriere per modul — 137 tool-uri (gated de writeModules pe token)

### produse_meniu — Produse & Meniuri — 27 tool-uri
- create_product — Creează un produs nou; se pune pe o magazie (warehouseId), zona de depozitare se setează automat; prețul de VÂNZARE se setează doar prin meniuri (add_menu_item), pe produs doar receptionPrice (parametri cheie: name*, brandId*, warehouseId, storageZoneId, receptionPrice, unit, vat, type, …)
- update_product — Actualizează un produs existent (TVA, categorie, furnizor, tip, cont contabil, receptionPrice etc.) (parametri cheie: productId*, name, warehouseId, storageZoneId, receptionPrice, vat, unit, type, …)
- bulk_create_products — Creează mai multe produse deodată (import eficient) (parametri cheie: brandId*, products*)
- bulk_update_products — Actualizează în masă un câmp pe mai multe produse (TVA, unitate, tip, furnizor, preț achiziție) (parametri cheie: productIds*, updates*)
- create_warehouse — Creează o gestiune/magazie nouă (globală, fără brandId) (parametri cheie: name*, locationId*, tag)
- create_storage_zone — Creează o sub-zonă de depozitare într-o magazie (frigider, raft, congelator) (parametri cheie: name*, brandId*, parentId, sortOrder)
- update_storage_zone — Actualizează o zonă de depozitare existentă (parametri cheie: storageZoneId*, name, parentId, warehouseId, sortOrder)
- bulk_create_storage_zones — Creează mai multe sub-zone de depozitare într-o magazie (parametri cheie: brandId*, storageZones*)
- set_initial_stock — Setează stocul inițial al unui produs (cantitatea curentă în inventar) (parametri cheie: productId*, quantity*)
- create_menu — Creează un meniu nou (principal, bar, livrare, kiosk) (parametri cheie: name*, brandId*, description, isActive)
- bulk_create_menus — Creează mai multe meniuri dintr-o dată (un meniu per brand) (parametri cheie: menus*)
- update_menu — Actualizează un meniu existent (nume, status, setări) (parametri cheie: menuId*, brandId*, name, status, isDefault)
- add_menu_item — Adaugă un produs într-un meniu cu preț de vânzare (parametri cheie: menuId*, productId*, price*, sortOrder, isAvailable)
- update_menu_item — Actualizează un menu item (preț, nume, disponibilitate, categorie) (parametri cheie: brandId*, menuItemId*, price, name, available, storageZoneId)
- bulk_update_menu_item_prices — Actualizează prețurile mai multor menu items dintr-o dată, prin potrivire după nume (parametri cheie: brandId*, items*)
- auto_create_menu_from_products — Creează automat un meniu cu produsele care nu sunt în niciun alt meniu (parametri cheie: brandId*, menuName)
- apply_menu_prices — Actualizează prețurile menu items în bulk (parametri cheie: menuId*, prices*)
- create_vat_rate — Creează o cotă TVA (globală, fără brandId) (parametri cheie: name*, rate*, isDefault)
- auto_assign_vat_batch — Clasifică TVA automat cu AI pe produse din DB (parametri cheie: warehouseId, storageZoneId, tag, productType, brandId, onlyMissing, onlyDefault, countryCode)
- create_tag — Creează o etichetă (tag) pentru gruparea produselor — rutare imprimante/KDS, grupare stocuri, filtrare meniu (parametri cheie: name*, brandId*, color, description, entityTypes)
- update_tag — Actualizează o etichetă existentă (nume, culoare, descriere) (parametri cheie: tagId*, name, color, description)
- assign_tag — Asignează o etichetă la un produs/entitate — pentru rutare comenzi la imprimante/KDS și grupare stocuri (parametri cheie: tagId*, entityId*, entityType)
- bulk_assign_tag — Asignează un tag la TOATE produsele/entitățile care corespund filtrelor (parametri cheie: tagId*, entityType, brandId, menuId, menuName, locationId, warehouseId, storageZoneId, …)
- bulk_remove_tag — Elimină un tag de la toate produsele/entitățile care corespund filtrelor (parametri cheie: tagId*, entityType, brandId, menuId, menuName, locationId, warehouseId, menuCategoryId, …)
- auto_tag_from_menu_categories — Creează automat taguri din categoriile de meniu și le asignează produselor corespunzătoare (parametri cheie: brandId*, menuId, color)
- create_allergen — Creează un alergen (ex: Gluten, Lactate, Ouă) (parametri cheie: name*, brandId*, code)
- set_product_allergens — Setează alergenii unui produs (parametri cheie: productId*, allergenIds*)

### retete — Rețete — 9 tool-uri
- create_recipe — Creează o rețetă nouă de producție (parametri cheie: name*, productId, brandId, yield, prepTime, storageType, shelfLife, shelfLifeFrozen, …)
- update_recipe — Actualizează o rețetă existentă (parametri cheie: recipeId*, name, yield, prepTime, storageType, shelfLife, shelfLifeFrozen, station, …)
- add_recipe_ingredients — Adaugă ingrediente la o rețetă (parametri cheie: recipeId*, ingredients*)
- remove_recipe_ingredient — Șterge un ingredient dintr-o rețetă (parametri cheie: ingredientId*)
- bulk_replace_recipe_ingredients — Înlocuiește toate ingredientele unei rețete dintr-o dată (parametri cheie: recipeId*, ingredients*)
- add_recipe_outputs — Adaugă output-uri (produse finite, co-produse, subproduse) la o rețetă (parametri cheie: recipeId*, outputs*)
- remove_recipe_output — Șterge un co-produs (output) dintr-o rețetă (parametri cheie: outputId*)
- set_recipe_labels — Setează/actualizează etichetele unei rețete (parametri cheie: recipeId*, labels*)
- set_production_sheet_config — Configurează fișa de producție pentru o rețetă (informațiile de pe fișa tipărită) (parametri cheie: recipeId*, config*)

### productie — Producție — 22 tool-uri
- exec_create_batch — Creează un lot de producție nou (parametri cheie: recipeId*, plannedQty*, scheduledDate, assignedTo, zoneId, equipmentId, storageType, notes, …)
- exec_update_batch — Actualizează un lot de producție existent (parametri cheie: batchId*, status, plannedQty, actualQty, notes, assignedTo, zoneId, equipmentId, …)
- exec_start_batch — Pornește un lot de producție (status 'started' + data pornirii) (parametri cheie: batchId*)
- exec_stop_batch — Oprește temporar un lot (pauză) (parametri cheie: batchId*, reason)
- exec_resume_batch — Reia un lot oprit/în pauză (parametri cheie: batchId*)
- exec_complete_batch — Finalizează un lot: status 'completed', cantitate reală, data finalizării (parametri cheie: batchId*, actualQty)
- exec_reschedule_batch — Reprogramează un lot la o nouă dată (parametri cheie: batchId*, newDate*, reason)
- exec_declare_consumption — Declară consumul de materii prime pentru o operație în curs (parametri cheie: operationExecutionId*, items*, employeeId)
- exec_declare_output — Declară producția (output) unei operații: cantitate bună, rebut, de prelucrat (parametri cheie: operationExecutionId*, qtyGood*, qtyScrap, qtyRework, employeeId)
- create_mps_entry — Creează o intrare în planul master de producție (MPS) (parametri cheie: scheduledDate*, plannedQty*, stationId, recipeId, shiftNumber, status)
- update_mps_entry — Actualizează o intrare MPS (cantitate, status, stație, tură) (parametri cheie: entryId*, stationId, recipeId, scheduledDate, shiftNumber, plannedQty, status)
- create_production_shift — Creează o tură de producție (ex: Dimineață 06:00-14:00) (parametri cheie: name*, shortName*, startTime*, endTime*, color, efficiencyPercent, sortOrder)
- update_production_shift — Actualizează o tură de producție (nume, orar, culoare, activ, eficiență) (parametri cheie: shiftId*, name, shortName, startTime, endTime, color, isActive, sortOrder, …)
- create_shift_assignment — Asignează un angajat la o tură de producție într-o zi (parametri cheie: shiftId*, employeeId*, date*, notes)
- create_quality_hold — Pune un blocaj de calitate (quality hold) pe un lot de inventar (parametri cheie: lotId*, eventType*, reasonCode, notes, heldBy)
- release_quality_hold — Eliberează un blocaj de calitate (parametri cheie: holdId*, releasedBy*, notes)
- create_production_zone — Creează o zonă de producție (Bucătărie Caldă, Patiserie, Preparare Rece) (parametri cheie: name*, description, locationId, brandId)
- update_production_zone — Actualizează o zonă de producție (parametri cheie: zoneId*, name, description, active)
- create_production_equipment — Adaugă un echipament nou într-o zonă de producție (parametri cheie: name*, zoneId*, type, status, capacityUnit, notes, allowMultipleOps)
- update_production_equipment — Actualizează un echipament de producție (parametri cheie: equipmentId*, name, type, zoneId, status, capacityUnit, notes, active, …)
- set_equipment_recipe_capacity — Setează capacitatea unui echipament pentru o rețetă (max per lot, timp ciclu, timp setup) (parametri cheie: equipmentId*, recipeId*, maxQtyPerBatch, cycleTimeMinutes, setupTimeMinutes)
- assign_recipe_to_zone — Asociază o rețetă cu o zonă de producție (parametri cheie: recipeId*, zoneId*)

### personal — Personal & Ture — 15 tool-uri
- create_employee — Creează un angajat nou cu toate detaliile (parametri cheie: firstName*, lastName*, brandId*, roleId, email, phone, locationId, position, …)
- update_employee — Actualizează un angajat (nume, rol, poziție, salariu, contract, PIN etc.) (parametri cheie: employeeId*, firstName, lastName, email, phone, roleId, locationId, position, …)
- bulk_create_employees — Creează mai mulți angajați dintr-o dată (import Revisal/Excel) (parametri cheie: brandId*, employees*, locationId)
- create_role — Creează un rol nou cu permisiuni (parametri cheie: name*, brandId*, permissions)
- update_role — Actualizează un rol existent (nume, permisiuni) (parametri cheie: roleId*, brandId*, name, permissions)
- set_role_permissions — Modifică permisiunile unui rol: adaugă, șterge sau setează complet lista (parametri cheie: roleId*, permissions, addPermissions, removePermissions)
- seed_default_roles — Creează automat setul de roluri prestabilite pentru un tip de business (parametri cheie: brandId*, businessType*)
- create_shift — Creează o tură de lucru; pentru ospătari include sectionName + floorConfigId pentru rutarea comenzilor QR (parametri cheie: employeeId*, date*, startTime*, endTime*, brandId*, locationId*, floorConfigId, sectionId, …)
- update_shift — Actualizează o tură existentă (ore, locație, secțiune, status) (parametri cheie: shiftId*, startTime, endTime, date, locationId, floorConfigId, sectionId, sectionName, …)
- bulk_create_shifts — Creează mai multe ture dintr-o dată (pontaj pe o săptămână) (parametri cheie: shifts*, locationId)
- create_staff_schedule — Creează o intrare de program planificat (șablon de tură recurentă) (parametri cheie: employeeId*, scheduledStart*, scheduledEnd*, locationId, floorConfigId, status)
- bulk_create_staff_schedules — Creează mai multe intrări de program dintr-o dată (parametri cheie: schedules*, status)
- create_task_list — Creează o listă de sarcini (checklist operațional) (parametri cheie: title*, brandId*, role, shift, isTemplate)
- create_task — Creează o sarcină individuală într-o listă (parametri cheie: taskListId*, title*, description, assignedTo, priority, dueDate)
- bulk_create_tasks — Creează mai multe sarcini într-o listă dintr-o dată (parametri cheie: taskListId*, tasks*)

### rezervari_clienti — Rezervări & Clienți — 7 tool-uri
- create_reservation — Creează o rezervare de masă (parametri cheie: brandId*, customerName*, guestCount*, date*, time*, locationId, tableId, customerPhone, …)
- update_reservation — Actualizează o rezervare (status, dată, oră, nr. persoane, note) (parametri cheie: reservationId*, brandId, status, guestName, guestPhone, guestEmail, partySize, date, …)
- cancel_reservation — Anulează una sau mai multe rezervări (parametri cheie: reservationId, reservationIds, reason)
- create_waitlist_entry — Adaugă un client pe lista de așteptare (walk-in fără rezervare) (parametri cheie: guestName*, partySize*, brandId, locationId, guestPhone, estimatedWait, notes)
- update_waitlist_entry — Actualizează o intrare din lista de așteptare (status, timp estimat) (parametri cheie: entryId*, status, estimatedWait, notes)
- create_customer — Creează un client în baza de date (fidelizare, rezervări, istoric comenzi) (parametri cheie: brandId*, firstName*, lastName, email, phone, birthDate, notes, loyaltyPoints, …)
- create_game_reservation — Creează o rezervare de joc: jucători, copii/adulți, contact, exclusivitate, preț (parametri cheie: gameId*, date*, startTime*, endTime*, partySize*, contactName*, childrenCount, adultsCount, …)

### marketing_social — Marketing & Social Media — 4 tool-uri
- schedule_social_post — Creează și programează o postare social media (Facebook, Instagram, TikTok, YouTube, LinkedIn, Google Business); cu scheduledAt în viitor se publică AUTOMAT la ora respectivă, fără scheduledAt rămâne draft (parametri cheie: brandId*, content*, platforms*, scheduledAt [ISO 8601], mediaUrls, postType [post|story|reel|carousel], firstComment)
- cancel_social_post — Anulează o postare programată sau draft (și failed/retry_pending); nu poate anula postări deja publicate (parametri cheie: postId*)
- genereaza_link_conectare — Generează link-ul OAuth de conectare pentru o platformă socială sau pentru contul de reclame Meta; utilizatorul îl deschide în browserul lui și aprobă, tokenul ajunge direct pe server (nu prin chat), link valabil ~10 minute; Instagram NU are link separat — vezi conecteaza_instagram_din_facebook (parametri cheie: platforma* [facebook|tiktok|youtube|linkedin|google_business|meta_ads], brandId)
- conecteaza_instagram_din_facebook — Leagă contul Instagram Business folosind pagina de Facebook deja conectată — execută legarea direct, fără link separat; cere cont IG de tip Business/Creator asociat paginii FB (parametri cheie: brandId)

### financiar — Financiar & Contabilitate — 6 tool-uri
- create_expense — Înregistrează o cheltuială (chirie, utilități, reparații, diverse) pentru evidența financiară și P&L (parametri cheie: brandId*, category*, amount*, description, date, recurring, recurrenceInterval, supplierId, …)
- create_product_type — Creează un tip de produs nou cu proprietăți și conturi contabile (parametri cheie: brandId*, code*, name*, description, canSell, canConsume, hasStock, hasRecipe, …)
- update_product_type — Actualizează proprietățile unui tip de produs (canSell, hasStock, hasRecipe etc.) și/sau conturile contabile (parametri cheie: productTypeId*, brandId*, name, description, canSell, canConsume, hasStock, hasRecipe, …)
- update_product_type_accounts_per_unit — Setează conturile contabile ale unui tip de produs DOAR pentru o anumită unitate (brand+locație) (parametri cheie: productTypeId*, brandId*, locationId*, accounts*)
- create_accounting_account — Adaugă un cont contabil nou în planul de conturi (parametri cheie: brandId*, code*, name*, type*, parentCode)
- apply_accounting_codes — Aplică coduri contabile în bulk pe produse (parametri cheie: assignments*)

### furnizori — Furnizori — 4 tool-uri
- create_supplier — Creează un furnizor nou cu date complete (contact, CUI, adresă, termene plată, zile livrare, IBAN) (parametri cheie: name*, brandId*, contactPerson, email, phone, cui, regCom, address, …)
- update_supplier — Actualizează datele unui furnizor existent (parametri cheie: supplierId*, name, contactPerson, email, phone, cui, regCom, address, …)
- create_supplier_product — Adaugă un produs în catalogul furnizorului (preț, unitate, cantitate minimă de comandă) (parametri cheie: supplierId*, name*, supplierSku, unit, price, currency, minOrderQty, vatRate, …)
- create_supplier_product_mapping — Mapează un produs din catalogul furnizorului la un produs intern Symbai (aprovizionare automată) (parametri cheie: supplierProductId*, productId*, priorityOrder, isPreferred, notes)

### setari — Setări & Configurare — 45 tool-uri
- create_brand — Creează un brand nou în sistem (parametri cheie: name*, color, tagline, description, socialMedia, colors)
- update_brand — Actualizează un brand (culoare, identitate, social media, tagline, setări) (parametri cheie: brandId*, name, color, tagline, description, socialMedia, colors)
- create_location — Creează o locație nouă și o asociază cu unul sau mai multe branduri (parametri cheie: name*, brandId, brandIds, address, city, phone)
- update_location — Actualizează informațiile unei locații (parametri cheie: locationId*, name, address, city, phone)
- link_brand_location — Asociază branduri cu locații (many-to-many) (parametri cheie: brandId, brandIds, locationId, locationIds)
- unlink_brand_location — Dezasociază (șterge legătura) branduri de locații (parametri cheie: brandId, brandIds, locationId, locationIds)
- update_company — Actualizează manual datele companiei (CUI, adresă, date fiscale, bancă) (parametri cheie: brandId*, name, cui, regCom, address, city, county, bankName, …)
- create_floor_zone — Creează o zonă/salon în restaurant (parametri cheie: name*, brandId*, locationId*, color)
- update_floor_zone — Actualizează o zonă de sală (nume, culoare, capacitate) (parametri cheie: zoneId*, brandId*, name, color)
- create_floor_table — Creează o masă într-o zonă (parametri cheie: zoneId*, tableNumber*, seats*, brandId*, shape)
- update_floor_table — Actualizează o masă (număr, locuri, formă, poziție) (parametri cheie: tableId*, brandId*, name, seats, shape)
- bulk_create_floor_tables — Creează mai multe mese dintr-o dată într-o zonă (parametri cheie: zoneId*, prefix*, count*, brandId*, seats, shape, startNumber)
- bulk_assign_tables_to_zone — Asignează mai multe mese la o zonă (salon/terasă) (parametri cheie: zoneId*, tableIds, locationId, unassignedOnly)
- create_floor_config — Creează o configurație de sală per locație (iarnă, vară cu terasă, weekend) (parametri cheie: name*, brandId*, locationId*, zoneIds, description, configData, active)
- duplicate_floor_config — Duplică o configurație de sală (layout, raioane, mese) la aceeași locație sau alta (parametri cheie: sourceFloorConfigId*, name, targetLocationId, targetBrandId, copySchedules)
- create_floor_config_schedule — Programează o configurație de sală pe o zi a săptămânii per locație (parametri cheie: brandId*, dayOfWeek*, floorConfigId*, locationId*)
- add_sections_to_config — Adaugă raioane (secțiuni de ospătari) la o configurație existentă (parametri cheie: floorConfigId*, sections*)
- assign_tables_to_section — Asignează mese la un raion dintr-o configurație (parametri cheie: floorConfigId*, sectionId*, tableDbIds*)
- add_zones_to_config — Adaugă zone existente la o configurație de sală (parametri cheie: floorConfigId*, zoneIds*)
- configure_pos_settings — Configurează setările POS pentru un brand (parametri cheie: brandId*, settings)
- create_payment_method — Configurează o metodă de plată (parametri cheie: name*, type*, brandId*, isActive)
- create_printer — Configurează o imprimantă (termică, fiscală, de rețea) (parametri cheie: name*, type*, brandId*, ipAddress, locationId)
- create_kds_screen — Creează un ecran KDS (Kitchen Display System) (parametri cheie: name*, brandId*, locationId)
- create_menu_display_config — Creează o configurare de afișaj meniu pentru POS (POS Mobil Ospătar, Bar, Recepție, Kiosk, Web) (parametri cheie: brandId*, profileType*, name, isDefault, categoryLayout, categorySize, productLayout, productSize, …)
- update_menu_display_config — Actualizează o configurare de afișaj meniu existentă (parametri cheie: configId*, name, isDefault, profileType, config)
- configure_portal_general — Setări generale portal: tip business, nume platformă, autentificare, livrare/pickup (parametri cheie: brandId*, locationId, businessType, portalName, requireLogin, requireDate, allowDelivery, allowPickup)
- configure_portal_appearance — Aspect vizual portal: culori, font, stil butoane/carduri/navigare, border radius (parametri cheie: brandId*, locationId, primaryColor, secondaryColor, accentColor, backgroundColor, textColor, fontFamily, …)
- configure_portal_texts — Textele afișate pe portal: titlu bun venit, subtitlu, butoane (parametri cheie: brandId*, locationId, welcomeTitle, welcomeSubtitle, exploreButton, discoverText, signupButton, signupDescription)
- configure_portal_features — Activează/dezactivează module portal: meniu, comenzi, rezervări, gamificare, social, chat AI, notificări, QR, profil (parametri cheie: brandId*, locationId, menu, orders, reservations, qrCode, profile, attractions, …)
- configure_portal_display — Ce tab-uri, secțiuni home și secțiuni profil sunt vizibile pe portal (parametri cheie: brandId*, locationId, tabs, tabLabels, homeSections, profileSections)
- configure_portal_menu_config — Setările meniului din portal: filtre dietetice, gramaj, alergeni, descrieri, nutriție, imagine hero (parametri cheie: brandId*, locationId, showWeight, showAllergens, showDescription, showNutrition, showCategoryHeaders, menuHeroImage, …)
- configure_reservation_settings — Setările sistemului de rezervări per locație/brand (parametri cheie: brandId*, locationId, enabled, onlineBookingEnabled, autoConfirm, defaultDuration, minPartySize, maxPartySize, …)
- configure_reservation_operating_hours — Programul de operare al rezervărilor pe fiecare zi a săptămânii (parametri cheie: brandId*, locationId, monday, tuesday, wednesday, thursday, friday, saturday, …)
- configure_reservation_turn_times — Duratele de ședere (turn times) pe dimensiune de grup (parametri cheie: brandId*, turnTimes*, locationId)
- configure_reservation_deposit — Cerințele de depozit/avans pentru rezervări (parametri cheie: brandId*, locationId, requireDeposit, depositAmount, depositPercent, largePartyThreshold, largePartyRequiresMenu)
- configure_reservation_pacing — Pacing-ul rezervărilor: câți clienți pot sosi per interval de 15 minute (parametri cheie: brandId*, locationId, maxCoversPer15min, maxPartySize, maxOnlinePartySize, minPartySize)
- seed_reservation_settings — Configurează automat setările de rezervări recomandate pe tipul de business (parametri cheie: brandId*, businessType*, locationId)
- create_delivery_channel — Configurează un canal de livrare (parametri cheie: platform*, brandId*, locationId, isActive)
- create_notification_rule — Creează o regulă de notificare/automatizare (trigger → acțiune) (parametri cheie: name*, brandId*, triggerType*, actionType*, triggerCondition, actionConfig, active)
- create_haccp_sensor — Creează un senzor HACCP de temperatură (frigidere, congelatoare, camere frigorifice) (parametri cheie: name*, locationId*, sensorType, minTemp, maxTemp, mqttTopic, alertEnabled)
- create_cleaning_task — Creează o sarcină de curățenie HACCP (checklist de igienă) (parametri cheie: name*, locationId*, area, frequency, instructions, responsibleRole, checklistItems)
- update_game_config — Modifică configurarea unui joc: categorie, jucători, capacitate, durată slot, rezervări, exclusivitate, vârstă, activ (parametri cheie: gameId*, name, category, description, minPlayers, maxPlayers, minCapacity, maxCapacity, …)
- update_game_schedule — Modifică programul unui joc per zi a săptămânii (parametri cheie: gameId*, dayOfWeek*, openTime*, closeTime*, slotDuration, label)
- update_game_pricing — Adaugă sau modifică prețul unui joc (parametri cheie: gameId*, type*, pricePerSession*, pricingId, pricePerPerson, label)
- set_game_date_override — Setează o excepție de dată pentru un joc: închis, program custom, capacitate diferită (parametri cheie: gameId*, date*, closed, customOpen, customClose, maxCapacityOverride, slotDurationOverride, prepTimeOverride, …)

## Tools speciale — 9 tool-uri

- gaseste_in_aplicatie — [read] Găsește o pagină/funcție în aplicația Symbai după ce vrea utilizatorul („unde văd rapoartele", „cum ajung la setări imprimante"); întoarce pagina + LINK direct (pe subdomeniul tenantului *.symbai.app) + cum ajungi acolo; caută în harta de navigare a aplicației, max 5 potriviri (parametri cheie: intrebare*)
- verifica_integrare — [read] Verifică starea integrării cu un serviciu extern: meta (Facebook + Instagram + cont reclame), facebook, instagram, tiktok, youtube, linkedin, google_business; întoarce checklist structurat — credențiale, cont conectat, token valid (testat LIVE pe API-ul platformei), permisiuni lipsă, cont reclame — cu link unde se rezolvă fiecare lipsă; de rulat ÎNAINTE și DUPĂ fiecare pas de conectare (parametri cheie: serviciu [default meta], brandId)
- trimite_ticket_symbai — [mereu disponibil] Trimite un ticket către ECHIPA SYMBAI: problemă tehnică, reclamație, sugestie de îmbunătățire sau cerere de suport; întoarce o referință (SYM-00042); cu emailContact utilizatorul e anunțat la răspuns/rezolvare; la sugestii folosește dedupeKey (slug stabil) — retrimiterea aceleiași idei se adaugă la ticketul existent; ticketele NU pot fi citite înapoi prin conexiune (parametri cheie: tip* [problema|reclamatie|sugestie|suport], titlu*, descriere*, emailContact, numeUtilizator, dedupeKey)
- list_social_accounts — [read] Listează conturile social media conectate (Facebook, Instagram, TikTok etc.) per brand, fără tokenuri de acces; de folosit înainte de a programa o postare (parametri cheie: brandId)
- list_social_posts — [read] Listează postările social media (draft, programate, publicate) cu status și data programării (parametri cheie: brandId, status [draft|scheduled|publishing|published|failed|cancelled], limit [default 25, max 100])
- schedule_social_post — [write: marketing_social] vezi secțiunea „marketing_social" de mai sus (parametri cheie: brandId*, content*, platforms*, scheduledAt, mediaUrls, postType, firstComment)
- cancel_social_post — [write: marketing_social] vezi secțiunea „marketing_social" de mai sus (parametri cheie: postId*)
- genereaza_link_conectare — [write: marketing_social] vezi secțiunea „marketing_social" de mai sus (parametri cheie: platforma*, brandId)
- conecteaza_instagram_din_facebook — [write: marketing_social] vezi secțiunea „marketing_social" de mai sus (parametri cheie: brandId)

Reguli generale ale conexiunii: începe sesiunile cu `list_brands` + `list_locations` (multe tool-uri cer brandId/locationId); pentru cifre folosește rapoartele dedicate ÎNAINTE de SQL; pentru investigații („cine a făcut X") folosește `jurnal_activitate`. Sume în RON, TVA România 0/11/21%, fus orar Europe/Bucharest.

## Ce NU se poate face prin conexiunea AI (by design)

- **Ștergeri de entități întregi** (produse, branduri, angajați, rezervări întregi etc.) — nu există tool-uri de ștergere; ștergerile se fac doar din aplicație. Excepție: editări de sub-entități (ex. scoți un ingredient dintr-o rețetă).
- **Acțiuni care au sens doar în interfață** — navigarea ghidată pe ecran, dialogurile vizuale, delegarea către agenții de chat din aplicație.
- **Fluxurile tehnologice de producție** (definirea operațiilor, dependențelor, predărilor între stații) și **acțiunile pe containere** (scanare, împărțire/unire) — se fac doar din aplicație.
- **Oferte/promoții, campanii ads, email, blog, SEO, coduri QR** — nu au tool-uri de scriere dedicate; îndrumă utilizatorul către paginile respective (citirea prin SQL rămâne posibilă).
- Orice tool care nu apare în acest catalog nu poate fi apelat — modelul e închis (fail-closed).
