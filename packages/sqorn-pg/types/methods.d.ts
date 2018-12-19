import { SQ, SQF, SQW, SQR } from './sq'

type Expression = string | SQ
type Value = { [column: string]: any }
type Row = { [column: string]: any }
type Conditions = (SQ | { [field: string]: SQ | any })[]
type Simplify<T> = {[key in keyof T]: T[key]};

export interface With {
  /**
   * **WITH clause** - table arguments
   * 
   * Constructs a Common Table Expression (CTE)
   *
   * A table is an object where each key is an alias and each value may be:
   *   * a subquery
   *   * an array of data values
   * 
   * Call `.withRecursive` to make the CTE recursive.
   * 
   * Multiple calls to `.with` are joined with ', '.
   * 
   * @example
```js
sq.with({
    width: sq.return({ n: 10 }),
    height: sq.sql`select ${20} as n`
  })
  .return({ area: sq.txt`width.n * height.n`})
// with width as (select 10 as n), height as (select 20 as n)
// select width.n * height.n as area

const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
sq.with({ people }).return('max(age)').from('people')
// with people(age, name) as (values (7, 'Jo'), (9, 'Mo'))
// select max(age) from people
```
   */
  with(...tables: { [table: string]: SQ |  Value[] }[]): this

  /**
   * **WITH clause** - template string
   * 
   * Constructs a Common Table Expression (CTE)
   * 
   * Call `.withRecursive` to make the CTE recursive.
   * 
   * Multiple calls to `.with` are joined with ', '.
   *
   * @example
```js
sq.with`n as (select ${20} as age)`.from`n`.return`age`
// with n as (select 20 as age) select age from n

sq.with`width as (select ${10} as n)`
  .with`height as (select ${20} as n)`
  .return`width.n * height.n as area`
// with width as (select 10 as n), height as (select 20 as n)
// select width.n * height.n as area
```
   */
  with(strings: TemplateStringsArray, ...args: any[]): this



  /**
   * **WITH RECURSIVE** - recursive CTE
   * 
   * Makes the Common Table Expression recursive.
   * 
   * `.withRecursive` is idempotent. 
   * 
   * @example
```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.withRecursive({ 't(n)': one.unionAll(next) })
  .from`t`
  .return`sum(n)`
```
   *
```sql
-- SQL
with recursive t(n) as (
  select 1 union all (
    select n + 1 from t where (n < 100)
  )
)
select sum(n) from t'
```
   */
  withRecursive(...tables: { [table: string]: SQ |  Value[] }[]): this
  withRecursive(strings: TemplateStringsArray, ...args: any[]): this
}

export interface From {
  /**
   * **FROM clause** - table arguments
   *
   * A table may be:
   * * an expression
   * * an object where each key is an alias and each value may be
   *   * an expression
   *   * an array of data values
   * 
   * An expression may be a string or subquery
   * 
   * **To prevent SQL injection, never source string tables from user input.**
   * 
   * The first call to `.from` specifies the query table.
   * 
   * Subsequent calls have different effects based on query type.
   * 
   * * `select * from a, b, c` - added to from list
   * * `update a from b, c` - added to from list
   * * `delete a using b, c` - added to using list
   * * `insert into a` - ignored
   *
   * @example
```js
sq.from('book')
// select * from book

sq.from('book').where({ id: 8 }).set({ authorId: 7 })
// update book set author_id = $1 where id = $2

sq.delete.from('book').where({ id: 7 })
// delete from book where id = $1

sq.from('book').insert({ title: 'Moby Dick', authorId: 8 })
// insert into book (title, author_id) values ($1, $2)

sq.from(sq.txt`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])

sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq.from({ old: sq.from('person').where`age > 60` })
// select * from (select * from person where age > 60) as old

sq.from({ p: [{ id: 7, name: 'Jo' }, { id: 9, name: 'Mo' }] })
// select * from (values ($1, $2), ($3, $4)) as p(id, name)

sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }).query
// select * from unnest($1) as count_down'
```
   */
  from(...tables: (Expression | { [alias: string]: Expression | Value[] })[]): this

  /**
   * **FROM clause** - template string
   * 
   * The first call to `.from` specifies the query table.
   * 
   * Subsequent calls have different effects based on query type.
   * 
   * * `select * from a, b, c`
   * * `update a from b, c`
   * * `delete a using b, c`
   * * `insert into a`
   *
   * @example
```js
sq.from`book`
// select * from book

sq.from`book`.set({ archived: true })
// update book set archived = $1

sq.delete.from`book`
// delete from book

sq.from`book`.insert({ title: 'Squirrels!' })
// insert into book (title) values ($1)

sq.from`book`.from`author`
// select * from book, author

sq.from`book join comment`
// select * from book join comment

sq.from`${sq.raw('book')}`
// select * from book
```
   */
  from(strings: TemplateStringsArray, ...args: any[]): this
}

interface ExpressFrom {
  /**
   * **FROM clause** - table arguments - express `.from`
   * 
   * A table may be:
   * * an expression
   * * an object where each key is an alias and each value may be
   *   * an expression
   *   * an array of data values
   * 
   * An expression may be a string or subquery
   * 
   * The first call to `.from` specifies the query table.
   * 
   * Subsequent calls have different effects based on query type.
   * 
   * * `select * from a, b, c`
   * * `update a from b, c`
   * * `delete a using b, c`
   * * `insert into a`
   *
   * @example
```js
sq('book')
// select * from book

sq('book').where({ id: 8 }).set({ authorId: 7 })
// update book set author_id = $1 where id = $2

sq.delete('book').where({ id: 7 })
// delete from book where id = $1

sq('book').insert({ title: 'Moby Dick', authorId: 8 })
// insert into book (title, author_id) values ($1, $2)

sq(sq.txt`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])

sq({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq({ old: sq('person').where`age > 60` })
// select * from (select * from person where age > 60) as old

sq({ p: [{ id: 7, name: 'Jo' }, { id: 9, name: 'Mo' }] })
// select * from (values ($1, $2), ($3, $4)) as p(id, name)

sq({ countDown: sq.txt`unnest(${[3, 2, 1]})` }).query
// select * from unnest($1) as count_down'
```
   */
  (...tables: (Expression | { [alias: string]: Expression | Value[] })[]): SQW

