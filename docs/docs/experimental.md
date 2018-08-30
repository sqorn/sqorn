```js
const { qry, frm, whr, ret, ord, lim } = require('sqorn')

const getTimeRange = time => {
    switch (time) {
      case 'day': return '1 day'
      case 'week': return '7 days'
      case 'month': return '30 days'
      case 'year': return '365 days'
  }
}

const getTopPosts = ({ time, topic, user, max = 25 }) => {
  const range = getTimeRange(time)
  return qry(
    frm`post`,
    user && whr({ user }),
    topic && whr({ topic }),
    range && whr`create_time >= now() - $${timeRange}`,
    ord`score asc`,
    max && lim(max),
    ret`id, name, age`
  )
}


// ex

const Post = sq(frm`post`)
const TopicPost Post({ topic }, ret`id`, lim(5), ord.dsc`score`)
```

```sql
select b.ID book_id, b.name book_name, c.name category_name, 
    (select count(*) from articles a where a.book_id = b.id) article_count
from BOOKS b
  inner join category c on c.id = b.category_id and c.kind = 'science'
where b.id >= 1 and b.id < 100 and b.name like ? and (release_date between ? and ?
        or release_date between to_date('2015-01-01', 'yyyy-mm-dd') and to_date('2016-01-01', 'yyyy-mm-dd'))
    and c.name in ('novel','horror','child')
    and (select name from author where id = b.author_id) = 'Jessica Parker'
order by c.name, b.release_date desc
```

```js
  const sub = sq`articles a``a.book_id = b.id``count(*)`

```

### create table

TODO: REVISE: EXPERIMENTAL

```javascript
const person = sq
  .tbl`person`
  .col`id`                     `serial`
                               .pk
  .col`first_name`             `text not null`
                               .idx
  .col`last_name`              `text not null`
  .col`age`                    `integer`
                               .chk`age >= 0`
  .col`mother`                 `integer`
                               .del`cascade`
                               .fk `person(id)`
  .col`father`                 `integer`
  .fk `mother`                 `person(id)`
  .chk`first_name`             `char_length(first_name) <= 320)`
  .unq`first_name, last_name, age`
  .idx`last_name`
```

```javascript
const person = sq.tbl`person`
  .col`id`                     `serial`
                               .pk
  .col`first_name`             `text not null`
                               .idx
  .col`last_name`              `text not null`
  .col`age`                    `integer`
                               .chk`age >= 0`
  .col`mother`                 `integer`
                               .del`cascade`
                               .fk `person(id)`
  .col`father`                 `integer`
  .fk `mother`                 `person(id)`
  .chk`first_name`             `char_length(first_name) <= 320)`
  .unq`first_name, last_name, age`
  .idx`last_name`
```


### transactions

```javascript
await sq.trx(async trx => {
  const created = await createSecret({ expires: '24 hours', type: 'code' }).one(trx)
  const queried = await getSecret({ secret: created.secret }).one(trx)
  const deleted = await deleteSecret({ secret: queried.secret }).one(trx)
})

```














# [Sqorn](https://sqorn.org) &middot; [![License](https://img.shields.io/github/license/eejdoowad/sqorn.svg)](https://github.com/eejdoowad/sqorn/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/sqorn.svg)](https://www.npmjs.com/package/sqorn) [![npm](https://img.shields.io/travis/eejdoowad/sqorn.svg)](https://travis-ci.org/eejdoowad/sqorn) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)


Sqorn is a Javascript library for building SQL queries.

**Composable:** Build complex queries from simple parts. Extend existing queries or embed subqueries.

**Boilerplate free:** Sqorn provides **concise** syntax for common CRUD operations.

<p style="color: red">Sqorn is in early development. The API is subject to change and not yet fully implemented.</p>

## Install

```sh
npm install --save sqorn
npm install --save pg # only Postgres is currently supported
```

