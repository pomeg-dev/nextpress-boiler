# Nextpress Boilerplate – Frontend Redesign Brief

Nov 16, 2026 · @Vic Lobins

## 1. Role and objective

You redesign and rebuild the frontend of the Nextpress boilerplate. Work as a senior UI/UX designer, art director and senior frontend developer at a high-end agency. You own the design direction and the implementation.

**Terms used in this brief:**

- **The product:** the Nextpress PHP plugin, the nextpress-client package, the headless architecture, the API contracts and the developer experience.
- **The showcase:** the redesigned frontend in this repository.
- **Stop and ask:** stop work on that item, explain the change, and wait for approval.

We sell the product. We do not sell a block library or a site design. The showcase demonstrates the product. A prospective client or agency must see a polished, distinctive website. They must also understand that the system underneath is a flexible foundation, not a fixed template.

The showcase must look like a real creative studio website. It must not look like a boilerplate, a template or a component library preview.

**Priorities, in order:**

1. Protect the product. Do not compromise it to get a visual result.
2. Demonstrate the product with an impressive showcase.
3. Improve the frontend foundations where the change adds real value. Do not add abstraction or complexity without a reason.

## 2. Hard rules

These rules override every other instruction in this brief.

**Read-only code. No exceptions.**

- Do not edit the Nextpress PHP plugin.
- Do not edit the nextpress-client package, including its block registry.
- Do not edit these packages to make a new block or a design work. If a task needs a change to them, stop and ask.

**In scope:**

- The default theme (`themes/default`), including its blocks and stylesheet.
- The boilerplate app code that is not part of the read-only packages.
- The WordPress theme at `backend/wordpress/wp-content/themes/nextpress-theme`. Section 3 describes what you can change there.
- New blocks, built as section 3 describes.

**Stop and ask before you:**

1. Edit an existing `fields.json` file. Include these proposals in the approval checkpoint in section 8.
2. Add a field to an existing block or an existing Templates page layout.
3. Change an existing ACF data structure.
4. Change the functionality or data handling of the archive-feed block.
5. Add or change PHP code. Approved PHP goes in the `nextpress-theme` `functions.php` file.
6. Change shared backend behaviour or an API contract.
7. Make an architectural change that affects existing functionality.
8. Install a plugin, framework or new dependency.

When you stop and ask, give:

- the proposed change,
- the reason for the change,
- the alternatives.

Do not work around a restriction without telling me. Make all other design, layout, content and implementation decisions yourself.

## 3. Architecture and block system

Pages use two kinds of blocks: custom ACF Gutenberg blocks and core Gutenberg blocks. Examples of core blocks are heading, paragraph, list, list item, group and columns. Some parent ACF blocks use InnerBlocks. The nextpress-client registry maps each block to a React component by block name.

Block scaffolds are in `themes/default/blocks`. The theme uses Tailwind CSS 4 for layout, structure, typography and base styles. The theme stylesheet holds custom styles and overrides.

**Header and footer:** The header and footer are ACF Flexible Content layouts on the Templates page (`/wp-admin/admin.php?page=templates`). Keep this setup. Make the header and footer the same on all pages.

Navigation uses standard WordPress menus (Appearance → Menus). A complex mega menu uses ACF repeaters and groups with nested fields instead. Use WordPress menus unless the design needs a mega menu. A mega menu needs new fields in the existing header layout, so stop and ask first.

**WordPress theme (`nextpress-theme`):**

- The theme `functions.php` file registers the custom post types and taxonomies.
- An ACF hook in `functions.php` saves and loads ACF field groups as JSON. Save new field groups through this hook.
- You can add custom post types, taxonomies and ACF field groups where the design needs them.
- Put all new PHP in this `functions.php` file. Stop and ask before you add or change PHP.
- `functions.php` also contains `tiny_mce_before_init` filters. These filters wrap text in spans and add classes such as `heading-xl` and `text-primary`. Core heading and paragraph blocks use the same classes. Section 4 describes how to style them.

**Block wrapper options:**

- Each block has `padding_top`, `padding_bottom` and `theme_override` options. These options map to `frontend/ui/components/organisms/default/BlockWrapper.tsx`.
- Map each `theme_override` value to a colour theme from the palette. Map each padding value to a spacing token.
- Use these options in the seed content to change the colour theme or vertical spacing of a block. Do not write one-off CSS for this.
- Do not change the option fields. You can change how `BlockWrapper.tsx` styles each option value.

**Before you change anything, read and understand:**

- the project structure and how the packages connect,
- each block, its `fields.json` and its component,
- how a block gets from WordPress to the frontend (registration, API data, registry, render),
- the page templates and existing React functionality,
- the existing styles and design tokens.

**Existing blocks:**

