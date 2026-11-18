// Builds the block markup for the five showcase pages.
//
//   node content.mjs <media.json> <site-url>
//
// media.json maps image keys (images/sources.json) to attachment IDs, plus
// `form` (the Gravity Form select value). Prints {slug: post_content} as JSON.
// Copy is generic: no invented clients, testimonials or statistics.

import { readFileSync } from "node:fs";

const [mediaPath, siteUrl = "http://localhost"] = process.argv.slice(2);
const media = JSON.parse(readFileSync(mediaPath, "utf8"));

const img = (key) => {
  if (!media[key]) throw new Error(`No attachment for image "${key}"`);
  return media[key];
};
const url = (slug) => `${siteUrl.replace(/\/$/, "")}/${slug ? `${slug}/` : ""}`;
const link = (title, slug) => ({ title, url: url(slug), target: "" });

// Block Settings group (nextpress-theme acf-json group_69d607b467ad1).
const SETTINGS_KEYS = {
  theme_override: "field_69d607b42f2bf",
  padding_top: "field_69d608ab2f2c0",
  padding_bottom: "field_69d608cb2f2c1",
};

// WordPress serialize_block_attributes(): keeps `--`, markup and quotes out of
// the block comment.
const serialize = (attrs) =>
  JSON.stringify(attrs)
    .replace(/--/g, "\\u002d\\u002d")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\\"/g, "\\u0022");

