import * as Q from "./queries";
import { Buildable } from "./utilities";

type Row = { [column: string]: any };
type Expression = string | any; // TODO
type Conditions = { [column: string]: any };
type AtLeastOne<T> = { 0: T } & Array<T>;
type Next<Base, Range> = (Base | Range) & Buildable;

type ExpressRange = Q.Select & Q.Insert & Q.Update & Q.Delete;

export interface Express<T> {
  /**
   * Express From
   *
   * @example
   * sq`book`
   * // select * from book
   * sq`book``pages > 7`
   * // select * from book where pages > 7
   * sq`book``pages > 7``title`
   * // select title from book where pages > 7
   * sq`book`({ pages: 70  })
   * // select * from book where pages = 70
   * sq`book`()`title`
   * // select title from book
   */
  (strings: TemplateStringsArray, ...args: any[]): Next<T, ExpressRange>;

  /**
   * Express From
   *
   * @example
   * sq('book')
   * // select * from book
   * sq('book')({ pages: 7 })
   * // select * from book where pages = 7
   * sq('book')({ pages: 7 })('title')
   * // select title from book where pages = 7
   * sq`book`({ pages: 70  })
   * // select * from book where pages = 70
   * sq`book`()`title`
   * // select title from book
   */
  (...args: any[]): Next<T, ExpressRange>;
}

type WithRange = Q.Select & Q.Insert & Q.Update & Q.Delete;

export interface With<T> {
  /**
   * WITH clause
   *
   * TODO
   */
  with(strings: TemplateStringsArray, ...args: any[]): Next<T, WithRange>;
}

type FromRange = Q.Select & Q.Insert & Q.Update & Q.Delete;

export interface From<T> {
  /**
   * FROM clause - specify query table
   *
   * Accepts table as template string
   *
   * @example
   * sq.from`book`
   * // select * from book
   * sq.from`book join comment`
   * // select * from book join comment
   * sq.from`$${'book'}`
   * // select * from book
   * sq`book`
   * // select * from book
   */
  from(strings: TemplateStringsArray, ...args: any[]): Next<T, FromRange>;

  /**
   * FROM clause - specify query table
   *
   * Accepts subquery
   *
   * @example
   * sq.from(sq.l`unnest(array[1, 2, 3])`)
   * // select * from unnest(array[1, 2, 3])
   */
  from(builder: Expression): Next<T, FromRange>;

  /**
   * FROM clause - specify query table
   *
   * Accepts array of tables names
   *
   * @example
   * sq.from('book')
   * // select * from book
   * sq.from('book', 'author', 'vote')
   * // select * from book, author, vote
   */
  from(...tables: string[]): Next<T, FromRange>;
}

type ReturnRange = Q.Select & Q.Insert & Q.Update & Q.Delete;

export interface Return<T> {
  /**
   * SELECT or RETURNING clause - specify columns query returns
   *
   * Accepts columns as template string
   *
   * @example
   * sq.return`1, 2, 3`
   * // select 1, 2, 3
   * sq.from`book.`ret`title`
   * // select title from book
   * sq.delete.from`person`.return`id, age`
   * // delete from person returning id, age
   * sq.from`person`.set`age = age + 1`.return`id, age`
   * // update person set age = age + 1 returning id, age
   * sq.from`person`.insert`age`.value`${12}`.return`id, age`
   * // insert into person (age) values (12) returning id, age
   * sq`person``age > ${7}``id, age`
   * // select id, age from person where age > 7
   */
  return(strings: TemplateStringsArray, ...args: any[]): Next<T, ReturnRange>;

  /**
   * SELECT or RETURNING clause - specify columns query returns
   *
   * Accepts columns as strings
   *
   * @example
   * sq.return('1', '2', '3')
   * // select 1, 2, 3
   * sq.from('book').return('title')
   * // select title from book
   * sq.delete.from('person').return('id', 'age')
   * // delete from person returning id, age
   * sq.from('person').set`age = age + 1`.return('id', 'age')
   * // update person set age = age + 1 returning id, age
   * sq.from('person').insert('age').value(12).return('id', 'age')
   * // insert into person (age) values (12) returning id, age
   * sq`person``age > ${7}`('id', 'age')
   * // select id, age from person where age > 7
   */
  return(...columns: string[]): Next<T, ReturnRange>;
}

