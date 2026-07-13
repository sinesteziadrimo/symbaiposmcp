# Harta aplicației Symbai — toate paginile

> Index exhaustiv generat din registrul de navigare al aplicației (aceeași sursă pe care o citește tool-ul `gaseste_in_aplicatie`). Descrierile sunt verificate contra paginilor reale (2026-06-14). Folosește harta pentru ORIENTARE și EXPLICAȚII (ce face fiecare pagină); pentru cele mai cerute pagini la du-mă la X e mai rapid `navigare-rapida.md`. Cum DESCHIZI efectiv pagina prin extensia Chrome și cum SCHIMBI unitatea: `navigare.md`. Intrările Tab au URL-ul complet `?tab=` între paranteze.

## DASHBOARD & OPERATIUNI

- **Panou de Control** (`/`) — Dashboard generic: KPI (nr. produse, stoc redus, valoare stoc, de plătit furnizori), grafic facturi, top produse, sugestie AI, facturi recente. Buton Raport + AI Insights.
- **Sarcinile Mele** (`/my-tasks`) — Feed-ul personal al angajatului: 3 KPI (De făcut/Întârziate/Finalizate azi) + 3 tab-uri (Astăzi grupat Întârziate→Azi→Următoarele, Generale-libere, Finalizate). Bifezi one-tap; unde se cere, dialog dovadă foto/notă/număr/semnătură.
- **Control Operațional** (`/operations`) — Monitorizare în timp real — comenzi active, stare bucătărie, stare sală
## POS — PUNCTE DE VÂNZARE

- **POS** (`/pos/kiosk`) — Self-service kiosk full-screen pentru CLIENT: pași attract → comandă → upsell → plată (card / Charge to Room hotel) → succes cu nr. comandă. Dialog inactivitate „Ești încă aici?'. NU e POS pentru personal.
- **Comenzi** (`/pos/waiter-orders`) — Ecran „Comenzi Client' (real-time): cererile clienților de la masă pe secțiuni — Comenzi Noi de Confirmat, Neasignate (Preia Masa), Acceptate→Trimite la Bucătărie, Chemat la Masă (Pe drum), Cereri Notă de Plată, Cereri Plată, Timpuri estimative. Poate cere PIN ospătar.
- **POS Kiosk** (`/pos/kiosk`) — Self-service kiosk full-screen pentru CLIENT: pași attract → comandă → upsell → plată (card / Charge to Room hotel) → succes cu nr. comandă. Dialog inactivitate „Ești încă aici?'. NU e POS pentru personal. _Notă: Pentru ospătari la masă folosește /pos/waiter sau /pos/mobile._
- **POS Ospătar** (`/pos/waiter`) — Interfață POS pentru OSPĂTAR pe tabletă (size tablet, 7-12 inch). Restaurant servire la masă, vizualizare full sala + comandă per masă.
- **POS Mobil** (`/pos/mobile`) — POS pe TELEFON mobil pentru ospătari (interfață compact, 5-6 inch). Echivalent funcțional cu /pos/waiter dar optimizat pentru telefoane.
- **POS Bar** (`/pos/bar`) — Aceeași interfață pe canalul „bar': comandă per masă, meniu, plată, operațiuni. Pe desktop are coloană coș + suport scanner coduri bare. Meniul prioritar bar se setează prin profil afișaj.
- **POS Recepție** (`/pos/reception`) — POS pentru RECEPȚIE hotel/pensiune — încasare cazare + servicii suplimentare, integrare cu folio oaspete. _Notă: Pentru check-in/check-out propriu-zis folosește /hotel/front-desk._
- **POS Website** (`/pos/website`) — Comenzi online de pe website
- **Mese Deschise** (`/pos/open-tables`) — Listă (carduri grid) cu toate mesele active: total deschis cumulat sus, căutare după masă/angajat, status (Ocupată/Clarificare/Plată în curs/Așteaptă plata), ETA bucătărie per masă. Click → dialog cu articolele notei + buton Încasează.
- **Comenzi Ospătar** (`/pos/waiter-orders`) — Ecran „Comenzi Client' (real-time): cererile clienților de la masă pe secțiuni — Comenzi Noi de Confirmat, Neasignate (Preia Masa), Acceptate→Trimite la Bucătărie, Chemat la Masă (Pe drum), Cereri Notă de Plată, Cereri Plată, Timpuri estimative. Poate cere PIN ospătar.
## MENIU & DISPOZITIVE POS

- **Meniu & Dispozitive POS** (`/menu`) — Hub meniu cu 5 tab-uri reale: Prețuri Meniu, Platforme, Configurare Afișaj (POS/Web), Meniu Fizic, Oferte & Promoții.
  - Tab **Prețuri Meniu** (`/menu?tab=pricing`) — Editor prețuri de vânzare per meniu: listă „Toate produsele”, food cost total, sortare după food cost, adaugă produse/pachete-combo, buton „AI Prețuri” (→/ai-pricing) + „Adaugă poze bulk”.
  - Tab **Platforme POS** (`/menu?tab=menus`) — Activezi/configurezi punctele de vânzare (Mod Kiosk, POS Ospătar, POS Mobil App&Web, POS Bar, Platforma Clienți Web) și ce meniu vede fiecare; include Website Builder și Kiosk Builder. _Notă: Din acest tab poți activa Website-ul propriu și comenzile online. Click pe 'Website/Online' → butonul 'Configurează' pentru Website Builder. Website Builder-ul are un asistent AI integrat (WB Assistant) care apare în dreapta jos — ajută cu template-uri, pagini, componente, design, setări._
  - Tab **Configurare Afișaj** (`/menu?tab=display`) — Profile de afișare meniu per canal (POS Ospătar, Kiosk Client, Website/Online, Platforma Clienți Web, Table—Clienți QR): teme, layout carduri, ordine/navigare categorii, imagini.
  - Tab **Meniu Fizic** (`/menu?tab=physical-menu`) — Designer de meniu tipărit/PDF : formate A4/A3, paginare „Recalculează”, copertă + pagini nutriționale/alergeni, export PDF/print, QR dinamic pe copertă.
  - Tab **Oferte & Promoții** (`/menu?tab=promotions`) — Motor de oferte care reduc nota; 3 sub-tab-uri: Panou Control, Upsell & Cross-sell, Happy Hour & Dinamic. Tipuri promo: Reducere %, Articol Gratuit, Cumpără X primești Y, Sumă Fixă. Pe canale (POS/Kiosk/Website/QR/Delivery) și zile/ore; buton „Sugestii AI” + „Campanie Nouă”.
## FINANȚE

- **Finanțe & Contabilitate** (`/finance`) — Pagină-umbrelă, 7 tab-uri: Sumar (default), Cash Flow, Cheltuieli & Plăți, Reconciliere Canale, Control Viva, Control Card GP, Solduri inițiale. Buton „Ghid'. Tab-ul „close' redirect→/finance/daily-close.
  - Tab **Cash Flow** (`/finance?tab=cashflow`) — Tab Cash Flow — fluxul AGREGAT de numerar (încasări vs plăți), grafice, previziuni viitor. Pentru registrul fizic numerar pe zi → /finance/cash-book.
  - Tab **Cheltuieli & Plăți** (`/finance?tab=expenses`) — Tab cu 3 sub-tab-uri: „Toate Mișcările' (KPI ieșiri/intrări/sold furnizori + tabel filtrabil pe sursă manual/factură/extras), „Cheltuieli Manuale', „Sold Furnizori'. Search + filtre perioadă/sursă/direcție.
- **Închidere Zi** (`/finance/daily-close`) — Pagină standalone — RITUAL DE ZI: numărătoare cash în casierie + reconciliere cu sistemul + generare raport Z fiscal. Necesar la finalul fiecărei zile de lucru pentru fiscalizare RO. _Notă: Procedură standard: 1) numără cash fizic, 2) verifică total Viva/card, 3) confirmă rest casierie pentru ziua următoare, 4) generează raport Z, 5) sigilează zi._
- **Casierii (mod organizare)** (`/finance/cash-registers`) — Configurare casierii și mod organizare: per firmă / per locație / per brand × locație. Tot aici: reguli pe țară și mapări auto-feed.
  - Tab **Reconciliere Canale** (`/finance?tab=reconciliation`) — Tab Reconciliere — potrivire plăți canale livrare vs POS, comisioane
  - Tab **Control Viva** (`/finance?tab=viva`) — Tab Control Viva — integrare plăți Viva Wallet, tranzacții card, decontări
- **Cash Flow Dedicat** (`/finance/cashflow`) — Pagina dedicată de Cash Flow — vizualizare completă flux numerar
- **Registru de casă** (`/finance/cash-book`) — Registru de casă (cod 14-4-7A) — operațiuni numerar pe zi, închidere/sigilare cu hash, reconciliere extras bancă, conformitate RO/MD
- **Casierii (Registre)** (`/finance/cash-book/registers`) — Alias către configurarea casieriilor accesibilă din pagina registru de casă
## ANALYTICS & RAPOARTE

