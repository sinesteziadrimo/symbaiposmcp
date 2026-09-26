# Conținut care vinde: postări, carusele și video

## Pe scurt
Un material de marketing reușit face omul potrivit să se recunoască în primele secunde, îl ține cu o problemă descrisă concret, îi arată ce pierde și ce câștigă și îi cere un singur pas. Metoda se aplică oricărui domeniu (restaurant, hotel, fabrică, magazin, servicii, software). Faptele brandului (vocea, publicul, poveștile, oferta) stau în **dosarul de voce** din memoriile brandului, nu în text inventat pe loc.

## Concepte
- **Brieful**: subiect, platformă, obiectiv (încălzire, educație, încredere, cerere), format, public, un singur CTA. Fără brief complet alegi varianta prudentă și spui ce ai presupus.
- **Dosarul de voce** (memorii de brand, citite cu `read_brand_memories` / `list_brand_memories`, scrise cu `upsert_brand_memory`):
  - *Vocea autorului* (`brand_voice`): cum vorbește, expresii proprii, ce nu spune niciodată, 2–3 texte aprobate ca exemplu.
  - *Avatarul de marketing* (`target_audience`): cine cumpără, rol, tipul și mărimea afacerii, obiective, obiecții, unde își petrece timpul online.
  - *Avatarul psihologic* (`target_audience`): temeri, frustrări, dorințe, convingeri despre problemă, motivele pentru care amână.
  - *Interviul autorului și motivația poveștii* (`custom`): întâmplări reale, de ce există afacerea, greșeli și lecții. Singura sursă permisă pentru povești.
  - *Fișa produsului/ofertei* (`content_preferences` sau `custom`): ce se vinde, pentru cine, dovezi, ce NU promitem, preț public sau „ofertă personalizată”, pagina de destinație.
- **Faze de audiență**: rece → încălzită (a văzut, a interacționat) → cerere (lead) → client. Nu ceri lead unui public rece.

## Structura unui material
Înainte de structură stabilești nivelul de awareness al publicului (unaware, problem aware, solution aware, product aware) și obiectivul; CTA-ul și tipul de cârlig decurg din ele (vezi `postari-organice-awareness.md`).
1. **Cârligul** (primul rând / primele 1–3 secunde): situația sau întrebarea pe care publicul și-o spune singur. Fără clickbait.
2. **Problema cu timp**: 2–3 situații concrete, ca omul să se recunoască. Nu grăbi partea asta.
3. **Impactul**: ce pierde (timp, bani, liniște, control, risc). Poate reveni pe parcurs, doar cu formulări demonstrabile.
4. **Emoția intenționată**: la problemă tensiune, frustrare, copleșeală; la soluție curiozitate, ușurare, speranță, dorință. Fără frică exagerată și fără să dai vina pe client sau pe angajații lui.
5. **Soluția prin beneficii** pentru fiecare rol (utilizator, manager, proprietar, afacere), nu listă de funcții.
6. **Dovada**: demonstrație reală, date verificate, client cu acord scris. Datele demo se numesc exemple.
7. **Un singur CTA**, potrivit fazei.

## Video
- Scenariu pe cadre: ce se vede, ce se spune, textul de pe ecran.
- Ecranele complexe stau mai mult; zoom și evidențiere pe zona despre care vorbești.
- Subtitrări arse (majoritatea pornesc fără sunet). Vertical 9:16 pentru Reels/TikTok/Shorts; 4:5 sau 1:1 pentru feed.
- La demo-uri de aplicație: nu arăta date nerealiste (profit exagerat, stoc negativ, „NaN”) și nu cita cifre din demo ca rezultat.
- Inspectează cadrele finale înainte de a propune materialul.

## Adaptare pe platformă
| Platformă | Ce funcționează |
|---|---|
| TikTok, Reels, Shorts | cârlig vizual, 20–60 s, limbaj vorbit, un singur mesaj |
| Facebook | context mai lung, întrebare care deschide comentarii |
| Instagram carusel | o idee pe slide, ultimul slide merită salvat |
| LinkedIn | perspectivă profesională, lecție sau cifră verificată |
Nu publica același text neadaptat pe toate canalele în aceeași zi.

## Fluxuri frecvente
### 1. Pregătește dosarul de voce (o singură dată, apoi revizuit)
`list_brand_memories(brandId)` → identifică ce lipsește din cele cinci piese → propune utilizatorului întrebările exacte (sau un interviu scurt cu autorul) → `upsert_brand_memory` pe categorii. Nu completa temeri sau povești din imaginație; poți propune ipoteze marcate „de confirmat”.

### 2. Încălzirea audienței (primele 3–4 săptămâni pe un canal nou)
- Mix de pornire: recunoașterea problemei ~40%, educație utilă ~25%, problema rezolvată în produs ~20%, oamenii și povestea ~15%. Proporțiile se ajustează după rezultatele proprii.
- CTA-uri moi: urmărește, salvează, comentează, „scrie CUVÂNT în mesaj”.
- Construiește audiențe de vizionare/interacțiune (vezi `gestioneaza-reclame`), apoi adresează oferta sau demonstrația numai publicului încălzit.
- Calendarul pe 2 săptămâni: `bulk_schedule_social_posts` (toate intră în așteptarea aprobării).

### 3. Un material nou
Brief → citește dosarul → 2 variante de cârlig → textul/scenariul după structura de mai sus → adaptare pe platformă → UTM (`create_marketing_tracking_link` sau `configure_social_post_tracking`) → ciornă cu `schedule_social_post` → autoverificare → aprobare de la om.

### 4. Învață din rezultate
`get_social_top_posts` și `get_social_post_performance` săptămânal: ce cârlige țin, ce subiecte se salvează și se distribuie. Notează lecția în dosar (`campaign_history`), nu ca regulă universală.

## Autoverificare înainte de livrare
- Se recunoaște publicul în primele secunde?
- O singură idee, un singur CTA?
- Fiecare afirmație are sursă? Nicio cifră de economie, preț, număr de clienți sau testimonial neaprobat?
- Sună ca autorul (compară cu exemplele aprobate)?
- Formatul și lungimea se potrivesc platformei?

## Întrebări frecvente și capcane
- „Scrie-mi 10 postări” fără dosar de voce → livrezi ciorne marcate provizoriu + întrebările pentru dosar; nu inventezi povești.
- Emoția nu înseamnă dramă: descrie situația reală, nu catastrofe.
- Un reel reușit nu dovedește cerere: urmărește și cererile valide din CRM, nu doar vizualizările.

## Vezi și
`postari-organice-awareness.md` (awareness, cârlige, dosar, autenticitate — metoda completă) · `video-vanzari-sistem.md` (bibliotecă video pe etapele cumpărării) · `strategie-continut-social.md` (calendar, community management) · `pozitionare-brand.md` (promisiune, diferențiere) · `marketing-impact.md` (UTM, rezultate) · `reclame-playbook-2026.md` (audiențe și retargeting) · skill-urile `scrie-continut-marketing`, `programeaza-postare`, `materiale-grafice`, `condu-marketingul`.