type WhereRange = Q.Select & Q.Update & Q.Delete;

export interface Where<T> {
  /**
   * WHERE clause - specify query filters
   *
   * Accepts WHERE conditions as template string. Multiple calls to `.where`
   * are joined with `'and'`.
   *
   * @example
   * sq.from`person`.where`age < ${18}`
   * // select * from person where age < 18
   * sq.delete.from`person`.where`age < ${7}`
   * // delete from person where age < 7
   * sq.from`person`.where`age < ${7}`.set`group = ${'infant'}`
   * // update person set group = 'infant' where age < 7
   * sq.from`person`.where`age > ${3}`.where`age < ${7}`
   * // select * from person where age > 3 and age < 7
   * sq`person``age < ${18}`
   * // select * from person where age < 18
   */
  where(strings: TemplateStringsArray, ...args: any[]): Next<T, WhereRange>;

  /**
   * WHERE clause - specify query filters
   *
   * Accepts conditions as objects. Object keys are column names tested for
   * equality against object values. Use values of type `sq` to build
   * non-equality conditions. Keys within an object are joined with `'and'`,
   * while objects are joined with `'or'`. Multiple calls to `.where` are
   * joined with `'and'`.
   *
   * @example
   * sq.from`person`.where({ age: 17 })
   * // select * from person where age = 17
   * sq.from`person`.where({ minAge: sq.l`age < ${17}` })
   * // select * from person where age = 17
   * sq.from`person`.where({ age: 7, gender: 'male' }, { name: 'Jo' })
   * // select * from person where age = 7 and gender = 'male' or name = 'Jo'
   * sq.from`person`.where({ age: 7 }).where({ name: 'Joe' })
   * // select * from person where age = 7 and name = 'Joe'
   */
  where(...conditions: AtLeastOne<Conditions>): Next<T, WhereRange>;
}

type OrderRange = Q.Select & Q.Values;

export interface Order<T> {
  /**
   * ORDER BY clause
   *
   * TODO
   */
  order(strings: TemplateStringsArray, ...args: any[]): Next<T, OrderRange>;
}

type LimitRange = Q.Select & Q.Values;

export interface Limit<T> {
  /**
   * LIMIT clause
   *
   * TODO
   */
  limit(strings: TemplateStringsArray, ...args: any[]): Next<T, LimitRange>;
}

type OffsetRange = Q.Select & Q.Values;

export interface Offset<T> {
  /**
   * OFFSET clause
   *
   * TODO
   */
  offset(strings: TemplateStringsArray, ...args: any[]): Next<T, OffsetRange>;
}

type GroupRange = Q.Select;

export interface Group<T> {
  /**
   * GROUP BY clause
   *
   * TODO
   */
  group(strings: TemplateStringsArray, ...args: any[]): Next<T, GroupRange>;
}

type HavingRange = Q.Select;

export interface Having<T> {
  /**
   * HAVING clause
   *
   * TODO
   */
  having(strings: TemplateStringsArray, ...args: any[]): Next<T, HavingRange>;
}

type ValuesRange = Q.Values;

export interface Values<T> {
  /** TODO */
  values(): Next<T, ValuesRange>;
}

type InsertRange = Q.Insert;

export interface Insert<T> {
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
  insert(strings: TemplateStringsArray, ...args: any[]): Next<T, InsertRange>;

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
  insert(...columns: string[]): Next<T, InsertRange>;

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
  insert(...values: { [column: string]: any }[]): Next<T, InsertRange>;
}

type SetRange = Q.Update;

export interface Set<T> {
  /**
   * SET clause
   *
   * TODO
   */
  set(strings: TemplateStringsArray, ...args: any[]): Next<T, SetRange>;

  /**
   * SET clause
   *
   * TODO
   */
  set(value: { [column: string]: any }): Next<T, SetRange>;
}

type DeleteRange = Q.Delete;

export interface Delete<T> {
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
  readonly delete: Next<T, DeleteRange>;
}

type SQLRange = Q.Manual;

export interface SQL<T> {
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
  l(strings: TemplateStringsArray, ...args: any[]): Next<T, SQLRange>;

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
  l(arg: any): Next<T, SQLRange>;
}

type RawRange = Q.Manual;

export interface Raw<T> {
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
  raw(arg: any): Next<T, RawRange>;
}

export interface Extend<T> {
  extend<U>(query: U): T | U;
}
