# TS 基础

## 认识 TS

1. TS 是什么？

是 JS 的超集。超在哪？在 JS的基础上拓展了静态类型，完善了面向对象编程。

1. 带来了什么优势？

静态类型：

- 提供了运行前的类型检查机制。JS 本身没有静态类型，在代码跑起来之前无法检测到类型相关的错误，如访问了一个对象不存在的属性，为操作数组的函数传递了一个对象参数等等，随着项目越来越大，这样的类型安全隐患也越来越大；并且 JS 是解释型语言，边编译边执行，所有只有在运行到相关代码时才能发现。TS 带来的类型检查机制可以在运行前检查到可能的类型错误，提高代码安全性与开发效率，降低维护成本。
- 更好的编辑器代码提示。为对象声明类型后，当访问对象的属性时编辑器会列出该对象所有合法的属性；为函数的形参声明类型后，当调用函数时编辑器会列出需要的形参个数与类型；提高开发效率。

1. TS 和其他强类型语言如 java 的区别是什么？

java 的类型可以用来静态类型检查和根据类型为变量分配内存空间。而 TS 需要编译为 JS 才能执行，所以 TS 中的类型仅能用于静态类型检查。

## TSC

tsc ：将 TS 文件编译为 JS 文件的编译器。

```json
"scripts": {
    "dev": "tsc --noEmitOnError --watch"
  },
```

- `--watch` 选项，tsc 会开启一个监听服务，当检测到项目中 TS 文件发生变化时，会自动对其重新编译。
- `--noEmitOnError` 选项，在编译过程中检测到类型错误会终止编译，默认不会。

## 单类型

### any、unkonwn 、never 类型

any 类型：

- 变量的值可以是任意类型。(可以赋值为任意类型的值，之后也可以更改为其它类型的值)
- 不会对该变量进行静态类型检查。（可以参与任何运算、调用任何属性和方法）
- 声明一个变量但不初始化也不显式声明类型时，会将其推断为 any 类型，称为隐式的 any 类型
- 在严格模式下，隐式的 any 类型是不合法的

```tsx
const a: any = 100

a = "hello world"
```

unkonwn 类型：表示未知的类型。

- 变量的值可以是任意类型。(可以赋值为任意类型的值，之后也可以更改为其它类型的值)
- 会对变量进行静态类型检查，但由于是”未知”的类型所以不能参与任何运算、调用属性和方法。
- 被赋值之后仍是 unkonwn 类型
- 通常用在变量可以接受多种类型的值，先声明为 unkonwn ，之后再通过类型判断或断言的方式进行分别处理的情况。（使用类型判断或类型断言就能将 unkonwn 类型转为一个特定的类型）

```tsx
function printLength(value: unknown) {
    if (value instanceof Array || typeof value === 'string') {
        console.log(value.length)
    } else if (typeof value === 'number') {
        console.log(value.toString().length);
    }
}
```

### 基本类型

```tsx
const a: string = "hello"
const b: number = 123
const c: boolean = true
const d: null = null
const e: undefined = undefined
```

```tsx
// TS 拥有类型推断的能力，所以在值的类型明确的情况下，就不需要为变量显式指定类型。
const a = "hello"

// 但在声明一个变量却不需要现在为其初始化时，就必须声明类型，否则会被推断为 any 类型。
const a: string
```

### 引用类型

1. 数组：

在 JS 中，数组可以存储任意数量，任意类型的值。在 TS 中对数组作了限制。

```tsx
const arr: string[] = ["hello", "world"] // 限制数组中值的类型

const arr2: Array<string> = ["hello", "world"] // 同上

const arr3: [string, number] = ["hello", 100] // 同时限制类型和数量，称为元组
```

1. 对象：

```tsx
const person: { name: string, age: number } = {
    name: "kevin",
    age: 20,
    readonly sex: "man" // 只读属性
}
```

