# React 结合 TS

需要安装 `@types/react`，它包含了 React 的类型声明文件；`@types/react-dom` 包含了 React DOM 的类型声明文件。

分别包含什么，举例说明！！！

## JSX 的类型

```tsx
const a = <h1>hello</h1>;
```

声明一个 JSX 元素，它的推导类型是 `JSX.Element`。

而 `JSX.Element` 继承自 `React.ReactElement`，声明这两种类型都能表示 JSX 元素。

但是不能表示 null 或 undefined，所以我们通常使用 `React.ReactNode` 来表示 JSX 元素、null 或 undefined。

![ReactNode的类型声明](../../public/framework/react-node.png)

## 函数组件的类型

```tsx
import { FC } from "react";

interface IProps {
  name: string;
}

const App: FC<IProps> = ({ name }) => {
  return <h1>{name}</h1>;
};
```

在使用箭头函数时，我们可以使用 `FC` 类型来声明函数组件的类型。并通过范型来传递组件的 props 类型。

当通过函数参数中的 children 访问组件的子元素时，我们可以使用 `ReactNode` 类型来声明。

```tsx
interface IProps {
  name: string;
  children: ReactNode;
}
```

## hook 的类型

hook 的类型通常使用范型来传递参数类型。

```tsx
const [count, setCount] = useState<number>(0);
```

当使用 useRef 保存 DOM 引用时，可以使用类似 `HTMLDivElement` 这样的类型来声明。

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const divRef = useRef<HTMLDivElement>(null);
```

当使用 useRef 保存 DOM 引用时，必须使用 null 来初始化，否则会报错。但保存其他引用时，可以不初始化。这是为什么？？

![useRef不初始化报错](../../public/framework/useRef.png)

useRef 函数即需要保存 DOM 的引用，又需要保存其他引用。而保存 DOM 引用时，其值因为绑定到了 JSX 元素上，所以需要不可变，而其他引用的值不需要不可变。所以 useRef 存在三个重载函数声明。

```ts
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

```ts
interface RefObject<T> {
  /**
   * The current value of the ref.
   */
  readonly current: T | null;
}

interface MutableRefObject<T> {
  current: T;
}
```

可见在返回 RefObject 时，current 是只读的，而在返回 MutableRefObject 时，current 是可变的。

- 当没有为 useRef 初始化时，命中第三个类型声明，返回 MutableRefObject。
- 当为 useRef 初始化的值的类型为范型 T 时，命中第一个类型声明，返回 MutableRefObject。
- 当为 useRef 初始化为 null，且范型 T 中不包含 null 时，命中第二个类型声明，返回 RefObject。当需要保存 DOM 引用时，范型 T 的值为 HTMLDivElement 等类型，不包含 null，此时初始化为 null，所以命中第二个类型声明。所以必须使用 null 来初始化，如果不初始化会命中第三个，导致违反引用 DOM 的值不可变的原则，报错。使用其它类型的值如 0 来初始化，则没有函数重载可以命中也会报错。

## CSS 的类型

当一个变量或函数的参数的值需要是 CSS 样式时，我们可以使用 `CSSProperties` 类型来声明；当值需要是某个 CSS 属性的值时，我们可以使用 `CSSProperties["color"]` 这样的类型来声明。编辑器会提供代码补全提示。

```tsx
const style: CSSProperties = { color: "red" };

const color: CSSProperties["color"] = "red";
```
