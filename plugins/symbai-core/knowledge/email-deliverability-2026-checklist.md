# Checklist Livrabilitate Email 2026

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Din 2026 livrabilitatea NU mai e un "nice to have" — Gmail, Yahoo și Microsoft au reguli ferme pentru cine trimite mult, iar dacă le încalci emailurile tale ajung direct în Spam sau sunt respinse complet. Acest fișier e checklistul de decizie: pragurile-cheie (plângeri, bounce, autentificare), ce verifici în Symbai înainte de o campanie mare și ce faci concret când sare bounce-ul sau o plângere. Regula de aur: pentru liste mari, sănătatea domeniului contează mai mult decât subiectul emailului. Vezi și `knowledge/email-marketing.md` (campanii, fluxuri, predictive) și skill-ul `gestioneaza-crm` (fluxuri de retenție).

## Concepte

**Tabelul de decizie 2026 — numerele pe care le respecți mereu:**

- **"Trimitere în masă" = 5.000+ emailuri/zi** către același furnizor (Gmail / Yahoo / Microsoft). Peste acest prag intri sub regulile stricte de mai jos. Microsoft le aplică din mai 2025; Gmail a trecut la respingeri permanente din noiembrie 2025.
- **Plângeri de spam: 0,3% = oprire.** La 0,3% reclamații, furnizorul tratează domeniul ca practic mort (emailurile nu mai intră). **Ținta reală e SUB 0,1%** — adică maxim 1 reclamație la 1.000 de emailuri livrate. Postmaster Google ar trebui să arate sub ~0,08%.
- **Bounce (respingeri) sub 2%.** Peste 2% e semnal de listă murdară — oprești creșterea volumului și cureți.
- **SPF + DKIM + DMARC sunt OBLIGATORII** (cu aliniere), nu opționale. DMARC minim pe `p=none`, apoi crești spre `quarantine`/`reject`. Fără ele, până și conținutul bun ajunge în spam.
- **Dezabonare cu un clic (one-click), onorată în maxim 2 zile.** Linkul de dezabonare trebuie să fie pe TOATE emailurile de marketing și să funcționeze imediat.
- **Nu schimba domeniul, expeditorul și volumul în aceeași zi** — orice schimbare bruscă pică reputația.

**Ordinea corectă de configurare: SPF → DKIM → DMARC → BIMI.** Întâi autentifici (SPF, DKIM), apoi pui politica (DMARC), și DOAR la final, după ce DMARC e pe enforcement, publici BIMI (logo-ul brandului afișat în inbox). BIMI aduce +4–6% deschideri și protecție anti-falsificare, dar e răsplata vizibilă a autentificării corecte, nu primul pas.

**Curba de warm-up (domeniu/expeditor nou sau rece):**
- Începe cu cei mai CALZI contacte (clienți cu vizită recentă, click anterior, comenzi recente), nu cu toată lista.
- Crește volumul treptat, val cu val. După fiecare val verifici bounce și plângeri ÎNAINTE să mărești.
- Mărești doar dacă **plângeri sub 0,1% și bounce sub 2%**.
- O listă de 20.000 nu se trimite "mâine la toți" — se eșalonează pe câteva zile.

**Politica de sunset (curățare listă):**
- Inactivi **90–180 zile** → o încercare de re-angajare ("ne-a fost dor de tine" + sondaj/stimulent).
- Dacă nu reacționează nici după campania de win-back, la ~180 de zile inactivitate → îi treci pe lista de suprimare (sunset). Trimiterea către adrese moarte e calea cea mai rapidă spre un val de plângeri/bounce și suspendarea contului.
- Creștere sănătoasă a listei = 8–15% pe lună, net de pierderi.

