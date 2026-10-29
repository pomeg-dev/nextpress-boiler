/**
 * Compiles `themes/<theme>/blocks/<block>/fields.json` into the block manifest
 * that WordPress registers ACF fields + Gutenberg blocks from.
 *
 * Shared by the `blocks:*` CLI (scripts/blocks/cli.mjs) and the legacy pull
 * route (src/app/api/blocks/route.ts), so both always produce the same output.
 *
 * A fields.json is either an array of fields, or an object with optional
 * block metadata: { "title", "description", "icon", "keywords", "fields": [] }.
 * `{ "$ref": "name" }` anywhere in a fields array inlines
 * `themes/<theme>/_partials/<name>.json` (a single field or an array of them).
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const MANIFEST_VERSION = 1;

/** Field types handled by the plugin's Field_Builder (class/gutenberg/field-builder.php). */
export const KNOWN_FIELD_TYPES = new Set([
  "text", "textarea", "number", "range", "email", "url", "password", "wysiwyg",
  "image", "file", "gallery", "select", "checkbox", "radio", "true_false", "link",
  "post_object", "page_link", "relationship", "taxonomy", "user", "date_picker",
  "time_picker", "color_picker", "message", "repeater", "group", "flexible_content",
  "nav", "post_type", "tax_list", "theme", "gravity_form", "tab", "accordion",
  "inner_blocks",
]);

const BLOCK_META_KEYS = ["title", "description", "icon", "keywords"];

export function defaultThemesDir() {
  return path.join(process.cwd(), "themes");
}

/**
 * Compile every theme (or only `themes`) into a manifest.
 * Never throws for content problems — they're collected in `errors`/`warnings`
 * so callers decide whether to fail (CLI) or degrade (route).
 *
 * @param {{ themesDir?: string, themes?: string[] }} [options]
 * @returns {Promise<{
 *   manifest: { version: number, hash: string, generatedAt: string, themes: Record<string, any[]> },
 *   errors: string[],
 *   warnings: string[],
 * }>}
 */
export async function compileManifest({ themesDir = defaultThemesDir(), themes } = {}) {
  const errors = [];
  const warnings = [];
  const themeNames = themes?.length ? themes : await listDirs(themesDir);

  const compiled = {};
  for (const theme of themeNames) {
    const blocks = await compileTheme(themesDir, theme, { errors, warnings });
    if (blocks.length > 0) {
      compiled[theme] = blocks;
    }
  }

  const manifest = {
    version: MANIFEST_VERSION,
    hash: hashThemes(compiled),
    generatedAt: new Date().toISOString(),
    themes: compiled,
  };
  return { manifest, errors, warnings };
}

export function hashThemes(themes) {
  return crypto.createHash("sha256").update(JSON.stringify(themes)).digest("hex");
}

async function compileTheme(themesDir, theme, report) {
  const blocksDir = path.join(themesDir, theme, "blocks");
  const blockNames = await listDirs(blocksDir);
  const blocks = [];

  for (const blockName of blockNames) {
    const file = path.join(blocksDir, blockName, "fields.json");
    const where = `${theme}/blocks/${blockName}/fields.json`;
    const block = { id: `${theme}--${blockName}`, blockName, fields: [] };

    let raw;
    try {
      raw = JSON.parse(await fs.readFile(file, "utf-8"));
    } catch (error) {
      if (error.code === "ENOENT") {
        report.warnings.push(`${where}: missing, block registered with no fields`);
      } else {
        report.errors.push(`${where}: ${error.message}`);
      }
      blocks.push(block);
      continue;
    }

    let fields = raw;
    if (raw && !Array.isArray(raw) && typeof raw === "object") {
      for (const key of BLOCK_META_KEYS) {
        if (raw[key] !== undefined) block[key] = raw[key];
      }
      fields = raw.fields ?? [];
    }

    if (!Array.isArray(fields)) {
      report.errors.push(`${where}: expected an array of fields (or { "fields": [...] })`);
      blocks.push(block);
      continue;
    }

    block.fields = await resolveRefs(fields, { themesDir, theme, where, stack: [], report });
    validateFields(block.fields, where, report);
    blocks.push(block);
  }

  return blocks;
}

/**
 * Recursively inline `$ref` partials, including inside repeater/group
 * `fields`, flexible_content `layouts[].fields`, and partials themselves.
 */
async function resolveRefs(fields, ctx) {
  const resolved = [];
  for (const field of fields) {
    if (field && typeof field === "object" && typeof field.$ref === "string") {
      const partial = await loadPartial(field.$ref, ctx);
      if (partial) {
        const items = Array.isArray(partial) ? partial : [partial];
        const nested = { ...ctx, stack: [...ctx.stack, field.$ref] };
        resolved.push(...(await resolveRefs(items, nested)));
      }
      continue;
    }
    resolved.push(await resolveNested(field, ctx));
  }
  return resolved;
}

async function resolveNested(field, ctx) {
  if (!field || typeof field !== "object") return field;
  const out = { ...field };
  if (Array.isArray(out.fields)) {
    out.fields = await resolveRefs(out.fields, ctx);
  }
  if (Array.isArray(out.layouts)) {
    out.layouts = await Promise.all(
      out.layouts.map(async (layout) =>
        Array.isArray(layout?.fields)
          ? { ...layout, fields: await resolveRefs(layout.fields, ctx) }
          : layout
      )
    );
  }
  return out;
}

async function loadPartial(name, { themesDir, theme, where, stack, report }) {
  if (stack.includes(name)) {
    report.errors.push(`${where}: circular $ref ${[...stack, name].join(" -> ")}`);
    return null;
  }
  const file = path.join(themesDir, theme, "_partials", `${name}.json`);
  try {
    return JSON.parse(await fs.readFile(file, "utf-8"));
  } catch (error) {
    const reason = error.code === "ENOENT" ? "not found" : error.message;
    report.errors.push(`${where}: $ref "${name}" (${theme}/_partials/${name}.json) ${reason}`);
    return null;
  }
}

function validateFields(fields, where, report, trail = "") {
  const seen = new Set();
  for (const [index, field] of fields.entries()) {
    const at = `${where} ${trail}[${index}]`;
    if (!field || typeof field !== "object") {
      report.errors.push(`${at}: field must be an object`);
      continue;
    }
    if (typeof field.id !== "string" || !field.id) {
      report.errors.push(`${at}: missing "id"`);
      continue;
    }
    const label = `${where} ${trail}${field.id}`;
    if (typeof field.type !== "string" || !field.type) {
      report.errors.push(`${label}: missing "type"`);
    } else if (!KNOWN_FIELD_TYPES.has(field.type)) {
      report.warnings.push(`${label}: unknown type "${field.type}", passed to ACF as-is`);
    }
    if (seen.has(field.id)) {
      report.errors.push(`${label}: duplicate id at this level`);
    }
    seen.add(field.id);

    for (const group of Array.isArray(field.conditional_logic) ? field.conditional_logic : []) {
      for (const rule of Array.isArray(group) ? group : []) {
        if (rule?.field && !fields.some((f) => f?.id === rule.field)) {
          report.warnings.push(`${label}: conditional_logic references unknown sibling "${rule.field}"`);
        }
      }
    }

    if (Array.isArray(field.fields)) {
      validateFields(field.fields, where, report, `${trail}${field.id}.`);
    }
    if (Array.isArray(field.layouts)) {
      for (const layout of field.layouts) {
        if (Array.isArray(layout?.fields)) {
          validateFields(layout.fields, where, report, `${trail}${field.id}.${layout.name}.`);
        }
      }
    }
  }
}

async function listDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_"))
      .map((e) => e.name)
      .sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
