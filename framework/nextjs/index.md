# 服务端渲染

服务端渲染不是什么新的概念，之前的 PHP 这种模板引擎就是服务端渲染。在客户端发起请求时，服务端执行 PHP 代码请求数据，并将数据填充到模板中的指定位置，然后将 HTML 返回给客户端。只是
之前没有组件的概念。

现在说的服务端渲染就是在服务器上渲染组件为 HTML 字符串，然后发送到客户端，一并发送的还有的 react 组件。客户端先渲染这个 HTML，然后在客户端渲染 react 组件，只是在渲染过程中不再创建新的真实 DOM，而是将组件与现有的真实 DOM 关联到一起，添加交互逻辑和管理之后的渲染。

- 因为在服务端还需要渲染组件所以前端项目就不能使用静态代理服务器了，需要使用 node 服务器。
- 这种在服务器渲染一次，客户端渲染一次的方式，叫做同构渲染。

CSR：客户端发起请求 -> 资源下载到客户端 -> 客户端执行代码 -> 客户端渲染
SSR: 客户端发起请求 -> 服务端渲染 -> 资源下载到服务器 -> 客户端渲染 -> 客户端执行代码 -> 客户端渲染

存在组件：

```js
import { useState } from "react";

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

在服务端渲染时：使用 `renderToString` 函数将组件渲染为 HTML 字符串。注意：

- 模板中的状态已经被替换为了值。
- 事件处理程序没有了。

```js
import { renderToString } from "react-dom/server";
import App from "./App";

console.log(renderToString(<App />));

// <h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button>
```

在客户端渲染完之后，再次渲染组件：与客户端使用 `renderRoot` 不同，服务端使用 `hydrateRoot` 函数。将组件与现有的真实 DOM 关联到一起。
这个过程会将 button 按钮的事件处理程序添加到真实 DOM 上。就可以在客户端上使用组件了。

```js
import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

hydrateRoot(document.getElementById("root"), <App />);
```

可见，在客户端渲染完成前，真实 DOM 是不能交互的。为什么要在服务端渲染的 HTML 字符串中将事件处理程序去掉呢？？？

因为这是 react 程序，HTML 代码还要关联到 react 组件中，按组件定义的那样去运行。如果保留这个事件处理程序，在关联完成之前它执行啥呢？

## 客户端组件与服务端组件

# Next.js 中的渲染

Next.js 分为三种渲染策略：

1. 静态渲染
2. 动态渲染
3. 流

静态渲染：在项目构建阶段渲染路由。也就是说在服务器上会存在已经渲染好的 HTML，适合不同的用户请求到的都是同一个页面。如个人博客类、产品展示类网站。也叫做 SSG。

动态渲染：每次请求时，在服务器渲染。也就是通常意义的 SSR。

# 路由

Nextjs 中允许两种路由方式：`App Router` 和 `Pages Router`。

两种路由方式有什么区别？

- `App Router` 是在 `app` 目录中中定义的路由；`Pages Router` 是在 `pages` 目录...
- `App Router` 基于 `React Server Components` 实现，`Pages Router` 基于什么实现？不同的实现方式带来了什么区别？

::: tip
无论是 `App Router` 还是 `Pages Router`，都是基于 **文件系统** 的路由。
:::

以下都是使用 `App Router` 的路由方式。

## 基于文件系统的路由

app 目录中的每一层文件夹，都代表 URL 中的一段路径。每个文件夹中的 `page.js` 文件，代表路由的 UI。

![path-segment](../../public/framework/nextjs/route-segments-to-path-segments.avif)

```
xx.com/ -> app/page.js
xx.com/dashboard -> app/dashboard/page.js
```

每一层路由目录中都通过约定名称的文件来定义路由配置。NextJS 会将这些文件组织为一个树形结构。

![route-directory](../../public/framework/nextjs/file-conventions-component-hierarchy.avif)

![route-directory](../../public/framework/nextjs/nested-file-conventions-component-hierarchy.avif)

### 约定名称文件

#### page

定义路由的 UI。每个 page.js 文件应该导出一个组件。

在组件的参数对象中，包含一个 params 对象，其中包含路由的参数。

```tsx
export default function ({ params }) {
  //...
}
```

#### layout 布局

定义路由的布局 UI。由图可知，在切换子路由时，布局 UI 不会重新渲染。

layout.js 应该导出一个接受 children 属性的组件。

例如，定义一个布局 UI，包含一个导航栏和一个子路由。在切换子路由时，导航栏不会重新渲染。

```tsx
export default function DashboardLayout({ children }) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  );
}
```

##### 根布局

app 目录中的 layout 文件是必须的，称为根布局，应用于所有路由。并且必须包含 html 和 body 标记。

```ts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

