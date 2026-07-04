# Onboarding 08 — Rezervările (configurare)

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Context operațional complet despre rezervări: `../rezervari-clienti-evenimente.md`.

## Scopul fazei

La final, localul are un sistem de rezervări funcțional: setări active (online/manual, confirmare automată sau nu), program de rezervări pe zile, durate de ședere pe dimensiune de grup, reguli de avans și controlul ritmului de sosiri. Asta deblochează rezervările online din portalul clienților și munca zilnică a gazdei (listă rezervări, plan sală live, listă de așteptare). E ultima fază din configurarea de bază — după ea localul poate primi prima rezervare.

## Permisiuni necesare pe token

- **`setari`** — obligatoriu pentru toată configurarea: `seed_reservation_settings`, `configure_reservation_settings`, `configure_reservation_operating_hours`, `configure_reservation_turn_times`, `configure_reservation_deposit`, `configure_reservation_pacing`.
- **`rezervari_clienti`** — doar dacă vrei să și OPEREZI rezervări în această fază (rezervare de test, listă de așteptare, client nou): `create_reservation`, `update_reservation`, `cancel_reservation`, `create_waitlist_entry`, `update_waitlist_entry`, `create_customer`.

Diferența contează: configurarea regulilor e `setari`, lucrul cu rezervări concrete e `rezervari_clienti`. Fără modulul potrivit activat în portal Hub → Acces AI, tool-urile de scriere întorc „permisiune insuficientă" — cere utilizatorului să bifeze modulul pe token și reîncearcă.

Citirile (`get_reservations_overview`, `get_reservation_settings`, `list_brands`, `list_locations`, `list_floor_zones`) sunt disponibile mereu.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Afli singur (fă-le în ordinea asta, fără să anunți fiecare apel):**
1. `list_brands` + `list_locations` — brandId/locationId (dacă există unul singur din fiecare, nu întrebi nimic).
2. `get_reservations_overview(brandId)` — punctul de plecare: are deja setări? sunt active? are rezervări azi/mâine? câți pe lista de așteptare? Răspunsul îți dă scenariul:
   - **fără setări** → configurezi de la zero (seed);
   - **setări existente dar `enabled: false`** → întrebi doar dacă le activezi;
   - **setări active** → rezumi și întrebi doar ce vrea ajustat — NU reconfigura peste.
3. `get_reservation_settings(brandId[, locationId])` — detaliile exacte ale setărilor existente (și pe ce rând stau: brand sau locație — vezi Capcane).
4. `list_floor_zones(locationId)` — există plan de sală/zone? Rezervările pe mese funcționează cel mai bine după faza de Sală.

**Întrebi utilizatorul (minimul):**
1. *„Ce tip de local ai? (restaurant, restaurant mare, fast food, bar, cafenea, restaurant de hotel, catering, club)"* — singura întrebare cu adevărat obligatorie; alege șablonul de pornire.
2. *„În ce interval primiți rezervări? (ex. luni–joi 12:00–22:00, vineri–sâmbătă până la 23:00, duminică până la 21:00)"* — șablonul NU setează programul (vezi Capcane); întreabă și ora ultimei rezervări acceptate dacă diferă de închidere.
3. Confirmare scurtă înainte de scriere: *„Configurez rezervările pentru restaurant: online activ, confirmare automată, durată standard 105 minute, fără avans. E ok sau ajustez ceva (avans, confirmare manuală)?"*

Nu întreba parametru cu parametru (durate, pacing, surse) — șablonul le acoperă; ajustezi doar ce cere omul. În conversație folosește limbaj de business: „cât stă în medie un grup la masă" (nu „turn time"), „câți clienți noi pot sosi pe sfert de oră" (nu „pacing"), „avans" (nu „deposit").

## Pașii de execuție — tool-urile MCP exacte

**Pas 1 — Seed pe tipul de business** (modul `setari`):
```
seed_reservation_settings(brandId=1, businessType="restaurant")
```
`businessType` ∈ `restaurant | restaurant_mare | fast_food | bar | cafenea | hotel_restaurant | catering | club`. Aplică un șablon complet (upsert — actualizează dacă există deja): activare, online, confirmare, durate pe grup, limite persoane, tipuri și surse de rezervare, politică de anulare, avans unde e cazul. Repere: `restaurant` = online + auto-confirmare, 105 min, max 20 pers, fără avans; `restaurant_mare`/`hotel_restaurant` = confirmare manuală + avans 30%; `catering` = totul manual, avans 50%, rezervări cu 180 zile în avans; `club` = avans fix 200 RON; **`fast_food` = rezervările rămân DEZACTIVATE** (doar walk-in).

