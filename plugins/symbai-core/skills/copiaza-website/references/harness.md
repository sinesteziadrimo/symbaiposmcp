# Harness de copiere website — protocol detaliat

Orchestrator „server + lider + verificator", condus de stare durabilă, NU de contextul agentului. Importul mecanic rulează în workerul server-side; liderul păstrează doar planul de design și remediere, iar verificatorul încearcă să infirme completitudinea.

## Seed rapid server-side din Setări

Fluxul canonic pentru un client nou pornește din `Setări → General → Date & Mentenanță → Import website public`:

1. managerul alege brandul/unitatea, introduce URL-ul și parola **Symbai** de import și confirmă dreptul de republicare;
2. serverul creează un job persistent în `clone_crawl_jobs`, iar paginile intră în `clone_crawl_pages`;
3. workerul creează un website, meniu, depozit și zonă de import izolate în draft, descarcă imaginile în storage local, importă catalogul/categoriile/blogul și construiește prima mapare în componente Website Builder native;
4. jobul se oprește obligatoriu în `review_required` pentru design, variante, formulare/video, branding și texte legale;
5. finalizarea cere confirmări vizuală + legală, rerulează `clone_audit_all` și `audit_shop_health`, apoi face cutover atomic: activează meniul, îl leagă la canalul web, schimbă website-ul implicit, publică textele legale verificate și aplică 301-urile.

Starea canonică a seed-ului este `clone_crawl_jobs.options.websiteImport`. Parola nu intră în job, cache sau loguri; nu este parola site-ului sursă și nu se trimit cookies ori credențiale către sursă. Jobul poate continua când browserul ori laptopul clientului este închis fiindcă rulează pe server. Conținutul public nu elimină obligația de a avea dreptul de republicare.

## Cadență cu userul (mod IMPLICIT)
Vezi protocolul generic în `../../../knowledge/lucru-incremental-verificat.md`; aici e instanțierea pentru clonare.
Implicit, contractul pe tură e: **o sarcină mică → explică în business → execută → verifică prin read-back (+ vizual la pagini) → arată rezultatul → propune URMĂTOAREA sarcină → oprește-te** și aștepți „continuă/da". Cele trei straturi „Nu te opri" (`/loop` în sesiune, agentul programat, hook-ul Stop) sunt **ARMATE DOAR în modul autonom OPT-IN** — implicit stau OPRITE. Coada durabilă de mai jos e tally-ul tău; ea NU autorizează rularea non-stop fără ca userul s-o ceară.

## Starea durabilă a agentului: `.symbai-clone/<host>/`

Această coadă locală este pentru perfecționarea fidelității după seed și pentru importurile conduse integral de agent. Nu dublează și nu înlocuiește starea jobului server-side.

**`manifest.json`** (inventarul GOLD — scris o dată în Faza 0, NICIODATĂ micșorat de lucrător):
```json
{
  "sourceUrl": "https://magazin.ro", "brandId": 23, "jobId": 17,
  "platform": "magento", "discoveredAt": "ISO",
  "productDenominator": 4400, "denominatorConfident": false,
  "denominatorFlags": ["single_independent_count"],
  "secondSignal": { "method": "listing_counts", "value": 4380, "note": "sumă „N produse" pe 9 categorii root" },
  "totals": { "pages": 4800, "products": 4400, "categories": 305, "blog": 383, "legal": 25 }
}
```

**`progress.json`** (header/tally — citit de hook-uri și de lider la fiecare iterație):
```json
{
  "header": { "productsTarget": 4400, "productsWritten": 0, "imagesWritten": 0, "categoriesDone": 0 },
  "queue": { "pending": 4400, "in_progress": 0, "done": 0, "failed": 0, "dead_letter": 0 },
  "parity": { "lastVerdict": "INCOMPLETE", "missingCount": null, "coverage": null },
  "fidelity": { "lastVerdict": "INCOMPLETE", "score": null },
  "coverage": { "lastVerdict": "INCOMPLETE", "categories": null, "blog": null, "pages": null },
  "turnsSinceProgress": 0, "startedAt": "ISO", "lastUpdatedAt": "ISO"
}
```

