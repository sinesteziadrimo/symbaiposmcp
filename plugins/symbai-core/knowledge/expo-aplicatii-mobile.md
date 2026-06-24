# Aplicatii Expo native: Symbai POS, Symbai Portal, Symbai Staff

Aceasta este referinta rapida pentru Claude Code cand lucreaza pe aplicatiile native Expo din `nexuspos/`: `expo-mobile`, `expo-portal`, `expo-sales`.

Codul real este sursa de adevar: verifica mereu `app.json`, `package.json`, `src/services/api.ts`, `src/services/edgeDiscovery.ts` si assets-urile din app-ul afectat inainte sa raspunzi sau sa modifici.

## Cele 3 aplicatii

| Folder | Nume produs | Rol | Android | iOS | Scheme |
|---|---|---|---|---|---|
| `expo-mobile/` | `Symbai POS` | aplicatia nativa POS pentru ospatari, bar, receptie si operatiuni la masa | `com.symbai.waiter` | `com.symbai.waiter` | `symbai-viva-callback` |
| `expo-portal/` | `Symbai Portal` | aplicatia clientului: meniu, comenzi, cont, activitati/portal clienti | `com.symbai.portal` | `com.symbai.portal` | `symbai-portal` |
| `expo-sales/` | `Symbai Staff` | aplicatia angajatilor: livratori, agenti teren, CRM/vanzari, task-uri, productie/fabrica si containere QR | `com.symbai.staff` | `com.symbai.staff` | `symbai-staff` |

`expo-sales` este doar numele tehnic al folderului. In UI, documentatie client-facing si preview-uri foloseste **Symbai Staff** sau **Aplicatie Staff**, nu "Expo Sales".

## Config app.json verificata

| App | `name` | `slug` | EAS projectId | Culori relevante |
|---|---|---|---|---|
| `expo-mobile` | `Symbai POS` | `symbai-pos` | `0b94c42d-0f8e-4ded-91c2-b759b9c557ca` | splash/adaptive `#1e293b`, notificari `#1e293b` |
| `expo-portal` | `Symbai Portal` | `symbai-portal` | `19e6cff0-326f-41a3-b38e-ce01c2be2403` | splash/adaptive `#001858`, notificari `#0771D5` |
| `expo-sales` | `Symbai Staff` | `symbai-staff` | `024efb8f-5593-4590-9421-f8baf64b29ac` | splash/adaptive `#001858`, notificari `#0771D5` |

Owner EAS curent: `mp-river-side`.

## Runtime actual in Symbai POS

`expo-mobile` este aplicatia nativa **Symbai POS** pentru ospatari/bar/receptie. Cand userul intreaba de ecranul de mese de pe telefon, de "Actiuni masa", de zoom pe planul de sala sau de etichete dublate de tip "Masa Masa 7", raspunsul agentului trebuie sa porneasca de aici:

