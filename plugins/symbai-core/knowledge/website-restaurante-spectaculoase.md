# Website-uri de restaurant cu identitate și experiențe vizuale

Ghid pentru agenții care construiesc sau îmbunătățesc website-ul unui restaurant, bistro, bar, cafenea, pizzerie sau spațiu de evenimente. Completează [website-builder.md](website-builder.md). Pentru operarea livrărilor și rezervărilor citește separat [livrari-comenzi-online.md](livrari-comenzi-online.md) și [rezervari-clienti-evenimente.md](rezervari-clienti-evenimente.md).

Pentru animații complet proprii, încărcarea imaginilor generate și înlocuirea unei pictograme în toate produsele unui website, citește [website-fabrici-animatii-proprii.md](website-fabrici-animatii-proprii.md). Aceste instrumente se pot folosi și pe temele de restaurant.

**Sursa de adevăr este catalogul live al conexiunii.** Începe cu `list_website_templates`, `list_website_visual_experiences` și schema componentei alese. Dacă un instrument sau un câmp de mai jos lipsește, caută-l prin `cauta_tool` și verifică versiunea/conexiunea; nu pretinde că l-ai aplicat. Disponibilitatea în ghid nu dovedește că instanța clientului a primit deja actualizarea.

## 1. Începe cu restaurantul real

1. Citește brandul și locația, website-urile existente, paginile, navigația, meniul public și fotografiile. Identifică `brandId`, website-ul țintă, `menuId` și `menuItemId`-urile exacte.
2. Alege scopul principal: rezervare, comandă sau ambele. Verifică serviciile disponibile înainte să promiți că pot fi folosite.
3. Potrivește tipografia, paleta și ritmul paginii cu restaurantul. O fotografie proprie bună și un mesaj precis contează mai mult decât numărul efectelor.
4. Alege **o scenă dominantă** și una sau două experiențe care o completează. Lasă secțiuni liniștite între ele; meniul, prețurile, contactul și acțiunea principală trebuie să fie ușor de găsit.
5. Nu inventa premii, recenzii, vechimea localului, proveniența ingredientelor, capacitatea sălii sau fotografii „reale”. Imaginile de inspirație și studiile demonstrative trebuie înlocuite ori prezentate explicit ca ilustrații.

Pentru un website existent, citește configurația înainte de modificare și păstrează conținutul util. Aplicarea unei teme înlocuiește structura; adăugarea unei secțiuni este o modificare separată. Folosește acordul deja exprimat de utilizator și explică efectul concret înainte de o înlocuire care nu a fost autorizată.

## 2. Cele zece direcții vizuale

| `templateId` | Nume | Direcție și completări potrivite |
|---|---|---|
| `restaurant_elegant` | Nocturne | Fine dining, contrast întunecat, tipografie elegantă; poveste în capitole și rezervare concierge. |
| `restaurant_signature` | Forma | Restaurant contemporan; scenă culinară, meniu de degustare în capitole, galerie editorială. |
| `restaurant_modern` | Riviera | Atmosferă luminoasă, caldă; ingrediente care se așază în preparat și fotografie cu detalii interactive. |
| `restaurant_simplu` | Grădina | Natură și ospitalitate; turul grădinii/terasei și povestea ingredientelor. |
| `cafenea` | Sunday Club | Cafenea și brunch; povestea cafelei, produse de patiserie și galerie tactilă. |
| `bar_lounge` | After Hours | Noapte și cocktailuri; fotografii reconstruite din puncte de lumină, selecție de băuturi și comparație zi/seară. |
| `fast_food` | Bite Club | Energie și comenzi rapide; straturi de burger, ingrediente animate în cardurile de comandă. |
| `pizzerie` | Forno | Căldură și pizza; compoziție pe blat, ingrediente și produs final recognoscibil. |
| `evenimente_catering` | Gather | Oameni și mese împreună; galerie, capitole despre ofertă și detalii verificate ale serviciilor. |
| `sala_evenimente` | Époque | Eleganță de eveniment; tur fotografic al spațiului și perspective zi/seară. |

Numele temei este o direcție de design, nu numele restaurantului. La aplicare se folosesc identitatea și datele reale ale brandului.

Flux: `list_website_templates` → `preview_website_template` → `create_website` pentru un site nou sau `apply_website_template` pentru înlocuirea autorizată a celui existent → `get_website_page` pentru citire înapoi.

Opțiuni uzuale la previzualizare/creare/aplicare:

