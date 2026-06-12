# Onboarding 05 — Metode de plată

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder).

## Scopul fazei

La final, instanța are metodele de plată active cu care POS-ul poate încasa: minim **Numerar** și o metodă de **Card**, plus opțional tichete de masă, plată la termen (pe firmă), transfer bancar (OP), protocol. Fără ele, ospătarul nu poate închide nicio notă. Faza e mică, dar e condiție pentru tot ce urmează operațional: încasări, închidere de zi, registru de casă. Integrarea terminalului **Viva Wallet** (plata cu cardul trimisă automat la terminal) e opțională și se face DOAR din aplicație.

În conversația cu utilizatorul (om de business): fără jargon — nu spune „endpoint", „seed", „flag", „MCP". Spune „butonul Configurare rapidă", „opțiunea Fiscal / Sertar din Setări POS", „conexiunea prin care lucrez eu".

## Permisiuni necesare pe token

- **`setari`** — pentru `create_payment_method`. Fără el, tool-ul întoarce „permisiune insuficientă"; se activează din portalul Hub → Acces AI (îi dai utilizatorului instrucțiunea, nu poți activa tu).
- Citirile (`list_entities`, `get_config_status`, `list_brands`) sunt mereu disponibile.

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Afli singur (fă-le mereu, în ordinea asta):**
1. `list_brands` — brandId (parametru obligatoriu peste tot mai jos).
2. `list_entities` cu `entityType: "payment_methods"` + `brandId` — ce metode există DEJA (multe instanțe au rulat „Configurarea rapidă" din wizard). Nu duplica nimic.
3. `get_config_status` cu `brandId` și `category: "pos_config"` — confirmă numărul de metode de plată și dacă există imprimante (bonul fiscal are nevoie de casă de marcat configurată — faza de echipamente).

**Întrebi utilizatorul (doar ce nu poți afla):**
- „Acceptați tichete de masă (Sodexo / Edenred / Up)?"
- „Lucrați cu firme — plată la termen cu factură emisă ulterior, sau prin transfer bancar (OP)?"
- „Aveți terminal de card Viva Wallet, sau un POS bancar clasic unde tastați suma manual?" — Viva = integrare opțională; POS bancar clasic = doar o metodă „Card" simplă.
- (opțional) „Vreți o metodă «Protocol» pentru mesele oferite de casă (degustări, teste)?"

Confirmă lista finală de metode cu utilizatorul ÎNAINTE de a scrie.

## Pașii de execuție — tool-urile MCP exacte

**Pasul 0 — alege calea potrivită.** Dacă NU există nicio metodă, calea recomandată e **„Configurare rapidă" din aplicație** (vezi secțiunea UI-only): creează dintr-un click setul standard — Numerar, Card Viva, Card BT, Termen, Firme (OP), plus Charge to Room (inactiv, doar hotel) — cu opțiunile fiscal/sertar/terminal CORECT setate. Legături de unitate NU creează nici ea — metodele apar la încasare prin regula „mod vechi" (vezi Capcane #2). Prin conexiune poți crea metode, dar NU le poți seta aceste opțiuni (vezi Capcane #1) — folosește tool-ul mai ales pentru metode SIMPLE în plus (ex. Tichete) sau când utilizatorul preferă să nu deschidă aplicația.

**Pasul 1 — creează metodele lipsă cu `create_payment_method`** (modul `setari`). Parametri reali: `name`* (string), `type`* (`cash` | `card` | `online` | `voucher` | `other`), `brandId`* (număr), `isActive` (boolean, opțional — implicit true).

```
create_payment_method({ name: "Numerar",  type: "cash",    brandId: 1 })
create_payment_method({ name: "Card BT",  type: "card",    brandId: 1 })
create_payment_method({ name: "Tichete",  type: "voucher", brandId: 1 })
create_payment_method({ name: "Termen",   type: "other",   brandId: 1 })
create_payment_method({ name: "Protocol", type: "other",   brandId: 1 })
```

- **Idempotență**: dacă există deja o metodă cu EXACT același nume, tool-ul întoarce „Metoda «X» există deja" + entitatea — e succes, nu eroare; nu reîncerca.
- **Codul intern** se derivă automat din nume (primele 10 caractere, litere mici, spațiile devin `_`): „Numerar"→`numerar`, „Card BT"→`card_bt`, „Tichete"→`tichete`. Folosește numele scurte standard de mai sus ca să iasă codurile standard.

**Pasul 2 — confirmă prin CITIRE**: `list_entities` cu `entityType: "payment_methods"` — verifică numele și `active: true`. NU verifica prin interfață: aplicația are cache în browser și arată datele noi abia după refresh. Dacă tool-ul de scriere a întors succes, datele SUNT salvate.

**Pasul 3 — trimite utilizatorul să regleze opțiunile per metodă** (UI-only, obligatoriu dacă ai creat prin conexiune):
- **Numerar** → bifează „Sertar" (deschidere automată sertar de bani) — prin conexiune iese fără.
- **Termen / OP / Protocol** → debifează „Fiscal" — prin conexiune ies FISCALE, ceea ce e greșit (la termen se emite factură ulterior, nu bon fiscal).
Ghidează-l cu `gaseste_in_aplicatie({ intrebare: "metode de plată" })`.

**Context fiscal de explicat utilizatorului (simplu):** Numerar, Card și Tichete emit **bon fiscal** la casă de marcat (cerință ANAF); doar Numerarul pune bani în sertar. „La termen" și OP nu emit bon — se printează nota, iar factura vine ulterior.

## Ce se face DOAR din aplicație

- **„Configurare rapidă"** (setul standard de metode) — butonul din pasul 9 al wizardului de onboarding, sau manual din Setări POS. După ce utilizatorul zice că a apăsat: verifică cu `list_entities` (`payment_methods`) că au apărut Numerar, Card Viva, Card BT, Termen, Firme (OP) — Charge to Room e normal să fie inactiv.
- **Opțiunile per metodă** (Fiscal, Sertar, Terminal/confirmare, ce se printează) — Setări POS. Nu există tool de scriere pentru ele. Verificare: întreabă utilizatorul; câmpurile apar și în datele întoarse de `list_entities` (`printFiscal`, `cashDrawer`, `requiresConfirmation`).
- **Vizibilitatea metodelor pe unitate (brand + locație)** — tot din Setări POS. Metodele create prin conexiune NU au legături de unitate (vezi Capcane #2).
- **Viva Wallet (terminal integrat)** — exclusiv din aplicație: Setări → Integrări, câmpurile Merchant ID, Client ID/Secret etc. din contul Viva al clientului. **Nu cere și nu primi credențialele în chat** — se introduc doar în aplicație. Ghidare: `gaseste_in_aplicatie({ intrebare: "integrare Viva Wallet" })`; în aplicație, asistentul Sym (butonul plutitor) are un ghid pas-cu-pas pentru Viva. Verificare: nu există tool de citire pentru integrare — utilizatorul confirmă vizual statusul „Viva Wallet este conectat" (pasul 9 din wizard, tabul Terminal Viva, sau Setări → Integrări). Tranzacțiile se văd ulterior în Finanțe → Control Viva.

## Echivalentul în wizard-ul din aplicație

**Pasul 9 din wizard** (`/onboarding`, „Metode de plată") — două taburi: *Metode de plată* (status curent + butonul „Configurare rapidă" + link spre Setări POS) și *Terminal Viva* (status integrare + link spre Setări → Integrări). Metodele create prin conexiune SUNT văzute de pas (statusul devine verde „N metode active"), dar **bifa de progres a wizardului NU se actualizează prin conexiune** — utilizatorul apasă singur „Următorul pas" în wizard.

## Verificare la final

- [ ] `list_entities` (`payment_methods`, brandId) → minim **Numerar + o metodă de card**, ambele `active: true`; plus ce a cerut utilizatorul (tichete/termen/protocol).
- [ ] `get_config_status` (brandId, `category: "pos_config"`) → „Metode de plată: N" cu N > 0.
- [ ] Dacă ai creat metode prin conexiune: utilizatorul confirmă că a reglat Fiscal/Sertar în Setări POS (Numerar cu sertar; termen/OP/protocol non-fiscale) și că metodele apar la încasare pe POS.
- [ ] Dacă vrea Viva: utilizatorul confirmă status verde la integrare; altfel notează că rămâne pe POS bancar clasic (perfect valid).

## Capcane

1. **Tool-ul NU salvează `type` și nici opțiunile fiscale.** `create_payment_method` persistă doar numele, codul, brandul și activ/inactiv; `type` e obligatoriu în schemă dar ignorat la salvare, iar opțiunile ies pe valorile implicite: **fiscal DA, sertar NU, terminal NU**. Consecințe reale: Numerar creat prin conexiune nu deschide sertarul; Termen/OP/Protocol ies fiscale (greșit legal). De-asta setul standard se face cel mai bine din „Configurare rapidă", iar orice metodă creată prin conexiune cere reglaj în Setări POS.
2. **Vizibilitate per unitate.** Metodele sunt globale și se leagă de unități (brand+locație). Dacă instanța are DEJA legături configurate (cineva a salvat vizibilitatea per unitate în Setări POS — „Configurarea rapidă" NU creează legături), o metodă nouă creată prin conexiune **nu apare la încasare** până nu e bifată pe unitate în Setări POS. Doar pe instanțe fără nicio legătură („mod vechi") toate metodele active apar peste tot. Dacă utilizatorul zice „am creat-o dar nu apare pe POS" — asta e prima cauză, nu un bug.
3. **Idempotență pe nume EXACT.** Re-apelul cu același nume e inofensiv (întoarce metoda existentă), dar „Card" vs „Card BT" creează două metode. Citește lista înainte și refolosește numele existente.
4. **Codul se taie la 10 caractere** din nume — „Tichete de Masă" dă codul trunchiat `tichete_de`. Preferă nume scurte („Tichete").
5. **„Configurarea rapidă" NU creează Tichete** — setul standard e Numerar, Card Viva, Card BT, Termen, Firme (OP) + Charge to Room (inactiv, doar hotel). Dacă clientul acceptă tichete de masă, adaugă metoda separat (prin tool e OK: implicit fiscală, fără sertar — corect pentru tichete).
6. **Bonul fiscal cere casă de marcat configurată** (faza de echipamente). Metoda de plată decide doar DACĂ se emite bon, nu și PE CE se emite. Dacă echipamentele nu-s gata, metodele pot fi create acum — bonul va funcționa când imprimanta fiscală e instalată.
7. **Cache-ul interfeței**: după orice scriere prin conexiune, wizardul/setările arată datele abia după refresh. Confirmă prin tool de citire; nu repeta scrierea, nu raporta bug — spune-i utilizatorului să dea refresh dacă nu le vede.
