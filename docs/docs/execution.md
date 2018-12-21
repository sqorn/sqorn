---
id: execution
title: Execution
sidebar_label: Execution
---

* **Execute** [`.all`](#all) [`.first`](#first) [`.one`](#one) [`.run`](#run)
* **Compile** [`.query`](#manually) [`.unparameterized`](#manually)

## All

`.all` executes a query and returns a Promise for a Row array.

A Row is an object in the form `{ field: value }`. Field names are converted to [camelCase](configuration#map-output-keys) by default.

```js
await sq.sql`select id, first_name, last_name from person`.all()

[ { id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' },
  { id: 2, firstName: 'Shallan', lastName: 'Davar' },
  { id: 3, firstName: 'Dalinar', lastName: 'Kholin' } ]
```

## First

`.first` executes a query and returns a Promise for the first result row. `.first` returns `undefined` if there are no results.

```js
await sq.sql`select id, first_name, last_name from person`.first()

{ id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' }

await sq.sql`select id, first_name, last_name from person where false`.first()

undefined
```

## One

`.one` executes a query and returns a Promise for the first result row. `.one` throws an error if there are no results.

```js
await sq.sql`select id, first_name, last_name from person`.one()

{ id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' }

await sq.sql`select * from person where false`.one()

// throws error
```

## Run

`.run` executes a query and returns a void Promise that resolves when a query is done.

```js
await sq.sql`insert into person(first_name, last_name) values (${'Jasnah'}, ${'Kholin'})`.run()
```

## Query

You can use `.query` to build a query, then send its text and arguments to another library for execution.

```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')

const pool = new pg.Pool()
const sq = sqorn()

const { text, args } = sq.sql`select * from book`.query
await pool.query(text, args)
```

`.query` is a getter method that compiles a query when accessed.

## Unparameterized

`.unparameterized` generates an unparameterized query string.  **To prevent SQL injection, never use this method.**


```js
const sqorn = require('@sqorn/pg')
const sq = sqorn()

sq.sql`select * from book where title = ${'Oathbringer'}`.unparameterized

"select * from book where title = 'Oathbringer'"
```