## 基本概念

React 特点

- 数据驱动
- 虚拟DOM

### React 核心库

- react：react 的核心功能
- react-dom：如将 react 元素渲染为真实DOM
- react-native：如调起相机、相册等
- react-scripts：

### React 元素

```js
React.createElement('div', {}, "hello world");
```

使用 React 开发时不直接使用HTML元素 ，而是使用 `React.createElment()` 方法创建一个对象来表示HTML元素，称为React元素。

React 会将我们对 React 元素的操作以最小代价反映到真正的HTML文档结构上去。（diff算法）

#### 根节点

React 需要一个节点来 “放置” 其生成的内容。

一般在 HTML 文件中，定义有

```html
<body>
  <div id="root"></div>
</body>
```

使用 `ReactDOM.createRoot()` 方法指定根节点，返回一个xx对象；

使用`xx.render()`方法，将一个 React 元素渲染为真实DOM节点，并挂载到根节点下。

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement('div', {}, "hello world");
```

`React.createElement` 方法中，参数一为元素名称；参数二为对象，表示其属性；参数三为元素内容。

#### JSX

一种表达式。（表达式：返回一个值的式子）

当需要描述的页面越复杂时，表示UI的元素之间的嵌套关系也越复杂，这也就是为什么我们在开发时不直接使用 DOM API 创建节点，而是使用 HTML。React 元素也是这样，在实际开发中并不常使用`React.createElement`去创建节点，而是使用 JSX 来表示 React 元素。

```jsx
// jsx
<div className="title">hello world</div>

// react 元素
React.createElement('div', { className: "title" }, "hello world");
```

React 并没有提供解析 JSX 的能力，需要使用 babel 及其 JSX 插件来将 JSX 转换为 `React.createElement()` 的函数调用，react-dom 再将其转换为真实DOM节点。

所以之前将初始化 React 项目代码也可以写为：

```jsx
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div>hello world</div>);
```

HTML元素上定义的属性是 `-`连接符式写法，如 `background-color`；但在DOM API 中，节点的属性在该节点对象的 style 对象上，其属性名使用了驼峰写法，如 `backgroundColor`，特殊的有 `className` 表示类名，因为 `class` 为关键字。

在 `React.createElement()` 创建 React 元素时，同样使用对象结构来表示HTML元素的属性，属性名也同样使用了驼峰写法。但在 JSX 中并没有使用 `-`连接符式写法，而是继续沿用了驼峰写法。

在 JSX 中使用中括号 `{}` ，来表示变量：

```jsx
<div className={title}>
  { greeting }
</div>
```

JSX 中的属性值，除了字符串之外，都需要用中括号包裹。

```jsx
<div defaultValue="123"></div>
<div defaultValue={123}"></div>
<div defaultValue={false}"></div>
                      
<div onClikc={ handleClick }"></div>
```

额外的：

在 vue 中也使用了虚拟DOM，所以类似的：

Vue：模版template语法 ----vue-compiler-sfc-----> `h()`函数调用

React：JSX语法 ----babel-----> `React.createElement()` 函数调用

注：vue也可以使用 jsx语法，即 jsx 语法 -----babel---> `h()`函数调用。

Babel

Babel 是一个JS编译器，常用于将高版本的 JS 代码如 ES6+ 转换为 ES5，以适配低版本的浏览器。

编译器：对代码进行某种处理的工具

- 将一种编程语言转换为另一种编程语言
- 对代码进行某种处理，输出同一种编程语言（如 babel）

Babel 通过插件机制，来实现自定义的代码处理。

babel 的一种工作方式：

- 前置知识：浏览器只会识别 type 值为 `text/javascript`（默认） 、`module` 的 `script` 元素；其它类型的 `script` 元素会被忽略。
- 监听 `document.contentLoad` 事件（表示当前文档所有元素加载完成）
- 通过 `document.getElementsBytagName` 拿到所有的 `script` 元素，并筛选，如果 type 值为 `text/babel` 则读取其中的 JS 代码，通过自身的 transform 方法进行转换，之后在文档中新建一个 type 值为 `text/javascript` 的 `script` 元素，将结果放进入。这样浏览器便会执行转换后的代码了。

### 使用脚手架开发

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

项目中生成的 *reportWebVitals.js* 文件是用来获取网站性能指标的，如 fcp、lcp 的。国内项目一般不用，直接删掉。

### 组件

#### 什么是组件

组件名的首字母必须大写。因为 React 会将首字母小写的标签视为原生HTML，而大写的视为组件处理

```jsx
// 定义
function MyButton() {}

