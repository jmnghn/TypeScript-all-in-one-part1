## {}와 Object

4.8버전에서 추가된 `{}`와 `Object`

```ts
const x: {} = true;
const y: Object = "hi"; // {}, Object 는 모든 타입을 뜻한다. (null과 undefined는 제외)
const xx: object = "hi"; // 객체만을 타입으로 지정하고 싶다면 소문자 object를 사용해야 한다.
const yy: object = { hello: "world" }; // 하지만 object는 지양하자. interface, type, class를 활용하자 :)
const z: unknown = "hi";

// unknown = {} | null | undefined (v4.8)
// 그 전까지는 unknown
if (z) {
  z;
}
```
