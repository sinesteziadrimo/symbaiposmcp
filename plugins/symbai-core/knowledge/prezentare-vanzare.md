# Prezentare de Vânzare (Sales Presentation / „Prezentări")

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

> ⚠ **Construcție HIBRIDĂ — tool-uri MCP + interfață web.** Există tool-uri MCP (`list_presentation_templates`, `list_presentations`, `get_presentation`, `create_presentation_from_template`, `patch_presentation`, `save_presentation`, tool-uri granulare de bibliotecă și quick actions precum `set_pain_badge` / `set_presentation_intro_visible`) cu care se CLONEAZĂ un șablon și se CITEȘTE/MODIFICĂ o prezentare prin conexiune (titluri de start, imagine cover, temă, ofertă, flux, câmpuri intro, tipologii, dureri/discovery, reveal-uri). **Preview** și RULAREA în fața prospectului se fac în aplicație (ideal cu extensia Chrome + user logat). Claude PROIECTEAZĂ conținutul + construiește prin MCP + verifică vizual în pagină. Scrierile MCP cer modulul „Setări & Configurare" pe token.

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
4. **Discovery — rezumat** — „Iată ce am înțeles din răspunsurile tale…": confirmă prospectului că a fost ascultat, listează tipologia detectată + top 3-5 dureri. (Notă: e element de RULARE/UI, nu un pas configurabil din Flux — nu-l căuta ca „stage".)
5. **Punte „de la negativ la pozitiv"** — slide-pivot emoțional „De la probleme la posibilități": pornește afișând DOAR coloana problemelor („afli profitul abia de la contabil", „food cost din instinct"…); la primul „Înainte" se dezvăluie coloana-oglindă cu soluția („vezi profitul în timp real"…). Apoi un slide-wishlist „**Ce ai bifa primul?**" — prospectul (sau vânzătorul) bifează ce și-ar dori; bifele ADAUGĂ durerea aferentă în pool-ul de candidați (deci soluția bifată ajunge în deck chiar dacă tipologia nu o avea „dominantă"). Atenție la tipuri: slide-ul-punte „De la probleme la posibilități" e `type:"info"` (bloc comparison + reveal în pași), iar slide-ul wishlist „Ce ai bifa primul?" e `type:"question"` cu `questionType:"multiselect"` și **painTriggers PE opțiuni** (NU richContent). Ambele se editează inline în pasul Tranziție, dar sunt tipuri diferite. ⚠ Pe un șablon clonat, painTriggers-ele wishlist-ului pointează la painId-uri HoReCa — relegă-le la durerile tale.
6. **Bucla Durere → Soluție** (top 3 dureri) — inima prezentării. Pentru fiecare durere prioritară: întâi DUREREA (reformulată cum o trăiește el, cu o cifră-șoc), apoi imediat SOLUȚIA care o rezolvă, demonstrată **LIVE pe platforma reală** (buton „🎬 Vezi LIVE"), nu doar promis verbal.
7. **Calcul revelator** — cifre interactive: „cât plătești ACUM pe 5-8 softuri separate vs o singură platformă". Momentul de șoc financiar. Pentru oferte cu preț hibrid, calculatorul poate include un câmp live „estimat vânzări" și explică formula **cost fix (RON sau €→lei) + procent × vânzări estimate**; agentul ajustează estimatul în fața prospectului, nu ascunde matematica.
8. **Dovezi (case studies)** — 1-3 studii de caz reale, alese automat pe tipul de afacere + ORAȘUL prospectului + durerile confirmate („un loc ca al tău, din orașul tău, a obținut X"). Dovada locală bate dovada generică.
9. **Calcul ROI + costul inacțiunii** — al doilea calcul, de încheiere: recuperarea investiției + cât pierde dacă AMÂNĂ (slider 6/12/24 luni). Creează urgență.
10. **Ofertă personalizată** — pachete de preț (ex. un model în 3 trepte) cu unul marcat „recomandat" după tipologie, add-on-uri bifabile, semnale de încredere (garanție, fără contract pe termen lung), trimitere pe email/WhatsApp. (Prețurile/pachetele le pui pe businessul owner-ului — nu inventa cifre. Iconițele de pe ofertă se randează ca TEXT BRUT → folosește EMOJI „🚀", nu nume de iconițe „Rocket". Verticalele clonate vin cu 0 oferte — le creezi de la zero.) Tier-urile pot afișa separat „+ X% din încasări" pe lângă abonamentul fix; procentul apare lângă total, dar nu se adună în totalul fix deoarece depinde de cifra reală a clientului.
11. **Închidere (CTA)** — un singur pas concret de făcut acum (pornește pilotul, rezervă kickoff).

**Obiecțiile NU sunt o etapă fixă** — se tratează LIVE, când prospectul ezită: vânzătorul marchează obiecția pe panoul lui și poate afișa pe ecranul prospectului răspunsul pregătit + dovada potrivită.

## Modelul mental — cum funcționează CU ADEVĂRAT (citește înainte să construiești)

> Asta descrie mecanica REALĂ din motor, nu cum „pare" din interfață. Dacă n-o înțelegi, faci prezentări plate. Trebuie să poți explica unui owner ne-tehnic DE CE iese o prezentare bună sau slabă.

**Lanțul cauzal (ține-l minte pe de rost):**
`Datele de intro → ghicirea tipologiei → întrebările de discovery alese pe relevanță → fiecare răspuns aprinde/gradează DURERI (scor 1-10) → durerile ADMISE în pool își trag SOLUȚIA mapată 1:1 → calculele iau cifrele LUI → dovezile relevante apar → obiecțiile prezise sunt pregătite → oferta închide.`
Dacă rupi o verigă (legi un răspuns la o durere care nu e „dominantă" la tipologia lui, sau pui un `painId` care nu există), veriga e ignorată **TĂCUT** — fără eroare — și prezentarea iese plată.

**Mecanicile vii:**

- **Răspuns → durere (mecanismul central).** Fiecare opțiune (la Intro, Discovery SAU wishlist) poate „aprinde" o durere în **3 moduri care NU sunt interschimbabile** — atenție la matematica lor, e sursa multor greșeli:
  - 🎯 **Sigură (direct)** — durerea intră garantat, cu o intensitate fixată 1-10. Mai multe semnale „direct" pe aceeași durere → se ia **MAXIMUL**.
  - ➕ **Scor ± (boost)** — răspunsul **ADUNĂ** la intensitate (poate fi și NEGATIV, ca să atenueze). Mai multe boost-uri se **ÎNSUMEAZĂ** (NU maximul!).
  - 🔍 **De confirmat (potential)** — semnal slab, plafonat la max 4; durerea apare doar dacă alte semnale o întăresc.
  - Formula finală pe o durere: `bază = max(direct, potential)`, apoi `+ suma boost-urilor`, apoi clamp 0-10. (Reacția marcată de vânzător pe telefon — wow/interes/sceptic — ajustează și ea scorul.)
- **⚠ REGULA CARE DECIDE DACĂ O DURERE APARE (cea mai importantă, lipsea din docs):** în secțiunea Dureri & Soluții pot intra DOAR durerile aflate în **`dominantPains`** ale tipologiei detectate (plus cele bifate explicit de prospect pe slide-ul wishlist). **O durere cu scor uriaș care NU e în `dominantPains` la tipologia lui NU apare NICIODATĂ.** Scorul/intensitatea doar **ORDONEAZĂ** candidații deja admiși — nu îi admite. Deci o durere are nevoie de DOUĂ lucruri ca să fie spusă: (1) painTriggers care îi dau scor și (2) să fie în `dominantPains` la tipologia relevantă. (Abia dacă pool-ul e gol se cade pe primele dureri din bibliotecă = prezentare generică.)
- **Durere fără soluție = dispare tăcut.** O durere admisă dar fără nicio soluție legată (`addressedByFeatures` gol) e SĂRITĂ de motor (nu lasă prospectul „cu problema pe ecran, fără remediu"). Maparea de aur: **1 durere ↔ 1 soluție**, numele soluției = BENEFICIUL, nu termenul tehnic.
- **Tipologii (ghicirea cumpărătorului).** Din datele de intro (auto-derive) + răspunsuri, motorul deduce profilul (conservator, expansiune, începător, hotel, catering, „familie sensibilă la preț", „firmă team-building"…). Tipologia e **dirijorul**: din ea decurg `dominantPains`, soluțiile/dovezile recomandate, oferta și tonul. **Nu se setează manual — se derivă.** O tipologie FĂRĂ reguli de detecție = personalizare moartă (toți prospecții primesc aceeași prezentare).
- **Smart fields (variabile).** Datele din Intro + răspunsurile Discovery se inserează AUTOMAT în textele de mai târziu și în calcule (`{nume}`, `{nr_invitati}`, `{cifra}`). Prezentarea „vorbește" personalizat fără editare manuală.
- **Reveal vs followUpSlide (NU le confunda).** La alegerea unui răspuns poate apărea: un **reveal** = text/imagine scurtă PESTE slide-ul curent; SAU un **followUpSlide** = un **SLIDE ÎNTREG separat**, full-screen (titlu/bullete/poză), injectat după întrebare — un mini-pitch educațional. Când owner-ul cere „un slide educațional după răspuns", vrea **followUpSlide**, nu reveal. La răspunsul „rezolvat" se folosește **autoAdvance** (trece automat mai departe — nu mai e nimic de vândut acolo); asta NU sare întrebarea, doar nu aprinde durerea.
- **Flux condițional (ramificare).** Slide-uri/întrebări/pași pot avea condiții de vizibilitate: apar DOAR dacă un răspuns satisface o regulă (ex. întrebarea de livrare doar dacă afacerea are canal de livrare). O întrebare se SARE doar prin `skipIf`/`visibleWhen`/axă deja cunoscută — nu printr-un trigger cu intensitate 0.
- **Tur virtual LIVE („walkthrough").** Pe soluție, buton care deschide produsul REAL într-un **iframe overlay** (NU navighează fereastra, ca să nu piardă prezentarea) — pagini reale, narațiune cu cifre. Dovada se face arătând, nu promițând.
- **Ce e OUTPUT, nu input.** Tipologia detectată, durerile active + intensitatea, ce slide-uri ies, ce calcule se evaluează — toate sunt **CALCULATE de motor la rulare**. Le verifici în **Preview**, nu le „setezi". A încerca să scrii „detectedTypology" sau „assignedPains" e o greșeală conceptuală.

## ⚠ Cele 4 cauze TĂCUTE ale prezentărilor slabe (fără eroare, dar deck plat)

| Cauza | Simptom în Preview | Fix |
|---|---|---|
| **1. Durere nelegată de niciun răspuns** (fără painTriggers) | scorul durerii e mereu 0; nu iese în față | leagă cel puțin un răspuns Intro/Discovery la durere (`whenAnswerEquals` + `painId`) |
| **2. Durere legată dar ABSENTĂ din `dominantPains`** | badge 💔 pe răspuns, dar durerea NU apare în deck | adaug-o în `dominantPains` la tipologia relevantă (altfel scorul e degeaba) |
| **3. Durere fără soluție mapată** (`addressedByFeatures` gol) | durerea dispare din deck deși e dominantă + intensă | leagă o soluție la durere (1:1) |
| **4. `painId` / `calculationId` orfan** (scris greșit / inexistent) | nimic nu se aprinde / „lipsește calculatorul" | verifică în Preview badge-ul 💔 N + că id-ul există în bibliotecă |
| **5. Orfani după CLONARE** (clonezi gold-standard, rescrii durerile cu id-uri noi, dar `typologies.dominantPains` rămâne cu id-urile VECHI HoReCa) | tipologia se detectează, dar **deck-ul e GOL** — admite numai dureri inexistente | după ce rescrii biblioteca, rescrie ȘI `dominantPains`/`recommendedFeatures`/`recommendedProofs` ale tipologiilor + painTriggers-ele wishlist-ului cu NOILE id-uri |

Plus: **calculatorul nu apare** dacă `flowV2.calculation.enabled=false` (pasul Calcul e stins); **Tranziția** și **Calculul-după-ofertă** sunt OPT-IN (oprite implicit — trebuie pornite din Flux).

> ⚠ Cauza #5 e cea mai perfidă: clonezi gold-standard „ca structură", rescrii durerile pe businessul tău, dar uiți că tipologiile moștenite încă pointează la durerile de restaurant. Tipologia se detectează corect, dar pool-ul ei de dureri e gol → prezentare goală, fără nicio eroare. **Orfanii în `dominantPains` NU sunt inofensivi.**

## Taburile de editare (Setări → CRM → Configurare prezentare)

> **Referința EXHAUSTIVĂ de câmpuri** (fiecare câmp editabil din fiecare tab, cu opțiunile lui) e în `prezentare-vanzare-campuri.md`. Mai jos e harta taburilor; pentru „setează câmpul X" mergi acolo.

Două vederi (comutator sus):
- **Prezentări** — lista prezentărilor brandului (poți avea mai multe) + editorul celei selectate, cu buton „Salvează toate". La „**+ Adaugă prezentare**" alegi: goală, exemplu simplu, sau un **șablon gata făcut** (Symbai HoReCa 2026 — cel mai complet; Sală evenimente; Catering; Cursuri online; Servicii; Produse/retail). Șablonul vine populat cu zeci de dureri/soluții/calcule/obiecții/dovezi — doar le ajustezi.
- **Bibliotecă brand** — blocuri reutilizabile (dureri, soluții, întrebări, obiecții, calcule, dovezi) partajate între toate prezentările brandului.

Deasupra taburilor, un **antet fix**: nume prezentare, titlu ecran de start, subtitlu ecran de start (ce vede prospectul), domeniu de activitate + butoane „Duplică"/„Șterge".

Taburile, în ordinea poveștii:

1. **Flux ✨** — tabul „acasă". Aici construiești POVESTEA ca o secvență de pași (Deschidere → Întrebări → Trecerea de la probleme la soluții → Dureri & soluții → Calcul revelator → Obiecții → Dovezi → Ofertă). Fiecare pas e un card cu comutator on/off și două explicații: „**Clientul vede:**" și „**Tu (din telefon):**". Setezi câte elemente apar (câte dureri, câte dovezi), reguli „apare doar dacă…" și mai multe/mai puține după tipologie. Tot aici editezi inline cele două slide-uri de tranziție (coloanele Acum↔Cu noi și wishlist-ul). Wishlist-ul în stil `icon-cards` acceptă poză pe fiecare opțiune; poza apare full-bleed în card, cu overlay și hover.
2. **Intro** — câmpurile completate ÎNAINTE de prezentare; pot fi obligatorii sau auto-completate din lead. Sub fiecare opțiune, legi durerile declanșate (🎯/➕/🔍).
3. **Discovery** — întrebările puse prospectului. Fiecare poate fi „pe ecran" (o vede el) sau „doar telefon". Sub fiecare răspuns, legi durerile/tipologia.
4. **Dureri** — problemele prospectului, fiecare legată de soluția care o rezolvă și de tipurile de client la care apare.
5. **Soluții** — ce faci pentru client; fiecare legată de durerile pe care le rezolvă, cu galerie media, KPI și tur live.
6. **Tipologii** — segmentele de clienți + regulile după care prezentarea ghicește tipul.
7. **Tema** — fonturi + culori + dimensiuni (preset-uri „1 click" sau personalizat). Se aplică tuturor prezentărilor brandului.
8. **Calcule** — formule de economie/ROI/cost al inacțiunii/recuperare, cu cifre interactive alimentate din răspunsuri. Pentru `comparative-list`, prețul Symbai poate fi pur fix sau hibrid: `symbaiCostCurrency`/`symbaiEurRate` pentru €→lei, plus `symbaiRevenuePercent` și `revenueEstimate*` pentru procent din vânzările estimate.
9. **Obiecții** — ezitările + răspunsul pregătit (legate de dureri); plus câmpul opțional „Garanție afișată clientului".
10. **Dovezi** — case studies/testimoniale/cifre, cu durerile/soluțiile/tipurile/orașul pentru care sunt relevante (selecție automată).
11. **Oferte** — pachete de preț + add-on-uri + canale de trimitere + automatizări post-trimitere. Un singur tier se centrează vizual; la 2 tier-uri layoutul rămâne echilibrat. `revenuePercent`/`revenuePercentLabel` afișează „+ X% din încasări" ca rând separat.
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
3. **Atașează fiecărui răspuns o intensitate 1-10 + mod** (🎯/➕/🔍). La răspunsul „rezolvat" nu legi nicio durere (+ poți pune `autoAdvance` ca să treacă automat mai departe — NU înseamnă că se „sare" întrebarea). „Habar n-am / haos" = intensitate 9-10. **Și pune durerea în `dominantPains` la tipologia relevantă** — altfel scorul e degeaba (vezi regula din modelul mental).
4. **Alege o ancoră** — întrebarea pusă MEREU (de regulă cea de profit).
5. **Definește tipologiile reale** (nu segmente de marketing) cu semnale de detecție + semnale negative + prag minim. *Parc:* „familia cu copii mici, sensibilă la preț", „grupul de adolescenți pe adrenalină", „firma care vrea team-building", „organizatorul de petreceri aniversare". *Hotel:* „city-break", „corporate recurent", „cuplu de aniversare premium", „grup/nuntă".
6. **Pentru fiecare tipologie, definește cele 4 accente (override-ul):** care durere o scoți în față, ce arăți primul (ce atracție/pachet/serviciu), ce poveste de succes îi arăți (un client *ca el*), cum deschizi și pe ce ton (provocare? calcul? siguranță? noutate?).
7. **Construiește perechile durere→soluție** și **dovezile** după același tipar: durere = titlu emoțional + situație recognoscibilă + cifră-șoc + tabel „Acum vs Cu noi" + calcul de bani pierduți, mapată 1:1 la o soluție al cărei NUME conține beneficiul (nu denumirea tehnică) + cifra de câștig; dovadă = caz concret (cine + înainte + după + cifre) + citat cu nume, etichetat pe tip/durere/obiecție/oraș ca să fie servit automat.
8. **Tratează profilul „dificil" diferit** — orice business are unul (la parc: clientul ultra-sensibil la preț; la hotel: cel „dezamăgit data trecută"). Regula: nu împinge funcții, ci elimină riscul perceput + oferă probă/garanție.

**Esența:** descoperi tipul de om din câteva întrebări → prezentarea se rearanjează singură (alte dureri, alte pachete arătate primele, alte dovezi, alt ton) → fiecare cumpărător simte că vorbești exact despre situația LUI.

## Întrebări frecvente

- **Pot construi prezentarea prin conexiune (cu Claude direct)?** DA pentru structură și multe editări concrete — Claude clonează un șablon, setează titlurile, imaginea cover, tema, oferta, fluxul, câmpurile intro, tipologiile și elementele de bibliotecă (`create_presentation_from_template`, `patch_presentation`, tool-uri granulare, `set_pain_badge`, `set_presentation_intro_visible`; citește cu `get_presentation`). Preview + rularea se fac în aplicație (extensia Chrome), ca să vezi cum arată real. În plus, Claude îți PROIECTEAZĂ conținutul (întrebări, dureri, soluții, obiecții, calcule, oferte, dovezi pentru businessul tău).
- **De unde pornesc cel mai repede?** „+ Adaugă prezentare" → un șablon apropiat de ce vinzi (Sală evenimente / Catering / Servicii / Produse), sau **Symbai HoReCa 2026** ca model de structură — apoi rescrii durerile/soluțiile/ofertele pe businessul tău. Cel mai greu (logica și fluxul) e deja făcut.
- **Diferența dintre «Configurare prezentare» și tabul «Prezentare» din CRM?** Prima (Setări → CRM) = unde CONSTRUIEȘTI. A doua (Vânzări → CRM) = unde RULEZI în fața prospectului. Le confunzi ușor.
- **De ce nu apare un slide la rulare?** În ordinea probabilității: (1) **durerea nu e în `dominantPains`** la tipologia detectată (cauza #1 — scorul nu o admite, doar o ordonează); (2) durerea n-are nicio soluție legată (dispare tăcut); (3) pasul e stins din tabul Flux (ex. `calculation.enabled=false` → fără calculator; Tranziția/Calcul-după-ofertă sunt OPT-IN); (4) o condiție „apare doar dacă…" neîndeplinită; (5) `painId`/`calculationId` scris greșit. Testează în Preview pe scenariul potrivit și uită-te la badge-ul 💔.
- **Coach pe telefon nu se deschide / linkul nu merge?** Linkul e valabil 24h — regenerează-l din panoul Coach („Trimite pe telefon"). Funcționează prin internet, nu cere aceeași rețea WiFi; dacă a fost revocat, generează altul.

## Capcane

- **Hibrid MCP + web**: scaffold/clonă + meta/temă/ofertă/flux/tipologii prin MCP (`create_presentation_from_template` + `patch_presentation`); editarea vizuală fină per-slide + Preview + rulare în aplicație (Chrome). Citește cu `get_presentation(section:...)` înainte de patch pe acea parte. Scrierile cer modulul „Setări & Configurare" pe token MCP.
- **Două locuri ușor de confundat**: construiești în `/settings/sales-crm?tab=presentation`, rulezi în `/sales-crm` → Prezentare.
- **Întrebări care măgulesc = inutile**: răspunsurile trebuie să permită variantele oneste/jenante („habar n-am") — altfel nu descoperi durerea reală.
- **Cifre generice resping clienții analitici**: calculele trebuie să folosească datele LUI (din Intro/Discovery), nu estimări de broșură.
- **Loc CRM nominal (crm_seat)**: paginile CRM (deci și Prezentarea) se văd doar de angajații nominalizați ca „User CRM" — vezi `crm-vanzari-pipeline.md`.
- **Durere fără `dominantPains` = invizibilă**: cea mai frecventă greșeală — legi o durere de răspunsuri (scor mare) dar uiți s-o pui în `dominantPains` la tipologie → nu apare deloc. Scorul ordonează, `dominantPains` admite.
- **Verticalele clonate sunt SCHELETE**: `sala_evenimente`/`catering`/`servicii` au ~5 dureri, ~1 dovadă, 0 oferte. Nu le „doar ajusta" — pornește de la **gold-standard ca STRUCTURĂ** și rescrie conținutul pe businessul owner-ului (altfel vinzi software de restaurant unui client de nunți).
- **Reveal ≠ followUpSlide**: „text peste slide" vs „slide întreg separat". Owner-ul care cere slide educațional după un răspuns vrea followUpSlide.
- **Emoji, nu nume de iconițe**: pe ofertă/semnale de încredere iconițele se randează literal — pune „🚀", nu „Rocket".
- **Preț hibrid transparent**: când folosești abonament + comision, arată în calcul estimatul de vânzări și formula fix + procent; nu ascunde procentul în totalul fix și nu inventa cifra de vânzări.
- **Wishlist cu poze**: cardurile icon-cards pot avea `imageUrl`; folosește poze reale care arată beneficiul bifat de prospect, altfel lasă cardul fără poză.

## Cross-link-uri

- `prezentare-vanzare-campuri.md` — **referința completă de câmpuri** (toate câmpurile editabile din fiecare tab + ce e legacy/fără UI). Citește-o când userul cere „setează/modifică câmpul X".
- `crm-vanzari-pipeline.md` — pagina `/sales-crm` (pipeline, lead-uri, fișa de deal/eveniment, funcții AI, per vertical) și configurarea `/settings/sales-crm`. Prezentarea se lansează de pe un lead/deal de acolo.
- `rezervari-clienti-evenimente.md` — rezervări, evenimente/petreceri (BEO, P&L), contracte e-sign, avansuri — ce vinzi prin prezentare.
- `jocuri-activitati.md` — atracții & jocuri rezervabile (parc de distracții) — oferta pe care un parc o pune în prezentare.
- `marketing-social.md` / `email-marketing.md` — trimiterea ofertei și follow-up după prezentare.
- Skill dedicat: `construieste-prezentare` (proiectare consultativă + construcție vizuală pas-cu-pas).
