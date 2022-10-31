## enum, keyof, typeof

### enum

> 개인적으로는 많이 사용하는 문법은 아니다. ^^;<br /><br />
> 다른 강의들을 봐도 실무에서는 사용을 잘 안하지만, <br />
> 강의다보니 문법을 다루는 과정에서 설명은 하고 넘어가야 하는 파트라는 느낌이 든다.<br />
> 오히려 '객체'를 더 폭 넓게 사용하는 방향으로 익혀놓는 것이 더 유용해보인다.

#### 문법

```ts
enum EDirection {
  Up, // 0 (시작값을 설정할수도 있다. - ex. 3 / 문자열을 할당할 수도 있다.)
  Down, // 1
  Left, // 2
  Right, // 3
}

const a = EDirection.Up;
const b = EDirection.Left;
```

비슷한 목적으로 사용할 경우, 객체를 더 많이 활용한다.

```ts
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const; // ✅ as const
```

#### `as const`, 타입스크립트가 추론을 제대로 하지 못하는 경우

```ts
/* 객체의 타입추론 결과
const ODirection: {
  Up: number;
  Down: number;
  Left: number;
  Right: number;
}
※ 모두 number가 됐다. Up: 0, Down: 1, Left: 2, Right: 3 의 형태로 사용하고 싶다.
*/
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

/* 타입을 직접 지정했을 때 타입추론 결과
const ODirection: {
    Up: 0;
    Down: 1;
    Left: 2;
    Right: 3;
}
*/
const ODirection: { Up: 0; Down: 1; Left: 2; Right: 3 } = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

/* as const 사용한 타입추론 결과 
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;
*/
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;
```

<br />

#### enum을 그대로 타입으로 사용할수도 있다.

```ts
// Using the enum as a parameter
function walk(dir: EDirection) {}
```

enum을 사용하기 싫다면 다음과 같이도 사용할 수 있다.

```ts
// It requires an extra line to pull out the keys
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}

walk(EDirection.Left);
run(ODirection.Right);
```

enum을 쓰고 싶어지지만, 이것도 알고보면 어려운 건 아니다.<br />
`keyof` 와 `typeof`에 대해 알아보자.

<br />

### '값'을 '타입'으로 사용하고 싶은 경우의 `typeof`와 key로 타입을 지정하고 싶은 경우의 `keyof`.  그리고...

#### typeof

```ts
const obj = { a: "123", b: "hello", c: "world" };
type Key = keyof obj; // ❌ 'obj' refers to a value, but is being used as a type here. Did you mean 'typeof obj'?ts(2749)

type Key = keyof typeof obj;
```

> `keyof`는 타입스크립트의 문법으로 키를 추출해 타입으로 만드는 문법이다.<br />
> '자바스크립트의 값'은 '타입'으로 쓸 수 없는데, obj 변수에 할당한 것이 자바스크립트의 값(object)이다. 그래서 타입스크립트가 'obj는 자바스크립트의값인데 타입으로 사용하고 있다고 알려주면서 'typeof obj'를 뜻하는게 아니냐'고 묻는 것이다.<br />
> 그래서 `typeof`를 사용해 타입으로 만든 후 `keyof`로 그 타입의 키를 추출해 타입으로 만들었다. <br />

#### keyof

```ts
const obj = { a: "123", b: "hello", c: "world" };
// [타입 추론] type Key = "a" | "b" | "c"
type Key = keyof typeof obj; // obj의 키만을 추출해 타입으로 사용한다는 것을 알 수 있다.

const d: Key = "a";
const e: Key = "b";
const f: Key = "c";

const g: Key = "123"; // ❌ Type '"123"' is not assignable to type '"a" | "b" | "c"'.ts(2322)
```

#### 반대로, value만 가져오고 싶은 경우

`typeof obj[keyof typeof obj]`

```ts
const obj = { a: "123", b: "hello", c: "world" } as const;
// [타입 추론] type Key = "123" | "hello" | "world"
type Key = typeof obj[keyof typeof obj];

const d: Key = "a"; // ❌ - Type '"a"' is not assignable to type 'Key'.ts(2322)
const e: Key = "b"; // ❌
const f: Key = "c"; // ❌

const g: Key = "123";
```
