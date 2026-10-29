#!/usr/bin/env node
/**
 * Nextpress blocks CLI — compile fields.json and push the manifest to WordPress.
 *
 *   npm run blocks:check                       validate only
 *   npm run blocks:build                       write .nextpress/blocks.manifest.json
 *   npm run blocks:push [-- --target=staging]  diff against WP, then push
 *       --dry-run          show the diff, don't push
 *       --allow-removals   permit removing blocks/fields (content may be orphaned)
 *   npm run blocks:watch [-- --target=local]   push on every fields.json change
 *
 * Target config (env, .env.local, .env): NEXTPRESS_WP_URL + NEXTPRESS_SYNC_SECRET.
 * `--target=staging` reads NEXTPRESS_WP_URL_STAGING + NEXTPRESS_SYNC_SECRET_STAGING.
 * With no target, the URL falls back to NEXT_PUBLIC_API_URL.
 */
import { promises as fs, watch } from "fs";
import path from "path";
import crypto from "crypto";
import { compileManifest, defaultThemesDir, hashThemes } from "./compile.mjs";

const SYNC_ROUTE = "/nextpress/blocks/sync";
const MANIFEST_ROUTE = "/nextpress/blocks/manifest";

const [command = "check", ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(
  rest.map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? true];
  })
);

loadEnv();

