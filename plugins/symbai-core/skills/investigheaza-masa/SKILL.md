---
name: investigheaza-masa
description: Investighează ce s-a întâmplat pe o masă, o notă, o comandă sau ce a făcut un ospătar — anulări, discount-uri, transferuri, plăți, retur, cine a aprobat. Folosește la „ce s-a întâmplat la masa 5", „de ce s-a anulat nota X", „ce a făcut ospătarul Ion azi", „cine a dat discountul".
---

# Investighează o masă / notă / ospătar

Scop: să reconstruiești **cronologic** ce s-a întâmplat și să răspunzi clar, fără a arunca date brute.

## Pasul 1 (implicit) — `jurnal_activitate`

Folosește **`jurnal_activitate`** — citește jurnalul de activitate (audit log): cine / ce / când, cronologic. **Funcționează FĂRĂ acces SQL** (e tool dedicat) și acoperă: anulări, discount-uri, transferuri, retururi, oferit-gratis, plăți, aprobări/respingeri, modificări.

Cum filtrezi după întrebare:
- „ce s-a întâmplat la masa 5" → `jurnal_activitate(masa: "5")` (sau `cauta: "masa 5"`).
- „cine a anulat nota 1234" → `jurnal_activitate(tipEntitate: "order", idEntitate: "1234")`.
- „ce a făcut ospătarul Ion azi" → `jurnal_activitate(cauta: "Ion", perioada: "azi")`.
- „cine a aprobat discountul" → caută evenimentul de discount și citește câmpul `cine` + `detalii`.

Fără perioadă, întoarce cele mai recente potriviri (bun pentru investigații punctuale). Citește mereu `detalii` (e scris pentru oameni) și `modificari` (ce s-a schimbat: vechi → nou). Construiește un **răspuns narativ pe minute**:
> Masa 5, ospătar Mada — 19:12 deschisă, 19:40 adăugat 2× Pizza, 20:05 transfer la masa 8 (aprobat de Ana), 20:30 discount 10% (motiv: client fidel), 20:45 plată card 240 RON.

## Pasul 2 (opțional) — corelări complexe cu SQL

Dacă tokenul are acces SQL și ai nevoie de corelări pe care jurnalul nu le dă direct (ex. sume agregate pe o comandă), folosește `execute_sql_query` (doar SELECT): `list_database_tables` → `describe_database_table` → SELECT pe `orders` / `order_items` / `operation_requests` / `payments` / `audit_logs` cu coloane explicite + WHERE + LIMIT.

Dacă tokenul NU are SQL, `jurnal_activitate` acoperă marea majoritate a investigațiilor — nu mai e nevoie de SQL. Doar pentru analize chiar complexe spune-i utilizatorului că poate activa „Interogări SQL" din portal Hub → Acces AI.

## Reguli

- Cronologie strictă pe oră/minut; nume de ospătar/manager, nu ID-uri.
- Pentru „cine a aprobat" / „cine a anulat" — citește autorul (`cine`) din eveniment, nu presupune.
- Sume în RON. Nu dump-ui rânduri brute; sintetizează.
- Dacă nu găsești evenimentul, cere mai multe detalii (numărul mesei/notei, ora aproximativă) sau lărgește perioada.
