---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## About

Sqorn is a Javascript library *engineered* for building SQL queries. Its declarative API is intuitive, minimal and flexibile. Sqorn treats queries as immutable, composable values, letting you construct complex queries by extending and embedding simple parts. Sqorn's immutable design is part of why it compiles queries [10x faster](https://sqorn.org/benchmarks.html) than Knex and [200x faster](https://sqorn.org/benchmarks.html) than Squel.

Sqorn is designed to make it possible to securely construct any valid SQL query. To achieve this, Sqorn lets you securely integrate raw SQL using tagged template literals. All arguments are automatically parameterized, preventing SQL injection. Sqorn also exposes the unique grammar and features of each supported SQL dialect.

Sqorn is not type-safe. You do not define models and relationships. You just write queries. It is your responsibility to ensure the queries are valid.

## Setup

Sqorn requires Node version 8 or above.

Sqorn is a collection of libraries, one for each SQL dialect. Follow the instructions below to install the Sqorn library for your dialect and connect to your database. For additional options, refer to [Configuration](http://localhost:3002/docs/tutorial.html#configuration).

### Postgres

Install [Node Postgres](https://www.npmjs.com/package/pg) and [Sqorn Postgres](https://www.npmjs.com/package/sqorn-pg).

```sh
npm install --save pg sqorn-pg
```

Create a [Node Postgres connection pool](https://node-postgres.com/features/connecting). Then pass `pg` and `pool` as arguments to `sqorn()` to create a query builder `sq`.

```javascript
const pg = require('pg')
const sqorn = require('sqorn-pg')

const pool = new pg.Pool()
const sq = sqorn({ pg, pool })
```

### MySQL

TODO

### SQLite

TODO

## Manual Queries

`sq` is Sqorn's immutable query-building interface. It has methods for building and executing SQL queries. Query-building methods are chainable and return a new query-building instance when called.

### SQL Query

Build a SQL query manually with `.sql`.

```js
const min = 20, max = 30
const People = sq.sql`select * from person where age >= ${min} and age < ${max}`
```

Sqorn compiles this to a parameterized query safe from SQL injection. `.query` returns the compiled query object.

```js
People.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

`.unparameterized` compiles to an unparameterized query string. **To prevent SQL injection, do not use this method.**

```js
People.unparameterized

'select * from person where age >= 20 and age < 30'
```

When you need a raw unparameterized argument, prefix it with `$`.

```js
sq.sql`select * from $${'test_table'} where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

Alternatively, wrap the argument in a call to `.raw`.

```js
sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

Javascript `null` maps to SQL `null`.

```js
sq.sql`select ${null}`.query

{ text: 'select $1',
  args: [null] }
```

`undefined` arguments are invalid.

```js
sq.sql`select ${undefined}`.query

// throws error
```

`.sql` can be called multiple times. Calls are joined with spaces by default.

```js
sq.sql`select *`
  .sql`from person`
  .sql`where age >= ${20} and age < ${30}`
  .query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

Sqorn automatically parenthesizes subqueries.

```js
const One = sq.sql`select ${1}`
const Two = sq.sql`select ${2}`
sq.sql`select ${One},`.sql(Two).query

{ text: 'select (select $1), (select $2)',
  args: [1, 2] }
```

Call `.sql` as a function to parameterize an argument or build a subquery.

```js
sq.sql`select * from`
  .sql(sq.raw('person'))
  .sql`where age =`
  .sql(sq.sql`select`.sql(20))
  .query

{ text: 'select * from person where age = (select $1)',
  args: [20] }
```

Use `.sql` to build *complete* queries, not fragments.

### Text Fragment

Build query fragments with `.txt`. Sqorn does not automatically paranthesize embedded fragments.

```js
const Where = sq.txt`where age >= ${20}`
sq.sql`select * from person ${Where}`.query

{ text: 'select * from person where age >= $1',
  args: [20, 30] }
```

Like `.sql`, `.txt` can be chained and called as a function.

```js
const FromWhere = sq.txt`from person`.txt`where age >=`.txt(20)
sq.sql`select * ${FromWhere}`.query

{ text: 'select * from person where age = $1',
  args: [20] }
```

However, attempting to build a fragment will throw an error.

```js
sq.txt`select 1`.query

// throws error
```

Mixing calls to `.sql` and `.txt` is invalid.

### Extend

Create a query from query parts with `.extend`.

```js
sq.extend(
  sq.sql`select *`,
  sq.sql`from person`,
  sq.sql`where age >= ${20} and age < ${30}`
).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

TODO: `.extend` also accepts an array of queries.

```js
sq.extend([
  sq.sql`select * from person where age >= ${20}`
  sq.sql`and age < ${30}`
]).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

### Link

`.link` specifies the separator used to join query parts.

```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
const value = book => sq.txt`(${book.id}, ${book.title})`
const values = sq.extend(books.map(value)).link(', ')
sq.sql`insert into book(id, title)`.sql`values ${values}`.link('\n').query

{ text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
  args: [1, '1984', 2, 'Dracula'] }
```

## Executing Queries

### All Rows


Execute the query and get back a Promise for all result rows with `.all`. The query builder is itself *thenable* so `.all` is optional.

```js
const People = sq.sql`select * from person`
// four ways ways to print all people:
console.log(await People.all())
console.log(await People)
People.all().then(people => console.log(people))
People.then(people => console.log(people))
```

### One Row

Call `.one` to fetch only the first result, or `undefined` if there are no matching results. The following all print the first person (or `undefined`).

```js
const Person = sq.sql`select * from person limit 1`
// four ways ways to print the first person:
Person.one().then(person => console.log(person))
Person.all().then(people => console.log(people[0])
console.log(await Person.one())
console.log((await Person)[0])
```

### Manually

You can use `.query` to build a query, then send its text and arguments to another library for execution.

```js
const pg = require('pg')
const sqorn = require('sqorn-pg')

const pool = new pg.Pool()
const sq = sqorn()

const { text, args } = sq.from('book').query
pool.query(text, args).then((err, res) => { console.log(res) })
```

`.query` is a getter method that compiles the query when accessed. Don't call it twice.

Never use `.unparameterized` to build a query string. It is vulnerable to SQL injection.

## Transactions

### Callback

Call `.transaction` with an asynchronous callback to begin a transaction. The first callback argument is a transaction object `trx`. Pass `trx` to `.all` or `.one` to execute a query as part of a transaction.

`.transaction` returns a Promise for the value returned by its callback. If a query fails or an error is thrown, all queries will be rolled back and `.transaction` will throw an error.


```js
// creates an account, returning a promise for the created user's id
const createAccount = (email, password) => 
  sq.transaction(async trx => {
    const { id } = await sq.sql`insert into account(email) values (${email}) returning id`.one(trx) 
    await sq`insert into authentication(account_id, password) values (${id}, ${password})`.all(trx)
    return id
  })
```

### Value

If you need more flexibility, call `.transaction` without any arguments and it will return a Promise for a transaction object `trx`, or `undefined` if a transaction could not be started.

Pass `trx` to a query to add it to a transaction. To commit the transaction, run ` await trx.commit()`. To rollback the transaction, run `await trx.rollback()`. Every transaction MUST be committed or rolled back to prevent a resource leak.

```js
// creates an account, returning a promise for the created user's id
const createAccount = async (email, password) =>  {
  const trx = await sq.transaction()
  try {
    const { id } = await sq.sql`insert into account(email) values (${email}) returning id`.one(trx) 
    await sq`insert into authorization(account_id, password) values (${id}, ${password})`.all(trx)
    await trx.commit()
    return id
  } catch (error) {
    await trx.rollback()
    throw error
  }
}
```

## Select Queries

### From

`.from` builds a *from* clause.

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

**To prevent SQL injection, never source *string* tables from user input.**

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

#### Table Objects

Pass `.from` objects in the form `{ alias: table }` to construct *`table as alias`* clauses.

Tables can be strings.

**To prevent SQL injection, never source *string* tables from user input.**

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

### Where

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

#### Condition Objects

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

Call `sq.raw` to prevent parameterization.

```js
sq.from('book', 'author').where({ 'book.id': sq.raw('author.id') }).query

{ text: 'select * from book, author where (book.id = author.id)',
  args: [] }
```

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from`person`.where({ firstName: 'Kaladin' }).query

{ text: 'select * from person where (first_name = $1)',
  args: ['Kaladin'] }
```

Multiple arguments passed to `.where` are joined with `or`.

```js
sq.from`person`.where({ name: 'Rob' }, sq.txt`name = ${'Bob'}`).query

{ text: 'select * from person where ((name = $1) or (name = $2))',
  args: ['Rob', 'Bob'] }
```

TODO: Conditions in an array are joined with `and`.

```js
sq.from`person`.where([sq.txt`true`, sq.txt`true`], sq.txt`false`).query

{ text: 'select * from person where ((true) and (true)) or (false)',
  args: ['Rob', 'Bob'] }
```

### Select

`.return` builds a *select* clause.

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
sq.from`book`.return('title', 'author').query

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
sq.from`book`.return(sq.sql`select now()`, sq.return(sq.txt(8)).query

{ text: 'select (select now()), (select $1)',
  args: [8] }
```

#### Return Objects

`.return` accepts objects in the form `{ alias: value }`. Each property generates a `value as alias` clause.

Values can be strings.

**To prevent SQL injection, never source string from user input.**

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

TODO: Values can be expressions.

```js
sq.return({ hello: sq.e('world'), sum: sq.plus(e(1), 2) }).query

{ text: 'select (select now()) as time, (select $1) as eight',
  args: [8] }
```

#### Distinct

Call `.distinct` to get only one row for each group of duplicates.

```js
sq.from`book`.distinct.return`genre`.return`author`.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

`.distinct` is idempotent.

```js
sq.from`book`.distinct.distinct.return`genre`.return`author`.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

**Postgres only:** Call `.distinctOn` to get only the first row from each group matching provided expressions.

```js
sq.from`weather`
  .distinctOn`location`.return`location, time, report`.query

{ text: 'select distinct on (location) location, time, report from weather',
  args: [] }
```

`.distinctOn` can be called multiple times.

```js
sq.from`weather`
  .distinctOn`location`.distinctOn`time`.return`location, time, report`
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.distinctOn` accepts [expressions](#expressions).

Expressions can be strings

**To prevent SQL injection, never source *string* expressions from user input.**

```js
sq.from('weather')
  .distinctOn('location', 'time').return('location', 'time', 'report').query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```
Expressions can be *manual* subqueries.

```js
sq.from`generate_series(0, 10) as n`.distinctOn(sq.sql`n / 3`).return`n`.query

{ text: 'select distinct on (n / 3) n from generate_series(0, 10) as n',
  args: [] }
```

### Express

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

### Extend

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

### Group By

Add a *Group By* clause with `.group` to create one row for all rows matching the given *expressions*.

```js
sq.from`person`.return`age, count(*)`.group`age`.query

{ text: 'select age, count(*) from person group by age',
  args: [] }
```

Multiple `.group` calls are joined with `', '`.

```js
sq.from`person`.return`age, last_name, count(*)`
  .group`age`.group`last_name`.query

{ text: 'select age, last_name, count(*) from person group by age, last_name',
  args: [] }
```

`.group` accepts [expressions](#expressions) and arrays of expressions.

```js
sq.from('person').return('count(*)').group('age', [sq.sql`last_name`, 'first_name']).query

{ text: 'select count(*) from person group by age, (last_name, first_name)',
  args: [] }
```

**Postgres Only:** `.group` accepts *rollup* arguments. `.rollup` accepts expressions and arrays of expressions.

```js
sq.from`t`.group(sq.rollup('a', ['b', sq.sql`c`], 'd')).query

// postgres
{ text: 'select * from t group by rollup (a, (b, c)), d',
  args: [] }
```

**Postgres Only:** `.group` accepts *cube* arguments. `.cube` accepts expressions and arrays of expressions.

```js
sq.from`t`.group(sq.cube('a', ['b', sq.sql`c`], 'd')).query

// postgres
{ text: 'select * from t group by cube (a, (b, c)), d',
  args: [] }
```

**Postgres Only:** `.group` accepts *grouping sets* arguments. `.groupingSets` accepts the same arguments as `.group`.

```js
sq.from`t`.group(sq.groupingSets(['a', 'b', 'c'], sq.groupingSets(['a', 'b']), ['a'], [])).query

// postgres
{ text: 'select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), ())',
  args: [] }
```

### Having

Filter groups with `.having`. `.having` accepts the same arguments as `.where`.

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
sq.from`person`.group`age`.having({ age: 18, c: sq.sql`age < ${19}` }).or({ age: 20 }).and`count(*) > 10`.query

{ text: 'select * from person group by age having (age = $1 and age < $2) or (age = $3) and (count(*) > 10)',
  args: [18, 19, 20] }
```

### Order By

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

`.order` accepts [expressions](#expressions).

**To prevent SQL injection, never source *string* expressions from user input.**

```js
sq.from`book`.order('title', sq.sql`sales / ${1000}`).query

{ text: 'select * from book order by title, sales / $1',
  args: [1000] }
```

`.order` accepts objects. Property `by` is the [expression](#expressions) used for ordering.

```js
sq.from`book`.order({ by: 'title' }, { by: sq.sql`sales / ${1000}` }).query

{ text: 'select * from book order by title, sales / $1',
  args: [1000] }
```

Set property `sort` to `'asc'` or `'desc'`. SQL defaults to ascending.

```js
sq.from`book`.order({ by: 'title', sort: 'desc' }).query

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
sq.from`book`.order({ by: 'title', nulls: 'last' }).query

{ text: 'select * from book order by title nulls last',
  args: [] }
```

### Limit

Pass `.limit` the maximum number of rows to fetch.

```js
sq.from`person`.limit(8).query

{ text: 'select * from person limit $1',
  args: [8] }
```

Only the last call to `.limit` is used.

```js
sq.from`person`.limit(7).limit(5).query

{ text: 'select * from person limit $1',
  args: [5] }
```

`.limit` can be called as a template tag.

```js
sq.from`person`.limit`1 + 7`.query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```

`.limit` accepts a *manual* subquery.

```js
sq.from`person`.limit(sq.sql`1 + 7`).query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```

`.limit` accepts a *select* subquery.

```js
sq.from`person`.limit(sq.return(10)).query

{ text: 'select * from person limit (select $1)',
  args: [10] }
```

### Offset

Pass `.offset` the number of rows to skip before returning rows.

```js
sq.from`person`.offset(8).query

{ text: 'select * from person offset $1',
  args: [8] }
```

Only the last call to `.offset` is used.

```js
sq.from`person`.offset(7).offset(5).query

{ text: 'select * from person offset $1',
  args: [5] }
```

`.offset` can be called as a template tag.

```js
sq.from`person`.offset`1 + 7`.query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```

`.offset` accepts a *manual* subquery.

```js
sq.from`person`.offset(sq.sql`1 + 7`).query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```

`.offset` accepts a *select* subquery.

```js
sq.from`person`.offset(sq.return(10)).query

{ text: 'select * from person offset (select $1)',
  args: [10] }
```

### Join

Call `.join` to build a *join* clause. It accepts the same arguments as `.from`. Sqorn builds a *natural join* by default.

```js
sq.from`book`.join`author`.query

{ text: 'select * from book natural join author',
  args: [] }
```

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

Alternatively, specify join columns with `.using`.

```js
sq.from`book`.join`author`.using`author_id`.query

{ text: 'select * from book join author using (author_id)',
  args: [] }
```

`.using` accepts column names as string arguments. It can be called multiple times.

```js
sq.from`a`.join`b`.using('x', 'y').using`z`.query

{ text: 'select * from a join b using (x, y, z)',
  args: [] }
```

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

### Sets

Pass *select* subqueries to `.union`, `.intersect`, and `.except` to perform set operations.

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

### With

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

Create a *recursive* CTE with `.recursive`.

```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.recursive
  .with({ 't(n)': one.unionAll(next) })
  .from`t`
  .return`sum(n)`
  .query

{ text: 'with recursive t(n) as (select 1 union all (select n + 1 from t where (n < 100))) select sum(n) from t',
  args: [] }
```

## Delete Queries

### Delete

*Delete* queries look like *select* queries with an additional call to `.delete`.

```js
sq.delete.from`person`.query
sq.from`person`.delete.query // equivalent

{ text: 'delete from person',
  args: [] }
```

`.delete` is idempotent.

```js
sq`book`.delete.delete.delete.query

{ text: 'delete from book',
  args: [] }
```

### Where

Filter the rows to delete with `.where`

```js
sq.delete.from`person`.where`id = ${723}`.query

{ text: 'delete from person where id = $1',
  args: [723] }
```

### Returning

**Postgres Only:** Return the deleted rows with [`.return`](#select).

```js
sq.delete.from`person`.return`name`.query

{ text: 'delete from person returning name',
  args: [] }
```

### Express

Express syntax works.

```js
sq`person`({ job: 'student' })`name`.delete.query

{ text: 'delete from person where job = $1 returning name',
  args: ['student'] }
```

### Using

**Postgres Only:** The first `.from` call forms the *delete* clause. Subsequent `.from` calls form the *using* clause.

```js
sq.delete
  .from`book`
  .from`author`
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [] }
```

## Insert Queries

### Insert

`Insert` queries use `.insert` to specify the rows to insert.

```js
sq.from`person(first_name, last_name)`.insert`values (${'Shallan'}, ${'Davar'})`.query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Shallan', 'Davar'] }
```

To insert one row, pass `.insert` a single object. Column names are inferred from the object's keys.

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from('person').insert({ firstName: 'Shallan', lastName: 'Davar' }).query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Shallan', 'Davar'] }
```

`undefined` values are inserted as `default`. `default` cannot be parameterized.

```js
sq.from('test').insert({ a: undefined, b: null }).query

{ text: 'insert into test(a, b) values (default, $1)',
  args: [null] }
```

To insert multiple rows, pass multiple objects. Column names are inferred from the keys of all objects.

```js
sq.from('person')
  .insert(
    { firstName: 'Shallan', lastName: 'Davar' },
    { firstName: 'Navani', lastName: 'Kholin' }
  )
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
  args: ['Shallan', 'Davar', 'Navani', 'Kholin'] }
```

Alternatively, pass `.insert` an array of objects.

```js
sq.from('person')
  .insert([
    { firstName: 'Shallan', lastName: 'Davar' },
    { firstName: 'Navani', lastName: 'Kholin' }
  ])
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
  args: ['Shallan', 'Davar', 'Navani', 'Kholin'] }
```

Values may be subqueries.

```js
sq.from('person').insert({
    firstName: sq.return`${'Shallan'}`,
    lastName: sq.sql('Davar')
  })
  .query

{ text: "insert into person(first_name, last_name) values ((select $1), $2)",
  args: ['Shallan', 'Davar'] }
```

`.insert` accepts subqueries.

```js
sq.from('superhero(name)')
  .insert(sq.return`${'batman'}`.union(sq.return`${'superman'}`))
  .query

{ text: "insert into superhero(name) select $1 union (select $2)",
  args: ['batman', 'superman'] }
```

Call `.insert` without arguments to insert default values.

```js
sq.from`person`.insert().query

{ text: 'insert into person default values',
  args: [] }
```

Only the last call to `.insert` is used.

```js
sq.from`person`
  .insert({ firstName: 'Shallan', lastName: 'Davar' })
  .insert({ firstName: 'Navani', lastName: 'Kholin' })
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Navani', 'Kholin'] }
```

### Returning

**Postgres Only:** Return the inserted rows with [`.return`](#select).

```js
sq.from`book`.insert({ title: 'Squirrels and Acorns' }).return`id`.query

{ text: 'insert into book (title) values ($1) returning id',
  args: ['Squirrels and Acorns'] }
```

### Express

[Express syntax](#express-syntax) may be used to specify `.from` and `.return`.

```js
sq`book`()`id`.insert({ title: 'Squirrels and Acorns' }).query

{ text: 'insert into book (title) values ($1) returning id',
  args: ['Squirrels and Acorns'] }
```

## Update Queries

### Set

*Update* queries use `.set` to specify columns to update. `.set` can be called multiple times.

```js
sq.from`person`.set`age = age + 1, processed = true`.set`name = ${'Sally'}`.query

{ text: 'update person set age = age + 1, processed = true, name = $1',
  args: ['Sally'] }
```

`.set` accepts update objects.

```js
sq.from('person')
  .set({ firstName: 'Robert', nickname: 'Rob' }, { processed: true })
  .query

{ text: 'update person set first_name = $1, nickname = $2, processed = $3',
  args: ['Robert', 'Rob', true] }
```

Update values may be subqueries.

```js
sq.from('person').set({
  firstName: sq.sql`'Bob'`,
  lastName: sq.return`'Smith'`
 })
 .query

{ text: "update person set first_name = 'Bob', last_name = (select 'Smith')",
  args: [] }
```

Call `.set` multiple times to update additional columns.

```js
sq.from`person`
  .set({ firstName: 'Robert' })
  .set({ nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2',
  args: ['Robert', 'Rob'] }
```

### Where

*Update* queries may have a *where* clause.

```js
sq.from`person`
  .where({ firstName: 'Matt' })
  .set({ firstName: 'Robert', nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2 where (first_name = $3)',
  args: ['Robert', 'Rob', 'Matt'] }
```

### Returning

**Postgres Only:** Return the updated rows with [`.return`](#select).

```js
sq.from`person`
  .where`age > 60 and old = false`
  .set`old = true`
  .return`id, age`
  .query

{ text: 'update person set old = true where (age > 60 and old = false) returning id, age',
  args: [] }
```

### Express

Express syntax works.

```js
sq`person`({ firstName: 'Rob' })`id`.set({ firstName: 'Robert'}).query

{ text: 'update person set first_name = $1 where first_name = $2 returning id',
  args: ['Robert', 'Rob'] }
```

### From

**Postgres Only:** The first `.from` call forms the *update* clause. Subsequent `.from` calls form the *from* clause.

```js
sq.from`book`
  .from`author`
  .set({ available: false })
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [false] }
```

## Values Queries

TODO

<!-- See [Postgres docs](https://www.postgresql.org/docs/current/static/sql-values.html) -->

<!-- ### Ordery By -->

<!-- TODO -->

<!-- ### Limit -->

<!-- TODO -->

<!-- ### Offset -->

<!-- TODO -->

<!-- ## Upsert Queries -->

<!-- TODO -->

## Configuration



### Thenable

By default, Sqorn's query builder `sq` is *thenable*. This allows you to directly `await` or call `.then` on `sq`.

Disable this behavior by setting `thenable` to `false`.

```js
const sq = sqorn({ thenable: false })

// throws error
const people = await sq.sql`select * from person`
sq.sql`select * from person`.then(people => {})

// succeeds
const people = await sq.sql`select * from person`.all()
sq.sql`select * from person`.all().then(people => {})
```

### Map Input Keys

By default, Sqorn converts input object keys to *snake_case*.

```js
sq.with({ aB: sq.sql`select cD`, e_f: sq.sql`select g_h` })
  .from({ iJ3: 'kL', mN: [{ oP: 1, q_r: 1 }] })
  .where({ sT: 1, u_v: 1 })
  .return({ wX: 1, y_z: 1 })
  .link('\n').query.text

`with a_b as (select cD), e_f as (select g_h)
select $1 as w_x, $2 as y_z
from kL as i_j_3, (values ($3, $4)) as m_n(o_p, q_r)
where (s_t = $5 and u_v = $6)`
```

String arguments, template string arguments, and object values are not converted. By default, object keys containing parentheses are returned unmodified.

```js
sq.with({ 'aB(cD, e_f)': sq.sql`select 1, 2`})
  .from('gH')
  .from`jK`
  .return({ lM: 'nO' }, 'pQ')
  .query

{ text: 'with aB(cD, e_f) as (select 1, 2) select nO as l_m, pQ from gH, jK',
  args: [] }
```

Customize how input object keys are mapped by setting `mapInputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })

sq.return({ favoriteNumber: 8 }).query

{ text: 'select $1 as FAVORITENUMBER',
  args: [8] }
```

Mappings are computed once per key then cached.

### Map Output Keys

By default, Sqorn converts output object keys to *camelCase*.

```js
const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { id, firstName, lastName } = first
```

Customize how output object keys are mapped by setting `mapOutputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })

const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { ID, FIRST_NAME, LAST_NAME } = first
```

Mappings are computed once per key then cached.

## Expressions

Create expressions from string, number, boolean, null, or JSON values with `.e`.

```js
sq.return(
  sq.e('hi'),
  sq.e(8),
  sq.e(true),
  sq.e(null),
  sq.e({ a: 1 })
).query

{ text: 'select $1, $2, $3, $4',
  args: ['hi', 8, true, null] }
```

`.e` accepts raw values, expressions, fragments, and subqueries.

```js
sq.return(
  sq.e(sq.raw('1 + 1')),
  sq.e(sq.e(7)),
  sq.e(sq.txt`'bye'`),
  sq.e(sq.sql`select ${8}`),
  sq.e(sq.return(sq.e(9))),
).query

{ text: "select 1 + 1, $1, 'bye', (select $2), (select $3)",
  args: [7, 8, 9] }
```

`.e.eq` builds an equality expression. It accepts two arguments of the same type that `.e` accepts.

```js
sq.return(
  sq.e.eq(sq.raw('genre'), 'fantasy'),
  sq.e.eq('genre', 'history')
).query

{ text: 'select genre = $1, $2 = $3'
  args: ['fantasy', 'genre', 'history']}
```

`.e.eq` can be curried. Give each argument its own function call or template tag.

```js
sq.return(
  sq.e.eq(sq.raw('genre'))('fantasy'),
  sq.e.eq`genre`('history'),
  sq.e.eq`genre``${'art'}`,
).query

{ text: 'select genre = $1, genre = $2, genre = $3',
  args: ['fantasy', 'history', 'art'] }
```


### Custom Expressions

An expression is a function that takes argument `ctx` and returns the query text.

For example, `.e.eq` is defined as follows:

```js
e.eq = (a, b) => ctx => `(${ctx.build(a)} = ${ctx.build(b)})`
```

```
e.create()
```

## Operators

### Custom

TODO

### Logical

#### And

TODO

#### Or

TODO

#### Not

TODO

### Comparison

#### <, >, <=, >=, =, != or <>

TODO

#### Between, Not Between

TODO

#### Is Distinct, Is Not Distinct

TODO

#### Is Null, Is Not Null

TODO

#### True, Not True, False, Not False, Unknown, Not Unknown

TODO

### Math

TODO

### String

TODO

#### Like, Not Like

TODO

#### Similar To, Not Similar To

TODO

#### Regex: ~, ~*, !~, !~*

TODO

### Bit

TODO

### Type Conversions

TODO

### Date and Time

TODO

### Functions

TODO

### Casts

TODO

### Conditional

#### Case

TODO

#### Coallesce

TODO

#### Nullif

TODO

#### Greatest

TODO

#### Least

TODO

### Aggregate

#### Avg

TODO

#### Count

TODO

#### Min

TODO

#### Max

TODO

#### Sum

TODO

### Subquery

TODO

### Row and Array

TODO


