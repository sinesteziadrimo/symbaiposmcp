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

Dialogul **„În Aplicație Staff"** configurează o previzualizare și preferințe de afișare pentru aplicația angajaților:
- **profilul afișat implicit** în preview;
- **densitatea** — mod ghidat (cu explicații) sau compact;
- **hinturile pentru manager** — dacă preview-ul arată explicații;
- **ajustări mici de funcții** per profil (ce module apar).

Important: toggle-urile din „Ajustări mici" **nu schimbă permisiunile rolului**. Pentru acces real modifici rolurile în **Personal → Roluri** (`/staff?tab=roles`). Dialogul doar arată și ajustează modul în care se simplifică aplicația pentru profilul ales.

## Profiluri rapide

| Preset | Când îl alegi | Funcții principale | Permisiuni recomandate pe rolul real |
|---|---|---|---|
| 1. Angajat simplu | curățenie, ajutor, personal fără vânzări/stoc | Task-uri proprii | vede sarcinile proprii |
| 2. Operare marfă / bucătărie | recepție marfă, bucătărie, pregătiri, operator fabrică | Task-uri, Preluare marfă, Bucătărie/producție, Fabrică, containere QR | sarcini + recepție marfă + ecran bucătărie + permisiunile de producție ale rolului |
| 3. Recepție + marfă | front-desk, rezervări, preluare marfă | Task-uri, Recepție, Mesaje, Preluare marfă | sarcini + vedere rezervări + recepție marfă |
| 4. Livrator simplu | șofer/livrator care nu vede CRM | Livrări, Rapoarte | livrări (vedere + actualizare status) + condus flotă |
| 5. Livrator cu vânzări | livrator care poate crea lead/follow-up | Livrări, Vânzare pe livrare, CRM, Mesaje, Rapoarte, Apeluri | livrări + acces CRM + rapoarte de vânzări |
| 6. Vânzări / CRM în locație | agent în locație / call-center | CRM, Task-uri, Mesaje, Rapoarte, Apeluri | acces CRM + sarcini + rapoarte de vânzări |
| 7. Vânzări / CRM cu vizite | agent de teren cu traseu și check-in | CRM, Vizite clienți, Task-uri, Mesaje, Rapoarte, Apeluri | acces CRM + sarcini + rapoarte de vânzări |

Funcțiile care se pot porni/opri per profil: Sarcini, Preluare marfă, Bucătărie/producție, Recepție, Livrări, Vânzare pe livrare, CRM, Vizite clienți, Mesaje, Rapoarte, Apeluri.

## Ce vede efectiv angajatul în aplicație

- **Sarcini**: profilul poate avea funcția Sarcini pornită, dar aplicația nu are un ecran separat de sarcini către care să trimiți scurtături directe. Pentru sarcini reale folosește skill-ul `gestioneaza-sarcini` și verificarea prin `get_my_tasks`.
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

## Preview-ul de telefon

Preview-ul e gândit ca un telefon real, în brandul Symbai. Butoanele sunt clickabile pentru simulare și îl ajută pe user să înțeleagă ce vede angajatul.

Pentru profilul **Livrator simplu**:
- primul tab este **Livrări**;
- nu apare tabul **Mai mult**;
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

1. Află ce rol/profil vrea userul: livrator simplu, livrator cu vânzări, agent de teren, recepție, bucătărie/marfă sau angajat simplu.
2. Dacă cere permisiuni reale, deschide/folosește **Personal → Roluri** (`/staff?tab=roles`) și nu confunda cu preview-ul.
3. Navighează la **/menu/platforms** și deschide cardul **„În Aplicație Staff"**.
4. Selectează presetul sau un **rol real** din dropdown.
5. Ajustează **Mod compact**, **Hinturi manager** și funcțiile doar dacă userul cere sau profilul recomandat are nevoie.
6. Click pe taburile din telefonul de preview și, pentru livrator, rulează simularea: traseu → apel → status → poză/încasare → livrată.
7. Salvează cu **Salvează Aplicație Staff**.
8. Redeschide dialogul și verifică: profilul implicit, badge-urile de funcții, taburile și denumirile.
9. Dacă userul vrea dovadă vizuală, fă screenshot la dialog și la preview-ul de telefon. Pentru fluxurile reale (cameră, scanare QR, printare etichetă), testarea se face pe un telefon cu aplicația Symbai Staff instalată — preview-ul web e doar simulare.

## Ce se poate prin MCP

Dialogul „În Aplicație Staff" nu are tool dedicat de configurare prin conexiune — configurarea se face din pagină (tu poți conduce browserul prin extensia Chrome sau ghidezi userul pas cu pas). Pentru roluri reale și permisiuni folosește tool-urile de Personal dacă sunt disponibile pe conexiunea clientului; altfel ghidezi userul în `/staff?tab=roles`.

Pentru orice acțiune reală de livrare (asignare șofer, status comandă, incident, flotă) folosește skill-ul `gestioneaza-livrari` și tool-urile de livrări. Dialogul **„În Aplicație Staff"** este preview/configurare de afișare, nu dispecerat operațional.

Pentru sarcini reale folosește skill-ul `gestioneaza-sarcini`. Pentru fabrici folosește `productie-flux` / `productie-fabrica`: prin MCP citești și scrii producția, dar acțiunile fizice pe containere (scanare cu camera, printare) se fac în Symbai Staff sau în scannerul web, apoi verifici prin `exec_scan_container` / `exec_get_container_info` / `exec_list_handovers`.

## Răspunsuri scurte utile

- „Ce vede livratorul?" → deschide „În Aplicație Staff", preset **Livrator simplu**, arată telefonul: Livrări, rută, sună, status, poză, încasare, marcare livrată.
- „Vreau livrator fără CRM" → preset **Livrator simplu**; verifică să fie active doar Livrări/Rapoarte și să nu apară Pipeline/Acțiuni/Mai mult.
- „Vreau livrator care poate vinde" → preset **Livrator cu vânzări**; are livrări + pipeline + mesaje + apeluri.
- „Ce vede operatorul de fabrică?" → preset **Operare marfă / bucătărie** sau rol real cu producție; arată tabul Fabrică: Azi, Scan, QC, Etichete, Rețete.
- „Vreau să printez eticheta unui container de pe telefon" → în Symbai Staff: Fabrică → Scan (scanează containerul) → Etichete → „Printează ultimul container scanat"; verifică apoi prin `exec_get_container_info`.
- „De ce nu vede agentul X CRM-ul?" → verifică rolul real în Personal și permisiunea de acces CRM; preview-ul nu acordă permisiuni.
- „De ce arată alt logo?" → versiune veche de aplicație sau cache — recomandă actualizarea aplicației; dacă persistă, trimite ticket.
