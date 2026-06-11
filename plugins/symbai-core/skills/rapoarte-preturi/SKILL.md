---
name: rapoarte-preturi
description: Răspunde la întrebări despre rapoarte, vânzări, KPI, food cost, marjă, prețuri. Folosește la „cât am vândut", „top produse", „care e food cost-ul", „ce marjă am la X", „de ce scade profitul", „cât datorez furnizorului".
---

# Rapoarte, cifre și prețuri

Citește `knowledge/rapoarte-preturi.md` pentru ce înseamnă fiecare indicator + regulile de TVA.

## Cum răspunzi la cifre

Folosește ÎNTÂI tool-urile dedicate de raport (funcționează FĂRĂ acces SQL, sunt rapide, sigure și compară automat cu perioada anterioară). Toate acceptă `perioada` (azi, ieri, saptamana_aceasta, luna_aceasta, ultimele_7_zile, ultimele_30_zile, custom + startDate/endDate) și opțional `brandId`/`locationId`:

- „cât am vândut / cum merg vânzările / cash vs card / cresc sau scad" → **`raport_vanzari`** (total, bon mediu, bacșiș, reduceri, pe metodă de plată + % vs perioada anterioară).
- „ce se vinde cel mai bine / top produse / best sellers" → **`top_produse`** (cantitate, venituri, pondere; `ordine: venituri|cantitate`).
- „când am cei mai mulți clienți / la ce oră e vârf / ce zi merge" → **`vanzari_in_timp`** (`grupare: zi|ora|zi_saptamana`).
- „cum merg ospătarii / cine vinde cel mai mult / cine a luat cel mai mult bacșiș" → **`performanta_ospatari`**.

Pentru alte analize: `analyze_food_costs`, `analyze_recipes` (food cost, marjă), `get_accounting_overview`, `generate_report`.
- Analize ad-hoc fără tool dedicat (ex. „clienți distincți luna trecută", „produse nevândute niciodată"): `execute_sql_query` DOAR dacă tokenul are SQL (workflow: list_tables → describe → SELECT cu coloane + WHERE + LIMIT). Dacă nu are SQL, rămâi pe tool-urile dedicate de mai sus — acoperă marea majoritate.
- Întotdeauna **etichetează clar** sumele: „total facturat", „de plătit", „încasat", „de încasat" — niciodată „total" gol pe o sumă cu sens dublu.

## Prețuri și marjă

- Prețul de vânzare e pe articolul de meniu (`add_menu_item` / `update_menu_item`). Costul vine din rețetă (ingrediente × preț achiziție).
- „Ce marjă am la X" = preț vânzare − cost rețetă. Pentru recomandări de preț folosește `analyze_food_costs` / `analyze_recipes`.
- Modificare preț în masă: `bulk_update_menu_item_prices` (confirmă numărul de articole întâi).

## Reguli

- Nu inventa cifre. Dacă un tool nu întoarce datele, spune ce lipsește și ce raport/pagină ar ajuta (dă link).
- RON peste tot; TVA România 0/11/21.
- Pentru „de ce scade profitul / vânzările" — combină 2-3 surse (vânzări pe perioadă, food cost, manoperă) și dă o interpretare scurtă, onestă, cu cifre.