- **Rapoarte & Analiză** (`/analytics`) — Hub rapoarte: 4 carduri sus (Venit cu TVA, fără TVA, de Predat, Profit Estimat NET) + 15 tab-uri (Raport Zilnic, P&L, Vânzări Angajați, Timpi, Mese, Avansate, Produse Vândute, Costuri, Vânzări, Inventar, Personal, Plăți, Categorii, Gestiune, Note Clienți). Filtre dată/brand/locație.
  - Tab **Raport Zilnic (Z)** (`/analytics?tab=daily`) — Tab Raport Zilnic — rezumat vânzări pe zi, raport Z
  - Tab **P&L Detaliat** (`/analytics?tab=pnl`) — Tab P&L (Profit & Loss) — profit și pierdere detaliat pe categorii, raport profit
  - Tab **Vânzări Angajați** (`/analytics?tab=staff_sales`) — Tab Vânzări Angajați — performanță vânzări per angajat
  - Tab **Timpi Așteptare** (`/analytics?tab=speed`) — Tab Timpi Așteptare — analiza timpilor de servire, bucătărie, livrare, viteza serviciu
  - Tab **Analiză Mese** (`/analytics?tab=tables`) — Tab Analiză Mese — ocupare, rotație, venit per masă, raport mese
  - Tab **Rapoarte Avansate** (`/analytics?tab=advanced`) — Tab Rapoarte Avansate — rapoarte personalizabile, export
  - Tab **Costuri Operaționale** (`/analytics?tab=costs`) — Tab Costuri Operaționale — analiză costuri pe categorii
  - Tab **Vânzări & Venituri** (`/analytics?tab=sales`) — Tab cu UN singur grafic: „Trend Venituri vs. Comenzi' — area chart venituri pe zilele săptămânii suprapus cu numărul de comenzi. Pe mobil afișează doar mesaj „folosește desktop pentru chart-uri'.
  - Tab **Inventar & Costuri** (`/analytics?tab=inventory`) — Tab Inventar & Costuri — tabel „Pierderi & Ajustări Negative' (produse scoase prin minus/waste/write-off cu cantitate și cost) + pie „Structură Costuri' (categorii facturi furnizor).
  - Tab **Performanță Personal** (`/analytics?tab=staff`) — Tab Performanță Personal — ore lucrate, productivitate, evaluare
  - Tab **Plăți & Metode** (`/analytics?tab=payments`) — Tab Plăți & Metode — defalcare pe metode de plată (cash, card, online)
  - Tab **Mix Categorii** (`/analytics?tab=categories`) — Tab Mix Categorii — distribuția vânzărilor pe categorii de produse, raport categorii
  - Tab **Rapoarte Gestiune** (`/analytics?tab=gestiune`) — Tab Rapoarte Gestiune — NIR, avize, fișe de magazie, rapoarte stoc
## PERSONAL (STAFF)

- **Personal** (`/staff`) — Pagina centrală HR „Personal & Control Acces': 10 tab-uri (Planificator Ture, Foaie Pontaj, Pontaje (prezență), Sarcini & Liste, Listă Personal, Roluri & Permisiuni, Grupuri Mesaje, Program Salon, Contracte & Salarii, Beneficii Personal) + buton Adaugă Angajat + selector unitate.
  - Tab **Planificator Ture** (`/staff?tab=scheduler`) — Calendar săptămânal drag-and-drop pentru ture: adaugi/muți/editezi ture, undo, copiere săptămâna anterioară, șabloane de tură, rânduri custom, culori per angajat, buton „Salvează și Publică Program'. Sub el panoul „Cereri Concediu' (aprobă/respinge).
  - Tab **Foaie Pontaj** (`/staff?tab=timesheets`) — Tab Foaie Pontaj — ore lucrate, prezență, absențe, overtime
  - Tab **Pontaje (prezență)** — pontajul self-service din aplicația Symbai Staff, pentru manageri: intrări/ieșiri cu GPS (opțional selfie), pauze cu motiv, telefoanele înregistrate per angajat, comparație planificat-vs-real
  - Tab **Sarcini & Liste** (`/staff?tab=tasks`) — Aici MANAGERUL construiește listele de sarcini: țintă pe rol+tură+raion, recurență, oră-limită, tip dovadă, verificare; panou live „Cine va vedea asta și când (azi)', șabloane și dashboard per listă (De făcut etc.).
  - Tab **Listă Personal** (`/staff?tab=list`) — Tab Listă Personal — toți angajații, date personale, contract, PIN POS
  - Tab **Roluri & Permisiuni** (`/staff?tab=roles`) — Tab Roluri & Permisiuni — creare roluri, atribuire permisiuni, acces module
  - Tab **Program Salon** (`/staff?tab=floor-schedule`) — Pe fiecare zi a săptămânii (per locație/brand) alegi ce aranjament de sală e activ + excepții pe dată + preset QR per raion (ce câmpuri cere clientul la scanare, confirmare ospătar). Decide rutarea comenzilor QR și raioanele din modalul de tură.
  - Tab **Beneficii Personal** — Regulile de mâncare/băutură pentru angajați — cine primește, la ce produse, ce valoare (gratuit, reducere procent, sumă fixă, preț special sau buget zilnic/săptămânal/lunar), aplicatori separați de beneficiari și buget per angajat. Vechiul link `/settings/staff-benefits` doar redirecționează aici.
## INVENTAR & STOC

- **Tablou de Bord Stoc** (`/inventory`) — Tablou de bord stoc (fără tab-uri): carduri KPI (valoare stoc, stoc redus, de plătit furnizori), alerte și ultimele mișcări. Stocul live, inventarierea și zonele sunt la Verificări Stoc; mișcările și ieșirile la Operațiuni Gestiune.
  - Tab **Stoc Curent** (`/inventory-check?tab=live-stock`) — Stoc curent (Stoc Live): cantități și valoare pe gestiuni în timp real, căutare și filtrare, alerte de stoc minim.
  - Tab **Inventariere** (`/inventory-check?tab=stocktake`) — Inventariere: numărare fizică pe gestiuni; diferențele se ajustează apoi în tab-ul Raport Diferențe. _Notă: Pentru ajustare după numărare → tab Diferențe Stoc. NU poți avea 2 sesiuni deschise simultan pe aceleași gestiuni (preventie dublă ajustare)._
  - Tab **Zone Depozitare** (`/inventory-check?tab=zones`) — Zone de depozitare (rafturi, frigidere) per gestiune — organizarea fizică a stocului.
  - Tab **Inventariere Mobilă** (`/inventory-check?tab=stocktake`) — Inventariere pe telefon (scanare și numărare) — același flux ca inventarierea, optimizat pentru mobil.
  - Tab **Diferențe Stoc** (`/inventory-check?tab=variance`) — Raport Diferențe: compară stocul fizic numărat cu cel din sistem și ajustează diferențele.
- **Niveluri Stoc** (`/master-data`) — Stoc minim/maxim (par levels): se setează ca proprietate a produsului în Categorii și Produse; alertele de stoc se calculează din ea.
- **Risipă & Pierderi** (`/stock-exits`) — Pierderi și risipă (expirat, deteriorat, casare): se înregistrează ca fișe de ieșire la Ieșiri Stoc.
  - Tab **Mișcări Stoc** (`/stock-operations?tab=movements`) — Mișcări stoc: intrări, ieșiri și transferuri — istoricul operațiunilor de gestiune.
- **Rețete Inventar** (`/ai-recipes`) — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
- **Producție Inventar** (`/productie-evenimente`) — Loturi de producție și semipreparate (consum materii prime) — pagina de producție restaurant.
- **Depozite & Gestiuni** (`/warehouse-products`) — Depozite și gestiuni: creezi/editezi gestiunile și vezi ce produse conține fiecare.
- **Categorii Inventar** (`/master-data`) — Categorii de produse pentru stoc — se gestionează în nomenclatorul de produse (grupare pe categorii).
  - Tab **Documente Gestiune** (`/stock-operations?tab=documents`) — Documente de gestiune: NIR-uri, avize, bonuri de consum și de transfer.
  - Tab **Rapoarte Inventar** (`/stock-operations?tab=reports`) — Rapoarte de gestiune: stoc, valoare, rotație, consum.
  - Tab **Aprobări Stoc** (`/inventory-check?tab=approvals`) — Aprobări stoc: ajustări și transferuri care așteaptă aprobare.
  - Tab **Audit Inventar** (`/inventory-check?tab=history`) — Istoric stoc: jurnalul mișcărilor și al modificărilor de stoc.
## ALTE PAGINI INVENTAR & PRODUCȚIE

- **Verificări Stoc** (`/inventory-check`) — Inventariere fizică — numărare, comparare, ajustare diferențe
- **Operațiuni Gestiune** (`/stock-operations`) — Transferuri, recepții, ieșiri, corecții stoc între gestiuni
- **Hub Aprovizionare** (`/smart-ordering`) — Comenzi automate furnizori — pe baza stoc minim, consum, previziuni
- **Producție Bucătărie** (`/production`) — Pagina de EXECUȚIE producție (shop-floor / fabrică). Titlu real în cod: «Execuție Producție». Bară live sus (operații active, loturi active, operatori, containere azi). 6 taburi: Execuție, Operații Active, Consumuri & Pierderi, Predări, KPI Live, Containere & QR (+buton Scanner Mobil pe tabul Containere).
- **Recomandări Achiziții** (`/procurement-recommendations`) — Tabel comparare prețuri între furnizori per produs: mod Prioritate vs Cel mai ieftin, filtru (economie/peste cost/egal), economie potențială vs cost curent, expandare ingrediente rețetă. Necesită produse de furnizor mapate.
- **Consum Zilnic** (`/daily-consumption`) — Generare și vizualizare consum zilnic — scădere automată stoc pe baza comenzilor închise, expandare rețete în materii prime, istoric pe zile
## MASTER DATA — PRODUSE & CATEGORII

