---
name: conecteaza-symbai
description: Configurează sau repară automat conexiunea MCP Symbai pentru Codex ori Claude Code prin Symbai Connect + OAuth nominal. Folosește când tool-urile Symbai nu apar, accesul este refuzat, apare 401 sau utilizatorul schimbă calculatorul.
---

# Conectează sau repară Symbai

Scop: serverul `symbai` să apară conectat și să funcționeze direct, fără configurare tehnică făcută de utilizator.

## Regula de aur: citește starea, nu o deduce

Simptomul („nu merge", „nu văd tool-urile", „scrie blocat") nu spune cauza. Cauza o
spune serverul Symbai, iar tu o ai la un apel distanță. **Nu porni niciodată de la
o listă de cauze posibile și nu alege una ca să ai ce răspunde** — un motiv
plauzibil spus pe un ton sigur trimite omul să repare altceva decât ce e stricat,
iar el pierde o zi.

1. Apelează `connection_status` (serverul MCP local al Symbai Connect). Merge chiar
   și când toate celelalte tool-uri refuză — exact pentru asta există.
2. Citește blocul `conectare`:
   - `stare` — verdictul: `ok`, `neactivat`, `oprit_de_symbai`, `fara_legatura`, `blocat_local`, `offline`, `fara_date_pos`.
   - `explicatie` — **cauza exactă, trimisă de serverul Symbai, cu pasul de reparare în ea**.
   - `caDeFacut` — pașii care decurg din starea reală a acestui calculator.
3. Spune omului ce scrie în `explicatie`, cu cuvintele lui. Dacă `explicatie` e goală
   sau neclară, spune că motivul nu e cunoscut și treci la Pachetul personalizat.
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

Agentul de pe calculator și pachetul ăsta de skill-uri se actualizează separat, deci
poți primi skill-ul înaintea agentului. Recunoști situația așa: `connect_repair` nu
apare în lista de unelte, sau `connection_status` răspunde fără blocul `conectare`.

Atunci **nu improviza o cauză**. Spune-i omului că verificarea automată nu e
disponibilă pe versiunea de agent instalată la el, arată-i textul brut din
`licenta.explicatie` dacă există, și trimite-l în panoul local
`http://127.0.0.1:5196`, unde găsește aceleași informații și butonul **Conectează**.

## Fluxul unic pentru angajat

1. Proprietarul intră în Hub → **Acces AI**, alege angajatul și locația POS exacte, selectează permisiunile și acordă accesul.
2. Angajatul intră în POS cu propriul cont și deschide **Conectează un asistent AI**. Dialogul îi arată starea calculatorului lui: legat, oprit (cu motiv) sau cu un pachet descărcat și neinstalat.
3. Descarcă ultimul **Pachet personalizat Symbai Connect** pentru sistemul său și îl instalează pe calculatorul pe care va lucra.
4. În panoul Symbai Connect apasă **Conectează** lângă Codex sau Claude Code — sau lasă asistentul să cheme `connect_repair`.
5. Browserul se deschide automat. Angajatul se autentifică cu emailul și parola contului POS, nu cu PIN-ul de la casă, apoi aprobă accesul.
6. Symbai Connect configurează aplicația și mută în siguranță rezultatul în profilul angajatului. După confirmarea succesului, angajatul deschide o sesiune nouă în Codex sau Claude Code.

Nu cere niciodată utilizatorului să editeze fișiere, să ruleze comenzi MCP sau să copieze un mesaj, URL, cod, header ori token. Nu trimite tokenul proprietarului unui angajat.

**Un acces acordat leagă un singur calculator.** O instalare nouă îl înlocuiește pe
cel vechi, iar o descărcare nouă anulează activarea din pachetul descărcat anterior:
dacă omul are deja un pachet nefolosit, spune-i să-l instaleze pe acela, nu să
descarce încă unul.

## Verificare

1. Confirmă că pluginul `symbai-core` este instalat și activ.
2. Deschide o sesiune nouă după conectare.
3. Apelează `list_brands`; un răspuns valid confirmă conexiunea.
4. Dacă un tool spune „permisiune insuficientă", conexiunea funcționează: proprietarul verifică modulul acordat, iar rolul și alocările POS live pot limita suplimentar accesul.

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
- `ok` — accesul e valid. Dacă tot lipsesc tool-urile, e nevoie de o sesiune nouă.

## Alte situații

- **401 după ce mergea:** cheamă `connect_repair` — de cele mai multe ori doar autentificarea a expirat.
- **Angajat inactiv:** proprietarul reactivează contul POS, apoi acordă din nou accesul nominal.
- **Calculator schimbat:** instalează Pachetul personalizat pe noul calculator; îl înlocuiește automat pe cel vechi.
- **Configurație manuală veche detectată:** Symbai Connect indică intrarea veche `symbai`; elimină doar acea intrare din lista MCP, apoi reia conectarea. Nu afișa utilizatorului comenzi sau configurații.
- **Doar PIN disponibil:** utilizatorul își setează parola contului din Personal, apoi reia conectarea.

Accesul POS nu înlocuiește grantul proprietarului. Accesul final este intersecția dintre grant, consimțământul din browser, rolul POS live și alocările live. Nu ocoli o permisiune lipsă prin SQL sau clickuri riscante.
