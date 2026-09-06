# Achiziții: necesar, cost și termen

Aplică [comanda-furnizor](../../comanda-furnizor/SKILL.md) pentru operațiunile canonice. Rolul de achiziții are nevoie de o listă care poate deveni comandă fără refacerea calculelor, cu neclaritățile vizibile.

## 1. Verifică lipsa reală

Fixează gestiunea și data la care materialul trebuie să fie disponibil. Pentru fabrică folosește necesarul calculat din planul autoritar; pentru restaurant folosește fluxul său de stoc/aprovizionare. Nu combina manual două motoare care scad deja stocul și achizițiile deschise.

Arată baza calculului disponibilă în răspuns: cerere, stoc eligibil, rezervări, recepții confirmate, achiziții încă deschise și necesar net. O achiziție cu termen după data necesară nu dovedește acoperirea deficitului de azi. „Trimis”, „livrat”, „recepționat” și „disponibil în stoc” sunt stări diferite; folosește starea canonică și dovada ei.

O listă fără alerte sub minim nu dovedește că aprovizionarea este acoperită. Verifică dacă pragurile minime sunt configurate pentru produsele și gestiunea analizate; `minStock=0` nu este un necesar calculat. Dacă pragurile lipsesc, spune ce acoperă verificarea și continuă cu cererea confirmată sau consumul relevant, folosind uneltele permise. Nu inventa praguri și nu modifica stocurile ori setările pentru a obține un rezultat favorabil.

Nu ghici ambalarea. Un factor implicit de o bucată poate fi neconfirmat; conversia din baxuri se oprește până la clarificare. Nu schimba unități, mapări ori stocuri pentru a elimina o alertă.

## 2. Compară ce este comparabil

Pentru oferte din inbox, aplică [monitorizeaza-comenzi-oferte](../../monitorizeaza-comenzi-oferte/SKILL.md) și analiza `offerAnalysis` a documentului personal. Citatul dovedește sursa textului, nu corectitudinea interpretării numerice: recitește documentul.

Compară produse echivalente și aceeași bază de cantitate/unitate. Verifică moneda, TVA-ul, pachetul, minimul de comandă, transportul, valabilitatea și termenul. O ofertă mai ieftină pe kilogram poate costa mai mult pentru cantitatea necesară din cauza pachetului sau transportului.

- Monede diferite: totaluri separate, dacă nu există un curs explicit verificat pentru conversia cerută.
- TVA/transport necunoscut: necunoscut, nu zero și nu total complet.
- Termen fără dată de plecare sau condiție clară: precizează incertitudinea.
- Produs diferit, calitate sau specificație neconfirmată: nu declara alternativa echivalentă.
- Ofertă din email: nu este automat preț contractat sau catalog autorizat.

Rezultatul are o recomandare motivată și alternative, sau verdictul „nu se poate decide încă” cu informația exactă lipsă.

## 3. Pregătește aplicarea și predarea

Pentru necesar → achiziții, obține previzualizarea prin `create_purchase_orders_from_requirements(commit:false)` în gestiunea potrivită și păstrează `previewToken`. Respectă strategia și modul potrivite firmei. Nu transforma o eroare de permisiuni într-o solicitare de rol mai larg.

Înainte de crearea autorizată a drafturilor, arată toate liniile și totalurile, cantitățile rotunjite, furnizorii și datele necesare. Nu folosi doar primele lipsuri dintr-un rezumat ca dovadă că întreaga comandă a fost verificată. Dacă planul B2B a creat deja achiziții pentru aceleași lipsuri, recitește-le înainte de altă generare.

Aplică exact selecția și verificarea autorizate; la conflict recalculează. Recitește drafturile și reține referințele efective. Trimiterea externă rămâne acțiunea separată cerută pentru documentul verificat și expeditorul corect.

Predarea către producție conține materialul, cantitatea/unitatea, termenul promis, achiziția și starea reală a recepției. Nu promite că materialul este disponibil doar pentru că ai pregătit un draft.
