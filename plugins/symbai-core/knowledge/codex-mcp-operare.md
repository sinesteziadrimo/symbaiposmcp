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
- verifica daca proprietarul a acordat accesul nominal angajatului si locatiei POS exacte;
- instaleaza ultimul Pachet personalizat din POS si reia OAuth din butonul Conecteaza al panoului Symbai Connect;
- porneste un thread nou dupa instalare sau reconectare.

## Autentificare

Proprietarul creeaza mai intai grantul nominal in Hub -> Acces AI, pentru angajatul si locatia POS exacte. Angajatul intra apoi in POS, descarca ultimul Pachet personalizat Symbai Connect, il instaleaza si apasa Conecteaza pentru Codex. Browserul deschide automat OAuth, unde angajatul foloseste emailul si parola contului POS, nu PIN-ul de la casa.

Symbai Connect configureaza singur conexiunea nativa si salveaza autorizarea in profilul utilizatorului. Dupa confirmarea succesului, utilizatorul deschide o sesiune noua. Nu editeaza configuratii, nu ruleaza comenzi MCP si nu copiaza mesaje, URL-uri, coduri sau tokenuri. Fiecare instanta foloseste automat subdomeniul din pachetul personalizat.

Daca accesul a expirat ori a fost revocat, proprietarul il acorda din nou in Hub, iar angajatul reinstaleaza ultimul Pachet personalizat si reia OAuth. Daca se schimba PC-ul, acelasi flux inlocuieste automat calculatorul vechi.

## Lucru sigur

- Read tools apar numai pentru modulele de citire acordate, cu exceptia contextului minim al conexiunii.
- La angajat, accesul efectiv este intersectia dintre grantul ownerului, consimtamantul OAuth, rolul POS live si brandurile/locatiile live alocate; asta plafoneaza citirile, scrierile si SQL-ul.
- SQL este doar fallback read-only cand nu exista tool semantic; pentru un angajat cu arie live de brand/locatie restransa, SQL ad-hoc este dezactivat fail-closed.
- Actiunile externe sau cu impact real cer confirmare explicita: bani, email/WhatsApp/push, ANAF, eMAG, refund, GDPR, stergeri, modificari in masa.
- Dupa write, verifica prin read tool si inchide cu dovada.
- Ore: aplicatia afiseaza ora locatiei, dar datele brute din tool-uri/SQL sunt UTC. Prezinta utilizatorului DOAR ora locala (Romania: Europe/Bucharest, vara +3h / iarna +2h). Detalii: `claude-code-mcp-operare.md` -> "Ore Si Fus Orar".

## Browser in Codex

Documentatia veche poate mentiona `Claude_in_Chrome`. In Codex, foloseste browserul disponibil in mediul Codex sau in-app browserul, daca este activ. Daca browserul nu este disponibil, foloseste MCP pentru date si da linkul exact primit de la `gaseste_in_aplicatie`.
