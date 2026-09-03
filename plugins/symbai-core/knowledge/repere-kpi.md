# Repere KPI — ca să spui „e bine" sau „e rău" în cunoștință de cauză

O cifră fără reper nu e o analiză. Reperele de mai jos sunt ORIENTATIVE (practică din HoReCa, producție, e-commerce și construcții din România și Europa); nu sunt praguri Symbai. Prioritatea comparațiilor: **1) perioada anterioară a aceluiași business** (`raport_vanzari` și `compare_pnl_periods` o fac automat), **2) celelalte unități ale lui**, **3) pragurile configurate în P&L-ul lui** (`get_pnl_config`, `set_pnl_thresholds` — pe fabrici de carne sau confecții metalice pragurile generice nu se aplică), **4) abia apoi reperele de aici**. Spune mereu cu ce compari.

## Restaurant, bar, cafenea, QSR

| KPI | Cum îl iei din Symbai | Reper orientativ | Ce înseamnă când iese din reper |
|---|---|---|---|
| Food cost % (COGS / venit net) | `get_pnl` → food cost % | restaurant 28–35 %; bar/cafenea 20–30 %; QSR 30–38 % | peste: rețete nelegate/consum negenerat (`check_stock_health`) înainte de a acuza prețurile; porții, risipă, furt, preț de vânzare vechi |
| Cost personal % din venit | `get_pnl` → cost personal | 25–35 % (cu tot cu taxe) | peste: ture supradimensionate pe zile slabe (`get_weekday_pnl`), ore suplimentare |
| Prime cost (food + personal) | calcul din `get_pnl` | sub 60–65 % | peste: businessul nu are loc de chirie și profit |
| Marja netă | `get_pnl` | 5–12 % restaurant clasic; QSR/livrare 8–15 % | sub 3 % câteva luni la rând = problemă structurală |
| Bon mediu | `raport_vanzari` | comparat cu perioada anterioară și cu categoria | scade: mix (`get_menu_engineering`), reduceri (`raport_vanzari` → reduceri) |
| Reduceri % din vânzări | `raport_vanzari` | sub 3–5 % | peste: politica de reduceri (`get_discount_policy`), un ospătar (`performanta_ospatari`) |
| Anulări / storno | `get_end_of_day_report`, `jurnal_activitate` | sub 1–2 % din bonuri | peste: erori de preluare, training, sau abuz — audit pe ospătar |
| Rotația mesei / ocupare | `get_table_status`, `vanzari_in_timp` | depinde de format; urmărește vârfurile | ore de vârf fără personal (`vanzari_in_timp` × ture) |
| No-show rezervări | `get_reservations_overview` | 5–15 %; peste 20 % cere avans/confirmare | `configure_reservation_deposit`, reminder automat |
| Zile de casă neînchise | `list_open_cash_days` | 0 | orice zi deschisă = risc fiscal; skill `inchidere-zi-casa` |
| Bacșiș % (unde se urmărește) | `raport_vanzari` | 5–10 % din vânzări la masă | scade brusc: serviciu sau schimbare de proces |

## Livrări (flotă proprie și agregatoare)

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| Timp mediu de livrare | `get_dispatch_analytics` | sub 30–40 min urban | depășiri SLA (`list_delivery_alerts`), zone prea mari |
| Rata de eșec | `get_dispatch_analytics`, `list_failed_deliveries` | sub 2–3 % | motivele din listă: adrese, client absent, livrator |
| Comision agregator | `get_delivery_pnl` | 25–35 % din comandă | verifică marja pe canal (`list_delivery_pnl_segments`) înainte de promoții pe platformă |
| Comenzi respinse / întârziate pe Glovo/Wolt | `list_channel_orders` | aproape 0 | prep time greșit (`explain_delivery_eta`), meniu nesincronizat |

## Producție / fabrică

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| OEE utilaje | `get_equipment_oee` | 60–70 % tipic; 85 % excelent | opriri neplanificate (`list_equipment_downtime`), schimbări de format lungi |
| Randament (yield) | `get_production_yield_kpis`, `get_yield_trends` | față de standardul rețetei/BoM și istoricul lotului | sub istoric: materie primă, proces, cântărire (catch-weight) |
| Rebut / defecte | `get_defect_pareto`, `get_qc_stats` | Pareto: 20 % din cauze fac 80 % din rebut | atacă primele 2–3 cauze, nu lista întreagă |
| Acuratețea forecastului | `get_forecast_accuracy` | MAPE sub 20–25 % pe produse mari e bun | slab: nu recomanda cantități ferme, propune plan de siguranță |
| Acoperire materiale la lansare | `get_batch_material_readiness` | 100 % înainte de start | loturi pornite pe stoc-fantomă = opriri și ore pierdute |
| Cost pe unitate vs standard | `get_production_cost_variance` | abateri sub 5 % | peste: preț de recepție (`scan_suspect_reception_costs`), randament |
| Livrări B2B la timp | `get_b2b_live_deliveries`, `get_b2b_dispatch_readiness` | peste 95 % | rampe/sloturi, șoferi, picking necântărit |

