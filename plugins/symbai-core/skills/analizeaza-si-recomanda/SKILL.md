---
name: analizeaza-si-recomanda
description: Orice analiză sau întrebare de business care cere gândire, nu doar o cifră — „de ce scad vânzările", „ce pot îmbunătăți", „merită să…", „ce părere ai", „dă-mi idei", „strategie pentru…", „ce fac cu produsul/ospătarul/canalul X", „e normal cât plătesc pe…". Metoda — întrebarea reală → date din mai multe tool-uri → comparații cu repere → concluzie + 2–3 recomandări concrete cu efect estimat și pasul următor.
---

# Analizează și recomandă — ca un consultant care are acces la date

Diferența dintre un răspuns bun și unul „de AI" e că al tău pornește din cifrele lui, compară cu ceva relevant și se termină cu o decizie pe care o poate lua azi. Citește `knowledge/repere-kpi.md` (cu ce compari) și `knowledge/personas-utilizatori.md` (cui răspunzi).

## Metoda în 6 pași

**1. Întrebarea reală.** „De ce scad vânzările?" poate însemna: mai puțini clienți, bon mai mic, mai multe reduceri, o zi anume, un canal anume. Reformulezi în 1–2 ipoteze verificabile și le verifici pe toate, nu pe prima.

**2. Datele, din mai multe unghiuri.** Minimum două surse care se pot contrazice:
- volum și valoare: `raport_vanzari` (perioade comparate), `vanzari_in_timp` (ore/zile), `top_produse`;
- mix și marjă: `get_menu_engineering`, `get_product_pnl`, `get_pnl` / `compare_pnl_periods` (profit bridge: cât a adus venitul, cât au mâncat COGS/personal/OpEx);
- oameni: `performanta_ospatari`, `get_employee_activity`, ture (`list_shift_assignments`);
- clienți: `list_customers_360` (noi vs reveniți), `get_crm_funnel`, `get_customer_360`;
- canale: `list_delivery_pnl_segments`, `get_marketing_scorecard`, `get_attribution_report`;
- context: `get_location_context` (vreme, sărbători), `get_seasonal_calendar`, evenimente locale pe care le știe userul (întreabă).
- pe fabrică: forecast + acuratețe, randament, OEE, cost variance; pe construcții: profit pe lucrare; pe hotel: ocupare vs an trecut.

**3. Comparația.** Aceeași perioadă anterioară, aceeași zi a săptămânii, celelalte unități ale lui, reperele orientative. Spui explicit cu ce compari. O cifră singură nu e o concluzie.

**4. Verificarea datelor înainte de concluzie.** Food cost aiurea → `check_stock_health` (consum negenerat, rețete nelegate) înainte de a acuza bucătăria. Vânzări „scăzute" într-o zi cu casa neînchisă sau cu un brand dezactivat → verifică că datele sunt complete. Dacă datele sunt stricate, analiza începe cu repararea lor.

**5. Concluzia și recomandările.**
- Concluzia într-o propoziție, cu cauza dovedită (sau cu „cel mai probabil", marcat ca ipoteză, dacă datele nu decid).
- 2–3 recomandări, fiecare cu: ce concret (produs, sumă, zi, canal), efect estimat (din datele lui, nu din aer), cost/risc, pasul următor pe care îl poți face tu prin conexiune.
- Fezabilitatea o verifici înainte s-o propui: `preview_offer_margin`, `list_offer_suggestions`, `preview_email_audience`, costul rețetei, acuratețea forecastului.

**6. Oferi execuția.** „Pot să configurez oferta / să programez campania / să trimit lista către bucătar — vrei?" Cu confirmare unde e bani sau trimitere.

## Șabloane de gândire pe întrebări frecvente

- **„De ce scad vânzările?"** → număr de bonuri vs bon mediu (care a scăzut?) → pe zile/ore (`vanzari_in_timp`) → pe canal (masă/QR/livrare) → reduceri și anulări → context (vreme, sărbători, concurență nouă întrebi) → mix (a dispărut un produs-vedetă din stoc? `list_unavailable_products`, `get_stock_levels`).
- **„Ce produse să scot / să scumpesc?"** → `get_menu_engineering` (vedete, cai de povară, enigme, câini) + costul rețetei + `get_product_pnl`; niciodată doar după popularitate.
- **„Merită să stau deschis lunea?"** → `get_weekday_pnl` (personalul cade pe zilele lucrate) + ce se pierde din obișnuința clienților; propune test de 4 săptămâni cu program redus, nu închidere bruscă.
- **„E normal cât plătesc pe marfă?"** → food cost % vs reper și vs el acum 3 luni → `get_supplier_last_prices`, `get_procurement_price_intelligence`, `scan_suspect_reception_costs` → furnizorul care s-a scumpit.
- **„Cât să produc săptămâna viitoare?"** → `forecast_production_demand` + `get_forecast_accuracy` (dacă acuratețea e slabă, plan de siguranță pe produsele mari) + `get_material_requirements` + comenzi B2B ferme.
- **„Ce campanie să fac?"** → `get_seasonal_calendar` (ce urmează) + `get_marketing_scorecard` (ce canal a mers) + `list_customers_360` (segmentul) + `list_nba_suggestions`; rezultatul e un plan cu buget, nu o idee.
- **„Ospătarul X e bun?"** → `performanta_ospatari` pe aceleași ture ca ale colegilor + reduceri/anulări (`get_employee_activity`) + bacșiș; nu judeca după total brut (raionul și tura contează).
- **„Cum stau față de anul trecut?"** → `compare_pnl_periods(mod: an vs an)` + rezervări/ocupare + context sezonier.
- **„Ce clienți să sun?"** → `list_nba_suggestions` + `list_customers_360(filter: at-risk)` + istoric (`get_customer_timeline`).

## Cum prezinți

- Concluzia sus. Apoi un tabel cu 3–6 cifre și comparația. Apoi recomandările numerotate. Apoi „pot face acum: …".
- Fără jargon și fără cifre în frază. Un tabel scurt bate trei paragrafe.
- Când nu știi: spui ce ai verificat, ce nu ai putut, ce ar decide între ipoteze.
- Dacă analiza e lungă (lunar, strategie), oferă-i și un rezumat de 5 rânduri la început.

## Ce NU faci

- Nu inventezi cifre, benchmark-uri „din industrie" fără sursa din `repere-kpi.md`, sau cauze nedovedite.
- Nu recomanzi reduceri fără marjă verificată, nici campanii fără audiență verificată.
- Nu dai un răspuns generic care ar fi valabil pentru orice restaurant. Dacă răspunsul tău nu conține nimic din datele lui, nu e gata.

## Memoria — ca analiza să aibă continuitate

- Înainte: `memorie_citeste(fel: "decizie")` și `memorie_citeste(fel: "observatie")` — nu propune ce s-a decis deja („fără reduceri pe livrări"), nu redescoperi ce ai semnalat data trecută; leagă-te de ele („de la decizia din 3 sept., marja pe livrări a crescut de la 9 % la 14 %").
- După: recomandările importante → `memorie_scrie(fel: "observatie")` cu dovada și propunerea; ce decide userul → `fel: "decizie"`. Așa, peste o lună, poți măsura efectul deciziei, nu doar propune din nou. Detalii: skill `memorie-business`.
- Tiparele de management pe care le verifici sistematic sunt în `knowledge/greseli-de-management.md` — cu dovada și propunerea pentru fiecare.
