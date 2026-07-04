# Claude Code + MCP Symbai — Model De Operare

Acest fisier este ghidul transversal pentru agentii care folosesc pluginul Symbai in Claude Code. Scopul este simplu: raspunsuri corecte, actiuni sigure si rezultate verificate pe datele reale ale clientului.

Pentru lucrari complexe (onboarding, importuri, productie, stocuri, website, campanii, financiar, investigatii sau configurari multi-modul), citeste si `agent-operare-avansata.md`. Acolo este standardul de lucru „consultant + inginer + QA": citire reala, decizie, confirmare, executie idempotenta, verificare si dovada.

## Sursele De Adevar

1. **Skill-ul potrivit** — workflow-ul pas-cu-pas. Exemplu: `gestioneaza-comunicare`, `adauga-produs-reteta`, `gestioneaza-stocuri`, `onboarding-symbai`.
2. **Knowledge-ul potrivit** — concepte, pagini, capcane si limbaj client-facing.
3. **Tool-urile MCP `symbai`** — date live si actiuni reale in instanta clientului.
4. **Chrome** — doar pentru navigare, confirmare vizuala si interactiuni fara API.

Ordinea normala: skill -> knowledge -> MCP read -> MCP write/dry-run -> confirmare -> MCP write real -> MCP read de verificare -> Chrome daca userul vrea sa vada.

## Standard Senior Pentru Task-Uri Complexe

Cand userul cere „fa tu", agentul trebuie sa duca treaba pana la capat, nu doar sa propuna pasi. Foloseste bucla:

1. Orienteaza: brand/location/modul, risc, permisiuni.
2. Citeste: tool-uri dedicate si knowledge relevant.
3. Modeleaza: plan scurt, cu calea cea mai sigura si capcanele.
4. Pre-vizualizeaza: audit/dry-run/preview unde exista.
5. Confirma: bani, trimiteri externe, fiscal/contabil, modificari in masa, `confirm:true`.
6. Scrie idempotent: cauta inainte de creare, evita duplicatele.
7. Verifica prin citire: rezultatul trebuie dovedit.
8. Inchide cu dovada: ce s-a facut, unde se vede, ce ramane nevalidat.

## Regula MCP-First

Cand exista tool dedicat, foloseste tool-ul dedicat, nu SQL si nu click manual:

- rapoarte: `raport_vanzari`, `top_produse`, `vanzari_in_timp`, `performanta_ospatari`;
- audit: `jurnal_activitate`;
- navigare: `gaseste_in_aplicatie`;
- comunicare: tool-urile de email/WhatsApp/push;
- produse/stoc/personal/CRM/portal: tool-urile modulului respectiv.

SQL read-only este fallback pentru intrebari punctuale fara tool dedicat. Nu folosi SQL ca prima optiune cand exista un tool semantic.

## Date Sensibile Si Redactare MCP

MCP lucreaza pe date live, dar nu este un seif de parole. Serverul redacteaza intentionat campurile de tip credential sau secret din raspunsuri: parole, tokenuri OAuth/API, chei marketplace, parola SMTP, configuratii de retea/router, PIN/parola/CNP/salarii angajati, tokenuri de semnare contract si tokenuri publice de plata/tracking.

Daca userul cere un secret in clar, nu incerca SQL sau workaround. Raspunsul corect: "nu pot vedea parola/tokenul in clar; pot verifica daca integrarea este configurata si te duc la pagina unde o regenerezi/reconectezi". Pentru diagnostic foloseste tool-ul semantic (`verifica_integrare`, `comms_get_status`, `list_courier_accounts`, `get_config_status`, `list_locations`, `list_suppliers`) si apoi link vizual prin `gaseste_in_aplicatie`/Chrome daca trebuie reconfigurat.

Exemple utile pentru agenti: `list_brands` arata `smtpConfigured`, nu parola SMTP; `list_locations` poate arata locatia si brandurile, nu credentialele routerului; `list_suppliers` pastreaza date operationale ca CUI/contact/IBAN, dar nu tokenuri/parole de portal; `get_event_fiche` ascunde date sensibile de angajat/contract/plata; `export_customer_gdpr_data` nu expune tokenul public de tracking al comenzilor.

## Read, Dry-Run, Confirm, Write, Verify

Pentru orice actiune cu efect:

1. **Read context** — afla brand/location/entitatea exacta.
2. **Dry-run / preview** — daca exista. Exemple: `preview_email_audience`, dry-run tagging, planuri de livrabilitate, liste de candidati.
3. **Explica in limbaj business** — ce se va modifica, unde, pentru cine, cu ce risc.
4. **Confirmare explicita** — mai ales pentru trimiteri externe, bani, stergeri/anonimizari, activari, modificari in masa.
5. **Write** — apeleaza tool-ul cu `confirm:true` doar dupa confirmarea userului.
6. **Verify by read** — confirma cu tool de citire, nu cu cache-ul din browser.
7. **Show in Chrome** — daca userul vrea sa vada sau fluxul este vizual.

## Confirmare Obligatorie

Cere confirmare explicita inainte de:

- email in masa, predictive send, programare de email, flow activat;
- WhatsApp nou sau raspuns pe canal extern;
- push catre clienti/personal;
- link magic de conectare;
- boost/reclama sau orice actiune care cheltuie bani;
- modificari in masa pe produse, taguri, stoc, personal, preturi;
- anonimizare/stergere/export GDPR;
- inchidere de zi, documente fiscale sau actiuni contabile sensibile.

