# Agenți AI pentru clienți (chat pe site/portal + recepționer telefonic) — retrași

Agenții de chat de pe website/portal și Recepționerul telefonic (Twilio + ElevenLabs) au fost **scoși din Symbai pe 25.09.2026**. Uneltele de creare, canale, test public, voce și diagnostic nu mai există. Skill-ul `creeaza-agent-client` explică userului ce s-a schimbat.

## Ce rămâne

- **Istoricul conversațiilor vechi** — `list_agent_conversations(brandId, limit)` → `get_agent_conversation(sessionId)`. Doar citire.
- **Memoriile de brand** — titlu + conținut + categorie: regulile casei, programul de sărbători, parcarea, ofertele, povestea locului.
  - `list_brand_memories(brandId)` — citește ÎNTÂI, ca să nu dublezi.
  - `upsert_brand_memory({ id?, brandId, title, content, category, paused })` — fără `id` = creare; `paused: true` o scoate din uz fără ștergere. Scrie doar după acordul omului.
  - `read_brand_memories(brandId, category)` — memoriile active, folosite la marketing și comunicare.
- **Contextul businessului** — `get_business_context(brandId)`: brand, unități, program, ce vinde, memorii.

## Unde trimiți cererea

| Cererea | Ghid |
|---|---|
| răspunsuri automate la mesajele clienților pe WhatsApp | skill `monitorizeaza-whatsapp` (Symbai Connect, la mesaje noi) |
| răspuns pe WhatsApp în numele userului | skill `raspunde-whatsapp` |
| asistent AI pentru echipă în grupurile POS/Staff | skill `gestioneaza-asistentii` |
| „vreau totuși chat pe site / la telefon” | skill `trimite-ticket-suport` (sugestie către echipa Symbai) |
