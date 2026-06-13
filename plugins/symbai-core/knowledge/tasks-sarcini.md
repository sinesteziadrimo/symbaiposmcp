# Sarcini & Liste — checklist-uri pentru echipă (model nou)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare în aplicație.

## Pe scurt

Sistemul de sarcini are **două fețe** care nu trebuie confundate:
- **Managerul construiește** listele de sarcini din `/staff` → tabul **Sarcini & Liste** (cine, ce, când, cu ce dovadă).
- **Angajatul vede și bifează** sarcinile lui din `/my-tasks` (Sarcinile Mele), grupate pe Întârziate / Azi / Următoarele.

Schimbarea cea mai importantă față de vechiul model: o listă cu o **ȚINTĂ** (rol + tură + raion) apare **automat** la angajații care sunt în tură azi și se potrivesc țintei — nu mai trebuie să atribui manual fiecărei persoane. Vechiul model lega lista de un rol/tură doar „decorativ" (nu filtra nimic); acum ținta chiar decide cine vede sarcina.

## Concepte

- **Listă (checklist)** — un grup de sarcini cu un scop comun (ex. „Deschidere Bar", „Închidere Bucătărie", „Curățenie zilnică"). O listă are: titlu, culoare, o **țintă** (sau atribuire pe nume, sau lăsată liberă), opțional recurență, opțional o oră-limită implicită.
- **Țintă** — combinația **rol + tură + raion (+ locație)** spre care e îndreptată lista. O sarcină din lista țintită, fără responsabil nominal, devine **vizibilă automat** oricui e azi în tură și se potrivește țintei:
  - **rol**: ex. „Barman" → o văd doar barmanii (gol = orice rol);
  - **tură**: `any` / dimineață / după-amiază / seară / noapte — o văd doar cei care au azi o tură/program în fereastra respectivă (`any` = orice tură);
  - **raion (secțiune)**: ex. „Terasă" → o văd doar cei cu raionul ăla pe tură (gol = orice raion);
  - **locație**: limitează la o anumită locație (gol = orice locație a angajatului).
- **Atribuire pe nume** — pui sarcina pe o persoană anume (`assignedTo` = angajatul). O vede doar el, indiferent de rol/tură; motivul afișat e „Atribuit ție".
- **Sarcină liberă / generală** — sarcină fără responsabil **și** fără țintă (rol gol + tură `any` + raion gol). Apare la **toți**, la secțiunea „Generale" — o poate prelua și bifa oricine („up-for-grabs"). Util la lucruri care „trebuie făcute de cineva", fără să conteze cine.
- **Recurență** — o listă se poate repeta: `none` (o singură dată), `daily` (zilnic), `weekdays` (luni–vineri), `weekly` (pe anumite zile, ex. luni+joi), `monthly` (într-o anumită zi din lună, ex. 15). O listă recurentă ține **sarcini-șablon**; sistemul generează automat **instanțe** pentru ziua curentă (nu se completează șablonul, ci copia zilei).
- **Ora-limită (due time)** — ora până la care trebuie făcută sarcina (ex. 11:00). Se poate seta implicit pe listă și se poate suprascrie pe sarcină. O sarcină cu ora trecută apare la **Întârziate** (roșu).
- **Dovadă (proof)** — ce trebuie să atașeze angajatul ca să bifeze: `none` (doar bifă), `photo` (poză), `note` (text), `photo_note` (poză + text), `number` (un număr — ex. temperatura frigiderului), `signature` (semnătură). Util la HACCP, curățenie, verificări.
- **Verificare (sign-off)** — sarcină care, după ce angajatul o bifează, mai are nevoie de **confirmarea unui manager** ca să fie cu adevărat „gata". Util la lucruri critice.
- **Șablon (template)** — o listă salvată ca model, pe care o **clonezi** când vrei una nouă identică (ex. salvezi „Deschidere Bar" perfectă și o refolosești la altă locație). Recurența folosește tot sarcini-șablon în interior.
- **Estimare (minute)** — opțional, cât durează sarcina; ajută la planificare.
- **Escaladare** — dacă o sarcină rămâne întârziată, sistemul îi poate ridica nivelul (`shift_lead` → `manager`) și anunța pe cine trebuie.

## Cele două pagini (NU le confunda)

**Managerul — `/staff` → tab „Sarcini & Liste"** (sau `/my-tasks` → tabul „Liste", dacă are permisiune de management):
- aici **construiești** listele: titlu, țintă (rol/tură/raion/locație) SAU pe nume SAU liberă, recurență, oră-limită, dovadă, verificare;
- ai panoul **„Cine va vedea asta și când"** — preview live cu angajații care vor primi lista azi (cea mai utilă verificare: confirmă ținta înainte să salvezi);
- ai **dashboard-ul** per listă: 4 cifre colorate (De făcut / În lucru / Gata / Întârziate) + progres;
- salvezi ca **șablon** și **pornești din șablon** (clonezi); poți porni de la preset-uri RO (Deschidere Bar, Închidere Bucătărie, Curățenie zilnică, HACCP).

