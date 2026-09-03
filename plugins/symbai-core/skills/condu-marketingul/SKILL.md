---
name: condu-marketingul
description: Directorul de marketing — plan trimestrial + lunar (obiectiv → buget pe canale → calendar → campanii → revizuire) coordonând email, push, social, reclame, oferte și loialitate. La „fă-mi un plan de marketing", „condu marketingul luna asta", „cât să pun pe reclame", „pe ce să pun banii".
---

# Condu marketingul (ca un director de agenție)

Acest skill te face să lucrezi ca un **director de marketing** care orchestrează TOATE canalele, nu doar să execuți o tactică izolată. Logica e mereu aceeași: **OBIECTIV → AUDIENȚĂ → CANAL → OFERTĂ → MĂSURARE**, cu un plan trimestrial care se revizuiește lunar.

Citește întâi `knowledge/plan-marketing-strategie.md` (creierul deciziei: buget, mix de canale, cadențe) și `knowledge/comunicare-cross-channel-lifecycle.md` (anti-oboseală). Pentru calendar: `knowledge/calendar-sezonier-horeca-ro.md`.

## A. Construiește planul trimestrial (o dată pe trimestru)

1. **Context:** `list_brands` + `list_locations` (brandId/locationId). `read_brand_memories(brandId)` — voce, public, poziționare (dacă lipsesc, vezi `knowledge/pozitionare-brand.md`).
2. **Diagnostic — citește datele REALE înainte de orice cifră:**
   - `get_attribution_report` + `get_attribution_ltv_by_channel` — ce canal aduce bani și clienți valoroși (ROAS/CAC/LTV pe canal). **Bugetul se ponderează pe astea, nu pe un șablon.**
   - `recompute_loyalty_rfm` + `get_email_segment_opportunities` — pe cine ai (noi/fideli/în pericol/pierduți).
   - `raport_vanzari` + `top_produse` + `get_menu_engineering` — ce să promovezi (vedete, ghicitori).
   - `get_seasonal_calendar(quarter, year)` — evenimentele trimestrului + cu câte zile înainte trebuie pregătit fiecare.
3. **Generează planul:** `generate_quarterly_marketing_plan(brandId, quarter, year, totalBudget?, strategicNote?)`. Întoarce un plan complet (rezumat, OKR target venit/CAC/ROAS, buget total + distribuție pe canale, 8-12 campanii cu date, calendar, riscuri, 3 milestone-uri lunare) și îl salvează ca DRAFT.
   - Dacă utilizatorul nu dă buget: începe de la **% din venit** (vezi knowledge: nou 8-15%, stabil 5-8%, matur 3-6%) și abia apoi împarte.
4. **PREZINTĂ-l clar utilizatorului** (în lei, pe limba lui): tema trimestrului, targetul de venit, cum se împarte bugetul și de ce, top campaniile pe luni. **Cere confirmarea.**
5. **Aplică:** `apply_quarterly_marketing_plan(planId, confirm:true)` — transformă campaniile în drafturi de reclame (în așteptarea aprobării) + planuri de conținut lunare. Spune-i ce avertismente au ieșit (ex. „contul TikTok neconectat").

## B. Execută tacticile (săptămânal)

Din campaniile planului, lansează concret — fiecare prin skill-ul lui, mereu pe **canalul potrivit obiectivului**:
- **Conștientizare** → social organic: `programeaza-postare` / `creeaza-calendar-social` (60-70% Reels), GBP (`gestioneaza-gbp`).
- **Achiziție** → reclame: `gestioneaza-reclame` (Meta/Google), retargeting din CRM.
- **Retenție** → email + push + loialitate: `gestioneaza-comunicare`, `trimite-notificare-push`, `ruleaza-retentie`, `gestioneaza-loialitate`.
- **Oferte** → `creeaza-oferta` / `create_offer` — pentru happy hour/interval orar pune OBLIGATORIU `timeStart`+`timeEnd` (altfel rulează 24/7 și pierzi marjă); rulează întâi `preview_offer_margin`.

**Regula de aur (anti-oboseală):** o singură ofertă pe client pe zi; max 1-2 mesaje de marketing/client/zi, 3-5/săptămână, pe TOATE canalele la un loc. Înainte de o trimitere mare verifică cu `check_marketing_allowed` / vezi `knowledge/comunicare-cross-channel-lifecycle.md`. Niciodată același mesaj pe 4 canale în aceeași zi.

## C. Revizuiește și realocă (lunar — bucla care face diferența)

1. `get_marketing_scorecard(days:30)` + `compare_attribution_models(days:30)` — tabloul executiv și atribuirea onestă înainte de realocări; apoi `list_quarterly_marketing_plans` → `review_quarterly_marketing_plan(planId)` pentru progresul planului.
2. **Dacă ești sub target cu >15%** sau un canal a urcat CAC cu >25%:
   - `get_ad_campaign_insights` pe campaniile active/slabe ca să vezi spend, CTR, CPC, CPA, conversii și ROAS. Folosește `get_ad_campaign_status` doar pentru status Meta/eroare.
   - `what_if_marketing_budget(brandId, baselineSplit, newSplit)` — simulează mutarea banilor de pe canalul slab pe cel cu ROAS mai bun ÎNAINTE să muți efectiv.
   - Propune: pune pauză pe campaniile sub target (`pause_ad_campaign`), crește bugetul pe câștigătoare cu `set_campaign_budget(confirm:true)`. **Confirmă cu utilizatorul** orice schimbare de buget.
3. Dă-i utilizatorului un rezumat scurt: „luna asta ai făcut X, targetul era Y, mut Z lei de pe A pe B, motivul e ...". Pentru tabloul complet vezi skill-ul `masoara-marketing`.

## Reguli
- **Citește datele reale înainte de a propune cifre.** Niciodată buget „din burtă" — ponderează pe ROAS/LTV real (`get_attribution_ltv_by_channel`).
- **Confirmă-first la tot ce costă bani sau e ireversibil** (aplicarea planului, schimbări de buget, trimiteri în masă). Postările/reclamele create rămân „în așteptare aprobare".
- **Retenție > achiziție:** un client recâștigat aduce ~3x ROI vs unul nou; pune ~70% din bugetul de reclame pe retargeting + lookalike din clienții tăi, nu pe trafic rece.
- **Lead-time sezonier:** deadline = vârf − fereastra de pregătire (Valentine's 3 săpt, Paște 4 săpt, Revelion 6 săpt). Nu începe o campanie de sărbătoare cu 3 zile înainte.
- **Măsoară pe vânzări, nu pe vanity:** click/conversii/venit atribuit, nu like-uri sau deschideri brute.
- Necesită scriere pe „Marketing & Social Media" (+ „Reclame" pentru ads, „Comunicare" pentru email/push). Dacă lipsesc, îndrumă spre portal Hub → Acces AI.
- Skill-uri pe care le coordonezi: `gestioneaza-reclame`, `programeaza-postare`/`creeaza-calendar-social`, `gestioneaza-comunicare`, `trimite-notificare-push`, `ruleaza-retentie`, `gestioneaza-loialitate`, `creeaza-oferta`, `gestioneaza-gbp`, `raspunde-recenzii`, `masoara-marketing`. Concepte: `knowledge/plan-marketing-strategie.md`.