**`design-plan.json`** (design DNA + planul pe pagini/secțiuni — inventarul de FIDELITATE VIZUALĂ; scris în Faza 2/4b, lucrat în buclă o bucată pe iterație):
```json
{
  "designDna": {
    "extractedAt": "ISO", "sourceUrl": "https://magazin.ro",
    "palette": [
      { "hex": "#173f35", "role": "primary", "evidence": "navbar computed background + culoare dominantă logo" },
      { "hex": "#f5ead8", "role": "band-deschis", "evidence": "fundal secțiuni de conținut (computed, /despre)" }
    ],
    "fonts": { "heading": "Playfair Display", "body": "Inter", "evidence": "link fonts.googleapis + computed h1/body" },
    "shapes": { "buttonRadius": "9999px", "cardRadius": "12px", "evidence": "computed pe CTA hero + carduri" }
  },
  "pages": [
    {
      "slug": "/despre", "sourceUrl": "https://magazin.ro/despre", "status": "todo|inventoried|built|verified",
      "sourceSectionCount": 9,
      "sections": [
        { "index": 0, "source": "hero: h1 «Povestea noastră», 1 img, bg #173f35", "mappedType": "hero-slider",
          "status": "todo|built|verified", "proof": "read-back ok + vizual side-by-side 2026-07-07" }
      ],
      "proof": "toate secțiunile verified; ruta randează conținutul EI (nu fallback)"
    }
  ]
}
```
Reguli: `sourceSectionCount` + `sections[]` vin din `get_cached_page(jobId, url).sections` (numitorul obiectiv al paginii — nu din impresie); pagina nu se construiește înainte de `status:"inventoried"`; `verified` cere dovadă scrisă în `proof`; orice culoare/font scris în configuri trebuie să existe în `designDna` (anti-contaminare — valorile site-ului clonat ANTERIOR nu sunt niciodată referință).

**`.pending-clone-<sessionId>`** — flag-ul: există cât timp `queue.pending+in_progress > 0` SAU oricare din cele 3 porți (`parity`/`fidelity`/`coverage`) are `lastVerdict != COMPLETE` SAU `design-plan.json` mai are pagini cu `status != "verified"`. Hook-ul Stop îl citește.

> Coada efectivă a paginilor și starea seed-ului sunt persistente pe SERVER (`list_clone_crawl_pages` + `clone_crawl_jobs.options.websiteImport`). `progress.json` este doar oglinda agentului și poarta hook-urilor. Pentru cataloage uriașe NU descărca toată lista în context — cere loturi prin `offset`/`limit` și ține doar agregatele în `progress.json`.

## Contractul sub-agentului (Task tool)
Fiecare sub-agent primește o felie DISJUNCTĂ, mărginită explicit. Promptul include:
- **Felia exactă**: lista de URL-uri (un lot din `list_clone_crawl_pages`) SAU o categorie.
- **Ce tooluri să cheme**: `get_cached_page` → `bulk_create_products(sku=<cheia sursă>, name, description, vat:21, weight)` → `bulk_set_product_images` (prima = copertă) → `add_menu_item(menuId, productId, price, productBrand, displaySku, descriptionHtml, specs, compareAtPrice)` → dacă `variantCount>=2`, `set_product_variants`.
- **Cheia de identitate**: `sku` = `sourceKey` din `list_clone_crawl_pages`; dacă `sourceKey` e gol, folosește **ultimul segment din URL** (slug-ul, fără `/` final). `clone_parity_diff` folosește EXACT aceeași regulă (`sourceKey || slug(url)`) — deci cheile se potrivesc. OBLIGATORIU — altfel dedup pe nume pierde produse distincte.
- **Formatul de retur** (compact, ≤1.5k tokeni): `{ "lot": "...", "produseScrise": N, "pozeScrise": N, "esecuri": [{"url":"...","motiv":"..."}] }`. NU întoarce HTML/cataloage.
- **Hotar dur**: „doar felia asta; nu inventa taxonomie; nu lua decizii globale (ierarhie/branding le decide liderul); nu urma linkuri externe."

