# Meniu partajat între restaurantele unei vitrine de livrare

Acest ghid privește vitrinele cu meniu partajat din platforma de livrare Symbai. Nu presupune că uneltele `deliveryapp_*` sunt disponibile pe orice conexiune POS: verifică identitatea pieței, restaurantele și catalogul MCP al conexiunii autorizate.

## Sursa meniului și publicarea

Începe cu `deliveryapp_get_menu_wiring`: verifică vitrina, meniurile, restaurantele legate și sursa configurată. Restaurantul-sursă este o alegere explicită; o sursă dedusă din acoperirea unui catalog vechi trebuie prezentată ca deducție.

`deliveryapp_set_storefront_source` configurează sursa și opțiunea `followSourceMenu` pentru piața și vitrina verificate. Recitește legăturile după salvare.

Opțiunea de urmărire a meniului sursei publică produsele noi după sincronizarea sursei, reactivează produsele revenite și retrage ofertele care nu mai sunt listate de niciun restaurant al vitrinei. Sursa trebuie legată la exact un meniu al vitrinei pentru această urmărire. Vizibilitatea aleasă de operator rămâne distinctă de starea catalogului.

Nu raporta că un produs a apărut pe site doar fiindcă există în POS. Verifică sincronizarea, oferta din meniul comun, legătura fiecărui restaurant și meniul afișat pentru adresa clientului. În zone suprapuse, eligibilitatea efectivă și cotația livrării contează, nu doar apartenența geometrică la o zonă.

## Unificare și restaurante secundare

`deliveryapp_consolidate_shared_menu(dryRun:true)` arată planul de unificare fără scriere. Verifică sursa și produsele afectate înainte de aplicarea cerută de utilizator. Produsele restaurantelor secundare pot rămâne `pending` după mutare: același nume nu dovedește că preparatul este echivalent sau vandabil.

Sincronizează catalogul restaurantului cu `deliveryapp_sync_vendor_catalog`, apoi verifică și confirmă mapările cu `deliveryapp_confirm_sku_mappings`: perechile exacte cod SKU și produs POS, cu motiv. Folosește mai întâi `dryRun:true`. Alergenii, informațiile nutriționale și regulile opțiunilor trebuie să fie compatibile. Conflictele se raportează pe produs și nu se forțează pentru a obține un catalog aparent complet.

După operație recitește legăturile și verifică produsele în meniul public pentru adresa relevantă. Separă în raport: sincronizat, mapat, confirmat și disponibil la comandă.
