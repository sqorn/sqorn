import { Builder } from "./queries";

declare let sq: Builder;
declare let a: never, b: never;

type t = 1 extends never ? true : false;
a = b;

// a = 2;

interface A {
  fn(): string
}
interface B {
  fn(): number
}

declare let x: A & B;

let y = x.fn()

interface C {
  fn(): string
}
interface D extends C {
  fn(): number
}

declare let r: A & B;

let s = r.fn()


sq.transaction;

sq.from("").extend(sq.insert());

sq.where({}).return("").group``.limit``.having``;

sq.delete.from("book").where({}).query;

sq.where({}).delete.delete;

// sq.where()

sq.insert();

sq.where({});

sq.where({}).where({});

sq.l("");

sq.order``.return("");