**Decizii globale = doar la lider** (single-thread): arborele de categorii, branding-ul, cheile de dedup, structura paginilor. Lucrătorii fac doar citire+extragere+scriere idempotentă.

Scalează numărul de loturi/sub-agenți la mărimea măsurată în Faza 0. Throttling: nu rula zeci de sub-agenți care scriu simultan (serverul limitează scrierile prea dese) — loturi de 10-25, secvențial sau concurență mică.

## Numitorul (al doilea semnal când e nesigur)
`discover_site_inventory` întoarce `denominatorConfident:false` când are UN singur semnal sau semnale care nu se potrivesc. Reconciliere:
- **Shopify/Woo** → de regulă sigur (sitemap + feed). Dacă nu, paginează feed-ul până la pagină goală.
- **Magento/OpenCart fără feed** → numără „N produse/rezultate" pe paginile de listing ale categoriilor root (`get_cached_page` pe URL-uri de categorie) și însumează unic; compară cu numărul din sitemap. Scrie rezultatul în `manifest.secondSignal`. Dacă cele două sunt în 5% → tratează ca de încredere; altfel best-effort + spune userului.
- **Niciun semnal** (`no_independent_count`, sitemap lipsă) → crawl-ul pe server va folosi link-crawl; numitorul rămâne nesigur → raport best-effort onest, NU „gata".

## Rubrica verificatorului (cele 3 porți obiective)
Verificatorul e ADVERSARIAL: verdict implicit INCOMPLET; treaba lui e să REFUTE completitudinea. Rulează cu context izolat, vede DOAR numitorul + citirile locale + rubrica (nu raționamentul lucrătorului). Toate porțile sunt OBIECTIVE (set-diff de chei / scor pe eșantion), nu opinie.
> ⚡ **Scurtătură 1-apel**: `clone_audit_all(jobId, brandId)` rulează TOATE porțile de mai jos și întoarce `pass` consolidat + sumar per-poartă + remedieri (hard gates = parity+fidelity+coverage; tree+branding advisory; orice poartă cu `error` 💥 anulează PASS). Bun pentru verdictul rapid; pentru remediere țintită folosește tot porțile individuale de mai jos.
- **Poarta 1 — acoperire produse**: `clone_parity_diff(jobId, brandId)` → `pass`, `missingCount`, `missingSample`, `coverageVsDenominator`. PASS cere `pass:true`.
- **Poarta 2 — calitate produse (adâncime)**: `clone_fidelity_audit(jobId, brandId)` → `fidelityScore`, `fieldScores` (name/image/gallery/description/price/category/specs/variants), `worstSample`, `unauditedFields`, `flags`. PASS cere `pass:true` (fiecare câmp prezent-în-sursă ≥90%). `gallery` e auditat doar când sursa are 2+ poze și cere ca produsul importat să aibă cel puțin 50% din pozele galeriei sursă; `low_gallery_fidelity` se repară cu `bulk_set_product_images`. ÎNLOCUIEȘTE verificarea „pe ochi" a pozelor/descrierilor.
- **Poarta 3 — non-produs**: `clone_coverage_audit(jobId, brandId)` → coverage per dimensiune (categorii/blog/pagini legale) + `missingSample`. PASS cere fiecare dimensiune cu sursă ≥95%. ÎNLOCUIEȘTE numărătoarea aproximativă blog/legale/ierarhie.
- **Poarta 4 — design (pe design-plan.json)**: pentru fiecare pagină non-produs: (a) `sections[]` din `get_cached_page` vs. componentele din `get_website_page` — fiecare secțiune-sursă are echivalent construit (nu număra fuziunile firești titlu+rich-text→text-block); (b) `textChars` mare în sursă vs. un rând la noi = comprimare agresivă → FAIL; (c) imaginile per secțiune prezente; (d) ruta randează conținutul EI. PASS = toate paginile `verified`.
- **Verificator de CONTAMINARE (adversarial)**: ia culorile/fonturile din `global` + configurile secțiunilor construite și caută fiecare valoare în `designDna`. Valoare netrasabilă (mai ales una identică cu paleta unei clonări ANTERIOARE) → FAIL cu remediere „înlocuiește cu valoarea dovedită din sursă / scoate-o". Rulează cu context IZOLAT: verificatorul nu vede clonările vechi, doar sursa curentă + designDna.
- **Câmpuri reziduale**: `audit_shop_health` fără `error`; TVA ∈ {0,11,21}.
- **Fiecare FAIL → un rând de remediere** cu URL/SKU exact + câmpul lipsă. Niciodată „continuă" gol.
- **Anti-rubber-stamp**: porțile ADAUGĂ eșecuri, nu scot. Ține 5-10 SKU-uri „ancoră" verificate manual care trebuie regăsite mereu.

