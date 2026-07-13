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

### A) Înțelege (READ — mereu disponibile, nu cer niciun modul pe token)

- **`list_permission_catalog`** — vocabularul complet: toate categoriile + cheile + ce înseamnă fiecare, în română. Opțional `category` ca să vezi doar un grup (ex. `category: "payments"`). **Începe mereu de aici** ca să știi ce chei poți pune. Explică și `all` / `all:<categorie>`.
- **`describe_role`** — tot despre un rol EXISTENT: ce permisiuni are (extinse: ce categorii integrale vs chei individuale), câți angajați îl folosesc și — cel mai util — **ce pagini vede**. Răspunde la „ce vede casierul", „ce poate rolul Bucătar", „de ce nu vede rolul X pagina Y". Dă `roleId` sau `roleName`.
- **`preview_role_access`** — dai un set IPOTETIC de chei și vezi **ce pagini ar rezulta** + ce categorii ar fi acordate, **înainte** de a crea/modifica. Semnalează cheile necunoscute (care ar fi ignorate). Perfect pentru a proiecta un rol pas cu pas.
- **`list_role_presets`** — rolurile predefinite (șabloane) cu descriere + câte permisiuni au + ce categorii acoperă. Punct de plecare bun.
- **`suggest_role_setup`** — pornind de la o **descriere în cuvinte** („cineva care doar ia comenzi și încasează, dar nu poate da reduceri"), îți propune un set de permisiuni, presetul apropiat și o previzualizare a paginilor. E o **schiță** deterministă, nu o decizie finală — o rafinezi cu `preview_role_access`.

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
4. **Previzualizează**: `preview_role_access(permissions)` → verifică ce pagini ies și că nu ai chei necunoscute. Ajustează până arată exact ce vrei.
5. **Creează / modifică**: `create_role` (rol nou) sau `set_role_permissions` (ajustezi unul existent).
6. **Verifică prin citire**: `describe_role(roleId)` → confirmă permisiunile + numărul de pagini + câți angajați. NU te baza pe UI.

## Rețete rapide (exemple)

- **„Ospătar care nu poate da reduceri"** → `suggest_role_setup("ospătar care ia comenzi și încasează, fără reduceri")` → previzualizează → `create_role`. (Sugestia scoate automat dreptul de reducere când spui „fără reduceri".)
- **„Manager fără acces la salarii/finanțe"** → pornește de la presetul Manager (`list_role_presets`), apoi `preview_role_access` cu setul lui minus `all:finance` / `all:cashbook` → `create_role`.
- **„Rol de vizualizare (read-only) pentru un asociat"** → alege doar cheile de tip `*_view` din categoriile care-l interesează (le vezi în `list_permission_catalog`) → `preview_role_access` → creează. (Un rol read-only NU vede paginile de configurare, care cer drept de „management".)
- **„Inginer de proces la fabrică"** → `suggest_role_setup("inginer proces care vede randamentul utilajelor și eliberează calitatea")` → rafinează → creează.
- **„De ce nu vede rolul X pagina Y?"** → `describe_role(rol X)` și uită-te în lista de pagini vizibile; dacă Y lipsește, adaugă permisiunea potrivită cu `set_role_permissions(addPermissions:[...])`. Ca să afli CARE permisiune deschide pagina Y, caut-o în `list_permission_catalog` (categoria zonei respective).

## De reținut (onestitate + capcane)

- **Cheile trebuie să fie reale.** Orice cheie greșită e ignorată tăcut (nu deblochează nimic). De-asta pornești mereu din `list_permission_catalog` și confirmi cu `preview_role_access` (care îți spune cheile necunoscute).
- **`all` e tot; `all:<categorie>` e tot grupul.** Preferă `all:<categorie>` pentru o funcție completă pe o zonă, în loc să enumeri zeci de chei.
- **Pagina de configurare cere drept de „management".** Un rol cu doar `_view` vede datele, dar nu paginile de setări ale zonei — corect și intenționat.
- **PIN-ul are nevoie de `pin_login`.** Câmpul de PIN pe fișa angajatului apare doar dacă rolul lui are `pin_login`. Dacă vrei ca angajatul să se logheze cu PIN pe POS, pune-i `pin_login` pe rol.
- **Pontajele (prezența) au chei dedicate:** `attendance_view` — vede tabul „Pontaje (prezență)" din `/staff` (pontajul self-service din aplicația Symbai Staff) și `attendance_manage` — administrează pontajele (corecții, politici). Fără ele, tabul nu apare în meniu.
- **„Locul la CRM" nu se dă din rol.** Accesul nominal la CRM (crm seat) se setează pe fișa angajatului, nu pe rol.
- **Verifică prin citire, nu prin UI.** După orice scriere, `describe_role` confirmă rezultatul real (aplicația poate afișa din cache o clipă).
