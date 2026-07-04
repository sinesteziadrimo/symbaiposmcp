# Etichete de producție — design frumos + printare pe rețetă/lot (valabilitate, alergeni, cod de bare)

> Cum pui etichete profesioniste pe semipreparatele și produsele tale: le DESENEZI o singură dată în Materiale Grafice (cu cod de bare și câmpuri care se completează automat — lot, dată, valabilitate, alergeni), le legi de o rețetă ca „implicite", și apoi le PRINTEZI dintr-un singur buton când lotul e gata — pe o imprimantă de etichete (Zebra/termică) sau ca PDF. Designul materialelor în general → `materiale-grafice.md`. Imprimante & configurarea lor → `echipamente-kds-imprimante.md`. Fluxul de producție (loturi) → `productie-restaurant.md`.

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
- **ZPL (Zebra & termice de rețea)** — calea recomandată pentru imprimantele de etichete pe rolă. Imprimanta trebuie să fie **pe rețea, cu IP** (configurat în Setări → Imprimante). Sistemul transformă designul în imaginea etichetei și o trimite direct la imprimantă — nu trebuie nimic instalat în plus.
- **PDF** — pentru coli A4 cu etichete autocolante sau pentru a verifica/arhiva. Butonul „Descarcă PDF" din fereastra de printare. Nu necesită imprimantă specială.
- **Configurare** (o dată, în Setări → Imprimante → „Imprimantă Etichete"): limbajul (ZPL/PDF), rezoluția (203/300/600 DPI — 203 e standardul) și, opțional, dimensiunea fizică a etichetei (dacă o lași goală, se ia din șablon).

## Fabrică: eticheta pe o OPERAȚIE din flux + printare de la tableta de stație

La fabrici (producție pe flux tehnologic), eticheta nu se leagă doar de rețetă — se leagă de o **operație din flux** (de regulă „Ambalare") și se printează de pe **Tableta de Stație**, nu doar dintr-un buton pe lot:

- **Șablon implicit pe operație** — în editorul de flux (Producție → Fluxuri → editezi operația → tab „QC & Etichetă") alegi: **Șablon etichetă** (un material grafic tip „Etichetă"), **Nr. copii** și **Print automat la finalizare**. Astfel, la acea operație sistemul știe exact ce etichetă să scoată.
- **Unde se lipește** — câmpul „Unde se lipește eticheta" (palet/cutie/ladă/tavă/produs/pungă/butoi/sticlă) apare ca instrucțiune pe tabletă: „Lipește eticheta pe: palet".
- **Etichetare obligatorie** — dacă bifezi „Etichetare obligatorie", finalizarea operației e blocată până se printează eticheta (nu poți „uita" de etichetă).
- **De pe tabletă** (Producție → Tabletă Stație): imprimanta de etichete se alege o dată în **⚙ Setări → „Imprimantă Etichete"** (+ opțional „Print automat la finalizare"). Pe fiecare operație apare butonul **„ETICHETĂ"** → alegi câte copii → printezi. Sau, cu „Print automat", iese singur la finalizare.

### Multe copii deodată (Zebra scoate rapid)
La un lot gata poți printa sute/mii de etichete **dintr-o singură comandă** — imprimanta termică le repetă singură (o comandă, nu mii de joburi), deci e instant. Plafon 9999. Pe tabletă ai butoane rapide: **„Cât lotul (N)"** (o etichetă pe fiecare unitate produsă), **„4 (palet)"** și 50/100/500.

### Etichetă de palet cu QR mare
Pentru palet: desenează în Materiale Grafice un șablon de etichetă cu un **QR/cod de bare MARE** (legat de `{{lot}}`), alege-l ca șablon pe operația de ambalare și pune **copii = 4** (câte una pe fiecare față a paletului → ușor de identificat din orice parte). Sau o singură etichetă mare, cum preferi.

