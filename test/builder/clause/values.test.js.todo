const { sq, query } = require('../tape')

describe('values', () => {
  describe('template string', () => {
    query({
      name: 'one',
      query: sq.values`(1, 2), (3, 4)`,
      text: 'values (1, 2), (3, 4)'
    })
    query({
      name: 'multiple',
      query: sq.values`(1, 2)`.values`(3, 4)`.values`(5, 6)`,
      text: 'values (1, 2), (3, 4), (5, 6)'
    })
    query({
      name: 'args',
      query: sq.values`(${1}, ${2}), (${3}, ${4})`,
      text: 'values ($1, $2), ($3, $4)',
      args: [1, 2, 3, 4]
    })
  })
  describe('array args', () => {
    query({
      name: 'one array',
      query: sq.values([1, 2]),
      text: 'values ($1, $2)',
      args: [1, 2]
    })
    query({
      name: 'arrays',
      query: sq.values([1, 2], [3, 4]),
      text: 'values (1, 2), (3, 4)',
      args: [1, 2, 3, 4]
    })
    query({
      name: 'three arrays',
      query: sq
        .values([1])
        .values([2])
        .values([3]),
      text: 'values (1), (2), (3)'
    })
    query({
      name: 'length mistmatch',
      query: sq
        .values([1])
        .values([2])
        .values([3]),
      text: 'values (1), (2), (3)'
    })
    query({
      name: 'undefined values',
      query: sq
        .values([1])
        .values([2])
        .values([3]),
      text: 'values (1), (2), (3)'
    })
    query({
      name: 'null values',
      query: sq
        .values([1])
        .values([2])
        .values([3]),
      text: 'values (1), (2), (3)'
    })
  })
  describe('set operators', () => {
    query({
      name: 'union',
      query: sq.values([1, 2]).union(sq.values([5, 6])),
      text: 'select 7'
    })
  })
})
