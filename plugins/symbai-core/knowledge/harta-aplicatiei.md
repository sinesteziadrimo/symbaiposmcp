# Harta aplicației Symbai — toate paginile

> Index exhaustiv generat din registrul de navigare al aplicației (aceeași sursă pe care o citește tool-ul `gaseste_in_aplicatie`). Folosește harta pentru ORIENTARE (ce pagini există, ce face fiecare); pentru link-ul exact pe instanța clientului folosește MEREU tool-ul `gaseste_in_aplicatie` — el e la zi și ține cont de permisiuni/module. Intrările marcate Tab sunt tab-uri în interiorul paginii părinte.

## DASHBOARD & OPERATIUNI

- **Panou de Control** (`/`) — Dashboard principal — vânzări, comenzi, grafice, alerturi, KPI-uri, rezumat zilnic, overview general
- **Sarcinile Mele** (`/my-tasks`) — Feed-ul de sarcini al angajatului, grupat Întârziate → Azi → Următoarele, cu bifare directă și formular de dovadă (foto/notă/număr/semnătură); arată DE CE vede fiecare sarcină (atribuit ție / rolul tău pe tura de azi / liber). Taburi: Astăzi, Generale, Finalizate și — cu permisiune — Toate / Liste (unde managerul construiește)
- **Control Operațional** (`/operations`) — Monitorizare în timp real — comenzi active, stare bucătărie, stare sală
## POS — PUNCTE DE VÂNZARE

- **POS** (`/pos/kiosk`) — Punct de vânzare — casa de marcat, bonuri, plăți, încasare, comanda nouă. Default deschide kioskul; pentru ospătar/bar/mobile/recepție folosește variantele specifice.
- **Comenzi** (`/pos/waiter-orders`) — Lista TOATE comenzile în curs/închise — istoric, status, total. Diferit de Operations (live monitoring real-time).
- **POS Kiosk** (`/pos/kiosk`) — Self-service kiosk pentru CLIENT — clientul comandă singur (fast-food, parc, eveniment cu zona self-order). NU pentru ospătari. _Notă: Pentru ospătari la masă folosește /pos/waiter sau /pos/mobile._
- **POS Ospătar** (`/pos/waiter`) — Interfață POS pentru OSPĂTAR pe tabletă (size tablet, 7-12 inch). Restaurant servire la masă, vizualizare full sala + comandă per masă.
- **POS Mobil** (`/pos/mobile`) — POS pe TELEFON mobil pentru ospătari (interfață compact, 5-6 inch). Echivalent funcțional cu /pos/waiter dar optimizat pentru telefoane.
- **POS Bar** (`/pos/bar`) — Interfață POS pentru BARMAN — meniu prioritar bar (cocktail/bere/vin/cafea), workflow rapid, fără layout mese.
- **POS Recepție** (`/pos/reception`) — POS pentru RECEPȚIE hotel/pensiune — încasare cazare + servicii suplimentare, integrare cu folio oaspete. _Notă: Pentru check-in/check-out propriu-zis folosește /hotel/front-desk._
- **POS Website** (`/pos/website`) — Comenzi online de pe website
- **Mese Deschise** (`/pos/open-tables`) — Vizualizare mese cu comenzi active
- **Comenzi Ospătar** (`/pos/waiter-orders`) — Lista comenzilor per ospătar
## MENIU & DISPOZITIVE POS

- **Meniu & Dispozitive POS** (`/menu`) — Pagină centrală cu 5 tab-uri: Prețuri Meniu, Platforme, Configurare Afișaj, Meniu Fizic, Oferte & Promoții
  - Tab **Prețuri Meniu** — Tab Prețuri Meniu — prețuri de vânzare, analiza popularitate vs profitabilitate, food cost
  - Tab **Platforme POS** — Tab Platforme — activare/dezactivare puncte de vânzare POS (kiosk, waiter, bar, tablete, recepție, website) și asociere meniu per dispozitiv. Website Builder-ul include un asistent AI propriu (WB Assistant) cu 27 de tool-uri. _Notă: Din acest tab poți activa Website-ul propriu și comenzile online. Click pe 'Website/Online' → butonul 'Configurează' pentru Website Builder. Website Builder-ul are un asistent AI integrat (WB Assistant) care apare în dreapta jos — ajută cu template-uri, pagini, componente, design, setări._
  - Tab **Configurare Afișaj** — Tab Configurare Afișaj — profile de afișare pentru POS și web, layout, culori, ordine categorii, imagini
  - Tab **Meniu Fizic** — Tab Meniu Fizic — designer de meniu tipărit/PDF pentru restaurant, layout profesional
  - Tab **Oferte & Promoții** — Tab Oferte & Promoții — creare promoții, reduceri, coduri, oferte speciale, happy hour, combo, meniuri combo
## FINANȚE

- **Finanțe & Contabilitate** (`/finance`) — Pagină centrală finanțe cu tab-uri: Cash Flow (flux numerar), Cheltuieli & Plăți (înregistrare facturi furnizori + salarii), Reconciliere Canale (Glovo/Wolt/etc.), Control Viva (terminale card), Solduri inițiale. Pagini SEPARATE accesibile din meniu: /finance/daily-close (raport Z + numărătoare casă), /finance/cash-book (registru numerar legal 14-4-7A), /finance/cash-registers (configurare casierii multi-locație).
  - Tab **Cash Flow** — Tab Cash Flow — fluxul AGREGAT de numerar (încasări vs plăți), grafice, previziuni viitor. Pentru registrul fizic numerar pe zi → /finance/cash-book.
  - Tab **Cheltuieli & Plăți** — Tab Cheltuieli & Plăți — înregistrare cheltuieli noi + categorii + furnizori + facturi de plătit + plăți recurente + salarii. ATENȚIE: pentru facturile EMISE de tine (către clienți) → /finance (alt tab) sau eFactura. Pentru cele PRIMITE de la furnizori, AICI.
