# Prezentare de Vânzare (Sales Presentation / „Prezentări")

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

> ⚠ **Modul EXCLUSIV din interfața web — NU există tool-uri MCP de prezentări.** Nu se creează, nu se editează și nu se rulează nicio prezentare prin conexiune. Tot ce ține de prezentări se face navigând în aplicație (ideal cu extensia Chrome + user logat). Claude poate să PROIECTEZE conținutul (întrebări, dureri, soluții, obiecții, calcule) și să GHIDEZE/COMPLETEZE în pagină, dar nu prin tool-uri.

## Pe scurt

„Prezentarea" e instrumentul cu care **clientul Symbai își vinde propriul serviciu** unui prospect, slide cu slide, pe ecran (laptop/tabletă), cu un panou de coaching pe telefon vizibil doar vânzătorului. Marele diferențiator față de un PowerPoint: **prezentarea nu e fixă** — slide-urile se recalculează DINAMIC în funcție de răspunsurile prospectului. Practic fiecare prospect primește o prezentare mulată pe profilul și durerile lui, fără ca vânzătorul să țină minte ramificațiile.

Logica de vânzare e **consultativă**: nu „uite ce features am", ci *descoperă* situația prospectului → arată-i *durerile* lui → leagă fiecare durere de o *soluție* demonstrată → *dovedește* cu cazuri reale → *calculează* câștigul cu cifrele LUI → tratează *obiecțiile* → fă *oferta*. Filozofia afișată: **„Nu îți vând software. Îți ascult business-ul."**

Șablonul de referință (gold standard) e **Symbai HoReCa 2026** — pitch-ul propriu Symbai, livrat în aplicație ca template gata populat. Orice client își poate construi unul SIMILAR pentru ce vinde el: o sală de evenimente care vinde nunți, un parc de distracții care vinde petreceri de copii și team-building-uri corporate, un catering, un furnizor B2B, o firmă de servicii. Vezi „Tiparul transferabil".

Construcția se face în **Setări → CRM → tab «Configurare prezentare»** (`/settings/sales-crm?tab=presentation`). Rularea în fața prospectului se face din **Vânzări → CRM → tab «Prezentare»** (`/sales-crm`) sau direct de pe fișa unui lead/deal. Pipeline-ul, lead-urile și fișa de eveniment sunt în ghidul `crm-vanzari-pipeline.md`.

## Anatomia unei prezentări — cele ~11 etape (ordinea poveștii)

Structura clasică **problemă → agitare → soluție → dovadă → ofertă**, în 11 momente:

