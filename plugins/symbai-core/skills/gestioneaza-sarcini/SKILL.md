---
name: gestioneaza-sarcini
description: Construiește și gestionează sarcini și liste (checklist-uri) pentru echipă în Symbai — țintă pe rol+tură+raion (vizibil automat celor în tură), atribuire pe nume, sarcini libere, recurență, oră-limită, dovadă (foto/notă/număr/semnătură), verificare, șabloane, dashboard manager. Folosește la „creează sarcină/listă/checklist", „task pentru angajat", „checklist de deschidere/închidere", „de ce nu vede angajatul sarcina", „programează sarcini recurente", „cine vede lista asta".
---

# Gestionează sarcini și liste — corect și complet

Citește întâi `knowledge/tasks-sarcini.md` (model nou: țintă rol+tură+raion → vizibil automat; recurență; dovadă; verificare; șabloane) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`.

**Două pagini, NU le confunda:** managerul **construiește** în `/staff` → tab **Sarcini & Liste**; angajatul **vede și bifează** în `/my-tasks`. O listă cu o ȚINTĂ (rol+tură+raion) apare AUTOMAT la cei care sunt azi în tură și se potrivesc — nu mai atribui manual fiecăruia.

**Tool-urile MCP dedicate sunt LIVE** — le apelezi direct: `create_targeted_task_list`/`create_task_list`, `create_targeted_task`/`create_task`/`bulk_create_tasks`, `clone_task_list`, `assign_task`, `complete_task`, `update_task`, `update_task_list`, `get_my_tasks`, `get_task_dashboard`, `list_tasks`, `list_task_lists`, `get_task`. Treci pe interfață (extensia Chrome) DOAR când modulul `personal` (scriere) nu e pe token („permisiune insuficientă”) — vezi activarea la final.

## Regula de aur

Înainte de a salva o listă țintită, **verifică audience-ul** („Cine va vedea asta și când"). Dacă lista de angajați iese goală, ținta e greșită sau nimeni nu e azi în tura aia — repară ținta, nu salva orbește.

## Recipe 1 — Creează o listă pe rol+tură+raion cu recurență

1. Context: `list_brands` + `list_locations` (ai nevoie de brandId/locationId). Rolul-țintă: `list_entities(entityType:"roles", brandId)` pentru roleId.
2. `create_targeted_task_list` cu: `title`, `targetRoleId` (gol = orice rol), `targetShift` (`any`|morning|afternoon|evening|night), `targetSection` (raion; gol = orice), `locationId`, `recurrence` (none|daily|weekdays|weekly|monthly), `recurrenceDays` (weekly: „mon,thu”; monthly: „15”), `dueTime` („11:00”), `color`.
   - **⚠ CAPCANĂ cu `targetSection`:** vizibilitatea pe raion se uită la raionul din programul publicat al angajatului (Planificator Ture) — iar acel raion **NU se poate seta prin MCP** (`create_staff_schedule` n-are param de raion; raionul pus prin `create_shift` contează doar pentru rutarea QR și e ignorat aici). Deci dacă turele au fost create prin MCP, o listă cu `targetSection` **NU ajunge la nimeni** — chiar dacă rolul și raionul par corecte. Soluție: țintește pe **rol + tură** (lasă `targetSection` gol) SAU pune raionul pe tură din aplicație (Planificator → Secțiune Atribuită), apoi re-verifică audience-ul.
3. Adaugi sarcinile cu `create_targeted_task` per sarcină (suportă dovadă/verificare/oră-limită; în liste recurente devine sarcină-șablon). `bulk_create_tasks` e doar pentru titluri simple, FĂRĂ aceste câmpuri. La cele care cer dovadă pune `requiresProof` (none|photo|note|photo_note|number|signature); la cele critice `requiresVerification:true`; opțional `dueTime` (suprascrie lista), `estimatedMinutes`.
4. **Verifică audience** (Recipe 2). Apoi confirmă userului ce ai făcut + link la `/staff?tab=tasks`.

## Recipe 2 — Verifică cine vede lista (audience)

- Prin MCP: `get_my_tasks` pe câțiva angajați-țintă (vezi dacă sarcina apare cu motivul „Rolul tău · tura de azi”) sau `get_task_dashboard` (per listă).
- În aplicație: pe lista din builder, panoul **„Cine va vedea asta și când”** arată nominal cine intră azi.
- Audience gol? Verifică în ordine: angajatul e azi în tură? rolul = ținta? raionul turei se potrivește? locația? lista e `active`? (vezi „Modelul de vizibilitate” din knowledge).

## Recipe 3 — Atribuire pe nume / sarcină liberă

- **Pe nume**: `assign_task(taskId, employeeId)` sau `create_targeted_task(... assignedTo: employeeId)` → o vede doar el („Atribuit ție”).
- **Liberă (general / up-for-grabs)**: listă FĂRĂ țintă (rol gol + tură `any` + raion gol) și sarcină fără `assignedTo` → apare la „Generale”, o poate prelua oricine.

## Recipe 4 — Șabloane (clonează)

- Salvează o listă bună ca șablon (`isTemplate:true`), apoi `clone_task_list(id, title?, isTemplate?)` ca să refolosești la altă locație/ocazie (sarcinile-șablon se copiază).
- Nu există preset-uri gata făcute: construiești o listă bună o dată (ex. „Deschidere Bar"), o salvezi ca șablon (`isTemplate`) și o clonezi pentru alte locații/ocazii.
- Recurența folosește tot sarcini-șablon: instanțele zilei se generează automat, în fiecare zi (nu retroactiv).

## Recipe 5 — Marchează cu dovadă / verificare

- Angajatul: `complete_task(taskId, employeeId, photoUrl?|note?|value?)` — trimite exact ce cere `requiresProof` (număr la `number`, text la `note`, URL poză la `photo`, etc.). De-bifare: `complete_task(... uncomplete:true)`.
- Sarcină cu verificare: după bifare rămâne „de confirmat” până o validează managerul. NU există tool MCP dedicat de verificare — sign-off-ul se face din aplicație (`/staff` → Sarcini & Liste, butonul de verificare pe sarcina bifată). Prin MCP poți doar citi starea (`get_task` arată dacă cere verificare).

## Recipe 6 — Dashboard manager

- `get_task_dashboard(brandId, locationId, date)` → per listă: De făcut / În lucru / Gata / Întârziate / total / procent (+ țintă, recurență, culoare). Rezumă userului ce listă rămâne în urmă.

## Fallback pe interfață (Chrome) — DOAR când modulul `personal` (scriere) nu e pe token

Tool-urile MCP de mai sus sunt LIVE; folosește-le mereu întâi. Treci pe interfață DOAR când scrierea e blocată („permisiune insuficientă” — modulul `personal` nu e pe token; vezi activarea la final).
Click-paths cu extensia Chrome (după ce userul e logat în aplicația lui):
- **Manager construiește**: navighează la `/staff?tab=tasks` → buton „Listă Nouă” → completezi titlu + țintă (rol/tură/raion/locație) + recurență + oră-limită + dovadă → uită-te la panoul „Cine va vedea asta și când” → „Salvează”. Adaugi sarcini cu „Adaugă sarcină” pe listă.
- **Șablon**: pe listă → „Salvează ca șablon” / „Pornește din șablon”.
- **Verifică o sarcină**: pe sarcina bifată cu „de confirmat” → butonul de verificare/sign-off.
- **Vede ca angajatul**: `/my-tasks` → tabul „Astăzi” (Întârziate→Azi→Următoarele), „Generale”, „Finalizate”.
- Citire stare oricând prin accesul SQL read-only (vezi exemplele din knowledge).

## „De ce nu vede angajatul sarcina?” (diagnostic rapid)

1. E azi în tură/program? (fără tură, ținta pe tură nu-l prinde). 2. Rolul lui = ținta listei? 3. Raionul turei = raionul-țintă? 4. Locația se potrivește? 5. Lista e `active`? 6. Listă recurentă → instanța zilei generată? Confirmă cu audience / `get_my_tasks`, nu din presupunere. Cauza clasică: listă veche cu rol/tură „decorative” (nu setate ca țintă reală).
**Cauza #1 când turele vin din MCP:** lista are `targetSection` (raion), dar tura angajatului din Planificator n-are raion (MCP nu-l poate seta) → vizibilitatea pe raion nu-l prinde. **Test rapid:** scoate `targetSection` (`update_task_list(taskListId, targetSection:"")`) și recheamă `get_my_tasks` — dacă acum îl vede, ăsta era. Apoi fie lași ținta pe rol+tură, fie pui raionul pe tură din aplicație.

## Verifică prin CITIRE (nu prin UI)

După orice scriere: `get_task_dashboard` / `list_tasks` / `get_my_tasks` confirmă rezultatul. Interfața se actualizează abia după refresh — succes la tool = salvat, nu repeta scrierea. Ștergerea listelor/sarcinilor întregi NU se face prin conexiune — îndrumă userul în aplicație. Dacă modulul `personal` nu e pe token („permisiune insuficientă”), explică activarea din portal Hub → Acces AI.
