---
name: importa-date
description: Importă datele clientului din fișiere Excel/CSV (produse, meniu, stoc, furnizori) corect și simplu, MCP-first când tool-urile de import fișier există (`create_bulk_import_session_from_file`, `import_bulk_session`, `import_supplier_catalog_from_file`) și cu pagina de import/Chrome pentru fișiere mari, PDF/poze sau verificări vizuale. Răspunzi la întrebările importului — magazie, tip produs, TVA, meniu — apoi verifici și CORECTEZI prin conexiune ce a ieșit strâmb (tipuri de produs, magazii, categorii). Dacă lipsesc date (prețuri, descrieri, poze, categorii), le poți completa — cu permisiunea userului — din website-ul propriu, din SmartMenu (API) sau alt meniu online, și poți construi un fișier curat pe care îl imporți. Folosește la „importă-mi datele din vechiul program", „am niște fișiere Excel cu produsele/meniul", „încarcă produsele din fișierul ăsta", „ajută-mă cu importul de date", „umple aplicația cu lista mea de produse", „mută-mă de pe alt POS" — în onboarding sau oricând după. Pentru un meniu de pe website/PDF/poze (fără stocuri/furnizori), e mai potrivit skill-ul `adauga-produs-reteta`.
---

# Importă datele din fișiere — conexiune MCP + pagina de import

Userul are fișiere (Excel/CSV exportate din vechiul sistem) și vrea datele în Symbai, corect, fără bătaie de cap. Tu faci toată munca și îi explici la fiecare pas — **cel mai important e să-i fie clar ce se întâmplă**.

**De ce combinația, nu doar una:** când tool-urile de import de fișier sunt disponibile în sesiune, poți încărca Excel/CSV direct prin MCP (fără browser) și păstrezi aceeași sesiune de întrebări/import ca pagina. Pentru fișiere mari, PDF/poze, upload vizual sau cazuri unde tool-urile lipsesc, pagina de import rămâne plasa de siguranță pe encoding, numere românești și formate murdare. În ambele cazuri, tu răspunzi mai bine la întrebările de mapare și corectezi după prin conexiunea MCP. Userul primește o experiență simplă, cu date corecte.

La importuri mari sau murdare, citește și `knowledge/agent-operare-avansata.md`: tratează importul ca proiect de date cu citire, normalizare, verificare, corecții și raport de dovadă.

**`importa-date` vs `adauga-produs-reteta` — care skill:**
- **`importa-date`** (ăsta): userul **ARE fișiere** (Excel/CSV, export din vechiul POS) pe calculator și vrea date în masă (produse + stoc + furnizori + meniu) → import + verificare; poți și completa golurile din surse online.
- **`adauga-produs-reteta`**: userul **N-are fișiere** — vrea un meniu de pe website/PDF sau să adauge câteva produse/rețete.
- La dubiu: dacă există fișiere, folosește `importa-date` (e mai bun pentru muncă în masă).

**Citirea fișierelor locale**: poți citi direct fișierele de pe calculatorul userului (Excel/CSV/PDF) ca să înțelegi ce importați — fără să le urci nicăieri și fără să le modifici; doar le citești local. Spune-i userului asta când e relevant, ca să fie liniștit.

## Înainte de orice

