# Inginerie de meniu și psihologia prețului

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Ingineria de meniu îți spune negru pe alb care preparate îți aduc bani și care îți mănâncă marja, ca să iei decizii pe date reale din POS, nu din intuiție. Symbai calculează automat cele 4 cadrane (Vedetă / Ghicitoare / Cal-de-povară / Câine) prin `get_menu_engineering`, iar tu acționezi peste ele: rescrii descrieri, repoziționezi pe meniu, ajustezi porția sau prețul, atașezi un side cu marjă mare sau scoți preparatele moarte. Pe deasupra pui psihologia prețului (charm pricing, numere rotunde la fine-dining, ancoră/decoy, triunghiul de aur) și matematica de bundle. Lucrezi MCP-first: citești datele reale, verifici marja înainte de orice ofertă cu `preview_offer_margin`, arăți clar ce se schimbă și ceri confirmare înainte de orice scriere.

## Concepte

- **Cele 4 cadrane (matricea de meniu)** — pe baza a 30-90 de zile de vânzări POS (minim trimestrial, lunar la volum mare):
  - **Vedetă** (popularitate mare + marjă mare) — **protejează, NU reduce niciodată prețul.** Loc în colțul dreapta-sus (triunghiul de aur), nume cu poveste, evidențiere.
  - **Ghicitoare / Puzzle** (marjă mare + popularitate mică) — **promovează, nu o scoate.** Doar rescrierea descrierii + repoziționarea aduce **20-35% creștere a vânzărilor în prima lună** — la cea mai mică intervenție.
  - **Cal-de-povară / Plowhorse** (popularitate mare + marjă mică) — **ajustează porția/costul sau un retuș fin de preț + atașează un side cu marjă mare.** NU pur și simplu o ieftini — pierzi marjă pe un produs deja iubit.
  - **Câine / Dog** (popularitate mică + marjă mică) — **scoate-l (86) sau reinventează-l. Niciodată pe promoție.**