:::tip
什么时候应该显式声明类型，什么时候应该使用类型推断？
对于基本类型的数据，如果定义变量时就初始化，可以使用类型推断；不初始化就要显式声明类型。
对于引用类型的数据，通常需要显式声明类型，一是有利于类型的复用，而是方便代码阅读。
在可以类型推断的情况下，有时也需要显示声明类型，是为了提高代码的可读性。
:::

:::warning
声明类型还是类型推断并没有一个严格的使用标准。声明类型优势是代码阅读性高，劣势是增加代码量；类型推断反之。要具体情况具体分析。
:::

1. 函数：

```tsx
// 为参数和返回值声明类型

function plus(a: number, b: number): number {
    return a + b;
}

// 没有返回值时，可以使用 void

function printString(str: string): void {
    console.log(str);
}
```

1. 数组、对象、函数中的类型都可以存在可选参数。

### interface

为对象声明类型、限制类的公共成员。

1. interface 允许继承，且允许多继承

```tsx
interface IUser {
    id: number;
    name: string;
    password: string;
}

interface IPerson {
    sex: string;
}

interface IAdmin extends IUser, IPerson {
    loginKey: string;
    level: number;
}
```

1. 同名的 interface 是合法的，使用时将会合并。

1. 可以单独访问 interface 中的类型

```tsx
interface ITodo {
  id: number;
  content: string;
  isCompleted: boolean;
}

type TypeContent = ITodo['content'];  // string

type TypeId = ITodo['id' | 'isCompleted']; // number | boolean
```

### 枚举

在 TS 中，值也可以作为类型。无论是原始类型还是引用类型的数据都可以作为类型。此时变量的值就只能是作为类型的值。

这种做法明显有很大的局限性，所以通常以联合类型、枚举的方式来将值作为类型。

联合类型：

```tsx
const a: 100 | 200 = 100;
```

枚举：

将一组相关的值声明为类型，这样变量的值就只能是这组值中的一个；还可以读取枚举类型中常量的值为变量赋值。

```tsx
enum Color {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue'
}

const color: Color = Color.RED;
```

当不需要读取值，而只是区分几种状态时，可以不为枚举中声明的常量赋值。

```tsx
enum Mode {
    READ,
    WRITE,
    READ_WRITE
}

// 在不赋值时，枚举中常量的值为从 0 开始的数字。
```

### 将值作为类型

任意值都可以声明为变量的类型，此时变量的值就只能是这个类型了。

## 联合类型

使变量拥有多种类型

```tsx
const a: string | number = 1;

const arr: (string | number)[] = [1, '2', 3];

const person: { name: string, parent: string | string[] } = {
    name: 'tom',
    parent: ['bob', 'alice']
}

function printName(name: string | number): void {
    console.log(name);
}

// 甚至

type Type1 = { name: string };
type Type2 = { age: number };

let obj1: Type1 | Type2 = { name: 'John' };

obj1 = { age: 25 };
```

keyof 操作符

```tsx
const obj = {
    a: 1,
    b: 2
}

for (let key in obj) {
    console.log(obj[key]);    // 报错
}
```

在 TS 中，使用方括号通过 key 获取对象属性的值时，key 的值应该是 obj 中键的某一个。

此时，可以使用 `keyof` 操作符，它可以将对象类型的键生成一个联合类型。如

```tsx
type TypeObj = {
    name: string;
    age: number;
}

const obj: keyof TypeObj = 'name';  // obj 的类型为 "name" | "age"
```

在此例子中，可以改为

```tsx
type TypeObj = keyof typeof obj;

for (let key in obj) {
    console.log(obj[key as TypeObj]);
}
```

## 条件类型

```tsx
type TypeReturn<T> = T extends IA ? IA : IB;
```

还有其它形式的判断条件吗？？

## 类型别名

:::tip
一般使用 interface 为对象声明类型。而其它引用值（数组、函数）的类型，以及联合类型、条件类型如果需要抽取的话，则使用 type。
即对象使用 interface ；其他有需要就使用 type 。
:::

