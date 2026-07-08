---
name: configureaza-roluri
description: Creează, editează și PREGĂTEȘTE roluri și permisiuni în Symbai — și înțelege exact ce vede și ce poate face fiecare rol. Folosește la „ce vede rolul X", „ce poate casierul/bucătarul", „de ce nu vede angajatul pagina Y", „fă un rol de ospătar care nu poate da reduceri", „pregătește-mi un rol pentru inginerul de producție", „ce permisiuni există", „arată-mi catalogul de permisiuni", „dă-i rolului dreptul de storno", „scoate-i accesul la rapoarte", „read-only pentru un asociat", „setează permisiuni", „modifică rol", „ce pagini vede rolul", „aplică rolurile standard pe brandul nou".
---

# Configurează roluri & permisiuni — înțelege întâi, apoi acționează

Citește întâi `knowledge/agent-operare-avansata.md` (standardul de execuție sigură) și `knowledge/roluri-permisiuni.md` (concepte + rețete complete). Rolurile țin de modulul **Personal** — pentru fișe de angajat, ture, contracte, salarizare vezi skill-ul `gestioneaza-personal`; aici e strict despre **roluri, permisiuni și „cine ce vede"**.

**Ideea cheie:** în Symbai, ce vede și ce poate face un angajat depinde de **rolul** lui, iar accesul la pagini se **derivă** din permisiuni. Deci nu ghici — folosește tool-urile care îți arată direct ce înseamnă fiecare drept și ce pagini rezultă.

## Regula de aur

**Înțelege → previzualizează → acționează → verifică prin citire.** Nu bifa chei orbește și nu confirma din UI. Cheile greșite sunt ignorate tăcut, deci pornește mereu din catalogul live și confirmă cu preview.

## Tool-uri de ÎNȚELEGERE (READ — mereu disponibile, nu cer niciun modul)

- `list_permission_catalog(category?)` — vocabularul complet de permisiuni pe categorii, în română. **Începe de aici.** Explică și `all` (administrator) și `all:<categorie>` (tot grupul).
- `describe_role(roleId | roleName)` — ce permisiuni are un rol REAL + câți angajați + **ce pagini vede**. Pentru „ce vede X" / „de ce nu vede X pagina Y".
- `preview_role_access(permissions[])` — un set IPOTETIC de chei → ce pagini ar vedea + ce categorii ar avea, ÎNAINTE de creare. Semnalează cheile necunoscute.
- `list_role_presets()` — rolurile predefinite (șabloane) cu amprenta lor.
- `suggest_role_setup(description, businessType?)` — dintr-o descriere în cuvinte, o SCHIȚĂ de rol (permisiuni + preset apropiat + previzualizare). Rafineaz-o cu `preview_role_access`.

## Tool-uri de ACȚIUNE (WRITE — cer modulul `personal` pe token)

- `seed_default_roles(brandId*, businessType*)` — creează setul standard de roluri pe un brand (restaurant|bar|cafenea|fast_food|hotel_restaurant|catering). Idempotent.
- `create_role(name*, brandId*, permissions[])` — rol nou; `permissions` = **listă de chei** (ex. `["pos_access","process_payment","all:kitchen"]`).
- `update_role(roleId*, brandId*, name?, permissions?)` — redenumește și/sau înlocuiește complet setul (cheile necunoscute sunt ignorate cu avertisment).
- `set_role_permissions(roleId*, permissions? | addPermissions? | removePermissions?)` — cel mai fin: înlocuiește tot SAU adaugă/scoate câteva chei.

Ștergerea unui rol întreg NU se face prin conexiune — îndrumă userul în aplicație (`/staff` → Roluri & Permisiuni).

## Fluxul standard

1. **Context:** `list_brands` + `list_locations` (ai nevoie de `brandId`); rolurile existente `list_entities(entityType:"roles", brandId)`.
2. **Vezi vocabularul:** `list_permission_catalog` (filtrat pe categorie dacă știi zona).
3. **Pornește de la ceva:** meserie clasică → `suggest_role_setup(description)` sau `list_role_presets`; ceva specific → alege cheile din catalog.
4. **Previzualizează:** `preview_role_access(permissions)` → verifică paginile + zero chei necunoscute; ajustează.
5. **Creează/modifică:** `create_role` (nou) sau `set_role_permissions` (ajustezi unul existent).
6. **Verifică prin citire:** `describe_role(roleId)` → confirmă permisiuni + pagini + angajați.

## Exemple

- **„Fă un ospătar care nu poate da reduceri"** → `suggest_role_setup("ospătar care ia comenzi și încasează, fără reduceri")` → `preview_role_access` → `create_role(name:"Ospătar fără reduceri", brandId, permissions:[...])` → `describe_role` pentru confirmare.
- **„Ce vede casierul?"** → `describe_role(roleName:"Casier")` → citește lista de pagini vizibile.
- **„De ce nu vede bucătarul pagina de alergeni?"** → `describe_role(roleName:"Bucătar")` (lipsește din pagini) → în `list_permission_catalog(category:"kitchen")` găsești cheia de alergeni → `set_role_permissions(roleId, addPermissions:["allergen_view"])` → reconfirmă cu `describe_role`.
- **„Read-only pentru un asociat"** → alege doar chei `*_view` din categoriile relevante (`list_permission_catalog`) → `preview_role_access` (paginile de configurare NU apar, corect) → `create_role`.
- **„Aplică rolurile standard pe brandul nou"** → `seed_default_roles(brandId, businessType)` → `list_entities(entityType:"roles")` să le vezi.

## Capcane (din `knowledge/roluri-permisiuni.md`)

- **Chei reale, mereu.** Cheia greșită nu deblochează nimic; confirmă cu `preview_role_access` (îți spune ce e necunoscut).
- **`all` = tot; `all:<categorie>` = tot grupul.** Preferă `all:<categorie>` pentru o funcție completă pe o zonă.
- **Pagina de configurare cere drept de „management"** — un rol doar-`_view` nu o vede (intenționat).
- **PIN-ul cere `pin_login`** pe rol ca să apară câmpul de PIN pe fișa angajatului.
- **„Locul la CRM" nu se dă din rol** — se setează pe fișa angajatului.
- **Verifică prin citire, nu din UI.**
