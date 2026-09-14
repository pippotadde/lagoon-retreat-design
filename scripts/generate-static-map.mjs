/**
 * Static map of the area, shown in place of the Google Maps iframe until the
 * visitor clicks "show map": no third-party requests or cookies on page load.
 *
 * Stitches a handful of OpenStreetMap tiles into src/assets/map-area.jpg, which
 * optimize-images.mjs then turns into responsive variants like the photos.
 * Map data © OpenStreetMap contributors (ODbL): the page shows the credit.
 * Run by hand (the output is committed), not on every build.
 */
import sharp from "sharp";

// Via Paolo Thaon di Revel: centroid of the street.
const CENTER = { lat: 45.45431, lon: 12.47712 };
// Position of the building, same as GEO in src/lib/seo.ts; draws a pin when set.
const PIN = { lat: 45.45423, lon: 12.47768 };
const ZOOM = 15;
const WIDTH = 1024;
const HEIGHT = 640;
const TILE = 256;
const OUT = "src/assets/map-area.jpg";
const USER_AGENT = "venicelagoonbeachpoolcavallino.com static map (one-off)";

// Web Mercator: coordinates -> global pixel position at ZOOM
function project({ lat, lon }) {
  const scale = TILE * 2 ** ZOOM;
  const phi = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(phi) + 1 / Math.cos(phi)) / Math.PI) / 2) * scale,
  };
}

const center = project(CENTER);
const left = Math.round(center.x - WIDTH / 2);
const top = Math.round(center.y - HEIGHT / 2);
const [x0, y0] = [Math.floor(left / TILE), Math.floor(top / TILE)];
const [x1, y1] = [Math.floor((left + WIDTH - 1) / TILE), Math.floor((top + HEIGHT - 1) / TILE)];

const tiles = [];
for (let x = x0; x <= x1; x++) {
  for (let y = y0; y <= y1; y++) {
    const url = `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    tiles.push({
      input: Buffer.from(await res.arrayBuffer()),
      left: (x - x0) * TILE,
      top: (y - y0) * TILE,
    });
  }
}

if (PIN) {
  const p = project(PIN);
  const pin = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
    <path d="M20 51C20 51 38 32 38 19A18 18 0 1 0 2 19C2 32 20 51 20 51Z" fill="#de6f00" stroke="#fff" stroke-width="3"/>
    <circle cx="20" cy="19" r="7" fill="#fff"/></svg>`;
  tiles.push({
    input: Buffer.from(pin),
    left: Math.round(p.x - x0 * TILE - 20),
    top: Math.round(p.y - y0 * TILE - 51),
  });
}

const mosaic = await sharp({
  create: {
    width: (x1 - x0 + 1) * TILE,
    height: (y1 - y0 + 1) * TILE,
    channels: 3,
    background: "#ffffff",
  },
})
  .composite(tiles)
  .png()
  .toBuffer();

await sharp(mosaic)
  .extract({ left: left - x0 * TILE, top: top - y0 * TILE, width: WIDTH, height: HEIGHT })
  .jpeg({ quality: 92 })
  .toFile(OUT);

console.log(`[static-map] ${tiles.length} tiles -> ${OUT} (${WIDTH}x${HEIGHT}, zoom ${ZOOM})`);