**Pas 2 — Programul de rezervări** (seed-ul nu îl setează!):
```
configure_reservation_operating_hours(brandId=1,
  monday={open:"12:00", close:"22:00", lastReservation:"20:30"},
  ... ,
  sunday={closed:true})
```
Trimite TOATE zilele într-un singur apel — programul e ÎNLOCUIT integral la fiecare apel (zilele netransmise dispar din program, nu rămân cum erau); o zi închisă = `{closed:true}`. `lastReservation` = ultima oră la care se mai acceptă o rezervare.

**Pas 3 — Ajustări granulare, doar la cerere** (toate upsert, modul `setari`):
- Durate pe grup: `configure_reservation_turn_times(brandId, turnTimes=[{size:"1-2",duration:90},{size:"3-4",duration:105},{size:"7+",duration:150}])` — `turnTimes` obligatoriu.
- Avans: `configure_reservation_deposit(brandId, requireDeposit=true, depositPercent="30.00", largePartyThreshold=8, largePartyRequiresMenu=true)` — sumă fixă `depositAmount="100.00"` SAU procent, ca string-uri.
- Ritm sosiri: `configure_reservation_pacing(brandId, maxCoversPer15min=20, maxPartySize=20, maxOnlinePartySize=8)`.
- Orice alt câmp (mesaj de confirmare, politică de anulare, `autoConfirm`, `onlineBookingEnabled`, `advanceBookingDays`, `minAdvanceHours`, `reservationTypes`, `sources`, `enabled`): `configure_reservation_settings(brandId, ...)` — doar `brandId` obligatoriu, trimite numai câmpurile schimbate.

**Pas 4 — Confirmă prin CITIRE, nu prin interfață:**
```
get_reservation_settings(brandId=1)
```
După orice scriere verifici cu un tool de citire. UI-ul are cache în browser — utilizatorul vede setările noi abia după refresh; dacă zice „nu apare", spune-i să dea refresh, NU repeta scrierea și nu raporta bug.

**Opțional — rezervare de test** (modul `rezervari_clienti`, doar cu acordul utilizatorului):
```
create_reservation(brandId=1, customerName="Test Onboarding", guestCount=2,
  date="2026-06-15", time="19:00")
```
Obligatorii: `brandId, customerName, guestCount, date (YYYY-MM-DD), time (HH:mm)`. Statusul rezultat respectă `autoConfirm` (confirmed/pending), iar mesajul îți spune dacă cere avans/meniu. Apoi `cancel_reservation(reservationId=..., brandId=1, reason="test onboarding")` — atenție, anularea doar schimbă statusul în „anulată", rezervarea rămâne în istoric (ștergerea completă e doar din aplicație). Avertizează utilizatorul înainte.

**Idempotență**: toate tool-urile `configure_*`/`seed_*` fac upsert — re-rularea nu duplică setări (cu o excepție de scope, vezi Capcane). Pentru rezervări concrete, verifică întâi cu `get_reservations_overview` să nu creezi dubluri.

## Ce se face DOAR din aplicație

- **Câmpurile formularului de rezervare** (ce e vizibil/obligatoriu la creare: telefon, email, ospătar, etichete, notițe) — tabul „Câmpuri Formular" din Configurare Rezervări. Ghidare: `gaseste_in_aplicatie(intrebare="configurare rezervări câmpuri formular")`. După ce userul termină, `get_reservations_overview` întoarce `fieldConfig` — verifici că nu mai e gol.
- **Inventar & Zone** (ce zone/mese sunt rezervabile, politici pe zonă) — tab în Configurare Rezervări; **Control Disponibilități** (blocări de date) — tab în pagina Rezervări, NU în Configurare: `gaseste_in_aplicatie(intrebare="control disponibilități rezervări zone")`.
- **Tipurile de rezervare „bogate" (evenimente: nuntă, corporate, petrecere)** cu fișă completă (contract, BEO, P&L) — se definesc în Setări → Sales CRM → Tipuri rezervări, altă entitate decât lista simplă `reservationTypes` din setările de mai sus: `gaseste_in_aplicatie(intrebare="tipuri rezervări evenimente")`. E subiect pentru faza de CRM/evenimente, nu insista aici.
- **Ștergerea definitivă a unei rezervări** — nu există prin conexiune; doar din pagina Rezervări.
- **Operarea zilnică a gazdei** (plan sală live, așezarea clienților la masă) — pagina Rezervări: `gaseste_in_aplicatie(intrebare="rezervări plan sală live")`.

