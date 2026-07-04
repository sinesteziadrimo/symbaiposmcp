# Onboarding Symbai prin Claude Code — planul general

> Acesta e fișierul-mamă al ghidului de onboarding. Îl citești PRIMUL, apoi încarci fișierul fiecărei faze (01–12, același folder) **abia când ajungi la ea** — nu le citi pe toate odată.

Onboarding = configurarea de la zero (sau completarea) unei instanțe Symbai pentru un client nou: firmă, branduri, locații, produse, meniu, etichete, echipamente, plăți, sală, personal, rețete, finanțe, rezervări, marketing, portal. Tu (Claude Code, conectat prin MCP la instanța clientului) poți face direct ~80% din această muncă; restul e ghidare precisă în aplicație.

## Regulile de aur (valabile în TOATE fazele)

1. **Inventar înainte de orice** — `get_config_status(brandId)` + `list_brands` + `list_locations` + citirile fazei. Ce există deja NU se recreează; nume existent = îl folosești.
2. **CUI ÎNTÂI** — la firmă nouă, `lookup_company_cui` înaintea oricărui `create_brand`/`create_location` (completează datele firmei + creează cotele TVA RO automat).
3. **Utilizatorul are fișiere (Excel/CSV din vechiul sistem)?** → calea de import (faza 02) imediat, înainte de a crea produse manual.
4. **Confirmare = acțiune.** Confirmă o singură dată deciziile structurale (branduri/locații, maparea unui fișier), apoi execută fără să re-întrebi. La „da/corect/exact" — acționezi imediat.
5. **Întrebări minime.** Nu întreba ce poți citi singur. Nu cere date opționale (logo, slogan, program) — se completează ulterior. O temă de întrebări per mesaj.
6. **După FIECARE scriere, verifici printr-o CITIRE** (`list_*`/`get_*`), nu prin interfață — aplicația are cache în browser și arată datele noi abia după refresh. Succes la tool = date salvate; nu repeta scrierea, nu raporta bug.
7. **Zero jargon cu utilizatorul** (om de business): „PC-ul care gestionează imprimantele" nu „Print Agent", „ecran de bucătărie" nu „KDS", „server local" nu „edge", niciodată „tool/endpoint/JSON". Numele tehnice rămân între tine și aceste fișiere.
8. **Lista de tool-uri din sesiunea TA e sursa de adevăr.** Instanțele se actualizează în valuri: dacă un tool menționat în aceste fișiere lipsește la tine, instanța clientului nu are încă versiunea aceea — folosește alternativa UI indicată. Dacă ai tool-uri noi nemenționate aici, folosește-le conform descrierii lor.
9. **Ștergeri nu există prin conexiune** — nu promite că „ștergi tu"; ghidează în aplicație (`gaseste_in_aplicatie`).
10. **Fricțiune văzută = sugestie trimisă**: dacă un tool lipsă sau o limitare te încetinește vizibil, trimite o sugestie cu `trimite_ticket_symbai` (tip `sugestie`, cu `dedupeKey`) și mergi mai departe.
11. **Pachetul de cunoștințe se ține singur la zi.** Pluginul `symbai-core` se instalează cu actualizarea automată pornită și își re-sincronizează cunoștințele la pornire — clientul NU rămâne blocat pe ghiduri vechi. Dacă totuși observi că ești pe o versiune veche (lipsesc skill-uri/ghiduri pe care le aștepți), invocă skill-ul `symbai-update` (diagnostichează + repară instalarea). Nu cere clientului pași manuali înainte să încerci asta.

## Fazele, în ordinea dependențelor

| # | Faza | Fișier | Module de scriere necesare | Depinde de |
|---|------|--------|---------------------------|------------|
| 0 | Inventar + plan | (acest fișier) | — (doar citiri) | — |
| 1 | Firmă, branduri, locații, TVA | `01-firma-branduri-locatii.md` | `setari` (+`produse_meniu` la TVA manual) | — |
| 2 | Gestiuni + produse + meniu (import sau manual) | `02-import-date.md` | `produse_meniu` (+`furnizori` opțional) | 1 |
| 3 | Etichete (rutare bonuri) | `03-etichete-rutare.md` | `produse_meniu` | 2 |
| 4 | PC + imprimante + casă fiscală + ecrane bucătărie | `04-hardware-imprimante-kds.md` | `setari` | 3 (etichetele) |
| 5 | Metode de plată | `05-plati.md` | `setari` | 1 |
| 6 | Sală (zone, mese, configurații) + QR pe mese | `06-sala-qr.md` | `setari` | 1 |
| 7 | Personal: roluri, angajați, ture | `07-personal-roluri.md` | `personal` | 1 |
| 8 | Rezervări (configurare) | `08-rezervari.md` | `setari` + `rezervari_clienti` | 1 (mai util după 6) |
| 9 | Rețete (cost + consum stoc) | `09-retete.md` | `retete` (+`produse_meniu` opțional) | 2 |
| 10 | Tipuri de produs (conturi), finanțe, HACCP | `10-finante-tipuri-produs-dsv.md` | `financiar` + `setari` | 2 |
| 11 | Marketing: social media + integrări | `11-marketing-social-integrari.md` | `marketing_social` (+`setari`) | 1 (poze/meniu ajută) |
| 12 | Portal clienți, website, meniu fizic, livrări | `12-website-portal-livrari.md` | `setari` (+`produse_meniu` corecturi) | 2, 6, 8 |

Ordinea 1→2→3→4 e obligatorie (dependențe dure: totul cere `brandId`/`locationId`; produsele cer gestiune; etichetele cer produse; rutarea cere etichete). Fazele 5–12 sunt în mare parte independente între ele — prioritizează după nevoia clientului (un restaurant care deschide mâine are nevoie de 4+5 înaintea lui 9–12).