// 使用
<MyButton />
```

必须有返回值且返回 React 元素、null、可以被迭代的对象（Array/Map/Set等）。

```jsx
function MyButton() {
  return (
    <div>hello world</div>
  )
}
```

#### 组件中的状态

```jsx
function Counter() {
  let count = 0;
  const increase = () => {
    count++;
  }
  const decrease = () => {
    count--;
  }
  return (
    <div>
      <button onClick={ increase }>+</button>
      <button onClick={ decrease }>-</button>
      <h3>{count}</h3>
    </div>
  );
}
```

使用组件相当于函数调用

```jsx
// 这两种方法是等效的，都是 JSX
React.render( <Counter /> );
React.render( { Counter() } );
```

而函数调用的结果就是返回定义的可渲染内容。

渲染页面时，babel 将其转换为函数调用 `React.createlement("h3", {}, const)` ，既然是函数调用，肯定要参数取值（count的初始值为0），这样函数调用的结果---该React元素对象中内容就是0；

另外两个按钮：`React.createlement("h3", { onClick: increase }, '+')`，这里 `increase/decrease` 形成了闭包，所以**该组件渲染完成后**点击按钮时，变量 count 的值会发生变化，但不会影响视图。

？？？

所以当我们需要变量 count 变化时，视图也随之响应式变化，只能重新调用 `Counter` 函数，返回 count 为新值时的视图。即 UI 等于组件在某一时刻其状态的表现。

那如何让组件做到响应式变化（如何在数据变化时重新调用函数呢）？

使用 `useState`

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const increase = () => {
    setCount((prev) => prev + 1);
  };
  const decrease = () => {
    setCount((prev) => prev - 1);
  };
  return (
    <div>
      {/**/}
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <h3>{count}</h3>
    </div>
  );
}
```

当调用 `setCount` 函数时，`Counter` 函数就会被重新调用一次。

如何做到在 setCount 函数中，调用 Counter 函数？

重新调用 Counter 函数后，如何影响视图？

组件的重新渲染就是重新调用函数？

？？？

使用 `useState()` 的注意事项

- 状态的变化是异步的。调用 `setCount()` 后，接着打印 count 的值，仍是之前的值。

  - 那如何同步地获取最新的值呢？`useEffect/useLayoutEffect`

- `useState()` 的参数可以是一个值，也可以是一个函数。（将函数的返回值作为初始状态值）

- 组件的重新渲染就是重新调用组件函数， `useState()` 方法也会被重新调用，但其只有在第一次调用时状态才会被赋值为初始值，之后再次调用不会被重新赋值为初始值。

  - 如在上面的计数器案例中，第一次调用 `useState()` 时状态 count 被初始化为0，点击加号按钮，count 的值变为 1，组件函数被重新调用，但再次调用 `useState()` 方法时，状态 count 不会被再次初始化为0，而是保持其现有的值1 （ `useState()` 方法内部在第一次初始化一个状态后就会产生标记，再次对同一个状态调 `useState()` 方法时，该状态不会被重新赋值），这样组件函数返回的可渲染内容中 count 取值就是 1了。
  - 尽量不要将函数作为 `useState()` 方法的参数，因为每次重新调用 `useState()` 也意味着重新执行该函数参数，但状态又不会被重新赋值，函数的执行就是没有意义的执行。

- `setCount()` 方法可以传一个值，也可以传一个函数，函数的第一个参数被赋值为该状态当前的值。

  - `setCount(count + 1)` 或 `setCount(prev => prev + 1)`

  - 这两种写法有什么区别？

    ```jsx
    // 之前说过状态的变化是异步的，那函数 increase1 中第二次调用 setCount 时，count 的值还是 0；也就是说虽然执行了两次 setCount，但效果和执行一次没区别。
    function increase1() {
      setCount(count + 1);
      setCount(count + 1);
    }
    
    // 函数的第一个参数为状态最新的值
    function increase2() {
      setCount(prev => prev + 11);
      setCount(prev => prev + 1);
    }
    ```

  - 所以将状态设置为固定值时，可以使用第一种写法；但更多时候都是在原有状态值的基础上变化，可以使用第二种写法

- 状态的更新是异步的，这也意味着在同步代码执行完成前，可能有多次改变同一个状态的 `setState()` 。此时，并不会改变一次状态就重新渲染一次组件，而是在最后使用状态最终的变化值去渲染一次组件。

