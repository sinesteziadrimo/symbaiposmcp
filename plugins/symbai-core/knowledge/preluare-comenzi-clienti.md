# Comenzi primite de la clienți — cum le citești și cum le introduci corect

O fabrică sau un distribuitor primește comenzile în tot atâtea formate câți clienți are: PDF-uri
generate din SAP, fișiere EDI transformate în PDF, comenzi tipărite din ERP-ul propriu, poze pe
WhatsApp, mesaje scrise de mână („îmi trimiți mâine 10 baxuri de ecler?"), telefoane notate în
grabă. Fiecare le numește altfel, le numără altfel și le trimite pe alt canal. Fișierul ăsta e
despre ce e la fel dedesubt și despre unde se pierd banii dacă introduci greșit.

---

## 1. Ce e de fapt o comandă de client

Indiferent de format, o comandă are exact cinci lucruri de care ai nevoie:

| Ce | Unde apare pe document | Ce se întâmplă dacă greșești |
|---|---|---|
| **Firma** care comandă | antet, „Cumpărător", „Beneficiar", CUI/CIF, GLN | comanda intră pe alt client → facturi greșite, plafon de credit greșit |
| **Punctul unde se livrează** | „Loc de livrare", „Punct livr.", „Adresa de livrare", „Depozit …" | marfa pleacă în alt oraș |
| **Data livrării** | „Termen", „Data livrare", „Dat de livrare" | producția se planifică pe altă zi |
| **Produsele** | tabelul, cu codul lui, EAN-ul, uneori codul tău | livrezi alt sortiment |
| **Cantitățile** | în baxuri, în bucăți, sau ambele | **cel mai scump**: vezi punctul 3 |

Numărul comenzii de la client (PO, „Numar Comanda", „Numr/dat CA", „Numarul") NU e decorativ:
e cheia prin care clientul recunoaște livrarea și factura, și e plasa care te apără de a introduce
aceeași comandă de două ori.

---

## 2. Cele patru formate pe care le vezi în practică

**a) Comanda tipărită din ERP-ul propriu** („Comanda de livrare", generată de sistemul vechi al
fabricii). Are codul TĂU de articol pe fiecare linie. E cea mai ușoară: codul intern duce direct
la produs.

**b) PO de retailer generat din SAP** (Mega Image, Auchan). Are codul articolului LA CLIENT
(„Cod material"), EAN-ul, uneori și codul tău („Cod Material Furnizor"), plus cantitatea în
cartoane și factorul explicit: `28 CV 28 x 8 EA` = 28 de cartoane a câte 8 bucăți. Denumirile sunt
tăiate de sistem: `ARCA FRESH ECLER CR AR VANILIE2X90G`.

**c) EDI ORDERS** (Carrefour prin DocProcess, Penny, Lidl). Are GLN-uri (pentru firmă și pentru
punctul de livrare), EAN pe fiecare linie, cantitate în bucăți ȘI număr de baxuri ȘI unități/bax,
plus prețul unitar convenit. Denumirile scriu gramajul TOTAL: `FELIE DE LAPTE X2*220G` înseamnă
2 bucăți × 110 g, nu 2 × 220 g.

**d) Comandă de aprovizionare Kaufland.** Cantitatea e în cutii (`55 KIW`, `90 KAR`) cu factorul pe
rândul următor (`a 8,00 BUC`), plus termenul minim de valabilitate cerut la livrare (MDS).

**e) WhatsApp / telefon / poză.** Fără coduri, fără EAN, adesea fără gramaj: „2 baxuri ecler
vanilie și 3 de savarină". Aici ai nevoie de context, nu de parsare.

---

## 3. Baxuri și bucăți — greșeala care costă cel mai mult

**Regula: cantitatea nu circulă niciodată fără unitate.** „10" nu înseamnă nimic; „10 baxuri" și
„10 bucăți" diferă de 6-16 ori.

Symbai ține mărimea baxului pe **produsul contractat al clientului** (nu pe produs în general:
același ecler poate merge la Kaufland în cutii de 8 și la Mega în cutii de 12). Mărimea are trei
stări, nu două:

1. **necunoscută** — nimeni nu a declarat-o. NU înseamnă 1. Orice cantitate în baxuri e refuzată.
2. **confirmată** — un om a spus „1 bax = N bucăți". Abia atunci se face conversia.
3. **fără ambalaj** — produsul se vinde doar la bucată.

Consecința practică: dacă documentul spune „28 de cartoane a 8" iar catalogul spune 12 bucăți/bax,
preluarea **se oprește** și îți arată contradicția. Nu ghicește. 28 × 8 = 224 sau 28 × 12 = 336 —
diferența e o jumătate de camion. Rezolvarea e una dintre:

- catalogul e vechi → corectezi cu `set_b2b_packaging` (o singură dată, rămâne pentru totdeauna);
- documentul e vechi → confirmi cu clientul și introduci cantitatea în **bucăți**.

Factorul scris pe document nu suprascrie niciodată automat factorul confirmat în catalog. Un
document poate fi generat de un sistem care nu a fost actualizat; catalogul e ce ați convenit.