##### 嵌套布局

见上图，嵌套路由的布局 UI 会在父路由的布局 UI 中渲染。所以布局 UI 的渲染也是嵌套的。

#### template 模板

template 和 route 一样，都是用于在子路由中共享 UI 的。但与 layout 不同的是，每次切换子路由时，template UI 都会重新渲染。

template.js 也应该导出一个接受 children 属性的组件。

见上图，layout 和 template 可以同时存在。

#### error 错误处理

error.js 会自动创建一个 `ErrorBoundary` 组件，用于捕获子组件的错误。
如图，NextJS 会自动将这个组件包裹 page.js 组件或嵌套的内容，以实现错误处理。

从 error.js 导出的组件，会作为捕获到错误时的备用 UI。

error.js 的组件的 props 中默认包含两个参数，一个是错误对象；另一个是一个函数，用于重试错误的 UI。我们应该在组件中通过交互让用户可以触发这个重试函数。

![error](../../public/framework/nextjs/error-overview.avif)

::: tip
在嵌套路由中抛出的错误，会向上冒泡，被最近的 error.js 组件捕获。
:::

::: warning
在头部的图中可以看到，layout 和 template 组件在 error 组件外部，这意味着 layout 和 template 组件的错误不会被 **同目录** 的 error 组件捕获。只能被上层的 error 组件捕获。
:::

::: tip
app 目录下的 layout 和 template 组件的错误需要使用 `global-error.js` 组件来捕获。他会包裹整个应用程序
:::

#### loading 加载 UI

由图可知，loading.js 导出的组件会作为 `Suspense` 组件的备用 UI。当路由组件加载时，如果没有加载到客户端，就会显示 loading.js 的 UI。

#### route handler

### 约定名称目录

#### Route Groups

使用 `(dirName)` 声明文件夹，他不会被识别为路由。这样可以就可以对路由分组。

![route-group](../../public/framework/nextjs/route-group-organisation.avif)

有什么用？

1. 你可以在 `(marketing)` 目录下声明 layout.js 和 loading.js，这样就可以为 marketing 目录下的所有路由声明 layout 和 loading 组件。

2. app 下的 layout.js 作为所有路由的根布局，但如果想要多个根布局时，就可以吧 layout.js 删掉，然后建立多个 route groups，每个 group 下都存在一个 layout.js。当然，每个 layout.js 都要有 html 和 body 标签。并且根 page.js 文件应该定义在一个路由组中。

#### 动态路由

通过将文件夹命名为 `[dirName]` 来创建动态路由。

page.js 的组件的参数中包含一个 `params` 对象，其中包含了路由的参数。

```tsx
interface Props {
  params: {
    slug: string;
  };
}

export default function Page({ params }: Props) {
  return <div>My Post: {params.slug}</div>;
}
```

在 layout.js / route.js / page.js 中都能获取路由的 params 参数。

动态路由拓展：

通过将文件夹命名为 `[...dirnName]` 使动态路由拓展为捕获所有后续路径。

例如 `app/shop/[...slug]/page.js` 将会匹配 /shop/clothes, 同时也会匹配 `/shop/clothes/tops, /shop/clothes/tops/t-shirts`。

可选的动态路由拓展：

通过将文件夹命名为 `[[...dirName]]` 使匹配所有后续路径的能力是可选的。

除了 `/shop/clothes 、 /shop/clothes/tops 、 /shop/clothes/tops/t-shirts` 之外， `app/shop/[[...slug]]/page.js` 还将匹配 `/shop`。

#### 构建时静态生成路由

上一节的动态路由是在用户请求时按需生成的路由，还可以使用 `generateStaticParams` 函数结合动态路由，在项目构建阶段静态生成路由。

- 在路由的 page.js 中定义并导出。
- 在 `next dev` 期间，导航到该路由时，会调用这个函数
- 在 `next build` 期间，该函数在生成相应的布局或页面之前运行。
- 有什么区别嘛？

