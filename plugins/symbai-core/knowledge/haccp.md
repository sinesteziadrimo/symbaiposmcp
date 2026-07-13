# HACCP & siguranța alimentară în Symbai (concepte + navigare)

> Knowledge pentru skill-ul `gestioneaza-haccp`. Aici e CE înseamnă fiecare jurnal și de ce contează; CUM le operezi (ce tool, ce deep-link) e în SKILL.md. HACCP = sistemul prin care un local dovedește (la control DSV/ANPC) că ține siguranța alimentară sub control: temperaturi, igienă, incidente, răcire, trasabilitate.

## Pagina și taburile

Totul stă pe pagina **`/haccp`** („HACCP & Siguranță Alimentară"), cu un **Scor de Conformitate** în antet (combină % sarcini de curățenie făcute, % citiri de temperatură conforme și incidentele deschise). Temperaturile și sarcinile HACCP se pot loga și **din aplicația mobilă Symbai Staff** — bucătarul nu are nevoie de PC (vezi `expo-aplicatii-mobile.md`). Taburile sunt adresabile prin `?tab=` — du-te direct la cel potrivit:

| Tab (`?tab=`) | Ce e | Tool-uri MCP |
|---|---|---|
| `temps` | Jurnal de temperaturi (frigidere, congelatoare, vitrine, echipamente) | `log_temperature_reading`, `list_temperature_logs` |
| `cleaning` | Checklist de curățenie/igienă (hotă, podea, suprafețe…) cu frecvență și scadență | `complete_cleaning_task`, `list_cleaning_tasks` (+ `create_cleaning_task`) |
| `incidents` | Registru de incidente (lanț frig, contaminare, expirat, defecțiuni) + recall | `create_haccp_incident`, `resolve_haccp_incident`, `list_haccp_incidents`, `build_recall_report`, `trace_recall_to_customers` |
| `sensors` | Senzori de temperatură configurați (cu nume + praguri min/max) | `create_haccp_sensor` |
| `cooling` | Sesiuni de răcire rapidă (blast chilling) monitorizate | `start_rapid_cooling_session`, `add_cooling_reading`, `list_rapid_cooling_sessions` |
| `retention` | Probe-martor (mostre păstrate din mâncarea servită) | UI |
| `audits` | Checklist-uri de audit intern | UI |

## Conceptele

**Jurnalul de temperaturi.** Periodic (de obicei dimineața + seara) se măsoară temperatura la fiecare frigider/congelator și se notează. Fiecare citire are un echipament (`equipmentName`), o valoare în °C și — dacă există praguri — un status `normal` sau `warning`. Praguri uzuale (orientative, confirmă cu userul/DSV): **frigider 0…+4°C**, **congelator ≤ −18°C**, vitrină rece +2…+8°C. Când loghezi prin tool și dai pragurile (sau folosești un `sensorId` configurat care le are), abaterea e marcată automat. Raportul agregat (`aggregate:true`) dă min/max/medie + nr. abateri + % conformitate per echipament — exact ce arăți la un control.

**Senzorii.** Un senzor HACCP = un echipament cu nume + praguri salvate o dată (`create_haccp_sensor`). Apoi loghezi citiri pe el cu `sensorId`, iar tool-ul preia singur numele și pragurile (nu mai retastezi `locationLabel`/`min/max`). Util când ai aceleași 5-6 frigidere măsurate zilnic.

**Sarcinile de curățenie.** Un checklist recurent (frecvență: zilnic/săptămânal etc.) cu scadență. `due` = de făcut/scadente; `overdue` = depășite (`nextDueAt` în trecut și nebifate). Le creezi din UI sau cu `create_cleaning_task`; tool-ul `complete_cleaning_task` doar le bifează „completed" + momentul + (opțional) cine a executat.

**Incidentele.** Orice abatere de siguranță: lanț frig întrerupt, contaminare, produs expirat, defecțiune de echipament. Pornește `open`, are o categorie (`type`), o descriere și o severitate (`low`/`medium`/`high`). Se închide cu o **măsură corectivă** (`correctiveAction`) — partea importantă pentru DSV: nu doar „ce s-a întâmplat", ci „ce am făcut ca să nu se repete". Incidentul nu are un câmp dedicat de lot → dacă dai `productLotId`, tool-ul îl notează în descriere și te trimite la recall.

**Răcirea rapidă (blast chilling).** HACCP cere ca mâncarea gătită caldă (ciorbe, sosuri, carne) să treacă rapid prin „zona periculoasă" de temperatură — tipic **de la ~60°C la ≤10°C în maximum ~2 ore** — altfel se înmulțesc bacteriile. O sesiune are temperatură de pornire, țintă, limită de timp și un șir de citiri. Când o citire atinge ținta, sesiunea devine automat `completed` (conformă); dacă depășește limita de timp fără să atingă ținta, e `non_compliant`.

**Raportul de retragere (recall).** Dacă un lot e suspect (ex. carne ținută la temperatură greșită), trebuie să știi instant **unde a ajuns**: în ce semipreparate/produse finite a intrat, ce loturi descendente există și ce clienți trebuie notificați. `build_recall_report(lotId, direction)` parcurge genealogia: `forward` = doar aval (impactul retragerii), `full` = și amonte (din ce a provenit). Întoarce loturile afectate + produsele distincte. Pentru pasul „unul înainte" către client folosește `trace_recall_to_customers(lotId)`: lista **EXACTĂ** vine din urma lot→document de ieșire→client; lista **PREZUMTIVĂ** acoperă istoricul fără urmă exactă prin același produs în fereastra lotului și trebuie verificată manual. Se cuplează cu `create_haccp_incident` pe același lot. `lotId` vine din modulul de producție/trasabilitate (loturi de la recepție sau din producție).

**Cold-chain release.** Când întrebarea este „pot livra/folosi lotul refrigerat?", „peștele/fructele de mare sunt ok?", „a stat la rece corect?", nu ajunge doar jurnalul de temperaturi. Rulează `get_cold_chain_release_readiness(batchId|lotId)`: verifică dovezi de temperatură, CCP/QC, incidente HACCP, hold-uri de calitate și loturi output înainte să promiți stocul. Dacă auditul e blocat, explici cauzele și nu eliberezi lotul; decizia de eliberare se face apoi prin fluxul de calitate din `productie-fabrica.md` (`get_quality_release_dossier` / `release_quality_hold`).

## Cum se leagă de restul platformei
- **Loturi & trasabilitate** (de unde iei `lotId`, cum curge genealogia) → `productie-fabrica.md` sau `productie-restaurant.md`, în funcție de modul clientului.
- **Recepția mărfii** creează loturi la intrare → `intrari-marfa-receptie.md` / skill `receptie-factura-furnizor`.
- **Rețete & alergeni** (siguranța pe produs) → `produse-meniu-retete.md` / skill `adauga-produs-reteta`.
- HACCP-ul e **pasul 15 din onboarding** („DSV Chef") — vezi `onboarding/`.

## Permisiuni
Citirile (`list_*`, `build_recall_report`, `trace_recall_to_customers`) merg mereu. Scrierile (loghează temperatură, incident, bifează curățenie, răcire, creează senzor/sarcină) cer modulul **Setări & Configurare** (`setari`) pe token — exact modulul care guvernează paginile HACCP în UI. „Permisiune insuficientă" → portal Hub → Acces AI. Ștergerea de entități întregi nu e disponibilă prin conexiune (din aplicație).
