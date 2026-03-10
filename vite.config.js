import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  base: "/wow-npc-modifier",
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: 'iife',
      },
    },
  },
})
