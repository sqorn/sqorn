declare module 'sqorn' {

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

  /**
   * sqorn query builder
   */
  interface sq {

    /**
     * EXPRESS query builder - shorthand query syntax
     * 
     * First call is `.from`. Second call is `.where`. Third call is `.return`.
     * Subsequent calls ignore.
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
    (strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * EXPRESS query builder - shorthand query syntax
     * 
     * First call is `.from`. Second call is `.where`. Third call is `.return`.
     * Subsequent calls ignore.
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
    (...args: any[]): sq

    /**
     * Closes database connection
     */
    end(): Promise<void>

    /**
     * Compiles the query builder state to return the equivalent parameterized query
     * 
     * @returns {{ text: string, args: any[] }} parameterized query text and arguments
     * 
     * @example
     * sq`book`({ id: 7 })`title`.query
     * { text: 'select title from book where id = $1', args: [7] }
     * 
     * sq`book`.delete({ id: 7 })`title`.query
     * { text: 'delete from book where id = $1 returning title', args: [7] }
     */
    readonly query: { text: string, args: any[] }

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
    all(trx?: Transaction): Promise<{ [column: string]: any }[]>

    /**
     * Executes query and returns a Promise for first result row
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
    one(trx?: Transaction): Promise<{ [column: string]: any } | void>

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

    /**
     * Raw SQL - build raw SQL query
     * 
     * Accepts SQL as template string. Multiple calls to `sq.l` are joined with
     * spaces. `sq.l` cannot be mixed with other query building methods.
     * 
     * Arguments are parameterized.
     * To provide a raw unparameterized argument, prefix it with `'$'`
     * Subqueries can be embedded as arguments.
     * 
     * @example
     * sq.l`select * from book`
     * // select * from book
     * sq.l`select * from person`.l`where age = ${8}`.l`or name = ${'Jo'}`
     * // select * from person where age = 8 or name = 'Jo'
     * sq.l`select * $${'person'}`
     * // select * from person
     * sq`person`.where({ min: sq.l`age < 7` })
     * // select * from person where age < 7
     * sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
     * // select now() today, (select now() + '1 day') tomorrow
     * 
     */
    l(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * Raw SQL - build raw SQL query
     * 
     * Accepts SQL as a string. Avoid using this method to prevent SQL injection
     * because it does no parameterization. Instead, favor using `.l` as a
     * tagged template literal.
     * 
     * Multiple calls to `sq.l` are joined with spaces. `sq.l` cannot be mixed
     * with other query building methods.
     * 
     * @example
     * sq.l('select * from book')
     * // select * from book
     * sq.l('select * from person').l`where age = ${8}`
     * // select * from person where age = 8
     */
    l(sql: string): sq

    /**
     * WITH clause
     * 
     * TODO
     */
    with(strings: TemplateStringsArray, ...args: any[]): sq

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
    from(strings: TemplateStringsArray, ...args: any[]): sq

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
    from(...tables: string[]): sq

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
    where(strings: TemplateStringsArray, ...args: any[]): sq

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
    where(...conditions: { [column: string]: any }[]): sq

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
    return(strings: TemplateStringsArray, ...args: any[]): sq

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
    return(...columns: string[]): sq

    /**
     * GROUP BY clause
     * 
     * TODO
     */
    group(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * HAVING clause
     * 
     * TODO
     */
    having(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * ORDER BY clause
     * 
     * TODO
     */
    order(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * LIMIT clause
     * 
     * TODO
     */
    limit(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * OFFSET clause
     * 
     * TODO
     */
    offset(strings: TemplateStringsArray, ...args: any[]): sq

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
    insert(strings: TemplateStringsArray, ...args: any[]): sq

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
    insert(...columns: string[]): sq

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
    insert(...values: { [string]: any }[]): sq

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
    value(strings: TemplateStringsArray, ...args: any[]): sq

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
    value(...args: any[]): sq

    /**
     * SET clause
     * 
     * TODO
     */
    set(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * Extend existing queries
     * 
     * TODO
     */
    extend(...builders: sq[]): sq

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
    readonly delete: sq

    // TODO: Typescript Promise/Thenable interface
  }

  /**
   * Creates and returns a query builder with the given configuration
   * 
   * @param [config.client] - sqorn client library (sqorn-pg)
   * @param [config.connection] - connection configuration
   */
  function sqorn({
    client: any,
    connection: any
  }): sq

  export = sqorn
}

