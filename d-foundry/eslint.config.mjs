import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only Claude Design handoff bundle -- not app source, do not port verbatim.
    "support.js",
    "image-slot.js",
    "*.dc.html",
    "DFOUNDRY_PORT.md",
    "CLAUDE_CODE_PROMPT.txt",
    "README.md",
  ]),
]);

export default eslintConfig;