- `templateId`: unul dintre ID-urile de mai sus.
- `serviceMode`: `dine-in`, `delivery`, `both`; compune paginile și navigația pentru scopul ales.
- `motion`: `none`, `subtle`, `expressive`.
- `menuShowcase`: `auto`, `chapters`, `compare`, `off`. Alege prezentarea suplimentară a produselor pe prima pagină; `off` păstrează galeria clasică.
- `menuShowcaseCount`: 2–8 produse pentru capitole, implicit 3. Comparația folosește exact două produse.
- `menuId`, `locationId`: valorile reale din contextul brandului.
- `heroImageUrl`, `heroTitle`, `heroSubtitle`, `primaryColor`: personalizare vizuală.
- Opțiunile scenei și preparării în meniu: descrise mai jos; citește schema live înainte de apel.

`preview_website_template` cu `brandId` folosește contextul real; fără el este demonstrație. Nu salvează. `apply_website_template` folosește `websiteId` pentru ținta exactă și cere `confirmReplace:true` dacă există pagini. Citește avertismentele și `menuLink`. `linkMenu:false` păstrează operația la design, fără legarea unui meniu nou. Aplicarea unui aspect nu activează automat plățile, livrarea sau rezervările.

### Prezentare din meniu, inclusă la aplicare

Cu `menuShowcase:auto`, Nocturne, Forma, Grădina, Gather și Époque includ **capitole cu fotografie persistentă**. Riviera, Sunday Club, After Hours, Bite Club și Forno includ **două alegeri descoperite prin glisare**. Alegerea este disponibilă și în asistentul vizual de aplicare a temei. Poți folosi `chapters` sau `compare` cu oricare dintre cele zece teme.

Secțiunea folosește meniul ales: numele, descrierile și fotografiile produselor disponibile. Selectează întâi câte un produs din categorii diferite, în ordinea catalogului, apoi completează din restul produselor. Produsele epuizate și cele fără fotografie sunt excluse. Dacă nu rămân cel puțin două produse eligibile, secțiunea se ascunde; restul paginii și meniul rămân disponibile. Selecția automată nu pretinde că reprezintă meniul de degustare, recomandarea bucătarului sau cele mai vândute produse.

Pentru control editorial, citește secțiunea creată și configurează `products` cu ID-urile exacte, în ordinea dorită. O selecție explicită nu este completată cu alte produse dacă unele dispar. Galeria din pagina despre restaurant rămâne disponibilă. Aceste opțiuni compun tema la creare/aplicare; un website existent se îmbunătățește prin actualizarea secțiunii sale ori printr-o aplicare autorizată a temei.

Pentru retușuri păstrează structura: `set_website_theme`, `set_hero`, `add_website_section`. Dacă brandul are mai multe website-uri, verifică selectorul acceptat de fiecare tool (`websiteId`, `configId`, pagină/secțiune); nu presupune că toate au aceiași parametri. Pentru pagini multiple poți folosi `set_website_pages` cu `configId` explicit și fără eliminarea paginilor neincluse.

## 3. Catalogul experiențelor: alegere și previzualizare

`list_website_visual_experiences({})` oferă opt direcții, situațiile potrivite, datele necesare și componentele native. Pentru detalii cere o singură experiență, de exemplu:

```json
{"experienceId":"interactive-photo","includeSchema":true,"includeExamples":true}
```

| `experienceId` | Componente | Ce vede vizitatorul |
|---|---|---|
| `culinary-journey` | `restaurant-journey` | Fotografia rămâne lângă poveste și se schimbă cu capitolul explorat. |
| `interactive-photo` | `restaurant-discovery` | Puncte în fotografie deschid detalii despre ingrediente sau spațiu. |
| `image-reveal` | `restaurant-reveal` | Două fotografii suprapuse, descoperite prin glisarea delimitării. |
| `menu-preparation` | `menu-section`, `order-online` | Ingredientele construiesc vizual produsul, inclusiv în meniul din care comanzi. |
| `culinary-stage` | `restaurant-hero` | Preparatul din deschiderea site-ului se compune din ingrediente. |
| `night-drinks` | `restaurant-hero` | Fotografia cocktailului se reconstruiește în puncte de lumină. |
| `editorial-gallery` | `restaurant-gallery` | Colecție fotografică orizontală, cu vizualizare mărită. |
| `concierge-reservation` | `reservation-form` | Alegerea vizitei cu disponibilitate reală și rezumat clar. |

