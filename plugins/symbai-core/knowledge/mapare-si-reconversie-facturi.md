# Mapare și reconversie — cum devine o linie de factură stoc corect

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

Acest fișier completează `intrari-marfa-receptie.md` (fluxul complet al recepției), `reconciliere-dubluri-facturi.md` (aceeași factură venită de două ori), `stocuri-inventar-furnizori.md` (privirea de ansamblu) și `finante-facturare-contabilitate.md` (conturi și note contabile). Aici intrăm doar în ce se întâmplă **pe o linie de factură**: la ce produs se leagă, pe ce cont, cu ce factor de pachet și ce ține minte sistemul după aceea.

## Pe scurt

Denumirile furnizorului („BX COCA COLA 0.5 X 12") devin produsele tale în această ordine: **codul de bare / codul de articol al furnizorului → ce ai decis tu data trecută → ce ai mai primit de la furnizorul ăsta → abia apoi asistentul AI.** Tu confirmi, sistemul învață. Confirmarea memorează trei lucruri deodată: **produsul**, **contul** și **factorul de pachet**. De aceea o confirmare bună îți economisește ore la facturile următoare — și una greșită se propagă la fel de repede.

## Concepte

- **Mapare** — legarea unei linii de factură (denumirea furnizorului) de un **produs din catalogul tău** + un **cont**. Fără mapare acceptată nu se poate face NIR, deci marfa nu intră pe stoc.
- **Confirmare (acceptare)** — pasul prin care îi spui sistemului „da, asta e". Doar liniile acceptate intră în NIR și doar ele se învață.
- **Încredere** — cât de sigură e propunerea, de la „am mai primit exact asta de la el" până la „seamănă la nume". Propunerile slabe rămân marcate „de verificat" și nu se aplică singure.
- **Regulă de mapare** — memoria sistemului pentru o pereche furnizor + descriere. Trăiește în **Reguli de Mapare** (`/inventory/mapping-rules`) și se poate edita sau șterge.
- **Factor de pachet (reconversie)** — de câte ori se desface unitatea furnizorului în unitatea ta de stoc (1 bax = 24 bucăți).
- **Cifrele originale ale furnizorului** — cantitatea, unitatea și prețul așa cum apar pe document. Se păstrează separat, ca dovadă, și nu se modifică niciodată prin reconversie.
- **Produs propus** — un produs pe care asistentul îl sugerează pentru că nu l-a găsit în catalog. E o propunere, nu un produs creat.
- **Cont de pe linie** vs **cont din notă** — două lucruri diferite la marfa care intră pe stoc; vezi capitolul dedicat.

## Paginile modulului

- **Intrări Marfă** (`/stock-entries`) — maparea liniilor pe fiecare factură în parte, plus spargerea, absorbția, împărțirea pe gestiuni și crearea NIR-ului.
- **Revizuire Mapări AI** (`/inventory/ai-review`) — toate liniile din facturile fără recepție într-un singur ecran, pentru verificare și aprobare centralizată.
- **Reguli de Mapare** (`/inventory/mapping-rules`) — memoria sistemului: reguli specifice unui furnizor, reguli generale și lista regulilor care se contrazic.
- **Calitate Inbox Facturi** (`/inventory/inbox-quality`) — igiena intrărilor: mapări cu încredere mică, facturi fără recepție, conflicte de reguli.

## Ordinea în care caută sistemul

De la sigur la incert. Prima treaptă care dă rezultat câștigă; treptele de jos intră în joc doar când cele de sus n-au găsit nimic.

1. **Cod de bare** găsit pe linie sau în descriere, identic cu al unui produs din catalog — încredere maximă.
2. **Codul de articol al furnizorului** (SKU-ul lui), dacă l-ai legat o dată la un produs în catalogul furnizorului — încredere maximă.
3. **Memoria de reconversie** — aceeași descriere, de la același furnizor, cu factorul de pachet confirmat data trecută.
4. **Regula exactă a furnizorului** — descriere identică cu una pe care ai confirmat-o.
5. **Istoricul intrărilor** — produse pe care le-ai mai primit efectiv de la furnizorul ăsta, cu cuvinte comune în denumire. Cu cât ai mai multe recepții, cu atât încrederea e mai mare.
6. **Reguli aproximative** (descriere asemănătoare), apoi **reguli generale** (valabile la orice furnizor), apoi **aceeași descriere confirmată la alt furnizor** — încredere medie spre mică.
7. **Potrivire după numele produsului** din catalog și, la final, **potrivire pe cuvinte-cheie** — încredere mică, doar ca punct de plecare.
8. Dacă nimic nu se potrivește, rămâne doar o propunere de **cont**, fără produs.

Ce înseamnă asta pentru tine:

- **Încredere mare** = propunerea vine dintr-o decizie a ta sau dintr-o intrare reală. Se poate accepta în bloc, cu o privire.
- **Încredere mică** = propunerea vine din asemănare de text. Se verifică linie cu linie. Acceptarea în bloc ia doar propunerile de peste jumătate din încredere; restul rămân marcate „de verificat" și **nu se aplică singure**.
- ⚠ **Dacă marca de pe factură nu se potrivește cu marca produsului propus, propunerea se oprește automat** și linia rămâne fără produs, cu motivul scris. Nu e o eroare — e plasa care te apără de „Pepsi intrat pe stocul de Coca-Cola".
- Regulile care arată spre un produs șters din catalog sunt ignorate complet, iar produsele din tipuri care nu se cumpără nu apar niciodată ca propunere.

## Ce învață sistemul când confirmi

Când confirmi o linie, se memorează perechea **furnizor + descriere → produs + cont + factor de pachet**. Învățarea se întâmplă la confirmarea liniei și, mai ales, **la crearea NIR-ului**: toate liniile acceptate ale facturii se învață în bloc când marfa intră pe stoc. La fel și la recepția pe comandă.

Efecte imediate:

- Regula se aplică singură la **celelalte facturi nefinalizate ale aceluiași furnizor** (aceeași descriere sau același cod de articol). O confirmare bună rezolvă zeci de linii; una greșită le strică la fel de repede.
- Produsul, contul de mapare și factorul confirmate se memorează pentru **acel furnizor + descrierea normalizată**. Nu se propagă automat la alți furnizori; doar o regulă generală întreținută explicit poate fi folosită cross-furnizor.

Unde vezi și corectezi memoria: **Reguli de Mapare** (`/inventory/mapping-rules`), cu două taburi — **specifice unui furnizor** (au prioritate) și **generale** (rezervă, valabile la orice furnizor) — plus lista **regulilor care se contrazic** (aceeași descriere ducând la produse sau conturi diferite). Verific-o o dată la câteva luni; e locul unde se repară cauza, nu simptomul.

- ⚠ **Memoria se caută după descrierea de pe linie.** Dacă furnizorul schimbă denumirea articolului, se naște o regulă nouă lângă cea veche — de aici apar regulile care se contrazic. Șterge-o pe cea depășită.
- ⚠ **Regulile create prin legarea catalogului furnizorului nu au cont.** Ele produc o propunere de produs foarte sigură, dar linia nu se poate accepta până nu alegi contul o dată (sau pui tipul corect pe produs). Asta e cauza obișnuită pentru „AI-ul a mapat totul, dar nu pot accepta linia".
- ⚠ **Gestiunea implicită pusă manual pe o regulă nu e garantată** — poate fi rescrisă la următoarea recepție. Alege întotdeauna gestiunea explicit la crearea NIR-ului.

## Contul: ce se vede vs ce se înregistrează

Aceasta e distincția cea mai importantă din tot fișierul.

⚠ **Contul de pe linie ≠ contul din nota contabilă, la marfa care intră pe stoc.** Pentru o linie care intră pe stoc, nota contabilă se face **din tipul produsului** (și din eventualele conturi personalizate pe tip / pe unitate). Contul pus pe linie se vede în ecranul de mapare și în rapoarte, dar **nu schimbă nota**.

Contul de pe linie decide nota contabilă doar la **liniile de cheltuială** (servicii, utilități, transport, chirii) și la facturile pur contabile, fără intrare pe stoc.

**Exemplu.** O abonare de mentenanță ajunge mapată pe un produs marcat greșit ca marfă. Nota iese pe cont de stoc (371) în loc de cheltuială (628). Dacă schimbi doar contul pe linie, nota rămâne la fel. Corectura reală: **schimbi tipul produsului** în „serviciu" (`change_product_type` 🔒 sau din fișa produsului), apoi refaci nota din aplicație („Modificare NIR").

