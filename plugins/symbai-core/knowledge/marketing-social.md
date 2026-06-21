# Marketing, Website & Portal Public

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă tot marketingul restaurantului: postări social media (Facebook, Instagram, TikTok, YouTube, LinkedIn) cu calendar de conținut, campanii email, reclame plătite (Meta/Google) cu detecție de anomalii, Google Business Profile, evenimente Facebook, automatizări de marketing și de clienți, blog + SEO, website-ul public al brandului cu portal pentru clienți (meniu, atracții, jocuri, misiuni) și coduri QR (mese + QR dinamice).

## Concepte

- **Postare social** — conținut text + imagini/video publicat pe una sau mai multe platforme. Stări: **ciornă** (fără dată), **programată** (are dată în viitor), **publicată**, **eșuată** (token expirat/cont deconectat — se poate reîncerca), **anulată**. Pe lângă status, fiecare postare are o stare de **aprobare**: *în așteptare* / *aprobată* / *respinsă*. ⚠ Postările create de asistent/AI intră automat „în așteptare aprobare" și **NU se publică** (nici cele programate) până nu sunt aprobate. O postare programată dar neaprobată NU pleacă la ora setată.
- **Reminder Mode** — când platforma nu permite publicare directă, aplicația te anunță să publici manual la ora programată.
- **Campanie email** — simplă (un email către un segment) sau **flux** (secvență vizuală de pași). Trimiterea reală se face prin servere SMTP proprii, configurate per brand, cu identități de expeditor selectabile.
- **Campanie ads** — reclamă plătită Meta. Stări: Ciornă, Așteaptă aprobare manager (peste pragul de buget), În verificare la Meta (`pending_review` = bine, a intrat la verificare), În așteptare, Activă, Pauză, Finalizată, Eroare. **Șase tipuri pe care asistentul le poate crea DIRECT din chat** (skill-ul `gestioneaza-reclame`, cu confirmare de buget): **(1) Promovare postare (boost)** — amplifici o postare din feed (poză/carusel/video/reel); **(2) Trafic website** — duci lumea pe site/meniu/rezervări, cu buton (Comandă, Vezi meniul, Rezervă…); **(3) Mesaje (Messenger)** — clientul începe o conversație; **(4) Apeluri** — buton de sunat direct (rezervări telefonice); **(5) Aprecieri pagină** — crești urmăritorii paginii; **(6) Promovare eveniment** — împingi un eveniment de Facebook. Țintirea (zonă + rază, vârstă, buget zilnic) se setează la creare. ⚠ La zonă: **nu pune și toată țara, și un oraș din ea** — vezi capcana de mai jos.
- **Anomalie ads** — abatere detectată automat pe o metrică (cheltuieli, afișări, click-uri, CTR, CPC, CPM, conversii, CPA, ROAS), cu severitate (critică/ridicată/medie/scăzută), impact estimat în RON, cauză sugerată și acțiuni recomandate. Stări: deschisă, ignorată, amânată, rezolvată, fix aplicat.
- **Automatizare marketing** — robot care generează și publică postări recurente cu AI: prompt + frecvență (zile, oră) + platforme + tip conținut; poate cere materiale (poze/video) de la angajați și escaladează dacă nu primește la timp.
- **Acțiuni automate (automatizări clienți)** — reguli declanșator → efect (ex. zi de naștere → reducere; client inactiv → voucher de revenire). Alt sistem decât automatizările de marketing — acesta acționează pe clienți și operațiuni, nu pe postări.
- **Memorii brand** — cunoștințe persistente despre brand (Voce Brand, Public Țintă, Stil Vizual, Hashtag-uri, Competitori, General) folosite de AI la generarea de conținut.
- **QR masă** vs **QR dinamic** — QR-ul de masă duce clientul la meniul digital al mesei; QR-ul dinamic e un link scurt tipăribil (`/q/cod`) a cărui destinație (link extern sau pagină internă) se poate schimba oricând FĂRĂ re-tipărire, cu etichete și contor de scanări.
- **Promoții website** — bannere vizuale pe site (banner inline, bandă antet/subsol, modal lateral) care duc la o pagină/produs/URL. NU reduc prețul pe notă — pentru reduceri reale există motorul de Oferte din modulul de meniu.
- **Portal public** — partea de site dedicată clienților: meniu public, comenzi, rezervări, atracții, jocuri, misiuni/insigne/recompense, profil.

