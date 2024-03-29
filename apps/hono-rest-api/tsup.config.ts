import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/**/*.ts'],
  // format: ['cjs'],
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
});
