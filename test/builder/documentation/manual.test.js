const { sq, e, query } = require('../tape')

describe('about', () => {
  query({
    name: '.sql',
    query: sq.sql`select * from person where age >= ${20} and age < ${30}`,
    text: 'select * from person where age >= $1 and age < $2',
    args: [20, 30]
  })
  test('unparameterized', () => {
    expect(
      sq.sql`select * from person where age >= ${20} and age < ${30}`
        .unparameterized
    ).toEqual('select * from person where age >= 20 and age < 30')
  })
  query({
    name: '.sql null',
    query: sq.sql`select ${null}`,
    text: 'select $1',
    args: [null]
  })
  query({
    name: '.sql undefined',
    query: sq.sql`select ${undefined}`,
    error: true
  })
  query({
    name: '.sql chain',
    query: sq.sql`select *`.sql`from person`
      .sql`where age >= ${20} and age < ${30}`,
    text: 'select * from person where age >= $1 and age < $2',
    args: [20, 30]
  })
  {
    const select = sq.sql`select *`
    const person = select.sql`from person`
    const book = select.sql`from book`
    query({
      name: 'immutable 1',
      query: select,
      text: 'select *',
      args: []
    })
    query({
      name: 'immutable 2',
      query: person,
      text: 'select * from person',
      args: []
    })
    query({
      name: 'immutable 3',
      query: book,
      text: 'select * from book',
      args: []
    })
  }
  query({
    name: '.raw',
    query: sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`,
    text: 'select * from test_table where id = $1',
    args: [7]
  })
  {
    const Hi = sq.sql`select ${'hi'}`
    const Bye = sq.sql`select ${'bye'}`
    query({
      name: '.sql subquery',
      query: sq.sql`select ${Hi},`.sql(Bye),
      text: 'select (select $1), (select $2)',
      args: ['hi', 'bye']
    })
  }
  query({
    name: '.sql function',
    query: sq.sql`select * from`.sql(sq.raw('person')).sql`where age =`.sql(
      sq.sql`select`.sql(20)
    ),
    text: 'select * from person where age = (select $1)',
    args: [20]
  })
  query({
    name: '.sql multiple args row',
    query: sq.sql`select`.sql(1, true, 'moo'),
    text: 'select ($1, $2, $3)',
    args: [1, true, 'moo']
  })
  query({
    name: '.sql multiple args values list',
    query: sq.sql`select * from book where id in`.sql(...[3, 30, 20]),
    text: 'select * from book where id in ($1, $2, $3)',
    args: [3, 30, 20]
  })
  {
    const Where = sq.txt`where age >= ${20}`
    query({
      name: '.txt',
      query: sq.sql`select * from person ${Where}`,
      text: 'select * from person where age >= $1',
      args: [20]
    })
  }
  {
    const FromWhere = sq.txt`from person`.txt`where age >=`.txt(20)
    query({
      name: '.txt chain and embed',
      query: sq.sql`select * ${FromWhere}`,
      text: 'select * from person where age >= $1',
      args: [20]
    })
  }
  query({
    name: 'extend',
    query: sq.extend(
      sq.sql`select *`,
      sq.sql`from person`,
      sq.sql`where age >= ${20} and age < ${30}`
    ),
    text: 'select * from person where age >= $1 and age < $2',
    args: [20, 30]
  })
  query({
    name: 'extend array',
    query: sq.extend([
      sq.sql`select * from person where age >= ${20}`,
      sq.sql`and age < ${30}`
    ]),
    text: 'select * from person where age >= $1 and age < $2',
    args: [20, 30]
  })
  {
    const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
    const b = books.map(book => sq.txt(book.id, book.title))
    const values = sq.extend(b).link(', ')

    query({
      name: 'link',
      query: sq.sql`insert into book(id, title)`.sql`values ${values}`.link(
        '\n'
      ),
      text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
      args: [1, '1984', 2, 'Dracula']
    })
  }
})
