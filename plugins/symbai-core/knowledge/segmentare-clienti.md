# Segmentare clienți (grupuri & segmente)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Segmentarea îți împarte clienții în categorii ca să le poți trimite oferte și campanii potrivite, nu „tuturor la grămadă". Sunt două lucruri diferite: **grupuri** (liste statice făcute de tine manual — ex: „VIP", „Corporate", „Clienți eveniment") și **segmente dinamice** (calculate automat de sistem pe comportament — cât de recent/des/mult cumpără un client, nivelul de loialitate, taguri). Segmentele și grupurile se folosesc apoi la email, SMS/WhatsApp, oferte și în portalul clienților. Pentru cine cumpără cu adevărat cel mai mult vezi și ghidul „Loialitate & Fidelizare" (RFM); pentru reactivarea clienților care pleacă vezi „CRM & Automatizări"; pentru trimiterile efective vezi „Email marketing" și „Marketing & Social".

## Concepte

- **Grup de clienți** — listă **statică** pe care o construiești manual (adaugi/scoți membri de mână). Rămâne așa până o modifici tu. Bun pentru cluburi private, „VIP-uri alese de mine", liste de eveniment.
- **Segment dinamic** — categorie **calculată automat** pe criterii; membrii intră/ies singuri pe măsură ce clienții cumpără sau nu. Nu-l editezi de mână.
- **RFM** — segmentarea automată după **R**ecency (cât de recent a cumpărat), **F**requency (cât de des), **M**onetary (cât a cheltuit). Combinația „recent + des + mult" = client de top; „demult + rar + puțin" = candidat de reactivare (win-back). Detaliile programului sunt în „Loialitate & Fidelizare".
- **Tag (etichetă)** — marcaj pus pe clienți (ex: „Corporate", „VIP", „Lead Facebook"). Toți cei cu același tag formează practic un grup pe care îl poți filtra în campanii.
- **Audiență de campanie** — cui trimiți efectiv: pleci de la un segment/grup și adaugi filtre (locație, opt-out). Întotdeauna o **previzualizezi** înainte de trimitere.
- **Opt-out (GDPR)** — fiecare client are acord separat pe fiecare canal (email, SMS, WhatsApp). Indiferent de segment, sistemul **nu trimite** către cine a refuzat acel canal.

## Pagini

- **Clienți** (`/customers`) — baza de clienți; de aici vezi un client, tagurile lui, grupurile și inițiezi operațiile.
- **Rapoarte Clienți** (`/customer-reports`) — distribuția RFM, top clienți, vizualizarea segmentelor.
- **Follow-up Clienți** (`/customer-followup`) — „Next Best Action": pe cine merită să contactezi azi (reactivare, ofertă), pe scor RFM.
- **Fidelizare & Recompense** (`/loyalty`) — distribuția pe niveluri, clienți cu puncte, setările programului.
- **Email marketing** și **Marketing & Social** — de aici alegi audiența (segment/grup) și trimiți. Pentru linkurile exacte folosește `gaseste_in_aplicatie`.

## Fluxuri pas-cu-pas

1. **Faci un grup manual „VIP"**: în /customers creezi grupul (`create_customer_group`), apoi adaugi membrii unul câte unul (`add_customer_group_member`). Verifici cu `list_customer_groups` (arată grupurile + numărul de membri).
2. **Verifici cât de mare e un segment înainte să trimiți**: spui criteriile (ex: a cumpărat în ultimele 30 zile, peste 500 lei) și ceri o previzualizare cu `preview_guest_segment` — îți dă numărul exact de clienți, fără să trimită nimic.
3. **Estimezi audiența unei campanii pe taguri**: `get_customer_email_segments` (numără clienții activi pe etichete) sau `preview_email_audience` (dry-run: câți și care ar primi campania după tip de audiență + taguri/surse).
4. **Trimiți email doar unui segment**: întâi pregătești campania ca ciornă (`create_email_campaign` — subiect, conținut, audiența pe segment/etichete), previzualizezi audiența (`preview_email_audience`), apoi trimiți campania (`send_email_campaign`, cere confirmare). La trimitere, sistemul **sare automat** peste cei cu opt-out email. Vezi rezultatele cu `get_email_campaign_analytics`.
5. **Faci o ofertă vizibilă unui segment** (ex: happy hour pentru clienți inactivi): creezi oferta cu `create_offer` (reducere care chiar scade nota la POS) și o targetezi pe segmentul ales din interfață.
6. **Pui un tag pe mulți clienți deodată** (ex: marchezi „VIP" pe toți cei dintr-un filtru): `bulk_assign_tag` (un tag pe toate entitățile care corespund filtrelor) sau `assign_tag` (un singur client).
7. **Recalculezi segmentele RFM acum** (după o zi cu vânzări mari, ex: Black Friday): de obicei se recalculează automat; pentru o reîmprospătare imediată rulezi `recompute_loyalty_rfm`. După câteva minute, în /customer-reports segmentele sunt la zi.
8. **Reactivezi clienții care s-au răcit**: `evaluate_loyalty_drop_alerts` îți dă lista clienților buni în scădere → în /customer-followup decizi acțiunea → trimiți o ofertă pe segmentul win-back (`send_email_campaign` / WhatsApp) sau creezi o sarcină (`create_task`).
9. **Trimiți WhatsApp targetat**: previzualizezi segmentul (`preview_guest_segment`), apoi trimiți (`send_whatsapp_message`, cere confirmare). Și aici opt-out-ul WhatsApp e respectat automat.

## Tool-uri MCP utile

- Citire (read-only; cere grantul `readModule` al domeniului pe token): `list_customer_groups`, `preview_guest_segment`, `preview_email_audience`, `get_customer_email_segments`, `get_customer_timeline`, `get_guest_loyalty_detail`, `evaluate_loyalty_drop_alerts`.
- Scriere (modulul «Rezervări & Clienți» pe token): `create_customer_group`, `add_customer_group_member`, `create_customer`, `award_loyalty_points`, `recompute_loyalty_rfm`.
- Scriere (modulul «Produse & Meniuri» pe token): `assign_tag`, `bulk_assign_tag`.
- Scriere (modulul «Marketing & Social Media» pe token): `create_offer`.
- Scriere (modulul «Personal & Ture» pe token): `create_task` (sarcină de urmărit un client).
- Scriere (modulul «Comunicare» pe token): `create_email_campaign` (ciornă, nu trimite), `send_email_campaign` 🔒, `send_whatsapp_message` 🔒 (ultimele două cer `confirm: true` — trimit la destinatari reali).
- Permisiunea exactă a fiecărui tool e în catalogul din `tools-mcp.md`. Dacă un tool întoarce „permisiune insuficientă", modulul lui nu e bifat pe token → portal Hub → Acces AI.

## Întrebări frecvente

- **Pot adăuga manual un client într-un segment dinamic?** Nu. Segmentele RFM se calculează automat pe comportament. Dacă vrei control manual, fă un **grup** (static, editabil).
- **De ce nu se actualizează segmentul imediat după o vânzare?** RFM se recalculează automat periodic. Pentru update instant rulează `recompute_loyalty_rfm` și așteaptă câteva minute.
- **Previzualizarea zice 48 de clienți, dar emailul a plecat la 42 — de ce?** Cei 6 lipsă au opt-out pe canalul respectiv. Previzualizarea arată tot segmentul (transparent), trimiterea filtrează automat opt-out-ul. E corect.
- **Cum decid cine e „VIP"?** Trei variante: (1) automat din RFM (recent + des + mult); (2) manual, faci un grup și alegi tu membrii; (3) mixt — segment RFM „VIP" + tag „VIP" + ofertă specială, apoi măsori și rafinezi.
- **La ce se folosesc segmentele, în afară de email?** SMS/WhatsApp, oferte vizibile doar unui grup, secțiuni exclusive în portalul clienților (pe tag), playbook-uri de reactivare (CRM) și rapoarte.
- **Pot edita criteriile unui segment RFM după ce l-am creat?** Nu — sunt parametri de sistem. Dacă vrei altă tăietură, fă un **grup** din clienții potriviți (grupurile se editează liber).
- **Cum mut un client între grupuri?** Din fișa clientului bifezi grupul nou; pentru adăugare prin conexiune folosești `add_customer_group_member` pe grupul țintă, iar scoaterea din grupul vechi o faci din aplicație (nu există tool dedicat de „mutare").

## Capcane

- **Grup ≠ Segment.** Grupul e static și editabil („lista mea de abonați"); segmentul e dinamic și doar de citit, calculat de sistem („cine a cumpărat în 30 zile"). Nu încerca să editezi un segment și nu te aștepta ca un grup să se actualizeze singur.
- **Previzualizare ≠ audiență finală.** Previzualizarea arată tot segmentul; la trimitere se scad cei cu opt-out + GDPR. Diferența e normală.
- **Etichetarea unui segment nu e automată.** Dacă vrei un tag pe tot segmentul, trebuie să rulezi `bulk_assign_tag` — interfața nu o face singură.
- **Dedupe silențios la grup.** Dacă adaugi un client deja membru, sistemul îl ignoră fără eroare. Confirmă numărul real cu `list_customer_groups`, nu repeta adăugarea.
- **Modificările prin conexiune nu se văd instant în browser** (cache). După `add_customer_group_member` etc., dă refresh sau verifică cu un tool de citire — nu repeta scrierea.
- **Oferta pe segment nu e magie la casă.** Oferta creată cu `create_offer` se aplică pe regulile ei; vizibilitatea „doar pentru segment X" în portal/meniu nu înseamnă reducere automată în orice scenariu — verifică setările ofertei.
- **Date de contact greșite rămân inutilizabile.** Un telefon/email invalid intră în bază, dar SMS-ul/emailul nu ajunge. Curăță datele înainte (vezi și fuziunea de duplicate din „GDPR & date clienți").
- **„Locație" ≠ „zonă de livrare".** Un segment pe locație/restaurant nu e același lucru cu zona geografică de livrare — nu le confunda când targetezi.
- **Opt-out se verifică pe canal, nu global.** Un client poate fi OK pe email și refuzat pe SMS; trimiterea pe fiecare canal respectă acordul lui separat.
