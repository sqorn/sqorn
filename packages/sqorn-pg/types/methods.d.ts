import { SQ, SQF, SQW, SQR } from './sq'
import { or, not } from 'ip';

type Expression = string | SQ
type Row = { [key: string]: any }
type Conditions = (SQ | { [field: string]: SQ | any })[]
type Simplify<T> = {[key in keyof T]: T[key]};

export interface With {
  /**
   * WITH clause
   *
   * TODO
   */
  with(strings: TemplateStringsArray, ...args: any[]): this
}

export interface From {
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
sq.from`$${'book'}`
// select * from book
```
   */
  from(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **FROM clause** - table arguments
   *
   * A table may be:
   * * an expression
   * * an object where each key is an alias and each value may be
   *   * an expression
   *   * an array of rows
   * 
   * An expression may be a string or subquery
   * 
   * **To prevent SQL injection, never source string tables from user input.**
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
sq.from('book')
// select * from book
sq.from('book').where({ id: 8 }).set({ authorId: 7 })
// update book set author_id = $1 where id = $2
sq.delete.from('book').where({ id: 7 })
// delete from book where id = $1
sq.from('book').insert({ title: 'Moby Dick', authorId: 8 })
// insert into book (title, author_id) values ($1, $2)
sq.from(sq.l`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])
sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a
sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a
sq.from({ old: sq.from('person').where`age > 60` })
// select * from (select * from person where age > 60) as old
sq.from({ p: [{ id: 7, name: 'Jo' }, { id: 9, name: 'Mo' }] })
// select * from (values ($1, $2), ($3, $4)) as p(id, name)
sq.from({ countDown: sq.l`unnest(${[3, 2, 1]})` }).query
// select * from unnest($1) as count_down'
```
   */
  from(...tables: (Expression | { [alias: string]: Expression | Row[] })[]): this
}

interface ExpressFrom {
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
sq`$${'book'}`
// select * from book
```
   */
  (strings: TemplateStringsArray, ...args: any[]): SQW

  /**
   * **FROM clause** - table arguments - express `.from`
   * 
   * A table may be:
   * * an expression
   * * an object where each key is an alias and each value may be
   *   * an expression
   *   * an array of rows
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
sq(sq.l`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])
sq({ b: 'book' a: 'author' })
// select * from book as b, author as a
sq({ b: 'book' a: 'author' })
// select * from book as b, author as a
sq({ old: sq('person').where`age > 60` })
// select * from (select * from person where age > 60) as old
sq({ p: [{ id: 7, name: 'Jo' }, { id: 9, name: 'Mo' }] })
// select * from (values ($1, $2), ($3, $4)) as p(id, name)
sq({ countDown: sq.l`unnest(${[3, 2, 1]})` }).query
// select * from unnest($1) as count_down'
```
   */
  (...tables: (Expression | { [alias: string]: Expression | Row[] })[]): SQW
}

export interface Return {
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
sq.return('user.name', 'user.id', '33', sq.l('33'), 27, true)
// select user.name, user.id, 33, $1, $2, $3
sq.from('person').set`age = age + 1`.return('id', 'age')
// update person set age = age + 1 returning id, age
sq.delete.from('person').return('id', 'age')
// delete from person returning id, age
sq.from('person').insert({ age: 12 }).return('id', 'age')
// insert into person (age) values (12) returning id, age
const userInput = '; drop table user;'
sq.from('book').return(sq.l(userInput), 23).return(true)
// select $1, $2, $3 from book
sq.return({
  now: sq.l`now()`,
  tomorrow: sq.return`now() + '1 day'`
})
// select now() as today, (select now() + '1 day') as tomorrow
```
   */
  return(...fields: (Expression | any | { [alias: string]: Expression | any })[]): this
}

export interface ExpressReturn {
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
sq('book')()(sq.l(userInput), 23)
// select $1, $2 from book
```
   */
  (...fields: (Expression | any | { [alias: string]: Expression | any })[]):  SQ
}

