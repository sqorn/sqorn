const { sq, e, query } = require('../tape')

describe('Value Operations', () => {
  describe('arg', () => {
    describe('error', () => {
      test('undefined', () => {
        expect(() => e(undefined).query).toThrowError()
      })
    })
    describe('unknown', () => {
      query({
        name: 'null',
        query: e(null),
        text: '$1',
        args: [null]
      })
      query({
        name: 'template tag',
        query: e`moo`,
        text: 'moo',
        args: []
      })
      query({
        name: 'fragment',
        query: e(sq.txt`moo`),
        text: 'moo',
        args: []
      })
      query({
        name: 'expr',
        query: e(e(null)),
        text: '$1',
        args: [null]
      })
    })
    describe('boolean', () => {
      query({
        name: 'true',
        query: e(true),
        text: '$1',
        args: [true]
      })
      query({
        name: 'false',
        query: e(false),
        text: '$1',
        args: [false]
      })
      query({
        name: 'expr',
        query: e(e(false)),
        text: '$1',
        args: [false]
      })
    })
    describe('number', () => {
      query({
        name: '0',
        query: e(0),
        text: '$1',
        args: [0]
      })
      query({
        name: '1',
        query: e(1),
        text: '$1',
        args: [1]
      })
      query({
        name: '-1',
        query: e(-1),
        text: '$1',
        args: [-1]
      })
      query({
        name: '30.578',
        query: e(30.578),
        text: '$1',
        args: [30.578]
      })
      query({
        name: 'Number.MAX_SAFE_INTEGER',
        query: e(Number.MAX_SAFE_INTEGER),
        text: '$1',
        args: [Number.MAX_SAFE_INTEGER]
      })
      query({
        name: 'Number.MIN_SAFE_INTEGER',
        query: e(Number.MIN_SAFE_INTEGER),
        text: '$1',
        args: [Number.MIN_SAFE_INTEGER]
      })
      query({
        name: 'Number.MAX_VALUE',
        query: e(Number.MAX_VALUE),
        text: '$1',
        args: [Number.MAX_VALUE]
      })
      query({
        name: 'Number.MIN_VALUE',
        query: e(Number.MIN_VALUE),
        text: '$1',
        args: [Number.MIN_VALUE]
      })
      query({
        name: 'NaN',
        query: e(NaN),
        text: '$1',
        args: [NaN]
      })
      query({
        name: 'expr',
        query: e(e(1)),
        text: '$1',
        args: [1]
      })
    })
    describe('string', () => {
      query({
        name: "'moo'",
        query: e('moo'),
        text: '$1',
        args: ['moo']
      })
      query({
        name: "''",
        query: e(''),
        text: '$1',
        args: ['']
      })
      query({
        name: "'\\''\\'''\n``'",
        query: e("\\''\\'''\n``"),
        text: '$1',
        args: ["\\''\\'''\n``"]
      })
      query({
        name: 'expr',
        query: e(e('moo')),
        text: '$1',
        args: ['moo']
      })
    })
    describe('array', () => {
      query({
        name: '[]',
        query: e([]),
        text: '$1',
        args: [[]]
      })
      query({
        name: '[true, false]',
        query: e([true, false]),
        text: '$1',
        args: [[true, false]]
      })
      query({
        name: '[1, 2, 3]',
        query: e([1, 2, 3]),
        text: '$1',
        args: [[1, 2, 3]]
      })
      query({
        name: "['moo']",
        query: e(['moo']),
        text: '$1',
        args: [['moo']]
      })
      query({
        name: 'expr',
        query: e(e([])),
        text: '$1',
        args: [[]]
      })
    })
    describe('json', () => {
      query({
        name: '{}',
        query: e({}),
        text: '$1',
        args: [{}]
      })
      query({
        name: '{ a: 1 }',
        query: e({ a: 1 }),
        text: '$1',
        args: [{ a: 1 }]
      })
      query({
        name: 'expr',
        query: e(e({})),
        text: '$1',
        args: [{}]
      })
    })
    describe('row', () => {
      query({
        name: 'e(1, 2)',
        query: e(1, 2),
        text: '($1, $2)',
        args: [1, 2]
      })
      query({
        name: 'e(1, 2, 3)',
        query: e(1, 2, 3),
        text: '($1, $2, $3)',
        args: [1, 2, 3]
      })
      query({
        name: 'e(1)(2)',
        query: e(e(1)(2)),
        text: '($1, $2)',
        args: [1, 2]
      })
      query({
        name: 'e(1)(2)(3)',
        query: e(e(1)(2)(3)),
        text: '($1, $2, $3)',
        args: [1, 2, 3]
      })
      query({
        name: 'e`a``b`',
        query: e(e`a``b`),
        text: '(a, b)',
        args: []
      })
      query({
        name: "e`${true}``${'moo'}`",
        query: e`${true}``${'moo'}`,
        text: '($1, $2)',
        args: [true, 'moo']
      })
      query({
        name: 'expr',
        query: e(e(1)(2)),
        text: '($1, $2)',
        args: [1, 2]
      })
    })
    describe('table', () => {
      query({
        name: 'query',
        query: e(sq.return`${1}`),
        text: '(select $1)',
        args: [1]
      })
      query({
        name: 'expr',
        query: e(e(sq.return`${1}`)),
        text: '(select $1)',
        args: [1]
      })
    })
  })

  describe('typed value', () => {
    describe('unknown', () => {
      query({
        name: 'null',
        query: e.unknown(null),
        text: '$1',
        args: [null]
      })
      query({
        name: 'template tag',
        query: e`moo`,
        text: 'moo',
        args: []
      })
      query({
        name: 'fragment',
        query: e.unknown(sq.txt`moo`),
        text: 'moo',
        args: []
      })
      query({
        name: 'expr',
        query: e.unknown(e.unknown(null)),
        text: '$1',
        args: [null]
      })
    })
    describe('boolean', () => {
      query({
        name: 'true',
        query: e.boolean(true),
        text: '$1',
        args: [true]
      })
      query({
        name: 'false',
        query: e.boolean(false),
        text: '$1',
        args: [false]
      })
      query({
        name: 'expr',
        query: e.boolean(e.boolean(false)),
        text: '$1',
        args: [false]
      })
    })
    describe('number', () => {
      query({
        name: '0',
        query: e.number(0),
        text: '$1',
        args: [0]
      })
      query({
        name: '1',
        query: e.number(1),
        text: '$1',
        args: [1]
      })
      query({
        name: '-1',
        query: e.number(-1),
        text: '$1',
        args: [-1]
      })
      query({
        name: '30.578',
        query: e.number(30.578),
        text: '$1',
        args: [30.578]
      })
      query({
        name: 'Number.MAX_SAFE_INTEGER',
        query: e.number(Number.MAX_SAFE_INTEGER),
        text: '$1',
        args: [Number.MAX_SAFE_INTEGER]
      })
      query({
        name: 'Number.MIN_SAFE_INTEGER',
        query: e.number(Number.MIN_SAFE_INTEGER),
        text: '$1',
        args: [Number.MIN_SAFE_INTEGER]
      })
      query({
        name: 'Number.MAX_VALUE',
        query: e.number(Number.MAX_VALUE),
        text: '$1',
        args: [Number.MAX_VALUE]
      })
      query({
        name: 'Number.MIN_VALUE',
        query: e.number(Number.MIN_VALUE),
        text: '$1',
        args: [Number.MIN_VALUE]
      })
      query({
        name: 'NaN',
        query: e.number(NaN),
        text: '$1',
        args: [NaN]
      })
      query({
        name: 'expr',
        query: e.number(e.number(1)),
        text: '$1',
        args: [1]
      })
    })
    describe('string', () => {
      query({
        name: "'moo'",
        query: e.string('moo'),
        text: '$1',
        args: ['moo']
      })
      query({
        name: "''",
        query: e.string(''),
        text: '$1',
        args: ['']
      })
      query({
        name: "'\\''\\'''\n``'",
        query: e.string("\\''\\'''\n``"),
        text: '$1',
        args: ["\\''\\'''\n``"]
      })
      query({
        name: 'expr',
        query: e.string(e.string('moo')),
        text: '$1',
        args: ['moo']
      })
    })
    describe('array', () => {
      query({
        name: '[]',
        query: e.array([]),
        text: '$1',
        args: [[]]
      })
      query({
        name: '[true, false]',
        query: e.array([true, false]),
        text: '$1',
        args: [[true, false]]
      })
      query({
        name: '[1, 2, 3]',
        query: e.array([1, 2, 3]),
        text: '$1',
        args: [[1, 2, 3]]
      })
      query({
        name: "['moo']",
        query: e.array(['moo']),
        text: '$1',
        args: [['moo']]
      })
      query({
        name: 'expr',
        query: e.array(e.array([])),
        text: '$1',
        args: [[]]
      })
    })
    describe('json', () => {
      query({
        name: '{}',
        query: e.json({}),
        text: '$1',
        args: [{}]
      })
      query({
        name: '{ a: 1 }',
        query: e.json({ a: 1 }),
        text: '$1',
        args: [{ a: 1 }]
      })
      query({
        name: 'expr',
        query: e.json(e.json({})),
        text: '$1',
        args: [{}]
      })
    })
    describe('row', () => {
      query({
        name: 'e.row(1, 2)',
        query: e.row(1, 2),
        text: '($1, $2)',
        args: [1, 2]
      })
      query({
        name: 'e.row(1, 2, 3)',
        query: e.row(1, 2, 3),
        text: '($1, $2, $3)',
        args: [1, 2, 3]
      })
      query({
        name: 'e.row(1)(2)',
        query: e.row(e.row(1)(2)),
        text: '($1, $2)',
        args: [1, 2]
      })
      query({
        name: 'e.row(1)(2)(3)',
        query: e.row(e.row(1)(2)(3)),
        text: '($1, $2, $3)',
        args: [1, 2, 3]
      })
      query({
        name: 'e`a``b`',
        query: e.row(e`a``b`),
        text: '(a, b)',
        args: []
      })
      query({
        name: "e`${true}``${'moo'}`",
        query: e`${true}``${'moo'}`,
        text: '($1, $2)',
        args: [true, 'moo']
      })
      query({
        name: 'expr',
        query: e.row(e.row(1)(2)),
        text: '($1, $2)',
        args: [1, 2]
      })
    })
    describe('table', () => {
      query({
        name: 'query',
        query: e.table(sq.return`${1}`),
        text: '(select $1)',
        args: [1]
      })
      query({
        name: 'expr',
        query: e.table(e.table(sq.return`${1}`)),
        text: '(select $1)',
        args: [1]
      })
    })
  })
})