Și încă un motiv să repari la sursă: o regulă greșită se reaplică automat la următoarele facturi ale **aceluiași furnizor** cu aceeași descriere. Pentru marfa stocabilă, repară și tipul produsului când nota contabilă este greșită; contul de mapare al liniei nu rescrie singur contul de stoc.

## Produse pe care asistentul nu le găsește

Când asistentul nu găsește produsul în catalog, îl **propune** — nu îl creează. Linia rămâne fără produs, cu propunerea alături (nume, unitate, tip, cotă de TVA).

- Propunerile se acceptă **individual**, cu butonul de creare de pe linie.
- **Acceptarea în bloc din pagină** le poate crea, dacă procedura firmei permite adăugarea de produse noi la recepție. **Acceptarea în bloc prin conexiune le sare mereu** — rămân de rezolvat una câte una.
- ⚠ **Verifică cota de TVA înainte de a accepta.** Propunerea vine cu o cotă presetată care poate să nu fie una dintre cele valabile azi (0 / 11 / 21%).
- ⚠ **Nu te lua după numărul de „produse create" din raportul mapării AI** — el numără propunerile, nu produsele chiar create. Verifică în catalog.
- Cine are voie să creeze produse noi și cine are voie să modifice mapări se configurează în procedura firmei (Setări → Stocuri → Recepția din poză): `get_reception_policy` (citire) și `configure_reception_policy` (scriere). ⚠ Procedura e **una singură pentru toată firma**, nu se poate seta diferit pe brand sau pe locație; responsabilii de recepție trec oricum peste ea.

