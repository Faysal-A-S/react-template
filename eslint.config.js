import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config([
    globalIgnores(["dist", "src/paraglide/**", "src/routeTree.gen.ts"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat["recommended-latest"],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    ...pluginQuery.configs["flat/recommended"],
    // TanStack routes export Route; shadcn primitives intentionally co-export helpers.
    {
        files: ["src/routes/**/*.tsx", "src/components/ui/**/*.tsx"],
        rules: { "react-refresh/only-export-components": "off" },
    },
]);
