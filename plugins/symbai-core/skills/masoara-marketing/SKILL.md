---
name: masoara-marketing
description: Tabloul de bord săptămânal + ROI onest pe canale — ce canal aduce bani, cât cheltui, CAC, LTV:CAC, clienți noi vs reveniți, comparație pe perioade. La „cum stă marketingul", „raport săptămânal marketing", „ce canal îmi aduce bani", „cât mă costă un client", „merge mai bine ca luna trecută?".
---

# Măsoară marketingul

Leagă reclama de rezultatul comercial și arată ce este observat, estimat sau necunoscut. Citește `knowledge/masurare-marketing-atribuire.md`; pentru website și CRM citește `knowledge/website-marketing-crm.md`.

Pentru impactul fiecărei postări, organic → retargeting → lead/plată și funneluri configurabile, citește `knowledge/marketing-impact.md`. Folosește `get_marketing_impact_report` + `get_marketing_impact_sources`, apoi `get_marketing_journey` pentru explicația unui rezultat. Arată modelul, fereastra și sursele necunoscute; `mixed_social` nu este trafic organic dovedit.

## Ordinea de lucru

1. Identifică brandul, locația, perioada, moneda și obiectivul. Pentru website păstrează și websiteId exact. Nu agrega branduri sau monede implicit.
2. Pentru website: `get_website_marketing_setup` și `get_website_marketing_report`. Pentru rezultatul general: `get_marketing_scorecard`, `get_attribution_report`, `get_ad_campaign_insights`. Rapoartele website nu includ automat costurile Google/Meta.
3. Compară definițiile conversiilor, ferestrele de atribuire, anulările și calitatea măsurării. `compare_attribution_models` arată sensibilitatea la model, nu dovedește efectul cauzal. Nu aduna veniturile revendicate de Meta și Google.
4. Completează cu `raport_vanzari`, `get_pnl`, `get_attribution_ltv_by_channel`, `compare_pnl_periods`. `get_sales_analytics` descrie oportunități CRM, nu bonuri POS. Valoarea unui contract câștigat nu este o încasare.
5. Raportează câțiva indicatori utili, definiți precis: cheltuială, venit net, contribuție după costuri variabile, clienți noi, cost pe client/lead calificat, payback și rezultatele principale ale domeniului. Arată perioada comparabilă și lipsurile datelor.
6. Pentru fiecare recomandare: observație → ipoteză → schimbare → metrică → limită de cheltuială și regulă de decizie. Separă recomandarea de executarea autorizată.

## Calcul corect

- CAC folosește clienți noi deduplicați, un interval coerent cu latența achiziției și costurile incluse explicit. Dacă nu ai identitatea clienților, nu înlocui numitorul cu vizitatori sau leaduri.
- LTV pe cohortă folosește contribuția după costuri relevante și perioada de observare. Un calcul bon × frecvență × retenție × marjă este o estimare; declară ipotezele și nu amesteca frecvențe săptămânale cu durate în luni.
- ROAS este venit atribuit / cost publicitar. MER poate folosi venitul total / costul de marketing, cu definiția numitorului explicită. Nu numi oricare dintre ele profit sau ROI.
- Nu există prag universal LTV:CAC 3:1, payback 90 de zile, ROI email 45:1 sau multiplicator 2,3 pentru „corectarea” ROAS. Marja, cashflow-ul, sezonalitatea și capacitatea decid pragul acceptabil.
- Un raport mare nu demonstrează că trebuie crescut bugetul; e posibil să existe selecție, saturație sau atribuire pe clienți care cumpărau deja. Un raport mic cere diagnostic înainte de oprire.

## Pe domenii și canale

- Restaurant: comenzi plătite, rezervări confirmate/onorate, marjă după livrare, intervale și zone disponibile. Cateringul se urmărește în CRM.
- Ecommerce: comenzi nete de anulări/retururi, contribuție, produs și variantă, client nou vs recurent. Coșul nu este venit.
- Fabrică: formular acceptat → calificare verificată → ofertă → contract. Citește separat cererile nesincronizate și timpul de răspuns; folosește `qualify_website_marketing_lead` numai pentru o decizie comercială autorizată și reală.
- Email: `get_email_campaign_analytics`, `get_email_conversion_attribution`, `get_email_ab_test_report`; analizează clicuri, comenzi, venit per destinatar și dezabonări. Deschiderile pot fi influențate de protecțiile de confidențialitate; nu secvenția mesaje doar din absența unei deschideri.
- Oferte: `get_offer_scorecard` și marja după discount. Răscumpărarea cuponului nu demonstrează singură incrementalitate.
- Google/Meta: diagnosticele tehnice și acceptarea unui eveniment nu sunt atribuirea unei vânzări. Consultă ghidul website pentru exportul CRM Data Manager și stările de procesare.

## Experimente și limite

Folosește experimente cu grup de control când volumul și platforma permit. Stabilește alocarea, metrica, efectul minim relevant, durata, bugetul și riscurile înainte de lansare. Șase săptămâni sau 10% control nu sunt reguli universale. Nu pretinde că un raport de atribuire singur analizează corect un experiment randomizat.

Măsurarea nu autorizează cheltuieli, trimiteri de mesaje, încărcări de audiențe sau schimbări live de buget. Pregătește propunerea concretă și execută doar în limitele autorizării existente și ale toolului. Dacă un instrument lipsește sau accesul este refuzat, raportează limita; nu inventa rezultate sau funcții.
