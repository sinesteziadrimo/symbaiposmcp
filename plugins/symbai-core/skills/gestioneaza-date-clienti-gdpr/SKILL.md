---
name: gestioneaza-date-clienti-gdpr
description: Gestionează datele clienților și conformitatea GDPR în Symbai — export de date la cerere (dreptul de acces/portabilitate), ștergere/anonimizare („dreptul de a fi uitat"), jurnalul de consimțăminte (cine a acceptat/refuzat email/SMS/WhatsApp), curățarea duplicatelor (găsește + unifică) și grupuri/segmente de clienți. Folosește la „un client cere copia datelor lui", „exportă-mi datele clientului X", „cererea de a fi uitat / șterge datele clientului", „anonimizează clientul/oaspetele", „de ce nu primește clientul email — are opt-out?", „arată-mi jurnalul de consimțăminte", „cine a acceptat marketingul", „am clienți dublați, unește-i", „găsește duplicate", „fă un grup VIP", „câți clienți intră în segmentul X", „pot trimite marketing clientului Y?". Operațiuni rare dar importante — acțiunile ireversibile (ștergere/anonimizare) cer confirmare explicită de la user.
---

# Date clienți & GDPR — hands-free, prin conexiune (MCP)

Userul (proprietar/manager) vine cu o cerere de **conformitate** sau de **igienă a bazei de clienți**: un client cere copia datelor lui, altul cere să fie „uitat", trebuie verificat dacă cineva poate fi contactat pe email, sau baza are duplicate de curățat. **Tot ce înseamnă date are tool MCP** — operezi prin conexiune (rapid, cu audit), navighezi prin deep-link ca să-i ARĂȚI userului pagina, și apeși un buton doar foarte rar. ⚠ Acțiunile **ireversibile** (ștergere/anonimizare) NU se fac niciodată fără confirmarea explicită a userului.

## Înainte de orice

1. Citește **`knowledge/agent-operare-avansata.md`** pentru standardul de confirmare/verificare la acțiuni ireversibile, apoi **`knowledge/gdpr-clienti-oaspeti.md`** (concepte: dreptul de a fi uitat, portabilitate, consimțământ per canal, anonimizare vs ștergere, fuziune duplicate; fluxuri pas-cu-pas; capcane — mai ales **client retail vs oaspete hotel** = două profiluri și două seturi de tool-uri). Pentru grupuri & segmente → **`knowledge/segmentare-clienti.md`** (grup static manual vs segment dinamic RFM). Pentru opt-out la trimitere → **`knowledge/email-marketing.md`** / **`knowledge/marketing-social.md`**.
2. Citește **`knowledge/condu-chrome.md`** — doctrina „munca prin MCP, Chrome doar pentru a NAVIGA și a ARĂTA, click pe element doar la nevoie". Nu o repeta, aplic-o.
3. **Context**: `list_brands` + `list_locations` la nevoie (multe tool-uri de oaspeți cer `brandId`/`locationId`). Pentru ID-ul clientului/oaspetelui, cere-l userului sau găsește-l în pagina `/customers`.

## Cheat: ce-ți cere userul → ce tool MCP

| Intenția userului | Tool MCP | Tip |
|---|---|---|
| „Clientul cere o copie a datelor lui" (retail) | **`export_customer_gdpr_data`** (customerId) | citire |
| „Copia datelor unui OASPETE hotel" | **`export_guest_gdpr_data`** (guestProfileId) | citire |
| „Șterge / anonimizează clientul retail" („să fiu uitat") | **`forget_customer_gdpr`** (customerId, **confirm:true**) | ⚠ ireversibil |
| „Anonimizează OASPETELE hotel" | **`anonymize_guest`** (guestProfileId, **confirm:true**) | ⚠ ireversibil |
| „Cine a acceptat/refuzat marketingul / jurnalul de consimțăminte" | **`list_gdpr_consent_log`** (opțional customerId) | citire |
| „Pot trimite email/SMS clientului X?" | **`check_marketing_allowed`** (customerId, channel) | citire |
| „Ce s-a întâmplat cu clientul X / când l-am contactat ultima dată" | **`get_customer_timeline`** (customerId) | citire |
| „Am clienți/oaspeți dublați — găsește-i" | **`find_duplicate_guests`** | citire |
| „Unește duplicatele / fuzionează" | **`merge_guests`** (primaryId, mergedIds[]) | scriere |
| „Câți clienți intră în segmentul X" (fără să trimit) | **`preview_guest_segment`** (segmentId SAU criteria) | citire |
| „Ce grupuri de clienți am / câți VIP" | **`list_customer_groups`** | citire |
| „Fă un grup VIP / abonați" | **`create_customer_group`** (name) | scriere |
| „Adaugă clientul în grup" | **`add_customer_group_member`** (groupId, portalUserId, nume) | scriere |

