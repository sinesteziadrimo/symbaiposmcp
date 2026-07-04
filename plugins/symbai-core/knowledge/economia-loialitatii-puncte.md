# Economia loialității cu puncte

> Pentru linkul exact către pagina de loialitate folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Un program de puncte care funcționează nu se câștigă din mecanica complicată, ci din economia simplă din spate: cât de repede ajunge clientul la prima recompensă, cât valorează un punct și cât te costă pe tine. Majoritatea membrilor renunță în faza de „strâns puncte", nu la răscumpărare — deci totul se proiectează ca să facă prima recompensă să pară aproape. Acest fișier îți dă cifrele-cadru pentru 2026 (câștig, valoare răscumpărare, praguri, bonusuri), formula datoriei pe care o porți „în spate" și pașii concreți de pornire în Symbai. Lucrăm pe datele reale ale clientului: bonul mediu și frecvența vizitelor decid cifrele, nu un șablon fix.

## Concepte

- **Câștig (earn) transparent ~1:1** — 1 leu cheltuit = 1 punct (sau o ștampilă pe vizită). Clientul trebuie să înțeleagă din prima cum câștigă. Evită mecanica de tip „1 leu = 1 punct, fel principal gratis = 500 puncte" care e corectă matematic dar nefuncțională în practică (recompensa pare imposibil de departe).
- **Valoarea răscumpărării ~5% reducere efectivă** — recompensa să valoreze între **3% și 7%** din suma necesară ca s-o câștigi. Reper practic: **100 de puncte = 5 lei**. Sub 3% pare o glumă; peste 7% îți mănâncă marja.
- **Prima recompensă la 4-6 vizite** — dimensionează recompensa de intrare astfel încât un client mediu s-o atingă în **4-6 vizite / în 3-6 luni** (clienții de top mai repede, următorul nivel în 6-9 luni). Asta e singura cifră care ține membrii activi la început.
- **Praguri de tier (niveluri de status)** — 4 trepte clasice (ex. Bronze / Silver / Gold / Platinum) cu praguri de puncte sau de cheltuială. Programele cu niveluri aduc **+13% engagement** față de cele plate, pentru că exploatează dorința de status („mai ai 200 de puncte până la Gold").
- **Bonusuri de impuls** — bonus de înscriere (un cadou la intrarea în program), bonus aniversar (mesaj de ziua clientului — cea mai mare valoare per mesaj dintre toate automatizările de restaurant) și bonus la prima comandă online. Acestea accelerează atingerea primei recompense.
- **Datoria programului (liability)** — punctele necheltuite sunt o obligație pe care o porți, ca un cont de plătit. **Datoria = puncte_neutilizate × valoarea_unui_punct × (1 − breakage).** O recalculezi în fiecare perioadă; dacă crește, programul e bolnav, nu „bani gratis".
- **Breakage (punctele care nu se mai folosesc niciodată)** — în restaurante/cafenele se gestionează ~**20-30%** breakage. Nu e profit pe care să te bazezi: un breakage care urcă peste 30% înseamnă că oamenii renunță, nu că ai câștigat.
- **Rata de răscumpărare țintă** — în **food & beverage: 30-50%**. Programele cu o singură recompensă pot ținti 80-90% (e ușor de atins); cataloagele cu mai multe recompense au rate mai mici fiindcă oamenii economisesc. Sub 20% = program prost proiectat (recompensa e prea departe sau prea slabă).
- **Cât valorează un membru** — membrii înscriși vizitează cu **~22% mai des** și cheltuie cu **18-38% mai mult** pe bon. ROI mediu al unui program de loialitate ~**4,8x**; pentru restaurante optimizezi pentru **frecvența vizitelor** (câștig rapid / consum rapid, serii săptămânale), nu pentru mărimea coșului.

## Fluxuri frecvente

### 1. Pornire program de puncte pe POS (de la zero, dimensionat pe datele reale)
1. Context: `list_brands` + `list_locations` ca să afli brandId/locationId. [citire]
2. Citește bonul mediu și frecvența: `raport_vanzari` + `top_produse`. Acestea decid cifrele — nu pune un șablon fix. [citire]
3. Calculează economia: **câștig 1:1**, **valoare răscumpărare la ~5% reducere efectivă** (ex. 100 puncte = 5 lei), **prima recompensă la 4-6 vizite**. Verifică: dacă bonul mediu e 50 lei, 4-6 vizite înseamnă ~200-300 puncte → recompensa de intrare trebuie să coste cam atât.
4. Creează nivelurile: `create_loyalty_tier` pentru fiecare treaptă (ex. Bronze/Silver/Gold/Platinum) cu pragurile alese. [marketing]
5. Creează recompensele: `create_loyalty_reward` (de obicei 2-3 recompense — una de intrare ușor de atins + 1-2 mai mari). [marketing]
6. **Setările generale ale programului** (program activ, rata de câștig, valoarea răscumpărării, bonus înscriere/aniversare/online) se fac **din aplicație**, în Setări → Loialitate — acea pagină nu se configurează prin această conexiune.
7. Pregătește automatizările de susținere: `seed_crm_playbooks` (aniversare + inactivitate). [marketing]
8. Verifică REAL: deschide pagina de loialitate (Chrome / `gaseste_in_aplicatie`) și testează pe un client cu `get_guest_loyalty_detail` că punctele se acumulează cum trebuie. [citire]

### 2. Acordare / consumare puncte manual (corecții, gesturi, recompense la casă)
- Acordare punctuală (compensație, eveniment, corectare): `award_loyalty_points` cu `confirm:true`. [marketing]
- Consumare / aplicare recompensă pentru un client: `redeem_loyalty_points` cu `confirm:true`. [marketing]
- Înainte de orice, vezi soldul real al clientului cu `get_guest_loyalty_detail`. [citire]

### 3. Recalcul RFM + alerte de răcire (cine merită win-back)
1. `recompute_loyalty_rfm` ca să actualizezi segmentele (Champions, Loyal, At-Risk, Hibernating etc.). Rulează-l **lunar**. [marketing]
2. `evaluate_loyalty_drop_alerts` — scoate clienții buni care au început să se răcească. [citire]
3. `preview_guest_segment` ca să confirmi mărimea segmentului și opt-in-ul pe email/SMS. [citire]
4. Împarte pe RFM: VIP răcit (ofertă mai adâncă + atingere personală) vs client rar (puțin sau deloc).
5. Secvență escaladată pe 10-14 zile: `enroll_customers_in_email_sequence` + `push_notify_customers` + `send_whatsapp_message` (toate cu `confirm:true`, respectă opt-out-ul). Vezi `knowledge/email-marketing.md` pentru ladder-ul complet. [marketing]
6. Restaurantul recuperează tipic **10-18%** din clienții inactivi prin win-back — printre cele mai bune tactici ca ROI.

### 4. Nudge de tier-up („mai ai X puncte până la Gold")
1. Identifică clienții aproape de pragul următor (din `recompute_loyalty_rfm` + citirea soldurilor cu `get_guest_loyalty_detail`, sau o interogare prin `execute_sql_query`). [citire]
2. `preview_guest_segment` pentru dimensiune. [citire]
3. `push_notify_customers` + `send_email_campaign` cu mesaj de status: „mai ai 200 de puncte până la Gold — dublăm punctele weekendul ăsta". [marketing]
4. Măsoară câți au urcat efectiv (re-citește soldurile/tier-ul după campanie).

### 5. Expirare punctată (DOAR dacă e neapărat nevoie) cu preaviz în 3 trepte
- **Implicit NU expira punctele.** 35% dintre membri spun că expirarea e frustrarea #1, iar eliminarea ei nu costă nimic și e cea mai mare reparație de dezangajare.
- Dacă expirarea e obligatorie (ca să ții datoria sub control), trimite preaviz: **T-30, T-7 și T-1 zile** pe push + email, cu soldul exact și „revendică acum" la un clic. Programează aceste mesaje cu `create_notification_rule`. [marketing]
- Abia după preaviz aplici expirarea efectivă: `expire_loyalty_points` cu `confirm:true`. [marketing] Ținta: împingi răscumpărarea spre 30-50% și reduci breakage-ul **fără** să pierzi goodwill-ul clientului.

### 6. Raport lunar de retenție (pentru patron)
1. Recalculează: `recompute_loyalty_rfm` + `evaluate_loyalty_drop_alerts`. [marketing/citire]
2. Calculează **datoria** și **rata de răscumpărare**: ai nevoie de puncte neutilizate × valoare × (1 − breakage). Soldurile le iei din `get_guest_loyalty_detail` pe eșantion sau printr-o interogare `execute_sql_query`. [citire]
3. Compară frecvența membri vs non-membri (din `raport_vanzari` + `get_attribution_ltv_by_channel`). [citire]
4. Rezumat pentru patron cu 3 recomandări: **re-prețuiește recompensele dacă breakage > 30%**, **lansează win-back dacă alertele de răcire cresc**, **propune un tier plătit dacă frecvența e mare** (vezi mai jos).

### 7. Referral „dă X, primești X" (dublu-sided)
- Identifică promotorii (clienți Gold/Platinum, cei mai activi). [citire]
- Construiește mecanica de recomandare **din aplicație** (cod give-10-get-10) — generarea de coduri de referral nu se face prin această conexiune; o configurezi în modulul de loialitate/promoții.
- Distribuie prin portal + `push_notify_customers` + `send_email_campaign` + `send_whatsapp_message`. [marketing]
- Cifre de reper 2026: conversie referral **3-5%** (mediana F&B 4,8%), share rate sănătos 5-15%. Recompensa pe ambele părți (și pentru cel care recomandă, ȘI pentru prieten) recrutează semnificativ mai mult decât doar pentru recomandant. Finanțează-l ca achiziție ieftină — retenția costă de 5-25x mai puțin decât achiziția.

### 8. Membership plătit (peste programul gratuit de puncte)
- Confirmă întâi frecvența mare (`raport_vanzari` + comparație membri/non-membri). [citire]
- Proiectează un nivel plătit (ex. **39 lei/lună**: livrare gratuită + credit fix lunar + puncte duble) cu break-even la ~**30% adopție** dintre clienții lunari; payback tipic sub 30 de zile odată ce ai 150-200 de abonați.
- Configurarea efectivă a abonamentului se face **din aplicație**, în modulul Abonamente. Lansează-l către VIP-uri cu `push_notify_customers` + `send_email_campaign` și urmărește adopția/churn cu `get_subscriptions_dashboard`. [marketing/citire]

## Tool-uri MCP utile

- `create_loyalty_tier` [marketing] — creează o treaptă/nivel de status cu pragul ei (puncte sau cheltuială).
- `create_loyalty_reward` [marketing] — creează o recompensă (cost în puncte + ce primește clientul).
- `award_loyalty_points` [marketing, `confirm:true`] — acordă puncte unui client (compensație, corecție, eveniment).
- `redeem_loyalty_points` [marketing, `confirm:true`] — consumă puncte / aplică o recompensă pentru un client.
- `expire_loyalty_points` [marketing, `confirm:true`] — expiră punctele (DOAR după preavizul T-30/T-7/T-1).
- `recompute_loyalty_rfm` [marketing] — recalculează segmentele RFM (rulează lunar).
- `get_guest_loyalty_detail` [citire] — soldul, nivelul și istoricul de puncte ale unui client.
- `evaluate_loyalty_drop_alerts` [citire] — clienții buni care s-au răcit (candidați de win-back).
- `seed_crm_playbooks` [marketing] — pornește automatizările de bază (aniversare, inactivitate).
- `preview_guest_segment` [citire] — mărimea unui segment + opt-in pe canale, înainte de orice trimitere.
- `push_notify_customers` / `send_email_campaign` / `send_whatsapp_message` [marketing, `confirm:true`] — canalele pentru expiry-reminder, tier-up, win-back, referral.
- `create_notification_rule` [marketing] — automatizează preavizul de expirare (T-30/T-7/T-1).
- `get_subscriptions_dashboard` [citire] — MRR/churn/adopție pentru tier-ul plătit.
- `get_attribution_ltv_by_channel` / `raport_vanzari` / `top_produse` [citire] — datele care dimensionează economia (bon mediu, frecvență, valoarea membrilor).
- `execute_sql_query` [citire] — interogare read-only pentru a calcula datoria totală și rata de răscumpărare pe tot programul.

> Setările generale ale programului (activare, rata de câștig, valoarea răscumpărării, bonus înscriere/aniversare/online), codurile de referral și abonamentul plătit se configurează **din aplicație** (Setări → Loialitate / Abonamente) — nu prin această conexiune. Ghidează utilizatorul pas cu pas acolo.

## Întrebări frecvente și capcane

- **Cât să valoreze un punct?** ~5% reducere efectivă: 100 de puncte = 5 lei e un reper bun. **Prea ieftine** (sub 3%) → clientul simte că programul e o glumă și nu se înscrie. **Prea scumpe** (peste 7%) → îți mănâncă marja și nu se mai susține economic.
- **De ce renunță oamenii deși „strâng puncte"?** Aproape toți renunță în faza de câștig, nu la răscumpărare. Cauza #1 = prima recompensă e prea departe. Reglează recompensa de intrare să fie atinsă în 4-6 vizite și anunță mereu „cea mai apropiată recompensă".
- **Să pun expirare ca să „curăț" punctele?** Nu, decât dacă chiar trebuie. **35% dintre membri** citează expirarea ca frustrarea numărul unu. Dacă o faci totuși (pentru datorie), e OBLIGATORIU preavizul în 3 trepte (T-30/T-7/T-1) cu soldul exact. Expirarea agresivă, fără preaviz, e cel mai rapid mod de a omorî un program.
- **Breakage-ul mare e profit?** NU. Un breakage care crește (peste ~30% în F&B) înseamnă oameni care renunță, nu bani câștigați. E un semnal că recompensa e prost dimensionată — re-prețuiește.
- **Cum calculez ce datorez „în spate"?** Datoria = puncte_neutilizate × valoarea_unui_punct × (1 − breakage). Recalculează în fiecare lună. Crește datoria față de luna trecută fără să crească vânzările? Program bolnav.
- **Ce rată de răscumpărare e sănătoasă?** 30-50% în restaurante/cafenele. Sub 20% = recompensa e prea departe sau prea slabă. O singură recompensă simplă poate ținti chiar 80-90%.
- **Niveluri (tiers) sau program plat?** Nivelurile aduc ~13% mai mult engagement prin dorința de status. Folosește praguri clare și nudge-uri de tip „mai ai X puncte până la nivelul următor".
- **Discount general sau ofertă pe loialitate?** Ofertele legate de o acțiune (înscriere, win-back pe segment răcit) bat discountul general cu 14-34% la conversie și profit. Discountul orb „antrenează" clienții să aștepte reduceri și îți erodează marja pe clienții care oricum plăteau întreg.
- **Membership plătit DA sau NU?** Doar dacă frecvența e deja mare. Devine profitabil rapid la ~30% adopție dintre clienții lunari; pune-l **peste** programul gratuit de puncte, nu în locul lui.

## Vezi și

- `knowledge/email-marketing.md` — secvențele de win-back, aniversare și expiry-reminder pe email.
- `knowledge/marketing-social.md` — anunțul programului și conținutul organic.
- skill-ul `gestioneaza-crm` — pipeline, segmente, automatizări de retenție.
- skill-ul `raspunde-recenzii` — recenziile ca input pentru loialitate și goodwill.
