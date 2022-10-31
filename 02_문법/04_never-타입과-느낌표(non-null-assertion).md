## never 타입과 느낌표(non-null assertion)

never, unknown, any 타입을 주의해야 한다. any는 최대한 피하고 쓰더라도 나중에 꼭 제대로 타이핑을 하는 것이 좋다.<br /><br />

[never 좋은 설명 글 - 타입스크립트의 never 타입 완벽 가이드 (toast-ui)](https://ui.toast.com/weekly-pick/ko_20220323)

> 문법, lib.es5.d.ts 분석, 유틸리티 타입을 모두 본 후에 읽어보는 것이 좋다. :)

- `never` 타입의 정의와 목적
  - (타입은 가능한 값의 집합)
  - `never`는 '불가능'을 표현하기 위해 존재한다.
- 다양한 사용 예시
  - 유니언, 인터섹션의 `never`의 동작(0의 덧셈과 곱셈같이)
  - `never` 타입이 빈 타입이라는 것을 활용해 '기능 제약' 수행
  - 원하지 않는 유니언 타입의 멤버 및 객체 타입의 속성 필터링
  - 제어 흐름 분석 지원
  - 유효하지 않거나 도달할 수 없는 분기 표시
- '암묵적' 타입 교차로 인해 타입 오류 메시지에서 예기치 않게 `never`가 나타나는 이유
- 타입이 실제 `never`타입인지 확인하는 방법

<br />

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
  const arr = []; // [타입추론] const arr: never[]

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
const head = document.querySelector("#head"); // [타입 추론] const head: Element | null
```

> 타입스크립트가 id가 head인 엘리먼트가 없는 경우에 대한 상황까지 고려해 head의 타입을 `Element | null`로 추론한다.

이와 같은 null이나 undefined을 개발자가 직접 지정하는. 반드시 있다고 보장하는. <br />
즉, 지금과 같은 상황에서는 'id가 head인 엘리먼트가 무조건 있다'는 걸 개발자가 직접 보장하는 문법이 `!`이다.<br />

```ts
const head = document.querySelector("#head")!; // 코드 마지막에 '!'를 붙인 타입추론 결과 - const head: Element
```

하지만 추천되는 방식은 아니다. (다른 사람의 코드를 읽기위해 있다는 정도만 알고가는 느낌)<br />
<br />
왜냐하면 만약 누군가 id가 head였던 엘리먼트를 header로 변경하고, 스크립트를 그에 맞게 수정하지 않는 문제도 생길 수 있기 때문이다.<br />
(그 유명한 `Cannot read properties of null` 에러가 뿜뿜할수도 있고)<br />

```html
<!-- 만약 누군가 엘리먼트 id를 "head"에서 "header"로 변경했다. -->
<div id="header"></div>
```

```ts
// 하지만 기존에 head가 있을거라고 보장했던 스크립트에서 이를 수정하지 않았을 경우에는 문제가 생길 수 있는 여지가 있다. (사람이 하는 일 🥲)
const head = document.querySelector("#head")!;
if (head) {
  head.innerHTML = "hello";
}
```
<br />

타입스크립트는 코드의 에러가 발생할 것 같은 요인을 찾아서 알려주니,

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

> 최대한 '!'대신 if를 사용하는 것이 좋다.
