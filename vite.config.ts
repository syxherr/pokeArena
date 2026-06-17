import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/pokeArena/",
  plugins: [react()],

  server: {
    watch: {
      usePolling: true,
    },
  },
});