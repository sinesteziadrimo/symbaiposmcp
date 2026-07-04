# Navigare în Symbai — du userul pe pagină, rapid

Scop: când userul zice „du-mă la X / unde e Y / vreau să văd Z", el să ajungă ACOLO repede — nu să primească doar un link pe care să dea click. Ai trei lucruri de făcut, în ordine: **(1) află ruta**, **(2) deschide pagina**, **(3) confirmă**.

## 1. Află ruta — întâi din cap, apoi din tool

- **Întâi cheat-sheet-ul `navigare-rapida.md`** — cele mai cerute ~100 de pagini cu URL-ul exact. Dacă intenția userului e acolo, ai ruta INSTANT, fără niciun apel. Asta elimină așteptarea.
- **Dacă NU e în cheat-sheet, sau e o pagină rară / un tab anume** → `gaseste_in_aplicatie(termen scurt)`. Întoarce pagina + **link direct** + (uneori) pașii din meniu. E mereu la zi și ține cont de permisiuni/module.
- **Trimite tool-ului un TERMEN SCURT, nu fraza lungă a userului.** „pnl" / „închidere zi" / „stoc curent" nimeresc instant pagina (potrivire exactă). O frază liberă lungă („vreau să văd cât profit mi-a rămas luna asta după toate") îl pune pe gânduri și răspunde mai încet. Tu traduci intenția în termenul scurt; userului îi vorbești normal.
- **NU ghici și NU inventa URL-uri.** Ruta vine din cheat-sheet sau din tool. Restul aplicației (`harta-aplicatiei.md`) e pentru EXPLICAȚII despre ce face o pagină, nu prima cale pentru „du-mă la X".

## 2. Deschide pagina — două moduri

Alege calea disponibilă (la fel ca la celelalte fluxuri din Chrome — meniu fizic, prezentări, conectare Meta):

- **(A) Ai extensia Chrome (`claude-in-chrome`) conectată și userul e logat în Symbai** → **deschide TU pagina**: `navigate(link)`. Asta înseamnă „du-mă", nu „uite link". Apoi treci la pasul 3 (confirmă).
- **(B) Fără extensie** → dă-i **link-ul direct** (poate da click; merge și pe alt device). Spune-i scurt și „din meniu: ...", dacă tool-ul a întors pașii.

Link-ul rămâne mereu util ca rezervă — chiar dacă deschizi tu pagina, e bine să-l ai la îndemână.

## 3. Confirmă (când ai deschis tu pagina)

**Întâi lasă pagina să se încarce.** Symbai e SPA — după `navigate()` durează 2-4 secunde până se montează. Dacă citești/dai screenshot/interacționezi imediat, prinzi overlay-ul „Se încarcă..." sau o pagină pe jumătate goală și raportezi greșit. Așteaptă scurt sau re-citește; **nu confirma și nu acționa cât timp vezi „Se încarcă..."** (inclusiv click/tastare în câmpuri — se înregistrează abia după ce pagina e gata). Ruta `/` poate redirecta pe pagina de start a contului (des `/operations`) — nu e bug.

După ce s-a încărcat, **citește pagina** (`read_page` / `get_page_text` — NU pixeli/screenshot doar pentru asta) și verifică că s-a încărcat ruta cerută:
- dacă titlul/conținutul corespunde → „Te-am dus pe **X**, vezi pe ecran...".
- dacă pagina e goală sau a sărit pe altă rută (login/permisiuni) → **NU raporta succes orb**. Spune-i: „Pagina X pare ascunsă pentru rolul/contul tău (sau modulul nu e activ)" — vezi `00-overview.md` despre vizibilitate.

## Clar vs ambiguu — du-l direct SAU întreabă o dată

- **Fraza identifică UNIC o pagină** („rapoarte", „stoc", „închidere zi", „mese deschise") → du-l direct, fără întrebări.
- **Fraza e ambiguă** (mai multe pagini plauzibile, sau lipsește o coordonată) → pune **o singură** întrebare scurtă ÎNAINTE, nu ghici la noroc:
  - „deschide POS-ul" → care interfață: **ospătar, bar, mobil sau kiosk**? (vezi cele 5 variante /pos/*)
  - „comenzi" / „comenzi online" → comenzile din sală (`/pos/waiter-orders`) sau **livrările** din Glovo/Wolt (`/channels`) sau magazinul online (`/ecommerce/orders`)?
  - „vânzările" / „un raport" → ce vrei exact: raportul zilnic, vânzări pe produse, P&L, plăți? (sunt tab-uri diferite în `/analytics`)
  - „meniul" → prețuri, afișaj digital, meniu fizic tipărit sau platforme POS? (tab-uri în `/menu`)
