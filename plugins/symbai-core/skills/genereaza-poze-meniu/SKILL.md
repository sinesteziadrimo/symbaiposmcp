---
name: genereaza-poze-meniu
description: Creează și atașează fotografii de preparate în Symbai cu generatorul nativ din Codex/ChatGPT Desktop, potrivite cu stilul meniului și ingredientele reale. La „pune poze la meniu”, „generează fotografii pentru aceste preparate”, „completează doar pozele lipsă” sau „refă pozele”. Pentru fișiere deja fotografiate/importate folosește adauga-produs-reteta.
---

# Fotografii de meniu create în conversație

Tu inspectezi și generezi imaginile cu instrumentele native ale gazdei desktop. Symbai MCP citește contextul, transferă fișierul și atașează fotografia. Nu apela generatorul/vision AI al site-ului, servicii de imagini externe sau SDK/CLI OpenAI. Nu cere OPENAI_API_KEY. Dacă instrumentul nativ de generare lipsește, explică precis limita și păstrează pregătirea; nu promite generarea într-o gazdă care nu o permite.

## Stabilește selecția printr-o conversație scurtă

- Folosește conexiunea tenantului cerut, verifică `list_brands` și `list_menus`. Continuă pe aceeași conexiune. Nu presupune că un alt server Symbai este același tenant.
- Dacă meniul este deja numit fără ambiguitate, folosește-l. Dacă există mai multe variante, întreabă o singură dată, cu denumirile reale: „Pentru meniul Restaurant sau meniul Livrare?” Continuă între timp inspecțiile care nu depind de alegere.
- „Pune poze la tot meniul” / „completează meniul” înseamnă implicit toate articolele active fără fotografie. „Refă/înlocuiește toate pozele” autorizează și înlocuirea. La selecție pe nume, rezolvă `menuItemId` în meniul ales; dacă două preparate au același nume, clarifică varianta. Nu confunda `productId` cu articolul din meniu.
- Cererea „generează și pune pozele” autorizează atașarea în selecția stabilită: nu mai cere confirmare la fiecare fotografie sau lot. „Arată-mi variante” / „fă o probă” autorizează numai previzualizarea până când omul cere atașarea.
- Anunță concret selecția și stilul observat: „Lipsesc fotografii la 8 preparate. Voi păstra farfuriile albe, fundalul întunecat și lumina laterală din meniul tău.” Nu afirma stilul înainte să vezi pozele. Spune o dată că imaginile sunt generate, bazate pe rețetele disponibile.

## Inspectează preparatele și stilul

1. `get_menu_photo_context(menuId, onlyMissing:true)` oferă numele, descrierea, gramajul, rețeta, poza efectivă și referințe. Pentru înlocuiri/inspecție: `onlyMissing:false`; pentru subset: `menuItemIds` sau `categoryId`. Citește toate paginile necesare folosind `nextAfterId` → `afterId`; nu folosi offset pe lista care se micșorează după atașări. Contează imaginea efectivă, inclusiv cea moștenită de la produs.
2. Inspectează vizual 2–4 referințe relevante cu `view_menu_photo(menuId, menuItemId)`. Tool-ul întoarce blocuri imagine MCP, nu doar un text. La un meniu mixt, separă referințele pentru farfurii, deserturi și băuturi. Lista de referințe este un eșantion; caută în categoria potrivită cu `get_menu_photo_context(categoryId, onlyMissing:false)` dacă este nevoie. Un URL nu dovedește stilul și nici că fotografia poate fi citită.
3. Reține o fișă scurtă de stil: fundal, suprafață, veselă, unghi, lumină, temperatură de culoare, distanță, porție, spațiu în jur, raportul imaginii. Dacă stilurile sunt amestecate, preferă categoria preparatului sau preferința deja exprimată. Dacă nu există referințe, anunță o alegere rezonabilă — fotografie culinară realistă, lumină naturală și fundal neutru — și continuă când omul a cerut execuția. Nu transforma lipsa referințelor într-un chestionar.
4. Construiește fiecare preparat din rețeta reală, apoi descriere și titlu. Gramajul comercial descrie porția; cantitățile ingredientelor pot fi pentru mai multe porții, raportate la `recipe.yield`. Nu pune cantitatea unui lot într-o farfurie. Pentru semipreparate, consultă detaliile rețetei prin tool-urile live de rețetar când compoziția schimbă aspectul. Rețete `missing`/`ambiguous`, titluri vagi („Specialitatea casei”), contradicții sau componente neclare: întreabă grupat numai pentru preparatele afectate; continuă cu cele clare. Nu adăuga ingrediente, garnituri, decoruri comestibile ori mărci care nu sunt susținute de date/user. Preparatul fără rețetă poate fi generat dacă descrierea/titlul îl identifică suficient; notează această bază, fără să inventezi o rețetă în Symbai.

## Generează și verifică în Codex

`recipe.status:not_authorized` înseamnă că această conexiune nu poate citi rețetarul; folosește descrierea/titlul dacă sunt suficiente, altfel cere detaliul culinar necesar. Nu ocoli permisiunile prin SQL sau altă conexiune. `requires_selection` înseamnă ingrediente ALTERNATIVE (de exemplu arome de înghețată), nu toate în același produs: clarifică varianta fotografiată înainte de generare.

