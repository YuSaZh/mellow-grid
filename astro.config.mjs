import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  integrations: [react()],
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
