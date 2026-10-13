import type { Preview } from "@storybook/react";
import "../src/styles/global.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for all stories",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme === "dark" ? "dark" : "light";

      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(selectedTheme);
        document.body.style.background = "hsl(var(--background))";
        document.body.style.color = "hsl(var(--foreground))";
        document.body.style.fontFamily = "var(--font-display)";
      }

      return Story();
    },
  ],
};

export default preview;
