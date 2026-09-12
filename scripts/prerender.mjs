/**
 * Prerender: turns the SSR build (TanStack Start + Nitro) into a fully
 * static site that can be published on GitHub Pages.
 *
 *  1. starts the freshly built Nitro server (node-server preset)
 *  2. fetches the rendered HTML of every route in ROUTES
 *  3. saves it into .output/public/ as .html files
 *  4. adds 404.html, .nojekyll and CNAME
 */
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const PORT = process.env.PRERENDER_PORT || "4321";
const SERVER = ".output/server/index.mjs";
const PUBLIC = ".output/public";

// PHASE 3: this will become ["/", "/en/", "/de/"]
const ROUTES = ["/"];

if (!existsSync(SERVER)) {
  console.error(`[prerender] ${SERVER} not found. Build first with NITRO_PRESET=node-server.`);
  process.exit(1);
}

const server = spawn(process.execPath, [SERVER], {
  env: { ...process.env, PORT, HOST: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", () => {});
server.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));

const base = `http://127.0.0.1:${PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(base + "/", { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      /* not ready yet */
    }
    await sleep(300);
  }
  throw new Error("the server did not start within the timeout");
}

function outFile(route) {
  if (route === "/") return path.join(PUBLIC, "index.html");
  return path.join(PUBLIC, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

try {
  await waitForServer();

  let home = "";
  for (const route of ROUTES) {
    const res = await fetch(base + route);
    if (!res.ok) throw new Error(`${route} responded ${res.status}`);
    const html = await res.text();
    if (!/<!doctype html>/i.test(html)) throw new Error(`${route} did not return valid HTML`);

    // regression guard: if the HTML is an empty shell, prerendering did not work
    if (html.length < 10000) {
      throw new Error(
        `${route} produced only ${html.length} bytes: looks like an SSR shell with no content`,
      );
    }

    const dest = outFile(route);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, html, "utf8");
    console.log(`[prerender] ${route} -> ${dest} (${(html.length / 1024).toFixed(1)} kB)`);
    if (route === "/") home = html;
  }

  await writeFile(path.join(PUBLIC, "404.html"), home, "utf8");
  await writeFile(path.join(PUBLIC, ".nojekyll"), "", "utf8");

  if (existsSync("CNAME")) {
    const domain = (await readFile("CNAME", "utf8")).trim();
    await writeFile(path.join(PUBLIC, "CNAME"), domain + "\n", "utf8");
    console.log(`[prerender] CNAME -> ${domain}`);
  }

  console.log(`[prerender] done. Static site ready in ${PUBLIC}/`);
} finally {
  server.kill("SIGTERM");
}
