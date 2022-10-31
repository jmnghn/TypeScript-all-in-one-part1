## Required, Record, NonNullable 타입 분석

### Required

모든 프로퍼티를 필수값(required)으로 만든다. `Partial`의 반대.

```ts
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
// ❌ Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.ts(2741)
```

#### 어떻게 모두 필수값으로 바꿀까?

```ts
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

type R<T> = {
  [Key in keyof T]-?: T[Key]; // `-?`는 모든 옵셔널을 제거하겠다는 의미다.
  // +?도 있는데 ?(옵셔널)과 똑같아서 잘 사용하지는 않는다.
};

const obj2: R<Props> = { a: 5" };
// ❌ 잘 동작한다 - Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.ts(2741)
```

#### `Required`원형 (lib.es5.d.ts)

```ts
// lib.es5.d.ts

/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

<br />

### `Readonly<Type>`

```ts
interface Props {
  a?: number;
  b?: string;
}

type Req<T> = {
  [Key in keyof T]-?: T[Key];
};
type Rdo<T> = {
  readonly [Key in keyof T]: T[Key];
};

const obj: Req<Props> = { a: 5, b: "6" };
obj.b = "3"; // 객체니까 수정이 된다.

const obj2: Rdo<Props> = { a: 5, b: "6" };
obj2.b = "7";
// ❌ 잘 동작한다 - Cannot assign to 'b' because it is a read-only property.ts(2540)
```

#### `Readonly`에 `-` 끼얹기.

```ts
interface Props {
  readonly a?: number;
  readonly b?: string;
}

type NotRdo<T> = {
  -readonly [Key in keyof T]: T[Key];
};

const obj: NotRdo<Props> = { a: 5, b: "6" };
obj.b = "3"; // ✅
```

<br />

### `Record<Keys, Type>`

타입의 속성을 다른 유형에 매핑하는데 사용할 수 있다.

```ts
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

// const cats: Record<CatName, CatInfo>
cats.boris;
```

#### Record 다른 샘플코드

```ts
interface Obj {
  [key: string]: number;
}

const a: Obj = { a: 1, b: 2, c: 3 };
// Obj 타입처럼 잘 동작한다.
const b: Record<string, number> = { a: 1, b: 2, c: 3 };
```

#### `Record`를 만들어보자.

```ts
type R<T, S> = {
  [Key in T]: S; // ❌ A mapped type may not declare properties or methods.ts(7061)
};

const a: R<string, number> = { a: 1, b: 2, c: 3 };
```

> T의 타입제한이 걸려 있지 않아서 그렇다. 음... 다시 만들어보자.

#### 수정 (`extends keyof any`)

```ts
type R<T extends keyof any, S> = {
  [Key in T]: S;
};

const a: R<string, number> = { a: 1, b: 2, c: 3 };
```

> 음...... 🤔<br />
> 타입스크립트 공식 문서 Record 설명에서 CatName에 CatInfo를 매핑했던 걸 돌아보면, extends keyof any가 객체를 막기위한다기 보다는 null, undefined, boolean을 막기위한 테크닉으로 보인다. (keyof any는 string | number | symbol 복습)

<br />

### `NonNullable`

타입에서 null과 undefined를 제외하고 타입을 생성하고 싶은 경우

```ts
type A = string | null | undefined | boolean | number;

// type B = string | number | boolean // ✅
type B = NonNullable<A>;
```

#### `NonNullable`를 만들어보자.

```ts
type A = string | null | undefined | boolean | number;

type N<T> = T extends null | undefined ? never : T;

// type B = string | number | boolean // ✅
type B = N<A>;
```

#### `NonNullable`의 원형

```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T & {}; // 😲...?
```

<br />

#### 참고 - 유틸리티 타입은 그 대상이 다르다.

키를 대상으로하는 타입들이 있고, 인터페이스를 대상으로하는 타입들이 있어서 이를 구분하는 것이 좋다.<br />
봤던 것들 가운데 interface를 대상으로하는 타입들은 `Partial`, `Required`, `Readonly`, `Pick`.<br />
`Exclude`, `Extract`, `NonNullable` 같은경우에는 키를 대상으로하는 타입들이다.
