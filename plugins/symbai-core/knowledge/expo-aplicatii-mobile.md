# Aplicațiile mobile Symbai: Symbai POS, Symbai Portal, Symbai Staff

> Ghid pentru cele trei aplicații mobile native ale platformei — ce face fiecare, cine le folosește, unde se configurează și cum răspunzi la întrebările frecvente. Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`.

## Cele 3 aplicații

| Aplicație | Pentru cine | Ce face |
|---|---|---|
| **Symbai POS** | ospătari, bar, recepție | operarea meselor de pe telefon: plan de sală, comenzi, plăți la masă, notificări de bucătărie |
| **Symbai Portal** | clienții localului | meniu, comenzi, cont de client, activități/atracții din portal |
| **Symbai Staff** | angajați: livratori, agenți de teren, vânzări/CRM, sarcini, producție/fabrică, manageri | aplicația echipei: livrări, sarcini, recepție marfă, operare de fabrică cu scanare QR, pontaj self-service, HACCP, inventariere, cockpit de manager cu marketing |

În conversații și în orice text pentru utilizator folosește numele de produs: **Symbai POS**, **Symbai Portal**, **Symbai Staff** (sau „Aplicația Staff").

## Symbai POS — aplicația ospătarului (comportamente de știut)

Când utilizatorul întreabă de ecranul de mese de pe telefon, de „Acțiuni masă" sau de planul de sală mobil, pornește de aici:

- **Numele meselor**: aplicația afișează numele mesei curat peste tot (sală, comandă, notă). Pentru mese simple arată `Masa 7`; pe carduri compacte sau pe hartă arată `M7`; numele reale precum `Terasa VIP` rămân neschimbate. Nu sfătui utilizatorul să redenumească mesele ca să scape de un afișaj dublat gen „Masa Masa 7" — afișarea e tratată de aplicație.
- **Planul de sală pe telefon**: are pan/pinch, dublu-tap pentru zoom, butoane flotante `+ / zoom / −` și reîncadrare automată. Butonul din mijloc arată nivelul de zoom curent. Culorile cardurilor de masă arată situația: masa mea, masa altui ospătar, neatribuită, comandă QR care poate fi preluată, modificări netrimise (offline) și rezervare.
- **Paritate cu planul din POS web**: aplicația mobilă folosește exact același plan de sală (aceeași geometrie) și citește programarea activă + mesele pe unitatea selectată. Dacă utilizatorul spune că pe telefon vede altă sală sau mese din altă locație, verifică întâi unitatea activă, Program Salon (`/staff?tab=floor-schedule`) și `get_floor_config(section:"tables")` — nu există un „layout mobil separat".
- **Trimiterea comenzii**: butonul **Trimite** răspunde imediat (feedback tactil), blochează instant a doua apăsare și trimite doar produsele noi. După succes, ospătarul poate reveni la sală înainte ca listele să se reîmprospăteze — actualizarea continuă în fundal și NU înseamnă că produsele s-au pierdut. Pentru verificare reală folosește `get_order_timeline` / `jurnal_activitate`, nu doar impresia din ecran.
- **Cantități și clienți pe notă**: cantitățile fracționare (ex. `1.5`, `0.25`) se afișează curat în coș, la împărțirea notei și pe previzualizare. Când masa are mai mulți clienți/scaune, produsele se grupează pe client; cele fără client apar la **Comune masă**, cu subtotal pe grup.
- **Acțiuni masă**: cele 3 puncte din ecranul comenzii deschid o listă compactă (bottom sheet) cu: Printează Nota, Transfer, Preia Masa, Transferă Produse, Partajează, Mesaj Bucătărie, Împarte Nota, Masă Servită, Reprint Bon Fiscal, Retur, Casă, Discount, Beneficiu Personal, Client, Firmă.
- **Masă Servită**: e o opțiune pe masă. Explică simplu: pe bonul fiscal produsele se grupează ca „Masă servită" pe cote TVA; conținutul real al notei nu se schimbă.
- **Plata la masă**: dialogul de bacșiș apare imediat ce ospătarul apasă plata; trimiterea produselor rămase și verificarea sumei rulează în fundal. Dacă apasă „Continuă" spre metoda de plată înainte ca pregătirea să fie gata, aplicația așteaptă singură.
- **Plăți cu cardul (aplicație de plată pe același dispozitiv)**: dacă aplicația de plată a băncii/procesatorului întoarce „anulat" sau „eșuat", Symbai POS revine imediat la alegerea metodei de plată — nota rămâne de plată și se poate reîncerca fără blocaj. Doar la rezultat incert plata rămâne în verificare până confirmă serverul.
- **Notificări pentru personal**: notificarea de „preparat gata" de la bucătărie poate fi silențioasă (fără sunet), după setările ecranului de bucătărie. Dacă utilizatorul spune că sună deși a setat silențios, problema ține de notificările de personal/bucătărie, nu de campaniile de marketing push.
- **Temă Zi/Noapte per angajat**: din ecranul Operațiuni → Afișaje → Temă, fiecare angajat își alege Auto / Zi / Noapte — setarea e personală, nu globală (barul pe întuneric poate sta pe Noapte, terasa pe Zi).
- **Mod Performanță**: tot din Operațiuni → Afișaje — pentru telefoane mai slabe, reduce animațiile și efectele ca aplicația să rămână fluidă.
- **Limba aplicației**: selector de limbă direct pe ecranul de login — 24 de limbi în Symbai POS și Symbai Staff, 32 în Symbai Portal; util pentru angajații străini.
- **Închidere de zi de pe telefon**: închiderea zilei de casă, numărarea fizică a banilor și rapoartele X/Z se fac și din Symbai POS, ecranul „Închidere zi" — nu mai e nevoie de PC.

Pentru date și modificări reale de plan de sală folosește tool-urile dedicate (`get_floor_config`, `set_floor_table_geometry`, `arrange_tables_grid`, `move_tables_to_section`, `set_zone_routing` etc.) — aplicația mobilă doar reflectă ce vede ospătarul.

## Configurare în POS web: `/menu/platforms`

Aceeași pagină are DOUĂ configurări diferite — nu le confunda:

| Card / dialog | Pentru cine | Cum lucrezi |
|---|---|---|
| `Configurare Platformă Clienți` | clienții publici: portal, QR, meniu, comenzi, jocuri | skill `configureaza-portal`; tool-uri `get_portal_config`, `configure_portal_*`, `configure_portal_qr`, `spotlight_portal_tab` |
| `În Aplicație Staff` | angajați: livratori, agenți teren, CRM, sarcini, recepție, marfă, fabrică | din aplicație (dialogul de pe pagină); nu există tool de conexiune dedicat pentru acest dialog |

### Dialogul „În Aplicație Staff"

Configurează **previzualizarea** și profilul implicit pentru Symbai Staff: presetul implicit, densitatea afișării (ghidată sau compactă), sumarul explicativ pentru manager și ce funcții apar pe fiecare preset.

**Important — nu confunda cu permisiunile reale:** comutatoarele din acest dialog NU dau acces angajatului. Accesul real vine din rolurile din Personal (`/staff?tab=roles`) — permisiuni precum CRM, condus/livrări, vizualizare și actualizare statusuri de livrare, sarcini, recepție marfă, ecran bucătărie, rezervări, rapoarte de vânzări.

Preseturi disponibile:

| Preset | Ce arată |
|---|---|
| 1. Angajat simplu | sarcini proprii, fără CRM/stoc |
| 2. Operare marfă / bucătărie | sarcini, preluare marfă, bucătărie/producție |
| 3. Recepție + marfă | recepție, rezervări, mesaje, preluare marfă |
| 4. Livrator simplu | livrări, statusuri, rapoarte; CRM ascuns |
| 5. Livrator cu vânzări | livrări + CRM + mesaje + apeluri + rapoarte |
| 6. Vânzări / CRM în locație | CRM locație, apeluri, mesaje, rapoarte |
| 7. Vânzări / CRM cu vizite | CRM teren, traseu zilnic, check-in și vizite |

Previzualizarea de livrator din dialog e clickabilă — explic-o ca pe o simulare realistă: `Traseu`, `Sună`, `Problemă`, `Pornesc cursa`, `Am ajuns`, `Poză`, `Încasez`, `Marchez livrată`. Pentru „Livrator simplu", aplicația e centrată pe livrări: primul tab e `Livrări`, iar CRM-ul nu apare.

## Symbai Staff — ce vede angajatul în aplicație

Ce apare în aplicație depinde de profilul rezolvat din rol + funcțiile activate:

- **Sarcini**: sarcinile reale se gestionează prin tool-uri sau din POS web (vezi skill-ul `gestioneaza-sarcini`) și se verifică prin `get_my_tasks`. Nu promite un ecran separat de sarcini în aplicație dacă nu îl vezi în versiunea curentă.
- **Fabrică**: rolurile cu producție văd tabul **Fabrică** cu subtaburi **Azi**, **Scan**, **QC**, **Etichete**, **Rețete**. Din lista de operații se pot porni/finaliza operații și marca QC OK/blocat; scanarea unui cod QR arată containerul/lotul și poate porni următoarea operație sau printa eticheta containerului scanat.
- **Etichete de producție**: tabul **Etichete** alege o imprimantă activă și printează eticheta pentru ultimul container scanat sau pentru containerele din operațiile zilei. Nu promite funcții (ex. creare container nou) pe care nu le vezi în aplicație.
- **Scanare QR**: operatorul folosește tabul **Scan** din Symbai Staff sau scannerul web. Pentru detalii bogate și verificare, asistentul folosește `exec_scan_container` / `exec_get_container_info`.
- **Pontaj self-service**: ecranul **Pontaj** — intrare/ieșire cu GPS (opțional selfie), pauze cu motiv; managerul vede prezența în `/staff` → tab „Pontaje (prezență)". Detalii în `personal-hr.md`.
- **HACCP pe mobil**: temperaturile (frigidere/congelatoare) și sarcinile HACCP (curățenie, verificări) se pot loga direct din aplicație — nu mai e nevoie de PC în bucătărie.
- **Inventariere**: numărarea fizică de stoc (inventarierea) se poate face din Symbai Staff, direct din depozit, cu telefonul.
- **Cockpit Manager + Marketing**: managerii au un cockpit dedicat în aplicație, iar tabul **Marketing** permite postarea pe rețelele sociale direct de pe telefon.

Explică simplu: prin conexiune poți citi/scrie datele de producție și sarcini, dar acțiunile fizice de teren (camera, printarea etichetei, operația la utilaj) se fac în **Symbai Staff** sau în scannerul web, nu din chat.

## Notificări push

- Notificările către personal (comenzi, bucătărie) sunt **tranzacționale**, nu campanii de marketing: NU folosi `preview_push_audience` / `send_push_campaign` pentru ele. Dacă un angajat nu primește notificări, verifică dacă s-a logat în aplicație și a acceptat notificările pe telefon.
- Notificarea de „preparat gata" poate fi silențioasă după setările ecranului de bucătărie — vezi secțiunea Symbai POS de mai sus.
- În POS-ul din browser (PWA), notificările depind de permisiunea browserului; la probleme de tip „nu sună" / „nu apare în fundal" / „apăs pe notificare și nu se deschide", verifică permisiunea de notificări a browserului și că aplicația web e instalată/deschisă — nu campaniile push.

## Branding

- Aplicațiile folosesc identitatea Symbai (logo-ul cu **S**, culorile albastre Symbai) și numele `Symbai POS`, `Symbai Portal`, `Symbai Staff`.
- Dacă firma are logo propriu, acesta apare ca logo de locație/brand în interiorul aplicației; icoana și ecranul de pornire ale aplicației rămân Symbai.

## Unde trimiți utilizatorul în POS web

- Configurarea platformei clienților: `/menu/platforms` (sau alias `/portal-config`), cardul `Configurare Platformă Clienți`, skill `configureaza-portal`.
- Configurarea Aplicației Staff: `/menu/platforms`, cardul `În Aplicație Staff`.
- Roluri și permisiuni reale pentru angajați: `/staff?tab=roles`.
- Integrări de plăți cu cardul: `/settings?tab=integrations`.
- Serverul local al restaurantului: `/settings?tab=edge-server`.
- Imprimante / case de marcat: `/settings?tab=printers`.