## Reconversia (factor de pachet) — capitol complet

**De ce există.** Furnizorul facturează în bax, navetă, ladă sau cutie. Tu ții stocul la bucată, la kilogram sau la litru. Factorul de pachet e puntea.

**Ce face.** Cantitatea se **înmulțește**, prețul unitar se **împarte**, iar **valoarea liniei rămâne exact cea din factură**. Cifrele originale ale furnizorului (cantitate, unitate, preț) se păstrează separat, ca dovadă a documentului — nu se pierd niciodată.

**Ce ghicește singur.** Cuvintele de ambalaj („bax", „navetă", „ladă", „pachet", „cutie") și abrevierile lor (BX, NV, CT, PAC), formulele din denumire („6x1L", „24 x bax", „bax/24"), ofertele („5+1", „(10+2)") și mărimile obișnuite pe categorii — navetă de bere, bax de doze, bax de apă. Îți **propune** un factor, tu îl accepți. Nu ghicește când descrierea seamănă a dimensiuni („30x40x50") sau a gramaj lipit de cifră („4x500g") — acolo tace intenționat.

⚠ **Ghicitul nu-ți suprascrie niciodată o decizie.** Odată ce ai confirmat un factor pentru o descriere, propunerea automată nu mai intervine pe ea.

**Când se oprește și te întreabă.** La unități care nu se pot traduce singure (bax → kg, cutie → bucată) sistemul se oprește și îți pune **o singură întrebare clară**: „1 bax = câte kg?". Nu e o eroare — e protecția care ține stocul corect. Fără răspuns, linia nu se acceptă.

**„Păstrez pachetul"** (nu desfac baxul, îl țin ca atare) e permis **doar dacă produsul e ținut chiar în acea unitate** de stoc. Dacă produsul e la bucată, nu poți primi baxuri fără să spui câte bucăți are.

**Cum corectezi un factor învățat greșit.** Reguli de Mapare (`/inventory/mapping-rules`) → regula furnizorului pentru acea descriere → editezi factorul și unitățile. ⚠ **Cât timp regula rămâne greșită, se reaplică la fiecare factură nouă** — nu are rost să remapezi linia la nesfârșit fără să repari regula.

