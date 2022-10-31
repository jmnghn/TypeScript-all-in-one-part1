## 공변성(Covariance)과 반공변성(Contravariance)

> ※ 공변성(共變性) 두둥...<br />
> 한 변수가 변하면 다른 변수도 변하는 성질. (공공(公共)의 그 공(共))<br />

이론적으로는 용어가 너무 복잡하다. 여기서는 결론적으로 '함수간에 인자타입이나 리턴타입을 서로 대입할 수 있냐 없냐'를 따지는 것이라고 볼 수 있다.

<br />

### return 값은 더 넓은 값으로 넣을 수 있다.

```ts
function a(x: string): number {
  return +x;
}
a("1"); // 1

type B = (x: string) => number | string;
// a를 넣을 수 있을까...?
const b: B = a; // ✅ 왜 되죠???
```

#### 반대로는 당연히 되지 않는다.

> string은 어떻게 처리할지가 없는데에 대한 예외가 생기는 느낌?

```ts
function c(x: string): number | string {
  return +x;
}
c("1"); // 1
type D = (x: string) => number;
// a를 넣을 수 있을까...?
const d: D = c; // ❌
```

<br />

### 매개변수에서의 동작

```ts
// 리턴의 동작방식과 반대다
function a(x: number | string): number {
  return +x;
}
a("1"); // 1

type B = (x: string) => number;
// a를 넣을 수 있을까...?
const b: B = a; // ✅ ???

// 오히려 넓은 타입으로는 대입이 안된다
function c(x: number): number {
  return +x;
}
c(1); // 1

type D = (x: number | string) => number;
// a를 넣을 수 있을까...?
const d: D = c; // ❌
```

<br />

이를 설명하기 위해서 공변성, 반공변성, 이변성 등의 용어들이 나오는데, 우선은 동작만 저렇게만 알아두자. 
(대체 왜 용어를 이렇게 어렵게 만들어놓은 것일까 🤯)

<br />

### 리턴타입과 매개변수 동시에 적용된 예

```ts
function a(x: number | string): number {
  return 0;
}

type B = (x: string) => number | string;
const b: B = a; // ...? 타입이 전혀 달라보이는데, 어떻게 되는지 모를 희한한 코드로 보인다.
```

<br />

### 우선 결론은...

매개변수는 좁은 타입으로 대입가능하고 리턴타입은 넓은 타입으로 대입이 가능하다. (...왜냐고는 묻지 않기...)

<br />

### 함수의 공변성과 반공병성 샘플 코드

```ts
function a(x: string): number {
  return 0;
}
type B = (x: string) => number | string;
let b: B = a;
```
```ts
function a(x: string): number | string {
  return 0;
}
type B = (x: string) => number;
let b: B = a;
```
```ts
function a(x: string | number): number {
  return 0;
}
type B = (x: string) => number;
let b: B = a;
```
```ts
function a(x: string): number {
  return 0;
}
type B = (x: string | number) => number;
let b: B = a;
```

<br />

### 별도 - 용어 - 타입 넓히기와 타입 좁히기 (공변성, 반공변성과는 다르다.)

```ts
// 타입 넓히기
// (타입 추론결과 - let a: number)
let a = 5;

// 타입 좁히기 (타입가드)
```