Pentru primele trei tipuri folosește `preview_website_visual_section({type,config})`. Întoarce configurația normalizată, `errors`, `warnings`, `ready` și `writesPerformed:false`. **Este verificare de structură și conținut, nu captură a paginii:** nu citește meniul, nu descarcă fotografiile și nu verifică serviciile. Chiar și cu `ready:true`, verifică imaginile și rezultatul în browser. Un `menuItemId` produce un avertisment până îl verifici separat în meniul real.

După verificare, folosește configurația returnată în `add_website_section`. La actualizare, trimite `sectionId`-ul existent ca să nu dublezi secțiunea. Citește pagina înapoi. Aceste componente se editează și vizual în Website Builder, inclusiv imaginile, textele și lista de capitole/puncte.

### Sursă automată sau selecție exactă de produse

`restaurant-journey` și `restaurant-reveal` acceptă `contentSource:"menu"`. Setează `menuId` real; fără el, selecția poate include produsele meniurilor publice încărcate pentru website. `products:[]` sau lipsa listei înseamnă selecție automată. O listă de maximum opt intrări `{menuItemId}` fixează produsele și ordinea; comparația folosește primele două produse eligibile, iar capitolele respectă `maxSteps` (2–8, implicit 3).

`imageFit:"contain"` păstrează fotografia întreagă și este implicit pentru sursa din meniu. `imageFit:"cover"` umple cadrul și poate decupa marginile. Alege `imageAspectRatio` după fotografii și verifică încadrarea pe telefon. `linkText` și `linkUrl` sunt comune prezentării; folosește `/comanda` numai dacă pagina există și comenzile sunt configurate.

Exemplu pentru capitole automate; înlocuiește `menuId` cu ID-ul verificat:

```json
{
  "type":"restaurant-journey",
  "config":{
    "title":"Gustul, cadru cu cadru.",
    "contentSource":"menu",
    "menuId":789,
    "products":[],
    "maxSteps":3,
    "imageFit":"contain",
    "imageAspectRatio":"4/3",
    "motion":"subtle",
    "linkText":"Descoperă meniul",
    "linkUrl":"/meniu"
  }
}
```

Exemplu pentru două produse exacte; înlocuiește toate ID-urile. Etichetele și descrierile sunt preluate din meniu, fără etichete artificiale „înainte/după”:

```json
{
  "type":"restaurant-reveal",
  "config":{
    "title":"Cu ce începe seara ta?",
    "contentSource":"menu",
    "menuId":789,
    "products":[{"menuItemId":1201},{"menuItemId":1202}],
    "imageFit":"contain",
    "imageAspectRatio":"16/9",
    "startingPosition":50,
    "linkText":"Descoperă meniul",
    "linkUrl":"/meniu"
  }
}
```

Previzualizarea structurală întoarce un avertisment și `ready:false` pentru sursa din meniu, deoarece nu citește produsele. Verifică separat că există cel puțin două produse disponibile cu fotografii accesibile. `contentSource:"manual"` sau lipsa câmpului păstrează fotografiile și capitolele editoriale descrise mai jos.

### Povestea culinară — `restaurant-journey`

2–8 capitole. Fiecare poate avea `eyebrow`, `title`, `description`, `imageUrl`, `imageAlt`, `linkText`, `linkUrl`. Opțional `menuId` pe componentă și `menuItemId` pe capitol pentru numele/fotografia produsului disponibil din meniul real. Un ID negăsit sau un produs indisponibil nu este substituit cu alt preparat.

Exemplu structural pentru previzualizare; înlocuiește URL-urile și textele cu conținut verificat:

```json
{
  "type":"restaurant-journey",
  "config":{
    "kicker":"Povestea bucătăriei",
    "title":"De la grădină la masă.",
    "imageAspectRatio":"4/3",
    "pointerInteraction":true,
    "motion":"subtle",
    "steps":[
      {"eyebrow":"Originea","title":"Ingredientele sezonului","description":"Poveste verificată a ingredientelor folosite de restaurant.","imageUrl":"/uploads/FOTOGRAFIE-INGREDIENTE.webp","imageAlt":"Ingredientele folosite în preparatul ales"},
      {"eyebrow":"La masă","title":"Preparatul semnătură","description":"Descrierea reală a preparatului.","imageUrl":"/uploads/FOTOGRAFIE-PREPARAT.webp","imageAlt":"Preparatul restaurantului","linkText":"Descoperă meniul","linkUrl":"/meniu"}
    ]
  }
}
```

