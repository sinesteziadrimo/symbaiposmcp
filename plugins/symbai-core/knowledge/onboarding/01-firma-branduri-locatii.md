# Onboarding 01 — Firma, brandurile și locațiile

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final există: datele oficiale ale firmei (denumire legală, CUI, Reg. Com., adresă — completate automat din ANAF), cel puțin un **brand**, cel puțin o **locație** și legătura brand↔locație, plus cotele TVA ale țării. Aceasta e temelia: TOT ce urmează (gestiuni, meniuri, produse, personal, sală) se agață de un `brandId` și/sau `locationId` — fără faza asta, restul fazelor nu au de ce să se lege.

Modelul de date, pe scurt:
- **Firma** = entitatea juridică (SRL/SA). Una singură de regulă; apare pe bonuri, facturi, e-Factura.
- **Brandul** = identitatea comercială (nume de pe firmă/meniu, culoare, logo). O firmă poate avea mai multe branduri (ex. un restaurant + o cafenea).
- **Locația** = punctul fizic de lucru, cu adresă. Relația brand↔locație e many-to-many: un brand poate funcționa în mai multe locații, o locație poate găzdui mai multe branduri. **Un brand operează DOAR la locațiile la care e legat** — legătura nu e opțională.

În conversația cu utilizatorul (om de business): vorbește de „firmă", „brand", „locație", „conexiunea cu Symbai" — niciodată „MCP", „tool", „endpoint", „JSON".

## Permisiuni necesare pe token

- **`setari`** (Setări & Configurare) — obligatoriu: `create_brand`, `update_brand`, `create_location`, `update_location`, `link_brand_location`, `unlink_brand_location`, `update_company`.
- **`produse_meniu`** — doar dacă trebuie create manual cote TVA (`create_vat_rate`). De regulă NU e nevoie: `lookup_company_cui` creează automat cotele standard RO.
- `lookup_company_cui` și toate `list_*`/`get_config_status` sunt tool-uri de citire — disponibile mereu, fără module.

