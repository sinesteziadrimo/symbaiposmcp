# CRM — Automatizări & Playbook-uri

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Modulul CRM acoperă reactivarea și retenția clienților pe tot ciclul de viață: declanșatoare automate (zi de naștere, client inactiv), playbook-uri de follow-up (confirmare rezervare, reminder, mulțumire + cerere de recenzie, re-angajare), pâlnia CRM live (lead-uri → confirmate → cu avans → prezente → recenzii), Next Best Action zilnic (cui să-i ceri o vizită și prin ce acțiune, pentru conversie maximă) și jurnalul execuțiilor (cine a fost contactat, ce s-a trimis, cu ce rezultat). E pentru proprietar/manager de restaurant, hotel sau retail. Programul de puncte și RFM-ul de bază sunt în ghidul „Loialitate & Fidelizare"; campaniile email sunt în „Marketing, Website & Portal Public".

## Concepte

- **Playbook CRM** — o secvență automată declanșată de un eveniment (zi de naștere, 7 zile după o rezervare, client răcit). Cuprinde pași: trimitere email/SMS/WhatsApp, reminder de apel, oferire voucher, marcare task manual. Fiecare pas poate avea condiții (ex. trimite email DOAR dacă clientul nu a făcut opt-out pe email). Rulează manual sau pe orar.
- **Automatizare clienți (regulă declanșator → efect)** — regulă simplă „dacă → atunci" pe baza unui eveniment (a cumpărat de X ori în Y zile, nu a mai venit de Z zile, are zi de naștere azi). Efecte: trimite email/SMS/notificare, creează task, aplică voucher/reducere, schimbă segment. Rulează automat la declanșator (vânzare, dată din calendar, inactivitate).
- **Next Best Action (NBA)** — în fiecare zi, o coadă sortată a clienților cu cea mai mare valoare de contactat ACUM, pe baza scorului de loialitate/RFM + inactivitate. Pentru fiecare: acțiunea sugerată (apel, cerere de recenzie, ofertă win-back, urări de zi de naștere) și motivul (scor 0–100, segment, zile de inactivitate).
- **Pâlnie CRM (funnel)** — vizualizare pe ultimele N zile: câte lead-uri noi → câte confirmate → câte cu avans → câte prezente/completate → câte recenzii, cu ratele de conversie între etape.
- **Segmentare RFM** — automată după **R**ecency (cât de recent), **F**requency (cât de des), **M**onetary (cât a cheltuit). Identifică VIP-urii, clienții în risc de plecare și clienții noi.
- **Jurnal de execuții (playbook runs)** — istoricul: ce playbook s-a executat, pe ce client, când a pornit/terminat, dacă a reușit, dacă s-a trimis email/SMS, ce pas a eșuat.

## Pagini

- **CRM Vânzări** (`/sales-crm`) — dashboard pentru vânzări B2B/corporate: KPI-uri, pipeline Kanban (etape deal), calendar evenimente, activități (apeluri, email).
- **Playbook-uri CRM** — listează playbook-urile (active/inactive), declanșatorul, pașii și statisticile fiecăruia. Pentru linkul exact: `gaseste_in_aplicatie("playbook CRM")`.
- **Follow-up Clienți** (`/customer-followup`) — coada Next Best Action a zilei: clienții de contactat, cu scor și acțiune sugerată (apel, cerere de recenzie, win-back, zi de naștere).
- **Acțiuni Automate** (`/actions`, tab Automatizări Clienți) — reguli declanșator → efect: creezi reguli noi, editezi, activezi, vezi jurnalul execuțiilor și efectele programate.
- **Clienți** (`/customers`) — lista clienților: date de contact, istoric comenzi, puncte de loialitate, segmente RFM, baza pentru campanii.
- **Pâlnia CRM** — sub dashboard-ul de analitice; pentru linkul exact: `gaseste_in_aplicatie("pâlnie CRM")`.

