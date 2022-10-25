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

### Index Signature

```ts
type A = { a: string; b: string; c: string; d: string };

// 위 코드를 이렇게도 표현할 수 있다.
type A = { [key: string]: string };

// 물론 다른 타입들도 가능하다.
type A = { [key: string]: number };
```

<br />

### [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

```ts
type B = "Human" | "Mammal" | "Animal";
type A = { [key in B]: B };
const aaa: A = { Human: "", Mammal: "", Anmial: "" };
```