Pentru o degustare cu produse reale, înlocuiește fiecare capitol editorial cu un `menuItemId` verificat și setează `menuId`. Nu crea pagini de produs fictive: destinațiile trebuie să existe. Derularea este nativă, iar capitolele au butoane directe; pe telefon imaginea rămâne deasupra textului fără să ascundă titlul selectat.

### Fotografie explorabilă — `restaurant-discovery`

O fotografie plus 1–12 `hotspots`. Fiecare punct are `title`, `x`, `y` și opțional `eyebrow`, `description`, `linkText`, `linkUrl`. Coordonatele sunt procente de la stânga/sus, între 5 și 95. Măsoară-le pe fotografia încadrată în formatul ales, nu pe o altă versiune a imaginii.

```json
{
  "type":"restaurant-discovery",
  "config":{
    "title":"Descoperă locul.",
    "imageUrl":"/uploads/FOTOGRAFIE-LOCAL.webp",
    "imageAlt":"Spațiul real al restaurantului",
    "imageAspectRatio":"4/3",
    "hotspots":[
      {"title":"Terasa","x":35,"y":55,"description":"Detaliile verificate ale terasei.","linkText":"Rezervă o masă","linkUrl":"/rezervari"},
      {"title":"Sala","x":72,"y":40,"description":"Detaliile verificate ale sălii."}
    ]
  }
}
```

Același tip poate explica burrata, busuiocul și roșiile vizibile într-un preparat. Nu folosi aceste texte dacă fotografia nu le arată. Păstrează distanță între puncte și verifică apăsarea pe telefon. Punctele nu sunt un plan de mese live și nu afirmă că un loc este disponibil.

### Comparație glisantă — `restaurant-reveal`

`beforeImageUrl` și `afterImageUrl`, descrieri `beforeImageAlt`/`afterImageAlt`, etichete `beforeLabel`/`afterLabel`, `startingPosition` între 0 și 100 (implicit 50), `imageAspectRatio`.

```json
{
  "type":"restaurant-reveal",
  "config":{
    "title":"Același loc. Două atmosfere.",
    "beforeImageUrl":"/uploads/LOCAL-ZI.webp",
    "afterImageUrl":"/uploads/LOCAL-SEARA.webp",
    "beforeLabel":"În lumina zilei",
    "afterLabel":"Seara",
    "startingPosition":50,
    "imageAspectRatio":"16/9"
  }
}
```

Folosește unghiuri și încadrări coerente. Pentru ingrediente/preparat trebuie să ai fotografiile corespunzătoare aceluiași produs. Două fotografii diferite nu dovedesc o transformare fizică sau o rețetă. Glisarea funcționează cu mouse-ul, atingerea și controlul de tastatură; derularea verticală pe telefon rămâne disponibilă.

Cele trei componente acceptă formatele `16/9`, `4/3`, `1/1`, `3/4`, culorile secțiunii din catalog și `motion`. Povestea și fotografia explorabilă acceptă `pointerInteraction` pentru lumina care urmărește cursorul. Setarea globală fără mișcare și preferința vizitatorului de mișcare redusă au prioritate.

## 4. Preparare animată în toate cardurile din meniu

Funcționează în **meniul de prezentare și în `order-online`, meniul real de comandă**. Ingredientele intră în scenă, se așază/amestecă, primesc un efect de finisare și lasă loc fotografiei exacte a produsului. Vizitatorul poate deschide vederea detaliată, selecta un ingredient, pune pauză, relua și explora etapele cu glisorul.

### Fluxul sigur și complet

1. `get_menu_preparation` cu `brandId` și website-ul ales: citește setările globale, componentele eligibile și acoperirea cu ingrediente.
2. `list_cooking_ingredients`: citește biblioteca de **448 de ingrediente vizuale**, aliasurile, rolurile și cheile disponibile. Include legume și rădăcinoase, carne/pește/fructe de mare, lactate, fructe, paste/cereale/leguminoase, nuci/semințe, sosuri și ierburi/condimente. Numele din rețeta reală rămâne autoritar; imaginea generică poate fi înlocuită cu `imageUrl`. Biblioteca nu pretinde că acoperă orice ingredient posibil.
3. `set_menu_preparation` cu `dryRun:true`, `syncRecipes:true`, `menuId` și opțiunile dorite. Verifică rezultatul și produsele fără ingrediente disponibile.
4. Aplică același apel fără `dryRun:true`, în limita cererii utilizatorului. Citește din nou `get_menu_preparation` și pagina.
5. Verifică animația și adăugarea produsului în coș pe pagina efectivă de comandă, inclusiv produse cu opțiuni obligatorii. O animație reușită nu dovedește că livrarea/plata este configurată.

