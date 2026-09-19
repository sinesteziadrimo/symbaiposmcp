# CRM prin MCP — configurare, echipe, calendar, materiale și training

Acest ghid explică operarea CRM pentru vânzări de software, servicii sau alte produse. Adaptează fluxul firmei; nu impune tuturor clienților structura unei echipe Symbai.

## Începe cu disponibilitatea reală

Ghidul nu dovedește că tenantul a primit funcțiile. Verifică conexiunea nominală a firmei și caută prin `cauta_tool` configurarea CRM, calendarul sau trainingul. Citește schema live și folosește executorul indicat (`citeste_tool` pentru citiri, `ruleaza_tool` pentru modificări). Dacă există, începe cu `get_crm_configuration_guide(brandId)`. Reutilizează brandul și persoana deja verificate.

Dacă instrumentele lipsesc, verifică versiunea disponibilă, rolul și aria conexiunii. Nu inventa apeluri, nu înlocui cu instrumente legacy și nu modifica datele prin SQL pentru a ocoli un refuz. Poți continua operațiile disponibile și deschide pagina CRM prin `gaseste_in_aplicatie`. Actualizarea ghidurilor nu instalează funcțiile în tenant.

## Configurează în ordinea dependențelor

| Scop | Citește înainte | Modifică și verifică |
| --- | --- | --- |
| Stilul afacerii | `list_crm_business_templates`, `get_crm_business_profile` | `set_crm_business_profile`, apoi recitire. Schimbarea stilului nu aplică automat toate etapele/setările șablonului. |
| Opțiuni și câmpuri | `get_crm_configuration` | `update_crm_configuration`: trimite numai schimbările cerute; flagurile de integrare nu conectează conturi. |
| Pipeline | `list_crm_pipelines`, `list_crm_pipeline_stages` | `create_crm_pipeline`, `update_crm_pipeline`, `create_crm_pipeline_stage`, `update_crm_pipeline_stage`. Nu crea din nou ce există. |
| Tipuri de card/eveniment | `list_crm_event_types` | `create_crm_event_type`, `update_crm_event_type`: capabilități și opțiuni existente, accesibile brandului. Aceste tipuri sunt diferite de paginile publice de programare. |
| Reguli comerciale | `get_crm_workflow` | `save_crm_workflow`: bazin, câmpuri obligatorii, contract, motiv de pierdere, valabilitatea ofertelor și anticiparea notificărilor. |
| Echipe și funcții | `list_crm_teams`, `list_crm_team_members`, `get_crm_workspace(section:staff)` | `create_crm_team`, `update_crm_team`, `update_crm_team_members`, `set_crm_staff_function`. Membrii omiși din modificarea incrementală se păstrează. |
| Card | `get_crm_card_configuration` | `claim_crm_card`, `save_crm_card_qualification`, `set_crm_card_responsibility`. Păstrează versiunea citită și câmpurile necerute. |

La etapele terminale, `isWon` și `isLost` nu pot fi simultan active. La schimbarea acestor marcaje trimite ambele valori. Pentru ofertele comerciale și activitățile obișnuite continuă cu [CRM vânzări](crm-vanzari-pipeline.md); nu confunda oferta comercială cu promoția pe bon.

## Cine vede și cine poate lucra

Funcția comercială, rolul de acces și apartenența la echipă sunt trei lucruri separate. Un utilizator poate rămâne administrator și avea funcția Head of Sales. Eticheta Team Leader nu acordă automat acces la colegi: configurează conducerea echipei și verifică drepturile efective.

Agentul lucrează cardurile proprii sau cele la care are acces explicit; vizibilitatea bazinului urmează politica firmei. Liderul urmărește echipele conduse efectiv. Head of Sales/Master Sales au vedere globală numai dacă drepturile o permit. Implementarea și Account Managerul pot primi acces explicit de citire sau editare pe card.

Conexiunea nu poate acorda drepturi mai mari decât cele ale titularului și mandatului său. Unele configurări privesc întregul brand și refuză o conexiune limitată la o parte dintre unități. Nu elimina restricțiile ca soluție implicită; explică ce operație necesită un administrator autorizat.

## Calendar și pagină publică de rezervare

