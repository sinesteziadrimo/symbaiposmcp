# Website-uri de fabrici, animații proprii și pictograme de ingrediente

Ghid pentru Codex și Claude Code care personalizează website-ul unui client prin Symbai MCP. Completează [website-builder.md](website-builder.md) și [website-restaurante-spectaculoase.md](website-restaurante-spectaculoase.md).

Catalogul live al instanței este sursa de adevăr. Verifică disponibilitatea prin `cauta_tool`, `list_website_templates`, `list_website_visual_experiences` și `get_website_animation_schema`. Un instrument documentat aici poate necesita actualizarea instanței. Nu pretinde că l-ai aplicat dacă nu este disponibil.

## Alege o direcție de producție

| templateId | Identitate | Poveste vizuală |
|---|---|---|
| `factory_bakery` | Maison Levain | Patiserie, hârtie caldă, litere editoriale; cereale → laminare → formare → produs copt. |
| `factory_botanical` | Origin Works | Ingrediente vegetale, verde și lime; materia primă, pudră, aplicație și produs final. |
| `factory_precision` | AXIS / Works | Mecanică, grafit și metal; material → componente separate → ansamblu → produs. |
| `factory_packaging` | FOLD / Form | Ambalaje, kraft și salvie; hârtie → structură → pliere → cutie. |

Fiecare temă are pagini pentru acasă, produse/aplicații, proces/detalii și contact. Acțiunile principale sunt explorarea ofertei și discutarea unui proiect. Nu activează meniuri, comenzi, rezervări sau plăți. Fotografiile și procesele inițiale sunt **ilustrative**, nu dovezi despre fabrica clientului. Înlocuiește colecțiile, specificațiile și etapele cu date confirmate; nu inventa certificări, capacități sau sustenabilitate.

Flux: citește brandul și website-urile → `preview_website_template` cu `templateId` și `brandId` → `create_website` pentru site nou sau `apply_website_template` cu `websiteId` exact pentru înlocuirea autorizată. Opțiuni: `motion`, `heroTitle`, `heroSubtitle`, `heroImageUrl`, `primaryColor`. `kind:"factory"` identifică site-ul de producție. Înlocuirea unei teme existente folosește `confirmReplace:true` când schema live o cere și utilizatorul a autorizat înlocuirea.

`heroImageUrl` înlocuiește scena de deschidere cu fotografia proprie, fără a inventa piesele din fotografie. Pentru un ansamblu propriu complet, folosește fluxul de compoziție de mai jos.

În editor, categoria **Fabrici & producție** include `factory-hero`, `factory-capabilities`, `factory-process`, `factory-world` și `brand-animation`. Galeria și MCP folosesc aceleași preseturi. Controalele simple schimbă textele, durata, reacția la cursor, imaginile și culorile. Compoziția avansată are verificare înainte de aplicare și păstrează schița când se modifică un control simplu.

## Instrumente pentru personalizare

| Instrument | Rol |
|---|---|
| `get_website_factory_world_schema` | Format, limite și exemplu pentru fabrica în miniatură. |
| `preview_website_factory_world` | Verifică strict configurația publică, fără import sau salvare. |
| `upsert_website_factory_world` | Adaugă sau înlocuiește fabrica în miniatură pe un singur website; acceptă `dryRun`. |
| `get_website_animation_schema` | Format, exemplu, limite și culori dinamice. |
| `preview_website_animation` | Validează compoziția fără scriere; nu reprezintă o inspecție vizuală. |
| `get_website_animations` | Citește scenele, ID-urile secțiunilor, culorile și pictogramele website-ului. |
| `upsert_website_animation` | Adaugă o scenă sau înlocuiește animația unei secțiuni exacte; acceptă `dryRun`. |
| `set_website_ingredient_visual` | Schimbă imaginea unui ingredient în toate produsele unui singur website; acceptă `dryRun`. |
| `prepare_website_image_upload` | Pregătește transferul binar al imaginii locale și returnează `uploadURL` temporar. |
| `finish_website_image_upload` | Verifică și optimizează imaginea transferată, apoi returnează `imageUrl`. |

Pentru date și modificări trimite întotdeauna `brandId` și `websiteId` citite din instanță. Instrumentele noi refuză alegerea ambiguă când brandul are mai multe website-uri. Nu folosi instrumente generale cu arie la întreg brandul pentru o schimbare cerută doar pe un site.

## Fabrica în miniatură: un tur de joacă public

`factory-world` este inclusă implicit **numai în Maison Levain (`factory_bakery`)**, după antet. `list_website_visual_experiences` cu `experienceId:"factory-playground"` explică alegerea. Secțiunea poate fi adăugată separat pe website-ul ales, dacă utilizatorul dorește asta; nu o adăuga automat tuturor temelor.

Este o machetă 3D originală, cu șapte etape: malaxare, laminare, formare, dospire, coacere, ambalare, expediere. Vizitatorul alege croissant, produs cu ciocolată sau chiflă; schimbă ziua/seara, rotește/apropie scena, descoperă echipamentele și lansează un lot virtual. Produsele au stări distincte: aluat → foaie → formă → copt → cutie. Jurnalul de explorator se completează prin descoperirea celor șapte etape. Progresul rămâne în fila curentă și nu generează comenzi, producție sau recompense reale.

