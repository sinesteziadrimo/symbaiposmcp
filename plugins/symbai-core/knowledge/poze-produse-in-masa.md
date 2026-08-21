# Poze de produs în masă — un folder de pe calculator, pus pe produsele corecte

> Ce faci când userul zice „am pozele la toate preparatele pe calculator" sau „am un folder cu pozele produselor, pune-le tu". Se rezolvă COMPLET prin conexiune, fără să-l trimiți în aplicație. Pentru o singură poză cu URL public → `set_product_image`. Pentru poze de pe un site/feed → `bulk_set_product_images`.

## Ce știe sistemul să facă singur

Potrivirea se face pe **numele fișierului**, nu pe conținutul pozei. Înainte de comparație, numele e curățat de tot ce nu ține de preparat:

- **diacriticele** nu contează: `ciorba-de-vacuta.jpg` = „Ciorbă de văcuță";
- **separatorii** sunt tratați ca spații: `paste_carbonara`, `paste-carbonara`, `PasteCarbonara` — toate ajung la același text;
- **prefixele de aparat foto și data** cad: `IMG_20240115_pizza margherita.JPG` → „pizza margherita"; la fel `DSC_`, `PXL_`, `Screenshot`, `WhatsApp Image …`;
- **contoarele și sufixele de export** cad: `Tiramisu (1).png`, `tort-final.jpg`, `snitel-web-hd.webp`, `pizza - copy.jpg`;
- **codul de produs sau codul de bare** din numele fișierului bat orice potrivire pe nume: `ESP-001.jpg` merge fix pe produsul cu acel cod;
- **numele din meniu** contează la fel ca numele din nomenclator — dacă preparatul apare în meniu cu alt nume, poza denumită după meniu se potrivește;
- **greșelile mici de scriere** trec: „tiramissu", „margarita" în loc de „margherita".

Ce **NU** face: nu se uită în poză. Un fișier `IMG_0042.jpg` nu poate fi legat de nimic după nume — vezi „Când potrivirea pe nume nu are ce face", mai jos.

## Rețeta în trei pași

**1. Listează fișierele** din folderul indicat de user (doar numele, nu conținutul).

**2. Previzualizează potrivirea** cu `match_product_photos_by_filename({ fileNames })`. Nu scrie nimic. Îți întoarce, pentru fiecare fișier: produsul propus, nivelul de încredere, alternativele și motivul, plus lista produselor care rămân fără poză. Restrânge lista de produse cu aceleași filtre ca peste tot (`brandId`, `menuId`, `categoryName`, `productType`, `tagName`) — pe un catalog mare potrivirea e și mai sigură dacă îi dai contextul corect.

**3. Urcă pozele** cu `upload_product_photos({ photos })`. Fiecare poză = `fileName` + `contentBase64` (conținutul fișierului citit de pe disc și codat base64). Nu trebuie să treci tu `productId`: se deduce din nume, cu aceeași judecată de la pasul 2.

**Arată-i userului rezultatul pasului 2 înainte de pasul 3** dacă sunt potriviri nesigure sau dacă e prima dată când faci operația pe instanța lui. Pe potriviri curate (nume identice cu produsele), mergi direct.

## Ce se scrie și ce NU se scrie

- Se aplică automat **doar potrivirile sigure**. Pragul implicit e „high"; îl poți coborî cu `minConfidence` (`medium`, `low`) sau ridica la `exact`, dar coborârea o faci doar după ce userul confirmă că e în regulă.
- Tot ce e sub prag **nu se scrie**: vine înapoi în raport, cu produsul propus și alternativele, ca să confirmi cu userul și să retrimiți poza cu `productId` explicit.
- Poza urcată devine **imaginea principală** a produsului și se propagă la articolele de meniu care nu au poză proprie. Cu `gallery: true` se adaugă în galerie fără să înlocuiască imaginea principală.
- ⚠ **Imaginea principală nouă înlocuiește galeria existentă** a produsului. Pe un produs care are deja poze (magazin online cu galerie), trimite `gallery: true` — altfel rămâne doar poza nouă. Verifică întâi cu `list_products_without_photo` sau filtrează cu `onlyMissingPhoto: true` dacă vrei să completezi doar golurile, fără să atingi ce există.
- **Mai multe poze pentru același preparat** (`tiramisu-1.jpg`, `tiramisu-2.jpg`) sunt recunoscute ca serie: prima devine imaginea principală, restul intră în galerie. Nu se suprascriu între ele.
- `dryRun: true` pe `upload_product_photos` face verificarea completă (inclusiv citirea fișierelor) fără să scrie nimic.

## Limite practice

- **Maxim 20 de poze și ~6 MB în total per apel.** Un folder de 150 de poze se trimite în loturi — e normal, nu e o eroare. Anunță userul că durează și mergi lot cu lot, raportând progresul.
- Dacă pozele sunt foarte mari (peste ~5 MB fiecare), micșorează-le înainte de trimitere sau trimite-le una câte una.
- Pozele care **există deja pe internet** (site vechi, feed de furnizor) NU trebuie citite de pe disc: `bulk_set_product_images` le descarcă singur din URL, fără limita de mărime, și acceptă la fel `productName` în locul lui `productId`.

## Închide bucla

După ce ai terminat loturile, rulează `list_products_without_photo` cu aceleași filtre. Îți spune exact ce produse au rămas descoperite, cu numele lor exact — pe care i-l dai userului ca să-și redenumească fișierele rămase. E singura verificare care contează; „am urcat 140 de poze" nu înseamnă „meniul are poze peste tot".

## Când potrivirea pe nume nu are ce face

Fișiere de tipul `IMG_0042.jpg`, `DSC_1177.jpg`, `foto1.jpg` — numele nu conține nimic despre preparat. Nu ghici și nu forța pragul în jos: ai pune poza greșită pe produsul greșit, iar userul o vede în meniu, la clienți.

Două ieșiri, spuse userului ca atare:

1. **Redenumește fișierele** după preparat (îi dai lista de nume exacte din `list_products_without_photo`) — după redenumire le urci tu, normal.
2. **Potrivirea vizuală din aplicație**: pagina Meniuri → Prețuri → **Poze Bulk Meniu**, unde AI-ul se uită în poză, nu la nume, și propune preparatul. Acolo userul confirmă și salvează.

## Capcane confirmate

- **Mărimile nu se confundă**: `cola-0.5l.jpg` nu ajunge pe „Coca-Cola 0.33L". Când ambele nume conțin o cantitate și ea diferă, potrivirea e coborâtă intenționat sub prag și ți se cere confirmarea. Nu o forța.
- **Două produse cu nume aproape identic** („Ciorbă de văcuță" / „Ciorbă rădăuțeană", iar fișierul e `ciorba.jpg`) → potrivire ambiguă, marcată ca atare. Cere userului să precizeze, nu alege tu.
- **Catalog foarte mare** (peste câteva mii de produse): potrivirea compară doar o parte și te anunță. Pune un filtru (brand, meniu, categorie) și reia.
- **Produsele inactive** nu intră în potrivire decât dacă ceri `includeInactive: true`. Dacă o poză „nu găsește produsul", verifică întâi dacă produsul e activ.
- Imaginea se vede în aplicație **după refresh**. Succes la tool = salvat; nu repeta încărcarea.
