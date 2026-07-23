# Acțiuni Automate — reguli «declanșator → efecte» (cu accent pe fabrici alimentare)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie`. Pagina principală: **Acțiuni Automate** (`/actions`).

## Pe scurt

O **acțiune automată** e o regulă simplă: *când se întâmplă X (declanșatorul), fă Y și Z (efectele)*. Platforma urmărește singură evenimentele — o comandă finalizată, un lot care expiră, o temperatură depășită, un utilaj oprit — și execută efectele configurate: notificări persistente către rolurile potrivite, blocarea unui lot în carantină, deschiderea unui incident HACCP sau a unei neconformități (NCR/CAPA), crearea unui draft de comandă către furnizor, task-uri pentru echipă.

Prin conexiunea MCP poți construi, testa și administra aceste reguli **conversațional**, fără să deschizi pagina: cataloagele sunt tool-uri, crearea validează totul, iar simularea îți arată dinainte dacă regula se potrivește.

## Fluxul recomandat prin conexiune (MCP)

1. **`list_automation_triggers`** — catalogul declanșatoarelor, cu eticheta în română, cum se declanșează (eveniment imediat vs verificare periodică), câmpurile de configurare cu default-uri și **variabilele `{{...}}`** pe care le poți folosi în mesajele efectelor.
2. **`list_automation_effects`** — catalogul efectelor, cu **comportamentul real** al fiecăruia (ce scrie în platformă, cine primește notificări, ce e destructiv, ce rămâne draft pentru confirmare umană).
3. **`create_automation_rule`** — creează regula. Validează declanșatorul, config-ul și efectele; **refuză combinațiile care ar produce bucle** și avertizează asupra celor redundante. Întoarce un rezumat în română: *«Când X [praguri] → Efect1 + Efect2 (cooldown N min)»*.
4. **`test_automation_rule`** — SIMULARE pe un context de probă (nimic nu se execută real): afli dacă regula s-ar declanșa și de ce ar fi sărită. Poți suprascrie contextul (ex. `{scrapPercent: 12}`).
5. **`list_automation_rules` / `get_automation_rule` / `list_automation_executions`** — ce reguli există (cu rezumat per regulă), detaliile uneia + ultimele execuții, jurnalul general.
6. **`update_automation_rule` / `delete_automation_rule`** — ajustare (inclusiv activare/dezactivare nedistructivă cu `active:false`) și ștergere (cere `confirm:true`).
7. **`request_automation_capability`** — plasa de siguranță FĂRĂ LIMITE: cererea care nu se poate construi azi pleacă automat ca tichet către echipa Symbai (vezi secțiunea dedicată mai jos).

> Pentru fluxul de lucru complet pas-cu-pas există și skill-ul **`creeaza-automatizare`** — se declanșează singur pe cereri de tip „vreau o automatizare / fă să mă anunțe când…".

### Și mai rapid: rețetele gata făcute

**`list_automation_recipes`** + **`apply_automation_recipe`** — pachete complete pentru fabrici, aplicabile într-un singur pas (cu protecție anti-duplicat pe nume și `configOverrides` pentru praguri):

- lot expirat → carantină + notificare · lot aproape de expirare → avertizare cu 3 zile înainte
- temperatură CCP depășită → incident HACCP + alertă critică
- utilaj oprit peste 30 min → andon + re-escaladare orară · defecțiune → mentenanță automată (utilajul iese din planificare)
- stoc sub minim → draft comandă furnizor + notificare
- randament sub plan → NCR · rebut peste prag → CAPA + escaladare șef tură
- OEE sub țintă → alertă supervisor · igienizare restantă → task urgent
- changeover cu alergeni → task de igienizare + alertă QA · QC eșuat → carantină + NCR · calibrare scadentă → work order

## Ce urmărește platforma la fabrică (categoriile de declanșatoare)

- **Loturi & valabilitate** — lot care expiră în X zile, lot expirat rămas în stoc, lot pus în carantină/blocat (pe orice cale), lot eliberat din QC, lot respins la recepția de la furnizor, FEFO ocolit manual de un operator.
- **HACCP & siguranță** — temperatură în afara limitelor (citiri manuale, senzori, asistent), incident HACCP deschis, igienizare restantă, acțiune corectivă (CAPA/NCR) cu termen depășit.
- **Utilaje & mentenanță** — utilaj oprit/blocat (inclusiv detectat automat din datele mașinii), oprire prelungită peste X minute, mașină care nu mai transmite date, OEE-ul zilei precedente sub țintă, calibrare scadentă, fereastră de mentenanță apropiată, cuvă/accesoriu ținut peste limita de siguranță alimentară.
- **Producție** — batch pornit/finalizat/anulat/întârziat, randament sub plan cu X%, cost real peste standard cu X%, rebut peste prag, inspecție QC eșuată, operație întârziată, stație supraîncărcată, semipreparate sub nivelul de siguranță, cerere de producție neplanificată la termen, lot de reprelucrare deschis, schimbare de produs cu risc de alergeni pe utilaj.
- **Stoc & recepție** — stoc sub minimul gestiunii (cu cantitate sugerată de reaprovizionare), dispută cu furnizorul, diferențe la livrare.

