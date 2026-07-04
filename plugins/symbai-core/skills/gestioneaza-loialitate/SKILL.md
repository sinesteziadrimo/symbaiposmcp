---
name: gestioneaza-loialitate
description: Gestionează programul de fidelitate / loialitate prin conexiune (MCP) + navigare vizuală — niveluri (tier-uri), recompense, acordarea/răscumpărarea/expirarea punctelor, segmente RFM, alerte de scădere (win-back) și fișa de puncte a unui client. Acoperă DOUĂ programe SEPARATE: loialitatea hotel (pe nopți, /hotel/crm — cu tool-uri de scriere complete) și loialitatea POS/restaurant-retail (pe lei cheltuiți, /loyalty — configurare program + sold/puncte client prin MCP, niveluri/recompense avansate în pagină). Folosește la „cum stă programul de fidelitate", „câți membri am / câte puncte datorez", „câte puncte are clientul X", „adaugă un nivel Gold / Platinum", „adaugă o recompensă în catalog", „dă-i 500 de puncte clientului ca gest comercial", „scade niște puncte", „răscumpără o recompensă", „expiră punctele vechi", „recalculează RFM / segmentele", „cine sunt VIP-urii mei", „ce clienți buni au început să plece / cine pleacă / win-back", „de ce nu urcă clientul de nivel", „pornește programul de fidelitate".
---

# Gestionează loialitatea — niveluri, recompense, puncte, RFM, win-back prin MCP + navigare

Userul (proprietar/manager) vrea să-și gestioneze programul de fidelitate: să vadă cum stă, să acorde sau să răscumpere puncte, să adauge niveluri și recompense, să-și găsească VIP-urii și clienții care încep să plece. Tu faci munca prin **conexiune (tool-uri MCP)** — rapid, fără click-uri prin taburi — și îi **ARĂȚI** rezultatul deschizându-i pagina pe tab-ul potrivit (deep-link) + screenshot. Click manual doar în cele câteva locuri unde nu există tool.

## ⚠ Întâi de tot: care dintre cele DOUĂ programe?

Symbai are **două programe de fidelitate complet separate** — nu le amesteca, punctele nu se transferă:

| | Loialitate HOTEL | Loialitate POS / restaurant-retail |
|---|---|---|
| Pe ce se câștigă | **nopți de cazare** + venituri folio | **lei cheltuiți** la vânzare |
| Pagina | **`/hotel/crm`** | **`/loyalty`** (Fidelizare & Recompense) |
| Entitatea | **oaspete** (`guestProfileId`) | **client** (`customerId`) |
| Scriere prin MCP | **DA — set complet** (vezi tabelul) | **DA — configurare program + sold/puncte client; niveluri/recompense avansate rămân în pagină** |

**Întreabă-te / întreabă userul:** are hotel? Vorbește despre nopți, oaspeți, camere, folio → **hotel**. Vorbește despre clienți la masă, telefon de fidelitate, lei cheltuiți, recompense la restaurant/magazin → **POS**. La dubiu, întreabă scurt. Restul skill-ului tratează separat fiecare.

## Înainte de orice
1. Citește **`knowledge/loialitate-fidelizare.md`** (concepte: punct, regulă de acumulare, nivel/tier, recompensă, RFM, alertă de scădere; cele 4 pagini; fluxurile pas-cu-pas; capcanele — mai ales „POS ≠ hotel" și „punctele doar pentru clienți identificați") și **`knowledge/condu-chrome.md`** (doctrina: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie). Pentru găsirea clienților valoroși/segmentare vezi și **`knowledge/segmentare-clienti.md`**.
2. **Context:** `list_brands` + `list_locations` → afli `brandId`/`locationId` (aproape toate tool-urile de loialitate le cer).
3. **Vizibil pentru user:** ai nevoie de extensia Chrome (`claude-in-chrome`) + user logat ca să-i arăți pagina. Dacă nu e conectată, poți tot lucra prin tool-uri „pe orb", dar spune-i clar că nu-i poți ARĂTA rezultatul; oferă-i s-o conecteze.

## A) Loialitate HOTEL — set complet prin MCP

Aici ai tool-uri de scriere reale. **Intenție → tool:**

