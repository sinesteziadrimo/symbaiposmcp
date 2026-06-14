---
name: gestioneaza-reclame
description: Creează și gestionează reclame plătite Meta (Facebook/Instagram) DIRECT din chat, cu tool-uri — fără click prin wizard. Folosește la „fă o reclamă", „promovează postarea X", „dă boost", „pune reclamă pe Facebook cu 20 de lei pe zi", „pornește/oprește campania", „pune pe pauză reclama", „cum merge reclama", „cât cheltui pe reclame", „campanie publicitară".
---

# Gestionează reclame Meta (boost & campanii) din chat

Symbai POS are tool-uri MCP dedicate pentru reclame — promovezi o postare în câteva secunde, fără să intri în wizard. **Reclamele cheltuie bani reali**, așa că tool-urile de scriere cer confirmare explicită și respectă plafonul de buget setat de proprietar pe token (Hub → Acces AI).

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
