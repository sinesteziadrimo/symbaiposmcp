---
name: gestioneaza-sarcini
description: Construiește și gestionează sarcini și liste (checklist-uri) pentru echipă în Symbai — țintă pe rol+tură+raion (vizibil automat celor în tură), atribuire pe nume, sarcini libere, recurență, oră-limită, dovadă (foto/notă/număr/semnătură), verificare, șabloane, dashboard manager. Folosește la „creează sarcină/listă/checklist", „task pentru angajat", „checklist de deschidere/închidere", „de ce nu vede angajatul sarcina", „programează sarcini recurente", „cine vede lista asta".
---

# Gestionează sarcini și liste — corect și complet

Citește întâi `knowledge/tasks-sarcini.md` (model nou: țintă rol+tură+raion → vizibil automat; recurență; dovadă; verificare; șabloane) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`.

**Două pagini, NU le confunda:** managerul **construiește** în `/staff` → tab **Sarcini & Liste**; angajatul **vede și bifează** în `/my-tasks`. O listă cu o ȚINTĂ (rol+tură+raion) apare AUTOMAT la cei care sunt azi în tură și se potrivesc — nu mai atribui manual fiecăruia.

**⚠ Deploy:** tool-urile MCP dedicate (cele de mai jos) sunt LIVE **abia după deploy-ul nexuspos**. Până atunci → lucrezi **prin interfață** (eventual cu extensia Chrome) + citești prin **SQL read-only**. Verifică la conectare ce tool-uri apar; ce nu e în listă, nu se poate apela.

## Regula de aur

Înainte de a salva o listă țintită, **verifică audience-ul** („Cine va vedea asta și când"). Dacă lista de angajați iese goală, ținta e greșită sau nimeni nu e azi în tura aia — repară ținta, nu salva orbește.

## Recipe 1 — Creează o listă pe rol+tură+raion cu recurență

1. Context: `list_brands` + `list_locations` (ai nevoie de brandId/locationId). Rolul-țintă: `list_entities(entityType:"roles", brandId)` pentru roleId.
2. `create_task_list` cu: `title`, `targetRoleId` (gol = orice rol), `targetShift` (`any`|morning|afternoon|evening|night), `targetSection` (raion; gol = orice), `locationId`, `recurrence` (none|daily|weekdays|weekly|monthly), `recurrenceDays` (weekly: „mon,thu”; monthly: „15”), `dueTime` („11:00”), `color`.
3. Adaugi sarcinile: `bulk_create_tasks(taskListId, tasks:[…])` sau `create_task` per sarcină. La cele care cer dovadă pune `requiresProof` (none|photo|note|photo_note|number|signature); la cele critice `requiresVerification:true`; opțional `dueTime` (suprascrie lista), `estimatedMinutes`.
4. **Verifică audience** (Recipe 2). Apoi confirmă userului ce ai făcut + link la `/staff?tab=tasks`.

## Recipe 2 — Verifică cine vede lista (audience)

- Prin MCP: `get_my_tasks` pe câțiva angajați-țintă (vezi dacă sarcina apare cu motivul „Rolul tău · tura de azi”) sau `get_task_dashboard` (per listă).
- În aplicație: pe lista din builder, panoul **„Cine va vedea asta și când”** arată nominal cine intră azi.
- Audience gol? Verifică în ordine: angajatul e azi în tură? rolul = ținta? raionul turei se potrivește? locația? lista e `active`? (vezi „Modelul de vizibilitate” din knowledge).

## Recipe 3 — Atribuire pe nume / sarcină liberă

- **Pe nume**: `assign_task(taskId, employeeId)` sau `create_task(... assignedTo: employeeId)` → o vede doar el („Atribuit ție”).
- **Liberă (general / up-for-grabs)**: listă FĂRĂ țintă (rol gol + tură `any` + raion gol) și sarcină fără `assignedTo` → apare la „Generale”, o poate prelua oricine.

## Recipe 4 — Șabloane (clonează)

- Salvează o listă bună ca șablon (`isTemplate:true`), apoi `clone_task_list(id, title?, isTemplate?)` ca să refolosești la altă locație/ocazie (sarcinile-șablon se copiază).
- Pornire rapidă RO: `seed_task_templates` populează preset-uri HORECA (Deschidere Bar, Închidere Bucătărie, Curățenie zilnică, HACCP).
- Recurența folosește tot sarcini-șablon: instanțele zilei se generează automat pe cloud (nu retroactiv).

## Recipe 5 — Marchează cu dovadă / verificare

- Angajatul: `complete_task(taskId, employeeId, photoUrl?|note?|value?)` — trimite exact ce cere `requiresProof` (număr la `number`, text la `note`, URL poză la `photo`, etc.). De-bifare: `complete_task(... uncomplete:true)`.
- Sarcină cu verificare: după bifare rămâne „de confirmat” până managerul dă `verify` (POST `/api/tasks/:id/verify`) — prin MCP, tool-ul de verificare după deploy.

## Recipe 6 — Dashboard manager

- `get_task_dashboard(brandId, locationId, date)` → per listă: De făcut / În lucru / Gata / Întârziate / total / procent (+ țintă, recurență, culoare). Rezumă userului ce listă rămâne în urmă.

## Cum lucrează Claude când tool-urile MCP NU sunt încă LIVE (Chrome)

Click-paths cu extensia Chrome (după ce userul e logat în aplicația lui):
- **Manager construiește**: navighează la `/staff?tab=tasks` → buton „Listă Nouă” → completezi titlu + țintă (rol/tură/raion/locație) + recurență + oră-limită + dovadă → uită-te la panoul „Cine va vedea asta și când” → „Salvează”. Adaugi sarcini cu „Adaugă sarcină” pe listă.
- **Șablon**: pe listă → „Salvează ca șablon” / „Pornește din șablon”.
- **Verifică o sarcină**: pe sarcina bifată cu „de confirmat” → butonul de verificare/sign-off.
- **Vede ca angajatul**: `/my-tasks` → tabul „Astăzi” (Întârziate→Azi→Următoarele), „Generale”, „Finalizate”.
- Citire stare oricând prin SQL read-only (`task_lists`, `tasks` — vezi exemplele din knowledge).

## „De ce nu vede angajatul sarcina?” (diagnostic rapid)

1. E azi în tură/program? (fără tură, ținta pe tură nu-l prinde). 2. Rolul lui = ținta listei? 3. Raionul turei = raionul-țintă? 4. Locația se potrivește? 5. Lista e `active`? 6. Listă recurentă → instanța zilei generată? Confirmă cu audience / `get_my_tasks`, nu din presupunere. Cauza clasică: listă veche cu rol/tură „decorative” (nu setate ca țintă reală).

## Verifică prin CITIRE (nu prin UI)

După orice scriere: `get_task_dashboard` / `list_tasks` / `get_my_tasks` confirmă rezultatul. Interfața se actualizează abia după refresh — succes la tool = salvat, nu repeta scrierea. Ștergerea listelor/sarcinilor întregi NU se face prin conexiune — îndrumă userul în aplicație. Dacă modulul `personal` nu e pe token („permisiune insuficientă”), explică activarea din portal Hub → Acces AI.
