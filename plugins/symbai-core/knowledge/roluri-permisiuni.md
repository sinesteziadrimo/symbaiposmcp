# Roluri & Permisiuni — cine ce vede și ce poate face

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`. Pentru **vocabularul complet și mereu la zi al permisiunilor** folosește tool-ul live `list_permission_catalog` — el e sursa autoritară (nu lista din acest document, care e doar orientativă).

## Pe scurt

În Symbai, ce vede și ce poate face un angajat **nu se setează pe angajat**, ci pe **rolul** lui. Un rol e un set de **permisiuni** (drepturi). Fiecare permisiune deblochează pagini și acțiuni. Dacă un rol nu are permisiunea unei pagini, pagina **dispare din meniu** și, dacă angajatul încearcă să ajungă la ea, e trimis la „Sarcinile Mele". Deci: **schimbi ce vede cineva schimbând permisiunile rolului lui.**

Regula de aur: **întâi verifici ce EXISTĂ deja (rolurile reale ale clientului + rolurile prestabilite), abia apoi pregătești, previzualizezi și creezi — și verifici prin citire, nu prin UI.** Un rol compus de mână, cheie cu cheie, este ULTIMA variantă, nu prima.

## Concepte

- **Rol** — un nume (ex. „Ospătar", „Casier", „Bucătar Șef") cu o listă de permisiuni. Un angajat are un singur rol. Rolurile pot fi predefinite (gata făcute) sau custom.
- **Permisiune** — un drept individual, cu o cheie scurtă (ex. `pos_access`, `process_payment`, `production_view`) și o etichetă în română. Permisiunile sunt grupate pe **categorii** (Salon & Mese, Plăți & Casierie, Bucătărie & Producție, Personal & Ture, Finanțe, Inventar, Rezervări, Marketing, Analiză, Hotel, Ecommerce ș.a.).
- **Cheie „all"** — super-administrator. Un rol cu `all` vede și poate TOT. Se pune singur (nu mai adaugi altele lângă). Tipic doar pentru Administrator/Proprietar.
- **Cheie „all:<categorie>"** — acordă **toată** o categorie dintr-o dată. Ex. `all:payments` = tot din Plăți & Casierie; `all:kitchen` = tot din Bucătărie & Producție. Foarte util ca să nu bifezi 15 chei una câte una.
- **Ce vede ≠ ce am bifat** — accesul la pagini se **derivă** din permisiuni. De-asta există tool-uri care îți arată direct **ce pagini** rezultă dintr-un set de chei, ca să nu ghicești.

## ⚠ Roluri PRESTABILITE — regula #1 la orice cerere de rol

Symbai are un catalog de **roluri prestabilite** (Ospătar, Barman, Casier, Bucătar Șef, Recepționer Hotel, Manager Fabrică, Șofer, Gestionar…), grupate pe **tipuri de activitate** (restaurant, cafenea/bar, fast-food, hotel, evenimente & catering, fabrică, construcții, retail, supermarket, magazin online, distribuție, servicii, agrement). Fiecare vine **cu permisiunile deja setate corect** și cu politica de PIN potrivită meseriei.

**De aceea, când clientul cere „fă-mi un rol de X" sau „adaugă roluri la locația Y", ordinea e MEREU:**

1. **Verifici dacă există deja** → `find_role_for_job(job)`. Poate clientul are deja rolul făcut (sub alt nume) — atunci îl folosești, nu creezi al doilea.
2. **Dacă nu există, dar există ca prestabilit** → `apply_role_presets(roleNames:[…])`. Permisiunile vin gata; nu le compui tu.
3. **Abia dacă nu există nici ca rol, nici ca prestabilit** → compui unul nou (`suggest_role_setup` → `preview_role_access` → `create_role`).

**La o locație nouă** nu întreba clientul ce roluri vrea și nu inventa o listă: `plan_location_roles(brandId)` îți spune ce are deja și **ce roluri îi lipsesc** față de setul recomandat pentru activitatea lui (tipul de activitate e dedus singur din brand). Îi prezinți lista și, la acceptul lui, le aplici dintr-o mișcare.

**De ce contează:** roluri duplicate („Barman" lângă „Barman ") și aceeași meserie cu drepturi diferite de la o locație la alta fac auditul imposibil și produc exact reclamațiile de tip „de ce vede ăsta și celălalt nu". Un rol compus de mână are mereu chei lipsă față de preset (tipic `pin_login`, `tasks_view`) — omul rămâne fără login rapid sau fără spațiu de lucru în Symbai Staff.

## Tool-urile — grupate pe „înțelege" și „acționează"

### A) Înțelege (READ — cer citire pe modulul `personal` în grant)

- **`find_role_for_job`** (`job`, `businessType?`, `brandId?`) — **PRIMUL tool la orice cerere de rol.** Îi dai meseria în cuvintele clientului („barman", „cineva care doar încasează") și îți spune dacă e deja acoperită: caută întâi în rolurile REALE (după nume și după cât acoperă din atribuții), apoi în cele prestabilite. Întoarce un verdict clar: `use_existing` (ai deja rolul — folosește-l), `apply_preset` (creează-l din prestabilit), `create_custom` (abia acum compui de mână).
- **`plan_location_roles`** (`brandId?`, `businessType?`) — **decalajul unei locații**: ce roluri are deja și **ce roluri prestabilite îi lipsesc** față de setul recomandat pentru activitatea ei. Tipul de activitate e dedus singur din brand (sau din domeniile organizației) — nu-l cere clientului decât dacă tool-ul spune că nu l-a putut deduce. Îți dă direct lista de nume pentru `apply_role_presets`, plus rolurile proprii ale clientului care nu vin din preset (acelea NU sunt greșeli).
- **`list_permission_catalog`** — vocabularul complet: toate categoriile + cheile + ce înseamnă fiecare, în română. Opțional `category` ca să vezi doar un grup (ex. `category: "payments"`). **Începe mereu de aici** ca să știi ce chei poți pune. Explică și `all` / `all:<categorie>`.
- **`describe_role`** — tot despre un rol EXISTENT: permisiuni, angajați, **paginile web**, diagnosticul celor patru taburi din bara operațională (Livrări, POS, Comenzi QR, Rezervări) și prezentarea recomandată în **Symbai Staff** (profil, primul tab, ordinea zonelor).
- **`preview_role_access`** — dai un set IPOTETIC de chei și, opțional, `roleName`; vezi paginile, taburile din bara operațională și experiența Staff **înainte** de creare/modificare. Semnalează cheile necunoscute.
- **`list_role_presets`** — rolurile predefinite cu drepturile și prezentarea Staff recomandată. Punct de plecare bun.
- **`suggest_role_setup`** — din atribuții și, opțional, numele rolului, propune permisiuni, preset, pagini și experiența Staff. Este o schiță transparentă, nu o decizie finală.

### B) Acționează (WRITE — cer modulul `personal` pe token)

- **`apply_role_presets`** (`roleNames[]`, `businessType?`, `brandId?`, `confirm`) — **modul corect de a adăuga roluri.** Creează roluri **din cele prestabilite**, cu permisiunile deja setate, exact pe cele cerute (nu tot setul). Idempotent și non-distructiv: un rol care există deja NU e duplicat, ci doar completat cu cheile lipsă din preset, iar drepturile adăugate special de client rămân; un rol arhivat cu același nume e reactivat. Fără `confirm:true` întoarce doar planul (ce s-ar crea, ce s-ar completa, ce nume nu există) — arată-l clientului, apoi confirmă.
- **`seed_default_roles`** (`brandId`, `businessType`) — creează dintr-o dată setul standard de roluri pentru tipul de business (restaurant, bar, cafenea, fast_food, hotel_restaurant, catering). Idempotent (sare peste cele existente). Cel mai rapid start pe un brand nou, când clientul vrea TOT setul; pentru „adaugă-mi doar Barman și Casier" folosește `apply_role_presets`.
- **`create_role`** (`name`, `brandId`, `permissions[]`) — creează un rol nou. Trimite `permissions` ca **listă de chei** (ex. `["pos_access","process_payment","all:kitchen"]`).
- **`update_role`** (`roleId`, `brandId`, `name?`, `permissions?`) — redenumește și/sau înlocuiește COMPLET setul de permisiuni. Cheile necunoscute sunt ignorate cu avertisment.
- **`set_role_permissions`** (`roleId`, `permissions?` / `addPermissions?` / `removePermissions?`) — cel mai fin instrument: înlocuiește tot setul, SAU adaugă/scoate doar câteva chei. Ideal pentru ajustări („mai adaugă-i dreptul de storno", „scoate-i accesul la rapoarte").

Ștergerea unui rol întreg **nu se face prin conexiune** — îndrumă userul în aplicație (`/staff` → Roluri & Permisiuni), și oricum un rol cu angajați nu se poate șterge până nu-i muți.

## Rețeta standard „pregătește un rol"

1. **Verifică întâi dacă e deja acoperit**: `find_role_for_job(job)`. Verdict `use_existing` → oprește-te aici, spune-i clientului ce rol are deja. Verdict `apply_preset` → sari direct la `apply_role_presets`. Doar verdictul `create_custom` te trimite mai departe prin pașii de mai jos.
2. **Context**: `list_brands` + `list_locations` (ai nevoie de `brandId`). Rolurile existente: `list_entities(entityType:"roles", brandId)`.
3. **Vezi vocabularul**: `list_permission_catalog` (sau filtrat pe categoria care te interesează).
4. **Pornește de la ceva**: dacă e o meserie clasică → `list_role_presets` sau `suggest_role_setup(description)`. Dacă e ceva specific → alege cheile din catalog.
5. **Previzualizează**: `preview_role_access(permissions, roleName)` → verifică paginile, cheile necunoscute și activitatea principală din Staff.
6. **Creează / modifică**: `create_role` (rol nou) sau `set_role_permissions` (ajustezi unul existent).
7. **Verifică prin citire**: `describe_role(roleId)` → confirmă permisiunile, paginile, angajații și recomandarea Staff.
8. **Configurează prezentarea**: `get_staff_app_config` → preia `configHash` → preview cu `configure_staff_app_role(applyRecommendedLayout:true, expectedConfigHash:configHash, confirm:false)` sau `configure_staff_app_roles(expectedConfigHash:configHash, confirm:false)` → arată propunerea și cere confirmarea explicită a utilizatorului → numai după acord retrimite exact aceeași propunere și același `expectedConfigHash`, cu `confirm:true` + `expectedPreviewHash:proposedConfigHash` → readback.

## Rețete rapide (exemple)

- **„Fă-mi un rol de barman"** → `find_role_for_job("barman")`. Dacă verdictul e `use_existing`: „Ai deja rolul **Barman** (id 7, 3 angajați) — îl folosim pe acela?" și te oprești. Dacă e `apply_preset`: `apply_role_presets(roleNames:["Barman"], confirm:true)` — permisiunile vin gata setate. **Nu** porni cu `create_role` + chei compuse de mână.
- **„Am deschis o locație nouă, ce roluri îmi trebuie?"** → `plan_location_roles(brandId)` → îi arăți lista: ce are deja, ce îi lipsește (cu ce face fiecare rol) → la acceptul lui, `apply_role_presets(roleNames:[…lista lipsă…], brandId, confirm:true)` → `plan_location_roles` din nou ca să confirmi că nu mai lipsește nimic.
- **„Adaugă și un casier și un ajutor de bucătar"** → `apply_role_presets(roleNames:["Casier","Ajutor Bucătar"], confirm:true)`. Selectiv, nu tot setul verticalei.
- **„Ospătar care nu poate da reduceri"** → `suggest_role_setup("ospătar care ia comenzi și încasează, fără reduceri")` → previzualizează → `create_role`. (Sugestia scoate automat dreptul de reducere când spui „fără reduceri".)
- **„Manager fără acces la salarii/finanțe"** → pornește de la presetul Manager (`list_role_presets`), apoi `preview_role_access` cu setul lui minus `all:finance` / `all:cashbook` → `create_role`.
- **„Rol de vizualizare (read-only) pentru un asociat"** → alege doar cheile de tip `*_view` din categoriile care-l interesează (le vezi în `list_permission_catalog`) → `preview_role_access` → creează. (Un rol read-only NU vede paginile de configurare, care cer drept de „management".)
- **„Inginer de proces la fabrică"** → `suggest_role_setup("inginer proces care vede randamentul utilajelor și eliberează calitatea")` → rafinează → creează.
- **„De ce nu vede rolul X pagina Y?"** → `describe_role(rol X)` și uită-te în lista de pagini vizibile; dacă Y lipsește, adaugă permisiunea potrivită cu `set_role_permissions(addPermissions:[...])`. Ca să afli CARE permisiune deschide pagina Y, caut-o în `list_permission_catalog` (categoria zonei respective).
- **„De ce lipsește Rezervări din bara Livrări / POS / QR / Rezervări?"** → `describe_role` și citește `access.operationsWorkspace`. Tabul Rezervări cere `reservations_view` sau `reservations_manage`; configurarea rezervărilor pe locație nu acordă singură accesul. Dacă diagnosticul spune că permisiunea există, verifică separat dacă pagina `/reservations` a fost ascunsă pentru client din Hub — acesta este un al doilea filtru, independent de rol.

## De reținut (onestitate + capcane)

- **Nu crea un rol înainte să verifici că nu există.** `find_role_for_job` întâi, mereu. Numele se compară fără diacritice și fără majuscule, deci „Ospatar" și „Ospătar" sunt același rol — nu vei putea crea al doilea, dar poți crea „Ospătar sală", care arată ca un rol nou și fragmentează echipa degeaba.
- **Rolurile proprii ale clientului nu sunt greșeli.** `plan_location_roles` le listează separat, ca „custom", exact ca să nu le confunzi cu lipsuri. Nu le modifica și nu propune să le înlocuiești cu preseturi fără să întrebi.
- **Cheile trebuie să fie reale.** Orice cheie greșită e ignorată tăcut (nu deblochează nimic). De-asta pornești mereu din `list_permission_catalog` și confirmi cu `preview_role_access` (care îți spune cheile necunoscute).
- **`all` e tot; `all:<categorie>` e tot grupul.** Preferă `all:<categorie>` pentru o funcție completă pe o zonă, în loc să enumeri zeci de chei.
- **Pagina de configurare cere drept de „management".** Un rol cu doar `_view` vede datele, dar nu paginile de setări ale zonei — corect și intenționat.
- **PIN-ul are nevoie de `pin_login`.** Câmpul de PIN pe fișa angajatului apare doar dacă rolul lui are `pin_login`. Dacă vrei ca angajatul să se logheze cu PIN pe POS, pune-i `pin_login` pe rol.
- **PIN de login ≠ PIN la fiecare operație.** Pe telefonul personal, Symbai Staff nu cere PIN per operație dacă rolul autorizează acțiunea. PIN-ul operațional rămâne la Workstation Tablet, dispozitiv partajat.
- **Pontajele (prezența) au chei dedicate:** `attendance_view` — vede tabul „Pontaje (prezență)" din `/staff` (pontajul self-service din aplicația Symbai Staff) și `attendance_manage` — administrează pontajele (corecții, politici). Fără ele, tabul nu apare în meniu.
- **„Locul la CRM" nu se dă din rol.** Accesul nominal la CRM (crm seat) se setează pe fișa angajatului, nu pe rol.
- **Verifică prin citire, nu prin UI.** După orice scriere, `describe_role` confirmă rezultatul real (aplicația poate afișa din cache o clipă).

## Ce primește un rol prin asistentul AI (conexiunea MCP nominală)

Când un angajat își conectează Claude Code / Codex cu contul lui POS, tool-urile pe care le vede sunt: **grantul proprietarului din Hub × rolul lui POS × aria lui**.

- **Modulele se derivă generos din permisiuni.** Orice permisiune care dă în aplicație o operație dintr-un domeniu deschide modulul MCP al acelui domeniu, la citire și, pentru permisiunile de administrare, la scriere. Exemple: `stock_receive` → «Stocuri & Recepție» + «Furnizori»; `haccp_record` → «Producție» (citiri HACCP) + «Setări» (înregistrări HACCP); `menu_daily_specials` → «Produse & Meniuri»; `loyalty_manage` → «Rezervări & Clienți» + «CRM»; `worksites_*` (construcții) → «Producție», «Financiar», «Stocuri», «Personal»; `hotel_*` → «Hotel PMS». Citirile sunt și mai largi decât scrierile: cine vede domeniul în aplicație îl vede și prin asistent.
- **Uneltele sensibile cer permisiunea exactă a paginii**, nu doar „o permisiune din modul": salarii/contracte → `staff_manage`; registrul de casă → `cashbook.*` (închiderea zilei și cu `daily_close_access`); jurnal, blocare perioadă, deschidere firmă → `accounting_config`; factura fiscală → `invoices_manage` sau casierul (`process_payment`); gestiuni/zone/TVA/stoc inițial → `master_data` / `inventory_manage`; branduri, locații, firmă, plăți, imprimante, dispozitive, automatizări → `settings_access`; planul de sală → `settings_access`; meniul fizic → `menu_layout`; prezentările → CRM; HACCP → `haccp_record`/`haccp_manage`.
- **Doar rolul complet (`all`)**: ștergeri de perioadă (`purge_period`, `delete_*_period`), deblocarea perioadei, GDPR (`forget_customer_gdpr`, `anonymize_guest`), forțări tehnice (`force_edge_*`), `seed_default_roles`, plus modulele care mișcă bani reali («Reclame», «Plăți Terminal»).
- **Aria**: contează doar unitățile ACTIVE. Un cont bifat pe toate brandurile/locațiile/gestiunile active are arie completă; unul alocat pe o parte din ele primește doar tool-urile cu verificare de arie. Remediu: Personal → fișa angajatului → «Permite toate» sau bifează unitățile lipsă; apoi sesiune nouă.
- **Cum verifici**: `verifica_conexiune` (câte tool-uri, module, arie, profil) și `describe_role` (ce permisiuni are rolul). Dacă lipsește un tool, întâi `cauta_tool`, apoi completezi rolul cu `set_role_permissions` — nu ocoli prin SQL.
