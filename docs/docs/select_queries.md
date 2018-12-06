---
id: select-queries
title: Select Queries
sidebar_label: Select Queries
---

* **With** [`.with`](#with), [`.recursive`](#recursive-ctes)
* **Select** [`.return`](#select), [`.distinct`](#distinct), [`.distinctOn`](#distinct-on)
* **From** [`.from`](#from), [`.join`](#joins), [`.left`](#join-type), [`.right`](#join-type), [`.full`](#join-type), [`.cross`](#join-type), [`.inner`](#join-type), [`.using`](#using), [`.on`](#on), [`.and`](#and-or), [`.or`](#and-or).
* **Where** [`.where`](#where), [`.and`](#and-or), [`.or`](#and-or)
* **Group By** [`.group`](#group-by), [`.rollup`](#rollup), [`.cube`](#cube), [`.groupingSets`](#grouping-sets)
* **Having** [`.having`](#having), [`.and`](#and-or), [`.or`](#and-or)
* **Sets** [`.union`](#union-intersect-except), [`.intersect`](#union-intersect-except), [`.except`](#union-intersect-except), [`.unionAll`](#union-all-intersect-all-except-all), [`.intersectAll`](#union-all-intersect-all-except-all), [`.exceptAll`](#union-all-intersect-all-except-all)
* **Order By** [`.order`](#order-by)
* **Limit** [`.limit`](#limit)
* **Offset** [`.offset`](#offset)


## From

`.from` builds *from* clauses.

```js
sq.from`book`.query

{ text: 'select * from book',
  args: [] }
```

Multiple `.from` calls are joined with `', '`.

```js
sq.from`book`.from`person`.query

{ text: 'select * from book, person',
  args: [] }
```

`.from` accepts strings.

**To prevent SQL injection, never source *strings* from user input.**

```js
sq.from('book', 'author').query

{ text: 'select * from book, author',
  args: [] }
```

`.from` accepts fragments.

```js
// Postgres-only query
sq.from(sq.txt`unnest(array[1, 2, 3])`).query

{ text: 'select * from unnest(array[1, 2, 3])',
  args: [] }
```

### Table Objects

Pass `.from` objects in the form `{ alias: table }` to construct *`table as alias`* clauses.

Tables can be strings.

**To prevent SQL injection, never source *strings* from user input.**

```js
sq.from({ b: 'book', p: 'person' }).query

{ text: 'select * from book as b, person as p',
  args: [] }
```

Tables can be fragments.

```js
// a Postgres-only query
sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }).query

{ text: 'select * from unnest($1) as count_down',
  args: [[3, 2, 1]] }
```

Tables can be subqueries.

```js
sq.from({ a: sq.sql`select * from author`, b: sq.from`book` }).query

{ text: 'select * from (select * from author) as a, (select * from book) as b',
  args: [] }
```

Tables can be arrays of values. Column names are inferred from all keys.

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from({
  people: [{ age: 7, firstName: 'Jo' }, { age: 9, firstName: 'Mo' }]
}).query

{ text: 'select * from (values ($1, $2), ($3, $4)) as people(age, first_name)',
  args: [7, 'Jo', 9, 'Mo'] }
```

Construct join tables manually or learn about [building joins](#join).

```js
sq.from`book left join author on book.author_id = author.id`.query

{ text: 'select * from book left join author on book.author_id = author.id',
  args: [] }
```

## Where

Filter result rows by adding a *where* clause with `.where`.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.query

{ text: 'select * from book where (genre = $1)',
  args: ['Fantasy'] }
```

Multiple `.where` calls are joined with *`and`*. Calls are parenthesized.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`.query

{ text: 'select * from book where (genre = $1) and (year = $2)',
  args: ['Fantasy', 2000] }
```

### And, Or

Chain `.and` and `.or` after `.where`.

```js
sq.from`person`.where`name = ${'Rob'}`.or`name = ${'Bob'}`.and`age = ${7}`.query

{ text: 'select * from person where (name = $1) or (name = $2) and (age = $3)',
  args: ['Rob', 'Bob', 7]}
```

`.where`, `.and`, and `.or` accept conditions.

Conditions can be fragments.

```js
sq.from`book`.where(sq.txt`genre = ${'Fantasy'}`).query

{ text: 'select * from book where (genre = $12)',
  args: ['Fantasy'] }
```

Conditions can be subqueries.

```js
sq.from`book`.where(sq.sql`select true`).query

{ text: 'select * from book where (select true)',
  args: [] }
```

TODO: Conditions can be [expressions](#expressions).

```js
sq.from`book`.where(e.gt`year`(2010)).query

{ text: 'select * from book where (year > $1)',
  args: [2010] }
```

### Condition Objects

Conditions can be objects in the form `{ field: value }`.

Each property generates a `field = value` clause.

```js
sq.from`book`.where({ genre: 'Fantasy', year: 2000 }).query

{ text: 'select * from book where ((genre = $1) and (year = $2))',
  args: ['Fantasy', 2000] }
```

`undefined` values are invalid.

```js
sq.from`oops`.where({ field: undefined }).query

// throws error
```

`null` values generate a `field is null` clause.

```js
sq.from`book`.where({ author: null }).query

{ text: 'select * from book where (author is null)',
  args: [] }
```

Fields of fragment values are ignored.

```js
const min = sq.txt`year >= ${20}`
const max = sq.txt`year < ${30}`
sq.from`person`.where({ min, max }).query

{ text: 'select * from person where ((year >= $1) and (year < $2))',
  args: [20, 30] }
```

Fields of subquery values are ignored.

```js
sq.from`test`.where({ t: sq.sql`select true`, f: sq.sql`select false` }).query

{ text: 'select * from test where ((select true) and (select false))',
  args: [] }
```

TODO: Fields of expression values are ignored.

```js
sq.from`book`.where({ old: e.lt`year`(1900) }).query

{ text: 'select * from test where (year < $1)',
  args: [1900] }
```

Call `sq.raw` to prevent parameterization.

```js
sq.from('book', 'author').where({ 'book.id': sq.raw('author.id') }).query

{ text: 'select * from book, author where (book.id = author.id)',
  args: [] }
```

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from('person').where({ firstName: 'Kaladin' }).query

{ text: 'select * from person where (first_name = $1)',
  args: ['Kaladin'] }
```

Multiple arguments passed to `.where` are joined with `or`.

```js
sq.from('person').where({ name: 'Rob' }, sq.txt`name = ${'Bob'}`).query

{ text: 'select * from person where ((name = $1) or (name = $2))',
  args: ['Rob', 'Bob'] }
```

TODO: Conditions in an array are joined with `and`.

```js
sq.from('person').where([sq.txt`true`, sq.txt`true`], sq.txt`false`).query

{ text: 'select * from person where ((true) and (true)) or (false)',
  args: ['Rob', 'Bob'] }
```

TODO: Use [expressions](#expressions) to build complex conditions with `.e.and`, `.e.or`, and `.e.not`.

```js
sq.from('person').where(
  sq.e.and(
    sq.e.eq`first_name`('Mohammed'),
    sq.e.eq`last_name`('Ali'),
    sq.e.not(sq.e.gt`age`(30))
  )
).query

{ 'select * from person where ((first_name = $1) and (last_name = $2) and (not (age > $3))',
  args: ['Mohammed', 'Ali', 30] }
```

## Select

`.return` builds a select clause.

```js
sq.return`${1} as a, ${2} as b, ${1} + ${2} as sum`.query

{ text: 'select $1 as a, $2 as b, $3 + $4 as sum',
  args: [1, 2, 1, 2] }
```

Multiple `.return` calls are joined with `', '`.

```js
sq.from`book`.return`title, author`.return`id`.query

{ text: 'select title, author, id from book',
  args: [] }
```

`.return` accepts strings.

**To prevent SQL injection, never source strings from user input.**

```js
sq.from('book').return('title', 'author').query

{ text: 'select title, author from book',
  args: [] }
```

`.return` accepts fragments

```js
sq.return(sq.txt('moo'), sq.txt`now()`).query

{ text: 'select $1, now()',
  args: ['moo'] }
```

`.return` accepts subqueries.

```js
sq.from('book').return(sq.sql`select now()`, sq.return(sq.txt(8)).query

{ text: 'select (select now()), (select $1)',
  args: [8] }
```

TODO: `.return` accepts [expressions](#expressions).

```js
sq.return(sq.e.eq`genre`('fantasy')).from('book').query

{ text: 'select (genre = $1) from book',
  args: ['fantasy'] }
```

### Return Objects

`.return` accepts objects in the form `{ alias: value }`. Each property generates a `value as alias` clause.

Values can be strings.

**To prevent SQL injection, never source strings from user input.**

```js
sq.return({ name: 'person.name' , age: 'person.age' }).from('person').query

{ text: 'select person.name as name, person.age as age from person',
  args: [] }
```

Values can be fragments.

```js
sq.return({ sum: sq.txt`${2} + ${3}`, firstName: sq.txt('Bob') }).query

{ text: 'select $1 + $2 as sum, $3 as first_name',
  args: [2, 3, 'Bob'] }
```

Values can be subqueries.

```js
sq.return({
  time: sq.sql`select now()`,
  eight: sq.return(sq.txt(8))
}).query

{ text: 'select (select now()) as time, (select $1) as eight',
  args: [8] }
```

TODO: Values can be [expressions](#expressions).

```js
sq.return({ hello: sq.e('world'), sum: sq.e.plus(1, 2) }).query

{ text: 'select $1 as hello, ($2 + $3) as sum',
  args: ['world', 1, 2] }
```

## Distinct

Call `.distinct` to get only one row for each group of duplicates.

```js
sq.from('book').return('genre', 'author').distinct.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

`.distinct` is idempotent.

```js
sq.from('book').return('genre', 'author').distinct.distinct.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

### Distinct On

**Postgres only:** Call `.distinctOn` to get only the first rows distinct on the given columns.

```js
sq.from`weather`
  .return`location, time, report`
  .distinctOn`location`
  .query

{ text: 'select distinct on (location) location, time, report from weather',
  args: [] }
```

`.distinctOn` can be called multiple times.

```js
sq.from`weather`
  .return`location, time, report`
  .distinctOn`location`
  .distinctOn`time`
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.distinctOn` accepts columns.

TODO: Columns can be strings.

**To prevent SQL injection, never source strings from user input.**

```js
sq.from('weather')
  .return('location', 'time', 'report')
  .distinctOn('location', 'time')
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

TODO: Columns can be fragments.

```js
sq.from('generate_series(0, 10) as n')
  .return('n')
  .distinctOn(sq.txt`n / 3`)
  .query

{ text: 'select distinct on (n / 3) n from generate_series(0, 10) as n',
  args: [] }
```

TODO: Columns can be subqueries.

```js
sq.from('generate_series(0, 10) as n')
  .return('n')
  .distinctOn(sq.return`n / 3`)
  .query

{ text: 'select distinct on ((select n / 3)) n from generate_series(0, 10) as n',
  args: [] }
```

TODO: Columns can be [expressions](#expressions).

```js
sq.from('generate_series(0, 10) as n')
  .return('n')
  .distinctOn(sq.divide`n``3`)
  .query

{ text: 'select distinct on ((n / 3)) n from generate_series(0, 10) as n',
  args: [] }
```

## Express

The first, second, and third calls of `sq` are equivalent to calling `.from`, `.where`, and `.return` respectively.

The following are three sets of equivalent queries:

```js
sq`person`
sq('person')
sq.from`person`

sq`person``name = ${'Jo'}`
sq`person`({ name: 'Jo' })
sq.from`person`.where`name = ${'Jo'}`

sq`person``name = ${'Jo'}``age`
sq.from`person`.where`name = ${'Jo'}`.return`age`
sq.from('person').where({ name: 'Jo' }).return('age')
```

## Extend

`.extend` lets you construct new queries by extending existing queries.

```js
const FantasyBook = sq.from('book').where({ genre: 'fantasy' })
const Title = sq.return('title')

sq.extend(FantasyBook, Title).query

{ text: 'select title from book where (genre = $1)',
  args: ['fantasy'] }
```

`.extend` can be called in the middle of a query chain.

```js
sq.from('book').extend(sq.where({ genre: 'fantasy' })).return('title').query

{ text: 'select title from book where (genre = $1)',
  args: ['fantasy'] }
```

Every query chain has its own *Express* state.

```js
sq`author`.extend(
  sq`book``book.author_id = author.id``title`,
  sq`publisher``publisher.id = book.publisher_id``publisher`
)`author.id = 7``first_name`.query

{ text: 'select title, publisher, first_name from author, book, publisher where (book.author_id = author.id) and (publisher.id = book.publisher_id) and (author.id = 7)',
  args: [] }
```

## Group By

`.group` builds *group by* clauses.

```js
sq.from`person`
  .group`age`
  .return`age, count(*)`
  .query

{ text: 'select age, count(*) from person group by age',
  args: [] }
```

Multiple `.group` calls are joined with `', '`.

```js
sq.from`person`
  .group`age`.group`last_name`
  .return`age, last_name, count(*)`
  .query

{ text: 'select age, last_name, count(*) from person group by age, last_name',
  args: [] }
```

`.group` accepts strings.

```js
sq.from('person')
  .group('age', 'last_name')
  .return('age', 'last_name', 'count(*)')
  .query

{ text: 'select age, last_name, count(*) from person group by age, last_name',
  args: [] }
```

TODO: `.group` accepts fragments.

```js
sq.from('book')
  .group(sq.txt`genre`)
  .return('count(*)')
  .query

{ text: 'select count(*) from book group by genre',
  args: [] }
```

TODO: `.group` accepts subqueries.

```js
sq.from('book')
  .group(sq.return`genre = 'Fantasy'`)
  .return('count(*)')
  .query

{ text: "select count(*) from book group by (select genre = 'Fantasy')",
  args: [] }
```

TODO: `.group` accepts [expressions](#expressions).

```js
sq.from(sq.txt`generate_series(${1}, ${10}) as n`)
  .group(sq.e.mod`n`(2))
  .return(sq.e.mod`n`(2), 'sum(n)')
  .query

{ text: "select n % $1, sum(n) from generate_series($2, $3) as n group by (n % $4);",
  args: [2, 1, 10, 2] }
```

Parenthesize arguments by wrapping them in arrays. Arrays can be nested.

```js
sq.from('person')
  .group('age', [[sq.sql`last_name`], 'first_name'])
  .return('count(*)')
  .query

{ text: 'select count(*) from person group by age, ((last_name), first_name)',
  args: [] }
```

### Rollup

**Postgres Only:** `.group` accepts *rollup* arguments. `.rollup` accepts the same arguments as `.group` except *rollup*, *cube*, or *grouping sets* arguments.

```js
sq.from('t').group(sq.rollup('a', ['b', sq.txt`c`], 'd')).query

// postgres
{ text: 'select * from t group by rollup (a, (b, c)), d',
  args: [] }
```

### Cube

**Postgres Only:** `.group` accepts *cube* arguments. `.cube` accepts the same arguments as `.rollup`.

```js
sq.from('t').group(sq.cube('a', ['b', sq.txt`c`], 'd')).query

// postgres
{ text: 'select * from t group by cube (a, (b, c)), d',
  args: [] }
```

### Grouping Sets

**Postgres Only:** `.group` accepts *grouping sets* arguments. `.groupingSets` accepts the same arguments as `.group`.

```js
sq.from('t').group(sq.groupingSets(['a', 'b', 'c'], sq.groupingSets(['a', 'b']), ['a'], [])).query

// postgres
{ text: 'select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), ())',
  args: [] }
```

## Having

Filter groups with `.having`. `.having` accepts the same arguments as [`.where`](#where).

```js
sq.from`person`.group`age`.having`age < ${20}`.query

{ text: 'select * from person group by age having (age < $1',
  args: [20] }
```

`.having` can be called multiple times.

```js
sq.from`person`.group`age`.having`age >= ${20}`.having`age < ${30}`.query

{ text: 'select * from person group by age having (age >= $1) and (age < $2)',
  args: [20, 30] }
```

Chain `.and` and `.or` after `.having`.

```js
sq.from('person')
  .group('age')
  .having({ age: 18, c: sq.txt`age < ${19}` })
  .or({ age: 20 })
  .and(sq.txt`count(*) > 10`)
  .query

{ text: 'select * from person group by age having (age = $1 and age < $2) or (age = $3) and (count(*) > 10)',
  args: [18, 19, 20] }
```

TODO: Build complex *having* conditions with [expressions](#expressions).

```js
sq.from('book')
  .group('genre')
  .having(sq.e.or(
    sq.e.gt`count(*)`(10),
    sq.e.lte`count(*)`(100)
  ))
  .return('genre', 'count(*)')
  .query

{ text: 'select genre, count(*) from book group by genre having (((count(*) > $1) or (count(*) <= $2)))',
  args: [10, 100] }
```

## Order By

Specify row ordering with `.order`.

```js
sq.from`book`.order`title asc nulls last`.query

{ text: 'select * from book order by title asc nulls last',
  args: [] }
```

Multiple calls to `.order` are joined with `', '`.

```js
sq.from`book`.order`title`.order`year`.query

{ text: 'select * from book order by title, year',
  args: [] }
```

`.order` accepts strings.

**To prevent SQL injection, never source *strings* from user input.**

```js
sq.from('book').order('sales / 1000', 'title').query

{ text: 'select * from book order by sales / 1000, title',
  args: [] }
```

`.order` accepts fragments.

```js
sq.from('book').order(sq.txt`sales / ${1000}`, 'title').query

{ text: 'select * from book order by sales / $1, title',
  args: [1000] }
```

`.order` accepts subqueries.

```js
sq.from('book').order(sq.sql`sales / ${1000}`, 'title').query

{ text: 'select * from book order by (select sales / $1), title',
  args: [1000] }
```

`.order` accepts [expressions](#expressions).

```js
sq.from('book').order(sq.e.divide`sales`(1000), 'title').query

{ text: 'select * from book order by (sales / $1), title',
  args: [1000] }
```

### Order Objects

`.order` accepts objects.

Property `by` is used for ordering. It can be a string, fragment, subquery, or [expression](#expressions).

```js
sq.from('book').order({ by: sq.e.divide`sales`(1000) }, { by: 'title' }).query

{ text: 'select * from book order by sales / $1, title',
  args: [1000] }
```

Set property `sort` to either `'asc'` or `'desc'`. SQL defaults to ascending.

```js
sq.from('book').order({ by: 'title', sort: 'desc' }).query

{ text: 'select * from book order by title desc',
  args: [] }
```

**Postgres Only:** Set property `using` to a comparison operator.

```js
sq.from`person`.order({ by: 'first_name', using: '~<~' }).query

{ text: 'select * from person order by first_name using ~<~',
  args: [] }
```

**Postgres Only:** Set property `nulls` to `'first'` or `'last'` to select *null* ordering. SQL defaults to nulls first.

```js
sq.from('book').order({ by: 'title', nulls: 'last' }).query

{ text: 'select * from book order by title nulls last',
  args: [] }
```

## Limit

Pass `.limit` the maximum number of rows to fetch.

```js
sq.from('person').limit(8).query

{ text: 'select * from person limit $1',
  args: [8] }
```

Only the last call to `.limit` is used.

```js
sq.from('person').limit(7).limit(5).query

{ text: 'select * from person limit $1',
  args: [5] }
```

`.limit` can be called as a template tag.

```js
sq.from`person`.limit`1 + 7`.query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```

`.limit` accepts fragments.

```js
sq.from('person').limit(sq.txt`1 + 7`).query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```
`.limit` accepts subqueries.

```js
sq.from('person').limit(sq.return`1 + 7`).query

{ text: 'select * from person limit (select 1 + 7)',
  args: [] }
```

`.limit` accepts expressions.

```js
sq.from('person').limit(sq.e.plus(1, 7)).query

{ text: 'select * from person limit ($1 + $2)',
  args: [1, 7] }
```

## Offset

Pass `.offset` the number of rows to skip before returning rows.

```js
sq.from('person').offset(8).query

{ text: 'select * from person offset $1',
  args: [8] }
```

Only the last call to `.offset` is used.

```js
sq.from('person').offset(7).offset(5).query

{ text: 'select * from person offset $1',
  args: [5] }
```

`.offset` can be called as a template tag.

```js
sq.from`person`.offset`1 + 7`.query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```

`.offset` accepts fragments.

```js
sq.from('person').offset(sq.txt`1 + 7`).query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```
`.offset` accepts subqueries.

```js
sq.from('person').offset(sq.return`1 + 7`).query

{ text: 'select * from person offset (select 1 + 7)',
  args: [] }
```

`.offset` accepts expressions.

```js
sq.from('person').offset(sq.e.plus(1, 7)).query

{ text: 'select * from person offset ($1 + $2)',
  args: [1, 7] }
```

## Joins

`.join` builds *join* clauses. It accepts the same arguments as `.from`.

Sqorn builds a *natural join* by default.

```js
sq.from`book`.join`author`.query

{ text: 'select * from book natural join author',
  args: [] }
```

### On

Specify join conditions with `.on`. `.on` accepts the same arguments as `.where`.

```js
sq.from({ b: 'book' }).join({ a: 'author'}).on`b.author_id = a.id`.query

{ text: 'select * from book as b join author as a on (b.author_id = a.id)',
  args: [] }
```

Multiple calls to `.on` are joined with `and`.

```js
sq.from({ b: 'book' })
  .join({ a: 'author'}).on({ 'b.author_id': sq.raw('a.id') }).on({ 'b.genre': 'Fantasy' }).query

{ text: 'select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1)',
  args: ['Fantasy'] }
```

Chain `.and` and `.or` after `.on`.

```js
sq.from({ b: 'book' })
  .join({ a: 'author'}).on`$${'b.author_id'} = $${'a.id'}`.and({ 'b.genre': 'Fantasy' }).or`b.special = true`.query

{ text: 'select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)',
  args: ['Fantasy'] }
```

### Using

Alternatively, specify join columns with `.using`.

```js
sq.from`book`.join`author`.using`author_id`.query

{ text: 'select * from book join author using (author_id)',
  args: [] }
```

`.using` accepts column names as string arguments. It can be called multiple times.

```js
sq.from('a').join('b').using('x', 'y').using('z').query

{ text: 'select * from a join b using (x, y, z)',
  args: [] }
```

### Join Type

To change the join type, call `.left`, `.right`, `.full`, or `.cross` **before** `.join`.

```js
sq.from`book`.left.join`author`.right.join`publisher`.query

{ text: 'select * from book natural left join author natural right join publisher',
  args: [] }
```

The last join type specifier determines the join type. To explicitly perform an *inner join*, call `.inner`. Sqorn never generates the optional *inner* and *outer* keywords.

```js
sq.from`book`.left.right.join`author`.cross.inner.join`publisher`.query

{ text: 'select * from book natural right join author natural join publisher',
  query: []}
```

## Sets

### Union, Intersect, Except

Pass select subqueries to `.union`, `.intersect`, and `.except` to perform set operations.

```js
const Person = sq.from`person`
const Young = Person.where`age < 30`
const Middle = Person.where`age >= 30 and age < 60`
const Old = Person.where`age >= 60`

Person.except(Young).query

{ text: 'select * from person except (select * from person where (age < 30))',
  args: [] }

Young.union(Middle, Old).query

{ text: 'select * from person where (age < 30) union (select * from person where (age >= 30 and age < 60)) union (select * from person where (age >= 60))',
  args: [] }
```

### Union All, Intersect All, Except All

`.unionAll`, `.intersectAll`, and `.exceptAll` can be used to prevent duplicate elimination.

```js
Young.unionAll(Old).query

{ text: 'select * from person where (age < 30) union all (select * from person where (age >= 60))',
  args: [] }
```

Set operators can be chained.

```js
Person.except(Young).intersect(Person.except(Old)).query

{ text: 'select * from person except (select * from person where (age < 30)) intersect (select * from person except (select * from person where (age >= 60)))',
  args: [] }
```

## With

Construct CTEs (Common Table Expressions) with `.with`.

```js
sq.with`n as (select ${20} as age)`.from`n`.return`age`.query

{ text: 'with n as (select $1 as age) select age from n',
  args: [20] }
```

`.with` can be called multiple times.

```js
sq.with`width as (select ${10} as n)`
  .with`height as (select ${20} as n)`
  .return`width.n * height.n as area`
  .query

{ text: 'with width as (select $1 as n), height as (select $2 as n) select width.n * height.n as area',
  args: [10, 20] }
```

`.with` accepts objects in the form `{ alias: table }`. Tables can be subqueries.

```js
sq.with({
    width: sq.return({ n: 10 }),
    height: sq.sql`select ${20} as n`
  })
  .return({ area: sq.sql`width.n * height.n` })
  .query

{ text: 'with width as (select $1 as n), height as (select $2 as n) select width.n * height.n as area',
  args: [10, 20] }
```

Tables can be arrays of row objects. A *values* clause is generated. Column names are inferred from all keys.

```js
const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
sq.with({ people }).return`max(age)`.from`people`.query

{ text: 'with people(age, name) as (values ($1, $2), ($3, $4)) select max(age) from people',
  args: [7, 'Jo', 9, 'Mo'] }
```

### Recursive CTEs

Create a *recursive* CTE with `.recursive`.

```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.recursive
  .with({ 't(n)': one.unionAll(next) })
  .from('t')
  .return('sum(n)')
  .query

{ text: 'with recursive t(n) as (select 1 union all (select n + 1 from t where (n < 100))) select sum(n) from t',
  args: [] }
```
