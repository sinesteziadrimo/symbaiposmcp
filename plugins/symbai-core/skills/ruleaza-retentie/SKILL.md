---
name: ruleaza-retentie
description: Rulează o campanie de retenție cap-coadă — recâștigă clienții pierduți, ține-i pe cei în pericol, premiază VIP-urile, sărbătorește aniversarea. Alege rețeta potrivită (win-back / at-risk / aniversare / VIP), dimensionează audiența, verifică consimțământul, trimite pe canalul corect și măsoară câștigul real cu un grup de control. Folosește la „recâștigă clienții pierduți", „campanie de retenție", „win-back", „clienți inactivi", „clienții nu mai vin", „adu înapoi clienții care nu au mai trecut", „premiază clienții fideli".
---

# Rulează o campanie de retenție (ca un specialist CRM)

Retenția e cea mai profitabilă acțiune de marketing: o campanie de retenție aduce **~3,3x** ROI-ul uneia de achiziție, iar un client recâștigat valorează un bon mediu întreg. Logica e mereu aceeași: **CITEȘTE pe cine ai → ALEGE rețeta → DIMENSIONEAZĂ audiența → VERIFICĂ consimțământul → TRIMITE pe canalul rețetei → MĂSOARĂ cu un grup de control.**

Citește întâi `knowledge/crm-retete-retentie.md` (rețetele complete: win-back, at-risk, aniversare, VIP, cu pragurile și pașii) și `knowledge/comunicare-cross-channel-lifecycle.md` (regula anti-oboseală pe toate canalele).

## 1. Reîmprospătează datele (înainte de orice cifră)

Segmentele și sugestiile trebuie să fie proaspete, altfel trimiți greșit. [citire/marketing]
- `recompute_loyalty_rfm(brandId)` — reîmparte clienții în ~11 segmente cu nume (Campioni, Fideli, În pericol, Pe cale să adoarmă, Nu-i pierde, Hibernează, Pierduți...). **Recalculează lunar** ca segmentele să rămână gata de campanie.
- `recompute_nba(brandId)` apoi `list_nba_suggestions(limit:30)` — următoarea-cea-mai-bună-acțiune per client (win_back / aniversare / upsell). De aici iei cine merită un mesaj acum.
- `evaluate_loyalty_drop_alerts(brandId)` — clienții BUNI care s-au răcit (frecvența a scăzut brusc). Ăștia sunt prioritatea #1 la win-back.

## 2. Alege rețeta din `knowledge/crm-retete-retentie.md`

Fiecare rețetă are un declanșator, un canal recomandat și un ritm. Pe scurt:

| Rețetă | Pe cine țintești | Canal | Reper 2026 |
|---|---|---|---|
| **Win-back** | inactivi de **30 zile** (prima atingere), apoi 60/90 | email → push → WhatsApp, escaladat | recuperezi **12-18%** din inactivi; fereastra de aur **Joi/Vineri 16:00-18:00** |
| **At-risk** | scădere de frecvență (drop-alert), încă nu plecat | push scurt + email blând | prinde intenția ÎNAINTE să dispară |
| **Aniversare** | clienți cu ziua în **14 zile** | email + push personal | cel mai mare venit/mesaj din HoReCa (**~85 lei/răscumpărare**); fără grup de control (e personal) |
| **VIP / fideli** | Campioni, top-LTV, aproape de un tier nou | push „mai ai X puncte până la Gold" + email | membrii vizitează **+22%** și cheltuie **+18-38%** |

**Regula rețetei:** un client *pierdut* primește o ofertă; un client *fidel* primește recunoaștere (puncte, status, mulțumire), nu o reducere de care n-are nevoie. Nu da reduceri cui ar fi cumpărat oricum.

## 3. Dimensionează audiența (vezi EXACT câți și dacă au voie)

