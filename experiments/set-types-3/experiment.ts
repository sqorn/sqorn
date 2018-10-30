import { Root, Query } from "./queries";
// import { SUDIVM } from './builders'

declare let sq: Root;

sq.from('book').all()
sq.where({}).limit``.return('')

sq.from('book').where({ x: 7 }).return
// select * from book;


sq.where({}).link('a').link('b').set({});

sq.from('').where({});

sq.from('').from('').link('');

sq.insert({}).from({})

sq.insert({}).return({});

sq.link('').link('').from('')

const book = sq.from('book')

const fantasy = book.where({ genre: 'Fantasy' })

fantasy.return()

// sq.where({}).qu

type x = (1 & 2) | (2 & 3)

sq.from('').all()
sq.where({}).return('').where({}).all()

sq.from({})

// sq.where({}).

declare let b: boolean;
let jx = b ? sq.from('') : sq.where({})
let jxh = b ? sq.values() : sq.where({})
const ajj = sq.where({})
const adj = sq.limit``
const adjjjj = adj.return('')
const ajjj = ajj.limit``
const axi = ajjj.return('')
sq.extend(jxh, sq.insert())
let jz = sq.from('')
jz.all()
let jdjk = b ? 1 : 'asd';
let jy = jx as unknown as Query<'I'>

// sq.transaction(async () => {

// })

sq.extend(sq)

sq.where({}).where({}).from('').set({})

sq.insert().from('').with``;

sq.insert().extend(sq.insert())
sq.insert().extend(sq.where({}))

sq.extend(sq.limit``, sq.where({})).extend(1)

sq.link().where().

// sq.limit``

sq.set({}).where({}).return('').return('')


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
