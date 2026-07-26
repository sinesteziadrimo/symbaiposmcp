# Jocuri & Activități (Atracții)

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Modulul acoperă atracțiile și jocurile pe care le oferi clienților prin portal (parc de distracții, escape room-uri, terenuri de sport, activități tematice): programul pe zile și excepțiile de dată, prețurile (pe persoană / pe grup / exclusivitate), capacitatea pe slot, sistemul de rezervări (online prin portal sau manual din sistem) și confirmarea disponibilității. Configurarea o faci în pagina **/portal-games**; clienții văd versiunea publică în **/portal-attractions**. Pentru fluxurile generale de rezervări, contracte și loialitate vezi ghidul „Rezervări, Clienți & Evenimente".

## Concepte

- **Atracție / Joc** — o activitate rezervabilă (ex: Escape Room Piramida, teren de tenis, parc gonflabile). Are configurări generale (nume, descriere, imagine, categorie, vârstă minimă, jucători min/max), program pe zile, prețuri și excepții de dată.
- **Program pe zile** — pentru fiecare zi (luni–duminică): ore de deschidere/închidere, durata unui slot (ex: 60 min), timp de pregătire (prep) între grupe (ex: 15 min pentru curățenie/setup), capacitate pe slot (ex: 6 jucători) și o etichetă/label (ex: „Standard", „Weekend") folosită pentru prețuri diferențiate.
- **Slot / perioadă disponibilă** — o fereastră de timp la o dată (ex: 14:00–15:00, marți). Sistemul le calculează automat din program, timpul de pregătire și rezervările deja existente.
- **Excepție de dată (override)** — pentru o dată anume (ex: 25 decembrie) poți seta: închis complet, orare custom, capacitate diferită sau durată/prep diferite. O excepție pe o dată o **înlocuiește complet** pe cealaltă de la aceeași dată.
- **Preț** — pe tip: **per persoană** (tarifă liniară, ex: 50 RON/copil, 80 RON/adult), **per grup** (preț fix indiferent de număr, ex: 300 RON o sesiune), **exclusivitate** (închiriere totală pe interval) și **variante cu label** (același joc, preț diferit după etichetă — ex: seara mai scump).
- **Rezervare de joc** — o grupă care rezervă un slot: dată/oră, număr de jucători (copii/adulți), contact, eventual exclusivitate. Status: Așteptare → Confirmată → Prezentă / Absentă / Anulată.
- **Disponibilitate** — dacă un slot mai are locuri, pe baza capacității și a rezervărilor existente. `check_game_availability` răspunde da/nu la o cerere punctuală; `get_game_slots` listează toate sloturile libere la o dată.
- **Exclusivitate** — o grupă închiriază integral atracția pe un interval (nimeni altcineva în acel slot). Se permite per joc și influențează prețul (tip „exclusivitate").
- **Vârstă minimă & min/max jucători** — limite per joc, validate atât la rezervarea online (portal) cât și la cea manuală (din sistem).

## Pagini

- **Jocuri** (`/portal-games`) — centrul de gestionare a atracțiilor. Taburi: **Jocuri** (lista cu nume, imagine, categorie, jucători min/max, capacitate, durată slot, timp pregătire, acceptă rezervări, exclusivitate, vârstă minimă, prețuri — cu Editează / Clonează / Previzualizează), **Programe pe zile** (tabel 7 zile × ore / durată slot / prep / capacitate / label), **Excepții de dată** (calendar de excepții: închis / program custom / capacitate diferită), **Prețuri** (tip preț, valoare, TVA, label, valabilitate, activ) și **Recenzii & Rating**.
- **Atracții** (`/portal-attractions`) — ce văd clienții în portal: răsfoire pe categorii, imagini, detalii. Pentru manager e practic vizualizarea publică.
- **Detaliu joc** (`/portal-games/:gameId`) — programul, prețurile, vârsta minimă, recenziile și disponibilitatea (sloturile libere se calculează dinamic când alegi o dată). De aici se rezervă.
- **Calendar** (`/calendar`) — dacă atracțiile sunt tratate ca evenimente, apar și pe calendarul general al proprietății, alături de rezervări și petreceri (cu filtre).
- **Misiuni & Recompense** (`/portal-missions`) — gamificarea portalului; se poate lega de atracții (misiuni/insigne după rezervări).
- **Rapoarte** — în zona de Analytics există raportul de atracții/jocuri: ocupare pe zile (% din sloturi rezervate), top atracții după rezervări/venituri, venituri pe perioadă, tendințe.

## Fluxuri pas-cu-pas

1. **Configurezi o atracție nouă**: /portal-games → tab Jocuri → „Joc Nou" (nume, descriere, imagine, categorie, jucători min/max, vârstă minimă, exclusivitate da/nu). Prin AI: `update_game_config` (merge și la inițializare). Apoi setezi programul pe fiecare zi în tab Programe (`update_game_schedule`: zi, ore, durată slot, prep, capacitate, label), adaugi prețul în tab Prețuri (`update_game_pricing`: tip per persoană/grup/exclusivitate, valoare, TVA, label) și, opțional, excepțiile de dată (`set_game_date_override`).
2. **Verifici disponibilitatea pe o dată/oră**: clientul cere „avem loc pe 15 mai la 14:00 pentru 4?" → `check_game_availability` (gameId, dată, oră, nr. jucători, exclusivitate). Dacă da → creezi rezervarea; dacă nu → propui alte ore cu `get_game_slots`.
3. **Listezi toate sloturile libere la o dată**: `get_game_slots` (gameId, dată, nr. jucători) întoarce orele libere + capacitatea rămasă pe fiecare. Propui clientului una dintre ele.
4. **Creezi o rezervare manual (din sistem)**: /portal-games → alegi atracția → „Rezervă" → client, dată, oră, jucători (copii/adulți), contact, exclusivitate da/nu. Prin AI: `create_game_reservation`. **Întotdeauna** verifică întâi disponibilitatea (pasul 2), ca să eviți suprapunerea.
5. **Clientul rezervă online prin portal**: pe portalul public alege jocul, data și ora; sistemul verifică automat disponibilitatea și creează rezervarea cu status în Așteptare sau auto-confirmată (după setări). Tu o vezi în /portal-games și o confirmi/refuzi.
6. **Vezi detaliile complete ale unui joc** (program, prețuri, recenzii, disponibilitate): `get_game_details` (gameId; opțional o dată) sau deschizi /portal-games/:gameId.
7. **Modifici programul sau prețul după lansare** (ex: week-end aglomerat): tab Programe → ajustezi durata slot / prep / capacitate pe sâmbătă-duminică (`update_game_schedule`); tab Prețuri → adaugi o variantă cu label (ex: „Seară") la alt preț (`update_game_pricing`).
8. **Setezi o excepție de dată** (ex: 25 dec. închis; 31 dec. orare 18:00–23:00 cu capacitate mărită): tab Excepții de dată sau `set_game_date_override` (gameId, dată, închis da/nu, ore custom, capacitate/durată/prep override). Efectul apare imediat la rezervarea pe portal.
9. **Anulezi o rezervare de joc**: o găsești în /portal-games (filtru pe dată/client), o deschizi și „Anulează" (opțional motiv). Slotul se eliberează și redevine disponibil.
10. **Raportezi venituri și ocupare**: în zona de Analytics → raportul de atracții pe perioadă (venituri, nr. rezervări, ocupare medie, top ore/atracții). Pentru analize punctuale poți folosi `execute_sql_query` (read-only).

## Tool-uri MCP utile

- **Citire (read-only; cere grantul `readModule` al domeniului pe token):** `list_portal_games` (toate jocurile cu detalii complete), `get_game_details` (un joc: program, prețuri, excepții, recenzii), `check_game_availability` (da/nu pe dată/oră/jucători), `get_game_slots` (toate sloturile libere la o dată). Plus `gaseste_in_aplicatie` pentru linkul direct și `jurnal_activitate` pentru cine a creat/anulat o rezervare.
- **Scriere — modul «Setări & Configurare» (`setari`) pe token:** `update_game_config`, `update_game_schedule`, `update_game_pricing`, `set_game_date_override` (creare și configurare jocuri).
- **Scriere — modul «Rezervări & Clienți» (`rezervari_clienti`) pe token:** `create_game_reservation` (rezervare de joc manuală).
- Niciun tool de jocuri nu cere confirmare (`confirm: true`). Permisiunea exactă a fiecărui tool e în catalogul din `tools-mcp.md`. Dacă un tool întoarce „permisiune insuficientă", modulul nu e bifat pe token → portal Hub → Acces AI.

## Întrebări frecvente

- **De ce nu văd sloturi libere la o atracție?** Cel mai des: jocul nu are program setat (tab Programe gol) sau orele/capacitatea sunt 0. Deschide /portal-games → Programe, pune ore de deschidere și capacitate > 0, salvează.
- **Clientul vrea 10 jucători, dar maximul e 8.** Fie oferi exclusivitate / două sesiuni consecutive (cost dublu), fie crești maximul jocului în tab Jocuri → Max jucători (doar dacă atracția chiar permite, altfel pui în pericol experiența).
- **Cum fac preț diferit pentru weekend vs. zilele lucrătoare?** Prin label-uri: pune label „Weekend" pe sâmbătă-duminică (tab Programe) și adaugă o variantă de preț cu același label (tab Prețuri). Portalul afișează prețul corect după ziua aleasă.
- **Cum garantez exclusivitatea unui grup?** Bifează exclusivitate la rezervare — sistemul blochează toți ceilalți jucători în acel slot. Pentru o taxă mai mare, configurează un preț de tip „exclusivitate".
- **Cum văd cine nu s-a prezentat (no-show)?** În /portal-games filtrezi rezervările pe status Absent; sau cauți în `jurnal_activitate` pe entitatea de rezervare de joc.
- **Pot avea aceeași atracție cu două prețuri în aceeași zi?** Nu pe aceeași oră, dar da pe intervale diferite cu label-uri (ex: „Matinal" 09:00–12:00, „Seară" 18:00–21:00) sau ca două jocuri separate (Standard / VIP).
- **Ce se întâmplă dacă clientul nu plătește avansul?** Dacă avansul e obligatoriu (din setări), rezervarea rămâne în Așteptare până la plată; o vezi în coadă și-l contactezi. Avansurile/contractele țin de fluxul de rezervări — vezi ghidul „Rezervări, Clienți & Evenimente".

## Capcane

- **Overbooking accidental** — dacă creezi o rezervare manual fără să verifici disponibilitatea, două grupe pot pica în același slot. Apelează `check_game_availability` ÎNAINTE de `create_game_reservation`.
- **Timpul de pregătire (prep) neglijat** — fără prep corect, sloturile se suprapun (14:00 și 14:15 simultan). Setează prep pe fiecare zi; sistemul lasă automat pauza între grupe.
- **Schimbări de capacitate fără notificare** — dacă mărești capacitatea pe o zi full-booked, locurile „noi" nu sunt anunțate clienților de pe lista de așteptare. După o modificare importantă, verifică cine poate fi confirmat.
- **Excepții de dată care se „bat"** — o excepție pe o dată o înlocuiește complet pe cealaltă. Nu pune „închis" ȘI „program special" pe aceeași dată; lasă o singură excepție finală.
- **Prețul nou nu apare imediat în portal** — după ce salvezi prin conexiune, datele sunt corecte, dar interfața/portalul pot arăta valoarea veche până la refresh (cache browser). Confirmă cu un tool de citire, nu repeta scrierea.
- **Clientul vede atracția dar nu poate rezerva** — verifică în tab Jocuri coloana „Acceptă rezervări", dacă mai sunt sloturi libere și dacă vârsta minimă nu blochează (ex: copil sub minim).
- **Sloturi care nu se regenerează după ce schimbi prep/durata** — modificarea se aplică la generările următoare; sloturile deja create rămân până la dată, ajustează-le manual dacă e urgent.
- **Consum de stoc la evenimente cu joc** — jocurile sunt activități, nu produse de vânzare; dacă o petrecere consumă marfă (baloane, catering), descarcă stocul manual din modulul de stocuri/inventar.
