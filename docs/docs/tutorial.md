---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## About

Sqorn is a Javascript library *designed* for building SQL queries. Its declarative API lets you construct SQL queries from immutable, composable parts.

Sqorn's query building methods are modeled after SQL clauses but harness Javascript language features to provide an elegant interface to your database. 

Unlike other query builders, Sqorn does not compromise flexibility for abstraction. It exposes the unique features of each supported SQL dialect and lets you integrate raw SQL securely using tagged template literals.

Sqorn makes common CRUD operations so simple that people have accused it of being an ORM, parameterizes all queries so you can be confident your appliction is not vulnerable to SQL injection, and compiles queries [10x faster](https://sqorn.org/benchmarks.html) than [Knex](https://knexjs.org/) and [200x faster](https://sqorn.org/benchmarks.html) than [Squel](https://github.com/hiddentao/squel). 

Use Sqorn.

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

### Join

Pass `.join` the string separator to join query parts

```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
const value = book => sq.l`(${book.id}, ${book.title})`
const values = sq.extend(...books.map(value)).join(', ')
sq.l`insert into book(id, title)`.l`values ${values}`.join('\n').query

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

`.transaction` returns the (Promise) value returned by its callback. If a query fails or an error is thrown, all queries will be rolled back and `.transaction` will throw an error.


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

The simplest `select` query gets all rows from a table. Specify a `from` clause with `.from`.

```js
sq.from`book`.query

{ text: 'select * from book',
  args: [] }
```

`.from` also accepts raw string table names. **To prevent SQL injection, do not pass user-provided table names.**

```js
sq.from('book', 'author').query

{ text: 'select * from book, author',
  args: [] }
```

The argument may be a joined table.

```js
sq.from`book left join author on book.author_id = author.id`.query

{ text: 'select * from book left join author on book.author_id = author.id',
  args: [] }
```

Multiple `.from` calls are joined with `', '`.

```js
sq.from`book`.from`person`.query

{ text: 'select * from book, person',
  args: [] }
```

You can pass `.from` an object whose keys are table aliases and whose values are table sources.

Table sources can be strings. **To prevent SQL injection, do not pass user-provided table names.**

```js
sq.from({ b: 'book', p: 'person' }).query

{ text: 'select * from book as b, person as p',
  args: [] }
```

Table sources can be arrays of objects.

```js
sq.from({ people: [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }] }).query

{ text: 'select * from (values ($1, $2), ($3, $5) as people(age, name))',
  args: [8, 'Jo', 9, 'Mo'] }
```

Table sources can be subqueries.

```js
// a postgres only query:
sq.from({ countDown: sq.l`unnest(${[3, 2, 1]})` }).query

{ text: 'select * from unnest($1) as count_down',
  args: [[3, 2, 1]] }
```

### Where

Filter result rows by adding a `where` clause with `.where`.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.query

{ text: 'select * from book where genre = $1',
  args: ['Fantasy'] }
```

Multiple `.where` calls are joined with `and`.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`.query

{ text: 'select * from book where genre = $1 and year = $2',
  args: ['Fantasy', 2000] }
```

It is sometimes easier to specify conditions with an object.

```js
sq.from`book`.where({ genre: 'Fantasy', year: 2000 }).query

{ text: 'select * from book where genre = $1 and year = $2',
  args: ['Fantasy', 2000] }
```

By default keys are converted from `CamelCase` to `snake_case`.

```js
sq.from`person`.where({ firstName: 'Kaladin' }).query

{ text: 'select * from person where first_name = $1',
  args: ['Kaladin'] }
```

If you need a non-equality condition, add a property whose value is created with `sq.l`. The property's key will be ignored.

```js
const minYear = sq.l`year >= ${20}`
const maxYear = sq.l`year < ${30}`
sq.from`person`.where({ minYear, maxYear }).query

{ text: 'select * from person where year >= $1 and year < $2',
  args: [20, 30] }
```

Multiple objects passed to `.where` are joined with `or`.

```js
sq.from`person`.where({ name: 'Rob' }, { name: 'Bob' }).query

{ text: 'select * from person where name = $1 or name = $2',
  args: ['Rob', 'Bob'] }
```

