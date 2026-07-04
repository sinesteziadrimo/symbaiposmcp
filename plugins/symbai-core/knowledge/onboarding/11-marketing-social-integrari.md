# Onboarding 11 — Marketing: social media, email și integrări externe

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Context operațional complet despre marketing: `../marketing-social.md`; concepte Meta: `../integrari-meta.md`.

## Scopul fazei

La final, restaurantul are cel puțin o rețea socială conectată (tipic pagina de Facebook + Instagram), știe unde își gestionează postările și mesajele, are canalele de livrare declarate (dacă folosește Glovo/Wolt/Bolt/Tazz) și — opțional — o primă regulă de notificare automată. E o fază de „deschidere spre exterior": tot ce urmează în marketing (postări programate, agentul AI de marketing, inbox unificat, reclame) depinde de conturile conectate aici. Email marketing-ul se configurează integral din aplicație — rolul tău e de ghid + verificator.

## Permisiuni necesare pe token

- **`marketing_social`** — conectarea conturilor și postările: `genereaza_link_conectare`, `conecteaza_instagram_din_facebook`, `schedule_social_post`, `cancel_social_post`.
- **`setari`** — doar dacă faci și: canale de livrare (`create_delivery_channel`) sau reguli de notificare (`create_notification_rule`).

Citirile (`verifica_integrare`, `list_social_accounts`, `list_social_posts`, `read_brand_memories`, `browse_brand_media`, `list_brands`, `get_config_status`, `list_entities`) sunt disponibile mereu. Fără modulul potrivit bifat în portal Hub → Acces AI, tool-urile de scriere întorc „permisiune insuficientă" — cere utilizatorului să activeze modulul pe token și reîncearcă.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Afli singur (fără să anunți fiecare apel):**
1. `list_brands` — brandId (un singur brand → nu întrebi nimic; tool-urile de conectare/verificare îl deduc și singure atunci, dar `schedule_social_post` îl cere mereu explicit).
2. `verifica_integrare(serviciu="meta", brandId=...)` — checklist live: credențiale, pagină Facebook, token valid (testat pe API-ul Meta), Instagram, cont de reclame. Îți spune exact ce e deja legat și ce lipsește — NU porni conectarea de la zero dacă jumătate există.
3. `list_social_accounts(brandId)` — ce conturi sunt deja conectate și active pe TOATE platformele.
4. `list_social_posts(brandId, limit=10)` — există deja activitate (ciorne/programate)? Nu propune „prima postare" cuiva care are 50.
5. `read_brand_memories()` + `browse_brand_media(brandId)` — vocea brandului și pozele disponibile, ÎNAINTE de a propune conținut pentru o postare.
6. `list_entities(entityType="delivery_channels", brandId)` și `list_entities(entityType="notification_rules", brandId)` — ce canale de livrare și reguli există deja.

**Întrebi utilizatorul (minimul):**
1. *„Pe ce rețele e prezent restaurantul azi — Facebook, Instagram, TikTok, Google (harta), altele? Pe care vrei să le legăm acum?"* — leagă doar ce folosește, nu tot meniul de platforme.
2. *„Vrei și promovări plătite (reclame pe Facebook/Instagram), sau deocamdată doar postări normale?"* — decide dacă atingi contul de reclame (`meta_ads`).
3. *„Primiți comenzi prin Glovo, Wolt, Bolt Food sau Tazz? Prin care?"* — doar dacă da, creezi canalele de livrare.
4. Confirmare înainte de orice scriere vizibilă: la postare — textul, platformele, data/ora; la regulă de notificare — pe scurt ce declanșează și ce face.

