# AI în aplicație — Sym, agenții specialiști și uneltele AI

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt
Symbai are AI integrat peste tot: asistentul global **Sym** (butonul plutitor din dreapta-jos, disponibil pe orice pagină) răspunde la întrebări cu date reale, face acțiuni simple și te duce la pagina potrivită; o familie de **agenți specialiști** (marketing, rapoarte, contabilitate, producție, legal, prețuri etc.) acoperă cereri complexe pe domenii; iar pagini dedicate gestionează **memoriile agenților**, **importurile de date**, **logurile AI** și **onboarding-ul ghidat de AI**.

## Concepte
- **Sym (asistentul global)** — butonul plutitor din dreapta-jos. Are peste 160 de unelte interne: răspunde direct cu cifre și liste din datele tale („câte produse am", „top 5 vânzări azi", „cine a anulat masa 12"), face acțiuni simple („adaugă produsul X la 25 lei"), navighează („du-mă la imprimante") și deleagă cereri complexe către specialiști. Filozofia lui: încearcă întâi singur să răspundă, deleagă doar ce e cu adevărat complex. Ține cont de pagina pe care ești și vorbește pe limba omului.
- **Skills (rețete de lucru)** — Sym are rețete predefinite pentru cereri frecvente: investigarea unei comenzi/mese, audit pe un angajat, diagnoza unei plăți blocate, verificare de închidere de zi, configurare furnizor nou, lansare promoție, investigare diferențe de stoc, depanare KDS, închidere fiscală de zi, analiză prețuri meniu, plus ghiduri de configurare (imprimantă, server local, eFactura, Viva, Glovo). Le folosește automat când cererea se potrivește.
- **Agenți specialiști** — pagini de chat dedicate pe domenii (meniu, achiziții, contabilitate, rapoarte, cash flow, legal, angajați, producție, prețuri, marketing, reclame, analize, research, automatizări, integrări, DSV/HACCP). Sym poate delega către ei, sau îi deschizi direct.
- **Memorii agenți** — fișiere de cunoștințe pe care agenții le citesc ca să răspundă corect: memorii de brand (voce, public țintă), memorii de integrare, memorii fiscale per țară, memorii pentru agenții de vânzări. Tot ce salvezi acolo influențează răspunsurile viitoare.
- **Acces AI la baza de date** — doar-citire, acordat printr-o permisiune dedicată pe rol („AI: Interogare SQL Bază de Date"); date sensibile (parole, chei, carduri) blocate by design. Asistentul respectă permisiunile utilizatorului — vede doar paginile la care ai acces.
- **Cheia OpenAI (3 stări)** — implicit folosești cheia gestionată de Symbai; opțional activezi cheia proprie din Setări → Integrări (cardul OpenAI): se salvează criptat, nu se afișează niciodată înapoi, iar cu cheie proprie poți personaliza nivelurile de modele (Nano/Standard/Heavy/Premium), altfel configurate central de Symbai Hub și ascunse din pagină. A treia stare e una istorică pentru instalări vechi.
- **Etichete (tags)** — AI-ul folosește și creează etichete pentru rutarea bonurilor la imprimante/KDS, grupare stocuri și filtrare meniu; în onboarding există un agent dedicat („Sym Tag Master").
- **Loguri AI** — fiecare apel AI e înregistrat și auditabil: agent, model, durată, tokeni, cost estimat, conversația completă.

## Paginile modulului

### Asistență la configurare și import
- **AI Onboarding / Migrare** (`/ai-onboarding`, alias `/ai-migration`) — configurarea inițială ghidată de AI, pas cu pas: alegi „Import sau De la zero", apoi parcurgi pași (import de date, configurare sală, imprimantă, KDS, TVA, POS, portal, livrare, fidelizare, contabilitate, verificare finală). Fiecare pas are propriul agent („Sym Setup", „Sym Import", „Sym Tag Master", „Sym Rețetar", „Sym Hardware"...), care execută configurarea prin conversație.
- **AI Onboarding Avansat** (`/ai-advanced-onboarding`) — specialist de configurare pentru funcționalități premium/avansate; vede în lateral „Date Existente" ca să știe ce ai deja configurat.
- **Importuri Date** (`/data-import`) — import în masă din fișiere (Excel/CSV) cu 3 tab-uri: import nou, șabloane, istoric. Tipuri acoperite: Produse, Rețetare, Rețetar Complet, Ingrediente Rețete, Meniu & Prețuri, Categorii/Zone, Furnizori, Mișcări de Stoc, Gestiuni. Pașii: încărcare fișier → mapare coloane (cu valori implicite) → confirmare → rezultat. Mapările reușite se pot salva ca șablon refolosibil.

### Agenți specialiști (chat pe domenii)
- **AI Menu Creator** (`/ai-menu`) — „Sym Menu": descrii ce meniu vrei sau ceri ajutor cu produsele; lucrezi pe un meniu selectat.
- **AI Prețuri** (`/ai-pricing`) — „Prețuri & Clasificare Meniu": wizard în 3 pași (despre local → Sym aranjează meniul în 4 grupe → confirmi prețurile), strategii (accesibil/mediu/premium, maximizare profit, aliniere la concurență), indicator „Sănătatea meniului" și un chat „Consultant Prețuri".
- **AI DSV Chef** (`/ai-dsv`) — „Dr. Sym", expert sanitar-veterinar și chef consultant: HACCP, fișe tehnice, etichetare, legislație; are și o zonă de documente filtrabilă pe tip și perioadă.
- **AI Achiziții** (`/ai-procurement`) — „Sym Procurement": analize de aprovizionare (furnizori, prețuri, lead time); are nevoie de date de achiziții existente ca să fie util.
- **AI Contabilitate** (`/ai-accounting`) — „Sym Contabilitate": conturi analitice, tipuri de produse, TVA, structură contabilă.
- **AI Rapoarte** (`/ai-reports`) — „Sym Rapoarte": întrebări despre P&L, vânzări, achiziții, stocuri, furnizori.
- **AI CFO** (`/ai-cashflow`) — „Sym CFO": cash flow, plăți, furnizori, prognoze financiare.
- **AI Legal** (`/ai-legal`) — „Sym Legal": întrebări despre contracte și legislație; poți lipi textul unui contract pentru analiză.
- **AI Angajati** (`/ai-angajati`) — întrebări despre echipă, planificare, contracte și Codul muncii.
- **AI Producție** (`/ai-production`) — „Sym Producție": plan de producție pentru mâine, audit de lot, ce materii prime lipsesc, optimizare de tură.
- **Agent AI Fabrică** (`/factory-ai`) — „Agent Producție AI" pentru modul fabrică (apare doar în mod factory): producție, rețete, loturi, control calitate, KPI.
- **AI Marketing** (`/ai-marketing`) — două moduri: „Autonomous Content AI" (lucrează independent, contactează echipa, creează conținut autonom — cu tab-uri de sarcini, cereri și memorii) și „Content Creator AI" (conținut instant la cerere, cu postări generate și rafinare).
- **AI Ads** (`/ai-ads`) — campanii, bugete, targeting, creative publicitare; tab-uri de chat și unelte.
- **AI Analytics** (`/ai-analytics`) — performanță, tendințe, metrici; tab-uri de chat, rapoarte și unelte.
- **AI Research** (`/ai-research`) — cercetare de piață: competitori, tendințe, idei de conținut; rulezi joburi de research cu buget lunar în $ (vezi cât ai cheltuit luna aceasta), filtru de prospețime a surselor (24h → oricând), istoric și programări recurente.
- **AI Automatizări** (`/ai-automations`) — Sym pentru „Automatizări, Editare Reguli & Social Media": creezi și editezi reguli de automatizare prin conversație, cu listă „Automatizările tale" și un editor avansat (condiții, filtre).
- **AI Integrări** (`/ai-integrations`) — expert în integrări: ghidare, configurare, fișiere de memorie per integrare, căutare în integrări, acțiuni rapide.

### Creatori de agenți și memorii
- **AI Staff Creator** (`/ai-staff-creator`) — creezi asistenți AI personalizați pentru rolurile din echipă, prin chat: personalitate, mesaj de întâmpinare, sarcini zilnice, documente atașate. Asistentul e vizibil doar rolurilor bifate (niciun rol selectat = vizibil tuturor angajaților).
- **Chat Asistent Staff** (`/staff-assistant/:id`) — chat-ul efectiv cu un asistent configurat; apare dinamic în meniul lateral pentru angajații cu rolul potrivit.
- **Agenți Chat & Asistenți** (`/portal-chat-agents`) — creezi cu AI agenți de chat pentru clienți (nume, avatar emoji, brand) pe tipuri: vânzări, informații, urgențe; configurezi „Router-ul Inteligent de Mesaje" (reguli, clasificare AI, test de clasificare, procesor de mesaje cu combinare a mesajelor rapide și întârzieri „umane", agent de fallback după N mesaje neclare); agenții pot transfera conversația între ei.
- **AI Sales Creator** (`/ai-sales-creator`) — creezi agenți de vânzări AI prin chat; tab separat cu agenții existenți.
- **Memorii Agenți Vânzări** (`/sales-agent-memories`) — fișierele de cunoștințe ale agenților de vânzări (ex. pachete petreceri, prețuri, FAQ), asignarea lor pe agenți și un tab de oferte. Apare doar cu modulul CRM (crm_seat) activ în abonament.
- **Memorii Agenți** (`/ai-agent-memories`) — gestionezi fișierele de memorie pentru toți agenții AI, pe 4 tab-uri: Integrări, Brand, Vânzări, Fiscal (reguli fiscale per țară — România, Bulgaria, Germania ș.a.). O memorie are titlu, conținut, opțional cheie de integrare și rută de navigare.

### Monitorizare și prezentare
- **Loguri AI** (`/ai-logs`) — jurnalul tuturor apelurilor AI: filtre pe agent, utilizator, model, status (succes/eroare/limită de tokeni/trunchiat/răspuns gol/în curs), dată, doar-cu-unelte; per apel vezi durata, tokenii (intrare/ieșire/raționament), costul estimat în USD și detaliul pe 3 tab-uri (conversație, tokeni, brut); export și ștergere.
- **Observabilitate** (`/observability`) — starea tehnică: integrările (cereri, erori, rata de eroare, ultimul succes/ultima eroare) și timpii de răspuns pentru cele mai folosite apeluri din aplicație.
- **Popout Agent Prezentare** (`/presentation/agent-popout`) — fereastră secundară pentru agentul de prezentare, gândită pentru al doilea monitor; se deschide din aplicație, pe același calculator.
- **Coach Agent Prezentare** (`/presentation/agent-coach`) — aceeași vedere de coach pe alt dispozitiv, accesată printr-un link cu token dedicat; afișează „Așteptăm prezentarea..." până pornește prezentarea.

## Fluxuri frecvente
1. **Întrebi Sym ceva despre datele tale** — apeși butonul plutitor de pe orice pagină → întrebi („cât am vândut azi?", „cine a anulat masa 12?") → Sym răspunde direct cu cifre; pentru întrebări care cer interogarea bazei de date, rolul tău trebuie să aibă permisiunea „AI: Interogare SQL Bază de Date".
2. **Imporți date dintr-un Excel** — `/data-import` → tab import nou → alegi tipul (Produse, Furnizori, Rețetar...) → încarci fișierul → verifici maparea coloanelor și valorile implicite → confirmi → vezi rezultatul; salvează maparea ca șablon pentru importurile viitoare.
3. **Creezi un asistent pentru angajați** — `/ai-staff-creator` → descrii în chat ce asistent vrei (rol, personalitate, sarcini) → încarci documente de referință → bifezi rolurile care îl văd → angajații îl găsesc în meniul lateral și discută cu el la `/staff-assistant/:id`.
4. **Configurezi chat-ul AI pentru clienți** — `/portal-chat-agents` → creezi agenții (vânzări/informații/urgențe) → definești regulile router-ului și clasificarea AI → testezi cu mesaje de probă → setezi agentul de fallback → activezi canalele.
5. **Generezi și programezi conținut social** — `/ai-marketing` → modul Creator pentru conținut instant sau modul autonom pentru lucru independent → rafinezi postarea → o programezi; extern, prin MCP, `schedule_social_post` programează direct (fără oră rămâne draft).
6. **Auditezi ce a făcut AI-ul** — `/ai-logs` → filtrezi pe agent și perioadă → deschizi un apel → tab Conversație pentru ce s-a discutat, tab Tokeni pentru consum și cost.
7. **Onboarding complet cu AI** — `/ai-onboarding` → alegi „Import sau De la zero" → parcurgi pașii cu agenții dedicați fiecărui pas → la final rulezi verificarea configurării.
8. **Treci pe cheia ta OpenAI** — Setări → Integrări → cardul OpenAI → activezi „Folosește cheie OpenAI proprie" → introduci cheia (se salvează criptat, nu o mai vezi după) → opțional personalizezi nivelurile de modele; butonul de test al conexiunii folosește cheia activă de pe server.

## Tool-uri MCP utile
**Citire (fără permisiune de modul):**
- `gaseste_in_aplicatie` — găsește pagina/funcția potrivită și întoarce link direct; folosește-l înainte de a trimite utilizatorul undeva.
- `explain_feature` — explică o funcționalitate Symbai.
- `read_brand_memories` — citește memoriile brandului (voce de brand, public țintă, stil vizual) pentru marketing.
- `read_integration_memory_files` — citește fișierele de memorie ale integrărilor.
- `list_sales_agents` — listează agenții de vânzări AI ai unui brand (nume, tip, status, scenariu).
- `list_social_accounts` / `list_social_posts` — conturile social conectate și postările (draft/programate/publicate) — de verificat înainte de programare.
- `jurnal_activitate` — cine a făcut ce și când (inclusiv acțiunile declanșate de AI).
- `list_database_tables` → `describe_database_table` → `execute_sql_query` — interogare doar-citire a bazei de date, în exact această ordine; cere toggle-ul SQL activ pe token.

**Scriere (cer modulul de permisiune indicat pe token):**
- `schedule_social_post` / `cancel_social_post` — programează/anulează postări social media (cu oră în viitor se publică automat; fără oră rămâne draft) — modul `marketing_social`.
- `auto_assign_vat_batch` — clasificare TVA automată cu AI pe produse — modul `produse_meniu`.
- `bulk_create_products` — creare produse în masă (import) — modul `produse_meniu`.
- `create_tag` / `assign_tag` / `bulk_assign_tag` / `auto_tag_from_menu_categories` — etichete pentru rutare imprimante/KDS și grupare — modul `produse_meniu`.
- `bulk_create_employees` — import angajați în masă (ex. din Revisal/Excel) — modul `personal`.
- `create_notification_rule` — regulă de automatizare declanșator → acțiune — modul `setari`.

## Întrebări frecvente și capcane
- **De ce nu-mi răspunde Sym la o întrebare cu cifre din baza de date?** Rolul tău are nevoie de permisiunea „AI: Interogare SQL Bază de Date". Fără ea, Sym răspunde doar cu uneltele standard. Accesul e oricum doar-citire, iar datele sensibile (parole, chei, carduri) sunt blocate.
- **De ce nu mai văd cheia OpenAI după ce am salvat-o?** E normal: cheia se salvează criptat și nu se afișează niciodată înapoi — vezi doar starea (cheie proprie setată / cheia Symbai). Testul de conexiune folosește cheia activă de pe server.
- **De ce nu pot schimba nivelurile de modele AI?** Cu cheia Symbai (implicit), nivelurile sunt configurate central de Symbai Hub. Devin personalizabile doar când activezi cheia OpenAI proprie.
- **De ce nu văd pagina Memorii Agenți Vânzări?** Cere modulul CRM (crm_seat) activ în abonament. Similar, Agent AI Fabrică (`/factory-ai`) apare doar în modul fabrică.
- **Asistentul creat pentru angajați nu apare în meniul lateral.** Verifică rolurile bifate în AI Staff Creator — asistentul e vizibil doar rolurilor selectate (niciun rol = toți angajații) și trebuie să fie activ.
- **Am programat o postare prin AI dar nu s-a publicat.** Postările fără oră de programare rămân draft; doar cele cu oră în viitor se publică automat. Verifică starea în lista de postări.
- **Poate AI-ul să șteargă lucruri?** Nu prin acces extern: prin MCP nu există unelte de ștergere de entități întregi — ștergerile se fac doar din interfață. Orice acțiune AI e logată și auditabilă (Loguri AI + jurnalul de activitate).
- **De ce agentul de chat pentru clienți răspunde cu întârziere?** Probabil intenționat: procesorul de mesaje combină mesajele trimise rapid unul după altul și adaugă întârzieri „umane" configurabile, ca răspunsul să nu pară instant.
- **Cum văd cât mă costă AI-ul?** În Loguri AI fiecare apel are cost estimat în USD și consum de tokeni; pentru research există buget lunar dedicat pe pagina AI Research.

## Pentru acces SQL (scurt)
Tabele relevante: `ai_logs` (apelurile AI: agent, model, tokeni, cost, status), `brand_memories`, `integration_memory_files`, `sales_agent_memory_files` (memoriile agenților), `staff_assistants` (asistenții per rol), `automation_rules` (automatizările), `research_jobs` (joburile de research), `import_runs` / `import_templates` (istoricul și șabloanele de import).
Exemple: „câți tokeni a consumat AI-ul luna aceasta per agent" (ai_logs, grupat pe agent), „ce automatizări active am" (automation_rules), „ce importuri au eșuat săptămâna asta" (import_runs).
