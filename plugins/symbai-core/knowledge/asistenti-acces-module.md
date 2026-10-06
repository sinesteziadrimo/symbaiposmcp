# Accesul asistenților numiți: module, pachete și audiențe

Regula: **asistentul poate face exact ce poate face proprietarul din Claude Code/Codex în modulele bifate.** Rolul live al proprietarului și Hub → **Acces AI** rămân plafonul; brandurile și unitățile bifate la asistent îl restrâng. Fiecare apel trece prin aceleași verificări ca la conexiunea proprietarului.

## Grila pe module (aceeași ca în Acces AI)

În **Asistenții mei → Permisiuni**: rânduri = module grupate, coloane **Citește** și **Modifică**. Modifică bifează și Citește. Butoane: **Acces complet (ca tine)** în fișa asistentului, **Acces complet** la grup, sarcină și WhatsApp (toate modulele din plafon, citire și modificare), **Doar citire**, **Niciunul**. O căsuță gri își spune motivul:

- „Nu e în Acces AI”: grantul conexiunii proprietarului nu are modulul;
- „Rolul tău nu are acest modul”: rolul POS al proprietarului;
- „Rolul tău sau Acces AI nu îl permite”: la pachetele specializate;
- „Neacordat asistentului”: la grup, sarcină sau WhatsApp; bifează-l întâi în fișa asistentului.

Prin unelte (`envelope.capabilities` la `asistent_creeaza`, `asistent_actualizeaza`, `asistent_grup`, `asistent_sarcina`, `asistent_whatsapp`, sau `pachete` din `asistent_urmareste`): `data.<cod>.read` = Citește, `data.<cod>.write` = Modifică (include citirea). Lista trimisă este completă și înlocuiește drepturile salvate. Alege numai din plafonul arătat de `asistenti_lista`.

| Grup | Modul | Cod |
|---|---|---|
| Operațional | Produse & Meniuri | `produse_meniu` |
| | Rețete | `retete` |
| | Stocuri & Recepție (inclusiv facturi primite) | `inventar` |
| | Comenzi POS | `comenzi_pos` |
| | Setări & Configurare | `setari` |
| | Aspect Aplicație Staff | `staff_app_config` |
| Producție & Logistică | Producție | `productie` |
| | Livrări & Flotă | `livrari` |
| | Furnizori | `furnizori` |
| Clienți & Vânzări | Rezervări & Clienți | `rezervari_clienti` |
| | CRM & Automatizări Marketing | `marketing_crm` |
| | Hotel PMS | `hotel` |
| Marketing & Comunicare | Marketing & Social Media | `marketing_social` |
| | Reclame (Meta / Google / TikTok) | `reclame` |
| | Comunicare (Email / WhatsApp / Push) | `comunicare` |
| Comerț online | Magazin Online | `ecommerce` |
| | eMAG Marketplace | `emag` |
| Bani & Echipă | Financiar & Contabilitate | `financiar` |
| | Personal & Ture | `personal` |
| | Plăți Terminal (refund card) | `plati_terminal` |
| Clădire inteligentă | Home Assistant (Smart Building) | `home_assistant` |

Reclamele și refundul pe card mișcă bani reali, în limitele din Acces AI. Calculatoarele firmei nu sunt în grilă: au pachetul `computers.control`, cu regulile lor de acces.

## Pachete specializate

Se bifează separat, sub grilă, și au reguli proprii (ce citesc, ce pot modifica, cui răspund):

