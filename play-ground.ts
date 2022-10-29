// Promise는 Promise<결과값>타입으로 표시합니다.

// // 1 - ### Promise.all
// 다음은 3개의 Promise를 받아 결과값을 리턴하는 코드다.
// 그 중 p1이 좀 특이하다.
// 바로 성공하는 Promise인데, 1을 resolve하고 then이 연달아 3번 붙어 있고, 마지막 then에서는 문자열을 반환하는 형태다.
// 이런 형태를 Promise.all에 넣었을 때 결과(result)가 어떻게 되냐면
// 위 then을 모두 실행하고 최종 결과값을 result에서 return한다.

// const p1 = Promise.resolve(1)
//   .then((a) => a + 1)
//   .then((a) => a + 1)
//   .then((a) => a.toString());
// const p2 = Promise.resolve(2);
// const p3 = new Promise((res, rej) => {
//   setTimeout(res, 1000);
// });

// // [타입추론] (parameter) result: [string, number, unknown] // 😳🤔 타입스크립트는 어떻게 p1의 변화하는 타입을 알 수 있었을까?
// Promise.all([p1, p2, p3]).then((result) => {
//   console.log(result); // [ '3', 2, undefined ]
// });

// // 2 - #### Promise.all을 살펴보자

// const p1 = Promise.resolve(1)
//   .then((a) => a + 1)
//   .then((a) => a + 1)
//   .then((a) => a.toString());
// const p2 = Promise.resolve(2);
// const p3 = new Promise((res, rej) => {
//   setTimeout(res, 1000);
// });

// Promise.all([p1, p2, p3]).then((result) => {
//   console.log(result); // [ '3', 2, undefined ]
// });

// // lib.es2015.promise.d.ts
// // 😳
// interface PromiseConstructor {
//   all<T extends readonly unknown[] | []>(
//     values: T
//   ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
// }

// // 3 - #### 하나하나 살펴보자, -readonly [P in keyof T]
// interface PromiseConstructor {
//   all<T extends readonly unknown[] | []>(
//     values: T
//   ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
// }

// // T 가 뭐였을까?
// // [p1, p2, p3]을 인자로 받는 Promise.all의
// // 첫 T는 제네릭으로 [p1, p2, p3] 를 받는다.
// // T는 [p1, p2, p3] 이다.

// // typeof T는 뭘까?

// // 배열을 타입으로 받으면 다음과 같다.
// // [타입추론] const arr: readonly [1, 2, 3]
// const arr = [1, 2, 3] as const;

// // 이 arr을 또 keyof로 추출하면 다음과 같다.
// // [타입추론] type Arr = keyof readonly [1, 2, 3]
// type Arr = keyof typeof arr;

// // 검증
// const key1: Arr = 0;
// const key2: Arr = 4;
// const key3: Arr = 999999;
// const key4: Arr = "length";
// const key5: Arr = "2";
// const key6: Arr = "3"; // ❌

// // 이를 통해 살펴본 내용을 객체로 표현해보자면... { '0': p1, '1': p2, '2': p3, length: 3 }가 되는 듯 해보인다. (키가 문자열)
// // 'readonly [1, 2, 3]'의 keyof기 때문이다.

// // 그러므로,
// // keyof T는 '0' | '1' | '2' | length 가 될 것이다.

// const p1 = Promise.resolve(1)
//   .then((a) => a + 1)
//   .then((a) => a + 1)
//   .then((a) => a.toString());
// const p2 = Promise.resolve(2);
// const p3 = new Promise((res, rej) => {
//   setTimeout(res, 1000);
// });

// // 그리고 -readonly 로 인해
// // 인자로 받을 때는 readonly로 받지만, (readonly [1, 2, 3])
// Promise.all([p1, p2, p3]).then((result) => {
//   // result에서는 readonly를 제거해 이를 변경하면서 사용할 수 있다.
//   console.log(result);
// });

// 4 - #### `in` 다시 한번 살펴보기 (Mapped Types)
// [handbook](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html);
// [pull request](https://github.com/Microsoft/TypeScript/pull/12114)

