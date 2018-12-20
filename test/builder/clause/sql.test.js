const { sq, query } = require('../tape')

describe('sql', () => {
  describe('template string', () => {
    query({
      name: 'raw select',
      query: sq.sql`select 7`,
      text: 'select 7'
    })
    query({
      name: 'raw delete',
      query: sq.sql`delete from book where id = 7`,
      text: 'delete from book where id = 7'
    })
    query({
      name: 'raw insert',
      query: sq.sql`insert into book (title) values ('Oathbringer')`,
      text: `insert into book (title) values ('Oathbringer')`
    })
    query({
      name: 'raw update',
      query: sq.sql`update person set age = age + 1`,
      text: 'update person set age = age + 1'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.sql`select * from ${sq.raw('book')}`,
      text: 'select * from book'
    })
    query({
      name: '2 raw args',
      query: sq.sql`select ${sq.raw('title')} from ${sq.raw('book')}`,
      text: 'select title from book'
    })
    query({
      name: '1 parameterized arg',
      query: sq.sql`select ${8} * 2 twice`,
      text: 'select $1 * 2 twice',
      args: [8]
    })
    query({
      name: '2 parameterized args',
      query: sq.sql`select ${8} * ${7} product`,
      text: 'select $1 * $2 product',
      args: [8, 7]
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.sql`select year, ${sq.raw('title')} from ${sq.raw(
        'book'
      )} where year < ${1980}`,
      text: 'select year, title from book where year < $1',
      args: [1980]
    })
  })
  describe('function argument', () => {
    query({
      name: 'string arg',
      query: sq.txt('cat'),
      text: '$1',
      args: ['cat']
    })
    query({
      name: 'two args',
      query: sq.txt('cat', 'rat'),
      text: '($1, $2)',
      args: ['cat', 'rat']
    })
    query({
      name: 'three args',
      query: sq.txt(23, false, []),
      text: '($1, $2, $3)',
      args: [23, false, []]
    })
    query({
      name: 'undefined arg 2',
      query: sq.txt(2, undefined),
      error: true
    })
    query({
      name: 'number args',
      query: sq
        .txt('cat')
        .txt(12)
        .txt(true)
        .txt([])
        .txt({}),
      text: '$1 $2 $3 $4 $5',
      args: ['cat', 12, true, [], {}]
    })
  })
  describe('multiple calls', () => {
    query({
      name: '2 calls',
      query: sq.sql`select * from book`.sql`where id = ${7}`,
      text: 'select * from book where id = $1',
      args: [7]
    })
    query({
      name: '3 calls',
      query: sq.sql`select * from book`.sql`where genre = ${'fantasy'}`
        .sql`or year = ${2000}`,
      text: 'select * from book where genre = $1 or year = $2',
      args: ['fantasy', 2000]
    })
  })
  describe('join separator', () => {
    query({
      name: 'string',
      query: sq.txt`hi`.txt`bye`.link(', '),
      text: 'hi, bye'
    })
    query({
      name: 'template string',
      query: sq.txt`hi`.txt`bye`.link`, `,
      text: 'hi, bye'
    })
  })
})
