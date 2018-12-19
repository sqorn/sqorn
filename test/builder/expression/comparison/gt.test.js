const { sq, e, query } = require('../../tape')

describe('gt', () => {
  describe('invalid', () => {
    query({
      name: 'e.gt',
      query: e.gt,
      error: true
    })
    query({
      name: 'e.gt(1)',
      query: e.gt(1),
      error: true
    })
    query({
      name: 'e.gt(1, 2, 3)',
      query: e.gt(1, 2, 3),
      error: true
    })
    query({
      name: 'e.gt(undefined)',
      query: e.gt(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.gt(null, null)',
      query: e.gt(null, null),
      text: '($1 > $2)',
      args: [null, null]
    })
    query({
      name: 'e.gt`moo``moo`',
      query: e.gt`moo``moo`,
      text: '(moo > moo)',
      args: []
    })
    query({
      name: 'e.gt(sq.txt`moo`, sq.return`moo`)',
      query: e.gt(sq.txt`moo`, sq.return`moo`),
      text: '(moo > (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.gt(7, 8)',
      query: e.gt(7, 8),
      text: '($1 > $2)',
      args: [7, 8]
    })
    query({
      name: 'e.gt(7)(8)',
      query: e.gt(7)(8),
      text: '($1 > $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).gt(8)',
      query: e(7).gt(8),
      text: '($1 > $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).gt(8).not',
      query: e(7).gt(8).not,
      text: 'not(($1 > $2))',
      args: [7, 8]
    })
  })
})
