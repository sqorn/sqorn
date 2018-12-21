const { e, query } = require('../tape')

describe('expression', () => {
  describe('value', () => {
    query({
      name: 'e(null)',
      query: e(null),
      text: '$1',
      args: [null]
    })
    query({
      name: 'e',
      query: e('hi'),
      text: '$1',
      args: ['hi']
    })
    query({
      name: 'e(1)',
      query: e(1),
      text: '$1',
      args: [1]
    })
    query({
      name: 'e(true)',
      query: e(true),
      text: '$1',
      args: [true]
    })
    query({
      name: 'e(array)',
      query: e([1, 2, 3]),
      text: '$1',
      args: [[1, 2, 3]]
    })
    query({
      name: 'e(json)',
      query: e({ a: 1, b: 2 }),
      text: '$1',
      args: [{ a: 1, b: 2 }]
    })
  })
  describe('binary', () => {
    query({
      name: 'eq',
      query: e.eq('jo', 'bob'),
      text: '($1 = $2)',
      args: ['jo', 'bob']
    })
    query({
      name: 'neq',
      query: e.neq('jo', 'bob'),
      text: '($1 <> $2)',
      args: ['jo', 'bob']
    })
    query({
      name: 'lt',
      query: e.lt('jo', 'bob'),
      text: '($1 < $2)',
      args: ['jo', 'bob']
    })
  })
})
