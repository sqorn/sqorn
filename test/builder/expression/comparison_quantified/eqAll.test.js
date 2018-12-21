const { sq, e, query } = require('../../tape')

describe('equal all', () => {
  describe('invalid', () => {
    query({
      name: 'e.eqAll',
      query: e.eqAll,
      error: true
    })
    query({
      name: 'e.eqAll(1)',
      query: e.eqAll(1),
      error: true
    })
    query({
      name: 'e.eqAll(1, 2, 3)',
      query: e.eqAll(1, 2, 3),
      error: true
    })
    query({
      name: 'e.eqAll(undefined, [1])',
      query: e.eqAll(undefined, [1]),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.eqAll(null, null)',
      query: e.eqAll(null, null),
      text: '($1 = all($2))',
      args: [null, null]
    })
    query({
      name: 'e.eqAll`moo``moo`',
      query: e.eqAll`moo``moo`,
      text: '(moo = all(moo))',
      args: []
    })
    query({
      name: 'e.eqAll(sq.txt`moo`, sq.return`moo`)',
      query: e.eqAll(sq.txt`moo`, sq.return`moo`),
      text: '(moo = all((select moo)))',
      args: []
    })
    query({
      name: 'e.eqAll(sq.return`moo`, sq.txt`moo`)',
      query: e.eqAll(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) = all(moo))',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.eqAll('hi', sq.return(e('hi')))",
      query: e.eqAll('hi', sq.return(e('hi'))),
      text: '($1 = all((select $2)))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.eqAll('hi', sq.return(e('hi')))",
      query: e`moo`.eqAll(sq.sql`select 'moo'`),
      text: "(moo = all((select 'moo')))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.eqAll(null, [])',
      query: e.eqAll(null, []),
      text: '($1 = all($2))',
      args: [null, []]
    })
    query({
      name: 'e.eqAll(true, [true])',
      query: e.eqAll(true, [true]),
      text: '($1 = all($2))',
      args: [true, [true]]
    })
    query({
      name: `e.eqAll('moo', ['moo'])`,
      query: e.eqAll('moo', ['moo', 'shoo']),
      text: '($1 = all($2))',
      args: ['moo', ['moo', 'shoo']]
    })
    query({
      name: 'e.eqAll(7, [4, 5, 6])',
      query: e.eqAll(7, [4, 5, 6]),
      text: '($1 = all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e.eqAll(7)([4, 5, 6])',
      query: e.eqAll(7)([4, 5, 6]),
      text: '($1 = all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).eqAll([4, 5, 6])',
      query: e(7).eqAll([4, 5, 6]),
      text: '($1 = all($2))',
      args: [7, [4, 5, 6]]
    })
    query({
      name: 'e(7).eqAll([4, 5, 6]).not',
      query: e(7).eqAll([4, 5, 6]).not,
      text: 'not(($1 = all($2)))',
      args: [7, [4, 5, 6]]
    })
  })
})
