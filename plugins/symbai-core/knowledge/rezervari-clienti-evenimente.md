# Rezervări, Clienți & Evenimente

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Modulul acoperă tot ce ține de relația cu clienții: rezervări de masă și lista de așteptare, evenimente private/petreceri cu fișă completă (produse, personal, contract, BEO, P&L), pipeline de vânzări (CRM), baza de clienți cu loialitate și recompense, feedback și chestionare, plus modulul Hotel (PMS) pentru proprietățile cu camere. Include și paginile publice prin care clienții rezervă online sau lasă recenzii.

## Concepte

- **Rezervare simplă** — o masă rezervată la o dată/oră, cu număr de persoane, telefon, status. Se gestionează în /reservations.
- **Eveniment / petrecere** — o rezervare „bogată": fișă cu până la 12 taburi (Deal, Sumar, Comunicare, Produse, Personal, Prep & Bucătărie, Producție, Cheltuieli, Contract, Recenzii, BEO, P&L). Care taburi apar depinde de tipul de rezervare.
- **Tip de rezervare** — configurabil per brand (Setări → Sales CRM → Tipuri rezervări): definește dacă tipul e „eveniment" sau rezervare simplă, ce taburi/capabilități are și ce liste sunt permise (săli, roluri, jocuri, produse, modele de contract). Calendarul folosește acest flag ca să decidă ce fișă deschide la click.
- **Deal** — un eveniment/petrecere văzut prin lentila vânzărilor: are etapă în pipeline, valoare, probabilitate. „Deal câștigat" = evenimentul s-a confirmat și a avut loc.
- **Pipeline** — kanban cu etape configurabile în /sales-crm; „limbajul" se adaptează tipului de business (rezervări, petreceri, lead-uri, comenzi, cursanți...). 20 de șabloane de business preconfigurează CRM-ul printr-un wizard în 3 pași la prima deschidere.
- **BEO (Banquet Event Order)** — fișa printabilă a unei petreceri: client, dată, produse comandate cu ore de servire, cronologie, note. Se dă bucătăriei/echipei în ziua evenimentului.
- **Avans (deposit)** — sumă cerută la rezervare/eveniment; se urmărește pe deal (cerut/plătit) și poate fi încasat online. Cerințele de avans se configurează per brand/locație.
- **Contract e-sign** — șabloane HTML cu variabile completate automat, trimitere pe email/WhatsApp/SMS/link/QR, semnare publică pe link, multi-semnatar, PDF + certificat de audit. După semnare se poate cere automat avansul.
- **Loialitate** — puncte acumulate la cumpărături, niveluri Bronze/Silver/Gold/Platinum, reguli configurabile per brand (puncte/leu, valoare de răscumpărare, bonus zi de naștere/înscriere).
- **Waitlist (listă de așteptare)** — clienți walk-in fără rezervare, cu timp estimat; tabul apare doar dacă funcția e activată în setările de rezervări.
- **Pacing / turn time** — controlul ritmului: câți clienți pot sosi per interval de 15 minute și cât stă în medie un grup la masă (pe dimensiune de grup).
- **Chestionar** — formular construit vizual (întrebări, logică, temă), trimis clienților sau completat public; există și declanșatoare pe feedback pozitiv/negativ.
- **Loc CRM (crm_seat)** — paginile de vânzări/servicii B2B se văd doar de angajații nominalizați ca „Useri CRM" (locuri facturabile nominal, în Setări → Sales CRM → Useri CRM); regula se aplică inclusiv adminilor — nici adminul nu vede aceste pagini fără nominalizare.
- **Sejur / folio (hotel)** — șederea unui oaspete și contul lui de cheltuieli pe durata șederii; hotelul are CRM și loialitate separate (pe nopți, RFM).

## Paginile modulului

### Rezervări & calendar
- **Calendar** (`/calendar`) — vedere unificată: rezervări simple, evenimente și deal-uri, cu filtre globale brand/locație. Click pe element deschide fișa potrivită (rezervare sau eveniment, după tipul configurat).
- **Rezervări** (`/reservations`) — centrul rezervărilor de masă, cu taburi: Listă de Așteptare (doar dacă waitlist-ul e activat), Plan Sală Live, Listă Rezervări, Timp Rotație & Analiză, Control Disponibilități, Petreceri (zi). Tot aici creezi/editezi rezervări și poți genera contract.
- **Configurare Rezervări** (`/reservations/config`) — 4 taburi: Reguli Rezervare (activare, fereastră de timp, min/max persoane), Inventar & Zone, Control Flux (Ritm), Câmpuri Formular. Limitele se aplică rezervărilor online; personalul poate depăși din POS.
- **BEO Rezervare** (`/reservations/:id/beo`) — fișa BEO printabilă a unei petreceri: client, produse cu ore de servire, cronologie; buton „Printează BEO".

