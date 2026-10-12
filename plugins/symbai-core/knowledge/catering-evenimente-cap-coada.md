# Catering și evenimente cap-coadă (prin asistent)

Citește la: „ofertă de catering”, „nuntă / petrecere / eveniment corporate de la cerere până la factură”, „atașează meniul pe eveniment”, „numărul final de persoane”, „degustare”, „ce trebuie produs pentru evenimente”, „scoate la bufet”, „încasează evenimentul”. Schemele live au prioritate: dacă o unealtă de mai jos lipsește din catalog, caut-o cu `cauta_tool` și verifică drepturile cu `verifica_conexiune`.

## Ordinea fluxului

| Pas | Unealta | Ce verifici după |
|---|---|---|
| 1. Cererea | `create_deal` (data evenimentului, persoane, tipul de eveniment al brandului) → `advance_deal` (client, etapă) | Tipul de eveniment trebuie să fie unul configurat pe brand; un tip necunoscut e refuzat cu lista celor valide. Clientul se poate adăuga și după creare (`customerId` sau `newCustomer`). |
| 2. Oferta | `create_sales_quote_draft` / `update_sales_quote_draft` | Linia „pe persoană” se leagă de un pachet din Meniu Evenimente (`eventMenuId`): așa ajung preparatele la bucătărie. Anexa ofertei e doar text pentru client. Citește avertismentele din răspuns (TVA diferit de produs, preț pe persoană). |
| 3. Trimisă / acceptată | `publish_sales_quote_link`, `get_sales_quote_pdf`, `set_sales_quote_status`, `set_primary_sales_quote` | Previzualizează întâi; acceptarea ofertei principale copiază liniile pe eveniment și confirmă meniul legat. Marchează oferta trimisă înainte de PDF (altfel pleacă marcată ciornă). Confirmarea clientului pe email sau la telefon ajunge: nu îi cere și confirmarea pe link și nu lăsa butoanele omului. |
| 4. Evenimentul | `create_event_from_deal(dealId)` | Întoarce `reservationId`; dacă evenimentul există deja, îl întoarce pe acela (nu crea altul). |
| 5. Meniul | `attach_event_menu_to_reservation(reservationId, eventMenuId, guestCounts)` | Felurile cu toate preparatele incluse se completează singure; `courseChoices` doar la felurile la alegere. |
| 6. Numărul final | `confirm_event_final_guests` (previzualizare, apoi `confirm:true` cu acordul omului) | Răspunsul spune ce s-a recalculat: oferta, venitul evenimentului, valoarea și persoanele oportunității, bucătăria. |
| 7. Degustarea | `plan_event_tasting` → `send_event_tasting_to_kitchen` → `complete_event_tasting` → `set_event_tasting_verdicts` → `choose_event_tasting_winner` | Previzualizarea lui `complete_event_tasting` spune dacă lipsește motivul de ieșire „Protocol”. |
| 8. Bucătăria | `get_event_kitchen_requirements` → comenzi la furnizori → `plan_event_kitchen_stock_batches` → producție (`exec_complete_batches` pentru mai multe loturi) → `cover_event_kitchen_items` / `link_event_kitchen_batches` | Necesarul se citește după confirmarea numărului final; ce e pe stoc se ia din stoc, nu se mai produce. Pachetul nu primește lot: se produc preparatele lui. |
| 9. Bufetul | `create_buffet_service` → `issue_buffet_products` (toate produsele într-un apel) → `record_buffet_attendance` → `close_buffet_service` | Tipul rezervării trebuie marcat ca eveniment. Fiecare produs are rezultatul lui (pus, deja pus, refuzat cu motiv); reluarea cu aceeași cheie nu dublează ieșirea. |
| 10. Banii | `get_event_payment_status(dealId)` → `record_event_payment` → `issue_event_final_invoice` | Avans sau încasare finală, cu previzualizare; factura finală poate pleca cu scadență, înaintea banilor. |
| 11. Rezultatul | `get_event_fiche(reservationId, section)` | Profitul evenimentului: venit, mâncare (inclusiv bufet și degustare), personal, cheltuieli. |

## Capcane întâlnite (și cum le eviți)

