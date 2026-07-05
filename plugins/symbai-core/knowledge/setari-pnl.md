# Setări P&L — cum îți configurezi raportul de profit și pierdere

> Companion al `rapoarte-preturi.md` (acela explică CE rapoarte există și cum le citești). Fișierul ăsta explică **cum modelezi P&L-ul exact cum vrei tu** și **cum salvezi un P&L peste care adaugi cheltuieli/venituri suplimentare**.
> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie`.

## Pe scurt

P&L-ul nu se „setează" cifră cu cifră — el se **construiește automat din clasificare**. Regula de aur pe care trebuie să o înțeleagă orice patron:

> **Fiecare produs/cheltuială are un TIP DE PRODUS → fiecare tip aparține unei CATEGORIE P&L → fiecare categorie stă într-o SECȚIUNE (Venituri / COGS / Personal / OpEx / Taxe).**

Deci „cum arată P&L-ul" se reglează în mare parte din **tipurile de produs** și din **categoriile P&L**. Tot ce ține de aspect, KPI-uri, praguri și grupări se face din pagina **Setări → Setări P&L**.

## Cele două locuri unde configurezi

1. **Tipuri de produs** (pagina „Conturi pe Tip Produs", `/ai-product-types`) — *manela principală*. Fiecare tip (materie primă, marfă, produs finit, serviciu, chirie, utilități…) se leagă de o categorie P&L și de conturi contabile. Dacă vânzările sau cheltuielile cad în secțiunea greșită din P&L, aici se repară.
2. **Setări → Setări P&L** (`/settings/pnl-categories`) — categoriile, grupările de venituri, pragurile semafor, KPI-urile și template-urile de industrie.

## Pagina „Setări P&L" — cele 5 tab-uri

### 1. Template-uri industrie
Un singur click aplică un set complet de KPI-uri + grupări de venituri optimizat pe tipul de business: **restaurant/bar, hotel, spa/parc, fabrică, procesare carne, magazin, e-commerce, servicii**. E **idempotent** — ce există deja nu se dublează. Recomandarea apare automat dacă ai setat domeniile de activitate în *Setări → General*. **Ăsta e primul pas pentru un client nou.**

Template-urile vin și cu **praguri semafor complete** (țintă/atenție/critic) calibrate pe industrie — se aplică opțional (`applyThresholds=true` prin conexiune, sau vizibil în preview-ul template-ului). Contează enorm la fabrici: pragurile default sunt HoReCa (food cost verde ≤32%), iar la **procesare carne** materia primă la 62–72% din vânzări e SĂNĂTOASĂ — fără template-ul potrivit, tot raportul pare roșu și semaforul devine inutil. Profilul **„Procesare carne"** are benzile industriei: materie primă țintă 68% (atenție 74 / critic 78), muncă 13%, prime cost 82%, marjă netă țintă 4% (la carne, profit net 2–6% e normal; 12% e la fel de suspect ca o pierdere).

### 2. Categorii P&L
Secțiunile mari ale raportului (Venituri, Alte venituri, COGS, Personal, și OpEx pe sub-tipuri: direct operațional, chirii, utilități, marketing, administrativ, mentenanță, asigurări, personal indirect, altele, plus Non-operațional și Taxe/TVA).
- Poți crea categorii și **subcategorii** (ierarhie pe un nivel), le reordonezi, le dai culoare.
- Pe fiecare categorie apeși butonul cu eticheta și **bifezi ce tipuri de produs intră în ea** — asta e legătura care decide ce vede clientul. *Un tip de produs aparține unei singure categorii.*
- **Mod avansat** (comutator sus): pe lângă tipurile de produs poți lega **conturi contabile** direct (clasa 6 = cheltuieli, 7 = venituri), fiecare marcat ca venit sau cheltuială — util ca facturile să cadă pe linia OpEx corectă.

### 3. Grupări venituri
Sub-secțiunile pliabile care apar la „1. VENITURI": pe **Canal, Metodă de plată, Tip comandă, Ospătar, Brand, Locație, Interval orar, Categorie produs** etc. Le activezi/dezactivezi, le reordonezi, le dai etichete frumoase (`valoare_din_sistem = etichetă afișată`) și pot avea **auto-ascundere** când filtrezi deja pe brand/locație (ca să nu fie redundante).
Inspirație: bar → adaugi Interval orar + Tip produs; lanț → adaugi Brand + Locație; delivery → adaugi Canal livrare.

### 4. Pe zilele săptămânii
Regulile care alimentează raportul **P&L pe zilele săptămânii** (`/reports/pnl-zile`). Pagina este `/settings/pnl-categories?tab=weekday`.

- **Ce rezolvă:** facturile lunare sau costurile indirecte nu au mereu o zi clară; aici spui cum se împart pe Luni–Duminică ca să nu decizi programul după vânzări brute.
- **Țintă:** un bucket standard (`labor`, `cogs`, `utilities`, `occupancy`, `opex`, `marketing`, `taxes` etc.) sau o categorie P&L anume (`pnlCategoryId`).
- **Metode:** `equal_calendar` (egal pe fiecare zi calendaristică), `equal_weekday` (egal pe cele 7 zile), `revenue_weighted` (proporțional cu încasările), `percent_of_revenue` (ex. comision card 1.5%), `day_weights` (ponderi/sume pe zile, ex. vineri+sâmbătă mai mult), `actual` (data reală a documentului), `labor_shifts` / `labor_shifts_strict` (personal din ture reale).
- **Cheltuieli manuale pe zile:** pentru costuri încă neînregistrate sau recurente pe anumite zile (formație live, DJ, pază suplimentară). Se văd clar în P&L-ul pe zile și nu înlocuiesc facturile reale.

Prin MCP, citești cu `get_weekday_pnl`, configurezi o regulă cu `configure_pnl_day_allocation`, iar cheltuielile manuale pe zile se adaugă cu `add_pnl_manual_day_expense`. Dacă un tool lipsește pe o instanță mai veche, dă linkul la tab-ul de setări și explică metoda aleasă.

### 5. Setări (praguri + panouri tag + Cost REAL)
- **Pragurile semafor** (verde/galben/roșu) pentru food cost, personal, **prime cost**, OPEX și marjă netă. Valorile pornesc de la nivelurile recomandate HoReCa România (food cost 28–32%, prime cost ≤60%, marjă netă ≥10%).
- Comutatoarele „Defalcare după Tag" (Vânzări / COGS) care adaugă panouri pe tag-uri în raportul detaliat.
- **Cardul „Cost REAL al bunurilor" (Food Cost REAL)** — vizibilitate în 3 trepte: **Automat** (recomandat — apare doar când există reduceri, atenții din partea casei sau beneficii de personal în perioada analizată), **Afișat mereu**, **Ascuns** (ascunde și KPI-ul „Food Cost REAL" și coloanele „FC real %"/„Reduceri %" din defalcarea pe unități). Vezi secțiunea dedicată de mai jos.

### Tab-ul KPI (pagina `/reports/pnl-kpi`)
KPI-uri editabile cu **constructor de formulă**: agregare (sumă/medie/min/max), numărare, sau raport A÷B × multiplicator, cu filtre. Setezi praguri și direcția trendului, și **previzualizezi** valoarea înainte să salvezi. Sistemul are și o serie de indicatori „wow" gata făcuți (ADR/RevPAR/GOPPAR la hotel, GMROI/rotație stoc la retail, ROAS la marketing, prime cost, menu engineering, profit pe scaun, no-show etc.) — vin cu template-ul de industrie.

## Cum configurez P&L-ul „exact cum vrea clientul" — rețeta

1. Setez domeniile de business (*Setări → General*).
2. **Aplic template-ul de industrie** (tab Template-uri) → KPI + grupări gata.
3. Mă asigur că **fiecare tip de produs e pe categoria P&L corectă** (asta schimbă efectiv ce vede clientul în raport).
4. În mod avansat, **leg conturile OpEx** de categorii, ca facturile de chirie/utilități/marketing să cadă pe linia bună.
5. Pentru decizii de program, setez **repartizarea pe zile** (personal din ture, utilități după încasări, chirie egal calendaristic, costuri weekend pe zilele corecte).
6. Setez **pragurile** după așteptările lui.
7. Adaug grupări/KPI personalizate la dorință.
8. (opțional) salvez un P&L de referință și-i adaug cheltuielile din afara sistemului.

## Food Cost REAL — „cât mă costă DE FAPT marfa, pe banii chiar încasați"

Cardul **„FOOD COST REAL"** din `/reports/pnl` (după secțiunea COGS) răspunde la întrebarea pe care food cost-ul clasic o ocolește: *clasicul* împarte costul materiei prime la vânzări, dar **nu vede banii pe care nu i-ai încasat** (reduceri, oferte) și **nu vede marfa care a ieșit din bucătărie fără bon** (din partea casei, beneficii personal). Cardul are două părți:

- **Stânga — „Unde s-au dus banii din preț"**: puntea de la *venitul la preț de listă* → minus discounturi pe produse → minus subvenția beneficiilor de personal → *venit net* → minus oferte automate (happy hour, promoții) → minus discount manual pe notă → **VENIT NET EFECTIV** (banii chiar încasați). Sub punte vezi totalul „dat înapoi" și cât % din venitul de listă reprezintă.
- **Dreapta — „Ce a ieșit din bucătărie & stoc"**: stiva completă de costuri — cost materie primă din vânzări + pierderi/risipă + mese personal + minusuri inventar + **din partea casei** (produsele oferite clienților consumă stoc real — costul lor e inclus în Costul TOTAL al Bunurilor) + **beneficii personal la cost de achiziție** (în formula de profit stă la Costuri Personal — aici apare doar pentru analiza food cost, fără dublare) + costuri din facturi + COGS B2B. Jos: **FOOD COST REAL %** = toată stiva împărțită la venitul net efectiv.

Cum îl citești: **FC clasic vs FC REAL** sunt afișate una lângă alta în antetul cardului, cu diferența în puncte procentuale. Un FC clasic de 30% cu un FC real de 37% înseamnă că 7 puncte se pierd în reduceri, atenții și consum interne — exact pârghiile pe care le poți controla fără să schimbi rețete sau furnizori.

**Defalcarea reducerilor** apare și în secțiunea „1. VENITURI" → „Reduceri & beneficii acordate", separată pe surse cu semantici diferite: reducerile *pe produse* și *beneficiile de personal* sunt deja reflectate în vânzările afișate (prețul produsului e redus); *ofertele automate* și *discountul manual pe notă* NU sunt — se scad abia la „Venit net EFECTIV".

**Pe unități**: în defalcarea „pe Locații/Branduri/Unități" din raport ai coloanele **FC real %** și **Reduceri %** — vezi dintr-o privire care unitate dă cele mai multe discounturi și unde food cost-ul real fuge de cel teoretic.

**La fabrici / producție B2B**: pe modul „Automat" cardul stă ascuns dacă nu există reduceri/atenții/beneficii (nu ocupă loc degeaba — costul complet e deja în „TOTAL COST BUNURI"). Dacă îl afișezi manual („Afișat mereu"), la o unitate fără semnal POS titlul devine **„COST REAL AL BUNURILOR"**, puntea de reduceri dispare și verdictele colorate HoReCa (28–40%) nu se mai aplică — pragurile relevante rămân cele din Setări P&L.

## P&L pentru FABRICI (producție / procesare carne) — rețeta completă

O fabrică nu se conduce cu P&L de restaurant. Ce trebuie configurat și înțeles:

1. **Template-ul potrivit**: „Fabrică / Producție" (generic) sau **„Procesare carne"** (abator/tranșare/mezeluri) — cu `applyThresholds=true` ca semaforul să reflecte benzile industriei (vezi mai sus). KPI-urile de producție (randament, rebut, cost/unitate, rotație stoc) vin cu template-ul.
2. **Venitul B2B la kg**: la produsele cântărite (carne, brânză — „catch-weight" vândute la kg), P&L-ul valorizează liniile EXACT ca factura: **kg reale cântărite la picking × preț/kg contractual al clientului** (prețul per client bate prețul global al produsului). La fel și costul mărfii — pe kg ieșite, nu pe bucăți teoretice. Dacă venitul B2B din P&L nu bate cu facturile, primul lucru de verificat: produsele au „vânzare la greutate" + preț/kg configurat, și picking-ul s-a făcut cu cântărire.
3. **Costul pe reper din tranșare**: la dezosare/tranșare, o materie primă (semicarcasă) devine mai multe repere cu valori diferite — costul fiecărui reper vine din **alocarea de cost a rețetei de tranșare** (procentele de alocare pe produsele rezultate). Dacă food cost-ul pe un reper arată absurd, verifică întâi randamentele tranșării și procentele de alocare, apoi prețurile.
4. **Transportul ca linie proprie**: la distribuție cu flotă frigorifică (3–5% din vânzări e tipic), creează o categorie P&L „Transport & Logistică" în OpEx și leagă contul/tipul de cheltuială de ea — altfel se pierde în „OpEx altele" și nu-l mai vezi.
5. **Amortizare / leasing / dobânzi explicite**: utilajele de frig și vehiculele se modelează pe categoriile non-operaționale/imobilizări, nu îngropate în OpEx generic.
6. **Retururi și refuzuri la livrare**: refuzurile din POD produc retur în stoc + storno pe factură — se văd în P&L ca venit corectat, nu se șterg. Navetele/paleții returnabili NU sunt venit — trăiesc în soldul de ambalaje per client.
7. **Marja pe client și pe canal**: `get_customer_pnl` (marja reală full-cost pe fiecare lanț/magazin — cine te ține în profit și cine te mănâncă) și `get_channel_pnl` (Supermarketuri vs Magazine proprii vs HoReCa). Pentru fabrici astea sunt rapoartele de pâine zilnică, alături de `get_product_pnl` (marja pe reper/SKU).
8. **Cardul „Cost REAL al bunurilor"**: la fabrici stă ascuns pe „Automat" dacă nu există reduceri/atenții — costul complet (pierderi, minusuri, COGS B2B) e deja în „TOTAL COST BUNURI". Îl poți porni manual — apare varianta neutră, fără verdictele HoReCa.

## P&L salvat (snapshot) + cheltuieli/venituri/angajați suplimentari

Din `/reports/pnl`, butonul **„Salvează P&L"** îngheață raportul pe perioada aleasă. Apare în **P&L-uri Salvate** (`/analytics/saved-pnl`); îl deschizi la `/analytics/saved-pnl/:id`. **Datele live rămân neatinse** — tot ce adaugi trăiește doar în snapshot și recalculează totalurile pe loc. Pe tab-uri poți adăuga:

- **Venituri suplimentare** — venit POS, pe verticală (hotel/B2B/online), alte venituri, sau venit liber „Extras".
- **Cheltuieli suplimentare** — pe un item OpEx existent (mărești), un **item nou** într-o categorie, pe subtip COGS, pe categorie de personal, sau cheltuială liberă.
- **Angajați** — adaugi un angajat manual (nume + cost), modifici costul unuia existent, sau îl scoți.
- **Evenimente manuale** — nume, dată, încasare, cost mâncare, cost personal, alte cheltuieli, TVA.
- **Override** pe practic orice linie (TVA colectat/deductibil, taxe, non-operațional, pe eveniment).
- **Lock cu parolă** — blochezi snapshot-ul (Blochează / Deblochează / Schimbă parola / Elimină blocarea).

Export PDF / Excel atât pentru raportul live cât și pentru snapshot.

## P&L pe produs, P&L pe livrari si P&L pe zile

**P&L pe produs/SKU** vine din raportul live `/reports/pnl` și este reconciliat cu P&L-ul total. Prin MCP, folosește `get_product_pnl(perioada, mode, limit, brandId?, locationId?)`. Explică-l managerial: venit net, cost direct, alocări de manoperă/overhead, profit net, produse pe pierdere, produse fără cost și concentrarea profitului. Când un produs apare roșu, verifică `warnings`, `methodology` și `data.config`: ponderea de alocare sau pragul poate fi setare de business, nu bug.

**P&L pe livrări** este un segment configurabil, salvat în setările organizației. Proprietarul alege brandul/locația de livrare, angajații a căror manoperă intră și regulile de cheltuieli (fix, procent din CA, 100% sau procent dintr-o categorie reală). Costurile de platformă vin automat din comenzile de pe platformele de livrare (Glovo/Wolt/Bolt/Tazz): comision, taxe delivery/service/small-order și promoții suportate de firmă. Nu dubla aceste costuri ca regulă manuală decât dacă utilizatorul știe că datele platformei lipsesc; `get_delivery_pnl` va avertiza când există reguli manuale care par comisioane de platformă. Workflow agent: `list_delivery_pnl_segments` → `get_delivery_pnl(configId|segmentName, perioada)` și citești `data.platformPnl` pentru profit contribuție, marjă, discounturi, comenzi nelegate și warninguri. Dacă nu există segment, poți rula ad-hoc cu `brandId`, dar acel calcul este doar venit minus marfă plus costuri de platformă legate; pentru manoperă și cheltuieli trebuie configurat segmentul în `/reports/pnl-livrari`.

**P&L pe zilele săptămânii** vine din raportul `/reports/pnl-zile` și folosește aceleași surse ca P&L-ul live, dar le descompune pe Luni–Duminică. Prin MCP, folosește `get_weekday_pnl(perioada, brandId?, locationId?)`. Pentru costuri fără zi naturală, configurează întâi regulile cu `configure_pnl_day_allocation` (ex. `utilities` proporțional cu încasările, `occupancy` egal calendaristic, `labor` pe ture) și adaugă costuri speciale cu `add_pnl_manual_day_expense` (ex. formație vineri, DJ sâmbătă). Explică mereu că `vanzari_in_timp(grupare:"zi_saptamana")` arată trafic/vânzări, iar `get_weekday_pnl` arată profit după costuri.

## Ce poate face asistentul prin conexiune (MCP) vs. ce se face în aplicație

**Prin conexiune (MCP) — citire și configurare P&L:**
- **Citire/explicare:** `get_pnl` (P&L complet cu semafor), `get_weekday_pnl` (profit pe zilele săptămânii), `get_product_pnl` (profit pe produs/SKU + pierderi + reconciliere), `list_delivery_pnl_segments` + `get_delivery_pnl` (profit pe livrări segmentate), `compare_pnl_periods` (perioade + profit bridge), `get_pnl_config` (cum e configurat), `list_pnl_kpis` (KPI live), `list_pnl_snapshots` / `get_pnl_snapshot`.
- **Configurare:** `apply_pnl_industry_template` (template de industrie — primul pas pt. client nou), `set_pnl_thresholds` (praguri semafor), `configure_pnl_display` (vizibilitatea cardului Food Cost REAL: auto/on/off + panourile de tag), `create_pnl_category`, `configure_pnl_revenue_grouping`, `configure_pnl_day_allocation` (reguli pentru P&L pe zile), `add_pnl_manual_day_expense` (costuri manuale pe zile).
- **Închidere de lună:** `create_pnl_snapshot` (îngheață raportul), `add_pnl_snapshot_adjustment` (adaugă o cheltuială/venit suplimentar pe snapshot).
- **Clasificarea (manela):** `create_product_type`, `update_product_type`, `update_product_type_accounts_per_unit` — leagă tipurile de produs la categorii (ce decide unde cad banii). Plus `raport_vanzari`, `analyze_food_costs`, `get_accounting_overview`, `execute_sql_query` (read-only).

**Ce rămâne în aplicație** (ghidează cu `gaseste_in_aplicatie` + deschide pagina dacă extensia Chrome e conectată): legarea fină tip-produs↔categorie cu bifare vizuală, mod avansat conturi↔categorie, configurarea vizuală a segmentelor de livrări (`/reports/pnl-livrari`), lock cu parolă pe snapshot, adăugarea de angajați manuali și evenimente în snapshot, export PDF/Excel. Dacă un tool nu există încă pe instanța clientului (server mai vechi), fă fallback la pagină.

## Întrebări frecvente

- **„O cheltuială apare la «Nealocate» în P&L"** — tipul de produs de pe acea factură nu e legat de nicio categorie P&L, sau contul nu e mapat. Repari în *Conturi pe Tip Produs* (legi tipul de categorie) sau în mod avansat legi contul de o categorie.
- **„Vânzarea unui produs cade pe secțiunea greșită"** — schimbă tipul de produs sau reasignează tipul la categoria corectă (tab Categorii P&L). E reversibil, nu pierzi date.
- **„De ce nu se schimbă cifrele din P&L-ul salvat?"** — snapshot-ul e înghețat intenționat; modifici doar prin ajustări manuale. Pentru date la zi folosește `/reports/pnl`.
- **„Vreau să adaug o cheltuială care nu e în sistem (ex. contabilul, o reparație plătită cash)"** — salvează P&L-ul lunii și adaugă-o ca *cheltuială suplimentară* pe categoria potrivită; profitul net se recalculează fără să atingi datele reale.
- **„Categoria «Venituri/Food cost pe Categorie Produs» nu e categoria mea de meniu"** — corect, acolo gruparea e pe **zona de stocare** a produsului, nu pe categoria de meniu; „Necategorizat" = produse fără zonă de stocare.
- **„Nu văd cardul Food Cost REAL"** — pe modul „Automat" apare doar când în perioada analizată există reduceri, atenții din partea casei sau beneficii de personal. Verifică setarea în *Setări → Setări P&L → tab Setări* (sau prin `get_pnl_config` → `afisare.trueFoodCostVisibility`; schimbi cu `configure_pnl_display`). Pe P&L-uri salvate mai vechi cardul nu apare deloc (snapshot-ul nu conține datele).
- **„De ce Food Cost REAL diferă de Food Cost clasic?"** — clasicul = doar costul materiei prime din vânzări ÷ vânzări nete. REALUL adaugă pierderile, mesele/beneficiile de personal, minusurile de inventar și din partea casei, și împarte la banii efectiv încasați (după oferte și discounturi pe notă). Diferența în puncte procentuale = exact cât „mănâncă" reducerile și consumul intern.
- **„Sunt fabrică — cardul ăsta îmi trebuie?"** — de regulă nu: fără reduceri POS, „Automat" îl ține ascuns, iar costul complet (pierderi, minusuri, COGS B2B) e deja în „TOTAL COST BUNURI". Îl poți porni manual dacă vrei puntea vizuală — devine „COST REAL AL BUNURILOR", fără verdictele HoReCa.
