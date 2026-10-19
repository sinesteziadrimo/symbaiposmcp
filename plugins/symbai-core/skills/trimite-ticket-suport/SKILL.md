---
name: trimite-ticket-suport
description: Ticket către echipa Symbai (problemă tehnică, reclamație, sugestie, cerere de suport) prin trimite_ticket_symbai; verifică întâi tichetele firmei (list_my_symbai_tickets) și completează-l pe cel existent; trimite AUTOMAT o sugestie când userul se chinuie, ceva durează nejustificat sau lipsește un tool. La „nu merge X în Symbai", „am o problemă cu aplicația", „vreau să raportez ceva", „ar fi util să existe…", „ce tichete am deschise", „ce a răspuns Symbai la tichet".
---

# Trimite un ticket către echipa Symbai

Două situații diferite — tratează-le diferit:

Pentru a decide dacă e bug, lipsă de tool sau doar pași greșiți, folosește standardul din `knowledge/agent-operare-avansata.md`: încearcă întâi citirea/diagnosticul real, apoi trimite ticket cu dovezi și workaround.

## Întâi: tichetele existente ale firmei

Înainte de un tichet nou, apelează `list_my_symbai_tickets` (implicit cele deschise; `status: "done"` pentru rezolvate, `query` pentru o căutare, `publicId` pentru un tichet cu toate mesajele lui). Dacă problema e deja raportată, trimite informația nouă pe același fir cu `trimite_ticket_symbai` + `appendTo: "SYM-NNNNN"` — un tichet rezolvat se redeschide, unul închis nu mai primește completări. Tot de aici răspunzi la „ce a zis Symbai la tichetul meu?” sau „am raportat deja asta?”: arată statusul și ultimul răspuns al echipei. Unealta e disponibilă după actualizarea instanței și pentru proprietar sau un utilizator cu acces la setări; dacă lipsește, continuă cu pașii de mai jos.

## Tichete rezolvate: anunță și repornește ce era oprit

Când lucrezi pe o problemă deja raportată sau omul întreabă de tichete, citește și `list_my_symbai_tickets(status: "done")`, plus tichetele deschise vechi pe același subiect. Pe POS 19.3.820 sau mai nou, rândul unui tichet rezolvat arată corectura livrată, de ex. „rezolvat în POS 19.3.812, unealta X”; dacă instanța rulează o versiune mai veche, adaugă „aici rulează încă POS …: funcționează după actualizare”. Lista tichetelor deschise are și „Rezolvate recent”. Spune-i omului ce s-a rezolvat, în ce versiune și ce folosește de acum.

1. Caută din nou funcția cerută în tichet (`cauta_tool` cu intenția lui). Poate exista deja, chiar dacă tichetul n-a primit răspuns. Dacă o găsești, o folosești și completezi tichetul (`appendTo`): „merge acum prin X”. Dacă rezolvarea vine într-o versiune mai nouă decât cea instalată, spune-i că funcția apare la actualizare și dă-i calea manuală până atunci.
2. Ce fusese oprit sau ocolit din cauza problemei (o sarcină pe pauză, o automatizare, o monitorizare, date puse provizoriu): spui că s-a rezolvat și propui revenirea: `asistent_comanda` cu `resume-task`, `update_automation_rule`, `update_watch {active:true}` sau `set_routine_active`, plus corectarea datelor provizorii. Execuți numai după „da”-ul explicit al omului, apoi verifici prima rulare.
3. Nu declari rezolvat doar din statusul tichetului: verifici pe un caz real.

## A. Utilizatorul cere explicit (problemă / reclamație / suport)

