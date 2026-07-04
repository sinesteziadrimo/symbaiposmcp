# Poziționare de brand

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Poziționarea e decizia care stă DEASUPRA întregului marketing: cine ești tu pentru clientul tău, prin ce te alegi față de concurență și de ce să te creadă. Când e scrisă corect în Symbai (câmpurile de brand + memoriile de brand), TOATE celelalte module — postări social, reclame, email, conținut, recenzii, oferte — generează automat „pe vocea ta", consecvent, fără să mai rescrii de fiecare dată. Treaba lui Claude Code aici nu e să inventeze un slogan frumos, ci să DEDUCĂ poziționarea din datele reale ale localului (cine cheltuie, ce se vinde, ce canal aduce clienți buni) și apoi să o scrie o singură dată, ca temelie.

Regula de aur: nu scrii poziționarea din intuiție. O scoți din cifre (RFM + top produse + atribuire), o validezi cu proprietarul în cuvinte simple, apoi o salvezi în brand + memorii.

## Concepte

- **Declarația de poziționare** — o singură frază-șablon care prinde totul: *„Pentru [segmentul de bază], [brandul] e [categoria] care [diferențiatorul], pentru că [dovada]."* Exemplu: *„Pentru familiile din cartier care vor o cină caldă fără bătaie de cap, Bistro Lună e bistroul de cartier care servește mâncare gătită în casă în sub 15 minute, pentru că avem bucătărie proprie și 4.7 stele pe Google din 600+ recenzii."* Dacă nu poți completa toate cele 4 paranteze cu ceva ADEVĂRAT și SPECIFIC, poziționarea nu e gata.
- **Segmentul de bază (cui te adresezi cu adevărat)** — NU „toată lumea". E grupul care îți aduce cei mai mulți bani și revine cel mai des. Îl afli din date, nu din presupuneri: din RFM (`recompute_loyalty_rfm`) iei segmentele Champions + Loyal (clienții care cheltuie + revin), din `top_produse` vezi ce mănâncă/cumpără ei, din `get_attribution_ltv_by_channel` vezi pe ce canal vin clienții de cea mai bună calitate (LTV mare). Țintă sănătoasă: **LTV:CAC ≥ 3:1** pe segmentul de bază; sub 3:1 pierzi marjă, peste 5:1 investești prea puțin în creștere.
- **Propunerea de valoare (de ce TU)** — beneficiul concret pe care clientul îl primește, exprimat din perspectiva LUI, nu o listă de funcții. „Mâncare caldă în 15 minute" e valoare; „avem 3 cuptoare" nu. Diferențiatorul trebuie să fie ceva ce concurența nu poate spune la fel de credibil.
- **Vocea și tonul** — cum sună brandul în scris, peste tot. Vocea e constantă (ex: cald, direct, fără fițe); tonul se adaptează contextului (jucăuș la o postare de weekend, sobru și empatic la un răspuns de recenzie negativă). Definește 3-4 atribute de voce + 2-3 cuvinte „interzise" și 2-3 cuvinte „semnătură".
- **Diferențierea față de competiție** — 2-3 concurenți reali numiți + ce te face diferit de FIECARE. Fără asta, AI-ul scrie generic („cea mai bună mâncare din oraș") — exact ce spune și concurentul.
- **Dovada (de ce să te creadă)** — cifre și fapte care susțin promisiunea: rating + număr de recenzii, ani de experiență, un preparat-vedetă cu poveste, ingredient/furnizor local, premiu, viteză de servire. Fără dovadă, poziționarea e doar lăudăroșenie.
- **Câmpurile de brand vs memoriile de brand** — câmpurile (nume, slogan, identitate, ton) se setează cu `update_brand` și sunt „cartea de identitate". Memoriile de brand (`read_brand_memories`) sunt notițele de context (Voce / Public / Stil / Concurenți / Dovezi) pe care fiecare modul de marketing le citește înainte să genereze. Le scrii pe AMBELE — câmpurile pentru identitate, memoriile pentru consecvență la generare.

## Fluxuri frecvente

### 1. Construiește poziționarea de la zero (temelia)
Deduci poziționarea din date reale, nu din intuiție, apoi o salvezi o singură dată.
1. `list_brands` → afli `brandId`. `read_brand_memories` → vezi ce există deja (poate e o ciornă veche de corectat).
2. `recompute_loyalty_rfm` → identifici segmentele Champions + Loyal = nucleul real de clienți (cine cheltuie + revine). `raport_vanzari` → confirmi bonul mediu și frecvența.
3. `top_produse` → vezi ce comandă/cumpără efectiv segmentul de bază (preparatele-vedetă reale = candidați de „dovadă" și de diferențiator).
4. `get_attribution_ltv_by_channel` → vezi pe ce canal vin clienții cu LTV mare (te spune cui te adresezi și unde, nu doar ce să spui).
5. Cu cifrele pe masă, scrii DRAFT-ul: declarația de poziționare (cele 4 paranteze, toate completate cu adevăruri), propunerea de valoare, 3-4 atribute de voce, 2-3 concurenți + diferențiator pe fiecare, lista de dovezi.
6. **Confirmare cu proprietarul în limbaj simplu** — îi citești fraza de poziționare și îl întrebi „te regăsești în asta? cine sunt de fapt clienții tăi cei mai buni?". Ajustezi după răspuns. NU salvezi nimic înainte de confirmare.
7. La aprobare: `update_brand` (slogan/tagline + ton de voce + identitate) **și** scrii memoriile de brand (Voce / Public / Stil / Concurenți / Dovezi) prin `update_brand` pe câmpul de memorii, ca fiecare modul să genereze pe-brand de aici încolo.
8. Verifici prin citire: `read_brand_memories` → confirmi că s-a salvat exact ce ai intenționat.

### 2. Scrie memoriile de brand ca social / reclame / email să genereze pe-brand
Memoria de brand e „briefingul" pe care îl citesc toate tool-urile de conținut. Scrie-o structurat:
- **Voce**: 3-4 atribute (ex: cald, direct, fără jargon, cu umor fin) + 2-3 cuvinte-semnătură + 2-3 cuvinte interzise.
- **Public**: segmentul de bază în 1-2 fraze (din RFM + atribuire), cu ce-i pasă lui.
- **Stil**: emoji da/nu și câți, lungime preferată, prețuri în lei, formule de adresare (tu/dumneavoastră).
- **Concurenți**: 2-3 nume + diferențiatorul față de fiecare.
- **Dovezi**: rating + nr. recenzii, preparat-vedetă, furnizor/ingredient local, ani, viteză — faptele pe care conținutul are voie să se sprijine.
Apoi testează coerența: cere `marketing_generate_post` pentru o postare-mostră (ori `generate_content_brief` pentru un articol) și vezi dacă „sună a brand". Dacă sună generic, memoria e prea vagă — adaugă specific (un preparat anume, o frază tipică). Module care citesc memoria: `marketing_generate_post`, `bulk_schedule_social_posts`, `create_email_campaign`, reclamele, `generate_content_brief`, `gbp_create_post`, `reply_to_retail_review`.

### 3. Derivă segmentul de bază din date (cui te adresezi cu adevărat)
Când proprietarul zice „clienții mei sunt toți" — datele spun altceva.
1. `recompute_loyalty_rfm` → ia Champions + Loyal (de obicei 20-30% din clienți aduc majoritatea banilor). `preview_guest_segment` → mărimea reală a segmentului.
2. `top_produse` (filtrat pe perioada relevantă) → ce cumpără ei = limbajul și ofertele care îi prind.
3. `get_attribution_ltv_by_channel` + `get_attribution_report` → ce canal aduce LTV-ul cel mai mare = unde stă publicul de bază (te ajută la unde difuzezi, nu doar ce spui).
4. Formulezi segmentul în 1-2 fraze concrete (vârstă/context/ocazie + ce-i pasă) și îl pui în memoria de brand la „Public". De aici, reclamele țintesc CRM-seeded lookalike pe top-LTV, nu „toți clienții".

### 4. Diferențierea față de competiție
1. `read_brand_memories` → vezi dacă există deja concurenți notați. Întrebi proprietarul cu cine se compară clienții (cei 2-3 concurenți REALI).
2. Pentru fiecare concurent, scrii o frază de diferențiere care e ADEVĂRATĂ și pe care concurentul NU o poate spune la fel de credibil (viteză, ingredient local, preț, nișă, experiență).
3. Verifici dovada: ai cifre care susțin diferențiatorul? (rating din `get_retail_reviews_summary`/`gbp_reviews_summary`, preparat-vedetă din `top_produse`). Dacă nu, e doar o părere — întărește-o sau renunță la ea.
4. Salvezi în memoria de brand la „Concurenți". Reclamele și postările vor folosi unghiuri diferențiate, nu generice.

### 5. Poziționarea ca temelie pentru planul de marketing
Poziționarea bine scrisă alimentează direct planul trimestrial.
1. Întâi rulează fluxul 1 (poziționarea salvată în brand + memorii).
2. Apoi planul: `read_brand_memories` + `get_attribution_ltv_by_channel` + `get_attribution_report` + `recompute_loyalty_rfm` + `raport_vanzari` + `get_menu_engineering` + `get_seasonal_calendar` → `generate_quarterly_marketing_plan`. Planul moștenește vocea, publicul și diferențiatorul din memorii, deci ofertele/postările/reclamele propuse vin deja pe-brand. (Detaliu complet în `knowledge/strategie-marketing-plan.md`.)

## Tool-uri MCP utile

- `read_brand_memories` [citire] — citește notițele de brand existente (voce/public/stil/concurenți). Mereu PRIMUL pas: vezi ce e deja, nu rescrii peste.
- `update_brand` [marketing] — scrie identitatea (nume/slogan/ton de voce) ȘI memoriile de brand. E tool-ul cu care salvezi poziționarea. Params uzuali: `brandId`, câmpuri de identitate (slogan/tagline, ton), câmp de memorii (Voce/Public/Stil/Concurenți/Dovezi).
- `recompute_loyalty_rfm` [marketing] — recalculează segmentele RFM (Champions, Loyal, At-Risk etc.); de aici scoți segmentul de bază real. Params: `brandId`. Rulează lunar ca segmentele să fie proaspete.
- `top_produse` [citire] — ce se vinde efectiv; sursă pentru diferențiator + dovadă (preparat-vedetă). Params: `brandId`/`locationId`, perioadă.
- `get_attribution_ltv_by_channel` [citire] — LTV pe canal: îți spune ce canal aduce clienții de cea mai bună calitate (= unde stă publicul de bază). Folosit împreună cu `get_attribution_report` pentru imaginea completă.
- `raport_vanzari` [citire] — bon mediu + frecvență, ca să formulezi segmentul și să verifici dacă diferențiatorul e plauzibil comercial.
- `preview_guest_segment` [citire] — mărimea reală a segmentului de bază înainte să-l declari publicul-țintă.
- `get_retail_reviews_summary` / `gbp_reviews_summary` [citire] — rating + nr. recenzii = cea mai puternică „dovadă" pentru poziționare.
- `marketing_generate_post` [marketing] — test de coerență: generează o postare-mostră ca să verifici dacă memoriile fac conținutul „să sune a brand".

> Notă permisiuni: tool-urile [marketing] (`update_brand`, `recompute_loyalty_rfm`) cer modulul Marketing activ pe conexiune. Verifică din timp cu `check_marketing_allowed`. Salvarea poziționării NU trimite nimic clienților, deci nu cere `confirm:true` ca o campanie — dar confirmă MEREU cu proprietarul în cuvinte înainte de a scrie peste o identitate existentă.

## Întrebări frecvente și capcane

- **„Fă-mi un slogan."** Sloganul vine ULTIMUL, după ce ai segmentul + diferențiatorul + dovada. Un slogan scris înainte de poziționare e doar o vorbă goală. Rulează întâi fluxul 1, apoi sloganul se scrie singur din declarația de poziționare.
- **„Clienții mei sunt toți / toată lumea."** Nu există. Datele (RFM + atribuire) arată mereu un nucleu de 20-30% care aduce majoritatea banilor. Poziționează-te pe EI; restul vin oricum. „Pentru toți" = pentru nimeni.
- **Diferențiator generic** („cea mai bună mâncare", „servicii de calitate"). Concurentul spune exact la fel. Un diferențiator bun trece testul: poate concurentul să spună asta la fel de credibil? Dacă da, nu e diferențiator. Sprijină-l pe o dovadă cu cifre.
- **Poziționare scrisă din intuiție, fără date.** E cea mai frecventă greșeală. Întotdeauna `recompute_loyalty_rfm` + `top_produse` + `get_attribution_ltv_by_channel` ÎNAINTE de a formula. Intuiția proprietarului confirmă sau corectează datele, nu le înlocuiește.
- **Memorie de brand prea vagă** → conținut generic. Dacă `marketing_generate_post` scoate ceva care s-ar potrivi oricărui restaurant, memoria e prea slabă. Adaugă specific: un preparat anume, o frază tipică a casei, un cuvânt-semnătură, numele concurenților.
- **Suprascrii o identitate existentă fără să întrebi.** `read_brand_memories` întâi; dacă există deja o poziționare, confirmă cu proprietarul înainte să o schimbi cu `update_brand`. Nu ștergi munca anterioară din reflex.
- **Poziționare „o dată și gata".** Revizuieșt-o când se schimbă realitatea: meniu nou, public nou, concurent nou, sezon. Recitește RFM lunar; reîmprospătează diferențiatorul când apar dovezi noi (rating mai bun, preparat nou de succes).
- **Confunzi vocea cu tonul.** Vocea e constantă peste tot (cine ești); tonul se adaptează (jucăuș la promoții, sobru și empatic la recenzii negative). Scrie ambele în memoria de brand, separat.

## Vezi și

- `knowledge/strategie-marketing-plan.md` — planul trimestrial care moștenește poziționarea (OKR, buget 70/20/10, calendar sezonier).
- `knowledge/marketing-social.md` — postări și reclame care citesc memoriile de brand.
- `knowledge/email-marketing.md` — campanii și fluxuri pe vocea brandului.
- `knowledge/segmentare-clienti.md` — RFM, taguri, segmente — sursa segmentului de bază.
- `knowledge/seo-aeo.md` — Profilul Google + Bing Places, entitate de brand consecventă (NAP identic peste tot).
- skill-ul `gestioneaza-crm` și skill-ul `construieste-prezentare` — folosesc poziționarea ca temelie pentru pipeline și pitch.
