## lazy() 和 Suspense 组件

webpack 和 vite 中都通过 import 方法实现懒加载。构建过程中识别到这个方法时，会将模块内容单独打包。执行 import 方法时，这个方法会发起网络请求获取这个单独的包并解析，import 方法的执行返回一个包含了解析结果（即模块导出）的 Promise 对象。

对于 vue-router，其内部解析了这个 Promise 对象。所以我们可以在 vue-router 的路由配置中，可以直接将 `() => import('xxx')` 传入。为什么要用箭头函数时包裹？因为直接使用 `import('xxx')` 他会直接调用去请求，所以放到尖头函数里，vue-router 在进入 /about 时，它才会调用这个箭头函数。 

```js
const routes = [
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
];
```

而对于 react 组件来说，JSX 不接受 Promise 对象，所以我们不能直接用 `() => import('xxx')`,而是要用 React.lazy 方法包裹。`React.lazy(() => import('xxx'))` 他会返回 ？？？？