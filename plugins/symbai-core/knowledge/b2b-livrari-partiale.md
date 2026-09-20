# Comenzi B2B în tranșe, cu pregătire și predare separate

Verifică disponibilitatea prin `cauta_tool` și schema prin `citeste_tool` pe conexiunea nominală a firmei. Ghidul descrie capabilitățile platformei; nu dovedește că versiunea instalată le include. Dacă o unealtă lipsește, verifică pagina disponibilă și explică limita, fără apeluri inventate.

## De la comanda nouă la marfa pregătită

Comanda nouă rămâne ciornă până la confirmare. Stocul disponibil nu dovedește că operatorul a pregătit ori predat marfa. Identifică firma clientului, punctul de livrare și sursa fiecărui produs; `depotId` este destinația, iar `warehouseId` este gestiunea fizică de lucru.

| Situație | Continuare |
|---|---|
| Toate produsele sunt pe stoc eligibil | Confirmă comanda, alocă loturile reale și confirmă pregătirea. Nu crea producție inutilă. |
| Numai unele produse sunt pe stoc | Planifică numai necesarul neacoperit. Păstrează alocările și producția deja asociată. |
| Nu există stoc eligibil | Previzualizează planificarea pentru liniile de fabrică; aprovizionarea sau distribuția din depozit rămân fluxuri distincte. |
| Pleacă doar o parte, în altă mașină ori în altă zi | Împarte în tranșe înainte de predare și păstrează restul deschis. |

`plan_b2b_order` previzualizează; `apply_b2b_order_plan` aplică planul autorizat. Planificarea nu înseamnă producție executată. `get_b2b_picking_plan` → `allocate_b2b_lot` → `confirm_b2b_picking` confirmă produsele efectiv pregătite. Citește starea după fiecare etapă; documentele și predarea au dovezi proprii.

## Împarte comanda fără să pierzi restul

O tranșă păstrează cantitatea care pleacă acum; o comandă legată păstrează cantitatea rămasă. Se pot face împărțiri succesive pentru mai multe zile sau mașini. Nu duplica manual comanda, nu micșora tăcut cantitatea și nu marca restul ca refuzat de client. Prima tranșă predată nu închide întreaga comandă.

1. `get_b2b_delivery_split` cu `id`, `brandId`, `locationId`, `warehouseId`: citește produsele, cantitățile, coletele, `fingerprint`, politica, aprobatorii și livrările legate. Instrumentele de depozit folosesc `id`; multe instrumente comerciale mai vechi folosesc `orderId`.
2. `preview_b2b_delivery_split`: pentru marfa neambalată trimite `selection` cu **toate liniile** și cantitatea care pleacă acum în unitatea fiecăreia. Zero păstrează întreaga linie în rest. Dacă marfa este deja ambalată, alege `containerIds` pentru colete întregi. Nu combina cele două liste. `remainderDate` este ziua convenită pentru rest; omisă sau `null` înseamnă fără termen stabilit.
3. Citește toate paginile, urmând `pagination.nextArguments` până la `complete:true`. Păstrează `expectedPageFingerprint` la continuare; dacă rezultatul se schimbă, reia de la prima pagină. Prezintă cantitățile acum/rest și efectele reale: aviz înlocuit, scanări de refăcut sau cântărire necesară. Nu aplica o selecție construită dintr-o listă incompletă.
4. `apply_b2b_delivery_split` păstrează selecția previzualizată și trimite `expectedFingerprint`, un `requestKey` UUID, `acceptPartial:true` și `confirm:true` pentru operația autorizată. Dacă politica cere alt aprobator, folosește `authorizerEmployeeId` și PIN-ul real al acelei persoane. Acordul deja dat de utilizator nu trebuie cerut din nou; o aprobare nominală cerută de politica firmei rămâne obligatorie.
5. Recitește comanda curentă și `remainderOrderId` prin uneltele indicate în `nextTools`. Verifică ambalarea și etichetele fiecărei tranșe. Producția deja dedicată comenzii se păstrează; nu o crea încă o dată pentru rest.

O comandă deja plecată, facturată sau cu documente care nu mai permit restructurarea poate refuza împărțirea. Urmează motivul returnat; nu șterge documentele sau dovada predării pentru a ocoli refuzul.

## Cine acceptă o livrare parțială

Configurează numai nivelul cerut cu `set_b2b_picking_rules(scope, config)`; regulile mai specifice au prioritate.

| `partialDeliveryMode` | Comportament |
|---|---|
| `allow` | Operatorul acceptă explicit cantitățile acum/rest. |
| `approval` | Este necesară o aprobare nominală permisă de configurație. |
| `block` | Comanda trebuie livrată integral; împărțirea este refuzată. |

La `approval`, configurează `partialDeliveryApproverRoleIds` sau `partialDeliveryApproverEmployeeId` folosind roluri și persoane reale, active, din aria permisă. Funcția din firmă poate fi manager, inginer sau alt responsabil; denumirea singură nu acordă dreptul. `canApproveSelf` arată dacă persoana conectată poate aproba direct. Nu inventa un PIN și nu îl include în rapoarte. Dacă regula explicită lipsește, se aplică în continuare regulile existente pentru blocarea și autorizarea abaterilor.

## Două colete: două etichete și două scanări

`get_b2b_packing` arată conținutul și coletele. Folosește `create_b2b_packing_container`, `set_b2b_packing_contents`, `set_b2b_packing_staging` și operațiile de măsurare pentru datele fizice reale. Un colet gol poate fi eliminat cu `remove_b2b_empty_container`.

Pentru fiecare colet apelează separat `get_b2b_packing_label`, cu propriul `containerId`, `expectedQr` și amprenta actuală `expectedFingerprint`. Eticheta arată coletul/totalul și conținutul. Pentru un răspuns pe fragmente, continuă cu `nextOffset` și `expectedSha256` până la final, concatenează și decodează base64, apoi verifică hashul înainte de salvare și tipărire. `printed:false` înseamnă că unealta a generat eticheta, fără dovadă de imprimare. După împărțire reimprimă etichetele tranșelor.

QR-ul intern este suficient pentru fluxul intern. `prepare_b2b_gs1_labels` se folosește când sunt necesare SSCC și firma are profil GS1 real; nu inventa un prefix. Generarea etichetei nu este scanare fizică.

La ridicare externă, `handoverWorkflow:warehouse_pickup`, `handoverConfirmation:scan_packages` și `requireExternalRecipient:false` permit alegerea comenzii → scanarea fiecărui colet → confirmarea predării, fără șofer, mașină sau numele persoanei. Folosește `get_b2b_warehouse_pickup`, apoi `scan_b2b_warehouse_package` pentru fiecare cod citit fizic și `confirm_b2b_warehouse_pickup` când marfa este preluată efectiv. Recitește starea și verifică `handedOver`; emiterea avizului, a facturii sau a ieșirii de stoc nu înlocuiește dovada predării.

La un răspuns incert păstrează aceeași cheie și aceleași argumente, citește starea indicată în `nextTools` și verifică înainte de reluare. Nu crea altă tranșă sau altă predare pentru că primul răspuns s-a pierdut. Recepția clientului și eventualele refuzuri reale se înregistrează separat, pe documentul tranșei primite.

Vezi și [pregătire și colete](depozit-colete-predare.md), [comenzi B2B](b2b-comenzi-wholesale.md), [planificare](planificare-asistenti.md) și [dispecerat](livrari-b2b-dispecerat.md).
