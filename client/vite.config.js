import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["client"],
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      protocol: "ws",
      host: "192.168.99.100",
      port: 3000,
    },
  },
});
