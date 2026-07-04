# Plan de sală + coduri QR — concepte, geometrie, cele două QR (pentru skill-ul `plan-sala-qr`)

> Aici e modelul mental + detaliul tehnic-pe-înțeles pe care skill-ul `plan-sala-qr` îl presupune. Ierarhia conceptuală a sălii (Zonă→Masă→Configurație→Program→Raion) + structura inițială prin MCP sunt în `onboarding/06-sala-qr.md` — nu le repet. Aici: cum funcționează geometria pe canvas, de ce „mutarea unei mese" atinge două locuri, cele două sisteme de QR și cum arăți userului ce-ai făcut.

## Cele două „locuri" în care trăiește o masă (de ce contează)

O masă există în DOUĂ locuri și ele trebuie să rămână în sincron:
1. **Fișa mesei** — numele, locurile, forma, zona, poziția „de bază".
2. **Desenul de pe hartă** (în configurația de sală) — poziția/mărimea/rotația cu care Designerul DESENEAZĂ masa pe canvas, plus raionul (`sectionId`) la care e asignată.

Designerul randează mesele EXCLUSIV din desenul de pe hartă, NU din fișa mesei. De aceea, dacă schimbi doar fișa, canvas-ul nu reflectă nimic. **Tool-urile MCP de geometrie (`set_floor_table_geometry`, `bulk_set_floor_table_geometry`, `arrange_tables_grid`) scriu în AMBELE locuri automat** — exact ca butonul „Salvează" din Designer. Tu nu te ocupi de asta; doar reține: după o mutare prin MCP, canvas-ul e deja corect (dă refresh la `/plan-sala` ca să-l arăți).