- **Conversație și memorie**: `group.read` și `group.reply` (citește/răspunde în grup), `groups.ask` (întreabă în alte grupuri și revine), `groups.recall` (caută în grupurile conectate), `memory.events` (evenimente cu sursă și valabilitate), `knowledge.read` (documentele aprobate), `learning.propose` (propune lecții).
- **Inbox**: `email.read`/`email.send` (adresele conectate ale proprietarului), `whatsapp.read`/`whatsapp.send` (conversațiile partajate prin Connect, numărul proprietarului).
- **Casă**: `cash.read`, `cash.close`, `cash.entries`, `cash.settings`, `cash.fiscal` (rapoarte X/Z) — vezi `inchidere-zi-casa`.
- **Stocuri și bucătărie**: `stock.read`, `stock.operate`, `storage.organize`, `storage.print`, `kitchen.exits`, `buffet.operate`.
- **Producție și calitate**: `production.read`, `production.operate`, `production.plan`, `quality.read`, `quality.operate` (jurnalele HACCP: temperaturi, incidente, curățenie, răcire rapidă, exerciții de rechemare — fără configurarea senzorilor, a planului sau a programului de curățenie, care rămân în Setări).
- **Produse**: `menu.read`, `menu.operate`, `menu.daily` (Meniul Zilei), `products.operate`, `recipes.operate`.
- **Rapoarte**: `sales.read`, `reports.read` (rapoartele complete, inclusiv cele peste toate modulele), `forecast.restaurant.operate`, `analysis.sql` (Analize avansate: interogări SQL de citire, ca în Acces AI).
- **Facturi și bancă**: `invoices.read`/`invoices.write` (primite, eFactura, recepții), `outgoing-invoices.read`/`outgoing-invoices.write`, `finance.read`/`finance.operate` (extrase bancare).
- **Echipă și sarcini**: `team.read` (grupurile, sarcinile și turele echipei), `team.operate` (sarcini și notificări push; nu scrie în grupuri), `team.schedule` (Planificatorul de Ture), `tasks.read`, `tasks.draft`, `hr.read` (contracte, salarii contractuale, concedii).
- **Vânzări și contracte**: `crm.read`, `sales.operate`, `sales.reply`, `sales.documents`, `sales.coach`, `contracts.read`, `contracts.prepare`.
- **Rezervări și evenimente**: `reservations.read`, `reservations.operate`, `events.studio.read`, `events.studio.design` (Event Studio 3D).
- **Hotel**: `hotel.revenue.read`, `hotel.revenue.operate`, `hotel.marketing.operate` (în limitele pilotului automat).
- **Marketing și studio creativ**: `marketing.read`, `marketing.draft`, `marketing.operate`, `creative.read`, `creative.design`, `creative.media`, `menu.design` (meniul fizic). `creative.generate` este retras și nu mai acordă unelte.
- **Automatizări**: `automations.read`, `automations.manage`, `automations.crm.read`, `automations.crm.manage`.
- **Implementare** (asistenții de implementare): `implementation.manage`, `implementation.configure`, `factory.configure`, `onboarding.read`, `onboarding.coordinate`, `onboarding.work`.
- **Altele**: `research.public` (surse publice de pe internet), `computers.control` (calculatoarele firmei).

Bifele pe module nu deschid rapoartele peste toate modulele (`list_entities`, `generate_report`, `jurnal_activitate`): ele vin numai cu `reports.read`. Memoria comună (`memorie_citeste`) vine numai cu `knowledge.read`.

Modul **„Doar raportează”** (`stockMode: report`) al asistentului sau al sarcinii blochează orice modificare, nu doar stocul; `operate` permite numai scrierile acordate.

## Cine vede rezultatul

| Unde lucrează asistentul | Ce poate folosi |
|---|---|
| Conversația privată cu proprietarul | Tot accesul bifat, inclusiv SQL (condițiile mai jos). Singurul loc pentru operațiile rezervate. |
| Sarcină livrată doar proprietarului (push, emailul lui, fără livrare) | Tot accesul bifat, fără operațiile rezervate. SQL numai dacă sarcina nu urmărește surse (email/WhatsApp) și nu are drepturi de modificare sau de trimitere. |
| Grup de echipă (participare sau sarcină livrată în grup) | Doar ce pot vedea toți membrii, pe unitatea grupului. Fără inboxul, memoria și sarcinile proprietarului, chatul echipei, CRM-ul nominal, Event Studio și SQL. |
| WhatsApp | Răspunsul îl văd toți din conversație: bifează doar ce pot afla ei. Fără inboxul, conversațiile, grupurile echipei, sarcinile și memoria proprietarului, fără SQL. Cu `client`: doar informații publice, fără documente și unelte. |
| Sarcină livrată altora (WhatsApp, alt email) | Accesul bifat, fără SQL și fără operațiile rezervate. Inboxul, conversațiile, chatul echipei, sarcinile și memoria proprietarului numai cu pachetul explicit (mai jos). |