- **Triunghiul de aur al meniului** — ochiul cade întâi pe centru, apoi dreapta-sus, apoi stânga-sus. Acolo pui Vedetele și Ghicitorile optimizate, cu callout („Recomandarea bucătarului").
- **Charm pricing (.99 / .90)** — efectul cifrei din stânga: 19,99 lei se „citește" ca 19, nu 20. Poate ridica vânzările cu **~24%**. Pentru casual/fast-food.
- **Numere rotunde la fine-dining** — 60 lei (fără bani mărunți, uneori fără simbolul „lei") semnalează premium și mută atenția de pe cost. Eliminarea simbolului monedei crește cheltuiala medie.
- **Ancoră / decoy (~32%)** — un produs deliberat scump pus sus pe listă ridică valoarea percepută cu **~32%** și face produsele mid-tier să pară rezonabile. Decoy-ul nu trebuie să se vândă mult — rolul lui e să ancoreze comparația.
- **Matematica de bundle** — prețul pachetului sub à-la-carte, dar peste nota ta medie țintă. Ex.: notă medie 45 lei, produsele fac 65 lei à-la-carte → un meniu fix la **55 lei** e punctul dulce (pare ofertă, dar urcă nota). **Refuză orice ofertă sub ~70% acoperire de cost.**
- **LTO (ofertă pe timp limitat)** — pârghia de creștere fără reducere permanentă: noutate + raritate ridică cererea fără să-ți „antrenezi" clienții să aștepte reduceri. Tehnic 2026: LTO-urile +19% an/an; ~60% din promoții au dat un plus de trafic ~5 puncte peste linia de bază pe durata activă.
- **Add-on / upgrade cu marjă mare** — băuturi/garnituri/deserturi au marjă bună; un „adaugă o băutură la X" sau „upgrade la garnitură premium" îmbunătățește profitabilitatea în loc s-o subvenționeze.
- **Prag de livrare gratuită** — setat **15-25% peste nota medie actuală** urcă fiabil valoarea coșului, cu un indemn de progres („mai adaugă 18 lei pentru livrare gratuită").
- **Incrementalitate, nu redempție** — întrebarea corectă nu e „câți au folosit oferta", ci „câți NU ar fi venit altfel". Reducerea generalizată îți antrenează clienții să aștepte reduceri și distruge marja pe clienții fideli care oricum plăteau întreg.
- **Oferte pe interval orar / vreme / eveniment** — happy hour, 2+1, early-bird umplu ferestrele goale fără să reduci la vârf. Oferta de zi ploioasă (supă/comfort food) e mainstream în 2026, nu doar pentru lanțuri.

## Fluxuri frecvente

### 1. Pasul trimestrial de inginerie de meniu (acțiune peste cele 4 cadrane)
1. **Citește cadranele** — `get_menu_engineering` [citire] pe brandId, pe 30-90 de zile. Arată owner-ului cine e Vedetă / Ghicitoare / Cal / Câine, în limbaj simplu.
2. **Pentru fiecare Ghicitoare** (marjă mare, popularitate mică) — repoziționează sus în categorie cu `update_menu_item` [marketing] (sortOrder/poziție) + rescrie descrierea apetisant cu `generate_product_description` [marketing]. Aici e câștigul de **20-35%** — explică-i owner-ului că nu schimbăm prețul, doar locul și textul.
3. **Pentru fiecare Cal-de-povară** (popular, marjă mică) — retuș fin de preț cu `bulk_update_menu_item_prices` [marketing] (mută la o cifră charm, ex. 28 → 28,99) ȘI atașează un side cu marjă mare cu `set_product_recommendations` [marketing]. NU ieftini.
4. **Pentru fiecare Câine** (slab/slab) — propune scoaterea cu `set_product_86` [marketing] (sau reinventare). Confirmă cu owner-ul înainte. NICIODATĂ pe promoție.
5. **Pentru fiecare Vedetă** — `update_menu_item` [marketing]: nume cu poveste + poziție în triunghiul de aur (dreapta-sus). Exclude-o din orice reducere.
6. **Verifică prin citire** — `list_menu_items` [citire] ca să confirmi că modificările s-au aplicat. Nu te baza pe ecranul UI.
7. Pentru meniul fizic tipărit (aranjarea pe pagină, triunghiul de aur vizual), continuă cu skill-ul `meniu-fizic` / `knowledge/meniu-fizic.md`.

### 2. Happy Hour pe interval orar (umple o fereastră goală, fără să strici marja)
1. **Idei de umplere** — `list_offer_suggestions` [citire] cu obiectiv „umple fereastra goală"; alege o idee.
2. **Verifică marja ÎNTÂI** — `preview_offer_margin` [citire] cu tipul, valoarea și scope-ul (de preferat o categorie cu marjă mare). Acceptă doar verdict „pe plus" / ≥70% acoperire.
3. **Creează oferta cu fereastră orară** — `create_offer` [marketing] cu `timeStart`/`timeEnd` (ex. 15:00-18:00) + `daysOfWeek` (ex. luni-joi). **Fără fereastră de timp, oferta merge non-stop (24/7)** — deci pune întotdeauna intervalul pentru un happy hour.
4. **După 10-14 zile** — `get_offer_scorecard` [citire]: păstrezi sau oprești.

### 3. LTO profitabilă (noutate, fără reducere permanentă)
1. **Creează produsul LTO** — `add_menu_item` [marketing] (sau produsul nou).
2. **Prețuiește pentru profit** — `preview_offer_margin` [citire] înainte de a fixa prețul.
3. **Oferta pe interval de date** — `create_offer` [marketing] cu `startsAt`/`expiresAt` pentru o fereastră de 2-4 săptămâni (fix sau buy-x-get-y). Se închide singură la termen — exact ce vrei la un LTO.
4. **Anunță-l** — `create_website_promotion` [marketing] (banner cu aceleași date) + `push_notify_customers` [marketing] (confirm:true) sau `marketing_generate_post` [marketing] pentru social.
5. **La final** — `get_offer_scorecard` [citire] pentru liftul real, apoi lasă-l să expire.

### 4. Bundle + creșterea coșului online
1. **Găsește o ancoră cu marjă mare** — `get_menu_engineering` [citire] (o Vedetă sau Ghicitoare optimizată).
2. **Construiește pachetul** — `set_product_bundle` [marketing]: produsul principal + 1-2 produse de atașat, cu reducere verificată la marjă (sub à-la-carte, peste nota țintă).
3. **Prag de livrare gratuită** — folosește `get_free_shipping_suggestions` [citire] pentru un prag la 15-25% peste nota medie, apoi setează-l din aplicație (Magazin Online → Livrare).
4. **Cod „cheltuie X, primești Y"** — `create_discount_code` [marketing] (confirm:true).
5. **Măsoară** — `get_sales_analytics` [citire] / `raport_vanzari` [citire] înainte/după, ca să confirmi creșterea notei medii.

### 5. Win-back țintit pe loialitate (incrementalitate, nu reducere generalizată)
1. **Segment de clienți inactivi** — `evaluate_loyalty_drop_alerts` [citire] / `preview_guest_segment` [citire] (lapsed 30-60 zile).
2. **Verifică marja** — `preview_offer_margin` [citire].
3. **Ofertă LIMITATĂ pe acel segment**, NU pe tot magazinul — `create_offer` [marketing] cu scope/canale restrânse SAU `create_discount_code` [marketing] single-use.
4. **Trimite doar pe segment** — `push_notify_customers` [marketing] sau `send_email_campaign` [marketing] (confirm:true), nu broadcast.
5. **Dovedește liftul** — `get_offer_scorecard` [citire] + `get_attribution_report` [citire], păstrând un grup-control necontactat (holdout ~10%) ca să separi clienții NOI de fidelii pe care i-ai subvenționat degeaba.

## Tool-uri MCP utile

- `get_menu_engineering` [citire] — matricea celor 4 cadrane (Vedetă/Ghicitoare/Cal/Câine) pe vânzări POS; parametri: `brandId`, fereastră de zile.
- `preview_offer_margin` [citire] — verdict de marjă înainte de orice ofertă; `type`, `value`, `scope`. Rulează-l ÎNTOTDEAUNA primul; refuză sub ~70% acoperire de cost.
- `create_offer` [marketing] — creează oferta; suportă **interval orar** (`timeStart`+`timeEnd`+`daysOfWeek` pentru Happy Hour) ȘI **fereastră de date** (`startsAt`/`expiresAt` pentru LTO). Fără fereastră de timp → rulează 24/7. (confirm:true unde aplică pe canale live.)
- `update_offer` [marketing] — modifică o ofertă existentă (interval, valoare, scope).
- `list_offers` [citire] / `list_offer_suggestions` [citire] — ofertele active și idei de ofertă (ex. „umple fereastra goală").
- `get_offer_scorecard` [citire] — performanța ofertei după rulare (păstrezi/oprești).
- `set_product_bundle` [marketing] — pachet principal + produse de atașat, cu reducere verificată la marjă.
- `set_product_recommendations` [marketing] — atașează un side cu marjă mare la un Cal-de-povară.
- `bulk_update_menu_item_prices` [marketing] — retuș de preț în masă (charm pricing pe Cai-de-povară).
- `update_menu_item` [marketing] — nume cu poveste + repoziționare în triunghiul de aur.
- `generate_product_description` [marketing] — rescrie descrierea unei Ghicitori (câștigul de 20-35%).
- `set_product_86` [marketing] — scoate temporar un Câine din meniu; `restore_product_86` [marketing] îl readuce.
- `create_discount_code` [marketing] — cod de reducere (ex. „cheltuie X, primești Y", single-use pe win-back). (confirm:true)
- `get_free_shipping_suggestions` [citire] — prag recomandat de livrare gratuită (țintă: +15-25% peste nota medie).
- `create_website_promotion` [marketing] — banner pe magazinul online aliniat la datele ofertei.
- `get_sales_analytics` [citire] / `raport_vanzari` [citire] / `top_produse` [citire] — vânzări înainte/după, top produse, nota medie.
- `get_attribution_report` [citire] — liftul real al unei oferte/campanii (incrementalitate vs holdout).
- `marketing_location_weather` [citire] — context de vreme pentru o ofertă reactivă (supă/comfort food pe zi ploioasă).
- `push_notify_customers` [marketing] / `send_email_campaign` [marketing] — anunță oferta pe segment (confirm:true; verifică `check_marketing_allowed` întâi).

## Întrebări frecvente și capcane

- **Cum cresc vânzările cel mai repede, fără să schimb prețurile?** Rulează `get_menu_engineering`, ia Ghicitorile (marjă mare, popularitate mică), rescrie-le descrierea cu `generate_product_description` și ridică-le sus în categorie cu `update_menu_item`. Doar repoziționarea + rescrierea dau **20-35%** în prima lună.
- **Pun .99 sau număr rotund?** Depinde de poziționare: charm pricing (.99/.90) pentru casual/fast-food (până la +24%); numere rotunde, fără bani mărunți, la fine-dining (semnalează premium). Nu amesteca cele două stiluri pe același meniu.
- **Funcționează ancora/decoy-ul?** Da — un produs deliberat scump sus pe listă ridică valoarea percepută a restului cu ~32% și face mid-tier-ul să pară rezonabil. Decoy-ul nu trebuie să se vândă; rolul lui e comparația.
- **Un Cal-de-povară se vinde grozav dar are marjă mică — îl ieftinesc?** NU. Pierzi marjă pe un produs deja popular. Ajustează porția/costul, fă un retuș fin de preț (la o cifră charm) și atașează-i un side cu marjă mare (`set_product_recommendations`).
- **Ce fac cu produsele care nu se vând și nici nu au marjă (Câini)?** Scoate-le (`set_product_86`) sau reinventează-le complet. Niciodată pe promoție — o promoție pe un Câine doar subvenționează un produs pe care nimeni nu-l vrea.
- **Cum fac o ofertă doar la prânz / doar luni-joi?** `create_offer` cu `timeStart`+`timeEnd`+`daysOfWeek`. **Atenție: dacă NU pui fereastră de timp, oferta merge non-stop (24/7).** Pentru un LTO pe câteva săptămâni folosește `startsAt`/`expiresAt` în loc.
- **Cum prețuiesc un bundle ca să nu pierd bani?** Sub à-la-carte, peste nota medie țintă, și mereu cu `preview_offer_margin` înainte — refuză orice sub ~70% acoperire de cost. Ex.: notă medie 45, valoare à-la-carte 65 → meniu fix la ~55.
- **De ce reducerile generalizate sunt o capcană?** Îți antrenează clienții să aștepte reduceri și distrug marja pe fidelii care oricum plăteau întreg. Leagă ofertele de o acțiune (înscriere la loialitate, win-back pe segment inactiv), limitează frecvența și măsoară liftul față de un holdout — ofertele țintite pe loialitate bat reducerea deschisă cu 14-34%.
- **Cât de des refac analiza?** Minim trimestrial, lunar la volum mare. Cadranele se schimbă cu sezonul și cu prețurile la furnizori.
- **Sortarea / aranjarea fizică pe pagina de meniu** (triunghiul de aur vizual, layout) se face din aplicație, prin designerul de meniu fizic — vezi skill-ul `meniu-fizic`.

## Vezi și

- `marketing-social.md` — postări, reclame, anunțarea ofertelor pe social.
- `email-marketing.md` — campanii și fluxuri de email pentru anunțarea ofertelor și win-back.
- `push-notificari-marketing.md` — push pentru happy hour, LTO și puncte care expiră.
- `loialitate-fidelizare.md` — oferte țintite pe loialitate, economia programului, win-back.
- `crm-automatizari-playbooks.md` — segmente, RFM, automatizări de retenție.
- `rapoarte-preturi.md` — food cost, marjă, nota medie, P&L.
- `plan-marketing-strategie.md` — încadrarea ofertelor în planul trimestrial și calendarul sezonier.