## Paginile modulului

**Centru de comandă marketing**
- **Performanță** (`/marketing/performance`) — hub cu tab-uri: Social Analytics, Atribuire, Anomalii, Experimente și feed de Activitate (toate acțiunile recente de marketing).
- **Strategie** (`/marketing/strategy`) — tab-uri Overview, Quarterly Plan, AI Strategist.
- **Plan Trimestrial Marketing** (`/marketing/quarterly-plan`) — generează plan pe trimestru: distribuție buget pe canale, campanii prioritare, milestones lunare, calendar sezonier, simulator What-If, istoric și performance review.
- **Canale Marketing** (`/marketing/channels`) — toate canalele (Google Ads, Meta Ads, Google Business, Email) în tab-uri, cu același UX, plus linkuri spre playbook-uri și agenți AI.
- **Wizard Cross-Channel** (`/marketing/cross-channel`) — campanie pe mai multe canale în 4 pași: obiectiv & nume → canale → buget zilnic → lansare (sumar). Versiunea veche e la `/marketing/cross-channel-legacy`.
- **Audiență** (`/marketing/audience`) — un singur ecran cu 4 tab-uri: **Inbox** (conversații/mesaje social, `?tab=inbox`), **CRM** (clienți, `?tab=crm`), **Segmente** (se gestionează din filtrele CRM), **Loialitate**.
- **Atribuire** (`/marketing/attribution`) — comparație canale × modele de atribuire, drum touchpoint → conversie, reconciliere zilnică GA4 ↔ Google Ads ↔ Meta ↔ CRM.
- **Experimente** (`/marketing/experiments`) — teste A/B de marketing (draft, în rulare, finalizate, anulate).

**Social media**
- **Postări / Story / Video** (`/social-hub`) — tot conținutul social într-un loc, comutabil între **Calendar** (planner pe zile) și **Listă** (filtre status/platformă/tip/campanie + statistici). Rutele vechi `/social-posts`, `/content-calendar`, `/story-manager` redirectează aici. Acțiuni: previzualizare, reprogramare, programare în masă, asignare la campanie.
- **Evenimente Facebook** (`/facebook-events`) — creezi evenimente cu categorie (Muzică, Dining, Festival...), poză cover, co-hosts (invitații), vezi răspunsurile RSVP, publici postări în feed-ul evenimentului, duplici sau anulezi evenimentul, deschizi linkul pe Facebook.
- **Configurare Conturi Social** (`/social-media`) — conectezi conturile per brand: Facebook, Instagram, TikTok, YouTube, LinkedIn, WhatsApp (inclusiv WhatsApp Business API) + configurare CAPI (Meta Conversions API).
- **Bibliotecă Media** (`/brand-media-library`) — pozele/video-urile/graficele brandului: upload, generare grafice, import automat, etichete, materiale de la angajați, top performeri.
- **Memorii Brand** (`/brand-memories`) — gestionezi memoriile pe categorii; se pot crea și din fișiere încărcate.
- **Automatizări Marketing** (`/marketing-automations`) — roboții de postări recurente AI + jurnalul execuțiilor (Finalizat / Rulează / Eroare / Așteaptă materiale) + statistici pe angajați (câte materiale au încărcat și câte au fost folosite).

**Reclame plătite**
- **Campanii Publicitare** (`/ad-campaigns`) — conturi de Ads Meta conectate, wizard simplificat de campanie (obiectiv → buget → publicare), boost la postări, sugestii AI de completare, formulare de lead-uri (alegi un formular existent sau creezi unul nou, cu întrebări, direct din wizard); durata campaniei se alege rapid din presetări (de la 1 zi la 30 de zile sau nelimitat).
- **Anomalii Ads** (`/marketing/anomalies`) — lista anomaliilor detectate automat pe Meta/Google/GBP/TikTok/total brand, filtrabile pe severitate și status (Deschise/Toate/Ignorate).
- **Playbook Restaurant** (`/playbook-restaurant`) — wizard 3 pași (brand & template → locații & conținut → buget, programare, opțiuni) cu sugestii Sym, pe baza promoțiilor și meniului existent.
- **Playbook B2B** (`/marketing/b2b-playbook`) — lead-uri B2B cu scoring Hot/Warm/Cold, chestionare de lead, estimator de timeline & rezultate.
- **Playbook Meta** Restaurant / B2B / Ecommerce (`/marketing/playbook-meta-restaurant`, `/marketing/playbook-meta-b2b`, `/marketing/playbook-meta-ecommerce`) — ghiduri de campanii Meta pe tip de business.

