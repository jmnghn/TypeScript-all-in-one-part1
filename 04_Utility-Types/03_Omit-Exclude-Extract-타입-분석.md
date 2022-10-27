## Omit, Exclude, Extract 타입 분석

<br />

### Omit

> 생략

타입에서 모든 속성을 선택한 다음 (문자열 리터럴 또는 문자열 리터럴 합집합(`|`) 키를 제거하여 타입을 구성한다.(???)<br />

`Pick`과 반대다. `Pick`은 리터럴로 선택해서 타입을 구성하는거였고, `Omit`은 리터럴로 제거해서 타입을 구성한다.<br /> 속성이 많을 때는 `Omit`이 더 유용할 것이다.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

// TodoPreview의 타입 구성
// type TodoPreview = {
//   title: string;
//   completed: boolean;
//   createdAt: number;
// }
type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;

// TodoInfo의 타입 구성
// type TodoInfo = {
//   description: string;
//   title: string;
// }
type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
```

#### `Omit`은 직접 만들어보기 전에 그 구성을 먼저 보고시작하려고 한다.

```ts
// lib.es5.d.ts

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

> `Pick`과 `Exclude`의 조합으로 만들어져 있는 걸 확인할 수 있다. 이와같이 유틸리티 타입들을 조합해서 사용할 수도 있다. 음... `Exclude` 먼저 알아야 할 필요가 있어 보인다.

<br />

### Exclude

#### 원형 살펴보기

```ts
// lib.es5.d.ts

/**
 * Exclude from T those types that are assignable to U
 * (T에서 U에 할당할 수 있는 타입을 제외)
 * (집합 관점으로 보기 - T가 U의 부분집합이면 없애 버리고, 아니면 남겨라)
 */
type Exclude<T, U> = T extends U ? never : T; // 삼항 연산자
```

#### Exclude를 일단 사용해보자.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// type A = Todo
// ??? - 동작을 안한다...
type A = Exclude<Todo, "title">;

// 아 keyof를 빼먹었다.
// ※ 타입자체(title: string; description...)가 아니라 "title" | "description" | "completed"를 원하는거기 때문에 keyof를 사용해야 한다.
// type B = "description" | "completed" // ✅
type B = Exclude<keyof Todo, "title">;
```

#### 다시 `Exclude`를 사용해보자.

```ts
type Animal = "Cat" | "Dog" | "Human";
// type Mammal = "Cat" | "Dog"
type CatAndDog = Exclude<Animal, "Human">;
```

#### `Exclude`를 사용해봤으니, 이제 `Omit`을 다시 만들어보자.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type C = Exclude<keyof Todo, "description">;

// type C의 타입유형은 Pick의 두 번째 타입 매개변수인 "title" | "completed" 과 같다.

// type TodoPreview1 = { ✅
//   title: string;
//   completed: boolean;
// }
type TodoPreview1 = Pick<Todo, "title" | "completed">;

// 그래서 다음과 같이 두번째 타입매개변수를 Exclude로 교체해서도 사용할 수 있을 것이다.
// type TodoPreview1 = { ✅
//   title: string;
//   completed: boolean;
// }
type TodoPreview2 = Pick<Todo, Exclude<keyof Todo, "description">>;
// Omit이 됐다...!

// 위 코드로 Omit을 만들어보자.
// type O<T, S> = Pick<Todo, Exclude<keyof Todo, "description">>;
type O<T, S> = Pick<T, Exclude<keyof T, S>>;
type TodoPreview3 = O<Todo, "description">;
```

#### Omit의 원형과 비교해보자.

```ts
type O<T, S> = Pick<T, Exclude<keyof T, S>>;
type OriginalOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

> 타입 파라미터의 이름만 다르고 동일해 보인다. Good.<br />
> 하지만 원형에서는 두번째 타입 인자를 제한하는 것을 볼 수 있다.<br />
> K extends keyof any는 무슨 의미일까?<br />

#### K extends keyof any의 의미

```ts
// OriginalOmit에 커서를 올려보면 다음과 같이 나온다.
// type OriginalOmit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }
type OriginalOmit<T, S extends keyof any> = Pick<T, Exclude<keyof T, S>>;
// extends keyof any는 any가 string | number | symbol 라는 의미라는 것을 알 수 있다.
```

#### Exclude를 다시 살펴보자. (+ Extract)

```ts
// (T와 U의 순서에 유의하자.)
type Exc<T, U> = T extends U ? never : T; // T가 U의 부분집합이면 없애 버리고, 아니면 남겨라
type Ext<T, U> = T extends U ? T : never; // T가 U의 부분집합이면 남기고, 아니면 버려라

type Animal = "Cat" | "Dog" | "Human";

// Animal(여기서는 T)의 타입들이 하나씩 삼항연산자에 대입된다고 봤을 때...
type CatAndDog1 = Exclude<Animal, "Human">; // 'Cat' | 'Dog' | never(never는 쓰이지 않으니까 없어져버린다.)
type CatAndDog2 = Extract<Animal, "Cat" | "Dog">; // 'Cat' | 'Dog' | never(never는 쓰이지 않으니까 없어져버린다.)
```

#### 참고 - `Extract` 원형

```ts
// lib.es5.d.ts

/**
 * Extract from T those types that are assignable to U
 * (집합 관점으로 보기 - T가 U의 부분집합이면 남기고, 아니면 버려라)
 */
type Extract<T, U> = T extends U ? T : never;
```

<br />

삼항연산자가 중요한 이유는 infer를 다루면서 더 살펴보자.
