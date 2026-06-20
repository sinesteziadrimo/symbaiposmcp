# Best-practice website e-commerce 2026 — aplică-le ȘI explică-le clientului

> Ce face un magazin online să convertească, cu DOVEZI (Baymard Institute 2025 — 16.000+ elemente UX scorate pe 180+ magazine; Nielsen Norman Group; Shopify). Aplică-le când construiești sau îmbunătățești un site. **La FIECARE alegere, spune-i clientului în limbaj de business DE CE ai pus-o și cum îi crește conversia** — folosește cifrele de aici. Pentru tool-urile concrete vezi `website-builder.md` + skill-ul `construieste-website`.

## Cum lucrezi (proces — important)
1. **Când REPLICI un site existent**: deschide-l în browser, **fă screenshot-uri** la header, megamenu, pagină de categorie, pagină de produs, footer. Înțelege STRUCTURA reală (ierarhia categoriilor = din breadcrumb, nu din grupările vizuale ale meniului). Apoi replică prin platformă.
2. **VERIFICĂ VIZUAL ce ai construit**: după ce pui ceva, **deschide pagina și fă screenshot** (sau descrie ce e pe ecran), compară cu sursa/cu ce trebuia, **îmbunătățește**. NU spune „gata" pe baza lui „am rulat tool-ul" — spune „gata" doar după ce ai VĂZUT rezultatul corect. (Vezi și auditul de sănătate al magazinului.)
3. **EXPLICĂ-i clientului** fiecare decizie: „Am pus X pentru că Y — asta înseamnă mai mulți clienți care găsesc produse și cumpără."

## Principiul de aur (cauza #1 a clienților pierduți)
**95% din magazine NU arată clientului UNDE este** (Baymard). Asta produce senzația „mă uit puțin și mă pierd". Antidotul, peste tot: arată mereu unde ești (categorie activă evidențiată + breadcrumb) și oferă mereu un pas înainte (nicio pagină fără „unde merg mai departe").

## 1. Header & navigare principală
- **Bară de categorii DEDICATĂ (rând separat)**, nu logo+categorii+search+iconuri pe un singur rând. *De ce*: rândul înghesuit forțează categoriile să se micșoreze/dispară (58% desktop / 67% mobil au navigare slabă — Baymard). *Explică*: „Categoriile au acum rândul lor, vizibile mereu — clientul vede tot ce vinzi dintr-o privire, nu se mai pierde."
- **Max ~7-9 departamente** în bară (peste ~8 scade scanabilitatea). Linkurile informaționale (Despre/Blog/Contact) → în footer sau un rând utilitar, nu în bara de categorii.
- **Header sticky** (rămâne lipit la scroll). *De ce*: căutarea, coșul și categoriile sunt mereu la un click → fără dead-end. *Conversie*: **+3-7% în medie, până la 25%** când coșul e în bara sticky. *Explică*: „Meniul te urmează pe pagină, deci clientul cumpără fără să mai deruleze înapoi."
- **Evidențiază categoria activă** (unde ești acum). *De ce*: 95% nu o fac → orientare. *Explică*: „Clientul vede mereu în ce secțiune e — nu se mai rătăcește."

## 2. Mega-menu (meniul mare la hover)
- **Grupuri cu ANTET** (sub-categorii grupate sub titluri bold), nu o listă lungă. *De ce*: meniurile fără antete au **+23% abandon** (Baymard); cu antete reduc clickurile spre conținut cu ~50% (NN/g). *Explică*: „Sub-categoriile sunt organizate pe grupuri — clientul găsește mai repede."
- **Hover-intent (mică întârziere + comutare lină)**: nu deschide/închide brusc la fiecare trecere a mouse-ului. *De ce*: 61% din site-uri n-au întârziere → meniul clipește și deschide din greșeală categoria vecină — frustrant. *Explică*: „Meniul nu mai clipește când treci cu mouse-ul — se deschide neted."
- **Anteturile sunt LINKURI clickabile** (du la pagina întregii categorii), nu doar etichete care deschid lista. *De ce*: 33% nu le fac clickabile → blochează clientul care vrea „tot din categoria asta".
- **Cap ~28-36 linkuri pe panou**; grupuri >10 → „Vezi toate →". *De ce*: peste ~36 linkuri clientul renunță și caută; >50 = **+34% bounce**.
- **Imagini în mega-menu** (thumbnail pe coloană) pentru cataloage mari — recunoaștere > memorare.

## 3. Căutarea ca navigare (search-first)
- **Bară de search PROEMINENTĂ** în header (nu doar un iconuriț). *De ce*: la 4000+ produse, mulți clienți preferă să caute decât să răsfoiască. *Explică*: „Cine știe ce vrea, scrie și găsește instant — mai puține clickuri, mai multe vânzări."
- **Autocomplete instant**: sugestii de produse (cu poză + preț), categorii, căutări populare/recente, toleranță la greșeli de scriere.
- **Recovery la „0 rezultate"**: niciodată ecran gol — arată căutări alternative (lărgite), categorii înrudite, produse populare. *De ce*: 50% din site-uri n-au asta → pagini cu abandon mare.

