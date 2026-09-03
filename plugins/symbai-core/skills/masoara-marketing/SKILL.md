---
name: masoara-marketing
description: Tabloul de bord săptămânal + ROI onest pe canale — ce canal aduce bani, cât cheltui, CAC, LTV:CAC, clienți noi vs reveniți, comparație pe perioade. La „cum stă marketingul", „raport săptămânal marketing", „ce canal îmi aduce bani", „cât mă costă un client", „merge mai bine ca luna trecută?".
---

# Măsoară marketingul (tabloul de bord al proprietarului + ROI onest pe canale)

Acest skill îți dă **rezumatul de proprietar în sub 2 minute**: 8 indicatori de rezultat (nu 40 de cifre), un clasament cinstit al canalelor după banii reali pe care îi aduc, și verdictul „pe ce să pui mai mult / de unde să tai". Filozofia 2026: **măsori pe VENIT, nu pe vanity** (uită de like-uri și de „deschideri" de email), și **arăți mereu ≥2 perspective de atribuire** pentru că nicio singură măsurare nu spune tot adevărul.

Citește întâi `knowledge/masurare-marketing-atribuire.md` (creierul deciziei: LTV:CAC, payback, de ce platformele umflă ROAS-ul). Toate cifrele sunt în RON.

## Tool order live (2026)

- Pentru „cum stă marketingul / ce canal aduce bani": începe cu `get_marketing_scorecard(days, model?)`. Îți dă venitul atribuit, cheltuiala ads, ROAS combinat și canalele cu LTV:CAC sub 3.
- Pentru „arată-mi atribuirea onest": `compare_attribution_models(days)` înainte de concluzii; arată last/first/linear/time_decay/position dacă există date. Nu lua decizia pe un singur model.
- Pentru „cum merge campania X": `get_ad_campaign_insights(campaignId, startDate?, endDate?)`, nu doar `get_ad_campaign_status`. Statusul spune dacă rulează; insights spune spend, CTR, CPC, CPA, conversii, ROAS și trend pe zile.
- Pentru „pot să-i trimit clientului X încă un mesaj": `check_contact_frequency_budget(customerId, brandId?)` înainte de orice mesaj/retargeting 1-la-1. Respectă verdictul `canSend`.

## A. Tabloul de bord săptămânal (rutina de fiecare luni)

1. **Context:** `list_brands` + `list_locations` (afli `brandId`/`locationId`). `read_brand_memories(brandId)` dacă vrei tonul/poziționarea în rezumat.
2. **Adună cele 4 surse de adevăr** [citire] — pe ultimele **7 zile** (sau cât cere proprietarul):
   - `get_attribution_report` — ce canal a generat comenzi/venit atribuit. **Cere-l cu ≥2 modele** (last-click + time-decay / first-touch) ca să vezi diferența. Last-click umflă canalele de jos de pâlnie (căutare pe nume de brand, retargeting) — spune-o explicit.
   - `get_attribution_ltv_by_channel` — calitatea clienților aduși de fiecare canal (LTV pe canal), nu doar prima comandă. Aici se vede dacă un canal aduce „turiști" sau clienți care revin.
   - `raport_vanzari` — venitul real total + bonul mediu + numărul de clienți (numitorul pentru CAC).
   - `get_pnl` — cheltuiala totală de marketing și profitul, ca să raportezi marketingul ca **% din venit** (reper sănătos HoReCa: **3-6%**; lansare 8-15%).
3. **Calculează indicatorii care contează** (din cifrele de mai sus — fă tu aritmetica, nu inventa un tool):
   - **CAC** = (cheltuială reclame + cost promoții) ÷ clienți NOI din perioadă.
   - **LTV** = bon mediu × frecvență vizite × luni reținute × marjă brută %.
   - **ROAS combinat (blended)** = venit atribuit total ÷ cheltuială totală de marketing.
   - **LTV:CAC pe canal** și **payback** (în câte zile îți recuperezi CAC-ul).
   - **Raport clienți noi vs reveniți** (mixul care prezice creșterea).
4. **Semnalează problemele — regula de prag:**
   - Orice canal cu **LTV:CAC < 3** = pierde marjă → propune reducere/oprire.
   - Orice canal cu **payback > 90 zile** = blochezi cash prea mult → de redus sau de regândit oferta.
   - Reper HoReCa: bonul e mic (30-80 lei) dar repetiția e mare → LTV:CAC bun trece ușor de 3:1, iar restaurantele bine conduse ajung la 20-60x. Dacă un canal e sub 3, chiar e o scurgere.
   - **LTV:CAC > 5** la nivel combinat NU e doar bine — înseamnă că **investești prea puțin** în creștere; spune-i proprietarului că poate apăsa pedala.
