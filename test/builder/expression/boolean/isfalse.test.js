const { sq, e, query } = require('../../tape')

describe('is false', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isFalse,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isFalse(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isFalse(null),
      text: '($1 is false)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isFalse`moo`,
      text: '(moo is false)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isFalse(sq.txt`moo`),
      text: '(moo is false)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isFalse(e(null)),
      text: '($1 is false)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isFalse(true)',
      query: e.isFalse(true),
      text: '($1 is false)',
      args: [true]
    })
    query({
      name: 'e.isFalse(false)',
      query: e.isFalse(false),
      text: '($1 is false)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isFalse',
      query: e(true).isFalse,
      text: '($1 is false)',
      args: [true]
    })
  })
})