使用 `useState()` 声明的状态的值为 null、undefined、false ，并且该状态是元素的内容时，React 不会在页面上渲染出来。

```jsx
<span>{ value }</span>
```

父组件重新渲染（父组件函数重新调用）时，所有的自组件都会重新渲染（组件函数重新被执行）。

#### 函数组件的参数

组件函数的第一个参数会被赋值为一个对象，包含了传递给组件的属性键值对。

既然传递给了自组件，那自组件中肯定得用，如何做到属性值变化时，组件中的值也随之变化？

由于父组件重新渲染（父组件函数重新调用）时，所有的子组件都会重新渲染（组件函数重新被执行），所以就需要在父组件中将属性值使用 `useState()` 定义为一个状态，这样才能在变化时重新执行父组件函数，进而。。。

#### React的事件机制

#### 受控元素与非受控元素

只有表单元素才有受控与非受控的概念。

如何判断一个表单元素是受控元素还是非受控元素？

React 将决定该表单的值的属性设置为其受控元素属性，设置了该属性就是受控元素，没有设置就是非受控元素。如：

- `input` 元素的 `value` 属性；
- `checkbox` 的 `checked` 属性；
- 等等

受控元素与非受控元素的区别是什么？

该表单的值受用户控制还是受开发者控制。

以`input` 元素为例，React 将其 `value` 属性设置为受控元素属性。。

在没有设置 `value` 属性时，`input` 元素的表现同普通HTML文档中 `input` 元素一样。

- 此时可以使用 `defaultValue` 为其设置初始值。

在设置 `value` 之后，无论在表单元素输入什么都不会被展示出来。该表单展示的值，完全由 `value` 属性绑定的状态的值决定。

- 我输入 `hello` ，会触发5次 `onChange` 事件，每次都打印出对应的字母，而不是触发1次，打印 `hello`。这是因为用户每次输入值也会改变该元素 value 的值，触发 onChange 事件，但随之 value 的值回退到原来的值，所以表单元素不会展示输入的值。

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

### hooks

#### useState

使用 useState 定义状态时，必须定义在组件的顶层作用域中或自定义 Hook 中。在函数组件中，顶层作用域就是该函数的作用域，而不能定义在函数组件之外，或函数组件中定义的子作用域中，如 if 语句，否则会报错。

使用 useState 定义状态时，如果值为一个函数，这个函数必须是一个没有参数的纯函数。（纯函数，相同的输入必有相同的输出）

React 中的状态遵循不可变原则，使用 useState 定义状态时，即使值是一个引用值如对象，通过 set function 改变该状态的值时，必须设置一个新的引用值，否则状态不会更新。

```js
  setObj((prev) => {                        // ❌
    prev.a = 3;
    return prev;
  });

  setObj((prev) => ({ ...prev, a: 3 }));    // ✅
```

#### useEffect

用于处理副作用的 hook。

不依赖 React 功能的操作，但操作结果的处理影响到了组件的渲染。这种操作称为副作用。

常见：大部分异步操作，如网络请求，DOM操作

官方建议尽可能地将副作用放在 useEffect 中执行，因为副作用可能会产生意料之外的结果，如果我们想更好地 去追踪副作用的执行时机，就可以将副作用归纳到 useEffect 中，方便追踪。？？？这是什么意思？怎么处理？吧网络请求的函数放在 setup 函数中执行？

useEffect 的参数

```react
useEffect(setup, dependence?)
```

- 第一个参数为一个函数
- 第二个参数为一个数组，数组项为 useState 定义的状态。

useEffect 的执行

- 组件每次**渲染完成**后（包括第一次），都会执行一次 useEffect 中的 setup 函数
- 当 dependence 数组中的任意一项发生变更时，setup 会执行一次

setup 函数的执行都是异步的。

使用 set function 为状态定义新值后，组件重新渲染，setup 会执行一次，那状态变了，setup 函数会不会再执行一次？

setup 函数中可以返回一个函数，该函数会在组件被取消挂载前执行，可以用于清除数据。如

- 取消组件在执行时为 window 绑定的事件
- 取消组件在执行时设置的定时器

#### 尝试自定义 hook

Hour: 3

### 函数式组件

组件名必须以大写开头，如 MyButton

- React 会将大写开头的识别为自定义组件，小写开头的识别为原有 HTML 元素

