const { sq, e, query } = require('../../tape')

describe('is null', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isNull,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isNull(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isNull(null),
      text: '($1 is null)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isNull`moo`,
      text: '(moo is null)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isNull(sq.txt`moo`),
      text: '(moo is null)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isNull(e(null)),
      text: '($1 is null)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isNull(true)',
      query: e.isNull(true),
      text: '($1 is null)',
      args: [true]
    })
    query({
      name: 'e.isNull(false)',
      query: e.isNull(false),
      text: '($1 is null)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isNull',
      query: e(true).isNull,
      text: '($1 is null)',
      args: [true]
    })
  })
})