- **Categorii și Produse** (`/master-data`) — Nomenclatorul complet de produse cu grupare pe Magazii / Categorii / Categorii Meniu, fișa produsului (poze, alergeni, taguri, gestiune, preț recepție), duplicare meniu cu categorii+produse, curăță categorii goale.
- **Alergeni** (`/allergens`) — 3 tab-uri: Lista alergeni (creare/editare cei 14 UE), Acoperire produse, Matrice Cross-Contact. Asociezi alergeni la materii prime (produsele finite moștenesc prin rețetă); buton „Sugestii Automate” după nume.
- **Etichete & Alergeni** (`/ai-tags`) — Titlu „Sym Tag Master”: gestionare etichete (panou „Etichete”) + chat AI „Chat AI / Propuneri AI” care PROPUNE taguri de alergeni (Reg. UE 1169), rutare imprimante/KDS și marketing — tu Aplici/Refuzi fiecare propunere, nimic automat.
## FURNIZORI

- **Furnizori & Produse** (`/suppliers`) — Administrare furnizori — catalog produse, prețuri, termeni plată, portal
- **Furnizori Symbai** (`/symbai-suppliers`) — Piață furnizori Symbai — catalog partajat, oferte furnizori din rețea
- **Sold Furnizori** (`/supplier-balances`) — Solduri furnizori — datorii, plăți, balanță furnizori, sold restant
- **Entități Juridice** (`/clients`) — Evidență persoane juridice — firme, CUI, adrese, date fiscale
## REZERVĂRI

- **Rezervări** (`/reservations`) — 6 tab-uri: Listă de Așteptare (doar dacă waitlist activat), Plan Sală Live, Listă Rezervări, Timp Rotație & Analiză, Control Disponibilități, Petreceri (zi). Creezi/editezi rezervări, generezi contract.
  - Tab **Listă de Așteptare** (`/reservations?tab=host`) — Tab pentru hostess la intrare: gestionează walk-in-uri (clienți fără rezervare), coadă de așteptare, asignare mese libere, timp estimat. Apare DOAR dacă waitlist e activat în setări.
  - Tab **Plan Sală Live** (`/reservations?tab=floor`) — Tab Plan Sală Live — vizualizare sală cu mese și ocupare în timp real
  - Tab **Listă Rezervări** (`/reservations?tab=bookings`) — Tab Listă Rezervări — toate rezervările, calendar, confirmare, anulare
  - Tab **Analiză Rezervări** (`/reservations?tab=analytics`) — Tab Analiză — timpi rotație, rată ocupare, ore de vârf
- **Configurare Rezervări** (`/reservations/config`) — Regulile sistemului de rezervări — activare, fereastră de timp, persoane min/max, inventar și zone, controlul fluxului (pacing, câți clienți pot sosi per interval) și câmpurile formularului
## PLAN SALĂ & BUCĂTĂRIE

- **Plan Sală** (`/floorplan`) — Viewer LIVE „Operațiuni Live' (3 tab-uri: Vedere Live / Istoric / Jurnal Audit): mese pe zone cu statistici (Total Restaurant, Total Zonă, Oaspeți Activi, Ocupare %), selector configurație. Click pe masă → detalii + „Gestionează Comanda' (duce în POS).
- **Display Bucătărie (KDS)** (`/kitchen/display`) — Ecran comenzi bucătărie — bonuri primite, marcare gata (bump), timere, batch processing. Pentru fiecare ecran KDS configurat (Bucătărie Caldă, Rece, Bar, Grătar, etc.) — accesibil per device cu URL distinct. _Notă: Bonurile vin AICI bazat pe etichetele produselor + zona mesei. Configurare ecrane + rutare → /settings?tab=kds._
- **Ecran Expeditor** (`/kitchen/expeditor`) — Ecran EXPEDITOR — punct unic verificare completitudine masă înainte de servire. Vede TOATE bonurile pentru o masă, marchează când e gata să fie ridicată de ospătar. _Notă: Diferit de KDS bucătărie (care e per stație). Expeditor agregă pe masă cross-stații._
## CONTRACTE & CHESTIONARE

- **Contracte** (`/contracts`) — Administrare contracte cu 2 tab-uri: Șabloane și Contracte Active
  - Tab **Șabloane Contracte** (`/contracts?tab=templates`) — Tab Șabloane — template-uri contracte, creare șabloane noi
  - Tab **Contracte Active** (`/contracts?tab=contracts`) — Tab Contracte — contracte semnate, urmărire expirare, status
- **Chestionare** (`/questionnaires`) — Builder chestionare cu 3 tab-uri: Șabloane, Răspunsuri, Statistici Personal
  - Tab **Șabloane Chestionare** (`/questionnaires?tab=templates`) — Tab Șabloane — builder chestionare, 22 tipuri întrebări, condiții, design
  - Tab **Răspunsuri Chestionare** (`/questionnaires?tab=responses`) — Tab Răspunsuri — vizualizare răspunsuri primite, analitice
  - Tab **Statistici Personal** (`/questionnaires?tab=staff-stats`) — Tab Statistici Personal — performanța angajaților din feedback clienți
## CANALE LIVRARE

- **Manager Canale Livrare** (`/channels`) — Integrare agregatori livrare (Glovo/Wolt/Bolt/Tazz), 5 tab-uri: Prezentare & KPI, Control Comenzi, Meniu & Prețuri, Reconciliere, Integrări. Acceptare/refuz comenzi, sync meniu, comisioane.
  - Tab **Prezentare Canale** (`/channels?tab=overview`) — Tab Prezentare — status platforme livrare, statistici, comisioane
  - Tab **Comenzi Livrare** (`/channels?tab=orders`) — Tab Comenzi — comenzi de pe platforme, status, acceptare/refuz
  - Tab **Meniu Platforme** (`/channels?tab=menu`) — Tab Meniu — sincronizare meniu cu platformele de livrare
  - Tab **Reconciliere Livrări** (`/channels?tab=reconciliation`) — Tab Reconciliere — verificare plăți platforme vs comenzi efective
  - Tab **Integrări Livrare** (`/channels?tab=integrations`) — Tab Integrări — conectare API Glovo, Wolt, Bolt Food, Tazz
## SOCIAL MEDIA & MARKETING

- **Conturi Social Media** (`/social-media`) — Configurare conturi per brand, 6 tab-uri: Conturi (conectare OAuth FB/IG/TikTok/YouTube/LinkedIn), Credentiale API, WhatsApp, Ads (conturi Meta Ads), CAPI (Conversions API), Audiențe Meta.
  - Tab **Conectare Conturi** (`/social-media?tab=connect`) — Tab Conectare — conectare OAuth pentru Facebook, Instagram, TikTok, YouTube, LinkedIn, Google Business
  - Tab **Setări Social Media** (`/social-media?tab=settings`) — Tab Setări — configurare posturi automate, reguli, template-uri
  - Tab **WhatsApp Business** (`/social-media?tab=whatsapp`) — Tab WhatsApp — conectare WhatsApp Business, configurare mesaje
- **Social Content Hub** (`/social-hub`) — Hub conținut social: comută între Calendar (planner pe zile) și Listă (postări cu filtre status/platformă/tip/campanie + statistici). Postări, story-uri, video. ?view=list / ?view=calendar.
- **Listă Postări Social** (`/social-hub?view=list`) — View listă postări — toate postările publicate/programate/draft pe canale
- **Calendar Editorial Social** (`/social-hub?view=calendar`) — View calendar — planificare postări pe luna/saptamana, drag & drop multi-platforma
  - Tab **Inbox Social Unificat** (`/marketing/audience?tab=inbox`) — Inbox mesaje, comentarii și mențiuni de pe toate platformele cu răspunsuri AI
- **Google Business Profile** (`/gbp`) — Manager fișa Google Business, 6 tab-uri: Location (date), Posts (postări GBP), Reviews (răspuns cu sugestie AI), Q&A, Photos, Metrics (ultimele 30 zile). Necesită locație Google conectată.
- **Evenimente Facebook** (`/facebook-events`) — Creare și gestionare evenimente Facebook pe pagina ta — seri tematice, lansări, workshop-uri
- **Analiză Social Media** (`/social-analytics`) — Dashboard analytics — engagement, reach, followers, ore optime
- **Memorii Brand** (`/brand-memories`) — Fișiere de memorie per brand pentru contextul AI marketing
## MARKETING — STRATEGIE & EXECUȚIE

- **Strategie Marketing** (`/marketing/strategy`) — Strategie marketing per brand — poziționare, audiențe, obiective, KPI
- **Canale Marketing** (`/marketing/channels`) — Configurare și performanță canale marketing — buget alocat, conversii
- **Audiență Marketing** (`/marketing/audience`) — Segmente audiență, profiluri clienți, comportament. Tab inbox = inbox unificat social
- **Performanță Marketing** (`/marketing/performance`) — KPI marketing — conversii, ROI, CAC, LTV, comparații canale
- **Cross-Channel Marketing** (`/marketing/cross-channel`) — Campanii cross-channel — coordonare email + social + ads + SMS
- **Atribuire Marketing** (`/marketing/attribution`) — Modele de atribuire — first-touch, last-touch, multi-touch, data-driven
- **Experimente Marketing** (`/marketing/experiments`) — A/B testing campanii — variante, audiente split, statistici
- **Plan Trimestrial Marketing** (`/marketing/quarterly-plan`) — Planificare trimestrială Q1-Q4 — obiective, bugete, campanii, deadline-uri
- **Anomalii Marketing** (`/marketing/anomalies`) — Detecție anomalii în metrici marketing — alerte performanță
- **Playbook B2B** (`/marketing/b2b-playbook`) — Playbook complet pentru marketing B2B — LinkedIn, ABM, sales enablement
- **Playbook Meta Restaurante** (`/marketing/playbook-meta-restaurant`) — Playbook Meta (FB/IG) pentru restaurante — campanii, audiențe, creative
- **Playbook Meta B2B** (`/marketing/playbook-meta-b2b`) — Playbook Meta (FB/IG) pentru B2B — lead gen, ICP, ABM ads
- **Playbook Meta E-commerce** (`/marketing/playbook-meta-ecommerce`) — Playbook Meta (FB/IG) pentru e-commerce — DPA, retargeting, lookalike, ROAS
- **Wizard Cross-Channel (legacy)** (`/marketing/cross-channel-legacy`) — Wizard vechi pentru lansare cross-channel — păstrat pentru flux-uri existente
## PORTAL CLIENȚI