| Userul vrea | Tool MCP | Tab unde i-l arăți |
|---|---|---|
| „cum stă programul / câți membri / câte puncte datorez" | `get_hotel_loyalty_overview` | `?tab=overview` |
| „câte puncte are oaspetele X / istoricul lui" | `get_guest_loyalty_detail(guestProfileId)` | `?tab=overview` |
| „adaugă un nivel Gold / Platinum" | `create_loyalty_tier(name, pointsThreshold?, nightsThreshold?, earnMultiplier?, benefits[]…)` | `?tab=tiers` |
| „adaugă o recompensă în catalog" (noapte gratis, credit F&B, upgrade) | `create_loyalty_reward(name, pointsCost, rewardType?, rewardValue?, minTierKey?…)` | `?tab=redemptions` |
| „dă-i N puncte / scade-i puncte (gest comercial, corecție)" | `award_loyalty_points(guestProfileId, points, reason)` — pozitiv acordă, **negativ scade** (≠0); recalculează tier-ul automat | `?tab=overview` |
| „răscumpără recompensa Y pentru oaspete" (generează voucher) | `redeem_loyalty_points(guestProfileId, redemptionId, folioId?…)` | `?tab=redemptions` |
| „expiră punctele vechi / ajunse la termen" | `expire_loyalty_points()` (global; întoarce câte s-au expirat) | `?tab=overview` |
| „recalculează tier-ul/statisticile unui oaspete" | `recompute_guest_loyalty(guestProfileId)` (mentenanță, idempotent) | — |
| „recalculează RFM / segmentele" (după import sau periodic) | `recompute_loyalty_rfm()` (toți oaspeții locației) | `?tab=segments` |
| „cine pleacă / clienți buni care s-au răcit / win-back" | `evaluate_loyalty_drop_alerts()` (întoarce nr. alerte; apoi le faci ofertă) | `?tab=campaigns` |

**Navigare (deep-link, fără click prin taburi):** `navigate("/hotel/crm?tab=<tab>")`. Tab-urile reale: `overview`, `tiers`, `rules` (reguli de acumulare puncte), `redemptions` (catalog recompense), `segments` (RFM), `campaigns`, `journeys`, `dsar` (GDPR). Link live = `gaseste_in_aplicatie("loialitate hotel")` sau `gaseste_in_aplicatie("CRM hotel")`. După o scriere prin MCP, deschide-i tab-ul relevant + **screenshot** = dovada rezultatului.

**Câteva precizări:**
- `create_loyalty_tier`: pragul poate fi pe **puncte lifetime** (`pointsThreshold`) SAU pe **nopți** (`nightsThreshold`); `earnMultiplier` (ex. 1.25 = +25% puncte la nivelul ăsta); `benefits[]` = listă de text.
- `create_loyalty_reward`: `pointsCost` > 0 obligatoriu; `rewardType` (ex. `free_night`, `fb_credit`, `room_upgrade`), `rewardValue` (EUR la credit/noapte gratis), `minTierKey` (ex. `silver`) dacă vrei recompensa doar de la un nivel în sus.
- `award_loyalty_points`: **pune mereu `reason`** — rămâne în ledger și e auditat. `expiresAt`: lipsă = expirare implicită (2 ani), `null` = fără expirare.
- Reguli de acumulare puncte (câte puncte / noapte / leu, multiplicatori) = tab `rules` — **se editează în pagină** (nu există tool dedicat de scriere a regulii). Ghidează userul acolo.

## B) Loialitate POS / restaurant — configurare și puncte client prin MCP + pagină

Acum există tool-uri MCP dedicate pentru programul POS. Folosește-le întâi pentru citire/scriere punctuală; deschide pagina `/loyalty` pentru dovadă vizuală, niveluri/recompense avansate și verificări de layout.

**Ce CITEȘTI prin MCP:**
- Configul programului POS → `get_pos_loyalty_config` (activ/inactiv, rata de câștig, valoarea de răscumpărare, bonusuri, excluderi).
- Soldul unui client POS → `get_customer_loyalty(customerId)` (puncte, nivel, ultimele 15 tranzacții din ledger). Pentru „câte puncte are clientul X".
- Cine sunt clienții valoroși / cine merită contactat acum → `list_nba_suggestions` (coada Next-Best-Action: hot lead, `win_back`, `upsell`, `review_request`, birthday — cu scor 0-100 și motivul).
- Ce s-a întâmplat cu un client (comenzi/comunicări/context) → `get_customer_timeline(customerId)`.
- Cum merge conversia per surse → `get_crm_funnel`.
- SQL SELECT-only doar ca ultim fallback; pentru puncte POS preferă `get_customer_loyalty`, nu interoga brut tabelele de puncte prin SQL.

**Ce SCRII prin MCP:**
- Pornești/oprești și setezi programul → `set_pos_loyalty_settings(active?, earnRate?, redeemValue?, signupBonusPoints?, onlinePaymentBonusPoints?, birthdayBonusActive?, birthdayBonus?, happyHourActive?, excludeTax?, excludeTip?, excludeDelivery?)`. Confirmă verbal valorile-cheie înainte să schimbi regula, fiindcă afectează punctele viitoare.
- Acordare/corecție puncte client POS → `award_customer_loyalty_points(customerId, points, reason)`. `points` pozitiv adaugă, negativ scade; motivul rămâne în ledger. Dacă scazi mai mult decât soldul, tool-ul plafonează la soldul existent și întoarce `requestedPoints` + `pointsChanged` (valoarea aplicată real).
- După orice scriere POS: verifică prin `get_pos_loyalty_config` sau `get_customer_loyalty`, apoi deschide `/loyalty?tab=settings` sau `/loyalty?tab=customers` și spune userului să dea refresh dacă browserul ține cache.