**Ce număr scrii în câmpul „factor".** Scrii **numai câte bucăți are pachetul** (baxul de 5 → 5). Partea de unitate (kg→g = ×1000) o adaugă sistemul singur; nu o include tu în număr. Ecranul îți arată separat cele două lucruri: câmpul editabil („Editare reconversie ×5") ține numărul tău de bucăți, iar eticheta „Efect total ×5000 aplicat" arată traducerea completă, bucăți × unitate, așa cum ajunge pe stoc. Sub ele vezi imediat previzualizarea: ce cantitate și ce preț unitar rezultă în unitatea produsului tău. Dacă „Efect total" iese absurd (un bax care devine mii de bucăți), factorul e greșit — nu confirma linia.

⚠ **Facturile împinse din contabilitate** au identitatea înghețată: se poate schimba doar conversia de ambalaj. Când produsul e ținut în altă unitate decât cea de pe factură (kg pe factură, grame pe produs), fă reconversia **din pagină**, nu prin conexiune.

**Unde nu ajută reconversia.** Densitatea (kg ↔ litri) și greutatea nominală a bucății nu se folosesc automat la scăderea din vânzări. Dacă ai nevoie de ele, pune cantitatea reală în rețetă.

## Unități de măsură: ce se traduce singur și ce nu

- **Se traduce singur, în aceeași familie**: masă cu masă (t, kg, g, mg), volum cu volum (hl, l, dl, cl, ml), lungime cu lungime, suprafață cu suprafață. Bucățile rămân bucăți.
- **Codurile de pe e-Factură sunt recunoscute** — kilogram net, litru, cutie, bax, ladă, doză și celelalte coduri obișnuite. Nu trebuie să le traduci tu.
- ⚠ **„ml" înseamnă mililitru**, niciodată metru liniar. Pentru metri liniari folosește o unitate proprie, altfel intri într-o familie greșită.
- **Nu se traduce**: metrul cub și codurile exotice. Acolo sistemul cere explicit factorul.
- ⚠ **O linie fără unitate deloc intră 1:1, fără avertisment.** La documentele vechi sau importate, verifică unitatea pe linie înainte de a accepta.

## Operațiile pe linie

Pe lângă mapare, o linie de factură se poate lucra în patru feluri, toate **din pagină**:

- **Spargere linie** — o linie se împarte în mai multe sub-linii, pe cantități (același rând conține două produse reale, sau marfa merge în locuri diferite). Sumele se împart automat; se poate anula.
- **Absorbție linie** — costul unei linii (transport, ambalaj, taxă) se repartizează peste liniile de marfă: egal, proporțional cu valoarea, sau pe o singură linie. **Se mută doar valoarea, nu cantitatea** — așa transportul intră în costul mărfii.
- **Împărțire pe gestiuni** — o linie se poate primi în mai multe depozite (40 kg la Magazie, 60 kg la Bucătărie). ⚠ **Se stabilește doar în ecranul de recepție și se pierde dacă reîncarci pagina** — creează NIR-ul în aceeași sesiune.
- **Recepție pe loturi** — aceeași linie împărțită pe mai multe loturi de furnizor, cu termene și origini diferite (`set_reception_lot_allocations`). Detalii în `intrari-marfa-receptie.md`.

⚠ **După ce ai spart sau absorbit o linie, NIR-ul se creează doar din pagină** — `create_nir_from_invoice` refuză facturile cu linii sparte sau absorbite. Spune-i asta utilizatorului înainte să înceapă operația prin conexiune.

## Tool-uri MCP utile

**Citire:**
- `get_received_efactura_details` — antetul facturii + toate liniile cu starea mapării: produs, cont, acceptat, factorul aplicat, cantitatea și prețul originale ale furnizorului. Primul apel, mereu.
- `list_received_efactura` — facturile de intrare, filtrabile după starea mapării (`mappingStatus`), status, furnizor sau brand.
- `get_invoice_intake_decision` — verdictul complet pe o factură: e gata de NIR sau ce anume mai trebuie rezolvat (linii nemapate, conversie lipsă, locație ambiguă).
- `get_reception_policy` — procedura firmei la recepție (cine poate mapa, cine poate crea produse).
- `search_products_db`, `get_product_details`, `list_product_types`, `get_product_type_details` — ca să alegi produsul și să verifici tipul (deci contul real).
- `get_journal_entries_summary` (modul `financiar`) — ce s-a înregistrat efectiv, când suspectezi un cont greșit.
- `list_supplier_mapping_suggestions` (modul `furnizori`) — legături propuse furnizor → produs intern.

