const { sq, e, query } = require('../../tape')

describe('less than any', () => {
  describe('invalid', () => {
    query({
      name: 'e.ltAny',
      query: e.ltAny,
      error: true
    })
    query({
      name: 'e.ltAny(1)',
      query: e.ltAny(1),
      error: true
    })
    query({
      name: 'e.ltAny(1, 2, 3)',
      query: e.ltAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.ltAny(undefined, [1])',
      query: e.ltAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.ltAny(null, null)',
      query: e.ltAny(null, null),
      text: '($1 < any($2))',
      args: [null, null]
    })
    query({
      name: 'e.ltAny`moo``moo`',
      query: e.ltAny`moo``moo`,
      text: '(moo < any(moo))',
      args: []
    })
    query({
      name: 'e.ltAny(sq.txt`moo`, sq.return`moo`)',
      query: e.ltAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo < any((select moo)))',
      args: []
    })
    query({
      name: 'e.ltAny(sq.return`moo`, sq.txt`moo`)',
      query: e.ltAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) < any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.ltAny('hi', sq.return(e('hi')))",
      query: e.ltAny('hi', sq.return(e('hi'))),
      text: '($1 < any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.ltAny('hi', sq.return(e('hi')))",
      query: e`moo`.ltAny(sq.sql`select 'moo'`),
      text: "(moo < any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.ltAny(null, [])',
      query: e.ltAny(null, []),
      text: '($1 < any($2))',
      args: [null, []]
    })
    query({
      name: 'e.ltAny(true, [true])',
      query: e.ltAny(true, [true]),
      text: '($1 < any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.ltAny('moo', ['moo'])`,
      query: e.ltAny('moo', ['moo', 'shoo']),
      text: '($1 < any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.ltAny(7, [4, 5, 6])',
      query: e.ltAny(7, [4, 5, 6]),
      text: '($1 < any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.ltAny(7)([4, 5, 6])',
      query: e.ltAny(7)([4, 5, 6]),
      text: '($1 < any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).ltAny([4, 5, 6])',
      query: e(7).ltAny([4, 5, 6]),
      text: '($1 < any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).ltAny([4, 5, 6]).not',
      query: e(7).ltAny([4, 5, 6]).not,
      text: 'not(($1 < any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
