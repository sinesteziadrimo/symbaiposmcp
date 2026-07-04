# Integrarea Meta (Facebook, Instagram, reclame) — concepte

Ghid de CONCEPTE pentru conectarea Meta la Symbai. Pașii concreți de lucru sunt în skill-ul `conecteaza-meta`; aici e „de ce"-ul din spate, ca să poți explica utilizatorului pe limba lui.

## Piesele ecosistemului Meta (și de ce contează)

- **Profil personal** — contul de om (Ion Popescu). NU se poate conecta la Symbai și nu poate publica prin API. E doar cheia de intrare: omul cu profilul trebuie să fie **administrator al paginii**.
- **Pagina de Facebook** — identitatea publică a restaurantului. ASTA se conectează la Symbai. O pagină are administratori (profiluri personale cu rol) și un **Page Access Token** pe care Meta îl dă aplicațiilor autorizate.
- **Cont Instagram Business/Creator** — varianta „de firmă" a contului Instagram. Doar acesta poate fi automatizat prin API, și DOAR dacă e **legat de pagina de Facebook** (din aplicația Instagram → Setări → Centrul de conturi, sau din pagina FB → Setări → Conturi conectate). Un cont Instagram personal nu se poate conecta — se convertește gratuit din aplicație (Setări → Tip de cont).
- **Business Manager / Business Portfolio** (business.facebook.com) — „dosarul de firmă" Meta care grupează pagini, conturi de reclame și oameni cu roluri. Nu e obligatoriu pentru postări organice, dar e practic obligatoriu pentru reclame serioase.
- **Contul de reclame (Ads Manager)** — portofelul + istoricul campaniilor plătite. E o entitate SEPARATĂ de pagină: poți avea pagina conectată și zero conturi de reclame. În Symbai se conectează separat (vezi mai jos).

## Cum se conectează la Symbai (modelul de securitate)

- Conexiunea e **OAuth**: utilizatorul deschide un link, se loghează LA META (nu în Symbai), aprobă o listă de permisiuni, iar Meta trimite un token de acces **direct serverului Symbai**. Tokenul nu trece prin chat, nu îl vede nimeni, e stocat pe instanța clientului.
- De aceea: nimeni (nici asistentul AI) nu are nevoie de parola de Facebook a utilizatorului. Cine cere parola greșește.
- **Două conexiuni separate**: (1) pagina FB + Instagram = postări organice, mesaje, comentarii; (2) contul de reclame = campanii plătite. Fiecare cu link-ul ei de conectare.
- Revocare: utilizatorul poate oricând să taie accesul din Facebook (Setări → Integrări de business) sau să reconecteze din Symbai.

## Permisiunile cerute (de ce toate bifele)

- Postări organice: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`; Instagram: `instagram_basic`, `instagram_content_publish`.
- Reclame: `ads_management`, `ads_read`, `business_management`.
- Dialogul Meta permite debifarea individuală — pare „mai sigur", dar o permisiune debifată = funcția respectivă pică mai târziu cu erori greu de diagnosticat (postarea apare „eșuată" peste o săptămână). Recomandarea fermă: toate bifele.

## Durata de viață a conexiunii (de ce „mergea și nu mai merge")

- Tokenurile de pagină sunt de lungă durată, dar Meta le invalidează la: **schimbarea parolei** contului care a aprobat, **security checkup**, scoaterea omului din administratorii paginii, sau dezactivarea aplicației din setările de business.
- Simptomul tipic: postările programate trec brusc pe „eșuată". Diagnosticul corect: `verifica_integrare("meta")` (testează tokenul LIVE). Soluția: reconectarea paginii (același link OAuth) — durează 1 minut.

## Specific UE (relevant pentru reclame)

- Reclamele care rulează în UE cer câmpurile **DSA** („cine beneficiază / cine plătește") — Symbai le completează automat din datele brandului, dar Meta poate cere confirmarea lor în Ads Manager la prima campanie.

## Probleme frecvente — dicționar rapid

| Simptom | Cauza probabilă | Rezolvarea |
|---|---|---|
| „Nu văd pagina mea în dialogul Meta" | Omul logat nu e admin pe pagină / pagina e în alt Business Manager | Logare cu contul admin sau cerere de rol de la deținător |
| „Instagram nu se conectează" | Cont IG personal sau nelegat de pagină | Convertit la Business + legat în Centrul de conturi |
| „Token expirat" la verificare | Parolă schimbată / security checkup | Reconectare pagină (link nou) |
| Postare FB ok, IG eșuată | Permisiuni Instagram debifate la conectare | Reconectare cu toate bifele |
| „Nu există cont de reclame" | Pagina e conectată, dar Ads nu | Link separat `meta_ads`; cont de reclame creat în Business Manager |

## Verificarea (sursa de adevăr)

`verifica_integrare("meta")` întoarce un checklist live: credențiale aplicație → pagină conectată → token valid (testat pe API-ul Meta în acel moment) → permisiuni → Instagram → cont reclame. După ORICE pas de conectare, re-rularea lui e singura confirmare reală.