Folosește skill-ul `imagegen` al gazdei când este disponibil și instrumentul nativ de generare (`image_gen`/echivalentul expus). Respectă schema LIVE: referințele pot necesita fișiere locale inspectate sau imagini deja prezente în conversație. Nu inventa parametri și nu presupune că generatorul descarcă singur un URL. Dacă trebuie fișiere locale, descarcă numai referințele din meniul selectat și inspectează-le înainte de folosire.

Un preparat = un apel de generare = un fișier individual. Nu crea un colaj de preparate și nu reutiliza aceeași fotografie pentru rețete diferite. Poți reutiliza stilul. Pentru înlocuirea unei fotografii păstrează exact modificările cerute; referințele de stil nu autorizează copierea preparatului din ele.

Structură utilă de prompt, completată din date:

> Fotografie culinară realistă pentru meniul [nume]. Subiect: [titlu și forma/tehnica cunoscută]. Ingrediente și componente vizibile: [date confirmate]. Porție: [gramaj comercial, număr de bucăți dacă este cunoscut]. Referințele sunt pentru [lumină, veselă, fundal, unghi]; preparatul trebuie să rămână cel descris aici. [Fișa de stil]. O singură porție, încadrată potrivit cardului de meniu, cu spațiu pentru decupare. Fără text, preț, watermark, sigle, mâini sau ingrediente suplimentare, dacă acestea nu au fost cerute.

Inspectează rezultatul: preparatul și ingredientele sunt corecte, porția este plauzibilă, nu s-au adăugat garnituri, vesela/ustensilele nu sunt deformate, stilul este coerent, imaginea rămâne lizibilă într-un card mic. Corectează erorile concrete cu generatorul. Nu atașa rezultatul greșit ca să termini lotul. După două corecții nereușite ale aceluiași preparat, păstrează variantele și cere doar informația necesară, continuând restul.

Pentru un meniu mare, păstrează în workspace un mic manifest local: tenant, menuId, selecția, fișa de stil, menuItemId, productId, contextFingerprint, expectedImageUrl, fișier, starea generat/transferat/atașat/verificat și imageUrl final. Actualizează după fiecare pas. Nu pune credențiale sau URL-uri temporare de transfer în memoria businessului. La reluare recitește starea live, verifică fișierele și continuă ce lipsește; nu regenera rezultatele deja bune.

## Transferă și atașează

După inspecție, pentru fiecare fișier:

1. `prepare_menu_photo_upload(menuId, menuItemId, expectedImageUrl:<effectiveImageUrl exact, inclusiv null>, contextFingerprint:<din context>, onlyIfMissing:true, fileType:"png"|"jpeg"|"webp")`. `onlyIfMissing:false` numai pentru înlocuirile autorizate. `skipped_existing` înseamnă că o poză există deja: păstreaz-o și marchează articolul sărit.
2. Salvează `data` din răspuns într-un fișier JSON local temporar. Folosește [scripts/upload_menu_photo.py](scripts/upload_menu_photo.py):

   `python <skill>/scripts/upload_menu_photo.py --file <imagine> --receipt <receipt.json> --tenant-url <tenantUrl verificat>`

   Scriptul trimite doar octeții imaginii la URL-ul temporar returnat de MCP, fără autentificare suplimentară și fără API de generare. Nu cere utilizatorului să ruleze comanda. Nu afișa base64, credențiale sau linkul temporar în conversație. Dacă Python lipsește, folosește transferul binar disponibil în gazdă: PUT, Content-Type din răspuns, maxBytes și același tenant, fără redirecturi. Nu trimite un path local ca URL public.
3. `attach_generated_menu_photo(uploadId)`. La răspuns de transfer incert încearcă această citire/atașare înainte să repeți transferul. La expirare/restart sau eroare nerecuperabilă de transfer: recitește contextul, pregătește un upload nou și refolosește același fișier bun. La conflict de preparat/fotografie, reevaluează selecția; nu forța suprascrierea.
4. Verifică `success` și starea `attached`, apoi recitește articolul cu `get_menu_photo_context(menuItemIds:[id], onlyMissing:false)` și inspectează `view_menu_photo`. Înregistrează finalizarea numai după verificare. Șterge fișierul temporar cu receipt după folosire; păstrează imaginile finale și manifestul de lucru.

Fotografia se atașează numai articolului din meniul ales. Galeria produsului și celelalte meniuri rămân intacte. Dacă omul cere explicit aceeași fotografie și în alte meniuri, inspectează și tratează acele articole ca selecție suplimentară autorizată.

Raportează progresul pe preparate/loturi și încheie cu numerele reale: generate, atașate și verificate, păstrate fiindcă aveau deja poză, rămase cu motiv. O verificare finală de `onlyMissing:true` pe selecția inițială arată ce a rămas. Dă linkul meniului și arată câteva imagini finale. Nu declara întregul meniu complet dacă ai făcut doar prima pagină.

## Dacă instanța nu are încă instrumentele

Caută întâi cele patru nume exacte în catalogul live. Dacă lipsesc, explică faptul că instanța Symbai are nevoie de versiunea care include fotografiile generate în desktop; nu pretinde că un skill poate crea tool-uri pe server. Poți pregăti selecția/promptele/previzualizările autorizate, dar nu înlocui automat fluxul cu `upload_product_photos`: acesta modifică galeria produsului și poate afecta mai multe meniuri.
