---
name: gestioneaza-hotel
description: Recepția și managementul hotelului prin conexiunea Symbai — ocupare, disponibilitate, rezervări (creare, modificare, anulare cu previzualizare, neprezentare), oaspeți, check-in cu actul de identitate, walk-in, mutare în altă cameră, check-out, note de cont (consum, transfer, încasare), housekeeping și mentenanță, minibar, închiderea zilei, tarife, restricții și canale (Booking/Expedia), grupuri, coduri promo, recenzii, feedback și indicatori. La „cum stă hotelul azi", „am camere libere între X și Y", „fă o rezervare", „anulează rezervarea", „fă check-in / check-out", „trece consumul pe camera 204", „ce camere sunt de făcut", „rulează închiderea zilei", „schimbă tariful în weekend", „răspunde la recenzia de pe Booking".
---

# Gestionează hotelul — recepție și management prin conexiune

Utilizatorul e proprietar, manager sau recepționer de hotel ori pensiune. Vrea răspunsuri și acțiuni rapide: cum stă ocuparea azi, are camere libere, cine sosește și cine pleacă, cine are de plată, fă o rezervare, cazează oaspetele, trece consumul pe cameră, închide ziua. **Aproape tot se face prin conexiune (tool-urile de hotel), rapid și cu toate verificările aplicației. Browserul îl folosești doar ca să-i ARĂȚI rezultatul pe pagina potrivită, cu link direct.** Modulul Hotel apare doar dacă activitatea de hotel e configurată pe unitate.

