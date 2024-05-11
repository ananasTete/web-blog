# JS 中的二进制操作

ArrayBuffer、TypedArray、DataView

## ArrayBuffer

### 是什么

> `ArrayBuffer` 对象用来表示通用的原始二进制数据缓冲区。

> 它是一个字节数组，不能直接操作 `ArrayBuffer` 中的内容，而是通过 **类型化数组对象** 或 `DataView` 对象来操作。它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

> 字节数组中的每一项都默认为 0。

二进制数据缓冲区是什么意思？

ArrayBuffer 只是开辟出了一块固定字节长度的空间，并将每个字节初始化为 0，他没有能力读写这块空间中的数据，只是一个容器。

字节数组是指数组的每一项都是一个字节吗？是的。

ArrayBuffer 对象是一个可转移对象。即它可以在上下文之间传递，而不需要复制。如在 JS 主线程转移到 web worker 线程。这种转移被称为分离（detached）,转移之后，原来的 ArrayBuffer 对象就不能再使用了。其 detached 属性为 true。

### 使用

#### 创建 ArrayBuffer 对象

```js
new ArrayBuffer(length, options?)
```

参数：

- length 表示要创建的数组缓冲区的大小，单位为字节。
- options 是一个可选的对象，用于设置 ArrayBuffer 的属性。
  - maxByteLength：数组缓冲区可以调整到的最大大小，以字节为单位。

注意！如果没有设置 maxByteLength 属性，那么创建的 ArrayBuffer 对象的大小就是固定的，不能调整。

返回值：一个新的 ArrayBuffer 对象。其内容被初始化为 0。

#### ArrayBuffer 对象

实例属性：

- byteLength：表示 ArrayBuffer 对象的字节长度。
- maxByteLength：表示 ArrayBuffer 对象的最大字节长度。在实例化时确定，只读。
- resizeable：表示 ArrayBuffer 对象是否可以调整大小。在实例化时确定，设置了 maxByteLength 属性即为 true。 只读。
- detached：表示 ArrayBuffer 对象是否已经被分离。只读。

实例方法：

- resize(newLength)：将 ArrayBuffer 调整为指定大小，以字节为单位。
- slice(start?, end?)：返回一个新的 ArrayBuffer 对象，包含了原始 ArrayBuffer 对象的指定范围内的数据。[start, end)。

## TypedArray

### 是什么

是用来操作 ArrayBuffer 对象的。ArrayBuffer 对象只是规定了一块固定大小的内存区域，而 TypedArray 对象定义了如何解释 ArrayBuffer 中的数据。如数据是 8 位的，还是 16 位、32 位的？是有符号的还是无符号的？

** 它定义了如何解析 ArrayBuffer 中的数据，以及提供了按照数组的方式操作数据的接口。**

TypedArray 没有直接在全局暴露，即不能直接使用 `TypedArray` 构造函数来创建 TypedArray 对象。但可以通过其一系列的子类来操作 ArrayBuffer 对象。

### TypedArray 子类

| 类型              | 值范围                                      | 字节长度 | 说明                                                |
| ----------------- | ------------------------------------------- | -------- | --------------------------------------------------- |
| Int8Array         | -128 ~ 127                                  | 1        | 8 位有符号整数（补码）                              |
| Uint8Array        | 0 ~ 255                                     | 1        | 8 位无符号整数                                      |
| Uint8ClampedArray | 0 ~ 255                                     | 1        | 8 位无符号整数                                      |
| Int16Array        | -32768 ~ 32767                              | 2        | 16 位有符号整数（补码）                             |
| Uint16Array       | 0 ~ 65535                                   | 2        | 16 位无符号整数                                     |
| Int32Array        | -2147483648 ~ 2147483647                    | 4        | 32 位有符号整数（补码）                             |
| Uint32Array       | 0 ~ 4294967295                              | 4        | 32 位无符号整数                                     |
| Float32Array      | -3.4E38 ~ 3.4E38 并且 1.2E-38 是最小的正数  | 4        | 32 位浮点数（7 位有效数字，例如 1.234567）          |
| Float64Array      | -1.7E308 ~ 1.7E308 并且 5E-324 是最小的正数 | 8        | 64 位浮点数（16 位有效数字，例如 1.23456789012345） |
| ｜ BigInt64Array  | -2^63 ~ 2^63-1                              | 8        | 64 位有符号整数（补码）                             |
| ｜ BigUint64Array | 0 ~ 2^64-1                                  | 8        | 64 位无符号整数                                     |

