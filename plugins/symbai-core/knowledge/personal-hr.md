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
- **Listă de sarcini** — checklist operațional legat opțional de un rol și o tură; sarcinile au prioritate (urgentă/medie/scăzută), termen și responsabil.
- **Grup de personal** — grup de chat intern (mesaje, fixare, răspunsuri) cu apartenență nominală, după rol, „cine e în tură" sau combinații.
- **Beneficiu personal** — regulă de mâncare/băutură pentru angajați: reducere %, sumă fixă, preț special sau gratuit dintr-un buget. Distinge **beneficiarul** (cine mănâncă) de **aplicator** (cine pune beneficiul pe notă la POS).
- **Raion (secțiune)** — zona de sală de care răspunde un ospătar în tura lui; determină la ce ospătar ajung comenzile clienților prin QR.

## Paginile modulului

**Personal (/staff)** — pagina centrală de HR, „Personal & Control Acces", cu 8 taburi:
- **Planificator Ture** — calendar săptămânal drag-and-drop: creezi/muți ture, undo, copiere săptămână, șabloane de tură și ștergere în masă, rânduri custom (rezervă/off/training), culori per angajat. Tot aici, sub planificator, e panoul **Cereri Concediu** unde managerul aprobă sau respinge cererile.
- **Foaie Pontaj** — pontajele efective (intrare/ieșire, pauze, total ore) cu flux de aprobare; orele suplimentare peste 8h se calculează automat. Pontarea propriu-zisă se face cu PIN de 4 cifre (intrare / pauză / ieșire).
- **Sarcini & Liste** — administrarea listelor de sarcini per rol/tură, cu atribuire și statusuri.
- **Listă Personal** — directorul angajaților: căutare, filtru pe rol, statistici (total, activi, roluri, estimare salarizare lunară), adăugare/editare/ștergere angajat, salarii lunare per angajat (buton dedicat pe fiecare rând).
- **Roluri & Permisiuni** — creezi roluri și bifezi permisiuni granulare; poți acorda „toate dintr-o categorie" cu un singur comutator.
- **Grupuri Mesaje** — administrarea grupurilor de chat ale personalului.
- **Program Salon** — programarea configurațiilor de sală pe zile (când e activă terasa etc.) și a raioanelor.
- **Contracte & Salarii** — contractele fiecărui angajat (CIM/SRL-PFA/Zilier/Fără contract), alocări procentuale sau fixe pe brand/locație și bonusuri. Salariile lunare se editează lună cu lună din Listă Personal (butonul dedicat de pe rândul angajatului), iar statul de plată se importă din Excel în pagina de import contabil (/accounting-import).

Pagini „personale" (pentru orice angajat logat):
- **Sarcinile Mele (/my-tasks)** — sarcinile proprii (de făcut / finalizate, cu bifare directă), sarcinile generale neatribuite (oricine le poate completa), tabul „Toate" (pentru cei cu permisiune de vizualizare a tuturor sarcinilor sau de management) și tabul „Liste" (doar pentru cei cu permisiune de management, care pot și crea sarcini și liste noi).
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
1. /staff → Sarcini & Liste (sau /my-tasks dacă ai permisiunea de management) → „Listă Nouă" legată de un rol/tură → adaugi sarcini cu prioritate, termen și responsabil.
2. Angajații le bifează din /my-tasks; sarcinile fără responsabil apar la „Generale" și le poate face oricine.

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
- Ture și program: `create_shift` (pentru ospătari include secțiunea pentru rutarea comenzilor QR), `update_shift`, `bulk_create_shifts`, `create_staff_schedule`, `bulk_create_staff_schedules`.
- Sarcini: `create_task_list`, `create_task`, `bulk_create_tasks`.

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

Exemple de întrebări: „câte ore a lucrat fiecare angajat luna trecută" (time_entries), „ce cereri de concediu sunt în așteptare" (leave_requests, status='pending'), „cât a consumat personalul pe beneficii luna asta" (staff_benefit_ledger).
