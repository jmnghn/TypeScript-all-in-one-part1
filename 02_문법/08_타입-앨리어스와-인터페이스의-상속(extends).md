## 타입 앨리어스와 인터페이스의 상속(extends)

### 타입 앨리어스의 상속(`&`)

마치 상속처럼...

```ts
type 동물 = { breath: true };
type 포유류 = 동물 & { breed: true };
type 사람 = 포유류 & { think: true };

const 개발자: 사람 = { breath: true, breed: true, think: true };
```

<br />

### 인터페이스의 상속

```ts
interface 동물 {
  breath: true;
}
interface 포유류 extends 동물 {
  breed: true;
}
const 강아지: 포유류 = { breath: true, breed: true };
```

#### 인터페이스는 같은 이름으로 여러번 선언하면 서로 합쳐지는 특성을 갖는다.

```ts
interface A {
  talk: () => void;
}
interface A {
  eat: () => void;
}
interface A {
  shit: () => void;
}
const a: A = { talk() {}, eat() {}, shit() {}, sleep() {} };

interface A {
  sleep: () => void;
}
```

> 라이브러리들의 코드를 살펴보다보면 interface로 타입을 지정한 경우가 많은데,<br />
> 이와 같은 interface의 특성을 활용해 보다 확장에 용이하도록 설계한 의도라고 볼 수 있을 것이다.

<br />

### 타입스크립트 네이밍 컨벤션

```ts
// 기존 관습
interface IProps {} // interface는 앞에 'I'
type TType = string | number; // type은 앞에 'T'
enum EHello { // enum은 앞에 'E'
  Left,
  Right,
}

// 요즘 국룰 ^^; 어차피 인텔리센스가 다 알려주며, 자바스크립트 생태계에서는 잘 사용하지 않는 경향성을 보인다.
interface Props {}
type Type = string | number;
enum Hello {
  Left,
  Right,
}
```

현업에서는 차후 확장을 위해 interface를 많이 활용하는 경향성을 보인다.
