## void의 두 가지 사용법

### void

먼저 void에 대해 간단히 알아보자. (직접 지정한 void)

```ts
function a(): void {
  return 3; // ❌ - Type 'number' is not assignable to type 'void'.ts(2322)
}

const b = a();
```

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

### 직접 지정한 void와 메서드의 void

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
'함수에 직접 지정한 void'와 '인자함수의 void & 메서드의 void'.<br />
'함수에 직접 지정한 void'는 return 값이 있을 경우 에러가 발생하지만, '인자함수의 void & 메서드의 void'는 return 값이 있어도 상관이 없다고 기억하는 게 좋다.<br />

이를 통해 알 수 있는 것은 '인자함수의 void & 메서드의 void'는 `return 값이 반환되더라도 사용하지 않겠다`는 의미이며, '함수에 직접 지정한 void'는 `return 값이 없어야 한다`는 의미이다. 같은 void지만 의미가 좀 다르다.⭐️<br />

<br />

### declare와 void 샘플코드

#### ※ declare

```ts
function forEach(arr: number[], callback: (el: number) => undefined): void;
function forEach() { ... } // 이와 같이 함수 구현부를 작성해야 한다.
```

> ※ 추후 declare module, declare global, declare namespace도 다룬다.

```ts
declare function forEach(
  arr: number[],
  callback: (el: number) => undefined
): void;
```

> 만약 함수 구현부를 작성하지 않고싶은 경우(타입 선언만 하고 싶은 경우)에는 이처럼 declare를 사용하면 가능하다.<br /> 
> 물론, 구현은 다른 파일에 있어야 한다.<br />

<br />

#### void 샘플코드

```ts
declare function forEach(
  arr: number[],
  callback: (el: number) => undefined
): void;

let target: number[] = [];
forEach([1, 2, 3], (el) => target.push(el)); // ❌ return이 undefined라 에러가 발생한다(number를 undefined에 할당할 수 없음)
```

위 코드를 다음과 같이 '함수 인자의 리턴값을 void 타입'으로 해두면, 앞에서 설명한 void의 특성으로 매개변수의 타입에 대한 에러가 발생하지 않는다.

```ts
declare function forEach(arr: number[], callback: (el: number) => void): void;

let target: number[] = [];

forEach([1, 2, 3], (el) => {
  target.push(el);
}); // ✅
forEach([1, 2, 3], (el) => target.push(el)); // ✅
```

하지만 다음과 같이 함수 인자의 리턴값을 undefined 타입으로 지정하면, 에러가 발생한다.

```ts
declare function forEach(
  arr: number[],
  callback: (el: undefined) => undefined
): void;

let target: number[] = [];

forEach([1, 2, 3], (el) => {
  target.push(el); // ❌ 
  // Argument of type '(el: number) => void' is not assignable to parameter of type '(el: number) => undefined'. 
  // Type 'void' is not assignable to type 'undefined'.ts(2345). 
  // 반환값이 없어서 void지만, void를 undefined에 할당할 수는 없다.
});
forEach([1, 2, 3], (el) => target.push(el)); // ❌ 
// Type 'number' is not assignable to type 'undefined'.ts(2322). 
// number를 반환하지만, number를 undefined에 할당할 수는 없다.

// 이와 같이 매개변수나 리턴타입을 undefined로 하는 경우에는 반환값이 있건 없건 에러가 발생한다. (표를 보면 가능한 것은 null과 never뿐)
// void에는 number를 대입할 수 있어 에러가 발생하지 않았었는데 말이다.
```

> 즉, void가 undefined와 다르다는 것이 핵심이다. ⭐️ (undefined는 void에 대입이 가능하다)

#### 타입간 대입 가능표

<img width="100%" src="https://user-images.githubusercontent.com/19165916/197490243-1f382c15-e941-4326-8780-1ce91fa81bf4.png" /><br />
> 참고로 초록색 체크표시 역시 X와 같다.

<br />

#### 참고 - 강제 타입 전환

```ts
interface A {
  talk: () => void;
}
const a: A = {
  talk() {
    return 3;
  },
};
// 방법 1 - as
const b = a.talk() as unknown as number;
// 방법 2 - <>
const b = <number>(<unknown>a.talk());
```

> react에서는 jsx에서 `<>`를 잘 인식하지 못하는 경우가 있어서 as를 주로 사용한다.
