const { sq, query } = require('../tape')

describe('frm', () => {
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
      text: 'select * from author'
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
})