**Benzi RFM pentru frecvență (cât de des trimiți, pe cine):**
- Definește nivelurile de implicare pe **click + conversie + recență**, NU pe deschideri (Apple Mail umflă deschiderile cu 15–60%).
- **Foarte activi** → mai des. **La risc / inactivi** → mai rar. **Sunset** → deloc.
- **Frequency cap GLOBAL**: maxim 1–2 mesaje de marketing/client/zi, ~3–5/săptămână, pe TOATE canalele la un loc (email + push + WhatsApp). Fără acest plafon, fluxurile automate + campaniile bombardează aceeași persoană.

**De ce nu te ghidezi după deschideri (open rate):** Apple Mail pre-încarcă pixelul și umflă artificial deschiderile cu 15–60%. KPI-urile reale, neafectate: **click, CTOR, conversie, bounce, plângeri**. Folosește deschiderile doar ca semnal grosier și doar prin "reliable opens" (filtrate de roboți).

## Fluxuri frecvente

### 1. Verificare pre-campanie mare ("Sunt gata să trimit la 5.000+?")
1. `comms_get_status` + `get_email_account_health` [citire] — verdict general pe tot contul: e vreo problemă cu trimiterile?
2. `get_brand_email_reputation` [citire] — nivelul brandului (bun / atenție / carantină / blocat) + rata de bounce și plângeri pe 7/30 zile. Dacă e "atenție" sau mai rău, **NU împinge campania mare**.
3. `get_sender_domain_status` [citire] — DKIM/SPF/DMARC verificate? Ce mai trebuie? (Dacă brandul n-are domeniu propriu, confirmă că se trimite de pe domeniile partajate Symbai.)
4. `analyze_email_deliverability_plan` [citire] — planul pe zile + capul pe oră + riscul Gmail/Yahoo bulk + igiena listei. NU trimite nimic, doar arată.
5. Dacă DNS-ul nu e gata sau reputația e în risc → repari întâi, abia apoi trimiți. Prezinți owner-ului în cuvinte simple ce e verde și ce e roșu.

### 2. Warm-up listă mare (ex. 20.000 contacte)
1. `get_sender_domain_status` + `get_brand_email_reputation` [citire] — baseline.
2. `analyze_email_deliverability_plan` [citire] — cap/zi + cap/oră + curba de warm-up.
3. Segmentezi: engaged → warm → cold (cu `get_customer_email_segments` / `get_email_segment_opportunities`).
4. **Valul 1 = DOAR engaged**, via `send_email_campaign_predictive({ campaignId, confirm:true })`.
5. După val: `get_email_campaign_analytics` [citire] — verifici bounce și plângeri.
6. Crești volumul DOAR dacă **plângeri sub 0,1% și bounce sub 2%**. Nu schimba domeniu/expeditor/volum în aceeași zi.

### 3. Curățare listă + sunset trimestrial
1. `get_email_analytics_overview` + `get_brand_email_reputation` [citire] — starea de plecare.
2. `get_customer_email_segments` [citire] — identifici inactivii de 90–180 zile.
3. Campanie de re-angajare "ne-a fost dor de tine" + sondaj/stimulent (`create_email_campaign`).
4. După fereastră, non-responderii → `add_email_suppression({ email, reason:"unsubscribe" })` (sunset) — scrie din primul apel, fără `confirm`: arată lista și cere acordul omului ÎNAINTE.
5. Re-verifici reputația. Dacă bounce/plângeri erau ridicate, oprești creșterea volumului până se curăță.

### 4. Reacție la SPIKE de bounce sau plângeri (urgent)
1. **Oprești imediat creșterea volumului** — nu mai trimite valuri noi mari.
2. `get_email_account_health` + `get_brand_email_reputation` [citire] — cât de rău e și de ce.
3. `list_email_logs` [citire] — vezi exact ce adrese au dat bounce dur / plângere / failed.
4. `add_email_suppression` [marketing; fără `confirm`, scrie din primul apel — acordul omului înainte] — adaugi adresele cu hard bounce și pe cei care s-au plâns. Motiv: `complaint` sau `unsubscribe`.
5. `analyze_email_deliverability_plan` [citire] — refaci planul de igienă.
6. Următorul val merge DOAR către contacte calde, în volum mic, până se stabilizează cifrele.

