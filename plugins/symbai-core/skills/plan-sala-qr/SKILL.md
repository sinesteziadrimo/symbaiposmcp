---
name: plan-sala-qr
description: Aranjează planul de sală și gestionează codurile QR fără să tragi nimic cu mouse-ul — prin conexiune (MCP) + navigare cu link direct + screenshot. Muți/redimensionezi/rotești mese, le aranjezi în grilă, creezi raioane (grupuri de mese per ospătar), rutezi o zonă la imprimanta/ecranul de bucătărie potrivit, faci programări de sală pe zile/sărbători, generezi QR pe mese și creezi/retargetezi/dezactivezi QR-uri dinamice. Folosește la „rearanjează terasa", „aranjează mesele frumos", „mută masa 5", „pune mesele în grilă", „adaugă un raion", „împarte mesele pe ospătari", „de ce nu iese bonul de la masa X la bucătărie/bar", „rutează zona terasă la imprimanta de bar", „generează QR pentru mese", „am adăugat mese noi, fă-le QR", „fă-mi un QR pentru promoție", „schimbă unde duce QR-ul fără să-l retipăresc", „dezactivează QR-ul vechi", „cere telefonul clientului la scanare", „activează plata directă pe QR", „layout de sală pentru Revelion / eveniment".
---

# Plan de sală + coduri QR — hands-free, prin MCP + navigare + screenshot

Planul de sală (`/plan-sala`) e cel mai click-greu ecran din Symbai: zeci de mese trase cu mouse-ul, grupate în raioane, fiecare zonă rutată la imprimante. Tu NU tragi nimic cu mouse-ul — faci munca prin **tool-uri MCP** (muți/aranjezi/rutezi/programezi din apeluri), NAVIGHEZI cu link direct și ARĂȚI rezultatul cu screenshot. Click pe pixeli = ultima soluție, nu prima.