**Email marketing**
- **Configurare Email** (`/email-setup`) — starea trimiterii: câte branduri au SMTP configurat, secretul de dezabonare, webhooks pentru furnizori externi (opțional).
- **Campanii Email** (`/email-campaigns`) — tab-uri Toate/Ciorne/Programate/Active/Trimitere/Trimise; campanie nouă în 3 pași (Configurare → Selectează Șablon → Revizuire & Trimitere); campaniile flux au tab-uri Flux/Config/Statistici; vezi destinatari și click-uri pe linkuri.
- **Șabloane Email** (`/email-templates`) — designer vizual de șabloane cu previzualizare și personalizare (ex. prenume, nivel loialitate); editare la `/email-templates/:id`.
- **Statistici Email** (`/email-analytics`) — Prezentare, Campanii, Automatizări cu trimitere email, Secvențe, Bounce & Dezabonări (evoluții, top domenii respinse, surse).
- **Review Email** (`/email-review`) — coada de verificare a adreselor de email ale clienților (suspecte/invalide): corectezi adresa sau o validezi înainte de campanii; există și validare în masă.
- **Loguri Email** (`/email-logs`) — toate trimiterile sau loturile pe campanie, pentru a vedea exact ce a plecat și cu ce status.

**Google Business Profile**
- **Google Business Profile** (`/gbp`) — necesită locație Google conectată: compui postări GBP, vezi postările recente, răspunzi la recenzii (cu sugestie AI), răspunzi la întrebări (Q&A), încarci poze, vezi metrice pe ultimele 30 de zile cu refresh de la Google.

**Blog & SEO**
- **Comandă centrală Blog** (`/blog/tracker`) — privire de ansamblu + top articole după performanță.
- **Articole** (`/blog/posts`) și **Editare Articol** (`/blog/:brandId/posts/:id/edit`) — scrii și publici articole.
- **Advertoriale** (`/blog/advertorials`) + **Impact** (`/blog/advertorials/:id/impact`) — articole plătite pe site-uri externe și efectul lor.
- **Backlinks** (`/blog/backlinks`) + **Impact** (`/blog/backlinks/:id/impact`) — linkuri externe către site și efectul lor.
- **Analiză trafic** (`/blog/analytics`, per articol `/blog/analytics/:postId`) — trafic în timp, top articole, surse, dispozitive & țări.
- **Autori** (`/blog/authors`), **Import Blog** (`/blog/import` — mapare autori/categorii/etichete + slug-uri și redirect-uri 301), **Migrare Blog** (`/blog/migration` — migrare cu păstrarea SEO + raport post-migrare), **Redirecturi** (`/blog/redirects` — redirecturi + monitor 404 + import CSV).
- **Summary SEO** (`/seo`) — vizibilitate în căutări, distribuția pozițiilor top, top pagini după click-uri, SERP features, ultimele sincronizări.
- **Pages** (`/seo/pages` — scor SEO și top queries pe pagină), **Keywords** (`/seo/keywords`, detaliu `/seo/keywords/:id`), **Keyword research** (`/seo/research`), **Competitors** (`/seo/competitors`, detaliu `/seo/competitors/:domain`), **Setări SEO** (`/seo/settings` — provider SERP, configurare tracking, joburi de sincronizare).

**Magazin online** (paginile apar doar cu modulul Magazin Online activ în abonament)
- **Website-uri** (`/ecommerce/websites`) — creezi/duplici/ștergi website-uri și legi domenii.
- **Promoții & Reduceri** (`/ecommerce/auto-discounts`) — reduceri automate pentru magazinul online.
- **Recenzii** (`/ecommerce/reviews`) — recenzii de produse cu moderare; **Recenzii Externe** (`/ecommerce/external-reviews`) — dashboard, invitații de recenzie, conectori platforme externe.
- **Gift Cards & Store Credit** (`/ecommerce/gift-cards`) — carduri cadou + verificare sold.
- **Product Feeds** (`/ecommerce/feeds`) — feed-uri de produse (Google Merchant etc.): filtre, mapare câmpuri, programare & hosting.