- **Clienți Portal** (`/portal-customers`) — Administrare clienți portal cu 4 tab-uri: Listă Clienți, Segmente, Promoții, Autentificare & RFID
  - Tab **Listă Clienți** (`/portal-customers?tab=list`) — Tab Listă Clienți — toți clienții, XP, nivel, insigne, istoric
  - Tab **Segmente & Grupuri** (`/portal-customers?tab=segments`) — Tab Segmente — grupare clienți pe criterii, segmentare
  - Tab **Promoții Portal** (`/portal-customers?tab=promotions`) — Tab Promoții — promoții și voucher-uri în portalul clienți
  - Tab **Autentificare & RFID** (`/portal-customers?tab=auth`) — Tab Autentificare — carduri RFID, brățări NFC, metode de acces portal
- **Atracții** (`/portal-attractions`) — Administrare atracții — browse, recenzii, programare
- **Jocuri** (`/portal-games`) — Administrare jocuri — sloturi, prețuri, rezervări, program
- **Misiuni & Recompense** (`/portal-missions`) — Gamificație — misiuni zilnice/săptămânale, insigne, recompense
- **Agenți Chat Portal** (`/portal-chat-agents`) — Creare și gestionare agenți AI pentru chat-ul portalului de clienți
- **Carduri de Acces** (`/access-cards`) — Gestionare carduri RFID și brățări NFC pentru acces
## HACCP & SIGURANȚĂ ALIMENTARĂ

- **HACCP & Siguranță Alimentară** (`/haccp`) — Dashboard HACCP cu 5 tab-uri: Temperaturi, Curățenie, Incidente, Senzori, Răcire Rapidă
  - Tab **Temperaturi HACCP** (`/haccp?tab=temps`) — Tab Temperaturi — monitorizare temperaturi frigidere, congelatoare, depozite
  - Tab **Curățenie & Igienă** (`/haccp?tab=cleaning`) — Tab Curățenie — planuri de curățenie, verificări igienă, checklist-uri cleaning
  - Tab **Incidente HACCP** (`/haccp?tab=incidents`) — Tab Incidente — raportare incidente siguranță alimentară, acțiuni corective
  - Tab **Senzori IoT** (`/haccp?tab=sensors`) — Tab Senzori — configurare și monitorizare senzori IoT temperatură, umiditate
  - Tab **Răcire Rapidă** (`/haccp?tab=cooling`) — Tab Răcire Rapidă — monitorizare procese de răcire rapidă HACCP
## SETĂRI

- **Setări** (`/settings`) — Pagină hub cu meniu lateral pe secțiuni (Companie, POS, Personal, Hardware, Stocuri, Marketing, Contabilitate, Asistent AI, Tehnic, Sistem); ?tab= deschide fiecare secțiune.
  - Tab **Date Companie** (`/settings?tab=general`) — Secțiunea Date companie — nume, CUI, adresă, logo, date fiscale
  - Tab **Locații și Branduri** (`/settings?tab=brands`) — Două carduri: „Locații” (adaugă/editează locație: nume, adresă, oraș, telefon, casă de marcat prestabilită; asociază branduri; program funcționare) și „Gestionare Branduri & Identitate” (brand: cod, culoare, logo, misiune, domenii activitate, identitate vizuală, watermark social).
  - Tab **Setări Fidelizare** (`/settings?tab=loyalty`) — Secțiunea Fidelizare — configurare program de loialitate, rate câștig/răscumpărare, niveluri
  - Tab **Feedback & Chestionare** (`/settings?tab=surveys`) — Secțiunea Feedback — configurare chestionare automate, declanșatoare
  - Tab **Display Comenzi** (`/settings?tab=kds`) — Secțiunea Display comenzi — configurare ecrane KDS bucătărie
  - Tab **Dispozitive & Hardware** (`/settings?tab=devices`) — Secțiunea Dispozitive — tablete, telefoane, terminale plată
  - Tab **Imprimante & Rutare** (`/settings?tab=printers`) — Titlu „Imprimante”. Card „Configurare Imprimante” (adaugă/editează imprimante bonuri, case de marcat fiscale, etichete; asociere cu un PC; testare) + card „Rutare Fiscală — Case de Marcat”. Buton copie informativă/anulare bon.
  - Tab **Design Bon & Notă** (`/settings?tab=bill-design`) — Secțiunea Design Bon — personalizare bon fiscal, notă de plată, header/footer
  - Tab **Setari POS** (`/settings?tab=pos`) — Titlu „POS & Bonuri” cu 3 tab-uri: „Bonuri & Imprimare” (template bon fiscal + metode de plată, vizibilitate per unitate), „Taxe & Financiar” (cote TVA + taxă serviciu + bacșiș/impozit bacșiș), „Flux Operațional” (auto-trimitere bucătărie, aprobare manager anulare, batch bonuri V2, out-of-stock global). Plus card „Curățare Mese & Comenzi”.
  - Tab **Inventar & Stoc Setări** (`/settings?tab=inventory`) — Secțiunea Inventar — configurare gestiuni, unități măsură, alerte stoc
  - Tab **Integrări (API)** (`/settings?tab=integrations`) — Titlu „Integrări & API”. Carduri verticale: OpenAI ChatGPT (cheie proprie/Symbai + nivele AI), ANAF e-Factura & e-Transport (3 sub-tab-uri Conectare/e-Factura/e-Transport), Viva Wallet (ISV/Merchant), Card GP (Global Payments), GP HPP, rutare plăți online, + Tabs Cvent/Contabilitate(Saga/SmartBill)/Delivery(Glovo/Tazz/Bolt).
  - Tab **Server IoT (MQTT)** (`/settings?tab=mqtt`) — Secțiunea MQTT — configurare broker IoT pentru senzori temperatură
  - Tab **Notificări** (`/settings?tab=notifications`) — Secțiunea Notificări — configurare alerte push, email, SMS
  - Tab **Automatizări Clienți** (`/settings?tab=customer-automations`) — Secțiunea Automatizări — reguli automate pentru marketing (zi naștere, client inactiv)
  - Tab **Server & Fiscal** (`/settings?tab=edge-server`) — Titlu „PC & Server”. Adaugi PC-urile locației (primul devine server), carduri certificat tenant/wildcard, Failover Edge per locație (mod rețea DNS, Forțează conexiune, Print Agent pull/WS), listă device-uri cu „Fă Server”/test Print Agent/descarcă installer, Loguri Live, ghid instalare. _Notă: Pentru instalare PC nou + Print Agent: /onboarding/print-agent (wizard 8 pași). Edge Server-ul oferă POS LOCAL functional fără internet._
  - Tab **Unități de Măsură** (`/settings?tab=uom`) — Secțiunea Unități — kg, l, buc, ml, g, conversii între unități
  - Tab **Setări Email Marketing** (`/settings?tab=email-marketing`) — Secțiunea Email — configurare SMTP, domeniu expeditor, identități sender
  - Tab **Symbai Hub** (`/settings?tab=symbai-hub`) — Secțiunea Hub — conexiune cloud, sincronizare, licență, actualizări
  - Tab **Grupări Clienți** (`/settings?tab=customer-groups`) — Secțiunea Grupări Clienți (doar multi-unit) — acces controlat per brand/locație
  - Tab **Security Log** (`/settings?tab=security`) — Secțiunea Securitate — loguri autentificare, IP-uri, alerturi securitate
  - Tab **Localizare** (`/settings?tab=localization`) — Secțiunea Localizare — limbă, format dată, monedă, fus orar
- **Setări Sales CRM** (`/settings/sales-crm`) — Configurare CRM vânzări — pipeline, etape, câmpuri custom
## SALES CRM

- **Sales CRM** (`/sales-crm`) — CRM vânzări cu tab-uri (filtrate după șablonul de business): Dashboard, Pipeline (etichetă adaptivă, ex «Pipeline Rezervări»), Calendar, Prezentare, Rezervări, Clienți, Mesaje, Taskuri, Analiză, Reguli Capacitate, WhatsApp.
## CLIENȚI & FIDELIZARE

- **Clienți & Portal** (`/customers`) — Baza de clienți cu 4 tab-uri: Listă Clienți (XP, nivel, insigne, istoric), Persoane Juridice, Segmente & Grupuri, Autentificare & RFID. Fișa clientului are tab-uri Profil/Prieteni/Evenimente/Misiuni/Insigne/Recompense/Comenzi/Copii (+Grupări dacă există).
- **Program Fidelizare** (`/loyalty`) — Program loialitate cu 3 tab-uri: Panou General (statistici, niveluri), Clienți Fideli (puncte/nivel/istoric, filtru pe tier), Configurare Program (rată câștig pct/leu, valoare răscumpărare, niveluri/tiers cu praguri+beneficii, bonus zi naștere).
- **Rapoarte Clienți** (`/customer-reports`) — Analitice clienți — segmentare, comportament, lifetime value, frecvență
- **Import Clienți** (`/customer-import`) — Import clienți din Excel/CSV — date contact, segmente, puncte loialitate
## EMAIL MARKETING

- **Email Marketing** (`/email-campaigns`) — Campanii email: listă filtrată (Toate/Ciorne/Programate/Active/Trimitere/Trimise) + wizard 4 pași Configurare→Șablon→Audiență→Revizuire&Trimitere; campaniile flux au tab-uri Flux/Config/Statistici.
- **Analitice Email** (`/email-analytics`) — Statistici campanii email — open rate, click rate, bounce, unsubscribe, tendințe
- **Template-uri Email** (`/email-templates`) — Galerie template-uri email — pre-built, custom HTML, drag & drop editor
## CAMPANII PUBLICITARE

