---
name: scrie-continut-marketing
description: Scrie postări organice, carusele, reels/TikTok, Stories, postări LinkedIn, idei și calendare de conținut calibrate pe nivelul de awareness al publicului și pe vocea brandului — dosarul de voce (vocea autorului, avatar de marketing și psihologic, povestea, fișa produsului), minimum 3 cârlige, CTA proporțional, verificare de autenticitate și încălzirea audienței înainte de vânzare. La „scrie-mi o postare", „fă-mi un carusel/reel", „idei de postări", „calendar de conținut", „vreau să încălzim audiența", „completează vocea brandului / avatarul clientului", „verifică postarea asta", „de ce nu prind postările".
---

# Scrie conținut de marketing

Ghiduri: `knowledge/postari-organice-awareness.md` (metoda completă), `knowledge/continut-marketing-video.md` (structură, emoție, video). Pentru biblioteci video pe etapele cumpărării folosește skill-ul `continut-video-vanzari`.

## Modul de lucru
A postare singulară · B idei · C calendar · D carusel · E reel/TikTok · F LinkedIn · G postare dintr-un brief de lansare · H audit al unei postări existente. Cerere clară → intri direct în mod; cerere generală → oferi meniul o dată.

## 1. Dosarul brandului
1. `list_brands` → brandId corect; `list_brand_memories(brandId)`.
2. Verifică cele cinci piese: vocea autorului, avatarul de marketing, avatarul psihologic, povestea/interviul autorului, fișa produsului.
3. Lipsesc piese de care depinde cererea? Cere-le într-un singur mesaj (sau propune un interviu scurt cu autorul) și salvează răspunsurile cu `upsert_brand_memory`, fără să ștergi ce era confirmat. Pentru idei generale poți continua cu presupuneri marcate.
4. Nu inventa povești, clienți, citate, cifre, prețuri, bonusuri sau termene. În afara textului publicabil marchează `[NEVALIDAT]` și `[LIPSĂ DATE — cere autorului]`.

## 2. Decizia strategică (internă)
Awareness → obiectiv → platformă → placement → format → stil editorial → CTA. Păstrează alegerile deja făcute de utilizator. Afișezi setup-ul doar compact, când ai făcut presupuneri, sau complet la cerere.

## 3. Scrie
- Minimum 3 cârlige cu unghiuri diferite, potrivite nivelului de awareness; integrezi cel mai natural și livrezi două alternative (dacă utilizatorul nu cere doar textul final).
- Structura internă potrivită (PAS, BAB, FAB, AIDA, STAR), fără etichete în text. O singură idee și un singur obiectiv.
- Problema cu situații concrete și impact real; emoție intenționată; beneficii pe roluri; dovadă reală; CTA proporțional cu awareness-ul.
- Adaptare pe platformă; același mesaj central pe mai multe canale.

## 4. Verifică
Mini-filtrul (avatar, voce, awareness ↔ CTA, nimic inventat, fără hype) + verificarea de autenticitate pentru texte publice (țintă ≥ 8/10, corectezi doar elementele slabe). Auditul profund prin ochii avatarului (6 dimensiuni) și verificarea în straturi se fac la cerere sau în modul H.

## 5. Pregătește în Symbai
- UTM: `configure_social_post_tracking` pe ciornă sau `create_marketing_tracking_link` pentru bio.
- Ciorne: `schedule_social_post` / `bulk_schedule_social_posts` — intră în așteptarea aprobării; publicarea urmează `programeaza-postare`.
- Grafică și video: `materiale-grafice`; reclame (numai pentru publicul încălzit): `gestioneaza-reclame`.

## 6. Încălzirea audienței (cont nou sau public rece)
3–4 săptămâni de conținut unaware/problem aware (recunoaștere ~40%, educație ~25%, problema rezolvată ~20%, oameni și poveste ~15%), cu CTA-uri mici. Apoi solution aware (demonstrații, comparații, cuvânt-cheie în mesaj) și abia la final ofertă către publicul încălzit. Revizuiește săptămânal cu `get_social_top_posts` și notează lecțiile în memoria `campaign_history`.

## Feedback
Feedbackul de voce devine VOICE DELTA și se propune ca actualizare a memoriei „Vocea autorului”; feedbackul strategic, de produs și punctual se tratează separat (vezi ghidul).

## Reguli
- Nimic nu se publică fără aprobarea omului; nu cheltui buget fără mandat. Organic ≠ reclamă.
- Datele din demo-uri sunt exemple, nu rezultate la clienți.
- Nu divulga în texte publice bugete, marje sau estimări interne.
- Diacritice corecte (ă, â, î, ș, ț) în tot textul.
