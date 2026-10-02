# Modificatori și opțiuni de produs

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modificatorii sunt opțiuni de personalizare care apar la comandă pentru un produs: „Bine făcut / Mediu / În sânge", „Fără ceapă", „Extra cașcaval", „Tacâmuri", „Extra carne". Îi configurezi pe **fișa produsului**, în tabul **„Modificatori"**, și apar apoi automat peste tot unde se comandă acel produs: portalul QR, magazinul online, POS-ul de la casă, aplicația ospătarilor de pe telefon și platformele de livrare (Glovo, Wolt, Bolt) după sincronizarea meniului. Supraprețul unei opțiuni se adaugă automat la preț.

Implicit există **un singur set** de modificatori, același peste tot. Dacă vrei altceva la ospătar decât la bar, pe Wolt decât pe Glovo sau pe QR decât pe website, treci produsul pe **„Diferit pe platforme"** — vezi secțiunea dedicată mai jos.

Sunt DIFERIȚI de „Meniul Zilei" (meniu la preț fix cu feluri) și de variantele de magazin online (mărimi/culori cu stoc propriu). Modificatorii personalizează UN produs deja ales.

## Concepte

- **Grup de opțiuni** — un set de alegeri cu un nume (ex. „Gătire", „Extra", „Mărime"). Un produs poate avea mai multe grupuri.
- **O alegere vs. mai multe** — un grup e fie „o alegere" (client alege exact una, ca la radio: în sânge / mediu / bine făcut), fie „mai multe" (bifează câte vrea, cu minim/maxim: ex. maxim 3 toppinguri).
- **Obligatoriu / opțional** — un grup obligatoriu cere clientului să aleagă înainte de a comanda (ex. gradul de gătire la un steak). Unul opțional poate fi sărit.
- **Suprapreț** — fiecare opțiune poate avea un cost în plus (ex. „Extra cașcaval +5 lei"); 0 = gratuit. Se adaugă automat la prețul liniei.
- **Preselectat (implicit)** — o opțiune bifată din start (clientul o poate schimba).
- **Două feluri de opțiune**:
  - **Notă** — doar text pentru bucătărie, fără efect pe stoc („Fără ceapă", „Bine făcut").
  - **Opțiune legată de un produs** — o legi de un produs real din inventar (ex. „Extra măsline" → produsul „Măsline"). La comandă **scade stocul din rețeta produsului legat**, exact ca și cum ai fi vândut acel produs. Și dacă produsul legat are alt TVA decât produsul principal (ex. „Tacâmuri" 21% pe o mâncare 11%), pe bonul fiscal iese pe **o linie separată, taxată corect**.
- **Șablon de modificatori** — un set de grupuri gata făcut, refolosibil (ex. „Extra-uri pizza", „Gătire carne", „Tacâmuri & ambalaj"). Îl salvezi o dată și îl aplici pe câte produse vrei deodată; produsele rămân **legate** de el, deci îl editezi o dată și se schimbă peste tot.
- **Platformele unui grup** — pe ce ecrane și canale se oferă grupul. Fără nicio alegere = peste tot.

## Unde le configurezi

1. Deschide fișa produsului (din **Meniu → Prețuri Meniu**, sau caută produsul) → tabul **„Modificatori"**.
2. **Adaugă grup** → dă-i nume, alege „o alegere" sau „mai multe", marchează dacă e obligatoriu, setează min/max.
3. Pentru fiecare opțiune scrie numele și supraprețul. Ca s-o legi de un produs (consum + TVA), apasă **„Leagă produs"** și caută-l — prețul se completează din meniu, iar dacă TVA-ul diferă primești un avertisment că va apărea ca linie separată pe bon.
4. **Salvează Modificări**.

**Șabloane**: din butonul **„Șabloane"** poți salva grupurile curente ca șablon și îl poți aplica pe alte produse. Grupurile aplicate rămân **legate de șablon**: când editezi șablonul (din Biblioteca de modificatori), toate produsele legate se actualizează singure. Pe produs, un grup venit din șablon are eticheta „Din șablon"; ce modifici doar acolo se pierde la următoarea salvare a șablonului. Dacă un produs are nevoie de o abatere, apasă **„Desprinde"** pe grup — rămâne cum e, dar nu se mai actualizează. Celelalte grupuri ale produsului rămân neatinse.

## Modificatori diferiți pe platforme (modul avansat)

Sus în tabul „Modificatori" alegi între **„Același set peste tot"** și **„Diferit pe platforme"**.

- **Același set peste tot** — modul simplu: orice grup apare pe toate ecranele și canalele. Așa funcționează orice produs până schimbi tu.
- **Diferit pe platforme** — fiecare grup primește rândul **„Apare pe:"**, unde bifezi platformele lui:
  - ale casei: **POS Ospătar**, **POS Bar**, **Aplicația ospătarilor**, **Recepție / Casă**, **Kiosk**;
  - ale clientului: **Platforma Clienți**, **QR la masă**, **Website**;
  - de livrare: **Wolt**, **Glovo**, **Bolt Food** și fiecare canal local de livrare, pe numele lui.
  „Toate platformele" readuce grupul peste tot.

Exemple tipice:
- „Gătire" și „Fără…" doar la ospătar și pe aplicația ospătarilor; „Gheață / Fără gheață" doar la bar.
- Extra-urile plătite doar pe Wolt și Glovo, nu și în sală.
- Tacâmuri și ambalaj doar pe canalele de livrare.

**Alt preț pe o platformă** (ex. „Extra cașcaval" 5 lei în sală, 7 lei pe Wolt): apasă **duplică** pe grup, pune pe copie doar platforma respectivă și prețurile ei, iar pe grupul original **scoate** acea platformă. Într-un **șablon**, copia trebuie să aibă alt nume (ex. „Extra Wolt") — un șablon nu poate avea două grupuri cu același nume. Dacă originalul rămâne pe „Toate platformele", clientul de pe Wolt vede ambele grupuri — editorul te avertizează cu „Același grup apare de două ori pe o platformă".

**„Vezi ca pe:"** îți arată ce grupuri primește o platformă, înainte să salvezi.

Ce se întâmplă după salvare:
- POS-ul, aplicația ospătarilor, kioskul, portalul, QR-ul și website-ul arată imediat doar grupurile lor.
- Pe Glovo, Wolt și Bolt schimbarea apare după sincronizarea meniului, care pornește singură la salvare.
- O comandă făcută pe un meniu publicat înainte de schimbare intră normal, cu opțiunile alese atunci.
- Un grup **obligatoriu** restrâns la o platformă e cerut pe acea platformă. Pe portal, QR, website, kiosk și livrări îl verifică și serverul; pe ecranele de personal (ospătar, bar, mobil) îl cere ecranul.
- Șabloanele își duc platformele la toate produsele legate: „extra-urile de pizza doar pe Wolt și Glovo" se setează o dată, în șablon.
- Felurile dintr-un **Meniu al Zilei** arată deocamdată toate grupurile produsului, indiferent de platformă.
- Un server local (edge) neactualizat arată toate grupurile pe toate ecranele până la actualizare; vânzarea nu e blocată.

## Cum apar la vânzare

- **Portal QR / magazin online** — clientul apasă produsul → alege opțiunile → prețul se actualizează → comandă.
- **POS de la casă și aplicația ospătarilor (telefon)** — la marcarea produsului se deschide selectorul de opțiuni; ospătarul alege, prețul se ajustează, iar la bucătărie/KDS și pe bon apar și opțiunile alese.
- **Grupurile obligatorii cer confirmare explicită** — chiar dacă o alegere este preselectată, POS-ul deschide selectorul înainte de adăugare. Serverul cloud și serverul local validează din nou catalogul curent, recalculează supraprețul și salvează alegerile pe linia comenzii; un client vechi nu poate ocoli cerința trimițând produsul fără opțiuni.
- **Glovo / Wolt / Bolt** — grupurile de modificatori se trimit ca „atribute"/„opțiuni" la sincronizarea meniului; fiecare platformă primește doar grupurile oferite pe ea. Clientul le alege pe aplicația platformei, iar comanda intră cu opțiunile alese. (Se re-sincronizează automat când modifici modificatorii unui produs.)
- **Bon fiscal** — supraprețul e inclus în prețul liniei, cu TVA-ul produsului. Excepția: opțiunea legată de un produs cu ALT TVA apare pe linie separată cu cota corectă.
- **Stoc** — opțiunile-notă nu ating stocul; opțiunile legate de un produs scad stocul rețetei acelui produs, ca orice vânzare.

## Prin conexiune (asistent AI / MCP)

Poți gestiona modificatorii și din asistent, fără click prin taburi:
- `get_product_option_groups` — vezi modificatorii unui produs: grupurile, modul (`simple` / `advanced`), platformele fiecărui grup, `availablePlatforms` (cheile valide la acest client) și `offeredByPlatform` (ce vede fiecare platformă). Cu `channel` primești setul efectiv de pe o platformă.
- `set_product_option_groups` — configurezi (înlocuiește tot; trimite toate grupurile).
- `diagnose_product_option_runtime` — de ce nu apare sau nu se salvează un grup pe un canal anume.
- `list_option_group_templates` — vezi șabloanele și câte produse sunt legate de fiecare.
- `save_option_group_template` — creezi un șablon nou.
- `apply_option_group_template` — aplici un șablon pe mai multe produse deodată (rămân legate).
- `update_option_group_template` — modifici șablonul și schimbarea ajunge la toate produsele legate.
- `get_option_group_template_usage` — ce produse sunt legate de un șablon.
- `detach_option_group_template` — desprinzi produse de un șablon.
- `delete_option_group_template` — ștergi un șablon (grupurile de pe produse rămân, fără legătură).

Tipic: „adaugă la «Burger clasic» un grup «Extra» cu cașcaval +5, bacon +6 și un grup obligatoriu «Gătire» cu în sânge/mediu/bine făcut" → asistentul citește produsul, adaugă grupurile și salvează.

### Pași pentru asistent

Ordinea care iese corect din prima:

1. Găsește produsul cu `search_products_db` și ia `productId` (id de produs, nu de articol de meniu).
2. `get_product_option_groups(productId)` — pornește MEREU de aici. `set_product_option_groups` înlocuiește tot setul: un grup netrimis se șterge.
3. Construiește lista completă: grupurile existente (neschimbate sau modificate) plus cele noi.
4. Trimite `set_product_option_groups`. Citește mesajul de răspuns: spune platformele fiecărui grup și avertismentele.
5. Confirmă owner-ului pe scurt ce apare și unde.

Reguli pentru platforme (`visibleChannels` pe grup):

| Vrei | Trimite |
|---|---|
| Grup NOU peste tot (modul simplu) | nu trimite `visibleChannels` |
| Grupul doar pe unele platforme | `visibleChannels: ["waiter", "mobile"]` — chei din `availablePlatforms` |
| Să păstrezi platformele unui grup existent | omite câmpul |
| Să readuci un grup peste tot | `visibleChannels: null` |
| Tot produsul înapoi la modul simplu | `visibleChannels: null` pe fiecare grup |

Chei: `waiter`, `bar`, `mobile`, `reception`, `kiosk`, `portal`, `qr`, `website`, `glovo`, `wolt`, `bolt`, `deliveryapp`, iar pentru canalele locale de livrare `delivery-<id>` — ia-le din `availablePlatforms`, nu le ghici. O cheie de canal local inexistentă e refuzată, cu lista celor valide.

Rețete frecvente:

- **„La bar vreau doar gheață, la ospătar gătirea"** → două grupuri: „Gheață" cu `["bar"]`, „Gătire" cu `["waiter", "mobile"]`.
- **„Extra-urile plătite doar pe Wolt și Glovo"** → grupul „Extra" cu `["wolt", "glovo"]`.
- **„Pe Wolt extra cașcaval costă 7, în rest 5"** → două grupuri cu același nume: întâi cel existent, cu toate celelalte platforme enumerate explicit și prețul 5, apoi copia cu `["wolt"]` și prețul 7. Niciunul cu `null`, altfel Wolt le primește pe amândouă; răspunsul avertizează când se întâmplă. Trimite originalul primul, ca el să-și păstreze opțiunile deja publicate.
- **„Ce modificatori are pizza pe Glovo?"** → `get_product_option_groups(productId, channel: "glovo")`.
- **„Aceleași extra-uri pe 20 de produse"** → `save_option_group_template`, apoi `apply_option_group_template` cu toate id-urile. Platformele puse pe grupurile șablonului ajung pe toate produsele.
- **„Alt preț pe Wolt la toate pizzele"** → în șablon, varianta de Wolt are **alt nume** (ex. „Extra" cu platformele sălii și „Extra Wolt" cu `["wolt"]`). Un șablon nu poate avea două grupuri cu același nume; unealta refuză și spune de ce.
- **„Schimbă extra-urile la toate pizzele"** → `list_option_group_templates` (ia `key`-ul fiecărui grup) → `update_option_group_template`. Nu produs cu produs.
- **„Grupul apare la ospătar, dar nu la bar / pe QR"** → `diagnose_product_option_runtime(productId, channel)` cu aceeași cheie de platformă (`bar`, `qr`, `portal`…); `groupsOnOtherPlatforms` arată grupurile restrânse la alte platforme.

Atenție:
- Un grup administrat de un șablon (`templateId` setat) își ia structura și platformele din șablon. Schimbă-l în șablon sau desprinde produsul; altfel modificarea se pierde la următoarea salvare a șablonului — răspunsul avertizează când schimbi platformele unui astfel de grup.
- Un grup redenumit prin `set_product_option_groups` nu mai e recunoscut ca același grup și pierde legătura cu șablonul; răspunsul spune când se întâmplă.
- După salvare, meniul se re-sincronizează singur la Glovo, Wolt și Bolt; nu porni tu o sincronizare în plus.

## Întrebări frecvente / capcane

- **„Opțiunea nu scade stocul"** → e o opțiune-notă (text). Dacă vrei consum, leag-o de un produs din inventar (butonul „Leagă produs") care are rețetă.
- **„Nu apar modificatorii pe Glovo/Wolt/Bolt"** → verifică întâi dacă grupul e oferit pe platforma aceea (rândul „Apare pe:" sau `get_product_option_groups` cu `channel`), apoi dacă meniul s-a sincronizat pe canal după configurare (există plafoane de sincronizare pe zi la Glovo — vezi ghidul de platforme de livrare).
- **„Grupul apare la ospătar, dar nu la bar"** (sau invers, sau lipsește pe QR) → produsul e pe „Diferit pe platforme" și grupul nu are platforma aceea bifată. Adaug-o la „Apare pe:".
- **„Pe Wolt apare de două ori același grup"** → un grup a fost duplicat pentru Wolt, iar originalul a rămas pe „Toate platformele". Scoate Wolt de pe original.
- **„Am pus platforme pe un grup din șablon și au dispărut"** → grupurile din șablon își iau platformele din șablon. Setează-le în Biblioteca de modificatori sau desprinde grupul de șablon.
- **„Grupul obligatoriu nu lasă comanda"** → e normal: clientul TREBUIE să aleagă. Dacă nu vrei asta, fă grupul opțional.
- **„Produsul s-a vândut, dar nu are opțiunea obligatorie pe linie"** → verifică dacă linia are `productId` chiar când `menuItemId` lipsește. Vânzările POS/server local pot fi salvate legitim doar cu produsul; validarea trebuie să recupereze articolul de meniu activ după `productId + brandId`, apoi să persiste `selectedOptions`. Dacă această urmă lipsește, nu considera problema doar de afișare: afectează prețul, KDS-ul, stocul opțiunilor legate și auditul comenzii.
- **„Vreau aceleași extra-uri pe 20 de produse"** → configurează-le o dată, salvează-le ca șablon și aplică-l pe toate cu un singur pas. Produsele rămân legate: editezi șablonul și se schimbă la toate.
- **Diferența față de Meniul Zilei** → Meniul Zilei e un produs-meniu cu feluri la preț fix; modificatorii personalizează un produs normal deja ales. Pentru meniuri fixe cu feluri vezi ghidul Meniuri de evenimente și Meniul Zilei.
- **Diferența față de variante (magazin online)** → variantele au stoc și preț propriu per combinație (mărime/culoare); modificatorii adaugă opțiuni peste un produs, cu suprapreț.

---

## Pachete (conținut FIX) — și cum le deosebești de combo-uri

Sunt **trei lucruri diferite** care se numesc toate „pachet" în vorbirea curentă. Alege-l pe cel potrivit, altfel iese greșit:

| Vrei să… | Folosește | Unde se configurează |
|---|---|---|
| Vinzi un set cu conținut **FIX** ca un singur produs (ex. „Coș cadou: 2 vinuri + 1 ciocolată") | **Pachet** (Conținut Pachet) | Fișa produsului → tab **„Conținut Pachet"** |
| Vinzi un combo unde **clientul alege** (ex. „Șaorma + sucul la alegere") | **Grup de modificatori obligatoriu** | Fișa produsului → tab **„Modificatori"** |
| Sugerezi pe pagina de produs din magazinul online „Cumpărate frecvent împreună" | **Bundle online** | Se face din asistent (`set_product_bundle`) |

### Cum faci un pachet cu conținut fix

1. Produsul-pachet trebuie să aibă **tipul de produs „Ambalaje/pachet"**. Fără el, tabul „Conținut Pachet" nu apare pe fișă.
2. Deschide fișa produsului → tab **„Conținut Pachet"** → adaugă componentele: ce produs, ce cantitate și, opțional, un **preț suprascris** pentru componenta din pachet (când vrei să valorizezi altfel decât la prețul normal).
3. Salvează. Pachetul se vinde ca UN singur produs; componentele sunt conținutul lui.

### Prin conexiune (asistent AI / MCP)

- `get_product_package` — vezi ce conține pachetul.
- `set_product_package` — setezi conținutul (**înlocuiește complet** lista; cere confirmare).

Tipic: „fă un pachet de sărbători din 2 sticle de vin roșu și o cutie de bomboane" → asistentul verifică tipul produsului, îți arată o previzualizare și scrie abia după confirmarea ta.

### Capcane

- **„Nu văd tabul Conținut Pachet"** → produsul nu are tipul „Ambalaje/pachet". Schimbă tipul produsului, apoi revino.
- **„Am făcut pachet, dar clientul trebuie să aleagă sucul"** → nu e pachet, e **combo cu alegere**: fă un grup de modificatori **obligatoriu**, cu opțiuni legate de produsele reale (ca să scadă și stocul).
- **„Am pus produsul de două ori în pachet"** → pune-l o singură dată, cu cantitatea totală.
- **Un pachet nu se poate conține pe sine** — și nici nu se poate face pachet dintr-un pachet fără să te gândești la stoc: componentele sunt cele care se consumă.
