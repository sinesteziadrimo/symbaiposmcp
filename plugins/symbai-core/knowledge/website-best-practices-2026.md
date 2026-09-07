# Website ecommerce 2026 — decizii de design care pot fi verificate

Actualizat la 6 septembrie 2026. Folosește cercetarea ca bază pentru ipoteze de design și verifică efectul pe magazinul concret. Nu transforma procente dintr-un studiu de utilizabilitate în promisiuni de venit pentru client. Pentru componente și configurare: [website-builder.md](website-builder.md); pentru măsurare, consimțământ și CRM: [website-marketing-crm.md](website-marketing-crm.md).

## Cum lucrezi

1. Identifică ce vinde magazinul, cui, dimensiunea catalogului, principalele căutări și barierele reale: livrare, stoc, alegerea variantei, încredere sau plată. Notează ce știi și ce rămâne ipoteză.
2. Dacă reproduci un website, inspectează paginile și interacțiunile pe desktop și mobil. Taxonomia produselor se verifică din categorii și breadcrumb; un grup vizual din meniu nu este automat categorie în catalog.
3. După modificare, verifică în browser: găsire produs, selecție variantă, coș, checkout, erori și revenire. Screenshotul demonstrează aspectul; nu demonstrează că plata sau formularul funcționează.
4. Explică problema rezolvată și criteriul de verificare. Măsoară un rezultat comercial principal și efectele adverse, în aceeași perioadă și cu costuri comparabile.

## Navigare potrivită catalogului

Un magazin mare poate avea nevoie de un rând distinct de categorii și de căutare vizibilă. Un catalog mic sau un brand editorial poate funcționa mai bine cu un header simplu. Nu impune tuturor două rânduri, un număr fix de categorii sau un megamenu.