- **Campanii Publicitare** (`/ad-campaigns`) — Reclame plătite Meta/Google/TikTok. Două secțiuni: Campanii (filtre status Toate/De publicat/Active/Pauză/Final/Eroare, wizard obiectiv→buget→publicare, boost postare, lead forms, sugestii AI) și Automatizări.
## FIȘE TEHNICE & CONTRACTE

- **Fișă Tehnică Rețetă** (`/recipe-datasheet`) — Fișe tehnice detaliate per rețetă — ingrediente, cantități, procedură, alergeni, nutriție
## FEEDBACK, AUTOMATIZĂRI, LIVRĂRI

- **Recenzii & Feedback** (`/feedback`) — 4 tab-uri: Management Recenzii (listă recenzii + filtre perioadă/locație/angajat/sortare + răspuns), Performanța Angajaților, Tendințe & Analiză, Setări Feedback (declanșator după plată/rezervare, alertă rating scăzut).
- **Acțiuni Automate** (`/actions`) — Automatizări marketing — trigger → acțiune (email, SMS, notificare)
- **Livrări** (`/deliveries`) — Monitorizare livrări active — status, curieri, timpi
- **Inbox WhatsApp** (`/whatsapp-inbox`) — Mesaje primite și trimise prin WhatsApp Business
## DATA IMPORT

- **Import Date** (`/data-import`) — Titlu „Importuri Date”. 3 tab-uri: „Import Nou” (wizard 4 pași: Încărcare fișier → Mapare coloane → Confirmare → Rezultat, alegi entitatea țintă), „Șabloane (N)” (salvează/reaplică mapări), „Istoric (N)” (rulări trecute).
  - Tab **Import Nou** (`/data-import?tab=new-import`) — Tab Import Nou — încărcare fișier Excel/CSV pentru import
  - Tab **Șabloane Import** (`/data-import?tab=templates`) — Tab Șabloane — descărcare template-uri Excel pentru import
  - Tab **Istoric Import** (`/data-import?tab=history`) — Tab Istoric — lista importurilor anterioare cu status
## ALTE PAGINI

- **Loguri Activitate** (`/audit-logs`) — Titlu „Loguri Activitate”. Jurnal audit cine/ce/când cu diff vechi→nou. Căutare text + filtru categorie (9: POS & Comenzi, Inventar & Stoc, Producție, Finanțe, Setări, Personal, Meniu & Produse, Clienți, Sistem) + filtru angajat + masă + perioadă (Azi/Ieri/Săptămâna trecută/Luna trecută/interval).
- **Coduri QR** (`/qr-codes`) — Două tab-uri: QR Mese (cod per masă → meniul digital al mesei, regenerare) și QR-uri dinamice (link scurt /q/cod cu destinație editabilă oricând fără re-tipărire, etichete, activ/inactiv, contor scanări, export PNG/SVG/PDF).
- **Centru Printare** (`/print`) — Administrare imprimante — bonuri, bucătărie, etichete, testare
## AI AGENTS

- **AI Onboarding** (`/ai-onboarding`) — Asistent AI pentru configurarea inițială — ghidaj pas cu pas (alias: /ai-migration)
- **Onboarding Avansat** (`/ai-advanced-onboarding`) — Agent AI pentru funcționalități avansate — integrări, automatizări, asistenți, website
- **Import din Excel** (`/ai-bulk-import`) — Import în masă din Excel/CSV cu mapare AI a coloanelor, validare și raport pe fiecare rând
- **AI Menu Creator** (`/ai-menu`) — Asistent AI Chef pentru creare meniu echilibrat — ingrediente, costuri
- **AI Rețetare** (`/ai-recipes`) — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
- **Editor Rețete AI** (`/ai-recipes`) — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
- **Creare Rețete AI** (`/ai-recipes?tab=create`) — Sym Recipe — creare rețete noi de la zero cu AI (ingrediente, cantități, food cost calculat automat)
- **Analiză Rețete AI** (`/ai-recipes`) — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
- **AI Doctor Veterinar** (`/ai-dsv`) — Expert AI legislație alimentară — fișe tehnice, HACCP, norme sanitare
- **AI Achiziții** (`/ai-procurement`) — Asistent AI aprovizionare — analiză cheltuieli, optimizare comenzi
- **AI Prețuri** (`/ai-pricing`) — Asistent AI pricing — analiză food cost, recomandări prețuri, marje
- **AI Contabilitate** (`/ai-accounting`) — Asistent AI contabilitate — coduri contabile, e-Factura, export
- **AI Rapoarte** (`/ai-reports`) — Asistent AI rapoarte — generare rapoarte inteligente cu analiză
- **AI CFO** (`/ai-cashflow`) — Asistent AI financiar — cash flow, previziuni, strategie financiară
- **AI Legal** (`/ai-legal`) — Asistent AI juridic — contracte, GDPR, legislație HoReCa, documente legale
- **AI Marketing Agent** (`/ai-marketing`) — Agent AI conversațional pentru creare reclame, postări, strategii marketing
- **AI Integrări** (`/ai-integrations`) — Agent AI expert configurare integrări — fiscale, messaging, social, hardware, delivery, plăți
- **AI Creator Agenți Vânzări** (`/ai-sales-creator`) — Creează agenți AI specializați pe vânzări — petreceri, nunți, corporate
- **AI Angajati** (`/ai-angajati`) — Agent AI pentru gestionare personal — roluri, angajati, ture, permisiuni
- **AI Creator Asistenți Personal** (`/ai-staff-creator`) — Creează asistenți AI personalizați per angajat/rol
- **AI Automatizări** (`/ai-automations`) — Agent AI pentru creare reguli și automatizări prin conversație
- **Loguri AI** (`/ai-logs`) — Istoric conversații și acțiuni ale agenților AI
- **Memorii Agenți AI** (`/ai-agent-memories`) — Fișiere de memorie pentru agenții AI
- **Memorii Agenți Vânzări** (`/sales-agent-memories`) — Fișiere de memorie ale agenților AI de vânzări
## PAGINI SUPLIMENTARE FRONTEND

- **Plan Sală** (`/plan-sala`) — Designer plan sală — zone, mese, capacități, layout drag-and-drop
- **Intrări Stoc** (`/stock-entries`) — Pagina 'Intrări Marfă' cu 5 tab-uri: Facturi Furnizori, Avize & Draft, Reconciliere (badge nereconciliate), Recepții (NIR), Producție. De aici creezi NIR-ul (factură sursă + depozit recepție).
- **Ieșiri Stoc** (`/stock-exits`) — Ieșiri stoc — consum, transfer, returnare, documente ieșire
- **Mișcări Stoc** (`/stock-movements`) — Istoric complet mișcări stoc — intrări, ieșiri, transferuri, ajustări
- **Grupurile Mele** (`/my-groups`) — Grupuri de lucru ale angajatului curent
- **Cererile Mele de Concediu** (`/my-leave-requests`) — Cereri concediu ale angajatului curent — solicitare, status, istoric
## CONTABILITATE & IMPORT

- **Import Contabilitate** (`/accounting-import`) — Import date contabile — import balanțe, jurnale, plan conturi din software contabil
- **Registru Contabil** (`/accounting-ledger`) — Note contabile cu 3-4 vizualizări (butoane, nu tab-uri): „Conturi' (solduri pe cont cu drill-down la înregistrări), „Toate înregistrările' (jurnal filtrabil pe brand/perioadă/sursă/status), „Plan de Conturi' (chart + populare RO), iar la multi-brand/locație: „Analitice Brand & Locații' (reguli denumire analitice + reguli split cheltuieli). Export CSV.
- **Produse Depozit** (`/warehouse-products`) — Administrare produse pe depozit — stocuri per gestiune, alocare depozite
- **Rețete Produse** (`/ai-recipes`) — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
## MARKETING — EMAIL & ADS

- **Revizuire Email-uri** (`/email-review`) — Revizuire și aprobare campanii email înainte de trimitere
- **Automatizări Marketing** (`/marketing-automations`) — Automatizări marketing avansate — fluxuri, triggere, secvențe email/SMS
## PORTAL CONFIG

- **Configurare Portal** (`/portal-config`) — Configurare portal clienți — aspect, meniu, funcționalități active, branding
## MEDIA & BRAND

- **Bibliotecă Media Brand** (`/brand-media-library`) — Galerie media brand — imagini, logo-uri, video-uri, materiale vizuale
## SETĂRI SUB-PAGINI

- **Conturi pe Tip Produs** (`/ai-product-types`) — Hub cu toggle Simplu/Avansat + Asistent AI și 3 tab-uri: „Tipurile mele” (carduri tip cu semafor sănătate, Adaugă tip via template, Rezolvă ce lipsește, drawer+editor), „Pe unități” (regulă analitice brand/locație), „Împărțire costuri”.
- **Sarcini Programate** (`/settings/cron-jobs`) — Administrare sarcini cron — joburi programate, automatizări pe orar
## AI AGENȚI SUPLIMENTARI

- **AI Reclame** (`/ai-ads`) — Agent AI pentru creare și gestionare campanii publicitare — Facebook Ads, Google Ads
- **AI Analiză** (`/ai-analytics`) — Agent AI pentru analiză date — interpretare rapoarte, insights, sugestii
- **AI Research Agent** (`/ai-research`) — Agent AI pentru cercetare — investigații, research competitor, analize de piață, sumarizare surse externe
## HOTEL / PENSIUNE

