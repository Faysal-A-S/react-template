import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    envDir: false,
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
    test: { environment: "node" },
});
