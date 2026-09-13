# Hoteluri, activități și vizitare

Cere numai tema necesară: `get_event_studio_guide({topic:"rooms"})` pentru camere, `topic:"navigation"` pentru tur și niveluri.

## Camere și stiluri

`furnish_event_studio_room` oferă king, twin, family, suită și cameră cu circulație generoasă. Stiluri: boutique, coastal, alpine, business, palace și playful. Include mobilier la scară, baie, dulap, birou cu minibar integrat, TV și bagaje. Citește dimensiunile minime înainte de aplicare. Preview-ul este implicit; nu salvează până la `preview=false`.

Nu micșora un pat sau o cadă ca să încapă într-un spațiu prea mic. Folosește dimensiunile reale ale produsului și amplasare individuală pentru contururi neregulate. `deskMinibar` conține minibarul în corp; nu mai adăuga unul suprapus. `replaceExisting` înlocuiește pereții și mobilierul camerei și cere verificarea conținutului existent; obiectele blocate au protecție separată. Camerele accesibile se verifică față de cerințele concrete, fără a promite conformitate din șablon.

Catalogul include pat single/dublu, noptiere, dulap, birou, minibar, canapea, fotoliu, măsuță, cadă, duș, WC, lavoar, oglindă și TV. Dimensiunile sunt în metri, poziția este centrul obiectului, `elevation` cota bazei deasupra pardoselii. Oglinzile și televizoarele de perete trebuie să aibă cota corectă.

Construiește restaurantele, foyerul, sălile, camerele, grădina, parcarea și activitățile ca spații distincte. Separă hotelul demonstrativ de inventarul PMS real. Variantele sălii pot include candy bar, bufete, stație de cafea, live cooking, lounge, scenă, ecran, pupitru și ring; păstrează culoarele și spațiul de lucru al personalului.

## Clădiri pe niveluri

Modelează parterul, subpanta și etajele la cotele documentate. Un nivel superior parțial nu este un planșeu peste întreaga clădire. Folosește contururi și goluri reale, păstrează spațiile cu dublă înălțime și verifică raportul dintre înălțimea camerei și cota etajului următor.

Pentru parcuri de activități există spații playground, party, laserTag și vr, cu structuri de joacă, trambuline, arcade, stații VR și obstacole lasertag. Grădinile pot include arbori, pergole, umbrele, șezlonguri, scenă și zone de servire. Aspectul și dimensiunile echipamentelor personalizate cer sursa reală sau un model GLB.

## Turul clientului

`update_event_studio_navigation` definește legăturile și opririle. `from/to` au spațiu, X/Z local și direcția privirii. Ușile/pasajele/aleile între spații adiacente cer acces fizic liber pentru mers continuu. `stairs/elevator` leagă etaje și permit alegerea destinației în plimbare. `bidirectional` controlează sensurile.

`tour` este ordonat: exterior → intrare/recepție → restaurante/activități → camere → sală și variante. Fiecare oprire are nume, spațiu, punct, yaw/pitch și descriere. Yaw 0 privește spre -Z. Testează fiecare punct să fie liber și fiecare legătură să ducă în spațiul corect. Nu marca un traseu accesibil doar fiindcă ai adăugat un ascensor în desen.

Buyerul poate vedea clădirea, complexul în secțiune, sala, planul și plimbarea. Prezentarea publicată este o copie fixă a reviziei; modificările și noile tururi cer o nouă publicare. Sursele și calibrarea rămân private. Numele publice ale încăperilor și opririlor se verifică înainte de publicare.
