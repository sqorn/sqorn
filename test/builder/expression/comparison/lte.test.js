const { sq, e, query } = require('../../tape')

describe('lte', () => {
  describe('invalid', () => {
    query({
      name: 'e.lte',
      query: e.lte,
      error: true
    })
    query({
      name: 'e.lte(1)',
      query: e.lte(1),
      error: true
    })
    query({
      name: 'e.lte(1, 2, 3)',
      query: e.lte(1, 2, 3),
      error: true
    })
    query({
      name: 'e.lte(undefined)',
      query: e.lte(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.lte(null, null)',
      query: e.lte(null, null),
      text: '($1 <= $2)',
      args: [null, null]
    })
    query({
      name: 'e.lte`moo``moo`',
      query: e.lte`moo``moo`,
      text: '(moo <= moo)',
      args: []
    })
    query({
      name: 'e.lte(sq.txt`moo`, sq.return`moo`)',
      query: e.lte(sq.txt`moo`, sq.return`moo`),
      text: '(moo <= (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.lte(7, 8)',
      query: e.lte(7, 8),
      text: '($1 <= $2)',
      args: [7, 8]
    })
    query({
      name: 'e.lte(7)(8)',
      query: e.lte(7)(8),
      text: '($1 <= $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).lte(8)',
      query: e(7).lte(8),
      text: '($1 <= $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).lte(8).not',
      query: e(7).lte(8).not,
      text: 'not(($1 <= $2))',
      args: [7, 8]
    })
  })
})
