---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## Setup

### Install

Use npm to install Sqorn and your preferred database library.

```sh
npm install --save sqorn
npm install --save pg # postgres is the only database currently supported
```


### Initialize

Create a query building instance connected to your database. Here, we connect to a local Postgres server:

```javascript
const sq = require('sqorn')({
  pg: {
    connectionString: 'postgresql://postgres@localhost:5432/postgres'
  }
})
```

`sq` is the query-building interface. It has methods for building and executing SQL queries. 

Query-building methods are chainable. They return an new, updated, immutable query-building instance. All methods can be called as either regular functions or as template literal tags.

Execution methods return a Promise for results. 

## Manual Queries

Construct a query manually with `sq.l`. 

```js
const minAge = 20, maxAge = 30
const getPeople = sq.l`select * from person where age >= ${minAge} and age < ${maxAge}`
```

Sqorn compiles this to a parameterized query safe from SQL injection. `.query` returns the compiled query object.

```js
getPeople.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

Execute the query and get back a Promise for all result rows with `.all`. The query builder is itself *thenable* so `.all` is optional. The following all print an array of people in the database.

```js
getPeople.all().then(people => console.log(people))
getPeople.then(people => console.log(people))
console.log(await getPeople.all())
console.log(await getPeople)
```

Call `.one` to fetch only the first result, or `undefined` if there are no matching results. The following all print the first person (or `undefined`).

```js
getPeople.one().then(person => console.log(person))
getPeople.all().then(people => console.log(people[0])
console.log(await getPeople.one())
console.log((await getPeople)[0])
```

When you need a raw unparameterized argument, prefix it with `$`.

```js
sq.l`select * from $${'test_table'}`.query

{ text: 'select * from test_table',
  args: [] }
```

`sq.l` also accepts a raw sql string argument.

```js
sq.l('select * from person where age >= 20 and age < 30').query

{ text: 'select * from person where age >= 20 and age < 30',
  args: [] }
```

When called multiple times, `sq.l` results are joined together with spaces.

```js
sq.l`select * from person`.l`where age >= ${20}`.l`and age < ${30}`.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

## Select Queries

### From

The simplest `select` query gets all rows from a table. Specify a `from` clause with `.from`.

```js
sq.from`book`.query

{ text: 'select * from book',
  args: [] }
```

`.from` also accepts raw string arguments. To prevent SQL injection, do not pass user-provided table names.

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

Only the last call to `.from` is used.

```js
sq.from`book`.from`person`.query

{ text: 'select * from person',
  args: [] }
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

If you need a non-equality condition, add a property whose value is created with `sq.l`. the property's key will be ignored.

```js
const condMinYear = sq.l`year >= ${20}`
const condMaxYear = sq.l`year < ${30}`
sq.from`person`.where({ condMinYear, condMaxYear }).query

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

### Returning

Specify selected columns with `.return`.

```js
sq.from`book`.return`title, author`.query

{ text: 'select title, author from book',
  args: [] }
```

`.return` also accepts raw string arguments. To prevent SQL injection, do not pass user-provided column names.

```js
sq.from`book`.return('title', 'author').query

{ text: 'select title, author from book',
  args: [] }
```

Only the last call to `.return` is used.

```js
sq.from`book`.return('title', 'author').return`id`.query

{ text: 'select title, author, id from book',
  args: [] }
```

### Express Syntax

The first, second, and third calls of `sq` are equivalent to calling `.from`, `.where`, and `.return` respectively.

The following are sets of equivalent queries:

```js
const name = 'Dalinar'

sq`person`
sq('person')
sq.from`person`

sq`person``name = ${name}`
sq`person`({ name })
sq.from`person`.where`name = ${name}`

sq`person``name = ${name}``age`
sq.from`person`.where`name = ${name}`.return`age`
sq.from('person').where({ name }).return('age')
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

### Upsert

TODO

## Composing Queries

### Subqueries

TODO

### Extend Queries

TODO

### With (CTEs)

TODO

## Complex Clauses

### Where

TODO

### Join

TODO

<!-- `.jni`, `.jnf`, `.jnl`, `.jnr`, `.jnn`, `.jnc` -->
<!-- `.ijn`, `.fjn`, `.ljn`, `.rjn`, `.njn`, `.cjn` -->

#### (Inner) Join

<!-- `.jni` takes a table to join and returns a function that expects a `where` condition to join on. -->

<!-- ```js
sq.from`book`
  .inj`author`.on`book.author_id = author.id`
  .where`book.title = ${'OathBringer'}`
  .return`author.first_name, author.last_name`
``` -->

TODO

#### Full (Outer) Join

TODO

#### Left (Outer) Join

TODO

#### Right (Outer) Join

TODO

#### Natural Join

TODO

#### Cross Join

TODO

## Transactions

`.trx` starts a transaction. It can be called in two ways:

### Transaction Callback

The easiest way to execute queries within a transaction is to pass `.trx` an asynchronous callback. If any query within the callback fails, all will be rolled back.

Make sure to pass all queries the transaction object `trx` or they won't be executed in the context of the transaction.

```js
await sq.trx(async trx => {
  const { id } = await Account.insert({ email: 'jo@jo.com' }).one(trx)
  await Authorization.insert({ accountId: id, password: 'secret' }).run(trx)
})
```

### Transaction Value

If you need more flexibility, call `.trx` without any arguments and it will return a transaction object `trx`.

Pass `trx` to a query to add it to a transaction. When you're done, call `trx.commit()`. If there is an error, call `trx.rollback()`.

```js
let trx
try {
  trx = await sq.trx()
  const { id } = await Account.insert({ email: 'jo@jo.com' }).one(trx)
  await Authorization.insert({ accountId: id, password: 'secret' }).run(trx)
  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```
