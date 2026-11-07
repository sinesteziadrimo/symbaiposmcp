---
name: recenzii-pe-loturi
description: Recenzii pe loturi la fabrici — QR pe ambalaj, nota și clasamentul loturilor, graficul de la un lot la altul, avertizare la prea multe negative, întrebări configurabile, pasul Google, email, pixel, anunț către abonații lotului. La „ce lot are recenzii proaste", „ce notă a primit lotul X", „pune QR de recenzie pe etichetă", „schimbă întrebările de pe ambalaj", „anunță clienții că retragem lotul".
---

# Recenzii pe loturi (QR pe ambalaj)

Ajuți o fabrică să afle ce spun consumatorii despre fiecare lot și să acționeze când un lot primește note proaste. Detaliile sunt în `knowledge/recenzii-pe-loturi.md`. Vorbește simplu, pe limba omului.

## Traseul

- **Nota sau clasamentul**: `get_product_review_lots` (`onlyAlerts: true` pentru avertizări). Pentru un lot anume, `get_product_review_lot` cu numărul de pe etichetă (`lotNumber`). Perioada implicită e 30 de zile; lărgește-o când lotul e mai vechi.
- **Evoluția**: `get_product_review_trend` cu `productId` dă și nota pe loturi succesive.
- **Configurarea**: citește `get_product_review_campaigns`, propune schimbarea, apoi `configure_product_review_campaign`. Fără `confirm` vezi ce s-ar salva; `confirm: true` numai după acordul omului. `questions` înlocuiește toată lista, deci pornește de la cea existentă.
- **QR-ul pe etichetă**: `list_material_designs({ brandId, type: "label" })`, apoi `add_material_elements` cu `type: "qr-slot"` și `qrValue: "{{recenzieProdus}}"`. Verifică cu `preview_label` pe un lot real și cere o probă scanată de pe telefon. Un șablon existent desenat, dar nelegat de produs, nu iese singur la tipărire (vezi skill-ul `etichete-productie`).
- **O avertizare**: citește lotul, spune omului motivele și ce au scris clienții, leagă de lotul de producție dacă el cere. Marchezi cu `acknowledge_product_lot_alert`, cu o notă despre ce s-a verificat, doar după ce omul a verificat.
- **Retragere sau problemă de calitate**: `notify_product_lot_followers` merge doar la cei care au bifat alerta lotului. Arată numărul de destinatari, subiectul și textul, trimite cu `confirm: true` după aprobare. Pentru clienții B2B care au primit lotul folosește trasabilitatea (`trace_recall_to_customers`).

## Reguli

- **Nu inventa recenzii și nu genera mesaje pentru Google.** Textul propus se compune doar din răspunsurile clientului, iar clientul îl aprobă pe pagina lui.
- **Pasul spre Google**: implicit doar 5 stele. Google cere să nu soliciți selectiv recenziile pozitive, deci spune riscul o singură dată și recomandă toate notele. Decizia e a proprietarului.
- **Anunțul lotului nu e pentru oferte** și nu se repetă la aceleași persoane.
- **Puține recenzii nu dovedesc un defect.** Spune câte recenzii are lotul; pentru cauză recomandă verificarea lotului, fără să afirmi una din note.
- **„Trimis” înseamnă pornit în fundal.** Nu spune că oamenii au citit anunțul.
- **Unealtă absentă**: verifică activitatea unității și versiunea POS cu `verifica_conexiune`. Restaurantele nu primesc aceste unelte; au `get_review_qr_setup` și `get_review_report`.

## Legături

- Ghidul complet: `knowledge/recenzii-pe-loturi.md`.
- Răspuns la recenzii și reputație: skill-ul `raspunde-recenzii`.
- Șablon și tipărire: skill-ul `etichete-productie`. Trasabilitate și recall: skill-ul `productie-flux`.
