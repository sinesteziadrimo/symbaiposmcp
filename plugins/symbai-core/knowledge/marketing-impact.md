# Impactul marketingului: de la postare la rezultat

Actualizat la 6 septembrie 2026. Pentru restaurante, magazine, fabrici și servicii. Verifică disponibilitatea tool-urilor pe tenant înainte să afirmi că funcțiile sunt active. În aplicație: Marketing → Performanță → Impact, `/marketing/performance?tab=impact`.

## Un traseu complet

Pornește de la un obiectiv verificabil: comandă plătită, cerere acceptată, cerere calificată, contract câștigat, rezervare trimisă sau un clic pe un buton propriu. Identifică brandul și website-ul exact prin `list_brands` și `list_websites`. Pentru consimțământ, taguri Meta/Google și rutarea formularelor citește `knowledge/website-marketing-crm.md`.

1. Pregătește linkurile înaintea distribuirii. `create_marketing_tracking_link` acceptă destinația publică, nume, source, medium, campaign și placement; opțional websiteId, postId și adCampaignId. ID-urile de postare și reclamă sunt locale, existente în același brand. Aceeași configurație produce același link. Copiază `taggedUrl` exact.
2. Pentru postarea existentă nepublicată: `configure_social_post_tracking` cu `settings:{enabled:true,campaign:"colectia-toamna",medium:"organic_social"}`. `dryRun:true` verifică; `false` salvează configurația autorizată. Nu publică și nu pornește reclame. `preview_social_post_tracking` arată linkurile, omisiunile și textele/comentariile care depășesc limita după adăugarea UTM. Tokenul de preview nu este destinat distribuirii.
3. Publicarea automată prin Symbai pregătește linkuri stabile distincte pe postare/rețea în text, primul comentariu și destinațiile acceptate ale butoanelor. La publicare manuală/reminder folosește un link final creat separat. Pe Instagram și TikTok nu presupune că URL-ul din caption este clicabil; folosește bio, sticker sau altă destinație disponibilă efectiv contului. Verifică unde ajunge clicul. Pentru conectare și publicare TikTok citește `knowledge/tiktok-publicare.md`.
4. Citește `get_marketing_impact_report` cu brandId, websiteId, from inclusiv și to exclusiv în ISO UTC. Maximum 90 zile; model `first_touch`, `last_non_direct` (implicit) sau `linear`; lookbackDays 1–30, implicit 30. Perioada selectează data rezultatului, nu data primei postări.
5. `get_marketing_journey` primește identificatorul browser returnat de raport și aceeași arie/perioadă. Arată evenimente sanitizate, fără date de contact. Referința crmDealId permite deschiderea oportunității în CRM cu permisiunile obișnuite; nu identifică o persoană anonimă din trafic.
6. `get_marketing_impact_sources` citește separat GA4, Search Console, metrici sociale și cheltuieli publicitare disponibile. `not_connected` și `unavailable` nu înseamnă zero. Afișează intervalul, proprietatea/fluxul, fusul, ultima sincronizare și limitele întoarse.

Păstrează UTM existente, fără rescrierea intenției autorului. Etichetele nu acceptă emailuri, telefoane sau secrete. Linkurile private/semnate sunt omise, cu explicație. Fragmentul și parametrii publici de destinație sunt păstrați. `list_marketing_tracking_links` găsește linkurile brandului sau ale unei postări; nu inventa identificatori.

## Exemplu de lucru: video organic → revenire din reclamă → comandă

Creează pentru video un link `source:instagram, medium:organic_social, campaign:colectia-toamna, placement:bio`. Pentru reclama nouă către aceeași pagină folosește o identitate separată cu `medium:paid_social`, asociată campaniei publicitare locale. Promovarea website pe Meta din Symbai pregătește automat acest link. Pentru alte platforme pregătește și verifică separat destinația UTM. Nu modifica trackingul unei reclame deja active fără autorizarea acelei modificări.

Un browser care intră din video, revine din reclamă și plătește o comandă are o singură comandă verificată. First-touch poate acorda credit videoului; last-non-direct reclamei; linear împarte creditul între sursele distincte. Compararea arată sensibilitatea la model, nu efectul cauzal al reclamei.

**Boost-ul aceleiași postări poate folosi același link ca postarea organică.** Când promovarea este cunoscută în Symbai, raportul marchează contribuția `mixed_social`, cu `trafficSeparation:organic_or_boost`. Nu o declara integral organică sau plătită. Promovările externe nu sunt detectate automat. `fbclid` singur nu dovedește că vizita este plătită. Pentru separare sigură pregătește reclame cu destinații distincte și verifică parametrii ajunși pe site.

Vizualizările video rămân metrici agregate ale rețelei. Nu putem spune care vizualizator a devenit client și nu potrivim dispozitive, IP-uri sau amprente de browser. UTM pe o pagină externă funcționează pentru măsurarea ei, dar nu trimite automat leaduri/comenzi către Symbai.

## Funneluri configurabile

