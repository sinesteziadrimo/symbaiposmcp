# Reclame Plătite — Playbook 2026 (RON)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare. Pentru conectarea contului Meta vezi skill-ul `conecteaza-meta`.

## Pe scurt

Acesta e manualul de agenție pentru reclame plătite în RON: cum construiești o pâlnie (rece → cald → recuperare), cât pui pe buget, când scalezi și de ce un singur ad set consolidat bate cinci fragmentate. Regula de aur 2026: **algoritmul are nevoie de ~50 de conversii pe săptămână per ad set ca să iasă din „învățare"** — la buget mic asta înseamnă să optimizezi pe un eveniment frecvent (mesaje/apeluri/click), nu pe „cumpărare" rară. Din chat (prin Symbai) faci azi reclamele Meta (trafic, mesaje, apeluri, eveniment, like-uri pagină, boost la postare), pauză/repornire, status, insight-uri reale și schimbarea bugetului zilnic cu confirmare; Google și TikTok se gestionează deocamdată din aplicație. Fii cinstit cu proprietarul despre ce se face din chat și ce din aplicație — nu promite ce nu poți livra.

## Concepte

- **Pâlnia pe 3 straturi** — (1) **Rece** = oameni noi, audiență asemănătoare (lookalike) cu clienții tăi buni, mesaj de notorietate; (2) **Cald** = retargeting pe cei care ți-au vizitat site-ul/meniul sau ți-au scris în Messenger, mesaj cu ofertă; (3) **Recuperare** = clienți care nu au mai venit de 30-90 de zile, mesaj „ne-a fost dor de tine". Fiecare strat are alt mesaj și altă ofertă.
- **~70% din buget pe cald + recuperare** — banii merg pe retargeting și pe audiențe asemănătoare construite din clienții tăi, NU pe trafic rece la nimereală. O listă strânsă de 5.000 de clienți buni (cei mai valoroși) bate o listă generică de 200.000.
- **Pragul de 50 de conversii/săptămână** — orice licitație automată (Meta sau Google) are nevoie de ~50 de evenimente de optimizare pe ad set pe săptămână ca să se stabilizeze. La buget mic alegi un obiectiv **frecvent** (conversație Messenger, click-to-call, vizionare pagină) în loc de „cumpărare" rară, și concentrezi banii.
- **Consolidare > fragmentare** — fragmentarea bugetului e motivul #1 pentru care reclamele rămân blocate în învățare. Pentru un local mic: **1-2 campanii, țintire largă într-un singur ad set**, lași AI-ul Meta să segmenteze. 2 ad set-uri la 50 RON/zi bat 5 la 20 RON/zi. Nu suprapune oraș+județ sau țară+oraș-inclus (se respinge pentru suprapunere).
- **Buget de pornire realist (RON)** — în UE/RON un prag de învățare realist e ~50-150 RON/zi per campanie ca să generezi destule evenimente. Sub asta, campania nu strânge date cât să învețe.
- **Scalare lentă: +10-20% la 3 zile** — crește bugetul cu 10-20% o dată la câteva zile, NU mai des. Nu modifica bugetul mai mult de o dată la 72h în timpul învățării și nu schimba creativul/audiența în primele 7-10 zile (resetează învățarea).
- **Volum creativ: 10-15 variante, reîmprospătare 3-5/săptămână** — în 2026 „creativul ESTE țintirea": AI-ul citește cârligul/imaginea/oferta ca să găsească cumpărătorul. Doar ~6% din reclame consumă cel mai mult buget, deci ai nevoie de volum. Ține 10-15 creative active și adaugă 3-5 noi pe săptămână ca să bați oboseala. Primele 1-2 secunde trebuie să oprească scroll-ul.
- **Mix creativ** — 30-40% mărturii/conținut de tip client real (cea mai mică cost-per-rezultat), 20-30% demonstrații de produs/preparat, restul ofertă/preț clar.
- **Țintire geografică + ore slabe** — pentru un local țintește **orașul** (Meta adaugă o rază; pentru un singur punct, rază 5-8 km). Folosește orele slabe: împinge oferta de prânz către cei din apropiere la amiază, umple ferestrele goale — nu reclamă plată 24/7.
- **Benchmark-uri 2026 (de convertit în RON pentru client)** — Meta mâncare & băutură: CPC ~0,52 USD, CPM minim ~8 USD, CTR sănătos 1,4-2,2%; formular de lead conversie până la ~18%. Google Restaurante: CPC ~2,05 USD, CTR ~7,6%, conversie ~7,1%. Orice campanie de 2× peste aceste valori = semnal de problemă.

