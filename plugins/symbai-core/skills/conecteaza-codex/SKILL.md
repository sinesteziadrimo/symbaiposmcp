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

Pentru un cont deja conectat, începe cu diagnosticul din [conecteaza-symbai](../conecteaza-symbai/SKILL.md) și [alege-conexiunea.md](../../knowledge/alege-conexiunea.md). Pașii de instalare de mai jos sunt pentru prima conectare sau o instalare demonstrat necesară, nu remediul implicit pentru orice unealtă lipsă.

1. Proprietarul intră în Hub → **Acces AI**, alege persoana și locația POS exacte, selectează permisiunile și acordă accesul.
2. Angajatul intră în POS cu propriul cont și deschide **Conectează un asistent AI**.
3. Descarcă ultimul **Pachet personalizat Symbai Connect** pentru Windows, macOS sau Linux și îl instalează pe calculatorul pe care va lucra.
4. În panoul Symbai Connect apasă **Conectează** pentru Codex.
5. Browserul se deschide automat. Angajatul se autentifică prin OAuth cu emailul și parola contului POS, nu cu PIN-ul de la casă, apoi aprobă accesul.
6. Symbai Connect configurează singur conexiunea și salvează OAuth în aplicația potrivită. După confirmarea succesului, reîncarcă legăturile sau repornește Codex, reia conversația existentă și verifică identitatea firmei și conturile personale.

Nu cere niciodată utilizatorului să editeze fișiere de configurare, să ruleze comenzi MCP sau să copieze un mesaj, URL, cod ori token. Tokenul proprietarului nu se trimite angajatului.

## Verificare

1. Confirmă că pluginul `symbai-core` este instalat și activ.
2. Reîncarcă legăturile sau repornește aplicația după conectare și reia conversația.
3. Pentru POS apelează `verifica_conexiune` și verifică firma și identitatea nominală; pentru Accounting folosește `get_connection_identity`. `list_brands` singur nu confirmă accesul personal. Pentru WhatsApp-ul personal: `connection_status` din serverul local al numărului; pentru Gmail/Drive local: `google_accounts` din `symbai-google`.
4. Dacă un tool spune „permisiune insuficientă”, proprietarul verifică modulul acordat în Hub. Pentru angajat, rolul POS și alocările live pot limita suplimentar accesul.

## Recuperare simplă

- **Acces neacordat sau revocat, confirmat de diagnosticul live:** urmează explicația serverului. Cere proprietarului accesul indicat, apoi `connect_repair`; alt pachet se descarcă numai dacă diagnosticul arată că este necesar.
- **Calculator schimbat, reinstalare sau activare invalidă:** angajatul descarcă și instalează ultimul Pachet personalizat pe calculatorul nou. Noul calculator îl înlocuiește automat pe cel vechi.
- **401 sau avertizare de expirare:** verifică live `connection_status` și conexiunea firmei, apoi folosește `connect_repair` dacă rezultatul o cere. Nu deduce revocarea și nu repeta OAuth doar fiindcă sesiunea nu s-a actualizat.
- **Configurație manuală veche detectată:** verifică identitatea și folosește remediul pentru intrarea exactă oferit de Connect. Nu șterge conexiuni după nume și nu afișa comenzi sau fragmente de configurare.
- **Plugin sau tool-uri lipsă:** verifică pluginul și serverul potrivit din aplicație, reîncarcă legăturile după conectare și testează unealta live corespunzătoare. Lipsa uneltelor personale din catalogul POS nu dovedește deconectarea contului.

Accesul efectiv este intersecția dintre grantul proprietarului, consimțământul OAuth, rolul POS live și alocările live de brand și locație. SQL ad-hoc rămâne refuzat când aria angajatului este restrânsă.

## Reguli

- MCP-first: folosește tool-ul semantic dedicat înainte de SQL sau click manual.
- Pentru acțiuni cu efect real, cere confirmare clară înainte de `confirm:true`.
- După orice scriere, verifică printr-un tool de citire.
- Dacă lista live de tool-uri diferă de `tools-mcp.md`, lista live câștigă.