### Evenimente
- **Evenimente** (`/events`) — lista tuturor evenimentelor cu sumar P&L în timp real.
- **Detaliu Eveniment** (`/event/:id`) — fișa completă cu cele până la 12 taburi (vizibile după tipul evenimentului); P&L-ul adună costul producției + personalul alocat (ore × tarif) + cheltuielile atașate versus venit.

### Vânzări & CRM (necesită loc CRM nominal — crm_seat)
- **Sales CRM** (`/sales-crm`) — dashboard, pipeline kanban (drag & drop), calendar, rezervări, clienți, sarcini, analiză. Wizard de configurare la prima deschidere.
- **Automatizări Vânzări** (`/sales/automations`) — reguli declanșator → acțiune pe deal-uri (declanșatoare pe deal, sarcini și zile față de eveniment; 9 acțiuni: creează sarcină, schimbă etapa, trimite contract, trimite link de plată...), cu istoric rulări.
- **Catalog Servicii** (`/services/catalog`), **Oferte** (`/services/quotes`), **Proiecte** (`/services/projects`), **Pontare ore** (`/services/time`), **Tickets** (`/services/tickets`), **Contracte recurente** (`/services/recurring`) — suita pentru business-uri de servicii B2B: servicii vândute, oferte/devize, proiecte cu milestones și taskuri, ore facturabile, cazuri de suport, retainers.
- **Cvent (RFP-uri)** (`/integrations/cvent`) — cereri de ofertă pentru evenimente din rețeaua Cvent: RFP-uri, Oferte, Șabloane, Reguli auto, Locații, Conturi Cvent. Vizibilă doar cu Cvent activat în setările CRM + credențiale configurate (nu cere loc CRM nominal; are și alias /hotel/integrations/cvent).

### Clienți (CRM)
- **Clienți** (`/portal-customers`, alias `/customers`) — baza de clienți: Listă Clienți, Persoane Juridice, Segmente & Grupuri, Autentificare & RFID. Fișa clientului are taburi Profil, Prieteni, Evenimente, Misiuni, Insigne, Recompense, Comenzi, Copii și Grupări (ultimul apare doar dacă clientul face parte din grupări).
- **Import Clienți** (`/customer-import`) — import din fișier în 5 pași: Încărcare → Mapare coloane → Previzualizare → Revizuire email-uri → Import.
- **Follow-up Clienți** (`/customer-followup`) — Funnel, Next Best Action (sugestii zilnice cu scor: sună / trimite ofertă / cere recenzie), Task Queue, Playbooks (jurnale automate: confirmare, reminder, mulțumire + feedback, re-angajare), Timeline client.
- **Rapoarte Clienți** (`/customer-reports`) — privire de ansamblu (top clienți, distribuție loialitate, creștere lunară), distribuție pe taguri, constructor de segmente.
- **Acces Carduri** (`/access-cards`) — carduri RFID și credite clienți (intrări, portofel virtual).

### Loialitate & portal clienți
- **Fidelizare & Recompense** (`/loyalty`) — Privire de ansamblu, Clienți cu puncte, Setări: reguli de acumulare/utilizare, niveluri (tiers), campanii speciale.
- **Configurare Portal** (`/portal-config`) — ce văd clienții în portalul/platforma clienților: tab-uri, secțiuni, meniu, aspect, funcționalități.
- **Atracții** (`/portal-attractions`) — atracțiile afișate în portal, pe categorii.
- **Jocuri** (`/portal-games`) — jocuri/activități rezervabile (parc de distracții): configurare, program pe zile, excepții de dată, prețuri, previzualizare.
- **Misiuni & Recompense** (`/portal-missions`) — gamificare portal: Misiuni, Insigne, Recompense.

### Feedback & chestionare
- **Recenzii & Feedback** (`/feedback`) — Management Recenzii, Performanța Angajaților, Tendințe & Analiză, Setări Feedback (colectare digitală, alerte rating scăzut, recompensă pentru feedback).
- **Chestionare** (`/questionnaires`) — constructor de chestionare (Setări, Logică, Temă, Variabile, Trimitere), răspunsuri recente, statistici personal.
- **Chestionar Public** (`/questionnaire/:id`) — pagina publică pe care clientul completează chestionarul.
- **Recenzie Eveniment** (`/recenzie-eveniment/:token`) — pagină publică post-eveniment: notă 1–5 stele + comentariu; o singură trimitere per link, linkurile pot expira.

