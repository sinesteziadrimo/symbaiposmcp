# Personal (HR) — angajați, roluri, ture, pontaj, salarizare

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare în aplicație.

## Pe scurt

Modulul Personal acoperă tot ce ține de echipă: fișele angajaților, rolurile și permisiunile de acces, planificarea turelor, pontajul (intrare/ieșire cu PIN), contractele și salarizarea cu bonusuri, cererile de concediu, sarcinile zilnice, grupurile de chat ale personalului și beneficiile de mâncare/băutură pentru angajați. Centrul modulului e pagina /staff; angajații obișnuiți au paginile lor „personale" (/my-tasks, /my-groups, /my-leave-requests).

## Concepte

- **Angajat** — persoană din echipă, cu fișă proprie: nume, poreclă (afișată peste tot în aplicație), email, telefon, WhatsApp, rol, branduri și locații multiple, salariu, dată de angajare, culori proprii în planificator. Un angajat poate lucra la mai multe branduri/locații.
- **Rol** — set de permisiuni care controlează ce pagini și acțiuni vede angajatul. Există ~24 de roluri predefinite (Admin/Proprietar, Manager, Ospătar, Barman, Bucătar, Contabil etc.) plus roluri custom, pe ~196 de permisiuni granulare grupate pe module.
- **PIN** — cod de 4 cifre pentru autentificare rapidă pe POS și pontare. Câmpul PIN apare pe fișa angajatului doar dacă rolul lui are permisiunea de logare cu PIN.
- **Tură programată vs pontaj** — tura e planul (cine ar trebui să lucreze, când și pe ce raion); pontajul e realitatea (intrare/ieșire efectivă cu PIN, pauze urmărite). Turele se creează ca ciornă și devin vizibile angajaților după publicare.
- **Contract** — 4 tipuri: Contract de muncă (CIM), Colaborare SRL/PFA, Zilier (cu tarif pe zi) și Fără contract (practicant/asociat). Un angajat poate avea simultan mai multe contracte (ex. CIM + SRL).
- **Bonus** — 4 tipuri pe contract: lunar fix, % din vânzări, per zi lucrată, ad-hoc o singură dată. Bonusul % din vânzări se calculează din vânzările nete ale perioadei, opțional raportat doar la un brand de referință.
- **Cerere de concediu** — tipuri: concediu de odihnă, medical, zile personale, fără plată, eveniment special; statusuri: în așteptare / aprobat / respins (o cerere retrasă de angajat e marcată separat ca anulată).
- **Listă de sarcini** — checklist operațional cu o ȚINTĂ (rol + tură + raion) care îl face **vizibil automat** celor care sunt azi în tură și se potrivesc țintei (nu mai atribui manual fiecăruia), SAU atribuit pe nume, SAU lăsat liber pentru oricine. Sarcinile pot avea recurență (zilnic/zile lucrătoare/săptămânal/lunar), oră-limită, dovadă la bifare (foto/notă/număr/semnătură) și verificare de manager. Managerul construiește în `/staff` → Sarcini & Liste; angajatul vede și bifează în `/my-tasks` (grupat Întârziate → Azi → Următoarele). **Detalii complete: `knowledge/tasks-sarcini.md`.**
- **Grup de personal** — grup de chat intern (mesaje, fixare, răspunsuri) cu apartenență nominală, după rol, „cine e în tură" sau combinații.
- **Beneficiu personal** — regulă de mâncare/băutură pentru angajați: reducere %, sumă fixă, preț special sau gratuit dintr-un buget. Distinge **beneficiarul** (cine mănâncă) de **aplicator** (cine pune beneficiul pe notă la POS).
- **Raion (secțiune)** — zona de sală de care răspunde un ospătar în tura lui; determină la ce ospătar ajung comenzile clienților prin QR.

## Paginile modulului

