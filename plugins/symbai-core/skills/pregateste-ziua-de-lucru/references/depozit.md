# Depozit, recepție și livrări

Folosește [gestioneaza-stocuri](../../gestioneaza-stocuri/SKILL.md), [receptie-factura-furnizor](../../receptie-factura-furnizor/SKILL.md) și [gestioneaza-livrari](../../gestioneaza-livrari/SKILL.md). Pentru fabrica/depozitul B2B, citește și [gestioneaza-comenzi-b2b](../../gestioneaza-comenzi-b2b/SKILL.md).

## Ce intră, ce pleacă, ce este blocat

Fixează gestiunea fizică, data și intervalul turei. Citește recepțiile așteptate, comenzile de pregătit și livrările cu termen apropiat. Arată separat marfa anunțată, recepționată, disponibilă, rezervată, pregătită și predată efectiv.

Stocul total pe firmă nu dovedește că marfa este în gestiunea de unde trebuie livrată. Un lot expirat, blocat de calitate sau deja rezervat nu este automat utilizabil. Respectă eligibilitatea și ordinea de consum ale fluxului real; nu elibera blocări pentru a completa cantitatea.

Pentru fiecare lipsă arată produsul, cantitatea/unitatea, comanda afectată și momentul necesar. Nu transforma automat marfa în tranzit în stoc disponibil și nu calcula de două ori aceeași recepție așteptată.

## Pregătește operațiunea potrivită

Marfa nouă de la furnizor urmează recepția canonică și documentul justificativ. Dacă este legată de o achiziție, folosește fluxul acelei achiziții, ca să rămână legate cantitățile și starea ei. O ajustare pozitivă nu înlocuiește recepția.

Diferențele constatate la numărătoare urmează inventarierea. Distingi lipsa constatată fizic de o cifră care pare greșită în raport. Verifici gestiunea, lotul, unitatea și calendarul consumului înainte de a propune o corecție.

Pentru pregătire și expediere, verifică produsul, lotul, cantitatea, punctul de livrare, documentele și metoda de transport. Un AWB, o etichetă sau un picking încheiat nu sunt dovada livrării către client. Citește confirmarea etapei relevante.

## Predă excepțiile clar

Achizițiile primesc lipsa și data la care materialul trebuie disponibil. Producția primește lotul/materialul și starea reală. Vânzările primesc comanda și efectul demonstrat asupra livrării. O alternativă de produs sau de lot se validează în fluxul aplicabil.

Pentru un magazioner sau șofer, rezumatul se limitează la sarcinile, gestiunile și livrările sale permise. Datele de contact necesare livrării nu se copiază într-un raport general al echipei. Finalul turei arată ce s-a confirmat, ce rămâne deschis și cine trebuie să preia fiecare excepție.
