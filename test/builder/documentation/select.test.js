const { sq, e, query } = require('../tape')

describe('from', () => {
  query({
    name: 'template tag',
    query: sq.from`book`,
    text: 'select * from book',
    args: []
  })
  query({
    name: 'multiple calls',
    query: sq.from`book`.from`person`,
    text: 'select * from book, person',
    args: []
  })
  query({
    name: 'string',
    query: sq.from('book', 'author'),
    text: 'select * from book, author',
    args: []
  })
  query({
    name: 'expression',
    query: sq.from(e.unnest([3, 2, 1])),
    text: 'select * from unnest($1)',
    args: [[3, 2, 1]]
  })
  query({
    name: 'fragment',
    query: sq.from(sq.txt`unnest(array[1, 2, 3])`),
    text: 'select * from unnest(array[1, 2, 3])',
    args: []
  })
  query({
    name: 'alias',
    query: sq.from({ b: 'book', p: 'person' }),
    text: 'select * from book b, person p',
    args: []
  })
  query({
    name: 'expression',
    query: sq.from({ countDown: e.unnest([3, 2, 1]) }),
    text: 'select * from unnest($1) count_down',
    args: [[3, 2, 1]]
  })
  query({
    name: 'fragment',
    query: sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }),
    text: 'select * from unnest($1) count_down',
    args: [[3, 2, 1]]
  })
  query({
    name: 'subquery',
    query: sq.from({ a: sq.sql`select * from author`, b: sq.from`book` }),
    text: 'select * from (select * from author) a, (select * from book) b',
    args: []
  })
  query({
    name: 'array',
    query: sq.from({
      people: [{ age: 7, firstName: 'Jo' }, { age: 9, firstName: 'Mo' }]
    }),
    text: 'select * from (values ($1, $2), ($3, $4)) people(age, first_name)',
    args: [7, 'Jo', 9, 'Mo']
  })
  query({
    name: 'manual join',
    query: sq.from`book left join author on book.author_id = author.id`,
    text: 'select * from book left join author on book.author_id = author.id',
    args: []
  })
})

