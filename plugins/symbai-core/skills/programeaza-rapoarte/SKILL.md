---
name: programeaza-rapoarte
description: Pregătește și programează rapoarte Symbai trimise periodic pe WhatsApp sau email, pentru una sau mai multe firme. Folosește la „trimite-mi zilnic raportul”, „luni vreau P&L-ul pe email”, „raport de vânzări pe WhatsApp”, schimbarea programului, destinatarilor sau conținutului.
---

# Rapoarte care ajung când ai nevoie

Citește [emailuri-si-sarcini-personale.md](../../knowledge/emailuri-si-sarcini-personale.md) pentru expeditori, unelte și programarea Connect. Alege conținutul împreună cu utilizatorul, apoi scrie un obiectiv autonom pe care executorul îl poate urma fără această conversație.

## Definește raportul

Din cerere identifică firmele/brandurile, indicatorii, perioada raportată, frecvența, canalul și destinatarii. Perioada raportului este distinctă de perioada de verificare a inboxului: „luni raportul săptămânii trecute” înseamnă săptămâna calendaristică încheiată în fusul firmei. Întreabă numai ce lipsește și schimbă rezultatul. Verifică identitatea fiecărui tenant înainte să combini date sau să programezi livrări.

Folosește skill-ul potrivit raportului: `rapoarte-preturi` pentru vânzări/P&L/marje, `briefing-business` pentru briefing, `masoara-marketing` pentru marketing, celelalte skill-uri de business pentru stoc, personal sau operațiuni. Descoperă uneltele live și construiește o mostră cu date reale înainte de programare, în conversație. O cerere explicită de trimitere recurentă autorizează livrările descrise; nu cere acord în fiecare perioadă și nu trimite imediat o mostră externă dacă nu a fost cerută.

## Contractul unei livrări

Obiectivul programat precizează:

- Compania, brandurile/locațiile autorizate și sursele de date, cu numele uneltelor live verificate.
- Indicatorii și definițiile lor: încasări versus vânzări, TVA inclus/exclus, cheltuieli contabilizate versus estimate. Nu prezenta facturile draft ca datorii aprobate sau P&L închis.
- Perioada exactă calculată la fiecare rulare, fusul și comparația cerută. Pentru o rulare întârziată, raportează perioada care corespunde obiectivului și spune data efectivă; nu amesteca săptămâni sau luni.
- Forma: pe WhatsApp un rezumat cu cifrele principale și acțiunile; pe email un subiect și corp lizibil. Atașamente doar când uneltele disponibile chiar le pot produce și trimite. Separă companiile și monedele; nu însuma EUR cu RON fără metodă explicită.
- Destinatarii autorizați și expeditorul. Email: propria principală cu `canSend=true`, sau adresa personală cerută explicit. WhatsApp: conversația verificată. Nu folosi emailul unui coleg ori expeditorul operațional al brandului ca fallback.
- O cheie de livrare pentru sarcină + companie + perioadă + destinatar, păstrată în checkpoint. Fără duplicarea raportului la retry sau restart. Dacă sursa esențială lipsește, raportul este incomplet și explică lipsa; cifrele absente nu devin zero.

## Programează și urmărește

Verifică `routine_connections` și `list_routines`, apoi `schedule_routine` cu executorul ales și programul concret. Pentru modificări trimite specificația completă cu `update_routine`, păstrând preferințele neschimbate. Confirmă următoarea rulare prin recitire și explică o singură dată că PC-ul și Connect trebuie să rămână pornite.

La fiecare execuție, citește datele actuale și validează totalurile înainte de trimitere. Un email acceptat de furnizor nu este dovadă de livrare. Incertitudinea de trimitere oprește reluarea automată până la verificare; folosește `routine_activity` și referințele păstrate. În rezumat spune perioada, firmele, destinatarii și rezultatul efectiv, fără date financiare ale altui tenant.
