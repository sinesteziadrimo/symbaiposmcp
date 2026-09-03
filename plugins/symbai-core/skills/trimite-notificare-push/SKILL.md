---
name: trimite-notificare-push
description: Campanii de notificări push (telefon și browser) către clienți — creare, segmentare, programare, trimitere, analiză, preferințe și dezabonări. La „trimite o notificare push", „anunță clienții pe telefon", „campanie push cu oferta de azi", „programează un push mâine la 11", „cum a mers notificarea", „oprește push pentru clientul X".
---

# Trimite o notificare push (web + mobil)

Notificările push ajung pe telefonul clientului (aplicația Symbai) și în browser (portalul web), chiar dacă clientul nu e activ în aplicație. Sunt cel mai direct canal — de aceea le tratăm cu grijă: marketingul respectă **consimțământul**, **ora de liniște** și o **limită de frecvență**, ca să nu enervezi clienții și să nu-i pierzi.

## Pasul 0 — înțelege diferența
- **Push de MARKETING** (oferte, fidelitate, evenimente, produse noi) → trece prin filtre: dezabonați, oră de liniște (implicit 21:00–08:00, în fusul clientului), max ~1–2/săptămână per client. Cei filtrați NU primesc (apar ca „săriți", nu ca eșec).
- **Push TRANZACȚIONAL** (comandă gata, rezervare confirmată) → pleacă mereu, fără filtre. Acesta e pus automat de aplicație; tu te ocupi de marketing.

## Trimitere rapidă (campanie)
1. **Vezi pe cine poți anunța:** `preview_push_audience` cu `audienceType` + `audienceConfig` (sau `campaignId`). Îți spune câți clienți sunt în segment, câți au un dispozitiv push (web/mobil) și câți rămân livrabili după dezabonări. **Fă mereu asta înainte de a trimite** — push merge doar la cine s-a abonat din aplicație/portal.
2. **Creează campania (draft):** `create_push_campaign`:
   - `name` (nume intern), `title` (titlu scurt), `body` (textul) — obligatorii;
   - `topic`: `offers` (oferte), `loyalty` (fidelitate), `events` (evenimente), `new_products` (produse noi), `general`;
   - opțional `imageUrl` (imagine mare), `navigateUrl` (ce se deschide la atingere — un produs, o pagină), `channels` (`["web","expo"]` implicit);
   - `audienceType` + `audienceConfig` (vezi „Segmente" mai jos);
   - opțional `holdoutPercent` (grup de control, ca să măsori impactul) și `abVariant` (test A/B).
3. **Confirmă audiența** cu `preview_push_audience(campaignId)`.
4. **Trimite ACUM:** `send_push_campaign(campaignId, confirm: true)` — ⚠ trimitere REALĂ. Întâi cere-l fără `confirm` ca să vezi câți destinatari cu dispozitiv ai, **confirmă numărul cu utilizatorul**, apoi reapelează cu `confirm: true`.
   - **SAU programează:** `schedule_push_campaign(campaignId, scheduledAt)` cu o oră ISO viitoare (ex. `2026-06-22T11:00:00+03:00`) → pleacă automat la acea oră.
5. **Vezi rezultatul:** `get_push_campaign_analytics(campaignId)` — câte trimise, deschise (CTR), câte sărite prin consimțământ/limită, câte în grupul de control.

## Segmente (cui trimiți)
`audienceType` + `audienceConfig`:
- `all` — toți clienții cu cont/portal.
- `segment` — `{ conditions: [...] }` cu: `loyaltyTier` (=valoare), `totalVisits`/`totalSpent` (`gte`/`lte`), `lastVisitDays` (`within`/`notWithin`), `birthDateNextDays` (`within`).
- `tags` — `{ tags: ["VIP"], tagLogic: "or"|"and" }`.
- `groups` — `{ groupIds: [...] }` (grupuri de clienți).
- `portal_user_ids` / `customer_ids` — `{ portalUserIds: [...] }` sau `{ customerIds: [...] }` pentru o listă exactă.

Nu știi ce să targetezi? `get_push_segment_opportunities` îți propune segmente care **au dispozitive** (re-activare la 30 zile, aniversări, clienți fideli, frecvenți), gata de pus în `create_push_campaign`.

## Test, preferințe, dezabonare
- **Test pe tine/un client:** `send_test_push(portalUserId sau customerId, title?, body?)` — trimite un push de test (tranzacțional) ca să vezi cum arată pe dispozitiv.
- **Setează preferințe client:** `set_push_preferences(customerId/portalUserId, pushEnabled?, topicOffers?, topicLoyalty?, ..., quietHoursStart?, quietHoursEnd?, timezone?, freqCapPerDay?, freqCapPerWeek?)`.
- **Dezabonează un client (opt-out):** `add_push_suppression(customerId/portalUserId, topic?)` — `topic: "all"` îl scoate de la tot.
- **De ce nu primește X?** `get_push_consent_status(customerId/portalUserId)` — câte dispozitive are, dacă push e activ, ce topicuri, ce suprimări.
- **Sănătatea push a brandului:** `get_brand_push_deliverability` — câte abonamente web + dispozitive mobil, trimise/eșuate/deschise pe 30 zile.

## Reguli (foarte important)
- **Push merge DOAR la clienții care s-au abonat** din aplicația mobilă sau au acceptat notificările în portalul web. Dacă `preview_push_audience` arată puține dispozitive, încurajează clienții să instaleze aplicația / să accepte notificările (pe iPhone, push în browser cere adăugarea portalului pe ecranul principal).
- **Nu spama.** Limita implicită ~1–2/săptămână per client există ca să nu se dezaboneze. Pentru oferte mari, un singur push bine țintit bate cinci la rând.
- **Mereu confirmă** numărul de destinatari cu utilizatorul înainte de `send_push_campaign(confirm:true)`. Trimiterea e reală și ireversibilă.
- **Oră bună:** pentru restaurante, ~10:30 (prânz) și ~17:00 (cină) merg cel mai bine; evită noaptea (oricum e blocat de ora de liniște). `schedule_push_campaign` te lasă să nimerești ora.
- **Automatizări:** push poate fi un pas într-un playbook CRM (ex. „client inactiv de 30 zile → push cu ofertă"). Vezi skill-ul `gestioneaza-crm`.
- **Push vs email vs WhatsApp:** push = anunțuri scurte, imediate, pentru cine are aplicația; email = conținut bogat; WhatsApp = conversație. Nu trimite același mesaj pe toate canalele în aceeași zi.
- Necesită scriere pe modulul „Comunicare (Email / WhatsApp / Push)"; dacă lipsește, îndrumă spre portal Hub → Acces AI.
- Detalii de concept în `knowledge/push-notificari-marketing.md`. Pentru a ajunge la pagina campaniilor: `gaseste_in_aplicatie("campanii push")`.
