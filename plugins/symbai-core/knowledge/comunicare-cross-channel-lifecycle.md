# Comunicare Cross-Channel — Email, WhatsApp si Push Ca Un Singur Ciclu

> Pentru linkul exact catre orice pagina foloseste tool-ul `gaseste_in_aplicatie` — el e sursa autoritara de navigare.

## Pe scurt

Clientul tau primeste email, WhatsApp si notificari push de la tine — dar in capul lui sunt UN singur brand, nu trei canale separate. Daca le tratezi separat, ajunge sa ia acelasi mesaj pe trei cai in cateva ore si se enerveaza: frecventa excesiva poate duce la dezabonare. Acest fisier arata cum orchestrezi cele trei canale (plus social pentru descoperire) ca un ciclu unic anti-oboseala: un mesaj per persoana per fereastra, un buget total de frecventa, fiecare canal pe momentul lui. Lucrezi MCP-first: citesti permisiunile reale (`check_marketing_allowed`, `check_contact_frequency_budget`, `comms_get_status`), faci un plan, ceri confirmare in cuvinte si abia apoi trimiti.

## Concepte

- **Fiecare canal are un rol — nu-l forta in altul:**
  - **Email** = lifecycle bogat si ieftin. Trimite-l PRIMUL: e cel mai ieftin canal, suporta poveste/imagini/multe linkuri, costul si rezultatul trebuie masurate pentru publicul respectiv. Bun pentru welcome, povestea unui produs, newsletter, oferte detaliate, win-back lung.
  - **Push** = scurt si urgent. Titlu sub 40 de caractere, text sub 120, UN singur indemn. Bun pentru reminder, happy-hour de azi, "iti expira punctele", "ai uitat ceva in cos". Imaginea este o ipoteza de test, nu o crestere garantata de clicuri.
  - **WhatsApp** = conversatie si caldura. Bun pentru confirmare/modificare rezervare, raspuns la o intrebare, win-back cald catre clientul bun care nu a deschis emailul. Combina canalele numai daca exista acord si relevanta; compara rezultatele si costurile.
  - **Social organic** = descoperire (oameni care inca nu sunt clienti). NU e canal de lifecycle 1-la-1 — vezi `knowledge/marketing-social.md`.
- **Regula de aur: un mesaj / un contact / o fereastra.** Niciodata acelasi promo pe 4 canale in aceeasi zi. O singura oferta/zi pe client. Daca trimiti pe push, NU repeta acelasi lucru pe email cateva ore mai tarziu.
- **Buget total de frecventa (peste TOATE canalele):** maxim **1–2 mesaje marketing/client/zi** si **3–5/saptamana**. Push singur: implicit **2/saptamana**, plafon dur **3/saptamana** inclusiv loialitate. Capul se numara cumulat, nu separat pe canal.
- **Ore de liniste 21:00–08:00 in fusul CLIENTULUI** (Europe/Bucharest pentru RO), nu al tau. Symbai respecta deja fereastra — n-o suprascrie.
- **Secventiere lansare (mesaj nou, ne-urgent):** email ziua 0 → push reminder scurt catre cei care nu au reactionat prin clic sau conversie ziua +1–2 → WhatsApp catre segmentul cald nedeschis ziua +3. Asa fiecare atingere e pe alt canal si nu pari spam.
- **Secventa de abandon (cos/rezervare neterminata), 3 atingeri:** email la ~**1h** (reminder bland) → push la **12–24h** (beneficii + dovada sociala) → SMS/WhatsApp la **24–36h** (urgenta + stimulent mic). **Iesire imediata la conversie** — daca a cumparat, opresti tot. Procentul recuperat se masoara pe acest flux, fara reper garantat.
- **Consimtamant per canal + suppression partajat:** cineva poate accepta emailul dar nu pushul. Verifici opt-in-ul fiecarui canal inainte de trimitere, iar cine s-a dezabonat ramane suprimat pe acel canal.
- **Next-best-channel:** cand alegi UN canal pentru un client, alege-l pe cel cu sansa cea mai mare de reactie pentru EL (are clicuri recente pe email → testeaza email; prefera notificari si a acceptat push → considera push).

## Fluxuri frecvente

### 1. Lansare produs/preparat nou coordonata (email → push → WhatsApp)
1. Verifica permisiunile si starea canalelor: `check_marketing_allowed` `[citire]` + `comms_get_status` `[citire]`.
2. Anti-suprapunere: `list_email_campaigns` + `list_social_posts` ca sa nu te calci pe alta comunicare in aceeasi zi.
3. **Ziua 0 — email bogat** cu povestea produsului: `create_email_campaign` `[marketing]` → `check_email_campaign_deliverability` `[citire]` → `send_test_email_campaign` `[marketing]` → confirma → `send_email_campaign_predictive({ campaignId, confirm:true })` `[marketing]` (ore individuale, nu blast).
4. **Ziua +1–2 — push reminder scurt DOAR catre cine n-a deschis emailul:** `get_push_segment_opportunities` `[citire]` → `create_push_campaign({ topic:"new_products", imageUrl, navigateUrl })` `[marketing]` → `preview_push_audience` `[citire]` → `schedule_push_campaign` `[marketing]`.
5. **Ziua +3 — WhatsApp catre segmentul cald** ramas: `send_whatsapp_message({ confirm:true })` `[marketing]`, mesaj scurt si personal.
6. Masoara pe canal: `get_email_campaign_analytics` + `get_push_campaign_analytics` `[citire]`, apoi `get_attribution_report` `[citire]` pentru venitul real.

