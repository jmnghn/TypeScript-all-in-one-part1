## Pick 타입 분석

> 선택

<br />

타입에서 속성 '집합'을 '선택'해 타입을 구성한다. (문자열 리터럴 또는 문자열 리터럴의 합집합(`|`))

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

// 타입 추론 결과 - const todo: TodoPreview
todo;
```

<br />

### 만들어보자.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type P<T, Literal> = {
  [Key in keyof Literal]: T[Key]; // T[Literal] 일 수는 없으니까 (Literal - 'title' | 'completed') in keyof를 사용한다.
  // ❌ Type 'Key' cannot be used to index type 'T'.ts(2536)
};
// (※ 이해를 더 쉽게하기 위해 문자열 리터럴 또는 문자열 리터럴 집합으로 오는 타입 매개변수 두 번째 인자는 변수명을 Literal로 지정했다.)

type TodoPreview = P<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

// [타입 추론 결과] - const todo: TodoPreview
todo;
```

#### 타입 Key를 T의 index로 사용할 수 없다고...? 그럼 Literal의 인덱스로는 될까...?

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type P<T, Literal> = {
  [Key in keyof Literal]: Literal[Key]; // 근데... 이렇게 하면 타입 매개변수 T가 아무곳에서도 쓰이지 않는다.
};

// 동작도 잘못 됐다.
// ❌ type TodoPreview = "title" | "completed"

// [원했던 타입]
// type TodoPreview
//   title: string;
//   completed: boolean;
// }
type TodoPreview = P<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
```

#### T와 Literal의 관계를 설정해줘보자

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type P<T, Literal extends keyof T> = { // Literal을 keyof T의 부분집합으로 제한
  [Key in Literal]: T[Key];
};

// TodoPreview 타입 구성
// type TodoPreview = { // ✅
//   title: string;
//   completed: boolean;
// }
type TodoPreview = P<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
```

> 잘되는 것 같다... Good~<br />
> (※ 제네릭으로 타입을 만들 때는, 제네릭의 '제한 조건'을 먼저 살펴보면 좋다는 것을 느낄 수 있었다.)

<br />

### 실제 Pick 타입 구성

```ts
// lib.es5.d.ts

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
