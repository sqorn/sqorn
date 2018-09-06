const { sq, query } = require('../tape')

describe('ins', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      query: sq.insert`age`.value`200`,
      text: '(age) values (200)'
    })
    query({
      name: '2 column',
      query: sq.insert`age, name`.value`200, 'Jo'`,
      text: `(age, name) values (200, 'Jo')`
    })
  })
  describe('template string column names', () => {
    query({
      name: '1 raw column name',
      query: sq.insert`$${'first_name'}`.value`'Bob'`,
      text: `(first_name) values ('Bob')`
    })
    query({
      name: '2 raw column names',
      query: sq.insert`$${'first_name'}, $${'last_name'}`
        .value`'Rand', 'AlThor'`,
      text: `(first_name, last_name) values ('Rand', 'AlThor')`
    })
  })
  describe('template string values', () => {
    query({
      name: '1 raw arg',
      query: sq.insert`age, name`.value`$${200}, 'Jo'`,
      text: `(age, name) values (200, 'Jo')`
    })
    query({
      name: '2 raw args',
      query: sq.insert`age, name`.value`$${200}, $${"'Jo'"}`,
      text: `(age, name) values (200, 'Jo')`
    })
    query({
      name: '1 parameterized arg',
      query: sq.insert`age, name`.value`${200}, 'Jo'`,
      text: `(age, name) values ($1, 'Jo')`,
      args: [200]
    })
    query({
      name: '2 paramterized args',
      query: sq.insert`age, name`.value`${200}, ${'Jo'}`,
      text: `(age, name) values ($1, $2)`,
      args: [200, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.insert`age, name, name2, age2`
        .value`$${200}, ${'Jo'}, $${"'Bo'"}, ${7}`,
      text: `(age, name, name2, age2) values (200, $1, 'Bo', $2)`,
      args: ['Jo', 7]
    })
  })
  describe('template string multiple calls', () => {
    query({
      name: '2 calls',
      query: sq.insert`age`.value`200`.value`300`,
      text: '(age) values (200), (300)'
    })
    query({
      name: '3 calls',
      query: sq.insert`age`.value`200`.value`300`.value`700`,
      text: '(age) values (200), (300), (700)'
    })
    query({
      name: '2 calls and args',
      query: sq.insert`age, name, age2, name2`.value`${200}, ${'Jo'}`
        .value`${100}, ${'Bob'}`,
      text: `(age, name, age2, name2) values ($1, $2), ($3, $4)`,
      args: [200, 'Jo', 100, 'Bob']
    })
  })
  describe('object', () => {
    query({
      name: '1 call, 1 arg, 1 property',
      query: sq.insert({ name: 'Jo' }),
      text: '(name) values ($1)',
      args: ['Jo']
    })
    query({
      name: '1 call, 1 arg, 2 properties',
      query: sq.insert({ name: 'Jo', age: 7 }),
      text: '(name, age) values ($1, $2)',
      args: ['Jo', 7]
    })
    query({
      name: '1 call, 2 args, same properties',
      query: sq.insert({ name: 'Jo', age: 7 }, { name: 'Bo', age: 8 }),
      text: '(name, age) values ($1, $2), ($3, $4)',
      args: ['Jo', 7, 'Bo', 8]
    })
    query({
      name: '1 call, multiple differing args',
      query: sq.insert({ a: 1, b: 2 }, { a: 3 }, { b: 4, c: 5 }),
      text:
        '(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      args: [1, 2, 3, 4, 5]
    })
    query({
      name: 'null, undefined, and absent properties',
      query: sq.insert({ a: 1, b: 2, c: 3 }, { a: null, b: undefined }),
      text: '(a, b, c) values ($1, $2, $3), ($4, default, default)',
      args: [1, 2, 3, null]
    })
    query({
      name: 'multiple calls, multiple differing args',
      query: sq
        .insert({ a: 1, b: 2 })
        .insert({ a: 3 })
        .insert({ b: 4, c: 5 }),
      text:
        '(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      args: [1, 2, 3, 4, 5]
    })
  })
})
