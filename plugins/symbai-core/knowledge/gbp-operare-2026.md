# Google Business Profile — operare 2026 (pârghia #1 local + AI local)

> Pentru linkul exact catre orice pagina foloseste tool-ul `gaseste_in_aplicatie` — el e sursa autoritara de navigare. Vezi si skill-ul `raspunde-recenzii`.

## Pe scurt

Profilul de Google (Google Business Profile / fisa de pe Google Maps) este in 2026 cel mai puternic canal local cu cost zero: in local-pack cantareste ~32% din tot, mai mult decat orice alt semnal. Tot el alimenteaza si vizibilitatea in AI local (ChatGPT, Perplexity, Google AI), dar nu direct: AI-ul citeste din recenzii, din postari, de pe site si din Bing Places. Regula de aur: tine fisa ACTIVA saptamanal — categorie principala exacta, minim 1 poza reala/saptamana, 1-2 postari/saptamana, 3-5 recenzii noi/luna cu raspuns la toate. Q&A-ul a murit din 3 noiembrie 2025; nu mai pierde timp cu el.

## Concepte

- **Categoria principala = cel mai important semnal individual.** Cea mai specifica si mai exacta categorie (ex. „Pizzerie" in loc de „Restaurant", „Cafenea de specialitate" in loc de „Cafenea") bate orice alta optimizare. Se schimba din `gbp_update_location` si se reflecta in cateva ZILE (cel mai rapid efect din tot GBP-ul).
- **Ponderi local-pack 2026:** GBP ~32% / recenzii 16-20% / on-page 15-19% / linkuri 8-15% / comportament (CTR, dwell) 8-9% / citari NAP 6-7%. La restaurante proximitatea urca spre ~30%, recenziile ~14%.
- **Cadenta care e rasplatita in 2026:** ≥1 poza reala noua/saptamana (30+ zile fara poze = scadere masurabila de vizibilitate), 1-2 postari/saptamana, atribute complete, meniu din poza. 2026 a adaugat un tilt pe popularitate: CTR, timpul petrecut pe fisa si engagementul pe recenzii cantaresc acum.
- **Velocitate recenzii:** tinta 8-15 recenzii noi/luna/locatie (3-5/luna e minimul de mentinere), cu rata de raspuns ≥80%. Un flux constant de recenzii proaspete bate un concurent cu mai multe recenzii totale dar fara activitate recenta; un val proaspat misca pachetul in 2-3 saptamani.
- **Q&A este MORT (3 nov. 2025).** Google a oprit functia de intrebari-raspunsuri de pe fisa si o inlocuieste cu raspunsuri generate de AI din recenzii, postari si site. NU mai instrui niciodata clientul sa puna intrebari/raspunsuri pe fisa — e timp pierdut.
- **AI-ul local NU citeste direct GBP.** ChatGPT face o cautare live in Bing si trage datele din **Bing Places** (nu din Google Business), scaneaza primele ~20-30 rezultate si citeaza des presa locala / liste „best of". Apple Maps/Siri = Apple Business. Prioritate pentru un brand RO: GBP → Bing Places → Apple Business → Facebook → TripAdvisor/Booking, cu NAP (nume-adresa-telefon) identic la litera peste tot.
- **Termene reale:** majoritatea editarilor GBP se vad in 1-4 saptamani, schimbarile de categorie in zile, castigurile din velocitatea recenziilor in 2-3 luni. AEO (vizibilitate in AI) — progres masurabil in 3-6 luni.
- **Scor si rang:** `gbp_maps_score` da un scor de sanatate al fisei; `gbp_run_rank_scan` + `gbp_rank_summary` masoara rangul real pe harta (Share of Local Voice) pe cuvinte-cheie geo. Nu te ghida dupa o singura pozitie — uita-te la zonele slabe de pe grila.
- **UTM pe linkuri:** orice link pus in postari GBP marcheaza-l cu `utm_source=gbp` ca sa vezi in atribuire ce aduce fisa, separat de restul canalelor.

## Fluxuri frecvente

