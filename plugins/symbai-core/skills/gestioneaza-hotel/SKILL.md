---
name: gestioneaza-hotel
description: Operează recepția și managementul hotelului (PMS) prin conexiune (MCP) + navigare cu link direct — fără să bâjbâi prin tab-uri. Răspunzi la „cum stă hotelul azi / grad de ocupare", „am camere libere între X și Y", „ce rezervări am / cine sosește / cine pleacă azi", „fă o rezervare la camera dublă pentru weekend", „ce note de cont (folio) am deschise / cine are de plată", „ce camere sunt ocupate/murdare/scoase din uz", „trece consumul de la restaurant pe camera 204", „adaugă un tip de cameră / o cameră nouă", „cum stă programul de fidelitate al hotelului". Citirile (ocupare, disponibilitate, rezervări, folios, camere, loialitate) și o parte din scrieri (rezervare, check-in, charge-to-room, camere) se fac prin conexiune; restul recepției (check-out, încasare, factură, tarife, OTA, housekeeping) îl arăți prin link direct la pagina potrivită.
---

# Gestionează hotelul (PMS) — recepție & management prin MCP + link direct

Userul e proprietar/manager de hotel sau pensiune. Vrea răspunsuri și acțiuni rapide: cum stă ocuparea azi, are camere libere, ce rezervări sunt, cine are de plată, fă o rezervare, trece consumul pe cameră. **Regula de aur a fluxului HIBRID: ce are tool MCP faci prin conexiune (rapid, fără click); restul îl ARĂȚI navigând la pagina potrivită cu link direct — NU dai click prin tab-uri.** Modulul Hotel apare doar dacă PMS-ul e activat pe instanță.