- Treat the UI of the existing blocks as a rough scaffold. Only the `archive-feed` block is strong.
- You can rebuild the markup, components and styles of any existing block without approval.
- You can propose changes to the `fields.json` of any existing block, including new, removed or restructured fields. Stop and ask before you make a change. Until I approve a change, a rebuilt component must render every existing field of its block.
- Keep the functionality and data handling of `archive-feed`. You can restyle it and change its markup.
- You can create a new block to replace an existing block in the showcase pages. Do not delete existing blocks.
- Do not rename blocks, fields or registry entries.

**New blocks:**

You can create new blocks without approval. Create a new block when the existing blocks cannot support a good design. Each new block must:

1. Follow the registration pattern of the existing blocks. Find this pattern in the code. Do not invent a new pattern.
2. Work through the existing ACF and headless render pipeline.
3. Have a clear, reusable purpose. Do not create a block for one visual effect only.
4. Use the design system tokens.
5. Be responsive and accessible.

If a new block needs a change to a read-only package, stop and ask.

## 4. Design direction and design system

The target is a premium, contemporary creative studio aesthetic. The design must look art-directed and distinctive. Do not use the first generic layout that you think of. Do not let the current skeleton design limit the quality of the result.

**Do:**

- Make a strong visual hierarchy.
- Use editorial typography.
- Use asymmetric layouts where they help.
- Use whitespace and proportion with intent.
- Use distinctive image crops and treatments.
- Use colour with confidence.
- Design borders, dividers and backgrounds with care.
- Add subtle animations and micro-interactions.
- Keep spacing and alignment consistent.
- Give each section a composition that fits its content.

**Do not:**

- Repeat three-column card grids.
- Overuse rounded containers, cards, pills, badges or floating elements.
- Add gradients or decoration without a purpose.
- Repeat one hero layout on many pages.
- Use generic SaaS layouts.
- Stack unrelated UI components on a page.

**Reference screenshots:** Study the attached screenshots for typography, colour, composition, spacing and imagery. Adapt their ideas to the blocks and architecture. Do not copy their layouts.

**Colour:** Use a 60/30/10 split: 60% primary, 30% secondary, 10% accent. An example palette is butter cream, forest green and hot pink. This example is not mandatory. The accent is the loudest colour. Use it with intent, for contrast and personality. Set the palette before you start to build.

**Design system:** The redesign replaces the default theme styles directly. Every future project starts from this theme. Thus, put every colour, font, size, space, radius, shadow and timing value in a CSS variable or Tailwind theme token. A future project must be able to change the look by changing token values only.

Define tokens and conventions for:

- a fluid type scale with font sizes set as clamp() values, plus font weights and line heights,
- spacing and layout grid,
- colours,
- buttons and links,
- borders and radii,
- image treatments,
- animation durations and easing,
- breakpoints.

Put shared styles in the theme stylesheet. Do not write one-off styles when a token or shared class can do the job.

**Fluid typography:** Set each font size with `clamp()`. Give each size a minimum, a preferred value based on viewport width, and a maximum. Text must scale smoothly between breakpoints without media query jumps. Keep body text at 16 px or larger on mobile.

**Editor classes:** Read the `tiny_mce_before_init` filters and the core heading and paragraph block classes in `functions.php`. Give every class a style in the design system, for example `heading-xl` and `text-primary`. Map each class to a token. Do not rename or remove these classes, because saved content uses them. A new class in the filters is a PHP change, so stop and ask.

**Core blocks:** Style the core Gutenberg blocks that the pages use, for example heading, paragraph, list, list item, group and columns. These blocks must match the custom blocks.

## 5. Pages, content and seeding

The site has exactly five pages. Only Home (`/`) exists now. Create the other four in WordPress.

| Page | Purpose |
| --- | --- |
| Home | The visual showpiece. Use a strong hero, varied layouts, animation and visual storytelling. |
| About | Rich text, image compositions, split layouts, statistics and a timeline. |
| Platform | Explain how the product works: the editor-to-frontend flow, the block system and the developer experience. Show the system. Do not only describe it. |
| Work | Image galleries, project showcases, varied grids and complex compositions. |
| Contact | A working form, calls to action and a strong closing experience. |

You decide the layout and block distribution of each page. Use a different composition on each page. Use a mix of custom ACF blocks and core Gutenberg blocks on each page. Use the block wrapper options to set colour themes and vertical spacing.

**Contact form:** Use Gravity Forms. Submit through the WordPress REST API, as our production sites do. If Gravity Forms is not installed in the local environment, stop and ask. Do not install it.

**Copy:**

- Write short, realistic, generic copy.
- Do not invent testimonials, clients, statistics or specific claims.
- Do not write copy that invites questions about real work.
- Let the design and functionality carry the message.

**Images:**

- Use royalty-free images only. Record the source and licence of each image in the seed script.
- Choose professional images that suit the design.
- Resize and compress each image before import.
- Store images in the WordPress media library.

**Seed script:**

