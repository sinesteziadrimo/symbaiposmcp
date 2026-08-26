---
name: creeaza-agent-client
description: Creează, publică și dă VOCE agenților AI care vorbesc cu clienții — chat pe website și în portal, plus Recepționerul telefonic (răspunde la telefon prin ElevenLabs). Faci tot prin conexiune (MCP): înțelegi businessul întrebând ce nu scrie în date, scrii promptul și cunoștințele, îl publici pe canale, îl testezi CA UN CLIENT REAL și verifici că apelurile chiar intră. Folosește la „fă-mi un agent care răspunde clienților", „vreau un bot pe site", „chat pe website", „agent de rezervări", „agent de vânzări", „cineva să răspundă la telefon", „recepționer telefonic AI", „vreau să răspundă AI-ul la telefon", „leagă-l la ElevenLabs", „ce voce are agentul", „schimbă vocea agentului", „de ce nu răspunde chatul de pe site", „agentul e făcut dar nu răspunde nimănui", „clientul mi-a scris pe site și n-a răspuns nimeni", „de ce nu intră apelurile la recepționer", „testează agentul ca un client", „pune agentul pe site", „îmbunătățește agentul existent".
---

# Agenți care vorbesc cu clienții — de la zero până la „un client real a primit răspuns"

Userul vrea ca **cineva să răspundă clienților lui** — pe site, în portal sau la telefon — fără să stea el. În Symbai asta înseamnă două lucruri diferite, cu aceeași sursă de adevăr despre business:

| | **Agent de chat** | **Recepționer telefonic** |
|---|---|---|
| Unde vorbește | bula de chat de pe site, portalul clienților, (Messenger/Instagram/WhatsApp dacă sunt conectate) | la telefon, pe numărul localului |
| Cine îl aude | vizitatori NELOGAȚI + clienți logați | oricine sună |
| Ce poate face | răspunde, verifică disponibilitate, creează rezervări/lead-uri (dacă îi dai capabilități) | la fel, plus preia mesaje și transferă la un coleg |
| Se creează cu | `create_chat_agent_from_template` / `create_chat_agent` | `create_voice_agent_from_chat_agent` sau `update_voice_agent_config` |

> ⚠️ **Regula care contează cel mai mult:** „agent creat" ≠ „clientul primește răspuns". Un agent poate fi salvat, activ, cu prompt frumos — și totuși să nu fie pe niciun canal public, sau telefonul să nu-i fie legat. **Nu declara niciodată gata până n-ai rulat testul de client real** (`test_public_website_chat`) și, la telefon, `diagnose_voice_agent` verde.

## Înainte de orice

1. Citește **`knowledge/agenti-clienti.md`** — ce e fiecare tip de agent, cum decide sistemul cine răspunde (routerul), ce înseamnă capabilitățile, memoriile de brand, cum funcționează telefonul (Twilio + ElevenLabs) și lista completă de tool-uri.
2. **`get_business_context(brandId)`** — ÎNTOTDEAUNA primul tool. Îți dă brandul, unitățile, meniul, jocurile/pachetele, memoriile existente, agenții deja creați, canalele în uz și, la final, o listă `gaps[]` cu ce lipsește. Din el scrii un prompt care nu inventează.
3. **`list_chat_agents(brandId)`** — poate există deja un agent care trebuie îmbunătățit, nu dublat. Doi agenți de același tip se bat pe aceleași mesaje.

## Pasul 1 — Înțelege businessul (întreabă ce nu scrie în date)

Datele îți spun ce vinde. **Nu-ți spun** regulile casei, ce n-are voie agentul să promită, când trebuie chemat un om. Alea se află doar întrebând.

**`list_business_discovery_questions(brandId, agentType)`** îți dă exact întrebările rămase — le sare pe cele la care memoriile brandului răspund deja. Fiecare vine cu `why` (de ce contează) și `target` (unde ajunge răspunsul: memorie de brand / prompt / configurare).

Cum le pui:
- **Una pe rând**, în limbaj de proprietar de local, nu de configurator. „Ce reguli trebuie să știe clientul dinainte?" nu „completează câmpul customInstructions".
- **Maximum 4-6 per sesiune.** Dacă userul zice „fă tu" sau „nu știu" → propune o variantă concretă bazată pe `get_business_context`, spune-i ce ai presupus și mergi mai departe. Nu-l bloca.
- **Scrie fiecare răspuns imediat unde îi e locul**, nu la final: cunoștințe → `upsert_brand_memory`; comportament → în promptul agentului; numere și comutatoare → în configurare.
- Verifică întâi `list_brand_memories(brandId)` ca să nu dublezi o memorie existentă.

