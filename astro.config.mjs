import { defineConfig } from 'astro/config';
import bun from 'astro-bun-adapter';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: bun(),
  integrations: [tailwind()],
  vite: {
    optimizeDeps: {
      exclude: ['ssh2']
    }
  }
});