const { sq, e, query } = require('../../tape')

describe('in', () => {
  describe('invalid', () => {
    query({
      name: 'e.in',
      query: e.in,
      error: true
    })
    query({
      name: 'e.in(1)',
      query: e.in(1),
      error: true
    })
    query({
      name: 'e.in(1, 2, 3)',
      query: e.in(1, 2, 3),
      error: true
    })
    query({
      name: 'e.in(undefined, [1])',
      query: e.in(undefined, [1]),
      error: true
    })
    query({
      name: 'e.in(true, [])',
      query: e.in(true, []),
      error: true
    })
  })
  describe('unknown', () => {
    query({
      name: 'e.in(null, null)',
      query: e.in(null, null),
      text: '($1 in $2)',
      args: [null, null]
    })
    query({
      name: 'e.in`moo``moo`',
      query: e.in`moo``moo`,
      text: '(moo in moo)',
      args: []
    })
    query({
      name: 'e.in(sq.txt`moo`, sq.return`moo`)',
      query: e.in(sq.txt`moo`, sq.return`moo`),
      text: '(moo in (select moo))',
      args: []
    })
    query({
      name: 'e.in(sq.return`moo`, sq.txt`moo`)',
      query: e.in(sq.return`moo`, sq.txt`moo`),
      text: '((select moo) in moo)',
      args: []
    })
  })
  describe('table', () => {
    query({
      name: "e.in('hi', sq.return(e('hi')))",
      query: e.in('hi', sq.return(e('hi'))),
      text: '($1 in (select $2))',
      args: ['hi', 'hi']
    })
    query({
      name: "e.in('hi', sq.return(e('hi')))",
      query: e`moo`.in(sq.sql`select 'moo'`),
      text: "(moo in (select 'moo'))",
      args: []
    })
  })
  describe('values list', () => {
    query({
      name: 'e.in(true, [true])',
      query: e.in(true, [true]),
      text: '($1 in ($2))',
      args: [true, true]
    })
    query({
      name: `e.in('moo', ['moo'])`,
      query: e.in('moo', ['moo', 'shoo']),
      text: '($1 in ($2, $3))',
      args: ['moo', 'moo', 'shoo']
    })
    query({
      name: 'e.in(7, [4, 5, 6])',
      query: e.in(7, [4, 5, 6]),
      text: '($1 in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e.in(7)([4, 5, 6])',
      query: e.in(7)([4, 5, 6]),
      text: '($1 in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e(7).in([4, 5, 6])',
      query: e(7).in([4, 5, 6]),
      text: '($1 in ($2, $3, $4))',
      args: [7, 4, 5, 6]
    })
    query({
      name: 'e(7).in([4, 5, 6]).not',
      query: e(7).in([4, 5, 6]).not,
      text: 'not(($1 in ($2, $3, $4)))',
      args: [7, 4, 5, 6]
    })
  })
})
