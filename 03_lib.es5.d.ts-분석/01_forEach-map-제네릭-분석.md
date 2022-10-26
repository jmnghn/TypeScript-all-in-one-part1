## forEach, map 제네릭 분석

### forEach

```ts
// value 인자의 타입 추론 - (parameter) value: number
[1, 2, 3].forEach((value) => {
  console.log(value);
});

// value 인자의 타입 추론 - (parameter) value: string
["1", "2", "3"].forEach((value) => {
  console.log(value);
});

// value 인자의 타입 추론 - (parameter) value: boolean
[true, false, true].forEach((value) => {
  console.log(value);
});

// value 인자의 타입 추론 - (parameter) value: string | number | boolean
["123", 123, true].forEach((value) => {
  console.log(value);
});
```

> 아니 어떻게 이렇게 추론을 잘해주지...? 마법인가...?😅 → 제네릭 덕분.<br />

<br />

#### lib.es5.d.ts에 정의된 forEach의 제네릭

```ts
interface Array<T> {
  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): void;
}
```

> 이처럼 타입을 'T'로 묶어놨기 때문에...:) 인자의 타입으로 추론할 수 있다.<br />

<br />

#### forEach와 별개로 제네릭에 대한 참고사항

※ 다시 말하지만,(!)

```ts
function a(x: number | string, y: number | string) {}
// 위 함수와 같이 '|'를 사용하면, 아래와 같은 타입이 불일치하는 호출까지 허용이 된다.
// (사실 인자의 number, string을 모두 허용해서 return 타입을 number | string 으로 하는 것도 타입스크립트에서는 말이 안된다.)
a(1, "2");
a("1", 2);

// 이를 방지하고자 제네릭을 사용하는 것
function b<T>(x: T, y: T): T {
  return x;
}
b(1, 2);
b("1", "2");
b(true, false);

b<number>(1, 2); // type parameter - 타입추론을 하지 못할 경우에만...!

// ※ 참고로 아래 코드는 타입을 '강제지정'한 것이다.
<number>b(1, 2);
```

<br />

### map

```ts
// str의 타입 추론 - const str: string[]
const str = [1, 2, 3].map((item) => item.toString());
```

> map은 어떻게 잘 추론할 수 있었을까?🤔

<br />

#### lib.es5.d.ts에 정의된 map 제네릭

```ts
interface Array<T> {
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[];
}
```

> 😵‍💫

<br />

#### T와 U로 헷갈린다면...

T는 `const str = [1, 2, 3].map((item) => item.toString());`를 예로 number로 변경해보자.<br />
그리고 리턴타입을 살펴보면 있는 U에 `toString()`을 통해 반환할 값은 문자열이니 string으로 변경해보면 다음과 같은 형태가 된다.

```ts
interface Array<T> {
  map<U>(
    callbackfn: (value: number, index: number, array: number[]) => string,
    thisArg?: any
  ): string[];
}
```

> 인자에도 붙은 타입으로 가독성이 안좋아져 알아보기 힘들 수 있지만, `map((item) => item.toString());`와 동일하다는 사실. :)
