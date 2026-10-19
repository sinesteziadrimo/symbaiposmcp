---
name: depaneaza-connect
description: Depanează Symbai Connect pe calculatorul clientului când asistenții nu mai răspund — toate legăturile Symbai expiră (inclusiv cea locală), antivirusul interceptează conexiunile (Avast/AVG cu scanarea HTTPS, Reason Cybersecurity), monitorizări sau sarcini oprite singure, limita contului Claude, cont Claude schimbat, Codex care nu pornește, vocale netranscrise, raportul care nu ajunge la proprietar, calculator oprit sau adormit. Spune ce repară omul din panoul Connect și ce nu atingi (fișiere cu tokenuri, antivirus, setări Windows). La «nu mai răspunde asistentul», «toate serverele Symbai dau timeout», «merge doar cu antivirusul oprit», «s-a oprit monitorizarea», «rulările sunt ok dar n-a făcut nimic», «nu mi-a venit raportul».
---

# Depanează Symbai Connect

Scop: asistenții răspund din nou, cu cauza dovedită, fără reparații pe ghicite.

## Regula: o pistă, cu dovadă

Simptomul nu spune cauza. Strângi semnele de mai jos, alegi pista care se potrivește cu toate și o verifici cu o probă înainte să-i ceri omului ceva. Nu schimbi versiunea Claude Code sau Codex, nu setezi variabile de mediu, nu reinstalezi și nu ceri reporniri repetate fără dovada că pasul repară. Când o pistă pică, o spui și treci la următoarea.

Licența, numărul și accesul la firmă le citești întâi cu `connection_status` ([conecteaza-symbai](../conecteaza-symbai/SKILL.md)). Dacă nici uneltele locale nu răspund, mergi la pasul 1.

## Pasul 1: ce pică

| Semn | Ce înseamnă | Unde continui |
|---|---|---|
| Toate legăturile (firma, WhatsApp-ul local, Google) expiră după aproximativ 30 de secunde și niciuna nu cere autentificare | ceva de pe calculator oprește conexiunile, de regulă antivirusul, nu contul | pasul 2 |
| Doar legătura firmei cere autentificare sau dă 401 | accesul la firmă | [conecteaza-symbai](../conecteaza-symbai/SKILL.md): `connection_status`, apoi `connect_repair` |
| Panoul scrie „Claude Code nu este autentificat” sau „ChatGPT Codex nu este autentificat” | loginul asistentului AI | pasul 3 |
| Mesaj de limită a contului Claude, cu ora de resetare | abonamentul AI, nu Symbai | pasul 4 |
| Monitorizare sau sarcină oprită, cu motiv | motivul spune cauza | pasul 5 |
| Rulări „ok” fără niciun apel Symbai, deși mesajul cerea date | nu dovedesc că s-a lucrat; legăturile pot să fi lipsit în acea rulare | le tratezi ca neverificate și reiei pasul 1 |
| Nicio linie în jurnal într-un interval | calculatorul sau Connect nu lucrau (oprit, adormit, utilizator delogat) | pasul 6 |

În Claude Code, pe același calculator, `claude mcp list` arată starea fiecărei legături: conectată, eșuată sau care cere autentificare. Afișezi doar numele și starea.

## Pasul 2: antivirusul interceptează conexiunile

Semne care se adună: au picat toate legăturile deodată, inclusiv panoul local `http://127.0.0.1:5196`; niciuna nu cere autentificare; browserul și alte programe ajung la Symbai; problema a început după o repornire sau o actualizare a antivirusului.

1. *Proba*, făcută de om, nu de tine: oprește protecția 10 minute. La Avast și AVG: clic dreapta pe pictograma de lângă ceas → Control scuturi → Dezactivează 10 minute. Tu verifici imediat legăturile. Dacă se fac în câteva secunde, antivirusul e cauza; dacă nu, îl scoți de pe listă și spui asta.
2. *Remediul*, făcut de om sau de cine administrează calculatorul: excepții pentru adresa firmei (`https://<firma>.symbai.app/*`), pentru panoul local (`http://127.0.0.1:5196/*`) și pentru dosarul aplicației asistentului (pe Windows, la Claude Code instalat cu aplicația Claude: `%APPDATA%\Claude\claude-code`; instalat separat: `%USERPROFILE%\.local\bin`). La Avast și AVG: Meniu → Setări → General → Excepții → Adaugă excepție. La Reason Cybersecurity sau alt antivirus activ: în setări, la Excepții sau Liste permise. Dacă excepțiile nu ajung, `*.symbai.app` se exclude din scanarea HTTPS a antivirusului (așa scrie și Connect când detectează interceptarea), cu acordul celui care administrează calculatorul. Numele meniurilor pot diferi după versiune.
3. *Verificarea*: proba cu protecția oprită nu dovedește excepțiile. Aștepți să repornească protecția, apoi verifici din nou legăturile și prima rulare reală (`watch_activity`).

Antivirusul care a scos agentul de suport al echipei Symbai e alt caz, cu excepția pentru `C:\SymbaiRemoteSupport\*`: [conecteaza-symbai](../conecteaza-symbai/SKILL.md) → „Suport tehnic”.

## Pasul 3: loginul asistentului AI

