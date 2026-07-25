# Codex + MCP Symbai - Model de operare

Acest fisier adapteaza pluginul `symbai-core` pentru Codex. Pluginul a fost construit initial pentru Claude Code, dar principiul ramane acelasi: skill -> knowledge -> MCP live -> verificare prin citire.

## Surse de adevar

1. Skill-ul potrivit din `skills/`.
2. Knowledge-ul potrivit din `knowledge/`.
3. Tool-urile MCP `symbai`, care citesc sau modifica date reale.
4. Browserul Codex, doar pentru navigare vizuala sau actiuni fara tool.

Pentru task-uri complexe, citeste si `agent-operare-avansata.md` si `claude-code-mcp-operare.md`.

## Cum apar tool-urile in Codex

Cand pluginul este instalat si serverul MCP este conectat, Codex expune tool-urile serverului `symbai` in sesiune. Numele concrete pot fi prefixate de host, dar sursa lor este serverul MCP `symbai`.

Daca tool-urile lipsesc:
- verifica instalarea pluginului;
- verifica daca threadul a fost pornit dupa instalare;
- pentru angajat, verifica daca ownerul i-a trimis un grant nominal si daca autentificarea OAuth a fost finalizata;
- pentru owner cu token direct, verifica prezenta variabilei `SYMBAI_MCP_TOKEN` fara sa afisezi valoarea;
- verifica URL-ul din configuratie (subdomeniul tau, nu al altui client);
- porneste un thread nou dupa orice schimbare de plugin sau mediu.

## Autentificare

Pentru un **angajat POS**, ownerul creeaza mai intai grantul nominal in Hub -> Acces AI, pentru angajatul si locatia POS exacte. Configuratia HTTP nativa nu contine token; Codex porneste OAuth prin `Authenticate` (sau `codex mcp login symbai`), iar angajatul se logheaza singur cu email + parola (nu PIN). Un cont POS fara grant de owner pentru acea locatie nu poate emite acces. Pentru **owner/conexiune tehnica**, tokenul direct vine din Hub si are forma `symbai_mcp_*`; nu il copia in git sau in raspunsuri.

**Calea recomandata (Codex actual)**: transportul Streamable HTTP nativ in `~/.codex/config.toml` — reteta completa e in skill-ul `conecteaza-codex`. Foloseste URL-ul cu sufixul `?tools=compact`: primesti setul de baza + `cauta_tool`/`ruleaza_tool` (gasesti si rulezi orice capabilitate la cerere, fara sa cari 1000+ definitii in context) + `ghid_symbai` pentru ghidurile de folosire. Pentru angajat setezi `auth = "oauth"`; nu instalezi Node.js si nu folosesti `mcp-remote`.

**Owner cu token direct**: aceeasi conexiune nativa, cu tokenul citit din variabila de mediu:

```toml
[mcp_servers.symbai]
url = "https://<subdomeniu>.symbai.app/mcp?tools=compact"
bearer_token_env_var = "SYMBAI_MCP_TOKEN"
```

Fiecare instanta Symbai are subdomeniul ei — foloseste-l pe al tau, nu pe al altui client.

## Lucru sigur

- Read tools apar numai pentru modulele de citire acordate, cu exceptia contextului minim al conexiunii.
- La angajat, accesul efectiv este intersectia dintre grantul ownerului, consimtamantul OAuth, rolul POS live si brandurile/locatiile live alocate; asta plafoneaza citirile, scrierile si SQL-ul.
- SQL este doar fallback read-only cand nu exista tool semantic; pentru un angajat cu arie live de brand/locatie restransa, SQL ad-hoc este dezactivat fail-closed.
- Actiunile externe sau cu impact real cer confirmare explicita: bani, email/WhatsApp/push, ANAF, eMAG, refund, GDPR, stergeri, modificari in masa.
- Dupa write, verifica prin read tool si inchide cu dovada.
- Ore: aplicatia afiseaza ora locatiei, dar datele brute din tool-uri/SQL sunt UTC. Prezinta utilizatorului DOAR ora locala (Romania: Europe/Bucharest, vara +3h / iarna +2h). Detalii: `claude-code-mcp-operare.md` -> "Ore Si Fus Orar".

## Browser in Codex

Documentatia veche poate mentiona `Claude_in_Chrome`. In Codex, foloseste browserul disponibil in mediul Codex sau in-app browserul, daca este activ. Daca browserul nu este disponibil, foloseste MCP pentru date si da linkul exact primit de la `gaseste_in_aplicatie`.
