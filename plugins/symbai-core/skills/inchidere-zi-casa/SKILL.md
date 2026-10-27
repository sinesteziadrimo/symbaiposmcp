---
name: inchidere-zi-casa
description: Închidere automată de zi configurabilă pe unitate, casa provizorie, auditul numerarului și corectarea zilelor deja închise. Pentru „închide ziua”, „verifică închiderile”, „modifică numărarea”, „raportul Z nu bate cu POS”, „predarea nu apare” sau „schimbă ora închiderii”.
---

# Închiderile de zi și controlul casei

Vorbește simplu, ca asistent al proprietarului. Citește `knowledge/finante-facturare-contabilitate.md` pentru concepte și `knowledge/tools-mcp.md` pentru parametrii disponibili. Închiderea zilnică din POS este un raport editabil. Documentele fiscale și închiderea perioadei contabile au reguli distincte.

## Cum funcționează

- Ospătarii își închid turele. Numerarul predat este vizibil în casa provizorie a unității, până la preluarea în casierie.
- **Închiderea automată este pornită implicit**, la ora de sfârșit a zilei de lucru. Din **Setări → Localizare** se poate opri sau se poate alege altă oră pentru fiecare unitate. Ora aleasă programează execuția după finalul intervalului fiscal; nu redefinește intervalul zilei.
- Exemplu: ziua 7 septembrie, cu program 06:00–06:00, se termină pe 8 septembrie la 06:00, ora României. Dacă execuția este la 08:00, se închide același interval, la 08:00.
- La execuție, sistemul preia sursele eligibile, închide ziua și urmărește pașii de finalizare. Zilele deja închise manual nu primesc o închidere automată duplicată. Sursele sosite târziu și pașii eșuați sunt recuperați.
- **Închiderea unei ture prin conexiune** — `update_shift(shiftId, status:"completed", note?)`. Propria tură trece prin aceeași gardă ca POS-ul: dacă are note deschise, refuzul `SHIFT_CLOSE_BLOCKED` le listează (masă, notă, sumă) — se rezolvă întâi notele. Tura altui angajat se închide administrativ, ca în Închiderea de Zi, cu drepturile tale: dacă are note neîncasate sau plăți în așteptare, primul apel întoarce `SHIFT_CLOSE_NEEDS_CONFIRMATION` cu blocajele și `data.confirmWith`; arăți blocajele omului și, DOAR după acordul lui explicit, reapelezi cu `force: true` + `confirmToken` (valabil 5 minute, pentru aceleași blocaje). Notele rămân deschise după închiderea turei. O plată marcată manual („payment_awaiting_approval”) o aprobă sau o respinge un manager, nu autorul ei: `respond_operation_request(requestId, action, paymentMethod?)`.
- Lipsa numărării fizice, turele active sau mișcările care cer verificare sunt semnalate. Nu inventa o sumă numărată și nu presupune că toate controalele sunt complete doar fiindcă ziua apare închisă.
- Istoricul din **Finanțe → Închidere de zi** arată închiderile automate, corecțiile și avertismentele. Proveniența automată se păstrează după corectare.

## Verifică o zi

