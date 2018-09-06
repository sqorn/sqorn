---
id: api
title: API
sidebar_label: API
---

**This document is currently inaccurate and incomplete**

## sqorn

Sqorn's root export `sqorn` is a function that creates a query builder instance using the provided configuration. The configuration is an object that specifies the database library, database connection details, and how queries should be constructed.

Sqorn doesn't interface directly with databases. Instead, queries and results are communicated through an underlying database library. Currently only Postgres is supported via [**node-postgres**](https://node-postgres.com/).

### node-postgres

Sqorn supports [**node-postgres**](https://node-postgres.com/). Install *node-postgres* with `npm install --save pg`.

Call `sqorn` and pass it an object with a property whose key is `pg` and whose value is the [connection configuration specified by node-postgres](https://node-postgres.com/features/connecting). The value may be `undefined` if the connection details are specified with environment variables.

```javascript
  const sqorn = require('sqorn')
  const sq = sqorn({
    pg: { connectionString: 'postgresql://postgres@localhost:5432/postgres' }
    // or {   user: 'postgres', host: 'localhost', database: 'postgres', port: 3211 }
  })
  // sq is a query builder
```

## sq

`sq` is Sqorn's query building object. All API methods are properties of `sq` unless otherwise specified. Most methods serve as [template literal tags](https://developers.google.com/web/updates/2015/01/ES6-Template-Strings).

Most methods of `sq` are chainable query-building methods. The first chainable method call on `sq` creates and returns a new query builder instance. Proceeding chainable method calls mutate and return the existing query builder instance.

Other methods of `sq` compile the existing query builder's internal state to construct a parameterized query object, which is issued to the database. These methods return a Promise for query results.

Given ```sq.from`person`.where`name = 'Bo'`.return`name`.all() ```:

* `sq` is the root query building object
* ```.from`person` ``` creates a new query builder `qb`
* ```.where`name = 'Bo'` ``` mutates `qb`
* ```.return`name` ``` mutates `qb`
* ```.all() ``` constructs a query from `qb`'s internal state

`sq` is also a function. The first call of `sq` is equivalent to calling [.from](#frm), the second  call is equivalent to calling [`whr`](#whr), and the third call is equivalent to calling [`.return`](#ret). Further calls are ignored.

The query above can be written as ```sq`person``name = 'Bo'``name`.all() ```. 

## Manual Queries

### .l

Construct a SQL query string with parameterized arguments. The query string may be a single complete query or a fragment to be embedded in other queries. All arguments are parameterized, except if the argument was built with [`sq.raw`](#.raw) or if the template string character before the argument is `$`.

#### .l Complete Query

Construct a complete SQL query:

```javascript
sq.l`select * from person where name = ${'Nynaeve'} and age = ${17}`
```
```sql
select * from person where name = $1 and age = $2
-- arg = ['Nynaeve', 17]
```

#### .l Fragment

Create query fragments to embed in other queries:

```javascript
const min = sq.l`age >= ${20}`
const max = sq.l`age < ${30}`
sq.l`select * from person where ${min} and ${max}`
```
```sql
select * from person where age >= 20 and age = age < 30
-- arg = [20, 30]
```

#### .l Raw Argument with `$` prefix

Template string arguments immediately after the `$` character are not parameterized:

```javascript
const table = 'widget_corp_product'
const shape = 'square'
sq.l`select * from $${table} where shape = ${shape}`
```
```sql
select * from widget_corp_product where shape = $1
-- arg = ['square']
```

#### .l Raw Argument with `.raw`

### .raw

Construct a SQL query string without escaping arguments. The query string may be a single complete query or a fragment to be embedded in other queries.

<span style="color: red">**To prevent SQL injection, never call `.raw` with user-supplied data</span>

#### .l Complete Query

Construct a complete SQL query:

```javascript
sq.l`select * from person where name = ${'Nynaeve'} and age = ${17}`
```
```sql
select * from person where name = $1 and age = $2
-- arg = ['Nynaeve', 17]
```

#### .l Fragment

Create query fragments to embed in other queries:

```javascript
const min = sq.l`age >= ${20}`
const max = sq.l`age < ${30}`
sq.l`select * from person where ${min} and ${max}`
```
```sql
select * from person where age >= 20 and age = age < 30
-- arg = [20, 30]
```

## Common Clauses

### .from

FROM clause - specifies the query table

Accepts a table name or a derived table (formed from subqueries or joins).

#### .from Explicit 

Call `.from` explicitly:

```typescript
sq.from`book`
```
```sql
select * from book
```

#### .from Implicit 

Calling `sq` as a function is equivalent to calling `.from`:

```typescript
sq`book`
```
```sql
select * from book
```

#### .from Table Name

Pass a table name string:

<span style="color: red">**TO AVOID SQL INJECTION, DO NOT PASS A USER-DEFINED TABLE NAME**</span>

```typescript
sq.from('book')
```
```sql
select * from book
```

#### .from Join

Call .from with a joined table:

```typescript
sq.from`book join comment on book.id = comment.book_id`
```
```sql
select * from book join comment on book.id = comment.book_id
```

#### .from Subquery

Insert a subquery into .from:

```typescript
sq`${
  sq`person``age > 17`
} as adult``adult.job = 'student'``name`
```
```sql
select name from (
  select * from person where age > 17
) as adult where adult.job = 'student'
```

##### .from Raw

To build a raw template string argument

```typescript
sq.from`$${'widget_corp_department'} natural join $${'widget_corp_order'}`
```
```sql
select * from widget_corp_department natural join widget_corp_order
```


### .where

### .return

### .with


## Select Clauses 

### .group

### .having

### .order

### .limit

### .offset


## Delete Clauses

### .delete


## Insert Clauses

### .insert

### .value


## Update Clauses

### .set



## Query Execution

### .all

: async (trx?: Transaction) => any[]

__Description:__

  Executes the query

__Returns:__

  a promise for an array of results (which may have length 0)

### .one

: async (trx?: Transaction) => any

__Description:__

  executes the query

__Returns:__

  a promise for the first row returned by the query or `undefined` if no rows were returned

### .run

: async (trx?: Transaction) => void

__Description:__

  executes the query

__Returns:__

  a promise that resolves when the query is done


### .exs

: async (trx?: Transaction) => boolean

__Description:__

  executes the query

__Returns:__

  a promise that resolves to true if at least one row was returned by the query, false otherwise

### .query

__Description:__

  Runs the asynchronous callback function in the context of a transaction. A `Transaction` object `trx` is made available to the callback and should be passed to all queries that are part of the transaction.

__Returns:__

  the value return by the callback


### .str

: () => string

__Description:__

  builds a SQL query string representing the current context

__Returns:__

  a SQL query string representation of the current context

## Operators

### .and

### .or

### .not

### .op

## Miscellaneous

### .trx

### .end