- **Etichete mese**: aplicatia normalizeaza numele mesei peste Rooms, Order, Guest si preview nota. Pentru mese simple afiseaza `Masa 7`; pe carduri compacte sau pe harta afiseaza `M7`; pentru nume reale precum `Terasa VIP` pastreaza numele fara sa forteze prefix. Nu spune userului sa redenumeasca mesele doar ca sa scape de dublarea "Masa".
- **Ecranul de sali**: pe telefoane inguste headerul se compacteaza automat pana sub ~480px, selectorul de unitate ramane in stanga, iar iconurile POS/alerte/housekeeping/chat/setari/profil raman accesibile fara sa impinga planul.
- **Planul de sala pe telefon**: canvasul are pan/pinch, double tap, inertie dupa drag, zoom minim adaptat la dimensiunea planului, butoane flotante `+ / zoom / -` si reset safe-area. Butonul din mijloc arata zoomul relativ curent, nu text fix `1x`. Incadrarea tine cont si de mesele/decorurile care ies din dimensiunea de baza a canvasului, deci nu considera un plan "taiat" doar pentru ca `canvasWidth/canvasHeight` par mici. Culorile cardurilor spun ownership-ul: masa mea, masa altui ospatar, neatribuita, comanda QR eligibila pentru preluare, modificari offline/ne trimise si rezervare. Pentru dovada vizuala foloseste emulator Android sau device real; arata screenshot cu Rooms -> planul salii, nu doar un build/typecheck.
- **Trimitere comanda**: in aplicatia nativa, butonul **Trimite** raspunde imediat (feedback tactil + animatie scurta), blocheaza instant a doua apasare si trimite doar produsele noi. Dupa succes poate reveni la sala inainte ca refresh-ul de mese/comenzi/KDS sa se termine; actualizarea se face in fundal si nu inseamna ca produsele s-au pierdut. Daca ospatarul apasa Trimite fara produse noi, app-ul afiseaza doar mesajul informativ. Pentru verificare foloseste emulator/device real cu server lent sau retea slaba si apoi confirma prin `get_order_timeline` / `jurnal_activitate`, nu doar prin senzatia din UI.
- **Push POS / KDS pentru personal**: tokenul Expo se inregistreaza global dupa login + consimtamant, nu doar cand ospatarul intra in ecranul Rooms. Notificarile de bucatarie `kitchen_started` / `kitchen_ready` pot fi trimise pe canal Android separat fara sunet (`symbai-pos-kitchen-silent`) cand payload-ul are `silent` / `silentNotification`; in foreground aplicatia respecta acel payload si nu reda sunet. Daca userul spune ca notificarea de „preparat gata" suna desi KDS-ul e setat silentios, verifica payload-ul staff notification + canalul Android, nu campaniile de marketing push.
- **Cantitati si clienti pe nota**: cantitatile fractionare/zecimale venite din server se afiseaza curat in cos, split si preview nota (ex. `1.5`, `0.25`, fara `NaN` sau zerouri inutile), iar totalurile folosesc aceeasi cantitate numerica. Cand masa are mai multi clienti/scaune, produsele noi si cele trimise se grupeaza pe client; produsele fara client apar la **Comune masa**, cu subtotal pe grup. Pentru dovezi native verifica in emulator/device real o nota cu cantitati fractionare si minim doi clienti, apoi confirma timeline-ul prin MCP daca e nevoie.
- **Actiuni masa**: in ecranul comenzii, cele 3 puncte deschid un bottom sheet scrollabil, compact pe telefoane mici, nu un meniu lung. Acolo sunt actiunile: Printeaza Nota, Transfer, Preia Masa, Transfera Produse, Partajeaza, Mesaj Bucatarie, Imparte Nota, Masa Servita, Reprint Bon Fiscal, Retur, Casa, Discount, Beneficiu Personal, Client, Firma si configuratiile de afisare cand exista mai multe.
- **Masa Servita**: comutatorul ramane o actiune pe masa. Explica simplu: pe bonul fiscal produsele se grupeaza ca "Masa servita" pe cote TVA; nu schimba continutul real al notei.
- **Plata la masa**: dialogul de bacsis trebuie sa apara imediat cand ospatarul apasa plata; trimiterea produselor netrimise, verificarea sumei pe server si pregatirea orderului ruleaza in fundal. Cand ospatarul apasa "Continua" spre metoda de plata, app-ul asteapta pregatirea daca nu e gata. Daca vezi blocaje, testeaza cu produse netrimise + server lent, nu doar cash simplu.
- **GP tom app2app local**: daca aplicatia nativa GP intoarce `cancelled` sau `failed`, Symbai POS finalizeaza imediat incercarea ca anulata/esuta si revine la metoda de plata; nu trebuie sa astepte polling-ul. Pentru `uncertain`/`confirmed`, polling-ul/serverul raman sursa de adevar. La device gresit pentru executia locala, plata se marcheaza failed si se deblocheaza UI-ul.

