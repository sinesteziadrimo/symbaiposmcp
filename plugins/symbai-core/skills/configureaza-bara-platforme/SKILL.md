---
name: configureaza-bara-platforme
description: Configurează Bara de platforme (comutatorul de sus Livrări / POS / Comenzi Client / Rezervări / Recepție hotel) pe web/tabletă și în aplicația POS mobil, inclusiv ce vede fiecare rol — prin MCP, exact ca dialogul din Meniu → Platforme. La „pune rezervările în bara de sus", „ascunde bara ospătarilor pe telefon", „recepția să vadă livrările și rezervările pe telefon", „scoate Livrări din bară", „tab-ul POS să deschidă POS Bar", „ce vede ospătarul în bara de pe telefon", „de ce nu apare bara pe telefon".
---

# Bara de platforme — web/tabletă și POS mobil, pe fiecare rol

**Bara de platforme** este comutatorul din capul ecranelor operaționale: omul trece dintr-o atingere între Livrări, POS, Comenzi Client (QR), Rezervări și, la hotel, Recepție hotel / Housekeeping. Se configurează pe **unitate** (brand + locație) din Meniu → Platforme → cardul „Bara de platforme”. Are **două suprafețe**, independente:

| Suprafață | Ce conține | Implicit |
|---|---|---|
| **Web / tabletă** | `deliveries` (Livrări), `pos` (POS), `qr` (Comenzi Client), `reservations` (Rezervări), `hotel` (Recepție hotel), `housekeeping` — maxim 5, în ordinea aleasă; `posTarget` = unde duce tab-ul POS (`auto`, `/pos/waiter`, `/pos/bar`, `/pos/reception`) | pornită, fără Housekeeping |
| **POS mobil** (aplicația de telefon) | `pos` (Mese — planul sălii), `sale` (Vânzare directă, fără masă), `reservations`, `deliveries`, `qr` (Comenzi) — măcar una dintre Mese și Vânzare | **oprită**: ospătarul nu are nevoie de ea |

Pe telefon fiecare **rol** poate avea regula lui: `inherit` (urmează unitatea), `hidden` (fără bară), `unit` (bara cu platformele unității, chiar dacă bara e oprită pentru restul), `custom` (doar platformele alese). Tipic: Ospătarul fără bară, Recepția cu Mese + Vânzare + Rezervări + Livrări + Comenzi.

## Ce NU face bara
- **Nu dă drepturi.** Bara doar alege și ordonează platformele. Un rol vede o platformă numai dacă are dreptul paginii ei: Livrări cer un drept de livrări (`delivery_view` / `delivery_manage` / `delivery_accept_reject` / `delivery_status_update`), Comenzi cer `client_orders_view` / `client_orders_manage` / `call_waiter_respond` / `bill_request_respond`. Pe telefon, sub **două** platforme rămase bara nu apare deloc. Drepturile se schimbă în Personal → Roluri (skill `configureaza-roluri`), nu aici.
- Nu e cardul „În Aplicație Staff” (Symbai Staff — livratori, agenți: skill `configureaza-aplicatie-staff`) și nici portalul clienților (`configureaza-portal`).
- Recepție hotel și Housekeeping există doar la unitățile cu activitate de hotel.

## Fluxul
1. **Citește întâi**: `get_operations_bar_config({ brandId, locationId })`. Primești bara web și cea de telefon, regulile pe rol, de unde vine configurația (`source`: a unității / moștenită de la locație sau firmă / implicită) și, pentru **fiecare rol activ**, ce vede EFECTIV: `roles[].web.shownTabs` și `roles[].mobile.shownTabs` (după drepturi), plus `hiddenByPermissions` când o platformă aleasă îi lipsește rolului din cauza drepturilor. Cu mai multe unități, întreabă pe care o configurezi (sau ia-o pe cea numită de om).
2. **Previzualizează** schimbarea: `configure_operations_bar({ ..., dryRun: true })`. Răspunsul are `changes`, `before`, `after` și ce vede fiecare rol după schimbare. Spune-i omului pe scurt, în cuvintele lui („Recepția va vedea pe telefon: Mese · Vânzare · Rezervări · Livrări · Comenzi; ospătarii nu vor vedea bara”).
3. **Salvează** același apel fără `dryRun`. Se schimbă doar ce trimiți. O unitate care folosea o configurație moștenită primește acum una proprie, pornită din aceea (mesajul o spune).
4. Pe telefon se aplică la următoarea deschidere a aplicației sau în câteva minute.

## Cum traduci cererea omului
| Omul cere… | Apel |
|---|---|
| „Pune Rezervările în bara de sus pe tabletă” | `web: { tabs: [ordinea actuală + "reservations"] }` (citește ordinea întâi; maxim 5) |
| „Scoate Livrările din bară” | `web: { tabs: [restul, fără "deliveries"] }` |
| „Nu vreau deloc bara pe web” | `web: { enabled: false }` (nu o listă goală) |
| „Tab-ul POS să deschidă POS Bar” | `web: { posTarget: "/pos/bar" }` |
| „Pornește bara pe telefon pentru toată lumea” | `mobile: { enabled: true }` |
| „Recepția să vadă pe telefon tot; ospătarii nimic” | `mobile: { tabs: ["pos","sale","reservations","deliveries","qr"] }`, `roles: [{ roleId: <Recepție>, mode: "unit" }, { roleId: <Ospătar>, mode: "hidden" }]` |
| „Managerul să aibă doar Mese și Rezervări pe telefon” | `roles: [{ roleId: <Manager>, mode: "custom", tabs: ["pos","reservations"] }]` |
| „Recepția vinde la tejghea, fără sală” | `roles: [{ roleId: <Recepție>, mode: "custom", tabs: ["sale","reservations","deliveries","qr"] }]` |
| „Rolul X să urmeze ce are restul” | `roles: [{ roleId: X, mode: "inherit" }]` |

`roleId` îl iei din `get_operations_bar_config` (`roles[].roleId`, `roles[].name`); nu ghici id-uri.

## „De ce nu apare bara pe telefon la X?”
Verifică, în ordinea asta, din `get_operations_bar_config`:
1. `roles[X].mobile.rule` — `hidden`? sau `inherit` cu `mobile.enabled: false`? → bara e oprită pentru el.
2. `roles[X].mobile.configuredTabs` vs `shownTabs` — `hiddenByPermissions` arată ce i-au tăiat drepturile; dacă rămâne sub două platforme, bara nu apare (`note`).
3. Aplicația e pe versiunea care are bara (POS mobil 1.0.9 sau mai nouă); vechea versiune nu o arată.
4. Pe web: `web.enabled`, apoi `roles[X].web.shownTabs` (paginile pe care rolul are voie să le deschidă).

## Drepturi
Salvarea cere dreptul paginii Meniu → Platforme: `menu_manage_items` sau `delivery_menu_sync`, pe unitatea din aria contului. Citirea o are și cine are `settings_access`. Un refuz de drept nu se ocolește: spune-i omului cine poate face schimbarea.
