import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sentry(),
    spotlightjs(),
    metaTags(),
  ],
});
