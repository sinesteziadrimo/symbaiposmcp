# Deschiderea firmei: balanță inițială + stoc inițial

> Pentru link-ul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Când aduci o firmă care funcționează deja în Symbai, trebuie să-i spui de unde pornește. Sunt **două deschideri diferite**, care se fac separat și nu se suprapun:

- **Balanța inițială** — SOLDURILE contabile pe plan de conturi, la o lună aleasă (ex. 31.12.2025). Produce **nota contabilă de deschidere** și reglează automat soldurile de furnizor, de client și casa.
- **Stocul inițial** — CANTITĂȚILE fizice de pe raft, pe gestiuni, la o lună aleasă. **NU produce note contabile.**

Regula care explică totul: valoarea mărfii de pe raft e deja cuprinsă în balanță, pe conturile de clasa 3 (301, 371 etc.). Dacă foaia de stoc ar genera și ea o notă, aceeași marfă ar intra de două ori în contabilitate. De aceea stocul inițial pune doar cantitățile — ca FEFO, consumul, food cost-ul și costul mărfii vândute să aibă de unde porni.

## Unde se face

| Ce | Unde în aplicație | Ce scrie |
|---|---|---|
| Alegerea lunilor + cine ține balanța | **Setări → Contabilitate** (`/settings?tab=accounting`) | doar configurarea |
| Balanța inițială (conturi) | **Finanțe → Balanță inițială** (`/finance?tab=trial-balance`) | notă contabilă de deschidere + solduri furnizori/clienți/casă |
| Stocul inițial (cantități) | **Finanțe → Stoc inițial** (`/finance?tab=opening-stock`) | documente de deschidere pe gestiuni + loturi; **fără note contabile** |
| Soldurile operaționale, separat | **Finanțe → Solduri inițiale** (`/finance?tab=opening-balances`) | soldurile per furnizor/client/casă (de obicei se derivă singure din balanță) |

Din Setări → Contabilitate există butoane care duc direct la ambele pagini — nu trebuie să le cauți prin meniu.

## Cele trei setări (Setări → Contabilitate)

1. **Unde se introduce balanța inițială** — „În POS" sau „În Symbai Accounting". Se completează într-un singur loc; unde nu e masterul, balanța apare read-only și se actualizează automat din partea care o deține.
2. **Luna soldurilor inițiale** — luna la care se referă balanța. Nota de deschidere se datează în **prima zi** a ei. ⚠ **Se fixează definitiv la prima salvare** — mută un cutoff istoric, deci o corecție cere reconciliere controlată, nu o rescriere din setări.
3. **Luna stocului inițial** — luna la care se așază cantitățile fizice. Documentele de deschidere se datează tot în prima zi a ei. Se poate **corecta cât timp foaia e ciornă**; se blochează la publicare. Poate fi diferită de luna soldurilor.

Amândouă lunile trebuie să fie trecute sau luna curentă — o deschidere descrie o stare care a existat deja.

## Cum decurge, pas cu pas

1. **Alegi lunile** în Setări → Contabilitate și decizi unde ții balanța (POS sau Accounting).
2. **Completezi balanța inițială**: cont, denumire, sold final debitor/creditor. Se poate lipi direct din Excel (inclusiv din Saga/WinMentor). Salvezi ca ciornă de câte ori vrei.
3. **Previzualizezi** ce s-ar regla: ce solduri de furnizor, client și casă se scriu, ce rânduri nu au corespondent și unde s-ar suprascrie un sold pus manual.
4. **Publici balanța** — se scrie nota de deschidere și se fixează luna. De aici încolo corecțiile se fac prin note contabile.
5. **Completezi stocul inițial**: produs, gestiune, cantitate, **cost unitar**, opțional lot furnizor și termen de valabilitate. Se poate lipi din Excel (cod sau denumire exactă + cantitate + cost).
6. **Publici stocul** — marfa intră fizic pe gestiuni și pe loturi, cu documente datate în prima zi a lunii alese. **Nu se generează nicio notă contabilă.**

## Ce trebuie să știi înainte

