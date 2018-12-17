---
id: about
title: About
sidebar_label: About
---

Sqorn is a Javascript library *engineered* for building SQL queries. Its API is fluent, declarative, intuitive and flexibile. Sqorn queries are immutable values, letting you construct complex queries by composing simple parts. Sqorn compiles queries [10x faster](/benchmarks.html) than Knex and [200x faster](/benchmarks.html) than Squel. Sqorn generates parameterized queries safe from SQL injection. Securely integrate raw SQL using Sqorn's [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).

Sqorn has Typescript definitions but limited type-safety. You do not define models and relationships. You just write queries. It is your responsibility to ensure the queries are valid.

Sqorn provides three interoperable mechanisms for building queries: a SQL Query Builder, a Manual Query Builder and an Expression Builder.

## SQL Query Builder

Build [Select](select-queries), [Delete](delete-queries), [Insert](insert-queries) and [Update](update-queries) queries using methods based on SQL clauses.

```js
sq.return({ authorId: 'a.id', name: 'a.last_name' })
  .distinct
  .from({ b: 'book' })
  .left.join({ a: 'author' }).on`b.author_id = a.id`
  .where({ title: 'Oathbringer' }, { title: 'The Eye of the World' })
  .query

{ text: 'select distinct a.id as authorid, a.last_name as name from book as b left join author a on b.author_id = a.id where (title = $1) or (title = $2)',
  args: ['Oathbringer', 'The Eye of the World'] }
```

## Manual Query Builder

For maximum flexibility, build queries [manually](manual-queries) using tagged template literals.

```js
sq.sql`select a.author_id, json_agg(b.*)`
  .sql`from author a`
  .sql`left join book b using (author_id)`
  .sql`where a.last_name like ${'[S]%'}`
  .sql`group by a.author_id`
  .sql`having ${sq.txt`count(*) > `.txt(5)}}`
  .query

{ text: 'select a.author_id, json_agg(b.*) from author a left join book b using (author_id) where a.last_name like $1 group by a.author_id having count(*) > $2',
  args: ['[S]%', 5] }
```

## Expression Builder

Build complex conditions and operations with the fluent, typed, functional [expression builder](expressions).

```js
sq.from('book')
  .where(
    e`id`.eq(
      e.add(3, 20).subtract(5)
    ).or(
      e.eq`genre`('Fantasy').not,
      e.in`title`(['1984', 'Moby Dick', 'Oathbringer'])
    )
  )
  .query

{ text: 'select * from book where ((id = (($1 + $2) - $3)) or (not (genre = $4)) or (title in ($5, $6, $7)))',
  args: [3, 20, 5, 'Fantasy', '1984', 'Moby Dick', 'Oathbringer'] }
```
