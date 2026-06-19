---
name: gestioneaza-comunicare
description: Gestioneaza comunicarea cu clientii si echipa prin MCP + Chrome: campanii email, newslettere, flow-uri automate, send-time optimization, deliverability/warm-up, A/B, atribuire conversii, sabloane, WhatsApp/Messenger/Instagram, push si linkuri de conectare. Foloseste la "trimite o campanie", "cand e cel mai bine sa trimit emailul", "creste open rate", "cum stam fata de ActiveCampaign", "de ce nu se livreaza", "cine mi-a scris", "raspunde pe WhatsApp", "dezaboneaza". Confirmare explicita obligatorie inainte de orice trimitere reala.
---

# Gestioneaza Comunicare — Email + WhatsApp + Push, MCP-First

Userul este proprietar/manager, nu programator. Tu faci munca grea prin tool-urile MCP: citesti date live, pregatesti drafturi, rulezi planuri dry-run, calculezi audienta, alegi orele recomandate, verifici livrabilitatea si arati clar ce se va intampla. Chrome este pentru navigare si vizualizare; adevarul operational vine din MCP.

Regula de aur: **orice trimitere reala cere confirmare explicita in cuvinte**. Nu seta `confirm:true` doar pentru ca tool-ul exista. Emailurile in masa, WhatsApp, push, linkurile de login, activarea flow-urilor si inscrierea in secvente sunt actiuni reale.

## Inainte De Orice

1. Citeste `knowledge/email-marketing.md`, `knowledge/comunicare-whatsapp.md` si, pentru regula generala MCP-first, `knowledge/claude-code-mcp-operare.md`.
2. Stabileste contextul: `list_brands` si, daca e relevant, `list_locations`. Pentru mai multe branduri, cere clar brandul daca userul nu l-a spus.
3. Verifica identitatea de trimitere: `comms_get_status`. Pentru WhatsApp: `list_whatsapp_accounts`.
4. Pentru email marketing, verifica sanatatea inainte de volum: `get_email_account_health`, `get_brand_email_reputation`, `get_sender_domain_status`.
5. Pentru pagini foloseste deep-link-uri stabile: `/email-campaigns`, `/email-templates`, `/email-setup`, `/email-analytics`, `/email-logs`, `/email-review`, `/whatsapp-inbox`, `/social-messages`. Daca nu esti sigur, `gaseste_in_aplicatie("campanii email")`.

## Intent -> Tool

| Userul cere | Tool MCP | Nota |
|---|---|---|
| "ce campanii am" | `list_email_campaigns` | filtreaza pe status daca e cazul |
| "cum a mers campania X" | `get_email_campaign_analytics` | livrare, reliable opens, click, CTOR, bounce, complaints |
| "cum stau in general cu emailul" | `get_email_analytics_overview` + `get_email_account_health` | overview + risc cont |
| "ce linkuri/dispozitive au mers" | `get_email_analytics_breakdowns` | top linkuri, funnel, device/client/tara |
| "a ajuns emailul la X" | `list_email_logs` | cauta pe adresa |
| "cine e suprimat/dezabonat" | `get_email_suppression_list` | cauta adresa sau lista |
| "de pe ce adresa pleaca" | `comms_get_status` + `get_sender_domain_status` | expeditor + DNS |
| "ce segment sa targetez" | `get_email_segment_opportunities` | propuneri din date POS/CRM |
| "cati primesc emailul" | `preview_email_audience` | dry-run obligatoriu |
| "cand sa trimit" | `analyze_email_send_time_plan` | plan serios, individual |
| "ore rapide recomandate" | `get_email_send_time_recommendations` | fallback/overview pe ore |
| "este safe sa trimit" | `analyze_email_deliverability_plan` | readiness, warm-up, cap/ora |
| "scor spam continut" | `check_email_campaign_deliverability` | subiect, CTA, HTML, risc |
| "fata de ActiveCampaign cum stam" | `get_email_competitive_audit` | audit enterprise parity |
| "fa campania/newsletter" | `create_email_campaign` | draft, nu trimite |
| "editeaza campania" | `update_email_campaign` | draft/programata |
| "activeaza ore individuale" | `enable_email_predictive_sending` | salveaza config, nu trimite |
| "trimite campania" | `send_email_campaign_predictive` | default recomandat pentru marketing |
| "trimite imediat/fix" | `send_email_campaign` | doar daca userul accepta fara predictive |
| "programeaza pe data X" | `schedule_email_campaign` | confirm-first; predictive daca e activ |
| "raport A/B" | `get_email_ab_test_report` | castigator provizoriu |
| "ROI/conversii din POS" | `get_email_conversion_attribution` | comenzi + rezervari atribuite |
| "recalculeaza conversii" | `reconcile_email_conversions` | nu trimite nimic |
| "fa un sablon" | `create_email_template` | reutilizabil |
| "fa flow/drip" | `create_email_campaign` cu `campaignType:"flow"` sau `create_email_sequence` | draft |
| "porneste flow-ul" | `activate_email_flow` | confirm-first |
| "inscrie clienti in secventa" | `enroll_customers_in_email_sequence` | confirm-first |
| "trimite-mi un test" | `send_test_email_campaign` | la o singura adresa |
| "nu-i mai trimite lui X" | `add_email_suppression` | GDPR pozitiv |
| "cine mi-a scris" | `list_conversations` | WhatsApp/Messenger/Instagram |
| "arata firul" | `get_conversation_messages` | citeste inainte de raspuns |
| "raspunde-i clientului" | `reply_to_conversation` | confirm textul |
| "trimite WhatsApp" | `send_whatsapp_message` / `send_whatsapp_media` | confirm numar + text |
| "notifica personal/clienti" | `push_notify_staff` / `push_notify_customers` | confirm-first |
| "trimite link de conectare" | `send_magic_login_link` | credential pe email, confirm-first |

