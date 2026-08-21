# Cartela clientului — portofel cu bani și credite

> Citește-l când owner-ul spune „vreau brățări/cartele la eveniment", „să-și încarce bani și să plătească cu cardul ăla", „cum fac la parc să nu umble copiii cu bani", „credite pentru jocuri", „clientul vrea banii înapoi de pe brățară".
> Pentru linkul exact către pagină folosește `gaseste_in_aplicatie`.
> Vecini: `loialitate-fidelizare.md` (puncte, ≠ portofel), `jocuri-activitati.md` (unde se consumă creditele), `inchidere-zi-casa.md` (predarea turei), `contabilitate-legaturi.md` (ce ajunge în contabilitate).

## Pe scurt

Cartela (brățară, card RFID, tag) e un **portofel legat de client**. Ține **două lucruri separate**:

| | Ce e | Unde se folosește | Se dau înapoi? |
|---|---|---|---|
| **Bani (lei)** | sumă încărcată în avans | plata la bar, restaurant, magazin | **da**, se pot restitui |
| **Credite** | jetoane de joc | arcade, atracții, jocuri | nu se preschimbă în bani, doar se sting |

Sunt **separate intenționat**: creditele nu sunt bani. Un client poate avea 50 lei și 20 credite pe aceeași cartelă, iar la bar plătește din lei, la jocuri consumă credite.

## ⚠ Regula fiscală — citește-o înainte de a porni funcția

> **La ÎNCĂRCARE nu se bate bon fiscal. Bonul cu TVA iese când clientul CONSUMĂ.**

Nu e o alegere de configurare, e felul în care legea tratează cartela. Cartela e un **voucher cu scop multiplu**: în momentul în care clientul pune 100 de lei pe brățară, **nu se știe** ce va cumpăra — mâncare (11%), băutură (21%) sau jocuri. Neștiindu-se cota, TVA-ul nu poate fi colectat atunci.

| Moment | Ce se întâmplă | Document | TVA |
|---|---|---|---|
| **Încărcare** | clientul dă 100 lei | dovadă de încasare (nefiscală) | **nu** |
| **Consum** | ia o bere de 15 lei | **bon fiscal**, ca la orice vânzare | **da**, pe cota reală |
| **Restituire** | pleacă cu 40 lei nefolosiți | se sting din portofel | nu |

**De ce contează practic:** dacă ai bate bon la încărcare, ai colecta TVA pe o cotă ghicită, iar apoi la consum ar trebui să nu mai bați bon — ceea ce ar lăsa vânzarea reală fără document. Symbai face ordinea corectă automat; tu doar nu inversa logica.

> Pentru owner: *„Banii de pe brățară nu sunt încă venitul tău. Devin venit abia când omul consumă — atunci iese și bonul."*

## Cum arată în practică

**1. Clientul vine la recepție.** Îi faci cont pe loc: ceri emailul, îi scanezi cardul pe cititor, gata — are cont. Opțional nume, prenume, telefon.

**2. Încarci cartela.** Scanezi cardul → vezi cine e și ce sold are → alegi suma și **cum a plătit** (numerar, card bancar, transfer) → confirmi.

Metoda de plată e **obligatorie la bani**. Nu e birocrație: din ea se știe pe ce cont intră încasarea și, la numerar, banii intră în predarea ta de tură.

**3. Clientul consumă.** La bar, ospătarul alege metoda „Cartelă", scanează brățara, vede soldul și încasează. Iese bon fiscal normal, cu TVA-ul produselor.

**4. La plecare, dacă a rămas sold**, îl poți restitui (alegi cum îi dai banii) sau îl poți stinge, dacă politica ta spune că expiră — dar atunci cere motiv scris, pentru că **nu există anulare**.

## Ce se vede și se urmărește

Fiecare mișcare rămâne înregistrată, cu tot ce trebuie ca să răspunzi la întrebări incomode:

- **cine a încărcat** (angajatul), **când**, **ce sumă**, **cu ce metodă de plată**
- unde s-a consumat (pe ce notă)
- restituirile și stingerile, cu motiv

Poți întreba asistentul direct: *„cât are pe cartelă Ion Popescu"*, *„cine i-a încărcat brățara"*, *„cât am încasat pe cartele azi"*, *„cât le datorez clienților pe carduri"*.

## Portofelul familiei

Un părinte poate avea portofel comun cu copiii (grup de clienți). Copilul plătește cu brățara lui, iar suma scade din portofelul familiei. Util la parcuri și la petreceri.

## Ce trebuie setat o singură dată

**1. Metoda de plată „Cartelă"** (Setări → Metode de plată). Trebuie marcată ca metodă care scade din portofel, iar restul bifelor:

| Setare | Valoare | De ce |
|---|---|---|
| Tip portofel | bani (sau credite) | altfel e o metodă obișnuită |
| Emite bon fiscal | **da** | bonul iese la consum |
| Deschide sertarul | **nu** | nu intră bani în sertar la consum |
| Plată la termen | nu | nu e creanță |

**2. Contul contabil** — cere-i contabilului să aibă **419 „Clienți-creditori"** în planul de conturi. Acolo stau banii clienților până îi consumă. Dacă lipsește, se creează automat, dar poate fi clasificat greșit în rapoarte.

**3. Cine are voie ce** (Setări → Roluri):

| Acțiune | Permisiune |
|---|---|
| Încarcă cartela | *Procesare Plăți* |
| Restituie / stinge sold | *Procesare Restituiri* |
| Gestionează cardurile | *Acces CRM* sau *Gestionare Loialitate* |

Restituirea cere permisiune **separată** intenționat: la încărcare intră bani, la restituire ies. Nu vrei ca oricine încasează să poată și scoate din casă.

## Limite care te pot surprinde

- **Plata cu cartela cere legătură la internet.** Soldul se verifică pe server, deci pe server local (offline) metoda nu apare în lista de plată. Altfel s-ar putea cheltui de două ori același sold.
- **Încărcarea cu numerar cere tura deschisă.** Fără ea, banii din sertar n-ar ajunge în registrul de casă și ți-ar ieși plus la numărat.
- **Creditele nu se dau înapoi în bani.** Pot fi doar stinse. Dacă vinzi credite, spune-i clientului din start.
- **Stingerea soldului e ireversibilă** — nu există anulare, de aceea se cere motiv.

## Greșeli frecvente

| Greșeală | Ce se întâmplă | Corect |
|---|---|---|
| Baterea bonului la încărcare | TVA colectat pe cotă ghicită, iar vânzarea reală rămâne fără document | bon doar la consum |
| „Adaugă credite" pentru corecții de bani | mișcarea nu apare în registrul portofelului | folosește Încarcă portofel |
| Restituire fără metodă de plată | nu se știe pe unde au ieșit banii | alege întotdeauna cum îi dai |
| Tratarea soldului ca venit | îți umfli cifra de afaceri cu bani neconsumați | e datorie până la consum |

## Modelul cu vendori (evenimente cu mai multe firme)

La festivaluri, deseori **organizatorul încasează** pe brățară, iar **marfa o dau alți vendori**. Acolo regula e alta: banii nu sunt ai organizatorului, ci încasați *în numele* vendorului; **bonul fiscal îl emite vendorul** care dă produsul, iar organizatorul îi decontează banii, minus comision.

Symbai acoperă azi **modelul în care încasezi și vinzi tu**. Dacă lucrezi cu vendori terți, spune-i asta clientului explicit — e alt flux contabil (datorie față de vendor, nu față de client) și se tratează separat.
