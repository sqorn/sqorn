const { sq, e, query } = require('../../tape')

describe('less than or equal any', () => {
  describe('invalid', () => {
    query({
      name: 'e.lteAny',
      query: e.lteAny,
      error: true
    })
    query({
      name: 'e.lteAny(1)',
      query: e.lteAny(1),
      error: true
    })
    query({
      name: 'e.lteAny(1, 2, 3)',
      query: e.lteAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.lteAny(undefined, [1])',
      query: e.lteAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.lteAny(null, null)',
      query: e.lteAny(null, null),
      text: '($1 <= any($2))',
      args: [null, null]
    })
    query({
      name: 'e.lteAny`moo``moo`',
      query: e.lteAny`moo``moo`,
      text: '(moo <= any(moo))',
      args: []
    })
    query({
      name: 'e.lteAny(sq.txt`moo`, sq.return`moo`)',
      query: e.lteAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo <= any((select moo)))',
      args: []
    })
    query({
      name: 'e.lteAny(sq.return`moo`, sq.txt`moo`)',
      query: e.lteAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) <= any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.lteAny('hi', sq.return(e('hi')))",
      query: e.lteAny('hi', sq.return(e('hi'))),
      text: '($1 <= any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.lteAny('hi', sq.return(e('hi')))",
      query: e`moo`.lteAny(sq.sql`select 'moo'`),
      text: "(moo <= any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.lteAny(null, [])',
      query: e.lteAny(null, []),
      text: '($1 <= any($2))',
      args: [null, []]
    })
    query({
      name: 'e.lteAny(true, [true])',
      query: e.lteAny(true, [true]),
      text: '($1 <= any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.lteAny('moo', ['moo'])`,
      query: e.lteAny('moo', ['moo', 'shoo']),
      text: '($1 <= any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.lteAny(7, [4, 5, 6])',
      query: e.lteAny(7, [4, 5, 6]),
      text: '($1 <= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.lteAny(7)([4, 5, 6])',
      query: e.lteAny(7)([4, 5, 6]),
      text: '($1 <= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).lteAny([4, 5, 6])',
      query: e(7).lteAny([4, 5, 6]),
      text: '($1 <= any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).lteAny([4, 5, 6]).not',
      query: e(7).lteAny([4, 5, 6]).not,
      text: 'not(($1 <= any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
