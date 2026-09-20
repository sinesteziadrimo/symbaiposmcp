# Configurează asistenți numiți pe WhatsApp prin unelte

La „creează trei asistenți, câte unul pentru producție, întrebări și facturi”, folosește [gestioneaza-asistentii](../skills/gestioneaza-asistentii/SKILL.md). Proprietarul îi administrează prin conexiunea POS nominală, iar numărul personal și partajarea inițială au unelte locale în `symbai-whatsapp-<nume>`. `cauta_tool` din POS nu caută aceste unelte locale. Nu crea în paralel `watch_chat` pentru aceleași conversații.

## Pregătește conversațiile lipsă

1. Verifică firma și titularul prin `verifica_conexiune`, apoi `asistenti_lista`: asistenți existenți, calculator, plafon de acces și `taskTargets.whatsappChannels`. Pe serverul local al numărului, `connection_status` și `list_chats` identifică grupurile. O conversație locală poate exista fără să fie încă partajată cu firma.
2. Dacă lipsește partajarea, caută `business_sharing_status` în catalogul **local**. Arată firmele configurate și conexiunile acestui număr. Refolosește conexiunile active și verifică cererile pending; nu selecta din nou conversațiile deja incluse.
3. Dacă versiunea locală oferă `business_sharing_prepare`, transmite `origin` din lista firmelor, `chatJids` exacte, un `requestId` UUID stabil, `allowSend`, `shareIncomingMedia` și `confirm:true` pentru mandatul deja dat. Selectează numai grupurile cerute. Pentru răspunsuri folosește `allowSend:true`; pentru prelucrarea fișierelor primite, `shareIncomingMedia:true`. Partajarea pornește de la cursorul curent, fără istoric vechi. Nu trimite mesaje de probă. La reîncercare păstrează UUID-ul și toate argumentele.
4. Rezultatul local este o cerere de partajare, nu acces activ. După înregistrarea în firmă, folosește `connect_whatsapp_partajare_preview(connectionId, brandId)` pe conexiunea POS a aceleiași firme; verifică numărul, grupurile și drepturile. Aplică `connect_whatsapp_partajare_confirma` cu `expectedConsentHash` exact, `confirmed:true` și numai persoanele autorizate. Acordul explicit din cererea inițială se reutilizează; nu cere încă o confirmare formală pentru același scop.
5. Dacă preview încă nu găsește cererea, recitește starea după sincronizare; nu genera alt UUID și nu dubla partajarea. Dacă drepturile ori identitatea diferă, rezolvă cauza înainte de aprobare. Recitește `connect_whatsapp_canale` și `asistenti_lista.taskTargets` pentru conexiunile active.

Pe versiuni fără uneltele locale, precizează lipsa exactă. Nu pretinde că există în catalogul POS și nu începe direct cu browserul. Verifică actualizarea Connect și reîncărcarea uneltelor. Browserul poate rămâne necesar pentru autentificarea titularului sau o funcție încă neexpusă, nu pentru un pas oferit deja prin MCP.

## Configurează și verifică fiecare asistent

Limita standard a fișierelor partajate și citite de asistenți este 10 MB pe fișier în versiunile care includ această extindere. Verifică versiunile live Connect și POS: instalările vechi pot aplica încă 2 MB. Nu confunda limita documentului original cu bugetul separat al previzualizărilor de imagini din răspunsul MCP. Fișierul trebuie să fie partajat cu acordul titularului și accesibil în conversația sarcinii.

Păstrează câte o identitate și participare per rol/conversație. Creează cu `asistent_creeaza`, UUID stabil și `active:false` până când ținta și accesul sunt stabilite; refolosește identitățile existente. Brandul, locația, calculatorul și capabilitățile vin din lista live, nu din primul element disponibil.

`asistent_whatsapp` primește `kind:monitor`, o singură sursă WhatsApp din `taskTargets`, aceeași destinație pentru răspuns și `sarcina.whatsapp`:

- `mode:always` când proprietarul cere răspunsuri oricărui membru la mesaje noi; `mention` când cere intervenție numai la chemare; `silent` pentru lucru fără răspuns în conversație.
- `privacy:internal` pentru echipa internă autorizată să primească datele și operațiile acordate; `privacy:customer` pentru clienți externi. Valoarea implicită este `customer`. Simplul fapt că este grup WhatsApp nu îl face intern. Setează explicit conform mandatului și păstrează valoarea la editare; alegerea nu extinde capabilitățile asistentului.
- Accesul sarcinii este cel mult accesul asistentului. `stockMode:operate` permite numai scrierile acordate; `report` le blochează.

Recitește profilul și sarcina cu `asistent_citeste`; verifică grupul, `privacy`, modul, capabilitățile, activarea și erorile. Activează numai după verificare. Distinge „configurat”, „prima rulare finalizată” și „răspuns livrat”; `queued` nu confirmă primirea pe WhatsApp. Nu declanșa o rulare sau o prezentare în grup doar ca test tehnic.

## Roluri și acces la date

„Read all” al conexiunii personale nu se transmite automat asistentului numit. Dacă plafonul live nu oferă citire SQL, acordă pachetele de citire autorizate și explică limita; nu căuta un comutator ascuns în browser și nu promite acces la întreaga bază. O întrebare fără sursă disponibilă rămâne neverificată, nu zero.

Pentru întrebări despre livrările unei fabrici, caută comenzile B2B (`list_b2b_orders`, `get_b2b_order_items`) pe perioada și aria cerute. Lista dispecerului de restaurant și comenzile Glovo/Wolt nu sunt comenzile B2B. Un rezultat gol acolo nu dovedește lipsa livrărilor fabricii. Pentru o săptămână folosește filtrele de zi disponibile, verifică totalul față de rândurile returnate și restrânge filtrele dacă lista este trunchiată. Dacă aceste citiri lipsesc din rulare, spune ce nu poți verifica.

La producție separă planul de realizarea efectivă și verifică lotul, consumul, output-ul, containerele și stocul. Nu inventa cantități, măsurători, QC sau operatori. La facturi/recepții caută documentul existent și leagă NIR-ul de el, cu toate liniile și mișcările verificate; un fișier nu justifică dublarea stocului. Folosește [productie-flux](../skills/productie-flux/SKILL.md), [gestioneaza-comenzi-b2b](../skills/gestioneaza-comenzi-b2b/SKILL.md) și [receptie-factura-furnizor](../skills/receptie-factura-furnizor/SKILL.md) după sarcina reală.