1. 组件必须且只能返回一个 JSX 元素，如果不想在最外层包裹一个 div，可以使用 <></> （因为每个JSX元素都是一个对象，而 return 语句只能接受一个值）
2. 想要在 JSX 语句中渲染组件中变量的值时，需要使用大括号包裹，如 `{value}`
3. 可以使用 `<MyButton />` 来调用组件
4. 可以在调用组件时为其定义自定义属性，所有属性成为一个对象作为函数组件的参数，如 `<MyButton value="确认" /> => function MyButton({ value })`。父子组件的交互都是通过这种方式实现的。
5. 调用组件将会从头到尾执行这个函数，最终返回 JSX。JSX 中的变量也会被取值作用于 JSX 中。即每次组件调用都会返回一块 UI。
6. 组件在调用时，其包含的自组件也会被重新调用。
7. JSX 不会渲染 null ，如 `<h1>{null}</h1>`，检查浏览器存在H1这个元素，但不会将 null 作为文本值显示出来。

### Hooks

const [value, setValue] = useState(0)

为组件定义一个状态。

调用 set function 可以改变状态的值，并通知组件重新渲染，即重新执行函数组件。

组件重新执行，但状态不会被重新初始化。所以才能做到：改变状态的值->重新调用组件函数->根据新值渲染组件。

React 中的状态遵循不可变原则，如即使状态为引用类型，set function 更新状态的值时也要赋值一个新的引用类型。

为什么要遵循不可变性？

1. 为了记录状态变化。如果有需求为回退用户的操作，我们可以将每次状态的变化保存到一个数组中，如果引用类型不遵循不可变原则，那每次保存的都是同一个对象。这样最终拿到的数组中的每一项的值都相同
2. ？？

决定数据是否定义为状态的原则

- 可以从其它状态计算取值的数据不定义为状态
- 数据变化不影响本组件渲染的数据不定义为状态。如 A 组件中包含 B、C，B中的数据变化影响 C，可以在 A 中定义状态，B 中的变化传递到A进而影响C

### Hooks

函数组件是一个返回 UI 的函数， 获取新 UI 时就要重新调用这个函数 。但函数每次执行其内部的变量都要重新初始化，所以函数组件本身是不能维护状态的。

通过 hook 来为组件创建状态、管理状态等？？？？

- useState：创建状态
- useReducer ：创建状态
- useEffect： 处理、清除副作用
- useContext：跨组件获取数据
- useMemo：缓存数据
- useCallback：缓存方法
- useRef：创建状态，获取节点实例

useState

```tsx
const [state, setState] = useState(initValue);

// state 是只读的，只能通过 setState 更新
```

1. 为组件声明状态，状态变化时触发组件更新（重新调用组件函数，但状态的值不会被重新初始化）。
2. useState 声明的状态需要遵循不可变原则。即状态的值是不能更改的，状态的值需要变化时必须设置新值或新引用。因为 useState 对比前后值时，只会使用浅对比，如果新旧对象是同一个引用地址，状态的更新将不会触发组件的更新。

useReducer

```tsx
function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'increment':
        return ++state;
      case 'decrement':
        return --state
    }
  }
  
  // state 即为状态 counter 的值；action 为 { type, payload }，
  // 在调用 dispatchCounter 时传入
  // reducer 的返回值会更新到状态 counter 中

  const [counter, dispatchCounter] = useReducer(reducer, 0);
  
  // 状态 counter 的值只能通过调用 disPatchCounter 来更新

  return (
    <>
      <h1>{counter}</h1>
      <button onClick={() => dispatchCounter({type: 'increment'})}>+</button>
      <button onClick={() => dispatchCounter({type: 'decrement'})}>-</button>
    </>
  )
}
```

1. 与 useState 相同是，都是为组件声明状态，遵循不可变原则，浅对比。
2. 与 useState 不同的是，可以以任何方式去获取新的值，只要通过 setState 更新就行。useReducer 相当于把获取新值的方式固定下来，只能以提前声明的几种方式去获取新值。
3. 当一个状态需要一系列相关操作时，优先使用 reducer

useEffect

```tsx
useEffect(() => {}, [])

// 数组中可以声明任意个依赖项，也可以一个都不声明
```

1. 组件挂载完成回调 callback；依赖项变化导致组件更新，重新 **渲染完成后** 回调 callback ；组件卸载之前回调 callback 返回的函数（如果有）。
2. callback 不能声明 async ，因为这样 callback 就会返回一个 Promise 对象。而 useEffect 需要 callback 返回一个函数或者 undefined (不返回值)。
3. 使用原则：依赖项一定要在 callback 中被用到。如果没用到就是不合理的。
4. useEffect 的 callback 是用于处理副作用，callback 返回的函数是用来清除副作用。如何理解？？什么是副作用？？ 副作用：组件渲染过程之外执行的操作，通常是与组件外部的交互。如网络请求、定时器、外部事件（窗口变化、鼠标事件）、DOM 操作。

