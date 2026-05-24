export default {
  ignorePatterns: ["apps/docs/.source/**", "apps/docs/src/routeTree.gen.ts"],
  options: {
    typeAware: true,
  },
  rules: {
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
  },
};