Înainte să trimiți, află numărul real și opt-in-ul. [citire/marketing]
- `preview_guest_segment(...)` — câți clienți intră în segment (ex. „inactivi 60-90 zile") + câți au email/SMS opt-in. **Niciodată nu trimite fără să fi văzut numărul.**
- `preview_email_audience(...)` — pentru o campanie de email, câți destinatari eligibili rămân după curățare.
- Pentru clienții răciți buni, pleacă de la lista din `evaluate_loyalty_drop_alerts`.

Dacă segmentul iese foarte mic (ex. sub câteva zeci), spune-i utilizatorului — o campanie pe 15 oameni nu merită automatizată; mai bine un mesaj personal.

## 4. Verifică consimțământul și frecvența (poarta obligatorie)

Înainte de ORICE trimitere în masă: [citire]
- `check_marketing_allowed(brandId)` — confirmă că poți trimite marketing pe canalul ales și că nu calci plafonul de frecvență.
- Reguli ferme (detaliu în `knowledge/comunicare-cross-channel-lifecycle.md`): **max 1-2 mesaje de marketing/client/zi, 3-5/săptămână**, pe TOATE canalele la un loc; **ora de liniște 21:00-08:00** în fusul clientului; respectă opt-out-ul per canal. 23% dintre clienți abandonează un brand care comunică prea des. Niciodată același mesaj pe 3 canale în aceeași zi.

## 5. Lasă 10% grup de control (ca să dovedești câștigul)

Pune deoparte **10% holdout** din segment (NU primește campania). La final compari conversia/lei pe grupul expus vs control — diferența = câștigul REAL adus de campanie, nu un număr de click-uri. Ai nevoie de ~200+ conversii în control pentru un rezultat sigur; pe segmente mici, sari peste holdout și raportează doar onest „prea puțini pentru măsurare statistică".
- La **email** și **push** pune holdout-ul direct în campanie (`holdoutPercent: 10`).
- La aniversare (personal, 1-la-1) **NU** pune holdout.

## 6. Execută pe canalul rețetei (cu confirmare la trimitere)

Trimite pe canalul din rețetă, escaladat în timp. Tot ce **trimite efectiv** cere `confirm: true` — confirmă întâi numărul cu utilizatorul. [marketing]

**Email** (mesajul bogat, povestea, oferta datată):
- `create_email_campaign(...)` → revezi conținutul cu utilizatorul → `send_email_campaign(campaignId, confirm: true)`.
- Pentru o secvență escaladată (zi 0 „ne e dor" fără reducere → +3 zile ofertă datată → last-chance): `create_email_sequence(...)` + `enroll_customers_in_email_sequence(...)`.
- Înainte de trimitere mare, un test: `send_test_email_campaign(...)`.

**Push** (urgent și scurt, pentru cei care n-au deschis emailul):
- `create_push_campaign(topic:"offers", imageUrl, navigateUrl spre oferta, holdoutPercent:10)` → `preview_push_audience(campaignId)` → `send_push_campaign(campaignId, confirm: true)`.
- Push rich (cu imagine) are **+25-40%** CTR vs text simplu; titlu ≤40 caractere, un singur îndemn.

**WhatsApp** (conversațional, ultima treaptă pentru segmentul cald care tot n-a reacționat):
- `send_whatsapp_message(..., confirm: true)` — doar către cei cu opt-in, după ce email+push n-au prins. Win-back-ul recuperează **12-18%** când emailul e dublat de SMS/WhatsApp.

**Ofertă ca mecanism** (reducerea care alimentează win-back-ul): creează-o din `creeaza-oferta` (`create_offer`). Pentru o ofertă cu termen pune `startsAt`+`expiresAt`; fără fereastră de timp oferta rulează 24/7 și pierzi marjă. Rulează întâi `preview_offer_margin` ca să nu vinzi în pierdere.

## 7. Măsoară (câștigul în lei, nu click-uri)

La 72h-2 săptămâni după campanie: [citire]
- `get_email_conversion_attribution(...)` — venit atribuit emailului (fereastră 7 zile). **Judecă pe click + venit/destinatar + conversii, NU pe rata de deschidere** (Apple Mail umflă deschiderile cu 15-60% — sunt false).
- `get_push_campaign_analytics(campaignId)` — CTR + rezultatul testului A/B + grupul de control.
- `list_playbook_runs(brandId)` — ce a rulat din automatizările de retenție și cu ce efect.
- Compară expus vs holdout: ăsta e lift-ul real. Bagă-l înapoi în următoarea campanie (pe ce segment/canal/oră a mers).

## Reguli

- **Retenție > achiziție:** un client recâștigat aduce ~3,3x ROI vs unul nou, iar emailul are cel mai mare ROI dintre canale (20:1-40:1). Pune efortul aici înainte de trafic rece.
- **Citește pe cine ai înainte să trimiți:** `recompute_loyalty_rfm` + `evaluate_loyalty_drop_alerts` lunar. Segment vechi = mesaj greșit.
- **Win-back la 30 zile, nu la 90:** prima atingere la ~30 zile de la ultima vizită prinde intenția înainte de dezangajare; cea mai bună fereastră Joi/Vineri 16:00-18:00. Escaladează blând → ofertă → last-chance pe 10-14 zile, apoi oprește-te.
- **Poarta de consimțământ e obligatorie:** `check_marketing_allowed` + opt-out per canal + ora de liniște 21:00-08:00 + plafon 1-2/zi, 3-5/săpt. înainte de orice trimitere în masă.
- **10% control la win-back/at-risk/VIP** ca să măsori câștigul real; NU la aniversare (e personal). Raportează lei/comenzi incrementale, nu deschideri.
- **Confirmă-first la tot ce trimite:** `send_email_campaign` / `send_push_campaign` / `send_whatsapp_message` cer `confirm: true` — confirmă numărul cu utilizatorul mai întâi.
- **Sunset (oprește) după ladder:** clienții care nu reacționează după toată secvența și ~90-180 zile de tăcere → scoate-i din trimiterile active (`add_email_suppression`) ca să protejezi reputația de trimitere. Win-back-ul are dezabonări mai multe — e normal și sănătos pentru igiena listei.
- **Nu da reduceri cui n-are nevoie:** fidelii primesc recunoaștere (puncte, status), nu discount. Reducerea o vede doar cine chiar avea nevoie de un imbold.
- Necesită scriere pe „CRM & Automatizări Marketing" + „Comunicare (Email/WhatsApp/Push)" (+ „Marketing & Social Media" pentru oferte). Dacă lipsesc, îndrumă spre portal Hub → Acces AI.
- Skill-uri vecine: `condu-marketingul` (planul de ansamblu), `gestioneaza-loialitate` (puncte/tiere/expirare), `gestioneaza-comunicare` (email/secvențe lifecycle), `trimite-notificare-push`, `creeaza-oferta`, `gestioneaza-reclame` (retargeting CRM al acelorași segmente). Concepte: `knowledge/crm-retete-retentie.md` + `knowledge/comunicare-cross-channel-lifecycle.md`.