- **Dashboard Hotel** (`/hotel`) — Dashboard PMS: KPI ocupare (camere libere/ocupate, %), sosiri/plecări azi, in-house, plus hub de quick-links spre toate sub-paginile hotel (recepție, camere, rate, channel, folio, analytics).
- **Recepție Hotel** (`/hotel/front-desk`) — Front desk recepționer cu 5 tab-uri: Sosiri, Plecări, In-House, Room Rack, Night Audit. Check-in/out, walk-in, asignare/schimb cameră, închidere de noapte (pre-check/dry-run/execute). _Notă: Pentru încasare la POS hotel (mini-bar, restaurant) folosește /pos/reception. Folio agregă tot la check-out._
- **Camere Hotel** (`/hotel/rooms`) — Lista camerelor cu status (Curată/Murdară/Inspectată/Ocupată/Defectă/Indisponibilă/Mentenanță), filtre status/etaj/căutare, schimbare status în masă și generator camere pe tip.
- **Tipuri Camere** (`/hotel/room-types`) — Tipuri camere (single/double/suite) — capacitate, dotări, prețuri de bază
- **Housekeeping** (`/hotel/housekeeping`) — Curățenie camere — task-uri menajere, status, asignare personal, priorități
- **Oaspeți Hotel** (`/hotel/guests`) — Lista oaspeți — date contact, istoric șederi, preferințe, documente
- **CRM Hotel** (`/hotel/crm`) — CRM oaspeți — segmente, campanii, comunicări personalizate
- **Folio-uri** (`/hotel/folios`) — Folio (cont oaspete) — toate cheltuielile șederii (cazare, mini-bar, restaurant, spa)
- **Manager Tarife Hotel** (`/hotel/rates`) — Rate manager complet, 13 tab-uri: Calendar, Plans, Restrictions, Seasons, Derived, LOS, Packages, Compare, Forecast, Yield Rules, Competitors, Recommendations, History. Prețuri pe zile/sezoane, restricții, rate derivate, yield.
- **Channel Manager Hotel** (`/hotel/channels`) — Sincronizare cu OTA-uri — Booking.com, Airbnb, Expedia
- **Grupuri Hotel** (`/hotel/groups`) — Group blocks — rezervări grup pentru evenimente/conferințe
- **Analitice Hotel** (`/hotel/analytics`) — Rapoarte hotel — ocupare, ADR, RevPAR, sursă rezervări, anulări, no-show
- **Coduri Promo Hotel** (`/hotel/promo-codes`) — Coduri promoționale hotel — discount, valabilitate, restricții
- **Feedback Oaspeți** (`/hotel/guest-feedback`) — Chestionare post-sejur, NPS, recenzii interne
- **Recenzii Hotel** (`/hotel/reviews`) — Recenzii agregate de pe Booking, Tripadvisor, Google
- **Setări Proprietate Hotel** (`/hotel/property-settings`) — Setări proprietate — adresa, fotografii, dotări, politici, check-in/out times
## ECOMMERCE

- **Comenzi Ecommerce** (`/ecommerce/orders`) — Comenzi magazin online: filtre brand/website/risc fraudă/decizie/status (pending→processing→shipped→delivered→cancelled→refunded), evaluare fraudă, acțiuni procesare/expediere/anulare, tracking, print.
- **Magazine Online** (`/ecommerce/websites`) — Configurare magazine online — domenii, plăți, layout
- **Livrare Ecommerce** (`/ecommerce/shipping`) — Configurare livrare — zone, tarife, curieri, free shipping
- **AWB & Curieri** (`/ecommerce/awb`) — Curierat ecommerce, 4 tab-uri: Generează AWB, Tracking & Etichete, Reconciliere COD, Conturi curieri. Curieri suportați: Sameday, FAN, DPD, GLS, Cargus, KLG.
- **Analitice Ecommerce** (`/ecommerce/analytics`) — KPI ecommerce — vânzări, conversie, AOV, abandon cart
- **Variante Produs** (`/ecommerce/variants`) — Administrare variante (mărime, culoare, model) — SKU, stoc, preț
- **Recenzii Produse** (`/ecommerce/reviews`) — Recenzii produse — moderare, răspunsuri, scoruri
- **Detecție Fraud** (`/ecommerce/fraud`) — Detecție fraud — comenzi suspecte, scor risc, blacklist
- **Feed-uri Produse** (`/ecommerce/feeds`) — Feed-uri pentru Google Shopping, Facebook Catalog
- **Marketplaces** (`/ecommerce/marketplaces`) — eMAG, Altex, OLX — sincronizare oferte și comenzi marketplace
- **Retururi Ecommerce** (`/ecommerce/returns`) — Retururi — RMA, motive, refund, restock
- **Carduri Cadou** (`/ecommerce/gift-cards`) — Carduri cadou ecommerce — generare coduri, sold, expirare
- **Discount-uri Automate** (`/ecommerce/auto-discounts`) — Reguli discount automat — bundle, second item, free shipping
- **Recenzii Externe** (`/ecommerce/external-reviews`) — Agregare recenzii — Trustpilot, Google, Facebook
## SEO

- **SEO Hub** (`/seo`) — Summary SEO (sub layout cu nav: Summary/Pages/Keywords/Research/Competitors/Settings): vizibilitate, poziție medie, click-uri organice, afișări, CTR, distribuție poziții, top winners/losers, top pagini, SERP features, status sync GSC.
- **SEO Summary** (`/seo`) — Summary SEO (sub layout cu nav: Summary/Pages/Keywords/Research/Competitors/Settings): vizibilitate, poziție medie, click-uri organice, afișări, CTR, distribuție poziții, top winners/losers, top pagini, SERP features, status sync GSC.
- **Pagini SEO** (`/seo/pages`) — Audit pagini — title, meta, H1-H6, alt-uri, Core Web Vitals
- **Cuvinte Cheie SEO** (`/seo/keywords`) — Tracking cuvinte cheie — ranking, volum, dificultate
- **Cercetare SEO** (`/seo/research`) — Keyword research — sugestii, intent, long-tail, gap competitori
- **Competitori SEO** (`/seo/competitors`) — Analiza competitori — ranking, backlink-uri, gap analysis
- **Setări SEO** (`/seo/settings`) — Setări SEO — robots, sitemap, redirects, hreflang, GSC
## BLOG

- **Blog Tracker** (`/blog/tracker`) — Tracker articole blog — overview, performanță, calendar editorial
- **Articole Blog** (`/blog/posts`) — Administrare articole blog: tabel cu titlu, status, autor, scor SEO (colorat), indexare; filtre pe status / scor SEO / intenție / indexabil. Creare/editare articol, asociere website.
- **Autori Blog** (`/blog/authors`) — Autori blog — profil, biografie, articole
- **Import Blog** (`/blog/import`) — Import articole din WordPress, Ghost — bulk migration
- **Redirectionări Blog** (`/blog/redirects`) — Redirect-uri 301 — URL-uri vechi → noi pentru SEO
- **Analitice Blog** (`/blog/analytics`) — Analitice articole — pageviews, time on page, bounce
- **Advertoriale Blog** (`/blog/advertorials`) — Advertoriale plătite — tracking, ROI, campanii sponsorizate
- **Backlinks Blog** (`/blog/backlinks`) — Backlink building — outreach, status link-uri, domain authority
- **Migrare Blog** (`/blog/migration`) — Wizard migrare blog din altă platformă
## FACTORY / PRODUCȚIE EXTINSĂ

- **Tablou Fabrică** (`/factory-dashboard`) — Dashboard MES read-only «Control Tower». Sus: 8 mini-KPI (Planificat/Produs/WIP tone, Yield, OEE, On-Time, Waste, FPY) + countdown refresh 15s. 11 taburi: Vedere generală, Live, Alerte, Lipsuri, Blocaje, QC, KPI, Pipeline, Trasabilitate, Livrări, Schimburi. Drill-down pe alerte/loturi.
- **Enterprise Readiness** (`/factory-enterprise-readiness`) — Cockpit vizual pentru readiness enterprise/SAP: readiness matrix, SAP bridge flow map, EDI/ASN/SSCC desk, meat vertical, catch-weight, hardware demo adapters si plan pilot 30 zile. Este suport demo/pilot; pentru verdict real foloseste auditurile MCP live.
- **Integrări Enterprise** (`/factory-integrations`) — Cockpit pentru adaptere ERP/MES/EDI, live/hybrid/demo signals, lipsuri de integrare si pasi de pilot.
- **Date Master Enterprise** (`/factory-master-data`) — Cockpit pentru coduri produs, unitati, retete/BOM/routing, GTIN/SSCC si guvernanta datelor master.
- **Calitate Enterprise** (`/factory-quality`) — Cockpit pentru QC holds, specificatii client, LIMS/COA, CAPA si eliberare loturi.
- **Randament & Cost** (`/factory-yield-costing`) — Cockpit pentru mass balance, yield/cut-out, cost standard vs actual si reconciliere SAP/financiar.
- **Validare & UAT** (`/factory-validation`) — Cockpit pentru scenarii UAT, load/DR, evidenta de acceptanta si go/no-go gates.
- **Rollout Enterprise** (`/factory-rollout`) — Cockpit pentru wave plan, training, hypercare si criterii de trecere pilot -> rollout.
- **Factory AI Chat** (`/factory-ai`) — Chat AI dedicat operațiunilor de fabrică
- **AI Flow Builder** (`/ai-flow-builder`) — Constructor vizual fluxuri tehnologice cu AI
- **Plan Fabrică 2D** (`/factory-floor-plan`) — Designer vizual al halei/fabricii: nivele, echipamente, zone de producție, magazii, zone de depozitare, pereți/culoare și conexiuni de flux material/personal. Legat de entități reale, cu status echipament și stoc sumar pe zone.
- **Explorează Fabrica** (`/factory-explorer`) — Vizualizator live read-only al halei: hartă, căutare, Gantt pe utilaje cu scrubber de timp și panouri clickabile pentru zonă, magazie/raft, utilaj, operator și produs. Pentru investigații, întrebări la o oră anume și dovadă vizuală; pentru editare folosește Plan Fabrică 2D.
- **Tabletă Stație Lucru** (`/workstation-tablet`) — Interfață tabletă pentru stația de producție — scanare container, progres, QC
- **Producție Evenimente** (`/productie-evenimente`) — Pagina PRINCIPALĂ de producție restaurant. Titlu adaptiv (Producție / Producție & Evenimente / Producție & Rețete). Taburi: Calendar & Capacitate, Loturi Producție (creezi/pornești/finalizezi loturi+evenimente), Rețete. +Operații/+Echipamente la mod restaurant_events; +Fluxuri Tehnologice la mod fabrică. Butoane: Adaugă Lot Producție, Adaugă Eveniment.
- **Fluxuri Tehnologice** (`/fluxuri-tehnologice`) — Fluxuri tehnologice de producție — operații, dependențe, BOM, QC
- **Loturi WIP** (`/loturi-wip`) — Loturi work-in-progress — toate loturile în producție
- **Planificare MPS** (`/planificare-mps`) — Master Production Schedule — planificare producție pe orizont mediu/lung; include wizard-ul „Planificare inteligentă din comandă B2B" pentru preview ATP/CTP si commit dupa confirmare.
## B2B

