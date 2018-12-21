const { sq, e, query } = require('../../tape')

describe('neq', () => {
  describe('invalid', () => {
    query({
      name: 'e.neq',
      query: e.neq,
      error: true
    })
    query({
      name: 'e.neq(1)',
      query: e.neq(1),
      error: true
    })
    query({
      name: 'e.neq(1, 2, 3)',
      query: e.neq(1, 2, 3),
      error: true
    })
    query({
      name: 'e.neq(undefined)',
      query: e.neq(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.neq(null, null)',
      query: e.neq(null, null),
      text: '($1 <> $2)',
      args: [null, null]
    })
    query({
      name: 'e.neq`moo``moo`',
      query: e.neq`moo``moo`,
      text: '(moo <> moo)',
      args: []
    })
    query({
      name: 'e.neq(sq.txt`moo`, sq.return`moo`)',
      query: e.neq(sq.txt`moo`, sq.return`moo`),
      text: '(moo <> (select moo))',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.neq(7, 8)',
      query: e.neq(7, 8),
      text: '($1 <> $2)',
      args: [7, 8]
    })
    query({
      name: 'e.neq(7)(8)',
      query: e.neq(7)(8),
      text: '($1 <> $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).neq(8)',
      query: e(7).neq(8),
      text: '($1 <> $2)',
      args: [7, 8]
    })
    query({
      name: 'e(7).neq(8).not',
      query: e(7).neq(8).not,
      text: 'not(($1 <> $2))',
      args: [7, 8]
    })
  })
})
