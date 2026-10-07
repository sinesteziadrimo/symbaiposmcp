# Comenzi la telefon: memoria clientului, telefonul de comenzi și dispecerul comun

> Linkul exact al unei pagini îl dă `gaseste_in_aplicatie`. Verifică uneltele în catalogul conexiunii: POS-ul și platforma de livrare a pieței sunt conexiuni separate.

## Pe scurt

Symbai ține minte fiecare client de livrare după numărul de telefon. Intră în memorie comenzile de pe site, cele de pe platforma proprie și cele notate la telefon. Când clientul sună din nou, operatorul îi vede numele, adresele la care i s-a livrat, ultima comandă și comanda în curs. Poate nota comanda din câteva atingeri.

Pentru o franciză cu **un singur număr de telefon și un singur site** (o piață de livrări cu mai multe firme, de exemplu Zon Lime și Datozo pe piața „zone”), comanda luată la telefon se notează **pe site-ul pieței, în mod dispecer**. Rutarea pieței alege restaurantul după adresă, ca la o comandă pusă de client.

## Memoria clientului

- **Recunoașterea** se face pe ultimele 9 cifre: „0722 123 456”, „0722123456” și „+40722123456” sunt același client.
- **Agenda de adrese** păstrează fiecare adresă livrată o singură dată, cu etaj, interfon și indicații. Cea mai recentă apare prima și are numărul de livrări la ea.
- **Sursele** sunt fișa clientului, comenzile de livrare legate de fișă, comenzile mai vechi care au doar telefonul pe ele și adresele salvate de magazinul online.
- **Fiecare comandă nouă notată la telefon** creează sau completează fișa clientului și adaugă adresa în agendă. Nu e nevoie de un pas separat de „salvează clientul”.
- **Scope pe brand**: un client al unui brand nu apare la alt brand al firmei.
- **Marcajele** „VIP” și „nu livra” vin din etichetele fișei clientului din CRM.
- **„Uită-mă” (GDPR)** din CRM șterge și agenda de adrese.

## Centrul de Comenzi (POS → Livrări)

- „Comandă nouă” începe cu **telefonul**. La un număr cunoscut se completează singure numele și ultima adresă, iar panoul clientului arată adresele și ultimele comenzi.
- **„Repetă ultima comandă”** pune aceleași produse și aceiași modificatori, la **prețurile de azi** din meniul canalului. Produsele care nu mai sunt în meniu, cele din meniul zilei și liniile ale căror opțiuni nu mai pot fi identificate nu se adaugă. Operatorul vede lista lor și îl întreabă pe client.
- Butonul **Apeluri** arată apelurile telefonului de comenzi. Un apel fără comandă după el apare ca pierdut, de sunat înapoi.
- Fereastra de apel are butoanele **„Notează comanda”** (local), iar pe o piață comună **„Comandă pe <piață>”** și **„Comandă doar la noi”**.

## Symbai Staff pe telefonul de comenzi

Configurare, o singură dată pe telefonul firmei:

1. Telefon Android 10 sau mai nou, cu Symbai Staff actualizat. Te loghezi cu angajatul dispecer.
2. Rolul angajatului are „Creare comenzi” și acces la Livrări (vizualizare sau gestionare).
3. **Profil → Setări → „Telefon de comenzi”** → pornești comutatorul.
4. În fereastra Android alegi Symbai Staff ca **aplicație de identificare a apelantului** și permiți notificările.
5. **Nu salva clienții în agenda telefonului.** Android arată aplicației doar numerele care nu sunt în agendă.

La fiecare apel, pe telefon apare „Sună un client” cu numele și ultima adresă. Pe calculatorul din Centrul de Comenzi se deschide fereastra de apel. Atingerea notificării deschide comanda pentru acel număr.

Aplicația nu citește jurnalul de apeluri și nu are acces la conversații. Primește doar numărul care sună, prin rolul de identificare a apelantului.

## Piața comună: dispecer pentru mai multe firme

Fluxul dispecerului:

