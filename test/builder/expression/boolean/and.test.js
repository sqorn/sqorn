const { sq, e, query } = require('../../tape')

describe('and', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.and(),
      error: true
    })
    query({
      name: 'undefined',
      query: e.and(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.and(null),
      text: '$1',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.and`moo`,
      text: 'moo',
      args: []
    })
    query({
      name: 'fragment',
      query: e.and(sq.txt`moo`),
      text: 'moo',
      args: []
    })
    query({
      name: 'expr',
      query: e.and(e(null)),
      text: '$1',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.and(true)',
      query: e.and(true),
      text: '$1',
      args: [true]
    })
    query({
      name: 'e.and(false)',
      query: e.and(false),
      text: '$1',
      args: [false]
    })
    query({
      name: 'e.and(true, false)',
      query: e.and(true, false),
      text: '($1 and $2)',
      args: [true, false]
    })
    query({
      name: 'e.and(false, true, false)',
      query: e.and(false, true, false),
      text: '($1 and $2 and $3)',
      args: [false, true, false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e.and(true)(false)',
      query: e.and(true)(false),
      text: '($1 and $2)',
      args: [true, false]
    })
    query({
      name: 'e.and(false)(true)(false)',
      query: e.and(false)(true)(false),
      text: '($1 and $2 and $3)',
      args: [false, true, false]
    })
    query({
      name: 'e(true).and',
      query: e(true).and,
      text: '$1',
      args: [true]
    })
    query({
      name: 'e(true).and(false, true)(false)',
      query: e(true).and(false, true)(false),
      text: '($1 and $2 and $3 and $4)',
      args: [true, false, true, false]
    })
  })
})