Fără modulul potrivit, tool-urile de scriere întorc „permisiune insuficientă" — modulele se bifează de utilizator în portalul Hub → Acces AI (pe token), nu din aplicația POS.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citiri automate (fă-le întâi, fără să anunți):**
1. `list_brands` — ce branduri există deja (id, nume).
2. `list_locations` — locațiile + asocierile lor: partea `branduri:` apare la FIECARE locație; `branduri:—` (liniuța) = locație fără niciun brand legat.
3. `list_vat_rates` — cotele TVA existente.
4. `get_config_status` cu `brandId` (cu un singur brand îl deduce singur, dar dă-l explicit) — include `company_data` („Date firmă CUI/Adresă"), `locations_count`, `vat_rates`.

**Întrebările MINIME (doar ce nu poți afla singur):**
- Dacă firma nu are date: *„Care e CUI-ul firmei?"* — atât; restul vine de la ANAF.
- Structura, o singură dată, dacă nu e evidentă: *„«X» și «Y» sunt concepte diferite cu meniu propriu (branduri) sau locații ale aceluiași restaurant?"* Respectă EXACT asocierile date de utilizator — nu rearanja.
- Adresele/orașele locațiilor, doar dacă nu le-a dat deja.
- Confirmă structura O DATĂ înainte de creare (e o decizie structurală), apoi acționează fără re-întrebări. Nu cere date opționale (logo, slogan, IBAN, program) — se completează ulterior.

## Pașii de execuție — tool-urile MCP exacte

**Pasul 0 — inventar.** Rulează citirile de mai sus. Dacă brandurile/locațiile menționate de utilizator EXISTĂ deja → nu recrea nimic, confirmă („Am găsit «Restaurantul Exemplu» în sistem") și sari la ce lipsește.

**Pasul 1 — CUI ÎNTÂI (regula de aur).** Înainte de a crea branduri/locații pentru o firmă nouă, obține CUI-ul și rulează:
```
lookup_company_cui(cui: "RO12345678")
```
Salvează AUTOMAT în setările firmei (denumire legală, Reg. Com., adresă), setează țara RO dacă lipsea și **creează automat cotele TVA RO** (21% Standard implicit, 11% Alimente, 0% Scutit). Întoarce și statutul de plătitor TVA + înscrierea în e-Factura — spune-i utilizatorului pe scurt ce ai găsit. Prin conexiune nu există o blocare tehnică a creării fără CUI, dar respectă ordinea: așa datele fiscale ies corecte din prima.

**Pasul 2 — branduri.** Pentru fiecare brand confirmat:
```
create_brand(name: "La Famiglia", color: "#06b6d4")
```
Doar `name` e obligatoriu. NU folosi denumirea legală ANAF ca nume de brand — brandul e numele comercial confirmat de utilizator. Idempotent: dacă există deja un brand cu același nume (case-insensitive), tool-ul întoarce brandul existent cu ID, fără duplicat.

**Pasul 3 — locații, cu legare din același apel.** Preferă `brandIds` direct în creare:
```
create_location(name: "Centru Vechi", brandIds: [12], address: "Str. Victoriei 42", city: "Timișoara", phone: "0722...")
```
Doar `name` e obligatoriu. Idempotent: dacă locația există deja (după nume), tool-ul o refolosește și adaugă DOAR legăturile de brand lipsă.

**Pasul 4 — legare/corecții brand↔locație.** Pentru asocieri ulterioare sau în masă:
```
link_brand_location(brandIds: [12, 13], locationIds: [5])
```
Acceptă și `brandId`/`locationId` singulare; cel puțin un brand și o locație sunt necesare. Perechile deja legate sunt raportate „deja asociate", nu duplicate. **Mutarea unui brand** la altă locație = `unlink_brand_location` de pe cea veche + `link_brand_location` pe cea nouă — altfel rămâne legat la ambele.

**Pasul 5 — completări date firmă (opțional).** Pentru ce nu vine de la ANAF:
```
update_company(brandId: 12, bankName: "BT", regCom: "J35/...")
```
`brandId` obligatoriu. Folosește-l doar pentru corecturi/completări — pentru datele de bază preferă `lookup_company_cui`.

**Pasul 6 — TVA.** Verifică `list_vat_rates`. Dacă lookup-ul a rulat, cotele RO există deja — nu mai crea nimic. Dacă lipsesc (sau firma nu e RO):
```
create_vat_rate(name: "TVA 11% Alimente", rate: 11)
```
`name` + `rate` obligatorii; `isDefault: true` pe cota standard. România: **0% Scutit, 11% Alimente, 21% Standard/Alcool (implicit)** — niciodată 5/9/19. Idempotent pe procent: o cotă cu același procent existent nu se duplică.

**După FIECARE scriere: confirmă printr-o CITIRE** (`list_brands`, `list_locations`, `list_vat_rates`), nu prin interfață. Aplicația are cache în browser — utilizatorul vede modificarea abia după refresh. Dacă tool-ul a întors succes, datele SUNT salvate: nu repeta scrierea, nu raporta bug.

## Ce se face DOAR din aplicație

- **Ștergerea unui brand sau a unei locații** — nu există tool-uri de ștergere prin conexiune (politică de siguranță). Ghidează: `gaseste_in_aplicatie(intrebare: "setări locații și branduri")` și lasă utilizatorul să șteargă din pagina de setări. Verifică apoi cu `list_brands`/`list_locations`.
- **Logo-ul brandului și pozele** — nu există upload de fișiere prin conexiune. `gaseste_in_aplicatie(intrebare: "setări brand logo")`; verifică ulterior cu `list_brands` (sau lasă-l pe mai târziu — nu blochează nimic).
- **Țara și moneda firmei** (pentru firme non-RO sau corecturi) — nu există parametri de țară/monedă pe tool-uri. `gaseste_in_aplicatie(intrebare: "date companie setări")`.
- **Programul de funcționare** (pe perechea brand × locație) — se setează din Setări, nu prin conexiune.

## Echivalentul în wizard-ul din aplicație

**Pasul 1 din wizard** (`/onboarding`, „Firma & Brand") acoperă exact această fază: panou informativ (firmă / branduri & locații) + chat cu agentul „Sym Setup". Entitățile create prin conexiune APAR în wizard (pasul citește direct brandurile/locațiile din sistem și afișează „Ai N branduri configurate"), iar butonul „Următorul pas" se deblochează când există minim **1 brand + 1 locație + 1 asociere** între ele. Atenție: **progresul wizard-ului (bifa de pas finalizat) NU se actualizează prin conexiune** — utilizatorul apasă singur „Următorul pas" în aplicație. Datele firmei NU sunt obligatorii pentru deblocarea pasului, dar fă-le oricum primele (regula CUI ÎNTÂI).

## Verificare la final

- [ ] `list_brands` — toate brandurile cerute există, fără duplicate.
- [ ] `list_locations` — toate locațiile există, fiecare cu partea `branduri:` corectă (nicio locație rămasă pe `branduri:—`, niciun brand legat unde nu trebuie).
- [ ] `list_vat_rates` — pentru RO: 0%, 11%, 21% prezente, 21% implicită.
- [ ] `get_config_status(brandId)` — `company_data` configurat (CUI/adresă), `locations_count` > 0, `vat_rates` > 0.
- [ ] Utilizatorul a confirmat că structura (care brand la care locație) e cea reală.

## Capcane

- **`lookup_company_cui` e clasificat „citire", dar SCRIE**: salvează datele firmei, setează țara RO dacă lipsea și creează cotele TVA. NU-l apela cu CUI-uri de probă/ghicite. Funcționează doar pentru firme din România (registrul ANAF).
- **Numele legal ANAF ≠ numele brandului.** „SC GASTRO INVEST SRL" e firma; brandul e „La Famiglia". Nu boteza branduri după denumirea juridică.
- **Idempotența e pe NUME (case-insensitive, fără spații marginale)** la `create_brand`/`create_location`. Dacă un apel pare să fi eșuat, verifică întâi cu `list_*` — NU recrea cu nume ușor diferit („Centru Vechi 2"), creezi duplicate reale.
- **IBAN prin `update_company`** — pe instalările la zi se salvează în contul bancar; pe instalări mai vechi parametrul `iban` poate fi ignorat în tăcere (la fel la `create_supplier`/`update_supplier`). Verifică printr-o citire după apel: dacă IBAN-ul lipsește, trimite utilizatorul în Setări → Date companie și poți raporta cu `trimite_ticket_symbai`.
- **Cote TVA**: dedupe pe procent, nu pe nume — nu poți avea două cote cu același procent. Ignoră exemplul vechi „19, 9, 5" din descrierea tool-ului: pentru RO cotele corecte sunt 0/11/21. Cotele sunt GLOBALE (fără brandId).
- **Brand fără locație legată = nefuncțional.** Wizard-ul îl marchează „⚠ Nu are nicio locație asociată încă", dar butonul „Următorul pas" cere doar minim O asociere în total — un AL DOILEA brand fără locație NU blochează continuarea, deci wizard-ul nu te prinde. După orice creare, verifică legăturile în `list_locations`.
- **Mutare brand = unlink + link.** Doar `link_brand_location` pe locația nouă lasă brandul legat și la cea veche.
- **`update_brand` ÎMBINĂ, nu înlocuiește**: `socialMedia`/`colors` se contopesc cu ce există — câmpurile netrimise rămân. Sigur pentru completări incrementale.
- **Interfața nu se actualizează instant** după scrieri prin conexiune — cache în browser. Confirmă prin citire; spune-i utilizatorului să dea refresh ca să vadă.
- **Ștergerile nu există prin conexiune** — nu promite utilizatorului că „șterg eu brandul"; ghidează-l în aplicație.
