---
name: event-studio-3d
description: Construiește în Event Studio 3D hoteluri, restaurante, săli, grădini și parcuri de activități, inclusiv din PDF, imagini și planuri ISU atașate; cote, etaje, subpante, mobilier real, tururi și variante pentru buyeri legate de CRM. Încarcă ghidurile de planuri sau camere numai la nevoie.
---

# Event Studio 3D

Lucrează cu locația reală, la scară, și arată clientului o propunere verificată vizual. Vorbește despre săli, invitați, servire și atmosferă; explică numai detaliile tehnice necesare măsurătorilor.

Descoperă prin `cauta_tool` cu „event studio 3d” și operația dorită. Încarcă `get_event_studio_guide({topic:"start"})` o singură dată, apoi numai tema necesară. Citește prin `citeste_tool`, modifică prin `ruleaza_tool` când instrumentele nu sunt expuse direct. Nu cere catalogul complet și nu încărca ghidurile Fabricii 3D pentru o sală de evenimente.

Verifică disponibilitatea instrumentelor în instanța conectată. Un ghid disponibil în plugin nu dovedește că acea instanță are deja funcția. Dacă lipsește, spune concret ce nu poți salva prin conexiunea curentă; nu pretinde că ai construit locația folosind alt tip de plan.

## Flux

1. Identifică brandul, locația și, când cererea pornește din CRM, dealul exact. `get_event_studio_context` citește contextul și meniurile; `list_event_studio_projects` găsește biblioteca unității sau proiectele dealului. Refolosește identificatorii deja verificați.
2. Citește `get_event_studio_project` numai pentru secțiunea necesară. Rezumatul dă revizia; `spaces`, `levels`, `scenarios`, `objects`, `menu`, `guests`, `agenda` dau pagini. `details` cu `scenarioId` include setările și notele private ale unei variante. Urmează `pagination.nextArguments` până acoperi selecția; nu confunda prima pagină cu toate datele.
3. Pentru o construcție nouă citește [geometrie și scară](references/geometrie.md). Dacă utilizatorul atașează planuri PDF/ISU sau imagini, urmează [construcția din planuri](references/planuri.md). Pentru camere, clădiri pe niveluri și trasee citește [hoteluri și vizitare](references/hoteluri.md). Pentru decor și variante citește [design și amenajare](references/design.md). Nu încărca toate referințele. Nu prezenta drept certe cote care lipsesc; continuă părțile documentate.
4. Construiește în loturi cu identificatori stabili. Transmite `revision` curentă la fiecare modificare și preia noua revizie din răspuns. `preview=true` simulează fără salvare; generatorul de amenajare folosește implicit această opțiune. Aplică rezultatul verificat cu `preview=false`. Cererea de configurare autorizează modificările necesare; nu cere din nou același acord.
5. Leagă meniul, cazarea estimată, invitații și programul. Folosește prețuri reale, moneda verificată și cantitățile corecte. [Ghidul platformei](../../knowledge/event-studio-3d.md) explică operațiile și limitele.
6. `validate_event_studio_project` verifică locurile, suprapunerile, pereții, accesele, înălțimea și bugetul și dă inventarul. Cere și `section=spaces` pentru camerele fără variantă. Repară problemele. Deschide `editorUrl`, compară planul 2D cu sursa, clădirea, nivelurile, camerele și plimbarea. Testează trecerile, inclusiv scara/liftul, și punctele turului. Nu declara „arată corect” doar dintr-o salvare reușită.
7. Pentru legătura CRM, prezentarea buyerului și feedback, citește [CRM și buyer](references/buyer.md). Prezintă varianta relevantă, ce include prețul și eventualele cote estimate.

## Context și memorie

În conversație păstrează compact proiectul, unitatea, revizia, variantele și următorul pas. Nu recopii scena completă după fiecare operație. Cere catalogul de mobilier doar când ai nevoie, opțional pentru un singur `kind`.

Planurile se citesc pe pagini și zone, cu imagine numai la cerere. `get_event_studio_project` oferă separat `walls`, `footprint`, `sources`, `connections` și `tour`. Sursele și calibrarea rămân în proiectul privat; în memorie păstrează doar identificatorii, nivelul de verificare și ce cotă mai lipsește, fără PDF/base64, linkuri secrete sau copii integrale de geometrie.

La cererea de memorare, folosește memoria firmei pentru preferințe durabile: paletă, materiale, stil de prezentare, unități și proiecte de referință. Datele operaționale curente rămân în proiect și se recitesc. Nu stoca linkuri buyer secrete, tokenuri, liste nominale, alergii sau note personale în memoria generală. Symbai Memory public descrie folosirea platformei, fără date despre clienți sau proiectele lor.

La conflict de revizie, recitește și compară; nu suprascrie. La rezultat incert, verifică dacă operația s-a aplicat înainte de retry. La crearea unui proiect sau link, păstrează același ID; un ID nou ar putea produce o copie suplimentară.
