react-spring 是一个主打弹簧动画的动画库。

他有两个核心概念：animated 组件和 springValue 对象。

实际处理动画的组件是 animated 组件，他通过接受一个或多个 springValue 对象来实现动画效果。

——————

一次性动画：

```jsx
function App() {
  const springs = useSpring({
    from: { width: 0, height: 0 },
    to: { width: 100, height: 100 },
    config: { duration: 2000 },
  });

  console.log(springs);

  return (
    <animated.div
      style={{
        background: "#ff6d6d",
        borderRadius: 8,
        ...springs,
      }}
    />
  );
}
```

useSpring 接受一个配置对象，通过 from 和 to 来定义动画的起始和结束状态，通过 config 来定义动画的配置。

他返回一个对象：将这两个 springValue 对象添加到 animated 组件的 style 属性中，就可以实现动画效果。

```js
{
    width: springValue,
    height: springValue,
}
```

手动触发动画：

```jsx
function App() {
  const [springs, api] = useSpring(() => ({
    from: { width: 0, height: 0 },
    config: { duration: 2000 },
  }));

  return (
    <>
      <animated.div
        style={{
          background: "#ff6d6d",
          borderRadius: 8,
          ...springs,
        }}
      />
      <button onClick={() => api.start({ width: 100, height: 100 })}>
        触发
      </button>
      <button onClick={() => api.pause()}>暂停</button>
      <button onClick={() => api.resume()}>继续动画</button>
      <button onClick={() => api.stop()}>停止</button>
      <button onClick={() => api.start({ width: 0, height: 0 })}>重置</button>
    </>
  );
}
```

为 useSpring 传入一个返回配置对象的函数，这样 useSpring 的返回值是一个数组，第二个参数 api，是一个对象，包含了操作动画的方法。

注意！只要配置对象中存在 to 属性，动画就会自动触发，不需要手动调用 start 方法。所以这里不能再配置对象传入 to 属性，而是在点击事件中调用 start 方法时传入目标。

如果想要连续触发不同的动画效果，只要在事件处理函数中连续调用 start 方法即可。

——————

那如何设置弹簧动画呢？

可以在配置对象中的 config 对象中不设置 duration 属性，而是弹簧动画相关的属性。

mass： 质量（也就是重量），质量越大，回弹惯性越大，**回弹的距离和次数越多**
tension: 张力，弹簧松紧程度，弹簧越紧，**回弹速度越快**
friction：摩擦力，增加点阻力可以 **抵消** 质量和张力的效果

```jsx
function App() {
  const [springs, api] = useSpring(() => ({
    from: { width: 0, height: 0 },
    config: {
      mass: 2,
      tension: 200,
      friction: 10,
    },
  }));

  return (
    <>
      <animated.div
        style={{
          background: "#ff6d6d",
          borderRadius: 8,
          ...springs,
        }}
      />
      <button onClick={() => api.start({ width: 100, height: 100 })}>
        触发
      </button>
    </>
  );
}
```

——————

为多个 animated 组件设置同时触发的动画效果：使用 useSprings

```jsx
function App() {
  const [springs, api] = useSprings(3, () => ({
    from: { width: 0, height: 0 },
    config: {
      mass: 2,
      tension: 200,
      friction: 10,
    },
  }));

  console.log(springs);

  return (
    <>
      {springs.map((spring, index) => {
        return (
          <animated.div
            key={index}
            style={{
              background: "#ff6d6d",
              borderRadius: 8,
              ...spring,
            }}
          />
        );
      })}
      <button onClick={() => api.start({ width: 100, height: 100 })}>
        触发
      </button>
    </>
  );
}
```

useSprings 接受两个参数，第一个参数是元素的数量，第二个参数是一个返回配置对象的函数。 返回的 springs 是一个数组。

通过 map 方法，将每个 spring 对象添加到 animated 组件的 style 属性中，就可以实现多个元素同时触发动画效果。注意，这里用 map 只是举例，也可以手动为多个不同的 animated 组件设置动画效果。

如果你想为每个动画效果设置不同的 to 对象，也可以为 api.start 方法传入一个方法，方法的参数为 index，需要返回一个 to 对象。如 `api.start(index => ({ width: 100 * (index + 1), height: 100 * (index + 1) }))`。这样每个元素的动画效果就不一样了。

——————

为多个 animated 组件设置 **依次执行的** 动画效果：使用 useTrail

```jsx
function App() {
  const [springs, api] = useTrail(3, () => ({
    from: { width: 0, height: 0 },
    config: {
      mass: 2,
      tension: 200,
      friction: 10,
    },
  }));

  console.log(springs);

  return (
    <>
      {springs.map((spring, index) => {
        return (
          <animated.div
            key={index}
            style={{
              background: "#ff6d6d",
              borderRadius: 8,
              ...spring,
            }}
          />
        );
      })}
      <button onClick={() => api.start({ width: 100, height: 100 })}>
        触发
      </button>
    </>
  );
}
```

代码和 useSprings 相同，只是将 hook 换为 useTrail。

注意，这里用 map 只是举例，也可以手动为多个不同的 animated 组件设置动画效果。

同理，也可以为 api.start 传入一个方法，实现不同的动画效果。

————————

之前的 API 设置的动画都设置多个 CSS 属性，如果只想设置一个属性，可以使用 useSpringValue

```jsx
function App() {
  const width = useSpringValue(50, {
    config: {
      mass: 2,
      tension: 200,
      friction: 10,
    },
  });

  return (
    <>
      <animated.div
        style={{
          height: 100,
          background: "#ff6d6d",
          borderRadius: 8,
          width,
        }}
      />
      <button onClick={() => width.start(300)}>触发</button>
    </>
  );
}
```

useSpringValue 的第一个参数是 CSS 属性的初始值。这个配置对象就不用传函数了，因为 useSpringValue 的返回值就是一个 springValue 对象。他可以直接调用 start 方法，传入目标值，就可以触发动画效果。配置对象和 start 方法中，不用传入 from 和 to 了。

-——————

设置多个动画依次执行，使用 useChain

```jsx
function App() {
  const api1 = useSpringRef();

  const [springs] = useTrail(
    3,
    () => ({
      ref: api1,
      from: { width: 0 },
      to: { width: 300 },
      config: {
        duration: 1000,
      },
    }),
    []
  );

  const api2 = useSpringRef();

  const [springs2] = useSprings(
    3,
    () => ({
      ref: api2,
      from: { height: 100 },
      to: { height: 50 },
      config: {
        duration: 1000,
      },
    }),
    []
  );

  useChain([api1, api2], [0, 1], 500); // 第二个参数第一动画的执行顺序，第三个参数是第一个动画执行完后，第二个动画开始的时间。

  return (
    <>
      {springs.map((spring1, i) => (
        <animated.div
          key={i}
          style={{
            height: 100,
            margin: 10,
            background: "blue",
            ...spring1,
            ...springs2[i],
          }}
        />
      ))}
    </>
  );
}
```