Then read the [tutorial](https://sqorn.org/docs/tutorial.html).

## Examples

CRUD Operations are dead simple.

```js
const Person = sq`person`, Book = sq`book`

// SELECT
const children = await Person`age < ${13}`
// "select * from person where age < 13"

// DELETE
const [deleted] = await Book({ id: 7 })`title`.del
// "delete from book where id = 7 returning title"

// INSERT
await Person.ins({ firstName: 'Rob' })
// "insert into person (first_name) values ('Rob')"

// UPDATE
await Person({ id: 23 }).upd({ name: 'Rob' })
// "update person where id = 23 set name = 'Rob'"

```

Build complex queries from simple parts.

```js
// CHAIN CLAUSES
const Book = sq.frm`book`
const OldBooks = books.whr`publishYear < 1900`
const oldFantasyBooks = oldBooks.whr`genre = 'Fantasy'`
const numOldFantasyBooks = oldFantasyBooks.ret`count(*) count`
const { count } = await numOldFantasyBooks.one()

// BUILD NEW QUERIES FROM EXISTING QUERIES
const lang = language => sq.whr({ language })
const distinctAuthors = sq.ret`distinct author`
const oldEnglishBookAuthors = sq.use(
  oldBooks, lang('English'), distinctAuthors)
const authors = await oldEnglishBookAuthors.all()

// EMBED SUBQUERIES
const tomorrow = sq.ret`now() + '1 day'`const time = sq.ret`now() now, ${tomorrow} tomorrow`
const { now, tomorrow } = await time.one()
```

### Select

```sql
select * from book
```

```javascript
sq.frm`book`
  .ret`*`
// or
sq`book`
```

`.frm` specifies the table to query and `.ret` specifies the selected columns. If `.ret` isn't called, select queries implicitly request all columns (`*`).

Using `sq` as a template literal tag is shorthand for calling `.frm`.

### Where

```sql
select age, job from person where first_name = 'Kaladin
```

```javascript
sq.frm`person`
  .whr`first_name = ${'Kaladin'}`
  .ret`age, job`
// or
sq`person``first_name = ${'Kaladin'}``age, job`
```

`.whr` specifies the `where` clause, which filters result rows. 

All methods of `sq` escape template literal arguments, except when noted otherwise.


### Where Object

```javascript
sq.frm`book`
  .whr({ publishYear: 1984 })
// or
sq`book`({ publishYear: 1984 })
```

`.whr` also accepts object arguments. By default `sq` converts method arguments of type `Object` from `CamelCase` to `snake_case`.


### Where Compound

```sql
select * from book
where not (title = 'Oathbringer')
or (pages >= 200 and genre = 'fantasy')
```

```javascript
const title = 'Oathbringer', minPages = 200, genre = 'fantasy'

sq.frm`book`
  .whr`not (title = ${title})`
  .whr`or (pages >= ${minPages} and genre = ${genre})`
// or
sq`book`(
    sq.not({ title }),
    { minPages: sq.l`pages >= ${minPages}`, genre }
  )
// or
sq.frm`book`
  .whr(sq.not({ title }))
  .whr`or`
  .whr({ minPages: sq.l`pages >= ${minPages}`, genre })
// or
sq`book`(
  sq.or(
    sq.not(sq.op`=`('title', title))
    sq.and(
      sq.op`>=`('pages', minPages)
      sq.l`genre = ${genre}`,
    )
  )
```

**NOTE: SQL query strings generated from the calls above, though logically equivalent, may have varying parantheses and spacing.**

Conditions generated from multiple calls to `.whr` are joined with the `new line` character (`\n`).

`.whr` converts each object argument to the logical conjunction (`AND`) of the conditions represented by its properties.

`.whr` uses logical disjunction (`OR`) to join the conditions represented by each object argument.

`.not` negates one argument, `.and` conjuncts two arguments, and `.or` disjuncts two arguments.

`.op` takes a template literaly naming a binary operator and returns a function that applies the operator to its two arguments.

### and

```javascript
const author = 'Moby Dick'
const language = 'English'

q`book`.where`author = ${author} and language = ${language}`.all
// or
q`book`.where({ author, language }).all
```

```sql
select * from `books` where author = 'Moby Dick' and language = 'English'
```

### or

```javascript
const author = 'Moby Dick'
const language = 'English'
const year = 1984

q`book`.where`author = ${author} or (language = ${language} and year != ${year})`.all
// or
q`book`.where({ author }, { language, year: q.not(year) }).all
// or
q`book`.where(q.or({ author }, q.and({ language }, q.not({ year }))).all
// note
```



```sql
select * from `books` where author = 'Moby Dick' or language = 'English'
```
### manual conditions

```javascript
const minYear = 1800
const maxYear = 1984

q`book`.fil`year >= ${minYear} and year <= ${maxYear} `.all
// or
q`book`where({
  min: q.c`year >= ${minYear}`,
  max: q.c`year <= ${maxYear}`
}).all
```

```sql
select * from book where year >= 1800 and year <= 1984
```

### insert

```javascript
sq`person`
  .ins({ firstName, lastName, age })
  .one`id`
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40) returning id
sq`person`
  .ins`first_name, last_name`
  `upper(${firstName}), upper(${lastName})`
  .run
// insert into person (first_name, lastName)
// values (upper('John'), upper('Doe'))
```

### insert multiple


```javascript
const people = [{ age: 13 }, { age: null, lastName: 'jo' }, { age: 23, lastName: 'smith' }]
sq`person`
  .ins(...people)
  .all`id`
// insert into person (age, last_name)
// values (13, DEFAULT), (NULL, 'jo'), (23, 'smith') returning id
sq`person`
  .ins`last_name`
  (people, person => sq.l`upper(${person.lastName})`)
  .run
// insert into person (lastName)
// values (upper(), upper('Doe'))
sq`person`
  .ins`first_name`
  `upper(${people[0].firstName})`
  `upper(${people[1].firstName})`
  `upper(${people[2].firstName})`
  .run
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe'))
let insert = sq`person`.ins`first_name`
people.forEach(person => { insert = insert`upper(${person.firstName})` })
insert.run
```

## update

```javascript
const age = 23
const increment = 2
sq`person`({ age })`count(*)`
  .upd({ age: sq.l`age + ${increment}`, updateTime: sq.l`now()`})
// or
sq.frm`person`
  .whr`age = ${age}`
  .upd`age = age + ${increment}, update_time = now()`
  .ret`count(*)
```

```sql
update person set age = 24 where age = 23 returning count(*)
```

## upsert (insert conflict)



```sql
update person
set age = 23, first_name = 'bob'
where 
```

```javascript

```

### subquery

```javascript
q`author`.where`author_id in ${
  q`book`.where`year < 1984`.ret`author_id`
}`.run
```

```sql
select * from author where author_id in (
  select author_id from book where year < 1984
)
```

### join

```javascript
sq`person p join company c on p.employer_id = c.id``p.id = ${23}``c.name`

sq.inj`p.employer_id = c.id`(`person p`, `company c`))`p.id = ${23}``c.name`
```

```sql

