# Onboarding 06 — Planul de sală și codurile QR pe mese

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final există structura completă a sălii: **zone** (salon, terasă, bar...), **mese** cu capacitate și formă, cel puțin o **configurație de sală** cu **raioane** (grupuri de mese per ospătar) și, opțional, un **program săptămânal** de configurații. Pe mese există coduri QR prin care clienții comandă singuri de pe telefon. Fazele următoare depind de asta: turele ospătarilor se leagă de raioane (rutarea comenzilor QR), rezervările se leagă de mese, iar POS-ul de sală nu funcționează fără mese.

Ierarhia conceptelor: **Zonă** (spațiu fizic, conține mese) → **Masă** (nume, locuri, formă) → **Configurație** (snapshot de layout: ce zone sunt active + pozițiile pe hartă + raioanele) → **Program** (ce configurație e activă în fiecare zi) → **Raion** (grup de mese dintr-o configurație, asignat unui ospătar prin tură).

În conversația cu utilizatorul nu folosi jargon intern: spune „configurație de sală" (nu „floor config"), „raion" (nu „secțiune/sectionId"), „harta sălii" (nu „canvas/zonesMap").

## Permisiuni necesare pe token

- **`setari`** — toate tool-urile de scriere ale fazei (zone, mese, configurații, program, raioane). Fără el primești „permisiune insuficientă" → trimite utilizatorul în portal Hub → Acces AI să bifeze modulul.
- Codurile QR pe mese **nu au tool de scriere** — se generează din aplicație (vezi mai jos). Pentru verificarea lor prin date e util comutatorul **SQL doar-citire** pe token (opțional).

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citește automat (nu pune întrebări la care există deja răspuns):**
- `list_brands` + `list_locations` — aproape toate tool-urile fazei cer `brandId` și `locationId`; dacă există un singur brand/locație, nu întreba nimic.
- `list_floor_zones` (opțional `locationId`) — ce zone există deja.
- `list_entities` cu `entityType:"floor_tables"`, `"floor_configs"`, `"floor_config_schedules"` (+ `brandId`) — mesele, configurațiile (cu raioanele din `configData.sections`) și programul existente. Așa decizi ce lipsește, nu duplici.
- `get_config_status(brandId)` — procentul general de configurare, util pentru raportare.

**Întrebări MINIME (o singură replică, apoi execută):**
1. „Ce zone are localul și câte mese în fiecare? (ex: salon 20 de mese, terasă 10, bar 6)" — cere și locuri/masă dacă diferă de 4.
2. „Folosești layout-uri diferite pe zile sau sezoane? (ex: vara cu terasă, iarna doar interior)" — dacă NU, faci o singură configurație „Standard" și sari programul.
3. „Câți ospătari lucrează de obicei pe tură?" — atâtea raioane creezi. Cu un singur ospătar, raioanele nu sunt necesare.
4. Doar dacă e relevant: „Vrei ca clienții să comande singuri scanând un cod QR de pe masă?" — dacă da, la final îl ghidezi să genereze QR-urile din aplicație.