## Tool-uri MCP utile (ce poți face direct pentru user)
- **`print_designed_label({ brandId, recipeId? / batchId? / productId?, designId?, printerId?, copies?, output? })`** — printează eticheta. Dacă NU dai `designId`, alege automat eticheta implicită legată de rețetă/produs (sau cea implicită pe brand). `output` poate fi `auto` (ZPL la imprimantă), `pdf` (întoarce PDF) sau lași gol. Pentru un lot, dă `batchId` — completează singur lotul/data/valabilitatea. `copies` 1-9999 (ex. 4 = un palet, sau câte unități are lotul).
- **`configure_operation_completion({ operationId, labelTemplateId?, labelCount?, autoPrintLabels?, completionRequiresLabel?, labelApplicationTarget? })`** (fabrică) — leagă un șablon de etichetă de o OPERAȚIE din flux: ce design (`labelTemplateId` = id din `list_material_designs type:'label'`), câte copii implicit, print automat la finalizare, etichetare obligatorie și unde se lipește. Apoi operatorul printează de pe tableta de stație.
- `list_printers({ brandId?, locationId? })` — vezi imprimantele configurate (tip, IP, stare LIVE). Pentru etichete cauți tipul „Etichete"; `status:"online"` înseamnă că poate tipări acum, `offline`/`unassigned` înseamnă că trebuie verificată legătura imprimantei (vezi `echipamente-kds-imprimante.md`) sau folosit PDF.
- `list_material_designs({ brandId, type:'label' })` — șabloanele de etichetă existente.
- `list_material_templates()` + `create_material_from_template(...)` + tool-urile de editare — pentru a DESENA/ajusta eticheta (vezi `materiale-grafice.md`, modul declarativ, fără clickuri).
- `list_recipes` / `get_recipe_labels` / `set_recipe_labels` — rețetele și etichetele/valabilitatea legate de ele.

## Cheatsheet: ce-ți cere userul → ce faci
- „Fă-mi o etichetă pentru semipreparate / cu alergeni și valabilitate" → desenezi un material de tip Etichetă (vezi `materiale-grafice.md`): pui `{{denumire}}`, `{{lot}}`, `{{dataProductiei}}`, „Valabil: {{termenValabilitate}}", „Alergeni: {{alergeni}}" (bold) și un cod de bare cu `{{lot}}`. Apoi îi spui cum o leagă de rețetă.
- „Printează etichetele pentru lotul gata / pentru ciorbă" → `print_designed_label({ brandId, batchId })` (sau `recipeId`). Dacă nu există etichetă legată, întâi întrebi/ajuți să aleagă un șablon.
- „Vreau X copii" / „o mie de etichete" / „cât lotul" → `copies` în `print_designed_label` (1-9999; Zebra le scoate dintr-o singură comandă).
- „Etichetă de palet cu QR mare, una pe fiecare față" → un șablon cu QR mare (Materiale Grafice) + `copies:4`. Pe fabrică: leagă-l de operația de ambalare cu `configure_operation_completion({ operationId, labelTemplateId, labelCount:4, labelApplicationTarget:'pallet' })`.
- „Pune eticheta X pe operația de ambalare / să iasă automat la finalizare" (fabrică) → `configure_operation_completion({ operationId, labelTemplateId, autoPrintLabels:true })`; pentru a obliga eticheta înainte de finalizare adaugă `completionRequiresLabel:true`.
- „Dă-mi un PDF cu eticheta" → `print_designed_label({ ..., output:'pdf' })`.
- „Setează eticheta asta ca implicită pentru rețeta Y" → din Materiale Grafice, pe etichetă, „Setează ca etichetă implicită" (UI). (Asistentul ghidează userul — legarea se face din aplicație.)
- „Nu am imprimantă de etichete / nu iese pe Zebra" → verifici cu `list_printers` (există una de tip Etichete, pe rețea, cu IP și `status:"online"`?). Dacă lipsește sau e `offline`/`unassigned`, ghidezi: Setări → Imprimante → adaugă/leagă „Imprimantă Etichete" și verifică legătura cu imprimanta. Vezi `echipamente-kds-imprimante.md`.
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
- Imprimante de etichete, configurare, testare → `echipamente-kds-imprimante.md`.
- Loturi de producție, finalizare, valabilitate, alergeni pe rețetă → `productie-restaurant.md` (sau `productie-fabrica.md` la fabrici).
- Pagina exactă → `gaseste_in_aplicatie("etichete")` (design) / `gaseste_in_aplicatie("printează etichetă")` (producție).
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` + ghidează în app.