### 使用

#### 创建 TypedArray 对象

```js
new Int8Array(length); // 创建一个 Int8Array 对象。(内部基于 ArrayBuffer 对象，其长度为 length)

new Int8Array(typedArray); // 基于另一个 TypedArray 对象创建一个新的 TypedArray 对象。

new Int8Array(ArrayBuffer, byteOffset?, length?) // 接受一个 ArrayBuffer 对象，以及两个可选参数，用于指定 ArrayBuffer 对象暴露给 TypedArray 对象的起始位置和长度。
```

#### 以索引的方式访问

TypedArray 提供了类似数组的接口，可以使用索引访问和操作元素，也可以使用 length 属性获取元素数量。

```js
const buffer = new ArrayBuffer(16);

const typedArray8 = new Int8Array(buffer);

const typedArray16 = new Int16Array(typedArray);

console.log(typedArray8.length); // 16
console.log(typedArray16.length); // 8
```

注意！Int8Array 方法使用 8 位来表示数据，即每个元素占用 1 个字节。所以 TypedArray8 的长度为 16，而 TypedArray16 的长度为 8。

#### 属性和方法

TypedArray 的原型上的属性和方法被所有子类继承。

属性：

- buffer：表示引用的 ArrayBuffer 对象。只读。
- byteLength：表示类型化数组的长度，以字节位单位。只读。不一定是 buffer 的长度，可能是 buffer 的一部分，因为在实例化时传入的 byteOffset 和 length 参数。
- byteOffset：表示类型化数组的起始位置。只读。
- length：表示类型化数组中元素的个数。只读。同一个 buffer 在不同的子类在有不同的结果，见上一节。
- BYTES_PER_ELEMENT：类型化数组中的一个元素使用多少个字节。如 buffer 长度为 16，Int8Array 的 BYTES_PER_ELEMENT 为 1，Int16Array 的 BYTES_PER_ELEMENT 为 2。

方法：

- 数组的方法都能用，如 forEach、map 等
- at(index)：返回指定索引处的元素。接受负值。
- set()：从指定数组中读取值并存储在类型化数组的指定位置。
- subarray(begin?, end?)：返回一个新的 TypedArray 对象，包含了原始 TypedArray 对象的指定范围内的数据。[begin, end)。

set 方法：

```js
set(array, offset?) // 从指定数组中读取值并存储在类型化数组的指定位置。

set(typedArray, offset?) // 从指定 TypedArray 对象中读取值并存储在类型化数组的指定位置。
```

```js
var buffer = new ArrayBuffer(8);
var uint8 = new Uint8Array(buffer);

uint8.set([1, 2, 3], 3);

console.log(uint8); // Uint8Array [ 0, 0, 0, 1, 2, 3, 0, 0 ]
```

## DataView

### 是什么

是一种可以以多种解析方式读写 ArrayBuffer 对象的 API。还可以指定字节序。

### 使用

#### 创建 DataView 对象

`new DataView`，参数同 TypedArray。

#### DataView 对象

属性：

- buffer：表示 DataView 对象的 ArrayBuffer 对象的引用。只读。
- byteLength：表示 DataView 对象的字节长度。只读。不一定是 buffer 的长度，可能是 buffer 的一部分。
- byteOffset：表示 DataView 对象的起始位置。只读。

set 方法：

