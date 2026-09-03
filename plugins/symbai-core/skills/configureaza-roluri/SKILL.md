---
name: configureaza-roluri
description: Roluri & permisiuni — ce vede și ce poate fiecare rol, rol nou din preseturi, catalogul de permisiuni, read-only, storno/reduceri, ce primește rolul prin asistent. La „ce vede rolul X", „ce poate casierul", „de ce nu vede angajatul pagina Y", „fă un rol de ospătar fără reduceri", „aplică rolurile standard".
---

# Configurează roluri & permisiuni — înțelege întâi, apoi acționează

Citește întâi `knowledge/agent-operare-avansata.md` (standardul de execuție sigură) și `knowledge/roluri-permisiuni.md` (concepte + rețete complete). Rolurile țin de modulul **Personal** — pentru fișe de angajat, ture, contracte, salarizare vezi skill-ul `gestioneaza-personal`; aici e strict despre **roluri, permisiuni și „cine ce vede"**.

**Ideea cheie:** în Symbai, ce vede și ce poate face un angajat depinde de **rolul** lui, iar accesul la pagini se **derivă** din permisiuni. Deci nu ghici — folosește tool-urile care îți arată direct ce înseamnă fiecare drept și ce pagini rezultă.

Pentru **ordinea și aspectul Symbai Staff**, permisiunile sunt doar limita de autoritate. După ce rolul este corect, folosește skill-ul `configureaza-aplicatie-staff` și tool-urile `get_staff_app_config` / `configure_staff_app_role` pentru profil, primul tab și ordinea zonelor. Nu adăuga permisiuni doar ca să muți o activitate mai sus în aplicație.

## Regula de aur

**Verifică ce există → înțelege → previzualizează → acționează → verifică prin citire.** Nu bifa chei orbește și nu confirma din UI. Cheile greșite sunt ignorate tăcut, deci pornește mereu din catalogul live și confirmă cu preview.

## ⚠ Înainte de orice: rolul cerut există deja?

La ORICE „fă-mi un rol de X" / „adaugă roluri la locația Y", **primul apel e `find_role_for_job(job)`**, nu `create_role`. Symbai are un catalog de roluri **prestabilite** pe tipuri de activitate, cu permisiunile deja setate corect — treaba ta e să le găsești și să le aplici, nu să compui drepturi de mână.

| Verdictul lui `find_role_for_job` | Ce faci |
|---|---|
| `use_existing` | Clientul are deja rolul (poate sub alt nume). I-l arăți și te OPREȘTI. Dacă îi lipsesc drepturi pentru atribuțiile noi, îl completezi cu `set_role_permissions` — nu faci un rol paralel. |
| `apply_preset` | `apply_role_presets(roleNames:["…"], confirm:true)`. Permisiunile vin gata din preset. |
| `create_custom` | Abia acum: `suggest_role_setup` → `preview_role_access` → `create_role`. |

**La locație nouă** nu întreba „ce roluri vrei?" și nu inventa lista: `plan_location_roles(brandId)` deduce singur activitatea locației și îți spune exact ce roluri îi lipsesc din setul recomandat. Prezinți lista clientului, iar la acceptul lui le aplici dintr-o mișcare cu `apply_role_presets`.

**De ce:** rolurile compuse manual pierd sistematic chei pe care presetul le are (tipic `pin_login` → omul nu se mai poate loga rapid pe terminal, și `tasks_view` → nu primește spațiu de lucru în Symbai Staff), iar aceeași meserie ajunge cu drepturi diferite de la o locație la alta.

## Tool-uri de ÎNȚELEGERE (READ — cer citire pe modulul `personal`)

