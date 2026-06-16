---
name: conecteaza-symbai
description: Configurează sau repară conexiunea MCP la instanța Symbai (serverul "symbai"). Folosește când tool-urile symbai nu apar în sesiune, la „conectează-mă la Symbai", „nu am acces la datele mele", „verifică dacă ai acces la Symbai POS", „configurează tokenul", erori 401 / „Lipsește tokenul", sau eroarea Claude Desktop „Some MCP servers could not be loaded" (intrare symbai invalidă în claude_desktop_config.json).
---

# Conectează / repară conexiunea Symbai (MCP)

Scop: serverul MCP `symbai` să apară conectat în sesiunile Claude Code ale utilizatorului, cu tool-urile lui (`list_brands`, `raport_vanzari`, `gaseste_in_aplicatie` etc.).

## Ce îți trebuie de la utilizator

- **URL-ul instanței**: `https://<subdomeniu>.symbai.app/mcp` (subdomeniul restaurantului lui).
- **Tokenul** `symbai_mcp_...` — îl creează din portalul Hub (hub.symbai.app) → secțiunea **„Acces AI (Claude Code)"**. Se afișează **o singură dată**, la creare. Dacă nu-l mai are: să revoce tokenul vechi din portal și să creeze altul (30 de secunde) — tokenul NU se poate recupera.

## Configurarea corectă

> Cel mai probabil utilizatorul **NU** are CLI-ul `claude` în terminal (rulează în aplicația Claude, nu cu pachetul npm instalat separat). Dacă încerci `claude ...` și primești „not recognized / command not found / nu se găsește", e **NORMAL** — NU o raporta ca eroare, NU instala nimic, treci direct la metoda 1 (editare fișier). Nu porni niciodată de la presupunerea că ai CLI.

1. **Editează fișierul `.claude.json`** (metoda implicită — merge mereu, fără terminal) — din folderul home al utilizatorului (Windows: `C:\Users\<nume>\.claude.json`; macOS/Linux: `~/.claude.json`; creează-l dacă lipsește). În obiectul `"mcpServers"` de la **nivelul rădăcină** al JSON-ului adaugă, păstrând restul fișierului neatins:
   ```json
   "symbai": { "type": "http", "url": "<URL>", "headers": { "Authorization": "Bearer <TOKEN>" } }
   ```
   După salvare, cere-i utilizatorului să închidă complet și să redeschidă aplicația — configurația se citește la pornire, iar aplicația poate suprascrie fișierul dacă sesiunea continuă mult după editare.

2. **Scurtătură cu CLI** — DOAR dacă `claude --version` chiar afișează o versiune (verifică prin Bash întâi):
   ```
   claude mcp add --transport http --scope user symbai <URL> --header "Authorization: Bearer <TOKEN>"
   ```
   `--scope user` e important: fără el, conexiunea se leagă de folderul curent și sesiunile pornite din alt folder nu o văd.

## Capcana #1 — claude_desktop_config.json / Settings → Developer → „Local MCP servers" (NU-l folosi)

`claude_desktop_config.json` (Windows: `%APPDATA%\Claude\`; macOS: `~/Library/Application Support/Claude/`) este fișierul aplicației Claude **Desktop** (chatul) și acceptă DOAR servere locale stdio (`command` + `args`). Panoul **Settings → Developer → „Local MCP servers"** (butonul „Edit Config") editează exact acest fișier — deci e aceeași capcană, cu altă față. O intrare HTTP `symbai` pusă acolo **nu funcționează** și produce la pornire:

> **"Some MCP servers could not be loaded ... are not valid MCP server configurations and were skipped: symbai"**

⚠ Important: pentru un utilizator de **Claude Code**, panoul „Local MCP servers" rămâne **gol** — și e **NORMAL**. Serverul `symbai` (HTTP, cu token) trăiește în `~/.claude.json` al Claude Code, NU în aplicația de chat; se vede la `/mcp`, nu în panoul Developer. Nu trimite niciodată utilizatorul să adauge symbai acolo, și nu interpreta panoul gol ca „neconfigurat".

Dacă utilizatorul vede eroarea de mai sus: deschide fișierul, șterge DOAR intrarea `symbai` din `mcpServers` (nu restul), salvează, apoi fă configurarea corectă de mai sus.

## Verificare (în ordine)

1. **Instanța e activă?** POST la `<URL>` fără header de autorizare → trebuie **HTTP 401** cu mesajul „Lipsește tokenul". Dacă primești 404/HTML → URL greșit (verifică subdomeniul); timeout → problemă de internet.
2. **Tokenul e valid?** Același POST cu headerul `Authorization: Bearer <TOKEN>` și body JSON-RPC `initialize` → trebuie **HTTP 200**. Dacă primești tot 401 → token revocat/expirat/copiat greșit → regenerare din portal.
3. **După restart**, într-o sesiune NOUĂ: `/mcp` arată serverul `symbai` conectat, iar tool-urile Symbai devin disponibile. (NU în Settings → Developer → „Local MCP servers" — acela rămâne gol; vezi Capcana #1.)
4. **Confirmă TU, cu un tool** (nu lăsa userul să verifice manual): cheamă `list_brands` — dacă întoarce brandurile, conexiunea + permisiunile sunt OK. „Permisiune insuficientă" pe un tool de scriere = conexiunea e bună, doar modulul nu e bifat pe token (vezi mai jos).

## Alte cauze frecvente

- **Aplicația nu a fost repornită complet** — conexiunile MCP se încarcă la pornirea sesiunii; închide de tot aplicația (nu doar fereastra) și redeschide.
- **Config în scope local, alt folder** — `claude mcp add` rulat FĂRĂ `--scope user`; re-adaugă cu `--scope user`.
- **„Permisiune insuficientă" la un tool** — conexiunea e OK; modulul de scriere nu e bifat pe token → portal Hub → Acces AI → butonul „Permisiuni" pe token (se aplică în ~1 minut).
- **Accesul s-a oprit brusc după ce mergea** — tokenul a fost revocat (din portal sau de echipa Symbai) ori a expirat → verifică în portal, regenerează.
