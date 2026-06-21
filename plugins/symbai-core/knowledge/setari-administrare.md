# Setări & Administrare

> Pentru link-ul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul acoperă tot ce ține de configurarea și administrarea afacerii în Symbai: pagina Setări (firmă, branduri, locații, TVA, metode de plată, imprimante, server local), utilizatori cu roluri și permisiuni, abonamentul și modulele facturate prin Symbai Hub, integrările externe (Viva, ANAF, contabilitate, delivery), jurnalul de activitate (cine a făcut ce) și onboarding-ul ghidat în 29 de pași. Tot aici intră portalul Hub al clientului — contul, abonamentul și accesul AI extern prin token.

## Concepte

- **Brand** și **Locație** — un brand (identitate comercială) poate funcționa în mai multe locații fizice; selectorul global brand+locație din antet filtrează aproape toate paginile. La o singură locație, selectorul e ascuns.
- **RBAC (roluri & permisiuni)** — fiecare angajat are un rol; o pagină e vizibilă doar dacă rolul are una din permisiunile cerute. Adminul (permisiunea „toate") vede tot. Navigarea directă către o pagină nepermisă te redirecționează la „Sarcinile mele". Rolurile se administrează în modulul Personal (/staff), nu în Setări.
- **Symbai Hub** — platforma centrală Symbai: contul clientului, abonamentul, modulele facturate, update-urile și suportul. Instanța POS e conectată la Hub și trimite periodic un „heartbeat". Sursa adevărului pentru module și facturare e Hub-ul.
- **Domenii de activitate** — profilul afacerii (restaurant, cafenea/bar, hotel, sală evenimente, fabrică, magazin etc.) decide ce module și pagini apar în meniu. Hub-ul poate bloca schimbarea domeniului.
- **Pagini ascunse per client** — administratorul platformei (Hub) poate ascunde complet anumite pagini sau bloca anumite setări (ex. configurația Viva, domeniul de activitate) pentru un client.
- **Token Acces AI (MCP)** — token de forma `symbai_mcp_*` generat din portalul Hub, secțiunea „Acces AI (Claude Code)"; permite unui asistent AI extern să citească datele POS și, opțional, să scrie pe module alese. Tokenul se afișează o singură dată la creare.
- **Secrete prin MCP** — conexiunea AI citește date operaționale, nu parole în clar. Tool-urile ascund credentiale ca SMTP, router/UniFi, OAuth/API, tokenuri de portal sau hash-uri; pentru probleme de conectare verifici statusul și trimiți utilizatorul la pagina de reconfigurare/regenerare.
- **Jurnal de activitate (audit)** — acțiunile importante (anulări, aprobări, discounturi, modificări de prețuri/setări, plăți) se înregistrează automat cu cine/ce/când și diferențele vechi→nou.
- **Seat CRM** — accesul la paginile Sales CRM e nominal, per utilizator: angajatul trebuie nominalizat manual în Setări Sales CRM, tab „Useri CRM". Regula se aplică și adminului; un seat se taxează separat prin Hub.

## Paginile modulului

### Setări principale
- **Setări** (`/settings`) — pagina centrală, cu meniu lateral pe secțiuni: **Companie** (Date companie — profil organizație, CUI, județ pentru e-Factura, domenii de activitate; Branduri — creare/editare branduri și locații, asociere brand↔locație, casă de marcat prestabilită per locație; Grupuri clienți — doar la multi-brand/multi-locație), **POS** (POS & Bonuri — cu tab-urile „Bonuri & Imprimare", „Taxe & Financiar" unde definești **cotele TVA** și **metodele de plată** cu vizibilitate per unitate, „Flux Operațional"; Rutare taguri; Design notă), **Personal** (Beneficii personal), **Hardware** (Edge Server — moduri de rețea DNS, rol PC-uri, „Fă server"; Imprimante — cu test și istoric joburi; Dispozitive), **Stocuri** (Inventar, Unități de măsură, Comenzi furnizori, Câmpuri produs per brand), **Marketing** (Email marketing), **Contabilitate**, **Asistent AI** (Skills), **Tehnic** (Symbai Hub, Module & Facturare, Integrări & API, Domenii, MQTT, Procesări Periodice, Reparații) și **Sistem** (Comunicări platformă, Securitate & Control Acces — vizualizare roluri/permisiuni, reguli parole, loguri de acces; Localizare).
  - Tab **Symbai Hub**: starea conexiunii la Hub, heartbeat, schimbarea tokenului Hub, statusul instanței (companie, plan, versiune), abonament (preț RON, ciclu, următoarea facturare) și test conexiuni Symbai Supplier/Accounting.
  - Tab **Module & Facturare**: modulele active sincronizate cu Hub (modificările din Hub apar aici în maxim 60 de secunde), cost lunar curent în €, calcul prorat pe zile active, trimiterea cererilor de activare/dezactivare către Hub și limitele de servicii impuse de admin Hub (cu bare actual/limită).
  - Tab **Integrări & API**: Viva Wallet (mod ISV recomandat sau Merchant direct, Tap on Phone, Terminal App, terminale dedicate ex. PAX — poate fi blocat de adminul Hub), ANAF e-Factura & e-Transport (conectare SPV cu certificat, mediu test/producție, verificare automată status facturi, import facturi primite din SPV), OpenAI (cheie proprie opțională + nivele AI), contabilitate (Saga/SmartBill), platforme delivery (Glovo/Tazz/Bolt Food), Global Payments și Cvent.
- **Setări P&L** (`/settings/pnl-categories`) — categoriile raportului de profit & pierdere: template-uri pe industrie, categorii pe secțiuni (Venituri, COGS, Personal, OPEX pe tipuri, Taxe/TVA), grupări de venituri și mod avansat.
- **Procesări Periodice** (`/settings/cron-jobs`) — lista proceselor automate recurente: interval/oră programată, ultima și următoarea rulare, durată, ultimul rezultat și buton „Rulează" manual.
- **Reparații** (`/settings/repair`) — unelte 1-click de igienizare a datelor, sigure și repetabile, toate cu scanare/previzualizare înainte de aplicare: reconciliere comenzi (total ≠ produse / plată), curățare „produse fantomă" din transferuri (cloud + edge; plățile Viva confirmate pe cloud sunt protejate), Sync 100% cloud↔edge, unificare categorii de meniu duplicate, legarea rețetelor de produse (pentru alergeni), corectare rețete cu unități neconvertibile (g/kg ↔ buc, cu gramaj dedus automat din numele produsului), corectare conturi greșite pe produse non-stocabile (P&L), corectare valori contabile umflate la penalități/abonamente, legarea regulilor de rutare bucătărie/bar la locația lor, curățare rețete orfane și reconcilierea legăturii rețetă↔produs.
- **Sales CRM** (`/settings/sales-crm`) — configurarea CRM-ului de vânzări în 6 tab-uri: General (preset pe tip de business), Pipelines, Tipuri rezervări, Vizibilitate (ce tab-uri și funcții apar în Sales CRM), Configurare prezentare și Useri CRM (nominalizarea seat-urilor). Absoarbe vechile pagini de pipelines, tipuri rezervări și template-uri de petreceri (redirectează aici).
- **Marketing & Engagement** (`/settings/marketing`) — URL-urile publice de review (Google, TripAdvisor, Facebook) și configurarea WiFi-ului de marketing prin serverul local (funcționează complet doar dacă edge-ul e centrală DNS — setezi DNS-ul primar al routerului pe IP-ul edge-ului).
- **Contexte QR dinamice** (`/settings/qr-contexts`) — contexte pentru codurile QR (Terasă, Piscină, Cameră hotel, Eveniment privat etc.): cheie URL, nume, imagine, culoare, masă implicită; pornești rapid de la preset-uri.
- **A/B teste oferte** (`/settings/ab-tests`) — teste A/B pe oferte către clienți: variante (discount %, sumă fixă, produs gratuit, puncte, voucher), metrică de câștig, sample size minim per variantă, segment de audiență.
- **Câmpuri personalizate** (`/settings/custom-fields`) — câmpuri suplimentare pe deals, contacte, proiecte etc.: cheie tehnică, etichetă, tip (inclusiv listă cu opțiuni), obligatoriu sau nu.
- **Traduceri** (`/translations`, și `/settings/translations`) — traduceri pe entități cu progres per limbă, limbi active, valute cu sincronizare cursuri ECB/BNR sau curs manual și reguli de taxe pe țară (OSS).
- **Documentație API** (`/api-docs`) — documentația tehnică a conexiunii cu Symbai Hub și Symbai Accounting (heartbeat, raportare zilnică, chei de legătură, rezolvare conflicte); se deschide în tab separat.

### Administrare & monitorizare
- **Loguri Activitate** (`/audit-logs`) — jurnalul complet de audit: cine a făcut ce și când, cu detalii și diferențe. Filtre pe text (acțiune, angajat, produs, masă), categorie (POS & Comenzi, Inventar & Stoc, Producție, Finanțe, Setări, Personal, Meniu & Produse, Clienți, Sistem), angajat, masă și perioadă (Azi/Ieri/Săptămâna trecută/Luna trecută sau interval). Cere permisiunea de setări sau permisiunea dedicată de vizualizare audit.
- **Integrations Hub** (`/integrations`, alias `/hotel/integrations`) — tablou unic cu toate integrările pe carduri, grupate pe categorii (Distribuție OTA — Booking/Expedia/Airbnb etc., Metasearch/GDS, Plăți, Fiscal/ANAF, Hardware, Contabilitate/ERP, Review management ș.a.): status (Connected/Error/Paused), ultima sincronizare, erori 24h, cozi în așteptare/eșuate, test de conectare, pauză/repornire și editare credențiale (criptate, nu se afișează în clar). Are propriul audit log cu ultimele acțiuni. Se alege întâi unitatea (brand + locație).
- **Observabilitate** (`/observability`) — stare tehnică a sistemului: monitorizarea erorilor, sănătatea integrărilor (rată de eroare, ultimul succes/ultima eroare) și fiabilitatea pe cele mai folosite rute. Pagină accesibilă direct prin URL (nu apare în meniu).
- **Setări Hotel** (`/hotel/property-settings`) — apare doar cu modulul Hotel activ: proprietățile (nume, tip, stele, camere, monedă) cu tab-uri Identitate, Operațional (check-in/out, suplimente early/late, overbooking %, limită room charge POS), Guest Service, Recovery Email, Upsells, Politici Anulare și Website Booking.

### Onboarding ghidat (29 pași + Bun venit)
Pașii din meniu se **renumerotează automat** după profilul afacerii (la un restaurant fără hotel vezi alți pași decât la o fabrică); orice pas poate fi sărit, fiecare are ghid și asistent AI propriu, iar tururile ghidate te plimbă prin paginile reale și revin în onboarding.
- **Bun venit** (`/onboarding/welcome`) — prezentarea lui Sym (acțiuni prin conversație, ghidare în platformă, import Excel/CSV, agenți specializați) + pornirea turului.
- **1. Firma & Brand** (`/onboarding/step/1`) — date firmă (CUI cu preluare automată de la ANAF), branduri și locații. · **2. Import Date** (`/onboarding/step/2`) — import produse/date din Excel/PDF. · **3. Verificare** (`/onboarding/step/3`) — „health check" al datelor + reparații rapide. · **4. Gestiune & Stocuri** (`/onboarding/step/4`) — ghid gestiuni și zone de depozitare. · **5. Creare Meniu** (`/onboarding/step/5`) — meniuri și prețuri de vânzare. · **6. Etichete** (`/onboarding/step/6`) — taguri pentru rutare și grupare. · **7. Instalare PC** (`/onboarding/step/7`) — instalarea serverului local pe un PC din locație. · **8. Imprimante & KDS** (`/onboarding/step/8`) — wizard imprimante și ecrane de bucătărie. · **9. Metode Plata** (`/onboarding/step/9`). · **10. Configurare Sala** (`/onboarding/step/10`) — zone și mese. · **11. QR & Platforme** (`/onboarding/step/11`) — QR pe mese. · **12. Personal & Ture** (`/onboarding/step/12`). · **13. Rezervari** (`/onboarding/step/13`). · **14. Retetar** (`/onboarding/step/14`). · **15. DSV Chef** (`/onboarding/step/15`) — asistentul pentru cerințele sanitar-veterinare. · **16. Finante** (`/onboarding/step/16`). · **17. Legal** (`/onboarding/step/17`). · **18. Social Media** (`/onboarding/step/18`). · **19. Email Marketing** (`/onboarding/step/19`). · **20. Integrari** (`/onboarding/step/20`). · **21. Automatizari** (`/onboarding/step/21`). · **22. Staff AI** (`/onboarding/step/22`) — agenți AI pentru echipă. · **23. Sales CRM** (`/onboarding/step/23`). · **24. Sales AI** (`/onboarding/step/24`) — agenți AI de vânzări. · **25. Website** (`/onboarding/step/25`). · **26. Portal Clienti** (`/onboarding/step/26`). · **27. Chat Portal** (`/onboarding/step/27`). · **28. Meniu Fizic** (`/onboarding/step/28`) — design de meniu tipăribil. · **29. Platforme** (`/onboarding/step/29`) — platforme de livrare.

## Fluxuri frecvente

1. **Adaugi o locație nouă** — Setări → Branduri → „Adaugă Locație" (nume, adresă, telefon, casă de marcat prestabilită), apoi asociezi locația la brandul potrivit din aceeași pagină.
2. **Adaugi o cotă TVA sau o metodă de plată** — Setări → POS & Bonuri → tab „Taxe & Financiar": creezi/editezi cote TVA și metode de plată; la metoda de plată poți alege pe ce unități (brand+locație) e activă.
3. **Dai acces unui angajat la o pagină** — rolurile și permisiunile se editează în Personal → Roluri (modulul /staff); în Setări → Securitate doar vizualizezi ce permisiuni are fiecare rol. Dacă angajatul tot nu vede pagina, verifică dacă pagina nu e ascunsă de Hub sau de domeniul de activitate.
4. **Conectezi ANAF e-Factura** — întâi completezi CUI-ul și datele firmei (CUI vine din Hub), apoi Setări → Integrări & API → „ANAF e-Factura & e-Transport" → Conectare ANAF cu certificatul/USB token-ul; alegi mediul (Test/Producție) și activezi verificarea automată a statusului facturilor.
5. **Configurezi plățile cu cardul Viva** — Setări → Integrări & API → „Viva Wallet": alegi modul ISV (recomandat; comisionul și credențialele pot fi setate de adminul Hub) sau Merchant direct (Merchant ID + cheie), opțional Tap on Phone pentru plata pe telefonul ospătarului.
6. **Activezi/dezactivezi un modul plătit** — Setări → Module & Facturare: comuți modulul și trimiți cererea către Symbai Hub; costul lunar și calculul prorat se văd pe loc, dar sursa adevărului rămâne Hub-ul.
7. **Dai acces AI extern (Claude) la datele tale** — intri în portalul Hub (hub.symbai.app), secțiunea „Acces AI (Claude Code)", generezi un token cu permisiunile dorite (citire mereu, scriere pe module alese, opțional SQL doar-citire); copiezi tokenul imediat — se afișează o singură dată. Revocarea din portal taie accesul în cel mult un minut.
8. **Afli cine a modificat ceva** — Loguri Activitate (/audit-logs): cauți după angajat/masă/produs, filtrezi pe categorie și perioadă, deschizi intrarea pentru detalii și diferențele vechi→nou. Prin AI, același jurnal se citește cu tool-ul `jurnal_activitate`.
9. **Repari date stricate** — Setări → Reparații: alegi unealta potrivită, apeși „Scanează"/„Previzualizează", verifici lista găsită (poți exclude rânduri), apoi aplici. Toate uneltele sunt sigure și pot fi rulate oricând.

## Tool-uri MCP utile

**Citire (fără permisiune de modul):**
- `list_brands`, `list_locations` — inventarul brandurilor și locațiilor; de rulat primele în orice sesiune. Sunt sigure pentru context: arată date operaționale, nu parole SMTP sau credentiale router/UniFi.
- `list_vat_rates` — cotele TVA configurate.
- `list_printers` — imprimantele per locație.
- `list_entities` — listează rapid orice tip de entitate, inclusiv roluri și angajați.
- `get_config_status` — ce e configurat și ce lipsește, pe categorii.
- `lookup_company_cui` — caută firma la ANAF după CUI și salvează automat datele în setări.
- `jurnal_activitate` — jurnalul de audit: cine a făcut ce și când, cu filtre pe categorie/angajat/masă/perioadă.
- `explain_feature` — explică o funcționalitate Symbai.
- `gaseste_in_aplicatie` — găsește pagina potrivită + link direct.

**Scriere (cer modul de permisiune pe token):**
- modul `setari`: `create_brand` / `update_brand`, `create_location` / `update_location`, `link_brand_location` / `unlink_brand_location`, `update_company` (date fiscale manuale), `create_payment_method`, `create_printer`, `create_kds_screen`, `configure_pos_settings`, `create_notification_rule`.
- modul `personal`: `create_role`, `update_role`, `set_role_permissions`, `seed_default_roles` (set de roluri prestabilite pe tip de business).
- modul `produse_meniu`: `create_vat_rate` (cotă TVA nouă), `auto_assign_vat_batch` (clasificare TVA automată cu AI).

**SQL (toggle separat pe token, doar-citire):** `list_database_tables` → `describe_database_table` → `execute_sql_query`.

## Întrebări frecvente și capcane

- **De ce nu văd o pagină în meniu?** Trei cauze posibile, în ordine: rolul tău nu are permisiunea cerută, pagina nu e relevantă pentru domeniul de activitate al brandului, sau adminul platformei (Hub) a ascuns-o pentru contul tău. Navigarea directă pe URL fără permisiune redirecționează la „Sarcinile mele".
- **De ce nu pot edita CUI-ul?** CUI-ul se setează doar prin Symbai Hub; câmpul din Setări → Date companie e blocat intenționat.
- **De ce nu pot schimba domeniul de activitate sau setările Viva?** Pot fi blocate de adminul Symbai Hub — vezi lacătul afișat lângă secțiune.
- **Unde administrez utilizatorii și rolurile?** În modulul Personal (/staff), nu în Setări. Setări → Securitate doar afișează rolurile și permisiunile, fără editare.
- **Am activat un modul dar nu se vede / costul nu s-a schimbat.** Module & Facturare se sincronizează cu Hub-ul; modificările din Hub apar în POS în maxim 60 de secunde, iar Hub-ul e sursa adevărului. Folosește „Reîmprospătează din Hub".
- **De ce un angajat (chiar admin) nu vede Sales CRM?** Paginile CRM cer un „seat" nominal — nominalizezi persoana în Setări Sales CRM → tab „Useri CRM". Regula se aplică inclusiv adminului, pentru că seat-urile se taxează separat.
- **De ce nu văd selectorul de brand/locație?** La o singură locație activă, selectorul global e ascuns automat.
- **Am pierdut tokenul de Acces AI.** Tokenul se afișează o singură dată la creare; dacă l-ai pierdut, revoci tokenul vechi din portalul Hub și generezi unul nou.
- **E periculos să rulez Reparațiile?** Nu — uneltele sunt gândite să fie sigure și repetabile, totul are previzualizare înainte de aplicare, iar la curățarea „produselor fantomă" plățile Viva confirmate pe cloud sunt protejate.
- **De ce pașii de onboarding au alte numere la mine?** Pașii vizibili depind de profilul afacerii (domeniile de activitate) și se renumerotează automat; pașii pot fi și săriți.

## Pentru acces SQL

Tabele relevante: `audit_logs` (jurnal de activitate — orice apel AI extern e logat și el aici), `brands`, `locations`, `vat_rates`, `payment_methods`.
Întrebări exemplu: „ce setări a modificat cineva ieri?" → `audit_logs` filtrat pe categoria SETTINGS și interval; „ce metode de plată sunt active?" → `payment_methods`; „ce cote TVA există și care e implicită?" → `vat_rates`.
