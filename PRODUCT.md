# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Prospective clients and agencies that Pomegranate pitches. Agency staff show the showcase in meetings and screen shares, usually on a laptop or a large screen. Developers also start new projects from this boilerplate, so the theme is their starting point.

## Product Purpose
The product is Nextpress: the PHP plugin, the `@pomeg-dev/nextpress-client` package, the headless architecture, its API contracts and the developer experience. This repository's frontend is the showcase. It must look like a polished, distinctive studio website and still make clear that the system underneath is a flexible foundation, not a fixed template. Success: a viewer in a pitch sees a site good enough to want, then sees how editors and developers build it.

## Positioning
Editors compose pages from ACF and core Gutenberg blocks in WordPress. Each block maps by name through the client registry to a React component in Next.js. A new project changes the look by changing token values only.

## Operating Context
WordPress runs in Docker on localhost. The Next.js frontend reads content from `/wp-json/nextpress/*`. Header and footer are Templates page layouts. Forms are Gravity Forms, submitted through the WP REST API.

## Capabilities and Constraints
- Read-only: the Nextpress plugin and the nextpress-client package.
- Existing block field schemas, ACF structures, archive-feed data handling, PHP and API contracts change only with approval.
- Exactly five pages: Home, About, Platform, Work, Contact, all seeded by one idempotent WP-CLI script.

## Brand Commitments
- The site carries the name **Nextpress** (confirmed 2026-11-17). No invented studio.
- Copy is short, realistic and generic.

## Evidence on Hand
No real testimonials, clients, case studies or statistics. Do not invent any. Imagery is royalty-free stock with recorded source and licence.

## Product Principles
1. Protect the product. Never compromise the architecture for a visual result.
2. Show the system working. Do not only describe it.
3. Every visual value is a token, so the next project restyles by changing values.
4. Honest content: generic copy, no fabricated proof.

## Accessibility & Inclusion
WCAG 2.1 AA, keyboard and touch support, `prefers-reduced-motion`, touch targets of at least 44px.
