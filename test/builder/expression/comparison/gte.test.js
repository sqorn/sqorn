const { sq, e, query } = require('../../tape')

describe('gte', () => {
  describe('invalid', () => {
    query({
      name: 'e.gte',
      query: e.gte,
      error: true
    })
    query({
      name: 'e.gte(1)',
      query: e.gte(1),
      error: true
    })
    query({
      name: 'e.gte(1, 2, 3)',
      query: e.gte(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gte(undefined)',
      query: e.gte(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gte(null, null)',
      query: e.gte(null, null),
      text: '($1 >= $2)',
      args: [null, null]
    })
    query({
      name: 'e.gte`moo``moo`',
      query: e.gte`moo``moo`,
      text: '(moo >= moo)',
      args: []
    })
    query({
      name: 'e.gte(sq.txt`moo`, sq.return`moo`)',
      query: e.gte(sq.txt`moo`, sq.return`moo`),
      text: '(moo >= (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.gte(7, 8)',
      query: e.gte(7, 8),
      text: '($1 >= $2)',
      args: [7, 8]
    })
    query({
      name: 'e.gte(7)(8)',
      query: e.gte(7)(8),
      text: '($1 >= $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).gte(8)',
      query: e(7).gte(8),
      text: '($1 >= $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).gte(8).not',
      query: e(7).gte(8).not,
      text: 'not(($1 >= $2))',
      args: [7, 8]
    })
  })
})
