---
name: perfecteaza-plan-import
description: Verifică și corectează fabrica 3D importată din PDF/imagine — scară din cote, poziții reale în cm, orientare, etaje, pereți și echipamente asociate corect. La „pune-le corect după PDF”, „perfecționează planul importat”, „utilajele sunt toate în dreapta”, „verifică scara”. Include planurile vechi 2D.
---

# Perfecționează un plan de fabrică importat

## Flux preferat: Fabrica 3D

Descoperă `get_factory_3d_guide` și citește [fluxul 3D din PDF](../../knowledge/plan-fabrica-3d.md). Citește fabrica și obiectele existente prin `get_factory_3d_workspace`. Pentru fiecare obiect de corectat, secțiunea `scene` cu `objectId` întoarce geometria și `targets` necesare unei actualizări fără dublare. Păstrează pereții cu goluri, contururile și modelul existent; `asset` omis păstrează modelul.

Încarcă PDF-ul prin `start_factory_plan_document` + `append_factory_plan_document_chunk`, inspectează pagina și textul, calibrează două repere după cote și verifică încă o cotă independentă. Citește vizual scanările; lipsa textului extras nu înseamnă lipsa cotelor. Nu trata poziția unui text sau un rând din legendă ca amprenta utilajului. Dacă planul nu conține înălțimi, păstrează `measured:false` și enumeră ce trebuie verificat.

Corectează în loturi cu `preview_factory_3d_changes`, apoi `apply_factory_3d_changes` cu același conținut și revizia primită. Include `source` pentru a păstra pagina, SHA-256 și calibrarea folosite. Recitește și verifică vizual rezultatul în Fabrica 3D. Modificările cerute sunt deja autorizate; cere numai cotele sau explicațiile care lipsesc pentru o poziționare corectă.

## Compatibilitate: importurile vechi 2D

Instrucțiunile următoare sunt pentru instanțe fără toolurile 3D. Detecția automată produce propuneri, nu dovada unor măsurători corecte.

