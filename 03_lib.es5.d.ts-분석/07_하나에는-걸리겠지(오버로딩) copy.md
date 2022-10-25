## 하나에는 걸리겠지 (오버로딩)

### 타입의 오버로딩

```ts
function add(x: number, y: number): number;
function add(x: string, y: string): string;
function add(x: number | string, y: number | string) {
  return x + y;
}

// 자바스크립트는 인자를 전달하는 개수가 자유로우니까.
add(1, 2);
add(1, 2, 3);
```

<br />

### lib.es5.d.ts의 오버로딩

```ts
interface Arr<T> {
  filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): S[];
  filter(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T[];
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  ...
}
```
> 한 가지 방식으로 타입을 정의하면 가장 베스트겠지만, 그러지 못하는 경우 오버로드시킨다.

<br />

### 오버로딩 예제

```ts
// 타입스크립트가 익숙하지 않아서(!) 어떻게 정의해야 좋을지 모를 때 다음과 같이 작성해도 괜찮...다^^;
declare function add(x: number, y: number): number;
declare function add(x: number, y: number, z: number): number;

// function add(x: number, y: number): number (+1 overload) - 오버로딩의 갯수도 알려준다.
add(1, 2);
add(3, 4, 5);

// 물론 옵셔널을 안다면 그렇게 사용했을 것.
declare function add(x: number, y: number, z?: number): number;
```

<br />

### interface의 오버로딩

```ts
interface Add {
  (x: number, y: number): number;
  (x: string, y: string): string;
}
const add: Add = (x, y) => x + y;

class A {
  add(x: number, y: number): number;
  add(x: string, y: string): string;
  add(x: any, y: any) {
    return x + y;
  }
}
// 타입 추론결과 - const c: string ✅
const c = new A().add("1", "2");
```
