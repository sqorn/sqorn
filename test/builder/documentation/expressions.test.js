const { sq, e, query } = require('../tape')

describe('expressions', () => {
  query({
    name: 'simple',
    query: e.add(3, 4),
    text: '($1 + $2)',
    args: [3, 4]
  })
  query({
    name: '.arg',
    query: e.arg('meow'),
    text: '$1',
    args: ['meow']
  })
  query({
    name: 'e',
    query: e('meow'),
    text: '$1',
    args: ['meow']
  })
  query({
    name: 'e',
    query: e(e(23)),
    text: '$1',
    args: [23]
  })
  query({
    name: 'immutable composable',
    query: e.and(e.or(e.lt(3, 4), e.gt(5, 6)), e.neq(7, 8)),
    text: '((($1 < $2) or ($3 > $4)) and ($5 <> $6))',
    args: [3, 4, 5, 6, 7, 8]
  })
  query({
    name: 'curry',
    query: e.add(3)(4),
    text: '($1 + $2)',
    args: [3, 4]
  })
  query({
    name: 'tagged template',
    query: e.eq`lucky_number`(8),
    text: '(lucky_number = $1)',
    args: [8]
  })
  query({
    name: 'chained first operand',
    query: e(3)
      .add(4)
      .eq(7)
      .and(true),
    text: '((($1 + $2) = $3) and $4)',
    args: [3, 4, 7, true]
  })
  query({
    name: 'row value',
    query: e.arg(8, true)`meow`,
    text: '($1, $2, meow)',
    args: [8, true]
  })
  query({
    name: 'fragment',
    query: e(sq.txt`2`, sq.return`3`),
    text: '(2, (select 3))',
    args: []
  })
  query({
    name: 'undefined',
    query: e.arg(undefined),
    error: true
  })
  query({
    name: 'null',
    query: e.arg(null),
    text: '$1',
    args: [null]
  })
  test('unparameterized', () => {
    expect(e.eq`genre`('fantasy').unparameterized).toBe("(genre = 'fantasy')")
  })
  query({
    name: 'build queries',
    query: sq
      .return(e.add`n`(7))
      .from({ n: e.unnest([2, 3, 4, 5]) })
      .where(e`n`.mod(2).eq(0)),
    text: 'select (n + $1) from unnest($2) n where ((n % $3) = $4)',
    args: [7, [2, 3, 4, 5], 2, 0]
  })
})
