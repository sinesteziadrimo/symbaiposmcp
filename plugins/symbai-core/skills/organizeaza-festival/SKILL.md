---
name: organizeaza-festival
description: Festivalul în Symbai (Event OS), pentru ORGANIZATOR și pentru STANDUL care vinde la festivalul altcuiva — ediție nouă sau „ediția de anul viitor”, bilete, abonamente, early bird, coduri de reducere, zone de acces/VIP, pagina de pe festival.symbai.app, line-up și program pe scene, aplicația participanților (pagina de start, sponsori, înscriere, taburi), vendori și aplicări (invită restaurantul, contractul vendorului), aprobarea meniurilor standurilor, harta 3D a festivalului, comenzi din aplicație și PIN la stand, brățări cashless (reîncărcare, refund după festival), incidente, „câte bilete am vândut”, raportul și decontul de spectacole, P&L, buget, sponsori, publicul pe vârste, recenziile și întrebările standurilor, decontul cu vendorii (aprobare, plata fiecărui stand), banii blocați pe brățară, „ce mi-a decontat festivalul”. NU săli/parcuri 3D (event-studio-3d), NU nunți și catering (CRM, meniuri de eveniment).
---

# Organizează festivalul — organizatorul și standurile

Festivalul are mai multe firme pe același teren. **Organizatorul** vinde bilete, ține accesul, brățările și aplicația participanților. **Standurile** vând mâncare și băutură, fiecare cu casa lui. Aproape tot are unealtă dedicată prin conexiune. Ecranul rămâne pentru banii încasați la casă, cititorul RFID și credențiale.

Nu e skill-ul potrivit pentru: săli, hoteluri sau parcuri desenate în Event Studio (`event-studio-3d`); nunți, botezuri, catering și meniuri de eveniment (`gestioneaza-crm`, `knowledge/meniuri-evenimente-si-meniul-zilei.md`); cartela RFID a restaurantului (`knowledge/cartela-portofel-client.md`).

## Înainte de orice

1. **Cine întreabă.** Două roluri, cu identificatori diferiți:

| Rol | Cine | Identificator | Pornești cu |
|---|---|---|---|
| **Organizator** | firma cu activitatea „evenimente”; unitatea organizatoare (brand + locație) | `eventPublicId`, din `list_event_network_events` | `get_festival_setup` (ce lipsește), `get_festival_live` (panoul live) |
| **Stand / vendor** | restaurant, bar, food truck sau magazin care vinde la festivalul altcuiva, legat printr-o conexiune | `connectionId`, din listarea fără argument a uneltelor standului | `get_event_vendor_setup` (pregătirea), `get_event_vendor_statement` (vânzări și decont) |

Aceeași firmă poate avea ambele roluri: barul propriu al organizatorului e tot un stand (`connect_event_house_vendor`).

2. **Unealta.** Dacă nu o vezi în catalog, caut-o cu `cauta_tool` („festival …”, „stand …”) și citește schema. Dacă instanța nu o are (versiune mai veche), dă omului calea din ecran.
3. **Conexiunea.** Uneltele organizatorului cer o conexiune nominală (contul unui angajat), cu drepturile paginii și acces la unitatea organizatoare. Grantul din Hub → Acces AI depinde de familie; tabelul e în `knowledge/retea-eveniment-vanzatori.md`. „Permisiune insuficientă” → spune ce drept lipsește; nu ocoli.
4. **Concepte** (eveniment, stand, contract, decont, coada de trimiteri): `knowledge/retea-eveniment-vanzatori.md`.

## Reguli

- **Previzualizare întâi.** Fără `confirm`, uneltele arată ce ar face. Trimiți `confirm:true` doar după acordul explicit al omului pentru: sume, prețuri, comisioane, reguli cashless, publicări, anulări, decont.
- **Recitește după fiecare scriere** (`get_festival_setup`, `get_festival_live` sau lista uneltei) și spune ce s-a schimbat.
- **Cheile de operație** (`installationId`, `idempotencyKey`) se păstrează identice la reîncercare. După un timeout, recitește înainte să repeți.
- **Fără SQL de scriere.** Nu folosi niciodată `execute_sql_write` pe tabelele festivalului (`event_*`, `festival_*`). Dacă lipsește o unealtă, spune-o și deschide tichet (`trimite_ticket_symbai`).
- **Brățara de festival nu e cartela restaurantului.** Brățara ține de portofelul evenimentului. `get_card_balance`, `top_up_card` și `refund_card_balance` sunt pentru cartela clientului unui restaurant sau parc, nu pentru brățări. Soldul unei brățări: `find_festival_tickets` (detaliul comenzii). Banii de pe brățări: `get_festival_report`.
- **Credențialele și invitațiile private nu trec prin conversație.** Nu le cere, nu le afișa.
- **Unitățile banilor.** Alimentările anulate sunt în bani (100 bani = 1 leu). În P&L sumele sunt fără TVA; plățile P&L se trec cu TVA.