## 4. Mobil
- **Drawer/accordion** pentru arborele de categorii (drill-down progresiv), nu un perete de linkuri. Search + coș lipite (sticky), butoane mari (thumb-zone).
- Bara de categorii desktop se transformă pe mobil în meniu hamburger cu acordeon.

## 5. Findability & ANTI-DEAD-END (nu pierde clientul după ce a intrat)
*Plângerea clasică „mă uit și nu mă duce altundeva" = pagini-terminus. Fiecare pagină trebuie să ofere un pas înainte.*
- **Breadcrumbs** (Acasă › Categorie › Subcategorie › Produs) pe paginile de listă și produs — fiecare e link în sus. *De ce*: indică unde ești + cale înapoi; esențial pe mobil.
- **Pagini de categorie-părinte cu tile-uri de subcategorii** (cu poză) DEASUPRA produselor. *De ce*: 76% nu pun subcategoriile în față → clientul vede un perete de 4000 produse și renunță. *Explică*: „Pe o categorie mare, clientul vede întâi sub-secțiunile cu poze și intră țintit — nu se sperie de listă."
- **Pe pagina de PRODUS, niciodată terminus**: „Produse similare", „Clienții au mai văzut", „Cumpărate împreună", **„Vizualizate recent"**, și un link **„Înapoi la {Categorie}"**. *Conversie*: recomandările aduc lifturi mari de conversie; cross-sell-ul = 10-30% din venit. *Explică*: „După ce vede un produs, clientul are mereu unde merge mai departe — așa crește coșul mediu."
- **Filtre (facete) ca ajutor de navigare**: preț, vârstă, brand, în-stoc, cu nr. de rezultate, filtre aplicate ca etichete ștergibile, **păstrate la paginare** (în URL). *De ce*: doar 16% au filtre eficiente — diferențiator real; filtrele care se resetează = abandon.
- **404 util**: search + categorii top + produse populare + recent văzute, nu un mesaj sec. *De ce*: la mii de produse, linkuri se învechesc — fiecare 404 e o ieșire potențială.

## 6. Magazine specializate (ex. copii) — cârlige curate
- **„Cumpără după vârstă"** (0-1, 1-3, 3-6, 6-9, 9-12) și **„Cumpără după ocazie"** (zi de naștere, botez, Crăciun, back-to-school, nou-născut). *De ce*: părinții cumpără pe vârstă/ocazie, nu pe taxonomia ta de SKU-uri; cataloagele plate îi blochează. *Explică*: „Am adăugat «după vârstă» și «după ocazie» pentru că așa gândește un părinte — îi dăm un prim click sigur în loc să-l lăsăm în fața a 4000 de produse."

## 7. Viteză, încredere & conversie
- **„Load More" + lazy-load** pentru liste mari (NU infinite scroll, NU paginare clasică), păstrând URL-uri reale (?page=N). *De ce*: „Load More" face clientul să vadă MAI multe produse decât paginarea și să le citească mai atent decât infinite scroll (Baymard); infinite scroll strică butonul „înapoi" și comparația.
- **Bară de promisiune livrare** în header + progres „Mai ai X lei până la transport gratuit". *De ce*: costurile de transport = motivul #1 de abandon coș (**39-47%**); **80% adaugă produse** ca să prindă pragul de transport gratuit; suma în lei convertește mai bine ca procentul. *Explică*: „«Mai ai 39 lei până la transport gratuit» — clientul mai adaugă un produs; crește coșul mediu și scade abandonul."
- **Viteză percepută**: prefetch la hover, schelet (skeleton) în loc de spinner, feedback instant la „Adaugă în coș". *De ce*: 1s întârziere pe mobil ≈ **-20% conversie**; 0.1s mai rapid ≈ +8.4%. *Explică*: „Site-ul pare instant — fiecare secundă de așteptare costă vânzări."
- **Badge-uri de ghidare**: „Nou", „Popular", „Recomandat" — scurtături de decizie într-un catalog mare.
- **Personalizare-lite fără cont**: „Vizualizate recent" + „Categorii populare" (din localStorage) — a doua vizită pare ghidată.

## Șablon de explicație pentru client (folosește-l mereu)
> „Am pus **[ce]** pentru că **[de ce / cifra]** — în practică înseamnă **[beneficiu de business: mai mulți clienți care găsesc produse / coș mediu mai mare / mai puțin abandon]**."

Exemple gata:
- „Am pus o bară de categorii dedicată sus pentru că un meniu înghesuit pierde clienții (peste jumătate din magazine au navigare slabă) — acum clientul vede tot ce vinzi și descoperă mai multe produse."
- „Am adăugat «produse similare» și «vizualizate recent» pe pagina de produs pentru că o pagină fără «unde merg mai departe» pierde clientul — așa crește coșul mediu (cross-sell-ul aduce 10-30% din venit)."
- „Am pus «mai ai X lei până la transport gratuit» pentru că 80% din clienți mai adaugă un produs ca să prindă pragul — crește direct valoarea comenzii."
