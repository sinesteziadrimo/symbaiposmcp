# Website, aranjare cu clientul și predare către echipă

Încarcă acest ghid numai când cererea privește configuratorul public, drepturile de mutare sau predarea amenajării. Descoperă instrumentele prin `cauta_tool` cu acțiunea precisă; `get_event_studio_guide(topic="website")` dă contractul disponibil în instanță.

## Drepturi pe mobilier

Administratorul stabilește `editing.sales`: `fixed` (fix), `move` (poziție și rotire) sau `full` (amenajare completă). Separat, `editing.website` este `fixed` sau `move`. Un obiect `locked` rămâne blocat. Implicit, obiectele de pe website sunt fixe; barul și scena sunt fixe pentru vânzător. Configurează deliberat excepțiile, de exemplu candy bar mutabil și scenă mobilă numai unde există fizic această posibilitate.

Vânzătorul pornește de la modelul locației, îl copiază în dealul exact, pregătește variante și salvează. Copiile păstrează restricțiile arhitecturii și mobilierului. Generarea unei noi aranjări păstrează decorul și obiectele protejate, apoi completează locurile necesare. Nu schimba planul POS al restaurantului pentru o propunere comercială.

## Publicare pe website

1. Citește modelul unității și revizia, fără `dealId`. Verifică toate spațiile și textele publice; prezentarea permite vizitarea întregului complex. Nu publica un model care conține nume de clienți în titluri sau descrieri.
2. `publish_event_studio_website`: `projectId`, UUID stabil `id`, `revision`, `scenarioIds` (1–6), `acceptInquiries`. Verifică `preview=true`, apoi aplică aceleași argumente cu `preview=false`. Păstrează `publicationId` și URL-ul rezultat.
3. În site folosește componenta standard `venue-3d`, cu `publicationId`. Citește schema filtrată din catalog; păstrează pagina existentă și adaugă numai secțiunea necesară. Modulul pornește după apăsarea butonului și nu încarcă 3D în paginile unde nu este folosit.
4. Pentru un site nou, șabloanele `hotel_resort`, `sala_evenimente`, `parc_distractii` și `evenimente_catering` includ secțiunea. Aceasta rămâne ascunsă public până când are o publicație configurată. Aplicarea unui șablon peste un site existent înlocuiește conținutul: nu o folosi pentru simpla adăugare a turului.
5. Verifică pagina pe desktop și telefon: pornire, etaje, camere, obiect mutabil, obiect fix, revenire la model, formular. Publicarea este o copie fixă; editările modelului nu o schimbă automat. `list_event_studio_publications` citește metadate pe pagini; `revoke_event_studio_publication` retrage versiunea publicată.

## Cererea și echipa evenimentului

Cererea din website salvează pozițiile permise, iluminarea, varianta și numărul cerut de invitați. Creează prospect, contact, deal și proiect în CRM. Datele declarate nu sunt verificate și nu suprascriu persoane existente. Personalul verifică disponibilitatea, capacitatea, meniul și datele de contact înaintea ofertei.

În deal păstrează variantele de lucru. Când este legat evenimentul corect, folosește `handoff_event_studio_arrangement(projectId,id,revision,scenarioId,reservationId,preview=true)`, apoi `preview=false`. Șeful de sală vede versiunea aleasă în eveniment, la **Amenajare 3D**, cu inventarul și programul. O editare ulterioară în CRM nu schimbă această versiune; o predare nouă o actualizează. `get_event_studio_handoff` întoarce rezumat și link.

În memoria firmei reține numai regulile durabile de editare și proiectele de referință. Cererile, contactele și variantele curente rămân în CRM; nu copia scene întregi sau date personale în memoria generală.
