# Loialitate & Fidelizare

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Programul de loialitate îți răsplătește clienții fideli: ei acumulează puncte la cumpărături, urcă în niveluri (Bronze/Silver/Gold/Platinum) și pot răscumpăra puncte pe recompense. Sistemul calculează automat segmente RFM (cât de recent, cât de des, cât de mult cheltuie un client) și te avertizează când un client bun începe să scadă, ca să-l reactivezi. Restaurantul/retailul folosește pagina **/loyalty**; hotelul are loialitate **separată** (pe nopți de cazare) în **/hotel/crm**. Acest ghid acoperă partea operațională; lista generală a paginilor de clienți e în ghidul „Rezervări, Clienți & Evenimente".

## Concepte

- **Punct** — unitatea de fidelitate. Se acumulează după o **regulă** (ex: 1 punct / 1 leu cheltuit) și are o **valoare de răscumpărare** (ex: 100 puncte = 5 lei).
- **Regulă de acumulare** — câte puncte se dau per leu, pe ce canale, eventual multiplicatori (zi de naștere, weekend). Configurabilă per brand.
- **Nivel (tier)** — treaptă de fidelitate (Bronze/Silver/Gold/Platinum sau nume proprii) cu praguri de puncte și beneficii (reduceri, puncte dublate, acces la recompense exclusive).
- **Recompensă** — ce poate lua clientul pe puncte (produs gratuit, reducere, cadou). Formează „catalogul de recompense".
- **RFM** — segmentare automată după **R**ecency (cât de recent a cumpărat), **F**requency (cât de des), **M**onetary (cât a cheltuit). Te ajută să vezi cine-s VIP-urii și cine pleacă.
- **Alertă de scădere (win-back)** — sistemul detectează clienți buni care nu au mai venit de mult și-i propune pentru reactivare.
- **Loialitate hotel** — complet separată de cea POS: se calculează pe **nopți** și are tiers/segmente RFM proprii (/hotel/crm).

## Pagini

- **Fidelizare & Recompense** (`/loyalty`) — trei zone: **Privire de ansamblu** (puncte emise/răscumpărate, top clienți), **Clienți cu puncte** (soldul fiecăruia, istoric), **Setări** (reguli de acumulare, valoare de răscumpărare, niveluri, campanii speciale, bonusuri de zi de naștere/înscriere).
- **Rapoarte Clienți** (`/customer-reports`) — distribuția pe niveluri de loialitate, top clienți, creștere lunară.
- **Follow-up Clienți** (`/customer-followup`) — Next Best Action zilnic (cui să-i ceri o vizită, cui o ofertă) folosește scorul de loialitate/RFM.
- **CRM & Loialitate Hotel** (`/hotel/crm`) — loialitatea hotelului (pe nopți), tiers, segmente RFM, recompense — **separat** de /loyalty.

## Fluxuri pas-cu-pas

1. **POS — vezi configul actual**: `get_pos_loyalty_config`. Dacă nu e configurat, explică pe scurt regula propusă (ex: 1 punct/leu, 100 puncte = 5 lei, bonus înscriere) și confirmă valorile cu userul.
2. **POS — pornești/setezi programul**: `set_pos_loyalty_settings(active:true, earnRate, redeemValue, signupBonusPoints?, birthdayBonusActive?...)`. De acum punctele se acumulează automat la fiecare vânzare către client identificat. Nivelurile/recompensele avansate se ajustează în `/loyalty?tab=settings`.
3. **POS — verifici/acorzi puncte unui client**: `get_customer_loyalty(customerId)` → dacă e corecție/gest comercial, `award_customer_loyalty_points(customerId, points, reason)`. Punctele negative sunt plafonate la soldul existent; raportează `pointsChanged` (ce s-a aplicat real).
4. **Hotel — adaugi un nivel nou**: `create_loyalty_tier(name, pointsThreshold?, nightsThreshold?, earnMultiplier?, benefits[])`.
5. **Hotel — adaugi o recompensă în catalog**: `create_loyalty_reward(name, pointsCost, rewardType?, rewardValue?, minTierKey?)`.
6. **Hotel — acorzi/răscumperi/expiri puncte**: `award_loyalty_points(guestProfileId, points, reason)`, `redeem_loyalty_points(guestProfileId, redemptionId)`, `expire_loyalty_points()`.
7. **RFM / win-back**: pentru hotel, `recompute_loyalty_rfm`, `recompute_guest_loyalty`, `evaluate_loyalty_drop_alerts`; pentru POS/CRM, folosește `list_nba_suggestions`, `get_customer_timeline`, `get_crm_funnel` și campanii respectând consimțământul.

