const { sq, e, query } = require('../../tape')

describe('less than all', () => {
  describe('invalid', () => {
    query({
      name: 'e.ltAll',
      query: e.ltAll,
      error: true
    })
    query({
      name: 'e.ltAll(1)',
      query: e.ltAll(1),
      error: true
    })
    query({
      name: 'e.ltAll(1, 2, 3)',
      query: e.ltAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.ltAll(undefined, [1])',
      query: e.ltAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.ltAll(null, null)',
      query: e.ltAll(null, null),
      text: '($1 < all($2))',
      args: [null, null]
    })
    query({
      name: 'e.ltAll`moo``moo`',
      query: e.ltAll`moo``moo`,
      text: '(moo < all(moo))',
      args: []
    })
    query({
      name: 'e.ltAll(sq.txt`moo`, sq.return`moo`)',
      query: e.ltAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo < all((select moo)))',
      args: []
    })
    query({
      name: 'e.ltAll(sq.return`moo`, sq.txt`moo`)',
      query: e.ltAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) < all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.ltAll('hi', sq.return(e('hi')))",
      query: e.ltAll('hi', sq.return(e('hi'))),
      text: '($1 < all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.ltAll('hi', sq.return(e('hi')))",
      query: e`moo`.ltAll(sq.sql`select 'moo'`),
      text: "(moo < all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.ltAll(null, [])',
      query: e.ltAll(null, []),
      text: '($1 < all($2))',
      args: [null, []]
    })
    query({
      name: 'e.ltAll(true, [true])',
      query: e.ltAll(true, [true]),
      text: '($1 < all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.ltAll('moo', ['moo'])`,
      query: e.ltAll('moo', ['moo', 'shoo']),
      text: '($1 < all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.ltAll(7, [4, 5, 6])',
      query: e.ltAll(7, [4, 5, 6]),
      text: '($1 < all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.ltAll(7)([4, 5, 6])',
      query: e.ltAll(7)([4, 5, 6]),
      text: '($1 < all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).ltAll([4, 5, 6])',
      query: e(7).ltAll([4, 5, 6]),
      text: '($1 < all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).ltAll([4, 5, 6]).not',
      query: e(7).ltAll([4, 5, 6]).not,
      text: 'not(($1 < all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
