# Recenzii & reputație

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Symbai strânge într-un loc recenziile de pe toate platformele (Google, Facebook, Trustpilot, Booking, TripAdvisor + recenziile interne de produs și de eveniment) ca să le poți vedea, răspunde rapid (cu sugestie AI) și analiza sentimentul. Tot de aici trimiți automat **invitații de recenzie** clienților după o comandă — așa crești numărul de recenzii autentice. Recenziile sunt răspândite pe câteva pagini în funcție de modul (restaurant/retail/hotel/ecommerce); acest ghid le adună pe toate.

## Concepte

- **Recenzie** — notă (1–5 stele) + comentariu, de la un client, de pe o platformă externă sau din formularul intern.
- **Sentiment** — analiză automată (pozitiv/neutru/negativ) ca să prioritizezi ce-i de rezolvat.
- **Răspuns la recenzie** — replica publică a managerului; pentru multe platforme o poți trimite direct din Symbai, cu sugestie de text generată de AI.
- **Invitație de recenzie** — mesaj trimis clientului după comandă/vizită care-l roagă să lase o recenzie (crește volumul de recenzii reale).
- **Centru de recenzii** — inbox-ul agregat; pentru hotel e separat (recenzii de pe Booking/TripAdvisor/Google).
- **Review gating** — ascunderea opțiunii de recenzie publică pentru clienții nemulțumiți sau trimiterea numai a notelor mari spre Google. Google cere să nu soliciți selectiv recenziile pozitive. Symbai lasă proprietarul să aleagă notele care primesc butoanele publice (per brand la Smart Review, per campanie la recenziile pe loturi): recomandă toate notele, spune riscul o singură dată, apoi respectă alegerea lui. Pragul de alertă al managerului și pragurile automatizărilor interne pozitive/negative sunt setări separate și nu decid cine primește link public.

## Pagini (în funcție de modul)

- **Recenzii & Feedback** (`/feedback`) — recenziile și feedback-ul general: management recenzii, performanța angajaților, tendințe & analiză, setări (colectare digitală, alerte rating scăzut, recompensă pentru feedback). Notele care primesc butoanele publice și pragul separat de alertă Smart Review se configurează pentru brand în setările de Marketing.
- **QR pe bonul de livrare** — nota pentru pungă a comenzilor Wolt/Glovo/Bolt/site: Livrări → **Centru de Comenzi** (`/deliveries/pos`) → butonul imprimantei → **Tipărire & ambalare**. Răspunsurile intră în `/feedback`, pe canalul „QR pe bonul de livrare”.
- **Google Business Profile** (`/gbp`) — recenziile Google + răspunsuri direct la ele.
- **Recenzii produse** (`/ecommerce/reviews`) și **Recenzii externe** (`/ecommerce/external-reviews`) — recenziile de produs din magazinul online + agregare Trustpilot/Google/Facebook.
- **Centru Recenzii Hotel** (`/hotel/reviews`) și **Feedback & Review-uri** (`/hotel/guest-feedback`) — recenzii de pe Booking/TripAdvisor/Google + NPS pe categorii.
- **Recenzie Eveniment** (`/recenzie-eveniment/:token`) — pagina publică post-eveniment (o singură trimitere per link).
- **Recenzii pe loturi** (`/product-reviews`) — fabrici: QR pe ambalaj, nota fiecărui lot, avertizări. Ghid separat: `recenzii-pe-loturi.md`.

## Fluxuri pas-cu-pas

1. **Răspunzi la o recenzie nouă (mai ales negativă)**: deschizi recenziile (`/feedback` sau `/gbp`) → citești → ceri o sugestie de răspuns → ajustezi tonul → trimiți. Prin conexiune: `list_retail_reviews` (vezi noile recenzii) → `reply_to_retail_review` (trimite răspunsul). Pentru fluxul condus, folosește skill-ul `raspunde-recenzii`.
2. **Trimiți invitații de recenzie după comandă**: `dispatch_review_invitations_for_order` — clientul primește un mesaj cu rugămintea de a lăsa o recenzie. (Respectă consimțământul de marketing — vezi GDPR.)
3. **Aduci recenziile la zi de pe platforme externe**: `sync_retail_reviews` — sincronizează manual (de obicei rulează automat periodic).
4. **Vezi cum stai pe ansamblu**: `get_retail_reviews_summary` — rating mediu, distribuție pe stele, tendință, top motive.
5. **Analizezi sentimentul** pe ultimele zile/luni: din /feedback → Tendințe & Analiză, sau întrebând asistentul pe baza sumarului.
6. **Configurezi Smart Review**: alegi notele care primesc butoanele publice (recomandat toate) → setezi separat nota maximă la care se alertează managerul → păstrezi automatizările de feedback pozitiv/negativ pentru follow-up intern. Nu construi din automatizări o trimitere selectivă spre Google; dacă proprietarul o vrea, folosește alegerea notelor, unde rămâne vizibilă.
7. **Pui QR de recenzie pe bonul comenzilor de livrare** (nota pentru pungă): `get_delivery_print_settings(locationId)` → `update_delivery_print_settings({ locationId, packingNoteDesign: { review: { enabled: true, title?, message?, pageTitle?, pageMessage? } } })`. Trimiți doar ce schimbi; casa, imprimanta și restul designului rămân. Un câmp greșit sau un text prea lung se refuză cu numele lui. Răspunsul are `packingNote.preview` (nota ca text, pe o comandă de exemplu) și `packingNote.reviewQr.problems` (de ce n-ar ieși QR-ul: fără adresă publică, canal fără brand) — arată-le omului înainte să spui „gata”. `pageTitle`/`pageMessage` sunt textul paginii deschise din pungă (gol = „Cum a fost comanda ta?”); titlul de la masă al brandului nu se folosește pentru livrări. Fiecare pungă primește un QR propriu, legat de comanda ei: răspunsul arată „Wolt #cod” (masa) și „Livrare Wolt” (zona), iar după ridicare se leagă și de nota POS. Pe același design alegi titlul, mesajul de sus și de jos (cu `{brand}`, `{platforma}`, `{cod}`), ce date ale clientului apar, bifele de ambalare, QR-ul de urmărire, codul de bare pentru șofer și mărimea QR-urilor. Întrebările, butonul Google, emailul cu reducere și blocurile de după recenzie sunt ale brandului (`configure_review_qr`, `configure_review_after`). Se aplică notelor tipărite după salvare.

