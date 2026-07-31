# Biblioteca de Fluxuri Email (Lifecycle) 2026

> Pentru linkul exact catre orice pagina foloseste tool-ul `gaseste_in_aplicatie` — el e sursa autoritara de navigare.

## Pe scurt

Fluxurile automate de email (welcome, aniversare, win-back, cos abandonat etc.) aduc in 2026 aproape jumatate din venitul pe email din doar ~5% din trimiteri — adica de ~18 ori mai multi bani pe fiecare destinatar decat un newsletter trimis manual. Inainte sa pornesti o cadenta de campanii „de mana", construieste intai aceasta biblioteca de fluxuri: ele lucreaza singure, 24/7, si prind clientul la momentul potrivit. Acest fisier iti da reteta gata-de-construit pentru fiecare flux: declansatorul, intarzierile dintre pasi, ramura (a deschis / a cumparat), oferta, iesirea (sunset), tinta KPI si tool-ul cu care il faci.

Claude Code lucreaza MCP-first: citeste datele reale ale brandului, face draft-ul fluxului, ruleaza verificarea de livrabilitate, arata clar utilizatorului ce se va intampla si cere confirmare explicita inainte sa porneasca trimiteri reale.

## Concepte

- **Flux (flow) vs campanie** — fluxul porneste singur la un declansator (vizita, ziua de nastere, cos abandonat) si trimite pe pasi cu intarzieri; campania e o trimitere unica catre o lista. In 2026 fluxurile dau ~41% din venitul pe email din ~5,3% din trimiteri — RPR de ~18x si rata de click ~3x mai mare (5,58% vs 1,69%). **Tinta: 50-60% din tot venitul pe email sa vina din fluxuri.**
- **RPR (venit pe destinatar)** — banii adusi impartiti la cati au primit emailul. E metrica regina la fluxuri; un click ieftin nu inseamna nimic daca nu se transforma in vizita/comanda.
- **Ramura „a deschis / a dat click / a cumparat"** — dupa fiecare pas, fluxul se imparte: cine a reactionat primeste un mesaj (sau iese din flux pentru ca a cumparat deja), cine n-a reactionat primeste alt mesaj (reminder sau incentiv mai puternic). **Iesirea la conversie e obligatorie** — nu mai trimite reminder de cos cuiva care deja a platit.
- **Sunset (apus)** — la capatul scarii de win-back, cine tot nu reactioneaza dupa ~180 de zile de inactivitate il scoti din trimiterile active (suprimare). Trimiterea catre adrese moarte e cel mai rapid drum spre reclamatii de spam si suspendarea contului de email.
- **Tiere de engagement, nu open rate** — Apple Mail umfla deschiderile cu 15-60% (sunt false). Judeca fluxurile pe **click, conversie, plangeri si bounce**, nu pe „cat la suta au deschis". Defineste „client activ / la risc / inactiv" dupa click + cumparaturi + recenta, nu dupa deschideri.
- **Reguli de bulk-sender (precondicie, nu optiune)** — peste 5.000 emailuri/zi catre un furnizor (Gmail/Yahoo/Microsoft) ai nevoie de domeniu autentificat (SPF+DKIM+DMARC), dezabonare 1-click onorata in max 2 zile, si rata de plangeri **sub 0,1%** (la 0,3% domeniul e practic mort). Verifica intai cu `get_sender_domain_status` si `get_brand_email_reputation`.
- **Plafon global de frecventa** — fluxurile + campaniile NU trebuie sa bombardeze acelasi om. Tine maximum 1-2 mesaje marketing/client/zi (~3-5/saptamana) pe toate canalele, cu ora de liniste 22:00-08:00 in fusul clientului.
- **Numar valoros: o vizita recuperata = o nota intreaga** (~200-330 lei la HoReCa). De-asta win-back-ul si aniversarea au cel mai bun randament din toate automatizarile.

## Fluxuri frecvente

