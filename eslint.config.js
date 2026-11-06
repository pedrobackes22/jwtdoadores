import expo from "eslint-config-expo/flat.js";
export default [
  ...expo,
  {
    ignores: ["referencias/**", ".tools/**", ".mysql-validation/**", "dist/**"],
  },
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-unresolved": "off",
    },
  },
];