**Ce rămâne în pagină (Chrome / ghidare):**
- `navigate("/loyalty?tab=settings")` — niveluri/tier-uri POS, recompense, campanii speciale și verificarea vizuală a setărilor.
- `navigate("/loyalty?tab=customers")` — clienți cu puncte, solduri, istoric, filtrare pe nivel.
- `navigate("/loyalty?tab=overview")` — privire de ansamblu: puncte emise/răscumpărate, top clienți.
- Link live: `gaseste_in_aplicatie("fidelizare")` sau `gaseste_in_aplicatie("loialitate")` → întoarce `/loyalty`.

Pentru „pornește programul de fidelitate" la POS: citește întâi `get_pos_loyalty_config`, propune regula (ex. 1 punct/leu, 100 puncte = 5 lei, bonus înscriere), confirmă cu userul, apoi `set_pos_loyalty_settings(active:true, ...)`. Nivelurile și recompensele le arăți/completezi în `/loyalty?tab=settings`. Punctele se acumulează automat la vânzări către client **identificat** (telefon/card de fidelitate); vânzările anonime NU acumulează.

## Cele câteva locuri cu click (nu există tool)
- **Nivelurile/recompensele POS avansate** — pagină (`/loyalty?tab=settings`), vezi secțiunea B. Configul de bază și ajustările de puncte au tool-uri MCP.
- **Regulile de acumulare hotel** (puncte/noapte, multiplicatori) — `/hotel/crm?tab=rules`, se editează în pagină.
- **Ștergerea** unui nivel/recompense/client — nu prin conexiune; ghidează userul să șteargă din aplicație.

## Reguli (cele care contează)
- **POS ≠ hotel.** Nu căuta punctele de cazare în `/loyalty` și nici clienții de restaurant în `/hotel/crm`. Tool-urile hotel `create_loyalty_*`/`award_loyalty_points`/`redeem_loyalty_points`/`expire`/`recompute_*`/`drop_alerts` operează pe **oaspeți hotel** (`guestProfileId`). Tool-urile POS sunt `get_pos_loyalty_config`, `set_pos_loyalty_settings`, `get_customer_loyalty`, `award_customer_loyalty_points` și operează pe **clienți POS** (`customerId`). Dacă userul cere „adaugă un nivel" și are restaurant fără hotel → e configurare în `/loyalty?tab=settings`, NU `create_loyalty_tier`.
- **`award_loyalty_points` cu motiv, mereu.** Rămâne auditat în ledger. Folosește valori negative pentru corecții/scăderi.
- **`award_customer_loyalty_points` cu motiv, mereu.** Pentru POS, valorile negative sunt plafonate la soldul existent; raportează utilizatorului punctele aplicate real (`pointsChanged`), nu doar ce a cerut.
- **Confirmă cu citire, nu repeta scrierea.** După o scriere, interfața poate arăta valori vechi până la refresh (cache browser). Re-citește cu `get_hotel_loyalty_overview`/`get_guest_loyalty_detail`, nu da scrierea din nou.
- **„De ce nu urcă clientul de nivel?"** Verifică pragul nivelului (tab Tier-uri / Setări) vs soldul clientului. La hotel, după modificări de date rulează `recompute_guest_loyalty(guestProfileId)`; segmentele RFM se reîmprospătează cu `recompute_loyalty_rfm`.
- **GDPR înainte de campanii.** Înainte să trimiți oferte/win-back către segmente de loialitate, respectă opt-out-ul per canal (email/SMS/WhatsApp). Vezi `knowledge/gdpr-clienti-oaspeti.md`.
- **Arată, nu doar fă.** După fiecare acțiune, deschide pagina pe tab-ul potrivit (`?tab=`) + screenshot. Limbaj de restaurant/hotel cu userul („i-am dat 500 de puncte", „am adăugat nivelul Gold de la 2000 de puncte"), nu jargon (`earnMultiplier`, `guestProfileId`).
- **Permisiune:** scrierile cer modulul **Rezervări & Clienți** (`rezervari_clienti`) pe token. Citirile (overview/detaliu/NBA/funnel) merg oricum. „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul. Catalogul complet de tool-uri + permisiuni e în `knowledge/tools-mcp.md`.
- **Nu inventa** solduri, praguri sau valori de recompensă. Ce nu știi → citești cu un tool sau întrebi userul.

## Legături
- Concepte + fluxuri + FAQ + capcane loialitate → `knowledge/loialitate-fidelizare.md`.
- Cum conduci Chrome (deep-link `?tab=`, screenshot = livrabil, click doar la nevoie, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Găsirea VIP-urilor / clienților care pleacă, segmente → `knowledge/segmentare-clienti.md` + skill-ul `gestioneaza-crm`.
- Trimiterea ofertei de reactivare după win-back → `knowledge/email-marketing.md` / `knowledge/marketing-social.md` + skill-ul `programeaza-postare`.
- Respectarea consimțământului înainte de campanii → `knowledge/gdpr-clienti-oaspeti.md`.
- Unde e o pagină / link direct → tool-ul `gaseste_in_aplicatie` sau skill-ul `gaseste-pagina`.
- Blocaj (ceva ce nu se poate prin conexiune — ex. regulă de acumulare prin MCP) → `trimite_ticket_symbai` (sugestie) + ghidează în aplicație.