- setInt8(byteOffset, value, littleEndian?)：在视图开始的指定字节偏移处存储一个带符号 8 位整数（byte）。
- setUint8(byteOffset, value, littleEndian?)：在视图开始的指定字节偏移处存储一个无符号 8 位整数（byte）。
- setInt16(byteOffset, value, littleEndian?)
- setUint16(byteOffset, value, littleEndian?)
- setInt32(byteOffset, value, littleEndian?)
- setUint32(byteOffset, value, littleEndian?)
- setFloat32(byteOffset, value, littleEndian?)
- setFloat64(byteOffset, value, littleEndian?)
- getInt8(byteOffset, littleEndian?)
- getUint8(byteOffset, littleEndian?)

get 方法：与上面对应。

#### 如何理解多种方式读写？

```js
const buffer = new ArrayBuffer(16);

const view = new DataView(buffer);

view.setInt8(0, 32);

view.setInt16(0, 16);

console.log(view.getInt8(0)); // 0

console.log(view.getInt16(0)); // 16
```

在 8 位的解析方法下，DataView 对象的长度为 16，将第一个元素写为 32；在 16 位的解析方法下，DataView 对象的长度为 8，将第一个元素写为 16。但是在 16 位使用两个字节来表示，而字节序默认又是小字节序，所以在 8 位的解析方法下，setInt16() 是在第二个元素开始写入，而没有超过一个字节，所以第一个元素为 0。

按 8 位解析：`0 0 ...` => `32 0 ...` => `0 16 ...`
按 16 位解析：`0 0 ...` => `32 0 ...` => `16 0 ...`

即：操作的都是同一块数据，只是以不同的方式读写。

## TypedArray 和 DataView 有什么区别

区别：

- TypedArray 只能按照当前计算机的字节序来解释 ArrayBuffer 中的数据，而 DataView 可以指定字节序（并不会改变计算机上的实际字节序，只是改变读取方式）。
- TypedArray 只能以固定的格式来解析数据，但 DateView 可以以任意格式来读写数据。
- TypedArray 对象可以以数组的方式来访问数据，而 DataView 对象只能通过方法来访问数据。

什么是字节序？

每一个字节都可以存储 8 为二进制数据。存在两种排列方式，低位字节排放在内存的低地址端，高位字节排放在内存的高地址端，称为 little-endian 小字节序/低字节序；相反，称为 big-endian 大字节序/高字节序。

英特尔处理器都使用小字节序，而大多数网络协议使用大字节序。

## Blob

### 是什么

> Blob 对象表示一个不可变、原始数据的类文件对象。

不可变：Blob 对象的数据是不可变的，一旦创建就不能修改。

原始数据：二进制数据。

类文件对象：Blob 对象的数据可以像文件一样进行读写、传输操作。

> 它的数据可以按 **文本** 或 **二进制** 的格式进行读取，也可以转换成 `ReadableStream` 来用于数据操作。

_所以：Blob 对象是一个表示一个不可变的、二进制数据的对象，它可以以文本、二进制的格式读取，以流的方式操作_

### 使用

#### 创建 Blob 对象

`new Blob(array, options?)` 构造函数用于创建一个新的 Blob 对象。

- 第一个参数 array 接受一个可迭代对象，比如 `Array`、 `Blob`、`ArrayBuffer TypedArray DataView`等或者任意这些元素的混合。
- 第二个参数 options 是一个可选的对象，用于设置 Blob 的属性。
  - type：表示 Blob 的 MIME 类型，如 `text/plain`、`image/png` 等。默认为 `""`。

#### Blob 对象

属性：

- size：表示 Blob 对象的大小，单位为字节。
- type：表示 Blob 对象的 MIME 类型。

方法：

