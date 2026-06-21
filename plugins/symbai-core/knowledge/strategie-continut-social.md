# Strategie de Conținut Social

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare. Pentru a CREA și programa efectiv postările, vezi și skill-ul `programeaza-postare`; pentru a lega conturile (Facebook/Instagram/TikTok) vezi skill-ul `conecteaza-meta`.

## Pe scurt

Acesta este „creierul de strategie" din spatele postărilor — nu cum programezi o postare, ci CE postezi, în ce proporții și pentru cine, ca un specialist de agenție ar construi calendarul unui restaurant sau hotel. Regula de aur pentru HoReCa în 2026: video scurt în față, conținut gândit pentru SALVĂRI și TRIMITERI (nu like-uri), cu un cârlig care prinde în primele 1-3 secunde. Înainte să generezi orice text citește memoriile brandului (`read_brand_memories`) ca să scrii pe vocea lui reală, apoi folosește datele LIVE din POS (preparate-vedetă, oferte, vreme, mese ocupate) ca să postezi lucruri adevărate, nu generice.

Claude Code lucrează MCP-first: citește vocea + datele reale → propune calendarul → arată-l proprietarului → abia după aprobare programează și publică.

## Concepte

- **5 piloni de conținut** (pe care se construiește tot calendarul): (1) preparate-semnătură, (2) culise / bucătărie, (3) echipa / oamenii, (4) comunitate & evenimente locale, (5) experiențe ale clienților / conținut făcut de ei (UGC). Orice idee de postare trebuie să încapă într-unul din cei 5 piloni.
- **Mix de formate 60-70 / 20-30 / 10**: ~60-70% Reels / TikTok / Shorts (singurul motor real de descoperire — un Reel ajunge la ~2,25x reach-ul unei poze și ajunge la non-followeri), ~20-30% carusele gândite pentru SALVARE (dezvăluiri de meniu, educație, liste utile), ~10% poză unică / cultură de brand. Durata ideală a clipului: 15-30 secunde. Autenticitatea bate producția: un clip de 30s filmat cu telefonul bate un filmuleț de un minut prea „lucrat".
- **Raport 3-2-1 (la fiecare 6 postări)**: 3 de valoare/educație, 2 de divertisment/poveste, 1 de vânzare. Ține vânzarea dură la ~1 din 6 postări, ca feed-ul să nu pară reclamă.
- **Cadență 5-7 postări/săptămână** în total pe platforme. TikTok cere minimum 2-3/săptămână ca să rămâi în algoritm. Planifică ~5-7 ore de muncă pe săptămână pentru o strategie pe 2-3 platforme (creație + programare + comunitate + analiză).
- **Optimizezi pentru SALVĂRI și TRIMITERI, nu like-uri**: în 2026 cel mai puternic semnal pe Instagram e „trimiteri per reach" (de câte ori e dat unei prietene în DM), iar salvările sunt al doilea. Gândește fiecare postare ca având o poantă care merită trimisă sau o listă care merită salvată. Țintă de engagement pe mâncare & băutură: ~2,0-2,5% pe Instagram, ~3,0-3,5% pe TikTok (Reels de mâncare bat de regulă media IG de 0,48%).
- **Cârligul din primele 1-3 secunde decide reach-ul** — mai mult decât calitatea producției. Folosește cârlige de tip șoc / întrebare / poveste, text-pe-ecran și subtitrări mereu pornite (majoritatea se uită fără sunet), și spune poanta din prima (fără introduceri lungi).
- **Caption-urile sunt noile hashtag-uri (SEO social)**: căutarea de pe Instagram/TikTok rankează caption-uri pline de cuvinte-cheie, alt-text și text-pe-ecran ÎNAINTEA hashtag-urilor. Caption-urile cu cuvinte-cheie au adus ~30% mai mult reach și de 2x mai multe like-uri față de cele încărcate cu hashtag-uri. Folosește 3-5 hashtag-uri de nișă (peste 5 pare spam). Tratează grila ca SEO local: tag de locație + oraș/bucătărie în caption + alt-text pe fiecare postare.
- **UGC = formatul cu cea mai mare încredere**: 79% spun că UGC le influențează puternic decizia de cumpărare (mult peste conținutul de brand). Captează și repostează sistematic conținutul oaspeților + momentele reale ale echipei, din sală, în timp real.
- **Ferestre bune de postare HoReCa**: în jurul momentelor de „decizie de masă" — 9:00, 12:00-13:00 și 18:00-21:00 (ora locală). Vârfuri IG: marți 13:00-19:00 și miercuri 12:00-21:00. Declanșează conținut spontan pe vreme + terasă plină (soare la 18:00 pe terasă = postează ACUM).
- **Google Business Profile e canalul subevaluat cu cel mai mare randament local**: postările pe GBP ajung la oameni care caută ACTIV unde să mănânce lângă ei. Postează oferta săptămânii / preparatul nou și pe GBP, nu doar pe IG/FB.
- **Răspuns la comunitate cu SLA**: 73% aleg un concurent dacă un restaurant răspunde greu pe social. Triază: reclamații urgente — imediat; întrebări — sub 30 min; comentarii generale — în câteva ore. Răspunde la fiecare comentariu/DM.

