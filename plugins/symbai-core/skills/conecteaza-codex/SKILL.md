---
name: conecteaza-codex
description: Configurează sau verifică pluginul Codex Symbai și conexiunea MCP la serverul "symbai", prin OAuth nominal pentru angajat sau token direct pentru owner. Folosește când tool-urile lipsesc, OAuth este refuzat ori apare 401.
---

# Conectează Codex la Symbai

Scop: Codex trebuie să vadă pluginul `symbai-core`, skill-urile lui și serverul MCP `symbai`, astfel încât să poată folosi tool-uri live precum `list_brands`, `gaseste_in_aplicatie`, `raport_vanzari`, `jurnal_activitate` și tool-urile permise de grant.

Citește și:
- `knowledge/codex-mcp-operare.md`
- `knowledge/claude-code-mcp-operare.md` pentru regulile generale MCP-first
- `knowledge/tools-mcp.md` pentru catalogul orientativ al tool-urilor

## Configurare — calea RECOMANDATĂ (Codex actual)

> Pluginul **NU** conține un fișier `.mcp.json` propriu. Conexiunea live se configurează per client, **în afara pluginului**. Fiecare instanță are subdomeniul ei: `https://<subdomeniu>.symbai.app/mcp`.

Codex și aplicația ChatGPT Desktop folosesc conexiunea **Streamable HTTP nativă**, configurată în `~/.codex/config.toml` (Windows: `C:\Users\<nume>\.codex\config.toml`; creează fișierul dacă lipsește). Nu instala Node.js și nu folosi `mcp-remote` pentru un angajat.

### Angajat POS — recomandat, OAuth fără token

Proprietarul trebuie să-i fi creat întâi un grant nominal în Hub → Acces AI, selectând angajatul și locația POS exacte. Configurația nu conține `Authorization`:

```toml
[mcp_servers.symbai]
url = "https://<subdomeniu>.symbai.app/mcp?tools=compact"
auth = "oauth"
```

După restart, în **Settings → MCP servers** selectează `symbai` → **Authenticate**; din CLI, aceeași autentificare pornește cu `codex mcp login symbai`. Browserul se deschide, iar angajatul se loghează personal cu emailul și parola contului POS (nu PIN) și aprobă. Hub-ul emite acces numai pentru perechea locație POS–`employeeId` căreia ownerul i-a dat grant. Accesul final este intersecția grantului, consimțământului OAuth, rolului POS live și alocărilor live de brand/locație, pentru citiri și scrieri. SQL ad-hoc este refuzat când angajatul are o arie brand/locație restrânsă. La „Acces neacordat" se cere un grant nou proprietarului — nu se improvizează un token.

### Proprietar / conexiune tehnică — token direct

Pentru accesul propriu al ownerului, păstrează tokenul într-o variabilă de mediu și spune-i conexiunii native numele variabilei. Pe Windows, setează tokenul o singură dată cu PowerShell (tokenul `symbai_mcp_*` vine din portalul Hub → Acces AI și se afișează o singură dată, la creare):

```powershell
[Environment]::SetEnvironmentVariable("SYMBAI_MCP_TOKEN", "<tokenul-symbai_mcp>", "User")
```

```toml
[mcp_servers.symbai]
url = "https://<subdomeniu>.symbai.app/mcp?tools=compact"
bearer_token_env_var = "SYMBAI_MCP_TOKEN"
```

- **Sufixul `?tools=compact` e important pentru Codex**: primești un set restrâns de tool-uri de bază + `cauta_tool` (găsești orice capabilitate după descriere) + `ruleaza_tool` (o execuți). Fără sufix, lista completă are peste 1000 de definiții și încarcă inutil contextul Codex. Ghidurile de folosire a platformei le iei cu tool-ul `ghid_symbai`.
- Portalul Hub → Acces AI generează un mesaj gata de lipit în Codex: fără token pentru grantul de angajat, respectiv cu tokenul afișat o singură dată pentru accesul propriu al ownerului.
- După setare, pornește Codex din nou (sau un thread nou) ca să vadă mediul și fișierul actualizat. Nu scrie tokenul în fișierele pluginului, în git, în răspunsuri sau în memorii.

## Verificare

1. Verifică dacă pluginul este instalat/activ în Codex.
2. Pornește o sesiune nouă după instalare.
3. Caută tool-uri cu prefixul serverului `symbai`.
4. Apelează întâi `list_brands`.
5. Dacă `list_brands` merge, conexiunea este bună. Dacă un tool spune „permisiune insuficientă", verifică modulul de citire/scriere acordat de owner; pentru angajat, rolul POS și alocările live pot restrânge suplimentar citirile, scrierile și SQL-ul.

## Reguli

- MCP-first: folosește tool-ul semantic dedicat înainte de SQL sau click manual.
- Pentru acțiuni cu efect real, cere confirmare clară înainte de `confirm:true`.
- După orice scriere, verifică printr-un tool de citire, nu doar prin UI.
- Dacă un skill menționează `Claude_in_Chrome`, în Codex folosește browserul disponibil în Codex sau dă linkul exact din `gaseste_in_aplicatie`.
- Dacă lista live de tool-uri diferă de `tools-mcp.md`, lista live câștigă.
