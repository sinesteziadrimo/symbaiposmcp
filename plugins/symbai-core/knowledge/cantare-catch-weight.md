# Cântare & catch-weight (greutate variabilă)

Folosește `gaseste_in_aplicatie("cantare")` / `gaseste_in_aplicatie("setari imprimante")` pentru link-uri directe la paginile de configurare.

## Pe scurt

**Catch-weight** = greutate variabilă. Un produs e numărat în **bucăți**, dar prețul și valoarea lui ies din **kg-ul real cântărit**, nu dintr-o greutate fixă presupusă. Tipic la carne, brânză, pește, mezeluri, semipreparate de patiserie vândute „la kg". Două bucăți din același produs au greutăți diferite — fiecare se cântărește și se prețuiește separat.

De ce contează: la o fabrică/măcelărie/brânzărie, dacă vinzi la kg dar sistemul valorizează „pe bucată", pierzi bani la fiecare gram în plus dat gratis (giveaway) și nu poți factura corect către retail. Catch-weight rezolvă asta — leagă greutatea reală de lot, de preț și de eticheta cu cod de bare.

## Cum se conectează un cântar

Cântarul se conectează la **PC-ul care rulează Print Agent** (același calculator care vorbește cu imprimanta de bonuri / casa de marcat). De acolo Symbai citește greutatea. Conexiunea poate fi:
- **serial** (cablu pe un port COM — cel mai comun la cântarele de bancă); ai nevoie de portul (ex. COM3) și viteza (baud, de obicei 9600);
- **rețea (TCP)** — cântarul are IP în rețeaua locală;
- (în pregătire) **Bluetooth** pentru cântare portabile pe telefon.

Multe cântare din industria alimentară (CAS, Dibal, Bizerba, Mettler-Toledo și altele) trimit greutatea ca text simplu, continuu (de ex. ceva de forma „greutate stabilă = 1.234 kg"). Pentru toate astea există driverul **„generic-ascii"** care merge fără configurare specială. Cântarele cu protocol propriu au drivere dedicate, iar cele încă nesuportate se pot **cere spre integrare** (vezi mai jos).

Există și cântare care **tipăresc singure eticheta** (price-computing, cu cap de etichetă propriu) — acelea cântăresc și scot eticheta cu greutate+preț direct, iar Symbai le trimite articolul/PLU.

## Fluxul cântărește → preț → etichetă

1. **Marchezi produsul ca la-kg** (catch-weight) și-i pui prețul pe kg.
2. La recepție sau la ieșirea din producție, **cântărești** — greutatea reală se leagă de lotul respectiv.
3. **Prețul** se calculează din greutatea cântărită × prețul pe kg (la vânzare/factură B2B).
4. **Eticheta** produsului primește greutatea reală într-un **cod de bare GS1** (greutate + lot + termen de valabilitate), scanabil la casă și la recepție.

Greutatea nominală (kg/bucată estimat) pe care o setezi pe produs e doar o estimare pentru planificare; adevărul e greutatea cântărită.

## Ce poți face prin conexiune (MCP)

- **Vezi ce cântare sunt suportate** și ce ai cerut spre integrare.
- **Înregistrezi un cântar fizic** legat de PC-ul cu Print Agent (driver + conexiune).
- **Marchezi produse ca la-kg** (catch-weight), cu preț pe kg și greutate nominală.
- **Citești ultima greutate** raportată de un cântar.
- **Ceri integrarea unui model nou** de cântar dacă nu e încă suportat — se deschide un ticket la echipa Symbai cu producătorul, modelul și o mostră de output; primești o referință (SYM-…) și ești anunțat pe email când e gata.

## Când ceri un model nou de cântar

Dacă modelul nu apare ca suportat și nu vorbește protocolul ASCII standard, nu rămâi blocat: trimite o cerere de integrare cu **producătorul + modelul** și, ideal, **o mostră de ce trimite cântarul pe serial**. Cu mostra, echipa Symbai poate adăuga driverul rapid. Până atunci, merită încercat driverul „generic-ascii" — acoperă majoritatea cântarelor de bancă.

## Limite curente (onest)

- Citirea **live, la cerere**, direct de la cântar (apeși un buton și-ți arată greutatea pe loc) este în curs de finalizare; până atunci se vede ultima greutate raportată de cântar.
- Driverele de cântar sunt marcate „beta" până la validarea pe hardware fizic — pentru un model nou, validarea se face împreună cu prima instalare reală.
- Ștergerea cântarelor/modelelor se face din aplicație, nu prin conexiune.
