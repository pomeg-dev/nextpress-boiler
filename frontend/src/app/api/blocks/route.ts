import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type BlockFields = {
  key?: string;
  label: string;
  type: string;
};

type Block = {
  id: string;
  blockName: string;
  fields: BlockFields[];
};

type ThemeBlocks = {
  [theme: string]: Block[];
};

export async function GET(request: NextRequest) {
  const themeParam = request.nextUrl.searchParams.get("theme");
  const themesDirectory = path.join(process.cwd(), "themes");

  try {
    if (themeParam) {
      const themes = themeParam.split(",").map((t) => t.trim());
      let allBlocks: Block[] = [];
      for (const theme of themes) {
        const blocks = await safelyGetThemeBlocks(theme, themesDirectory);
        allBlocks = allBlocks.concat(blocks);
      }
      return NextResponse.json(allBlocks);
    } else {
      const themes = await fs.readdir(themesDirectory);
      const themeBlocks: ThemeBlocks = {};

      for (const theme of themes) {
        const blocks = await safelyGetThemeBlocks(theme, themesDirectory);
        if (blocks.length > 0) {
          themeBlocks[theme] = blocks;
        }
      }

      return NextResponse.json(themeBlocks);
    }
  } catch (error) {
    console.error("Error reading themes directory:", error);
    return NextResponse.json(
      { error: "Unable to retrieve blocks" },
      { status: 500 }
    );
  }
}

async function safelyGetThemeBlocks(
  theme: string,
  themesDirectory: string
): Promise<Block[]> {
  const themeBlocksDirectory = path.join(themesDirectory, theme, "blocks");
  try {
    await fs.access(themeBlocksDirectory);
    const files = await fs.readdir(themeBlocksDirectory);
    return await Promise.all(files.map((file) => getBlockInfo(theme, file)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(
        `Unexpected error accessing theme blocks directory ${theme}:`,
        error
      );
    }
    return [];
  }
}

async function getBlockInfo(theme: string, file: string): Promise<Block> {
  const blockDirectory = path.join(
    process.cwd(),
    "themes",
    theme,
    "blocks",
    file
  );
  const fieldsJsonPath = path.join(blockDirectory, "fields.json");

  let fields: BlockFields[] = [];

  try {
    const fieldsJsonContent = await fs.readFile(fieldsJsonPath, "utf-8");
    fields = JSON.parse(fieldsJsonContent);
    fields = await resolveFieldRefs(fields, theme);
  } catch (error) {
    // If there's an error reading the file, we'll return an empty array for fields
  }

  return {
    id: `${theme}--${path.basename(file)}`,
    blockName: path.basename(file),
    fields: fields,
  };
}

/**
 * Expand any `{ "$ref": "name" }` entries in a fields array by inlining the
 * matching partial from `themes/<theme>/_partials/<name>.json`. This lets
 * repeated field groups (e.g. the buttons repeater) be maintained in one place.
 * A partial may resolve to a single field object or an array of fields.
 */
async function resolveFieldRefs(
  fields: any[],
  theme: string
): Promise<any[]> {
  if (!Array.isArray(fields)) {
    return fields;
  }

  const resolved: any[] = [];
  for (const field of fields) {
    if (field && typeof field === "object" && typeof field.$ref === "string") {
      const partial = await loadPartial(theme, field.$ref);
      if (Array.isArray(partial)) {
        resolved.push(...partial);
      } else if (partial) {
        resolved.push(partial);
      }
      // If the partial failed to load it is skipped (and logged in loadPartial).
    } else {
      resolved.push(field);
    }
  }
  return resolved;
}

async function loadPartial(theme: string, name: string): Promise<any> {
  const partialPath = path.join(
    process.cwd(),
    "themes",
    theme,
    "_partials",
    `${name}.json`
  );
  try {
    const content = await fs.readFile(partialPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(
      `Unable to resolve field $ref "${name}" for theme "${theme}":`,
      error
    );
    return null;
  }
}
