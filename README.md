# sqorn

**sqorn** is a SQL query builder designed to make querying your database a joy. It uses tagged template literals and promises to provide a concise, elegant API. sqorn makes queries short, structured, and intuitive while providing the full power of SQL. By default, sqorn streamlines query building by making assumptions about how database entities and query arguments are named.

TODO: make express sel - whr - ret SELECT only

**CURRENT STATUS: unimplemented, just an idea**

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
  .ins({ firstName, lastName, age })
  .ret`id`
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40)
// returning id
sq.ins`person`
  .col`first_name, last_name`
  .val`upper(${firstName}), upper(${lastName})`
  .ret`id`
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe')) returning id
sq.del`person`
  .wht({ age })
  .ret`id`

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
```

# Index

* [Install](#install)
* [Examples](#examples)
* [API](#api)
* [Grammar](#grammar)
* [Roadmap](#roadmap)

## Install

```sh
npm install --save sqorn
```

```javascript
const sqorn = require('sqorn')
const q = sqorn({ url: `postgres://some.where` })
```

## Examples

### sql query

Create a `person` table

```sql
create table person (
  id          SERIAL PRIMARY KEY,
  firstName   TEXT,
  lastName    TEXT,
  age         INTEGER
)
```

```javascript
sq.l`
  create table person (
    id          SERIAL PRIMARY KEY,
    firstName   TEXT,
    lastName    TEXT,
    age         INTEGER
  )
`.run
```

`q.sql` creates a single complete query. Execution is delayed until `.run` is called. `.run` returns a promise that resolves when the query is complete.

### select

```sql
select * from book
```

```javascript
q`book`.ret`*`.all
// or
q`book`.all`*`
// or
q`book`.all

// returns
Promise<book[]>
```

Return a promise for an array of all columns of all books
If none are found, returns a promise for an empty array.
Return values will be in snake case

### select columns

```javascript
q`book`.ret`title, author, year`.all
// or
q`book`.all`title, author, year`
```

```sql
select `title`, `author`, `year` from `books`
```

### where

```javascript
const title = 'Moby Dick'

q`book`.where`title = ${title}`.all
// or
q`book`.where({ title }).all
// or
q`book``title = ${title}`.all
// or
q`book`({ title }).all

```

```sql
select * from book where title = 'Moby Dick'
```

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
sq`person``count(*)`({ age }).upd({ age: age + 1})
```

```sql
update person set age = 24 where age = 23
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



## API

### shared

#### wit

#### rec

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



### update



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

#### exi: async (trx?: Transaction) => boolean

__Description:__

  executes the query

__Returns:__

  a promise that resolves to true if at least one row was returned by the query, false otherwise

#### ctx: () => Context

__Description:__

  returns the query builder's internal context

__Returns:__

  returns the query builder's internal context

### where

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



## Grammar

```
QUERY  ->   SELECT
       ->   DELETE
       ->   INSERT
       ->   UPDATE

WITH   ->   .wit  [ .rec ] [ __alias__  QUERY ]+

SELECT -> [ WITH                                 ]
                     __table__
          [          __where__    [ __return__ ] ]
          [ .grp     __group__    [ __having__ ] ]
          [ .ord     __order__                   ]
          [ .lim     __limit__                   ]
          [ .off     __offset__                  ]

DELETE -> [ WITH                                 ]
                     __table__
          [          __where__    [ __return__ ] ]
            .del

INSERT -> [ WITH                                 ]
  TODO

UPDATE -> [ WITH                                 ]
  TODO               __table__
          [          __where__    [ __return__ ] ]
          [ .upd  ]
```

## Roadmap

* design api
* build prototype
* connect to node-postgres
* find someone else to takeover =)
* write tests
