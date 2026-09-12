# Consumul asistentului și continuitatea conversației

Când utilizatorul spune că a atins limita după puține întrebări, verifică ora, aplicația, modelul și dacă rulează simultan monitorizări WhatsApp sau alte conversații. Numărul întrebărilor nu arată singur volumul de lucru. O întrebare poate cere mai multe citiri și răspunsuri ale modelului.

**Catalogul disponibil nu este contextul încărcat.** Un număr mare de unelte în `verifica_conexiune` arată ce poate folosi asistentul. Nu afirma că toate definițiile au fost încărcate. Dacă aplicația oferă căutare de unelte, caută funcția necesară și încarcă definiția aleasă. Nu cere catalogul complet sau schema tuturor tabelelor pentru o întrebare punctuală.

**Păstrează datele utile.** Pentru un total, cere raportul/agregarea potrivită. Pentru detalii citește paginile necesare, fără să tratezi o pagină incompletă ca rezultat complet. Nu repeta aceeași citire dacă datele și întrebarea nu s-au schimbat. Nu înlocui dovezile cu presupuneri ca să economisești consum.

**Read all pentru investigații, cu schema reutilizată.** Dacă ai de comparat multe produse, rețete sau documente, citește setul și relațiile într-o interogare SQL filtrată. Nu face câte o cerere de detaliu pentru fiecare element dacă poți obține împreună câmpurile relevante. `describe_database_table` poate accepta `tableNames` pentru până la 8 tabele; verifică schema uneltei, păstrează rezultatul în sarcină și nu relista întreaga bază înaintea fiecărui SELECT. Pentru un singur obiect, caută după nume/ID. Pentru vânzări nete, FIFO și profit, folosește rapoartele care aplică regulile de business.

**Încarcă ghidul domeniului cerut.** Dacă `citeste_instructiuni_agent` acceptă `subiect`, alege tema necesară și reutilizeaz-o. Nu încărca manualul complet, construcții și marketing pentru o întrebare despre o rețetă. Păstrezi accesul la celelalte domenii și le poți descoperi la cerere. Un nume similar nu dovedește că două produse sunt duplicate: citește și `product_type`, unitatea, produsul finit, rețeta și ingredientele. Nu transforma o medie simplă a prețurilor istorice în cost FIFO.

**O conversație lungă poate rămâne costisitoare și la întrebări scurte.** Verifică informațiile de context și utilizare pe care aplicația le oferă. Separă istoricul conversației, rezultatele uneltelor, definițiile încărcate și datele reutilizate din cache. Nu transforma un cost estimat de API în bani facturați sau în procentul exact al abonamentului.

**Nu șterge istoricul și nu schimba modelul automat.** Dacă e necesară reorganizarea unei conversații foarte lungi, păstrează obiectivul, deciziile proprietarului, identificatorii documentelor, operațiile deja confirmate și pașii rămași; rezultatele vechi se reverifică atunci când sunt necesare. Nu relansa modificări doar fiindcă nu mai sunt vizibile în context. Pentru monitorizări, păstrează și mesajele deja tratate și răspunsurile livrate.

**Limita de utilizare este diferită de conexiunea expirată.** Citește mesajul exact. O limită a furnizorului AI nu cere ștergerea accesului Symbai sau reinstalarea Connect. Nu promite că trecerea la altă aplicație din același cont resetează limita.

Pentru Claude, [documentația despre MCP](https://code.claude.com/docs/en/mcp) explică încărcarea la cerere, iar [limitele de utilizare](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work) explică diferența dintre utilizare și lungimea conversației. Verifică documentația actuală a furnizorului folosit înainte să explici limitele sau setările lui.