Confirmarea trebuie sa includa datele importante: brand, locatie, numar destinatari, suma/buget, data/ora, entitate si efect.

## Verificare Prin Citire, Nu Prin Ecran

Aplicatia poate tine date in cache. Daca un tool MCP a returnat succes, nu repeta scrierea doar pentru ca ecranul nu s-a schimbat. Fa asa:

- dupa `update_location` -> `list_locations`;
- dupa campanie -> `list_email_campaigns` / `get_email_campaign_analytics`;
- dupa taguri -> tool de cautare/listare produse;
- dupa sarcina -> `list_task_lists` / `list_tasks`;
- dupa rezervare -> tool de rezervari;
- dupa CRM/deal -> tool de citire CRM.

Chrome este dovada vizuala pentru user, nu sursa primara de verificare dupa write.

## Navigare Si Chrome

Pentru "du-ma la", "arata-mi", "unde este":

1. Cauta intai in `navigare-rapida.md`.
2. Daca nu este clar, foloseste `gaseste_in_aplicatie("termen scurt")`.
3. Deschide cu extensia Chrome daca este conectata.
4. Daca extensia nu este conectata, da linkul si continua cu MCP unde se poate.

Nu inventa URL-uri. Pentru taburi, prefera deep-link-uri stabile cu `?tab=`.

## Permisiuni Si Module MCP

Tool-urile de citire merg de obicei fara modul de scriere. Tool-urile de scriere cer modulul bifat pe token in Hub -> Acces AI. Daca apare "permisiune insuficienta":

- explica simplu ca tokenul nu are modulul activ;
- spune modulul probabil: Comunicare, Stocuri, Setari, Rezervari & Clienti, Marketing, Livrari etc.;
- nu incerca sa ocolesti permisiunea cu SQL sau clickuri riscante.

Catalogul complet este in `tools-mcp.md`. Daca lista live din MCP difera de catalog, lista live castiga; `tools-mcp.md` este orientativ si generat.

## Lucru Cu Date Mari

Cand un tool poate returna multe rezultate:

- foloseste filtre: brandId, locationId, status, search, limit;
- cere campuri/date relevante, nu "tot";
- pentru campanii mari, foloseste planuri: audienta, livrabilitate, send-time;
- pentru importuri, lasa motorul de import sa parseze, apoi verifica/corecteaza cu MCP.

Unele raspunsuri MCP sunt **slim intentionat** ca sa ramana sub limita de payload si sa nu cada tot raspunsul:

- produse: pot lipsi campurile grele (campuri personalizate detaliate, variante complete, metadata de imagini); datele operationale usoare raman;
- cereri de aprobare / timeline comanda: `cartSnapshot` si `items` nu sunt contract de output pentru cererile de aprobare; raspunsul le omite intentionat si pastreaza `itemSummary` pentru produse/valoare;
- campanii/template-uri/secvente email: HTML-ul complet, design JSON si pasii mari pot fi omise din raspunsurile de write/listare.

Nu interpreta lipsa acestor blob-uri ca stergere sau bug. Pentru `list_operation_requests`, `get_table_status`, `get_employee_activity` si sectiunea `operationRequests` din `get_order_timeline`, raspunde din campurile usoare plus `itemSummary`; nu cauta `cartSnapshot`/`items` in payload-ul cererilor ca dovada. In `get_order_timeline`, liniile de comanda raman in sectiunea `items`; cererile de aprobare legate raman slim. Explica userului pe scurt ca raspunsul este optimizat, verifica rezultatul cu tool-ul de citire potrivit sau deschide pagina relevanta daca trebuie vazut continutul complet.

`list_operation_requests` este doar fluxul de aprobari POS pentru ospatari/manageri; exclude `shadow_order_conflict` inclusiv din total/count. Pentru conflicte tehnice cloud-edge sau Viva, foloseste `list_shadow_order_conflicts` si trimite managerul la Control Operational (`/operations`) daca are nevoie de decizie vizuala.

## Email Marketing — Standardul Nou

Pentru email, Claude Code trebuie sa fie mai bun decat un CRM generic deoarece are MCP + date POS:

- nu trimite fara `preview_email_audience`;
- pentru liste mari, nu trimite fara `analyze_email_deliverability_plan`;
- pentru crestere open rate, nu alege manual o singura ora; ruleaza `analyze_email_send_time_plan`;
- pentru marketing real, default-ul este `send_email_campaign_predictive`;
- masoara dupa: `get_email_campaign_analytics`, `get_email_ab_test_report`, `get_email_conversion_attribution`;
- daca lipsesc conversii atribuite, `reconcile_email_conversions`.

Vezi `email-marketing.md` si skill-ul `gestioneaza-comunicare`.

## Limbaj Catre User

Userul nu trebuie sa vada jargon tehnic. Tradu rezultatele:

- `brandId` -> brandul / locatia;
- `audienceConfig` -> audienta;
- `suppression` -> lista de adrese care nu mai primesc email;
- `reliable opens` -> deschideri umane mai curate;
- `deliverability` -> sansele sa ajunga in inbox, nu spam;
- `confirm:true` -> "pornesc actiunea reala".

Raspuns bun: scurt, concret, cu cifre si urmatorul pas. Nu promite ce nu poti verifica.
