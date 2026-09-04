import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

// Next.js recommended lint (registers @next/eslint-plugin-next, so the build no
// longer warns "Next.js plugin not detected") + our own security rule:
// react/no-danger keeps dangerouslySetInnerHTML out of the codebase, so user
// content can only ever render as text nodes.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
    },
  },
];

export default eslintConfig;
