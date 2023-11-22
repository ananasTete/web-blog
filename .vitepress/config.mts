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
        { text: "React", link: "/framework/react/react" },
        { text: "Redux", link: "/framework/react/redux" },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/ananasTete" }],
  },
});
