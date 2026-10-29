# Același Symbai Connect pentru Accounting și POS

Symbai Connect poate servi o firmă care folosește numai Accounting, numai POS sau ambele produse. Pe calculator rămâne o singură aplicație, cu aceleași numere WhatsApp, conturi email personale și asistenți Claude Code/Codex. Nu crea o instalare separată pentru contabilitate.

## Conectare

1. În Accounting deschide **Asistent AI pe calculator** (meniul Automatizare). Pasul 1 descarcă pachetul Connect pentru calculator (Windows, Mac, Linux); dacă există deja Connect, inclusiv pentru POS, pasul se sare: instalarea păstrează conexiunile și istoricul existente.
2. Pasul 2 listează toate firmele contului în care rolul permite accesul AI, cu nume și CUI. Contabilul bifează clienții (implicit toți) și apasă **Adaugă în Symbai Connect**. Se deschide panoul local Connect, care arată lista; firmele se adaugă abia după „Adaugă firmele”.
3. În același dialog, **Autorizează în Codex** sau **Autorizează în Claude Code** deschide pe rând câte o pagină Accounting pentru fiecare firmă nouă; omul apasă „Autorizează conectarea”. Firmele deja legate nu se reautorizează. Nu cere tokenuri în chat.
4. Verifică pe conexiunea respectivă `get_connection_identity`: `product=accounting`, `companyId`, numele și CUI-ul firmei, `userId` nominal. Verifică firma și datele printr-un apel de citire disponibil. Un pachet descărcat sau un asistent instalat nu dovedește accesul la date.

Calea manuală rămâne: în Connect → Firme → „+ Adaugă o firmă” → **Symbai Accounting**, lipește adresa firmei (`…/mcp/companies/<id>`) copiată din aceeași pagină. Pentru POS se alege **Symbai POS** și se scrie subdomeniul (`firma` pentru `firma.symbai.app`). La mai multe firme conectate urmează regulile din [alege-conexiunea](alege-conexiunea.md) → „Mai multe firme conectate”.

Firma Accounting are o adresă specifică firmei, afișată în aplicație. Păstrează adresa exactă și numele conexiunii detectate de Connect. Două firme de pe aceeași instanță de Accounting sunt conexiuni distincte. Nu înlocui adresa cu cea generică și nu adăuga parametrii POS.

Clientul nu trebuie să creeze un cont POS sau Hub. Activarea aplicației Connect și accesul asistentului la date sunt două autorizări separate. Retragerea activării Accounting nu șterge istoricul WhatsApp și nu retrage accesul POS. Pentru retragerea accesului la date folosește și gestionarea accesului AI din Accounting.

## WhatsApp, email și sarcini

Asociază fiecare număr WhatsApp numai firmelor alese de proprietar. Faptul că două conexiuni au același nume de firmă nu permite să transferi documente ori să presupui că au același utilizator.

Pentru sarcini periodice cerute explicit, citește mai întâi `routine_connections` și `list_routines`. Pe conexiunile Accounting verifică și salvează `product=accounting`, `userId`, `companyId` prin `get_connection_identity`; pe conexiunile POS verifică `employeeId` și `brandId`. Nu inventa identități POS pentru Accounting. O sarcină poate include ambele produse, cu identitățile fiecăruia.

Folosește numai uneltele email/inbox oferite de conexiunea selectată. Citește documentul și verifică CUI-ul cumpărătorului prin `get_company` în Accounting înainte de un draft de factură. La o firmă prezentă în ambele produse, folosește destinația autorizată și nu importa aceeași factură în ambele. Cazurile neclare cer verificare; programarea nu autorizează contabilizare, plată sau recepție automată.

PC-ul, Connect și asistentul ales trebuie să fie disponibile la execuție. Instalarea pluginului și autentificarea în asistent sunt verificate separat; nu declara că rutina a rulat doar fiindcă a fost salvată.
