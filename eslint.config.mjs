import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

// Minimal, security-focused lint: user content must only ever render as text
// nodes. react/no-danger keeps dangerouslySetInnerHTML out of the codebase.
export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: { react },
    rules: {
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
    },
  },
];
