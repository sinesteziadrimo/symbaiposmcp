# Abonamente (subscriptions)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Modulul de abonamente acoperă livrările recurente: produse sau servicii care merg periodic la client (zilnic, săptămânal, lunar). Un abonament e un contract repetat cu factură automată și livrare conform frecvenței alese — sursă de venit predictibil și retenție. E util pentru clienți care primesc constant (companii cu livrări de mâncare, magazine cu aprovizionare automată). Pagina centrală e **/subscriptions**, cu trei zone: abonamente active, KPI (MRR/ARR/churn) și coada de plăți eșuate (dunning). Partea de livrare propriu-zisă (cum pleacă coletul/comanda) e în ghidul „Livrări și comenzi online".

## Concepte

- **Abonament** — contract de livrare repetată: client + produse + frecvență + preț pe ciclu + status (Activ, Trial, Pauză, Restant, Anulat).
- **Ciclu** — un interval de facturare/livrare (ex: o lună). La fiecare ciclu se generează factura și comanda de livrare.
- **MRR** (venit lunar recurent) — totalul lunar din abonamentele **active** (un abonament de 100 lei/lună aduce 100 la MRR). Abonamentele în Pauză/Restant NU se numără.
- **ARR** (venit anual recurent) — MRR × 12, pentru planificare anuală.
- **ARPU** — venitul mediu per abonat activ (cât aduce în medie fiecare client).
- **LTV** (valoare pe viață) — estimare cât va cheltui un abonat pe toată durata lui; arată cine-s clienții cei mai valoroși.
- **Churn (rata de anulare)** — procentul de abonați care anulează într-o perioadă. Rata mare = problemă de retenție.
- **Trial** — perioadă de test (gratuită sau cu discount) înainte ca abonamentul să devină plin plătitor.
- **Dunning** — reîncercarea automată a unei plăți eșuate (card expirat, fonduri insuficiente). Dacă reușește, abonamentul rămâne activ; dacă eșuează final, intră în **Restant**.
- **Pauză** — clientul suspendă temporar livrările fără să anuleze. NU se reia singură — trebuie reactivată manual la final.
- **Upgrade / Downgrade** — schimbare de frecvență sau cantitate fără anulare (ex: de la săptămânal la lunar).

## Pagini

- **Abonamente** (`/subscriptions`) — pagina centrală, cu trei zone:
  - **Abonamente active** — tabel cu căutare și filtru pe status; coloane: client, produs, frecvență, preț, următoarea livrare, status. Acțiuni pe rând: pauză, reactivare, anulare, upgrade/downgrade, detalii.
  - **KPI** — carduri cu MRR, ARR, ARPU, LTV, rată churn și numărul de abonați (activi, trial, pauză, restanți, anulați), plus grafice de trend.
  - **Dunning (plăți eșuate)** — coada livrărilor cu plată eșuată: client, abonament, motiv, dată încercare, stare. De aici reîncerci plata sau contactezi clientul.
- **Detalii abonament** — deschisă din tabel (clic pe rând): client, produs, frecvență, preț pe ciclu, dată start, istoric livrări, timeline-ul reîncercărilor de plată, note. Tot de aici modifici, pui pe pauză, reactivezi sau anulezi.

## Fluxuri pas-cu-pas

