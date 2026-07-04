---
name: materiale-grafice
description: Creează și editează materiale grafice profesionale pentru restaurant prin conexiune (MCP), ca un grafician senior — fără clickuri. Afișe, flyere, broșuri, table tents, postări și story-uri pentru Instagram/Facebook, covere de eveniment, vouchere și carduri QR de masă. Pornești dintr-un șablon gata făcut sau compui de la zero, pui textele și oferta, aplici culorile și logo-ul brandului, aranjezi elementele, redimensionezi pentru alt format. Folosește la „fă-mi un afiș/poster", „un flyer cu meniul zilei", „o postare/story pentru Instagram", „un voucher de reducere", „un cod QR de masă frumos de printat", „un material pentru eveniment", „pune-l pe culorile/logo-ul meu", „fă și varianta pentru Instagram", „schimbă textul/mută titlul de pe afiș".
---

# Materiale grafice — Claude ca grafician senior, prin MCP

Userul vrea un material grafic care arată profesionist (afiș, flyer, postare, QR de masă etc.). Tu îl construiești și-l rafinezi prin conexiune (citești + scrii designul cu tool-uri), nu prin clickuri. **Cel mai important: pornește din șabloane pentru calitate rapidă, personalizează pe brandul lui, și arată-i rezultatul.**

## Înainte de orice
1. Citește **`knowledge/materiale-grafice.md`** (tool-urile MCP de materiale grafice + modelul de element cu coordonate FRACȚIONALE + principiile de design + cheatsheet-ul de cereri) și **`knowledge/condu-chrome.md`** (cum arăți rezultatul: deep-link + screenshot = livrabil).
2. **Context**: `list_brands` (+ `list_locations` dacă userul a numit o locație) → `brandId`. Materialele sunt legate de brand.
3. **Vezi ce există**: `list_material_designs({brandId})` (materiale salvate) și `list_material_templates()` (șabloanele gata făcute, pe grupele Print / Social / QR — catalogul complet îl vezi la apel).

## Fluxul (4 pași)

**Pasul 1 — Înțelege cererea + alege punctul de start.** Ce vrea (tip + unde se folosește)? Aproape mereu **pornește dintr-un șablon** potrivit (`list_material_templates` → alege `templateId`) — sunt echilibrate și frumoase. Compui de la zero (`create_material_design` cu `elements`) doar când cere ceva specific ce niciun șablon nu acoperă. Dacă vrea să plece de la un material existent → `duplicate_material_design`.

**Pasul 2 — Creează + pune conținutul real.** `create_material_from_template({templateId, applyBrandColors:true, useBrandFont:true, tokens})` — completează automat numele brandului/locația; tu pui în `tokens` restul (ex. `{tableNumber, code}`) și ajustezi textele/oferta cu `update_material_elements` (ia id-urile din `get_material_design`). Pentru șabloane QR reutilizabile, lasă tokenii de print în text (`{{tableNumber}}`, `{{customText1}}`...), nu îi transforma în text fix. Nu inventa prețuri/oferte — întreabă userul.

**Pasul 3 — Rafinează ca grafician.** Citește cu `get_material_design` (vezi pozițiile în procente) și aplică principii: un punct focal, ierarhie clară, contrast citibil, aliniere cu `arrange_material_elements` (nu „la ochi"), spațiu de respirație, max 2–3 culori + 1–2 fonturi, CTA clar. Brandul: `apply_brand_to_material` (recolor + font + logo). Fundal: `set_material_page_background`. Uită-te REAL (screenshot prin Chrome) și iterează.

**Pasul 4 — Livrează.** Arată-i rezultatul (screenshot / link `gaseste_in_aplicatie("materiale grafice")`), spune-i ce-ai făcut, și cum îl exportă: butonul „Descarcă" (PDF pentru print, PNG pentru social) din studio. Vrea și alt format? `resize_material_design({format})` (ex. afiș → story Instagram). Card QR de masă pentru toate mesele? Printarea în lot se face din pagina „Coduri QR" (alegi șablonul + mesele). Dacă șablonul are `{{customText1}}`...`{{customText4}}`, userul completează acele câmpuri direct în dialogul de print; valorile sunt comune pentru PDF-ul curent.

## Reguli (cele care contează)
- **Pornește din șabloane** pentru rezultate frumoase rapid; coordonate FRACȚIONALE (0..1) când compui — gândești în procente, nu pixeli.
- **Tool-uri, NU clickuri, NU SQL.** Citește cu `get_material_design`, editezi pe `id` cu `update_material_elements` / `arrange_material_elements`.
- **Brand consecvent**: `applyBrandColors:true` la from-template sau `apply_brand_to_material` după.
- **Claritate**: limbaj de restaurant, nu jargon; alege cu userul deciziile mari; arată-i rezultatul (screenshot / link).
- **Nu inventa** prețuri/oferte/poze reale; QR-ul pe șabloanele de masă se completează la printarea în lot din „Coduri QR". `{{tableNumber}}` este per QR; `{{customText1}}`...`{{customText4}}` sunt texte manuale per print/PDF.
- **Permisiune**: scrierea cere modulul `marketing_social` („Marketing & Social Media"). „Permisiune insuficientă" → portal Hub → Acces AI.

## Legături
- Tool-urile MCP + modelul de element + cheatsheet de cereri → `knowledge/materiale-grafice.md` (secțiunile „Tool-urile MCP" + „Cheatsheet").
- Cum conduci Chrome (deep-link, screenshot = livrabil) → `knowledge/condu-chrome.md`.
- Coduri QR de masă (generare + print în lot pe șablon) → `knowledge/plan-sala-qr.md` + pagina „Coduri QR".
- Meniul fizic tipărit (alt modul) → skill-ul `meniu-fizic`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` + ghidează în app.
