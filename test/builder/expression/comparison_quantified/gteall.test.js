const { sq, e, query } = require('../../tape')

describe('greater than or equal all', () => {
  describe('invalid', () => {
    query({
      name: 'e.gteAll',
      query: e.gteAll,
      error: true
    })
    query({
      name: 'e.gteAll(1)',
      query: e.gteAll(1),
      error: true
    })
    query({
      name: 'e.gteAll(1, 2, 3)',
      query: e.gteAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gteAll(undefined, [1])',
      query: e.gteAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gteAll(null, null)',
      query: e.gteAll(null, null),
      text: '($1 >= all($2))',
      args: [null, null]
    })
    query({
      name: 'e.gteAll`moo``moo`',
      query: e.gteAll`moo``moo`,
      text: '(moo >= all(moo))',
      args: []
    })
    query({
      name: 'e.gteAll(sq.txt`moo`, sq.return`moo`)',
      query: e.gteAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo >= all((select moo)))',
      args: []
    })
    query({
      name: 'e.gteAll(sq.return`moo`, sq.txt`moo`)',
      query: e.gteAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) >= all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.gteAll('hi', sq.return(e('hi')))",
      query: e.gteAll('hi', sq.return(e('hi'))),
      text: '($1 >= all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.gteAll('hi', sq.return(e('hi')))",
      query: e`moo`.gteAll(sq.sql`select 'moo'`),
      text: "(moo >= all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.gteAll(null, [])',
      query: e.gteAll(null, []),
      text: '($1 >= all($2))',
      args: [null, []]
    })
    query({
      name: 'e.gteAll(true, [true])',
      query: e.gteAll(true, [true]),
      text: '($1 >= all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.gteAll('moo', ['moo'])`,
      query: e.gteAll('moo', ['moo', 'shoo']),
      text: '($1 >= all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.gteAll(7, [4, 5, 6])',
      query: e.gteAll(7, [4, 5, 6]),
      text: '($1 >= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.gteAll(7)([4, 5, 6])',
      query: e.gteAll(7)([4, 5, 6]),
      text: '($1 >= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gteAll([4, 5, 6])',
      query: e(7).gteAll([4, 5, 6]),
      text: '($1 >= all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).gteAll([4, 5, 6]).not',
      query: e(7).gteAll([4, 5, 6]).not,
      text: 'not(($1 >= all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
