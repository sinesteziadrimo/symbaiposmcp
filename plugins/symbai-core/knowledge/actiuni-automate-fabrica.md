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