describe('where', () => {
  query({
    name: 'template tag',
    query: sq.from`book`.where`genre = ${'Fantasy'}`,
    text: 'select * from book where (genre = $1)',
    args: ['Fantasy']
  })
  query({
    name: 'multiple calls',
    query: sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`,
    text: 'select * from book where (genre = $1) and (year = $2)',
    args: ['Fantasy', 2000]
  })
  query({
    name: 'expression',
    query: sq.from`book`.where(e`year`.gt(2010).or(e`year`.lt(2018))),
    text: 'select * from book where ((year > $1) or (year < $2))',
    args: [2010, 2018]
  })
  query({
    name: 'fragment',
    query: sq.from`book`.where(sq.txt`genre = ${'Fantasy'}`),
    text: 'select * from book where genre = $1',
    args: ['Fantasy']
  })
  query({
    name: 'subquery',
    query: sq.from`book`.where(sq.sql`select true`),
    text: 'select * from book where (select true)',
    args: []
  })
  query({
    name: 'object',
    query: sq.from`book`.where({ genre: 'Fantasy', year: 2000 }),
    text: 'select * from book where (genre = $1) and (year = $2)',
    args: ['Fantasy', 2000]
  })
  query({
    name: 'object expression',
    query: sq.from`person`.where({ age: e.add(10, 20) }),
    text: 'select * from person where (age = ($1 + $2))',
    args: [10, 20]
  })
  query({
    name: 'object fragment',
    query: sq.from`person`.where({ age: sq.txt`20` }),
    text: 'select * from person where (age = 20)',
    args: []
  })
  query({
    name: 'object subquery',
    query: sq.from`test`.where({ moo: sq.sql`select true` }),
    text: 'select * from test where (moo = (select true))',
    args: []
  })
  query({
    name: 'object raw',
    query: sq.from('book', 'author').where({ 'book.id': sq.raw('author.id') }),
    text: 'select * from book, author where (book.id = author.id)',
    args: []
  })
  query({
    name: 'object null',
    query: sq.from`book`.where({ author: null }),
    text: 'select * from book where (author is null)',
    args: []
  })
  query({
    name: 'object undefined',
    query: sq.from`oops`.where({ field: undefined }),
    error: true
  })
  query({
    name: 'object array',
    query: sq.from`book`.where({ id: [7, 8, 9] }),
    text: 'select * from book where (id in ($1, $2, $3))',
    args: [7, 8, 9]
  })
  query({
    name: 'object camel case to snake case',
    query: sq.from('person').where({ firstName: 'Kaladin' }),
    text: 'select * from person where (first_name = $1)',
    args: ['Kaladin']
  })
  query({
    name: 'multiple args',
    query: sq.from('person').where({ name: 'Rob' }, sq.txt`(name = ${'Bob'})`),
    text: 'select * from person where (name = $1) and (name = $2)',
    args: ['Rob', 'Bob']
  })
  query({
    name: 'complex expression',
    query: sq
      .from('person')
      .where(
        e.and(
          e.eq`first_name`('Mohammed'),
          e.eq`last_name`('Ali'),
          e.gt`age`(30).not
        )
      ),
    text:
      'select * from person where ((first_name = $1) and (last_name = $2) and not((age > $3)))',
    args: ['Mohammed', 'Ali', 30]
  })
})

describe('select', () => {
  query({
    name: 'template tag',
    query: sq.return`${1} a, ${2} b, ${1} + ${2} sum`,
    text: 'select $1 a, $2 b, $3 + $4 sum',
    args: [1, 2, 1, 2]
  })
  query({
    name: 'multiple calls',
    query: sq.from`book`.return`title, author`.return`id`,
    text: 'select title, author, id from book',
    args: []
  })
  query({
    name: 'string',
    query: sq.from('book').return('title', 'author'),
    text: 'select title, author from book',
    args: []
  })
  query({
    name: 'fragment',
    query: sq.return(sq.txt('moo'), sq.txt`now()`),
    text: 'select $1, now()',
    args: ['moo']
  })
  query({
    name: 'subquery',
    query: sq.return(sq.sql`select now()`, sq.return(e(8))),
    text: 'select (select now()), (select $1)',
    args: [8]
  })
  query({
    name: 'expression',
    query: sq.return(e`genre`.eq('fantasy')).from('book'),
    text: 'select (genre = $1) from book',
    args: ['fantasy']
  })
  query({
    name: 'object',
    query: sq.return({ name: 'person.name', age: 'person.age' }).from('person'),
    text: 'select person.name name, person.age age from person',
    args: []
  })
  query({
    name: 'object expression',
    query: sq.return({ hello: e('world'), sum: e.add(1, 2) }),
    text: 'select $1 hello, ($2 + $3) sum',
    args: ['world', 1, 2]
  })
  query({
    name: 'object fragment',
    query: sq.return({ sum: sq.txt`${2} + ${3}`, firstName: sq.txt('Bob') }),
    text: 'select $1 + $2 sum, $3 first_name',
    args: [2, 3, 'Bob']
  })
  query({
    name: 'object subquery',
    query: sq.return({
      time: sq.sql`select now()`,
      eight: sq.return(e(8))
    }),
    text: 'select (select now()) time, (select $1) eight',
    args: [8]
  })
})

describe('distinct', () => {
  query({
    name: 'one call',
    query: sq.from('book').return('genre', 'author').distinct,
    text: 'select distinct genre, author from book',
    args: []
  })
  query({
    name: 'multiple calls',
    query: sq.from('book').return('genre', 'author').distinct.distinct,
    text: 'select distinct genre, author from book',
    args: []
  })
})
describe('distinct on', () => {
  query({
    name: 'template tag',
    query: sq.from`weather`.return`location, time, report`.distinctOn`location`,
    text: 'select distinct on (location) location, time, report from weather',
    args: []
  })
  query({
    name: 'multiple calls',
    query: sq.from`weather`.return`location, time, report`.distinctOn`location`
      .distinctOn`time`,
    text:
      'select distinct on (location, time) location, time, report from weather',
    args: []
  })
  query({
    name: 'string',
    query: sq
      .from('weather')
      .return('location', 'time', 'report')
      .distinctOn('location', 'time'),
    text:
      'select distinct on (location, time) location, time, report from weather',
    args: []
  })
  query({
    name: 'expression',
    query: sq.return`n`
      .distinctOn(e`n`.mod`2`)
      .from({ n: e.unnest([1, 2, 3, 4, 5]) }),
    text: 'select distinct on ((n % 2)) n from unnest($1) n',
    args: [[1, 2, 3, 4, 5]]
  })
  query({
    name: 'fragment',
    query: sq
      .from('generate_series(0, 10) n')
      .return('n')
      .distinctOn(sq.txt`n / 3`),
    text: 'select distinct on (n / 3) n from generate_series(0, 10) n',
    args: []
  })
  query({
    name: 'subquery',
    query: sq
      .from('generate_series(0, 10) n')
      .return('n')
      .distinctOn(sq.return`n / 3`),
    text: 'select distinct on ((select n / 3)) n from generate_series(0, 10) n',
    args: []
  })
})

describe('extend', () => {
  {
    const FantasyBook = sq.from('book').where({ genre: 'fantasy' })
    const Title = sq.return('title')
    query({
      name: 'extend',
      query: sq.extend(FantasyBook, Title),
      text: 'select title from book where (genre = $1)',
      args: ['fantasy']
    })
  }
  query({
    name: 'chain',
    query: sq
      .from('book')
      .extend(sq.where({ genre: 'fantasy' }))
      .return('title'),
    text: 'select title from book where (genre = $1)',
    args: ['fantasy']
  })
})

describe('group by', () => {
  query({
    name: 'template tag',
    query: sq.from`person`.groupBy`age`.return`age, count(*)`,
    text: 'select age, count(*) from person group by age',
    args: []
  })
  query({
    name: 'multiple calls',
    query: sq.from`person`.groupBy`age`.groupBy`last_name`
      .return`age, last_name, count(*)`,
    text: 'select age, last_name, count(*) from person group by age, last_name',
    args: []
  })
  query({
    name: 'string',
    query: sq
      .from('person')
      .groupBy('age', 'last_name')
      .return('age', 'last_name', 'count(*)'),
    text: 'select age, last_name, count(*) from person group by age, last_name',
    args: []
  })
  query({
    name: 'expression',
    query: sq
      .from(sq.txt`generate_series(${1}, ${10}) n`)
      .groupBy(e.mod`n`(2))
      .return(e.mod`n`(2), 'sum(n)'),
    text:
      'select (n % $1), sum(n) from generate_series($2, $3) n group by (n % $4)',
    args: [2, 1, 10, 2]
  })
  query({
    name: 'fragment',
    query: sq
      .from('book')
      .groupBy(sq.txt`genre`)
      .return('count(*)'),
    text: 'select count(*) from book group by genre',
    args: []
  })
  query({
    name: 'subquery',
    query: sq
      .from('book')
      .groupBy(sq.return`genre = 'Fantasy'`)
      .return('count(*)'),
    text: "select count(*) from book group by (select genre = 'Fantasy')",
    args: []
  })
  query({
    name: 'array paren',
    query: sq
      .from('person')
      .groupBy('age', [[sq.txt`last_name`], 'first_name'])
      .return('count(*)'),
    text: 'select count(*) from person group by age, ((last_name), first_name)',
    args: []
  })
  query({
    name: 'rollup',
    query: sq.from('t').groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd')),
    text: 'select * from t group by rollup (a, (b, c), d)',
    args: []
  })
  query({
    name: 'cube',
    query: sq.from('t').groupBy(sq.cube('a', ['b', sq.txt`c`], 'd')),
    text: 'select * from t group by cube (a, (b, c), d)',
    args: []
  })
  query({
    name: 'grouping sets',
    query: sq
      .from('t')
      .groupBy(
        sq.groupingSets(['a', 'b', 'c'], sq.groupingSets(['a', 'b']), ['a'], [])
      ),
    text:
      'select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), ())',
    args: []
  })
})

describe('having', () => {
  query({
    name: 'template tag',
    query: sq.from`person`.groupBy`age`.having`age < ${20}`,
    text: 'select * from person group by age having (age < $1)',
    args: [20]
  })
  query({
    name: 'multiple calls',
    query: sq.from`person`.groupBy`age`.having`age >= ${20}`
      .having`age < ${30}`,
    text: 'select * from person group by age having (age >= $1) and (age < $2)',
    args: [20, 30]
  })
  query({
    name: 'expression',
    query: sq
      .from('book')
      .groupBy('genre')
      .having(e.or(e.gt`count(*)`(10), e.lte`count(*)`(100)))
      .return('genre', 'count(*)'),
    text:
      'select genre, count(*) from book group by genre having ((count(*) > $1) or (count(*) <= $2))',
    args: [10, 100]
  })
})

describe('order by', () => {
  query({
    name: 'template tag',
    query: sq.from`book`.orderBy`title asc nulls last`,
    text: 'select * from book order by title asc nulls last',
    args: []
  })
  query({
    name: 'multiple calls',
    query: sq.from`book`.orderBy`title`.orderBy`year`,
    text: 'select * from book order by title, year',
    args: []
  })
  query({
    name: 'string',
    query: sq.from`book`.orderBy`title`.orderBy`year`,
    text: 'select * from book order by title, year',
    args: []
  })
  query({
    name: 'expression',
    query: sq.from('book').orderBy(e`sales`.div(1000), 'title'),
    text: 'select * from book order by (sales / $1), title',
    args: [1000]
  })
  query({
    name: 'fragment',
    query: sq.from('book').orderBy(sq.txt`sales / ${1000}`, 'title'),
    text: 'select * from book order by sales / $1, title',
    args: [1000]
  })
  query({
    name: 'subquery',
    query: sq.from('book').orderBy(sq.return`sales / ${1000}`, 'title'),
    text: 'select * from book order by (select sales / $1), title',
    args: [1000]
  })
  query({
    name: 'object',
    query: sq.from('book').orderBy({ by: e`sales`.div(1000) }, { by: 'title' }),
    text: 'select * from book order by (sales / $1), title',
    args: [1000]
  })
  query({
    name: 'object sort',
    query: sq.from('book').orderBy({ by: 'title', sort: 'desc' }),
    text: 'select * from book order by title desc',
    args: []
  })
  query({
    name: 'object using',
    query: sq.from`person`.orderBy({ by: 'first_name', using: '~<~' }),
    text: 'select * from person order by first_name using ~<~',
    args: []
  })
  query({
    name: 'object nulls',
    query: sq.from('book').orderBy({ by: 'title', nulls: 'last' }),
    text: 'select * from book order by title nulls last',
    args: []
  })
})

describe('limit', () => {
  query({
    name: 'number',
    query: sq.from('person').limit(8),
    text: 'select * from person limit $1',
    args: [8]
  })
  query({
    name: 'multiple calls',
    query: sq
      .from('person')
      .limit(7)
      .limit(5),
    text: 'select * from person limit $1',
    args: [5]
  })
  query({
    name: 'template tag',
    query: sq.from`person`.limit`1 + 7`,
    text: 'select * from person limit 1 + 7',
    args: []
  })
  query({
    name: 'number expression',
    query: sq.from('person').limit(e(1).add(7)),
    text: 'select * from person limit ($1 + $2)',
    args: [1, 7]
  })
  query({
    name: 'fragment',
    query: sq.from('person').limit(sq.txt`1 + 7`),
    text: 'select * from person limit 1 + 7',
    args: []
  })
  query({
    name: 'subquery',
    query: sq.from('person').limit(sq.return`1 + 7`),
    text: 'select * from person limit (select 1 + 7)',
    args: []
  })
})

describe('offset', () => {
  query({
    name: 'number',
    query: sq.from('person').offset(8),
    text: 'select * from person offset $1',
    args: [8]
  })
  query({
    name: 'multiple calls',
    query: sq
      .from('person')
      .offset(7)
      .offset(5),
    text: 'select * from person offset $1',
    args: [5]
  })
  query({
    name: 'template tag',
    query: sq.from`person`.offset`1 + 7`,
    text: 'select * from person offset 1 + 7',
    args: []
  })
  query({
    name: 'number expression',
    query: sq.from('person').offset(e(1).add(7)),
    text: 'select * from person offset ($1 + $2)',
    args: [1, 7]
  })
  query({
    name: 'fragment',
    query: sq.from('person').offset(sq.txt`1 + 7`),
    text: 'select * from person offset 1 + 7',
    args: []
  })
  query({
    name: 'subquery',
    query: sq.from('person').offset(sq.return`1 + 7`),
    text: 'select * from person offset (select 1 + 7)',
    args: []
  })
})

describe('join', () => {
  query({
    name: 'joins',
    query: sq.from`book`.join`author`.on`book.author_id = author.id`,
    text: 'select * from book join author on (book.author_id = author.id)',
    args: []
  })
  query({
    name: 'natural joins',
    query: sq.from`book`.naturalRightJoin`author`,
    text: 'select * from book natural right join author',
    args: []
  })
  query({
    name: 'cross join',
    query: sq.from`book`.crossJoin`author`,
    text: 'select * from book cross join author',
    args: []
  })
  query({
    name: 'natural joins',
    query: sq
      .from({ b: 'book' })
      .naturalFullJoin({ a: 'author' })
      .naturalRightJoin('publisher'),
    text:
      'select * from book b natural full join author a natural right join publisher',
    args: []
  })
})

describe('join on', () => {
  query({
    name: 'object',
    query: sq
      .from({ b: 'book' })
      .join({ a: 'author' })
      .on({ 'b.author_id': sq.raw('a.id') }),
    text: 'select * from book b join author a on (b.author_id = a.id)',
    args: []
  })
  query({
    name: 'expression',
    query: sq
      .from({ t: 'ticket' })
      .leftJoin({ p: 'person' })
      .on(
        e.or(e.eq`p.first_name``t.first_name`, e.eq`p.last_name``t.last_name`)
      ),
    text:
      'select * from ticket t left join person p on ((p.first_name = t.first_name) or (p.last_name = t.last_name))',
    args: []
  })
})

describe('join using', () => {
  query({
    name: 'template tag',
    query: sq.from`book`.join`author`.using`author_id`,
    text: 'select * from book join author using (author_id)',
    args: []
  })
  query({
    name: 'strings',
    query: sq
      .from('a')
      .join('b')
      .using('x', 'y', 'z'),
    text: 'select * from a join b using (x, y, z)',
    args: []
  })
})

describe('set operators', () => {
  const Person = sq.from`person`
  const Young = Person.where`age < 30`
  const Middle = Person.where`age >= 30 and age < 60`
  const Old = Person.where`age >= 60`
  query({
    name: 'one arg',
    query: Person.except(Young),
    text: 'select * from person except (select * from person where (age < 30))',
    args: []
  })
  query({
    name: 'multiple args',
    query: Young.union(Middle, Old),
    text:
      'select * from person where (age < 30) union (select * from person where (age >= 30 and age < 60)) union (select * from person where (age >= 60))',
    args: []
  })
  query({
    name: 'all',
    query: Young.unionAll(Old),
    text:
      'select * from person where (age < 30) union all (select * from person where (age >= 60))',
    args: []
  })
  query({
    name: 'multiple calls',
    query: Person.except(Young).intersect(Person.except(Old)),
    text:
      'select * from person except (select * from person where (age < 30)) intersect (select * from person except (select * from person where (age >= 60)))',
    args: []
  })
})

describe('with', () => {
  query({
    name: 'template tag',
    query: sq.with`n (select ${20} age)`.from`n`.return`age`,
    text: 'with n (select $1 age) select age from n',
    args: [20]
  })
  query({
    name: 'multiple calls',
    query: sq.with`width (select ${10} n)`.with`height (select ${20} n)`
      .return`width.n * height.n area`,
    text:
      'with width (select $1 n), height (select $2 n) select width.n * height.n area',
    args: [10, 20]
  })
  query({
    name: 'subquery',
    query: sq
      .with({
        width: sq.return({ n: 10 }),
        height: sq.sql`select ${20} n`
      })
      .return({ area: sq.txt`width.n * height.n` }),
    text:
      'with width (select $1 n), height (select $2 n) select width.n * height.n area',
    args: [10, 20]
  })
  const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
  query({
    name: 'array',
    query: sq.with({ people }).return`max(age)`.from`people`,
    text:
      'with people(age, name) (values ($1, $2), ($3, $4)) select max(age) from people',
    args: [7, 'Jo', 9, 'Mo']
  })
  const one = sq.return`1`
  const next = sq.return`n + 1`.from`t`.where`n < 100`
  query({
    name: 'recursive',
    query: sq
      .withRecursive({ 't(n)': one.unionAll(next) })
      .from('t')
      .return('sum(n)'),
    text:
      'with recursive t(n) (select 1 union all (select n + 1 from t where (n < 100))) select sum(n) from t',
    args: []
  })
})
