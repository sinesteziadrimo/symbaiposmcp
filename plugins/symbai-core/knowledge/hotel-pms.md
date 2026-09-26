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
- **Minibar cu stoc real** — dacă în Setări Hotel e aleasă magazia de minibar, fiecare cameră are stocul ei fizic: aprovizionarea mută marfa din magazie în cameră (cu poză de dovadă, dacă e cerută), iar consumul scade stocul camerei, nu doar adaugă o linie pe nota de cont (`get_hotel_room_stock`, `restock_hotel_room`, `list_hotel_room_restock_history`).
- **Închiderea zilei (night audit)** — încheie ziua de lucru a hotelului: marchează neprezentările, eliberează rezervările provizorii expirate, trece noaptea de cazare și taxa locală pe notele de cont, semnalează sejururile depășite, actualizează starea camerelor și trece hotelul la ziua următoare. De aceea se rulează doar după simulare și acord. „Azi" în rapoartele hotelului înseamnă ziua de lucru, nu neapărat data din calendar.
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

1. **Check-in / check-out**: /hotel/front-desk → sosirile zilei → check-in (camera curată sau inspectată + actul de identitate verificat) → la plecare verifici nota de cont, încasezi (se emite documentul fiscal) → check-out. Prin conexiune: `list_hotel_reservations` → `hotel_check_in`; `get_hotel_folio` → `settle_hotel_folio` → `hotel_check_out`. Fără rezervare: `hotel_walk_in`; mutare de cameră: `hotel_room_change`; plecare anticipată: `get_hotel_early_checkout_quote` → `confirm_hotel_early_checkout`.
2. **Verifici disponibilitatea și rezervi**: `get_hotel_availability` (perioadă, tip de cameră; `to` = ziua plecării) → oaspetele cu `search_hotel_guests` (sau `create_hotel_guest`) → `create_hotel_reservation`. Schimbarea datelor, camerei sau persoanelor: `modify_hotel_reservation`. **Anularea**: `preview_hotel_cancellation` (penalitate, depozit, sumă de returnat) → acord → `cancel_hotel_reservation`; oaspetele care nu a venit: `mark_hotel_no_show`.
3. **Ajustezi tarifele**: /hotel/rates → alegi perioada și planul → prețul sau restricțiile; prin conexiune `get_hotel_rate_calendar` → `set_hotel_rate_prices` / `set_hotel_rate_restrictions`, iar recomandările cu `get_hotel_price_recommendations` → aprobare sau respingere. Modificările ajung pe canalele conectate — confirmă intervalul și valorile.
4. **Canalele (Booking/Expedia)**: /hotel/channels → mapezi camerele și tarifele → urmărești sincronizarea și paritatea (`get_hotel_channel_status`, `get_hotel_rate_parity`). Retrimiterea disponibilității și oprirea sau repornirea unui canal (`push_hotel_ari`, `replay_hotel_ota_sync`, `pause_hotel_channel`, `resume_hotel_channel`) se fac numai cu acord. Dacă o cameră apare vândută de două ori, verifică întâi aici.
5. **Housekeeping**: /hotel/housekeeping → sarcinile zilei (`generate_hotel_housekeeping_day`, `auto_assign_hotel_housekeeping`), camera gata sau inspectată (`update_hotel_housekeeping_task`, `inspect_hotel_room`), defecte (`create_hotel_maintenance_ticket`).
6. **Închiderea zilei (night audit)**: /hotel/front-desk?tab=nightaudit → verificări (`get_hotel_night_audit_status`, `simulate_hotel_night_audit`) → acord → `run_hotel_night_audit`. Ziua de lucru a hotelului trece la următoarea.
7. **Profil oaspete**: /hotel/guests → preferințe, VIP, marcaje GDPR (`get_hotel_guest`, `update_hotel_guest`; export și anonimizare în ghidul GDPR).
8. **Vezi cum stă hotelul**: `get_hotel_dashboard_stats` (azi: ocupare, sosiri, plecări) și `get_hotel_kpis` (ocupare, ADR, RevPAR, GOP pe perioadă).

## Tool-uri MCP utile

- Citire: `get_hotel_dashboard_stats`, `get_hotel_kpis`, `get_hotel_availability`, `list_hotel_reservations`, `list_hotel_stays`, `list_hotel_rooms`, `search_hotel_guests`, `get_hotel_guest`, `list_hotel_folios`, `get_hotel_folio`, `list_hotel_deposits`, `list_hotel_housekeeping_tasks`, `get_hotel_night_audit_status`, `get_hotel_rate_calendar`, `get_hotel_channel_status`, `list_hotel_reviews`, `get_hotel_feedback`, `get_hotel_loyalty_overview`, `get_guest_loyalty_detail`.
- Acțiuni (toate cer acord explicit înainte): rezervări și oaspeți, check-in, walk-in, mutare de cameră, check-out, consum pe cameră, transfer și încasare pe nota de cont, housekeeping și mentenanță, minibar, închiderea zilei, tarife și restricții, canale, grupuri, coduri promo, răspuns la recenzii. Lista completă și pașii: skill-ul `gestioneaza-hotel`.
- Operațiile de recepție se fac în numele angajatului conectat, cu drepturile lui; o conexiune de firmă fără persoană primește un mesaj clar că trebuie conectată nominal.
- Date despre oaspeți și GDPR: ghidul „GDPR & date clienți" (`export_guest_gdpr_data`, `anonymize_guest`, `find_duplicate_guests`, `merge_guests`).
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
