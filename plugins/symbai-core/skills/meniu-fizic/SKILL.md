---
name: meniu-fizic
description: Construiește și finalizează meniul fizic prin Symbai MCP și vederea nativă din Codex/ChatGPT Desktop — stil, teme, fotografii generate, coperți, paginare, alergeni, verificare vizuală și PDF. Pentru „fă-mi meniul”, „aranjează meniul de tipar”, „A3 pliat”, „meniu spectaculos” sau îmbunătățirea unui design existent.
---

# Meniul fizic, gata de predat

Livrează un design complet, văzut și corectat pagină cu pagină, plus PDF-ul potrivit utilizării. Cererea „fă-mi meniul în stilul…” autorizează alegerile estetice și editarea designului: alege tema, tipografia, compoziția, fotografiile și ritmul paginilor. Nu cere aprobarea fiecărui font, erou sau fundal. „Arată-mi variante” înseamnă propunere până când utilizatorul cere aplicarea.

## Identifică și pregătește

1. Confirmă tenantul pe conexiunea cerută, apoi brandul → meniul → designul: `list_brands`, `list_menus`, `list_physical_menu_designs`. Folosește selecția numită sau deja stabilită. Întreabă numai dacă rămân meniuri cu scopuri diferite și cererea nu le distinge. Pentru un design nou poți alege un nume și chema `create_physical_menu_design`; nu obliga utilizatorul să aleagă dintre designuri vechi dacă a cerut unul nou. Duplică doar un design al aceluiași meniu, prin `fromConfigId`.
2. `audit_physical_menu_readiness(configId)` și `get_physical_menu_config` pe secțiunile necesare. Auditul include date live, produse lipsă/duplicate, goluri concrete pe articole și `production` cu verificarea de tipar. Un design proaspăt cu zero categorii trebuie deschis în designer pentru hidratarea catalogului înainte de tema finală.
3. Definitivează informațiile înainte de paginare. Pentru câmpuri de catalog citește [meniu-fizic-pricing.md](../../knowledge/meniu-fizic-pricing.md). `menuItemId` / `productId` din design este articolul de meniu; identificatorul produsului din catalog este altul. Păstrează prețurile și datele comerciale confirmate. O cerere de design nu autorizează schimbări arbitrare de preț, rețetă sau afirmații alimentare.
4. Notează un brief scurt: stilul cerut, formatul final, publicul, limbile existente, paleta, fonturile, direcția fotografică și tipul de PDF. Dacă stilul nu a fost precizat, dedu-l din brand, preparate și imaginile inspectate, anunță alegerea și continuă.

## Proiectează autonom

`list_physical_menu_templates(style)` oferă teme complete. Colecția include Maison editorial, Nocturne atelier, Riviera botanica, Rosé pâtisserie și Cobalt social, alături de temele existente. Alege o direcție coerentă, nu un amestec de efecte. `apply_physical_menu_template` aplică tema completă prin MCP; nu este necesar click pe galerie. Folosește `physical_menu_hero_research` când selecția preparatelor reprezentative poate beneficia de datele meniului.

- Un accent vizual puternic pe pagină; restul conținutului trebuie să se scaneze ușor. Aliniază prețurile, păstrează unitățile și diacriticele, separă consecvent secțiunile. Nu face toate preparatele „vedete”.
- Oferă fotografiei spațiu pentru decupare. Nu folosi fundaluri aglomerate sub ingrediente sau alergeni. Pe pagini dense, preferă fotografii puține și bine alese.
- Fundalul coperții, ornamentul vectorial și fotografia au roluri diferite. Poți combina discret ornamentul cu o fotografie; verifică lizibilitatea titlului, siglei și codului QR.
- Citește [meniu-fizic-design.md](../../knowledge/meniu-fizic-design.md) pentru câmpurile exacte. Modifică prin setterele dedicate și primitivele de structură. La conflict de versiune recitește și reaplică doar schimbarea necesară.

## Imagini generate în conversație

Folosește instrumentul nativ de generare din gazdă și skill-ul `imagegen`, dacă este disponibil. Nu cere cheie API și nu muta automat generarea pe API-ul AI al site-ului. Dacă instrumentul nativ lipsește, spune limita precisă; poți continua cu fotografiile existente și decor vectorial.

Inspectează întâi fotografiile disponibile. Pentru un preparat citește `get_menu_photo_context` și, la nevoie, `view_menu_photo`; ingredientele reale și porția au prioritate. Urmează [genereaza-poze-meniu](../genereaza-poze-meniu/SKILL.md) pentru fotografia din catalogul meniului. Pentru imagine folosită numai în designul fizic:

1. Generează coperta/fundalul/fotografia în stilul brief-ului. Pentru decor: fără texte, prețuri, logo-uri sau preparate prezentate ca reale; cere spațiu liniștit în zona textului. Pentru preparate: fără ingrediente sau garnituri inventate. Imaginea AI nu dovedește alergeni, ingrediente ori gramaj.
2. Inspectează fișierul generat. Verifică preparatul, obiectele deformate, spațiul de decupare, contrastul și rezoluția. Corectează cu generatorul înainte de atașare.
3. `prepare_physical_menu_image_upload(configId, target, fileType, pageIndex?, menuItemId?)`; target = `cover`, `background`, `page-background` sau `item`. Pregătește și finalizează fiecare transfer înainte să începi altul pe același design, pentru a păstra revizia corectă.
4. Transferă octeții fișierului cu PUT la `uploadURL`, fără alte credențiale, respectând `contentType`, `maxBytes`, expirarea și tenantul. Folosește [scriptul de transfer](scripts/upload_physical_menu_image.py) cu `--file`, `--receipt` (răspunsul MCP salvat local) și `--tenant-url`. Nu afișa base64 sau URL-ul temporar și nu folosi o cale locală în loc de URL al imaginii.
5. `attach_physical_menu_image(uploadId)`; reluarea aceluiași ID este idempotentă. La expirare/conflict, recitește designul, pregătește un transfer nou și refolosește imaginea bună. Verifică URL-ul prin citire și fotografia în pagină prin inspecția următoare.

