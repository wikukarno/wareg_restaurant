import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://wareg.wikukarno.dev",
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    responsiveStyles: true,
  },

  adapter: cloudflare()
});