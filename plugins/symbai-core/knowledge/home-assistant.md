# Home Assistant — control smart-building din Symbai

Integrarea **Home Assistant** aduce echipamentele clădirii în Symbai: le vezi și le controlezi dintr-un panou, per unitate, și le poți comanda și prin asistentul AI (Sym) sau din Claude Code. E gândită pentru localuri care au deja un sistem de automatizare (Home Assistant) cu: ventilatoare, hote, marchize/copertine, climatizare (VRF/AC), lumini, prize inteligente, atracții la locul de joacă, sisteme de muzică, panouri solare și senzori de energie.

## La ce folosește
- **Panou de control vizual** pe categorii — pornești/oprești, deschizi/închizi, reglezi viteza, poziția sau temperatura, dintr-un singur loc.
- **Control prin AI** — îi spui lui Sym „stinge tot la închidere" sau „pornește ventilația în bucătărie" și execută (cu confirmare, dacă așa ai setat).
- **Control din Claude Code** — dacă folosești asistentul în Claude Code, primește aceleași unelte prin serverul MCP al magazinului.
- **Monitorizare** — vezi starea live (pornit/oprit/poziție/temperatură) și valorile senzorilor (consum, producție solară), reîmprospătate automat.

## Cum se conectează (per unitate)
Integrarea e **separată pentru fiecare unitate (locație)** — fiecare local își leagă propriul Home Assistant.
1. **Setări → Integrări → Home Assistant**.
2. Alege **unitatea**.
3. Pune **adresa** Home Assistant (ex: `http://192.168.1.10:8123` sau adresa publică/Nabu Casa) și un **Long-Lived Access Token** (îl generezi în Home Assistant: click pe profil, jos la **Long-Lived Access Tokens → Create Token**).
4. **Testează conexiunea** (vezi versiunea + câte dispozitive ai), apoi **Salvează** și pornește **Integrare activă**.
Tokenul se păstrează **criptat** și nu mai poate fi citit înapoi — ca să-l schimbi, introduci unul nou.

## Pagina dedicată
**Integrări → Home Assistant** (`/integrations/home-assistant`): selector de unitate sus, apoi echipamentele grupate pe categorii. Fiecare „cartonaș" arată numele, starea curentă și controlul potrivit:
- **Întrerupătoare / prize / lumini** → buton pornit/oprit (luminile au și reglaj de intensitate).
- **Ventilatoare** → pornit/oprit + reglaj viteză.
- **Marchize / copertine / rulouri** → deschide / oprește / închide + poziție.
- **Climatizare / VRF** → temperatura curentă + reglaj setpoint și mod.
- **Hotă / vane** → deschide / închide.
- **Scene / scripturi / butoane** → rulează / apasă.
- **Senzori (energie, solar, temperatură)** → valoare în timp real (doar citire).

## Categorii
Symbai grupează automat echipamentele după nume și tip în: **Ventilație, Hotă, Climatizare / VRF, Marchize / Terasă, Lumini, Loc de joacă, Muzică, Energie / Solar, Altele**. Poți reeticheta sau muta orice echipament în altă categorie când îl adaugi în panou.

## Adaugă-ți propriile echipamente
Apasă **„Adaugă echipament"** (sau cere-i lui Sym). Cauți printre toate dispozitivele tale din Home Assistant (inclusiv senzorii de energie/solar, care nu apar implicit), le dai o etichetă prietenoasă și o categorie, și apar în panou. Panoul afișează implicit doar echipamentele controlabile; senzorii îi alegi tu.

## Siguranță: politica de control pentru AI
La fiecare unitate alegi cum se comportă asistentul AI când i se cere să pornească/oprească ceva (Setări → Integrări → Home Assistant):
- **Cere confirmare** (recomandat) — Sym întreabă „Confirmi că pornesc hota?" înainte să execute.
- **Execută direct** — fără confirmare.
Setarea se transmite automat în instrucțiunile asistentului. Din **pagină**, comenzile se execută direct (ca pe orice panou smart-home), cu o confirmare scurtă la acțiunile perturbatoare (loc de joacă, hotă, ventilație).

## Ce poate face AI-ul (Sym / Claude Code)
- „Ce dispozitive am / ce e pornit / ce consum am acum?"
- „Pornește/oprește/comută X", „deschide/închide marchizele", „ridică temperatura la VRF la 22°".
- „Stinge tot" / „oprește toate luminile" / „închide toate marchizele" (control în masă, pe o categorie).
- „Adaugă-mi echipamentul X în panou."
- Pentru ca Claude Code să poată controla, tokenul MCP al magazinului trebuie să aibă activat modulul **Home Assistant** (din portalul Hub → Acces AI).

## Limite și depanare
- **Nu vezi pagina** → ai nevoie de permisiunea de **Setări** (rol cu acces la setări).
- **„Nu este conectat / activat"** → completează adresa + token în Setări și pornește integrarea pentru acea unitate.
- **401 / „token respins"** → tokenul a expirat sau e greșit; generează altul în Home Assistant și salvează-l.
- **Văd doar o parte din dispozitive** → în Home Assistant, dispozitivele controlabile apar automat; senzorii îi adaugi manual.
- **Adresa trebuie să fie accesibilă** din rețea de către serverul Symbai (adresă publică, Nabu Casa, sau tunel) — un IP local privat funcționează doar dacă serverul îl poate atinge.
- Ștergerea unui echipament din panou (sau a dispozitivului din Home Assistant) nu se face din Symbai — din panou doar îl scoți din listă.
