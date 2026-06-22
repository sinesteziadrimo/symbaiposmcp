---
name: configureaza-aplicatie-staff
description: Configureaza si explica Aplicatia Staff / Symbai Staff din POS web: cardul "In Aplicatie Staff" de pe /menu/platforms, profiluri pentru livratori, agenti teren, CRM, task-uri, preluare marfa, productie/fabrica, containere QR, preview telefon cu butoane clickabile si legatura cu rolurile reale din Personal. Foloseste la "configureaza Aplicatie Staff", "Symbai Staff", "expo-sales", "ce vede livratorul", "ce vede operatorul de fabrica", "container QR pe mobil", "preview livrator", "ascunde CRM pentru livratori", "agent teren in aplicatia staff", "rol pentru previzualizare", "profil livrator cu vanzari", "aplicatia angajatilor".
---

# Configureaza Aplicatie Staff

Userul vrea sa configureze sau sa inteleaga **Symbai Staff**: aplicatia angajatilor pentru livratori, agenti de teren, CRM/vanzari, task-uri, receptie, operare marfa si productie/fabrica cu containere QR. Configurarea user-facing se face in POS web pe **/menu/platforms** prin cardul **"In Aplicatie Staff"**.

Nu confunda:
- **Platforma Clienti / Portalul clientilor** = ce vede clientul public, skill `configureaza-portal`, tool-uri `configure_portal_*`.
- **In Aplicatie Staff / Symbai Staff** = ce vede angajatul in app-ul staff, profiluri si preview, acest skill.
- **Build nativ Expo** = app.json/assets/prebuild/build in repo, referinta `expo-aplicatii-mobile.md`; nu se schimba din dialog.

## Inainte de orice

1. Citeste `knowledge/expo-aplicatii-mobile.md` pentru configuratia curenta, branding, app.json, emulator si build.
2. Pentru roluri si permisiuni reale citeste `knowledge/personal-hr.md`.
3. Pentru livratori si dispecerat citeste `knowledge/livrari-comenzi-online.md`.
4. Pentru agenti de vanzari / CRM teren citeste `knowledge/crm-vanzari-pipeline.md`.
5. Pentru productie/fabrica, containere QR si predari intre statii citeste `knowledge/productie-fabrica.md`.
6. Pentru navigare si screenshot citeste `knowledge/condu-chrome.md`.

## Ce configureaza dialogul

Dialogul **In Aplicatie Staff** configureaza o previzualizare si niste preferinte de afisare pentru canalul `expo-sales`. In cod, configurarea este salvata pe device-ul POS cu `channelId = "expo-sales"` in `portalDisplayConfig`.

Campurile reale:
- `defaultPreviewProfile` = presetul afisat implicit.
- `density` = `guided` sau `compact`.
- `showManagerHints` = daca preview-ul arata explicatii pentru manager.
- `profileOverrides` = toggle-uri de feature per preset.

Important: toggle-urile din "Ajustari mici" **nu schimba permisiunile rolului**. Pentru acces real modifici rolurile in **Personal -> Roluri** (`/staff?tab=roles`). Dialogul doar arata si ajusteaza modul in care se simplifica aplicatia pentru profilul ales.

## Profiluri rapide

| Preset | ID | Cand il alegi | Feature-uri principale | Permisiuni recomandate |
|---|---|---|---|---|
| 1. Angajat simplu | `tasks_basic` | curatenie, ajutor, personal fara vanzari/stoc | Task-uri proprii | `tasks_view` |
| 2. Operare marfa / bucatarie | `stock_kitchen` | receptie marfa, bucatarie, pregatiri, operator fabrica | Task-uri, Preluare marfa, Bucatarie/productie, Fabrica, containere QR | `tasks_view`, `stock_receive`, `kds_view` + permisiunile de productie ale rolului |
| 3. Receptie + marfa | `reception_stock` | front-desk, rezervari, preluare marfa | Task-uri, Receptie, Mesaje, Preluare marfa | `tasks_view`, `reservations_view`, `stock_receive` |
| 4. Livrator simplu | `driver_basic` | sofer/livrator care nu vede CRM | Livrari, Rapoarte | `fleet_drive`, `delivery_view`, `delivery_status_update` |
| 5. Livrator cu vanzari | `driver_sales` | livrator care poate crea lead/follow-up | Livrari, Vanzare pe livrare, CRM, Mesaje, Rapoarte, Apeluri | `fleet_drive`, `delivery_view`, `delivery_status_update`, `crm_access`, `report_sales` |
| 6. Vanzari / CRM in locatie | `sales_location` | agent in locatie / call-center | CRM, Task-uri, Mesaje, Rapoarte, Apeluri | `crm_access`, `tasks_view`, `report_sales` |
| 7. Vanzari / CRM cu vizite | `sales_field` | agent teren cu traseu si check-in | CRM, Vizite clienti, Task-uri, Mesaje, Rapoarte, Apeluri | `crm_access`, `tasks_view`, `report_sales` |

