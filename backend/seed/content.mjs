// Builds the block markup for the five showcase pages and the demo posts.
//
//   node content.mjs <media.json> <site-url>
//
// media.json maps image keys (images/sources.json) to attachment IDs, plus
// `form` (the Gravity Form select value). Prints {pages: {slug: post_content},
// posts: [...], terms: {taxonomy: {slug: name}}} as JSON.
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

// Chip codes: one running sequence across the site, like a swatch book.
let chipCount = 0;
const chip = (text) => `NP–${String(++chipCount).padStart(2, "0")} · ${text}`;
const chips = (texts) => texts.map((text) => ({ text: chip(text) }));

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
      chip_labels: chips(["Structure", "Stillness", "Light", "Type", "Colour"]),
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
      },
      { top: "section", bottom: "section" }
    ),
    acf(
      "text-and-image",
      {
        style: "narrative",
        flipped: 0,
        image: img("arch-nave"),
        label: chip("Blocks"),
        content:
          "<h2>Built from blocks, not templates.</h2><p>Each section is a block with fields an editor understands: a heading, an image, a list of links. Every block takes a colour theme and spacing from the same settings panel, so a page can change mood without new code.</p>",
        buttons: [{ link: link("How it works", "platform") }],
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
      },
      { theme: "light-secondary" }
    ),
    acf(
      "parallax-image",
      {
        style: "break-out",
        parallax: 1,
        image: img("arch-canopy"),
        heading: "One set of blocks, any number of sites.",
        links: [{ link: link("Platform", "platform") }, { link: link("Studies", "work") }],
      },
      { theme: "overlay", top: "0", bottom: "0" }
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
      label: chip("About"),
      heading: '<h1 class="heading-2xl">A boilerplate with a point of view.</h1>',
      content:
        "Nextpress is a starting point for headless WordPress sites: a block library, a token-driven design system and the plumbing between them.",
      buttons: [{ link: link("See the studies", "work") }],
      background_colour: "",
      text_colour: "",
      background_tint: 1,
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
        captions: chips(["Light", "Texture", "Rhythm", "Craft", "Space"]),
        layout: "collage",
      },
      { theme: "light-secondary" }
    ),
    acf("text-and-image", {
      style: "card",
      flipped: 1,
      page_margin: 1,
      image: img("studio-typewriter"),
      label: chip("Approach"),
      content:
        "<h2>Design in the system, not the page.</h2><p>Type, colour and spacing are tokens. Blocks use the tokens and pages use the blocks, so changing a token changes every page that uses it.</p>",
    }),
    acf(
      "stats",
      {
        stats: [
          "<p>5</p><p>Pages on this site, made by one seed script</p>",
          "<p>15</p><p>Content blocks in the default theme</p>",
          "<p>5</p><p>Colour themes any block can take</p>",
          "<p>2</p><p>Typefaces: Archivo and Geist Mono</p>",
        ].map((content) => ({ content })),
        columns: 4,
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
    "choices": [{ "slow": "Slow" }, … ] }
]`;

const API_EXCERPT = `{
  "default": [
    { "id": "default--marquee", "fields": [ … ] },
    { "id": "default--gallery", "fields": [ … ] }
  ]
}`;

const ROUTER_EXCERPT = `{
  "blockName": "acf/default--marquee",
  "data": {
    "items": [{ "text": "deck-hero" }, … ],
    "speed": "slow",
    "theme_override": "dark"
  }
}`;

const REGISTRY_EXCERPT = `export const blocks = {
  "acf/default--marquee": () =>
    import("@themes/default/blocks/marquee"),
  "acf/default--gallery": () =>
    import("@themes/default/blocks/gallery"),
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

// theme_override: light | light-secondary | dark
//   | dark-secondary | overlay
// padding_top, padding_bottom: 0 | xs | sm | md
//   | lg | xl | margin | section`;

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
            text: "The Nextpress plugin reads the block list from the front end and registers each one as an ACF block.",
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
      label: chip("Stack"),
      content:
        "<h2>The stack</h2><p>A Next.js App Router front end with Tailwind 4 driven by CSS tokens. WordPress with ACF Pro and Gravity Forms behind it, running locally in Docker.</p>",
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
        captions: chips(["Vertical", "Stillness", "Procession", "Warmth", "Taper", "Keys"]),
        layout: "filmstrip",
      },
      { top: "header" }
    ),
    acf("gallery", {
      heading: "Six studies in composition",
      images: [img("arch-monolith"), img("botanic-succulent"), img("arch-facade"), img("land-dune"), img("arch-sky"), img("studio-desk")],
      captions: chips(["Editorial", "Pattern", "Grid", "Horizon", "Frame", "Workspace"]),
      layout: "mosaic",
    }),
    acf(
      "text-and-image",
      {
        style: "wide",
        flipped: 1,
        image: img("arch-rotunda"),
        image_tags: ["Gallery", "Layouts", "No custom code"].map((text) => ({ text })),
        label: chip("Method"),
        content:
          "<h2>Same blocks, different pages.</h2><p>Every study here is the gallery block with a different layout setting: filmstrip, mosaic or stagger. Nothing on this page needed page-specific code.</p>",
      },
      { theme: "dark" }
    ),
    acf("parallax-image", {
      style: "container",
      parallax: 1,
      image: img("botanic-cluster"),
      heading: "Every study here uses the same blocks.",
      links: [{ link: link("About", "about") }, { link: link("Contact", "contact") }],
    }),
    acf(
      "gallery",
      {
        heading: "Quiet studies",
        images: [img("arch-stair"), img("arch-canopy"), img("botanic-bloom"), img("arch-ribbon")],
        captions: chips(["Threshold", "Lattice", "Bloom", "Ribbon"]),
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
    }),
    acf("marquee", {
      items: ["Say hello", "Start a project", "Ask a question"].map((text) => ({ text })),
      speed: "slow",
      direction: "left",
      accent_strip: 1,
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Posts: the archive-feed demo. Core blocks only, each with a category, one or
// two themes and a featured image. Dated a few days apart, newest first.
// ---------------------------------------------------------------------------
const TERMS = {
  category: { guides: "Guides", engineering: "Engineering", design: "Design", editorial: "Editorial", releases: "Release notes" },
  theme: {
    performance: "Performance",
    accessibility: "Accessibility",
    "content-modelling": "Content modelling",
    headless: "Headless",
    typography: "Typography",
    workflow: "Workflow",
  },
};

const { heading: h, paragraph: p, list: ul } = core;
const ol = (items) => ul(items, true);

const POSTS = [
  ["setting-up-a-local-site", "Setting up a local Nextpress site", ["guides"], ["headless", "workflow"], "studio-desk",
    "Two folders, two servers and one page to check before you build anything.",
    [p("A Nextpress project is two apps that talk over HTTP: WordPress in Docker for editing, and Next.js for everything visitors see. Getting both running takes a few commands."),
      h("What you need"),
      ul(["Docker, for WordPress and its database", "Node, for the front end", "A copy of the environment file with the client secret"]),
      h("Start in order"),
      ol(["Start the backend containers.", "Start the front end dev server.", "Open the home page and check the header and footer load."]),
      p("If the header is missing, the front end cannot reach WordPress. Check the backend is up before you look anywhere else.")]],
  ["how-the-block-pipeline-works", "How the block pipeline turns fields into components", ["engineering"], ["headless", "content-modelling"], "arch-stair",
    "A block starts as a JSON file of fields and ends as a React component. Here is every step in between.",
    [p("Every custom block has a fields file. WordPress reads it to build the editor form; the front end reads the saved values to render the block."),
      h("The steps"),
      ol(["The fields file defines what an editor can enter.", "The plugin registers it as an ACF block.", "The router returns the saved values with the page.", "The front end looks the block up in its registry and renders it."]),
      p("Because both sides read the same file, a new field shows up in the editor and in the component's data at the same time.")]],
  ["choosing-a-type-scale", "Choosing a type scale that survives real content", ["design"], ["typography"], "studio-typewriter",
    "Pick sizes for the longest headline you will get, not the shortest one in the mock-up.",
    [p("Mock-ups use tidy three-word headlines. Real pages get twelve-word ones, and the scale has to hold up for both."),
      h("Test with awkward copy"),
      ul(["A heading that wraps to three lines", "A single long word", "A paragraph with no heading above it"]),
      p("Fluid sizes help: the scale grows with the viewport between two fixed points, so you set the extremes once and the steps in between follow.")]],
  ["writing-scannable-headings", "Writing headings people can scan", ["editorial"], ["accessibility", "workflow"], "botanic-lily",
    "Most readers skim first. Headings decide whether they stay.",
    [p("A heading is a promise about the section below it. Make it specific enough that a reader can skip the section with confidence."),
      h("Three checks"),
      ul(["Does it say what the section is about?", "Does it make sense out of context, in a list of headings?", "Is it in order: no jumping from level two to level four?"]),
      p("Screen reader users often move between headings to find their place, so a clear outline helps them as much as anyone skimming.")]],
  ["caching-in-a-headless-stack", "Caching in a headless WordPress stack", ["engineering"], ["performance", "headless"], "arch-rotunda",
    "There are two caches between the editor and the visitor. Know which one you are looking at.",
    [p("WordPress caches its API responses, and the front end caches the pages it builds from them. Both make the site fast; both can show you old content."),
      h("When content looks stale"),
      ol(["Publishing in the editor clears both caches for that page.", "Changes made outside the editor need the front end told directly.", "If a new block shows no fields, the plugin's cached block list is out of date."]),
      p("Most “it didn’t update” reports come down to one of those three.")]],
  ["adding-a-new-block", "Adding a new block in five steps", ["guides"], ["content-modelling", "workflow"], "arch-canopy",
    "From an empty folder to a block editors can use.",
    [p("New blocks follow the same shape as the existing ones, so the quickest start is to copy one that is close to what you need."),
      ol(["Create the block folder with a fields file.", "Write the block's entry component.", "Build the presentational component it renders.", "Regenerate the block registry.", "Clear the plugin's block cache and open the editor."]),
      h("Before you start"),
      p("Check whether an existing block already does the job with a different theme or padding. Fewer blocks are easier for editors to learn.")]],
  ["colour-themes-without-drift", "Colour themes without colour drift", ["design"], ["accessibility"], "botanic-bloom",
    "One set of role names, five themes, and no one-off hex values.",
    [p("Components never ask for a colour by name. They ask for a role, such as foreground, surface or accent, and the active theme decides what that means."),
      h("Why roles"),
      ul(["A block looks right on any background without extra code", "Contrast is checked once per theme, not once per component", "A rebrand changes one file"]),
      p("The cost is discipline: a hard-coded colour in one component will look wrong on four of the five themes.")]],
  ["core-images-keep-their-ratio", "Core images now keep their natural ratio", ["releases", "engineering"], ["performance"], "arch-sky",
    "Images without saved dimensions no longer fall back to a fixed 4:3 box.",
    [p("The editor does not always save an image's width and height. The front end used to guess, and the guess was often wrong."),
      h("What changed"),
      ul(["The plugin now sends the uploaded file's dimensions with each image block", "The front end uses them when the block has no size of its own", "Resized images keep the size the editor set"]),
      p("Reserving the right space up front stops the page jumping as images load.")]],
  ["alt-text-that-does-a-job", "Alt text that does a job", ["editorial"], ["accessibility"], "botanic-succulent",
    "Describe what the image is for, not every detail in it.",
    [p("Alt text replaces the image for anyone who cannot see it. Write what they need to follow the page, in a sentence or less."),
      h("Rules of thumb"),
      ul(["Skip “image of”: the reader already knows", "If the image is decoration, leave the alt text empty", "If it contains words, include the words"]),
      p("Write it in the media library once, and every block that uses the image picks it up.")]],
  ["revalidating-pages-on-publish", "Revalidating pages on publish", ["engineering"], ["performance", "headless"], "arch-tower",
    "Static pages that still update the moment an editor hits publish.",
    [p("Pages are built once and served from the cache. When content changes, WordPress asks the front end to rebuild only the pages affected."),
      h("How the request is trusted"),
      p("The revalidation request carries a signed token. The front end checks the signature before it drops anything from its cache, so outsiders cannot empty it."),
      h("Paths matter"),
      p("The front end matches paths exactly, trailing slash included. A path without one is ignored.")]],
  ["building-site-menus", "Building the header and footer menus", ["guides"], ["workflow"], "arch-facade",
    "Menus are ordinary WordPress menus, assigned to two locations.",
    [p("The header and footer read their links from WordPress menus, so editors manage them in the usual place."),
      ol(["Create a menu and add pages to it.", "Assign it to the header or footer location.", "Add the call-to-action class to a link to show it as a button."]),
      p("The layout of the header and footer themselves lives on the Templates page, next to the logo settings.")]],
  ["spacing-as-a-system", "Spacing as a system, not a slider", ["design"], ["workflow"], "arch-column",
    "Blocks choose their own spacing. Editors pick from a short list when they need to change it.",
    [p("Free spacing controls lead to pages where every gap is slightly different. A short scale keeps rhythm without taking control away."),
      h("How it works here"),
      ul(["Each block sets a default top and bottom padding", "Editors can override it from a few named sizes", "There is no spacer block"]),
      p("If a page needs more room, the answer is usually a different block, not a bigger gap.")]],
  ["plan-the-content-model-first", "Plan the content model before the first block", ["editorial", "guides"], ["content-modelling"], "botanic-cluster",
    "Decide what content exists before you decide what it looks like.",
    [p("A content model lists the kinds of content a site holds and the fields each one needs. It is cheaper to change on paper than in code."),
      h("Start with questions"),
      ul(["What will editors publish every week?", "What appears in more than one place?", "What needs to be filtered or searched?"]),
      p("Answers to the last question become taxonomies, like the categories and themes on this post.")]],
  ["fast-private-forms", "Keeping forms fast and private", ["engineering"], ["performance", "accessibility"], "arch-monolith",
    "The form loads with the page and posts straight to WordPress.",
    [p("Form definitions arrive with the page data, so the form renders without a second request. Submissions go directly to the form plugin's API."),
      h("What stays on the server"),
      ul(["Notification recipients", "Routing rules", "Anything the browser does not need to draw the form"]),
      p("Labels, errors and required markers are part of the form markup, so every field is usable with a keyboard and a screen reader.")]],
  ["archive-filters-read-the-url", "Archive filters now read the URL", ["releases"], ["workflow", "headless"], "arch-ribbon",
    "Share a filtered list and the person you send it to sees the same list.",
    [p("The archive feed keeps its search, filters and page number in the address bar. Opening that address restores the same view."),
      h("Fixed along the way"),
      ul(["Page two no longer jumps further ahead", "Filters chosen from a link show as selected", "The next button hides on the last page"])]],
  ["previewing-drafts", "Previewing drafts from the editor", ["guides"], ["workflow", "headless"], "arch-nave",
    "See a draft in the real front end before anyone else can.",
    [p("Preview opens the draft on the front end with a short-lived token, so the page renders with the real components and styles."),
      ol(["Save the draft.", "Choose Preview in the editor.", "Check the page, then return to the editor to publish."]),
      p("Previews skip the cache, so what you see is the current draft.")]],
  ["images-that-hold-the-layout", "Images that hold the layout steady", ["design"], ["performance"], "land-dune",
    "Reserve the space before the pixels arrive.",
    [p("A page that jumps while images load is hard to read and easy to mis-tap. The fix is to know each image's shape before it downloads."),
      h("Three habits"),
      ul(["Give every image a width and height, or a fixed ratio", "Serve sizes that match the layout, not the original upload", "Load images below the fold lazily"]),
      p("The front end handles the last two. The first depends on the image having its dimensions saved.")]],
  ["keeping-long-pages-readable", "Keeping long pages readable", ["editorial"], ["typography", "accessibility"], "studio-typewriter",
    "Short lines, clear breaks and a reason to keep going.",
    [p("Long pages are fine when the reader always knows where they are. Line length, spacing and headings do most of that work."),
      h("Checklist"),
      ul(["Lines of roughly sixty to seventy-five characters", "A heading every few paragraphs", "Lists for anything that is really a list"]),
      p("If a section needs a lot of scrolling to get through, split it.")]],
  ["typed-data-from-wordpress", "Typed data from WordPress", ["engineering"], ["content-modelling", "headless"], "arch-facade",
    "WordPress returns loose JSON. The front end decides what it can trust.",
    [p("Block data comes back as plain JSON with no schema. Components check for the fields they need and render nothing when a value is missing."),
      h("Defensive by default"),
      ul(["Optional fields are optional in the component too", "Empty repeaters render nothing, not an empty box", "Links are checked before they are drawn"]),
      p("This keeps a half-filled block in the editor from breaking the page.")]],
  ["checks-on-every-change", "Lint and type checks on every change", ["releases"], ["workflow"], "arch-canopy",
    "Two commands catch most mistakes before a page ever loads.",
    [p("The front end now runs the ESLint command line directly, and it covers every folder, including the theme and UI components."),
      ol(["Run the type checker.", "Run the linter.", "Build, if the change touches routing or config."]),
      p("Both checks pass on the main branch, so any new warning comes from your change.")]],
];

function posts() {
  const newest = Date.UTC(2026, 10, 18, 9);
  return POSTS.map(([slug, title, category, theme, image, excerpt, body], i) => ({
    slug,
    title,
    excerpt,
    category,
    theme,
    image: img(image),
    date: new Date(newest - i * 4 * 86400000).toISOString().slice(0, 19).replace("T", " "),
    content: join(body),
  }));
}

process.stdout.write(
  JSON.stringify({
    pages: { home: home(), about: about(), platform: platform(), work: work(), contact: contact() },
    posts: posts(),
    terms: TERMS,
  })
);
