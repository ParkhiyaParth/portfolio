import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["backend/**", "coverage/**"],
  },
];

export default eslintConfig;
