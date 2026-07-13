# Navigare rapidă — ce e în fiecare pagină + unde te duce

> **Citește ÎNTÂI asta** la „du-mă la X / unde e Y”. Fiecare rând: **pagina** `ruta` — *ce vezi/faci acolo*. `· NU aici:` = capcana sibling (unde să mergi în schimb). Conținut verificat contra paginilor reale.
> Dacă intenția nu e aici sau e ambiguă → `gaseste_in_aplicatie(termen scurt)`. Cum DESCHIZI pagina prin Chrome + cum SCHIMBI unitatea: `navigare.md`.
> Rute relative la subdomeniul clientului. Ce nu vede userul = rol/modul lipsă (vezi `00-overview.md`).

Nota pentru `/menu/platforms`: aceeasi pagina are doua configurari diferite. Cardul **Configurare Platforma Clienti** este portalul public al clientilor si merge cu skill `configureaza-portal` + tool-uri `configure_portal_*`. Cardul **In Aplicatie Staff** este preview/config pentru **Symbai Staff** (livratori, agenti teren, task-uri, CRM) si merge cu skill `configureaza-aplicatie-staff`; nu folosi tool-urile de portal pentru el.

## Operațiuni & POS
- **Panou de Control** `/` — Dashboard generic: KPI (nr. produse, stoc redus, valoare stoc, de plătit furnizori), grafic facturi, top produse, sugestie AI, facturi recente. Buton Raport + AI Insights.
· NU aici: pentru monitorizare live vânzări/comenzi/sală → /operations; pentru rapoarte vânzări → /analytics
- **Control Operațional** `/operations` — Dashboard live single-page (FĂRĂ tab-uri): 4 carduri (comenzi active, personal pe tură, mese ocupate, tickete bucătărie) + Centru Aprobări manager + Jurnal cereri + rapoarte zilnice/timpi/mese/KDS/personal/portal/secțiuni + alerte HACCP, Viva flagged, comenzi zombie, produse fără rutare KDS, stare sistem. Selector dată + filtre brand/locație.
· NU aici: pentru lista de cereri QR ale ospătarilor (acceptă/trimite) → /pos/waiter-orders; pentru editor plan sală → /plan-sala
- **POS** `/pos/kiosk` — Self-service kiosk full-screen pentru CLIENT: pași attract → comandă → upsell → plată (card / Charge to Room hotel) → succes cu nr. comandă. Dialog inactivitate „Ești încă aici?". NU e POS pentru personal.
· NU aici: pentru ospătar la masă → /pos/waiter sau /pos/mobile; pentru barman → /pos/bar; pentru recepție hotel → /pos/reception
- **POS Ospătar** `/pos/waiter` — Interfața POS a ospătarului: plan sală cu mese, bonul mesei, meniu adăugare, plată, operațiuni masă, rezervări, comenzi fără masă (guest). Pe tabletă apare workspace lateral.
· NU aici: pentru barman (meniu prioritar bar) → /pos/bar; pe telefon mic → /pos/mobile; pentru cererile QR de la clienți → /pos/waiter-orders
- **POS Bar** `/pos/bar` — Aceeași interfață pe canalul „bar": comandă per masă, meniu, plată, operațiuni. Pe desktop are coloană coș + suport scanner coduri bare. Meniul prioritar bar se setează prin profil afișaj.
· NU aici: pentru ospătar servire la masă → /pos/waiter; recepție hotel → /pos/reception
- **POS Mobil** `/pos/mobile` — Interfața principală POS a ospătarului (PWA): ecrane plan sală (mese), produse masă (bon nefiscal), meniu adăugare, plată, operațiuni masă (transfer/reducere/retur/split/partajare), rezervări, comandă guest fără masă.
· NU aici: pentru barman → /pos/bar; pentru ecran cereri QR de confirmat de la clienți → /pos/waiter-orders
- **Mese Deschise** `/pos/open-tables` — Listă (carduri grid) cu toate mesele active: total deschis cumulat sus, căutare după masă/angajat, status (Ocupată/Clarificare/Plată în curs/Așteaptă plata), ETA bucătărie per masă. Click → dialog cu articolele notei + buton Încasează.
· NU aici: pentru a deschide/adăuga pe masă și a comanda efectiv → /pos/waiter sau /pos/mobile; pentru plan vizual sală live → /floorplan
- **Comenzi** `/pos/waiter-orders` — Ecran „Comenzi Client" (real-time): cererile clienților de la masă pe secțiuni — Comenzi Noi de Confirmat, Neasignate (Preia Masa), Acceptate→Trimite la Bucătărie, Chemat la Masă (Pe drum), Cereri Notă de Plată, Cereri Plată, Timpuri estimative. Poate cere PIN ospătar.
· NU aici: pentru istoric/listă comenzi închise cu total → /analytics (rapoarte vânzări) sau /operations; pentru comenzi de pe platformele de livrare → /channels?tab=orders; pentru comenzi website → /pos/website
- **Plan Sală** `/floorplan` — Viewer LIVE „Operațiuni Live" (3 tab-uri: Vedere Live / Istoric / Jurnal Audit): mese pe zone cu statistici (Total Restaurant, Total Zonă, Oaspeți Activi, Ocupare %), selector configurație. Click pe masă → detalii + „Gestionează Comanda" (duce în POS).
· NU aici: pentru a DESENA/edita mese, zone, pereți, decor, configurații → /plan-sala; pentru lista carduri mese deschise → /pos/open-tables; pentru plan sală în context rezervări → /reservations?tab=floor
- **Plan Sală** `/plan-sala` — DESENEZI/editezi planul: mese, zone, pereți, decor, configurații de sală (designer).
· NU aici: vizualizarea LIVE a meselor (operațiuni, read-only) → /floorplan
- **Display Bucătărie (KDS)** `/kitchen/display` — Ecran bucătărie (KDS): bonurile primite ca tichete, marcare în lucru/gata (bump), timere, procesare în batch, animație ieșire la bump. Per ecran configurat (cald/rece/bar/grătar) — și URL /kitchen/display/:screenId pentru ecran dedicat.
· NU aici: pentru verificarea completitudinii unei mese înainte de servire → /kitchen/expeditor; pentru monitorizare manager a timpilor KDS → /operations