## Tool-uri MCP utile

- Citire: `list_retail_reviews`, `get_retail_reviews_summary`.
- Scriere (modulul **Marketing & Social Media** pe token): `reply_to_retail_review`, `sync_retail_reviews`, `dispatch_review_invitations_for_order`.
- Pentru a verifica dacă poți contacta clientul (invitații): `check_marketing_allowed`, `comms_get_status` (vezi ghidul de comunicare).
- Permisiunea exactă: vezi `tools-mcp.md`.

## Întrebări frecvente

- **Pot răspunde la recenziile Google direct din Symbai?** Da, dacă Google Business Profile e conectat (`/gbp`). Altfel, răspunzi din contul platformei.
- **Cât durează să apară recenziile externe?** Sincronizarea e periodică; forțează cu `sync_retail_reviews` dacă vrei imediat.
- **Pot să-mi „scot" o recenzie falsă?** Nu o ștergi din Symbai — o raportezi pe platforma sursă (Google/TripAdvisor). În Symbai poți răspunde public și o poți marca.
- **Cum cresc numărul de recenzii?** Trimite invitații după fiecare comandă (`dispatch_review_invitations_for_order`), respectând consimțământul.
- **Pot păstra 1–3 stele doar intern și trimite 4–5 stele spre Google?** Setarea există, dar acesta este review gating și Google cere să nu soliciți selectiv recenziile pozitive. Recomandă același traseu pentru toți: colectezi feedback-ul, alertezi intern managerul la note mici și păstrezi opțiunea publică pentru toți. Decizia rămâne a proprietarului.
- **Pot lega automat feedback-ul QR de ospătarul și masa servită?** Da, numai în fluxul post-plată în care serverul verifică apartenența clientului la sesiunea mesei sau la comanda lui. Brandul, locația, clientul și comanda sunt derivate server-side; comanda păstrează masa și angajatul care a servit-o. Pentru date vechi ori context fără această dovadă afișează „necunoscut” — nu deduce ospătarul după raion/sector și nu accepta ID-uri trimise liber de browser.
- **Cine poate răspunde?** Depinde de permisiunile de rol; răspunsul rămâne cu atribuire.
- **Pot face retargetare pe clienții care comandă prin Wolt/Glovo/Bolt?** Da, pentru cei care scanează QR-ul de pe pungă (recenzie sau urmărire). Pagina încarcă Pixelul Meta și GA4 ale brandului după acordul de cookie-uri și trimite evenimentul `DeliveryPlatformCustomer` cu platforma (`wolt`, `glovo`, `bolt`); `ReviewSubmitted` poartă și el platforma. Pixelul se pune cu `configure_website_marketing_tags` doar cu `brandId` dacă brandul nu are website (întâi `dryRun:true`, apoi `dryRun:false, applyToBrand:true`). Apoi creezi audiența pe acest eveniment și o campanie „comandă direct de la noi” (de exemplu cu codul primit pentru email). Clienții care nu scanează nu pot fi atinși: platforma nu dă datele lor. Spune o dată că unele contracte cu platformele limitează promovarea comenzii directe în punga lor; decizia e a proprietarului.

## Capcane

- **Recenziile sunt pe pagini diferite** după modul (general /feedback, Google /gbp, produse /ecommerce/reviews, hotel /hotel/reviews) — folosește `gaseste_in_aplicatie` ca să ajungi exact unde trebuie.
- **Invitațiile de recenzie sunt marketing** — respectă opt-out-ul clientului (GDPR); sistemul verifică, dar nu spama.
- **Răspunsul e public** — verifică tonul înainte de trimitere; sugestia AI e punct de plecare, nu text final automat.
- **Recenzia de eveniment** are link cu o singură folosire și poate expira.
- **QR-ul de recenzie de pe pungă lipsește?** `get_delivery_print_settings` îți spune în `packingNote.reviewQr.problems` exact ce lipsește (adresă publică, brandul canalului). Mai verifică: nota pentru pungă e pornită și designul are QR-ul de recenzie pornit. Nota tipărită înainte de salvare rămâne cu designul vechi.
- **Recenziile de pe platformă nu sunt aceleași cu cele din QR.** Notele lăsate în aplicația Wolt/Glovo/Bolt se citesc cu `delivery_business_reviews`; cele din QR-ul de pe pungă sunt ale tale, în `/feedback`.
- **Filtrarea internă pe stele este pentru prioritizare.** Varianta recomandată oferă tuturor același traseu public și tratează separat escaladarea operațională a notelor mici.
- **Automatizările „feedback pozitiv/negativ” sunt interne.** Pot crea taskuri, alerta managerul sau porni recovery, iar invitația publică nu se condiționează prin ele. Un flow vechi numit „review 5 stele” se convertește în follow-up intern; notele care primesc butoanele publice se aleg în setarea lor.
