## unknown과 any(그리고 타입 대입가능표)

### any

```ts
interface A {
  talk: () => void;
}
const a: A = {
  talk() {
    return 3;
  },
};
const b: any = a.talk();
b.method();
```

> `any`는 타입 체크를 아예 포기(!)한다는 의미다. (없는 메소드를 호출해도 아무런 에러도 발생하지 않는다.)

<br />

### unknown

```ts
interface A {
  talk: () => void;
}
const a: A = {
  talk() {
    return 3;
  },
};
const b: unknown = a.talk();
b.method(); // Object is of type 'unknown'.ts(2571)

// unknown은 b의 타입을 직접 지정해야 한다.
(b as A).talk();
```

> 타입을 포기한(!) any와 unknown은 다르다.

가장 흔한 예로는 `try...catch`에서 찾아볼 수 있다.

```ts
try {
} catch (error) {
  // error.message; // ❌ 에러
  // 그래서 직접 타이핑을 해줘야한다.
  (error as Error).message;
  (error as AxiosError).message;
}
```

<br />

### 처음부터 타입을 잘 지정해놓는 것이 좋다.

```ts
interface A {
  talk: () => void;
}
const a: A = {
  talk() {
    return 3;
  },
};
const b = a.talk();
b.toString(); // ❌ - Property 'toString' does not exist on type 'void'.ts(2339)

// 이렇게 사용해야하는 참사(!)가 일어날 수 있다.
const b = a.talk() as unknown as number;
b.toString();
```

> 그리고 처음에 강조했듯이 에러가 발생한다고 동작하지 않는 것은 아니다. 타입스크립트는 '컴파일'과 '코드변환'이 별개이기에. (다시 강조)

### 타입간 대입 가능 표

<img width="640" src="https://user-images.githubusercontent.com/19165916/197490243-1f382c15-e941-4326-8780-1ce91fa81bf4.png" /><br />

<br />
