# Onboarding 07 — Personalul, rolurile și turele

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final există: rolurile cu permisiuni (cine ce poate face în aplicație și pe POS), angajații cu rol și PIN de pontaj/POS, opțional turele primei săptămâni și checklisturile operaționale (deschidere, închidere, HACCP, curățenie). Fără angajați cu PIN, POS-ul și pontajul nu pot fi folosite; fără roluri, angajații nu au acces la nimic. Turele ospătarilor cu secție asignată sunt și baza rutării comenzilor QR de la mese.

## Permisiuni necesare pe token

- **`personal` (Personal & Ture)** — singurul modul de scriere necesar. Acoperă toate tool-urile fazei: angajați, roluri, ture, programări, liste de sarcini.
- Fără el, orice tool de scriere întoarce „permisiune insuficientă" — cere utilizatorului să activeze modulul în portalul Hub → Acces AI, pe tokenul conexiunii.
- Citirile (`get_staff_overview`, `list_entities` etc.) merg întotdeauna, indiferent de module.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citește automat, fără să întrebi:**
1. `list_brands` + `list_locations` — brandId/locationId pentru toate apelurile (dacă e un singur brand și o singură locație, nu mai întreba nimic despre asta).
2. `get_staff_overview(brandId=...)` — rezumatul fazei: roluri existente, angajați (primii 30), numărul turelor din următoarele 7 zile, liste de sarcini. Acesta decide de unde începi:
   - zero roluri → începi cu rolurile;
   - roluri dar zero angajați → treci direct la echipă;
   - roluri + angajați → propui ture/checklisturi sau confirmi că faza e gata.
3. `list_entities(entityType="floor_configs", brandId=...)` — doar dacă vei crea ture de ospătari cu secții (rutare QR); dacă sala nu e configurată încă, creezi turele fără secție.

**Întrebi minim (cu formulări sugerate):**
1. *„Ce tip de local ai? Restaurant clasic, restaurant mare (50+ locuri), fast-food, bar, cafenea, restaurant de hotel sau catering?"* — alege șablonul de roluri.
2. *„Spune-mi echipa: nume și ce face fiecare (ospătar, bucătar, barman...). Dacă vrei, alege și codurile PIN de 4-6 cifre; altfel le generez eu (1001, 1002, ...)."*
3. Doar dacă userul vrea ture acum: *„Ce ture aveți? (ex. dimineață 8-16, seară 16-24) Și cine lucrează în ce zile săptămâna asta?"*
4. *„Vrei să-ți pregătesc și checklisturile standard — deschidere, închidere, HACCP zilnic, curățenie?"* — da/nu, fără alte detalii.

**Nu cere prin chat date sensibile**: CNP, salarii, numere de contract. Minimul pentru funcționare e nume + rol + PIN. Dacă utilizatorul le oferă singur, tool-urile le acceptă (`cnp`, `hourlyRate`, `contractNumber`); altfel spune-i că le completează în aplicație, la pagina de Personal (contracte și salarii se administrează oricum doar acolo). Confirmă lista finală cu utilizatorul ÎNAINTE de orice scriere în masă.

## Pașii de execuție — tool-urile MCP exacte

**Pas 1 — Rolurile (înaintea angajaților — `roleId` e necesar la asignare).**
`seed_default_roles(brandId=1, businessType="restaurant")` — creează setul standard cu permisiuni complete presetate. `businessType` acceptă exact: `restaurant`, `restaurant_mare`, `fast_food`, `bar`, `cafenea`, `hotel_restaurant`, `catering`. E idempotent: sare rolurile care există deja (comparație pe nume, case-insensitive) și raportează `created`/`skipped`.