## Reteta Standard Pentru Campanie Email

**Nu sari pasii.** Pentru orice campanie de marketing reala:

1. **Context** — `list_brands` -> brandul corect; `comms_get_status`.
2. **Health** — `get_email_account_health`, `get_brand_email_reputation`, `get_sender_domain_status`.
3. **Segment** — daca userul nu stie cui sa trimita, `get_email_segment_opportunities`. Apoi `preview_email_audience`.
4. **Draft** — `create_email_campaign` sau `update_email_campaign`. Pentru A/B foloseste `abTest`; pentru personalizare foloseste template overrides/conditional content.
5. **Deliverability continut** — `check_email_campaign_deliverability`.
6. **Deliverability plan** — `analyze_email_deliverability_plan`. Pentru 5k+ contacte este obligatoriu.
7. **Send-time plan** — `analyze_email_send_time_plan`. Pentru marketing, acesta este noul default.
8. **Test** — `send_test_email_campaign` daca userul vrea validare in inbox.
9. **Explica si cere confirmare** — campanie, audienta, cate emailuri, ritm, fereastra, riscuri, metoda de trimitere.
10. **Trimite** — `send_email_campaign_predictive({ campaignId, confirm:true, ... })`, cu aceiasi parametri de ore/cap aprobati. Daca e programata pe viitor, `schedule_email_campaign` dupa `enable_email_predictive_sending`.
11. **Verifica dupa** — `get_email_campaign_analytics`, `get_email_analytics_breakdowns`, `get_email_ab_test_report`, `get_email_conversion_attribution`.

Formula de confirmare buna:

> "Am pregatit campania `Nume` pentru brandul `X`. Ar primi `N` destinatari. Recomand sa nu plece instant, ci predictiv pe `36h`, intre `08:00-22:00`, cu maxim `Y` destinatari/ora. Planul de livrabilitate spune `risc`. Confirmi sa o pornesc asa?"

Daca raspunsul nu e un "da/confirm" clar, nu trimiti.

## Liste Mari, De Tip Drimonad 20.000 Contacte

Pentru liste mari, scopul este cresterea reala a performantei, nu doar livrare rapida:

- nu trimite toata lista rece intr-un singur val;
- foloseste `analyze_email_deliverability_plan` ca sursa pentru warm-up si cap pe ora;
- porneste cu contacte calde: vizita recenta, click anterior, comenzi recente, loialitate, taguri clare;
- foloseste `send_email_campaign_predictive`, nu broadcast fix;
- monitorizeaza bounce si complaints dupa fiecare val;
- daca bounce >= 2% sau complaints se apropie de 0.1%, opreste cresterea si curata lista;
- masoara click/conversie cu `get_email_conversion_attribution`, nu doar open rate.

