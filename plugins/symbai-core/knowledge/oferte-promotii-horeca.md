# Oferte și Promoții HoReCa

> Pentru linkul exact către pagina de oferte/reclame folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

O ofertă bună aduce mese în plus FĂRĂ să-ți mănânce marja. Regula de aur Symbai: rulează `preview_offer_margin` ÎNAINTE de publicare și uită-te la verdict. Din 31 iulie 2026 verdictul **nu mai blochează** publicarea — dacă vrei un produs-momeală, o lichidare de stoc sau o deschidere agresivă, oferta se publică oricum, cu avertisment. Decizia e a ta; treaba noastră e să-ți spunem în lei ce faci. Cele mai profitabile promoții nu sunt „minus la tot", ci add-on-uri, upgrade-uri, bundle-uri și oferte cu termen-limită (LTO), care cresc nota fără să te înveți clienții să aștepte reduceri. Iar succesul unei oferte îl judeci prin venit incremental (`get_offer_scorecard`), NU prin câte răscumpărări a avut.

⚠ **Cea mai frecventă greșeală de configurare**: „Voucher (sumă fixă)" folosit ca preț de meniu. Vezi secțiunea *Ce tip de ofertă alegi* — greșeala costă bani reali în fiecare zi în care oferta rulează.

Claude Code lucrează MCP-first: citește marja reală, propune oferta, arată impactul în lei, cere confirmare, publică, apoi măsoară lift-ul real față de fereastra dinainte.

## Ce tip de ofertă alegi (citește înainte de prima ofertă)

Tipul decide dacă reducerea se aplică **o dată pe comandă** sau **pe fiecare bucată**. E cea mai costisitoare confuzie din tot modulul.

| Vrei să... | Tip | Ce pui în valoare | La 10 espresso pe aceeași notă |
|---|---|---|---|
| „−10 lei la nota asta" (voucher) | **Voucher (sumă fixă)** `fixed` | cât scazi | −10 lei **o singură dată** |
| „espresso costă 5,50 lei la prânz" | **Meniu de prânz** `fixed_price_per_unit` | **prețul final pe bucată** (5,50), nu diferența | 55 lei — fiecare bucată la 5,50 |
| „−20% la deserturi" | **Procent** `percentage` | procentul | pe toate, proporțional |
| „al doilea la jumătate" / „1+1" | **Buy X get Y** `buy_x_get_y` | — | pe seturi |
| „meniul zilei + o băutură = −10 lei" | **Combo** `combo` | cât scazi **per set** | vezi mai jos |

**Capcana**: un patron care vrea „espresso 5,50 lei" alege instinctiv „Voucher (sumă fixă)" și scrie diferența (5,40). Rezultatul: clientul cu 3 espresso primește 5,40 lei reducere, nu 16,20. Simptomul pe care îl vei observa: *„am bătut mai multe cafele și se pune o singură ofertă"*. Dacă numele ofertei tale conține un preț („Limonadă 12 lei"), aproape sigur vrei **Meniu de prânz**, nu Voucher. Symbai îți cere o confirmare explicită când salvezi un Voucher legat de produse anume, exact ca să te oprească aici.

**Combo — cum se numără.** Reducerea se acordă **o dată pentru fiecare set complet**, iar componenta cea mai rară limitează:
- 5 meniuri + 5 cafele ⇒ reducerea de **5 ori**;
- 1 meniu + 5 cafele ⇒ **o singură dată** (surplusul de cafele nu se plătește);
- 3 meniuri + 7 băuturi ⇒ de 3 ori.
Componentele trebuie să fie **distincte** — același produs nu poate fi și „componenta 1" și „componenta 2", altfel o singură bucată ar acoperi ambele roluri. Poți pune mai multe variante într-o componentă („cafea SAU limonadă") și poți cere mai multe bucăți („2 × băutură per set").

## Concepte

