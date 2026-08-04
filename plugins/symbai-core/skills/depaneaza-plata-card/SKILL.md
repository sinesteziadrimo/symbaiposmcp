---
name: depaneaza-plata-card
description: Află singur de ce nu merge plata cu cardul pe terminal (Card GP / GlobalPayments) și condu deblocarea. Folosește la „nu merge plata cu cardul", „butonul Card GP e gri / dezactivat / nu face nimic", „nu mă lasă să încasez cu cardul pe telefon", „scrie că nu s-a primit confirmarea, verificați terminalul", „plata cu cardul nu pornește", „nu se deschide aplicația de card", „am rămas blocat pe o plată cu cardul", „plata a rămas în verificare". Diagnostichezi cu date live, explici în două propoziții și duci omul exact la butonul care deblochează.
---

# Nu merge plata cu cardul (Card GP)

Scop: ospătarul spune „nu merge cardul" — tu afli **de ce** din date live, îi explici scurt și îl duci exact unde trebuie apăsat. Fără capturi de ecran, fără „mai încearcă", fără presupuneri.

## De ce se blochează (mecanismul, în cuvinte simple)

Când pornește o încasare pe terminal, aplicația deschide o „încasare în curs" și așteaptă răspunsul terminalului. Dacă terminalul nu răspunde niciodată — era stins, nu era conectat la contul potrivit, a rămas fără net — încasarea aceea **rămâne deschisă**.

Telefonul care a pornit-o o reia la fiecare deschidere a aplicației și, cât timp o consideră „în curs", **ține metoda Card GP blocată**. De aceea:

- la început butonul **Card GP apare gri și nu se apasă**;
- după câteva minute se activează, dar la apăsare apare scurt **„Nu s-a primit confirmarea — verificați terminalul GP"** și nu se întâmplă nimic;
- se întâmplă **pe toate mesele**, nu doar pe cea la care s-a blocat;
- se întâmplă chiar dacă nota aceea a fost între timp încasată altfel (cash, alt card).

Deblocarea = **închiderea acelei încasări rămase deschise**.

## Pasul 1 — Diagnostic (mereu primul; nu modifică nimic)

```
diagnose_card_gp()
```

Îți spune:
- dacă terminalul de card e configurat pe instanță și câte terminale active există;
- **lista încasărilor rămase fără răspuns**: suma, de câte minute stau, cine le-a pornit, ce notă au atașată și **dacă nota a fost între timp închisă cu altă metodă** (cazul cel mai frecvent — încasarea nu mai poate fi aplicată nicăieri, blochează degeaba);
- ce urmează pentru fiecare.

Spune-i userului concluzia, nu tabelul brut:
> „Am găsit o încasare pe card din 18 iulie, de 0,10 lei, pornită de Mihai, care nu a primit niciodată răspuns de la terminal. Ea ține butonul blocat pe telefonul lui. Nota a fost achitată între timp cu card BT, deci încasarea aia nu mai are ce să închidă."

## Pasul 2 — Condu deblocarea în aplicație

Închiderea unei încasări de card e o **decizie financiară** — cere să știi dacă suma a fost sau nu debitată. Nu o poate lua niciun tool automat, pentru că terminalul poate să fi citit cardul fără ca noi să fi primit răspunsul. De aceea o duci omul, în doi pași:

1. **Finanțe → Control Card GP** → butonul **„Marchează restanțele"** — pregătește pentru verificare încasările mai vechi de 30 de minute. Nu declară nimic despre bani.
2. Pe fiecare rând apare butonul **„Verifică"**. Înainte de a-l apăsa, cere-i să se uite pe terminalul de card:

   > „Uită-te pe terminalul GP: apare încasată suma de X lei? (da / nu)"

   - **da** → alege „încasat": nota se închide ca plătită, cu toate efectele (bon fiscal, eliberare masă, bacșiș).
   - **nu** → alege „neîncasat": încasarea se poate relua.

După ce încasarea e închisă, telefonul se deblochează la următoarea încercare de plată.

⚠ **Regula de aur**: „neîncasat" permite o nouă încasare. Dacă de fapt cardul a fost debitat, **clientul plătește de două ori**. Nu-l lăsa să aleagă fără să se fi uitat efectiv pe terminal. Dacă ezită, mai bine lasă încasarea deschisă și spune-i să verifice cu managerul — o încasare rămasă deschisă e supărătoare, o dublă încasare e o problemă cu clientul.

## Dacă diagnosticul spune că nu e nicio încasare blocată

Atunci butonul e blocat din configurare, nu dintr-un blocaj:

- **Terminal neconfigurat** → owner-ul adaugă terminalul de card în Setări → Integrări (are nevoie de TID-ul de la GlobalPayments și de contul de comerciant).
- **Terminal configurat, dar ospătarul nu l-a ales** → pe telefon: Operațiuni → „Terminal plată Card GP" → alege terminalul (sau „Acest telefon", dacă încasează cu aplicația de card de pe telefonul lui).
- **Pe iPhone**, varianta „Acest telefon" deschide aplicația de card cu suma și revine automat în Symbai — aplicația trebuie să fie instalată și logată.

## Ce NU faci

- Nu ceri userului să șteargă aplicația, să se delogheze sau să reinstaleze — blocajul e pe server, reinstalarea nu-l atinge.
- Nu recomanzi „mai încearcă o dată" înainte de diagnostic — butonul rămâne blocat.
- Nu declari singur că o încasare nu s-a făcut ca să deblochezi mai repede.
- Nu ceri capturi de ecran: `diagnose_card_gp` îți spune tot.

## Vezi și

- `investigheaza-masa` — dacă problema e nota/masa, nu terminalul.
- `investigheaza-printare` — dacă plata a trecut dar nu a ieșit bonul.
- `trimite-ticket-suport` — dacă diagnosticul arată ceva ce nu se poate repara din aplicație (ex. terminal respins constant de provider).
