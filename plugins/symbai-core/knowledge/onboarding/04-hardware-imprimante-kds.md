# Onboarding 04 — PC-ul din locație, imprimantele, casa de marcat și ecranele de bucătărie

> Fază din ghidul de onboarding Symbai prin Claude Code. Planul general și ordinea fazelor: `00-plan-general.md` (același folder). Conceptele de echipamente (KDS, Print Agent, server local, rutare) sunt explicate pe larg în `../echipamente-kds-imprimante.md` — aici e DOAR ce faci în onboarding.

## Scopul fazei

La final, locația are: cel puțin un PC înregistrat cu programul Symbai instalat (unul desemnat „Server"), casa de marcat fiscală conectată, imprimantele termice de bonuri adăugate (cu IP) și — opțional — ecrane de bucătărie în locul bonurilor de hârtie, plus regulile care trimit fiecare produs la imprimanta/ecranul potrivit. Fără faza asta, comenzile din POS nu ajung fizic nicăieri: nu iese bon fiscal, nu iese bon la bucătărie. Faza depinde de **locații** (faza Setup) și de **etichetele pe produse** (faza Etichete) — rutarea se face pe etichete.

**Atenție: e faza cea mai UI-heavy din tot onboarding-ul.** Partea de instalare pe PC e fizică (descarci, rulezi un fișier pe calculatorul din restaurant) și NU are tool-uri MCP. Rolul tău aici e mai mult de ghid + verificator decât de executant. Fii onest cu utilizatorul despre asta de la început.

## Cum vorbești cu utilizatorul (obligatoriu — zero jargon intern)

Utilizatorul e om de business, nu tehnic. Numele de tool-uri și termenii interni rămân doar în raționamentul tău:

| Termen intern (NU în conversație) | Cum îi spui utilizatorului |
|---|---|
| Print Agent / PA | „programul Symbai de pe PC" / „PC-ul care gestionează imprimantele" |
| Edge Server / edge | „serverul local" / „PC-ul Server" |
| KDS | „ecran de bucătărie" / „ecranul pe care bucătarii văd comenzile" |
| device / „server" / Leader | „PC" / „PC-ul Server (cel mai stabil, pornit non-stop)" |
| tag routing / reguli de rutare | „regula care trimite produsele la imprimanta/ecranul potrivit" |
| ESC/POS / port 9100 | „imprimantă termică de rețea, conectată cu cablu la router" |
| driver fiscal / serial / COM | (invizibil) „casa de marcat e legată prin cablu la un PC" |
| WebSocket / heartbeat / online | „PC-ul e conectat / răspunde" |
| endpoint / query / JSON / MCP | niciodată |

## Permisiuni necesare pe token

- **`setari`** — pentru `create_printer` și `create_kds_screen`. Fără el, tool-urile de scriere întorc „permisiune insuficientă" → trimite utilizatorul în portalul Hub → Acces AI să bifeze modulul „Setări & Configurare" pe token.
- **`produse_meniu`** — doar dacă mai trebuie completate etichete pe produse (`create_tag`, `assign_tag`, `bulk_assign_tag`) — în mod normal s-a făcut în faza Etichete.
- **SQL read-only** (toggle separat) — opțional, dar foarte util aici: e singura cale prin MCP de a vedea PC-urile înregistrate și regulile de rutare (găsești tabelele potrivite cu `list_database_tables`/`describe_database_table`).

## Ce afli singur ÎNAINTE să întrebi — și ce întrebi utilizatorul

**Citește automat, fără să întrebi:**
1. `list_locations` — id-urile locațiilor; o singură locație activă = nu mai întrebi „pentru care local".
2. `list_brands` — brandId pentru parametrii obligatorii.
3. `list_printers` (cu `locationId` și `brandId`) — ce imprimante/case există DEJA și starea lor live. `status` = live (`online`/`offline`/`unassigned`/`mobile_local`), `statusConfigurat` = valoarea salvată în configurare. Critic: `create_printer` NU verifică duplicate (vezi Capcane).
4. `list_entities` cu `entityType: "kds_screens"` — ecranele existente (nu există un `list_kds_screens` dedicat).
5. `list_tags` + `list_tag_summary` — există etichete pe produse? Fără etichete, rutarea n-are pe ce să se sprijine → întoarce-te la faza Etichete întâi.
6. Cu SQL activ: interoghează tabela de PC-uri (nume, care e Server, starea programului de imprimare) și tabela de reguli de rutare (ce e deja legat) — găsește-le întâi cu `list_database_tables`/`describe_database_table`.

**Întrebi DOAR (formulări sugerate):**
1. „Câte calculatoare folosești în locație (bar, recepție, bucătărie)? Care dintre ele e cel mai stabil — pornit non-stop? Acela va fi PC-ul Server."
2. „Ce casă de marcat ai — Datecs sau Daisy? La care PC e băgat cablul ei?" (Altă marcă → vezi Capcane.)
3. „Câte imprimante de bonuri ai și pe ce secții (bucătărie, bar, grill)? Știi adresa IP a fiecăreia?" — dacă nu știe IP-ul: „printează pagina de configurare a imprimantei: ține apăsat butonul Feed cu capacul deschis — IP-ul apare pe hârtie."
4. „Vrei ca bucătăria să vadă comenzile pe un ecran (tabletă/monitor) în loc de hârtie? Dacă da: un singur ecran central, sau câte unul pe secție?" (Ecranele sunt opționale.)

Nu cere date opționale (model casă, mod de afișare — au default-uri bune). Confirmă lista finală cu utilizatorul înainte de orice scriere.

## Pașii de execuție — tool-urile MCP exacte

Ordinea dependențelor: **PC-uri (UI) → casă fiscală (UI) → imprimante de rețea (MCP) → ecrane (MCP) → rutare (UI) → verificare (MCP)**.

### Pas 1 — PC-urile și serverul local: DOAR din aplicație
Nu există tool-uri pentru a înregistra PC-uri, a descărca pachetul de instalare sau a desemna PC-ul Server. Vezi secțiunea „Ce se face DOAR din aplicație".

### Pas 2 — Casa de marcat fiscală: recomandă aplicația
`create_printer` acceptă `type: "fiscal"` și salvează nume/tip/IP/brand/locație, dar NU poate seta la care PC e cablul casei și nici marca (Datecs/Daisy), deci casa creată prin MCP rămâne o **cocă nefuncțională** până e completată din aplicație. Nu o crea prin MCP — ghidează utilizatorul să o adauge din wizard-ul aplicației (pasul 8) sau din Setări → Imprimante, unde dialogul îl întreabă exact: cum o numim, ce marcă e, la care PC e cablul.

### Pas 3 — Imprimantele termice de rețea: prin MCP
Pentru fiecare secție cu imprimantă (bucătărie, bar, grill):

```
create_printer({
  name: "Bucătărie",          // numele secției — IMPORTANT: să semene cu eticheta (vezi Pas 5)
  type: "kitchen",             // bon de secție (ce folosește și wizard-ul); "receipt"=bon client, "label"=etichete
  ipAddress: "192.168.1.50",  // IP-ul imprimantei în rețeaua locală — cere-l explicit
  brandId: 1,                  // imprimanta aparține acestui brand; la multi-brand folosește brandIds explicit
  locationId: 2                // din list_locations — pune-l MEREU, altfel imprimanta plutește fără locație
})
```

Default-urile sunt corecte pentru imprimante de rețea (conexiune de rețea, port 9100). După creare, **confirmă prin `list_printers`**, nu prin interfață: apar numele/IP-ul/brandul, dar `status` poate fi `unassigned` până când imprimanta e legată de PC-ul Server în aplicație. Apoi cere utilizatorului să apese „Testează" pe cardul imprimantei în aplicație — verifică conexiunea cu imprimanta (NU scoate hârtie). Testul care chiar scoate hârtie e butonul „Test" din Setări → Imprimante (trimite un job de probă real).

### Pas 4 — Ecranele de bucătărie (opțional): prin MCP
```
create_kds_screen({ name: "Ecran Bucătărie", brandId: 1, locationId: 2 })
```
Tool-ul e **idempotent pe nume** (dacă există deja un ecran cu acel nume, îl întoarce pe acela — poți re-rula liniștit). Creează un ecran de tip „stație" cu default-uri bune (mod afișare bonuri). Topologie:
- **Un ecran central** (recomandat la început): creezi UN ecran și apoi (în Pas 5, din aplicație) TOATE etichetele se rutează la el.
- **Pe secții**: câte un ecran per secție (`Ecran Bucătărie`, `Ecran Bar`...), fiecare etichetă rutată la ecranul ei. Ecranul „principal" care le adună pe toate NU se poate crea prin MCP (tipul de ecran nu e parametru) — se face din fluxul ghidat al wizard-ului.

### Pas 5 — Rutarea etichetă → imprimantă/ecran: DOAR din aplicație
**Nu există tool MCP** pentru regulile de rutare. Un ecran sau o imprimantă FĂRĂ regulă de rutare nu primește nimic — crearea lor e doar jumătate de treabă. Vezi secțiunea următoare. Truc care face rutarea aproape automată: dacă ai numit imprimantele/ecranele LA FEL ca etichetele („Bucătărie", „Bar"), butonul „Leagă automat" din wizard face potrivirea după nume singur.

## Ce se face DOAR din aplicație

Pentru fiecare, dă link cu `gaseste_in_aplicatie(intrebare)` și verifică prin citire după ce utilizatorul zice că a terminat:

1. **Înregistrarea PC-urilor + instalarea pe ele** — `gaseste_in_aplicatie("instalare PC server local")`. Fluxul pe care i-l explici: în wizard (pasul 7) adaugă fiecare PC cu nume + locație → descarcă ZIP-ul unic al PC-ului → pe PC-ul fizic dezarhivează și rulează „Instalare Symbai.bat" **ca administrator** (2-3 minute) → cardul PC-ului devine „Online" → pe PC-ul cel mai stabil apasă „Setează ca Server" (primul PC adăugat într-o locație devine automat Server — butonul e necesar doar ca să muți rolul pe alt PC). Notă: butonul de adăugare PC a fost SCOS din Setări — adăugarea se face doar din wizard-ul de onboarding. Verificarea ta: doar cu SQL pe tabela de PC-uri — uită-te la starea agentului de imprimare, NU la statusul generic al dispozitivului (acela e „online" din oficiu și NU dovedește instalarea) — sau întrebi utilizatorul dacă scrie „Online" pe card.
2. **Casa de marcat fiscală** — `gaseste_in_aplicatie("adaugă casă de marcat")`. După: `list_printers` → trebuie să apară cu `type: "fiscal"`.
3. **Rutarea etichetă → imprimantă/ecran** — `gaseste_in_aplicatie("rutare taguri imprimante")`. În wizard, tab-ul „Cum ajung comenzile" are butonul „Leagă automat" (potrivire pe nume). Verificarea ta: cu SQL pe tabela de reguli de rutare (fiecare etichetă să aibă o imprimantă și/sau ecrane setate); fără SQL, cere utilizatorului să confirme că nicio etichetă nu mai arată „Nelegat încă".
4. **Deschiderea efectivă a ecranului de bucătărie** — pe tableta/monitorul din bucătărie se deschide aplicația în browser și se alege ecranul; `gaseste_in_aplicatie("ecran bucătărie display comenzi")`.
5. **Testul imprimantelor** — butonul „Testează" pe cardul fiecărei imprimante (wizard pasul 8) verifică doar conexiunea; testul care scoate hârtie e butonul „Test" din Setări → Imprimante. Nu există tool de test prin MCP.

