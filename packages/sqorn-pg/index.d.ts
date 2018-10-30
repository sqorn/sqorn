// IDEA:
// Leafs are various query types, e.g. S, V, I, U D, M
// Intermediate nodes are intersections of leafs, e.g. S & V, S & U & D
// Root is intersection of all leafs: e.g. S & V & I & U & D & M
// Each Method has a range (the set of types  it can result in) Range(Where) = S & U & D
// The domain of a method (the set of types in can be called on) is a superset of its range
// When a method is called, the new type is the current type | range type
// e.g., sq.where() is (S & V & I & U & D & M) | (S & I & U) = (S & I & U)
// e.g., sq.limit().where() is S | (S & I & U) = S
// A given leaf has all methods whose range contains the leaf
// A leaf is the set of methods with the same range

declare namespace sqorn {

  type Row = { [column: string]: any }
  type Expression = string | Buildable
  type Conditions = { [column: string]: any }
  type AtLeastOne<T> = { 0: T } & Array<T>;

  interface Transaction {
    /**
     * Commits the transaction
     * 
     * 
     */
    commit(): Promise<void>

    /**
     * Rolls back the transaction
     */
    rollback(): Promise<void>
  }

  interface Extendable<V0> {
    /**
     * Creates a new query from an existing query
     * 
     * @example
     * sq.extend(sq.l`select *`).extend(sq.l`from book`).extend(sq.l`where id = ${9}`)
     * // select * from book where id = $1
     * sq.from('book').extend(sq.where({ id: 9 }).return('title'))
     * // select title from book where id = $1
     */
    
    // extend<U extends (T extends U ? unknown : T)>(query: U): U extends T ? T : U
    extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0)
>(
  q1: U1
):
    V1;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1)
>(
  q1: U1, q2: U2
):
    V1 & V2;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2)
>(
  q1: U1, q2: U2, q3: U3
):
    V1 & V2 & V3;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2),
    U4 extends (V3 extends U4 ? unknown : V3),
    V4 extends (V3 extends U4 ? U4 : V3)
>(
  q1: U1, q2: U2, q3: U3, q4: U4
):
    V1 & V2 & V3 & V4;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2),
    U4 extends (V3 extends U4 ? unknown : V3),
    V4 extends (V3 extends U4 ? U4 : V3),
    U5 extends (V4 extends U5 ? unknown : V4),
    V5 extends (V4 extends U5 ? U5 : V4)
>(
  q1: U1, q2: U2, q3: U3, q4: U4, q5: U5
):
    V1 & V2 & V3 & V4 & V5;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2),
    U4 extends (V3 extends U4 ? unknown : V3),
    V4 extends (V3 extends U4 ? U4 : V3),
    U5 extends (V4 extends U5 ? unknown : V4),
    V5 extends (V4 extends U5 ? U5 : V4),
    U6 extends (V5 extends U6 ? unknown : V5),
    V6 extends (V5 extends U6 ? U6 : V5)
>(
  q1: U1, q2: U2, q3: U3, q4: U4, q5: U5, q6: U6
):
    V1 & V2 & V3 & V4 & V5 & V6;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2),
    U4 extends (V3 extends U4 ? unknown : V3),
    V4 extends (V3 extends U4 ? U4 : V3),
    U5 extends (V4 extends U5 ? unknown : V4),
    V5 extends (V4 extends U5 ? U5 : V4),
    U6 extends (V5 extends U6 ? unknown : V5),
    V6 extends (V5 extends U6 ? U6 : V5),
    U7 extends (V6 extends U7 ? unknown : V6),
    V7 extends (V6 extends U7 ? U7 : V6)
>(
  q1: U1, q2: U2, q3: U3, q4: U4, q5: U5, q6: U6, 
  q7: U7
):
    V1 & V2 & V3 & V4 & V5 & V6 & 
    V7;

extend<
    U1 extends (V0 extends U1 ? unknown : V0),
    V1 extends (V0 extends U1 ? U1 : V0),
    U2 extends (V1 extends U2 ? unknown : V1),
    V2 extends (V1 extends U2 ? U2 : V1),
    U3 extends (V2 extends U3 ? unknown : V2),
    V3 extends (V2 extends U3 ? U3 : V2),
    U4 extends (V3 extends U4 ? unknown : V3),
    V4 extends (V3 extends U4 ? U4 : V3),
    U5 extends (V4 extends U5 ? unknown : V4),
    V5 extends (V4 extends U5 ? U5 : V4),
    U6 extends (V5 extends U6 ? unknown : V5),
    V6 extends (V5 extends U6 ? U6 : V5),
    U7 extends (V6 extends U7 ? unknown : V6),
    V7 extends (V6 extends U7 ? U7 : V6),
    U8 extends (V7 extends U8 ? unknown : V7),
    V8 extends (V7 extends U8 ? U8 : V7)
