# Teme editoriale: magazine, hoteluri și experiențe

Pentru Codex și Claude Code care personalizează website-ul clientului. Completează [website-builder.md](website-builder.md), [experiențele pentru restaurante](website-restaurante-spectaculoase.md) și [fabricile și animațiile proprii](website-fabrici-animatii-proprii.md).

Verifică întâi catalogul **live**: `list_website_templates` și `list_website_component_catalog(type:"hero-slider", includeSchema:true)`. Instanța clientului poate avea o versiune anterioară. Nu declara disponibilă sau aplicată o setare care nu apare în schema instanței.

## Alege compoziția după business

`hero-slider` cu `heroLayout:"editorial"` folosește fotografie mare, titlu, descriere, două acțiuni opționale și capitole schimbate manual. Nu depinde de o animație continuă. Pe telefon, textul și fotografia se așază vertical, iar înălțimea urmărește conținutul.

| `editorialVariant` | Utilizare | Tema din catalog |
|---|---|---|
| `fashion` | Îmbrăcăminte, colecții fotografice | `magazin_fashion` |
| `technology` | Electronice și produse tehnice | `magazin_electronics` |
| `market` | Sortiment general, colecții practice | `magazin_general` |
| `boutique` | Obiecte, bijuterii, selecții de autor | `magazin_boutique` |
| `fresh` | Produse alimentare, ingrediente, sezon | `magazin_alimentar` |
| `family` | Copii, bebeluși, etape de vârstă | `magazin_copii` |
| `play` | Jucării, cadouri și imaginație | `magazin_jucarii` |
| `resort` | Hoteluri, camere și experiențe | `hotel_resort` |
| `adventure` | Parcuri, atracții, vizite în familie | `parc_distractii` |

Tema `magazin_jucarii_premium` are o deschidere `bento-hero`: o imagine principală mare și patru destinații secundare. Păstrează o singură invitație principală și fotografii relevante pentru fiecare destinație.

## Personalizare prin editor sau MCP

Citește `list_websites(brandId)` și identifică website-ul exact, apoi `get_website_page` pentru pagina curentă. Pentru o ajustare, păstrează componentele existente și modifică numai configurația vizată prin instrumentul disponibil. `set_website_page_content` înlocuiește lista de componente a paginii: citește și păstrează restul listei. `add_website_section` adaugă o secțiune. Nu reaplica întreaga temă pentru a schimba un font sau o fotografie; înlocuirea unei teme existente trebuie să fie autorizată.

Configurație exemplu pentru o secțiune `hero-slider`:

```json
{
  "heroLayout": "editorial",
  "editorialVariant": "boutique",
  "editorialDensity": "balanced",
  "kicker": "Colecția noastră",
  "editorialNote": "Obiecte de păstrat. Povești de purtat.",
  "showSecondaryCta": true,
  "sectionBg": "#f4efe6",
  "sectionTextColor": "#252b24",
  "slides": [{
    "title": "Frumusețea\nstă în detalii.",
    "subtitle": "Descoperă selecția și găsește ce te reprezintă.",
    "imageUrl": "/uploads/fotografia-reala-a-brandului.webp",
    "ctaText": "Descoperă colecția",
    "ctaUrl": "/magazin",
    "secondaryCtaText": "Povestea noastră",
    "secondaryCtaUrl": "/despre-noi"
  }]
}
```

Înlocuiește URL-ul ilustrativ cu imaginea încărcată și verifică existența destinațiilor. Se afișează maximum 12 capitole. Un singur capitol nu afișează săgeți. `editorialDensity` acceptă `compact`, `balanced`, `airy` și controlează spațiul desktop; pe telefon prezentarea rămâne adaptată conținutului. Fontul titlului vine din `global.headingFont`. Fundalul și textul pot fi moștenite din tema globală sau suprascrise pe secțiune. Pentru acest layout, controalele clasice de autoplay, overlay, `height` și `titleSize` nu se aplică; folosește controalele editoriale dedicate.

## Butoane care duc direct la o secțiune

Setează `config.anchorId:"colectii"` pe secțiunea destinație. Folosește `#colectii` pentru pagina curentă sau `/magazin#colectii` pentru altă pagină. Identificatorul începe cu o literă, are maximum 80 de caractere și acceptă litere ASCII, cifre, `_`, `-`, `:`. Trebuie să fie unic în pagină și diferit de ID-ul intern al componentei. Păstrează destinația vizibilă și testează atât clickul, cât și deschiderea directă a URL-ului.

Pagina de comandă poate folosi `order-online.headingLevel:"h1"` dacă blocul furnizează titlul principal. Într-o pagină care are deja titlu principal, folosește `h2`.

## Înainte de publicare

Previzualizează tema cu datele brandului și verifică homepage, catalog, contact și o pagină secundară, pe desktop și telefon. Verifică meniul mobil, tastatura, contrastul, decuparea fotografiilor și destinațiile butoanelor. O temă simplă, cu fotografii potrivite și text lizibil, poate fi alegerea potrivită pentru brand.

Datele firmei, contactul și programul trebuie să provină din business. Blocurile marcate pentru revizuire cer completarea informațiilor reale. Nu activa echipe, statistici, certificări sau promoții demonstrative ca și cum ar fi confirmate. Schimbările catalogului de teme se folosesc la aplicarea unui șablon; website-urile deja salvate se personalizează explicit.
