# Hooks

函数组件是一个返回 UI 的函数， 获取新 UI 时就要重新调用这个函数 。但函数每次执行其内部的变量都要重新初始化，所以函数组件本身是不能维护状态的。react 通过 hook 来为组件引入状态。

## useState

1. 为组件声明状态，状态变化时触发组件更新（重新调用组件函数，但状态的值不会被重新初始化）。
2. useState 声明的状态需要遵循不可变原则。即状态的值是不能更改的，状态的值需要变化时必须设置新值或新引用。因为 useState 对比前后值时，只会使用浅对比，如果新旧对象是同一个引用地址，状态的更新将不会触发组件的更新。

## useReducer

```tsx
function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return ++state;
      case "decrement":
        return --state;
    }
  };

  // state 即为状态 counter 的值；action 为 { type, payload }，
  // 在调用 dispatchCounter 时传入
  // reducer 的返回值会更新到状态 counter 中

  const [counter, dispatchCounter] = useReducer(reducer, 0);

  // 状态 counter 的值只能通过调用 disPatchCounter 来更新

  return (
    <>
      <h1>{counter}</h1>
      <button onClick={() => dispatchCounter({ type: "increment" })}>+</button>
      <button onClick={() => dispatchCounter({ type: "decrement" })}>-</button>
    </>
  );
}
```

1. 与 useState 相同是，都是为组件声明状态，遵循不可变原则，浅对比。
2. 与 useState 不同的是，useReducer 只能以固定的几种方式去更新状态的值。
3. 当一个状态需要一系列相关的操作时，优先使用 reducer，可以让状态的变化更加可控。

## useEffect

1. 组件渲染完成回调 callback；依赖项变化导致组件更新，重新 **渲染完成后** 回调 callback ；组件卸载之前回调 callback 返回的函数（如果有）。
2. callback 不能声明 async ，因为这样 callback 就会返回一个 Promise 对象。而 useEffect 需要 callback 返回一个函数或者 undefined (不返回值)。
3. 使用原则：依赖项一定要在 callback 中被用到。如果没用到就是不合理的。
4. useEffect 的 callback 是用于处理副作用，callback 返回的函数是用来清除副作用。如何理解？？什么是副作用？？ 副作用：组件渲染过程之外执行的操作，通常是与组件外部的交互。如网络请求、定时器、外部事件（窗口变化、鼠标事件）、DOM 操作。

## useMemo、memo、useCallback

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
const Child = memo((props) => {
  return <h2>child</h2>;
});
```

`memo` 对 props 进行的是浅比较。所以给 props 传递引用值时，可能还是会重新执行子组件。当引用值是用其它 hook 创建的状态时，引用地址不会变，不用担心；当引用值是个在父函数体中创建的对象时，则每次重新执行，对象的引用地址都会变化，此时在 `memo` 的子组件还是会重新执行。所以如果这个引用值是常量时，就把它声明到父组件函数的外面就好了；如果是个依赖父组件状态的话，可以使用 `useMemo` 来保证其不会更新，而如果是个函数的话，可以使用 useCallback，这是使用 useMemo 缓存函数定义的语法糖。

```js
const getName = useCallaback(() => name, []}

// 内部实现
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

::: tip

useMemo 可以用于组件更新时避免重新计算数据，useCallback 可以缓存函数定义。他们都可以单独使用，也可以配合 memo 使用。

:::

这几个 hook 都是用来做性能优化的，但性能优化本身也需要成本，如对比依赖是否变化。所以当计算比较简单时，重新计算就重新计算吧。

## useContext

可以使用 Context API 来向任意层级的子组件传递数据。每个层级都可拿数据，而不是只有一层能拿。如果只是子组件可以传递 props，但如果是子组件的子组件以及再往下，就要一层一层地传递 props 太麻烦，此时就可以使用 Context API。

```jsx
// 在组件外部创建 context
const CounterContext = createContext();

function Father() {
  const [count, setState] = useState(100);

  return;
  <CounterContext.Provider value={count}>
    <Child />
    <Sun />
  </CounterContext.Provider>;
}

// 可以使用 useContext 获取数据
function Child() {
  const count = useContext(CounterContext);
  return <h3>{count}</h3>;
}

// 也可以通过 <CounterContext.Consumer> 获取数据
function Sun() {
  return (
    <CounterContext.Consumer>
      {(count) => <h4>{count}</h4>}
    </CounterContext.Consumer>
  );
}
```

## useRef

- 对于非自定义组件，引用真实 DOM
- 对于自定义组件，引用自定义组件的实例，进而可以调用实例暴露出来的数据和函数。
- 创建一个状态，这个状态的变化不会引起组件的更新。

## useLayoutEffect

主线程执行同步代码 -> 主线程执行微任务 --`useLayoutEffect`--> GUI 渲染 --`useEffect`--> 主线程执行宏任务。

useLayoutEffect 是个微任务；useEffect 是个宏任务。

- uselayoutEffect 会在 GUI 渲染之前执行，所以其中不能执行耗时操作如网络请求，否则会阻塞 GUI 渲染。此时真实 DOM 已经构建完成，在这里操作 DOM 的话可以赶在 GUI 渲染之前完成 DOM 更新，如果在 useEffect 中操作 DOM 还要在执行一次 GUI 渲染。 所以在 useLayoutEffect 常结合 useRef 更改 DOM。
- useEffect 在 GUI 渲染之后可以处理耗时操作