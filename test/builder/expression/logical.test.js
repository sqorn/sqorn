const { sq, e, query } = require('../tape')

describe('logical', () => {
  describe('and', () => {
    describe('invalid args', () => {
      query({
        name: 'min 1 arg',
        query: e.and(),
        error: true
      })
      query({
        name: 'undefined',
        query: e.and(undefined),
        error: true
      })
    })
    describe('unknown args', () => {
      query({
        name: 'null',
        query: e.and(null),
        text: '$1',
        args: [null]
      })
      query({
        name: 'template string',
        query: e.and`moo`,
        text: 'moo',
        args: []
      })
      query({
        name: 'fragment',
        query: e.and(sq.txt`moo`),
        text: 'moo',
        args: []
      })
      query({
        name: 'expr',
        query: e.and(e(null)),
        text: '$1',
        args: [null]
      })
    })
    describe('valid args', () => {
      query({
        name: 'e.and(true)',
        query: e.and(true),
        text: '$1',
        args: [true]
      })
      query({
        name: 'e.and(false)',
        query: e.and(false),
        text: '$1',
        args: [false]
      })
      query({
        name: 'e.and(true, false)',
        query: e.and(true, false),
        text: '($1 and $2)',
        args: [true, false]
      })
      query({
        name: 'e.and(false, true, false)',
        query: e.and(false, true, false),
        text: '($1 and $2 and $3)',
        args: [false, true, false]
      })
    })
    describe('curried', () => {
      query({
        name: 'e.and(true)(false)',
        query: e.and(true)(false),
        text: '($1 and $2)',
        args: [true, false]
      })
      query({
        name: 'e.and(false)(true)(false)',
        query: e.and(false)(true)(false),
        text: '($1 and $2 and $3)',
        args: [false, true, false]
      })
      query({
        name: 'e(true).and',
        query: e(true).and,
        text: '$1',
        args: [true]
      })
      query({
        name: 'e(true).and(false, true)(false)',
        query: e(true).and(false, true)(false),
        text: '($1 and $2 and $3 and $4)',
        args: [true, false, true, false]
      })
    })
  })
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
})