export interface Where {
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
sq.from('person').where(sq.l`age >= ${18}`).set({ adult: true })
// update person set adult = $1 where (age >= ${2})
sq.delete.from('person').where({ age: 20, id: 5 }, { age: 30 })
// delete from person where (age = $1 and id = $1 or age = $2)
sq.from('person').where(sq.l`name = ${'Jo'}`, { age: 17 })
// select * from person where (name = $1 or age = $2)
sq.from('person').where({ minAge: sq.l`age < ${17}` })
// select * from person where (age = $1)
sq.from('person').where({ age: 7, gender: 'male' })
// select * from person where (age = $1 and gender = $2)
sq.from('person').where({ age: 7 }).where({ name: 'Joe' })
// select * from person where (age = $1) and name = $2
```
   */
  where(...conditions: Conditions): this
}

export interface ExpressWhere {
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
sq('person')(sq.l`age >= ${18}`).set({ adult: true })
// update person set adult = $1 where (age >= ${2})
sq.delete('person')({ age: 20, id: 5 }, { age: 30 })
// delete from person where (age = $1 and id = $1 or age = $2)
sq('person')(sq.l`name = ${'Jo'}`, { age: 17 })
// select * from person where (name = $1 or age = $2)
sq('person')({ minAge: sq.l`age < ${17}` })
// select * from person where (age = $1)
sq('person')({ age: 7, gender: 'male' })
// select * from person where (age = $1 and gender = $2)
sq('person')({ age: 7 }).where({ name: 'Joe' })
// select * from person where (age = $1) and name = $2
```
   */
  (...conditions: Conditions): SQR
}

