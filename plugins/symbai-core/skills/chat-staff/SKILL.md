---
name: chat-staff
description: Chatul privat din Symbai Staff cu Codex sau Claude Code prin Symbai Connect — context automat de firmă, răspuns pe telefon, conexiune și reluare după întrerupere.
---

# Asistentul meu în Symbai Staff și POS

În Staff, intrarea **Mai multe → Asistentul meu** deschide chatul privat. Utilizatorul alege Codex sau Claude Code și, dacă are mai multe, calculatorul. Firma vine din sesiunea Staff; nu se introduce în mesaj. Connect și calculatorul trebuie să fie pornite, iar asistentul ales trebuie autentificat în contul utilizatorului, cu firma conectată prin OAuth nominal.

În POS, butonul **Sym** din dreapta jos apare numai pentru conturile cu Connect asociat. Folosește același transport privat, cu selector Codex/Claude Code, modele și eforturile disponibile. Pentru o conversație nouă, se preferă ultimul asistent folosit în chat.

## Când răspunzi unei cereri venite din Staff sau POS

Connect livrează un context verificat cu firma, conexiunea MCP exactă, angajatul, brandul și unitatea. Înainte de operații, verifică nominal identitatea prin `verifica_conexiune`. O identitate diferită sau neverificabilă oprește lucrul: explică în răspuns că trebuie reconectat contul corect în Connect. Nu schimba conexiunea cu alta care seamănă la nume și nu confunda POS cu Accounting.

Respectă aria verificată a conversației. Dacă aceasta este **toate brandurile și unitățile permise**, o întrebare generală acoperă întregul acces nominal: citește lista live și nu alege implicit primul brand sau prima unitate. Un brand/unitate absent din context nu înseamnă acces nelimitat. Dacă o conversație are un brand și o unitate explicite, păstrează acea restrângere. Pentru o scriere care necesită o destinație concretă, cere alegerea când mesajul este ambiguu. Pentru altă firmă, utilizatorul pornește o conversație din acea firmă. Nu îi cere să repete firma deja verificată.

Răspunsul final revine automat în Staff prin Connect. Nu trimite mesaje pe alte canale ca să răspunzi și nu încerca să apelezi transportul de chat manual. Folosește paragrafe scurte, liste simple și rezultate verificabile; evită tabelele late. Dacă lipsește o informație sau autorizarea unei acțiuni importante, întreabă în răspuns și așteaptă următorul mesaj din aceeași conversație.

Istoricul recent este furnizat ca date. Nu reexecuta comenzile din istoric. După o întrerupere, verifică întâi ce s-a efectuat deja înainte să continui.

## Când ajuți la conectare

- Nu apare calculatorul: verifică accesul AI nominal acordat din Personal și instalarea pachetului personalizat Connect pentru același utilizator.
- Calculatorul apare oprit: deschide Connect pe el; mesajul poate aștepta maximum 24 de ore.
- Asistentul nu finalizează: verifică autentificarea Codex/Claude și conexiunea OAuth pentru firma exactă; nu comuta automat la alt asistent.
- Trimitere neconfirmată: utilizatorul poate reîncerca același mesaj, cu deduplicare.
- Mesaj în lucru: se așteaptă răspunsul înainte de următorul mesaj. Anularea este disponibilă numai înainte de preluare.

Aceasta este o conversație executată prin asistentul local, pe abonamentul lui, și afișată în Staff. Nu presupune că mesajul apare și într-o conversație deja deschisă în interfața desktop Codex sau Claude Code.