Nu întreba de email marketing decât la final și doar ca ofertă („vrei să-ți arăt și unde se configurează trimiterea de email-uri către clienți?") — nu e blocant și nu ai tool-uri de scriere pentru el.

## Pașii de execuție — tool-urile MCP exacte

**Pas 1 — Conectează Meta (Facebook + Instagram + opțional reclame).** Workflow-ul complet, pas cu pas, cu precondiții și capcane, e în skill-ul **`conecteaza-meta`** — încarcă-l și urmează-l; nu-l reinventa aici. Pe scurt, schema lui:
```
verifica_integrare(serviciu="meta")                  → diagnostic
genereaza_link_conectare(platforma="facebook")       → userul deschide linkul în browserul LUI
verifica_integrare(serviciu="meta")                  → confirmă pagina + token
conecteaza_instagram_din_facebook()                  → leagă IG Business direct (fără link separat)
genereaza_link_conectare(platforma="meta_ads")       → DOAR dacă vrea reclame
verifica_integrare(serviciu="meta")                  → checklist final
```
Aceeași schemă pentru celelalte platforme: `verifica_integrare("tiktok"|"youtube"|"linkedin"|"google_business")` → `genereaza_link_conectare(platforma=...)` → re-verifică. Idempotență: rulează ÎNTÂI `verifica_integrare` și lucrează doar pe ce lipsește — reconectarea unei pagini deja valide e inutilă.

**Pas 2 — Prima postare (opțional, dar e cel mai bun test).** Folosește skill-ul **`programeaza-postare`**. Apelul de bază:
```
schedule_social_post(brandId=1, content="...", platforms=["facebook","instagram"],
  scheduledAt="2026-06-20T19:00:00+03:00")
```
Obligatorii: `brandId, content, platforms`. Cu `scheduledAt` în viitor (ISO cu fus, presupune Europe/Bucharest dacă userul nu zice altceva) se publică AUTOMAT; fără el rămâne ciornă. Opțional `mediaUrls` (URL-uri PUBLICE — ia-le din `browse_brand_media`), `postType` (post/story/reel/carousel), `firstComment`. Confirmă apoi cu `list_social_posts(brandId, status="scheduled")`. Anulare: `cancel_social_post(postId=...)`.

**Pas 3 — Canale de livrare (modul `setari`, doar dacă folosește platforme):**
```
create_delivery_channel(platform="glovo", brandId=1, locationId=2, isActive=true)
```
`platform` ∈ `glovo | wolt | bolt_food | tazz | own`. Verifică întâi `list_entities(entityType="delivery_channels", brandId=1)` să nu dublezi. Atenție: tool-ul doar DECLARĂ canalul — cheile API ale platformei și activarea efectivă a fluxului de comenzi se fac din aplicație (vezi secțiunea următoare).

Pentru Glovo, după ce canalul există, explică fluxul oficial în limbaj simplu:
- utilizatorul are nevoie de la Glovo de: Partner API token, Glovo Store ID și Store Address External ID;
- în pagina de integrări livrare din Symbai apar URL-urile publice de trimis la Glovo: dispatch webhook, cancellation webhook și Menu JSON URL;
- sincronizarea completă de meniu validează meniul, apoi trimite la Glovo un `menuUrl`; modificările mici de preț/disponibilitate merg prin actualizare în masă;
- auto-accept-ul inteligent Glovo folosește traficul real din bucătărie (KDS) ca să promită un timp de pregătire realist; dacă ETA calculat trece peste limita maximă, comanda rămâne pentru accept manual;
- accept/gata/predare se trimit către Glovo din Symbai, dar platforma Glovo nu permite refuz/anulare generică din restaurant. Pentru refuz/anulare, utilizatorul folosește aplicația/suportul Glovo, iar anularea se reflectă apoi automat în Symbai.

**Pas 4 — O regulă de notificare simplă (modul `setari`, opțional):**
```
create_notification_rule(name="Alertă stoc scăzut", brandId=1,
  triggerType="stock_low", actionType="push_notification",
  triggerCondition={"threshold": 10}, active=true)
```
Obligatorii: `name, brandId, triggerType, actionType`. `triggerType` ∈ `customer_inactive | stock_low | order_completed | reservation_upcoming | birthday | review_received | shift_start | temperature_alert | custom`; `actionType` ∈ `email | sms | push_notification | webhook | internal_alert | questionnaire`. Idempotent pe nume: dacă există deja o regulă cu același nume, o întoarce pe aceea, nu duplică. Verifică cu `list_entities(entityType="notification_rules", brandId=1)`.

**După orice scriere: confirmă printr-un tool de CITIRE** (`verifica_integrare`, `list_social_posts`, `list_entities`), NU prin interfață — UI-ul are cache în browser și arată datele noi abia după refresh. Dacă userul zice „nu apare", spune-i să dea refresh; nu repeta scrierea, nu raporta bug.

## Ce se face DOAR din aplicație

- **Email marketing — TOT** (server SMTP, identitate expeditor, șabloane, campanii, statistici). Nu există tool-uri MCP de scriere. Ghidează în ordinea: 1) expeditor — `gaseste_in_aplicatie(intrebare="configurare email marketing SMTP expeditor")` (fără SMTP nimic nu pleacă; recomandă-i domeniu propriu verificat la furnizor — SPF/DKIM — altfel spam); 2) șablon (opțional) — `gaseste_in_aplicatie(intrebare="șabloane email")`; 3) campanie — `gaseste_in_aplicatie(intrebare="campanii email")` (wizard în pași: configurare → șablon → audiență → test + trimitere). Verificare după: cu SQL read-only activ poți citi `email_campaigns`/`email_sends`; altfel cere-i userului să confirme că emailul de test a sosit.
- **WhatsApp Business** (Meta direct sau Twilio) — nu e în `verifica_integrare`/`genereaza_link_conectare`. Ghidare: `gaseste_in_aplicatie(intrebare="conectare WhatsApp Business")`.
- **Credențialele API ale platformelor** (App ID/Secret Meta, TikTok, LinkedIn) — tab-ul de credențiale din pagina conturilor sociale; de regulă sunt deja puse central de Symbai. `verifica_integrare` îți spune dacă lipsesc; TikTok e gestionat central — dacă lipsește configurarea, trimite `trimite_ticket_symbai`, nu chinui userul.
- **Reguli de automatizare „bogate"** (discount automat, vouchere, puncte fidelitate, mesaje WhatsApp la evenimente — motorul cu zeci de declanșatoare și acțiuni combinabile): `gaseste_in_aplicatie(intrebare="acțiuni automate reguli clienți")` — acolo există și un agent AI in-app care construiește regula din limbaj natural. După ce userul termină, nu ai citire dedicată — folosește SQL (`automation_rules`) dacă e activ, altfel cere-i să-ți spună numele regulii create.
- **Viva Wallet (plăți card) și ANAF e-Factura** — apar în pasul de integrări al wizard-ului, dar țin de fazele de plăți/finanțe: `gaseste_in_aplicatie(intrebare="integrare Viva Wallet")` / `gaseste_in_aplicatie(intrebare="integrare ANAF e-Factura")`. Pentru istoricul configurărilor de integrare deja făcute, citește `read_integration_memory_files(fileType="integrations")`.
- **Cheile/activarea platformelor de livrare** (după `create_delivery_channel`): `gaseste_in_aplicatie(intrebare="integrări canale livrare Glovo")`. Pentru Glovo, cere tokenul/Store ID-urile de la Glovo, apoi copiază din Symbai cele trei URL-uri publice: dispatch webhook, cancellation webhook și Menu JSON URL.
- **Inbox-ul unificat, calendarul de conținut, reclamele, boost** — operare zilnică din aplicație; tu doar dai linkul cu `gaseste_in_aplicatie`.
- **Ștergerea** unui cont social / canal / regulă — doar din aplicație (prin MCP nu există ștergeri).

