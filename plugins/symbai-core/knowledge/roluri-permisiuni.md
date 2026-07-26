# Roluri & Permisiuni — cine ce vede și ce poate face

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`. Pentru **vocabularul complet și mereu la zi al permisiunilor** folosește tool-ul live `list_permission_catalog` — el e sursa autoritară (nu lista din acest document, care e doar orientativă).

## Pe scurt

În Symbai, ce vede și ce poate face un angajat **nu se setează pe angajat**, ci pe **rolul** lui. Un rol e un set de **permisiuni** (drepturi). Fiecare permisiune deblochează pagini și acțiuni. Dacă un rol nu are permisiunea unei pagini, pagina **dispare din meniu** și, dacă angajatul încearcă să ajungă la ea, e trimis la „Sarcinile Mele". Deci: **schimbi ce vede cineva schimbând permisiunile rolului lui.**

Regula de aur: **pregătește rolul cu tool-urile de înțelegere (vezi ce înseamnă fiecare drept și ce pagini dă), previzualizează, apoi creează/modifici — și verifici prin citire, nu prin UI.**

## Concepte

- **Rol** — un nume (ex. „Ospătar", „Casier", „Bucătar Șef") cu o listă de permisiuni. Un angajat are un singur rol. Rolurile pot fi predefinite (gata făcute) sau custom.
- **Permisiune** — un drept individual, cu o cheie scurtă (ex. `pos_access`, `process_payment`, `production_view`) și o etichetă în română. Permisiunile sunt grupate pe **categorii** (Salon & Mese, Plăți & Casierie, Bucătărie & Producție, Personal & Ture, Finanțe, Inventar, Rezervări, Marketing, Analiză, Hotel, Ecommerce ș.a.).
- **Cheie „all"** — super-administrator. Un rol cu `all` vede și poate TOT. Se pune singur (nu mai adaugi altele lângă). Tipic doar pentru Administrator/Proprietar.
- **Cheie „all:<categorie>"** — acordă **toată** o categorie dintr-o dată. Ex. `all:payments` = tot din Plăți & Casierie; `all:kitchen` = tot din Bucătărie & Producție. Foarte util ca să nu bifezi 15 chei una câte una.
- **Ce vede ≠ ce am bifat** — accesul la pagini se **derivă** din permisiuni. De-asta există tool-uri care îți arată direct **ce pagini** rezultă dintr-un set de chei, ca să nu ghicești.

## Tool-urile — grupate pe „înțelege" și „acționează"

### A) Înțelege (READ — cer citire pe modulul `personal` în grant)

- **`list_permission_catalog`** — vocabularul complet: toate categoriile + cheile + ce înseamnă fiecare, în română. Opțional `category` ca să vezi doar un grup (ex. `category: "payments"`). **Începe mereu de aici** ca să știi ce chei poți pune. Explică și `all` / `all:<categorie>`.
- **`describe_role`** — tot despre un rol EXISTENT: permisiuni, angajați, **paginile web**, diagnosticul celor patru taburi din bara operațională (Livrări, POS, Comenzi QR, Rezervări) și prezentarea recomandată în **Symbai Staff** (profil, primul tab, ordinea zonelor).
- **`preview_role_access`** — dai un set IPOTETIC de chei și, opțional, `roleName`; vezi paginile, taburile din bara operațională și experiența Staff **înainte** de creare/modificare. Semnalează cheile necunoscute.
- **`list_role_presets`** — rolurile predefinite cu drepturile și prezentarea Staff recomandată. Punct de plecare bun.
- **`suggest_role_setup`** — din atribuții și, opțional, numele rolului, propune permisiuni, preset, pagini și experiența Staff. Este o schiță transparentă, nu o decizie finală.

### B) Acționează (WRITE — cer modulul `personal` pe token)

- **`seed_default_roles`** (`brandId`, `businessType`) — creează dintr-o dată setul standard de roluri pentru tipul de business (restaurant, bar, cafenea, fast_food, hotel_restaurant, catering). Idempotent (sare peste cele existente). Cel mai rapid start pe un brand nou.
- **`create_role`** (`name`, `brandId`, `permissions[]`) — creează un rol nou. Trimite `permissions` ca **listă de chei** (ex. `["pos_access","process_payment","all:kitchen"]`).
- **`update_role`** (`roleId`, `brandId`, `name?`, `permissions?`) — redenumește și/sau înlocuiește COMPLET setul de permisiuni. Cheile necunoscute sunt ignorate cu avertisment.
- **`set_role_permissions`** (`roleId`, `permissions?` / `addPermissions?` / `removePermissions?`) — cel mai fin instrument: înlocuiește tot setul, SAU adaugă/scoate doar câteva chei. Ideal pentru ajustări („mai adaugă-i dreptul de storno", „scoate-i accesul la rapoarte").

Ștergerea unui rol întreg **nu se face prin conexiune** — îndrumă userul în aplicație (`/staff` → Roluri & Permisiuni), și oricum un rol cu angajați nu se poate șterge până nu-i muți.

## Rețeta standard „pregătește un rol"

1. **Context**: `list_brands` + `list_locations` (ai nevoie de `brandId`). Rolurile existente: `list_entities(entityType:"roles", brandId)`.
2. **Vezi vocabularul**: `list_permission_catalog` (sau filtrat pe categoria care te interesează).
3. **Pornește de la ceva**: dacă e o meserie clasică → `list_role_presets` sau `suggest_role_setup(description)`. Dacă e ceva specific → alege cheile din catalog.
4. **Previzualizează**: `preview_role_access(permissions, roleName)` → verifică paginile, cheile necunoscute și activitatea principală din Staff.
5. **Creează / modifică**: `create_role` (rol nou) sau `set_role_permissions` (ajustezi unul existent).
6. **Verifică prin citire**: `describe_role(roleId)` → confirmă permisiunile, paginile, angajații și recomandarea Staff.
7. **Configurează prezentarea**: `get_staff_app_config` → preia `configHash` → preview cu `configure_staff_app_role(applyRecommendedLayout:true, expectedConfigHash:configHash, confirm:false)` sau `configure_staff_app_roles(expectedConfigHash:configHash, confirm:false)` → arată propunerea și cere confirmarea explicită a utilizatorului → numai după acord retrimite exact aceeași propunere și același `expectedConfigHash`, cu `confirm:true` + `expectedPreviewHash:proposedConfigHash` → readback.

## Rețete rapide (exemple)

- **„Ospătar care nu poate da reduceri"** → `suggest_role_setup("ospătar care ia comenzi și încasează, fără reduceri")` → previzualizează → `create_role`. (Sugestia scoate automat dreptul de reducere când spui „fără reduceri".)
- **„Manager fără acces la salarii/finanțe"** → pornește de la presetul Manager (`list_role_presets`), apoi `preview_role_access` cu setul lui minus `all:finance` / `all:cashbook` → `create_role`.
- **„Rol de vizualizare (read-only) pentru un asociat"** → alege doar cheile de tip `*_view` din categoriile care-l interesează (le vezi în `list_permission_catalog`) → `preview_role_access` → creează. (Un rol read-only NU vede paginile de configurare, care cer drept de „management".)
- **„Inginer de proces la fabrică"** → `suggest_role_setup("inginer proces care vede randamentul utilajelor și eliberează calitatea")` → rafinează → creează.
- **„De ce nu vede rolul X pagina Y?"** → `describe_role(rol X)` și uită-te în lista de pagini vizibile; dacă Y lipsește, adaugă permisiunea potrivită cu `set_role_permissions(addPermissions:[...])`. Ca să afli CARE permisiune deschide pagina Y, caut-o în `list_permission_catalog` (categoria zonei respective).
- **„De ce lipsește Rezervări din bara Livrări / POS / QR / Rezervări?"** → `describe_role` și citește `access.operationsWorkspace`. Tabul Rezervări cere `reservations_view` sau `reservations_manage`; configurarea rezervărilor pe locație nu acordă singură accesul. Dacă diagnosticul spune că permisiunea există, verifică separat dacă pagina `/reservations` a fost ascunsă pentru client din Hub — acesta este un al doilea filtru, independent de rol.

## De reținut (onestitate + capcane)

- **Cheile trebuie să fie reale.** Orice cheie greșită e ignorată tăcut (nu deblochează nimic). De-asta pornești mereu din `list_permission_catalog` și confirmi cu `preview_role_access` (care îți spune cheile necunoscute).
- **`all` e tot; `all:<categorie>` e tot grupul.** Preferă `all:<categorie>` pentru o funcție completă pe o zonă, în loc să enumeri zeci de chei.
- **Pagina de configurare cere drept de „management".** Un rol cu doar `_view` vede datele, dar nu paginile de setări ale zonei — corect și intenționat.
- **PIN-ul are nevoie de `pin_login`.** Câmpul de PIN pe fișa angajatului apare doar dacă rolul lui are `pin_login`. Dacă vrei ca angajatul să se logheze cu PIN pe POS, pune-i `pin_login` pe rol.
- **PIN de login ≠ PIN la fiecare operație.** Pe telefonul personal, Symbai Staff nu cere PIN per operație dacă rolul autorizează acțiunea. PIN-ul operațional rămâne la Workstation Tablet, dispozitiv partajat.
- **Pontajele (prezența) au chei dedicate:** `attendance_view` — vede tabul „Pontaje (prezență)" din `/staff` (pontajul self-service din aplicația Symbai Staff) și `attendance_manage` — administrează pontajele (corecții, politici). Fără ele, tabul nu apare în meniu.
- **„Locul la CRM" nu se dă din rol.** Accesul nominal la CRM (crm seat) se setează pe fișa angajatului, nu pe rol.
- **Verifică prin citire, nu prin UI.** După orice scriere, `describe_role` confirmă rezultatul real (aplicația poate afișa din cache o clipă).
