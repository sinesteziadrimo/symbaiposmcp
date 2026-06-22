# Symbai Supplier - catalog MCP (ghid sumar)

Sursa de adevar pentru tool-urile disponibile este sesiunea MCP activa (`tools/list`), pentru ca lista depinde de modulele bifate pe tokenul furnizorului. Nu inventa tool-uri daca nu apar in sesiune.

## Ordine recomandata

1. Verifica accesul cu un tool de citire neutru, de exemplu `get_dashboard`.
2. Pentru produse, comenzi, clienti, stocuri, preturi, livrari sau facturare, cauta intai tool-ul dedicat de listare/citire.
3. Pentru scriere, explica schimbarea si cere confirmare daca actiunea este ireversibila sau trimite mesaje/bani/stoc.
4. Dupa scriere, ruleaza din nou un tool de citire si raporteaza dovada pe scurt.

## Erori obisnuite

- `Permisiune insuficienta`: modulul de scriere nu este bifat pe token; adminul recreeaza tokenul din aplicatia Supplier.
- `Token MCP lipsa` sau HTTP 401: configurarea MCP nu trimite headerul `Authorization: Bearer <TOKEN>` sau tokenul a fost revocat.
- Lista goala la un modul: modulul poate fi dezactivat in configurarea businessului sau nu exista date.