1. Adună detaliile: CE a încercat, CE s-a întâmplat, CE se aștepta să se întâmple. La probleme, include pașii de reproducere și unde apare (pagina, modulul).
2. La probleme: încearcă ÎNTÂI să rezolvi tu (verifică datele cu tool-urile de citire, explică pașii corecți din `knowledge/`). Deschide ticket doar dacă chiar e nevoie de echipa Symbai.
3. Întreabă-l dacă vrea să fie anunțat pe email când echipa răspunde sau rezolvă (opțional — `emailContact`). Pe conexiunea nominală (POS 19.3.820 sau mai nou) numele și emailul de contact se iau din fișa angajatului: nu le mai cere. Trimite `emailContact` doar când vrea altă adresă; numai atunci primește și confirmarea de primire pe email.
4. Confirmă pe scurt ce trimiți (rândurile pe limba omului, vezi [Cum scrii descrierea](#cum-scrii-descrierea)), apoi apelează `trimite_ticket_symbai`:
   - `tip` — `problema` (nu funcționează), `reclamatie` (nemulțumire), `suport` (vrea ajutor de la echipa tehnică)
   - `titlu` — rezumat scurt, ex. „Raportul de vânzări nu se încarcă pe tabletă". Când problema oprește lucrul (casa, comenzile la bucătărie, consumul, stocul), titlul spune impactul, de ex. „Consumul nu se mai generează din <dată> la <unitate>”.
   - `descriere` — întâi 2–3 rânduri pe limba omului, apoi detaliile de la pasul 1 sub „Detalii tehnice” ([Cum scrii descrierea](#cum-scrii-descrierea)); la un blocaj, ce s-a oprit, de când și la ce locație. Când descrierea arată că vânzarea, casa sau fiscalul, consumul ori stocul s-au oprit, tichetul primește automat prioritate mai mare; nu scrie „URGENT” când nimic nu e oprit.
   - `numeUtilizator` — numele persoanei cu care lucrezi, nu al titularului conexiunii (întreabă-l dacă nu îl știi)
   - `emailContact` — emailul de la pasul 3, dacă l-a dat; tot al persoanei cu care lucrezi
5. După trimitere îi spui omului, pe scurt și pe limba lui, ce ai raportat: aceleași rânduri de deasupra detaliilor tehnice, fără coduri. Apoi referința primită (ex. **SYM-00042**) și contactul din răspuns („Contact pentru răspuns: …”). Dacă răspunsul spune că nu există email de contact, îi spui că răspunsul echipei se vede cu `list_my_symbai_tickets`; nu promite email.

### Cum scrii descrierea

Tichetul îl citesc și omul, și echipa tehnică. Omul trebuie să-l înțeleagă fără tine, așa că descrierea are două părți:

1. **Sus, 2–3 rânduri pe limba omului**, fără coduri, ID-uri sau nume interne:
   - ce nu merge;
   - de când;
   - ce a rămas oprit (și ce merge normal);
   - ce poate face omul între timp.
2. **Dedesubt, după rândul „Detalii tehnice:”**: pașii de reproducere, mesajul exact de eroare, codurile, ID-urile documentelor și ce ai verificat deja.

Exemplu:
> Nu se poate scădea din stoc un produs de la Bar: aplicația refuză ieșirea.
> Se întâmplă de ieri seară. Vânzările și restul produselor merg normal; doar ieșirile acestui produs stau.
> Până răspunde echipa, nu se fac corecturi pe acest produs; numărătoarea se notează pe hârtie.
>
> Detalii tehnice: …

Scrii cauza numai dacă ai dovedit-o; altfel spui ce ai văzut. Dacă omul te întreabă ce înseamnă tichetul, rescrii rândurile de sus mai simplu, nu îi explici detaliile tehnice.

## B. Sugestie de îmbunătățire — trimite AUTOMAT

Trimite singur, fără să aștepți să ți se ceară, când observi pe parcursul sesiunii că:
- utilizatorul s-a chinuit să facă ceva (multe încercări, ocolișuri, pași manuali repetitivi);
- o sarcină a durat nejustificat de mult din cauza platformei;
- un tool MCP sau o funcție care lipsește l-ar fi ajutat concret și e ceva ce Symbai chiar ar putea implementa.

Cum trimiți: `trimite_ticket_symbai` cu `tip: "sugestie"`, `titlu` = ideea pe scurt, `descriere` = ce sarcină a fost grea, cum a ocolit-o utilizatorul și ce funcție/tool ar rezolva-o (tot cu rândurile pe limba omului deasupra detaliilor tehnice), `numeUtilizator` = în numele cui (utilizatorul curent), plus **`dedupeKey`** = un slug stabil al ideii (ex. `export-stoc-excel`) — dacă retrimiți aceeași idee, se adaugă la ticketul existent în loc să facă duplicat.

După trimitere, anunță-l pe scurt pe utilizator: „Am trimis echipei Symbai sugestia X (referința SYM-NNNNN) — văd că te-ar ajuta."

## Reguli

- NU confunda cu feedback-ul clienților restaurantului (recenzii) sau cu ticketele clienților proprii din CRM — `trimite_ticket_symbai` e DOAR pentru platforma Symbai în sine.
- Pentru probleme și reclamații cere acordul utilizatorului înainte de trimitere; doar sugestiile (B) se trimit automat, dar îl anunți după.
- Maxim o sugestie automată per idee per sesiune — folosește `dedupeKey` consecvent.
- Tool-ul nu cere permisiune de scriere pe un modul, dar cere o conexiune MCP Symbai autentificată și încărcată în sesiune. Licența validă din Connect nu dovedește că sesiunea MCP funcționează.
- Dacă lipsește tot serverul Symbai, verifică o singură dată conexiunea. După autentificare, dacă uneltele încă lipsesc, reîncarcă serverul MCP sau repornește aplicația asistentului și reia conversația existentă; nu repeta căutarea în toate modulele și nici login-ul la nesfârșit. Păstrează descrierea tichetului ca draft, fără să pretinzi că a fost trimis. Dacă legătura nu poate fi restabilită, oferă draftul pentru support@symbai.app; trimiterea prin email cere acordul utilizatorului.
- Tichetul este trimis numai când primești referința lui. Răspunsurile echipei se citesc cu `list_my_symbai_tickets` și vin și pe emailul lăsat, dacă a fost dat.
