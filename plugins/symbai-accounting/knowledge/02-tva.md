# TVA în România — ghid de lucru

> Snapshot orientativ. Cotele și regulile se schimbă — verifică MEREU la zi (ANAF, Codul Fiscal — Legea 227/2015) și pe datele reale ale firmei (`get_company`, `get_vat_summary`).

## Cote
- **21%** — cota standard.
- **11%** — cota redusă (alimente, medicamente, cărți, cazare, anumite servicii — lista exactă la zi în Codul Fiscal).
- **0% / scutit** — export, livrări intracomunitare scutite, anumite operațiuni scutite (cu/fără drept de deducere).
- ⚠ Cotele reduse vechi de **9% și 5% au fost eliminate din august 2025** (înlocuite de 11%). Pentru documente de după acea dată nu le folosi. Cotele sunt **dependente de data documentului** — respectă data documentului, nu data de azi.

- Excepție tranzitorie: 9% pentru anumite locuințe, numai cu atestare pe document în profilul D300 — nu e o cotă de catalog.

## Deducerea TVA la achiziții (cum o tratează Symbai)
- **TVA facturată ≠ TVA deductibilă.** Pe fiecare document de achiziție se alege deducerea: integrală, limitată (ex. 50% la anumite vehicule) sau fără deducere. Partea nedeductibilă intră în costul achiziției sau al cheltuielii, nu în 4426. La taxare inversă TVA colectată rămâne integrală chiar dacă deducerea e limitată.
- **Bon fiscal de la furnizor** (introdus ca „Bon fiscal”): e factură simplificată numai dacă are tipărit CUI-ul firmei și cel mult 100 € cu TVA, la cursul BNR din ziua bonului — doar atunci TVA se deduce. Bonul fără CUI, peste 100 € sau emis în altă țară se înregistrează cu TVA nedeductibilă. Plata se alege la postare: numerar din casierie sau plată reconciliată separat.
- **Transport/ambalaj facturat cu altă cotă decât marfa** (recepții din Symbai POS, cu transportul absorbit în marfă): costul se adaugă la marfă, dar fiecare componentă își păstrează baza și TVA-ul pe cota ei, inclusiv în declarații.

## Plătitor de TVA
- **Lunar** sau **trimestrial** — regimul TVA e setat pe firmă (vezi datele firmei cu `get_company`). Decontul = **D300**, termen uzual **25** ale lunii următoare perioadei.
- Sub plafonul de înregistrare → neplătitor (regim special de scutire) — verifică plafonul curent.

## Tipuri de operațiuni
- **TVA la încasare** (regim opțional, activat pe firmă): TVA devine exigibilă la încasare/plată, nu la facturare. Se folosește 4428 (neexigibilă) → 4427/4426 la încasare.
- **Taxare inversă** (reverse charge): pentru anumite bunuri/servicii între plătitori de TVA — furnizorul nu colectează, cumpărătorul aplică 4426 și 4427 simultan (nu se plătește efectiv).
- **Intracomunitar**: achiziții/livrări intra-UE — taxare inversă pe achiziții, raportare în **D390 (VIES)** și **D394** după caz. Necesită cod valid de TVA (VIES).
- **Import/export** extra-UE: TVA în vamă / scutire la export.

## Conturi TVA
- `4426` TVA deductibilă (la cumpărări) · `4427` TVA colectată (la vânzări) · `4428` TVA neexigibilă (la încasare) · `4423` TVA de plată · `4424` TVA de recuperat.
- Închidere lunară/trimestrială: `4427 = 4426` + diferența pe 4423 (de plată) sau 4424 (de recuperat).

## Declarații legate de TVA
- **D300** — decontul de TVA (lunar/trimestrial). Orientativ: `get_vat_summary` (colectată vs deductibilă din rulajul 4427/4426); calculul oficial: `preview_d300_official`. În ecranul D300 achizițiile apar separat ca **TVA facturată de furnizori**, **TVA deductibilă din achizițiile perioadei** și **regularizări fiscale**. Înainte de generare contabilul confirmă politicile de deducere ale documentelor perioadei (pro-rata 100%) și, pentru o recepție corectată după ce luna ei a fost declarată, alege valorile deja declarate și referința din registrul fiscal — programul calculează doar diferența rămasă (rândul de regularizare). Salvarea din nou a profilului cere reconfirmarea.
- **D394** — declarația informativă a livrărilor/achizițiilor pe teritoriul național (între plătitori RO).
- **D390 (VIES)** — recapitulativă pentru operațiuni intracomunitare.

## Cum lucrezi (asistent)
- Pentru „cât TVA am de plată luna asta?" → `get_vat_summary(year, month)` (colectată − deductibilă). Explică că e orientativ și se confirmă cu decontul oficial (`preview_d300_official` arată și ce blochează generarea).
- Nu confunda TVA de pe factura furnizorului cu TVA deductibilă: la deducere limitată sau la bon fără CUI, diferența e cost, nu eroare.
- Nu hardcoda cote: ia cota din produs/factură; respectă data documentului.
- Depunerea efectivă a decontului se face în aplicație/ANAF (acțiune oficială) — tu pregătești datele și verifici.
