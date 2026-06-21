---
name: cantare-catch-weight
description: Configurează cântare și produse vândute/valorizate la GREUTATE variabilă (catch-weight) prin conexiune (MCP) — carne, brânză, pește, patiserie la kg. Înregistrezi cântarul fizic legat de PC-ul cu Print Agent, marchezi produsele ca „la kg" (preț pe kg, greutate pe etichetă), citești ultima greutate raportată, și — dacă modelul de cântar nu e încă suportat — CERI integrarea lui echipei Symbai printr-un ticket. Folosește la „conectează cântarul de la recepție/bucătărie", „produsul X se vinde la kg", „pune greutatea pe etichetă/bon", „vreau catch-weight / greutate variabilă", „ce cântare suportați", „cântarul meu Y nu e suportat, cereți integrarea", „cât arată cântarul".
---

# Cântare & catch-weight (greutate variabilă) — prin conexiune, nu prin click

Userul (proprietar/manager de fabrică sau magazin alimentar) vinde sau valorizează produse la **greutatea reală cântărită** — carne, brânză, pește, semipreparate de patiserie la kg — nu la bucată fixă. Asta se cheamă **catch-weight**: produsul e numărat în bucăți, dar prețul și valoarea ies din kg-ul cântărit efectiv. Tu faci configurarea prin **tool-urile MCP** (date live pe instanța lui), îi arăți rezultatul pe ecran când vrea, și — dacă are un cântar pe care platforma nu-l știe încă — îi **deschizi un ticket de integrare** la echipa Symbai.

## Înainte de orice
1. Citește (la nevoie) **`knowledge/cantare-catch-weight.md`** (ce e greutatea variabilă, cum se conectează un cântar, fluxul cântărește→preț→etichetă, când ceri un model nou), **`knowledge/agent-operare-avansata.md`** (confirmare prin citire, dovadă) și **`knowledge/condu-chrome.md`** (MCP întâi, deep-link, screenshot = livrabil).
2. **Context**: cântarul fizic se leagă de **PC-ul care rulează Print Agent** (același calculator care vorbește cu imprimanta/casa). Ai nevoie de acel PC în listă — îl iei cu `list_pos_devices`. Brandul/locația se deduc dacă există una singură; altfel cere-le cu `list_brands` / `list_locations`.
3. **Suportat sau nu?** Înainte să adaugi un cântar, verifică cu `list_scale_models` dacă modelul lui e printre driverele suportate. Majoritatea cântarelor de bancă vorbesc protocolul ASCII standard → merg cu driverul **„generic-ascii"** fără nimic special. Dacă modelul are protocol propriu și nu e suportat → **`request_scale_integration`** (vezi mai jos).

## Fluxul: ce tool pentru ce cere userul

| Userul spune… | Tool MCP |
|---|---|
| „ce cântare suportați", „e suportat cântarul meu X", „ce am cerut să integrați" | `list_scale_models` |
| „ce cântare am configurate", „cât a citit cântarul de la bucătărie", „e online" | `list_scale_devices` |
| „adaugă/conectează cântarul de la recepție" | `create_scale_device` (nume + driver + conexiune serial COM/baud SAU rețea IP/port + `deviceId` = PC-ul cu Print Agent) |
| „pune modelul X în catalog" (model suportat, înainte de a adăuga aparatul) | `register_scale_model` |
| „produsul X se vinde la kg", „pune greutatea pe bon pentru Y", „activează catch-weight" | `set_product_catch_weight` (`productId`, `nominalWeight` kg/buc estimat, `pricePerWeight` + `pricingMode:"per_weight"` dacă prețul e pe kg) |
| „oprește catch-weight pe produsul Z" | `set_product_catch_weight` (`enable:false`) |
| „cât arată cântarul X", „citește greutatea" | `capture_weight` (`scaleDeviceId`) |
| „cântarul meu Y nu e suportat, cereți integrarea", „vreau să folosesc cântarul Z" | `request_scale_integration` (vezi secțiunea dedicată) |