### 1. Diagnoza + urcare in local-pack pentru o locatie
1. `list_brands` + `list_locations` ca sa ai brandId/locationId. `[citire]`
2. `gbp_maps_overview` + `gbp_maps_score` — baseline (ce e complet, ce lipseste, scorul). `[citire]`
3. Verifica si seteaza categoria principala cea mai specifica cu `gbp_update_location`. `[marketing]` — singura interventie cu efect in cateva zile.
4. `gbp_run_rank_scan` pe top 3-5 cuvinte-cheie geo (ex. „pizzerie [cartier]", „mic dejun [oras]"). `[citire]`
5. Citeste SoLV-ul si zonele slabe din `gbp_rank_summary`. `[citire]`
6. Pune in cadenta saptamanala: `gbp_create_post` (cu UTM) + cere proprietarului ≥1 poza reala/saptamana.
7. Bucla recenzii (fluxul 3 de mai jos).
8. Re-scaneaza in ~3 saptamani (`gbp_run_rank_scan`) ca sa confirmi miscarea pachetului. **Verifica rezultatul real, nu presupune.**

### 2. Postare saptamanala pe fisa (oferta / preparat nou)
1. `read_brand_memories` pentru voce + `marketing_location_weather` / `marketing_open_tables` pentru context (terasa plina + soare = postezi acum). `[citire]`
2. `get_menu_engineering` sau `top_produse` ca sa alegi un preparat real care merita scos in fata. `[citire]`
3. `gbp_create_post` cu un mesaj scurt, o poza reala si — daca pui link — `utm_source=gbp`. `[marketing]`
4. Cross-posteaza acelasi mesaj si pe social cu `schedule_social_post` ca sa nu fie efort dublu.
5. Tinta: 1-2 postari/saptamana, constant. Postarile alimenteaza si raspunsurile AI, nu doar fisa.

### 3. Bucla de recenzii (velocitate + 100% raspuns)
1. `gbp_reviews_summary` — recenzii noi, rating, teme de sentiment. `[citire]`
2. `gbp_reply_review` la TOATE recenziile, scriind pentru client (ton uman, nu cuvinte-cheie); tinta rata de raspuns ≥80%. `[marketing]`
3. Trimite invitatii de recenzie dupa fiecare comanda cu `dispatch_review_invitations_for_order` ca sa atingi 8-15 recenzii noi/luna. Niciodata catre site propriu, niciodata recompensat.
4. Pentru recenzii din alte surse (Trustpilot, Booking, TripAdvisor) foloseste `sync_retail_reviews` + `get_retail_reviews_summary` + `reply_to_retail_review`. **Onest:** pe unele platforme `reply_to_retail_review` salveaza raspunsul doar local in Symbai — da clientului linkul platformei sa-l posteze acolo si nu pretinde „am raspuns pe Trustpilot" daca nu s-a publicat.

### 4. Sa fii recomandat de ChatGPT / AI local (GEO)
1. `get_brand_entity_kit` — NAP canonic + identitate + lipsuri. `[citire]`
2. Repara lipsurile la sursa: `update_company` / `update_location` / `update_brand`. `[marketing]`/`[setari]`
3. Revendica si optimizeaza GBP + **Bing Places** (sursa ChatGPT) + Apple Business — manual, prin extensia Chrome — cu NAP identic la litera. (Bing/Apple se fac **din aplicatie/din browser**, nu exista tool MCP dedicat.)
4. Tine recenziile si postarile bogate (AI-ul raspunde din ele) si pune informatii reale pre-vizita pe site ca FAQ.
5. Lunar: ruleaza un panel fix de 15-20 intrebari-client prin ChatGPT/Perplexity/Gemini (din Chrome) + cauti tu pe web (cu surse) cum apar concurentii; noteaza cota de citare si share-of-voice fata de concurentii locali numiti.

## Tool-uri MCP utile

