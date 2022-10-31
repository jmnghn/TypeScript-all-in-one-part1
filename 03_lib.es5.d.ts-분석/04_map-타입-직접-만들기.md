## map 타입 직접 만들기

<br />

### 타입을 만들어보자 - 기본 형태 잡아놓기

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map(callback: (v) => void): void; // 기본 형태 잡아놓기
}

const a: Arr<number> = [1, 2, 3];
// [타입추론 결과]
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

// [타입추론 결과]
// - const b: number[]
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

// 근데 너무 많이 단순한 것 같다... 다른 예를 더 만들어 추가검증을 해보자.

// [타입추론] const c: number[] // ❌
const c = a.map((v) => v.toString()); // ❌ - Type 'string' is not assignable to type 'number'.ts(2322)
```

<br />

### 수정 (제네릭 S를 더 추가 )

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  // S 제네릭을 추가했다.
  map<S>(callback: (v: T) => S): S[];
}

// [타입추론 결과]
// - const b: number[]
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

// [타입추론] const c: string[] // ✅
const c = a.map((v) => v.toString());
console.log(c); // ✅[ '1', '2', '3' ]

```

#### 추가설명 - 추가한 제네릭 S를 interface Arr에 선언해놓으면 안될까...?

```ts
interface Arr<T, S> {
  forEach(callback: (item: T) => void): void;
  map(callback: (v: T) => S): S[];
}
// 이와같이도 할 수 있지만...

// 그렇게 되면 미리 예측을 하고 타이핑을 해야하는데, 코딩을 하며 아마 그러기는 어려울 것이다.
// 그래서 Arr<T>로 '사용할 수 있게' 타이핑을 하는 것이다.
const a: Arr<number, ???> = [1, 2, 3];
```

<br />

### 그럼 정말 잘 만들어졌는지 더 확인해보자.

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  map<S>(callback: (v: T) => S): S[];
}

// [타입추론 결과]
// - const b: number[] ✅
// - (parameter) v: number
const a: Arr<number> = [1, 2, 3];
const b = a.map((v) => v + 1);

// [타입추론 결과]
// - const c: string[] ✅
// - (parameter) v: number
const c = a.map((v) => v.toString());

// 잘 되는 것 같다. 더 검증해보자.

// [타입추론 결과]
// const d: boolean[] ✅
const d = a.map((v) => v % 2 === 0);
console.log(d); // ✅ [false, true, false]
```

> Good. :)

<br />

### `lib.es5.d.ts`의 map과 직접만든 타입 비교해보자.

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

> 제네릭의 타입 파라미터가 직접 만든 것은 S인데, 실제 구현에서는 U인 것 말고는 큰 차이가 없다. 잘 만들어진 것 같다.<br />
> 사용하지 않는 인자를 타입으로 지정하기는 어려우니 사용하면서 발전시켜나가자.
