const { sq, query } = require('../tape')

describe('frm', () => {
  describe('template string', () => {
    query({
      name: '1 table',
      qry: sq.frm`book`,
      txt: 'select * from book'
    })
    query({
      name: '2 tables',
      qry: sq.frm`book, author`,
      txt: 'select * from book, author'
    })
    query({
      name: 'join',
      qry: sq.frm`book join author on book.id = author.id`,
      txt: 'select * from book join author on book.id = author.id'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.frm`$${'book'}`,
      txt: 'select * from book'
    })
    query({
      name: '2 raw args',
      qry: sq.frm`$${'book'}, $${'author'}`,
      txt: 'select * from book, author'
    })
    query({
      name: '1 parameterized arg',
      qry: sq.frm`unnest(${[1, 2, 3]}::integer[])`,
      txt: 'select * from unnest($1::integer[])',
      arg: [[1, 2, 3]]
    })
    query({
      name: '2 parameterized args',
      qry: sq.frm`unnest(${[1, 2]}::integer[]) a, unnest(${[
        3,
        4
      ]}::integer[]) b`,
      txt: 'select * from unnest($1::integer[]) a, unnest($2::integer[]) b',
      arg: [[1, 2], [3, 4]]
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.frm`unnest(${[1, 2]}::integer[]) $${'a'}, unnest(${[
        3,
        4
      ]}::integer[]) $${'b'}`,
      txt: 'select * from unnest($1::integer[]) a, unnest($2::integer[]) b',
      arg: [[1, 2], [3, 4]]
    })
  })
})
