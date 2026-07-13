# Modificatori și opțiuni de produs

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modificatorii sunt opțiuni de personalizare care apar la comandă pentru un produs: „Bine făcut / Mediu / În sânge", „Fără ceapă", „Extra cașcaval", „Tacâmuri", „Extra carne". Îi configurezi pe **fișa produsului**, în tabul **„Modificatori"**, și apar apoi automat peste tot unde se comandă acel produs: portalul QR, magazinul online, POS-ul de la casă, aplicația ospătarilor de pe telefon și platformele de livrare (Glovo, Wolt) după sincronizarea meniului. Supraprețul unei opțiuni se adaugă automat la preț.

Sunt DIFERIȚI de „Meniul Zilei" (meniu la preț fix cu feluri) și de variantele de magazin online (mărimi/culori cu stoc propriu). Modificatorii personalizează UN produs deja ales.

## Concepte

- **Grup de opțiuni** — un set de alegeri cu un nume (ex. „Gătire", „Extra", „Mărime"). Un produs poate avea mai multe grupuri.
- **O alegere vs. mai multe** — un grup e fie „o alegere" (client alege exact una, ca la radio: în sânge / mediu / bine făcut), fie „mai multe" (bifează câte vrea, cu minim/maxim: ex. maxim 3 toppinguri).
- **Obligatoriu / opțional** — un grup obligatoriu cere clientului să aleagă înainte de a comanda (ex. gradul de gătire la un steak). Unul opțional poate fi sărit.
- **Suprapreț** — fiecare opțiune poate avea un cost în plus (ex. „Extra cașcaval +5 lei"); 0 = gratuit. Se adaugă automat la prețul liniei.
- **Preselectat (implicit)** — o opțiune bifată din start (clientul o poate schimba).
- **Două feluri de opțiune**:
  - **Notă** — doar text pentru bucătărie, fără efect pe stoc („Fără ceapă", „Bine făcut").
  - **Opțiune legată de un produs** — o legi de un produs real din inventar (ex. „Extra măsline" → produsul „Măsline"). La comandă **scade stocul din rețeta produsului legat**, exact ca și cum ai fi vândut acel produs. Și dacă produsul legat are alt TVA decât produsul principal (ex. „Tacâmuri" 21% pe o mâncare 11%), pe bonul fiscal iese pe **o linie separată, taxată corect**.
- **Șablon de modificatori** — un set de grupuri gata făcut, refolosibil (ex. „Extra-uri pizza", „Gătire carne", „Tacâmuri & ambalaj"). Îl salvezi o dată și îl aplici pe câte produse vrei deodată.

## Unde le configurezi

1. Deschide fișa produsului (din **Meniu → Prețuri Meniu**, sau caută produsul) → tabul **„Modificatori"**.
2. **Adaugă grup** → dă-i nume, alege „o alegere" sau „mai multe", marchează dacă e obligatoriu, setează min/max.
3. Pentru fiecare opțiune scrie numele și supraprețul. Ca s-o legi de un produs (consum + TVA), apasă **„Leagă produs"** și caută-l — prețul se completează din meniu, iar dacă TVA-ul diferă primești un avertisment că va apărea ca linie separată pe bon.
4. **Salvează Modificări**.

**Șabloane**: din butonul **„Șabloane"** poți salva grupurile curente ca șablon și îl poți aplica pe alte produse. Aplicarea copiază grupurile în produs (nu e o legătură vie — dacă modifici șablonul, re-aplici ca să propagi). Grupurile cu același nume se actualizează; restul grupurilor produsului rămân neatinse.

## Cum apar la vânzare

- **Portal QR / magazin online** — clientul apasă produsul → alege opțiunile → prețul se actualizează → comandă.
- **POS de la casă și aplicația ospătarilor (telefon)** — la marcarea produsului se deschide selectorul de opțiuni; ospătarul alege, prețul se ajustează, iar la bucătărie/KDS și pe bon apar și opțiunile alese.
- **Glovo / Wolt** — grupurile de modificatori se trimit ca „atribute"/„opțiuni" la sincronizarea meniului. Clientul le alege pe aplicația platformei, iar comanda intră cu opțiunile alese. (Se re-sincronizează automat când modifici modificatorii unui produs.)
- **Bon fiscal** — supraprețul e inclus în prețul liniei, cu TVA-ul produsului. Excepția: opțiunea legată de un produs cu ALT TVA apare pe linie separată cu cota corectă.
- **Stoc** — opțiunile-notă nu ating stocul; opțiunile legate de un produs scad stocul rețetei acelui produs, ca orice vânzare.

## Prin conexiune (asistent AI / MCP)

Poți gestiona modificatorii și din asistent, fără click prin taburi:
- `get_product_option_groups` — vezi modificatorii unui produs.
- `set_product_option_groups` — configurezi (înlocuiește tot; trimite toate grupurile).
- `list_option_group_templates` — vezi șabloanele.
- `save_option_group_template` — salvezi un set ca șablon.
- `apply_option_group_template` — aplici un șablon pe mai multe produse deodată.
- `delete_option_group_template` — ștergi un șablon.

Tipic: „adaugă la «Burger clasic» un grup «Extra» cu cașcaval +5, bacon +6 și un grup obligatoriu «Gătire» cu în sânge/mediu/bine făcut" → asistentul citește produsul, adaugă grupurile și salvează.

## Întrebări frecvente / capcane

- **„Opțiunea nu scade stocul"** → e o opțiune-notă (text). Dacă vrei consum, leag-o de un produs din inventar (butonul „Leagă produs") care are rețetă.
- **„Nu apar modificatorii pe Glovo/Wolt"** → verifică să fi sincronizat meniul pe canal după ce i-ai configurat (există plafoane de sincronizare pe zi la Glovo — vezi ghidul de platforme de livrare).
- **„Grupul obligatoriu nu lasă comanda"** → e normal: clientul TREBUIE să aleagă. Dacă nu vrei asta, fă grupul opțional.
- **„Vreau aceleași extra-uri pe 20 de produse"** → configurează-le o dată, salvează-le ca șablon și aplică-l pe toate cu un singur pas.
- **Diferența față de Meniul Zilei** → Meniul Zilei e un produs-meniu cu feluri la preț fix; modificatorii personalizează un produs normal deja ales. Pentru meniuri fixe cu feluri vezi ghidul Meniuri de evenimente și Meniul Zilei.
- **Diferența față de variante (magazin online)** → variantele au stoc și preț propriu per combinație (mărime/culoare); modificatorii adaugă opțiuni peste un produs, cu suprapreț.
