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

## Pagina „Setări P&L" — cele 4 tab-uri

### 1. Template-uri industrie
Un singur click aplică un set complet de KPI-uri + grupări de venituri optimizat pe tipul de business: **restaurant/bar, hotel, spa/parc, fabrică, magazin, e-commerce, servicii**. E **idempotent** — ce există deja nu se dublează. Recomandarea apare automat dacă ai setat domeniile de activitate în *Setări → General*. **Ăsta e primul pas pentru un client nou.**

### 2. Categorii P&L
Secțiunile mari ale raportului (Venituri, Alte venituri, COGS, Personal, și OpEx pe sub-tipuri: direct operațional, chirii, utilități, marketing, administrativ, mentenanță, asigurări, personal indirect, altele, plus Non-operațional și Taxe/TVA).
- Poți crea categorii și **subcategorii** (ierarhie pe un nivel), le reordonezi, le dai culoare.
- Pe fiecare categorie apeși butonul cu eticheta și **bifezi ce tipuri de produs intră în ea** — asta e legătura care decide ce vede clientul. *Un tip de produs aparține unei singure categorii.*
- **Mod avansat** (comutator sus): pe lângă tipurile de produs poți lega **conturi contabile** direct (clasa 6 = cheltuieli, 7 = venituri), fiecare marcat ca venit sau cheltuială — util ca facturile să cadă pe linia OpEx corectă.

### 3. Grupări venituri
Sub-secțiunile pliabile care apar la „1. VENITURI": pe **Canal, Metodă de plată, Tip comandă, Ospătar, Brand, Locație, Interval orar, Categorie produs** etc. Le activezi/dezactivezi, le reordonezi, le dai etichete frumoase (`valoare_din_sistem = etichetă afișată`) și pot avea **auto-ascundere** când filtrezi deja pe brand/locație (ca să nu fie redundante).
Inspirație: bar → adaugi Interval orar + Tip produs; lanț → adaugi Brand + Locație; delivery → adaugi Canal livrare.

### 4. Setări (praguri + panouri tag)
- **Pragurile semafor** (verde/galben/roșu) pentru food cost, personal, **prime cost**, OPEX și marjă netă. Valorile pornesc de la nivelurile recomandate HoReCa România (food cost 28–32%, prime cost ≤60%, marjă netă ≥10%).
- Comutatoarele „Defalcare după Tag" (Vânzări / COGS) care adaugă panouri pe tag-uri în raportul detaliat.

### Tab-ul KPI (pagina `/reports/pnl-kpi`)
KPI-uri editabile cu **constructor de formulă**: agregare (sumă/medie/min/max), numărare, sau raport A÷B × multiplicator, cu filtre. Setezi praguri și direcția trendului, și **previzualizezi** valoarea înainte să salvezi. Sistemul are și ~14 indicatori „wow" gata făcuți (ADR/RevPAR/GOPPAR la hotel, GMROI/rotație stoc la retail, ROAS la marketing, prime cost, menu engineering, profit pe scaun, no-show etc.) — vin cu template-ul de industrie.

## Cum configurez P&L-ul „exact cum vrea clientul" — rețeta

1. Setez domeniile de business (*Setări → General*).
2. **Aplic template-ul de industrie** (tab Template-uri) → KPI + grupări gata.
3. Mă asigur că **fiecare tip de produs e pe categoria P&L corectă** (asta schimbă efectiv ce vede clientul în raport).
4. În mod avansat, **leg conturile OpEx** de categorii, ca facturile de chirie/utilități/marketing să cadă pe linia bună.
5. Setez **pragurile** după așteptările lui.
6. Adaug grupări/KPI personalizate la dorință.
7. (opțional) salvez un P&L de referință și-i adaug cheltuielile din afara sistemului.

## P&L salvat (snapshot) + cheltuieli/venituri/angajați suplimentari

Din `/reports/pnl`, butonul **„Salvează P&L"** îngheață raportul pe perioada aleasă. Apare în **P&L-uri Salvate** (`/analytics/saved-pnl`); îl deschizi la `/analytics/saved-pnl/:id`. **Datele live rămân neatinse** — tot ce adaugi trăiește doar în snapshot și recalculează totalurile pe loc. Pe tab-uri poți adăuga:

- **Venituri suplimentare** — venit POS, pe verticală (hotel/B2B/online), alte venituri, sau venit liber „Extras".
- **Cheltuieli suplimentare** — pe un item OpEx existent (mărești), un **item nou** într-o categorie, pe subtip COGS, pe categorie de personal, sau cheltuială liberă.
- **Angajați** — adaugi un angajat manual (nume + cost), modifici costul unuia existent, sau îl scoți.
- **Evenimente manuale** — nume, dată, încasare, cost mâncare, cost personal, alte cheltuieli, TVA.
- **Override** pe practic orice linie (TVA colectat/deductibil, taxe, non-operațional, pe eveniment).
- **Lock cu parolă** — blochezi snapshot-ul (Blochează / Deblochează / Schimbă parola / Elimină blocarea).

Export PDF / Excel atât pentru raportul live cât și pentru snapshot.

## Ce poate face asistentul prin conexiune (MCP) vs. ce se face în aplicație

**Important — fii sincer cu clientul:**
- **Configurarea P&L** (categorii, grupări, praguri, KPI, template-uri) și **P&L-ul salvat + ajustările** se fac **în aplicație** (te ghidez pas cu pas și-ți dau linkul cu `gaseste_in_aplicatie`). Nu există tool MCP dedicat pentru ele.
- Prin conexiune **POT** regla *manela*: **tipurile de produs și conturile lor** (`create_product_type`, `update_product_type`, `update_product_type_accounts_per_unit`) — exact ce decide clasificarea în P&L — și pot **citi/calcula** date: `raport_vanzari`, `top_produse`, `analyze_food_costs`, `get_accounting_overview`, `get_end_of_day_report`, plus `execute_sql_query` (doar citire) pentru analize punctuale.

## Întrebări frecvente

- **„O cheltuială apare la «Nealocate» în P&L"** — tipul de produs de pe acea factură nu e legat de nicio categorie P&L, sau contul nu e mapat. Repari în *Conturi pe Tip Produs* (legi tipul de categorie) sau în mod avansat legi contul de o categorie.
- **„Vânzarea unui produs cade pe secțiunea greșită"** — schimbă tipul de produs sau reasignează tipul la categoria corectă (tab Categorii P&L). E reversibil, nu pierzi date.
- **„De ce nu se schimbă cifrele din P&L-ul salvat?"** — snapshot-ul e înghețat intenționat; modifici doar prin ajustări manuale. Pentru date la zi folosește `/reports/pnl`.
- **„Vreau să adaug o cheltuială care nu e în sistem (ex. contabilul, o reparație plătită cash)"** — salvează P&L-ul lunii și adaugă-o ca *cheltuială suplimentară* pe categoria potrivită; profitul net se recalculează fără să atingi datele reale.
- **„Categoria «Venituri/Food cost pe Categorie Produs» nu e categoria mea de meniu"** — corect, acolo gruparea e pe **zona de stocare** a produsului, nu pe categoria de meniu; „Necategorizat" = produse fără zonă de stocare.
