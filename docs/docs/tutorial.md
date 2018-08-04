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

## Basic Queries

`sq` is the query-building interface. It has methods for building and executing SQL queries. Query-building methods are chainable and callable as template literal tags.
### Manual

Construct a query manually with `sq.l`. 

```js
const minAge = 20, maxAge = 30
const getPeople = sq.l`select * from person where age >= ${minAge} and age < ${maxAge}`
```

Sqorn compiles this to a parameterized query safe from SQL injection. `.qry` returns the compiled query object.

```js
getPeople.qry

{ txt: 'select * from person where age >= $1 and age < $2`',
  arg: [20, 30] }
```

Execute the query and get back a Promise for all result rows with `.all`

```js
const people = await getPeople.all()
```

When you need a raw unparameterized argument, prefix it with `$`.

```js
sql`select * from $${'test_table'}`.qry

{ txt: 'select * from test_table',
  arg: [] }
```


### Select

#### From

The simplest `select` query gets all rows from a table. Specify a `from` clause with `.frm`.

```js
sq.frm`book`.qry

{ txt: 'select * from book',
  arg: [] }
```

`.frm` also accepts raw string arguments. To prevent SQL injection, do not pass user-provided table names.

```js
sq.frm('book', 'author').qry

{ txt: 'select * from book, author',
  arg: [] }
```

The argument may be a joined table.

```js
sq.frm`book left join author on book.author_id = author.id`.qry

{ txt: 'select * from book left join author on book.author_id = author.id',
  arg: [] }
```

#### Where

Filter result rows by adding a `where` clause with `.whr`.

```js
const genre = 'Fantasy', year = 2000
sq.frm`book`.whr`genre = ${genre} and year = ${minYear}`.qry

{ txt: 'select * from book where genre = $1 and year = $2',
  arg: ['Fantasy', 2000] }
```

It is sometimes easier to specify conditions with an object.

```js
sq.frm`book`.whr({ genre: 'Fantasy', year: 2000 }).qry

{ txt: 'select * from book where genre = $1 and year = $2',
  arg: ['Fantasy', 2000] }
```

By default keys are converted from `CamelCase` to `snake_case`.

```js
sq.frm`person`.whr({ firstName: 'Kaladin' }).qry

{ txt: 'select * from person where first_name = $1',
  arg: ['Kaladin'] }
```

[Advanced Queries - Where](#where-1) explains how to build complex `where` conditions.

#### Returning

Specify selected columns with `.ret`.

```js
sq.frm`book`.ret`title, author`.qry

{ txt: 'select title, author from book',
  arg: [] }
```

`.ret` also accepts raw string arguments. To prevent SQL injection, do not pass user-provided column names.

```js
sq.frm`book`.ret('title', 'author').qry

{ txt: 'select title, author from book',
  arg: [] }
```

#### Express Syntax

The first, second, and third calls of `sq` are equivalent to calling `.frm`, `.whr`, and `.ret` respectively.

The following are sets of equivalent queries:

```js
const name = 'Dalinar'

sq`person`
sq('person')
sq.frm`person`

sq`person``name = ${name}`
sq`person`({ name })
sq.frm`person`.whr`name = ${name}`

sq`person``name = ${name}``age`
sq.frm`person`.whr`name = ${name}`.ret`age`
sq.frm('person').whr({ name }).ret('age')
```

#### Additional Clauses

The [Advanced Queries](#advanced-queries) advanced queries section explains how to build [`with`](#with), [`having`](#having-and-group-by), [`group by`](#having-and-group-by), [`limit`](#limit-and-offset), and [`offset`](#limit-and-offset) clauses.

### Delete

`Delete` queries look like `Select` queries with an additional call to `.del`.

```js
sq.frm`person`.del.qry
sq.del.frm`person`.qry // equivalent

{ txt: 'delete * from person'
  arg: [] }
```

Filter the rows to delete with `.whr`

```js
const id = 723
sq.frm`person`.whr`id = ${id}`.del.qry

{ txt: 'delete * from person where id = $1'
  arg: [723] }
```

Return the deleted rows with `.ret`

```js
const id = 723
sq.frm`person`.ret`name`.del.qry

{ txt: 'delete * from person returning name'
  arg: [723] }
```

[Express syntax](#express-syntax) works too.

```js
sq`person`({ job: 'student' })`name`.del.qry

{ txt: 'delete * from person where job = $1 returning name'
  arg: ['student'] }
```

### Insert

### Update

### Express

## Advanced Queries

### Where

### Join

### Upsert

### Having and Group By

### Limit and Offset

### Subqueries

### With (CTEs)

## Transactions
