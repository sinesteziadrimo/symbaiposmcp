---
name: gestioneaza-haccp
description: Ține siguranța alimentară (HACCP) la zi prin conexiune (MCP) — fără click pe taburi — și arată dovada pe ecran. Loghează citiri de temperatură la frigidere/congelatoare, raportează și rezolvă incidente, bifează sarcini de curățenie (checklist de igienă), pornești și monitorizezi răciri rapide (blast chilling) și, la o alertă, construiești raportul de retragere (recall) al unui lot. Folosește la „notează că frigiderul are 4 grade", „congelatorul e la -18", „arată-mi temperaturile de azi / raport HACCP", „câte citiri au fost peste prag", „raportează că s-a stricat frigiderul peste noapte", „am găsit marfă expirată", „ce incidente HACCP am, sunt nerezolvate", „am rezolvat incidentul X", „ce am de curățat azi / checklist curățenie", „am terminat de curățat hota", „pornește răcirea rapidă pentru ciorbă", „s-a încadrat ciorba în timp", „dacă retrag lotul X ce produse sunt afectate / raport de retragere / trasează unde a ajuns lotul contaminat", „scor de conformitate igienă".
---

# HACCP hands-free — siguranța alimentară prin conexiune (MCP), nu prin click

Userul (proprietar/bucătar-șef/manager) vrea să țină evidența HACCP fără să se chinuie prin taburile paginii. Tu faci munca prin **tool-urile MCP** (citești și scrii date reale pe instanța lui), navighezi la pagina HACCP prin **deep-link stabil** (`/haccp?tab=…`) și-i **arăți rezultatul pe ecran** (screenshot) — clickul rămâne ultima soluție. Cele 12 tool-uri acoperă tot ciclul: temperaturi, incidente, curățenie, răcire rapidă, recall și lista clienților expuși. **Cel mai important: spune-i clar ce-ai notat și arată-i jurnalul.**