类型别名，使用 type 可以为单类型、联合类型、条件类型命名，方便复杂类型下代码阅读和类型复用。

类型别名的名称需要使用大驼峰命名。

```tsx
// 数组

type ArrayInfoType = string[];  // 字符串数组

const arr: ArrayInfoType = ["1", "2", "3"];

type ArrayInfoType2 = [string, number, boolean?];  // 元组

const arr2: ArrayInfoType2 = ["1", 2];

// 对象

type PersonType = {
    name: string;
    age: number;
    married?: boolean;  // 可选参数
}

const person: PersonType = {
    name: "kevin",
    age: 20
}

// 函数

type FuncType = (a: number, b: number) => number;

const plus: FuncType = (a, b) => a + b;

// 基本类型本身就够简洁了，interface、枚举本身就有名字了，所以通常不会为单个的基本类型、
// interface、枚举命名；（即不是不行，是没必要）

interface IA {}
interface IB {}

type TypeOne = IA

type TypeObj = IA | IB
```

```tsx
// 条件类型

type TypeReturn<T> = T extends IA ? IA : IB;
```

interface 是在声明类型并命名，type 只是在为类型起名。证据就是 type 需要等号赋值。

## 断言

断言：强制改变编译器的类型判定。

开发过程中那些不是自己创建的数据，其类型判定就只能靠编译器的类型推断，但类型推断出错时，就要靠断言去自己纠正类型判定。

慎重使用断言！除非百分百确信数据的类型时才使用断言，如果数据不是断言的类型时，开发过程中代码不会报错，只有在程序运行时才会报错。

类型断言：告诉 TS 编译器这个表达式的结果一定为某个类型。

非空断言：告诉 TS 编译器这个表达式的结果一定不为空（不为 null 或 undefined）。

案例1:

```tsx
const str = localStorage.getItem("__str__");

console.log(str.length) // ❌ str is possibly null
```

TS 编译器推断右侧表达式的结果的类型为 `string | null` ，而后我们需要按 string 类型进行处理时就会报错

- 可以使用非空断言告诉编译器 str 一定不为空。此时 str 的类型就是 `string`

```tsx
const str = localStorage.getItem("__str__")!; // 第一种：直接为表达式做非空断言

console.log(str!.length) // 第二种：为变量 str 做非空断言，只在这一次调用生效
```

- 也可以使用类型断言告诉编译器 str 一定为 `string` 类型

```tsx
const str = localStorage.getItem("__str__") as string;
```

这只是强制改变编译器的类型判定，但当 str 真的为 null 时，程序就会报错。

案例2:

```html
<canvas id="canvas"></canvas>
```

```tsx
const oCan = document.querySelector('#canvas');

const ctx = oCan.getContext('2d')
```

此时存在两个错误，一是编译器将 oCan 的类型推断为 `Element | null` ，null 是不存在方法可以调用的。二是即使使用了非空断言， Element 类型也不存在 getContext 方法。

此时可以使类型推断

```tsx
const oCan = document.querySelector('#canvas') as HTMLCanvasElement;
```

注意！在对对象进行类型断言时，对象中的属性可以少但不能添加多余的属性。

```tsx
interface ITest {
    name: string;
}

const a = {} as ITest;  // 合法

const b = { name: 'kevin' } as ITest; // 合法
 
const c = { age: 20 } as ITest; // 不合法
```

## 泛型

函数中的泛型：在声明函数时声明一个或多个类型占位符，在参数和返回值中把它当成一个类型来用；在调用函数时指定这个类型占位符的类型。

```tsx
// 函数声明式
function arrToString<E>(arr: E[], separator: string): string {
    return arr.join(separator);
}

arrToString<string>(["hello", "world"], ',');

// 箭头函数式
const arrayToString = <E>(arr: E[], separator: string): string => {
    return arr.join(separator);
}

arrayToString<number>([1, 2, 3], ',');
```

类型占位符可以是任意字符串，但常用大写字母表示：