- **Margin Guardrail = sfat, nu barieră.** `preview_offer_margin` și panoul din sertar îți spun în lei marja înainte/după, dacă vinzi sub cost și ce volum suplimentar ți-ar trebui ca să iasă pe plus. Din 31 iulie 2026 o ofertă sub cost **se publică** — primești avertisment (butonul devine roșu, iar după salvare un mesaj), nu refuz. Rulează totuși preview-ul: să vinzi sub cost din greșeală și să vinzi sub cost intenționat arată la fel pe bon, dar înseamnă lucruri foarte diferite pentru tine.
- **Oferta urmărește produsul de pe masă.** Dacă produsul pe care se sprijinea oferta pleacă de pe notă — șters, returnat, dat „din partea casei" sau transferat pe altă masă — reducerea **dispare automat**, nota revine la prețul corect. Invers: dacă ospătarul mută sau șterge un produs **fără legătură** cu oferta, chiar și seara târziu după ce fereastra ofertei s-a închis, reducerea **rămâne** — se judecă după ora la care a fost marcat produsul, nu după ora operației. Notele deja încasate nu se recalculează niciodată.
- **Cele 5 rețete margin-safe de ofertă:**
  1. **Add-on** — „adaugă o băutură la X lei". Băuturile/garniturile/deserturile au marjă mare, deci promoția CREȘTE profitul, nu îl subvenționează.
  2. **Upgrade** — „treci la garnitură premium pentru +Y lei". Vinzi în sus pe ceva ce oricum comandă.
  3. **Bundle / prix-fixe** — preț SUB à-la-carte dar PESTE nota ta țintă. Dacă nota medie e 45 lei și produsele fac 65 lei separat, un meniu fix la 55 lei e punctul dulce (pare chilipir, dar ridică nota).
  4. **Happy Hour / interval orar** — reducere doar într-o fereastră slabă (15:00–18:00, marți–joi), ca să umpli golurile FĂRĂ să tai la vârf.
  5. **LTO (Limited-Time Offer)** — ofertă cu dată de start și sfârșit. Tehnomic ian-2026: LTO-urile au crescut cu +19% an/an pentru că noutatea + raritatea aduc cerere fără tăiere permanentă de preț; ~60% din promoțiile naționale au dat un lift de trafic de ~5 puncte peste linia de bază în fereastra activă.
