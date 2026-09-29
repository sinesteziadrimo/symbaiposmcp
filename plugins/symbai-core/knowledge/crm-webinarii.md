# Webinarii în CRM — organizare, echipă, Sym și transmisie pe rețele

Webinariile Symbai sunt în CRM → Webinarii. Oamenii se înscriu de pe o pagină publică sau din website. Webinarul rulează live în studio, cu gazdă, prezentatori, moderatori și tehnicieni. Participanții primesc e-mailuri de confirmare, reamintiri, reluare și follow-up. Lead-urile intră în CRM.

## Activare și acces

Modulul este **oprit implicit**. Se pornește per brand din **Setări CRM → Vizibilitate → Webinarii**, sau prin MCP cu `update_crm_configuration` (`tabs.webinars: true`) dacă utilizatorul o cere. Fără activare, uneltele webinariilor răspund că modulul nu este activ; nu ocoli refuzul.

- Accesul cere dreptul de lucru în CRM și brandul potrivit.
- Poate modifica un webinar doar gazda lui, autorul sau un coordonator de vânzări.
- Conexiunea trebuie să fie nominală, a angajatului (Symbai Connect).

## Instrumente MCP

Toate cer `brandId`. Scrierile cer `operationId` UUID. La un răspuns incert, repetă exact aceleași argumente cu același `operationId`, iar pentru o schimbare nouă folosește alt UUID. Începe cu `get_webinar_guide` și citește schema live prin `cauta_tool`.

| Scop | Instrument |
| --- | --- |
| Ghid și pașii recomandați | `get_webinar_guide` |
| Lista și detaliile (setări, sesiuni, echipă, `revision`, link de înscriere) | `list_webinars`, `get_webinar` |
| Creează (ca ciornă, tu devii gazdă) | `create_webinar`: `title`, `slug`, durată, fus orar, limbă, `firstSessionAt` sau `schedule` |
| Modifică pagina, sala, e-mailurile, reluarea, CRM-ul sau publică | `update_webinar`: `expectedRevision` + `changes` doar cu ce se schimbă (secțiunile `registration`, `branding`, `room`, `notifications`, `replay`, `crm`, `sym`) |
| Sesiuni | `schedule_webinar_session`, `reschedule_webinar_session` (înscrișii primesc anunțul), `cancel_webinar_session` (`confirm: true`) |
| Echipa | `set_webinar_staff` (`host`, `presenter`, `moderator`, `technician`; invitatul extern poate fi doar prezentator), `remove_webinar_staff` (`confirm: true`) |
| Înscriși | `list_webinar_registrants`, `add_webinar_registrant`, `update_webinar_registrant` (`approve`, `cancel`, `restore`, `resend`, `unban`) |
| Rezultate | `get_webinar_analytics` |
| Asistentul Sym | `configure_webinar_sym` |
| Transmisie pe rețele | `list_webinar_stream_targets`, `update_webinar_stream_target`, `delete_webinar_stream_target` (`confirm: true`) |

Recitește webinarul după fiecare scriere. Publică (`status: "published"`) doar dacă utilizatorul a cerut publicarea.

## Sym în webinar

Sym este același asistent ca în Symbai Meet. Se configurează din CRM → webinar → fila **Sym** sau prin `configure_webinar_sym` (câmpurile omise se păstrează):

- **answer**: nu răspunde (`off`), răspunde doar la „Întrebări” (`questions`) sau și la întrebările din chat (`chat`);
- **answerVisibility**: răspuns public sau doar pentru cel care a întrebat;
- **moderate**: ascunde spamul și jignirile;
- **autoApprove**: aprobă singur mesajele în chatul cu aprobare;
- **alertHost**: îi trimite gazdei, privat, ce e important în chat;
- **coach**: sfaturi private pentru gazdă (`off`, `request`, `rare`, `often`), cu butoane către paginile Symbai potrivite;
- **listen**: ascultă scena;
- **voice**: răspunde și cu voce;
- **persona**: ton, reguli, informații și linkuri permise.

Sym lucrează doar după ce un coleg din echipă, cu Symbai Connect pe calculator, apasă **„Pornește Sym în chat”** în fila Sym a studioului. Un mesaj încă neaprobat primește cel mult un răspuns privat. În Symbai Meet, tonul și sfaturile lui Sym se aleg din setările Sym ale întâlnirii și rămân pe calculatorul organizatorului.

## Transmisie pe YouTube, Facebook, TikTok, Instagram, LinkedIn

- Se configurează în CRM → webinar → **Transmisie pe rețele**: până la 6 destinații, fiecare cu adresa serverului (`rtmp://` sau `rtmps://`) și cheia de transmisie.
- **Nu cere și nu trimite cheia de transmisie prin chat sau MCP.** Utilizatorul o introduce direct în CRM. Prin MCP poți doar activa, dezactiva, redenumi, schimba serverul sau șterge o destinație.
- Instagram și TikTok dau cheie doar conturilor eligibile, iar cheia Instagram se schimbă la fiecare live.
- Transmisia pornește din studio cu **„Transmite pe rețele”**. Fila studioului trebuie să rămână deschisă pe durata transmisiei.

Detaliile sălii live (scena, chatul, ofertele, sondajele, înregistrarea) se explică din pagina webinarului. Verifică în catalogul live disponibilitatea uneltelor pe tenant înainte de a promite o operație.