## Echivalentul în wizard-ul din aplicație

Pasul **13** la `/onboarding/step/13` — „Rezervări & Finalizare Bază", ultimul pas din onboarding-ul de bază (pașii 1–13); agentul lui din aplicație („Sym Reservations") folosește aceleași tool-uri ca tine. Pagina pasului arată statistici live + butoane către Configurare Rezervări și Rezervări. Datele pe care le scrii prin conexiune SUNT văzute de wizard (statisticile și starea se actualizează), dar **progresul wizard-ului (bifa de pas completat) NU se actualizează prin conexiune** — utilizatorul bifează pasul manual dacă folosește și wizard-ul.

## Verificare la final

1. `get_reservation_settings(brandId)` → există rândul de setări, `enabled: true` (excepție fast food), `autoConfirm`/`onlineBookingEnabled` conform deciziei, `operatingHours` completat (nu null!), `turnTimes` cu cel puțin 3 intervale.
2. `get_reservations_overview(brandId)` → mesajul începe cu „Rezervari: active"; `hasSettings: true`.
3. Dacă s-a făcut rezervarea de test: apare în `todayDetails`/numărătoare, apoi după anulare statusul ei e `cancelled`.
4. Dacă utilizatorul vrea rezervări online din portalul clienților: pe lângă `onlineBookingEnabled: true`, funcția „rezervări" trebuie să fie activă și în configurarea portalului (`get_portal_config`; activare cu `configure_portal_features(brandId, reservations=true)` — modul `setari`). Detalii în faza de portal.

## Capcane

- **Seed-ul NU setează programul.** Niciun șablon nu include `operatingHours` — fără Pasul 2, setările arată complete dar programul e gol. Întreabă mereu programul.
- **Seed-ul SUPRASCRIE ajustările.** `seed_reservation_settings` rescrie toate câmpurile din șablon. Ordinea corectă: seed ÎNTÂI, ajustări granulare DUPĂ. Nu re-rula seed-ul ca „refresh" după ce ai personalizat ceva.
- **Consistența scope-ului brand vs locație.** Tool-urile granulare (`operating_hours`/`turn_times`/`deposit`/`pacing`) fără `locationId` țintesc strict rândul de brand (fără locație) și pot CREA un al doilea rând dacă seed-ul a fost dat cu `locationId`. `configure_reservation_settings` și `seed` se agață de primul rând găsit pe brand, indiferent de locație. Regulă practică: alege un singur scope la început (recomandat doar `brandId` la o singură locație) și folosește-l IDENTIC în toate apelurile fazei; după fiecare scriere, `get_reservation_settings` confirmă că e tot UN rând.
- **`brandId` e necesar și unde schema nu-l cere.** `update_reservation`, `cancel_reservation`, `update_waitlist_entry` și `get_reservations_overview` refuză execuția fără `brandId`, deși în schemă pare opțional. Trimite-l mereu.
- **Rezervarea creată de tine ocolește limitele.** `create_reservation` prin conexiune e tratată ca acțiune de personal: poate depăși `maxPartySize`, programul și ritmul de sosiri. Limitele se aplică doar rezervărilor online ale clienților — nu „testa" limitele creând rezervări, citește setările.
- **`fast_food` dezactivează rezervările** (`enabled: false`). Dacă utilizatorul de fast food vrea totuși rezervări, după seed dă `configure_reservation_settings(brandId, enabled=true, ...)`.
- **`depositAmount`/`depositPercent` sunt string-uri** (`"100.00"`, `"30.00"`), nu numere.
- **Anularea nu șterge.** `cancel_reservation` doar marchează „anulată" — rezervarea de test rămâne vizibilă în listă. Spune-i utilizatorului înainte să creezi una.
- **Două sisteme de „tipuri".** `reservationTypes` din setări = listă simplă de etichete pentru rezervări de masă. „Tipuri rezervări" din Sales CRM = evenimente cu fișă bogată. Nu le confunda când utilizatorul zice „vreau tip de rezervare pentru nunți" — acela e CRM (din aplicație).
- **Jargon în conversație**: niciodată „turn time/pacing/endpoint/seed" către utilizator — „cât stă un grup la masă", „câți clienți noi pe 15 minute", „șablon de pornire".
