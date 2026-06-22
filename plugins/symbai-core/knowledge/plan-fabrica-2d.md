# Plan 2D Fabrică — concepte și glosar

Planul 2D al fabricii este harta vizuală a halei: un desen la scară reală pe care pui echipamentele, zonele de producție, magaziile și zonele de depozitare, pe unul sau mai multe nivele, și legi fluxul material dintre ele. Este un editor DEDICAT fabricii, separat de Plan Sală (care e pentru mesele de restaurant). Pagina: **Plan Fabrică 2D** (`/factory-floor-plan`), în meniul Producție, modul fabrică.

Pentru fluxul pas-cu-pas de construire vezi skill-ul `plan-fabrica`. Pentru contextul general de fabrică (cele două motoare de producție, fluxuri tehnologice, MPS/MRP, HACCP) vezi `productie-fabrica.md`.

Tool-uri MCP recomandate, în ordine: `list_factory_plans` / `create_factory_plan` pentru plan, `get_factory_plan_palette` pentru entitățile reale disponibile, `build_factory_floor` pentru construire rapidă din obiecte + conexiuni, apoi `get_factory_plan` pentru verificare live.

## De ce există
Un owner de fabrică vrea să „vadă" hala: unde stă fiecare utilaj, pe unde curge marfa, ce e stocat unde, ce zone sunt „curate" (high-care) și care „murdare" (materii prime / deșeuri). Planul 2D dă această imagine, legată de datele reale — nu e un desen mort, ci o oglindă vie a fabricii.

## Concepte centrale
- **Plan** — un desen al unei hale, pentru o locație. Poate avea mai multe **nivele/etaje** (Parter, Etaj 1, …). Are o **grilă** (snap) în cm pentru aliniere ușoară.
- **Obiect** — orice piesă de pe plan, cu poziție și mărime reală (în cm) și nivel. Tipuri:
  - **Echipament** — un utilaj real (cuptor, malaxor, ambalator). Legat de echipamentul din Echipamente & Zone.
  - **Zonă de producție** — o arie (frământare, coacere, ambalare). Legată de zona reală.
  - **Magazie** — un depozit real (cu cod, locație).
  - **Zonă de depozitare** — o sub-zonă a unei magazii (raft/secțiune) unde stă marfa.
  - **Generice** — perete, ușă, culoar, obiect custom (fără entitate reală, doar desen).
- **Conexiune (flux)** — o săgeată între două obiecte care arată cum curge ceva: **material** (marfa de la o stație la alta), **conveior**, **personal** (traseu oameni), **utilitate**. Aceasta e „spaghetti diagram"-ul fizic al halei.
- **Metadate HACCP** — pe zone poți marca: clasa de aer (grad A–D), zona de igienă (high-care / low-care / materii prime / deșeuri), alergenii și intervalul de temperatură. Colorează zonele și ajută la verificarea separării de risc.

## Cum se leagă de restul (informații vii)
- **Magazie → stoc agregat:** o magazie pusă pe plan arată cantitatea totală și numărul de produse din toate zonele ei de depozitare.
- **Zonă de depozitare → stoc real:** arată exact ce produse și ce cantități sunt acolo acum.
- **Echipament → fluxuri + azi:** un echipament arată pe ce fluxuri tehnologice (rețete/produse) lucrează și câte operații are programate azi. Statusul lui (liber / în lucru / mentenanță) apare ca un punct colorat.
- **Diagrame de producție:** echipamentele și zonele de pe plan sunt aceleași entități care apar în diagramele de flux de producție — planul arată locul FIZIC, diagrama arată SECVENȚA operațiilor.

## Glosar rapid
- **Nivel / etaj** — un strat al planului; comuți între ele cu tab-urile de sus.
- **Grilă / snap** — aliniere automată a obiectelor la o rețea (ex. la fiecare 10 cm).
- **Paletă** — lista entităților reale disponibile de pus pe plan; cele deja puse sunt marcate.
- **Obiect orfan** — un obiect a cărui entitate reală a fost ștearsă din sistem; apare cu avertisment (planul nu se strică, dar îl poți curăța).
- **high-care / low-care** — zone cu risc mic / mai mare de contaminare; nu se amestecă cu materii prime sau deșeuri.

## Întrebări tipice ale clientului
- „Desenează-mi hala cu cuptorul, frământarea, ambalarea și magazia, și leagă fluxul." → vezi skill-ul `plan-fabrica`.
- „Ce e stocat în zona X?" / „cât stoc are magazia?" → se vede pe obiectul respectiv (stoc real / agregat).
- „Pe ce lucrează cuptorul?" → echipamentul arată fluxurile care îl folosesc + operațiile de azi.
- „Vreau două etaje." → planul suportă nivele; pui fiecare obiect pe nivelul lui.

> Important: planul oglindește datele reale, dar pentru decizii (stoc, capacitate) verifică mereu cifrele prin paginile/tool-urile de stoc și producție, nu doar din eticheta vizuală.