const commands = { check, build, push, watch: watchCommand };
if (!commands[command]) {
  console.error(`Unknown command "${command}". Use: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}
commands[command]().catch((error) => {
  console.error(`✖ ${error.message}`);
  process.exit(1);
});

async function check() {
  const { manifest } = await compileOrExit();
  console.log(`✔ ${countBlocks(manifest.themes)} blocks valid (${manifest.hash.slice(0, 12)})`);
}

async function build() {
  const { manifest } = await compileOrExit();
  const out = path.join(process.cwd(), ".nextpress", "blocks.manifest.json");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, JSON.stringify(manifest, null, 2));
  console.log(`✔ Wrote ${path.relative(process.cwd(), out)} (${countBlocks(manifest.themes)} blocks, ${manifest.hash.slice(0, 12)})`);
}

async function push() {
  const target = resolveTarget(flags.target);
  const { manifest } = await compileOrExit();

  const remote = await getRemoteManifest(target);
  const diff = diffThemes(remote?.themes ?? {}, manifest.themes);
  printDiff(diff, target, remote);

  if (remote && hashThemes(remote.themes) === manifest.hash) {
    console.log("✔ Already up to date, nothing to push.");
    return;
  }
  if (flags["dry-run"]) {
    console.log("Dry run: nothing pushed.");
    return;
  }
  if (diff.removed.length && !flags["allow-removals"]) {
    throw new Error(
      "This push removes blocks/fields. Existing content using them will lose its field definitions.\n" +
        "  Re-run with --allow-removals if that's intended."
    );
  }

  const result = await signedRequest(target, "POST", SYNC_ROUTE, JSON.stringify(manifest));
  console.log(`✔ Pushed ${result.blocks} blocks to ${target.name} (${result.hash.slice(0, 12)})`);
}

async function watchCommand() {
  const target = resolveTarget(flags.target);
  const themesDir = defaultThemesDir();
  let timer;
  let running = Promise.resolve();

  const sync = () =>
    (running = running.then(async () => {
      const { manifest, errors, warnings } = await compileManifest({ themesDir });
      printReport(errors, warnings);
      if (errors.length) return;
      try {
        const result = await signedRequest(target, "POST", SYNC_ROUTE, JSON.stringify(manifest));
        console.log(`✔ ${new Date().toLocaleTimeString()} pushed ${result.blocks} blocks to ${target.name}`);
      } catch (error) {
        console.error(`✖ ${error.message}`);
      }
    }));

  console.log(`Watching ${path.relative(process.cwd(), themesDir)}/ → ${target.url}`);
  await sync();
  watch(themesDir, { recursive: true }, (_event, file) => {
    if (!file?.endsWith(".json")) return;
    clearTimeout(timer);
    timer = setTimeout(sync, 300);
  });
}

async function compileOrExit() {
  const result = await compileManifest();
  printReport(result.errors, result.warnings);
  if (result.errors.length) {
    throw new Error(`${result.errors.length} error(s) in block definitions`);
  }
  return result;
}

function printReport(errors, warnings) {
  for (const warning of warnings) console.warn(`⚠ ${warning}`);
  for (const error of errors) console.error(`✖ ${error}`);
}

function resolveTarget(name) {
  const suffix = name && name !== true ? `_${String(name).toUpperCase()}` : "";
  const url = process.env[`NEXTPRESS_WP_URL${suffix}`] ?? (suffix ? undefined : process.env.NEXT_PUBLIC_API_URL);
  const secret = process.env[`NEXTPRESS_SYNC_SECRET${suffix}`];
  if (!url) throw new Error(`Set NEXTPRESS_WP_URL${suffix} to the WordPress URL`);
  if (!secret) throw new Error(`Set NEXTPRESS_SYNC_SECRET${suffix} (Nextpress > Blocks in wp-admin)`);
  return { name: name && name !== true ? name : "default", url: url.replace(/\/$/, ""), secret };
}

async function getRemoteManifest(target) {
  try {
    return await signedRequest(target, "GET", MANIFEST_ROUTE);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

/** HMAC over METHOD:ROUTE:TIMESTAMP:sha256(body) — verified by API_Auth::verify_sync_signature. */
async function signedRequest(target, method, route, body = "") {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const signature = crypto
    .createHmac("sha256", target.secret)
    .update(`${method}:${route}:${timestamp}:${bodyHash}`)
    .digest("hex");

  const response = await fetch(`${target.url}/wp-json${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Nextpress-Timestamp": timestamp,
      "X-Nextpress-Signature": signature,
    },
    body: method === "GET" ? undefined : body,
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  if (!response.ok) {
    const error = new Error(`${method} ${route} → ${response.status}: ${json?.message ?? text.slice(0, 200)}`);
    error.status = response.status;
    throw error;
  }
  return json;
}

/** Flatten blocks to `block` and `block › field.path` entries for diffing. */
function flatten(themes) {
  const entries = new Map();
  const walk = (prefix, fields) => {
    for (const field of fields ?? []) {
      if (!field?.id) continue;
      const key = `${prefix}.${field.id}`;
      const { fields: children, layouts, ...own } = field;
      entries.set(key, own);
      walk(key, children);
      for (const layout of layouts ?? []) walk(`${key}.${layout.name}`, layout.fields);
    }
  };
  for (const blocks of Object.values(themes)) {
    for (const block of blocks) {
      const { fields, ...meta } = block;
      entries.set(block.id, meta);
      walk(block.id, fields);
    }
  }
  return entries;
}

function diffThemes(before, after) {
  const a = flatten(before);
  const b = flatten(after);
  const diff = { added: [], removed: [], changed: [], retyped: [] };
  for (const [key, value] of b) {
    if (!a.has(key)) diff.added.push(key);
    else if (JSON.stringify(a.get(key)) !== JSON.stringify(value)) {
      (a.get(key).type !== value.type ? diff.retyped : diff.changed).push(key);
    }
  }
  for (const key of a.keys()) if (!b.has(key)) diff.removed.push(key);
  return diff;
}

function printDiff(diff, target, remote) {
  console.log(`\n${target.name} (${target.url}) — remote: ${remote ? `${remote.source ?? "push"} ${remote.hash?.slice(0, 12)}` : "no manifest yet"}`);
  const sections = [
    ["+", "added", diff.added],
    ["~", "changed", diff.changed],
    ["!", "type changed (existing values may not fit)", diff.retyped],
    ["-", "removed", diff.removed],
  ];
  for (const [mark, label, keys] of sections) {
    if (!keys.length) continue;
    console.log(`  ${label}:`);
    for (const key of keys) console.log(`    ${mark} ${key}`);
  }
  if (sections.every(([, , keys]) => !keys.length)) console.log("  no changes");
  console.log("");
}

function countBlocks(themes) {
  return Object.values(themes).reduce((n, blocks) => n + blocks.length, 0);
}

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(path.join(process.cwd(), file));
    } catch {
      // Optional — env may come from the shell/CI instead.
    }
  }
}