Exemplu de argumente pentru verificare, cu ID-uri strict ilustrative; înlocuiește toate ID-urile:

```json
{
  "brandId":123,"websiteId":456,"menuId":789,
  "menuCookingMode":"hover",
  "menuCookingDuration":4.8,
  "menuCookingIntensity":0.8,
  "menuCookingLabels":true,
  "menuCookingMaxIngredients":8,
  "menuCookingProductIds":[],
  "syncRecipes":true,
  "dryRun":true
}
```

| Opțiune | Semnificație |
|---|---|
| `menuCookingMode:"off"` | Fotografie, fără preparare animată. |
| `menuCookingMode:"hover"` | Pornește la cursor; are și buton pentru touch/tastatură. |
| `menuCookingMode:"button"` | Pornește doar la apăsare. |
| `menuCookingMode:"inherit"` | Numai pe componente: moștenește modul website-ului. |
| `menuCookingDuration` | 2–10 secunde; implicit 4.8. Nu este timpul real de gătire. |
| `menuCookingIntensity` | 0–1.5; controlează profunzimea și energia efectului. |
| `menuCookingLabels` | Afișează etichetele ingredientelor în vederea compactă. |
| `menuCookingMaxIngredients` | 2–12 ingrediente animate, implicit 8. Limitează compoziția vizuală, fără să modifice rețeta. |
| `menuCookingProductIds` | Listă de `menuItemId`; `[]` înseamnă toate produsele cu ingrediente disponibile. Omis păstrează selecția curentă. |

**Global sau local:** fără `componentIds`, actualizezi setarea website-ului. Componentele care au valori proprii le păstrează. Ca toate secțiunile să urmeze website-ul, citește ID-urile exacte, apoi folosește `componentIds:[...]` și `resetOverrides:true`. Acesta elimină opțiunile locale de mai sus și păstrează biblioteca locală de ingrediente. Opțiunile explicite din același apel se aplică după resetare.

Pentru o singură secțiune, trimite numai `componentIds`-ul ei. Sunt eligibile `menu-section` și `order-online`. Nu presupune că numele/ordinea din pagină este ID-ul componentei.

**Pe produs:** `products:[{menuItemId,cookingMethod,enabled,maxIngredients}]` definește regia individuală sau oprește animația unui produs. Metode: `assemble`, `stack`, `toss`, `bake`, `pour`. `maxIngredients` (2–12) are prioritate față de limita componentei, care are prioritate față de limita globală. Lista `products` trimisă înlocuiește regia produselor acelui meniu, deci păstrează intrările dorite deja existente; `products:[]` le elimină. `menuCookingProductIds` alege produsele, iar `enabled:false` poate opri individual unul dintre ele.

**Ingredientele:** `syncRecipes:true` preia rețetele active legate prin ID. Nu deduce ingrediente din numele sau fotografia preparatului. Instantaneul vizual păstrează denumiri, ID-uri și imagini; nu expune cantități ori costuri. Produsele fără rețetă utilizabilă păstrează fotografia. Reîmprospătează instantaneul după schimbarea rețetelor; nu presupune că animația urmărește continuu fiecare editare a rețetarului.

Alternativ, `ingredients` definește explicit un instantaneu verificat: `menuItemId`, `label`, opțional `ingredientId`, `assetKey`, `imageUrl`, `role`, `sequence`, `scale`, `display`. Roluri: `prep`, `base`, `body`, `fresh`, `finish`. `sequence` este 0–100; `scale` 0.5–1.6. `ingredients:[]` șterge instantaneul meniului ales. Alege sincronizare sau ingrediente explicite, nu ambele. Pentru ajustări care trebuie păstrate după actualizarea rețetei folosește `ingredientOverrides`, explicat mai jos. Nu modifica rețeta operațională doar pentru a obține o animație mai bogată.

Limite: maximum 1000 produse × 24 ingrediente pentru un meniu și 10 meniuri într-o bibliotecă. Ingredientele necunoscute rămân etichete sau primesc imagini proprii; nu le substitui cu ingrediente nepotrivite. Fotografia finală trebuie să corespundă produsului real. Prepararea este **o interpretare vizuală a ingredientelor**, nu o instrucțiune culinară, o demonstrație de siguranță alimentară sau o simulare fizică exactă.