1. 该函数在 page.js 中定义并导出，它需要返回一个对象数组，对象的键为动态路由的参数，值为参数的值。有几个对象就会生成几个路由。下面的例子在构建时就会生成三个版本的路由：`/product/1、/product/2、/product/3`。在每个路由组件中，都可以通过 `params` 参数获取到对应的参数。

```tsx
// app/product/[id]/page.tsx

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function Page({ params }) {
  const { id } = params;
  // ...
}
```

2. 在当前动态路由之前还存在动态路由时，可以为每个对象传入多个键值对。在下面的例子中，将会生成 `/products/a/1、/products/b/2、/products/c/3` 三个路由。

```tsx
// app/products/[category]/[product]/page.tsx

export function generateStaticParams() {
  return [
    { category: "a", product: "1" },
    { category: "b", product: "2" },
    { category: "c", product: "3" },
  ];
}

export default function Page({ params }) {
  const { category, product } = params;
  // ...
}
```

3. 当 URL 中存在多个动态路由且后者需要根据前者的参数生成时，可以使用`generateStaticParams` 函数的参数来访问前者的值。前者根据网络请求的结果来静态生成参数，后者根据前者的值静态生成参数。注意！后者对前者的每个值都生成一个数组，即最终后者的路由数量是 `前者的数量 * 后者的数量`。

```tsx
// 前者 app/products/[category]/layout.tsx
export async function generateStaticParams() {
  const products = await fetch("https://.../products").then((res) =>
    res.json()
  );

  return products.map((product) => ({
    category: product.category.slug,
  }));
}

export default function Layout({ params }) {
  // ...
}
```

```tsx
// 后者 app/products/[category]/[product]/page.tsx
export async function generateStaticParams({ params: { category } }) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json());

  return products.map((product) => ({
    product: product.id,
  }));
}

export default function Page({ params }) {
  // ...
}
```

#### 并行路由

#### 拦截路由

#### 路由处理方法

#### 私有文件夹

将 app 目录中的文件夹声明为 `_dirName` 时，这个文件夹不会被识别为路由，访问会返回 404。

有什么用？不想路由的文件夹放到 app 外边不行吗？

## 中间件

## 导航

四种导航方式

- `Link` 组件，推荐。
- `useRouter` 钩子（用于 pages router）
- `redirect` 函数（用于 app router）
- 原生的 History API

### link 组件

拓展了 `<a>` 元素，所以其使用方式为

- 导航到 /dashboard

```tsx
<Link href="/dashboard">Dashboard</Link>
```

- 注意嵌套路由中 link 组件的 href 也要写全路径，不可省略为 /a

```tsx
<Link href="/dashboard/a">Dashboard</Link>
```

- 使用模板字符串来实现动态路由

```tsx
<ul>
  {posts.map((post) => (
    <li key={post.id}>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
    </li>
  ))}
</ul>
```

- 可以使用 usePathname 来检查当前 link 的路由是否处于活跃状态，进而对 link 进行样式处理

```tsx
export function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <Link className={`${pathname === "/" ? "active" : ""}`} href="/">
        Home
      </Link>
    </nav>
  );
}
```

- 默认情况下，切换路由之后，页面会滚动到新路由的顶部。可以通过为 URL 中添加哈希 `#` 来实现滚动到指定特定元素。如下代码会滚动到 id 为 settings 的元素到视图顶部。

```tsx
<Link href="/dashboard#settings">Settings</Link>
```

- 也可以通过 Link 元素的 scroll 属性来禁用滚动。这样即使 URL 中有哈希，页面也不会滚动。当为 scroll 传递一个变量时，可以根据变量的值来决定是否允许滚动。

```tsx
<Link href="/dashboard#settings" scroll={false}>
```

- 通过 replace 属性来实现路由的替换。这样在导航时，不会在历史记录中添加新的路由。

```tsx
<Link href="/dashboard" replace>
```

### useRouter 钩子

以编程的方式更改客户端组件的路由。

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/dashboard")}>
      Dashboard
    </button>
  );
}
```

router 实例的方法：

- router.push(href: string, { scroll: boolean })
- router.replace(href: string, { scroll: boolean })
- router.refresh()
- router.back()
- router.forward()
- router.prefetch(href: string) 预请求路由

获取路由参数：

- 使用 usePathname 获取 pathname

```tsx
const pathname = usePathname();
```

- 使用 useSearchParams 获取 query

```tsx
const searchParams = useSearchParams();

