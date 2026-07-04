# Comunicare & WhatsApp (inbox unificat)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Symbai adună într-un singur inbox mesajele de la clienți de pe toate canalele — WhatsApp Business, mesaje directe și comentarii de pe paginile sociale — ca să le poți citi și răspunde dintr-un singur loc, cu sugestii de răspuns de la AI. Conversațiile se pot lega de fișa clientului și de pipeline-ul de vânzări (CRM). Înainte de orice mesaj de marketing, sistemul verifică automat consimțământul. Acest ghid e despre conversațiile 1-la-1 cu clienții; pentru postări programate și reclame, vezi ghidul „Marketing & Social Media".

## Concepte

- **Inbox unificat** — toate conversațiile (WhatsApp + DM-uri + comentarii sociale) într-un singur ecran, cu istoricul pe client.
- **WhatsApp Business** — canal oficial conectat prin Business API; permite mesaje către clienți cu reguli (ferestre de 24h, șabloane pre-aprobate pentru mesaje inițiate de business).
- **Sugestie AI de răspuns** — asistentul propune un text de răspuns pe baza conversației; tu îl ajustezi și trimiți.
- **Consimțământ de marketing** — un client poate fi contactat pe un canal doar dacă a acceptat; mesajele de tip serviciu (răspuns la întrebarea lui) sunt diferite de cele de marketing.
- **Rutare către CRM** — o conversație poate deveni un „deal" sau o sarcină pentru un agent de vânzări.

## Pagini

- **WhatsApp Inbox** (`/whatsapp-inbox`) — conversațiile WhatsApp, cu istoricul și răspuns rapid.
- **Conturi Social** (`/social-media`, tab WhatsApp Business) — conectezi/administrezi numărul de WhatsApp Business.
- **Audiență / Inbox social** (`/marketing/audience`, tab Inbox) — inbox-ul unificat al mesajelor sociale.
- **Sales CRM** (`/sales-crm`) — secțiunea Activități include conversațiile legate de un client/deal.

## Fluxuri pas-cu-pas

1. **Conectezi WhatsApp Business**: /social-media → tab WhatsApp Business → urmezi pașii (numărul trebuie verificat, permisiuni Business API). Nu cere niciodată parole — aprobi în browserul tău.
2. **Răspunzi la un mesaj primit**: deschizi inbox-ul → vezi conversația → ceri o sugestie AI → ajustezi → trimiți. Prin conexiune: `list_conversations` (vezi conversațiile) → `get_conversation_messages` (citești firul) → `reply_to_conversation` (trimiți răspunsul, doar după ce utilizatorul confirmă textul).
3. **Verifici dacă poți trimite un mesaj de marketing** către un client: `check_marketing_allowed` (verifică consimțământul + fereastra permisă).
4. **Vezi rapid conversațiile recente** (pentru context, ex. înainte de o campanie): `marketing_recent_conversations`.
5. **Verifici starea canalelor de comunicare** (ce e conectat, dacă merge): `comms_get_status`.
6. **Legi o conversație de un client/deal**: din inbox sau din Sales CRM, ca să ai tot istoricul la un loc.

## Tool-uri MCP utile

- Citire: `list_conversations`, `get_conversation_messages`, `list_whatsapp_accounts`, `comms_get_status`, `marketing_recent_conversations`, `check_marketing_allowed`.
- Scriere (trimiteri REALE către clienți — confirmă mereu cu utilizatorul înainte): `reply_to_conversation` (răspunzi într-o conversație existentă, pe canalul ei nativ — WhatsApp / Messenger / Instagram), `send_whatsapp_message` (mesaj text către un număr), `send_whatsapp_media` (imagine/document/video printr-un link public).
- Înainte de orice mesaj cu caracter de marketing rulează `check_marketing_allowed`. Ce tool-uri de scriere sunt disponibile pe tokenul tău vezi în catalogul din `tools-mcp.md`.

## Întrebări frecvente

- **De ce nu pot trimite un mesaj WhatsApp inițiat de mine oricând?** WhatsApp Business permite mesaje libere doar în fereastra de 24h de la ultimul mesaj al clientului; în afara ei trebuie un șablon pre-aprobat. Mesajele de marketing cer și consimțământ.
- **Unde văd toate mesajele dintr-un loc?** În inbox-ul unificat (/marketing/audience tab Inbox sau /whatsapp-inbox pentru WhatsApp).
- **Sugestia AI trimite singură răspunsul?** Nu — e o propunere; o confirmi tu.
- **De ce un client nu primește mesajul de campanie?** Probabil opt-out de marketing pe canal — vezi GDPR (`check_marketing_allowed`).

## Capcane

- **Mesaj de serviciu vs marketing** — răspunsul la întrebarea unui client e mereu permis; mesajul promoțional cere consimțământ + fereastra potrivită.
- **Nu cere parole** la conectarea WhatsApp/social — aprobarea o face utilizatorul în browserul lui.
- **Conversațiile sunt date personale** — respectă GDPR (vezi ghidul dedicat) la export/ștergere.
- Pentru conectări care nu merg (token expirat, canal căzut), `comms_get_status` îți spune ce e de reparat.
