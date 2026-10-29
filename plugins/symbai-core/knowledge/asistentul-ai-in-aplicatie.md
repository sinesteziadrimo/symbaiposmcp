# AI în aplicație — Sym, asistenții personali și uneltele AI rămase

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Pentru mărire, cititor de ecran, dictare și ascultarea răspunsurilor, citește [accesibilitate și voce](accesibilitate-voce.md).

Pe 25.09.2026 au fost **retrase** paginile AI vechi: agenții specialiști pe domenii (`/ai-menu`, `/ai-pricing`, `/ai-reports`, `/ai-accounting`, `/ai-legal`, `/ai-research` etc.), onboarding-ul cu AI (`/ai-onboarding`), importurile din fișier (`/data-import`, `/ai-bulk-import`, `/menu/import-pdf`), creatorii de agenți (`/portal-chat-agents`, `/ai-staff-creator`, `/ai-sales-creator`), memoriile agenților (`/ai-agent-memories`, `/brand-memories`) și Loguri AI (`/ai-logs`). Nu trimite userul acolo.

Ce există acum:
- **Sym** — bula din dreapta-jos, pe orice pagină. Vorbești cu **asistentul tău personal**, care rulează prin **Symbai Connect** pe calculatorul firmei (Codex sau Claude Code), vede pagina deschisă și poate conduce pagina. Configurarea: **Asistenții mei** (`/my-assistants`) și skill-ul `gestioneaza-asistentii`. Dacă Sym spune că nu poate verifica „conexiunea cu calculatorul”, depanarea e în skill-ul `depaneaza-connect`.
- **Asistenți în grupuri POS/Staff/WhatsApp** — aceiași asistenți personali, cu participări și acces pe module; vezi `gestioneaza-asistentii` și [asistenți WhatsApp](asistenti-whatsapp-configurare.md).
- **Unelte AI în pagini**: etichetare AI (`/ai-tags`), tipuri de produs (`/ai-product-types`), maparea AI a facturilor (`/inventory/ai-review`), rețete (`/recipes`; `/ai-recipes` duce acolo), prețuri meniu (`/menu/pricing`).

## Concepte
- **Memoria asistentului** — preferințe și note despre business, pe server, aceleași în Claude Code, Codex și Sym: skill-ul `memorie-business` (`memorie_citeste`).
- **Memoriile de brand** — regulile casei, vocea brandului, programul special: `list_brand_memories` / `read_brand_memories`, scriere cu `upsert_brand_memory` (după acordul omului).
- **Acces AI la baza de date** — doar-citire, prin permisiunea de rol „AI: Interogare SQL Bază de Date”; parolele, cheile și cardurile sunt blocate. Asistentul vede doar ce vede omul.
- **Cheia OpenAI** — Setări → Integrări (cardul OpenAI): cheia proprie se salvează criptat și nu se mai afișează.
- **Audit** — orice acțiune făcută prin conexiune apare în jurnalul de activitate (`/audit-logs`, `jurnal_activitate`).

## Paginile rămase
- **Asistenții mei** (`/my-assistants`) — creezi și configurezi asistenții personali (rol, instrucțiuni, calculator Connect, acces, grupuri). `/ai-marketing` duce aici, cu focus pe marketing.
- **Etichete AI** (`/ai-tags`) — etichete pentru rutarea bonurilor la imprimante/KDS și filtrare.
- **Tipuri de produs** (`/ai-product-types`) — tipurile de produs și conturile lor.
- **Observabilitate** (`/observability`) — starea integrărilor și timpii de răspuns.
- **Popout / Coach agent prezentare** (`/presentation/agent-popout`, `/presentation/agent-coach`) — asistentul vânzătorului în timpul prezentării.

## Fluxuri frecvente
1. **Întrebi Sym ceva** — bula din dreapta-jos → întrebi („cât am vândut azi?”) → asistentul răspunde din datele tale, prin Connect.
2. **Imporți produse/meniuri/rețete** — prin conexiune: `bulk_create_products`, `bulk_create_menus`, `import_retetar` (dryRun întâi), catalog furnizor cu `import_supplier_catalog_from_file`; vezi skill-ul `importa-date`.
3. **Programezi conținut social** — `schedule_social_post` (intră „în așteptare aprobare”), apoi `approve_social_post` după acordul omului.
4. **Auditezi ce s-a făcut** — `jurnal_activitate` sau `/audit-logs`.

## Tool-uri MCP utile
**Citire:**
- `gaseste_in_aplicatie`, `explain_feature`, `ghid_symbai` — navigare și explicații.
- `read_brand_memories`, `list_brand_memories`, `get_business_context` — ce știe sistemul despre brand.
- `list_agent_conversations` / `get_agent_conversation` — istoricul conversațiilor vechi cu agenții de chat (retrași).
- `list_social_accounts` / `list_social_posts` — conturi și postări.
- `jurnal_activitate` — cine a făcut ce și când.
- `list_database_tables` → `describe_database_table` → `execute_sql_query` — doar-citire, cu SQL activ pe conexiune.

**Scriere:**
- `upsert_brand_memory` — memorie de brand.
- `schedule_social_post` / `approve_social_post` / `cancel_social_post` — postări.
- `bulk_update_products` — cota TVA și alte câmpuri pe mai multe produse deodată.
- `bulk_create_products` / `bulk_create_menus` — produse și meniuri în masă.
- `create_tag` / `assign_tag` / `bulk_assign_tag` / `auto_tag_from_menu_categories` — etichete.
- `bulk_create_employees` — angajați în masă.
- `create_notification_rule` — regulă de automatizare.

## Întrebări frecvente
- **Unde e agentul X / pagina AI X?** Paginile de agenți specialiști au fost retrase. Cererea se face direct la Sym sau la asistentul din Claude Code/Codex.
- **Sym nu răspunde.** Asistentul rulează prin Symbai Connect: verifică în `/my-assistants` calculatorul legat și starea lui; skill-ul `depaneaza-connect`.
- **De ce nu răspunde cu cifre din baza de date?** Rolul are nevoie de „AI: Interogare SQL Bază de Date”.
- **Poate AI-ul să șteargă lucruri?** Doar prin uneltele dedicate, cu previzualizare și confirmare (ex. `bulk_delete_products` reversibil, `delete_menu_category`), cu drepturile omului. Totul apare în jurnalul de activitate.

## Pentru acces SQL (scurt)
Tabele relevante: `brand_memories`, `automation_rules`. Jurnalul de activitate se citește cu `jurnal_activitate`, nu prin SQL.
