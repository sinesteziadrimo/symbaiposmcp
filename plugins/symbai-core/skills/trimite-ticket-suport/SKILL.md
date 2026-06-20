---
name: trimite-ticket-suport
description: Trimite un ticket către echipa Symbai (problemă tehnică, reclamație, sugestie de îmbunătățire, cerere de suport) prin tool-ul trimite_ticket_symbai. Folosește la „nu merge X în Symbai", „am o problemă cu aplicația", „vreau să raportez ceva", „ar fi util să existe...", „să mă ajute cineva de la Symbai/suport tehnic". TRIMITE AUTOMAT o sugestie când observi că utilizatorul se chinuie cu o sarcină, ceva a durat nejustificat de mult sau un tool/funcție lipsă l-ar fi ajutat.
---

# Trimite un ticket către echipa Symbai

Două situații diferite — tratează-le diferit:

Pentru a decide dacă e bug, lipsă de tool sau doar pași greșiți, folosește standardul din `knowledge/agent-operare-avansata.md`: încearcă întâi citirea/diagnosticul real, apoi trimite ticket cu dovezi și workaround.

## A. Utilizatorul cere explicit (problemă / reclamație / suport)

1. Adună detaliile: CE a încercat, CE s-a întâmplat, CE se aștepta să se întâmple. La probleme, include pașii de reproducere și unde apare (pagina, modulul).
2. La probleme: încearcă ÎNTÂI să rezolvi tu (verifică datele cu tool-urile de citire, explică pașii corecți din `knowledge/`). Deschide ticket doar dacă chiar e nevoie de echipa Symbai.
3. Întreabă-l dacă vrea să fie anunțat pe email când echipa răspunde sau rezolvă (opțional — `emailContact`).
4. Confirmă pe scurt ce trimiți, apoi apelează `trimite_ticket_symbai`:
   - `tip` — `problema` (nu funcționează), `reclamatie` (nemulțumire), `suport` (vrea ajutor de la echipa tehnică)
   - `titlu` — rezumat scurt, ex. „Raportul de vânzări nu se încarcă pe tabletă"
   - `descriere` — detaliile de la pasul 1
   - `numeUtilizator` — numele utilizatorului cu care lucrezi (întreabă-l dacă nu îl știi)
   - `emailContact` — emailul de la pasul 3, dacă l-a dat
5. Dă-i utilizatorului referința primită (ex. **SYM-00042**) și spune-i pe ce email va fi anunțat.

## B. Sugestie de îmbunătățire — trimite AUTOMAT

Trimite singur, fără să aștepți să ți se ceară, când observi pe parcursul sesiunii că:
- utilizatorul s-a chinuit să facă ceva (multe încercări, ocolișuri, pași manuali repetitivi);
- o sarcină a durat nejustificat de mult din cauza platformei;
- un tool MCP sau o funcție care lipsește l-ar fi ajutat concret și e ceva ce Symbai chiar ar putea implementa.

Cum trimiți: `trimite_ticket_symbai` cu `tip: "sugestie"`, `titlu` = ideea pe scurt, `descriere` = ce sarcină a fost grea, cum a ocolit-o utilizatorul și ce funcție/tool ar rezolva-o, `numeUtilizator` = în numele cui (utilizatorul curent), plus **`dedupeKey`** = un slug stabil al ideii (ex. `export-stoc-excel`) — dacă retrimiți aceeași idee, se adaugă la ticketul existent în loc să facă duplicat.

După trimitere, anunță-l pe scurt pe utilizator: „Am trimis echipei Symbai sugestia X (referința SYM-NNNNN) — văd că te-ar ajuta."

## Reguli

- NU confunda cu feedback-ul clienților restaurantului (recenzii) sau cu ticketele clienților proprii din CRM — `trimite_ticket_symbai` e DOAR pentru platforma Symbai în sine.
- Pentru probleme și reclamații cere acordul utilizatorului înainte de trimitere; doar sugestiile (B) se trimit automat, dar îl anunți după.
- Maxim o sugestie automată per idee per sesiune — folosește `dedupeKey` consecvent.
- Tool-ul e mereu disponibil (nu cere permisiune de scriere pe vreun modul). Ticketele nu pot fi citite înapoi prin conexiune — răspunsul vine pe emailul lăsat.