**Minimul ca să poată VINDE**: fazele 1, 2, 3, 4, 5 (+6 dacă vinde la masă). Restul se pot face în zilele următoare.

## Nu toate fazele se aplică oricui

Aplicația își adaptează wizard-ul după domeniul de business (restaurant/cafenea/hotel/fabrică/magazin/ecommerce...). Orientativ:
- **Hardware (4), sală+QR (6), rezervări (8), meniu fizic și platforme (din 12)** — au sens pentru restaurante/cafenele/baruri/hoteluri, NU pentru magazin pur sau ecommerce.
- **Rețete (9), HACCP (din 10)** — restaurante/hoteluri/fabrici de alimente.
- **Portal clienți + chat (din 12)** — hoteluri, parcuri/spa, restaurante.

Întreabă la început ce fel de business e (o singură dată) și propune DOAR fazele relevante. Dacă utilizatorul a ales deja domeniile în aplicație, wizard-ul lui arată oricum doar pașii relevanți.

## Cum măsori progresul

- **`get_config_status(brandId)`** — procent general + categorii detaliate (brand, locații, produse, meniuri, gestiuni, rețete, personal, POS, plăți, imprimante, ecrane bucătărie, fiscal, rezervări...), fiecare cu ce e configurat și ce lipsește. Dă `brandId` explicit. E măsura REALĂ a progresului — folosește-o la început (inventar), după fiecare fază și la final.
- Atenție la interpretare: măsoară EXISTENȚA datelor (count-uri), nu corectitudinea lor; itemul „Categorii" din Produse & Categorii numără **categoriile de meniu** (pe brand sau globale), nu zonele de depozitare; itemul de „prețuri" raportează articole de meniu raportat la numărul de produse (poate depăși 100%); sugestiile `nextSteps` sunt calibrate pe profil de restaurant — ia-le orientativ.
- **Ține un fișier local de progres** (ex. `symbai-onboarding-progres.md` în folderul de lucru al utilizatorului): faza, ce s-a făcut, ce a rămas pe UI la utilizator, deciziile luate (brandId/locationId folosite, maparea fișierelor importate). La o sesiune nouă: citește fișierul + re-rulează `get_config_status` și continui de unde ai rămas — onboarding-ul real durează mai multe sesiuni.

## Coexistența cu wizard-ul din aplicație

Aplicația are propriul wizard la `/onboarding` (pași ghidați, cu asistent AI per pas). Relația cu munca ta:
- **Datele scrise prin conexiune apar instant în wizard** — pașii detectează entitățile existente („Ai 3 branduri configurate"), deci pașii devin de facto „făcuți".
- **Bara de progres a wizard-ului NU se bifează prin conexiune** — utilizatorul apasă singur „Următorul pas" în aplicație dacă vrea wizard-ul „verde". Nu e o problemă: progresul real e `get_config_status`.
- Pentru părțile UI-only (mai jos), cel mai bun loc de trimis utilizatorul e de regulă chiar **pasul de wizard echivalent** — fiecare fișier de fază are secțiunea „Echivalentul în wizard".

## Ce NU se poate prin conexiune (harta scurtă a ghidării)

| Acțiune UI-only | Faza | Cum ghidezi |
|---|---|---|
| Upload de fișiere în aplicație (import AI, meniu din PDF/poze) | 02 | `gaseste_in_aplicatie("import produse din excel")` — dar întâi încearcă calea directă: citești TU fișierul local și creezi datele prin tool-uri |
| Instalarea PC-ului din locație (descărcare, device nou) | 04 | wizard pasul „Instalare" — singurul loc unde se creează PC-uri |
| Completarea casei de marcat fiscale (port, serie) | 04 | Setări → Dispozitive, după instalarea PC-ului |
| Legarea etichetelor de imprimante/ecrane (rutarea) | 04 | wizard pasul „Imprimante & ecrane", tab rutare |
| Aranjarea vizuală a sălii (poziții mese, decor) | 06 | Designer-ul de sală; tu creezi structura |
| Generarea/printarea QR-urilor de masă | 06 | pagina de coduri QR |
| Conectări la terți: Viva, Glovo/Wolt/Bolt/Tazz, conturi sociale (OAuth-ul îl face userul) | 05/11/12 | fișierele fazelor; la social ai `genereaza_link_conectare` |
| Designer website, design meniu fizic, aspect portal | 12 | builder-ele vizuale din aplicație |
| Ștergeri de entități | toate | pagina entității respective |

## Cum începi, concret

1. Citește acest fișier (făcut ✓) + rulează inventarul (regula 1).
2. Spune-i utilizatorului în 3-4 fraze unde e instanța lui (procent, ce există) și propune-i planul de faze relevant pentru businessul lui, cu estimare onestă ce faci tu vs ce rămâne la el în aplicație.
3. Verifică permisiunile tokenului devreme: încearcă în faza 1 o scriere mică sau întreabă-l ce module a bifat. Pentru un onboarding complet recomandă-i să bifeze din portal Hub → Acces AI: `setari`, `produse_meniu`, `retete`, `personal`, `rezervari_clienti`, `financiar`, `furnizori`, `marketing_social` (+ SQL read-only pentru verificări fine). Se aplică în ~1 minut, fără restart.
4. Execută fazele pe rând: încarci fișierul fazei → citiri → întrebările minime → confirmare → execuție → verificare → raport scurt („gata X; urmează Y; la tine în aplicație a rămas Z").
5. La final: `get_config_status` complet + lista a ce a rămas UI-only + actualizezi fișierul de progres.
