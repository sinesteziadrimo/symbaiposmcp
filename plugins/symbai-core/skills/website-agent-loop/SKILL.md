---
name: website-agent-loop
description: "DEPRECAT — folosește `copiaza-website`. Vechiul loop builder/reviewer pentru import de website. A fost înlocuit de skill-ul `copiaza-website`, care pornește de la scopul ADEVĂRAT al site-ului (numitor independent prin sitemap/feed), ține o coadă durabilă pe disc, lucrează pe loturi cu sub-agenți și verifică obiectiv cu `clone_parity_diff` (nu se mai oprește la 20%). Acest skill rămâne doar ca pointer."
---

# website-agent-loop — DEPRECAT

Acest skill a fost înlocuit. Pentru a copia un website complet în Symbai (catalog mare, site întreg, „să nu se mai oprească până nu termină"), folosește:

## → `copiaza-website`

De ce noul skill rezolvă ce nu reușea ăsta:
- **Numitor onest:** `discover_site_inventory` numără scopul real din sitemap-index + feed-ul platformei (nu din 24 de pagini). Fără asta, „99% acoperit" putea însemna 20% din site.
- **Crawl pe server, hands-free:** `start_site_clone_crawl` ia tot site-ul în fundal (owner-ul poate închide laptopul), politicos + cache.
- **Coadă durabilă + sub-agenți:** lucrul e descompus în loturi mici, contextul liderului rămâne mic → rulează ore fără să piardă firul la compactare.
- **Poartă obiectivă:** `clone_parity_diff` întoarce ID-urile care LIPSESC; „gata" doar la 0 lipsă + `audit_shop_health` curat.

Vezi `../copiaza-website/SKILL.md` și `../copiaza-website/references/harness.md`.

Pentru onboarding rapid fără agent, folosește fluxul self-service din `Setări → General → Date & Mentenanță → Import website public`. Acesta se oprește la `review_required`; `copiaza-website` rămâne obligatoriu pentru fidelitate vizuală, remedierea porților și cutover-ul verificat.