```

### in, not in

```javascript

```

```sql

```


### with

```sql
with `with_alias` as (
  select * from "book" where "author" = 'Moby Dick'
)
select * from `with_alias`
```

```javascript
q`book`
q()`book`.all`title, author, year`
```

### group by

```sql
select age, count(*) from person group by age
```

```javascript
sq`person`()`age, count(*)`.grp`age`
```

### having

```sql
select age, count(*) count from person group by age having age < 18
```

```javascript
sq`person`()`age, count(*) count`.grp`age``age < 18`
```

### order by

```sql
select * from person order by last_name, first_name
```

```javascript
sq`person`.ord`last_name, first_name`
```

### limit

```sql
select * from person order by last_name limit 10 offset 7
```

```javascript
sq`person`.ord`last_name, first_name`.lim(10).off(7)
```

### offset

### transactions

```javascript
await sq.trx(async trx => {
  const created = await createSecret({ expires: '24 hours', type: 'code' }).one(trx)
  const queried = await getSecret({ secret: created.secret }).one(trx)
  const deleted = await deleteSecret({ secret: queried.secret }).one(trx)
})

```

### complex query examples






## API

### shared

#### wth

#### frm

#### whr

#### ret



### select

#### grp

#### hav

#### ord

#### lim

#### off



### delete

#### del



### insert

#### ins

#### val

### update

#### upd



### execute

#### trx: async (callback: async (trx: Transaction) => any) => any

__Description:__

  Runs the asynchronous callback function in the context of a transaction. A `Transaction` object `trx` is made available to the callback and should be passed to all queries that are part of the transaction.

__Returns:__

  the value return by the callback

#### str: () => string

__Description:__

  builds a SQL query string representing the current context

__Returns:__

  a SQL query string representation of the current context

#### run: async (trx?: Transaction) => void

__Description:__

  executes the query

__Returns:__

  a promise that resolves when the query is done

#### one: async (trx?: Transaction) => any

__Description:__

  executes the query

__Returns:__

  a promise for the first row returned by the query or `undefined` if no rows were returned

#### all: async (trx?: Transaction) => any[]

__Description:__

  Executes the query

__Returns:__

  a promise for an array of results (which may have length 0)

#### exs: async (trx?: Transaction) => boolean

__Description:__

  executes the query

__Returns:__

  a promise that resolves to true if at least one row was returned by the query, false otherwise

### Where operators

#### and

#### or

#### not



### join

#### .inj

#### .ouj

#### .lij

#### .loj

#### .rij

#### .roj

#### .naj

## Style Guide

```javascript
const firstName = 'John', lastName = 'Doe', age = 40, order = 'DESC'
sq`person`
// select * from person
sq`person`({ firstName })
// select * from person where first_name = 'John'
sq`person``age > ${age}``first_name`
// select first_name from person where age > 40
sq`person``id`.ins({ firstName, lastName, age })
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40) returning id
sq`person``id`
  .ins`first_name, last_name``upper(${firstName}), upper(${lastName})`
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe')) returning id
sq`person`({ age })`id`.del
// delete from person where age = 40 returning id
sq`person``age < ${age}`.del
// delete from person where age < 40
sq`person p join company c on p.employer_id = c.id`
  `p.id = ${23}``c.name`