### 5. Configurare autentificare domeniu propriu (ordinea fixă)
1. `get_sender_domain_status` [citire] — ce e gata (SPF / DKIM / DMARC) și ce lipsește.
2. Owner-ul adaugă înregistrările DNS în această ordine: **SPF → DKIM → DMARC** (DMARC pornește pe `p=none`).
3. Re-rulezi `get_sender_domain_status` până când toate trei sunt verificate.
4. După ce DMARC e pe enforcement (`quarantine`/`reject`), abia atunci publici **BIMI** (logo în inbox).
5. Pașii exacți de DNS și BIMI se fac **din aplicație** (pagina Configurare Email) — tool-ul de aici verifică starea, nu editează DNS-ul.

## Tool-uri MCP utile

Sănătate, reputație, domeniu (toate [citire]):
- `get_email_account_health` — verdict pe tot contul (sănătos/atenție/risc), rate livrare/bounce/plângeri pe 30 zile, ce branduri sunt în carantină. Fără parametri.
- `get_brand_email_reputation({ brandId })` — nivelul brandului + bounce + plângeri pe 7/30 zile + dacă au fost auto-pauzate campanii. Folosit pentru "de ce nu mai pleacă emailurile / de ce sunt în carantină".
- `get_sender_domain_status({ brandId })` — DKIM/SPF/DMARC pe domeniul propriu: ce e gata, ce mai trebuie. Fără domeniu propriu → confirmă trimiterea de pe domeniile partajate Symbai.

Listă de suprimare:
- `get_email_suppression_list({ brandId, search?, limit?, offset? })` [citire] — cine nu mai primește emailuri și de ce (dezabonare / plângere / bounce dur / manual). Folosit pentru "de ce nu primește X emailurile".
- `add_email_suppression({ email, reason?, detail?, brandId })` [marketing; fără `confirm` — se aplică din primul apel, deci acordul omului înainte] — adaugi o adresă pe lista de suprimare. `reason`: `unsubscribe` / `complaint` / `manual` (default `manual`). Acțiune GDPR pozitivă, ireversibilă din UI.

Verificare conținut + plan livrabilitate (toate [citire], NU trimit):
- `check_email_campaign_deliverability({ campaignId })` — scor rapid de spam pe o campanie: subiect agresiv, CTA lipsă, HTML prea mare, cuvinte riscante, personalizare slabă. Rulează ÎNAINTE de test-send.
- `analyze_email_deliverability_plan({ campaignId })` SAU `({ brandId, audienceType, audienceConfig })` — planul complet: readiness SMTP/DNS, reputație, igienă listă, risc Gmail/Yahoo bulk, warm-up pe zile, cap pe oră.

Trimitere predictivă (warm-up + ore individuale):
- `enable_email_predictive_sending({ campaignId, ... })` [marketing] — activează trimiterea per destinatar pe o campanie draft. NU trimite, doar salvează planul. Util `maxRecipientsPerHour` (cap soft pentru warm-up), `quietStartHour`/`quietEndHour` (default 22–08).
- `send_email_campaign_predictive({ campaignId, confirm:true, maxRecipientsPerHour?, allowedHours?, fallbackHours? })` [marketing, confirm:true] — **trimitere REALĂ**, eșalonată pe ore individuale și cu cap pe oră. Ideal pentru warm-up. Confirmă explicit înainte.

Permisiuni:
- `check_marketing_allowed` [citire] — verifică dacă ai voie să trimiți marketing pe segmentul respectiv (consimțământ).

> Notă: configurarea DNS/SPF/DKIM/DMARC/BIMI și conectarea unor unelte externe de monitorizare (ex. Postmaster Google) se fac **din aplicație** sau în contul tău de la furnizorul de domeniu — tool-urile de aici verifică STAREA, nu editează DNS-ul.

