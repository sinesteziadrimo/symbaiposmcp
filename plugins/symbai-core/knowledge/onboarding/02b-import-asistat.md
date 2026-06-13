# Onboarding 02b — Import asistat: tu conduci pagina de import + verifici prin conexiune

> Ghidul de detaliu pentru calea combinată din faza 02. Planul general: `00-plan-general.md`. Calea directă prin tool-uri și termenii (produs/meniu/gestiune): `02-import-date.md`. Folosit de skill-ul `importa-date`.

## Ideea în două fraze

Pagina de import a aplicației (`Import din Excel`, pasul 2 din onboarding) are cel mai bun **motor de citire a fișierelor** (recunoaște encoding, numere românești, Excel renumit „.csv", exporturi SAGA/HTML, foi multiple) + normalizare + „Import Doctor" (duplicate, TVA invalid) + import **tranzacțional** (tot-sau-nimic). Dar **deciziile ei automate** — în ce magazie intră produsele, ce tip de produs e fiecare, ce categorie — **pot fi greșite**, pentru că le ia un model mic, pe reguli, fără contextul restaurantului.

**Combinația câștigătoare**: lași pagina să **parseze** fișierele (motorul ei robust), dar **TU răspunzi la întrebările ei** (model mai deștept, mai mult context — citești fișierul, înțelegi că „Vin alb casă" e o băutură de vândut, nu o materie primă), și **după import verifici și corectezi prin conexiunea MCP** tot ce a ieșit strâmb. Pentru user e o singură experiență simplă: el îți dă fișierele, tu te ocupi de tot și îi explici la fiecare pas.

## Strategia inteligentă — fă-i importului treaba ușoară (citește întâi)

Cel mai mult câștigi mutând inteligența ÎNAINTE de import, nu corectând după. Trei pârghii (toate detaliate în `02c-import-sabloane-canonice.md` și `02d-import-surse-externe.md`):

1. **Completează ce lipsește** (`02d`) — dacă fișierul e incomplet (sau userul n-are fișier dar are meniu online), **cauți TU datele lipsă cu permisiunea lui**: website propriu (HTML sau API JSON ascuns), **SmartMenu** (API Firebase), export de marketplace, PDF/poze. Nu inventezi nimic; arăți sursa.
2. **Construiește un fișier CANONIC** (`02c`) — în loc să dai importului un fișier murdar pe care-l mapează cu AI (și greșește), îi dai un fișier cu **anteturile EXACT ca numele câmpurilor țintă** + valori normalizate (unități, TVA, tip produs, categorii cu ` > `). AI-ul de mapare tot rulează (mereu rulează), dar acum doar **confirmă** o propunere corectă → maparea iese bună din prima și întrebările scad mult (de regulă 0–2 minore, nu zero). Poți fie rescrie fișierul userului într-unul canonic, fie construi unul nou din ce-ai adunat.
3. **Pre-creează referințele prin conexiune** (`02c`) — gestiuni, categorii, tipuri de produs, furnizori, cote TVA — cu numele EXACT pe care-l pui în fișier, ca importul să le lege curat (nu „pe ghicite"). Toate au tool MCP; verifici întâi ce există, ca să nu dublezi.

**Regula de alegere:** fișier mic și deja curat → poți merge direct pe pagină și răspunzi la întrebări (fazele B–C). Fișier mare/murdar/incomplet/din mai multe surse → **construiește canonicul + pre-creează refs**, apoi importă (mult mai puține întrebări). În ambele, verifici și corectezi la final (Faza E).

## Două moduri — alege-l onest la început și spune-i userului în ce mod ești

- **Mod AUTOMAT (preferat)** — ai extensia Chrome conectată (tool-urile `claude-in-chrome`) și userul e logat în Symbai în browserul lui. **Tu** deschizi pagina, încarci fișierele, răspunzi la întrebări, dai drumul importului. Userul doar privește și confirmă deciziile cheie.
- **Mod ASISTAT** — fără extensie Chrome (sau userul preferă să dea el click). Tu citești fișierele, pregătești totul, îi spui **exact** ce să încarce și ce să răspundă la fiecare întrebare a paginii (cu valorile decise de tine), iar **după** verifici și corectezi prin conexiunea MCP. Tot tu faci munca grea (decizii + verificare), el dă doar click-urile.

Verifică modul la început: dacă tool-urile `claude-in-chrome` nu apar / nu e niciun browser conectat → e mod asistat; oferă-i userului și varianta „conectează extensia Chrome ca să fac eu pașii", dar nu-l bloca pentru ea.

**Mod CONEXIUNE (preferat dacă există)** — dacă în sesiunea ta apare un tool MCP care conduce importul prin conexiune (creează sesiune de import / încarcă fișier / citește maparea propusă / validează / pornește importul), **preferă-l în locul paginii prin Chrome** — același rezultat, mai robust (fără UI fragil). Tool-urile din sesiunea ta sunt sursa de adevăr: dacă un asemenea tool nu există încă în instanța clientului, folosești pagina (automat/asistat) ca acum.

Indiferent de mod, **verificarea + corecția prin MCP la final sunt identice** și sunt partea cea mai valoroasă — vezi „Faza E".

---

## Faza A — Pregătire (citiri MCP + găsește fișierele)

1. **Conexiune + structură** (MCP): `list_brands`, `list_locations`, `list_warehouses_full`, `list_menus`, `list_vat_rates`, `list_product_types(brandId)`, `get_config_status(brandId)`. Dacă lipsesc branduri/locații → faza 1 nu e gata, oprește-te acolo. Reține `brandId`/`locationId` și gestiunile existente (nu vrei să le dublezi).
2. **Găsește fișierele**: întreabă userul unde sunt pe calculator (Excel/CSV exportate din vechiul sistem). Dacă îți dă un folder, listează-l; locuri uzuale: Desktop, Descărcări/Downloads. Confirmă lista de fișiere și ce crezi că e fiecare (produse / meniu / furnizori / stoc).
3. **Link-ul paginii de import**: `gaseste_in_aplicatie("import produse din excel")` → întoarce link-ul direct (pagina `Import din Excel` / pasul 2 din onboarding). Pe ăsta îl deschizi în Chrome (mod automat) sau i-l dai userului (mod asistat).

## Faza A2 — Pregătește datele (aici e inteligența ta)

Asta o decizi TU (userul nu trebuie să facă nimic). Dacă vezi că merită pregătire, întreabă-l o singură dată, simplu: „Pot să completez ce lipsește de pe site-ul/meniul vostru online și să-ți pregătesc datele curat înainte să le încarc — sau le importăm exact cum sunt în fișier?". Pe surse externe intri DOAR cu „da"-ul lui. Apoi, pe baza fișierului citit:
- **Lipsesc date?** (prețuri, descrieri, poze, categorii — sau userul n-are fișier dar are meniu online) → propune-i să le completezi din surse externe, cu permisiunea lui: `02d-import-surse-externe.md` (website / SmartMenu / marketplace / PDF).
- **Fișier murdar / mare / din mai multe surse?** → **construiește un fișier canonic** (anteturi exacte + valori normalizate) după `02c-import-sabloane-canonice.md`. Îl scrii ca CSV/Excel și pe ACELA îl imporți. Așa importul nu mai are ce greși.
- **Pre-creează referințele prin conexiune** (gestiuni, categorii, tipuri produs, furnizori, TVA) cu numele EXACT din fișier — `02c`, secțiunea de pre-creare. Verifici întâi ce există (`list_*`) ca să nu dublezi.

Dacă fișierul e mic și deja curat, sari peste Faza A2 și mergi direct la pagină.

## Faza B — Lasă pagina să citească fișierul (motorul ei e plasa de siguranță)

**Nu parsa tu Excel-ul „cu mâna" ca sursă principală** — motorul paginii e mai sigur pe encoding, numere RO și formate murdare. Fluxul:

**Mod automat (Chrome):**
1. `navigate` la link-ul de import. Citește pagina (`get_page_text`/`read_page`) ca să te orientezi.
2. **Încarcă fișierele** cu `file_upload` pe zona de încărcare (drag & drop / „alege fișier"). Poți încărca mai multe deodată (pagina acceptă până la 30).
3. Pagina parsează + detectează (afișează progres). **Așteaptă** să termine analiza (re-citește pagina până vezi rezultatul — nu te grăbi, fișierele mari durează).
4. **Citește ce a dedus pagina**: ce tip de entitate a pus pe fiecare fișier, cum a mapat coloanele, 3-5 rânduri de previzualizare, ce întrebări/„carduri" ridică. Asta e baza pe care răspunzi.

**Mod asistat (fără Chrome):** spune-i userului să deschidă link-ul și să tragă fișierele în pagină; cere-i să-ți zică (sau să-ți dea o captură cu) tipul detectat + maparea coloanelor + ce întrebări apar. Citește TU fișierul local în paralel (un dump rapid al primelor ~30 de rânduri) ca să poți decide răspunsurile — vezi mai jos.

**Când citești tu fișierul local** (pentru judecată, nu ca parser): ai nevoie doar de structură + câteva rânduri. Un fișier `.xlsx` e binar (arhivă) — nu-l deschide cu Read direct; dump-uiește-l rapid (un mic script cu librăria de spreadsheet disponibilă, sau cere userului un „Salvează ca CSV"). Pentru `.csv` curat, Read pe primele rânduri e ok. Scopul: să vezi numele coloanelor, exemple de valori, ce cote TVA apar, dacă prețurile par de vânzare sau de achiziție.

## Faza C — Răspunde la întrebările importului (PARTEA CHEIE)

Pagina te întreabă, per fișier, lucrurile de mai jos. Pentru fiecare: **decide din fișier dacă se poate; întreabă userul DOAR ce e cu adevărat ambiguu; explică-i pe scurt ce ai decis.** Strânge întrebările pentru user într-o singură rundă, nu pe rând.

| Întrebarea paginii | Cum răspunzi (regula) |
|---|---|
| **Ce tip de date e fișierul?** (produse / articole de meniu / rețetar / furnizori / angajați / gestiuni / mișcări de stoc) | Pagina ghicește din nume + coloane. Verifică: `recipeName`+ingredient+cantitate → rețetar; `cui`+`regCom` → furnizori; `cnp`+salariu → angajați; nume+un singur preț de vânzare → articole de meniu; nume+preț achiziție+stoc+UM → produse. Dacă a greșit, schimbă tipul („Schimbă tipul"). **Rețete și angajați au fazele lor** (09, 07) — notează-le și revino, nu le forța aici. |
| **Maparea coloanelor** (care coloană = nume, preț, UM, TVA, magazie…) | Pagina mapează cu AI. Citește maparea + previzualizarea și **corectează ce e clar greșit** — tipic: o coloană „Preț" pusă pe prețul de achiziție când de fapt e prețul de vânzare, sau invers. Dacă un chip zice „lipsește X obligatoriu" deși coloana există în fișier, leag-o manual. |
| **În ce magazie/gestiune intră?** | **Aici greșește des** (bagă tot într-una). Decide din fișier: dacă are o coloană de secție/categorie (Bar vs Bucătărie), împarte corespunzător; altfel întreabă userul „totul într-o magazie, sau Bucătărie/Bar separat?". Folosește gestiunile EXISTENTE (din `list_warehouses_full`), nu crea variante noi. |
| **Ce tip de produs e fiecare?** (materie primă / marfă / preparat / semipreparat) | **Aici greșește des** (pune băuturi îmbuteliate ca „materie primă"). Tu decizi mai bine: băutură la doză/sticlă vândută ca atare = **marfă**; ingredient cumpărat = **materie primă**; preparat de bucătărie/cocktail = **preparat**; sos/bază de casă = **semipreparat**. Arborele complet în `02-import-date.md` și `adauga-produs-reteta`. Poți seta tipul pe fișier/pe rând în pagină; ce scapă, corectezi prin MCP la Faza E. |
| **Ce TVA?** | România = **0 / 11 / 21**. Pagina remapează singură cotele vechi (5/9→11, 19/24→21) — verifică doar logica: mâncare/nealcoolice de regulă 11, **alcool mereu 21**. Nu „repara" remap-ul înapoi la cote vechi. |
| **În ce meniu intră articolele?** | Alege meniul principal al brandului (din `list_menus`) sau „+ Meniu nou" dacă nu există. La 2+ branduri, un meniu per brand — nu amesteca articolele între branduri. |
| **Prețurile sunt cu sau fără TVA? / Ce monedă? / Vânzare sau achiziție?** | Răspunde din context (în RO prețurile de meniu sunt de regulă cu TVA, în RON). „Vânzare vs achiziție": dacă produsele sunt vandabile și au un singur preț, aproape sigur e prețul de vânzare → merge în meniu, nu în prețul de achiziție. Dacă chiar nu reiese, întreabă scurt. |
| **Rândul de antet / duplicate** | Dacă pagina a prins greșit rândul cu denumirile coloanelor, corectează-l. Rulează „Import Doctor" dacă apare (găsește duplicate SKU/cod de bare/nume, TVA invalid) și **citește ce propune** înainte să accepți. |

**Principiul peste tot:** pagina propune, tu decizi cu cap, userul confirmă doar ce contează. La fiecare decizie ne-evidentă, o frază pentru user: „Pun băuturile la Bar și mâncarea la Bucătărie, și marchez sticlele ca «marfă» — ok?".

### Cum se comportă pagina concret (ca s-o conduci fără să te încurci) — verificat în cod

- **Întrebările apar într-un carusel de carduri (un dialog) care se deschide SINGUR DUPĂ ce se termină analiza**, nu imediat după upload. Analiza rulează în fundal (streaming) și durează — **așteaptă, re-citește pagina până apare dialogul**; nu apăsa nimic presupunând că s-a terminat instant.
- **Răspunde card cu card.** Alegi opțiunea potrivită; dacă un card cere **text scris** (ex. numele unei magazii/meniu nou), ordinea e: click pe opțiune → apare câmpul de text → scrii valoarea → confirmi (Next/Submit). Nu presupune că textul se completează singur.
- **Întrebările sunt per fișier și DINAMICE** — nu apar toate de fiecare dată. Ex.: „care brand?" / „care locație?" apar DOAR la clienții cu mai multe branduri/locații (la unul singur se rezolvă automat). Răspunde la ce vezi pe ecran, nu căuta întrebări care nu apar; tratează fiecare card după conținutul lui, nu după o ordine fixă.
- **Importul NU se blochează niciodată.** Dacă apeși „Importă" cu întrebări nerăspunse, pagina merge înainte cu valori implicite (și arată un mesaj „N nerăspunse"). De aceea **răspunde tu măcar la magazie și tip de produs** — acolo default-urile automate dor cel mai tare; restul, dacă le sari, le prinzi la verificarea prin conexiune (Faza E). Mai bine răspuns corect acum decât corecție după.

## Faza D — Pornește importul

1. Asigură-te că niciun fișier nu mai are „obligatoriu lipsă" (chip roșu). Dacă userul a cerut și **stocul inițial**, asigură-te că ai mapat coloana de stoc.
2. Arată userului un **rezumat scurt înainte de a apăsa**: câte produse/articole, în ce magazii, ce meniu, ce ai normalizat (TVA, unități). O confirmare.
3. Apasă **„Importă acum"** (mod automat) / spune-i userului să apese (mod asistat). Așteaptă rezultatul și citește-l: câte **create / actualizate / sărite / erori**. Erorile pe rânduri anume — notează-le, le rezolvi la Faza E sau ceri userului fișierul corectat.

## Faza E — Verifică ȘI CORECTEAZĂ prin conexiune (asta înlocuiește „pasul de verificare", mai bine)

Pasul 3 din wizard face doar verificări mecanice pe numărători. **Tu faci mai mult**: citești datele reale, le judeci cu cap și **repari** prin tool-uri, cu mai mult context. Vânează exact punctele unde importul greșește:

**Citește (audit):**
- `search_products_db` / SQL (`execute_sql_query`, dacă ai SQL activ) pe catalogul nou: tipuri de produs, TVA, unități, magazia fiecăruia.
- `list_warehouses_full` + `get_warehouse_products_summary(warehouseId)` — nicio magazie golită neintenționat, nimic băgat tot într-una din greșeală.
- `list_menus` + `list_menu_items(menuId)` — articole cu preț 0/lipsă; tot ce e vandabil chiar e în meniu.
- `list_menu_categories(brandId)` — categorii goale / produse necategorisite.
- `list_product_types(brandId)` — produse fără tip.

**Corectează.** Corecțiile **sigure** (le faci liber, fără efecte secundare): tip de produs, TVA, unitate, categorie, preț de vânzare, poze. Magazia e **excepția** (are efect contabil — vezi mai jos).
- **Tip de produs greșit** → `bulk_update_products({ productIds, updates: { productType } })`. Ex.: băuturile importate ca „materie primă" → `merchandise`; un „preparat" fără rețetă care de fapt e marfă → corectează tipul.
- **TVA greșit/lipsă** → `auto_assign_vat_batch({ brandId, onlyMissing: true })` sau `bulk_update_products({ productIds, updates: { vatRate } })`.
- **Unitate greșită** (mai ales sticle de alcool puse în „buc" în loc de „l" — capcană de food cost ×1000) → `bulk_update_products updates.unit` ÎNAINTE de a face rețete pe ele.
- **Categorie lipsă** → `create_menu_category` (per secție, ierarhic cu `parentId`) + `update_menu_item({ brandId, menuItemId, menuCategoryId })` (se oglindește și pe produs).
- **Preț pus greșit ca achiziție** la produse vandabile → setează prețul de vânzare în meniu (`update_menu_item` / `apply_menu_prices` / `bulk_update_menu_item_prices` cu `brandId`).
- **Poze** (dacă ai URL-uri din meniul vechi) → `set_product_image({ productId, imageUrl })`.
- ⚠ **Magazia greșită**: se POATE schimba (`bulk_update_products.updates.warehouseId` în masă, sau `update_product` per produs), DAR pe un produs care **are deja stoc** mutarea creează un document de transfer + note contabile — nu e o corecție „gratis" ca tipul/TVA. De aceea **nimerește magazia la întrebarea din pagină (Faza C)**; dacă tot trebuie mutat, fă-o ÎNAINTE de a seta stocul, altfel spune-i userului explicit de efectul contabil și cere-i aprobarea.

**Ce-i spui userului la corecții (clar, în limbaj de restaurant):** la fiecare corecție, o frază scurtă cu CE și DE CE — „Vinurile intraseră ca «materie primă», dar sunt băuturi de vândut; le trec pe «marfă» ca să apară corect în costuri și în meniu". La orice atinge **stocul, prețul sau mișcări contabile** (mutare de magazie cu stoc, schimbare de preț) **cere-i întâi aprobarea**; la corecții simple (tip, TVA, categorie, unitate) îl anunți, nu ceri voie pentru fiecare. Nu folosi cuvinte ca „transfer contabil/GL" cu el — spune „o să miște stocul în acte, ești de acord?".

**Re-citește** după corecții (confirmi prin tool de citire, nu prin interfață — aplicația are cache, vede datele noi abia după refresh). La final, `get_config_status(brandId)` ca să vezi că procentul a crescut.

## Faza F — Raport clar pentru user

- Ce a intrat: „147 produse, 132 în meniu cu preț, în 2 magazii (Bucătărie/Bar)".
- Ce ai corectat și DE CE: „21 de băuturi erau pe «materie primă» — le-am trecut pe «marfă» ca să nu apară în costuri greșit; 8 vinuri erau în «bucăți», le-am pus în «litri» ca rețetele de pahar să fie corecte".
- Ce a rămas la el în aplicație (puțin): regulile de rutare pentru taguri NOI (Setări → Imprimante), zecile de poze necunoscute (pagina Poze Bulk Meniu), eventuale rânduri cu eroare din fișier.
- Pasul următor recomandat din onboarding.

## Ce rămâne DOAR în aplicație (nu prin conexiune)

- Crearea PC-ului/dispozitivelor, regulile de rutare taguri→imprimante/KDS, designul vizual (sală, meniu fizic, portal), ștergerile de entități. Vezi harta din `00-plan-general.md`.

## Capcane specifice modului asistat prin Chrome

- **Extensia trebuie conectată** și userul **logat în Symbai** în acel browser (folosești sesiunea lui). Dacă nu e conectată, tool-urile `claude-in-chrome` nu apar → mod asistat.
- **Browserele în „computer use" sunt doar de citit** (click/scris blocate) — pentru a CONDUCE pagina folosește tool-urile `claude-in-chrome` (extensia DOM-aware), nu screenshot-uri + click pe pixeli.
- **Nu hardcoda butoane/poziții** — **citește pagina** la fiecare pas și adaptează-te; interfața de import se schimbă în timp. Cardurile/întrebările de mai sus sunt concepte stabile chiar dacă aspectul diferă.
- **Fișiere mari = parse lung** (minute, mai ales meniuri mari): nu abandona, re-citește progresul.
- **Dacă pagina REFUZĂ fișierul** (eroare „prea mare / 413", format nerecunoscut, parse eșuat): nu da vina pe user și nu te bloca. Pe rând: (1) propune să-l convertești la CSV curat sau să-l spargi în mai multe fișiere mai mici; (2) dacă tot nu merge, treci pe **Calea A directă** — creezi tu datele din fișier prin tool-uri MCP (`02-import-date.md`). Spune-i userului simplu: „Pagina nu digeră fișierul ăsta; îl iau eu direct și creez produsele prin conexiune".
- **Nu inventa** valori ca să „treacă" importul (preț, gramaj, alergen). Ce lipsește real → întreabă userul o singură dată, compact.
- **Sesiunile wizard-ului nu se citesc/avansează prin conexiune** — bara lui de progres n-o bifezi tu; progresul real e `get_config_status`.
