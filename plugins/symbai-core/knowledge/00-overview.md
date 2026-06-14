# Symbai — ce este și cum se leagă modulele

Symbai e un sistem complet de management pentru restaurante și hoteluri (HoReCa). Un client = o firmă cu unul sau mai multe branduri și locații, fiecare instanță pe propriul subdomeniu (ex. `restaurantultau.symbai.app`).

> Pentru navigare exactă (link la o pagină, cum ajungi acolo) folosește mereu tool-ul `gaseste_in_aplicatie` — harta reală a instanței clientului. Acest fișier explică **conceptele**, nu rutele exacte. Lista completă a paginilor e în `harta-aplicatiei.md`.

## Modulele principale

- **POS / Sală** — vânzarea la masă: planul de sală, mesele, notele, ospătarii. Inima operațională. → `comenzi-mese-ospatari.md`
- **Comenzi clienți (QR / online)** — clienții comandă singuri de la masă prin cod QR sau din portalul web. → `comenzi-mese-ospatari.md` + `livrari-comenzi-online.md`
- **Livrări** — comenzi pentru livrare, dispecerat, curieri, integrări cu platforme (Glovo, Wolt, Bolt, Tazz). → `livrari-comenzi-online.md`
- **Meniu** — ce se vinde: articole de meniu cu preț, categorii, poze, meniu fizic, oferte/promoții. → `produse-meniu-retete.md`
- **Produse & Stocuri (Inventar)** — produsele fizice, gestiunile, stocul pe loturi, recepții (NIR), transferuri, inventariere, consum. → `stocuri-inventar-furnizori.md`
- **Furnizori & Achiziții** — de la cine cumperi, cataloage, comenzi de aprovizionare, prețuri furnizor. → `stocuri-inventar-furnizori.md`
- **Rețete & Producție** — din ce se face fiecare preparat (consum + cost); producția: simplă (restaurant) sau de fabrică (loturi, planificare, trasabilitate, calitate). → `produse-meniu-retete.md` + `productie-restaurant.md` (restaurant) / `productie-fabrica.md` (fabrică)
- **Rezervări & Evenimente** — rezervări de masă, evenimente private, petreceri, clienți (CRM), loialitate, feedback. → `rezervari-clienti-evenimente.md`
- **Personal (Staff)** — angajați, roluri, contracte, ture, pontaj, salarizare, beneficii. → `personal-hr.md`
- **Rapoarte / Analytics** — vânzări, KPI, food cost, marjă, performanță. → `rapoarte-preturi.md`
- **Finanțe** — casierie (registru de casă), închidere de zi, facturi, e-Factura ANAF, contabilitate. → `finante-facturare-contabilitate.md`
- **Marketing & Website** — postări social media, e-mail, ads, website-ul restaurantului, coduri QR. → `marketing-social.md`
- **Echipamente** — imprimante, ecrane bucătărie (KDS), agentul de imprimare, serverul local (edge), dispozitive. → `echipamente-kds-imprimante.md`
- **Setări & Administrare** — locații, branduri, TVA, metode de plată, utilizatori și roluri, integrări, abonament. → `setari-administrare.md`
- **AI în aplicație** — asistentul Sym (butonul plutitor) + agenții specialiști. → `asistentul-ai-in-aplicatie.md`

Două fișiere de referință transversale: `harta-aplicatiei.md` (indexul exhaustiv al TUTUROR paginilor, generat din registrul de navigare al aplicației) și `tools-mcp.md` (catalogul complet al tool-urilor MCP, cu modelul de permisiuni).

## Cum se leagă (lanțul de bază)

1. **Produs** (lucru fizic, ex. „Făină 00") → are **stoc** (pe loturi, într-o gestiune) și **preț de achiziție** (din facturile de la furnizori).
2. **Rețetă** = ce ingrediente (produse) intră într-un preparat + cantități → dă **costul** preparatului.
3. **Articol de meniu** = lucrul vandabil, cu **preț de vânzare** → legat de produsul finit/rețetă.
4. **Vânzare** (la masă / QR / livrare) → scade **stocul** prin consumul din rețetă (FIFO pe loturi) → alimentează **rapoartele** (vânzări, food cost realizat, marjă).
5. **Finanțe** → încasări, registru de casă, facturi, contabilitate (note contabile generate automat din documente).

Înțelegerea acestui lanț e cheia pentru a răspunde corect la „de ce scade profitul", „de ce nu scade stocul", „ce marjă am".

## Ecosistemul Symbai (în afara instanței POS)

- **Portalul Hub** (`hub.symbai.app`) — contul clientului la Symbai: abonament, facturile Symbai, contracte și secțiunea **Acces AI** (de unde se generează tokenul conexiunii MCP și se instalează acest plugin). Întrebări despre abonament/factura Symbai → portalul Hub, nu aplicația POS.
- **Symbai Supplier** — platforma furnizorilor; un furnizor conectat primește comenzile direct, iar cataloagele se sincronizează automat.
- **Serverul local (edge)** — un calculator în restaurant care ține POS-ul funcțional și imprimarea bonurilor chiar și fără internet. Detalii în `echipamente-kds-imprimante.md`.

## Vizibilitatea paginilor (important)

Nu toți clienții văd toate paginile: meniul aplicației depinde de **modulele active în abonament** și de **rolul** utilizatorului (proprietar/manager/ospătar...). Dacă utilizatorul nu găsește o pagină descrisă aici, fie modulul nu e activ în abonament (se vede în portal Hub), fie rolul lui nu are permisiunea. Nu insista pe o rută pe care `gaseste_in_aplicatie` nu o întoarce.

## Roluri și permisiuni

Symbai e multi-rol: proprietar, manager, ospătar, bucătar etc. Fiecare vede doar ce-i permite rolul. Când dai link sau explici, ține cont că utilizatorul tău e de regulă proprietar/manager (vede tot).

## Reguli de comportament agent (obligatorii)

### 1. Filtrare automată când utilizatorul menționează o unitate specifică

Când utilizatorul întreabă ceva legat de rapoarte, vânzări, P&L, stoc, personal sau orice alt modul și menționează explicit un brand, o locație sau o unitate (ex. „la Riviere", „pe Berarescu", „pentru Drimoland", „la terasa X"), **filtrează OBLIGATORIU** cu `brandId` și/sau `locationId` corespunzătoare. Nu prezenta date agregate pentru toate unitățile când se cere explicit una singură.

Flux:
1. Dacă nu ai deja `brandId`/`locationId` pentru unitatea menționată → rulează `list_brands` + `list_locations` întâi.
2. Apelează tool-ul cu parametrii de filtrare expliciți (`brandId`, `locationId`).
3. Prezintă doar cifrele pentru unitatea cerută.

### 2. Arată vizual în Chrome când utilizatorul cere să vadă ceva

Când utilizatorul spune „arată-mi", „du-mă la", „deschide", „vreau să văd în aplicație" sau orice variantă similară:
1. Folosește `gaseste_in_aplicatie` pentru a obține linkul exact al paginii.
2. Navighează în Chrome cu `mcp__Claude_in_Chrome__navigate` la acel link.
3. Fă un screenshot (sau descrie ce e pe ecran) ca să confirmi că pagina s-a deschis.

Nu te limita la a da un link în chat — deschide activ pagina în browser și arată-o.

## TVA România (regulă fixă)

Cotele folosite sunt **0%, 11%, 21%** (NU 5/9/19). De regulă mâncarea preparată e la 11%, unele produse (ex. băuturi cu zahăr, alcool) la 21%. Nu schimba aceste cote.
