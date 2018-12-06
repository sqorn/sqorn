---
id: manual-queries
title: Manual Queries
sidebar_label: Manual Queries
---

* **Build** [`.sql`](#sql-queries), [`.raw`](#sql-queries), [`.txt`](#text-fragments), [`.extend`](#extend), [`.link`](#link)
* **Compile** [`.query`](#sql-queries), [`.unparameterized`](#sql-queries).

## SQL Queries

Build SQL queries manually with `.sql`.

```js
const min = 20, max = 30
const People = sq.sql`select * from person where age >= ${min} and age < ${max}`
```

Sqorn compiles this to a parameterized query safe from SQL injection. `.query` returns the compiled query object.

```js
People.query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

`.unparameterized` compiles to an unparameterized query string.

**To prevent SQL injection, do not use this method.**

```js
People.unparameterized

'select * from person where age >= 20 and age < 30'
```

When you need a raw unparameterized argument, prefix it with `$`.

```js
sq.sql`select * from $${'test_table'} where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

Alternatively, wrap the argument in a call to `.raw`.

```js
sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`.query

{ text: 'select * from test_table where id = $1',
  args: [7] }
```

Javascript `null` maps to SQL `null`.

```js
sq.sql`select ${null}`.query

{ text: 'select $1',
  args: [null] }
```

`undefined` arguments are invalid.

```js
sq.sql`select ${undefined}`.query

// throws error
```

Multiple `.sql` calls are [joined with spaces by default](#link).

```js
sq.sql`select *`
  .sql`from person`
  .sql`where age >= ${20} and age < ${30}`
  .query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

Sqorn's query builder is immutable.

```js
const select = sq.sql`select *`
const person = select.sql`from person`
const book = select.sql`from book`

select.query // { text: 'select *', args: [] }
person.query // { text: 'select * from person', args: [] }
book.query // { text: 'select * from book', args: [] }
```

Sqorn automatically parenthesizes subqueries.

```js
const One = sq.sql`select ${1}`
const Two = sq.sql`select ${2}`
sq.sql`select ${One},`.sql(Two).query

{ text: 'select (select $1), (select $2)',
  args: [1, 2] }
```

Call `.sql` as a function to parameterize an argument or build a subquery.

```js
sq.sql`select * from`
  .sql(sq.raw('person'))
  .sql`where age =`
  .sql(sq.sql`select`.sql(20))
  .query

{ text: 'select * from person where age = (select $1)',
  args: [20] }
```

Use `.sql` to build *complete* queries, not fragments.

## Text Fragments

Build query fragments with `.txt`. Sqorn does not automatically paranthesize embedded fragments.

```js
const Where = sq.txt`where age >= ${20}`
sq.sql`select * from person ${Where}`.query

{ text: 'select * from person where age >= $1',
  args: [20, 30] }
```

Like `.sql`, `.txt` can be chained and called as a function.

```js
const FromWhere = sq.txt`from person`.txt`where age >=`.txt(20)
sq.sql`select * ${FromWhere}`.query

{ text: 'select * from person where age = $1',
  args: [20] }
```

However, attempting to build a fragment will throw an error.

```js
sq.txt`select 1`.query

// throws error
```

Mixing calls to `.sql` and `.txt` is invalid.

## Extend

Create a query from query parts with `.extend`.

```js
sq.extend(
  sq.sql`select *`,
  sq.sql`from person`,
  sq.sql`where age >= ${20} and age < ${30}`
).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

TODO: `.extend` also accepts an array of queries.

```js
sq.extend([
  sq.sql`select * from person where age >= ${20}`
  sq.sql`and age < ${30}`
]).query

{ text: 'select * from person where age >= $1 and age < $2',
  args: [20, 30] }
```

## Link

`.link` specifies the separator used to join query parts.

```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
const value = book => sq.txt`(${book.id}, ${book.title})`
const values = sq.extend(books.map(value)).link(', ')
sq.sql`insert into book(id, title)`.sql`values ${values}`.link('\n').query

{ text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
  args: [1, '1984', 2, 'Dracula'] }
```