### 2. Win-back cross-channel pe RFM (clientul racit)
1. `recompute_loyalty_rfm` `[marketing]` + `evaluate_loyalty_drop_alerts` `[citire]` → identifica clientii buni care s-au racit.
2. `preview_guest_segment` `[citire]` (lapsed 30–60 zile) ca sa vezi marimea + opt-in-ul pe canal.
3. Imparte pe valoare: VIP racit = oferta mai adanca + atingere personala; client rar = nudge fara discount.
4. Secventa escaladata, fiecare pas pe alt canal (Joi/Vineri 16:00–18:00, momentul deciziei de cina):
   - **Ziua 0** email "ne e dor de tine", FARA discount: `create_email_campaign` → `send_email_campaign_predictive(confirm:true)`.
   - **Ziua +7** daca n-a revenit, push cu voucher: `create_push_campaign({ topic:"offers" })` → `send_push_campaign(confirm:true)`.
   - **Ziua +10–14** WhatsApp last-chance cald: `send_whatsapp_message(confirm:true)`.
5. Iesire la conversie pe orice pas. Dupa fereastra: `get_attribution_report` pentru recuperarea reala; cine nu raspunde dupa 90–180 zile → `add_email_suppression`/`add_push_suppression` `[marketing]` (sunset). Tinta: 12–18% re-comanda.

### 3. Recuperare abandon cos/rezervare (email 1h → push 12–24h → SMS 24–36h)
1. Email la ~1h, reminder bland: `create_email_campaign` (sau `create_email_sequence` cu 3 pasi).
2. Push la 12–24h cu beneficii + dovada sociala, doar daca n-a finalizat: `create_push_campaign({ topic:"offers" })`.
3. SMS/WhatsApp la 24–36h cu stimulent mic, doar daca tot nu a convertit: `send_whatsapp_message(confirm:true)`.
4. **Conditie de iesire la conversie pe fiecare pas** — nu trimite urmatoarea atingere daca a cumparat.
5. Masoara recuperarea cu `get_email_conversion_attribution` `[citire]` (fereastra 7 zile). Tinta 8–12%.

### 4. Poarta de control inainte de orice trimitere in masa
1. `check_marketing_allowed` + `comms_get_status` → permisiuni si stare canale.
2. Verifica **consimtamantul per canal** + orele de liniste 21:00–08:00 + **bugetul de frecventa** cu `check_contact_frequency_budget(customerId, brandId?)` (1–2/zi, 3–5/sapt cumulat pe toate canalele — daca au primit deja ceva azi, NU mai trimite).
3. `preview_email_audience` / `preview_push_audience` / `preview_guest_segment` `[citire]` pentru reach-ul exact.
4. Lasa 10% holdout (control) la fluxurile de retentie ca sa masori liftul real.
5. Abia apoi trimite cu `confirm:true`, apoi `get_attribution_report` dupa.

### 5. Aniversare client (un canal, personal)
1. `get_push_segment_opportunities` (birthday) sau segment din `recompute_nba` `[marketing]`.
2. Trimite 7–14 zile inainte, oferta datata si rezervabila: push pentru cei cu app (`create_push_campaign({ topic:"loyalty" })`) SAU email cu prenume (`create_email_campaign`) — UN singur canal, e mesaj personal, fara holdout.
3. Masoara redempția in loialitate. Emailul de ziua clientului are cel mai mare venit/mesaj din restaurant.

## Tool-uri MCP utile

