# Caietul schimbului, predare și mentenanță preventivă

Pentru „ce predăm schimbului următor”, „problemă de igienizare/alergeni”, „cine rezolvă utilajul”, „revizie la 250 de ore”, „contor”, „programare intervenție”. Pentru picking citește [picking-optimizat.md](./picking-optimizat.md); producția pe operații este în [productie-fabrica.md](./productie-fabrica.md).

Verifică disponibilitatea uneltelor prin `cauta_tool`. Folosește angajatul nominal conectat; nu transmite identitatea altui coleg ca argument. Registrul aparține fabricii și locației exacte, identificate prin gestiunea de lucru din `list_work_warehouses`.

## Citește înainte de acțiune

`get_factory_continuity`, `section:summary`, arată fabrica, data, drepturile disponibile, numărul înregistrărilor și revizia registrului. Secțiunile `notes`, `plans`, `jobs`, `handovers`, `employees`, `equipment` se citesc separat, paginat.

Urmează `pagination.nextArguments` până la `hasMore:false`. O pagină refuzată pentru schimbarea datelor cere recitire. Rezumatul listei nu este procedura completă: citește `get_factory_continuity_record` cu tipul `note`, `plan`, `job` sau `handover` și ID-ul exact.

Listele includ problemele/intervențiile active și ultimele 30 închise, respectiv ultimele 30 de predări. Un ID mai vechi cunoscut poate fi citit direct. Detaliul unei predări arată rezumatul; citește separat secțiunile `notes`, `plans`, `jobs`, `checklist` pentru raportul complet.

## Problemele schimbului

| Operație | Tool | Ce verifici |
|---|---|---|
| Raportează | `create_factory_shift_note` | Titlu și observație reale, categorie, prioritate, responsabil, termen; utilaj din aceeași fabrică, dacă se aplică |
| Editează/repartizează | `update_factory_shift_note` | Problema este deschisă; păstrezi câmpurile neatinse și trimiți versiunea citită |
| Rezolvă | `resolve_factory_shift_note` | Confirmarea responsabilului/coordonatorului, explicația rezolvării și versiunea actuală |

Categoriile acoperă producția, materialele, utilajele, calitatea, igienizarea/alergenii și siguranța. O notă despre calitate nu pune automat lotul în carantină. Pentru blocarea/eliberarea loturilor folosește separat fluxul de calitate și drepturile sale.

## Predarea și preluarea

1. Citește problemele deschise, scadențele, intervențiile și procedurile relevante; clarifică cine preia fiecare responsabilitate.
2. `submit_factory_handover` primește revizia registrului verificat, titlu, rezumat, checklist și pașii confirmați efectiv. Dacă registrul s-a schimbat, recitește înainte de predare.
3. Raportul păstrează starea din acel moment. Rezolvarea ulterioară a unei probleme nu rescrie raportul vechi.
4. Colegul care intră citește raportul complet și folosește `receive_factory_handover` din propria conexiune nominală. Autorul nu își poate prelua propria predare. Preluarea nu închide problemele.

Nu bifa verificări fizice presupuse. „Am discutat igienizarea” și „igienizarea a fost executată și verificată” sunt constatări diferite.

## Planuri și intervenții

`save_factory_maintenance_plan` configurează un plan complet pentru un utilaj: responsabil, procedură, activ/inactiv, calendar, contor cumulativ sau ambele. Intervalele și instrucțiunile vin din procedura reală. La editare citește planul, păstrează valorile neatinse și trimite ID-ul și versiunea.

- Calendarul și contorul pot declanșa scadența independent; nu trebuie atinse ambele.
- `fixed` păstrează cadența stabilită; `completion` calculează scadența următoare de la finalizare.
- `record_factory_maintenance_reading` înregistrează o citire actuală și observația. Contorul este cumulativ și nu scade. După resetarea aparatului trebuie confirmat cumulul real.
- Atingerea pragului marchează scadența; nu programează automat intervenția.
- `schedule_factory_maintenance_job` programează din ziua curentă înainte și rezervă utilajul pentru **întreaga zi** în calendarul de producție. Procedura și ciclul se păstrează la programare. Un ciclu are o singură intervenție activă.
- `complete_factory_maintenance_job` cere procedura păstrată la programare, pașii efectuați, constatarea și citirea actuală pentru planurile pe utilizare. Finalizarea avansează o singură dată ciclul. Rezervarea zilei rămâne în istoric.
- `cancel_factory_maintenance_job` cere motivul anulării și eliberează numai rezervarea intervenției. Ciclul și scadența planului nu avansează.

Nu edita procedura unui plan cu intervenție programată. Clarifică mai întâi anularea/reprogramarea necesară. Nu declara revizia executată din simpla programare sau din atingerea contorului.

## Recuperarea după întrerupere

La creări și programări păstrează același `requestId` UUID și aceleași argumente pentru repetarea aceleiași cereri. Un conținut diferit este o cerere diferită, nu o repetare. După rezultat incert recitește registrul/înregistrarea înainte să încerci din nou; la conflict de versiune reevaluează starea actuală.

Registrul și mentenanța necesită conexiune la server. Aceste operații nu confirmă automat HACCP, eliberarea QC sau citiri de la senzori conectați.
