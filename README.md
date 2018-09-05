# [<img src="https://raw.githubusercontent.com/lusakasa/sqorn/master/docs/website/static/img/logo_blue.svg?sanitize=true" height="38px"/> <span style="color: #2979f">Sqorn</span>](https://sqorn.org) &middot; [![License](https://img.shields.io/github/license/lusakasa/sqorn.svg)](https://github.com/lusakasa/sqorn/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/sqorn.svg)](https://www.npmjs.com/package/sqorn) ![Supports Node 8+](https://img.shields.io/node/v/sqorn.svg) [![npm](https://img.shields.io/travis/lusakasa/sqorn.svg)](https://travis-ci.org/lusakasa/sqorn) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Sqorn is a Javascript library for building SQL queries.

**Composable:** Build complex queries from simple parts. Combine, extend, and embed queries.

**Boilerplate free:** Sqorn provides **concise** syntax for common CRUD operations.

**Fast:** About 10x faster than [Knex.js](https://knexjs.org/)

## Install

Sqorn requires Node version 8 or above.

```sh
npm install --save sqorn
npm install --save pg # only Postgres is currently supported
```

Then read the [tutorial](https://sqorn.org/docs/tutorial.html) and [try the online demo](https://sqorn.org/demo.html).

## Examples

CRUD Operations are dead simple.

```js
const Person = sq`person`, Book = sq`book`

// SELECT
const children = await Person`age < ${13}`
// "select * from person where age < 13"

// DELETE
const [deleted] = await Book.del({ id: 7 })`title`
// "delete from book where id = 7 returning title"

// INSERT
await Person.ins({ firstName: 'Rob' })
// "insert into person (first_name) values ('Rob')"

// UPDATE
await Person({ id: 23 }).set({ name: 'Rob' })
// "update person where id = 23 set name = 'Rob'"

```

Build complex queries from simple parts.

```js
// CHAIN CLAUSES
const OldBooks = sq.frm`book`.whr`publish_year < 1900`
const OldFantasyBooks = OldBooks.whr`genre = 'Fantasy'`
const NumOldFantasyBooks = OldFantasyBooks.ret`count(*) num`
const [{ num }] = await NumOldFantasyBooks
// select count(*) num from book
// where publish_year < 1900 and genre = 'Fantasy'

// BUILD NEW QUERIES FROM EXISTING QUERIES
const Language = language => sq.whr({ language })
const DistinctAuthors = sq.ret`distinct author`
const OldEnglishBookAuthors = sq.ext(
  OldBooks,
  Language('English'),
  DistinctAuthors,
)
const authors = await OldEnglishBookAuthors
// select distinct author from book
// where publish_year < 1900 and language = 'English'

// EMBED SUBQUERIES
const tomorrow = sq.ret`now() + '1 day'`
const times = sq.ret`now() today, ${tomorrow} tomorrow`
const [{ now, tomorrow }] = await time
// select now() today, (select now() + '1 day') tomorrow
```

Learn more in the [tutorial](https://sqorn.org/docs/tutorial.html).

## License

MIT Licensed, Copyright (c) 2018 Sufyan Dawoodjee
