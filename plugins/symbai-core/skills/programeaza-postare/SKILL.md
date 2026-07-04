---
name: programeaza-postare
description: Creează, programează, modifică, aprobă și publică postări pe social media (Facebook, Instagram, TikTok etc.) pentru restaurant. Folosește la „fă o postare", „programează pe Facebook mâine la 7", „postează oferta de azi pe Instagram", „modifică postarea", „aprobă postarea", „postează acum".
---

# Programează o postare social media

1. Vezi ce conturi sunt conectate: `list_social_accounts` (opțional pe `brandId`). Dacă nu există niciun cont activ pe platforma cerută, conectează-l rapid prin MCP:
   - `genereaza_link_conectare(platforma)` — `platforma` ∈ `facebook`/`tiktok`/`youtube`/`linkedin`/`google_business` (opțional `brandId`). Întoarce un link de conectare (OAuth) pe care utilizatorul îl deschide în browserul LUI, logat în contul care administrează pagina; linkul expiră în ~10 minute, deci să-l deschidă imediat — conectarea se finalizează automat și în siguranță. După ce confirmă, verifică cu `verifica_integrare`.
   - Instagram NU are link separat: după ce Facebook e conectat, leagă-l cu `conecteaza_instagram_din_facebook` (opțional `brandId`). Cere pagina Facebook cu permisiuni Instagram + un cont IG Business/Creator asociat; la eroare transmite mesajul exact.
   - Alternativ, dă link la pagina de conturi cu `gaseste_in_aplicatie("conturi social media")`.
2. Compune textul postării împreună cu utilizatorul (sau propune 2-3 variante dacă ți-o cere). Ține cont de brand și de ce vrea să promoveze.
3. `schedule_social_post`:
   - `brandId`, `content` (textul), `platforms` (ex. `["facebook","instagram"]`),
   - `scheduledAt` în viitor, format ISO cu fus (ex. `2026-06-15T19:00:00+03:00`) → postarea e **PROGRAMATĂ** pentru acea oră;
   - fără `scheduledAt` → rămâne **ciornă** (draft);
   - opțional `mediaUrls` (imagini/video publice), `postType` (post/story/reel/carousel), `firstComment`, `altText`.
4. **IMPORTANT — fluxul de aprobare:** orice postare creată prin această conexiune intră în **„În așteptare aprobare"** și **NU se publică automat**. Se publică la ora programată **doar după ce e aprobată**. Spune-i clar utilizatorului:
   > „Am programat postarea pe Facebook+Instagram pentru 15 iunie, ora 19:00. Apare cu **«În așteptare aprobare»** — se publică la oră **doar după ce o aprobi** (din pagina Social Media → Aprobă, sau îmi spui mie să o aprob)." + link (`gaseste_in_aplicatie("social media")`).

## Aprobare și publicare

- **Aprobă / respinge:** `approve_social_post(postId, approvalStatus: "approved" | "rejected", approvalNote?)`. `approved` → postarea devine eligibilă și se publică la ora programată. `rejected` → nu se va publica. Confirmă cu utilizatorul înainte de a aproba în numele lui.
- **Ce așteaptă aprobare:** `list_social_posts(approvalStatus: "pending")` — dacă o postare programată „nu s-a publicat", de cele mai multe ori e pentru că așteaptă aprobare aici.
- **Postează ACUM** (fără să aștepte ora): `publish_social_post(postId, confirm: true)`. Postarea trebuie să fie aprobată întâi. ⚠ Publicare publică ireversibilă — confirmă cu utilizatorul, apoi trimite `confirm: true`. Util și înainte de a promova o postare (boost-ul cere o postare deja publicată — vezi skill-ul `gestioneaza-reclame`).

## Reguli

- Întotdeauna confirmă data/ora + platformele înainte de programare; și niciodată nu aproba/publici fără acordul utilizatorului.
- Dacă utilizatorul dă o oră fără fus, presupune Europe/Bucharest și spune ce ai presupus.
- **Modifică o postare existentă:** `update_social_post(postId, ...)` cu DOAR câmpurile de schimbat (`content`/`scheduledAt`/`platforms`/`postType`/`firstComment`/`mediaUrls`/`altText`). `scheduledAt: null` o face ciornă. NU șterge și recrea (recrearea îi schimbă ID-ul). Doar postări nepublicate.
- **Duplică o postare:** `duplicate_social_post(postId, platforms?, scheduledAt?)` — „fă aceeași postare și pe Instagram" / „repostează săptămâna viitoare". Copia e tot în așteptare aprobare.
- **Mai multe postări odată:** `bulk_schedule_social_posts(posts)` — `posts` = listă (max 100), fiecare cu `content` + `platforms` și opțional `scheduledAt`/`mediaUrls`/`postType`/`firstComment`/`altText`. Toate intră în așteptare aprobare. Import parțial: rândurile valide se creează chiar dacă unele dau eroare.
- **Anulare / ștergere:** `cancel_social_post(postId)` o marchează anulată (rămâne în listă); `delete_social_post(postId)` o scoate definitiv din calendar. Doar postări nepublicate.
- **Video / Reel / Story / Carusel:** pune URL-ul public al clipului în `mediaUrls` + `postType: "reel"` (sau `"story"` pentru story video). Carusel = mai multe imagini în `mediaUrls` + `postType: "carousel"`.
- **Imagine din material grafic propriu:** dacă vrei să atașezi un afiș/flyer creat în studio (skill `materiale-grafice`), exportă-l ca imagine din studio și încarc-o în Biblioteca Media; apoi folosește URL-ul ei în `mediaUrls`. Imaginile deja încărcate se găsesc cu `browse_brand_media`.
- **Hashtag-uri reutilizabile:** `list_hashtag_groups`, `create_hashtag_group`, `update_hashtag_group`, `delete_hashtag_group` — seturi de hashtag-uri pe care le inserezi în `content`.
- **Google Business:** pentru postări pe fișa Google (Maps/Search) folosește `gbp_create_post` (vezi skill-ul SEO/Maps) — confirmă conținutul, apare public.
- Vezi ce e programat: `list_social_posts` (filtrabil pe `status`: scheduled/draft/published și pe `approvalStatus`: pending/approved/rejected).
- Vezi ce a mers bine după publicare: `get_social_top_posts(metric: "engagement" | "reach" | "views", windowDays?, platform?)` pentru clasament și `get_social_post_performance(postId?)` pentru detaliu. Acestea citesc LIVE din Meta pentru Facebook/Instagram; dacă Meta nu întoarce insights, spune „indisponibil" cu motivul, nu zero.
- Detalii concept în `knowledge/marketing-social.md`.
- Necesită scriere pe modulul „Marketing & Social Media"; dacă lipsește, îndrumă spre portal Hub → Acces AI.
