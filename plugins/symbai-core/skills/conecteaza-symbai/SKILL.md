---
name: conecteaza-symbai
description: Configurează sau repară automat conexiunea MCP Symbai pentru Codex ori Claude Code prin Symbai Connect + OAuth nominal. Folosește când tool-urile Symbai nu apar, accesul este refuzat, apare 401 sau utilizatorul schimbă calculatorul.
---

# Conectează sau repară Symbai

Scop: serverul `symbai` să apară conectat și să funcționeze direct, fără configurare tehnică făcută de utilizator.

## Fluxul unic pentru angajat

1. Proprietarul intră în Hub → **Acces AI**, alege angajatul și locația POS exacte, selectează permisiunile și acordă accesul.
2. Angajatul intră în POS cu propriul cont și deschide **Conectează un asistent AI**.
3. Descarcă ultimul **Pachet personalizat Symbai Connect** pentru sistemul său și îl instalează pe calculatorul pe care va lucra.
4. În panoul Symbai Connect apasă **Conectează** lângă Codex sau Claude Code.
5. Browserul se deschide automat. Angajatul se autentifică prin OAuth cu emailul și parola contului POS, nu cu PIN-ul de la casă, apoi aprobă accesul.
6. Symbai Connect configurează aplicația și mută în siguranță rezultatul OAuth în profilul angajatului. După confirmarea succesului, angajatul deschide o sesiune nouă în Codex sau Claude Code.

Nu cere niciodată utilizatorului să editeze fișiere, să ruleze comenzi MCP sau să copieze un mesaj, URL, cod, header ori token. Nu trimite tokenul proprietarului unui angajat.

## Verificare

1. Confirmă că pluginul `symbai-core` este instalat și activ.
2. Deschide o sesiune nouă după conectare.
3. Apelează `list_brands`; un răspuns valid confirmă conexiunea.
4. Dacă un tool spune „permisiune insuficientă”, conexiunea funcționează: proprietarul verifică modulul acordat, iar rolul și alocările POS live pot limita suplimentar accesul.

## Recuperare

- **Acces neacordat, expirat sau revocat:** proprietarul acordă din nou accesul nominal în Hub; angajatul descarcă și instalează ultimul Pachet personalizat din POS, apoi reia OAuth din **Conectează**.
- **Angajat inactiv:** proprietarul reactivează contul POS, acordă accesul nominal și angajatul reinstalează ultimul Pachet personalizat.
- **Calculator schimbat sau instalare mutată:** instalează ultimul Pachet personalizat pe noul calculator; acesta îl înlocuiește automat pe cel vechi.
- **401:** redeschide Symbai Connect și apasă din nou **Conectează** pentru OAuth.
- **Configurație manuală veche detectată:** Symbai Connect indică intrarea veche `symbai`; elimină doar acea intrare din lista MCP, apoi apasă **Conectează**. Nu afișa utilizatorului comenzi sau configurații.
- **Doar PIN disponibil:** utilizatorul își setează parola contului din Personal, apoi reia OAuth.

Accesul POS nu înlocuiește grantul proprietarului. Accesul final este intersecția dintre grant, consimțământul OAuth, rolul POS live și alocările live. Nu ocoli o permisiune lipsă prin SQL sau clickuri riscante.
