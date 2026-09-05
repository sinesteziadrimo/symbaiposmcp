---
name: preia-comanda-client
description: Citește o comandă primită de la un client (PDF pe email, poză sau mesaj pe WhatsApp, EDI, text dictat) și o introduce în sistem, corect și rapid. La „am primit o comandă", „bagă comanda asta", „mi-a trimis Kaufland comanda", „introdu comanda de la Mega", „ce a comandat clientul X", „au cerut pe WhatsApp 10 baxuri". Pentru ce urmează după introducere (planificare producție, picking, aviz, factură) → gestioneaza-comenzi-b2b.
---

# Preia comanda unui client — de pe orice canal, în sistem, fără greșeli de cantitate

Utilizatorul primește comenzi în zeci de formate și le introduce manual, linie cu linie. Tu faci
asta în două minute: citești documentul, arăți exact ce ai înțeles, iar după DA-ul lui introduci
comanda. Nu ești un parser: ești colegul care verifică înainte să scrie.

## Înainte de orice
1. Citește **`knowledge/preluare-comenzi-clienti.md`** — formatele reale, capcana baxurilor,
   ordinea de recunoaștere a produsului, ce reține sistemul. Fără el vei ghici lucruri care nu se
   ghicesc. Citește și **`knowledge/agent-operare-avansata.md`** (confirm-first, verificare prin
   re-citire).
2. **Regula de aur: preview întâi, întotdeauna.** `preview_b2b_customer_order` nu scrie nimic.
   Arăți rezultatul, ceri DA-ul, abia apoi `import_b2b_customer_order` cu `confirm: true`.
3. Nu inventa. Nu completa cantități, prețuri sau produse care nu sunt pe document.

## Pasul 1 — adu documentul la text

| De unde vine | Ce faci |
|---|---|
| PDF/poză atașată în conversație | citește fișierul direct (Read) |
| poză sau document pe WhatsApp | `download_media`, apoi Read pe fișierul descărcat |
| mesaj vocal | `transcribe_voice_message` |
| text scris în chat | îl folosești ca atare |
| email | textul mesajului + atașamentele |

Extrage **exact ce scrie**, fără să interpretezi: numărul comenzii, data livrării, firma (nume,
CUI, GLN), punctul de livrare (nume, adresă, GLN, cod), și pentru fiecare linie: poziția, codul
articolului la client, EAN-ul, codul tău dacă apare, denumirea **copiată literal**, cantitatea (cu
unitatea ei), câte bucăți intră într-un bax dacă scrie, prețul unitar.

> Denumirea se copiază, nu se „curăță". `ARCA FRESH ECLER CR AR VANILIE2X90G` trimis așa cum e se
> potrivește; „corectat" de tine în „Ecler cu vanilie" pierde gramajul și devine ambiguu.

## Pasul 2 — preview

```
preview_b2b_customer_order({
  client: { name: "…", taxId: "…", gln: "…" },        // ce scrie pe document
  deliveryPoint: { name: "…", address: "…", gln: "…", code: "…" },
  deliveryDate: "2026-09-04",                          // termenul cerut
  customerPoNumber: "4310929563",                      // numărul comenzii LUI
  lines: [ { lineNo, customerCode, ean, supplierCode, description,
             quantityBax, quantityBuc, unitsPerCase, unitPrice } ]
})
```

Dacă utilizatorul a spus deja despre ce client e vorba, trimite `clientId` — e mai sigur decât
orice potrivire pe nume.

## Pasul 3 — arată-i omului ce ai înțeles

Un tabel scurt, în limba lui, cu: firma, punctul de livrare, data, și pe fiecare linie produsul
recunoscut + cantitatea în baxuri și bucăți. Apoi, separat și pe scurt, **ce nu e în regulă**:

