---
name: conecteaza-meta
description: Ghidează conectarea contului Meta la Symbai — pagina Facebook, Instagram Business și contul de reclame — pas cu pas, cu verificare server-side după fiecare pas. Folosește la „vreau să-mi leg Facebook/Instagram/Meta", „nu se conectează Instagram", „leagă contul de reclame", „a expirat tokenul Facebook", „nu se mai publică postările". Merge și pentru TikTok/YouTube/LinkedIn/Google Business (aceiași pași, alt nume de platformă).
---

# Conectează Meta (Facebook + Instagram + reclame)

## Principii (citește întâi)

- **Adevărul vine din server, nu din browser.** Rulează `verifica_integrare("meta")` la început și **după FIECARE pas**. Tool-ul testează LIVE tokenurile pe API-ul Meta și îți spune exact ce lipsește + unde se rezolvă. Nu declara niciodată un pas reușit doar pentru că utilizatorul a zis „gata".
- **Zero parole prin tine.** Nu ceri și nu introduci niciodată parole sau coduri 2FA — login-ul în Facebook îl face utilizatorul singur, în browserul lui. Tokenurile NU trec prin chat: OAuth le trimite direct pe serverul Symbai.
- **Lucrezi doar pe ce lipsește.** Checklist-ul de la `verifica_integrare` îți dă ordinea; ce e deja OK sari peste.

## Cum lucrezi cu browserul (alege calea disponibilă)

1. **Ai tool-uri de browser** (extensia Claude in Chrome conectată)? Atunci navighează TU împreună cu utilizatorul: deschide link-urile, citește pagina ca să vezi unde e, ghidează-l click cu click. Utilizatorul face singur login-ul și click-ul final de aprobare.
2. **Nu ai browser?** Dă-i utilizatorului link-ul + instrucțiuni numerotate scurte (max 3-4 pași odată). Când se blochează, cere-i un **screenshot lipit în chat** — poți citi imagini și îi spui exact unde să apese.

## Pasul 0 — diagnostic

1. Dacă sunt mai multe branduri: `list_brands` → întreabă pentru care brand.
2. `verifica_integrare("meta")` → citește checklist-ul și anunță utilizatorul scurt: ce e deja legat, ce urmează.

## Pasul 1 — pagina Facebook

- **Precondiții pe partea Meta** (verbal, înainte de link): utilizatorul are nevoie de un cont Facebook personal care e **administrator al paginii** restaurantului. Dacă restaurantul nu are pagină → o creează întâi (facebook.com/pages/create) — pagină de business, nu profil personal.
- `genereaza_link_conectare("facebook")` → dă-i link-ul din `data.url` și spune-i EXACT:
  1. deschide link-ul în browserul unde e logat în contul care administrează pagina;
  2. în dialogul Meta, selectează **pagina restaurantului** (nu profilul personal; dacă are mai multe pagini, pe cea corectă);
  3. **bifează TOATE permisiunile** — orice debifare înseamnă postări eșuate mai târziu.
- Link-ul expiră după câteva minute — dacă utilizatorul a întârziat, generează altul fără să comentezi.
- Când zice că a terminat: `verifica_integrare("meta")`. Dacă tokenul e valid → confirmă și treci mai departe.

## Pasul 2 — Instagram Business

- **Precondiții**: contul Instagram trebuie să fie de tip **Business sau Creator** și **legat de pagina Facebook** (aplicația Instagram → Setări → Centrul de conturi; sau pagina FB → Setări → Conturi conectate). Dacă e cont personal, ghidează-l întâi să-l convertească (gratuit, 1 minut, din aplicația Instagram).
- Rulează `conecteaza_instagram_din_facebook` — legarea se execută direct pe server, fără link OAuth separat.
- La eroare, mesajul spune exact ce lipsește (cont negăsit pe pagină / permisiuni lipsă pe token). Tradu-l în pași concreți pentru utilizator; după ce rezolvă, rulează tool-ul din nou.

## Pasul 3 — contul de reclame (opțional)

- Doar dacă vrea promovări plătite (boost, campanii). Întreabă — nu-l forța.
- `genereaza_link_conectare("meta_ads")` → același ritual cu link-ul; aprobă cu contul care are acces la Business Manager / Ads Manager.
- După aprobare, conturile de reclame se importă automat; campaniile se fac din pagina Campanii Publicitare (`gaseste_in_aplicatie("campanii publicitare")`).

## Final

- `verifica_integrare("meta")` o ultimă dată → raportează checklist-ul complet verde + un test util: propune-i o primă postare cu skill-ul `programeaza-postare`.

## Capcane frecvente (spune-le PREVENTIV, nu după eșec)

- **Profil personal ≠ pagină.** Se conectează PAGINA de business; profilul personal nu poate publica prin API.
- **Instagram personal nu merge** — doar Business/Creator, legat de pagina FB.
- **Debifarea permisiunilor** în dialogul Meta = totul „merge" azi și pică la prima postare. Toate bifele.
- **Schimbarea parolei Facebook** sau un „security checkup" Meta invalidează tokenul → simptom: postări „eșuate" brusc. Soluția: Pasul 1 din nou (reconectare).
- **Mai multe pagini/restaurante**: fiecare brand Symbai se leagă la pagina lui — confirmă perechea brand↔pagină înainte de aprobare.

## Alte platforme (același tipar)

`verifica_integrare("tiktok"|"youtube"|"linkedin"|"google_business")` → `genereaza_link_conectare(platforma)` → re-verifică. TikTok e gestionat centralizat de Symbai — dacă tool-ul spune că lipsește configurarea centrală, trimite ticket cu `trimite_ticket_symbai`.

## Permisiuni

- `verifica_integrare` = citire, mereu disponibil.
- `genereaza_link_conectare` + `conecteaza_instagram_din_facebook` cer modulul de scriere „Marketing & Social Media" pe tokenul MCP — dacă lipsește, îndrumă spre portal Hub → Acces AI.
- Concepte (ce e o pagină, Business Manager, de ce trebuie cont Business etc.): `knowledge/integrari-meta.md`.