- T：type
- E：element
- K：key
- V：value
- R：result

接口中的泛型

```tsx
interface ITodo<T> {
    id: number;
    content: T;
}

const a: ITodo<string> = {
    id: 1,
    content: 'hello',
};

const b: ITodo<number> = {
    id: 2,
    content: 123,
};
```

类中的泛型

```tsx
class Todo<T> {
  id: number;
  content: T;
  completed: boolean;
  
  constructor(id: number, content: T) {
    this.id = id;
    this.content = content;
    this.completed = false;
  }
}
```

类型别名中泛型

```tsx
type TypeReturn<T> = T extends IA ? IA : IB;
```

泛型可以接受任意类型的值，所以函数的逻辑需要在所有类型下合法。如果不能，要么在函数中对不同类型进行不同操作，要通过泛型约束限制泛型可接受的类型。

正例：

如 react 中的 useState 钩子，传入泛型的作用就是为其返回值声明类型，传什么类型的数据都不会影响函数的正常执行。

反例：当我为泛型指定 number 类型时，value.length 是不合法的操作，所以会报错。

```tsx
const getLength = <T>(value: T): number => {
    return value.length;  // 报错
}
```

改正1：限制泛型可接受的类型。这里要求传给 T 的类型必须存在类型为 number 的 length 参数

```tsx
const getLength = <T extends { length: number }>(value: T): number => {
    return value.length;
}
```

改正2：对不同类型进行了处理，使传入什么类型都不会报错。

```tsx
const getLength = <T>(value: T): number => {
    if (typeof value === 'string' || value instanceof Array) {
        return value.length;
    } else if (typeof value === 'number') {
        return value.toString().length;
    }
    return 0;
}
```

泛型和 type 一样，都是类型的一种代号，所以泛型不仅可以指定单类型，还可以指定联合类型。

泛型约束：泛型可以使用 extands 关键字继承另一个类型、联合类型来达到限制泛型接受的类型的目的。

（学的不好，考虑重学）

```tsx

interface IProp {
    length: number;
}

const getLength = <T extends TypeProp>(value: T): number => {
    return value.length;
}

// 这里要求传给 T 的类型必须存在类型为 number 的 length 参数
```

约束泛型为函数：

```tsx
const getResult = <T>(a: number, b: number, fn: T) => {
    return fn(a, b);     // error 因为 T 可能是任意类型
}

const getResult2 = <T extends (...args: any) => any>(a: number, b: number, fn: T) => {
    return fn(a, b);     // 使用泛型约束规范了 T 必须是函数类型
}
```

约束泛型为对象的键

```tsx
interface ITodo {
  id: number;
  content: string;
  completed: boolean;
}

const todoObj: ITodo = {
  id: 1,
  content: 'typescript',
  completed: false
}

const setTodo = <V extends ITodo[K], K extends keyof ITodo>(value: V, key: K) => {
  todoObj[key] = value;
}

// 约束 key 为 'id' | 'content' | 'completed'，约束 value 为 number | string | boolean
```

泛型中的联合类型

```tsx
type Bool<T> = T extends 'a' ? string : number;

type Bool2 = Bool<'a' | 'b'>;  // string | number
```

相当于

```tsx
Bool<'a'> | Bool<'b'> => string | number
```

泛型中指定 never 类型时，无论泛型声明是什么，直接返回 never 类型

```tsx
type Bool<T> = T extends 'a' ? string : number;

type Bool2 = Bool<never>; // never
```

## 其它

在 JS 中 undefined 表示原始值的空值；null 表示引用类型的空值。意义是起到一个占位的作用，以后可以赋值。（所以未初始化的变量的值就是 undefined）使用 null 占位的原因是提醒开发者以后这个变量是要赋值引用类型的，起到一个语义化的作用。

所以在 TS 中为将一个变量初始化为 undefined 或者 null 时，不会将变量推断为 undefined/null 类型，这样变量就只能接收 undefined/null 作为值了，就不能履行空值的意义了。所以 ts 会将变量推断为 any 类型。