## Înainte de orice
1. Citește **`knowledge/hotel-pms.md`** (sejur, notă de cont, tarife, canale, housekeeping, grupuri, loialitatea hotelului; paginile; fluxurile zilnice; capcanele) și **`knowledge/condu-chrome.md`** (tool întâi → link direct → click doar la nevoie; captura de ecran e ca să-i arăți, nu ca să verifici).
2. **Unitatea**: `list_brands` + `list_locations` → `brandId`/`locationId`. Tool-urile de hotel le deduc singure dacă firma are o singură unitate; altfel le dai explicit. Dacă pe aceeași unitate sunt mai multe hoteluri, dai și `propertyId` (îl vezi în `get_hotel_property_settings`). „Azi" înseamnă **ziua de lucru a hotelului** (se schimbă la închiderea zilei), nu neapărat data din calendar.
3. **Drepturi**: citirile cer modulul **Hotel** la citire; acțiunile îl cer și la scriere („Permisiune insuficientă" → proprietarul îl bifează din portalul Hub → Acces AI). Acțiunile se fac **în numele angajatului conectat**, cu rolul și unitățile lui: dacă rolul nu permite, de exemplu, anularea sau încasarea, aplicația refuză — spune-i utilizatorului cine are dreptul, nu căuta ocolișuri. O conexiune de firmă fără persoană vede cel mult sumarele de bază; pentru operațiile de recepție primește un mesaj clar că trebuie conectată nominal (skill-ul `conecteaza-symbai`).

## ⛔ Regula de aur: confirmă înainte de orice acțiune
- Înainte de fiecare scriere spune exact ce se va întâmpla (oaspetele, camera, perioada, suma, canalul) și **așteaptă „da"**. Acordul pentru o operație nu acoperă alta.
- Cu atât mai mult când acțiunea: **mută bani** (consum pe cameră, încasare, transfer între note, penalitate, depozit), **anulează** sau marchează **neprezentare**, face **check-out**, **publică în afară** (tarife, restricții sau disponibilitate trimise spre Booking/Expedia, reluarea sincronizării, răspuns public la o recenzie) sau **închide ziua**.
- Unde există, arată întâi **previzualizarea**: `preview_hotel_cancellation` (penalitate, depozit, sumă de returnat), `get_hotel_early_checkout_quote`, `simulate_hotel_night_audit`, soldul din `get_hotel_folio`.
- După acțiune **recitește** starea (lista sau detaliul) și spune ce s-a schimbat + unde se vede. La eroare sau timeout recitește înainte de a relua; reluarea aceleiași operații cu aceeași cheie (`idempotencyKey`) nu o dublează, iar o a doua operație identică, voită, primește o cheie nouă.

## Intenție → tool → unde o arăți

Întâi tool-ul. Apoi, dacă utilizatorul vrea să vadă, deschide pagina cu link direct (vezi `condu-chrome.md`).

**Ziua la recepție**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Cum stă hotelul azi / ocupare / sosiri și plecări" | `get_hotel_dashboard_stats` | `/hotel` |
| „Cine sosește / pleacă azi, ce rezervări am" | `list_hotel_reservations` (filtre de dată și status) | `/hotel/front-desk?tab=arrivals` / `?tab=departures` |
| „Cine e cazat acum" | `list_hotel_stays` | `/hotel/front-desk?tab=inhouse` |
| „Ce camere am / câte libere, murdare, scoase din uz" | `list_hotel_rooms(status?)` | `/hotel/rooms` sau `/hotel/front-desk?tab=rack` |
| „Am camere libere între X și Y" | `get_hotel_availability(from, to)` — `to` = ziua plecării, exclusivă | `/hotel/front-desk` |

**Rezervări și oaspeți**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Caută oaspetele X / fișa lui" | `search_hotel_guests` → `get_hotel_guest` | `/hotel/guests` |
| „Adaugă / corectează datele oaspetelui" | `create_hotel_guest` / `update_hotel_guest` | `/hotel/guests` |
| „Fă o rezervare" | `get_hotel_availability` → `create_hotel_reservation` (cu oaspetele din `search_hotel_guests`) | `/hotel/front-desk` |
| „Mută data / schimbă camera, persoanele sau tariful" | `modify_hotel_reservation` — reverifică disponibilitatea și recalculează totalul | `/hotel/front-desk` |
| „Anulează rezervarea" | `preview_hotel_cancellation` → acord → `cancel_hotel_reservation` | `/hotel/front-desk` |
| „Oaspetele nu a venit" | `mark_hotel_no_show` (după acord) | `/hotel/front-desk?tab=arrivals` |
| „Listă de așteptare / parcare / obiecte pierdute" | tool-urile de hotel dedicate (caută-le cu `cauta_tool`) | `/hotel/front-desk` |

**Check-in, mutări, check-out**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Fă check-in la rezervarea X" | `hotel_check_in` (camera + actul de identitate verificat) | `/hotel/front-desk?tab=arrivals` |
| „A venit cineva fără rezervare" | `hotel_walk_in` | `/hotel/front-desk` |
| „Mută oaspetele în altă cameră" | `hotel_room_change` | `/hotel/front-desk?tab=inhouse` |
| „Fă check-out" | `get_hotel_folio` (sold) → acord → `hotel_check_out` | `/hotel/front-desk?tab=departures` |
| „Pleacă mai devreme" | `get_hotel_early_checkout_quote` → acord → `confirm_hotel_early_checkout` | `/hotel/front-desk?tab=inhouse` |

**Note de cont (folio)**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Ce note sunt deschise / cine are de plată" | `list_hotel_folios(status?)` | `/hotel/folios` |
| „Ce e pe nota camerei 204" | `get_hotel_folio` | `/hotel/folios?tab=transactions` |
| „Trece consumul pe camera 204" (manual, în afara POS) | `post_hotel_folio_charge` (după acord pe sumă) | `/hotel/folios?tab=transactions` |
| „Mută consumurile pe altă notă" | `transfer_hotel_folio_charges` | `/hotel/folios` |
| „Încasează nota" | `settle_hotel_folio` (suma și metoda confirmate; emite documentul fiscal) | `/hotel/folios` |
| „Ce depozite / garanții am" | `list_hotel_deposits` | `/hotel/folios` |
| „Ce e în minibar / aprovizionează minibarul" | `get_hotel_room_stock` / `restock_hotel_room` / `list_hotel_room_restock_history` | `/hotel/rooms` |

**Housekeeping și mentenanță**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Ce camere sunt de făcut azi" | `list_hotel_housekeeping_tasks` | `/hotel/housekeeping` |
| „Generează și împarte curățenia zilei" | `generate_hotel_housekeeping_day` → `auto_assign_hotel_housekeeping` | `/hotel/housekeeping` |
| „Camera 204 e gata / inspectată / scoasă din uz" | `update_hotel_housekeeping_task` / `inspect_hotel_room` / `set_hotel_rooms_status` | `/hotel/housekeeping` |
| „S-a stricat ceva în cameră" | `create_hotel_maintenance_ticket` / `update_hotel_maintenance_ticket` / `list_hotel_maintenance_tickets` | `/hotel/housekeeping` |

**Închiderea zilei (night audit)**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Pot închide ziua? ce blochează" | `get_hotel_night_audit_status` → `simulate_hotel_night_audit` | `/hotel/front-desk?tab=nightaudit` |
| „Închide ziua" | acord → `run_hotel_night_audit`; excepțiile: `resolve_hotel_night_audit_exception` | `/hotel/front-desk?tab=nightaudit` |

**Tarife, canale, grupuri**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Ce tarife am în perioada X" | `list_hotel_rate_plans` → `get_hotel_rate_calendar` | `/hotel/rates` |
| „Schimbă prețul / pune durată minimă / închide vânzarea" | `set_hotel_rate_prices` / `set_hotel_rate_restrictions` (după acord pe interval și valori) | `/hotel/rates` |
| „Ce prețuri îmi recomandă sistemul" | `get_hotel_price_recommendations` → `approve_hotel_price_recommendation` / `reject_hotel_price_recommendation` | `/hotel/rates` |
| „Coduri promo" | `list_hotel_promo_codes` / `create_hotel_promo_code` / `update_hotel_promo_code` | `/hotel/promo-codes` |
| „Merge Booking/Expedia? paritate" | `get_hotel_channel_status` / `get_hotel_rate_parity` | `/hotel/channels` |
| „Retrimite disponibilitatea / oprește sau repornește un canal" | `push_hotel_ari` / `replay_hotel_ota_sync` / `pause_hotel_channel` / `resume_hotel_channel` (după acord) | `/hotel/channels` |
| „Blochează camere pentru un grup" | `list_hotel_group_blocks` / `create_hotel_group_block` / `update_hotel_group_block` | `/hotel/groups` |

**După sejur și rapoarte**
| Utilizatorul vrea… | Tool | Pagina |
|---|---|---|
| „Ce recenzii am / răspunde la recenzie" | `list_hotel_reviews` → `reply_hotel_review` (textul aprobat de utilizator) | `/hotel/reviews` |
| „Ce feedback au lăsat oaspeții / recuperează un nemulțumit" | `get_hotel_feedback` → `update_hotel_feedback_recovery` | `/hotel/guest-feedback` |
| „Ocupare, ADR, RevPAR, GOP" | `get_hotel_kpis` | `/hotel/analytics` |
| „Cum stă fidelitatea hotelului / punctele oaspetelui" | `get_hotel_loyalty_overview` / `get_guest_loyalty_detail` | `/hotel/crm` |
| „Setările hotelului / camere și tipuri" | `get_hotel_property_settings` / `update_hotel_property_settings`, `create_hotel_room` / `update_hotel_room`, `create_hotel_room_type` / `update_hotel_room_type` | `/hotel/property-settings`, `/hotel/rooms`, `/hotel/room-types` |

Numele exacte și parametrii îi citești din schema live (`cauta_tool` → schema). Dacă un tool din tabel lipsește la tine, instanța are o versiune mai veche sau conexiunea nu are dreptul: fă operația din pagina indicată și nu inventa apeluri.

## Navigare — o pagină pe zonă
Modulul Hotel are **o pagină pe zonă** (adresă stabilă). Mergi direct cu linkul (ruta exactă o dă `gaseste_in_aplicatie("…")` sau `navigare-rapida.md` — nu inventa):
- **`/hotel`** — panoul zilei (ocupare, sosiri, plecări, venituri).
- **`/hotel/front-desk`** — recepția, centrul zilnic, cu sub-taburi **`?tab=`**: `arrivals` (sosiri), `departures` (plecări), `inhouse` (cazați acum), `rack` (harta camerelor), `nightaudit` (închiderea zilei).
- **`/hotel/folios`** — note de cont; `?tab=transactions` (mișcări) / `?tab=tax` (defalcarea TVA).
- **`/hotel/rooms`** (camere și stare), **`/hotel/room-types`** (tipuri), **`/hotel/housekeeping`** (curățenie și mentenanță).
- **`/hotel/rates`** (tarife, restricții, recomandări), **`/hotel/revenue`** (venituri), **`/hotel/channels`** (Booking/Expedia), **`/hotel/groups`** (grupuri), **`/hotel/promo-codes`**.
- **`/hotel/guests`** (oaspeți), **`/hotel/crm`** (loialitatea hotelului), **`/hotel/guest-feedback`**, **`/hotel/reviews`**, **`/hotel/property-settings`**, **`/hotel/analytics`**.

Unitatea activă (brand + locație) e o stare a browserului — dacă hotelul e altă unitate decât cea activă, comut-o întâi (vezi `condu-chrome.md`).

## Reguli care contează
- **Check-in**: cere actul de identitate verificat (tipul și numărul) și o cameră **curată sau inspectată**. Dacă aplicația refuză (cameră nepregătită, rezervare anulată sau deja plecată, altă zi decât ziua de lucru, act lipsă), spune-i utilizatorului motivul și ce are de făcut; nu forța altă cameră și nu completa date inventate.
- **Anularea se face numai prin `preview_hotel_cancellation` → `cancel_hotel_reservation`**: previzualizarea arată penalitatea, depozitul reținut și ce se returnează; anularea folosește exact valorile din previzualizare. Nu anula și nu marca neprezentare schimbând rezervarea (`modify_hotel_reservation` nu schimbă statusul). Ștergerea completă a unei rezervări nu există prin conexiune.
- **Consum pe cameră**: `post_hotel_folio_charge` crește soldul notei de cont, **nu încasează** bani. O notă din POS (restaurant, bar) se trece pe cameră **din POS, la plată, cu „Trece pe cameră"** — nu o posta și pe nota de cont, s-ar dubla. Dacă se depășește limita de credit a camerei, e nevoie de aprobarea managerului în aplicație.
- **Al cui e venitul consumului pe cameră**: pe **„outlet"** (implicit) rămâne venitul restaurantului, cu bonul lui, iar nota de cont îl arată doar informativ; pe **„folio"** se consolidează la hotel, fără bon la restaurant. La „de ce nu iese bon la restaurant" verifică întâi ce variantă e aleasă în setările hotelului.
- **Încasarea** (`settle_hotel_folio`) emite documentul fiscal: confirmă suma și metoda. O **plată parțială lasă nota deschisă** (rămâne soldul); nota tipărită **înainte de plată** e **PROFORMA** (nu e document fiscal); cu opțiunea **„cere achitarea la check-out"** activă, check-out-ul nu trece cu sold neachitat.
- **`get_hotel_availability`: `to` = ziua PLECĂRII, exclusivă** (3 nopți 10→13 = `from: 2026-06-10, to: 2026-06-13`). `roomTypeId` îl iei de aici, `roomId` din `list_hotel_rooms`, sejurul din `list_hotel_stays`, nota din `list_hotel_folios`.
- **Închiderea zilei** schimbă ziua de lucru a hotelului. Rulează `simulate_hotel_night_audit`, arată ce blochează și cere acordul. Cât rulează, unele acțiuni (de exemplu consumul pe cameră) sunt blocate temporar — explică, nu reîncerca în buclă.
- **Tarifele, restricțiile și retrimiterile spre canale ajung pe Booking/Expedia**: confirmă intervalul, tipurile de cameră și valorile înainte. Dacă o cameră pare vândută de două ori, verifică întâi `get_hotel_channel_status` (erori de sincronizare).
- **Răspunsul la o recenzie e public**: scrie o propunere, arat-o și publică doar textul aprobat.
- **Indicatori**: `get_hotel_kpis` poate întoarce GOP gol, cu motiv (de exemplu lipsesc costurile perioadei) — spune motivul, nu raporta zero.
- **Nota de cont ≠ nota de restaurant; loialitatea hotelului ≠ loialitatea POS** — nopțile și punctele hotelului sunt în `/hotel/crm`, nu în `/loyalty`.
- **Verifică prin citire, nu prin captură**: după o acțiune reușită recitește lista sau detaliul; captura de ecran e doar ca să-i arăți.
- **Limbaj de hotelier** („ocupare", „note de cont", „sosiri/plecări", „trec consumul pe cameră"), fără nume tehnice de câmpuri.
- **Nu inventa** camere, tarife, oaspeți, solduri sau acte — ce nu știi citești cu tool-ul sau întrebi utilizatorul.

## Legături
- Concepte, pagini, fluxuri zilnice și capcane → `knowledge/hotel-pms.md`.
- Tool întâi → link direct → click doar la nevoie; unitatea activă → `knowledge/condu-chrome.md`.
- Link exact la orice pagină → `gaseste_in_aplicatie("…")` + `navigare-rapida.md`.
- Oaspeți și GDPR (export, anonimizare, dubluri) → skill-ul `gestioneaza-date-clienti-gdpr` (`export_guest_gdpr_data`, `anonymize_guest`, `find_duplicate_guests`, `merge_guests`).
- Evenimente, săli, contracte și avansuri; CRM de vânzări → `gestioneaza-crm`; recenziile în general → `raspunde-recenzii`.
- Facturarea fiscală a notei de cont → `knowledge/finante-facturare-contabilitate.md`.
- Ceva ce chiar nu se poate prin conexiune → ghidează în aplicație și trimite o sugestie cu `trimite_ticket_symbai`.