## Tool-uri MCP utile

- POS (restaurant/retail): `get_pos_loyalty_config`, `set_pos_loyalty_settings`, `get_customer_loyalty`, `award_customer_loyalty_points`.
- Hotel: `get_guest_loyalty_detail`, `get_hotel_loyalty_overview`, `create_loyalty_tier`, `create_loyalty_reward`, `award_loyalty_points`, `redeem_loyalty_points`, `expire_loyalty_points`, `recompute_loyalty_rfm`, `recompute_guest_loyalty`, `evaluate_loyalty_drop_alerts`.
- Scrierea cere modulul **Rezervări & Clienți** pe token; citirile merg fără modul de scriere.
- Permisiunea exactă a fiecărui tool e în catalogul din `tools-mcp.md`. Dacă un tool întoarce „permisiune insuficientă", modulul nu e bifat pe token → portal Hub → Acces AI.

## Întrebări frecvente

- **De ce nu urcă clientul de nivel?** Verifică pragul nivelului în Setări și soldul clientului (Clienți cu puncte). Avansarea poate fi pe puncte cumulate sau pe puncte din ultima perioadă — vezi regula configurată.
- **Expiră punctele?** Da, dacă ai setat expirare. `expire_loyalty_points` aplică expirarea; o poți rula și manual.
- **Pot da puncte „din mână" unui client?** Da. Pentru POS: `award_customer_loyalty_points(customerId, points, reason)`. Pentru hotel: `award_loyalty_points(guestProfileId, points, reason)`. Motivul rămâne în istoric, auditat.
- **Loialitatea hotelului e aceeași cu cea de la restaurant?** NU. Hotelul are program separat (pe nopți), în /hotel/crm. Punctele nu se amestecă decât dacă ai configurat explicit.
- **Cine primește punctele când nota e plătită de mai mulți sau din portofel?** Plătitorul, nu destinatarul: la o comandă de acasă plătită din portofelul unui părinte, punctele merg la titularul portofelului. Fiecare plătitor primește punctele părții lui; bacșișul nu intră în calcul. Punctele se calculează după reduceri și produsele excluse. O notă cu plăți mixte primește punctele abia după ce plățile sunt reconciliate, deci pot apărea cu întârziere.
- **Ce se întâmplă cu punctele la retur?** Se retrag proporțional de la toți cei care au plătit nota inițială, chiar dacă între timp programul a fost oprit. O notă returnată integral nu păstrează nivelul obținut prin ea.
- **Ce e RFM și de ce-mi trebuie?** Îți spune automat cine-s clienții valoroși (cheltuie des și mult, recent) ca să-i tratezi preferențial, și cine pleacă, ca să-i reactivezi.

## Capcane

- **Loialitate POS ≠ loialitate hotel** — sunt două sisteme; nu căuta punctele de cazare în /loyalty și nu folosi `create_loyalty_tier` pentru niveluri POS.
- **GDPR**: înainte de a trimite oferte/campanii către segmente de loialitate, opt-out-ul per canal (email/SMS/WhatsApp) trebuie respectat — vezi ghidul „GDPR & date clienți".
- **După ce modifici reguli prin conexiune**, datele sunt salvate, dar interfața arată valorile vechi până la **refresh** (cache în browser). Confirmă cu un tool de citire, nu repeta scrierea.
- Punctele se acumulează doar pentru clienți **identificați** la vânzare (telefon/card de fidelitate); vânzările anonime nu acumulează.