## Înainte de orice
1. Citește (la nevoie) **`knowledge/agent-operare-avansata.md`** (confirmare, dovadă, incident/recall), **`knowledge/haccp.md`** (ce înseamnă fiecare jurnal, pragurile uzuale, ce e răcirea rapidă/recall, cum se leagă de producție/loturi) și **`knowledge/condu-chrome.md`** (doctrina generală: MCP întâi, deep-link, screenshot = livrabil, click pe element doar când chiar nu există API).
2. **Context**: aproape tot e pe o **locație**. La un singur local, tool-urile o deduc singure; la mai multe, ia `locationId` cu `list_locations` (sau întreabă userul „la care unitate?"). Comută unitatea activă din browser ÎNAINTE de a-i arăta ceva pe ecran (vezi `condu-chrome.md`, capcana unității).
3. **Navigare**: pagina e **`/haccp`** cu taburi adresabile prin `?tab=` (`temps` = temperaturi, `cleaning` = curățenie, `incidents` = incidente, `sensors` = senzori, `cooling` = răcire rapidă, `retention` = probe-martor, `audits` = checklist-uri audit). Du-te direct, ex. `navigate("/haccp?tab=incidents")` — NU intra pe pagină și apoi cauți tabul cu mouse-ul. Link live: `gaseste_in_aplicatie("haccp")`.

## Fluxul hibrid: ce tool pentru ce cere userul

Întâi tool-ul MCP (face treaba) → apoi, dacă userul vrea să VADĂ, deschizi tabul potrivit și-i faci screenshot. Tabel intenție → tool:

| Userul spune… | Tool MCP | Tabul de arătat |
|---|---|---|
| „notează că frigiderul de la bucătărie are 4°C", „congelatorul e la -18" | `log_temperature_reading` (`locationLabel` = numele echipamentului, `valueCelsius`; opțional `sensorId`, `min/maxThresholdCelsius`) | `/haccp?tab=temps` |
| „arată-mi temperaturile de azi", „câte citiri peste prag", „raport HACCP temperaturi" | `list_temperature_logs` (filtre `dateFrom/dateTo`; `aggregate:true` = doar rezumatul per echipament) | `/haccp?tab=temps` |
| „raportează că s-a stricat frigiderul peste noapte", „am găsit marfă expirată" | `create_haccp_incident` (`type`, `description`; opțional `severity` low/medium/high, `productLotId`) | `/haccp?tab=incidents` |
| „am rezolvat incidentul X, am aruncat marfa și am reparat" | `resolve_haccp_incident` (`incidentId`, `resolution`; opțional `correctiveAction`) | `/haccp?tab=incidents` |
| „ce incidente HACCP am", „sunt nerezolvate", „arată cele deschise" | `list_haccp_incidents` (`status` open/resolved/all) | `/haccp?tab=incidents` |
| „ce am de curățat azi", „checklist curățenie", „ce e restant" | `list_cleaning_tasks` (`status` due/overdue/all) | `/haccp?tab=cleaning` |
| „am terminat de curățat hota", „bifează spălatul podelei" | `complete_cleaning_task` (`taskId`; opțional `completedBy` = angajatul) | `/haccp?tab=cleaning` |
| „pornește răcirea rapidă pentru ciorbă", „început blast chiller" | `start_rapid_cooling_session` (`label`; opțional `start/targetTempCelsius`, `timeLimitMinutes`, `productLotId`) | `/haccp?tab=cooling` |
| „notează că ciorba e acum la 25°C" | `add_cooling_reading` (`sessionId`, `tempCelsius`) — închide automat sesiunea „conformă" când atinge ținta | `/haccp?tab=cooling` |
| „ce răciri am în curs", „s-a încadrat ciorba în timp" | `list_rapid_cooling_sessions` (`status` in_progress/completed/non_compliant/all) | `/haccp?tab=cooling` |
| „dacă retrag lotul X ce produse-s afectate", „trasează unde a ajuns lotul contaminat", „raport de retragere" | `build_recall_report` (`lotId`; `direction` forward=aval / full=și amonte) | `/haccp?tab=incidents` (+ producție/trasabilitate) |
| „la ce clienți a ajuns lotul X", „cui am vândut din lotul contaminat", „listă de notificat" | `trace_recall_to_customers` (`lotId`; opțional `includePresumptive`) — listează expuneri EXACTE și PREZUMTIVE | `/haccp?tab=incidents` (+ lista exportată din răspuns) |
| „incident grav/recurent", „deschide o CAPA / NCR", „acțiune corectivă formală pt audit" | `open_capa` (`title`, `severity`; leagă de incident cu `sourceType:"haccp"`, `sourceId`=incidentId) → `update_capa` (investigating/action/verification/closed) → `list_capa` | (modul `productie`; detalii în skill `productie-flux`) |

**Citirile** (`list_*`, `build_recall_report`, `trace_recall_to_customers`) merg mereu — sunt read-only pe tenant. **Scrierile** cer modulul `setari` pe token (vezi „Permisiune"). Două tool-uri vecine, tot sub `setari`, completează setup-ul: **`create_haccp_sensor`** (adaugă un senzor de temperatură configurat, cu prag min/max — apoi loghezi pe el prin `sensorId`) și **`create_cleaning_task`** (creează o sarcină nouă în checklist; tool-urile de aici doar o bifează).

## Rețete (cele care contează)

- **Loghează o temperatură.** „Frigiderul de la bucătărie are 4°C" → `log_temperature_reading(locationLabel:"Frigider bucătărie", valueCelsius:4)`. Dacă userul dă și pragurile (sau echipamentul e un senzor configurat → `sensorId`), tool-ul marchează singur `warning` când e în afara intervalului și ți-o spune în mesaj (✅ conform / ⚠ în afara pragului). Apoi, dacă vrea, arăți tabul `temps`. Pentru un raport: `list_temperature_logs(aggregate:true)` îți dă min/max/medie + abateri + % conformitate per echipament, fără lista lungă.
- **Incident + recall (lanț frig întrerupt).** „S-a stricat frigiderul peste noapte, era carne în el (lotul 312)." → (1) `create_haccp_incident(type:"Lanț frig", description:"...", severity:"high", productLotId:312)`; (2) `build_recall_report(lotId:312, direction:"full")` pentru loturile/produsele afectate; (3) `trace_recall_to_customers(lotId:312)` pentru lista de clienți de notificat. Explică diferența: **EXACT** = lot→document→client capturat după update; **PREZUMTIV** = același produs în fereastra de valabilitate, de verificat manual (istoric/edge offline). Când e rezolvat: `resolve_haccp_incident(incidentId:…, resolution:"am aruncat lotul, am reparat compresorul", correctiveAction:"verificare zilnică temperatură + senzor cu alarmă")`.
- **Răcire rapidă (HACCP cere sub o limită de timp).** „Pornește răcirea pentru ciorba de burtă" → `start_rapid_cooling_session(label:"Ciorbă de burtă")` (default de la 60°C la 10°C în max 120 min; suprascrie dacă userul dă alte valori). Pe parcurs, la fiecare măsurătoare: `add_cooling_reading(sessionId:…, tempCelsius:…)`. Când temperatura coboară la/sub țintă, sesiunea devine automat „completed/conformă" — userul vede în mesaj dacă s-a încadrat. Verifici lista cu `list_rapid_cooling_sessions(status:"in_progress")`.
- **Curățenie.** „Ce am de curățat azi?" → `list_cleaning_tasks(status:"due")` (sau `overdue` pentru restanțe). „Am curățat hota" → afli `taskId` din listă → `complete_cleaning_task(taskId:…)`. Sarcina lipsește din checklist? `create_cleaning_task` întâi.

## Reguli (cele care contează)
- **Tool MCP întâi, click rar.** Tot ce e DATE (citiri, incidente, sarcini, sesiuni, recall) are tool — folosește-l, nu reproduce prin click pe taburi. Chrome e doar pentru a NAVIGA (deep-link `?tab=`) și a ARĂTA. Vezi arborele de decizie din `condu-chrome.md`.
- **Confirmă-prin-mesaj/citire, nu „pare bine pe ecran".** Tool-ul întoarce `success` + un rezumat clar (ex. „⚠ Frigider bucătărie = 6°C — ÎN AFARA pragului") → ăla e adevărul. Nu raporta pe baza unui screenshot și nu repeta scrierea dacă tool-ul a zis deja `success`. Re-verifici cu `list_*`.
- **Screenshot-ul = dovada pentru user.** După ce notezi/rezolvi, deschide tabul potrivit (`/haccp?tab=…`) și fă-i screenshot — userul nu vede conexiunea ta. La temperaturi în afara pragului sau incidente deschise, atrage-i atenția explicit.
- **Severitate cu cap.** `high` = risc pentru sănătate (lanț frig pe carne/lactate, contaminare) → leagă-l de un recall; `medium` = pierdere de produs; `low` = rezolvare internă. La orice incident cu lot afectat, oferă `build_recall_report` ca să vadă impactul pe loturi și `trace_recall_to_customers` ca să vadă pe cine trebuie notificat. **După un incident grav sau recurent, escaladează la o CAPA** (`open_capa` → `update_capa` → închidere cu cauză-rădăcină + acțiune corectivă/preventivă + verificare): food safety-ul (BRC/IFS/ISO 22000) cere ca incidentul să NU rămână doar „rezolvat ad-hoc", ci să aibă acțiune corectivă formală + verificare. Tool-urile CAPA sunt sub modulul `productie` (detalii în skill `productie-flux`).
- **Nu inventa cifre.** Temperatura, ora, lotul, ce s-a făcut — le iei de la user. Ce nu știi, întrebi. Nu „bifa" curățenii sau nu „nota" citiri pe care userul nu le-a confirmat.
- **Ștergerea nu e prin conexiune.** Niciun delete de incident/sarcină/sesiune prin MCP — dacă userul vrea să șteargă, ghidează-l în aplicație (`/haccp`).
- **Permisiune**: scrierile (loghează temperatură, incident, bifează curățenie, răcire) cer modulul **Setări & Configurare** (`setari`) pe token; citirile + recall + lista clienților expuși merg mereu. „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul.

## Legături
- Doctrina Chrome (deep-link, screenshot = livrabil, click pe element doar la nevoie, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Concepte HACCP (jurnale, praguri, răcire rapidă, recall) → `knowledge/haccp.md`.
- Loturi & trasabilitate (de unde vine `lotId`, cum se leagă recall-ul de producție) → `knowledge/productie-fabrica.md` / `knowledge/productie-restaurant.md` (după modul clientului) + skill-ul `productie-flux`.
- Rețete/alergeni (siguranța alimentară pe produs) → skill-ul `adauga-produs-reteta`; recepția mărfii (loturi la intrare) → skill-ul `receptie-factura-furnizor`.
- E pasul 15 din onboarding („DSV Chef" — compliance HACCP) — vezi `onboarding/harta-pasi-wizard.md`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în app.
