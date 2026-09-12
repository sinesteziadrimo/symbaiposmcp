# CRM și prezentare buyer

Încarcă `get_event_studio_guide({topic:"buyer"})` numai pentru acest flux. Contextul și drepturile se verifică atât pe unitate, cât și pe oportunitatea CRM.

## Proiect pentru client

Din CRM, acțiunea „Configurații 3D” deschide Event Studio în contextul oportunității. Prin MCP, `clone_event_studio_project` copiază biblioteca unității către un `dealId` din aceeași unitate. Cere revizia sursei și un ID UUID nou pentru copia dorită; păstrează acel ID la retry.

Copierea curăță lista de invitați și notele private. Pentru un deal selectat, preia titlul, data și numărul de persoane disponibile în CRM. Mobilierul existent nu se multiplică automat; regenerează o variantă potrivită când numărul s-a schimbat. Moneda și prețurile sursei se păstrează; nu presupune conversie valutară.

Linkul `editorUrl` este pentru colegi autentificați. Pentru buyer folosește numai linkul public de prezentare, nu linkul intern din CRM.

## Pregătire și publicare

Verifică variantele, numele/descrierile spațiilor, meniul, programul și mesajul buyerului. Toate spațiile complexului sunt vizibile în prezentare, chiar dacă sunt publicate numai unele variante. Păstrează informațiile interne în câmpurile private dedicate.

1. Citește revizia și validează variantele selectate.
2. `prepare_event_studio_share({projectId})` întoarce id, token criptografic și revizie. Acest pas nu activează un link și nu salvează o prezentare.
3. `create_event_studio_share` primește aceleași valori, `scenarioIds` (1–6), `includePrices` explicit și `days` (1–90). Păstrează exact id/token la retry după un rezultat incert.
4. Deschide linkul buyer și verifică comparația variantelor, meniul, programul și navigarea. Linkul este secret de acces; nu îl copia în memoria generală sau în exemple publice.

Crearea linkului nu trimite email sau WhatsApp. Când utilizatorul cere trimiterea, folosește canalul și destinatarul verificate, respectând acordul deja dat. Nu deduce acordul de trimitere doar din cererea de amenajare a sălii.

## Ce vede buyerul

Prezentarea este o copie fixă a reviziei publicate. Nu se schimbă când un coleg modifică ulterior proiectul. Costurile interne, bugetul, notele private și numele invitaților sunt eliminate; prețurile sunt vizibile numai dacă opțiunea a fost aleasă. Textele introduse în descrieri sau în mesajul public rămân publice și trebuie revizuite ca atare.

Buyerul poate compara variante, explora spațiile și programul, vedea meniurile și lăsa feedback sau preferința pentru o variantă. Acest feedback nu reprezintă contract, rezervare hotelieră sau acceptare juridică a ofertei.

`list_event_studio_shares` citește fie `section:"shares"`, fie `section:"feedback"`, opțional pentru un link precis. Urmează paginarea. Nu poate recupera tokenul unui link pierdut. Pentru o propunere actualizată creează o prezentare nouă; `revoke_event_studio_share` retrage linkul vechi când cererea o justifică.
