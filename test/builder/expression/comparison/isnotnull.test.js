const { sq, e, query } = require('../../tape')

describe('is not null', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isNotNull,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isNotNull(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isNotNull(null),
      text: '($1 is not null)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isNotNull`moo`,
      text: '(moo is not null)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isNotNull(sq.txt`moo`),
      text: '(moo is not null)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isNotNull(e(null)),
      text: '($1 is not null)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isNotNull(true)',
      query: e.isNotNull(true),
      text: '($1 is not null)',
      args: [true]
    })
    query({
      name: 'e.isNotNull(false)',
      query: e.isNotNull(false),
      text: '($1 is not null)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isNotNull',
      query: e(true).isNotNull,
      text: '($1 is not null)',
      args: [true]
    })
  })
})
