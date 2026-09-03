---
name: gaseste-pagina
description: Du userul pe pagina dorită — afli ruta (cheat-sheet/tool), o deschizi prin extensia Chrome dacă e conectată (altfel dai link), confirmi; la ambiguitate întrebi o dată. La „du-mă la X", „deschide-mi Y", „unde văd rapoartele", „dă-mi link la setări imprimante", „treci pe locația din centru".
---

# Du userul pe pagină (rapid) — sau dă link

Când userul vrea să **ajungă** undeva sau întreabă **unde** e ceva: bucla e **află ruta → deschide → confirmă**. Nu te opri la „uite link-ul" dacă poți să-l duci tu acolo.

## 1. Află ruta — fără să-l pui pe așteptare

1. **Întâi `navigare-rapida.md`** (cheat-sheet). Cele mai cerute ~100 pagini cu URL exact. Dacă intenția e acolo → ai ruta INSTANT, fără niciun apel.
2. **Altfel → `gaseste_in_aplicatie(intrebare: "termen scurt")`.** (singurul parametru, obligatoriu, se cheamă `intrebare`; tool al serverului symbai — `mcp__symbai__gaseste_in_aplicatie`.) Citește harta LIVE a instanței lui (la zi, ține cont de permisiuni). Întoarce pagina + **link direct** + uneori pașii din meniu.
   - **Pasează un TERMEN SCURT, nu fraza lungă** a userului: „pnl", „închidere zi", „imprimante", „stoc curent". Așa răspunde instant. O frază liberă lungă îl face „să analizeze" (mai lent). Tu traduci intenția în termen; userului îi vorbești normal.
3. **Nu ghici URL-uri din memorie.** Ruta vine din cheat-sheet sau din tool.

## 2. Clar → du-l direct. Ambiguu → o întrebare scurtă ÎNTÂI

Înainte să acționezi, întreabă-te: **fraza arată UNIC o pagină?**
- **DA** (ex. „rapoarte", „stoc", „închidere zi", „mese deschise", „setări imprimante") → mergi mai departe, fără întrebări.
- **NU / ambiguu** (mai multe pagini plauzibile sau lipsește o coordonată) → pune **o singură** întrebare scurtă, NU ghici la noroc:
  - „deschide POS-ul" → care interfață: **ospătar / bar / mobil / kiosk**?
  - „comenzi" / „comenzi online" → din sală (`/pos/waiter-orders`), **livrări** Glovo/Wolt (`/channels`), sau magazin online (`/ecommerce/orders`)?
  - „vânzările" / „un raport" → raport zilnic, pe produse, P&L, plăți? (tab-uri în `/analytics`)
  - „meniul" → prețuri, afișaj digital, meniu fizic tipărit, platforme POS? (tab-uri în `/menu`)
  - client cu **mai multe locații** + cerere fără unitate → întreabă **care unitate** (vezi pasul „Schimbarea unității").
- **Dacă tool-ul întoarce mai multe potriviri (`matches`) sau o întrebare (`clarification` + `alternatives`)** → relayează userului întrebarea + cele 2-3 variante; lasă-l pe EL să aleagă. NU alege tu una arbitrar.

## 3. Deschide pagina — două căi

- **(A) Ai extensia Chrome (`claude-in-chrome`) + user logat** → **deschide TU pagina**: `navigate(link)`. Asta e „du-mă", nu „uite link". `navigate` e tool al extensiei Chrome (`mcp__Claude_in_Chrome__navigate`), NU al serverului symbai — nu-l căuta în lista de tool-uri symbai.
- **(B) Fără extensie** → dă-i **link-ul direct** (+ „din meniu: ..." dacă tool-ul a dat pașii). Merge și pe alt device.

## 4. Confirmă (când ai deschis tu)

**Întâi AȘTEAPTĂ încărcarea.** Symbai e o aplicație SPA — după `navigate()` pagina se montează în 2-4 secunde. Dacă citești/faci screenshot imediat, prinzi un overlay „Se încarcă..." (spinner) sau o pagină pe jumătate goală și raportezi greșit. Așteaptă scurt (sau re-citește/reîncarcă) și **nu confirma, nu interacționa și nu raporta cât timp vezi „Se încarcă..."**. La fel pentru click/tastare în pagină (ex. căsuța de căutare): se înregistrează doar după ce pagina e gata.

După ce s-a încărcat, **citește pagina** (`read_page` / `get_page_text` — tot tool-uri ale extensiei Chrome, `mcp__Claude_in_Chrome__*`, NU ale serverului symbai; nu screenshot doar pentru asta) și verifică ruta:
- corespunde → „Te-am dus pe **X**, vezi pe ecran...".
- pagină goală / a sărit pe login sau altă rută → **nu raporta succes orb**: „Pagina X pare ascunsă pentru rolul/contul tău sau modulul nu e activ".
- **`/` poate redirecta** pe pagina de start a contului (des `/operations`), în funcție de rol — nu e bug.

## Schimbarea unității (locație / brand) — NU e o pagină

„Treci pe locația din centru / vezi datele de la cealaltă locație / schimbă pe brandul X" = comutarea **unității active** (stare de browser, afectează tot). **Nu o căuta cu `gaseste_in_aplicatie`** și nu se face prin MCP. Rețeta completă (id-uri din `list_brands`/`list_locations` → dropdown prin Chrome, recomandat, sau URL `?unit=brandId-locationId`) e în `knowledge/navigare.md`, secțiunea „Schimbarea unității active".

## Exemple

- „du-mă la rapoarte" → cheat-sheet → `/analytics` → (Chrome) `navigate`, confirmi „te-am dus pe Rapoarte".
- „unde schimb prețul la un produs?" → cheat-sheet `/menu?tab=pricing` → deschizi / dai link.
- „deschide-mi setările de imprimantă" → `gaseste_in_aplicatie(intrebare: "imprimante")` → `/settings?tab=printers` → deschizi.
- „comenzile" (client cu livrări) → întrebi „din sală sau livrările din apps?" → apoi deschizi pagina aleasă.

## Reguli

- Ruta vine MEREU din cheat-sheet/tool, niciodată inventată; clar → direct, ambiguu → o întrebare întâi.
- **Cheat-sheet-ul NU e exhaustiv** — acoperă paginile cele mai cerute. Aplicația are mult mai multe pagini. Dacă o cerere nu e în cheat-sheet, **`gaseste_in_aplicatie` rămâne sursa autoritativă** (cunoaște ~toate paginile). NU conchide „pagina nu există" doar pentru că lipsește din `navigare-rapida.md` — întreabă tool-ul.
- Link-ul rămâne fallback util chiar dacă deschizi tu pagina.
- Dacă tool-ul nu găsește nimic, întreabă ce vrea să **facă** acolo (intenția) și reîncearcă cu alt termen; dacă tot nu apare, ține de permisiuni/modul (vezi `00-overview.md`).
- Pentru „ce face pagina asta / ce înseamnă", după ce ajungi acolo, completează din `knowledge/` (modulul potrivit; harta exhaustivă în `harta-aplicatiei.md`).
- Nu cere niciodată parole — login-ul în Symbai îl face userul în browserul lui.
