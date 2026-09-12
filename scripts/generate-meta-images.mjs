/**
 * Generates the images referenced from the page <head>, run by hand when a
 * source changes (the outputs are committed):
 *
 *  - public/og-image.jpg: 1200x630 social preview (WhatsApp, Facebook...),
 *    cropped from the hero photo
 *  - favicon set from public/favicon.svg: favicon.ico (16/32/48 px),
 *    apple-touch-icon.png (180 px), icon-192.png and icon-512.png (web manifest)
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const OG_SOURCE = "src/assets/real-pool.jpg";
const ICON_SOURCE = "public/favicon.svg";
const ICON_BACKGROUND = "#04585c"; // --teal-deep, fills the rounded corners on iOS

await sharp(OG_SOURCE)
  .rotate()
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og-image.jpg");

const svg = await readFile(ICON_SOURCE);
const png = (size) => sharp(svg, { density: 300 }).resize(size, size).png().toBuffer();

await writeFile("public/icon-192.png", await png(192));
await writeFile("public/icon-512.png", await png(512));
// iOS shows transparent pixels as black and rounds the corners itself
await sharp(await png(180))
  .flatten({ background: ICON_BACKGROUND })
  .toFile("public/apple-touch-icon.png");

// ICO container with embedded PNGs (supported by every current browser)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((size, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(images[i].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return entry;
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...entries, ...images]));

console.log("[meta-images] og-image.jpg, favicon.ico, apple-touch-icon.png, icon-192/512.png");