> ⚠ **Retail ≠ hotel.** Un client din POS (`/customers`) și un oaspete din hotel (`/hotel/guests`) sunt profiluri DIFERITE. Export/ștergere retail = `export_customer_gdpr_data` / `forget_customer_gdpr` (cer `customerId`). Export/anonimizare oaspete = `export_guest_gdpr_data` / `anonymize_guest` (cer `guestProfileId` + brand/locație). Întreabă userul despre cine e vorba dacă nu e clar.

## Cum NAVIGHEZI și cum ARĂȚI userului

Munca o faci prin tool, dar userul nu vede conexiunea — deci **deschide-i pagina și fă screenshot** ca dovadă.
- **Baza de clienți**: `navigate("/customers")` — de aici vede clientul, tagurile, grupurile, istoricul. Link live: `gaseste_in_aplicatie("clienți")`.
- **Grupuri de clienți**: `navigate("/settings/customer-groups")` (sau `gaseste_in_aplicatie("grupuri clienți")`) — după ce ai creat un grup / ai adăugat membri cu MCP, deschide-i pagina ca să-i arăți grupul + numărul de membri.
- **Oaspeți hotel**: `navigate("/hotel/guests")` — profiluri cu marcaje GDPR, pentru proprietățile cu cazare.
- **Rapoarte / segmente clienți**: `gaseste_in_aplicatie("rapoarte clienți")` (RFM, top clienți). Folosește `gaseste_in_aplicatie(termen scurt)` ca sursă autoritară de link — **nu inventa URL-uri**.
- ⚠ Multe pagini Symbai au tab-uri adresabile cu `?tab=…`; du-te direct la tab prin `navigate(url?tab=…)` în loc să cauți tab-ul cu mouse-ul. Dacă nu știi tab-ul exact, cere-l de la `gaseste_in_aplicatie`.

**Rezultatul unui export GDPR îl primești în răspunsul tool-ului** (pachetul de date) — pe acela i-l dai userului ca să-l trimită clientului (sau îl pui într-un fișier). Nu trebuie pagină pentru export.

## Rețete LEGALE (cu confirmare unde e ireversibil)

**1. „Clientul cere copia datelor lui" (dreptul de acces / portabilitate — Art. 15/20).**
Afli dacă e client retail sau oaspete hotel → `export_customer_gdpr_data(customerId)` / `export_guest_gdpr_data(guestProfileId)`. Tool-ul loghează cererea (audit) și întoarce pachetul complet (comenzi, fidelitate, comunicări, consimțăminte). I-l dai userului să-l trimită clientului.

**2. „Cererea de a fi uitat" (dreptul la ștergere — Art. 17). ⚠ IREVERSIBIL — cere confirmare.**
- Întâi **explică-i userului** distincția: **anonimizare** (scoate datele personale — nume/telefon/email/adresă — dar PĂSTREAZĂ tranzacțiile/agregatele pentru evidența fiscală) vs **ștergere completă**. Pentru un client cu istoric de vânzări/facturi, anonimizarea e alegerea corectă (rapoartele fiscale rămân corecte fără PII).
- Confirmă **cine** e clientul și **că userul vrea sigur** să continue. Abia apoi:
  - retail → `forget_customer_gdpr(customerId, confirm:true)` (anonimizează PII, curăță jurnalul de comunicări, revocă tot marketingul; comenzile fiscale + fidelitatea agregat rămân).
  - oaspete hotel → `anonymize_guest(guestProfileId, confirm:true)` (anonimizează PII, păstrează agregatele fiscale).
- **Nu rula niciodată „de test".** Fără `confirm:true` tool-ul nu execută — e protecția intenționată. Dacă userul n-a confirmat explicit, OPREȘTE-TE și întreabă.

**3. „Verifică consimțămintele / de ce nu primește clientul email."**
`list_gdpr_consent_log(customerId)` → arată cine a dat/retras acordul, pe ce canal, când. Pentru „pot trimite ACUM pe email/SMS?" → `check_marketing_allowed(customerId, channel)` (verifică opt-out dur + plafonul anti-spam). ⚠ Consimțământul e **per canal** — un client poate fi OK pe email și opt-out pe SMS. La trimiterea efectivă a campaniilor sistemul respectă opt-out-ul automat (nu trebuie să filtrezi manual).

