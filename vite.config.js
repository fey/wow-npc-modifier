import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  base: '/wow-npc-modifier',
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.js'],
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: 'iife',
      },
    },
  },
});
