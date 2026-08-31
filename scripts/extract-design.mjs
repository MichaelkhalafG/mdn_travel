// Extracts the real design markup from the self-extracting bundle.
// The markup lives inside <script type="__bundler/template"> as a JSON-encoded string.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const designDir = path.join(process.cwd(), "design");
const candidates = ["MDN_Travel.html", "MDN Travel.html"];
const sourceFile = candidates.map((f) => path.join(designDir, f)).find(existsSync);
if (!sourceFile) {
  console.error(`Bundle not found. Tried: ${candidates.join(", ")} in ${designDir}`);
  process.exit(1);
}

const bundle = await readFile(sourceFile, "utf8");

const match = bundle.match(
  /<script[^>]*type=["']__bundler\/template["'][^>]*>([\s\S]*?)<\/script>/
);
if (!match) {
  console.error("No <script type=\"__bundler/template\"> tag found in the bundle.");
  process.exit(1);
}

let markup;
try {
  markup = JSON.parse(match[1].trim());
} catch (error) {
  console.error("Failed to JSON.parse the template payload:", error.message);
  process.exit(1);
}

if (typeof markup !== "string") {
  console.error(`Expected a JSON string payload, got ${typeof markup}.`);
  process.exit(1);
}

const outFile = path.join(designDir, "template.html");
await writeFile(outFile, markup, "utf8");
console.log(`Extracted ${(markup.length / 1024).toFixed(1)}KB from ${path.basename(sourceFile)} -> design/template.html`);
