const { sq, query } = require('../tape')
const { e } = sq

describe('expression', () => {
  describe('e', () => {
    query({
      name: 'e(undefined)',
      query: sq.l(e(undefined)),
      text: 'default',
      args: []
    })
    query({
      name: 'e(null)',
      query: sq.l(e(null)),
      text: '$1',
      args: [null]
    })
    query({
      name: 'e',
      query: sq.l(e('hi')),
      text: '$1',
      args: []
    })
    query({
      name: 'e(1)',
      query: sq.l(e(1)),
      text: '$1',
      args: [1]
    })
    query({
      name: 'e(true)',
      query: sq.l(e(true)),
      text: '$1',
      args: [true]
    })
    query({
      name: 'e(array)',
      query: sq.l(e([1, 2, 3])),
      text: '$1',
      args: [[1, 2, 3]]
    })
    query({
      name: 'e(json)',
      query: sq.l(e({ a: 1, b: 2 })),
      text: '$1',
      args: [{ a: 1, b: 2 }]
    })
  })
  describe('binary', () => {
    query({
      name: 'eq',
      query: sq.l(e.eq('name', 'bob')),
      text: 'name = $1',
      args: ['bob']
    })
  })
})
