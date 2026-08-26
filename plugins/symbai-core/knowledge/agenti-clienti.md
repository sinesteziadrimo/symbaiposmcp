# Agenți AI care vorbesc cu clienții — chat pe site/portal + Recepționer telefonic

Referință completă pentru skill-ul `creeaza-agent-client`. Aici stau conceptele; skill-ul e procedura.

---

## 1. Cele două lumi

### Agentul de chat (`portal_ai_agents`)
Text. Răspunde în **bula de chat de pe website** (vizitatori nelogați) și în **portalul clienților** (clienți logați). Are: tip, prompt de sistem, salut, ton, canale, capabilități.

### Recepționerul telefonic (`voice_agent_configs`)
Voce. Răspunde **la telefonul localului**. Un singur recepționer per (brand, unitate). Are: număr, salut, informații despre local, voce, plafoane, transfer la om, politică de verificare a apelantului.

Sunt **sisteme separate cu aceeași sursă de cunoștințe** (memoriile de brand). `create_voice_agent_from_chat_agent` copiază personalitatea unui agent de chat în recepționer — o **copie**, nu o legătură live: editarea agentului de chat NU schimbă ce spune la telefon, tocmai ca nimeni să nu schimbe din greșeală vocea localului.

---

## 2. Tipurile de agent de chat și routerul

Cinci tipuri **rutabile**: `info`, `booking`, `sales`, `support`, `emergency`.

La fiecare mesaj, un router (model mic) citește conversația și decide **ce tip** răspunde. Apoi sistemul alege agentul activ de acel tip. Consecințe practice:

- **Doi agenți activi de același tip** = sistemul alege unul (la `sales`/`booking` cu un scor, altfel primul). Dacă userul zice „răspunde altcineva decât vreau", asta e cauza. Dezactivează dublura.
- **Un tip fără agent** = routerul nu-l poate alege; mesajul cade pe `info`.
- **`emergency` chiar anunță echipa** — notificare persistentă + push către manageri, o dată la 10 minute per sesiune. Agentului i se spune statusul REAL al notificării, ca să nu pretindă că „a anunțat" când n-a reușit. ⚠️ **Doar din sesiuni identificate** (portal): dintr-un chat public anonim agentul răspunde corect (personal / 112), dar NU trimite push — vezi secțiunea următoare.
- Routerul poate fi personalizat prin `routingPrompt` pe asistentul-container al brandului.

**Asistentul-container** (`portal_assistants`) grupează agenții unui brand și dă salutul implicit + promptul de rutare. Un brand funcționează și fără el.

---

## 3. Canale — unde e auzit agentul

`channels[]` pe agent: `portal`, `website`, `messenger`, `instagram`, `whatsapp`, `internal`.

⚠️ **Cel mai frecvent motiv pentru „am făcut agentul și nu răspunde nimeni":** agentul e doar pe `portal`. `create_chat_agent` prin conexiune pune implicit `["portal"]`; șabloanele pun `["portal", "website"]`. Repară cu `set_agent_channels`.

- `website` = bula publică de chat + pagina `/chat?brandId=<id>` (link de trimis / iframe de embed).
  Canalul e **aplicat de motor pe AMBELE căi**, nu doar afișat: pe o sesiune publică
  răspund doar agenții cu `website`, iar în portal doar cei cu `portal` — inclusiv pentru
  salutul de deschidere și pentru Test Playground. Un agent `internal` nu ajunge nici la un
  vizitator anonim, nici la un client logat.
- `portal` = chatul din aplicația clienților (necesită cont).
- `messenger`/`instagram`/`whatsapp` cer conexiunea platformei respective — vezi `conecteaza-meta`, `raspunde-whatsapp`.

### Chatul public de website — cum funcționează
- Sesiune reală, anonimă, cu token opac; conversația ține minte contextul (nu e întrebare-răspuns izolat).
- Trece prin **același runtime** ca portalul: router → agent → memorii de brand → capabilități.
- **Vizitatorul nu are identitate**: nu i se injectează profil, istoric sau rezervări; tool-urile care ating datele altor clienți refuză singure.
- **Plafoane** (protejează bugetul AI): ~60 mesaje/sesiune, sesiunea expiră în 12h, plafon zilnic
  per brand, limite pe IP-ul real al conexiunii (nu pe antet, care e pus de client).
- **Urgențele NU cad niciodată pe alt agent.** Dacă brandul nu are agent de urgență publicat,
  se folosește protocolul standard de urgență, NU agentul disponibil: altfel un agent de
  vânzări ar răspunde la „a căzut un copil” cu instrucțiunile lui de vânzare.
- **Urgențele NU alertează echipa dintr-o sesiune anonimă.** Agentul de urgență răspunde
  corect (personalul din local / 112) dar NU trimite notificări push: altfel oricine de pe
  internet ar putea suna alarma pe telefoanele managerilor, cu text ales de el. Din portal,
  unde clientul e identificat, notificarea reală se trimite ca înainte.
