## filter 타입 직접 만들기

### 기본 타입 잡아놓기

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  filter(callback: (v: T) => void): void;
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: void ❌
// - (parameter) v: number
const b = a.filter((v) => v % 2 === 0); // expect: [2] 그리고 number[]
```

<br />

### 구현 - 제네릭 추가

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  filter(callback: (v: T) => boolean): T[];
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: number[] ✅
// - (parameter) v: number
const b = a.filter((v) => v % 2 === 0); // expect: [2] 그리고 number[]

// 더 검증해보자.
const c: Arr<number | string> = [1, "2", 3, "4", 5];
// 타입추론 결과
// - const d: (string | number)[] ❌
// - (parameter) v: string | number ❌
const d = c.filter((v) => typeof v === "string"); // expect: ['2', '4'] 그리고 string[]
```

<br />

### 수정 - is를 추가해보자.

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  // v is T로 수정
  filter(callback: (v: T) => v is T): T[];
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: number[] ✅
// - (parameter) v: number
const b = a.filter((v): v is number => v % 2 === 0); // expect: [2] 그리고 number[]

// 됐나...? Nope.
const c: Arr<number | string> = [1, "2", 3, "4", 5];
// 타입추론 결과
// - const d: (string | number)[] ❌
// - (parameter) v: string | number
const d = c.filter((v): v is string => typeof v === "string"); // expect: ['2', '4'] 그리고 string[]
```

> 모든 에러는 사라졌지만, 원하는대로 타입이 지정되지 않는다.

<br />

### 수정 - 제네릭 더 추가 (S)

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  // v is S로 수정
  filter<S>(callback: (v: T) => v is S): S[];
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: number[] ✅
// - (parameter) v: number
const b = a.filter((v): v is number => v % 2 === 0); // expect: [2] 그리고 number[]

const c: Arr<number | string> = [1, "2", 3, "4", 5];
// 타입추론 결과
// - const d: string[] ✅
// - (parameter) v: string | number
const d = c.filter((v): v is string => typeof v === "string"); // expect: ['2', '4'] 그리고 string[]

// 성공...? 하지만 v is S에서 S에 빨간줄!
// A type predicate's type must be assignable to its parameter's type.
// Type 'S' is not assignable to type 'T'.
// 'T' could be instantiated with an arbitrary type which could be unrelated to 'S'.ts(2677)
```

> S와 T의 관계에 대한 지정을 아무것도 해주지 않은 상태다.

<br />

### 수정 - S와 T의 관계 설정(extends)

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  // 'S는 T의 부분집합이야. 그래서 T가 S로 좁혀질 수 있어.', S extends T
  filter<S extends T>(callback: (v: T) => v is S): S[];
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: number[] ✅
// - (parameter) v: number
const b = a.filter((v): v is number => v % 2 === 0); // expect: [2] 그리고 number[]

const c: Arr<number | string> = [1, "2", 3, "4", 5];
// 타입추론 결과
// - const d: string[] ✅
// - (parameter) v: string | number
const d = c.filter((v): v is string => typeof v === "string"); // expect: ['2', '4'] 그리고 string[]

// 더 검증해보자
const e = c.filter((v) => typeof v === "number"); // expect: [1, 3, 5] 그리고 number[] // ❌ 형식 조건자로 만들어줘야하므로 에러가 난다.

// 형식 조건자를 추가해주자. (v is number)
// 타입추론 결과
// - const e: string[] ✅
// - (parameter) v: string | number
const e = c.filter((v): v is number => typeof v === "number"); // expect: [1, 3, 5] 그리고 number[]

// v is number로 가독성을 많이 해치는 것 같으면 바깥으로 빼도 된다.
// (※ 그럼에도 불구하고 인라인이건 바깥으로빼건, 타입스크립트는 가독성이 좋지 못하다 😅)
const predicate = (v: string | number): v is number => typeof v === "number";
const f = c.filter(predicate);
```

> 지난 번처럼 문법을 읽히고 분석할 때와는 또 전혀 다른 느낌이 든다. 😳 ㅋㅋ 이리도 생경하다니

<br />

#### 만들어나간 과정 다시 살펴보기

```ts
interface Arr<T> {
  filter(): void;
  filter(callback: () => void): void;
  filter(callback: (v: T) => void): void;
  filter(callback: (v: T) => void): T[];
  filter<S>(callback: (v: T) => v is S): T[];
  filter<S extends T>(callback: (v: T) => v is S): T[];
}
```

<br />

읽는 것도 읽는거지만, 이렇게 직접 만들어보는 방식의 학습방식도 추천한다. 나머지도 만들어보자...:) reduce, splice, slice, ...:)