**Cheile cu care lucrezi:**
- `configId` — id-ul configurației de sală (un „layout"; pot exista mai multe: Standard, Vară-cu-terasă, Eveniment). Din pagina Plan de sală sau `list_entities {entityType:"floor_configs"}`.
- `dbId`-ul mesei — id-ul intern, stabil, al mesei. Îl iei cu `get_floor_config(configId, section:"tables")`. E cheia pentru orice mutare/asignare la raion. NU e numărul afișat al mesei.
- `sectionId`-ul raionului — un **string** generat (`sec_…`), din `get_floor_config(section:"sections")` sau din răspunsul lui `set_config_sections`. NU e numele raionului, nu e un număr.

## Citește pe secțiuni, nu tot deodată

`get_floor_config` are `section` ca să nu explodezi contextul (configurația completă poate avea sute de KB):
- fără `section` (sau `"global"`) → meta + numărători (nume, brand/locație, câte zone/mese/raioane).
- `"tables"` → lista SLIM a meselor de pe canvas (dbId, nume, zonă, raion, poziție) — **asta folosești cel mai des**, înainte de orice mutare/raion.
- `"sections"` → raioanele (id `sec_…`, nume, culoare).
- `"zones"` → zonele de pe canvas (desktop + mobile) cu numărul de mese.
- `"items"` → geometria BRUTĂ completă — mare, doar la nevoie (refuzat dacă e enorm → folosește `"tables"`).

NU citi configul cu SQL — răspunsul e trunchiat și pierzi date.

## Raioane (sections) — grupuri de mese per ospătar

Raioanele împart mesele logic, ca să se ruteze comenzile QR la ospătarul de tură. Două capcane:
- **`set_config_sections` ÎNLOCUIEȘTE complet lista de raioane.** Ca să păstrezi raioanele existente și doar să adaugi unul, citește întâi `get_floor_config(section:"sections")`, apoi retrimite lista COMPLETĂ + cel nou, **păstrând id-urile `sec_…` existente** (altfel mesele asignate rămân orfane). Dacă pornești de la zero, le poți lăsa pe toate fără id (se generează).
- **Raioanele nu rutează nimic singure.** Comanda QR ajunge la ospătarul corect abia când **tura ospătarului e legată de raion** (modulul `personal` — Program Salon / modalul de tură). Vezi skill-ul `gestioneaza-personal`. Menționează asta când termini de făcut raioanele.

Asignarea meselor la raion: `move_tables_to_section(floorConfigId, sectionId, tableDbIds[])` (sau `sectionId:null` ca să le scoți). O singură masă: `set_floor_table_geometry(tableId, sectionId)`. În fluxurile vechi de onboarding există și `assign_tables_to_section`; când întoarce `assignedCount`, numărul este de mese DISTINCTE (`dbId`), nu suma aparițiilor desktop+mobil de pe hartă. La final, confirmă cu `get_floor_config(section:"tables")` că mesele au `sectionId`-ul cerut.

## Rutarea de zonă la imprimante/ecrane — „de ce nu iese bonul"

Fiecare ZONĂ poate avea o rutare de hardware: ce imprimantă fiscală / de notă / de închidere tură / de bucătărie / de bar și ce ecran KDS de bucătărie/bar primesc comenzile meselor din zonă. Cea mai frecventă cauză pentru „bonul nu iese la bar/bucătărie" = zona ne-rutată sau rutată greșit.
- vezi configurația curentă: `list_zone_routing` (întoarce doar zonele rutate).
- setează/corectează: `set_zone_routing(zoneId, …)` — face MERGE, trimite doar câmpurile pe care le schimbi. Id-urile de printer/ecran le iei cu `list_printers` / `list_kds_screens` (vezi `echipamente-kds-imprimante.md`).

## Programări de sală pe zile + excepții pe dată

- programul recurent (ce configurație e activă în fiecare zi) se creează cu `create_floor_config_schedule` (`dayOfWeek`: **0=Duminică** … 6=Sâmbătă) — vezi `06-sala-qr.md`.
- excepții pentru zile speciale (Revelion → layout de eveniment): `set_floor_config_date_override(date YYYY-MM-DD, floorConfigId)` — upsert pe (dată+locație+brand).
- vezi calendarul curent: `list_floor_config_schedules`; șterge sub-entități cu `delete_floor_config_schedule` / `delete_floor_config_date_override` (NU se șterg configurații întregi prin MCP).

## Cele două sisteme de QR — SEPARATE, nu le amesteca

### 1. QR de masă (codul fix al fiecărei mese)
Un cod per masă → portalul de comandă al mesei (link `/t/<cod>`). Codul rămâne fix la reprintare.
- generare: `generate_table_qr_codes(locationId?)` — **idempotent**: sare peste mesele care au deja QR și re-atașează coduri orfane (mese redenumite). Rulează de câte ori vrei după ce adaugi mese. Rulează DUPĂ ce mesele există.
- ce completează clientul la scanare = **preseturi de câmpuri QR**: `list_qr_field_presets` → `set_qr_field_preset_fields(id, …)` (`nameVisible`/`phoneVisible`/`emailRequired`…, `directPayment` = plată din telefon fără ospătar, `waiterConfirmation` = trece prin ospătar, `clientFieldsPrompt` = `on_scan`/`before_order`/`never`).
- printare/export: din pagina `/qr-codes` (tab QR Mese) — buton de print/PDF, în aplicație. Pentru carduri frumoase, se alege un șablon din Materiale grafice care are `qr-slot`; printul în lot înlocuiește slotul cu fiecare QR selectat.
- texte pe șablon: `Masa {{tableNumber}}` se completează per QR. Pentru texte manuale pe runda de print (ex. `Parter`, `Etaj`, `Salon`, `Terasa`), folosește în șablon `{{customText1}}`...`{{customText4}}`; dialogul „Printează pe șablon" afișează câmpurile doar când tokenii există în șablon. Valorile custom se aplică tuturor cardurilor din PDF-ul curent.

### 2. QR dinamic (cod fix, destinație editabilă)
Cod scurt fix → redirect 302 la o destinație EDITABILĂ (link extern `https://…` sau rută internă `/…`). Link public `{instanță}/q/<cod>`. Tipărești o dată, schimbi destinația oricând fără retipărire — ideal pentru postere, flyere, vitrine.
- creare: `create_dynamic_qr_code(title, redirectUrl, …)`.
- retargetare / dezactivare / etichetare: `set_dynamic_qr_fields(id, redirectUrl? / active? / title? / tagId? …)`. `active:false` = dezactivare (`/q/<cod>` dă 404, reversibil) — **aceasta e calea de „ștergere"** (nu există delete prin MCP).
- destinație invalidă respinsă: `/q/…` (buclă), `javascript:`, `data:`, `//…`.
- listare: `list_dynamic_qr_codes` (cod, titlu, destinație, activ, scanări) — folosește înainte de orice modificare ca să afli id-ul.
- pagină: `/qr-codes?tab=dynamic` (contor scanări, export PNG/SVG/PDF). QR-urile dinamice pot fi și ele printate pe șabloane QR; folosește `{{title}}`, `{{code}}`, `{{url}}`, `{{brand}}`, `{{location}}` și, dacă e nevoie, `{{customText1}}`...`{{customText4}}` pentru text manual per PDF.

## Navigare (deep-link stabil) — unde duci/arăți userul
- **`/plan-sala`** — Designerul (DESENEZI). Tu nu tragi cu mouse-ul; deschizi ca să ARĂȚI rezultatul mutărilor prin MCP. ⚠ Selecția configurației/brandului e în dropdown-urile din capul paginii (nu în URL) și se poate reseta la refresh — re-verifică.
- **`/floorplan`** — viewer LIVE read-only (operațiuni), pentru a arăta starea live, nu pentru editare.
- **`/qr-codes`** (QR Mese) și **`/qr-codes?tab=dynamic`** (QR dinamice).
- **`/graphic-materials`** — creezi/editezi șabloanele QR. Slotul trebuie să fie `qr-slot` / `qrSlot:true`, iar textele pot include `{{tableNumber}}` și `{{customText1}}`...`{{customText4}}`.
- **`/staff?tab=floor-schedule`** — Program Salon (preset QR per raion, programări pe zile).
- **`/settings/qr-contexts`** — contexte QR (Terasă/Piscină/Cameră hotel/Eveniment).
- Nesigur de rută? `gaseste_in_aplicatie("plan de sală")` / `gaseste_in_aplicatie("coduri QR")`. Nu inventa URL-uri.

## Permisiuni
Toate scrierile (geometrie, raioane, rutare, programări, QR de masă, QR dinamic, preseturi) cer modulul **Setări & Configurare** (`setari`). Citirile (`get_floor_config`, `list_zone_routing`, `list_floor_config_schedules`, `list_dynamic_qr_codes`, `list_qr_field_presets`) merg mereu. „Permisiune insuficientă" → portal Hub → Acces AI → bifează „Setări & Configurare". Ștergerea de entități întregi (zone/mese/configurații/QR) NU e disponibilă prin MCP — din aplicație.