1. Identifică unitatea și moneda cu `list_cash_registers` și `get_cash_day_automation_settings`. Folosește ID-urile întoarse.
2. Citește `list_cash_day_closures(registerId, from, to)` pentru istoric și `audit_cash_book_day(registerId, businessDate)` pentru controlul curent. Intervalul istoricului este de cel mult 366 zile.
3. Urmărește soldurile, numerarul așteptat, numărarea fizică și diferența, mișcările neoperate/neconfirmate, turele active și rezultatul automatizării. Mișcările neverificate din zilele anterioare pot afecta sertarul de azi. Când răspunsul are „registru neactualizat” (`registruNeactualizat: true`), soldul e **sold scriptic**: spune-l așa, cu data ultimei depuneri la bancă (`ultimaDepunereBanca`) și avertismentul din răspuns, în același mesaj.
3b. **„Cât e în casă acum?”** → `get_cash_register_balance(registerId)` (POS 19.3.820 sau mai nou) dă trei cifre: `numerarDePredatAcum` (cât e acum în casă, de predat: registrul legal, plus mișcările de verificat, plus predările de tură încă neoperate de azi), `soldCaPeEcran` (registrul cu mișcările de verificat) și `soldDoarAprobat` (registrul legal, doar din mișcările verificate). Pentru „cât am în casă” și calculul plăților folosești `numerarDePredatAcum`; registrul legal e `soldDoarAprobat`. Spui de unde vine diferența dintre ele.
4. `get_cash_provisional_drawers(locationId, businessDate)` arată predările încă nepreluate pe unitate și monedă. Predarea nu este un venit nou: nu dubla vânzările sau operațiunile înregistrate.
5. Pentru controlul complet citește separat `get_end_of_day_report`, `get_daily_consumption_status` și `get_fiscal_z_register`, cu aceeași zi și unitate. Folosește intervalul istoric dacă diferă de programul curent. La Z, compară aceeași casă și perioadă; un Z comun mai multor branduri nu poate fi împărțit printr-un filtru de acces.
6. Răspunsul trebuie să distingă verificările trecute, constatările actuale, avertismentele istorice și controalele indisponibile. `checks.fiscalZ=false` sau `checks.consumption=false` în auditul de casă înseamnă că acele controale se fac separat, nu că au trecut.

## Interpretează notele și operațiunile de numerar

- `get_end_of_day_report`: `noteFinalizate` (alias vechi `bonuriFinalizate`) numără **note POS**, inclusiv `noteCuValoareZero`. Nu este numărul bonurilor fiscale. De exemplu, 14 note cu valoare și 2 note de zero înseamnă 16 note; numărul bonurilor emise se verifică separat în sursele fiscale.
- Depunerile și retragerile (`CASH-IN` / `CASH-OUT`) sunt excluse din vânzări. Pot exista legitim fără produse și fără plăți de vânzare; asta nu le face „comenzi fantomă”.
- Problemele depunerilor/retragerilor la casa de marcat apar separat în `audit.operatiuniNumerarCuProbleme`, `operatiuniNumerarNerezolvate` și `operatiuniNumerarDetalii`. Nu le interpreta automat ca vânzări lipsă de pe Z. Dacă versiunea conectată nu întoarce aceste câmpuri, absența lor nu înseamnă zero probleme: verifică detaliile disponibile.
- Două operațiuni cu aceeași sumă nu dovedesc o dublură. Verifică sursa, orele, tura, registrul de casă și ce bani au fost efectiv depuși/retrași. O eroare de hârtie sau conexiune la aparat nu justifică înregistrarea banilor încă o dată. Verifică rezultatul la casa de marcat înainte de retrimitere.

## Corectează o zi deja închisă

Nu cere redeschidere doar pentru numărare, observație sau interval. Execută modificarea cerută ori autorizată în sarcină, păstrând restul raportului.

1. Citește auditul și versiunea zilei.
2. Apelează `correct_cash_book_day` cu `registerId`, `businessDate`, motivul în `reason` și numai câmpurile schimbate: `countedAmount`, `countNote`, `startHour`, `endHour`. Implicit este previzualizare, fără scriere.
3. Câmpurile omise se păstrează. `countedAmount:null` elimină explicit numărarea; zero înseamnă sertar numărat și gol. O simplă observație nu schimbă diferența de casă. Pentru recalcularea unei zile istorice cu interval necunoscut, cere intervalul real.
4. Salvează cu `preview:false` și `expectedVersion` din previzualizare. La conflict, recitește și reconstruiește modificarea.
5. Recitește auditul și arată pe scurt înainte/după, motivul și problemele rămase. Modificarea nu retrimite comenzi către terminale sau casa fiscală.

O cerere de verificare permite citirea. Nu alege în locul proprietarului o sumă sau o mișcare de bani. Dacă schimbarea este deja cerută clar, nu cere repetat același acord.

## Corectează mișcările de bani