// 5 - #### Awaited<T[P]>
// Awaited는 어떤 마법을 부려서 then체인을 한번에 해석해서 최종타입으로 바꿔줄 수 있었을까?

// 일단, Awaited 코드를 살펴보기 전에 Awaited<T[P]> 에서 T[P]로 배열의 값들을 전달해주고 있었다는 것을 기억하자.

// lib.es5.d.ts
// 그러면 여기의 <T>는 배열의 값들일 것이다.
type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

// 자, 컨디셔널 타입이 3번에 겁먹지 말고 천천히 살펴보자 ^^;
// 첫번째 라인부터 살펴보면 삼항연산자를 사용해서 null 또는 undefined면 그대로 반환하라는 의미인데, 
// 그런 상황은 없다고 생각하고 첫번째 라인은 우선 제거해보자.
type Awaited<T> = T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

// 그럼 이제 T extends object & { then(onfulfilled: infer F) 가 만족하는지를 살펴보면 되는데,
// Promise는 객체니까 일단 object는 패스.
// 그리고 Promise는 then이라는 메서드가 있는 객체인지를 보면 패스.

// F는 then에 들어간 infer로 인해 타입으로 추론이 될 것인데,
// then의 타입을 살펴보면
interface P<T> {
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
}
// 에서 '((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null' 부분이 then의 타입이 될 것이다.
// 이 부분을 타입스크립트가 infer로 추론을 할 것이다.


// 그럼 이제 infer로 추론한 F를 살펴보자.
F extends (value: infer V, ...args: any) => any  ? Awaited<V> : never
// (value: infer V, ...args: any) => any 를 통해 함수꼴인지는 확인을 했다. (위의 then의 타입이 함수꼴)
// 그래서 Awatied<V>로 간다. 결과적으로는 V에 인자로 넘긴 value의 타입이 들어오고 재귀로 호출한다.

// 그럼 다시 정확히 왜 string이 나오는지를 살펴보자.
const p1 = Promise.resolve(1)
  .then((a) => a + 1)
  .then((a) => a + 1)
  .then((a) => a.toString());

// (1) .resolve(1)
// lib.es2015.promise.d.ts
resolve<T>(value: T | PromiseLike<T>): Promise<T>;

// resolve의 value가 number이므로 T가 number가 되서, Promise<number>

// (2) .then((a) => a + 1)
then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

// 매개변수 타입이 길어 헷갈릴 수 있지만, 마지막 부분의 : Promise<TResult1 | TResult2>; 가 리턴타입이다.
// TResult2 = never로 사용하지 않으니까 넘어가고, 또 우리는 예외상황을 다루고 있는 것은 아니니까 이를 다루는 인자는 넘어가
// TResult1에 대한 타입에만 집중하면 된다. 함수꼴로 받으며 value로 받은 타입 T를 TResult1의 타입(T)으로 사용하고 있다는 걸 알 수 있으므로,
// .then((a) => a + 1)가 onfulfilled된 인자 value의 T는 number 이므로, Promise<number> 가 된다.

// (3) .then((a) => a + 1) 도 마찬가지로 Promise<number>

// (4) 그리고 마지막으로 .then((a) => a.toString()) 이 string으로 바뀌었으니까 Promise<number>

// ❌
// 흐름을 대략적으로 적어보자면,
// null, undefined 검사는 넘어가고
// 들어온 타입이 onfulfilled인자를 갖는 then메서드를 가지고 있는 타입(Promise 타입)이면, 이 인자를 추론하고 (F)
// 그 value. 즉, then의 인자의 타입을 추론해 재귀로 Awaited가 돌면,
// 더이상 thenable한 타입이 아니므로 그 타입을 돌려준다.

// #### Promise와 모양만 같다면 인자자리의 타입을 잘 추론해낸다.
// [타입추론] type Result = number
type Result = Awaited<{ then(onfulfilled: (v: number) => number): any }>

// 설명을 들으니까야 흐름은 어느정도 보이지만...
// 만들어야 하는 상황이라면...?...

// Promise.then의 흐름에 대해서도 학습이 되는 것 같다.

// YOU DON`T KNOW JS - 238page
// duck typing
// thenable