# React 基础

## 基本概念

### React 核心库

- react：react 的核心功能
- react-dom：如将 react 元素渲染为真实 DOM
- react-native：如调起相机、相册等
- react-scripts：

### React 元素

```js
React.createElement("div", {}, "hello world");
```

使用 React 开发时不直接使用 HTML 元素 ，而是使用 `React.createElment()` 方法创建一个对象来表示 HTML 元素，称为 React 元素。

React 会将我们对 React 元素的操作以最小代价反映到真正的 HTML 文档结构上去。（diff 算法）

### 根节点

React 需要一个节点来 “放置” 其生成的内容。

一般在 HTML 文件中，定义有

```html
<body>
  <div id="root"></div>
</body>
```

使用 `ReactDOM.createRoot()` 方法指定根节点，返回一个 xx 对象；

使用`xx.render()`方法，将一个 React 元素渲染为真实 DOM 节点，并挂载到根节点下。

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement('div', {}, "hello world");
```

`React.createElement` 方法中，参数一为元素名称；参数二为对象，表示其属性；参数三为元素内容。

### JSX

一种表达式。（表达式：返回一个值的式子）

当需要描述的页面越复杂时，表示 UI 的元素之间的嵌套关系也越复杂，这也就是为什么我们在开发时不直接使用 DOM API 创建节点，而是使用 HTML。React 元素也是这样，在实际开发中并不常使用`React.createElement`去创建节点，而是使用 JSX 来表示 React 元素。

```jsx
// jsx
<div className="title">hello world</div>;

// react 元素
React.createElement("div", { className: "title" }, "hello world");
```

React 并没有提供解析 JSX 的能力，需要使用 babel 及其 JSX 插件来将 JSX 转换为 `React.createElement()` 的函数调用，react-dom 再将其转换为真实 DOM 节点。

所以之前将初始化 React 项目代码也可以写为：

```jsx
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<div>hello world</div>);
```

HTML 元素上定义的属性是 `-`连接符式写法，如 `background-color`；但在 DOM API 中，节点的属性在该节点对象的 style 对象上，其属性名使用了驼峰写法，如 `backgroundColor`，特殊的有 `className` 表示类名，因为 `class` 为关键字。

在 `React.createElement()` 创建 React 元素时，同样使用对象结构来表示 HTML 元素的属性，属性名也同样使用了驼峰写法。但在 JSX 中并没有使用 `-`连接符式写法，而是继续沿用了驼峰写法。

在 JSX 中使用中括号 `{}` ，来表示变量：

```jsx
<div className={title}>{greeting}</div>
```

JSX 中的属性值，除了字符串之外，都需要用中括号包裹。

```jsx
<div defaultValue="123"></div>
<div defaultValue={123}"></div>
<div defaultValue={false}"></div>

<div onClikc={ handleClick }"></div>
```

额外的：

```
在 vue 中也使用了虚拟DOM，所以类似的：

Vue：模版template语法 ----vue-compiler-sfc-----> `h()`函数调用

React：JSX语法 ----babel-----> `React.createElement()` 函数调用

