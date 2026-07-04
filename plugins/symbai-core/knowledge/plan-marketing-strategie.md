# Plan de marketing & strategie (creierul directorului)

## Pe scurt
Un plan de marketing bun nu e o listă de postări — e un lanț de decizii: **cât buget (din venit) → pe ce canale (după ROAS real) → în ce calendar (cu lead-time) → cu ce cadență → cum măsor și realoc**. Symbai are un motor care construiește planul trimestrial cu datele tale reale; rolul tău e să-l ghidezi cu cifre corecte și să-l conduci lunar. Operarea pas-cu-pas e în skill-ul `condu-marketingul`.

## Concepte (numerele de care te ții în 2026)

- **Bugetul total = % din venit, pe etapă** (stabilește-l ÎNTÂI, apoi împarte-l): local nou (0-2 ani) **8-15%** (la lansare reclamele pot urca la 50-60% din buget); stabil (2-5 ani) **5-8%**; matur (5+ ani) **3-6%**.
- **70/20/10** — 70% pe canale dovedite (cu 12+ luni de date), 20% pe canale emergente promițătoare, 10% pe experimente. Fără istoric de atribuire folosește **50/30/20**. Nu tăia niciodată bucata de 10% experiment — acolo găsești următorul canal ieftin.
- **Mixul digital (60-80% din buget)** — benzi orientative HoReCa, dar ponderează pe ROAS-ul TĂU real: social plătit 25-35%, SEO/local 20-30%, email/CRM 10-15%, loialitate 15-20%, sezonier 10-15%, ~5% rezervă.
- **Retenție > achiziție** — o campanie de retenție aduce ~3.3x ROI vs achiziție; emailul are cel mai bun ROI (20:1 până la 40:1). Pune ~70% din bugetul de reclame pe retargeting + lookalike din clienții tăi, nu pe trafic rece.
- **Fiecare canal are UN obiectiv** — *conștientizare* (social organic, conținut, TikTok, GBP), *achiziție* (Google search, Meta trafic/lead, local), *retenție* (email, loialitate, push, WhatsApp, win-back). Nu rula tactici de conversie pe un canal de conștientizare și invers.
- **OKR + MER ca schelet** — orice plan are: target venit (RON), target CAC, target ROAS/MER, + 2-3 KPI secundari (rezervări, raport clienți noi vs reveniți, % venit din email). Măsoară baseline ÎNAINTE de orice schimbare de buget.
- **Reguli de decizie scrise dinainte** — dacă un canal crește CAC cu >25% două luni la rând, taie și realocă; fiecare experiment primește 90 de zile și un prag clar de scalare/oprire.

## Cadența planului
- **Trimestrial** — refaci/revizuiești strategia și realoci 70/20/10.
- **Lunar** — actualizezi calendarul pentru sezon + rulezi reviul de performanță.
- **Săptămânal** — execuți tacticile (postări, reclame, oferte, trimiteri).

## Fluxuri frecvente
- **„Fă-mi un plan pe trimestrul ăsta"** → skill `condu-marketingul`, secțiunea A: citește atribuirea + RFM + vânzările + calendarul, apoi `generate_quarterly_marketing_plan`, prezinți, `apply_quarterly_marketing_plan`.
- **„Cât să pun pe reclame / cum împart bugetul"** → pornește de la % din venit, apoi `get_attribution_ltv_by_channel` ca să vezi unde randează banii, apoi `what_if_marketing_budget` ca să simulezi împărțirea înainte s-o aplici.
- **„Cum merge planul / ce ajustez"** → `review_quarterly_marketing_plan`; sub target cu >15% → realocă spre canalul cu ROAS mai bun.

## Tool-uri MCP utile
- `generate_quarterly_marketing_plan(brandId, quarter, year, totalBudget?, strategicNote?)` — generează + salvează planul (OKR, buget pe canale, campanii, calendar, riscuri). [marketing]
- `get_quarterly_marketing_plan` / `list_quarterly_marketing_plans` — citește planurile. [citire]
- `apply_quarterly_marketing_plan(planId, confirm:true)` — îl operaționalizează (drafturi reclame + planuri conținut). [marketing]
- `review_quarterly_marketing_plan(planId)` — real vs așteptat + recomandări de realocare. [marketing]
- `get_marketing_scorecard(days, model?)` — înainte de buget: venit atribuit, spend ads, ROAS combinat, LTV:CAC pe canale și semnale sub 3. [citire]
- `compare_attribution_models(days)` — verifică split-ul pe mai multe modele ca să nu realoci pe last-click umflat. [citire]
- `get_ad_campaign_insights(campaignId, startDate?, endDate?)` — înainte de a opri/scala o campanie: spend, CTR, CPC, CPA, conversii, ROAS, trend zilnic. [citire]
- `set_campaign_budget(campaignId, newDailyBudgetRon, confirm:true)` — schimbă bugetul zilnic; bani reali, confirm-first și respectă plafonul de token. [reclame]
- `what_if_marketing_budget(brandId, baselineSplit, newSplit)` — simulează mutarea bugetului între canale. [citire]
- `get_seasonal_calendar(quarter, year)` — evenimentele sezoniere + lead-time. [citire]
- Pentru diagnostic: `get_attribution_report`, `get_attribution_ltv_by_channel`, `recompute_loyalty_rfm`, `get_email_segment_opportunities`, `raport_vanzari`, `get_menu_engineering`, `read_brand_memories`.

## Întrebări frecvente și capcane
- **„De unde încep cifra de buget?"** — de la procentul din venit potrivit etapei, NU de la o sumă aruncată. Întâi totalul, apoi împărțirea.
- **„Pun bugetul egal pe canale?"** — nu. Ponderează pe ROAS/LTV real (`get_attribution_ltv_by_channel`). Egal = risipă.
- **„Generez planul și gata?"** — nu. Planul generat e DRAFT; îl prezinți, îl confirmi, îl APLICI, apoi îl revizuiești lunar. Un plan neaplicat și nerevizuit nu produce nimic.
- **„Atac toate canalele odată?"** — secvențiază: email (ieftin) întâi, apoi push reminder, apoi retargeting. Vezi `comunicare-cross-channel-lifecycle.md`.
- **Capcană sezonieră** — nu lansa o campanie de sărbătoare cu câteva zile înainte. Deadline = vârf − fereastra de pregătire (vezi `calendar-sezonier-horeca-ro.md`).
