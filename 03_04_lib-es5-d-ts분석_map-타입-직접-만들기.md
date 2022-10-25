## map 타입 직접 만들기

### 타입을 만들어보자 - 기본 타입 잡아놓기

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map(callback: (v) => void): void;
}

const a: Arr<number> = [1, 2, 3];
// 타입추론 결과
// - const b: void
// - (parameter) v: any
const b = a.map((v) => v + 1);
```

<br />

### 수정 (제네릭 추가)

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  // 인자의 타입이 T, 함수 내부의 타입도 T, 반환타입은 T[]
  map(callback: (v: T) => T): T[];
}

// 타입추론 결과
// - const b: number[]
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

// 근데 전에 살펴봤던 map의 타입보다 너무 많이 단순한 것 같다... 다른 예를 더 만들어보자.
const c = a.map((v) => v.toString()); // ❌ expect: ['1', '2', '3'] 그리고 string[], ❌ - Type 'string' is not assignable to type 'number'.ts(2322)
```

<br />

### 더 수정 (추가 제네릭을 추가 😄)

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  // S 제네릭을 추가했다.
  map<S>(callback: (v: T) => S): S[];
}

// 타입추론 결과
// - const b: number[]
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

const c = a.map((v) => v.toString()); // ✅ expect: ['1', '2', '3'] 그리고 string[]
```

<br />

#### 추가설명

```ts
interface Arr<T, S> {
  forEach(callback: (item: T) => void): void;
  // 이와같이도 할 수 있지만,
  map(callback: (v: T) => S): S[];
}

// 여기에서 미리 예측을 하고 타이핑을 해야하는데, 그러기는 어려울 것이다.
// 그래서 아까처럼 '사용할 수 있게' 타이핑을 하는 것이다.
const a: Arr<number, ???> = [1, 2, 3];
```

<br />

### 그럼 정말 잘 만들어졌는지 추가로 확인해보자.

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
}

// 타입추론 결과
// - const b: number[]
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

// 타입추론 결과
// - const c: string[]
// - (parameter) v: number
const c = a.map((v) => v.toString());

// 더 확인해보자.
const d = a.map((v) => v % 2 === 0); // ✅ expect: [false, true, false] 그리고 boolean[]
```

> Good. :)

<br />

### lib.es5.d.ts의 map과 직접만든 타입 비교해보자.

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[];
}
```

> 잘 만들어진 것 같다. 이도 마찬가지로