- **Închidere Zi** (`/finance/daily-close`) — Pagină standalone — RITUAL DE ZI: numărătoare cash în casierie + reconciliere cu sistemul + generare raport Z fiscal. Necesar la finalul fiecărei zile de lucru pentru fiscalizare RO. _Notă: Procedură standard: 1) numără cash fizic, 2) verifică total Viva/card, 3) confirmă rest casierie pentru ziua următoare, 4) generează raport Z, 5) sigilează zi._
- **Casierii (mod organizare)** (`/finance/cash-registers`) — Configurare casierii și mod organizare: per firmă / per locație / per brand × locație. Tot aici: reguli pe țară și mapări auto-feed.
  - Tab **Reconciliere Canale** — Tab Reconciliere — potrivire plăți canale livrare vs POS, comisioane
  - Tab **Control Viva** — Tab Control Viva — integrare plăți Viva Wallet, tranzacții card, decontări
- **Cash Flow Dedicat** (`/finance/cashflow`) — Pagina dedicată de Cash Flow — vizualizare completă flux numerar
- **Registru de casă** (`/finance/cash-book`) — Registru de casă (cod 14-4-7A) — operațiuni numerar pe zi, închidere/sigilare cu hash, reconciliere extras bancă, conformitate RO/MD
- **Casierii (Registre)** (`/finance/cash-book/registers`) — Alias către configurarea casieriilor accesibilă din pagina registru de casă
## ANALYTICS & RAPOARTE

- **Rapoarte & Analiză** (`/analytics`) — Dashboarduri de analiză cu 13 tab-uri: Raport Zilnic, P&L, Vânzări Angajați, Timpi, Mese, Avansate, Costuri, Vânzări, Inventar, Personal, Plăți, Categorii, Gestiune
  - Tab **Raport Zilnic (Z)** — Tab Raport Zilnic — rezumat vânzări pe zi, raport Z
  - Tab **P&L Detaliat** — Tab P&L (Profit & Loss) — profit și pierdere detaliat pe categorii, raport profit
  - Tab **Vânzări Angajați** — Tab Vânzări Angajați — performanță vânzări per angajat
  - Tab **Timpi Așteptare** — Tab Timpi Așteptare — analiza timpilor de servire, bucătărie, livrare, viteza serviciu
  - Tab **Analiză Mese** — Tab Analiză Mese — ocupare, rotație, venit per masă, raport mese
  - Tab **Rapoarte Avansate** — Tab Rapoarte Avansate — rapoarte personalizabile, export
  - Tab **Costuri Operaționale** — Tab Costuri Operaționale — analiză costuri pe categorii
  - Tab **Vânzări & Venituri** — Tab Vânzări & Venituri — grafice vânzări, tendințe, comparații, top produse vândute
  - Tab **Inventar & Costuri** — Tab Inventar & Costuri — valoare stoc, rotație, food cost
  - Tab **Performanță Personal** — Tab Performanță Personal — ore lucrate, productivitate, evaluare
  - Tab **Plăți & Metode** — Tab Plăți & Metode — defalcare pe metode de plată (cash, card, online)
  - Tab **Mix Categorii** — Tab Mix Categorii — distribuția vânzărilor pe categorii de produse, raport categorii
  - Tab **Rapoarte Gestiune** — Tab Rapoarte Gestiune — NIR, avize, fișe de magazie, rapoarte stoc
## PERSONAL (STAFF)

