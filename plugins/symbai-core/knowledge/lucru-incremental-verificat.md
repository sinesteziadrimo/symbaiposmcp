# Lucru incremental, verificat, condus de user (protocol transversal)

Protocol reutilizabil pentru ORICE lucrare mare și pe pași (clonarea unui site, importul unui catalog, configurarea unui CRM, o campanie în mai multe etape). Skill-urile îl instanțiază concret; aici e regula generică.

> **De ce există:** lecția #1 dintr-o clonare reală (drimoland.ro) — când faci prea mult într-un singur prompt NU verifici destul și scapi greșeli care „par gata" (poze lipsă, link-uri care pleacă de pe clonă, secțiuni nemapate). Verificarea temeinică CERE pași mici. Mai bine durează ore în pași verificați decât „pare gata" la 20%.

## Modul IMPLICIT = incremental, condus de user

1. **Descompune.** Spargi lucrarea într-o **listă numerotată de sarcini mici, fiecare verificabilă singură**. Ține lista durabil (pe disc / task list), nu în cap — supraviețuiește compactării contextului.
2. **O singură sarcină pe tură.** Faci EXACT o sarcină mică pe tură. Niciodată nu înlănțui mai multe sarcini în tăcere.
3. **Verifică obiectiv, în aceeași tură.** Confirmi sarcina prin **CITIREA rezultatului real** (re-citești ce ai scris, nu „tool success") — și vizual unde se aplică (browser, screenshot, DOM). „Gata" la o sarcină ≠ „pare gata".
4. **Explică în limbaj de business.** Scurt, pe înțeles: CE ai făcut la sarcina asta și de ce. Fără jargon, fără dump de cod.
5. **Propune ÎNTOTDEAUNA următoarea sarcină și oprește-te.** Închei fiecare tură cu: (a) rezultatul + dovada verificării, (b) **o singură sarcină următoare concretă, propusă**. Apoi te OPREȘTI și aștepți „continuă / da / yes". Userul conduce ritmul.
6. **Niciodată „gata" fără verificare.** „Gata" pe tot e definit de porți/criterii obiective, nu de impresie.

## Modul AUTONOM = OPT-IN

Rulezi mai multe sarcini la rând, nesupravegheat (loop / agent programat / hook care nu te lasă să te oprești) **DOAR după ce userul cere explicit** „rulează tot / nu te opri / fă tot / las-o să meargă / închid laptopul". Până atunci toată mașinăria „nu te opri" stă OPRITĂ.

Chiar și în modul autonom, fă **checkpoint**: după fiecare poartă care trece sau fiecare N pași, postezi o linie de progres + următoarea sarcină planificată, ca userul să poată interveni. Și în autonom: verifici fiecare pas (regula 3) — viteza nu scuză lipsa verificării.