>(
  q1: U1, q2: U2, q3: U3, q4: U4, q5: U5, q6: U6, 
  q7: U7, q8: U8,
  ...queries: U8
):
    V1 & V2 & V3 & V4 & V5 & V6 & 
    V7 & V8;
  }


  interface Util {
    /**
     * Closes database connection
     */
    end(): Promise<void>

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

  interface Buildable {
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
    readonly query: { text: string, args: any[] }
  }

  interface Executable extends Buildable, Promise<Row[]> {
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
    all(trx?: Transaction): Promise<Row[]>

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
    one(trx?: Transaction): Promise<Row | void>
  }

  interface Manual {
    /**
     * Appends Raw SQL string
     * 
     * Multiple calls to `.l` are joined with spaces.
     * 
     * Template string arguments are automatically parameterized.
     * To provide a raw unparameterized argument, prefix it with `$`.
     * Arguments can be subqueries.
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
    l(strings: TemplateStringsArray, ...args: any[]): M

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
    l(arg: any): M
  }

  interface Raw {
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
    raw(arg: any): M
  }

  interface ExpressFrom<T> {

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
    (strings: TemplateStringsArray, ...args: any[]): T

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
    (...args: any[]): T
  }

  interface ExpressWhere<T> {

    /**
     * Express Where
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
    (strings: TemplateStringsArray, ...args: any[]): T

    /**
     * EXPRESS Where
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
    (...args: any[]): T
  }

  interface ExpressReturn<T> {

    /**
     * Express Return
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
    (strings: TemplateStringsArray, ...args: any[]): T

    /**
     * ExpressReturn
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
    (...args: any[]): T
  }

  interface With<T> {
   /**
    * WITH clause
    * 
    * TODO
    */
   with(strings: TemplateStringsArray, ...args: any[]): T
  }

  interface From<T> {
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
    from(strings: TemplateStringsArray, ...args: any[]): T

    /**
     * FROM clause - specify query table
     * 
     * Accepts subquery
     * 
     * @example
     * sq.from(sq.l`unnest(array[1, 2, 3])`)
     * // select * from unnest(array[1, 2, 3])
     */
    from(builder: Expression): T

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
    from(...tables: string[]): T
  }

  interface Where<T> {
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
    where(strings: TemplateStringsArray, ...args: any[]): T

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
    where(...conditions: AtLeastOne<Conditions>): T
  }

  interface Return<T> {
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
    return(strings: TemplateStringsArray, ...args: any[]): T

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
    return(...columns: string[]): T
  }

  interface WithFromReturn<T> extends
    With<T>,
    From<T>,
    Return<T> {}

  interface WithFromWhereReturn<T> extends
    With<T>,
    From<T>,
    Where<T>,
    Return<T> {}

  interface OrderLimitOffset<T> {
    /**
     * ORDER BY clause
     * 
     * TODO
     */
    order(strings: TemplateStringsArray, ...args: any[]): T

    /**
     * LIMIT clause
     * 
     * TODO
     */
    limit(strings: TemplateStringsArray, ...args: any[]): T

    /**
     * OFFSET clause
     * 
     * TODO
     */
    offset(strings: TemplateStringsArray, ...args: any[]): T
  }

  interface Select {
    /**
     * GROUP BY clause
     * 
     * TODO
     */
    group(strings: TemplateStringsArray, ...args: any[]): S

    /**
     * HAVING clause
     * 
     * TODO
     */
    having(strings: TemplateStringsArray, ...args: any[]): S
  }

  interface Values {
    /** TODO */
    // values()
    // columns()
  }

  interface Insert {
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
    insert(strings: TemplateStringsArray, ...args: any[]): I

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
    insert(...columns: string[]): I

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
    insert(...values: { [column: string]: any }[]): I

    /**
     * VALUE - specify values to insert as tagged template literals
     * 
     * The query must also include a call to`sq.insert` specifing columns
     * 
     * @example
     * sq.from`person`.insert`first_name, last_name`.value`'Jo', 'Jo'`
     * // insert into person (first_name, last_name) values ('Jo', 'Jo')
     * sq.from`person`.insert`age`.value`${23}`.value`${40}`.return`id`
     * // insert into person (age) values (23), (40) returning id
     * sq`person````id`.insert`age`.value`23`.value`40`
     * // insert into person (age) values (23), (40) returning id
     */
    value(strings: TemplateStringsArray, ...args: any[]): I

    /**
     * VALUE - specify values to insert as function arguments
     * 
     * The query must also include a call to`sq.insert` specifing columns
     * 
     * @example
     * sq.from('book').insert('title', 'published').value('1984', 1949)
     * // insert into book (title, published) values ('1984', 1949)
     * sq.from('person').insert('name', 'age').value('Jo', 9).value(null)
     * // insert into person (name, age) values ('Jo', 9), (null, default)
     * sq`person`()`id`.insert('age').value('23')
     * // insert into person (age) values (23), (40) returning id
     */
    value(...args: any[]): I
  }

  interface Update {
    /**
     * SET clause
     * 
     * TODO
     */
    set(strings: TemplateStringsArray, ...args: any[]): U

    /**
     * SET clause
     * 
     * TODO
     */
    set(value: { [column: string]: any }): U
  }

  interface Delete {
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
    readonly delete: D
  }

  /**
   * Root builder returned by initial call to `sqorn()`.
   * The root builder has all methods except those that compile queries.
   * Use the root builder to access utility functions like `.transaction()` and `.end()`
   */
  interface RootBuilder extends
    ExpressFrom<EWSIUD>,
    Util,
    Extendable<GenericBuilder>,
    Manual,
    WithFromReturn<SIUD>,
    Where<SUD>,
    OrderLimitOffset<SV>,
    Select,
    Values,
    Insert,
    Update,
    Delete {}
  
  /**
   * `Manual`, `Select`, `Insert`, `Update`, or `Delete` Query Builder
   */
  interface GenericBuilder extends
    Extendable<GenericBuilder>,
    Executable,
    Manual,
    WithFromReturn<SIUD>,
    Where<SUD>,
    OrderLimitOffset<SV>,
    Select,
    Insert,
    Update,
    Delete {}
  
  /**
   * `Manual` Query Builder
   */
  interface M extends
    Extendable<M>,
    Executable,
    Manual {}
  
  /**
   * `Select`, `Insert`, `Update`, or `Delete` Query Builder
   */
  interface SIUD extends
    Extendable<SIUD>,
    Executable,
    WithFromReturn<SIUD>,
    Where<SUD>,
    OrderLimitOffset<SV>,
    Select,
    Insert,
    Update,
    Delete {}
  
  /**
   * `Select`, `Insert`, `Update`, or `Delete` Query Builder with `Express Where`
   */
  interface EWSIUD extends
    ExpressWhere<ERSUD>,
    SIUD {}

  /**
   * `Select`, `Update`, or `Delete` Query Builder
   */
  interface SUD extends
    Extendable<SUD>,
    Executable,
    WithFromWhereReturn<SUD>,
    OrderLimitOffset<SV>,
    Select,
    Update,
    Delete {}
  
  /**
   * `Select`, `Update`, or `Delete` Query Builder with `Express Return`
   */
  interface ERSUD extends
    ExpressReturn<SUD>,
    SUD {}
  
  /**
   * `Select` or `Values` Query Builder
   */
  interface SV extends
    Extendable<SV>,
    Executable,
    WithFromWhereReturn<S>,
    OrderLimitOffset<SV>,
    Values,
    Select {}
  
  /**
   * `Select` Query Builder
   */
  interface S extends
    Extendable<S>,
    Executable,
    WithFromWhereReturn<S>,
    OrderLimitOffset<S>,
    Select {}
  
  /**
   * `Values` Query Builder
   */
  interface V extends
    Extendable<V>,
    Executable,
    OrderLimitOffset<V>,
    Values {}
  
  /**
   * `Insert` Query Builder
   */
  interface I extends
    Extendable<I>,
    Executable,
    WithFromReturn<I>,
    Insert {}
  
  /**
   * `Update` Query Builder
   */
  interface U extends
    Extendable<U>,
    Executable,
    WithFromWhereReturn<U>,
    Update {}

  /**
   * `Delete` Query Builder
   */
  interface D extends
    Extendable<D>,
    Executable,
    WithFromWhereReturn<D>,
    Where<D>,
    Delete {}

  interface Configuration {
    /**
     * pg module - See [Node Postgres](https://node-postgres.com).
     * This argument is required to execute queries,
     * but can be skipped if you only want to build queries.
     * 
     * @example
     * const pg = require('pg')
     * const sqorn = require('sqorn-pg')
     * const pool = new pg.Pool()
     * const sq = sqorn({ pg, pool })
     */
    pg?: any
    /**
     * pg.Pool instance - See [Node Posgres](https://node-postgres.com/features/connecting).
     * This argument is required to execute queries,
     * but can be skipped if you only want to build queries.
     * If provided, you MUST also provide argument `pg`.
     * 
     * @example
     * const pg = require('pg')
     * const sqorn = require('sqorn-pg')
     * const pool = new pg.Pool()
     * const sq = sqorn({ pg, pool })
     */
    pool?: any
    /**
     * Function that maps input object keys.
     * If unspecified, the default mapping function converts keys to `snake_case`.
     * 
     * @example
     * const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })
     * 
     * sq.from({ p: 'person' }).return({ name: 'first_name' }).query
     * 
     * { text: 'select first_name as NAME from person as P',
     *   args: [] }
     * */
    mapInputKeys?: (key: string) => string
    /**
     * Function that maps output object keys.
     * If unspecified, the default mapping function converts keys to `camelCase`.
     * 
     * @example
     * const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })
     * 
     * await sq.from('person').return('first_name')
     * 
     * [{ FIRST_NAME: 'Jo'}, { FIRST_NAME: 'Mo' }]
     * */
    mapOutputKeys?: (key: string) => string
  }
}


/**
 * Creates and returns a query builder with the given configuration
 * 
 * @example
 * const pg = require('pg')
 * const sqorn = require('sqorn-pg')
 * const pool = new pg.Pool()
 * const sq = sqorn({ pg, pool })
 */
declare function sqorn(config?: sqorn.Configuration): sqorn.RootBuilder

export = sqorn
