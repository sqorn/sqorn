import { S, U, D, I, V, M, H, X, Keys, Query, States, Except } from "./queries";
import { Transaction as Trx } from './transaction'

type Row = { [column: string]: any };
type Expression = string | any; // TODO
type Conditions = { [column: string]: any };
type NEArray<T> = T[] & { 0: T };

type NextState<
  Base extends Keys,
  Constraints extends Keys,
  Additions extends Keys
> = (Base & Constraints) | Additions | (X extends Base ? X : never);

export type Next<
  Base extends Keys,
  Constraints extends Keys,
  Additions extends Keys
> = Query<(Base & Constraints) | Additions | (X extends Base ? X : never)>;

type WithC = S | U | D | I;
type WithA = never

export interface With<T extends Keys> {
  /**
   * WITH clause
   *
   * TODO
   */
  with(strings: TemplateStringsArray, ...args: any[]): Next<T, WithC, WithA>;
}

type FromC = S | U | D | I;
type FromA = X

export interface From<T extends Keys> {
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
  from(strings: TemplateStringsArray, ...args: any[]): Next<T, FromC, FromA>;

  /**
   * FROM clause - specify query table
   *
   * Accepts subquery
   *
   * @example
   * sq.from(sq.l`unnest(array[1, 2, 3])`)
   * // select * from unnest(array[1, 2, 3])
   */
  from(builder: Expression): Next<T, FromC, FromA>;

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
  from(...tables: string[]): Next<T, FromC, FromA>;
}

type ReturnC = S | U | D | I;
type ReturnA = X;

export interface Return<T extends Keys> {
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
  return(strings: TemplateStringsArray, ...args: any[]): Next<T, ReturnC, ReturnA>;

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
  return(...columns: string[]): Next<T, ReturnC, ReturnA>;
}

type WhereC = S | U | D; 
type WhereA = never;

export interface Where<T extends Keys> {
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
  where(strings: TemplateStringsArray, ...args: any[]): Next<T, WhereC, WhereA>;

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
  where(...conditions: NEArray<Conditions>): Next<T, WhereC, WhereA>;
}

type OrderC = S | V;
type OrderA = never;

export interface Order<T extends Keys> {
  /**
   * ORDER BY clause
   *
   * TODO
   */
  order(strings: TemplateStringsArray, ...args: any[]): Next<T, OrderC, OrderA>;
}

type LimitC = S | V;
type LimitA = never;

export interface Limit<T extends Keys> {
  /**
   * LIMIT clause
   *
   * TODO
   */
  limit(strings: TemplateStringsArray, ...args: any[]): Next<T, LimitC, LimitA>;
}

type OffsetC = S | V;
type OffsetA = never;

export interface Offset<T extends Keys> {
  /**
   * OFFSET clause
   *
   * TODO
   */
  offset(strings: TemplateStringsArray, ...args: any[]): Next<T, OffsetC, OffsetA>;
}

type GroupC = S;
type GroupA = never;

export interface Group<T extends Keys> {
  /**
   * GROUP BY clause
   *
   * TODO
   */
  group(strings: TemplateStringsArray, ...args: any[]): Next<T, GroupC, GroupA>;
}

type HavingC = S;
type HavingA = never;

export interface Having<T extends Keys> {
  /**
   * HAVING clause
   *
   * TODO
   */
  having(strings: TemplateStringsArray, ...args: any[]): Next<T, HavingC, HavingA>;
}

type ValuesC = V;
type ValuesA = X;

export interface Values<T extends Keys> {
  /** TODO */
  values(): Next<T, ValuesC, ValuesA>;
}

type InsertC = I;
type InsertA = never;

export interface Insert<T extends Keys> {
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
  insert(strings: TemplateStringsArray, ...args: any[]): Next<T, InsertC, InsertA>;

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
  insert(...columns: string[]): Next<T, InsertC, InsertA>;

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
  insert(...values: { [column: string]: any }[]): Next<T, InsertC, InsertA>;
}

type SetC = U;
type SetA = never;

export interface Set<T extends Keys> {
  /**
   * SET clause
   *
   * TODO
   */
  set(strings: TemplateStringsArray, ...args: any[]): Next<T, SetC, SetA>;

  /**
   * SET clause
   *
   * TODO
   */
  set(value: { [column: string]: any }): Next<T, SetC, SetA>;
}

type DeleteC = D;
type DeleteA = never;

export interface Delete<T extends Keys> {
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
  readonly delete: Next<T, DeleteC, DeleteA>;
}

type SQLC = M;
type SQLA = X;

export interface SQL<T extends Keys> {
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
  l(strings: TemplateStringsArray, ...args: any[]): Next<T, SQLC, SQLA>;

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
  l(arg: any): Next<T, SQLC, SQLA>;
}

type RawC = M;
type RawA = X;

export interface Raw<T extends Keys> {
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
  raw(arg: any): Next<T, RawC, RawA>;
}

export interface Link<T extends Keys> {
  /**
   * Specifies the separator used to join components of a manual query
   * or clauses of a non-manual query.
   */
  link(separator: string): Query<T>;
}

export interface Buildable<T> {
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

interface Executable<T extends Keys> extends Promise<Row[]>{
  /**
   * Executes query and returns a Promise for all result rows
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
  all(trx?: Trx): Promise<Row[]>

  /**
   * Buildables query and returns a Promise for first result row
   * 
   * If there are no result rows, the Promise resolves to `undefined`.
   * Like `.all`, execute the query within a transaction by
   * passing the transaction object `trx`.
   * 
   * @example
   * const bob = await sq`person`.where`name = 'Bob'`.return`id`.one()
   * if (bob) console.log(bob.id)
   * // transaction example
   * const id = await sq.transaction(async trx => {
   * 	const { id } = await Account.insert({ username: 'jo' }).one(trx)
   * 	await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
   *  return id
   * })
   */
  one(trx?: Trx): Promise<Row | void>
}

export interface End<T> {
  /**
   * Closes database connection
   */
  end(): Promise<void>;
}

export interface Transaction<T> {
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
  transaction<U>(callback: (trx: Trx) => Promise<U>): Promise<U>;

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
  transaction(): Promise<Trx>;
}
