## TypeScript-all-in-one-part1

> ※ fork repository: [https://github.com/jmnghn/ts-all-in-one](https://github.com/jmnghn/ts-all-in-one) <br />
> ※ original repository: [https://github.com/ZeroCho/ts-all-in-one](https://github.com/ZeroCho/ts-all-in-one)

<br />

타입스크립트의 문법도 문법이지만, 가독성이 극악(👿)인 타입스크립트로 다른 사람이 만든 라이브러리의 타입을 분석하는 능력도 정말 중요하다는 생각으로 거기에 더 포커스를 맞췄다.<br />

<br />

### 참조 링크

- [TypeScript 공식문서](https://www.typescriptlang.org/)
- [TypeScript: TS PlayGround](https://www.typescriptlang.org/play)
- [TypeScript: Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript: Documentation - Overview(버전 수정 내역)](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)

<br />

### 추천 학습 순서

(1) `TypeScript: Handbook`을 읽기 <br />
(2) TypeScript: Documentation - Overview(버전 수정 내역) 에서 1.1부터 차례대로 읽어가면서 어떤 부분들이 어떤 이유에서 바꼈는지 살펴보기

그리고 병행하기 :)

<br />

### 함께 읽어 볼 라이브러리 코드

- [axios - index.d.ts](https://github.com/axios/axios/blob/v1.x/index.d.ts)
- [react - index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)
- [nodejs - index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts)
- [express - index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express/index.d.ts)
- [jQuery - index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/jquery/JQuery.d.ts)
- [redux - index.d.ts](https://github.com/reduxjs/redux/blob/master/src/index.ts)

> 애초에 타입스크립트인 redux<br />
> 패키지 내부에서 d.ts를 제공하는 axios<br />
> @types 패키지가 별도로 존재하는 react, node, express, jQuery로 구분된다.<br />
> ※ @types는 DefinitelyTyped라는 프로젝트로, 커뮤니티에서 라이브러리 형태의 타이핑을 제공한다.