**Scriere — modulul `inventar` („Stocuri & Recepție"):**
- `map_invoice_line` — leagă o linie la produs + cont, opțional cu `packMultiplier` (numărul de bucăți din pachet) și `packKeyword` („bax", „navetă"). Contul se rezolvă din tipul produsului dacă nu-l dai.
- `accept_invoice_line_mapping` — confirmă o linie deja mapată.
- `accept_all_invoice_mappings` — acceptă în bloc propunerile sigure. ⚠ Dacă întoarce „reușit, 0 acceptate", **nu e succes** — înseamnă că liniile au nevoie de mapare individuală sau le lipsește contul.
- `auto_map_efactura` — pune asistentul AI să mapeze liniile rămase.
- `set_invoice_context` — brand/locație, gestiune, deductibilități, mod de plată.
- `set_reception_lot_allocations` — împarte linia pe loturi de furnizor.
- `create_nir_from_invoice` 🔒 — creează NIR-ul legat de factură și îl postează pe stoc.
- `change_product_type` 🔒 — repară tipul produsului (deci contul real din notă).

**Scriere — modulul `furnizori`:** `create_supplier_product_mapping`, `bulk_create_supplier_product_mapping` (max 200/apel) — legi catalogul furnizorului la produsele tale, ca următoarele facturi să se recunoască după codul de articol.

**Scriere — modulul `financiar`:** `update_product_type` — conturile unui tip de produs.

**Scriere — modulul `setari`:** `configure_reception_policy` — cine poate mapa și crea produse la recepție.

**Aceeași logică, pentru rețetar** (modulul `retete`): `create_recipe_mapping_session` → `ai_resolve_recipe_mapping` → `decide_recipe_mapping_row` / `bulk_decide_recipe_mapping_rows` → `commit_recipe_mapping_session` 🔒. Sau, dintr-un singur apel, `import_retetar` 🔒. Ce s-a învățat acolo se vede cu `list_recipe_ingredient_aliases`.

⚠ **Diferență importantă de propagare:** maparea făcută **din aplicație** se aplică automat și la liniile identice din celelalte facturi nefinalizate ale furnizorului. `map_invoice_line` prin conexiune **nu propagă** — la 30 de linii identice, mapezi 30 sau o faci din pagină cu un click. Spune-i asta utilizatorului înainte de a începe.

⚠ **Nu rula `auto_map_efactura` peste linii corectate dar neacceptate** — le reia de la zero. Acceptă întâi ce ai corectat (`accept_invoice_line_mapping`), apoi rulează asistentul pentru rest.

**Ce rămâne doar din aplicație:** editarea și ștergerea regulilor de mapare învățate și a factorilor de pachet greșiți (`/inventory/mapping-rules`); spargerea și absorbția unei linii, cu anularea lor; împărțirea unei linii pe mai multe gestiuni; crearea produsului propus de asistent (prin conexiune se sare mereu); refacerea potrivirilor pe toate facturile fără recepție deodată; reconversia pe facturile împinse din contabilitate, când unitățile diferă. Dacă una dintre ele te blochează des, cere-o cu `trimite_ticket_symbai`, tip „sugestie" — spune concret ce operație vrei prin conexiune și de câte ori pe lună o faci.

## Întrebări frecvente și capcane

- **După recepție cantitatea e de 24 de ori mai mare (sau mult prea mică).** Factorul de pachet: fie s-a aplicat unul greșit, fie lipsește. Valoarea liniei rămâne mereu cea din factură — se schimbă doar cantitatea și prețul unitar. Verifici cu `get_received_efactura_details` (cantitatea și prețul originale ale furnizorului vs cele mapate și factorul aplicat) și în Reguli de Mapare. Dacă NIR-ul **nu** e făcut, remapezi cu factorul corect (numărul de bucăți din pachet) sau fără factor; dacă NIR-ul e postat, corectezi din aplicație cu „Modificare NIR". **Obligatoriu corectează și regula învățată**, altfel se reaplică la următoarea factură.
- **Am schimbat contul pe linia de factură și nota contabilă e la fel.** Corect — vezi capitolul „Contul: ce se vede vs ce se înregistrează". La marfa care intră pe stoc, nota vine din **tipul produsului**. Repari tipul, nu linia.
- **De ce se mapează singură a doua factură de la același furnizor?** Pentru că prima a fost confirmată și sistemul a memorat perechea descriere → produs + cont + factor. Asta e comportamentul dorit. Dacă memoria e greșită, o repari o singură dată în Reguli de Mapare — nu linie cu linie.
- **De ce mi-a schimbat cantitatea după ce am mapat?** Reconversia: produsul e ținut în altă unitate decât cea de pe factură. Cantitatea s-a înmulțit, prețul unitar s-a împărțit, valoarea liniei a rămas neatinsă. Verifică factorul afișat pe linie; dacă e greșit, repară-l acum, înainte de NIR.
- **AI-ul a mapat totul, dar nu pot accepta o linie.** Linia n-are cont valabil — de regulă vine dintr-o regulă născută din catalogul furnizorului, care nu poartă cont. Alege contul o dată pe linie sau pune tipul corect pe produs; după prima confirmare se învață.
- **Nu pot crea NIR-ul.** NIR-ul cere ca **toate** liniile să fie mapate și acceptate, iar produsele mapate să existe încă în catalog. Cere `get_invoice_intake_decision` pentru verdictul complet, apoi rezolvă exact ce-ți spune.
- **Linia are produsul bun, dar sistemul a refuzat propunerea.** Marca de pe factură nu se potrivea cu marca produsului. Mapează manual — refuzul e o precauție, nu o interdicție.
- **Am o factură care nu se lasă modificată.** Facturile împinse din contabilitate au identitatea înghețată; se poate schimba doar conversia de ambalaj. Restul se corectează în contabilitate. Iar după crearea NIR-ului, modificările se fac din aplicație („Modificare NIR"), nu prin conexiune.
- **Am corectat o linie, am rulat din nou asistentul AI și corectura a dispărut.** Rularea din nou reia de la zero liniile **neacceptate**. Ordinea corectă: accepți întâi ce ai corectat, apoi rulezi asistentul pentru restul.
- **Aceeași descriere îmi duce marfa când la un produs, când la altul.** Ai două reguli care se contrazic (una a furnizorului și una generală, sau două ale aceluiași furnizor). Deschide lista de conflicte din Reguli de Mapare și păstrează una singură. Regula furnizorului bate întotdeauna una generală.
- **Am legat catalogul furnizorului și tot nu se mapează singur.** Recunoașterea după codul de articol funcționează dacă furnizorul chiar trimite codul pe factură. Când nu-l trimite, rămâne recunoașterea după descriere — confirmă o dată și se învață.
- **Vreau să nu mai desfac baxurile.** Se poate doar dacă ții produsul chiar în unitatea aceea (stoc în „bax"). Dacă produsul e la bucată, sistemul are nevoie de numărul de bucăți din pachet.

## Pentru acces SQL

Cu tool-urile de citire ale bazei de date (`list_database_tables`, `describe_database_table`, `execute_sql_query` — doar SELECT) poți răspunde la întrebări la care ecranele nu ajung. Exemple utile pe zona asta:

- ce reguli de mapare învățate arată spre același produs de la furnizori diferiți;
- ce linii de factură au factor de pachet aplicat și cât de mult au schimbat cantitatea față de document;
- ce descrieri ale unui furnizor s-au mapat în ultimele 12 luni la mai mult de un produs;
- ce produse au ajuns pe un cont care nu se potrivește cu tipul lor.

⚠ Rezultatele SQL se folosesc pentru **diagnostic și listă de corecturi**, nu ca înlocuitor al confirmării — corectura se face tot din Reguli de Mapare sau din fișa produsului, ca să fie învățată corect pentru data viitoare.