## Ediție nouă — în ordine

1. `list_event_network_events` — verifică că ediția nu există deja. Codul trebuie să fie unic: două ediții cu același cod își amestecă decontările.
2. `create_event_network_event` — nume, cod, unitatea organizatoare, perioada, moneda.
3. `update_festival_edition` — perioada, fusul orar, ora la care începe ziua de festival, seria și modul fiscal al biletelor, autoritatea pentru taxa de spectacol. Regulile cashless: reîncărcarea minimă, soldul maxim, rambursarea și termenul ei, soldul nerevendicat (`refund` / `donate` / `expire`), reîncărcarea online, bonusul pe brățară pentru datele de contact lăsate la casă. Regulile cashless schimbă banii participanților: confirmă-le.
4. `upsert_festival_access_zone` — zonele (GA, VIP, BACKSTAGE), **înaintea biletelor**.
5. `upsert_festival_ticket_type` — abonamente, bilete de zi, VIP, copii, invitații. Confirmă prețurile.
6. `upsert_festival_promo_code` / `list_festival_promo_codes` — early bird, coduri de reducere, limite.
7. `set_festival_public_page` — pagina de pe festival.symbai.app: descriere, line-up, FAQ, locație, rețele. Cu `organizer` completezi și profilul organizatorului, comun tuturor edițiilor brandului. `published:true` doar la cererea omului.
8. `set_festival_programme` — programul pe scene și ore, din aplicație și de pe site.
9. `set_festival_app_content` + `set_festival_app_experience` — pagina de start (sponsori, reclame, informații practice), înscrierea, taburile. Cer portalul activ pe unitatea organizatoare: `configure_portal_general` (skill `configureaza-portal`).
10. Harta: `create_festival_map` sau `duplicate_festival_map` (de la harta ediției trecute) → `edit_festival_map` → `publish_festival_map`. Legătura cu ediția: `link_festival_map_event`. Citire: `list_festival_maps`, `get_festival_map`.
11. P&L: `copy_festival_pnl_budget` (din ediția trecută sau un șablon small/medium/large) → `set_festival_pnl_settings` (participanți estimați, capacitate, rezervă, costul mărfii la bar, plătitor de TVA, bugetele de venituri) → `add_festival_pnl_line` / `update_festival_pnl_line`.
12. Vendorii (secțiunea de mai jos).
13. La final, `update_festival_edition` cu `status:"live"`. Trece doar cu toate verificările de pregătire îndeplinite; `get_festival_setup` arată ce lipsește.

## Vendori (standuri)

| Omul vrea… | Unealta |
|---|---|
| „Ce trebuie să trimită restaurantele / deschide apelul” | `configure_festival_vendor_call` (tipuri de mâncare și locuri, meniul cerut, documente, poze, întrebări, taxe, contract) |
| „Invită restaurantul X” (folosește Symbai) | `invite_festival_vendor` (adresa lui, ex. restaurant.symbai.app) |
| „Cine a aplicat / ce lipsește din aplicare” | `get_festival_vendor_applications` (cu `applicationId` pentru detaliu) |
| „Aprobă / cere completări / refuză” | `decide_festival_vendor_application` |
| „Trimite contractul / am primit documentul / activează standul” | `manage_festival_vendor_application` (`send_contract`, `confirm_condition`, `activate` = creează standul) |
| „Conectează barul nostru” | `connect_event_house_vendor` |
| „Schimbă numele, zona sau standul / e 18+” | `update_event_network_vendor_details` (regula 18+ se vede în `get_festival_live`) |
| „Schimbă comisionul / marchează contractul semnat” | `update_event_network_vendor_contract` |
| „Oprește standul” | `suspend_event_network_vendor` |

Rămân în ecranul `/event-operations` → Vendori: restaurantele care nu folosesc Symbai și reactivarea unui stand suspendat. Ambele generează credențiale.

## Meniurile standurilor

`get_festival_vendor_menus` (panoul, apoi `vendorPublicId` pentru produse) → `decide_festival_vendor_menu_items` (approve / reject cu motiv / hide / restore, cu `itemPublicId` + `versionHash`). Regula „Aprob eu produsele”: `set_festival_vendor_menu_approval`. Barul propriu nu are nevoie de aprobare.

