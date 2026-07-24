---
name: configureaza-aplicatie-staff
description: Configurează și explică Aplicația Staff / Symbai Staff din POS web: cardul „În Aplicație Staff" de pe /menu/platforms, profiluri pentru livratori, agenți teren, CRM, task-uri, preluare marfă, producție/fabrică, containere QR, preview telefon cu butoane clickabile și legătura cu rolurile reale din Personal. Folosește la „configurează Aplicație Staff", „Symbai Staff", „expo-sales", „ce vede livratorul", „ce vede operatorul de fabrică", „container QR pe mobil", „preview livrator", „ascunde CRM pentru livratori", „agent teren în aplicația staff", „rol pentru previzualizare", „profil livrator cu vânzări", „aplicația angajaților".
---

# Configurează Aplicația Staff

Userul vrea să configureze sau să înțeleagă **Symbai Staff**: aplicația angajaților pentru livratori, agenți de teren, CRM/vânzări, task-uri, recepție, operare marfă și producție/fabrică cu containere QR. Configurarea se face în POS web pe **/menu/platforms**, prin cardul **„În Aplicație Staff"**.

Nu confunda:
- **Platforma Clienți / Portalul clienților** = ce vede clientul public → skill `configureaza-portal`, tool-uri `configure_portal_*`.
- **În Aplicație Staff / Symbai Staff** = ce vede angajatul în aplicația staff, profiluri și preview → acest skill.
- **Aplicația mobilă în sine** (cea instalată pe telefonul angajatului) se actualizează ca orice aplicație de telefon — nu se modifică din acest dialog.

## Înainte de orice

1. Citește `knowledge/expo-aplicatii-mobile.md` pentru cum funcționează aplicația mobilă Symbai Staff.
2. Pentru roluri și permisiuni reale citește `knowledge/personal-hr.md`.
3. Pentru livratori și dispecerat citește `knowledge/livrari-comenzi-online.md`.
4. Pentru agenți de vânzări / CRM teren citește `knowledge/crm-vanzari-pipeline.md`.
5. Pentru producție/fabrică, containere QR și predări între stații citește `knowledge/productie-fabrica.md`.
6. Pentru navigare și screenshot citește `knowledge/condu-chrome.md`.

## Ce configurează dialogul

Dialogul **„În Aplicație Staff"** configurează prezentarea reală a aplicației angajaților, separat pentru fiecare rol:
- **profilul de lucru** al rolului (livrator, depozit, producție, HACCP, QC, manager etc.);
- **funcțiile de prezentare** per rol;
- **primul tab** deschis după login;
- **ordinea taburilor** autorizate;
- **densitatea**, hinturile pentru manager și profilul implicit din preview.

Important: această configurare **nu schimbă permisiunile rolului**. Permisiunile din **Personal → Roluri** (`/staff?tab=roles`) rămân limita de siguranță: un tab sau o funcție neautorizată este eliminată chiar dacă a fost cerută în prezentare. Configurarea decide ce apare prima dată și cum este organizată munca deja permisă.

## Catalogul profilurilor

Nu porni de la un tabel vechi sau de la un număr fix de preseturi. `get_staff_app_config.availableProfiles` este catalogul live și sursa de adevăr pentru versiunea instalată. Familiile curente sunt:

- lucru general: `tasks_basic`;
- stoc și ospitalitate: `stock_kitchen`, `warehouse_logistics`, `kitchen_staff`, `reception_stock`;
- livrare și expediție: `driver_basic`, `driver_sales`, `b2b_dispatcher`, `b2b_picker`, `b2b_loader`;
- fabrică: `factory_planner`, `factory_operator`, `factory_haccp`, `factory_qc`, `factory_quality_manager`, `factory_shift_lead`, `factory_production_manager`, `factory_executive`, `factory_maintenance`, `factory_engineer`;
- administrativ și comercial: `staff_hr`, `accounting_finance`, `sales_location`, `sales_field`.

