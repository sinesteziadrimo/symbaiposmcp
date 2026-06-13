---
name: meniu-fizic
description: Creează, înțelege și îmbunătățește meniul fizic tipăribil al restaurantului prin conexiune (MCP) + vision, ca un grafician senior. Întâi alegeți împreună meniul; dacă sunt schimbări la produse, le finalizați în /menu/pricing (titlu, descriere, gramaj, preț, categorie, ordine, alergeni); apoi alegeți o temă (i-o arăți userului), iar pe urmă rearanjezi pagină-cu-pagină: muți și reordonezi produse, schimbi mărimea pozelor, fonturi, fundal, adaugi elemente, evidențiezi produse, umpli paginile/coloanele goale, respecți tipul de meniu și numărul de pagini (A3 pliat = multiplu de 4). Folosește la „fă-mi meniul fizic / printabil", „aranjează meniul tipărit", „meniul arată urât, îmbunătățește-l", „pune pozele mai mari / schimbă tema meniului fizic", „designul meniului".
---

# Meniul fizic — Claude ca grafician senior, prin MCP + vision

Userul vrea un meniu fizic (tipăribil) care arată profesionist. Tu îl construiești și-l rafinezi prin conexiune (citești+rescrii config-ul) și te uiți REAL la pagini (vision), iterând până arată bine. **Cel mai important: explică-i clar ce faci, alegeți împreună deciziile mari, arată-i rezultatul.**

## Înainte de orice
1. Citește **`knowledge/meniu-fizic-design.md`** (grammar-ul config-ului: ce poți schimba și cum — citire SQL, scriere `update_menu_display_config` REPLACE, poze/fonturi/fundal/freeform/mutări, teme engine-side, umplere goluri, multiplu de 4, bucla de vision) și **`knowledge/meniu-fizic-pricing.md`** (finalizarea produselor + cele 2 goluri).
2. `list_brands` + `list_locations` + `list_menus(brandId)` — ce meniuri există. Vezi config-urile fizice: `execute_sql_query("SELECT id, name, profile_type, is_default FROM menu_display_configs WHERE profile_type LIKE 'physical-menu-%'")`.
3. **Vision**: ai nevoie de extensia Chrome (`claude-in-chrome`) + user logat, ca să vezi paginile pe `/menu/physical`. Dacă nu e conectată, oferă-i s-o conecteze; altfel poți tot edita config-ul, dar „pe orb" — preferă vision.

## Fluxul (4 faze)

**Faza A — Alegeți meniul + finalizați produsele.** Întreabă userul ce meniu vrea tipărit (dacă are mai multe). Dacă vrea schimbări la produse (nume, descrieri, gramaje, prețuri, categorii, ordine, alergeni) → fă-le ÎNTÂI în `/menu/pricing` prin MCP (`meniu-fizic-pricing.md`). Asta înainte de design, altfel rearanjarea se strică. (Rename/reorder categorii + nutriție = UI, ghidează-l.)

**Faza B — Alegeți tema.** Arată-i userului 2-3 teme potrivite (din cele 13; `bistro-navy` = cea mai echilibrată, ca „Design 2"). ⚠ Tema se APLICĂ în aplicație (gramatica eroi/decor/repaginare e engine-side) — userul apasă tema, sau tu prin Chrome apeși „Aplică tema"; pentru fiecare candidată fă screenshot și întreabă-l care-i place. După ce alegeți, citești config-ul rezultat.

**Faza C — Rearanjează pagină-cu-pagină (grafician senior).** Pentru fiecare pagină: screenshot → judeci (coloane/pagini goale? poze prea mici/mari? echilibru? ordine? un erou pe pagină? text înghesuit?) → editezi config prin `update_menu_display_config` (mărime poze via `photoColFrac`/`spanColumns`, mutare produse via `pageAssignments`, fonturi, fundal, elemente freeform, evidențiere featured, spacing, umplere coloane goale) → refresh → screenshot → repetă. Respectă formatul (A3 broșură → multiplu de 4 auto). Confirmă deciziile estetice mari.

**Faza D — Finalizare.** Arată-i userului meniul final (screenshot-uri), spune-i ce-ai aranjat, și cum îl printează (export PDF din pagină / `gaseste_in_aplicatie("export meniu fizic")`).

## Reguli (cele care contează)
- **READ-MODIFY-WRITE ÎNTREG**: `update_menu_display_config` face REPLACE — citește config-ul complet (SQL), modifică, scrie-l TOT înapoi. Nu trimite config parțial (pierzi câmpuri).
- **Uită-te REAL** (vision Chrome) înainte și după fiecare schimbare — nu edita pe orb. Vederea ta = judecata de grafician.
- **Tema = în app**, fine-tuning = prin MCP. Nu reproduce gramatica temei scriind config.
- **`productId` în config = `menu_items.id`** (nu products.id). `photoWidthCustomPx` exclude `photoColFrac` (șterge-l). Freeform = px logice (mm×2.8).
- **Claritate pentru user**: limbaj de restaurant („fac poza mai mare", „mut produsul sus", „umplu pagina goală"), nu jargon (`photoColFrac`/`freeformElements`/`config`). Alegeți împreună tema + deciziile mari; arată screenshot-uri.
- **Permisiune**: config-ul cere modulul `setari`; finalizarea produselor cere `produse_meniu` (+`furnizori` la nevoie). „Permisiune insuficientă" → portal Hub → Acces AI.
- **Nu inventa** poze/prețuri/descrieri. Ce lipsește → întrebi sau ghidezi userul.

## Legături
- Finalizare produse înainte de design → `meniu-fizic-pricing.md`; produse/rețete în general → skill-ul `adauga-produs-reteta`.
- Import meniu de pe Excel/site/PDF → skill-urile `importa-date` / `adauga-produs-reteta` (meniu din PDF: pagina `/menu/import-pdf`).
- E pasul 28 din onboarding („Meniu fizic") — vezi `onboarding/harta-pasi-wizard.md`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în app.
