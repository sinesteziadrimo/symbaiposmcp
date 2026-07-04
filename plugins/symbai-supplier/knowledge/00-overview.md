# Symbai Supplier — privire de ansamblu (client-facing)

Symbai Supplier este portalul pentru furnizori B2B conectați la ecosistemul Symbai. Prin conexiunea MCP (`symbai-supplier`), un asistent AI poate citi date reale și poate executa acțiuni pe contul furnizorului: produse, clienți, comenzi, stocuri, prețuri, livrări, facturare și CRM. Furnizorul nu are nevoie de cont Symbai Hub pentru tokenul MCP; tokenul se creează direct din aplicația de furnizor.

## Modulele și ce fac

| Modul | Ce acoperă | Scriere prin token |
|---|---|---|
| Produse & catalog | produse, prețuri de bază, disponibilitate, publicare în catalog | `produse` |
| Clienți B2B | clienți, contracte comerciale, condiții de plată | `clienti` |
| Comenzi | comenzi primite, statusuri, confirmări, anulare, retururi | `comenzi` |
| Stocuri | gestiuni, ajustări, recepții, transferuri | `stocuri` |
| Prețuri | liste de preț, promoții, deal-uri, discounturi | `preturi` |
| Livrări | zone, curieri, flotă, AWB, dispecerat | `livrari` |
| Facturare | facturi, încasări, eFactura unde este activată | `facturare` |
| CRM & marketing | lead-uri, activități, conversații, loialitate; pentru marketing, prin conexiune verifici doar starea configurării de email — campaniile se trimit din aplicație | `crm`, `loialitate` (`marketing` doar când apare un tool de scriere în sesiune) |
| Producție | planificare (MPS) și disponibilitate pentru furnizorii care produc intern | prin aplicație; dacă în sesiune apar tool-uri de producție, folosește-le — sursa de adevăr e `tools/list` |
| Setări | configurări cont, integrări, tokenuri | `setari` |

## Reguli de aur pentru asistent

- Începe cu `get_dashboard` și listele dedicate modulului cerut; nu presupune structura contului.
- Folosește tool-urile dedicate de comenzi; comenzile sunt deja izolate corect pe client/cont — nu inventa filtre proprii.
- Acțiunile ireversibile cer confirmare explicită: anulare comandă, postare document de stoc, retur care mișcă stocul, ștergere plată, trimitere campanie.
- Prețurile și reducerile vin din motorul de prețuri (liste/promoții/deal-uri/contracte); nu le recalcula manual.
- Pentru marketing, `get_email_marketing_status` verifică doar dacă trimiterea de email e configurată. Nu trimite campanii prin conexiune dacă `tools/list` nu expune explicit un tool de trimitere.
- După scriere, recitește rezultatul și spune utilizatorului unde se vede în aplicație.

## Când folosești browserul

Folosește controlul de browser doar pentru verificări vizuale sau fluxuri care cer sesiunea autentificată: confirmarea unui status în interfață, screenshot pentru dovadă, navigare către pagina exactă sau verificarea unui formular. Pentru date și acțiuni, preferă conexiunea MCP.
