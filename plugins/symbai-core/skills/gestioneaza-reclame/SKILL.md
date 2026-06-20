---
name: gestioneaza-reclame
description: Creează și gestionează reclame plătite Meta (Facebook/Instagram) DIRECT din chat, cu tool-uri — fără click prin wizard. Mai multe TIPURI de reclame: boost la o postare, trafic spre site/meniu, mesaje (Messenger), apel telefonic, aprecieri pagină, promovare eveniment. Folosește la „fă o reclamă", „promovează postarea X", „dă boost", „reclamă cu link spre meniu/site", „reclamă să mă sune lumea", „reclamă să primesc mesaje", „promovează evenimentul", „crește pagina", „pune reclamă pe Facebook cu 20 de lei pe zi", „pornește/oprește campania", „pune pe pauză reclama", „cum merge reclama", „cât cheltui pe reclame", „campanie publicitară".
---

# Gestionează reclame Meta (boost & campanii) din chat

Symbai POS are tool-uri MCP dedicate pentru reclame — promovezi o postare în câteva secunde, fără să intri în wizard. **Reclamele cheltuie bani reali**, așa că tool-urile de scriere cer confirmare explicită și respectă plafonul de buget setat de proprietar pe token (Hub → Acces AI).

Pentru orice buget publicitar, citește și `knowledge/agent-operare-avansata.md`: verifici contul, explici costul, obții confirmare clară, rulezi tool-ul și verifici statusul după.

## Fluxul de bază — promovează o postare (boost)

1. **Verifică contul de reclame**: `list_ad_accounts` (opțional `brandId`). Dacă lista e goală → contul Meta Ads nu e conectat: folosește skill-ul `conecteaza-meta` (sau spune utilizatorului să-l lege din portal). Fără cont, nu poți face reclame.
2. **Alege postarea** de promovat: `list_boostable_posts` (opțional `brandId`, `limit`). Întoarce `postId`, textul, formatul (poză/carusel/video/reel) și pe ce platforme există (FB/IG). Doar postări din feed — Story-urile nu se pot promova. (Și pozele single funcționează acum — sistemul rezolvă automat postarea în story-ul promovabil.)
3. **Confirmă cu utilizatorul**: ce postare, ce buget zilnic (RON), pe ce platformă (Facebook / Instagram / amândouă), cât timp. Spune-i clar cât se cheltuie.
4. **Lansează**: `boost_post` cu:
   - `postId`, `dailyBudgetRon` (minim 5), `platform` (`facebook` implicit / `instagram` / `both`),
   - opțional `durationDays` (minim 2 — Meta cere ≥24h la buget zilnic; lipsă = rulează până o pui pe pauză),
   - opțional `locations` (orașe/județe ca text, ex. `["Timișoara","Cluj"]` — le rezolvă singur la Meta; lipsă = toată țara), `interests` (ex. `["Restaurante","Familie"]`), `ageMin`/`ageMax`/`gender`,
   - opțional `campaignName`,
   - **`confirm: true`** — pune-l DOAR după ce utilizatorul a aprobat bugetul. Fără el, tool-ul întoarce un rezumat de confirmat (nu cheltuie nimic).
5. **Confirmă rezultatul**: tool-ul îți spune `campaignId` + status. `pending_review` = a intrat la verificarea Meta = **succes** (de obicei se aprobă în câteva minute–ore). Spune utilizatorului asta + dă-i linkul la Campanii Publicitare.
6. Dacă vrei să fii sigur că a trecut de verificare mai târziu: `get_ad_campaign_status(campaignId)` — reîmprospătează din Meta și-ți zice dacă e `active`, încă `pending_review`, sau de ce a dat eroare.

## Alte tipuri de reclame (reclame NOI, nu boost de postare)

Pe lângă boost, poți crea reclame de la zero, cu un obiectiv anume. Toate au aceeași logică ca boost-ul: **cer `confirm:true`** după ce utilizatorul aprobă bugetul, respectă plafonul, `dailyBudgetRon` minim 5, `durationDays` opțional (≥2), și accept aceleași opțiuni de țintire (`locations`, `interests`, `ageMin`/`ageMax`/`gender`) + `imageUrl` opțional (URL https către poza reclamei) + `campaignName` opțional. Întorc `campaignId` + status (`pending_review` = succes, a intrat la verificare).

- **`create_traffic_ad`** — trimite clienții pe un link (meniu online, site, pagină de rezervări). Obligatoriu `websiteUrl`. Opțional `headline`, `adText`, `ctaType` (ex. `SHOP_NOW`, `ORDER_NOW`, `SEE_MENU`, `GET_OFFER`; implicit `LEARN_MORE`). Dacă nu dai imagine, Meta folosește previzualizarea linkului.
- **`create_messages_ad`** — clienții apasă și încep o conversație pe Messenger (întrebări, rezervări, comenzi prin mesaj). Obligatoriu `adText`. Opțional `headline`.
- **`create_calls_ad`** — buton de apel direct din reclamă (bun pentru rezervări telefonice). Obligatoriu `phoneNumber` (ex. `+40723123456`). Opțional `adText`, `headline`.
- **`create_page_likes_ad`** — crește numărul de urmăritori ai paginii de Facebook. Obligatoriu `adText`.
- **`create_event_ad`** — promovează un eveniment de Facebook (petrecere, concert, lansare) ca să vină mai multă lume. Obligatoriu `eventId` (id-ul evenimentului de Facebook). Opțional `headline`, `adText`, `ctaType`. (Reclama folosește automat coperta evenimentului — nu e nevoie de imagine separată.)

