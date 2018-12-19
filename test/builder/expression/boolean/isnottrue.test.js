const { sq, e, query } = require('../../tape')

describe('is not true', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isNotTrue,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isNotTrue(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isNotTrue(null),
      text: '($1 is not true)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isNotTrue`moo`,
      text: '(moo is not true)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isNotTrue(sq.txt`moo`),
      text: '(moo is not true)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isNotTrue(e(null)),
      text: '($1 is not true)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isNotTrue(true)',
      query: e.isNotTrue(true),
      text: '($1 is not true)',
      args: [true]
    })
    query({
      name: 'e.isNotTrue(false)',
      query: e.isNotTrue(false),
      text: '($1 is not true)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isNotTrue',
      query: e(true).isNotTrue,
      text: '($1 is not true)',
      args: [true]
    })
  })
})
