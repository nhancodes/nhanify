import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    ignores: [
      "**/*.sql",
      "migrations/*",
      "transpiledjs/*",
      "public/assets/javascript/**/*",
      "dist/**/*",
    ], // Add this line to ignore SQL files
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  // Add this configuration for ES modules (your compiled TypeScript)
  {
    files: ["public/assets/javascript/**/*.js"], // Target compiled files
    languageOptions: {
      sourceType: "module", // This is the key fix
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.js"],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
];
