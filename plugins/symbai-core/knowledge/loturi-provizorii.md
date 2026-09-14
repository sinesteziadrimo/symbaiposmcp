# Loturi provizorii și intrări de clarificat

Un lot provizoriu păstrează trasabilitatea mărfii existente fizic, dar încă fără o intrare documentată. Nu dovedește un preț zero și nici o recepție de la furnizor.

La „ce datorii de recepție avem”, „de ce rămâne costul necunoscut” sau „cum sting lotul provizoriu”, caută `exec_list_provisional_lot_debts` în catalog. Citește schema disponibilă pe instanță și selectează gestiunea fabricii. Dacă unealta nu este disponibilă, consultă lista datoriilor din pregătirea materialelor; nu presupune că există o acțiune de stingere.

- `createdQty` este cantitatea intrării originale dovedite. Nu o reconstrui din suma tuturor urmelor istorice: anulările și transferurile pot schimba interpretarea lor.
- `consumedQty` reprezintă ieșirea netă din acel lot, inclusiv transferuri. Nu o prezenta integral drept consum în rețete.
- `quantityEvidence:unverified` și cantitățile `null` cer verificarea documentului original; nu înseamnă zero.
- Păstrează `pagination.nextArguments` până la citirea completă. Dacă raportul s-a schimbat, reia de la prima pagină; nu combina două revizii.

Identifică proveniența reală: producție internă, transfer sau furnizor. Citește documentele existente înainte să înregistrezi o intrare lipsă. O recepție nouă nu stinge automat lotul provizoriu. Dacă `automaticReconciliationAvailable` este fals, nu promite o stingere automată și nu dubla intrările pentru a încerca să o declanșezi.

Pentru un plus care nu reprezintă marfă reală există decizia contabilă reversibilă de aducere la zero, acolo unde instanța o oferă și contabilul o autorizează. Pentru marfa reală, corecția trebuie să păstreze cantitățile fizice, recipientele, costurile documentate și istoricul. Nu confirma o numărătoare sau un retur fără dovadă fizică.

Un lot deja valorizat, dar cu documente descendente încă în așteptare, cere verificarea propagării costului. Nu cere încă o factură pentru același lot. Recitește stocul, documentele și rezultatul sincronizării înainte să declari rezolvarea.
