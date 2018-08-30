const { sq, query } = require('../tape')

describe('ins', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      qry: sq.ins`age`.val`200`,
      txt: '(age) values (200)'
    })
    query({
      name: '2 column',
      qry: sq.ins`age, name`.val`200, 'Jo'`,
      txt: `(age, name) values (200, 'Jo')`
    })
  })
  describe('template string column names', () => {
    query({
      name: '1 raw column name',
      qry: sq.ins`$${'first_name'}`.val`'Bob'`,
      txt: `(first_name) values ('Bob')`
    })
    query({
      name: '2 raw column names',
      qry: sq.ins`$${'first_name'}, $${'last_name'}`.val`'Rand', 'AlThor'`,
      txt: `(first_name, last_name) values ('Rand', 'AlThor')`
    })
  })
  describe('template string values', () => {
    query({
      name: '1 raw arg',
      qry: sq.ins`age, name`.val`$${200}, 'Jo'`,
      txt: `(age, name) values (200, 'Jo')`
    })
    query({
      name: '2 raw args',
      qry: sq.ins`age, name`.val`$${200}, $${"'Jo'"}`,
      txt: `(age, name) values (200, 'Jo')`
    })
    query({
      name: '1 parameterized arg',
      qry: sq.ins`age, name`.val`${200}, 'Jo'`,
      txt: `(age, name) values ($1, 'Jo')`,
      arg: [200]
    })
    query({
      name: '2 paramterized args',
      qry: sq.ins`age, name`.val`${200}, ${'Jo'}`,
      txt: `(age, name) values ($1, $2)`,
      arg: [200, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.ins`age, name, name2, age2`
        .val`$${200}, ${'Jo'}, $${"'Bo'"}, ${7}`,
      txt: `(age, name, name2, age2) values (200, $1, 'Bo', $2)`,
      arg: ['Jo', 7]
    })
  })
  describe('template string multiple calls', () => {
    query({
      name: '2 calls',
      qry: sq.ins`age`.val`200`.val`300`,
      txt: '(age) values (200), (300)'
    })
    query({
      name: '3 calls',
      qry: sq.ins`age`.val`200`.val`300`.val`700`,
      txt: '(age) values (200), (300), (700)'
    })
    query({
      name: '2 calls and args',
      qry: sq.ins`age, name, age2, name2`.val`${200}, ${'Jo'}`
        .val`${100}, ${'Bob'}`,
      txt: `(age, name, age2, name2) values ($1, $2), ($3, $4)`,
      arg: [200, 'Jo', 100, 'Bob']
    })
  })
  describe('object', () => {
    query({
      name: '1 call, 1 arg, 1 property',
      qry: sq.ins({ name: 'Jo' }),
      txt: '(name) values ($1)',
      arg: ['Jo']
    })
    query({
      name: '1 call, 1 arg, 2 properties',
      qry: sq.ins({ name: 'Jo', age: 7 }),
      txt: '(name, age) values ($1, $2)',
      arg: ['Jo', 7]
    })
    query({
      name: '1 call, 2 args, same properties',
      qry: sq.ins({ name: 'Jo', age: 7 }, { name: 'Bo', age: 8 }),
      txt: '(name, age) values ($1, $2), ($3, $4)',
      arg: ['Jo', 7, 'Bo', 8]
    })
    query({
      name: '1 call, multiple differing args',
      qry: sq.ins({ a: 1, b: 2 }, { a: 3 }, { b: 4, c: 5 }),
      txt:
        '(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      arg: [1, 2, 3, 4, 5]
    })
    query({
      name: 'null, undefined, and absent properties',
      qry: sq.ins({ a: 1, b: 2, c: 3 }, { a: null, b: undefined }),
      txt: '(a, b, c) values ($1, $2, $3), ($4, default, default)',
      arg: [1, 2, 3, null]
    })
    query({
      name: 'multiple calls, multiple differing args',
      qry: sq
        .ins({ a: 1, b: 2 })
        .ins({ a: 3 })
        .ins({ b: 4, c: 5 }),
      txt:
        '(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      arg: [1, 2, 3, 4, 5]
    })
  })
})
