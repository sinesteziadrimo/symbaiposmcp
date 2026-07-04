---
name: investigheaza-printare
description: Investighează problemele de printare și casă fiscală cerând SINGUR logurile de la Print Agent și Edge Server, fără să ceri userului să descarce ceva din aplicație. Folosește la „bonul s-a dublat / s-a printat de două ori", „nu iese bonul / bon neprintat", „de ce nu se printează la bucătărie", „casa fiscală e blocată / nu răspunde", „de ce a picat serverul local / edge", „verifică imprimanta X", „ce s-a întâmplat cu bonul comenzii Y". Citește logurile, înțelege exact ce s-a întâmplat și explică-i userului în cuvinte simple.
---

# Investighează o problemă de printare / casă fiscală

Scop: afli EXACT ce s-a întâmplat cu o imprimantă, o casă fiscală sau un bon — cerând logurile reale de la Print Agent (PA) și de la Edge Server, citindu-le filtrat și explicând clar. Lucrezi ca un tehnician: pornești de la dovezi (loguri + joburi de printare), nu de la presupuneri.

## Pasul 0 — Localizează imprimanta și PC-ul

- `list_printers(locationId?)` — vezi imprimantele (bon/fiscal/etichetă), starea lor și pe ce PC sunt.
- `list_pos_devices(locationId?)` — vezi PC-urile (deviceId), care e serverul local (edge), starea Print Agent (online/offline) și versiunea edge. **deviceId** de aici îți trebuie ca să ceri logurile.

## Pasul 1 — Vezi povestea bonului/comenzii (dacă e despre un bon anume)

- `get_order_timeline(orderId)` — ce s-a comandat, dacă s-a trimis la bucătărie, ce plăți, dacă s-a tipărit fiscal.
- `get_order_payments(orderId)` — fiecare plată + dacă are bon fiscal tipărit.
- Dacă ai acces SQL pe token: `execute_sql_query` (doar SELECT) pe tabelele de joburi de printare și evenimentele lor (le găsești cu `list_database_tables` → `describe_database_table`; coloane explicite + WHERE pe comanda/dispozitivul vizat + LIMIT) — vezi câte joburi de printare are comanda, statusul lor (queued/sent/sent_to_edge/done/error) și numerele de bon. **Două joburi fiscale „done" pe aceeași comandă = bon dublat. Un job rămas „sent_to_edge" fără „done" = bonul nu s-a confirmat (probabil nu a ieșit).**

## Pasul 2 — Cere logurile reale (NOU — le iei singur)

Nu mai cere userului să descarce nimic. Folosește:

1. `request_device_logs(deviceId, source, minutesBack?)` — cere un dump proaspăt.
   - `source: "pa"` = logurile Print Agent (printarea efectivă, casa fiscală). `source: "edge"` = logurile serverului local (dispecerizare, sincronizare, deconectări).
   - `minutesBack` = cât în urmă (implicit ultimele 3h). Pentru un incident mai vechi dă `from`+`to` (ISO).
   - Întoarce un `dumpId`. Dispozitivul încarcă logurile la următorul poll — **așteaptă ~60 de secunde**.
2. `read_device_logs(dumpId, grep?, maxLines?)` — citește conținutul, FILTRAT.
   - **Pune mereu un `grep`** (fișierele pot fi mari): un `jobId` (`pj_...`), un număr de bon, numărul comenzii, sau cuvinte ca `fiscal`, `error`, `eroare`, `retry`, `reconnect`, `TIMEOUT`, `CONSUMED`.
   - Fără `grep` întoarce ultimele linii (activitatea recentă). Secretele (token-uri) sunt mascate automat.
   - Dacă răspunsul zice „pending", dump-ul nu s-a încărcat încă — mai așteaptă ~60s.
3. `list_device_logs(deviceId)` — vezi ce dump-uri ai deja (poate nu trebuie unul nou) și ia `dumpId`-ul.

## Pasul 3 — Citește logul corect (ce cauți)

**Print Agent (source: "pa")** — fiecare bon arată așa:
```
Received job pj_xxxx (fiscal) from edge ...
[FISCAL] Job pj_xxxx -> writing file ... .bon
[FISCAL] Job pj_xxxx -> found response in Success folder ...
Job pj_xxxx (fiscal) -> completed. Receipt #NNNNN
```
- **Bon DUBLAT**: DOUĂ linii „Received job" diferite (de obicei una `pj_...` și una `pj_edge_...`) pentru aceeași comandă, ambele cu „completed. Receipt #N" pe numere consecutive → bonul s-a tipărit de două ori. Grep pe numărul comenzii sau pe ambele numere de bon ca să confirmi.
- **Bon care NU a ieșit**: „writing file" dar fără „completed", sau `TIMEOUT` (programul casei fiscale nu a preluat fișierul) / `CONSUMED` (preluat, dar fără confirmare).
- **Casă instabilă**: multe `pa_start` / `pa_stopping` / `connect_fail` / `code=1006` într-un interval scurt = Print Agent-ul se tot repornește/deconectează (cauză frecventă atât pentru bonuri neieșite cât și pentru dublări).

**Edge Server (source: "edge")** — cauți: liniile cu `print` + numărul comenzii (cine a cerut bonul), `completed by device N`, și avertismente de sincronizare (`abandoned after ... sync retries`, `code=1006`, `cloud_reachable`).

## Pasul 4 — Explică + acționează

- Spune userului în cuvinte simple ce s-a întâmplat (ex. „bonul comenzii 35550 s-a tipărit de două ori pentru că au plecat două cereri simultan, una din cloud și una din serverul local; casa era instabilă în acel moment").
- Dacă e o problemă de configurare (imprimantă oprită, fără hârtie, IP greșit, PC oprit) → spune ce trebuie reparat fizic.
- Dacă pare un defect al platformei (ex. bon dublat repetabil când pleacă două cereri simultan, din cloud și din serverul local) → deschide un ticket la echipa Symbai cu `trimite_ticket_symbai` (atașează numărul comenzii, numerele de bon și `dumpId`-urile relevante).
- Pentru bonuri fiscale dublate → atrage atenția că e o chestiune ANAF (de reconciliat cu contabilul), nu doar o iritație.

## Reguli

- **Pornește de la dovezi**: nu spune „s-a pierdut" / „e rezolvat" fără să fi citit logul sau jobul. Verifică, apoi afirmă.
- **Filtrează mereu** logurile cu `grep` — nu cere și nu încerca să citești tot fișierul (poate avea zeci de mii de linii).
- **Răbdare la dump**: după `request_device_logs` așteaptă ~60s înainte de `read_device_logs`; dacă PC-ul/PA-ul e offline, dump-ul nu vine — spune asta clar.
- **Confidențialitate**: logurile au IP-uri și nume de angajați (de aceea cer drept de „Setări" pe token); token-urile sunt mascate automat. Nu le împrăștia — sintetizează ce e relevant.
- **Acces**: dacă tool-urile de loguri îți spun că lipsește dreptul, userul îl activează din portal Hub → Acces AI (modulul Setări). Pentru interogările SQL pe joburile de printare e nevoie de dreptul „Interogări SQL".
- Numere de bon și sume contează — citează-le exact.
