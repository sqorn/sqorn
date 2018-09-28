---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## About

Sqorn is a Javascript library *designed* for building SQL queries. Its declarative API lets you construct SQL queries from immutable, composable parts.

Sqorn's API is engineered for minimalism, generality and power. It evades the feature creep ensaring other SQL query builders that have chosen the wrong abstractions to expose.

Sqorn's API is modeled after SQL clauses but harnesses modern Javascript features to provide an intuitive interface to your database. Sqorn's syntactic sugar makes common CRUD operations so simple that it has been accused of being an ORM.

Sqorn does not compromise flexibility for abstraction. It exposes the unique features of each supported SQL dialect and lets you securely integrate raw SQL.

Sqorn parameterizes all queries so you can be confident your appliction is not vulnerable to SQL injection.

Sqorn compiles queries [10x faster](https://sqorn.org/benchmarks.html) than [Knex](https://knexjs.org/) and [200x faster](https://sqorn.org/benchmarks.html) than [Squel](https://github.com/hiddentao/squel).

## Setup

### Install

Use npm to install Sqorn and your preferred database library.

```sh
npm install --save sqorn-pg # postgres is the only database currently supported
```


### Initialize

Create a query building instance connected to your database. Here, we connect to a local Postgres server using a [connection string](https://node-postgres.com/features/connecting#connection-uri):

```javascript
const sq = require('sqorn-pg')({
  connection: {
    connectionString: 'postgresql://postgres@localhost:5432/postgres'
  }
})
```

`sq` is the immutable query-building interface. It has methods for building and executing SQL queries. Query-building methods are chainable and return a new query-building instance.

## Manual Queries

### SQL

Construct a query manually with `.l`. 

```js
const min = 20, max = 30
const People = sq.l`select * from person where age >= ${min} and age < ${max}`
```

Sqorn compiles this to a parameterized query safe from SQL injection. `.query` returns the compiled query object.

```js
People.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

`.l` can be called multiple times. Calls are joined with spaces.

```js
sq.l`select *`
  .l`from person`
  .l`where age >= ${20} and age < ${30}`
  .query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

Template string arguments can be subqueries.

```js
const where = sq.l`where age >= ${20} and age < ${30}`
sq.l`select * from person ${where}`.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

Call `.l` as a function to parameterize a single argument.

```js
sq.l`select * from person where age >=`.l(20).l`and age < `.l(30).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

### Raw

When you need a raw unparameterized argument, prefix it with `$`.

```js
sq.l`select * from $${'test_table'} where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

Alternatively, pass a single argument to `.raw`.

```js
sq.l`select * from`.raw('test_table').l`where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

### Extend

Create a query from query parts with `.extend`.

```js
sq.extend(
  sq.l`select *`,
  sq.l`from person`,
  sq.l`where age >= ${20} and age < ${30}`
).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

### Link

`.link` specifies the separator used to join query parts. `.link` can be called as a template tag or passed a string argument.

```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
const value = book => sq.l`(${book.id}, ${book.title})`
const values = sq.extend(...books.map(value)).link`, `
sq.l`insert into book(id, title)`.l`values ${values}`.link('\n').query

{ text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
  args: [1, '1984', 2, 'Dracula'] }
```

## Executing Queries

### All Rows


Execute the query and get back a Promise for all result rows with `.all`. The query builder is itself *thenable* so `.all` is optional.

```js
const People = sq.l`select * from person`
// four ways ways to print all people:
console.log(await People.all())
console.log(await People)
People.all().then(people => console.log(people))
People.then(people => console.log(people))
```

### One Row

Call `.one` to fetch only the first result, or `undefined` if there are no matching results. The following all print the first person (or `undefined`).

```js
const Person = sq.l`select * from person limit 1`
// four ways ways to print the first person:
Person.one().then(person => console.log(person))
Person.all().then(people => console.log(people[0])
console.log(await Person.one())
console.log((await Person)[0])
```

### Transaction Callback

Call `.transaction` with an asynchronous callback to begin a transaction. The first callback argument is a transaction object `trx`. Pass `trx` to `.all` or `.one` to execute a query as part of a transaction.

`.transaction` returns a Promise for the value returned by its callback. If a query fails or an error is thrown, all queries will be rolled back and `.transaction` will throw an error.


```js
// creates an account, returning a promise for the created user's id
const createAccount = (email, password) => 
  sq.transaction(async trx => {
    const { id } = await sq.l`insert into account(email) values (${email}) returning id`.one(trx) 
    await sq`insert into authorization(account_id, password) values (${id}, ${password})`.all(trx)
    return id
  })
```

### Transaction Value

If you need more flexibility, call `.transaction` without any arguments and it will return a Promise for a transaction object `trx`, or `undefined` if a transaction could not be started.

Pass `trx` to a query to add it to a transaction. To commit the transaction, run ` await trx.commit()`. To rollback the transaction, run `await trx.rollback()`. Every transaction MUST be committed or rolled back to prevent a resource leak.

```js
// creates an account, returning a promise for the created user's id
const createAccount = async (email, password) =>  {
  const trx = await sq.transaction()
  try {
    const { id } = await sq.l`insert into account(email) values (${email}) returning id`.one(trx) 
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

The simplest *select* query gets all rows from a table. Specify a *from* clause with `.from`.

```js
sq.from`book`.query

{ text: 'select * from book',
  args: [] }
```

`.from` accepts table names as strings.

**To prevent SQL injection, do not pass user-provided table names.**

```js
sq.from('book', 'author').query

{ text: 'select * from book, author',
  args: [] }
```

`.from` accepts *manually constructed* subqueries.

```js
// Postgres-only query
sq.from(sq.l`unnest(array[1, 2, 3])`).query

{ text: 'select * from unnest(array[1, 2, 3])',
  args: [] }
```

Multiple `.from` calls are joined with `', '`.

```js
sq.from`book`.from`person`.query

{ text: 'select * from book, person',
  args: [] }
```

Pass `.from` an object in the form `{ alias: table }` to construct a *`table as alias`* clause.

Tables can be strings.

**To prevent SQL injection, do not pass user-provided table names.**

```js
sq.from({ b: 'book', p: 'person' }).query

{ text: 'select * from book as b, person as p',
  args: [] }
```

Tables can be arrays of row objects.

```js
sq.from({ people: [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }] }).query

{ text: 'select * from (values ($1, $2), ($3, $5) as people(age, name))',
  args: [8, 'Jo', 9, 'Mo'] }
```

Tables can be *select* subqueries.

```js
sq.from({ b: sq.from`book` }).query

{ text: 'select * from (select * from book) as b',
  args: [] }
```

Tables can be manually constructed subqueries. These will *not* be parenthesized automatically.

```js
// a Postgres-only query
sq.from({ countDown: sq.l`unnest(${[3, 2, 1]})` }).query

{ text: 'select * from unnest($1) as count_down',
  args: [[3, 2, 1]] }
```

`.from` accepts multiple string object, or subquery arguments.

```js
sq.from({ b: 'book' }, 'person', sq.l`author`).query

{ text: 'select * from book as b, person, author',
  args: [] }
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

Multiple `.where` calls are joined with *`and`*.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`.query

{ text: 'select * from book where (genre = $1) and (year = $2)',
  args: ['Fantasy', 2000] }
```

`.and` and `.or` can be called **after** calling `.where`. They accept the same arguments as `.where`.

```js
sq.from`person`.where`name = ${'Rob'}`.or`name = ${'Bob'}`.and`age = ${7}`.query

{ text: 'select * from person where (name = $1) or (name = $2) and (age = $3)',
  args: ['Rob', 'Bob', 7]}
```

You can specify conditions with a manually constructed subquery.

```js
sq.from`book`.where(sq.l`genre = ${'Fantasy'}`).query

{ text: 'select * from book where (genre = $12)',
  args: ['Fantasy'] }
```

You can specify conditions with an object.

```js
sq.from`book`.where({ genre: 'Fantasy', year: 2000 }).query

{ text: 'select * from book where (genre = $1 and year = $2)',
  args: ['Fantasy', 2000] }
```

By default keys are converted from `CamelCase` to `snake_case`.

```js
sq.from`person`.where({ firstName: 'Kaladin' }).query

{ text: 'select * from person where (first_name = $1)',
  args: ['Kaladin'] }
```

Construct raw object values with a *single, unchained* call to `sq.raw`.

```js
sq.from('book', 'author').where({ 'book.id': sq.raw('author.id') }).query

{ text: 'select * from book, author where book.id = author.id',
  args: [] }
```

If you need a non-equality condition, add a property whose value is created with `sq.l`. The property's key will be ignored.

```js
const minYear = sq.l`year >= ${20}`
const maxYear = sq.l`year < ${30}`
sq.from`person`.where({ minYear, maxYear }).query

{ text: 'select * from person where (year >= $1 and year < $2)',
  args: [20, 30] }
```

Multiple arguments passed to `.where` are joined with `or`.

```js
sq.from`person`.where({ name: 'Rob' }, sq.l`name = ${'Bob'}`).query

{ text: 'select * from person where (name = $1 or name = $2)',
  args: ['Rob', 'Bob'] }
```

### Select

Specify selected columns with `.return`.

```js
sq.return`${1} as a, ${2} as b, ${1} + ${2} as sum`.query

{ text: 'select $1 as a, $2 as b, $3 + $4 as sum',
  args: [1, 2, 1, 2] }
```

`.return` accepts column names as strings.

**To prevent SQL injection, do not pass user-provided column names.**

```js
sq.from`book`.return('title', 'author').query

{ text: 'select title, author from book',
  args: [] }
```

Multiple `.return` calls are joined with `', '`.

```js
sq.from`book`.return('title', 'author').return`id`.query

{ text: 'select title, author, id from book',
  args: [] }
```

You can pass `.return` an object whose keys are *aliases* and whose values are output *expressions*.

Expressions can be strings.

**To prevent SQL injection, do not pass user-provided expressions.**

```js
sq.from`person`.return({ firstName: 'person.first_name' , age: 'person.age' }).query

{ text: 'select person.first_name as first_name, person.age as age from person',
  args: [] }
```

Expressions can be subqueries.

```js
sq.return({ sum: sq.l`${2} + ${3}` }).query

{ text: 'select $1 + $2 as sum',
  args: [2, 3] }
```

Call `.distinct` before `.return` to get only one row for each group of duplicates.

```js
sq.from`book`.distinct.return`genre`.return`author`.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

When using Sqorn Postgres, call `.distinct.on` to get only the first row from each group matching the argument expressions.

```js
sq.from`weather`
  .distinct.on`location`.return`location, time, report`.query

{ text: 'select distinct on (location) location, time, report from weather',
  args: [] }
```

`.on` accepts column names as strings.

**To prevent SQL injection, do not pass user-provided column names.**

```js
sq.from('weather')
  .distinct.on('location', 'time').return('location', 'time', 'report').query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.on` can be called multiple times.

```js
sq.from('weather')
  .distinct.on('location').on('time').return('location', 'time', 'report')
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.on` accepts subqueries.

```js
sq.from`generate_series(0, 10) as n`
  .distinct.on(sq.l`n / 3`).return`n`.query

{ text: 'select distinct on (n / 3) n from generate_series(0, 10) as n',
  args: [] }
```


### Group By

TODO, only template string form works

### Having

TODO, only template string form works

### Order By

TODO, only template string form works

### Limit

Pass `.limit` the maximum number of rows to fetch.

```js
sq.from`person`.limit(8).query

{ text: 'select * from person limit $1',
  args: [8] }
```

`.limit` can be called as a template tag.

```js
sq.from`person`.limit`8`.query

{ text: 'select * from person limit 8',
  args: [] }
```

Only the last call to `.limit` is used.

```js
sq.from`person`.limit(7).limit(5).query

{ text: 'select * from person limit $1',
  args: [5] }
```

### Offset

Pass `.offset` the number of rows to skip before returning rows.

```js
sq.from`person`.offset(8).query

{ text: 'select * from person offset $1',
  args: [8] }
```


`.offset` can be called as a template tag.

```js
sq.from`person`.offset`8`.query

{ text: 'select * from person offset 8',
  args: [] }
```

Only the last call to `.offset` is used.

```js
sq.from`person`.offset(7).offset(5).query

{ text: 'select * from person offset $1',
  args: [5] }
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

`.and` and `.or` can be chained **after** `.on`.

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

### Set Operators

Pass **select** subqueries to `.union`, `.intersect`, and `.except` to perform set operations.

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

`.union.all`, `.intersect.all`, and `.except.all` can be used to prevent duplicate elimination.

```js
Young.union.all(Old).query

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

CTEs

TODO


## Express Syntax

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

## Manipulation Queries

### Delete

*Delete* queries look like *select* queries with an additional call to `.delete`.

```js
sq.delete.from`person`.query
sq.from`person`.delete.query // equivalent

{ text: 'delete from person',
  args: [] }
```

Filter the rows to delete with `.where`

```js
sq.delete.from`person`.where`id = ${723}`.query

{ text: 'delete from person where id = $1',
  args: [723] }
```

Return the deleted rows with `.return`.

```js
sq.delete.from`person`.return`name`.query

{ text: 'delete from person returning name',
  args: [] }
```

[Express syntax](#express-syntax) works too.

```js
sq`person`({ job: 'student' })`name`.delete.query

{ text: 'delete from person where job = $1 returning name',
  args: ['student'] }
```

`.delete` is idempotent.

```js
sq`book`.delete.delete.delete.query

{ text: 'delete from book',
  args: [] }
```

When using Sqorn Postgres, the first `.from` call forms the *delete* clause. Subsequent `.from` calls form the *using* clause.

```js
sq.delete
  .from`book`
  .from`author`
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [] }
```

### Insert

`Insert` queries use `.insert` and `.value` to specify the columns and values to insert.

```js
sq.from`person`
  .insert`first_name, last_name`
  .value`${'Shallan'}, ${'Davar'}`
  .value`${'Navani'}, ${'Kholin'}`
  .query

{ text: 'insert into person (first_name, last_name) values ($1, $2), ($3, $4)',
  args: ['Shallan', 'Davar', 'Navani', 'Kholin'] }
```

You can pass `.insert` column names as strings. You must then pass`.value` corresponding row values. `undefined` values are inserted as `default`.

```js
sq.from`book`
  .insert('title', 'year')
  .value('The Way of Kings', 2010)
  .value('Words of Radiance', null)
  .value('Oathbringer')
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', null, 'Oathbringer'] }
```

When called as a template string or passed string column names, `.insert` may only be called once.

When passed an object, `.insert` can be called multiple times to insert multiple rows. Column names are inferred from examining all object keys.

```js
sq.from`book`
  .insert({ title: 'The Way of Kings', year: 2010 })
  .insert({ title: 'Words of Radiance', year: null })
  .insert({ title: 'Oathbringer' })
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', null, 'Oathbringer'] }
```

Alternatively, multiple objects may be passed to `.insert`

```js
sq.from`book`
  .insert({ title: 'The Way of Kings', year: 2010 },
          { title: 'Words of Radiance', year: null },
          { title: 'Oathbringer' })
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer'] }
```

`.return` specifies the *returning* clause. [Express syntax](#express-syntax) may be used to specify `.from` and `.return`.

```js
sq.from`book`.insert({ title: 'Squirrels and Acorns' }).return`id`.query
// or
sq`book`()`id`.insert({ title: 'Squirrels and Acorns' }).query

{ text: 'insert into book (title) values ($1) returning id',
  args: ['Squirrels and Acorns'] }
```

### Update

*Update* queries use `.set` to specify values to update. `.set` can be called multiple times.

```js
sq.from`person`.set`age = age + 1, processed = true`.set`name = ${'Sally'}`.query

{ text: 'update person set age = age + 1, processed = true, name = $1',
  args: ['Sally'] }
```

`.set` accepts an update object.

```js
sq.from`person`
  .where({ firstName: 'Matt' })
  .set({ firstName: 'Robert', nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2 where first_name = $3',
  args: ['Robert', 'Rob', 'Matt'] }
```
[Express syntax](#express-syntax) works too.

```js
sq`person`({ firstName: 'Rob' })`id`.set({ firstName: 'Robert'}).query

{ text: 'update person set first_name = $1 where first_name = $2 returning id',
  args: ['Robert', 'Rob'] }
```

Call `.set` multiple times to update additional columns.

```js
sq.from`person`
  .where({ firstName: 'Matt' })
  .set({ firstName: 'Robert' })
  .set({ nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2 where first_name = $3',
  args: ['Robert', 'Rob', 'Matt'] }
```

When using Sqorn Postgres, the first `.from` call forms the *update* clause. Subsequent `.from` calls form the *from* clause.

```js
sq.from`book`
  .from`author`
  .set({ available: false })
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [false] }
```

### Upsert

TODO

<!-- ## Complex Clauses -->

<!-- ### Where -->

<!-- TODO -->

<!-- ### Join -->

<!-- TODO -->

