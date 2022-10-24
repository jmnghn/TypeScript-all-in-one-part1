## void의 두 가지 사용법

### void

```ts
function a(): void {
  return 3; // ❌ - Type 'number' is not assignable to type 'void'.ts(2322)
}

const b = a();
```

<br />

#### return값이 없거나 undefined는 가능하다.

```ts
function a(): void {
  return;
}
function a(): void {
  return undefined;
}
```

#### 하지만 null은 불가능하다

```ts
function a(): void {
  return null;
}
```

<br />

### 직접 선언한 void와 메서드의 void

#### 메서드의 void

```ts
interface Human {
  talk: () => void;
}

const human: Human = {
  talk() {
    return "abc"; // 된다...😳
  },
};
```

#### callback함수의 void

```ts
function a(cb: () => void): void {}

a(() => {
  return "3"; // 된다...😳
});
```

그래서 void를 이와같이 크게 두 가지로 볼 수 있다.<br />
'함수에 직접 선언한 void'와 '인자함수의 void 그리고 메서드의 void'.<br />
'함수에 직접 선언한 void'만 return 값이 있을 경우 에러가 발생하지만, '인자함수의 void 그리고 메서드의 void'는 return 값이 있어도 상관이 없다고 기억하는 게 좋다.<br />

이를 통해 알 수 있는 것은 '인자함수의 void 그리고 메서드의 void'는 `return 값을 사용하지 않겠다`는 의미이며, '함수에 직접 선언한 void'는 `return 값이 없다`는 의미이다. 그래서 같은 void지만 의미가 좀 다르다.⭐️<br />

<br />

### 예제와 declare

```ts
function forEach(arr: number[], callback: (el: number) => undefined): void;
function forEach() { ... } // 이와 같이 함수 구현부를 작성해야 한다.
```

만약 함수 구현부를 작성하지 않고싶은 경우(타입 선언만 하고 싶은 경우)에는 다음과 declare를 사용하면 가능하다. 물론 구현은 다른 파일에 있어야 한다.<br />

> ※ 추후 declare module, declare global, declare namespace도 배움

```ts
declare function forEach(
  arr: number[],
  callback: (el: number) => undefined
): void;
```

#### 예1

```ts
declare function forEach(
  arr: number[],
  callback: (el: number) => undefined
): void;

let target: number[] = [];
forEach([1, 2, 3], (el) => target.push(el)); // return이 undefined라 에러가 발생한다(number를 undefined에 할당할 수 없음)
```

위 코드를 다음과 같이 함수 인자의 리턴값을 void 타입으로 해두어도 매개변수의 타입이기 때문에 에러가 발생하지 않는다.

```ts
declare function forEach(arr: number[], callback: (el: number) => void): void;

let target: number[] = [];
// 둘 모두 정상적인 코드
forEach([1, 2, 3], (el) => {
  target.push(el);
});
forEach([1, 2, 3], (el) => target.push(el));
```

하지만 다음과 같이 함수 인자의 리턴값을 undefined 타입으로 지정하면, 에러가 발생한다.

```ts
declare function forEach(
  arr: number[],
  callback: (el: undefined) => undefined
): void;

let target: number[] = [];
// 둘 모두 정상적인 코드
forEach([1, 2, 3], (el) => {
  target.push(el); // ❌ Argument of type '(el: number) => void' is not assignable to parameter of type '(el: number) => undefined'. Type 'void' is not assignable to type 'undefined'.ts(2345). 즉, void를 undefined에 할당할 수 없다.
});
forEach([1, 2, 3], (el) => target.push(el)); // ❌ Type 'number' is not assignable to type 'undefined'.ts(2322). 즉, number를 undefined에 할당할 수 없다
// 이와 같이 return값을 사용하지는 않지만 사용하는 경우. undefined는 에러가 발생한다.
```

> void가 undefined와 다르다는 것이 핵심이다. ⭐️

#### 반대로 undefined는 void에 대입이 가능하다. 😵‍💫

- 타입간 대입 가능표
  <img width="640" src="https://user-images.githubusercontent.com/19165916/197490243-1f382c15-e941-4326-8780-1ce91fa81bf4.png" /><br />

<br />

#### 강제 타입 전환

```ts
interface A {
  talk: () => void;
}
const a: A = {
  talk() {
    return 3;
  },
};
// as
const b = a.talk() as unknown as number;
// <>
const b = <number>(<unknown>a.talk());
```

> react에서는 jsx에서 `<>`를 잘 인식하지 못하는 경우가 있어서 as를 주로 사용한다.