Confirmă planul pe scurt înainte de scrieri („Creez: Salon cu 20 mese S1–S20, Terasă cu 10 mese T1–T10, un raion per ospătar — ok?"), apoi execută tot, fără să ceri permisiunea la fiecare apel.

## Pașii de execuție — tool-urile MCP exacte

Ordinea contează (dependențe de ID-uri). După FIECARE scriere, confirmă printr-o CITIRE (`list_floor_zones`, `list_entities`), nu prin interfață — UI-ul are cache și arată datele abia după refresh.

**1. Zonele — `create_floor_zone`** (obligatorii: `name`, `brandId`, `locationId`; opțional `color` hex)
```json
{"name": "Terasă", "brandId": 1, "locationId": 1, "color": "#10B981"}
```
Idempotent: dacă există o zonă cu același nume, întoarce zona existentă (mesaj „există deja"), nu duplică. Culori sugerate: Salon `#3B82F6`, Terasă `#10B981`, Bar `#8B5CF6`, VIP `#F59E0B`. Reține `id`-ul fiecărei zone din răspuns.

**2. Mesele — `bulk_create_floor_tables`** (obligatorii: `zoneId`, `prefix`, `count`, `brandId`; opțional `seats` default 4, `shape` din `square|round|rectangle` default square, `startNumber` default 1)
```json
{"zoneId": 5, "prefix": "T", "count": 10, "seats": 4, "shape": "round", "brandId": 1}
```
Creează T1–T10; mesele cu nume deja existent în zonă sunt sărite (idempotent). Răspunsul conține `data.ids` — **păstrează-le**, sunt id-urile de masă necesare la raioane (pasul 5). Pentru o masă atipică individuală: `create_floor_table` (`zoneId`, `tableNumber`, `seats`, `brandId`; opțional `shape`). Corecții ulterioare: `update_floor_table` (`tableId`, `brandId` + `name`/`seats`/`shape`), `update_floor_zone` (`zoneId`, `brandId` + `name`/`color`), `bulk_assign_tables_to_zone` (`zoneId` + `tableIds`) pentru mutat mese între zone.

**3. Configurația de sală — `create_floor_config`** (obligatorii: `name`, `brandId`, `locationId`)
```json
{"name": "Standard", "brandId": 1, "locationId": 1}
```
⚠ NU pasa `zoneIds` aici — vezi Capcane #1. Idempotent pe nume+locație. Minim o configurație chiar dacă nu există sezonalitate.

**4. Leagă zonele de configurație — `add_zones_to_config`** (obligatorii: `floorConfigId`, `zoneIds`)
```json
{"floorConfigId": 3, "zoneIds": [4, 5, 6]}
```
Pasul acesta pune și mesele zonelor pe harta configurației, cu poziții implicite în grilă — abia după el funcționează asignarea pe raioane. Aranjarea estetică o face utilizatorul în Designer.

**5. Raioanele — `add_sections_to_config`** (obligatorii: `floorConfigId`, `sections` = listă de `{name, color}`)
```json
{"floorConfigId": 3, "sections": [{"name": "Raion A", "color": "#EF4444"}, {"name": "Raion B", "color": "#3B82F6"}]}
```
Răspunsul conține `data.newSections` cu id-urile generate (string-uri gen `sec_...`). **NU e idempotent** — vezi Capcane #2. Apoi **`assign_tables_to_section`** (obligatorii: `floorConfigId`, `sectionId` = string-ul raionului, `tableDbIds` = id-urile meselor din pasul 2):
```json
{"floorConfigId": 3, "sectionId": "sec_1718...", "tableDbIds": [11, 12, 13, 14, 15]}
```
Împarte mesele logic, pe proximitate (S1–S10 raion A, S11–S20 raion B). Dacă răspunsul spune că mesele nu sunt încă pe hartă, rulează întâi pasul 4.

**6. Programul săptămânal (doar dacă există mai multe configurații) — `create_floor_config_schedule`** (obligatorii: `brandId`, `dayOfWeek`, `floorConfigId`, `locationId`)
```json
{"brandId": 1, "dayOfWeek": 1, "floorConfigId": 3, "locationId": 1}
```
⚠ `dayOfWeek`: **0=Duminică**, 1=Luni ... 6=Sâmbătă. Un apel per zi; re-apelarea pe aceeași zi actualizează (upsert, sigur la re-rulare). Pentru variante rapide: `duplicate_floor_config` (`sourceFloorConfigId`; opțional `name`, `targetLocationId`, `copySchedules`) — copiază layout + raioane, apoi modifici copia.

**7. QR-urile pe mese** — fără tool MCP; ghidezi utilizatorul în aplicație (secțiunea următoare).

Dacă totul există deja (zone + mese + configurație), nu re-crea nimic — raportează starea și treci la ce lipsește (raioane? program? QR?).

## Ce se face DOAR din aplicație

- **Aranjarea vizuală a hărții** (drag & drop mese, redimensionare, rotire, pereți, bar, decor, vederi separate Web/App mobil). Prin MCP creezi doar structura; pozițiile rămân în grilă implicită. Ghidare: `gaseste_in_aplicatie("plan sală designer aranjare mese")`. Modificările devin active după butonul „Salvează" din Designer.
- **Generarea și printarea codurilor QR pe mese**: pagina Coduri QR are buton care generează automat câte un cod unic pentru fiecare masă fără QR + printare directă / descărcare PDF. Ghidare: `gaseste_in_aplicatie("generare coduri QR mese")`. Linkul codat e de forma `/t/<cod>` — codul rămâne fix, deci QR-urile printate nu trebuie refăcute. Spune-i utilizatorului că generarea se face DUPĂ ce mesele există (altfel n-are pentru ce genera).
- **Aspectul meniului scanat** (temă, imagini, coloane) — profilul „Table — Clienți (QR)" din Configurare Afișaj: `gaseste_in_aplicatie("configurare afișaj meniu QR clienți")`.
- **Regulile comenzii prin QR** (date client cerute, confirmare de către ospătar înainte de bucătărie, plată online directă) — secțiunea „QR Self-Service" de pe același profil „Table — Clienți (QR)" din Configurare Afișaj (la nivel de brand) sau, pentru reguli diferite per zonă/raion, Personal → Program Salon: `gaseste_in_aplicatie("setări QR self-service comandă de la masă")`. Ce meniu vede clientul = asignarea meniurilor pe canale din Platforme & Meniuri. Atenție: canalul „Comenzi Client" din Platforme e ecranul ospătarului de acceptare a comenzilor (aspect, acceptare automată, PIN) — NU locul acestor reguli.
- **Imprimantă/ecran de bucătărie dedicate per zonă** — din proprietățile zonei în Designer (ține de faza de echipamente, doar amintește-i că există).
- **Ștergeri** de zone/mese/configurații — nu există prin MCP; doar din aplicație.

**Verificare după ce utilizatorul zice că a terminat:** re-citește `list_entities` cu `floor_configs` — pozițiile salvate din Designer apar în `configData`. Pentru QR: cu SQL activ, `execute_sql_query` cu `SELECT count(*) FROM table_qr_codes` comparat cu numărul de mese (`floor_tables`); fără SQL, întreabă utilizatorul ce procent de acoperire arată pagina de QR-uri.

## Echivalentul în wizard-ul din aplicație

- **Pasul 10 — „Configurare Sală"** (`/onboarding/step/10`): zone + mese + configurații + program, cu agentul „Sym Floor" pe chat și butoane către Designer și Plan Sală Live.
- **Pasul 11 — „QR Code-uri pentru mese"** (`/onboarding/step/11`): buton către pagina de QR-uri + stare de acoperire (câte mese au QR); chat-ul pasului configurează de fapt portalul de clienți (altă fază).

Entitățile create prin MCP **apar** în panourile wizard-ului (pașii detectează zonele/mesele/configurațiile existente), dar progresul wizard-ului (bifele de pași) NU se actualizează prin conexiune — utilizatorul bifează singur „Următorul pas" dacă parcurge wizard-ul în paralel.

## Verificare la final

- [ ] `list_floor_zones(locationId)` — toate zonele declarate, cu culorile lor.
- [ ] `list_entities {entityType:"floor_tables", brandId}` — numărul total de mese = ce a zis utilizatorul; numerotarea corectă.
- [ ] `list_entities {entityType:"floor_configs", brandId}` — minim o configurație; în `configData`: `zones` conține toate zonele, `sections` are raioanele, iar mesele de pe hartă au `sectionId` setat (dacă s-au făcut raioane).
- [ ] `list_entities {entityType:"floor_config_schedules", brandId}` — dacă există 2+ configurații: toate cele 7 zile acoperite (la o zi fără program, POS-ul cade pe prima configurație activă ca fallback — posibil alta decât cea dorită).
- [ ] Utilizatorul a aranjat vizual sala în Designer și a dat Salvează (întreabă explicit).
- [ ] QR: acoperire 100% (mese cu QR = mese totale) — prin SQL sau confirmat de utilizator de pe pagină.

## Capcane

1. **Creează configurația FĂRĂ `zoneIds`, apoi leagă zonele cu `add_zones_to_config`.** Dacă pasezi `zoneIds` direct la `create_floor_config`, zonele sunt doar înregistrate, fără mese pe hartă; un `add_zones_to_config` ulterior cu aceleași zone răspunde „deja în configurație" și NU mai construiește harta → `assign_tables_to_section` nu are pe ce lucra. Ordinea corectă: config gol → add_zones → add_sections → assign_tables.
2. **`add_sections_to_config` NU e idempotent** — fiecare apel ADAUGĂ raioane noi. Înainte de a-l (re)apela, citește `configData.sections` din `list_entities floor_configs`. La un timeout, verifică prin citire dacă scrierea a intrat; nu repeta orbește.
3. **`dayOfWeek` începe cu 0=Duminică** (nu 1=Luni). „Luni–Vineri" = dayOfWeek 1–5.
4. **`sectionId` e un string generat** (`sec_...`) din răspunsul lui `add_sections_to_config` — nu un număr, nu numele raionului. `tableDbIds` sunt id-urile rândurilor de masă (din `data.ids` la creare sau `list_entities floor_tables`).
5. **Pozițiile meselor NU se setează prin MCP** — `update_floor_table` schimbă doar nume/locuri/formă (descrierea tool-ului menționează „poziție", dar nu există parametri x/y). Nu promite utilizatorului că aranjezi sala vizual; trimite-l în Designer.
6. **`brandId` e cerut de scheme la mese** chiar dacă masa aparține de fapt zonei — pasează-l mereu, dar nu te baza pe filtrare per brand la mese.
7. **Mesele create prin MCP nu au locație proprie setată** — aparțin locației prin zona lor. Filtrul `locationId` + `unassignedOnly` din `bulk_assign_tables_to_zone` nu le va găsi; folosește `tableIds` explicit.
8. **Interfața nu arată datele imediat** — cache de browser. Scrierea reușită + confirmarea prin citire = adevărul; spune-i utilizatorului să dea refresh, nu repeta scrierea și nu raporta bug.
9. **„În Designer văd mai multe mese decât în POS/live"** = duplicate făcute cu copy/paste în Designer (același rând de masă referit de mai multe ori). Se repară automat la următoarea Salvare din Designer sau la generarea QR-urilor — nu încerca reparații prin MCP.
10. **Raioanele nu rutează nimic singure** — comanda QR ajunge la ospătarul corect abia când tura ospătarului e legată de raion (`create_shift` cu `floorConfigId` + `sectionId`, modulul `personal` — faza de personal). Menționează asta când închizi faza.
11. **Mai multe locații** — zonele, configurațiile și programul sunt per locație; repetă pașii pentru fiecare locație, nu amesteca `locationId`-urile.