---

## 4. Cum recunoaște Symbai produsul

Ordinea e de la dovada tare la deducere, și e deliberată:

1. **Ce ai confirmat înainte** — codurile și denumirile clientului învățate din comenzile trecute.
   După prima comandă introdusă, `7727888` duce direct la amandină, fără nicio interpretare.
2. **Codul clientului din catalog** (`clientSku`) și **GTIN-ul** contractat.
3. **Codul de bare / codul tău intern**, când clientul îl scrie pe document.
4. **Denumirea**, comparată după ce ambele texte sunt aduse la aceeași formă: prescurtările se
   desfac (`CR AR` → `CREMA AROMA`), diacriticele cad, iar gramajul se normalizează —
   `2*90 GR`, `2X90G`, `X2 180G` și `180G` ajung toate la aceeași greutate totală.

O potrivire pe denumire e acceptată automat doar când e clar peste următorul candidat. Când două
produse seamănă la fel de bine (`AMANDINA 2*100` vs `AMANDINA 2*130`), preluarea îți dă lista și
te întreabă. **Un produs greșit introdus tăcut costă mai mult decât o întrebare.**

---

## 5. Prețul

Prețul care se facturează e **cel din contractul cu clientul**, nu cel de pe documentul lui. Când
diferă, preluarea te avertizează pe fiecare linie și îți spune câte linii diferă. Ai două ieșiri:

- prețul din catalog e vechi → îl actualizezi cu `update_b2b_client_product` (și abia apoi preiei);
- clientul a comandat la un preț nou convenit → preiei cu prețurile de pe document, ceea ce e o
  **derogare** care cere dreptul de supervizare a vânzărilor și rămâne consemnată.

Nu tăcea peste o diferență de preț: la factură o vede clientul, iar atunci discuția e mai scumpă.

---

## 6. Firma și punctul de livrare

Firma se caută după **CUI** (prefixul RO nu contează), apoi după GLN, apoi după nume. Atenție la
duplicate: aceeași firmă poate exista de două ori în listă (import vechi, absorbție de tabele).
Preluarea preferă rândul care chiar are catalog și puncte de livrare, iar dacă rămân mai multe
candidate cere ID-ul exact. Dacă firma găsită nu are niciun produs contractat, îți spune asta
direct — nu îți raportează „produse negăsite", care te-ar trimite să cauți în catalogul greșit.

Punctul de livrare se caută după GLN, cod ship-to EDI, alias învățat, apoi nume și adresă.
Un depozit necunoscut („WH POPESTI FRESH", prima livrare acolo) **nu** se potrivește forțat cu
altul: îl creezi cu `create_b2b_client_depot` și, de la comanda următoare, numele de pe documentele
clientului duce singur la el.

---

## 7. Ce reține sistemul după fiecare comandă confirmată

La import, codurile, EAN-urile și denumirile de pe document se leagă de produsele contractate, iar
numele/GLN-ul depozitului se leagă de punctul de livrare. Sunt **dovezi**, nu ghiceli: se scriu
doar după ce comanda a fost confirmată de un om.

Efectul se vede de la a doua comandă: aceleași linii se potrivesc instantaneu, cu certitudine, chiar
dacă denumirea e prescurtată sau lipsește. Un cod nu poate fi legat de două produse deodată — dacă
o comandă nouă vrea să lege un cod deja folosit, legătura veche rămâne și primești un semnal.

---

## 8. Ce NU face preluarea (deliberat)

- **Nu introduce comenzi parțiale.** Dacă o linie din zece nu e sigură, nu se scrie nimic. O comandă
  incompletă înseamnă marfă nelivrată descoperită la recepția clientului.
- **Nu confirmă singură mărimea baxului.** Confirmarea e o afirmație a unui om.
- **Nu creează produse și nu adaugă linii de catalog.** Un produs necontractat nu are preț convenit.
- **Nu trece comanda mai departe de „ciornă".** Confirmarea, planificarea producției, pregătirea și
  facturarea rămân pași separați, cu deciziile lor.

---

## 9. Unelte

| Ce vrei | Unealta |
|---|---|
| ce produse are contractate clientul, cu ce coduri și ce mărime de bax | `list_b2b_client_products` |
| corectează prețul, codul clientului, EAN-ul, disponibilitatea | `update_b2b_client_product` |
| confirmă mărimea baxului | `set_b2b_packaging` |
| adaugă un produs în contractul clientului | `create_b2b_client_product` |
| **citește comanda primită și arată ce s-ar introduce** | `preview_b2b_customer_order` |
| **introduce comanda după confirmarea omului** | `import_b2b_customer_order` |
| punctele de livrare ale clientului | `list_b2b_client_depots`, `create_b2b_client_depot` |
| ce comenzi există deja | `list_b2b_orders`, `get_b2b_order_items` |

Ce urmează după preluare (confirmare, planificarea producției, picking, aviz, factură) e în
`knowledge/b2b-comenzi-wholesale.md` și în skill-ul `gestioneaza-comenzi-b2b`.