Plus toate declanșatoarele clasice de clienți/comenzi/QR/social/hotel — catalogul viu e `list_automation_triggers`.

## Ce pot face efectele (comportament real, nu doar etichete)

- **Notificări persistente** (clopoțel + push pe telefon) către roluri (manageri de producție, șef de tură, supervisori, roluri alese de tine) sau către un angajat anume; anunț către tot personalul; alertă andon.
- **Calitate**: blochează lotul în carantină (eliberarea rămâne exclusiv decizie QC), deschide NCR sau CAPA cu termen, deschide incident HACCP, construiește raport de trasabilitate (eșuează explicit dacă lanțul e incomplet — nu declară conformitate falsă).
- **Aprovizionare**: creează **DRAFT** de comandă către furnizor — un om o confirmă și o trimite; automatizarea nu angajează bani singură.
- **Utilaje**: programează mentenanță reală (utilajul iese din planificarea producției) + task + notificare; oprește o stație sau toată linia (destructiv — repornirea e manuală).
- **Operațional**: work order / task de curățenie / task generic, cu termen și responsabil.
- **Clienți**: email, notificare, reduceri, puncte — tot motorul clasic de marketing.

În mesaje folosești variabile din context: `{{productName}}`, `{{lotNumber}}`, `{{equipmentName}}`, `{{scrapPercent}}`, `{{yieldPercent}}`, `{{temperature}}` etc. — lista per declanșator e în catalog.

## Compoziții COMPLEXE — playbook (de aici vine puterea reală)

Motorul e mai expresiv decât pare: o regulă = declanșator + listă ORDONATĂ de efecte, fiecare efect cu propriile condiții, întârziere și prioritate. Cinci tipare acoperă aproape orice cerere complexă:

### 1. Efecte condiționate (o regulă, reacții pe niveluri)

Fiecare efect acceptă `conditions` (listă de `{field, operator, value}`) + `conditionLogic` (AND/OR). Operatorii: `equals, not_equals, contains, greater_than, less_than, greater_equal, less_equal, in, not_in, is_true, is_false, exists, not_exists`. Câmpurile = variabilele contextului declanșatorului (cele din catalog).

*Exemplu — rebut: notificare mereu, CAPA doar peste 10%, oprire linie doar peste 20%:*
```
create_automation_rule(
  name: "Rebut pe niveluri — ambalare",
  triggerType: "production_high_scrap_rate",
  triggerConfig: { scrapThresholdPercent: 5, operationName: "Ambalare" },
  effects: [
    { type: "notify_shift_supervisor", config: { message: "Rebut {{scrapPercent}}% la {{operationName}}" } },
    { type: "create_capa_action", config: { title: "CAPA rebut {{scrapPercent}}%", dueDays: 7 },
      conditions: [{ field: "scrapPercent", operator: "greater_than", value: 10 }] },
    { type: "pause_production_line", config: { reason: "Rebut {{scrapPercent}}% — Jidoka" },
      conditions: [{ field: "scrapPercent", operator: "greater_than", value: 20 }] }
  ])
```

### 2. Follow-up întârziat (`delayMinutes` / `delayDays` pe efect)

Efectul întârziat se PROGRAMEAZĂ (apare în «efecte programate», rulează singur la scadență). *Exemplu — incident HACCP: alertă acum, task de verificare a doua zi:*
```
effects: [
  { type: "notify_production_manager", config: { message: "🌡️ {{equipmentName}}: {{temperature}}°C" } },
  { type: "create_work_order", config: { title: "Verificare post-incident {{equipmentName}}", priority: "high" }, delayDays: 1 }
]
```

### 3. Scară de escaladare (mai multe reguli, praguri crescătoare)

Pentru „dacă nu se rezolvă, urcă": reguli SEPARATE pe același declanșator, cu praguri și cooldown-uri diferite. La declanșatoarele periodice, cooldown-ul = cât de des RE-alertează per entitate cât timp condiția persistă.

*Exemplu — utilaj oprit:*
- Regula 1 «nivel 1»: `equipment_downtime_exceeded` cu `minDelayMinutes: 30`, cooldown 0 (o dată/24h) → notify_shift_supervisor.
- Regula 2 «nivel 2»: `minDelayMinutes: 60`, cooldown 60 (re-alertă ORARĂ) → send_andon_alert + notify_production_manager.
- Regula 3 «nivel 3»: `minDelayMinutes: 120`, cooldown 240 → trigger_predictive_maintenance_workflow.

### 4. Lanț de reguli (`chain_automation`)