1. Citește playbook-ul: **`knowledge/onboarding/02b-import-asistat.md`** (orchestrarea + modurile + cele 6 faze + strategia inteligentă). Apoi, după caz: **`02c-import-sabloane-canonice.md`** (cum construiești fișierul perfect care importă determinist + pre-crearea referințelor prin MCP + catalogul de capcane) și **`02d-import-surse-externe.md`** (cum completezi datele lipsă din website/SmartMenu/marketplace/PDF, cu permisiune). Plus `02-import-date.md` (tool-uri MCP exacte, termeni produs≠articol≠rețetă) și „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`.
2. Verifică **conexiunea MCP** (`list_brands`). Dacă tool-urile `symbai` lipsesc → skill-ul `conecteaza-symbai` întâi.
3. Stabilește **modul** și spune-i userului în care ești, natural — ex.: „Pot importa fișierul direct prin conexiune dacă e Excel/CSV mic, sau pot deschide pagina de import când e nevoie de browser/upload vizual. Oricum, eu verific și corectez după." După alegere, confirmă modul și că, dacă ceva nu merge, te anunță.
   - **Conexiune MCP** — preferat pentru fișiere Excel/CSV de dimensiuni obișnuite (până în câțiva MB; la fișiere prea mari tool-ul refuză clar și treci pe pagina de import): `create_bulk_import_session_from_file` → întrebări → `import_bulk_session`.
   - **Automat în browser** — extensia Chrome conectată + user logat în Symbai → TU conduci pagina (încarci, răspunzi la întrebări, apeși Importă).
   - **Asistat** — fără extensie → tu decizi tot și îi spui userului exact ce să încarce și ce să răspundă; **el dă click-urile, tu faci decizia + verificarea**.
   - În TOATE modurile, **verificarea și corecția prin conexiune (Faza E) le faci TU** — merg prin MCP, fără pagină.

## Bucla de lucru

1. **Spune planul în 3-4 fraze**: „Îți import fișierul prin conexiune (sau prin pagina de import dacă e nevoie de browser), răspund eu la întrebările ei: magazie, tip de produs, TVA, meniu, pornesc importul și după verific tot prin conexiune și corectez ce a ieșit greșit. O să te întreb câteva lucruri pe parcurs și îți arăt un rezumat înainte de import."
2. **Pregătește datele inteligent ÎNAINTE de import** (Faza A2 — aici e valoarea ta): dacă lipsesc date, **completează-le din surse externe cu permisiunea userului** (`02d`: website/SmartMenu/marketplace/PDF); dacă fișierul e murdar/mare/din mai multe surse, **construiește un fișier canonic** (`02c`: anteturi exacte + valori normalizate) și **pre-creează referințele prin MCP** (gestiuni, categorii, tipuri, furnizori). Așa maparea iese corectă din prima și importul cere mult mai puține întrebări (nu zero garantat — AI-ul de mapare tot rulează, dar doar confirmă). Fișier mic și curat → sari direct la pas 3.
3. **Importă** (fazele B–D din `02b`): prin MCP folosești `create_bulk_import_session_from_file`, citești întrebările, răspunzi, apoi `import_bulk_session`; prin browser lași pagina să parseze. La orice întrebare rămasă — răspunzi TU din contextul tău; o frază pentru user la deciziile ne-evidente, strânse într-o rundă.
4. **Verifică & corectează prin MCP** (Faza E) — vânează punctele unde importul greșește (tip produs, magazie, TVA, unități, categorii) și repară cu `bulk_update_products` / `auto_assign_vat_batch` / `bulk_create_menu_categories` sau `create_menu_category` + `update_menu_item` / `set_product_image`. Confirmi prin citire, nu prin interfață.
5. **Raport clar**: ce a intrat, ce ai completat din ce sursă, ce ai corectat și DE CE (în limbaj de restaurant), ce a rămas la el în aplicație.

## Reguli (cele care contează)

- **Claritate peste tot**: explică scurt CE faci și DE CE la fiecare pas; arată rezumatul înainte de import; spune-i în ce mod ești (tu conduci / el dă click). Userul nu e programator — zero jargon („magazie/depozit", „lista de produse", „meniul cu prețuri", nu „warehouse/bulk/endpoint").
- **Importul parsează, tu decizi.** Pentru Excel/CSV mic folosește motorul prin MCP; pentru fișiere mari/murdare sau upload vizual folosește pagina. Citești fișierul local doar pentru judecată (vânzare vs achiziție, ce magazie, ce tip), nu ca să ocolești întrebările importului.
- **Mută inteligența ÎNAINTE de import.** Când merită, construiește un fișier canonic (anteturi exacte + valori normalizate) și pre-creează referințele prin MCP → maparea iese corectă din prima și importul cere mult mai puține întrebări (`02c`). E mai bine decât să corectezi după.
- **Enrichment doar cu permisiune + zero invenție.** Pe surse externe (website/SmartMenu/marketplace) intri DOAR dacă userul aprobă; arăți ce-ai găsit și de unde; nu inventezi preț/gramaj/alergen (descrieri goale poți genera ca șablon, restul vine din surse reale) — `02d`.
- **Nu inventa** prețuri/gramaje/alergeni. Ce lipsește real → întrebi o dată, compact.
- **Chrome doar când ajută real.** Pentru Excel/CSV mic, preferă tool-urile MCP. Condu pagina cu extensia Chrome doar pentru fișiere peste limită, PDF/poze, flow-uri vizuale sau dovadă în UI; citește pagina la fiecare pas — nu hardcoda butoane și nu da click pe pixeli.
- **TVA România = 0 / 11 / 21**; alcool mereu 21. Prețul de vânzare trăiește DOAR în meniu.
- **Magazia: nimerește-o la întrebare.** Se POATE corecta și după (`bulk_update_products`/`update_product` acceptă magazia), dar pe produse cu stoc mișcarea creează transfer contabil — deci cere aprobarea userului. Tipul/TVA/unitatea/categoria se corectează liniștit oricând.
- **Permisiune insuficientă** pe un tool = modulul (`produse_meniu`, eventual `furnizori`) nu e bifat pe token → portal Hub → Acces AI; explică blând, se aplică în ~1 min.

## Legături

- **Configurare client nou cap-coadă** (firmă→produse→echipamente→…) → skill-ul `onboarding-symbai`; importul de date e faza 02, care folosește exact acest skill.
- **Import meniu de pe website / PDF / poze** (nu Excel) → skill-ul `adauga-produs-reteta` (descoperă și stilul clientului: taguri, marfă vs materie primă la băuturi).
- **Rețete și angajați** nu se importă aici — au fazele lor (09 rețete, 07 personal).
- **Te-a blocat o limitare a importului** (format pe care pagina nu-l vrea, o decizie pe care n-o poți seta) → `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`) și continuă pe o cale alternativă (calea directă MCP din `02-import-date.md`).
