# Cursuri online în CRM — lecții, video și progres prin MCP

Același flux se aplică în Claude Code, Codex și ChatGPT: CRM → Materiale → Cursuri online. Aceste cursuri au lecții parcurse de oameni; sunt distincte de asistenții AI de training, conversațiile lor și fișierele din bibliotecă.

În aplicația mobilă **Symbai Staff (Expo Sales)**, intrarea este **Mai multe → CRM → Cursuri și materiale**, cu scurtătură și din lista de oportunități. Oamenii parcurg lecții text/video, reiau video-ul de la poziția salvată și consultă fișierele și dosarele partajate. Progresul este comun cu CRM-ul web; video-ul nesincronizat se păstrează local pentru reluarea sincronizării când revii la aceeași lecție cu aceeași persoană și același brand. Aceasta nu înseamnă descărcarea cursurilor pentru vizionare fără internet. Coordonatorii au tabul **Progres echipă**, conform drepturilor serverului. Crearea/editarea cursurilor rămâne în CRM-ul web sau prin MCP. Disponibilitatea mobilă cere versiunea aplicației și a serverului care includ funcția.

## Descoperire și acces

Verifică tenantul, brandul și conexiunea nominală existente. Caută instrumentele CRM prin `cauta_tool`, citește schema live și apelează executorul indicat (`citeste_tool` / `ruleaza_tool`). `get_crm_configuration_guide` oferă și fluxul pentru cursuri. Ghidul descrie funcționalitatea; numai catalogul live confirmă disponibilitatea pe tenant. Dacă instrumentele lipsesc, explică limita și folosește pagina CRM pentru ce este disponibil, fără SQL sau ocolirea permisiunilor.

Un utilizator CRM își citește progresul și cursurile publicate. Team Leader-ul real poate crea și administra propriile cursuri și vede progresul echipelor sale; Head of Sales cu drepturile necesare administrează cursurile brandului și vede colegii accesibili. Un simplu titlu comercial nu acordă drepturi. Instrumentele pentru cursuri cer acces la întregul brand; o conexiune delegată limitată la anumite locații poate fi refuzată.

## Instrumente

Toate apelurile cer `brandId`. Scrierile cer și `operationId` UUID stabil pentru operația respectivă. La un răspuns incert, repetă exact aceleași argumente și același `operationId`; nu genera o operație nouă. Pentru schimbări ulterioare folosește alt `operationId`.

| Scop | Instrument și argumente specifice |
| --- | --- |
| Caută cursuri | `list_crm_courses`: `search`, `status` (`all`, `draft`, `published`, `archived`), `offset`, `limit` (max. 30). |
| Citește detaliile, lista lecțiilor și progresul | `get_crm_course`: `id` curs, `offset`, `limit`; opțional `employeeId` pentru un coleg accesibil. Continuarea cere `expectedRevision`. |
| Citește o lecție și video-ul său | `read_crm_course_lesson`: `id` lecție, `courseId`, `textOffset`, `textLimit` (max. 8000); continuarea cere `expectedRevision` al cursului. |
| Creează curs | `create_crm_course`: `config` cu `id` UUID nou, `expectedRevision: 0`, `title`, `description`, `category`, `coverUrl`, `color`, `status`, `lessons`. |
| Modifică detalii / publică / arhivează | `update_crm_course`: `id`, `expectedRevision`, `changes` numai cu metadatele schimbate. |
| Adaugă lecție | `add_crm_course_lesson`: `id` curs, `expectedRevision`, `lesson`; opțional `beforeLessonId` pentru inserare înaintea unei lecții, altfel la final. |
| Modifică lecția / adaugă, înlocuiește sau elimină video | `update_crm_course_lesson`: `id` lecție, `courseId`, `expectedRevision`, `changes` numai cu câmpurile schimbate. |
| Reordonează lecțiile | `reorder_crm_course_lessons`: `id` curs, `expectedRevision`, `lessonIds` cu TOATE ID-urile, fiecare exact o dată, în ordinea dorită. |
| Șterge lecție | `delete_crm_course_lesson`: `id` lecție, `courseId`, `expectedRevision`, `confirmDelete: true`. |
| Șterge curs | `delete_crm_course`: `id` curs, `expectedRevision`, `confirmDelete: true`. Șterge și progresul aferent. |
| Raport echipă | `list_crm_course_team_progress`: `id` curs, `offset`, `limit`; include și colegii cu progres zero. Pentru lecțiile unui coleg folosește `get_crm_course(employeeId)`. |

