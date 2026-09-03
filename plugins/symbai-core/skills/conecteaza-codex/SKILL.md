---
name: conecteaza-codex
description: Configurează sau repară pluginul Codex Symbai și conexiunea MCP prin Symbai Connect + OAuth nominal. La „nu apar tool-urile în Codex", „OAuth refuzat", „401", „am mutat conexiunea pe alt calculator".
---

# Conectează Codex la Symbai

Scop: angajatul primește accesul potrivit și ajunge la tool-urile Symbai fără să copieze mesaje, URL-uri, coduri, tokenuri, comenzi sau configurații.

Citește și:
- `knowledge/codex-mcp-operare.md`
- `knowledge/claude-code-mcp-operare.md` pentru regulile generale MCP-first
- `knowledge/tools-mcp.md` pentru catalogul orientativ al tool-urilor

## Fluxul unic pentru angajat

1. Proprietarul intră în Hub → **Acces AI**, alege persoana și locația POS exacte, selectează permisiunile și acordă accesul.
2. Angajatul intră în POS cu propriul cont și deschide **Conectează un asistent AI**.
3. Descarcă ultimul **Pachet personalizat Symbai Connect** pentru Windows, macOS sau Linux și îl instalează pe calculatorul pe care va lucra.
4. În panoul Symbai Connect apasă **Conectează** pentru Codex.
5. Browserul se deschide automat. Angajatul se autentifică prin OAuth cu emailul și parola contului POS, nu cu PIN-ul de la casă, apoi aprobă accesul.
6. Symbai Connect configurează singur conexiunea și salvează OAuth în aplicația potrivită. După confirmarea succesului, angajatul deschide o sesiune nouă în Codex.

Nu cere niciodată utilizatorului să editeze fișiere de configurare, să ruleze comenzi MCP sau să copieze un mesaj, URL, cod ori token. Tokenul proprietarului nu se trimite angajatului.

## Verificare

1. Confirmă că pluginul `symbai-core` este instalat și activ.
2. Deschide o sesiune nouă după conectare.
3. Apelează `list_brands`; dacă răspunde, conexiunea este funcțională.
4. Dacă un tool spune „permisiune insuficientă”, proprietarul verifică modulul acordat în Hub. Pentru angajat, rolul POS și alocările live pot limita suplimentar accesul.

## Recuperare simplă

- **Acces neacordat, expirat sau revocat:** proprietarul acordă din nou accesul nominal în Hub; angajatul descarcă și instalează ultimul Pachet personalizat din POS și reia OAuth din butonul **Conectează**.
- **Calculator schimbat, reinstalare sau activare invalidă:** angajatul descarcă și instalează ultimul Pachet personalizat pe calculatorul nou. Noul calculator îl înlocuiește automat pe cel vechi.
- **401 după instalare:** redeschide panoul Symbai Connect și apasă din nou **Conectează** pentru OAuth.
- **Configurație manuală veche detectată:** Symbai Connect indică intrarea veche `symbai`; elimină doar acea intrare din lista MCP a aplicației, apoi apasă **Conectează**. Nu afișa comenzi sau fragmente de configurare.
- **Plugin sau tool-uri lipsă:** verifică pluginul, pornește o sesiune nouă și testează `list_brands`.

Accesul efectiv este intersecția dintre grantul proprietarului, consimțământul OAuth, rolul POS live și alocările live de brand și locație. SQL ad-hoc rămâne refuzat când aria angajatului este restrânsă.

## Reguli

- MCP-first: folosește tool-ul semantic dedicat înainte de SQL sau click manual.
- Pentru acțiuni cu efect real, cere confirmare clară înainte de `confirm:true`.
- După orice scriere, verifică printr-un tool de citire.
- Dacă lista live de tool-uri diferă de `tools-mcp.md`, lista live câștigă.