- `find_role_for_job(job, businessType?, brandId?)` — **primul tool la orice cerere de rol.** Caută postul cerut întâi în rolurile REALE (după nume și după cât acoperă din atribuții), apoi în cele prestabilite, și întoarce verdictul din tabelul de mai sus.
- `plan_location_roles(brandId?, businessType?, businessTypes?)` — ce roluri are o locație și **ce roluri prestabilite îi lipsesc** față de setul activității ei (dedusă automat din brand). Întoarce și rolurile proprii ale clientului, marcate separat ca „custom" — acelea nu sunt lipsuri și nu se ating.
- `list_permission_catalog(category?)` — vocabularul complet de permisiuni pe categorii, în română. **Începe de aici.** Explică și `all` (administrator) și `all:<categorie>` (tot grupul).
- `describe_role(roleId | roleName)` — ce permisiuni are un rol REAL + câți angajați + **ce pagini vede** + profilul/primul tab recomandat în Symbai Staff.
- `preview_role_access(permissions[], roleName?)` — un set IPOTETIC de chei → pagini web și experiența Staff, ÎNAINTE de creare. Trimite `roleName` când îl știi.
- `list_role_presets()` — rolurile predefinite cu amprenta de permisiuni și prezentarea Staff recomandată.
- `suggest_role_setup(description, roleName?, businessType?)` — o SCHIȚĂ completă: permisiuni, preset, pagini și experiența Staff. Rafineaz-o cu `preview_role_access`.

## Tool-uri de ACȚIUNE (WRITE — cer modulul `personal` pe token)

- `apply_role_presets(roleNames[]*, businessType?, brandId?, confirm)` — **calea normală de a adăuga roluri.** Creează exact rolurile prestabilite cerute, cu permisiunile gata setate. Nu duplică: un rol existent e doar completat cu cheile lipsă (drepturile adăugate de client rămân), unul arhivat e reactivat. Fără `confirm:true` întoarce doar planul — arată-l clientului înainte.
- `seed_default_roles(brandId*, businessType*)` — creează TOT setul standard al unei verticale pe un brand. Idempotent. Pentru „doar Barman și Casier" folosește `apply_role_presets`.
- `create_role(name*, brandId*, permissions[])` — rol nou; `permissions` = **listă de chei** (ex. `["pos_access","process_payment","all:kitchen"]`). **Doar după ce `find_role_for_job` a spus `create_custom`.**
- `update_role(roleId*, brandId*, name?, permissions?)` — redenumește și/sau înlocuiește complet setul (cheile necunoscute sunt ignorate cu avertisment).
- `set_role_permissions(roleId*, permissions? | addPermissions? | removePermissions?)` — cel mai fin: înlocuiește tot SAU adaugă/scoate câteva chei.

Ștergerea unui rol întreg NU se face prin conexiune — îndrumă userul în aplicație (`/staff` → Roluri & Permisiuni).

## Fluxul standard

1. **Verifică dacă există deja:** `find_role_for_job(job)` — la cerere pe o locație nouă, `plan_location_roles(brandId)`. Verdict `use_existing` → te oprești aici. Verdict `apply_preset` → sari la pasul 6 cu `apply_role_presets`.
2. **Context:** `list_brands` + `list_locations` (ai nevoie de `brandId`); rolurile existente `list_entities(entityType:"roles", brandId)`.
3. **Vezi vocabularul:** `list_permission_catalog` (filtrat pe categorie dacă știi zona).
4. **Pornește de la ceva:** meserie clasică → `suggest_role_setup(description)` sau `list_role_presets`; ceva specific → alege cheile din catalog.
5. **Previzualizează:** `preview_role_access(permissions, roleName)` → verifică paginile, zero chei necunoscute și faptul că activitatea principală Staff este corectă; ajustează.
6. **Creează/modifică:** `apply_role_presets` (din prestabilite), `create_role` (chiar nou) sau `set_role_permissions` (ajustezi unul existent).
7. **Verifică prin citire:** `describe_role(roleId)` → confirmă permisiuni + pagini + angajați + recomandarea Staff.
8. **Configurează aplicația:** `get_staff_app_config` → preia `configHash` → preview cu `configure_staff_app_role(applyRecommendedLayout:true, expectedConfigHash:configHash, confirm:false)` sau `configure_staff_app_roles(expectedConfigHash:configHash, confirm:false)` → arată propunerea și cere confirmarea explicită a utilizatorului → numai după acord retrimite exact aceeași propunere și același `expectedConfigHash`, cu `confirm:true` + `expectedPreviewHash:proposedConfigHash` → readback.

## Exemple

