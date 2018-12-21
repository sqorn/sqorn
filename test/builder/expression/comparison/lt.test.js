const { sq, e, query } = require('../../tape')

describe('lt', () => {
  describe('invalid', () => {
    query({
      name: 'e.lt',
      query: e.lt,
      error: true
    })
    query({
      name: 'e.lt(1)',
      query: e.lt(1),
      error: true
    })
    query({
      name: 'e.lt(1, 2, 3)',
      query: e.lt(1, 2, 3),
      error: true
    })
    query({
      name: 'e.lt(undefined)',
      query: e.lt(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.lt(null, null)',
      query: e.lt(null, null),
      text: '($1 < $2)',
      args: [null, null]
    })
    query({
      name: 'e.lt`moo``moo`',
      query: e.lt`moo``moo`,
      text: '(moo < moo)',
      args: []
    })
    query({
      name: 'e.lt(sq.txt`moo`, sq.return`moo`)',
      query: e.lt(sq.txt`moo`, sq.return`moo`),
      text: '(moo < (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.lt(7, 8)',
      query: e.lt(7, 8),
      text: '($1 < $2)',
      args: [7, 8]
    })
    query({
      name: 'e.lt(7)(8)',
      query: e.lt(7)(8),
      text: '($1 < $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).lt(8)',
      query: e(7).lt(8),
      text: '($1 < $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).lt(8).not',
      query: e(7).lt(8).not,
      text: 'not(($1 < $2))',
      args: [7, 8]
    })
  })
})