1. `get_crm_calendar` oferă separat profiluri, tipuri, întâlniri, blocaje, angajați, echipe, conexiuni și prezentări. Cere perioada relevantă, maximum 93 de zile.
2. Pentru modificarea programului sau a unui tip, citește **integral** `read_crm_calendar_configuration`. Rezumatele din listă nu conțin toate excepțiile ori toate setările.
3. `save_crm_calendar_profile` configurează programul angajatului. `weekly` are șapte zile, duminică–sâmbătă; intervalele sunt minute locale de la miezul nopții. Fusul orar este IANA, de exemplu `Europe/Bucharest`. Excepțiile pe date înlocuiesc lista existentă; o dată cu intervale goale înseamnă indisponibil.
4. `save_crm_booking_type` configurează pagina: durată, pauze și preaviz în minute; orizont în zile; gazde, distribuție, priorități, întrebări, format, confirmări și remindere. La creare omite `config.id` și folosește `expectedRevision:0`. Gazdele trebuie să aibă program activ.
5. `get_crm_available_slots` verifică disponibilitatea reală pe cel mult două zile. Nu deduce sloturile libere numai din programul săptămânal.
6. `get_crm_booking_share` întoarce URL-ul, conținutul pentru QR și codul iframe. `active:false` înseamnă pagină nepublicată. `qrContent` este textul de codificat, nu o imagine QR deja creată. Integrarea pe website se face în mandatul utilizatorului, cu [construieste-website](../skills/construieste-website/SKILL.md).

`connect_crm_calendar` pregătește autorizarea Google/Microsoft/Zoom/Calendly; titularul finalizează conectarea la furnizor. Nu cere parole în chat și nu declara conexiunea activă doar pentru că ai primit linkul. Verifică apoi `get_crm_calendar(section:connections)`, `list_crm_connected_calendars` și configurează calendarele citite/scrise cu `save_crm_calendar_connection`. Deconectarea are instrument separat și poate fi împiedicată de întâlniri sau efecte externe nerezolvate.

Pentru Symbai Meet selectează o prezentare existentă și configurează când se include linkul: confirmare și remindere sau numai remindere, conform schemei live. Separă salvarea întâlnirii de crearea camerei și livrarea invitației. Calendarul arată starea și problemele de livrare; gazda intră prin legătura întâlnirii.

Pentru transcriere locală, organizatorul are nevoie de Symbai Connect și componenta Dictate pregătită pe calculatorul de unde participă. Un executor AI online pe alt calculator nu dovedește această disponibilitate. Verifică starea transcrierii din întâlnire; dacă serviciul local nu este disponibil, nu afirma că discuția a fost transcrisă local. Invitarea, participarea, transcrierea și înregistrarea sunt etape distincte, fiecare cu setările și rezultatul ei. Pentru dictare și citirea răspunsurilor vezi [accesibilitate și voce](accesibilitate-voce.md).

## Agenda și lucrul zilnic

`get_crm_workspace` are secțiuni: `overview`, `cards`, `tasks`, `staff`, `report`, `teams`. Cardurile folosesc cursor; celelalte liste folosesc offset. Trimite numai filtrele acceptate de secțiune. Pentru întâlnirile online și fizice ale zilei folosește și `get_crm_calendar(section:meetings)`. Sarcinile și întâlnirile sunt obiecte distincte.

`book_crm_deal_meeting` programează pe cardul existent. Consimțământul clientului trebuie să fie real. Rezervarea poate pune confirmări și remindere în coada de trimitere; nu folosi clienți reali pentru probe nesolicitate.

`create_crm_calendar_blocks` blochează daily, training, concedii sau perioade ocupate, inclusiv recurent; nu anulează întâlnirile existente. `release_crm_calendar_block` eliberează o apariție sau seria, conform cererii.

`manage_crm_meeting` marchează ținută/absent sau cere reprogramare prioritară. **Prioritatea nu mută automat întâlnirea.** Păstrarea gazdei și redistribuirea sunt politici distincte. Nu declara reprogramarea încheiată înainte de verificarea noii date. `recover_crm_meeting_delivery` verifică efectele existente; `retry_crm_meeting_delivery` se folosește după reconciliere, fără a presupune că un mesaj sau eveniment extern nu s-a livrat.

## Biblioteca de materiale

