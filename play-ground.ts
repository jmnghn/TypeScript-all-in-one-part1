// interface Axios {
//   get(): void;
// }
// interface CustomError extends Error {
//   response?: {
//     data: any; // 오버로딩의 타입이 정확하다면 any를 사용해도 무방하다.
//   };
// }
// // 타입을 정교하게 만들기는 정말 힘들다. 그런 의미에서 '일단 돌아가게', '일단 동작하게' 구현을 해놓고,
// // 나중에 문제가 생겼을 때 점진적으로 고쳐나가자.
// // 만약 extends를 모른다면, 당장은 다음과 같이 Error에 정의된 모든 속성타입을 가져와 작성해도 상관이 없다는 이야기다.
// // interface CustomError {
// //   name: string;
// //   message: string;
// //   stack?: string;
// //   response?: {
// //     data: any;
// //   };
// // }

// declare const axios: Axios;

// (async () => {
//   try {
//     await axios.get();
//   } catch (error: unknown) {
//     // console.error((error as CustomError).response?.data);
//     // 타입스크립트는 건망증이 심하다. 매번 as를 사용할 수는 없으니 타입을 지정해서 사용하자.
//     // const customError = error as CustomError;
//     // console.error(customError.response?.data);
//     // 하지만, 무분별한 as의 사용은 지양해야 한다.
//     // any만큼 남발하면 안되는 것이 as인데 위와 같이 unknown일 때 주로 어쩔 수 없이 쓴다고 보면된다.
//   }
// })();

// // 2

// interface Axios {
//   get(): void;
// }
// class CustomError extends Error {
//   response?: {
//     data: any; // 오버로딩의 타입이 정확하다면 any를 사용해도 무방하다.
//   };
// }

// declare const axios: Axios;

// (async () => {
//   try {
//     await axios.get();
//   } catch (error: unknown) {
//     const customError = error as CustomError;
//     console.error(customError.response?.data);
//     // 그리고 위의 코드는 문제가 많은(!) 코드로
//     // 다음과 같이 구현해줘야한다. (만약, CustomError가 아니라면...?)
//     if (error instanceof CustomError) {
//       // 그리고 타입가드로 타입을 좁혀(!)놨으면, 굳이 타입단언(as)을 하지 않아도 된다.
//       // const customError = error as CustomError;
//       console.error(customError.response?.data);
//     }
//     // 그리고 CustomError 타입도 class로 변경되었다.
//     // interface면 자바스크립트 변환 코드. 즉, 실행되는 코드에서 CustomError가 사라지기 때문에
//     // instanceof 검사를 할수 없기 때문이다.
//     // type은 본래 extends를 할 수 없고... ^^;
//   }
// })();

// 3
// Q1.
// 대부분의 타입들이 @types에 구현되어 있긴 하지만,
// 아직 타입이 없는 라이브러리들도 존재한다.
// 이런 경우에 직접 타입을 작성해야 경우도 있으므로 제네릭을 쓸 줄 알아야한다.

// 다시 말하지만(!)
// any는 타입 검사를 포기하겠다는 것과 같은 의미이고
// unknown은 타입캐스팅이건 타입가드이건 안전하게 쓰라는 것과 같은 의미다.
// 그러니 무조건(!) unknown 쓰기~