**Website & portal public**
- **Renderer Website** (`/pos/website`) — site-ul public al brandului, așa cum îl văd clienții; servit și pe domeniul/slug-ul brandului. Afișează date LIVE: meniu, rezervări reale (zone + sloturi), recenzii, abonare newsletter, formular contact, chat AI.
- **Promoții Website** (`/website/promotions`) — bannerele vizuale ale site-ului (placement banner/antet/subsol/modal) cu țintă pagină internă, produs sau URL extern.
- **Configurare Portal** (`/portal-config`) — pornești/oprești modulele portalului și îi setezi aspectul și textele.
- **Atracții Portal** (`/portal-attractions`), **Jocuri & Activități** (`/portal-games` — program pe zile, prețuri, excepții de date, editare rapidă sau configurare completă), **Misiuni, Insigne & Recompense** (`/portal-missions`), **Meniu public** (`/portal/menu`).

**Coduri QR**
- **Coduri QR** (`/qr-codes`) — două tab-uri: **QR Mese** (generare per masă cu link la meniul digital, editare destinație pe rută de portal, regenerare coduri, gestionare ID-uri de masă) și **QR-uri dinamice** (titlu, destinație editabilă oricând — URL extern sau pagină internă, etichete, activ/inactiv, contor de scanări, descărcare PNG/SVG/PDF, tipărire).

**Pagini publice (fără login, văzute de clienți)**
- **Smart Link** (`/s/:slug`) — redirect de link scurt. **Dezabonare Email** (`/unsubscribe/:token`). **Chestionar Lead** (`/lead/:brandId/:slug`). **Formular Catering** (`/p/catering-lead/:campaignId`) — „Spune-ne despre evenimentul tău".

**Acțiuni automate**
- **Acțiuni Automate** (`/actions`, același ecran ca `/settings/customer-automations`) — Reguli Active (declanșator → efect, 180+ declanșatoare și 100+ efecte), Jurnal Execuții, Efecte Programate, plus simulare înainte de activare.

## Fluxuri frecvente