## Echivalentul în wizard-ul din aplicație

- **Pasul 7 — „Instalare PC"** (`/onboarding/step/7`): adaugă PC-urile, descarcă ZIP-urile, desemnează Server-ul. Tot ce e aici e UI-only pentru tine.
- **Pasul 8 — „Imprimante și ecrane"** (`/onboarding/step/8`): 4 tab-uri — Case de marcat / Imprimante bonuri / Ecrane bucătărie (flux ghidat: central vs pe secții) / Cum ajung comenzile (rutarea + „Leagă automat").

Imprimantele și ecranele create de tine prin MCP **apar în wizard** (pașii citesc aceleași date), deci utilizatorul le vede acolo și poate continua cu rutarea. Dar progresul wizard-ului (bifele de pași) NU se actualizează prin conexiunea MCP — dacă utilizatorul ține evidența în wizard, îi spui să apese el „Următorul pas".

## Verificare la final

1. `list_printers({ locationId, brandId })` — apar: casa fiscală (`type: "fiscal"`) + câte o imprimantă per secție, fiecare cu IP și brandul corect. Zero duplicate. Pentru imprimante funcționale, `status` trebuie să fie `online`; `offline`/`unassigned` înseamnă PC/Print Agent/legare incompletă, chiar dacă `statusConfigurat` arată „online".
2. `list_entities({ entityType: "kds_screens" })` — ecranele planificate există, fiecare cu `locationId` setat.
3. `list_tag_summary` — etichetele de secție există și au produse asignate.
4. Cu SQL: în tabela de reguli de rutare, fiecare etichetă folosită pe produse are o destinație (imprimantă și/sau ecran); în tabela de PC-uri, există exact un PC Server activ per locație.
5. Confirmări de la utilizator (n-ai tool pentru ele): PC-urile arată „Online"; „Testează" arată conectat la fiecare imprimantă (iar „Test" din Setări → Imprimante a scos hârtie); un bon de probă apare pe ecranul de bucătărie.

## Capcane

- **`create_printer` NU e idempotent** — fiecare apel inserează un rând nou, fără verificare de duplicat. Citește `list_printers` ÎNAINTE de a crea și nu re-rula un apel doar pentru că nu ești sigur că a mers — confirmă întâi prin citire. (`create_kds_screen`, prin contrast, E idempotent pe nume.)
- **Ecran creat ≠ ecran funcțional.** Un ecran fără regulă de rutare etichetă→ecran nu primește NICIO comandă — pare instalat, dar e gol. La fel imprimantele de secție. Rutarea (UI-only) e parte obligatorie din fază, nu opțional.
- **Nu încerca să „repari" un ecran principal gol prin MCP.** Un ecran de tip „principal" (master) fără ecrane de secție legate afișează ALB intenționat. Prin MCP creezi doar ecrane de stație (default-ul corect); topologia cu ecran principal se configurează din fluxul ghidat al aplicației.
- **Casa de marcat fiscală: driverul recomandat e Symbai (nativ).** Pentru Datecs/Daisy/Tremol, driverul **Symbai (nativ)** e preselectat automat la alegerea mărcii — validat pe case reale, nu mai e „beta". **DUDE** rămâne opțiune doar pentru Datecs; **EcrBridge** pentru SAM4S/parcuri mixte; **Fisco/folder fiscal** rămâne varianta prin softul producătorului. Indiferent de driver, cere mereu testul fizic din aplicație înainte să declari casa funcțională — nu o crea prin MCP ca funcțională fără test.
- **`create_printer` onorează brandul acum** — `brandId` face imprimanta a acelui brand (iar `brandIds` permite mai multe branduri). Pune TOTUȘI și `locationId`: brandul decide vizibilitatea, locația decide unde se rutează și unde se testează.
- **Casa fiscală implicită pe locație** — dacă ai deja o imprimantă fiscală funcțională și locația trebuie să o folosească drept fallback, poți seta `update_location({ locationId, defaultFiscalPrinterId })`; apoi verifici cu `list_locations` / pagina Setări. Pentru terminale/PC-uri proprii rămâne `update_pos_device`.
- **Imprimanta creată prin MCP nu are PC gestionar asociat** (parametrul nu există în tool). În aplicație, dialogul wizard-ului o leagă automat de PC-ul Server. După creare prin MCP, cere utilizatorului testul „Testează" din aplicație; dacă nu răspunde, verificați împreună în Setări → Imprimante că e gestionată de PC-ul Server.
- **`status` din `list_printers` este LIVE acum.** Nu-l confunda cu `statusConfigurat`: dacă vezi `unassigned`, imprimanta nu are PC gestionar; dacă vezi `offline`, PC-ul/Print Agentul nu răspunde. Pentru detalii despre PC-uri folosește `list_pos_devices` sau SQL pe tabela de PC-uri, dar pentru primul diagnostic de imprimantă ajunge `list_printers`.
- **Rutarea e legată de locație** — la multi-locație, nu lega etichetele unei locații de ecranele alteia (comenzile ar „sări" între localuri). Fiecare regulă se face cu locația ei.
- **Numele = cheia rutării automate.** Etichetă „Bucătărie" + imprimantă „Bucătărie" + ecran „Ecran Bucătărie" → „Leagă automat" le unește singur. Nume divergente („Food", „Imprimanta 1") = legare manuală, bucată cu bucată.
- **După scriere, confirmă prin tool de citire, NU prin interfață** — browserul utilizatorului are cache și arată datele noi abia după refresh. Dacă utilizatorul zice „nu văd imprimanta", cere-i un refresh înainte să presupui că scrierea a eșuat; nu repeta scrierea, nu raporta bug.
- **Ordinea contează**: fără PC instalat și Online, „Testează" și bonurile reale eșuează chiar dacă imprimantele/ecranele sunt perfect configurate în date. Nu lăsa utilizatorul să creadă că „s-a stricat" — verifică întâi că PC-ul Server e pornit și conectat.
