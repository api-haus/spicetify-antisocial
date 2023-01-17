module.exports = {
  extends: [
    "plugin:@shopify/typescript",
    "plugin:@shopify/typescript-type-checking",
    "plugin:@shopify/react",
    "plugin:@shopify/prettier",
  ],
  parserOptions: {
    project: "tsconfig.json",
  },
  rules: {
    "line-comment-position": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
  },
};