1. **Programezi o postare Facebook/Instagram (prin asistent)**: `list_social_accounts` (verifici că există cont activ pe platformă) → `schedule_social_post` cu brandId, content, platforms și scheduledAt în viitor (ISO cu fus, ex. `2026-06-15T19:00:00+03:00`) → postarea intră **„în așteptare aprobare"**. Se publică la ora programată **doar după** `approve_social_post(postId, approvalStatus:'approved')` (sau aprobare din pagina Social Media). Pentru publicare imediată după aprobare: `publish_social_post(postId, confirm:true)`. Fără scheduledAt rămâne ciornă. Vezi ce așteaptă aprobare cu `list_social_posts(approvalStatus:'pending')`; modifici cu `update_social_post`, dublezi cu `duplicate_social_post`, anulezi cu `cancel_social_post` (doar ciorne/programate/eșuate, nu publicate).
2. **Vezi ce postări au mers cel mai bine**: `get_social_top_posts` (default engagement, opțional `metric: "reach"` sau `"views"`, `windowDays`, `platform`) → top postări publicate, măsurate LIVE din Meta. Pentru o postare anume: `get_social_post_performance(postId)`. Dacă o platformă nu întoarce insights (token, tip postare, Meta limită, prea nouă), raportează „indisponibil" cu motivul și nu o trata ca engagement 0.
3. **Promovezi o postare existentă (boost)**: întâi alege o postare cu `get_social_top_posts` sau din `/social-hub`, apoi `/ad-campaigns` → campanie nouă tip „Promovare postare" → alegi postarea, bugetul, durata → publici; dacă bugetul depășește pragul, campania intră în „Așteaptă aprobare manager".
4. **Trimiți o campanie email**: verifici SMTP în `/email-setup` → pregătești șablonul în `/email-templates` → `/email-campaigns` → Campanie Nouă (Configurare → Șablon → Revizuire & Trimitere) → urmărești rezultatele în `/email-analytics` și trimiterile individuale în `/email-logs`. Înainte de campanii mari, curăță adresele dubioase în `/email-review`.
5. **Configurezi postări recurente automate**: `/marketing-automations` → automatizare nouă cu prompt, frecvență (zile + oră), platforme și tip conținut; dacă cere materiale, angajații primesc solicitări, iar execuțiile apar în jurnal.
6. **Creezi un QR dinamic pentru un flyer**: `/qr-codes` → tab QR-uri dinamice → titlu + destinație (ex. pagina de meniu sau Instagram) → descarci PNG/SVG/PDF și tipărești; mai târziu schimbi destinația fără să retipărești nimic.
7. **Răspunzi la o recenzie Google**: `/gbp` → secțiunea de recenzii → ceri sugestie AI → ajustezi → publici răspunsul.
8. **Creezi un eveniment Facebook**: `/facebook-events` → eveniment nou cu categorie, dată, cover → inviți co-hosts → după publicare urmărești RSVP și postezi în feed-ul evenimentului.
9. **Pornești portalul pentru clienți**: `get_portal_config` (vezi ce e activ) → `configure_portal_features` (pornești meniu/comenzi/rezervări/gamificare) → `configure_portal_appearance` + `configure_portal_texts` pentru aspect și mesaje → clienții accesează prin QR-urile de masă.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `list_social_accounts` — ce conturi social sunt conectate și active, înainte de orice programare.
- `verifica_integrare` — checklist live al integrării (meta/facebook/instagram/tiktok/youtube/linkedin/google_business): credențiale, cont conectat, token valid (testat pe API), permisiuni lipsă, cont reclame. Sursa de adevăr la orice problemă de conectare.
- `list_social_posts` — postările existente (ciorne/programate/publicate/eșuate), cu filtru pe status.
- `get_social_post_performance` — performanța REALĂ a unei postări sau a postărilor publicate într-o fereastră: reach, views, like/comment/share/save, citite live de la Meta pentru Facebook/Instagram. Insights lipsă = „indisponibil" cu motiv, nu zero.
- `get_social_top_posts` — top postări după engagement/reach/views, cu postările fără insights excluse din clasament și numărate separat.
- `read_brand_memories` — vocea brandului, publicul țintă, stilul vizual — de citit înainte de a propune conținut.
- `browse_brand_media` — caută poze/video/grafice în biblioteca media a brandului (pentru mediaUrls la postări).
- `get_portal_config` — configurația curentă a portalului public.
- `list_portal_games` / `get_game_details` / `check_game_availability` / `get_game_slots` — jocurile din portal, program, prețuri, disponibilitate.
- `gaseste_in_aplicatie` — linkul exact către orice pagină de marketing.