Întrebările care contează cel mai mult, indiferent de tip: **regulile casei** (avans, rezervare minimă, animale, copii), **detaliile practice** (parcare, terasă, acces), **programul special**, **ce NU are voie să spună** și **când cheamă un om**.

## Pasul 2 — Creează agentul

**Aproape întotdeauna pornește din șablon** — prompturile și capabilitățile sunt deja corecte:

```
list_agent_templates()
create_chat_agent_from_template({ templateId: "receptie-rezervari", brandId, name: "…" })
```

| Userul vrea… | Șablon |
|---|---|
| „să-mi ia rezervările" | `receptie-rezervari` |
| „să vândă / să dea oferte / petreceri" | `vanzari-oferte` |
| „să răspundă la reclamații" | `suport-clienti` |
| „să răspundă la întrebări (program, meniu, unde sunteți)" | `informatii-locatie` |
| „să anunțe echipa dacă e o problemă gravă" | `urgente-locatie` |

`create_chat_agent` de la zero doar când niciun șablon nu se potrivește. Atunci: promptul scrie **ce face**, **ce NU face**, **situații dificile**, **stil** — și NU repetă regulile de securitate sau data curentă (le adaugă runtime-ul singur).

Apoi personalizează din ce ai aflat la Pasul 1: `update_chat_agent({ agentId, systemPrompt, greeting, tone })`.

**Capabilitățile** (`capabilities`) sunt ce diferențiază un bot de un agent care chiar face treabă: verifică disponibilitate, creează rezervări, citește pachetele. Se dau doar la `sales` și `booking`. ⚠️ Un agent cu `create_reservations` creează rezervări REALE — spune-i userului asta explicit înainte.

## Pasul 3 — PUBLICĂ-l (pasul pe care toată lumea îl sare)

Un agent creat via conexiune ajunge implicit **doar pe canalul `portal`**. Vizitatorii site-ului nu ajung niciodată la el.

```
set_agent_channels({ agentId, channels: ["portal", "website"] })
get_agent_publish_status(brandId)
```

`get_agent_publish_status` răspunde la întrebarea reală — *„poate un client să vorbească acum cu agenții mei?"* — și îți dă `publicChatUrl` + `embedSnippet` (iframe-ul de pus pe site). Dacă întoarce `blockers[]`, alea sunt exact motivele pentru care nimeni nu primește răspuns. Rezolvă-le, nu le raporta ca „aproape gata".

## Pasul 4 — Testează CA UN CLIENT, nu ca admin

Două teste diferite, ambele obligatorii:

| Tool | Ce simulează |
|---|---|
| `test_chat_agent({ message, agentId })` | rulează runtime-ul complet, cu drepturi de admin — bun pentru a verifica tonul și rutarea |
| **`test_public_website_chat({ message, brandId })`** | **deschide o sesiune anonimă REALĂ, ca un vizitator de pe site** — aici vezi și refuzurile pe care le-ar primi clientul |

⚠️ `test_public_website_chat` costă: conversația e reală, consumă din bugetul AI al clientului,
intră în plafonul zilnic al brandului și apare în `list_agent_conversations` ca vizitator.
3-5 mesaje de test sunt suficiente; nu-l folosi ca buclă de dezvoltare.

