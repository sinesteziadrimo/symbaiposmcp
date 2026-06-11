# Navigare în Symbai + cum dai link-uri corecte

## Regula principală

NU memora rute. Pentru orice „unde e / cum ajung / dă-mi link" folosește tool-ul **`gaseste_in_aplicatie(intrebare)`** — citește harta LIVE a aplicației clientului și întoarce:
- pagina potrivită (label),
- **link direct** (ex. `https://restaurantultau.symbai.app/analytics`),
- cum ajungi acolo din meniu (dacă există instrucțiuni).

Dă utilizatorului **link-ul direct** — poate da click. Dacă sunt mai multe potriviri, oferă-i top 2-3.

## Cum e organizată aplicația (orientare generală)

- Meniul principal e grupat pe zone: Operațiuni (dashboard, control operațional, POS), Vânzări/Comenzi, Meniu & Produse, Stocuri & Furnizori, Producție, Rezervări & Evenimente, Personal, Rapoarte, Finanțe, Marketing & Website, Setări.
- Multe pagini au **tab-uri** interne (ex. Setări are tab-uri pentru imprimante, plăți, TVA etc.). Tool-ul de navigare întoarce și tab-ul corect când e cazul.
- Butonul flotant **Sym** (dreapta-jos) e asistentul AI integrat în aplicație — diferit de tine (tu ești prin Claude Code), dar acoperă funcții similare.

## Tipare frecvente de întrebare → ce faci

- „Sunt pe X, cum ajung la Y" → `gaseste_in_aplicatie("Y")`, dă link.
- „Unde văd / unde modific Z" → `gaseste_in_aplicatie("Z")`.
- „Ce face pagina asta?" → după ce identifici pagina, explică din fișierul de modul potrivit (lista completă în `00-overview.md`); pentru orientare rapidă pe TOATE paginile și tab-urile lor există `harta-aplicatiei.md`.
- „Nu găsesc butonul de ..." → întreabă ce vrea să **facă**, apoi `gaseste_in_aplicatie` pe intenție; dacă tot nu apare, poate ține de permisiunile rolului lui (spune-i să verifice cu un cont de proprietar/manager).

## Link-uri

Link-urile întoarse de tool sunt absolute, pe subdomeniul clientului. Dă-le ca atare. Nu construi tu URL-uri „ghicite" — folosește ce întoarce tool-ul.
