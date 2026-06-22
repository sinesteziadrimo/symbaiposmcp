# Symbai Supplier - privire de ansamblu (client-facing)

Symbai Supplier este portalul pentru furnizori B2B conectati la ecosistemul Symbai. Prin conexiunea MCP (`symbai-supplier`), un asistent AI poate citi date reale si poate executa actiuni pe tenantul furnizorului: produse, clienti, comenzi, stocuri, preturi, livrari, facturare si CRM. Furnizorul nu are nevoie de cont Symbai Hub pentru tokenul MCP; tokenul se creeaza din aplicatia de furnizor.

## Modulele si ce fac

| Modul | Ce acopera | Scriere prin token |
|---|---|---|
| Produse & catalog | produse, preturi de baza, disponibilitate, publicare in catalog | `produse` |
| Clienti B2B | clienti, contracte comerciale, conditii de plata | `clienti` |
| Comenzi | comenzi primite, statusuri, confirmari, anulare, retururi | `comenzi` |
| Stocuri | gestiuni, ajustari, receptii, transferuri | `stocuri` |
| Preturi | liste de pret, promotii, deal-uri, discounturi | `preturi` |
| Livrari | zone, curieri, flota, AWB, dispecerat | `livrari` |
| Facturare | facturi, incasari, eFactura unde este activata | `facturare` |
| CRM & marketing | lead-uri, campanii, segmente, loialitate | `crm`, `marketing`, `loialitate` |
| Productie | MPS si disponibilitate pentru furnizori care produc intern | `productie` |
| Setari | configurari tenant, integrari, tokenuri | `setari` |

## Reguli de aur pentru agent

- Incepe cu `get_dashboard` si listele dedicate modulului cerut; nu presupune structura tenantului.
- Foloseste tool-urile dedicate de comenzi; comenzile sunt izolate corect prin client/tenant, nu prin filtre inventate.
- Actiunile ireversibile cer confirmare explicita: anulare comanda, postare document de stoc, retur care misca stocul, stergere plata, trimitere campanie.
- Preturile si reducerile vin din motorul de preturi; nu recalcula manual contracte sau promotii.
- Dupa scriere, reciteste rezultatul si spune utilizatorului unde se vede in aplicatie.

## Cand folosesti browserul

Foloseste browser-control doar pentru verificari vizuale sau fluxuri care cer sesiunea autentificata: confirmarea unui status in UI, screenshot pentru dovada, navigare catre pagina exacta sau verificarea unui formular. Pentru date si actiuni, prefera MCP.
