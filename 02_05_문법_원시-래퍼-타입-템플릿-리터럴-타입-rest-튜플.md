## 원시 래퍼 타입, 템플릿 리터럴 타입, rest, 튜플

### 원시 래퍼 타입

string 타입과 String 타입은 다르다. (첫 글자 대문자/소문자)

```ts
const a: string = "hello";
const b: String = "hell"; // String을 쓰는 순간 hell이 열릴 것 😅

function c(p1: string, p2: string) {}
c(a, b);
```

<img width="600" src="https://user-images.githubusercontent.com/19165916/197396089-534cfd56-4d36-44b0-b263-0eb165c0d49f.png"><br />

> 타입스크립트에서도 string을 쓸 것을 권고하고 있다.<br /><br />
> Argument of type 'String' is not assignable to parameter of type 'string'.<br />
> 'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.ts(2345)<br /><br />
> 'String' 형식의 인수는 'string' 형식의 매개 변수에 할당할 수 없습니다.<br />
> 'string'은 원시적이지만 'String'은 래퍼 객체입니다. 가능한 경우 'string'을 사용하는 것을 선호합니다.ts(2345)

<br />

### 템플릿 리터럴 타입 - 타입스크립트는 템플릿 리터럴로도 type 알리아스를 지원한다.

```ts
type World = "world" | "hell";
const a: World = "world";

// type Greeting = "hello world"
type Greeting = `hello ${World}`;
```

- 이로 인한 정교한 타입 추천이 가능해진다.

  <img width="600" src="https://user-images.githubusercontent.com/19165916/197396599-47bfa0a9-7c3b-496b-a6f8-ee68ed6e93c6.png"><br />

  > 'hello world'와 'hello hell'을 추천해주는 인텔리센스 :)

<br />

### 배열과 튜플, Rest parameter (나머지 매개변수)

#### 배열의 타입 선언 두 가지

```ts
let arr: string[] = [];
let arr2: Array<string> = [];
```

#### Rest parameter (나머지 매개변수)의 타입 지정

```ts
function rest(...args: string[]) {}
rest("a", "b", "c");
```

```ts
function rest(a, ...args: string[]) {
  console.log(a, args);
}
rest("a", "b", "c");
```

#### 튜플

```ts
const tuple: [string, number] = ["a", 1];
tuple[2] = "hello";
tuple.push("hello");
```
