const { sq, e, query } = require('../../tape')

describe('or', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.or(),
      error: true
    })
    query({
      name: 'undefined',
      query: e.or(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.or(null),
      text: '$1',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.or`moo`,
      text: 'moo',
      args: []
    })
    query({
      name: 'fragment',
      query: e.or(sq.txt`moo`),
      text: 'moo',
      args: []
    })
    query({
      name: 'expr',
      query: e.or(e(null)),
      text: '$1',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.or(true)',
      query: e.or(true),
      text: '$1',
      args: [true]
    })
    query({
      name: 'e.or(false)',
      query: e.or(false),
      text: '$1',
      args: [false]
    })
    query({
      name: 'e.or(true, false)',
      query: e.or(true, false),
      text: '($1 or $2)',
      args: [true, false]
    })
    query({
      name: 'e.or(false, true, false)',
      query: e.or(false, true, false),
      text: '($1 or $2 or $3)',
      args: [false, true, false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e.or(true)(false)',
      query: e.or(true)(false),
      text: '($1 or $2)',
      args: [true, false]
    })
    query({
      name: 'e.or(false)(true)(false)',
      query: e.or(false)(true)(false),
      text: '($1 or $2 or $3)',
      args: [false, true, false]
    })
    query({
      name: 'e(true).or',
      query: e(true).or,
      text: '$1',
      args: [true]
    })
    query({
      name: 'e(true).or(false, true)(false)',
      query: e(true).or(false, true)(false),
      text: '($1 or $2 or $3 or $4)',
      args: [true, false, true, false]
    })
  })
})