## Echivalentul în wizard-ul din aplicație

Pașii **18–21 din 29**: `/onboarding/step/18` Social Media, `/19` Email Marketing, `/20` Integrări, `/21` Automatizări. Toți patru sunt pași de GHIDARE — panouri informative cu butoane către paginile reale (conturi sociale, setări email, integrări, acțiuni automate), fără detecție de date și fără agent cu tool-uri de scriere; userul îi bifează manual cu „Următorul pas" sau „Sari acest pas". Conturile/postările/canalele create prin conexiunea ta SUNT vizibile în paginile către care trimit pașii, dar **progresul wizard-ului (bifa de pas) NU se actualizează prin conexiune** — dacă userul ține și wizard-ul deschis, spune-i să bifeze singur pașii 18–21.

## Verificare la final

1. `verifica_integrare(serviciu="meta", brandId)` → toate punctele relevante „ok": pagină conectată, token valid, Instagram legat (dacă s-a cerut), cont reclame (doar dacă s-a cerut). Idem pentru fiecare altă platformă conectată.
2. `list_social_accounts(brandId)` → conturile apar cu status activ.
3. Dacă s-a programat postarea de test: `list_social_posts(brandId, status="scheduled")` → apare cu data corectă.
4. Dacă s-au creat canale de livrare: `list_entities(entityType="delivery_channels", brandId)` → platformele cerute, active.
5. Dacă s-a creat regulă: `list_entities(entityType="notification_rules", brandId)` → regula există și e `enabled`.
6. Email (dacă userul a configurat din aplicație): confirmarea reală e emailul de test primit de user; opțional SQL pe `email_campaigns`.

