import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: 'iife',
      },
    },
  },
})