## Înainte de orice
1. Citește **`knowledge/hotel-pms.md`** (concepte: sejur/stay, folio, rate manager, channel manager, housekeeping, group block, loialitate hotel separată de POS; harta de pagini; fluxurile zilnice; capcane OTA + folio + check-out). Și **`knowledge/condu-chrome.md`** (doctrina „click rar": tool MCP → deep-link → click pe element doar la nevoie; screenshot = livrabil; capcana unității active; fallback fără extensie). NU repeta aici regulile de Chrome — le aplici de acolo.
2. **Context la început** (ca peste tot): `list_brands` + `list_locations` → afli `brandId`/`locationId`. Tool-urile de hotel le deduc singure dacă tenantul are **un singur** brand + o singură locație; dacă are mai multe, trebuie să le dai explicit (un hotel cu mai multe proprietăți = brand/locație distincte). „Data de azi" e **data de business** a hotelului (din setările proprietății), nu neapărat calendaristică.
3. **Permisiune**: citirile merg mereu; scrierile cer modulul **Hotel** pe token. „Permisiune insuficientă" → portal Hub → Acces AI → bifează Hotel.

## Fluxul hibrid — intenție → tool MCP, apoi unde o ARĂȚI

Întâi încearcă tool-ul. Apoi, ca să-i arăți userului, navighează la pagina potrivită cu **link direct** și fă screenshot (vezi `condu-chrome.md`).

| Userul vrea… | Tool MCP (rapid, prin conexiune) | Unde o arăți (link direct) |
|---|---|---|
| „Cum stă hotelul azi / grad de ocupare / sosiri-plecări azi" | `get_hotel_dashboard_stats` | `/hotel` (Dashboard) |
| „Am camere libere între X și Y / ce disponibilitate am" | `get_hotel_availability(from, to, roomTypeId?)` — `to` = ziua de plecare, exclusivă | `/hotel/front-desk` |
| „Ce rezervări am / confirmate / anulate / cine sosește" | `list_hotel_reservations(status?)` | `/hotel/front-desk?tab=arrivals` (sau `?tab=departures` / `?tab=inhouse`) |
| „Ce note de cont (folio) am deschise / cine are de plată / solduri" | `list_hotel_folios(status?)` — status `open`/`closed`/`settled` | `/hotel/folios` |
| „Ce camere am / câte ocupate / murdare / scoase din uz" | `list_hotel_rooms(status?)` | `/hotel/rooms` (status camere) sau `/hotel/housekeeping` |
| „Fă o rezervare la camera X pentru perioada Y" | `create_hotel_reservation(roomTypeId, checkInDate, checkOutDate, …)` — verifică automat disponibilitatea | `/hotel/front-desk` |
| „Schimbă / mută data / anulează rezervarea" | `update_hotel_reservation(reservationId, status?/checkInDate?/…)` (anulare = `status:"cancelled"`) | `/hotel/front-desk` |
| „Fă check-in la rezervarea X / cazează în camera Y" | `hotel_check_in(reservationId, roomId?)` — asignează cameră + deschide folio | `/hotel/front-desk?tab=arrivals` |
| „Trece consumul de la restaurant/bar/spa pe camera Z" | `hotel_charge_to_room(stayId, amount, posOutlet?, description?)` — majorează soldul folio, de plată la check-out | `/hotel/folios?tab=transactions` |
| „Adaugă un tip de cameră (Single/Dublă/Apartament)" | `create_hotel_room_type(name, code, baseRate?, …)` | `/hotel/room-types` |
| „Adaugă o cameră nouă" | `create_hotel_room(propertyId, roomTypeId, roomNumber, …)` | `/hotel/rooms` |
| „Cum stă fidelitatea hotelului / câți membri / câte puncte datorez" | `get_hotel_loyalty_overview` | `/hotel/crm` |
| „Câte puncte are oaspetele X / istoricul lui de puncte" | `get_guest_loyalty_detail(guestProfileId)` | `/hotel/guests` → `/hotel/crm` |

⚠ Cele de mai sus sunt SINGURELE tool-uri de hotel. Tot restul recepției **n-are tool** (vezi mai jos) — pentru ele navighezi + arăți, nu inventa apeluri.

## Navigare — pagini DISTINCTE, nu tab-uri pe o pagină
Modulul Hotel are **o pagină per zonă** (URL stabil), nu un singur `/hotel?tab=…`. Mergi direct cu `navigate(url)` (ruta exactă vine din `gaseste_in_aplicatie("…")` sau `navigare-rapida.md` — nu inventa):
- **`/hotel`** — Dashboard (ocupare, sosiri/plecări, venituri).
- **`/hotel/front-desk`** — Recepția = centrul zilnic. Are sub-taburi adresabile cu **`?tab=`**: `arrivals` (sosiri), `departures` (plecări), `inhouse` (cazați acum), `rack` (room rack), `nightaudit` (audit de noapte). Deci `/hotel/front-desk?tab=departures` te duce DIRECT la plecările de azi.
- **`/hotel/folios`** — note de cont; sub-taburi `?tab=transactions` (tranzacții) / `?tab=tax` (descompunere TVA).
- **`/hotel/rooms`** (camere + status), **`/hotel/room-types`** (tipuri), **`/hotel/housekeeping`** (curățenie).
- **`/hotel/rates`** (Rate Manager), **`/hotel/channels`** (Channel Manager / OTA), **`/hotel/groups`** (group blocks), **`/hotel/promo-codes`**.
- **`/hotel/guests`** (oaspeți), **`/hotel/crm`** (CRM & loialitate hotel), **`/hotel/guest-feedback`**, **`/hotel/reviews`**, **`/hotel/property-settings`**, **`/hotel/analytics`**.

Comutarea unității (brand+locație) e o stare a browserului — dacă hotelul e altă unitate decât cea activă, comut-o întâi (vezi `condu-chrome.md` regula g).

## Ce rămâne CLICK (n-are tool — navighează + arată, ghidează userul)
Multe operațiuni de recepție trăiesc doar în UI; pentru ele du userul la pagina potrivită și, dacă vrea, ghidează-l pas cu pas (sau apeși tu butonul prin Chrome doar dacă chiar n-are alt drum — vezi `condu-chrome.md` regula d):
- **Check-out + încasare + emitere factură** din folio — `/hotel/folios` (deschizi folio-ul, verifici cheltuielile, încasezi, scoți factura). Tu poți deschide folio-ul ca CITIRE (`list_hotel_folios`), dar închiderea/încasarea = în pagină. De știut: **plata parțială lasă folio-ul deschis** (rămâne soldul); nota tipărită **înainte de plată** e marcată **PROFORMA** (nu e document fiscal); cu opțiunea **„cere achitarea la check-out"** activă, check-out-ul nu se face cu folio neachitat.
- **Tarife & restricții (Rate Manager), reguli de yield, prețuri competitori** — `/hotel/rates`.
- **Conectare/sincronizare OTA (Booking/Expedia), paritate, mapări camere** — `/hotel/channels`. „Cameră vândută de două ori" = aici se verifică jurnalul de sincronizare.
- **Housekeeping** (marchezi camere curate/în lucru, aloci sarcini) — `/hotel/housekeeping`.
- **Group blocks / allotment** — `/hotel/groups`.
- **Night audit (execute)**, încuietori / door locks, push OTA — **AMÂNATE**: nu există prin conexiune (doar citești că auditul rulează). În timpul auditului, `hotel_charge_to_room` e blocat tăcut — explică userului că e temporar.

## Reguli (cele care contează)
- **Confirmă suma înainte de `hotel_charge_to_room`** — adaugă bani pe nota oaspetelui. Tool-ul **refuză** dacă depășește limita de credit pe cameră (house limit) → atunci e nevoie de aprobare de manager, fă operațiunea din aplicație. Charge-to-room **NU încasează** bani — doar crește soldul folio, de plată la check-out.
- **Modelul de venit pentru consumul pe cameră**: **„outlet"** (implicit) — consumul din restaurant rămâne venit al restaurantului, cu bonul lui; nota de cameră îl afișează doar informativ. **„folio"** — venitul se consolidează pe camera de hotel, fără bon la restaurant. Când userul întreabă „al cui e venitul de la room service / de ce nu iese bon la restaurant", verifică întâi ce model e ales.
- **Check-in cere camera curată** — doar camere `clean`/`inspected` primesc check-in; `dirty`/`occupied`/`maintenance`/`out_of_service` sunt refuzate. Dacă rezervarea n-are cameră asignată, dă `roomId` (vezi `list_hotel_rooms`).
- **`get_hotel_availability`: `to` = ziua de PLECARE, exclusivă** (3 nopți 10→13 = `from:2026-06-10, to:2026-06-13`). `roomTypeId` se ia din `get_hotel_availability` (listează tipurile) sau `list_hotel_rooms`.
- **Anularea = `update_hotel_reservation(status:"cancelled")`** — ștergerea de entități întregi NU e disponibilă prin conexiune; pentru ștergeri reale recomandă userului din aplicație.
- **Confirmă-prin-citire, nu prin screenshot**: după o scriere (rezervare/check-in/charge), tool-ul a întors `success` = e salvat; arată userul cu un `list_*` și spune-i să dea refresh dacă nu vede. Screenshot-ul e ca să-i ARĂȚI, nu ca să verifici (vezi `condu-chrome.md` regula f).
- **Folio ≠ notă de restaurant; loialitate hotel ≠ loialitate POS** — nopțile sunt în `/hotel/crm`, nu în `/loyalty` (vezi `hotel-pms.md` capcane).
- **Data de business** poate diferi de cea calendaristică (audit de noapte) — dashboard-ul și „sosiri azi" se raportează la ea.
- **Limbaj de hotelier** cu userul („ocupare", „note de cont", „sosiri/plecări", „trec consumul pe cameră"), nu jargon de tool (`folioId`, `stayId`, `brandId`).
- **Nu inventa** camere, tarife, oaspeți, solduri — ce nu știi, citești cu tool-ul sau întrebi userul.

## Legături
- Concepte + harta de pagini + fluxuri zilnice + capcane (OTA, folio, check-out, loialitate separată) → `knowledge/hotel-pms.md`.
- Doctrina „click rar" (tool → deep-link → click pe element; screenshot = livrabil; unitatea activă; fallback fără extensie) → `knowledge/condu-chrome.md`.
- Link exact la orice pagină → `gaseste_in_aplicatie("…")` (sursa autoritară de navigare) + `navigare-rapida.md`.
- Oaspeți & GDPR (export/anonimizare/merge profile) → ghidul „GDPR & date clienți" (`export_guest_gdpr_data`, `anonymize_guest`, `merge_guests`).
- Rezervări & evenimente (sală, petreceri, contracte/avansuri), CRM de vânzări → skill-urile `gestioneaza-crm` + `construieste-prezentare`; recenzii Booking/TripAdvisor → skill-ul `raspunde-recenzii`.
- Facturare fiscală a folio-ului → ghidul de finanțe (`finante-facturare-contabilitate.md`).
- Blocaj (ceva ce nu se poate prin conexiune — check-out, tarife, OTA, night audit) → ghidează în aplicație + `trimite_ticket_symbai` ca sugestie dacă lipsește un tool util.
