# Event Studio 3D: locație, amenajări și buyer

Event Studio reprezintă complexul la scară, cu etaje, săli, camere de hotel, terase, grădini și zone de primire. Pe aceeași locație poți pregăti variante de eveniment cu mobilier, atmosferă, meniu, invitați și program. Pagina editorului este `/event-studio`; prezentarea buyerului este `/event-visit` prin linkul privat de acces generat pentru ea.

Disponibilitatea se verifică în catalogul MCP al instanței. Ghidul public nu dovedește că funcția este deja instalată pe fiecare firmă.

## Instrumente la cerere

Începe cu `cauta_tool` pentru „event studio 3d” și acțiunea necesară. Toolurile nu trebuie încărcate toate în contextul inițial. `get_event_studio_guide` livrează numai tema selectată: start, geometrie, obiecte, design, operare sau buyer.

| Nevoie | Instrumente |
|---|---|
| Unitate, deal, meniuri reale | `get_event_studio_context` |
| Bibliotecă, proiect și secțiuni | `list_event_studio_projects`, `get_event_studio_project` |
| Complex nou și date generale | `create_event_studio_project`, `update_event_studio_project` |
| Etaje, săli și variante | `upsert_event_studio_spaces`, `upsert_event_studio_scenario` |
| Mobilier, construcție și modele | `edit_event_studio_objects` |
| Generare după invitați și atmosferă | `generate_event_studio_layout`, `style_event_studio_scenario` |
| Ofertă, nominal și program | `update_event_studio_menu`, `update_event_studio_guests`, `update_event_studio_agenda` |
| Verificare și inventar | `validate_event_studio_project` |
| Copie către CRM | `clone_event_studio_project` |
| Pregătire și publicare buyer | `prepare_event_studio_share`, `create_event_studio_share` |
| Feedback și retragere | `list_event_studio_shares`, `revoke_event_studio_share` |

Conexiunea trebuie să aibă acces la Rezervări/clienți, CRM sau Hotel pentru operația cerută și un angajat nominal cu drepturile Event Studio. Aria brand/locație și portofoliul CRM se aplică și prin MCP. Dreptul de vizualizare nu permite modificări; o previzualizare dintr-un instrument de scriere păstrează cerința de acces a acelui instrument.

Pentru asistenții numiți, acordă explicit capabilitățile „Evenimente 3D” de citire sau proiectare. Nu sunt adăugate automat tuturor asistenților. Proiectele se folosesc în conversații private și sarcini; nu se expun în grupuri unde portofoliul CRM și datele nominale nu pot fi verificate pentru fiecare participant.

## Citire și modificare eficiente

Rezumatul proiectului include numele, revizia, numărul de elemente și linkul editorului. Pentru detalii citește secțiunea necesară, cu identificatorul sălii sau variantei. Obiectele, invitații, meniurile, programul și feedbackul se citesc pe pagini; răspunsurile sunt limitate și ca volum. `pagination.nextArguments` indică următorul apel. Nu concluziona că lipsesc date după prima pagină.

Scrierile în lot sunt atomice: o referință greșită refuză întregul lot. `revision` protejează munca celorlalți. Un conflict cere recitire și comparație, nu reluare cu o revizie presupusă. `preview:true` verifică rezultatul fără salvare; generatorul folosește implicit această opțiune. După salvare, continuă cu revizia întoarsă.

`upsert` pentru meniu, invitați și program înlocuiește linia completă după id; include toate datele acelei linii. Pentru mobilier, `patches` modifică numai câmpurile indicate. Pentru încăperi, modificările parțiale păstrează elementele fixe. Eliminarea folosește explicit `removeIds` sau câmpul dedicat operației.

## Meniu, cazare și costuri

Fiecare linie are preț unitar, cost intern și unitate:

- `guest`: se multiplică prin numărul invitaților.
- `night`: se multiplică prin `roomNights`, adică **camere × nopți**; patru camere pentru două nopți înseamnă opt camere-noapte.
- `fixed`: se multiplică prin `quantity`.

Exemplu: 120 invitați × 295,25 lei + 8 nopți × 100 lei = 36.230 lei. `quantity` nu modifică multiplicatorul unei linii per invitat sau per noapte. Nu presupune că prețul de bază al meniului este valabil în orice zi: verifică și tarifele pe zile când sunt configurate.

Moneda se declară pe variantă. Schimbarea monedei nu convertește automat valorile și cere retrimiterea explicită a prețurilor existente. Bugetul și costurile sunt interne. Totalurile sunt estimări ale liniilor introduse; nu reprezintă automat un contract, un calcul fiscal complet sau o rezervare.

Lista de invitați permite masă, meniu/preferință și note private. Identificatorul mesei trebuie să existe în acea configurație. Raportul semnalează depășirea locurilor. Dacă regenerezi mobilierul, păstrează originalul într-o variantă separată sau autorizează explicit reașezarea invitaților.

Validarea include o secțiune `spaces` pentru toate sălile, camerele și terasele, chiar dacă nu au variante de eveniment. Verifică și intersecțiile dintre volume și cotele etajelor. Rezumatul arată câte spații au probleme și cum ajungi la detalii.

## Geometrie și prezentare

Vezi skill-ul [event-studio-3d](../skills/event-studio-3d/SKILL.md), cu referințe separate pentru scară, design și buyer. Obiectele procedurale acoperă mobilier, scenografie, servire, decor, construcție, hotel și exterior. Modelele GLB importate completează aspectul; obstacolele importante se marchează separat pentru verificările de circulație.

Editorul permite plan 2D, sală 3D, vedere a complexului, niveluri, lumină, plimbare și imagine de prezentare. Verificarea geometrică raportează problemele cunoscute; nu certifică evacuarea, structura, accesibilitatea legală sau interiorul unei arhitecturi importate. Importul de planuri nu este reconstrucție automată BIM.

Datele despre camere, meniu, mobilier și personal din propunere nu creează singure rezervări PMS, consum de stoc sau sarcini pentru echipă. Pentru execuție, continuă explicit în modulele respective.

## Memorie și continuitate

Proiectul salvat păstrează configurația operațională. Memoria firmei poate păstra preferințe durabile de design și proiecte de referință, când utilizatorul cere memorarea. Recitește revizia și disponibilitatea înainte de modificări viitoare. Nu pune tokenurile/linkurile buyer sau datele personale ale invitaților în memoria generală. Acest ghid public conține numai comportamentul platformei.