**Personal (/staff)** — pagina centrală de HR, „Personal & Control Acces", cu 8 taburi:
- **Planificator Ture** — calendar săptămânal drag-and-drop: creezi/muți ture, undo, copiere săptămână, șabloane de tură și ștergere în masă, rânduri custom (rezervă/off/training), culori per angajat. Tot aici, sub planificator, e panoul **Cereri Concediu** unde managerul aprobă sau respinge cererile.
- **Foaie Pontaj** — pontajele efective (intrare/ieșire, pauze, total ore) cu flux de aprobare; orele suplimentare peste 8h se calculează automat. Pontarea propriu-zisă se face cu PIN de 4 cifre (intrare / pauză / ieșire).
- **Sarcini & Liste** — aici managerul construiește listele de sarcini: țintă pe rol+tură+raion (vizibile automat celor în tură), atribuire pe nume sau liste libere, recurență, oră-limită, dovadă la bifare, verificare; cu panou live „Cine va vedea asta și când”, șabloane și dashboard per listă (De făcut / În lucru / Gata / Întârziate). Detalii: `knowledge/tasks-sarcini.md`.
- **Listă Personal** — directorul angajaților: căutare, filtru pe rol, statistici (total, activi, roluri, estimare salarizare lunară), adăugare/editare/ștergere angajat, salarii lunare per angajat (buton dedicat pe fiecare rând).
- **Roluri & Permisiuni** — creezi roluri și bifezi permisiuni granulare; poți acorda „toate dintr-o categorie" cu un singur comutator.
- **Grupuri Mesaje** — administrarea grupurilor de chat ale personalului.
- **Program Salon** — programarea configurațiilor de sală pe zile (când e activă terasa etc.) și a raioanelor.
- **Contracte & Salarii** — contractele fiecărui angajat (CIM/SRL-PFA/Zilier/Fără contract), alocări procentuale sau fixe pe brand/locație și bonusuri. Salariile lunare se editează lună cu lună din Listă Personal (butonul dedicat de pe rândul angajatului), iar statul de plată se importă din Excel în pagina de import contabil (/accounting-import).

