# Meniuri de evenimente & Meniul zilei (prin asistentul AI)

Asistentul conectat la instanța ta poate acum **crea, modifica, configura și șterge** două tipuri de meniuri direct din conversație — plus le poate atașa la evenimente. Înainte astea se făceau doar din aplicație.

## Ce sunt cele două meniuri

**Meniu de evenimente (pachet)** — un pachet la **preț fix per persoană** pentru nuntă, botez, revelion, aniversare etc. Are feluri la alegere (ex. „aperitiv la alegere, fel principal, desert”), suplimente și **tier-uri de open bar**. Îl construiești o dată ca șablon, apoi îl **oferi** pe o rezervare-eveniment (se îngheață un „snapshot” cu prețul de la momentul ofertei, așa că modificările ulterioare la șablon nu strică ofertele deja făcute).

**Meniul zilei** — meniul fix de prânz al zilei (ex. „supă + fel principal + desert la 45 lei”), cu preț și **vizibilitate pe canale** (sala, Glovo, Wolt). Îi atașăm automat un produs vandabil + tile de POS + program de disponibilitate.

## Ce poți cere asistentului

**Pachete de eveniment:**
- „Arată-mi pachetele de meniu pentru evenimente” / „Ce e în pachetul Nuntă Premium?”
- „Creează un pachet «Meniu Revelion» la 300 lei de persoană.”
- „Adaugă la pachetul de nuntă felurile: aperitiv (3 opțiuni la alegere), fel principal (2 opțiuni), desert.”
- „Schimbă prețul pachetului Botez la 180 lei.”
- „Atașează pachetul Nuntă Premium pe evenimentul lui Popescu, 80 adulți și 10 copii.”
- „Pe evenimentul lui Popescu, setează cine poate încasa la casă: ospătarul și managerul; permite doar numerar și card.”
- „Scoate oferta greșită de pe evenimentul de sâmbătă.”

**Meniul zilei:**
- „Ce meniuri ale zilei am active?”
- „Creează meniul zilei de azi: supă de legume sau ciorbă de burtă, apoi șnițel sau pește, la 42 lei.”
- „Schimbă prețul meniului zilei la 39 lei și fă-l vizibil și pe Glovo.”
- „Șterge meniul zilei de ieri.”

## De reținut (ca să meargă lin)

- **Cine poate încasa un eveniment** o setezi din pachetul de pe rezervare (rol: ospătar / manager / agent de vânzări) + metodele de plată permise. **Încasarea efectivă la casă + bonul fiscal** se fac tot de la casa de marcat, de un angajat real — nu prin asistent (e o acțiune de POS, nu de configurare a meniului).
- **Oferta cu linii plătite nu se poate șterge.** Dacă pe oferta atașată unei rezervări s-a încasat deja ceva (are linii plătite), ea nu mai poate fi scoasă — banii încasați trebuie să rămână legați de ceva. Corectezi prin ajustări/storno, nu prin ștergere.
- **Un pachet folosit de oferte nu se șterge, se dezactivează.** Dacă pachetul (șablonul) a fost deja oferit pe rezervări, la „ștergere" el e doar **dezactivat**: nu mai apare la oferte noi, dar rămâne în istoric — ofertele existente nu se strică.
- **După o scriere, interfața nu se schimbă instant** (aplicația ține date în cache). Dacă asistentul a zis „gata”, e salvat — dă un refresh sau cere-i o listare ca să confirmi; nu repeta comanda (se creează duplicate).
- **Produsele opțiunilor trebuie să existe deja** în meniul brandului. Dacă vrei o opțiune cu un produs nou, cere întâi crearea produsului.
- **Modificările pentru livrare (Glovo/Wolt)** se re-sincronizează automat; pot dura până apar pe platforme.
- **Nu conteaza pe ce meniu sta produsul meniului zilei.** Spre deosebire de produsele obisnuite, meniurile zilei si cele de eveniment ajung pe platforme indiferent de meniurile-sursa asociate canalului — tocmai ca debifarea unui meniu sa nu le scoata tacit de acolo. Deci nu le muta pe „Meniu Delivery" ca sa apara; verifica in schimb `get_channel_menu_scope(id)`, care iti spune per meniu al zilei daca e permis pe acel provider, ce fereastra are, daca se publica si daca e vizibil chiar acum la clienti.
- **Meniul zilei „pe timp" se vede doar în fereastra lui.** Un meniu de vineri 11:00–16:00 nu apare joi și nici vineri la 17:00 — nici în sală, nici pe platforme. Dacă muți ora, salvarea programului cere singură re-publicarea către Glovo/Wolt; dacă răspunsul spune că nu a plecat nimic (canal inactiv, sincronizare oprită sau mod „manual"), fereastra nouă se aplică pe platformă abia la următoarea sincronizare completă.
- **„Ieri apărea, azi nu"** — cel mai des e alt meniu al zilei (altă zi a săptămânii), configurat diferit față de cel de ieri. Compară-le înainte de a bănui o defecțiune.
- **Permisiuni**: modificările pe configurația meniului cer accesul „Produse & Meniuri”, iar ofertele pe rezervări cer „Rezervări & Clienți”, bifate pe tokenul de acces AI (Hub → Acces AI). Dacă lipsește, asistentul îți spune „permisiune insuficientă”.

## Vezi și
- „Rezervări, clienți & evenimente” — cum lucrezi cu evenimentele și ofertele.
- „Comenzi, mese & ospătari” — cum se marchează consumul de open bar pe masă la eveniment.