- **Permisiuni si stare canale:** `check_marketing_allowed` `[citire]` — are voie acest brand sa comunice; `comms_get_status` `[citire]` — ce canale sunt active/configurate.
- **Email (trimite cu `confirm:true`):** `create_email_campaign`, `create_email_sequence`, `enroll_customers_in_email_sequence` — draft/secventa `[marketing]`; `check_email_campaign_deliverability`, `preview_email_audience` `[citire]` — scor continut + reach; `send_test_email_campaign` — test pe adresa ta `[marketing]`; `send_email_campaign_predictive({ confirm:true })` / `schedule_email_campaign` — trimitere reala la ore individuale / la o data `[marketing]`; `get_email_campaign_analytics`, `get_email_conversion_attribution` `[citire]` — rezultat + ROI.
- **Push (scurt/urgent, `confirm:true`):** `create_push_campaign` — draft (topic, imageUrl, navigateUrl) `[marketing]`; `preview_push_audience`, `get_push_segment_opportunities` `[citire]` — cine + segmente; `schedule_push_campaign` / `send_push_campaign({ confirm:true })` — programat/imediat `[marketing]`; `push_notify_customers({ confirm:true })` — anunt rapid pe segment `[marketing]`; `set_push_preferences`, `add_push_suppression` `[marketing]` — plafon/liniste, suprimare; `get_push_campaign_analytics`, `get_brand_push_deliverability` `[citire]` — CTR + sanatate baza.
- **WhatsApp (conversatie/cald, `confirm:true`):** `send_whatsapp_message({ confirm:true })` — mesaj 1-la-1 catre client `[marketing]`; `send_whatsapp_media({ confirm:true })` — cu imagine/document `[marketing]`; `list_whatsapp_accounts` `[citire]` — verifica numarul conectat.
- **Orchestrare lifecycle (CRM):** `recompute_loyalty_rfm` `[marketing]` — segmente RFM lunare; `evaluate_loyalty_drop_alerts`, `list_nba_suggestions` `[citire]`, `recompute_nba` `[marketing]` — cine s-a racit / urmatoarea actiune buna; `run_crm_playbook`, `create_marketing_automation`, `run_marketing_automation` `[marketing]` — automatizari multi-canal; `preview_guest_segment` `[citire]` — reach + opt-in pe canal.
- **Masura (toate `[citire]`):** `get_attribution_report`, `get_attribution_ltv_by_channel` — venit per canal; `get_email_conversion_attribution`, `reconcile_email_conversions` — ROI email cand exista click fara conversie.
- **Suppression / GDPR:** `add_email_suppression`, `add_push_suppression` `[marketing]` — scoate definitiv un contact de pe un canal (sunset).

## Întrebări frecvente și capcane

- **De ce nu trimit acelasi promo pe email + push + WhatsApp ca sa fiu sigur ca ajunge?** Pentru ca clientul primeste trei notificari la acelasi mesaj in cateva ore si se dezaboneaza. Respecta preferintele si plafoanele reale, urmarind dezabonarile si reclamatiile. Un mesaj bine tintit pe UN canal bate cinci la rand. Foloseste secventiere (email → push → WhatsApp pe zile diferite), nu repetare in aceeasi zi.
- **Care e bugetul total de mesaje?** 1–2 marketing/client/zi si 3–5/saptamana — **cumulat pe toate canalele**, nu pe fiecare separat. Inainte de orice trimitere 1-la-1 verifica `check_contact_frequency_budget`; inainte de trimitere in masa, fa preview/audienta si respecta plafonul de destinatari.
- **Cu ce canal incep?** Cu emailul (cel mai ieftin si bogat). Pushul vine ca reminder scurt DOAR catre cei care nu au reactionat prin clic sau conversie. WhatsApp e pentru caldura/conversatie, la final, pe segmentul cald.
- **Push la ora 22:00 daca am o oferta tare?** Nu. Orele de liniste 21:00–08:00 in fusul clientului sunt respectate de sistem — nu le suprascrie. Pranzul (10:30–13:00) si cina (16:30–18:00), weekend 17:00–20:00 sunt ferestrele bune.
- **Consimtamantul e unul singur pe client?** Nu — e per canal. Cineva poate accepta emailul si refuza pushul. Verifica opt-in-ul fiecarui canal (`check_marketing_allowed`, segmentele cu opt-in) inainte sa trimiti pe acel canal.
- **Cum stiu daca a meritat?** Dimensioneaza un grup de control dupa volum si efectul urmarit, apoi compara rezultatele prin instrumentul de experiment disponibil; `get_attribution_report` singur nu dovedeste efectul incremental — asa transformi "am trimis 5.000 de mesaje" in "fluxul asta a adus X vizite in plus". CTR-ul masoara atentia, liftul pe comenzi masoara banii.
- **Capcana: dublarea trimiterii pentru ca ecranul nu s-a reimprospatat.** Dupa orice trimitere, verifica prin tool de citire (`get_..._analytics`, `list_email_campaigns`), nu repeta comanda pe baza UI-ului.
- **Capcana: o campanie deja trimisa nu se mai editeaza.** Faci o campanie noua pe segmentul potrivit (non-deschideri, click-fara-conversie, VIP) si o trimiti pe canalul lor preferat.
- **Capcana: secventa de abandon care merge mai departe desi clientul a cumparat.** Pune mereu conditia de iesire la conversie — altfel ii trimiti "ai uitat ceva in cos" cuiva care tocmai a platit.

## Vezi si

- `knowledge/email-marketing.md` — campanii, fluxuri, livrabilitate, predictive.
- `knowledge/marketing-social.md` — descoperire pe social organic + reclame.
- `knowledge/gdpr-clienti-oaspeti.md` — consimtamant, dezabonari, anonimizare.
- `knowledge/loialitate-fidelizare.md` — RFM, win-back, puncte care expira, membership.
- skill-ul `gestioneaza-crm` — pipeline, rezervari, follow-up automat; skill-ul `programeaza-postare` — social organic.


Pentru website si CRM: `knowledge/website-marketing-crm.md`. Cadentele de mai sus sunt ipoteze de pornire in limita preferintelor configurate, nu permisiunea de a contacta mai des. Absenta unei deschideri de email nu dovedeste lipsa interesului. Nici formularul contact si nici acordul analytics nu reprezinta acord pentru toate canalele de marketing.