## Fluxuri frecvente

### 1. Calendar lunar de calitate de agenție
Construiește un plan pe ~24 de idei, pe cei 5 piloni, cu mixul 60-70% Reels și raportul 3-2-1.
1. `read_brand_memories` — voce, public, stil (ca să scrii pe brand, nu generic).
2. `list_locations` + `marketing_location_weather` — contextul de sezon/vreme.
3. `get_menu_engineering` și/sau `top_produse` — preparatele-vedetă REALE; `list_offers` — promoțiile reale active.
4. Mapează ~24 de idei pe cei 5 piloni, cu ~60-70% Reels și raportul 3-2-1; pentru fiecare scrie cârligul (1-3s) + caption cu cuvinte-cheie (SEO social).
5. `create_hashtag_group` [marketing] — un grup de 3-5 hashtag-uri de nișă, reutilizabil.
6. `browse_brand_media` [citire] pentru vizual existent, sau `render_material_design` pentru un material nou.
7. `bulk_schedule_social_posts({ confirm:true })` [marketing] — programează tot lotul la 9:00 / 12:30 / 19:00 (fus `Europe/Bucharest`).
8. Raportează proprietarului și folosește `approve_social_post` pe loturi după revizuire.

### 2. Reel din teren, în aceeași zi (conținut spontan)
Cea mai bună postare e adesea momentul real de azi.
1. `marketing_location_weather` + `marketing_open_tables` [citire] — terasă plină + soare = acum.
2. `marketing_active_shifts` [citire] — cine e în tură și poate filma 10 secunde.
3. Confirmă cu proprietarul ideea de clip.
4. `marketing_send_content_request({ confirm:true })` [marketing] — cere echipei „clip 10s cu platoul de la masa 12, lumină naturală", prioritate mare, expiră în ~45 min.
5. `marketing_recent_conversations` / `browse_brand_media` — preia clipul trimis de echipă.
6. Scrie cârligul + textul-pe-ecran + caption-ul (din aplicație, pe vocea brandului).
7. `schedule_social_post({ postType:'reel', confirm:true })` [marketing] cu media → apoi `approve_social_post`.

### 3. Lansare preparat / produs nou pe organic (3 zile)
1. `get_product_details` / `get_menu_engineering` — detaliile reale ale preparatului.
2. Ziua −1: teaser — cârlig „mâine lansăm…", format Reel.
3. Ziua 0: Reel demonstrativ + carusel-de-salvat cu ingrediente / pași.
4. Ziua +2: UGC / reacția unui client (sourcing din sală).
5. `gbp_create_post({ confirm:true })` [marketing] — postează lansarea și pe Google Business.
6. `bulk_schedule_social_posts({ confirm:true })` pentru toate cele 3 zile → `approve_social_post` pe lot.

### 4. Săptămâna de community management (cu SLA)
1. `list_conversations` [citire] — mesajele/comentariile necitite de pe social.
2. Triază pe SLA: urgent (reclamație) / întrebare / general.
3. `read_brand_memories` [citire] — tonul corect de răspuns.
4. Propune răspunsuri → confirmă cu proprietarul.
5. `reply_to_conversation({ confirm:true })` [marketing]. La o reclamație publică: răspuns scurt empatic + mută discuția în privat. La o RECENZIE (Google/Trustpilot/Booking): predă-o skill-ului `raspunde-recenzii` (vezi `knowledge/raspunde-recenzii.md`).

