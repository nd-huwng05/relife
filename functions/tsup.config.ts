import { defineConfig } from "tsup";

// Firebase deploy uploads only this folder, so workspace code (@relife/shared) and
// its deps (zod) are bundled into lib/. Only the packages in "dependencies" stay external.
export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  format: "cjs",
  target: "node22",
  platform: "node",
  sourcemap: true,
  clean: true,
  noExternal: ["@relife/shared", "zod"],
});