**4. „Curăță duplicatele." ⚠ Verifică ÎNAINTE de a uni.**
`find_duplicate_guests` → îți arată perechile suspecte (același email/telefon). **Verifică** cu userul că sunt chiar aceeași persoană, apoi `merge_guests(primaryId, mergedIds[])` — `primaryId` = profilul PĂSTRAT; restul se DEZACTIVEAZĂ (nu se șterg), iar punctele/istoricul/rezervările/folio se repointează pe primary. Nu se pierde nimic. Spune-i userului în care profil ai unit.

**5. „Grupuri & segmente."**
- Grup static manual: `create_customer_group(name)` → `add_customer_group_member(groupId, portalUserId, firstName, lastName, …)` pentru fiecare membru → verifici cu `list_customer_groups` (grupuri + nr. membri). Apoi deschide-i `/settings/customer-groups` ca să-i arăți.
- „Câți clienți intră într-un segment, fără să trimit nimic?" → `preview_guest_segment(segmentId)` sau `preview_guest_segment(criteria:{ rfmSegments, tierKeys, minLifetimeRevenue, notVisitedSinceDays, … })` — întoarce numărul, dry-run.

## Cele puține cazuri care cer un click

Aproape totul aici merge prin MCP. Apelezi la Chrome activ (`claude-in-chrome`, click pe ELEMENT nu pe pixel — vezi `condu-chrome.md`) doar pentru:
- **ștergerea unei entități întregi** dacă userul chiar vrea eliminarea totală (nu anonimizare) — asta NU se face prin conexiune ca operație obișnuită; îndrumă-l să șteargă din `/customers` (sau fă-o tu prin Chrome dacă e logat și ți-o cere explicit).
- editarea fină a unui formular de consimțământ public / setări de colectare care n-au tool dedicat.
- legarea unui membru de grup la un client din portal când nu cunoști `portalUserId` (îl găsești în pagina clientului).

## Reguli (cele care contează)

- **Ireversibilul cere confirmare EXPLICITĂ.** `forget_customer_gdpr` și `anonymize_guest` șterg PII pentru totdeauna. Nu le rula niciodată din proprie inițiativă, „de test", sau pe ID greșit. `confirm:true` e o barieră intenționată — respect-o. Confirmă identitatea + intenția cu userul întâi.
- **Retail vs hotel — tool-ul potrivit.** `*_customer_*` = client POS (`customerId`); `*_guest_*` = oaspete hotel (`guestProfileId` + brand/locație). Greșirea tool-ului = export/ștergere pe profilul nepotrivit.
- **Citește înainte de a fuziona.** `merge_guests` unește doi clienți SPECIFICI; confirmă cu `find_duplicate_guests` + userul că sunt aceeași persoană.
- **Consimțământul e per canal**, nu global — verifică pe canalul cerut (`check_marketing_allowed` / `list_gdpr_consent_log`).
- **Confirmă-prin-citire**, nu „pare ok pe ecran": după o scriere (merge/grup), re-interoghează (`list_customer_groups`, `find_duplicate_guests`) ca să confirmi, apoi arată-i userului pagina.
- **Limbaj de business**, nu jargon: „export de date", „cererea de a fi uitat", „cine a acceptat email-urile", „am unit cei doi clienți" — nu `customerId`/`guestProfileId`/`opt-out flags`.
- **Nu inventa** date, ID-uri sau cereri. Ce nu știi → întrebi userul.

## Permisiune

Citirile (export, jurnal consimțăminte, găsire duplicate, preview segment, listă grupuri, timeline) merg mereu. **Scrierile** — `forget_customer_gdpr`, `anonymize_guest`, `merge_guests`, `create_customer_group`, `add_customer_group_member` — cer modulul **Rezervări & Clienți** (`rezervari_clienti`) pe token. „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul.

## Legături

- Conceptele GDPR + fluxuri + capcane (retail vs hotel) → `knowledge/gdpr-clienti-oaspeti.md`.
- Grupuri vs segmente dinamice (RFM), audiențe de campanie → `knowledge/segmentare-clienti.md`; fidelizare/RFM → `knowledge/loialitate-fidelizare.md`.
- Trimiteri de marketing care respectă opt-out → `knowledge/email-marketing.md` + skill-ul `gestioneaza-comunicare`; reactivare clienți → `knowledge/crm-automatizari-playbooks.md` + skill-ul `gestioneaza-crm`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element doar la nevoie) → `knowledge/condu-chrome.md`.
- Navigare către orice pagină → skill-ul `gaseste-pagina` / tool-ul `gaseste_in_aplicatie`.
- Ceva ce nu se poate prin conexiune (ex. ștergere totală de entitate) → ghidează în app + `trimite_ticket_symbai` (sugestie).
