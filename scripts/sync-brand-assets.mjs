#!/usr/bin/env node
/**
 * Import locked Parentive logo / mark / wordmark files from the canonical
 * Linear 003 Google Drive folder into public/brand/.
 *
 * Source (do not use the brand-package PDF or design board as logo files):
 * https://drive.google.com/drive/folders/1r6GTJERQDf3pFb57RwftqhqY2StSo0yU?usp=drive_link
 *
 * Usage:
 *   npm run sync:brand-assets
 *
 * The folder must be shared as "Anyone with the link can view" (or the
 * environment must be signed into a Google account that can read it).
 */

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DRIVE_FOLDER_ID = "1r6GTJERQDf3pFb57RwftqhqY2StSo0yU";
const DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}?usp=drive_link`;
const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const DEST = join(ROOT, "public", "brand");
const TMP = join(ROOT, ".tmp-brand-assets");

const DESTINATIONS = [
  {
    dest: "logo-lockup-horizontal",
    match: /lockup|horizontal|wordmark.?mark|logo.?word/i,
  },
  {
    dest: "wordmark",
    match: /wordmark|word.?mark|word-mark/i,
  },
  {
    dest: "logo-mark",
    match:
      /(?:^|[^a-z])mark(?:[^a-z]|$)|option.?14|logo.?mark|standalone|(?:^|[^a-z])logo(?:[^a-z]|$)/i,
  },
];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", cwd: ROOT });
  return result.status === 0;
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function classify(filename) {
  const base = filename.toLowerCase();
  for (const rule of DESTINATIONS) {
    if (rule.match.test(base)) return rule.dest;
  }
  return null;
}

function ensureGdown() {
  const probe = spawnSync("python3", ["-m", "gdown", "--version"], {
    encoding: "utf8",
  });
  if (probe.status === 0) return true;
  console.log("Installing gdown…");
  return run("python3", ["-m", "pip", "install", "--quiet", "gdown"]);
}

if (!ensureGdown()) {
  console.error("Could not install gdown. Install Python and pip, then retry.");
  process.exit(1);
}

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(DEST, { recursive: true });

console.log(`Downloading brand assets from:\n  ${DRIVE_FOLDER_URL}\n`);

const downloaded = run("python3", [
  "-m",
  "gdown",
  "--folder",
  DRIVE_FOLDER_URL,
  "-O",
  TMP,
  "--continue",
]);

if (!downloaded) {
  console.error(`
Failed to download the Drive folder.

The folder is the source of truth for logo mark, wordmark, and lockup files.
Share it as "Anyone with the link can view", then re-run:

  npm run sync:brand-assets

Folder: ${DRIVE_FOLDER_URL}
`);
  rmSync(TMP, { recursive: true, force: true });
  process.exit(1);
}

const files = walk(TMP).filter((file) =>
  /\.(svg|png|jpg|jpeg|webp|ico)$/i.test(file)
);

if (files.length === 0) {
  console.error("Download succeeded but no image files were found in the folder.");
  rmSync(TMP, { recursive: true, force: true });
  process.exit(1);
}

const assigned = new Set();
let copied = 0;

for (const file of files) {
  const name = file.split(/[/\\]/).pop() ?? file;
  const destName = classify(name);
  if (!destName || assigned.has(destName + extname(file).toLowerCase())) {
    continue;
  }
  const ext = extname(file).toLowerCase();
  const targetExt = ext === ".jpeg" || ext === ".jpg" ? ".png" : ext;
  if (![".svg", ".png", ".ico", ".webp"].includes(targetExt)) continue;
  const target = join(DEST, `${destName}${targetExt === ".ico" ? ".ico" : targetExt}`);
  copyFileSync(file, target);
  assigned.add(destName + ext.toLowerCase());
  copied += 1;
  console.log(`  ${name} → public/brand/${destName}${targetExt}`);
}

if (copied === 0) {
  console.error(
    "Downloaded files, but none matched mark / wordmark / lockup names.\nFiles found:"
  );
  for (const file of files) console.error(`  - ${file}`);
  rmSync(TMP, { recursive: true, force: true });
  process.exit(1);
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nImported ${copied} brand file(s) into public/brand/.`);