**Cum alegi tipul** (după ce vrea clientul):
- „vreau să ajungă pe meniul/site-ul meu" → `create_traffic_ad`
- „vreau să mă sune lumea" → `create_calls_ad`
- „vreau să-mi scrie pe mesaje / să întrebe" → `create_messages_ad`
- „vreau mai mulți urmăritori pe pagină" → `create_page_likes_ad`
- „am un eveniment / o petrecere" → `create_event_ad`
- „promovează postarea asta care merge bine" → `boost_post`

Fluxul e identic: verifică contul (`list_ad_accounts`) → confirmă bugetul + conținutul cu utilizatorul → apelează tool-ul cu `confirm:true` → confirmă rezultatul (`get_ad_campaign_status` dacă vrei să fii sigur că a trecut verificarea).

## Țintirea pe locații (capcană frecventă)

`locations` primește orașe/județe ca text (ex. `["Timișoara"]` sau `["Timișoara","Arad"]`); lipsă = toată țara.

- **NU pune și o zonă mare, și una din interiorul ei în același timp.** Adică NU `["România","Timișoara"]` și NU `["Timiș","Timișoara"]` (județ + oraș din el). Meta respinge zonele care se suprapun → reclama nu se publică. **Alege ORI orașe/județe, ORI toată țara — niciodată ambele.**
- **Pentru un local, ținteșt orașul (Meta adaugă automat o rază în jur), nu toată țara.** E mai eficient (ajungi la cine poate veni) și eviți o restricție: reclamele pe **toată țara** cer date de plătitor/beneficiar verificate pe cont (transparență UE) — dacă nu sunt confirmate în Ads Manager, campania pe toată țara poate fi blocată, în timp ce aceeași reclamă pe un oraș/județ se publică fără probleme.
- Dacă o reclamă a picat cu „locațiile se suprapun / verifică targetarea", scoate zona mai mare și lasă doar orașul, apoi republică — nu trebuie reintrodus nimic altceva.

## Gestionarea campaniilor existente

- **Vezi campaniile**: `list_ad_campaigns` (opțional `status`: active/paused/pending_review/error...). Întoarce status, buget zilnic, obiectiv, perioadă.
- **Status detaliat / de ce a picat**: `get_ad_campaign_status(campaignId)`.
- **Pune pe pauză** (oprește cheltuiala imediat): `pause_ad_campaign(campaignId)` — acțiune sigură, nu cere confirmare.
- **Repornește**: `resume_ad_campaign(campaignId, confirm:true)` — reia cheltuiala, deci cere confirmarea utilizatorului.

## Reguli (IMPORTANT — bani reali)

- **Mereu confirmă bugetul + postarea înainte de `boost_post`/`resume`** (pune `confirm:true` doar după „da"-ul utilizatorului). Pauza NU cere confirmare.
- **Respectă plafonul**: dacă proprietarul a setat un buget max/zi sau max/campanie pe token (Hub → Acces AI), tool-ul refuză sumele peste plafon cu un mesaj clar. Nu insista — propune o sumă ≤ plafon sau roagă proprietarul să mărească plafonul din portal.
- **Durată**: pentru un buget total mărginit, dă `durationDays` (≥2). Altfel campania rulează cu buget zilnic până o pui pe pauză — spune-i clar utilizatorului.
- **Minim 5 RON/zi** (cerința Meta).
- Dacă boost-ul dă eroare (status `error` + subcode), tool-ul îți dă detaliul — nu raporta „merge" dacă statusul nu e `pending_review`/`active`.
- Necesită permisiunea de scriere pe modulul **„Reclame (Meta / Google / TikTok)"**; dacă lipsește, tool-urile de scriere nu apar — îndrumă proprietarul spre portal Hub → Acces AI → editează tokenul → bifează „Reclame" (și, opțional, setează plafonul de buget).
- Concepte (stări campanie, anomalii, tipuri de promovare) în `knowledge/marketing-social.md`. Conectarea contului în skill-ul `conecteaza-meta`.

## Exemplu

> Utilizator: „promovează postarea cu meniul de vară pe Facebook, 30 de lei pe zi, o săptămână, în Timișoara"
> 1. `list_ad_accounts` → cont Drimoland OK.
> 2. `list_boostable_posts` → găsești postarea „Meniul de vară" (postId 961, Foto, FB+IG).
> 3. Confirmi: „Promovez «Meniul de vară» pe Facebook, 30 RON/zi × 7 zile = ~210 RON, țintă Timișoara. Confirmi?" → utilizatorul: „da".
> 4. `boost_post(postId:961, dailyBudgetRon:30, platform:"facebook", durationDays:7, locations:["Timișoara"], confirm:true)`.
> 5. „✅ Gata — campania #502 e la verificare Meta (pending_review). O vezi în Campanii Publicitare." + link.