### Selecția automată și rețetele simple sau foarte lungi

Cu `hover` sau `button`, toate produsele eligibile pot folosi prepararea, fără câte o animație făcută manual pentru fiecare. Sistemul folosește ingredientele din instantaneul rețetei și preferă baza, ingredientele principale și accentele vizuale, cu diversitate de roluri. Sarea, piperul și ingredientele auxiliare au prioritate mai mică. Ordinea rețetei este păstrată în caz de egalitate; nu se publică și nu se estimează cantități.

- **Zero sau o singură imagine eligibilă:** rămâne fotografia preparatului, fără un buton care să promită o compoziție bogată. Un ingredient necunoscut fără imagine nu este numărat drept imagine eligibilă.
- **2–8 ingrediente eligibile:** se poate compune scena automat, în limita configurată.
- **Multe ingrediente:** implicit apar cel mult opt; limita poate fi 2–12. Celelalte ingrediente din instantaneu sunt accesibile în vederea detaliată, într-o listă separată. La sincronizare, rețeta este analizată înainte de reducerea instantaneului la 24 de ingrediente, pentru a păstra ingrediente principale aflate mai târziu în listă. Acest instantaneu vizual nu înlocuiește lista legală de ingrediente sau alergeni.
- **Imagine necunoscută sau nepotrivită:** atașează o fotografie proprie, ideal decupată pe transparență. Nu alege o migdală întreagă pentru făină de migdale ori lapte obișnuit pentru lapte vegetal. Potrivirea automată este conservatoare.

Fotografia finală rămâne fotografia produsului din meniu. Scenele sunt interactive în website; aceste instrumente nu exportă un fișier video.

### Ajustări persistente pentru client și agentul său

În Website Builder: alege **„Când treci cu mouse-ul”**, apoi **„Actualizează ingredientele din rețete”**. Deschide **„Personalizează ingredientele animate”** și alege preparatul. Editorul arată ce intră în scenă și ce are nevoie de imagine; clientul poate prioritiza/ascunde un ingredient, alege altă imagine din bibliotecă, încărca una proprie și schimba ordinea intrării. **„Revino la selecția automată pentru acest preparat”** elimină ajustările ingredientelor acelui produs. Salvează website-ul și verifică pagina publică. Actualizarea rețetelor păstrează aceste preferințe.

Prin MCP, cere `get_menu_preparation` cu `brandId`, `websiteId` și **`menuItemId`**. `ingredientDetails` arată separat pentru fiecare componentă: `menuId`, `componentId`, limita, modul vizual, motivul păstrării fotografiei, starea efectivă `animated` și ingredientele cu ID-uri, `selected`, `hasVisual`, imagine, rol și preferințe. Componenta poate avea o bibliotecă proprie; citește rezultatul ei înainte de a edita. `selected` descrie selecția posibilă, iar `animated:false` poate indica și o animație dezactivată sau un produs neales.

Folosește **`ingredientOverrides`** pentru modificări parțiale legate de perechea reală `menuItemId` + `ingredientId`. Nu trimite numele produsului drept identificator și nu schimba eticheta ingredientului. Exemplu de previzualizare pentru `set_menu_preparation`, cu ID-uri ilustrative:

```json
{
  "brandId":123,
  "websiteId":456,
  "menuId":789,
  "menuCookingMaxIngredients":8,
  "ingredientOverrides":[
    {"menuItemId":1201,"ingredientId":301,"display":"include","assetKey":"penne","sequence":10},
    {"menuItemId":1201,"ingredientId":302,"display":"exclude"},
    {"menuItemId":1201,"ingredientId":303,"imageUrl":"/uploads/INGREDIENT-REAL.webp","display":"include"}
  ],
  "dryRun":true
}
```

`display:"auto"` lasă selecția automată; `include` acordă prioritate, dar respectă limita scenei și necesitatea unei imagini; `exclude` ascunde vizual ingredientul. Sunt acceptate și `role`, `sequence`, `scale`, `assetKey`, `imageUrl`. Ajustările netrimise se păstrează. Pentru eliminarea unei fotografii proprii trimite `imageUrl:""`; pentru revenirea completă la recunoașterea imaginii trimite și `assetKey:""`. Imaginea proprie are prioritate față de cheia din bibliotecă.