Rulează minimum 3 mesaje reale prin `test_public_website_chat`: o întrebare de program, una de preț/meniu și una din specificul lui („aveți loc sâmbătă la 8 pentru 6 persoane?"). Dacă răspunde generic sau spune „contactați restaurantul" → lipsesc memorii de brand, întoarce-te la Pasul 1.

## Pasul 5 — Dă-i voce (telefon)

Recepționerul telefonic e o configurare separată, dar poate porni din personalitatea agentului de chat:

```
list_voice_options({ language: "ro" })        # alege o voce REALĂ, nu un id inventat
create_voice_agent_from_chat_agent({
  agentId, phoneNumber: "+40…", voice: "<voiceId>", transferPhone: "+40…", enabled: false
})
diagnose_voice_agent({ brandId })             # ← poarta
```

⚠️ **Dacă pe acel scope există deja un recepționer, tool-ul REFUZĂ** și ți-l descrie. Corect:
`update_voice_agent_config` îl edită, sau creezi pe altă unitate (`locationId`). Folosește
`overwriteExisting: true` DOAR după ce i-ai spus proprietarului ce se pierde — instrucțiunile
scrise de el despre local nu au istoric și nu se pot recupera.

**`diagnose_voice_agent` e singurul lucru care contează.** Testează efectiv: cheia ElevenLabs (nu doar dacă e completată), dacă agentul mai există la provider, dacă numărul e în contul Twilio și dacă Voice URL-ul lui arată spre Symbai, legarea numărului pe SIP, vocea aleasă, transferul la om. Fiecare eșec vine cu ce trebuie făcut.

- `callable: true` → pornește-l: `update_voice_agent_config({ brandId, enabled: true })`.
- `callable: false` → **nu-l porni**. Repară blocantele; pentru agent inexistent la provider sau număr nelegat: `provision_voice_agent({ brandId })`.
- Testează conversația fără să suni: `simulate_voice_call({ message: "aș vrea o masă sâmbătă la 7" })` — aceleași instrucțiuni, tool-uri și verificare a apelantului ca la telefon. ⚠️ Rezervările create în simulare sunt REALE.

**Transportul** (`transport`): lasă **`bridge`** (implicit) — apelul trece prin serverul Symbai, deci rezervările și verificarea identității merg fără nimic configurat manual. `sip` doar dacă userul cere latență minimă; atunci numărul trebuie preluat în contul ElevenLabs, ceea ce face `provision_voice_agent` automat.

**Vocea:** un `voice_id` greșit NU dă eroare — agentul vorbește pur și simplu cu vocea implicită. De asta se alege din `list_voice_options`, niciodată din memorie.

## Pasul 6 — Predă-i userului ceva folosibil

Nu „am creat agentul". Spune-i:
1. **Cine răspunde și unde** (nume agent + canale + link public).
2. **Snippet-ul de pus pe site** (din `get_agent_publish_status`) — sau, dacă site-ul e făcut în Symbai, activează bula din portal/website config.
3. **Un exemplu real de conversație** din testul tău.
4. **Ce NU știe încă** — lipsurile din `gaps[]` pe care userul trebuie să le completeze.
5. La telefon: **numărul** și rezultatul `diagnose_voice_agent`, în cuvintele lui.

## Depanare — simptom → cauză reală

| Userul zice… | Verifică |
|---|---|
| „am pus chatul pe site și nu răspunde nimic" | `get_agent_publish_status` → cel mai des: niciun agent pe canalul `website`. `set_agent_channels`. |
| „chatul zice că nu e configurat" | lipsește cheia OpenAI a instanței (apare în `blockers[]`). |
| „răspunde, dar aiurea / general" | zero memorii de brand → `list_brand_memories` + Pasul 1. |
| „răspunde altcineva decât vreau" | doi agenți activi de același tip, sau routerul alege altul — `list_chat_agents`, dezactivează dubluri. |
| „nu-mi face rezervări" | agentul n-are `capabilities` de rezervare, sau e tip `info` în loc de `booking`. |
| „sună și nu răspunde nimeni" | `diagnose_voice_agent` — de obicei Voice URL-ul numărului în Twilio nu arată spre Symbai, sau agentul a fost șters din consola ElevenLabs. |
| „vorbește cu altă voce" | `voice_id` inexistent în cont → `list_voice_options`. |
| „a promis ceva ce nu putem face" | lipsește secțiunea „CE NU FACI" din prompt + memorie de brand cu regula. |

## Ce NU faci

- **Nu ștergi agenți prin conexiune** — dezactivezi cu `update_chat_agent({ active: false })`. Istoricul conversațiilor rămâne.
- **Nu pornești un recepționer telefonic fără număr** și fără `diagnose_voice_agent` verde — clientul sună într-o linie moartă și crede că a sunat la local.
- **Nu inventezi prețuri, program sau servicii** în prompt. Ce nu e în `get_business_context` sau într-o memorie de brand, se întreabă.
- **Nu pui capabilități de scriere** (rezervări, deal-uri) fără să-i spui userului că agentul va crea lucruri reale.
- **Nu raporta „gata" pe baza faptului că tool-ul a întors success** — raportează pe baza testului de client real.
