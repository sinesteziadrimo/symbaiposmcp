---
name: inlocuieste-ingredient-temporar
description: Înregistrează o materie primă lipsă temporar și ingredientele folosite în schimb, fără modificarea rețetelor. Perioadă, proporții, porții exceptate, recalculare și registrul din Bucătăria Azi. La „am rămas fără sirop”, „am folosit lămâi în loc”, „schimbă ingredientul câteva ore” sau minus de stoc explicat prin înlocuire.
---

# Înlocuiește temporar un ingredient

Citește [procedura registrului](../../knowledge/inlocuiri-temporare-ingrediente.md) pentru înregistrare, editare, excepții, revenirea ingredientului sau investigarea unui minus explicat prin înlocuire. Pentru o schimbare permanentă de rețetă folosește `adauga-produs-reteta`.

Verifică întâi firma, aria și uneltele din conexiunea live. Caută `list_consumption_substitutions`, apoi schema operației necesare. Dacă uneltele lipsesc, verifică disponibilitatea versiunii și accesul; ghidul nu dovedește că funcția este deja disponibilă în firmă. Nu imita înlocuirea prin ajustări de stoc sau rescrierea tuturor rețetelor.

În asistenții din aplicație, ghidul este disponibil prin catalogul `guidance`, tema `consumption_substitutions`; folosește unealta indicată acolo și continuă `nextArguments` până la `complete=true`.

Identifică ingredientele și gestiunile exacte, perioada efectivă, proporția în unitățile de stoc și porțiile exceptate. Nu inventa conversia dintre litri, kg și bucăți. Reutilizează răspunsurile și autorizarea deja date, cere numai ce lipsește. Simulează, execută în mandatul acordat și verifică starea recalculării, impactul și stocurile ambelor ingrediente.

Predă linkul `kitchenUrl` întors de registru și spune separat „salvat” și „consum recalculat”. Concret, istoricul, perioadele și excepțiile se păstrează în registru; memoria conversației nu îl înlocuiește. Comunică în grupul deja autorizat și păstrează limitele de citire/operare ale asistentului.
