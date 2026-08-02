# Tipuri de produs și conturi contabile („Conturi pe Tip Produs")

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier completează `finante-facturare-contabilitate.md` (privirea de ansamblu), `mapare-si-reconversie-facturi.md` (cum se leagă liniile de factură) și `intrari-marfa-receptie.md` (cum intră marfa). Aici tratăm DOAR: ce decide tipul de produs, cum se pun conturi diferite pe branduri sau locații fără să dublezi tipul, și cum unifici două tipuri care înseamnă același lucru.

## Pe scurt

**Tipul de produs decide nota contabilă.** Nu contul pe care îl scrii pe o linie de factură, nu codul pus pe produs — ci tipul. „Marfă" postează pe 371, „Materie primă" pe 301, „Consumabile" pe 302, „Ambalaje" pe 381, „Servicii" pe 628. De aceea:

> Dacă schimbi contul pe o linie de factură și nota contabilă iese la fel — e normal. Corectura se face pe **tip**, nu pe linie.

Pagina se cheamă **Conturi pe Tip Produs**. Are un mod **Simplu** (semafor: Gata / De completat / De verificat, cu un buton „Completează automat") și un mod **Avansat** (fiecare cont, pe fiecare moment).

## Momentele — când se aplică o regulă

Un tip de produs nu are „un cont", ci **conturi pe momente**. Momentul e documentul la care regula intră în joc:

| Moment | Când se aplică |
|---|---|
| **Intrare factură** | factura de la furnizor |
| **NIR / adaos** | suplimentul de raft la recepție (aici stau 378 și 4428, nicăieri altundeva) |
| **Consum** | fișa de consum **și** consumul din producție |
| **Producție** | intrarea din producție (produsul finit) |
| **Transfer** | mutarea între gestiuni |
| **Vânzare directă** / **prin meniu** / **prin pachet** / **prin produs finit** | canalele aceleiași vânzări |
| **Venit din bonuri** | venitul din vânzările pe casă |

⚠ **„Consum" are prioritate față de „prin produs finit".** Un tip configurat doar pe „prin produs finit" se va comporta altfel decât se așteaptă contabilul la fișa de consum. Dacă vrei un cont anume pentru ce se consumă, pune-l pe **Consum**.

⚠ **Contul de venit are o singură formă validă**: cont din clasa 70x, sensul „credit", baza „preț de vânzare fără TVA". O regulă de venit greșită **nu e sărită** — oprește emiterea facturilor de ieșire pentru **toate** produsele acelui tip. Platforma o refuză la salvare și îți spune exact ce lipsește; dacă totuși vezi „nu pot emite factura pentru produsul X", verifică întâi regula de venit a tipului lui.

## Conturi diferite pe branduri sau locații — NU dubla tipul

Cea mai frecventă greșeală: „vreau alt cont de utilități pentru brandul 2, deci îmi fac încă un tip «Utilități»". **Nu face asta.**

Motorul contabil alege **un singur** tip per cod, în mod determinist. Al doilea tip rămâne fără efect, iar brandul 2 postează în continuare pe conturile brandului 1 — fără nicio eroare, fără niciun semn. Descoperi luni mai târziu, în balanță.

**Ce se face în schimb:** tab-ul **„Pe unități"** — același tip primește conturi proprii pentru o pereche brand + locație.

Reguli de care să ții cont acolo:
- Setul pe unitate **înlocuiește complet** setul global pe momentul atins — nu completează golurile. Dacă trimiți doar contul de cheltuială, restul (TVA, furnizor) trebuie să vină odată cu el; platforma reportează automat ce lipsește și îți spune ce a reportat.
- O regulă pe unitate se aplică doar când **și brandul, și locația** sunt precizate.

## Am două tipuri care înseamnă același lucru — cum le unific

Platforma îți semnalează singură situația: în pagină apare un banner **„Ai tipuri de produs dublate"**, iar în fereastra fiecărui tip vezi și **codul intern** — singura diferență vizibilă între două tipuri cu același nume.

Pașii, în ordine:

1. **Vezi impactul înainte să ștergi.** Ceri raportul de utilizare al tipului de prisos: câte produse îl folosesc (cu exemple), câte conturi globale și câte setări pe unități se pierd, ce reguli îl referă (mapare facturi, etichete, împărțire costuri, beneficii personal) și care sunt tipurile candidate la unificare.
2. **Alegi tipul-țintă** — cel „bun", pe care lucrai deja.
3. **Ștergi tipul de prisos, indicând ținta.** Produsele **nu se șterg**: trec pe tipul ales, împreună cu regulile de mapare a facturilor și de etichete.
4. **Verifici**: produsele apar pe tipul corect, iar tipul dublat a dispărut din listă.

**Ce NU se schimbă:** facturile și notele contabile deja înregistrate păstrează codul vechi ca urmă de audit. Istoricul contabil nu se rescrie — și e corect așa: la momentul înregistrării, tipul chiar acela era.

**Ce se pierde definitiv:** conturile globale și setările pe unități ale tipului șters. Dacă erau bune, mută-le întâi pe tipul-țintă.

**Ce nu se poate șterge:**
- un **tip de sistem** — motorul contabil se bazează pe el; dacă nu-l folosești, lasă-l pur și simplu gol;
- tipul setat ca **„tipul pentru masa personalului"** în setările organizației — schimbă-l acolo întâi.

Dacă tipul are produse **sau** are reguli care îl referă, ținta de reasignare este **obligatorie**. Platforma refuză ștergerea fără ea, tocmai ca să nu rămână reguli agățate de un tip inexistent.

## Naturi de cheltuială (liniile fără marfă)

O linie de chirie, comision sau transport nu are produs. Ea primește o **natură de cheltuială** — practic un tip de produs fără gestiune, care are cont pe momentul „Intrare factură". Fără ea, linia se înregistrează contabil, dar **nu apare pe nicio categorie de P&L** (rămâne la „Nealocate").

