# Cum conduci Chrome în Symbai (playbook general)

> Doctrina reutilizabilă pentru ORICE flux în care „faci ceva" în aplicație: meniu fizic, prezentări, import de date, conectare Meta, configurare, navigare, completarea unui formular care n-are tool. Skill-urile punctuale (`meniu-fizic`, `construieste-prezentare`, `importa-date`, `conecteaza-meta`) o presupun — aici e regula scoasă în comun, ca s-o aplici la fel peste tot.

Ai două brațe: **conexiunea (tool-uri MCP `symbai`)** care citește/scrie date direct, și **extensia Chrome (`claude-in-chrome`)** care deschide pagini și se uită la ele cu ochii tăi. Regula de aur: **munca se face prin MCP; Chrome e pentru a NAVIGA și a ARĂTA, nu pentru a „lucra cu mouse-ul".** Un click pe pixeli e ultima soluție, nu prima.

## Arborele de decizie (de fiecare dată, în această ordine)

```
Vreau să fac / schimb ceva
│
├─ 1. Există un tool MCP care face exact asta?
│     DA → folosește-l. (citește/scrie direct, fără browser). Apoi ARATĂ rezultatul (pasul 3).
│     NU ↓
│
├─ 2. E o NAVIGARE (să ajung pe o pagină / un tab)?
│     DA → deep-link stabil prin `navigate(url)` — inclusiv `?tab=…`, NU click prin meniu.
│     NU ↓
│
└─ 3. E un buton/dialog care chiar N-are API (drag, „Aplică tema", upload în pagină, wizard)?
      DA → abia ACUM Chrome activ: `read_page`/snapshot → găsește elementul după
            `find`/`data-testid`/text accesibil → click pe ELEMENT (nu pe pixeli).
      Apoi confirmă prin RE-CITIRE (MCP), nu prin ce „pare" pe ecran.
```

Pe scurt: **tool MCP? → deep-link? → click (pe element, nu pe pixel)?** — în această ordine. Cobori o treaptă doar când cea de sus chiar nu acoperă cazul.

## Regulile (de ce, nu doar ce)

### a) Munca prin MCP ÎNTÂI
Înainte de a deschide browserul, întreabă-te „pot face asta cu un tool?". Aproape tot ce înseamnă DATE (produse, prețuri, rezervări, stocuri, personal, design-ul meniului fizic, taguri) are tool MCP — e mai rapid, deterministic, nu depinde de DOM-ul paginii și nu strică nimic prin click greșit. Chrome rămâne pentru ce MCP nu poate: să VEZI cum arată și să apeși butoane care n-au API. Nu reproduce prin click ceva ce un tool face dintr-un apel.

### b) Navighează prin deep-link stabil, NU prin click pe tab-uri
Mergi direct la URL cu `navigate(url)`. Multe pagini Symbai au tab-uri interne adresabile cu **`?tab=…`** (ex. `/menu?tab=…`, `/analytics?tab=…`, `/staff?tab=…`, `/settings?tab=…`) — du-te direct la tab, nu intra pe pagină și apoi cauți tab-ul cu mouse-ul. Ruta vine din `navigare-rapida.md` sau `gaseste_in_aplicatie(termen scurt)` — **NU inventa URL-uri**. Clickurile prin meniu sunt fragile (se mută, se redenumesc); un URL e stabil.

### c) Screenshot-ul e LIVRABILUL pentru user — arată rezultatul
Userul nu vede conexiunea ta. După ce ai făcut o schimbare (mai ales una vizuală — meniu fizic, prezentare, design), **deschide pagina și fă-i screenshot ca să-i arăți** „uite cum arată acum". Asta e dovada pentru EL. La fluxuri vizuale, screenshot-ul e și ochiul TĂU de grafician (judeci ce să mai ajustezi) — bucla: screenshot → judeci → editezi prin MCP → refresh → screenshot. Pentru a VERIFICA tu corectitudinea folosește citirea (regula f), dar pentru a CONVINGE userul, arată-i imaginea.