**Activitatea este generată local, nu transmisă din fabrica reală.** Geometria, personajele și ritmul sunt fictive și etichetate astfel pe pagină. Nu importa planuri interne, coordonate de echipamente, nume de persoane, capacități, stocuri, rețete, loturi sau telemetrie. Schema refuză câmpurile necunoscute și nu oferă conectori operaționali. Textele `stations` trebuie să fie aprobate pentru public; nu copia informații confidențiale în descrieri.

Flux pentru personalizare:

1. Citește `get_website_animations` cu `brandId` și `websiteId` reale. Identifică `type:"factory-world"`, `pageSlug`, `sectionId` și configurația completă.
2. Citește `get_website_factory_world_schema`. Modifică numai câmpurile dorite în configurația citită, păstrând restul.
3. Validează `preview_website_factory_world` cu `config` complet. Apoi cheamă `upsert_website_factory_world` cu identitățile exacte, același `config` și `dryRun:true`.
4. Pentru salvarea autorizată, reapelează cu `dryRun:false`. Citește înapoi și verifică vizual pe desktop, telefon și fără mișcare. Pentru o secțiune nouă omite `sectionId` și alege `position`; nu folosi această variantă când dorești să modifici secțiunea existentă.

**Configurația se înlocuiește integral.** Trimiterea numai a `lighting` restaurează valorile implicite ale celorlalte câmpuri. Folosește citire → modificare → scriere completă pentru a păstra textele și ajustările clientului.

Câmpuri: `title` (1–180), `eyebrow` (0–100), `description` (0–700), `headingLevel` (`h1`/`h2`, implicit `h2`), `lighting` (`day`/`evening`), `autoplay`, `allowPlay`, `product` (`croissant`/`chocolate`/`bun`), `pace` (0.5–1.5), `workers` (0–8), `accentColor` (hex, opțional). `stations` are maximum șapte intrări cu `kind` unic, `title` (1–80) și `description` (0–500). `kind`: `mixing`, `lamination`, `shaping`, `proofing`, `baking`, `packing`, `dispatch`. Intrările omise folosesc textul implicit. Valorile nu sunt timpi, efective sau indicatori ai fabricii clientului.

Scena se încarcă când ajunge în ecran. Pauza, ieșirea din ecran și ascunderea filei opresc animația. `motionLevel:"subtle"` pornește cu pauză; `none` sau preferința sistemului pentru mișcare redusă păstrează explorarea statică și permit avansarea lotului prin „Pasul următor”. Fără WebGL, un poster al machetei și etapele HTML rămân disponibile. Lotul durează 36 de secunde de simulare (în funcție de ritmul ales), iar schimbarea produsului este blocată pe durata lui.

Această componentă are o geometrie fixă de patiserie. Pentru o compoziție proprie cu alte produse, piese, imagini sau forme, folosește `brand-animation` și `upsert_website_animation`; nu promite import de modele 3D sau generarea automată a planului clientului prin `factory-world`.

## Transferă o imagine generată de agent

1. Creează sau editează imaginea cu generatorul nativ al gazdei. Pentru ingrediente și piese, folosește PNG/WebP cu transparență reală, obiect complet și margini libere. Inspectează imaginea înainte de transfer.
2. Cheamă `prepare_website_image_upload` cu `brandId`, `websiteId`, `fileType:"png"` (sau `jpeg`/`webp`).
3. Trimite octeții fișierului local prin HTTP **PUT** la `uploadURL`, folosind `contentType` returnat. Nu pune calea locală în `imageUrl`; nu este accesibilă vizitatorilor. Nu adăuga tokenul MCP în URL sau în documentație.
4. Cheamă `finish_website_image_upload` cu aceleași `brandId`, `websiteId` și `uploadId`. La un răspuns incert, reîncearcă același `uploadId`; rezultatul finalizării este idempotent timp de 15 minute. Dacă un PUT incert a consumat dreptul de transfer, încearcă întâi finalizarea.
5. Folosește **`imageUrl` din finalizare**, nu adresa temporară, în compoziție sau la ingredient. Verifică rezultatul pe site după aplicare.

Sunt acceptate imagini statice PNG, JPEG și WebP, maximum 12 MB și 24 milioane de pixeli. Optimizarea păstrează transparența și produce WebP de maximum 1280 px. Transferul nu modifică pagini, produse sau rețete; aplicarea imaginii este un pas distinct. Un restart invalidează transferurile nefinalizate; reutilizează fișierul local într-un transfer nou.

## Creează o animație proprie

Pornește de la produsul recognoscibil. Alege 3–6 straturi care explică materialul, componentele și rezultatul. Păstrează produsul final la deschiderea paginii (`initialProgress:1`); vizitatorul poate explora etapele fără să aștepte o introducere. Folosește o singură scenă dominantă și secțiuni mai liniștite între efecte.