```tsx
let a = undefined;

a = 100;

a = [1, 2, 3]
```

当一个函数接受类作为参数，并需要在函数体中实例化这个类时，参数的类型需要是类的构造器函数的类型。

```tsx
type TypeDress = new(size: number, color: string) => Dress;

interface IDress {
    new(size: number, color: string): Dress;
}

class Dress {
    public size: number;
    public color: string;

    constructor(size: number, color: string) {
        this.size = size;
        this.color = color;
    }
}

function getProduct(Product: TypeDress): Dress {
    return new Product(12, 'red');
}

// 这里参数的类型使用 TypeDress 或 IDress 都行
```

为什么使用 `void 0` 来代替 `undefined` ?

因为 undefined 是不安全的。为什么不安全？

undefined 是变量名合法的变量名。所以在使用 undefined 时可能会错误地使用到一个变量，而 `void 0` `void(0)` 或者 `void *` （*表示任意值）始终返回 undefined。

限制对象中的函数被单独调用

```tsx
interface IUsers {
    age: number;
    getAge: (this: IUsers) => number;   // 通过为函数中 this 指定类型
}

const obj: IUsers = {
    age: 24,
    getAge() {
        return this.age;
    }
}

const fn = obj.getAge;

fn(); // error
```

object 类型与 Object 类型有什么区别？

object 泛指引用类型。即任何引用类型都可以声明为 object  类型，但其范围太广用的很少。

Object 表示???

- [ ]  unkown、never类型
- [ ]  什么时候显示声明，什么时候饮食

类型缩小

- 类型判断
- 断言

typeof 操作符

在 TS 中，typeof xxx 不仅可以像JS一样用来获取类型字符串，如 ‘string’ ‘number’ 。

在将其值用于类型操作时，可以用来获取变量的类型。

```tsx
const a: string = 'hello'

type TypeA = typeof a;    // TypeA 就表示 string 类型

const b = [1, 2, 3]

type TypeB = typeof b;    // number

interface IA {
  id: number;
  name: string;
}

const c: IA = {
  id: 1,
  name: 'hello'
}

type TypeC = typeof c;    // IA

// 还有之前提到的 keyof 操作的用法

type TypeD = typeof 'hello' // error 不能用来获取值的类型。
```

通过函数的类型获取其返回值的类型。

```tsx

const plus = (a: number, b: number): number => a + b;

type TypeA = ReturnType<typeof plus>  // number
```

```tsx
// 实现 ReturnType

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

首先这里使用泛型约束来限制 T 为函数，否则返回 any 类型；infer R 取出 T 中返回值的类型并命名为 R ，当 T 为函数类型时，就可以返回 R 。

infer 还有其它应用吗？？

函数重载

参数索引

## 类

### 基础概念

类中的成员：

- 属性
- 构造方法
- getter/setter：属性的访问代理。
- 方法

成员访问权限

- private：类本身可以访问。类的实例、子类、子类实例都不能访问。
- protected：类本身、子类可以访问。类的实例、子类的实例不能访问。
- public：公开访问。（默认）

只读属性

readonly：只能在声明只读属性时和 constructor 方法中赋值。类的方法、类的实例都不能修改它的值。

静态成员：

static：定义在类本身上的成员（类也是个对象）。不在实例上，也不在原型上。可以通过类直接访问。有什么用呢？？通常是类中的工具属性、工具方法。什么叫工具方法？？

```tsx
class Person {
  public name: string;
  public age: number = 20; // 设置默认值
  public sex?: string; // 可选属性
  public readonly parent: string[] = [] // 只读属性

  constructor(name: string, age: number, sex: string, parent: string[]) {
    this.name = name;
    this.age = age;
    sex && (this.sex = sex);
    this.parent = parent;
  }

  getName(): string {
    return this.name;
  }
}

class Admin extends Person {
  public role: string;

