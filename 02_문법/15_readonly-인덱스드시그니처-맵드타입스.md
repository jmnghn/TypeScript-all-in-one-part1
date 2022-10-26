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
type A = { [key: string]: string };

// 물론 다른 타입들도 가능하다.
type A = { [key: string]: number };
```
> 전혀 다르지만, computed property(obj['key']) 같은 느낌이 든다.

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