- **„Fă-mi un rol de barman"** → `find_role_for_job("barman")`. `use_existing` → „Ai deja **Barman** (id 7, 3 angajați)" și te oprești. `apply_preset` → `apply_role_presets(roleNames:["Barman"], confirm:true)` → `describe_role` pentru confirmare.
- **„Am deschis o locație nouă / ce roluri îmi trebuie aici"** → `plan_location_roles(brandId)` → prezinți ce are și ce îi lipsește → la acceptul clientului `apply_role_presets(roleNames:[…], brandId, confirm:true)` → `plan_location_roles` din nou ca verificare.
- **„Adaugă-mi un casier și un ajutor de bucătar"** → `apply_role_presets(roleNames:["Casier","Ajutor Bucătar"], confirm:true)` — selectiv, nu tot setul verticalei.
- **„Fă un ospătar care nu poate da reduceri"** → `suggest_role_setup("ospătar care ia comenzi și încasează, fără reduceri")` → `preview_role_access` → `create_role(name:"Ospătar fără reduceri", brandId, permissions:[...])` → `describe_role` pentru confirmare.
- **„Vreau ca ospătarul să dea reduceri mici singur, dar peste un prag să ceară aprobare"** → asta NU e o permisiune de rol, ci **Politica de reduceri** din Meniu → Configurare Afișaj (`/menu/display`), setată **per platformă** (POS Ospătar, Bar, Mobil, Recepție, Dispecerat livrări): `get_discount_policy(brandId, profileType)` → `set_discount_policy(..., enabled:true, selfMaxPercent, selfMaxAmount, overLimitMode, confirm:true)`. Rolurile cu dreptul de reduceri aplică oricum direct — politica îi restrânge doar pe cei fără el. Detalii + capcane: `knowledge/comenzi-mese-ospatari.md`.
- **„Ce vede casierul?"** → `describe_role(roleName:"Casier")` → citește lista de pagini vizibile.
- **„De ce nu vede bucătarul pagina de alergeni?"** → `describe_role(roleName:"Bucătar")` (lipsește din pagini) → în `list_permission_catalog(category:"kitchen")` găsești cheia de alergeni → `set_role_permissions(roleId, addPermissions:["allergen_view"])` → reconfirmă cu `describe_role`.
- **„Read-only pentru un asociat"** → alege doar chei `*_view` din categoriile relevante (`list_permission_catalog`) → `preview_role_access` (paginile de configurare NU apar, corect) → `create_role`.
- **„Aplică rolurile standard pe brandul nou"** → `seed_default_roles(brandId, businessType)` → `list_entities(entityType:"roles")` să le vezi.

## Capcane (din `knowledge/roluri-permisiuni.md`)

- **Nu crea niciodată un rol fără să fi rulat `find_role_for_job`.** Numele se compară fără diacritice/majuscule, deci al doilea „Ospatar" nici nu se poate crea — dar „Ospătar sală" se poate, arată ca un rol nou și fragmentează echipa degeaba.
- **Rolurile „custom" ale clientului nu sunt lipsuri.** `plan_location_roles` le listează separat exact ca să nu le confunzi cu ce lipsește. Nu le atinge fără să întrebi.
- **Chei reale, mereu.** Cheia greșită nu deblochează nimic; confirmă cu `preview_role_access` (îți spune ce e necunoscut).
- **`all` = tot; `all:<categorie>` = tot grupul.** Preferă `all:<categorie>` pentru o funcție completă pe o zonă.
- **Pagina de configurare cere drept de „management"** — un rol doar-`_view` nu o vede (intenționat).
- **PIN-ul cere `pin_login`** pe rol ca să apară câmpul de PIN pe fișa angajatului.
- **Nu transforma PIN-ul de login în PIN operațional pe telefon.** În Symbai Staff personal, permisiunea rolului autorizează operația; PIN-ul per operație rămâne numai pe Workstation Tablet partajat.
- **Pontajele (prezența) au chei dedicate:** `attendance_view` (vede tabul „Pontaje (prezență)" din `/staff` și pontajele echipei) și `attendance_manage` (le administrează). Fără ele, tabul nu apare.
- **„Locul la CRM" nu se dă din rol** — se setează pe fișa angajatului.
- **Verifică prin citire, nu din UI.**