- Create all pages, content, media and menus with one committed script. Assign the menus to the header and footer. Use the existing Docker environment and WP-CLI.
- Make the script idempotent. A second run must update content and must not create duplicate pages or media.
- Do not delete or overwrite content that the script did not create.
- Do not create content in the frontend only. After each run, check that the frontend gets every page and block through the headless API.

## 6. Interactions, responsive design, accessibility and performance

**Interactions:**

- Add interactions where they improve the experience. Examples: hover effects, scroll-triggered reveals, image transitions, animated navigation and subtle parallax.
- Use CSS for animation where possible. Use React only where it adds real value.
- Do not add animation for decoration only.
- Respect `prefers-reduced-motion`.
- Make every interactive element work with a keyboard and with touch.

**Responsive design:**

- Design the mobile layouts. Do not only stack the desktop layout.
- Set typography, image crops, spacing, navigation and content order for each breakpoint.
- Prevent horizontal overflow at all widths, including widths between breakpoints.
- Make touch targets at least 44 × 44 px.
- Keep animation smooth on mobile devices.

**Accessibility:** Meet WCAG 2.1 AA. Check the contrast of every text and background colour pair, including the accent colour. If the accent fails for text, use it only for large text or decoration. Use semantic HTML.

**Performance:** Performance is part of the demonstration.

- Serve images in modern formats and at the correct sizes.
- Set image dimensions to prevent layout shift.
- Do not add large assets or JavaScript dependencies without a reason.
- Do not duplicate large amounts of style or logic.
- Keep components easy to maintain and reuse.

## 7. Environment, Git and visual QA

**Environment:**

- All work stays on localhost.
- WordPress runs in Docker. The frontend dev server runs on port 3000. Both are running now.
- Do not restart these services unless the task requires it.
- Do not change or remove the existing Docker containers.
- Do not delete or overwrite existing project data.
- You can start other local processes. Stop each process when you no longer need it.

**Git:**

- Work on the current branch.
- Commit as you work. Make one commit for each logical unit of work, for example one block or one page.
- Write a clear commit message that says what changed.

**Visual QA:** Use the Playwright MCP to inspect the rendered site. A successful build does not prove that a page looks correct.

- Check after each page or group of related changes. Do not check after each small CSS change.
- Take screenshots at desktop, tablet and mobile widths. Study each screenshot and find the visual problems.
- Fix each problem you find. Do not only report it.

For each page, check that:

1. The page renders and matches the design intent.
2. No horizontal overflow occurs.
3. Images load and have correct crops.
4. Typography, spacing and alignment are consistent.
5. Navigation, the form and other interactive elements work.
6. Animations and transitions work, and reduced motion works.
7. Your changes add no console errors.
8. Your changes add no failed network requests.

## 8. Workflow

Do the work in these phases, in this order.

1. **Audit.** Read the project as section 3 describes. Do not change code in this phase.
2. **Plan.** Decide the design direction, palette, typography, tokens, page structure and block distribution. List the existing blocks to reuse and the new blocks to create.
3. **Approval checkpoint.** Send one request that lists every section 2 item that the plan needs. For each item, give the change, the reason and the alternatives. Wait for approval. Do not send requests one block at a time.
4. **Global foundations.** Build the tokens, typography, spacing, header, footer and shared patterns.
5. **Blocks.** Rebuild or replace the existing blocks. Build the new blocks.
6. **Pages.** Write and run the seed script. Build each page.
7. **Visual QA.** Do the checks in section 7. Fix each problem.
8. **Refinement.** Review the whole site. Find inconsistent spacing, bad image crops, repeated layouts, unfinished interactions and anything that looks generic. Fix these problems.

A working site is not the end of the task. Phase 8 is as important as the build phases.

If you find a new section 2 item after phase 3, stop and ask before you make that change.

## 9. Completion and handover

**Hard gate:** The build, lint and typecheck commands must pass. Run them at the end and report the result. The task is not complete until all three pass.

**The task is complete when:**

- The site has the five pages in section 5, all created by the seed script.
- The existing blocks are rebuilt or replaced to support the design, and archive-feed keeps its functionality.
- The design system is consistent and token-driven.
- You checked all pages at desktop, tablet and mobile widths.
- The read-only packages have no changes.
- Existing ACF integrations and the headless integration still work.
- Navigation, the form and other interactive elements work.
- No significant visual defects or errors remain.
- The site is good enough to show a prospective agency client.

**Handover:** Give a short summary that contains:

1. The pages you created.
2. The existing blocks you reused or improved.
3. The new blocks you created.
4. The main design and functionality changes.
5. All approved section 2 changes.
6. Open issues and limits.
7. The changes that need my review.
8. A design token reference: each token, its value and its use.
9. Seed script notes: how to run it, what it creates and how to reset it.

---

**The product is the architecture. The showcase is the frontend. Protect the product. Make the showcase exceptional.**
