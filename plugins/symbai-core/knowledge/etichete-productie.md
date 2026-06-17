# Etichete de producție — design frumos + printare pe rețetă/lot (valabilitate, alergeni, cod de bare)

> Cum pui etichete profesioniste pe semipreparatele și produsele tale: le DESENEZI o singură dată în Materiale Grafice (cu cod de bare și câmpuri care se completează automat — lot, dată, valabilitate, alergeni), le legi de o rețetă ca „implicite", și apoi le PRINTEZI dintr-un singur buton când lotul e gata — pe o imprimantă de etichete (Zebra/termică) sau ca PDF. Designul materialelor în general → `materiale-grafice.md`. Imprimante & Print Agent → `echipamente-kds-imprimante.md`. Fluxul de producție (loturi) → `productie-restaurant.md`.

## ⚠ READ FIRST — eticheta = un material grafic „de tip Etichetă", legat de rețetă, printat la lot

O etichetă de producție e un material grafic special: are **câmpuri dinamice** (ex. `{{lot}}`, `{{termenValabilitate}}`, `{{alergeni}}`) care se completează SINGURE cu datele reale ale lotului în momentul printării, și se poate lega de o rețetă ca „etichetă implicită". Userul o desenează o dată; după aceea, la fiecare lot gata, apasă „Printează etichetă" și sistemul pune automat numărul lotului, data, valabilitatea calculată și alergenii.

Asistentul (tu) poate să printeze direct eticheta cu tool-ul `print_designed_label` — fără ca userul să atingă nimic.

### Pe scurt — 4 pași
1. **Desenezi eticheta** — în Materiale Grafice alegi „Material nou → Etichete" (formate termice: 40×30, 50×30, 58×40, 60×40, 100×50, 100×150 mm AWB…), pui textele + un **cod de bare** + **câmpuri dinamice** (`{{lot}}`, `{{termenValabilitate}}`, `{{alergeni}}` etc.).
2. **Configurezi imprimanta de etichete** (o dată) — în Setări → Imprimante adaugi o imprimantă de tip „Etichete" (pentru Zebra și majoritatea termicelor de rețea alegi limbajul **ZPL**).
3. **O setezi implicită pe rețetă** (opțional, dar comod) — pe eticheta desenată: „Setează ca etichetă implicită" → alegi rețeta/produsul. Acum sistemul știe ce etichetă să folosească pentru acea rețetă.
4. **Printezi la lot** — în Producție, pe un lot finalizat (sau în lucru), apeși „Printează etichetă": vezi o previzualizare reală cu datele completate, alegi imprimanta și câte copii, gata. Sau ceri asistentului: „printează etichetele pentru lotul de ciorbă".

### De ce e util
- **Trasabilitate** — orice vas/recipient din frigider își știe conținutul, lotul, data și pericolele (alergeni). Cerință de bun-simț și de control (ANPC, Reg. UE 1169 pentru alergeni).
- **Valabilitate calculată automat** — NU scrii manual „expiră pe 24 iunie". Sistemul ia data producției + valabilitatea din rețetă (ex. „3 zile") și pune singur data de expirare. Fără greșeli.
- **Alergeni din rețetă** — alergenii vin automat din ingredientele rețetei; nu-i scrii de mână pe fiecare etichetă.
- **Cod de bare scanabil** — pui un cod de bare (Code 128, GS1-128, EAN-13/8) cu lotul sau codul intern, ca să scanezi semipreparatul la consum/inventar.

