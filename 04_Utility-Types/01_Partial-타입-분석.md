## Partial 타입 분석

Partial, 모든 타입을 옵셔널하게...!<br />

```ts
interface Todo {
  title: string;
  description: string;
}

// 할 일 항목에 속성(field)를 수정하는 함수
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash", // ✅ title 속성은 없이 description만 전달해도 오류가 나지 않는다.
});
// ❌ Partial없이 Todo인 경우 (fieldsToUpdate: Todo)
// ...Property 'title' is missing in type '{ description: string; }' but required in type 'Todo'.ts(2345)
```

<br />

### 직접 만들어보기

```ts
interface Todo {
  title: string;
  description: string;
}

// (indexed signature)
type P<T> = {
  [Key in keyof T]?: T[Key];
};
// 위 타입을 풀어놓은 형태 (in keyof 복습 ^^; 내부 동작에서 값을 가져오듯 type을 가져온다 😲)
// P<Todo> {
//   title?: string;
//   description?: string;
// }

function updateTodo(todo: Todo, fieldsToUpdate: P<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

#### 실제 Partial 구조

```ts
// lib.es5.d.ts

/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
// P를 조금 더 알아보기 쉽게 Key로 추상화한 것 뿐 차이가 없다.
```

> 개인적으로는 거의 안쓴다. 모두 옵셔널로 변경한다는건 아무것도 안넣어도 된다는 이야기기 때문에...<br />
> 그래서 Pick과 Omit이 자주 쓰이는 편이다.