`syncRecipes:true` poate fi combinat cu `ingredientOverrides`: actualizează ingredientele și păstrează preferințele legate de ID. Un ingredient nou primește selecție automată; o preferință pentru un ingredient eliminat nu se mută pe alt ingredient. `resetIngredientOverrides:true` elimină **toate ajustările ingredientelor din meniul și aria alese**, păstrând rețeta și regia produselor. Nu confunda această opțiune cu `resetOverrides`, care resetează opțiunile componentei.

## 5. Scena principală: preparate sau cocktailuri

Folosește `set_hero` cu `websiteId` pentru ținta exactă. Citește schema live a `restaurant-hero` când compui direct o secțiune.

- **Produse de mâncare:** `scenePreparation:"ingredients"`, `sceneRecipeSync:true`, `sceneSource:"menu"`. `sceneCookingDuration` 4–14 secunde; `sceneCookingMethod:"auto"` sau `assemble`/`stack`/`toss`/`bake`/`pour`. `cookingMethod` individual din `sceneProducts` are prioritate.
- `sceneCookingMaxIngredients`: 2–12, implicit 8, cu aceeași selecție reprezentativă și fotografie pentru zero/un singur ingredient vizual. În selecția automată sunt preferate produsele disponibile cu fotografie și cel puțin două imagini de ingrediente; selecțiile explicite rămân prioritare.
- **Cocktailuri nocturne:** `sceneStyle:"stardust"`, `scenePreparation:"particles"`, fotografii reale ale băuturilor. `sceneSource:"menu"` folosește produsele disponibile; `curated` folosește selecția explicită `sceneProducts`. Particulele urmează fotografia, nu forme abstracte fără legătură cu meniul.
- **Prezentare liniștită:** `scenePreparation:"photo"` sau `sceneStyle:"none"` pentru aspect clasic.
- `sceneProducts`: până la 6 selecții inițiale cu `menuItemId` și opțional imagine/regie. Atelierul poate explora până la 120 de produse disponibile. Fără ID, tratează conținutul drept inspirație. `dishKey` alege studii demonstrative; nu îl aplica automat unor produse reale diferite.
- `sceneAutoPlay`, `sceneInterval` 5–30 secunde, `showSceneControls`: schimbarea produsului și accesul la controale. Nu ascunde controalele unei scene care avansează automat.
- `sceneIntensity`/`sceneSpeed`: 0–1.5; `pointerInteraction`, `sceneScroll`; `sceneQuality:"eco"|"balanced"|"high"`. Începe cu `balanced`. Viteza zero oprește mișcarea ambientală și avansarea automată; interacțiunile explicite rămân disponibile.

`sceneIngredients` permite straturi transparente proprii, legate de `menuItemId` și poziționate explicit; `sceneRecipeIngredients` este instantaneul de rețetă. Citește limitele și coordonatele din catalog înainte de compoziții avansate. Evită ingrediente decorative care nu există în preparat.

Verifică `recipeCoverage` după sincronizare. Pentru efectele care citesc pixelii fotografiei, serverul imaginii trebuie să permită accesul; dacă nu, rămâne fotografia. Fără suport grafic, cu mișcare redusă sau în afara ecranului, accesul la produs și acțiunile site-ului trebuie să rămână clar.

## 6. Galerie, rezervare și comandă

**Galerie:** `restaurant-gallery`, `layout:"rail"`, `maxImages` 1–24, `enableLightbox:true`, `showCaptions:true`. Pentru produse: `imageSource:"menu-photos"` și `menuId`. Pentru local: `imageSource:"manual"`, `images:[{url,alt,caption}]`. Fotografiile se explorează prin atingere, săgeți și tastatură. Alternează preparate/detalii/atmosferă numai dacă reprezintă restaurantul.

**Rezervare:** `reservation-form`, `layout:"concierge"`, `showSummary:true`, locație și setări reale. Verifică data, numărul persoanelor, zonele, intervalele disponibile și confirmarea. Nu afișa disponibilitate inventată și nu crea rezervări reale doar ca test vizual.

**Comandă:** păstrează `order-online` conectat meniului și serviciilor reale. Verifică imaginile, prețurile, opțiunile obligatorii, coșul, modul livrare/ridicare și costurile. Prepararea animată completează cardul produsului; butonul de adăugare trebuie să rămână ușor accesibil. Testarea unei comenzi/plăți reale se face doar în limita autorizării pentru acea operațiune.

## 7. Verificarea înainte de a spune „gata”