**Scriere (cer modulul de permisiune pe token):**
- `schedule_social_post`, `update_social_post`, `duplicate_social_post`, `cancel_social_post`, `delete_social_post`, `bulk_schedule_social_posts` — [marketing_social] creare/editare/duplicare/anulare/ștergere postări.
- `approve_social_post` (aprobă/respinge o postare „în așteptare"), `publish_social_post` (publică ACUM, cu `confirm:true`) — [marketing_social] deblochează publicarea. Fără aprobare, postările create prin conexiune NU se publică.
- `list_hashtag_groups`, `create_hashtag_group`, `update_hashtag_group`, `delete_hashtag_group` — [marketing_social] seturi reutilizabile de hashtag-uri pentru postări.
- `gbp_create_post`, `gbp_reply_review` — [marketing_social] postare pe fișa Google Business / răspuns la recenzie (cer `confirm:true` — apar public pe Google).
- `genereaza_link_conectare`, `conecteaza_instagram_din_facebook` — [marketing_social] conectarea conturilor (link OAuth pentru Facebook/TikTok/YouTube/LinkedIn/GBP/meta_ads; Instagram se leagă direct din pagina FB). Workflow complet în skill-ul `conecteaza-meta`.
- `configure_portal_general` / `configure_portal_appearance` / `configure_portal_texts` / `configure_portal_features` / `configure_portal_display` / `configure_portal_menu_config` — [setari] configurarea portalului public.
- `update_game_config` / `update_game_schedule` / `update_game_pricing` / `set_game_date_override` — [setari] jocurile din portal.
- `update_brand` — [setari] identitate brand, culori, rețele sociale.
- `create_notification_rule` — [setari] regulă de automatizare declanșator → acțiune.
- `create_customer` — [rezervari_clienti] adaugă client în CRM (pentru segmente/campanii); `create_game_reservation` — [rezervari_clienti] rezervare de joc.

**Și pentru reclame, email, recenzii, blog/SEO, oferte și QR există acum tool-uri MCP dedicate** — asistentul nu mai e limitat la „intră pe pagină". Pe scurt, ce poți face din chat (lista completă + permisiuni în `knowledge/tools-mcp.md`):
- **Reclame plătite Meta** — `boost_post`, `create_traffic_ad`, `create_messages_ad`, `create_calls_ad`, `create_page_likes_ad`, `create_event_ad` (creează ȘI publică, cer `confirm:true` + respectă plafonul de buget), `list_ad_campaigns`, `get_ad_campaign_status`, `get_ad_campaign_insights`, `pause_ad_campaign`, `resume_ad_campaign`, `set_campaign_budget(confirm:true)`. Workflow complet în skill-ul `gestioneaza-reclame`.
- **Măsurare marketing** — `get_marketing_scorecard` pentru tabloul rapid (venit atribuit, spend ads, ROAS combinat, LTV:CAC), `compare_attribution_models` pentru modele multiple, `get_social_top_posts` / `get_social_post_performance` pentru performanța organică live din Meta și `check_contact_frequency_budget` înainte de contactări 1-la-1. Skill: `masoara-marketing`.
- **Email** — `create_email_campaign` (draft), `send_email_campaign` (trimite real), plus secvențe și analytics. Skill: `gestioneaza-comunicare`.
- **Recenzii** — `sync_retail_reviews`, `reply_to_retail_review`, `dispatch_review_invitations_for_order` (invitații după comandă). Skill: `raspunde-recenzii`.
- **Google Business** — `gbp_create_post`, `gbp_reply_review` (apar public, cer `confirm:true`).
- **Blog & SEO** — `create_blog_post`, plus audit/cercetare keyword/rank tracking. Skills: `gestioneaza-blog-seo`, `cercetare-seo`, `scrie-articol-seo`, `optimizeaza-seo`.
- **Oferte care reduc nota** — `list_offers`, `create_offer`, `update_offer`, `preview_offer_margin` (Margin Guardrail), `get_offer_scorecard`, `list_offer_suggestions` (vezi `knowledge/produse-meniu-retete.md`).
- **QR dinamice / de masă** — `create_dynamic_qr_code`, `set_dynamic_qr_fields`, `generate_table_qr_codes`.
- **Notificări** — `push_notify_customers`, `push_notify_staff`.

Pentru întrebări/rapoarte poți folosi și SQL read-only. Pentru orice link de pagină, `gaseste_in_aplicatie`.

## Întrebări frecvente și capcane

- **De ce nu s-a publicat postarea?** Cel mai des: contul platformei e deconectat sau token-ul a expirat → postarea trece pe „eșuată". Diagnostichează cu `verifica_integrare` (testează tokenul LIVE și spune exact ce lipsește), apoi reconectează după skill-ul `conecteaza-meta`.
- **Am programat o postare dar nu i-am pus oră** — fără dată/oră rămâne ciornă. Postările cu dată în viitor se publică la oră **doar dacă au fost aprobate**. Nimic creat prin asistent nu pleacă fără aprobare.
- **Am programat o postare prin asistent și tot nu s-a publicat la oră** — pentru că aștepta aprobare. Toate postările create prin asistent/AI intră „în așteptare aprobare". Aprob-o din pagina Social Media (buton Aprobă) sau cere asistentului `approve_social_post`; abia după aceea se publică la ora programată. Vezi lista cu `list_social_posts(approvalStatus:'pending')`.
- **Pot anula o postare deja publicată?** Nu — `cancel_social_post` funcționează doar pe ciorne, programate sau eșuate. Ștergerea de pe platformă se face pe platformă.
- **De ce performanța unei postări apare „indisponibilă", nu 0?** Pentru că metricile se citesc live din Meta. Unele postări nu au insights pentru tipul lor, sunt prea noi, au token expirat sau Meta nu a întors date. Asistentul trebuie să spună motivul și să le excludă din top; zero e raportat doar când Meta întoarce explicit o metrică 0.
- **De ce nu se aplică reducerea de pe banner?** Promoțiile website (`/website/promotions`) sunt DOAR anunțuri vizuale — nu modifică prețul. Reducerile reale pe notă se fac din motorul de Oferte (happy hour, -X%, 1+1) din zona de meniu.
- **Care e diferența între Automatizări Marketing și Acțiuni Automate?** Automatizările Marketing (`/marketing-automations`) generează postări sociale recurente cu AI. Acțiunile Automate (`/actions`) sunt reguli declanșator → efect pe clienți și operațiuni (vouchere, puncte, notificări, email-uri).
- **De ce e campania mea „Așteaptă aprobare manager"?** Bugetul depășește pragul de aprobare configurat — un manager trebuie să o aprobe înainte să plece spre Meta.
- **Reclama nu s-a publicat / „Meta a respins parametrii / verifică targetarea-locațiile".** Cea mai frecventă cauză la o reclamă locală: **ai pus și o zonă mare, și una din interiorul ei** — de exemplu și „România" (toată țara), și „Timișoara" (oraș din ea), sau un județ + un oraș din acel județ. Meta nu acceptă zone care se suprapun. **Soluția**: păstrează o singură zonă, cea mai precisă — de obicei orașul + raza din jurul localului — și scoate țara/județul. Apoi publică din nou. Bonus: o reclamă pe **toată țara** cere date de plătitor/beneficiar verificate pe contul Meta (transparență UE); pentru un local e oricum mai eficient să ținteșt orașul + împrejurimile, nu toată țara.
- **De ce nu pleacă email-urile?** Verifică `/email-setup` (SMTP configurat per brand?) și `/email-logs` (statusul fiecărei trimiteri). Adresele invalide ajung în `/email-review`.
- **Trebuie să retipăresc QR-urile dacă schimb destinația?** Pentru QR-urile dinamice NU — schimbi destinația din `/qr-codes` și codul tipărit rămâne valabil. QR-urile de masă duc mereu la meniul mesei; doar regenerarea codului propriu-zis cere retipărire.
- **Cum fac un afiș / flyer / postare / cod QR de masă frumos?** Prin asistent, fără clickuri: skill-ul `materiale-grafice` (+ `knowledge/materiale-grafice.md`) — pornești dintr-un șablon profesionist, pui textele și oferta, aplici automat culorile și logo-ul brandului, apoi exporți PDF/PNG din studioul `/graphic-materials`. Cere drept de scriere pe modulul „Marketing & Social Media".
- **Nu văd paginile de Magazin Online** — apar doar dacă modulul Magazin Online e activ în abonament.
- **GBP nu arată nimic** — întâi trebuie conectată locația Google din pagina `/gbp` / conturile social.
- **Unde îmi gestionez segmentele de clienți?** Din tab-ul CRM al paginii Audiență (filtrele de clienți); tab-ul Segmente doar explică acest lucru.
- **Asistentul nu poate programa postarea** — token-ul MCP are nevoie de drept de scriere pe modulul „Marketing & Social Media"; altfel îndrumă utilizatorul spre portalul Hub → Acces AI.

## Pentru acces SQL

Tabele utile: `social_posts`, `social_accounts`, `email_campaigns`, `email_templates`, `email_sends`, `email_send_batches`, `email_unsubscribes`, `ad_campaigns`, `ads_anomalies`, `marketing_automations`, `marketing_automation_logs`, `automation_rules`, `automation_execution_logs`, `table_qr_codes`, `dynamic_qr_codes`, `website_promotions`, `brand_media_assets`, `brand_memories`, `blog_posts`, `seo_keywords`, `gbp_questions`, `gbp_metrics_daily`.
Exemple: „câte postări programate are brandul săptămâna asta?" → `social_posts` cu status `scheduled`; „ce anomalii ads deschise am și cu ce impact?" → `ads_anomalies` cu status `open`; „câte scanări are QR-ul de pe flyer?" → `dynamic_qr_codes` (contorul de scanări).