### 5. Buclă lunară de optimizare
1. `get_social_top_posts({ windowDays: 90, metric: "engagement" })` [citire] — top postări publicate, cu metrici live Meta; pentru reach sau views schimbă `metric`. Pentru o postare anume folosește `get_social_post_performance({ postId })`. Dacă Meta marchează insights „indisponibil", explică motivul și nu trata postarea ca zero.
2. Identifică ce pilon / format / oră câștigă (ex. „Reels de culise marți la 19:00 merg cel mai bine").
3. Recomandă proprietarului concret: „dublăm Reels-urile de tip culise marți seara".
4. Ajustează calendarul lunii următoare și `bulk_schedule_social_posts`.

## Tool-uri MCP utile

- `read_brand_memories` [citire] — vocea, publicul și stilul brandului; RULEAZĂ-L MEREU înainte să generezi text, ca postările să sune ca brandul, nu generic.
- `marketing_generate_post` [marketing] — generează un draft de postare (text + sugestii) pe baza unei idei; tot un draft, nu publică.
- `marketing_location_weather`, `marketing_open_tables`, `marketing_active_shifts` [citire] — context LIVE pentru conținut spontan (vreme, terasă plină, cine filmează).
- `browse_brand_media` [citire] — caută în biblioteca de poze/clipuri ale brandului materialul de folosit.
- `render_material_design` [marketing] — creează un vizual nou (poster/grafic) când nu există material potrivit.
- `create_hashtag_group` [marketing] — salvează un grup de 3-5 hashtag-uri de nișă, reutilizabil pe postări (`list_hashtag_groups` / `update_hashtag_group` pentru gestionare).
- `marketing_send_content_request({ confirm:true })` [marketing] — cere echipei din teren un clip/o poză anume (declanșează o sarcină); `marketing_list_content_requests` / `marketing_recent_conversations` pentru a urmări răspunsul.
- `schedule_social_post({ confirm:true })` [marketing] — programează O postare (`postType` poate fi `reel`, imagine, carusel etc.).
- `bulk_schedule_social_posts({ confirm:true })` [marketing] — programează un LOT întreg de postări dintr-un calendar (cel mai folosit la planul lunar).
- `approve_social_post({ confirm:true })` [marketing] — aprobă o postare aflată în așteptare ca să intre la programare/publicare; folosește-l pe loturi după revizuire.
- `publish_social_post`, `update_social_post`, `duplicate_social_post`, `cancel_social_post` [marketing] — publică acum / editează / clonează / anulează o postare programată.
- `list_social_posts`, `list_social_accounts` [citire] — vezi postările existente și ce conturi sunt conectate.
- `get_social_top_posts`, `get_social_post_performance` [citire] — performanța reală Facebook/Instagram citită live de la Meta; insights lipsă = „indisponibil" cu motiv, nu zero.
- `gbp_create_post({ confirm:true })` [marketing] — postează pe Google Business Profile (canalul local subevaluat).
- `boost_post`, `list_boostable_posts` [marketing] — promovare plătită a unei postări organice care a mers bine (intră în zona de reclame — vezi `knowledge/marketing-social.md`).

## Întrebări frecvente și capcane

- **Ce postez ca să cresc?** Nu poze frumoase la întâmplare. ~60-70% Reels scurte (15-30s), cu cârlig în primele 1-3 secunde, gândite ca cineva să le SALVEZE sau să le TRIMITĂ unei prietene. Like-urile nu mai mișcă reach-ul; trimiterile și salvările da.
- **Câte hashtag-uri pun?** 3-5 de nișă, în `create_hashtag_group`. Peste 5 pare spam și scade reach-ul. Pune cuvintele-cheie (oraș, bucătărie, preparat) în CAPTION și în alt-text — acolo caută algoritmul în 2026.
- **De ce să nu mă uit la like-uri?** Pentru că nu sunt semnalul de ranking. Uită-te cu `get_social_top_posts(metric:"engagement")` / `get_social_post_performance` la salvări, trimiteri/interacțiuni și reach; dacă Meta nu oferă insights, marchează postarea indisponibilă, nu ca zero.
- **Când postez?** În jurul deciziilor de masă: 9:00, 12:00-13:00, 18:00-21:00. Dar cel mai bun moment e adesea cel REAL — terasă plină pe soare → declanșează un Reel pe loc (fluxul „Reel din teren").
- **De unde iau idei care nu sună a robot?** Din datele LIVE: `get_menu_engineering`/`top_produse` (ce se vinde de fapt), `list_offers` (promoțiile reale), `marketing_location_weather` (sezonul). Și MEREU `read_brand_memories` întâi, ca textul să fie pe vocea localului.
- **Capcană — generezi fără să citești vocea brandului.** Fără `read_brand_memories` postările ies generice și „a robot". Citește-o prima.
- **Capcană — sari peste confirmare.** Orice tool care programează/publică/trimite are nevoie de `confirm:true` și de OK-ul explicit al proprietarului. Nu publica fără revizuire.
- **Capcană — UGC fără drepturi.** Clientul deține poza/clipul lui. Pentru repostare comercială cere-i permisiune (un simplu DM de acord e suficient). Dacă ai oferit ceva în schimb (masă, discount), spune-o transparent.
- **Capcană — ignori comunitatea.** Răspunsul lent pe social pierde clienți. Rulează săptămânal fluxul de community management cu SLA (urgent imediat, întrebări <30 min).
- **Verifică prin citire, nu prin ecran.** După orice programare/publicare, confirmă cu `list_social_posts`, nu repeta comanda pentru că UI-ul nu s-a împrospătat (altfel dublezi postarea).

## Vezi și

- `knowledge/marketing-social.md` — postări, reclame plătite, atribuire.
- `knowledge/email-marketing.md` — cum amplifici aceeași poveste pe email.
- `knowledge/raspunde-recenzii.md` — recenzii Google/Trustpilot/Booking (separat de comentariile pe social).
- skill-ul `programeaza-postare` — fluxul practic de a crea și programa o postare.
- skill-ul `conecteaza-meta` — legarea conturilor Facebook / Instagram / TikTok / Google Business.
