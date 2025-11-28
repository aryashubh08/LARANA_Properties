import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost", // ensures the dev server listens on localhost
    port: 5173, // your default Vite port
    hmr: {
      protocol: "ws", // WebSocket protocol
      host: "localhost",
    },
  },
});