- „Claude Code nu este autentificat”: panou → *Monitorizări WhatsApp* → **Autentifică Claude Code**. Omul se loghează în browserul care se deschide; nu i se cere să lipească un cod în terminal.
- Contul Claude a fost schimbat în aplicația desktop: contul aplicației nu trece singur în Claude Code. Panou → *Modele AI* → Claude Code → *Opțiuni de conectare* → **Reconectează contul Claude**.
- ChatGPT Codex: **Autentifică ChatGPT Codex**, în același loc; pentru alt cont, *Modele AI* → ChatGPT · Codex → *Opțiuni de conectare* → **Reconectează contul ChatGPT**.
- „Codex nu a putut porni conexiunile necesare” sau „configurația Codex are un marcaj Symbai … repar-o manual”: nu deschizi și nu afișezi fișierul Codex. Versiunile noi de Connect scot singure marcajul rămas fără pereche, după o copie a fișierului. Dacă Connect e la zi și mesajul rămâne, îi spui omului mesajul exact și ceri ajutorul echipei Symbai (`trimite_ticket_symbai`). Monitorizarea trece pe Claude Code numai dacă proprietarul vrea și Claude Code e autentificat; schimbarea păstrează obiectivul și notițele, dar începe o sesiune nouă.
- După login reiei ce s-a oprit: monitorizările cu `update_watch {active: true}`, sarcinile cu `set_routine_active`.

## Pasul 4: limita contului Claude

E limita abonamentului AI al omului, nu a Symbai. Spui ora de resetare din mesaj. Nu te baza că rulările pierdute se reiau singure: după resetare citești `watch_activity` și `routine_activity`, tratezi o singură dată ce a rămas fără răspuns și reiei ce s-a oprit. Consumul se reduce după [consumul asistentului](../../knowledge/consum-asistent.md), nu prin reconectarea Symbai.

## Pasul 5: monitorizare sau sarcină oprită singură

- Citești motivul (`list_watches`, `routine_activity`). După o eroare trecătoare (internet, adrese care nu se rezolvă, limită, reîmprospătarea autentificării) verifici ce a rămas netratat, reiei (`update_watch {active: true}`, `set_routine_active`) și îi spui proprietarului ce interval a lipsit.
- „Conversația este gestionată de <nume> din Asistenții mei”: un asistent numit are conversația, chiar dacă e pe pauză. Alegi cu proprietarul un singur mecanism. Dacă rămâne monitorizarea veche, oprești întâi partajarea conversației cu firma, apoi o reiei explicit; oprirea partajării nu o reia singură.
- Sarcină oprită cu „răspunsul final nu conține JSON-ul cerut”, deși rularea și-a făcut treaba: nu rescrii obiectivul. O reiei și trimiți echipei Symbai ora și numele sarcinii (`trimite_ticket_symbai`).
- Raportul pentru proprietar nu ajunge: citești destinația cu `assistant_reporting` (`action: "get"`) și cauți în obiectiv sau în notițe către cine raportează. Dacă destinația e chiar numărul de pe care scrie asistentul, raportul rămâne în conversația acelui număr cu el însuși și proprietarul nu îl vede. O schimbi numai la cererea proprietarului (`assistant_reporting` cu `action: "set"`); în panou apare la „Unde te informează asistentul”. Pe versiunile care au `action: "set_owner"`, tot la cererea lui stabilești proprietarul numărului, cu numărul lui în `recipient`.
- Vocalele nu se transcriu sau cadrele din clipuri lipsesc, cu mesajul că pe calculator lipsește componenta pentru vocale și clipuri (pe versiunile vechi: „ffmpeg nu a fost găsit”): omul reinstalează Symbai Connect din pachetul descărcat din POS. Până atunci ceri textul în scris. Nu le ceri colegilor să nu mai trimită vocale.

## Pasul 6: calculatorul oprit sau adormit

Monitorizările și sarcinile rulează doar cu calculatorul pornit, utilizatorul conectat și internet. Spui intervalul în care calculatorul n-a lucrat și ce a rămas de tratat. Propui setări făcute de om: fără repaus la priză și actualizări Windows în afara programului. Nu recomanzi autologarea Windows și nici scoaterea parolei.

## Ce poate face omul în panou

Panoul se deschide din pictograma de lângă ceas sau la `http://127.0.0.1:5196`:

- *Monitorizări WhatsApp*: pauză și reluare, motivul opririi, asistentul fiecărei monitorizări, **Autentifică Claude Code** / **Autentifică ChatGPT Codex**, **Verifică contul Claude**;
- *Sarcinile asistenților*: sarcinile și starea lor;
- *Modele AI*: Claude Code și ChatGPT · Codex (**Instalează**, conectarea contului, *Opțiuni de conectare* → **Reconectează contul Claude** / **Reconectează contul ChatGPT**); la *Componente opționale și configurare avansată*, Dictare vocală (cu **Verifică actualizări**, după ce e instalată);
- *Unde te informează asistentul*: unde ajung raportările;
- *Firme*: conectarea firmei și **Schimbă firmele**;
- *Licența Symbai*: **Verifică licența**;
- **Diagnostic**, jos în panou: jurnalul, pentru echipa Symbai;
- *Suport tehnic*.

## Ce nu faci

- Nu afișezi și nu copiezi în conversație fișiere de configurare cu tokenuri: `~/.claude.json`, `claude_desktop_config.json`, `~/.codex/config.toml`, fișierele din dosarul de date Symbai Connect. Nici fragmente din ele.
- Nu scrii scripturi care citesc tokenuri din aceste fișiere ca să apeleze direct Symbai sau panoul local. Folosești uneltele.
- Nu oprești și nu configurezi tu antivirusul sau firewall-ul.
- Nu pornești `connect_repair` cu autentificare nouă când nicio legătură nu cere autentificare; pentru o simplă reverificare folosești `doar_verifica: true`.
- Nu creezi „paznici” proprii (sarcini programate în Windows, scripturi, alarme pe telefon). Spui ce lipsește și trimiți sugestia echipei Symbai.
- Nu spui „merge” până nu ai văzut legăturile conectate cu protecția antivirusului pornită și o rulare reală reușită.