- **Bundle: regula prețului.** Pachet sub à-la-carte, peste nota ta țintă. Online se face cu `set_product_bundle` (apare ca „Cumpărate frecvent împreună" pe pagina produsului).
- **Interval orar.** `create_offer` acceptă `timeStart`, `timeEnd` și `daysOfWeek` → oferta rulează DOAR în acea fereastră (Happy Hour). FĂRĂ aceste câmpuri oferta rulează 24/7 — atenție, nu lăsa un „-30% la prânz" să se aplice și la cină.
- **Fereastră de campanie (LTO).** `create_offer` acceptă `startsAt` și `expiresAt` (ISO 8601) → oferta se aprinde și se stinge singură la datele setate. O LTO se omoară la program; n-o lași „pe veci".
- **Incrementalitate, NU răscumpărări.** Întrebarea corectă nu e „câți au folosit oferta", ci „câți NU ar fi venit altfel". `get_offer_scorecard` compară perioada cât rulează oferta cu o fereastră egală imediat dinainte (aceleași zile/ore) și-ți dă venitul incremental real în lei + mesele în plus + verdict keep/kill. Reducerea generalizată îți învață clienții să aștepte coduri și distruge marja pe regulații care plăteau întreg.
- **Loialitate bate reducerea oarbă.** Ofertele țintite (signup loialitate, win-back pe segment răcit) bat reducerile deschise cu 14–34% pe conversie, profit/client și ROAS. Leagă oferta de o ACȚIUNE, plafonează frecvența, măsoară lift-ul față de un holdout.
- **Promoția pe website ≠ reducere pe notă.** `create_website_promotion` face un banner/pop-up VIZUAL pe site — anunță oferta, dar NU reduce nimic pe bon. Reducerea reală pe POS o face DOAR `create_offer`. Folosește-le împreună: oferta taie prețul, bannerul o anunță.
- **Pragul de transport gratuit (AOV online).** Setează-l cu 15–25% peste nota medie curentă și arată un indicator de progres („mai adaugă 18 lei pentru livrare gratuită") — ridică fiabil valoarea comenzii.

## Fluxuri frecvente

### 1. Happy Hour margin-safe (umple un interval slab) `[marketing]`
1. `list_offer_suggestions(goal:'fill_slow')` — Sym propune idei calculate din heatmap-ul tău orar real, fiecare cu verdictul de marjă deja calculat.
2. `preview_offer_margin(type, value, appliesToType:'category', appliesToIds)` — confirmă verdictul „pe plus" pe o categorie cu marjă mare.
3. `create_offer(name, type:'percentage', value, channels:['pos'], appliesToType:'category', appliesToIds, daysOfWeek:[2,3,4], timeStart:'15:00', timeEnd:'18:00')` — fereastra orară face oferta să ruleze DOAR marți–joi 15–18. (Fără `timeStart`/`timeEnd`/`daysOfWeek` ar rula 24/7.)
4. După 10–14 zile: `get_offer_scorecard(offerId)` → keep / kill.

### 2. LTO profitabilă (noutate, fără tăiere permanentă de preț) `[marketing]`
1. Creează produsul LTO din meniu (vezi skill-ul `adauga-produs-reteta`) sau alege unul existent.
2. `preview_offer_margin` — prețuiește-l ca să iasă pe profit.
3. `create_offer(name, type:'fixed' sau 'buy_x_get_y', value, channels, startsAt:'2026-02-01T00:00:00Z', expiresAt:'2026-02-14T23:59:59Z')` — fereastra de 2 săptămâni se aprinde și se stinge singură.
4. `create_website_promotion(name, targetUrl, title, startsAt, endsAt aliniate cu oferta)` ca să o anunți vizual + `push_notify_customers` / `marketing_generate_post` pentru anunț.
5. La final: `get_offer_scorecard` → raportezi lift-ul; oferta a expirat deja singură.

### 3. Add-on / upgrade care crește profitul `[marketing]`
1. `get_menu_engineering(brandId)` — găsește o categorie ⭐ Vedete sau 🧩 Ghicitori cu marjă mare (băuturi, deserturi, garnituri).
2. `preview_offer_margin` pe acea categorie — confirmă că un add-on de tip „băutură la X lei" rămâne pe plus.
3. `create_offer(type:'buy_x_get_y'` sau `'fixed', appliesToType:'category')` pentru add-on/upgrade pe POS.
4. Online: `set_product_bundle(primaryProductId, bundleItemIds, discountValue)` ca să apară „Cumpărate frecvent împreună" pe pagina produsului principal.

### 4. Bundle + creștere nota online (AOV) `[marketing]`
1. `get_menu_engineering` — alege un produs-ancoră cu marjă mare.
2. `set_product_bundle(brandId, primaryProductId, bundleItemIds, discountType, discountValue)` — pachet sub à-la-carte, peste nota țintă (discount verificat la marjă).
3. `create_discount_code(code, type:'free_shipping')` SAU `create_discount_code(type:'percentage', value, minOrderAmount)` pentru „cheltuie X, primești Y".
4. Verifică pragul de livrare cu `get_free_shipping_suggestions` (pe furnizor) și setează-l 15–25% peste AOV din aplicație.
5. `get_sales_analytics` înainte/după ca să confirmi creșterea notei.

### 5. Win-back țintit pe loialitate (incrementalitate, NU reducere oarbă) `[marketing]`
1. `evaluate_loyalty_drop_alerts` / `preview_guest_segment` — segment lapsed 30–60 zile.
2. `preview_offer_margin` apoi `create_offer` cu scope LIMITAT (o categorie, NU tot magazinul) SAU `create_discount_code(usageLimit:1)` single-use.
3. Trimite DOAR acelui segment: `push_notify_customers` / `send_email_campaign` (`confirm:true`). Vezi `knowledge/email-marketing.md` și `knowledge/marketing-social.md`.
4. `get_offer_scorecard` ca să dovedești mesele NOI vs regulații subvenționați; ține un holdout necontactat ca să compari corect.

### 6. Pasaj trimestrial de menu engineering (promovează, nu tăia) `[citire]` + `[marketing]`
1. `get_menu_engineering(brandId)` pe ultimele 30–90 zile.
2. 🧩 **Ghicitori** (marjă mare, vânzări mici): repoziționează sus în categorie + rescrie descrierea (`generate_product_description`) — operatorii raportează +20–35% vânzări în prima lună DOAR din repoziționare; NU le scoate.
3. 🐎 **Cai de povară** (vânzări mari, marjă mică): nudge mic de preț + atașează o garnitură cu marjă mare (`set_product_recommendations`), nu le pune pe reducere.
4. ⭐ **Vedete**: protejează, nume cu poveste, NU le da niciodată discount.
5. 🐕 **De reconsiderat**: scoate-le (`set_product_86`) sau reinventează-le; niciodată pe promoție.

## Tool-uri MCP utile

- `list_offer_suggestions(goal)` `[citire]` — „Sym propune": oferte sigure pe marjă din datele tale reale (`fill_slow` / `raise_check` / `promote_margin`). NU creează — doar sugerează.
- `preview_offer_margin(type, value, appliesToType, appliesToIds)` `[citire]` — marja înainte/după, dacă vinzi sub cost și ce volum suplimentar îți trebuie. Rulează-l ÎNTOTDEAUNA înainte. Nu salvează nimic.
- `create_offer(name, type, value, channels, appliesToType, appliesToIds, comboGroups, timeStart, timeEnd, daysOfWeek, startsAt, expiresAt)` `[marketing]` — auto-discount care CHIAR reduce nota la POS. `type`: `percentage` / `fixed` (o dată pe comandă) / `fixed_price_per_unit` (preț pe bucată) / `buy_x_get_y` / `combo`. `timeStart`+`timeEnd`+`daysOfWeek` = Happy Hour; `startsAt`/`expiresAt` = LTO; fără ele rulează 24/7. Verdictul de marjă vine în răspuns ca avertisment — NU blochează.
- `update_offer(id, ...)` `[marketing]` — modifică o ofertă existentă (valoare, scope, componente combo, plafon, activă, fereastră). Verdictul se recalculează pe rezultat, informativ.
- `list_offers` `[citire]` — listează ofertele (de aici iei `offerId` pentru scorecard). Pentru combo întoarce și componentele setului, ca să vezi din ce e făcut.
- `suggest_offer_price_conversions` / `convert_offer_to_unit_price(id, newPrice, confirm)` `[citire]` + `[marketing]` — găsește Voucherele care arată a preț de meniu („Espresso 5,50 lei") și le convertește în preț pe bucată, cu preview înainte. Rulează-l dacă ai simptomul „se pune o singură ofertă la mai multe bucăți". Conversia se face O ofertă pe rând, cu `confirm:true` — niciodată în masă (`fixed` e și forma legitimă a voucherelor).
- `get_offer_scorecard(offerId)` `[citire]` — verdict keep/kill/gathering în lei: venit incremental, mese în plus, discount total, notă medie înainte/după. Sursa de adevăr pentru „a meritat oferta".
- `set_product_bundle(brandId, primaryProductId, bundleItemIds, discountType, discountValue)` `[marketing]` — pachet „Cumpărate frecvent împreună" pe pagina de produs online (un pachet activ per produs principal; re-apelarea îl înlocuiește).
- `create_discount_code(code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, expiresAt)` `[marketing]` — cod pentru magazinul online (`percentage` / `fixed` / `free_shipping`). Bun pentru single-use (`usageLimit:1`) pe win-back.
- `create_website_promotion(name, targetUrl, title, subtitle, ctaLabel, placement, startsAt, endsAt)` `[marketing]` — banner/pop-up VIZUAL pe site. Anunță oferta; NU reduce nota. `placement`: banner / header-strip / footer-strip / side-modal.
- `get_menu_engineering(brandId, menuId)` `[citire]` — cele 4 cadrane (Vedete / Cai de povară / Ghicitori / De reconsiderat) cu marja pe produs; baza deciziei „pe ce împing, pe ce nu".
- `get_free_shipping_suggestions(supplierId, currentTotal)` `[citire]` — cât mai lipsește până la pragul de livrare gratuită.
- `get_sales_analytics` / `raport_vanzari` / `top_produse` `[citire]` — măsoară nota medie și efectul înainte/după.
- `push_notify_customers`, `send_email_campaign`, `marketing_generate_post` `[marketing]` — anunță oferta. Toate trimit/cheltuie real → `confirm:true` + confirmarea explicită a proprietarului.
- `check_marketing_allowed` / `comms_get_status` `[citire]` — verifică permisiunile și consimțământul înainte de orice trimitere în masă.

## Întrebări frecvente și capcane

- **„Dacă fac -20% pierd bani?"** Rulezi `preview_offer_margin(type:'percentage', value:20, scope)` și citești verdictul. Dacă iese pe pierdere, oferta tot se poate publica (din 31 iulie 2026 nu mai e blocată) — dar întreabă-te dacă e intenționat. Alternative: add-on/bundle în loc de procent, sau restrânge scope-ul la o categorie cu marjă mare.
- **„Am bătut 3 cafele și s-a pus o singură reducere."** Oferta e pe tipul **Voucher (sumă fixă)**, care scade o dată pe comandă. Vrei **Meniu de prânz** (preț pe bucată). Rulează `suggest_offer_price_conversions` — îți arată exact ofertele afectate și cât plătește clientul înainte/după conversie.
- **„Combo-ul se aplică o singură dată deși am comandat 5."** Verifică ce ai pe notă: numărul de seturi e dat de componenta cea mai RARĂ. 1 meniu + 5 cafele = un singur set complet. Ca să se acorde de 5 ori îți trebuie 5 meniuri ȘI 5 cafele.
- **„Am salvat combo-ul dar nu reduce nimic."** Îi lipsesc componentele (minimum 2, fiecare cu produse alese), sau același produs apare în două componente. Symbai refuză salvarea cu motivul scris — dacă oferta e mai veche, deschide-o și completează componentele.
- **„Oferta a rămas pe notă după ce am scos produsul."** Nu mai e cazul din 31 iulie 2026 — reducerea dispare automat la ștergere, retur, „din partea casei" și transfer. Dacă vezi comportamentul vechi, instanța ta nu e încă actualizată.
- **Oferta de Happy Hour se aplică toată ziua.** Cauza tipică: ai uitat `timeStart`/`timeEnd`/`daysOfWeek`. Fără ele oferta rulează 24/7. Setează fereastra explicit; verifică pe `list_offers` că s-a salvat.
- **„Am pus banner pe site, dar nu se reduce nota."** Corect — `create_website_promotion` e DOAR vizual. Pentru reducere reală îți trebuie `create_offer` pe canalul potrivit (`website`/`delivery`/`pos`). Folosește-le împreună.
- **Măsori succesul prin câte cupoane s-au folosit.** Greșit. Multe răscumpărări pot fi regulații care oricum veneau (marjă pierdută degeaba). Folosește `get_offer_scorecard` pentru venitul INCREMENTAL și ține un holdout necontactat la win-back.
- **Reducere generalizată „minus la tot".** Îți antrenează clienții să aștepte reduceri și taie marja pe cei care plăteau întreg. Preferă LTO (cu `expiresAt`), add-on/upgrade și oferte țintite pe loialitate.
- **Nu omori LTO la timp.** O ofertă „temporară" lăsată activă devine reducere permanentă și pierde tot efectul de raritate. Setează `expiresAt` de la început — se stinge singură.
- **Pui o 🐕 (De reconsiderat) pe promoție.** Nu merită subvenționată. Mai bine o scoți (`set_product_86`) sau o reinventezi. Promoția se pune pe 🧩 Ghicitori (marjă mare, doar nevăzute).
- **Confirmare sărită.** Orice publicare de ofertă pe POS schimbă ce plătesc clienții reali, iar orice anunț (push/email) e trimitere reală. Spune clar numele ofertei, scope-ul, fereastra orară/de date, canalele și impactul pe marjă ÎNAINTE de a publica.
- **Bundle prea ieftin.** Pachetul trebuie sub à-la-carte DAR peste nota ta țintă. Dacă `set_product_bundle` cu discount mare îți coboară pachetul sub costuri, micșorează `discountValue` — verifică marja componentelor în `get_menu_engineering`.

## Vezi și

- `knowledge/email-marketing.md` — anunțarea ofertelor pe email, segmente, predictive sending.
- `knowledge/marketing-social.md` — postări organice și reclame pentru a împinge oferta.
- `knowledge/loialitate-fidelizare.md` — oferte legate de loialitate, win-back, puncte.
- `knowledge/rapoarte-glosar.md` — food cost, marjă, notă medie.
- skill-ul `adauga-produs-reteta` — crearea produsului LTO/bundle în meniu.
- skill-ul `programeaza-postare` — anunțarea ofertei pe social media.
