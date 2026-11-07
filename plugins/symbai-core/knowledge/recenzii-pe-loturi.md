# Recenzii pe loturi (QR pe ambalajul produselor fabricate)

> Pagina și uneltele apar după actualizarea POS care le aduce și doar la unitățile cu activitate de fabrică. Pentru linkul exact folosește `gaseste_in_aplicatie("recenzii pe loturi")`.

## Pe scurt

Consumatorul scanează QR-ul de pe ambalaj, dă o notă și răspunde la întrebările alese de tine. Fiecare răspuns rămâne legat de **lotul** de pe etichetă, așa că vezi ce lot are cele mai bune sau cele mai proaste note, cum evoluează produsul de la un lot la altul și primești avertizare când un lot strânge mai multe recenzii negative decât ai stabilit.

## Unde

**Calitate & Trasabilitate → Recenzii pe loturi** (`/product-reviews`): clasamentul loturilor, graficul, detaliul fiecărui lot, avertizările și campaniile.

Consumatorul ajunge pe o pagină publică proprie lotului, fără cont și fără aplicație.

## Pune QR-ul pe etichetă

1. **Campanie activă pentru produs.** O campanie pe produse alese are prioritate față de campania generală a brandului.
2. **Slot QR în șablonul etichetei**, în Materiale Grafice. La „Conținut QR la tipărirea etichetei” pui `{{recenzieProdus}}`. Prin conexiune: `add_material_elements` cu `type: "qr-slot"` și `qrValue: "{{recenzieProdus}}"`, ori `update_material_elements` pe un slot existent.
3. **Verifică** cu `preview_label` pe un lot real, apoi tipărește o probă și scaneaz-o de pe telefon.

La tipărire QR-ul primește singur lotul etichetei. Un produs fără campanie activă iese fără QR, fără eroare. Un câmp scris greșit nu tipărește QR-ul și dă avertisment la tipărire.

## Ce poți configura

| Ce vrei | Câmp din campanie |
|---|---|
| Ce produse acoperă | `productIds` (gol = toate) |
| Titlul și mesajul | `headline`, `message` |
| Numărul și textul întrebărilor (stele, o alegere, mai multe, da/nu, 0–10, text), la ce note apar | `questions` (lista întreagă, maximum 15) |
| Ce note primesc pasul spre Google | `publicReviewEnabled`, `publicReviewRatings` |
| Fișa Google a fabricii, dacă diferă de cea a brandului | `publicLinks` |
| Lotul, data producției și expirarea afișate clientului | `showLotInfo` |
| Abonare pe email și cod promoțional | `emailCaptureEnabled`, `emailCaptureText`, `promoCode`, `promoText` |
| Bifa „anunțați-mă dacă apare o problemă cu acest lot” | `lotFollowEnabled` |
| Aplicația și website-ul | `appIosUrl`, `appAndroidUrl`, `websiteUrl` |
| Regula de avertizare | `alertNegativeMaxRating`, `alertMinNegativeCount`, `alertMinNegativeSharePct`, `alertBaselineMultiplier` |

Etichetele deja tipărite rămân valabile când schimbi întrebările: QR-ul poartă campania și lotul, iar întrebările se citesc la scanare. Dacă dezactivezi campania, QR-urile tipărite nu mai primesc recenzii.

## Clasamentul și avertizarea

- **Scorul** trage media spre media produsului cât lotul are puține recenzii, ca un lot cu o singură notă de 5 să nu urce peste unul cu 80 de recenzii bune. Nota medie rămâne afișată alături.
- **Recenzie negativă** înseamnă nota până la pragul ales (implicit 2).
- **Avertizarea** pornește la numărul ales de negative (implicit 3). Poți cere în plus un procent din recenziile lotului și o comparație cu celelalte loturi ale produsului.
- După ce marchezi avertizarea ca văzută, anunțul către manageri pleacă din nou abia la încă atâtea recenzii negative câte cere regula.

## Pasul spre Google și textul propus

