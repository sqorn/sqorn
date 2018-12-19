const { sq, e, query } = require('../../tape')

describe('not between', () => {
  describe('invalid', () => {
    query({
      name: 'e.notBetween',
      query: e.notBetween,
      error: true
    })
    query({
      name: 'e.notBetween(1)',
      query: e.notBetween(1),
      error: true
    })
    query({
      name: 'e.notBetween(1, 2)',
      query: e.notBetween(1, 2),
      error: true
    })
    query({
      name: 'e.notBetween(1, 2, 3, 4)',
      query: e.notBetween(1, 2, 3, 4),
      error: true
    })
    query({
      name: 'e.notBetween(undefined)',
      query: e.notBetween(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.notBetween(null, null, null)',
      query: e.notBetween(null, null, null),
      text: '($1 not between $2 and $3)',
      args: [null, null, null]
    })
    query({
      name: 'e.notBetween`moo``moo``moo`',
      query: e.notBetween`moo``moo``moo`,
      text: '(moo not between moo and moo)',
      args: []
    })
    query({
      name: 'e.notBetween(sq.txt`moo`, sq.return`moo`, e`moo`)',
      query: e.notBetween(sq.txt`moo`, sq.return`moo`, e`moo`),
      text: '(moo not between (select moo) and moo)',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.notBetween(7, 8, 9)',
      query: e.notBetween(7, 8, 9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.notBetween(7)(8)(9)',
      query: e.notBetween(7)(8)(9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.notBetween(7, 8)(9)',
      query: e.notBetween(7, 8)(9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.notBetween(7)(8, 9)',
      query: e.notBetween(7)(8, 9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).notBetween(8, 9)',
      query: e(7).notBetween(8, 9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).notBetween(8)(9)',
      query: e(7).notBetween(8)(9),
      text: '($1 not between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).notBetween(8, 9).not',
      query: e(7).notBetween(8, 9).not,
      text: 'not(($1 not between $2 and $3))',
      args: [7, 8, 9]
    })
  })
})
