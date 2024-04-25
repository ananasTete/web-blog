JS 原理：

- 执行上下文
- 作用域
- 原型对象
- 闭包

ECMA：

- 变量与操作符
  - 变量
  - 操作符
- 数据类型
  - 基本
  - 引用
  - Map 和 Set
  - 数据类型转换
  - 数据类型判断 🌟
- 数组
  - 操作数组的方法 🌟
- 函数
  - 普通函数与箭头函数
  - 函数内置对象
  - 函数也是对象，也有属性
- 对象
  - Object.defineProperty
  - 创建对象的多种方式：工厂函数
- 类
  - 类的继承
- 几个内置对象
  - Math
  - Date
  - RegExp
- 异步
  - 回调函数
  - Promise
  - async/await
    - Generator
- ajax
  - XMLHttpRequest
  - fetch
- 错误处理
  - throw
  - try...catch
- JSON
  - 不只是 JSON.stringify 和 JSON.parse

---

HTML 相关：

- 常见标签
- 块级元素和行内元素
- 表单
- 专题：Web 语义化

CSS 相关：

- 常见样式属性
- 常见样式单位
- 盒模型
- 布局：position、float、flex、grid
- 选择器
- 过渡
- 动画
- 专题：显示与隐藏 display、visibility、opacity
- 专题：响应式布局 媒体查询
- 专题：CSS 变量
- 专题：CSS 模块化

DOM 相关：

- 节点
- 节点及各种节点的继承关系
- 节点的增删查改，inputHTML
- 节点属性的增删查改
- 样式属性的增删查改,computedStyle
- 自定义节点属性
- 事件
  - 事件的绑定和解绑
  - 事件对象、event.target 和 event.currentTarget
  - 事件流，取消冒泡
  - 事件代理
- 专题：滚动与高度
- 专题：鼠标位置
- 专题：全屏显示
- 专题：监听元素的可见性-IntersectionObserver
- 专题：监听元素属性、子节点的变化-MutationObserver
- 专题：拖拽

---

浏览器相关：

- 浏览器的渲染过程
- 浏览器的存储
  - cookie
  - localStorage
  - sessionStorage
  - indexedDB
- BOM
  - window
  - location
  - navigator
  - screen
  - history
  - document
- 浏览器的跨域
  - JSONP
  - CORS
  - postMessage
  - WebSocket
- 浏览器的安全
  - XSS
  - CSRF
  - HTTPS
  - CSP
- 浏览器的性能
  - 如何使用 Chrome DevTools 观察网站性能表现
- 专题：前端路由
- 专题：前端性能优化

---

前端框架：

react:

- 路由
- 状态管理
- SSR Next.js
- 生态库
  - 动画：react-spring
  - 拖拽：react-dnd

vue:

- 路由
- 状态管理
- SSR Nuxt.js
- 生态库
  - 动画：vue-animate
  - 拖拽：vuedraggable

CSS:
- 预处理器：less
- 后处理器：postcss
- tailwindCss


---

前端工程化：

- 构建工具
  - Webpack
  - vite
  - Rollup
  - 性能优化
  - 插件开发
- 代码规范
  - ESLint
  - Prettier
  - stylelint
  - Husky
  - lint-staged
  - commitlint
- git
- babel/postcss
- 工具限制
  - nvmrc
  - 限制 node 版本
  - 限制 npm 工具
- 持续集成
  - Jenkins
- monorepo
  - pnpm workspace
  - nx/turborepo

---

综合：前端性能优化

- 代码层面
  - 减少 HTTP 请求
  - 减少资源大小
  - 减少重绘重排
  - 懒加载
  - 预加载
  - 代码分割
  - 服务端渲染
- 打包层面
  - 代码压缩
  - 代码分割
  - Tree Shaking
  - 按需加载
- 浏览器层面
  - CDN
  - 缓存
  - 压缩
  - 预加载
  - 预渲染
- 专题：图片
  - 图片压缩
  - 图片懒加载
  - 图片预加载
  - 图片格式选择

---


基建实战：

- 组件库
- 脚手架
- 前端埋点监控
  - 访问
  - 性能
  - 错误
- 代码分析工具

代码场景：

- 懒加载
- 无限滚动
- 大文件切片上传
- 高并发处理
- 全局截流防抖
- 按钮级权限控制
- 权限路由
- JSON 转表单
- 单点登录
- 

业务实战：
- 协同文档
- 多维表格
- 低代码
- IM