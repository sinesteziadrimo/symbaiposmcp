# Email Marketing

> Pentru linkul exact catre orice pagina foloseste tool-ul `gaseste_in_aplicatie` — el e sursa autoritara de navigare.

## Pe Scurt

Modulul de email marketing acopera campanii simple, fluxuri automate complexe, sabloane, segmentare pe date POS/CRM, A/B testing, continut conditional, livrabilitate, reputatie, conversii atribuite si trimitere predictiva pe ore individuale. Diferenta fata de un tool generic este ca Symbai are date reale din restaurant/hotel: vizite, comenzi, rezervari, taguri, loialitate, last visit, spend si conversii POS.

Claude Code trebuie sa lucreze MCP-first: citeste datele reale, face drafturi, ruleaza planuri dry-run, arata utilizatorului clar ce se va intampla si cere confirmare explicita inainte de orice trimitere reala.

## Concepte

- **Campanie email** — o comunicare catre o audienta. Stari: **Draft**, **Scheduled**, **Sending/Active**, **Sent**, **Paused/Cancelled**. Poate fi simpla sau de tip **flow**.
- **Flow / automatizare** — secventa cu pasi de tip trigger, email, delay si condition. Exemplu: welcome -> asteapta 2 zile -> daca a dat click trimite oferta premium, altfel reminder bland.
- **Segment / audienta** — grup calculat din clienti, portal users, staff, B2B sau emailuri extra. Poate folosi taguri, conditii dinamice, grupuri, surse si excluderi.
- **Suppression / opt-out** — adrese care nu mai primesc email marketing: dezabonare, plangere spam, hard bounce sau suprimare manuala.
- **Reliable opens** — deschideri umane separate de machine opens / Apple Mail Privacy Protection. Open rate-ul brut este orientativ; deciziile serioase folosesc reliable opens, click, conversie, bounce si complaints.
- **Predictive sending** — trimitere la ore diferite per destinatar, calculata din istoricul uman de open/click/conversie, profil CRM, orele brandului si fallback HoReCa cand nu exista istoric.
- **Deliverability / warm-up** — verificare DNS/SMTP/reputatie/list hygiene plus plan pe zile si cap pe ora. Pentru liste mari este mai important decat subiectul emailului.
- **A/B test** — variante de subiect, continut sau CTA cu raport pe open/click/CTOR si castigator provizoriu.
- **Atribuire conversii** — leaga clickurile email de comenzi si rezervari POS in fereastra de atribuire, ca sa vezi venit real, nu doar opens.

## Pagini

- **Campanii Email** (`/email-campaigns`) — lista campaniilor, wizardul Configurare -> Sablon -> Audienta -> Revizuire, plus flow builder pentru automatizari.
- **Sabloane Email** (`/email-templates`) — galerie si editor vizual cu previzualizare desktop/telefon.
- **Configurare Email** (`/email-setup`) — expeditori, SMTP, domeniu de trimitere, test email, DKIM/SPF/DMARC unde e cazul.
- **Statistici Email** (`/email-analytics`) — overview, campanii, automatizari, bounce/dezabonari, funnel si top linkuri.
- **Loguri Email** (`/email-logs`) — fiecare destinatar si statusul lui: queued, sent, delivered, bounced, failed, complaint.
- **Revizuire Email-uri** (`/email-review`) — verificare continut, audienta, expeditor si readiness inainte de lansare.

## Workflow Recomandat Pentru O Campanie

