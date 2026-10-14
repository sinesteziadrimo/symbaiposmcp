# Asistentul de oferte: email → ofertă → acordul proprietarului pe WhatsApp

Citește la: „vreau un asistent care să-mi răspundă la cererile de ofertă din email”, „să-mi propună răspunsul pe WhatsApp și să trimită după ce aprob”, „să facă ofertele de catering singur”, „să negocieze cu clientul cu acordul meu”. Modelul vine dintr-o simulare de catering în care proprietarul a fost foarte mulțumit de rezultat: asistentul a citit emailurile, a scris în stilul clientului, a înțeles negocierea și a dus oferta până la confirmare.

## Cum se configurează

Un asistent numit (de exemplu „asistenta de catering”) cu două sarcini, ambele din exemplele **Asistenții mei → Sarcini**:

| Sarcina | Exemplul | Ce face | Acces |
|---|---|---|---|
| Emailurile | „Cereri de ofertă din email” | Monitor pe adresa proprietarului. Face oportunitatea direct, apoi trimite pe grup emailul primit și un răspuns scurt propus. Nu trimite emailuri. | `email.read`, `whatsapp.read`, `crm.read`, modulul „Marketing & CRM” (Modifică), rezervări (Citește); livrare pe grupul WhatsApp al proprietarului |
| Acordurile | „Oferte aprobate pe WhatsApp” | Pe grupul proprietarului: recomandă variante, face pachetele și ofertele, trimite emailurile aprobate, marchează ofertele, confirmă evenimentul. | plus `email.send`, `sales.close` (starea ofertei și oferta principală), rezervări (Modifică), „Produse & Meniuri” (Modifică), rețete, stoc și producție (Citește) |

- Grupul WhatsApp: unul în care este doar proprietarul (sau echipa de încredere), partajat cu firma prin Connect. Pe versiunile noi, a doua sarcină poate fi o **participare WhatsApp** internă, cu „Reacționează și la mesajele mele” și „Poate folosi emailul meu în această conversație” bifate. Pe versiunile vechi, participarea refuză emailul proprietarului; atunci folosește sarcina independentă, cu sursa pe același grup și mesajele proprietarului incluse.
- Pachetele `sales.*` ale echipei AI de vânzări nu deschid uneltele de oportunitate și ofertă: acestea vin din modulul CRM. La trimitere, `connect_email_trimite` cu `markQuotesSent:true` marchează ofertele atașate ca trimise în aceeași operație.
- Completează **Setările proprietarului** din instrucțiuni: brandul, expeditorii urmăriți, intervalul de food cost, valabilitatea și avansul, semnătura.
- Pornește întâi o simulare: „clientul” este a doua adresă a proprietarului. Simularea arată ce merge înainte de un client real.

## Ce a mers (păstrează)

- **Emailuri scrise ca de om.** Persoana întâi, din partea proprietarului, 3–5 propoziții calde, cu vorbele clientului („mușchi de vită în locul curcanului”), semnate simplu. Fără liste, termeni interni sau pomenirea asistentului.
- **Întâi răspunsul rapid, apoi oferta.** La orice email: un răspuns scurt că mesajul a fost citit și ce urmează. Oferta vine după, separat.
- **Emailul clientului întreg, înaintea răspunsului propus.** Proprietarul decide fără să deschidă inboxul.
- **Blocuri fixe.** „EMAIL DE TRIMIS” cu Către/Subiect/Atașamente/Text și `ref. email <id>`. Așa „ok, trimite” are o țintă clară, iar dublurile se evită.
- **Mesaje scurte pe grup**, de cel mult 6–8 rânduri. Detaliile doar la cerere („dă-mi variantele întregi”).
- **Variantele: exact câte a cerut clientul.** Fiecare are prețul cu și fără TVA, food cost-ul din rețete (lei și procent), motivul (ce stoc folosește) și ce trebuie cumpărat.
- **Negocierea.** La o contrapropunere de tipul „scoate două gustări și dă-l cu 160 cu TVA”, asistentul calculează 2–3 variante cu food cost și recomandă una. La o cerere de reducere întreabă proprietarul, apoi scrie decizia lui cald, de exemplu refuz politicos plus 10% la următoarea colaborare.
- **Interpretări spuse explicit.** La „1 desert” când desertul are trei prăjituri, a scos una și a spus asta într-un rând.

