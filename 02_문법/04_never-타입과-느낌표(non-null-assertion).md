## never 타입과 느낌표(non-null assertion)

never, unknown, any 타입을 주의해야 한다. any는 최대한 피하고 쓰더라도 나중에 꼭 제대로 타이핑을 하는 것이 좋다.<br />

[never 좋은 설명 글 - 타입스크립트의 Never 타입 완벽 가이드 (toast-ui)](https://ui.toast.com/weekly-pick/ko_20220323)

### never 타입

- 빈 배열일 때, never라는 희한한(!) 타입이 나온다.

  ```ts
  try {
    const array = []; // noImplicitAny가 false일 때, array의 타입추론은 const array: never[]
    array[0];
  } catch (error) {
    error;
  }
  ```

  ```ts
  const arr = []; // const arr: never[]

  arr.push(1); // error 💣
  arr.push("hello"); // error 💣
  arr.push(true); // error 💣
  ```

  배열을 사용할 때는 반드시 타입을 지정해줘야 한다. <br />

  ```ts
  const arr: string[] = [];

  arr.push("hello");
  ```

<br />

### ! (non-null assertion)

```ts
const head = document.querySelector("#head"); // 타입 추론 - const head: Element | null
```

> id가 head인 엘리먼트가 없는 경우에 대한 상황까지 고려해 head의 타입은 타입추론을 통해 Element | null 이 된다.

이와 같은 부분(null이나 undefined)을 개발자가 직접 지정하는. 보장하는. <br />
즉, 지금과 같은 상황에서는 'id가 head인 엘리먼트가 무조건 있다'는 걸 개발자가 직접 보장하는 문법이 `!`이다.<br />

```ts
const head = document.querySelector("#head")!; // 코드 마지막에 '!'를 붙인 타입추론 결과 - const head: Element
```

하지만 추천되는 방식은 아니다. (다른 사람의 코드를 읽기위해 있다는 정도만 알고가는 느낌)<br />
왜냐하면 만약 누군가 id가 head였던 엘리먼트를 header로 변경하고, 스크립트를 그에 맞게 수정하지 않는 문제도 생길 수 있기 때문이다.<br />
(그 유명한 `Cannot read properties of null` 에러가 뿜뿜)<br />

```html
<!-- 누군가 엘리먼트의 id를 "head"에서 "header"로 변경했다. -->
<div id="header"></div>
```

```ts
// 하지만 스크립트에서 이를 수정하지 않았을 경우,
const head = document.querySelector("#head")!;
if (head) {
  head.innerHTML = "hello"; // Cannot read properties of null
}
```

타입스크립트는 코드의 에러가 발생할 것 같은 요인을 찾아서 알려준다.

```ts
const head = document.querySelector("#head");
head.innerHTML = "hello"; // Object is possibly 'null'.ts(2531)
```

거기에 맞게 수정하면서 사용하는게 좋다.

```ts
const head = document.querySelector("#head");

// head가 null이면 다음 코드가 실행되지 않고, 런타임 에러가 발생하지 않는다.
if (head) {
  head.innerHTML = "hello";
}
```

> 최대한 '!'대신 if를 사용하는 것을 지향한다.
