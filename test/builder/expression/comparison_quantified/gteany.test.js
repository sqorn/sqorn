const { sq, e, query } = require('../../tape')

describe('greater than or equal any', () => {
  describe('invalid', () => {
    query({
      name: 'e.gteAny',
      query: e.gteAny,
      error: true
    })
    query({
      name: 'e.gteAny(1)',
      query: e.gteAny(1),
      error: true
    })
    query({
      name: 'e.gteAny(1, 2, 3)',
      query: e.gteAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gteAny(undefined, [1])',
      query: e.gteAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gteAny(null, null)',
      query: e.gteAny(null, null),
      text: '($1 >= any($2))',
      args: [null, null]
    })
    query({
      name: 'e.gteAny`moo``moo`',
      query: e.gteAny`moo``moo`,
      text: '(moo >= any(moo))',
      args: []
    })
    query({
      name: 'e.gteAny(sq.txt`moo`, sq.return`moo`)',
      query: e.gteAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo >= any((select moo)))',
      args: []
    })
    query({
      name: 'e.gteAny(sq.return`moo`, sq.txt`moo`)',
      query: e.gteAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) >= any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.gteAny('hi', sq.return(e('hi')))",
      query: e.gteAny('hi', sq.return(e('hi'))),
      text: '($1 >= any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.gteAny('hi', sq.return(e('hi')))",
      query: e`moo`.gteAny(sq.sql`select 'moo'`),
      text: "(moo >= any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.gteAny(null, [])',
      query: e.gteAny(null, []),
      text: '($1 >= any($2))',
      args: [null, []]
    })
    query({
      name: 'e.gteAny(true, [true])',
      query: e.gteAny(true, [true]),
      text: '($1 >= any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.gteAny('moo', ['moo'])`,
      query: e.gteAny('moo', ['moo', 'shoo']),
      text: '($1 >= any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.gteAny(7, [4, 5, 6])',
      query: e.gteAny(7, [4, 5, 6]),
      text: '($1 >= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.gteAny(7)([4, 5, 6])',
      query: e.gteAny(7)([4, 5, 6]),
      text: '($1 >= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gteAny([4, 5, 6])',
      query: e(7).gteAny([4, 5, 6]),
      text: '($1 >= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gteAny([4, 5, 6]).not',
      query: e(7).gteAny([4, 5, 6]).not,
      text: 'not(($1 >= any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
