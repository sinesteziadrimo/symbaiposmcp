---
name: conecteaza-symbai
description: Configurează sau repară conexiunea MCP Symbai (Claude Code / Codex) prin Symbai Connect + OAuth nominal și explică DE CE lipsesc tool-uri. La „nu apar tool-urile Symbai", „văd puține tool-uri / lipsesc furnizorii, meniurile", „acces refuzat", „401", „am schimbat calculatorul".
---

# Conectează sau repară Symbai

Scop: serverul `symbai` să apară conectat și să funcționeze direct, fără configurare tehnică făcută de utilizator.

## Regula de aur: citește starea, nu o deduce

Începe cu [alege-conexiunea.md](../../knowledge/alege-conexiunea.md): WhatsApp personal, canale partajate, Business, email local, email personal din POS și datele firmei folosesc conexiuni diferite. Verifică în aplicația și pe calculatorul în care lucrează utilizatorul.

Pentru Accounting, inclusiv firme care nu au POS, urmează [fluxul Accounting din același Connect](../../knowledge/symbai-connect-accounting.md). Pachetul se descarcă din Accounting → Setări → Integrări → Symbai Connect; autentificarea firmei se face cu contul Accounting. Pașii POS de mai jos se aplică numai conexiunilor POS. La utilizarea ambelor produse, păstrează toate conexiunile și verifică separat identitatea fiecăreia.