Cand userul intreaba daca va avea open rate mai bun decat ActiveCampaign, raspunde onest: "sansele sunt bune daca folosim datele POS, segmentare calda, warm-up si predictive sending, dar nu promit un procent fara istoric si fara primele valuri". Apoi ruleaza tool-urile relevante.

## Flow-Uri Si Automatizari

Pentru flow-uri complexe:

1. afla triggerul: client nou, win-back, zi de nastere, rezervare, click/no-click, VIP;
2. creeaza structura cu `campaignType:"flow"`, `flowSteps` si `flowEdges` sau `create_email_sequence`;
3. foloseste delay-uri naturale, nu spam: 1 zi, 3 zile, 7 zile, 30 zile dupa caz;
4. pune conditii pe opened/clicked/converted/tag/lastVisit cand exista date;
5. inainte de activare, ruleaza audienta si deliverability;
6. `activate_email_flow(confirm:true)` doar dupa confirmarea explicita.

Flow-uri utile pentru HoReCa:

- Welcome dupa prima vizita -> poveste brand -> voucher revenire;
- Win-back 45/60 zile -> oferta usoara -> reminder doar daca a dat click;
- VIP/high value -> invitatie privata/eveniment;
- Birthday 30 zile -> rezervare/masa/grup;
- Click fara conversie -> follow-up cu CTA mai clar;
- Post-event/reservation -> multumire + review + revenire.

## WhatsApp, Conversatii Si Push

- Pentru inbox: `list_conversations`, apoi `get_conversation_messages`. Nu raspunde fara context.
- Pentru raspuns: propune textul, cere confirmare, apoi `reply_to_conversation(confirm:true)`.
- Pentru WhatsApp initiat de tine: confirma numarul si textul; tine cont de fereastra 24h si template-uri aprobate.
- Pentru push: arata cati destinatari, cere confirmare, apoi `push_notify_staff` sau `push_notify_customers`.
- Pentru link magic: este credential temporar, confirma adresa inainte de `send_magic_login_link(confirm:true)`.

## Ce Arati Vizual Userului

Cand userul vrea sa vada:

- campaniile: `/email-campaigns`;
- statistici: `/email-analytics`;
- loguri/destinatar: `/email-logs`;
- setup si domeniu: `/email-setup`;
- inbox WhatsApp: `/whatsapp-inbox`;
- mesaje social: `/social-messages`.

Dar nu verifica succesul prin pixel. Dupa orice write/send, confirma prin tool de citire: `list_email_campaigns`, `get_email_campaign_analytics`, `list_email_logs`, `list_conversations`.

## Reguli Care Nu Se Incalca

- Confirm-first pentru orice trimitere reala.
- `preview_email_audience` inainte de email in masa.
- `analyze_email_deliverability_plan` si `analyze_email_send_time_plan` inainte de campanii mari sau cand userul cere crestere open rate.
- Pentru marketing, prefera `send_email_campaign_predictive`; `send_email_campaign` este fallback, nu default.
- Nu promite open rate garantat. Optimizezi probabilitatea si masori.
- Nu inventa subiecte, oferte, testimoniale, reduceri sau numere fara acord.
- Nu repeta send-ul pentru ca UI nu s-a refresh-uit.
- Nu folosi SQL daca exista tool dedicat.
- Daca apare "permisiune insuficienta", explica Hub -> Acces AI -> modulul Comunicare.

## Legaturi

- `knowledge/email-marketing.md` — concepte si best practice actualizat pentru email.
- `knowledge/claude-code-mcp-operare.md` — modelul general de lucru cu MCP.
- `knowledge/comunicare-whatsapp.md` — WhatsApp si inbox unificat.
- `knowledge/segmentare-clienti.md` — segmente, taguri, grupuri.
- `knowledge/gdpr-clienti-oaspeti.md` — consimtamant, dezabonare, anonimizare.
- `knowledge/marketing-social.md` — postari, reclame, atribuire.
