const { sq, e, query } = require('../../tape')

describe('between', () => {
  describe('invalid', () => {
    query({
      name: 'e.between',
      query: e.between,
      error: true
    })
    query({
      name: 'e.between(1)',
      query: e.between(1),
      error: true
    })
    query({
      name: 'e.between(1, 2)',
      query: e.between(1, 2),
      error: true
    })
    query({
      name: 'e.between(1, 2, 3, 4)',
      query: e.between(1, 2, 3, 4),
      error: true
    })
    query({
      name: 'e.between(undefined)',
      query: e.between(undefined),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.between(null, null, null)',
      query: e.between(null, null, null),
      text: '($1 between $2 and $3)',
      args: [null, null, null]
    })
    query({
      name: 'e.between`moo``moo``moo`',
      query: e.between`moo``moo``moo`,
      text: '(moo between moo and moo)',
      args: []
    })
    query({
      name: 'e.between(sq.txt`moo`, sq.return`moo`, e`moo`)',
      query: e.between(sq.txt`moo`, sq.return`moo`, e`moo`),
      text: '(moo between (select moo) and moo)',
      args: []
    })
  })
  describe('valid', () => {
    query({
      name: 'e.between(7, 8, 9)',
      query: e.between(7, 8, 9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.between(7)(8)(9)',
      query: e.between(7)(8)(9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.between(7, 8)(9)',
      query: e.between(7, 8)(9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e.between(7)(8, 9)',
      query: e.between(7)(8, 9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).between(8, 9)',
      query: e(7).between(8, 9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).between(8)(9)',
      query: e(7).between(8)(9),
      text: '($1 between $2 and $3)',
      args: [7, 8, 9]
    })
    query({
      name: 'e(7).between(8, 9).not',
      query: e(7).between(8, 9).not,
      text: 'not(($1 between $2 and $3))',
      args: [7, 8, 9]
    })
  })
})
