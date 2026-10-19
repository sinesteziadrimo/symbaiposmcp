---
name: creeaza-automatizare
description: Construiește orice automatizare declanșator → efecte (condiții, întârzieri, escaladări, lanțuri) pentru restaurant, hotel, magazin și fabrică (loturi, expirări, HACCP, utilaje, stoc minim); ce nu se poate → ticket automat. La „vreau o automatizare", „anunță-mă când…", „când expiră un lot…", „de ce nu s-a declanșat regula", „ce automatizări am".
---

# Automatizări fără limite — declanșator → efecte, prin conexiune (MCP)

Userul vrea ca platforma să reacționeze SINGURĂ la ce se întâmplă în business. Tu construiești regulile prin tool-urile MCP — catalogul e sursa de adevăr, crearea validează tot, simularea confirmă înainte de activare. **Regula de aur: clientul nu aude niciodată «nu se poate». Ori compui din ce există, ori trimiți tichet cu `request_automation_capability` și îi spui că se rezolvă rapid.**

## Înainte de orice

1. Citește **`knowledge/actiuni-automate-fabrica.md`** — conceptele, categoriile de declanșatoare, comportamentul REAL al efectelor, tiparele de compoziție complexă și capcanele. La fabrică citește și `knowledge/productie-fabrica.md` + `knowledge/haccp.md` pentru context de domeniu.
2. **Cataloagele sunt vii** — nu ghici din memorie: `list_automation_triggers` (declanșatoare + config + variabile `{{...}}`) și `list_automation_effects` (ce face REAL fiecare efect, ce e destructiv, ce rămâne draft). Rulează-le la începutul oricărei sesiuni de automatizări.
3. **Verifică ce există deja**: `list_automation_rules` — poate regula cerută există (o ajustezi cu `update_automation_rule`) sau există o rețetă gata făcută (`list_automation_recipes` → `apply_automation_recipe`, cu `configOverrides` pentru praguri).

## Fluxul standard (orice cerere)