useMemo、memo、useCallback

函数组件中任何状态的变化都会引起组件的更新，即函数的重新执行。虽然 React 会将函数执行之后返回的 JSX 转为虚拟 DOM 进行新旧对比，尽量少地更新真实 DOM。

- 但是函数体却实实在在地重新执行了一遍，函数体中不依赖这个状态的计算不就白执行了一次吗？
- 而且所有子组件也都会重新执行一遍，如果不依赖这个状态的组件也重新执行了一遍，那不白执行了吗？

在函数组件中，使用 `useMemo` 保存依赖状态的计算。在函数组件重新执行时，如果 `useMemo` 依赖的状态没有发生变化，则不会重新计算。


```tsx
function App() {

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  // counter2 更新时，counterData 不会重新计算。
  const counterData = useMemo(() => ({counter1}), [counter1]);

  return (...)
}
```

定义子组件时，使用 `memo` 将函数组件包裹起来。当父组件更新时，如果传给子组件的 props 没有更新，则子组件不会重新执行，直接返回上次执行结果。

```tsx
const Child = memo((props) => { return <h2>child</h2> })
```

`memo` 对 props 进行的是浅比较。所以给 props 传递引用值时，可能还是会重新执行子组件。当引用值是用其它 hook 创建的状态时，引用地址不会变，不用担心；当引用值是个在父函数体中创建的对象时，则每次重新执行，对象的引用地址都会变化，此时在 `memo` 的子组件还是会重新执行。所以如果这个引用值是常量时，就把它声明到父组件函数的外面就好了；如果是个依赖父组件状态的话，可以使用 `useMemo` 来保证其不会更新，而如果是个函数的话，可以使用 useCallback，这是使用 useMemo 缓存函数定义的简写。

```js
const getName = useCallaback(() => name, []}

const getName2 = useMemo(() => (() => name), [])
```

::: tip

useMemo 可以用于组件更新时避免重新计算数据，useCallback 可以缓存函数定义。他们都可以单独使用，也可以配合 memo 使用。

:::

下一节源码的时候再区分 useMemo 和 useCallback

这几个 hook 都是用来做性能优化的，但性能优化本身也需要成本，如对比依赖是否变化。所以当计算比较简单时，重新计算就重新计算吧，只有当性能优化引起注意时，再去使用。

useContext

可以使用 Context API 来向任意层级的子组件传递数据。每个层级都可拿数据，而不是只有一层能拿。如果只是子组件可以传递 props，但如果是子组件的子组件以及再往下，就要一层一层地传递 props 太麻烦，此时就可以使用 Context API。

```jsx
// 在组件外部创建 context
const CounterContext = createContext();

function Father() {
  const [count, setState] = useState(100)

  return 
    <CounterContext.Provider value={count}>
      <Child/>
      <Sun/>
    </CounterContext.Provider>
}

// 可以使用 useContext 获取数据
function Child() {
  const count = useContext(CounterContext)
  return <h3>{count}</h3>
}

// 也可以通过 <CounterContext.Consumer> 获取数据
function Sun() {
  return <CounterContext.Consumer>
    {
      (count) => (<h4>{count}</h4>)
    }
  </CounterContext.Consumer>
}
```

useRef

- 对于非自定义组件，引用真实 DOM
- 对于自定义组件，引用自定义组件的实例，进而可以调用实例暴露出来的数据和函数。
- 创建一个状态，这个状态的变化不会引起组件的更新。

useLayoutEffect

主线程执行同步代码 -> 主线程执行微任务 --`useLayoutEffect`--> GUI 渲染 --`useEffect`--> 主线程执行宏任务。

useLayoutEffect 是个微任务；useEffect 是个宏任务。

- uselayoutEffect 会在 GUI 渲染之前执行，所以其中不能执行耗时操作如网络请求，否则会阻塞 GUI 渲染。此时真实 DOM 已经构建完成，在这里操作 DOM 的话可以赶在 GUI 渲染之前完成 DOM 更新，如果在 useEffect 中操作 DOM 还要在执行一次 GUI 渲染。 所以在 useLayoutEffect 常结合 useRef 更改 DOM。
- useEffect 可以处理耗时操作