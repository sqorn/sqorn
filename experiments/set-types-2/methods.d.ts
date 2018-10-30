import * as S from "./states";
import * as B from "./builders";

type Row = { [column: string]: any };
type Expression = string | any; // TODO
type Conditions = { [column: string]: any };
type NEArray<T> = T[] & { 0: T };
type Next<Base, Range> = B.StateToBuilder<Base & Range>
// type Next<Base, Range> = Base | Range

// type ExpressRange = S.SUDI

// export interface Express<T> {
//   /**
//    * Express From
//    *
//    * @example
//    * sq`book`
//    * // select * from book
//    * sq`book``pages > 7`
//    * // select * from book where pages > 7
//    * sq`book``pages > 7``title`
//    * // select title from book where pages > 7
//    * sq`book`({ pages: 70  })
//    * // select * from book where pages = 70
//    * sq`book`()`title`
//    * // select title from book
//    */
//   (strings: TemplateStringsArray, ...args: any[]): Next<T, ExpressRange>;

//   /**
//    * Express From
//    *
//    * @example
//    * sq('book')
//    * // select * from book
//    * sq('book')({ pages: 7 })
//    * // select * from book where pages = 7
//    * sq('book')({ pages: 7 })('title')
//    * // select title from book where pages = 7
//    * sq`book`({ pages: 70  })
//    * // select * from book where pages = 70
//    * sq`book`()`title`
//    * // select title from book
//    */
//   (...args: any[]): Next<T, ExpressRange>;
// }

type WithRange = S.SUDI;

export interface With<T> {
  /**
   * WITH clause
   *
   * TODO
   */
  with(strings: TemplateStringsArray, ...args: any[]): Next<T, WithRange>;
}

type FromRange = S.SUDI;

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

type ReturnRange = S.SUDI;

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

type WhereRange = S.SUD;

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
  where(...conditions: NEArray<Conditions>): Next<T, WhereRange>;
}

type OrderRange = S.SV;

export interface Order<T> {
  /**
   * ORDER BY clause
   *
   * TODO
   */
  order(strings: TemplateStringsArray, ...args: any[]): Next<T, OrderRange>;
}

type LimitRange = S.SV

export interface Limit<T> {
  /**
   * LIMIT clause
   *
   * TODO
   */
  limit(strings: TemplateStringsArray, ...args: any[]): Next<T, LimitRange>;
}

type OffsetRange = S.SV

export interface Offset<T> {
  /**
   * OFFSET clause
   *
   * TODO
   */
  offset(strings: TemplateStringsArray, ...args: any[]): Next<T, OffsetRange>;
}

type GroupRange = S.S

export interface Group<T> {
  /**
   * GROUP BY clause
   *
   * TODO
   */
  group(strings: TemplateStringsArray, ...args: any[]): Next<T, GroupRange>;
}

type HavingRange = S.S;

export interface Having<T> {
  /**
   * HAVING clause
   *
   * TODO
   */
  having(strings: TemplateStringsArray, ...args: any[]): Next<T, HavingRange>;
}

type ValuesRange = S.V;

export interface Values<T> {
  /** TODO */
  values(): Next<T, ValuesRange>;
}

type InsertRange = S.I;

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

type SetRange = S.U;

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

type DeleteRange = S.D;

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

type SQLRange = S.M;

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

type RawRange = S.M;

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

