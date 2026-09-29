// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    // three.js is only imported lazily (PatchAntenna.astro), so Vite would discover it
    // mid-session and re-bundle deps, which breaks the already-hydrated React header.
    optimizeDeps: {
      include: ['three', 'three/addons/controls/OrbitControls.js'],
    },
  },
});
