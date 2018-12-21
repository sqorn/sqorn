const { sq, e, query } = require('../../tape')

describe('greater than all', () => {
  describe('invalid', () => {
    query({
      name: 'e.gtAll',
      query: e.gtAll,
      error: true
    })
    query({
      name: 'e.gtAll(1)',
      query: e.gtAll(1),
      error: true
    })
    query({
      name: 'e.gtAll(1, 2, 3)',
      query: e.gtAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gtAll(undefined, [1])',
      query: e.gtAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gtAll(null, null)',
      query: e.gtAll(null, null),
      text: '($1 > all($2))',
      args: [null, null]
    })
    query({
      name: 'e.gtAll`moo``moo`',
      query: e.gtAll`moo``moo`,
      text: '(moo > all(moo))',
      args: []
    })
    query({
      name: 'e.gtAll(sq.txt`moo`, sq.return`moo`)',
      query: e.gtAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo > all((select moo)))',
      args: []
    })
    query({
      name: 'e.gtAll(sq.return`moo`, sq.txt`moo`)',
      query: e.gtAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) > all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.gtAll('hi', sq.return(e('hi')))",
      query: e.gtAll('hi', sq.return(e('hi'))),
      text: '($1 > all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.gtAll('hi', sq.return(e('hi')))",
      query: e`moo`.gtAll(sq.sql`select 'moo'`),
      text: "(moo > all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.gtAll(null, [])',
      query: e.gtAll(null, []),
      text: '($1 > all($2))',
      args: [null, []]
    })
    query({
      name: 'e.gtAll(true, [true])',
      query: e.gtAll(true, [true]),
      text: '($1 > all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.gtAll('moo', ['moo'])`,
      query: e.gtAll('moo', ['moo', 'shoo']),
      text: '($1 > all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.gtAll(7, [4, 5, 6])',
      query: e.gtAll(7, [4, 5, 6]),
      text: '($1 > all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.gtAll(7)([4, 5, 6])',
      query: e.gtAll(7)([4, 5, 6]),
      text: '($1 > all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gtAll([4, 5, 6])',
      query: e(7).gtAll([4, 5, 6]),
      text: '($1 > all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gtAll([4, 5, 6]).not',
      query: e(7).gtAll([4, 5, 6]).not,
      text: 'not(($1 > all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