Funcțiile configurabile curente acoperă: sarcini, recepție marfă, manipulare depozit, bucătărie/KDS, recepție hotel, reaprovizionare camere, livrări, vânzare pe livrare, dispecerat/picking/încărcare B2B, CRM, vizite teren, execuție și planificare fabrică, QC, etichete, mentenanță, HACCP, HR, financiar, mesaje, rapoarte și apeluri. Folosește cheile și descrierile din `availableFeatures`, returnate live; permisiunile rolului elimină automat orice funcție neautorizată.

## Ce vede efectiv angajatul în aplicație

- **Sarcini**: aplicația are ecran/tab propriu pentru sarcinile angajatului (`tasks` / „Azi/Sarcini”), cu prioritate, termen și dovada cerută. Pentru creare, atribuire și verificare folosește skill-ul `gestioneaza-sarcini`, apoi confirmă prin `get_my_tasks`.
- **Fabrică**: tabul **Fabrică** are subtaburi **Azi**, **Scan**, **QC**, **Etichete**, **Rețete**. Din lista de operații operatorul poate porni/finaliza operații și marca QC OK/blocat; scanarea QR returnează container/lot/șarjă și poate porni următoarea operație sau printa eticheta containerului scanat.
- **Etichete producție**: operatorul alege o imprimantă activă și printează eticheta pentru ultimul container scanat sau pentru containerele vizibile din operațiile zilei. Nu promite crearea unui container nou dacă nu vezi butonul în aplicație.
- **Container / QR**: nu trimite userul la linkuri directe de container. Pentru detalii/verificare, tu folosești `exec_scan_container` / `exec_get_container_info`; pentru acțiunea fizică operatorul scanează în tabul **Scan** din aplicație sau în scannerul web.
- **Pontaj**: ecranul **Pontaj** din Symbai Staff — pontare self-service cu GPS (opțional selfie) și pauze cu motiv; managerul vede prezența în `/staff` → tab „Pontaje (prezență)".
- **HACCP pe mobil**: temperaturile și sarcinile HACCP se pot loga direct din aplicație — nu-i spune userului că HACCP e doar pe web.
- **Inventariere**: numărarea fizică de stoc (inventarierea) se poate face din Symbai Staff, direct din depozit.
- **Cockpit Manager + Marketing**: managerii au un cockpit dedicat în aplicație, iar tabul **Marketing** permite postarea pe rețelele sociale direct de pe telefon.
- **Limbă și aspect**: selector de limbă pe ecranul de login (24 de limbi în POS/Staff, 32 în Portal — util pentru angajați străini); tema Zi/Noapte per angajat (Auto/Zi/Noapte) și Modul Performanță pentru telefoane slabe se aleg din Symbai POS, ecranul Operațiuni → Afișaje.

⚠ Aceste ecrane EXISTĂ în versiunile curente — nu sugera că lipsesc; dacă userul nu le vede, cel mai probabil are aplicația neactualizată sau rolul fără permisiunile potrivite.

Important: acestea sunt acțiuni fizice în aplicația mobilă. Prin MCP poți crea/citi sarcini, producție, loturi, QC și predări, dar nu simulezi camera sau imprimanta din chat; trimite operatorul în Symbai Staff și verifică apoi prin citire.

**Regula PIN:** Symbai Staff este aplicația personală a angajatului. Dacă rolul și unitatea autorizează operația, nu cere PIN din nou la pornire/finalizare. PIN-ul per operație aparține stației partajate **Workstation Tablet**. Prima asociere a telefonului sau reasocierea după reset cere parola o singură dată; apoi telefonul de încredere lucrează fără PIN operațional.

## Preview-ul de telefon

Preview-ul e gândit ca un telefon real, în brandul Symbai. Butoanele sunt clickabile pentru simulare și îl ajută pe user să înțeleagă ce vede angajatul.

