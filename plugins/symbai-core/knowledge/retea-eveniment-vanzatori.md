# Rețea de eveniment: festival cu mai mulți vânzători

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă evenimentele la care vând **mai multe firme** pe standuri separate, fiecare cu instanța ei de POS, iar organizatorul decontează la final. Pentru petreceri și evenimente private organizate de tine (nunți, botezuri, meniuri de eveniment) vezi `meniuri-evenimente-si-meniul-zilei.md` și `crm-vanzari-pipeline.md`. Brățara de festival ține de portofelul evenimentului, nu de cartela restaurantului din `cartela-portofel-client.md`.
> **Fluxul complet, pas cu pas** (ediție nouă, bilete, aplicări, meniuri, hartă, live, rapoarte, P&L, partea standului): skill-ul [organizeaza-festival](../skills/organizeaza-festival/SKILL.md).

## Pe scurt

La un târg sau festival, organizatorul nu vinde — găzduiește. Fiecare stand e altă firmă, cu casa lui de marcat și obligațiile lui fiscale. Participanții plătesc de multe ori cu o brățară sau cartelă comună, deci banii intră într-un singur loc și trebuie împărțiți corect după aceea.

Rețeaua de eveniment leagă standurile de organizator: fiecare vânzător primește o credențială cu care instanța lui de POS se conectează, vânzările se adună pe eveniment, iar la final se face **decontul** — fiecare primește încasările lui minus comisionul și taxele convenite prin contract.

## Concepte

- **Eveniment** — festivalul sau târgul: nume public, cod scurt, unitatea organizatoare, perioada, moneda. Are un ciclu de viață (`draft` → `onboarding` → `live` → `settlement`), iar operațiile permise depind de el.
- **Vânzător (stand)** — o firmă participantă: denumire legală, CUI, cod de stand, zona în care e amplasat și **termenii comerciali** — comision procentual, taxă fixă, TVA pe taxă.
- **Credențiala standului** — secretul cu care instanța de POS a vânzătorului se autentifică la rețea. La înrolarea din ecran se generează și se arată **o singură dată**. La restaurantele Symbai (prin aplicări) și la barul propriu legătura se face fără ca secretul să treacă prin conversație.
- **Contract** — starea înțelegerii cu vânzătorul: `draft`, `sent`, `signed`, `expired`, `terminated`. Marcarea ca semnat cere denumire legală, CUI și referința documentului.
- **Decont (settlement)** — închiderea unei perioade: cât a încasat fiecare stand, ce s-a reținut, cât are de primit. Perioadele se înlănțuie — următorul decont pornește de unde s-a oprit ultimul.
- **Coada de trimiteri (outbox)** — la stand: plățile și bonurile vânzărilor cu brățara și confirmările de decont care n-au ajuns încă la organizator. Pot fi în așteptare, blocate fiscal, eșuate sau moarte după toate reîncercările.

## Paginile modulului

- **Operațiuni eveniment** `/event-operations` — la organizator: Live, Bilete, Recepție, Vendori, Aplicări vendori, Meniuri standuri, Recenzii vendori, Cashless, Tranzacții, Acces, Rapoarte, P&L, Decontări, Incidente, Alimentări anulate, Pagina publică, Setări (tabul cu `?tab=`). La restaurant: conectarea la un festival, cu `?connect=vendor`.
- **P&L festivaluri** `/event-pnl` · **Hartă festival 3D** `/festival-map`.
- La stand: **Meniuri la festivaluri** `/event-vendor` · **Aplicări la festivaluri** `/festival-applications`.
- Site-ul public: **festival.symbai.app**.

## Prin conexiune (MCP)

Uneltele organizatorului cer o conexiune nominală (contul unui angajat), cu drepturile paginii și acces la unitatea organizatoare. Grantul din Hub → Acces AI depinde de familie:

| Familie | Grant |
|---|---|
| Ediția (setup, bilete, pagina publică, program, aplicația), vendori și contracte, aplicări, recenzii, harta, decont | **Setări & Configurare** (`setari`). Harta și aprobarea meniurilor merg și cu **Rezervări & Clienți** / **CRM & Automatizări Marketing**, pentru planificatorul de evenimente. |
| P&L și publicul ediției | **Financiar & Contabilitate** (`financiar`) sau **Setări & Configurare** |
| Panoul live, biletele, raportul, comenzile din aplicație (la organizator) | **Financiar & Contabilitate** sau **Comenzi POS** (`comenzi_pos`) |
| PIN-ul la stand (`find_festival_order_by_pin`) | **Livrări & Flotă** (`livrari`) sau **Setări & Configurare** |
| Meniurile standurilor și comenzile din aplicație, la stand | **Produse & Meniuri** (`produse_meniu`) sau **Livrări & Flotă** |
| Alimentări anulate (listare) | **Financiar & Contabilitate**; rezolvarea cere dreptul de administrare a plăților |
| Aprobarea și plata decontului, eliberarea unei plăți reținute pe brățară | **Setări & Configurare** sau **Financiar & Contabilitate**; pe rol, dreptul de administrare a plăților (eliberarea cere și dreptul de configurare) |