## Meniu, produse & rețete
- **Meniu & Dispozitive POS** `/menu` — Hub meniu cu 5 tab-uri reale: Prețuri Meniu, Platforme, Configurare Afișaj (POS/Web), Meniu Fizic, Oferte & Promoții.
· NU aici: pentru catalog produse/categorii → /master-data; pentru rețete → /ai-recipes; pentru analiză popularitate-profitabilitate (cadrane) → /ai-pricing
- **Prețuri Meniu** `/menu?tab=pricing` — Editor prețuri de vânzare per meniu: listă „Toate produsele”, food cost total, sortare după food cost, adaugă produse/pachete-combo, buton „Prețuri Meniu Nou” (→/ai-pricing) + „Adaugă poze bulk”.
· NU aici: pentru recomandări de preț + cadrane stars/plowhorses → /ai-pricing (buton „Prețuri Meniu Nou”); pentru cost din rețetă → /ai-recipes
- **Prețuri Meniu Nou** `/ai-pricing` — Analiza popularitate vs profitabilitate: cadrane Vedete/Cai de povară/Puzzle/Câini + recomandări de preț AI.
· NU aici: ca să SETEZI efectiv prețurile + food cost → /menu?tab=pricing
- **Oferte & Promoții** `/menu?tab=promotions` — Motor de oferte care reduc nota; 3 sub-tab-uri: Panou Control, Upsell & Cross-sell, Happy Hour & Dinamic. Tipuri promo: Reducere %, Articol Gratuit, Cumpără X primești Y, Sumă Fixă. Pe canale (POS/Kiosk/Website/QR/Delivery) și zile/ore; buton „Sugestii AI” + „Campanie Nouă”.
· NU aici: pentru voucher-e/promoții în portalul clienților → /portal-customers?tab=promotions; pentru banner-e vizuale website (NU reduc nota) → website builder
- **Configurare Afișaj** `/menu?tab=display` — Profile de afișare meniu per canal (POS Ospătar, Kiosk Client, Website/Online, Platforma Clienți Web, Table—Clienți QR): teme, layout carduri, ordine/navigare categorii, imagini.
· NU aici: pentru ce produse/categorii apar pe canal (excludere) → tab Platforme; pentru meniul tipărit PDF → tab Meniu Fizic
- **Platforme / Configurare Platformă Clienți** `/menu/platforms` (alias `/portal-config`) — Cardul „Configurare Platformă Clienți" deschide o modală cu 5 tab-uri: General, Texte, Funcționalități, Aspect, QR. Configurezi portalul/aplicația web publică a clienților: nume + tip business + login + livrare/pickup, textele de bun venit, ce module sunt pornite, aspect (culori/font/chips categorie), ce tab-uri/secțiuni apar + butoane Fast Travel, și **Nivel Configurare QR** (brand/zonă/raion, plată online de la masă, ce date cere clientul la scanare). Selector de unitate sus dacă brandul are mai multe locații. Tot prin tool-uri MCP (`configure_portal_*`, `configure_portal_qr`) + skill-ul `configureaza-portal`.
· NU aici: presetul QR per zonă/raion → /staff?tab=floor-schedule (Program Salon); generarea/tipărirea codurilor QR de masă → /qr-codes; misiuni/gamificare → /portal-missions; jocuri/atracții → /portal-games
- **Meniu Fizic** `/menu?tab=physical-menu` — Designer de meniu tipărit/PDF : formate A4/A3, paginare „Recalculează”, copertă + pagini nutriționale/alergeni, export PDF/print, QR dinamic pe copertă.
· NU aici: pentru meniul digital scanat de clienți la masă → /t/:codQR (meniu QR); pentru aspectul pe ecrane POS/web → tab Configurare Afișaj
- **Poze Bulk Meniu** `/menu/pricing/bulk-photos` — Urci multe poze deodată (drag & drop), AI le analizează și sugerează automat articolul de meniu potrivit pentru fiecare; confirmi/schimbi și se salvează ca imagine produs.
· NU aici: pentru a pune o singură poză pe un produs → fișa produsului în /master-data; pentru editare prețuri → tab Prețuri Meniu
- **Centru Meniu** `/menu/center` — Overview manager: ce e indisponibil acum (86), produse cu lipsuri, acțiuni rapide pe meniu.
· NU aici: prețuri → /menu?tab=pricing; alerte stoc → /inventory
- **Categorii și Produse** `/master-data` — Nomenclatorul complet de produse cu grupare pe Magazii / Categorii / Categorii Meniu, fișa produsului (poze, alergeni, taguri, gestiune, preț recepție), duplicare meniu cu categorii+produse, curăță categorii goale.
· NU aici: pentru preț de VÂNZARE → /menu?tab=pricing; pentru rețete/food cost → /ai-recipes; pentru tipurile de produs+conturi → /ai-product-types
- **Rețete (AI Rețetare)** `/ai-recipes` — Atelier rețete: titlu „AI Rețetare”, toate produsele finite + semipreparate (și fără rețetă), cost/unitate + food cost, presets (De rezolvat, Critice, Fără rețetă, Incomplete, Vândute marjă mică, Semipreparate), toggle sursă cost (mediu din stoc / catalog furnizor), „Rezolvă cu Sym”, chat „Sym Chef”, package builder.
· NU aici: pentru tab-ul stale /inventory?tab=recipes (NU randează rețete) → folosește /ai-recipes; pentru fișă tehnică tabelară export CSV → /recipe-datasheet; pentru import rețetar Excel → /recipe-mapping
- **Fișă Tehnică Rețete** `/recipe-datasheet` — Tabel cu toate rețetele: ingrediente, cantități, costuri, totaluri, export CSV.
· NU aici: ca să CREEZI/editezi rețete → /ai-recipes; import rețetar din Excel → /recipe-mapping
- **Alergeni** `/allergens` — 3 tab-uri: Lista alergeni (creare/editare cei 14 UE), Acoperire produse, Matrice Cross-Contact. Asociezi alergeni la materii prime (produsele finite moștenesc prin rețetă); buton „Sugestii Automate” după nume.
· NU aici: pentru taguri de alergeni propuse de AI + rutare KDS + TVA → /ai-tags (Sym Tag Master); pentru alergeni la import → tot /ai-tags sau fișa produsului
- **Etichete & Alergeni (Sym Tag Master)** `/ai-tags` — Titlu „Sym Tag Master”: gestionare etichete (panou „Etichete”) + chat AI „Chat AI / Propuneri AI” care PROPUNE taguri de alergeni (Reg. UE 1169), rutare imprimante/KDS și marketing — tu Aplici/Refuzi fiecare propunere, nimic automat.
· NU aici: pentru lista oficială de alergeni + matrice cross-contact → /allergens; pentru regula efectivă tag→imprimantă → Setări → Imprimante; pentru cote TVA pe tip produs → /ai-product-types
- **Meniu din PDF / poze** `/menu/import-pdf` — Încarci meniul ca PDF sau poze; AI extrage produsele, prețurile, pozele și designul paginilor (pentru Meniu Fizic), cu propunere editabilă înainte de import.
· NU aici: pentru import produse/stoc/furnizori din Excel → /data-import; pentru editarea prețurilor după import → /menu?tab=pricing
- **Leagă Rețetarul (import Excel)** `/recipe-mapping` — Imporți rețetarul din Excel: fiecare ingredient se mapează la un produs existent (potrivire exactă/similară/AI); conflictele de unitate de măsură blochează importul până le rezolvi.
· NU aici: ca să CREEZI/editezi rețete manual → /ai-recipes; pentru fișă tehnică tabelară (export CSV) → /recipe-datasheet