- **Comenzi B2B** (`/b2b-orders`) — Management comenzi B2B — clienți firmă, contracte cadru, prețuri negociate
## FINANȚE EXTINS

- **Rapoarte Fiscale** (`/finance/fiscal-reports`) — Rapoarte fiscale — bonuri emise, X/Z, defalcare TVA, export ANAF
- **Foaie închidere zi (printabilă)** (`/finance/end-of-day`) — Foaie completă de închidere zi (printabilă) — totaluri, plăți, mese, ospătari, bonuri Z, registru casă agregat
## RAPOARTE P&L EXTINSE

- **Raport P&L** (`/reports/pnl`) — Profit & Loss complet — venituri, COGS, cheltuieli operaționale, EBITDA
- **P&L KPI** (`/reports/pnl-kpi`) — Pagină KPI P&L — afișează indicatorii definiți pe categorii (venituri, marketing, leaduri, evenimente, finanțe, operațional) cu valoare live, semafor și trend. Definițiile/pragurile se editează din Setări > Setări P&L.
- **P&L Comparație** (`/reports/pnl-compare`) — Comparație P&L între entități — brand vs brand, locație vs locație (side-by-side, heatmap)
- **P&L Comparație Perioade** (`/reports/pnl-compare-periods`) — Compară P&L pe PERIOADE — lună vs lună, an vs an, aceeași lună din ani diferiți, perioadă A vs B. Profit bridge (de ce s-a schimbat profitul) + tendință + tabel variație.
- **P&L Salvate** (`/analytics/saved-pnl`) — Listă carduri cu snapshot-uri P&L înghețate (nume, perioadă, nr. ajustări, lacăt). Acțiuni: deschide detaliu (cere parolă dacă e blocat), redenumire, ștergere, lock/unlock/schimbă parolă.
## CALENDAR PLATFORMĂ

- **Calendar Platformă** (`/calendar`) — Calendar global — evenimente, task-uri, rezervări, ture, deadline-uri
## PAGINI ADIȚIONALE (completare RBAC 2026-05-24 — toate intrările din

- **Menu Engineering** (`/ai-pricing`) — engineering: analiza popularitate vs profitabilitate (cadrane Vedete/Cai de povară/Puzzle/Câini) plus recomandări de preț AI.
- **Blog** (`/blog`) — Pagină principală blog — overview tracker, postări, autori, advertoriale, backlinks
- **Calendar Conținut** (`/content-calendar`) — Calendar conținut social media — planificare postări multi-platforma
- **Postări Social** (`/social-posts`) — Listă postări social media — toate canalele, status, performanță
- **Story Manager** (`/story-manager`) — Manager stories Instagram/Facebook/TikTok — programare, stickere, CTA, analitice
- **Mesaje Social Media** (`/social-messages`) — Inbox unificat mesaje DM, comentarii, mențiuni de pe toate platformele sociale conectate
- **Achiziții** (`/purchases`) — Raport de achiziții agregat pe produs: ce ai cumpărat, ce cantități și la ce cost mediu pe perioadă. Lista comenzilor către furnizori (PO) este în Hub Aprovizionare. _Notă: Aici vezi TOATE comenzile către furnizori. Pentru o comandă nouă, folosește Smart Ordering (/smart-ordering) care propune AI-based pe baza stocului minim._
- **Onboarding (Wizard Configurare)** (`/onboarding`) — Wizard pas-cu-pas configurare inițială platformă — 13 pași de bază + 16 pași avansați. Acces din meniu sau setări.
- **Welcome Onboarding** (`/onboarding/welcome`) — Ecran welcome onboarding — afișat o singură dată la primul login, prezintă platforma + propune wizard configurare
- **Onboarding Pas 18 — Social Media** (`/onboarding/step/18`) — Pasul de configurare social media din wizard onboarding (FB/IG/TikTok conectare + strategie conținut)
- **AI Migrare Date** (`/ai-migration`) — Asistent AI pentru migrare date din alt sistem POS — analiză export, mapare câmpuri, import automat. Alias pentru /ai-onboarding.
- **Automatizări Sales CRM** (`/sales/automations`) — Reguli automate pe pipeline CRM — trigger pe schimbare etapă deal → acțiuni (email, task, notificare). 19 triggers + 9 actions.
- **Catalog Servicii** (`/services/catalog`) — Catalog servicii oferite — definire, preț, durată, dependențe
- **Oferte Servicii** (`/services/quotes`) — Oferte (quotes) către clienți — generare, trimitere, acceptare, conversie în proiect
- **Proiecte Servicii** (`/services/projects`) — Proiecte servicii — task-uri, milestone-uri, livrabile, alocare resurse
- **Pontaj Servicii** (`/services/time`) — Time tracking pe proiecte/tichete — ore lucrate, facturare time-based
- **Tichete Servicii** (`/services/tickets`) — Tichete suport/incidente — status, priorități, SLA, atribuire
- **Servicii Recurente** (`/services/recurring`) — Servicii recurente / abonamente — billing automat, retentie, churn
- **Asistent Personal** (`/staff-assistant`) — Asistent AI per angajat — fiecare angajat are propriul ajutor AI cu memorie individuală
- **AI Producție Expert** (`/ai-production`) — Agent AI Producție cu 149 tool-uri în 6 categorii — rețete, infrastructură, execuție, planificare, calitate, fluxuri. Poate crea loturi, porni producție, inspecții QC, BOM explosion, MPS. _Notă: Pentru creare lot producție concret cu cantitate, delegă la acest agent — are tool-uri specializate pe rețete/zone/echipamente/QC/fluxuri._
- **Conturi pe Tip Produs** (`/ai-product-types`) — Hub cu toggle Simplu/Avansat + Asistent AI și 3 tab-uri: „Tipurile mele” (carduri tip cu semafor sănătate, Adaugă tip via template, Rezolvă ce lipsește, drawer+editor), „Pe unități” (regulă analitice brand/locație), „Împărțire costuri”.
- **Documentație API** (`/api-docs`) — Documentație API publice Symbai pentru integratori externi
- **Integrări Externe** (`/integrations`) — Hub integrări externe — listă conectate, status, configurare per categorie
- **Evenimente CRM** (`/events`) — Listă standalone a tuturor evenimentelor cu sumar P&L în timp real: KPI sus (nr. evenimente, venit total, profit, marjă medie), tabel/carduri per eveniment + filtre dată și status; click pe rând deschide fișa /event/:id. Buton «Vezi în Calendar».
- **Abonamente Clienți** (`/subscriptions`) — Abonamentele CLIENȚILOR cu livrări recurente: KPI MRR/ARR/ARPU/Churn 30z/LTV/Venit 30z, distribuție pe statusuri, listă abonați cu filtre+căutare; drawer detaliu cu Pauză/Reactivare/Anulare + sub-tab-uri Livrări/Dunning/Istoric.
- **Recomandări Symbai** (`/symbai-recommendations`) — Recomandări AI pentru îmbunătățiri operaționale — pe baza datelor proprii (vânzări, stocuri, comenzi) plus benchmark industrie
## COMPLETARE NAVIGARE 2026-06-12 — rute reale din care lipseau din registry