O compoziție are 1–24 straturi, 2–16 cadre per strat și maximum 8 capitole. Fiecare strat conține **exact una** dintre `imageUrl` și `path`. Traseul este geometrie SVG pentru `viewBox="0 0 100 100"`, fără markup. Nu se acceptă scripturi sau handler-e HTML.

`primary`, `secondary`, `accent`, `ink`, `surface` urmăresc culorile website-ului. Pentru imagini bitmap, potrivirea vizuală trebuie realizată în imaginea însăși; schimbarea paletei nu recolorează fotografiile.

Coordonate: `x`/`y` ale stratului sunt procente din scenă; `width` este procent din lățimea scenei. `frames[].x/y` sunt deplasări procentuale din dimensiunea **stratului**, nu pixeli sau coordonate de scenă. Cadrele încep la `at:0`, se termină la `at:1` și sunt strict ordonate. Câmpurile omise într-un cadru primesc valorile implicite (nu moștenesc cadrul anterior).

Exemplu complet de geometrie proprie, fără fișiere externe, pentru `preview_website_animation`:

```json
{
  "config": {
    "title": "Ideea prinde formă",
    "description": "Explorează cele două părți ale semnăturii noastre.",
    "mode": "hover",
    "duration": 5,
    "cursorStrength": 12,
    "aspectRatio": "4/3",
    "initialProgress": 1,
    "background": "surface",
    "layers": [
      {"id":"left","label":"Prima parte","path":"M 10 10 L 45 10 L 45 90 L 10 90 Z","fill":"primary","width":65,"depth":1,"frames":[{"at":0,"x":-45,"rotate":-12,"opacity":0.5},{"at":1}]},
      {"id":"right","label":"A doua parte","path":"M 55 10 L 90 10 L 90 90 L 55 90 Z","fill":"accent","width":65,"depth":-1,"frames":[{"at":0,"x":45,"rotate":12,"opacity":0.5},{"at":1}]}
    ],
    "chapters": [{"at":0,"title":"Elemente"},{"at":1,"title":"Împreună"}]
  }
}
```

După validare, trimite aceeași compoziție la `upsert_website_animation`, împreună cu ID-urile reale, `pageSlug` exact și `dryRun:true`. Pentru înlocuire folosește `sectionId` returnat de `get_website_animations`. Pe `factory-hero` se înlocuiește numai animația; textele și butoanele se păstrează. Omite `sectionId` numai pentru o secțiune nouă și folosește `position` dacă vrei o poziție precisă. Reapelează fără `dryRun` pentru salvarea deja autorizată, apoi citește înapoi și inspectează pagina.

`mode` poate fi `explore`, `hover`, `loop`. Mișcarea globală `subtle` reduce perspectiva și oprește redarea automată; controalele manuale rămân disponibile. `none` și preferința sistemului pentru mișcare redusă afișează etapele direct, fără tranziții. Redarea se oprește în afara ecranului sau când fila devine ascunsă. Bucla include pauză și nu reîncepe singură după o pauză cerută de vizitator.

Folosește `headingLevel:"h1"` numai dacă scena independentă este titlul principal al paginii; implicit este `h2`. Controalele și intervalul de explorare funcționează și la atingere și tastatură.

## Înlocuiește pictograma unui ingredient

1. Citește `get_menu_preparation` și identifică **ingredientId real**, nu numele sau ID-ul produsului final. Dacă rețetele nu sunt sincronizate, folosește `set_menu_preparation` cu `syncRecipes:true` înainte.
2. Generează și transferă noua pictogramă prin fluxul de mai sus.
3. Trimite `set_website_ingredient_visual` cu `brandId`, `websiteId`, `ingredientId`, `imageUrl` și `dryRun:true`. După verificare, salvează fără `dryRun`.
4. Citește înapoi `get_website_animations` și verifică produsul în meniul public și în antet.

Prioritate: imagine/cheie vizuală individuală pe produs (`set_menu_preparation.ingredientOverrides`) → imagine comună pe website → biblioteca implicită. Schimbarea comună se păstrează la sincronizare și se aplică produselor noi care folosesc același ingredient, inclusiv semipreparate. Ajustările individuale continuă să aibă prioritate. `imageUrl:null` elimină asocierea comună; nu șterge ajustările individuale și nu șterge rețeta.

Nu schimba numele, cantitatea sau compoziția reală pentru un efect vizual. Pentru un ingredient unic, sistemul prezintă fotografia produsului; pentru multe ingrediente selectează un număr lizibil și limitat. Alegerea/ascunderea/ordinea pe produs rămân în `set_menu_preparation`, documentat în ghidul restaurantelor.

## Verificare înainte de încheiere

Verifică produsul final și fiecare etapă, meniul mobil, accesul la produse/contact și eventualele comenzi/rezervări existente. Controlează contrastul, textele reale, dimensiunile fotografiilor și tastatura. Testează modurile discret și fără mișcare. O validare structurală reușită nu dovedește că imaginile au conținutul corect sau că procesul de fabricație ilustrat este real.