## Întrebări frecvente și capcane

- **De ce nu mai pleacă deloc emailurile mele?** Cel mai probabil ești în carantină/blocat din cauza plângerilor sau bounce-ului. Rulezi `get_brand_email_reputation` + `get_email_account_health`. Dacă plângerile au atins ~0,3%, domeniul e practic oprit — trebuie pauză, curățare listă agresivă (sunset) și re-pornire lentă doar pe contacte calde.
- **Câte emailuri pot trimite pe zi fără probleme?** Sub 5.000/zi către același furnizor ești sub pragul "bulk". Peste, regulile stricte (SPF+DKIM+DMARC, one-click unsubscribe în 2 zile, plângeri sub 0,1%) sunt OBLIGATORII. Oricum, la liste mari nu contează "câte poți", ci warm-up-ul gradual.
- **Bounce-ul a sărit mare, ce fac?** Oprești creșterea volumului, verifici `list_email_logs`, suprimi imediat hard bounce-urile cu `add_email_suppression`, rulezi `analyze_email_deliverability_plan` și trimiți următorul val DOAR către contacte calde. Bounce peste 2% = listă murdară.
- **De ce open rate-ul pare ciudat / prea mare?** Apple Mail Privacy Protection și roboții umflă deschiderile cu 15–60%. Nu lua decizii pe deschideri brute — folosește click, CTOR, conversie, bounce și plângeri. Acestea sunt singurele cifre de încredere.
- **Trebuie să-mi configurez domeniul cu SPF/DKIM/DMARC?** Da, e obligatoriu în 2026 dacă vrei să intri în inbox la volume reale. Ordinea: SPF → DKIM → DMARC (start pe `p=none`). Verifici starea cu `get_sender_domain_status`. BIMI vine ABIA după ce DMARC e pe enforcement.
- **Ce e BIMI și când îl pun?** E logo-ul brandului afișat lângă email în inbox (+4–6% deschideri, protecție anti-falsificare). Îl publici ULTIMUL, doar după ce SPF/DKIM/DMARC sunt verificate și DMARC e pe `quarantine`/`reject`. Înainte de asta, nu are efect.

**Capcane de evitat:**
- **Trimitere la toată lista rece din prima zi.** Risc maxim de spam, bounce și reputație distrusă. Warm-up gradual, segmente calde întâi.
- **Open rate ca unic KPI.** E ușor de distorsionat (Apple MPP). Decizia bună vine din click + conversie + plângeri.
- **DNS neverificat.** Fără SPF/DKIM/DMARC, conținutul bun tot ajunge în spam.
- **Lipsa dezabonării cu un clic.** Obligatorie pe toate emailurile de marketing și onorată în maxim 2 zile, altfel cresc plângerile.
- **Nu schimba domeniu + expeditor + volum în aceeași zi.** Orice schimbare bruscă pică reputația.
- **Confirmare sărită.** Orice trimitere reală (`send_email_campaign_predictive`) e ireversibilă — confirmă în cuvinte audiența, ritmul și riscurile înainte de `confirm:true`.
- **Ignorarea sunsetului.** Adresele moarte sunt cea mai rapidă cale spre un val de plângeri/bounce și suspendarea contului. Curăță la 90–180 zile inactivitate.

## Vezi și

- `knowledge/email-marketing.md` — campanii, fluxuri automate, trimitere predictivă, A/B, atribuire conversii.
- `knowledge/marketing-social.md` — postări organice, reclame, atribuire pe canale.
- `knowledge/gdpr-clienti-oaspeti.md` — consimțământ, dezabonări, anonimizare.
- skill-ul `gestioneaza-crm` — fluxuri de retenție (welcome, win-back, aniversare, sunset) și automatizări.
- skill-ul `gaseste-pagina` — link direct către Configurare Email, Statistici Email, Loguri Email.
