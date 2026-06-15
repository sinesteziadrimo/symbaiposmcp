---
name: meniu-fizic
description: Creează, înțelege și îmbunătățește meniul fizic tipăribil al restaurantului prin conexiune (MCP) + vision, ca un grafician senior. Întâi alegeți împreună meniul; dacă sunt schimbări la produse, le finalizați în /menu/pricing (titlu, descriere, gramaj, preț, categorie, ordine, alergeni); apoi alegeți o temă (i-o arăți userului), iar pe urmă rearanjezi pagină-cu-pagină: muți și reordonezi produse, schimbi mărimea pozelor, fonturi, fundal, adaugi elemente, evidențiezi produse, umpli paginile/coloanele goale, respecți tipul de meniu și numărul de pagini (A3 pliat = multiplu de 4). Folosește la „fă-mi meniul fizic / printabil", „aranjează meniul tipărit", „meniul arată urât, îmbunătățește-l", „pune pozele mai mari / schimbă tema meniului fizic", „designul meniului".
---

# Meniul fizic — Claude ca grafician senior, prin MCP + vision

Userul vrea un meniu fizic (tipăribil) care arată profesionist. Tu îl construiești și-l rafinezi prin conexiune (citești+rescrii config-ul) și te uiți REAL la pagini (vision), iterând până arată bine. **Cel mai important: explică-i clar ce faci, alegeți împreună deciziile mari, arată-i rezultatul.**

