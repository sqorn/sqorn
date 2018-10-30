import { Builder } from "./queries";

declare let sq: Builder;
declare let a: never, b: never;

type t = 1 extends never ? true : false;
a = b;

a = 2;

sq.transaction;

sq.from("").extend(sq.insert());

sq.where({}).return("").group``.limit``.having``;

sq.delete.from("book").where({}).query;

sq.where({}).delete.delete;

sq.

// sq.where()

sq.insert();

sq.where({});

sq.where({}).where({});

sq.l("");

sq.order``.return("");
