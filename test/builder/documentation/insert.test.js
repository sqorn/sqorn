const { sq, e, query } = require('../tape')

describe('insert', () => {
  query({
    name: 'delete 1',
    query: sq.from`person(first_name, last_name)`
      .insert`values (${'Shallan'}, ${'Davar'})`,
    text: 'insert into person(first_name, last_name) values ($1, $2)',
    args: ['Shallan', 'Davar']
  })
  query({
    name: 'object',
    query: sq
      .from('person')
      .insert({ firstName: 'Shallan', lastName: 'Davar' }),
    text: 'insert into person(first_name, last_name) values ($1, $2)',
    args: ['Shallan', 'Davar']
  })
  query({
    name: 'undefined',
    query: sq.from('test').insert({ a: undefined, b: null }),
    text: 'insert into test(a, b) values (default, $1)',
    args: [null]
  })
  query({
    name: 'multiple objects',
    query: sq
      .from('person')
      .insert(
        { firstName: 'Shallan', lastName: 'Davar' },
        { firstName: 'Navani', lastName: 'Kholin' }
      ),
    text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
    args: ['Shallan', 'Davar', 'Navani', 'Kholin']
  })
  query({
    name: 'array',
    query: sq
      .from('person')
      .insert([
        { firstName: 'Shallan', lastName: 'Davar' },
        { firstName: 'Navani', lastName: 'Kholin' }
      ]),
    text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
    args: ['Shallan', 'Davar', 'Navani', 'Kholin']
  })
  query({
    name: 'fragment value',
    query: sq.from('person').insert({ firstName: sq.txt`'moo'` }),
    text: "insert into person(first_name) values ('moo')",
    args: []
  })
  query({
    name: 'subquery value',
    query: sq.from('person').insert({
      firstName: sq.return`${'Shallan'}`,
      lastName: sq.txt('Davar')
    }),
    text: 'insert into person(first_name, last_name) values ((select $1), $2)',
    args: ['Shallan', 'Davar']
  })
  query({
    name: 'subquery',
    query: sq
      .from('superhero(name)')
      .insert(sq.return`${'batman'}`.union(sq.return`${'superman'}`)),
    text: 'insert into superhero(name) (select $1 union (select $2))',
    args: ['batman', 'superman']
  })
  query({
    name: 'default values',
    query: sq.from('person').insert(undefined),
    text: 'insert into person default values',
    args: []
  })
  query({
    name: 'only last call used',
    query: sq
      .from('person')
      .insert({ firstName: 'Shallan', lastName: 'Davar' })
      .insert({ firstName: 'Navani', lastName: 'Kholin' }),
    text: 'insert into person(first_name, last_name) values ($1, $2)',
    args: ['Navani', 'Kholin']
  })
  query({
    name: 'returning',
    query: sq
      .from('book')
      .insert({ title: 'Squirrels and Acorns' })
      .return('id'),
    text: 'insert into book(title) values ($1) returning id',
    args: ['Squirrels and Acorns']
  })
})