- Pentru predări existente: `list_cash_pending_operations`, apoi `operate_cash_pending_operations` cu sursele exacte.
- Pentru o operațiune nouă documentată: `create_cash_book_entry`, cu `clientRef` stabil la reîncercare.
- Pentru anulare: `void_cash_book_entry(entryId, reason, confirm:true)`, în baza intenției autorizate; rămâne urma în istoric.
- Pentru confirmare: `verify_cash_book_entry` numai pe baza documentului justificativ. Nu regla arbitrar soldul ca să dispară diferența. Dacă ziua mișcării e deja închisă, primul apel arată efectul: ziua se redeschide și își pierde numărarea. Trimiți `confirm:true` numai după acordul omului.
- Coada „de verificat” (`list_cash_verification_queue`): pentru total, `summaryOnly:true` (număr, net pe monedă, pe casierie, cea mai veche zi, fără rânduri); la o verificare periodică, doar ce a intrat nou, cu `sinceId` din cursorul răspunsului anterior. Nu reciti toată coada pagină cu pagină doar ca să afli totalul.
- Multe mișcări deodată („respinge tot ce e din martie–mai, reglat între timp”): `bulk_review_cash_entries` cu `action` `verify` sau `reject` și filtrul (casierii, perioadă, id-uri, sumă, tip, text). Primul apel e previzualizarea: câte mișcări, netul și, la verificare, zilele închise care se redeschid. Reapelezi cu `confirm:true` și `expectedSelectionHash` numai după acordul omului; la `reject`, `note` e obligatorie. Cel mult 100 de mișcări pe apel la verificare și 500 la respingere; `nextArguments` arată restul. Nu verifica unul câte unul loturi mari.
- `close_cash_book_day` închide o zi nouă; numărarea este opțională. Pentru corectarea unei zile închise folosește instrumentul de corecție.
- `bulk_close_cash_days` închide cronologic zilele rămase deschise. Operarea banilor se face separat cu instrumentul dedicat; aici `operatePending:false`.
- O închidere zilnică nu este motiv suficient să blochezi corecția. Documentele fiscale și perioadele contabile rămân tratate prin fluxurile lor proprii.

## Plăți la termen și facturi netrimise la ANAF

Pe POS 19.3.820 sau mai nou, doar citire:

- `summarize_term_receivables`: sumele din **Finanțe → Plăți la termen**, pe metodă de plată, brand sau lună: câte sunt deschise, cât rămâne de încasat și câte vin din note închise înainte ca metoda să fie bifată „la termen”. Pentru „de unde vin atâtea plăți la termen”. Stingerea sau păstrarea lor o decide contabilul; tu nu le modifici.
- `list_outgoing_efactura_problems`: facturile emise care n-au ajuns în SPV (netrimise, respinse de ANAF, cu eroare sau cu rezultat necunoscut), fiecare cu motivul în română și pasul de corectare. O factură respinsă se corectează și se retrimite pe același număr. Unealta nu trimite nimic la ANAF.

## Drepturi și asistent financiar

Citirea, corectarea raportului, operarea numerarului și configurarea programului sunt drepturi separate. Folosește dreptul nominal exact și unitățile acordate, fără a cere rol de administrator global.

În **Asistenții mei**, pachetele de casă sunt `cash.read`, `cash.close`, `cash.entries`, `cash.settings` și `cash.fiscal` (rapoarte X/Z). Accesul pe modulul «Financiar & Contabilitate» (Citește/Modifică) dă în plus uneltele modulului, ca în Claude Code/Codex. Șablonul „Verificarea închiderilor de zi” pornește cu citire. Adaugă scriere numai când proprietarul o cere. În grupuri, datele de casă și cele financiare sunt disponibile numai dacă fiecare membru are acces la ele.

Setările pot fi citite/scrise prin modulul `setari` sau `financiar`, cu dreptul de configurare. Verificarea consumului este disponibilă și prin modulul `financiar`; generarea/reprocesarea lui are drepturi distincte.

## Alte pagini utile

- `/finance/cash-book`: operațiuni, solduri și exporturi.
- `/finance/cash-registers`: configurarea casieriilor și rutării numerarului.
- `/finance/cash-verification`: mișcările care cer verificare.
- `/finance/fiscal-reports`: istoricul X/Z și reconcilierea cu POS.
- **Setări → Rapoarte pe închideri**: conținutul rapoartelor de tură și de zi.
- **Finanțe → Bacșișuri**: borderourile de plată, distincte de vânzări și de totalul brut încasat.

Pentru navigare, `gaseste_in_aplicatie` dă pagina exactă. Pentru o problemă demonstrată care nu poate fi rezolvată cu uneltele disponibile, explică ce lipsește și folosește fluxul de suport autorizat.
