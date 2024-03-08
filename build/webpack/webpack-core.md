webpack 的核心流程

初始化阶段：

- 结合 webpack.config.js + 默认配置 + webpack-cli 命令的参数生成最终配置。
- 创建 compiler 对象。这是做什么的？？？？
- 遍历用户定义的 plugins，调用 apply 方法。这是在做什么？plugin 的 apply 方法是干什么的？？？
- 根据配置动态地加载各种内置插件。webpack 的插件机制是怎样的？

[源码解读](https://github.com/DDFE/DDFE-blog/issues/36)