## În timpul festivalului

| Omul vrea… | Unealta |
|---|---|
| „Cum merge festivalul acum” (vânzări, standuri, acces pe zone, bilete) | `get_festival_live` |
| „Caută biletul lui X / ce are pe brățară / a intrat?” | `find_festival_tickets` (după nume, email, telefon, cod; detaliul comenzii cu biletele, check-in-ul și soldul brățării; fără QR) |
| „Anulează rezervarea de bilete neplătită” | `cancel_festival_ticket_order` (doar comenzi neplătite, cu acord) |
| „S-a întâmplat ceva la standul X / închide incidentul” | `manage_festival_incident` (`create` / `acknowledge` / `resolve` / `dismiss`) |
| „Comenzile din aplicație / oprește-le pe tot festivalul” | `get_festival_app_orders`, `set_festival_app_order_policy` |
| „Trimite-i lui X o invitație / două invitații VIP pe email” | `send_festival_invitation` (invitat, email, biletele câte unul pe persoană, limba ro/en; 0 lei, din cota tipului; emailul are PDF-ul cu un QR pe persoană, iar QR-urile nu trec prin conexiune). Cu `orderPublicId` trimite o invitație deja emisă (de ex. din ecran, fără email) sau la o adresă corectată. Arată omului invitatul și textul emailului din previzualizare; `confirm:true` doar după acordul lui, cu `idempotencyKey`. Rezultat nesigur → nu retrimite, întreabă dacă a ajuns |
| „Schimbă textul emailului cu invitația” | `update_festival_edition` cu `invitationEmail` (pe limbă, `ro`/`en`: `subject`, `greeting`, `message`, `signature`; variabile `{nume}`, `{festival}`, `{organizator}`, `{cod}`, `{perioada}`). Textul salvat e în `get_festival_setup` (`edition.invitationEmail`). Trimiți doar câmpurile care se schimbă: un câmp gol revine la textul implicit, `null` pe o limbă o readuce toată. Codul, biletele și instrucțiunile despre QR rămân fixe. În ecran: `/event-operations` → tabul Setări → Emailul invitațiilor. Confirmă textul cu omul: pleacă la invitați |
| „Eliberează banii blocați pe brățară / standul a anulat comanda” | `release_festival_held_payment` (plata din `platiRetinute` în `get_festival_live`; doar cât e încă autorizată, nu după ce standul a confirmat sau a încasat vânzarea; cu motiv, acord și `idempotencyKey`) |
| „Recenziile și întrebările standurilor” | `get_festival_vendor_reviews` (recenzii, plus întrebările cu `questionPublicId` / `answerPublicId`) |
| „Publică / ascunde recenzia / respinge raportările” | `moderate_festival_vendor_review` (`publish` / `hide` / `restore` / `dismiss_reports`; textul clientului nu se modifică) |
| „Răspunde la recenzia barului nostru / la întrebarea clientului” | `respond_festival_vendor_reviews` (`reply` = răspunsul public doar la recenziile barului sau standului propriu; `answer` = răspunsul oficial la o întrebare publică; `hide` / `restore` = o întrebare sau un răspuns) |
| „Setează recenziile (poze, întrebări, nota pe toate edițiile)” | `configure_festival_vendor_reviews` |

**Bilete vândute pe alte platforme** (iaBilet, LiveTickets, Eventbrite): `import_festival_external_tickets` — întâi previzualizarea, apoi `confirm:true`.

## După festival — rapoarte și bani

| Omul vrea… | Unealta |
|---|---|
| „Câte bilete am vândut / decontul de spectacole / cât s-a consumat pe brățări” | `get_festival_report` (bilete pe tip, canal și zi; decontul pentru taxele locale; acces; cashless) |
| „Cine a venit / publicul pe vârste / ce au consumat” | `get_festival_audience` |
| „P&L-ul festivalului / profit / buget / sponsori” | `get_festival_pnl` |
| „Am plătit factura / am încasat sponsorizarea” | `record_festival_pnl_payment` (suma cu TVA) |
| „Leagă factura furnizorului de festival” | `link_festival_invoice` |
| „Scoate intrarea greșită din P&L” | `remove_festival_pnl_entry` (`kind` line = o linie fără plăți și fără facturi legate; payment = o plată trecută greșit, cu `paymentId` din `get_festival_pnl`; invoice = o factură legată greșit; previzualizare, apoi `confirm:true`) |
| „Setează participanții estimați, rezerva, barul propriu” | `set_festival_pnl_settings` |
| „Fă decontul cu vendorii” | `list_event_network_settlements` (până unde s-a decontat) → `run_event_network_settlement` (produce obligații de plată: arată perioada, cere acord) |
| „Aprobă / anulează decontul” | `decide_event_network_settlement` (`approve`: lotul devine de plătit, cere contractele semnate și vânzările contabilizate; `void`: doar un lot fără plăți, vânzările revin în următorul decont) |
| „Am plătit standul X / confirmă plata decontului” | `pay_event_network_settlement_vendor` (previzualizarea arată tranzacțiile bancare potrivite; confirmi cu `bankTransactionId`, numărul facturii de comision și `idempotencyKey`; barul propriu se compensează intern) |