**Citirile** (`list_*`, `capture_weight`) și **`request_scale_integration`** merg mereu — nu cer permisiune. **Scrierile** cer un modul pe token: `create_scale_device` / `register_scale_model` → **Setări & Configurare**; `set_product_catch_weight` → **Produse & Meniuri** (vezi „Permisiune").

## Rețete (cele care contează)

- **Conectează un cântar de bancă.** „Am un cântar la recepția de marfă, e legat pe serial la calculatorul cu Print Agent." → întâi `list_pos_devices` ca să afli care e PC-ul; apoi `create_scale_device(name:"Cântar recepție", scaleDriverType:"generic-ascii", deviceId:…, connectionType:"serial", serialPort:"COM3", baudRate:9600)`. Dacă e pe rețea: `connectionType:"tcp", ipAddress:"192.168.1.50", port:…`. Confirmă cu `list_scale_devices`.
- **Marchează un produs ca „la kg".** „Ceafa de porc se vinde la kg, 38 lei/kg, o bucată are vreo 1,2 kg." → `set_product_catch_weight(productId:…, nominalWeight:1.2, pricePerWeight:38, pricingMode:"per_weight")`. Tool-ul confirmă prin re-citire (vezi în mesaj că e acum catch-weight, preț pe kg). `nominalWeight` ajută la estimări înainte de cântărire; greutatea reală vine de la cântar.
- **Greutatea pe etichetă (cod de bare GS1).** Catch-weight pune greutatea reală în codul de bare al etichetei de produs (formatul GS1 cu greutate + lot + termen de valabilitate), ca să fie scanabilă la casă/recepție. Designul etichetei se face în „Materiale grafice" (skill-ul `materiale-grafice` / `etichete-productie`); aici tu doar marchezi produsul ca la-kg și pui prețul pe kg.
- **Citește greutatea.** „Cât arată cântarul?" → `capture_weight(scaleDeviceId:…)`. Îți dă ultima stare raportată de cântar. (Citirea LIVE la cerere, direct de la cântar, e în pregătire — până atunci apare ultima greutate raportată.)

## Cere integrarea unui cântar NOU (când modelul nu e suportat)

Dacă userul are un cântar cu protocol propriu pe care driverele actuale nu-l acoperă, **nu-l lăsa blocat** — deschide-i o cerere la echipa Symbai:

1. Adună: **producătorul** și **modelul** exact, cum se conectează (serial/rețea + baud dacă știe), și — foarte util — **o mostră de ce trimite cântarul** (ex. textul care apare pe portul serial). Cu cât e mai completă mostra, cu atât se integrează mai repede.
2. Întreabă-l dacă vrea să fie anunțat pe email când e gata.
3. `request_scale_integration(manufacturer:…, model:…, protocol:…, sampleOutput:…, useCase:…, contactEmail:…)`. Tool-ul deschide un ticket (sugestie) la echipa Symbai și îți dă o referință (ex. **SYM-00042**). Re-cererea aceluiași model se adaugă la ticketul existent, nu face duplicat.
4. Anunță-l: „Am cerut echipei Symbai integrarea cântarului «X Y» — referința SYM-NNNNN, te anunță pe email." Între timp, dacă cântarul vorbește ASCII standard, sugerează-i să încerce driverul „generic-ascii".

## Reguli (cele care contează)
- **Tool MCP întâi, click rar.** Configurarea (cântare, catch-weight pe produs) are tool — folosește-l, nu reproduce prin click. Chrome e doar pentru a arăta rezultatul pe ecran.
- **Confirmă prin citire, nu „pare bine pe ecran".** Tool-ul întoarce `success` + un rezumat — ăla e adevărul. Re-verifici cu `list_scale_devices` / re-citire produs.
- **Nu inventa cifre.** Prețul pe kg, greutatea nominală, portul serial — le iei de la user. Ce nu știe, îl ajuți să afle (ex. portul COM îl vede în setările Windows ale PC-ului cu Print Agent).
- **Ștergerea nu e prin conexiune.** Dacă userul vrea să șteargă un cântar sau un model, ghidează-l în aplicație (Setări).
- **Permisiune**: `create_scale_device` / `register_scale_model` cer modulul **Setări & Configurare**; `set_product_catch_weight` cere **Produse & Meniuri**. Citirile + `request_scale_integration` merg mereu. „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul.

## Legături
- Concepte catch-weight (greutate variabilă, conectare cântar, flux, model nou) → `knowledge/cantare-catch-weight.md`.
- Etichete de producție cu greutate + cod de bare → skill-ul `etichete-productie` + `knowledge/etichete-productie.md`; design etichetă → skill-ul `materiale-grafice`.
- Producție pe loturi (de unde vine greutatea la ieșirea din producție) → skill-ul `productie-flux`.
- Doctrina Chrome (deep-link, screenshot = livrabil) → `knowledge/condu-chrome.md`.
- Blocaj sau cântar nesuportat → `request_scale_integration` (aici) sau, pentru altă lipsă, `trimite_ticket_symbai`.
