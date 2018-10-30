// import { Builder } from "./queries";
import { SUDIVM } from './builders'

declare let sq: SUDIVM;
declare let a: 'Select';

sq.insert({}).from('');
sq.where({}).offset``.limit``
// sq.having()

// type x = ('a' & 'b') | ('b' & 'c')
// type y = ('a' | 'b') & ('b' | 'c')
// type z = ('a' | 'b') & ( 'c')

sq.insert();
sq.return()
sq.where({})
const x = sq.extend(sq.insert({})).extend(sq.where({}))
sq.extend(sq.insert(), sq.limit``)

sq.extend(sq.insert())
sq.extend(sq.from(), sq.where({}))
sq.extend(sq.insert(), sq.where({}))
sq.extend(sq.insert(), sq.insert(), sq.insert())

declare const c: never; 
const i: number = c; // No Error
const y: {a : number} = c; // No Error

sq.extend(sq.insert(), sq.limit``)



sq.where({}).extend(sq.set({}).from('').extend(sq.where({})).return(''));
sq.where({}).extend(sq.where({})).extend(sq.from(), sq.from());

sq.extend(
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
  sq.from({}),
).where({})

sq.extend(sq.from('')).extend(sq.where({}));

const xk = [sq.where({}), sq.limit``]

sq.extend(sq.from(''), ...xk)

sq.extend(sq.from(''))
sq.extend(sq.values())
sq.extend(sq.limit``, sq.offset``, sq.where({}))
sq.extend(sq.limit``, sq.where({}), sq.insert({}))

sq.extend(x)
// declare let a: never, b: never;
// sq.from('book').where({}).limit``.where({})
// // sq.insert().from().
// sq.where({}).delete.from('')
// sq.from('').where({}).delete.delete

// sq.extend(sq.from())
// sq.insert();

// //.extend(sq.from())

// sq.delete.from('book').where`id = ${7}`.with``

// type t = 1 extends never ? true : false;
// a = b;

// a = 2;

// sq.transaction;

// sq.from("").extend(sq.insert());

// sq.where({}).return("").group``.limit``.having``;

// sq.delete.from("book").where({}).query;

// sq.where({}).delete.delete;

// sq.

// // sq.where()

// sq.insert();

// sq.where({});

// sq.where({}).where({});

// sq.l("");

// sq.order``.return("");