// Generated with /tools/extend_type_gen
export interface Extend<T0> {
extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1
>(
  q1: Q1
): Next<T0, S1>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2
>(
  q1: Q1, q2: Q2
): Next<T1, S2>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3
>(
  q1: Q1, q2: Q2, q3: Q3
): Next<T2, S3>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4
): Next<T3, S4>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5
): Next<T4, S5>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6
): Next<T5, S6>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7
): Next<T6, S7>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8
): Next<T7, S8>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9
): Next<T8, S9>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10
): Next<T9, S10>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11
): Next<T10, S11>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12
): Next<T11, S12>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13
): Next<T12, S13>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14
): Next<T13, S14>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15
): Next<T14, S15>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16
): Next<T15, S16>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17
): Next<T16, S17>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18
): Next<T17, S18>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19
): Next<T18, S19>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20
): Next<T19, S20>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21
): Next<T20, S21>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22
): Next<T21, S22>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23
): Next<T22, S23>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24
): Next<T23, S24>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25
): Next<T24, S25>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25,
  Q26, S26 extends B.BuilderToState<Q26>, T26 extends T25 & S26
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25, q26: Q26
): Next<T25, S26>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25,
  Q26, S26 extends B.BuilderToState<Q26>, T26 extends T25 & S26,
  Q27, S27 extends B.BuilderToState<Q27>, T27 extends T26 & S27
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25, q26: Q26, q27: Q27
): Next<T26, S27>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25,
  Q26, S26 extends B.BuilderToState<Q26>, T26 extends T25 & S26,
  Q27, S27 extends B.BuilderToState<Q27>, T27 extends T26 & S27,
  Q28, S28 extends B.BuilderToState<Q28>, T28 extends T27 & S28
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25, q26: Q26, q27: Q27, q28: Q28
): Next<T27, S28>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25,
  Q26, S26 extends B.BuilderToState<Q26>, T26 extends T25 & S26,
  Q27, S27 extends B.BuilderToState<Q27>, T27 extends T26 & S27,
  Q28, S28 extends B.BuilderToState<Q28>, T28 extends T27 & S28,
  Q29, S29 extends B.BuilderToState<Q29>, T29 extends T28 & S29
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25, q26: Q26, q27: Q27, q28: Q28, q29: Q29
): Next<T28, S29>

extend<
  Q1, S1 extends B.BuilderToState<Q1>, T1 extends T0 & S1,
  Q2, S2 extends B.BuilderToState<Q2>, T2 extends T1 & S2,
  Q3, S3 extends B.BuilderToState<Q3>, T3 extends T2 & S3,
  Q4, S4 extends B.BuilderToState<Q4>, T4 extends T3 & S4,
  Q5, S5 extends B.BuilderToState<Q5>, T5 extends T4 & S5,
  Q6, S6 extends B.BuilderToState<Q6>, T6 extends T5 & S6,
  Q7, S7 extends B.BuilderToState<Q7>, T7 extends T6 & S7,
  Q8, S8 extends B.BuilderToState<Q8>, T8 extends T7 & S8,
  Q9, S9 extends B.BuilderToState<Q9>, T9 extends T8 & S9,
  Q10, S10 extends B.BuilderToState<Q10>, T10 extends T9 & S10,
  Q11, S11 extends B.BuilderToState<Q11>, T11 extends T10 & S11,
  Q12, S12 extends B.BuilderToState<Q12>, T12 extends T11 & S12,
  Q13, S13 extends B.BuilderToState<Q13>, T13 extends T12 & S13,
  Q14, S14 extends B.BuilderToState<Q14>, T14 extends T13 & S14,
  Q15, S15 extends B.BuilderToState<Q15>, T15 extends T14 & S15,
  Q16, S16 extends B.BuilderToState<Q16>, T16 extends T15 & S16,
  Q17, S17 extends B.BuilderToState<Q17>, T17 extends T16 & S17,
  Q18, S18 extends B.BuilderToState<Q18>, T18 extends T17 & S18,
  Q19, S19 extends B.BuilderToState<Q19>, T19 extends T18 & S19,
  Q20, S20 extends B.BuilderToState<Q20>, T20 extends T19 & S20,
  Q21, S21 extends B.BuilderToState<Q21>, T21 extends T20 & S21,
  Q22, S22 extends B.BuilderToState<Q22>, T22 extends T21 & S22,
  Q23, S23 extends B.BuilderToState<Q23>, T23 extends T22 & S23,
  Q24, S24 extends B.BuilderToState<Q24>, T24 extends T23 & S24,
  Q25, S25 extends B.BuilderToState<Q25>, T25 extends T24 & S25,
  Q26, S26 extends B.BuilderToState<Q26>, T26 extends T25 & S26,
  Q27, S27 extends B.BuilderToState<Q27>, T27 extends T26 & S27,
  Q28, S28 extends B.BuilderToState<Q28>, T28 extends T27 & S28,
  Q29, S29 extends B.BuilderToState<Q29>, T29 extends T28 & S29,
  Q30, S30 extends B.BuilderToState<Q30>, T30 extends T29 & S30
>(
  q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
  q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
  q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
  q25: Q25, q26: Q26, q27: Q27, q28: Q28, q29: Q29, q30: Q30,
  ...queries: Q30[]
): Next<T29, S30>
}
