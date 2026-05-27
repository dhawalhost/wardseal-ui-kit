import type { Preview } from "@storybook/react";
import "../src/styles/global.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for all stories",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
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
      // Disable Storybook's built-in background switcher — our ThemeProvider
      // controls the canvas background via CSS variables on the wrapper div.
      disable: true,
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme === "light" ? "light" : "dark";

      // Keep Storybook iframe root synced with the toolbar-selected theme.
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(selectedTheme);
        document.body.style.background = `hsl(var(--background))`;
      }

      return Story();
    },
  ],
};

export default preview;