Atașarea aceasta schimbă numai designul fizic. Pentru fotografii comune meniului digital, folosește fluxul dedicat fotografiilor de meniu.

## Formate și număr de pagini

A3 pliat în două = coală 420 × 297 mm, pagini A4 de 210 × 297 mm. Totalul logic, inclusiv coperta, interioarele, anexele și ultima copertă, trebuie să fie 4, 8, 12, 16… pagini.

Decide după conținut. Mai întâi redistribuie categoriile, elimină golurile accidentale și echilibrează fotografiile. Poți micșora o fotografie excesivă sau reduce spațiul inutil. Dacă rămâne prea mult conținut, adaugă grupul următor de patru pagini. Nu elimina preparate și nu ascunde ingrediente/alergeni ca să încapă. Nu inventa texte despre povestea localului pentru a umple pagini: folosește doar date confirmate, o anexă utilă sau o copertă finală deliberată. Folosește `repaginate_physical_menu` pentru rearanjare; păstrează paginile introduse manual până le inspectezi.

`printPlan` întors de inspecție descrie ordinea colilor. PDF reader este în ordine de răsfoire; PDF print are paginile impuse pentru tipografie. Nu activa din nou modul broșură la imprimarea PDF-ului deja impus. Înainte de tiraj cere probă de la tipografie doar dacă utilizatorul comandă efectiv tipărirea.

## Alergeni și informații alimentare

Verifică fiecare produs, variantele și semipreparatele din rețetă, pe baza fișelor reale. Separă lipsa informației de absența confirmată a alergenilor. Un badge vegan sau „fără lactoză” nu înlocuiește declarația de alergeni. Laptele este alergenul relevant, nu numai lactoza. Legenda trebuie să explice simbolurile folosite, iar simbolurile și textul să fie vizibile la dimensiunea reală de tipar. Sursa de referință pentru cele 14 categorii este [Regulamentul UE 1169/2011, anexa II](https://eur-lex.europa.eu/eli/reg/2011/1169/oj).

Nu calcula nutriția dintr-o fotografie. Preferă date verificate sau calcule din rețete cu cantități și randament corecte; păstrează baza /100 g sau /porție explicită și consecventă. Verifică și ingredientele, aditivii și mențiunile despre produse congelate atunci când datele și regulile aplicabile le cer. Nu declara conformitate legală completă pe baza unui scor automat.

Dacă lipsesc date esențiale, continuă restul designului și pune o singură întrebare grupată pentru articolele afectate. Păstrează rezultatul ca „pregătit, cu aceste date de confirmat”, fără să pretinzi că este gata de tipar.

## Vezi, corectează, livrează

1. Deschide `designerLink` întors de tool (include `config` și `agentReview=1`) într-un browser autentificat al gazdei, inclusiv browserul disponibil în Codex. Nu depinde de o extensie Chrome anume. Confirmă meniul/designul în interfață. Editorul face repaginarea și pregătește automat imaginile; nu naviga manual prin zeci de pagini.
2. `inspect_physical_menu_pages` întoarce imagini MCP. Inspectează fiecare planșă și continuă cu `nextPageStart` până la final. Pentru alergeni, texte mici și decupaje cere `detail:'page'`, de regulă o pagină odată. `complete:false` înseamnă că pregătirea nu s-a încheiat.
3. Verifică margini, cotor, coloane, titluri fără produse sub ele, suprapuneri, text tăiat, fotografii lipsă/pixelate, prețuri, gramaje, numerotare, anexe și QR. Corectează prin MCP, redeschide linkul și inspectează versiunea nouă. Un snapshot expirat sau vechi nu este dovadă.
4. Repetă auditul datelor și inspecția până la rezolvarea problemelor remediabile. O pagină goală adăugată automat pentru multiplu de patru trebuie judecată ca parte a compoziției, nu ignorată.
5. `export_physical_menu_pdf(configId, mode:'reader')`. Dacă răspunsul are `status:'needs-render'`, deschide linkul, așteaptă finalizarea exportului și reapelează. Pentru broșură repetă cu `mode:'print'`. `status:'ready'` oferă `downloadUrl`, numărul paginilor, revizia și expirarea. Linkul cere browser autentificat și expiră; descarcă documentele finale, nu le trata ca linkuri publice permanente.
6. Deschide PDF-ul final și verifică numărul/dimensiunile paginilor și paginile cu cele mai multe detalii. Arată utilizatorului câteva pagini reprezentative și oferă fișierele finale. Spune formatul, numărul de pagini și numai eventualele informații încă necesare. Nu declara „totul verificat” dacă ai văzut doar coperta.

Pentru meniuri mari, păstrează un mic manifest local cu tenant/menu/config, brief, imagini generate și atașate, pagini inspectate, ultima revizie și PDF-uri. La reluare citește starea actuală și continuă lucrul nefinalizat. Nu păstra credențiale sau URL-uri temporare în memoria businessului.
