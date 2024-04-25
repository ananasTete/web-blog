## IntersectionObserver

是什么？

提供了一种异步观察元素与其祖先元素或文档视口的相对可见性的能力。

为什么？

- 懒加载，在一块区域在可视范围内显示了 3/4 时，才加载他的图片或其他复杂内容。
- 无限滚动。为什么？
- 计算广告的展示次数。
- 根据用户是否会看到某个元素来决定是否执行动画或某个任务。

如何使用？

```html
<div class="wrapper" style="height: 100px; overflow: auto;">
  <div style="height: 200px;"></div>
  <div id="target" style="height: 100px;"></div>
  <div style="height: 200px;"></div>
</div>
```

```js
let options = {
  root: document.querySelector("wrapper"),
  rootMargin: "0px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(callback, options);

observer.observe(document.querySelector("#target"));
```

接受两个参数：

- callback 是一个函数，当被观察的元素与其祖先元素或文档视口交叉时，会调用这个函数。
- options （可选）。是一个配置对象。
  - root：指定根元素，即监听目标元素相对于哪个元素的可见性，必须是目标元素的祖先元素。如果不指定或为 null，默认是视口。
  - rootMargin：指定根元素的边距，可以是一个字符串，也可以是一个对象。
  - threshold：一个阈值或阈值数组，值为 0.1 ～ 1.0。当元素的可见性达到这个阈值时，会触发回调函数。默认值为 0，即只有要一个像素可见就触发回调，如果想全部可见后再触发可以设置为 1。同样可以指定数组 [0, 0.25, 0.5, 0.75, 1]，到达每个值后都会触发一次。

注意！如果是通过滚动控制一个元素显示与隐藏，。比如设置 threshold 为 1，滚动使元素完全显示时触发一次，反向滚动使元素开始失去完全显示时也会触发一次。

```ts
function callback(entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
    // entry.boundingClientRect 是目标元素的矩形区域的信息
    // entry.intersectionRatio 是目标元素与根元素的交叉区域占目标元素的比例
    // entry.intersectionRect 是目标元素与根元素的交叉区域的矩形区域信息
    // entry.isIntersecting 是一个布尔值，表示目标元素是否与根元素交叉
    // entry.rootBounds 是根元素的矩形区域信息
    // entry.target 是被观察的目标元素
    // entry.time 是一个时间戳，表示交叉发生的时间
  });
}
```

回调函数的参数：

- 第一个是一个 IntersectionObserverEntry[] 类型的数组。observer 实例可以监听多个元素，所以这个数组中包含了所有被观察的元素的信息。
- 第二个元素是一个 IntersectionObserver 类型的对象，即创建的 observer 对象。

observer 实例包含什么信息，可以做什么？

包含了 options 配置的信息：

- delay
- root 根元素的引用
- rootMargin 根元素的边距
- rootMargin
- scrollMargin
- thresholds 阈值

包含了观察元素相关的方法：

- observe(target: Element)：开始观察一个元素。
- unobserve(target: Element)：停止观察一个元素。
- disconnect()：停止观察所有元素。
- takeRecords()：返回一个 IntersectionObserverEntry[] 类型的数组，包含了已经检测到但还没有触发回调的 IntersectionObserver 对象组成的数组。一般用于断开观察之前获取所有未处理的更改记录，以便在停止观察者时可以处理任何未处理的更改。

## MutationObserver

是什么？

提供了监听元素的属性和子节点变化的能力。

为什么？

监听节点的变化，比如属性的变化、子节点的增加和删除、文本内容的变化等。

实际案例如更新内容水印。当水印被浏览器插件或 devtool 去掉后，可以监听到这个变化，然后重新添加水印。

如何使用？

```html
<div id="box"><button>光</button></div>
```

```js
function callback(mutationsList, observer) {
  console.log(mutationsList);
}

const observer = new MutationObserver(callback);

observer.observe(box, {
  attributes: true,
  childList: true,
  subtree: true,
});
```

observer.observe() 接受两个参数：第二个是可选的配置对象：

- attributes：是否监听属性的变化。
- attributeFilter：设置要监听的属性名组成的字符串数组。
- attributeOldValue：如果为 true，并且 attributes 选项也为 true，则 MutationRecord 对象的 oldValue 属性将包含变化前的属性值。
- childList：如果为 true，则观察目标节点（以及在 subtree 为 true 时的所有后代节点）的子节点的添加和删除。
- subtree：如果为 true，则观察目标节点（以及在 subtree 为 true 时的后代节点）的属性变化。
- characterData：如果为 true，则观察目标节点（以及在 subtree 为 true 时的后代节点）的文本内容或字符数据的变化。
- characterDataOldValue：如果为 true，并且 characterData 选项也为 true，则 MutationRecord 对象的 oldValue 属性将包含变化前的数据。

回调函数的参数：第一个为 MutationRecord[] 类型的数组，包含了每一个监听的对象的变化信息。第二个参数是 MutationObserver 对象。

- type：变化的类型，有三种：attributes、childList、characterData。
- target：发生变化的节点。
- addedNodes：新增的节点。
- removedNodes：删除的节点。
- previousSibling：前一个同级节点。
- nextSibling：后一个同级节点。
- attributeName：发生变化的属性名。
- attributeNamespace：发生变化的属性的命名空间。
- oldValue：发生变化的属性的旧值。

MutationObserver 实例的方法：

- observe(target: Node, options: MutationObserverInit)：开始观察一个节点。
- disconnect()：停止观察。
- takeRecords()：返回一个 MutationRecord[] 类型的数组，包含了已经检测到但还没有触发回调的 MutationRecord 对象组成的数组。一般用于断开观察之前获取所有未处理的更改记录，以便在停止观察者时可以处理任何未处理的更改。

## ResizeObserver

是什么？

监听元素的盒模型尺寸的变化。在内容盒下，会监听元素的宽高变化；在边框盒下，会监听元素的宽高、内边距、边框的变化。

为什么？

- 响应式布局。比如监听元素的宽度变化，然后根据宽度的变化来调整元素的布局；或者使内部元素的尺寸跟随变化。

如何使用？

```html
<div id="box" style="width: 100px; height: 100px; background: blue"></div>
```

```js
const box = document.querySelector("#box");

setTimeout(() => {
  box.style.width = "20px";
}, 3000);

function callback(entries, observer) {
  console.log("当前大小", entries);
}

const resizeObserver = new ResizeObserver(callback);

resizeObserver.observe(box);
```

回调函数的参数：第一个是 ResizeObserverEntry[] 类型的数组，包含了每一个监听的对象的变化信息。第二个参数是 ResizeObserver 对象。

ResizeObserverEntry 对象包含了：

- target：发生变化的节点的引用。
- contentRect：一个 DOMRectReadOnly 对象，包含了变化后的元素的盒模型尺寸信息。如例子中 `{ bottom: 100, height: 100, left: 0, right: 20, top: 0, width: 20, x: 0, y: 0 }`。
- borderBoxSize：一个对象数组，对象包含了元素的边框盒的尺寸信息。如 `{ blockSize: 100, inlineSize: 20 }`，blockSize 是高度，inlineSize 是宽度（包含内边距和边框）。为什么是数组？
- contentBoxSize：一个对象数组，包含了元素的内容盒尺寸信息。同上。
- devicePixelContentBoxSize：一个对象，包含了元素的设备像素内容盒尺寸信息。如 `{ blockSize: 200, inlineSize: 40 }`。

ResizeObserver 实例的方法：

- observe(target: Element)：开始观察一个元素。
- unobserve(target: Element)：停止观察一个元素。
- disconnect()：停止观察所有元素。
