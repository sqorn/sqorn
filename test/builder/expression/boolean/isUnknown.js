const { sq, e, query } = require('../../tape')

describe('is unknown', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isUnknown,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isUnknown(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isUnknown(null),
      text: '($1 is unknown)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isUnknown`moo`,
      text: '(moo is unknown)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isUnknown(sq.txt`moo`),
      text: '(moo is unknown)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isUnknown(e(null)),
      text: '($1 is unknown)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isUnknown(true)',
      query: e.isUnknown(true),
      text: '($1 is unknown)',
      args: [true]
    })
    query({
      name: 'e.isUnknown(false)',
      query: e.isUnknown(false),
      text: '($1 is unknown)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isUnknown',
      query: e(true).isUnknown,
      text: '($1 is unknown)',
      args: [true]
    })
  })
})
