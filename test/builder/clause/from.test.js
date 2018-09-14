const { sq, query } = require('../tape')

describe('from', () => {
  describe('template string', () => {
    query({
      name: '1 table',
      query: sq.from`book`,
      text: 'select * from book'
    })
    query({
      name: '2 tables',
      query: sq.from`book, author`,
      text: 'select * from book, author'
    })
    query({
      name: '2 calls',
      query: sq.from`book`.from`author`,
      text: 'select * from book, author'
    })
    query({
      name: 'join',
      query: sq.from`book join author on book.id = author.id`,
      text: 'select * from book join author on book.id = author.id'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.from`$${'book'}`,
      text: 'select * from book'
    })
    query({
      name: '2 raw args',
      query: sq.from`$${'book'}, $${'author'}`,
      text: 'select * from book, author'
    })
    query({
      name: '1 parameterized arg',
      query: sq.from`unnest(${[1, 2, 3]}::integer[])`,
      text: 'select * from unnest($1::integer[])',
      args: [[1, 2, 3]]
    })
    query({
      name: '2 parameterized args',
      query: sq.from`unnest(${[1, 2]}::integer[]) a, unnest(${[
        3,
        4
      ]}::integer[]) b`,
      text: 'select * from unnest($1::integer[]) a, unnest($2::integer[]) b',
      args: [[1, 2], [3, 4]]
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.from`unnest(${[1, 2]}::integer[]) $${'a'}, unnest(${[
        3,
        4
      ]}::integer[]) $${'b'}`,
      text: 'select * from unnest($1::integer[]) a, unnest($2::integer[]) b',
      args: [[1, 2], [3, 4]]
    })
  })
  describe('string args', () => {
    query({
      name: '1 table',
      query: sq.from('book'),
      text: 'select * from book'
    })
    query({
      name: '2 tables',
      query: sq.from('book', 'author'),
      text: 'select * from book, author'
    })
    query({
      name: '3 tables',
      query: sq.from('book', 'author', 'comment'),
      text: 'select * from book, author, comment'
    })
    query({
      name: '2 calls',
      query: sq.from('book').from('author'),
      text: 'select * from book, author'
    })
    query({
      name: 'mixed',
      query: sq.from('book', 'author').from('comment'),
      text: 'select * from book, author, comment'
    })
  })
  describe('object args', () => {
    query({
      name: '1 table',
      query: sq.from({ b: 'book' }),
      text: 'select * from book as b'
    })
    query({
      name: '2 tables',
      query: sq.from({ b: 'book', a: 'author' }),
      text: 'select * from book as b, author as a'
    })
    query({
      name: '2 tables',
      query: sq.from({ b: 'book', a: 'author', c: 'comment' }),
      text: 'select * from book as b, author as a, comment as c'
    })
    query({
      name: '2 calls',
      query: sq.from({ b: 'book' }).from({ a: 'author' }),
      text: 'select * from book as b, author as a'
    })
    query({
      name: 'mixed',
      query: sq.from({ b: 'book', a: 'author' }).from({ c: 'comment' }),
      text: 'select * from book as b, author as a, comment as c'
    })
  })
})