Importul automat dintr-un PDF/imagine (vezi skill-ul `plan-fabrica` → „Import plan") aduce planul **aproape gata**: pune fundalul real ca imagine, detectează camerele pe poziții reale, curăță zidurile (best-effort) și plasează echipamentele acolo unde reușește. Pe planuri CAD dense (arhitecturale, cu hașuri, cu echipamentele marcate prin **cutii numerotate** legate de o legendă), detecția automată NU poate fi 100% — multe echipamente rămân „stagiate" într-un grup lângă plan, de tras manual.

**Acest skill = TU, asistentul, faci planul perfect prin conexiune (MCP):** încarci planul, te uiți la imaginea reală de fundal (cu markerii numerotați), și pui fiecare echipament la poziția lui corectă în cm, apoi cureți zidurile rămase greșit. Lucrezi cu raționament + ce vezi pe plan, nu ghicit.

Clientul e proprietar/manager de fabrică — vorbește simplu („cuptorul", „masa de inox", „zona de ambalare"), nu despre cod.

## Când îl folosești
- Importul a lăsat echipamentele într-un grup în dreapta planului („nu sunt puse deloc pe plan").
- Echipamente puse pe poziții greșite, sau lipsesc de pe plan.
- Ziduri groase/aproximative care în realitate erau treceri/coridoare.
- Clientul vrea ca planul importat „să arate exact ca planul real".

## Uneltele MCP pe care le folosești (există deja)
- `list_factory_plans` / `get_factory_plan` — citești planul: meta (nivele, grilă, **bgUrl** = imaginea de fundal cu scara reală), **toate obiectele** (echipamente, zone, ziduri) cu poziții în cm + nume real + dacă sunt legate de entități reale, și conexiunile. E exact ce vede editorul vizual.
- `get_factory_plan_palette` — entitățile reale disponibile (echipamente/zone/magazii/operatori), ca să legi corect prin `entityName`.
- `place_factory_object` — pui UN obiect la coordonate **cm** (x/y/width/height), legat de o entitate reală (`entityName` sau `entityId`) sau generic (wall/door/aisle). Pentru zid: `objectType:"wall"`, `meta:{kind:"wall", thicknessCm, wallType}`.
- `build_factory_floor` — COMPOZIT: pui MULTE obiecte dintr-o comandă (+conexiuni prin index). Ideal ca să muți tot grupul de echipamente pe poziții într-un singur pas.
- `update_factory_object` — muți/redimensionezi/rotești un obiect existent (poziție x/y în cm, lățime/înălțime, rotație).
- `delete_factory_object` — ștergi un obiect greșit (ex. un zid fals gros).

## Fluxul (pas cu pas)

### 1. Încarcă planul + vezi imaginea reală
- `get_factory_plan(planId)` → reține: **scara** (din nivel: `widthCm`/`bgWidthCm` = lățimea reală în cm a fundalului; grila `gridSizeCm`), **bgUrl** (imaginea), lista de obiecte (care echipamente sunt deja pe poziții bune vs „stagiate" departe de plan — de regulă cele cu x mai mare decât lățimea planului), camerele (zone) deja pe poziții reale.
- **Uită-te la imaginea de fundal** (bgUrl): este planul REAL al halei, cu camerele și cu **markerii numerotați** (cutii cu un număr — fiecare e un utilaj; numărul cheie spre denumirea din legendă). Camerele deja plasate corect îți dau reperele.

### 2. Identifică pozițiile reale ale echipamentelor
Pentru fiecare echipament de pus, găsește-i markerul pe imagine:
- Markerii sunt cutii mici cu un număr. Același număr apare de mai multe ori = mai multe unități (ex. „4" de 4 ori = 4 utilaje identice).
- Folosește **camerele deja plasate** ca sistem de referință: dacă „Cuptorul" e în „Zona coacere", caută markerul lângă caseta acelei zone.
- Convertește poziția din imagine în **cm**: dacă fundalul are lățimea reală `bgWidthCm` și imaginea are lățimea `W` px, atunci `x_cm = x_px / W * bgWidthCm` (la fel pe înălțime). Centru pe marker.

### 3. Pune echipamentele pe poziții (prin MCP)
- Preferă `build_factory_floor` ca să pui mai multe deodată: fiecare obiect `{objectType:"production_equipment", entityName:"<nume real>", x, y, width, height}` la poziția în cm.
- Pentru echipamentele DEJA pe plan dar greșit poziționate → `update_factory_object(id, {x, y})`.
- Leagă-le de echipamentele REALE prin `entityName` (ia numele exact din `get_factory_plan_palette`). Așa apar cu date live (status, fluxuri).
- Dimensiunile vin din cote sau fișa tehnică. Dacă lipsesc, marchează-le ca estimări și spune ce informație trebuie completată. Rotește după orientarea observată pe desen.

### 4. Curăță zidurile
- Citește zidurile (`objectType:"wall"`) și compară fiecare cu imaginea. Forma sau grosimea singure nu justifică ștergerea; elimină doar detecțiile false demonstrate, în scopul autorizat.
- Zidurile reale sunt **lungi și subțiri** (10–30 cm grosime). Dacă lipsesc pereți, trasează-i tu peste fundal: `place_factory_object({objectType:"wall", x, y, width, height, meta:{kind:"wall", thicknessCm:12, wallType:"interior"}})`.

### 5. Verifică (OBLIGATORIU — nu declara „gata" fără dovadă)
- `get_factory_plan(planId)` din nou → confirmă că fiecare echipament cerut e pe plan, în interiorul camerei corecte, legat de entitatea reală.
- Spune clientului să **ascundă fundalul** (butonul „Ascunde plan") ca să vadă curat doar ce ai trasat — sau deschide-i tu pagina `/factory-floor-plan?plan=<id>`.
- Dacă ceva e pe lângă, corectează cu `update_factory_object` și re-verifică.

## Reguli (lucru sigur)
- **Idempotent**: dacă rulezi din nou, NU dubla obiectele — verifică întâi cu `get_factory_plan` ce e deja plasat (pe poziții bune) și mută/lasă, nu re-crea.
- **Coordonate în cm reali**, raportate la scara fundalului (`bgWidthCm`). Nu pune în px.
- **Respectă autorizarea existentă** pentru corectările cerute; cere acord separat pentru ștergeri sau schimbări care depășesc cererea.
- Lucrezi **MCP-first**; la final îi arăți rezultatul în aplicație (deschizi pagina prin extensia Chrome dacă e conectată).
- Realist: pe planuri foarte dense, fă-o **iterativ** — pune un grup, verifică, corectează. Mai bine câteva corecte decât toate greșite.

## Vezi și
- `plan-fabrica` — construirea de la zero a planului + butonul „Import plan".
- `knowledge/plan-fabrica-2d.md` — glosar plan 2D, niveluri, scară, ziduri.
- `knowledge/agent-operare-avansata.md` — standardul de lucru sigur (citire → plan → scriere idempotentă → verificare).
