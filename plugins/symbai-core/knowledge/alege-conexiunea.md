# Alege conexiunea înainte să lucrezi

Symbai Connect poate oferi mai multe conexiuni aceleiași aplicații. Licența calculatorului, contul WhatsApp/email conectat, configurația asistentului, autentificarea firmei și uneltele încărcate în conversația curentă sunt verificări distincte. Un indicator verde nu le confirmă pe toate.

| Cererea utilizatorului | Conexiunea și verificarea potrivită |
|---|---|
| WhatsApp-ul meu / numărul personal | Serverul local `symbai-whatsapp` sau `symbai-whatsapp-<nume>`. Începe cu `connection_status`: verifică numărul, titularul și `whatsapp.conectat`. Apoi `search_contacts`/`list_chats`, `send_message`/`reply_to_message` din ACELAȘI server. Urmează skill-ul `raspunde-whatsapp`. |
| WhatsApp partajat cu firma | `connect_whatsapp_canale` pe conexiunea POS nominală; folosește exclusiv canalul autorizat ales. Lista nu inventariază toate numerele personale. |
| WhatsApp Business al firmei | `list_whatsapp_accounts` inventariază conturi Business. Nu folosi aceste conturi ca înlocuitor pentru numărul personal. |
| Gmail/Drive conectat local în Connect | Serverul `symbai-google`: `google_accounts` arată conturile și permisiunile oferite ACESTUI asistent; apoi folosește catalogul său live. |
| Emailurile mele Google/Microsoft din firma POS | Conexiunea POS nominală, `connect_email_status`. Conturile personale și expeditorul principal sunt separate de emailul operațional al brandului. |
| Datele firmei POS / Accounting | Confirmă firma și identitatea cu `verifica_conexiune` pentru POS, respectiv `get_connection_identity` pentru Accounting. |

## Dacă uneltele lipsesc sau asistentul spune că nu poate

1. Caută uneltele în lista/căutarea de conexiuni a aplicației, inclusiv numele serverului local. `cauta_tool` din POS caută doar catalogul acelui POS, nu serverele locale. Nu repeta căutări în toate brandurile pentru un număr personal.
2. Absența uneltelor din conversație **nu dovedește** deconectarea contului. Dacă nu poți apela verificarea live, spune „conexiunea nu este disponibilă în această conversație”, nu „WhatsApp/email este deconectat”. Verifică în panoul Symbai Connect de pe calculatorul utilizatorului și în aplicația în care lucrează efectiv: Claude Code, Claude Desktop sau Codex sunt configurări distincte; conversația din browser/cloud nu primește automat serverele locale.
3. După o conectare sau schimbare de conturi, reîncarcă legăturile MCP ori repornește aplicația asistentului, reia conversația și repetă verificarea live. Nu cere reinstalare, un pachet nou ori alt acces doar fiindcă sesiunea veche nu s-a actualizat.
4. Dacă `verifica_conexiune` arată ORGANIZAȚIE/fără angajat sau unealta întoarce `NOMINAL_EMPLOYEE_REQUIRED`, folosește conexiunea nominală existentă pentru aceeași firmă. O conexiune veche poate rămâne disponibilă alături de cea nouă. Nu încerca alt `employeeId` sau brand ca să înlocuiești identitatea. Cere acces proprietarului doar dacă lipsește efectiv accesul nominal.
5. Pentru reparare, urmează skill-ul `conecteaza-symbai`, pe baza rezultatului live. Nu deduce dintr-un 401, o listă goală sau o eroare de argumente că licența ori contul sunt revocate.

La mai multe numere/adrese, folosește identitatea cerută de utilizator și drepturile ei. Nu schimba expeditorul ca să faci trimiterea să treacă. Intenția explicită poate autoriza mesajul; conectarea unui cont singură nu autorizează trimiteri. Un rezultat în așteptare/necunoscut nu este dovada livrării: verifică înainte de repetare.