  constructor(name: string, age: number, sex: string, parent: string[], role: string) {
    super(name, age, sex, parent);  // 子类的构造方法必须首先调用 super 方法
    this.role = role;
  }

  getName(): string { // 重写父类中的方法，属性、方法都可以重写
    if (this.role === 'admin') {
      return 'admin: ' + this.name;
    }
    return super.getName();   
  }
}

// 重写了父类方法后，子类中 this.getName 就是本类中的方法了，此时可以还使用 super.getName
// 调用父类中的方法。
```

### 实现接口

一个类需要定义的公共方法（public 方法）一定要由接口进行定义，类进行实现。

### 静态代码块

```tsx
class Test {
  public a = 1;
  static b = 2;

  static {
    console.log(this.b);
  }
}
```

静态代码块会在类被加载时执行一次。（即代码执行到类的定义时就会被执行）

静态代码块中的 this 指向类本身，这里就是 Test ，所以可以直接使用 `this.b` 访问静态成员 b ，而不能通过 `this.a` 访问类成员。

### 抽象类

```tsx
abstract class Duck {
  public abstract walk(): void;   // 可以声明为 public 和 protected 不能是 private
  protected abstract swim(): void;
}

class Bird extends Duck {
  name: string = 'kevin';
  walk() {
    console.log('walking');
  }
  swim() {
    console.log('swimming');
  }
}

class Person extends Duck {
  age: number = 18;
  walk() {
    console.log('walking');
  }
  swim() {
    console.log('swimming');
  }
}

const a: Duck = new Bird();
const b: Duck = new Person(); 

// 虽然 Bird 类和 Person 类都有不同的成员，但其实例都能声明为 Duck 类型。这有什么用？？
```

- 使用 abstract 关键字可以声明抽象类，抽象类中可以声明抽象属性和抽象方法。抽象成员不需要被实现。
- 抽象类本身不能被实例化，只能被继承。
- 普通类继承抽象类之后，就必须要实现它定义的抽象属性和抽象方法。
- 抽象类中也可以定义普通属性和方法，可以被子类继承到。

抽象类和接口有什么区别和选择呢？？

接口只是限制公共方法。抽象类中抽象成员可以是 protected、public；还可以定义普通属性和方法给子类继承。

也就是说只需要限制方法时，使用接口；还需要声明成员给子类继承时，用抽象类。

## extands

extends 关键字不仅可以用于类与类之间的继承，还可以

- 泛型约束
- 条件类型

继承只是类之间的操作。但泛型约束和条件类型是类型之间的操作，此时 extands 关键字表示的是“包含”的意义，后者必须是前者的子集。前者可以比后者更加广泛，或者等于后者。

```tsx
// 泛型约束
T extands { name: string }   // T 类型必须“包含”后面的类型

// 条件类型
type TestType<T> = T extands { name: string } ? IA : IB 
// T 类型“包含”后面的类型时返回 true
```

## 联合类型的工具

Exclude：获取两个联合类型的差集

```tsx
type TestType = Exclude<'a' | 'b', 'a'>  // 'b'
```

源码

```tsx
type MyExclude<T, U> = T extends U ? never : T;
```

案例等效于：

```tsx
Exclude<'a', 'a'> | Exclude<'b', 'a'>

('a' extends 'a' ? never : 'a') | ('b' extands 'a' ? never : 'b')

never | 'b'

'b'
```

Pick：使用联合类型拆解接口中的一部分组成新类型。

```tsx
interface ITodo {
  id: number;
  content: string;
  completed: boolean;
}

type TestType = Pick<ITodo, 'id' | 'content'>  // { id: number, content: string }
```

源码

```tsx
type MyPick<T, U extends keyof T> = {
  [Key in U]: T[Key]
}
```

在这个案例中 ：因为是拆解 T 类型的一部分，所以 U 类型必须是 T 的键的联合类型的子集 `id | content | completed` 。而 `[Key in U]: T[Key]` 则是将需要的部分声明为 T 中对应的类型。