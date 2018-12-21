const { sq, e, query } = require('../../tape')

describe('is true', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isTrue,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isTrue(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isTrue(null),
      text: '($1 is true)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isTrue`moo`,
      text: '(moo is true)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isTrue(sq.txt`moo`),
      text: '(moo is true)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isTrue(e(null)),
      text: '($1 is true)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isTrue(true)',
      query: e.isTrue(true),
      text: '($1 is true)',
      args: [true]
    })
    query({
      name: 'e.isTrue(false)',
      query: e.isTrue(false),
      text: '($1 is true)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isTrue',
      query: e(true).isTrue,
      text: '($1 is true)',
      args: [true]
    })
  })
})
