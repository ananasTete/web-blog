目前存在两种使用方式的脚手架：

- 像 vue-cli 这种先安装到本地，之后就使用本地版本来创建项目的脚手架
- 像 create-vue、create-react-app、create-next-app 这种先下载到本地，项目创建完成后会自动删除的脚手架

前者的使用方式是

```bash
npm install -g @vue/cli
vue create my-project
```

后者的使用方式是

```bash
npm create vue@latest

# 或者
npx create-vue@latest

npx create-next-app my-project
```

npm create 命令的作用是什么？

npm create 命令同 npm init 命令。当直接执行 npm init 命令时会在当前目录下生成一个 package.json 文件。而执行 npm init template 命令

1. 会在当前目录下 node_modules 在查找一个名为 `create-<template>` 的包，找不到就会从 npm 注册表查找。
2. 将 `create-<template>` 安装到电脑的临时目录中。在 Unix 和 Unix-like 系统（如 Linux 和 macOS）中，临时目录通常是 /tmp 或 /var/tmp。在 Windows 系统中，临时目录通常是 C:\Windows\Temp
3. 然后执行该包的主程序，默认为项目目录下的 index.js 文件。通常用于配置创建的项目，生成新项目
4. 临时目录中的 `create-<template>` 包会被自动清理掉。

npx 不是用于执行当前目录下的包吗？为什么还能执行 create-vue 这些本地没有的包？

npx 确实会优先查找并执行当前目录下 node_modules 下的指定包，如果不存在，就会查找全局安装的 npm 包，再找不到就去 npm 注册表下载 create-vue 这个包，然后执行这个包的主程序。就像 npm create 命令一样。

使用 npm create 和 npx 有什么区别？

1. 对于同一个包 create-next-app，前者可以省略 create, 后者不能省略。即 npm create next-app 和 npx create-next-app 。
2. 前者从当前目录的 node_modules 中找不到时，直接会去 npm 注册表查找，后者还会从全局安装的 npm 包中查找。