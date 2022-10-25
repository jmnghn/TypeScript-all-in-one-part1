## union(|)과 intersection(&)

### 객체 타이핑: type과 interface 구분하기

```ts
type A = { a: string };
const a: A = { a: "hello" };

interface B {
  a: string;
}
const b: B = { a: "hello" };
```

> 간단한거는 type, 객체지향은 interface를 추천<br />
> (개인적으로는 데이터에서는 type. 클래스에서는 interface를 지향한다.)

<br />

### union (`|`)

```ts
// return 타입이 'string | number' 인게 맞아보일 수 있지만, 이후 코드에서는 이를 어떻게 처리해야 좋을지 모른다.
function add(x: string | number, y: string | number): string | number {
  return x + y; // ❌ Operator '+' cannot be applied to types 'string | number' and 'string | number'.ts(2365)
}
// union
const result: string | number = add(1, 2);

// ❌ Property 'chartAt' does not exist on type 'string | number'.
// Property 'chartAt' does not exist on type 'string'.ts(2339)
result.chartAt(0); // // ???

add(1, 2);
add("1", "2");
add(1, "2");
```

> 연산자 '+'는 'string | number' 및 'string | number' 유형에 적용할 수 없습니다.ts(2365)

<br />

### intersection(`&`)

> 모든 타입이 다 있어야 한다.

```ts
type A = string & number; // 이런 게 있을까? string 이면서 number인...
const a: A = 1;
```

> 그럼 쓸 수 없는거 아닐까...? 할 수 있지만, '객체'에서는 얘기가 다르다.

```ts
type A = { hello: "world" } & { a: "b" };
const a: A = { hello: "world", a: "b" };

// Type '{ hello: "world"; }' is not assignable to type 'A'.
// Property 'a' is missing in type '{ hello: "world"; }' but required in type '{ a: "b"; }'.ts(2322)
const a: A = { hello: "world" };
```

<br />

#### 다시 union(`|`)

> 두 타입 가운데 하나만 있으면 된다.

```ts
type A = { hello: "world" } | { a: "b" };
const a: A = { hello: "world", a: "b" };
const b: A = { hello: "world" };
const c: A = { a: "b" };
```