## Meta vs Google vs TikTok (pe scurt)

- **Meta (Facebook/Instagram)** — ieftin pentru acoperire și notorietate, plus conversații (Messenger) și apeluri. E canalul tău principal din chat. Structura implicită pentru magazin online: Advantage+ Sales, o singură campanie la buget mai mare, cu plafon de 15-25% pe clienții existenți ca banii să meargă spre clienți NOI.
- **Google** — intenție mare („restaurant lângă mine"). Pentru local folosește Performance Max cu obiective de magazin (vizite/apeluri/click pe rută); pune o valoare pe vizita în magazin ca licitația să prioritizeze traficul fizic. Pornește pe „Maximizează valoarea conversiilor", apoi adaugă țintă de ROAS (~400%) după ce se stabilizează. **Se face din aplicație**, nu din chat.
- **TikTok** — folosește Spark Ads (promovezi postări organice existente: +20-40% engagement vs video încărcat) și pune ≥70% din buget pe ele. Minim 3-6 creative. Buget de test realist 1.000-3.000 RON/lună înainte să judeci. **Se face din aplicație.**

## Fluxuri frecvente

### 1) Lansare pâlnie completă pentru un local (Meta, din chat)
1. `list_brands` + `list_locations` → afli brandId/locationId. `list_ad_accounts` [citire] → confirmi că există cont de reclame conectat (dacă nu, trimite la skill-ul `conecteaza-meta`).
2. `check_marketing_allowed` [citire] → verifici că ai voie să faci marketing pe brandul ăsta.
3. Pregătești audiența pe clienții tăi: `preview_guest_segment` / `recompute_loyalty_rfm` ca să identifici segmentul valoros (cei mai buni clienți) pentru audiență asemănătoare. *Crearea audienței asemănătoare/personalizate din lista CRM se face din aplicație azi.*
4. **Strat rece** — `create_traffic_ad` (confirm:true) pe oraș + rază, buget consolidat într-o singură campanie, obiectiv frecvent.
5. **Strat cald** — `create_messages_ad` (confirm:true) sau `boost_post` (confirm:true) pe vizitatori + cei din Messenger, cu o ofertă clară.
6. Legi reclama de o ofertă reală: `preview_offer_margin` → `create_offer` (vezi mai jos day-part/LTO).
7. După 7-10 zile: `get_ad_campaign_insights` [citire] + `compare_attribution_models`/`get_marketing_scorecard` [citire] → scalezi cu +10-20% pe ce are ROAS/CAC peste prag (`set_campaign_budget(confirm:true)`), `pause_ad_campaign` pe ce e sub.

### 2) Optimizare săptămânală
1. `list_ad_campaigns` [citire] (cele active) → `get_ad_campaign_insights` [citire] per campanie; `get_ad_campaign_status` doar pentru livrare/eroare Meta.
2. Compari cu benchmark-urile 2026 (convertite în RON) → identifici 3 acțiuni: oprește ce nu merge, scalează câștigătorul, reîmprospătează creativul.
3. Pe confirmarea proprietarului: `pause_ad_campaign` / `resume_ad_campaign(confirm:true)` / `set_campaign_budget(confirm:true)`.
4. `get_attribution_ltv_by_channel` [citire] → rezumat în limbaj simplu: ce canal aduce clienți cu valoare mare pe termen lung.

### 3) Umplerea orelor slabe (footfall)
1. `marketing_location_weather` + `raport_vanzari` [citire] → găsești fereastra slabă (ex. marți după-amiază).
2. `create_offer` cu **fereastră de zi** (vezi capcane: `timeStart`+`timeEnd`+`daysOfWeek` pentru Happy Hour).
3. `boost_post` sau `create_traffic_ad` (confirm:true) cu rază 5 km, mesaj de prânz, pe slotul slab.
4. `get_attribution_report` [citire] → dovedești că footfall-ul a crescut, nu doar click-urile.

### 4) Recuperare clienți inactivi (win-back plătit)
1. `preview_guest_segment` [citire] → clienți inactivi 60-90 zile, confirmi mărimea. *Sincronizarea ca audiență personalizată în Meta = din aplicație.*
2. `create_messages_ad` / `create_traffic_ad` (confirm:true) cu ofertă „ne-a fost dor de tine".
3. Coordonezi pe același segment cu `push_notify_customers` (confirm:true) și email (`send_email_campaign` — vezi `knowledge/email-marketing.md`) — un singur canal pe promoție pe zi ca să nu obosești clientul.
4. `get_attribution_ltv_by_channel` [citire] → cât venit ai recuperat.

### 5) Eveniment / catering — generare lead-uri
1. `create_event_ad` (confirm:true) pentru un eveniment, sau `create_calls_ad` (confirm:true) dacă vrei apeluri directe pentru rezervări mari.
2. Lead-urile/cererile intră în CRM → le duci prin pipeline cu skill-ul `gestioneaza-crm`.
3. `get_attribution_report` [citire] → cost real per lead pe canal.

## Tool-uri MCP utile

Reclame (Meta, din chat — toate cele de scriere cer `confirm:true` pentru că **cheltuiesc bani reali**):
- `list_ad_accounts` [citire] — ce conturi de reclame sunt conectate la brand.
- `list_ad_campaigns` [citire] — campaniile existente și starea lor.
- `get_ad_campaign_status` [citire] — status Meta, livrare, motiv de respingere/eroare.
- `get_ad_campaign_insights` [citire] — performanța reală: cheltuială, CTR, CPC, CPM, conversii, CPA, ROAS și trend pe zile.
- `create_traffic_ad` [marketing, confirm:true] — reclamă de trafic către site/meniu; obiectiv bun pentru pâlnia rece la buget mic.
- `create_messages_ad` [marketing, confirm:true] — reclamă care deschide conversații Messenger; eveniment frecvent, bun pentru pragul de 50/săptămână.
- `create_calls_ad` [marketing, confirm:true] — reclamă cu apel direct (click-to-call) — util pentru rezervări/comenzi telefonice.
- `create_event_ad` [marketing, confirm:true] — promovează un eveniment.
- `create_page_likes_ad` [marketing, confirm:true] — crește audiența paginii (notorietate, nu vânzare directă).
- `boost_post` [marketing, confirm:true] — promovează o postare organică existentă (cel mai simplu „cald"); `list_boostable_posts` [citire] arată ce postări poți promova.
- `pause_ad_campaign` / `resume_ad_campaign` [marketing, confirm:true] — oprești/repornești o campanie.
- `set_campaign_budget` [reclame, confirm:true] — modifică bugetul zilnic; folosește doar după insight-uri și acord explicit.

Audiență, buget și dovadă (susțin deciziile de reclame):
- `check_marketing_allowed` [citire] — ai voie să faci marketing pe brand?
- `preview_guest_segment` [citire] — mărimea și componența unui segment (top clienți, inactivi) pentru audiențe.
- `recompute_loyalty_rfm` [marketing] — recalculează segmentele de clienți (Champions, At-Risk etc.) pentru țintire.
- `get_attribution_report` [citire] — ce a adus fiecare canal (venit real, nu doar click-uri).
- `get_attribution_ltv_by_channel` [citire] — valoarea pe termen lung a clienților aduși de fiecare canal.
- `raport_vanzari` / `marketing_location_weather` [citire] — context pentru orele slabe și momentul ofertelor.
- `create_offer` / `preview_offer_margin` / `get_offer_scorecard` [marketing] — mecanica de ofertă pe care o promovezi prin reclamă, cu verificarea marjei și scorul după.

Coordonare cross-canal (un singur canal/promoție/zi):
- `push_notify_customers` [marketing, confirm:true], `send_email_campaign` [marketing, confirm:true] — completează reclama plătită pe segmentul cald/recuperare.

## Ce face AI din chat azi vs ce e din aplicație

| Capabilitate | Din chat (Symbai MCP) | Doar din aplicație (UI) |
|---|---|---|
| **Meta — reclamă trafic** | da — `create_traffic_ad` | — |
| **Meta — reclamă mesaje (Messenger)** | da — `create_messages_ad` | — |
| **Meta — reclamă apeluri / eveniment / like-uri** | da — `create_calls_ad`, `create_event_ad`, `create_page_likes_ad` | — |
| **Meta — boost la postare** | da — `boost_post` (+ `list_boostable_posts`) | — |
| **Meta — pauză / repornire** | da — `pause_ad_campaign`, `resume_ad_campaign` | — |
| **Status și rezultate campanie** | da — `list_ad_campaigns`, `get_ad_campaign_status`, `get_ad_campaign_insights` | — |
| **Modificare buget pe campanie (scalare)** | da — `set_campaign_budget(confirm:true)` pentru Meta; bugetul pe set (ABO) cu `set_ad_set_budget(confirm:true)` | da pentru Google/TikTok sau setări avansate |
| **Folosirea audiențelor personalizate / lookalike existente în contul Meta** | da — `list_custom_audiences`, apoi `customAudienceIds` / `excludedCustomAudienceIds` la crearea reclamei | da |
| **Crearea audiențelor personalizate / asemănătoare din lista CRM** | — (le pregătești segmentul cu `preview_guest_segment`) | da |
| **Schimbarea materialului/textului unei reclame publicate; copii de set/reclamă** | da — `update_ad` (reintră în verificare), `duplicate_ad_set` / `duplicate_ad` (pe pauză) | da |
| **Google Ads (Performance Max, Search)** | — | da |
| **TikTok Ads (Smart+, Spark Ads)** | — | da |
| **Conectare cont Meta / cont reclame** | — (vezi skill-ul `conecteaza-meta`) | da |

Regula de onestitate: dacă proprietarul cere ceva ce nu se poate din chat (ex. „scalează bugetul Google", „fă audiență lookalike"), spune clar că **se face din aplicație** și ghidează-l acolo — nu inventa un tool și nu pretinde că ai făcut-o. Pentru Meta, bugetul zilnic se poate schimba din chat cu `set_campaign_budget(confirm:true)`.

## Întrebări frecvente și capcane

- **„De ce campania nu performează?"** — De obicei e fragmentare de buget sau obiectiv prea rar. Consolidează în 1-2 campanii, alege un eveniment frecvent (mesaje/apeluri/trafic) și concentrează banii ca să atingi ~50 de conversii/săptămână.
- **„Pot mări bugetul azi?"** — Nu mai des de o dată la ~3 zile, cu +10-20%. Salturile mari și editările dese resetează învățarea și strică performanța.
- **„Câți bani pun?"** — Sub ~50-150 RON/zi per campanie nu strângi destule date cât să iasă din învățare. Mai bine o campanie finanțată decât trei înfometate.
- **Nu schimba creativul/audiența în primele 7-10 zile** — resetează învățarea. Schimbi DOAR după ce s-a stabilizat.
- **70% pe cald + recuperare, nu pe trafic rece** — cei mai ieftini clienți de adus sunt cei care te cunosc deja (retargeting) sau seamănă cu clienții tăi buni (lookalike din top-LTV). O listă strânsă de 5.000 bate una generică de 200.000.
- **Oferte cu fereastră de zi** — `create_offer` suportă acum interval orar: `timeStart`+`timeEnd`+`daysOfWeek` pentru un **Happy Hour** (ex. 15:00-18:00, Luni-Joi) și `startsAt`/`expiresAt` pentru o ofertă pe termen limitat (LTO). **Fără fereastră de timp, oferta rulează 24/7** — pune fereastra dacă vrei doar orele slabe.
- **Atribuirea umflă ROAS** — cifrele raportate de platformă supraestimează ROAS-ul real în medie de ~2,3×. Judecă rentabilitatea pe `get_attribution_report` / `get_attribution_ltv_by_channel` (date din POS-ul tău), nu pe ce zice doar Meta/Google.
- **Țintire geografică corectă** — pentru un local țintește orașul (Meta adaugă rază) sau rază 5-8 km în jurul punctului. Nu suprapune oraș + județ + țară (se respinge). Acoperire pe toată țara în UE cere date de plătitor/beneficiar verificate.
- **Confirmare obligatorie la cheltuială** — orice tool de creare/pornire/scalare reclamă cheltuie bani reali; rulează cu `confirm:true` și spune-i clar proprietarului bugetul, durata și ținta înainte. Nu repeta comanda dacă ecranul nu s-a actualizat — verifică prin `get_ad_campaign_status`/`get_ad_campaign_insights`.
- **Nu inventa tool-uri** — pentru Google, TikTok și CREAREA audiențelor personalizate spune cinstit „se face din aplicație" și ghidează acolo. Pentru Meta, folosește tool-urile existente (`set_campaign_budget`, `set_ad_set_budget`, `update_ad`, `duplicate_ad_set`, `list_custom_audiences` incluse).

## Vezi și

- `knowledge/marketing-social.md` — postări organice (sursa pentru Spark Ads/boost) și atribuire.
- `knowledge/email-marketing.md` — canalul de retenție care completează reclamele pe segmentul cald/recuperare.
- skill-ul `conecteaza-meta` — conectarea paginii, Instagram Business și contul de reclame.
- skill-ul `gestioneaza-crm` — unde aterizează lead-urile de la `create_event_ad`/`create_calls_ad`.