1. **Intro / ecran de start** — vânzătorul completează (sau importă din lead) câteva date despre prospect ÎNAINTE de a începe: tip de afacere, vechime, număr de locații, canalul principal de venituri, cifra de afaceri, ce sistem folosește acum, **cine decide** (proprietar/manager/contabil). Rol: personalizează tot ce urmează + alimentează „ghicirea" tipologiei. Prospectul vede doar un titlu + subtitlu de copertă.
2. **Discovery — deschidere (framing)** — un slide-punte „Să ne cunoaștem", care anunță întrebările ca pe o conversație, nu un interogatoriu. Are deschideri diferite per tipologie (la un conservator de 10+ ani: „nu îți spun să schimbi sistemul, doar să adaugi un modul").
3. **Discovery — întrebările cheie** — 5-6 întrebări (dintr-un pool mai mare), alese DINAMIC pe relevanță, nu primele din listă. Formate: carduri cu iconițe, scală 1-10, da/nu, alegere multiplă, text, dată. Unele întrebări pot fi „doar pe telefonul vânzătorului" (prospectul nu le vede). Răspunsurile aici declanșează automat durerile.
4. **Discovery — rezumat** — „Iată ce am înțeles din răspunsurile tale…": confirmă prospectului că a fost ascultat, listează tipologia detectată + top 3-5 dureri. Dacă prospectul corectează ceva, prezentarea se reordonează.
5. **Punte „de la negativ la pozitiv"** — slide-pivot emoțional „De la probleme la posibilități": pornește afișând DOAR coloana problemelor („afli profitul abia de la contabil", „food cost din instinct"…); la primul „Înainte" se dezvăluie coloana-oglindă cu soluția („vezi profitul în timp real"…). Apoi un slide-wishlist „**Ce ai bifa primul?**" — prospectul (sau vânzătorul) bifează ce și-ar dori; bifele REORDONEAZĂ restul prezentării.
6. **Bucla Durere → Soluție** (top 3 dureri) — inima prezentării. Pentru fiecare durere prioritară: întâi DUREREA (reformulată cum o trăiește el, cu o cifră-șoc), apoi imediat SOLUȚIA care o rezolvă, demonstrată **LIVE pe platforma reală** (buton „🎬 Vezi LIVE"), nu doar promis verbal.
7. **Calcul revelator** — cifre interactive: „cât plătești ACUM pe 5-8 softuri separate vs o singură platformă". Momentul de șoc financiar.
8. **Dovezi (case studies)** — 1-3 studii de caz reale, alese automat pe tipul de afacere + ORAȘUL prospectului + durerile confirmate („un loc ca al tău, din orașul tău, a obținut X"). Dovada locală bate dovada generică.
9. **Calcul ROI + costul inacțiunii** — al doilea calcul, de încheiere: recuperarea investiției + cât pierde dacă AMÂNĂ (slider 6/12/24 luni). Creează urgență.
10. **Ofertă personalizată** — pachete de preț (ex. Pilot/Pro/Enterprise) cu unul marcat „recomandat" după tipologie, add-on-uri bifabile, semnale de încredere (garanție, fără contract pe termen lung), trimitere pe email/WhatsApp.
11. **Închidere (CTA)** — un singur pas concret de făcut acum (pornește pilotul, rezervă kickoff).

**Obiecțiile NU sunt o etapă fixă** — se tratează LIVE, când prospectul ezită: vânzătorul marchează obiecția pe panoul lui și poate afișa pe ecranul prospectului răspunsul pregătit + dovada potrivită.

## Mecanicile dinamice (esența — ce face prezentarea „vie")

- **Legarea răspuns → durere** (mecanismul central). Fiecare opțiune de răspuns (la Intro, Discovery sau wishlist) poate „aprinde" o durere, cu 3 niveluri pe care le vezi în editor ca etichete intuitive:
  - 🎯 **Sigură** — răspunsul confirmă durerea, ea intră garantat;
  - ➕ **Scor ±** — răspunsul mărește/micșorează cât de tare e simțită durerea (mai multe semnale mici se adună);
  - 🔍 **De confirmat** — semnal slab, durerea apare doar dacă alte răspunsuri o întăresc.
- **Scoring / intensitate** — fiecare durere acumulează un scor 1-10 din toate semnalele. Apar doar durerile peste un prag (~5-6); top 3-5 devin scheletul. Când mai multe răspunsuri ating aceeași durere, se ia intensitatea maximă. Un răspuns poate alimenta mai multe dureri.
- **Tipologii (ghicirea tipului de cumpărător)** — din răspunsuri, sistemul deduce profilul prospectului (conservator, în expansiune, începător, lanț, hotel, catering…). Tipologia rescrie ce dureri/soluții/dovezi/obiecții se accentuează și ce pachet se recomandă (vezi „override" mai jos). Nu se setează manual — se derivă.
- **Smart fields (variabile)** — datele din Intro și răspunsurile din Discovery se salvează și se inserează AUTOMAT în textul slide-urilor ulterioare și în calcule (numele prospectului, nr. invitați, tipul de eveniment, cifra de afaceri). Prezentarea „vorbește" personalizat fără editare manuală.
- **Flux condițional (ramificare)** — slide-uri, întrebări sau pași întregi pot avea condiții de vizibilitate: apar DOAR dacă un răspuns satisface o regulă (ex. întrebarea de livrare apare doar dacă afacerea are canal de livrare).
- **Reveal per răspuns** — la alegerea unui răspuns poate apărea pe loc un text/imagine de impact, calibrat pe ce a ales; la răspuns „bun/rezolvat" prezentarea trece automat mai departe (nu mai e nimic de vândut acolo).
- **Tur virtual LIVE („walkthrough")** — pe durere/soluție, buton care pornește un tur ghidat prin produsul real (pagini reale, narațiune cu cifre). Dovada se face arătând, nu promițând.

## Taburile de editare (Setări → CRM → Configurare prezentare)

> **Referința EXHAUSTIVĂ de câmpuri** (fiecare câmp editabil din fiecare tab, cu opțiunile lui) e în `prezentare-vanzare-campuri.md`. Mai jos e harta taburilor; pentru „setează câmpul X" mergi acolo.

Două vederi (comutator sus):
- **Prezentări** — lista prezentărilor brandului (poți avea mai multe) + editorul celei selectate, cu buton „Salvează toate". La „**+ Adaugă prezentare**" alegi: goală, exemplu simplu, sau un **șablon gata făcut** (Symbai HoReCa 2026 — cel mai complet; Sală evenimente; Catering; Cursuri online; Servicii; Produse/retail). Șablonul vine populat cu zeci de dureri/soluții/calcule/obiecții/dovezi — doar le ajustezi.
- **Bibliotecă brand** — blocuri reutilizabile (dureri, soluții, întrebări, obiecții, calcule, dovezi) partajate între toate prezentările brandului.

Deasupra taburilor, un **antet fix**: nume prezentare, titlu ecran de start, subtitlu ecran de start (ce vede prospectul), domeniu de activitate + butoane „Duplică"/„Șterge".

Taburile, în ordinea poveștii:

1. **Flux ✨** — tabul „acasă". Aici construiești POVESTEA ca o secvență de pași (Deschidere → Întrebări → Trecerea de la probleme la soluții → Dureri & soluții → Calcul revelator → Obiecții → Dovezi → Ofertă). Fiecare pas e un card cu comutator on/off și două explicații: „**Clientul vede:**" și „**Tu (din telefon):**". Setezi câte elemente apar (câte dureri, câte dovezi), reguli „apare doar dacă…" și mai multe/mai puține după tipologie. Tot aici editezi inline cele două slide-uri de tranziție (coloanele Acum↔Cu noi și wishlist-ul).
2. **Intro** — câmpurile completate ÎNAINTE de prezentare; pot fi obligatorii sau auto-completate din lead. Sub fiecare opțiune, legi durerile declanșate (🎯/➕/🔍).
3. **Discovery** — întrebările puse prospectului. Fiecare poate fi „pe ecran" (o vede el) sau „doar telefon". Sub fiecare răspuns, legi durerile/tipologia.
4. **Dureri** — problemele prospectului, fiecare legată de soluția care o rezolvă și de tipurile de client la care apare.
5. **Soluții** — ce faci pentru client; fiecare legată de durerile pe care le rezolvă, cu galerie media, KPI și tur live.
6. **Tipologii** — segmentele de clienți + regulile după care prezentarea ghicește tipul.
7. **Tema** — fonturi + culori + dimensiuni (preset-uri „1 click" sau personalizat). Se aplică tuturor prezentărilor brandului.
8. **Calcule** — formule de economie/ROI/cost al inacțiunii/recuperare, cu cifre interactive alimentate din răspunsuri.
9. **Obiecții** — ezitările + răspunsul pregătit (legate de dureri); plus câmpul opțional „Garanție afișată clientului".
10. **Dovezi** — case studies/testimoniale/cifre, cu durerile/soluțiile/tipurile/orașul pentru care sunt relevante (selecție automată).
11. **Oferte** — pachete de preț + add-on-uri + canale de trimitere + automatizări post-trimitere.
12. **Preview** — rulează prezentarea LIVE pe datele draft, cu testare rapidă pe scenarii (Restaurant clasic / Conservator / Expansion / Newbie) — vezi ce tipologie se detectează și câte slide-uri ies, fără să salvezi.

## Coach Agent + cum rulezi în fața prospectului

- **Coach Agent** = panou-asistent vizibil DOAR vânzătorului (buton plutitor jos-dreapta), de RULARE (nu de construcție). Pe fiecare slide: sfaturi de prezentare, întrebări de pus cu voce tare, cifre-cheie. Vânzătorul **marchează live** răspunsurile/durerile/obiecțiile → prezentarea se reordonează. La obiecție: apasă „are obiecția" → primește răspunsul + dovada și le poate afișa pe ecranul prospectului. Se poate muta pe alt ecran (popout) pentru setup cu două monitoare.
- **Tab «Învață» (Școala de vânzare Symbai)** — manualul de metodă (mentalitate de consultant, deschidere, contractul de la început, discovery, durere/soluție, cifre, metoda în 4 pași pentru obiecții, închidere, greșeli care ucid vânzarea) + „Lecția momentului" care se schimbă după slide-ul curent, tipologie și obiecții. De citit ÎNAINTE/între întâlniri.
- **Rulare**: din `/sales-crm` → tab «Prezentare» alegi prezentarea, completezi datele de start (sau **„Importă din lead"**), apoi:
  - **„Pornește prezentarea"** — derulare pe ecranul curent (mod ecran complet ascunde restul UI-ului);
  - **„Pornește + Coach pe telefon"** — pornește ȘI deschide un **QR/link** prin care vânzătorul preia controlul de pe telefon. Linkul (valabil 24h, regenerabil/revocabil) merge și pe **WhatsApp/email**; funcționează **prin internet** (telefonul poate fi pe 4G, altă rețea decât laptopul). De pe telefon: navighează slide-uri, marchează răspunsuri/obiecții, injectează dovezi — reflectate în timp real pe ecranul prospectului. Taburi pe telefon: Acum / Obiecții / Client / Tot / Învață.
- Sesiunile de prezentare se salvează (le vezi ulterior pe deal).

## Tiparul transferabil — cum faci una pentru ALT business (parc, hotel, sală, catering…)

Metodologia se copiază 1:1 în orice vertical. Pașii:

1. **Definește axele de profil (Intro)** care segmentează prospecții: cine decide, sub-tipul de business, mărimea/volumul, vechimea, de unde vin banii, ce folosesc acum.
   - *Parc de distracții:* tip (acvatic/aventură/indoor kids/trambuline), nr. atracții, sezonalitate, canale (la poartă/online/grup-corporate), sistem de ticketing actual, ce vinde (petreceri copii / team-building corporate / abonamente).
2. **Pentru fiecare durere, scrie O întrebare cu 4 răspunsuri-card**, gradate de la „rezolvat perfect" la „habar n-am / haos total" — să sune ca o conversație între colegi de breaslă, nu chestionar. *Ex. parc:* „Știi care atracție îți aduce cel mai mult profit pe oră de funcționare?" → o știu exact / aproximativ / doar încasări totale / habar n-am.
3. **Atașează fiecărui răspuns o intensitate 1-10 + mod** (🎯/➕/🔍). „Rezolvat" = 0 (întrebarea se sare). „Habar n-am / haos" = 9-10.
4. **Alege o ancoră** — întrebarea pusă MEREU (de regulă cea de profit).
5. **Definește tipologiile reale** (nu segmente de marketing) cu semnale de detecție + semnale negative + prag minim. *Parc:* „familia cu copii mici, sensibilă la preț", „grupul de adolescenți pe adrenalină", „firma care vrea team-building", „organizatorul de petreceri aniversare". *Hotel:* „city-break", „corporate recurent", „cuplu de aniversare premium", „grup/nuntă".
6. **Pentru fiecare tipologie, definește cele 4 accente (override-ul):** care durere o scoți în față, ce arăți primul (ce atracție/pachet/serviciu), ce poveste de succes îi arăți (un client *ca el*), cum deschizi și pe ce ton (provocare? calcul? siguranță? noutate?).
7. **Construiește perechile durere→soluție** și **dovezile** după același tipar: durere = titlu emoțional + situație recognoscibilă + cifră-șoc + tabel „Acum vs Cu noi" + calcul de bani pierduți, mapată 1:1 la o soluție al cărei NUME conține beneficiul (nu denumirea tehnică) + cifra de câștig; dovadă = caz concret (cine + înainte + după + cifre) + citat cu nume, etichetat pe tip/durere/obiecție/oraș ca să fie servit automat.
8. **Tratează profilul „dificil" diferit** — orice business are unul (la parc: clientul ultra-sensibil la preț; la hotel: cel „dezamăgit data trecută"). Regula: nu împinge funcții, ci elimină riscul perceput + oferă probă/garanție.

**Esența:** descoperi tipul de om din câteva întrebări → prezentarea se rearanjează singură (alte dureri, alte pachete arătate primele, alte dovezi, alt ton) → fiecare cumpărător simte că vorbești exact despre situația LUI.

## Întrebări frecvente

- **Pot construi prezentarea prin conexiune (cu Claude direct)?** Nu — nu există tool-uri MCP de prezentări. Claude poate să-ți PROIECTEZE conținutul (întrebări, dureri, soluții, obiecții, calcule, oferte, dovezi pentru businessul tău) și să te ghideze / completeze în pagină cu extensia Chrome, dar salvarea se face în interfața web.
- **De unde pornesc cel mai repede?** „+ Adaugă prezentare" → un șablon apropiat de ce vinzi (Sală evenimente / Catering / Servicii / Produse), sau **Symbai HoReCa 2026** ca model de structură — apoi rescrii durerile/soluțiile/ofertele pe businessul tău. Cel mai greu (logica și fluxul) e deja făcut.
- **Diferența dintre «Configurare prezentare» și tabul «Prezentare» din CRM?** Prima (Setări → CRM) = unde CONSTRUIEȘTI. A doua (Vânzări → CRM) = unde RULEZI în fața prospectului. Le confunzi ușor.
- **De ce nu apare un slide la rulare?** Cel mai des: e dezactivat din tabul Flux, sau are o condiție „apare doar dacă…" neîndeplinită de răspunsuri, sau durerea legată n-a depășit pragul de intensitate. Testează în Preview pe scenariul potrivit.
- **Coach pe telefon nu se deschide / linkul nu merge?** Linkul e valabil 24h — regenerează-l din panoul Coach („Trimite pe telefon"). Funcționează prin internet, nu cere aceeași rețea WiFi; dacă a fost revocat, generează altul.

## Capcane

- **Web-only**: nicio acțiune de prezentare prin MCP. Nu promite clientului „ți-o construiesc eu prin conexiune" — proiectezi conținutul + ghidezi în pagină.
- **Două locuri ușor de confundat**: construiești în `/settings/sales-crm?tab=presentation`, rulezi în `/sales-crm` → Prezentare.
- **Întrebări care măgulesc = inutile**: răspunsurile trebuie să permită variantele oneste/jenante („habar n-am") — altfel nu descoperi durerea reală.
- **Cifre generice resping clienții analitici**: calculele trebuie să folosească datele LUI (din Intro/Discovery), nu estimări de broșură.
- **Loc CRM nominal (crm_seat)**: paginile CRM (deci și Prezentarea) se văd doar de angajații nominalizați ca „User CRM" — vezi `crm-vanzari-pipeline.md`.

## Cross-link-uri

- `prezentare-vanzare-campuri.md` — **referința completă de câmpuri** (toate câmpurile editabile din fiecare tab + ce e legacy/fără UI). Citește-o când userul cere „setează/modifică câmpul X".
- `crm-vanzari-pipeline.md` — pagina `/sales-crm` (pipeline, lead-uri, fișa de deal/eveniment, funcții AI, per vertical) și configurarea `/settings/sales-crm`. Prezentarea se lansează de pe un lead/deal de acolo.
- `rezervari-clienti-evenimente.md` — rezervări, evenimente/petreceri (BEO, P&L), contracte e-sign, avansuri — ce vinzi prin prezentare.
- `jocuri-activitati.md` — atracții & jocuri rezervabile (parc de distracții) — oferta pe care un parc o pune în prezentare.
- `marketing-social.md` / `email-marketing.md` — trimiterea ofertei și follow-up după prezentare.
- Skill dedicat: `construieste-prezentare` (proiectare consultativă + construcție vizuală pas-cu-pas).