Pentru lucru practic: datele de sala/configuratie se citesc si se modifica prin tool-urile de plan de sala (`get_floor_config`, `set_floor_table_geometry`, `arrange_tables_grid`, `move_tables_to_section`, `set_zone_routing` etc.), iar aplicatia nativa doar confirma cum vede ospatarul. Browser/Chrome este suficient pentru POS web; pentru comportament nativ (gesturi, safe-area, bottom sheet, app2app plati) foloseste skill-ul de emulator Android si screenshot.

## Branding obligatoriu

- Foloseste identitatea Symbai: logo-ul/mark-ul cu **S** din Symbai POS, culorile albastre Symbai, denumirile `Symbai POS`, `Symbai Portal`, `Symbai Staff`.
- Nu folosi iconite vechi `N`, branding `Nexus` sau titluri user-facing `Expo Sales`.
- Daca tenantul are logo propriu, il poti afisa ca logo de locatie/brand in interiorul app-ului, dar icon-ul/splash-ul aplicatiei raman Symbai.
- Dupa schimbari de icon/splash/app.json, ruleaza prebuild ca sa regenerezi resursele Android native.

Assets de verificat:

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash-icon.png`
- dupa prebuild: `android/app/src/main/res/**`

## Configurare in POS web: /menu/platforms

Aceeasi pagina are doua configurari diferite si Claude trebuie sa le separe clar:

| Card / dialog | Pentru cine | Skill corect | Tool-uri |
|---|---|---|---|
| `Configurare Platforma Clienti` | clientii publici: portal, QR, meniu, comenzi, jocuri | `configureaza-portal` | `get_portal_config`, `configure_portal_*`, `configure_portal_qr`, `spotlight_portal_tab` |
| `In Aplicatie Staff` | angajati: livratori, agenti teren, CRM, task-uri, receptie, marfa, fabrica/containere QR | `configureaza-aplicatie-staff` | UI/Chrome; nu exista tool MCP dedicat pentru acest dialog in catalogul curent |

### In Aplicatie Staff / Symbai Staff

Dialogul **In Aplicatie Staff** configureaza preview-ul si profilul implicit pentru canalul `expo-sales`. In cod, configurarea se salveaza pe device-ul POS cu `channelId = "expo-sales"` in `portalDisplayConfig`.

Campuri reale:

- `defaultPreviewProfile`: presetul implicit pentru preview.
- `density`: `guided` sau `compact`.
- `showManagerHints`: arata/ascunde sumarul explicativ pentru manager.
- `profileOverrides`: toggle-uri de feature pe preset.

Nu confunda cu permisiunile reale: toggle-urile din dialog nu dau acces angajatului. Accesul real vine din rolurile din Personal (`/staff?tab=roles`) si permisiuni precum `crm_access`, `fleet_drive`, `delivery_view`, `delivery_status_update`, `tasks_view`, `stock_receive`, `kds_view`, `reservations_view`, `report_sales`.

Preseturi verificate in cod (`shared/expo-sales-profile.ts`):

| Preset | ID | Ce arata |
|---|---|---|
| `1. Angajat simplu` | `tasks_basic` | task-uri proprii, fara CRM/stoc |
| `2. Operare marfa / bucatarie` | `stock_kitchen` | task-uri, preluare marfa, bucatarie/productie |
| `3. Receptie + marfa` | `reception_stock` | receptie, rezervari, mesaje, preluare marfa |
| `4. Livrator simplu` | `driver_basic` | livrari, statusuri, rapoarte; CRM ascuns |
| `5. Livrator cu vanzari` | `driver_sales` | livrari + CRM + mesaje + apeluri + rapoarte |
| `6. Vanzari / CRM in locatie` | `sales_location` | CRM locatie, apeluri, mesaje, rapoarte |
| `7. Vanzari / CRM cu vizite` | `sales_field` | CRM teren, traseu zilnic, check-in si vizite |

Feature-uri toggle: `tasks`, `stockReceiving`, `kitchenPickup`, `reception`, `deliveries`, `deliverySales`, `salesCrm`, `fieldVisits`, `messages`, `reports`, `callDesk`.

### Runtime actual in Symbai Staff

Ce vede angajatul in aplicatia nativa depinde de profilul rezolvat din rol/feature-uri:

- **Sarcini**: toggle-ul `tasks` ramane parte din profilul de preview/rol, dar runtime-ul curent nu mai are ecran separat `MyTasks` si nu mai expune deep-link-uri `symbai-staff://tasks` / `task/<id>`. Pentru sarcini reale foloseste tool-urile/POS web (`gestioneaza-sarcini`) si verifica prin `get_my_tasks`.
- **Fabrica**: rolurile cu productie/factoryOps vad tabul **Fabrica** cu subtaburi **Azi**, **Scan**, **QC**, **Etichete**, **Retete**. Din lista de operatii poti porni/finaliza operatii si marca QC OK/blocat; scanarea QR returneaza container/lot/batch si poate porni urmatoarea operatie sau printa eticheta containerului scanat.
- **Etichete productie**: tabul **Etichete** alege o imprimanta activa si printeaza eticheta pentru ultimul container scanat sau pentru containerele afisate din operatiile zilei. Nu promite creare container nou din app-ul curent daca nu vezi butonul in runtime.
- **Container / QR**: nu mai trimite userul la deep-link `symbai-staff://container/<qrCode>`. Operatorul foloseste tabul **Scan** din Symbai Staff sau scannerul web; pentru detalii bogate si verificare agentul foloseste `exec_scan_container` / `exec_get_container_info`.

Pentru agenti, explica simplu: MCP-ul poate citi/scrie datele de productie si sarcini, dar actiunile fizice de teren (camera, printare eticheta, operatie facuta la utilaj) se fac in **Symbai Staff** sau in scannerul web, nu din chat. Pentru dovada vizuala nativa foloseste emulatorul Android si screenshot; pentru dialogul de configurare din POS web foloseste Chrome pe `/menu/platforms`.

Preview-ul de livrator este clickabil si trebuie explicat ca o simulare realista: `Traseu`, `Suna`, `Problema`, `Pornesc cursa`, `Am ajuns`, `Poza`, `Incasez`, `Marchez livrata`, `Reiau simularea`. Pentru `driver_basic`, app-ul este livrator-focused: primul tab este `Livrari`, CRM-ul nu apare si `Mai mult` este ascuns.

Branding in preview:

- logo lung: `/brand/symbai-logo-left.png`;
- mark S: `/brand/symbai-mark-dark.png`;
- culori: `#001858`, `#0771D5`, `#10D0B0`;
- texte user-facing: `Symbai Staff`, `Aplicatie Staff`, `In Aplicatie Staff`.

## Server URL si emulator

Regula de baza: `localhost` din Android emulator inseamna emulatorul, nu PC-ul.

- Backend local pe PC: foloseste `http://10.0.2.2:3000` in Android emulator.
- Device fizic in LAN: foloseste IP-ul PC-ului sau URL-ul HTTPS al tenantului.
- Cloud canonical URL si runtime/edge URL sunt concepte diferite. Nu persista URL-ul edge LAN ca URL cloud canonical.
- Edge discovery trebuie sa seteze URL-ul tranzient cu `{ persist: false }`.

Chei canonical storage:

- `expo-mobile`: `symbai_cloud_api_url`
- `expo-portal`: `portal_cloud_base_url`
- `expo-sales`: `staff_cloud_base_url`

## Build si test

Comenzi uzuale, rulate in folderul app-ului afectat:

```powershell
npx.cmd tsc -p tsconfig.json --noEmit --pretty false
npx.cmd expo prebuild --platform android --no-install
npx.cmd expo run:android
```

`expo-mobile` are scripturile `android`/`ios` pe `expo run:*` (dev-client/native), nu pe Expo Go. Pentru schimbări native (splash, secure-store backup rules, deep links, pluginuri, plăți, notificări) folosește `expo run:android` sau Gradle/EAS; `expo start` singur nu validează resursele native generate.

Pentru Android build real foloseste EAS sau Gradle dupa prebuild, in functie de task. Pentru iOS nativ real este nevoie de macOS/Xcode sau EAS Build; pe Windows nu promite testare iOS nativa locala.

Checklist minim cand modifici o aplicatie Expo:

1. Verifica `app.json` si assets.
2. Ruleaza typecheck-ul.
3. Porneste pe Android emulator cand fluxul este UI/native.
4. Fa screenshot la splash/login/home si la ecranul schimbat.
5. Daca schimbarea implica plugin nativ, deep link, plata, camera, locatie sau notificari, testeaza build nativ Android, nu doar Expo Go.

## Plati native si GP app2app

`expo-mobile` include flow-uri native pentru plati:

- Viva: scheme `symbai-viva-callback`, query scheme `vivapayclient`, plugin `withAndroidVivaQueries`.
- Global Payments: plugin `withGpAppToApp`.

Pentru GP app2app:

- Nu inventa TID-uri in cod sau in documentatie.
- Daca device-ul are TID/config GP si aplicatia GP nativa instalata, flow-ul trebuie sa fie identificabil in UI ca plata card GP app2app.
- Testul corect este pe Android build nativ cu aplicatia GP disponibila; Expo Go nu valideaza complet pluginurile native.
- Daca flow-ul intoarce in app dupa plata, verifica si callback-ul, status polling si mesajele pentru plata incerta/esuata.
- Pentru regresii GP pe `expo-mobile`, verifica explicit: local app2app cu anulare/refuz in GP tom se inchide imediat in Symbai POS; stale GP/Viva state se curata la o noua plata; dupa refuz/anulare, nota ramane de plata si metoda poate fi reapasata fara blocaj.

## Push notifications

- Pastreaza numele produsului in copy-ul notificarii.
- `expo-portal` si `expo-sales` folosesc culoarea de notificari `#0771D5`.
- `expo-mobile` foloseste `#1e293b`.
- Verifica in `app.json` pluginul `expo-notifications`, icon-ul si permisiunile native.
- In `expo-mobile`, canalele Android POS sunt: `default` (fallback), `orders` (comenzi POS) si `symbai-pos-kitchen-silent` (KDS/preparat gata fara sunet). Pentru staff notifications de KDS, serverul rezolva `sound`, `channelId` si `priority` din payload; nu forta `sound:"default"` daca mesajul este silentios.
- Push tranzactional catre personal/KDS nu se trateaza ca o campanie marketing: nu folosesti `preview_push_audience` / `send_push_campaign`, ci verifici tokenul angajatului si fluxul server `persistStaffNotification` -> `sendPushToEmployee`.

## Conflicte frecvente

- Se vede icon vechi `N`: assets native stale; verifica `assets/*`, ruleaza `expo prebuild`, curata cache Metro daca e nevoie.
- App-ul nu vede backend-ul local in emulator: foloseste `10.0.2.2`, nu `localhost`.
- `expo-sales` apare in UI: redenumeste user-facing la `Symbai Staff` / `Aplicatie Staff`.
- iOS nu poate fi testat local pe Windows: spune explicit limita si foloseste EAS/macOS pentru build nativ.
- Edge URL ramane blocat dupa schimbare de retea: verifica sa nu fi fost persistat runtime URL-ul LAN.

## Unde trimiti userul in POS web

- Configurarea platformei clientilor: `/menu/platforms` sau alias `/portal-config`, card `Configurare Platforma Clienti`, skill `configureaza-portal`.
- Configurarea Aplicatiei Staff: `/menu/platforms`, card `In Aplicatie Staff`, skill `configureaza-aplicatie-staff`.
- Roluri si permisiuni reale pentru angajati: `/staff?tab=roles`.
- Integrari plati GP/Viva: `/settings?tab=integrations`.
- Server/edge/print agent: `/settings?tab=edge-server`.
- Imprimante/case de marcat: `/settings?tab=printers`.