5. **Compară cu perioada trecută** [citire]: `compare_pnl_periods` — venit/profit/cheltuială marketing săptămâna asta vs trecută (sau lună vs lună, an vs an). **Citește VARIAȚIA, nu cifra brută** — „+12% venit, dar CAC +30%" e o poveste, „45.000 lei" singur nu spune nimic.
6. **Rezumatul de proprietar** (pe limba lui, RON, semafor verde/galben/roșu), exact 8 indicatori de rezultat:
   > ROAS combinat · CAC · LTV:CAC · marketing ca % din venit · mix clienți noi vs reveniți · venit din email (RPR) · rezervări viitoare (7-14 zile) · profit. Plus **„ce facem săptămâna asta"** (1-3 mișcări).

## B. Clasamentul cinstit al canalelor (ROI onest)

Când proprietarul întreabă „ce canal îmi aduce bani":

1. `get_attribution_report` cu **≥2 modele** → arată last-click vs time-decay **una lângă alta** pe fiecare canal. Diferența dintre ele = cât de „înșelător" e last-click-ul.
2. `get_attribution_ltv_by_channel` → adaugă calitatea clientului (un canal poate părea ieftin la prima comandă dar aduce clienți care nu revin).
3. `get_pnl` (cheltuiala pe canale) → calculează CAC per canal.
4. **Clasează canalele după LTV:CAC**, nu după volum. Marchează cu roșu orice canal cu **LTV:CAC < 3** sau **payback > 90 zile**.
5. **Avertismentul obligatoriu de onestitate:** „ROAS-ul raportat de Meta/Google e umflat în medie de ~2,3 ori — îl folosesc ca să ORDONEZ canalele, nu ca să decid bugetul." Pentru decizia de buget adevărată trebuie un test cu grup de control (holdout), care azi se face **din aplicație** / din platforma de reclame (lift test nativ Meta/Google) — nu promite un tool care nu există.

## C. Adâncește pe canal (când un indicator e roșu)

- **Reclame slabe:** `list_ad_campaigns` → `get_ad_campaign_insights` pentru campaniile active/slabe; folosește `get_ad_campaign_status` doar pentru publicare/eroare Meta. Pauza sau schimbarea de buget trec la `condu-marketingul`/`gestioneaza-reclame` și cer confirmarea proprietarului.
- **Email — măsoară-l CORECT:** `get_email_campaign_analytics` + `get_email_conversion_attribution` (fereastră 7 zile). **Raportează pe click, RPR (venit per destinatar), comenzi plasate, plângeri** — NICIODATĂ pe „deschideri" (Apple le umflă cu 15-20 puncte; o rată reală de 28% apare ca 52%). Reper sănătos: email aduce ~45 lei la 1 leu cheltuit.
- **Oferte/promoții:** `get_offer_scorecard` — întrebarea corectă nu e „câți au folosit cuponul", ci „câți NU ar fi venit oricum". O ofertă bună aduce clienți incrementali, nu subvenționează clienți care veneau oricum.

## Reguli

- **Arată MEREU ≥2 perspective de atribuire** (last-click + time-decay/first-touch). O singură măsurare ascunde adevărul; spreadul dintre ele e informația cea mai utilă. Spune clar că last-click supra-creditează căutarea pe nume de brand și retargetingul.
- **Măsoară pe VENIT, nu pe vanity.** Indicatorii care decid: ROAS combinat, CAC, LTV:CAC, % din venit, mix nou-vs-revenit, RPR la email, rezervări viitoare, profit. Nu like-uri, nu „deschideri" brute, nu impresii.
- **Praguri de alarmă:** LTV:CAC < 3 = scurgere de marjă (taie/reduce); payback > 90 zile = blochezi cash; LTV:CAC > 5 combinat = investești PREA puțin în creștere.
- **Onestitate pe ROAS:** platformele umflă ROAS-ul ~2,3x. Atribuirea ordonează și diagnostichează canalele; adevărul pe bani îl dă doar un test cu holdout (6 săptămâni, 10-20% grup de control) — făcut din aplicație/platformă, NU dintr-un tool de aici. Nu inventa tooluri de experiment.
- **Tablou disciplinat:** maximum 8 indicatori de rezultat, citibili în 2 minute, cu semafor. Fiecare indicator trebuie să declanșeze o decizie — dacă nu, scoate-l. Cadență: zilnic pentru reclame active, **săptămânal** pentru tabloul de marketing.
- **Variație, nu absolute:** raportează mereu „vs țintă" și „vs perioada trecută" (`compare_pnl_periods`), nu cifra brută izolată.
- **Doar citire** — acest skill nu cheltuie și nu trimite nimic; doar arată adevărul. Pentru acțiuni (realocă buget, oprește campanii, lansează win-back) trece la `condu-marketingul` și confirmă cu proprietarul. Pentru P&L detaliat / food cost / comparații pe perioade vezi skill-ul `rapoarte-preturi`.
- Necesită citire pe „Marketing & Social Media" / „Reclame" / „Comunicare" + „Financiar". Citirea e activă implicit; dacă un tool dă 401, îndrumă spre portal Hub → Acces AI. Concepte: `knowledge/masurare-marketing-atribuire.md`.
