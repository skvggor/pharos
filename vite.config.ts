import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@engine": resolve(root, "src/engine"),
      "@glyphs": resolve(root, "src/glyphs"),
      "@components": resolve(root, "src/components"),
      "@domain": resolve(root, "src/domain"),
    },
  },
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/globals.d.ts"],
      entryRoot: "src",
    }),
  ],
  build: {
    lib: {
      entry: resolve(root, "src/index.ts"),
      name: "DigitalFont",
      fileName: "digital-font",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
