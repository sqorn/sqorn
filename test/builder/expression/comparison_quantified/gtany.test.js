const { sq, e, query } = require('../../tape')

describe('greater than any', () => {
  describe('invalid', () => {
    query({
      name: 'e.gtAny',
      query: e.gtAny,
      error: true
    })
    query({
      name: 'e.gtAny(1)',
      query: e.gtAny(1),
      error: true
    })
    query({
      name: 'e.gtAny(1, 2, 3)',
      query: e.gtAny(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gtAny(undefined, [1])',
      query: e.gtAny(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gtAny(null, null)',
      query: e.gtAny(null, null),
      text: '($1 > any($2))',
      args: [null, null]
    })
    query({
      name: 'e.gtAny`moo``moo`',
      query: e.gtAny`moo``moo`,
      text: '(moo > any(moo))',
      args: []
    })
    query({
      name: 'e.gtAny(sq.txt`moo`, sq.return`moo`)',
      query: e.gtAny(sq.txt`moo`, sq.return`moo`),
      text: '(moo > any((select moo)))',
      args: []
    })
    query({
      name: 'e.gtAny(sq.return`moo`, sq.txt`moo`)',
      query: e.gtAny(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) > any(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.gtAny('hi', sq.return(e('hi')))",
      query: e.gtAny('hi', sq.return(e('hi'))),
      text: '($1 > any((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.gtAny('hi', sq.return(e('hi')))",
      query: e`moo`.gtAny(sq.sql`select 'moo'`),
      text: "(moo > any((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.gtAny(null, [])',
      query: e.gtAny(null, []),
      text: '($1 > any($2))',
      args: [null, []]
    })
    query({
      name: 'e.gtAny(true, [true])',
      query: e.gtAny(true, [true]),
      text: '($1 > any($2))',
      args: [true, [true]]
    })
    query({
      name: `e.gtAny('moo', ['moo'])`,
      query: e.gtAny('moo', ['moo', 'shoo']),
      text: '($1 > any($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.gtAny(7, [4, 5, 6])',
      query: e.gtAny(7, [4, 5, 6]),
      text: '($1 > any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.gtAny(7)([4, 5, 6])',
      query: e.gtAny(7)([4, 5, 6]),
      text: '($1 > any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gtAny([4, 5, 6])',
      query: e(7).gtAny([4, 5, 6]),
      text: '($1 > any($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gtAny([4, 5, 6]).not',
      query: e(7).gtAny([4, 5, 6]).not,
      text: 'not(($1 > any($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
