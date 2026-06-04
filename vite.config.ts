import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = import.meta.dirname;

const alias = {
  "@engine": resolve(root, "src/engine"),
  "@glyphs": resolve(root, "src/glyphs"),
  "@components": resolve(root, "src/components"),
  "@domain": resolve(root, "src/domain"),
};

export default defineConfig(({ mode }) => {
  // Demo build (GitHub Pages): bundle the hero app with relative asset paths
  // so it works under any repository subpath.
  if (mode === "demo") {
    return {
      base: "./",
      resolve: { alias },
      plugins: [react()],
      build: { outDir: "dist-demo", emptyOutDir: true },
    };
  }

  // Library build.
  return {
    resolve: { alias },
    plugins: [
      react(),
      dts({
        include: ["src"],
        exclude: ["src/**/*.test.{ts,tsx}"],
        entryRoot: "src",
      }),
    ],
    build: {
      lib: {
        entry: resolve(root, "src/index.ts"),
        name: "Pharos",
        fileName: "pharos",
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
  };
});
