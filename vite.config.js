import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: 80,
    allowedHosts: [
      "geekhaven-brew-1-cafeteria-front.a9negi.easypanel.host",
      "localhost",
      "127.0.0.1",
      "::1",
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
