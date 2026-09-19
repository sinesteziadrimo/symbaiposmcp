# Invitați, organizator și liste prin MCP

Acest flux se aplică linkurilor de colaborare Event Studio. Verifică instrumentele oferite de firma conectată: ghidul din plugin nu dovedește că actualizarea este deja instalată. Caută prin `cauta_tool` după „event studio” și acțiune; ghidul detaliat este `get_event_studio_guide(topic=collaboration)`.

## Înțelege cererea și identifică proiectul

„Pune parolă”, „lasă-l să mute mesele”, „trimite-i lista” se referă la proiectul/linkul discutat. Refolosește contextul și identificatorii verificați. Citește numai secțiunea necesară. Dacă există mai multe evenimente sau persoane cu același nume, clarifică alegerea înaintea unei trimiteri; nu ghici destinatarul.

`set_event_studio_organizer` salvează persoana din cardul CRM (`source.kind=deal`, `dealId`) sau contactul direct (`kind=contact`, `name`, `email` și/sau `phone`). Contactul direct nu necesită un card nou. Când proiectul este legat de un deal, agentul lui primește propunerile; altfel le primește agentul care a creat linkul. Configurarea nu trimite un mesaj și nu acordă consimțământ de marketing.

## Linkuri și parole

1. Citește proiectul și revizia. Configurează organizatorul dacă se cere; preia noua revizie.
2. `prepare_event_studio_collaboration` generează `id`, `token` și `revision`, fără publicare.
3. `create_event_studio_collaboration_link`: `config.mode=guests` pentru alegerea mesei sau `organizer` pentru sugestii de amenajare. Păstrează ID/token la retry.
4. Configurează variantele, emailul/telefonul obligatoriu, opțional sau ascuns, câmpurile suplimentare, `customerTag`, firma colectoare și paginile reale de termeni/confidențialitate. Nu inventa adrese juridice.
5. Pentru organizator, configurează separat mutarea/adăugarea/eliminarea meselor, ID-urile editabile, limita de mese, culorile textilelor și colecțiile de decor. Obiectele fixe și mesele ocupate rămân protejate.

Parola dictată se transmite exact în `password`, inclusiv diacritice și spații. `update_event_studio_collaboration_link` cere `version` din citirea linkului: parola omisă se păstrează, șirul gol o elimină, altă valoare o înlocuiește. Poate modifica și formularul, permisiunile și valabilitatea. Alte variante sau alt tip de acces cer un link nou. `revoke_event_studio_collaboration_link` retrage accesul fără a șterge înscrierile.

`get_event_studio_collaboration(section=links,id=...,includeUrl=true)` recuperează adresa unui link nou stocat de platformă, fără parola lui. Nu pune parole, adrese secrete sau liste nominale în memoria generală ori note CRM. Un link vechi fără secret recuperabil trebuie recreat.

## Trimitere email și WhatsApp

- Emailul firmei: `send_event_studio_email`.
- WhatsApp Business al brandului: `send_event_studio_whatsapp`.
- Emailul sau WhatsApp-ul **personal**: conexiunea personală cerută de utilizator; nu schimba expeditorul cu cel Business. Pentru un atașament folosește descărcarea de mai jos, apoi instrumentul de trimitere al conexiunii personale.

Destinatarul implicit este organizatorul salvat. `recipient` se completează numai dacă cererea indică explicit altă persoană. `target={kind:link,id:...}` trimite amenajarea/înscrierea. `confirm=false` pregătește mesajul; `confirm=true` execută cererea clară de trimitere, fără o nouă întrebare pentru același acord. Nu trimite o demonstrație sau un raport nesolicitat.

`locale=ro/en` alege limba mesajului automat; omis, urmează limba raportului sau româna pentru linkul 3D. Un `message` explicit păstrează textul cerut de utilizator.

Parola se adaugă în mesaj numai când utilizatorul cere aceasta, prin `password`; platforma verifică dacă este cea curentă. Rezultatul de previzualizare o maschează.

Fiecare trimitere are un UUID stabil. După întrerupere, refolosește-l și citește `section=deliveries,id=...`. `accepted` înseamnă acceptat de furnizor; nu declara primire sau citire confirmată. `sending`/`uncertain` nu justifică o nouă expediere. Pentru `failed`, corectează cauza și reia în scopul deja autorizat, cu un identificator nou numai după verificarea eșecului.

## Liste HTML, PDF și CSV

`get_event_studio_collaboration` citește `roster`, `registrations`, `proposals`, `organizer`, `reports` sau `deliveries`; urmează toate paginile. `registrations` include contactele, răspunsurile și acordurile; `cancelledAt` identifică înscrierile anulate. Nu distribui date de contact în lista organizatorului.

`create_event_studio_guest_report` creează un raport cu variantele alese, titlu, `locale=ro/en`, parolă opțională și valabilitate. Pagina HTML publică nu cere cont și arată lista actuală din proiect, cu descărcare PDF și tipărire. `update_event_studio_guest_report` schimbă parola/valabilitatea sau retrage pagina. Recuperarea adresei: `section=reports,id=...,includeUrl=true`.

Pentru trimitere, alege `target={kind:report,id:...,format:link}` pentru HTML protejat sau `format:pdf` pentru fișier atașat. Meta WhatsApp acceptă PDF privat; prin Twilio se poate trimite pagina protejată, iar PDF-ul se poate trimite prin email sau conexiunea personală.

`get_event_studio_guest_report_file` descarcă `pdf`, `html` sau `csv` în fragmente base64. Pornește la `offset=0`, apoi folosește `nextOffset` și aceeași `expectedSha256` până la final. Concatenează fragmentele, decodează și verifică amprenta. Dacă lista s-a schimbat, reia complet. Fișierele descărcate sunt copii fără parolă; protecția se aplică paginii publice. Nu pretinde că o copie deja trimisă poate fi retrasă.

## Propuneri și invitați

Organizatorul poate trimite singur sugestia din pagina 3D. Pentru o sugestie explicit dictată, `submit_event_studio_proposal` folosește autorul real și opțiunile permise de link. Propunerea apare ca sarcină CRM; nu se aplică automat.

Agentul citește `section=proposals`, deschide `previewUrl` și decide prin `review_event_studio_proposal` cu revizia curentă. Nu transforma o cerere de sugestie într-o aprobare implicită. La proiect schimbat, compară și pregătește un link actualizat.

`manage_event_studio_registration` mută sau anulează o înscriere, fără a modifica acordurile de marketing. Pentru invitați introduși administrativ, folosește `update_event_studio_guests`. Bifele de marketing aparțin persoanei; nu le deduce din participare și nu le inventa în numele ei.
