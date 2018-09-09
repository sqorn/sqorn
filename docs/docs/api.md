---
id: api
title: API
sidebar_label: API
---

**This document is inaccurate, outdated and incomplete**

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

Most methods of `sq` are chainable query-building methods.

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

TODO

#### .from Explicit 

TODO

#### .from Implicit 

TODO

#### .from Table Name

TODO

#### .from Join

TODO

#### .from Subquery

TODO

##### .from

TODO

### .where

TODO

### .return

TODO

### .with

TODO

### .recursive

TODO

## Select Clauses 

### .group

TODO

### .having

TODO

### .order

TODO

### .limit

TODO

### .offset

TODO

## Delete Clauses

### .delete

TODO

## Insert Clauses

### .insert

TODO

### .value

TODO

## Update Clauses

### .set

TODO

## Query Execution

### .all

TODO

### .one

TODO

### .run

TODO

### .exs

TODO

### .query

TODO

## Operators

### .and

TODO

### .or

TODO

### .not

TODO

### .op

TODO

## Miscellaneous

### .transaction

TODO

### .end

TODO