## Capcane

- **Adevărul vine din server, nu din browser.** După FIECARE pas de conectare re-rulează `verifica_integrare` — nu declara succes pentru că userul a zis „gata". Tool-ul testează tokenul LIVE pe API-ul platformei.
- **Instagram NU are link de conectare separat** — `genereaza_link_conectare(platforma="instagram")` e refuzat de server. Ordinea: Facebook întâi, apoi `conecteaza_instagram_din_facebook`. Contul IG trebuie să fie Business/Creator și legat de pagina FB (detalii: `../integrari-meta.md`).
- **Linkul OAuth expiră în ~10 minute.** Dacă userul a întârziat, generează altul fără comentarii. Linkul se deschide în browserul LUI, logat în contul care administrează pagina; tokenul ajunge direct pe server — nu cere și nu primi niciodată parole/coduri prin chat.
- **Toate bifele de permisiuni** în dialogul Meta — o permisiune debifată „merge azi" și pică la prima postare, cu erori greu de legat de cauză.
- **Fără `scheduledAt` = ciornă** — nu se publică singură. Și `cancel_social_post` merge doar pe draft/scheduled/failed (+retry) — o postare publicată nu se mai anulează prin tool; ștergerea de pe platformă se face pe platformă.
- **`create_notification_rule` ≠ motorul „Acțiuni Automate".** Tool-ul scrie o regulă SIMPLĂ de notificare (trigger → email/sms/push). Regulile promovate de wizard-ul pasului 21 (discount automat, voucher de ziua de naștere, puncte fidelitate) sunt ALTĂ entitate, configurabilă doar din aplicație. Nu promite prin tool ce face doar motorul mare.
- **`create_delivery_channel` nu aduce comenzile.** Creează doar înregistrarea canalului; fără cheile API puse în aplicație și fără activarea platformei, comenzile de pe platformă NU intră în POS. Pentru Glovo, nu promite refuz/anulare din Symbai: accept/gata/predare merg prin conexiunea oficială, auto-accept-ul inteligent poate calcula ETA din KDS, dar refuzul/anularea se fac în aplicația/suportul Glovo și se reflectă apoi automat în Symbai.
- **Multi-brand: fiecare brand ↔ pagina lui.** Confirmă perechea brand–pagină ÎNAINTE ca userul să aprobe în dialogul Meta; conectarea paginii greșite la brandul greșit se vede abia la prima postare.
- **`mediaUrls` trebuie să fie URL-uri publice** — folosește `browse_brand_media` pentru cele din biblioteca brandului; nu inventa căi locale.
- **Jargon interzis în conversație**: nu spune „OAuth/token/API/endpoint" — spune „link de conectare", „conexiunea a expirat, o refacem într-un minut", „cheile platformei". WhatsApp/Glovo rămân nume de produse, sunt OK.
- **Simptomul „postările pică brusc pe eșuat"** (mai târziu, după onboarding) = aproape mereu token invalidat (parolă schimbată, security checkup). Diagnostic `verifica_integrare`, soluție reconectare — 1 minut, fără panică.
