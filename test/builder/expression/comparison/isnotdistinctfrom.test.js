const { sq, e, query } = require('../../tape')

describe('is not distinct from', () => {
  describe('invalid', () => {
    query({
      name: 'e.isNotDistinctFrom',
      query: e.isNotDistinctFrom,
      error: true
    })
    query({
      name: 'e.isNotDistinctFrom(1)',
      query: e.isNotDistinctFrom(1),
      error: true
    })
    query({
      name: 'e.isNotDistinctFrom(1, 2, 3)',
      query: e.isNotDistinctFrom(1, 2, 3),
      error: true
    })
    query({
      name: 'e.isNotDistinctFrom(undefined)',
      query: e.isNotDistinctFrom(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.isNotDistinctFrom(null, null)',
      query: e.isNotDistinctFrom(null, null),
      text: '($1 is not distinct from $2)',
      args: [null, null]
    })
    query({
      name: 'e.isNotDistinctFrom`moo``moo`',
      query: e.isNotDistinctFrom`moo``moo`,
      text: '(moo is not distinct from moo)',
      args: []
    })
    query({
      name: 'e.isNotDistinctFrom(sq.txt`moo`, sq.return`moo`)',
      query: e.isNotDistinctFrom(sq.txt`moo`, sq.return`moo`),
      text: '(moo is not distinct from (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.isNotDistinctFrom(7, 8)',
      query: e.isNotDistinctFrom(7, 8),
      text: '($1 is not distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e.isNotDistinctFrom(7)(8)',
      query: e.isNotDistinctFrom(7)(8),
      text: '($1 is not distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).isNotDistinctFrom(8)',
      query: e(7).isNotDistinctFrom(8),
      text: '($1 is not distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).isNotDistinctFrom(8).not',
      query: e(7).isNotDistinctFrom(8).not,
      text: 'not(($1 is not distinct from $2))',
      args: [7, 8]
    })
  })
})