Peste grant se aplică dreptul exact al paginii pe rolul angajatului.

**Ce vezi:**
- `list_event_network_events` — evenimentele, cu starea și numărul de vânzători. De aici iei `publicId`-ul.
- `get_festival_live` — panoul live: standurile cu `vendorPublicId`, vânzări, incidente deschise, acces pe zone, bilete.
- `list_event_network_settlements` — deconturile: cine cât a încasat, ce s-a reținut, cât are de primit, și **până unde s-a decontat deja**.
- `list_event_wallet_reconciliation_events`, `list_event_wallet_pending_reversals`, `list_event_wallet_reversals`, `get_event_wallet_loss_account` — alimentările cashless anulate de bancă și contul de pierderi.
- La stand: `get_event_vendor_setup` (pregătirea standului), `get_event_vendor_statement` (vânzări, comision estimat, ce s-a decontat și plătit), `list_event_network_outbox` (ce n-a ajuns la organizator — **răspunsul la „de ce n-a primit standul banii"**).

**Ce poți schimba:**
- `create_event_network_event` — creează evenimentul.
- Restaurantele Symbai se înrolează prin aplicări: `configure_festival_vendor_call` → `invite_festival_vendor` → `decide_festival_vendor_application` → `manage_festival_vendor_application` (`activate` creează standul).
- `connect_event_house_vendor` — conectează barul sau standul propriu al organizatorului.
- `update_event_network_vendor_details` — numele, tipul, standul și zona.
- `update_event_network_vendor_contract` — comision, taxă fixă, TVA, date legale, starea contractului.
- `suspend_event_network_vendor` — oprește un stand (`suspended` temporar, `closed` definitiv).
- `run_event_network_settlement` — închide o perioadă și calculează decontul. Cere `confirm:true`.
- `decide_event_network_settlement` — aprobă lotul (devine de plătit) sau îl anulează cât nu are plăți; `pay_event_network_settlement_vendor` — confirmă plata fiecărui stand pe tranzacția bancară, cu factura de comision; `release_festival_held_payment` — eliberează pe brățară o plată încă autorizată (standul n-a confirmat vânzarea). Toate: previzualizare, acord, `confirm:true` cu `idempotencyKey`.
- `resolve_event_wallet_reversal`, `resolve_event_wallet_reversal_intake`, `set_event_wallet_loss_account` — închiderea alimentărilor anulate și contul de pierderi, cu acord.
- La stand: `requeue_event_network_outbox` — repornește o operație failed sau dead, după ce cauza e rezolvată.

## ⚠ Ce NU se face prin conexiune, deliberat

În ecranul `/event-operations` rămân doar **vendorii care nu folosesc Symbai** și **credențialele** (rotirea și reactivarea unui stand). Ambele generează un secret și îl afișează o singură dată; un secret care trece printr-o conversație rămâne în ea. Regula platformei e că prin conexiune nu circulă credențiale. **Invitațiile gratuite** nu mai rămân acolo: `send_festival_invitation` le emite și le trimite pe email invitatului, cu PDF-ul biletelor. Codurile QR ajung doar în emailul lui, niciodată în conversație.

Consecință practică: după `suspend_event_network_vendor`, **reluarea nu se face din conexiune** — suspendarea revocă imediat credențiala, iar reconectarea cere o rotire din interfață.

## Greșeli frecvente

- **Decont cu perioada în viitor.** Refuzat: s-ar deconta încasări care încă nu s-au făcut.
- **Decont pe o perioadă deja închisă.** Refuzat ca „perioadă goală". Verifică întâi cu `list_event_network_settlements` până unde s-a ajuns — altfel ai plăti de două ori aceeași perioadă.
- **Contract marcat „signed" fără date legale.** Refuzat: un decont pe un contract fără parte identificabilă n-are pe ce se sprijini.
- **Două ediții cu același cod.** Își amestecă decontările. Verifică `list_event_network_events` înainte de a crea.
- **„Am suspendat standul, dar tot nu se poate reconecta."** Corect: suspendarea a revocat credențiala. Reconectarea cere rotirea ei din interfață, nu reactivarea statusului.