Simptomul („nu merge", „nu văd tool-urile", „scrie blocat") nu spune cauza. Cauza o
spune serverul Symbai, iar tu o ai la un apel distanță. **Nu porni niciodată de la
o listă de cauze posibile și nu alege una ca să ai ce răspunde** — un motiv
plauzibil spus pe un ton sigur trimite omul să repare altceva decât ce e stricat,
iar el pierde o zi.

1. Apelează `connection_status` (serverul MCP local al Symbai Connect). Merge chiar
   și când toate celelalte tool-uri refuză — exact pentru asta există.
2. Citește blocul `conectare`:
   - `stare` — verdictul: `licenta_valida_mcp_neverificat` (în versiunile vechi `ok`), `neactivat`, `oprit_de_symbai`, `fara_legatura`, `blocat_local`, `offline`, `fara_date_pos`. Licența validă nu confirmă uneltele din conversație.
   - `explicatie` — **cauza exactă, trimisă de serverul Symbai, cu pasul de reparare în ea**.
   - `caDeFacut` — pașii care decurg din starea reală a acestui calculator.
3. Spune omului ce scrie în `explicatie`, cu cuvintele lui. Dacă `explicatie` e goală
   sau neclară, spune că motivul nu e cunoscut și verifică panoul și conexiunea din aplicație; nu cere alt pachet fără dovada că instalarea îl necesită.
   Nu completa golul cu o ipoteză.

## Repară singur, nu doar explica

`connect_repair` (același server local) face ce ar fi făcut omul în panou:

- cere Symbai o **reverificare imediată** a accesului — folosește-l îndată ce
  proprietarul tocmai a reacordat accesul, altfel starea rămâne „oprit" până la
  următoarea verificare automată;
- dacă licența e bună și mai lipsește doar autentificarea, **o pornește el**: se
  deschide browserul, iar omul doar se loghează și apasă „Permite accesul";
- întoarce ce s-a rezolvat și ce a mai rămas de făcut.

Cu `doar_verifica: true` reverifică și raportează, fără să deschidă browserul.
Pe un calculator cu doi asistenți instalați, unealta întreabă pe care să-l repare —
răspunde cu `asistent: "claude-code"` sau `asistent: "codex"`, cel în care lucrezi
ACUM. Autentificarea pornește și se întoarce imediat; rezultatul apare la următorul
`connection_status`, în `conectare.autentificare`.

Ordinea normală când cineva zice „nu-mi merge": `connection_status` → dacă lipsește
un acces, cere-l proprietarului → după ce l-a dat, `connect_repair`.

### Dacă uneltele astea nu există

Lipsa uneltelor din sesiune nu dovedește că agentul este vechi sau oprit. Caută serverul local `symbai-whatsapp`/`symbai-whatsapp-<nume>` în aplicația asistentului. După conectare, reîncarcă legăturile sau repornește aplicația și reia conversația. Dacă verificarea rămâne indisponibilă, deschide panoul local `http://127.0.0.1:5196` pe calculatorul utilizatorului și verifică aplicația configurată și versiunea agentului. Agentul și pluginul se actualizează separat; recomandă actualizarea numai dacă versiunea verificată nu oferă diagnosticul. Nu improviza o cauză și nu confunda Claude Code cu Claude Desktop ori o conversație din browser.

## Fluxul unic pentru angajat

1. Proprietarul intră în Hub → **Acces AI**, alege angajatul și locația POS exacte, selectează permisiunile și acordă accesul.
2. Angajatul intră în POS cu propriul cont și deschide **Conectează un asistent AI**. Dialogul îi arată starea calculatorului lui: legat, oprit (cu motiv) sau cu un pachet descărcat și neinstalat.
3. Descarcă ultimul **Pachet personalizat Symbai Connect** pentru sistemul său și îl instalează pe calculatorul pe care va lucra.
4. În panoul Symbai Connect apasă **Conectează** lângă Codex sau Claude Code — sau lasă asistentul să cheme `connect_repair`.
5. Browserul se deschide automat. Angajatul se autentifică cu emailul și parola contului POS, nu cu PIN-ul de la casă, apoi aprobă accesul.
6. Symbai Connect configurează aplicația și mută în siguranță rezultatul în profilul angajatului. După confirmarea succesului, reîncarcă legăturile MCP sau repornește aplicația și reia conversația existentă. Verifică live identitatea firmei și contul personal înainte să declari că funcționează.

Nu cere niciodată utilizatorului să editeze fișiere, să ruleze comenzi MCP sau să copieze un mesaj, URL, cod, header ori token. Nu trimite tokenul proprietarului unui angajat.

**Un acces acordat leagă un singur calculator.** O instalare nouă îl înlocuiește pe
cel vechi, iar o descărcare nouă anulează activarea din pachetul descărcat anterior:
dacă omul are deja un pachet nefolosit, spune-i să-l instaleze pe acela, nu să
descarce încă unul.

## Verificare

1. Confirmă că pluginul `symbai-core` este instalat și activ.
2. Reîncarcă legăturile sau repornește aplicația după conectare, apoi reia conversația.
3. Apelează `verifica_conexiune`; verifică firma și identitatea nominală. `list_brands` singur nu dovedește accesul la WhatsApp/email personal: răspunde și pentru tokenuri de organizație.
4. Dacă un tool spune „permisiune insuficientă", conexiunea funcționează: proprietarul verifică modulul acordat, iar rolul și alocările POS live pot limita suplimentar accesul.
5. Apelează `verifica_conexiune`: îți spune tokenul, modulele, SQL, profilul, plafoanele, câte tool-uri vezi și — pentru un cont de angajat — `arieAngajat`. Citește-l ÎNAINTE să tragi orice concluzie despre tool-uri lipsă.

## Văd puține tool-uri / lipsesc module întregi (furnizori, meniuri, P&L…)

Dacă serverul POS răspunde, `cauta_tool` caută în catalogul lui, iar `verifica_conexiune` arată identitatea și restricțiile. Dacă serverul întreg lipsește sau tocmai a fost conectat, verifică întâi încărcarea lui în conversație. Catalogul POS nu include uneltele locale WhatsApp/Google. Pentru un server POS funcțional, verifică:

1. **Aria de angajat** (`arieAngajat.restransa: true`) — contul e alocat doar pe o PARTE din unitățile active (branduri / locații / gestiuni permise). Atunci rămân doar tool-urile cu verificare de arie, iar `tooluriCuArieCompleta` arată câte ar fi altfel. Remediu, în aplicație, de un administrator cu rol complet (de regulă proprietarul): Personal → fișa angajatului → pe fiecare axă limitată bifează unitățile active lipsă sau apasă «Permite toate». Unitățile dezactivate/arhivate nu contează. Efectul apare la următoarea pornire a sesiunii (reconectare) — spune-i explicit să repornească.
2. **Rolul POS** — modulele se derivă generos din permisiunile rolului; un rol îngust (ospătar, bucătar) vede doar modulele domeniului lui, iar uneltele sensibile (salarii, contracte, registru de casă, jurnal, blocare perioadă, infrastructura din Setări) cer exact permisiunea paginii echivalente. Ștergerile de perioadă, GDPR-ul și forțările tehnice sunt doar pentru rolul complet. Remediu: `configureaza-roluri` (completează rolul), nu SQL.
3. **Profilul de tool-uri** al tokenului (restaurant / fabrică / construcții / hotel / marketing) — ascunde domeniile din afara verticalei; se schimbă din Hub → Acces AI (revocă și acordă din nou cu profilul dorit).
4. **Modulele grantului** din Hub → Acces AI — ce n-a bifat proprietarul nu apare.

O conexiune veche poate coexista cu cea nominală și poate răspunde încă folosind un token de organizație. Verifică identitatea pe conexiunea aleasă, apoi folosește conexiunea nominală pentru aceeași firmă. Nu șterge alte conexiuni doar după nume și nu le considera cauza unei erori pe o conexiune diferită.

## Ce înseamnă fiecare verdict

Le folosești **după** ce ai citit `stare` și `explicatie`, ca să traduci — nu ca să ghicești.

- `oprit_de_symbai` — Symbai **a răspuns și a refuzat**. Motivul e în `explicatie`
  și conține deja pasul potrivit. Dacă cere un acces nou de la proprietar, acela
  trebuie dat **întâi**; un pachet nou descărcat înainte nu ajută.
- `fara_legatura` — calculatorul **nu ajunge** la Symbai, iar perioada de
  funcționare offline s-a încheiat. Symbai nu a refuzat nimic. Verifică internetul,
  firewall-ul și dacă `hub.symbai.app` se rezolvă de pe acel calculator.
  **Nu reinstala și nu cere un acces nou** — ai repara ceva ce nu e stricat.
- `blocat_local` — problema e pe calculatorul acela (de obicei cheia dispozitivului,
  după o schimbare de cont Windows), nu o decizie a Symbai. Ce anume, scrie în
  `explicatie`.
- `neactivat` — calculatorul nu e legat de niciun cont. Pachet personalizat din POS.
- `offline` — nu ajunge la Symbai acum, dar **nu i s-a luat nimic**: merge în
  perioada de grație. Verifică internetul. **Nu reinstala nimic.**
- `fara_date_pos` — activat, dar fără adresa datelor din POS: pachetul e mai vechi
  decât fluxul actual. Un Pachet personalizat nou o aduce.
- `licenta_valida_mcp_neverificat` (sau `ok` în versiunile vechi) — licența este validă; verifică separat identitatea și uneltele din conversația curentă. Pentru POS: `verifica_conexiune`; pentru Accounting: `get_connection_identity`; pentru numărul personal: `connection_status` și blocul `whatsapp`.

## Alte situații

- **Consum mare / limita de 5 ore / „prea multe unelte”:** urmează [consumul asistentului](../../knowledge/consum-asistent.md). Separă catalogul disponibil de definițiile încărcate, istoricul lung și monitorizările simultane. Păstrează modelul și contextul util; nu cere reconectarea Symbai pentru o limită a furnizorului AI.
- **401 sau „conexiune expirată” după ce mergea:** verifică `connection_status`, apoi `connect_repair`. Mesajul clientului nu dovedește că accesul a expirat. Confirmă rezultatul printr-un apel `verifica_conexiune` în aceeași conexiune; dacă reușește, spune că accesul funcționează acum. Cere o autentificare nouă numai când diagnosticul o indică. Nu reinstala și nu șterge conexiuni pe baza avertizării singure.
- **Server în actualizare / temporar indisponibil:** păstrează conexiunea existentă și reîncearcă după intervalul indicat. Explică indisponibilitatea temporară; nu o prezenta drept expirarea sau revocarea accesului.
- **Angajat inactiv:** proprietarul reactivează contul POS, apoi acordă din nou accesul nominal.
- **Calculator schimbat:** instalează Pachetul personalizat pe noul calculator; îl înlocuiește automat pe cel vechi.
- **Configurație manuală veche detectată:** folosește remediul oferit de Symbai Connect pentru intrarea identificată exact și verifică ulterior identitatea nominală. Nu șterge conexiuni după presupuneri sau după numele `symbai-vechi`. Nu afișa utilizatorului comenzi ori configurații.
- **Doar PIN disponibil:** utilizatorul își setează parola contului din Personal, apoi reia conectarea.

Accesul POS nu înlocuiește grantul proprietarului. Accesul final este intersecția dintre grant, consimțământul din browser, rolul POS live și alocările live. Nu ocoli o permisiune lipsă prin SQL sau clickuri riscante.