1. Clientul sună. Dispecerul apasă **„Comandă pe <piață>”** în POS sau **„Notează pe <piață>”** în Symbai Staff.
2. Se deschide site-ul pieței în **mod dispecer**, cu telefonul și numele completate. Bara de sus arată numele dispecerului.
3. **Client cunoscut**: dispecerul alege adresa lui sau apasă „Repetă comanda”. **Client nou**: „Adresa clientului”, iar adresa se caută pe hartă.
4. Alege produsele ca pe site → Finalizare. Îi spune clientului restaurantul care gătește și totalul, bifează confirmarea verbală, alege plata la livrare și trimite.
5. Comanda intră automat la restaurantul ales, cu mențiunea **„Comandă telefonică · <dispecer>”**. Codul comenzii apare în bară. „Apel nou” golește formularul pentru următorul client.

Ce face diferit modul dispecer:

- Nu bifează acordul de marketing în numele clientului.
- Nu raportează comanda ca vânzare de pe site către platformele de publicitate.
- Nu păstrează adresele clientului în browserul dispecerului.

Despre sesiune:

- Sesiunea ține **12 ore**. O bară roșie înseamnă sesiune expirată: dispecerul redeschide „Comandă pe <piață>” din POS.
- Doar firmele trecute în dispeceratul pieței primesc sesiune. Lista se setează cu `deliveryapp_set_dispatch_policy` (`phoneOrderTenantIds`), apoi se publică configurația pieței.
- **„Comandă doar la noi”** păstrează comanda la unitatea care răspunde, fără rutare. E excepție, nu fluxul normal.

## Unelte MCP

**POS (conexiunea firmei):**

| Cererea | Unealta |
|---|---|
| „cine e 0722…”, „unde i-am livrat”, „ce a comandat ultima dată”, „are o comandă pe drum?” | `get_delivery_customer(phone \| customerId, brandId?, locationId?)` — citire |
| „cine a sunat și n-a comandat”, „pe cine sun înapoi” | `list_delivery_calls(hours?, onlyMissed?)` — citire, doar apelurile telefonului de comenzi |
| „scoate adresa greșită a clientului” | `forget_delivery_customer_address(addressId, confirm)` — modul `livrari`, confirm-first; comenzile vechi rămân |
| „suntem pe o piață comună?”, „unde notez comanda de la telefon?” | `get_market_phone_ordering` — citire |
| „notează o comandă rapidă la telefon” (flotă proprie) | `create_quick_delivery_order` — modul `livrari`; clientul se leagă după telefon |

**Platforma de livrare a pieței (conexiune separată, modul `deliveryapp_ops`):**

- `deliveryapp_find_customer_by_phone(marketSlug, phone)` arată clientul pieței din toate restaurantele ei: adrese, comanda în curs și ultimele comenzi.
- `deliveryapp_set_dispatch_policy` stabilește ce firme au dispecerat telefonic (`phoneOrderTenantIds`). Publicarea configurației pieței e un pas separat.
- `deliveryapp_issue_dispatcher_session` e folosită de Hub când POS-ul deschide modul dispecer. Nu o apela pentru un client din chat.

## Capcane

- **Telefonul nu arată cine sună.** Verifică în ordine:
  - numărul e salvat în agenda telefonului;
  - comutatorul „Telefon de comenzi” e oprit;
  - Symbai Staff nu e aplicația de identificare a apelantului;
  - notificările sunt blocate;
  - Android e mai vechi de versiunea 10;
  - rolul angajatului nu are Livrări.
- **„Piața nu are dispecerat telefonic”**: firma nu e în `phoneOrderTenantIds` sau configurația pieței nu a fost publicată.
- **Site-ul pieței nu se deschide din POS**: browserul blochează ferestrele pop-up pentru POS. Permite-le o dată.
- **Clientul are o adresă greșită pusă prima**: `get_delivery_customer` → id-ul adresei → `forget_delivery_customer_address` cu acordul userului.
- **Datele clientului sunt personale.** Le arăți doar celor care lucrează la livrări și nu le trimiți pe alte canale.