## „Nu te opri" — workerul server-side + trei straturi pentru munca agentului

**Coloana vertebrală mecanică este workerul server-side.** Crawl-ul, cache-ul și seed-ul continuă fără browser și fără laptopul clientului. Nici `/loop`, nici un hook, nici un scheduler local nu pot promite lucru după oprirea calculatorului.

Cele trei straturi de mai jos se armează numai OPT-IN pentru perfecționarea cu agentul:

1. **Bucla din sesiune** (`/loop` auto-paced sau bucla manuală a liderului): la fiecare trezire recitește starea serverului, `progress.json` și `design-plan.json`; procesează o singură bucată verificabilă și nu declară final până nu trec toate porțile.
2. **Agent programat cross-sesiune:** relansează skill-ul la ~30–60 minute numai dacă schedulerul este găzduit pe server/cloud. Dacă schedulerul rulează pe PC-ul utilizatorului, supraviețuiește închiderii ferestrei, dar NU laptopului oprit. Se auto-dezactivează când nu mai există remediere sau ajunge la plafonul fără progres.
3. **Hook Stop:** podea locală opțională pentru sesiunea agentului; blochează o oprire prematură cât timp `.pending-clone-<sid>` există. Respectă `stop_hook_active`, cere mereu o acțiune concretă și trece la raport `INCOMPLETE` după plafonul `turnsSinceProgress`; nu simulează persistență server-side.

## Reluare după compactare / crash

Workerul recuperează lease-urile expirate din starea server-side; nu muta manual joburile între stări. La reluarea agentului: (1) citește statusul importului; (2) dacă nu este încă `review_required`, lasă workerul să continue; (3) apoi recitește `manifest` + `progress` + `design-plan`; (4) continuă de la prima remediere sau secțiune neverificată. Idempotența folosește cheia sursă/SKU și ID-urile persistate. **Anti-contaminare:** nu reconstitui culori/fonturi din memorie; `designDna` al sursei curente este singura referință.

## Escape mărginit (anti-buclă-infinită)
- 429/timeout = TRANZITORIU → backoff (serverul îl face deja); nu socoti spre maxAttempts.
- 404/login-wall/403 = TERMINAL → dead_letter cu motiv.
- Numitorul de acoperire = `covered / (gold − dead_letter_sancționate)` ca o mână de pagini genuin neclonabile să nu facă PASS imposibil matematic.
- Plafon de buget: la atingere, stare finală INCOMPLET cu „X/Y importate, Z rămase, reia cu acest skill" — niciodată COMPLET.
