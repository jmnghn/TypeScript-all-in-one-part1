### readonly, 인덱스드 시그니처, 맵드 타입스

### readonly

```ts
interface A {
  readonly a: string;
  b: string;
}
const a: A = { a: "hello", b: "world" };
a.a = "error"; // ❌ Cannot assign to 'a' because it is a read-only property.ts(2540)
```

<br />

### Indexed Signature

```ts
type A = { a: string; b: string; c: string; d: string };

// 위 코드를 이렇게도 표현할 수 있다.
type B = { [key: string]: string };
const b: B = { a: 1, b: 2, c: 3 }; // ❌ Type 'number' is not assignable to type 'string'.ts(2322)
const bb: B = { a: "1", b: "2", c: "3" }; // ✅

// 물론 다른 타입들도 가능하다.
// 1
type C = { [key: string]: number };
const c: C = { a: "1", b: "2", c: "3" }; // ❌ Type 'string' is not assignable to type 'number'.ts(2322)
const cc: C = { a: 1, b: 2, c: 3 }; // ✅

// 2
type D = { [key: number]: number };
const d: D = { a: 1, b: 2, c: 3 }; // ❌ Object literal may only specify known properties, and 'a' does not exist in type 'D'. ('a'는 D 타입에 없다.)
const dd: D = { 1: 1, 2: 2, 3: 3 }; // ✅

// 3
type E = { [key: string]: boolean };
const e: E = { a: 1, b: 2, c: "3" }; // ❌ Type 'number' is not assignable to type 'boolean'.ts(2322)
const ee: E = { a: true, b: false, c: true }; // ✅

```
> 복잡해보일 수 있지만, []에 키의 타입을 지정하고 나머지에 value의 타입을 지정하는 형태다.<br />
> 전혀 다르지만, computed property(obj['key']) 같은 느낌이 든다.<br />

<br />

### [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

```ts
type B = "Human" | "Mammal" | "Animal";
type A = { [key in B]: B };
const a: A = { Human: "Human", Mammal: "Mammal", Animal: "Animal" }; // ✅

const b: A = { Human: "", Mammal: "", Animal: "" }; // ❌
const c: A = { a: "Human", b: "Mammal", c: "Animal" }; // ❌
const d: A = { a: "", b: "", c: "" }; // ❌

```