- **Costul unitar e obligatoriu** pe fiecare rând de stoc. Lăsat gol, marfa ar intra la cost 0 și ar strica food cost-ul, costul mărfii vândute și P&L-ul. Dacă marfa chiar nu are valoare, scrie explicit 0.
- **Stocul inițial se ADAUGĂ** ca intrare de deschidere. Ecranul îți arată, pe fiecare rând, dacă produsul are deja stoc în gestiunea aleasă.
- **Se publică o singură dată** per brand. După publicare, corecțiile se fac prin **inventar** sau prin **ajustări de stoc**, nu prin rescrierea foii.
- **Doar produse care se țin pe stoc.** Un preparat de meniu (care se produce din rețetă) nu are stoc inițial — ar primi cantități pe care restul sistemului le ignoră.
- **Perioada închisă blochează publicarea.** Dacă luna e închisă în contabilitate, deblochează întâi perioada, apoi publică.
- **Lotul și termenul de valabilitate sunt opționale, dar valoroase** la producție și în alimentar: fără ele FEFO nu are după ce să scoată marfa veche prima, iar o retragere de lot nu are de unde porni.
- **Numerele se scriu fără separator de mii.** „1.200" e citit ca 1,2 — scrie 1200.

## Prin conexiune (MCP), fără să intri în ecrane

Tot ce se poate seta din față se poate face și prin conversație. Ordinea firească:

| Vrei să… | Tool |
|---|---|
| vezi unde ești cu deschiderea și ce mai ai de făcut | `get_opening_setup` |
| alegi lunile / cine ține balanța | `set_opening_config` |
| vezi balanța introdusă | `get_opening_trial_balance` |
| introduci/actualizezi conturile | `save_opening_trial_balance` |
| vezi ce s-ar regla la publicare | `preview_opening_trial_balance` |
| publici balanța | `publish_opening_trial_balance` 🔒 |
| vezi foaia de stoc | `get_opening_stock` |
| introduci cantitățile | `save_opening_stock` |
| publici stocul | `publish_opening_stock` 🔒 |

`get_opening_setup` e punctul de intrare: îți spune ce e setat, ce e publicat și care e pasul următor.

La stoc, produsele și gestiunile se pot da **după cod sau după denumirea exactă** — nu trebuie să știi id-uri. Dacă denumirea prinde mai multe produse, tool-ul refuză și cere id-ul, în loc să ghicească: o deschidere pusă pe produsul greșit se repară doar cu inventar.

Cele două publicări cer `confirm: true` și **nu se apelează niciodată din proprie inițiativă** — arată-i omului ce cantități și ce valoare urmează să intre, cere OK, abia apoi confirmă.

Permisiuni pe token: configurarea și balanța cer modulul **`financiar`**; foaia de stoc cere **`inventar`** (efectul ei real e pe gestiuni și loturi, ca la orice intrare de marfă).

## Întrebări frecvente

**„Nu găsesc pagina de balanță inițială."** E o filă în Finanțe, nu o pagină separată: Finanțe → Balanță inițială. Din Setări → Contabilitate ai un buton direct.

**„Am pus luna în Setări și pagina zice «nesetată»."** Verifică dacă ești pe brandul corect — configurarea poate fi comună tuturor brandurilor sau pe un brand anume. Selectorul de brand din pagină trebuie să arate același brand.

**„De ce nu pot publica?"** Cele mai frecvente motive, în ordine: luna nu e aleasă; există rânduri cu erori (le vezi roșii, cu motivul pe rând); ai modificări nesalvate (publicarea folosește foaia salvată); perioada e închisă în contabilitate; foaia e deja publicată.

**„Am publicat stocul și lipsesc produse."** Nu se rescrie foaia. Adaugi ce lipsește printr-un inventar sau printr-o ajustare de stoc, la data potrivită.

**„Balanța apare read-only."** Înseamnă că e ținută în Symbai Accounting. Ori o completezi acolo, ori schimbi masterul din Setări → Contabilitate.

**„Stocul inițial îmi strică contabilitatea?"** Nu. Nu produce nicio notă contabilă, nici local, nici prin sincronizarea către Symbai Accounting — cantitățile ajung acolo ca poziție de stoc, nu ca mișcare de marfă.

## Vezi și

- `knowledge/finante-facturare-contabilitate.md` — registrul de casă, facturi, P&L, import contabil.
- `knowledge/stocuri-inventar-furnizori.md` — inventare, ajustări, gestiuni.
- `knowledge/setari-administrare.md` — restul setărilor și integrarea cu contabilitatea.
- `knowledge/tools-mcp.md` — catalogul complet de tool-uri și regulile de scriere prin conexiune.
