# Plan de marketing și strategie

Pentru instrucțiuni operative folosește `condu-marketingul`. Pentru website, CRM și retargeting citește `knowledge/website-marketing-crm.md`.

## Construirea planului

1. Alege rezultatul comercial: comenzi cu contribuție pozitivă, rezervări onorate, clienți noi potriviți sau contracte B2B. Identifică publicul, geografia și capacitatea de livrare/producție.
2. Citește datele disponibile: vânzări, marje, stoc/disponibilitate, CRM, căutări și costuri publicitare. Notează ce lipsește. Nu cumpăra trafic către un formular defect sau o ofertă indisponibilă.
3. Definește mesajul și pagina de destinație pentru intenția respectivă. Restaurantul arată meniul, programul și livrarea; ecommerce arată prețul complet, variantele și returul; fabrica arată gama, capabilitățile publicabile și pasul comercial următor.
4. Propune bugetul din contribuția estimată, cashflow și limita de risc. Procentele din venit și împărțirile 70/20/10 sunt cel mult scenarii de planificare; nu sunt standarde universale și nu justifică singure cheltuiala.
5. Separă achiziția de retenție și retargeting. Măsoară clienții noi și vânzările în plus. O rată mare de conversie pe clienți existenți nu înseamnă automat că retargetingul merită majoritatea bugetului.
6. Pregătește oferta, materialele, excluderile, urmărirea în CRM și experimentul înaintea lansării. Măsoară baseline-ul și stabilește praguri adaptate afacerii.

Planul generat automat este DRAFT. Examinează cifrele, sursele și ipotezele; un procent sau o predicție din șablon nu este o dovadă despre acest client. Folosește instrumentele disponibile pentru previzualizare și execută doar acțiunile autorizate, cu limitele de buget și audiență indicate.

## Ritm de lucru

Revizuiește strategia trimestrial sau când se schimbă piața/capacitatea. Lunar compară rezultatele pe perioade coerente și maturitatea cohortelor. Săptămânal verifică funcționarea paginilor, campaniilor și preluarea cererilor. La volum mic sau ciclu B2B lung, nu forța decizii pe fluctuațiile unei săptămâni.

Pregătește campaniile sezoniere după timpul real pentru producție, aprobare, vânzare și livrare. Ofertele pe interval orar au ore explicite și disponibilitate reală. Înainte de orice promoție verifică marja; înainte de contactare verifică acordul pe canal și plafonul comun de frecvență.

Fiecare propunere de modificare include observația, ipoteza, costul maxim, rezultatul urmărit și criteriul de continuare/oprire. Simulările de buget sunt scenarii, nu garanții de vânzări. Nu muta bani automat doar pentru că o platformă revendică un ROAS mai mare.

## Tool-uri MCP utile
- `generate_quarterly_marketing_plan(brandId, quarter, year, totalBudget?, strategicNote?)` — generează + salvează planul (OKR, buget pe canale, campanii, calendar, riscuri). [marketing]
- `get_quarterly_marketing_plan` / `list_quarterly_marketing_plans` — citește planurile. [citire]
- `apply_quarterly_marketing_plan(planId, confirm:true)` — îl operaționalizează (drafturi reclame + planuri conținut). [marketing]
- `review_quarterly_marketing_plan(planId)` — real vs așteptat + recomandări de realocare. [marketing]
- `get_marketing_scorecard(days, model?)` — înainte de buget: venit atribuit, spend ads, ROAS combinat, LTV:CAC pe canale, cu ipotezele și limitele metricii. [citire]
- `compare_attribution_models(days)` — verifică split-ul pe mai multe modele ca să nu realoci pe last-click umflat. [citire]
- `get_ad_campaign_insights(campaignId, startDate?, endDate?)` — înainte de a opri/scala o campanie: spend, CTR, CPC, CPA, conversii, ROAS, trend zilnic. [citire]
- `set_campaign_budget(campaignId, newDailyBudgetRon, confirm:true)` — schimbă bugetul zilnic; bani reali, confirm-first și respectă plafonul de token. [reclame]
- `what_if_marketing_budget(brandId, baselineSplit, newSplit)` — simulează mutarea bugetului între canale. [citire]
- `get_seasonal_calendar(quarter, year)` — evenimentele sezoniere + lead-time. [citire]
- Pentru diagnostic: `get_attribution_report`, `get_attribution_ltv_by_channel`, `recompute_loyalty_rfm`, `get_email_segment_opportunities`, `raport_vanzari`, `get_menu_engineering`, `read_brand_memories`.