- arrayBuffer()：返回一个 Promise，其会兑现一个包含 Blob 所有内容的二进制格式的 ArrayBuffer。
- text()：返回一个 Promise，其会兑现一个包含 Blob 所有内容的 UTF-8 格式的字符串。
- stream()：返回一个 ReadableStream 对象，用于读取 Blob 对象的内容。
- slice()：看名字也知道，返回一个新的 Blob 对象，包含了原始 Blob 对象的指定范围内的数据。

Blob.arrayBuffer() 与 FileReader 的 readAsArrayBuffer() 的区别：

- FileReader.readAsArrayBuffer() 对 Blob 和 File 对象都适用。
- Blob.arrayBuffer() 返回一个 promise 对象，而 FileReader.readAsArrayBuffer() 是一个基于事件的 API。

Blob.text() 与 FileReader 的 readAsText() 的区别：

- FileReader.readAsText() 对 Blob 和 File 对象都适用。
- Blob.text() 返回一个 promise 对象，而 FileReader.readAsText() 是一个基于事件的 API。
- Blob.text() 总是使用 UTF-8 进行编码，而 FileReader.readAsText() 可以使用不同编码方式，取决于 blob 的类型和一个指定的编码名称。

slice(start?, end?, contentType?)

- start：开始的字节索引，默认为 0。如果是一个负数，表示从后向前开始计算。如 slice(-2) 表示从倒数第二个字节开始获取数据。如果 start 大于 blob 对象的长度，则返回一个不包含任何数据的 Blob 对象。
- end：结束的字节索引，默认为 blob 对象的大小。
- 注意是 [start, end) 的区间，即包含 start，不包含 end。
- contentType：表示新 Blob 对象的 MIME 类型，默认为空字符串。

## ArrayBuffer 与 Blob 有什么区别

ArrayBuffer 和 Blob 都是用于处理二进制数据的 JavaScript 对象。

但它们在用途和特性上有一些区别：

- 可变性：ArrayBuffer 是可变的，你可以通过 TypedArray 或 DataView 修改 ArrayBuffer 中的数据。而 Blob 是不可变的，一旦创建，就不能修改 Blob 中的数据。
- 内存管理：ArrayBuffer 的内存是立即分配的，当你创建一个 ArrayBuffer 时，JavaScript 会立即为它分配指定大小的内存。而 Blob 的内存是延迟分配的，当你创建一个 Blob 时，JavaScript 只是记录了 Blob 的元数据和数据源，只有当你实际读取 Blob 的数据时，JavaScript 才会为它分配内存。
- 使用场景：ArrayBuffer 主要用于处理 **需要修改** 的二进制数据，例如 WebGL 的顶点数据、Web Audio API 的音频数据、二进制协议的数据等。而 Blob 主要用于处理 **大型的、不需要修改** 的二进制数据，例如文件、图像、音频、视频等
- 性能：由于 Blob 的内存是延迟分配的，所以创建 Blob 的性能通常比创建 ArrayBuffer 的性能更好，特别是对于大型的二进制数据。而且，由于 Blob 是不可变的，所以你可以安全地在多个 Web Worker 之间传递 Blob，而不需要担心数据竞争。

总的来说，如果你需要修改数据，或者需要立即访问数据，那么 ArrayBuffer 可能是更好的选择。如果你处理的数据很大，或者不需要修改数据，那么 Blob 可能是更好的选择。

# JS 中的文件操作

File、FileReader、Stream API、base64、URL、
数据类型转换。

## File

### 是什么

File 继承自 Blob。所以他也是一个表示不可变的、二进制数据的对象，但它新增了文件名称、上次修改时间等信息，可以说 File 对象就表示一个文件。

### 使用

#### 创建 File 对象

File 对象通常来自用户使用 `<input>` 元素上传的文件返回的 `FileList` 类数组对象，或者拖放操作的 `DataTransfer` 对象中。

也可以使用 File 构造函数来创建一个 File 对象。 `new File(array, name, options?)`

