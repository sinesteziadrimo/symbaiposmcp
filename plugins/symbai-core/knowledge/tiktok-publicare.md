# TikTok: conectare, publicare și rezultate

Actualizat la 6 septembrie 2026. Verifică întâi disponibilitatea tool-urilor pe tenant. Integrarea folosește aplicația TikTok administrată de Symbai: clientul își conectează contul prin OAuth, fără să copieze chei sau tokenuri.

## Conectare

Identifică brandul prin `list_brands`, apoi verifică `list_social_accounts`. `genereaza_link_conectare(platforma:"tiktok",brandId)` conduce la Integrări. Utilizatorul deschide pagina autentificat în Symbai, apasă conectarea TikTok și acordă permisiunile în propriul browser. După revenire verifică `verifica_integrare` și `get_tiktok_creator_info(brandId)`.

Rezultatul arată contul, opțiunile de vizibilitate și durata video permise acum. `capabilities.directPost` permite publicarea; `capabilities.insights` permite citirea metricilor disponibile. Dacă lipsește o permisiune, explică motivul și propune reconectarea. Un cont activ nu dovedește că aplicația Symbai a trecut auditul pentru publicare publică. Configurarea aplicației și verificarea domeniului fișierelor sunt responsabilitatea administratorului Symbai. [Cerințele TikTok](https://developers.tiktok.com/docs/en/content-posting-api-get-started).

## Pregătirea unei postări

1. Creează ciorna cu `schedule_social_post`, platforma `tiktok`, conținutul și materialele, fără `scheduledAt`. Poți pregăti textul, fișierele și trackingul autorizat înainte ca omul să deschidă editorul.
2. Citește `get_tiktok_creator_info` și folosește `configure_tiktok_post` cu `brandId`, `postId`, `settings` și `dryRun:true`. După verificare, `dryRun:false` salvează opțiunile. Tool-ul configurează, nu publică.
3. Utilizatorul deschide ciorna în editor, verifică materialul și contul, alege vizibilitatea și confirmă opțiunile TikTok. Interacțiunile pornesc oprite. Pentru promovare selectează declarația comercială potrivită. Confirmarea cerută de TikTok este distinctă de aprobarea editorială a postării și nu poate fi acordată de tool în numele omului. [Regulile de publicare TikTok](https://developers.tiktok.com/docs/en/content-sharing-guidelines).
4. După confirmarea în editor, urmează aprobarea și publicarea/programarea autorizate din skill-ul `programeaza-postare`. O modificare a materialelor, textului, trackingului sau setărilor cere o nouă confirmare în editor. Nu reconfigura aceeași postare prin tool după confirmare dacă nu trebuie schimbată.

`settings` acceptă `privacyLevel`, `allowComment`, `allowDuet`, `allowStitch`, `commercialContent`, `ownBrand`, `brandedContent`, `isAigc`, `autoAddMusic` și `photoTitle`. Omite vizibilitatea până când utilizatorul a ales dintre valorile reale. Nu trimite identificatori de cont, amprente de confirmare sau alte câmpuri nedocumentate. Acestea sunt stabilite de interfața de verificare.

Pentru video încarcă un singur fișier final MP4/MOV/WebM cu sunetul dorit și format Original. Pentru foto: 1–35 JPG/JPEG/WebP; prima imagine devine copertă, muzica recomandată este opțională. La publicare simultană pe mai multe rețele editorul păstrează limita comună de 10 materiale. Nu amesteca video și fotografii. Editorul comun și verificarea UTM folosesc limita de 2.200 caractere pentru textul TikTok.

Story, efectele native TikTok, muzica de adăugat separat, cropul sau montajul neexportat se finalizează ca fișier înainte de publicarea automată, ori prin modul existent de reminder/publicare manuală. Fotografiile care trebuie etichetate AI se finalizează manual în TikTok. Integrarea nu oferă încă trimitere API către inbox pentru editare nativă.

## Procesare și măsurare

`publish_social_post` poate întoarce `pending:true`: TikTok a primit materialul și încă îl procesează. Citește `get_tiktok_post_status(brandId,postId)` până când rezultatul verificat indică publicare sau eșec. Nu retrimite o postare `pending`, `initializing` sau `ambiguousPublish`. Dacă apare o întrerupere cu rezultat incert, păstrează postarea și urmează indicația de verificare/reconectare. O reconectare trebuie făcută la același cont pentru a continua verificarea materialului trimis.

`publishId` identifică operația; nu este link public. O publicare privată poate fi confirmată fără identificator public disponibil. `includeInsights:true` cere vizualizări, aprecieri, comentarii și distribuiri pentru materialul public verificat, dacă permisiunile și API-ul le furnizează. „Indisponibil” nu înseamnă zero. Numerele sunt cumulative, nu persoane unice. [Metricile TikTok](https://developers.tiktok.com/docs/en/tiktok-api-v2-video-query).

Pentru rezultate comerciale citește `knowledge/marketing-impact.md`. Pregătește linkuri distincte cu `source:tiktok`, campanie și placement-ul real (de exemplu bio), folosind `create_marketing_tracking_link`; pentru linkuri din text folosește configurarea și previzualizarea trackingului postării. Un URL în descriere nu trebuie prezentat drept clicabil: verifică destinația disponibilă efectiv contului. Leagă intrările observate pe website de cererile CRM și cumpărăturile verificate. Nu deduce identitatea cumpărătorilor din vizualizările TikTok și nu declara că acest flux creează reclame TikTok Ads.