- Rol în plus, atipic: `create_role(name="Sommelier", brandId=1)` — **fără** parametrul `permissions` (vezi Capcane), apoi setezi permisiunile cu:
- `set_role_permissions(roleId=12, addPermissions=["pos_access"])` — sau `removePermissions`, sau `permissions=[...]` (înlocuiește tot, array de stringuri). Nu enumera utilizatorului permisiuni individuale — el spune ce vrea („să poată face inventar"), tu mapezi.
- Redenumire: `update_role(roleId=12, brandId=1, name="Somelier șef")`.

**Pas 2 — Angajații.** Ia `roleId`-urile reale din `get_staff_overview` (nu le ghici).
- Un singur angajat: `create_employee(firstName="Andrei", lastName="Popescu", brandId=1, locationId=2, roleId=5, position="Ospătar", pin="1001")`. Obligatorii doar `firstName`, `lastName`, `brandId` — dar pune mereu și `roleId`, `locationId`, `pin`. Opționale: `email`, `phone`, `hourlyRate` (lei/oră), `department`, `hireDate` (YYYY-MM-DD), `employmentType` (`permanent`/`part_time`/`temporary`/`student`).
- 2+ angajați: `bulk_create_employees(brandId=1, locationId=2, employees=[{firstName:"Andrei", lastName:"Popescu", roleId:5, position:"Ospătar"}, ...])` — idempotent (sare angajații existenți după nume+prenume). **Atenție: elementele din `employees` NU acceptă `pin`** — după creare, setează PIN-urile unul câte unul cu `update_employee(employeeId=…, pin="1002")`.
- PIN-uri: 4-6 cifre, UNICE per angajat; dacă userul nu le alege, generează secvențial (1001, 1002...) și **spune-i utilizatorului în conversație fiecare PIN** — nu se mai pot recupera ulterior (vezi Capcane).
- Modificări/dezactivare: `update_employee(employeeId=7, active=false)`.

**Pas 3 (opțional) — Turele primei săptămâni.**
- `bulk_create_shifts(locationId=2, shifts=[{employeeId:7, date:"2026-06-15", startTime:"08:00", endTime:"16:00"}, ...])` — **`locationId` e practic obligatoriu** (la nivel de batch sau per tură): o tură fără locație strică rapoartele de casierie (vezi Capcane).
- Tură peste miezul nopții (ex. 16:00→00:30): dă `endTime` mai mic decât `startTime` — serverul mută automat sfârșitul pe ziua următoare. Nu „corecta" tu data.
- Pentru ospătari, dacă sala e deja configurată: adaugă `sectionName` (ex. "Terasă") + `floorConfigId` + `sectionId` din configurația de sală (`list_entities(entityType="floor_configs")`) — asta rutează comenzile QR de la mese către ospătarul de pe secție. Fără sală configurată, creează turele simple și revino după faza de sală.
- Corecturi: `update_shift(shiftId=…, startTime=…, endTime=…, status=…)` (`status`: `scheduled`/`in_progress`/`completed`/`cancelled`). **Ștergerea turelor nu există prin conexiune** — doar din aplicație.
- Distinct de ture: **programările planificate** (`create_staff_schedule` / `bulk_create_staff_schedules`, cu `scheduledStart`/`scheduledEnd` ISO complet și `status` `draft`/`published`) sunt planul managerului în avans, vizibil în Planificator; turele (`shifts`) sunt intrările efective de calendar/pontaj. Pentru onboarding, turele sunt de obicei suficiente.

**Pas 4 (opțional) — Checklisturile operaționale.** Dacă userul acceptă, creează-le imediat, fără alte întrebări:
1. `create_task_list(title="Checklist Deschidere", brandId=1, role="Șef de Tură Sală", shift="Dimineața")`
2. `bulk_create_tasks(taskListId=<id-ul întors>, tasks=[{title:"Verificare curățenie salon"}, {title:"Aranjare mese"}, {title:"Verificare stoc bar"}, {title:"Pornire sisteme de vânzare"}, {title:"Verificare rezervări pe azi"}, {title:"Briefing echipă"}])`
Repetă pentru „Checklist Închidere" (numărare casă, raport vânzări, verificare frigidere, închidere utilități, predare chei), „Checklist HACCP Zilnic" (temperaturi frigidere/congelatoare, marfă primită, termene valabilitate, igienă suprafețe — rol „Bucătar Șef") și „Checklist Curățenie" (rol „Curățenie", shift "Any"). Sarcină punctuală cu termen: `create_task(taskListId=…, title=…, assignedTo=<employeeId>, priority="high", dueDate=<ISO>)`.

**După fiecare scriere**: confirmă prin CITIRE (`get_staff_overview`), nu prin interfață — UI-ul are cache în browser și arată datele noi abia după refresh. Dacă userul zice „nu văd angajatul în aplicație", cere-i un refresh; nu repeta scrierea și nu raporta bug.

## Ce se face DOAR din aplicație

Pentru fiecare, dă link cu `gaseste_in_aplicatie(intrebare="...")` și verifică apoi prin citire:
- **Ștergeri** (angajați, roluri, ture) — politica conexiunii nu expune ștergeri. `gaseste_in_aplicatie("lista personal")`. Alternativ, dezactivează angajatul cu `update_employee(active=false)`.
- **Link de setare parolă/PIN de către angajat** (valabil 48h, trimis pe telefon/email) — din fișa angajatului. `gaseste_in_aplicatie("setare parolă angajat")`.
- **Contracte și salarii** (tipuri de contract, alocări, bonusuri, salarii lunare, import payroll) — `gaseste_in_aplicatie("contracte și salarii angajați")`. Recomandă explicit asta pentru datele sensibile.
- **Aprobarea pontajelor** (Foaie Pontaj) și **pontajul** propriu-zis (angajații pontează cu PIN) — operațiuni de zi cu zi, nu de onboarding.
- **Grupuri de mesaje** pentru echipă și **Programul salonului** (ce zone/QR sunt active pe ore) — taburi în pagina de Personal.
- **Asistenții AI pe job (pasul 22 din wizard)** — se creează doar din aplicație, conversațional: utilizatorul descrie jobul, urcă opțional documente (proceduri, manuale) și bifează rolurile care văd asistentul. `gaseste_in_aplicatie("asistent AI pentru angajați")`. Precondiția e exact faza asta: rolurile trebuie să existe. Nu există tool de citire pentru asistenți — după ce userul termină, cere-i confirmarea verbală că asistentul apare în meniul lateral, secțiunea Asistenți AI.

În conversația cu utilizatorul (om de business): fără jargon. Spune „cod PIN de pontaj", „planificarea turelor", „lista de personal" — nu „endpoint", „roleId", „seed". Numele de tool-uri nu se rostesc.

## Echivalentul în wizard-ul din aplicație

- **Pasul 12 — „Personal & Ture de lucru"** (`/onboarding/step/12`): aceleași 3 acțiuni (roluri → angajați → ture), cu agent propriu „Sym Staff" și butoane către pagina de Personal.
- **Pasul 22 — „AI Staff Creator"** (`/onboarding/step/22`): asistenții AI pe job (UI-only, vezi mai sus).

Rolurile și angajații creați prin conexiune SUNT văzuți de wizard (pasul 12 afișează live rolurile și angajații existenți), dar **progresul wizard-ului (bifa de pas completat) NU se actualizează prin conexiune** — utilizatorul apasă singur „Următorul pas" dacă parcurge și wizardul.

## Verificare la final

Rulează `get_staff_overview(brandId=...)` — rezumatul e per brand (parametrul `locationId` apare în schemă, dar serverul îl ignoră) — și confirmă:
- [ ] rolurile există (setul standard + cele custom), fiecare cu permisiuni nenule;
- [ ] toți angajații sunt activi, au `roleId` și PIN „setat" (răspunsul arată per angajat doar statusul setat/nesetat, nu valoarea PIN-ului);
- [ ] fiecare angajat are `locationId` (răspunsul `create_employee` avertizează explicit „Angajatul nu are locație asignată");
- [ ] dacă s-au creat: numărul „ture viitoare" a crescut (rezumatul dă doar numărul — locația/secția pe fiecare tură le vezi cu `list_entities(entityType="shifts")`), listele de sarcini apar cu titlu/rol/tură (sarcinile individuale nu sunt în rezumat — bifează-le din răspunsul `bulk_create_tasks`);
- [ ] opțional `get_config_status(brandId=...)` — procentul categoriei de personal a crescut.
Raportează utilizatorului pe scurt: „X roluri, Y angajați (PIN-uri: ...), Z ture, N checklisturi".

## Capcane

- **`create_employee` NU e idempotent** — al doilea apel identic creează un duplicat. Verifică în `get_staff_overview` înainte; pentru liste folosește `bulk_create_employees` (sare duplicatele după nume+prenume). Nici `create_shift`/`bulk_create_shifts` nu deduplică — nu re-rula un batch reușit.
- **PIN-urile nu se pot recupera** — sunt stocate criptat și nu se afișează nici în aplicație; `get_staff_overview` arată doar „setat"/„nesetat". Comunică-le utilizatorului la creare. Resetarea se face din aplicație (link de setare PIN).
- **`bulk_create_employees` nu acceptă PIN per angajat** — setează-le după, cu `update_employee`. Tot bulk-ul nu acceptă nici `employmentType`.
- **Tură fără `locationId` = bani „dispăruți" din casierie** — rapoartele de casă filtrează turele pe locație; o tură cu locație lipsă nu apare la închiderea de zi. Calea de scriere prin conexiune NU completează automat locația din fișa angajatului, deci pune `locationId` explicit pe fiecare tură (sau la nivel de batch).
- **Nu trimite `permissions` la `create_role`/`update_role`**: schema descrie un obiect, dar sistemul de drepturi real folosește un array de stringuri — un obiect creează un rol cu permisiuni nefuncționale. Flux corect: `create_role` fără permissions → `set_role_permissions(roleId, permissions=[...])` (sau pornește de la `seed_default_roles` și ajustează).
- **Rolurile sunt per brand** — la mai multe branduri, rulează `seed_default_roles` pentru fiecare brand în care lucrează personal.
- **`shifts` ≠ `staff_schedules`** — nu le amesteca: turele apar în calendar/pontaj, programările sunt planul draft/publicat al managerului. Creează una dintre ele, nu ambele pentru aceeași zi, ca să nu deruteze utilizatorul.
- **Secțiile ospătarilor cer sala configurată** — `sectionId`/`sectionName` vin din `configData.sections` al unei configurații de sală existente; cu id-uri inventate rutarea comenzilor QR tace (nu dă eroare, doar nu rutează). Fără sală: ture simple, revii după faza de sală.
- **Ștergerea turelor nu există prin conexiune** (doar `update_shift` cu `status="cancelled"` sau din aplicație) — nu promite utilizatorului „șterg tura".
- **CNP/salarii prin chat: doar dacă userul le oferă singur** — nu le cere proactiv; pentru salarizare completă (contracte, bonusuri) trimite-l în aplicație.
