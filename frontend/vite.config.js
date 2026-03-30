import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, {__dirname} from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve( "./src"),
    },
  },
});