Fabrică de carne / procesare: materia primă domină costul (60–70 % din net); marja netă sănătoasă e mică (2–6 %) — folosește pragurile din template-ul P&L al lui, nu pe cele de restaurant. Confecții metalice / HVAC: material 55–70 %, energie și utilaj semnificative.

## Construcții / lucrări

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| Marja prognozată pe lucrare | `get_worksite_profit` | 10–20 % brut la execuție; mai jos la subcontractare | schimbări de lucrare neaprobate, materiale fără eveniment |
| Cost realizat vs buget | `get_worksite_profit` (buget, ledger, angajamente) | sub 100 % + rezervă 5–10 % | costuri neaprobate vechi (`decide_worksite_cost`) |
| Jurnale zilnice trimise | `decide_worksite_daily_log` (coada) | zilnic pe fiecare lucrare activă | zile fără jurnal = risc la recepție și la litigii |
| Autorizații/acte | `list_expiring_documents` | 0 expirate | reînnoiri cu 30 de zile înainte |

## Hotel

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| Grad de ocupare | `get_hotel_dashboard_stats` | 60–75 % anual e sănătos pentru hotel mic; sezonier variază puternic | comparat cu aceeași perioadă a anului trecut |
| Folio-uri deschise la plecare | `list_hotel_folios` | 0 după check-out | încasări pierdute |
| Oaspeți fideli / reveniri | `get_hotel_loyalty_overview` | crește de la o lună la alta | program de fidelitate inactiv |

## E-commerce

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| Comenzi neexpediate peste 48 h | `list_ecommerce_orders(status)` | 0 | recenzii negative, retururi |
| Rata de retur | `get_rma_kpi_summary` | sub 5 % (mâncare/consumabile mult sub; fashion mai sus) | descrieri înșelătoare, poze slabe |
| Produse fără descriere/poză | `audit_shop_health`, `list_products_without_photo` | 0 pe produsele vizibile | skill `descrieri-produse-seo` |
| Sănătate feed-uri | `audit_shop_health`, `preview_product_feed` | fără erori | produse respinse de Google Shopping |
| MRR / churn (abonamente) | `get_subscriptions_dashboard` | churn lunar sub 3–5 % | dunning (plăți eșuate) neurmărit |

## Marketing și comunicare

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| ROAS combinat | `get_marketing_scorecard` | peste 3 la reclame directe | sub 2: oprește/ajustează campania (`pause_ad_campaign`) |
| LTV:CAC pe canal | `get_marketing_scorecard` | peste 3 | canalul consumă mai mult decât aduce |
| Open rate email | `get_email_analytics_overview` | 20–35 % pe liste proprii, curate | sub 15 %: listă murdară (`check_email_list_health`), domeniu (`get_sender_domain_status`) |
| Click rate email | idem | 2–5 % | conținut sau ofertă slabă |
| Bounce | idem | sub 2 % | listă importată fără curățare |
| Plângeri spam | idem | sub 0,1 % | frecvență prea mare (`check_contact_frequency_budget`) |
| Rating Google | `gbp_reviews_summary` | peste 4,3 cu recenzii recente | răspunde la toate (`gbp_reply_review`), cere recenzii după vizită |
| Clienți reveniți vs noi | `list_customers_360`, `get_marketing_scorecard` | 30–50 % reveniți la restaurant de cartier | retenție (`ruleaza-retentie`) |

## Personal

| KPI | Din Symbai | Reper | Când e problemă |
|---|---|---|---|
| Vânzări per ospătar / oră lucrată | `performanta_ospatari` + ture | comparat între colegi pe aceeași tură | training, raion prea mare/mic |
| Acoperire ture vs vârfuri | `list_shift_assignments` × `vanzari_in_timp` | vârfurile acoperite, orele moarte nu | reprogramare (`gestioneaza-personal`) |
| Sarcini finalizate cu dovadă | `get_task_dashboard` | peste 90 % la checklist-uri de deschidere/închidere | liste fără țintă (nu le vede nimeni) |

## Sezonalitate și context

Înainte să compari o săptămână cu alta: `get_location_context` (vreme, sărbători, vacanțe) și `get_seasonal_calendar` (ce urmează și cu cât timp înainte se pregătește). O scădere de 20 % într-o săptămână cu ploaie și fără sărbători nu e o tendință; o scădere de 10 % trei săptămâni la rând, pe vreme bună, este.