- Citește înapoi pagina și setările. Confirmă website-ul, meniul și secțiunile efectiv modificate.
- Deschide pagina publică pe desktop și telefon. Verifică primul ecran, meniul, contactul și CTA-urile.
- Testează capitolele, punctele, glisorul, galeria și animația unui produs real; verifică și un produs fără rețetă/fotografie.
- Parcurge cu tastatura: focus vizibil, nume clare, butoane utilizabile, Escape pentru dialoguri și întoarcerea focusului.
- Verifică mișcarea redusă, derularea verticală, lipsa textului tăiat și lipsa derulării orizontale accidentale.
- Nu lăsa fotografii lipsă, texte generice, linkuri moarte sau servicii aparent active care nu funcționează. Dacă lipsesc date, spune exact ce lipsește și păstrează o prezentare coerentă.
- Arată utilizatorului rezultatul și precizează ce este salvat, ce este public și ce depinde încă de date ori de o actualizare a instanței.

Repere de design: studiul [Baan Tepa, Sand Studio](https://sandstudio.co/projects/baan-tepa) arată cum turul localului și explorarea ingredientelor pot susține povestea unui restaurant. Folosește principiul de descoperire, cu identitatea și conținutul clientului; nu copia fotografiile sau afirmațiile altui restaurant.


## 8. Biblioteca extinsă și semipreparatele

Catalogul include 448 de imagini de ingrediente. Cele 288 adăugate acoperă condimente și ingrediente indiene, legume, carne și pește, brânzeturi, patiserie, sosuri, sucuri, siropuri și băuturi. Citește mereu `list_cooking_ingredients`: instanța trebuie actualizată pentru a avea noul catalog; numărul dintr-un ghid nu dovedește versiunea disponibilă la client.

Sincronizarea urmărește relațiile reale dintre produse și rețete, inclusiv semipreparate, până la șase niveluri. Se folosesc rețete active ale brandului ales sau rețete comune tenantului. Un ingredient recunoscut ori cu fotografie proprie își păstrează forma. Un semipreparat fără imagine se poate desface în ingredientele rețetei sale; numele preparatului nu este folosit pentru inventarea unei rețete. Cantitățile, costurile și instrucțiunile operaționale nu intră în instantaneul public.

Ajustările `ingredientOverrides` păstrează identitatea semipreparatului personalizat la resincronizare, inclusiv imaginea proprie și excluderea explicită. Ele sunt prioritizate când instantaneul este redus la 24 de ingrediente. Cu mai mult de 24 de identități personalizate nu pot fi păstrate toate: consultă `truncated` și simplifică regia. Un produs care are un singur ingredient rămâne o fotografie; pentru băuturi simple îmbuteliate sau marfă nu crea artificial ingrediente suplimentare.

După fiecare `syncRecipes`, verifică `recipeCoverage`: `withoutRecipe`, `unmapped`, `truncated`, `subrecipesExpanded`, `unresolvedSubrecipes`, `excludedNonCulinary`, `menuTruncated`, `graphDepthLimited` și `unexploredIngredientIds`. Ultimele ID-uri reprezintă frontiera la care citirea s-a oprit, nu confirmarea că toate au subrețete. Pentru mai multe componente, rezultatele pot fi separate în `recipeCoverage.byComponent`. Raportul privește instantaneul vizual efectiv și nu certifică existența sau accesibilitatea fotografiei finale. Verifică fotografia în meniul public.

Denumiri precum „fructe”, „siropuri”, „sucuri rețete” sau o marcă fără sortiment pot fi ambigue. Consultă produsul și rețeta reală; folosește `ingredientOverrides` cu un `assetKey` verificat ori o imagine proprie. Nu transforma pastă de ghimbir în rădăcină, gem în fruct proaspăt sau un preparat compus în carne crudă. Când informația lipsește, păstrează fotografia și precizează ce trebuie completat. Liniile dedicate ambalajelor sunt omise; un sufix de ambalaj sau SGR pe un ingredient alimentar nu îl elimină.

Pentru un restaurant nou: confirmă brandul și meniul, verifică fotografiile și rețetele, citește catalogul de ingrediente, rulează `set_menu_preparation` cu `dryRun:true`, `syncRecipes:true`, `menuCookingMode:"hover"` și ID-urile reale, tratează lipsurile, apoi salvează configurația autorizată. Testează cel puțin un preparat complex, unul simplu și unul fără date pe telefon și desktop. Website-ul descarcă doar atlasele necesare interacțiunii active; biblioteca completă nu este descărcată la deschiderea meniului.
