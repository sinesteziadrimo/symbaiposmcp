# Măsurare Marketing și Atribuire

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare. Pentru reclame vezi și `knowledge/reclame-playbook-2026.md`, pentru email `knowledge/email-marketing.md`.

## Pe scurt

Acesta e playbook-ul „analistului de marketing": cum afli ce canal aduce de fapt bani, nu doar click-uri. Există trei niveluri de adevăr, în ordinea încrederii: **atribuirea** (îți dă direcția — ce canal pare să tragă), **MMM-lite** (verificare de bun-simț, vânzări vs. cheltuială pe săptămâni) și **incrementalitatea / holdout** (adevărul real — cât ai fi vândut oricum dacă opreai canalul). Regula de aur: arată MEREU cel puțin **2 modele de atribuire una lângă alta**, pentru că un singur model minte. Platformele de reclame (Meta/Google/TikTok) își umflă ROAS-ul raportat de **~2,3 ori** — niciodată nu lua decizia de buget doar pe cifra lor.

Claude lucrează cu cifre, în lei, și spune onest unde e estimare și unde e dovadă. Verifică MER, CAC, LTV:CAC pe datele reale din Symbai (POS + loialitate), nu pe „senzații".

## Concepte

- **Cele 3 niveluri de adevăr (în ordinea încrederii):**
  1. **Atribuire** = direcție și diagnostic zilnic. Bună ca să clasezi canalele, slabă pentru decizia finală de buget.
  2. **MMM-lite** = verificare de sus în jos. Pui pe săptămâni: vânzări vs. cheltuială pe canal + sezon + vreme/sărbători, și vezi ce contribuie marginal fiecare canal. E plasa de siguranță peste atribuire.
  3. **Incrementalitate (holdout)** = adevărul. Oprești reclama pe o felie de 10-20% din public/zonă timp de **6 săptămâni** (NU 2 — fereastra scurtă e motivul #1 pentru care primul test eșuează) și compari grupul expus cu cel ținut pe dinafară. Diferența = lift-ul real.
- **Last-click umflă jos-pâlnia.** Modelul „ultimul click ia tot meritul" supra-creditează căutarea pe nume de brand și retargetingul (oameni care oricum cumpărau). Pune-l mereu lângă **time-decay** (meritul scade cu cât clickul e mai vechi) ca să vezi diferența. Dacă cele două modele dau ordine foarte diferite ale canalelor, asta E semnalul important.
- **Platformele umflă ROAS ~2,3x.** Media pe 200+ branduri (2025-26): ROAS raportat de platformă e de ~2,3 ori mai mare decât cel real. Companiile cu atribuire corectă văd ROI cu **15-30% mai mare**.
- **LTV:CAC — ținta minimă 3:1; payback sub 60-90 zile.** Sub 3:1 pierzi marjă; peste 5:1 înseamnă că INVESTEȘTI prea puțin în creștere. HoReCa e special: bon mic (30-80 lei) dar repetabil (2-4 vizite/lună) împinge LTV:CAC mult peste software generic — un local bine condus poate ajunge la 20-60x, pentru că un client mulțumit aduce 2-3 alții. **CAC** = (cheltuială reclame + cost promo) ÷ clienți noi în perioadă. **LTV** = bon mediu × frecvență vizite × luni reținut × marjă brută %. Bugetul de marketing sănătos = **3-6% din venit**. Orice scalare de canal se aprobă doar dacă payback < 60-90 zile.
- **KPI email după Apple MPP — uită deschiderile brute.** Apple Mail + proxy Gmail + roboți umflă rata de deschidere cu **15-20 puncte** (un 28% real apare ca 52%) fără ca click-urile/conversiile să se schimbe — creșterea e fantomă. Stiva corectă 2026: **click rate** (imun la MPP), **RPR = venit pe destinatar**, **rata de comenzi plasate**, bounce, plângeri spam. Bandă sănătoasă de open 30-35% (tratează cu suspiciune), click-to-conversion ~9%. Fereastra de atribuire venit = **7 zile după click**. ROI email ajunge la ~45 lei la 1 leu cheltuit.
- **Dashboard pentru patron: 10-15 KPI maxim, din care 5-8 de rezultat.** Stratul executiv (venit, ROI, CAC, ROAS combinat, mix client-nou-vs-revenit) trebuie citit în sub 2 minute. Cadența: timp real pentru reclame active, zilnic pentru operațional, **săptămânal** pentru marketing/SEO/conținut. Te uiți la **variația** față de țintă și față de perioada anterioară, nu la cifra brută. Adaugă și indicatori de viitor (rezervări pe următoarele 7-14 zile). Dacă un KPI nu declanșează o decizie, scoate-l.
- **MMM-lite pentru HoReCa.** Când ai mai multe canale dar ești sub ~1M$/an cheltuială, faci o regresie ușoară: vânzări săptămânale vs. cheltuială pe canal + sezon + vreme/sărbători. E verificarea de sus-în-jos care trebuie să se împace cu atribuirea (jos-în-sus) și cu testul de incrementalitate (adevărul de teren). Cele trei împreună = „măsurare unificată" pe înțelesul unui local.

## Fluxuri frecvente

### 0. Tool order rapid (MCP live)
1. „Cum stă marketingul?" → `get_marketing_scorecard(days, model?)` pentru venit atribuit, spend ads, ROAS combinat și canale cu LTV:CAC sub 3.
2. „Care model de atribuire e corect?" → `compare_attribution_models(days)`; arată cel puțin două modele, de preferat last-click lângă time-decay.
3. „Cum merge campania X?" → `get_ad_campaign_insights(campaignId, startDate?, endDate?)` pentru spend, CTR, CPC, CPA, conversii, ROAS și trend zilnic; `get_ad_campaign_status` rămâne pentru publicare/erori Meta.
4. „Pot să contactez clientul X?" → `check_contact_frequency_budget(customerId, brandId?)` înainte de mesaj; respectă verdictul pe canal.

### 1. Scorecard săptămânal pentru patron (8 KPI de rezultat)
1. `list_brands` → afli brandId.
2. Tragi cifrele: `get_marketing_scorecard` + `compare_attribution_models` + `raport_vanzari` (venit POS real) + `get_pnl` (profit). Dacă ai nevoie de detaliu pe canal, completează cu `get_attribution_report` + `get_attribution_ltv_by_channel`.
3. `compare_pnl_periods` pentru **variația** față de perioada anterioară.
4. Prezinți patronului 8 KPI cu semafor (verde/galben/roșu): ROAS combinat, CAC, LTV:CAC, marketing ca % din venit, mix client-nou-vs-revenit, RPR email, rezervări pe 7-14 zile, profit — fiecare cu „ce facem săptămâna asta".

### 2. Clasare onestă a canalelor (mereu ≥2 modele)
1. `get_attribution_report` pe 30 zile → arăți canalele.
2. Lângă el, al doilea model (time-decay) ca să vadă patronul **diferența** față de last-click. (Dacă tool-ul întoarce un singur model, ceri al doilea unghi din pagina de Atribuire în aplicație și pui cele două tabele alături.)
3. `get_attribution_ltv_by_channel` pentru calitatea LTV pe canal (un canal poate aduce mulți clienți, dar de valoare mică).
4. Clasezi canalele după **LTV:CAC** și marchezi cu roșu orice e sub 3:1 sau cu payback peste 90 zile.
5. Spui explicit: „last-click supra-creditează căutarea pe nume și retargetingul, iar ROAS-ul de pe platformă e ~2,3x umflat — de aceea nu mutăm bugetul doar pe el."

### 3. Test de incrementalitate (cel mai puternic test de încredere)
1. `list_ad_campaigns` → identifici canalul plătit cel mai mare (de obicei Meta în 2026).
2. Propui patronului un **holdout de 6 săptămâni** pe 10-20% din public sau dintr-o zonă geografică — adică ții reclama oprită pe felia aceea.
3. Configurarea testului de tip „lift" se face **din aplicație / din platforma de reclame** (test nativ Meta/Google/TikTok); aici nu există un tool care creează holdout-ul.
4. După 6 săptămâni compari conversiile/venitul grupului expus vs. cel ținut pe dinafară — diferența = lift-ul real (lei incrementali). `get_attribution_ltv_by_channel` și `raport_vanzari` pe segmentul expus vs. holdout ajută la cifre.
5. Compari iROAS-ul măsurat cu ROAS-ul raportat de platformă (te aștepți să fie de ~2,3x mai mic) și recomanzi scalare sau tăiere. Hrănești rezultatul înapoi în interpretarea atribuirii data viitoare.

### 4. ROI email rezistent la MPP
1. `get_email_campaign_analytics` → cifrele campaniei.
2. `get_email_conversion_attribution` cu fereastră de **7 zile** după click → venit atribuit real.
3. Dacă vezi click-uri fără conversii, rulezi reconcilierea (`reconcile_email_conversions`).
4. Raportezi pe **click rate + RPR + comenzi plasate + plângeri** — NICIODATĂ pe deschideri brute.
5. `get_email_ab_test_report` ca să fixezi varianta câștigătoare cu o regulă clară de oprire.

### 5. Realocare buget pe LTV:CAC (apărarea deciziei)
1. `get_attribution_ltv_by_channel` + `get_attribution_report` → calculezi split-ul curent și LTV:CAC pe canal.
2. `get_pnl` + `compare_pnl_periods` → confirmi că profitul ține pasul, nu doar veniturile.
3. Propui mutarea bugetului dinspre canalele saturate / cu iROAS mic spre cele cu LTV:CAC bun și payback rapid.
4. Aplici noile bugete prin tool-urile de reclame ale canalului (vezi `knowledge/reclame-playbook-2026.md`), cu confirmare.

## Tool-uri MCP utile

Toate sunt de **citire** [citire] — măsurarea nu cheltuie și nu trimite nimic, deci nu cer `confirm:true`. (Mutarea efectivă a bugetului se face cu tool-urile de reclame, care au confirmare.)

- `get_attribution_report` — raport de atribuire pe canal (direcția: ce canal pare să aducă comenzi/venit). Param: brandId, perioadă. Pune-l mereu lângă un al doilea unghi.
- `get_attribution_ltv_by_channel` — LTV și calitatea clienților aduși de fiecare canal; baza calculului LTV:CAC. Param: brandId, perioadă.
- `get_marketing_scorecard` — scorecard executiv pe ultimele N zile: venit atribuit, spend ads, ROAS combinat, canale și semnal LTV:CAC < 3. Primul tool pentru „cum stă marketingul".
- `compare_attribution_models` — comparație last/first/linear/time_decay/position pe aceleași date. Folosește-l ca să nu decizi bugetul pe un singur model.
- `get_ad_campaign_insights` — metrici reale pe campanie: spend, afișări, click-uri, CTR, CPC, CPM, conversii, CPA, ROAS și defalcare pe zile. Primul tool înainte de pauză/scalare.
- `check_contact_frequency_budget` — câte mesaje a primit un client în 24h/7d pe email/SMS/WhatsApp/push și dacă mai poți trimite pe canalul respectiv.
- `get_email_conversion_attribution` — leagă click-urile din email de comenzile/rezervările POS, fereastră 7 zile; venit real, nu deschideri. Param: brandId/campaignId, fereastră.
- `get_pnl` — profit și pierdere real, ca să măsori marketingul pe profit, nu doar pe venit. Param: brandId, perioadă.
- `compare_pnl_periods` — compară două perioade pentru **variație** (lună vs. lună, an vs. an); inima dashboard-ului săptămânal. Param: brandId, cele două perioade.
- `raport_vanzari` — vânzări POS reale (bonuri încasate la casă/online). Sursa de adevăr pentru CAC și pentru lift-ul pe segmentul expus vs. holdout.
- `get_sales_analytics` — analiză de vânzări din zona **deal-uri / pipeline CRM** (oferte de evenimente, catering), NU bonuri POS. Folosește-l doar pentru lumea de vânzări B2B/evenimente.
- `get_email_campaign_analytics`, `get_email_ab_test_report`, `reconcile_email_conversions` — KPI email post-MPP, varianta câștigătoare, recuperare click-fără-conversie.
- `top_produse`, `vanzari_in_timp` — context de produs și evoluție în timp pentru stratul MMM-lite.
- Pentru context strategic: `get_marketing_scorecard` + `compare_attribution_models` + `get_attribution_ltv_by_channel` intră direct în planul trimestrial (`generate_quarterly_marketing_plan`, `what_if_marketing_budget`) — vezi `knowledge/strategie-marketing-plan.md`.

## Întrebări frecvente și capcane

- **Care e diferența dintre `raport_vanzari` și `get_sales_analytics`?** Capcană frecventă. `raport_vanzari` = bonuri reale POS (mâncare/băutură încasate). `get_sales_analytics` = lumea **deal-urilor și a pipeline-ului CRM** (oferte de evenimente, petreceri, catering, B2B). Dacă întrebarea e „cât am vândut la casă", folosești `raport_vanzari`; dacă e „cum stă pâlnia de evenimente", folosești `get_sales_analytics`. Nu le amesteca într-un singur total — măsoară lucruri diferite.
- **Pot să iau decizia de buget pe ROAS-ul din Meta/Google?** Nu singur. ROAS-ul de platformă e umflat ~2,3x. Îl folosești ca să clasezi și să diagnostichezi zilnic, dar decizia de a mări bugetul se ia pe LTV:CAC + un test de holdout, nu pe cifra platformei.
- **De ce două modele de atribuire, nu unul?** Pentru că orice model singur are o părtinire. Last-click umflă jos-pâlnia (căutare pe nume, retargeting). Pus lângă time-decay, patronul vede „spread-ul" și înțelege că reclamele de sus-de-pâlnie (awareness) sunt sub-creditate de last-click. Dacă arăți un singur model, induci în eroare.
- **De ce nu mă uit la rata de deschidere a emailurilor?** Apple MPP o umflă cu 15-20 puncte (uneori până la 50-60% artificial), fără ca banii să se schimbe. Te uiți la click, RPR, comenzi plasate și plângeri — toate imune la MPP.
- **Cât trebuie să țină un test de holdout?** **6 săptămâni**, nu 2. Cel mai des primul test eșuează fiindcă fereastra e prea scurtă ca să iasă din zgomot. Ții 10-20% din public/zonă pe dinafară și compari.
- **Care e ținta LTV:CAC?** Minim 3:1. Sub 3:1 pierzi marjă; peste 5:1 investești prea puțin în creștere. Payback-ul (cât durează să recuperezi CAC-ul) trebuie să fie sub 60-90 zile înainte să scalezi un canal.
- **De ce cifrele din atribuire nu se potrivesc cu cele din platformă?** Normal. Platforma își ia tot meritul (umflat ~2,3x) și nu vede comenzile la casă. Atribuirea din Symbai leagă click-urile de bonurile POS reale. Când diferă mult, adevărul e mai aproape de testul de holdout decât de oricare raport.
- **Cât de des revăd toate astea?** Reclame active = timp real; operațional = zilnic; marketing/SEO/conținut = **săptămânal**, uitându-te la variație, nu la cifre absolute. Maxim 10-15 KPI, ca să nu te îneci în date.
- **Configurez testul de incrementalitate dintr-un tool de aici?** Nu. Tool-urile MCP citesc și măsoară rezultatul, dar holdout-ul propriu-zis (oprirea reclamei pe o felie) se face **din aplicație / din platforma de reclame** (test nativ Meta/Google/TikTok). Spune asta onest, nu promite un buton care nu există.

## Vezi și

- `knowledge/reclame-playbook-2026.md` — benchmark-uri, CAPI, conversii offline, optimizare buget.
- `knowledge/email-marketing.md` — KPI email, livrabilitate, predictive sending, conversii atribuite.
- `knowledge/strategie-marketing-plan.md` — planul trimestrial, 70/20/10, what-if buget pe baza atribuirii.
- `knowledge/loialitate-fidelizare.md` — economia LTV, retenție, win-back măsurat cu holdout.
- skill-ul `rapoarte-preturi` — întrebări despre vânzări, food cost, marjă, P&L și comparații pe perioade.
