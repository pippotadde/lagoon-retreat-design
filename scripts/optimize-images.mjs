/**
 * Image optimizer: turns the original photos in src/assets/*.jpg into
 * responsive AVIF variants plus a JPEG fallback (for browsers without AVIF)
 * in public/img/, and writes src/lib/images.gen.json with the metadata
 * <Picture> needs.
 *
 *  - widths: WIDTHS that are smaller than the original, plus the original
 *    width itself (capped at the largest entry of WIDTHS)
 *  - output: public/img/<name>-<width>.avif, public/img/<name>-<fallback>.jpg
 *
 * Incremental: a photo is re-encoded only when its content or the encoder
 * settings change, so builds (and CI) skip the slow AVIF step when the
 * committed variants are up to date. Pass --force to rebuild everything.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir, stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "src/assets";
const OUT_DIR = "public/img";
const MANIFEST = "src/lib/images.gen.json";

const WIDTHS = [480, 800, 1200, 1600, 1920];
const FALLBACK_WIDTH = 1200;
const AVIF = { quality: 55, effort: 6 };
const JPEG = { quality: 80, mozjpeg: true };

const hash = (data) => createHash("sha256").update(data).digest("hex").slice(0, 16);
// Changing any encoder setting invalidates every cached variant.
const SETTINGS = hash(JSON.stringify({ WIDTHS, FALLBACK_WIDTH, AVIF, JPEG }));

const force = process.argv.includes("--force");
const kB = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

function variantWidths(width) {
  const max = WIDTHS[WIDTHS.length - 1];
  return [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, max)])];
}

function outputsFor(name, entry) {
  return [...entry.widths.map((w) => `${name}-${w}.avif`), `${name}-${entry.fallback}.jpg`];
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Removes files in OUT_DIR generated for `name` that are not in `keep`.
async function removeStale(name, keep, files) {
  const pattern = new RegExp(`^${escapeRegExp(name)}-\\d+\\.(avif|webp|jpg)$`);
  for (const file of files) {
    if (pattern.test(file) && !keep.has(file)) await unlink(path.join(OUT_DIR, file));
  }
}

const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : null;
const reuse = !force && previous?.settings === SETTINGS;
const images = {};

await mkdir(OUT_DIR, { recursive: true });
const sources = (await readdir(SRC_DIR)).filter((f) => f.toLowerCase().endsWith(".jpg")).sort();
let outFiles = await readdir(OUT_DIR);

let encoded = 0;
let totalBefore = 0;
let totalAfter = 0;
const rows = [];

for (const file of sources) {
  const name = path.basename(file, path.extname(file));
  const input = await readFile(path.join(SRC_DIR, file));
  const contentHash = hash(input);
  const old = previous?.images?.[name];

  let entry;
  if (
    reuse &&
    old?.hash === contentHash &&
    outputsFor(name, old).every((f) => outFiles.includes(f))
  ) {
    entry = old;
  } else {
    const meta = await sharp(input).metadata();
    // EXIF orientations 5-8 swap width and height once auto-rotated.
    const rotated = (meta.orientation ?? 1) >= 5;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    entry = {
      width,
      height,
      widths: variantWidths(width),
      fallback: Math.min(FALLBACK_WIDTH, width),
      hash: contentHash,
    };

    // The AVIF encoder is single-threaded: encode all variants of a photo in parallel.
    const resized = (w) => sharp(input).rotate().resize({ width: w });
    const out = (file) => path.join(OUT_DIR, file);
    await Promise.all([
      ...entry.widths.map((w) =>
        resized(w)
          .avif(AVIF)
          .toFile(out(`${name}-${w}.avif`)),
      ),
      resized(entry.fallback)
        .jpeg(JPEG)
        .toFile(out(`${name}-${entry.fallback}.jpg`)),
    ]);

    await removeStale(name, new Set(outputsFor(name, entry)), outFiles);
    outFiles = await readdir(OUT_DIR);
    encoded++;
  }
  images[name] = entry;

  const size = async (f) => (await stat(path.join(OUT_DIR, f))).size;
  const outputs = outputsFor(name, entry);
  const after = (await Promise.all(outputs.map(size))).reduce((a, b) => a + b, 0);
  const largest = entry.widths[entry.widths.length - 1];
  totalBefore += input.length;
  totalAfter += after;
  rows.push([
    name,
    `${entry.width}x${entry.height}`,
    kB(input.length),
    entry.widths.includes(800) ? kB(await size(`${name}-800.avif`)) : "-",
    `${kB(await size(`${name}-${largest}.avif`))} @${largest}`,
  ]);
}

// Drop variants of photos that no longer exist in SRC_DIR.
for (const name of Object.keys(previous?.images ?? {})) {
  if (!images[name]) await removeStale(name, new Set(), outFiles);
}

const manifest = { settings: SETTINGS, images };
const json = JSON.stringify(manifest, null, 2) + "\n";
if (!existsSync(MANIFEST) || (await readFile(MANIFEST, "utf8")) !== json) {
  await writeFile(MANIFEST, json, "utf8");
}

const header = ["image", "size", "original", "avif 800w", "avif max"];
const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
const line = (cols) => cols.map((c, i) => c.padEnd(widths[i])).join("  ");
console.log(line(header));
for (const row of rows) console.log(line(row));
console.log(
  `[images] ${sources.length} photos, ${encoded} re-encoded. ` +
    `Originals ${kB(totalBefore)} -> all variants ${kB(totalAfter)} in ${OUT_DIR}/`,
);
