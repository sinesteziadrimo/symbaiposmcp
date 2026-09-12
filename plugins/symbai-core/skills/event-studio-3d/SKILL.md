---
name: event-studio-3d
description: Construiește și amenajează în Event Studio 3D complexe, hoteluri, săli de evenimente și conferințe; variante după invitați, meniu, program și prezentări buyer legate de CRM. Pentru geometria locației și vânzarea vizuală; rezervările PMS și planul operațional de mese au fluxuri separate.
---

# Event Studio 3D

Lucrează cu locația reală, la scară, și arată clientului o propunere verificată vizual. Vorbește despre săli, invitați, servire și atmosferă; explică numai detaliile tehnice necesare măsurătorilor.

Descoperă prin `cauta_tool` cu „event studio 3d” și operația dorită. Încarcă `get_event_studio_guide({topic:"start"})` o singură dată, apoi numai tema necesară. Citește prin `citeste_tool`, modifică prin `ruleaza_tool` când instrumentele nu sunt expuse direct. Nu cere catalogul complet și nu încărca ghidurile Fabricii 3D pentru o sală de evenimente.

Verifică disponibilitatea instrumentelor în instanța conectată. Un ghid disponibil în plugin nu dovedește că acea instanță are deja funcția. Dacă lipsește, spune concret ce nu poți salva prin conexiunea curentă; nu pretinde că ai construit locația folosind alt tip de plan.

## Flux

1. Identifică brandul, locația și, când cererea pornește din CRM, dealul exact. `get_event_studio_context` citește contextul și meniurile; `list_event_studio_projects` găsește biblioteca unității sau proiectele dealului. Refolosește identificatorii deja verificați.
2. Citește `get_event_studio_project` numai pentru secțiunea necesară. Rezumatul dă revizia; `spaces`, `levels`, `scenarios`, `objects`, `menu`, `guests`, `agenda` dau pagini. `details` cu `scenarioId` include setările și notele private ale unei variante. Urmează `pagination.nextArguments` până acoperi selecția; nu confunda prima pagină cu toate datele.
3. Pentru o construcție nouă sau cote importate, citește [geometrie și scară](references/geometrie.md). Pentru aspect, decor și variante, citește [design și amenajare](references/design.md). Nu estima drept certe cote care lipsesc; avansează cu partea cunoscută și clarifică măsurătorile care schimbă rezultatul.
4. Construiește în loturi cu identificatori stabili. Transmite `revision` curentă la fiecare modificare și preia noua revizie din răspuns. `preview=true` simulează fără salvare; generatorul de amenajare folosește implicit această opțiune. Aplică rezultatul verificat cu `preview=false`. Cererea de configurare autorizează modificările necesare; nu cere din nou același acord.
5. Leagă meniul, cazarea estimată, invitații și programul. Folosește prețuri reale, moneda verificată și cantitățile corecte. [Ghidul platformei](../../knowledge/event-studio-3d.md) explică operațiile și limitele.
6. `validate_event_studio_project` verifică locurile, suprapunerile, accesele, înălțimea și bugetul și dă inventarul. Repară problemele din cerere. Deschide `editorUrl`, compară planul 2D, sala, complexul și plimbarea. Nu declara „arată corect” pe baza unei salvări reușite; spune dacă verificarea vizuală nu a fost posibilă.
7. Pentru legătura CRM, prezentarea buyerului și feedback, citește [CRM și buyer](references/buyer.md). Prezintă varianta relevantă, ce include prețul și eventualele cote estimate.

## Context și memorie

În conversație păstrează compact proiectul, unitatea, revizia, variantele și următorul pas. Nu recopii scena completă după fiecare operație. Cere catalogul de mobilier doar când ai nevoie, opțional pentru un singur `kind`.

La cererea de memorare, folosește memoria firmei pentru preferințe durabile: paletă, materiale, stil de prezentare, unități și proiecte de referință. Datele operaționale curente rămân în proiect și se recitesc. Nu stoca linkuri buyer secrete, tokenuri, liste nominale, alergii sau note personale în memoria generală. Symbai Memory public descrie folosirea platformei, fără date despre clienți sau proiectele lor.

La conflict de revizie, recitește și compară; nu suprascrie. La rezultat incert, verifică dacă operația s-a aplicat înainte de retry. La crearea unui proiect sau link, păstrează același ID; un ID nou ar putea produce o copie suplimentară.