  /**
   * **FROM clause** - template string - express `.from`
   * 
   * The first call to `.from` specifies the query table.
   * 
   * Subsequent calls have different effects based on query type.
   * 
   * * `select * from a, b, c`
   * * `update a from b, c`
   * * `delete a using b, c`
   * * `insert into a`
   *
   * @example
```js
sq`book`
// select * from book

sq`book`.set({ archived: true })
// update book set archived = $1

sq.delete`book`
// delete from book

sq`book`.insert({ title: 'Squirrels!' })
// insert into book (title) values ($1)

sq`book`.from`author`
// select * from book, author

sq`book join comment`
// select * from book join comment

sq`${sq.raw('book')}`
// select * from book
```
   */
  (strings: TemplateStringsArray, ...args: any[]): SQW
}

export interface Return {
  /**
   * **SELECT or RETURNING clause** - field arguments
   *
   * Pass `.return` the fields the query should return.
   * 
   * A field may be:
   * * an expression
   * * a non-string argument to parameterize
   * * an object where each key is an alias and each value is:
   *   * an expression
   *   * a non-string argument to parameterize
   * 
   * An expression may be a string or subquery.
   * 
   * **To prevent SQL injection, never source string fields from user input**
   *
   * @example
```js
sq.return('user.name', 'user.id', '33', sq.txt('33'), 27, true)
// select user.name, user.id, 33, $1, $2, $3

sq.from('person').set`age = age + 1`.return('id', 'age')
// update person set age = age + 1 returning id, age

sq.delete.from('person').return('id', 'age')
// delete from person returning id, age

sq.from('person').insert({ age: 12 }).return('id', 'age')
// insert into person (age) values (12) returning id, age

const userInput = '; drop table user;'
sq.from('book').return(sq.txt(userInput), 23).return(true)
// select $1, $2, $3 from book

sq.return({
  now: sq.txt`now()`,
  tomorrow: sq.return`now() + '1 day'`
})
// select now() as today, (select now() + '1 day') as tomorrow
```
   */
  return(...fields: (Expression | any | { [alias: string]: Expression | any })[]): this

  /**
   * **SELECT or RETURNING clause** - template string
   *
   * Pass `.return` the fields the query should return 
   *
   * @example
```js
sq.from`book.`return`title`
// select title from book

sq.from`person`.set`age = age + 1`.return`id, age`
// update person set age = age + 1 returning id, age

sq.delete.from`person`.return`id, age`
// delete from person returning id, age

sq.from`person`.insert({ age: 12 }).return`id, age`
// insert into person (age) values ($1) returning id, age

sq.return`${7}, ${8}, ${9}`.return`${10}`
// select $1, $2, $3, $4
```
   */
  return(strings: TemplateStringsArray, ...args: any[]): this
}

export interface ExpressReturn {
  /**
   * **SELECT or RETURNING clause** - field arguments - express `.return`
   *
   * Pass `.return` the fields the query should return.
   * 
   * A field may be:
   * * an expression
   * * a non-string argument to parameterize
   * * an object where each key is an alias and each value is:
   *   * an expression
   *   * a non-string argument to parameterize
   * 
   * An expression may be a string or subquery.
   * 
   * **To prevent SQL injection, never source string fields from user input**
   *
   * @example
```js
sq('person')({ id: 7 })('name')
// select name from person where id = $1

sq('person')()('id', 'age').set`age = age + 1`
// update person set age = age + 1 returning id, age

sq.delete('person')({ name: 'Jo' })('id', 'age')
// delete from person where name = $1 returning id, age

sq('person')().insert({ age: 12 })('id', 'age')
// insert into person (age) values (12) returning id, age

const userInput = '; drop table user;'
sq('book')()(sq.txt(userInput), 23)
// select $1, $2 from book
```
   */
  (...fields: (Expression | any | { [alias: string]: Expression | any })[]):  SQ


  /**
   * SELECT or RETURNING clause - specify fields to returns - express `.return`
   *
   * Accepts fields as template string
   *
   * @example
```js
sq`book``id = ${3}``title`
// select title from book where id = $1

sq`person`()`id, age`.set`age = age + 1`
// update person set age = age + 1 returning id, age

sq.delete`person``age > ${23}``id, age`
// delete from person where age > $1 returning id, age

sq`person`()`id, age`.insert({ age: 12 })
// insert into person (age) values ($1) returning id, age
```
   */
  (strings: TemplateStringsArray, ...args: any[]): SQ
}

export interface Where {
  /**
   * **WHERE clause** - query filters
   *
   * Pass `.where` the filter conditions.
   * 
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   * 
   * Multiple conditions are joined with _" or "_.
   * 
   * Properties within an object are joined with _" and "_.
   * 
   * Multiple calls to `.where` are joined with _" and "_.
   *
   * @example
```js
sq.from('person').where({ id: 7 })
// select * form person where (id = $1)

sq.from('person').where(sq.txt`age >= ${18}`).set({ adult: true })
// update person set adult = $1 where (age >= ${2})

sq.delete.from('person').where({ age: 20, id: 5 }, { age: 30 })
// delete from person where (age = $1 and id = $1 or age = $2)

sq.from('person').where(sq.txt`name = ${'Jo'}`, { age: 17 })
// select * from person where (name = $1 or age = $2)

sq.from('person').where({ minAge: sq.txt`age < ${17}` })
// select * from person where (age = $1)

sq.from('person').where({ age: 7, gender: 'male' })
// select * from person where (age = $1 and gender = $2)

sq.from('person').where({ age: 7 }).where({ name: 'Joe' })
// select * from person where (age = $1) and name = $2
```
   */
  where(...conditions: Conditions): this

  /**
   * **WHERE clause** - template string
   *
   * Filters result set.
   * 
   * Multiple calls to `.where` are joined with _" and "_.
   *
   * @example
```js
 sq.from`person`.where`age < ${18}`
 // select * from person where (age < $1)
 
 sq.from`person`.where`age < ${7}`.set`group = ${'infant'}`
 // update person set group = $1 where (age < $2)
 
 sq.delete.from`person`.where`age < ${7}`
 // delete from person where (age < $1)
 
 sq.from`person`.where`age > ${3}`.where`age < ${7}`
 // select * from person where (age > $1) and (age < $2)
 ```
   */
  where(strings: TemplateStringsArray, ...args: any[]): this
}