1. **Snapshot rapid al afacerii recurente**: deschizi /subscriptions → KPI vezi MRR/ARR/ARPU/churn și câți abonați ai pe fiecare status. (Citire: `get_subscriptions_dashboard`.)
2. **Vezi cine-s abonații activi**: tab Abonamente active → filtrezi pe status „Activ" → vezi client, produs, frecvență, preț, următoarea livrare. (Citire: `list_subscriptions`.)
3. **Creezi un abonament nou** (ex: client cere livrare zilnică): din /subscriptions → buton de adăugare → alegi clientul, produsul (caută în catalog), frecvența, prețul pe ciclu, data de start și eventual zilele de trial. (Acțiunea de creare se face din interfață; pentru a deschide pagina folosește `gaseste_in_aplicatie`.)
4. **Pui un abonament pe pauză** (client vrea pauză 2 săptămâni): tab Abonamente active → găsești abonamentul → acțiunea „Pauză" cu data până la care se suspendă. Reține: la final NU se reactivează singur. (Verifici după aceea cu `list_subscriptions` că statusul e „Pauză".)
5. **Tratezi o plată eșuată (dunning)**: KPI îți arată câte abonamente au plată eșuată → tab Dunning → vezi motivul (card expirat, fonduri insuficiente, declinare bancă) → reîncerci plata manual SAU contactezi clientul (cere alt card). Dacă reușește, revine la Activ; dacă eșuează final, rămâne Restant.
6. **Upgrade/downgrade** (client vrea mai des sau mai rar): din detaliile abonamentului → schimbi frecvența și prețul pe ciclu → următoarea facturare reflectă noile condiții.
7. **Anulezi un abonament**: tab Abonamente active → acțiunea „Anulare" → statusul devine „Anulat" și nu se mai generează comenzi/facturi. (Confirmi cu `list_subscriptions` filtrând pe „Anulat".)
8. **Analizezi churn și clienții valoroși**: KPI vezi churn % și numărul de anulări pe perioadă. Pentru un breakdown mai fin (motive de anulare, top LTV) ai acces SQL read-only prin `execute_sql_query`. Pe clienții valoroși îi poți răsplăti (vezi ghidul „Loialitate & Fidelizare").

## Tool-uri MCP utile

- Citire: `get_subscriptions_dashboard` (KPI: MRR/ARR/ARPU/churn + numere pe status), `list_subscriptions` (lista abonamentelor, cu filtru pe status). Ambele sunt read-only, dar cer grantul `readModule` financiar aferent.
- Acces SQL read-only pentru rapoarte ad-hoc: `execute_sql_query`.
- Acțiunile de scriere (creare/modificare/pauză/anulare/reîncercare plată) se fac din **interfață** — folosește `gaseste_in_aplicatie` ca să primești linkul direct la pagina abonamentului. Pe măsură ce apar tool-uri MCP de scriere pentru abonamente, permisiunea exactă va fi în `tools-mcp.md` (modulul „Livrări & Ecommerce" pe token).

## Întrebări frecvente

- **De ce nu-mi crește MRR deși am mai mulți abonați?** MRR se calculează doar pe abonamentele **active**. Cei în Pauză sau Restant (plată eșuată) nu se numără. Verifică numerele pe status în KPI; tot așa, downgrade-urile reduc MRR-ul.
- **Cât durează reîncercarea unei plăți eșuate?** Sistemul încearcă automat de mai multe ori, pe zile diferite. Dacă tot eșuează, abonamentul intră în Restant și așteaptă intervenția ta — sună sau scrie clientului, nu lăsa sistemul să-l piardă.
- **Pot schimba prețul unui abonament existent?** Da, prin upgrade/downgrade din detaliile abonamentului; noul preț se aplică de la următoarea factură.
- **Ce înseamnă „Trial"?** Perioadă de test (gratuită sau cu discount) la început; după expirare abonamentul trece la Activ și încep taxele normale.
- **Dacă anulez, clientul primește banii înapoi?** Depinde de configurare și de ce-a plătit în avans — discută cu clientul înainte și marchează rambursarea dacă e cazul.
- **De ce abonamentul pauzat nu se reia singur?** Așa e prin design (protecție ca să nu surprinzi clientul cu o livrare neașteptată). După ce trece data de pauză, trebuie să-l **reactivezi** manual.
- **Cum afectează abonamentele stocul?** Când se generează comanda de livrare a unui ciclu, ea scade stocul ca orice vânzare. Dacă stocul nu ajunge, livrarea se amână (backorder).
- **Care-i diferența între Pauză și Restant?** Pauză = cerută de client, temporar, controlată de tine. Restant = plata a eșuat, abonamentul e blocat și riști să-l pierzi.

## Capcane

- **MRR ≠ număr de abonați** — doar abonamentele active intră în MRR; nu te baza pe „am mulți abonați" dacă jumătate sunt în Pauză/Restant.
- **Abonamentul pauzat NU se reactivează automat** — la finalul pauzei trebuie să-l reactivezi tu (sau o automatizare), altfel clientul nu mai primește nimic.
- **Restant = risc de pierdere, nu detaliu** — tratează coada de dunning ca o prioritate: card expirat înseamnă bani pierduți lună de lună până rezolvi.
- **Upgrade pe un abonament restant** — rezolvă întâi plata eșuată, abia apoi schimbă planul, altfel se pot încurca facturile.
- **Notificarea clientului la plată eșuată** nu e mereu automată — configurează o automatizare (trigger pe plată eșuată → email/SMS) sau contactează manual, vezi ghidul de marketing/comunicare.
- **Anularea cu cerere GDPR** — dacă un client cere ștergerea datelor (GDPR), abonamentul trebuie anonimizat/șters cu atenție la facturare și audit; vezi ghidul „GDPR & date clienți".
- **Livrarea propriu-zisă e modul separat** — cum pleacă efectiv comanda (curier, AWB, dispecerat) e în ghidul „Livrări și comenzi online"; aici gestionezi doar contractul recurent.
