const { sq, e, query } = require('../../tape')

describe('equal any', () => {
  describe('invalid', () => {
    query({
      name: 'e.eqAny',
      query: e.eqAny,
      error: true
    })
    query({
      name: 'e.eqAny(1)',
      query: e.eqAny(1),
      error: true
    })
    query({
      name: 'e.eqAny(1, 2, 3)',
      query: e.eqAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.eqAny(undefined, [1])',
      query: e.eqAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.eqAny(null, null)',
      query: e.eqAny(null, null),
      text: '($1 = any($2))',
      args: [null, null]
    })
    query({
      name: 'e.eqAny`moo``moo`',
      query: e.eqAny`moo``moo`,
      text: '(moo = any(moo))',
      args: []
    })
    query({
      name: 'e.eqAny(sq.txt`moo`, sq.return`moo`)',
      query: e.eqAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo = any((select moo)))',
      args: []
    })
    query({
      name: 'e.eqAny(sq.return`moo`, sq.txt`moo`)',
      query: e.eqAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) = any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.eqAny('hi', sq.return(e('hi')))",
      query: e.eqAny('hi', sq.return(e('hi'))),
      text: '($1 = any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.eqAny('hi', sq.return(e('hi')))",
      query: e`moo`.eqAny(sq.sql`select 'moo'`),
      text: "(moo = any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.eqAny(null, [])',
      query: e.eqAny(null, []),
      text: '($1 = any($2))',
      args: [null, []]
    })
    query({
      name: 'e.eqAny(true, [true])',
      query: e.eqAny(true, [true]),
      text: '($1 = any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.eqAny('moo', ['moo'])`,
      query: e.eqAny('moo', ['moo', 'shoo']),
      text: '($1 = any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.eqAny(7, [4, 5, 6])',
      query: e.eqAny(7, [4, 5, 6]),
      text: '($1 = any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.eqAny(7)([4, 5, 6])',
      query: e.eqAny(7)([4, 5, 6]),
      text: '($1 = any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).eqAny([4, 5, 6])',
      query: e(7).eqAny([4, 5, 6]),
      text: '($1 = any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).eqAny([4, 5, 6]).not',
      query: e(7).eqAny([4, 5, 6]).not,
      text: 'not(($1 = any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