### Hotel (apar doar cu modulul Hotel/PMS activ)
- **Dashboard Hotel** (`/hotel`) — KPI: ocupare, sosiri/plecări, venituri.
- **Recepție** (`/hotel/front-desk`) — centrul operațional: check-in/check-out, sosiri pe data de business.
- **Housekeeping** (`/hotel/housekeeping`) — statusul camerelor, sarcini de curățenie și mentenanță.
- **Camere** (`/hotel/rooms`) și **Tipuri Cameră** (`/hotel/room-types`) — inventarul fizic și tipologiile.
- **Rate Manager** (`/hotel/rates`) — calendar de tarife, planuri tarifare, restricții, reguli de yield, prognoză cerere, prețuri competitori, recomandări.
- **Coduri Promoționale** (`/hotel/promo-codes`) — coduri de reducere publice pentru rezervările directe.
- **Channel Manager** (`/hotel/channels`) — conexiuni OTA, mapări camere/tarife, jurnal de sincronizare, alerte de paritate tarifară.
- **Group Blocks** (`/hotel/groups`) — blocuri de camere pentru grupuri (allotments) cu timeline.
- **Oaspeți** (`/hotel/guests`) — profiluri de oaspeți (VIP, preferințe, GDPR).
- **CRM & Loialitate** (`/hotel/crm`) — loialitate hotel pe nopți, tiers, segmente RFM, recompense.
- **Feedback & Review-uri** (`/hotel/guest-feedback`) — NPS, rating pe categorii, configurare platforme de recenzii.
- **Centru Recenzii** (`/hotel/reviews`) — inbox recenzii externe (TripAdvisor/Google).

### Pagini publice
- **Booking Public** (`/book/...`) — aplicația publică de rezervare (multilingvă) pentru clienți.

## Fluxuri frecvente

