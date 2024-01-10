# 数据结构

## 线性数据结构

线性表在数据结构上的定义：线性表（Linear List）是零个或多个数据元素的有限序列（有限、有序）。如数组、链表、队列、栈等。

线性表要求连续存储吗？不要求，线性表可以采用顺序存储结构，也可以采用链式存储结构。

### 数组

### 链表

### 栈

栈结构的定义：只能在一端进行插入和删除操作，这一端称为栈顶，另一端称为栈底。

栈结构的特点：后进先出。

使用 JS 实现栈结构：

栈的基本操作：入栈、出栈、获取栈顶元素、判断栈是否为空、清空栈。

```js
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}
```

其实定义一个数组，只对它使用 push 和 pop 方法，就可以实现栈的功能。

栈结构在前端开发中的应用：撤销操作、浏览器历史记录、括号匹配、表达式求值。

当某功能需要撤销操作时，可以使用栈结构来实现。比如：在文本编辑器中，当我们输入一个字符时，就将这个字符入栈；当我们点击撤销按钮时，就将栈顶的字符出栈。

浏览器使用栈结构存储历史记录：浏览器的前进和后退功能，其实就是栈结构的入栈和出栈操作。

什么是括号匹配问题：给定一个字符串，里面包含若干小括号，判断小括号是否合法。每一个"("都对应一个")"。

括号匹配的应用场景有哪些？括号匹配问题在编译器、浏览器、文本编辑器等软件中都有广泛的应用。

使用栈结构解决括号匹配问题：

```js
function isLegalBrackets(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    const item = str[i];
    if (item === "(") {
      stack.push(item);
    } else if (item === ")") {
      if (stack.length === 0) {
        return false;
      }
      stack.pop();
    }
  }
  return stack.length === 0;
}
```

什么是表达式求值问题？给定一个表达式，里面包含若干数字、运算符和括号，求这个表达式的值。

表达式求值的应用场景有哪些？表达式求值问题在编译器、浏览器、文本编辑器等软件中都有广泛的应用。

使用栈结构解决表达式求值问题：

```js
function calc(exp) {
  const stack = [];
  for (let i = 0; i < exp.length; i++) {
    const item = exp[i];
    if (["+", "-", "*", "/"].indexOf(item) >= 0) {
      const value1 = stack.pop();
      const value2 = stack.pop();
      const expStr = value2 + item + value1;
      const res = parseInt(eval(expStr));
      stack.push(res.toString());
    } else {
      stack.push(item);
    }
  }
  return stack.pop();
}
```

### 队列

队列结构的定义：只能在一端进行插入操作，在另一端进行删除操作。允许删除的一端称为队头，允许插入的一端称为队尾。

队列结构的特点：先进先出。

使用 JS 实现队列结构：

队列的基本操作：入队、出队、获取队头元素、判断队列是否为空、清空队列。

```js
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  front() {
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}
```

## 非线性

### 树

## 位运算

# 算法

## 排序算法

### 冒泡排序

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}
```

时间复杂度：O(n^2)。因为每次外层循环时内层的循环次数都会减1，外层循环一遍内层循环次数相加为等差数列相加公式，其最高次幂为2，所以时间复杂度为 O(n^2)。

### 快速排序算法

使用 “二分” 思想优化冒泡排序算法。

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}
```

## 交换两个变量的值

第一种方法：使用第三个变量。

```js
let a = 1;
let b = 2;

let c = a;
a = b;
b = c;
```

第二种方法：解构运算符

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
```

第三种方法：使用加减法。（仅限数字）

```js
let a = 1;
let b = 2;
a = a + b;
b = a - b;
a = a - b;
```

第四种方法：使用异或运算。（仅限数字）

```js
let a = 1;
let b = 2;
a = a ^ b;
b = a ^ b;
a = a ^ b;
```
