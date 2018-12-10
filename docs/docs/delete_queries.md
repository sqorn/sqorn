---
id: delete-queries
title: Delete Queries
sidebar_label: Delete
---

* **With** [`.with`](#with), [`.recursive`](#recursive-ctes)
* **Delete** [`.delete`](#delete)
* **From** [`.from`](#from-1)
* **Using** [`.from`](#using-1)
* **Where** [`.where`](#where-1), [`.and`](#and-or), [`.or`](#and-or)
* **Returning** [`.return`](#returning)

## Delete

Delete queries look like select* queries with an additional call to `.delete`.

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

## From

[`.from`](#from) works as it does in select queries.

However, be aware of certain SQL constraints Sqorn does not yet enforce.

* Delete queries require exactly one, named table.
* The table may not be a subquery or expression.
* Joins are not allowed.

Reference more than one table by using:

* Subqueries in the *Where* clause
* With clause (CTE) join tables
* Dialect-specific SQL extensions

## Using

**Postgres Only:** The first `.from` call forms the delete clause. Subsequent `.from` calls form the *using* clause.

```js
sq.delete
  .from`book`
  .from`author`
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [] }
```

## Where

Filter the rows to delete with `.where`.

```js
sq.delete.from`person`.where`id = ${723}`.query

{ text: 'delete from person where id = $1',
  args: [723] }
```

[`.where`](#where) works as it does in select queries and can be chained with [`.and`](#and-or) and [`.or`](#and-or).

## Returning

**Postgres Only:** Return the deleted rows with [`.return`](#select).

```js
sq.delete.from`person`.return`name`.query

{ text: 'delete from person returning name',
  args: [] }
```

## Express

[Express](#express) syntax works.

```js
sq`person`({ job: 'student' })`name`.delete.query

{ text: 'delete from person where job = $1 returning name',
  args: ['student'] }
```