Feature-uri toggle:
`tasks`, `stockReceiving`, `kitchenPickup`, `reception`, `deliveries`, `deliverySales`, `salesCrm`, `fieldVisits`, `messages`, `reports`, `callDesk`.

## Ce vede efectiv angajatul in app

- **Ziua mea / Sarcini**: feed-ul din `/api/my-tasks`, grupat pe intarziate / azi / urmatoarele / generale / finalizate azi. Deep link-uri: `symbai-staff://tasks` si `symbai-staff://task/<taskId>`. Daca sarcina cere dovada, angajatul ataseaza poza, nota, numar sau semnatura.
- **Fabrica**: tabul **Fabrica** arata operatii active, QC/hold, imprimante, retete si scanare. Dintr-o operatie se poate intra in ecranul de rulare (`symbai-staff://operation/<batchId>`), unde operatorul lucreaza pe fluxul shop-floor.
- **Container nou + QR**: in tabul Etichete productie, operatorul creeaza container fizic (`tray`, `box`, `crate`, `pallet`), introduce optional cantitate/unitate/conditii de pastrare, genereaza QR si printeaza eticheta.
- **Detaliu container**: scanarea sau `symbai-staff://container/<qrCode>` arata produsul, lotul, materialele, zona, echipamentul, istoricul scanarilor si predarile in asteptare. Actiuni mobile: print, avansare etapa, split, marcare QC, accept/respinge predare.

Important: acestea sunt actiuni fizice in aplicatia mobila. Prin MCP poti crea/citi sarcini, productie, loturi, QC si handovers, dar nu simulezi camera, imprimanta sau split-ul fizic din chat; trimite operatorul in Symbai Staff si verifica apoi prin citire.

## Preview-ul de telefon

Preview-ul este gandit ca un telefon real in brandul Symbai POS. Butoanele sunt clickabile pentru simulare si ajuta userul sa inteleaga ce vede angajatul.

Pentru profilul **Livrator simplu**:
- primul tab este **Livrari**;
- nu apare tabul **Mai mult**;
- CRM-ul este ascuns;
- vede tura activa, GPS live, numar comenzi active, ruta si cash;
- vede urmatoarea oprire, coada de livrari si statusul comenzii;
- butoane de simulare: **Traseu**, **Suna**, **Problema**, **Pornesc cursa**, **Am ajuns**, **Poza**, **Incasez**, **Marchez livrata**, **Reiau simularea**;
- "Marchez livrata" devine disponibil doar dupa dovada foto si incasare cash in preview.

Pentru profiluri mixte:
- taburile se aleg din feature-uri: Azi/Acasa, Fabrica, Livrari, Pipeline, Actiuni, Mesaje, Mai mult;
- tabul **Azi/Sarcini** arata sarcinile proprii si dovada ceruta;
- tabul **Fabrica** arata operatiile active, scanarea containerelor, QC/hold si etichetele QR;
- tabul **Livrari** are **Vezi ruta** si **Suna client**;
- tabul **Pipeline** arata lead-uri/deal-uri;
- tabul **Actiuni** are apel rapid, check-in vizita, follow-up;
- tabul **Mesaje** arata WhatsApp/Portal/Intern;
- tabul **Mai mult** arata Profil, Rapoarte, Notificari.

## Branding obligatoriu

Foloseste numai identitatea Symbai:
- logo lung: `/brand/symbai-logo-left.png`;
- mark S: `/brand/symbai-mark-dark.png`;
- culori: `#001858` dark blue, `#0771D5` blue, `#10D0B0` teal;
- copy user-facing: **Symbai Staff**, **Aplicatie Staff**, **In Aplicatie Staff**.