1. **Creezi o rezervare de masă**: /reservations → „Rezervare Nouă" → client, dată, oră, persoane, eventual masă → salvezi. Prin AI: `create_reservation`. Statusul se schimbă ulterior cu `update_reservation`, anularea cu `cancel_reservation`.
2. **Configurezi sistemul de rezervări**: /reservations/config → Reguli (activare, fereastră, min/max persoane), Inventar & Zone, Control Flux, Câmpuri Formular → „Salvează Modificări". Prin AI: `configure_reservation_settings`, `configure_reservation_operating_hours`, `configure_reservation_turn_times`, `configure_reservation_deposit`, `configure_reservation_pacing`, sau `seed_reservation_settings` pentru valori recomandate pe tipul de business.
3. **Organizezi o petrecere/eveniment privat**: creezi deal-ul în /sales-crm (sau rezervare de tip eveniment) → în fișa evenimentului adaugi Produse (meniul), Personal, eventual Producție și Cheltuieli → trimiți Contractul la semnat → ceri avansul → în ziua evenimentului printezi BEO-ul → după, vezi P&L-ul evenimentului.
4. **Trimiti contractul la semnat**: din fișa evenimentului (tab Contract) sau din dialogul „Generează Contract" din /reservations → alegi modelul → variabilele se completează automat → trimiți pe email/WhatsApp/SMS/link → clientul semnează public pe link → după semnare se poate cere automat avansul.
5. **Imporți clienți din Excel/CSV**: /customer-import → încarci fișierul → mapezi coloanele → previzualizezi → revizuiești email-urile → confirmi importul.
6. **Pornești loialitatea**: /loyalty → Setări → reguli de acumulare (puncte/leu), valoare de răscumpărare, niveluri, bonusuri de zi de naștere/înscriere → punctele se acumulează automat la cumpărături.
7. **Colectezi feedback post-eveniment**: clientul primește linkul de recenzie (/recenzie-eveniment/:token) → dă nota și comentariul → recenzia apare în fișa evenimentului (tab Recenzii) și în /feedback. Pentru întrebări structurate, construiești un chestionar în /questionnaires și îl trimiți (are și pagină publică).
8. **Rezervi un joc/activitate (parc de distracții)**: verifici disponibilitatea cu `check_game_availability` sau `get_game_slots` → creezi rezervarea cu `create_game_reservation` (jucători, copii/adulți, contact, exclusivitate). Configurarea jocurilor se face în /portal-games.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `get_reservations_overview` — rezumat rezervări: setări, statistici, rezervări azi/mâine, waitlist, tipuri configurate. Primul tool la „cum stăm cu rezervările".
- `get_reservation_settings` — setările de rezervări pentru o locație/brand.
- `list_portal_games` / `get_game_details` / `check_game_availability` / `get_game_slots` — jocurile din portal, program, prețuri și disponibilitate pe dată/oră.
- `get_portal_config` — configurația curentă a portalului clienți.
- `list_entities` — listare rapidă de entități (inclusiv clienți) cu filtrare pe brand.
- `jurnal_activitate` — cine a creat/modificat/anulat o rezervare și când (categoriile „Rezervări", „Contracte", „SERVICES_CRM", tipEntitate `reservation`).
- `gaseste_in_aplicatie` — linkul direct către orice pagină din modul.

**Scriere — modul `rezervari_clienti`:**
- `create_reservation` / `update_reservation` / `cancel_reservation` — creare, modificare (status, dată, persoane), anulare rezervări.
- `create_waitlist_entry` / `update_waitlist_entry` — lista de așteptare (walk-in).
- `create_customer` — client nou în baza de date (fidelizare, rezervări, istoric).
- `create_game_reservation` — rezervare de joc/activitate.

**Scriere — modul `setari`** (configurarea, nu operarea):
- `configure_reservation_settings` / `configure_reservation_operating_hours` / `configure_reservation_turn_times` / `configure_reservation_deposit` / `configure_reservation_pacing` / `seed_reservation_settings` — toate setările sistemului de rezervări.
- `configure_portal_features` / `configure_portal_general` / `configure_portal_appearance` / `configure_portal_texts` / `configure_portal_display` — portalul clienților (inclusiv activarea rezervărilor în portal).
- `update_game_config` / `update_game_schedule` / `update_game_pricing` / `set_game_date_override` — configurarea jocurilor.

## Întrebări frecvente și capcane

- **De ce nu văd pagina Sales CRM / Servicii?** → Sunt protejate de locuri CRM nominale (crm_seat): angajatul trebuie nominalizat ca „User CRM" în Setări → Sales CRM → Useri CRM. Regula se aplică inclusiv adminilor — fără nominalizare, nici adminul nu vede paginile.
- **De ce nu apare un tab pe fișa evenimentului (ex. Producție, Contract)?** → Taburile depind de tipul de rezervare; verifică Setări → Sales CRM → Tipuri rezervări, unde se bifează capabilitățile fiecărui tip. Există și un nivel per brand care poate ascunde taburi pentru toate evenimentele brandului.
- **De ce nu văd tabul „Listă de Așteptare" în /reservations?** → Apare doar dacă waitlist-ul e activat în setările de rezervări.
- **De ce nu apare pagina Cvent?** → E vizibilă doar cu integrarea Cvent activată în setările CRM și cu credențiale configurate.
- **De ce clientul nu poate rezerva online un grup de 15 persoane, dar eu pot din POS?** → Limitele min/max persoane se aplică rezervărilor online; personalul poate depăși limitele din POS.
- **Calendarul pare gol / lipsesc rezervări** → Verifică filtrele globale de brand și locație din partea de sus a paginii.
- **De ce nu pot șterge un client prin AI?** → Nu există tool-uri MCP de ștergere de entități; ștergerile se fac din aplicație. Pentru duplicate folosește fuziunea de clienți (păstrează istoricul, cu audit).
- **„/customers" și „/portal-customers" sunt pagini diferite?** → Nu, e aceeași pagină de clienți, accesibilă pe ambele rute.
- **Clientul zice că linkul de recenzie nu merge** → Linkurile de recenzie post-eveniment pot expira și acceptă o singură trimitere; dacă recenzia a fost deja trimisă, pagina o confirmă.
- **De ce nu primește clientul email/SMS de la playbooks?** → GDPR: opt-out-ul per canal (email/SMS/WhatsApp) se verifică înainte de orice trimitere; verifică consimțămintele clientului.
- **Promoțiile de pe website reduc nota?** → Nu — banner-ele de promoții website sunt separate de motorul de oferte care chiar reduce nota (vezi modulul de oferte).
- **De ce nu văd paginile Hotel?** → Apar doar cu modulul Hotel (PMS) activ în abonament.

## Pentru acces SQL

Tabele principale: `reservations` (+ `reservation_settings`, `reservation_products`, `reservation_milestones`, `reservation_type_configs`, `waitlist_entries`), `sales_deals` / `sales_stages` / `sales_pipelines` / `sales_activities` / `sales_automations`, `customers` (+ `customer_groups`, `customer_merge_log`), `loyalty_settings` / `loyalty_transactions`, `contracts` / `contract_templates` / `contract_signers`, `event_reviews` / `customer_reviews`, `questionnaires` / `questionnaire_responses`, `portal_game_reservations`, iar pe hotel: `hotel_reservations`, `hotel_rooms`, `hotel_room_types`, `hotel_stays`, `guest_profiles`, `guest_folios`, `hotel_loyalty_ledger`.

Exemple: „câte rezervări confirmate avem săptămâna viitoare?" → `reservations` pe interval de dată + status; „care clienți au peste 1000 de puncte?" → `customers` (puncte loialitate) sau `loyalty_transactions` agregat; „ce note au primit evenimentele din ultima lună?" → `event_reviews` join `reservations`.
