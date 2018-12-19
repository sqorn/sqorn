const { sq, e, query } = require('../../tape')

describe('not', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.not,
      error: true
    })
    query({
      name: 'undefined',
      query: e.not(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.not(null),
      text: 'not($1)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.not`moo`,
      text: 'not(moo)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.not(sq.txt`moo`),
      text: 'not(moo)',
      args: []
    })
    query({
      name: 'expr',
      query: e.not(e(null)),
      text: 'not($1)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.not(true)',
      query: e.not(true),
      text: 'not($1)',
      args: [true]
    })
    query({
      name: 'e.not(false)',
      query: e.not(false),
      text: 'not($1)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).not',
      query: e(true).not,
      text: 'not($1)',
      args: [true]
    })
  })
})