**Angajatul — `/my-tasks` (Sarcinile Mele)**:
- tabul **„Astăzi"**: feed unic ordonat **Întârziate → Azi → Următoarele** (nu o listă plată);
- bifare cu o atingere; dacă sarcina cere dovadă, apare un formular rapid (poză / notă / număr / semnătură) înainte de finalizare;
- tabul **„Generale"**: sarcinile libere pe care le poate prelua oricine;
- tabul **„Finalizate"**: ce a bifat azi (numără ȘI sarcinile atribuite, ȘI cele generale făcute de el);
- fiecare sarcină arată **DE CE** o vede: „Atribuit ție" / „Rolul tău · tura de azi" / „Liber";
- taburile **„Toate"** și **„Liste"** apar doar celor cu permisiune de vizualizare totală / management.

## Modelul de vizibilitate — în cuvinte simple

Un angajat **E** vede o sarcină **T** azi dacă se potrivește **oricare** din cele trei căi:
1. **Pe nume** — sarcina e atribuită direct lui (`assignedTo` = E). → motivul „Atribuit ție".
2. **Prin rol + tură (țintit)** — sarcina nu are responsabil nominal, dar lista ei e activă și E se potrivește țintei: rolul listei e gol sau e rolul lui; e azi în tura/fereastra-țintă; (dacă lista are raion) raionul turei lui îl conține; locația se potrivește. → motivul „Rolul tău · tura de azi".
3. **Liber (general)** — sarcina nu are responsabil ȘI lista nu are nicio țintă (rol gol + tură `any` + raion gol). → motivul „Liber" (oricine o poate face).

De aceea, dacă **un angajat NU vede o sarcină** pe care te aștepți s-o vadă, verifică în ordine:
- e azi în tură / în program? (fără tură azi, ținta pe tură nu-l prinde);
- rolul lui = rolul-țintă al listei? (alt rol → nu o vede);
- raionul de pe tura lui se potrivește cu raionul-țintă? (alt raion → nu o vede);
- locația turei = locația-țintă a listei?
- lista e **activă**? (lista dezactivată nu generează nimic);
- e o listă **recurentă** și instanța zilei a fost generată? (instanțele se nasc pe cloud pentru ziua curentă).
Cel mai rapid: deschide panoul **„Cine va vedea asta și când"** pe listă (sau tool-ul `get_task_dashboard` / audience) — îți spune exact cine intră azi.

## Fluxuri pas-cu-pas

