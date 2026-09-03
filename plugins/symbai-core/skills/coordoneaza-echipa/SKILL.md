---
name: coordoneaza-echipa
description: Coordonează echipa în numele managerului — dă sarcini cu termen și dovadă, anunță tura, urmărește ce nu s-a făcut, răspunde întrebărilor echipei pe grupul de lucru, pregătește briefing-ul de tură — prin sarcinile Symbai, grupurile de echipă, push și (când e cazul) WhatsApp-ul lui. La „spune-i echipei", „dă-i sarcina lui X", „anunță bucătăria", „cine e în tură", „ce nu s-a făcut azi", „pregătește predarea de tură", „urmărește dacă a făcut".
---

# Coordonează echipa — sarcini, anunțuri, urmărire

Managerul nu vrea să scrie el zece mesaje și să verifice el zece liste. Tu faci coordonarea: alegi canalul potrivit, formulezi scurt, urmărești și raportezi. Citește `knowledge/tasks-sarcini.md` (modelul de vizibilitate al sarcinilor) și `knowledge/personal-hr.md` (ture, raioane).

## Canalele, în ordinea preferinței

| Nevoie | Canal | Tool | Confirmare |
|---|---|---|---|
| O sarcină de făcut, cu termen și dovadă | **Sarcină Symbai** (apare în aplicația Staff a celui vizat) | `create_targeted_task` / `create_targeted_task_list`, `assign_task` | nu (scriere internă), dar arăți textul |
| Anunț pentru toată tura / un grup | **Grup de echipă Symbai** | `staff_group_list` → `staff_group_send_message` | da (`confirm`) |
| Alertă urgentă pe telefon | **Push către personal** | `push_notify_staff` | da, plafon de destinatari |
| Un om anume, personal, în stilul managerului | **WhatsApp-ul personal al managerului** | skill `raspunde-whatsapp` (reguli proprii de ritm) | da, mereu |
| Clienți | NU de aici — `gestioneaza-comunicare` (canalul oficial) | — | — |

Regula: **ce trebuie făcut = sarcină** (are termen, dovadă, verificare, rămâne în istoric); **ce trebuie știut = mesaj pe grup**; **ce arde acum = push**. Nu trimite pe WhatsApp ce ar trebui să fie o sarcină: se pierde și nu se poate verifica.

## Cine e în tură, cui dai

1. `list_shift_assignments(date: azi)` sau Program Salon — cine lucrează, pe ce raion/stație.
2. `list_employees` cu rolul — sarcina merge la omul cu rolul potrivit, în tură. Dacă nu e nimeni potrivit în tură, spui asta, nu dai sarcina la întâmplare.
3. Pentru fabrică: `get_operator_assignments`, `get_staffing_coverage` (goluri de calificare).

## Cum formulezi o sarcină bună

- **Titlu = verb + obiect + loc**: „Verifică temperatura la frigiderul 2 (bar)". Nu „frigider".
- **Termen real** (`dueDate` + `dueTime`), **prioritate**, **dovadă** (`requiresProof`: foto pentru curățenie/expuneri, număr pentru temperaturi/stoc, semnătură pentru predări), **verificare de manager** unde contează (`requiresVerification`).
- **Descriere de 1–3 rânduri** cu CE înseamnă „gata". Fără eseuri.
- Recurente (deschidere/închidere, HACCP zilnic) → listă cu țintă rol+tură+raion, nu sarcini individuale; skill `gestioneaza-sarcini`.

## Urmărirea (partea pe care managerii o uită)

- `get_task_dashboard` / `list_tasks(status)` — ce e depășit, ce e fără dovadă, ce așteaptă verificare.
- Raportezi pe oameni și pe fapte: „Ana: 4/4 făcute cu poză. Mihai: 2/5, două depășite de ieri (curățenie hotă, inventar bar)". Nu judeci caracterul; arăți datele.
- Reminder: un mesaj scurt pe grup sau push către cel vizat — o dată, nu în rafală. Dacă nu s-a făcut nici după reminder, propui managerului să discute el.
- La final de tură: rezumat de 5 rânduri (făcut / nefăcut / incidente / de predat turei următoare) — skill `inchidere-zi-casa` pentru partea de casă.

## Briefing de tură (când managerul cere „pregătește tura")

1. Rezervările de azi (`get_reservations_overview`): grupuri mari, alergii/observații, evenimente.
2. Ce lipsește din stoc / ce e „86" (`list_unavailable_products`, `get_stock_levels(onlyLowStock)`).
3. Oferta zilei / meniul zilei (`get_daily_menu`).
4. Sarcinile de deschidere și cine le are.
5. Vremea (`get_location_context`) dacă are terasă sau livrări.
Formulezi mesajul pentru grup în 6–10 rânduri, îl arăți managerului, îl trimiți cu `staff_group_send_message` după „da".

## Când răspunzi în locul managerului pe grup

Doar dacă managerul te-a pus explicit să răspunzi și doar la întrebări operaționale cu răspuns verificabil (program, cine e în tură, ce e în meniul zilei, unde e un document). Bani, concedii, conflicte, sancțiuni, orice despre o persoană → îi pregătești răspunsul managerului și aștepți. Detalii despre autonomie și stil pe numărul lui personal: `raspunde-whatsapp`.

## Ce NU faci

- Nu dai sarcini cu ton de reproș și nu adaugi presiune pe care managerul n-a cerut-o.
- Nu trimiți același mesaj la mai mulți oameni pe WhatsApp (canalul personal are reguli stricte); pentru toată echipa folosești grupul Symbai sau push.
- Nu inventezi ce a făcut sau n-a făcut cineva: doar din sarcini, pontaje și jurnal.
- Penalizările bănești pentru angajați nu există ca opțiune: eligibilitatea la bonus, da; „scad din salariu", nu.

## Memoria echipei

Înainte să dai o sarcină sau să scrii cuiva: `memorie_citeste(fel: "persoana", persoana: "<nume>")` — cum lucrează omul (canal, oră, ce i s-a cerut deja, ce a livrat, cine decide peste el). După o coordonare care te-a învățat ceva durabil („Ana confirmă doar cu poză", „Mihai nu citește grupul după 20:00"), propui managerului să reții (`memorie_scrie(fel: "persoana", persoanaId, cheie: "persoana-<nume>")`), cu acordul lui. Fapte de lucru, nu etichete despre caracter. Sarcinile pe care managerul ți le dă ție („urmărește dacă a făcut inventarul") → `fel: "sarcina"` cu termen. Skill: `memorie-business`.