`save_marketing_funnel` acceptă brandId, websiteId, opțional id pentru editare, dryRun și definition. Definiția are name, unit (`browser` sau `session`), windowHours 1–720 și 2–8 steps. Fiecare pas are name, event și opțional pagePath exact (fără query) sau goalKey. Maximum 25 funneluri salvate pe website. Verifică cu dryRun:true, apoi salvează modificarea autorizată cu false.

Exemplu de definiție pentru o fabrică:

```json
{
  "name": "Mostră → cerere calificată",
  "unit": "browser",
  "windowHours": 720,
  "steps": [
    { "name": "Catalog explorat", "event": "PageView", "pagePath": "/produse" },
    { "name": "Cere mostră", "event": "Contact", "goalKey": "cere-mostra" },
    { "name": "Cerere primită", "event": "LeadAccepted" },
    { "name": "Cerere calificată", "event": "LeadQualified" }
  ]
}
```

Butonul personalizat trebuie să aibă `data-marketing-goal="cere-mostra"`. Cheia descrie scopul, fără date personale. Evenimentul pentru acest clic este Contact. Nu confunda clicul cu formularul acceptat. Linkurile spre documente uzuale produc FileDownload la clic, fără dovada că fișierul a fost citit.

Modelele inițiale includ magazin (vizită → produs → coș → checkout → plată), fabrică/servicii (vizită → formular început → cerere → calificare), restaurant (vizită → conținut → rezervare trimisă). Sunt exemple nesalvate până la personalizare; verifică evenimentele reale ale website-ului. Schedule indică rezervare trimisă, nu onorată.

Funnelul urmărește aceiași participanți în ordinea pașilor; un eveniment nu poate satisface două etape. Prima intrare din perioada selectată definește cohorta. Pașii pot continua după sfârșitul perioadei în fereastra aleasă. `pending` arată participanții care încă au timp să convertească; nu declara abandon definitiv. LeadQualified și DealWon sunt decizii ulterioare CRM, fără sesiune web inventată: pentru acestea folosește unit browser.

## Cum interpretezi cifrele

- Cereri primite = formulare acceptate și păstrate. Cererile care așteaptă sincronizarea CRM rămân vizibile. Un eveniment browser Lead nu înlocuiește cererea canonică.
- Calificări = decizii înregistrate efectiv în CRM; nu transforma automat toate formularele în leaduri bune.
- Contracte câștigate = valoarea declarată a oportunității, separat de bani încasați. În Contribuții alege obiectivul CRM pentru creditul și valoarea relevante.
- Comenzi = plăți verificate observate de website. Browserul nu stabilește suma. Anulările și rambursările integrale sunt excluse; rambursările parțiale ale magazinului reduc valoarea o singură dată. Rezultatele istorice reflectă starea curentă, fără a deveni raport contabil/profit.
- Fiecare rezultat primește în total un credit; linear poate produce fracții. Monedele rămân separate. Asistențele se suprapun și nu se adună cu comenzile sau veniturile.
- Sesiunile și browserele sunt observate cu acord, nu numărul tuturor persoanelor. Identitatea browserului expiră după 30 zile; sesiunea după 30 minute de inactivitate. Retragerea acordului întrerupe traseul. Datele vechi fără context sunt necunoscute, nu acces direct dovedit.
- Cheltuiala publicitară vine din ultimul snapshot zilnic la nivel de campanie, pe zile complete în fusul contului. Bugetul nu este cheltuială. Conversiile platformei pot include modelare/vizualizări; nu le aduna cu comenzile native. Nu calcula ROAS combinat din perioade sau monede incompatibile.
- GA4 arată sesiuni/evenimente-cheie ale proprietății/fluxului selectat. Acesta poate include mai multe site-uri. Search Console arată cerere de căutare, cu date întârziate și rânduri incomplete. Snapshot-urile sociale pot fi cumulative de la publicare. Păstrează avertismentele de praguri/eșantionare/trunchiere.
- Raportul refuză explicit peste 50.000 evenimente website sau peste 50.000 cereri CRM relevante: micșorează intervalul/lookback. Registrul raportat are limita 10.000 linkuri, lista de trasee afișează ultimele 100 rezultate, detaliul maximum 1.000 evenimente. Nu pretinde raport exhaustiv dacă răspunsul indică limită/trunchiere.

## Recomandări utile

Citește întâi măsurarea, apoi explică observația, ipoteza și testul propus. Pentru restaurant verifică livrarea, disponibilitatea și rezervările; pentru magazin costul de livrare, checkoutul și retururile; pentru fabrică oferta, formularul, calificarea și durata până la contract. Un pas cu scădere mare este loc de investigație, nu dovadă a cauzei. Acordă timp cohortelor recente.

Raportarea, pregătirea unui link și salvarea unui funnel nu autorizează publicarea sau cheltuiala. Păstrează aprobările de postare/reclamă și acordurile de comunicare existente. Pentru planuri și experimente citește `knowledge/masurare-marketing-atribuire.md` și skill-ul `condu-marketingul`.
