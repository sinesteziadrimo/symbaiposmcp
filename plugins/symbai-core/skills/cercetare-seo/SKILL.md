---
name: cercetare-seo
description: Cercetare SEO prin MCP — keyword research (volum, dificultate, intenție), trafic din Search Console, concurenți (share of voice), research pe piață/oraș, idei de conținut. La „ce cuvinte-cheie să țintesc", „cine sunt concurenții mei în Google", „dă-mi idei de articole", „ce caută oamenii".
---

# Cercetare SEO — cuvinte-cheie, concurenți, trafic, idei

Faci research ca un analist SEO senior: găsești cuvintele potrivite, înțelegi traficul real, vezi ce fac concurenții și propui idei pe care businessul chiar le poate câștiga. Totul prin **conexiune (MCP)**, onest despre surse.

## Citește întâi
- `knowledge/keyword-research-2026.md` (metodă: intenție din SERP, pillar/cluster, KD, surse gratuite, competitor gap) — referința principală.
- `knowledge/geo-aeo.md` (gap de vizibilitate AI), `knowledge/seo-2026.md` (context + esențiale RO), `knowledge/local-seo-horeca.md` (pentru businessuri locale).

## Ce tool pentru ce vrea userul

| Userul spune… | Tool MCP |
|---|---|
| „ce cuvinte-cheie să țintesc pe subiectul X" | `seo_keyword_research(seed)` — volum/dificultate (provider plătit) SAU idei reale din Search Console (fallback gratuit) |
| „ce surse de date am / pot vedea volume exacte?" | `get_seo_provider_status` (rulează-l ÎNTÂI; fii onest) |
| „pe ce apar deja în Google / ce trafic e pe fiecare cuvânt" | `get_search_performance` (top interogări + pagini, cu poziție/CTR — date reale) |
| „cum stau la SEO în general" | `get_seo_overview` |
| „ce cuvinte urmăresc / pe ce poziție sunt" | `list_seo_keywords`, `get_keyword_rankings(id)` |
| „cine sunt concurenții mei" | `list_seo_competitors`, `suggest_seo_competitors` (din capturile SERP) |
| „ce fac concurenții / ce acoperă ei" | `seo_web_research(query, jobType:"competitor_audit", competitors:[...])` |
| „cercetează piața/orașul/tendințele" | `seo_web_research(query, jobType:"blog_research" sau "trend_scan", countryCode:"ro")` |
| „dă-mi idei de articole" | `seo_web_research(jobType:"post_ideas")` + brief-uri pe cele bune |

## Fluxul tipic

1. **Vezi ce surse ai:** `get_seo_provider_status`. Spune userului dacă volumele vor fi exacte (provider plătit) sau estimative (gratuit) — nu prezenta estimări drept cifre Google.
2. **Pornește de la trafic real:** `get_search_performance` → cuvinte la poziția ~8-20 cu impresii = „striking distance" (cele mai rapide câștiguri).
3. **Extinde:** `seo_keyword_research(seed)` pentru fiecare temă; clasifică intenția citind SERP-ul (vezi knowledge). Pentru local, ține minte: cuvintele cu Map Pack cer GBP, nu articol.
4. **Concurenți:** `add_seo_competitor(domain)` pentru rivalii LOCALI reali → `list_seo_competitors` (share of voice) → `seo_web_research(competitor_audit)` ca să vezi ce acoperă. Caută gap-uri (ei rankează / sunt citați AI, tu nu).
5. **Pune pe urmărire + măsoară:** `track_seo_keyword(keywords[...])` (cu `targetPosition`, `intent`) → `run_rank_tracker` (necesită provider SERP) → vezi pozițiile cu `list_seo_keywords`.
6. **Propune un plan:** prezintă userului 5-10 „quick wins" (volum decent, dificultate mică, intenție potrivită) + idei de articole grupate pe pillar/cluster. Cere-i să confirme prioritățile.

## Reguli
- **Onest despre surse** — `get_seo_provider_status` întâi; nu inventa volume.
- **Concurenți LOCALI reali**, nu lanțuri naționale (au autoritate de neegalat și alt SERP).
- **Long-tail pentru site-uri mici** — KD < 30; cuvintele cu volum mic aduc clienți în local.
- **Research web costă** din bugetul brandului — refolosește cu `list_research_jobs` în loc să repeți.
- Citirile merg oricum; `seo_keyword_research`/`seo_web_research`/`track_seo_keyword`/`run_rank_tracker` cer modulul „Marketing & Social Media".
