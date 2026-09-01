import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FOLDER_ID = "1r6GTJERQDf3pFb57RwftqhqY2StSo0yU";
const FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("brand asset registry points at the locked 003 Drive folder", () => {
  const source = read("lib/brand-assets.ts");
  assert.match(source, new RegExp(FOLDER_ID));
  assert.match(source, /logo-mark/);
  assert.match(source, /wordmark/);
  assert.match(source, /logo-lockup-horizontal/);
});

test("logo components render Drive-sourced files instead of reconstructing Option 14", () => {
  const logo = read("components/brand/logo.tsx");
  assert.match(logo, /brandAssets/);
  assert.match(logo, /kind="mark"/);
  assert.match(logo, /kind="wordmark"/);
  assert.match(logo, /kind="lockup"/);
  assert.doesNotMatch(logo, /Georgia/);
  assert.doesNotMatch(logo, /Times New Roman/);
  assert.doesNotMatch(logo, />\s*p\s*</);
});

test("design system and brand docs cite the Drive folder, not a CSS stand-in", () => {
  const docs = [
    read("docs/DESIGN_SYSTEM.md"),
    read("public/brand/README.md"),
    read("app/design-system/page.tsx"),
  ].join("\n");
  assert.match(docs, new RegExp(FOLDER_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(
    read("public/brand/README.md"),
    /code-based implementation/
  );
});