Fiecare flux de mai jos il construiesti ca secventa cu `create_email_sequence` (pasi + intarzieri) sau ca o campanie de tip flux cu `create_email_campaign` (`campaignType:"flow"` cu `flowSteps`/`flowEdges` pentru ramuri „a dat click / a cumparat"). Inscrii clientii cu `enroll_customers_in_email_sequence({ confirm:true })` sau pornesti fluxul cu `activate_email_flow({ confirm:true })`. **Toate cer confirmare explicita — pornesc trimiteri reale.**

### HoReCa (restaurant / hotel)

**1. Welcome (bun venit) — 3 pasi**
- Declansator: client nou / prima vizita / abonare. **Trimite primul email in cateva minute.**
- Pasi: (0h) bun venit + povestea brandului + un beneficiu mic; (+3 zile) ce te face special (preparate-vedeta, valori); (+7 zile) prima oferta cu termen.
- Ramura: cine a dat click la pasul 2 → sari direct la oferta; cine n-a deschis → reminder bland.
- Oferta: mica, prietenoasa la pasul 3 (ex. desert/cafea din partea casei la prima rezervare).
- Sunset: daca nu deschide niciun pas, il lasi in lista normala, nu-l suprimi inca.
- KPI tinta: **open 50-70% la primul email, CTR 15-25%, conversie 12-18%.** Welcome aduce ~320% mai mult venit pe email decat o campanie obisnuita.

**2. Post-vizita + cerere de recenzie**
- Declansator: comanda/vizita inchisa. Pas 1 la cateva ore-1 zi: „multumim, sper ca ti-a placut".
- Ramura: experienta buna → cere recenzie (link Google/TripAdvisor); semnal slab → intreaba intai „ce putem imbunatati" si muta in privat.
- Tool: cererea de recenzie dupa comanda se trimite cel mai curat cu `dispatch_review_invitations_for_order` (vezi `knowledge/raspunde-recenzii.md`).
- Sunset: un singur memento de recenzie; nu insista.
- KPI tinta: 8-15 recenzii noi/luna/locatie; rata de raspuns la recenzii ≥80%.

**3. Aniversare (ziua clientului) — cea mai profitabila automatizare**
- Declansator: data nasterii din fisa clientului. **Trimite cu 7-14 zile INAINTE**, nu in ziua respectiva (sa apuce sa rezerve).
- Pasi: 1 email cald, personal, cu oferta **datata si rezervabila** (valabila ±cateva zile in jurul zilei).
- Oferta: cadou clar (desert, sticla de vin, -X% la masa de aniversare) cu termen.
- Sunset: 1 reminder cu ~2 zile inainte de expirare daca n-a rezervat.
- KPI tinta: **cel mai mare RPR din toate automatizarile (~350-400 lei/revendicare).** Personal — fara holdout.

**4. Win-back (recuperare) — scara 45/60/90 zile**
- Declansator: au trecut ~45-60 de zile de la ultima vizita (ruleaza intai `recompute_loyalty_rfm` + `evaluate_loyalty_drop_alerts`).
- Pasi pe 10-14 zile: (1) „ne e dor de tine", FARA discount; (2) +3-7 zile, daca n-a revenit → oferta datata dimensionata dupa valoarea clientului (RFM); (3) +5-7 zile → SMS/WhatsApp „last-chance" pe segmentul cald care n-a deschis emailul.
- Ramura: a cumparat → iese din flux; a dat click dar n-a cumparat → incentiv mai puternic; n-a deschis → al doilea canal.
- Cel mai bun moment: Joi/Vineri 16:00-18:00 (ora deciziei de cina).
- Sunset: cine nu reactioneaza dupa toata scara (~90 zile, sau dupa 3-4 incercari) → `add_email_suppression`.
- KPI tinta: **12-18% revin** (mai sus cand emailul e dublat cu SMS/WhatsApp). Win-back are dezabonare mai mare — e normal si util pentru igiena listei.

**5. VIP / Champions**
- Declansator: segment top RFM (vizite dese + cheltuiala mare). Recompute lunar cu `recompute_loyalty_rfm`.
- Pasi: tratament preferential — acces devreme la evenimente, meniu nou inainte de lansare, multumire personala, perk de tier de loialitate.
- Oferta: experienta, nu reducere agresiva (sunt deja loiali); foloseste recompense de loialitate (`create_loyalty_reward`).
- Sunset: nu se suprima; daca un VIP se raceste, intra pe win-back cu oferta mai generoasa + atingere personala.
- KPI tinta: pastreaza frecventa de vizita; membrii loiali viziteaza cu +22% si cheltuie cu +18-38% mai mult.

**6. Sunset (apus listei) — igiena trimestriala**
- Declansator: inactivi 90-180 de zile (`get_customer_email_segments`).
- Pasi: o ultima campanie „we miss you" + scurt sondaj/incentiv; cine nu reactioneaza in fereastra → suprimare.
- Tool: `add_email_suppression({ confirm:true })` pe non-responderi; apoi reverifica reputatia.
- KPI tinta: crestere sanatoasa a listei 8-15%/luna NET de pierderi; plangeri sub 0,1%, bounce sub 2%.

### Retail (magazin online)

**7. Cos abandonat (abandoned cart) — 1h / 24h / 72h**
- Declansator: cos creat, fara plata.
- Pasi: (1h) reminder simplu „ti-au ramas produsele in cos"; (24h) beneficii + dovada sociala (recenzii produs); (72h) incentiv mic (transport gratuit / -X%).
- Ramura: **iesire imediata la conversie** (a platit → stop). Cine a dat click dar n-a platit → pasul cu incentiv.
- Oferta: la pasul 3, nu mai devreme (sa nu inveti clientii sa abandoneze ca sa primeasca reducere).
- Tool oferta: `create_offer` sau `create_discount_code` pentru codul de transport/reducere.
- KPI tinta: emailurile de cos se **deschid ~50%, convertesc ~3,3%, recupereaza 8-12%** din cosuri.

**8. Browse abandonment (a privit, n-a pus in cos)**
- Declansator: a vizitat insistent pagini de produs/categorie, fara sa adauge in cos.
- Pasi: (cateva ore) „ai vazut X — iata de ce place"; (+1-2 zile) produse similare / recomandari.
- Ramura: a adaugat in cos → trece pe fluxul de cos abandonat; a cumparat → iesire.
- Oferta: de regula fara reducere — informativ + dovada sociala; intentia e mai slaba decat la cos.
- Tool recomandari: `set_product_recommendations` pentru produsele afisate.
- KPI tinta: CTR peste medie; randament mai mic decat cosul, dar volum mare.

**9. Replenishment (reaprovizionare — produse care se termina)**
- Declansator: a trecut intervalul tipic de re-cumparare al produsului consumabil (ex. cafea, cosmetice, hrana animale).
- Pasi: 1 email „probabil ti se termina X — comanda din nou in 1 click" cu putin inainte de momentul estimat.
- Ramura: a cumparat → reseteaza ceasul; n-a cumparat → 1 reminder.
- Oferta: optional, abonament/comanda recurenta cu mic avantaj.
- KPI tinta: RPR ridicat — e intentie pura; converteste mult mai bine decat o campanie generica.

**10. Back-in-stock (a revenit pe stoc)**
- Declansator: client care a cerut notificare → produsul redevine disponibil.
- Pasi: 1 email instant „X e din nou disponibil" + urgenta (stoc limitat).
- Ramura: a cumparat → iesire; n-a deschis in 24h → 1 reminder scurt.
- Oferta: de regula niciuna — disponibilitatea + urgenta sunt suficiente.
- KPI tinta: dintre cele mai mari rate de conversie din retail (cerere deja exprimata).

### Tabel benchmark pe flux (tinte 2026 de proiectare si notare)

| Flux | Open* | CTR | Conversie / Recuperare | RPR / Nota |
|---|---|---|---|---|
| Welcome (pas 1) | 50-70% | 15-25% | 12-18% | ~320% mai mult venit/email vs campanie |
| Aniversare | foarte mare | mare | — | **cel mai mare RPR**, ~350-400 lei/revendicare |
| Win-back | mediu | mediu | 12-18% revin | o vizita = ~200-330 lei |
| Post-vizita + recenzie | mare | — | 8-15 recenzii/luna | feedback + reputatie |
| Cos abandonat | ~50% | mare | recupereaza 8-12% (conv. ~3,3%) | RPR ridicat |
| Browse abandonment | mediu | mediu | mic, dar volum mare | informativ |
| Back-in-stock | mare | mare | foarte mare | intentie deja exprimata |
| Replenishment | mediu | mare | mare | RPR ridicat |

\* Open rate e doar semnal orientativ (umflat de Apple Mail). **Noteaza fluxul pe click, conversie, plangeri si bounce.**

### Reteta de pornire a unui flux (pasii MCP, in ordine)

1. **Verifica baza:** `get_email_account_health` + `get_brand_email_reputation` + `get_sender_domain_status`. Daca domeniul nu e autentificat sau reputatia e in risc, repara intai — altfel fluxul ajunge in spam.
2. **Segment:** `get_email_segment_opportunities` → `get_customer_email_segments` → `preview_email_audience` ca sa vezi exact cine intra.
3. **Construieste fluxul:** `create_email_sequence` (pasi + delay) sau `create_email_campaign({ campaignType:"flow", flowSteps, flowEdges })` pentru ramuri „a dat click / a cumparat".
4. **Oferta (daca e cazul):** `create_offer` (reducere care chiar scade nota la POS) sau `create_discount_code`. Ruleaza `preview_offer_margin` ca sa nu vinzi sub cost.
5. **Verifica continutul si livrabilitatea:** `check_email_campaign_deliverability` apoi `analyze_email_deliverability_plan`.
6. **Test:** `send_test_email_campaign` catre adresa utilizatorului.
7. **Confirma in cuvinte** cu utilizatorul (cine, ce, cand, ca sunt trimiteri reale) → **porneste:** `enroll_customers_in_email_sequence({ confirm:true })` sau `activate_email_flow({ confirm:true })`.
8. **Masoara la 7/30 zile:** `get_email_analytics_overview`, `get_email_conversion_attribution`; daca exista click fara conversie, `reconcile_email_conversions`.

## Tool-uri MCP utile

**Constructie si pornire flux** [marketing]
- `create_email_sequence` — creeaza secventa drip ca DRAFT (`name`, `steps:[{ delayMinutes, subject, body }]`, `brandId`). Nu trimite nimic.
- `create_email_campaign` — draft de campanie; pentru fluxuri foloseste `campaignType:"flow"` cu `flowSteps`/`flowEdges` (ramuri „a dat click / a cumparat" prin `sourceHandle` true/false).
- `enroll_customers_in_email_sequence` — inscrie clienti in secventa = **porneste trimiteri reale**; `sequenceId`, `customerIds`, `confirm:true`.
- `activate_email_flow` — porneste o campanie de tip flux (drip automat) = **ireversibil, trimite singur**; `campaignId`, `confirm:true`.
- `list_email_sequences` [citire] — vezi secventele existente si starea lor.

**Audienta si segmente** [citire]
- `get_email_segment_opportunities` — propune segmente utile din datele POS.
- `get_customer_email_segments` — segmente de clienti (engaged/inactivi etc.).
- `preview_email_audience` — vezi exact cine intra inainte de pornire.
- `recompute_loyalty_rfm`, `evaluate_loyalty_drop_alerts` — pentru win-back/VIP (cine s-a racit).

**Baza (sa nu ajungi in spam)** [citire]
- `get_email_account_health`, `get_brand_email_reputation`, `get_sender_domain_status` — autentificare domeniu + reputatie inainte de orice flux.
- `check_email_campaign_deliverability`, `analyze_email_deliverability_plan` — scor continut + plan de trimitere.
- `add_email_suppression` [marketing] — suprima la sunset (`confirm:true`); `get_email_suppression_list` [citire].

**Oferta din flux** [marketing]
- `create_offer` — reducere care chiar scade nota la POS. **Important: poti seta fereastra de timp** — `timeStart`+`timeEnd`+`daysOfWeek` pentru happy-hour recurent, sau `startsAt`/`expiresAt` pentru oferta cu termen (LTO). **Fara fereastra de timp, oferta merge non-stop (24/7).** Ruleaza intai `preview_offer_margin` ca sa stii unde esti pe marja — verdictul e informativ, nu blocheaza publicarea (din 31 iulie 2026).
- `create_discount_code` — cod de reducere/transport pentru pasul cu incentiv.
- `set_product_recommendations` — produse afisate in browse abandonment.

**Cerere de recenzie din post-vizita** [marketing]
- `dispatch_review_invitations_for_order` — trimite invitatia de recenzie dupa comanda (Google/TripAdvisor).

**Masurare** [citire]
- `get_email_analytics_overview`, `get_email_campaign_analytics`, `get_email_conversion_attribution`, `reconcile_email_conversions` (click fara conversie), `get_email_ab_test_report`.

**Aprobare trimitere** [citire] — `check_marketing_allowed`, `comms_get_status` inainte de orice trimitere in masa.

## Intrebari frecvente si capcane

- **De ce fluxuri inainte de newslettere?** Pentru ca un flux bun lucreaza singur si aduce de ~18 ori mai multi bani pe destinatar decat un email trimis de mana. Construieste intai setul minim — welcome, post-vizita+recenzie, aniversare, win-back, sunset; la HoReCa adauga aniversarea + ciclul de rezervare, la retail cos/browse/replenishment/back-in-stock.
- **Trebuie iesire la conversie?** Da, obligatoriu. Daca cineva a platit (cos) sau a revenit (win-back), **scoate-l din flux** — altfel trimiti reminder cuiva care deja a cumparat si pari neglijent.
- **Cand trimit aniversarea?** Cu **7-14 zile inainte**, nu in ziua respectiva — clientul are nevoie de timp sa rezerve. Oferta sa fie datata si rezervabila.
- **De ce nu ma uit la open rate?** Apple Mail deschide pixelul automat si umfla deschiderile cu 15-60% (sunt false). Judeca pe click, conversie, plangeri si bounce — astea nu mint.
- **Cand suprim un client (sunset)?** Dupa ce a trecut prin toata scara de win-back fara reactie (~180 zile inactiv sau 3-4 incercari esuate). A trimite la adrese moarte strica reputatia intregului brand. Pastreaza plangerile sub 0,1% si bounce-ul sub 2%.
- **Pot porni un flux pe toata lista deodata?** Nu pe o lista rece. Verifica intai reputatia + domeniul, porneste cu segmentul cel mai cald, urmareste bounce/plangeri dupa primul val si abia apoi creste. Pentru liste mari, vezi `knowledge/email-marketing.md` (warm-up).
- **Cum nu bombardez clientul cu flux + campanie in aceeasi zi?** Tine un plafon global de frecventa (1-2 mesaje/zi, ~3-5/saptamana pe toate canalele) si ora de liniste 22:00-08:00 in fusul clientului. Un singur canal pe promo/zi: push pentru urgent&scurt, email pentru bogat, WhatsApp pentru conversatie.
- **Win-back doar pe email?** Cele mai bune rezultate (12-18%) vin cand dublezi emailul cu SMS/WhatsApp (`send_whatsapp_message`) pe segmentul cald care n-a deschis — dar respecta consimtamantul si plafonul de frecventa.
- **Oferta din flux merge non-stop?** Da, daca nu-i pui fereastra de timp. Pentru happy-hour foloseste `timeStart`+`timeEnd`+`daysOfWeek`; pentru oferta de aniversare/eveniment foloseste `startsAt`/`expiresAt`. Verifica marja cu `preview_offer_margin` inainte sa nu vinzi sub cost.
- **Cum dovedesc ca fluxul aduce bani reali?** `get_email_conversion_attribution` leaga clickurile de comenzi/rezervari POS. Daca exista click fara conversie atribuita, ruleaza `reconcile_email_conversions` (fereastra ~7 zile). Pentru fluxurile de retentie, tine 10% holdout ca sa masori castigul incremental, nu doar trimiterile.

## Vezi si

- `knowledge/email-marketing.md` — campanii, sabloane, livrabilitate, warm-up, predictive sending, ore individuale.
- `knowledge/marketing-social.md` — postari, reclame, atribuire pe canale.
- `knowledge/loialitate-fidelizare.md` — tiere, recompense, RFM, date pentru win-back si VIP.
- `knowledge/raspunde-recenzii.md` — invitatii de recenzie dupa comanda + raspunsuri.
- `knowledge/gdpr-clienti-oaspeti.md` — consimtamant, dezabonari, suprimare.
- skill-ul `gestioneaza-crm` — pipeline, rezervari, automatizari pe verticalul tau.