- **Zone Livrare** (`/deliveries/zones`) — Zonele de livrare pe hartă, per locație — desen liber sau localități cu contur automat, taxă de livrare, valoare minimă comandă, prag de livrare gratuită, ore limită și capacitate maximă pe zi
- **Flotă Livrări** (`/deliveries/fleet`) — Flota proprie — vehicule (tip, capacitate, status), livratori (bifezi nominal cine e livrator), schimburi cu km la plecare/sosire și livratori activi cu poziție live
- **Dispecerat Livrări** (`/deliveries/dispatch`) — Ecran dispecer flotă proprie: kanban pe statusuri (Pregătire/De livrat/Asignat/În livrare/Livrat/Eșuat) + hartă Leaflet cu comenzi și livratori, asignare manuală + sugestie automată, 3 view-uri (split/kanban/hartă).
- **Mission Control Dispecerat** (`/dispatch/mission-control`) — Consola avansată de dispecerat — KPI-urile zilei, alerte live cu confirmare, hartă live, recomandări top livratori cu scor și motive, countdown SLA per comandă, comandă rapidă creată de operator și trimitere la curier extern cu cotații
- **Setări Dispecerat** (`/dispatch/settings`) — SLA promis și praguri de alertă (fără livrator, livrator inactiv, blocat în bucătărie), auto-asignare cu prag de scor, batching comenzi, motor de rutare, viteză medie, curieri externi activați și tracking public (poziție livrator, SMS cu ETA)
- **Analiză Dispecerat** (`/dispatch/analytics`) — KPI livrări pe 1/7/30/90 zile — livrate, eșuate, timp mediu, breșe SLA, alerte pe tip, top livratori și jurnalul de audit al acțiunilor de dispecerat
- **Livrări Eșuate** (`/deliveries/failed`) — Livrările marcate eșuate cu motiv (client absent, adresă greșită, refuzată, produs lipsă) — re-livrare, reprogramare la o oră anume, anulare definitivă, statistici per motiv și export CSV
- **Închideri de Zi Livratori** (`/deliveries/day-closures`) — Registrul închiderilor de zi ale livratorilor — km, cash încasat, card, combustibil, livrări reușite/eșuate, semnat/nesemnat
- **Cheltuieli Vehicule** (`/deliveries/vehicle-expenses`) — Raport pe vehicul din schimburile închise — km, litri, RON carburant, RON/km, consum L/100km, bonuri de carburant legate de schimb, export CSV
- **Aplicația Livratorului** (`/livrator`) — PWA-ul curierului — tura și livrările zilei, pornire livrare cu navigare (Google Maps/Waze), încasare cash/card, semnătură destinatar, poză dovadă, bonuri combustibil și închiderea de zi; funcționează și offline
- **Revizuire Mapări AI** (`/inventory/ai-review`) — Toate liniile din facturile fără recepție într-un singur loc — verificare și aprobare centralizată a mapărilor propuse de AI, editare mapare, spargere linie în sub-linii sau absorbție în alte linii
- **Reguli de Mapare** (`/inventory/mapping-rules`) — Regulile de mapare învățate de sistem — specifice unui furnizor (prioritate maximă) și generale valabile la orice furnizor, cu ștergere în masă
- **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — Igiena intrărilor — mapări cu încredere scăzută, NIR-uri ciornă mai vechi de 7 zile, facturi eFactura fără NIR, anomalii de preț și conflicte între reguli de mapare
- **Dispute Inventar** (`/inventory/disputes`) — Diferențele constatate la recepție, clasificate — dispute cu furnizorul, corecții OCR, variații de livrare
- **Inventar Multi-Sursă** (`/inventory/msi`) — Pentru vânzări online cu mai multe depozite — reguli de alocare automată pe surse, rezervări cu termen, backorder/preorder, expediții împărțite și vizibilitate storefront
- **Unifică Duplicate** (`/automations`) — Detectează produsele duplicate din catalog (nume identic sau aproape identic) și le unește inteligent — supraviețuiește produsul cu vânzări și loc în meniu, stocul se adună, rețeta se preia; cu sugestii automate de unire și previzualizare de impact
- **Leagă Rețetarul (import Excel)** (`/recipe-mapping`) — Import rețetar din Excel — fiecare ingredient se mapează la un produs existent (potrivire exactă, similară sau cu AI); conflictele de unitate de măsură blochează importul până le rezolvi
- **Centru Meniu** (`/menu/center`) — Panou pentru manageri — ce produse sunt indisponibile (86) acum cu motiv și cine le-a marcat, câte produse nu au fotografie sau alergeni, căutare cu marcare 86 rapidă și alias-uri de căutare
- **Meniu din PDF** (`/menu/import-pdf`) — Import meniu din PDF sau poze cu AI — extrage produsele, prețurile, pozele și designul paginilor (reconstruit pentru Meniu Fizic), cu propunere editabilă înainte de import
- **Poze Bulk Meniu** (`/menu/pricing/bulk-photos`) — Urci multe poze deodată (drag & drop), AI le analizează și sugerează automat articolul de meniu potrivit pentru fiecare; confirmi/schimbi și se salvează ca imagine produs.
- **Mese Servite** (`/finance/served-meals`) — Titlu „Mese Servite”. KPI strip (mese/venit/cost/marjă) + căutare + filtru status (Toate/Cost de stabilit/Cost stabilit/Ciornă) + tabel registru. Buton „Masă servită nouă” (dialog: Manual/Din eveniment/Din comandă POS). Drawer detaliu cu tab-uri Cost(fișe consum)/Eveniment/Contract/General.
- **Raport Beneficii Personal** (`/reports/staff-benefits`) — Ce au consumat angajații pe beneficii (mâncare/băutură personal) — grupat pe angajat, regulă, produs sau zi, cu export CSV
- **Reparații Date** (`/settings/repair`) — Titlu „Reparații”. 11 unelte 1-click cu scanare/preview înainte de aplicare: reconciliere comenzi, curăță produse fantomă (cloud+edge), Sync 100% cloud↔edge, unifică categorii meniu, leagă rețete↔produse (alergeni), corectează unități neconvertibile, conturi non-stocabile, GL umflat penalități, rutare bucătărie/bar, curăță rețete orfane, reconciliază rețete↔produse (product_id).
- **Setări P&L** (`/settings/pnl-categories`) — Titlu „Setări P&L”, 4 tab-uri: „Template-uri industrie” (seturi întregi de categorii+KPI cu 1 click), „Categorii P&L” (secțiuni Venituri/COGS/Personal/OPEX + asignare tipuri), „Grupări venituri”, „Setări” (definiții + praguri KPI).
- **Marketing & Engagement (setări)** (`/settings/marketing`) — URL-urile publice de review (Google, TripAdvisor, Facebook) și configurarea WiFi-ului de marketing prin serverul local
- **Contexte QR dinamice** (`/settings/qr-contexts`) — Contexte pentru codurile QR (Terasă, Piscină, Cameră hotel, Eveniment privat) — cheie URL, nume, imagine, culoare, masă implicită, cu preset-uri de pornire rapidă
- **Câmpuri Personalizate** (`/settings/custom-fields`) — Câmpuri suplimentare pe deals, contacte, proiecte etc. — cheie tehnică, etichetă, tip (inclusiv listă cu opțiuni), obligatoriu sau nu
- **Traduceri & Valute** (`/translations`) — Traduceri pe entități cu progres per limbă, limbi active, valute cu sincronizare cursuri ECB/BNR sau curs manual și reguli de taxe pe țară
- **Echipamente & Zone Producție** (`/production/equipment-zones`) — Configurarea zonelor de producție, a echipamentelor din fiecare zonă și a capacităților per rețetă — max per lot, timp de ciclu, timp de pregătire
- **Scanner Containere** (`/production/scanner`) — Scanezi QR-ul unui container cu camera sau cu cititorul de coduri — pornești/finalizezi operația, avansezi etapa, semnalezi probleme QC, împarți sau unești containere, printezi eticheta
- **Follow-up Clienți** (`/customer-followup`) — Funnel de clienți, Next Best Action (sugestii zilnice cu scor — sună, trimite ofertă, cere recenzie), coadă de sarcini, playbooks automate (confirmare, reminder, mulțumire plus feedback, re-angajare) și timeline per client
- **Punte Symbai Supplier** (`/integrations/symbai-supplier`) — Conectarea POS-ului la platforma Symbai Supplier printr-un wizard în 3 pași (furnizorul acceptă cererea) — apoi vezi entitățile sincronizate, jurnalul de sincronizare și erorile
- **Cvent (RFP-uri)** (`/integrations/cvent`) — Cereri de ofertă pentru evenimente din rețeaua Cvent — RFP-uri, oferte, șabloane, reguli auto, locații și conturi Cvent; vizibilă doar cu integrarea Cvent activată
- **Configurare Email** (`/email-setup`) — Starea trimiterii de email-uri — câte branduri au SMTP configurat, secretul de dezabonare și webhooks pentru furnizori externi
- **Loguri Email** (`/email-logs`) — Toate trimiterile de email, individuale sau pe loturi per campanie — pentru a vedea exact ce a plecat și cu ce status
- **Promoții Website** (`/website/promotions`) — Bannerele vizuale ale site-ului (banner inline, bandă antet/subsol, modal) cu țintă pagină internă, produs sau URL extern — NU reduc prețul pe notă; pentru reduceri reale folosește Oferte & Promoții din meniu
- **Playbook Restaurant (campanii)** (`/playbook-restaurant`) — Wizard de campanii publicitare în 3 pași (brand și template, locații și conținut, buget și programare) cu sugestii Sym pe baza promoțiilor și meniului existent
- **Observabilitate** (`/observability`) — Starea tehnică a sistemului — monitorizarea erorilor, sănătatea integrărilor (rată de eroare, ultimul succes/ultima eroare) și timpii de răspuns pe cele mai folosite rute
- **Instalare Print Agent** (`/onboarding/print-agent`) — Ghid pas-cu-pas în 8 pași — adaugi PC-ul ca dispozitiv, generezi tokenul, instalezi Print Agent, adaugi imprimantele de rețea, configurezi casa de marcat fiscală, testezi sistemul și configurezi alertele
- **Meniu Public (portal clienți)** (`/portal/menu`) — Meniul digital așa cum îl văd clienții pe platforma clienților — căutare, filtre dietetice, alergeni și poze
- **Portal Furnizor (public)** (`/supplier-portal`) — Pagina publică unde furnizorul se autentifică cu ID-ul de furnizor și parola și își gestionează comenzile primite, produsele, catalogul și chat-ul — trimite-i linkul furnizorului tău
