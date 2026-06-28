---
name: controleaza-homeassistant
description: Controlează echipamentele clădirii (smart building) prin integrarea Home Assistant — ventilație, hotă, marchize/copertine, climatizare (VRF), lumini, prize, atracții loc de joacă, muzică, plus senzori de energie/solar — direct din Symbai, prin conexiune (MCP), pentru fiecare unitate în parte. Folosește la „pornește ventilația", „oprește hota", „deschide/închide marchizele", „aprinde luminile la terasă", „ridică temperatura la VRF/AC", „ce e pornit acum / ce consum am", „stinge tot la închidere", „pornește muzica la parter", „adaugă-mi echipamentul X în panou", „conectează Home Assistant la unitatea Y", „de ce nu văd dispozitivele", „controlează caruselul/trenulețul din locul de joacă". Fiecare client își conectează propriul Home Assistant la o unitate și își adaugă propriile echipamente.
---

# Control smart-building prin Home Assistant — hands-free, prin conexiune (MCP)

Userul (proprietar/manager) vrea să vadă și să controleze echipamentele clădirii din Symbai, fără să umble printr-o altă aplicație. Tu faci treaba prin **tool-urile MCP** (citești starea reală și trimiți comenzi pe instanța lui de Home Assistant), îl duci la **pagina dedicată** prin deep-link și-i **arăți pe ecran** rezultatul. Integrarea e **per unitate (locație)**: fiecare local își conectează propriul Home Assistant și își alege ce echipamente apar în panou.

## Înainte de orice
1. Citește la nevoie **`knowledge/home-assistant.md`** (ce e integrarea, categoriile de echipamente, politica de control, ce poți și ce nu poți face) și **`knowledge/condu-chrome.md`** (doctrina: MCP întâi, deep-link, screenshot = livrabil).
2. **Context per unitate**: integrarea e legată de o **locație**. La un singur local, tool-urile o deduc singure; la mai multe, ia `locationId` cu `list_locations` (sau întreabă „la care unitate?") și pasează-l în tool-uri.
3. **Conectarea** se face o singură dată, din **Setări → Integrări → Home Assistant**: alegi unitatea, pui adresa Home Assistant (ex: `http://192.168.1.10:8123`) + un **Long-Lived Access Token** (din Home Assistant → Profil → Securitate), apeși **Testează** și **Salvează**. Dacă userul nu e conectat încă, ghidează-l acolo — tu nu poți introduce tokenul prin MCP (e secret, se scrie doar din pagină).
4. **Navigare**: pagina e **`/integrations/home-assistant`**. Du-te direct (`navigate("/integrations/home-assistant")`), nu căuta prin meniuri. Link live: `gaseste_in_aplicatie("home assistant")`.

## Cele două surse de adevăr
- **Tool-urile MCP** de mai jos = stare LIVE + comenzi reale pe echipamentele lui.
- **Pagina dedicată** = panoul vizual unde userul vede tot, grupat pe categorii, și controlează cu degetul. Tu folosești MCP-ul; pagina e ce-i ARĂȚI.

## Fluxul: ce tool pentru ce cere userul

Întâi citește (`home_assistant_list_devices`) ca să iei `entityId`-ul corect, apoi acționează. Tabel intenție → tool:

| Userul spune… | Tool MCP | Note |
|---|---|---|
| „ce dispozitive am", „ce e pornit acum", „ce ventilatoare/marchize am", „ce consum am" | `home_assistant_list_devices` (opțional `locationId`, `controllableOnly`, `category`, `domain`, `state`, `search`) | Întoarce starea curentă grupată pe categorii + politica de control (`controlPolicy`). |
| „pornește/oprește X", „deschide/închide marchizele", „aprinde lumina la terasă", „ridică temperatura la VRF" | `home_assistant_control` (`entityId`, `action`, opțional `value`, `option`, `locationId`) | `action`: turn_on/turn_off/toggle, open/close/stop, set_position, set_percentage, set_brightness, set_temperature, set_value, select_option, run, press, lock/unlock, arm_away/disarm, start/dock… `value` = procent/grade; `option` = mod/opțiune text. |
| „stinge tot", „oprește toate luminile la închidere", „închide toate marchizele", „pornește toată ventilația" | `home_assistant_bulk_control` (`action`, opțional `category`, `domain`, `locationId`) | Aplică o acțiune pe TOATE echipamentele dintr-o categorie/tip. Ideal la deschidere/închidere. |
| „cum stă Home Assistant", „e conectat", „câte dispozitive am" | `home_assistant_get_status` (opțional `locationId`) | Stare conexiune + versiune + număr de entități. |
| „adaugă-mi echipamentul X în panou", „pune și senzorul de energie", „vreau hota în panou" | `home_assistant_add_equipment` (`entityId` sau `equipment[]` cu `label`/`category`/`icon`) | Curatorează ce apare în panoul unității, cu etichetă prietenoasă și categorie. |
| „scoate echipamentul X din panou", „ascunde dispozitivul Y" | `home_assistant_remove_equipment` (`entityId`, opțional `locationId`) | Scoate un echipament din panoul curatat (nu-l șterge din Home Assistant). |

## Categoriile de echipamente (auto-detectate, pot fi schimbate la „adaugă echipament")
Ventilație · Hotă · Climatizare / VRF · Marchize / Terasă · Lumini · Loc de joacă · Muzică · Energie / Solar · Altele. Symbai le grupează singur după nume + tip; userul poate reeticheta sau muta orice echipament în altă categorie.

## ⚠ Siguranță — politica de control (decisă de client în Setări)
`home_assistant_list_devices` întoarce câmpul **`controlPolicy`**:
- **`confirm`** (recomandat): CERE confirmarea userului ÎNAINTE de a porni/opri ceva — ex. „Confirmi că pornesc hota la bucătărie?". Abia după „da" apelezi `home_assistant_control`.
- **`direct`**: execuți imediat, fără confirmare.
Indiferent de politică, pentru acțiuni perturbatoare (loc de joacă, hotă, ventilație, lazer-tag) confirmă dacă cererea pare neașteptată. Niciodată nu porni echipamente „de probă" fără acordul userului — sunt dispozitive fizice reale într-un local cu clienți.

## Verifică REAL după comandă
După `home_assistant_control`/`bulk_control`, tool-ul întoarce noua stare (`newState`). Spune-i clar userului ce s-a întâmplat („Hota e acum pornită."). Dacă userul vrea să VADĂ, deschide `/integrations/home-assistant`, comută pe unitatea corectă și fă-i screenshot.

## Dacă nu e conectat / nu vede dispozitive
- Tool-ul răspunde „Home Assistant nu este conectat/activat pentru această unitate" → trimite userul la **Setări → Integrări → Home Assistant**, alege unitatea, pune adresa + token, Testează, Salvează, comută „Integrare activă" pe pornit.
- „Văd doar o parte din dispozitive" → în panou apar implicit doar cele controlabile; senzorii (energie/solar) se adaugă manual cu **Adaugă echipament** (sau `home_assistant_add_equipment`).
- 401 / „token respins" → tokenul a expirat sau e greșit; regenerează un Long-Lived Access Token în Home Assistant și salvează-l din nou.

## Multi-unitate
Fiecare unitate are propriul Home Assistant și propriul panou. Când userul are mai multe locații, întreabă/derivă `locationId` și pasează-l în fiecare tool. În pagină există un selector de unitate sus.