1. **Context si stare cont** — `list_brands`, apoi `comms_get_status`, `get_email_account_health`, `get_brand_email_reputation` si `get_sender_domain_status`. Daca reputatia e in risc sau DNS-ul nu e gata, nu impinge campania mare.
2. **Oportunitati si segment** — `get_email_segment_opportunities` ca sa propui segmente utile din POS, apoi `get_customer_email_segments` si `preview_email_audience`. Pentru 20k contacte, nu incepe cu toata lista; porneste cu engaged/warm si creste gradual.
3. **Draft** — `create_email_campaign` sau `update_email_campaign`. Pentru flow-uri foloseste `campaignType:"flow"`, `flowSteps`, `flowEdges` sau `create_email_sequence` cand e o secventa drip separata.
4. **Scor continut** — `check_email_campaign_deliverability` inainte de test-send. Corecteaza subiecte agresive, HTML prea mare, CTA lipsa, personalizare slaba, linkuri dubioase.
5. **Plan livrabilitate** — `analyze_email_deliverability_plan`. Arata utilizatorului readiness-ul, riscurile Gmail/Yahoo bulk, igiena listei, warm-up pe zile si cap-ul pe ora.
6. **Plan ore individuale** — `analyze_email_send_time_plan`. Arata heatmap/sloturi recomandate, exemple de destinatari si fallback-ul folosit. Pentru broadcast mic poti folosi o ora fixa; pentru marketing real foloseste predictive.
7. **Test** — `send_test_email_campaign` catre o adresa a utilizatorului si, daca e nevoie, deschide pagina in Chrome ca sa vada vizual.
8. **Confirmare explicita** — spune clar: numele campaniei, audienta exacta, ritmul de trimitere, fereastra de ore, riscurile si faptul ca este trimitere reala.
9. **Send** — prefera `send_email_campaign_predictive({ campaignId, confirm:true, ... })`. Foloseste `send_email_campaign` doar daca utilizatorul cere explicit trimitere imediata/fixa si riscul este acceptabil. Pentru o data viitoare foloseste `schedule_email_campaign`; predictive se aplica daca este activ pe campanie.
10. **Dupa trimitere** — `get_email_campaign_analytics`, `get_email_analytics_breakdowns`, `get_email_ab_test_report`, `get_email_conversion_attribution`. Daca nu apar conversii dar exista clickuri, ruleaza `reconcile_email_conversions`.

## Trimitere Predictiva Si Ore Recomandate

Regula buna nu este "marti la 10 pentru toata lumea", ci "fiecare primeste in fereastra in care are cea mai mare sansa sa reactioneze, fara sa omoram reputatia domeniului".

Tool-uri:

- `get_email_send_time_recommendations` — recomandare usoara pe ore agregate, buna pentru raspunsuri rapide.
- `analyze_email_send_time_plan` — dry-run serios: istoric uman open/click/conversie, profil CRM, ore brand, quiet hours, cap per ora, heatmap si exemple individuale.
- `enable_email_predictive_sending` — salveaza configuratia predictiva pe campanie, nu trimite.
- `send_email_campaign_predictive` — trimitere reala, confirm-first, pune destinatarii in coada la ore individuale.
- `schedule_email_campaign` — programare la o data viitoare; daca predictive e activ pe campanie, trimiterile sunt esalonate individual.

Parametri utili:

- `timezone`: default `Europe/Bucharest`.
- `horizonHours` / `maxDelayHours`: fereastra in care ai voie sa esalonezi, de obicei 24-72h.
- `allowedHours`: ore permise explicit daca brandul are reguli clare.
- `quietStartHour` / `quietEndHour`: default 22-08.
- `maxRecipientsPerHour`: cap soft pentru reputatie si warm-up.
- `fallbackHours`: ore folosite cand nu exista istoric, uzual `[10,15,18]` pentru HoReCa.

Ce arati utilizatorului:

- "Nu trimitem toate cele 20.000 emailuri deodata."
- "Prima zi merge catre contactele cele mai calde, apoi crestem daca bounce/complaints raman mici."
- "Orele sunt individuale; sistemul evita noaptea si distribuie varfurile."
- "Open rate-ul estimat nu e garantie; urmarim click, conversie si plangeri."

## Liste Mari Si Warm-Up

Pentru 5k+ destinatari pe zi sau liste reci:

- verifica `get_sender_domain_status`: SPF, DKIM, DMARC si identitatea de expeditor;
- verifica `get_brand_email_reputation` si `get_email_account_health`;
- ruleaza `analyze_email_deliverability_plan` si respecta cap-ul pe zi/ora;
- porneste cu segmente engaged: clienti cu vizita recenta, click anterior, loialitate, comenzi recente;
- exclude contacte reci, hard bounce, complaints si domenii cu risc;
- nu schimba brusc domeniul, expeditorul si volumul in aceeasi zi;
- dupa fiecare val, verifica bounce, complaint, click si conversii inainte sa maresti volumul.

Pentru o lista de 20.000 contacte, obiectivul nu este "trimitem maine la toti", ci "trimitem suficient de repede incat sa conteze comercial si suficient de gradual incat sa protejam reputatia".

## Tool-uri MCP Utile