export interface ExpressWhere {
  /**
   * **WHERE clause** - query filters - express `.where`
   *
   * Pass `.where` the filter conditions.
   * 
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   * 
   * Multiple conditions are joined with _" or "_.
   * 
   * Properties within an object are joined with _" and "_.
   * 
   * Multiple calls to `.where` are joined with _" and "_.
   *
   * @example
```js
sq('person')({ id: 7 })
// select * form person where (id = $1)

sq('person')(sq.txt`age >= ${18}`).set({ adult: true })
// update person set adult = $1 where (age >= ${2})

sq.delete('person')({ age: 20, id: 5 }, { age: 30 })
// delete from person where (age = $1 and id = $1 or age = $2)

sq('person')(sq.txt`name = ${'Jo'}`, { age: 17 })
// select * from person where (name = $1 or age = $2)

sq('person')({ minAge: sq.txt`age < ${17}` })
// select * from person where (age = $1)

sq('person')({ age: 7, gender: 'male' })
// select * from person where (age = $1 and gender = $2)

sq('person')({ age: 7 }).where({ name: 'Joe' })
// select * from person where (age = $1) and name = $2
```
   */
  (...conditions: Conditions): SQR

  /**
   * **WHERE clause** - template string - express `.where`
   *
   * Filters result set.
   * 
   * Multiple calls to `.where` are joined with _" and "_.
   *
   * @example
```js
 sq`person``age < ${18}`
 // select * from person where (age < $1)
 
 sq`person``age < ${7}`.set`group = ${'infant'}`
 // update person set group = $1 where (age < $2)
 
 sq.delete`person``age < ${7}`
 // delete from person where (age < $1)
 
 sq`person``age > ${3}`.where`age < ${7}`
 // select * from person where (age > $1) and (age < $2)
 ```
   */
  (strings: TemplateStringsArray, ...args: any[]): SQR
}

interface Logic extends And, Or {}

export interface And {
  /**
   * **AND condition** - query filters
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from('person').where({ age: 20 }).and({ name: 'Jo' })
// select * from person where (age > $1) and (name = $2)
sq.from('book').leftJoin('author')
  .on({ 'book.author_id': sq.raw('author.id') })
  .and({ 'author.status': 'active' })
// select * from book left join author
// on (book.author_id = author.id) and (author.status = $1)
sq.from('book').return('genre', 'avg(book.rating) as r')
  .groupBy('genre').having(sq.txt`r > 7`).and(sq.txt`r <= 10`)
// select genre, avg(book.rating) as r from book
// group by genre having (r > 7) and (r <= 10)
```
   */
  and(...conditions: Conditions): this

  /**
   * **AND condition** - template string
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from`person`.where`age > 20`.and`age < 30`
// select * from person where (age > 20) and (age < 30)

sq.from`book`.leftJoin`author`
  .on`book.author_id = author.id`.and`author.status = 'active'`
// select * from book left join author
// on (book.author_id = author.id) and (author.status = 'active')

sq.from`book`.return`genre, avg(book.rating) as r`
  .groupBy`genre`.having`r > 7`.and`r <= 10`
// select genre, avg(book.rating) as r from book
// group by genre having (r > 7) and (r <= 10)
```
   */
  and(strings: TemplateStringsArray, ...args: any[]): this
}

interface Or {
  /**
   * **OR condition** - query filters
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from('person').where(sq.txt`age < 20`).or(sq.txt`age > 30`)
// select * from person where (age < 20) or (age > 30)

sq.from('book').leftJoin('author')
  .on({ 'book.author_id': sq.raw('author.id') })
  .or({ 'book.editor_id': sq.raw('author.id') })
// select * from book left join author
// on (book.author_id = author.id) or (book.editor_id = author.id)

sq.from('book').return('genre', 'avg(book.rating) as r')
  .groupBy('genre').having(sq.txt`r < 2`).or(sq.txt`r > 8`)
// select genre, avg(book.rating) as r from book
// group by genre having (r < 2) or (r > 8)
```
   */
  or(...conditions: Conditions): this

  /**
   * **OR condition** - template string
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from`person`.where`age < 20`.or`age > 30`
// select * from person where (age < 20) or (age > 30)

sq.from`book`.leftJoin`author`
  .on`book.author_id = author.id`.or`book.editor_id = author.id`
// select * from book left join author
// on (book.author_id = author.id) or (book.editor_id = author.id)

sq.from`book`.return`genre, avg(book.rating) as r`
  .groupBy`genre`.having`r < 2`.or`r > 8`
// select genre, avg(book.rating) as r from book
// group by genre having (r < 2) or (r > 8)
```
   */
  or(strings: TemplateStringsArray, ...args: any[]): this
}

export interface Distinct {
  /**
   * **SELECT DISTINCT**
   * 
   * Filters the query results so only distinct rows are returned. Duplicate result rows are eliminated.
   * 
   * `.distinct` filters rows using every column. To filter on a subset of columns use `.distinctOn` instead.
   * 
   * `.distinct` is idempotent.
   * 
   * @example
```js
sq.return('name', 'age').distinct.from('person')
// select distinct name from person
```
   */
  distinct: this

  /**
   * **SELECT DISTINCT ON** - columns
   * 
   * Filters query results on a subset of columns.
   * 
   * If multiple rows share values for the distinct columns, only the first is returned. An order by clause is needed to make the result set deterministic.
   * 
   * Columns may be strings or subqueries.
   * 
   * Multiple calls to `.distinctOn` are joined with ', '.
   * 
   * @example
```js
sq.from('person').return('name', 'age').distinctOn('name').orderBy('name')
// select distinct on (name) name, age from person order by name

sq.from('person').distinctOn('name', 'age').distinctOn('gender')
// select distinct on (name, age, gender) * from person
```
   */
  distinctOn(...columns: (string | SQ)[]): this

