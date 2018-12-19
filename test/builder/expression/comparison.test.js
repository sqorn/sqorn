const { sq, e, query } = require('../tape')

describe('comparison', () => {
  describe('eq', () => {
    describe('invalid', () => {
      query({
        name: 'e.eq',
        query: e.eq,
        error: true
      })
      query({
        name: 'e.eq(1)',
        query: e.eq(1),
        error: true
      })
      query({
        name: 'e.eq(1, 2, 3)',
        query: e.eq(1, 2, 3),
        error: true
      })
      query({
        name: 'e.eq(undefined)',
        query: e.eq(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.eq(null, null)',
        query: e.eq(null, null),
        text: '($1 = $2)',
        args: [null, null]
      })
      query({
        name: 'e.eq`moo``moo`',
        query: e.eq`moo``moo`,
        text: '(moo = moo)',
        args: []
      })
      query({
        name: 'e.eq(sq.txt`moo`, sq.return`moo`)',
        query: e.eq(sq.txt`moo`, sq.return`moo`),
        text: '(moo = (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.eq(7, 8)',
        query: e.eq(7, 8),
        text: '($1 = $2)',
        args: [7, 8]
      })
      query({
        name: 'e.eq(7)(8)',
        query: e.eq(7)(8),
        text: '($1 = $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).eq(8)',
        query: e(7).eq(8),
        text: '($1 = $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).eq(8).not',
        query: e(7).eq(8).not,
        text: 'not(($1 = $2))',
        args: [7, 8]
      })
    })
  })
  describe('neq', () => {
    describe('invalid', () => {
      query({
        name: 'e.neq',
        query: e.neq,
        error: true
      })
      query({
        name: 'e.neq(1)',
        query: e.neq(1),
        error: true
      })
      query({
        name: 'e.neq(1, 2, 3)',
        query: e.neq(1, 2, 3),
        error: true
      })
      query({
        name: 'e.neq(undefined)',
        query: e.neq(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.neq(null, null)',
        query: e.neq(null, null),
        text: '($1 <> $2)',
        args: [null, null]
      })
      query({
        name: 'e.neq`moo``moo`',
        query: e.neq`moo``moo`,
        text: '(moo <> moo)',
        args: []
      })
      query({
        name: 'e.neq(sq.txt`moo`, sq.return`moo`)',
        query: e.neq(sq.txt`moo`, sq.return`moo`),
        text: '(moo <> (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.neq(7, 8)',
        query: e.neq(7, 8),
        text: '($1 <> $2)',
        args: [7, 8]
      })
      query({
        name: 'e.neq(7)(8)',
        query: e.neq(7)(8),
        text: '($1 <> $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).neq(8)',
        query: e(7).neq(8),
        text: '($1 <> $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).neq(8).not',
        query: e(7).neq(8).not,
        text: 'not(($1 <> $2))',
        args: [7, 8]
      })
    })
  })
  describe('lt', () => {
    describe('invalid', () => {
      query({
        name: 'e.lt',
        query: e.lt,
        error: true
      })
      query({
        name: 'e.lt(1)',
        query: e.lt(1),
        error: true
      })
      query({
        name: 'e.lt(1, 2, 3)',
        query: e.lt(1, 2, 3),
        error: true
      })
      query({
        name: 'e.lt(undefined)',
        query: e.lt(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.lt(null, null)',
        query: e.lt(null, null),
        text: '($1 < $2)',
        args: [null, null]
      })
      query({
        name: 'e.lt`moo``moo`',
        query: e.lt`moo``moo`,
        text: '(moo < moo)',
        args: []
      })
      query({
        name: 'e.lt(sq.txt`moo`, sq.return`moo`)',
        query: e.lt(sq.txt`moo`, sq.return`moo`),
        text: '(moo < (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.lt(7, 8)',
        query: e.lt(7, 8),
        text: '($1 < $2)',
        args: [7, 8]
      })
      query({
        name: 'e.lt(7)(8)',
        query: e.lt(7)(8),
        text: '($1 < $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).lt(8)',
        query: e(7).lt(8),
        text: '($1 < $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).lt(8).not',
        query: e(7).lt(8).not,
        text: 'not(($1 < $2))',
        args: [7, 8]
      })
    })
  })
  describe('gt', () => {
    describe('invalid', () => {
      query({
        name: 'e.gt',
        query: e.gt,
        error: true
      })
      query({
        name: 'e.gt(1)',
        query: e.gt(1),
        error: true
      })
      query({
        name: 'e.gt(1, 2, 3)',
        query: e.gt(1, 2, 3),
        error: true
      })
      query({
        name: 'e.gt(undefined)',
        query: e.gt(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.gt(null, null)',
        query: e.gt(null, null),
        text: '($1 > $2)',
        args: [null, null]
      })
      query({
        name: 'e.gt`moo``moo`',
        query: e.gt`moo``moo`,
        text: '(moo > moo)',
        args: []
      })
      query({
        name: 'e.gt(sq.txt`moo`, sq.return`moo`)',
        query: e.gt(sq.txt`moo`, sq.return`moo`),
        text: '(moo > (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.gt(7, 8)',
        query: e.gt(7, 8),
        text: '($1 > $2)',
        args: [7, 8]
      })
      query({
        name: 'e.gt(7)(8)',
        query: e.gt(7)(8),
        text: '($1 > $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).gt(8)',
        query: e(7).gt(8),
        text: '($1 > $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).gt(8).not',
        query: e(7).gt(8).not,
        text: 'not(($1 > $2))',
        args: [7, 8]
      })
    })
  })
  describe('lte', () => {
    describe('invalid', () => {
      query({
        name: 'e.lte',
        query: e.lte,
        error: true
      })
      query({
        name: 'e.lte(1)',
        query: e.lte(1),
        error: true
      })
      query({
        name: 'e.lte(1, 2, 3)',
        query: e.lte(1, 2, 3),
        error: true
      })
      query({
        name: 'e.lte(undefined)',
        query: e.lte(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.lte(null, null)',
        query: e.lte(null, null),
        text: '($1 <= $2)',
        args: [null, null]
      })
      query({
        name: 'e.lte`moo``moo`',
        query: e.lte`moo``moo`,
        text: '(moo <= moo)',
        args: []
      })
      query({
        name: 'e.lte(sq.txt`moo`, sq.return`moo`)',
        query: e.lte(sq.txt`moo`, sq.return`moo`),
        text: '(moo <= (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.lte(7, 8)',
        query: e.lte(7, 8),
        text: '($1 <= $2)',
        args: [7, 8]
      })
      query({
        name: 'e.lte(7)(8)',
        query: e.lte(7)(8),
        text: '($1 <= $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).lte(8)',
        query: e(7).lte(8),
        text: '($1 <= $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).lte(8).not',
        query: e(7).lte(8).not,
        text: 'not(($1 <= $2))',
        args: [7, 8]
      })
    })
  })
  describe('gte', () => {
    describe('invalid', () => {
      query({
        name: 'e.gte',
        query: e.gte,
        error: true
      })
      query({
        name: 'e.gte(1)',
        query: e.gte(1),
        error: true
      })
      query({
        name: 'e.gte(1, 2, 3)',
        query: e.gte(1, 2, 3),
        error: true
      })
      query({
        name: 'e.gte(undefined)',
        query: e.gte(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.gte(null, null)',
        query: e.gte(null, null),
        text: '($1 >= $2)',
        args: [null, null]
      })
      query({
        name: 'e.gte`moo``moo`',
        query: e.gte`moo``moo`,
        text: '(moo >= moo)',
        args: []
      })
      query({
        name: 'e.gte(sq.txt`moo`, sq.return`moo`)',
        query: e.gte(sq.txt`moo`, sq.return`moo`),
        text: '(moo >= (select moo))',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.gte(7, 8)',
        query: e.gte(7, 8),
        text: '($1 >= $2)',
        args: [7, 8]
      })
      query({
        name: 'e.gte(7)(8)',
        query: e.gte(7)(8),
        text: '($1 >= $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).gte(8)',
        query: e(7).gte(8),
        text: '($1 >= $2)',
        args: [7, 8]
      })
      query({
        name: 'e(7).gte(8).not',
        query: e(7).gte(8).not,
        text: 'not(($1 >= $2))',
        args: [7, 8]
      })
    })
  })

  describe('between', () => {
    describe('invalid', () => {
      query({
        name: 'e.between',
        query: e.between,
        error: true
      })
      query({
        name: 'e.between(1)',
        query: e.between(1),
        error: true
      })
      query({
        name: 'e.between(1, 2)',
        query: e.between(1, 2),
        error: true
      })
      query({
        name: 'e.between(1, 2, 3, 4)',
        query: e.between(1, 2, 3, 4),
        error: true
      })
      query({
        name: 'e.between(undefined)',
        query: e.between(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.between(null, null, null)',
        query: e.between(null, null, null),
        text: '($1 between $2 and $3)',
        args: [null, null, null]
      })
      query({
        name: 'e.between`moo``moo``moo`',
        query: e.between`moo``moo``moo`,
        text: '(moo between moo and moo)',
        args: []
      })
      query({
        name: 'e.between(sq.txt`moo`, sq.return`moo`, e`moo`)',
        query: e.between(sq.txt`moo`, sq.return`moo`, e`moo`),
        text: '(moo between (select moo) and moo)',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.between(7, 8, 9)',
        query: e.between(7, 8, 9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.between(7)(8)(9)',
        query: e.between(7)(8)(9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.between(7, 8)(9)',
        query: e.between(7, 8)(9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.between(7)(8, 9)',
        query: e.between(7)(8, 9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).between(8, 9)',
        query: e(7).between(8, 9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).between(8)(9)',
        query: e(7).between(8)(9),
        text: '($1 between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).between(8, 9).not',
        query: e(7).between(8, 9).not,
        text: 'not(($1 between $2 and $3))',
        args: [7, 8, 9]
      })
    })
  })
  describe('not between', () => {
    describe('invalid', () => {
      query({
        name: 'e.notBetween',
        query: e.notBetween,
        error: true
      })
      query({
        name: 'e.notBetween(1)',
        query: e.notBetween(1),
        error: true
      })
      query({
        name: 'e.notBetween(1, 2)',
        query: e.notBetween(1, 2),
        error: true
      })
      query({
        name: 'e.notBetween(1, 2, 3, 4)',
        query: e.notBetween(1, 2, 3, 4),
        error: true
      })
      query({
        name: 'e.notBetween(undefined)',
        query: e.notBetween(undefined),
        error: true
      })
    })
    describe('unknown', () => {
      query({
        name: 'e.notBetween(null, null, null)',
        query: e.notBetween(null, null, null),
        text: '($1 not between $2 and $3)',
        args: [null, null, null]
      })
      query({
        name: 'e.notBetween`moo``moo``moo`',
        query: e.notBetween`moo``moo``moo`,
        text: '(moo not between moo and moo)',
        args: []
      })
      query({
        name: 'e.notBetween(sq.txt`moo`, sq.return`moo`, e`moo`)',
        query: e.notBetween(sq.txt`moo`, sq.return`moo`, e`moo`),
        text: '(moo not between (select moo) and moo)',
        args: []
      })
    })
    describe('valid', () => {
      query({
        name: 'e.notBetween(7, 8, 9)',
        query: e.notBetween(7, 8, 9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.notBetween(7)(8)(9)',
        query: e.notBetween(7)(8)(9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.notBetween(7, 8)(9)',
        query: e.notBetween(7, 8)(9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e.notBetween(7)(8, 9)',
        query: e.notBetween(7)(8, 9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).notBetween(8, 9)',
        query: e(7).notBetween(8, 9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).notBetween(8)(9)',
        query: e(7).notBetween(8)(9),
        text: '($1 not between $2 and $3)',
        args: [7, 8, 9]
      })
      query({
        name: 'e(7).notBetween(8, 9).not',
        query: e(7).notBetween(8, 9).not,
        text: 'not(($1 not between $2 and $3))',
        args: [7, 8, 9]
      })
    })
  })
})