**Manager: checklist de deschidere pentru barmani, în fiecare zi, până la ora 11:00, cu dovadă foto**
1. `/staff` → tab **Sarcini & Liste** → „Listă Nouă".
2. Titlu „Deschidere Bar"; **țintă**: rol = Barman, tură = dimineață, raion = (gol = orice), locație = locația ta.
3. **Recurență**: Zilnic; **oră-limită** implicită: 11:00.
4. Adaugi sarcinile (ex. „Verifică stocul de gheață", „Pornește espressorul", „Curăță blatul") — la cele care cer dovadă pui `photo` sau `number` (ex. temperatura frigiderului).
5. Te uiți la panoul **„Cine va vedea asta și când"** — confirmi că apar exact barmanii de dimineață de azi. Dacă lista e goală, ai greșit ținta sau nimeni nu e azi în tura aia.
6. Salvezi. De mâine, sistemul generează automat instanțele zilei pentru barmanii de dimineață.

**Angajat: bifează o sarcină cu dovadă**
1. Deschide `/my-tasks` → tabul „Astăzi”.
2. Apasă sarcina (ex. „Temperatura frigider 1”). Dacă cere dovadă, apare formularul: scrie numărul / fă poza / lasă nota / semnează.
3. Confirmă → sarcina trece în „Finalizate”. Dacă sarcina cere **verificare**, rămâne „de confirmat” până o validează managerul.

**Manager: refolosește o listă bună la altă locație (șablon)**
1. Pe lista existentă → „Salvează ca șablon" (sau e deja șablon).
2. „Pornește din șablon" / clonează → primești o copie; schimbi locația/ținta și salvezi.

**Manager: vezi unde stă echipa azi (dashboard)**
1. `/staff` → Sarcini & Liste → banda de dashboard per listă: De făcut / În lucru / Gata / Întârziate + progres.
2. La nevoie deschizi audience-ul listei ca să vezi nominal cine e responsabil azi.

## Tool-uri MCP pentru sarcini

> **⚠ Notă deploy**: tool-urile MCP dedicate sarcinilor (`create_task_list`, `create_task`, `bulk_create_tasks` extinse + cele noi de mai jos) ajung LIVE pe conexiune **abia după deploy-ul nexuspos**. Până atunci, lucrezi pe sarcini **prin interfață** (paginile de mai sus, eventual cu extensia Chrome) și citești starea prin **SQL read-only**. Verifică la conectare ce tool-uri apar — modelul e fail-closed: ce nu e în listă, nu se poate apela încă.

Citire (după deploy):
- `list_task_lists` — listele de sarcini ale brandului/locației (cu țintă, recurență, culoare).
- `list_tasks` / `get_task` — sarcinile (filtre pe listă, instanțe vs șabloane, ziua-instanță).
- `get_task_dashboard` — per listă: De făcut / În lucru / Gata / Întârziate / total / procent.
- `get_my_tasks` — feed-ul unui angajat pe o zi (Întârziate / Azi / Următoarele / Generale / Finalizate azi), cu motivul vizibilității per sarcină.

Scriere — modulul **personal** pe token (după deploy):
- `create_task_list` — listă nouă cu **țintă** (rol/tură/raion/locație), recurență, oră-limită, culoare, șablon da/nu.
- `update_task_list` — modifică ținta/recurența/ora/culoarea/activ.
- `clone_task_list` — clonează o listă (cu sarcinile-șablon) — pentru șabloane / duplicare.
- `create_task` — sarcină într-o listă, cu oră-limită, dovadă, verificare, estimare; pentru liste recurente = sarcină-șablon.
- `update_task` — modifică o sarcină.
- `complete_task` — bifează (cu poză/notă/număr/semnătură, după dovada cerută); poate și de-bifa.
- `assign_task` — pune sarcina pe o persoană anume.
- `bulk_create_tasks` — mai multe sarcini într-o listă deodată.
- `seed_task_templates` — populează preset-urile RO de HORECA (Deschidere Bar, Închidere Bucătărie, Curățenie zilnică, HACCP).

Până la deploy, tool-urile vechi `create_task_list` / `create_task` / `bulk_create_tasks` există deja, dar fără câmpurile noi de țintă/recurență/dovadă — pentru modelul complet folosește interfața.

## Exemple SQL (read-only)

Tabele cheie: `task_lists` (listele, cu `targetRoleId`, `targetShift`, `targetSection`, `recurrence`, `recurrenceDays`, `dueTime`, `color`, `active`; coloanele vechi `role`/`shift` păstrate doar pentru afișare) și `tasks` (sarcinile, cu `dueTime`, `occurrenceDate`, `templateTaskId`, `isTemplate`, `requiresProof`, `completionPhotoUrl`/`completionNote`/`completionValue`, `requiresVerification`/`verifiedBy`/`verifiedAt`, `escalationLevel`, `estimatedMinutes`).

- Listele active cu țintă: `SELECT id, title, target_role_id, target_shift, target_section, recurrence, due_time FROM task_lists WHERE active = true`.
- Sarcinile întârziate de azi (instanțe, nu șabloane): `SELECT id, title, due_time, status FROM tasks WHERE is_template = false AND status != 'completed' AND occurrence_date = CURRENT_DATE`.
- Câte sarcini a finalizat azi un angajat: `SELECT count(*) FROM tasks WHERE completed_by = :employeeId AND completed_at::date = CURRENT_DATE`.
- Sarcini care încă așteaptă verificarea managerului: `SELECT id, title FROM tasks WHERE requires_verification = true AND status = 'completed' AND verified_at IS NULL`.

(Workflow SQL: `list_database_tables` → `describe_database_table` → `execute_sql_query`; SELECT-only, coloane explicite, LIMIT obligatoriu.)

## Întrebări frecvente și capcane

- **De ce nu vede angajatul o sarcină?** Vezi „Modelul de vizibilitate" mai sus — cel mai des: nu e azi în tură, are alt rol/raion decât ținta listei, locația nu se potrivește, sau lista e dezactivată. Verifică rapid cu panoul „Cine va vedea asta și când".
- **Am pus lista pe rol/tură dar tot nu apare la nimeni.** În modelul vechi rolul/tura erau decorative. Acum trebuie setată **ținta** (`targetRoleId`/`targetShift`/`targetSection`), nu doar vechile câmpuri text — folosește builder-ul nou de listă, nu un import vechi.
- **Sarcina recurentă nu apare azi.** Instanțele zilei se generează pe cloud (cron de noapte + la deschiderea `/my-tasks`/dashboard); nu se generează retroactiv pentru zile trecute. Dacă tot lipsește, verifică dacă lista e activă și recurența se potrivește zilei (ex. `weekly` cu zilele corecte).
- **De ce „Finalizate” arăta mai puțin decât bifasem?** Vechiul ecran nu număra și sarcinile generale făcute de tine — noul `/my-tasks` numără ambele (atribuite + generale).
- **Bifez dar rămâne „de confirmat”.** Sarcina cere **verificare** — un manager trebuie s-o valideze (`verify`). Fără verificare, sarcina e gata la bifare.
- **Pot șterge o listă/sarcină prin conexiune?** Nu — ștergerile de entități întregi se fac din aplicație. Prin MCP poți crea/edita/bifa, nu șterge liste/sarcini întregi.
- **Diferența față de curățenia HACCP?** Sarcinile de curățenie HACCP au pagina lor (`/haccp` → Curățenie) și tool-ul `create_cleaning_task`; sunt un checklist de igienă dedicat. Sarcinile de personal de aici sunt operaționale generale (deschidere/închidere, verificări) — poți modela și HACCP-ul ca listă cu dovadă `number`, dar registrul oficial HACCP rămâne în modulul lui.