  /**
   * **SELECT DISTINCT ON** - template string
   * 
   * Filters query results on a subset of columns.
   * 
   * If multiple rows share values for the distinct columns, only the first is returned. An order by clause is needed to make the result set deterministic.
   * 
   * Multiple calls to `.distinctOn` are joined with ', '.
   * 
   * @example
```js
sq.from`person`.return`name, age`.distinctOn`name`.orderBy`name`
// select distinct on (name) name, age from person order by name

sq.from`person`.distinctOn`name, age`.distinctOn`gender`
// select distinct on (name, age, gender) * from person
```
   */
  distinctOn(...columns: (string | SQ)[]): this
}

interface GroupItems extends Array<Expression | RollupItem | CubeItem | GroupingSetsItem | GroupItems> {}
interface ExpressionItems extends Array<Expression | ExpressionItems> {}

interface RollupItem {
  type: 'rollup'
  args: ExpressionItems
}
interface CubeItem {
  type: 'cube'
  args: ExpressionItems
}
interface GroupingSetsItem {
  type: 'grouping sets',
  args: GroupItems
}

export interface GroupHelpers {
  /**
   * **[ROLLUP item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates rollup grouping sets for use in a group by clause
   * 
```sql
rollup (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd'))
// select * from t group by rollup (a, (b, c)), d
```
   */
  rollup(...args: ExpressionItems): RollupItem

  /**
   * **[CUBE item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates cube grouping sets for use in a group by clause
   * 
```sql
cube (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a, c), (a), (b, c), (b), (c), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`], 'd'))
// select * from t group by cube (a, (b, c)), d
```
   */
  cube(...args: ExpressionItems): CubeItem

    /**
   * **[Grouping Sets item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates grouping sets for use in a group by clause
   * 
   * Accepts the same arguments as `.groupBy`. Grouping sets can be nested.
   * 
   * @example
```js
sq.from`t`.groupBy(
  sq.groupingSets(
    ['a', 'b', 'c'],
    sq.groupingSets(['a', 'b']),
    ['a'],
    [],
    sq.cube('a', 'b')
  )
)
// select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), (), cube (a, b))
```
   */
  groupingSets(...args: GroupItems): GroupingSetsItem
}

export interface GroupBy {
  /**
   * **GROUP BY clause** - group items
   * 
   * A grout item may be:
   * 
   * * An expression
   * * An array of expressions
   * * A call to `sq.rollup`
   * * A call to `sq.cube`
   * * A call to `sq.groupingSets`
   * 
   * An expression may be a string or subquery.
   *
   * Multiple `.groupBy` calls are joined with ', '.
   * 
   * @example
```js
sq.from('book').return('genre', 'count(*)').groupBy('genre')
// select genre, count(*) from book group by genre

sq.from('book').return('genre', 'year').groupBy('genre', 'year')
// select genre, year from book group by genre, year

sq.from('book').return('genre', 'year').groupBy('genre').groupBy('year')
// select genre, year from book group by genre, year

sq.from('book').return('genre', 'year').groupBy(['genre', 'year'])
// select genre, year from book group by (genre, year)

sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd'))
// select * from t group by rollup (a, (b, c)), d

sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`], 'd'))
// select * from t group by cube (a, (b, c)), d

sq.from`t`.groupBy(
  sq.groupingSets(
    ['a', 'b', 'c'],
    sq.groupingSets(['a', 'b']),
    ['a'],
    [],
    sq.cube('a', 'b')
  )
)
// select * from t
// group by grouping sets (
//   (a, b, c),
//   grouping sets ((a, b)),
//   (a),
//   (),
//   cube (a, b)
// )
```
   */
  groupBy(...args: GroupItems): this

  /**
   * **GROUP BY clause** - template string
   * 
   * Multiple `.groupBy` calls are joined with ', '.
   * 
   * @example
```js
sq.from`book`.return`genre, count(*)`.groupBy`genre`
// select genre, count(*) from book group by genre

sq.from`book`.return`genre, year`.groupBy`genre, year`
// select genre, year from book group by genre, year

sq.from`book`.return`genre, year`.groupBy`genre`.groupBy`year`
// select genre, year from book group by genre, year
```
   */
  groupBy(strings: TemplateStringsArray, ...args: any[]): this
}

export interface Having {
  /**
   * **HAVING clause** - group conditions
   *
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   * 
   * @example
```js
sq.from('book').return('genre')
  .groupBy('genre').having(sq.txt`count(*) > 10`)
// select genre from book group by genre having count(*) > 10
```
   */
  having(...conditions: Conditions): this

  /**
   * **HAVING clause** - template string
   * 
   * @example
```js
sq.from`book`.return`genre`
  .groupBy`genre`.having`count(*) > 10`
// select genre from book group by genre having count(*) > 10
```
   */
  having(strings: TemplateStringsArray, ...args: any[]): this
}

export interface OrderBy {
  /**
   * **ORDER BY clause** - order by items
   * 
   * An order item may be:
   * * an expression
   * * an object with properties:
   *   * `by` - the expression to sort by
   *   * `sort` - `'asc'` or `'desc'`
   *   * `nulls` - `'first'` or `'last'`
   *   * `using` - a sort operator
   * 
   * Multiple `.orderBy` calls are joined with ', '.
   * 
   * @example
```js
sq.from('book').orderBy('title desc', sq.txt`sales / ${1000}`)
// select * from book order by title desc, sales / 1000

sq.from('book').orderBy(
  { by: 'title', sort: 'desc' },
  { by: sq.txt`sales / ${1000}` }
)
// select * from book order by title desc, sales / 1000

sq.from('book').orderBy({ by: 'title', using: '~<~', nulls: 'last' })
// select * from book order by title using ~<~ nulls last
```
   */
  orderBy(...orderItems: (Expression | {
    by: Expression
    sort?: 'asc' | 'desc'
    using?: string
    nulls?: 'first' | 'last'
  })[]): this

  /**
   * **ORDER BY clause** - template string
   * 
   * Multiple `.orderBy` calls are joined with ', '.
   * 
   * @example
```js
sq.from`book`.orderBy`title desc, sales / ${1000}`
// select * from book order by title desc, sales / 1000

sq.from`book`.orderBy`title`.orderBy`sales / 1000`
// select * from book order by title desc, sales / 1000

sq.from`book`.orderBy`title using ~<~' nulls last`
// select * from book order by title using ~<~ nulls last
```
   */
  orderBy(strings: TemplateStringsArray, ...args: any[]): this
}


