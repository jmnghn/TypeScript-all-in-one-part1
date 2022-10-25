## filter 제네릭 분석

### filter 1

```ts
// filtered의 타입 추론 결과 - const filtered: number[]
// value의 타입 추론 결과 - (parameter) value: number
const filtered = [1, 2, 3, 4, 5].filter((value) => value % 2);
```

#### lib.es5.d.ts에 정의된 filter 제네릭

filter는 제네릭 타입이 두 개다. 😳 <br />
return 타입에 형식 조건자 is를 사용한 커스텀 타입가드 하나, 'unknown'인 것 하나.<br />
(대부분 커스탐 타입가드로 수렴하지 않을까? 라는 생각이 든다. 그럼 어떤 예외적인 상황을 위한 unknown인 것일까? 어떤 예외적인 상황들이 있을까?)

```ts
interface Array<T> {
  // 인자타입으로 인해 반환타입이 바껴질 여지가 없다.
  filter(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T[];
  // S로 인해 반환타입이 충분히 바뀔 수 있다. (형식 조건자 is의 힘...!)
  filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): S[];
}

// const filtered = [1, 2, 3, 4, 5].filter((value) => value % 2); 에 맞게 타입을 변경해보자.
// T는 인자로 인해 number, S도 반환타입으로 인해 number. 를 추론할 수 있다.
// 💡!... 👍🏻
interface Array<T> {
  filter<S extends number>(
    predicate: (
      value: number,
      index: number,
      array: number[]
    ) => value is number,
    thisArg?: any
  ): number[];
}
```

<br />

### filter 2

```ts
// filtered 타입추론 결과 - const filtered2: (string | number)[]
// value 타입추론 결과 - (parameter) value: string | number
const filtered2 = ["1", 2, "3", 4, "5"].filter(
  (value) => typeof value === "string"
);
```

하지만 내가 원하는 건 filtered의 타입이 `string[]`이 되는 것이라면... (형식조건자 `is`)

```ts
const predicate = (value: string | number): value is string => typeof value === "string";
```
