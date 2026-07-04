---
name: etichete-productie
description: Ajută userul cu etichetele de producție pentru semipreparate și produse — le desenează (cu cod de bare + câmpuri care se completează singure: lot, dată, valabilitate, alergeni), le leagă de o rețetă ca implicite, și le printează pe imprimantă de etichete (Zebra/termică) sau ca PDF, direct din asistent. Folosește la „fă o etichetă pentru semipreparate/ciorbă", „pune alergeni și valabilitate pe etichetă", „cod de bare pe etichetă", „printează etichetele pentru lotul gata", „printează eticheta pentru rețeta X", „setează eticheta implicită", „de ce nu iese eticheta pe Zebra", „vreau etichete cu termen de valabilitate".
---

# Etichete de producție — asistent pentru design + printare

Userul vrea să pună etichete pe semipreparatele/produsele lui (vasele din frigider, recipientele, ambalajele): cu denumire, lot, dată, **valabilitate** și **alergeni**, eventual cod de bare. Tu îl ajuți să le DESENEZE o dată, să le lege de rețetă, și apoi să le PRINTEZE rapid la fiecare lot — sau le printezi direct tu.

## Înainte de orice
1. Citește **`knowledge/etichete-productie.md`** (fluxul complet: design → imprimantă → implicit pe rețetă → print; câmpurile dinamice; ZPL vs PDF).
2. Pentru partea de DESEN citește **`knowledge/materiale-grafice.md`** (tool-urile de design, coordonate fracționale, cod de bare, câmpuri dinamice) — eticheta e un material grafic de tip „Etichetă".
3. Pentru loturi/valabilitate/alergeni: **`knowledge/productie-restaurant.md`**. Pentru imprimante: **`knowledge/echipamente-kds-imprimante.md`**.
4. **Context**: `list_brands` (+ `list_locations` dacă userul a numit o locație) → `brandId`. `list_printers` (vezi dacă există o imprimantă de tip „Etichete", pe rețea, cu IP).

## Fluxul (pași)

**Pasul 1 — Desenează eticheta (dacă nu există una).** E un material grafic de tip „Etichetă", dimensiunea fizică în mm (40×30, 58×40, 60×40, 100×50, 100×150 AWB…). Folosește tool-urile de materiale (vezi skill-ul `materiale-grafice`): pune `{{denumire}}` (titlu, bold), „Lot: {{lot}}", „Prod.: {{dataProductiei}}", „Valabil: {{termenValabilitate}}", „Alergeni: {{alergeni}}" (bold — cerință legală), și un **cod de bare** cu valoarea `{{lot}}` sau codul intern. Arată-i rezultatul (link / screenshot). Pentru cazuri simple, există și șabloane de etichetă gata făcute.

**Pasul 2 — Asigură-te că rețeta are valabilitate + alergeni.** `{{termenValabilitate}}` se calculează din valabilitatea (zile) a rețetei; `{{alergeni}}` vine din ingrediente. Dacă lipsesc, ghidează userul să le completeze pe rețetă (sau folosește tool-urile de rețetă). Fără ele, câmpurile ies goale.

**Pasul 3 — (Opțional) Leagă eticheta de rețetă ca implicită.** Din Materiale Grafice, pe eticheta desenată: „Setează ca etichetă implicită" → alege rețeta (sau produsul, sau „tot brandul"). După asta, printarea găsește singură șablonul. Cel mai specific câștigă (rețetă > brand).

**Pasul 4 — Printează.** Două căi:
- **Tu, direct**: `print_designed_label({ brandId, batchId })` pentru un lot (completează lot/dată/valabilitate automat), sau `recipeId`/`productId`. Adaugă `copies` și `printerId` dacă userul vrea. `output:'pdf'` întoarce un PDF în loc să trimită la imprimantă.
- **Userul, din aplicație**: în Producție, pe lotul gata, butonul „Printează etichetă" → previzualizare reală + alege imprimanta + copii → „Printează" (sau „Descarcă PDF").

## Reguli (cele care contează)
- **Design în Materiale Grafice, print în Producție / prin asistent.** Nu confunda cu „Centru Printare" (`/print`), care e eticheta-text simplă, fără design.
- **ZPL = imprimantă de rețea (IP).** Pe USB/fiscal nu merge — folosește PDF sau pune imprimanta pe rețea. Verifică cu `list_printers` înainte să promiți că iese pe Zebra.
- **Datele sunt reale, nu inventate** — lotul/data/valabilitatea/alergenii vin din lot și rețetă. Tu alegi șablonul, imprimanta și copiile.
- **Alergenii bold** (Reg. UE 1169). Valabilitatea se calculează automat — nu o scrie manual.
- **Permisiuni**: printarea/etichetele țin de modulul Producție; designul de materiale ține de `marketing_social`. „Permisiune insuficientă" → portal Hub → Acces AI.
- **Claritate pentru user**: limbaj de restaurant, arată-i rezultatul (previzualizare/link), nu jargon tehnic.

## Legături
- Design etichetă (tool-uri + cod de bare + câmpuri dinamice) → `knowledge/materiale-grafice.md` + skill `materiale-grafice`.
- Fluxul de etichete (design → print) pe larg → `knowledge/etichete-productie.md`.
- Imprimante de etichete / configurarea imprimantelor → `knowledge/echipamente-kds-imprimante.md`.
- Loturi, valabilitate, alergeni pe rețetă → `knowledge/productie-restaurant.md` + skill `productie-flux`.
- Blocaj → `trimite_ticket_symbai` + ghidează în app.
