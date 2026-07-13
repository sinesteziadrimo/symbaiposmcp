---
name: gestioneaza-personal
description: Gestionează personalul în Symbai — angajați, roluri & permisiuni, ture cu raionul corect pentru rutarea comenzilor QR, Program Salon, contracte și salarizare, beneficii de masă pentru personal (mâncare/băutură gratis/redus cu buget) și schimbarea unității. Folosește la „adaugă angajat", „setează rol/permisiuni", „modifică permisiuni", „programează tură", „pune ospătarul pe raion", „de ce nu intră comanda QR la ospătar", „program salon", „fă contract angajat", „schimbă unitatea", „adaugă PIN/parolă angajat", „beneficiu personal", „masa personalului", „ospătarii/bucătarii mănâncă gratis", „dau mâncare la angajați", „buget de masă pentru echipă", „să le dau discount la mâncare?", „de ce nu se aplică beneficiul".
---

# Gestionează personalul — angajați, roluri, ture, raioane, contracte

Citește întâi `knowledge/agent-operare-avansata.md` pentru standardul de execuție sigură, apoi `knowledge/personal-hr.md` (modal de tură câmp-cu-câmp, Program Salon, ladderul de rutare QR, unitatea) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`. Pentru **beneficii de masă personal** (mâncare/băutură gratis/redus cu buget + de ce NU discount/din partea casei) citește `knowledge/beneficiu-personal.md` și vezi (g) mai jos. Pentru sarcini & checklist-uri vezi skill-ul separat `gestioneaza-sarcini`. Turele de **producție** (fabrică) sunt alt concept — nu le confunda.

**Tot ce e scriere cere modulul `personal` pe token.** Context mereu întâi: `list_brands` + `list_locations` (ai nevoie de brandId/locationId). Roluri: `list_entities(entityType:"roles", brandId)`. Stare curentă pe brand/unitate: `get_staff_overview(brandId, locationId)`. Pentru inventar rapid pe tot tenantul poți folosi `list_employees(brandId?)`, dar `brandId` doar etichetează `scope` (`own`/`shared`/`global`/`other`) și `roleBrand`; nu filtrează lista.

**Contracte/salarii/pontaj/concedii — tool-uri MCP live:** `create_employee_contract` / `update_employee_contract`, `upsert_employee_monthly_salary`, `create_time_entry` / `update_time_entry`, `create_leave_request` / `update_leave_request`, plus citirile `list_employee_contracts` / `list_leave_requests`. Se apelează direct. Detalii pe fiecare la (e).

## Regula de aur

ID-uri, nu nume (roleId, employeeId, floorConfigId). Caută înainte de a crea (`create_employee` face dedupe doar pe nume exact). După scriere verifică prin CITIRE, nu prin UI. Ștergerea de angajați/ture întregi NU se face prin conexiune — îndrumă userul în aplicație.

## (a) Adaugă angajat + parolă/PIN

1. `create_employee(firstName*, lastName*, brandId*, roleId, email, phone, locationId, hireDate, baseSalary, nickname, pin)`. **Obligatorii: `firstName` + `lastName` + `brandId`** — email-ul NU e obligatoriu. `baseSalary` (lunar brut) calculează automat tariful orar la 168h/lună. Poreclă = numele afișat peste tot.
   - **⚠ CAPCANĂ: angajatul creat prin MCP poate să NU apară în Lista Personal cât timp ești pe unitatea lui** — lista filtrează după unitățile salvate pe fișa angajatului, iar fișa creată prin conexiune nu le are încă completate. Soluție: după creare, spune-i userului să-l vadă pe „Toate unitățile" SAU să deschidă o dată fișa în aplicație și să o salveze (completează unitățile). Tu confirmă mereu prin `get_staff_overview(brandId)` — acolo apare corect.
2. **PIN-ul SE poate seta prin MCP** — `create_employee(..., pin:"4321")` sau `update_employee(employeeId, pin)` chiar funcționează (confirmă cu `get_staff_overview` → angajatul apare cu `pin:"setat"`). **Parola NU se trimite prin MCP**: din fișa angajatului → „Copiază link setare parolă" (48h) → i-l trimiți, și-o alege singur. Și PIN-ul are link similar dacă preferi ca el să-l aleagă.
3. ⚠ **Câmpul PIN apare DOAR dacă rolul are permisiunea `pin_login`** — altfel link-ul/câmpul de PIN nu există. Pune `pin_login` pe rol (vezi (b)) sau alege un rol care o are.
4. Import în masă: `bulk_create_employees(brandId*, employees[], locationId)`.

## (b) Creează/editează rol + permisiuni

**Pentru roluri + permisiuni ai un skill dedicat, mai bogat: `configureaza-roluri`** (înțelege întâi ce vede fiecare rol, apoi acționează). Tool-uri de ÎNȚELEGERE (READ, mereu disponibile): `list_permission_catalog` (vocabularul complet de drepturi), `describe_role(roleId|roleName)` (ce permisiuni are un rol + **ce pagini vede** + câți angajați), `preview_role_access(permissions[])` (ce pagini ar da un set de chei, ÎNAINTE de creare), `list_role_presets`, `suggest_role_setup(description)` (schiță de rol dintr-o descriere). Folosește-le ca să nu bifezi orb.

1. Rapid, setul standard: `seed_default_roles(brandId*, businessType*)` (restaurant|bar|cafenea|fast_food|hotel_restaurant|catering…) — creează ~15 roluri predefinite, idempotent.
2. Rol nou: `create_role(name*, brandId*)`. **⚠ NU trimite `permissions` ca OBIECT la `create_role`** (ex. `{pos:true}`) — se salvează greșit (rolul rămâne fără permisiuni reale) ȘI strică apoi apelurile incrementale `set_role_permissions(addPermissions)` (dau eroare). **Creează rolul gol, apoi pune permisiunile cu `set_role_permissions` (array).**
3. Permisiuni fin: `set_role_permissions(roleId*, permissions[] | addPermissions[] | removePermissions[])` — toate iau **array de string-uri**. `permissions` ÎNLOCUIEȘTE tot setul (folosește-o întâi pe un rol nou); `add/removePermissions` merg incremental DOAR dacă setul curent e deja array (pe un rol creat greșit cu obiect, „repară-l" întâi cu `permissions`).
4. **⚠ NU există validare pe chei** — orice string e acceptat tăcut, inclusiv chei greșite care NU deblochează nimic. **Folosește DOAR cheile reale** din `knowledge/personal-hr.md` → „Catalog permisiuni". „Toate dintr-o categorie": `all:<categorie>` (categorii valide: `pos`, `client_orders`, `delivery`, `payments`, `kitchen`, `reservations`, `inventory`, `menu`, `staff`, `tasks`, `cleaning`, `haccp`, `marketing`, `ai_assistants`, `sales_crm`, `finance`, `cashbook`, `analytics`, `ecommerce`, `hotel`) acordă tot grupul; `all` = super-admin (doar Admin/Proprietar). Chei `staff` uzuale: `staff_view`, `staff_manage`, `schedule_view`, `schedule_manage`, `roles_manage`, `pin_login`, `attendance_view`, `attendance_manage` (pontaje/prezență self-service). Pentru un rol standard întreg, preferă `seed_default_roles` (pasul 1).
5. Pagina nepermisă îl redirecționează pe angajat la „Sarcinile Mele" — dacă „nu vede o pagină", adaugă permisiunea pe rol.

## (c) Programează tură cu raionul corect (ca să meargă rutarea QR)

1. **Verifică ÎNTÂI Program Salon pe ziua respectivă**: aranjamentul activ pe acea zi trebuie să conțină raionul pe care vrei să pui ospătarul. Dacă raionul nu există în aranjamentul zilei, nu-l poți programa și comanda QR nu va prinde. (Configurare Program Salon → (d).)
2. **⚠ DOUĂ evidențe de tură separate — alege corect:**
   - `create_shift(employeeId*, date*, startTime*, endTime*, brandId*, locationId*, floorConfigId, sectionId, sectionName)` creează tura de lucru (pontaj / „tură deschisă POS"). **ARE raion** (`sectionName`, ex. „Terasă"; mai multe = „Terasă,Bar") → rutează QR-ul pentru ziua aia, **DAR NU apare în Planificator Ture** (planificatorul citește doar programul publicat).
   - `create_staff_schedule(employeeId*, scheduledStart*, scheduledEnd*, floorConfigId, locationId, status)` creează intrarea de program publicat → **apare în Planificator Ture**. **DAR nu are param de raion** (raionul rămâne gol) și nici de brand.
   - **Concluzie: niciun tool MCP nu face singur «intrare în planificator CU raion».** Reguli: vrea doar **rutare QR azi** → `create_shift` cu `sectionName`. Vrea **programul în planificator** → `create_staff_schedule` (`status:"published"`), apoi **pune raionul din aplicație** (Planificator → tură → Secțiune Atribuită) sau spune-i clar că raionul se setează în UI. Editare: `update_shift(shiftId*, …, sectionName?)`. Mai multe: `bulk_create_shifts` / `bulk_create_staff_schedules`.
   - **⚠ Timezone:** orele trimise se stochează ca UTC și se afișează cu offset-ul local (vara RO = +3h → „10:00" apare „13:00"). Dacă userul vrea fix 10:00 local, scade offset-ul sau avertizează-l de decalaj.
   - **⚠ `dayOfWeek` (Program Salon):** 0=Duminică … 6=Sâmbătă — calculează ziua REALĂ a datei, nu presupune.
3. `create_staff_schedule` cu `status:"draft"` = ciornă (invizibilă); `"published"` = vizibilă angajatului. (Tura creată cu `create_shift` nu are draft/publish — există direct.)
4. Confirmă: `get_staff_overview(brandId, locationId)` arată turele viitoare cu raionul (`sectionName`); pentru detaliu fin poți folosi accesul SQL read-only. (`get_shift_detail` e pentru turele de **producție**, nu pentru turele de personal — nu-l folosi aici.)

## (d) Configurează Program Salon (aranjament per zi)

Pregătire aranjamente (dacă lipsesc): `create_floor_zone` → `bulk_create_floor_tables` → `create_floor_config(name, brandId, locationId, zoneIds)` → `add_sections_to_config(floorConfigId, sections:[{name,color}])` → `assign_tables_to_section(floorConfigId, sectionId, tableDbIds[])`. `assignedCount` de la asignare înseamnă mese DISTINCTE, nu desktop+mobile dublat; confirmă prin `get_floor_config(section:"tables")`. Apoi **ce aranjament pe ce zi**: `create_floor_config_schedule(brandId*, dayOfWeek* [0=Duminică…6=Sâmbătă], floorConfigId*, locationId*)` pentru fiecare zi de operare. Excepțiile pe dată și presetul QR per raion (Prenume / La scanare / Confirmare ospătar) se setează din tabul Program Salon în aplicație.

## (e) Contracte CIM/PFA/Zilier + alocări + bonusuri

**MCP live** (se apelează direct): `create_employee_contract(employeeId*, contractKind*` [cim|srl_pfa|zilier|fara_contract]`, monthlyGrossSalary | monthlyNetSalary | dailyRate` [zilier]`, allocations` [`allocationType` toate de același tip: percent ≤ 100 SAU fixed ≤ brut]`, bonuses` [`bonusType`: monthly_fixed|percent_sales|per_day|one_time]`)`; editare `update_employee_contract(contractId*, …)` — ⚠ `allocations`/`bonuses` ÎNLOCUIESC tot setul (trimite lista întreagă), lasă-le nesetate ca să le păstrezi. Salariul lunii: `upsert_employee_monthly_salary(employeeId*, year*, month*, grossSalary, netSalary, bonuses)` — unic pe (angajat, an, lună), reapelarea suprascrie. Pontaj: `create_time_entry(employeeId*, clockIn?, clockOut?)` (guard idempotent: pontaj deschis nu se dublează) → închizi cu `update_time_entry(timeEntryId*, clockOut)`. Concedii: `create_leave_request(employeeId*, type*` [concediu_odihna|medical|personal|fara_plata|eveniment_special]`, startDate*, endDate*)` → `update_leave_request(leaveRequestId*, status` [pending|approved|declined|cancelled]`, reviewedBy?, reviewNote?)`. Confirmă valorile cu userul înainte de scriere.

**Pontaj self-service (mobil):** pe lângă pontajul cu PIN, angajații se pot ponta singuri din aplicația **Symbai Staff**, ecranul Pontaj — intrare/ieșire cu GPS (opțional selfie) și pauze cu motiv; telefoanele folosite se înregistrează per angajat, cu politică de avertizare sau blocare la telefon necunoscut. Managerul vede prezența (cu comparație planificat-vs-real) în `/staff` → tab **„Pontaje (prezență)"**. Accesul se controlează din permisiunile `attendance_view` (vede pontajele) / `attendance_manage` (le administrează) — vezi (b).

## (f) Schimbă unitatea (brand/locație)

Selectorul de unitate (sus, valabil pe TOATE paginile, nu doar /staff) filtrează lista de personal și contextul. **Comutarea unității nu se face prin MCP** (e stare de browser) — rețeta canonică (dropdown prin Chrome, recomandat; sau URL `?unit=brandId-locationId`; gotcha userMutated; id-uri din `list_brands`/`list_locations`) e în `knowledge/navigare.md`, secțiunea „Schimbarea unității active". Aici, doar contextul HR: ca să CITEȘTI personalul unei unități fără să comuți, `get_staff_overview(brandId, locationId)`.

## (g) Beneficii de masă pentru personal (mâncare/băutură gratis/redus)

Detaliile complete (discovery cu owner, configurare câmp-cu-câmp, cum aplică ospătarul, cum citești rapoartele) sunt în `knowledge/beneficiu-personal.md`. Esențialul:

1. **Întâi explică regula de aur:** consumul angajaților trece DOAR prin „Beneficiu personal", NU prin „Reducere" și NU prin „Din partea casei". Reducerea/comp scad VENITUL (sunt pentru clienți); beneficiul personal intră pe linia de **cost de personal**, cu registru per angajat și buget. Canalul greșit corupe P&L-ul și rapoartele (vânzări subevaluate, comp umflat, zero atribuire/buget).
2. **Fă discovery înainte de configurare:** cine consumă (toți/rol/nominal), ce produse (tot meniul/mâncare/categorie), ce excluderi clare există (alcool, produse scumpe, taguri/tipuri), cum (gratis cu buget / preț special / procent), cât (buget/perioadă + la depășire blochează/avertizează/permite), când (oricând / doar la lucru), cine aplică (self/manager) și dacă aplicarea cere **aprobare manager**. Apoi **propune** un setup și confirmă cifrele înainte să scrii.
3. **BENEFICIAR ≠ APLICATOR:** beneficiarul mănâncă, aplicatorul pune beneficiul pe notă. Confuzia asta e cea mai frecventă.
4. **MCP** (dacă tool-urile sunt active pe instanță): citire `list_staff_benefit_rules`, `diagnose_staff_benefit_rule` („de ce nu se aplică"), `get_staff_benefit_budget`, `get_staff_benefit_report`; scriere `create_staff_benefit_rule`, `update_staff_benefit_rule`, `set_staff_benefit_employee_budget`, `toggle_staff_benefits`, `set_staff_benefit_accounting_mode`. Regulile acceptă și excluderi (`excludedProductIds`, `excludedTagIds`, `excludedProductTypeCodes`) plus `requiresApproval`; aprobarea/respingerea unei cereri se face în POS/UI dacă nu vezi tool dedicat în sesiune. Înainte de `set_staff_benefit_accounting_mode`, explică owner-ului diferența: `internal_only` rămâne intern/P&L, `separate_benefit` trimite valoarea distinctă către contabilitate ca avantaj în natură, fără să dubleze COGS. Dacă tool-urile lipsesc din sesiune → **fallback la pagină** `/staff` → tab „Beneficii Personal" (vechiul `/settings/staff-benefits` doar redirecționează).
5. **Aplicarea pe o notă rămâne în POS** (acțiune de ospătar: masă → 3 puncte → „Beneficiu Personal"); prin conexiune o explici, n-o faci.
6. **„Nu se aplică" = aproape mereu CONFIG, nu defect.** Verifică în panoul „Stare regulă" / cu `diagnose_staff_benefit_rule`: rol beneficiar ∈ permise, la lucru dacă se cere, produs în scope și nu în excluderi, buget neepuizat, aplicator permis, iar dacă `requiresApproval` este activ vezi cererea în așteptare.

## Click-paths în aplicație (extensia Chrome, când MCP nu acoperă)

După ce userul e logat în aplicația lui:
- Angajați: `/staff?tab=list` → „Adaugă Angajat" / „Editare" → link-uri parolă/PIN pe fișă.
- Roluri: `/staff?tab=roles` → „+" rol nou sau „✨" roluri prestabilite; comutatorul „Toate (N)" per categorie.
- Ture: `/staff` (Planificator Ture) → celulă goală → completezi Angajat/Dată/Ore/Aranjament Sală/**Secțiune Atribuită**/Status → „Salvează și Publică Program".
- Program Salon: `/staff?tab=floor-schedule` → per zi alegi aranjament + preset QR per raion; excepții pe dată.
- Contracte: `/staff?tab=contracts`.
- Beneficii Personal: `/staff` → tab „Beneficii Personal" (vechiul `/settings/staff-benefits` redirecționează) → comutator global + tab Reguli (creează/editează, inclusiv excluderi și „Doar cu aprobare") → la POS, aplicarea pe masă din „Acțiuni Masă" (3 puncte) → „Beneficiu Personal"; aprobările cererilor se fac în POS/UI dacă nu există tool dedicat în sesiune.
- Pontaje (prezență): `/staff` → tab „Pontaje (prezență)" — prezența din aplicația Symbai Staff (GPS, selfie, pauze, telefoane per angajat, planificat-vs-real).

## „De ce comanda QR nu intră la ospătarul corect?" — diagnostic

Mergi pe ladder (vezi `knowledge/personal-hr.md`), în ordine:
1. **Raion gol** pe tură/pontaj — managerul n-a pus Secțiune Atribuită, sau ospătarul a deschis tură din POS fără raion. (Cea mai frecventă.)
2. **Masa nu e în aranjamentul zilei** — adăugată după ce s-a făcut aranjamentul, sau nume diferit (majuscule/spațiere) → raionul mesei iese gol.
3. **Raion scris diferit** — „Terasă" vs „Terasa" (diacritice/majuscule) → nu se potrivesc.
4. **Niciun aranjament programat azi** în Program Salon → fallback pe alt aranjament care poate nu conține masa.
5. **Tura e ciornă** sau în afara intervalului orar → nu e „activă acum".
Verifică tura din Planificator (raion corect, publicată, interval) + aranjamentul zilei din Program Salon (masa e în el, raionul scris identic). Citește live cu `get_staff_overview(brandId, locationId)` (turele viitoare cu raionul) sau, la nevoie, cu accesul SQL read-only pe evidențele de ture/aranjamente. Nu presupune. (`get_shift_detail` e pentru turele de **producție**, nu de personal.)

## Verifică prin CITIRE (nu prin UI)

După orice scriere: `get_staff_overview` (angajați, roluri, ture viitoare, pontaje) / `list_entities` confirmă; pentru contracte `list_employee_contracts(employeeId?, active?)`, pentru concedii `list_leave_requests(employeeId?, brandId?, status?)`. Interfața se actualizează abia după refresh — succes la tool = salvat, nu repeta scrierea. Dacă modulul `personal` nu e pe token („permisiune insuficientă"), explică activarea din portal Hub → Acces AI. Audit pe un angajat: `jurnal_activitate(categorie:"STAFF", angajatId)`.
