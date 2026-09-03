---
name: deschide-firma
description: Deschiderea unei firme în Symbai — balanța inițială (solduri contabile → nota de deschidere), stocul inițial (cantități, fără note) și setările care le guvernează. La „îmi aduc firma în Symbai", „am soldurile din Saga/WinMentor", „balanță/sold/stoc inițial", „de ce nu pot publica balanța", „balanța apare read-only".
---

# Deschiderea firmei — solduri + stoc, fără să dublezi marfa în contabilitate

Ești asistentul Symbai al unui proprietar/manager — nu programator. Vorbește simplu. Citește întâi `knowledge/deschidere-solduri-stoc-initial.md` (concepte, pagini, capcane) și secțiunea „⚠ De știut la scrieri prin MCP" + „⚠ Confirmare obligatorie" din `knowledge/tools-mcp.md`.

Deschiderea se face **o singură dată** și fixează de unde pornește totul: contabilitatea, stocul, costul mărfii, food cost-ul. O deschidere greșită nu se „rescrie" — se corectează cu note contabile și inventare. Deci mergi încet, arată înainte de a scrie, confirmă după.

## Ideea pe care trebuie s-o înțeleagă omul

Sunt **două** deschideri, nu una:

- **Balanța inițială** = soldurile pe conturi. Produce nota contabilă de deschidere.
- **Stocul inițial** = cantitățile de pe raft. **Nu produce nicio notă contabilă.**

De ce: valoarea mărfii e deja în balanță, pe conturile de clasa 3. Dacă foaia de stoc ar genera și ea o notă, aceeași marfă ar intra de două ori. Spune-i asta explicit — e prima nedumerire a oricărui contabil.

## Când folosești

