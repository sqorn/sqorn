const { sq, query } = require('../tape')

describe('insert', () => {
  describe('template string', () => {
    query({
      name: 'basic',
      query: sq.from`person(name, age)`.insert`values ('bo', 22)`,
      text: "insert into person(name, age) values ('bo', 22)"
    })
    query({
      name: 'args',
      query: sq.from`person(name, age)`.insert`values (${'bo'}, ${22})`,
      text: 'insert into person(name, age) values ($1, $2)',
      args: ['bo', 22]
    })
  })
  describe('misc', () => {
    query({
      name: 'default values',
      query: sq.from('person').insert(),
      text: 'insert into person default values'
    })
    query({
      name: 'multiple calls',
      query: sq
        .from('person')
        .insert({ a: 1 })
        .insert({ b: 2 }),
      text: 'insert into person(b) values ($1)',
      args: [2]
    })
  })
  describe('objects', () => {
    query({
      name: '1 arg, 1 prop',
      query: sq.from('person').insert({ name: 'Jo' }),
      text: `insert into person(name) values ($1)`,
      args: ['Jo']
    })
    query({
      name: '1 arg, 2 props',
      query: sq.from('person').insert({ name: 'Jo', age: 17 }),
      text: `insert into person(name, age) values ($1, $2)`,
      args: ['Jo', 17]
    })
    query({
      name: '1 arg, 3 props',
      query: sq.from('person').insert({ id: 23, name: 'Jo', age: 17 }),
      text: `insert into person(id, name, age) values ($1, $2, $3)`,
      args: [23, 'Jo', 17]
    })
    query({
      name: '2 args, same props',
      query: sq
        .from('person')
        .insert({ name: 'Jo', age: 17 }, { name: 'Mo', age: 18 }),
      text: `insert into person(name, age) values ($1, $2), ($3, $4)`,
      args: ['Jo', 17, 'Mo', 18]
    })
    query({
      name: '3 args, same props',
      query: sq
        .from('person')
        .insert(
          { name: 'Jo', age: 17 },
          { name: 'Mo', age: 18 },
          { name: 'Bo', age: 19 }
        ),
      text: `insert into person(name, age) values ($1, $2), ($3, $4), ($5, $6)`,
      args: ['Jo', 17, 'Mo', 18, 'Bo', 19]
    })
    query({
      name: '2 args, different prop order',
      query: sq
        .from('person')
        .insert({ name: 'Jo', age: 17 }, { age: 18, name: 'Mo' }),
      text: `insert into person(name, age) values ($1, $2), ($3, $4)`,
      args: ['Jo', 17, 'Mo', 18]
    })
    query({
      name: '2 args, different props',
      query: sq
        .from('person')
        .insert({ name: 'Jo', age: 17 }, { id: 23, age: 18 }),
      text: `insert into person(name, age, id) values ($1, $2, default), (default, $3, $4)`,
      args: ['Jo', 17, 18, 23]
    })
    query({
      name: '3 args, different props',
      query: sq
        .from('person')
        .insert({ name: 'Jo', age: 17 }, { id: 23, age: 18 }, { height: 60 }),
      text: `insert into person(name, age, id, height) values ($1, $2, default, default), (default, $3, $4, default), (default, default, default, $5)`,
      args: ['Jo', 17, 18, 23, 60]
    })
    query({
      name: 'null, undefined, and absent properties',
      query: sq
        .from('x')
        .insert({ a: 1, b: 2, c: 3 }, { a: null, b: undefined }),
      text:
        'insert into x(a, b, c) values ($1, $2, $3), ($4, default, default)',
      args: [1, 2, 3, null]
    })
    query({
      name: 'multiple calls, multiple differing args',
      query: sq.from('x').insert({ a: 1, b: 2 }, { a: 3 }, { b: 4, c: 5 }),
      text:
        'insert into x(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      args: [1, 2, 3, 4, 5]
    })
    query({
      name: 'snake_case keys',
      query: sq.from('person').insert({ firstName: 'Jo', lastName: 'Schmo' }),
      text: `insert into person(first_name, last_name) values ($1, $2)`,
      args: ['Jo', 'Schmo']
    })
    query({
      name: 'subquery value',
      query: sq.from('person').insert({
        firstName: sq.return`${'Shallan'}`,
        lastName: sq.txt('Davar')
      }),
      text:
        'insert into person(first_name, last_name) values ((select $1), $2)',
      args: ['Shallan', 'Davar']
    })
  })
  describe('array', () => {
    query({
      name: '3 args, same props',
      query: sq
        .from('person')
        .insert([
          { name: 'Jo', age: 17 },
          { name: 'Mo', age: 18 },
          { name: 'Bo', age: 19 }
        ]),
      text: `insert into person(name, age) values ($1, $2), ($3, $4), ($5, $6)`,
      args: ['Jo', 17, 'Mo', 18, 'Bo', 19]
    })
    query({
      name: '3 args, different props',
      query: sq
        .from('person')
        .insert([{ name: 'Jo', age: 17 }, { id: 23, age: 18 }, { height: 60 }]),
      text: `insert into person(name, age, id, height) values ($1, $2, default, default), (default, $3, $4, default), (default, default, default, $5)`,
      args: ['Jo', 17, 18, 23, 60]
    })
    query({
      name: 'snake_case keys',
      query: sq.from('person').insert([{ firstName: 'Jo', lastName: 'Schmo' }]),
      text: `insert into person(first_name, last_name) values ($1, $2)`,
      args: ['Jo', 'Schmo']
    })
    query({
      name: '1 call, multiple differing args',
      query: sq.from('x').insert([{ a: 1, b: 2 }, { a: 3 }, { b: 4, c: 5 }]),
      text:
        'insert into x(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      args: [1, 2, 3, 4, 5]
    })
    query({
      name: 'null, undefined, and absent properties',
      query: sq
        .from('x')
        .insert([{ a: 1, b: 2, c: 3 }, { a: null, b: undefined }]),
      text:
        'insert into x(a, b, c) values ($1, $2, $3), ($4, default, default)',
      args: [1, 2, 3, null]
    })
    query({
      name: 'multiple calls, multiple differing args',
      query: sq.from('x').insert([{ a: 1, b: 2 }, { a: 3 }, { b: 4, c: 5 }]),
      text:
        'insert into x(a, b, c) values ($1, $2, default), ($3, default, default), (default, $4, $5)',
      args: [1, 2, 3, 4, 5]
    })
  })
  describe('subquery', () => {
    query({
      name: 'manual',
      query: sq.from('person(name)').insert(sq.txt`values (${'Jo'})`),
      text: `insert into person(name) values ($1)`,
      args: ['Jo']
    })
    query({
      name: 'select',
      query: sq.from('person(name, age)').insert(sq.return(sq.txt('Jo'), 23)),
      text: `insert into person(name, age) (select $1, $2)`,
      args: ['Jo', 23]
    })
  })
})
