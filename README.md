# Sito Cavallino Treporti

Sito vetrina dell'appartamento a Cavallino Treporti (Venezia):
https://venicelagoonbeachpoolcavallino.com

- Tre lingue, ognuna col suo indirizzo: `/` italiano, `/en/` inglese, `/de/` tedesco.
- Nessun prezzo, nessun modulo, nessun analytics: chi visita scrive su WhatsApp.
- Pubblicato su GitHub Pages come sito statico, senza cookie di terze parti al caricamento.

## In breve

| Voglio...                              | Dove / comando                              |
| -------------------------------------- | ------------------------------------------- |
| cambiare un testo                      | `src/lib/i18n.ts`                           |
| cambiare telefoni, WhatsApp, CIN       | `src/lib/contact.ts`                        |
| aggiungere o sostituire una foto       | sezione [Foto](#foto)                       |
| vedere il sito mentre ci lavoro        | `npm run dev` → http://localhost:8080       |
| vedere il sito come sarà pubblicato    | `npm run build:static && npm run preview:static` → http://localhost:3000 |
| pubblicare                             | `git push` su `main`                        |

## Requisiti

Node.js 22 e npm. Gli script usano la sintassi `VAR=valore comando`: funzionano su
WSL, Linux e macOS, non da PowerShell.

## Lavorare in locale

```bash
npm ci        # installa esattamente le versioni di package-lock.json
npm run dev   # sviluppo con ricarica automatica: http://localhost:8080
```

## Build del sito statico

```bash
npm run build:static    # crea il sito completo in .output/public/
npm run preview:static  # lo serve su http://localhost:3000
```

`build:static` fa, in ordine:

1. `scripts/optimize-images.mjs`: varianti delle foto nuove o cambiate (le altre sono già in `public/img/`)
2. `scripts/generate-sitemap.mjs`: `public/sitemap.xml`
3. `vite build` con il preset Nitro `node-server`
4. `scripts/prerender.mjs`: avvia il server appena buildato e salva come file statici
   l'HTML di `/`, `/en/`, `/de/` e della pagina 404

`.output/` è il risultato della build: non va committato.

## Pubblicazione

Ogni push su `main` avvia `.github/workflows/deploy.yml`: `npm ci`, `npm run build:static`
e pubblicazione su GitHub Pages (in Settings → Pages la sorgente deve essere
"GitHub Actions"). Il dominio è nel file `CNAME`.

Prima di pubblicare:

```bash
npx tsc --noEmit        # tipi, comprese le traduzioni mancanti
npm run lint
npm run build:static && npm run preview:static
```

## Testi

Tutti i testi, nelle tre lingue, sono in `src/lib/i18n.ts`:

- `meta`: titolo e descrizione mostrati da Google e nelle anteprime dei link. Sono la
  prima cosa che si legge nei risultati di ricerca: vanno scritti come un annuncio.
- `alt`: descrizione di ogni foto, per chi non vede le immagini e per la ricerca immagini.
- le altre sezioni seguono la pagina (`hero`, `gallery`, `about`, `amenities`, ...).

Quando si cambia un testo in una lingua vanno aggiornate anche le altre due.
`npx tsc --noEmit` segnala le chiavi mancanti.

La pagina è in `src/components/Landing.tsx`. Il `<head>` (titolo, canonical, hreflang,
anteprime social, dati strutturati) è costruito in `src/lib/seo.ts`.

## Contatti e CIN

In `src/lib/contact.ts`:

- telefoni e numeri WhatsApp. La pagina tedesca scrive al numero tedesco, le altre a quello italiano.
- `CIN`: non pubblicato, per scelta del proprietario (`null`). Se un giorno si mette, compare
  da solo nel footer; va aggiunto a mano ai dati strutturati (`licenseNum`, vedi il commento
  in `src/lib/seo.ts`).
- l'email non c'è: si aggiunge qui e nel footer di `Landing.tsx`.

## Foto

- Originali: `src/assets/*.jpg`, a piena risoluzione. `src/assets/unused/` contiene foto
  vere scartate, che non vengono pubblicate.
- Pubblicate: `public/img/<nome>-<larghezza>.avif` più un JPEG per i browser senza AVIF,
  generate da `scripts/optimize-images.mjs`, con dimensioni e larghezze in
  `src/lib/images.gen.json`. Sono committate, così la build in CI non deve ricodificarle.

Aggiungere una foto:

1. copiare il JPG in `src/assets/` con un nome senza spazi, per esempio `real-terrazza.jpg`
2. `node scripts/optimize-images.mjs` (circa mezzo minuto per foto)
3. scrivere l'`alt` nelle tre lingue in `src/lib/i18n.ts`, sezione `alt`, con chiave uguale
   al nome del file senza `.jpg`
4. mostrarla in `Landing.tsx`, per esempio aggiungendo `{ label: ..., name: "real-terrazza" }`
   a `galleryItems`
5. committare anche `public/img/` e `src/lib/images.gen.json`

Sostituire una foto: sovrascrivere il file in `src/assets/` mantenendo il nome e rilanciare
lo script, che si accorge del cambiamento e rigenera solo quella.

Le foto il cui nome inizia con `real-` finiscono anche nei dati strutturati per Google.

## Altre immagini (si rigenerano a mano)

- `scripts/generate-meta-images.mjs`: anteprima dei link `public/og-image.jpg` (dalla foto
  della piscina) e favicon a partire da `public/favicon.svg`.
- `scripts/generate-static-map.mjs`: mappa statica della zona in `src/assets/map-area.jpg`
  (dati © OpenStreetMap), mostrata al posto di Google Maps finché non si clicca
  "Mostra la mappa". Dopo averla rigenerata: `node scripts/optimize-images.mjs`.

## Coordinate

`GEO` in `src/lib/seo.ts` e `PIN` in `scripts/generate-static-map.mjs`, uguali in tutti e
due i file: 45.45423, 12.47768. È il civico 58 secondo il geocoder Esri (OpenStreetMap ha
solo la via). Per un punto più preciso: Google Maps, clic destro sul palazzo, almeno 5
decimali. Dopo averle cambiate va rigenerata la mappa statica (sezione sopra).

## Prezzi

Per scelta il sito non mostra prezzi, disponibilità né regole della casa: si danno su WhatsApp.

## Aggiungere una lingua

1. `src/lib/i18n.ts`: il codice in `Lang`, una voce in `LANGS`, il dizionario completo
2. `src/routes/<codice>/index.tsx`, copiando `src/routes/en/index.tsx`
3. `ROUTES` in `scripts/prerender.mjs` e `PAGES` in `scripts/generate-sitemap.mjs`

## Da non fare

- `NITRO_PRESET=static`: con questo progetto non funziona, per questo c'è il prerender.
- impostare `base` in `vite.config.ts` per far funzionare l'anteprima su `github.io`:
  rompe il sito sul dominio vero.
- aggiungere a mano in `vite.config.ts` plugin già inclusi da `@lovable.dev/vite-tanstack-config`.
- committare `.output/`.
- aggiungere analytics o moduli di contatto: renderebbero necessario il banner cookie.
- inserire recensioni o valutazioni non verificabili nei dati strutturati.

Tecnologie: React 19, TanStack Start e Router, Vite 7, Tailwind CSS 4, Nitro.