## Înainte de orice
1. Citește **`knowledge/meniu-fizic-design.md`** (grammar-ul + **cele 14 tool-uri MCP**: citire pe secțiuni cu `get_physical_menu_config`/`get_physical_menu_item`, scriere cu field-setterele `set_physical_menu_*_fields` + structurale `swap`/`move`/`set_…_photo`/`reorder`/`…_page_element`; poze/fonturi/fundal/freeform/mutări, teme engine-side, umplere goluri, multiplu de 4, bucla de vision), **`knowledge/condu-chrome.md`** (cum conduci Chrome: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie) și **`knowledge/meniu-fizic-pricing.md`** (finalizarea produselor + cele 2 goluri).
2. **CERCETARE — găsește EXACT meniul + designul** (rețeta completă în `meniu-fizic-design.md` → „Găsește meniul fizic potrivit"). Modelul e pe 3 niveluri: **brand → meniuri → designuri**. Pe scurt: (a) `list_brands`/`list_locations` → `brandId` din numele dat de client („Berărescu"); (b) `list_menus(brandId)` → meniurile brandului (un brand are deseori mai multe; cel „de print" se vede după nume — „print"/„tipar"/„fizic"; dacă-s mai multe, **întreabă clientul pe care**); (c) **`list_physical_menu_designs({brandId, menuId})`** → designurile meniului (Design 1/Design 2..., cu `configId`, format, nr. categorii/produse/pagini); **`configId` = id-ul de editat**; dacă-s mai multe designuri, **arată-i-le și întreabă în care**. Design/meniu NOU = în pagină (butonul „Designuri") — NU prin MCP.
3. **Navigare**: deep-link `navigate("/menu/physical")` (sau `/menu` → tab „Meniu Fizic" — același designer); link live `gaseste_in_aplicatie("meniu fizic")`. ⚠ Brandul + meniul + designul se aleg din **dropdown-urile din capul paginii** (nu din URL — fără deep-link aici; refresh-ul poate reseta selecția → re-verifică ordinea brand→meniu→design, vezi `condu-chrome.md`). **Vision**: ai nevoie de extensia Chrome (`claude-in-chrome`) + user logat, ca să vezi paginile. Dacă nu e conectată, oferă-i s-o conecteze; altfel poți tot edita prin tool-uri, dar „pe orb" — nu-i poți ARĂTA rezultatul (spune-i asta clar). Preferă vision.

## Fluxul (4 faze)

**Faza A — Alegeți meniul + finalizați produsele.** Întreabă userul ce meniu vrea tipărit (dacă are mai multe). Dacă vrea schimbări la produse (nume, descrieri, gramaje, prețuri, categorii, ordine, alergeni) → fă-le ÎNTÂI în `/menu/pricing` prin MCP (`meniu-fizic-pricing.md`). Asta înainte de design, altfel rearanjarea se strică. (Rename/reorder categorii + nutriție = UI, ghidează-l.)

**Faza B — Alegeți tema.** Arată-i userului 2-3 teme potrivite (din cele 13; `bistro-navy` = cea mai echilibrată, ca „Design 2"). ⚠ Tema se APLICĂ în aplicație (gramatica eroi/decor/repaginare e engine-side) — userul apasă tema, sau tu prin Chrome apeși „Aplică tema"; pentru fiecare candidată fă screenshot și întreabă-l care-i place. După ce alegeți, citești config-ul rezultat.

**Faza C — Rearanjează pagină-cu-pagină (grafician senior).** Pentru fiecare pagină: screenshot → judeci (coloane/pagini goale? poze prea mici/mari? echilibru? ordine? un erou pe pagină? text înghesuit?) → editezi prin **tool-urile dedicate** (mărime poză = `set_physical_menu_item_photo`; span/featured/fonturi/culori/spacing pe produs = `set_physical_menu_item_fields`; pe pagină/global = `set_physical_menu_page_fields`/`_config_fields`; mutare/reordonare = `move_physical_menu_item`/`swap_physical_menu_items`/`reorder_physical_menu_categories`; elemente freeform = `add_/remove_physical_menu_page_element`) → refresh → screenshot → repetă. Toate setterele iau `fields{}` (pune) + `clear[]` (resetează la moștenire). Respectă formatul (A3 broșură → multiplu de 4 auto). Confirmă deciziile estetice mari. **Rețete exacte** (ce intenție / ce tool, la ce nivel) → în `meniu-fizic-design.md`: „Cele 14 tool-uri MCP" (catalog + tabel intenție→tool + rețeta ascunde/arată categorie), „Poziție, ordine & coloane", „Editează ORICE pe un produs" (cascada item→pagină→global) și „Cheatsheet: ce-ți cere userul → ce faci".

**Faza D — Finalizare.** Arată-i userului meniul final (screenshot-uri), spune-i ce-ai aranjat, și cum îl printează (export PDF din pagină / `gaseste_in_aplicatie("export meniu fizic")`).

## Reguli (cele care contează)
- **Tool-uri dedicate, NU SQL + REPLACE**: citește pe secțiuni cu `get_physical_menu_config`/`get_physical_menu_item`; scrie cu field-setterele (`set_physical_menu_*_fields`, `fields{}`+`clear[]`) și primitivele structurale — ele fac MERGE server-side (ating doar ce ceri). NU citi configul cu SQL (trunchiat la ~2000 caractere). `update_menu_display_config` (REPLACE) = doar ultima soluție pentru un câmp structural neacoperit (atunci citește întreg cu `get_physical_menu_config(section:'raw')` întâi).
- **Uită-te REAL** (vision Chrome) înainte și după fiecare schimbare — nu edita pe orb. Vederea ta = judecata de grafician. **Screenshot-ul = livrabilul pentru user** (arată-i rezultatul). Confirmă corectitudinea re-citind cu `get_*`, nu cu pixelul.
- **Tema = în app**, fine-tuning = prin tool-uri. Nu reproduce gramatica temei scriind config.
- **`productId` = `menu_items.id`**, **`categoryId` = `menu_categories.id`** (nu products.id). Mărimea pozei = `set_physical_menu_item_photo` (curăță singur override-urile px). Freeform = px logice (mm×2.8).
- **Claritate pentru user**: limbaj de restaurant („fac poza mai mare", „mut produsul sus", „umplu pagina goală"), nu jargon (`photoColFrac`/`freeformElements`/`config`). Alegeți împreună tema + deciziile mari; arată screenshot-uri.
- **Permisiune**: config-ul cere modulul `setari`; finalizarea produselor cere `produse_meniu` (+`furnizori` la nevoie). „Permisiune insuficientă" → portal Hub → Acces AI.
- **Nu inventa** poze/prețuri/descrieri. Ce lipsește → întrebi sau ghidezi userul.

## Legături
- Cele 14 tool-uri + tabel intenție→tool + rețeta ascunde/arată categorie, reordonare/mutare produse, control coloane, edit per-produs, cascadă pe 3 niveluri (global/pagină/produs), cheatsheet de cereri → `meniu-fizic-design.md` (secțiunile „Cele 14 tool-uri MCP" + „Poziție, ordine & coloane" + „Editează ORICE pe un produs" + „Cheatsheet: ce-ți cere userul → ce faci").
- Cum conduci Chrome (deep-link, screenshot = livrabil, click doar la nevoie, fallback fără extensie) → `condu-chrome.md`.
- Finalizare produse înainte de design → `meniu-fizic-pricing.md`; produse/rețete în general → skill-ul `adauga-produs-reteta`.
- Import meniu de pe Excel/site/PDF → skill-urile `importa-date` / `adauga-produs-reteta` (meniu din PDF: pagina `/menu/import-pdf`).
- E pasul 28 din onboarding („Meniu fizic") — vezi `onboarding/harta-pasi-wizard.md`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în app.
