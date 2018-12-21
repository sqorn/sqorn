const { sq, e, query } = require('../../tape')

describe('less than or equal all', () => {
  describe('invalid', () => {
    query({
      name: 'e.lteAll',
      query: e.lteAll,
      error: true
    })
    query({
      name: 'e.lteAll(1)',
      query: e.lteAll(1),
      error: true
    })
    query({
      name: 'e.lteAll(1, 2, 3)',
      query: e.lteAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.lteAll(undefined, [1])',
      query: e.lteAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.lteAll(null, null)',
      query: e.lteAll(null, null),
      text: '($1 <= all($2))',
      args: [null, null]
    })
    query({
      name: 'e.lteAll`moo``moo`',
      query: e.lteAll`moo``moo`,
      text: '(moo <= all(moo))',
      args: []
    })
    query({
      name: 'e.lteAll(sq.txt`moo`, sq.return`moo`)',
      query: e.lteAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo <= all((select moo)))',
      args: []
    })
    query({
      name: 'e.lteAll(sq.return`moo`, sq.txt`moo`)',
      query: e.lteAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) <= all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.lteAll('hi', sq.return(e('hi')))",
      query: e.lteAll('hi', sq.return(e('hi'))),
      text: '($1 <= all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.lteAll('hi', sq.return(e('hi')))",
      query: e`moo`.lteAll(sq.sql`select 'moo'`),
      text: "(moo <= all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.lteAll(null, [])',
      query: e.lteAll(null, []),
      text: '($1 <= all($2))',
      args: [null, []]
    })
    query({
      name: 'e.lteAll(true, [true])',
      query: e.lteAll(true, [true]),
      text: '($1 <= all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.lteAll('moo', ['moo'])`,
      query: e.lteAll('moo', ['moo', 'shoo']),
      text: '($1 <= all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.lteAll(7, [4, 5, 6])',
      query: e.lteAll(7, [4, 5, 6]),
      text: '($1 <= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.lteAll(7)([4, 5, 6])',
      query: e.lteAll(7)([4, 5, 6]),
      text: '($1 <= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).lteAll([4, 5, 6])',
      query: e(7).lteAll([4, 5, 6]),
      text: '($1 <= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).lteAll([4, 5, 6]).not',
      query: e(7).lteAll([4, 5, 6]).not,
      text: 'not(($1 <= all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