Nu folosi `N`, `Nexus` sau "Expo Sales" in UI pentru user. `expo-sales` ramane doar nume tehnic de folder/canal.

Daca userul vede in emulator un logo vechi `N`, explica scurt: cel mai probabil sunt assets native/cache stale. Verifica `expo-sales/assets/*`, ruleaza `npx.cmd expo prebuild --platform android --no-install`, curata cache Metro si testeaza build-ul Android nativ daca schimbarea e pe icon/splash.

## Workflow

1. Afla ce rol/profil vrea userul: livrator simplu, livrator cu vanzari, agent teren, receptie, bucatarie/marfa sau angajat simplu.
2. Daca cere permisiuni reale, deschide/foloseste **Personal -> Roluri** (`/staff?tab=roles`) si nu confunda cu preview-ul.
3. Navigheaza la **/menu/platforms** si deschide cardul **In Aplicatie Staff**.
4. Selecteaza presetul sau un **Rol real:** din dropdown.
5. Ajusteaza **Mod compact**, **Hinturi manager** si feature-urile doar daca userul cere sau profilul recomandat are nevoie.
6. Click-uieste taburile din telefon si, pentru livrator, ruleaza simularea traseu -> apel -> status -> poza/incasare -> livrata.
7. Salveaza cu **Salveaza Aplicatie Staff**.
8. Re-deschide dialogul si verifica: profilul implicit, badge-urile de feature, taburile si brandingul.
9. Daca userul vrea dovada vizuala, fa screenshot la dialog si la preview-ul de telefon. Pentru fluxuri native reale (camera, print eticheta, deep link container), foloseste emulatorul Android si arata screenshot din Symbai Staff, nu doar preview-ul web.

## Ce se poate prin MCP

In catalogul curent nu exista un tool dedicat `configure_expo_staff` / `configure_staff_app`. Pentru configurarea dialogului folosesti UI/Chrome. Pentru roluri reale si permisiuni folosesti tool-urile de Personal daca sunt disponibile in conexiunea clientului, altfel ghidezi userul in `/staff?tab=roles`.

Pentru orice actiune reala de livrare (asignare sofer, status comanda, incident, flota) foloseste skill-ul `gestioneaza-livrari` si tool-urile de livrari. Dialogul **In Aplicatie Staff** este preview/config de afisare, nu dispecerat operational.

Pentru sarcini reale foloseste skill-ul `gestioneaza-sarcini` si tool-urile de Personal. Pentru fabrici foloseste `productie-flux` / `productie-fabrica`: MCP-ul citeste si scrie productia, dar actiunile fizice pe containere (scanare camera, print, split, advance, accept predare) se fac in Symbai Staff sau in scannerul web, apoi verifici prin `exec_scan_container` / `exec_get_container_info` / `exec_list_handovers`.

## Raspunsuri scurte utile

- "Ce vede livratorul?" -> deschide `In Aplicatie Staff`, preset `4. Livrator simplu`, arata telefonul: Livrari, ruta, suna, status, poza, incasare, marcare livrata.
- "Vreau livrator fara CRM" -> preset `driver_basic`; verifica sa fie active doar Livrari/Rapoarte si sa nu apara Pipeline/Actiuni/Mai mult.
- "Vreau livrator care poate vinde" -> preset `driver_sales`; are livrari + pipeline + mesaje + apeluri.
- "Ce vede operatorul de fabrica?" -> preset `stock_kitchen` sau rol real cu productie; arata tabul Fabrica: operatii active, scanare container, QC/hold, etichete si `Container nou + QR`.
- "Vreau sa printez eticheta unui container de pe telefon" -> in Symbai Staff, Fabrica -> Etichete productie -> `Container nou + QR` sau scaneaza containerul -> Detalii -> `Printeaza`; verifica apoi prin `exec_get_container_info`.
- "De ce nu vede agentul X CRM?" -> verifica rolul real in Personal si permisiunile `crm_access`; preview-ul nu acorda permisiuni.
- "De ce arata alt logo?" -> verifica branding/assets/prebuild; nu schimba denumirea produsului.