- **Personal** (`/staff`) — Administrare angajați cu 8 tab-uri: Planificator Ture, Foaie Pontaj, Sarcini & Liste, Listă Personal, Roluri & Permisiuni, Grupuri Mesaje, Program Salon, Contracte & Salarii
  - Tab **Planificator Ture** — Tab Planificator Ture — calendar ture, repartizare angajați pe ture
  - Tab **Foaie Pontaj** — Tab Foaie Pontaj — ore lucrate, prezență, absențe, overtime
  - Tab **Sarcini & Liste** — Tab Sarcini & Liste — managerul construiește checklist-uri cu țintă pe rol+tură+raion (vizibile automat celor în tură), atribuire pe nume sau liste libere, recurență, oră-limită, dovadă (foto/notă/număr/semnătură), verificare; panou „Cine va vedea asta și când", șabloane și dashboard per listă. Angajatul le bifează din /my-tasks
  - Tab **Listă Personal** — Tab Listă Personal — toți angajații, date personale, contract, PIN POS
  - Tab **Roluri & Permisiuni** — Tab Roluri & Permisiuni — creare roluri, atribuire permisiuni, acces module
  - Tab **Grupuri Mesaje** — Tab Grupuri Mesaje — administrarea grupurilor de chat ale personalului (apartenență nominală, pe rol sau „cine e în tură")
  - Tab **Program Salon** — Tab Program Salon — programează ce aranjament de sală (configurație de plan sală) e activ pe fiecare zi a săptămânii + QR self-service per raion. NU repartizează ospătari pe mese (asta se face pe tură, în Planificator Ture, prin raionul/secțiunea de pe tură)
  - Tab **Contracte & Salarii** — Tab Contracte & Salarii — contractele fiecărui angajat (CIM/SRL-PFA/Zilier/Fără contract), alocări pe brand/locație și bonusuri
## INVENTAR & STOC

- **Tablou de Bord Stoc** (`/inventory`) — Dashboard inventar cu 16 tab-uri: Stoc Curent, Inventariere, Zone, Mobil, Diferențe, Niveluri, Risipă, Mișcări, Rețete, Producție, Depozite, Categorii, Documente, Rapoarte, Aprobări, Audit
  - Tab **Stoc Curent** — Tab Stoc Curent — cantități în stoc, valoare stoc, alerte stoc minim
  - Tab **Inventariere** — Tab Inventariere — proces NUMĂRARE FIZICĂ a stocului. Workflow: deschide sesiune → bifează articole pe gestiuni → introdu cantități numărate → finalizează → DIFERENȚELE se ajustează din /inventory?tab=variance. _Notă: Pentru ajustare după numărare → tab Diferențe Stoc. NU poți avea 2 sesiuni deschise simultan pe aceleași gestiuni (preventie dublă ajustare)._
  - Tab **Zone Depozitare** — Tab Zone — zone de depozitare, rafturi, frigidere
  - Tab **Inventariere Mobilă** — Tab Inventariere Mobilă — scanare și numărare pe telefon
  - Tab **Diferențe Stoc** — Tab Diferențe — comparare stoc fizic vs sistem, ajustări
  - Tab **Niveluri Stoc** — Tab Niveluri — stoc minim, stoc maxim, punct de recomandă
  - Tab **Risipă & Pierderi** — Tab Risipă — înregistrare pierderi, expired, deteriorat
  - Tab **Mișcări Stoc** — Tab Mișcări — intrări, ieșiri, transferuri, istoric mișcări
  - Tab **Rețete Inventar** — Tab Rețete — rețete cu ingrediente, food cost, deducere automată din stoc
  - Tab **Producție Inventar** — Tab Producție — loturi produse, semipreparate, consum materii prime
  - Tab **Depozite & Gestiuni** — Tab Depozite — gestiuni, puncte de lucru, locații stoc
  - Tab **Categorii Inventar** — Tab Categorii Inventar — categorii pentru produse din stoc
  - Tab **Documente Gestiune** — Tab Documente — NIR-uri, avize, bon consum, bon transfer
  - Tab **Rapoarte Inventar** — Tab Rapoarte — rapoarte stoc, valoare, rotație, consum
  - Tab **Aprobări Stoc** — Tab Aprobări — aprobări transferuri, ajustări, comenzi
  - Tab **Audit Inventar** — Tab Audit — istoric modificări, loguri acțiuni stoc
## ALTE PAGINI INVENTAR & PRODUCȚIE

- **Verificări Stoc** (`/inventory-check`) — Inventariere fizică — numărare, comparare, ajustare diferențe
- **Operațiuni Gestiune** (`/stock-operations`) — Transferuri, recepții, ieșiri, corecții stoc între gestiuni
- **Hub Aprovizionare** (`/smart-ordering`) — Comenzi automate furnizori — pe baza stoc minim, consum, previziuni
- **Producție Bucătărie** (`/production`) — Planificare producție — semipreparate, loturi, executare, depozitare
- **Recomandări Achiziții** (`/procurement-recommendations`) — Recomandări AI de aprovizionare bazate pe consum și stoc
- **Consum Zilnic** (`/daily-consumption`) — Generare și vizualizare consum zilnic — scădere automată stoc pe baza comenzilor închise, expandare rețete în materii prime, istoric pe zile
## MASTER DATA — PRODUSE & CATEGORII

- **Categorii și Produse** (`/master-data`) — Administrare completă produse, categorii, prețuri de cost, gestiuni, TVA
- **Alergeni** (`/allergens`) — Administrare alergeni EU — atribuire pe produse, generare fișe alergeni
- **Etichete & Alergeni** (`/ai-tags`) — Pune alergeni (Reg. UE 1169), cotă TVA și rutare imprimante/KDS pe produse; AI sugerează, tu aprobi
## FURNIZORI

- **Furnizori & Produse** (`/suppliers`) — Administrare furnizori — catalog produse, prețuri, termeni plată, portal
- **Furnizori Symbai** (`/symbai-suppliers`) — Piață furnizori Symbai — catalog partajat, oferte furnizori din rețea
- **Sold Furnizori** (`/supplier-balances`) — Solduri furnizori — datorii, plăți, balanță furnizori, sold restant
- **Entități Juridice** (`/clients`) — Evidență persoane juridice — firme, CUI, adrese, date fiscale
## REZERVĂRI

- **Rezervări** (`/reservations`) — Sistem de rezervări cu 5 tab-uri: Listă Așteptare, Plan Sală, Listă Rezervări, Analiză, Configurare
  - Tab **Listă de Așteptare** — Tab Listă Așteptare — pentru HOSTESS la intrare: gestionează WALK-IN-uri (clienți fără rezervare), coadă de așteptare, asignare mese libere, comunicare timp estimat. Diferit de Listă Rezervări (care e calendar).
  - Tab **Plan Sală Live** — Tab Plan Sală Live — vizualizare sală cu mese și ocupare în timp real
  - Tab **Listă Rezervări** — Tab Listă Rezervări — toate rezervările, calendar, confirmare, anulare
  - Tab **Analiză Rezervări** — Tab Analiză — timpi rotație, rată ocupare, ore de vârf
- **Configurare Rezervări** (`/reservations/config`) — Regulile sistemului de rezervări — activare, fereastră de timp, persoane min/max, inventar și zone, controlul fluxului (pacing, câți clienți pot sosi per interval) și câmpurile formularului
## PLAN SALĂ & BUCĂTĂRIE

- **Plan Sală** (`/floorplan`) — Editor vizual plan sală — mese, zone, configurare layout, aranjament, harta mese
- **Display Bucătărie (KDS)** (`/kitchen/display`) — Ecran comenzi bucătărie — bonuri primite, marcare gata (bump), timere, batch processing. Pentru fiecare ecran KDS configurat (Bucătărie Caldă, Rece, Bar, Grătar, etc.) — accesibil per device cu URL distinct. _Notă: Bonurile vin AICI bazat pe etichetele produselor + zona mesei. Configurare ecrane + rutare → /settings?tab=kds._
- **Ecran Expeditor** (`/kitchen/expeditor`) — Ecran EXPEDITOR — punct unic verificare completitudine masă înainte de servire. Vede TOATE bonurile pentru o masă, marchează când e gata să fie ridicată de ospătar. _Notă: Diferit de KDS bucătărie (care e per stație). Expeditor agregă pe masă cross-stații._
## CONTRACTE & CHESTIONARE

- **Contracte** (`/contracts`) — Administrare contracte cu 2 tab-uri: Șabloane și Contracte Active
  - Tab **Șabloane Contracte** — Tab Șabloane — template-uri contracte, creare șabloane noi
  - Tab **Contracte Active** — Tab Contracte — contracte semnate, urmărire expirare, status
- **Chestionare** (`/questionnaires`) — Builder chestionare cu 3 tab-uri: Șabloane, Răspunsuri, Statistici Personal
  - Tab **Șabloane Chestionare** — Tab Șabloane — builder chestionare, 22 tipuri întrebări, condiții, design
  - Tab **Răspunsuri Chestionare** — Tab Răspunsuri — vizualizare răspunsuri primite, analitice
  - Tab **Statistici Personal** — Tab Statistici Personal — performanța angajaților din feedback clienți
## CANALE LIVRARE

- **Manager Canale Livrare** (`/channels`) — Integrare livrări cu 5 tab-uri: Prezentare, Comenzi, Meniu, Reconciliere, Integrări
  - Tab **Prezentare Canale** — Tab Prezentare — status platforme livrare, statistici, comisioane
  - Tab **Comenzi Livrare** — Tab Comenzi — comenzi de pe platforme, status, acceptare/refuz
  - Tab **Meniu Platforme** — Tab Meniu — sincronizare meniu cu platformele de livrare
  - Tab **Reconciliere Livrări** — Tab Reconciliere — verificare plăți platforme vs comenzi efective
  - Tab **Integrări Livrare** — Tab Integrări — conectare API Glovo, Wolt, Bolt Food, Tazz
## SOCIAL MEDIA & MARKETING

- **Conturi Social Media** (`/social-media`) — Conectare și gestionare conturi cu 3 tab-uri: Conectare, Setări, WhatsApp
  - Tab **Conectare Conturi** — Tab Conectare — conectare OAuth pentru Facebook, Instagram, TikTok, YouTube, LinkedIn, Google Business
  - Tab **Setări Social Media** — Tab Setări — configurare posturi automate, reguli, template-uri
  - Tab **WhatsApp Business** — Tab WhatsApp — conectare WhatsApp Business, configurare mesaje
- **Social Content Hub** (`/social-hub`) — Hub unificat de conținut social — postări, calendar editorial, story-uri, reels, carusele. View list (?view=list) sau calendar (?view=calendar)
- **Listă Postări Social** (`/social-hub?view=list`) — View listă postări — toate postările publicate/programate/draft pe canale
- **Calendar Editorial Social** (`/social-hub?view=calendar`) — View calendar — planificare postări pe luna/saptamana, drag & drop multi-platforma
  - Tab **Inbox Social Unificat** — Inbox mesaje, comentarii și mențiuni de pe toate platformele cu răspunsuri AI
- **Google Business Profile** (`/gbp`) — Manager fișa Google Business — postări, recenzii, întrebări, fotografii, ore
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
  - Tab **Listă Clienți** — Tab Listă Clienți — toți clienții, XP, nivel, insigne, istoric
  - Tab **Segmente & Grupuri** — Tab Segmente — grupare clienți pe criterii, segmentare
  - Tab **Promoții Portal** — Tab Promoții — promoții și voucher-uri în portalul clienți
  - Tab **Autentificare & RFID** — Tab Autentificare — carduri RFID, brățări NFC, metode de acces portal
- **Atracții** (`/portal-attractions`) — Administrare atracții — browse, recenzii, programare
- **Jocuri** (`/portal-games`) — Administrare jocuri — sloturi, prețuri, rezervări, program
- **Misiuni & Recompense** (`/portal-missions`) — Gamificație — misiuni zilnice/săptămânale, insigne, recompense
- **Agenți Chat Portal** (`/portal-chat-agents`) — Creare și gestionare agenți AI pentru chat-ul portalului de clienți
- **Carduri de Acces** (`/access-cards`) — Gestionare carduri RFID și brățări NFC pentru acces
## HACCP & SIGURANȚĂ ALIMENTARĂ

- **HACCP & Siguranță Alimentară** (`/haccp`) — Dashboard HACCP cu 5 tab-uri: Temperaturi, Curățenie, Incidente, Senzori, Răcire Rapidă
  - Tab **Temperaturi HACCP** — Tab Temperaturi — monitorizare temperaturi frigidere, congelatoare, depozite
  - Tab **Curățenie & Igienă** — Tab Curățenie — planuri de curățenie, verificări igienă, checklist-uri cleaning
  - Tab **Incidente HACCP** — Tab Incidente — raportare incidente siguranță alimentară, acțiuni corective
  - Tab **Senzori IoT** — Tab Senzori — configurare și monitorizare senzori IoT temperatură, umiditate
  - Tab **Răcire Rapidă** — Tab Răcire Rapidă — monitorizare procese de răcire rapidă HACCP
## SETĂRI

- **Setări** (`/settings`) — Setări platformă cu secțiuni: Date companie, Locații & Branduri, Fidelizare, Feedback, Display comenzi, Dispozitive, Imprimante, Design Bon, POS, Inventar, Integrări API, IoT MQTT, Notificări, Automatizări, Security, Localizare
  - Tab **Date Companie** — Secțiunea Date companie — nume, CUI, adresă, logo, date fiscale
  - Tab **Locații și Branduri** — Secțiunea Locații — gestionare branduri și locații multiple
  - Tab **Setări Fidelizare** — Secțiunea Fidelizare — configurare program de loialitate, rate câștig/răscumpărare, niveluri
  - Tab **Feedback & Chestionare** — Secțiunea Feedback — configurare chestionare automate, declanșatoare
  - Tab **Display Comenzi** — Secțiunea Display comenzi — configurare ecrane KDS bucătărie
  - Tab **Dispozitive & Hardware** — Secțiunea Dispozitive — tablete, telefoane, terminale plată
  - Tab **Imprimante & Rutare** — Secțiunea Imprimante — configurare imprimante bonuri, bucătărie, etichete, rutare pe categorii, adăugare imprimantă nouă pe IP / rețea
  - Tab **Design Bon & Notă** — Secțiunea Design Bon — personalizare bon fiscal, notă de plată, header/footer
  - Tab **Setari POS** — Sectiunea POS — configurare functionalitati POS (mod operare, optiuni plata, autoSendKitchen, taxa serviciu) + sub-sectiune Taxe & Financiar (cote TVA 0%/11%/21% RO, bacsis). Configurarea TVA INALTERABILA: 0/11/21 (NU 5/9/19).
  - Tab **Inventar & Stoc Setări** — Secțiunea Inventar — configurare gestiuni, unități măsură, alerte stoc
  - Tab **Integrări (API)** — Secțiunea Integrări — chei API, webhook-uri, conectări externe
  - Tab **Server IoT (MQTT)** — Secțiunea MQTT — configurare broker IoT pentru senzori temperatură
  - Tab **Notificări** — Secțiunea Notificări — configurare alerte push, email, SMS
  - Tab **Automatizări Clienți** — Secțiunea Automatizări — reguli automate pentru marketing (zi naștere, client inactiv)
  - Tab **Server & Fiscal** — Secțiunea Server & Fiscal — Edge Server local (server proxy în restaurant pentru rezilienta la cădere internet), imprimantă fiscală Datecs/Daisy (driver fiscal RO), output folder fiscalizare, ghid instalare PC local + Print Agent. _Notă: Pentru instalare PC nou + Print Agent: /onboarding/print-agent (wizard 8 pași). Edge Server-ul oferă POS LOCAL functional fără internet._
  - Tab **Unități de Măsură** — Secțiunea Unități — kg, l, buc, ml, g, conversii între unități
  - Tab **Setări Email Marketing** — Secțiunea Email — configurare SMTP, domeniu expeditor, identități sender
  - Tab **Symbai Hub** — Secțiunea Hub — conexiune cloud, sincronizare, licență, actualizări
  - Tab **Grupări Clienți** — Secțiunea Grupări Clienți (doar multi-unit) — acces controlat per brand/locație
  - Tab **Security Log** — Secțiunea Securitate — loguri autentificare, IP-uri, alerturi securitate
  - Tab **Localizare** — Secțiunea Localizare — limbă, format dată, monedă, fus orar
- **Setări Sales CRM** (`/settings/sales-crm`) — Configurare CRM vânzări — pipeline, etape, câmpuri custom
## SALES CRM

- **Sales CRM** (`/sales-crm`) — CRM vânzări cu 4 secțiuni interne (nu URL): Dashboard (KPI-uri, metrici), Pipeline Kanban (etape deal, drag-and-drop), Calendar Evenimente (disponibilitate săli), Activități (apeluri, email, WhatsApp). Plus: gestionare dealuri, performanță agenți, configurare pipeline, AI vânzări.
## CLIENȚI & FIDELIZARE

- **Clienți & Portal** (`/customers`) — Administrare clienți — conturi, date contact, istoric comenzi, puncte, segmente
- **Program Fidelizare** (`/loyalty`) — Program loialitate cu 3 secțiuni interne (nu URL): Prezentare Generală (statistici, niveluri), Clienți Loiali (puncte, nivel, istoric), Setări (rate câștig/răscumpărare, niveluri Bronze/Silver/Gold/Platinum). Include gamificație, misiuni, insigne.
- **Rapoarte Clienți** (`/customer-reports`) — Analitice clienți — segmentare, comportament, lifetime value, frecvență
- **Import Clienți** (`/customer-import`) — Import clienți din Excel/CSV — date contact, segmente, puncte loialitate
## EMAIL MARKETING

- **Email Marketing** (`/email-campaigns`) — Campanii email (pagină unică, fără tab-uri URL). Wizard 4 pași: Config → Template → Audiență → Review. Template designer, segmentare, automatizări, analitice.
- **Analitice Email** (`/email-analytics`) — Statistici campanii email — open rate, click rate, bounce, unsubscribe, tendințe
- **Template-uri Email** (`/email-templates`) — Galerie template-uri email — pre-built, custom HTML, drag & drop editor
## CAMPANII PUBLICITARE

- **Campanii Publicitare** (`/ad-campaigns`) — Reclame plătite — Meta Ads, Google Ads, TikTok Ads — obiective, bugete, targeting, analitice
## FIȘE TEHNICE & CONTRACTE

- **Fișă Tehnică Rețetă** (`/recipe-datasheet`) — Fișe tehnice detaliate per rețetă — ingrediente, cantități, procedură, alergeni, nutriție
## FEEDBACK, AUTOMATIZĂRI, LIVRĂRI

- **Recenzii & Feedback** (`/feedback`) — Vizualizare recenzii clienți, răspunsuri, analiza sentimentului
- **Acțiuni Automate** (`/actions`) — Automatizări marketing — trigger → acțiune (email, SMS, notificare)
- **Livrări** (`/deliveries`) — Monitorizare livrări active — status, curieri, timpi
- **Inbox WhatsApp** (`/whatsapp-inbox`) — Mesaje primite și trimise prin WhatsApp Business
## DATA IMPORT

- **Import Date** (`/data-import`) — Wizard import date cu 3 tab-uri: Import Nou, Șabloane, Istoric
  - Tab **Import Nou** — Tab Import Nou — încărcare fișier Excel/CSV pentru import
  - Tab **Șabloane Import** — Tab Șabloane — descărcare template-uri Excel pentru import
  - Tab **Istoric Import** — Tab Istoric — lista importurilor anterioare cu status
## ALTE PAGINI

- **Loguri Activitate** (`/audit-logs`) — Istoric complet acțiuni — cine a făcut ce, când, unde
- **Coduri QR** (`/qr-codes`) — Coduri QR pentru mese (meniu digital) + QR-uri dinamice cu link scurt și destinație (redirect) editabilă
- **Centru Printare** (`/print`) — Administrare imprimante — bonuri, bucătărie, etichete, testare
## AI AGENTS

- **AI Onboarding** (`/ai-onboarding`) — Asistent AI pentru configurarea inițială — ghidaj pas cu pas (alias: /ai-migration)
- **Onboarding Avansat** (`/ai-advanced-onboarding`) — Agent AI pentru funcționalități avansate — integrări, automatizări, asistenți, website
- **Import din Excel** (`/ai-bulk-import`) — Import în masă din Excel/CSV cu mapare AI a coloanelor, validare și raport pe fiecare rând
- **AI Menu Creator** (`/ai-menu`) — Asistent AI Chef pentru creare meniu echilibrat — ingrediente, costuri
- **AI Rețetare** (`/ai-recipes`) — Recipe Workbench — toate produsele finite/semipreparate cu food cost per meniu, editor ingrediente inline, chat AI, analiză. Filtre: fără rețetă, neîn meniu, food cost critic.
- **Editor Rețete AI** (`/ai-recipes`) — Recipe Workbench — editare ingrediente inline (add/remove/cantitate) + chat AI Sym Chef + food cost live. Deschide /ai-recipes și expandează un produs.
- **Creare Rețete AI** (`/ai-recipes?tab=create`) — Sym Recipe — creare rețete noi de la zero cu AI (ingrediente, cantități, food cost calculat automat)
- **Analiză Rețete AI** (`/ai-recipes`) — Analiză food cost + marjă per produs și per meniu inline în workbench. Deschide /ai-recipes și apasă Analizează pe un produs.
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
- **Intrări Stoc** (`/stock-entries`) — Intrări stoc — recepții marfă, NIR-uri, documente intrare
- **Ieșiri Stoc** (`/stock-exits`) — Ieșiri stoc — consum, transfer, returnare, documente ieșire
- **Mișcări Stoc** (`/stock-movements`) — Istoric complet mișcări stoc — intrări, ieșiri, transferuri, ajustări
- **Grupurile Mele** (`/my-groups`) — Grupuri de lucru ale angajatului curent
- **Cererile Mele de Concediu** (`/my-leave-requests`) — Cereri concediu ale angajatului curent — solicitare, status, istoric
## CONTABILITATE & IMPORT

- **Import Contabilitate** (`/accounting-import`) — Import date contabile — import balanțe, jurnale, plan conturi din software contabil
- **Registru Contabil** (`/accounting-ledger`) — Registru contabil — plan conturi, balanță, jurnal, fișe de cont
- **Produse Depozit** (`/warehouse-products`) — Administrare produse pe depozit — stocuri per gestiune, alocare depozite
- **Rețete Produse** (`/ai-recipes`) — Administrare rețete tehnice — ingrediente, cantități, fișe tehnice produse (Recipe Workbench)
## MARKETING — EMAIL & ADS

- **Revizuire Email-uri** (`/email-review`) — Revizuire și aprobare campanii email înainte de trimitere
- **Automatizări Marketing** (`/marketing-automations`) — Automatizări marketing avansate — fluxuri, triggere, secvențe email/SMS
## PORTAL CONFIG

- **Configurare Portal** (`/portal-config`) — Configurare portal clienți — aspect, meniu, funcționalități active, branding
## MEDIA & BRAND

- **Bibliotecă Media Brand** (`/brand-media-library`) — Galerie media brand — imagini, logo-uri, video-uri, materiale vizuale
## SETĂRI SUB-PAGINI

- **Conturi pe Tip Produs** (`/ai-product-types`) — Hub tipuri de produse + conturi contabile (OMFP 1802) — template-uri, completare automată, editor detaliat, analitice pe brand/locație
- **Sarcini Programate** (`/settings/cron-jobs`) — Administrare sarcini cron — joburi programate, automatizări pe orar
## AI AGENȚI SUPLIMENTARI

- **AI Reclame** (`/ai-ads`) — Agent AI pentru creare și gestionare campanii publicitare — Facebook Ads, Google Ads
- **AI Analiză** (`/ai-analytics`) — Agent AI pentru analiză date — interpretare rapoarte, insights, sugestii
- **AI Research Agent** (`/ai-research`) — Agent AI pentru cercetare — investigații, research competitor, analize de piață, sumarizare surse externe
## HOTEL / PENSIUNE

- **Dashboard Hotel** (`/hotel`) — Dashboard hotel/pensiune — KPI ocupare (ADR, RevPAR), arrivals/departures, status camere
- **Recepție Hotel** (`/hotel/front-desk`) — Front desk hotel — workflow zilnic recepționer: check-in (rezervări existente + walk-in), check-out (finalizare folio, plată), asignare camere, modificare șederi, transfer cameră. NU pentru încasare cazare doar — folio integrat cu POS. _Notă: Pentru încasare la POS hotel (mini-bar, restaurant) folosește /pos/reception. Folio agregă tot la check-out._
- **Camere Hotel** (`/hotel/rooms`) — Lista completă camere — status (free/occupied/dirty/clean/maintenance)
- **Tipuri Camere** (`/hotel/room-types`) — Tipuri camere (single/double/suite) — capacitate, dotări, prețuri de bază
- **Housekeeping** (`/hotel/housekeeping`) — Curățenie camere — task-uri menajere, status, asignare personal, priorități
- **Oaspeți Hotel** (`/hotel/guests`) — Lista oaspeți — date contact, istoric șederi, preferințe, documente
- **CRM Hotel** (`/hotel/crm`) — CRM oaspeți — segmente, campanii, comunicări personalizate
- **Folio-uri** (`/hotel/folios`) — Folio (cont oaspete) — toate cheltuielile șederii (cazare, mini-bar, restaurant, spa)
- **Manager Tarife Hotel** (`/hotel/rates`) — Rate manager — prețuri camere pe zile/sezoane, restricții (min stay, CTA/CTD)
- **Channel Manager Hotel** (`/hotel/channels`) — Sincronizare cu OTA-uri — Booking.com, Airbnb, Expedia
- **Grupuri Hotel** (`/hotel/groups`) — Group blocks — rezervări grup pentru evenimente/conferințe
- **Analitice Hotel** (`/hotel/analytics`) — Rapoarte hotel — ocupare, ADR, RevPAR, sursă rezervări, anulări, no-show
- **Coduri Promo Hotel** (`/hotel/promo-codes`) — Coduri promoționale hotel — discount, valabilitate, restricții
- **Feedback Oaspeți** (`/hotel/guest-feedback`) — Chestionare post-sejur, NPS, recenzii interne
- **Recenzii Hotel** (`/hotel/reviews`) — Recenzii agregate de pe Booking, Tripadvisor, Google
- **Setări Proprietate Hotel** (`/hotel/property-settings`) — Setări proprietate — adresa, fotografii, dotări, politici, check-in/out times
## ECOMMERCE

- **Comenzi Ecommerce** (`/ecommerce/orders`) — Comenzi ecommerce — fulfillment, status, tracking AWB, retururi
- **Magazine Online** (`/ecommerce/websites`) — Configurare magazine online — domenii, plăți, layout
- **Livrare Ecommerce** (`/ecommerce/shipping`) — Configurare livrare — zone, tarife, curieri, free shipping
- **AWB & Curieri** (`/ecommerce/awb`) — Generare AWB — Sameday, Cargus, FAN Courier, DPD, GLS
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

- **SEO Hub** (`/seo`) — Hub SEO — overview general, scor SEO, alerte, recomandări
- **SEO Summary** (`/seo`) — Sumar SEO — KPI cheie, ranking mediu, traffic organic (afișat la /seo)
- **Pagini SEO** (`/seo/pages`) — Audit pagini — title, meta, H1-H6, alt-uri, Core Web Vitals
- **Cuvinte Cheie SEO** (`/seo/keywords`) — Tracking cuvinte cheie — ranking, volum, dificultate
- **Cercetare SEO** (`/seo/research`) — Keyword research — sugestii, intent, long-tail, gap competitori
- **Competitori SEO** (`/seo/competitors`) — Analiza competitori — ranking, backlink-uri, gap analysis
- **Setări SEO** (`/seo/settings`) — Setări SEO — robots, sitemap, redirects, hreflang, GSC
## BLOG

- **Blog Tracker** (`/blog/tracker`) — Tracker articole blog — overview, performanță, calendar editorial
- **Articole Blog** (`/blog/posts`) — Administrare articole — list, filtre status, bulk actions
- **Autori Blog** (`/blog/authors`) — Autori blog — profil, biografie, articole
- **Import Blog** (`/blog/import`) — Import articole din WordPress, Ghost — bulk migration
- **Redirectionări Blog** (`/blog/redirects`) — Redirect-uri 301 — URL-uri vechi → noi pentru SEO
- **Analitice Blog** (`/blog/analytics`) — Analitice articole — pageviews, time on page, bounce
- **Advertoriale Blog** (`/blog/advertorials`) — Advertoriale plătite — tracking, ROI, campanii sponsorizate
- **Backlinks Blog** (`/blog/backlinks`) — Backlink building — outreach, status link-uri, domain authority
- **Migrare Blog** (`/blog/migration`) — Wizard migrare blog din altă platformă
## FACTORY / PRODUCȚIE EXTINSĂ

- **Tablou Fabrică** (`/factory-dashboard`) — Dashboard fabrică — KPI producție, OEE, randament, loturi active, alerte echipamente
- **Factory AI Chat** (`/factory-ai`) — Chat AI dedicat operațiunilor de fabrică
- **AI Flow Builder** (`/ai-flow-builder`) — Constructor vizual fluxuri tehnologice cu AI
- **Tabletă Stație Lucru** (`/workstation-tablet`) — Interfață tabletă pentru stația de producție — scanare container, progres, QC
- **Producție Evenimente** (`/productie-evenimente`) — Planificare producție pentru evenimente catering
- **Fluxuri Tehnologice** (`/fluxuri-tehnologice`) — Fluxuri tehnologice de producție — operații, dependențe, BOM, QC
- **Loturi WIP** (`/loturi-wip`) — Loturi work-in-progress — toate loturile în producție
- **Planificare MPS** (`/planificare-mps`) — Master Production Schedule — planificare producție pe orizont mediu/lung
## B2B

- **Comenzi B2B** (`/b2b-orders`) — Management comenzi B2B — clienți firmă, contracte cadru, prețuri negociate
## FINANȚE EXTINS

- **Rapoarte Fiscale** (`/finance/fiscal-reports`) — Rapoarte fiscale — bonuri emise, X/Z, defalcare TVA, export ANAF
- **Foaie închidere zi (printabilă)** (`/finance/end-of-day`) — Foaie completă de închidere zi (printabilă) — totaluri, plăți, mese, ospătari, bonuri Z, registru casă agregat
## RAPOARTE P&L EXTINSE

- **Raport P&L** (`/reports/pnl`) — Profit & Loss complet — venituri, COGS, cheltuieli operaționale, EBITDA
- **P&L KPI** (`/reports/pnl-kpi`) — KPI-uri P&L — gross margin, contribution margin, EBITDA margin, prime cost
- **P&L Comparație** (`/reports/pnl-compare`) — Comparație P&L — perioadă vs perioadă, brand vs brand, locație vs locație
- **P&L Salvate** (`/analytics/saved-pnl`) — Lista rapoarte P&L salvate — snapshot-uri istorice, partajare
## CALENDAR PLATFORMĂ

- **Calendar Platformă** (`/calendar`) — Calendar global — evenimente, task-uri, rezervări, ture, deadline-uri
## PAGINI ADIȚIONALE

- **Menu Engineering** (`/menu-engineering`) — Analiza meniu — popularitate vs profitabilitate (stars / plowhorses / puzzles / dogs), recomandări preț
- **Blog** (`/blog`) — Pagină principală blog — overview tracker, postări, autori, advertoriale, backlinks
- **Calendar Conținut** (`/content-calendar`) — Calendar conținut social media — planificare postări multi-platforma
- **Postări Social** (`/social-posts`) — Listă postări social media — toate canalele, status, performanță
- **Story Manager** (`/story-manager`) — Manager stories Instagram/Facebook/TikTok — programare, stickere, CTA, analitice
- **Mesaje Social Media** (`/social-messages`) — Inbox unificat mesaje DM, comentarii, mențiuni de pe toate platformele sociale conectate
- **Comenzi Furnizori** (`/purchases`) — Listă comenzi furnizori (purchase orders) — draft, trimise, confirmate, recepționate, anulate. Tracking complet workflow PO. _Notă: Aici vezi TOATE comenzile către furnizori. Pentru o comandă nouă, folosește Smart Ordering (/smart-ordering) care propune AI-based pe baza stocului minim._
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
- **Conturi pe Tip Produs** (`/ai-product-types`) — Verifică și completează conturile contabile (701/707, 4426/4427, conform OMFP 1802) pe fiecare tip de produs, cu AI
- **Documentație API** (`/api-docs`) — Documentație API publice Symbai pentru integratori externi
- **Integrări Externe** (`/integrations`) — Hub integrări externe — listă conectate, status, configurare per categorie
- **Evenimente CRM** (`/events`) — Listă evenimente (rezervări tip eveniment cu coordonator, meniu, produse) — diferit de Facebook Events. Acces din CRM.
- **Abonamente** (`/subscriptions`) — Abonamentele clienților cu livrări recurente — KPI MRR/ARR/ARPU/churn/LTV, listă abonați cu filtre pe status (activ, trial, pauză, restant, anulat), pauză/reactivare/anulare, livrările și evenimentele de plată ale fiecărui abonament. Pentru abonamentul tău la platforma Symbai vezi Setări → Module & Facturare sau portalul Hub.
- **Recomandări Symbai** (`/symbai-recommendations`) — Recomandări AI pentru îmbunătățiri operaționale — pe baza datelor proprii (vânzări, stocuri, comenzi) plus benchmark industrie
## PAGINI ADIȚIONALE (2)

- **Zone Livrare** (`/deliveries/zones`) — Zonele de livrare pe hartă, per locație — desen liber sau localități cu contur automat, taxă de livrare, valoare minimă comandă, prag de livrare gratuită, ore limită și capacitate maximă pe zi
- **Flotă Livrări** (`/deliveries/fleet`) — Flota proprie — vehicule (tip, capacitate, status), livratori (bifezi nominal cine e livrator), schimburi cu km la plecare/sosire și livratori activi cu poziție live
- **Dispecerat Livrări** (`/deliveries/dispatch`) — Ecranul operatorului pentru livrările cu flotă proprie — kanban pe statusuri plus hartă cu comenzi și livratori, asignare manuală, drag-and-drop pe livrator sau sugestie automată după zonă/distanță/capacitate
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
- **Poze Bulk Meniu** (`/menu/pricing/bulk-photos`) — Urci multe poze deodată (drag and drop) și AI sugerează automat produsul potrivit din meniu pentru fiecare poză; tu confirmi sau schimbi
- **Mese Servite** (`/finance/served-meals`) — Registrul meselor servite — vânzări la preț fix fără rețetă cunoscută (meniu de eveniment); statusuri Ciornă / Cost de stabilit / Cost stabilit, costul se leagă ulterior printr-o fișă de ieșire de tip consum sau din evenimentul asociat
- **Raport Beneficii Personal** (`/reports/staff-benefits`) — Ce au consumat angajații pe beneficii (mâncare/băutură personal) — grupat pe angajat, regulă, produs sau zi, cu export CSV
- **Reparații Date** (`/settings/repair`) — Unelte 1-click de igienizare a datelor, sigure și cu previzualizare înainte de aplicare — reconciliere comenzi, curățare produse fantomă, unificare categorii duplicate, legarea rețetelor de produse, corectare unități de măsură neconvertibile și conturi greșite
- **Setări P&L** (`/settings/pnl-categories`) — Categoriile raportului de profit și pierdere — template-uri pe industrie (creează seturi întregi de KPI cu un click), categorii pe secțiuni (Venituri, COGS, Personal, OPEX), grupări de venituri, definițiile și pragurile KPI-urilor
- **Beneficii Personal (setări)** (`/settings/staff-benefits`) — Regulile de mâncare/băutură pentru angajați — cine primește, la ce produse, ce valoare (gratuit, reducere procent, sumă fixă, preț special sau buget zilnic/săptămânal/lunar), aplicatori separați de beneficiari și buget per angajat
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