[Advanced Queries - Where](#where-1) explains how to build complex `where` conditions.

### Select

Specify selected columns with `.return`.

```js
sq.return`${1} as a, ${2} as b, ${1} + ${2} as sum`.query

{ text: 'select $1 as a, $2 as b, $3 + $4 as sum',
  args: [1, 2, 1, 2] }
```

`.return` also accepts raw string column names. **To prevent SQL injection, do not pass user-provided column names.**

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

You can pass `.return` an object whose keys are output names and whose values are expressions.

Expressions can be strings. **To prevent SQL injection, do not pass user-provided expressions.**

```js
sq.from`person`.return({ firstName: 'person.first_name' , age: 'person.age' }).query

{ text: 'select person.first_name as first_name, person.age as age from person',
  args: [] }
```

Expressions can be subqueries.

```js
sq.return({ sum: sq.l`${2} + ${3}` }).query

{ text: 'select ($1 + $2) as sum',
  args: [2, 3] }
```

### Group By

TODO, only template string form works

### Having

TODO, only template string form works

### Order By

TODO, only template string form works

### Limit

TODO, only template string form works

### Offset

TODO, only template string form works

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

`Delete` queries look like `Select` queries with an additional call to `.delete`.

```js
sq.from`person`.delete.query
sq.delete.from`person`.query // equivalent

{ text: 'delete from person',
  args: [] }
```

Filter the rows to delete with `.where`

```js
sq.from`person`.where`id = ${723}`.delete.query

{ text: 'delete from person where id = $1',
  args: [723] }
```

Return the deleted rows with `.return`

```js
sq.from`person`.return`name`.delete.query

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

When using Sqorn Postgres, the first `.from` call forms the `DELETE` clause. Subsequent `.from` calls form the `USING` clause.

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

You can pass `.insert` column names as strings. You must then pass`.value` corresponding row values. `null` values are inserted as `NULL` while `undefined` values are inserted as `DEFAULT`.

```js
sq.from`book`
  .insert('title', 'year')
  .value('The Way of Kings', years[0])
  .value('Words of Radiance', null)
  .value('Oathbringer')
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, NULL), ($4, DEFAULT)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer'] }
```

When called as a template string or passed string column names, `.insert` may only be called once.

When passed an object, `.insert` can be called multiple times to insert multiple rows. Column names are inferred from examining all object keys.

```js
sq.from`book`
  .insert({ title: 'The Way of Kings', year: 2010 })
  .insert({ title: 'Words of Radiance', year: null })
  .insert({ title: 'Oathbringer' })
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, NULL), ($4, DEFAULT)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer'] }
```

Alternatively, multiple objects may be passed to `.insert`

```js
sq.from`book`
  .insert({ title: 'The Way of Kings', year: 2010 },
       { title: 'Words of Radiance', year: null },
       { title: 'Oathbringer' })
  .query

{ text: 'insert into book (title, year) values ($1, $2), ($3, NULL), ($4, DEFAULT)',
  args: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer'] }
```

`.return` specifies the returning clause. [Express syntax](#express-syntax) may be used to specify `.from` and `.return`.

```js
sq.from`book`.insert({ title: 'Squirrels and Acorns' }).return`id`.query
// or
sq`book`()`id`.insert({ title: 'Squirrels and Acorns' }).query

{ text: 'insert into book (title) values ($1) returning id',
  args: ['Squirrels and Acorns'] }
```

### Update

`Update` queries use `.set` to specify values to update. `.set` can be called multiple times.

```js
sq.from`person`.set`age = age + 1, processed = true`.set`name = ${'Sally'}`.query

{ text: 'update person set age = age + 1, processed = true, name = $1',
  args: ['Sally'] }
```

`.set` also accepts an update object.

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

When using Sqorn Postgres, the first `.from` call forms the `UPDATE` clause. Subsequent `.from` calls form the `FROM` clause.

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

## Joins


### Inner

`.innerJoin`

TODO

### Full

`.fullJoin`

TODO

### Left

`.leftJoin`

TODO

### Right

`.rightJoin`

TODO

### Natural

`.naturalJoin`

TODO

### Cross

`.crossJoin`

TODO

## Operations

### And, Or, Not

TODO

### Binary Operations

TODO

### N-ary Operations

TODO