export interface Limit {
  /**
   * **LIMIT clause** - limit
   *
   * Specify the maximum number of results to return
   * 
   * Only the last call to `.limit` is used.
   * 
   * @example
```js
sq.from`person`.limit(8)
// select * from person limit 8

sq.from`person`.limit(7).limit(5)
// select * from person limit 5

sq.from`person`.limit(sq.txt`1 + 7`)
// select * from person limit 1 + 7

sq.from`person`.limit(sq.return(10))
// select * from person limit (select 10)
```
   */
  limit(limit: number | SQ): this

  /**
   * **LIMIT clause** - template string
   * 
   * Specify the maximum number of results to return
   * 
   * Only the last call to `.limit` is used.
   * 
   * @example
```js
sq.from`person`.limit`5`
// select * from person limit 5

sq.from`person`.limit`${1} + ${7}`
// select * from person limit 1 + 7
```
   */
  limit(strings: TemplateStringsArray, ...args: any[]): this
}


export interface Offset {
  /**
   * **OFFSET clause** - template string
   *
   * Specify the number of results to skip before returning
   * 
   * Only the last call to `.offset` is used.
   * 
   * @example
```js
sq.from`person`.limit(8)
// select * from person limit 8

sq.from`person`.limit(7).limit(5)
// select * from person limit 5

sq.from`person`.limit(sq.txt`1 + 7`)
// select * from person limit 1 + 7

sq.from`person`.limit(sq.return(10))
// select * from person limit (select 10)
```
   */
  offset(offset: number | SQ): this

  /**
   * **OFFSET clause** - template string
   *
   * Specify the number of results to skip before returning
   * 
   * Only the last call to `.offset` is used.
   * 
   * @example
```js
sq.from`person`.limit`5`
// select * from person limit 5

sq.from`person`.limit`${1} + ${7}`
// select * from person limit 1 + 7
```
   */
  offset(strings: TemplateStringsArray, ...args: any[]): this
}

export interface Joiner<T> {
  /**
   * **JOIN clause** - table arguments
   */
  join(...tables: (Expression | { [alias: string]: Expression | Value[] })[]): T

  /**
   * **JOIN clause** - template string
   */
  join(strings: TemplateStringsArray, ...args: any[]): T
}

export interface Join {
  /**
   * **JOIN clause** - table arguments
   * 
   * Creates a join table.
   * 
   * Accepts the same arguments as `.from`
   * 
   * Joins are inner by default. Specify the join type with a prior call to `.inner`, `.left`, `.right`, `.full`, or `.cross`.
   * 
   * Joins are natural by default. Call `.on` or `.using` after `.join` to specify join conditions.
   * 
   * @example
```js
sq.from('book').join('author')
// select * from book natural join author

sq.from({ b: 'book' }).join({ a: 'author'}).on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from({ b: 'book' }).join({ a: 'author'})
  .on({ 'b.author_id': sq.raw('a.id') }).on({ 'b.genre': 'Fantasy' })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from({ b: 'book' }).join({ a: 'author'}).on`${sq.raw('b.author_id')} = ${sq.raw('a.id')}`
  .and({ 'b.genre': 'Fantasy' }).or({ 'b.special': true })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)

sq.from('book').join('author').using('author_id')
// select * from book join author using (author_id)

sq.from('a').join('b').using('x', 'y').using('z')
// select * from a join b using (x, y, z)

sq.from('book').leftJoin('author').rightJoin`publisher`
// select * from book natural left join author natural right join publisher

sq.from('book').naturalRightJoin('author').crossjoin`publisher`
// select * from book natural right join author natural join publisher
```
   */
  join(...tables: (Expression | { [alias: string]: Expression | Value[] })[]): this