const id = searchParams.get("id");

const hasId = searchParams.has("id");
```

::: tip
/dashboard?id=123 会获取到 id 的值为 123

/dashboard?id= 会获取到 id 的值为 ''

/dashboard 会获取到 id 的值为 null
:::

::: tip
searchParams 对象的方法和原生的 URLSearchParams 对象一样。所以还存在

- getAll
- keys
- values
- forEach
- entries
- toString
  等方法。

:::

### redirect 函数：

不懂，见文档 [redirect API](https://nextjs.org/docs/app/api-reference/functions/redirect)

::: tip
redirect 函数也可以指定一个重定向到程序外部的 URL。
:::

### History API

Next.js 允许您使用原生的 `window.history.pushState` 和 `window.history.replaceState` 方法来更新浏览器的历史记录堆栈，而无需重新加载页面。

只能用于客户端组件？？

猜测对，因为 window 对象是浏览器对象，所以只能在客户端组件中使用。

### 路由和导航的工作方式

1. 在服务器上，应用程序代码会自动按路由进行代码分割。这意味着导航时仅加载当前路由所需的代码。

2. 在客户端，Next.js 会 prefetch （预请求）可能的路由。这样有利于在导航时快速加载路由。

什么时候会预请求？

- 当 `<Link>` 组件在视口中可见时，会预请求其对应的路由。如页面首次加载或者通过滚动进入视口。可以将 `<Link` 组件的 `prefetch` 属性设置为 `false` 来禁用预请求。其默认值为 null。

- 执行到 `router.prefetch` 方法调用。

3. 缓存

Next.js 会将预请求的路由和访问过的路由缓存到内存中。这样在再次访问时，不需要再次加载。

# caching

Next.js 通过缓存 rendering work 和 data request 来提高性能。它提供的各种缓存机制都是默认开启的，所以不需要额外的配置。关闭它才需要。

## request memoization

Next.js extends the native fetch API to memoize requests that have the same URL and options. 这意味着可以在**组件树**的多个位置发起相同的请求，只会执行一次。

- 只能缓存 GET 方法的请求
- 请求缓存机制只在一次路由渲染中生效，在路由渲染完成后，请求缓存会被清除。这意味着请求缓存机制不是在整个项目中都生效。
- 组件树意味着：它适用于 `generateMetadata`, `generateStaticParams`, `Layouts`, `Pages`, and other `Server Components`。而不在 `Route Handlers` 生效，因为它不是 React 组件树的一部分。

## data caching

Next.js 有一个内置的数据缓存，并且拓展了原生的 fetch API 来控制请求的缓存行为。

这样，在默认情况下使用 fetch 请求的结果会被缓存。这样在再次请求时，如果存在缓存就不再发起请求了。

那他是如何命中缓存的呢？

靠 URL 和 参数吗？不知道

如何不使用缓存？

可以通过 `cache` 选项来控制缓存的行为。如 `fetch('xxx', { cache: 'no-store' })` 来不查看缓存，直接发起请求。

::: tip
在浏览器中，fetch 的 cache 选项指示请求如何与浏览器的 HTTP 缓存交互，在 Next.js 中，cache 选项指示 **服务器端** 的请求如何与服务器的数据缓存（Next.js 内置的数据缓存）交互。
:::

不会被缓存的情况：

- 在 Server Actions 中，请求不会被缓存。
- 在 Route Handlers 中使用的 POST 请求，不会被缓存。

如何重置缓存呢？即如何重新获取数据？

1. 基于时间的重新获取。

```js
// 单位是秒
fetch("https://...", { next: { revalidate: 3600 } });
```

超出 3600 秒之后的请求，会重新获取数据并缓存。

2. 按需获取

没看懂

与请求缓存机制共同工作：

- 请求被记住之后的下次请求的结果是从 data cache 中获取的，而不是重新请求。
- 无论是否设置了 `cache` 选项，都会记住请求。只是设置了 `cache: 'no-store'` 时，不会查找缓存。既然每次都会重新请求，为什么还要记住请求呢？
- 请求缓存机制和数据缓存机制是独立的。请求缓存机制只在一次路由渲染中生效，而数据缓存机制是在整个项目中生效的。

为什么要有请求记忆机制？直接有缓存就返回，没有缓存就请求不行吗？

# 优化

# 配置
