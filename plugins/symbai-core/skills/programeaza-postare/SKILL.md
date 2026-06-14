---
name: programeaza-postare
description: Creează și programează o postare pe social media (Facebook, Instagram, TikTok etc.) pentru restaurant. Folosește la „fă o postare", „programează pe Facebook mâine la 7", „postează oferta de azi pe Instagram".
---

# Programează o postare social media

1. Vezi ce conturi sunt conectate: `list_social_accounts` (opțional pe `brandId`). Dacă nu există niciun cont activ pe platforma cerută, conectează-l rapid prin MCP:
   - `genereaza_link_conectare(platforma)` — `platforma` ∈ `facebook`/`tiktok`/`youtube`/`linkedin`/`google_business` (opțional `brandId`). Întoarce un link OAuth pe care utilizatorul îl deschide în browserul LUI, logat în contul care administrează pagina; tokenul ajunge direct pe server, expiră în ~10 min. După ce confirmă, verifică cu `verifica_integrare`.
   - Instagram NU are link separat: după ce Facebook e conectat, leagă-l cu `conecteaza_instagram_din_facebook` (opțional `brandId`). Cere pagina Facebook cu permisiuni Instagram + un cont IG Business/Creator asociat; la eroare transmite mesajul exact.
   - Alternativ, dă link la pagina de conturi cu `gaseste_in_aplicatie("conturi social media")`.
2. Compune textul postării împreună cu utilizatorul (sau propune 2-3 variante dacă ți-o cere). Ține cont de brand și de ce vrea să promoveze.
3. `schedule_social_post`:
   - `brandId`, `content` (textul), `platforms` (ex. `["facebook","instagram"]`),
   - `scheduledAt` în viitor, format ISO cu fus (ex. `2026-06-15T19:00:00+03:00`) → se publică **automat** la ora aceea;
   - fără `scheduledAt` → rămâne **ciornă** (draft), o publică utilizatorul manual.
   - opțional `mediaUrls` (imagini/video publice), `postType` (post/story/reel/carousel), `firstComment`.
4. Confirmă: „Am programat postarea pe Facebook+Instagram pentru 15 iunie, ora 19:00. O vezi în Marketing → Social." + link.

## Reguli

- Întotdeauna confirmă data/ora + platformele înainte de programare.
- Dacă utilizatorul dă o oră fără fus, presupune Europe/Bucharest și spune ce ai presupus.
- Mai multe postări odată: `bulk_schedule_social_posts(posts)` — `posts` = listă (max 100), fiecare cu `content` + `platforms` și opțional `scheduledAt`/`mediaUrls`/`postType`/`firstComment`/`altText` (opțional `brandId` comun). Folosește-o în loc să repeți `schedule_social_post`. Import parțial: rândurile valide se creează chiar dacă unele dau eroare.
- Anulare: `cancel_social_post(postId)` — doar pentru ciorne/programate, nu pentru cele deja publicate.
- Vezi ce e programat: `list_social_posts` (filtrabil pe status: scheduled/draft/published).
- Detalii concept în `knowledge/marketing-social.md`.
- Necesită scriere pe modulul „Marketing & Social Media"; dacă lipsește, îndrumă spre portal Hub → Acces AI.