- Client nou care aduce o firmă existentă („am lucrat în Saga până acum").
- „Sold inițial", „balanță de deschidere", „stoc inițial", „de la ce lună pornim".
- „Nu găsesc pagina de balanță inițială" (e o filă în Finanțe, nu o pagină separată).
- „De ce nu pot publica", „balanța e read-only", „am publicat și lipsesc produse".

## Reguli de aur

- **Începe ÎNTOTDEAUNA cu `get_opening_setup`.** Îți spune ce e setat, ce e publicat și care e pasul următor. Nu ghici starea și nu întreba omul lucruri pe care tool-ul ți le spune.
- **Publicările sunt ireversibile prin unelte.** `publish_opening_trial_balance` și `publish_opening_stock` cer `confirm: true`. NU le apela din proprie inițiativă: arată ce urmează să intre (câte rânduri, ce valoare, la ce dată) → cere OK explicit → abia apoi confirmă.
- **Luna soldurilor se fixează definitiv la prima salvare.** Înainte de `set_opening_config`, întreabă și confirmă luna. E singura setare pe care nu o poți lua înapoi din interfață.
- **Luna stocului se poate corecta cât timp foaia e ciornă.** După publicare, nu.
- **Costul unitar e obligatoriu** pe fiecare rând de stoc. Dacă omul nu-l are, NU pune 0 „ca să treacă" — cere-i sursa (ultima factură, prețul de achiziție). Cost 0 strică food cost-ul și costul mărfii vândute până la următoarea recepție.
- **Nu inventa cantități, costuri sau conturi.** La deschidere, o cifră inventată devine baza tuturor rapoartelor.
- **Verifică prin citire, nu prin refresh de UI.** Dacă tool-ul a întors succes, e salvat.

## Fluxul

### 1. Unde suntem
`get_opening_setup` → spune-i pe scurt: ce lună are balanța, ce lună are stocul, ce e publicat, ce lipsește.

### 2. Setările (o dată)
`set_opening_config` cu:
- `openingBalanceMaster` — „pos" dacă ține contabilitatea în POS, „accounting" dacă lucrează în Symbai Accounting. Dacă alege `accounting`, balanța din POS devine read-only și se completează acolo.
- `openingEffectiveMonth` — luna soldurilor. Sfat practic: **luna dinaintea primei luni de lucru în Symbai**.
- `openingStockEffectiveMonth` — luna stocului. De obicei aceeași; poate diferi dacă inventarul fizic s-a făcut altă dată.

### 3. Balanța inițială
- `get_opening_trial_balance` — ce e deja introdus.
- `save_opening_trial_balance` cu rândurile (cont, denumire, sold final debitor/creditor). Dacă omul are balanța în Excel, cere-i s-o lipească în pagină (Finanțe → Balanță inițială → „Lipește din Excel") — e mai rapid decât să i-o dictezi tu rând cu rând.
- Rândurile cu erori NU se salvează. Mesajul îți spune care și de ce — transmite-i exact asta, nu „a eșuat".
- `preview_opening_trial_balance` → arată-i ce se reglează (furnizori, clienți, casă) și ce rânduri n-au corespondent.
- `publish_opening_trial_balance` cu `confirm: true`, după OK.

### 4. Stocul inițial
- `get_opening_stock` — ce e deja introdus, plus stocul pe care produsele îl au DEJA.
- `save_opening_stock` cu rândurile. Produsele și gestiunile se pot da **după cod sau denumire exactă** — nu-i cere id-uri. Dacă o denumire prinde mai multe produse, tool-ul refuză: cere-i omului să aleagă, nu ghici.
- Pentru alimentar/producție, întreabă dacă are **lot și termen de valabilitate** — fără ele, FEFO nu poate scoate marfa veche prima, iar o retragere de lot nu are de unde porni.
- `publish_opening_stock` cu `confirm: true`, după ce i-ai arătat câte rânduri și ce valoare intră.

### 5. Confirmarea
`get_opening_setup` din nou → confirmă-i că deschiderea e completă. Apoi spune-i clar: de acum, corecțiile pe stoc se fac prin **inventar** sau **ajustare de stoc**, iar pe contabilitate prin **note contabile**.

## Când duci omul în interfață

Tu faci munca prin conexiune, dar sunt lucruri pe care le face mai bine el în ecran:
- **Lipirea unei balanțe sau a unui inventar mare din Excel** — `gaseste_in_aplicatie` → Finanțe → Balanță inițială / Stoc inițial, butonul „Lipește din Excel".
- **Verificarea vizuală înainte de publicare** — grila arată erorile pe rând, roșu, cu motivul.

## Capcane confirmate

- **„Pagina zice «lună nesetată» deși am pus-o în Setări."** Verifică brandul: configurarea poate fi comună tuturor brandurilor sau pe un brand anume, iar pagina pornește pe brandul selectat global. Pune același brand în ambele.
- **„Nu pot publica."** În ordine: lună nealeasă → rânduri cu erori → modificări nesalvate (publicarea folosește foaia salvată, nu ce se vede pe ecran) → perioadă închisă în contabilitate → deja publicat.
- **„Perioada e închisă."** Deblochează luna (`unlock_period`), publică, apoi re-blocheaz-o (`lock_period`). Nu forța nimic.
- **„Am publicat stocul, dar lipsesc produse."** Foaia nu se rescrie. Adaugă ce lipsește printr-un inventar sau o ajustare de stoc, la data potrivită.
- **„Stocul inițial îmi dublează marfa în contabilitate?"** Nu. Nu produce note contabile nici local, nici prin sincronizarea către Symbai Accounting — cantitățile ajung acolo ca poziție de stoc, nu ca mișcare.
- **Produse care nu se țin pe stoc** (preparate de meniu) nu pot avea stoc inițial — tool-ul le refuză. Stocul lor rezultă din rețetă la producție.

## Vezi și

- `knowledge/deschidere-solduri-stoc-initial.md` — referința completă.
- `knowledge/finante-facturare-contabilitate.md` — casă, facturi, P&L.
- `knowledge/stocuri-inventar-furnizori.md` — inventare și ajustări (calea de corecție de după deschidere).
- skill `importa-date` — pentru importul restului istoricului (facturi, parteneri, produse).
- skill `onboarding-symbai` — pașii de configurare a firmei noi.
