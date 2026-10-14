---
name: coordoneaza-implementarile
description: Coordonează implementările Symbai ale implementatorului conectat — ce dosare are, ce întrebări îi pun asistenții de implementare, îndrumarea trimisă asistenților (unul sau mai mulți deodată), răspunsul la întrebări, pornirea/pauza asistentului, sarcinile omului și persoanele clientului (cine e cine pe WhatsApp și în grupul intern, fără dubluri). La „ce am de făcut la implementări”, „ce mă întreabă asistentul”, „spune-i asistentului de la X să…”, „răspunde-i că…”, „pune pe pauză implementarea”, „cine e Ana pe grupul clientului”, „notează că Y aprobă meniul”.
---

# Coordonează implementările

Implementatorul lucrează cu câte un asistent de implementare pentru fiecare client. Aceleași operații există în trei locuri, cu aceleași drepturi: **Symbai Staff → Mai multe → Implementări**, pagina web **Implementări** (`/implementations`) și uneltele MCP de mai jos. Serverul verifică desemnarea din Hub pe firma-sursă, atât pentru implementator, cât și pentru coordonator. Rolul de administrator în POS nu ține loc de desemnare: fără ea, refuzul este „Nu ai mandat de implementare în această firmă.”, iar o desemnare pe altă firmă sau una retrasă nu contează. Dacă o unealtă refuză, explică motivul primit și cere desemnarea echipei Symbai; nu căuta altă cale.

## Unelte

| Unealtă | Folosește pentru |
|---|---|
| `implementari_lista` | dosarele active (`scope: mine` sau `team` pentru coordonatori): client, stare, termen, starea asistentului, `myQuestions`, sarcini pentru om, ultimul mesaj, progres |
| `implementare_dosar` | `sectiune: conversatie` — mesajele cu asistentul (paginare cu `nextBefore`; `limita` 1–40 mesaje pe pagină, implicit 15, de la cel mai nou), întrebările (`canReply`), sarcinile deschise; `sectiune: persoane` — persoanele identificate și cine nu e încă identificat pe WhatsApp / în grupul intern, cu sugestii „aceeași persoană” |
| `implementare_scrie_asistentului` | îndrumarea omului către asistent; pornește asistentul. `requestId` UUID nou pentru fiecare mesaj și fiecare dosar; același ID la reîncercare |
| `implementare_raspunde_intrebarii` | răspunsul omului la o întrebare cu `canReply=true` (`questionId`, `expectedRevision` = `revision` citit) |
| `implementare_comanda` | `porneste`, `pauza` / `reia` (cu `expectedRevision` al dosarului), `sarcina_asistent` (titlu, detalii, `requestId`), `sarcina_facuta` (`workId`, `expectedRevision` al sarcinii, ce s-a verificat) |
| `implementare_persoana` | persoana clientului: nume, rol („cine ce face”), apartenență (`customer`, `symbai_team`, `unspecified`), notiță, identitățile WhatsApp (din `whatsapp[]`) și contul intern (`employeeId` din `internal[]`) |

## Reguli

- **Răspunzi numai cu ce a spus omul.** Nu inventa răspunsul la o întrebare a asistentului și nu trimite îndrumări pe care utilizatorul nu le-a cerut. Dacă nu ai răspunsul, întreabă-l pe om.
- **Începe cu `implementari_lista`**, apoi deschide dosarul potrivit după nume. Nu ghici `caseId`.
- **Mai mulți clienți deodată:** apelează `implementare_scrie_asistentului` o dată pe dosar, fiecare cu `requestId` propriu, și raportează la care a reușit.
- **Persoane fără dubluri:** citește `implementare_dosar` cu `sectiune: persoane`. Aceeași persoană pe WhatsApp și în grupul intern se leagă într-o singură fișă. Dacă serverul spune că o identitate e deja la altcineva, actualizează acea persoană; nu crea una nouă. Rolul și notița ajung la asistent la fiecare rulare; ele nu dau drept de confirmare a etapelor.
- **Ce primește asistentul la fiecare rulare:** ultimele îndrumări scrise de oameni sau de un coordonator (până la 8), cu marcaj pentru cele apărute după ultima lui rulare încheiată. Cea mai nouă ajunge mereu întreagă; când sunt foarte lungi, cele mai vechi pot ajunge scurtate, deci o îndrumare importantă se scrie scurt și la obiect. Când asistentul își recitește dosarul, propriile notițe de progres îi apar scurtate, ca un jurnal lung să nu ascundă îndrumările oamenilor. Nu repeta o îndrumare doar pentru că nu apare în primele mesaje: citește pagina următoare.
- **Revizii:** după un conflict („s-a schimbat între timp”) recitește dosarul și reia cu revizia nouă; nu forța.
- Operațiile sunt rezervate omului. Într-o rulare de asistent (numit sau personal) uneltele refuză intenționat.
