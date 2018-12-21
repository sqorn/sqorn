const { sq, e, query } = require('../../tape')

describe('not equal all', () => {
  describe('invalid', () => {
    query({
      name: 'e.neqAll',
      query: e.neqAll,
      error: true
    })
    query({
      name: 'e.neqAll(1)',
      query: e.neqAll(1),
      error: true
    })
    query({
      name: 'e.neqAll(1, 2, 3)',
      query: e.neqAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.neqAll(undefined, [1])',
      query: e.neqAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.neqAll(null, null)',
      query: e.neqAll(null, null),
      text: '($1 <> all($2))',
      args: [null, null]
    })
    query({
      name: 'e.neqAll`moo``moo`',
      query: e.neqAll`moo``moo`,
      text: '(moo <> all(moo))',
      args: []
    })
    query({
      name: 'e.neqAll(sq.txt`moo`, sq.return`moo`)',
      query: e.neqAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo <> all((select moo)))',
      args: []
    })
    query({
      name: 'e.neqAll(sq.return`moo`, sq.txt`moo`)',
      query: e.neqAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) <> all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.neqAll('hi', sq.return(e('hi')))",
      query: e.neqAll('hi', sq.return(e('hi'))),
      text: '($1 <> all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.neqAll('hi', sq.return(e('hi')))",
      query: e`moo`.neqAll(sq.sql`select 'moo'`),
      text: "(moo <> all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.neqAll(null, [])',
      query: e.neqAll(null, []),
      text: '($1 <> all($2))',
      args: [null, []]
    })
    query({
      name: 'e.neqAll(true, [true])',
      query: e.neqAll(true, [true]),
      text: '($1 <> all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.neqAll('moo', ['moo'])`,
      query: e.neqAll('moo', ['moo', 'shoo']),
      text: '($1 <> all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.neqAll(7, [4, 5, 6])',
      query: e.neqAll(7, [4, 5, 6]),
      text: '($1 <> all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.neqAll(7)([4, 5, 6])',
      query: e.neqAll(7)([4, 5, 6]),
      text: '($1 <> all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).neqAll([4, 5, 6])',
      query: e(7).neqAll([4, 5, 6]),
      text: '($1 <> all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).neqAll([4, 5, 6]).not',
      query: e(7).neqAll([4, 5, 6]).not,
      text: 'not(($1 <> all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