## Stocuri, furnizori & achiziții
- **Tablou de Bord Stoc** `/inventory` — Dashboard FĂRĂ tab-uri: carduri KPI (valoare stoc, stoc redus, de plătit furnizori) + alerte + ultimele mișcări.
· NU aici: stoc live/inventariere/zone → /inventory-check; mișcări/ieșiri → /stock-operations
- **Stoc Curent** `/inventory-check?tab=live-stock` — Cantități + valoare pe gestiuni în timp real, căutare/filtrare, alerte stoc minim.
· NU aici: numărare fizică → /inventory-check?tab=stocktake
- **Inventariere** `/inventory-check?tab=stocktake` — Numărare fizică pe gestiuni; după finalizare diferențele se ajustează în tab Raport Diferențe.
· NU aici: diferențe/ajustări → /inventory-check?tab=variance
- **Zone Depozitare** `/inventory-check?tab=zones` — Zone/rafturi/frigidere per gestiune (organizarea fizică a stocului).
· NU aici: creare/editare gestiuni (depozite) → /warehouse-products
- **Operațiuni Gestiune** `/stock-operations` — 3 tab-uri: Mișcări Stoc, Documente, Rapoarte. Buton 'Document Nou' → dialog Recepție (NIR factură/aviz) / Ieșire (Consum/Pierdere/Furt/Transfer Locație) / Transfer Între Gestiuni; selectare magazii + produse + cantități.
· NU aici: pentru recepție formală pe factură ANAF/OCR cu mapare → /stock-entries; pentru istoricul curat al mișcărilor → /stock-movements
- **Ieșiri Stoc (Fișe)** `/stock-exits` — Fișe de ieșire: înregistrezi pierderi, casare, consum, mese servite (scădere din stoc cu motiv).
· NU aici: recepții/intrări → /stock-entries; transfer între gestiuni → /stock-operations
- **Magazii & Produse** `/warehouse-products` — Creezi/editezi gestiuni (depozite) și vezi ce produse conține fiecare.
· NU aici: catalogul de produse (preț cost) → /master-data; stoc live → /inventory-check
- **Consum Zilnic** `/daily-consumption` — Consumul automat de materii prime din comenzi finalizate; 4 tab-uri: Sumar Consum, Bonuri de Consum, Consum Temporar (produse fără rețetă), Istoric Reprocesări. Tot aici: buton Reprocesare Vânzări (job fundal) + remediere per produs.
· NU aici: pentru ieșiri manuale (protocol/pierdere) → /stock-exits; pentru mișcări manuale → /stock-operations
- **Intrări Stoc** `/stock-entries` — Pagina 'Intrări Marfă' cu 5 tab-uri: Facturi Furnizori, Avize & Draft, Reconciliere (badge nereconciliate), Recepții (NIR), Producție. De aici creezi NIR-ul (factură sursă + depozit recepție).
· NU aici: pentru istoric produse cumpărate (totaluri) → /purchases; pentru operațiune manuală intrare/transfer rapidă → /stock-operations
- **Hub Aprovizionare** `/smart-ordering` — 'Smart Order Hub' — 4 tab-uri: Comenzi (pipeline PO: draft/trimise/confirmate/recepție), Predicție & Planificare, Furnizori, Istoric Aprovizionare. Generezi comenzi draft, Confirmă & Trimite (blocat dacă lipsesc coduri furnizor/alegere catalog), recepție din poză.
· NU aici: pentru detaliul unei comenzi → /purchase-orders/:id; pentru comparare prețuri între furnizori → /procurement-recommendations; pentru istoric PRODUSE cumpărate → /purchases
- **Recomandări Achiziții** `/procurement-recommendations` — Tabel comparare prețuri între furnizori per produs: mod Prioritate vs Cel mai ieftin, filtru (economie/peste cost/egal), economie potențială vs cost curent, expandare ingrediente rețetă. Necesită produse de furnizor mapate.
· NU aici: pentru generare comenzi pe baza consumului/stocului (predicție) → /smart-ordering (tab Predicție & Planificare)
- **Furnizori & Produse** `/suppliers` — Lista furnizorilor tăi (filtru pe tip: Produse/Servicii/Angajat/Taxe), rânduri expandabile cu produsele furnizorului, chat, creare/editare furnizor (CUI+ANAF lookup, termene livrare, cod analitic 401.x, canale comandă Email/WhatsApp). Click rând → /suppliers/:id.
· NU aici: pentru marketplace furnizori din rețea Symbai → /symbai-suppliers; pentru solduri/datorii furnizori → /supplier-balances; pentru fișa unui furnizor → /suppliers/:id
- **Sold Furnizori** `/supplier-balances` — Facturi furnizori cu solduri și plăți restante: tabel facturi (achitate/parțial/scadente/depășite), carduri totaluri, înregistrare plată (dialog Data Plății), filtre+căutare. Pagină dedicată.
· NU aici: pentru a înregistra o cheltuială/factură nouă de la furnizor → /finance (tab Cheltuieli & Plăți); pentru catalogul/datele furnizorului → /suppliers
- **Achiziții (raport)** `/purchases` — Raport AGREGAT pe produs: ce ai cumpărat, cât, la ce cost mediu (~90 zile) + banner NIR ciornă.
· NU aici: lista comenzilor către furnizori (PO draft/trimise) → /smart-ordering
- **Mișcări Stoc** `/stock-movements` — Istoricul curat al tuturor mișcărilor de stoc: intrări, ieșiri, transferuri între gestiuni, ajustări — cu căutare și filtre.
· NU aici: ca să FACI efectiv o mișcare/ieșire/transfer → /stock-operations; pentru recepție pe factură (NIR) → /stock-entries
- **Calitate Inbox Facturi** `/inventory/inbox-quality` — De ce nu intră bine facturile pe stoc: mapări cu încredere scăzută, NIR-uri ciornă mai vechi de 7 zile, facturi eFactura fără NIR, anomalii de preț.
· NU aici: ca să procesezi efectiv factura/NIR → /stock-entries; pentru diferențe contestate → /inventory/disputes
- **Dispute Inventar** `/inventory/disputes` — Diferențele constatate la recepție, clasificate: dispute cu furnizorul, corecții OCR, variații de livrare — locul unde contești o diferență.
· NU aici: pentru igiena/anomaliile intrărilor → /inventory/inbox-quality; pentru solduri/datorii furnizori → /supplier-balances
- **AI Achiziții** `/ai-procurement` — Întrebi AI-ul ce să comanzi de la furnizori săptămâna asta: analiză cheltuieli + optimizare comenzi, conversațional.
· NU aici: pentru generarea efectivă a comenzilor (predicție) → /smart-ordering; pentru comparare prețuri furnizori → /procurement-recommendations
- **HACCP & Siguranță Alimentară** `/haccp` — Notezi temperaturile la frigidere și gestionezi siguranța alimentară: 5 tab-uri (Temperaturi, Curățenie, Incidente, Senzori IoT, Răcire Rapidă).
· NU aici: pentru checklist-uri generale de echipă → /staff?tab=tasks; pentru sarcinile mele ca angajat → /my-tasks

## Producție
- **Producție Bucătărie** `/production` — Pagina de EXECUȚIE producție (shop-floor / fabrică). Titlul real al paginii: «Execuție Producție». Bară live sus (operații active, loturi active, operatori, containere azi). 6 taburi: Execuție, Operații Active, Consumuri & Pierderi, Predări, KPI Live, Containere & QR (+buton Scanner Mobil pe tabul Containere).
· NU aici: pentru loturi simple semipreparate/evenimente restaurant + calendar + rețete → /productie-evenimente; pentru dashboard KPI/OEE/alerte → /factory-dashboard
- **Tablou Fabrică** `/factory-dashboard` — Dashboard MES read-only «Control Tower». Sus: 8 mini-KPI (Planificat/Produs/WIP tone, Yield, OEE, On-Time, Waste, FPY) + countdown refresh 15s. 11 taburi: Vedere generală, Live, Alerte, Lipsuri, Blocaje, QC, KPI, Pipeline, Trasabilitate, Livrări, Schimburi. Drill-down pe alerte/loturi.
· NU aici: pentru a PORNI/finaliza efectiv operații/loturi → /production sau /productie-evenimente; pentru configurat fluxul de producție → /fluxuri-tehnologice
- **Enterprise Readiness** `/factory-enterprise-readiness` — Cockpit vizual pentru discutii SAP/MES/EDI, retail enterprise, meat vertical, hardware adapters si plan pilot 30 zile. Foloseste-l ca demo/screenshot dupa ce ai rulat auditurile live; nu prezenta scorurile mock ca telemetrie reala.
· NU aici: pentru verdictul real al tenantului → tool-urile `get_enterprise_control_readiness`, `get_industrial_costing_readiness`, `get_procurement_wms_readiness`, `get_advanced_planning_readiness`; pentru control tower live → /factory-dashboard
- **Plan Fabrică 2D** `/factory-floor-plan` — Designer vizual al halei/fabricii: nivele, echipamente, zone de producție, magazii, zone de depozitare, pereți/culoare și conexiuni de flux material/personal. Obiectele se leagă de entități reale și pot arăta status echipament + stoc sumar pe zone.
- **Explorează Fabrica** `/factory-explorer` — Vizualizator live read-only al halei: hartă, căutare, Gantt pe utilaje cu scrubber de timp și panouri pentru zonă, magazie/raft, utilaj, operator și produs. Folosește-l pentru screenshot/dovadă vizuală și întrebări la o oră anume, nu pentru mutări sau scrieri.
· NU aici: pentru a crea echipamentul/zona/magazia reală → /production/equipment-zones sau tool-urile MCP; pentru execuția pe stații → /production; pentru KPI/OEE → /factory-dashboard
- **Fluxuri Tehnologice** `/fluxuri-tehnologice` — Pagină standalone de CONFIGURARE a fluxurilor tehnologice (rețeta de proces a unui produs): listă/creare/editare versiuni de flux, fiecare cu operații în ordine, dependențe, materiale consumate, output-uri și cerințe QC per operație. Pagină dedicată (versiune completă, fabrică).
· NU aici: pentru a EXECUTA fluxul (operații live, scanare, predări) → /production; pentru loturi/rețete restaurant simplu → /productie-evenimente; pentru rețete de ingrediente (food cost) → /inventory?tab=recipes
- **Producție** `/productie-evenimente` — Pagina PRINCIPALĂ de producție restaurant. Titlu adaptiv (Producție / Producție & Evenimente / Producție & Rețete). Taburi: Calendar & Capacitate, Loturi Producție (creezi/pornești/finalizezi loturi+evenimente), Rețete. +Operații/+Echipamente la mod restaurant_events; +Fluxuri Tehnologice la mod fabrică. Butoane: Adaugă Lot Producție, Adaugă Eveniment.
· NU aici: pentru shop-floor execuție/scanare containere/predări → /production; pentru KPI/OEE/control tower fabrică → /factory-dashboard; pentru configurat fluxul tehnologic (operații+QC+BOM) → /fluxuri-tehnologice
- **Centru de Printare** `/print` — Printezi etichete de producție, foi de producție și foi de transfer pentru loturi (3 tab-uri: Etichete, Foi de Producție, Foi de Transfer); cauți producția după nume/lot/id.
· NU aici: pentru configurarea/rutarea imprimantelor → /settings?tab=printers
- **Loturi WIP** `/loturi-wip` — Toate loturile de producție aflate în lucru (work-in-progress), pe scurt.
· NU aici: pentru execuția pe shop-floor (scanare/predări) → /production; pentru KPI/OEE fabrică → /factory-dashboard