Se configurează o singură dată, tot din Conturi pe Tip Produs. După aceea, la maparea facturii alegi natura, iar contul vine din ea.

## Prin conversație (conexiune MCP)

- **Citire**: lista tipurilor cu conturile lor; raportul de utilizare al unui tip înainte de ștergere; naturile de cheltuială disponibile; planul de conturi; starea de ansamblu a contabilității.
- **Scriere** (modulul *Financiar & Contabilitate*): creare și modificare de tip, conturi pe unități, ștergere de tip.

Cum lucrează corect asistentul:
1. Cere **întâi** raportul de utilizare și îți spune în cuvinte ce se pierde și pe ce tip trec produsele.
2. Cere **confirmarea ta explicită** — ștergerea e ireversibilă.
3. Abia apoi execută, cu tipul-țintă indicat.

Un asistent care propune ștergerea fără să-ți arate întâi impactul sare un pas — cere-i raportul.

## Întrebări frecvente

**„De ce îmi apare același tip de două ori?"** Cineva l-a creat a doua oară, probabil ca să obțină conturi diferite pe alt brand. Unifică-le (vezi mai sus) și pune conturile pe unități.

**„De ce nu se aplică contul pe care l-am pus?"** Trei cauze, în ordinea frecvenței: (1) l-ai pus pe alt moment decât cel folosit de documentul tău — ex. pe „prin produs finit" în loc de „Consum"; (2) tipul e cel dublat, deci inert; (3) ai pus o regulă pe unitate cu brandul completat, dar fără locație (sau invers) — se aplică doar când sunt ambele.

**„Am schimbat conturile, dar nota veche a rămas la fel."** Corect: notele deja generate nu se rescriu retroactiv. Pentru un document anume, refă-l din aplicație („Modificare NIR"); de acum înainte se folosesc conturile noi.

**„Nu văd butonul de ștergere."** Tipurile de sistem nu se șterg — la ele butonul nici nu apare.
