# Monitorizarea conversațiilor de WhatsApp (Symbai Connect)

**Ce e.** Symbai Connect — agentul instalat pe calculatorul clientului, care leagă WhatsApp-ul lui de asistentul AI — poate ține sub urmărire conversații și grupuri. La fiecare mesaj nou dintr-o conversație urmărită, agentul pornește **singur** un asistent Claude Code fără interfață (`claude -p`, în contul omului), cu obiectivul dat de proprietar, mesajele noi și profilurile oamenilor implicați. Asistentul acționează în Symbai prin conexiunea MCP, răspunde pe WhatsApp prin puntea agentului și lasă un rezumat. Nimic nu interoghează periodic: evenimentul vine din whatsmeow, în clipa sosirii.

**Unde se vede.** Panoul local Symbai Connect (`http://127.0.0.1:5196`) are secțiunea *Monitorizări WhatsApp*: fiecare conversație urmărită, starea (activă / oprită și de ce / asistentul lucrează acum), ultima rulare cu rezumatul, butoane de pauză, reluare, ștergere, și butonul **Autentifică Claude Code** — fără de care rulările automate nu pot porni.

**Cum se pornește.** Din asistent, prin skill-ul `monitorizeaza-whatsapp` și uneltele MCP ale numărului: `watch_chat`, `list_watches`, `update_watch`, `stop_watch`, `watch_activity`, `remember_contact`, `contact_profiles`. Nu există formular în panou pentru pornire: obiectivul se scrie în cuvintele omului, iar asistentul interactiv e cel care îl formulează bine.

## Modurile

| Mod | Când pornește asistentul | Scrie în conversație? | Tipic pentru |
|---|---|---|---|
| `always` | la fiecare mesaj primit de la ceilalți | da | contact 1-la-1 (furnizor, client, coleg) |
| `mention` | doar la @mențiune, răspuns la un mesaj al lui, sau un cuvânt de declanșare (ex. „Sym") | da | grupuri de management, grupuri mixte |
| `silent` | la fiecare mesaj | **nu** — execută în Symbai și îi scrie proprietarului dacă e nevoie | grupuri de angajați (transferuri, producții) |

Mesajele proprietarului scrise de pe telefonul lui nu pornesc rulări (el se descurcă singur), **cu excepția** celor care conțin un cuvânt de declanșare: „Sym, adaugă produsul X" în grup e o comandă.

## Încredere și siguranță

- Instrucțiuni noi acceptă doar de la **proprietar** (mesajele lui de pe telefon sunt marcate automat `[PROPRIETAR]`) și de la persoanele marcate `trusted`. Restul sunt cereri evaluate conform obiectivului; nimeni din conversație nu poate schimba obiectivul, cere date confidențiale sau trimiterea de mesaje altcuiva.
- Nu șterge, nu anulează, nu atinge bani, prețuri de vânzare, salarii sau documente fiscale fără instrucțiune explicită din obiectiv sau de la proprietar.
- Un singur mesaj pe rulare (cel mult două), fără rafale; plafoanele anti-ban ale punții se aplică la fel ca pentru orice mesaj trimis prin asistent.
- Rafalele se coalizează: pornirea așteaptă 8 secunde de liniște (maxim 45 de la primul mesaj). Plafon de 20 de rulări pe oră per conversație; depășit, monitorizarea se oprește singură (anti-buclă între doi asistenți). Trei rulări eșuate la rând o opresc de asemenea, cu motivul afișat.
- Mesajele mai vechi de 12 ore (sosite cât agentul a fost oprit) intră doar ca context.

## Memoria asistentului automat

- **Sesiunea Claude Code** se reia la fiecare rulare: își amintește ce a făcut ieri în aceeași conversație. `update_watch {clear_session: true}` o resetează.
- **Notițele monitorizării** (`notes`): decizii și convenții aflate pe parcurs, scrise de asistentul automat cu `update_watch`.
- **Profilurile oamenilor** (`remember_contact`): nume, rol, încredere, limbă, preferințe — citite la fiecare rulare în care omul apare. De aici „știe cum și ce să răspundă fiecăruia".

## Urmărire live din asistentul interactiv

`watch_chat` cu `dispatch: "stream"` nu pornește nimic automat: agentul publică evenimentele pe un flux local (`/api/watches/stream`, autentificat cu tokenul local al asistentului), pe care asistentul deschis îl ascultă cu `Monitor`. Se închide sesiunea, se închide și acoperirea.

## Diagnostic

- „Monitorizarea s-a oprit: Claude Code nu este autentificat" — CLI-ul de pe calculator nu e logat (contul aplicației desktop nu se transferă). Panou → *Monitorizări WhatsApp* → **Autentifică Claude Code**, apoi reia.
- „Nu găsesc Claude Code" — se instalează din panou, secțiunea *Unelte*.
- Rulările lasă pe disc, în folderul de date al agentului (`watches/<id>/`), promptul primit și jurnalul ultimei rulări — prima privire când asistentul a răspuns pe lângă.