- Citire campanii: `list_email_campaigns`, `get_email_campaign_analytics`, `get_email_analytics_overview`, `get_email_analytics_breakdowns`, `list_email_logs`.
- Audienta si segmente: `get_customer_email_segments`, `preview_email_audience`, `get_email_segment_opportunities`.
- Livrabilitate si reputatie: `check_email_campaign_deliverability`, `analyze_email_deliverability_plan`, `get_sender_domain_status`, `get_brand_email_reputation`, `get_email_account_health`, `get_email_suppression_list`.
- Ore si predictive: `get_email_send_time_recommendations`, `analyze_email_send_time_plan`, `enable_email_predictive_sending`, `send_email_campaign_predictive`, `schedule_email_campaign`.
- Draft si continut: `create_email_campaign`, `update_email_campaign`, `create_email_template`, `create_email_sequence`.
- Send real: `send_test_email_campaign`, `send_email_campaign`, `send_email_campaign_predictive`, `schedule_email_campaign`, `activate_email_flow`, `enroll_customers_in_email_sequence`.
- A/B si ROI: `get_email_ab_test_report`, `get_email_conversion_attribution`, `reconcile_email_conversions`.
- GDPR: `add_email_suppression`, `check_marketing_allowed`, `list_gdpr_consent_log`.
- Audit competitiv: `get_email_competitive_audit` pentru Symbai vs ActiveCampaign Enterprise/Pro si prioritati concrete.

## Intrebari Frecvente

- **Cand trimit ca sa cresc open rate-ul?** Nu alege doar o ora fixa. Ruleaza `analyze_email_send_time_plan`, foloseste predictive sending si arata utilizatorului sloturile recomandate. Daca nu exista istoric, fallback HoReCa bun este 10:00-11:00, 15:00-16:00 si 18:00-19:00, dar validarea vine din datele brandului.
- **Pot bate open rate-ul din ActiveCampaign?** Posibil, dar nu garantat doar prin schimbarea platformei. Sansele cresc daca folosesti datele POS pentru segmentare, warm-up corect, ore individuale, continut personalizat si masori click/conversie, nu doar open.
- **De ce open rate-ul pare ciudat?** Apple Mail Privacy Protection, proxy-uri si roboti pot umfla sau ascunde deschiderile. Foloseste reliable opens, click rate, CTOR, conversii, bounce si complaints.
- **Ce fac daca bounce rate e mare?** Opresti cresterea volumului, verifici `list_email_logs`, cureti hard bounce/suppression, rulezi deliverability plan si trimiti urmatorul val doar catre contacte calde.
- **Cum calculez ROI?** `get_email_conversion_attribution`; daca exista clickuri fara conversii atribuite, `reconcile_email_conversions` cu o fereastra de 7 zile dupa click.
- **Cum trimit la o data fixa?** `schedule_email_campaign` cu confirmare. Pentru marketing mare, activeaza predictive inainte ca data fixa sa fie startul ferestrei, nu momentul unic pentru toti.
- **Ce fac cu o campanie deja trimisa?** Nu o editezi. Creezi o noua campanie pe segmentul potrivit: non-clickers, clicked-no-conversion, VIP, win-back etc.

## Capcane

- **Trimitere la toata lista rece din prima zi.** Risc mare de spam, bounce si reputatie deteriorata. Ruleaza warm-up si segmente calde.
- **Open rate ca unic KPI.** Este usor de distorsionat; decizia buna vine din click, conversie si complaints.
- **DNS neverificat.** Fara SPF/DKIM/DMARC si expeditor coerent, continutul bun tot poate ajunge in spam.
- **Subiect agresiv sau HTML incarcat.** `check_email_campaign_deliverability` trebuie rulat inainte de send.
- **Confirmare sarita.** Orice trimitere reala este ireversibila si trebuie confirmata in cuvinte.
- **Dublarea trimiterii pentru ca UI nu s-a refresh-uit.** Dupa orice write/send verifica prin tool de citire, nu repeta comanda pe baza ecranului.
- **Flow activ fara conditii clare.** Pentru automatizari complexe, documenteaza triggerul, delay-urile, conditiile si iesirea din flow.

## Vezi Si

- `skills/gestioneaza-comunicare/SKILL.md` — workflow operational pentru Claude Code.
- `knowledge/claude-code-mcp-operare.md` — regulile generale MCP-first, confirm-first si verificare prin citire.
- `marketing-social.md` — postari, reclame, atribuire.
- `segmentare-clienti.md` — segmente, taguri, RFM.
- `gdpr-clienti-oaspeti.md` — consimtamant, dezabonari, anonimizare.
- `loialitate-fidelizare.md` — date utile pentru personalizare si win-back.