Google nu permite precompletarea textului, așa că pagina copiază textul propus, iar clientul îl lipește. Textul se compune **doar din răspunsurile clientului**, cu altă formulare de la un client la altul, și clientul îl poate modifica înainte. Nu există o listă de mesaje generate: un text care nu vine de la client ar fi o recenzie falsă.

Notele care primesc pasul se aleg în campanie; implicit doar 5 stele. Google cere să nu soliciți selectiv recenziile pozitive, deci varianta sigură este să bifezi toate notele. Decizia aparține proprietarului: spune-i riscul o singură dată, apoi respectă alegerea lui. Abonarea pe email și codul promoțional apar oricui, indiferent de notă.

## Email, alerta lotului, pixel

- **Oferte pe email**: acord explicit, separat de recenzie. Intră la clienți, cu acordul înregistrat.
- **Alerta lotului**: acord separat, folosit numai pentru anunțurile despre acel lot. Cine a cerut doar alerta nu primește oferte.
- **Pixelul Facebook/Meta**: pagina folosește pixelul brandului, setat la tagurile de marketing ale website-ului, și îl încarcă numai după acordul pentru cookie-uri. Din el poți crea audiențe de retargetare.

## Unelte

| Cererea | Unealta |
|---|---|
| „Ce lot are cele mai proaste recenzii”, „care loturi au avertizare” | `get_product_review_lots` |
| „Ce notă a primit lotul L-…”, „câți au scanat QR-ul” | `get_product_review_lot` (`lotNumber` de pe etichetă sau `lotId`) |
| „Cum evoluează nota de la un lot la altul”, „a scăzut calitatea” | `get_product_review_trend` |
| „Cum e setată recenzia de pe ambalaj” | `get_product_review_campaigns` |
| „Schimbă întrebările”, „doar 5 stele pe Google”, „prag de avertizare” | `configure_product_review_campaign` 🔒 |
| „Am verificat lotul, marchează avertizarea” | `acknowledge_product_lot_alert` 🔒 |
| „Anunță abonații lotului că îl retragem” | `notify_product_lot_followers` 🔒 |

Uneltele 🔒 arată întâi o previzualizare și scriu abia cu `confirm: true`, după acordul omului.

## Drepturi

- **Citire**: Vizualizare sau Gestionare Feedback, acces la setări, Vizualizare sau Gestionare producție, drepturi de calitate.
- **Campanii**: Gestionare Feedback, acces la setări sau Gestionare producție.
- **Avertizare și anunțul lotului**: cele de la campanii, plus drepturile de calitate.

Aria brandului și a locației se aplică la fel ca în pagină: un cont limitat vede doar loturile din depozitele lui.

## Capcane

- **Trei QR-uri diferite.** QR-ul de verificare de pe recipient (`set_label_qr`) e pentru operatori. QR-ul de la masă sau de pe nota de plată (`get_review_qr_setup`) e al restaurantului. QR-ul de pe ambalaj e cel din acest ghid.
- **Anunțul lotului nu e recall.** Merge doar la cei care au bifat alerta pe pagina de recenzie. Clienții B2B care au primit lotul se găsesc prin trasabilitate și retragere (`trace_recall_to_customers`, `build_recall_report`).
- **Anunțul lotului nu e canal de oferte.** Același text nu ajunge de două ori la aceeași persoană, nici la un apel repetat.
- **Trimis nu înseamnă livrat.** Anunțul pleacă în fundal; rezultatul spune câți destinatari au intrat la trimitere.
- **Un număr de lot poate apărea la mai multe loturi** (depozite diferite). Unealta îți dă lista; alege `lotId`, nu ghici.
- **Răspunsul la o recenzie de pe ambalaj** se face din aceeași listă ca recenziile locale (`list_local_reviews`, `reply_to_local_review`) și ajunge la client doar dacă a lăsat un contact.

## Legături

- Skill: `recenzii-pe-loturi`. Recenzii de la masă, Google, platforme: `recenzii.md` și skill-ul `raspunde-recenzii`.
- Etichete: `etichete-productie.md`. Trasabilitate și recall: `productie-fabrica.md`. Consimțământ: `gdpr-clienti-oaspeti.md`.
