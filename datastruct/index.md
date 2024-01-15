# 数据结构

## 线性数据结构

线性表在数据结构上的定义：线性表（Linear List）是零个或多个数据元素的有限序列（有限、有序）。如数组、链表、队列、栈等。

线性表要求连续存储吗？不要求，线性表可以采用顺序存储结构，也可以采用链式存储结构。

### 数组

### 链表

链表 实现 LRU 缓存

数组查找效率是 O(1),插入删除是 O(n); 链表查找效率是 O(n),插入删除是 O(1); 而哈希表的查找和插入删除都接近 O(1)

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

使用迭代思想解决问题

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

时间复杂度：O(n^2)。因为每次外层循环时内层的循环次数都会减 1，外层循环一遍内层循环次数相加为等差数列相加公式，其最高次幂为 2，所以时间复杂度为 O(n^2)。

### 快速排序算法

使用 “二分” 思想优化冒泡排序算法。

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    // 拆分到数组长度为1就不需要排序了，数组长度一开始就是0也不用排序
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0]; // 因为作为标志位的元素在下一次递归中不需要参与排序，所以可以直接从数组中删除
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

二分法通常使用递归来解。递归函数分成三部分去思考：

1. 基本操作及操作结果
2. 根据操作结果进行递归操作
3. 退出递归的条件

在这个快速排序算法中，基本操作就是将小于某个标志的值放到一个数组，大于某个标志的值放到另一个数组。递归函数也需要返回最终的结果，所以返回左边+标识位+右边就是操作结果。
退出递归的条件：我们在不断地将数组分成两半，直到数组长度为 1，这时候就不需要再分了，所以退出递归的条件就是数组长度为 1。根据操作结果进行递归操作：对左边和右边的数组进行递归操作。

### 原地快速排序算法

这里的“原地”是指不创建临时的 left 和 right 数组，而是通过交换元素的位置实现指定标志位左边的元素都小于标志位，右边的元素都大于标志位。

按照上面提出的思路：基本操作就是通过交换位置实现指定标志位左边的元素都小于标志位，右边的元素都大于标志位。而再次调用函数处理的是标志位左侧和右侧的部分，所以我们需要知道标志位的索引才能继续进行，所以标志位的索引就是基本操作的返回结果。退出递归的条件，当需要进行基本操作的数组的长度为 1 时，就不用排序了，所以需要 left < right。根据结果进行递归操作：根据标志位索引对标志位两侧进行基本操作。

```js
function partition(arr, left, right) {
  let pivot = arr[right]; // 取最右侧元素为标志位
  let i = left;
  for (let j = left; j < arr.length; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

function quickSortInPlace(arr, left, right) {
  if (left < right) {
    const i = partition(arr, left, right);
    quickSortInPlace(arr, left, i - 1);
    quickSortInPlace(arr, i + 1, right);
  }
  return arr;
}
```

以数组 [4, 7, 28, 19, 3, 10] 为例，partition 函数的机制是：设置两个指针，一开始当前元素<标志位元素时，自身与自身交换位置（位置没变），i++，此时两个指针同步增加；在循环到这个 28，当前元素大于标志位元素时，i 没有增加，但 j 增加了。注意此时 i 为这个 28 的索引。直到下次遍历到 3，当前元素<标志位元素时，3 与 i (即 28)交换位置，i++，注意，此时 i 还是数组中从左到右第一个大于标志位元素(19)的索引。直到最后一个元素即标志位元素本身。for 循环结束后，将标志位元素与 i 元素(19)交换位置。这样，标志位左边就全是小于它的了。

使用双指针思想来实现左小右大，使用二分法实现排序

### 求三数之和

求出一个数组中所有的三数相加为 0 的组合。

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) { 
      continue;
    }
    let left = i + 1;
    let right = nums.length - 1;
    while(left < right) {
      const total = nums[i] + nums[left] + nums[right];
      if (total < 0) {
        left++;
      } else if (total > 0) {
          right--;
      } else {
        result.push([nums[i], nums[left], nums[right]])
        while(left < right && nums[left] === nums[left + 1]) {
            left++;
        }
        while(left < right && nums[right] === nums[right - 1]) {
            right--;
        }
        left++;
        right--;
      }
    }
  }
  return result;
}
```

使用双指针思路解题。

为什么要进行排序？？

在 for 循环中如果和上一个值相同，则跳过。因为会得到相同的结果，出现重复结果，那为什么不跳过前面的而跳过后面的？
因为可能会有 [ -1, -1, 0] 的情况出现，如果跳过了第一个 -1 那就找漏了一组。

为什么获取到三数之和为0时，不直接 left++ 和 right-- ?
因为left 的右边和 right 的左边可能和 left、right 本身相同，所以要一直找到不同的。

双指针：为了找到这两个其他的元素，我们使用两个指针，一个指向当前元素的下一个元素（左指针），另一个指向数组的最后一个元素（右指针）。我们计算这三个元素的和，然后根据和的大小来决定如何移动指针。

- 如果和小于0，那么我们需要增大和，所以我们将左指针向右移动一位。为什么？因为数组按从小到大排序，总和小了就把left右移。
- 如果和大于0，那么我们需要减小和，所以我们将右指针向左移动一位。
- 如果和等于0，那么我们找到了一个解。我们将这三个元素添加到结果数组中，然后同时移动左指针和右指针，跳过所有重复的元素。

跳过重复元素：在遍历数组和移动指针时，我们都需要跳过重复的元素。这是因为我们要找的是所有唯一的三元组，重复的三元组只需要记录一次。

### 优化 leftPad 方法

leftPad 方法：在字符串左侧填充指定字符使字符串满足指定长度。

```js
function leftPad(str, length, ch) {
  const len = length - str.length;
  return Array(len).fill(ch).join('') + str;
}
```

```js
function leftPad(str, len, ch = ' ') {
    let padding = (ch + '').repeat(Math.max(0, len - str.length));
    return padding + str;
}
```

前者 `Array(len).fill(ch).join('')` 中每一步都要遍历整个函数，会遍历 3n 次

后者只需要遍历 n 次

## 回溯算法

没搞明白什么是回溯算法

求数组的所有可能排列：

```js
function backtrack(nums, temp, list) {
    if (temp.length === nums.length) {
        return list.push([...temp]);
    }
    for (let i = 0; i < nums.length; i++) {
        if (temp.includes(nums[i])) {
            continue;
        }
        temp.push(nums[i]);
        backtrack(nums, temp, list);
        temp.pop();
    }
}
var permute = function(nums) {
    const list = [];
    backtrack(nums, [], list);
    return list;
};
```

如 [1, 2, 3] 过程为 

[1] [1,2] [1,2,3] [1,2] [1,3] [1,3,2] 

[2] [2,1] [2,1,3] [2,1] [2,3] [2,3,2] 

[3] [3,1] [3,1,2] [3,1] [3,2] [3,2,1]


## 交换两个变量的值

第一种方法：使用第三个变量。

```js
let a = 1;
let b = 2;

let c = a;
a = b;
b = c;
````

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
