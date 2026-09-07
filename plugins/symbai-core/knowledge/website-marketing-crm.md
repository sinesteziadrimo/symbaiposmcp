# Marketing pe website: măsurare, cereri în CRM și rezultate comerciale

Pentru UTM automate per postare, trasee native, surse conectate și funneluri configurabile: `knowledge/marketing-impact.md`.

Ghid verificat la 6 septembrie 2026. Pentru restaurante, ecommerce, fabrici și servicii. Verifică întotdeauna tool-urile expuse de tenant; dacă lipsesc, nu pretinde că funcția este activă și nu publica scripturi improvizate în pagină.

## Traseul de configurare

1. Identifică brandul și website-ul prin `list_brands`, `list_websites` și citirea configurației. Păstrează perechea exactă `brandId` + `websiteId` în toate apelurile. Un brand poate avea mai multe website-uri.
2. `get_website_marketing_playbook({vertical})`: restaurant, ecommerce, factory, hotel, experiences sau services. Întoarce obiective, pagini, idei de audiențe, excluderi, experimente și surse. Sunt recomandări, nu campanii deja create.
3. `get_website_marketing_setup({brandId,websiteId})`: setări, existența formularului, rutare CRM și indicii despre integrări. Prezența unui ID nu dovedește că evenimentele ajung la destinație. Verifică separat conexiunea Google unificată și contul Meta.
4. `configure_website_marketing({brandId,websiteId,settings,dryRun:true})`. Examinează configurația rezultată, apoi aplică modificarea autorizată cu `dryRun:false`. Modificarea nu redesenează paginile și nu lansează reclame.
5. Testează formularul și traseul comercial; apoi `get_website_marketing_report({brandId,websiteId,days:30})`. Folosește comenzi de test aprobate, fără să generezi plăți sau reclame reale pentru un simplu audit.

Setările acceptate sunt `vertical`, `enabled`, `trackSearch`, `trackEngagement` și `leadCapture`. Rutarea cererilor acceptă `enabled`, `pipelineId`, `stageId`, `assignedTo`, `followupHours` (1–168) și `formSources`. Un câmp omis își păstrează valoarea; `null` golește o alegere CRM. Lista goală de surse include toate formularele contact; surse precum contact/catering sunt filtre, nu abonări.

Exemplu: pentru o fabrică, configurează `vertical:factory` și `leadCapture:{enabled:true,followupHours:24}`. Fără pipeline explicit, prima cerere creează un flux separat „Cereri website”. Pentru un responsabil sau o etapă existente, citește ID-urile reale înainte de configurare. Timpul intern de urmărire nu este o promisiune publică automată de răspuns.

Pentru ID-urile publice există `configure_website_marketing_tags({brandId,websiteId,tags,dryRun:true})`. Acceptă `facebookPixelId`, `googleAnalyticsId`, `googleAdsId` și etichetele Google Ads `googleAdsConversionLabel`, `googleAdsLeadConversionLabel`, `googleAdsReservationConversionLabel`. Aceste setări sunt comune website-urilor brandului: examinează `affectedWebsiteIds`, `manual`, `effective` și `overriddenByGoogleConnection`; salvează schimbarea autorizată cu `dryRun:false,applyToBrand:true`. Nu acceptă tokenuri. O destinație Google verificată din tag are prioritate; un ID numeric de cont/acțiune nu înlocuiește eticheta reală de conversie. `null` golește setarea manuală, dar nu dezactivează conexiunea Google.

## Ce este un lead și ce se întâmplă cu el

Formularul contact acceptat se păstrează chiar dacă CRM este temporar indisponibil. Dacă rutarea este activată, creează o oportunitate și o activitate de urmărire. Valoarea necunoscută nu devine venit estimat inventat. Retrimiterea aceleiași cereri nu trebuie să creeze alt lead.

`sync_website_marketing_leads({brandId,websiteId,limit:25})` reia cererile păstrate în așteptare, după corectarea rutării. Repetă loturile cât timp raportul indică cereri rămase. Nu trimite mesaje clienților.

