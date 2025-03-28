import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: [
    "../ui/components/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-viewport"
  ],
  framework: "@storybook/nextjs",
  docs: {
    autodocs: "tag",
  },
};

export default config;