const { sq, e, query } = require('../../tape')

describe('not in', () => {
  describe('invalid', () => {
    query({
      name: 'e.notIn',
      query: e.notIn,
      error: true
    })
    query({
      name: 'e.notIn(1)',
      query: e.notIn(1),
      error: true
    })
    query({
      name: 'e.notIn(1, 2, 3)',
      query: e.notIn(1, 2, 3),
      error: true
    })
    query({
      name: 'e.notIn(undefined, [1])',
      query: e.notIn(undefined, [1]),
      error: true
    })
    query({
      name: 'e.notIn(true, [])',
      query: e.notIn(true, []),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.notIn(null, null)',
      query: e.notIn(null, null),
      text: '($1 not in $2)',
      args: [null, null]
    })
    query({
      name: 'e.notIn`moo``moo`',
      query: e.notIn`moo``moo`,
      text: '(moo not in moo)',
      args: []
    })
    query({
      name: 'e.notIn(sq.txt`moo`, sq.return`moo`)',
      query: e.notIn(sq.txt`moo`, sq.return`moo`),
      text: '(moo not in (select moo))',
      args: []
    })
    query({
      name: 'e.notIn(sq.return`moo`, sq.txt`moo`)',
      query: e.notIn(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) not in moo)',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.notIn('hi', sq.return(e('hi')))",
      query: e.notIn('hi', sq.return(e('hi'))),
      text: '($1 not in (select $2))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.notIn('hi', sq.return(e('hi')))",
      query: e`moo`.notIn(sq.sql`select 'moo'`),
      text: "(moo not in (select 'moo'))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.notIn(true, [true])',
      query: e.notIn(true, [true]),
      text: '($1 not in ($2))',
      args: [true, true]
    })
    query({
      name: `e.notIn('moo', ['moo'])`,
      query: e.notIn('moo', ['moo', 'shoo']),
      text: '($1 not in ($2, $3))',
      args: ['moo', 'moo', 'shoo']
    })
    query({
      name: 'e.notIn(7, [4, 5, 6])',
      query: e.notIn(7, [4, 5, 6]),
      text: '($1 not in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e.notIn(7)([4, 5, 6])',
      query: e.notIn(7)([4, 5, 6]),
      text: '($1 not in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e(7).notIn([4, 5, 6])',
      query: e(7).notIn([4, 5, 6]),
      text: '($1 not in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e(7).notIn([4, 5, 6]).not',
      query: e(7).notIn([4, 5, 6]).not,
      text: 'not(($1 not in ($2, $3, $4)))',
      args: [7, 4, 5, 6]
    })
  })
})
