---
name: conecteaza-supplier
description: Configurează sau repară conexiunea MCP la instanța Symbai Supplier (serverul "symbai-supplier"). Folosește când tool-urile de furnizor nu apar în sesiune, la „conectează-mă la Symbai Supplier / la furnizor", „nu am acces la produsele/comenzile mele", erori 401 / „Token MCP lipsă", sau eroarea Claude Desktop „Some MCP servers could not be loaded".
---

# Conectează / repară conexiunea Symbai Supplier (MCP)

Scop: serverul MCP `symbai-supplier` să apară conectat în sesiunile Claude Code, cu tool-urile lui (`get_dashboard`, `list_products`, `list_orders`, `update_order_status` etc.).

> **Important**: tokenul se creează **DIN APLICAȚIA de furnizor** (Symbai Supplier), NU din portalul Hub. Un furnizor **nu are nevoie de cont Symbai Hub** — totul e local.

## Ce îți trebuie de la utilizator

- **URL-ul instanței**: `https://<instanța-ta>/mcp` (de regulă `https://supplier.symbai.app/mcp`). UI-ul afișează endpoint-ul exact sub cardul de token.
- **Tokenul** `symbai_supplier_mcp_...` — îl creează din aplicație → **Setări → Integrări → „Acces AI (MCP)"** → **„Token nou"**. Bifează modulele pe care AI-ul are voie să le **modifice** (citirea e mereu permisă), apoi „Creează token". Doar **adminul** furnizorului poate crea tokenuri. Tokenul se afișează **o singură dată**; dacă l-a pierdut, revocă-l și creează altul.

## Configurarea corectă

> Dacă `claude ...` în terminal dă „command not found", e NORMAL — treci la metoda 1.

1. **Editează `.claude.json`** (home: Windows `C:\Users\<nume>\.claude.json`; macOS/Linux `~/.claude.json`). În `"mcpServers"` de la **nivelul rădăcină**, adaugă:
   ```json
   "symbai-supplier": { "type": "http", "url": "<URL>", "headers": { "Authorization": "Bearer <TOKEN>" } }
   ```
   Apoi închide complet și redeschide aplicația.

2. **Scurtătură CLI** (doar dacă `claude --version` merge):
   ```
   claude mcp add --transport http --scope user symbai-supplier <URL> --header "Authorization: Bearer <TOKEN>"
   ```
   `--scope user` e obligatoriu.

Aplicația îți dă, la crearea tokenului, exact comanda CLI și un mesaj de lipit în chat — folosește-le.

## Capcana — claude_desktop_config.json (NU-l folosi)

Acel fișier (Settings → Developer → „Local MCP servers") acceptă DOAR servere stdio locale. O intrare HTTP acolo dă „Some MCP servers could not be loaded ... skipped: symbai-supplier". Pentru Claude Code, serverul trăiește în `~/.claude.json` și se vede la `/mcp`. Dacă apare eroarea: șterge DOAR intrarea greșită din acel fișier și fă configurarea corectă.

## Verificare (în ordine)

1. POST la `<URL>` fără header → **HTTP 401** „Token MCP lipsă...". 404/HTML → URL greșit.
2. Același POST cu `Authorization: Bearer <TOKEN>` + body JSON-RPC `initialize` → **HTTP 200**. Tot 401 → token revocat/expirat → regenerează.
3. Sesiune nouă după restart: `/mcp` arată `symbai-supplier` conectat.
4. **Confirmă TU cu un tool** — `get_dashboard` sau `list_products`. „Permisiune insuficientă" la scriere = modulul nu e bifat pe token → recreează tokenul cu modulul dorit.

## Alte cauze frecvente

- Aplicația nu a fost repornită complet.
- „Permisiune insuficientă" la scriere = modulul nu e bifat (tokenurile nu se editează — recreează-l).
- Doar adminul furnizorului poate gestiona tokenuri.
- Accesul s-a oprit brusc = token revocat/expirat → Setări → Integrări → Acces AI (MCP).
