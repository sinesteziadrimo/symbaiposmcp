---
name: conecteaza-meta
description: Conectează contul Meta la Symbai pas cu pas (pagina Facebook, Instagram Business, contul de reclame), cu verificare după fiecare pas; la fel TikTok/YouTube/LinkedIn/Google Business. La „leagă-mi Facebook/Instagram", „nu se conectează Instagram", „a expirat tokenul Facebook", „nu se mai publică postările".
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

1. Identifică brandul cerut prin `list_brands`; întreabă numai dacă acesta nu reiese din cerere. Identifică pagina dorită prin nume și ID; nu deduce asocierea din asemănarea numelor sau ordinea paginilor.
2. `list_social_accounts(brandId)` → citește `platformAccountId` și numele paginii. `verifica_integrare(serviciu:"meta",brandId,expectedFacebookPageId)` compară pagina salvată și identitatea live cu ID-ul dorit. Dacă ID-ul dorit încă nu este cunoscut, diagnostichează fără el și clarifică pagina înainte de confirmarea conectării. Un token valid nu dovedește alegerea paginii corecte.

## Pasul 1 — pagina Facebook

- **Precondiții pe partea Meta** (verbal, înainte de link): utilizatorul are nevoie de un cont Facebook personal care e **administrator al paginii** restaurantului. Dacă restaurantul nu are pagină → o creează întâi (facebook.com/pages/create) — pagină de business, nu profil personal.
- `genereaza_link_conectare(platforma:"facebook",brandId)` → linkul stabil din `data.url` deschide **Conturi Social Media** pentru brand. Nu îl prezenta ca URL OAuth temporar și nu-l reconstrui. Ghidează în acești pași:
  1. deschide linkul autentificat în Symbai, verifică brandul și apasă **Conectează Facebook**;
  2. în dialogul Meta, acordă acces paginii dorite și **păstrează accesul paginilor folosite de celelalte branduri**, împreună cu permisiunile cerute;
  3. după revenirea în Symbai, **alege explicit pagina acestui brand** după nume și ID și confirmă alegerea.
- Dacă autorizarea ori alegerea expiră, repornește conectarea din Conturi Social Media. La un link deteriorat, folosește aceeași pagină; nu repara manual parametrul de autorizare și nu cere tokenuri prin chat.
- Dacă este legată pagina greșită: apasă **Schimbă pagina** pe cardul Facebook al brandului și alege pagina dorită. **Deconectează** din Symbai elimină numai asocierea locală a acelui cont; revocarea aplicației din Meta poate afecta și alte branduri. Nu recomanda revocarea comună pentru corectarea unei singure pagini.
- Dacă versiunea instalată nu oferă selectorul, nu promite că asocierea s-a reparat; raportează limita prin suport. Nu debifa paginile celorlalte branduri ca ocolire.
- După salvare: `verifica_integrare(serviciu:"meta",brandId,expectedFacebookPageId)` → confirmă doar dacă ID-ul dorit, ID-ul salvat și identitatea live corespund. Simpla aprobare Meta nu încheie conectarea.

## Pasul 2 — Instagram Business

- **Precondiții**: contul Instagram trebuie să fie de tip **Business sau Creator** și **legat de pagina Facebook** (aplicația Instagram → Setări → Centrul de conturi; sau pagina FB → Setări → Conturi conectate). Dacă e cont personal, ghidează-l întâi să-l convertească (gratuit, 1 minut, din aplicația Instagram).
- După confirmarea paginii Facebook corecte, rulează `conecteaza_instagram_din_facebook(brandId,expectedFacebookPageId)` — legarea se execută direct pe server, fără link OAuth separat. Nu copia automat ID-ul paginii greșite doar ca să treci verificarea.
- După schimbarea paginii Facebook verifică și Instagram: vechea conexiune poate avea încă un token valid, dar poate aparține paginii anterioare. Diagnosticul compară pagina asociată și ID-ul Instagram live; nu modifica automat alte branduri.
- La eroare, mesajul spune exact ce lipsește (cont negăsit pe pagină / permisiuni lipsă pe token). Tradu-l în pași concreți pentru utilizator; după ce rezolvă, rulează tool-ul din nou.

## Pasul 3 — contul de reclame (opțional)

- Doar dacă vrea promovări plătite (boost, campanii). Întreabă — nu-l forța.
- `genereaza_link_conectare("meta_ads")` → același ritual cu link-ul; aprobă cu contul care are acces la Business Manager / Ads Manager.
- După aprobare, conturile de reclame se importă automat; campaniile se fac din pagina Campanii Publicitare (`gaseste_in_aplicatie("campanii publicitare")`).

## Final

- `verifica_integrare(serviciu:"meta",brandId,expectedFacebookPageId)` o ultimă dată → raportează pagina confirmată și starea reală a funcțiilor cerute. Nu afirma că totul este verde dacă mai există lipsuri. Dacă utilizatorul dorește, propune o primă postare cu skill-ul `programeaza-postare`.

## Capcane frecvente (spune-le PREVENTIV, nu după eșec)

- **Profil personal ≠ pagină.** Se conectează PAGINA de business; profilul personal nu poate publica prin API.
- **Instagram personal nu merge** — doar Business/Creator, legat de pagina FB.
- **Debifarea permisiunilor** în dialogul Meta = totul „merge" azi și pică la prima postare. Toate bifele.
- **Schimbarea parolei Facebook** sau un „security checkup" Meta invalidează tokenul → simptom: postări „eșuate" brusc. Soluția: Pasul 1 din nou (reconectare).
- **Mai multe pagini/restaurante**: fiecare brand Symbai se leagă la pagina lui — confirmă perechea brand↔pagină înainte de aprobare.

## Alte platforme (același tipar)

`verifica_integrare("tiktok"|"youtube"|"linkedin"|"google_business")` → `genereaza_link_conectare(platforma)` → re-verifică. TikTok e gestionat centralizat de Symbai — dacă tool-ul spune că lipsește configurarea centrală, trimite ticket cu `trimite_ticket_symbai`.

## Permisiuni

- `verifica_integrare` = citire `setari`; cere grantul `readModule` aferent.
- `genereaza_link_conectare` + `conecteaza_instagram_din_facebook` cer modulul de scriere „Marketing & Social Media" pe tokenul MCP — dacă lipsește, îndrumă spre portal Hub → Acces AI.
- Concepte (ce e o pagină, Business Manager, de ce trebuie cont Business etc.): `knowledge/integrari-meta.md`.