## Rapoarte & analiză
- **Rapoarte & Analiză** `/analytics` — Hub rapoarte: 4 carduri sus (Venit cu TVA, fără TVA, de Predat, Profit Estimat NET) + 15 tab-uri (Raport Zilnic, P&L, Vânzări Angajați, Timpi, Mese, Avansate, Produse Vândute, Costuri, Vânzări, Inventar, Personal, Plăți, Categorii, Gestiune, Note Clienți). Filtre dată/brand/locație.
· NU aici: pentru P&L pe categorii cu drill-down → tab pnl AICI sau /reports/pnl; pentru KPI cu semafor → /reports/pnl-kpi; pentru compară perioade → /reports/pnl-compare-periods; pentru snapshot salvat → /analytics/saved-pnl
- **Raport Zilnic (Z)** `/analytics?tab=daily` — Tab Raport Zilnic — sumar vânzări pe zi în stil raport Z (buton printare, detaliere TVA pe cote).
· NU aici: pentru raportul fiscal de închidere zi cu numărătoare casă → /finance/daily-close (end-of-day)
- **Vânzări & Venituri** `/analytics?tab=sales` — Tab cu UN singur grafic: „Trend Venituri vs. Comenzi" — area chart venituri pe zilele săptămânii suprapus cu numărul de comenzi. Pe mobil afișează doar mesaj „folosește desktop pentru chart-uri".
· NU aici: pentru top produse vândute → tab Produse Vândute (?tab=sold_products); pentru distribuția pe categorii → tab Mix Categorii
- **P&L Detaliat** `/analytics?tab=pnl` — Tab P&L (Profit & Loss) detaliat pe categorii cu drill-down —.
· NU aici: pentru P&L cu export/snapshot și filtre proprii → /reports/pnl; pentru KPI cu praguri → /reports/pnl-kpi
- **Vânzări Angajați** `/analytics?tab=staff_sales` — Tab Vânzări Angajați — performanță vânzări per angajat, pe interval/brand/locație.
· NU aici: pentru ore lucrate/productivitate → tab Performanță Personal (?tab=staff); pentru vânzări per masă → tab Analiză Mese
- **Plăți & Metode** `/analytics?tab=payments` — Tab Plăți & Metode — pie chart distribuția metodelor de plată pe comenzi + card „Sumar Cash Flow" (total facturat și total plătit furnizori). Date din facturi furnizori.
· NU aici: pentru reconciliere plăți canale livrare → /finance?tab=reconciliation; pentru flux numerar agregat → /finance?tab=cashflow
- **Analiză Mese** `/analytics?tab=tables` — Tab Analiză Mese — ocupare, rotație, venit per masă, pe interval/brand/locație.
· NU aici: pentru rotație/ocupare din perspectivă rezervări → /reservations?tab=analytics; pentru editarea layoutului → /floorplan
- **Timpi Așteptare** `/analytics?tab=speed` — Tab Timpi Așteptare — analiza timpilor de servire/bucătărie/livrare, pe interval/brand/locație.
- **Inventar & Costuri** `/analytics?tab=inventory` — Tab Inventar & Costuri — tabel „Pierderi & Ajustări Negative" (produse scoase prin minus/waste/write-off cu cantitate și cost) + pie „Structură Costuri" (categorii facturi furnizor).
· NU aici: pentru stoc curent/cantități → /inventory?tab=stock; pentru rapoarte gestiune NIR/fișe → tab Gestiune AICI sau /inventory?tab=reports; pentru food cost rețete → /inventory?tab=recipes
- **Mix Categorii** `/analytics?tab=categories` — Tab Mix Categorii — listă cu bare de procent: ce categorii de meniu generează cel mai mult venit (% din vânzări, exclude item-uri anulate/returnate).
· NU aici: pentru categorii de stoc/inventar → /inventory?tab=categories; pentru categorii de meniu (CRUD) → /master-data
- **P&L KPI** `/reports/pnl-kpi` — Pagină KPI P&L — afișează indicatorii definiți pe categorii (venituri, marketing, leaduri, evenimente, finanțe, operațional) cu valoare live, semafor și trend. Definițiile/pragurile se editează din Setări > Setări P&L.
· NU aici: pentru editarea KPI-urilor și pragurilor → /settings/pnl-categories (Setări P&L); pentru P&L complet pe categorii → /reports/pnl
- **P&L Comparație Perioade** `/reports/pnl-compare-periods` — Compară P&L pe PERIOADE pentru aceeași entitate: moduri Lună vs lună, An vs an, YTD vs an trecut, Ultimele N luni, Perioadă A vs B. Hero = profit bridge/waterfall + trend rebased; tabel variație colorat + biggest movers; export XLSX.
· NU aici: pentru a compara branduri/locații una lângă alta (aceeași perioadă) → /reports/pnl-compare (alias /analytics/pnl-compare); pentru un P&L singular → /reports/pnl
- **P&L Salvate** `/analytics/saved-pnl` — Listă carduri cu snapshot-uri P&L înghețate (nume, perioadă, nr. ajustări, lacăt). Acțiuni: deschide detaliu (cere parolă dacă e blocat), redenumire, ștergere, lock/unlock/schimbă parolă.
· NU aici: pentru un snapshot anume cu ajustări manuale → /analytics/saved-pnl/:id; pentru a CREA un snapshot nou → /reports/pnl (salvează ca snapshot)
- **Raport P&L** `/reports/pnl` — Profit & Loss complet pe lună/perioadă: venituri, COGS, cheltuieli operaționale, EBITDA; export și salvare ca snapshot.
· NU aici: pentru P&L cu drill-down în hub → /analytics?tab=pnl; pentru KPI cu semafor → /reports/pnl-kpi; pentru compară perioade → /reports/pnl-compare-periods; snapshot-uri salvate → /analytics/saved-pnl
- **Rapoarte Clienți** `/customer-reports` — Raport despre clienți: segmentare, comportament, lifetime value (LTV), frecvență — cât cheltuie fiecare.
· NU aici: pentru lista/fișele clienților → /customers; pentru follow-up + sugestii AI per client → /customer-followup
- **AI Rapoarte** `/ai-reports` — Întrebi AI-ul cum ți-au mers vânzările (ex. „cum a fost săptămâna asta") și primești rapoarte cu analiză, conversațional.
· NU aici: pentru rapoartele clasice cu tab-uri/filtre → /analytics; pentru P&L → /reports/pnl

## Finanțe & casă
- **Finanțe & Contabilitate** `/finance` — Pagină-umbrelă, 7 tab-uri: Sumar (default), Cash Flow, Cheltuieli & Plăți, Reconciliere Canale, Control Viva, Control Card GP, Solduri inițiale. Buton „Ghid". Tab-ul „close" redirect→/finance/daily-close.
· NU aici: pentru registrul fizic de numerar pe zi → /finance/cash-book; pentru note contabile/plan conturi → /accounting-ledger; pentru raportul Z fiscal → /finance/daily-close
- **Cheltuieli & Plăți** `/finance?tab=expenses` — Tab cu 3 sub-tab-uri: „Toate Mișcările" (KPI ieșiri/intrări/sold furnizori + tabel filtrabil pe sursă manual/factură/extras), „Cheltuieli Manuale", „Sold Furnizori". Search + filtre perioadă/sursă/direcție.
· NU aici: pentru salarii/payroll → /staff; pentru solduri furnizori detaliate (scadențar) → /supplier-balances; pentru proiecția plăților viitoare → /finance?tab=cashflow
- **Cash Flow** `/finance?tab=cashflow` — Flux numerar real+previzionat cu 5 sub-tab-uri: Prezentare Generală (KPI sold azi/zile numerar + grafic + detaliu pe perioadă), Plăți Programate, Plăți Recurente, Termene Furnizori, Intrări Manuale. Sold inițial din casierie, toggle estimare vânzări.
· NU aici: pentru registrul legal de numerar pe zi (filă+sigiliu) → /finance/cash-book; pentru cheltuieli/plăți deja efectuate → /finance?tab=expenses
- **Control Viva** `/finance?tab=viva` — Tranzacții card Viva Wallet: detalii card (tip/bancă/last4), terminal vs e-commerce, legare/dezlegare tranzacție de comandă, status, decontări, căutare.
· NU aici: pentru reconcilierea plăților de pe platformele de livrare → /finance?tab=reconciliation; pentru carduri RFID/acces clienți → /access-cards sau /portal-customers?tab=auth
- **Reconciliere Canale** `/finance?tab=reconciliation` — Potrivire plăți canale de livrare vs POS: per canal (Glovo/Wolt/etc.) plată așteptată (brut − comision) vs primit/decontat + discrepanță; listă comenzi pe canal.
· NU aici: pentru reconcilierea raportului Z fiscal vs POS → /finance/daily-close (sau Rapoarte Fiscale); pentru gestionarea integrărilor de livrare → /channels?tab=reconciliation
- **Închidere Zi** `/finance/daily-close` — Wizard 3 pași: (1) Verificare — mese deschise + predări tură/tranzacții cash neoperate (bifezi→„Operează"), numărătoare fizică, generare consum, fereastră zi business; (2) Sumar vânzări POS + reconciliere Z; (3) Închidere (filă+sigiliu). Buton închidere în lot + foaie printabilă.
· NU aici: pentru registrul de operațiuni numerar pe zi (încasări/plăți/transfer) → /finance/cash-book; pentru foaia detaliată printabilă standalone → /finance/end-of-day; pentru configurarea casieriilor → /finance/cash-registers
- **Foaie închidere zi (printabilă)** `/finance/end-of-day` — Raport detaliat printabil pe o zi+locație: totaluri (brut/net/TVA/discount/bacșiș/food cost/marjă), defalcare TVA pe cote, plăți pe metode, per masă, per ospătar, per zonă, per etichetă P&L, anulări, reduceri, registru casă agregat (global+per angajat).
· NU aici: pentru ritualul interactiv de închidere cu numărătoare+sigilare → /finance/daily-close; pentru rapoartele de analiză generale → /analytics?tab=daily
- **Registru de casă** `/finance/cash-book` — Registru legal numerar (14-4-7A): alegi casieria+data, vezi sold inițial/intrări/ieșiri/sold final/filă; adaugi Încasare(chitanță)/Plată(DPÎ)/Depunere-Ridicare bancă/Transfer; stornare=rând invers; închidere zi cu sigiliu SHA-256; export Print PDF + CSV.
· NU aici: pentru configurarea casieriilor (mod organizare) → /finance/cash-registers; pentru wizard-ul de închidere cu numărătoare → /finance/daily-close; pentru proiecția fluxului de numerar → /finance?tab=cashflow
- **Casierii (mod organizare)** `/finance/cash-registers` — Configurare casierii (de obicei o dată): mod organizare per firmă / locație / brand×locație, „Regenerează casieriile" (auto-creează lipsa după locație nouă), monedă, reguli pe țară (plafoane), mapări auto-feed; casierii goale se șterg, cele cu istoric se dezactivează.
· NU aici: pentru operațiunile zilnice de numerar → /finance/cash-book; pentru închiderea de zi → /finance/daily-close. Alias: /finance/cash-book/registers redirect aici.
- **Registru Contabil** `/accounting-ledger` — Note contabile cu 3-4 vizualizări (butoane, nu tab-uri): „Conturi" (solduri pe cont cu drill-down la înregistrări), „Toate înregistrările" (jurnal filtrabil pe brand/perioadă/sursă/status), „Plan de Conturi" (chart + populare RO), iar la multi-brand/locație: „Analitice Brand & Locații" (reguli denumire analitice + reguli split cheltuieli). Export CSV.
· NU aici: pentru configurarea conturilor pe tip de produs → /ai-product-types; pentru importul de date contabile de la contabil → /accounting-import; pentru cheltuieli/plăți operaționale → /finance?tab=expenses
- **Rapoarte Fiscale** `/finance/fiscal-reports` — Raportul fiscal pentru contabilitate: bonuri emise, X/Z, defalcare TVA, export ANAF.
· NU aici: pentru ritualul de închidere de zi cu numărătoare casă → /finance/daily-close; pentru raportul Z din analiză → /analytics?tab=daily
- **Import Contabilitate** `/accounting-import` — Imporți datele contabile: balanțe, jurnale, plan de conturi din software-ul contabil.
· NU aici: pentru notele contabile/planul de conturi în aplicație → /accounting-ledger; pentru import produse/clienți → /data-import sau /customer-import
- **AI CFO (Cash Flow)** `/ai-cashflow` — Întrebi AI-ul cum stai cu cash-flow-ul („am bani de salarii?"): previziuni + strategie financiară, conversațional.
· NU aici: pentru fluxul de numerar detaliat (plăți programate/recurente) → /finance?tab=cashflow; pentru registrul legal de numerar → /finance/cash-book

## Personal & sarcini
- **Personal** `/staff` — Pagina centrală HR „Personal & Control Acces": 10 tab-uri (Planificator Ture, Foaie Pontaj, Pontaje (prezență), Sarcini & Liste, Listă Personal, Roluri & Permisiuni, Grupuri Mesaje, Program Salon, Contracte & Salarii, Beneficii Personal) + buton Adaugă Angajat + selector unitate.
· NU aici: pentru sarcinile mele ca angajat → /my-tasks; pentru beneficii masă personal → /staff, tab „Beneficii Personal" (vechiul /settings/staff-benefits redirecționează); pentru AI HR → /ai-angajati
- **Planificator Ture** `/staff?tab=scheduler` — Calendar săptămânal drag-and-drop pentru ture: adaugi/muți/editezi ture, undo, copiere săptămâna anterioară, șabloane de tură, rânduri custom, culori per angajat, buton „Salvează și Publică Program". Sub el panoul „Cereri Concediu" (aprobă/respinge).
· NU aici: pentru pontajul efectiv (intrare/ieșire) → /staff?tab=timesheets; pentru ce aranjament de sală e activ pe zi → /staff?tab=floor-schedule; pentru turele de fabrică (producție) → /production
- **Foaie Pontaj** `/staff?tab=timesheets` — Tabel cu pontaje efective: intrare/ieșire, pauze, total ore, ore suplimentare, cu căutare, filtru brand/perioadă, aprobare și export/print. Realitatea lucrată, nu planul.
· NU aici: pentru planificarea/repartizarea turelor → /staff?tab=scheduler
- **Sarcini & Liste** `/staff?tab=tasks` — Aici MANAGERUL construiește listele de sarcini: țintă pe rol+tură+raion, recurență, oră-limită, tip dovadă, verificare; panou live „Cine va vedea asta și când (azi)", șabloane și dashboard per listă (De făcut etc.).
· NU aici: pentru feed-ul personal al angajatului (bifare sarcini) → /my-tasks
- **Listă Personal** `/staff?tab=list` — Directorul angajaților: 4 carduri statistici (Total, Activi, Roluri, Salarizare lunară est.), căutare + filtru rol, tabel cu adăugare/editare/ștergere angajat, buton salarii lunare per rând și TagSelector.
· NU aici: pentru rolurile și permisiunile lor → /staff?tab=roles; pentru contracte/bonusuri → /staff?tab=contracts
- **Roluri & Permisiuni** `/staff?tab=roles` — Creezi roluri și bifezi permisiuni granulare per categorie (switch „toate dintr-o categorie" inclusiv cele viitoare). Reset la implicit, protecție Super Admin (acces nelimitat, nemodificabil), seed template roluri pe tip business.
· NU aici: pentru a atribui un rol unui angajat → /staff?tab=list (editare angajat)
- **Program Salon** `/staff?tab=floor-schedule` — Pe fiecare zi a săptămânii (per locație/brand) alegi ce aranjament de sală e activ + excepții pe dată + preset QR per raion (ce câmpuri cere clientul la scanare, confirmare ospătar). Decide rutarea comenzilor QR și raioanele din modalul de tură.
· NU aici: pentru a pune ospătarul concret pe un raion → /staff?tab=scheduler (Secțiune Atribuită în modalul de tură); pentru a desena/edita planul de sală → /floorplan
- **Sarcinile Mele** `/my-tasks` — Feed-ul personal al angajatului: 3 KPI (De făcut/Întârziate/Finalizate azi) + 3 tab-uri (Astăzi grupat Întârziate→Azi→Următoarele, Generale-libere, Finalizate). Bifezi one-tap; unde se cere, dialog dovadă foto/notă/număr/semnătură.
· NU aici: pentru ca managerul să CREEZE/configureze listele de sarcini → /staff?tab=tasks

## Rezervări, evenimente & clienți
- **Rezervări** `/reservations` — 6 tab-uri: Listă de Așteptare (doar dacă waitlist activat), Plan Sală Live, Listă Rezervări, Timp Rotație & Analiză, Control Disponibilități, Petreceri (zi). Creezi/editezi rezervări, generezi contract.
· NU aici: pentru regulile/setările sistemului de rezervări → /reservations/config; pentru editorul vizual al sălii (mese/zone) → /floorplan
- **Listă de Așteptare** `/reservations?tab=host` — Tab pentru hostess la intrare: gestionează walk-in-uri (clienți fără rezervare), coadă de așteptare, asignare mese libere, timp estimat. Apare DOAR dacă waitlist e activat în setări.
· NU aici: pentru calendarul/lista tuturor rezervărilor → /reservations?tab=bookings
- **Sales CRM** `/sales-crm` — CRM vânzări cu tab-uri (filtrate după șablonul de business): Dashboard, Pipeline (etichetă adaptivă, ex «Pipeline Rezervări»), Calendar, Prezentare, Rezervări, Clienți, Mesaje, Taskuri, Analiză, Reguli Capacitate, WhatsApp.
· NU aici: pentru configurarea CRM (pipelines/tipuri rezervări/useri CRM) → /settings/sales-crm; pentru lista standalone de evenimente cu P&L → /events
- **Evenimente CRM** `/events` — Listă standalone a tuturor evenimentelor cu sumar P&L în timp real: KPI sus (nr. evenimente, venit total, profit, marjă medie), tabel/carduri per eveniment + filtre dată și status; click pe rând deschide fișa /event/:id. Buton «Vezi în Calendar».
· NU aici: pentru fișa completă a unui eveniment (până la 12 tab-uri: Deal, Sumar, Comunicare, Produse, Personal, Prep, Producție, Cheltuieli, Contract, Recenzii, BEO, P&L) → /event/:id; pentru evenimente Facebook → /facebook-events
- **Clienți & Portal** `/customers` — Baza de clienți cu 4 tab-uri: Listă Clienți (XP, nivel, insigne, istoric), Persoane Juridice, Segmente & Grupuri, Autentificare & RFID. Fișa clientului are tab-uri Profil/Prieteni/Evenimente/Misiuni/Insigne/Recompense/Comenzi/Copii (+Grupări dacă există).
· NU aici: pentru programul de fidelizare/puncte/niveluri → /loyalty; pentru misiuni/insigne gamificate (config) → /portal-missions; pentru cardurile RFID/credite ca pagină dedicată → /access-cards
- **Program Fidelizare** `/loyalty` — Program loialitate cu 3 tab-uri: Panou General (statistici, niveluri), Clienți Fideli (puncte/nivel/istoric, filtru pe tier), Configurare Program (rată câștig pct/leu, valoare răscumpărare, niveluri/tiers cu praguri+beneficii, bonus zi naștere).
· NU aici: pentru misiuni/insigne/recompense gamificate → /portal-missions; pentru lista clienților → /customers
- **Recenzii & Feedback** `/feedback` — 4 tab-uri: Management Recenzii (listă recenzii + filtre perioadă/locație/angajat/sortare + răspuns), Performanța Angajaților, Tendințe & Analiză, Setări Feedback (declanșator după plată/rezervare, alertă rating scăzut).
· NU aici: pentru chestionare/sondaje construite (builder + răspunsuri) → /questionnaires; pentru feedback hotel/oaspeți (NPS PMS) → /hotel/guest-feedback
- **Abonamente Clienți** `/subscriptions` — Abonamentele CLIENȚILOR cu livrări recurente: KPI MRR/ARR/ARPU/Churn 30z/LTV/Venit 30z, distribuție pe statusuri, listă abonați cu filtre+căutare; drawer detaliu cu Pauză/Reactivare/Anulare + sub-tab-uri Livrări/Dunning/Istoric.
· NU aici: pentru abonamentul TĂU la platforma Symbai (facturare SaaS) → Setări → Module & Facturare sau portalul Hub
- **Calendar Rezervări & Evenimente** `/calendar` — Vedere unificată: rezervări + evenimente + deal-uri de vânzări, pe zi/săptămână/lună, cu cod culori pe status; click pe element → detalii.
· NU aici: pentru rezervări restaurant (tab-uri host/listă/disponibilități) → /reservations; pentru evenimente cu P&L → /events; pentru planificarea turelor → /staff?tab=scheduler
- **Contracte** `/contracts` — Contracte pentru evenimente/nunți: 2 tab-uri (Șabloane, Contracte Active), urmărire expirare și status.
· NU aici: pentru fișa completă a evenimentului (inclusiv tab Contract) → /event/:id
- **Chestionare** `/questionnaires` — Chestionare de satisfacție pentru clienți: 3 tab-uri (Șabloane cu builder, Răspunsuri, Statistici Personal).
· NU aici: pentru recenzii Google/Facebook + declanșatoare → /feedback; pentru NPS hotel → /hotel/guest-feedback
- **Comenzi B2B** `/b2b-orders` — Comenzile clienților pe firmă (B2B): clienți firmă, contracte cadru, prețuri negociate.
· NU aici: pentru comenzi sală → /pos/waiter-orders; pentru magazin online → /ecommerce/orders; pentru persoane juridice în baza de clienți → /customers
- **Follow-up Clienți** `/customer-followup` — Clienți care n-au mai venit: funnel + Next Best Action (sugestii zilnice cu scor — sună/ofertă/cere recenzie), coadă de sarcini, playbooks automate, timeline per client.
· NU aici: pentru lista/fișele clienților → /customers; pentru rapoarte clienți → /customer-reports; pentru automatizări marketing → /marketing-automations
- **Import Clienți** `/customer-import` — Imporți o listă de clienți din Excel/CSV: contact, segmente, puncte loialitate.
· NU aici: pentru import produse/meniu/stoc → /data-import; pentru rapoarte despre clienți → /customer-reports

## Hotel + Marketing, online & livrări
- **Dashboard Hotel** `/hotel` — Dashboard PMS: KPI ocupare (camere libere/ocupate, %), sosiri/plecări azi, in-house, plus hub de quick-links spre toate sub-paginile hotel (recepție, camere, rate, channel, folio, analytics).
· NU aici: pentru check-in/check-out → /hotel/front-desk; pentru tarife camere → /hotel/rates; pentru ADR/RevPAR/rapoarte → /hotel/analytics
- **Recepție Hotel** `/hotel/front-desk` — Front desk recepționer cu 5 tab-uri: Sosiri, Plecări, In-House, Room Rack, Night Audit. Check-in/out, walk-in, asignare/schimb cameră, închidere de noapte (pre-check/dry-run/execute).
· NU aici: pentru lista fizică a camerelor și status curățenie → /hotel/rooms; pentru facturare/folio → /hotel/folios
- **Camere Hotel** `/hotel/rooms` — Lista camerelor cu status (Curată/Murdară/Inspectată/Ocupată/Defectă/Indisponibilă/Mentenanță), filtre status/etaj/căutare, schimbare status în masă și generator camere pe tip.
· NU aici: pentru tipuri de cameră și capacitate → /hotel/room-types; pentru tarife → /hotel/rates
- **Manager Tarife Hotel** `/hotel/rates` — Rate manager complet, 13 tab-uri: Calendar, Plans, Restrictions, Seasons, Derived, LOS, Packages, Compare, Forecast, Yield Rules, Competitors, Recommendations, History. Prețuri pe zile/sezoane, restricții, rate derivate, yield.
· NU aici: pentru coduri promo/discount → /hotel/promo-codes; pentru distribuție OTA → /hotel/channels
- **Social Content Hub** `/social-hub` — Hub conținut social: comută între Calendar (planner pe zile) și Listă (postări cu filtre status/platformă/tip/campanie + statistici). Postări, story-uri, video. ?view=list / ?view=calendar.
· NU aici: pentru CONECTAREA conturilor FB/IG/TikTok → /social-media; pentru mesaje/comentarii → /marketing/audience?tab=inbox
- **Conturi Social Media** `/social-media` — Configurare conturi per brand, 6 tab-uri: Conturi (conectare OAuth FB/IG/TikTok/YouTube/LinkedIn), Credentiale API, WhatsApp, Ads (conturi Meta Ads), CAPI (Conversions API), Audiențe Meta.
· NU aici: pentru PUBLICAREA/programarea postărilor → /social-hub; pentru rularea reclamelor → /ad-campaigns
- **Email Marketing** `/email-campaigns` — Campanii email: listă filtrată (Toate/Ciorne/Programate/Active/Trimitere/Trimise) + wizard 4 pași Configurare→Șablon→Audiență→Revizuire&Trimitere; campaniile flux au tab-uri Flux/Config/Statistici.
· NU aici: pentru designul șabloanelor → /email-templates; pentru loguri trimiteri → /email-logs; pentru curățare adrese → /email-review
- **Google Business Profile** `/gbp` — Manager fișa Google Business, 6 tab-uri: Location (date), Posts (postări GBP), Reviews (răspuns cu sugestie AI), Q&A, Photos, Metrics (ultimele 30 zile). Necesită locație Google conectată.
· NU aici: pentru conectarea contului Google → /social-media (sau Setări brand → Google); pentru recenzii ecommerce externe → /ecommerce/external-reviews
- **Campanii Publicitare** `/ad-campaigns` — Reclame plătite Meta/Google/TikTok. Două secțiuni: Campanii (filtre status Toate/De publicat/Active/Pauză/Final/Eroare, wizard obiectiv→buget→publicare, boost postare, lead forms, sugestii AI) și Automatizări.
· NU aici: pentru conturile Ads (conectare) → /social-media tab Ads; pentru anomalii ads → /marketing/anomalies; pentru programare postări organice → /social-hub
- **Manager Canale Livrare** `/channels` — Integrare agregatori livrare (Glovo/Wolt/Bolt/Tazz), 5 tab-uri: Prezentare & KPI, Control Comenzi, Meniu & Prețuri, Reconciliere, Integrări. Acceptare/refuz comenzi, sync meniu, comisioane.
· NU aici: pentru livrări cu FLOTĂ PROPRIE (dispecerat livratori) → /deliveries/dispatch; pentru comenzile magazinului online → /ecommerce/orders; pentru comenzi sală → /pos/waiter-orders
- **Dispecerat Livrări** `/deliveries/dispatch` — Ecran dispecer flotă proprie: kanban pe statusuri (Pregătire/De livrat/Asignat/În livrare/Livrat/Eșuat) + hartă Leaflet cu comenzi și livratori, asignare manuală + sugestie automată, 3 view-uri (split/kanban/hartă).
· NU aici: pentru comenzi de pe Glovo/Wolt (agregatori) → /channels; pentru zone de livrare → /deliveries/zones; pentru flotă/vehicule → /deliveries/fleet
- **Comenzi Ecommerce** `/ecommerce/orders` — Comenzi magazin online: filtre brand/website/risc fraudă/decizie/status (pending→processing→shipped→delivered→cancelled→refunded), evaluare fraudă, acțiuni procesare/expediere/anulare, tracking, print.
· NU aici: pentru comenzi sală/ospătar → /pos/waiter-orders; pentru comenzi agregatori livrare → /channels; pentru generare AWB curier → /ecommerce/awb
- **AWB & Curieri** `/ecommerce/awb` — Curierat ecommerce, 4 tab-uri: Generează AWB, Tracking & Etichete, Reconciliere COD, Conturi curieri. Curieri suportați: Sameday, FAN, DPD, GLS, Cargus, KLG.
· NU aici: pentru comenzile în sine → /ecommerce/orders; pentru zone/tarife transport (config) → /ecommerce/shipping
- **Articole Blog** `/blog/posts` — Administrare articole blog: tabel cu titlu, status, autor, scor SEO (colorat), indexare; filtre pe status / scor SEO / intenție / indexabil. Creare/editare articol, asociere website.
· NU aici: pentru overview/top articole → /blog/tracker; pentru editorul propriu-zis → /blog/:brandId/posts/:id/edit; pentru SEO/poziții căutare → /seo
- **SEO Hub** `/seo` — Summary SEO (sub layout cu nav: Summary/Pages/Keywords/Research/Competitors/Settings): vizibilitate, poziție medie, click-uri organice, afișări, CTR, distribuție poziții, top winners/losers, top pagini, SERP features, status sync GSC.
· NU aici: pentru scrierea/editarea articolelor → /blog/posts; pentru trafic blog → /blog/analytics
- **Coduri QR** `/qr-codes` — Două tab-uri: QR Mese (cod per masă → meniul digital al mesei, regenerare) și QR-uri dinamice (link scurt /q/cod cu destinație editabilă oricând fără re-tipărire, etichete, activ/inactiv, contor scanări, export PNG/SVG/PDF).
· NU aici: pentru meniul public al portalului → /portal/menu; pentru carduri RFID/acces fizic → /access-cards sau /portal-customers?tab=auth
- **Livrări (flotă proprie)** `/deliveries` — Monitorizezi comenzile de livrare la domiciliu cu curierii TĂI: status comenzi, cine ce duce, timpi pe traseu.
· NU aici: pentru comenzi de pe Glovo/Wolt/Bolt (agregatori) → /channels; pentru kanban dispecer + hartă live → /deliveries/dispatch; pentru zone de livrare → /deliveries/zones
- **Inbox WhatsApp** `/whatsapp-inbox` — Citești și răspunzi la mesajele clienților de pe WhatsApp Business (primite și trimise).
· NU aici: pentru conectarea numărului WhatsApp → /social-media (tab WhatsApp); pentru mesaje/comentarii social → /marketing/audience?tab=inbox
- **AI Marketing Agent** `/ai-marketing` — Pui AI-ul să-ți facă o campanie de marketing: agent conversațional pentru reclame, postări și strategii.
· NU aici: pentru programarea postărilor → /social-hub; pentru reclame plătite (wizard) → /ad-campaigns; pentru automatizări/triggere → /marketing-automations
- **Automatizări Marketing** `/marketing-automations` — Mesaje automate (ex. de ziua clientului): fluxuri, triggere, secvențe email/SMS.
· NU aici: pentru follow-up cu Next Best Action → /customer-followup; pentru programare postări → /social-hub; pentru agent AI marketing → /ai-marketing
- **Template-uri Email** `/email-templates` — Editezi șablonul de email trimis clienților: galerie template-uri, HTML custom, editor drag & drop.
· NU aici: pentru crearea/trimiterea campaniei → /email-campaigns; pentru statistici → /email-analytics; pentru loguri trimiteri → /email-logs
- **Analitice Email** `/email-analytics` — Câți clienți au deschis emailul: open rate, click rate, bounce, dezabonări, tendințe.
· NU aici: pentru crearea campaniei → /email-campaigns; pentru designul șablonului → /email-templates
- **Evenimente Facebook** `/facebook-events` — Publici un eveniment pe pagina ta de Facebook (seri tematice, lansări, workshop-uri).
· NU aici: pentru evenimente cu P&L în CRM → /events; pentru postări/story-uri → /social-hub

## Setări & administrare
- **Setări** `/settings` — Pagină hub cu meniu lateral pe secțiuni (Companie, POS, Personal, Hardware, Stocuri, Marketing, Contabilitate, Asistent AI, Tehnic, Sistem); ?tab= deschide fiecare secțiune.
· NU aici: pentru roluri/permisiuni angajați → /staff?tab=roles (aici doar vizualizare în Securitate). Pentru P&L → /settings/pnl-categories. Pentru reparații date → /settings/repair.
- **Locații și Branduri** `/settings?tab=brands` — Două carduri: „Locații” (adaugă/editează locație: nume, adresă, oraș, telefon, casă de marcat prestabilită; asociază branduri; program funcționare) și „Gestionare Branduri & Identitate” (brand: cod, culoare, logo, misiune, domenii activitate, identitate vizuală, watermark social).
· NU aici: pentru date fiscale firmă/CUI → /settings?tab=general (Date companie). Pentru câmpuri produs per brand → secțiunea Stocuri → Câmpuri produs.
- **Setări POS** `/settings?tab=pos` — Titlu „POS & Bonuri” cu 3 tab-uri: „Bonuri & Imprimare” (template bon fiscal + metode de plată, vizibilitate per unitate), „Taxe & Financiar” (cote TVA + taxă serviciu + bacșiș/impozit bacșiș), „Flux Operațional” (auto-trimitere bucătărie, aprobare manager anulare, batch bonuri V2, out-of-stock global). Plus card „Curățare Mese & Comenzi”.
· NU aici: pentru rutarea imprimantelor pe categorii → /settings?tab=printers. Pentru design grafic notă → secțiunea „Design notă”. Pentru conturi OMFP pe tip produs → /ai-product-types.
- **Imprimante & Rutare** `/settings?tab=printers` — Titlu „Imprimante”. Card „Configurare Imprimante” (adaugă/editează imprimante bonuri, case de marcat fiscale, etichete; asociere cu un PC; testare) + card „Rutare Fiscală — Case de Marcat”. Buton copie informativă/anulare bon.
· NU aici: pentru rutarea produselor/tagurilor către imprimante/KDS → /ai-tags sau /settings „Rutare taguri”. Pentru imprimanta fiscală Datecs/Daisy ca driver → /settings?tab=edge-server.
- **Integrări (API)** `/settings?tab=integrations` — Titlu „Integrări & API”. Carduri verticale: OpenAI ChatGPT (cheie proprie/Symbai + nivele AI), ANAF e-Factura & e-Transport (3 sub-tab-uri Conectare/e-Factura/e-Transport), Viva Wallet (ISV/Merchant), Card GP (Global Payments), GP HPP, rutare plăți online, + Tabs Cvent/Contabilitate(Saga/SmartBill)/Delivery(Glovo/Tazz/Bolt).
· NU aici: pentru token Acces AI (Claude/MCP) → portalul Hub „Acces AI”, nu aici. Pentru module plătite → secțiunea „Module & Facturare”. Pentru integrări OTA hotel pe carduri → /integrations.
- **Server & Fiscal** `/settings?tab=edge-server` — Titlu „PC & Server”. Adaugi PC-urile locației (primul devine server), carduri certificat locație, Failover Edge per locație (mod rețea, Forțează conexiune, mod conexiune Print Agent), listă device-uri cu „Fă Server”/test Print Agent/descarcă installer, Loguri Live, ghid instalare.
· NU aici: pentru a adăuga/edita imprimanta fiscală în sine → /settings?tab=printers. Pentru testare Print Agent pe categorii → tot aici (test per device).
- **Setări P&L** `/settings/pnl-categories` — Titlu „Setări P&L”, 4 tab-uri: „Template-uri industrie” (seturi întregi de categorii+KPI cu 1 click), „Categorii P&L” (secțiuni Venituri/COGS/Personal/OPEX + asignare tipuri), „Grupări venituri”, „Setări” (definiții + praguri KPI).
· NU aici: pentru raportul P&L în sine → /analytics?tab=pnl sau /reports/pnl-compare-periods. Pentru conturi contabile pe tip produs → /ai-product-types. NU se configurează prin MCP (web-only).
- **Conturi pe Tip Produs** `/ai-product-types` — Hub cu toggle Simplu/Avansat + Asistent AI și 3 tab-uri: „Tipurile mele” (carduri tip cu semafor sănătate, Adaugă tip via template, Rezolvă ce lipsește, drawer+editor), „Pe unități” (regulă analitice brand/locație), „Împărțire costuri”.
· NU aici: pentru configurarea categoriilor P&L (secțiuni Venituri/COGS) → /settings/pnl-categories. Pentru TVA/alergeni/rutare pe produse → /ai-tags.
- **Reparații Date** `/settings/repair` — Titlu „Reparații”. 11 unelte 1-click cu scanare/preview înainte de aplicare: reconciliere comenzi, curăță produse fantomă (cloud+edge), Sync 100% cloud↔edge, unifică categorii meniu, leagă rețete↔produse (alergeni), corectează unități neconvertibile, conturi non-stocabile, GL umflat penalități, rutare bucătărie/bar, curăță rețete orfane, reconciliază rețete↔produse (product_id).
· NU aici: pentru procese automate recurente programate → /settings/cron-jobs (Procesări Periodice). Pentru legarea rețete↔produse din alt loc → tot reparațiile / Setări→Reparații.
- **Mese Servite** `/finance/served-meals` — Titlu „Mese Servite”. KPI strip (mese/venit/cost/marjă) + căutare + filtru status (Toate/Cost de stabilit/Cost stabilit/Ciornă) + tabel registru. Buton „Masă servită nouă” (dialog: Manual/Din eveniment/Din comandă POS). Drawer detaliu cu tab-uri Cost(fișe consum)/Eveniment/Contract/General.
· NU aici: pentru flag-ul fiscal isMasaServita pe produs → fișa produsului, nu aici. Pentru recomandări rețetă masă servită → /ai-recipes. Pentru registru de casă → /finance/cash-book.
- **Loguri Activitate** `/audit-logs` — Titlu „Loguri Activitate”. Jurnal audit cine/ce/când cu diff vechi→nou. Căutare text + filtru categorie (9: POS & Comenzi, Inventar & Stoc, Producție, Finanțe, Setări, Personal, Meniu & Produse, Clienți, Sistem) + filtru angajat + masă + perioadă (Azi/Ieri/Săptămâna trecută/Luna trecută/interval).
· NU aici: pentru același jurnal prin AI → tool MCP jurnal_activitate. Pentru starea tehnică/erori sistem → /observability. Pentru logurile edge/Print Agent live → /settings?tab=edge-server „Loguri Live”.
- **Import Date** `/data-import` — Titlu „Importuri Date”. 3 tab-uri: „Import Nou” (wizard 4 pași: Încărcare fișier → Mapare coloane → Confirmare → Rezultat, alegi entitatea țintă), „Șabloane (N)” (salvează/reaplică mapări), „Istoric (N)” (rulări trecute).
· NU aici: pentru import asistat conversațional → onboarding/asistent Sym. Pentru pasul de import din onboarding → /onboarding/step/2.
- **Contexte QR dinamice** `/settings/qr-contexts` — Configurezi ce context se deschide la scanarea QR-ului de pe masă (Terasă/Piscină/Cameră hotel/Eveniment): cheie URL, nume, imagine, culoare, masă implicită.
· NU aici: pentru generarea/tipărirea codurilor QR → /qr-codes; pentru presetul QR per raion (câmpuri cerute) → /staff?tab=floor-schedule

## NU sunt pagini (atenție)
- **Schimbarea unității active** (locație/brand) — stare de browser, NU rută. Vezi secțiunea „Schimbarea unității active” din `navigare.md`. NU o căuta cu `gaseste_in_aplicatie`.
- `/settings?tab=brands` = administrarea locațiilor/brandurilor, NU comutarea unității curente.