- **Mai multe branduri.** Uneltele de meniu de eveniment, degustare și bucătărie își iau brandul din pachet, eveniment, ofertă sau degustare. Trimite `brandId` doar ca să verifici; un brand străin e refuzat.
- **Preț pe persoană cu adulți și copii.** Pe documentul clientului, liniile pe persoană cu numere diferite de persoane apar fiecare cu prețul ei, nu ca total. Liniile la kg (tortul) apar cu prețul și unitatea lor.
- **Pachetul din ofertă și meniul confirmat.** Când aceeași linie de ofertă poartă și produsul-pachet, și pachetul din Meniu Evenimente, bucătăria gătește preparatele o singură dată; ce are pachetul în plus se gătește din pachet, cu avertisment. Un pachet vândut pe altă linie e altă mâncare și rămâne de gătit. Dacă vezi totuși preparate dublate, nu porni producția: verifică liniile ofertei și meniul evenimentului.
- **Două pachete în aceeași ofertă** (adulți + copii). Bucătăria le gătește pe amândouă. Două meniuri proprii, nelegate de ofertă, rămân o decizie a omului: bucătăria gătește doar meniul principal și avertizează.
- **Valoarea oportunității.** Urmează totalul evenimentului (meniu, număr final, produse adăugate manual, ca tortul). Cu o ofertă principală, valoarea e a ofertei. O valoare schimbată separat de om nu se suprascrie. În ambele cazuri răspunsul spune asta, cu ambele sume: nu afirma că s-a recalculat.
- **Tipul de eveniment.** Pe un brand cu tipuri configurate în Setări → CRM, un tip necunoscut e refuzat cu lista celor valide. Tipul schimbat pe oportunitate ajunge și pe eveniment; `update_reservation` primește `reservationType` și refuză câmpurile pe care nu le cunoaște, fără să scrie nimic.
- **Reducerea pe linia ofertei e o sumă fixă.** La un număr final diferit rămâne aceeași sumă, deci alt procent; previzualizarea arată procentul înainte și după, ca omul să decidă.
- **Servire la masă sau bufet.** Felul pachetului se stabilește la creare. Un pachet creat cu `create_event_menu` servește la masă; pachetele de bufet vin din modulul Bufet. Refuzul spune ce servire e permisă.
- **Motivul de ieșire „Protocol”.** Degustarea scade stocul pe un motiv de mese de personal și protocol. Dacă firma nu are niciunul, adaugă-l cu `create_stock_exit_type`, doar cu acordul omului.
- **Porțiile de degustare.** O listă proprie de preparate (`dishes`) păstrează legătura cu variantele de meniu; nu trimite `sources`.
- **Loturile pe stoc.** Un lot „planned” nu se poate finaliza direct cu `exec_complete_batch`: pornește-l cu `exec_start_batch`. Pentru mai multe loturi deodată, `exec_complete_batches` pornește ce e planificat și finalizează, lot cu lot; loturile de fabrică sau pe operații se refuză pe element.
- **Ieșirea la bufet.** Bufetul ia produsul doar din gestiunea-sursă a produsului în unitate. Un preparat produs în altă gestiune trebuie transferat acolo (sau i se schimbă sursa) înainte de ieșire; refuzul spune gestiunea căutată, cât e disponibil și pasul următor. Loturile încă la control de calitate, blocate sau intrate după data servirii nu pot ieși.
- **„Nimic de modificat”.** Răspunsul numește câmpurile trimise pe care unealta nu le cunoaște. Nu relua apelul identic: caută unealta care schimbă acel câmp.
- **SQL.** Preferă uneltele dedicate. Tabelele reale: `sales_deals` (nu `deals`), `sales_stages.order`, `reservations.guest_name`, `quotes.number`, `customer_advances.advance_invoice_id`, `inventory_lots.qty_remaining`. Coloanele unui tabel: `describe_database_table`; o singură instrucțiune SELECT pe apel.

## Ce rămâne la om

- Acordul pentru orice previzualizare care mișcă stoc, bani sau trimite documente clientului.
- Încasarea la casă și bonul fiscal se fac de un angajat, la casa de marcat.
- Anularea loturilor rămase fără cerință după schimbarea meniului: bucătarul decide; asistentul le arată.

## Vezi și

- `asistent-oferte-email-whatsapp.md` — asistentul care preia cererile din email, propune răspunsul pe WhatsApp și duce oferta până la confirmare; ce a mers și ce a corectat proprietarul.

- `meniuri-evenimente-si-meniul-zilei.md` — pachetele de eveniment ca șabloane.
- `rezervari-clienti-evenimente.md` — fișa evenimentului, BEO, P&L.
- `crm-vanzari-pipeline.md` — oportunități și oferte.
- `productie-restaurant.md` — loturi simple și producție pentru evenimente.
