const { sq, e, query } = require('../../tape')

describe('is distinct from', () => {
  describe('invalid', () => {
    query({
      name: 'e.isDistinctFrom',
      query: e.isDistinctFrom,
      error: true
    })
    query({
      name: 'e.isDistinctFrom(1)',
      query: e.isDistinctFrom(1),
      error: true
    })
    query({
      name: 'e.isDistinctFrom(1, 2, 3)',
      query: e.isDistinctFrom(1, 2, 3),
      error: true
    })
    query({
      name: 'e.isDistinctFrom(undefined)',
      query: e.isDistinctFrom(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.isDistinctFrom(null, null)',
      query: e.isDistinctFrom(null, null),
      text: '($1 is distinct from $2)',
      args: [null, null]
    })
    query({
      name: 'e.isDistinctFrom`moo``moo`',
      query: e.isDistinctFrom`moo``moo`,
      text: '(moo is distinct from moo)',
      args: []
    })
    query({
      name: 'e.isDistinctFrom(sq.txt`moo`, sq.return`moo`)',
      query: e.isDistinctFrom(sq.txt`moo`, sq.return`moo`),
      text: '(moo is distinct from (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.isDistinctFrom(7, 8)',
      query: e.isDistinctFrom(7, 8),
      text: '($1 is distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e.isDistinctFrom(7)(8)',
      query: e.isDistinctFrom(7)(8),
      text: '($1 is distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).isDistinctFrom(8)',
      query: e(7).isDistinctFrom(8),
      text: '($1 is distinct from $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).isDistinctFrom(8).not',
      query: e(7).isDistinctFrom(8).not,
      text: 'not(($1 is distinct from $2))',
      args: [7, 8]
    })
  })
})