## Înainte de orice
1. Citește **`knowledge/condu-chrome.md`** (doctrina „click-rarely": tool MCP → deep-link → click pe element; screenshot = livrabilul; refresh resetează starea; confirmă-prin-citire) și, pentru context conceptual + onboarding-ul de sală, **`knowledge/onboarding/06-sala-qr.md`** (ierarhia Zonă→Masă→Configurație→Program→Raion, capcanele de ordine, jargonul de evitat) + **`knowledge/plan-sala-qr.md`** (geometrie pe canvas, dubla scriere, sistemele de QR, cum arăți userului).
2. **Context**: `list_brands` + `list_locations` → `brandId`/`locationId`. Apoi `list_floor_zones` (ce zone există) și ia `configId`-ul configurației de sală — din pagina Plan de sală sau din `list_entities {entityType:"floor_configs"}`. `configId` = cheia pentru aproape tot ce ține de geometrie/raioane.
3. **Citește ÎNAINTE să scrii**: `get_floor_config(configId, section:"tables")` îți dă `dbId`-urile meselor (cheia pentru mutări/raioane), `section:"sections"` raioanele (cu id-urile `sec_…`), `section:"zones"` zonele de pe canvas. `get_floor_config` fără section = meta + numărători. NU citi configul cu SQL (e trunchiat).

## Fluxul hibrid — ce intenție → ce tool → cum arăți

Tabel intenție → tool MCP (toate scrierile cer modulul **Setări & Configurare** = `setari`; QR dinamice tot pe `setari`):

| Userul cere… | Tool MCP | Note |
|---|---|---|
| „mută/redimensionează/rotește masa X" | `set_floor_table_geometry` | `tableId`(=dbId) + oricare din `x,y,width,height,rotation,zoneId,sectionId`. Scrie în AMBELE locuri (rândul mesei + canvas) automat. |
| „aranjează mai multe mese deodată" (poziții calculate de tine) | `bulk_set_floor_table_geometry` | listă `updates[{tableId, x?, y?, …}]`, până la 500. |
| „pune mesele în grilă / rearanjează terasa frumos" | `arrange_tables_grid` | `floorConfigId` (toate mesele canvas-ului) sau `tableIds[]`; `cols`/`spacing`/`originX`/`originY`. Punct de pornire curat, apoi ajustezi fin. |
| „fă raioanele / împarte mesele pe ospătari" | `set_config_sections` apoi `move_tables_to_section` | `set_config_sections` ÎNLOCUIEȘTE lista de raioane → vezi Regula raioanelor. `move_tables_to_section`: `floorConfigId` + `sectionId`(string) + `tableDbIds[]` (sau `sectionId:null` ca să scoți). În onboarding-ul vechi poți întâlni `assign_tables_to_section`; răspunsul lui `assignedCount` numără mese DISTINCTE, nu desktop+mobile dublat. |
| „mută o masă în alt raion" | `set_floor_table_geometry` cu `sectionId` | sau `move_tables_to_section` pentru mai multe. |
| „de ce nu iese bonul la bucătărie/bar / rutează zona la imprimantă/KDS" | `list_zone_routing` → `set_zone_routing` | `zoneId` + `fiscalPrinterId`/`billPrinterId`/`shiftClosePrinterId`/`kitchenPrinterId`/`barPrinterId`/`kitchenScreenId`/`barScreenId`. Ia id-urile cu `list_printers`/`list_kds_screens`. Trimite doar ce schimbi. |
| „layout de sală pe zile / pentru Revelion / eveniment" | `list_floor_config_schedules` → `set_floor_config_date_override` (excepție pe dată) / `delete_floor_config_schedule` / `delete_floor_config_date_override` | Programul recurent pe zile se CREEAZĂ cu `create_floor_config_schedule` (vezi `06-sala-qr.md`). Aici gestionezi excepțiile + ștergi sub-entități. `dayOfWeek`: 0=Duminică. |
| „generează QR pentru mese / am adăugat mese noi, fă-le QR" | `generate_table_qr_codes` | Idempotent — sare peste mesele cu QR. Opțional `locationId`. Rulează după ce mesele există. Pentru print frumos pe șablon, du userul la `/qr-codes` și/sau citește `knowledge/materiale-grafice.md`. |
| „fă-mi un QR pentru promoție / meniu online / rezervări" | `create_dynamic_qr_code` | `title` + `redirectUrl` (link extern `https://…` sau rută internă `/…`). Întoarce cod scurt → link public `{instanță}/q/<cod>`. |
| „schimbă unde duce QR-ul (fără retipărire) / dezactivează-l" | `set_dynamic_qr_fields` | `id` + `redirectUrl` (retarget) sau `active:false` (dezactivare — `/q/<cod>` dă 404, reversibil). Ia id-ul cu `list_dynamic_qr_codes`. |
| „cere telefonul/email la scanare / activează plata directă pe QR / treci prin ospătar" | `list_qr_field_presets` → `set_qr_field_preset_fields` | `phoneVisible`/`phoneRequired`/`emailVisible`…, `directPayment`, `waiterConfirmation`, `clientFieldsPrompt` (`on_scan`/`before_order`/`never`). |

**Citirile (mereu disponibile, fără modul):** `get_floor_config`, `list_zone_routing`, `list_floor_config_schedules`, `list_dynamic_qr_codes`, `list_qr_field_presets`.

## Cum NAVIGHEZI (deep-link stabil — NU click prin meniu)
- **Designerul de sală** (unde se DESENEAZĂ): `navigate("/plan-sala")`. Aici tu nu lucrezi cu mouse-ul — doar deschizi pagina ca să ARĂȚI rezultatul mutărilor tale prin MCP (canvas-ul reflectă schimbarea, fiindcă tool-urile scriu în `configData.zonesMap`). ⚠ Selecția configurației/brandului e în dropdown-urile din capul paginii (nu în URL) și se poate reseta la refresh — re-verifică.
- **Viewer-ul LIVE** (read-only, operațiuni): `navigate("/floorplan")` — pentru a-i arăta userului starea live a meselor, NU pentru editare.
- **Coduri QR**: `navigate("/qr-codes")` (tab QR Mese) și `navigate("/qr-codes?tab=dynamic")` (QR-uri dinamice — link scurt, contor scanări, export PNG/SVG/PDF). De aici userul printează/exportă.
- **Reguli QR per raion** (preset câmpuri pe rutarea comenzii): `navigate("/staff?tab=floor-schedule")` (Program Salon). **Contexte QR** (Terasă/Piscină/Cameră): `navigate("/settings/qr-contexts")`.
- Nu inventa URL-uri — dacă nu ești sigur, `gaseste_in_aplicatie("plan de sală designer")` / `gaseste_in_aplicatie("coduri QR mese")` îți dau pagina + linkul direct.

## Cum ARĂȚI userului (screenshot = livrabilul)
Userul nu vede conexiunea ta. După o rearanjare/rutare, deschide pagina relevantă (`/plan-sala` pentru layout, `/qr-codes` pentru QR-uri) și fă-i **screenshot** „uite cum arată acum" — ai nevoie de extensia Chrome (`claude-in-chrome`) + user logat. Fără extensie poți tot face munca prin MCP, dar nu i-o poți arăta — spune-i clar și dă-i linkul direct ca să dea refresh (`condu-chrome.md`, regula h).

## Cazurile rare care cer un CLICK
Aproape tot e prin MCP. Click pe element (nu pe pixeli, după `read_page`/`find`) doar pentru:
- **Salvarea finală în Designer** dacă userul a tras ceva manual între timp (mutările tale prin MCP se salvează singure — scriu și în rândul mesei, și în canvas).
- **Printarea/exportul QR-urilor** din `/qr-codes` (butonul de print/PDF) — generarea e prin MCP, dar tipărirea fizică o face userul. În dialogul „Printează pe șablon", câmpurile `{{customText1}}`...`{{customText4}}` apar automat dacă șablonul le folosește.
- **Crearea de la zero a unei configurații noi / ștergerea de zone/mese/configurații întregi** — NU există prin MCP (regula platformei). Ghidează userul în aplicație (sau folosește tool-urile de onboarding `create_floor_config`/`add_zones_to_config` din `06-sala-qr.md` pentru structura nouă).

## Reguli (cele care contează)
- **Citește dbId-urile întâi.** Orice mutare/raion cere `dbId`-ul mesei (`get_floor_config section:"tables"`) și `sectionId`-ul raionului (string `sec_…`, din `section:"sections"`) — nu numărul mesei, nu numele raionului.
- **`set_config_sections` ÎNLOCUIEȘTE lista de raioane.** Ca să PĂSTREZI raioanele existente și doar să adaugi, citește întâi `get_floor_config(section:"sections")`, retrimite lista completă + cele noi (păstrând id-urile existente, altfel rupi asignările de mese). Apoi asignează cu `move_tables_to_section`.
- **Numără mesele unice, nu item-ele de canvas.** Planul salvează aceeași masă în view-ul desktop și în view-ul mobile. După `move_tables_to_section` sau `assign_tables_to_section`, `assignedCount` înseamnă `dbId`-uri distincte; dacă ai trimis 10 mese și tool-ul spune 10, acesta e numărul real. Verifică prin `get_floor_config(section:"tables")` că fiecare masă are `sectionId` corect.
- **Rutarea = de ce iese bonul corect.** „Bonul nu iese la bar" se rezolvă cel mai des prin `set_zone_routing` (zona greșit/ne-rutată). Verifică întâi `list_zone_routing`. `set_zone_routing` face merge — trimite doar câmpurile pe care le schimbi.
- **Raioanele nu rutează singure** — comanda QR ajunge la ospătarul corect abia când tura lui e legată de raion (modulul `personal`, vezi `gestioneaza-personal`). Spune-i userului asta.
- **Două sisteme de QR, separate**: QR de masă (`generate_table_qr_codes`, idempotent, `/t/<cod>`) ≠ QR dinamic (`create_/set_dynamic_qr`, link editabil `/q/<cod>`). Nu le amesteca. Nu există ștergere de QR prin MCP — dezactivezi un QR dinamic cu `set_dynamic_qr_fields(active:false)`.
- **Șabloane QR și text custom**: șablonul se editează în Materiale grafice; `qr-slot` marchează locul codului, `{{tableNumber}}` variază per masă, iar `{{customText1}}`...`{{customText4}}` sunt completate manual per PDF (ex. Parter/Etaj).
- **Confirmă-prin-citire**, nu „pare bine pe ecran": după scriere, re-citește cu `get_floor_config`/`list_*`. Tool-ul a întors `success` = e salvat; spune-i userului să dea refresh, nu repeta scrierea (`condu-chrome.md`, regula f).
- **Permisiune**: scrierile cer modulul `setari` (Setări & Configurare). „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul.
- **Limbaj de restaurant**, nu jargon: „mut masa", „aranjez terasa", „grupez mesele pe ospătari", „rutez zona la barul corect", „QR care duce la promoție" — nu `configData.zonesMap`/`sectionId`/`redirectUrl`.

## Legături
- Doctrina generală Chrome (deep-link, screenshot = livrabil, click pe element, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Geometria pe canvas + dubla scriere + cele două sisteme de QR (detaliu tehnic-pe-înțeles) → `knowledge/plan-sala-qr.md`.
- Structura inițială a sălii (zone/mese/configurații/program prin MCP, capcanele de ordine) → `knowledge/onboarding/06-sala-qr.md` + skill-ul `onboarding-symbai`.
- Legarea turei ospătarului de raion (ca să ruteze comenzile QR) → skill-ul `gestioneaza-personal` (Program Salon, modalul de tură).
- Imprimante & ecrane KDS (id-urile pentru `set_zone_routing`) → `knowledge/echipamente-kds-imprimante.md`.
- Navigare pură / link direct la o pagină → skill-ul `gaseste-pagina` (`gaseste_in_aplicatie`).
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în aplicație.