## Concepte (limbaj de restaurant)
- **Șablon de etichetă** — un material grafic de tip „Etichetă" (o singură coală, dimensiunea fizică a etichetei în mm). Îl desenezi în Materiale Grafice ca pe orice material.
- **Câmp dinamic (token)** — un loc gol pe etichetă, scris ca `{{ceva}}`, care se umple automat la printare cu datele lotului/rețetei. În previzualizarea din editor vezi valori de probă; la print apar valorile reale.
- **Cod de bare** — un element pe etichetă (buton „Cod de bare" în editor). Valoarea lui poate fi fixă sau un câmp dinamic (ex. lotul).
- **Etichetă implicită** — legătura „pentru rețeta X folosește eticheta Y". Cea mai specifică legătură câștigă: o etichetă pe rețeta exactă bate eticheta implicită pe tot brandul.
- **Valabilitate (zile)** — proprietate a rețetei (câte zile ține semipreparatul refrigerat, și separat congelat). De aici se calculează `{{termenValabilitate}}`.

## Câmpurile dinamice disponibile (tokeni)
Le pui pe etichetă din butonul „Câmp dinamic" din editor (sau le scrii direct în text/în valoarea codului de bare):
- `{{denumire}}` — numele semipreparatului/produsului.
- `{{lot}}` — numărul lotului.
- `{{dataProductiei}}` — data la care s-a făcut lotul.
- `{{termenValabilitate}}` — data de expirare (refrigerat) = data producției + valabilitatea rețetei.
- `{{termenValabilitateCongelat}}` — expirarea pentru congelat.
- `{{gramaj}}` — cantitatea lotului.
- `{{alergeni}}` — alergenii (din ingredientele rețetei). Pune-i **bold** (cerință Reg. UE 1169).
- `{{ingrediente}}` — lista ingredientelor.
- `{{sku}}` / `{{gtin}}` — codul intern / codul de bare al produsului.
- `{{operator}}`, `{{depozitare}}`, `{{descriere}}` — cine a făcut, condiții de păstrare, descriere.
- Prefixele sunt compoziție liberă: scrii „Lot: {{lot}}" și iese „Lot: L240617-1".

## Imprimanta de etichete
- **ZPL (Zebra & termice de rețea)** — calea recomandată pentru imprimantele de etichete pe rolă. Imprimanta trebuie să fie **pe rețea, cu IP** (configurat în Setări → Imprimante). Sistemul transformă designul în imaginea etichetei și o trimite la imprimantă prin Print Agent — nu trebuie nimic instalat în plus.
- **PDF** — pentru coli A4 cu etichete autocolante sau pentru a verifica/arhiva. Butonul „Descarcă PDF" din fereastra de printare. Nu necesită imprimantă specială.
- **Configurare** (o dată, în Setări → Imprimante → „Imprimantă Etichete"): limbajul (ZPL/PDF), rezoluția (203/300/600 DPI — 203 e standardul) și, opțional, dimensiunea fizică a etichetei (dacă o lași goală, se ia din șablon).

## Tool-uri MCP utile (ce poți face direct pentru user)
- **`print_designed_label({ brandId, recipeId? / batchId? / productId?, designId?, printerId?, copies?, output? })`** — printează eticheta. Dacă NU dai `designId`, alege automat eticheta implicită legată de rețetă/produs (sau cea implicită pe brand). `output` poate fi `auto` (ZPL la imprimantă), `pdf` (întoarce PDF) sau lași gol. Pentru un lot, dă `batchId` — completează singur lotul/data/valabilitatea.
- `list_printers({ brandId?, locationId? })` — vezi imprimantele configurate (tip, stare, IP). Pentru etichete cauți tipul „Etichete".
- `list_material_designs({ brandId, type:'label' })` — șabloanele de etichetă existente.
- `list_material_templates()` + `create_material_from_template(...)` + tool-urile de editare — pentru a DESENA/ajusta eticheta (vezi `materiale-grafice.md`, modul declarativ, fără clickuri).
- `list_recipes` / `get_recipe_labels` / `set_recipe_labels` — rețetele și etichetele/valabilitatea legate de ele.

## Cheatsheet: ce-ți cere userul → ce faci
- „Fă-mi o etichetă pentru semipreparate / cu alergeni și valabilitate" → desenezi un material de tip Etichetă (vezi `materiale-grafice.md`): pui `{{denumire}}`, `{{lot}}`, `{{dataProductiei}}`, „Valabil: {{termenValabilitate}}", „Alergeni: {{alergeni}}" (bold) și un cod de bare cu `{{lot}}`. Apoi îi spui cum o leagă de rețetă.
- „Printează etichetele pentru lotul gata / pentru ciorbă" → `print_designed_label({ brandId, batchId })` (sau `recipeId`). Dacă nu există etichetă legată, întâi întrebi/ajuți să aleagă un șablon.
- „Vreau X copii" → `copies` în `print_designed_label`.
- „Dă-mi un PDF cu eticheta" → `print_designed_label({ ..., output:'pdf' })`.
- „Setează eticheta asta ca implicită pentru rețeta Y" → din Materiale Grafice, pe etichetă, „Setează ca etichetă implicită" (UI). (Asistentul ghidează userul — legarea se face din aplicație.)
- „Nu am imprimantă de etichete / nu iese pe Zebra" → verifici cu `list_printers` (există una de tip Etichete, pe rețea, cu IP, activă?). Dacă nu, ghidezi: Setări → Imprimante → adaugă „Imprimantă Etichete". Vezi `echipamente-kds-imprimante.md`.
- „Unde fac etichete?" → `gaseste_in_aplicatie("etichete")` (du-l în Materiale Grafice → Etichete) sau `gaseste_in_aplicatie("printează etichetă")` (Producție).

## Reguli & capcane (cele care contează)
- **Două locuri, roluri diferite**: eticheta se **DESENEAZĂ** în Materiale Grafice (Etichete) și se **PRINTEAZĂ** din Producție (butonul „Printează etichetă" pe lot) sau prin asistent. Nu confunda cu vechiul „Centru Printare" (`/print`), care e o etichetă-text simplă fără design.
- **ZPL = imprimantă de rețea cu IP.** Pe USB/fiscal nu merge ZPL. Dacă imprimanta n-are IP, ori o pui pe rețea, ori folosești PDF.
- **Valabilitatea vine din rețetă** — dacă `{{termenValabilitate}}` iese gol, rețeta n-are setată valabilitatea (zile). Completeaz-o pe rețetă.
- **Alergenii vin din ingrediente** — dacă lipsesc, verifică alergenii produselor-ingredient din rețetă.
- **Diacritice pe termice** — codul de bare și textul ies clar; la imprimante foarte simple, diacriticele pot fi simplificate. Verifică o etichetă de probă.
- **Codul de bare ≠ codul QR de masă** — codul de bare de pe etichetă (Code128/EAN) e pentru produs/lot; QR-urile meselor sunt alt modul (`plan-sala-qr.md`).
- **Nu inventa** loturi/date/alergeni — ele vin din lotul și rețeta reale; tu doar alegi șablonul și imprimanta.

## Legături
- Cum DESENEZI eticheta (cele 14 tool-uri + coordonate fracționale + cod de bare + câmpuri dinamice) → `materiale-grafice.md` + skill-ul `materiale-grafice`.
- Imprimante de etichete, Print Agent, configurare, testare → `echipamente-kds-imprimante.md`.
- Loturi de producție, finalizare, valabilitate, alergeni pe rețetă → `productie-restaurant.md` (sau `productie-fabrica.md` la fabrici).
- Pagina exactă → `gaseste_in_aplicatie("etichete")` (design) / `gaseste_in_aplicatie("printează etichetă")` (producție).
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` + ghidează în app.