1. **Tradu cererea** în: eveniment (declanșator) + praguri (triggerConfig) + acțiuni (efecte) + ritm (cooldown).
   **Eveniment, nu interval.** „Anunță-mă când apare X / după raportul Z / la un retur” se face cu declanșatorul evenimentului și un efect de notificare. Verifici în `list_automation_triggers`, de ex. `daily_report_ready` cu `reportType: "Z"`, `refund_processed`, `high_value_void`, `cash_drawer_over_short`. Nu crea pentru asta o sarcină de asistent care verifică la câteva minute. Dacă evenimentul lipsește → `request_automation_capability` și, până atunci, o verificare rară la ore fixe. Pentru o cerere de aprobare care stă și pentru rezumatul de după Z (oprire după trimitere, fără rulări goale), vezi [Cereri care stau și rezumatul de după Z](../gestioneaza-asistentii/SKILL.md#cereri-care-stau-și-rezumatul-de-după-z).
2. **Alege din catalog** declanșatorul + efectele. Rețetă potrivită? → `apply_automation_recipe` (mai rapid și testat).
3. **Creează**: `create_automation_rule` — primești rezumatul în română («Când X → Y, Z») + avertismente. Combinațiile care ar produce bucle sunt REFUZATE de server (nu insista — recompune).
4. **Testează**: `test_automation_rule(id)` — simulare fără efecte reale; îți spune dacă s-ar declanșa și de ce nu (config nepotrivit vs cooldown). Ajustează până se potrivește.
5. **Confirmă clientului** cu rezumatul + unde vede regula (pagina `/actions`) + cum o oprește (îi poți spune că o dezactivezi oricând cu un mesaj).
6. **La „de ce nu a mers?"**: `test_automation_rule` + `list_automation_executions(ruleId)` — vezi execuțiile reale, efectele rulate și erorile.

## Sarcină pe calculatorul omului (Symbai Connect)

Când cererea nu e o regulă a platformei, ci o verificare făcută de Codex sau Claude Code pe calculatorul omului (emailuri, un raport, „anunță-mă când X e gata”), folosești sarcinile Connect: [Programare în Symbai Connect](../../knowledge/emailuri-si-sarcini-personale.md#programare-în-symbai-connect-pentru-codex-sau-claude-code). Pe Connect 1.2.106 sau mai nou (Windows):

- mai multe ore pe zi într-o singură sarcină: `schedule.times`; verificări doar ziua: `everyMinutes` cu `schedule.activeWindow`; cât de târziu mai poate porni o rulare reluată: `schedule.catchUpMinutes`;
- `model` și `effort` pe fiecare sarcină; pentru verificări repetate ajunge de obicei un model mai ieftin;
- „anunță-mă când X e gata”: rularea care a trimis anunțul întoarce `finished:true`, iar Connect pune sarcina pe pauză;
- după o cădere de internet sau limita contului, Connect reia singur rularea și îl anunță pe proprietar pe WhatsApp la pauză sau la o așteptare lungă. Nu crea sarcini-paznic care verifică alte sarcini.

„Amintește-mi la…”, „dacă nu răspunde în 30 de minute…” și „spune-mi când citește” nu sunt sarcini: sunt [memento-urile Connect](../../knowledge/monitorizare-whatsapp.md#proprietarul-rulări-la-cerere-probe-și-memento-uri).

## Chestii complexe — compune liber (tiparele complete în knowledge)

- **Efecte condiționate** — o singură regulă, reacții diferite pe severitate: fiecare efect are `conditions` pe câmpurile contextului (`scrapPercent`, `daysToExpiry`, `oeePercent`…) + `conditionLogic` AND/OR. Ex: notificare mereu, dar oprirea liniei DOAR dacă `scrapPercent greater_than 15`.
- **Follow-up întârziat** — `delayMinutes`/`delayDays` pe efect: „trimite reminder după 2 ore", „a doua zi creează task de verificare".
- **Scară de escaladare** — MAI MULTE reguli pe același declanșator, cu praguri crescătoare și cooldown-uri diferite: 30 min → notificare șef tură; 60 min → andon + manageri (cooldown 60 = re-alertă orară); 120 min → mentenanță + oprire. Numește-le clar («Escaladare oprire — nivel 1/2/3»).
- **Lanț de reguli** — efectul `chain_automation` evaluează altă regulă cu același context (max 5, anti-buclă). Bun pentru un „trunchi" comun + ramuri specializate.
- **Scoping** — `brandId` pe regulă (doar un brand), filtre pe produs/gestiune/utilaj în triggerConfig; `cooldownMinutes` la declanșatoarele periodice = pauza PER ENTITATE (per lot/utilaj/produs; 0 = 24h implicit).

## FĂRĂ LIMITE — escaladarea cu tichet (obligatoriu când nu se poate)

Dacă după cataloage + tipare compunerea chiar nu acoperă cererea (declanșator inexistent — ex. „când postează concurentul pe Facebook"; efect inexistent — ex. „sună-l pe furnizor la telefon"):

1. **NU spune «nu se poate»** și NU improviza o regulă care doar mimează cererea.
2. Cheamă **`request_automation_capability`** cu: `request` (cererea în cuvintele clientului), `missingTrigger`/`missingEffect` (ce lipsește exact), `details` (praguri, produse, flux), `contactEmail` dacă îl ai.
3. **Transmite clientului mesajul întors de tool** — conține referința tichetului și formularea: *„Am trimis cererea către echipa Symbai (referința X). Se rezolvă rapid — automatizarea va apărea în contul tău fără să mai faci nimic, iar când e activă o configurez imediat."*
4. **Construiește ACUM partea posibilă** din cerere (aproape întotdeauna există una — măcar notificarea pe evenimentul cel mai apropiat), ca clientul să plece cu ceva funcțional azi.

## Capcane (detalii în knowledge)

- Efectele de aprovizionare creează **DRAFT** de comandă — un om confirmă; spune-i clientului explicit.
- `pause_production_line`/`pause_production_station` sunt **destructive** (repornire manuală) — confirmă cu clientul înainte să le pui în reguli.
- Carantina pe loturi se **eliberează doar prin decizia QC**, nu automat.
- Declanșatoarele «verificare periodică» nu sunt instant — prima evaluare la următoarea rulare a monitorului (minute).
- Gravitățile se potrivesc EXACT (nu «cel puțin») — pentru praguri pe niveluri, câte o regulă per nivel sau condiții pe efecte.
- După creare NU declara „gata" fără `test_automation_rule` — simularea e dovada.
