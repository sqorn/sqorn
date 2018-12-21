const { sq, e, query } = require('../../tape')

describe('eq', () => {
  describe('invalid', () => {
    query({
      name: 'e.eq',
      query: e.eq,
      error: true
    })
    query({
      name: 'e.eq(1)',
      query: e.eq(1),
      error: true
    })
    query({
      name: 'e.eq(1, 2, 3)',
      query: e.eq(1, 2, 3),
      error: true
    })
    query({
      name: 'e.eq(undefined)',
      query: e.eq(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.eq(null, null)',
      query: e.eq(null, null),
      text: '($1 = $2)',
      args: [null, null]
    })
    query({
      name: 'e.eq`moo``moo`',
      query: e.eq`moo``moo`,
      text: '(moo = moo)',
      args: []
    })
    query({
      name: 'e.eq(sq.txt`moo`, sq.return`moo`)',
      query: e.eq(sq.txt`moo`, sq.return`moo`),
      text: '(moo = (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.eq(7, 8)',
      query: e.eq(7, 8),
      text: '($1 = $2)',
      args: [7, 8]
    })
    query({
      name: 'e.eq(7)(8)',
      query: e.eq(7)(8),
      text: '($1 = $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).eq(8)',
      query: e(7).eq(8),
      text: '($1 = $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).eq(8).not',
      query: e(7).eq(8).not,
      text: 'not(($1 = $2))',
      args: [7, 8]
    })
  })
})