Pagini „personale" (pentru orice angajat logat):
- **Sarcinile Mele (/my-tasks)** — feed-ul angajatului, grupat Întârziate → Azi → Următoarele, cu bifare directă (și formular de dovadă unde se cere: foto/notă/număr/semnătură); fiecare sarcină arată DE CE o vede („Atribuit ție" / „Rolul tău · tura de azi" / „Liber"). Taburi: Astăzi, Generale (sarcini libere pe care le poate prelua oricine), Finalizate (numără și cele atribuite, și cele generale făcute de el) și — doar cu permisiune — Toate / Liste (unde managerul construiește). Detalii: `knowledge/tasks-sarcini.md`.
- **Grupurile Mele (/my-groups)** — chat-ul de grupuri al angajatului; cei cu permisiune de marketing au și o intrare separată către chat-ul de marketing.
- **Cererile Mele (/my-leave-requests)** — angajatul își vede cererile de concediu, trimite cereri noi (tip, interval, motiv) și poate anula o cerere cât timp e încă în așteptare; vede nota managerului la aprobare/respingere.

Setări și pagini conexe:
- **Beneficii Personal (/settings/staff-benefits)** — comutator global de activare + 3 taburi: **Reguli** (cine primește, la ce produse, ce valoare), **Buget per angajat** (buget individual care înlocuiește bugetul standard al regulii) și **Istoric** (registrul consumului, cu link spre raportul /reports/staff-benefits). Fiecare regulă salvată are panoul „Stare regulă" care îți spune exact de ce nu se poate aplica acum.
- **AI Angajați (/ai-angajati)** — asistentul AI de HR: răspunde la întrebări despre echipă, ture, contracte și Codul muncii (ex. calcul ore suplimentare) și poate adăuga/actualiza/importa angajați prin conversație.

## Fluxuri frecvente

**Adaugi un angajat nou**
1. /staff → butonul „Adaugă Angajat" → completezi prenume + email (obligatorii), rol, branduri/locații, salariu lunar brut (tariful orar se calculează automat la 168h/lună).
2. După salvare, din fișa angajatului generezi link-uri securizate de setare parolă și PIN (valabile 48h) și i le trimiți, ca să și le aleagă singur; la nevoie poți seta parola și PIN-ul și direct pe fișă.

**Planifici turele săptămânii**
1. /staff → tab Planificator Ture → tragi turele pe calendar (sau copiezi săptămâna trecută).
2. Pentru ospătari setezi pe tură raionul (secțiunea) — de el depinde rutarea comenzilor QR.
3. Publici programul; angajații îl văd în aplicație după publicare.

**Aprobi o cerere de concediu**
1. Angajatul trimite cererea din /my-leave-requests.
2. Tu o aprobi/respingi din /staff → Planificator Ture → panoul „Cereri Concediu" (sau din centrul de aprobare al managerului).

**Configurezi mâncarea personalului (beneficii)**
1. /settings/staff-benefits → activezi comutatorul global.
2. Creezi o regulă: cine primește (toți / după rol / angajați specifici), la ce produse (toate / pe etichete / pe tipuri / produse specifice), ce valoare (gratuit 100%, reducere %, sumă fixă per produs sau per comandă, preț fix, sau gratuit din buget zilnic/săptămânal/lunar).
3. Setezi separat aplicatorii: „fiecare pentru el" și/sau roluri/persoane care pot aplica la oricine. Opțional bifezi „doar când angajatul e la lucru" (pontat sau în tură).
4. Beneficiul se aplică din meniul mesei la POS; consumul apare în Istoric și în raportul dedicat.

**Setezi contract și bonusuri**
1. /staff → tab Contracte & Salarii → alegi angajatul → contract nou (CIM / SRL-PFA / Zilier / Fără contract).
2. Adaugi alocări pe brand/locație și bonusuri (lunar fix, % din vânzări — cu brandul de referință, per zi, o singură dată).
3. La final de lună poți edita salariul lunii respective fără să atingi contractul — salariile lunare sunt intrări separate, unice pe angajat și lună (le deschizi din tab-ul Listă Personal, butonul de salarii de pe rândul angajatului).

**Dai sarcini echipei**
1. /staff → Sarcini & Liste (sau /my-tasks dacă ai permisiunea de management) → „Listă Nouă" cu ȚINTĂ (rol + tură + raion) → adaugi sarcinile (opțional recurență, oră-limită, dovadă, verificare).
2. Verifici panoul „Cine va vedea asta și când" — confirmi că lista ajunge la cine trebuie azi.
3. Angajații le bifează din /my-tasks (grupat Întârziate → Azi → Următoarele); sarcinile fără țintă și fără responsabil apar la „Generale" și le poate face oricine.
   Pas-cu-pas + diagnostic „de ce nu vede angajatul sarcina": skill-ul `gestioneaza-sarcini` și `knowledge/tasks-sarcini.md`.

## Programarea unei ture — câmp cu câmp (modalul „Programare Tură Nouă")

În Planificator Ture, clic pe o celulă goală (sau „Editare" pe o tură) deschide modalul. Câmpurile:

- **Angajat** — alegi din listă; lista e filtrată după unitatea selectată (brand/locație). De aici se ia angajatul turei.
- **Dată** — ziua turei. **Important**: ziua decide ce **Aranjament Sală** se încarcă automat (din Program Salon).
- **Ora Început / Ora Sfârșit** — intervalul turei (24h, ex. 10:00 → 23:59). Ture peste miezul nopții sunt acceptate.
- **Rol** — needitabil; vine din rolul angajatului (rolul se schimbă din fișa angajatului, nu de aici).
- **Locație Tură** — apare doar dacă ai mai multe locații. Schimbarea locației resetează aranjamentul și raioanele alese.
- **Brand** — opțional, apare doar la multi-brand („Toate brandurile" = fără brand anume).
- **Aranjament Sală** — configurația de sală activă în ziua turei. **Dacă ziua are deja un aranjament programat în Program Salon, câmpul e blocat** (badge „Program Salon") — lucrezi cu aranjamentul programat. Dacă nu e programat nimic pe ziua aia, alegi manual (poți alege chiar mai multe aranjamente).
- **Secțiune Atribuită (raionul)** — **cel mai important câmp pentru rutarea comenzilor QR.** Raioanele din listă vin din aranjamentul ales (secțiunile lui). Poți pune ospătarul pe mai multe raioane (se salvează separate prin virgulă, ex. „Terasă,Bar"). **Comenzile clienților prin QR ajung la ospătarul al cărui raion se potrivește cu raionul mesei** — dacă raionul e gol sau scris altfel decât în aranjament, comanda nu-l prinde.
- **Notă Tură** — text liber (evenimente speciale, sarcini).
- **Status** — **Ciornă (Privat)** = invizibilă pentru angajat; **Publicat (Vizibil pentru Personal)** = o vede în aplicație. Turele rămân ciornă până apeși **„Salvează și Publică Program"** (publicarea trimite și notificările). Estimarea de cost afișată pe rânduri e deocamdată un placeholder, nu un calcul real.

Reasignare rapidă de raion: din detaliile turei poți comuta raionul cu butoanele de secțiune (se salvează automat după o scurtă pauză). Tabela din spate e mereu `staff_schedules` (chiar dacă UI-ul zice „tură").

## Program Salon — ce aranjament e activ pe fiecare zi + QR-ul per raion

Tabul **Program Salon** spune sistemului **ce aranjament de sală e activ în fiecare zi a săptămânii**, per locație (și opțional brand), plus cum se comportă QR-ul clientului per raion.

- **Aranjament per zi** — pentru fiecare zi (Luni…Duminică) alegi un aranjament de sală. „— Implicit —" = nu programezi nimic pe ziua aia (sistemul ia primul aranjament activ). Aranjamentul programat pe o zi e cel care **blochează** câmpul Aranjament Sală din modalul de tură pe acea zi — exact ca să nu pui ospătarul pe raioane care nu există în sala zilei.
- **Excepții pe dată** — pentru sărbători/evenimente pui un aranjament diferit pe o dată anume (cu notă). Excepția pe dată **bate** programul săptămânal pentru ziua aceea.
- **QR Self-Service per raion** — sub fiecare zi, fiecare raion (zonă) poate avea un **preset de QR**. Presetul decide ce câmpuri cere clientul la scanare și cum se atașează comanda:
  - **„Prenume"** = se cere prenumele clientului la scanare (cu `*` = obligatoriu).
  - **„La scanare"** = momentul în care se cer datele (alternativ: înainte / după comandă).
  - **„Confirmare ospătar"** = clientul scanează și completează, dar **comanda se atașează la masă/ospătar abia după ce ospătarul confirmă** (tap „Confirmă"). Fără confirmare ospătar = se atașează automat la ospătarul raionului.
  - Badge-ul „N/M" arată câte raioane (din total) au QR pornit pe ziua aceea.

Lanțul complet: **Program Salon (ziua → aranjament + raioane)** → modalul de tură citește aranjamentul zilei și-ți dă raioanele → pui ospătarul pe raion → la scanarea QR, comanda merge la el. Dacă raionul lipsește din aranjamentul zilei, nu apare în modal și nu poți programa pe el.

## ⭐ Cum intră comanda QR la ospătarul corect — ladderul de rutare (în cuvinte simple)

Când un client scanează QR-ul mesei și trimite o comandă, sistemul caută ospătarul după o **scară de priorități** (prima regulă care prinde, câștigă):

1. **Masa deschisă în POS** — dacă un ospătar a deschis deja masa în POS (a „blocat-o"), comanda merge la el, indiferent de raion.
2. **Are deja comandă activă pe masă** — dacă pe masă există o comandă deschisă a unui ospătar, noua comandă merge la același.
3. **Aranjamentul activ azi** — sistemul află ce aranjament e activ azi (excepție pe dată → program săptămânal → fallback) și din el află **raionul mesei**.
4. **Zone assignments (raion pe dată + interval orar)** — cea mai precisă: dacă există o atribuire de raion pe ziua și ora curentă (raion + dată + interval), comanda merge la acel ospătar.
5. **Raionul din tură (Secțiune Atribuită)** — toate turele/programele active acum al căror raion (poate fi listă cu virgulă) se potrivește cu raionul mesei.
6. **Numele zonei de sală** — dacă numele zonei mesei se potrivește cu raionul din tură.
7. **Prefixul numelui mesei** — dacă numele mesei începe cu numele raionului (ex. „BAR 1" → raion „BAR").
8. **Un singur ospătar azi** — dacă e exact un ospătar în tură azi, la el merge.
9. **Nimeni** — comanda se creează fără ospătar (apoi se escaladează — vezi mai jos).

„În tură acum" combină **două surse**: turele programate (`staff_schedules`, publicate) ȘI pontările din POS (`shifts`, când ospătarul „Deschide tură") — ambele cu raionul lor. **Plasă de siguranță**: dacă în 120 de secunde nimeni nu acceptă comanda, ea se escaladează la TOȚI ospătarii în tură, indiferent de raion.

**De ce comanda QR NU intră la ospătarul corect (cauze, în ordinea probabilității):**
1. **Raion gol pe tură/pontaj** — managerul nu a pus Secțiune Atribuită, sau ospătarul a deschis tură din POS fără raion → comanda nu prinde pe nimeni pe raion.
2. **Masa nu e în aranjamentul zilei** — masa a fost adăugată după ce s-a făcut aranjamentul, sau numele mesei diferă (majuscule/spațiere) → raionul mesei iese gol.
3. **Raion scris diferit** — „Terasă" pe masă vs „Terasa" pe tură (diacritice/majuscule) → nu se potrivesc.
4. **Niciun aranjament programat azi** — Program Salon nu are nimic pe ziua curentă → fallback pe alt aranjament care poate nu conține masa.
5. **Tura e ciornă** (nepublicată) sau în afara intervalului orar curent → nu e „activă acum".

Reparare: verifică tura din Planificator (raion corect + publicată + interval) și aranjamentul zilei din Program Salon (masa e în el, raionul scris la fel). Aceleași reguli rulează și pe serverul local (edge) când locația e offline.

## Schimbarea unității (selectorul brand/locație)

Sus în pagina /staff (la multi-brand/multi-locație) e selectorul de **unitate** = perechea brand + locație (ex. „Drimoland — Sala Principală"); „Toate unitățile" arată tot. Schimbarea filtrează lista de personal și contextul de planificare. Fiecare angajat își poate salva unitatea preferită (cu care intră implicit data viitoare). Prin conexiune nu există încă un tool dedicat de schimbare a unității — pentru a citi personalul unei unități folosește `get_staff_overview(brandId, locationId)`; preferința per angajat se ține pe `/api/employees/:id/selected-unit` (cheia „brandId-locationId", ex. „5-10") și se schimbă din interfață (sau cu `?unit=5-10` pe URL prin extensia Chrome).

## Tool-uri MCP utile

Citire (fără permisiuni de scriere):
- `get_staff_overview` — rezumat complet: angajați, roluri, ture viitoare, liste de sarcini, pontaje (per brand/locație).
- `performanta_ospatari` — vânzările per angajat pe o perioadă: bonuri, încasări, bon mediu, bacșiș.
- `jurnal_activitate` — cine a făcut ce și când (categorie STAFF, tipEntitate `employee`): util la audit pe un angajat.
- `gaseste_in_aplicatie` — găsește pagina potrivită și linkul direct.
- SQL doar-citire (dacă tokenul are SQL activat): `list_database_tables` → `describe_database_table` → `execute_sql_query`.

Scriere — cer modulul de permisiune **personal** pe token:
- Angajați: `create_employee`, `update_employee`, `bulk_create_employees` (import Revisal/Excel).
- Roluri: `create_role`, `update_role`, `set_role_permissions`, `seed_default_roles` (setul standard pe tip de business).
- Ture și program: `create_shift` / `update_shift` / `bulk_create_shifts` — pentru ospătari pune `floorConfigId` (aranjamentul zilei) + `sectionId`/`sectionName` (raionul) ca să meargă rutarea QR; `create_staff_schedule`, `bulk_create_staff_schedules`. Aranjamente de sală + raioane: `create_floor_zone`, `bulk_create_floor_tables`, `create_floor_config`, `add_sections_to_config`, `assign_tables_to_section`, `create_floor_config_schedule` (ce aranjament pe ce zi).
- Contracte și salarizare — **disponibile DOAR după deploy-ul nexuspos** (până atunci din interfață, tab Contracte & Salarii): `list_employee_contracts` (citire), `create_employee_contract` / `update_employee_contract` (`contractKind`: cim|srl_pfa|zilier|fara_contract; salariu brut/net sau tarif pe zi; `allocations` toate de același tip — % ≤ 100 sau sume fixe ≤ brut; `bonuses`: monthly_fixed|percent_sales|per_day|one_time), `upsert_employee_monthly_salary` (salariul lunii, unic pe angajat+an+lună), `create_time_entry`/`update_time_entry` (pontaj — intrare/ieșire, idempotent pe pontajul deschis), `list_leave_requests`/`create_leave_request`/`update_leave_request` (concedii: aprobă/respinge/anulează). ⚠ La update de contract, `allocations`/`bonuses` ÎNLOCUIESC tot setul — trimite lista completă.
- Sarcini: `create_task_list`, `create_task`, `bulk_create_tasks` (deja disponibile). **După deploy-ul nexuspos** se adaugă câmpurile de țintă/recurență/dovadă pe acestea plus tool-uri noi: `list_task_lists`, `list_tasks`, `get_task`, `get_task_dashboard`, `get_my_tasks` (citire), `update_task_list`, `clone_task_list`, `update_task`, `complete_task`, `assign_task`, `seed_task_templates`. Până atunci, modelul complet (țintă, recurență, dovadă) se face din interfață. Vezi `knowledge/tasks-sarcini.md` + skill-ul `gestioneaza-sarcini`.

Atenție: turele de **producție** (fabrică) sunt alt concept și au tool-urile lor în modulul **productie** (`create_production_shift`, `create_shift_assignment`) — nu le confunda cu turele de personal. Ștergerile de entități (ex. ștergerea unei ture sau a unui angajat) NU sunt disponibile prin MCP — se fac doar din aplicație.

## Întrebări frecvente și capcane

- **De ce nu văd câmpul PIN pe fișa angajatului?** Rolul selectat nu are permisiunea de logare cu PIN. Schimbă rolul sau adaugă permisiunea la rol și câmpul apare.
- **De ce „nu merge" beneficiul de masă la POS?** Verifică în ordine: (1) comutatorul global din /settings/staff-benefits e pornit; (2) cel care aplică e în lista de **aplicatori** ai regulii (e separată de lista de beneficiari); (3) dacă regula are „doar când e la lucru", angajatul trebuie să fie pontat sau în tură; (4) bugetul nu e epuizat. Deschide regula și uită-te la panoul „Stare regulă" — îți spune exact cauza.
- **De ce arată raportul unei ture alte cifre decât mă așteptam?** La predarea turei, încasările ei sunt înghețate într-un instantaneu — raportul istoric al turei afișează exact cifrele de la predare, chiar dacă o plată e confirmată mai târziu.
- **De ce nu mai pot modifica o tură?** Tura a fost închisă (predată) — turele închise devin imutabile, iar încasările lor rămân cele înghețate la predare.
- **Unde aprob cererile de concediu? Nu le găsesc la /my-leave-requests.** /my-leave-requests e pagina personală a angajatului (doar cererile lui). Aprobarea se face din /staff → Planificator Ture, panoul „Cereri Concediu".
- **De ce nu poate angajatul să anuleze o cerere de concediu?** Cererea se poate anula doar cât timp e „în așteptare"; după aprobare/respingere nu mai poate fi anulată de angajat.
- **Comanda prin QR a ajuns la alt ospătar.** Rutarea se face după raionul (secțiunea) setat pe tura ospătarului — verifică tura din planificator și programul de sală.
- **De ce nu vede angajatul o anumită pagină?** Paginile sunt controlate de permisiunile rolului; navigarea spre o pagină nepermisă îl redirecționează la „Sarcinile Mele". Adaugă permisiunea pe rol din /staff → Roluri & Permisiuni.
- **Cum primește angajatul parola?** Varianta recomandată: generezi din fișa lui un link securizat de setare parolă sau PIN (valabil 48h) și i-l trimiți — își alege singur parola. La nevoie, o poți seta și direct pe fișă.
- **Cardurile de acces RFID țin de modulul Personal?** Nu — au pagina lor (/access-cards), unde se asociază clienților, se încarcă credite și se blochează cardurile pierdute.

## Pentru acces SQL

Tabele relevante: `employees`, `roles`, `shifts` (ture programate), `staff_schedules` (program planificat), `time_entries` (pontaje), `leave_requests`, `tasks` + `task_lists`, `employee_contracts`, `employee_monthly_salaries`, `staff_groups` + `staff_group_messages`, `staff_benefit_rules` + `staff_benefit_ledger` + `staff_benefit_employee_overrides`.

Exemple de întrebări: „câte ore a lucrat fiecare angajat luna trecută" (time_entries), „ce cereri de concediu sunt în așteptare" (leave_requests, status='pending'), „cât a consumat personalul pe beneficii luna asta" (staff_benefit_ledger), „ce sarcini sunt întârziate azi" (`tasks`, is_template=false, occurrence_date=CURRENT_DATE, status!='completed'). Pentru noul model de sarcini (`task_lists.target_role_id`/`target_shift`/`recurrence`, `tasks.requires_proof`/`occurrence_date`) vezi `knowledge/tasks-sarcini.md`.
