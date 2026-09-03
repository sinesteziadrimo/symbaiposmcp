---
name: briefing-business
description: Briefing periodic al businessului, ca un director de operațiuni — dimineața (ieri + azi), săptămânal, lunar — încasări, P&L, rezervări, forecast, intrări/ieșiri de marfă, casă, personal, marketing, cu concluzie, cifre în tabel și 2–3 propuneri concrete. La „cum stă businessul", „briefing", „ce s-a întâmplat ieri / săptămâna asta", „raport de dimineață", „dă-mi o imagine", „ce ar trebui să fac azi", sau proactiv la începutul unei sesiuni de proprietar.
---

# Briefing-ul de business — ce ar spune un director de operațiuni bun

Scopul: proprietarul sau managerul află în 30 de secunde ce contează, ce s-a schimbat, ce trebuie făcut și ce poți face tu chiar acum. Nu e un „dump" de rapoarte — e o judecată.

Citește întâi `knowledge/personas-utilizatori.md` (cine e omul) și `knowledge/repere-kpi.md` (cu ce compari). Reguli de stil: `knowledge/stil-de-lucru.md`.

## Când îl faci

- **La cerere**: „cum stă businessul", „ce s-a întâmplat ieri", „briefing", „dă-mi o imagine".
- **Proactiv, o singură dată pe sesiune**, când un proprietar/manager deschide sesiunea cu ceva vag („salut", „ce facem azi") sau când ai terminat un task și e prima sesiune din ziua respectivă: propui („vrei briefing-ul de azi? 20 de secunde"). Nu-l impui; nu-l repeta.
- **Periodic**: dacă userul cere „în fiecare dimineață / în fiecare luni", îi spui că o sesiune nu rulează singură; îi oferi două căi reale — un prompt salvat pe care îl rulează el, sau un task programat în clientul lui (Claude Code are programări; Codex nu). Nu promite ce nu poți executa.

## Ordinea de citire (adaptată la verticală)

Ia unitatea în lucru din `list_brands`/`list_locations`; dacă are mai multe și nu a spus care, întreabă o dată sau fă briefing-ul consolidat cu defalcare pe unități.

**Restaurant / bar / QSR / hotel cu restaurant**
1. `raport_vanzari(perioada: ieri)` și `raport_vanzari(perioada: saptamana_aceasta)` — vin cu comparația automată cu perioada anterioară. Reține: total, bonuri, bon mediu, reduceri, cash/card.
2. `get_end_of_day_report(ieri)` — anulări, pe ospătar, bacșiș.
3. `list_open_cash_days` — zile de casă neînchise (risc fiscal; e mereu primul punct de acțiune dacă nu e 0).
4. `get_reservations_overview` — azi și mâine: câte rezervări, câte persoane, waitlist, no-show-uri recente.
5. `list_operation_requests` / `list_stuck_payments` / `list_print_problems` — ce e blocat acum.
6. `check_stock_health` (o dată pe săptămână, nu zilnic) și `get_stock_levels(onlyLowStock: true)`.
7. `list_pending_nirs`, `get_purchases_summary(săptămâna)` — intrări de marfă și ce așteaptă postare.
8. `list_delivery_alerts` dacă are livrări.
9. `get_location_context` — vremea și sărbătorile pentru azi/mâine: influențează rezervările, terasa, livrările, personalul.
10. Lunar: `get_pnl(luna_aceasta)` + `compare_pnl_periods` (profit bridge), `get_menu_engineering`, `get_marketing_scorecard(30)`, `list_expiring_documents(30)`.

**Fabrică**: `get_factory_dashboard` (pipeline, utilaje, livrări, QC, lipsuri) → `get_daily_production_summary(ieri)` → `forecast_production_demand` cu `get_forecast_accuracy` → `get_material_requirements` / `get_batch_material_readiness` pentru loturile de azi → `get_staffing_coverage(azi)` → `list_quality_holds` → `get_b2b_live_deliveries` / `list_b2b_orders` → lunar `get_factory_monthly_close`, `get_production_yield_kpis`, `get_equipment_oee`.

**Construcții**: `list_worksites` (active) → per lucrare `get_worksite_profit` → cozile de aprobat (costuri, jurnale, materiale, change orders) → `list_expiring_documents` → `get_compliance_status`.

**Hotel**: `get_hotel_dashboard_stats` → sosiri/plecări (`list_hotel_reservations`) → `list_hotel_folios` deschise → disponibilitatea următoarelor 7 zile → restaurantul ca mai sus.

**E-commerce**: `list_ecommerce_orders(neexpediate)` → `list_rma_requests` deschise → `get_emag_dashboard` → `audit_shop_health` (săptămânal) → `get_marketing_scorecard`.

Nu chema tot. Dacă unitatea n-are livrări, nu chema livrări. Dacă un tool lipsește din listă, `cauta_tool` o dată; dacă tot lipsește, sari peste și spui la final ce n-ai putut verifica.

## Cum arată briefing-ul

1. **O propoziție de concluzie**: „Ieri a fost o zi bună la Unirii (+12 % față de miercurea trecută), dar ai 3 zile de casă neînchise și marfă expirând mâine."
2. **Tabel scurt** (5–8 rânduri): cifra, comparația, verdictul (✅ / ⚠️ / ❌).
3. **Ce trebuie făcut azi** (max 3, cu proprietar și termen): „Închide zilele de casă 1–3 (eu pot rula închiderea, cu confirmare)".
4. **Ce aș propune** (2–3 idei cu efect estimat): „Marțea e cea mai slabă zi (−35 % față de medie): o ofertă 1+1 la desert pe marți, marjă verificată cu `preview_offer_margin`, ar aduce ~X bonuri în plus dacă rata de conversie e ca la oferta din iunie."
5. **Ce n-am putut verifica** (dacă e cazul), într-o linie.

Fără jargon. Cifrele în tabel, nu în frază. Lungimea: un ecran de telefon pentru zilnic; două pentru săptămânal; lunarul poate fi mai lung, dar cu concluzia sus.

## Cum gândești propunerile (nu generic)

- **Comparația face ideea**: ziua slabă vs media, produsul cu marjă mare care se vinde puțin, canalul cu LTV:CAC sub 3, furnizorul care s-a scumpit, ospătarul cu reduceri peste medie.
- **Verifică fezabilitatea înainte să propui**: o ofertă → `preview_offer_margin` sau `list_offer_suggestions`; o campanie → `preview_email_audience` (câți primesc); un produs nou în meniu → costul din rețetă; forecast → acuratețea lui.
- **Leagă de sezon**: `get_seasonal_calendar` — dacă în 3 săptămâni e Paștele, propunerea e pregătirea meniului și a rezervărilor, nu o reducere la cafea.
- **Fiecare propunere are un buton**: ce poți face tu acum prin conexiune (cu confirmare) și ce rămâne la el.
- **Nu propune ce nu poate**: verifică modulele din `verifica_conexiune`; dacă nu are «Reclame», nu propui boost.

## Memorie între sesiuni (asta face diferența față de un raport)

- **Înainte**: `memorie_citeste(fel: "preferinta")` (cum vrea briefing-ul), `memorie_citeste(fel: "jurnal", limita: 3)` (ce ai spus și ce s-a decis data trecută), `memorie_citeste(fel: "observatie")` (ce e deschis), `memorie_citeste(fel: "decizie")` (ce să NU mai propui).
- **În briefing**: compari cu jurnalul („săptămâna trecută ți-am semnalat X; acum e Y"), verifici deciziile („ai decis fără reduceri pe livrări — s-a respectat: 0 promoții pe Glovo"), semnalezi tiparele din `knowledge/greseli-de-management.md` o singură dată, cu dovadă.
- **După**: `memorie_scrie(fel: "jurnal", cheie: "jurnal-AAAA-LL-ZZ")` cu 3–5 rânduri (concluzia, propunerile, ce a decis); `observatie` pentru ce e nou și deschis; `preferinta` dacă a spus ce vrea să urmărească („vreau mereu food cost și no-show"). Nu salva cifre de zi; salvezi ce e durabil și reperele pe care el le consideră normale („la noi 40 % reduceri de personal e normal").
- Detalii și consimțământ: skill `memorie-business`.

## Capcane

- **Consumul zilnic se generează prin job zilnic**: food cost-ul de ieri poate lipsi dimineața. Spune asta, nu declara food cost 0.
- **Compară pe aceeași zi a săptămânii**, nu ieri cu alaltăieri. `raport_vanzari` compară cu perioada anterioară de aceeași lungime — pentru „ieri" înseamnă alaltăieri; pentru zile de săptămână diferite folosește `custom` cu aceeași zi a săptămânii trecute.
- **O unitate dezactivată sau un brand arhivat** pot apărea cu zero — nu le raporta ca „scădere".
- **Nu trage concluzii din 1 zi**. Tendință = 3 puncte în aceeași direcție.