  /**
   * **JOIN clause** - template string
   * 
   * Creates a join table.
   * 
   * Accepts the same arguments as `.from`
   * 
   * Joins are inner by default. Specify the join type with a prior call to `.inner`, `.left`, `.right`, `.full`, or `.cross`.
   * 
   * Joins are natural by default. Call `.on` or `.using` after `.join` to specify join conditions.
   * 
   * @example
```js
sq.from`book`.join`author`
// select * from book natural join author

sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from`book as b`.join`author as a`
  .on`b.author_id = a.id`.on`b.genre = 'Fantasy'`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
  .and`b.genre = 'Fantasy'`.or`b.special = true`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)

sq.from`book`.join`author`.using`author_id`
// select * from book join author using (author_id)

sq.from`a`.join`b`.using`x, y`.using`z`
// select * from a join b using (x, y, z)

sq.from`book`.leftJoin`author`.rightJoin`publisher`
// select * from book natural left join author natural right join publisher

sq.from`book`.naturalRightJoin`author`.crossjoin`publisher`
// select * from book natural right join author natural join publisher
```
   */
  join(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **INNER JOIN** - (inner) join
   * 
   * Sets the join type to inner. This method is not usually needed because joins are inner by default.
   * 
   * @example
```js
sq.from`book`.join`author`
// select * from book natural join author

sq.from`book`.join`author`
// select * from book natural join author

sq.from`book`.join`author`.on`book.author_id = author.id`
// select * from book join author on book.author_id = author.id
```
   */
  inner: Joiner<this>

  /**
   * **LEFT JOIN** - left (outer) join
   * 
   * Sets the join type to left
   * 
   * @example
```js
sq.from`book b`.leftJoin`author a`
// select * from book natural left join author

sq.from`book b`.leftJoin`author a`.on`b.author_id = a.id`
// select * from book b left join author a on b.author_id = a.id
```
   */
  left: Joiner<this>

  /**
   * **RIGHT JOIN** - right (outer) join
   * 
   * Sets the join type to right
   * 
   * @example
```js
sq.from`book b`.rightJoin`author a`
// select * from book natural right join author

sq.from`book b`.rightJoin`author a`.on`b.author_id = a.id`
// select * from book b right join author a on b.author_id = a.id
```
   */
  right: Joiner<this>

  /**
   * **FULL JOIN** - full (outer) join
   * 
   * Sets the join type to full
   * 
   * @example
```js
sq.from`book b`.fullJoin`author a`
// select * from book natural full join author

sq.from`book b`.fullJoin`author a`.on`b.author_id = a.id`
// select * from book b full join author a on b.author_id = a.id
```
   */
  full: Joiner<this>

  /**
   * **CROSS JOIN** - cross join
   * 
   * Sets the join type to cross
   * 
   * @example
```js
sq.from`book b`.crossJoin`author a`
// select * from book cross join author

sq.from`book b`.crossJoin`author a`.on`b.author_id = a.id`
// select * from book b cross join author a on b.author_id = a.id
```
   */
  cross: Joiner<this>
  
  /**
   * **JOIN CONDITION** - join conditions
   * 
   * Specifies join conditions for the previous join.
   *
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   * 
   * Multiple conditions are joined with _" or "_.
   * 
   * Properties within an object are joined with _" and "_.
   * 
   * Multiple calls to `.on` are joined with _" and "_.
   * 
   * @example
```js
sq.from({ b: 'book' }).join({ a: 'author'}).on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from({ b: 'book' }).join({ a: 'author'})
  .on({ 'b.author_id': sq.raw('a.id') }).on({ 'b.genre': 'Fantasy' })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from({ b: 'book' }).join({ a: 'author'}).on`${sq.raw('b.author_id')} = ${sq.raw('a.id')}`
  .and({ 'b.genre': 'Fantasy' }).or({ 'b.special': true })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)
```
   */
  on(...conditions: Conditions): this

  /**
   * **JOIN CONDITION** - template string
   * 
   * Specifies join conditions for the previous join.
   * 
   * Multiple calls to `.on` are joined with _" and "_.
   * 
   * @example
```js
sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from`book as b`.join`author as a`
  .on`b.author_id = a.id`.on`b.genre = 'Fantasy'`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
  .and`b.genre = 'Fantasy'`.or`b.special = true`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)
```
   */
  on(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **JOIN USING** - column names
   * 
   * Specifies the shared column for the previous join
   * 
   * Multiple `.using` calls are joined with ', '.
   * 
   * @example
```js
sq.from('book').join('author').using('author_id')
// select * from book join author using (author_id)

sq.from('a').join('b').using('x', 'y').using('z')
// select * from a join b using (x, y, z)
```
   */
  using(...columns: string[]): this
  
  /**
   * **JOIN USING** - template string
   * 
   * Specifies the shared column for the previous join
   * 
   * Multiple `.using` calls are joined with ', '.
   * 
   * @example
```js
sq.from`book`.join`author`.using`author_id`
// select * from book join author using (author_id)

sq.from`a`.join`b`.using`x, y`.using`z`
// select * from a join b using (x, y, z)
```
   */
  using(strings: TemplateStringsArray, ...args: any[]): this
}

interface SetOperators {
  /**
   * **UNION Clause** - union queries
   * 
   * Pass `.union` the queries to union with the current query.
   * 
   * Union is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.unionAll` to keep duplicates.
   * 
   * @example
```js
sq`a`.union(sq`b`)
// select * from a union (select * from b)

sq`a`.union(sq`b`, sq`c`)
// select * from a union (select * from b) union (select * from c)

sq`a`.union(sq`b`).union(sq`c`)
// select * from a union (select * from b) union (select * from c)
```
   */
  union(...queries: SQ[]): this

  /**
   * **UNION ALL Clause** - unionAll queries
   * 
   * Pass `.unionAll` the queries to union with the current query.
   * 
   * Use `.unionAll` instead of `.union` to keep duplicate result rows.
   * 
   * @example
```js
sq`a`.unionAll(sq`b`)
// select * from a union all (select * from b)

sq`a`.unionAll(sq`b`, sq`c`)
// select * from a union all (select * from b) union all (select * from c)

sq`a`.unionAll(sq`b`).unionAll(sq`c`)
// select * from a union all (select * from b) union all (select * from c)
```
   */
  unionAll(...queries: SQ[]): this

  /**
   * **INTERSECT Clause** - intersect queries
   * 
   * Pass `.intersect` the queries to intersect with the current query.
   * 
   * intersect is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.intersectAll` to keep duplicates.
   * 
   * @example
```js
sq`a`.intersect(sq`b`)
// select * from a intersect (select * from b)

sq`a`.intersect(sq`b`, sq`c`)
// select * from a intersect (select * from b) intersect (select * from c)

sq`a`.intersect(sq`b`).intersect(sq`c`)
// select * from a intersect (select * from b) intersect (select * from c)
```
   */
  intersect(...queries: SQ[]): this

  /**
   * **INTERSECT ALL Clause** - intersectAll queries
   * 
   * Pass `.intersectAll` the queries to intersect with the current query.
   * 
   * Use `.intersectAll` instead of `.intersect` to keep duplicate result rows.
   * 
   * @example
```js
sq`a`.intersectAll(sq`b`)
// select * from a intersect all (select * from b)

sq`a`.intersectAll(sq`b`, sq`c`)
// select * from a intersect all (select * from b) intersect all (select * from c)

sq`a`.intersectAll(sq`b`).intersectAll(sq`c`)
// select * from a intersect all (select * from b) intersect all (select * from c)
```
   */
  intersectAll(...queries: SQ[]): this

  /**
   * **EXCEPT Clause** - except queries
   * 
   * Pass `.except` the queries to except with the current query.
   * 
   * except is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.exceptAll` to keep duplicates.
   * 
   * @example
```js
sq`a`.except(sq`b`)
// select * from a except (select * from b)

sq`a`.except(sq`b`, sq`c`)
// select * from a except (select * from b) except (select * from c)

sq`a`.except(sq`b`).except(sq`c`)
// select * from a except (select * from b) except (select * from c)
```
   */
  except(...queries: SQ[]): this

  /**
   * **EXCEPT ALL Clause** - exceptAll queries
   * 
   * Pass `.exceptAll` the queries to except with the current query.
   * 
   * Use `.exceptAll` instead of `.except` to keep duplicate result rows.
   * 
   * @example
```js
sq`a`.exceptAll(sq`b`)
// select * from a except all (select * from b)

sq`a`.exceptAll(sq`b`, sq`c`)
// select * from a except all (select * from b) except all (select * from c)

sq`a`.exceptAll(sq`b`).exceptAll(sq`c`)
// select * from a except all (select * from b) except all (select * from c)
```
   */
  exceptAll(...queries: SQ[]): this
}

export interface Values {
  /** TODO */
  values(): this
}



export interface Insert {
  /**
   * **INSERT clause** - template string
   * 
   * Specifies the data to insert.
   * 
   * Only the last call to `.insert` is used.
   *
   * @example
```js
sq.from`person(name, age)`.insert`values (${'bo'}, ${22})`
// insert into person(name, age) values ('bo', 22)

sq.from`person(name)`.insert`values ('Jo')`.insert`values ('Mo')`
// insert into person(name, age) values ('Mo')
```
   */
  insert(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **INSERT caluse** - value objects
   * 
   * Specifies the data to insert as objects.
   * 
   * Column names are inferred from object keys.
   * 
   * Values may be subqueries
   * 
   * Only the last call to `.insert` is used.
   * 
   * @example
```js
sq.from('person').insert({ name: 'Jo' })
// insert into person(name) values ('Jo')

sq.from('person').insert({ firstName: 'Jo', age: 17 })
// insert into person(first_name, age) values ('Jo', 17)

sq.from('person')
  .insert({ name: 'Jo', age: 17 }, { name: 'Mo', age: 18 })
// insert into person(name, age) values ('Jo', 17), ('Mo', 18)

sq.from('person')
  .insert({ name: 'Jo', age: 17 }, { id: 23, age: 18 })
// insert into person(name, age, id) values ('Jo', 17, default), (default, 18, 23)

sq.from('person').insert({
  firstName: sq.return`${'Shallan'}`,
  lastName: sq.txt('Davar')
})
// insert into person(first_name, last_name) values ((select 'Shallan'), 'Davar')
```
   */
  insert(...values: Value[]): this

  /**
   * **INSERT clause** - array of values
   * 
   * Specifies the data to insert as an array of objects.
   * 
   * Column names are inferred from object keys.
   * 
   * Values may be subqueries.
   * 
   * Only the last call to `.insert` is used.
   * 
   * @example
```js
sq.from('person')
  .insert([{ name: 'Jo', age: 17 }, { name: 'Mo', age: 18 }])
// insert into person(name, age) values ('Jo', 17), ('Mo', 18)

sq.from('person')
  .insert([{ name: 'Jo', age: 17 }, { id: 23, age: 18 }])
// insert into person(name, age, id) values ('Jo', 17, default), (default, 18, 23)

sq.from('person').insert([{
  firstName: sq.return`${'Shallan'}`,
  lastName: sq.txt('Davar')
}])
// insert into person(first_name, last_name) values ((select 'Shallan'), 'Davar')
```
   */  
  insert(values: Value[]): this

  /**
   * **INSERT clause** - query
   * 
   * Specifies the data to insert from a query.
   * 
   * Only the last call to `.insert` is used.
   * 
   * @example
```js
sq.from('person(name, age)').insert(sq.return(sq.txt('Jo'), 23))
// insert into person(name, age) select 'Jo', 23

sq.from('person(name)').insert(sq.txt`values (${'Jo'})`)
// insert into person(name) values ('Jo')
```
   */
  insert(query: SQ): this

  /**
   * **INSERT clause** - default values
   * 
   * Inserts default values.
   * 
   * Only the last call to `.insert` is used.
   * 
   * @example
```js
sq.from('person').insert()
// insert into person default values
```
   */
  insert(): this
}

export interface Set {
  /**
   * **SET clause** - update values
   *
   * Pass `.set` the values to update.
   * 
   * Multiple `.set` calls are joined with ', '.
   * 
   * @example
```js
sq.from('person')
  .set({ age: sq.txt`age + 1`, done: true })
  .where({ age: 7 })
  .return('person.name')
// update person
// set age = age + 1, done = true
// where age = 7
// returning person.name

sq.from('person').set(
  { firstName: 'Robert', nickname: 'Rob' },
  { processed: true }
)
// update person
// set first_name = 'Robert', nickname = 'Rob', processed = true

sq.from('person')
  .set({ firstName: sq.txt`'Bob'` })
  .set({ lastName: sq.return`'Smith'` })
// update person
// set first_name = 'Bob', last_name = (select 'Smith')
```
   */
  set(...values: Value[]): this

  /**
   * **SET clause** - template string
   *
   * Pass `.set` the values to update.
   * 
   * Multiple `.set` calls are joined with ', '.
   * 
   * @example
```js
sq.from`person`
  .set`age = age + 1, processed = true`
// update person
// set age = age + 1, processed = true

sq.from`person`
  .set`age = age + 1, processed = true`
  .set`name = ${'Sally'}`
// update person
// set age = age + 1, processed = true, name = 'Sally'
```
   */
  set(strings: TemplateStringsArray, ...args: any[]): this
}


export interface Delete {
  /**
   * DELETE - marks the query as a delete query
   *
   * @example
```js
sq.delete.from`person`
// delete * from person

sq.delete.from`person`.where`age < 7`.return`id`
// delete from person where age < 7 returning id

sq`person``age < 7``id`.delete
// delete from person where age < 7 returning id
```
   */
  readonly delete: this
}


export interface Manual {
  /**
   * Manually Build Query
   *
   * Multiple calls to `.sql` are joined with spaces.
   *
   * Template string arguments are automatically parameterized.
   * To provide a raw unparameterized argument, prefix it with `$`.
   * Arguments can be subQ.
   *
   * @example
```js
sq.sql`select * from book`
// select * from book

sq.sql`select * from person`.sql`where age = ${8}`.sql`or name = ${'Jo'}`
// select * from person where age = $1 or name = $2

sq.sql`select * ${sq.raw('person')}`
// select * from person

sq`person`.where({ min: sq.txt`age < 7` })
// select * from person where age < 7

sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
// select now() today, (select now() + '1 day') tomorrow
```
   */
  sql(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * Parameterizes Query argument(s)
   *
   * Multiple calls to `.sql` are joined with spaces.
   *
   * @example
```js
sq.sql`select * from person where age >=`.sql(20).sql`and age < `.sql(30)
// select * from person where age >= $1 and age < $2

sq.return({ safe: sq.txt('Jo'), dangerous: 'Mo' })
// select $1 as safe, Mo as dangerous
```
   */
  sql(...args: any): this

  /**
   * Manually Build Text Fragment
   *
   * Multiple calls to `.txt` are joined with spaces.
   *
   * Template string arguments are automatically parameterized.
   * To provide a raw unparameterized argument, prefix it with `$`.
   * Arguments can be subQ.
   *
   * @example
```js
   */
  txt(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * Parameterizes Fragment argument(s)
   *
   * Multiple calls to `.txt` are joined with spaces.
   *
   * @example
```js

```
   */
  txt(...args: any): this

}


export interface Raw {
  /**
   * Creates a string that is not parameterized when embedded.
   *
   * Alternatively prefix an argument with `$` in a tagged template literal.
   *
   * @example
```js
sq.sql`select * from`.raw('test_table').sql`where id = ${7}`
// select * from test_table where id = $1

sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`
// select * from test_table where id = $1
```
   */
  raw(arg: string): Buildable
}

export interface Link {
  /**
   * Specifies the separator used to join components of a manual query
   * or clauses of a non-manual query.
   * 
   * @example
```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Hi' }]
const val = book => sq.sql`(${book.id}, ${book.title})`
const values = sq.extend(...books.map(val)).link(', ')
// ($1, $2), ($3, $4)

sq.sql`insert into book(id, title)`.sql`values ${values}`.link('\n')
// insert into book(id, title)
// values ($1, $2), ($3, $4)'
```
   */
  link(separator: string): this
}

export interface Buildable {
  /**
   * Compiles the query builder state to return the equivalent parameterized query
   *
   * @example
```js
sq.sql`select * from book`.query
{ text: 'select * from book', args: [], type: 'manual' }

sq`book`({ id: 7 })`title`.query
{ text: 'select title from book where id = $1', args: [7], type: 'select' }

sq`book`.delete({ id: 7 })`title`.query
{ text: 'delete from book where id = $1 returning title', args: [7], type: 'delete' }
```
   */
  readonly query: { text: string; args: any[], type: 'manual' | 'select' | 'update' | 'delete' | 'insert' | 'values' };

  /**
   * **DANGER. DO NOT USE THIS METHOD. IT MAKES YOU VULNERABLE TO SQL INJECTION.**
   * 
   * Compiles the query builder state to return the equivalent unparameterized query.
   * 
   * Always use `.query` if possible. This method is dangerous and unreliable.
   *
   * @example
```js
sq`book`({ id: 7 })`title`.unparameterized ===
'select title from book where id = 7'
```
   */
  readonly unparameterized: string
}

interface Execute extends Promise<Row[]> {
  /**
   * Executes the query and returns a Promise for an array of rows
   * 
   * To execute the query in the context of a transaction, pass
   * the transaction object `trx` as an argument.
   * 
   * @example
```js
const children = await sq`person`.all()
// .all() is optional
const children = await sq`person`
// unless the query is part of a transaction
const trx = await sq.transaction()
await sq`person`.insert({ name: 'Jo' }).all(trx)
```
   */
  all(trx?: Transaction): Promise<Row[]>

  /**
   * Executes the query and returns a Promise for the first row
   * 
   * If no row is returned, the Promise resolves to `undefined`.
   * 
   * Execute the query within a transaction by passing the transaction object `trx`.
   * 
   * @example
   * const bob = await sq`person`.where`name = 'Bob'`.return`id`.one()
   * if (bob) console.log(bob.id)
   * 
   * const trx = await sq.transaction()
   * await sq`person`.insert({ name: 'Jo' }).one(trx)
   */
  one(trx?: Transaction): Promise<Row | void>
}

interface Extend {
  /**
   * Returns a new query equivalent to the combination of the current
   * query and the argument queries
   * 
   * `.extend` does not modify the query chain's *Express* state. Every query chain has its own *Express* state.
   * 
   * @example
```js
sq.extend(sq.from('book').where({ id: 8 }), sq.return('title'))
// select title from book where (id = 8)

sq.from('book').extend(sq.where({ genre: 'Fantasy'})).return('id')
// select id from book where genre = $1

sq.sql`select id`.extend(sq.sql`from book`, sq.sql`where genre = ${'Fantasy'}`)
// select id from book where genre = $1

sq`author`.extend(
  sq`book``book.author_id = author.id``title`,
  sq`publisher``publisher.id = book.publisher_id``publisher`
)`author.id = 7``first_name`
// select title, publisher, first_name
// from author, book, publisher
// where (book.author_id = author.id)
// and (publisher.id = book.publisher_id)
// and (author.id = 7)
```
   * 
   */
  extend(...sq: SQ[]): this
}

interface End {
  /**
   * Closes the database connection.
   * 
   * Subsequent attempts to execute using the query builder will fail.
   */
  end(): Promise<void>
}

interface Transaction {
  /**
   * Commits the transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction
   */
  rollback(): Promise<void>;
}

interface TransactionMethods {
  /**
   * Creates a transaction
   * 
   * Pass an asynchronous callback containing queries that should be executed
   * in the context of the transaction. If an error is throw in `callback`,
   * the transaction is rolled back. Otherwise, the transaction is committed,
   * and the value returned by the callback is returned.
   * 
   * The callback's first argument `trx` must be passed to every query within
   * the transaction, or queries will not be part of the transaction.
   * 
   * @example
```js
const id = await sq.transaction(async trx => {
	const { id } = await Account.insert({ username: 'jo' }).one(trx)
	await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
 return id
})
```
   */
  transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<T>

  /**
   * Creates a transaction
   * 
   * When called without arguments, `.transaction` returns a transaction
   * object `trx`. You MUST call `trx.commit()` or `trx.rollback()`.
   * 
   * This overload is less convenient but more flexible than the callback
   * transaction method.
   * 
   * @example
```js
let trx
try {
  trx = await sq.transaction()
  const { id } = await Account.insert({ username: 'jo' }).one(trx)
  await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```
   */
  transaction(): Promise<Transaction>
}