**SQL** (`analysis.sql`) cere: bifa la asistent (și la sarcină), rolul și Acces AI care îl permit (SQL sau Read all), asistentul pe toată firma și un calculator care nu este partajat de alt angajat.

**În grup**, fiecare membru trebuie să poată folosi el însuși unealta:

- un modul rămâne numai dacă îl are fiecare membru; Modifică devine Citește când un membru nu poate modifica;
- casa cere dreptul de casă al fiecăruia; banca și modulul financiar, dreptul financiar al fiecăruia;
- contractele de muncă, salariile, beneficiile și concediile cer dreptul de personal al fiecăruia;
- un grup legat de o unitate lucrează doar pe ea.

**Sarcină livrată altora**: inboxul, conversațiile, chatul echipei și memoria proprietarului cer pachetul lor, nu doar modulul: `email.read`/`email.send`, `whatsapp.read`/`whatsapp.send` (inboxul de business și cu `marketing.read`/`marketing.operate`), `team.read` (chatul echipei, sarcinile proprietarului), `knowledge.read` (memoria).

**Numai în conversația privată cu proprietarul**:

- ștergeri și refaceri de perioadă, ștergerea brandurilor și locațiilor, restaurarea brandurilor, deblocarea perioadei fiscale, forțări ale serverului local;
- GDPR (uitarea clientului, anonimizare);
- roluri și permisiuni; conturile angajaților (creare, modificare, PIN; excepție: implementarea cu `implementation.configure`) și ale curierilor;
- chei și parole de integrare, legături de cont (Facebook/Instagram, calendar, Airbnb);
- tichetele către echipa Symbai (`trimite_ticket_symbai`, cererile de automatizări noi).

**Niciodată pentru un asistent**: administrarea asistenților și a propriului acces, administrarea implementărilor și a echipelor de vânzări, partajarea conversațiilor WhatsApp, lucrul pe pagina deschisă a omului, scrierea în memoria comună a proprietarului, scrierea în chatul echipei (răspunsul în grup trece prin `group.reply`), modificări prin SQL.

## WhatsApp și grupuri pornite din chat

`asistent_urmareste` fără `pachete` pornește numai cu citiri, din accesul asistentului:

- **WhatsApp**: citirile nesensibile, plus citirea și răspunsul în conversație. Intră implicit: totalurile de vânzări, stocurile cu costuri, facturile primite (cu prețuri de achiziție), rezervările, producția și calitatea, meniul, marketingul și documentele aprobate. Nu intră: inboxul, grupurile și sarcinile echipei, salariile și contractele, banca și casa, P&L-ul și rapoartele complete, CRM-ul, facturile de ieșire, veniturile hotelului, SQL-ul și modulele întregi.
- **Grup de echipă**: toate pachetele specializate de citire (fără SQL), plus citirea și răspunsul în grup; fiecare rămâne numai dacă îl pot folosi toți membrii. Modulele întregi nu intră implicit.

**`pachete` este lista completă a drepturilor participării** și înlocuiește implicitul (la o participare existentă, drepturile ei). Omis: implicitul la una nouă, drepturile curente la una existentă. Citirea și răspunsul în conversație se adaugă singure.

- **Adaugi o scriere** (numai când proprietarul cere acțiunea): trimite lista curentă (câmpul `pachete` din răspunsul anterior al `asistent_urmareste`) plus scrierea, ex. `data.rezervari_clienti.write` pentru rezervări, `data.inventar.write` pentru documente de stoc. Trimisă singură, scrierea șterge citirile implicite.
- **Restrângi** ce află conversația: trimite doar pachetele potrivite.
- Fără lista curentă, proprietarul bifează scrierea în **Asistenții mei**, la participare.

Un pachet scris greșit sau peste plafon este refuzat cu lista celor disponibile.

## Arie restrânsă

Acces complet = toate unitățile + toate modulele. Pe o parte din branduri sau unități, uneltele fără verificare pe unitate nu sunt disponibile, ca la un angajat cu arie restrânsă; SQL-ul cere aria întregii firme. Listele goale de branduri/unități înseamnă zero date de business.