Pentru profilul **Livrator simplu**:
- primul tab este **Livrări**;
- apar **Sarcini** când rolul are `tasks_view`, plus **Pontaj** și **Mai mult**;
- CRM-ul este ascuns;
- vede tura activă, GPS live, numărul de comenzi active, ruta și cash-ul;
- vede următoarea oprire, coada de livrări și statusul comenzii;
- butoane de simulare: **Traseu**, **Sună**, **Problemă**, **Pornesc cursa**, **Am ajuns**, **Poză**, **Încasez**, **Marchez livrată**, **Reiau simularea**;
- „Marchez livrată" devine disponibil doar după dovada foto și încasarea cash în preview.

Pentru profiluri mixte:
- taburile se aleg din funcțiile active: Azi/Acasă, Fabrică, Livrări, Pipeline, Acțiuni, Mesaje, Mai mult;
- tabul **Azi/Sarcini** arată sarcinile proprii și dovada cerută;
- tabul **Fabrică** arată operațiile active, scanarea containerelor, QC/blocaje și etichetele QR;
- tabul **Livrări** are **Vezi ruta** și **Sună client**;
- tabul **Pipeline** arată lead-uri/deal-uri;
- tabul **Acțiuni** are apel rapid, check-in vizită, follow-up;
- tabul **Mesaje** arată WhatsApp/Portal/Intern;
- tabul **Mai mult** arată Profil, Rapoarte, Notificări.

## Denumiri corecte

Cu userul folosește numai denumirile oficiale: **Symbai Staff**, **Aplicație Staff**, **În Aplicație Staff**. „expo-sales" e doar un identificator tehnic de canal — nu-l folosi în conversația cu userul.

Dacă userul vede în aplicație un logo sau un nume vechi, cel mai probabil are o versiune veche a aplicației sau un cache vechi: recomandă-i să actualizeze aplicația Symbai Staff de pe telefon; dacă problema persistă, raportează cu `trimite_ticket_symbai`.

## Workflow

1. Identifică unitatea ca pereche **brand + locație**. Nu cere `warehouseId`: depozitul nu definește unitatea Staff.
2. Dacă nu este indicată unitatea, lasă selecția automată: singura unitate accesibilă sau, când sunt mai multe, prima pereche activă accesibilă în ordine deterministă.
3. Citește configurația live și rolurile reale cu `get_staff_app_config`.
4. Pentru fiecare rol verifică ocupația principală, `effectiveHome`, `effectiveTabs`, `audit`, `recommendation` și eventualele override-uri ignorate de RBAC. `setupSummary` spune direct ce roluri cer permisiuni și ce roluri cer doar reorganizare.
5. Dacă trebuie schimbate drepturile reale, folosește **Personal → Roluri** (`/staff?tab=roles`). Dacă trebuie doar organizată aplicația, păstrează permisiunile și configurează prezentarea Staff.
6. Pentru un rol obișnuit, preferă `configure_staff_app_role(roleId, applyRecommendedLayout:true, expectedConfigHash, confirm:false)`. Folosește `profileId/homeTab/tabOrder` manual numai când userul cere o organizare diferită și justificată.
7. Arată utilizatorului propunerea din preview și cere-i confirmarea explicită. Numai după acordul lui retrimite exact aceeași schimbare cu `confirm:true` și `expectedPreviewHash=proposedConfigHash`.
8. Recitește cu `get_staff_app_config` și confirmă hash-ul nou, primul tab, ordinea și lipsa ecranelor neautorizate.
9. Pentru mai multe roluri folosește `configure_staff_app_roles`. Cu `roleIds`, orice rol inexistent, inactiv, din alt brand sau imposibil de prezentat oprește întreaga operație. Fără `roleIds`, tool-ul analizează toate rolurile active ale unității, aplică atomic rolurile valide și raportează separat rolurile sărite: `reason:"permissions"` se repară în Personal, iar `reason:"presentation_conflict"` în override-urile platformei.
10. Pentru setările generale folosește analog `configure_staff_app_defaults`, tot în doi pași (preview, apoi confirmare).
11. Dacă lucrezi vizual, deschide **/menu/platforms** → **„În Aplicație Staff"**, verifică telefonul de preview și salvează. Pentru cameră, QR și imprimare, verificarea finală se face pe un telefon cu Symbai Staff.

