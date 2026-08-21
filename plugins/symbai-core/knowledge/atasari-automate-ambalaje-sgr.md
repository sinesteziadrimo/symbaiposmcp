# Atașări automate: ambalaje, garanție SGR și consumabile

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă regulile care adaugă **singure** o linie pe notă. Pentru modificatorii pe care îi alege ospătarul (extra brânză, fără gheață) vezi `modificatori-optiuni-produs.md`; pentru cum se scade marfa din gestiuni vezi `consum-zilnic-cost-marfa.md`.

## Pe scurt

Sunt lucruri care însoțesc automat un produs: paharul la cafeaua la pachet, caseta la salată, **garanția SGR la doza de bere**. Nu vrei ca ospătarul să și le amintească de fiecare dată, și nici să le uite tocmai la comenzile de livrare, unde nimeni nu verifică.

O **regulă de atașare automată** spune: „când se vinde X, adaugă și Y, în cantitatea Z, pe canalele astea". Regula se aplică tăcut, la fiecare notă care se potrivește.

## Concepte

- **Ținta** — pe ce se aplică regula: un produs anume, o categorie, o etichetă, un tip de produs, sau tot meniul.
- **Produsul atașat** — ce se adaugă: ambalajul, garanția, consumabilul. Nu poate fi același cu produsul țintă.
- **Cantitatea pe unitate** — câte bucăți se atașează la fiecare unitate vândută. La 3 cafele cu regula „1 pahar" ies 3 pahare.
- **Mod de taxare** — `charge`: clientul plătește linia, care apare pe bon cu prețul ei. `consume_only`: nu apare ca sumă, doar se scade din stoc. Garanția SGR e `charge`; paharul de carton e de obicei `consume_only`.
- **Suprafața** — contextul vânzării: în sală, la pachet, livrare proprie, magazin online, en-gros, eveniment. O regulă poate fi activă doar pe unele.
- **Canalul de livrare** — regula poate fi restrânsă la anumite platforme (Wolt, Glovo). Unele canale nu suportă taxarea suplimentară, iar regula **degradează** acolo în loc să rupă comanda.
- **Regulă activă / inactivă** — o regulă oprită rămâne, cu istoricul ei, dar nu mai produce linii.

## Pagina modulului

**Setări → Atașări automate** (`/settings/auto-attach`) — lista regulilor, editorul și simularea.

## Prin conexiune (MCP)

Cer grantul **Produse & Meniuri** (citire și, pentru modificări, scriere).

**Ce vezi:**
- `list_auto_attach_rules` — toate regulile: ce se atașează, la ce, în ce cantitate, taxat sau nu, pe ce canale. **Răspunsul la „de ce îmi apare linia asta în plus pe bon".**
- `get_product_auto_attach_rules` — toate regulile care ating un produs, **inclusiv cele care îl prind indirect**, prin categoria, eticheta sau tipul lui. Ăsta explică mirarea „n-am pus nimic pe produsul ăsta".
- `get_auto_attach_options` — canalele reale, suprafețele și modurile de taxare. Cheam-o înainte de a crea o regulă, ca să folosești id-uri adevărate.
- `preview_auto_attach` — simulează ce s-ar atașa pe o linie, fără să creeze nimic. **Rulează asta înainte de a activa o regulă.**

**Ce poți schimba:** `create_auto_attach_rule`, `update_auto_attach_rule` (inclusiv `active:false` ca s-o oprești), `delete_auto_attach_rule` (cere `confirm:true`).

## Greșeli frecvente

- **Ștergerea în loc de dezactivare.** După ștergere nu mai poți afla de ce bonurile de luna trecută aveau linia aia. La SGR, ștergerea e o decizie fiscală: dispare exact linia pe care se face decontul cu RetuRO. Folosește `active:false`.
- **Regulă creată fără simulare.** O regulă activă schimbă tăcut fiecare bon care se potrivește. Un `quantityPerUnit` greșit se vede abia în inventar, peste o săptămână.
- **„Se pune la livrare, dar nu în sală."** Nu e bug: verifică suprafețele și canalele regulii. O regulă restrânsă la `takeaway` nu se aplică la masă.
- **`charge` fără preț.** Modul `charge` cere un preț unitar; fără el regula nu se salvează — altfel ar apărea pe bon o linie de 0 lei.
- **Un produs atașat pe sine.** Refuzat deliberat: ar produce o buclă.
- **Ambalaj șters din catalog.** Un produs folosit într-o regulă nu se poate șterge; scoate întâi regula, altfel regula ar arăta activă și n-ar produce nimic.
