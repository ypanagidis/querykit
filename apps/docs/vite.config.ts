import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [mdx(), tanstackStart(), viteReact(), tailwindcss()],
  resolve: {
    alias: {
      collections: fileURLToPath(new URL("./.source", import.meta.url)),
    },
  },
});
