---
name: pregateste-ziua-de-lucru
description: >-
  Pregătește ziua sau tura pentru manager, achiziții, producție și operatori, vânzări, depozit și livrări, financiar, echipă, marketing ori restaurant și hotel: priorități verificate, blocaje și predare între colegi. La „pregătește-mi ziua de lucru”, „ce am de rezolvat azi”, „pregătește tura următoare” sau „ședința de coordonare”. Pentru o singură comandă, ofertă sau operație folosește skill-ul specializat.
---

# Ziua de lucru, pregătită pentru omul care o conduce

Transformă datele disponibile într-o ordine utilă de lucru: **ce cere atenție → de ce → ce putem face → ce decizie lipsește**. Cererea de pregătire este o analiză, dacă omul nu a cerut explicit și o acțiune. Nu activa o recurență pentru o verificare la cerere.

## Alege traseul potrivit

Reia rolul, firma și locația din conversație; verifică identitatea nominală și aria disponibilă. Eticheta „manager” aleasă în ghidul Connect nu acordă permisiuni. Numele firmei sau gestiunii introdus în cerere se rezolvă la datele reale, nu se folosește ca identificator verificat. O persoană poate lucra în mai multe roluri; nu o încadra rigid.

Pentru achiziții, stocuri sau producție, caută `list_work_warehouses` prin `cauta_tool` și citește gestiunile accesibile, filtrate după brandul și locația verificate. Parcurge `nextAfterId` până la `complete=true` dacă prima pagină nu rezolvă alegerea. Potrivește numele și contextul cererii; nu îi cere omului ID-uri interne. Dacă rămân mai multe variante potrivite, oferă numele și locațiile lor într-o singură întrebare. La gestiunile comune păstrează brandul cererii; `isPrimaryPlanningWarehouse` este un indiciu de configurare, nu dovada că gestiunea este cea cerută sau că producția poate începe. O listă goală ori unealta indisponibilă în versiunea firmei înseamnă context neverificat, nu stoc zero; folosește numai alternativele de citire nominală disponibile și permise.

Citește numai referința necesară:

- [Manager](references/manager.md): rezultate, riscuri și deciziile săptămânii; ședință între echipe.
- [Achiziții](references/achizitii.md): necesar net, cost comparabil, livrări deschise și predarea către manager.
- [Producție](references/productie.md): cerere autoritară, tura următoare, capacitate comună și materiale.
- [Vânzări și comenzi](references/vanzari.md): ce așteaptă verificare, ce este confirmat și ce termen poate fi promis.
- [Depozit și livrări](references/depozit.md): recepții, marfă utilizabilă, pregătirea comenzilor și diferențe.
- [Financiar](references/financiar.md): documente lipsă, scadențe, facturi și bani, cu surse distincte.
- [Echipă și ture](references/echipa.md): sarcini, acoperire, dovezi și predarea schimbului.
- [Marketing](references/marketing.md): calendar, rezultate comparabile, aprobări și următorul experiment.
- [Restaurant și hotel](references/ospitalitate.md): serviciul următor, sosiri, plecări și situații de rezolvat.

Pentru o specializare diferită, folosește [personas-utilizatori.md](../../knowledge/personas-utilizatori.md) și ghidul modulului real al firmei. La un angajat cu rol îngust, pornește de la sarcinile și locul său de muncă; nu transforma cererea în auditul întregii firme. Într-o ședință între roluri citește doar referințele echipelor implicate.

## Construiește o imagine care poate fi verificată

1. Fixează data, perioada și unitatea. Compară perioade încheiate echivalente; separă activitatea de azi, încă în curs. Pentru mai multe firme, păstrează rezultatele separat înainte de orice consolidare.
2. Citește numai modulele relevante rolului și activității. Descoperă separat unealta pentru fiecare verificare, pornind de la numele exact din referința rolului; confirmă numele efectiv întors, deoarece primul rezultat poate fi doar o potrivire apropiată. Dacă nu o găsești, caută intenția concretă, precum „citește întârzierile livrărilor”, în locul întregii cereri de pregătire a zilei. Căutarea întoarce un catalog, nu constatări despre firmă: verifică schema și citește datele înainte de concluzii. O unealtă de pornire a producției sau creare de sarcini apărută în rezultate nu înlocuiește citirea planului ori a sarcinilor existente. Lipsa unei unelte sau a accesului se raportează drept neverificat; nu este „zero probleme” și nu justifică ocolirea prin SQL, alt utilizator ori altă firmă.
3. Păstrează pentru fiecare constatare sursa, documentul și momentul citirii. Separă stările: propunere, draft, confirmat, executat. Verifică toate paginile necesare; dacă rezultatul este limitat, spune ce acoperă și ce a rămas în afara verificării.
4. Prioritizează după termen și efectul demonstrat. Nu inventa o pierdere în lei doar ca să ordonezi lista. Un risc de siguranță sau un blocaj efectiv se tratează după fluxul său, fără a inventa inspecții sau a ridica blocări de calitate.

## Predă între roluri informația necesară

Pentru o problemă care trece la altă echipă, pregătește o fișă scurtă:

| Câmp | Conținut |
|---|---|
| Context | Firma, brandul, locația și perioada verificate. |
| Referință | Comanda, lotul, achiziția sau sarcina reală și starea actuală. |
| De pregătit | Produs/material, cantitate și unitate; termenul solicitat. |
| Blocaj | Dovada, dependența și ce informație lipsește. |
| Opțiune | Acțiunea propusă, efectul și costul cunoscut, separat pe monedă. |
| Destinație | Responsabilul cunoscut; dacă lipsește, rolul propus, fără atribuire inventată. |
| Decizie | Ce este deja autorizat și ce trebuie decis înainte de aplicare. |

Pregătirea fișei nu o trimite automat, nu atribuie sarcini și nu schimbă stări. Nu copia emailurile personale sau citatele private în memoria comună ori într-un raport al echipei. O comandă deja importată se transmite prin documentul operațional permis destinatarului, nu prin acces la inboxul proprietarului.

## Rezultatul pentru utilizator

Începe cu maximum trei priorități și următorul pas al fiecăreia. Continuă cu tabelul de decizii, apoi arată acoperirea verificării: firma/perioada, sursele citite, datele lipsă și restul listei dacă există. „Nu am putut verifica” rămâne vizibil.

Pentru fluxul complet comenzi → producție → achiziții, aplică [coordoneaza-comenzile-si-productia](../coordoneaza-comenzile-si-productia/SKILL.md). Pentru o acțiune autorizată, folosește verificarea curentă, aplică exact partea aleasă și recitește rezultatul. Pentru raport periodic cerut explicit, continuă cu [programeaza-rapoarte](../programeaza-rapoarte/SKILL.md); un prompt copiat din Connect nu este încă o sarcină programată.
