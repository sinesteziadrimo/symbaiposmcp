---
name: etichete-productie
description: Ajută userul cu etichetele de producție pentru semipreparate, produse și CONTAINERE (tavă/navetă/bax/ladă/palet) — le desenează (cu cod de bare/QR + câmpuri care se completează singure: lot, dată, valabilitate, alergeni), le leagă de rețetă / tip de container / magazie / stație, și le printează pe imprimantă de etichete (Zebra/termică) sau ca PDF, direct din asistent. Folosește la „fă o etichetă pentru semipreparate/ciorbă", „pune alergeni și valabilitate pe etichetă", „cod de bare pe etichetă", „printează etichetele pentru lotul gata", „printează eticheta pentru rețeta X", „setează eticheta implicită", „de ce nu iese eticheta pe Zebra", „vreau etichete cu termen de valabilitate" — și la formulările de fabrică ale clientului — „eticheta e predefinită", „nu pot modifica eticheta", „am dat print la container și a ieșit urât", „unde schimb eticheta containerului", „de ce iese eticheta mică", „eticheta iese într-un colț / tăiată / cu multă hârtie albă", „de ce a ieșit exact eticheta asta", „vreau altă etichetă pe paleți decât pe navete", „de ce iese pe imprimanta asta și nu pe cealaltă", „care regulă de etichetă câștigă", „ce profil de fabrică am pe etichete".
---

# Etichete de producție — asistent pentru design + printare

Userul vrea să pună etichete pe semipreparatele/produsele lui (vasele din frigider, recipientele, ambalajele) sau pe containerele fizice din fabrică (tăvi, navete, baxuri, paleți): cu denumire, lot, dată, **valabilitate** și **alergeni**, eventual cod de bare/QR. Tu îl ajuți să le DESENEZE o dată, să le LEGE (de rețetă, de operație, sau de tipul de container/magazie), și apoi să le PRINTEZE rapid — sau le printezi direct tu.

## Înainte de orice
1. Citește **`knowledge/etichete-productie.md`** (fluxul complet: design → imprimantă → implicit pe rețetă → print; câmpurile dinamice; ZPL vs PDF). Dacă e vorba de **containere** (recipiente fizice cu QR) sau de „**eticheta e predefinită / a ieșit urât / mică într-un colț**" → citește și **`knowledge/eticheta-container-rutare.md`** (cele 8 axe de rutare, profilele de fabrică + cele două cauze reale ale unei etichete sărace). NU confirma niciodată că eticheta „e predefinită și nu se poate schimba" — nu e adevărat. Și NU afirma din memorie o ordine de precedență: depinde de profilul brandului.
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

## Ramura „container" (fabrici) — când userul se plânge de eticheta printată

Dacă userul spune „**eticheta e predefinită / nu o pot modifica / a ieșit urât / iese mică într-un colț**", NU e nici o limitare a produsului, nici un design de refăcut orbește. Triază în ordinea asta, cu `knowledge/eticheta-container-rutare.md` în față:

1. **Lămurește despre ce „etichetă" vorbește** — șablon tipărit, tag de rutare la bucătărie, sau doar numele unui câmp. Sunt trei obiecte diferite.
2. **Verifică rola imprimantei** (`list_printers`): imprimanta de etichete are declarată dimensiunea reală a rolei (lățime × înălțime în mm) și DPI-ul? Rola nedeclarată sau declarată greșit = conținut înghesuit/tăiat, oricât de bine ar fi desenat șablonul. La fabricile cu mai multe role (ex. 70×105 și 110×150) fiecare imprimantă își are propria declarație.
   ⚠ **Rola nedeclarată nu se manifestă la fel pe ambele căi**: la eticheta de container fără șablon legat, printul e **refuzat** cu mesaj clar; cu un șablon legat, se tipărește la dimensiunea desenului, **fără eroare și fără avertisment** — deci poate ieși tăiată. Nu elimina cauza asta doar fiindcă „nu a dat nicio eroare".