`qualify_website_marketing_lead({brandId,websiteId,messageId,qualified:true,reason})` înregistrează calificarea decisă efectiv de echipă. Nu marca automat toate formularele ca fiind calificate. Rezervările, abonările la newsletter și comenzile au trasee proprii; nu sunt toate convertite automat în acest pipeline.

Trimiterea unei solicitări permite tratarea solicitării, nu înscrierea automată în email, WhatsApp, push sau audiențe. Verifică acordul pe canal și retragerile înaintea utilizării comerciale a datelor de contact.

## Meta, Google și consimțământ

- Analytics și publicitatea sunt categorii separate. Formularul și cumpărarea trebuie să funcționeze și când vizitatorul refuză ambele categorii. Modelul de bază nu încarcă bibliotecile publicitare înaintea acordului relevant.
- Meta Pixel și Conversions API folosesc aceeași identitate pentru aceeași acțiune. Nu instala un al doilea pixel prin custom HTML sau GTM fără un plan de migrare: dublarea instalării poate dubla măsurarea. În contexte unde pixelul browserului ar expune URL-uri sensibile, măsurarea server poate rămâne singura cale.
- În Google, alege o singură conversie primară pentru același rezultat: nu suma importul GA4 și tagul Ads ca două cumpărături. Etichetele pentru Purchase, Lead și rezervări sunt distincte; nu folosi eticheta de cumpărare pentru orice formular.
- Evenimentele ecommerce au produse, valoare, monedă și identitate stabilă. O comandă ramburs sau transfer încă neplătită este `order_placed`, nu `purchase`. Plata confirmată este semnalul pentru Purchase; browserul nu stabilește valoarea autoritativă.
- Parametrii analytics obișnuiți nu primesc numele, emailul, telefonul sau textul solicitării. Nu pune aceste date nici în UTM, URL-uri publicitare sau titluri de pagină. Verifică separat în GA4 măsurarea automată a formularelor/paginilor și orice tag extern; acestea pot ocoli configurarea evenimentelor native.
- UTM și căutările interne descriu semnale observate, nu identitatea sau firma unui vizitator anonim. Ad blockers, refuzul acordului și limitările platformelor fac măsurarea incompletă.

## Conversiile CRM către Google

Pentru calificare/contract câștigat se folosește Google Data Manager API. Nu crea un nou flux bazat implicit pe vechile upload-uri Google Ads API. Contul trebuie conectat cu permisiunea Data Manager, iar `conversionActionId` este ID-ul numeric al unei acțiuni offline `UPLOAD_CLICKS`, nu eticheta AW din website.

1. `export_website_lead_conversions({brandId,websiteId,messageIds,goal:"qualified",conversionActionId,mode:"preview"})` face previzualizare locală. Pentru un contract, `goal:"won"` cere stare câștigată, dată, valoare pozitivă și monedă în CRM. Valoarea contractului nu este încasare contabilă.
2. Abia după autorizarea explicită a utilizatorului folosește `mode:"validate"` sau `mode:"send"` și `confirmExternal:true`. Și validarea transmite date la Google. Exportul folosește identificatorul clicului acceptat, nu încarcă email/telefon; verifică și retragerile curente.
3. `get_website_lead_conversion_status({brandId,websiteId,messageId,goal,conversionActionId})` verifică procesarea. Acceptarea cererii, procesarea și atribuirea sunt trei lucruri diferite. Confirmă potrivirea și în diagnosticele Google.
4. La `rejected` sau `FAILED`, corectează cauza și folosește explicit `retryFailed:true`. La `uncertain`, verifică mai întâi contul; `retryUncertain:true` reia doar aceeași identitate și același conținut. Nu retrimite automat `PARTIAL_SUCCESS` sau `PROCESSING`.

Fereastra de clic eligibilă, setările conversiei și politicile contului pot limita potrivirea. Nu inventa un identificator de clic, o calificare, o valoare sau o dată doar ca exportul să treacă. Dacă acordul curent este refuzat, rezolvă prin procesul legitim de consimțământ; nu ocoli poarta.

## Recomandări specifice domeniului

