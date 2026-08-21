# Rețea de eveniment: festival cu mai mulți vânzători

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.
> Acest fișier acoperă evenimentele la care vând **mai multe firme** pe standuri separate, fiecare cu instanța ei de POS, iar organizatorul decontează la final. Pentru petreceri și evenimente private organizate de tine (nunți, botezuri, meniuri de eveniment) vezi `meniuri-evenimente-si-meniul-zilei.md` și `crm-vanzari-pipeline.md`. Pentru cartela/brățara pe care plătesc participanții vezi `cartela-portofel-client.md`.

## Pe scurt

La un târg sau festival, organizatorul nu vinde — găzduiește. Fiecare stand e altă firmă, cu casa lui de marcat și obligațiile lui fiscale. Participanții plătesc de multe ori cu o brățară sau cartelă comună, deci banii intră într-un singur loc și trebuie împărțiți corect după aceea.

Rețeaua de eveniment leagă standurile de organizator: fiecare vânzător primește o credențială cu care instanța lui de POS se conectează, vânzările se adună pe eveniment, iar la final se face **decontul** — fiecare primește încasările lui minus comisionul și taxele convenite prin contract.

## Concepte

- **Eveniment** — festivalul sau târgul: nume public, cod scurt, unitatea organizatoare, perioada, moneda. Are un ciclu de viață (`draft` → `onboarding` → `live` → `settlement`), iar operațiile permise depind de el.
- **Vânzător (stand)** — o firmă participantă: denumire legală, CUI, cod de stand, zona în care e amplasat și **termenii comerciali** — comision procentual, taxă fixă, TVA pe taxă.
- **Credențiala standului** — secretul cu care instanța de POS a vânzătorului se autentifică la rețea. Se generează la înrolare și se arată **o singură dată**.
- **Contract** — starea înțelegerii cu vânzătorul: `draft`, `sent`, `signed`, `expired`, `terminated`. Marcarea ca semnat cere denumire legală, CUI și referința documentului.
- **Decont (settlement)** — închiderea unei perioade: cât a încasat fiecare stand, ce s-a reținut, cât are de primit. Perioadele se înlănțuie — următorul decont pornește de unde s-a oprit ultimul.
- **Coada de trimiteri (outbox)** — plățile și bonurile către vânzători care nu au ajuns încă: în așteptare, blocate fiscal, eșuate sau moarte după toate reîncercările.

## Pagina modulului

**Operațiuni eveniment** (`EventOperations`) — evenimentele, vânzătorii, decontările și coada de trimiteri.

## Prin conexiune (MCP)

Cer grantul **Setări & Configurare**.

**Ce vezi:**
- `list_event_network_events` — evenimentele, cu starea și numărul de vânzători. De aici iei `publicId`-ul.
- `list_event_network_settlements` — deconturile: cine cât a încasat, ce s-a reținut, cât are de primit, și **până unde s-a decontat deja**.
- `list_event_network_outbox` — ce nu a ajuns la vânzători. **Răspunsul la „de ce n-a primit standul banii".**

**Ce poți schimba:**
- `create_event_network_event` — creează evenimentul.
- `update_event_network_vendor_contract` — comision, taxă fixă, TVA, date legale, starea contractului.
- `suspend_event_network_vendor` — oprește un stand (`suspended` temporar, `closed` definitiv).
- `run_event_network_settlement` — închide o perioadă și calculează decontul. Cere `confirm:true`.

## ⚠ Ce NU se face prin conexiune, deliberat

**Înrolarea unui vânzător nou și rotirea credențialei** rămân în interfață. Ambele generează un secret și îl afișează o singură dată; un secret care trece printr-o conversație rămâne în ea. Regula platformei e că prin conexiune nu circulă credențiale.

Consecință practică: după `suspend_event_network_vendor`, **reluarea nu se face din conexiune** — suspendarea revocă imediat credențiala, iar reconectarea cere o rotire din interfață.

## Greșeli frecvente

- **Decont cu perioada în viitor.** Refuzat: s-ar deconta încasări care încă nu s-au făcut.
- **Decont pe o perioadă deja închisă.** Refuzat ca „perioadă goală". Verifică întâi cu `list_event_network_settlements` până unde s-a ajuns — altfel ai plăti de două ori aceeași perioadă.
- **Contract marcat „signed" fără date legale.** Refuzat: un decont pe un contract fără parte identificabilă n-are pe ce se sprijini.
- **Două ediții cu același cod.** Își amestecă decontările. Verifică `list_event_network_events` înainte de a crea.
- **„Am suspendat standul, dar tot nu se poate reconecta."** Corect: suspendarea a revocat credențiala. Reconectarea cere rotirea ei din interfață, nu reactivarea statusului.
