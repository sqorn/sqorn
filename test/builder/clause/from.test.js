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
    query({
      name: 'snake_case key',
      query: sq.from({ firstName: 'person' }),
      text: 'select * from person as first_name'
    })
  })
  describe('object array property', () => {
    query({
      name: '1 object, 1 property',
      query: sq.from({
        n: [{ a: 1 }]
      }),
      text: 'select * from (values ($1)) as n(a)',
      args: [1]
    })
    query({
      name: '1 object, 3 property',
      query: sq.from({
        animal: [{ id: 1, name: 'cat', noise: 'meow' }]
      }),
      text: 'select * from (values ($1, $2, $3)) as animal(id, name, noise)',
      args: [1, 'cat', 'meow']
    })
    query({
      name: '2 objects, 3 property',
      query: sq.from({
        animal: [
          { id: 1, name: 'cat', noise: 'meow' },
          { id: 2, name: 'dog', noise: 'bark' }
        ]
      }),
      text:
        'select * from (values ($1, $2, $3), ($4, $5, $6)) as animal(id, name, noise)',
      args: [1, 'cat', 'meow', 2, 'dog', 'bark']
    })
    query({
      name: '3 objects, 3 properties',
      query: sq.from({
        n: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }, { a: 7, b: 8, c: 9 }]
      }),
      text:
        'select * from (values ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)) as n(a, b, c)',
      args: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    })
    query({
      name: 'missing properties',
      query: sq.from({
        animal: [
          { id: 1, name: 'cat' },
          { id: 2, name: undefined, noise: 'bark' }
        ]
      }),
      text:
        'select * from (values ($1, $2, default), ($3, default, $4)) as animal(id, name, noise)',
      args: [1, 'cat', 2, 'bark']
    })
    query({
      name: 'camelCase property',
      query: sq.from({
        person: [{ firstName: 'Jo' }]
      }),
      text: 'select * from (values ($1)) as person(first_name)',
      args: ['Jo']
    })
    query({
      name: 'mixedCase (erroneous use)',
      query: sq.from({
        person: [{ firstName: 'Jo', first_name: 'Jo' }]
      }),
      text: 'select * from (values ($1, $2)) as person(first_name, first_name)',
      args: ['Jo', 'Jo']
    })
  })
  describe('object subquery property', () => {
    query({
      name: 'simple',
      query: sq.from({ n: sq.l`select ${1} as a` }),
      text: 'select * from (select $1 as a) as n',
      args: [1]
    })
    query({
      name: 'complex',
      query: sq.from({
        n: sq.return({ a: 1, b: 2 }),
        m: sq.return`${3} as c`
      }).return`(n.a + n.b + m.c) as sum`,
      text:
        'select (n.a + n.b + m.c) as sum from (select $1 as a, $2 as b) as n, (select $3 as c) as m',
      args: [1, 2, 3]
    })
  })
  describe('Postgres DELETE FROM ... USING ...', () => {
    query({
      name: 'from, using',
      query: sq.delete.from`book`.from`author`,
      text: 'delete from book using author'
    })
    query({
      name: 'from, using, where',
      query: sq.delete.from`book`.from`author`
        .where`book.author_id = author.id and author.contract = 'terminated'`,
      text: `delete from book using author where (book.author_id = author.id and author.contract = 'terminated')`
    })
  })
  describe('Postgres UPDATE ... FROM ...', () => {
    query({
      name: 'update, set, from',
      query: sq.from`book`.from`author`.set({ available: false }),
      text: 'update book set available = $1 from author',
      args: [false]
    })
    query({
      name: 'update, set, from, where',
      query: sq.from`book`.from`author`.set({ available: false }).where({
        join: sq.l`book.author_id = author.id`,
        'author.contract': 'terminated'
      }),
      text: `update book set available = $1 from author where (book.author_id = author.id and author.contract = $2)`,
      args: [false, 'terminated']
    })
  })
})