- `gbp_maps_overview` `[citire]` — starea completa a fisei: ce e completat, ce lipseste, atribute.
- `gbp_maps_score` `[citire]` — scor de sanatate al profilului (cat de „complet/activ" e).
- `gbp_run_rank_scan` `[citire]` — scaneaza rangul real pe harta pe cuvinte-cheie geo (grila de pozitii). Param: cuvinte-cheie, locationId.
- `gbp_rank_summary` `[citire]` — rezuma scanarea: SoLV (Share of Local Voice) + zonele slabe de pe grila.
- `gbp_update_location` `[marketing]` — seteaza categoria principala (cel mai important!), atribute, descriere, informatii fisa.
- `gbp_create_post` `[marketing]` — publica o postare pe fisa (oferta, eveniment, noutate). Pune `utm_source=gbp` pe orice link.
- `gbp_reviews_summary` `[citire]` — recenzii noi de pe Google, rating, teme de sentiment.
- `gbp_reply_review` `[marketing]` — raspunde la o recenzie Google (tinta 100%).
- `dispatch_review_invitations_for_order` `[marketing]` — trimite invitatii de recenzie dupa o comanda (creste velocitatea).
- `sync_retail_reviews` / `get_retail_reviews_summary` / `reply_to_retail_review` — recenzii de pe alte platforme (vezi capcana de mai jos).
- `get_brand_entity_kit` `[citire]` — kit de identitate/NAP canonic pentru consistenta cross-platforma (GEO).
- `update_company` / `update_location` / `update_brand` — corectarea NAP la sursa, ca sa fie identic pe toate platformele.
- `get_attribution_report` / `get_attribution_ltv_by_channel` `[citire]` — vezi ce aduce fisa (filtrat pe `utm_source=gbp`).
- `marketing_location_weather` / `marketing_open_tables` / `read_brand_memories` `[citire]` — context si voce pentru postari.

## Intrebari frecvente si capcane

- **Care e cea mai rapida imbunatatire?** Categoria principala cea mai specifica, prin `gbp_update_location` — se vede in zile. E semnalul #1.
- **Cat de des postez si pun poze?** Minim 1 poza reala/saptamana si 1-2 postari/saptamana. 30+ zile fara poze noi = scadere masurabila de vizibilitate.
- **Sa pun intrebari si raspunsuri pe fisa (Q&A)?** NU. Functia a fost oprita pe 3 nov. 2025 si e in eliminare; AI-ul genereaza raspunsuri din recenzii, postari si site. E timp pierdut — concentreaza-te pe recenzii bogate + postari + FAQ pe site.
- **De ce nu apar in ChatGPT desi am GBP complet?** Pentru ca ChatGPT citeste din **Bing Places**, nu din Google Business. Trebuie revendicat si Bing Places (si Apple Business), cu NAP identic la litera. Doar GBP nu e suficient pentru AI local.
- **Cate recenzii imi trebuie?** 8-15 noi/luna cu raspuns la toate (≥80%). Un flux proaspat constant bate un concurent cu mai multe recenzii totale dar inactiv; valul nou misca pachetul in 2-3 saptamani.
- **Pot pune nota cu stele (rating) in datele structurate ale propriei firme?** NU pe pagina firmei/restaurantului — Google o ignora si risti penalizare. Stelele vin doar din recenzii reale Google. Exceptie: pagini de produs cu recenzii reale de la clienti.
- **Am raspuns „pe Trustpilot"?** Verifica: `reply_to_retail_review` poate salva raspunsul doar local in Symbai pentru unele platforme. Da clientului linkul platformei si nu declara fals ca s-a publicat acolo. **Verifica rezultatul real inainte de a spune „gata".**
- **Cum stiu daca fisa aduce clienti?** Marcheaza linkurile din postari cu `utm_source=gbp` si citeste `get_attribution_report`. Re-scaneaza rangul cu `gbp_run_rank_scan` la 3 saptamani — nu presupune ca o editare a si urcat pozitia.
- **Cat dureaza pana se vede?** Editari fisa 1-4 saptamani, categorie in zile, velocitate recenzii 2-3 luni, vizibilitate AI 3-6 luni. Nu schimba tot deodata si nu astepta efect peste noapte.

## Vezi si

- `marketing-social.md` — postari organice, GBP ca parte din mixul saptamanal.
- `email-marketing.md` — invitatii de recenzie si win-back pe email.
- `skills/raspunde-recenzii/SKILL.md` — workflow operational pentru recenzii Google/Facebook/Trustpilot/Booking.
- `skills/programeaza-postare/SKILL.md` — programarea postarilor pe social + GBP.