Folosește `pagination.nextArguments` pentru continuarea citirilor. Un sumar de catalog nu conține textul complet al lecțiilor; nu reconstrui cursul din acel sumar. `revision` din curs este versiunea pentru toate scrierile și continuările; `revision` din lecție este diferită și nu se folosește ca `expectedRevision` al cursului.

## Creează și publică un curs

1. Caută înainte de creare, ca să nu dublezi un curs existent. Stabilește titlul, obiectivul și ordinea lecțiilor din cererea utilizatorului; cere numai informația indispensabilă care lipsește.
2. Creează un curs `draft`, cu UUID nou păstrat la retry și `expectedRevision: 0`. Poate avea `lessons: []`; maximum 100 de lecții. Culorile sunt `indigo`, `emerald`, `amber`, `rose`. Coperta este URL HTTPS sau șir gol.
3. Adaugă lecțiile pe rând, folosind revizia întoarsă de fiecare scriere. O lecție are `id` UUID nou, `title`, `kind` (`text` sau `video`), `content`, `videoUrl`, `minutes` (1–600, estimare). Pentru text, `content` trebuie să fie nevid; pentru video, `videoUrl` trebuie să fie nevid și poate avea și explicații în `content`.
4. Recitește cu `get_crm_course` și `read_crm_course_lesson`. Publică prin `update_crm_course(changes: {status: "published"})` dacă publicarea face parte din cererea autorizată. Un curs publicat trebuie să aibă cel puțin o lecție validă.
5. Verifică prin citire statusul final, ordinea și conținutul. Raportează ce ai realizat și eventualele fișiere/linkuri încă lipsă; nu declara disponibil un video doar pentru că URL-ul a fost salvat.

## Video și editări punctuale

- Adaugi/înlocuiești video cu `changes: {kind: "video", videoUrl: "https://…/lectie.mp4"}`. Playerul folosește fișiere video directe compatibile cu browserul (MP4/WebM), accesibile cursanților. O pagină YouTube, Vimeo sau Google Drive nu este fișier video direct. Aceste instrumente salvează adresa; nu încarcă binarul video. Nu inventa URL-uri și nu pune base64 în `videoUrl`.
- Elimini video și păstrezi lecția cu `changes: {kind: "text", videoUrl: "", content: "Textul lecției…"}`. Dacă există deja text valid, îl poți omite din schimbare. Nu șterge lecția întreagă când cererea este doar eliminarea video-ului.
- Modifici titlul, explicațiile, durata estimată sau metadatele fără a retrimite câmpuri necerute. Câmpurile omise se păstrează. `content` nou înlocuiește textul acelei lecții; dacă modifici doar un paragraf, citește întâi toate fragmentele textului și păstrează restul.
- Titlul, durata, ordinea și metadatele păstrează progresul. Schimbarea tipului, textului sau video-ului cere reparcurgerea lecției respective; celelalte lecții își păstrează progresul.
- La conflict de revizie, recitește cursul și reaplică numai intenția utilizatorului peste starea nouă, cu operație nouă. Nu suprascrie automat conținutul modificat între timp.

## Ștergere și progres

O cerere explicită de ștergere a cursului/lecției identificate autorizează folosirea instrumentului dedicat; nu cere o confirmare redundantă. Recitește ID-ul și revizia, apoi transmite `confirmDelete: true`. Dacă ținta este ambiguă, clarifică ținta înaintea ștergerii. Ștergerea elimină progresul aferent; pentru retragere reversibilă folosește `status: "archived"` când aceasta este intenția utilizatorului. Pentru eliminarea ultimei lecții dintr-un curs publicat, treci cursul în `draft` înaintea ștergerii.

Progresul este înregistrat din parcurgerea efectivă în interfață. Nu marca lecțiile ca vizionate și nu fabrica procente în numele cursanților. Rapoartele sunt citiri cu permisiunile persoanei conectate; asistentul nu primește acces la echipe din afara ariei sale.