- Arată categoria activă și o cale clară spre categoria părinte. Folosește etichete cunoscute clienților, nu coduri interne.
- Grupează listele ample prin antete și oferă acces la întreaga categorie. Pe mobil, categoriile comerciale trebuie să fie ușor de găsit, fără a fi ascunse sub mai multe niveluri administrative. Vezi [cercetarea Baymard despre navigarea mobilă](https://baymard.com/blog/main-navigation-product-categories).
- Dacă există meniu la hover, evită deschiderile accidentale și pierderea submeniului pe traseul cursorului. Baymard recomandă investigarea unei întârzieri de 300–500 ms; verifică și clicul, atingerea, focusul și tastatura. [Sursa](https://baymard.com/blog/dropdown-menu-flickering-issue).
- Un header fix este util doar dacă păstrează accesul la acțiuni fără să acopere prea mult conținut sau câmpul cu focus. Testează pe ecrane mici și cu zoom.

## Căutare și categorii

- Afișează sugestii relevante cu fotografie, nume și preț corecte; păstrează termenul când vizitatorul trece din sugestii la rezultatele complete.
- La zero rezultate, păstrează căutarea, explică situația și oferă alternative reale: eliminarea unui filtru, categorie apropiată, sinonim verificat sau contact. Nu pretinde că un produs indisponibil există.
- Alege filtre din atributele utile ale produselor: dimensiune, compatibilitate, material, brand, preț sau disponibilitate. Arată selecțiile și permite eliminarea lor; păstrează-le la paginare și revenire.
- Categoriile părinte pot prezenta subcategorii pentru orientare. Numărul de produse și metoda de încărcare depind de cât de atent trebuie comparate articolele, de dispozitiv și de performanță. „Încarcă mai multe” este o opțiune utilă, nu o interdicție asupra paginării. [Cercetarea Baymard despre liste](https://baymard.com/blog/number-of-items-loaded-by-default).
- Păstrează URL-uri accesibile, revenirea la poziția din listă și accesul la footer. Un 404 trebuie să ofere o cale utilă către căutare sau categorii, păstrând statusul HTTP corect.

## Pagina de produs

Vizitatorul trebuie să poată evalua produsul: fotografii relevante, variante, stoc, preț total, dimensiuni/specificații, livrare și retur. Datele provin din catalog și din politicile reale. Numărul de fotografii se alege după informația necesară, nu după o cotă arbitrară.

Recomandările pot ajuta când sunt compatibile sau alternative reale. Nu inventa „cumpărate împreună”, popularitate, reduceri, recenzii, stoc limitat ori urgență. Separă recomandarea editorială de dovada bazată pe comenzi. Măsoară marja și rata retururilor, nu doar valoarea coșului.

Pentru magazine specializate, categorii precum ocazie, aplicație sau vârstă pot ajuta dacă produsele au atribute validate. La produsele pentru copii, nu deduce limitele de vârstă sau conformitatea din fotografie.

## Coș, checkout și formulare

- Fă vizibilă opțiunea de cumpărare fără cont atunci când este disponibilă; crearea contului nu trebuie să pară obligatorie dacă nu este. [Baymard: guest checkout](https://baymard.com/blog/make-guest-checkout-prominent).
- Marchează clar ce câmpuri sunt obligatorii/opționale, explică cererile neobișnuite de date și păstrează inputul la o eroare recuperabilă. [Baymard: câmpuri de formular](https://baymard.com/blog/required-optional-form-fields).
- Prezintă costul livrării, taxele, intervalul și totalul înainte de confirmare. Pentru un prag de transport gratuit, arată suma rămasă numai când regula se aplică efectiv coșului și adresei; verifică profitabilitatea subvenției.
- Diferențiază „se trimite”, eroare și confirmare. Retrimiterea nu trebuie să dubleze comanda sau leadul. Confirmarea unei cereri nu este confirmarea unei plăți.
- Refuzul trackingului nu blochează formularul sau cumpărarea. Acordul pentru newsletter rămâne separat de tratarea solicitării.

## Viteză, accesibilitate și efecte vizuale

Folosește animațiile pentru orientare, demonstrarea produsului sau feedback. Acțiunea principală trebuie să rămână clară fără animație, cu tastatură și pe mobil. Respectă preferința de mișcare redusă. Încarcă imaginile potrivit dimensiunii afișate și amână resursele din afara zonei vizibile; rezervă spațiul lor pentru a evita salturile de pagină.

Core Web Vitals urmăresc încărcarea, răspunsul la interacțiuni și stabilitatea vizuală. Pragurile „good” sunt LCP ≤2,5 s, INP ≤200 ms și CLS ≤0,1 la percentila 75; sunt repere de experiență, nu promisiuni de creștere a vânzărilor. Un test local nu înlocuiește datele reale ale vizitatorilor. [Metodologia Google](https://web.dev/articles/defining-core-web-vitals-thresholds).

Prefetch, skeleton și actualizarea optimistă sunt alegeri de implementare. Verifică traficul suplimentar, cititoarele de ecran, erorile și starea finală; nu afișa succes comercial înainte de confirmarea serverului.

## Cum explici și măsori

Formulare utilă: „Am făcut vizibil costul livrării înainte de plată, deoarece un total surpriză poate întrerupe cumpărarea. Verificăm finalizarea checkoutului și contribuția după transport, comparativ cu perioada sau varianta de control.”

Pentru fiecare schimbare, notează observația, ipoteza, metrica principală, intervalul și criteriul de decizie. Separă o eroare funcțională demonstrată, care trebuie reparată, de un experiment comercial. Nu aplica automat procente de creștere, praguri ROAS sau împărțiri de buget; vezi [măsurare și atribuire](masurare-marketing-atribuire.md).

Pentru restaurante, scopul poate fi comanda plătită sau rezervarea onorată. Pentru fabrici, publică specificațiile aprobate direct în pagină și oferă PDF opțional; urmărește calificarea cererii și rezultatul comercial, fără a dezvălui informații interne. [Nielsen Norman Group: specificații B2B](https://www.nngroup.com/articles/b2b-specs/).
