---
name: monitorizeaza-facturi-email
description: Caută facturi în adresele personale Google sau Microsoft conectate, acum sau periodic, și le adaugă ca draft în compania cumpărătoare corectă. Folosește la „caută facturile din email”, „verifică zilnic aceste adrese și adaugă facturile”, inclusiv servicii externe care nu vin în e-Factura și mai multe companii pe același inbox.
---

# Facturile din email, în firma corectă

Transformă cererea într-un flux complet: citește documentele, verifică **cine cumpără**, importă drafturile și lasă cazurile neclare pentru verificare. Pentru conturi, unelte și programarea reală citește [emailuri-si-sarcini-personale.md](../../knowledge/emailuri-si-sarcini-personale.md).

## Stabilește sursele și destinațiile

Din `connect_email_status` selectează numai adresele cerute, cu `canRead=true`. Dacă omul spune „toate adresele mele”, folosește toate adresele lui cu citire și spune explicit care sunt. Permisiunea de trimitere nu este necesară importului. Conturile colegilor și adresa operațională a brandului nu sunt inboxuri personale disponibile automat.

Pentru fiecare conexiune Symbai autorizată, verifică utilizatorul nominal și `connect_email_firma`. Construiește harta **CUI/VAT cumpărător → conexiune tenant → brand/locație**. Lista de clienți/furnizori nu identifică firma tenantului. Dacă mai multe branduri aparțin aceleiași companii și documentul nu identifică destinația, cere regula de alocare; nu alege primul brand. Dacă firma cumpărătoare nu este accesibilă, raportează documentul ca nerutat.

## Citește și importă

1. `connect_email_cauta` pentru fiecare adresă și interval, până la ultima pagină. Caută și facturi cu subiecte „invoice”, „billing”, „receipt”, „payment”, fără să presupui că fiecare rezultat este factură.
2. Citește emailul și documentele cu `connect_email_citeste`/`connect_email_atasament`. Factura reală poate fi în corp sau atașament. Nu considera expeditorul, domeniul, adresa destinatarului ori subiectul o dovadă a cumpărătorului.
3. Verifică în secțiunea **Bill to / Sold to / Cumpărător** denumirea și identificatorul fiscal complet. Păstrează citatul exact în `buyerEvidence`. Nu confunda furnizorul cu beneficiarul, nu accepta CUI parțial și nu deduce firma doar din faptul că un coleg a redirecționat emailul.
4. Extrage numărul, data, scadența dacă există, furnizorul și țara din document, moneda, netul, TVA, totalul și toate liniile. Păstrează valuta și tratamentul fiscal afișat; nu inventa curs valutar sau TVA românesc pentru servicii externe. Reconcilierea trebuie să corespundă documentului. Tarife cu precizie nesuportată, reduceri neclare, note de credit, documente ilizibile sau incomplete merg la verificare. Nu transforma o proformă, o chitanță, un extras sau o confirmare de abonament în factură.
5. Apelează `connect_email_factura_draft` pe **tenantul cumpărătorului**, cu brandul/locația stabilite, documentul real și hash-ul returnat de unealta de citire. Pentru factura în corp folosește `documentHash` al emailului. Dacă un PDF conține mai multe facturi, tratează fiecare identitate separat. Respectă rezultatul `duplicate`/`needsReview`; nu forța reimportul.
6. Păstrează ID-ul draftului și rezultatul. Importul nu aprobă factura, nu generează NIR, nu postează note contabile, nu înregistrează plăți și nu creează furnizori. Pentru servicii nu iniția recepție fizică. Verificarea/finalizarea contabilă este un pas separat cerut de utilizator.

## O singură comandă pentru fiecare zi

La „monitorizează aceste adrese și adaugă facturile”, creează o sarcină Connect conform referinței. Obiectivul include sursele exacte, harta companiilor, regula de brand/locație și întregul flux de mai sus. Prima verificare pornește implicit de la ultimele 24 de ore față de creare; dacă omul cere facturi mai vechi, fixează intervalul cerut. Emailurile sosite cât PC-ul a fost oprit trebuie recuperate.

Reține separat: documente importate, duplicate, alte companii, documente care nu sunt facturi și documente pentru verificare. Același atașament primit pe două adrese sau redirecționat nu este o achiziție nouă. Nu abandona restul adreselor pentru că un document cere verificare; păstrează cazul și continuă citirea disponibilă.

Rezumatul pentru om: „3 drafturi în Firma A, 2 în Firma B; 4 duplicate; 1 document necesită verificarea cumpărătorului”, cu referințe reale. Fără notificare externă automată dacă nu a fost cerută. Pentru notificări periodice cerute, fixează destinatarul și canalul în obiectiv.
