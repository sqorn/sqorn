declare module 'sqorn' {

  /**
   * The sqorn SQL query builder
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
    (...args: any[]): sq

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
    where(...conditions: { [key: string]: any }[]): sq

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

    /**
     * Compiles the query builder state to return the equivalent parameterized query
     * 
     * @param {string} query.text - parameterized SQL query
     * @param {any[]} query.args - query arguments
     * 
     * @example
     * sq`book`({ id: 7 })`title`.query
     * { text: 'select title from book where id = $1', args: [7] }
     */
    readonly query: { text: string, args: any[] }

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

    // TODO: Typescript Promise/Thenable interface
  }

  interface Config {
    pg?: any
  }

  /**
   * Creates and returns a query builder with the given configuration
   * 
   * @param {any} [config.pg] - node-postgres connection configuration
   */
  function sqorn(config?: Config): sq

  export = sqorn
}

