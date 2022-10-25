## forEach 타입 직접 만들기

다른 사람이 작성한 타입을 읽을 줄 알았다면,<br />
내가 만들 줄도 알아야 하는 것... 😄

### 타입을 만들어보자

```ts
interface Arr {
  forEach(callback: (item: number) => void): void;
}

const a: Arr = [1, 2, 3];
a.forEach((item) => {
  console.log(item);
});
a.forEach((item) => {
  console.log(item);
  return "3";
});

// 잘 되는 것 같다... 하지만 문자열 배열이 존재한다면?
const b: Arr = ["1", "2", "3"]; // ❌...Type 'string' is not assignable to type 'number'.ts(2322)
b.forEach((item) => {
  console.log(item);
});
```

<br />

### 수정 1

```ts
interface Arr {
  forEach(callback: (item: number | string) => void): void;
}

// 음~ 되는 거 같다. 그러면 이제 된 걸까?
// 만약 자연스럽게 함수 내부가 조금만 더 복잡해진다면...?
const a: Arr = [1, 2, 3];
a.forEach((item) => {
  item.toFixed(1); // ❌ Property 'toFixed' does not exist on type 'string | number'. Property 'toFixed' does not exist on type 'string'.ts(2339)
});
a.forEach((item) => {
  console.log(item);
  return "3";
});

const b: Arr = ["1", "2", "3"];
b.forEach((item) => {
  item.chartAt(3); // ❌ Property 'chartAt' does not exist on type 'string | number'. Property 'chartAt' does not exist on type 'string'.ts(2339)
});
```

<br />

### 수정 2

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
}

const a: Arr<number> = [1, 2, 3];
a.forEach((item) => {
  item.toFixed(1);
});
a.forEach((item) => {
  console.log(item);
  return "3";
});

const b: Arr<string> = ["1", "2", "3"];
b.forEach((item) => {
  item.charAt(3);
});
```

> Good!

<br />

### lib.es5.d.ts의 forEach와 직접만든 타입 비교해보자.

```ts
interface Arr<T> {
  forEach(callback: (item: T) => void): void;
  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): void;
}
```

> 원본과 모양은 많이 다르지만, 충분히 좋은 타입이다.<br />
> 당장 없는 값까지 알아서 코딩하는 것은 어렵다. 점차적으로 발전시켜나가는 방향성을 갖자. :)