3. **Verifică dacă există un șablon LEGAT** (`list_material_designs({brandId, type:'label'})` îți arată ce e desenat — desenat ≠ legat). Dacă nu e nimic legat de marfa aia, iese eticheta minimală de avarie. Semnul ei: **fără logo, fără culori, fără machetare — text simplu + QR, aceeași așezare indiferent de șablonul desenat de client**. (Atenție: ea CHIAR scrie denumirea produsului, codul recipientului, lotul, cantitatea, data, valabilitatea, condiția de păstrare și etapa, deci conținutul variază de la un recipient la altul — nu o exclude pe motiv că „nu e goală".)
4. **Leagă un șablon**, începând cu plasa de siguranță pe brand, apoi excepții („paleții din magazia de expediție folosesc șablonul logistic"). Regulile se pun pe 8 axe (stație, operator, tip de container, tip de produs, zonă, gestiune, locație, brand), dar **NU promite o ordine din memorie**:
   - ordinea o dă **profilul de fabrică** al brandului (profilele livrate au ordini diferite — la multi-linie tipul de produs e primul, la nealimentar zona și gestiunea);
   - implicit **stația e deasupra operatorului**;
   - **șablonul** se decide pe altă precedență decât imprimanta, cu **tipul de recipient pe prima poziție**;
   - regulile **se combină** (fiecare cântărește cât suma axelor puse pe ea) și alegerea se face **pe fiecare câmp separat** — imprimanta poate veni dintr-o regulă, șablonul din alta.
5. **Explică-i ce s-a ales și de ce** — cere planul rezolvat pentru situația lui (sau arată-i panoul „Rezultat la print" din Setări → „Etichete (Zebra)"), nu deduce din tabel și nu spune doar „am reparat". Apoi cere-i o etichetă de probă pe rola reală — previzualizarea de pe ecran nu spune dacă hârtia taie marginea.

## Reguli (cele care contează)
- **Design în Materiale Grafice, print în Producție / prin asistent.** Nu confunda cu „Centru Printare" (`/print`), care e eticheta-text simplă, fără design.
- **ZPL = imprimantă de rețea (IP).** Pe USB/fiscal nu merge — folosește PDF sau pune imprimanta pe rețea. Verifică cu `list_printers` înainte să promiți că iese pe Zebra.
- **Desenat ≠ legat.** Un șablon existent în Materiale Grafice dar nelegat de nimic nu iese niciodată singur la print. Înainte să promiți că „e rezolvat", verifică legătura, nu doar existența designului.
- **Rola se declară, nu se ghicește.** Dimensiunea reală a rolei (mm) + DPI se pun pe imprimanta de etichete și se re-pun ori de câte ori se schimbă fizic rola. Portret (ex. 70×105) ≠ peisaj (ex. 100×50) — nu inversa numerele. Lipsa ei e blocantă doar pe eticheta de container fără șablon; altfel e tăcută și taie eticheta.
- **Precedența de rutare nu se recită din memorie.** Ține de profilul brandului, șablonul are propria ordine (tipul de recipient primul), iar regulile se adună în loc să se oprească la prima. Cere planul rezolvat înainte să afirmi „regula X câștigă".
- **Datele sunt reale, nu inventate** — lotul/data/valabilitatea/alergenii vin din lot și rețetă. Tu alegi șablonul, imprimanta și copiile.
- **Alergenii bold** (Reg. UE 1169). Valabilitatea se calculează automat — nu o scrie manual.
- **Permisiuni**: printarea/etichetele țin de modulul Producție; designul de materiale ține de `marketing_social`. „Permisiune insuficientă" → portal Hub → Acces AI.
- **Claritate pentru user**: limbaj de restaurant, arată-i rezultatul (previzualizare/link), nu jargon tehnic.

## Legături
- Design etichetă (tool-uri + cod de bare + câmpuri dinamice) → `knowledge/materiale-grafice.md` + skill `materiale-grafice`.
- Fluxul de etichete (design → print) pe larg → `knowledge/etichete-productie.md`.
- Eticheta de CONTAINER + rutarea șabloanelor (cele 8 axe, profilele de fabrică, precedența specială a tipului de recipient) + „de ce iese eticheta mică/săracă" → `knowledge/eticheta-container-rutare.md`.
- Containere, coduri QR, scanner, palet → `knowledge/productie-fabrica.md`.
- Imprimante de etichete / configurarea imprimantelor → `knowledge/echipamente-kds-imprimante.md`.
- Loturi, valabilitate, alergeni pe rețetă → `knowledge/productie-restaurant.md` + skill `productie-flux`.
- Blocaj → `trimite_ticket_symbai` + ghidează în app.