## Ce a corectat proprietarul (aplică de la început)

1. **Food cost-ul are un interval** (de exemplu 20–30% din prețul fără TVA). Prima propunere avea 12–19%, adică prețuri prea mari față de cost. Prețul se propune din interval.
2. **Bugetul clientului se umple cu valoare.** Când prețul din interval iese mult sub buget, asistentul adaugă gustări, salate sau desert până la buget, în loc să coboare prețul.
3. **Nicio sarcină în aplicație pentru proprietar.** Ofertele trimise se marchează trimise înainte de PDF, ca să plece fără marcajul de ciornă. Alegerea clientului devine oferta acceptată și principală, iar evenimentul se confirmă. Toate le face asistentul (`set_sales_quote_status`, `set_primary_sales_quote`; vezi [catering cap-coadă](catering-evenimente-cap-coada.md)). Cât timp unealta nu există în catalog, asistentul spune într-un rând ce pas nu poate face, o singură dată.
4. **Confirmarea pe email ajunge.** Clientului nu i se cere să mai confirme pe link. După trimiterea răspunsului aprobat se marchează acceptarea. Previzualizarea (meniul confirmat, loturile bucătăriei) se pune în propunerea pe care o aprobă proprietarul.
5. **Avansul se scrie exact:** suma (procent × totalul ofertei) și data limită. Datele de plată se cer o singură dată.
6. **Mesajele corectate.** Proprietarul își corectează des cifrele prin editare. Asistentul lucrează pe ultima versiune, iar un mesaj șters nu se execută. Pe versiunile vechi, Connect nu transmitea editările: confirmă cifrele importante înainte de o ofertă.

## Capcane tehnice întâlnite

- **Clientul nou cu telefonul proprietarului.** `create_deal` cu `newCustomer` refolosește clientul existent cu același telefon sau email. Citește de ce client s-a legat oportunitatea și spune dacă diferă numele.
- **Meniu acceptat cu preparate fără lot.** Pachetul completat după crearea evenimentului ajungea la bucătărie doar parțial (de exemplu 5 loturi din 15). Leagă preparatele de produse cu rețetă înainte de trimiterea ofertei. Pe versiunile noi, răspunsul acceptării numește preparatele fără lot și pe oportunitate apare o sarcină: spune-i proprietarului într-un rând. Reîncarcă meniul evenimentului (`refreshSnapshot:true`) doar dacă clientul a primit varianta actuală.
- **Asistent restrâns la un brand.** Pe versiunile vechi, `list_event_menus`/`get_event_menu` erau refuzate în aria restrânsă. Pe cele noi se citesc pachetele brandului, inclusiv cele fără unitate.
- **Mesajele trimise de asistent** apar pe grup ca trimise de pe numărul proprietarului. Instrucțiunile le recunosc după marcaje („📩”, „✅”, blocurile de email), ca să nu fie luate drept acorduri. Pe versiunile noi, trimiterile automate nu mai pornesc participarea nici dacă conțin @numele.
- **Monitorul de email** pornește de la mesajele de după salvare. Un email sosit înainte se ia cu o rulare manuală.
- **PDF-ul ofertei de meniu.** Pe versiunile noi, termenii scurți și încheierea rămân pe pagina meniului, fără o a doua pagină aproape goală.

## Vezi și

- [catering-evenimente-cap-coada.md](catering-evenimente-cap-coada.md): uneltele fiecărui pas, de la oportunitate la încasare.
- [asistenti-whatsapp-configurare.md](asistenti-whatsapp-configurare.md): partajarea grupului și participarea.
- [emailuri-si-sarcini-personale.md](emailuri-si-sarcini-personale.md): conturile de email.