// ACF block data as the editor saves it: values plus `_name` → field key.
// Arrays of objects are repeaters (rows flattened to name_i_sub); arrays of
// numbers are galleries.
function acfData(block, fields) {
  const key = (path) => `field_default-${block}-block_${path}`;
  const data = {};
  for (const [id, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (Array.isArray(value) && value.length && typeof value[0] === "object") {
      value.forEach((row, i) => {
        for (const [sub, v] of Object.entries(row)) {
          if (v === undefined) continue;
          data[`${id}_${i}_${sub}`] = v;
          data[`_${id}_${i}_${sub}`] = key(`${id}_${sub}`);
        }
      });
      data[id] = value.length;
    } else if (Array.isArray(value)) {
      data[id] = value.map(String);
    } else {
      data[id] = typeof value === "number" ? String(value) : value;
    }
    data[`_${id}`] = key(id);
  }
  return data;
}

function page(slug) {
  let count = 0;
  const id = (name) => `${slug}-${++count}-${name}`;

  // A custom block. `theme`, `top`, `bottom` are the Block Settings fields.
  const acf = (name, fields, { theme = "light", top = "", bottom = "" } = {}) => {
    const data = acfData(name, fields);
    const settings = { theme_override: theme, padding_top: top, padding_bottom: bottom };
    for (const [field, value] of Object.entries(settings)) {
      data[field] = value;
      data[`_${field}`] = SETTINGS_KEYS[field];
    }
    const anchor = id(name);
    return `<!-- wp:acf/default--${name} ${serialize({
      name: `acf/default--${name}`,
      data,
      mode: "preview",
      anchor,
      nextpress_id: `np-${anchor}`,
    })} /-->`;
  };

  return { acf };
}

// Core block markup, as the editor saves it.
const core = {
  heading: (text, level = 2, className) => {
    const attrs = { ...(level !== 2 && { level }), ...(className && { className }) };
    const cls = ["wp-block-heading", className].filter(Boolean).join(" ");
    const json = Object.keys(attrs).length ? ` ${serialize(attrs)}` : "";
    return `<!-- wp:heading${json} -->\n<h${level} class="${cls}">${text}</h${level}>\n<!-- /wp:heading -->`;
  },
  paragraph: (html, className) =>
    className
      ? `<!-- wp:paragraph ${serialize({ className })} -->\n<p class="${className}">${html}</p>\n<!-- /wp:paragraph -->`
      : `<!-- wp:paragraph -->\n<p>${html}</p>\n<!-- /wp:paragraph -->`,
  list: (items, ordered = false) => {
    const tag = ordered ? "ol" : "ul";
    const attrs = ordered ? ` ${serialize({ ordered: true })}` : "";
    const lis = items
      .map((item) => `<!-- wp:list-item -->\n<li>${item}</li>\n<!-- /wp:list-item -->`)
      .join("\n\n");
    return `<!-- wp:list${attrs} -->\n<${tag} class="wp-block-list">${lis}</${tag}>\n<!-- /wp:list -->`;
  },
  quote: (text, cite) =>
    `<!-- wp:quote -->\n<blockquote class="wp-block-quote"><!-- wp:paragraph -->\n<p>${text}</p>\n<!-- /wp:paragraph --><cite>${cite}</cite></blockquote>\n<!-- /wp:quote -->`,
  code: (source) =>
    `<!-- wp:code -->\n<pre class="wp-block-code"><code>${escapeHtml(source)}</code></pre>\n<!-- /wp:code -->`,
  // `background`: editor colour slug (src/ui/wordpress/blocks/group.tsx maps it to a theme).
  group: (inner, { background, className } = {}) => {
    const attrs = {
      ...(background && { backgroundColor: background }),
      ...(className && { className }),
      layout: { type: "constrained" },
    };
    const cls = [
      "wp-block-group",
      className,
      background && `has-${background}-background-color has-background`,
    ]
      .filter(Boolean)
      .join(" ");
    return `<!-- wp:group ${serialize(attrs)} -->\n<div class="${cls}">${inner.join("\n\n")}</div>\n<!-- /wp:group -->`;
  },
  columns: (columns) =>
    `<!-- wp:columns -->\n<div class="wp-block-columns">${columns
      .map(
        (inner) =>
          `<!-- wp:column -->\n<div class="wp-block-column">${inner.join("\n\n")}</div>\n<!-- /wp:column -->`
      )
      .join("\n\n")}</div>\n<!-- /wp:columns -->`,
  buttons: (buttons) =>
    `<!-- wp:buttons -->\n<div class="wp-block-buttons">${buttons
      .map(({ title, slug, outline }) => {
        const attrs = outline ? ` ${serialize({ className: "is-style-outline" })}` : "";
        const cls = ["wp-block-button", outline && "is-style-outline"].filter(Boolean).join(" ");
        return `<!-- wp:button${attrs} -->\n<div class="${cls}"><a class="wp-block-button__link wp-element-button" href="${url(slug)}">${title}</a></div>\n<!-- /wp:button -->`;
      })
      .join("\n\n")}</div>\n<!-- /wp:buttons -->`,
};

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const join = (blocks) => blocks.join("\n\n") + "\n";

// ---------------------------------------------------------------------------
// Home: the showpiece.
// ---------------------------------------------------------------------------
function home() {
  const { acf } = page("home");
  return join([
    acf("deck-hero", {
      heading: '<h1 class="heading-3xl">Sites that hold their shape.</h1>',
      content:
        "Nextpress pairs the WordPress editor with a Next.js front end. Editors build pages from blocks; the design system keeps every page on brand.",
      buttons: [{ link: link("See the platform", "platform") }, { link: link("Browse the studies", "work") }],
      images: [img("arch-monolith"), img("botanic-lily"), img("arch-rotunda"), img("studio-typewriter"), img("botanic-bloom")],
      chip_labels: [{ text: "Structure" }, { text: "Stillness" }, { text: "Light" }, { text: "Type" }, { text: "Colour" }],
    }),
    acf(
      "marquee",
      {
        items: ["Headless WordPress", "Next.js App Router", "ACF blocks", "Design tokens", "Gravity Forms", "Tailwind 4"].map(
          (text) => ({ text })
        ),
        speed: "medium",
        direction: "left",
        accent_strip: 1,
      },
      { theme: "light" }
    ),
    acf(
      "text-section",
      {
        content_a:
          "<p>One editor, one design system, any number of pages. Every section on this site is a WordPress block with its own fields, rendered by a React component.</p>",
        content_b:
          "<p>Content lives in WordPress. Layout, type and colour live in code. Editors choose blocks and fill in fields, and the front end decides how they look, so pages stay consistent without locking anyone out of the editor.</p>",
        alignment: "row",
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { top: "section", bottom: "section" }
    ),
    acf(
      "text-and-image",
      {
        style: "narrative",
        flipped: 0,
        image: img("arch-nave"),
        label: "Blocks",
        content:
          "<h2>Built from blocks, not templates.</h2><p>Each section is a block with fields an editor understands: a heading, an image, a list of links. Every block takes a colour theme and spacing from the same settings panel, so a page can change mood without new code.</p>",
        buttons: [{ link: link("How it works", "platform") }],
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { theme: "dark" }
    ),
    core.group(
      [
        core.heading("How a page is made"),
        core.columns([
          [
            core.heading("Choose blocks", 3),
            core.paragraph("Add sections from the block library: heroes, galleries, timelines, forms. Core blocks work too."),
          ],
          [
            core.heading("Fill in fields", 3),
            core.paragraph("Each block asks for what it needs and nothing else. Images, links and text go in plain fields."),
          ],
          [
            core.heading("Set the mood", 3),
            core.paragraph("Pick a colour theme and spacing per block. The tokens do the rest:"),
            core.list(["Five colour themes and a flare accent", "Spacing from the same scale everywhere", "Type that scales with the viewport"]),
          ],
        ]),
      ],
      { background: "white" }
    ),
    acf(
      "stacked-links",
      {
        label: "What you can build",
        rows: [
          { link: link("About", "about"), description: "An introduction with an editorial hero, a collage gallery and a timeline." },
          { link: link("Platform", "platform"), description: "How content travels from the editor to the page, with a live palette." },
          { link: link("Work", "work"), description: "Layout studies: filmstrip, mosaic, stagger and parallax." },
          { link: link("Contact", "contact"), description: "A Gravity Form with validation, error and success states." },
        ],
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { theme: "light-secondary" }
    ),
    acf(
      "parallax-image",
      {
        style: "break-out",
        image: img("arch-canopy"),
        links: [{ link: link("Platform", "platform") }, { link: link("Studies", "work") }],
        top_spacer: "0",
        bottom_spacer: "0",
      },
      { theme: "overlay" }
    ),
    core.group(
      [
        core.heading("Start from a working site.", 2, "heading-2xl"),
        core.paragraph("Clone the boilerplate, run the seed and edit these pages in WordPress.", "body-lg"),
        core.buttons([{ title: "Get in touch", slug: "contact" }, { title: "Read about the platform", slug: "platform", outline: true }]),
      ],
      { background: "black" }
    ),
  ]);
}

// ---------------------------------------------------------------------------
// About: editorial.
// ---------------------------------------------------------------------------
function about() {
  const { acf } = page("about");
  return join([
    acf("hero-image", {
      image: img("arch-stair"),
      label: "About Nextpress",
      heading: '<h1 class="heading-2xl">A boilerplate with a point of view.</h1>',
      content:
        "Nextpress is a starting point for headless WordPress sites: a block library, a token-driven design system and the plumbing between them.",
      buttons: [{ link: link("See the studies", "work") }],
      bottom_spacer: "xl",
      background_colour: "",
      text_colour: "",
      background_tint: 0,
    }),
    core.group(
      [
        core.group(
          [
            core.heading("Why it exists"),
            core.paragraph(
              "Most headless builds start the same way: connect WordPress to a front end, wire up previews, build a header, a footer, a form and a dozen blocks. Nextpress does that work once."
            ),
            core.paragraph(
              "What is left is the part that should differ from site to site: the design, the content model and the blocks a team needs."
            ),
            core.quote("Editors should be able to build a good page without being able to build a bad one.", "Design principle"),
          ],
          { className: "measure" }
        ),
      ],
      { background: "white" }
    ),
    acf(
      "gallery",
      {
        heading: "Material and light",
        images: [img("arch-rotunda"), img("botanic-succulent"), img("arch-facade"), img("studio-desk"), img("arch-sky")],
        captions: ["Light", "Texture", "Rhythm", "Craft", "Space"].map((text) => ({ text })),
        layout: "collage",
      },
      { theme: "light-secondary" }
    ),
    acf("text-and-image", {
      style: "card",
      flipped: 1,
      page_margin: 1,
      image: img("studio-typewriter"),
      label: "Approach",
      content:
        "<h2>Design in the system, not the page.</h2><p>Type, colour and spacing are tokens. Blocks use the tokens and pages use the blocks, so changing a token changes every page that uses it.</p>",
      top_spacer: "xl",
      bottom_spacer: "xl",
    }),
    acf(
      "stats",
      {
        stats: [
          "<p>5</p><p>Pages on this site, made by one seed script</p>",
          "<p>15</p><p>Content blocks in the default theme</p>",
          "<p>6</p><p>Colour themes any block can take</p>",
          "<p>2</p><p>Typefaces: Archivo and Geist Mono</p>",
        ].map((content) => ({ content })),
        columns: 4,
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { theme: "dark" }
    ),
    acf(
      "timeline",
      {
        heading: "From brief to launch",
        intro: "The usual shape of a Nextpress build.",
        items: [
          { marker: "Brief", title: "Agree what the site is for", text: "Audiences, pages and the content each one needs." },
          {
            marker: "System",
            title: "Set the tokens",
            text: "Palette, type scale, spacing and motion, defined once in the theme.",
            image: img("arch-column"),
          },
          { marker: "Blocks", title: "Build the blocks", text: "A fields file and a component for each section the content model needs." },
          {
            marker: "Content",
            title: "Fill the pages",
            text: "Editors compose pages in WordPress and preview them on the front end.",
            image: img("botanic-cluster"),
          },
          { marker: "Launch", title: "Ship it", text: "Build, check and deploy the front end; WordPress stays where it is." },
        ],
      },
      { theme: "dark-secondary" }
    ),
    acf("text-and-image", {
      style: "centered-card",
      flipped: 0,
      page_margin: 1,
      image: img("land-dune"),
      content: "<h2>See it in use.</h2><p>The studies page puts the same blocks through different layouts.</p>",
      buttons: [{ link: link("Browse the studies", "work") }],
      top_spacer: "xl",
      bottom_spacer: "xl",
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Platform: how it works.
// ---------------------------------------------------------------------------
const FIELDS_EXCERPT = `[
  { "id": "items", "type": "repeater", "min": 1,
    "fields": [{ "id": "text", "type": "text" }] },
  { "id": "speed", "type": "select",
    "choices": [{ "slow": "Slow" }, { "medium": "Medium" }, { "fast": "Fast" }] }
]`;

const API_EXCERPT = `{
  "default": [
    { "id": "default--marquee", "blockName": "marquee", "fields": [ … ] },
    { "id": "default--gallery", "blockName": "gallery", "fields": [ … ] }
  ]
}`;

const ROUTER_EXCERPT = `{
  "blockName": "acf/default--marquee",
  "data": {
    "items": [{ "text": "deck-hero" }, { "text": "marquee" }],
    "speed": "slow",
    "theme_override": "dark"
  }
}`;

const REGISTRY_EXCERPT = `export const blocks = {
  "acf/default--marquee": () => import("@themes/default/blocks/marquee"),
  "acf/default--gallery": () => import("@themes/default/blocks/gallery"),
};`;

const COMPONENT_EXCERPT = `export function MarqueeBlock(props) {
  const { items, speed, direction } = props.data;
  return (
    <Marquee
      items={items.map((item) => item.text)}
      speed={speed}
      direction={direction}
      blockOptions={getBlockOptions(props.data)}
    />
  );
}`;

const WRAPPER_EXCERPT = `// Every block's data carries the Block Settings fields.
<BlockWrapper blockOptions={getBlockOptions(props.data)}>
  …
</BlockWrapper>

// theme_override: light | light-secondary | dark | dark-secondary | overlay
// padding_top, padding_bottom: 0 | xs | sm | md | lg | xl | margin | section`;

function platform() {
  const { acf } = page("platform");
  return join([
    acf(
      "text-section",
      {
        content_a: '<h1><span class="heading-2xl">WordPress for the words. Next.js for the rest.</span></h1>',
        content_b:
          "<p>Nextpress keeps editing in WordPress and moves rendering to a Next.js front end. The two talk over REST: the editor saves blocks, and the front end fetches and renders them.</p>",
        alignment: "col",
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { theme: "dark-secondary", top: "section" }
    ),
    acf(
      "process-flow",
      {
        heading: "From editor to page",
        intro: "What happens between pressing Update and seeing the page.",
        steps: [
          {
            label: "Editor",
            title: "An editor fills in a block",
            text: "Blocks are ACF blocks. Their fields come from a fields.json file in the front-end theme, so the editor form and the component share one definition.",
            code: FIELDS_EXCERPT,
            code_label: "blocks/marquee/fields.json",
          },
          {
            label: "WordPress",
            title: "WordPress registers it",
            text: "The Nextpress plugin reads the block list from the front end and registers each block as acf/default--name.",
            code: API_EXCERPT,
            code_label: "GET /api/blocks/",
          },
          {
            label: "REST",
            title: "The page is served as JSON",
            text: "The router endpoint returns the page with each block’s saved data, formatted by ACF.",
            code: ROUTER_EXCERPT,
            code_label: "GET /wp-json/nextpress/router/platform",
          },
          {
            label: "Registry",
            title: "The front end finds a component",
            text: "A generated registry maps each block name to its component, loaded on demand.",
            code: REGISTRY_EXCERPT,
            code_label: "src/blocks.registry.generated.ts",
          },
          {
            label: "Component",
            title: "React renders the block",
            text: "The block passes its fields to a component, which wraps itself in BlockWrapper for colour theme and spacing.",
            code: COMPONENT_EXCERPT,
            code_label: "blocks/marquee/index.tsx",
          },
        ],
      },
      { theme: "dark-secondary", top: "0" }
    ),
    core.group(
      [
        core.heading("Custom blocks and core blocks"),
        core.columns([
          [
            core.heading("Custom blocks", 3),
            core.paragraph("Built for this theme, each with its own fields and component."),
            core.list(["Heroes: deck-hero, hero-image", "Media: gallery, parallax-image", "Story: timeline, process-flow, stats", "Forms: contact-form"]),
          ],
          [
            core.heading("Core blocks", 3),
            core.paragraph("WordPress’s own blocks, styled by the same tokens."),
            core.list(["Headings, paragraphs and lists", "Quotes and code", "Columns, groups and buttons"]),
          ],
        ]),
        core.code(WRAPPER_EXCERPT),
      ],
      { background: "white" }
    ),
    acf(
      "palette-switcher",
      {
        heading: "Try the palette",
        intro:
          "Pick a preset to recolour this page. Every block reads the same tokens, so the whole page changes at once. The table checks the main text pairs against WCAG AA.",
        presets: [
          { name: "Clay", chalk: "#f2ede6", bottle: "#3b2418", flare: "#e4572e", sage: "#dccdbd" },
          { name: "Harbour", chalk: "#eef1f4", bottle: "#14213d", flare: "#fca311", sage: "#c9d3e0" },
          { name: "Orchard", chalk: "#f1f0e4", bottle: "#2f3e1f", flare: "#f28c8c", sage: "#d6dcc0" },
        ],
      },
      { theme: "light-secondary" }
    ),
    acf("text-and-image", {
      style: "wide",
      flipped: 0,
      image: img("arch-ribbon"),
      image_tags: ["Next.js", "ACF", "Tailwind"].map((text) => ({ text })),
      label: "Stack",
      content:
        "<h2>The stack</h2><p>A Next.js App Router front end with Tailwind 4 driven by CSS tokens. WordPress with ACF Pro and Gravity Forms behind it, running locally in Docker.</p>",
      top_spacer: "xl",
      bottom_spacer: "xl",
    }),
    acf(
      "marquee",
      {
        items: [
          "deck-hero",
          "marquee",
          "gallery",
          "timeline",
          "process-flow",
          "palette-switcher",
          "contact-form",
          "hero-image",
          "text-and-image",
          "text-section",
          "stacked-links",
          "stats",
          "parallax-image",
          "featured-posts",
          "archive-feed",
        ].map((text) => ({ text })),
        speed: "slow",
        direction: "right",
        accent_strip: 0,
      },
      { theme: "dark" }
    ),
    core.group(
      [
        core.heading("Build on it.", 2, "heading-2xl"),
        core.paragraph("Add a block by adding a folder: fields, a component, and the registry picks it up.", "body-lg"),
        core.buttons([{ title: "Get in touch", slug: "contact" }]),
      ],
      { background: "primary" }
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Work: layout studies, not client projects.
// ---------------------------------------------------------------------------
function work() {
  const { acf } = page("work");
  return join([
    acf(
      "gallery",
      {
        heading: "Studies",
        images: [img("arch-tower"), img("botanic-lily"), img("arch-nave"), img("botanic-bloom"), img("arch-column"), img("studio-typewriter")],
        captions: ["Vertical", "Stillness", "Procession", "Warmth", "Taper", "Keys"].map((text) => ({ text })),
        layout: "filmstrip",
      },
      { top: "header" }
    ),
    acf("gallery", {
      heading: "Six studies in composition",
      images: [img("arch-monolith"), img("botanic-succulent"), img("arch-facade"), img("land-dune"), img("arch-sky"), img("studio-desk")],
      captions: [
        "Study 01 — Editorial",
        "Study 02 — Pattern",
        "Study 03 — Grid",
        "Study 04 — Horizon",
        "Study 05 — Frame",
        "Study 06 — Workspace",
      ].map((text) => ({ text })),
      layout: "mosaic",
    }),
    acf(
      "text-and-image",
      {
        style: "wide",
        flipped: 1,
        image: img("arch-rotunda"),
        image_tags: ["Gallery", "Layouts", "No custom code"].map((text) => ({ text })),
        label: "Method",
        content:
          "<h2>Same blocks, different pages.</h2><p>Every study here is the gallery block with a different layout setting: filmstrip, mosaic or stagger. Nothing on this page needed page-specific code.</p>",
        top_spacer: "xl",
        bottom_spacer: "xl",
      },
      { theme: "dark" }
    ),
    acf("parallax-image", {
      style: "container",
      image: img("botanic-cluster"),
      links: [{ link: link("About", "about") }, { link: link("Contact", "contact") }],
      top_spacer: "xl",
      bottom_spacer: "xl",
    }),
    acf(
      "gallery",
      {
        heading: "Quiet studies",
        images: [img("arch-stair"), img("arch-canopy"), img("botanic-bloom"), img("arch-ribbon")],
        captions: ["Threshold", "Lattice", "Bloom", "Ribbon"].map((text) => ({ text })),
        layout: "stagger",
      },
      { theme: "light-secondary" }
    ),
    core.group(
      [
        core.heading("Have a project in mind?", 2, "heading-2xl"),
        core.paragraph("Tell us what you are building.", "body-lg"),
        core.buttons([{ title: "Get in touch", slug: "contact" }]),
      ],
      { background: "black" }
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Contact.
// ---------------------------------------------------------------------------
function contact() {
  const { acf } = page("contact");
  return join([
    acf(
      "contact-form",
      {
        heading: '<h1 class="heading-3xl">Let’s talk.</h1>',
        content: "Tell us about the site you want to build. The form posts to Gravity Forms over REST.",
        gravity_form: media.form,
        aside:
          '<h2 class="heading-xs">Prefer email?</h2><p><a href="mailto:hello@example.com">hello@example.com</a></p>',
      },
      { theme: "dark", top: "header" }
    ),
    acf("stacked-links", {
      label: "Keep looking",
      rows: [
        { link: link("Platform", "platform"), description: "How the editor and the front end fit together." },
        { link: link("Work", "work"), description: "Layout studies built from the same blocks." },
        { link: link("About", "about"), description: "Why Nextpress exists and how a build runs." },
      ],
      top_spacer: "xl",
      bottom_spacer: "xl",
    }),
    acf("marquee", {
      items: ["Say hello", "Start a project", "Ask a question"].map((text) => ({ text })),
      speed: "slow",
      direction: "left",
      accent_strip: 1,
    }),
  ]);
}

process.stdout.write(JSON.stringify({ home: home(), about: about(), platform: platform(), work: work(), contact: contact() }));