- array：表示文件的内容，与 Blob 相同。可以是一个 `Array`、`Blob`、`ArrayBuffer`、`TypedArray`、`DataView` 等或他们的组合。
- fileName：表示文件的名称。
- options
  - type：表示文件的 MIME 类型，默认为 `""`。
  - lastModified：表示文件的最后修改时间，默认为当前时间。
  - endings: 如果数据是文本，如何解释内容中的换行符 ( \n )。可以是 `transparent`、`native`。默认为 `transparent`。前者为不做处理，后者为将 `\n` 转换为操作系统的换行符。

#### 属性和方法

属性

- Blob 对象的属性：size、type
- lastModified：表示文件的最后修改时间。
- name：表示文件的名称。
- webkitRelativePath：在选择文件夹上传其所有文件时，表示文件对于这个文件夹的相对路径。（因为文件夹中还可能存在嵌套的文件夹，这可以分辨文件的原始位置）

方法

- Blob 对象的方法：arrayBuffer()、text()、stream()、slice()

## FileReader

### 是什么

是一个读取 Blob 或 File 对象中的数据的 API。它提供了异步读取文件的方法，可以读取文件的内容，以及文件的元数据。

### 为什么

为什么不使用 Blob 的 `text()` `arrayBuffer()` 方法来读取数据？我该如何选择？

Blob 的方法只能提供读取文件内容的功能，而 FileReader 还可以获取读取进度、处理读取错误、取消读取等功能。

### 使用

```js
const file = new File(["Hello, world!"], "hello.txt", {
  type: "text/plain",
});

const fileReader = new FileReader();

fileReader.onload = (event) => {
  console.log(event.target.result); // Hello, world!
};

fileReader.readAsText(file);
```

FileReader 对象的属性：

- readyState：表示 FileReader 对象的状态。0：尚未加载任何数据；1：当前正在加载数据；2：整个读取请求已经完成。
- error：表示读取过程中发生的错误。
- result：表示读取的结果。根据读取的方式不同，可能是一个字符串、ArrayBuffer 对象、Data URL、null。

FileReader 对象的方法：

- abort()：终止读取操作。执行后，readyState 变为 2，result 变为 null。
- readAsArrayBuffer(blob)：读取完成后，result 是一个 ArrayBuffer 对象。
- readAsText(blob, encoding?)：读取完成后，result 是一个字符串。encoding 表示编码方式，默认为 UTF-8。
- readAsDataURL(blob)：读取完成后，result 是一个 Data URL。

事件：

- onload：加载完成，并成功
- onerror：加载失败
- onabort：加载失败
- onloadend：加载完成，无论是否成功
- onloadstart: 加载开始
- onprogress: 读取数据时定期触发。

## input:file

可以使用 `<input type="file">` 元素来让用户选择文件。

### value 属性

input 元素表示用户输入，都有 value 属性。input:file 元素当然也有，但是它的 value 属性是只读的，表示用户选择的文件的路径。

- 如果用户没有选择文件，value 为空字符串。
- 用户选择多个文件时，value 为第一个文件的路径。
- 这个路径并不是文件在用户设备上的真实路径，而是一个虚拟路径，用于表示文件的名称。格式为 `C:\fakepath\filename`，无论是什么操作系统。如 `C:\fakepath\hello.txt`。

### 独有属性

除了 input 元素共享的的公共属性外，input:file 元素还有一些独有的属性。

- accept：接受一个字符串，定义用户上传文件的类型。这个字符串应该是一个以逗号分隔的 _文件类型说明符_。
- multiple：表示是否允许用户选择多个文件。默认为 false。
- files：表示用户选择的文件列表。是一个 FileList 对象（类数组对象），每个元素都是一个 File 对象。

:::tip
accept 属性限制用户选择文件的类型，但无论在什么操作系统提供的文件上传窗口上，用户都可以解除这个限制，所以应该在上传处理程序中做文件类型检查。
:::

### 文件类型说明符