Efectul `chain_automation` (config: `{ruleId}`) evaluează ALTĂ regulă cu același context (max 5 în lanț, auto-referința e refuzată). Folosește-l pentru un „trunchi" comun (ex. orice problemă de calitate → regulă-hub care notifică QA) apelat din mai multe reguli specializate.

### 5. Țintire fină (scoping)

- `brandId` pe regulă → doar acel brand; fără = global.
- În triggerConfig: `productId`/`warehouseId` (loturi, stoc), `equipmentId` (utilaje), `recipeId` (producție), `area` (igienizare), `severity` (incidente).
- La sweeps, cooldown = pauza PER ENTITATE: lot A și lot B alertează independent.

### Combinarea tiparelor

Cererea „când expiră ceva în congelator, blochează, anunță-mă, iar dacă în 24h nu s-a rezolvat, escaladează la administrator" = 1 regulă (`lot_expired_in_stock` + `warehouseId` congelator + block + notify) + al doilea efect `notify_role(["admin"])` cu `delayDays: 1`. Aproape orice cerere se descompune în: eveniment → filtre → acțiuni imediate → acțiuni condiționate → acțiuni întârziate → (opțional) reguli-surori de escaladare.

## FĂRĂ LIMITE — ce nu se poate azi se escaladează cu tichet

Când cererea NU se acoperă nici cu tiparele de mai sus (declanșator sau efect inexistent):

1. **Niciodată «nu se poate»** către client și niciodată o regulă care doar mimează cererea.
2. Cheamă **`request_automation_capability`** (`request` = cererea în cuvintele clientului, `missingTrigger`/`missingEffect` = ce lipsește exact, `details` = praguri/produse/flux, `contactEmail` opțional). Tool-ul trimite un tichet structurat direct echipei Symbai (cu deduplicare — retrimiterea aceleiași cereri nu deschide alt tichet).
3. **Răspunde clientului cu mesajul întors de tool**: *„Am trimis cererea către echipa Symbai (referința X). Se rezolvă rapid — automatizarea va apărea în contul tău fără să mai faci nimic, iar când e activă o configurez imediat."*
4. **Construiește imediat partea POSIBILĂ** a cererii (măcar notificarea pe evenimentul cel mai apropiat) — clientul pleacă azi cu ceva funcțional.

## De știut (ca să nu te miri)

- **Cooldown-ul e per ENTITATE la verificările periodice**: un lot care expiră alertează o dată pe fereastra de cooldown (implicit 24h dacă lași 0), fără să sufoce alertele altor loturi. Pentru **re-escaladare** (ex. utilaj încă oprit), pune cooldown 60 → re-alertează orar cât timp condiția persistă.
- **Declanșatoarele pe verificare periodică** rulează la câteva minute (nu instant) — prima evaluare vine la următoarea rulare a monitorului. Cele pe eveniment sunt imediate.
- **Combinațiile absurde sunt refuzate la creare** (ex. «CAPA depășit → creează alt CAPA» ar produce CAPA-uri în lanț). Cele redundante primesc avertisment, dar sunt permise.
- **Regulile pot fi limitate la un brand** (`brandId`); fără brand se aplică peste tot.
- **Loturile deja aflate în carantină nu re-alertează** la expirare — sunt deja sub control.
- Tot ce fac regulile se vede în **jurnalul execuțiilor** (`list_automation_executions` sau pagina `/actions`), iar crearea/modificarea prin MCP intră în jurnalul de activitate al platformei.

## Exemple de cereri pe care le rezolvi direct

- „Blochează automat orice lot expirat și anunță-mă" → `apply_automation_recipe(recipeId: "lot-expirat-carantina")`.
- „Vreau să știu cu 5 zile înainte când expiră ceva în depozitul de congelate" → rețeta `lot-expira-curand` cu `configOverrides: {daysBeforeExpiry: 5, warehouseId: <id>}`.
- „Dacă rebutul trece de 8% pe ambalare, deschide CAPA și anunță șeful de tură" → `create_automation_rule` pe `production_high_scrap_rate` cu `{scrapThresholdPercent: 8, operationName: "Ambalare"}`.
- „De ce nu s-a declanșat regula mea?" → `test_automation_rule(id)` — vezi exact motivul (config nepotrivit vs cooldown), apoi `list_automation_executions(ruleId)`.
- „Oprește temporar toate automatizările de reaprovizionare" → `list_automation_rules(triggerType: "inventory_low_stock")` → `update_automation_rule(id, active: false)`.

## Legături

- Producția de fabrică (loturi, planificare, trasabilitate, QC): `productie-fabrica.md`
- HACCP (temperaturi, incidente, igienizare, retrageri): `haccp.md`
- Automatizările de clienți/CRM (playbook-uri, NBA, RFM): `crm-automatizari-playbooks.md`
- Stocuri, recepție, furnizori: `stocuri-inventar-furnizori.md`