| Ce-ți spune preview-ul | Ce spui tu utilizatorului | Cum se rezolvă |
|---|---|---|
| linie fără produs potrivit, cu candidați | „La linia 3 nu sunt sigur: e X sau Y?" | omul alege → retrimiți linia cu `clientProductId` |
| linie fără niciun candidat | „Produsul Z nu e în contractul clientului" | `create_b2b_client_product` (după ce afli prețul convenit) |
| conflict de ambalare | „Documentul spune 8 buc/bax, la noi e 12. 28 de baxuri înseamnă 224 sau 336 de bucăți?" | `set_b2b_packaging` dacă la noi e greșit, sau cantitatea în bucăți |
| mărimea baxului necunoscută | „Câte bucăți intră într-un bax la produsul X?" | `set_b2b_packaging` |
| preț diferit de contract | „Pe comandă e 8,98, în contract 8,43 — factura pleacă cu 8,43. E ok?" | `update_b2b_client_product` sau `acceptDocumentPrices: true` |
| punctul de livrare neidentificat | „Nu am depozitul «WH POPESTI FRESH». Îl creez?" | `create_b2b_client_depot`, apoi reiei |
| mai există comandă cu același număr | „Comanda 4310929563 pare deja introdusă (#3027)" | verifici; dacă e alta, `allowDuplicatePo: true` |
| firma fără catalog / duplicat | „Firma asta apare de două ori; cea cu produse e #7" | trimiți `clientId` corect |

Nu turna toate avertismentele într-o listă lungă. Spune întâi ce e **blocant**, apoi ce e doar de
știut.

## Pasul 4 — importă

După DA, exact aceleași linii plus `confirm: true` (și eventualele corecturi decise):

```
import_b2b_customer_order({ …, confirm: true, documentSource: "whatsapp" | "email" | "pdf" })
```

Importul **refuză** o comandă cu linii nerezolvate — nu introduce nimic parțial. Când reușește,
comanda intră ca **ciornă**, iar codurile și denumirile clientului rămân învățate: la comanda
următoare aceleași linii se potrivesc singure.

## Pasul 5 — confirmă și spune ce urmează

Verifică prin re-citire (`list_b2b_orders` sau `get_b2b_order_items`), apoi un mesaj scurt: comanda
#N pentru clientul X, N linii, total, data livrării. Și pasul următor, dacă e cazul: confirmarea
comenzii, planificarea producției (`plan_b2b_order`), pregătirea. Nu le face din proprie inițiativă.

## Reguli

- **Preview → DA → import.** Fără excepție, oricât de simplă pare comanda.
- **O comandă parțial înțeleasă nu se introduce.** Mai bine o întrebare acum decât marfă lipsă la
  livrare.
- **Cantitatea fără unitate nu există.** Dacă documentul zice „10" și nu se știe dacă e baxuri sau
  bucăți, întrebi.
- **Nu confirma tu mărimea baxului** pentru că „așa scrie pe document". Documentul poate fi vechi;
  confirmarea e afirmația unui om și rămâne pentru totdeauna.
- **Prețul din contract e cel care se facturează.** Diferența se semnalează, nu se ascunde.
- **Nu crea produse ca să iasă comanda.** Un produs necontractat nu are preț convenit.
- **Nu duce comanda mai departe** de ciornă fără să ți se ceară.
- **Limbaj de business.** „am pus comanda în sistem", nu „am creat b2b_order cu 6 items".

## Când comanda vine pe WhatsApp

Aceleași reguli, dar cu două particularități: mesajele sunt scurte și incomplete, iar omul așteaptă
un răspuns pe fir. Practic:

1. Adună din conversație tot ce ține de comandă (inclusiv mesajele anterioare: „ca data trecută").
2. Ce lipsește și nu poate fi dedus — data livrării, punctul, cantitatea în baxuri sau bucăți —
   întrebi **o singură dată**, scurt, exact ce lipsește.
3. Rulează preview, iar dacă totul e clar, rezumă în două rânduri și cere confirmarea pe WhatsApp.
4. După import, confirmi scurt: ce ai introdus și pentru ce dată.

Nu introduce o comandă pe baza unui mesaj ambiguu doar ca să nu mai întrebi.

## Ce nu se poate prin conexiune

Ștergerea unei comenzi introduse greșit (se anulează: `update_b2b_order` cu starea „anulată") și
modificarea liniilor unei comenzi deja avizate sau facturate. Pentru corecții după facturare, vezi
`knowledge/finante-facturare-contabilitate.md`.

## Legături

- Concepte, formate, capcane → `knowledge/preluare-comenzi-clienti.md`
- Ce urmează după introducere (confirmare, producție, picking, rute, aviz, factură) →
  skill `gestioneaza-comenzi-b2b` + `knowledge/b2b-comenzi-wholesale.md`
- Comenzi CĂTRE furnizori (aprovizionare) → skill `comanda-furnizor`
- Livrare, rute, rampe → `knowledge/livrari-b2b-dispecerat.md`
