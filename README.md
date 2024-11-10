# Next guternberg wordpress starter

_Very_ opinionated starting place for Pomegranate's Vercel && Next.js // Wordpress && Gutenberg projects.

## Uses these plugins:

- _Vercel ISR Helper_ for
- _ACF Pro_ for enabling easy field-construction on both post types and settings pages
- _Gravity form_
- _Accordion blocks_ for performant and easy way of adding accordions to gutenberg
- _Icon block_ for a performant and easy way of adding icons to gutenberg
- _Yoast SEO_ for manageing site and post-by-post SEO settings.
- _WPS Menu Exporter_ - as this allows quick export/import of menu's for the lazier among us when cloning sites.

## Getting started

- clone the repo git clone [giturl] [project-name]
- run `make setup`
  - this will setup EVERYTHING; AWS, new gitlab project, Digital ocean DNS to assign domains & Vercel.

```
npm i
npm run dev
```

backend: `http://localhost/wp-admin`
frontend: `http://localhost:3000`