## Ce se poate prin MCP

Există patru tool-uri dedicate:

- `get_staff_app_config(brandId?, locationId?)` — citește configurația, hash-ul optimist, `setupSummary`, rolurile, `availableProfiles`, `availableFeatures`, taburile autorizate, auditul și recomandarea fiecărui rol. Dacă unitatea lipsește, o selectează automat din aria actorului.
- `configure_staff_app_role(roleId, expectedConfigHash, ..., confirm)` — modifică numai prezentarea unui rol. `applyRecommendedLayout:true` deduce profilul, primul tab și ordinea din meserie + permisiuni; alternativ poți trimite manual `profileId`, `featureOverrides`, `homeTab`, `tabOrder` sau `resetRole`.
- `configure_staff_app_roles(roleIds?, expectedConfigHash, confirm)` — pregătește și aplică atomic prezentarea recomandată. Pentru o selecție explicită refuză tot lotul dacă un rol nu este valid; fără selecție aplică rolurile valide și raportează rolurile sărite. Nu schimbă permisiuni.
- `configure_staff_app_defaults(expectedConfigHash, ..., confirm)` — modifică `density`, `showManagerHints` și `defaultPreviewProfile` pentru unitate.

Scrierile cer `expectedConfigHash` din ultima citire. Cu `confirm:false` întorc `proposedConfigHash` fără salvare; confirmarea cere atât `confirm:true`, cât și `expectedPreviewHash=proposedConfigHash`, pentru exact aceeași unitate și propunere. Dacă oricare hash s-a schimbat, recitește și reaplică patch-ul. Pentru roluri reale și permisiuni folosește separat tool-urile de Personal.

Pentru orice acțiune reală de livrare (asignare șofer, status comandă, incident, flotă) folosește skill-ul `gestioneaza-livrari` și tool-urile de livrări. Dialogul **„În Aplicație Staff"** este preview/configurare de afișare, nu dispecerat operațional.

Pentru sarcini reale folosește skill-ul `gestioneaza-sarcini`. Pentru fabrici folosește `productie-flux` / `productie-fabrica`: prin MCP citești și scrii producția, dar acțiunile fizice pe containere (scanare cu camera, printare) se fac în Symbai Staff sau în scannerul web, apoi verifici prin `exec_scan_container` / `exec_get_container_info` / `exec_list_handovers`.

## Răspunsuri scurte utile

- „Ce vede livratorul?" → deschide „În Aplicație Staff", preset **Livrator simplu**, arată telefonul: Livrări, rută, sună, status, poză, încasare, marcare livrată.
- „Vreau livrator fără CRM" → profil `driver_basic`; verifică Livrări primul, Sarcini când are `tasks_view`, Pontaj și Mai mult, fără Pipeline sau Acțiuni comerciale.
- „Vreau livrator care poate vinde" → preset **Livrator cu vânzări**; are livrări + pipeline + mesaje + apeluri.
- „Ce vede operatorul de fabrică?" → profilul live `factory_operator`; arată spațiul Fabrică: operațiile zilei, Scan, QC, Etichete și Rețete.
- „Ce vede magazionerul?" → `stock_kitchen` pentru recepție/stoc de bază sau `warehouse_logistics` pentru recepție, amplasare, mutări, picking, încărcare și predare.
- „Ce vede bucătarul?" → `kitchen_staff`, cu sarcinile și comenzile KDS autorizate, fără ecrane de fabrică/depozit doar pentru că numele rolului conține „bucătar".
- „Vreau să printez eticheta unui container de pe telefon" → în Symbai Staff: Fabrică → Scan (scanează containerul) → Etichete → „Printează ultimul container scanat"; verifică apoi prin `exec_get_container_info`.
- „De ce nu vede agentul X CRM-ul?" → verifică rolul real în Personal și permisiunea de acces CRM; preview-ul nu acordă permisiuni.
- „De ce arată alt logo?" → versiune veche de aplicație sau cache — recomandă actualizarea aplicației; dacă persistă, trimite ticket.
