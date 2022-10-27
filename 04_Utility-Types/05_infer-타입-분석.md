## infer 타입 분석

> inference: 1. 추론(한 것), (=deduction) 2. 추론 (행위)

### `Parameters<Type>`

함수 유형 Type의 '매개변수에 사용된 타입'에서 '튜플 타입'을 생성합니다.

#### 공식문서 Example 코드

```ts
declare function f1(arg: { a: number; b: string }): void;

// type T0 = [];
type T0 = Parameters<() => string>;

// type T1 = [s: string];
type T1 = Parameters<(s: string) => void>;

// type T2 = [arg: unknown];
type T2 = Parameters<<T>(arg: T) => T>;

// type T3 = [
//   arg: {
//     a: number;
//     b: string;
//   }
// ];
type T3 = Parameters<typeof f1>;

// type T4 = unknown[];
type T4 = Parameters<any>;

// type T5 = never;
type T5 = Parameters<never>;

// type T6 = never
type T6 = Parameters<string>; // ❌ Type 'string' does not satisfy the constraint '(...args: any) => any'.

// type T7 = never
type T7 = Parameters<Function>;
// ❌ Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.
```

#### Example 코드 2

```ts
function zip(
  x: number,
  y: string,
  z: boolean
): { x: number; y: string; z: boolean } {
  return { x, y, z };
}

// type Params = Parameters<zip>; // ❌ 'zip' refers to a value, but is being used as a type here. Did you mean 'typeof zip'?ts(2749)

// 함수를 바로 타입으로 사용할 수는 없기 때문에 typeof를 붙여줘야 한다.
// 타입 추론 - type Params = [x: number, y: string, z: boolean] // 튜플 형태
type Params = Parameters<typeof zip>; // ✅

// 타입 추론 - type First = number
type First = Params[0]; // 튜플 형식에서는 이처럼 인덱스를 통해 타입을 값처럼 꺼내올 수 있다.
```

#### 그럼 한번 만들어볼까...? `Paramters`

```ts
function zip(
  x: number,
  y: string,
  z: boolean
): { x: number; y: string; z: boolean } {
  return { x, y, z };
}

// 단계적으로 보자면...
// (1) T를 함수로 타입을 제한: T extends (...args: any) => any
type P1<T extends (...args: any) => any> = {};

// (2) T extends (...args: infer A) => any
// 새로운 제네릭 A가 추가됐고, infer라는 키워드가 보인다.
type P2<T extends (...args: any) => any> = T extends (...args: infer A) => any
  ? A
  : never;

// [타입 추론] type Params = [x: number, y: string, z: boolean] // ✅
type Params = P2<typeof zip>;
// [타입 추론] type First = number // ✅
type First = Params[0];
```

infer는 타입스크립트가 알아서 추론하게 하는 문법이다. (extends에서만 사용가능하다.) <br />

그래서 infer A의 의미는 A의 자리. 즉, 매개변수 자리의 타입을 추론하라는 의미이고 추론 값이 있으면 그 값을 쓰라는 의미이다. <br />

infer를 사용한 다른 사람의 코드는 어느정도 읽기 쉬운 편이지만, 내가 쓰게 되는 경우 infer의 위치를 어디로 둬야 좋을지 헷갈릴 수 있다.<br />

#### 그렇다면 오직 연습 뿐(!). 반환값을 타입으로 하는 유틸리티 타입을 만들어보자.

```ts
function zip(
  x: number,
  y: string,
  z: boolean
): { x: number; y: string; z: boolean } {
  return { x, y, z };
}

type R<T extends (...args: any) => any> = T extends (...args: any) => infer A
  ? A
  : never;

// type Return = { // ✅ - 그렇지만, 튜플의 형태는 아니다 0.0
//   x: number;
//   y: string;
//   z: boolean;
// };
type Return = R<typeof zip>;

// 이와 같은 유틸리티 타입은 실제로도 있다.
// type Ret = { // ✅
//   x: number;
//   y: string;
//   z: boolean;
// }
type Ret = ReturnType<typeof zip>;
```

이제 어떤 함수든 그 함수의 인자나 리턴의 타입을 자유자재로 뜯어올 수 있다. 😅

<br />

### `ConstructorParameters`와 `InstanceType`

ReturnType과 비슷한 구조를 하고있다.

```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
// ※ abstract new (...args: any) => any 생성자 모양

/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
```

#### `ConstructorParameters`

```ts
class A {
  a: string;
  b: number;
  c: boolean;

  constructor(a: string, b: number, c: boolean) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
const c = new A("123", 456, false);

// [타입추론] type C = [a: string, b: number, c: boolean] // ✅
type C = ConstructorParameters<typeof A>; // typeof 클래스가 생성자 (abstract new (...args: any) => any가 생성자라는 걸 알려주는 부분)

// [타입추론] type I = A
type I = InstanceType<typeof A>; // new A("123", 456, false);

const a: I = A; // ❌
const b: I = new A("123", 456, false); // ✅ 인스턴스(new)
```

<br />

### 기타

대부분의 유틸리티 타입을 살펴봤지만, 내부적으로 구현되어있는 유틸리티 타입들도 여러개가 있다.

<br />

#### `Lowercase`

```ts
const a = "Hello World";
const b: Lowercase<typeof a> = "Hello World"; // ❌ Type '"Hello World"' is not assignable to type '"hello world"'.ts(2322)

// 그래서 대략 이런 느낌이지만, toLowerCase의 반환타입이 string이라 대입이 되진 않는다. ^^;
const c: Lowercase<typeof a> = a.toLowerCase(); // ❌ Type 'string' is not assignable to type '"hello world"'.ts(2322)
```

#### lib.es5.d.ts의 `Lowercase`

```ts
// lib.es5.d.ts

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic;
// 구현이 안 되어 있다.
```

#### `ThisType`

```ts
/**
 * Marker for contextual 'this' type
 */
interface ThisType<T> {}
```

#### 외

```ts
/**
 * Convert string literal type to uppercase
 */
type Uppercase<S extends string> = intrinsic;

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to uppercase
 */
type Capitalize<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to lowercase
 */
type Uncapitalize<S extends string> = intrinsic;

function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase:
      return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase:
      return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize:
      return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize:
      return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}

/**
 * Marker for contextual 'this' type
 */
interface ThisType<T> {}
```
