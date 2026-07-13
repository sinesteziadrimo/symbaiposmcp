# Hotel (PMS) — operațiuni

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul Hotel (PMS) gestionează proprietățile cu camere: recepție (check-in/check-out), inventar de camere și tipuri, calendar de tarife (rate manager), conexiuni cu OTA-urile (Booking/Expedia prin Channel Manager), housekeeping, conturile oaspeților (folio) și loialitatea/recenziile hotelului. Paginile sunt enumerate și în ghidul „Rezervări, Clienți & Evenimente"; aici e partea **operațională** — cum faci efectiv lucrurile zilnice. Modulul apare doar dacă Hotel/PMS e activat.

## Concepte

- **Sejur (stay)** — șederea unui oaspete: cameră, perioadă, tarif, status (rezervat → cazat → plecat).
- **Folio** — contul de cheltuieli al oaspetelui pe durata sejurului (cazare + extra: restaurant, minibar, spa). Se achită la check-out și poate genera factură. O **plată parțială** pe nota de cont lasă folio-ul deschis (rămâne soldul de achitat); nota tipărită **înainte de plată** e marcată **PROFORMA** (nu e document fiscal). Există și opțiunea **„cere achitarea la check-out"** — check-out-ul nu se face cu folio neachitat.
- **Modelul de venit pentru consumul pe cameră** — cum se contabilizează consumul din restaurant trecut pe cameră: **„outlet"** (implicit) — consumul rămâne venit al restaurantului, cu bonul lui, iar nota de cameră îl afișează doar informativ; **„folio"** — venitul se consolidează pe camera de hotel, fără bon la restaurant (totul se încasează la hotel). Alege modelul împreună cu contabilul — schimbă cine „vede" venitul în rapoarte.
- **Rate Manager** — calendarul de tarife: planuri tarifare, restricții (sosire/plecare, durată minimă), reguli de yield (prețuri care urcă la cerere mare), recomandări, prețuri competitori.
- **Channel Manager** — conexiunile cu OTA-urile: mapezi camerele/tarifele tale la cele de pe Booking/Expedia; disponibilitatea și prețul se sincronizează ca să nu vinzi de două ori aceeași cameră (paritate tarifară).
- **Housekeeping** — statusul camerelor (curată/murdară/în curățenie/mentenanță) și sarcinile aferente.
- **Group block (allotment)** — bloc de camere rezervat pentru un grup/eveniment.
- **Loialitate & CRM hotel** — separate de POS: pe nopți, cu tiers și segmente RFM proprii.

## Pagini

- **Dashboard** (`/hotel`) — ocupare, sosiri/plecări, venituri.
- **Recepție** (`/hotel/front-desk`) — centrul operațional zilnic: check-in/check-out, sosiri pe data de business.
- **Housekeeping** (`/hotel/housekeeping`), **Camere** (`/hotel/rooms`), **Tipuri Cameră** (`/hotel/room-types`).
- **Rate Manager** (`/hotel/rates`), **Coduri Promoționale** (`/hotel/promo-codes`).
- **Channel Manager** (`/hotel/channels`), **Group Blocks** (`/hotel/groups`).
- **Oaspeți** (`/hotel/guests`), **CRM & Loialitate** (`/hotel/crm`).
- **Feedback** (`/hotel/guest-feedback`), **Centru Recenzii** (`/hotel/reviews`).
- **Setări proprietate** (`/hotel/property-settings`).

## Fluxuri pas-cu-pas

1. **Check-in / check-out**: /hotel/front-desk → vezi sosirile zilei → check-in (atribui camera, înregistrezi oaspetele) → la plecare, deschizi folio-ul, verifici cheltuielile, încasezi, generezi factura → check-out. (Citire prin conexiune: `list_hotel_reservations`, `list_hotel_folios`.)
2. **Verifici disponibilitatea** pentru o cerere: `get_hotel_availability` (pe perioadă/tip cameră) sau /hotel/front-desk.
3. **Ajustezi tarifele**: /hotel/rates → alegi perioada/planul → modifici prețul/restricțiile sau lași regulile de yield să lucreze. Verifică prognoza cererii + prețurile competitorilor.
4. **Conectezi/sincronizezi un OTA**: /hotel/channels → mapezi camerele/tarifele → urmărești jurnalul de sincronizare și alertele de paritate. Dacă o cameră apare vândută de două ori, verifică aici.
5. **Housekeeping**: /hotel/housekeeping → marchezi camerele curate/în lucru, aloci sarcini.
6. **Profil oaspete**: /hotel/guests → preferințe, VIP, marcaje GDPR (vezi ghidul GDPR pentru export/anonimizare).
7. **Vezi cum stă hotelul azi**: `get_hotel_dashboard_stats` (ocupare, venituri, sosiri/plecări).

## Tool-uri MCP utile

- Citire: `get_hotel_availability`, `get_hotel_dashboard_stats`, `list_hotel_reservations`, `list_hotel_rooms`, `list_hotel_folios`, `get_hotel_loyalty_overview`, `get_guest_loyalty_detail`.
- Operațiile de recepție (check-in/out, încasări, facturi, modificări de tarif, mapări OTA) se fac de regulă din interfața hotelului. Pentru date despre oaspeți + GDPR vezi ghidul „GDPR & date clienți" (`export_guest_gdpr_data`, `anonymize_guest`, `merge_guests`).
- Permisiunea exactă: vezi `tools-mcp.md`.

## Întrebări frecvente

- **De ce o cameră apare ocupată pe Booking dar liberă la mine?** Întârziere/eroare de sincronizare OTA — verifică /hotel/channels (jurnal sincronizare + alerte paritate).
- **Cum scot factura unui oaspete?** Din folio la check-out (cazare + extra consumate). Facturarea fiscală urmează regulile din ghidul de finanțe.
- **Am încasat o parte din nota de cont — de ce nu s-a închis folio-ul?** Normal: plata parțială lasă folio-ul deschis, cu soldul rămas; se închide doar la achitarea integrală.
- **De ce scrie PROFORMA pe nota tipărită?** Ai tipărit-o înainte de plată — e doar informativă, nu document fiscal. Bonul/factura ies la încasare.
- **Consumul de la restaurant trecut pe cameră — al cui e venitul?** Depinde de modelul ales: pe „outlet" (implicit) rămâne venit al restaurantului (nota de cameră doar îl afișează); pe „folio" se consolidează pe hotel, fără bon la restaurant.
- **Loialitatea hotelului e aceeași cu cea de la restaurant?** Nu — hotelul are program separat (pe nopți), în /hotel/crm.
- **Pot bloca un grup de camere?** Da — /hotel/groups (allotment) cu timeline.
- **Unde văd recenziile de pe Booking/TripAdvisor?** /hotel/reviews (vezi și ghidul „Recenzii & reputație").

## Capcane

- **Sincronizarea OTA nu e instant** — la suprapuneri, sursa de adevăr e jurnalul din Channel Manager; nu modifica manual camera fără să verifici.
- **Folio ≠ notă de restaurant** — cheltuielile de restaurant ale unui oaspete pot intra pe folio; verifică unde se închide consumul.
- **Loialitate/CRM hotel separate** de POS — nu căuta nopțile în /loyalty.
- **Check-out-ul închide folio-ul** — verifică toate cheltuielile înainte; după închidere, corecțiile sunt mai greoaie.
