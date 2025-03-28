import React from "react";
import type { Preview } from "@storybook/react";
import "../src/ui/globals.scss";
import "../ui/styles/figma-variables.scss"
import "../themes/default/theme.scss";
import { fontVariables } from "../ui/fonts/font-loader";

const colorSchemes = ["light", "dark", "image"];

const modifyFontStyles = () => {
  const styleTags = document.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.hasAttribute('data-emotion') || styleTag.hasAttribute('data-s')) {
      return;
    }

    let styleContent = styleTag.innerHTML;
    styleContent = styleContent.replace(
      /src:\s*url\(['"]?(\.\/public\/fonts\/.*?\.ttf)['"]?\)/g,
      (match, p1) => {
        return `src: url('/fonts/${p1.split('/').pop()}')`;
      }
    );
    styleTag.innerHTML = styleContent;
  });
};

const withThemeSwitcher = (Story: React.FC, context: any) => {
  const { theme = "default", colorScheme } = context.globals;

  // Handle theme changes.
  modifyFontStyles();
  document.documentElement.classList.add(...fontVariables.split(" "));
  document.documentElement.setAttribute("data-theme", theme || "default");

  // Handle Color changes.
  const colorSchemes = ["light", "dark", "image"];
  document.body.classList.remove(...colorSchemes);
  document.body.classList.add(colorScheme);
  if (colorScheme === "image") {
    document.body.style.backgroundImage = "url('https://picsum.photos/800/600')";
  } else {
    document.body.style.backgroundImage = "";
  }

  return <Story />;
};

const updateRootWidth = (Story: React.FC, context: any) => {
  const { viewportWidth } = context.globals;
  const rootElement = document.getElementById("storybook-root");
  if (rootElement) {
    rootElement.style.width = viewportWidth;
    rootElement.style.padding = viewportWidth === "100%" 
      ? "0px"
      : "1rem";
  }

  return <Story />;
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    themes: {
      default: "default"
    }
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Select Theme",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: ["default"],
        showName: true,
      },
    },
    colorScheme: {
      name: "Color Scheme",
      description: "Select Light or Dark Mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: colorSchemes,
        showName: true,
      },
    },
    viewportWidth: {
      name: "Viewport Width",
      description: "Set the width of the #storybook-root element",
      defaultValue: "auto",
      toolbar: {
        icon: "expand",
        items: ["auto", "100%"],
        showName: true,
      },
    },
  },
  decorators: [
    withThemeSwitcher,
    updateRootWidth
  ],
};

export default preview;
