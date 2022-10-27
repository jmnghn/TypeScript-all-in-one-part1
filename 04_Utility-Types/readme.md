## [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

#### `Partial<Type>`

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

#### `Required<Type>`

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

#### `ReadOnly<Type>`

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

#### `Pick<Type, Keys>`

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### `Record<Keys, Type>`

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

#### `Exclude<UnionType, ExcludedMembers>`

```ts
type Exclude<T, U> = T extends U ? never : T;
```

#### `Extract<Type, Union>`

```ts
type Extract<T, U> = T extends U ? T : never;
```

#### `Omit<Type, Keys>`

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### `NonNullable<Type>`

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### `Parameters<Type>`

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

#### `ConstructorParameters<Type>`

```ts
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
```

#### `ReturnType<Type>`

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

#### `InstanceType<Type>`

```ts
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
```

#### 기타

```ts
/**
 * Convert string literal type to uppercase
 */
type Uppercase<S extends string> = intrinsic;

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to uppercase
 */
type Capitalize<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to lowercase
 */
type Uncapitalize<S extends string> = intrinsic;

function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase:
      return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase:
      return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize:
      return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize:
      return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}

/**
 * Marker for contextual 'this' type
 */
interface ThisType<T> {}
```
