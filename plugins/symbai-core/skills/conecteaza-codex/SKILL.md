---
name: conecteaza-codex
description: Configurează sau verifică pluginul Codex Symbai și conexiunea MCP la serverul "symbai". Folosește când userul vrea Codex direct în Symbai, când tool-urile Symbai nu apar în Codex, la erori 401 / token lipsă, sau când trebuie migrată configurarea Claude Code către Codex.
---

# Conectează Codex la Symbai

Scop: Codex trebuie să vadă pluginul `symbai-core`, skill-urile lui și serverul MCP `symbai`, astfel încât să poată folosi tool-uri live precum `list_brands`, `gaseste_in_aplicatie`, `raport_vanzari`, `jurnal_activitate` și tool-urile de scriere permise pe token.

Citește și:
- `knowledge/codex-mcp-operare.md`
- `knowledge/claude-code-mcp-operare.md` pentru regulile generale MCP-first
- `knowledge/tools-mcp.md` pentru catalogul orientativ al tool-urilor

## Configurare — calea RECOMANDATĂ (merge pe orice versiune de Codex)

> Pluginul **NU** conține un fișier `.mcp.json` propriu. Conexiunea live se configurează per client, **în afara pluginului**. Fiecare instanță are subdomeniul ei: `https://<subdomeniu>.symbai.app/mcp`.

Codex se conectează cel mai sigur prin **puntea locală `mcp-remote`** (stdio → HTTPS cu token), configurată în `~/.codex/config.toml` (Windows: `C:\Users\<nume>\.codex\config.toml`; creează fișierul dacă lipsește):

```toml
[mcp_servers.symbai]
command = "npx"
args = ["-y", "mcp-remote@latest", "https://<subdomeniu>.symbai.app/mcp?tools=compact", "--header", "Authorization: Bearer <tokenul-symbai_mcp>"]
```

- Pe Windows, dacă serverul nu pornește cu `npx` direct: `command = "cmd"` și `args = ["/c", "npx", ...la fel]`.
- Necesită Node.js (`node --version` trebuie să meargă); dacă lipsește, instalează Node LTS de pe nodejs.org.
- **Sufixul `?tools=compact` e important pentru Codex**: primești un set restrâns de tool-uri de bază + `cauta_tool` (găsești orice capabilitate după descriere) + `ruleaza_tool` (o execuți). Fără sufix, lista completă are peste 1000 de definiții și încarcă inutil contextul Codex. Ghidurile de folosire a platformei le iei cu tool-ul `ghid_symbai`.
- Portalul Hub → Acces AI generează la crearea tokenului un **mesaj gata de lipit în Codex** (secțiunea „Folosești Codex sau alt asistent?") care face toată configurarea de mai sus.

## Configurare — alternativă (versiuni Codex cu suport HTTP nativ)

Creează un fișier `.mcp.json` în **folderul tău de lucru** (rădăcina proiectului din care pornești Codex — NU în folderul pluginului), cu subdomeniul TĂU și tokenul citit dintr-o variabilă de mediu (nu scrie tokenul direct în fișier):

```json
{
  "mcpServers": {
    "symbai": {
      "type": "http",
      "url": "https://<subdomeniu>.symbai.app/mcp",
      "bearer_token_env_var": "SYMBAI_MCP_TOKEN"
    }
  }
}
```

Pe Windows, setează tokenul o singură dată cu PowerShell (tokenul `symbai_mcp_*` vine din portalul Hub → Acces AI și se afișează o singură dată, la creare):

```powershell
[Environment]::SetEnvironmentVariable("SYMBAI_MCP_TOKEN", "<tokenul-symbai_mcp>", "User")
```

După setare, pornește Codex din nou (sau un thread nou) ca să vadă mediul și fișierul actualizat. Nu scrie tokenul în fișierele pluginului, în git, în răspunsuri sau în memorii.

## Verificare

1. Verifică dacă pluginul este instalat/activ în Codex.
2. Pornește o sesiune nouă după instalare.
3. Caută tool-uri cu prefixul serverului `symbai`.
4. Apelează întâi `list_brands`.
5. Dacă `list_brands` merge, conexiunea este bună. Dacă un tool de scriere spune „permisiune insuficientă", tokenul este valid, dar modulul de scriere nu este bifat în Hub → Acces AI.

## Reguli

- MCP-first: folosește tool-ul semantic dedicat înainte de SQL sau click manual.
- Pentru acțiuni cu efect real, cere confirmare clară înainte de `confirm:true`.
- După orice scriere, verifică printr-un tool de citire, nu doar prin UI.
- Dacă un skill menționează `Claude_in_Chrome`, în Codex folosește browserul disponibil în Codex sau dă linkul exact din `gaseste_in_aplicatie`.
- Dacă lista live de tool-uri diferă de `tools-mcp.md`, lista live câștigă.