export interface Logic {
  /**
   * **AND condition** - template string
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from`person`.where`age > 20`.and`age < 30`
// select * from person where (age > 20) and (age < 30)
sq.from`book`.left.join`author`
  .on`book.author_id = author.id`.and`author.status = 'active'`
// select * from book left join author
// on (book.author_id = author.id) and (author.status = 'active')
sq.from`book`.return`genre, avg(book.rating) as r`
  .group`genre`.having`r > 7`.and`r <= 10`
// select genre, avg(book.rating) as r from book
// group by genre having (r > 7) and (r <= 10)
```
   */
  and(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **AND condition** - query filters
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from('person').where({ age: 20 }).and({ name: 'Jo' })
// select * from person where (age > $1) and (name = $2)
sq.from('book').left.join('author')
  .on({ 'book.author_id': sq.raw('author.id') })
  .and({ 'author.status': 'active' })
// select * from book left join author
// on (book.author_id = author.id) and (author.status = $1)
sq.from('book').return('genre', 'avg(book.rating) as r')
  .group('genre').having(sq.l`r > 7`).and(sq.l`r <= 10`)
// select genre, avg(book.rating) as r from book
// group by genre having (r > 7) and (r <= 10)
```
   */
  and(...conditions: Conditions): this

  /**
   * **OR condition** - template string
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from`person`.where`age < 20`.or`age > 30`
// select * from person where (age < 20) or (age > 30)
sq.from`book`.left.join`author`
  .on`book.author_id = author.id`.or`book.editor_id = author.id`
// select * from book left join author
// on (book.author_id = author.id) or (book.editor_id = author.id)
sq.from`book`.return`genre, avg(book.rating) as r`
  .group`genre`.having`r < 2`.or`r > 8`
// select genre, avg(book.rating) as r from book
// group by genre having (r < 2) or (r > 8)
```
   */
  or(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **OR condition** - query filters
   * 
   * Condition to chain after `.where`, `.on`, or `.having`.
   * 
   * @example
```js
sq.from('person').where(sq.l`age < 20`).or(sq.l`age > 30`)
// select * from person where (age < 20) or (age > 30)
sq.from('book').left.join('author')
  .on({ 'book.author_id': sq.raw('author.id') })
  .or({ 'book.editor_id': sq.raw('author.id') })
// select * from book left join author
// on (book.author_id = author.id) or (book.editor_id = author.id)
sq.from('book').return('genre', 'avg(book.rating) as r')
  .group('genre').having(sq.l`r < 2`).or(sq.l`r > 8`)
// select genre, avg(book.rating) as r from book
// group by genre having (r < 2) or (r > 8)
```
   */
  or(...conditions: Conditions): this
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

export interface Group {
  /**
   * **GROUP BY clause** - template string
   * 
   * Multiple .group calls are joined with ', '
   */
  group(strings: TemplateStringsArray, ...args: any[]): this

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
   * Multiple .group calls are joined with ', '.
   */
  group(...args: GroupItems): this
}

export interface GroupHelpers {
  cube(...args: ExpressionItems): CubeItem
  rollup(...args: ExpressionItems): RollupItem
  groupingSets(...args: ExpressionItems): GroupingSetsItem
}


export interface Having {
  /**
   * **HAVING clause** - template string
   *
   */
  having(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **HAVING clause** - group filters
   *
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   */
  having(...conditions: Conditions): this
}

type OrderItem = {
  by: string
  sort?: 'asc' | 'desc'
  nulls?: 'first' | 'last'
} | {
  by: string
  using?: string
  nulls?: 'first' | 'last'
}

export interface Order {
  /**
   * **ORDER BY clause** - template string
   */
  order(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **ORDER BY clause** - order by items
   */
  order(...orderItems: (Expression | OrderItem)[]): this
}


export interface Limit {
  /**
   * **LIMIT clause** - template string
   * 
   * Specify the maximum number of results to return
   */
  limit(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **LIMIT clause** - limit
   *
   * Specify the maximum number of results to return
   */
  limit(limit: number | SQ): this
}


export interface Offset {
  /**
   * **OFFSET clause** - template string
   */
  offset(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **OFFSET clause** - template string
   *
   * Specify the number of results to skip before returning
   */
  offset(offset: number | SQ): this
}

export interface Joiner<T> {
  /**
   * **JOIN clause** - template string
   */
  join(strings: TemplateStringsArray, ...args: any[]): T

  /**
   * **JOIN clause** - table arguments
   */
  join(...tables: (Expression | { [alias: string]: Expression | Row[] })[]): T
}

export interface Join {
  /**
   * **JOIN clause** - template string
   */
  join(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **JOIN clause** - table arguments
   */
  join(...tables: (Expression | { [alias: string]: Expression | Row[] })[]): this

  /**
   * **INNER JOIN** - (inner) join
   */
  inner: Joiner<this>

  /**
   * **LEFT JOIN** - left (outer) join
   */
  left: Joiner<this>

  /**
   * **RIGHT JOIN** - right (outer) join
   */
  right: Joiner<this>

  /**
   * **FULL JOIN** - full (outer) join
   */
  full: Joiner<this>

  /**
   * **CROSS JOIN** - cross join
   */
  cross: Joiner<this>
  
  /**
   * **JOIN CONDITION** - template string
   *
   */
  on(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **JOIN CONDITION** - join conditions
   *
   * A condition may be:
   * * a manual subquery
   * * an object such that each value is
   *   * a manual subquery and its key is ignored
   *   * or checked for equality against its key
   */
  on(...conditions: Conditions): this

  
  /**
   * **JOIN USING** - template string
   *
   */
  using(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * **JOIN USING** - column names
   */
  using(...columns: string[]): this
}

export interface Values {
  /** TODO */
  values(): this
}


export interface Insert {
  /**
   * INSERT column - specify columns to insert using tagged template literal
   *
   * The query must also include at least one call to`.value` specifing the
   * values to insert as tagged template literals
   *
   * @example
   * sq.from`person`.insert`first_name, last_name`.value`'Jo', 'Jo'`
   * // insert into person (first_name, last_name) values ('Jo', 'Jo')
   * sq.from`person`.insert`age`.value`${23}`.value`${40}`.return`id`
   * // insert into person (age) values (23), (40) returning id
   * sq`person````id`.insert`age`.value`23`.value`40`
   * // insert into person (age) values (23), (40) returning id
   */
  insert(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * INSERT column - specify columns to insert as strings
   *
   * The query must also include at least one call to`.value` specifing the
   * values to insert as function arguments
   *
   * @example
   * sq.from('book').insert('title', 'published').value('1984', 1949)
   * // insert into book (title, published) values ('1984', 1949)
   * sq.from('person').insert('name', 'age').value('Jo', 9).value(null)
   * // insert into person (name, age) values ('Jo', 9), (null, default)
   * sq`person`()`id`.insert('age').value('23')
   * // insert into person (age) values (23), (40) returning id
   */
  insert(...columns: string[]): this

  /**
   * INSERT value - specify rows to insert as objects
   *
   * Each object passed to `.insert` represents a row to insert. Column names
   * are inferred from object keys. `null` values are converted to SQL `null`
   * while `undefined` values are converted to SQL `default`
   *
   * @example
   * sq.from`person`.insert({ firstName: 'Bob' })
   * // insert into person (first_name) values ('Bob')
   * sq.from`person`.insert({ firstName: 'Bob' }, { lastName: 'Baker' })
   * // insert into person (first_name, last_name) values ('Bob', default), (default, 'Baker')
   * sq`person`.insert({ name: 'Bob' }).insert({ name: null, age: 7 })
   * // insert into person (name, age) values ('Bob', default), (null, 7)
   * sq`person`()`id`.insert({ firstName: 'Bob' }
   * // insert into person (first_name) values ('Bob') returning id
   */
  insert(...values: { [column: string]: any }[]): this
}


export interface Set {
  /**
   * SET clause
   *
   * TODO
   */
  set(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * SET clause
   *
   * TODO
   */
  set(value: { [column: string]: any }): this
}


export interface Delete {
  /**
   * DELETE - marks the query as a delete query
   *
   * @example
   * sq.delete.from`person`
   * // delete * from person
   * sq.delete.from`person`.where`age < 7`.return`id`
   * // delete from person where age < 7 returning id
   * sq`person``age < 7``id`.delete
   * // delete from person where age < 7 returning id
   */
  readonly delete: this
}


export interface SQL {
  /**
   * Appends Raw SQL string
   *
   * Multiple calls to `.l` are joined with spaces.
   *
   * Template string arguments are automatically parameterized.
   * To provide a raw unparameterized argument, prefix it with `$`.
   * Arguments can be subQ.
   *
   * @example
   * sq.l`select * from book`
   * // select * from book
   * sq.l`select * from person`.l`where age = ${8}`.l`or name = ${'Jo'}`
   * // select * from person where age = $1 or name = $2
   * sq.l`select * $${'person'}`
   * // select * from person
   * sq`person`.where({ min: sq.l`age < 7` })
   * // select * from person where age < 7
   * sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
   * // select now() today, (select now() + '1 day') tomorrow
   *
   */
  l(strings: TemplateStringsArray, ...args: any[]): this

  /**
   * Parameterizes the given argument
   *
   * Multiple calls to `.l` are joined with spaces.
   *
   * @example
   * sq.l`select * from person where age >=`.l(20).l`and age < `.l(30)
   * // select * from person where age >= $1 and age < $2
   * sq.return({ safe: sq.l('Jo'), dangerous: 'Mo' })
   * // select $1 as safe, Mo as dangerous
   */
  l(arg: any): this
}


export interface Raw {
  /**
   * Appends a raw, unparameterized argument
   *
   * Multiple calls to `.raw` are joined with spaces.
   *
   * Alternatively prefix an argument with `$` in a call to `.l`.
   *
   * @example
   * sq.l`select * from`.raw('test_table').l`where id = ${7}`
   * // select * from test_table where id = $1
   * sq.l`select * from $${'test_table'} where id = ${7}`
   * // select * from test_table where id = $1
   */
  raw(arg: any): this
}

export interface Link {
  /**
   * Specifies the separator used to join components of a manual query
   * or clauses of a non-manual query.
   * 
   * @example
   * const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Hi' }]
   * const val = book => sq.l`(${book.id}, ${book.title})`
   * const values = sq.extend(...books.map(val)).link(', ')
   * // ($1, $2), ($3, $4)
   * 
   * sq.l`insert into book(id, title)`.l`values ${values}`.link('\n')
   * // insert into book(id, title)
   * // values ($1, $2), ($3, $4)'
   */
  link(separator: string): this
}

export interface Buildable {
  /**
   * Compiles the query builder state to return the equivalent parameterized query
   *
   * @example
   * sq`book`({ id: 7 })`title`.query
   * { text: 'select title from book where id = $1', args: [7] }
   *
   * sq`book`.delete({ id: 7 })`title`.query
   * { text: 'delete from book where id = $1 returning title', args: [7] }
   */
  readonly query: { text: string; args: any[] };
}

interface Execute extends Promise<Row[]> {
  /**
   * Executes the query and returns a Promise for an array of rows
   * 
   * To execute the query in the context of a transaction, pass
   * the transaction object `trx` as an argument.
   * 
   * @example
   * const children = await sq`person`.all()
   * // .all() is optional
   * const children = await sq`person`
   * // unless the query is part of a transaction
   * const trx = await sq.transaction()
   * await sq`person`.insert({ name: 'Jo' }).all(trx)
   */
  all(trx?: Transaction): Promise<Row[]>

  // /**
  //  * Executes the query and returns a Promise for the first row
  //  * 
  //  * If no row is returned, the Promise resolves to `undefined`.
  //  * 
  //  * Execute the query within a transaction by passing the transaction object `trx`.
  //  * 
  //  * @example
  //  * const bob = await sq`person`.where`name = 'Bob'`.return`id`.first()
  //  * if (bob) console.log(bob.id)
  //  * 
  //  */
  // first(trx?: Transaction): Promise<Row>

  // /**
  //  * Executes the query and returns a Promise for the first row
  //  * 
  //  * The Promise is rejected if no row is returned
  //  * 
  //  * Execute the query within a transaction by passing the transaction object `trx`.
  //  * 
  //  * @example
  //  * const { name } = await sq.from('person').where({ id: 1 }).return('name')
  //  * console.log(name)
  //  * 
  //  */
  // one(trx?: Transaction): Promise<Row | void>

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
   * @example
   * sq.from('book').extend(sq.where({ genre: 'Fantasy'})).return('id')
   * // select id from book where genre = $1
   * sq.l`select id`.extend(sq.l`from book`, sq.l`where genre = ${'Fantasy'}`)
   * // select id from book where genre = $1
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

interface TransactionI {
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
   * const id = await sq.transaction(async trx => {
   * 	const { id } = await Account.insert({ username: 'jo' }).one(trx)
   * 	await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
   *  return id
   * })
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
   * let trx
   * try {
   *   trx = await sq.transaction()
   *   const { id } = await Account.insert({ username: 'jo' }).one(trx)
   *   await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
   *   await trx.commit()
   * } catch (error) {
   *   await trx.rollback()
   * }
   */
  transaction(): Promise<Transaction>
}