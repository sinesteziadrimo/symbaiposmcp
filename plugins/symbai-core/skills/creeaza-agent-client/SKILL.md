---
name: creeaza-agent-client
description: FUNCȚIE RETRASĂ — agenții de chat pentru clienți (website/portal) și Recepționerul telefonic AI au fost scoși din Symbai. Spune-i userului asta și arată ce rămâne (istoricul conversațiilor, memoriile de brand, răspunsurile automate pe WhatsApp prin Symbai Connect). La „vreau un bot pe site", „agent de rezervări", „să răspundă AI-ul la telefon", „agentul nu răspunde", „schimbă vocea agentului".
---

# Agenți pentru clienți — funcție retrasă

Agenții de chat de pe website/portal și Recepționerul telefonic (Twilio + ElevenLabs) **nu mai există în Symbai** din 25.09.2026. Uneltele lor (creare din șablon, canale, test public, voce, diagnostic) au fost scoase. Nu le căuta și nu promite configurarea lor.

## Ce îi spui userului

O frază scurtă: „Agenții de chat pentru clienți și recepționerul telefonic au fost retrași din Symbai.” Apoi oferă ce rămâne, după ce vrea de fapt.

## Ce rămâne

| Userul vrea… | Ce folosești |
|---|---|
| să vadă ce au scris clienții cu agenții vechi | `list_agent_conversations(brandId)` → `get_agent_conversation(sessionId)` (doar citire, istoric) |
| să-și noteze regulile casei, programul special, ofertele | `list_brand_memories(brandId)` (verifici dublurile) → `upsert_brand_memory(...)` |
| un rezumat complet al businessului (brand, unități, program, ce vinde) | `get_business_context(brandId)` |
| răspunsuri automate la mesajele clienților pe WhatsApp | skill-ul `monitorizeaza-whatsapp` (Symbai Connect, la mesaje noi) |
| un asistent AI pentru echipă (grupuri POS/Staff) | skill-ul `gestioneaza-asistentii` |
| o funcție care lipsește | skill-ul `trimite-ticket-suport` (sugestie către echipa Symbai) |

## Ce NU faci

- Nu inventa unelte de agenți sau de voce și nu trimite userul pe pagini vechi de agenți.
- Nu promite chat pe site sau răspuns la telefon prin Symbai.
- `upsert_brand_memory` scrie date reale: arată textul și cere acordul înainte de apel.
