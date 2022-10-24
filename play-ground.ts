function add<T extends number | string>(x: T, y: T): T {
  return x + y;
}
add<number>(1, 2);
add(1, 2);
add<string>("1", "2");
add("1", "2");
add(1, "2");
add(true, false);
