"use client";

import dynamic from "next/dynamic";

// Client components that only some pages render. Every client component a
// route imports joins the chunks that route loads on every page, unless the
// import is dynamic from a client module, like these. Each still renders on
// the server; its script loads only on the pages that use it.

export const Feed = dynamic(() => import("./archive/Feed").then((mod) => mod.Feed));

// With react-hook-form and html-react-parser.
export const GravityForm = dynamic(() =>
  import("./organisms/forms/GravityForm").then((mod) => mod.GravityForm)
);

export const PaletteSwitcher = dynamic(() => import("./organisms/default/PaletteSwitcher"));
