# Măsurare de marketing și atribuire

Pentru UTM automate per postare, trasee native, surse conectate și funneluri configurabile: `knowledge/marketing-impact.md`.

Actualizat la 6 septembrie 2026. Pentru implementarea pe website, cereri CRM și conversii Google citește `knowledge/website-marketing-crm.md`; pentru operare folosește skill-ul `masoara-marketing`.

## Deciziile pornesc din definiții comparabile

Atribuirea distribuie credit pentru rezultatele observate. Nu este o estimare cauzală a vânzărilor în plus. Compararea modelelor arată sensibilitatea la alegerea regulii, nu care model deține adevărul. Last-click poate favoriza interacțiunile apropiate de cumpărare, inclusiv căutarea pe numele brandului și retargetingul.

Nu însuma venitul atribuit de platforme: aceeași comandă poate apărea în Meta, Google și raportul intern. Aliniază moneda, fusul orar, fereastra de atribuire, data clicului vs data conversiei și tratamentul TVA/retururilor. Nu aplica un multiplicator universal pentru a „corecta” rezultatele unei platforme.

Rapoartele website descriu evenimentele primite cu acord și cererile înregistrate. Ad blockers, refuzul trackingului, implementările paralele și latența conversiilor creează diferențe. Lipsa evenimentelor poate fi o problemă de măsurare, nu lipsă de cerere.

## Economia reală

- ROAS = venit atribuit / cheltuială publicitară. Nu este profit.
- MER compară venitul total cu costul de marketing definit explicit. Nu presupune că întregul venit a fost cauzat de reclamă.
- CAC = costurile de achiziție declarate / clienți noi deduplicați, cu perioadă și latență comparabile. Costul pe formular nu este CAC.
- LTV înseamnă valoarea pe durata/cohorta specificată; pentru rentabilitate folosește contribuția după costurile relevante. Separă observațiile de prognoze.
- Payback arată când contribuția cumulată acoperă CAC. Limita acceptabilă depinde de cashflow, risc și modelul afacerii.
- Pentru un singur produs fără recurență și cu baze compatibile, pragul ROAS poate fi aproximat prin 1 / rata contribuției înainte de publicitate. Include transportul suportat, ambalarea, reducerile, comisioanele și retururile relevante. Nu aplica formula pe venit cu TVA și marjă calculată fără TVA.

LTV:CAC sub 3 nu dovedește automat pierdere, iar peste 5 nu dovedește subinvestiție. Nici procentul bugetului din venit, ROI email sau durata de 90 de zile nu au un prag universal. Dacă un tool afișează asemenea praguri, prezintă-le ca euristici și verifică ipotezele înainte de decizie.

## Pe domenii

Restaurant: separă livrarea/ridicarea, rezervările confirmate/onorate și cateringul. Optimizează numai acolo unde există capacitate și marjă. Ecommerce: folosește comenzi plătite și rezultat net după anulări/retururi, cu client nou vs recurent. Fabrică: distinge cereri, leaduri calificate, oferte și contracte câștigate; valoarea unui deal nu este încasare POS.

Pentru căutări: `get_website_marketing_report` arată termeni interni repetați și lipsa rezultatelor. Completează cu Search Console, termeni Ads și întrebări CRM. Nu pretinde că identifici companiile vizitatorilor anonimi sau că vezi toate căutările de pe Google.

## Experimente

Formulează ipoteza, rezultatul principal, metricele de control, alocarea și limita de cheltuială înainte de pornire. Dimensionează durata și grupul de control după volum, latența comercială și efectul minim util. Verifică randomizarea, contaminarea și comparabilitatea. Folosește instrumentele de experiment ale platformei dacă sunt disponibile; nu inventa un tool de holdout și nu trata raportul de atribuire ca analiză completă de experiment.

Un test mic sau cu puține contracte B2B poate rămâne neconcludent. Raportează această limită; nu alege un câștigător doar fiindcă procentul este mai mare. Nu prescrie creșteri de buget pe baza unei singure zile sau a conversiilor necalificate.

## Tool-uri MCP utile

Toate sunt de **citire** [citire] — măsurarea nu cheltuie și nu trimite nimic, deci nu cer `confirm:true`. (Mutarea efectivă a bugetului se face cu tool-urile de reclame, care au confirmare.)

- `get_attribution_report` — raport de atribuire pe canal (direcția: ce canal pare să aducă comenzi/venit). Param: brandId, perioadă. Pune-l mereu lângă un al doilea unghi.
- `get_attribution_ltv_by_channel` — LTV și calitatea clienților aduși de fiecare canal; baza calculului LTV:CAC. Param: brandId, perioadă.
- `get_marketing_scorecard` — scorecard executiv pe ultimele N zile: venit atribuit, spend ads, ROAS combinat, canale și semnale euristice care trebuie interpretate în context. Primul tool pentru „cum stă marketingul".
- `compare_attribution_models` — comparație last/first/linear/time_decay/position pe aceleași date. Folosește-l ca să nu decizi bugetul pe un singur model.
- `get_ad_campaign_insights` — metrici reale pe campanie: spend, afișări, click-uri, CTR, CPC, CPM, conversii, CPA, ROAS și defalcare pe zile. Primul tool înainte de pauză/scalare.
- `check_contact_frequency_budget` — câte mesaje a primit un client în 24h/7d pe email/SMS/WhatsApp/push și dacă mai poți trimite pe canalul respectiv.
- `get_email_conversion_attribution` — leagă click-urile din email de comenzile/rezervările POS, fereastră 7 zile; venit real, nu deschideri. Param: brandId/campaignId, fereastră.
- `get_pnl` — profit și pierdere real, ca să măsori marketingul pe profit, nu doar pe venit. Param: brandId, perioadă.
- `compare_pnl_periods` — compară două perioade pentru **variație** (lună vs. lună, an vs. an); inima dashboard-ului săptămânal. Param: brandId, cele două perioade.
- `raport_vanzari` — vânzări POS reale (bonuri încasate la casă/online). Sursa de adevăr pentru CAC și pentru lift-ul pe segmentul expus vs. holdout.
- `get_sales_analytics` — analiză de vânzări din zona **deal-uri / pipeline CRM** (oferte de evenimente, catering), NU bonuri POS. Folosește-l doar pentru lumea de vânzări B2B/evenimente.
- `get_email_campaign_analytics`, `get_email_ab_test_report`, `reconcile_email_conversions` — KPI email post-MPP, varianta câștigătoare, recuperare click-fără-conversie.
- `top_produse`, `vanzari_in_timp` — context de produs și evoluție în timp pentru stratul MMM-lite.
- Pentru context strategic: `get_marketing_scorecard` + `compare_attribution_models` + `get_attribution_ltv_by_channel` intră direct în planul trimestrial (`generate_quarterly_marketing_plan`, `what_if_marketing_budget`) — vezi `knowledge/plan-marketing-strategie.md`.