- 不区分大小写的文件扩展名，以 `.` 开头。如 `.jpg`、`.png`、`.doc`。
- MIME 类型字符串。如 `image/png`、`application/pdf`、`video/mp4`。
- `video/*`、`audio/*`、`image/*` 表示所有视频、音频、图片类型。

`input:accept` 属性可以接受一个或多个文件类型说明符，用逗号分隔。

`<input type="file" accept="image/*,.pdf">` 表示只允许上传所有类型的图片和 pdf 类型文件。

### 非标准属性

- webkitdirectory：表示是否允许用户选择文件夹。默认为 false。
  - 当设置为 true 时，用户只能选择文件夹，不能选择文件。
  - 会上传文件夹内的所有文件，包括嵌套文件夹中的内容。
  - 上传之后，File 对象的 webkitRelativePath 属性会有值，表示该文件对于这个文件夹的相对路径。

这个属性目前在 safari on ios 和 firefox on android 上不受支持。

### 事件

change 事件：当用户选择文件后触发。
cancel 事件：当用户上传之前上传过的文件时触发；通过文件上传窗口的取消按钮触发。

```js
const filePicker = document.getElementById("filePicker");

filePicker.addEventListener("change", (event) => {
  console.log(filePicker.files);
});

filePicker.addEventListener("cancel", (event) => {
  console.log("cancel");
});
```

## 实战：用户上传文件

用户可以通过 `input:file`、拖拽文件、在编辑框中粘贴文件三种方式上传文件。

### input:file

关键点

1. 通常不使用 input:file 元素的样式，因为其在不同浏览器上的样式不一致。我们可以将其设置为 `display: none`，然后使用一个任意 UI 来主动触发 input:file 的点击事件。

2. accept 属性可以限制用户上传的文件类型，但用户可以在系统的文件选择窗口中解除这个限制。所以应该在上传处理程序中做文件类型检查。

3. 使用 `URL.createObjectURL()` 方法将 File 对象转换为 URL，然后将这个 URL 赋值给一个 img 元素的 src 属性，就可以预览图片。

[实战：input:file 上传文件](https://codesandbox.io/p/devbox/simple-upload-file-26tk7f)

### 拖拽上传

xxx

## 实战：大文件切片上传

用户上传文件 -> 上传服务器

为什么要切片上传？

因为文件过大上传时间过长，and xxx

如何实现？

利用 slice 方法将文件切割成指定大小的块，然后发起多个网络请求，并发上传。后端接收到这些块后，再按顺序合并成一个完整的文件。

关键点：

1. 如何实现上传文件数据。

2. 并发上传到后端后，后端如何知道所有切片上传完成，如何按顺序合并文件。

实现：

HTML5 中新增的 `FormData` 对象，可以方便地将表单数据和文件一起发送到服务器。

## 实战：在线预览文件

## 实战：从服务端下载文件

# Stream API

https://juejin.cn/post/6992007156320960542

### 前置

HTTP 协议的数据是以流的方式传递的，这种方式的好处是，你不需要等待所有的数据都准备好才开始发送或接收。

而 XMLHttpRequest API 只能等待整个响应都接收完毕后才能开始处理数据。即它不能以流的方式处理数据。

而 Fetch API 可以，他的响应对象中的响应体是一个 ReadableStream 对象，可以通过流的方式处理数据。这个 ReadableStream 对象就是 Stream API 的一部分。

### 是什么

Stream API 是一种用于处理流数据的 API。它提供了一种机制，可以让你以流的方式处理数据，而不是等待所有数据都准备好才开始处理。

流的方式处理数据：流会将接收的资源分成一个个小的分块，然后按位处理它。

数据流可以是从网络请求接收的数据流，也可以我们自己创建的数据流。

### 有什么用

什么场景下需要以流的方式处理数据？

通常用于处理视频、图片、文本文件等资源。如图像的逐渐加载，视频的逐渐播放。

总的来说，任何你需要逐块处理数据，而不是一次性处理所有数据的场景，都可以考虑使用流。

```

```
