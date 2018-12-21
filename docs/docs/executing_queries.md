---
id: executing-queries
title: Executing Queries
sidebar_label: Executing Queries
---

* **Execute** [`.all`](#all-rows) [`.one`](#one-row)
* **Compile** [`.query`](#manually) [`.unparameterized`](#manually)

## All Rows

`.all` executes a query and returns a Promise for an array of rows. A row is an object in the form `{ field: value }`. By default, field names are converted to [camelCase](configuration#map-output-keys).

The query builder is itself *thenable* so `.all` is optional.

```js
const People = sq.sql`select * from person`
// four ways ways to print all people:
console.log(await People.all())
console.log(await People)
People.all().then(people => console.log(people))
People.then(people => console.log(people))
```

## One Row

`.one` fetches only the first result, or `undefined` if there are no matching results. The following all print the first person (or `undefined`).

```js
const Person = sq.sql`select * from person limit 1`
// four ways ways to print the first person:
Person.one().then(person => console.log(person))
Person.all().then(people => console.log(people[0])
console.log(await Person.one())
console.log((await Person)[0])
```

## Manually

You can use `.query` to build a query, then send its text and arguments to another library for execution.

```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')

const pool = new pg.Pool()
const sq = sqorn()

const { text, args } = sq.from('book').query
pool.query(text, args).then((err, res) => { console.log(res) })
```

`.query` is a getter method that compiles the query when accessed. Don't call it twice.

Never use `.unparameterized` to build a query string. It is vulnerable to SQL injection.