### d) Click doar când dialogul chiar n-are API — și atunci pe ELEMENT, nu pe pixeli
Dacă un buton/dialog nu are tool MCP (drag de produse între pagini, „Aplică tema", „Recalculează", un wizard, un upload în pagină), abia atunci folosești Chrome activ. Dar:
- **citește pagina întâi** (`read_page`/snapshot) — nu hardcoda poziții;
- **găsește elementul** după `find` / `data-testid` / textul accesibil (ex. butonul cu „Aplică tema", selectorul `data-testid="select-global-unit"`), NU după coordonate de pixeli;
- click pe element. Pixelii se schimbă la alt zoom/altă rezoluție/alt layout — un selector semantic nu.

### e) Reîncărcarea RESETEAZĂ starea pe paginile cu tab-uri — re-navighează, re-citește, nu presupune
Symbai e SPA. Multe pagini cu tab-uri și selecții (meniu fizic cu cele 3 dropdown-uri, designerul de prezentări, paginile cu `?tab=`) **își pierd starea la refresh** sau revin pe tab-ul/selecția implicită. Reguli:
- după un `refresh`/`navigate`, **lasă 2-4 secunde** să se monteze (SPA) — nu citi/click cât vezi „Se încarcă…";
- **re-citește** ce selecție e activă (ce brand/meniu/design/tab) ÎNAINTE de a acționa — nu presupune că a rămas unde ai lăsat-o;
- dacă starea e ținută în URL (`?tab=`, `?unit=`), re-navighează cu parametrul; dacă e ținută în localStorage/dropdown (ex. brand+meniu+design la meniul fizic), re-verifică dropdown-urile (vezi regula g).

### f) Confirmă-prin-citire (MCP) — niciodată „pare bine pe ecran"
După orice scriere, **verifică re-interogând prin tool-ul MCP corespunzător**, nu prin screenshot. Un pixel care „arată ok" nu dovedește că datele s-au salvat (cache de browser, render parțial). Tool-ul MCP a întors `success` = e salvat în baza de date → confirmă-l cu citirea (`get_*`/`list_*`) și spune userului să dea refresh dacă nu vede. Screenshot-ul e pentru a ARĂTA (d), citirea e pentru a VERIFICA. Nu raporta succes pe baza unei poze, și nu repeta scrierea dacă tool-ul a zis deja `success`.

### g) Capcana unității active (brand + locație)
Unitatea activă (perechea **brand + locație**) filtrează TOT ce vezi în aplicație și **e o stare a browserului**, NU o pagină și NU se schimbă prin MCP. Înainte să citești/arăți ceva pe ecran, asigură-te că ești pe unitatea corectă:
- comutare sigură: dropdown-ul `data-testid="select-global-unit"` (click), care fixează alegerea;
- rapid: URL `?unit=brandId-locationId` — ⚠ dar preferința salvată în cont poate suprascrie parametrul la încărcare („sare înapoi" pe unitatea veche); dacă se întâmplă, folosește dropdown-ul.
- La fluxuri ca meniul fizic există ȘI selecții proprii în pagină (brand → meniu → design) — alea sunt dropdown-uri separate, verifică-le în ordine (vezi `meniu-fizic-design.md`). Rețeta completă de comutare: `navigare.md`.

### h) Fallback când extensia Chrome NU e conectată — editezi „pe orb", dar spune-i
Dacă `claude-in-chrome` nu e disponibilă (extensia nu e instalată/conectată sau userul nu e logat):
- **poți tot face munca prin MCP** — scrii/citești datele normal, conexiunea nu depinde de Chrome;
- DAR **nu poți ARĂTA** rezultatul și nici nu te poți uita cu ochii tăi la pagini (la fluxuri vizuale judecata de grafician e oarbă). Spune-i userului clar: „Am făcut schimbarea prin conexiune, dar nu ți-o pot arăta pe ecran fără extensia Chrome — dă refresh la pagina X ca s-o vezi" + dă-i link-ul direct;
- pentru navigare pură fără extensie → dă link-ul (regula din `navigare.md`, modul B). Oferă-i să conecteze extensia dacă fluxul chiar are nevoie de vedere (ex. meniu fizic, prezentări).

## Legături
- Navigare (cele 3 pașii: află ruta → deschide → confirmă) + comutarea unității → `navigare.md`; cheat-sheet rute → `navigare-rapida.md`.
- Aplicarea concretă pe meniul fizic (cele 14 tool-uri + cele 3 dropdown-uri + bucla de vision) → skill-ul `meniu-fizic` + `meniu-fizic-design.md`.
- Aplicarea pe import (pagina parsează, tu decizi) → skill-ul `importa-date`; pe prezentări → skill-ul `construieste-prezentare`; pe conectare Meta → skill-ul `conecteaza-meta`.