`list_crm_materials` arată materialele accesibile. `save_crm_material` configurează titlul, categoria, descrierea, legătura/fișierul, accesul privat/general/selectat și persoanele/echipele. Listele de acces trimise înlocuiesc lista respectivă: păstrează destinatarii neafectați de cerere. La creare omite `config.id`, cu `expectedRevision:0`; `active:false` arhivează.

Încărcarea MCP acceptă cel mult 6 MiB înainte de codificare, cu `fileName` și `fileBase64` fără prefix `data:`. Omiterea ambelor păstrează fișierul. Pentru fișiere mai mari folosește încărcarea disponibilă în aplicație, fără a pretinde că MCP le acceptă. `read_crm_material_file` descarcă în fragmente verificate. `acknowledge_crm_material` confirmă lectura reviziei exacte numai dacă titularul a parcurs materialul; descărcarea de către asistent nu dovedește lectura angajatului.

## Academia: asistentul de training

Academia este pentru instruirea și evaluarea oamenilor. Este distinctă de asistenții personali din grupuri (`asistent_creeaza`) și de agenții AI de vânzări către clienți. Dreptul de a edita agenți AI nu acordă dreptul de a administra probele oamenilor.

1. Citește `get_crm_training_configuration`: configurația actuală, revizia, vocea și drepturile disponibile. Citește toate fragmentele de cunoștințe înainte de înlocuire; folosește `expectedRevision` pentru aceeași versiune.
2. Stabilește produsul, clienții vizați, discovery, demonstrația, obiecțiile, limitele afirmațiilor comerciale și criteriul de promovare. Nu inventa prețuri, contracte sau promisiuni de implementare.
3. Citește `list_crm_training_voices` și alege un ID real. `save_crm_training_configuration` salvează produsul, cunoștințele, vocea, pragul 1–10 și mediile demo HTTPS. Cere administrarea trainingului și dreptul de setări globale; simpla funcție de lider nu este suficientă pentru schimbarea produsului întregului brand.
4. `list_crm_team_training` verifică persoanele și probele autorizate; `assign_crm_training` atribuie subiect, domeniu și termen cu fus orar. Liderii au acces numai la echipele conduse; supervizorii autorizați au aria mai largă permisă.
5. Angajatul își citește atribuirea prin `list_crm_training` și își pregătește sesiunea cu `start_crm_training_session`, legând `assignmentId` când este cazul. Linkul întors duce în Academia; selectează brandul și continuă sesiunea pregătită din istoric. Pregătirea nu înseamnă că microfonul sau apelul au pornit.
6. `get_crm_training_session` citește rezultatul și dovezile permise. Nu inventa o notă și nu considera o sesiune incompletă drept probă promovată.

## Citire completă și reluare sigură

Urmează `pagination.nextArguments`, inclusiv `pageToken` pentru voci și `employeeCursor` pentru loturile mari de angajați. Lista de echipe este un sumar; citește membrii prin instrumentul indicat, inclusiv `list_crm_workspace_team_members` pentru echipe vizibile liderului. Cardul individual paginează colaboratorii și trimite către directorul separat de personal.

Pentru configurații calendar/fișiere: citește până la `nextOffset:null`, concatenează `content` în ordine, decodează base64 o singură dată și verifică `sha256`. La continuare transmite `expectedSha256` din primul fragment. Dacă versiunea diferă, reîncepe citirea; nu amesteca fragmentele. La training continuă cu `nextTextOffset` și aceeași revizie. Respectă `complete:false`: unele surse au limite de istoric, sarcini sau evenimente; o listă parțială nu dovedește absența datelor.

Fiecare modificare folosește un **`operationId` UUID stabil**. Repetarea exactă nu dublează efectul; alte argumente cu același UUID sunt refuzate. Un rezultat incert cere verificarea stării înainte de altă intenție; nu schimba UUID-ul pentru a forța repetarea. Dacă schema cere UUID și în configurația întâlnirii/sesiunii, folosește aceeași valoare. Pentru conflicte de revizie recitește și îmbină schimbarea cerută, fără suprascriere oarbă.

Linkul OAuth recuperat poate fi deja folosit sau expirat: verifică întâi conexiunea și cere alt link numai dacă autorizarea rămâne necesară. În raportul final distinge: configurație salvată, pagină activă, cont autorizat, întâlnire sincronizată și invitație livrată.