Pagini conexe (au ghiduri proprii): **/loyalty** (puncte, niveluri, RFM — „Loialitate & Fidelizare"), **/email-campaigns** și **/email-analytics** (campanii email — „Marketing, Website & Portal Public"), **/reservations** (rezervări cu follow-up — „Rezervări, Clienți & Evenimente").

## Fluxuri pas-cu-pas

1. **Instalezi playbook-urile inițiale (seed)**: verifici situația (`list_crm_playbooks`); dacă nu există încă, instalezi setul implicit (`seed_crm_playbooks`, cu tipul de business — restaurant/hotel/retail); verifici rezultatul (`list_crm_playbooks` — ar trebui să apară zi de naștere, inactivitate, cerere de recenzie); deschizi din UI (`gaseste_in_aplicatie("playbook CRM")`) ca să editezi frecvența sau mesajul.
2. **Declanșezi manual un playbook pe un client (urgent)**: identifici playbook-ul de win-back (`list_crm_playbooks`); vezi ultimele interacțiuni ale clientului (`get_customer_timeline`); rulezi playbook-ul pe client (`run_crm_playbook` cu `confirm: true`); verifici execuția (`list_playbook_runs` pentru clientul respectiv — vezi statusul: finalizat/eroare/în așteptare).
3. **Configurezi o regulă „Birthday Surprise"**: `/actions` → Regulă nouă → declanșator „ziua de naștere = azi" → efecte (trimite email de felicitare cu prenume + ofertă; creează voucher cu valabilitate 14 zile; creează task „felicitare personală dacă vine") → salvezi → regula rulează zilnic pentru clienții care aniversează. (Crearea regulii e din UI; rularea și logarea unei automatizări de marketing legate merg prin `run_marketing_automation`.)
4. **Vezi pâlnia CRM — pe unde pleacă clienții**: citești funnelul (`get_crm_funnel` pe ultimele 30 de zile — total lead-uri, confirmate, cu avans, prezente, recenzii + ratele de conversie); analizezi unde scade conversia; deschizi din UI (`gaseste_in_aplicatie("pâlnie CRM")`); dacă rata de confirmare e slabă, ajustezi playbook-ul de confirmare (text, canal, timing).
5. **Coada Next Best Action — cui să-i suni**: deschizi `/customer-followup` sau ceri lista (`list_nba_suggestions`); iei clienții pe rând după scor (primii = cei mai „calzi"), cu acțiunea și motivul afișate; după ce iei o acțiune, scorul se ajustează și treci la următorul.
6. **Rulezi acum o automatizare de marketing**: vezi automatizările și starea lor (`list_marketing_automations`); o execuți imediat (`run_marketing_automation` cu `confirm: true` — generează draft sau trimite cereri de materiale angajaților); urmărești rezultatul (`get_marketing_automation_logs` — finalizat / așteaptă materiale / escaladat / eroare).
7. **Creezi o automatizare „Inactivitate 14 zile"**: `/actions` → Regulă nouă → declanșator „ultima cumpărare > 14 zile (eventual doar clienți fideli)" → efect „trimite SMS cu cod de reducere" → setezi execuția zilnică, retry la eșec și verificarea opt-out → activezi. Verifici după 2 zile cine a primit (`jurnal_activitate` filtrat pe clienți/CRM).
8. **Analizezi o campanie email de win-back**: deschizi `/email-analytics` → selectezi campania → vezi rata de deschidere/click/bounce/dezabonări; pentru detaliu (top linkuri, status per destinatar) folosești `get_email_campaign_analytics`; dacă bounce-ul e mare, cureți adresele în `/email-review`.

## Tool-uri MCP utile

- **Citire** (read-only; cere grantul `readModule` al domeniului pe token): `list_crm_playbooks`, `list_playbook_runs`, `get_crm_funnel`, `list_nba_suggestions`, `list_crm_tasks`, `list_marketing_automations`, `get_marketing_automation_logs`, `get_customer_timeline`, `get_customer_email_segments`, `get_email_campaign_analytics`, `get_attribution_report`, `jurnal_activitate` (audit log global, read-only).
- **Scriere (modulul «Setări & Configurare» pe token)**: `run_crm_playbook` (rulează un playbook pe un client, cere `confirm: true`), `seed_crm_playbooks` (instalează playbook-urile implicite ale brandului), `create_notification_rule` (regulă declanșator → efect).
- **Scriere (modulul «Marketing & Social Media» pe token)**: `run_marketing_automation` (cere `confirm: true` la trimiteri în masă), `create_marketing_automation`, `update_marketing_automation`.
- Permisiunea exactă a fiecărui tool e în catalogul din `tools-mcp.md`. Dacă un tool întoarce „permisiune insuficientă", modulul nu e bifat pe token → portal Hub → Acces AI → editezi tokenul.

## Întrebări frecvente

- **De ce un playbook nu se execută la ora programată?** Cel mai des: playbook-ul e inactiv (toggle On/Off) → activează-l; sau declanșatorul nu s-a îndeplinit (ex. „2 zile după rezervare" cere o rezervare nouă); sau clientul a făcut opt-out pe canal (regula respectă GDPR și nu trimite). Confirmă cu `list_playbook_runs` pentru clientul respectiv — dacă nu apare nimic, nu s-a executat azi.
- **Cum fac să nu primească toți clienții aceeași ofertă?** Creezi mai multe playbook-uri sau reguli cu condiții de intrare pe segment/RFM: ex. clienți fideli → voucher 20%, clienți noi → voucher 10% + cadou, client răcit cu RFM scăzut → email + SMS prioritar.
- **Next Best Action-urile par vechi. Cum le reîmprospătez?** Scorul se recalculează automat (inactivitate, RFM, zi de naștere). După reguli noi sau import de clienți, rulează recalcularea RFM (`recompute_loyalty_rfm`) și dă refresh la pagină (cache în browser).
- **Pâlnia arată 5% conversie la recenzii — e bine?** În HoReCa media e ~5–10%, deci ești în normal. Îmbunătățești cu reminder după 3 zile (nu imediat), incentiv mic (puncte de loialitate) și un QR pe bon care duce direct la Google Review. Compară cu `get_crm_funnel` după implementare.
- **Cât durează până se execută o regulă declanșator?** La eveniment instant (vânzare): câteva secunde. Programat: la ora setată. Cu retry: dacă un SMS eșuează, se reîncearcă mai târziu. Pentru urgent, rulează manual din `/actions`.
- **Playbook-ul a trimis SMS dar clientul zice că nu l-a primit. Ce verific?** `list_playbook_runs` (status și dacă s-a trimis); apoi jurnalul de SMS (`get_marketing_automation_logs` sau tab-ul de comunicare). Cauze frecvente: număr fără prefix de țară (`07...` în loc de `+407...`), furnizor SMS indisponibil, filtru de spam la operator, sau clientul a făcut opt-out pe SMS. Corectează datele sau treci pe email.
- **Vreau ca doar VIP-urii să primească playbook-urile speciale.** Filtrezi în `/customers` clienții cu nivel Gold/Platinum sau cheltuieli mari și creezi un playbook/regulă cu condiție de segment VIP → efecte speciale (voucher mai mare, apel personal, cadou).

## Capcane

- **„Completed/Finalizat" NU înseamnă „a ajuns".** Pentru email, statusul finalizat înseamnă că a plecat pe SMTP — poate ajunge în spam sau se poate pierde la furnizor. Verifică adresa în `/email-review`, testează cu alt email, iar ca soluție trimite SMS în loc.
- **Opt-out se respectă mereu (GDPR).** Dacă clientul a refuzat SMS/email, playbook-urile trebuie să aibă condiție „opt-in = true". Verifică în fișa clientului (`/customers`); vezi și ghidul „GDPR & date clienți".
- **Jurnalul se populează cu mică întârziere.** Liniile apar după execuție, nu în timp real — așteaptă câteva minute și filtrează pe data de azi + categoria CRM/Clienți.
- **NBA arată doar clienții care se potrivesc unei condiții.** Nu apar toți clienții, ci doar cei cu un declanșator activ (inactiv 7+ zile, zi de naștere, RFM scăzut). Se actualizează zilnic.
- **Două sisteme diferite de automatizare.** Automatizările de Marketing (`/marketing-automations`) generează postări sociale recurente; Acțiunile Automate (`/actions`) sunt reguli declanșator → efect pe clienți (vouchere, puncte, email/SMS). Nu le confunda.
- **Limita de trimitere pe token.** Dacă plafonul e mai mic decât audiența, campania nu pleacă integral — mărește plafonul din Hub → Acces AI.
- **După modificări prin conexiune**, datele sunt salvate dar interfața arată valorile vechi până la refresh — confirmă cu un tool de citire, nu repeta scrierea.

## Cross-link-uri

- **Loialitate & Fidelizare** (`loialitate-fidelizare.md`) — puncte, niveluri, RFM, win-back, recalculare scor.
- **Rezervări, Clienți & Evenimente** (`rezervari-clienti-evenimente.md`) — pagina `/reservations`, follow-up rezervări, playbook-uri de confirmare și reminder.
- **Marketing, Website & Portal Public** (`marketing-social.md`) — campanii email, automatizări de postări, segmente de audiență, canalul email (SMTP).
- **Comenzi, Mese & Ospătari** (`comenzi-mese-ospatari.md`) — vânzări și clienți identificați la casă (vânzare → punct de loialitate → CRM).
- **GDPR & Date Clienți** (`gdpr-clienti-oaspeti.md`) — opt-in/opt-out pe email/SMS, consimțământ, jurnal de dezabonări.
