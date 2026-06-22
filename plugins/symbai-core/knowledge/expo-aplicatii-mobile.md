# Aplicatii Expo native: Symbai POS, Symbai Portal, Symbai Staff

Aceasta este referinta rapida pentru Claude Code cand lucreaza pe aplicatiile native Expo din `nexuspos/`: `expo-mobile`, `expo-portal`, `expo-sales`.

Codul real este sursa de adevar: verifica mereu `app.json`, `package.json`, `src/services/api.ts`, `src/services/edgeDiscovery.ts` si assets-urile din app-ul afectat inainte sa raspunzi sau sa modifici.

## Cele 3 aplicatii

| Folder | Nume produs | Rol | Android | iOS | Scheme |
|---|---|---|---|---|---|
| `expo-mobile/` | `Symbai POS` | aplicatia nativa POS pentru ospatari, bar, receptie si operatiuni la masa | `com.symbai.waiter` | `com.symbai.waiter` | `symbai-viva-callback` |
| `expo-portal/` | `Symbai Portal` | aplicatia clientului: meniu, comenzi, cont, activitati/portal clienti | `com.symbai.portal` | `com.symbai.portal` | `symbai-portal` |
| `expo-sales/` | `Symbai Staff` | aplicatia angajatilor: livratori, agenti teren, CRM/vanzari, task-uri | `com.symbai.staff` | `com.symbai.staff` | `symbai-staff` |

`expo-sales` este doar numele tehnic al folderului. In UI, documentatie client-facing si preview-uri foloseste **Symbai Staff** sau **Aplicatie Staff**, nu "Expo Sales".

## Config app.json verificata

| App | `name` | `slug` | EAS projectId | Culori relevante |
|---|---|---|---|---|
| `expo-mobile` | `Symbai POS` | `symbai-pos` | `0b94c42d-0f8e-4ded-91c2-b759b9c557ca` | splash/adaptive `#1e293b`, notificari `#1e293b` |
| `expo-portal` | `Symbai Portal` | `symbai-portal` | `19e6cff0-326f-41a3-b38e-ce01c2be2403` | splash/adaptive `#001858`, notificari `#0771D5` |
| `expo-sales` | `Symbai Staff` | `symbai-staff` | `024efb8f-5593-4590-9421-f8baf64b29ac` | splash/adaptive `#001858`, notificari `#0771D5` |

Owner EAS curent: `mp-river-side`.

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
| `In Aplicatie Staff` | angajati: livratori, agenti teren, CRM, task-uri, receptie, marfa | `configureaza-aplicatie-staff` | UI/Chrome; nu exista tool MCP dedicat pentru acest dialog in catalogul curent |

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

## Push notifications

- Pastreaza numele produsului in copy-ul notificarii.
- `expo-portal` si `expo-sales` folosesc culoarea de notificari `#0771D5`.
- `expo-mobile` foloseste `#1e293b`.
- Verifica in `app.json` pluginul `expo-notifications`, icon-ul si permisiunile native.

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
