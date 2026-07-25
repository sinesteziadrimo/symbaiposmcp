---
name: conecteaza-symbai
description: Configurează sau repară conexiunea MCP la instanța Symbai (serverul "symbai"), prin OAuth pentru angajat ori prin tokenul propriu al ownerului. Folosește când tool-urile symbai nu apar, la „conectează-mă la Symbai", „nu am acces", erori OAuth/401 sau configurație Claude greșită.
---

# Conectează / repară conexiunea Symbai (MCP)

Scop: serverul MCP `symbai` să apară conectat în sesiunile Claude Code ale utilizatorului, cu tool-urile lui (`list_brands`, `raport_vanzari`, `gaseste_in_aplicatie` etc.).

## Stabilește întâi tipul de acces

- **URL-ul instanței**: `https://<subdomeniu>.symbai.app/mcp` (subdomeniul restaurantului lui).
- **Angajat POS** — calea normală este OAuth, fără token copiat. Proprietarul trebuie să-i fi creat mai întâi un grant nominal în Hub → **Acces AI → Trimite acces AI**, alegând angajatul și locația POS exacte. Angajatul se autentifică apoi singur în browser cu emailul și parola contului POS (nu PIN). Contul/rolul POS fără grant de owner pentru acea locație nu poate emite acces.
- **Proprietar / conexiune tehnică legacy** — poate folosi tokenul propriu `symbai_mcp_...` creat în Hub. Se afișează o singură dată; dacă s-a pierdut, se revocă și se creează altul. Nu cere unui angajat să primească tokenul ownerului.

## Configurarea angajatului — OAuth, fără token

În `~/.claude.json` (Windows: `C:\Users\<nume>\.claude.json`) adaugă la `mcpServers`, păstrând restul fișierului:

```json
"symbai": { "type": "http", "url": "<URL>" }
```

Nu adăuga `headers` și nu cere token. După restart, utilizatorul tastează `/mcp`, alege `symbai` → `Authenticate`; când se deschide Symbai, el apasă „Continuă cu contul de angajat", introduce personal emailul + parola și aprobă. Dacă apare „Acces neacordat", oprește-te: proprietarul trebuie să creeze sau să retrimită grantul nominal. Nu încerca tokenuri manuale și nu folosi permisiunile rolului ca substitut pentru grant.

CLI-ul, numai dacă există, este fără header:

```
claude mcp add --transport http --scope user symbai <URL>
```

## Configurarea proprietarului — token direct

> Cel mai probabil utilizatorul **NU** are CLI-ul `claude` în terminal (rulează în aplicația Claude, nu cu pachetul npm instalat separat). Dacă încerci `claude ...` și primești „not recognized / command not found / nu se găsește", e **NORMAL** — NU o raporta ca eroare, NU instala nimic, treci direct la metoda 1 (editare fișier). Nu porni niciodată de la presupunerea că ai CLI.

1. **Editează fișierul `.claude.json`** — în obiectul `"mcpServers"` de la nivelul rădăcină adaugă, păstrând restul neatins:
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

1. **Instanța e activă?** POST la `<URL>` fără autentificare trebuie să răspundă 401 și să indice fluxul OAuth; 404/HTML înseamnă URL greșit, timeout înseamnă problemă de rețea.
2. **Angajat OAuth:** `/mcp` trebuie să ofere `Authenticate`, apoi browserul cere login Symbai. Fără grantul ownerului, răspunsul corect este „Acces neacordat" — nu este o problemă de configurare care se ocolește.
3. **Owner cu token:** POST `initialize` cu `Authorization: Bearer <TOKEN>` trebuie să dea 200. Un 401 înseamnă token revocat/expirat/copiat greșit.
4. **După restart**, într-o sesiune nouă, `/mcp` arată `symbai` conectat.
5. **Confirmă TU cu `list_brands`**. Dacă un alt tool lipsește/refuză, verifică atât modulul de citire sau scriere din grant, cât și — pentru angajat — plafonul rolului POS și al alocărilor live. SQL ad-hoc este refuzat când angajatul are o arie brand/locație restrânsă.

## Alte cauze frecvente

- **Aplicația nu a fost repornită complet** — conexiunile MCP se încarcă la pornirea sesiunii; închide de tot aplicația (nu doar fereastra) și redeschide.
- **Config în scope local, alt folder** — `claude mcp add` rulat FĂRĂ `--scope user`; re-adaugă cu `--scope user`.
- **„Acces neacordat" la login** — contul POS nu este suficient: proprietarul trebuie să creeze un grant activ pentru exact acel angajat în Hub. Un grant expirat/folosit se înlocuiește cu unul nou.
- **Angajatul are doar PIN** — OAuth cere parola contului, nu PIN-ul scurt de casă; setează parola din profil/Personal, apoi reia.
- **„Permisiune insuficientă" la un tool** — conexiunea este bună. Proprietarul verifică modulele de citire/scriere din Hub; pentru un angajat, rolul POS și alocările live pot restrânge suplimentar citirile, scrierile și SQL-ul.
- **Accesul s-a oprit brusc după ce mergea** — tokenul a fost revocat (din portal sau de echipa Symbai) ori a expirat → verifică în portal, regenerează.
