const { sq, e, query } = require('../../tape')

describe('not equal any', () => {
  describe('invalid', () => {
    query({
      name: 'e.neqAny',
      query: e.neqAny,
      error: true
    })
    query({
      name: 'e.neqAny(1)',
      query: e.neqAny(1),
      error: true
    })
    query({
      name: 'e.neqAny(1, 2, 3)',
      query: e.neqAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.neqAny(undefined, [1])',
      query: e.neqAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.neqAny(null, null)',
      query: e.neqAny(null, null),
      text: '($1 <> any($2))',
      args: [null, null]
    })
    query({
      name: 'e.neqAny`moo``moo`',
      query: e.neqAny`moo``moo`,
      text: '(moo <> any(moo))',
      args: []
    })
    query({
      name: 'e.neqAny(sq.txt`moo`, sq.return`moo`)',
      query: e.neqAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo <> any((select moo)))',
      args: []
    })
    query({
      name: 'e.neqAny(sq.return`moo`, sq.txt`moo`)',
      query: e.neqAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) <> any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.neqAny('hi', sq.return(e('hi')))",
      query: e.neqAny('hi', sq.return(e('hi'))),
      text: '($1 <> any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.neqAny('hi', sq.return(e('hi')))",
      query: e`moo`.neqAny(sq.sql`select 'moo'`),
      text: "(moo <> any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.neqAny(null, [])',
      query: e.neqAny(null, []),
      text: '($1 <> any($2))',
      args: [null, []]
    })
    query({
      name: 'e.neqAny(true, [true])',
      query: e.neqAny(true, [true]),
      text: '($1 <> any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.neqAny('moo', ['moo'])`,
      query: e.neqAny('moo', ['moo', 'shoo']),
      text: '($1 <> any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.neqAny(7, [4, 5, 6])',
      query: e.neqAny(7, [4, 5, 6]),
      text: '($1 <> any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.neqAny(7)([4, 5, 6])',
      query: e.neqAny(7)([4, 5, 6]),
      text: '($1 <> any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).neqAny([4, 5, 6])',
      query: e(7).neqAny([4, 5, 6]),
      text: '($1 <> any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).neqAny([4, 5, 6]).not',
      query: e(7).neqAny([4, 5, 6]).not,
      text: 'not(($1 <> any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
