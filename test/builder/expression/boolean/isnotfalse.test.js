const { sq, e, query } = require('../../tape')

describe('is not false', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isNotFalse,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isNotFalse(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isNotFalse(null),
      text: '($1 is not false)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isNotFalse`moo`,
      text: '(moo is not false)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isNotFalse(sq.txt`moo`),
      text: '(moo is not false)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isNotFalse(e(null)),
      text: '($1 is not false)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isNotFalse(true)',
      query: e.isNotFalse(true),
      text: '($1 is not false)',
      args: [true]
    })
    query({
      name: 'e.isNotFalse(false)',
      query: e.isNotFalse(false),
      text: '($1 is not false)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isNotFalse',
      query: e(true).isNotFalse,
      text: '($1 is not false)',
      args: [true]
    })
  })
})
