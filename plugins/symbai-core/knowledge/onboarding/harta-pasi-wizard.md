# Onboarding — harta celor 29 de pași din wizard (ce faci prin MCP la fiecare)

> Citește asta când **userul e DEJA în wizard-ul de onboarding** (`/onboarding/step/N`) și te întreabă ceva, sau vrea ajutor la un anume pas. Planul + regulile: `00-plan-general.md`. Detaliile per fază: fișierele `01`–`12` (+ `02b/c/d` la import).

## Cum folosești harta

1. **Identifică pasul după CE e pe ecran**, nu strict după număr. Numerele se renumerotează per profil de business (un magazin n-are „sală", un hotel are pași în plus) — deci match pe **titlul pasului** (ex. „Etichete", „Rezervări"), nu pe „step 13".
2. **Explică pe scurt** ce e pasul (1-2 fraze, limbaj de restaurant).
3. **Fă tu prin MCP** ce se poate (coloana „Faci prin MCP") — de regulă mai simplu și mai rapid decât prin pagină.
4. **Ghidează** partea UI-only (coloana „UI-only") — dă link cu `gaseste_in_aplicatie`, nu-l scoate inutil din pas.
5. **Verifică prin citire** după orice scriere (`list_*`/`get_config_status`), nu prin interfață (cache).

**Regula de aur a acestei faze: MCP-direct e default-ul.** Extensia Chrome / pagina o folosești DOAR unde MCP chiar nu poate: **upload de fișiere la import, instalarea PC-ului, designere vizuale (sală, website, meniu fizic), OAuth (Viva/Meta/ANAF), generare/print QR**. În rest, faci direct prin conexiune și-i spui userului „gata, ți-am făcut eu X — dă refresh să vezi".

## Harta pașilor (numerotare tipică — match pe titlu, nu pe număr)

| # | Pasul (ce e) | Faci prin MCP | UI-only — explică/ghidează | Fază |
|---|---|---|---|---|
| 1 | **Firmă, branduri, locații, TVA** | `lookup_company_cui` (ANAF, creează și TVA), `create_brand`, `create_location`, `link_brand_location`, `update_company` | logo brand, țară/monedă, program, ștergeri | 01 |
| 2 | **Import date** (produse, meniu, stoc) | tot fluxul inteligent: pre-creezi refs + construiești fișier canonic + verifici/corectezi (`02b/c/d`) | upload fișier în pagină, meniu din PDF/poze | 02,02b,02c,02d |
| 3 | **Verificare & completare** | `list_*` + repari: `auto_assign_vat_batch`, `bulk_update_products` (tip/TVA/unitate), `update_menu_item`/`apply_menu_prices` (preț), `create_menu_category` | cardurile de pe dashboard + butoanele Quick-Fix (sunt wrappere pe aceleași tool-uri) | 02 |
| 4 | **Gestiune & stocuri** (ghid) | nimic de creat AICI (gestiunile + stocul = pasul 2). Explică NIR vs inventar vs transfer | Intrări Marfă (NIR), Verificări Stoc, Mișcări — pagini | 02 |
| 5 | **Creare manuală** (dacă sari importul) | `create_warehouse`, `bulk_create_products`, `create_menu`, `add_menu_item`, `set_initial_stock` | — (echivalentul manual al pasului 2) | 02 |
| 6 | **Etichete** (rutare bonuri) | `create_tag` (1/secție), `bulk_assign_tag` (filtre pe categorie), `list_untagged_products`, `list_tag_summary` | pagina vizuală de asignare (alternativă la bulk) | 03 |
| 7 | **Instalare PC** (server local) | 0 tool-uri (verifici după cu SQL pe `devices` dacă ai SQL) | **TOT**: download ZIP/PC + installer ca Admin (2 min) + alegi Server-ul. Explică pașii + debug rețea | 04 |
| 8 | **Imprimante & ecrane bucătărie** | `create_printer` (nume = numele secției/tagului, ca să se lege automat), `create_kds_screen` | casa fiscală Datecs/Daisy, rutarea tag→imprimantă („Leagă automat"), butonul Test | 04 |
| 9 | **Plăți** | `create_payment_method` | „Configurare rapidă" (setul standard 1-click), Viva (OAuth), fiscal/sertar per metodă | 05 |
| 10 | **Sală** (zone, mese) | `create_floor_zone`, `bulk_create_floor_tables`, `create_floor_config`, `add_zones_to_config`, `assign_tables_to_section` | **designerul vizual** (drag mese, decor), program săptămânal | 06 |
| 11 | **QR mese** | verifici că mesele există (`list_entities` floor_tables) | pagina **QR Codes**: generează + printează PDF (QR-urile sunt fixe după generare) | 06 |
| 12 | **Personal** (roluri, angajați, ture) | `seed_default_roles`, `create_role`, `set_role_permissions`, `create_employee`/`bulk_create_employees` (+PIN), `bulk_create_shifts`, `create_task_list` | reset PIN (link 48h), contracte & salarii, pontaj, asistenți pe job | 07 |
| 13 | **Rezervări** (& finalizare bază) | `seed_reservation_settings` apoi `configure_reservation_operating_hours` (**program OBLIGATORIU**), `configure_reservation_turn_times/deposit/pacing`, `get_reservation_settings` | câmpuri formular, control disponibilități; pt. ONLINE → activează portalul (`configure_portal_features`) | 08 |
| 14 | **Rețete** (cost + scădere stoc) | `create_recipe` (**`productId` explicit mereu!**), `add_recipe_ingredients` (g/ml), `analyze_food_costs`, `get_recipe_details` | ștergere rețete, import rețetar (pagină), reprocesare consum | 09 |
| 15 | **DSV / HACCP** | `create_haccp_sensor` (per frigider/congelator), `create_cleaning_task` | jurnalele zilnice, fișe tehnice AI — ~80% UI | 10 |
| 16 | **Finanțe** (conturi pe tip produs) | `get_accounting_overview`, `list/update_product_type`, `update_product_type_accounts_per_unit`, `apply_accounting_codes` | template-uri 1-click conturi pe tip, registru casă, închidere zi, e-Factura (OAuth) | 10 |
| 17 | **Legal / GDPR** | **0 tool-uri** — doar `gaseste_in_aplicatie` | **TOT**: contracte AI, semnătură, GDPR, fișe post. Explică + recomandă verificare cu avocat | 10 |
| 18 | **Social media** | `verifica_integrare`, `genereaza_link_conectare`, `conecteaza_instagram_din_facebook`, `schedule_social_post`, `list_social_accounts` | credențialele centrale (Symbai le pune), inbox, calendar, boost reclame | 11 |
| 19 | **Email marketing** | **0 tool-uri** — `gaseste_in_aplicatie` → Setări → Email | **TOT**: SMTP, expeditor (domeniu+SPF/DKIM), șabloane, campanii. Explică ordinea + recomandă domeniu verificat | 11 |
| 20 | **Integrări** (livrări, Viva) | `create_delivery_channel` (doar DECLARĂ canalul) | cheile API (Glovo/Wolt/...), activarea fluxului, Viva, ANAF — 90% UI | 11 |
| 21 | **Automatizări** | `create_notification_rule` (alerte simple: stoc mic→email) | motorul de Acțiuni Automate (birthday→voucher, inactiv→discount) — conversațional in-app | 11 |
| 22 | **Staff Creator** (asistenți AI) | **0 scriere** (`list_entities` citire). Precondiție: rolurile din pasul 12 | builder conversațional `/ai-staff-creator`: descrii jobul, urci proceduri, alegi rolurile | 07 |
| 23 | **Sales CRM** (pipeline) | `list_sales_agents` (citire) | pipeline Kanban + dealuri (evenimente/catering/nunți) — UI | 12 |
| 24 | **Sales Creator** (agenți AI vânzări) | **0 scriere** (`list_sales_agents`) | builder `/ai-sales-creator`: descrii oferta, alegi canale (Messenger/IG/WhatsApp), limite preț | 12 |
| 25 | **Website** (builder + SEO) | citire: `browse_brand_media`, `list_menus` (meniul se sincronizează automat) | builder vizual `/website-builder`: template, pagini, domeniu, SEO, SSL | 12 |
| 26 | **Portal clienți** | `configure_portal_general/appearance/texts/features/menu_config/display`, `get_portal_config` | aranjare vizuală butoane, loyalty (puncte), gamificație | 12 |
| 27 | **Portal chat** (chatbot clienți) | activezi cu `configure_portal_features(chat:true)`, apoi **0 scriere** | builder `/portal-chat-agents`: tip (Concierge/Order/Support), personalitate, FAQ, escalare | 12 |
| 28 | **Meniu fizic** (tipăribil) | **manipulezi config-ul integral**: citești cu `execute_sql_query` (config din `menu_display_configs`), rescrii cu `update_menu_display_config` (REPLACE) — poze, fonturi, fundal, mutare produse, freeform, umplere goluri; + finalizezi produsele cu `update_menu_item`. Skill: `meniu-fizic` (+ `meniu-fizic-design.md`/`-pricing.md`) | aplicarea TEMEI (eroi/decor/repaginare — le face motorul de teme doar din aplicație) + export PDF se fac în app; verificare vizuală prin Chrome | 12 |
| 29 | **Platforme & dispozitive** | `create_menu_display_config`/`update_menu_display_config` (afișaj per device) | editor layout per platformă (Waiter/Bar/Kiosk/KDS), test pe device-ul fizic | 12 |

## Două categorii de pași — adaptează-ți rolul

- **Pași unde FACI tu (MCP-direct)**: 1, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 26, 29 (+ 2 prin fluxul de import). Aici nu mai e nevoie de pagină — faci prin conexiune, confirmi prin citire, anunți userul.
- **Pași unde EXPLICI + GHIDEZI (UI-only)**: 4, 7, 11, 15 (parțial), 17, 19, 20 (parțial), 21 (parțial), 22, 23, 24, 25, 27, 28. Aici n-ai tool-uri de scriere (sau partea grea e vizuală/OAuth) — rolul tău e să explici clar, să dai link-ul exact (`gaseste_in_aplicatie`) și să verifici după ce userul a făcut (citire/SQL).

La ORICE pas, dacă userul întreabă „ce e asta / cum fac / fă-mi tu": (1) explică pe scurt, (2) dacă e pe coloana MCP → fă-o tu acum, (3) dacă e UI-only → ghidează-l pas cu pas + dă link, (4) verifică rezultatul. Nu-l lăsa blocat și nu-l scoate din wizard fără rost.
