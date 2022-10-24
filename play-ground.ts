class A {
  readonly a: string;
  b: string;
}

class B implements A {
  a: string = "123";
  b: string = "world";
}
