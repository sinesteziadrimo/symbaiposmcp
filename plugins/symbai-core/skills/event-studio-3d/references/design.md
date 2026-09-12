# Design și configurare

Încarcă `get_event_studio_guide({topic:"design"})` pentru paletele și formatele actuale. Înțelege întâi experiența: tipul evenimentului, numărul de invitați, masa servită sau bufetul, scena, dansul, prezentările, cazarea și programul.

Construiește o compoziție coerentă: două materiale dominante, o culoare de accent, un punct focal și suficient spațiu liber. Păstrează arhitectura locației și elementele blocate. Creează variante distincte pentru diferențe importante de capacitate sau format, nu modifica singura propunere deja aleasă de client.

## Generare

`generate_event_studio_layout` are șase formate: `banquet`, `theatre`, `classroom`, `cabaret`, `boardroom`, `cocktail`. Primește `guests` și lățimea culoarului `aisle`. Respectă obstacolele fixe și raportează lipsa locurilor. La consiliu, masa continuă are maximum 30 locuri; pentru o cerere mai mare propune un format potrivit după verificare.

Generatorul **înlocuiește mobilierul variantei**, inclusiv decorul mobil. Aplică-l înainte de decorul final sau într-o copie nouă. Implicit produce numai previzualizare; verifică raportul și apoi aplică același apel cu `preview:false`. Nu modifică elementele fixe. Obiectele blocate și invitații deja așezați cer o decizie explicită prin `allowLocked`, respectiv `clearAssignments`; preferă o variantă nouă dacă trebuie păstrată configurația actuală.

## Atmosferă

`style_event_studio_scenario` oferă:

| Stil | Direcție |
|---|---|
| `garden` | Verde natural, textile ivory, lumină caldă. |
| `gala` | Champagne, textile deschise și atmosferă de seară. |
| `conference` | Albastru sobru, textile neutre, lumină de zi. |
| `midnight` | Accente mov, textile pastel și atmosferă de seară. |

Cu `addDecor:true`, adaugă plante și, unde încape, un ecran peste scenă. Nu adaugă din nou aceleași obiecte la repetarea apelului. Nu promite că această acțiune proiectează singură întregul eveniment.

Completează intenționat zona de primire, mesele, scena, ringul de dans, barul, bufetul, lounge-ul și traseul către terasă/cazare. Folosește dimensiuni credibile și acces pentru servire; nu înghesui tot catalogul în aceeași sală. Înălțimea ecranului, poziția florilor și a coloanelor trebuie verificate și din plimbare, nu doar din vedere de sus.

## Verificare înainte de prezentare

Rulează `validate_event_studio_project` pentru fiecare variantă și urmărește paginarea. Rezolvă lipsa locurilor, mobilierul în afara sălii, suprapunerile, obiectele peste plafon și apropierea de accese. Ringul de dans și arhitectura GLB au limite de verificare geometrică; verifică-le vizual.

Deschide editorul din linkul întors și verifică în ordine planul 2D, sala 3D, complexul/etajele și plimbarea. Inspectează și pe ecran îngust pentru o prezentare folosită pe telefon. Dacă nu ai acces vizual, livrează configurația salvată cu această limită clară, fără să afirmi că aspectul a fost verificat.

O propunere bună explică ce se schimbă între variante: capacitate, confort, atmosferă, meniu și total. Nu afirmă automat că sala respectă toate normele, că rezervarea este confirmată ori că stocul și personalul sunt asigurate.