- **Dacă tool-ul întoarce mai multe potriviri apropiate (`matches`) sau o întrebare de clarificare (`clarification` + `alternatives`)** → relayează userului întrebarea + cele 2-3 variante și lasă-l pe EL să aleagă. NU alege tu una la întâmplare.

Claritatea = viteză + corectitudine: o întrebare de o secundă bate un link greșit.

## Schimbarea unității active (locație / brand) — NU e o pagină

Unitatea activă (perechea **brand + locație**, ex. „Restaurantul Exemplu — Sala Principală") e o **stare a browserului** care filtrează TOT ce vezi (vânzări, stocuri, rapoarte, rezervări, personal) — pe TOATE paginile, nu doar pe /staff. **NU se schimbă prin conexiune (MCP)** și **NU e o rută** — deci nu o căuta cu `gaseste_in_aplicatie`.

Când userul zice „treci pe locația din centru / vezi datele de la cealaltă locație / schimbă pe brandul X / vreau pe pizzeria din Mall":

1. **Află id-urile**: `list_brands` → brandId-ul țintă; `list_locations` → locationId-ul țintă. (Dacă userul nu spune clar care unitate și are mai multe, întreabă-l ÎNTÂI care — oferă-i lista.)
2. **Comută** — în ordinea fiabilității:
   - **(recomandat) Dropdown-ul de unitate prin Chrome.** În capul paginii (bara laterală, sus) e selectorul „Brand — Locație" (`data-testid="select-global-unit"`). Cu extensia: `read_page`/snapshot ca să-l găsești → click pe el → click pe perechea brand+locație dorită. Asta fixează alegerea ferm (o salvează ca preferință) și e cea mai sigură metodă.
   - **(rapid) URL cu `?unit=brandId-locationId`.** Deschizi prin Chrome pagina curentă (sau orice rută) cu parametrul, ex. `…/analytics?unit=5-10`. ⚠ **Gotcha**: la încărcare, preferința salvată în cont poate suprascrie parametrul din URL dacă userul n-a mai apăsat nimic — dacă pagina „sare înapoi" pe unitatea veche, NU e bug: folosește dropdown-ul (click), care fixează alegerea.
3. Distinge: **`/settings?tab=brands`** = administrarea locațiilor/brandurilor (creezi/editezi unități) — **NU** e comutarea unității curente.

Notă: un link pe care i-l dai userului deschide pagina pe **unitatea curentă** din browserul lui. Dacă vrea altă unitate, comută întâi (mai sus).

## Orientare generală (cum e organizată aplicația)

- Meniul e grupat pe zone: Operațiuni (dashboard, control operațional, POS), Vânzări/Comenzi, Meniu & Produse, Stocuri & Furnizori, Producție, Rezervări & Evenimente, Personal, Rapoarte, Finanțe, Marketing & Website, Setări.
- Multe pagini au **tab-uri** interne (ex. /menu, /analytics, /finance, /staff, /inventory) — tool-ul și cheat-sheet-ul întorc tab-ul corect (`?tab=…`).
- Există și o căsuță „Caută pagina..." în bara laterală a aplicației (`data-testid="input-nav-search"`). E un ajutor de ultimă instanță, NU prima cale: indexul ei e parțial și amestecă pași din ghidul de onboarding (ex. „imprimante" întoarce „8. Imprimante & KDS", nu pagina reală de setări). Pentru navigare folosește `navigare-rapida.md` + `gaseste_in_aplicatie`, nu căsuța asta.
- Butonul flotant **Sym** (dreapta-jos) e asistentul AI din aplicație — diferit de tine (tu ești prin Claude Code), funcții similare.
- Dacă o pagină pe care o aștepți nu apare deloc: fie modulul nu e activ în abonament, fie rolul userului nu are permisiunea (vezi `00-overview.md`). Nu insista pe o rută pe care tool-ul nu o întoarce.