- Brandul se determină din `brandId`/`agentId` din URL, apoi din domeniul propriu al clientului, apoi — doar dacă instanța are un singur brand activ — din el. **Nu se ghicește niciodată**; pe o instanță cu mai multe branduri, un snippet fără `brandId` primește eroare, nu datele altui client.

---

## 4. Capabilitățile — ce diferențiază un bot de un agent

`capabilities[]` se aplică doar la `sales` și `booking`. Fiecare deschide un set de instrumente + o bucată de prompt:

| Capabilitate | Ce poate |
|---|---|
| `read_games_and_capacity` | listează jocuri, zone, pachete de evenimente, reguli de capacitate |
| `check_availability` | verifică disponibilitatea înainte să promită o oră |
| `read_customers` | caută clientul după telefon/nume, vede istoricul |
| `read_reservations` | caută și citește rezervări |
| `create_reservations` | **creează rezervări REALE** |
| `modify_reservations` | modifică rezervări existente |
| `read_messages_calls` | istoricul comunicării cu clientul |
| `crm_deals_read` / `crm_deals_write` | context și pipeline de deal-uri |

⚠️ **În runtime-ul PUBLIC** (vizitator de site sau client din portal) doar un subset restrâns e permis, indiferent ce ai activat: informații publice, verificare de disponibilitate, rezervări de joc. Instrumentele interne și rezervările altor clienți sunt refuzate server-side. Asta e intenționat — spune-i userului că un agent public **informează și pregătește**, iar operațiunile sensibile rămân la echipă.

---

## 5. Memoriile de brand — cunoștințele agenților

`brand_memories`: titlu + conținut + categorie. Se injectează în promptul **tuturor** agenților brandului (dacă nu sunt pe pauză). Pot fi atribuite unui agent anume.

Acolo pui ce **nu** se poate deduce din date: regulile casei, parcarea, programul de sărbători, povestea locului, ce se răspunde la reclamațiile frecvente, politica de avans.

- `list_brand_memories(brandId)` — citește ÎNTÂI, ca să nu dublezi.
- `upsert_brand_memory({ id?, brandId, title, content, category, paused })` — fără `id` = creare.
- `paused: true` scoate memoria din prompturi fără s-o ștergi.

Un agent fără memorii răspunde generic și trimite clientul „contactați restaurantul" — exact impresia pe care userul voia s-o evite.

---

## 6. Recepționerul telefonic — cum ajunge apelul la AI

```
Client sună numărul Twilio
   → Twilio cheamă webhook-ul Symbai (kill-switch, program, plafoane, jurnal)
   → transport:
        bridge (implicit) — audio prin serverul Symbai ↔ WebSocket ElevenLabs
        sip                — Twilio predă apelul direct la ElevenLabs
   → agentul vorbește, iar instrumentele (rezervări, meniu, mesaje) rulează la noi
```

### Transport `bridge` (recomandat, implicit)
Apelul trece prin serverul Symbai. Instrumentele se execută local, deci **nu cere nicio configurare manuală în consola ElevenLabs** și funcționează și pe instanțe fără adresă publică dedicată. Transferul la un coleg îl face Twilio.

### Transport `sip`
Latență puțin mai mică, dar numărul trebuie **importat în contul ElevenLabs și legat de agent** — `provision_voice_agent` o face automat. Dacă nu e legat, apelul cade instant și nimic nu semnalează asta din afară. Alege-l doar la cerere explicită.

### Verificarea apelantului (niveluri, enforce-uite server-side, nu în prompt)
| Nivel | Cum se obține | Ce deblochează |
|---|---|---|
| 0 | oricine sună | informații publice, rezervare NOUĂ, lasă mesaj |
| 1 | numărul afișat se potrivește + confirmă numele | citește propria rezervare |
| 2 | verificare prin cunoștințe (nume + dată + un fapt) | idem, când numărul e ascuns |
| 3 | cod SMS trimis la numărul DIN rezervare | modificări/anulări |

Nivelul 3 cere SMS configurat. Dacă politica îl cere și SMS-ul lipsește, apelanții nu pot face niciodată operațiuni sensibile — `diagnose_voice_agent` semnalează asta.

### Obligații legale
Salutul **trebuie** să anunțe că vorbește un AI (EU AI Act art. 50) și că apelul e înregistrat/transcris (GDPR). Dacă userul scrie un salut propriu fără mențiunea de AI, sistemul o adaugă singur. Nu încerca s-o scoți.

### Voci
`list_voice_options({ language: "ro" })` întoarce vocile contului de platformă. ⚠️ Un `voice_id` inexistent **nu dă eroare** — agentul vorbește cu vocea implicită și nimeni nu înțelege de ce. Alege întotdeauna din listă.

---