// select c.name from person p join company c on p.employer_id = c.id
// where p.id = 23
sq.wit`children`(sq`person``age < ${18}`)`children`()`first_name`
// with children as (select * from "person" where age < 18)
// select first_name from children`
sq.l`name = ${firstName}`
// name = 'John' -- builds escaped SQL string
sq.ary`order by name ${order}`
// order by name DESC -- builds unescaped SQL string
const colors = sq.ret`'red', 'yellow','blue'`
sq`${colors} c`
// select * from (select 'red', 'yellow', 'blue') c
```


```javascript
const firstName = 'John', lastName = 'Doe', age = 40, order = 'DESC'
sq.frm`person`
  .ret`*`
// select * from person
sq.frm`person`
  .whr({ firstName })
// select * from person
// where first_name = 'John'
sq.frm`person`
  .whr`age > ${age}`
  .ret`first_name`
// select first_name
// from person
// where age > 40
sq.frm`person`
  .ins({ firstName, lastName, age }
  .ret`id`
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40)
// returning id
sq.frm`person`
  .col`first_name, last_name`
  .ins`upper(${firstName}), upper(${lastName})`
  .ret`id`
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe')) returning id
sq.del`person`
  .whr({ age })
  .ret`id`

// delete from person where age = 40 returning id
sq`person``age < ${age}`.del
// delete from person where age < 40
sq`person p join company c on p.employer_id = c.id`
  `p.id = ${23}``c.name`
// select c.name from person p join company c on p.employer_id = c.id
// where p.id = 23
sq`person`({ name: 'Ed' }).upd({ name: 'Edward' })
Person({ name: 'Ed' })
Person({ name: 'Ed' }).upd({ name: 'Edward', age: sq.l`age + 1` })
Person.ins({ name: 'Ed' })
Person.del({ name: 'Ed' })

sq.wit`children`(sq`person``age < ${18}`)`children`()`first_name`
// with children as (select * from "person" where age < 18)
// select first_name from children`
sq.l`name = ${firstName}`
// name = 'John' -- builds escaped SQL string
sq.ary`order by name ${order}`
// order by name DESC -- builds unescaped SQL string
```

## FAQ

### How does sqorn work?

When a method on the query builder `sq` is called, it pushes an object containing the method name and arguments to an array named `methods`.

```javascript
sq.frm`person`.whr`age > ${20} and age < ${30}`.ret`name`
// methods ===
[ { type: 'frm', args: [ [ 'person' ] ] },
  { type: 'whr', args: [ [ 'age > ', ' and age < ', '' ], 20, 30 ] },
  { type: 'ret', args: [ [ 'name' ] ] } ]

```

Certain methods like `.run` trigger the three-step compilation process:

First, the entries in `methods` are processed sequentially to build a context object `ctx`.

```javascript
// ctx === context(methods) ===
{ type: 'select',
  frm: [ [ 'person' ] ],
  whr: [ [ 'age > ', ' and age < ', '' ], 20, 30 ],
  ret: [ [ 'name' ] ] }
```

Second, a `Query` of type `ctx.type` is constructed. Each `Query` is constructed from a sequence of `clauses`, which are evaluated against `ctx`. Each clause returns an object with properties `txt` for its text component and `arg` for its parameterized arguments.

```javascript
select = Query(ctx)(
  With,   // undefined
  Select, // { txt: 'select age', arg: [] }
  From,   // { txt: 'from person', arg: []}
  Where,  // { txt: 'where age > $1 and age < $2, arg: [7, 13] }
  Group,  // undefined
  Having, // undefined
  Order,  // undefined
  Limit,  // undefined
  Offset  // undefined
)
```

Finally, the contributions from all clauses are joined together to construct a complete SQL query with parameterized arguments. This query is passed to the underlying database library for execution.

```javascript
{ txt: 'select age from person where age > $1 and age < $2' 
  arg: [7, 13] }
```



cached queries thoughts:
```js



const getSecret = ({ secret }) => sq`secret`({ secret }).prp('getSecret')

const preparedGetSecret = ({
  const prepared = getSecret().prp('getSecret')
  return ({ secret }) => prepared()
})()

sq.stm`getSecret`




```


## Roadmap

* integrate pg
* implement execution methods
* support object parameters
* complete implementation
* add query validation
* implement .str (for pg)
* write tests for everything
* table and constain creation / migration
