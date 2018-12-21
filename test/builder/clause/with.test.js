const { sq, query } = require('../tape')

describe('with', () => {
  describe('template string', () => {
    query({
      name: 'one',
      query: sq.with`c(x, y) (values (1, 2), (3, 4))`.from`c`,
      text: 'with c(x, y) (values (1, 2), (3, 4)) select * from c'
    })
    query({
      name: 'multiple',
      query: sq.with`a(x, y) (values (1, 2))`.with`b(x, y) (values (3, 4))`
        .with`c(x, y) (values (5, 6))`.from`a union all b union all c`,
      text:
        'with a(x, y) (values (1, 2)), b(x, y) (values (3, 4)), c(x, y) (values (5, 6)) select * from a union all b union all c'
    })
    query({
      name: 'args',
      query: sq.with`c(x, y) (values (${1}, ${2}), (${3}, ${4}))`.from`c`,
      text: 'with c(x, y) (values ($1, $2), ($3, $4)) select * from c',
      args: [1, 2, 3, 4]
    })
  })
  describe('object - subquery arg', () => {
    query({
      name: 'manual subquery arg',
      query: sq.with({ a: sq.sql`select ${1}, ${2}` }).from`a`,
      text: 'with a (select $1, $2) select * from a',
      args: [1, 2]
    })
    query({
      name: 'select subquery arg',
      query: sq.with({ a: sq.return`${1}, ${2}` }).from`a`,
      text: 'with a (select $1, $2) select * from a',
      args: [1, 2]
    })
    query({
      name: 'delete subquery arg',
      query: sq.with({ a: sq.delete.from`b`.return`*` }).from`a`,
      text: 'with a (delete from b returning *) select * from a'
    })
    query({
      name: 'insert subquery arg',
      query: sq.with({ a: sq.from`b`.insert({ x: 1 }).return`*` }).from`a`,
      text: 'with a (insert into b(x) values ($1) returning *) select * from a',
      args: [1]
    })
    query({
      name: 'update subquery arg',
      query: sq.with({ a: sq.from`b`.set({ x: 1 }).return`*` }).from`a`,
      text: 'with a (update b set x = $1 returning *) select * from a',
      args: [1]
    })
    // TODO: uncomment when .values is implemented
    // query({
    //   name: 'values subquery arg',
    //   query: sq.with({ 'a(x, y)': sq.values([1, 2], [3, 4]) }).from`a`,
    //   text: 'with a(x, y) (values ($1, $2), ($3, $4)) select * from a',
    //   args: [1, 2, 3, 4]
    // })
    query({
      name: 'values array arg',
      query: sq.with({ a: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }).from`a`,
      text: 'with a(x, y) (values ($1, $2), ($3, $4)) select * from a',
      args: [1, 2, 3, 4]
    })
    query({
      name: 'two object props',
      query: sq.with({
        a: sq.return({ x: 1, y: 2 }),
        b: sq.return({ x: 3, y: 4 })
      }).from`a`.unionAll(sq.from`b`),
      text:
        'with a (select $1 x, $2 y), b (select $3 x, $4 y) select * from a union all (select * from b)',
      args: [1, 2, 3, 4]
    })
    query({
      name: 'two objects',
      query: sq
        .with({
          a: sq.return({ x: 1, y: 2 })
        })
        .with({
          b: sq.return({ x: 3, y: 4 })
        }).from`a`.unionAll(sq.from`b`),
      text:
        'with a (select $1 x, $2 y), b (select $3 x, $4 y) select * from a union all (select * from b)',
      args: [1, 2, 3, 4]
    })
  })
  describe('recursive', () => {
    query({
      name: 'one',
      query: sq.withRecursive({
        't(n)': sq.return`1`.unionAll(sq.sql`select n + 1 from t where n < 100`)
      }).return`sum(n)`,
      text:
        'with recursive t(n) (select 1 union all (select n + 1 from t where n < 100)) select sum(n)'
    })
  })
})