| Domeniu | Ce trebuie să afle vizitatorul | Ce măsori și promovezi |
|---|---|---|
| Restaurant | Meniu actual, program, zonă/cost livrare, rezervare, locație | Comenzi plătite, rezervări confirmate și ulterior onorate. Promovează preparate disponibile și intervale cu capacitate; separă cateringul. |
| Ecommerce | Variante, stoc, preț total, livrare și retur, dovezi reale | Contribuția după costuri, retururi și reclamă; coșurile sunt semnale secundare. ID-urile produselor trebuie să corespundă catalogului publicitar. |
| Fabrică alimentară | Gamă, aplicații, ambalare, condiții publice, certificări autentice, contact comercial | Cereri pentru mostre/ofertă, potrivire volum/zonă/termen, contracte. Nu publica rețete sau telemetrie pentru a demonstra capacitatea. |
| Fabrică nealimentară | Materiale, aplicații, specificații publicabile, capabilități, studii de caz | Lead calificat și contract; separă recrutarea și suportul de solicitările comerciale. |

Retargetingul pornește de la intenție: produs/gamă văzută, coș sau cerere incompletă. Exclude cumpărătorii ori cererile deja preluate din același mesaj și respectă disponibilitatea/geografia. Ferestrele se aleg din timpul real până la cumpărare, nu dintr-un procent universal. Audiențele mici pot să nu fie eligibile; nu promite livrarea reclamelor înainte de verificare.

Pentru ce caută oamenii: combină Search Console, termeni Google Ads, căutări fără rezultate pe website, întrebări comerciale și rezultate CRM. Termenul căutat nu este automat o comandă potențială. Raportul website afișează termenii repetați de minimum cinci evenimente, nu cinci persoane. Nu conține toate căutările Google, costuri publicitare sau o măsurare cauzală a vânzărilor.

Pentru fiecare recomandare scrie: observația și perioada, limita datelor, ipoteza, schimbarea propusă, metrica și regula de decizie. Pragul de rentabilitate pornește de la contribuția reală după costurile variabile și bugetul disponibil; nu impune ROAS, LTV:CAC sau split de buget universal. Experimentele primesc limită de cheltuială, durată și criteriu de succes înainte de pornire.

La ecommerce, fă vizibilă cumpărarea fără cont, explică prețul total înainte de plată și marchează câmpurile obligatorii/opționale. La B2B, pune specificațiile publicabile direct în pagină și oferă PDF ca opțiune, fără să condiționezi orice informație de un formular. Cercetarea de utilizabilitate justifică verificarea acestor probleme; nu este o garanție că un anumit client va obține același rezultat comercial.

Limite practice: atribuirea nativă este păstrată în sesiunea browserului, nu reprezintă recunoaștere garantată între vizite sau dispozitive. Lista tipurilor de evenimente nu înseamnă că orice componentă personalizată le emite deja; verifică fiecare interacțiune concretă. Cererile rămase în așteptare se reiau cu tool-ul de sincronizare. Audiențele și campaniile se configurează separat, prin capabilitățile disponibile ale contului.

## Surse de verificare

- [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) și [GA4 ecommerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce): consimțământ și evenimentele traseului de cumpărare.
- [Google Data Manager ingestion](https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest) și [diagnostice](https://developers.google.com/data-manager/api/reference/rest/v1/requestStatus/retrieve): validare, recepție și procesare.
- [Google enhanced conversions for leads](https://support.google.com/google-ads/answer/11021502?hl=en): traseul actual de import al rezultatelor comerciale.
- [Meta SDK oficial](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/serverside/event.py): contractul evenimentelor server.
- [Google LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) și [merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing): date publice coerente cu pagina, fără promisiunea apariției automate în rezultate.
- [Baymard: cumpărare fără cont](https://baymard.com/blog/make-guest-checkout-prominent) și [câmpuri obligatorii/opționale](https://baymard.com/blog/required-optional-form-fields): reducerea neclarităților din checkout.
- [Nielsen Norman Group: specificații B2B](https://www.nngroup.com/articles/b2b-specs/): informații tehnice accesibile în pagină pentru evaluarea unei oferte.
