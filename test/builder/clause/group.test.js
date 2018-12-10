const { sq, query } = require('../tape')

describe('Group By', () => {
  describe('template string', () => {
    query({
      name: 'simple',
      query: sq.from`person`.group`age`,
      text: 'select * from person group by age',
      args: []
    })
    query({
      name: 'two calls',
      query: sq.from`person`.group`age`.group`last_name`,
      text: 'select * from person group by age, last_name',
      args: []
    })
    query({
      name: 'three calls',
      query: sq.from`person`.group`age`.group`last_name`.group`first_name`,
      text: 'select * from person group by age, last_name, first_name',
      args: []
    })
  })
  describe('expression', () => {
    query({
      name: 'string',
      query: sq.from`person`.group('age'),
      text: 'select * from person group by age',
      args: []
    })
    query({
      name: '3 strings',
      query: sq.from`person`.group('age', 'last_name', 'first_name'),
      text: 'select * from person group by age, last_name, first_name',
      args: []
    })
    query({
      name: 'subquery',
      query: sq.from`person`.group(sq.txt`age`),
      text: 'select * from person group by age',
      args: []
    })
    query({
      name: 'multiple subqueries',
      query: sq.from`person`.group(
        sq.txt`age`,
        sq.txt`last_name`,
        sq.txt`first_name`
      ),
      text: 'select * from person group by age, last_name, first_name',
      args: []
    })
    query({
      name: 'mixed strings and subqueries',
      query: sq.from`person`.group(
        sq.txt`age`,
        'last_name',
        sq.txt`first_name`
      ),
      text: 'select * from person group by age, last_name, first_name',
      args: []
    })
    query({
      name: 'array',
      query: sq.from`person`.group([], ['age'], ['last_name', 'first_name']),
      text: 'select * from person group by (), (age), (last_name, first_name)',
      args: []
    })
  })
  describe('postgres rollup', () => {
    const { rollup } = sq
    query({
      name: 'rollup one arg',
      query: sq.from`person`.group(rollup('age')),
      text: 'select * from person group by rollup (age)',
      args: []
    })
    query({
      name: 'rollup three args',
      query: sq.from`person`.group(rollup('age', 'last_name', 'first_name')),
      text: 'select * from person group by rollup (age, last_name, first_name)',
      args: []
    })
    query({
      name: 'expressions and rollup args',
      query: sq.from`person`.group('age', rollup('last_name'), 'first_name'),
      text: 'select * from person group by age, rollup (last_name), first_name',
      args: []
    })
    query({
      name: 'rollup array arg',
      query: sq.from`person`.group(
        rollup([], ['age'], ['last_name', 'first_name'])
      ),
      text:
        'select * from person group by rollup ((), (age), (last_name, first_name))',
      args: []
    })
  })
  describe('postgres cube', () => {
    const { cube } = sq
    query({
      name: 'cube one arg',
      query: sq.from`person`.group(cube('age')),
      text: 'select * from person group by cube (age)',
      args: []
    })
    query({
      name: 'cube three args',
      query: sq.from`person`.group(cube('age', 'last_name', 'first_name')),
      text: 'select * from person group by cube (age, last_name, first_name)',
      args: []
    })
    query({
      name: 'expressions and cube args',
      query: sq.from`person`.group('age', cube('last_name'), 'first_name'),
      text: 'select * from person group by age, cube (last_name), first_name',
      args: []
    })
    query({
      name: 'cube array arg',
      query: sq.from`person`.group(
        cube([], ['age'], ['last_name', 'first_name'])
      ),
      text:
        'select * from person group by cube ((), (age), (last_name, first_name))',
      args: []
    })
  })

  describe('postgres grouping sets', () => {
    const { groupingSets } = sq
    query({
      name: 'groupingSets one arg',
      query: sq.from`person`.group(groupingSets('age')),
      text: 'select * from person group by grouping sets (age)',
      args: []
    })
    query({
      name: 'groupingSets three args',
      query: sq.from`person`.group(
        groupingSets('age', 'last_name', 'first_name')
      ),
      text:
        'select * from person group by grouping sets (age, last_name, first_name)',
      args: []
    })
    query({
      name: 'expressions and groupingSets args',
      query: sq.from`person`.group(
        'age',
        groupingSets('last_name'),
        'first_name'
      ),
      text:
        'select * from person group by age, grouping sets (last_name), first_name',
      args: []
    })
    query({
      name: 'groupingSets array arg',
      query: sq.from`person`.group(
        groupingSets([], ['age'], ['last_name', 'first_name'])
      ),
      text:
        'select * from person group by grouping sets ((), (age), (last_name, first_name))',
      args: []
    })
    query({
      name: 'groupingSets of groupingSets',
      query: sq.from`person`.group(
        groupingSets(
          groupingSets([]),
          groupingSets(['age']),
          groupingSets(['last_name', 'first_name'])
        )
      ),
      text:
        'select * from person group by grouping sets (grouping sets (()), grouping sets ((age)), grouping sets ((last_name, first_name)))',
      args: []
    })
  })
  describe('complex', () => {
    query({
      name: 'multiple mixed calls',
      query: sq.from`person`.group(sq.txt`age`).group`last_name`.group(
        sq.txt`first_name`
      ),
      text: 'select * from person group by age, last_name, first_name',
      args: []
    })
  })
})
