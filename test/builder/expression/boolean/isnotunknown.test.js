const { sq, e, query } = require('../../tape')

describe('is not unknown', () => {
  describe('invalid args', () => {
    query({
      name: 'min 1 arg',
      query: e.isNotUnknown,
      error: true
    })
    query({
      name: 'undefined',
      query: e.isNotUnknown(undefined),
      error: true
    })
  })
  describe('unknown args', () => {
    query({
      name: 'null',
      query: e.isNotUnknown(null),
      text: '($1 is not unknown)',
      args: [null]
    })
    query({
      name: 'template string',
      query: e.isNotUnknown`moo`,
      text: '(moo is not unknown)',
      args: []
    })
    query({
      name: 'fragment',
      query: e.isNotUnknown(sq.txt`moo`),
      text: '(moo is not unknown)',
      args: []
    })
    query({
      name: 'expr',
      query: e.isNotUnknown(e(null)),
      text: '($1 is not unknown)',
      args: [null]
    })
  })
  describe('valid args', () => {
    query({
      name: 'e.isNotUnknown(true)',
      query: e.isNotUnknown(true),
      text: '($1 is not unknown)',
      args: [true]
    })
    query({
      name: 'e.isNotUnknown(false)',
      query: e.isNotUnknown(false),
      text: '($1 is not unknown)',
      args: [false]
    })
  })
  describe('curried', () => {
    query({
      name: 'e(true).isNotUnknown',
      query: e(true).isNotUnknown,
      text: '($1 is not unknown)',
      args: [true]
    })
  })
})