**Decontul și plățile reținute** cer dreptul de administrare a plăților pe rolul angajatului (eliberarea cere și dreptul de configurare). Toate trei: previzualizare, acordul omului, apoi `confirm:true` cu un `idempotencyKey` (UUID) nou, păstrat identic la reîncercare. După un răspuns pierdut recitește lotul sau plata; aceeași cheie nu retrimite operația.

**Alimentări anulate de bancă** (chargeback pe reîncărcări): `list_event_wallet_reconciliation_events` → `list_event_wallet_pending_reversals` / `list_event_wallet_reversals` → `resolve_event_wallet_reversal` sau `resolve_event_wallet_reversal_intake`, cu acord. Contul de pierderi: `get_event_wallet_loss_account` / `set_event_wallet_loss_account`.

## Standul — restaurantul care vinde la festival

| Omul vrea… | Unealta |
|---|---|
| „Suntem pregătiți pentru festival?” | `get_event_vendor_setup` |
| „La ce festivaluri am aplicat / am o invitație” | `get_my_festival_applications`, `manage_my_festival_application` (start, accept, update, submit, fulfill_condition…) |
| „Ce meniu duc la festival / trimite-l organizatorului” | `get_event_vendor_menus`, `sync_event_vendor_menu` |
| „Pornește comenzile din aplicație / pauză 15 minute” | `get_festival_app_order_settings`, `set_festival_app_order_settings`, `pause_festival_app_orders` |
| „Clientul spune PIN-ul 4821” | `find_festival_order_by_pin` → `mark_channel_order_picked_up` |
| „Cât am vândut / cât ne reține / ce ne-a decontat festivalul” | `get_event_vendor_statement` (vânzări, comision estimat, decontat și plătit) |
| „Recenziile standului / răspunde la recenzie” | `manage_event_stand_reviews` (`list` / `reply` / `report` / `answer`) |
| „De ce n-a ajuns plata / bonul la organizator” | `list_event_network_outbox` → `requeue_event_network_outbox` (doar operațiile failed sau dead, după ce cauza e rezolvată) |

Conectarea inițială a standului: responsabilul restaurantului importă invitația în `/event-operations?connect=vendor`. Documentele aplicării (PDF, poze) se încarcă din `/festival-applications`.

## Rămân în ecran

Spune-i omului calea. Nu ocoli prin SQL.

- Încasarea biletelor la casă (bani + bon fiscal).
- Legarea și transferul brățării, scanarea la poartă: cer cititorul RFID.
- Credențialele standurilor: vendor fără Symbai, reactivare după suspendare.
- Tipărirea biletelor la casă: prin conexiune nu ies coduri QR. Invitația gratuită pleacă pe email cu `send_festival_invitation`.

## Pagini

| Pagina | Ce e acolo |
|---|---|
| `/event-operations` | Operațiuni eveniment. Taburi (`?tab=`): Live `overview`, Bilete `tickets`, Recepție `check-in`, Vendori `vendors`, Aplicări vendori `vendor-applications`, Meniuri standuri `vendor-menus`, Recenzii vendori `vendor-reviews`, Cashless `cashless`, Tranzacții `transactions`, Acces `access`, Rapoarte `reports`, P&L `pnl`, Decontări `settlements`, Incidente `incidents`, Alimentări anulate `wallet-reconciliation`, Pagina publică `public-page`, Setări `settings` |
| `/event-pnl` | P&L festivaluri, pe toate edițiile |
| `/festival-map` | Harta 3D a festivalului |
| `/portal-config?tab=app` | Aplicația participanților (portalul unității organizatoare) |
| `/event-vendor` | La stand: meniurile la festivaluri |
| `/festival-applications` | La stand: aplicările la festivaluri |
| festival.symbai.app | Site-ul public al edițiilor și al organizatorilor |
