import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Web Blog",
  description: "你好",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "basic", items: [{ text: "TypeScript", link: "/basic/ts/ts" }] },
      {
        text: "framework",
        items: [{ text: "React", link: "/framework/react/react" }],
      },
    ],

    search: {
      provider: "local",
    },

    sidebar: {
      "/basic/": [{ text: "TS 基础", link: "/basic/ts/ts" }],
      "/framework/": [
        {
          text: "React",
          items: [
            { text: "React 基础", link: "/framework/react/react" },
            { text: "React Hooks", link: "/framework/react/react-hooks" },
          ],
        },
        {
          text: "Redux",
          items: [{ text: "Redux 基础", link: "/framework/react/redux" }],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/ananasTete" }],
  },
});
