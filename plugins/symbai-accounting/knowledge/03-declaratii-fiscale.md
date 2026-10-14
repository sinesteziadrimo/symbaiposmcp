# Declarații fiscale RO — ce sunt, cine depune, termene

> Snapshot orientativ (ANAF / Codul Fiscal — Legea 227/2015 / Codul de Procedură Fiscală). Termenele și pragurile se modifică — verifică la zi. Calendarul exact al firmei: vezi modulul fiscal din aplicație.

## Declarații periodice
| Cod | Ce este | Cine / când |
|---|---|---|
| **D300** | Decontul de TVA | Plătitorii de TVA, lunar/trimestrial; termen uzual 25 ale lunii următoare. |
| **D301** | Decont special de TVA | Pentru neplătitori cu operațiuni speciale (ex. achiziții intra-UE). |
| **D390 (VIES)** | Declarația recapitulativă operațiuni intracomunitare | Lunar, dacă există operațiuni intra-UE. |
| **D394** | Declarația informativă livrări/achiziții pe teritoriul național | Plătitorii de TVA, la termenul decontului. |
| **D112** | Contribuții sociale + impozit pe venit + evidența nominală a asiguraților | Angajatorii, lunar (sau trimestrial pt. anumite categorii); termen uzual 25. |
| **D100** | Obligații de plată la bugetul de stat | Pe tipuri de impozit, periodicitate variabilă. |

## Declarații anuale / periodice mai rare
| Cod | Ce este |
|---|---|
| **D101** | Impozitul pe profit anual (PJ pe regim de profit). |
| **D205 / D207** | Declarații informative privind impozitul reținut la sursă / pe venituri. |
| **D406 (SAF-T)** | Fișierul standard de control fiscal (raportare detaliată ANAF). |
| **D700** | Modificări/mențiuni privind înregistrarea fiscală. |
| **Situații financiare anuale** | Bilanț + cont de profit și pierdere + note (OMFP 1802/2014); termen legal anual. |

## Cum se pregătesc D300, D394 și D406 în Symbai
1. **Datele lunii sunt complete.** Dacă firma lucrează cu Symbai POS, luna trebuie predată integral din POS (vânzări, achiziții, plăți, stocuri, note) și închisă în Accounting. Un import parțial sau o lună deschisă blochează calculul oficial cu un mesaj clar; nu se „completează” manual.
2. **Profilul perioadei e confirmat** de contabil: regimul TVA, scutirile, deducerea pe fiecare achiziție (integrală / limitată / fără), iar la D300 eventualele regularizări pentru recepții corectate după ce luna lor a fost declarată. La D394 se atestă dosarul perioadei.
   - **D300, în ordine:** citești profilul și registrul deducerilor → contabilul verifică fiecare document și atestă profilul (registrul confirmat cere pro-rata 100%) → abia apoi se confirmă regularizările R30, fiecare cu varianta deja declarată în decontul anterior, după registrul fiscal. O nouă atestare a profilului cere reconfirmarea R30, iar o modificare a documentelor după confirmare cere reconfirmarea registrului.
   - Asistentul poate pregăti și previzualiza totul; confirmarea o dă numai contabilul (sau tu, la cererea lui explicită), cu drept de editare în contabilitate. Nu alege varianta „deja declarată” după cea mai convenabilă sumă.
3. **Previzualizarea oficială** (`preview_d300_official`, `preview_d394_official`, `preview_d406_official`) arată totalurile, concordanța documente ↔ note și blocajele cu pasul de urmat. Repetarea ei nu schimbă nimic.
4. **Generarea, semnarea și depunerea** se fac din aplicație, de om. Nimic nu se depune automat.

Corecțiile ulterioare ale unei facturi sau recepții nu rescriu luna deja declarată: luna veche rămâne pe datele de atunci, iar diferența intră în luna corecției (regularizare). D406 Stocuri fără nicio poziție și D406 Active cu registrul anual confirmat gol nu se generează ca fișier gol — dovada rămâne păstrată, fără stocuri sau active inventate. **D177, D700 și situațiile financiare (bilanțul) sunt previzualizări/fișe de lucru**, nu fișiere oficiale gata de depunere.

## Reguli pentru asistent
- Pentru „ce declarații am de depus / când" — orientează-te după tabel + datele firmei (regim TVA lunar/trimestrial, are salariați → D112, are operațiuni intra-UE → D390). Confirmă termenele exacte cu calendarul fiscal din aplicație/ANAF.
- Pentru DATELE unei declarații: D300 → `get_vat_summary` (orientativ) și `preview_d300_official` (oficial); D394/D406 → previzualizările lor; restul → din rapoarte (`get_profit_loss`, `get_trial_balance`) + datele din module. Generarea XML oficială + depunerea în SPV/ANAF se fac în aplicație (acțiuni oficiale, ireversibile) — tu pregătești și verifici.
- Un blocaj de previzualizare („luna nu e închisă”, „lipsește confirmarea”, „predarea POS incompletă”) se rezolvă la sursă, nu prin atestări date fără verificare.
- NU declara „depus" decât după confirmarea în SPV. Depunerea e ireversibilă.

## Surse oficiale (pentru actualizare)
- ANAF — formulare, instrucțiuni, calendar fiscal: anaf.ro.
- Codul Fiscal (Legea 227/2015) + normele de aplicare; Codul de Procedură Fiscală.
- OMFP 1802/2014 — reglementări contabile (partidă dublă).
- e-Factura / e-Transport / SAF-T — secțiunile dedicate ANAF.
