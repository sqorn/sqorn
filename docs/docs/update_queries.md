---
id: update-queries
title: Update Queries
sidebar_label: Update
---


* **With** [`.with`](#with), [`.recursive`](#recursive-ctes)
* **Update** [`.from`](#set)
* **Set** [`.set`](#set)
* **From** [`.from`](#from-2)
* **Where** [`.where`](#where-1), [`.and`](#and-or), [`.or`](#and-or)
* **Returning** [`.return`](#returning)

## Set

`.from` specifies the table to insert into and `.set` specifies the columns to update. [`.from`](#from-1) works as it does in delete queries.

```js
sq.from`person`
  .set`age = age + 1, name = ${'Sally'}`
  .query

{ text: 'update person set age = age + 1, name = $1',
  args: ['Sally'] }
```

`.set` can be called multiple times.

```js
sq.from`person`
  .set`age = age + 1`
  .set`name = ${'Sally'}`
  .query

{ text: 'update person set age = age + 1, name = $1',
  args: ['Sally'] }
```

`.set` accepts update objects.

```js
sq.from('person')
  .set(
    { firstName: 'Robert', nickname: 'Rob' },
    { processed: true }
  )
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

## Where

Filter the rows to update with `.where`.

```js
sq.from`person`
  .where({ firstName: 'Matt' })
  .set({ firstName: 'Robert', nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2 where (first_name = $3)',
  args: ['Robert', 'Rob', 'Matt'] }
```

[`.where`](#where) works as it does in select queries and can be chained with [`.and`](#and-or) and [`.or`](#and-or).

## From

**Postgres Only:** The first `.from` call forms the update clause. Subsequent `.from` calls form the *from* clause.

```js
sq.from`book`
  .from`author`
  .set({ available: false })
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [false] }
```

## Returning

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

## Express

[Express](#express) syntax works.

```js
sq`person`({ firstName: 'Rob' })`id`.set({ firstName: 'Robert'}).query

{ text: 'update person set first_name = $1 where first_name = $2 returning id',
  args: ['Robert', 'Rob'] }
```