注：vue也可以使用 jsx语法，即 jsx 语法 -----babel---> `h()`函数调用。
```

### Babel

Babel 是一个 JS 编译器，常用于将高版本的 JS 代码如 ES6+ 转换为 ES5，以适配低版本的浏览器。

编译器：对代码进行某种处理的工具

- 将一种编程语言转换为另一种编程语言
- 对代码进行某种处理，输出同一种编程语言（如 babel）

Babel 通过插件机制，来实现自定义的代码处理。

babel 的一种工作方式：

- 前置知识：浏览器只会识别 type 值为 `text/javascript`（默认） 、`module` 的 `script` 元素；其它类型的 `script` 元素会被忽略。
- 监听 `document.contentLoad` 事件（表示当前文档所有元素加载完成）
- 通过 `document.getElementsBytagName` 拿到所有的 `script` 元素，并筛选，如果 type 值为 `text/babel` 则读取其中的 JS 代码，通过自身的 transform 方法进行转换，之后在文档中新建一个 type 值为 `text/javascript` 的 `script` 元素，将结果放进入。这样浏览器便会执行转换后的代码了。

## 使用脚手架开发

脚手架：

提供了一系列项目所需的预设内容，方便开发者专注于自身业务代码。

- 如代码打包压缩需要使用 webpack、vite 工具
- 代码检查、格式化需要 ESLint 、Prettier 工具
- Git 、.gitignore 工具
- 代码转换需要的 babel、postcss 工具
- 项目的目录结构一般也是固定的

脚手架将这些项目需要的预设内容根据开发者的需要，自动组合生成代码，个性化的配置也只需要开发者做出少量变动。让开发者可以以最小的成本开始开发业务代码。

npx

npx 是 npm 附带的工具。

执行 npx 命令时：`npx create-react-app my-app`

- 首先会检查第一个参数对应的工具有没有被安装，

  - 有则继续；
  - 没有则临时安装。（安装到内存中，使用完成后会被自动清理）

- 执行 npx 后面的 `create-react-app my-app` 命令

create-react-app

只生成了项目结构 + git + babel + 挂载根组件

项目中生成的 _reportWebVitals.js_ 文件是用来获取网站性能指标的，如 fcp、lcp 的。国内项目一般不用，直接删掉。

## 组件

### 函数式组件

组件名必须以大写开头，如 MyButton

1. React 会将大写开头的识别为自定义组件，小写开头的识别为原有 HTML 元素

2. 组件必须且只能返回一个 JSX 元素、null、可迭代对象，如果不想在最外层包裹一个 div，可以使用 <></> （因为每个 JSX 元素都是一个对象，而 return 语句只能接受一个值）
3. 想要在 JSX 语句中渲染组件中变量的值时，需要使用大括号包裹，如 `{value}`
4. 可以使用 `<MyButton />` 来调用组件
5. 可以在调用组件时为其定义自定义属性，所有属性成为一个对象作为函数组件的参数，如 `<MyButton value="确认" /> => function MyButton({ value })`。父子组件的交互都是通过这种方式实现的。
6. 调用组件将会从头到尾执行这个函数，最终返回 JSX。JSX 中的变量也会被取值作用于 JSX 中。即每次组件调用都会返回一块 UI。
7. 组件在调用时，其包含的子组件函数也会重新执行。
8. JSX 不会渲染 null ，如 `<h1>{null}</h1>`，检查浏览器存在 H1 这个元素，但不会将 null 作为文本值显示出来。

### 函数组件的参数

```jsx
const myApp = ({ children, ...rest }) => {};
```

组件函数的参数是一个对象，包含了传递给组件的属性键值对，以及该组件的子元素（赋值到 children）。

## 受控元素与非受控元素

只有表单元素才有受控与非受控的概念。

如何判断一个表单元素是受控元素还是非受控元素？

React 将决定该表单的值的属性设置为其受控元素属性，设置了该属性就是受控元素，没有设置就是非受控元素。如：

- `input` 元素的 `value` 属性；
- `checkbox` 的 `checked` 属性；
- 等等

受控元素与非受控元素的区别是什么？

该表单的值受用户控制还是受开发者控制。

以`input` 元素为例，React 将其 `value` 属性设置为受控元素属性。。

在没有设置 `value` 属性时，`input` 元素的表现同普通 HTML 文档中 `input` 元素一样。

- 此时可以使用 `defaultValue` 为其设置初始值。

在设置 `value` 之后，无论在表单元素输入什么都不会被展示出来。该表单展示的值，完全由 `value` 属性绑定的状态的值决定。

- 我输入 `hello` ，会触发 5 次 `onChange` 事件，每次都打印出对应的字母，而不是触发 1 次，打印 `hello`。这是因为用户每次输入值也会改变该元素 value 的值，触发 onChange 事件，但随之 value 的值回退到原来的值，所以表单元素不会展示输入的值。

==这不懂，value 的值会回退？？？==

受控组件有什么用？

- 清空表单内容

那受控的 input 元素不就没法让用户输入内容了吗？如何让受控组件也能手动输入内容呢？

```jsx
function App() {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></input>
    </div>
  );
}
```

## Children API

可以使用 props.children 访问传入组件的内容。当没有传递时，其值为 undefined; 当传递一个 JSX 元素时，其值为一个 JSX 对象; 当传递多个 JSX 元素时，其值为数组。Children API 提供了一系列方法来操作这些内容。

- React.Children.count(children)：返回 children 中的元素个数。
- React.children.map(children, (child, index) => {}, thisArg?)：遍历 children 中的每一个元素
- React.Children.forEach(children, (child, index) => {}, thisArg?)：遍历 children 中的每一个元素
- React.Children.only(children)： 前面说过 children 的值可能是 undefined、JSX 对象、数组。这个方法判断 children 如果只有一个元素，返回该元素，否则抛出错误。也就是 children 只有一个元素的断言。
- React.Children.toArray(children)：返回一个新数组。
  - 如果不是数组，就将 children 转换为数组。
  - 新数组会将 children 中的 null、undefined、布尔值 过滤掉。
  - 如果 children 是个多层数组，会对 children 进行扁平化处理。
  - React 的设计理念之一就是要求组件的状态和 props 都是不可变的，所以通过 props.children 拿到的数组经过了处理，使其成为一个不可变对象。这也意味着任何改变 props.children 数组的方法都是不可行的，会报错。包括：push、pop、shift、unShift、splice、sort、reverse 等。而 Children.toArray() 方法返回的数组是一个新数组，可以对其进行任何操作，不会影响到原来的 props.children。

为什么要用 Children API 提供的 count、map、every 方法，而不直接使用 children.length 和数组的方法？

因为除了 Children.only 方法外：

第一：每个 Children API 都会自动处理在三种可能的值下的计算，如果要自己写就要自己加判断。如 Children.count 方法在值为 undefined 时返回 0，值为一个 JSX 对象时返回 1；every、map 方法在值为 undefined 时不会报错而是返回 undefined（对于 map 方法），值为一个对象时先将其转为数组再处理；toArray 方法会将值为 undefined 的情况转换为一个空数组。值为一个对象时返回一个数组。

第二：每个 Children API 都会对 children 中的嵌套数组进行扁平化处理。如 Children.count 方法计算的是扁平化后的数组的长度，这就跟 children.length 可能不一样了。同理 Children.every 和 Children.map 遍历的数组也是扁平化后的数组，与 Array.every 和 Array.map 方法不同；toArray 方法返回的也是扁平化后的数组。

第三：React 的设计理念之一就是要求组件的状态和 props 都是不可变的，所以通过 props.children 拿到的数组经过了处理，使其成为一个不可变对象。这也意味着任何改变 props.children 数组的方法都是不可行的，会报错。我们需要先将 children 使用 Children.toArray 方法转换为一个新数组，然后再对其进行操作。

React 官方并不建议使用 Children API， 他们给出了两种替代方案：

- 把对 children 的修改封装成一个组件，手动包装 children 的每一项。但这种方式无法在 children 为动态内容时使用。
- 通过 props 为组件传递一个配置对象，在组件内部根据配置对象渲染内容，解决了动态内容的问题。

这两种方式都不如 Children API 来的直观。

## 渲染

1. 每次渲染都有自己的 prop 和 state

组件更新=函数重新执行。所以组件内的每个变量和函数都会重新创建并初始化。只是 useState 声明的状态的值通过闭包机制存在了函数组件外部，但这是状态的值被保留。状态这个变量本身还是被重新创建。而且 state 也需要遵循不可变性，所以值也是新的。

所以说每次渲染时，prop/state/函数/依赖状态的变量都是新的，都是不同的。

// 第二版

因为 state 需要遵循不可变原则，所以每次渲染时，state 的值都是新的，都是不同的。

2. 每次渲染都有自己的事件处理函数

在函数组件执行完之后，事件处理函数不会被销毁。处理函数及其访问的状态就形成闭包。

```js
function Counter() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert("You clicked on: " + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
}
```

在这个例子中，我先点击 3 次 `Click me` 按钮，然后点击 `Show alert` 按钮。在 3 秒之内再点击两次 `Click me` 按钮。这时弹出的 alert 会显示 3，而不是 5。这就是因为点击 ""Show alert" 按钮时，count 为 3。这个 count 变量和 setTimeout 函数形成了闭包，所以在 3 秒之后，count 仍然是 3。

所以说，每次渲染都有自己的事件处理函数。

3. 每次渲染都有自己的 Effect

props/state 更新 => 函数组件重新执行 => 渲染新 UI（真实 DOM） => useEffect 执行.

每次组件函数执行时，useEffect 也会重新注册新的回调。在组件函数执行完成之后，回调函数也是一个闭包，所以真实 DOM 渲染完成之后的 useEffect 回调中的状态是此次渲染的，新的状态值。

useState 和 useRef 的不同：

setState 每次都要求新的值，包括引用类型。这就导致每次函数执行时，状态变量是新的，值也是新的。

useRef 将值保存在了对象的 current 中。更新值也是更新 current 的值，而不是 useRef 状态的值。所以每次函数执行时，useRef 的值是不变的。

```js
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
    console.log("current", count, latestCount.current);
    setTimeout(() => {
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

在 3 秒之内点击 5 次，出现 "current 1"、“current 2”、“current 3”、“current 4”、“current 5"，3 秒之后弹出 "You clicked 5 times"。

为什么？

因为每次点击之后，useEffect 回调就是一个闭包，所以 “current” 值是本次更新后的值。setTimeout 再次形成了闭包，但 latestCount.current 的值是一个不变的引用类型，所以在 3 秒之后，latestCount.current 的值是最后一次点击的值。

为什么要求 state 的值是不可变的？

如果是可变的，那引用类型的 state 不就变成 useRef 的效果了吗？

4. 总之，每次渲染都有自己的一切。即组件的一切东西在每次渲染时都是不同的。