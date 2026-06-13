---
name: gestioneaza-personal
description: Gestionează personalul în Symbai — angajați, roluri & permisiuni, ture cu raionul corect pentru rutarea comenzilor QR, Program Salon, contracte și salarizare, schimbarea unității. Folosește la „adaugă angajat", „setează rol/permisiuni", „modifică permisiuni", „programează tură", „pune ospătarul pe raion", „de ce nu intră comanda QR la ospătar", „program salon", „fă contract angajat", „schimbă unitatea", „adaugă PIN/parolă angajat".
---

# Gestionează personalul — angajați, roluri, ture, raioane, contracte

Citește întâi `knowledge/personal-hr.md` (modal de tură câmp-cu-câmp, Program Salon, ladderul de rutare QR, unitatea) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`. Pentru sarcini & checklist-uri vezi skill-ul separat `gestioneaza-sarcini`. Turele de **producție** (fabrică) sunt alt concept — nu le confunda.

**Tot ce e scriere cere modulul `personal` pe token.** Context mereu întâi: `list_brands` + `list_locations` (ai nevoie de brandId/locationId). Roluri: `list_entities(entityType:"roles", brandId)`. Stare curentă: `get_staff_overview(brandId, locationId)`.

**⚠ Deploy:** tool-urile de **contracte/salarii/pontaj/concedii** (`*_employee_contract`, `upsert_employee_monthly_salary`, `*_time_entry`, `*_leave_request`) sunt LIVE **abia după deploy-ul nexuspos** — până atunci se fac din interfață. Verifică la conectare ce tool-uri apar; ce nu e în listă, nu se poate apela.

## Regula de aur

ID-uri, nu nume (roleId, employeeId, floorConfigId). Caută înainte de a crea (`create_employee` face dedupe doar pe nume exact). După scriere verifică prin CITIRE, nu prin UI. Ștergerea de angajați/ture întregi NU se face prin conexiune — îndrumă userul în aplicație.

## (a) Adaugă angajat + parolă/PIN

1. `create_employee(firstName*, lastName, brandId*, roleId, email, phone, locationId, hireDate, baseSalary, nickname)`. **Prenume + email** sunt obligatorii. Salariul lunar brut calculează automat tariful orar (la 168h/lună). Poreclă = numele afișat peste tot.
2. **Parola/PIN-ul nu se trimit prin MCP.** Varianta recomandată: din fișa angajatului (în aplicație) → „Copiază link setare parolă" / „Copiază link setare PIN" (valabile 48h) → i le trimiți, și-le alege singur. La nevoie, parola/PIN-ul se pot pune și direct pe fișă.
3. ⚠ **Câmpul PIN apare DOAR dacă rolul are permisiunea `pin_login`** — altfel link-ul/câmpul de PIN nu există. Pune `pin_login` pe rol (vezi (b)) sau alege un rol care o are.
4. Import în masă: `bulk_create_employees(brandId*, employees[], locationId)`.

## (b) Creează/editează rol + permisiuni

1. Rapid, setul standard: `seed_default_roles(brandId*, businessType*)` (restaurant|bar|cafenea|fast_food|hotel_restaurant|catering…) — creează ~15 roluri predefinite, idempotent.
2. Rol nou: `create_role(name*, brandId*, permissions?)`. Editare: `update_role(roleId*, brandId*, name?, permissions?)`.
3. Permisiuni fin: `set_role_permissions(roleId*, permissions? | addPermissions? | removePermissions?)` — `permissions` ÎNLOCUIEȘTE tot setul; `add/removePermissions` modifică incremental (preferă-le ca să nu ștergi din greșeală).
4. „Toate dintr-o categorie": cheia `all:<categorie>` (ex. `all:pos`, `all:payments`, `all:staff`) acordă tot grupul, inclusiv permisiuni viitoare. `all` simplu = super-admin (doar Admin/Proprietar). Câteva chei `staff`: `staff_view`, `staff_manage`, `schedule_manage`, `roles_manage`, `pin_login`.
5. Pagina nepermisă îl redirecționează pe angajat la „Sarcinile Mele" — dacă „nu vede o pagină", adaugă permisiunea pe rol.

## (c) Programează tură cu raionul corect (ca să meargă rutarea QR)

1. **Verifică ÎNTÂI Program Salon pe ziua respectivă**: aranjamentul activ pe acea zi trebuie să conțină raionul pe care vrei să pui ospătarul. Dacă raionul nu există în aranjamentul zilei, nu-l poți programa și comanda QR nu va prinde. (Configurare Program Salon → (d).)
2. `create_shift(employeeId*, date*, startTime*, endTime*, brandId*, locationId*, floorConfigId, sectionId, sectionName)`. **Pentru ospătari `sectionName` (raionul, ex. „Terasă"; mai multe = „Terasă,Bar") + `floorConfigId` (aranjamentul zilei) sunt esențiale** — pe ele se face rutarea. Editare: `update_shift(shiftId*, …, sectionName?)`. Mai multe deodată: `bulk_create_shifts(locationId*, shifts[])`.
3. Tura e ciornă (invizibilă angajatului) până e **publicată** — în aplicație „Salvează și Publică Program".
4. Confirmă: `get_shift_detail` / `get_staff_overview` arată tura cu raionul ei.

## (d) Configurează Program Salon (aranjament per zi)

Pregătire aranjamente (dacă lipsesc): `create_floor_zone` → `bulk_create_floor_tables` → `create_floor_config(name, brandId, locationId, zoneIds)` → `add_sections_to_config(floorConfigId, sections:[{name,color}])` → `assign_tables_to_section(floorConfigId, sectionId, tableDbIds[])`. Apoi **ce aranjament pe ce zi**: `create_floor_config_schedule(brandId*, dayOfWeek* [0=Duminică…6=Sâmbătă], floorConfigId*, locationId*)` pentru fiecare zi de operare. Excepțiile pe dată și presetul QR per raion (Prenume / La scanare / Confirmare ospătar) se setează din tabul Program Salon în aplicație.

## (e) Contracte CIM/PFA/Zilier + alocări + bonusuri

**MCP doar după deploy** (`create_employee_contract` / `update_employee_contract` cu `contractKind`, salariu brut/net sau `dailyRate`, `allocations` toate de același tip [% ≤ 100 sau sume fixe ≤ brut], `bonuses` [monthly_fixed|percent_sales|per_day|one_time]; `upsert_employee_monthly_salary` pe lună; ⚠ la update `allocations`/`bonuses` înlocuiesc tot setul). **Acum (UI)**: `/staff?tab=contracts` → alegi angajatul → contract nou (CIM/SRL-PFA/Zilier/Fără contract) → alocări pe brand/locație + bonusuri. Salariul lunii se editează din tab Listă Personal (butonul de salarii de pe rândul angajatului), separat de contract.

## (f) Schimbă unitatea (brand/locație)

Selectorul sus pe /staff = perechea brand+locație. Prin conexiune nu există tool dedicat de schimbare; pentru a citi personalul unei unități: `get_staff_overview(brandId, locationId)`. Preferința per angajat se ține pe `/api/employees/:id/selected-unit` (cheia „brandId-locationId", ex. „5-10") și se schimbă din interfață (sau `?unit=5-10` pe URL prin extensia Chrome).

## Click-paths în aplicație (extensia Chrome, când MCP nu acoperă)

După ce userul e logat în aplicația lui:
- Angajați: `/staff?tab=list` → „Adaugă Angajat" / „Editare" → link-uri parolă/PIN pe fișă.
- Roluri: `/staff?tab=roles` → „+" rol nou sau „✨" roluri prestabilite; comutatorul „Toate (N)" per categorie.
- Ture: `/staff` (Planificator Ture) → celulă goală → completezi Angajat/Dată/Ore/Aranjament Sală/**Secțiune Atribuită**/Status → „Salvează și Publică Program".
- Program Salon: `/staff?tab=floor-schedule` → per zi alegi aranjament + preset QR per raion; excepții pe dată.
- Contracte: `/staff?tab=contracts`.

## „De ce comanda QR nu intră la ospătarul corect?" — diagnostic

Mergi pe ladder (vezi `knowledge/personal-hr.md`), în ordine:
1. **Raion gol** pe tură/pontaj — managerul n-a pus Secțiune Atribuită, sau ospătarul a deschis tură din POS fără raion. (Cea mai frecventă.)
2. **Masa nu e în aranjamentul zilei** — adăugată după ce s-a făcut aranjamentul, sau nume diferit (majuscule/spațiere) → raionul mesei iese gol.
3. **Raion scris diferit** — „Terasă" vs „Terasa" (diacritice/majuscule) → nu se potrivesc.
4. **Niciun aranjament programat azi** în Program Salon → fallback pe alt aranjament care poate nu conține masa.
5. **Tura e ciornă** sau în afara intervalului orar → nu e „activă acum".
Verifică tura din Planificator (raion corect, publicată, interval) + aranjamentul zilei din Program Salon (masa e în el, raionul scris identic). Citește live cu `get_shift_detail`/`get_staff_overview` sau SQL read-only (`staff_schedules`, `shifts`, `zone_assignments`, `floor_configs`). Nu presupune.

## Verifică prin CITIRE (nu prin UI)

După orice scriere: `get_staff_overview` / `get_shift_detail` / `list_entities` confirmă. Interfața se actualizează abia după refresh — succes la tool = salvat, nu repeta scrierea. Dacă modulul `personal` nu e pe token („permisiune insuficientă"), explică activarea din portal Hub → Acces AI. Audit pe un angajat: `jurnal_activitate(categorie:"STAFF", angajatId)`.