## 7. Harta completă a tool-urilor

### Înțelegere business
| Tool | Ce face |
|---|---|
| `get_business_context(brandId, includeMenu?)` | brand, unități, meniu, jocuri, pachete, memorii, agenți, canale, `gaps[]` |
| `list_business_discovery_questions(brandId, agentType?)` | întrebările rămase pentru proprietar, filtrate de ce e deja știut |
| `list_brand_memories(brandId, includeContent?)` | cunoștințele existente |
| `upsert_brand_memory({...})` | creează/actualizează o cunoștință |

### Agenți de chat
| Tool | Ce face |
|---|---|
| `list_chat_agents(brandId)` | agenții + asistenții-container |
| `get_chat_agent(agentId)` | configurația completă a unui agent |
| `list_agent_templates()` | șabloanele gata făcute |
| `create_chat_agent_from_template({...})` | calea recomandată de creare |
| `create_chat_agent({...})` | de la zero |
| `update_chat_agent({ agentId, ... })` | nume, prompt, salut, canale, capabilități, ton, activ |
| `set_agent_channels({ agentId, channels })` | publicare/retragere pe canale |
| `test_chat_agent({ message, agentId? })` | test cu drepturi de admin |
| `test_public_website_chat({ message, brandId? })` | **test ca vizitator nelogat real** |
| `get_agent_publish_status(brandId)` | „primește un client răspuns acum?" + link public + snippet |
| `list_agent_conversations` / `get_agent_conversation` | ce au discutat clienții |

### Recepționer telefonic
| Tool | Ce face |
|---|---|
| `get_voice_agent_config({ brandId, locationId? })` | configurația + statusul integrărilor |
| `update_voice_agent_config({...})` | creează/actualizează + re-provisionează. Scrie și `transport` (bridge/sip) și `ttsModel`, ca remediile propuse de `diagnose_voice_agent` să fie aplicabile prin conexiune, nu doar din panou |
| `create_voice_agent_from_chat_agent({ agentId, ... })` | dă voce unui agent de chat; REFUZĂ dacă pe scope există deja un recepționer (`overwriteExisting: true` îl înlocuiește intenționat) |
| `list_voice_options({ language? })` | vocile reale din cont |
| `diagnose_voice_agent({ brandId, locationId? })` | **verificări reale: sună cineva acum și primește agentul?** |
| `provision_voice_agent({ brandId, locationId? })` | repară: rescrie agentul la provider, leagă numărul |
| `simulate_voice_call({ message, ... })` | conversație de test, aceleași reguli ca la telefon |
| `list_voice_calls` / `get_voice_call` | jurnalul apelurilor + transcript |

**Ștergerea de agenți nu e expusă prin conexiune** (regula platformei). Dezactivează: `update_chat_agent({ active: false })` / `update_voice_agent_config({ enabled: false })`.

---

## 8. Ce raportează `diagnose_voice_agent`

Fiecare rând e verificat **la sursă**, nu dedus:

| Verificare | Ce testează efectiv |
|---|---|
| Recepționer pornit | kill-switch-ul din config |
| Cont ElevenLabs | cheia, chemată la ElevenLabs (o cheie revocată pică aici, nu în producție) |
| Agent vocal provisionat | agentul e citit de la provider (unul șters din consolă pică aici) |
| Credențiale Twilio | prezente |
| Rutare apeluri Twilio | numărul e în contul Twilio **și** Voice URL-ul lui arată spre Symbai |
| Transport | pe SIP: numărul e importat la 11L și legat de ACEST agent. Pe bridge: adresa publică e https/wss-accesibilă |
| Voce | `voice_id` există în cont |
| Transfer la om | e setat un număr |
| Verificare prin SMS | dacă politica o cere, SMS-ul chiar e disponibil |

`callable: true` = un client care sună **acum** primește agentul. Orice altceva înseamnă că nu.

---

## 9. Greșeli clasice

1. **„Am creat agentul" = gata.** Nu. Fără canalul `website`, niciun vizitator nu-l aude — și,
   simetric, fără `portal` nu-l aude niciun client logat. Canalele sunt comutatorul de acces.
2. **Test doar cu `test_chat_agent`.** Ăla rulează cu drepturi de admin; clientul real poate primi refuzuri pe care tu nu le-ai văzut.
3. **Prompt scris fără `get_business_context`.** Agentul inventează prețuri și program — bug-ul cel mai scump, pentru că nu arată ca o defecțiune.
4. **Recepționer pornit fără `diagnose_voice_agent` verde.** Clientul sună într-o linie moartă și crede că a sunat la local.
5. **`voice_id` din memorie.** Nu dă eroare; dă altă voce.
6. **Doi agenți activi de același tip.** Răspunde „cel greșit" fără nicio eroare.
7. **Capabilități de scriere date fără avertisment.** Agentul creează rezervări reale, inclusiv în teste.
